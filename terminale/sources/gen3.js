/* Construit le manuel « Maths et MCV · Tle », version 3 (HTML à paginer), version élève et version professeur.
   Usage : node gen3.js → build/eleve.html, build/prof.html, build/log.json */
'use strict';
const fs = require('fs'), path = require('path');
const { esc, bl, opt, lines, cp } = require('./lib/util');
const { cover } = require('./lib/cover2');
const TEX = require('./lib/tex');
const { SC } = require('./lib/scenesT'); const { CP } = require('./lib/scenes');
const { S, T, Rc, Ar } = require('./lib/visu');
const HERE = __dirname, B = path.join(HERE, 'build');
fs.mkdirSync(B, { recursive: true });

const { MCVT } = require('./shared/train.js');
const AUTO = require('./shared/autoT.js');
const QR = JSON.parse(fs.readFileSync(path.join(HERE, 'lib', 'qr.json'), 'utf8'));
const ERR = [];
const chk = (ok, msg) => { if (!ok) ERR.push(msg); };
const DATA = require('./contentT')(chk);
if (ERR.length) { console.error('Contrôles de calcul en échec :', ERR); process.exit(1); }
const seedOf = s => { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const L = 'abcdefghijklmnop';
const CPS = { app: 'S’approprier', ana: 'Analyser-raisonner', rea: 'Réaliser', val: 'Valider', com: 'Communiquer' };
const ORD = ['app', 'ana', 'rea', 'val', 'com'];
const ptsTxt = p => `${String(p).replace('.', ',')} pt${p > 1 ? 's' : ''}`;
const AST = { vite: ['⚡', 'Calculer vite'], og: ['🎯', 'Estimer'], sens: ['💡', 'Donner du sens'], verif: ['✅', 'Vérifier'] };
/* case vide d’un exercice résolu à compléter : ⟦réponse⟧ */
const trou = h => h.replace(/⟦([^⟧]+)⟧/g, (m, a) => `<span class="bl tr3" style="width:${Math.max(14, Math.min(46, a.replace(/<[^>]+>/g, '').length * 2.4 + 6))}mm" data-a="${esc(a)}"></span>`);
const trouTxt = h => h.replace(/⟦([^⟧]+)⟧/g, '<b>$1</b>');
const qcmOpts = it => `<span class="opts">${it.qcm.choices.map((c, j) => opt(c, j === it.qcm.ok)).join('')}</span>`;

/* ---------- « De la 1re à la terminale » ---------- */
const pontBox = c => `<div class="blk pont3 c-${c.col}"><div class="pont3-h">🔗 De la 1re à la terminale : ce qui reste, ce qui change</div><div class="pont3-g"><div class="pont3-a"><span class="pont3-k">En 1re, tu as appris</span><ul>${c.pont.de.map(x => `<li><b class="pont3-n">ch. ${x.n}</b> <i>${esc(x.titre)}</i> : ${x.sais}</li>`).join('')}</ul><p class="pont3-ex"><b>Exemple de 1re</b> · ${c.pont.ex2}</p></div><div class="pont3-b"><span class="pont3-k">En terminale, la même situation va plus loin</span><p class="pont3-ex">${c.pont.ex1}</p></div></div><div class="pont3-g3"><div><span class="pont3-k">✅ Ce qui reste</span><ul>${c.pont.reste.map(x => `<li>${x}</li>`).join('')}</ul></div><div><span class="pont3-k">➕ Ce qui change</span><ul>${c.pont.change.map(x => `<li>${x}</li>`).join('')}</ul></div><div><span class="pont3-k">💼 À quoi ça sert</span><p>${c.pont.pourquoi}</p></div></div></div>`;
/* ---------- un chapitre ---------- */
function chapter(c) {
  const col = c.col, R = id => `<b data-numof="${c.id}-${id}">·</b>`;
  const fixed = [], ex = [], key = [], rep = [];
  /* 1. ouverture « Au travail » */
  fixed.push(`<div class="blk op3 c-${col}"><div class="op3-h"><div><div class="ch-k">Chapitre ${c.n} · ${esc(c.dom)}</div><h2 class="fit">${c.titre}</h2><div class="op3-sous">${esc(c.sous)}</div></div><div class="qrbox">${QR[c.id].svg}<span>Ce chapitre<br>dans l’appli</span></div></div>
    <div class="op3-sc">${SC[c.id]()}</div>
    <div class="op3-q"><span class="op3-k">💼 Au travail</span><span class="mt-r">${c.metier.roles.map(r => `<span>${r}</span>`).join('')}</span><p>${c.travail.question}</p></div>
    <div class="op3-o"><b>Le plan du chapitre</b><div class="plan3">${c.parties.map((p, k) => `<div class="plan3-p${p.n.some(j => c.notions[j - 1].hp) ? ' hp' : ''}"><span class="plan3-l">${'ABCDE'[k]}</span><div><b>${p.t}</b><span>${p.n.map(j => `${j}. ${c.notions[j - 1].titre}`).join(' · ')}</span></div></div>`).join('')}</div><b>Dans ce chapitre</b><ul>${c.objectifs.map(o => `<li>${o}</li>`).join('')}</ul></div></div>`);
  fixed.push(pontBox(c));
  /* zone « Automatismes » : 5 questions flash, sans calculatrice */
  const au = AUTO.gen(c.id, seedOf(c.id + '-auto'));
  fixed.push(`<div class="blk auto3 c-${col}" data-sec="${c.id}-auto"><div class="auto3-h"><span class="ic">⚡</span>Automatismes<span class="sec-sub">5 minutes · sans calculatrice · automatismes de terminale, prérequis du chapitre et un intérêt simple</span></div><ol class="auto3-q">${au.map(q => `<li><span>${q.t}</span>${q.choices ? `<span class="opts">${q.choices.map((x, j) => opt(x, j === q.ok)).join('')}</span>` : bl(26, q.a)}</li>`).join('')}</ol></div>`);
  key.push({ k: 'auto', html: `<b>Automatismes</b> — ${au.map((q, i) => `${i + 1}. ${q.a}`).join(' ; ')}.` });
  /* 2. point de départ : un document du métier, 5 questions */
  const dp = MCVT.dep(c.depart, seedOf(c.id + '-dep'));
  fixed.push(`<div class="blk dep3 c-${col}" data-sec="${c.id}-dep"><div class="dep3-h"><span class="ic">🚀</span>Point de départ<span class="sec-sub">un document du métier · 5 questions · sans calculatrice</span></div><div class="dep3-g"><div class="dep3-doc"><div class="dep3-t">${dp.titre}</div>${dp.doc}</div><ol class="dep3-q">${dp.qs.map(q => `<li><span class="dq-t">${q.t}</span>${q.kind === 'qcm' ? `<span class="opts">${q.choices.map((x, j) => opt(x, j === q.ok)).join('')}</span>` : bl(24, q.a)}</li>`).join('')}</ol></div></div>`);
  key.push({ k: 'dep', html: `<b>Point de départ</b> — ${dp.qs.map((q, i) => `${i + 1}. ${q.a}`).join(' ; ')}.` });
  /* 3. la leçon : chaque notion en six temps */
  fixed.push(`<div class="blk sec-h kwn" data-sec="${c.id}-cours"><span class="ic">📘</span>La leçon<span class="sec-sub">je découvre, je comprends, je vois, je retiens</span></div>`);
  c.notions.forEach((nt, i) => {
    const a = AST[nt.astuce.k];
    fixed.push(`<div class="blk nt3 kwn c-${col}"><div class="nt3-k">Partie ${'ABCDE'[c.parties.findIndex(p => p.n.includes(i + 1))]} · ${c.parties.find(p => p.n.includes(i + 1)).t}${nt.hp ? ` <span class="hp3">➕ Pour aller plus loin · ${nt.hp}</span>` : ''}</div><div class="nt3-h"><span class="lc-n">${i + 1}</span>${nt.titre}</div><div class="nt3-g"><div class="nt3-d"><span class="t3">🔎 Je découvre</span><p>${nt.decouvre.txt}</p><div class="nt3-img">${nt.decouvre.img}</div></div><div class="nt3-c"><span class="t3">💬 Je comprends</span>${nt.comprends}</div></div></div>`);
    fixed.push(`<div class="blk nt3v c-${col}"><span class="t3">👀 Je vois</span>${nt.vois}<p class="nt3-leg">${nt.voisLeg}</p></div>`);
    fixed.push(`<div class="blk nt3r c-${col}"><div class="nt3-rg"><div class="lc-r"><span class="lc-t">📌 Je retiens</span>${nt.retiens}</div><div class="lc-e"><span class="lc-t2">Exemple</span>${nt.exemple}</div></div>${nt.wide || ''}<div class="nt3-ag"><div class="att">⚠️ <b>Attention</b> · ${nt.attention}</div><div class="ast3 ast-${nt.astuce.k}">${a[0]} <b>${a[1]}</b> · ${nt.astuce.t}</div></div></div>`);
  });
  fixed.push(`<div class="blk mk3 c-${col}"><div class="lc-h"><span class="lc-n">🔤</span>Les mots à connaître</div><table class="tbl mkt3"><tr><th>Le mot</th><th>Ce qu’il veut dire</th><th>Au travail</th></tr>${c.mots.map(r => `<tr><td class="mk-w">${r[0]}</td><td>${r[1]}</td><td class="mk-x">« ${r[2]} »</td></tr>`).join('')}</table></div>`);
  /* 4. méthodes : un résolu complet, un résolu à compléter */
  fixed.push(`<div class="blk sec-h kwn" data-sec="${c.id}-meth"><span class="ic">🧭</span>Méthodes<span class="sec-sub">un exercice résolu, puis le même à compléter</span></div>`);
  c.resolus.forEach((r, i) => {
    const td = r.trous ? trou : (x => x);
    fixed.push(`<div class="blk rs${r.trous ? ' rs2' : ''} c-${col}"><div class="rs-h"><span class="rs-k">${r.trous ? '✍️ À toi' : 'Exercice résolu'}</span><span class="rs-t">${r.titre}</span>${r.outil ? `<span class="outil">${r.outil}</span>` : ''}</div><div class="rs-en">${r.enonce}${r.doc ? `<div class="rs-doc">${r.doc}</div>` : ''}</div><table class="rs-t2"><tr><th>Ce que j’écris</th><th>Pourquoi je le fais</th></tr>${r.rows.map((x, j) => `<tr><td class="rs-w"><span class="rs-s">${j + 1}</span><span>${td(x[0])}</span></td><td class="rs-x">${x[1]}</td></tr>`).join('')}</table><p class="rs-ver">🔁 <b>Je vérifie</b> · ${r.verif}</p><p class="rs-rep">✅ ${r.trous ? `<span class="prof-only inl">${r.rep}</span><span class="el-only">Ma réponse : ${bl(90)}</span>` : r.rep}</p><p class="rs-go">➜ Je m’entraîne : exercice${r.go.length > 1 ? 's' : ''} ${r.go.map(R).join(' et ')}</p></div>`);
    if (r.trous) key.push({ k: 'r2', html: `<b>À toi (méthodes)</b> — ${r.rows.map(x => trouTxt(x[0])).join(' ; ')}. ${r.rep}` });
  });
  /* 5. je m’entraîne : 3 exercices à support visuel (tirage fixe ; d’autres nombres dans l’appli) */
  ex.push(`<div class="blk ex palh palh3 kwn keep" data-stage="1" data-sec="${c.id}-x"><span class="ph-i">✏️</span><b>Je m’entraîne</b><span>Un support à compléter, des cases lettrées. Réponses p. <span data-pageof="rep-${c.id}">…</span> ; d’autres nombres dans l’appli.</span></div>`);
  c.entraine.forEach(e => {
    const g = MCVT.tr(e.gen, seedOf(c.id + '-' + e.id)), eid = c.id + '-' + e.id;
    const outside = g.items.filter(it => !g.support.includes(`data-k="${it.k}"`) && !g.support.includes(`class="sbk">${it.k}<`));
    const extra = outside.length ? `<div class="tr-q">${outside.map(it => `<div class="tr-qi"><span class="mg-l">${it.k}.</span>${it.qcm ? qcmOpts(it) : bl(30, it.a)}</div>`).join('')}</div>` : '';
    ex.push(`<div class="blk ex tr3 c-${col}" data-eid="${eid}" data-stage="1"><div class="exh"><span class="num">·</span><span class="ext">${g.titre}</span><span class="cps"><span class="lcref">notion ${e.lc}</span></span></div><div class="exb"><p class="tr-c">${g.consigne}</p><div class="tr-s">${g.support}</div>${extra}</div></div>`);
    rep.push({ eid, titre: g.titre, txt: g.items.map(it => `${it.k}. ${it.a}`).join(' ; ') });
  });
  /* 6. je résous : 3 problèmes (dont un défi et un sujet « vers le bac ») */
  ex.push(`<div class="blk ex palh palh3 kwn keep" data-stage="2"><span class="ph-i">🧩</span><b>Je résous</b><span>Des situations du métier. Je lis tout l’énoncé, je surligne les données, je dis ce que je cherche.</span></div>`);
  const ET = { 2: 'Petit problème', 3: 'Cas pratique', 4: 'Vers le bac' };
  c.probs.forEach(p => {
    const eid = c.id + '-' + p.id;
    if (p.bulle) ex.push(`<div class="blk ex bulle kwn keep c-${col}" data-stage="${p.etape}"><span class="bl-i">💬</span><p>${p.bulle}</p></div>`);
    const badge = p.defi ? `<span class="defi">Défi · ${p.defi} étapes</span>` : `<span class="et3b">${ET[p.etape]}</span>`;
    const autr = p.autravail ? `<div class="autr"><span class="cp cp-${p.autravail.comp}">${CPS[p.autravail.comp]}</span><span>💼 <b>Au travail, cela sert à</b> ${p.autravail.txt}</span></div>` : '';
    const pouce = p.pouce ? `<div class="pouce-inv"><span>💡 Coup de pouce · exercice <b data-numof="${eid}">·</b> : ${p.pouce}</span></div>` : '';
    ex.push(`<div class="blk ex pb3${p.cls ? ' ' + p.cls : ''} c-${col}" data-eid="${eid}" data-stage="${p.etape}"><div class="exh"><span class="num">·</span>${badge}<span class="ext">${p.titre}</span><span class="cps">${p.lc ? `<span class="lcref">notion ${Math.min(p.lc, c.notions.length)}</span>` : ''}${(p.comps || []).map(cp).join('')}</span></div><div class="exb">${p.body}</div>${autr}${pouce}</div>`);
    key.push({ eid, titre: p.titre, html: p.corr });
  });
  /* 7. je sais faire */
  ex.push(`<div class="blk ex sais3 keep c-${col}" data-stage="9"><div class="exh"><span class="ext">✅ Je sais faire</span></div><div class="exb"><p class="small">Je coche quand je sais faire seul. L’appli coche aussi cette liste au fil des réussites.</p><table class="tbl bilan"><tr><th>Je sais…</th><th>Exercices</th><th>Oui</th><th>Presque</th><th>Pas encore</th></tr>${c.bilan.map(([t, es]) => `<tr><td class="tl">${t.replace(/^Je sais /, '')}</td><td>${es.map(R).join(', ')}</td><td><span class="box"></span></td><td><span class="box"></span></td><td><span class="box"></span></td></tr>`).join('')}</table></div></div>`);
  /* 8. s’évaluer */
  const e = c.eval; let k = 0;
  const per = {}; e.exos.forEach(x => x.qs.forEach(q => { per[q.comp] = (per[q.comp] || 0) + q.pts; }));
  const nApp = e.exos.reduce((a, x) => a + x.qs.filter(q => q.appel).length, 0); let ka = 0;
  const evh = `<div class="blk evh c-${col}"><div class="evh-t"><span class="evh-k">🎯 S’évaluer au format CCF · situation d’évaluation</span><h2>${c.titre}</h2><p>${e.lieu} · durée : ${e.duree} · calculatrice et outils numériques autorisés</p></div><div class="evh-n"><span>Nom</span><i></i><span>Date</span><i></i><b>… / 10</b></div><p class="evccf">Comme au CCF : ${e.exos.length > 1 ? e.exos.length + ' exercices' : 'un exercice'} dont les questions vont de plus en plus loin, et ${nApp > 1 ? nApp + ' appels' : 'un appel'} 📞 : tu appelles le professeur pour lui montrer ton travail sur un outil numérique (tableur, GeoGebra, calculatrice, Python).</p>
<table class="tbl evg evg3"><tr><th>Compétence</th><th>Ce que je sais faire</th><th>Points</th><th>Insuffisant</th><th>Fragile</th><th>Satisfaisant</th><th>Très bon</th></tr>${ORD.filter(o => per[o]).map(o => `<tr><td class="tl"><span class="cp cp-${o}">${CPS[o]}</span></td><td class="tl gp">${e.grille[o]}</td><td>${ptsTxt(per[o])}</td><td><span class="box"></span></td><td><span class="box"></span></td><td><span class="box"></span></td><td><span class="box"></span></td></tr>`).join('')}</table></div>`;
  const evx = e.exos.map((x, i) => `<div class="blk evx kwn c-${col}"><div class="evx-h"><span class="evx-n">Exercice ${i + 1}</span><span class="evx-t">${x.t}</span><span class="evx-p">${ptsTxt(x.qs.reduce((a, b) => a + b.pts, 0))}</span></div>${x.intro || ''}</div>` + x.qs.map(q => { k++; return `<div class="blk evq c-${col}"><div class="evq-h"><span class="evq-n">${k}</span><span class="evq-t">${q.t}</span><span class="cp cp-${q.comp}">${CPS[q.comp]}</span><span class="evq-p">${ptsTxt(q.pts)}</span></div>${q.lines ? lines(q.lines, q.a) : `<p class="ans"><span>${q.lab || ''}</span>${bl(q.w || 40, q.a)}</p>`}${q.appel ? `<div class="appel3">📞 <b>Appel n° ${++ka}</b> · Appelle le professeur. ${q.appel}</div>` : ''}</div>`; }).join(''));
  key.push({ k: 'ev', html: `<b>🎯 S’évaluer (p. <span data-pageof="${c.id}-ev">…</span>)</b> — ` + e.exos.map((x, i) => `<b>Ex. ${i + 1}</b> ` + x.qs.map(q => `${q.a} <i>(${ptsTxt(q.pts)}${q.appel ? ', appel 📞' : ''})</i>`).join(' ; ')).join(' · ') });
  return { c, fixed, ex, ev: evh + evx.join(''), key, rep };
}
const CH = DATA.map(chapter);

/* ---------- pages d’ouverture ---------- */
const QV = s => ({ vb: s.match(/viewBox="([^"]+)"/)[1], body: s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') });
const pCover = `<div class="page cover2"><div class="cvfull">${cover({ qr: QV(QR.home.svg) })}</div></div>`;
/* le schéma du chapitre */
const STEPS = [['💼', 'Au travail', 'une scène du métier|et une question'], ['🚀', 'Point de départ', '5 automatismes|puis un document'], ['📘', 'La leçon', 'chaque notion|en 6 temps'], ['🧭', 'Méthodes', 'un résolu, puis|un à compléter'], ['✏️', 'Je m’entraîne', 'des supports|à compléter'], ['🧩', 'Je résous', 'des situations|du métier'], ['🎯', 'S’évaluer', 'au format CCF|45 min, sur 10']];
const flow = S(600, 250, STEPS.map(([ic, t, s], i) => { const x = 10 + (i % 4) * 150, y = i < 4 ? 20 : 140, w = 130; return Rc(x, y, w, 86, { c: i === 2 ? 'k' : 'k2', rx: 14 }) + `<text x="${x + w / 2}" y="${y + 30}" font-size="22" text-anchor="middle">${ic}</text>` + T(x + w / 2, y + 50, t, { fs: 14, c: i === 2 ? 'tw' : 'tx' }) + s.split('|').map((l, j) => T(x + w / 2, y + 68 + j * 12, l, { fs: 10, c: i === 2 ? 'tw' : 'ts', w: 600 })).join('') + (i < 3 ? Ar(x + w + 2, y + 43, x + w + 18, y + 43, { w: 2.4, h: 8 }) : '') + (i >= 4 && i < 6 ? Ar(x + w + 2, y + 43, x + w + 18, y + 43, { w: 2.4, h: 8 }) : ''); }).join('') + `<path d="M535 106 C 560 125, 90 112, 75 134" fill="none" class="ks" stroke-width="2.4" stroke-dasharray="6 4"/><path d="M75 138 l-6 -10 h12 z" class="k"/>` + T(527, 196, 'La leçon en 6 temps :', { fs: 12, c: 'kt', a: 'middle' }) + T(527, 214, 'je découvre · je comprends', { fs: 10.5, w: 600 }) + T(527, 229, 'je vois · je retiens', { fs: 10.5, w: 600 }) + T(527, 244, 'exemple · attention', { fs: 10.5, w: 600 }), 'Le déroulé d’un chapitre');
const pGuide = `<div class="page c-nombre" data-recto="0"><div class="inner" data-sec="guide">
  <h1 class="pg-t">Ton manuel : comment ça marche ?</h1>
  <p class="pg-p">Chaque chapitre suit toujours le même chemin. On part d’une situation du métier, on comprend, puis on s’entraîne et on résout.</p>
  <div class="flow3">${flow}</div>
  <h2 class="pg-s">Ma routine de lecture, en 3 étapes</h2>
  <div class="rout3"><div><span class="gn">1</span><b>Je lis tout</b><span>Je lis l’énoncé une fois en entier, sans calculer. Je regarde les documents.</span></div><div><span class="gn">2</span><b>Je surligne</b><span>Je repère les données utiles (elles sont souvent <mark class="hl">surlignées</mark>) et ce qu’on me demande.</span></div><div><span class="gn">3</span><b>Je dis ce que je cherche</b><span>Avec mes mots : « Je cherche le prix d’un paquet ». Puis je choisis la méthode.</span></div></div>
  <h2 class="pg-s">Les repères</h2>
  <div class="rep3"><div><span class="defi">Défi · 4 étapes</span><span>Un exercice plus long, annoncé avec son nombre d’étapes. Une bulle 💬 t’aide à démarrer.</span></div><div><span class="pouce-mini">💡 ∀</span><span>Les <b>coups de pouce</b> sont en bas de page, écrits à l’envers : tourne le manuel pour les lire.</span></div><div><span class="et3b">Réponses</span><span>Les réponses de « Je m’entraîne » sont en fin de manuel, pour vérifier seul.</span></div><div><span class="cp cp-val">Valider</span><span>Chaque exercice indique les compétences qu’il fait travailler (pages suivantes).</span></div></div>
  <h2 class="pg-s">L’appli qui va avec</h2>
  <div class="qrhow"><div class="qrbox big">${QR.home.svg}<span>Maths et MCV · Tle</span></div><div><p class="pg-p">Sur téléphone ou ordinateur, sans compte : la leçon animée, les méthodes pas à pas, l’entraînement corrigé tout de suite avec de nouveaux nombres à chaque essai, les problèmes, les évaluations au format CCF et les 3 sujets de CCF chronométrés.</p><p class="pg-p small">tom-rougeaud.github.io/mcv/terminale · Rien n’est envoyé sur Internet : la progression reste sur l’appareil.</p></div></div>
  <div class="owner"><span>Ce manuel appartient à</span><i></i><span>Classe</span><i></i></div>
  <p class="pg-p small lic">© Tom Rougeaud · Manuel et appli sous licence <b>CC BY-NC 4.0</b> : tu peux les partager et les adapter, sans usage commercial, en citant l’auteur.</p>
</div><div class="foot"></div></div>`;
/* les compétences, expliquées par le métier (double page) */
const COMPS = [
  ['app', 'Lire un document et trouver l’information utile.', 'Repérer sur un bon de commande la quantité et le prix unitaire HT.', 'Je lis les titres d’un tableau avant de lire un nombre.'],
  ['ana', 'Choisir la bonne méthode, comparer des options.', 'Choisir entre deux transporteurs selon le poids du colis.', 'Je me demande : « Quel calcul répond à la question ? »'],
  ['rea', 'Faire le calcul juste, utiliser le bon outil.', 'Calculer le prix soldé avant d’étiqueter le rayon.', 'Je pose le calcul, j’écris l’unité, j’arrondis comme demandé.'],
  ['val', 'Vérifier que le résultat est possible.', 'Contrôler un ticket avant de l’encaisser : une remise ne peut pas augmenter le prix.', 'J’estime l’ordre de grandeur ou je fais le calcul inverse.'],
  ['com', 'Expliquer à un client ou rendre compte à son tuteur.', 'Dire au client combien il économise, écrire trois lignes au manager.', 'Je réponds par une phrase complète, avec le résultat et l’unité.']];
const compCard = ([k, geste, metier, manuel]) => `<div class="cpc cpc-${k}"><div class="cpc-i">${CP[k]()}</div><div><span class="cp cp-${k}">${CPS[k]}</span><p class="cpc-g">${geste}</p><p class="cpc-m">💼 <b>Au travail</b> · ${metier}</p><p class="cpc-x">✏️ <b>Dans le manuel</b> · ${manuel}</p></div></div>`;
const pComp1 = `<div class="page c-algo"><div class="inner" data-sec="competences">
  <h1 class="pg-t">Les 5 compétences, au travail</h1>
  <p class="pg-p">Au bac, on évalue cinq compétences. Ce sont aussi des gestes que tu feras chaque jour en magasin, à l’accueil ou au service client.</p>
  ${COMPS.map(compCard).join('')}
</div><div class="foot"></div></div>`;
const pComp2 = `<div class="page c-algo"><div class="inner">
  <h2 class="pg-s">Les consignes</h2>
  <table class="tbl cons2"><tr><th>Dans le manuel</th><th>Au bac</th><th>Ce qu’on attend</th></tr>
  <tr><td>Calcule</td><td>Calculer</td><td>un résultat chiffré, avec son unité</td></tr>
  <tr><td>Détermine</td><td>Déterminer</td><td>un résultat, par le calcul ou par lecture</td></tr>
  <tr><td>Justifie</td><td>Justifier</td><td>une raison : un calcul, une propriété, un document</td></tr>
  <tr><td>Vérifie</td><td>Vérifier</td><td>un contrôle qui confirme le résultat</td></tr>
  <tr><td>Rédige</td><td>Rédiger</td><td>des phrases complètes qui répondent à la question</td></tr></table>
  <h2 class="pg-s">Mes outils</h2>
  <div class="guide-g"><div class="gd"><span class="gi">🧮</span><div><b>Calculatrice collège</b><span>Pour les calculs, les puissances (touche ^ ou xʸ), la touche log et les fractions.</span></div></div><div class="gd"><span class="gi">📊</span><div><b>Excel</b><span>Suites avec =B2*1,05 et =SOMME, tableaux d’amortissement, courbes de tendance (exponentielle, polynomiale), =COEFFICIENT.DETERMINATION et =LOG10.</span></div></div><div class="gd"><span class="gi">📈</span><div><b>GeoGebra</b><span>Tracer une fonction cube ou exponentielle, lire des solutions, ajuster un nuage de points avec le tableur de GeoGebra.</span></div></div><div class="gd"><span class="gi">🐍</span><div><b>Python</b><span>Un éditeur en ligne ou celui de ta classe, pour les petits programmes des encadrés « Je programme ».</span></div></div></div>
  <p class="pg-p small">Les prix s’arrondissent au centime. Les taux s’arrondissent comme le demande l’énoncé, souvent au dixième. Les entreprises, les prix et les enquêtes des exercices sont fictifs et signalés comme tels : ils sont construits pour que les calculs tombent juste.</p>
</div><div class="foot"></div></div>`;
const pToc = `<div class="page" data-recto="0"><div class="inner" data-sec="sommaire">
  <h1 class="pg-t">Sommaire</h1>
  <div class="toc2"><div class="tc2 ann"><span class="tn2">🔗</span><div><b>De la 1re à la terminale</b><span>Ce que chaque chapitre reprend de la 1re, et ce qu’il approfondit</span></div><span class="tp2"><span data-pageof="pont">…</span></span></div>${DATA.map(c => `<div class="tc2 c-${c.col}"><span class="tn2">${c.n}</span><div><b>${esc(c.titre)}</b><span>${c.parties.map((p, k) => `${'ABCDE'[k]}. ${p.t}`).join(' · ')}</span></div><span class="tp2"><span data-pageof="${c.id}">…</span></span></div>`).join('')}
  <div class="tc2 ann"><span class="tn2">🎓</span><div><b>Trois sujets de CCF</b><span>45 min, sur 10, avec appel : programmes de 1re et de terminale</span></div><span class="tp2"><span data-pageof="ccf">…</span></span></div><div class="tc2 ann"><span class="tn2">✔️</span><div><b>Réponses de « Je m’entraîne »</b><span>Pour vérifier seul, chapitre par chapitre</span></div><span class="tp2"><span data-pageof="rep">…</span></span></div><div class="tc2 ann"><span class="tn2">🔤</span><div><b>Glossaire visuel</b><span>Les mots de chaque chapitre, avec un schéma</span></div><span class="tp2"><span data-pageof="glo">…</span></span></div></div>
  <p class="pg-p small" style="margin-top:4mm">Programme de mathématiques de terminale professionnelle (BO spécial n° 1 du 6 février 2020), avec le module « Calculs commerciaux et financiers » des spécialités sans physique-chimie.</p>
</div><div class="foot"></div></div>`;

/* ---------- « De la 1re à la terminale » : vue d’ensemble (élève et professeur) ---------- */
const pontSec = `<section class="sec" data-key="pont" data-recto="0" data-run="De la 1re à la terminale" data-col="brand"><div class="blk chead kwn c-brand"><div class="ch-txt"><div class="ch-k">Avant de commencer</div><h2>🔗 De la 1re à la terminale</h2><p>Chaque chapitre de terminale part de ce que tu as appris en 1re, puis va plus loin. Avant un chapitre, relis les chapitres de 1re indiqués : ils sont aussi dans l’appli de 1re.</p></div></div>`
  + DATA.map(c => `<div class="blk pontl c-${c.col}"><span class="pontl-n">${c.n}</span><div class="pontl-t"><b>${esc(c.titre)}</b><span class="pontl-d">S’appuie sur la 1re : ${c.pont.de.map(x => `ch. ${x.n} <i>${esc(x.titre)}</i>`).join(' · ')}</span><span class="pontl-f">➜ ${c.pont.fil}</span></div></div>`).join('') + `</section>`;
/* ---------- continuité 1re → terminale : version professeur ---------- */
const pontProf = `<section class="sec" data-key="pontp" data-recto="0" data-run="Continuité 1re → terminale · version professeur" data-col="brand"><div class="blk chead kwn c-brand"><div class="ch-txt"><div class="ch-k">Version professeur</div><h2>🧭 Continuité 1re → terminale, chapitre par chapitre</h2><p>Pour chaque chapitre : les capacités du programme de terminale couvertes et les parties du chapitre, les appuis du manuel de 1re, les automatismes à réactiver (zone ⚡ Automatismes, flash du début de séance) et les points de vigilance repérés dans les erreurs fréquentes.</p></div></div>`
  + DATA.map(c => `<div class="blk pontp c-${c.col}"><h3><span class="pontl-n">${c.n}</span>${esc(c.titre)}</h3><p class="pontp-d"><b>Appuis en 1re</b> · ${c.pont.de.map(x => `ch. ${x.n} « ${esc(x.titre)} »`).join(' · ')}</p><table class="pontp-t"><tr><th>Capacités du programme de terminale</th><th>À réactiver (1re)</th><th>Vigilance</th></tr><tr><td><ul>${c.pont.prog.map(x => `<li>${x}</li>`).join('')}</ul><p class="pontp-pl"><b>Parties</b> · ${c.parties.map((p, i) => `${'ABCDE'[i]}. ${p.t}`).join(' · ')}</p></td><td><ul>${c.pont.reac.map(x => `<li>${x}</li>`).join('')}</ul></td><td><ul>${c.pont.vig.map(x => `<li>${x}</li>`).join('')}</ul></td></tr></table></div>`).join('') + `</section>`;

/* ---------- chapitres ---------- */
const chapSecs = CH.map(({ c, fixed, ex, ev }) => {
  const run = `Terminale Bac Pro · Chapitre ${c.n} · ${c.titre}`;
  return `<section class="sec" data-key="${c.id}" data-recto="0" data-fill="1" data-run="${esc(run)}" data-col="${c.col}">${fixed.join('')}${ex.join('')}</section>`
    + `<section class="sec" data-key="${c.id}-ev" data-recto="1" data-fill="1" data-run="${esc(run)} · s’évaluer" data-col="${c.col}">${ev}</section>`;
}).join('');

/* ---------- trois sujets de CCF (élève : sujets ; professeur : corrigés et barèmes) ---------- */
const CCF = require('./contentT/ccfT')(chk);
if (ERR.length) { console.error('Contrôles de calcul en échec :', ERR); process.exit(1); }
const ccfIntro = `<div class="blk chead kwn c-brand"><div class="ch-txt"><div class="ch-k">Se préparer au bac</div><h2>🎓 Trois sujets de CCF</h2><p>En terminale, les mathématiques sont évaluées en contrôle en cours de formation (CCF) : deux situations d’évaluation, l’une en fin de 1re ou au début de la terminale, l’autre en terminale. La seconde porte sur les programmes de 1re et de terminale.</p></div></div>
<div class="blk ccfhow c-brand"><div><b>⏱️ 45 minutes</b><span>pour un sujet noté sur 10</span></div><div><b>✏️ 1 ou 2 exercices</b><span>dont les questions vont de plus en plus loin</span></div><div><b>📞 Au moins un appel</b><span>tu appelles le professeur pour lui montrer ton travail sur un outil numérique : tableur, GeoGebra, calculatrice, Python</span></div><div><b>🧮 Matériel</b><span>calculatrice, ordinateur avec tableur et GeoGebra</span></div></div>
<div class="blk ccfadv c-brand"><p><b>Pendant l’appel</b>, tu montres ton écran, tu expliques en une ou deux phrases ce que tu as fait, puis tu continues ton sujet. L’examinateur évalue ta démarche autant que le résultat. Si tu bloques, tu peux aussi l’appeler : il t’aide, et tu continues.</p></div>`;
const ccfSec = (sj, i) => { let k = 0, ka = 0; const per = {}; sj.exos.forEach(x => x.qs.forEach(q => { per[q.comp] = (per[q.comp] || 0) + q.pts; }));
  const head = `<div class="blk evh c-brand ccfh" data-sec="ccf-${sj.id}"><div class="evh-t"><span class="evh-k">🎓 Sujet de CCF ${sj.id} · ${sj.sit}</span><h2>${sj.titre}</h2><p>${sj.lieu} · durée : 45 min · calculatrice et outils numériques autorisés</p></div><div class="evh-n"><span>Nom</span><i></i><span>Date</span><i></i><b>… / 10</b></div><p class="evccf"><b>Programmes évalués</b> · ${sj.prog.join(' · ')}</p>
<table class="tbl evg evg3"><tr><th>Compétence</th><th>Ce que je sais faire</th><th>Points</th><th>Insuffisant</th><th>Fragile</th><th>Satisfaisant</th><th>Très bon</th></tr>${ORD.filter(o => per[o]).map(o => `<tr><td class="tl"><span class="cp cp-${o}">${CPS[o]}</span></td><td class="tl gp">${sj.grille[o]}</td><td>${ptsTxt(per[o])}</td><td><span class="box"></span></td><td><span class="box"></span></td><td><span class="box"></span></td><td><span class="box"></span></td></tr>`).join('')}</table></div><div class="blk ccfctx c-brand">${sj.contexte}</div>`;
  const body = sj.exos.map((x, j) => `<div class="blk evx kwn c-brand"><div class="evx-h"><span class="evx-n">Exercice ${j + 1}</span><span class="evx-t">${x.t}</span><span class="evx-p">${ptsTxt(x.qs.reduce((a, b) => a + b.pts, 0))}</span></div>${x.intro || ''}</div>` + x.qs.map(q => { k++; return `<div class="blk evq c-brand"><div class="evq-h"><span class="evq-n">${k}</span><span class="evq-t">${q.t}</span><span class="cp cp-${q.comp}">${CPS[q.comp]}</span><span class="evq-p">${ptsTxt(q.pts)}</span></div>${q.lines ? lines(q.lines, q.a) : `<p class="ans"><span>${q.lab || ''}</span>${bl(q.w || 40, q.a)}</p>`}${q.appel ? `<div class="appel3">📞 <b>Appel n° ${++ka}</b> · Appelle le professeur. ${q.appel}</div>` : ''}</div>`; }).join('')).join('');
  return `<section class="sec" data-key="ccf-${sj.id}" data-recto="1" data-run="Sujet de CCF ${sj.id} · ${esc(sj.titre)}" data-col="brand">${head}${body}</section>`; };
const ccfSecs = `<section class="sec" data-key="ccf" data-recto="1" data-run="Sujets de CCF" data-col="brand">${ccfIntro}</section>` + CCF.map(ccfSec).join('');
const ccfCorr = `<div class="blk cc kwn c-brand"><h3>🎓 Sujets de CCF · corrigés et barèmes <small>(p. <span data-pageof="ccf">…</span>)</small></h3></div>` + CCF.map(sj => `<div class="blk cc kx c-brand"><p><b>Sujet ${sj.id} · ${sj.titre}</b> — ` + sj.exos.map((x, j) => `<b>Ex. ${j + 1}</b> ` + x.qs.map(q => `${q.a} <i>(${ptsTxt(q.pts)}${q.appel ? ' ; appel 📞 : ' + q.appel : ''})</i>`).join(' ; ')).join(' · ') + `</p></div>`).join('');

/* ---------- réponses de « Je m’entraîne » (élève et professeur) ---------- */
const repSec = `<section class="sec" data-key="rep" data-recto="1" data-run="Réponses de « Je m’entraîne »" data-col="brand"><div class="blk chead kwn c-brand"><div class="ch-txt"><div class="ch-k">Fin de manuel</div><h2>✔️ Réponses de « Je m’entraîne »</h2><p>Fais l’exercice d’abord, puis vérifie ici. Une réponse différente ? Relis la notion indiquée, ou refais l’exercice dans l’appli avec d’autres nombres.</p></div></div>`
  + CH.map(({ c, rep }) => `<div class="blk rp3 c-${c.col}" data-sec="rep-${c.id}"><h3><span class="rp-n">${c.n}</span>${c.titre}</h3>${rep.map(r => `<p><b class="cn" data-numof="${r.eid}">·</b> <b>${r.titre}</b> — ${r.txt}.</p>`).join('')}</div>`).join('') + `</section>`;

/* ---------- glossaire visuel ---------- */
const card = (w, m) => `<div class="blk gcard c-${m.col}" data-word="${esc(w.id)}"><div class="gc-ill">${w.pic}</div><div><div class="gc-h"><span class="gc-w">${w.mot}</span>${w.abr ? `<span class="sym">${w.abr}</span>` : ''}</div><p class="gc-def">${w.def}</p>${w.formule ? `<p class="gc-man">${w.formule}</p>` : ''}${w.sens ? `<p class="note">↔️ ${w.sens}</p>` : ''}<p class="gc-ph">« ${w.phrase} »</p></div></div>`;
const glo = `<section class="sec" data-key="glo" data-cols="2" data-run="Glossaire visuel" data-col="brand"><div class="blk chead kwn c-brand span"><div class="ch-txt"><div class="ch-k">Fin de manuel</div><h2>🔤 Glossaire visuel</h2><p>Les mots de chaque chapitre, avec un schéma, une définition et une phrase pour les réutiliser.</p></div></div>`
  + CH.map(({ c }) => `<div class="blk gh2 kwn c-${c.col}" data-sec="g-${c.id}"><span class="gh2-i">${c.n}</span><span class="gh2-t"><small>Chapitre ${c.n}</small>${c.titre}</span></div>` + c.words.map(w => card(w, c)).join('')).join('') + `</section>`;

/* ---------- corrigé complet (version professeur) ---------- */
const corr = `<section class="sec corr" data-key="corr" data-recto="1" data-run="Corrigé · version professeur" data-col="brand"><div class="blk chead kwn c-brand"><div class="ch-txt"><div class="ch-k">Version professeur</div><h2>✔️ Corrigé complet</h2><p>Point de départ, résolus à compléter, problèmes et contrôles blancs. Les pages de cette version portent aussi les réponses en rouge. Tous les résultats sont calculés et contrôlés par programme.</p></div></div>`
  + CH.map(({ c, key }) => `<div class="blk cc kwn c-${c.col}"><h3>Chapitre ${c.n} · ${c.titre} <small>(p. <span data-pageof="${c.id}">…</span>)</small></h3></div>` + key.map(k => `<div class="blk cc ${k.eid ? "kq" : "kx"} c-${c.col}"><p>${k.eid ? `<b class="cn" data-numof="${k.eid}">·</b> <b>${k.titre}</b> — ` : ''}${k.html}</p></div>`).join('')).join('') + ccfCorr + `</section>`;

/* ---------- styles et document ---------- */
const SRC = path.join(HERE, 'style');
const FONTS = fs.readFileSync(path.join(SRC, 'fonts.css'), 'utf8');
const ROOT = `:root{--ink:#1D2240;--soft:#545B7A;--brand:#8A5F00;--accent:#F5C827;
--c-verbe:#1E7F45;--t-verbe:#DCF4E4;--c-algebre:#C2332A;--t-algebre:#FDE3E0;--c-nombre:#1D5FC2;--t-nombre:#E0EBFD;--c-fonction:#B05200;--t-fonction:#FFE7D1;
--c-geometrie:#7438C0;--t-geometrie:#EEE3FB;--c-mesure:#08767C;--t-mesure:#D6F2F2;--c-algo:#AA2272;--t-algo:#FBE0EF;--c-donnees:#755C00;--t-donnees:#FFF0B8}
${['verbe', 'algebre', 'nombre', 'fonction', 'geometrie', 'mesure', 'algo', 'donnees'].map(c => `.c-${c}{--cc:var(--c-${c});--tt:var(--t-${c})}`).join('\n')}`;
const FALL = `'Noto Color Emoji','DejaVu Sans','DejaVu Math TeX Gyre',sans-serif`;
const CSS = ['print.css', 'n3.css', 'mcv.css', 'v3.css'].map(f => fs.readFileSync(path.join(SRC, f), 'utf8')).join('\n')
  .replace(/font-family:'Andika','Noto Color Emoji',sans-serif/g, `font-family:'Andika',${FALL}`)
  .replace(/font-family:'Inter','Noto Color Emoji',sans-serif/g, `font-family:'Inter',${FALL}`)
  .replace(/font-family:'Inter','Andika',sans-serif/g, `font-family:'Inter',${FALL}`)
  .replace(/'Inter'(?=\s*[;}])/g, `'Inter',${FALL}`)
  + `
.page.cover2{padding:0}.cvfull,.cvfull svg{width:210mm;height:297mm;display:block}
.cvsvg text{font-family:'Inter',${FALL}}
.owner{display:grid;grid-template-columns:auto 1fr auto 40mm;gap:3mm;align-items:end;font:800 11pt 'Inter',${FALL};color:#1D2240;margin-top:4mm}.owner i{border-bottom:2px dashed #9aa3c7;height:8mm}
.ccfhow{display:grid;grid-template-columns:1fr 1fr;gap:3mm;margin:3mm 0}.ccfhow div{border:2px solid var(--cc);border-radius:4mm;padding:2.4mm 3.4mm;background:var(--tt)}.ccfhow b{display:block;font:800 12pt 'Inter',${FALL};color:#1D2240}.ccfhow span{font-size:10pt;line-height:1.3}.ccfadv{border-left:5px solid var(--cc);background:#FFFBEA;border-radius:3mm;padding:2mm 4mm;font-size:10.4pt}.ccfctx{font-size:10.6pt;margin:1mm 0 2mm}
.evccf{font-size:9.6pt;margin:1.4mm 0 0;color:#545B7A}.appel3{margin:1.6mm 0 .4mm;border:2px dashed var(--cc);border-radius:3mm;padding:1.4mm 3mm;font-size:9.8pt;background:#fff}.appel3 b{color:var(--cc)}
.tbl.cons2{width:100%;font-size:10.2pt}.tbl.cons2 td,.tbl.cons2 th{text-align:left;border:1px solid #C9D1EA;padding:1mm 2.4mm}.tbl.cons2 td:nth-child(2){font-weight:700}`;
const PAG = fs.readFileSync(path.join(HERE, 'lib', 'paginate.js'), 'utf8');
const TPL = `<template id="notesTpl"><div class="blk notes"><h3>📝 Mes notes</h3><div class="lines"></div></div></template>`;
const FOOT = 'Maths et MCV · Tle Bac Pro // T. Rougeaud';
const typo = h => h.split(/(<pre[\s\S]*?<\/pre>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>)/).map((part, i) => i % 2 ? part : part.replace(/>([^<]+)</g, (m, t) => '>' + t.replace(/ ([?!:;»])/g, ' $1').replace(/« /g, '« ').replace(/(\d) (%|€)/g, '$1 $2').replace(/([+−]) (\d)/g, '$1 $2') + '<')).join('');
const anchors = h => h.replace(/(<section [^>]*data-key="([^"]+)"[^>]*>)<div class="blk/g, '$1<div id="k-$2" class="blk').replace(/ data-sec="([^"]+)"/g, ' id="k-$1" data-sec="$1"');
const doc = (title, body, cls) => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${FONTS}\n${TEX.css()}\n${ROOT}\n${CSS}</style></head>
<body class="${cls}" data-foot="${esc(FOOT)}"><div id="flow">${anchors(typo(body))}</div><div id="out"></div>${TPL}<script>${PAG}</script></body></html>`;
const front = pCover + pGuide + pComp1 + pComp2 + pToc;
fs.writeFileSync(path.join(B, 'eleve.html'), doc('Maths et MCV · Tle Bac Pro — manuel', front + pontSec + chapSecs + ccfSecs + repSec + glo, 'eleve'));
fs.writeFileSync(path.join(B, 'prof.html'), doc('Maths et MCV · Tle Bac Pro — version professeur', front + pontSec + pontProf + chapSecs + ccfSecs + repSec + glo + corr, 'prof'));
const nEx = CH.reduce((a, x) => a + x.rep.length + x.c.probs.length, 0);
fs.writeFileSync(path.join(B, 'log.json'), JSON.stringify({ version: 3, chapitres: DATA.map(c => ({ id: c.id, n: c.n, titre: c.titre })), exercices: nEx, mots: DATA.reduce((a, c) => a + c.words.length, 0) }, null, 1));
console.log(`chapitres : ${DATA.length} · exercices du manuel : ${nEx} · contrôles de calcul : OK`);
