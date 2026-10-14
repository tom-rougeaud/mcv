/* Terminale · chapitre 3 — Fonctions polynômes de degré 3 : fonction cube, dérivée, tableau de variations, nombre de solutions. */
(function (root) {
  'use strict';
  const { DEP, TR, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, rnd, tb, sb, T, svg, table, num, qcm, pick, int, P, esc } = H;
  const sg = n => n < 0 ? '− ' + fr(-n) : fr(n);
  /* écriture d’un polynôme : [[coef, 'x³'], [coef, 'x²'], [coef, 'x'], [coef, '']] */
  const poly = cs => { let o = ''; cs.forEach(([a, s]) => { if (!a) return; const m = (Math.abs(a) === 1 && s ? '' : fr(Math.abs(a))) + s; o += o ? (a < 0 ? ' − ' : ' + ') + m : (a < 0 ? '−' : '') + m; }); return o || '0'; };
  /* flèche simple */
  const arr = (x1, y1, x2, y2, col = '#1D2240') => { const a = Math.atan2(y2 - y1, x2 - x1), h = 9, bx = x2 - h * Math.cos(a), by = y2 - h * Math.sin(a); return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${bx.toFixed(1)} ${by.toFixed(1)}" stroke="${col}" stroke-width="2.4" fill="none"/><path d="M${x2.toFixed(1)} ${y2.toFixed(1)}L${(bx + 5 * Math.sin(a)).toFixed(1)} ${(by - 5 * Math.cos(a)).toFixed(1)}L${(bx - 5 * Math.sin(a)).toFixed(1)} ${(by + 5 * Math.cos(a)).toFixed(1)}Z" fill="${col}"/>`; };
  /* tableau de variations dessiné : xs (textes ou cases), signes entre les xs, valeurs (avec leur niveau) */
  const cell = (c, x, y, w = 72) => typeof c === 'object' ? sb(x - w / 2, y - 19, w, c.k, c.a, 26) : T(x, y, c, { fs: 14 });
  H.tabvar = o => {
    const W = o.W || 600, L = o.L || 150, n = o.xs.length, X = i => L + 46 + i * (W - L - 92) / (n - 1), y0 = 6, h1 = 34, h2 = 34, h3 = 92, f = o.f || 'f';
    let s = `<rect x="2" y="${y0}" width="${W - 4}" height="${h1 + h2 + h3}" rx="6" fill="#fff" stroke="#9aa3c7" stroke-width="1.4"/><line x1="2" y1="${y0 + h1}" x2="${W - 2}" y2="${y0 + h1}" stroke="#9aa3c7" stroke-width="1.4"/><line x1="2" y1="${y0 + h1 + h2}" x2="${W - 2}" y2="${y0 + h1 + h2}" stroke="#9aa3c7" stroke-width="1.4"/><line x1="${L}" y1="${y0}" x2="${L}" y2="${y0 + h1 + h2 + h3}" stroke="#9aa3c7" stroke-width="1.4"/>`;
    s += T(L / 2, y0 + 22, 'x', { fs: 15 }) + T(L / 2, y0 + h1 + 22, `signe de ${f}′(x)`, { fs: 13 }) + T(L / 2, y0 + h1 + h2 + 52, `variations de ${f}`, { fs: 13 });
    o.xs.forEach((c, i) => { s += cell(c, X(i), y0 + 23); });
    o.signs.forEach((c, i) => { s += cell(c, (X(i) + X(i + 1)) / 2, y0 + h1 + 23, 56); });
    for (let i = 1; i < n - 1; i++) s += T(X(i), y0 + h1 + 23, '0', { fs: 14 }) + `<line x1="${X(i)}" y1="${y0 + h1 + 4}" x2="${X(i)}" y2="${y0 + h1 + 8}" stroke="#9aa3c7"/>`;
    const lv = o.vals.map(v => typeof v === 'object' ? v.v : v), hi = lv.map((v, i) => { const l = lv[i - 1], r = lv[i + 1]; return (l == null || v >= l) && (r == null || v >= r) ? 1 : (l == null || v <= l) && (r == null || v <= r) ? 0 : .5; });
    const Y = i => y0 + h1 + h2 + (hi[i] === 1 ? 26 : hi[i] === 0 ? 80 : 52);
    o.vals.forEach((c, i) => { s += cell(typeof c === 'object' ? c : fr(c), X(i), Y(i), 78); });
    for (let i = 0; i < n - 1; i++) { const a = Y(i), b = Y(i + 1), up = b < a; s += arr(X(i) + 30, a + (up ? -10 : 2), X(i + 1) - 34, b + (up ? 2 : -12), '#B05200'); }
    return svg(W, y0 + h1 + h2 + h3 + 8, s, o.lab || 'Tableau de variations');
  };

  /* familles de fonctions de degré 3 : f(x) = s(−x³ + 1,5(a + b)x² − 3abx) + d, de dérivée −3s(x − a)(x − b) */
  const FAM = [{ a: 1, b: 5, d: -10 }, { a: 2, b: 6, d: 0 }, { a: 2, b: 8, d: -20 }, { a: 1, b: 7, d: 5 }, { a: 1, b: 3, d: 2 }, { a: 2, b: 4, d: 10 }];
  const mk = (R, sgn) => { const { a, b, d } = pick(R, FAM), s = sgn || (R() < .7 ? 1 : -1), c3 = -s, c2 = s * 1.5 * (a + b), c1 = -3 * s * a * b; const f = x => c3 * x * x * x + c2 * x * x + c1 * x + d; return { a, b, d, s, c3, c2, c1, f, txt: poly([[c3, 'x³'], [c2, 'x²'], [c1, 'x'], [d, '']]), dtxt: poly([[3 * c3, 'x²'], [2 * c2, 'x'], [c1, '']]) }; };
  /* familles « bénéfice » : le maximum local f(b) dépasse f(0) (b > 3a) */
  const FAMB = FAM.filter(o => o.b > 3 * o.a);
  const mkB = R => { const { a, b, d } = pick(R, FAMB), c3 = -1, c2 = 1.5 * (a + b), c1 = -3 * a * b; const f = x => c3 * x * x * x + c2 * x * x + c1 * x + d; return { a, b, d, s: 1, c3, c2, c1, f, txt: poly([[c3, 'x³'], [c2, 'x²'], [c1, 'x'], [d, '']]) }; };
  /* nombre exact de solutions de f(x) = c sur [lo ; hi], morceau par morceau (f monotone entre les points critiques) */
  const nsol = (F, lo, hi, c) => { const pts = [lo, ...[F.a, F.b].filter(x => x > lo && x < hi), hi], sol = new Set();
    for (let i = 0; i < pts.length - 1; i++) { const p = pts[i], q = pts[i + 1], fp = F.f(p), fq = F.f(q); if (fp === c) sol.add(p); if (fq === c) sol.add(q); if ((fp - c) * (fq - c) < 0) sol.add('in' + i); }
    return sol.size; };
  H.cubic = { FAM, FAMB, mk, mkB, poly, nsol };

  /* point de départ : le graphique d’un bénéfice (degré 3), à lire */
  DEP.c3 = R => {
    const F = mkB(R), x1 = F.b + Math.max(2, Math.round((F.b - F.a) / 2)), vals = [0, F.a, F.b, x1].map(F.f);
    const lo = Math.min(...vals), hiv = Math.max(...vals), st = pick(R, [5, 10, 20].filter(k => (hiv - lo) / k <= 10 && (hiv - lo) / k >= 3)) || 10;
    const g = P.plot({ W: 600, H: 250, x: [0, x1, 1], y: [Math.floor(lo / st) * st, Math.ceil(hiv / st) * st, st], ml: 50, mt: 16, mb: 34, xl: 'x (centaines d’articles)', yl: 'B(x) (centaines d’euros)', zeroAxes: true, fine: true });
    const nz = nsol(F, 0, x1, 0);
    return { titre: 'Le bénéfice mensuel d’un atelier', doc: `<div class="wfig">${g.wrap(g.base + g.curve(F.f, { stroke: P.ORG, w: 3 }) + g.pts([[F.a, F.f(F.a)], [F.b, F.f(F.b)]], { r: 5 }))}</div><p class="srcl">B(x) : bénéfice mensuel, en centaines d’euros, pour x centaines d’articles vendus. Atelier fictif.</p>`,
      qs: [{ t: 'Lis B(0) : le résultat quand l’atelier ne vend rien.', kind: 'num', v: F.d, tol: .01, a: sg(F.d) },
        { t: 'Pour quelle quantité x le bénéfice est-il le plus grand ?', kind: 'num', v: F.b, tol: .01, a: `x = ${F.b}` },
        { t: 'Quel est ce bénéfice maximal (en centaines d’euros) ?', kind: 'num', v: F.f(F.b), tol: .01, a: sg(F.f(F.b)) },
        { t: `Sur l’intervalle [${F.a} ; ${F.b}], la fonction B est…`, kind: 'qcm', choices: ['croissante', 'décroissante'], ok: 0, a: 'croissante : la courbe monte' },
        { t: 'Combien de fois la courbe coupe-t-elle l’axe des abscisses ?', kind: 'num', v: nz, tol: .01, a: String(nz) }] };
  };

  /* e1 · dériver un polynôme de degré 3 */
  TR.c3e1 = R => {
    const a = pick(R, [1, 2, -1, -2, 4, 0.5]), b = pick(R, [3, -6, 4, -1, 0]), c = pick(R, [-5, 12, 7, -9, 2]), d = pick(R, [8, -4, 0, 15]), x0 = int(R, -2, 3);
    const f = x => a * x ** 3 + b * x * x + c * x + d, df = x => 3 * a * x * x + 2 * b * x + c;
    let s = T(300, 26, `f(x) = ${poly([[a, 'x³'], [b, 'x²'], [c, 'x'], [d, '']])}`, { fs: 17 }) + `<path d="M300 38V62" stroke="#1D2240" stroke-width="2.4"/><path d="M293 56L300 68L307 56Z" fill="#1D2240"/>` + T(318, 56, 'on dérive chaque terme', { fs: 12, a: 'start', c: 'ts' });
    s += T(110, 100, 'f′(x) =', { fs: 16, a: 'end' }) + sb(118, 80, 92, 'a', fr(3 * a), 28) + T(222, 100, 'x²  +', { fs: 16, a: 'start' }) + sb(270, 80, 92, 'b', fr(2 * b), 28) + T(374, 100, 'x  +', { fs: 16, a: 'start' }) + sb(416, 80, 92, 'c', fr(c), 28);
    const items = [num('a', 3 * a, 2, fr(3 * a), [{ v: a, m: 'La dérivée de x³ est 3x² : on multiplie le coefficient par 3.' }, { v: a * 3 - 1, m: 'On multiplie par l’exposant 3, on ne retire pas 1 au coefficient.' }]),
      num('b', 2 * b, 2, fr(2 * b), [{ v: b, m: 'La dérivée de x² est 2x : on multiplie le coefficient par 2.' }]),
      num('c', c, 2, fr(c), [{ v: 0, m: 'La dérivée de ' + fr(c) + 'x est ' + fr(c) + ' : seule la constante disparaît.' }]),
      num('d', df(x0), 2, fr(df(x0)), [{ v: f(x0), m: 'Tu as calculé f(' + x0 + '). On demande f′(' + x0 + ') : remplace x dans la dérivée.' }]),
      num('e', f(x0), 2, fr(f(x0)), [{ v: df(x0), m: 'Ça, c’est f′(' + x0 + '). Pour f(' + x0 + '), remplace x dans f(x).' }])];
    return { titre: 'Dériver un polynôme de degré 3', consigne: 'Complète les coefficients de la dérivée, puis calcule f′ et f pour la valeur demandée.', support: svg(600, 120, s, 'La fonction f et les trois coefficients de sa dérivée à compléter') + `<p class="tr-l">d. f′(${x0}) = ${tb('d', fr(df(x0)), 16)} · e. f(${x0}) = ${tb('e', fr(f(x0)), 16)}</p>`, items,
      hints: ['(x³)′ = 3x², (x²)′ = 2x, (x)′ = 1, et la dérivée d’une constante est 0.', 'Un coefficient devant x³ est multiplié par 3 ; devant x², par 2.', `Pour f′(${x0}), remplace x par ${x0} dans f′(x), en respectant les signes.`] };
  };

  /* e2 · du signe de la dérivée au tableau de variations */
  TR.c3e2 = R => {
    const F = mk(R), lo = F.a - pick(R, [1, 2]), hi = F.b + pick(R, [1, 2]);
    const inc1 = F.s < 0;   // s = 1 : − puis + puis −
    const signs = inc1 ? ['+', '−', '+'] : ['−', '+', '−'];
    const vals = [F.f(lo), { k: 'c', a: fr(F.f(F.a)), v: F.f(F.a) }, { k: 'd', a: fr(F.f(F.b)), v: F.f(F.b) }, F.f(hi)];
    const pic = H.tabvar({ xs: [String(lo), { k: 'a', a: String(F.a) }, { k: 'b', a: String(F.b) }, String(hi)], signs, vals, lab: 'Tableau de variations à compléter' });
    const items = [num('a', F.a, 2, String(F.a), [{ v: -F.a, m: 'La dérivée s’annule quand x − ' + F.a + ' = 0, donc pour x = ' + F.a + '.' }]), num('b', F.b, 2, String(F.b), [{ v: -F.b, m: 'Attention au signe : x − ' + F.b + ' = 0 donne x = ' + F.b + '.' }]),
      num('c', F.f(F.a), 2, fr(F.f(F.a)), [{ v: F.f(F.b), m: 'Calcule f(' + F.a + ') : l’image de la première valeur où f′ s’annule.' }]), num('d', F.f(F.b), 2, fr(F.f(F.b)), [{ v: F.f(F.a), m: 'Calcule f(' + F.b + ').' }]),
      qcm('e', [`un maximum local en x = ${F.a}`, `un minimum local en x = ${F.a}`], inc1 ? 0 : 1, inc1 ? `maximum local : f monte puis descend autour de ${F.a}` : `minimum local : f descend puis monte autour de ${F.a}`)];
    return { titre: 'Le tableau de variations', consigne: `f(x) = ${F.txt} sur [${lo} ; ${hi}], et f′(x) = ${F.s > 0 ? '−3' : '3'}(x − ${F.a})(x − ${F.b}). Complète le tableau, puis réponds à e.`, support: pic + `<p class="tr-l">e. La fonction f admet :</p>`, items,
      hints: ['f′(x) s’annule quand un des facteurs vaut 0 : x − a = 0 ou x − b = 0.', 'Là où f′ est positive, f est croissante ; là où f′ est négative, f est décroissante.', 'Les valeurs du tableau sont les images f(a) et f(b).'] };
  };

  /* e3 · nombre de solutions de f(x) = c, puis valeur approchée par balayage */
  TR.c3e3 = R => {
    const F = mkB(R), lo = 0, hi = F.b + Math.max(2, F.b - F.a), V = [F.f(lo), F.f(F.a), F.f(F.b), F.f(hi)];
    const count = c => nsol(F, lo, hi, c);
    const cs = [rnd(F.f(F.b) + pick(R, [3, 5, 10]), 0), rnd((F.f(F.a) + F.f(F.b)) / 2, 0), rnd(F.f(F.b), 0)];
    const ns = cs.map(count);
    // valeur approchée de la plus grande solution de f(x) = 0 sur [b ; hi], si elle existe : on prend c2 sinon
    const c0 = cs[1]; let root = null; { let u = F.b; while (u < hi && F.f(u) > c0) u = rnd(u + .1, 1); root = u; }
    const xs = [rnd(root - .2, 1), rnd(root - .1, 1), root, rnd(root + .1, 1)];
    const pic = H.tabvar({ xs: [String(lo), String(F.a), String(F.b), String(hi)], signs: ['−', '+', '−'], vals: V, lab: 'Tableau de variations de f' });
    const items = [num('a', ns[0], 0, String(ns[0]), [{ v: 1, m: `${fr(cs[0])} est plus grand que le maximum ${fr(V[2])} : la courbe n’atteint jamais cette hauteur.` }]), num('b', ns[1], 0, String(ns[1])), num('c', ns[2], 0, String(ns[2])),
      num('d', rnd(root - .1, 1), 1, fr(rnd(root - .1, 1)))];
    return { titre: 'Combien de solutions ?', consigne: `f(x) = ${F.txt} sur [${lo} ; ${hi}]. Utilise le tableau de variations pour compter les solutions, puis un tableau de valeurs.`,
      support: pic + `<p class="tr-l">Nombre de solutions de : a. f(x) = ${fr(cs[0])} → ${tb('a', String(ns[0]), 10)} · b. f(x) = ${fr(cs[1])} → ${tb('b', String(ns[1]), 10)} · c. f(x) = ${fr(cs[2])} → ${tb('c', String(ns[2]), 10)}</p>`
        + table(['x', ...xs.map(x => fr(x))], [['f(x)', ...xs.map(x => fr(rnd(F.f(x), 3)))]], 'dt-c') + `<p class="tr-l">d. La solution de f(x) = ${fr(c0)} située après x = ${F.b} est comprise entre ${tb('d', fr(rnd(root - .1, 1)), 12)} et ${fr(root)}.</p>`, items,
      hints: ['Dans le tableau, repère les intervalles où f monte et où f descend.', 'Sur chaque intervalle, la valeur c est atteinte une fois si elle est entre les deux valeurs extrêmes.', 'Dans le tableau de valeurs, cherche où f(x) passe au-dessus ou au-dessous de c.'] };
  };
  if (typeof module !== 'undefined') module.exports = {};
})(typeof module !== 'undefined' ? module.exports : window);
