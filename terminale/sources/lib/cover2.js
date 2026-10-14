/* Couverture « Maths et MCV · Tle » : page or (#F5C827), motifs dessinés à main levée, peu opaques,
   qui évoquent les 7 chapitres de terminale (suites, intérêts composés, cubique, exponentielle, nuage de points, arbre pondéré).
   Titre, nom de l’auteur en bas, QR code vers l’appli. viewBox 840 × 1188 (1 unité = 0,25 mm). */
'use strict';
const YEL = '#F5C827', W = '#FFFFFF', MOT = '#4A3700';
/* tirage reproductible pour le tremblé du trait */
function rng(seed) { let a = seed >>> 0; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let R = rng(7);
const j = (k = 1) => (R() - .5) * 2 * k;
const f1 = n => n.toFixed(1);
/* trait à main levée : deux passages légèrement décalés */
function line(x1, y1, x2, y2, k = 2.2) {
  let s = '';
  for (let p = 0; p < 2; p++) { const mx = (x1 + x2) / 2 + j(k * 1.6), my = (y1 + y2) / 2 + j(k * 1.6); s += `M${f1(x1 + j(k))} ${f1(y1 + j(k))}Q${f1(mx)} ${f1(my)} ${f1(x2 + j(k))} ${f1(y2 + j(k))}`; }
  return s;
}
const poly = (pts, closed = false, k) => { let s = ''; const P = closed ? [...pts, pts[0]] : pts; for (let i = 0; i < P.length - 1; i++) s += line(P[i][0], P[i][1], P[i + 1][0], P[i + 1][1], k); return s; };
const rect = (x, y, w, h, k) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], true, k);
function circle(cx, cy, r, k = 1.6) {
  let s = ''; for (let p = 0; p < 2; p++) { const n = 26, a0 = R() * 6.28; let d = '';
    for (let i = 0; i <= n + 2; i++) { const a = a0 + i / n * 6.283, rr = r + j(k); d += (i ? 'L' : 'M') + f1(cx + rr * Math.cos(a)) + ' ' + f1(cy + rr * Math.sin(a)); } s += d; }
  return s;
}
const curve = (fn, x1, x2, n = 30) => { let d = ''; for (let i = 0; i <= n; i++) { const x = x1 + (x2 - x1) * i / n, y = fn(x) + j(.8); d += (i ? 'L' : 'M') + f1(x) + ' ' + f1(y); } return d; };
const P = (d, o = {}) => `<path d="${d}" fill="none" stroke="${o.c || MOT}" stroke-width="${o.w || 4}" stroke-linecap="round" stroke-linejoin="round"/>`;
const TX = (x, y, s, fs, o = {}) => `<text x="${x}" y="${y}" font-family="Andika" font-size="${fs}" font-weight="700" fill="${o.c || MOT}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.r ? ` transform="rotate(${o.r} ${x} ${y})"` : ''}>${s}</text>`;
const G = (x, y, rot, sc, op, body) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})" opacity="${op}">${body}</g>`;

