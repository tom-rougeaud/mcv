/* Construit l’appli « Maths et MCV · 2de » en un seul fichier HTML (aucune ressource externe). */
'use strict';
const fs = require('fs'), path = require('path');
const HERE = __dirname, OUT = process.argv[2] || path.join(HERE, '..', 'mcv-repo', '2de', 'index.html');
const rd = f => fs.readFileSync(path.join(HERE, f), 'utf8');

let errs = 0;
const chk = (ok, msg) => { if (!ok) { errs++; console.error('✗ contrôle', msg); } };
const CH = require('./content3')(chk);
const { SC } = require('./lib/scenes');
if (errs) { console.error(errs + ' erreur(s) de contenu'); process.exit(1); }

/* on n’embarque que ce dont l’appli a besoin */
const slim = c => ({ id: c.id, n: c.n, col: c.col, icone: c.icone, dom: c.dom, titre: c.titre, prepa: !!c.prepa, travail: c.travail, objectifs: c.objectifs, metier: c.metier, scene: SC[c.id](), depart: c.depart,
  notions: c.notions, mots: c.mots, resolus: c.resolus, entraine: c.entraine, bilan: c.bilan, words: c.words,
  probs: c.probs.map(pr), plusloin: { meca: c.plusloin.meca.map(m => ({ id: m.id, lc: m.lc, titre: m.titre, consigne: m.consigne, gen: m.gen, n: m.n })), probs: c.plusloin.probs.map(pr) },
  eval: { lieu: c.eval.lieu, duree: c.eval.duree, grille: c.eval.grille, exos: c.eval.exos.map(x => ({ t: x.t, intro: x.intro, qs: x.qs.map(q => ({ t: q.t, comp: q.comp, pts: q.pts, a: q.a, v: q.v, tol: q.tol, lab: q.lab })) })) } });
const pr = p => ({ id: p.id, etape: p.etape, titre: p.titre, lc: p.lc, pouce: p.pouce, corr: p.corr, cls: p.cls, intro: p.intro, outro: p.outro, seq: p.seq, qs: p.qs, defi: p.defi || 0, bulle: p.bulle || '', autravail: p.autravail || null, hints: p.hints || [] });
const PDF = 'pdf/maths-et-mcv-2de.pdf', HASPDF = fs.existsSync(path.join(path.dirname(OUT), PDF));
const PDFCH = 'pdf/chapitres/maths-et-mcv-2de-chapitre-{n}.pdf', HASCH = fs.existsSync(path.join(path.dirname(OUT), PDFCH.replace('{n}', 1)));
/* décor de l’accueil : les motifs dessinés de la couverture */
const { M: MOT } = require('./lib/cover2');
const DECO = `<svg viewBox="0 0 840 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${[['bars', 700, 90, 6, .7, .22], ['tag', 560, 230, -10, .6, .18], ['table', 790, 250, -4, .55, .2], ['graph', 420, 90, -5, .55, .12], ['star', 640, 30, 0, .7, .3], ['die', 300, 250, 10, .5, .12], ['pct', 520, 70, 8, .55, .14]].map(([k, x, y, r, sc, op]) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${sc})" opacity="${op}">${MOT[k]()}</g>`).join('')}</svg>`;
const DATA = { version: '3.0 · octobre 2026', pdf: HASPDF ? PDF : '', pdfch: HASCH ? PDFCH : '', deco: DECO, chapitres: CH.map(slim) };

/* l’appli n’affiche pas les réponses dans les pointillés : on vide les attributs data-a */
const nb = t => t.replace(/>([^<]*)</g, (m, x) => '>' + x.replace(/(\d) (%|€)/g, '$1\u00A0$2') + '<');
const strip = v => typeof v === 'string' ? nb('>' + v.replace(/ data-a="[^"]*"/g, '') + '<').slice(1, -1) : Array.isArray(v) ? v.map(strip) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, strip(x)])) : v;
let json = JSON.stringify(strip(DATA));
json = json.replace(/<\//g, '<\\/').replace(/<!--/g, '\\u003c!--').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

const FONTS = rd('style/fonts.css');
const CSS = ['print.css', 'n3.css', 'mcv.css'].map(f => rd('style/' + f)).join('\n')
  .replace(/@page\{[^}]*\}/g, '').replace(/html,body\{margin:0;padding:0;background:#fff\}/, 'html,body{margin:0;padding:0}');
const APPCSS = rd('app/app.css') + '\n' + rd('app/app3.css');
const js = s => s.replace(/<\/script/gi, '<\\/script');
const FAV = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#2B2D7C"/><text x="32" y="47" font-family="Arial,sans-serif" font-size="44" font-weight="700" fill="#FFC233" text-anchor="middle">Σ</text></svg>`);

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Maths et MCV · 2de</title>
<meta name="description" content="Mathématiques de 2de Bac Pro Métiers de la relation client : un document du métier pour démarrer, des leçons animées, des méthodes pas à pas, de l’entraînement corrigé et expliqué, des problèmes du commerce, de la vente et de l’accueil.">
<meta name="theme-color" content="#2B2D7C">
<meta name="author" content="Tom Rougeaud">
<link rel="icon" href="${FAV}">
<style>${FONTS}</style>
<style>${require('./lib/tex').css()}</style>
<style>${CSS}</style>
<style>${APPCSS}</style>
</head>
<body>
<a class="skip" href="#main">Aller au contenu</a>
<header class="top"><div class="top-in"><a class="logo" href="#/"><i>Σ</i><span><b>Maths et MCV · 2de</b><small>Bac Pro Métiers de la relation client</small></span></a><nav><a href="#/glossaire" class="hide-s">Glossaire</a><a href="#/a-propos">À propos</a></nav></div></header>
<main id="main" tabindex="-1"><noscript><p>Cette application a besoin de JavaScript.${HASPDF ? ` Le manuel PDF reste disponible : <a href="${PDF}">télécharger le manuel</a>.` : ''}</p></noscript></main>
<footer class="foot2">Maths et MCV · 2de — Tom Rougeaud · CC BY-NC 4.0 · <a href="#/confidentialite">Confidentialité</a> · <a href="#/donnees">Mes données</a> · <a href="../">Tout le programme</a></footer>
<script>${js(rd('shared/gens.js'))}</script>
<script>${js(rd('shared/train.js'))}</script>
<script>${js(rd('app/widgets.js'))}</script>
<script type="application/json" id="mcv-data">${json}</script>
<script>${js(rd('app/app3.js'))}</script>
</body>
</html>
`;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`✓ ${OUT} · ${(html.length / 1024).toFixed(0)} Ko · ${CH.length} chapitres · ${CH.reduce((s, c) => s + c.entraine.length, 0)} entraînements · ${CH.reduce((s, c) => s + c.probs.length, 0)} problèmes`);
