/* Maths et MCV · 2de — application (aucune donnée envoyée : tout reste sur l’appareil). */
(function () {
  'use strict';
  const DATA = JSON.parse(document.getElementById('mcv-data').textContent);
  const M = window.MCVG;
  const APP = 'mcv2de', VER = 'v1', KEY = k => `${APP}.${VER}.${k}`;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const CH = DATA.chapitres, byId = Object.fromEntries(CH.map(c => [c.id, c]));

  /* ---------- stockage local, avec repli en mémoire ---------- */
  const MEM = {};
  const store = {
    get(k, d) { try { const v = localStorage.getItem(KEY(k)); return v == null ? d : JSON.parse(v); } catch (e) { return k in MEM ? MEM[k] : d; } },
    set(k, v) { MEM[k] = v; try { localStorage.setItem(KEY(k), JSON.stringify(v)); } catch (e) { /* stockage indisponible : on garde en mémoire */ } },
    clear() { Object.keys(MEM).forEach(k => delete MEM[k]); try { Object.keys(localStorage).filter(k => k.startsWith(`${APP}.`)).forEach(k => localStorage.removeItem(k)); } catch (e) { } }
  };
  const prog = () => store.get('progression', {});
  const setProg = (cid, ex, val) => { const p = prog(); p[cid] = p[cid] || {}; p[cid][ex] = Object.assign({}, p[cid][ex], val, { date: new Date().toISOString().slice(0, 10) }); store.set('progression', p); };
  const prefs = () => store.get('preferences', { texte: 1 });

  /* ---------- lecture à voix haute (voix de l’appareil, rien n’est envoyé) ---------- */
  const canSpeak = 'speechSynthesis' in window;
  function speak(text) {
    if (!canSpeak) return;
    try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text.replace(/\s+/g, ' ').replace(/×/g, ' fois ').replace(/÷/g, ' divisé par ').replace(/−/g, ' moins ')); u.lang = 'fr-FR'; u.rate = .92; const v = speechSynthesis.getVoices().find(v => /^fr/i.test(v.lang)); if (v) u.voice = v; speechSynthesis.speak(u); } catch (e) { }
  }
  const sayBtn = sel => canSpeak ? `<button class="say" data-say="${sel}" aria-label="Écouter">🔊</button>` : '';

  /* ---------- outils d’affichage ---------- */
  const chip = (t, cls = '') => `<span class="chip2 ${cls}">${t}</span>`;
  const progressOf = c => { const p = prog()[c.id] || {}; const total = c.meca.length + c.probs.length; const done = c.meca.filter(m => (p[m.id] || {}).best >= Math.ceil(m.n * .7)).length + c.probs.filter(x => (p[x.id] || {}).fait).length; return { done, total, pct: total ? Math.round(done / total * 100) : 0 }; };
  const numOf = (c, id) => { const i = c.meca.findIndex(m => m.id === id); if (i >= 0) return i + 1; const j = c.probs.findIndex(p => p.id === id); return j >= 0 ? c.meca.length + j + 1 : '?'; };
  const ETAPES = { 2: ['●●', 'Petits problèmes'], 3: ['●●●', 'Cas pratiques'], 4: ['🎓', 'Vers le bac'] };

  /* ---------- pages ---------- */
  function home() {
    return `<section class="hero">${DATA.deco ? `<div class="hero-deco" aria-hidden="true">${DATA.deco}</div>` : ''}<div class="hero-l"><span class="sigma">Σ</span></div><div><p class="kick">Mathématiques · 2de Bac Pro</p><h1>Maths et MCV</h1><p class="sub">Métiers de la relation client · commerce, vente, accueil</p></div></section>
    <p class="lead">Choisissez un chapitre : la leçon, des astuces, des exercices résolus pas à pas, un simulateur à manipuler, de l’entraînement corrigé tout de suite, des problèmes du métier, puis un contrôle blanc pour vous évaluer.</p>
    <div class="grid">${CH.map(c => { const p = progressOf(c); return `<a class="card c-${c.col}" href="#/${c.id}"><span class="card-n">${c.n}</span><span class="card-i">${c.icone}</span><span class="card-t">${esc(c.titre)}</span><span class="card-d">${esc(c.dom)}</span><span class="bar"><i style="width:${p.pct}%"></i></span><span class="card-p">${p.done} / ${p.total} exercices réussis${((prog()[c.id] || {}).ev || {}).best != null ? ` · 🎯 ${String(prog()[c.id].ev.best).replace('.', ',')}/20` : ''}</span></a>`; }).join('')}</div>
    <div class="tiles"><a class="tile" href="#/glossaire">🔤 <b>Glossaire visuel</b><span>Tous les mots, avec un schéma</span></a>${DATA.pdf ? `<a class="tile" href="${DATA.pdf}" download>📘 <b>Le manuel PDF</b><span>Tout le manuel, à imprimer ou à lire hors ligne</span></a>` : `<span class="tile" aria-disabled="true">📘 <b>Le manuel PDF</b><span>Bientôt disponible</span></span>`}<a class="tile" href="#/donnees">💾 <b>Mes données</b><span>Exporter, importer, effacer</span></a></div>`;
  }
  const TABS = [['lecon', '📘 Leçon'], ['astuces', '🛠️ Astuces'], ['resolus', '🧭 Résolus'], ['manip', '🎛️ Manipuler'], ['entrainement', '✏️ S’entraîner'], ['problemes', '🏪 Problèmes'], ['evaluer', '🎯 S’évaluer'], ['mots', '🔤 Mots']];
  const pdfOf = c => DATA.pdfch ? DATA.pdfch.replace('{n}', c.n) : '';
  function chapter(c, tab) {
    tab = TABS.some(t => t[0] === tab) ? tab : 'lecon';
    const head = `<section class="chead2 c-${c.col}"><a class="back" href="#/">← Chapitres</a><p class="ck">Chapitre ${c.n} · ${esc(c.dom)}</p><h1>${c.icone} ${esc(c.titre)}</h1><p>${c.intro}</p><p class="mt2"><span class="mt2-k">💼 Au travail</span>${c.metier.roles.map(r => `<span class="mt2-r">${r}</span>`).join('')}<span class="mt2-t">${c.metier.txt}</span></p><p class="hbtns"><a class="btn auto" href="#/auto/${c.id}">⚡ Questions flash</a>${pdfOf(c) ? `<a class="btn ghost" href="${pdfOf(c)}" download>📄 PDF du chapitre</a>` : ''}<a class="btn ghost" href="#/${c.id}/evaluer">🎯 Contrôle blanc</a></p></section>
      <nav class="tabs c-${c.col}" role="tablist">${TABS.map(([k, l]) => `<a role="tab" href="#/${c.id}/${k}" class="${k === tab ? 'on' : ''}" aria-selected="${k === tab}">${l}</a>`).join('')}</nav>`;
    let body = '';
    if (tab === 'lecon') body = `<ul class="objs">${c.obj.map(o => `<li>🎯 ${o}</li>`).join('')}</ul>` + c.lecons.map((l, i) => `<article class="lc c-${c.col}" id="lc${i + 1}"><div class="lc-h"><span class="lc-n">${i + 1}</span>${l.titre}${sayBtn('#lc' + (i + 1))}</div><div class="lc-g${l.ill ? ' withill' : ''}"><div class="lc-r"><span class="lc-t">Je retiens</span>${l.rule}</div><div class="lc-e"><span class="lc-t2">Exemple</span>${l.ex}</div>${l.ill ? `<div class="lc-i">${l.ill}</div>` : ''}</div>${l.wide || ''}${l.att ? `<div class="att">⚠️ ${l.att}</div>` : ''}</article>`).join('') + `<article class="mk c-${c.col}"><div class="lc-h"><span class="lc-n">🔤</span>Les mots à connaître</div><table class="tbl mkt">${c.mots.map(r => `<tr><td class="mk-w">${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</table></article>`;
    if (tab === 'astuces') body = `<div class="ast"><div class="ast-g">${c.astuces.map(g => `<div class="ast-b ast-${g.k}"><div class="ast-t">${g.ic} ${g.t}</div>${g.items.map(i => `<p>${i}</p>`).join('')}</div>`).join('')}</div></div>`;
    if (tab === 'resolus') body = c.resolus.map((r, i) => `<article class="rs c-${c.col}" data-rs="${i}"><div class="rs-h"><span class="rs-k">Exercice résolu ${i + 1}</span><span class="rs-t">${r.titre}</span></div><div class="rs-en" id="rs${i}">${r.enonce}${sayBtn('#rs' + i)}</div><table class="rs-t2"><tr><th>Ce que j’écris</th><th>Pourquoi je le fais</th></tr>${r.rows.map((x, j) => `<tr class="step" ${j ? 'hidden' : ''}><td class="rs-w"><span class="rs-s">${j + 1}</span><span>${x[0]}</span></td><td class="rs-x">${x[1]}</td></tr>`).join('')}</table><div class="rs-act"><button class="btn" data-next="${i}">Étape suivante ▶</button><button class="btn ghost" data-all="${i}">Tout afficher</button></div><p class="rs-rep" hidden>✅ ${r.rep}</p><p class="rs-go">➜ À vous : ${r.go.map(g => `<a href="#/${c.id}/${g[0] === 'm' ? 'entrainement' : 'problemes'}?ex=${g}">exercice ${numOf(c, g)}</a>`).join(' et ')}</p></article>`).join('');
    if (tab === 'entrainement') body = `<p class="hint">De petits calculs pour maîtriser la leçon. Les nombres changent à chaque essai : <b>🔄 Nouveaux nombres</b>.</p>` + c.meca.map((m, i) => mecaCard(c, m, i)).join('');
    if (tab === 'problemes') { let last = 0; body = c.probs.map((p, i) => { const h = p.etape !== last ? `<h2 class="etape">${ETAPES[p.etape][0]} ${ETAPES[p.etape][1]}</h2>` : ''; last = p.etape; return h + probCard(c, p, c.meca.length + i + 1); }).join(''); }
    if (tab === 'mots') body = `<div class="words">${c.words.map(w => wordCard(w, c)).join('')}</div>`;
    if (tab === 'manip') body = `<div id="wg" class="c-${c.col}"></div>`;
    if (tab === 'evaluer') body = evalView(c);
    return head + `<div class="tabbody">${body}</div>` + `<nav class="chnav">${c.n > 1 ? `<a href="#/c${c.n - 1}">← Chapitre ${c.n - 1}</a>` : '<span></span>'}${c.n < CH.length ? `<a href="#/c${c.n + 1}">Chapitre ${c.n + 1} →</a>` : ''}</nav>`;
  }
  const wordCard = (w, c) => `<article class="wcard c-${c.col}"><div class="w-ill">${w.pic}</div><h3>${w.mot}${w.abr ? ` <span class="sym">${w.abr}</span>` : ''}</h3><p>${w.def}</p>${w.formule ? `<p class="w-f">${w.formule}</p>` : ''}${w.sens ? `<p class="w-s">↔️ ${w.sens}</p>` : ''}<p class="w-p">« ${w.phrase} »</p></article>`;

  /* ---------- entraînement : générateurs ---------- */
  const SEEDS = {};
  function items(c, m) { const k = c.id + m.id; if (!SEEDS[k]) SEEDS[k] = Math.floor(Math.random() * 1e9); const gs = Array.isArray(m.gen) ? m.gen : [m.gen]; return Array.from({ length: m.n }, (_, i) => M.make(gs[i % gs.length], SEEDS[k] + i * 7919)); }
  function mecaCard(c, m, i) {
    const its = items(c, m), best = ((prog()[c.id] || {})[m.id] || {}).best;
    return `<article class="ex2 c-${c.col}" id="ex-${m.id}" data-c="${c.id}" data-m="${m.id}"><div class="ex-h"><span class="num2">${i + 1}</span><span class="ex-t">${m.titre}</span><span class="lcref">leçon ${m.lc}</span>${best != null ? `<span class="best">★ ${best}/${m.n}</span>` : ''}</div><p class="cons">${m.consigne}</p>
      <ol class="its">${its.map((it, j) => `<li class="it" data-j="${j}"><span class="it-q">${it.q}</span>${it.choices ? `<span class="chs">${it.choices.map((ch, k) => `<button class="ch" data-k="${k}">${ch}</button>`).join('')}</span>` : `<input class="inp" inputmode="decimal" autocomplete="off" aria-label="Réponse ${j + 1}">`}<span class="itfb" aria-live="polite"></span></li>`).join('')}</ol>
      <div class="ex-act"><button class="btn" data-check>Vérifier</button><button class="btn ghost" data-new>🔄 Nouveaux nombres</button><span class="score"></span></div></article>`;
  }
  function checkMeca(card) {
    const c = byId[card.dataset.c], m = c.meca.find(x => x.id === card.dataset.m), its = items(c, m); let ok = 0;
    $$('.it', card).forEach((li, j) => { const it = its[j], fb = $('.itfb', li); let good;
      if (it.choices) { const sel = $('.ch.sel', li); good = sel && +sel.dataset.k === it.ok; $$('.ch', li).forEach(b => b.classList.toggle('good', +b.dataset.k === it.ok && !!sel)); }
      else good = M.check(it, $('.inp', li).value);
      li.classList.toggle('ok', !!good); li.classList.toggle('ko', !good);
      fb.innerHTML = good ? '✅' : `❌ <span class="sol">${it.a}</span>`; if (good) ok++; });
    $('.score', card).textContent = `${ok} / ${m.n}`;
    const prev = ((prog()[c.id] || {})[m.id] || {}).best || 0; if (ok > prev || prev === 0) setProg(c.id, m.id, { best: Math.max(ok, prev) });
  }

  /* ---------- problèmes ---------- */
  function probCard(c, p, num) {
    const st = (prog()[c.id] || {})[p.id] || {};
    return `<article class="pb c-${c.col}${p.cls === 'bac' ? ' bac' : ''}" id="ex-${p.id}" data-c="${c.id}" data-p="${p.id}"><div class="ex-h"><span class="num2">${num}</span><span class="ex-t">${p.titre}</span>${p.lc ? `<span class="lcref">leçon ${p.lc}</span>` : ''}${st.fait ? '<span class="best">✓ fait</span>' : ''}${sayBtn('#st-' + p.id)}</div>
      ${p.cls === 'bac' ? '<p class="bacline">🎓 Comme à l’examen : consignes à l’infinitif.</p>' : ''}<div class="stmt" id="st-${p.id}">${p.intro}</div>
      <div class="ans2">${p.seq.map(s => s.x != null ? `<div class="qx">${s.x}</div>` : qaBlock(p.qs[s.q], s.q)).join('')}${p.outro ? `<div class="qx">${p.outro}</div>` : ''}
      <div class="ex-act">${p.pouce ? `<button class="btn ghost" data-pouce>💡 Coup de pouce</button>` : ''}<button class="btn ghost" data-corr>✔️ Correction complète</button><button class="btn" data-done>J’ai terminé</button></div><p class="pouce2" hidden>💡 ${p.pouce || ''}</p><p class="corr2" hidden>✔️ ${p.corr}</p></div></article>`;
  }

  const qaBlock = (q, j) => `<div class="qa" data-j="${j}"><p class="qa-q"><b>${q.l}</b> ${q.t}</p>${q.v != null ? `<div class="qa-r">${q.lab ? `<span class="qa-l">${q.lab}</span>` : ''}<input class="inp" inputmode="decimal" autocomplete="off" aria-label="Réponse ${esc(q.l)}" placeholder="ma réponse"><button class="btn sm" data-qv>Vérifier</button></div>` : `<div class="qa-r"><textarea class="inp txt" rows="2" aria-label="Réponse rédigée ${esc(q.l)}" placeholder="J’écris ma réponse ici"></textarea><button class="btn sm ghost" data-qs>Comparer</button></div>`}<p class="qa-fb" aria-live="polite"></p></div>`;

  /* ---------- s’évaluer : contrôle blanc noté sur 20 ---------- */
  const CPS = { app: 'S’approprier', ana: 'Analyser-raisonner', rea: 'Réaliser', val: 'Valider', com: 'Communiquer' }, ORD = ['app', 'ana', 'rea', 'val', 'com'];
  const pts = p => `${fr2(p)} pt${p > 1 ? 's' : ''}`, fr2 = x => String(Math.round(x * 100) / 100).replace('.', ',');
  let EV = null;
  function evalView(c) {
    const e = c.eval, per = {}; let k = 0; e.exos.forEach(x => x.qs.forEach(q => { per[q.comp] = (per[q.comp] || 0) + q.pts; }));
    const best = ((prog()[c.id] || {}).ev || {}).best;
    EV = { c, got: {}, done: false, t0: null };
    return `<section class="evh2 c-${c.col}"><p class="evk">🎯 Contrôle blanc · noté sur 20</p><h2>${esc(c.titre)}</h2><p>${e.lieu} · durée conseillée : ${e.duree}</p><div class="evcomp">${ORD.filter(o => per[o]).map(o => `<span class="cp2 cp-${o}">${CPS[o]} · ${pts(per[o])}</span>`).join('')}</div><p class="evbar"><span id="ev-timer">⏱️ 00:00</span>${best != null ? `<span class="best">★ meilleur score : ${fr2(best)} / 20</span>` : ''}</p></section>`
      + e.exos.map((x, i) => `<article class="evx2 c-${c.col}"><div class="ex-h"><span class="num2">${i + 1}</span><span class="ex-t">${x.t}</span><span class="lcref">${pts(x.qs.reduce((a, b) => a + b.pts, 0))}</span></div>${x.intro ? `<div class="stmt">${x.intro}</div>` : ''}${x.qs.map(q => { const id = k++; return `<div class="qa evq2" data-k="${id}"><p class="qa-q"><b>${id + 1}.</b> ${q.t} <span class="cp2 cp-${q.comp}">${CPS[q.comp]}</span> <span class="evpts">${pts(q.pts)}</span></p><div class="qa-r">${q.v != null ? `${q.lab ? `<span class="qa-l">${q.lab}</span>` : ''}<input class="inp" inputmode="decimal" autocomplete="off" aria-label="Réponse ${id + 1}" placeholder="ma réponse">` : `<textarea class="inp txt" rows="2" aria-label="Réponse rédigée ${id + 1}" placeholder="J’écris ma réponse"></textarea>`}</div><div class="evfb" aria-live="polite"></div></div>`; }).join('')}</article>`).join('')
      + `<div class="ex-act evact"><button class="btn" data-ev="rendre">📝 Rendre ma copie</button><button class="btn ghost" data-ev="again" hidden>🔄 Recommencer</button></div><section class="evres" id="ev-res" hidden></section>`;
  }
  const evQs = () => EV.c.eval.exos.flatMap(x => x.qs);
  function evScore() {
    const qs = evQs(), per = {}, got = {}; let tot = 0, pending = 0;
    qs.forEach((q, k) => { per[q.comp] = per[q.comp] || [0, 0]; per[q.comp][1] += q.pts; const g = EV.got[k]; if (g == null) { pending++; return; } per[q.comp][0] += g; tot += g; });
    const box = $('#ev-res'); box.hidden = false;
    box.innerHTML = `<h3>${pending ? 'Note provisoire' : 'Ma note'} : <b class="big3">${fr2(tot)} / 20</b></h3>${pending ? `<p class="small">Encore ${pending} réponse${pending > 1 ? 's' : ''} rédigée${pending > 1 ? 's' : ''} à auto-évaluer : comparez avec la réponse attendue, puis cliquez sur votre niveau.</p>` : ''}<div class="evgrid">${ORD.filter(o => per[o]).map(o => { const [a, b] = per[o], r = b ? a / b : 0, lv = r >= .85 ? 'Très bon' : r >= .6 ? 'Satisfaisant' : r >= .35 ? 'Fragile' : 'Insuffisant'; return `<div><span class="cp2 cp-${o}">${CPS[o]}</span><span class="evm"><i style="width:${Math.round(r * 100)}%"></i></span><b>${fr2(a)} / ${fr2(b)}</b><em>${lv}</em></div>`; }).join('')}</div>`;
    if (!pending) { const p = prog(), cur = ((p[EV.c.id] || {}).ev || {}).best; if (cur == null || tot > cur) setProg(EV.c.id, 'ev', { best: tot }); }
  }
  function evRendre() {
    if (EV.done) return; EV.done = true; clearInterval(EV.tm);
    evQs().forEach((q, k) => { const qa = $(`.evq2[data-k="${k}"]`), fb = $('.evfb', qa);
      if (q.v != null) { const ok = M.check({ v: q.v, tol: q.tol }, $('.inp', qa).value); EV.got[k] = ok ? q.pts : 0; qa.classList.add(ok ? 'ok' : 'ko'); fb.innerHTML = ok ? `✅ +${pts(q.pts)}` : `❌ 0 pt · réponse attendue : <b>${q.a}</b>`; }
      else fb.innerHTML = `<p>💬 Réponse attendue : ${q.a}</p><p class="selfev">Je me note : <button class="btn sm" data-self="1" data-k="${k}">Réussi · ${pts(q.pts)}</button><button class="btn sm ghost" data-self=".5" data-k="${k}">En partie · ${pts(q.pts / 2)}</button><button class="btn sm ghost" data-self="0" data-k="${k}">Pas réussi · 0</button></p>`; });
    $$('.evq2 .inp').forEach(i => i.disabled = true); $('[data-ev="rendre"]').hidden = true; $('[data-ev="again"]').hidden = false; evScore(); $('#ev-res').scrollIntoView({ block: 'nearest' });
  }

  /* ---------- automatismes ---------- */
  let AUTO = null;
  function auto(c) {
    AUTO = { c, its: c.auto.map(g => M.make(g, Math.floor(Math.random() * 1e9))), i: 0, ok: 0, t0: Date.now() };
    return `<section class="chead2 c-${c.col}"><a class="back" href="#/${c.id}">← ${esc(c.titre)}</a><p class="ck">Automatismes · chapitre ${c.n}</p><h1>⚡ Questions flash</h1><p>6 questions, calcul mental. Répondez puis validez avec Entrée.</p></section><div id="flash"></div>`;
  }
  function flashStep() {
    const box = $('#flash'); if (!box || !AUTO) return;
    if (AUTO.i >= AUTO.its.length) { const s = Math.round((Date.now() - AUTO.t0) / 1000); box.innerHTML = `<div class="flash-end"><p class="big">${AUTO.ok} / ${AUTO.its.length}</p><p>en ${s} secondes</p><button class="btn" data-replay>Rejouer</button> <a class="btn ghost" href="#/${AUTO.c.id}">Retour au chapitre</a></div>`; const b = store.get('flash', {}); b[AUTO.c.id] = Math.max(b[AUTO.c.id] || 0, AUTO.ok); store.set('flash', b); return; }
    const it = AUTO.its[AUTO.i];
    box.innerHTML = `<div class="flash-q c-${AUTO.c.col}"><p class="fq-n">Question ${AUTO.i + 1} / ${AUTO.its.length}</p><p class="fq">${it.q}</p>${it.choices ? `<div class="chs big">${it.choices.map((ch, k) => `<button class="ch" data-fk="${k}">${ch}</button>`).join('')}</div>` : `<form data-flash><input class="inp big" inputmode="decimal" autocomplete="off" aria-label="Réponse" autofocus><button class="btn">Valider</button></form>`}<p class="fb2"></p></div>`;
    const inp = $('.inp', box); if (inp) setTimeout(() => inp.focus(), 50);
  }
  function flashAnswer(good) { const it = AUTO.its[AUTO.i]; if (good) AUTO.ok++; $('.fb2').innerHTML = good ? '✅ Bravo !' : `❌ Réponse : <b>${it.a}</b>`; AUTO.i++; setTimeout(flashStep, good ? 700 : 1800); }

  /* ---------- glossaire, données, à propos ---------- */
  const glossaire = () => `<section class="chead2 c-brand"><a class="back" href="#/">← Accueil</a><h1>🔤 Glossaire visuel</h1><p>Les mots de chaque chapitre, avec un schéma, une définition et une phrase pour les réutiliser.</p></section>` + CH.map(c => `<h2 class="etape">${c.icone} Chapitre ${c.n} · ${esc(c.titre)}</h2><div class="words">${c.words.map(w => wordCard(w, c)).join('')}</div>`).join('');
  const donnees = () => `<section class="chead2 c-brand"><a class="back" href="#/">← Accueil</a><h1>💾 Mes données</h1><p>Votre progression reste sur cet appareil. Vous pouvez la sauvegarder dans un fichier, la recharger ailleurs ou l’effacer.</p></section>
    <div class="panel"><p><button class="btn" data-export>⬇️ Exporter ma progression</button></p><p><label class="btn ghost">⬆️ Importer un fichier<input type="file" accept="application/json" data-import hidden></label></p><p><button class="btn danger" data-clear>🗑️ Effacer ma progression</button></p><p class="small">Format : fichier JSON « maths-et-mcv-2de-progression ». Rien n’est envoyé sur Internet.</p></div>
    <div class="panel"><h3>Taille du texte</h3><p><button class="btn ghost" data-size="1">Normale</button> <button class="btn ghost" data-size="1.15">Grande</button> <button class="btn ghost" data-size="1.3">Très grande</button></p></div>`;
  const apropos = () => `<section class="chead2 c-brand"><a class="back" href="#/">← Accueil</a><h1>À propos</h1></section><div class="panel prose"><p><b>Maths et MCV · 2de</b> accompagne le manuel du même nom pour les élèves de seconde professionnelle « Métiers de la relation client » (commerce, vente, accueil).</p><p>Il suit le programme de mathématiques de seconde professionnelle (BO spécial n° 5 du 11 avril 2019), y compris le module « Calculs commerciaux et financiers ». Les automatismes, l’algorithmique et le vocabulaire de logique sont travaillés dans les chapitres.</p><p>Chaque chapitre propose : une leçon courte (formules mises en forme avec KaTeX), des astuces, des exercices résolus pas à pas, un simulateur à manipuler, de l’entraînement corrigé (les nombres changent à chaque essai), des problèmes du métier, un sujet « vers le bac » et un contrôle blanc noté sur 20 avec barème et compétences. Chaque chapitre se télécharge aussi en PDF.</p><p>Le chapitre 8, « Croisement de deux variables », prolonge la statistique (organiser des données, tableaux à double entrée, tableur) et prépare la classe de première.</p><p><b>Sources des données réelles</b> : Insee (indice des prix à la consommation, janvier 2026) ; economie.gouv.fr (taux de TVA, janvier 2026) ; DGCCRF et Code de la consommation, art. L112-1-1 (annonces de réduction) ; service-public.fr (mentions des factures). Les entreprises citées sont fictives.</p><p><b>Auteur</b> : Tom Rougeaud, professeur de mathématiques-sciences, académie de Dijon. Contenu et application sous licence <b>CC BY-NC 4.0</b> : réutilisation libre, sans usage commercial, en citant l’auteur.</p><p class="small">Version ${DATA.version}. Le site interactif du programme complet reste disponible : <a href="../">Maths et MCV, tout le programme</a>.</p></div>`;
  const confid = () => `<section class="chead2 c-brand"><a class="back" href="#/">← Accueil</a><h1>Confidentialité</h1></section><div class="panel prose"><p><b>Aucune donnée personnelle n’est collectée.</b> Pas de compte, pas de cookie, pas de traceur, pas de publicité, pas de police ou de script chargé depuis un autre site.</p><p>Votre progression (scores d’entraînement, exercices terminés, meilleure note aux contrôles blancs, taille du texte) est enregistrée uniquement dans la mémoire de votre navigateur (stockage local), sous des clés commençant par « mcv2de.v1. ». Elle ne quitte jamais votre appareil.</p><p>La lecture à voix haute utilise la voix installée sur votre appareil ; selon le système, elle peut fonctionner sans connexion.</p><p>Vous pouvez à tout moment exporter ou effacer ces données depuis la page <a href="#/donnees">Mes données</a>. Effacer les données du site dans votre navigateur produit le même effet.</p></div>`;

  /* ---------- routeur ---------- */
  function render() {
    const h = location.hash.replace(/^#\/?/, ''), [path, query] = h.split('?'), parts = path.split('/').filter(Boolean);
    let html; AUTO = null; if (EV && EV.tm) clearInterval(EV.tm); EV = null;
    if (!parts.length) html = home();
    else if (byId[parts[0]]) html = chapter(byId[parts[0]], parts[1]);
    else if (parts[0] === 'auto' && byId[parts[1]]) html = auto(byId[parts[1]]);
    else if (parts[0] === 'glossaire') html = glossaire();
    else if (parts[0] === 'donnees') html = donnees();
    else if (parts[0] === 'a-propos') html = apropos();
    else if (parts[0] === 'confidentialite') html = confid();
    else html = home();
    $('#main').innerHTML = html; if (canSpeak) speechSynthesis.cancel();
    $$('#main table').forEach(t => { if (!t.closest('.tscroll, .rs, .tk, .sh')) { const w = document.createElement('div'); w.className = 'tscroll'; t.replaceWith(w); w.appendChild(t); } });
    if (AUTO) flashStep();
    const wg = $('#wg'); if (wg && window.MCVW && window.MCVW[parts[0]]) { try { window.MCVW[parts[0]](wg); } catch (err) { wg.innerHTML = '<p>Ce simulateur n’a pas pu démarrer sur cet appareil.</p>'; console.error(err); } }
    const ex = query && new URLSearchParams(query).get('ex'); if (ex && $('#ex-' + ex)) { $('#ex-' + ex).scrollIntoView({ block: 'start' }); $('#ex-' + ex).classList.add('flashy'); } else window.scrollTo(0, 0);
    document.title = (parts[0] && byId[parts[0]] ? byId[parts[0]].titre + ' · ' : '') + 'Maths et MCV · 2de';
  }

  /* ---------- événements ---------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('button, [data-say]'); if (!t) return;
    if (t.dataset.say) { const el = $(t.dataset.say); if (el) { const cl = el.cloneNode(true); cl.querySelectorAll('.kx').forEach(k => k.replaceWith(' ' + (k.dataset.t || '') + ' ')); cl.querySelectorAll('.say').forEach(b => b.remove()); speak(cl.textContent); } return; }
    const card = t.closest('.ex2');
    if (t.classList.contains('ch') && t.dataset.k != null) { $$('.ch', t.parentNode).forEach(b => b.classList.remove('sel', 'good')); t.classList.add('sel'); return; }
    if (t.dataset.fk != null) { flashAnswer(+t.dataset.fk === AUTO.its[AUTO.i].ok); return; }
    if (t.hasAttribute('data-check') && card) { checkMeca(card); return; }
    if (t.hasAttribute('data-new') && card) { const c = byId[card.dataset.c], m = c.meca.find(x => x.id === card.dataset.m); SEEDS[c.id + m.id] = Math.floor(Math.random() * 1e9); card.outerHTML = mecaCard(c, m, c.meca.indexOf(m)); return; }
    if (t.dataset.next != null) { const rs = t.closest('.rs'), hid = $$('.step[hidden]', rs); if (hid[0]) hid[0].hidden = false; if (hid.length <= 1) { $('.rs-rep', rs).hidden = false; t.disabled = true; } return; }
    if (t.dataset.all != null) { const rs = t.closest('.rs'); $$('.step', rs).forEach(s => s.hidden = false); $('.rs-rep', rs).hidden = false; $('[data-next]', rs).disabled = true; return; }
    const pb = t.closest('.pb');
    if (pb) { const c = byId[pb.dataset.c], p = c.probs.find(x => x.id === pb.dataset.p);
      if (t.hasAttribute('data-qv')) { const qa = t.closest('.qa'), q = p.qs[+qa.dataset.j], fb = $('.qa-fb', qa), n = (+qa.dataset.n || 0) + 1; qa.dataset.n = n; const good = M.check({ v: q.v, tol: q.tol }, $('.inp', qa).value); qa.classList.toggle('ok', good); fb.innerHTML = good ? `✅ Juste : ${q.a}` : n >= 2 ? `❌ Réponse attendue : <b>${q.a}</b>` : '❌ Pas encore : relisez les données surlignées et réessayez.'; return; }
      if (t.hasAttribute('data-qs')) { const qa = t.closest('.qa'); $('.qa-fb', qa).innerHTML = `💬 Une réponse possible : ${q2(p, qa)}`; return; }
      if (t.hasAttribute('data-pouce')) { $('.pouce2', pb).hidden = false; return; }
      if (t.hasAttribute('data-corr')) { $('.corr2', pb).hidden = false; return; }
      if (t.hasAttribute('data-done')) { setProg(c.id, p.id, { fait: true }); t.textContent = '✓ Terminé'; t.disabled = true; return; } }
    if (t.dataset.ev === 'rendre') { evRendre(); return; }
    if (t.dataset.ev === 'again') { render(); return; }
    if (t.dataset.self != null && EV) { const k = +t.dataset.k, q = evQs()[k]; EV.got[k] = q.pts * +t.dataset.self; $$(`[data-self][data-k="${k}"]`).forEach(b => b.classList.toggle('ghost', b !== t)); evScore(); return; }
    if (t.hasAttribute('data-replay')) { render(); return; }
    if (t.hasAttribute('data-export')) { const blob = new Blob([JSON.stringify({ app: APP, version: VER, date: new Date().toISOString(), progression: prog(), flash: store.get('flash', {}), preferences: prefs() }, null, 1)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'maths-et-mcv-2de-progression.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); return; }
    if (t.hasAttribute('data-clear')) { if (confirm('Effacer toute votre progression sur cet appareil ?')) { store.clear(); applyPrefs(); render(); } return; }
    if (t.dataset.size) { store.set('preferences', Object.assign(prefs(), { texte: +t.dataset.size })); applyPrefs(); return; }
  });
  const q2 = (p, qa) => p.qs[+qa.dataset.j].a;
  document.addEventListener('input', e => { if (EV && !EV.t0 && e.target.closest('.evq2')) { EV.t0 = Date.now(); EV.tm = setInterval(() => { const el = $('#ev-timer'); if (!el || !EV) return; const s2 = Math.floor((Date.now() - EV.t0) / 1000); el.textContent = `⏱️ ${String(Math.floor(s2 / 60)).padStart(2, '0')}:${String(s2 % 60).padStart(2, '0')}`; }, 1000); } });
  document.addEventListener('submit', e => { if (e.target.matches('[data-flash]')) { e.preventDefault(); const it = AUTO.its[AUTO.i]; flashAnswer(M.check(it, $('.inp', e.target).value)); } });
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('.ex2 .inp')) { e.preventDefault(); const nx = e.target.closest('li').nextElementSibling; if (nx && $('.inp', nx)) $('.inp', nx).focus(); else checkMeca(e.target.closest('.ex2')); } if (e.key === 'Enter' && e.target.matches('.qa .inp')) { e.preventDefault(); $('[data-qv]', e.target.closest('.qa')).click(); } });
  document.addEventListener('change', e => { if (e.target.matches('[data-import]')) { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { const d = JSON.parse(r.result); if (d.app !== APP) throw new Error('fichier d’une autre appli'); store.set('progression', d.progression || {}); store.set('flash', d.flash || {}); if (d.preferences) store.set('preferences', d.preferences); applyPrefs(); alert('Progression importée.'); render(); } catch (err) { alert('Fichier non reconnu : ' + err.message); } }; r.readAsText(f); } });
  function applyPrefs() { document.documentElement.style.setProperty('--z', prefs().texte || 1); }
  window.addEventListener('hashchange', render);
  applyPrefs(); render();
})();
