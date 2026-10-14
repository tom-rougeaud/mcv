/* 1re · chapitre 5 — Suites numériques : générer une suite, suites arithmétiques et géométriques. */
(function (root) {
  'use strict';
  const { DEP, TR, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, rnd, tb, T, num, qcm, pick, int, P } = H;
  const BLUE = P.BLUE, RED = P.RED;
  const sg = n => n < 0 ? '− ' + fr(Math.abs(n)) : fr(n);
  /* ligne « n / u(n) » avec cases */
  const ligne = (lab, n, cells) => `<table class="dt tcx dt-sm dt-c"><thead><tr><th>n</th>${n.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody><tr><th>${lab}</th>${cells.map(c => `<td>${c}</td>`).join('')}</tr></tbody></table>`;

  /* point de départ : abonnés à une box mensuelle (hausse constante) */
  DEP.c5 = R => {
    const u0 = pick(R, [80, 100, 120, 150]), r = pick(R, [10, 15, 20, 25]), u = n => u0 + r * n, N = [0, 1, 2, 3, 4, 5];
    const tab = `<table class="dt tcx dt-sm dt-c"><thead><tr><th>Mois n</th>${N.map(n => `<th>${n}</th>`).join('')}</tr></thead><tbody><tr><th>Abonnés</th>${N.map(n => `<td data-cell="${n}">${u(n)}</td>`).join('')}</tr></tbody></table>`;
    const g = P.plot({ W: 600, H: 230, x: [0, 8, 1], y: [0, Math.ceil(u(8) / 50) * 50, 50], ml: 50, mt: 26, mb: 34, xl: 'mois n', yl: 'abonnés', fine: true });
    const k = int(R, 1, 5);
    return { titre: 'Les abonnés de la box « Bougies du mois »', doc: tab + `<div class="wfig">${g.wrap(g.base + g.pts(N.map(n => [n, u(n)]), { r: 5 }))}</div><p class="srcl">Nombre d’abonnés au début de chaque mois (mois 0 : lancement). Entreprise fictive.</p>`,
      qs: [{ t: `Combien y a-t-il d’abonnés au mois ${k} ?`, kind: 'tap', cell: String(k), v: u(k), tol: .01, a: String(u(k)) },
        { t: 'De combien le nombre d’abonnés augmente-t-il chaque mois ?', kind: 'num', v: r, tol: .01, a: `+ ${r}` },
        { t: 'Combien d’abonnés prévoir au mois 6, si la hausse continue ?', kind: 'num', v: u(6), tol: .01, a: String(u(6)) },
        { t: 'Les points du graphique sont…', kind: 'qcm', choices: ['alignés', 'pas alignés'], ok: 0, a: 'alignés : la hausse est la même chaque mois' },
        { t: 'Combien d’abonnés prévoir au mois 10 ?', kind: 'num', v: u(10), tol: .01, a: `${u0} + 10 × ${r} = ${u(10)}` },
        { t: `Rappel : combien font ${r} × 8 ?`, kind: 'num', v: r * 8, tol: .01, a: String(r * 8) }] };
  };

  /* e1 · suite arithmétique */
  TR.c5e1 = R => {
    const u0 = pick(R, [12, 20, 35, 50, 64, 80]), r = pick(R, [3, 4, 5, 7, 8, -2, -3]), u = n => u0 + r * n, m = pick(R, [10, 12, 15, 20]);
    const items = [num('a', u(1), 0, String(u(1))), num('b', u(2), 0, String(u(2))), num('c', u(3), 0, String(u(3))), num('d', u(4), 0, String(u(4))), num('e', u(m), 0, String(u(m)), [{ v: u0 + r * (m - 1), m: `Tu as ajouté la raison ${m - 1} fois. De u₀ à u${m}, on l’ajoute ${m} fois.` }, { v: u0 * r * m, m: 'La formule est u₀ + n × r : on additionne, on ne multiplie pas u₀.' }]), qcm('f', ['croissante', 'décroissante'], r > 0 ? 0 : 1, r > 0 ? 'croissante : la raison est positive' : 'décroissante : la raison est négative')];
    return { titre: 'Une suite arithmétique', consigne: `La suite (uₙ) est arithmétique, de premier terme u₀ = ${u0} et de raison r = ${sg(r)}. Complète le tableau, puis calcule u${m} avec le terme général uₙ = u₀ + n × r.`, support: ligne('uₙ', [0, 1, 2, 3, 4], [String(u0), tb('a', items[0].a, 12), tb('b', items[1].a, 12), tb('c', items[2].a, 12), tb('d', items[3].a, 12)]) + `<p class="tr-l">e. u${m} = ${u0} + ${m} × ${r < 0 ? '(' + sg(r) + ')' : r} = ${tb('e', items[4].a, 14)}</p><p class="tr-l">f. La suite est :</p>`, items,
      hints: ['Pour passer d’un terme au suivant, on ajoute toujours la raison.', `Avec une raison négative, on enlève ${Math.abs(r)} à chaque fois.`, 'Une raison positive donne une suite croissante.'] };
  };

  /* e2 · suite géométrique */
  TR.c5e2 = R => {
    const v0 = pick(R, [100, 200, 400, 500, 1000]), q = pick(R, [1.1, 1.2, 1.5, 2, 0.8, 0.5]), v = n => rnd(v0 * Math.pow(q, n), 4);
    const pc = rnd((q - 1) * 100, 0), w0 = pick(R, [40, 60, 80]), q2 = pick(R, [1.25, 1.5, 3, 0.75]);
    const items = [num('a', v(1), 2, fr(v(1))), num('b', v(2), 2, fr(v(2)), [{ v: v0 + 2 * (v(1) - v0), m: 'Tu as ajouté la même quantité. Dans une suite géométrique, on multiplie par q à chaque fois.' }]), num('c', v(3), 2, fr(v(3))), num('d', q2, 2, fr(q2), [{ v: rnd(w0 * q2 - w0, 2), m: 'Tu as fait une soustraction. La raison géométrique est un quotient : w₁ ÷ w₀.' }]), qcm('e', ['croissante', 'décroissante'], q > 1 ? 0 : 1, q > 1 ? `croissante : q = ${fr(q)} est plus grand que 1` : `décroissante : q = ${fr(q)} est entre 0 et 1`)];
    return { titre: 'Une suite géométrique', consigne: `La suite (vₙ) est géométrique, de premier terme v₀ = ${v0} et de raison q = ${fr(q)}${q > 1 ? ` (une hausse de ${pc} % par étape)` : ` (une baisse de ${-pc} % par étape)`}. Complète a, b, c. Puis trouve la raison d’une autre suite géométrique (d).`, support: ligne('vₙ', [0, 1, 2, 3], [String(v0), tb('a', items[0].a, 14), tb('b', items[1].a, 14), tb('c', items[2].a, 14)]) + `<p class="tr-l">d. Une suite géométrique (wₙ) a pour termes w₀ = ${w0} et w₁ = ${fr(w0 * q2)}. Sa raison est q = ${tb('d', items[3].a, 12)}</p><p class="tr-l">e. La suite (vₙ) est :</p>`, items,
      hints: ['Pour passer d’un terme au suivant, on multiplie par q.', 'v₂ = v₁ × q, puis v₃ = v₂ × q.', 'La raison q est w₁ ÷ w₀.'] };
  };

  /* e3 · reconnaître une suite sur un graphique */
  TR.c5e3 = R => {
    const ari = R() < .5;
    let u, y1, st, rais, txt;
    if (ari) { const u0 = pick(R, [10, 20, 30, 70, 80]), r = pick(R, [10, 20, -10]); u = n => u0 + r * n; rais = r; txt = `r = ${sg(r)}`; }
    else { const inc = R() < .6, v0 = inc ? pick(R, [5, 10]) : pick(R, [160, 320]), q = inc ? 2 : .5; u = n => v0 * Math.pow(q, n); rais = q; txt = `q = ${fr(q)}`; }
    const N = [0, 1, 2, 3, 4], vals = N.map(u), hi = Math.max(...vals); st = hi <= 80 ? 10 : hi <= 160 ? 20 : 40; y1 = Math.ceil(hi / st) * st;
    const g = P.plot({ W: 600, H: 280, x: [0, 4, 1], y: [0, y1, st], ml: 50, mt: 26, mb: 34, xl: 'n', yl: 'uₙ', fine: true, cls: 'pic vis trs', lab: 'Les cinq premiers termes d’une suite' });
    const items = [num('a', vals[0], 0, String(vals[0])), num('b', vals[1], 0, String(vals[1])), qcm('c', ['arithmétique', 'géométrique'], ari ? 0 : 1, ari ? 'arithmétique : on ajoute la même valeur, les points sont alignés' : 'géométrique : on multiplie par la même valeur, les points ne sont pas alignés'), num('d', rais, 2, txt, ari ? [{ v: vals[1] / vals[0], m: 'Ici les écarts sont constants : la raison se trouve par une différence.' }] : [{ v: vals[1] - vals[0], m: 'Ici les écarts changent : la raison se trouve par un quotient u₁ ÷ u₀.' }])];
    return { titre: 'Arithmétique ou géométrique ?', consigne: 'Le graphique montre u₀, u₁, u₂, u₃ et u₄. Lis les deux premiers termes, reconnais le type de suite, puis donne sa raison.', support: g.wrap(g.base + g.pts(N.map(n => [n, u(n)]), { r: 5.5 })) + `<p class="tr-l">a. u₀ = ${tb('a', items[0].a, 12)} &nbsp; b. u₁ = ${tb('b', items[1].a, 12)}</p><p class="tr-l">c. La suite est :</p><p class="tr-l">d. Sa raison (r ou q) vaut : ${tb('d', items[3].a, 14)}</p>`, items,
      hints: ['Lis les ordonnées des deux premiers points.', 'Si les points sont alignés, on ajoute toujours la même valeur.', 'Différence u₁ − u₀ pour une suite arithmétique, quotient u₁ ÷ u₀ pour une suite géométrique.'] };
  };
  if (typeof module !== 'undefined') module.exports = {};
})(typeof module !== 'undefined' ? module.exports : window);
