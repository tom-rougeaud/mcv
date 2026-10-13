"""Test de bout en bout de l’appli : toutes les pages, tous les onglets, deux largeurs d’écran."""
import asyncio, json, re, sys
from playwright.async_api import async_playwright

URL = 'file://' + (sys.argv[1] if len(sys.argv) > 1 else '/home/claude/mcv-repo/2de/index.html')
SHOTS = sys.argv[2] if len(sys.argv) > 2 else None
TABS = ['lecon', 'astuces', 'resolus', 'manip', 'entrainement', 'problemes', 'evaluer', 'mots']
problems = []

def bad(msg):
    problems.append(msg); print('✗', msg)

async def overflow(page, where):
    w = await page.evaluate("() => [document.documentElement.scrollWidth, innerWidth, [...document.querySelectorAll('#main *')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.right > innerWidth + 2 && !e.closest('.tscroll,.tabs'); }).slice(0,3).map(e => e.tagName + '.' + e.className.baseVal + e.className)]")
    if w[0] > w[1] + 1:
        bad(f'{where}: défilement horizontal ({w[0]} > {w[1]}) {w[2]}')

async def run(p, vw, vh, label):
    b = await p.chromium.launch()
    ctx = await b.new_context(viewport={'width': vw, 'height': vh}, device_scale_factor=1, has_touch=vw < 600)
    page = await ctx.new_page()
    page.on('pageerror', lambda e: bad(f'{label} erreur JS : {e}'))
    page.on('console', lambda m: m.type == 'error' and bad(f'{label} console : {m.text}'))
    page.on('dialog', lambda d: asyncio.ensure_future(d.accept()))
    await page.goto(URL + '#/')
    data = await page.evaluate("JSON.parse(document.getElementById('mcv-data').textContent)")
    if SHOTS: await page.screenshot(path=f'{SHOTS}/{label}-accueil.png', full_page=True)
    await overflow(page, f'{label} accueil')
    n_items = n_q = 0
    for c in data['chapitres']:
        for t in TABS:
            await page.goto(f"{URL}#/{c['id']}/{t}")
            await page.wait_for_timeout(60)
            await overflow(page, f"{label} {c['id']}/{t}")
            if SHOTS and c['id'] in ('c1', 'c4', 'c7') and label == 'mobile':
                await page.screenshot(path=f"{SHOTS}/{label}-{c['id']}-{t}.png", full_page=False)
            if t == 'resolus':
                for rs in await page.query_selector_all('.rs'):
                    nb = len(await rs.query_selector_all('.step'))
                    for _ in range(nb):
                        btn = await rs.query_selector('[data-next]')
                        if await btn.is_enabled(): await btn.click()
                    if await rs.query_selector('.step[hidden]') or await rs.query_selector('.rs-rep[hidden]'):
                        bad(f"{c['id']} résolu : étapes non toutes affichées")
            if t == 'entrainement' and label == 'bureau':
                for card in await page.query_selector_all('.ex2'):
                    mid = await card.get_attribute('data-m')
                    # 1er passage : réponses vides ou 1er choix → la solution s’affiche
                    for li in await card.query_selector_all('.it'):
                        ch = await li.query_selector('.ch')
                        if ch: await ch.click()
                    await (await card.query_selector('[data-check]')).click()
                    for li in await card.query_selector_all('.it'):
                        n_items += 1
                        if await li.query_selector('.ch'):
                            if 'ko' in (await li.get_attribute('class')):
                                g = await li.query_selector('.ch.good')
                                if not g: bad(f"{c['id']} {mid}: QCM sans bonne réponse signalée"); continue
                                await g.click()
                        elif 'ko' in (await li.get_attribute('class')):
                            sol = await li.eval_on_selector('.sol', 'e => e.textContent')
                            sol = re.sub(r'\s*\(.*\)\s*$', '', sol)
                            await (await li.query_selector('.inp')).fill(sol)
                    await (await card.query_selector('[data-check]')).click()
                    sc = await card.eval_on_selector('.score', 'e => e.textContent')
                    a, n = sc.split(' / ')
                    if a != n:
                        kos = await card.eval_on_selector_all('.it.ko', 'els => els.map(e => e.innerText.replace(/\\s+/g," "))')
                        bad(f"{c['id']} {mid}: {sc} après saisie des solutions affichées {kos[:2]}")
                    # nouveaux nombres
                    await (await card.query_selector('[data-new]')).click()
            if t == 'manip':
                if not await page.query_selector('#wg .wg'): bad(f"{label} {c['id']} simulateur absent")
                if c['id'] == 'c8':
                    for m in ['tot', 'col', 'row']:
                        await page.click(f'[data-m="{m}"]'); await page.click('.wg-tct td[data-i="0"][data-j="0"]')
                        txt = await page.inner_text('#c8-s')
                        if m == 'col' and '75' not in txt: bad(f'c8 parmi colonne : {txt}')
                    await page.click('[data-m="eff"]'); await page.fill('.wg-tct input[data-i="0"][data-j="1"]', '75')
                    if 'Réussi' not in (await page.inner_text('#c8-d')) or not await page.is_visible('#c8-d .wg-ok'): bad('c8 défi non validé')
                if c['id'] == 'c3':
                    await page.click('[data-op="sub"]'); await page.click('[data-op="div"]')
                    if 'Solution' not in await page.inner_text('#c3-n'): bad('c3 résolution')
                if c['id'] == 'c6':
                    await page.click('[data-n="1000"]'); await page.click('[data-ech]')
                    if 'Étendue' not in await page.inner_text('#c6-fn'): bad('c6 échantillons')
                await overflow(page, f"{label} {c['id']}/manip après interaction")
            if t == 'evaluer':
                k = 0
                for x in c['eval']['exos']:
                    for q in x['qs']:
                        if q['v'] is not None:
                            val = await page.evaluate('v => MCVG.fr(v)', q['v'])
                            await page.fill(f'.evq2[data-k="{k}"] .inp', val)
                        k += 1
                await page.click('[data-ev="rendre"]')
                for bb in await page.query_selector_all('[data-self="1"]'): await bb.click()
                res = await page.inner_text('#ev-res')
                if '20 / 20' not in res.replace('\u202f', ' '): bad(f"{label} {c['id']} contrôle : {res[:80]}")
            if t == 'problemes':
                for pb in await page.query_selector_all('.pb'):
                    pid = await pb.get_attribute('data-p')
                    prob = next(x for x in c['probs'] if x['id'] == pid)
                    for qa in await pb.query_selector_all('.qa'):
                        j = int(await qa.get_attribute('data-j')); q = prob['qs'][j]
                        if q['v'] is not None:
                            n_q += 1
                            await (await qa.query_selector('[data-qv]')).click()
                            await (await qa.query_selector('[data-qv]')).click()
                            fb = await qa.eval_on_selector('.qa-fb', 'e => e.textContent')
                            if 'Réponse attendue' not in fb: bad(f"{c['id']} {pid} q{j}: pas de réponse au 2e essai")
                            val = await page.evaluate('v => MCVG.fr(v)', q['v'])
                            await (await qa.query_selector('.inp')).fill(val)
                            await (await qa.query_selector('[data-qv]')).click()
                            if 'ok' not in (await qa.get_attribute('class')): bad(f"{c['id']} {pid} q{j}: {val} refusé")
                        else:
                            await (await qa.query_selector('[data-qs]')).click()
                    for k in ('[data-pouce]', '[data-corr]', '[data-done]'):
                        e = await pb.query_selector(k)
                        if e: await e.click()
                    if await pb.query_selector('.corr2[hidden]'): bad(f'{pid}: correction non affichée')
        # automatismes
        await page.goto(f"{URL}#/auto/{c['id']}")
        for i in range(6):
            await page.wait_for_selector('.flash-q, .flash-end')
            if await page.query_selector('.flash-q form'):
                await page.fill('.flash-q .inp', '0'); await page.keyboard.press('Enter')
            elif await page.query_selector('.flash-q .ch'):
                await page.click('.flash-q .ch')
            await page.wait_for_timeout(1900)
        if not await page.query_selector('.flash-end'): bad(f"{c['id']} flash : pas d’écran de fin")
    for r in ('glossaire', 'donnees', 'a-propos', 'confidentialite'):
        await page.goto(f'{URL}#/{r}'); await page.wait_for_timeout(50); await overflow(page, f'{label} {r}')
        if SHOTS and label == 'mobile' and r in ('glossaire',): await page.screenshot(path=f'{SHOTS}/{label}-{r}.png')
    # progression mémorisée, export, taille du texte
    await page.goto(URL + '#/')
    pc = await page.eval_on_selector_all('.card-p', 'els => els.map(e => e.textContent)')
    if label == 'bureau' and all(x.startswith('0 ') for x in pc): bad('progression non enregistrée')
    await page.goto(URL + '#/donnees')
    async with page.expect_download() as dl:
        await page.click('[data-export]')
    d = await dl.value
    if d.suggested_filename != 'maths-et-mcv-2de-progression.json': bad('nom export')
    await page.click('[data-size="1.3"]')
    z = await page.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--z')")
    if z.strip() != '1.3': bad('taille du texte')
    await page.click('[data-clear]'); await page.wait_for_timeout(100)
    ks = await page.evaluate("Object.keys(localStorage).filter(k => k.startsWith('mcv2de.'))")
    if ks and any(k != 'mcv2de.v1.preferences' for k in ks): bad(f'effacement incomplet {ks}')
    print(f'{label}: {n_items} items d’entraînement vérifiés, {n_q} réponses de problèmes vérifiées')
    await b.close()

async def main():
    async with async_playwright() as p:
        await run(p, 1280, 900, 'bureau')
        await run(p, 375, 740, 'mobile')
    print('OK' if not problems else f'{len(problems)} problème(s)')

asyncio.run(main())