/* ---------- les motifs (dessinés autour de (0,0), environ 200 × 160) ---------- */
const M = {
  // 1 · prix, marges, TVA : étiquette − 30 % et × 1,2
  tag: () => P(poly([[-90, 0], [-50, -50], [100, -50], [100, 50], [-50, 50]], true) + circle(-50, 0, 10)) + TX(30, 18, '−30 %', 46, { a: 'middle' }) + P(line(-70, 60, -110, 110), { w: 3 }),
  coef: () => TX(0, 0, '× 1,2', 70, { a: 'middle' }) + P(line(-80, 22, 80, 18) + line(60, 8, 82, 18) + line(60, 30, 82, 18), { w: 3.5 }),
  // 2 · statistique : diagramme en barres et boîte à moustaches
  bars: () => P(line(-100, 70, 100, 70) + line(-100, 70, -100, -80) + [[-80, 30], [-40, -10], [0, 10], [40, -50]].map(([x, h]) => rect(x, h, 28, 70 - h)).join('') + curve(x => -40 - (x + 66) * .35, -66, 54)),
  box: () => P(line(-110, 0, -60, 0) + rect(-60, -30, 110, 60) + line(-10, -30, -10, 30) + line(50, 0, 120, 0) + line(-110, -14, -110, 14) + line(120, -14, 120, 14)),
  // 3 · premier degré : balance
  balance: () => P(line(0, -80, 0, 70) + line(-60, 70, 60, 70) + line(-100, -60, 100, -60) + line(-100, -60, -125, 0) + line(-100, -60, -75, 0) + line(100, -60, 75, 0) + line(100, -60, 125, 0) + curve(x => 0 + (x + 100) ** 2 / 200 - 12.5, -125, -75) + curve(x => (x - 100) ** 2 / 200 - 12.5, 75, 125)) + TX(-100, -12, 'x', 40, { a: 'middle' }) + TX(100, -12, '7', 40, { a: 'middle' }),
  // 4 · factures : ticket de caisse et pièces
  ticket: () => P(poly([[-60, -90], [60, -90], [60, 80], [45, 95], [30, 80], [15, 95], [0, 80], [-15, 95], [-30, 80], [-45, 95], [-60, 80]], true) + [-60, -40, -20, 0].map(y => line(-42, y, 42, y)).join('') + line(-42, 35, 42, 35, 1)) + TX(0, 66, 'TOTAL', 22, { a: 'middle' }),
  coins: () => P(circle(-30, 0, 34) + circle(-30, 0, 22) + circle(35, 15, 30)) + TX(-30, 12, '€', 34, { a: 'middle' }),
  // 5 · fonctions : axes, droite et parabole
  graph: () => P(line(-110, 80, 110, 80) + line(-90, 100, -90, -90) + line(100, 70, 110, 80) + line(100, 90, 110, 80) + line(-100, -80, -90, -90) + line(-80, -80, -90, -90) + line(-90, 50, 100, -60) + curve(x => 70 - (x + 10) ** 2 / 60, -75, 55)),
  // 6 · probabilités : dé et arbre
  die: () => P(poly([[-50, -20], [10, -50], [70, -25], [10, 5]], true) + poly([[-50, -20], [-50, 50], [10, 80], [10, 5]]) + poly([[10, 80], [70, 50], [70, -25]]) + circle(10, -22, 5, .8) + circle(-30, 15, 5, .8) + circle(-10, 45, 5, .8) + circle(40, 30, 5, .8)),
  tree: () => P(circle(-100, 0, 6, .8) + line(-94, 0, -20, -55) + line(-94, 0, -20, 55) + [[-20, -55], [-20, 55]].map(([x, y]) => line(x + 8, y, 90, y - 28) + line(x + 8, y, 90, y + 4) + line(x + 8, y, 90, y + 34)).join('')) + TX(-60, -40, '½', 30, { a: 'middle' }),
  // 7 · géométrie : cube et triangle rectangle
  cube: () => P(rect(-70, -30, 100, 100) + poly([[-70, -30], [-30, -70], [70, -70], [30, -30]]) + poly([[70, -70], [70, 30], [30, 70]])),
  tri: () => P(curve(x => -50 + x * x / 120, -90, 90) + line(-100, 90, 100, 90) + line(-90, 100, -90, -80) + line(-60, 60, 70, -20, 2.5)) + TX(10, 125, 'f ′(a)', 34, { a: 'middle' }),
  // 8 · croisement : tableau croisé
  table: () => P([-90, -45, 0, 45, 90].map(x => line(x, -70, x, 70)).join('') + [-70, -35, 0, 35, 70].map(y => line(-90, y, 90, y)).join('') + line(-90, -70, -45, -35)) + TX(22, 24, '✓', 30, { a: 'middle' }) + TX(68, 60, 'N', 30, { a: 'middle' }),
  // petits signes
  bag: () => P(poly([[-50, -20], [50, -20], [60, 70], [-60, 70]], true) + curve(x => -20 - Math.sqrt(Math.max(0, 900 - x * x)) * 1.2, -30, 30)),
  cart: () => P(poly([[-90, -50], [-60, -50], [-40, 30], [60, 30], [75, -25], [-50, -25]]) + circle(-30, 55, 12) + circle(50, 55, 12)),
  expo: () => P(line(-90, 70, 90, 70) + line(-90, 70, -90, -80)) + P(curve(x => 60 - 9 * Math.pow(1.5, (x + 90) / 30), -90, 90), { w: 5 }),
  cubic: () => P(line(-90, 0, 90, 0) + line(0, -80, 0, 80)) + P(curve(x => -((x / 40) ** 3 - 3 * (x / 40)) * 22, -85, 85), { w: 5 }),
  nuage: () => P(line(-90, 70, 90, 70) + line(-90, 70, -90, -80)) + [[-70, 50], [-50, 38], [-30, 30], [-10, 8], [10, 0], [30, -20], [50, -30], [70, -55]].map(([x, y]) => P(circle(x, y, 6, .8), { w: 3.4 })).join('') + P(line(-80, 60, 80, -55, 1), { w: 2.6 }),
  log: () => TX(0, 0, 'log', 70, { a: 'middle' }),
  qn: () => TX(0, 0, 'q<tspan font-size="50" dy="-30">n</tspan>', 90, { a: 'middle' }),
  pct: () => TX(0, 0, '%', 90, { a: 'middle' }),
  sigma: () => TX(0, 0, 'Σ', 110, { a: 'middle' }),
  pi: () => TX(0, 0, 'π', 80, { a: 'middle' }),
  star: () => P(line(-20, 0, 20, 0) + line(0, -20, 0, 20) + line(-12, -12, 12, 12, 1) + line(-12, 12, 12, -12, 1), { w: 3 })
};

