/* Construit le manuel « Maths et MCV · 2de » (HTML à paginer), version élève et version professeur.
   Usage : node gen.js → build/eleve.html, build/prof.html, build/log.json */
'use strict';
const fs = require('fs'), path = require('path');
const { esc } = require('./lib/util');
const { cover } = require('./lib/cover');
const HERE = __dirname, B = path.join(HERE, 'build');
fs.mkdirSync(B, { recursive: true });

const CHAPS = [require('./content/ch01.js')()];
const ERR = CHAPS.flatMap(c => c.ERR);
if (ERR.length) { console.error('Contrôles de calcul en échec :', ERR); process.exit(1); }

/* sommaire prévu (les chapitres à venir sont signalés) */
const PLAN = [
  { n: 1, t: 'Prix, marges et TVA', s: 'Pourcentages · coefficients multiplicateurs · HT et TTC · marges', col: 'nombre', id: 'c1' },
  { n: 2, t: 'Statistique à une variable', s: 'Indicateurs · écart type · boîtes à moustaches · comparer deux séries', col: 'donnees' },
  { n: 3, t: 'Problèmes du premier degré', s: 'Équations · inéquations · intervalles', col: 'algebre' },
  { n: 4, t: 'Devis, factures, réductions et intérêts', s: 'Remise, rabais, ristourne · facture · intérêts simples', col: 'verbe' },
  { n: 5, t: 'Fonctions', s: 'Linéaire, affine, carré · variations · systèmes', col: 'fonction' },
  { n: 6, t: 'Fluctuation et probabilités', s: 'Simulation · fréquences · arbres et tableaux', col: 'algo' },
  { n: 7, t: 'Géométrie', s: 'Solides · Pythagore · Thalès · aires et volumes', col: 'geometrie' }
];

