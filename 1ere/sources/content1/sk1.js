/* 1re — petites illustrations « Je découvre » : dessins au trait (sans visage) et mini-graphiques exacts. viewBox 200 × 130. */
'use strict';
const { Sketch, esc } = require('../lib/visu');
const { MCVP } = require('../shared/g1.js');
const SV = (body, lab, w = 200, h = 130) => `<svg viewBox="0 0 ${w} ${h}" class="pic scene" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(lab)}">${body}</svg>`;
const tt = (x, y, s, fs = 13, o = {}) => `<text x="${x}" y="${y}" font-family="Inter" font-size="${fs}" font-weight="800" text-anchor="${o.a || 'middle'}" class="${o.c || 'tx'}">${s}</text>`;
const fill = (x, y, w, h, op = .9, cls = 'k2', rx = 3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="${cls}" opacity="${op}"/>`;
/* mini-repère exact */
const mini = (o, f) => { const g = MCVP.plot({ W: 200, H: 130, ml: 30, mr: 8, mt: 8, mb: 22, fs: 10, ...o }); return SV(g.base + f(g), o.lab || 'Graphique'); };

const NU = [[1, 18], [2, 30], [3, 28], [4, 44], [5, 50], [6, 58], [7, 66], [8, 72], [9, 85]], FN = MCVP.fit(NU), NU2 = [[1, 15], [2, 24], [3, 33], [4, 42], [5, 52], [6, 60], [7, 69], [8, 78], [9, 87]], FN2 = MCVP.fit(NU2);
const SK = {
  /* chapitre 1 */
  bougies: () => { const K = Sketch(201); let s = '';
    [[28, 60, 40, 46], [84, 44, 44, 62], [142, 68, 36, 38]].forEach(([x, y, w, h], i) => { s += fill(x, y, w, h, .9, i === 1 ? 'k' : 'k2') + K.P(K.rect(x, y, w, h)) + K.P(K.line(x + w / 2, y, x + w / 2, y - 8), { w: 2 }) + `<path d="M${x + w / 2} ${y - 9}q-6 -9 0 -18q6 9 0 18z" class="k" opacity=".9"/>`; });
    s += K.P(K.line(14, 108, 188, 108)) + tt(100, 124, '12 € la bougie', 12);
    return SV(s, 'Trois bougies sur une étagère'); },
  etiquette: () => { const K = Sketch(202); let s = fill(30, 30, 110, 62, .9, 'k2') + K.P(K.poly([[30, 30], [140, 30], [166, 61], [140, 92], [30, 92]], true)) + K.P(K.circ(46, 61, 5));
    s += tt(92, 56, 'CM = C ÷ q', 16) + tt(92, 78, '10 € en moyenne', 12) + K.P(K.line(166, 61, 190, 80)) + tt(100, 118, 'la 101e coûte 4 €', 12);
    return SV(s, 'Une étiquette de coût moyen'); },
  tirelire: () => { const K = Sketch(203); let s = '';
    s += fill(40, 40, 100, 64, .9) + K.P(K.circ(90, 72, 34)) + K.P(K.line(66, 42, 114, 42)) + K.P(K.rect(78, 30, 24, 10)) + tt(90, 78, '2 000 €', 16) + K.P(K.line(60, 106, 60, 116) + K.line(120, 106, 120, 116));
    s += `<circle cx="168" cy="40" r="14" class="k" opacity=".9"/>` + tt(168, 45, '3 %', 12, { c: 'tw' });
    return SV(s, 'Une tirelire avec un capital et un taux'); },
  calendrier: () => { const K = Sketch(204); let s = fill(30, 24, 140, 86, .9) + K.P(K.rect(30, 24, 140, 86) + K.line(30, 44, 170, 44));
    for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) s += K.P(K.rect(38 + c * 18, 52 + r * 18, 13, 12), { w: 1.4 });
    s += `<rect x="38" y="52" width="115" height="12" rx="2" class="k" opacity=".25"/>` + tt(100, 38, '15 jours · 360 jours', 11);
    return SV(s, 'Un calendrier avec les quinzaines'); },
  /* chapitre 2 */
  deuxOffres: () => mini({ x: [0, 10, 5], y: [0, 300, 100], lab: 'Deux offres de location' }, g => g.line(25, 0, { stroke: '#C2332A' }) + g.line(15, 60) + g.dot(6, 150, { r: 4, lab: 'même prix', dx: -6, dy: -8, a: 'end', fs: 11 })),
  croisement: () => mini({ x: [0, 10, 5], y: [0, 300, 100], lab: 'Le point où deux droites se croisent' }, g => g.line(25, 0, { stroke: '#C2332A' }) + g.line(15, 60) + g.guide(6, 150) + g.dot(6, 150, { r: 4 })),
  auDessus: () => mini({ x: [0, 10, 5], y: [0, 300, 100], lab: 'La droite la plus haute' }, g => g.band(6, 10) + g.line(25, 0, { stroke: '#C2332A' }) + g.line(15, 60) + g.txt(8, 260, 'au-dessus', { fs: 11, a: 'middle' })),
  seuil: () => mini({ x: [0, 120, 40], y: [0, 1500, 500], ml: 40, lab: 'Le seuil de rentabilité' }, g => g.line(4, 600, { stroke: '#C2332A' }) + g.line(12, 0) + g.dot(75, 900, { r: 4 })),
  /* chapitre 3 */
  parabole: () => mini({ x: [-4, 4, 2], y: [0, 8, 4], zeroAxes: true, lab: 'Une parabole' }, g => g.curve(x => x * x / 2)),
  racines: () => mini({ x: [-4, 4, 2], y: [-4, 6, 2], zeroAxes: true, lab: 'Une parabole qui coupe l’axe en deux points' }, g => g.curve(x => 5 - x * x / 2 - 1) + g.dot(-2.83, 0, { r: 3.5 }) + g.dot(2.83, 0, { r: 3.5 })),
  facto: () => mini({ x: [0, 6, 2], y: [-6, 6, 3], zeroAxes: false, lab: 'Une parabole de racines 1 et 5' }, g => g.curve(x => -(x - 1) * (x - 5) / 2 + 0) + g.dot(1, 0, { r: 3.5 }) + g.dot(5, 0, { r: 3.5 })),
  sommet: () => mini({ x: [0, 6, 2], y: [0, 10, 5], lab: 'Le sommet d’une parabole' }, g => g.curve(x => -(x - 3) * (x - 3) + 8) + g.dot(3, 8, { r: 4, fill: '#FFC233' })),
  /* chapitre 4 */
  pente: () => mini({ x: [0, 6, 2], y: [0, 9, 3], lab: 'Une tangente à une courbe' }, g => g.curve(x => x * x / 4) + g.line(1, -1 / 4 * 1 - 0, { stroke: '#C2332A' }) + g.dot(2, 1, { r: 4 })),
  tangente: () => mini({ x: [0, 6, 2], y: [0, 9, 3], lab: 'La tangente en un point' }, g => g.curve(x => x * x / 4) + g.line(2, -3, { stroke: '#C2332A' }) + g.dot(3, 9 / 4, { r: 4 })),
  derivee: () => mini({ x: [0, 6, 2], y: [-2, 8, 2], lab: 'Une fonction et sa dérivée' }, g => g.curve(x => x * x / 4) + g.curve(x => x / 2, { stroke: '#C2332A' })),
  variations: () => mini({ x: [0, 6, 2], y: [0, 10, 5], lab: 'Une fonction croissante puis décroissante' }, g => g.curve(x => -(x - 3) * (x - 3) + 9) + g.dot(3, 9, { r: 4, fill: '#FFC233' })),
  /* chapitre 5 */
  pile: () => { const K = Sketch(251); let s = '';
    for (let r = 0; r < 4; r++) for (let c = 0; c <= r; c++) { const x = 100 - (r * 15) + c * 30 - 12, y = 24 + r * 22; s += fill(x, y, 26, 18, .9, c % 2 ? 'k' : 'k2') + K.P(K.rect(x, y, 26, 18), { w: 1.6 }); }
    s += tt(100, 124, '1 + 2 + 3 + 4 = 10 boîtes', 11);
    return SV(s, 'Une pyramide de boîtes en vitrine'); },
  escalier: () => mini({ x: [0, 5, 1], y: [0, 100, 20], lab: 'Des points alignés' }, g => g.pts([[0, 20], [1, 35], [2, 50], [3, 65], [4, 80]]) + g.line(15, 20, { w: 1.6, dash: '4 4' })),
  expo: () => mini({ x: [0, 5, 1], y: [0, 80, 20], lab: 'Des points qui montent de plus en plus vite' }, g => g.curve(x => 10 * Math.pow(1.5, x), { w: 1.6, dash: '4 4' }) + g.pts([0, 1, 2, 3, 4, 5].map(n => [n, 10 * Math.pow(1.5, n)]))),
  deuxSuites: () => mini({ x: [0, 12, 4], y: [900, 1900, 500], ml: 38, lab: 'Deux placements : points alignés et points qui montent de plus en plus' }, g => g.pts([0, 2, 4, 6, 8, 10, 12].map(n => [n, 1000 + 60 * n]), { r: 3, fill: '#1D5FC2' }) + g.pts([0, 2, 4, 6, 8, 10, 12].map(n => [n, 1000 * Math.pow(1.05, n)]), { r: 3, fill: '#B05200' })),
  inverse: () => mini({ x: [0, 8, 2], y: [0, 16, 4], lab: 'Le coût moyen 4 + 6 ÷ q diminue' }, g => g.curve(q => 4 + 6 / q, { a: .5, b: 8 }) + g.seg(0, 4, 8, 4, { stroke: '#C2332A', dash: '4 3', w: 1.4 })),
  somme: () => { const K = Sketch(252); let s = '';
    [18, 30, 42, 54, 66].forEach((h, i) => { s += fill(24 + i * 32, 100 - h, 26, h, .9, i % 2 ? 'k' : 'k2') + K.P(K.rect(24 + i * 32, 100 - h, 26, h), { w: 1.6 }); });
    s += K.P(K.line(16, 100, 184, 100)) + tt(100, 120, 'on additionne tous les rangs', 11);
    return SV(s, 'Des colonnes de hauteur croissante'); },
  tableur: () => { const K = Sketch(253); let s = fill(24, 22, 152, 80, .9, 'wh');
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) s += K.P(K.rect(24 + c * 38, 22 + r * 20, 38, 20), { w: 1.4 });
    ['n', '0', '1', '2'].forEach((v, i) => { s += tt(43 + i * 38, 37, v, 11); });
    ['u(n)', '120', '135', '150'].forEach((v, i) => { s += tt(43 + i * 38, 57, v, 11); });
    s += tt(100, 120, '=B2+15', 11);
    return SV(s, 'Un tableur qui calcule les termes d’une suite'); },
  /* chapitre 6 */
  nuage: () => mini({ x: [0, 10, 2], y: [0, 100, 20], lab: 'Un nuage de points' }, g => g.pts([[1, 18], [2, 30], [3, 28], [4, 44], [5, 50], [6, 58], [7, 66], [8, 72], [9, 85]])),
  droiteAj: () => mini({ x: [0, 10, 2], y: [0, 100, 20], lab: 'Une droite d’ajustement' }, g => g.pts(NU) + g.line(FN.a, FN.b, { stroke: '#C2332A' })),
  r2: () => mini({ x: [0, 10, 2], y: [0, 100, 20], lab: 'Des points très proches de la droite' }, g => g.pts(NU2) + g.line(FN2.a, FN2.b, { stroke: '#C2332A' })),
  prevoir: () => mini({ x: [0, 12, 2], y: [0, 120, 20], lab: 'Prévoir avec la droite' }, g => g.pts(NU) + g.line(FN.a, FN.b, { stroke: '#C2332A' }) + g.dot(11, FN.a * 11 + FN.b, { r: 4, fill: '#FFC233' })),
  /* chapitre 7 */
  urne: () => { const K = Sketch(271); let s = fill(50, 40, 100, 70, .9) + K.P(K.rect(50, 40, 100, 70) + K.line(70, 40, 130, 40));
    [[70, 72], [92, 66], [114, 74], [132, 68], [80, 92], [104, 90], [126, 94]].forEach(([x, y], i) => { s += `<circle cx="${x}" cy="${y}" r="9" class="${i < 3 ? 'k' : 'k2'} ks" stroke-width="1.6"/>`; });
    s += tt(100, 28, '3 rouges sur 7', 12);
    return SV(s, 'Une urne de jetons rouges et clairs'); },
  union: () => { let s = `<circle cx="80" cy="64" r="38" class="k" opacity=".3"/><circle cx="122" cy="64" r="38" class="k2" opacity=".7"/><circle cx="80" cy="64" r="38" class="ks" fill="none" stroke-width="2"/><circle cx="122" cy="64" r="38" class="ks" fill="none" stroke-width="2"/>`;
    s += tt(62, 68, 'A', 16) + tt(140, 68, 'B', 16) + tt(101, 68, '∩', 15, { c: 'kt' });
    return SV(s, 'Deux événements qui se recouvrent'); },
  croise: () => { const K = Sketch(272); let s = ''; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) s += fill(34 + c * 44, 26 + r * 28, 44, 28, c === 2 || r === 2 ? .9 : .5, c === 2 || r === 2 ? 'k2' : 'wh') + K.P(K.rect(34 + c * 44, 26 + r * 28, 44, 28), { w: 1.5 });
    s += tt(100, 122, 'tableau croisé', 11);
    return SV(s, 'Un tableau croisé'); },
  conditionnel: () => { let s = `<circle cx="100" cy="64" r="48" class="k2 ks" stroke-width="2"/><circle cx="118" cy="64" r="26" class="k" opacity=".55"/>` + tt(80, 68, 'A', 15) + tt(122, 68, 'B', 14, { c: 'tw' }) + tt(100, 124, 'on regarde seulement A', 11);
    return SV(s, 'Un événement B à l’intérieur de A'); },
  /* chapitre 8 */
  cartons: () => { const K = Sketch(281); let s = fill(40, 50, 90, 56, .9) + K.P(K.poly([[40, 50], [130, 50], [130, 106], [40, 106]], true) + K.poly([[40, 50], [60, 34], [150, 34], [130, 50]], true) + K.poly([[130, 50], [150, 34], [150, 90], [130, 106]], true)) + tt(85, 82, '30 × 20', 12) + tt(172, 66, '15', 12);
    return SV(s, 'Un carton d’expédition en perspective'); },
  cylindre: () => { const K = Sketch(282); let s = fill(60, 36, 80, 62, .9) + `<ellipse cx="100" cy="36" rx="40" ry="12" class="k2 ks" stroke-width="2"/><path d="M60 36V98a40 12 0 0 0 80 0V36" class="ks" fill="none" stroke-width="2"/>` + tt(100, 70, 'πr²h', 15) + tt(100, 124, 'un pot cylindrique', 11);
    return SV(s, 'Un pot cylindrique'); },
  pyramide: () => { const K = Sketch(283); let s = K.P(K.poly([[100, 20], [40, 96], [100, 112], [160, 96]], true) + K.line(100, 20, 100, 112) + K.line(40, 96, 160, 96, 1.2), { w: 2.2 }) + fill(60, 90, 80, 8, .6) + tt(100, 126, 'B × h ÷ 3', 11);
    return SV(s, 'Une pyramide'); },
  section: () => { const K = Sketch(284); let s = K.P(K.poly([[36, 50], [120, 50], [120, 106], [36, 106]], true) + K.poly([[36, 50], [66, 28], [150, 28], [120, 50]], true) + K.poly([[120, 50], [150, 28], [150, 84], [120, 106]], true)) + `<path d="M36 78L66 56L150 56L120 78Z" class="k" opacity=".45"/>` + K.P(K.poly([[36, 78], [66, 56], [150, 56], [120, 78]], true), { w: 2.2 });
    return SV(s, 'Un pavé coupé par un plan'); }
};
module.exports = { SK };
