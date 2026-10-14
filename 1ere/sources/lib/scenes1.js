/* 1re — scènes « Au travail » (une par chapitre) : dessin au trait, sans visage. */
'use strict';
const { Sketch, esc } = require('./visu');
const SV = (w, h, body, lab) => `<svg viewBox="0 0 ${w} ${h}" class="pic scene" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(lab)}">${body}</svg>`;
const tint = (x, y, w, h, op = .9, rx = 4) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="k2" opacity="${op}"/>`;
const acc = (x, y, w, h, op = .85, rx = 4) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="k" opacity="${op}"/>`;
const jar = (K, x, y, w, h, hot) => (hot ? acc(x, y, w, h, .85, 3) : tint(x, y, w, h, .9, 3)) + K.P(K.rect(x, y, w, h)) + K.P(K.line(x + w / 2, y, x + w / 2, y - 7), { w: 2 }) + `<path d="M${x + w / 2} ${y - 8}q-5 -8 0 -16q5 8 0 16z" class="k" opacity=".9"/>`;
const SC = {
  c1: () => { const K = Sketch(311); let s = '';
    s += tint(40, 40, 340, 14, .9) + K.P(K.line(40, 54, 380, 54)) + K.P(K.line(40, 120, 380, 120));
    [[60, 22], [110, 18], [160, 22], [210, 20], [260, 24], [310, 20]].forEach(([x, h], i) => { s += jar(K, x, 54 - h - 2, 36, h, i % 3 === 1); });
    [[60, 28], [110, 30], [170, 26], [230, 28], [290, 30]].forEach(([x, h], i) => { s += jar(K, x, 120 - h - 2, 40, h, i === 2); });
    s += K.P(K.line(40, 40, 40, 200) + K.line(380, 40, 380, 200)) + K.P(K.line(40, 200, 380, 200));
    s += tint(420, 70, 140, 120, .6) + K.P(K.rect(420, 70, 140, 120)) + K.P(K.rect(434, 82, 112, 30)) + K.tx(490, 104, '1 200 €', 18);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) s += K.P(K.rect(436 + c * 28, 124 + r * 20, 22, 14), { w: 1.6 });
    s += acc(80, 150, 70, 30, .9, 6) + K.P(K.rect(80, 150, 70, 30)) + K.tx(115, 172, '12 €', 20, { c: '#fff' });
    return SV(600, 230, s, 'Un atelier de bougies : étagères, bougies, une étiquette de prix et une calculatrice'); },
  c2: () => { const K = Sketch(321); let s = '';
    s += K.P(K.line(30, 200, 570, 200)) + tint(40, 60, 170, 110, .55) + K.P(K.rect(40, 60, 170, 110)) + K.tx(125, 92, 'OFFRE A', 20) + K.tx(125, 124, '25 € par jour', 16) + K.tx(125, 150, 'sans frais', 14);
    s += tint(230, 60, 170, 110, .55) + K.P(K.rect(230, 60, 170, 110)) + K.tx(315, 92, 'OFFRE B', 20) + K.tx(315, 124, '60 € + 15 €', 16) + K.tx(315, 150, 'par jour', 14);
    s += K.P(K.rect(430, 50, 140, 120)) + tint(436, 56, 128, 108, .5);
    s += K.P(K.line(446, 150, 446, 66) + K.line(446, 150, 556, 150)) + K.P(K.line(446, 150, 550, 80)) + K.P(K.line(446, 120, 550, 100), { w: 2.2 });
    s += `<circle cx="505" cy="108" r="6" class="k"/>` + K.P(K.line(40, 170, 40, 200) + K.line(210, 170, 210, 200) + K.line(230, 170, 230, 200) + K.line(400, 170, 400, 200));
    return SV(600, 230, s, 'Deux panneaux d’offres de location et un graphique où deux droites se croisent'); },
  c3: () => { const K = Sketch(331); let s = '';
    s += K.P(K.poly([[100, 70], [260, 22], [420, 70]], true)) + acc(104, 62, 312, 14, .6, 2) + K.P(K.line(120, 72, 120, 200) + K.line(400, 72, 400, 200));
    s += tint(130, 140, 260, 60, .55) + K.P(K.rect(130, 140, 260, 60));
    [[160, 112], [210, 110], [260, 112], [310, 110]].forEach(([x, y]) => { s += jar(K, x, y, 30, 28, (x / 50 | 0) % 2 === 0); });
    s += K.P(K.rect(440, 40, 130, 100)) + tint(446, 46, 118, 88, .5) + K.P(K.line(456, 120, 556, 120) + K.line(456, 120, 456, 56)) + K.P(K.curve(x => 120 - (1 - Math.pow((x - 506) / 46, 2)) * 56, 460, 552, 26), { w: 3 }) + `<circle cx="506" cy="64" r="6" class="k"/>`;
    s += K.tx(260, 176, 'stand du marché', 16) + K.tx(505, 30, 'bénéfice', 15);
    return SV(600, 230, s, 'Un stand de marché et un tableau avec la courbe du bénéfice en forme de parabole'); },
  c4: () => { const K = Sketch(341); let s = '';
    s += K.P(K.line(30, 205, 570, 205)) + K.P(K.rect(60, 40, 300, 150)) + tint(66, 46, 288, 138, .45);
    s += K.P(K.line(86, 164, 340, 164) + K.line(86, 164, 86, 62)) + K.P(K.curve(x => 150 - 0.0016 * Math.pow(x - 160, 2) * 3 - 0, 90, 330, 30), { w: 3.4 }) + K.P(K.line(110, 100, 250, 52), { w: 2.4 }).replace('stroke="#2B2D7C"', 'stroke="#C2332A"') + `<circle cx="180" cy="76" r="6" class="k"/>`;
    s += K.tx(210, 44, 'prix et bénéfice', 14) + K.tx(330, 182, 'prix', 12);
    s += K.P(K.rect(410, 90, 150, 90)) + tint(416, 96, 138, 78, .6) + K.tx(485, 128, '14,90 €', 22) + K.tx(485, 156, '− 10 %', 16);
    s += K.P(K.line(430, 190, 430, 205) + K.line(540, 190, 540, 205));
    return SV(600, 230, s, 'Un tableau avec la courbe du bénéfice, une tangente, et une étiquette de prix'); },
  c5: () => { const K = Sketch(351); let s = '';
    s += K.P(K.line(30, 205, 570, 205));
    for (let r = 0; r < 5; r++) for (let c = 0; c <= r; c++) { const x = 140 - r * 28 + c * 56, y = 205 - (5 - r) * 30 + 0 - 0; s += (c % 2 ? acc : tint)(x, y - 30 + 30 * 0 - 0, 52, 28, .85, 3) + K.P(K.rect(x, y - 30, 52, 28), { w: 1.8 }); }
    s += K.tx(140, 30, 'chaque rang : une boîte de plus', 15);
    ['10 €', '15 €', '20 €'].forEach((v, i) => { s += tint(360 + i * 70, 120 - i * 20, 62, 60 + i * 20, .6) + K.P(K.rect(360 + i * 70, 120 - i * 20, 62, 60 + i * 20)) + K.tx(391 + i * 70, 150 - i * 20, v, 15) + K.tx(391 + i * 70, 172 - i * 20, 'mois ' + (i + 1), 12); });
    s += K.P(K.line(380, 100, 420, 80) + K.line(450, 80, 490, 60), { w: 2.2 });
    return SV(600, 230, s, 'Une pyramide de boîtes en vitrine et trois cartes d’abonnement de prix croissant'); },
  c6: () => { const K = Sketch(361); let s = '';
    s += K.P(K.rect(60, 40, 300, 160)) + tint(66, 46, 288, 148, .45) + K.P(K.line(90, 170, 340, 170) + K.line(90, 170, 90, 62));
    [[110, 150], [140, 138], [168, 140], [200, 120], [230, 112], [260, 100], [292, 90], [322, 76]].forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="5" class="k"/>`; });
    s += K.P(K.line(100, 158, 332, 70), { w: 2.4 }).replace('stroke="#2B2D7C"', 'stroke="#C2332A"') + K.tx(210, 38, 'budget pub et ventes', 14);
    s += K.P(K.poly([[430, 120], [500, 90], [500, 160], [430, 130]], true)) + acc(500, 100, 14, 50, .85, 3) + K.P(K.line(430, 130, 440, 170) + K.line(440, 170, 460, 170)) + K.tx(500, 190, 'publicité', 14);
    s += K.P(K.line(526, 100, 548, 90) + K.line(526, 125, 552, 125) + K.line(526, 150, 548, 160), { w: 2.4 });
    return SV(600, 230, s, 'Un tableau avec un nuage de points et une droite, et un porte-voix de publicité'); },
  c7: () => { const K = Sketch(371); let s = '';
    s += tint(40, 120, 260, 80, .55) + K.P(K.rect(40, 120, 260, 80)) + K.P(K.rect(70, 70, 70, 50)) + tint(76, 76, 58, 38, .8) + K.tx(105, 100, '82 %', 16);
    s += K.P(K.rect(190, 76, 90, 44)) + K.P(K.line(190, 98, 280, 98) + K.line(235, 76, 235, 120)) + tint(194, 80, 38, 16, .9) + acc(238, 102, 38, 16, .7);
    s += K.P(K.rect(350, 50, 200, 140)) + tint(356, 56, 188, 128, .4);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) s += K.P(K.rect(370 + c * 54, 76 + r * 34, 54, 34), { w: 1.6 });
    s += K.tx(450, 68, 'satisfaction × canal', 13);
    s += acc(372, 78, 50, 30, .6, 2);
    return SV(600, 230, s, 'Un comptoir d’accueil avec une tablette et un tableau croisé d’enquête'); },
  c8: () => { const K = Sketch(381); let s = '';
    s += K.P(K.line(30, 205, 570, 205)) + K.P(K.poly([[60, 110], [200, 110], [200, 200], [60, 200]], true) + K.poly([[60, 110], [90, 80], [230, 80], [200, 110]], true) + K.poly([[200, 110], [230, 80], [230, 170], [200, 200]], true)) + tint(62, 112, 136, 86, .55) + K.tx(130, 160, '40 × 30 × 25', 15);
    s += K.P(K.circ(330, 130, 40)) + `<ellipse cx="330" cy="100" rx="36" ry="10" class="k2 ks" stroke-width="2"/>` + K.P(K.line(294, 100, 294, 170) + K.line(366, 100, 366, 170)) + `<path d="M294 170a36 10 0 0 0 72 0" class="ks" fill="none" stroke-width="2.4"/>` + K.tx(330, 196, 'pot de 8 cm', 13);
    s += K.P(K.poly([[430, 200], [490, 120], [550, 200]], true)) + K.P(K.line(430, 200, 550, 200)) + K.P(K.line(490, 120, 490, 200), { w: 1.8 });
    s += K.P(K.line(30, 56, 300, 56), { w: 2.4 }) + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => K.P(K.line(30 + i * 30, 56, 30 + i * 30, i % 5 ? 64 : 72), { w: 1.6 })).join('');
    return SV(600, 230, s, 'Un carton, un pot cylindrique, une pyramide et un mètre ruban'); }
};
module.exports = { SC };