/* ---------- pages d’ouverture ---------- */
const pCover = `<div class="page cover2"><div class="cvfull">${cover()}</div></div>`;
const pGuide = `<div class="page" data-recto="0"><div class="inner" data-sec="guide">
  <h1 class="pg-t">Votre manuel : comment ça marche ?</h1>
  <p class="pg-p">Chaque chapitre suit toujours le même ordre : d’abord comprendre, puis s’entraîner, enfin résoudre des situations du métier.</p>
  <div class="gsteps">
    <div class="gs2"><span class="gn">1</span><span class="gi">⚡</span><div><b>Automatismes</b><span>Quelques questions de calcul mental pour se mettre en route.</span></div></div>
    <div class="gs2"><span class="gn">2</span><span class="gi">📘</span><div><b>La leçon</b><span>Chaque notion en un encadré : <b class="inl2">Je retiens</b> (la règle et la formule) et <b class="inl2">Exemple</b>. Puis les mots à connaître.</span></div></div>
    <div class="gs2"><span class="gn">3</span><span class="gi">🛠️</span><div><b>Mes astuces</b><span>Pour calculer plus vite, donner du sens, estimer un ordre de grandeur et vérifier un résultat.</span></div></div>
    <div class="gs2"><span class="gn">4</span><span class="gi">🧭</span><div><b>Exercices résolus pas à pas</b><span>À gauche, ce que j’écris sur ma copie ; à droite, pourquoi je le fais.</span></div></div>
    <div class="gs2"><span class="gn">5</span><span class="gi">✏️</span><div><b>Les exercices, dans l’ordre</b><span><b class="inl2">● La mécanique</b> : de petits calculs sans contexte. <b class="inl2">●● Petits problèmes</b> : une situation courte. <b class="inl2">●●● Cas pratiques</b> : plusieurs documents. Puis <b class="inl2">Vers le bac</b>.</span></div></div>
    <div class="gs2"><span class="gn">6</span><span class="gi">✅</span><div><b>Je fais le point</b><span>Un bilan pour repérer ce qui est acquis et ce qu’il faut retravailler.</span></div></div>
  </div>
  <h2 class="pg-s">Lire un énoncé</h2>
  <p class="pg-p">Les données importantes sont <mark class="hl">surlignées</mark>. Avant de calculer, je les repère et je me demande ce que l’on cherche.</p>
  <h2 class="pg-s">En fin de manuel</h2>
  <p class="pg-p">💡 Les <b>coups de pouce</b> : un indice pour démarrer un exercice. 🔤 Le <b>glossaire visuel</b> : chaque mot avec un schéma, une définition et une phrase exemple.</p>
  <h2 class="pg-s">Ce manuel appartient à</h2>
  <div class="owner"><span>Nom et prénom</span><i></i><span>Classe</span><i></i></div>
</div><div class="foot"></div></div>`;
const pRepere = `<div class="page"><div class="inner">
  <h1 class="pg-t">Les repères du manuel</h1>
  <h2 class="pg-s">Les cinq compétences du bac professionnel</h2>
  <p class="pg-p">Chaque exercice indique les compétences qu’il fait travailler.</p>
  <div class="compet"><span class="cp cp-app">S’approprier</span><span>Rechercher, extraire et organiser l’information des documents.</span><span class="cp cp-ana">Analyser-raisonner</span><span>Choisir une méthode, un modèle ; émettre une hypothèse.</span><span class="cp cp-rea">Réaliser</span><span>Calculer, représenter, utiliser un outil numérique.</span><span class="cp cp-val">Valider</span><span>Contrôler la vraisemblance d’un résultat, critiquer, argumenter.</span><span class="cp cp-com">Communiquer</span><span>Expliquer une démarche, rédiger une réponse avec le bon vocabulaire.</span></div>
  <h2 class="pg-s">Les consignes</h2>
  <table class="tbl cons2"><tr><th>Dans le manuel</th><th>Dans un sujet d’examen</th><th>Ce qu’on attend</th></tr>
  <tr><td>Calculez</td><td>Calculer</td><td>un résultat chiffré, avec son unité</td></tr>
  <tr><td>Déterminez</td><td>Déterminer</td><td>un résultat, par le calcul ou par lecture</td></tr>
  <tr><td>Justifiez</td><td>Justifier</td><td>une raison : un calcul, une propriété, un document</td></tr>
  <tr><td>Vérifiez</td><td>Vérifier</td><td>un contrôle qui confirme le résultat annoncé</td></tr>
  <tr><td>Comparez</td><td>Comparer</td><td>dire lequel est le plus grand, et de combien</td></tr>
  <tr><td>Rédigez</td><td>Rédiger</td><td>des phrases complètes qui répondent à la question</td></tr></table>
  <h2 class="pg-s">Les outils</h2>
  <div class="guide-g"><div class="gd"><span class="gi">🧮</span><div><b>La calculatrice</b><span>Pour les calculs longs et les coefficients. Toujours vérifier l’ordre de grandeur.</span></div></div><div class="gd"><span class="gi">📊</span><div><b>Le tableur</b><span>Pour calculer sur de nombreuses lignes : prix, marges, statistiques, graphiques.</span></div></div><div class="gd"><span class="gi">🐍</span><div><b>Python</b><span>Pour écrire de petits programmes : une fonction qui calcule un prix, une boucle qui répète un calcul.</span></div></div><div class="gd"><span class="gi">📱</span><div><b>L’appli Maths et MCV</b><span>Le cours et les exercices du manuel, avec de nouveaux nombres à chaque essai.</span></div></div></div>
  <h2 class="pg-s">Arrondis et unités</h2>
  <p class="pg-p">Les prix s’arrondissent au centime (0,01 €). Les taux s’arrondissent comme le demande l’énoncé, souvent au dixième (0,1 %). On écrit toujours l’unité du résultat.</p>
  <p class="pg-p small">Les entreprises citées sont fictives. Les données publiques (Insee, taux de TVA, réglementation) sont réelles et leur source est indiquée.</p>
</div><div class="foot"></div></div>`;
const pToc = `<div class="page" data-recto="0"><div class="inner" data-sec="sommaire">
  <h1 class="pg-t">Sommaire</h1>
  <div class="toc2">${PLAN.map(c => `<div class="tc2 c-${c.col}${c.id ? '' : ' soon'}"><span class="tn2">${c.n}</span><div><b>${esc(c.t)}</b><span>${esc(c.s)}</span></div><span class="tp2">${c.id ? `<span data-pageof="${c.id}">…</span>` : 'à venir'}</span></div>`).join('')}
  <div class="tc2 ann"><span class="tn2">💡</span><div><b>Coups de pouce</b><span>Un indice pour démarrer, exercice par exercice</span></div><span class="tp2"><span data-pageof="pouces">…</span></span></div><div class="tc2 ann"><span class="tn2">🔤</span><div><b>Glossaire visuel</b><span>Les mots de chaque chapitre, avec un schéma</span></div><span class="tp2"><span data-pageof="glo">…</span></span></div></div>
  <p class="pg-p small" style="margin-top:4mm">Programme de mathématiques de seconde professionnelle (BO spécial n° 5 du 11 avril 2019). Pour les spécialités sans physique-chimie, comme les métiers de la relation client, le module « Calculs commerciaux et financiers » est au programme. Les automatismes, l’algorithmique et le vocabulaire de logique sont travaillés dans tous les chapitres.</p>
</div><div class="foot"></div></div>`;

