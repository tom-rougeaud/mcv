/* 1re · chapitre 4 — Dérivation : taux de variation, tangente, nombre dérivé, dérivée, variations, extremum. */
(function (root) {
  'use strict';
  const { DEP, TR, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, rnd, eur, tb, T, num, qcm, pick, int, shuffle, P, xs: XS } = H;
  const par = n => n < 0 ? `(− ${Math.abs(n)})` : String(n);
  const { repere } = typeof module !== 'undefined' ? require('./t3.js') : root.MCVT3;
  const RED = P.RED, BLUE = P.BLUE;
  const sg = n => n < 0 ? '− ' + Math.abs(n) : String(n);

  /* point de départ : chiffre d’affaires de 7 semaines, lire des variations */
  DEP.c4 = R => {
    const v0 = int(R, 20, 40), steps = shuffle(R, [6, 4, 2, 8, -4, 3]), v = [v0]; steps.forEach(s => v.push(v[v.length - 1] + s));
    const lo = Math.min(...v), hi = Math.max(...v), st = hi - lo > 30 ? 10 : 5, y0 = Math.floor(lo / st) * st - st, y1 = Math.ceil(hi / st) * st + st;
    const g = P.plot({ W: 600, H: 250, x: [0, 6, 1], y: [y0, y1, st], ml: 48, mt: 16, mb: 34, xl: 'semaine', yl: 'k€', fine: true });
    let s = g.base; for (let i = 0; i < 6; i++) s += g.seg(i, v[i], i + 1, v[i + 1], { stroke: BLUE, w: 3 }); s += g.pts(v.map((y, i) => [i, y]), { r: 4.5 });
    const k = int(R, 0, 4), jmax = steps.indexOf(8), jneg = steps.indexOf(-4);
    return { titre: 'Le chiffre d’affaires de la boutique', doc: `<div class="wfig">${g.wrap(s)}</div><p class="srcl">Chiffre d’affaires hebdomadaire, en milliers d’euros. Boutique fictive.</p>`,
      qs: [{ t: `Quel est le chiffre d’affaires de la semaine ${k + 1} (en k€) ?`, kind: 'num', v: v[k + 1], tol: .01, a: String(v[k + 1]) },
        { t: `De combien varie-t-il entre la semaine ${k} et la semaine ${k + 1} (en k€) ?`, kind: 'num', v: steps[k], tol: .01, a: sg(steps[k]), x: `${v[k + 1]} − ${v[k]} = ${sg(steps[k])}` },
        { t: 'Entre quelle semaine et la suivante la hausse est-elle la plus forte ? Donne la première semaine.', kind: 'num', v: jmax, tol: .01, a: String(jmax) },
        { t: `Entre les semaines ${jneg} et ${jneg + 1}, la courbe…`, kind: 'qcm', choices: ['monte', 'descend'], ok: 1, a: 'descend : la valeur diminue' },
        { t: `Entre les semaines ${jmax} et ${jmax + 1}, la courbe…`, kind: 'qcm', choices: ['monte', 'descend'], ok: 0, a: 'monte : la valeur augmente' }] };
  };

  /* e1 · lire la pente d’une tangente */
  TR.c4e1 = R => {
    const p = pick(R, [1, -1]), s = pick(R, [2, 3]), k = int(R, -2, 4), f = x => p * (x - s) * (x - s) + k, x0 = s + pick(R, [-1, 1, 2]), m = 2 * p * (x0 - s), y0 = f(x0), y1 = y0 + m;
    const g = repere(f, 0, 6, 'Une parabole et sa tangente', { extra: [y1, y0 - m, y0 + 2 * m], H: 300 });
    const sv = g.wrap(g.base + g.curve(f, { stroke: BLUE, w: 3 }) + g.line(m, y0 - m * x0, { stroke: RED, w: 2.6 }) + g.dot(x0, y0, { r: 6, fill: '#FFC233' }) + g.dot(x0 + 1, y1, { r: 5, fill: '#fff', stroke: RED }) + g.txt(x0, y0, 'A', { dx: -14, dy: -8, fs: 15 }) + g.txt(x0 + 1, y1, 'B', { dx: 12, dy: -8, fs: 15 }));
    const items = [num('a', y0, 0, String(y0), [{ v: x0, m: 'Tu as donné l’abscisse de A. Il faut son ordonnée, sur l’axe vertical.' }]), num('b', y1, 0, String(y1)), num('c', m, 0, String(m), [{ v: y1, m: 'Tu as donné l’ordonnée de B. La pente est la différence des ordonnées, pour une avancée de 1.' }, { v: -m, m: 'Le signe est inversé : si la tangente monte vers la droite, la pente est positive.' }]), qcm('d', ['croissante', 'décroissante'], m > 0 ? 0 : 1, m > 0 ? 'croissante : la tangente monte (pente positive)' : 'décroissante : la tangente descend (pente négative)')];
    XS(items, { a: `on lit f(${x0}) = ${fr(y0)}`, b: `on lit ${fr(y1)} sur la tangente`, c: `pente = (${fr(y1)} − ${par(y0)}) ÷ (${x0 + 1} − ${x0}) = ${fr(m)}` });
    return { titre: 'Pente de la tangente', consigne: `La droite rouge est la tangente à la courbe au point A d’abscisse ${x0}. B est un point de cette tangente, d’abscisse ${x0 + 1}. Lis les nombres demandés.`, support: sv + `<p class="tr-l">a. Ordonnée de A : f(${x0}) = ${tb('a', items[0].a, 12)} &nbsp; b. Ordonnée de B : ${tb('b', items[1].a, 12)}</p><p class="tr-l">c. Pente de la tangente (avancée de 1) : f′(${x0}) = ${tb('c', items[2].a, 12)}</p><p class="tr-l">d. En A, la fonction est :</p>`, items,
      hints: ['A est le point jaune : lis son ordonnée sur l’axe vertical.', 'De A à B, on avance de 1 vers la droite : la pente est de combien on monte ou descend.', 'Une tangente qui monte vers la droite a une pente positive.'] };
  };

  /* e2 · dériver */
  TR.c4e2 = R => {
    const a1 = pick(R, [1, 2, 3, 4]), b1 = pick(R, [-6, -4, -3, 2, 5, 8]), c1 = pick(R, [-5, 1, 4, 7]);
    const a2 = pick(R, [2, 3, 5]), c2 = pick(R, [3, 5, 9]);
    const a3 = pick(R, [1, 2, 3]), b3 = pick(R, [4, 6, 10, 12]);
    const term = (v, p, first) => !v ? '' : (first ? (v < 0 ? '− ' : '') : (v < 0 ? ' − ' : ' + ')) + (Math.abs(v) === 1 && p ? '' : Math.abs(v)) + p;
    const f1 = term(a1, 'x²', 1) + term(b1, 'x') + term(c1, ''), f2 = term(a2, 'x²', 1) + term(c2, ''), f3 = term(-a3, 'x²', 1) + term(b3, 'x');
    const x0 = pick(R, [2, 3, 4]), ks = 'abcdefg'.split('');
    const e = (k, v, extra = []) => num(k, v, 0, sg(v), extra);
    const items = [e('a', 2 * a1, [{ v: a1, m: 'La dérivée de ax² est 2ax : pense à multiplier par 2.' }]), e('b', b1), e('c', -2 * a3, [{ v: -a3, m: 'La dérivée de ax² est 2ax : pense à multiplier par 2.' }]), e('d', b3), e('e', 2 * a1 * x0 + b1)];
    XS(items, { a: `(${a1}x²)′ = 2 × ${a1}x = ${2 * a1}x`, b: `(${sg(b1)}x)′ = ${sg(b1)} ; (${sg(c1)})′ = 0`, c: `(− ${a3}x²)′ = 2 × (− ${a3})x = − ${2 * a3}x`, d: `(${b3}x)′ = ${b3}`, e: `f′(${x0}) = ${2 * a1} × ${x0} ${b1 < 0 ? '− ' + (-b1) : '+ ' + b1} = ${sg(2 * a1 * x0 + b1)}` });
    const row = (f, g, k1, k2, i1, i2) => `<tr><td>${f}</td><td>${g}′(x) = ${tb(k1, items[i1].a, 12)} x + ${tb(k2, items[i2].a, 12)}</td></tr>`;
    return { titre: 'Dériver', consigne: 'Complète chaque dérivée sous la forme Ax + B. Rappels : (x²)′ = 2x, (ax + b)′ = a, (c)′ = 0.', support: `<table class="dt tcx dt-sm"><thead><tr><th>Fonction</th><th>Dérivée</th></tr></thead><tbody>${row('f(x) = ' + f1, 'f', 'a', 'b', 0, 1)}${row('h(x) = ' + f3, 'h', 'c', 'd', 2, 3)}</tbody></table><p class="tr-l">e. Nombre dérivé : f′(${x0}) = ${tb('e', items[4].a, 14)}</p>`, items,
      hints: ['Chaque terme se dérive seul : ax² donne 2ax, bx donne b, un nombre seul donne 0.', 'Si le résultat est « − 2x + 10 », A vaut − 2 et B vaut 10.', 'Pour f′(' + x0 + '), remplace x par ' + x0 + ' dans f′(x).'] };
  };

  /* e3 · tableau de variations */
  TR.c4e3 = R => {
    const a = pick(R, [-1, 1, -2, 2]), xs = pick(R, [2, 3, 4, 5]), k = int(R, -5, 8), f = x => a * (x - xs) * (x - xs) + k, b = -2 * a * xs, c = a * xs * xs + k;
    const fx = (a === 1 ? '' : a === -1 ? '− ' : a) + 'x²' + (b ? (b < 0 ? ' − ' : ' + ') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'x' : '') + (c ? (c < 0 ? ' − ' : ' + ') + Math.abs(c) : '');
    const up = a < 0 ? '↗' : '↘', dn = a < 0 ? '↘' : '↗';
    const tabl = `<table class="dt tcx dt-sm dt-c"><tbody><tr><th>x</th><td>0</td><td>${tb('a', String(xs), 12)}</td><td>${2 * xs}</td></tr><tr><th>signe de f′(x)</th><td colspan="1">${a < 0 ? '+' : '−'}</td><td>0</td><td>${a < 0 ? '−' : '+'}</td></tr><tr><th>variations de f</th><td>${up}</td><td>${tb('b', String(k), 12)}</td><td>${dn}</td></tr></tbody></table>`;
    const items = [num('a', xs, 0, String(xs), [{ v: k, m: 'Tu as donné la valeur de f. Ici on cherche le x où f′ s’annule.' }, { v: b, m: 'C’est le nombre B de f′. Résous 2a x + B = 0 pour trouver x.' }]), num('b', k, 0, sg(k), [{ v: xs, m: 'Tu as donné x. L’extremum est la valeur de f en ce point.' }]), qcm('c', ['un maximum', 'un minimum'], a < 0 ? 0 : 1, a < 0 ? 'un maximum : f monte puis descend' : 'un minimum : f descend puis monte'), num('d', f(0) , 0, sg(f(0))), num('e', 2 * a * 0 + b, 0, sg(b), [{ v: -b, m: 'Le signe est inversé : f′(0) est la valeur B de f′(x) = 2a x + B.' }])];
    XS(items, { a: `${sg(2 * a)}x ${b < 0 ? '− ' + Math.abs(b) : '+ ' + b} = 0 donne x = ${Math.abs(b)} ÷ ${Math.abs(2 * a)} = ${xs}`, b: `f(${xs}) = ${a === 1 ? '' : a === -1 ? '− ' : fr(a) + ' × '}${xs}² ${b < 0 ? '− ' + Math.abs(b) : '+ ' + b} × ${xs} ${c < 0 ? '− ' + Math.abs(c) : '+ ' + c} = ${sg(k)}`, d: `f(0) = ${sg(c)}, le terme constant`, e: `f′(0) = ${sg(2 * a)} × 0 ${b < 0 ? '− ' + Math.abs(b) : '+ ' + b} = ${sg(b)}` });
    return { titre: 'Tableau de variations', consigne: `On donne f(x) = ${fx} sur l’intervalle [0 ; ${2 * xs}]. Sa dérivée est f′(x) = ${sg(2 * a)} x ${b < 0 ? '− ' + Math.abs(b) : '+ ' + b}. Complète le tableau (a et b), puis réponds à c, d, e.`, support: tabl + `<p class="tr-l">c. Le sommet est : (maximum ou minimum)</p><p class="tr-l">d. f(0) = ${tb('d', items[3].a, 12)} &nbsp; e. f′(0) = ${tb('e', items[4].a, 12)}</p>`, items,
      hints: ['f′(x) = 0 se résout comme une équation : 2a x + B = 0.', 'L’extremum est f(x) pour la valeur trouvée en a.', 'Si f monte puis descend, le sommet est un maximum.'] };
  };
  if (typeof module !== 'undefined') module.exports = {};
})(typeof module !== 'undefined' ? module.exports : window);
