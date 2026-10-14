/* Terminale · chapitre 7 (programme complémentaire, poursuite d’études) — exponentielle de base e et logarithme népérien. */
(function (root) {
  'use strict';
  const { DEP, TR, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, rnd, tb, sb, T, svg, table, num, qcm, pick, int } = H;
  const e2 = x => fr(rnd(x, 2), 2);

  /* point de départ : des intérêts versés de plus en plus souvent */
  DEP.c7 = R => {
    const C = pick(R, [1000, 2000]), N = [1, 2, 4, 12, 365], lab = ['une fois par an', 'deux fois par an', 'quatre fois par an', 'chaque mois', 'chaque jour'];
    const v = n => rnd(C * Math.pow(1 + .12 / n, n), 2), cont = rnd(C * Math.exp(.12), 2), k = int(R, 0, 4);
    const doc = `<table class="dt tcx dt-sm"><thead><tr><th>Intérêts ajoutés…</th><th>Capital au bout d’un an</th></tr></thead><tbody>${N.map((n, i) => `<tr><th>${lab[i]}</th><td data-cell="${i}">${e2(v(n))} €</td></tr>`).join('')}<tr><th>en continu</th><td data-cell="5">${e2(cont)} €</td></tr></tbody></table><p class="srcl">${fr(C)} € placés à 12 % par an, intérêts composés. Exemple de calcul, taux choisi pour bien voir les écarts.</p>`;
    return { titre: 'Des intérêts de plus en plus fréquents', doc,
      qs: [{ t: `Quel est le capital si les intérêts sont ajoutés ${lab[k]} ?`, kind: 'tap', cell: String(k), v: v(N[k]), tol: .006, a: e2(v(N[k])) + ' €' },
        { t: 'Quel est le capital avec des intérêts ajoutés une fois par an ?', kind: 'num', v: C * 1.12, tol: .006, a: e2(C * 1.12) + ' €' },
        { t: 'Plus les intérêts sont ajoutés souvent, plus le capital est…', kind: 'qcm', choices: ['grand', 'petit'], ok: 0, a: 'grand : les intérêts produisent des intérêts plus tôt' },
        { t: 'Le capital augmente-t-il sans limite ?', kind: 'qcm', choices: ['non, il se rapproche d’une valeur', 'oui, il grandit sans fin'], ok: 0, a: `non : il se rapproche de ${e2(cont)} €` },
        { t: 'Le nombre e vaut environ 2,718. Arrondi au dixième, cela donne…', kind: 'num', v: 2.7, tol: .01, a: '2,7' }] };
  };

  /* e1 · calculer avec e */
  TR.c7e1 = R => {
    const a = int(R, 2, 5), b = int(R, 1, 4), x = pick(R, [2, -1, .5, 3]);
    let s = T(300, 26, 'e ≈ 2,718 : la touche eˣ de la calculatrice', { fs: 14, c: 'kt' });
    const line = (y, left, k, ans) => T(30, y, left, { fs: 15, a: 'start' }) + sb(400, y - 21, 130, k, ans, 28);
    s += line(64, 'a. e⁰ =', 'a', '1') + line(104, `b. e^${fr(x)} ≈ (au millième)`, 'b', fr(rnd(Math.exp(x), 3))) + line(144, `c. e^${a} × e^${b} = e puissance`, 'c', String(a + b)) + line(184, `d. e^${a + b} ÷ e^${b} = e puissance`, 'd', String(a)) + line(224, 'e. 1 ÷ e² = e puissance', 'e', '−2');
    const items = [num('a', 1, 0, '1', [{ v: 0, m: 'Tout nombre (non nul) à la puissance 0 vaut 1 : e⁰ = 1.' }]), num('b', rnd(Math.exp(x), 3), 3, fr(rnd(Math.exp(x), 3)), [{ v: rnd(2.718 * x, 3), m: 'e puissance ' + fr(x) + ' n’est pas e × ' + fr(x) + ' : utilise la touche eˣ.' }]), num('c', a + b, 0, String(a + b), [{ v: a * b, m: 'On multiplie deux puissances de e : on additionne les exposants.' }]), num('d', a, 0, String(a)), num('e', -2, 0, '−2', [{ v: 2, m: '1 ÷ e² = e⁻² : l’exposant est négatif.' }])];
    return { titre: 'Calculer avec le nombre e', consigne: 'Complète chaque égalité. Les règles des puissances valent aussi pour e.', support: svg(600, 240, s, 'Cinq calculs avec le nombre e'), items,
      hints: ['e⁰ = 1, comme pour toute base.', 'eᵃ × eᵇ = eᵃ⁺ᵇ ; eᵃ ÷ eᵇ = eᵃ⁻ᵇ.', '1 ÷ eⁿ = e⁻ⁿ.'] };
  };

  /* e2 · dériver f(x) = a e^(kx) + b */
  TR.c7e2 = R => {
    const a = pick(R, [2, 5, 100, -3]), k = pick(R, [1, 2, .5, -1, .1]), b = pick(R, [0, 4, -10]), x0 = pick(R, [0, 1, 2]);
    const f = x => a * Math.exp(k * x) + b, df = x => a * k * Math.exp(k * x);
    const items = [num('a', a * k, 3, fr(a * k), [{ v: a, m: 'La dérivée de e^(kx) est k × e^(kx) : multiplie aussi par k = ' + fr(k) + '.' }]), num('b', rnd(df(x0), 3), 3, fr(rnd(df(x0), 3)), [{ v: rnd(f(x0), 3), m: 'Tu as calculé f(' + x0 + '). On demande f′(' + x0 + ').' }]), num('c', rnd(f(x0), 3), 3, fr(rnd(f(x0), 3))),
      qcm('d', ['croissante', 'décroissante'], a * k > 0 ? 0 : 1, a * k > 0 ? 'croissante : f′(x) = ' + fr(a * k) + 'e^(' + fr(k) + 'x) est positive' : 'décroissante : f′(x) est négative')];
    return { titre: 'Dériver une fonction exponentielle', consigne: `f(x) = ${fr(a)}e^(${fr(k)}x)${b ? (b > 0 ? ' + ' : ' − ') + fr(Math.abs(b)) : ''}. Calcule sa dérivée et des valeurs au millième.`,
      support: table(['Formule', 'À compléter'], [['f′(x) = … × e^(' + fr(k) + 'x)', tb('a', fr(a * k), 16)], [`f′(${x0})`, tb('b', fr(rnd(df(x0), 3)), 18)], [`f(${x0})`, tb('c', fr(rnd(f(x0), 3)), 18)]]) + `<p class="tr-l">d. Sur ℝ, la fonction f est :</p>`, items,
      hints: ['(eˣ)′ = eˣ, et (e^(kx))′ = k e^(kx).', 'Le nombre ' + fr(a) + ' devant reste ; la constante disparaît.', 'Une exponentielle est toujours positive : le signe de f′ est celui de ' + fr(a * k) + '.'] };
  };

  /* e3 · résoudre avec ln */
  TR.c7e3 = R => {
    const a = pick(R, [5, 10, 0.5, 20]), b = pick(R, [2, 1, -1, 0.5]), k = pick(R, [.02, .05, .1, .03]);
    const x1 = rnd(Math.log(a), 3), x2 = rnd(Math.exp(b), 3), t2 = rnd(Math.log(2) / k, 2), n2 = Math.ceil(Math.log(2) / k - 1e-9);
    const items = [num('a', x1, 3, fr(x1), [{ v: rnd(Math.log10(a), 3), m: 'eˣ = a se résout avec ln (logarithme népérien), pas avec log.' }]), num('b', x2, 3, fr(x2), [{ v: rnd(Math.pow(10, b), 3), m: 'ln(x) = b donne x = e puissance b, pas 10 puissance b.' }]), num('c', t2, 2, fr(t2), [{ v: rnd(2 / k, 2), m: 'On prend le logarithme : t = ln(2) ÷ ' + fr(k) + ', et non 2 ÷ ' + fr(k) + '.' }]), num('d', n2, 0, String(n2))];
    return { titre: 'Résoudre avec le logarithme népérien', consigne: 'Résous au millième (ou au centième), avec la touche ln de la calculatrice.',
      support: table(['Équation', 'Solution'], [[`eˣ = ${fr(a)}`, `x = ln(${fr(a)}) ≈ ${tb('a', fr(x1), 16)}`], [`ln(x) = ${fr(b)}`, `x = e^${fr(b)} ≈ ${tb('b', fr(x2), 16)}`], [`e^(${fr(k)}t) = 2`, `t = ln(2) ÷ ${fr(k)} ≈ ${tb('c', fr(t2), 16)} ; entier supérieur : ${tb('d', String(n2), 12)}`]]), items,
      hints: ['eˣ = a ⟺ x = ln(a).', 'ln(x) = b ⟺ x = eᵇ.', 'e^(kt) = 2 ⟺ kt = ln(2).'] };
  };
  if (typeof module !== 'undefined') module.exports = {};
})(typeof module !== 'undefined' ? module.exports : window);