/* ---------- chapitres ---------- */
const chapSecs = CHAPS.map(({ C }) => {
  const m = C.meta, run = `2de Bac Pro · Chapitre ${m.n} · ${m.titre}`;
  const exh = C.fixed.find(h => h.includes(`data-sec="${m.id}-ex"`)), before = C.fixed.filter(h => h !== exh);
  return `<section class="sec" data-key="${m.id}" data-recto="1" data-fill="1" data-run="${esc(run)}" data-col="${m.col}">${before.join('')}</section>`
    + `<section class="sec" data-key="${m.id}-x" data-fill="1" data-run="${esc(run)} · exercices" data-col="${m.col}">${exh}${C.ex.join('')}</section>`;
}).join('');

/* ---------- coups de pouce ---------- */
const pouces = `<section class="sec" data-key="pouces" data-fill="1" data-run="Coups de pouce" data-col="brand"><div class="blk chead kwn c-brand"><div class="ch-txt"><div class="ch-k">Fin de manuel</div><h2>💡 Coups de pouce</h2><p>Un indice pour démarrer un exercice. Essayez d’abord seul, puis lisez l’indice si vous en avez besoin.</p></div></div>`
  + CHAPS.map(({ C }) => `<div class="blk sec-h kwn c-${C.meta.col}" data-sec="pouces-${C.meta.id}"><span class="ic">${C.meta.n}</span>Chapitre ${C.meta.n} · ${C.meta.titre}</div>` + C.pouces.map(pc => `<div class="blk pc c-${C.meta.col}"><b>Exercice <span data-numof="${pc.eid}">·</span> · ${pc.titre}</b><br>${pc.txt}</div>`).join('')).join('') + `</section>`;

/* ---------- glossaire visuel ---------- */
const card = (w, m) => `<div class="blk gcard c-${m.col}" data-word="${esc(w.id)}"><div class="gc-ill">${w.pic}</div><div><div class="gc-h"><span class="gc-w">${w.mot}</span>${w.abr ? `<span class="sym">${w.abr}</span>` : ''}</div><p class="gc-def">${w.def}</p>${w.formule ? `<p class="gc-man">${w.formule}</p>` : ''}${w.sens ? `<p class="note">↔️ ${w.sens}</p>` : ''}<p class="gc-ph">« ${w.phrase} »</p></div></div>`;
const glo = `<section class="sec" data-key="glo" data-cols="2" data-run="Glossaire visuel" data-col="brand"><div class="blk chead kwn c-brand span"><div class="ch-txt"><div class="ch-k">Fin de manuel</div><h2>🔤 Glossaire visuel</h2><p>Les mots de chaque chapitre, avec un schéma, une définition et une phrase pour les réutiliser.</p></div></div>`
  + CHAPS.map(({ C }) => `<div class="blk gh2 kwn c-${C.meta.col}" data-sec="g-${C.meta.id}"><span class="gh2-i">${C.meta.n}</span><span class="gh2-t"><small>Chapitre ${C.meta.n}</small>${C.meta.titre}</span></div>` + C.words.map(w => card(w, C.meta)).join('')).join('') + `</section>`;

/* ---------- corrigé (version professeur) ---------- */
const corr = `<section class="sec corr" data-key="corr" data-recto="1" data-run="Corrigé · version professeur" data-col="brand"><div class="blk chead kwn c-brand"><div class="ch-txt"><div class="ch-k">Version professeur</div><h2>✔️ Corrigé</h2><p>Toutes les réponses, en bref. Les pages de cette version portent déjà les réponses en rouge. Tous les résultats ont été calculés et contrôlés par programme.</p></div></div>`
  + CHAPS.map(({ C }) => `<div class="blk cc kwn c-${C.meta.col}"><h3>Chapitre ${C.meta.n} · ${C.meta.titre} <small>(exercices p. <span data-pageof="${C.meta.id}-x">…</span>)</small></h3></div>` + C.key.map(k => `<div class="blk cc kq c-${C.meta.col}"><p><b class="cn" data-numof="${k.eid}">·</b> <b>${k.titre}</b> — ${k.corr}</p></div>`).join('')).join('') + `</section>`;

