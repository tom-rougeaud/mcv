/* 1re · chapitre 3 — Fonctions du second degré : parabole, racines, forme factorisée, signe, sommet. */
(function (root) {
  'use strict';
  const { DEP, TR, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, rnd, eur, tb, T, table, num, qcm, pick, int, P } = H;
  const RED = P.RED, BLUE = P.BLUE, GRN = P.GRN;
  const opts = (...l) => `<span class="opts">${l.map(x => `<span class="opt">${x}</span>`).join('')}</span>`;
  /* pas de graduation adapté */
  const pas = h => h <= 8 ? 1 : h <= 16 ? 2 : h <= 40 ? 5 : 10;
  /* repère adapté à une fonction sur [x0 ; x1] */
  function repere(f, x0, x1, lab, o = {}) {
    let lo = Infinity, hi = -Infinity; for (let k = 0; k <= 200; k++) { const y = f(x0 + (x1 - x0) * k / 200); lo = Math.min(lo, y); hi = Math.max(hi, y); }
    (o.extra || []).forEach(y => { lo = Math.min(lo, y); hi = Math.max(hi, y); }); lo = Math.min(lo, 0); hi = Math.max(hi, 0); const st = pas(hi - lo), y0 = Math.floor(lo / st) * st - (lo === 0 && o.neg ? st : 0), y1 = Math.ceil(hi / st) * st + (hi === 0 ? st : 0);
    return P.plot({ W: 600, H: 290, x: [x0, x1, 1], y: [y0, y1, st], ml: 48, mt: 16, mb: 30, zeroAxes: true, fine: true, cls: 'pic vis trs', lab, ...o });
  }
  /* parabole a (x − r1)(x − r2) à sommet entier */
  const parab = R => { const a = pick(R, [1, -1, 2, -2]), r1 = pick(R, [0, 1, 2, 3]), d = pick(R, [2, 4, 6]), r2 = r1 + d; const f = x => a * (x - r1) * (x - r2), xs = (r1 + r2) / 2; return { a, r1, r2, f, xs, ys: f(xs), fx: `${a === 1 ? '' : a === -1 ? '−' : a}(x ${r1 ? '− ' + r1 : ''})(x − ${r2})`.replace('(x )', '(x)') }; };
  const txtF = (a, b, c) => { let s = ''; const t = (v, p) => { if (!v) return; const sg = v < 0 ? '−' : '+', av = Math.abs(v); s += (s ? ' ' + sg + ' ' : (v < 0 ? '−' : '')) + (p === '' ? fr(av) : (av === 1 ? '' : fr(av)) + p); }; t(a, 'x²'); t(b, 'x'); t(c, ''); return s || '0'; };

  /* point de départ : bénéfice d’un stand selon le prix (tableau de valeurs) */
  DEP.c3 = R => {
    const r1 = pick(R, [1, 2, 3]), r2 = r1 + pick(R, [4, 6]), a = -1, f = x => a * (x - r1) * (x - r2), xs = (r1 + r2) / 2, xm = r2 + 1;
    const xsT = []; for (let x = 0; x <= xm; x++) xsT.push(x);
    const tab = `<table class="dt tcx dt-sm"><thead><tr><th>Prix x (€)</th>${xsT.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody><tr><th>Bénéfice B(x)</th>${xsT.map(x => `<td data-cell="${x}">${f(x)}</td>`).join('')}</tr></tbody></table>`;
    const g = repere(f, 0, xm, 'Bénéfice du stand selon le prix', { W: 600, H: 250 });
    const sv = g.wrap(g.base + g.curve(f, { n: 120 }) + g.pts(xsT.map(x => [x, f(x)]), { r: 4 }));
    const x3 = pick(R, [r1 + 1, r2 - 1]);
    return { titre: 'Le bénéfice d’un stand de bougies', doc: `<div class="wfig">${sv}</div>${tab}<p class="srcl">Stand fictif : B(x) est le bénéfice du jour, en dizaines d’euros, pour un prix de vente x en euros.</p>`,
      qs: [{ t: `Quel est le bénéfice pour un prix de ${x3} € ?`, kind: 'tap', cell: String(x3), v: f(x3), tol: .006, a: String(f(x3)) },
        { t: 'Pour quel prix le bénéfice est-il le plus grand ?', kind: 'num', v: xs, tol: .006, a: `${xs} €` },
        { t: 'Quel est ce bénéfice maximal ?', kind: 'num', v: f(xs), tol: .006, a: String(f(xs)) },
        { t: `Pour un prix de ${r1} €, le bénéfice est…`, kind: 'qcm', choices: ['positif', 'nul', 'négatif'], ok: 1, a: 'nul : la courbe touche l’axe horizontal' },
        { t: 'Pour un prix de 0 €, le stand gagne-t-il de l’argent ?', kind: 'qcm', choices: ['oui', 'non'], ok: f(0) > 0 ? 0 : 1, a: f(0) > 0 ? 'oui' : `non : B(0) = ${f(0)} est négatif` },
        { t: 'Rappel : combien font (− 3)² ?', kind: 'num', v: 9, tol: .01, a: '9' }] };
  };

  /* e1 · lire une parabole */
  TR.c3e1 = R => {
    const p = parab(R), x0 = p.r1 - 1, x1 = p.r2 + 1, g = repere(p.f, x0, x1, 'Une parabole');
    const items = [qcm('a', ['vers le haut', 'vers le bas'], p.a > 0 ? 0 : 1, p.a > 0 ? 'vers le haut : a > 0' : 'vers le bas : a < 0'),
      num('b', p.r1, 0, String(p.r1), [{ v: p.r2, m: 'C’est la plus grande racine. Cherche l’autre point où la courbe coupe l’axe.' }]),
      num('c', p.r2, 0, String(p.r2), [{ v: p.r1, m: 'C’est la plus petite racine. Cherche le point le plus à droite.' }]),
      num('d', p.xs, 0, String(p.xs), [{ v: p.ys, m: 'Tu as lu l’ordonnée du sommet. Ici on demande son abscisse.' }]),
      num('e', p.ys, 0, String(p.ys), [{ v: p.xs, m: 'Tu as lu l’abscisse du sommet. Ici on demande l’ordonnée.' }])];
    return { titre: 'Lire une parabole', consigne: 'La courbe coupe l’axe horizontal en deux points : ce sont les racines. Lis les nombres demandés sur le graphique.',
      support: g.wrap(g.base + g.curve(p.f, { stroke: BLUE, w: 3.2, a: x0, b: x1 })) + `<p class="tr-l">a. La parabole est ouverte :</p><p class="tr-l">b. Plus petite racine : ${tb('b', items[1].a, 12)} &nbsp; c. Plus grande racine : ${tb('c', items[2].a, 12)}</p><p class="tr-l">d. Abscisse du sommet : ${tb('d', items[3].a, 12)} &nbsp; e. Ordonnée du sommet : ${tb('e', items[4].a, 12)}</p>`, items,
      hints: ['Si la courbe a la forme d’un « U », elle est ouverte vers le haut.', 'Les racines sont les abscisses des points sur l’axe horizontal.', 'Le sommet est le point le plus haut ou le plus bas : lis ses deux coordonnées.'] };
  };

  /* e2 · tableau de valeurs de ax² + bx + c */
  TR.c3e2 = R => {
    const a = pick(R, [1, 2, -1]), xs = pick(R, [-1, 0, 1, 2]), k = int(R, -4, 4), b = -2 * a * xs, c = a * xs * xs + k, f = x => a * x * x + b * x + c, X = [-2, -1, 0, 1, 2];
    const ks = 'abcde'.split(''), items = X.map((x, i) => { const wrong = a * (-x * x) + b * x + c; return num(ks[i], f(x), 0, String(f(x)), x < 0 && wrong !== f(x) ? [{ v: wrong, m: `Attention : (${x})² = ${x * x} est positif. Le signe moins ne se met pas au carré avec la parenthèse oubliée.` }] : []); });
    const best = X.reduce((m, x) => (a > 0 ? f(x) < f(m) : f(x) > f(m)) ? x : m, X[0]);
    items.push(num('f', best, 0, String(best)));
    const tabl = `<table class="dt tcx dt-sm"><thead><tr><th>x</th>${X.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody><tr><th>f(x)</th>${X.map((x, i) => `<td>${tb(ks[i], items[i].a, 12)}</td>`).join('')}</tr></tbody></table>`;
    return { titre: 'Tableau de valeurs', consigne: `On donne f(x) = ${txtF(a, b, c)}. Complète le tableau de valeurs (cases a à e), puis réponds à f.`, support: tabl + `<p class="tr-l">f. Dans le tableau, la valeur ${a > 0 ? 'la plus petite' : 'la plus grande'} de f(x) est obtenue pour x = ${tb('f', items[5].a, 12)}</p>`, items,
      hints: ['Remplace x par la valeur de la colonne, puis calcule.', 'Calcule d’abord x² : le carré d’un nombre négatif est positif.', `Cherche le nombre ${a > 0 ? 'le plus petit' : 'le plus grand'} de la ligne f(x).`] };
  };

  /* e3 · forme factorisée et signe */
  TR.c3e3 = R => {
    const p = parab(R), x0 = p.r1 - 2, x1 = p.r2 + 2, W = 600, H = 120, X = x => 40 + (x - x0) / (x1 - x0) * (W - 80);
    let s = `<line x1="40" y1="60" x2="${W - 30}" y2="60" stroke="${P.INK}" stroke-width="2.4"/>`;
    for (let x = x0; x <= x1; x++) s += `<line x1="${X(x)}" y1="54" x2="${X(x)}" y2="66" stroke="${P.INK}" stroke-width="1.6"/>` + T(X(x), 86, String(x), { fs: 12, w: 400, c: 'ts' });
    const mid = (p.r1 + p.r2) / 2, mS = p.a > 0 ? '+' : '−';
    s += `<rect x="${X(p.r1)}" y="42" width="${X(p.r2) - X(p.r1)}" height="36" fill="${p.a > 0 ? '#C2332A' : '#1E7F45'}" opacity=".15"/>` + [p.r1, p.r2].map(r => `<circle cx="${X(r)}" cy="60" r="6" fill="#fff" stroke="${P.INK}" stroke-width="2.4"/>`).join('');
    const svg = `<svg viewBox="0 0 ${W} ${H}" class="pic vis trs" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Axe des x avec les deux racines de f">${s}${T(X(p.r1), 32, 'x₁', { fs: 14, c: 'kt' })}${T(X(p.r2), 32, 'x₂', { fs: 14, c: 'kt' })}</svg>`;
    const m = pick(R, [p.r1 + 1, p.r2 - 1]), o = pick(R, [p.r1 - 1, p.r2 + 1]);
    const items = [num('a', p.r1, 0, String(p.r1)), num('b', p.r2, 0, String(p.r2)), num('c', p.xs, 0, String(p.xs), [{ v: p.ys, m: 'C’est l’ordonnée. L’abscisse du sommet est le milieu des deux racines.' }]), num('d', p.ys, 0, String(p.ys), [{ v: p.xs, m: 'C’est l’abscisse. L’extremum est la valeur de f en ce point.' }]), qcm('e', ['positif', 'négatif'], p.f(m) > 0 ? 0 : 1, `${p.f(m) > 0 ? 'positif' : 'négatif'} : f(${m}) = ${p.f(m)}`), qcm('f', ['positif', 'négatif'], p.f(o) > 0 ? 0 : 1, `${p.f(o) > 0 ? 'positif' : 'négatif'} : f(${o}) = ${p.f(o)}`)];
    return { titre: 'Racines, sommet et signe', consigne: `On donne f(x) = ${p.fx}. Les deux racines sont placées sur l’axe : x₁ est la plus petite, x₂ la plus grande. Complète a à d, puis réponds à e et f.`, support: svg + `<p class="tr-l">a. x₁ = ${tb('a', items[0].a, 12)} &nbsp; b. x₂ = ${tb('b', items[1].a, 12)} &nbsp; c. abscisse du sommet = ${tb('c', items[2].a, 12)} &nbsp; d. f(sommet) = ${tb('d', items[3].a, 12)}</p><p class="tr-l">e. Pour x = ${m} (entre les racines), f(x) est</p><p class="tr-l">f. Pour x = ${o} (en dehors des racines), f(x) est</p>`, items,
      hints: ['Un produit est nul si l’un de ses facteurs est nul : cherche quand x − x₁ = 0 et x − x₂ = 0.', 'L’abscisse du sommet est le milieu des deux racines : additionne-les et divise par 2.', 'Pour le signe, calcule f pour la valeur donnée et regarde le résultat.'] };
  };
  if (typeof module !== 'undefined') module.exports = { repere, parab, txtF, pas };
  else root.MCVT3 = { repere, parab, txtF, pas };
})(typeof module !== 'undefined' ? module.exports : window);
