/* 1re · chapitre 6 — Statistique à deux variables : nuage, point moyen, ajustement affine, R², prévision. */
(function (root) {
  'use strict';
  const { DEP, TR, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, rnd, tb, T, num, qcm, pick, int, P } = H;
  const BLUE = P.BLUE, RED = P.RED;
  const pas = h => h <= 10 ? 2 : h <= 25 ? 5 : h <= 50 ? 10 : h <= 100 ? 20 : 50;
  /* nuage aléatoire autour de y = a x + b, bruit d’amplitude e */
  const nuage = (R, n, a, b, e, x0 = 1) => { const P2 = []; for (let i = 0; i < n; i++) { const x = x0 + i; P2.push([x, Math.round(a * x + b + (R() * 2 - 1) * e)]); } return P2; };
  const repN = (pts, o = {}) => { const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), xm = o.xmax || Math.max(...xs) + 1, lo = Math.min(...ys, ...(o.ex || [])), hi = Math.max(...ys, ...(o.ex || [])), st = pas(hi - lo + 1), y0 = Math.max(0, Math.floor(lo / st) * st - st), y1 = Math.ceil(hi / st) * st + st;
    return P.plot({ W: 600, H: 270, x: [0, xm, 1], y: [y0, y1, st], ml: 50, mt: 26, mb: 36, fine: true, cls: 'pic vis trs', lab: o.lab || 'Nuage de points', xl: o.xl, yl: o.yl }); };
  const ligne = (head, rows) => `<table class="dt tcx dt-sm dt-c"><tbody>${rows.map((r, i) => `<tr><th>${head[i]}</th>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

  /* point de départ : température et ventes de boissons fraîches */
  DEP.c6 = R => {
    const t = [8, 11, 14, 17, 20, 23, 26], a = pick(R, [4, 5, 6]), b = pick(R, [10, 20, 30]), v = t.map(x => Math.round(a * x + b + (R() * 2 - 1) * 6));
    const k = int(R, 0, 6), imax = v.indexOf(Math.max(...v));
    const tab = `<table class="dt tcx dt-sm dt-c"><tbody><tr><th>Température (°C)</th>${t.map(x => `<td>${x}</td>`).join('')}</tr><tr><th>Boissons vendues</th>${v.map((x, i) => `<td data-cell="${i}">${x}</td>`).join('')}</tr></tbody></table>`;
    const g = P.plot({ W: 600, H: 230, x: [0, 30, 5], y: [0, Math.ceil(Math.max(...v) / 50) * 50 + 50, 50], ml: 50, mt: 26, mb: 36, xl: '°C', yl: 'boissons', fine: true });
    return { titre: 'Les ventes de boissons fraîches d’un kiosque', doc: tab + `<div class="wfig">${g.wrap(g.base + g.pts(t.map((x, i) => [x, v[i]]), { r: 5 }))}</div><p class="srcl">Ventes moyennes par jour selon la température. Kiosque fictif.</p>`,
      qs: [{ t: `Combien de boissons sont vendues quand il fait ${t[k]} °C ?`, kind: 'tap', cell: String(k), v: v[k], tol: .01, a: String(v[k]) },
        { t: 'Quand la température augmente, les ventes ont tendance à…', kind: 'qcm', choices: ['augmenter', 'diminuer', 'rester pareilles'], ok: 0, a: 'augmenter : le nuage monte vers la droite' },
        { t: 'Pour quelle température les ventes sont-elles les plus fortes ?', kind: 'num', v: t[imax], tol: .01, a: `${t[imax]} °C` },
        { t: 'Les points du nuage sont…', kind: 'qcm', choices: ['presque alignés', 'dispersés au hasard'], ok: 0, a: 'presque alignés : une droite peut les résumer' },
        { t: 'Combien de points compte le nuage ?', kind: 'num', v: 7, tol: .01, a: '7' }] };
  };

  /* e1 · le point moyen */
  TR.c6e1 = R => {
    const n = 5, a = pick(R, [2, 3, 4, -2, -3]), b = a > 0 ? pick(R, [5, 10, 15]) : pick(R, [30, 35, 40]), pts = nuage(R, n, a, b, 2);
    const xm = rnd(pts.reduce((s, p) => s + p[0], 0) / n, 2), ym = rnd(pts.reduce((s, p) => s + p[1], 0) / n, 2);
    const g = repN(pts, { lab: 'Nuage de cinq points', xl: 'x', yl: 'y' });
    const items = [num('a', xm, 1, fr(xm)), num('b', ym, 1, fr(ym), [{ v: rnd(pts.reduce((s, p) => s + p[1], 0), 2), m: 'Tu as fait la somme. Divise-la par le nombre de points, 5.' }]), qcm('c', ['croissante', 'décroissante'], a > 0 ? 0 : 1, a > 0 ? 'croissante : le nuage monte' : 'décroissante : le nuage descend')];
    return { titre: 'Le point moyen', consigne: 'Calcule les coordonnées du point moyen G : la moyenne des x, puis la moyenne des y. Puis indique la tendance du nuage.', support: ligne(['x', 'y'], [pts.map(p => p[0]), pts.map(p => p[1])]) + g.wrap(g.base + g.pts(pts, { r: 5.5 })) + `<p class="tr-l">a. x̄ = ${tb('a', items[0].a, 14)} &nbsp; b. ȳ = ${tb('b', items[1].a, 14)}</p><p class="tr-l">c. La tendance du nuage est :</p>`, items,
      hints: ['Additionne les 5 valeurs de x, puis divise par 5.', 'Fais de même avec les 5 valeurs de y.', 'Si le nuage monte de gauche à droite, la tendance est croissante.'] };
  };

  /* e2 · prévoir avec une droite d’ajustement */
  TR.c6e2 = R => {
    const a = pick(R, [1.5, 2, 2.5, 3]), b = pick(R, [8, 10, 12, 15]), pts = nuage(R, 6, a, b, 1.5), x1 = pick(R, [3.5, 4.5, 5.5]), x2 = pick(R, [9, 10]), yt = pick(R, [20, 24, 26]);
    const f = x => rnd(a * x + b, 2), xs = rnd((yt - b) / a, 2);
    const g = repN(pts, { xmax: 11, ex: [f(11)], lab: 'Nuage et droite d’ajustement', xl: 'x', yl: 'y' });
    const items = [num('a', f(x1), 1, fr(f(x1))), num('b', f(x2), 1, fr(f(x2))), num('c', xs, 1, fr(xs), [{ v: f(yt), m: 'Ici on connaît y : résous a x + b = ' + yt + ' pour trouver x.' }]), qcm('d', ['une interpolation', 'une extrapolation'], 1, `une extrapolation : x = ${x2} est en dehors des données (de 1 à 6)`)];
    return { titre: 'Prévoir avec la droite', consigne: `La droite d’ajustement du nuage a pour équation y = ${fr(a)} x + ${b}. Utilise-la pour estimer.`, support: g.wrap(g.base + g.line(a, b, { stroke: RED, w: 2.6 }) + g.pts(pts, { r: 5.5 })) + `<p class="tr-l">a. Pour x = ${fr(x1)}, y ≈ ${tb('a', items[0].a, 14)} &nbsp; b. Pour x = ${x2}, y ≈ ${tb('b', items[1].a, 14)}</p><p class="tr-l">c. Pour y = ${yt}, x ≈ ${tb('c', items[2].a, 14)} (au dixième)</p><p class="tr-l">d. L’estimation pour x = ${x2} est :</p>`, items,
      hints: ['Remplace x par la valeur donnée dans y = a x + b.', 'Pour trouver x, résous a x + b = y : x = (y − b) ÷ a.', 'Une extrapolation sort de la plage des données.'] };
  };

  /* e3 · lire la sortie d’un tableur */
  TR.c6e3 = R => {
    const good = R() < .6, a = pick(R, [1.8, 2.4, 3.1, 4.2]), b = pick(R, [5, 12, 20]), pts = nuage(R, 7, a, b, good ? 2 : 14), F = P.fit(pts);
    const ar = rnd(F.a, 2), br = rnd(F.b, 2), r2 = rnd(F.r2, 4), x0 = pick(R, [10, 12]);
    const sheet = `<table class="dt tcx dt-sm"><tbody><tr><th>=PENTE(B2:B8;A2:A8)</th><td>${fr(rnd(F.a, 6))}</td></tr><tr><th>=ORDONNEE.ORIGINE(B2:B8;A2:A8)</th><td>${fr(rnd(F.b, 6))}</td></tr><tr><th>=COEFFICIENT.DETERMINATION(B2:B8;A2:A8)</th><td>${fr(r2)}</td></tr></tbody></table>`;
    const g = repN(pts, { lab: 'Nuage de sept points', xl: 'x', yl: 'y' });
    const pertinent = F.r2 >= .9;
    const items = [num('a', ar, 2, fr(ar)), num('b', br, 2, fr(br)), qcm('c', ['oui', 'non'], pertinent ? 0 : 1, pertinent ? `oui : R² = ${fr(r2)} est proche de 1` : `non : R² = ${fr(r2)} est loin de 1`), num('d', rnd(ar * x0 + br, 2), 1, fr(rnd(ar * x0 + br, 2)))];
    return { titre: 'Lire un tableur', consigne: 'Un tableur a calculé la droite d’ajustement (moindres carrés) et R². Arrondis a et b au centième, juge l’ajustement (ici, on le dit pertinent si R² ≥ 0,9), puis fais une estimation avec les valeurs arrondies.', support: g.wrap(g.base + g.pts(pts, { r: 5.5 })) + sheet + `<p class="tr-l">a. a ≈ ${tb('a', items[0].a, 14)} &nbsp; b. b ≈ ${tb('b', items[1].a, 14)}</p><p class="tr-l">c. Un ajustement affine est-il pertinent ?</p><p class="tr-l">d. Pour x = ${x0}, y ≈ ${tb('d', items[3].a, 14)} (avec a et b arrondis)</p>`, items,
      hints: ['La pente est a, l’ordonnée à l’origine est b : y = a x + b.', 'Plus R² est proche de 1, plus les points sont proches de la droite.', 'Remplace x par la valeur donnée dans y = a x + b.'] };
  };
  if (typeof module !== 'undefined') module.exports = { nuage };
  else root.MCVT6 = { nuage };
})(typeof module !== 'undefined' ? module.exports : window);