/* ---------- styles et document ---------- */
const SRC = path.join(HERE, 'style');
const FONTS = fs.readFileSync(path.join(SRC, 'fonts.css'), 'utf8');
const ROOT = `:root{--ink:#1D2240;--soft:#545B7A;--brand:#2B2D7C;--accent:#FFC233;
--c-verbe:#1E7F45;--t-verbe:#DCF4E4;--c-algebre:#C2332A;--t-algebre:#FDE3E0;--c-nombre:#1D5FC2;--t-nombre:#E0EBFD;--c-fonction:#B05200;--t-fonction:#FFE7D1;
--c-geometrie:#7438C0;--t-geometrie:#EEE3FB;--c-mesure:#08767C;--t-mesure:#D6F2F2;--c-algo:#AA2272;--t-algo:#FBE0EF;--c-donnees:#755C00;--t-donnees:#FFF0B8}
${['verbe', 'algebre', 'nombre', 'fonction', 'geometrie', 'mesure', 'algo', 'donnees'].map(c => `.c-${c}{--cc:var(--c-${c});--tt:var(--t-${c})}`).join('\n')}`;
const FALL = `'Noto Color Emoji','DejaVu Sans','DejaVu Math TeX Gyre',sans-serif`;
const CSS = ['print.css', 'n3.css', 'mcv.css'].map(f => fs.readFileSync(path.join(SRC, f), 'utf8')).join('\n')
  .replace(/font-family:'Andika','Noto Color Emoji',sans-serif/g, `font-family:'Andika',${FALL}`)
  .replace(/font-family:'Inter','Noto Color Emoji',sans-serif/g, `font-family:'Inter',${FALL}`)
  .replace(/font-family:'Inter','Andika',sans-serif/g, `font-family:'Inter',${FALL}`)
  .replace(/'Inter'(?=\s*[;}])/g, `'Inter',${FALL}`)
  + `
/* couverture pleine page */
.page.cover2{padding:0}.cvfull,.cvfull svg{width:210mm;height:297mm;display:block}
.cvsvg text{font-family:'Inter',${FALL}}
.inl2{display:inline!important;font:inherit!important;font-weight:700!important;color:var(--cc,#2B2D7C)!important}
.owner{display:grid;grid-template-columns:auto 1fr auto 40mm;gap:3mm;align-items:end;font:800 11pt 'Inter',${FALL};color:#2B2D7C;margin-top:2mm}.owner i{border-bottom:2px dashed #9aa3c7;height:8mm}
.tbl.cons2{width:100%;font-size:10.2pt}.tbl.cons2 td,.tbl.cons2 th{text-align:left;border:1px solid #C9D1EA;padding:1mm 2.4mm}.tbl.cons2 td:nth-child(2){font-weight:700}
.ex.palh{border:none;padding:1.6mm 3.4mm;border-radius:3mm}`;
const PAG = fs.readFileSync(path.join(HERE, 'lib', 'paginate.js'), 'utf8');
const TPL = `<template id="notesTpl"><div class="blk notes"><h3>📝 Mes notes</h3><div class="lines"></div></div></template>`;
const FOOT = 'Maths et MCV · 2de Bac Pro // T. Rougeaud';
/* typographie : espaces fines insécables avant ? ! : ; » et après « (hors code) */
const typo = h => h.split(/(<pre[\s\S]*?<\/pre>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>)/).map((part, i) => i % 2 ? part : part.replace(/>([^<]+)</g, (m, t) => '>' + t.replace(/ ([?!:;»])/g, ' $1').replace(/« /g, '« ') + '<')).join('');
const anchors = h => h.replace(/(<section [^>]*data-key="([^"]+)"[^>]*>)<div class="blk/g, '$1<div id="k-$2" class="blk').replace(/ data-sec="([^"]+)"/g, ' id="k-$1" data-sec="$1"');
const doc = (title, body, cls) => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${FONTS}\n${ROOT}\n${CSS}</style></head>
<body class="${cls}" data-foot="${esc(FOOT)}"><div id="flow">${anchors(typo(body))}</div><div id="out"></div>${TPL}<script>${PAG}</script></body></html>`;
const front = pCover + pGuide + pRepere + pToc;
fs.writeFileSync(path.join(B, 'eleve.html'), doc('Maths et MCV · 2de Bac Pro — manuel (chapitre 1)', front + chapSecs + pouces + glo, 'eleve'));
fs.writeFileSync(path.join(B, 'prof.html'), doc('Maths et MCV · 2de Bac Pro — version professeur (chapitre 1)', front + chapSecs + pouces + glo + corr, 'prof'));
const nEx = CHAPS.reduce((a, c) => a + c.C.key.length, 0);
fs.writeFileSync(path.join(B, 'log.json'), JSON.stringify({ chapitres: CHAPS.map(c => ({ id: c.C.meta.id, n: c.C.meta.n, titre: c.C.meta.titre })), exercices: nEx, mots: CHAPS.reduce((a, c) => a + c.C.words.length, 0) }, null, 1));
console.log(`chapitres : ${CHAPS.length} · exercices : ${nEx} · contrôles de calcul : OK`);
