/* 1re · chapitre 8 — Géométrie dans l’espace : solides, perspective cavalière, volumes, sections planes.
   Les dessins sont calculés : perspective cavalière (fuyantes à 45°, coefficient 0,5), ellipses pour les cercles horizontaux. */
(function (root) {
  'use strict';
  const { DEP, TR, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, rnd, tb, T, num, qcm, pick, int, shuffle, P, xs: XS } = H;
  const INK = P.INK, ACC = '#FFC233', SEC = '#C2332A', PL = '#7438C0';
  const f1 = n => (Math.round(n * 10) / 10).toString();
  const K = .5, C = Math.SQRT1_2;
  /* perspective cavalière : x (largeur), y (hauteur), z (profondeur) en unités ; s = échelle en px par unité */
  const cav = (ox, oy, s) => (x, y, z) => [ox + x * s + z * s * K * C, oy - y * s - z * s * K * C];
  const L = (a, b, o = {}) => `<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" stroke="${o.stroke || INK}" stroke-width="${o.w || 2.4}"${o.dash ? ' stroke-dasharray="6 5"' : ''} stroke-linecap="round"/>`;
  const poly = (pts, o = {}) => `<polygon points="${pts.map(p => f1(p[0]) + ',' + f1(p[1])).join(' ')}" fill="${o.fill || 'none'}" fill-opacity="${o.op == null ? 1 : o.op}" stroke="${o.stroke || 'none'}" stroke-width="${o.w || 0}"/>`;
  /* pavé W × Ht × D : arêtes cachées en pointillés */
  function pave(ox, oy, s, W, Ht, D, o = {}) {
    const p = cav(ox, oy, s), v = (x, y, z) => p(x * W, y * Ht, z * D);
    const A = v(0, 0, 0), B = v(1, 0, 0), Cc = v(1, 1, 0), Dd = v(0, 1, 0), E = v(0, 0, 1), F = v(1, 0, 1), G = v(1, 1, 1), Hh = v(0, 1, 1);
    let s2 = (o.fill ? poly([A, B, Cc, Dd], { fill: o.fill, op: .55 }) + poly([B, F, G, Cc], { fill: o.fill, op: .35 }) + poly([Dd, Cc, G, Hh], { fill: o.fill, op: .25 }) : '');
    s2 += [[A, E], [E, F], [E, Hh]].map(([a, b]) => L(a, b, { dash: 1, w: 1.8 })).join('');
    if (o.cut) s2 += o.cut(v);
    s2 += [[A, B], [B, Cc], [Cc, Dd], [Dd, A], [B, F], [F, G], [G, Cc], [G, Hh], [Hh, Dd]].map(([a, b]) => L(a, b)).join('');
    return { svg: s2, v };
  }
  /* ellipse d’un cercle horizontal de rayon r (px) : demi-axe vertical 0,35 r ; arrière en pointillés si demandé */
  const ell = (cx, cy, rx, o = {}) => { const ry = rx * .35; if (o.half) return `<path d="M${f1(cx - rx)} ${f1(cy)}A${f1(rx)} ${f1(ry)} 0 0 0 ${f1(cx + rx)} ${f1(cy)}" fill="none" stroke="${INK}" stroke-width="2.4"/><path d="M${f1(cx - rx)} ${f1(cy)}A${f1(rx)} ${f1(ry)} 0 0 1 ${f1(cx + rx)} ${f1(cy)}" fill="none" stroke="${INK}" stroke-width="1.8" stroke-dasharray="6 5"/>`;
    return `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${o.fill || 'none'}" fill-opacity="${o.op == null ? 1 : o.op}" stroke="${o.stroke || INK}" stroke-width="${o.w || 2.4}"/>`; };
  /* cylindre de rayon r et hauteur h (unités), base au point (cx, by) */
  const cyl = (cx, by, s, r, h, o = {}) => { const rx = r * s, top = by - h * s; return (o.fill ? `<rect x="${f1(cx - rx)}" y="${f1(top)}" width="${f1(2 * rx)}" height="${f1(h * s)}" fill="${o.fill}" opacity=".35"/>` : '') + (o.cut || '') + ell(cx, by, rx, { half: 1 }) + ell(cx, top, rx) + L([cx - rx, by], [cx - rx, top]) + L([cx + rx, by], [cx + rx, top]); };
  /* cône de rayon r et hauteur h */
  const cone = (cx, by, s, r, h, o = {}) => { const rx = r * s, ap = [cx, by - h * s]; return (o.fill ? poly([[cx - rx, by], [cx + rx, by], ap], { fill: o.fill, op: .3 }) : '') + (o.cut || '') + ell(cx, by, rx, { half: 1 }) + L([cx - rx, by], ap) + L([cx + rx, by], ap); };
  /* pyramide à base carrée de côté c, hauteur h */
  const pyr = (ox, oy, s, c, h, o = {}) => { const p = cav(ox, oy, s), A = p(0, 0, 0), B = p(c, 0, 0), Cc = p(c, 0, c), Dd = p(0, 0, c), S = p(c / 2, h, c / 2);
    return (o.fill ? poly([A, B, S], { fill: o.fill, op: .35 }) + poly([B, Cc, S], { fill: o.fill, op: .22 }) : '') + L(A, Dd, { dash: 1, w: 1.8 }) + L(Dd, Cc, { dash: 1, w: 1.8 }) + L(Dd, S, { dash: 1, w: 1.8 }) + (o.cut ? o.cut(p) : '') + [[A, B], [B, Cc], [A, S], [B, S], [Cc, S]].map(([a, b]) => L(a, b)).join(''); };
  /* boule de rayon r : contour, équateur (arrière en pointillés) */
  const boule = (cx, cy, s, r, o = {}) => `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r * s)}" fill="${o.fill || 'none'}" fill-opacity=".3" stroke="${INK}" stroke-width="2.4"/>` + (o.cut || '') + ell(cx, cy, r * s, { half: 1 }) + `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="3" fill="${INK}"/>`;
  const SV = (w, h, body, lab) => `<svg viewBox="0 0 ${w} ${h}" class="pic vis trs" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${lab}">${body}</svg>`;
  /* cote : segment avec texte */
  const cote = (a, b, t, o = {}) => L(a, b, { stroke: SEC, w: 1.6 }) + T(f1((a[0] + b[0]) / 2 + (o.dx || 0)), f1((a[1] + b[1]) / 2 + (o.dy || 0)), t, { fs: o.fs || 14, a: o.a || 'middle', c: 'kt' });
  const PI = Math.PI;

  /* point de départ : fiche technique de trois bougies */
  DEP.c8 = R => {
    const d = pick(R, [6, 8, 10]), h = pick(R, [8, 10, 12]), c = pick(R, [4, 5, 10]), hb = pick(R, [6, 9]);
    const svg = SV(600, 230, cyl(110, 190, 9, d / 2, h, { fill: '#FFF0B8' }) + T(110, 222, 'bougie A', { fs: 14 }) + cone(300, 190, 9, 4, 12, { fill: '#FDE3E0' }) + T(300, 222, 'bougie B', { fs: 14 }) + pave(430, 190, 9, c, hb, c, { fill: '#E0EBFD' }).svg + T(470, 222, 'bougie C', { fs: 14 }), 'Trois bougies : un cylindre, un cône et un pavé');
    const tab = `<table class="dt tcx dt-sm"><thead><tr><th>Bougie</th><th>Forme</th><th>Dimensions (cm)</th></tr></thead><tbody><tr><th>A</th><td>cylindre</td><td>diamètre <span data-cell="0">${d}</span> · hauteur <span data-cell="1">${h}</span></td></tr><tr><th>B</th><td>cône</td><td>diamètre 8 · hauteur 12</td></tr><tr><th>C</th><td>pavé à base carrée</td><td>côté <span data-cell="2">${c}</span> · hauteur ${hb}</td></tr></tbody></table>`;
    return { titre: 'La fiche technique des bougies', doc: `<div class="wfig">${svg}</div>${tab}<p class="srcl">Gamme fictive de l’Atelier Mia.</p>`,
      qs: [{ t: 'Quelle est la hauteur de la bougie A ?', kind: 'tap', cell: '1', v: h, tol: .01, a: `${h} cm` },
        { t: 'Quel est le rayon de la bougie A ?', kind: 'num', v: d / 2, tol: .01, a: `${d} ÷ 2 = ${d / 2} cm` },
        { t: 'Quel est le volume de la bougie C, en cm³ ?', kind: 'num', v: c * c * hb, tol: .01, a: `${c} × ${c} × ${hb} = ${c * c * hb} cm³` },
        { t: 'Quelle bougie a une pointe ?', kind: 'qcm', choices: ['A', 'B', 'C'], ok: 1, a: 'B : le cône a un sommet' },
        { t: 'Combien de cm³ y a-t-il dans 1 litre ?', kind: 'num', v: 1000, tol: .01, a: '1 L = 1 dm³ = 1 000 cm³' }] };
  };

  /* e1 · un carton en perspective cavalière */
  TR.c8e1 = R => {
    const W = pick(R, [30, 40, 50]), Ht = pick(R, [20, 25, 30]), D = pick(R, [20, 30, 40]), s = 230 / (W + D * K * C + 10);
    const { svg, v } = pave(80, 250, s, W, Ht, D, { fill: '#F3E1C7' });
    const body = svg + cote(v(0, 0, 0), v(1, 0, 0), `${W} cm`, { dy: 20 }) + cote(v(1, 0, 0), v(1, 1, 0), `${Ht} cm`, { dx: -36, a: 'middle' }) + cote(v(1, 0, 0), v(1, 0, 1), `${D} cm`, { dx: 34, dy: 14 });
    const V = W * Ht * D;
    const items = [num('a', V, 0, `${V}`, [{ v: W + Ht + D, m: 'Le volume est un produit : longueur × largeur × hauteur.' }]), num('b', V / 1000, 1, fr(V / 1000), [{ v: V / 100, m: '1 L = 1 000 cm³ : divise par 1 000.' }]), num('c', 3, 0, '3'), qcm('d', ['visibles', 'cachées'], 1, 'cachées : en perspective, les arêtes cachées sont en pointillés')];
    XS(items, { a: `V = ${W} × ${Ht} × ${D} = ${fr(V)} cm³`, b: `${fr(V)} ÷ 1 000 = ${fr(V / 1000)} L`, c: 'les trois arêtes qui partent du sommet caché (en bas, à l’arrière)' });
    return { titre: 'Un carton en perspective', consigne: 'Ce carton d’expédition (un pavé droit) est dessiné en perspective cavalière. Calcule son volume, convertis-le en litres, puis observe le dessin.', support: SV(600, 290, body, 'Carton en perspective cavalière') + `<p class="tr-l">a. Volume : ${tb('a', items[0].a, 16)} cm³ &nbsp; b. Volume : ${tb('b', items[1].a, 14)} L</p><p class="tr-l">c. Nombre d’arêtes dessinées en pointillés : ${tb('c', '3', 10)}</p><p class="tr-l">d. Les arêtes en pointillés sont :</p>`, items,
      hints: ['V = longueur × largeur × hauteur.', '1 L = 1 dm³ = 1 000 cm³.', 'Compte les traits en pointillés : ce sont les arêtes qu’on ne voit pas.'] };
  };

  /* e2 · cylindre et cône de même base et même hauteur */
  TR.c8e2 = R => {
    const r = pick(R, [2, 3, 4, 5]), h = pick(R, [6, 9, 12]), s = Math.min(13, 170 / h, 110 / (2 * r) * 1.6);
    const Ab = rnd(PI * r * r, 2), Vc = rnd(PI * r * r * h, 2), Vk = rnd(PI * r * r * h / 3, 2);
    const by = 240, body = cyl(150, by, s, r, h, { fill: '#E0EBFD' }) + cone(430, by, s, r, h, { fill: '#FDE3E0' }) + [150, 430].map(cx => L([cx, by], [cx + r * s, by], { stroke: SEC, w: 1.6 }) + T(cx + r * s / 2, by + .35 * r * s + 18, `r = ${r} cm`, { fs: 13, c: 'kt' }) + L([cx, by], [cx, by - h * s], { stroke: SEC, w: 1.4, dash: 1 }) + T(cx + r * s + 10, by - h * s / 2, `h = ${h} cm`, { fs: 13, a: 'start', c: 'kt' })).join('') + T(150, 24, 'cylindre', { fs: 14 }) + T(430, 24, 'cône', { fs: 14 });
    const items = [num('a', Ab, 2, fr(Ab), [{ v: rnd(2 * PI * r, 2), m: 'C’est le périmètre du cercle. L’aire du disque est π × r².' }]), num('b', Vc, 1, fr(Vc)), num('c', Vk, 1, fr(Vk), [{ v: Vc, m: 'Pour un cône, on divise le volume du cylindre par 3.' }]), num('d', 3, 1, '3')];
    XS(items, { a: `π × ${r}² = ${r * r}π ≈ ${fr(Ab)} cm²`, b: `${r * r}π × ${h} = ${r * r * h}π ≈ ${fr(Vc)} cm³`, c: `${r * r * h}π ÷ 3 = ${fr(r * r * h / 3)}π ≈ ${fr(Vk)} cm³`, d: `${fr(Vc)} ÷ ${fr(Vk)} ≈ 3 : le cylindre contient 3 cônes` });
    return { titre: 'Cylindre et cône', consigne: 'Les deux solides ont la même base et la même hauteur. Calcule au centième, puis compare.', support: SV(600, 290, body, 'Un cylindre et un cône de même base et de même hauteur') + `<p class="tr-l">a. Aire de la base : π × ${r}² ≈ ${tb('a', items[0].a, 16)} cm²</p><p class="tr-l">b. Volume du cylindre ≈ ${tb('b', items[1].a, 16)} cm³ &nbsp; c. Volume du cône ≈ ${tb('c', items[2].a, 16)} cm³</p><p class="tr-l">d. Le volume du cylindre est ${tb('d', '3', 10)} fois celui du cône.</p>`, items,
      hints: ['Aire du disque : π × r × r.', 'Cylindre : aire de la base × hauteur.', 'Cône : aire de la base × hauteur ÷ 3.'] };
  };

  /* e3 · sections planes */
  const SECTIONS = [
    { k: 'pave', rep: 'rectangle', draw: (x, y) => pave(x - 70, y, 4.2, 30, 22, 26, { fill: '#F3E1C7', cut: v => poly([v(0, 0, .5), v(1, 0, .5), v(1, 1, .5), v(0, 1, .5)], { fill: SEC, op: .55, stroke: SEC, w: 2 }) }).svg, txt: 'pavé coupé parallèlement à une face' },
    { k: 'cylH', rep: 'disque', draw: (x, y) => cyl(x, y, 7, 6, 14, { fill: '#E0EBFD', cut: ell(x, y - 7 * 7, 42, { fill: SEC, op: .55, stroke: SEC, w: 2 }) }), txt: 'cylindre coupé parallèlement à la base' },
    { k: 'cylV', rep: 'rectangle', draw: (x, y) => cyl(x, y, 7, 6, 14, { fill: '#E0EBFD', cut: `<rect x="${x - 42}" y="${y - 98}" width="84" height="98" fill="${SEC}" fill-opacity=".5" stroke="${SEC}" stroke-width="2"/>` }), txt: 'cylindre coupé par un plan qui contient son axe' },
    { k: 'cone', rep: 'disque', draw: (x, y) => cone(x, y, 7, 6, 15, { fill: '#FDE3E0', cut: ell(x, y - 7 * 7, 42 * (1 - 7 / 15), { fill: SEC, op: .6, stroke: SEC, w: 2 }) }), txt: 'cône coupé parallèlement à la base' },
    { k: 'pyr', rep: 'carré', draw: (x, y) => pyr(x - 60, y, 4.4, 26, 30, { fill: '#EEE3FB', cut: p => { const t = .45, c = 26, m = c / 2, a = (1 - t) * c / 2; return poly([p(m - a, t * 30, m - a), p(m + a, t * 30, m - a), p(m + a, t * 30, m + a), p(m - a, t * 30, m + a)], { fill: SEC, op: .55, stroke: SEC, w: 2 }); } }), txt: 'pyramide à base carrée coupée parallèlement à la base' },
    { k: 'boule', rep: 'disque', draw: (x, y) => boule(x, y - 60, 7, 8, { fill: '#D6F2F2', cut: ell(x, y - 60 - 20, Math.sqrt(56 * 56 - 20 * 20), { fill: SEC, op: .5, stroke: SEC, w: 2 }) }), txt: 'boule coupée par un plan' }];
  TR.c8e3 = R => {
    const three = shuffle(R, SECTIONS).slice(0, 3), CH = ['rectangle', 'disque', 'triangle', 'carré'];
    let body = ''; three.forEach((S0, i) => { const x = 100 + i * 200; body += S0.draw(x, 210) + T(x, 236, String.fromCharCode(97 + i) + '.', { fs: 16, c: 'kt' }); });
    const r = pick(R, [6, 8, 10]), hh = pick(R, [12, 15, 18]), t = pick(R, [1 / 2, 1 / 3]), rs = rnd(r * t, 2);
    const items = three.map((S0, i) => qcm(String.fromCharCode(97 + i), CH, CH.indexOf(S0.rep), `${S0.rep} : ${S0.txt}`));
    items.push(num('d', rs, 2, fr(rs), [{ v: r, m: 'La section d’un cône est plus petite que sa base : son rayon est réduit.' }]));
    XS(items, { d: `section = réduction de la base : ${r} × ${t === .5 ? '1/2' : '1/3'} = ${fr(rs)} cm` });
    return { titre: 'Des sections planes', consigne: 'Chaque solide est coupé par un plan ; la section est en rouge. Donne sa forme (a, b, c). Puis calcule un rayon de section (d).', support: SV(600, 250, body, 'Trois solides coupés par un plan') + `<p class="tr-l">a., b., c. : rectangle, disque, triangle ou carré ?</p><p class="tr-l">d. Un cône a un rayon de base de ${r} cm et une hauteur de ${hh} cm. On le coupe parallèlement à la base, à ${t === .5 ? 'mi-hauteur' : 'un tiers de la hauteur en partant du sommet'}. Rayon de la section : ${tb('d', items[3].a, 14)} cm</p>`, items,
      hints: ['Un plan parallèle à la base d’un cylindre ou d’un cône donne un disque.', 'Un plan parallèle à une face d’un pavé donne un rectangle identique à cette face.', `La section du cône est une réduction de la base : rayon × ${t === .5 ? '1/2' : '1/3'}.`] };
  };
  const API = { cav, pave, cyl, cone, pyr, boule, ell, L, poly, SV, cote, SECTIONS };
  if (typeof module !== 'undefined') module.exports = API; else root.MCVT8 = API;
})(typeof module !== 'undefined' ? module.exports : window);