function cover(o = {}) {
  R = rng(7);
  const qr = o.qr || '';
  let s = `<svg viewBox="0 0 840 1188" xmlns="http://www.w3.org/2000/svg" class="cvsvg"><defs>
<linearGradient id="cvbg" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#FCE27C"/><stop offset=".5" stop-color="#F5C827"/><stop offset="1" stop-color="#E2A600"/></linearGradient>
<radialGradient id="cvglow" cx=".25" cy=".2" r=".7"><stop offset="0" stop-color="#FFF6D0" stop-opacity=".6"/><stop offset="1" stop-color="#FFF6D0" stop-opacity="0"/></radialGradient></defs>
<rect width="840" height="1188" fill="url(#cvbg)"/><rect width="840" height="1188" fill="url(#cvglow)"/>`;
  // motifs : [nom, x, y, rotation, échelle, opacité]
  const L = [['expo', 150, 140, -6, 1, .22], ['bars', 660, 150, 6, .95, .2], ['qn', 420, 150, 0, .9, .16], ['star', 290, 60, 0, 1, .3],
    ['coins', 130, 380, 4, .9, .2], ['cubic', 720, 400, -5, .95, .2], ['log', 330, 330, -6, .7, .16], ['pct', 560, 320, 10, .8, .14],
    ['ticket', 90, 820, 8, .9, .2], ['nuage', 735, 830, -4, .95, .22], ['sigma', 290, 860, 0, .7, .14], ['tree', 470, 950, 6, .75, .18],
    ['tag', 200, 1000, -3, .8, .16], ['star', 760, 280, 0, .8, .3], ['star', 60, 560, 0, .7, .26], ['star', 560, 800, 0, .9, .24]];
  L.forEach(([k, x, y, r, sc, op]) => { s += G(x, y, r, sc, op, M[k]()); });
  // titre
  s += `<g font-family="Inter">`;
  s += `<rect x="70" y="420" width="700" height="330" rx="40" fill="#1D2240" opacity=".92"/>`;
  s += `<text x="110" y="492" font-size="24" font-weight="800" fill="${YEL}" letter-spacing="3" textLength="620" lengthAdjust="spacingAndGlyphs">MATHÉMATIQUES · TERMINALE BAC PRO</text>`;
  s += `<text x="106" y="596" font-size="92" font-weight="800" fill="${W}" letter-spacing="-2" textLength="620" lengthAdjust="spacingAndGlyphs">Maths et MCV</text>`;
  s += `</g>` + `<path d="${line(110, 628, 470, 622, 2.5)}" fill="none" stroke="${YEL}" stroke-width="9" stroke-linecap="round"/>`;
  s += `<g font-family="Inter"><text x="110" y="690" font-size="38" font-weight="700" fill="${W}">Métiers de la relation client</text>`;
  s += `<text x="110" y="728" font-size="27" font-weight="700" fill="${YEL}">Commerce · Vente · Accueil</text></g>`;
  // bas de page : auteur et QR code
  s += `<rect x="0" y="1040" width="840" height="148" fill="#1D2240" opacity=".9"/>`;
  s += `<g font-family="Inter"><text x="70" y="1108" font-size="26" font-weight="800" fill="${W}">Tom Rougeaud</text>`;
  s += `<text x="70" y="1140" font-size="20" font-weight="700" fill="#FCE7A0">Manuel de l’élève et appli en ligne</text></g>`;
  if (qr) { s += `<rect x="636" y="958" width="152" height="182" rx="18" fill="${W}"/><g transform="translate(648 970) scale(${(128 / +qr.vb.split(' ')[2]).toFixed(4)})">${qr.body}</g><text x="712" y="1124" font-family="Inter" font-size="17" font-weight="800" fill="#1D2240" text-anchor="middle">L’appli · terminale</text>`; }
  return s + '</svg>';
}
module.exports = { cover, M };
