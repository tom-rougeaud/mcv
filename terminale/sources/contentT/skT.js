/* Terminale — petites illustrations « Je découvre » : dessins au trait (sans visage) et mini-graphiques exacts. viewBox 200 × 130. */
'use strict';
const { Sketch, esc } = require('../lib/visu');
const { MCVP } = require('../shared/g1.js');
const SV = (body, lab, w = 200, h = 130) => `<svg viewBox="0 0 ${w} ${h}" class="pic scene" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(lab)}">${body}</svg>`;
const tt = (x, y, s, fs = 13, o = {}) => `<text x="${x}" y="${y}" font-family="Inter" font-size="${fs}" font-weight="800" text-anchor="${o.a || 'middle'}" class="${o.c || 'tx'}">${s}</text>`;
const fill = (x, y, w, h, op = .9, cls = 'k2', rx = 3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="${cls}" opacity="${op}"/>`;
/* mini-repère exact */
const mini = (o, f) => { const g = MCVP.plot({ W: 200, H: 130, ml: 30, mr: 8, mt: 8, mb: 22, fs: 10, ...o }); return SV(g.base + f(g), o.lab || 'Graphique'); };
/* données réelles : chiffre d’affaires du commerce en ligne en France, en milliards d’euros (Fevad, Chiffres clés 2024) */
const FEVAD = [[2017, 80.5], [2018, 91.3], [2019, 101.8], [2020, 110.4], [2021, 127.2], [2022, 144.7], [2023, 159.9]];

const SK = {
  /* chapitre 1 · suites */
  fevad: () => { const g = MCVP.plot({ W: 200, H: 130, ml: 30, mr: 8, mt: 10, mb: 22, fs: 9, x: [2016.5, 2023.5, 1], y: [0, 160, 40], xt: FEVAD.map(([a]) => [a, String(a).slice(2)]), grid: false });
    return SV(g.base + FEVAD.map(([a, v]) => `<rect x="${(g.X(a - .32)).toFixed(1)}" y="${g.Y(v).toFixed(1)}" width="${(g.X(a + .32) - g.X(a - .32)).toFixed(1)}" height="${(g.Y(0) - g.Y(v)).toFixed(1)}" class="k"/>`).join('') + tt(112, 16, 'Md€ · Fevad', 10, { c: 'ts' }), 'Chiffre d’affaires du commerce en ligne de 2017 à 2023 : les barres montent chaque année'); },
  box: () => { const K = Sketch(511); let s = fill(46, 52, 108, 58, .9) + K.P(K.poly([[46, 52], [154, 52], [154, 110], [46, 110]], true)) + K.P(K.poly([[46, 52], [70, 30], [178, 30], [154, 52]], true)) + K.P(K.poly([[154, 52], [178, 30], [178, 88], [154, 110]], true));
    s += K.P(K.line(100, 52, 124, 30), { w: 2 }) + tt(100, 86, 'box', 16) + `<rect x="12" y="8" width="62" height="24" rx="12" class="k"/>` + tt(43, 25, '+ 5 %', 13, { c: 'tw' }) + tt(100, 126, 'chaque mois', 11);
    return SV(s, 'Un colis d’abonnement et une étiquette « + 5 % »'); },
  calculette: () => { const K = Sketch(512); let s = fill(56, 10, 88, 112, .9, 'wh') + K.P(K.rect(56, 10, 88, 112)) + fill(64, 18, 72, 22, .9) + K.P(K.rect(64, 18, 72, 22), { w: 1.6 }) + tt(132, 34, '1 436,69', 11, { a: 'end' });
    const keys = [['7', '8', '9'], ['4', '5', '6'], ['1', '2', '^'], ['0', ',', '=']];
    keys.forEach((r, i) => r.forEach((k, j) => { const x = 66 + j * 23, y = 48 + i * 18; s += (k === '^' ? `<rect x="${x}" y="${y}" width="19" height="14" rx="3" class="k"/>` : '') + K.P(K.rect(x, y, 19, 14), { w: 1.3 }) + tt(x + 9.5, y + 11, k, 10, { c: k === '^' ? 'tw' : 'tx' }); }));
    return SV(s, 'Une calculatrice : la touche puissance est mise en valeur'); },
  phone: () => { const K = Sketch(513); let s = fill(30, 14, 52, 98, .9) + K.P(K.rect(30, 14, 52, 98)) + K.P(K.rect(36, 24, 40, 70), { w: 1.6 }) + K.P(K.circ(56, 103, 4), { w: 1.6 });
    s += `<rect x="98" y="22" width="80" height="30" rx="8" class="k2"/>` + K.P(K.rect(98, 22, 80, 30)) + tt(138, 43, '600 €', 15) + K.P(K.line(138, 56, 138, 84), { w: 2.6 }) + `<path d="M131 80l7 10l7 -10z" class="k"/>` + tt(138, 108, '− 15 % par an', 12, { c: 'kt' });
    return SV(s, 'Un téléphone et son prix qui baisse de 15 % par an'); },
  cumul: () => { const K = Sketch(514); let s = fill(18, 14, 164, 92, .9, 'wh');
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) s += K.P(K.rect(18 + c * 55, 14 + r * 23, 55, 23), { w: 1.3 });
    [['n', 'uₙ', 'cumul'], ['0', '800', '800'], ['1', '840', '1 640'], ['2', '882', '2 522']].forEach((row, r) => row.forEach((v, c) => { s += tt(45 + c * 55, 30 + r * 23, v, 11, { c: r === 0 ? 'kt' : 'tx' }); }));
    s += tt(100, 124, '=C3+B4', 11, { c: 'kt' });
    return SV(s, 'Un tableur : une colonne de termes et une colonne de cumul'); },
  prix: () => { const K = Sketch(515); let s = K.P(K.poly([[22, 40], [86, 40], [104, 62], [86, 84], [22, 84]], true)) + fill(24, 42, 62, 40, .9) + K.P(K.circ(34, 62, 4), { w: 1.5 }) + tt(62, 68, '100 €', 15);
    s += K.P(K.curve(x => 98 - 0.004 * (x - 110) * (x - 110) - (x - 110) * .25, 112, 186), { w: 2.6 }) + `<circle cx="186" cy="${(98 - .004 * 76 * 76 - 76 * .25).toFixed(1)}" r="5" class="k"/>` + tt(150, 120, '+ 2 % par an', 12, { c: 'kt' }) + tt(62, 112, 'un panier', 11, { c: 'ts' });
    return SV(s, 'Une étiquette de prix et une courbe qui monte de plus en plus'); },
  /* chapitre 2 · calculs financiers */
  livret: () => { const K = Sketch(521); let s = fill(40, 22, 90, 96, .9) + K.P(K.rect(40, 22, 90, 96)) + K.P(K.line(52, 22, 52, 118), { w: 1.6 }) + tt(91, 54, 'LEP', 18) + tt(91, 80, 'épargne', 11) + K.P(K.line(62, 94, 120, 94), { w: 1.4 }) + K.P(K.line(62, 104, 110, 104), { w: 1.4 });
    s += `<circle cx="160" cy="50" r="26" class="k"/>` + tt(160, 56, '2,5 %', 13, { c: 'tw' }) + tt(160, 100, '+ intérêts', 11, { c: 'kt' }) + tt(160, 114, 'chaque année', 10, { c: 'ts' });
    return SV(s, 'Un livret d’épargne et une pastille 2,5 %'); },
  sablier: () => { const K = Sketch(522); let s = K.P(K.line(56, 14, 124, 14) + K.line(56, 116, 124, 116)) + K.P(K.poly([[62, 14], [118, 14], [94, 64], [118, 116], [62, 116], [86, 64]], true)) + `<path d="M70 108L110 108L98 88L82 88Z" class="k" opacity=".85"/><path d="M74 24L106 24L96 44L84 44Z" class="k2"/>`;
    s += tt(160, 50, '3 500 €', 14, { c: 'kt' }) + tt(160, 72, '?', 22) + tt(160, 100, 'combien', 11, { c: 'ts' }) + tt(160, 114, 'd’années ?', 11, { c: 'ts' });
    return SV(s, 'Un sablier et un objectif de 3 500 €'); },
  mois12: () => { const K = Sketch(523); let s = '';
    for (let i = 0; i < 12; i++) { const x = 20 + (i % 6) * 28, y = 30 + Math.floor(i / 6) * 34; s += fill(x, y, 24, 26, .9) + K.P(K.rect(x, y, 24, 26), { w: 1.3 }) + tt(x + 12, y + 18, String(i + 1), 10); }
    s += tt(100, 116, '6 % par an → ? par mois', 12, { c: 'kt' }) + tt(100, 18, 'une année = 12 mois', 11, { c: 'ts' });
    return SV(s, 'Les douze mois d’une année et la question du taux mensuel'); },
  voiture: () => { const K = Sketch(524); let s = fill(30, 62, 140, 34, .9) + K.P(K.poly([[30, 96], [30, 70], [62, 66], [82, 42], [130, 42], [152, 66], [170, 70], [170, 96]], true)) + K.P(K.line(88, 48, 88, 66) + K.line(88, 66, 146, 66), { w: 1.6 });
    s += `<circle cx="62" cy="98" r="13" class="k"/><circle cx="140" cy="98" r="13" class="k"/>` + K.P(K.circ(62, 98, 13) + K.circ(140, 98, 13), { w: 2 }) + tt(100, 24, '15 000 € sur 5 ans', 13, { c: 'kt' }) + tt(100, 126, 'taux annuel 4,8 %', 11, { c: 'ts' });
    return SV(s, 'Une voiture achetée à crédit'); },
  annuites: () => { const K = Sketch(525); let s = '';
    [0, 1, 2, 3, 4].forEach(i => { const x = 18 + i * 34; s += fill(x, 40, 28, 62, .9, i % 2 ? 'k' : 'k2') + K.P(K.rect(x, 40, 28, 62), { w: 1.4 }) + tt(x + 14, 116, 'an ' + (i + 1), 9); });
    s += K.P(K.line(14, 36, 190, 36), { w: 2, c: '#C2332A' }) + tt(100, 24, 'la même somme chaque année', 11, { c: 'kt' });
    return SV(s, 'Cinq colonnes de même hauteur : cinq annuités égales'); },
  /* chapitre 3 · polynômes de degré 3 */
  cartonCube: () => { const K = Sketch(531); let s = fill(40, 50, 60, 60, .9) + K.P(K.rect(40, 50, 60, 60)) + K.P(K.poly([[40, 50], [62, 30], [122, 30], [100, 50]], true)) + K.P(K.poly([[100, 50], [122, 30], [122, 90], [100, 110]], true));
    s += tt(70, 124, 'x dm', 11) + `<rect x="130" y="40" width="62" height="40" rx="8" class="k"/>` + tt(161, 66, 'x³ L', 14, { c: 'tw' }) + tt(161, 100, '2 dm → 8 L', 10, { c: 'ts' });
    return SV(s, 'Un carton cubique d’arête x et sa contenance x³'); },
  coffrets: () => mini({ x: [0, 10, 2], y: [-80, 60, 40], zeroAxes: true, lab: 'La courbe du bénéfice B(x)' }, g => g.curve(x => -(x ** 3) + 15 * x * x - 48 * x - 20, { stroke: '#B05200', w: 2.6 })),
  tabvarMini: () => { let s = `<rect x="10" y="20" width="180" height="90" rx="5" fill="#fff" stroke="#9aa3c7"/><line x1="10" y1="44" x2="190" y2="44" stroke="#9aa3c7"/><line x1="10" y1="66" x2="190" y2="66" stroke="#9aa3c7"/><line x1="48" y1="20" x2="48" y2="110" stroke="#9aa3c7"/>`;
    s += tt(29, 37, 'x', 11) + tt(29, 60, 'B′', 11) + tt(29, 92, 'B', 11) + [['0', 62], ['2', 98], ['8', 142], ['10', 180]].map(([v, x]) => tt(x, 37, v, 10)).join('') + tt(80, 60, '−', 12) + tt(120, 60, '+', 12) + tt(161, 60, '−', 12);
    s += `<path d="M66 76L92 100M104 100L136 76M148 76L174 100" stroke="#B05200" stroke-width="2"/>`;
    return SV(s, 'Un tableau de variations : décroissante, croissante, décroissante'); },
  droiteHoriz: () => mini({ x: [0, 10, 2], y: [-80, 60, 40], zeroAxes: true, lab: 'La courbe et la droite y = 30' }, g => g.curve(x => -(x ** 3) + 15 * x * x - 48 * x - 20, { stroke: '#B05200', w: 2.4 }) + g.seg(0, 30, 10, 30, { stroke: '#C2332A', w: 2, dash: '5 4' }) + g.pts([[6.647, 30], [9.173, 30]], { r: 3.6 })),
  /* chapitre 4 · exponentielles et logarithme */
  reseau: () => { const K = Sketch(541); let s = fill(28, 12, 64, 106, .9, 'wh') + K.P(K.rect(28, 12, 64, 106)) + K.P(K.rect(34, 22, 52, 78), { w: 1.4 });
    [0, 1, 2, 3].forEach(i => { const h = 8 * Math.pow(1.6, i); s += `<rect x="${39 + i * 12}" y="${92 - h}" width="8" height="${h}" class="k"/>`; });
    s += `<rect x="108" y="30" width="80" height="30" rx="15" class="k"/>` + tt(148, 50, '+ 20 %', 13, { c: 'tw' }) + tt(148, 84, '1 000', 14) + tt(148, 100, 'abonnés', 10, { c: 'ts' });
    return SV(s, 'Un téléphone avec des barres d’audience qui grandissent'); },
  puissances: () => { const K = Sketch(542); let s = fill(14, 44, 60, 34, .9) + K.P(K.rect(14, 44, 60, 34)) + tt(44, 66, '1,02⁵', 13) + tt(86, 66, '×', 14) + fill(98, 44, 60, 34, .9) + K.P(K.rect(98, 44, 60, 34)) + tt(128, 66, '1,02⁵', 13) + tt(176, 66, '= ?', 14);
    s += tt(100, 106, '5 ans, puis encore 5 ans', 11, { c: 'ts' });
    return SV(s, 'Deux blocs « 1,02 puissance 5 » à multiplier'); },
  regleLog: () => { let s = `<line x1="14" y1="74" x2="186" y2="74" stroke="#1D2240" stroke-width="2"/>`;
    for (let k = 0; k <= 12; k += 2) s += `<line x1="${14 + k * 14.33}" y1="69" x2="${14 + k * 14.33}" y2="79" stroke="#1D2240" stroke-width="1.6"/>` + tt(14 + k * 14.33, 94, '10' + String(k).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join(''), 9, { c: 'ts' });
    [[5.2, 'sites'], [9.51, 'achats'], [11.29, 'CA']].forEach(([v, l], i) => { s += `<circle cx="${(14 + v * 14.33).toFixed(1)}" cy="74" r="5" class="k"/>` + tt(14 + v * 14.33, 56 - (i % 2) * 18, l, 10, { c: 'kt' }); });
    return SV(s, 'Une règle graduée en puissances de 10, avec trois chiffres du commerce en ligne'); },
  doubler: () => { const K = Sketch(543); let s = fill(20, 54, 60, 44, .9) + K.P(K.rect(20, 54, 60, 44)) + tt(50, 81, '1', 16) + K.P(K.line(88, 76, 112, 76), { w: 2.4 }) + `<path d="M110 70l9 6l-9 6z" class="k"/>` + fill(124, 34, 60, 64, .9, 'k') + K.P(K.rect(124, 34, 60, 64)) + tt(154, 72, '× 2', 16, { c: 'tw' });
    s += tt(100, 22, 'Livret A : 1,7 % par an', 11, { c: 'kt' }) + tt(100, 120, 'combien d’années ?', 11, { c: 'ts' });
    return SV(s, 'Un capital qui double'); },
  /* chapitre 5 · statistique à deux variables */
  r2gauge: () => { let s = '';
    [['droite', .984, 46], ['exponentielle', .997, 86]].forEach(([l, v, y]) => { s += tt(14, y - 8, l, 10, { a: 'start', c: 'ts' }) + `<rect x="14" y="${y}" width="172" height="14" rx="7" fill="#EEF0F7"/><rect x="14" y="${y}" width="${(172 * v).toFixed(1)}" height="14" rx="7" class="k"/>` + tt(186, y - 8, 'R² = ' + String(v).replace('.', ','), 10, { a: 'end', c: 'kt' }); });
    s += tt(100, 122, 'plus près de 1 = meilleur', 11);
    return SV(s, 'Deux jauges de R² : 0,984 et 0,997'); },
  zlog: () => { const P2 = FEVAD.map(([a, v]) => [a - 2017, v]); const g = MCVP.plot({ W: 200, H: 130, ml: 30, mr: 8, mt: 8, mb: 22, fs: 9, x: [0, 6, 2], y: [1.8, 2.3, .1], lab: 'Les points (x ; log y) sont alignés' });
    return SV(g.base + g.pts(P2.map(([x, y]) => [x, Math.log10(y)]), { r: 3.6 }) + g.line(.0497, 1.9061, { stroke: '#C2332A', w: 1.8 }) + tt(120, 22, 'z = log(y)', 11, { c: 'kt' }), 'Les points (x ; log y) des ventes en ligne sont alignés'); },
  prixVentes: () => mini({ x: [0, 40, 10], y: [0, 160, 40], lab: 'Ventes selon le prix' }, g => g.pts([[10, 138], [15, 101], [20, 82], [25, 67], [30, 61], [40, 49]], { r: 3.6 }) + g.curve(x => 1182.6 / x + 20.9, { a: 7.6, b: 40, stroke: '#755C00', w: 1.8 })),
  prevoir: () => mini({ x: [0, 13, 4], y: [0, 400, 100], lab: 'Deux modèles qui s’écartent' }, g => g.band(0, 6, { fill: '#FFC233', op: .25 }) + g.curve(x => 80.55 * Math.pow(1.121, x), { stroke: '#B05200', w: 2 }) + g.line(13.23, 76.86, { stroke: '#1D5FC2', w: 2 }) + g.pts(FEVAD.map(([a, v]) => [a - 2017, v]), { r: 2.8 })),
  /* chapitre 6 · probabilités */
  colis: () => { const K = Sketch(561); let s = fill(24, 50, 70, 52, .9) + K.P(K.rect(24, 50, 70, 52)) + K.P(K.line(24, 66, 94, 66), { w: 1.6 }) + tt(59, 90, 'D', 14);
    s += fill(110, 50, 70, 52, .9, 'k') + K.P(K.rect(110, 50, 70, 52)) + tt(145, 82, 'M', 16, { c: 'tw' }) + tt(59, 40, '60 %', 12, { c: 'kt' }) + tt(145, 40, '40 %', 12, { c: 'kt' }) + tt(100, 124, 'domicile ou magasin ?', 11, { c: 'ts' });
    return SV(s, 'Deux colis : livraison à domicile ou retrait en magasin'); },
  arbreMini: () => { let s = `<circle cx="20" cy="65" r="5" fill="#1D2240"/><path d="M24 63L86 30M24 67L86 100M106 30L170 14M106 30L170 46M106 100L170 84M106 100L170 116" stroke="#1D2240" stroke-width="1.8"/>`;
    [[96, 30, 'D'], [96, 100, 'M'], [180, 14, 'R'], [180, 46, 'R̄'], [180, 84, 'R'], [180, 116, 'R̄']].forEach(([x, y, l]) => { s += `<circle cx="${x}" cy="${y}" r="10" class="k2 ks" stroke-width="1.6"/>` + tt(x, y + 4, l, 10); });
    s += tt(50, 40, '0,6', 10, { c: 'kt' }) + tt(50, 98, '0,4', 10, { c: 'kt' }) + tt(136, 16, '0,15', 9, { c: 'kt' });
    return SV(s, 'Un arbre pondéré à deux étapes'); },
  retour: () => { const K = Sketch(562); let s = fill(40, 44, 80, 56, .9) + K.P(K.rect(40, 44, 80, 56)) + K.P(K.line(40, 60, 120, 60), { w: 1.6 });
    s += K.P(K.curve(x => 30 + 0.02 * (x - 150) * (x - 150), 128, 172), { w: 2.4 }) + `<path d="M124 46l4 -12l8 10z" class="k"/>` + tt(150, 88, 'retour', 12, { c: 'kt' }) + tt(80, 120, 'sachant « livré à domicile »', 10, { c: 'ts' });
    return SV(s, 'Un colis retourné'); },
  indep: () => { let s = `<rect x="40" y="16" width="120" height="100" fill="#fff" stroke="#9aa3c7"/><rect x="40" y="16" width="48" height="100" class="k2"/><rect x="40" y="16" width="120" height="30" fill="none" stroke="#C2332A" stroke-width="2"/><rect x="40" y="16" width="48" height="30" class="k" opacity=".85"/>`;
    s += tt(64, 128, 'carte 0,4', 9, { c: 'ts' }) + tt(186, 34, '0,3', 10, { c: 'kt' }) + tt(64, 36, '0,12', 10, { c: 'tw' });
    return SV(s, 'Un carré découpé : la part commune vaut 0,4 × 0,3 = 0,12'); },
  /* chapitre 7 · exponentielle et logarithme népérien (poursuite d’études) */
  euler: () => mini({ x: [0, 12, 4], y: [1.8, 2.8, .5], lab: '(1 + 1/n) puissance n se rapproche de e' }, g => g.seg(0, Math.E, 12, Math.E, { stroke: '#C2332A', dash: '5 4', w: 1.6 }) + g.pts([1, 2, 3, 4, 6, 8, 12].map(n => [n, Math.pow(1 + 1 / n, n)]), { r: 3.4 }) + g.txt(11.8, 2.62, 'e ≈ 2,718', { a: 'end', fs: 10, fill: '#C2332A', cls: '' })),
  expTan: () => mini({ x: [-2, 2, 1], y: [0, 6, 2], zeroAxes: true, lab: 'La courbe de e puissance x et sa tangente en 0' }, g => g.curve(x => Math.exp(x), { stroke: '#1E7F45', w: 2.4 }) + g.line(1, 1, { stroke: '#C2332A', w: 1.6, dash: '5 4' }) + g.dot(0, 1, { r: 3.4 })),
  lnSym: () => mini({ x: [-1, 4, 1], y: [-1, 4, 1], zeroAxes: true, lab: 'Les courbes de exp et ln, symétriques' }, g => g.curve(x => Math.exp(x), { stroke: '#1E7F45', w: 2.2 }) + g.curve(x => Math.log(x), { a: .3, b: 4, stroke: '#7438C0', w: 2.2 }) + g.line(1, 0, { stroke: '#545B7A', w: 1.2, dash: '4 3' })),
  bts: () => { const K = Sketch(571); let s = K.P(K.poly([[100, 20], [176, 44], [100, 68], [24, 44]], true)) + `<path d="M100 20L176 44L100 68L24 44Z" class="k" opacity=".85"/>` + K.P(K.line(56, 56, 56, 86) + K.line(144, 56, 144, 86)) + K.P(K.curve(x => 86 + 0.006 * (x - 100) * (x - 100) - 8, 56, 144)) + K.P(K.line(176, 44, 176, 84), { w: 1.8 }) + `<circle cx="176" cy="88" r="5" class="k"/>`;
    s += tt(100, 120, 'BTS · poursuite d’études', 11, { c: 'kt' });
    return SV(s, 'Une toque de diplômé'); },
};
module.exports = { SK, FEVAD, mini, SV, tt, fill };
