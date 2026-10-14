/* Terminale · chapitre 5 — Statistique à deux variables : choisir un modèle, R², changements de variable, interpoler, extrapoler. */
(function (root) {
  'use strict';
  const { DEP, TR, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, rnd, tb, sb, T, svg, table, num, qcm, pick, int, P, xs } = H;
  const fit = Pts => { const n = Pts.length, mx = Pts.reduce((s, p) => s + p[0], 0) / n, my = Pts.reduce((s, p) => s + p[1], 0) / n, sxx = Pts.reduce((s, p) => s + (p[0] - mx) ** 2, 0), sxy = Pts.reduce((s, p) => s + (p[0] - mx) * (p[1] - my), 0), syy = Pts.reduce((s, p) => s + (p[1] - my) ** 2, 0), a = sxy / sxx; return { a, b: my - a * mx, r2: sxy * sxy / (sxx * syy) }; };
  H.fit2 = fit;
  const axis = m => { const raw = m / 4, p = Math.pow(10, Math.floor(Math.log10(raw))), step = [1, 2, 2.5, 5, 10].map(k => k * p).find(v => v >= raw); return [Math.ceil(m / step - 1e-9) * step, step]; };
  const noise = (R, k) => 1 + (R() - .5) * 2 * k;

  /* point de départ : le nombre de transactions en ligne (Fevad), 2019 à 2023 */
  const TRS = [[2019, 1.72], [2020, 1.81], [2021, 2.11], [2022, 2.24], [2023, 2.35]];
  DEP.c5 = R => {
    const k = int(R, 0, 4);
    const tabl = `<table class="dt tcx dt-sm dt-c"><thead><tr><th>Année</th>${TRS.map(([a]) => `<th>${a}</th>`).join('')}</tr></thead><tbody><tr><th>Transactions (milliards)</th>${TRS.map(([a, v], i) => `<td data-cell="${i}">${fr(v)}</td>`).join('')}</tr></tbody></table>`;
    const g = P.plot({ W: 600, H: 210, x: [2018.5, 2023.5, 1], y: [0, 2.5, .5], xt: TRS.map(([a]) => [a, String(a)]), ml: 46, mt: 14, mb: 30, yl: 'milliards', fine: true });
    return { titre: 'Les achats en ligne en France', doc: tabl + `<div class="wfig">${g.wrap(g.base + g.pts(TRS, { r: 5 }))}</div><p class="srcl">Nombre de transactions en ligne, en milliards. Source : Fevad, chiffres clés 2024.</p>`,
      qs: [{ t: `Combien de transactions en ${TRS[k][0]} ?`, kind: 'tap', cell: String(k), v: TRS[k][1], tol: .001, a: fr(TRS[k][1]) + ' milliards' },
        { t: 'De combien de milliards le nombre de transactions a-t-il augmenté de 2019 à 2023 ?', kind: 'num', v: .63, tol: .001, a: '2,35 − 1,72 = 0,63' },
        { t: 'Le nombre de transactions augmente-t-il chaque année ?', kind: 'qcm', choices: ['oui', 'non'], ok: 0, a: 'oui : chaque point est plus haut que le précédent' },
        { t: 'Quelle est l’année moyenne des cinq années du tableau ?', kind: 'num', v: 2021, tol: .01, a: '2021' },
        { t: 'Prévoir 2025 avec un modèle construit sur 2019-2023, c’est faire une…', kind: 'qcm', choices: ['extrapolation', 'interpolation'], ok: 0, a: 'extrapolation : 2025 est en dehors des années observées' }] };
  };

  /* e1 · choisir le meilleur modèle avec R² (comme dans un tableur) */
  TR.c5e1 = R => {
    const kind = R() < .5 ? 'exp' : 'aff', N = [0, 1, 2, 3, 4, 5];
    const k0 = pick(R, [40, 60, 80, 120]), q0 = pick(R, [1.15, 1.2, 1.25]), a0 = pick(R, [8, 12, 15]), b0 = pick(R, [40, 60, 100]);
    const pts = N.map(x => [x, rnd((kind === 'exp' ? k0 * Math.pow(q0, x) : a0 * x + b0) * noise(R, .04), 1)]);
    const fa = fit(pts), fe = fit(pts.map(([x, y]) => [x, Math.log10(y)]));
    const A = rnd(fa.a, 2), B = rnd(fa.b, 2), Q = rnd(Math.pow(10, fe.a), 3), Kk = rnd(Math.pow(10, fe.b), 2), r2a = rnd(fa.r2, 4), r2e = rnd(fe.r2, 4);
    if (r2a === r2e) return TR.c5e1(R);
    const best = r2e > r2a ? 1 : 0, xp = 8, xi = 2.5;
    const pa = x => rnd(A * x + B, 1), pe = x => rnd(Kk * Math.pow(Q, x), 1), pb = best ? pe : pa, po = best ? pa : pe;
    const [ym, ys] = axis(Math.max(...pts.map(p => p[1])) * 1.1);
    const g = P.plot({ W: 600, H: 240, x: [0, 6, 1], y: [0, ym, ys], ml: 50, mt: 14, mb: 30, xl: 'rang x', yl: 'y', fine: true });
    const s = g.base + g.line(A, B, { stroke: P.BLUE, w: 2, dash: '7 5' }) + g.curve(x => Kk * Math.pow(Q, x), { stroke: P.ORG, w: 2.4 }) + g.pts(pts, { r: 5 })
      + `<rect x="60" y="18" width="270" height="56" rx="8" fill="#fff" stroke="#DCE2F2"/>` + T(70, 40, `affine : y = ${fr(A)}x + ${fr(B)} · R² = ${fr(r2a)}`, { fs: 12.5, a: 'start', fill: P.BLUE }) + T(70, 62, `exponentiel : y = ${fr(Kk)} × ${fr(Q)}ˣ · R² = ${fr(r2e)}`, { fs: 12.5, a: 'start', fill: P.ORG });
    const items = [qcm('a', ['le modèle affine', 'le modèle exponentiel'], best, best ? `exponentiel : R² = ${fr(r2e)} est plus proche de 1` : `affine : R² = ${fr(r2a)} est plus proche de 1`),
      num('b', pb(xp), 1, fr(pb(xp)), [{ v: po(xp), m: 'Tu as utilisé l’autre modèle. Prends celui dont R² est le plus proche de 1.' }]),
      num('c', po(xp), 1, fr(po(xp)), [{ v: pb(xp), m: 'Ici, on demande la prévision de l’autre modèle.' }]),
      qcm('d', ['une interpolation', 'une extrapolation'], 1, 'une extrapolation : x = 8 est en dehors des données (0 à 5)'),
      num('e', pb(xi), 1, fr(pb(xi)), [{ v: po(xi), m: 'Utilise le modèle choisi à la question a.' }])];
    const ex = (x, aff) => aff ? `y = ${fr(A)} × ${fr(x)} + ${fr(B)} ≈ ${fr(pa(x))}` : `y = ${fr(Kk)} × ${fr(Q)}^${fr(x)} ≈ ${fr(pe(x))}`;
    xs(items, { b: ex(xp, !best), c: ex(xp, !!best), e: ex(xi, !best) });
    return { titre: 'Choisir le meilleur ajustement', consigne: 'Le tableur affiche deux courbes de tendance. Choisis le modèle, puis calcule les prévisions au dixième.',
      support: table(['x', ...pts.map(p => String(p[0]))], [['y', ...pts.map(p => fr(p[1]))]], 'dt-c') + svg(600, 240, s, 'Nuage de points avec une droite et une courbe exponentielle d’ajustement') + `<p class="tr-l">a. Le modèle le plus adapté est :</p><p class="tr-l">b. Prévision pour x = 8 avec ce modèle : ${tb('b', fr(pb(xp)), 18)} · c. avec l’autre modèle : ${tb('c', fr(po(xp)), 18)}</p><p class="tr-l">d. Prévoir pour x = 8, c’est faire :</p><p class="tr-l">e. Estimation pour x = 2,5 avec le modèle choisi : ${tb('e', fr(pb(xi)), 18)}</p>`, items,
      hints: ['Le meilleur modèle est celui dont R² est le plus proche de 1.', 'Remplace x par 8 dans l’équation du modèle.', 'Interpolation : à l’intérieur des données ; extrapolation : en dehors.'] };
  };

  /* e2 · le changement de variable z = log(y) */
  TR.c5e2 = R => {
    const k0 = pick(R, [20, 50, 80, 150]), q0 = pick(R, [1.3, 1.5, 1.8, 2]), N = [0, 1, 2, 3, 4];
    const pts = N.map(x => [x, rnd(k0 * Math.pow(q0, x) * noise(R, .05), 1)]), z = pts.map(([x, y]) => rnd(Math.log10(y), 3));
    const f = fit(pts.map(([x, y]) => [x, Math.log10(y)])), A = rnd(f.a, 4), B = rnd(f.b, 4), Q = rnd(Math.pow(10, A), 3), Kk = rnd(Math.pow(10, B), 2), y6 = rnd(Kk * Math.pow(Q, 6), 1);
    const cells = z.map((v, i) => i === 1 ? tb('a', fr(v), 14) : i === 2 ? tb('b', fr(v), 14) : i === 3 ? tb('c', fr(v), 14) : fr(v));
    const items = [num('a', z[1], 3, fr(z[1]), [{ v: rnd(Math.log(pts[1][1]), 3), m: 'Utilise la touche log (logarithme décimal), pas ln.' }]), num('b', z[2], 3, fr(z[2])), num('c', z[3], 3, fr(z[3])),
      num('d', Q, 3, fr(Q), [{ v: rnd(A, 3), m: 'q = 10 puissance A : il faut calculer 10^' + fr(A) + '.' }]), num('e', y6, 1, fr(y6), [{ v: rnd(A * 6 + B, 1), m: 'Tu as calculé z. Pour y, calcule 10^z ou ' + fr(Kk) + ' × ' + fr(Q) + '⁶.' }])];
    xs(items, { a: `z = log(${fr(pts[1][1])}) ≈ ${fr(z[1])}`, b: `z = log(${fr(pts[2][1])}) ≈ ${fr(z[2])}`, c: `z = log(${fr(pts[3][1])}) ≈ ${fr(z[3])}`, d: `q = 10^${fr(A)} ≈ ${fr(Q)} (et k = 10^${fr(B)} ≈ ${fr(Kk)})`, e: `y ≈ ${fr(Kk)} × ${fr(Q)}⁶ ≈ ${fr(y6)}` });
    return { titre: 'Le changement de variable z = log(y)', consigne: 'Complète la ligne z = log(y) au millième. Le tableur donne ensuite la droite z = Ax + B.',
      support: table(['x', ...N.map(String)], [['y', ...pts.map(p => fr(p[1]))], ['z = log(y)', ...cells]], 'dt-c') + `<p class="tr-l">Le tableur donne : z = ${fr(A)}x + ${fr(B)}. On en déduit y = 10<sup>z</sup> = ${fr(Kk)} × qˣ.</p><p class="tr-l">d. q = 10<sup>${fr(A)}</sup> ≈ ${tb('d', fr(Q), 16)} · e. Prévision pour x = 6 : y ≈ ${fr(Kk)} × ${fr(Q)}⁶ ≈ ${tb('e', fr(y6), 18)}</p>`, items,
      hints: ['z = log(y) : touche log de la calculatrice.', 'Si z = Ax + B, alors y = 10^B × (10^A)ˣ.', 'Pour x = 6 : y = 10^B × q⁶, avec q = 10^A.'] };
  };

  /* e3 · le changement de variable z = 1/x (prix et ventes) */
  TR.c5e3 = R => {
    const a0 = pick(R, [900, 1200, 1500]), b0 = pick(R, [10, 20, 30]), X = [10, 15, 20, 25, 30, 40];
    const pts = X.map(x => [x, Math.round((a0 / x + b0) * noise(R, .03))]), z = X.map(x => rnd(1 / x, 4));
    const f = fit(pts.map(([x, y]) => [1 / x, y])), fl = fit(pts), A = rnd(f.a, 1), B = rnd(f.b, 1), r2z = rnd(f.r2, 4), r2l = rnd(fl.r2, 4), x0 = pick(R, [12, 35, 50]), y0 = rnd(A / x0 + B, 1);
    const cells = z.map((v, i) => i === 1 ? tb('a', fr(v), 16) : i === 3 ? tb('b', fr(v), 16) : i === 5 ? tb('c', fr(v), 16) : fr(v));
    const items = [num('a', z[1], 4, fr(z[1]), [{ v: 15, m: 'z = 1 ÷ x : divise 1 par le prix.' }]), num('b', z[3], 4, fr(z[3])), num('c', z[5], 4, fr(z[5])),
      num('d', y0, 1, fr(y0), [{ v: rnd(A * x0 + B, 1), m: 'Dans le modèle, on remplace z par 1 ÷ ' + x0 + ', pas par ' + x0 + '.' }]), qcm('e', ['le modèle en z = 1 ÷ x', 'la droite en x'], r2z >= r2l ? 0 : 1, r2z >= r2l ? `le modèle en z : R² = ${fr(r2z)} contre ${fr(r2l)}` : `la droite : R² = ${fr(r2l)}`)];
    xs(items, { a: `z = 1 ÷ 15 ≈ ${fr(z[1])}`, b: `z = 1 ÷ 25 = ${fr(z[3])}`, c: `z = 1 ÷ 40 = ${fr(z[5])}`, d: `z = 1 ÷ ${x0} ; y = ${fr(A)} ÷ ${x0} + ${fr(B)} ≈ ${fr(y0)}` });
    return { titre: 'Le changement de variable z = 1/x', consigne: `Ventes par semaine d’un article (boutique fictive) selon son prix x en euros. Complète z = 1/x au dix-millième, puis utilise le modèle.`,
      support: table(['prix x (€)', ...X.map(String)], [['ventes y', ...pts.map(p => String(p[1]))], ['z = 1/x', ...cells]], 'dt-c') + `<p class="tr-l">Le tableur donne : y = ${fr(A)}z + ${fr(B)}, avec R² = ${fr(r2z)}. La droite y = ax + b donne R² = ${fr(r2l)}.</p><p class="tr-l">d. Ventes prévues pour un prix de ${x0} € : ${tb('d', fr(y0), 18)}</p><p class="tr-l">e. Le modèle le plus adapté est :</p>`, items,
      hints: ['z = 1 ÷ x : pour x = 15, z = 1 ÷ 15.', `Pour un prix de ${x0} €, z = 1 ÷ ${x0}, puis y = ${fr(A)} × z + ${fr(B)}.`, 'Le meilleur modèle a le R² le plus proche de 1.'] };
  };
  if (typeof module !== 'undefined') module.exports = {};
})(typeof module !== 'undefined' ? module.exports : window);
