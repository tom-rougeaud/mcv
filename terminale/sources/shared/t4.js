/* Terminale · chapitre 4 — Fonctions exponentielles et logarithme décimal : x ↦ qˣ, propriétés, log, équations et inéquations. */
(function (root) {
  'use strict';
  const { DEP, TR, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, rnd, tb, sb, T, svg, table, num, qcm, pick, int, P } = H;
  const axis = m => { const raw = m / 4, p = Math.pow(10, Math.floor(Math.log10(raw))), step = [1, 2, 2.5, 5, 10].map(k => k * p).find(v => v >= raw); return [Math.ceil(m / step - 1e-9) * step, step]; };
  const L10 = Math.log10, sup = n => String(n).replace('-', '⁻').split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'['0123456789'.indexOf(c)] || c).join('');

  /* point de départ : les chiffres clés du commerce en ligne en 2025 (Fevad) et les puissances de 10 */
  DEP.c4 = R => {
    const doc = `<table class="dt tcx dt-sm"><thead><tr><th>Chiffre clé 2025</th><th>Valeur</th><th>Ordre de grandeur</th></tr></thead><tbody><tr><th>Chiffre d’affaires</th><td data-cell="ca">196,4 milliards d’euros</td><td>10¹¹ €</td></tr><tr><th>Nombre de transactions</th><td data-cell="tr">3,2 milliards</td><td>10⁹</td></tr><tr><th>Sites marchands actifs</th><td data-cell="si">158 200</td><td>10⁵</td></tr><tr><th>Panier moyen</th><td data-cell="pm">62 €</td><td>10¹ €</td></tr></tbody></table><p class="srcl">Source : Fevad, chiffres clés du e-commerce 2026 (bilan de l’année 2025).</p>`;
    const k = int(R, 0, 1), n = pick(R, [3, 4, 5, 6]);
    return { titre: 'Le commerce en ligne en chiffres', doc,
      qs: [k ? { t: 'Combien y a-t-il de sites marchands actifs ?', kind: 'tap', cell: 'si', v: 158200, tol: .01, a: '158 200' } : { t: 'Quel est le panier moyen ?', kind: 'tap', cell: 'pm', v: 62, tol: .01, a: '62 €' },
        { t: `Écris 10${sup(n)} en écriture décimale.`, kind: 'num', v: 10 ** n, tol: .01, a: fr(10 ** n) },
        { t: 'Un milliard, c’est 10 puissance…', kind: 'num', v: 9, tol: .01, a: '9' },
        { t: `log(10${sup(n)}) = ?`, kind: 'num', v: n, tol: .01, a: String(n) },
        { t: 'Le logarithme décimal de 158 200 est compris entre :', kind: 'qcm', choices: ['5 et 6', '6 et 7', '158 et 159'], ok: 0, a: '5 et 6 : 10⁵ ≤ 158 200 < 10⁶' }] };
  };

  /* e1 · une fonction exponentielle : valeurs, sens de variation */
  TR.c4e1 = R => {
    const k = pick(R, [100, 500, 1000, 2000]), q = pick(R, [1.2, 1.5, 2, .5, .8, .9]), f = x => k * Math.pow(q, x), up = q > 1;
    const xs = [-1, 0, 1, 2, .5];
    const items = [num('a', f(-1), 2, fr(rnd(f(-1), 2)), [{ v: -k * q, m: 'Une puissance d’exposant négatif n’est pas négative : q⁻¹ = 1 ÷ q.' }, { v: k * q, m: 'q⁻¹ = 1 ÷ q : on divise par q, on ne multiplie pas.' }]), num('b', k, 2, fr(k), [{ v: 0, m: 'q⁰ = 1, donc f(0) = ' + fr(k) + ' × 1.' }]), num('c', f(2), 2, fr(rnd(f(2), 2)), [{ v: k * q * 2, m: 'q² = q × q : l’exposant n’est pas un facteur.' }]),
      num('d', rnd(f(.5), 2), 2, fr(rnd(f(.5), 2)), [{ v: rnd(k * q / 2, 2), m: 'q puissance 0,5 n’est pas q ÷ 2 : utilise la touche puissance.' }]), qcm('e', ['croissante', 'décroissante'], up ? 0 : 1, up ? `croissante : q = ${fr(q)} > 1` : `décroissante : 0 < q = ${fr(q)} < 1`)];
    const cells = [tb('a', items[0].a, 16), tb('b', items[1].a, 16), fr(rnd(f(1), 2)), tb('c', items[2].a, 16), tb('d', items[3].a, 18)];
    const [ym, ys] = axis(Math.max(f(-1), f(3)) * 1.05), g = P.plot({ W: 600, H: 200, x: [-1, 3, 1], y: [0, ym, ys], ml: 64, mt: 12, mb: 30, zeroAxes: false, fine: true, lab: 'Courbe de f' });
    return { titre: 'Une fonction exponentielle', consigne: `f(x) = ${fr(k)} × ${fr(q)}ˣ. Complète le tableau de valeurs au centième, puis donne le sens de variation.`,
      support: table(['x', '− 1', '0', '1', '2', '0,5'], [['f(x)', ...cells]], 'dt-c') + `<div class="wfig">${g.wrap(g.base + g.curve(f, { stroke: P.ORG, w: 3 }) + g.dot(0, k, { r: 4.5 }))}</div><p class="tr-l">e. La fonction f est :</p>`, items,
      hints: ['q⁰ = 1 pour tout q : f(0) = ' + fr(k) + '.', 'q⁻¹ = 1 ÷ q ; q² = q × q.', 'q > 1 : croissante ; 0 < q < 1 : décroissante.'] };
  };

  /* e2 · propriétés opératoires des puissances et du logarithme */
  TR.c4e2 = R => {
    const q = pick(R, [1.02, 1.05, 2, 3, 0.9]), a = int(R, 2, 7), b = int(R, 2, 5), c = int(R, 2, 4), n = int(R, 2, 6), A = pick(R, [2, 3, 5]), B2 = pick(R, [4, 7, 20]);
    let s = '';
    const line = (y, left, k, ans) => T(30, y, left, { fs: 15, a: 'start' }) + sb(440, y - 21, 110, k, ans, 28);
    s += line(32, `a. ${fr(q)}${sup(a)} × ${fr(q)}${sup(b)} = ${fr(q)} puissance`, 'a', String(a + b));
    s += line(74, `b. ${fr(q)}${sup(a + b)} ÷ ${fr(q)}${sup(b)} = ${fr(q)} puissance`, 'b', String(a));
    s += line(116, `c. (${fr(q)}${sup(b)})${sup(c)} = ${fr(q)} puissance`, 'c', String(b * c));
    s += line(158, `d. log(10${sup(n)}) =`, 'd', String(n));
    s += line(200, `e. log(${A} × ${B2}) = log(${A}) + log(…) ; … =`, 'e', String(B2));
    const items = [num('a', a + b, 0, String(a + b), [{ v: a * b, m: 'On multiplie deux puissances de même base : on additionne les exposants.' }]), num('b', a, 0, String(a), [{ v: (a + b) / b, m: 'On divise deux puissances de même base : on soustrait les exposants.' }]), num('c', b * c, 0, String(b * c), [{ v: b + c, m: 'Une puissance de puissance : on multiplie les exposants.' }]),
      num('d', n, 0, String(n), [{ v: 10 ** n, m: 'log(10ⁿ) est l’exposant n, pas le nombre 10ⁿ.' }]), num('e', B2, 0, String(B2), [{ v: A * B2, m: 'Le logarithme d’un produit est la somme des logarithmes de chaque facteur.' }])];
    return { titre: 'Les propriétés opératoires', consigne: 'Complète chaque égalité avec la bonne propriété.', support: svg(600, 220, s, 'Cinq égalités à compléter'), items,
      hints: ['qᵃ × qᵇ = qᵃ⁺ᵇ ; qᵃ ÷ qᵇ = qᵃ⁻ᵇ.', '(qᵃ)ᵇ = qᵃˣᵇ.', 'log(10ⁿ) = n ; log(a × b) = log(a) + log(b).'] };
  };

  /* e3 · résoudre qˣ = a, 10ˣ = b, log x = a, puis une inéquation */
  TR.c4e3 = R => {
    const q = pick(R, [1.02, 1.03, 1.05, 1.08, 1.1]), a = pick(R, [2, 1.5, 3]), x1 = rnd(L10(a) / L10(q), 2), b = pick(R, [1000, 50, 0.01, 2.5]), x2 = rnd(L10(b), 2), c = pick(R, [2, -1, 0.5, 3]), x3 = rnd(Math.pow(10, c), 4);
    const d = pick(R, [.8, .85, .9]), half = rnd(L10(.5) / L10(d), 2), nmin = Math.ceil(L10(.5) / L10(d) - 1e-9);
    const rows = [[`${fr(q)}ˣ = ${fr(a)}`, `x = log(${fr(a)}) ÷ log(${fr(q)}) ≈ ${tb('a', fr(x1), 18)}`], [`10ˣ = ${fr(b)}`, `x = log(${fr(b)}) ≈ ${tb('b', fr(x2), 18)}`], [`log(x) = ${fr(c)}`, `x = 10<sup>${fr(c)}</sup> = ${tb('c', fr(x3), 18)}`], [`${fr(d)}ˣ ≤ 0,5`, `x ≥ ${tb('d', fr(half), 18)} ; plus petit entier : ${tb('e', String(nmin), 12)}`]];
    const items = [num('a', x1, 2, fr(x1), [{ v: rnd(a / q, 2), m: 'On ne divise pas a par q : on divise les logarithmes, log(a) ÷ log(q).' }, { v: rnd(L10(a / q), 2), m: 'C’est log(a) ÷ log(q), et non log(a ÷ q).' }]), num('b', x2, 2, fr(x2), [{ v: b / 10, m: '10ˣ = b donne x = log(b) : utilise la touche log.' }]), num('c', x3, 4, fr(x3), [{ v: 10 * c, m: '10 puissance c, ce n’est pas 10 × c.' }]),
      num('d', half, 2, fr(half), [{ v: rnd(-half, 2), m: 'log(' + fr(d) + ') est négatif : en divisant, le sens de l’inégalité change, et le résultat est positif.' }]), num('e', nmin, 0, String(nmin), [{ v: nmin - 1, m: 'On cherche un entier au moins égal à ' + fr(half) + ' : on arrondit à l’entier supérieur.' }])];
    return { titre: 'Résoudre avec le logarithme', consigne: 'Résous chaque équation au centième, puis l’inéquation.', support: table(['Équation', 'Solution'], rows), items,
      hints: ['qˣ = a donne x = log(a) ÷ log(q).', '10ˣ = b donne x = log(b) ; log(x) = c donne x = 10ᶜ.', 'Si 0 < q < 1, log(q) < 0 : en divisant, on change le sens de l’inégalité.'] };
  };
  if (typeof module !== 'undefined') module.exports = {};
})(typeof module !== 'undefined' ? module.exports : window);
