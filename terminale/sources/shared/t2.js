/* Terminale · chapitre 2 — Calculs commerciaux et financiers : intérêts composés, taux équivalents, taux moyen, emprunts. */
(function (root) {
  'use strict';
  const { DEP, TR, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, rnd, eur, pct, tb, sb, T, svg, table, num, qcm, pick, int, xs } = H;
  const sup = n => String(n).split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('');
  const e2 = x => fr(rnd(x, 2), 2) + ' €';

  /* point de départ : l’épargne réglementée (taux au 1er août 2026, source info.gouv.fr) */
  DEP.c2 = R => {
    const c1 = pick(R, [1000, 2000, 4000]), c2 = pick(R, [1000, 2000, 3000]);
    const doc = `<table class="dt tcx dt-sm"><thead><tr><th>Livret</th><th>Taux annuel</th><th>Plafond des dépôts</th></tr></thead><tbody><tr><th>Livret A</th><td data-cell="a-t">1,7 %</td><td data-cell="a-p">22 950 €</td></tr><tr><th>LDDS (développement durable et solidaire)</th><td data-cell="d-t">1,7 %</td><td data-cell="d-p">12 000 €</td></tr><tr><th>LEP (épargne populaire, sous conditions de revenus)</th><td data-cell="l-t">2,5 %</td><td data-cell="l-p">10 000 €</td></tr></tbody></table><p class="srcl">Taux en vigueur depuis le 1er août 2026 (source : info.gouv.fr, 31 juillet 2026). Les intérêts sont ajoutés au capital une fois par an.</p>`;
    const k = int(R, 0, 1);
    return { titre: 'Les livrets d’épargne réglementée', doc,
      qs: [k ? { t: 'Quel est le taux du LEP ?', kind: 'tap', cell: 'l-t', v: 2.5, tol: .01, a: '2,5 %' } : { t: 'Quel est le taux du Livret A ?', kind: 'tap', cell: 'a-t', v: 1.7, tol: .01, a: '1,7 %' },
        k ? { t: 'Quel est le plafond du Livret A ?', kind: 'tap', cell: 'a-p', v: 22950, tol: .01, a: '22 950 €' } : { t: 'Quel est le plafond du LEP ?', kind: 'tap', cell: 'l-p', v: 10000, tol: .01, a: '10 000 €' },
        { t: `Intérêts d’un an pour ${fr(c1)} € placés sur le LEP ?`, kind: 'num', v: c1 * .025, tol: .006, a: eur(c1 * .025), x: `${fr(c1)} × 2,5 ÷ 100 = ${eur(c1 * .025)}` },
        { t: `Capital au bout d’un an pour ${fr(c2)} € placés sur le Livret A ?`, kind: 'num', v: c2 * 1.017, tol: .006, a: eur(c2 * 1.017), x: `${fr(c2)} × 1,017 = ${eur(c2 * 1.017)}` },
        { t: 'En intérêts composés, 1 000 € placés 2 ans sur le LEP deviennent :', kind: 'qcm', choices: ['1 050,63 €', '1 050 €', '1 025 €'], ok: 0, a: '1 000 × 1,025² ≈ 1 050,63 €' }] };
  };

  /* e1 · intérêts simples ou composés ? */
  TR.c2e1 = R => {
    const C = pick(R, [2000, 3000, 4000, 5000]), t = pick(R, [2, 2.5, 3, 4, 5]), N = pick(R, [5, 6, 8]), q = 1 + t / 100;
    const comp = n => rnd(C * Math.pow(q, n), 2), simp = n => rnd(C * (1 + t / 100 * n), 2);
    const rows = [0, 1, 2, 3, N].map((n, i) => [i === 4 ? `${N}` : String(n), n === N ? tb('c', e2(simp(N)), 22) : e2(simp(n)), n === 2 ? tb('a', e2(comp(2)), 22) : n === N ? tb('b', e2(comp(N)), 22) : e2(comp(n))]);
    rows.splice(4, 0, ['⋮', '⋮', '⋮']);
    const items = [num('a', comp(2), 2, e2(comp(2)), [{ v: simp(2), m: 'Ça, ce sont les intérêts simples. En intérêts composés, on multiplie deux fois par ' + fr(q) + '.' }]),
      num('b', comp(N), 2, e2(comp(N)), [{ v: rnd(C * q * N, 2), m: `L’exposant n’est pas un facteur : ${fr(C)} × ${fr(q)}${'⁰¹²³⁴⁵⁶⁷⁸⁹'[N]}.` }, { v: rnd(C * Math.pow(1 + t, N), 2), m: `${fr(t)} % s’écrit ${fr(t / 100)} : le coefficient est ${fr(q)}.` }]),
      num('c', simp(N), 2, e2(simp(N)), [{ v: comp(N), m: 'En intérêts simples, on ajoute chaque année le même montant : C × t.' }]),
      num('d', rnd(comp(N) - simp(N), 2), 2, e2(comp(N) - simp(N)), [{ v: rnd(simp(N) - comp(N), 2), m: 'Calcule « composés − simples » : le gain est positif.' }]),
      qcm('e', ['plus', 'autant', 'moins'], 0, 'plus : les intérêts produisent eux-mêmes des intérêts')];
    const k = int(R, 3, N), obj = Math.ceil((comp(k - 1) + 1) / 10) * 10; let kk = 0; while (comp(kk) < obj) kk++;
    items.push(num('f', kk, 0, kk + ' ans', [{ v: kk - 1, m: `Au bout de ${kk - 1} ans, le capital est de ${e2(comp(kk - 1))} : l’objectif n’est pas encore atteint.` }]));
    xs(items, { a: `${fr(C)} × ${fr(q)}² = ${e2(comp(2))}`, b: `${fr(C)} × ${fr(q)}${sup(N)} ≈ ${e2(comp(N))}`, c: `${fr(C)} × (1 + ${fr(t / 100)} × ${N}) = ${e2(simp(N))}`, d: `${e2(comp(N))} − ${e2(simp(N))} = ${e2(comp(N) - simp(N))}`, f: `${e2(comp(kk - 1))} < ${fr(obj)} € et ${e2(comp(kk))} > ${fr(obj)} € : ${kk} ans` });
    return { titre: 'Intérêts simples ou composés ?', consigne: `${fr(C)} € sont placés à ${pct(t)} par an. Complète le tableau au centime, puis réponds à d, e et f.`,
      support: table(['Année n', 'Intérêts simples : C × (1 + t × n)', 'Intérêts composés : C × (1 + t)ⁿ'], rows) + `<p class="tr-l">d. Au bout de ${N} ans, les intérêts composés rapportent de plus : ${tb('d', e2(comp(N) - simp(N)), 20)}</p><p class="tr-l">e. Au-delà d’un an, les intérêts composés rapportent :</p><p class="tr-l">f. En intérêts composés, au bout de combien d’années le capital dépasse-t-il ${fr(obj)} € ? ${tb('f', kk + ' ans', 16)}</p>`, items,
      hints: [`Intérêts composés : chaque année, on multiplie par 1 + t = ${fr(q)}.`, 'Intérêts simples : chaque année, on ajoute le même montant C × t.', `Au bout de ${N} ans : C × (1 + t) puissance ${N}.`] };
  };

  /* e2 · taux équivalents et taux moyen */
  TR.c2e2 = R => {
    const t = pick(R, [3, 4.2, 5, 6, 7.2, 9]), tp = rnd(t / 12, 4), te = rnd((Math.pow(1 + t / 100, 1 / 12) - 1) * 100, 3);
    const [p1, p2] = pick(R, [[20, -20], [10, -10], [30, -10], [15, 5], [-10, 25], [8, 2]]), tm = rnd((Math.sqrt((1 + p1 / 100) * (1 + p2 / 100)) - 1) * 100, 2);
    const sg = p => (p >= 0 ? '+ ' : '− ') + fr(Math.abs(p)) + ' %';
    let s = T(300, 24, `Taux annuel : ${pct(t)} · coefficient annuel ${fr(1 + t / 100)}`, { fs: 15 });
    for (let i = 0; i < 12; i++) s += `<rect x="${24 + i * 47}" y="40" width="41" height="26" rx="6" class="k2 ks" stroke-width="1.4"/>` + T(44.5 + i * 47, 58, '× ?', { fs: 12 });
    s += T(300, 88, '12 mois au taux mensuel équivalent donnent le même capital qu’un an au taux annuel', { fs: 12, c: 'ts' });
    s += T(60, 124, 'a. proportionnel', { fs: 13, a: 'start' }) + sb(200, 106, 130, 'a', pct(tp), 28) + T(350, 124, 'b. équivalent', { fs: 13, a: 'start' }) + sb(460, 106, 120, 'b', pct(te), 28);
    const items = [num('a', tp, 4, pct(tp), [{ v: t, m: 'Il faut diviser le taux annuel par 12.' }]),
      num('b', te, 3, pct(te), [{ v: tp, m: 'Ça, c’est le taux proportionnel. Le taux équivalent vérifie (1 + tₘ)¹² = ' + fr(1 + t / 100) + '.' }]),
      qcm('c', ['le taux proportionnel', 'le taux équivalent'], 0, 'le taux proportionnel : appliqué 12 fois, il donne plus que le taux annuel'),
      num('d', tm, 2, pct(tm), [{ v: rnd((p1 + p2) / 2, 2), m: 'On ne fait pas la moyenne des pourcentages : on multiplie les coefficients, puis on prend la racine carrée.' }])];
    xs(items, { a: `${fr(t)} ÷ 12 ≈ ${pct(tp)}`, b: `(${fr(1 + t / 100)}^(1/12) − 1) × 100 ≈ ${pct(te)}`, c: `${pct(tp)} > ${pct(te)}`, d: `√(${fr(1 + p1 / 100)} × ${fr(1 + p2 / 100)}) ≈ ${fr(rnd(1 + tm / 100, 4))}, soit ${sg(tm)} par an` });
    return { titre: 'Taux équivalents et taux moyen', consigne: `Trouve le taux mensuel proportionnel et le taux mensuel équivalent à ${pct(t)} par an (au millième de %), puis un taux moyen.`,
      support: svg(600, 144, s, 'Douze cases « × ? » pour les douze mois d’une année') + `<p class="tr-l">c. Lequel des deux taux mensuels est le plus grand ?</p><p class="tr-l">d. Un chiffre d’affaires évolue de ${sg(p1)} une année, puis de ${sg(p2)} l’année suivante. Taux moyen annuel, au centième : ${tb('d', pct(tm), 20)}</p>`, items,
      hints: ['Taux proportionnel : taux annuel ÷ 12.', `Taux équivalent : ${fr(1 + t / 100)} puissance (1 ÷ 12), moins 1, puis × 100.`, 'Taux moyen sur 2 ans : (coefficient 1 × coefficient 2) puissance (1 ÷ 2), moins 1.'] };
  };

  /* e3 · compléter un tableau d’amortissement (amortissement constant ou annuités constantes) */
  const AMC = [[6000, 4, 5], [8000, 4, 6], [9000, 3, 5], [12000, 5, 4], [15000, 5, 4.8], [10000, 4, 4.5]];
  const ANN = [[8000, .05, 3], [9000, .045, 3], [12000, .04, 4], [6000, .06, 4], [10000, .04, 4], [7500, .05, 4], [12000, .05, 5]];
  const ann = (C, t, n) => C * t / (1 - Math.pow(1 + t, -n));
  TR.c2e3 = R => {
    const head = ['Année', 'Capital restant dû (début)', 'Intérêts', 'Amortissement', 'Annuité'];
    if (R() < .5) {
      const [C, n, tp] = pick(R, AMC), t = tp / 100, am = C / n, K = k => C - (k - 1) * am, I = k => rnd(K(k) * t, 2), cost = rnd(Array.from({ length: n }, (_, i) => I(i + 1)).reduce((a, b) => a + b, 0), 2);
      const rows = Array.from({ length: n }, (_, i) => { const k = i + 1; return [String(k), k === 2 ? tb('d', e2(K(2)), 22) : e2(K(k)), k === 1 ? tb('a', e2(I(1)), 18) : k === n ? tb('e', e2(I(n)), 18) : e2(I(k)), k === 1 ? tb('b', e2(am), 18) : e2(am), k === 1 ? tb('c', e2(I(1) + am), 20) : e2(I(k) + am)]; });
      const items = [num('a', I(1), 2, e2(I(1)), [{ v: rnd(C * tp, 2), m: `${fr(tp)} % s’écrit ${fr(t)}.` }]), num('b', am, 2, e2(am), [{ v: C, m: 'L’amortissement constant partage le capital en parts égales : capital ÷ nombre d’années.' }]), num('c', rnd(I(1) + am, 2), 2, e2(I(1) + am), [{ v: rnd(am - I(1), 2), m: 'Annuité = amortissement + intérêts : on additionne.' }]),
        num('d', K(2), 2, e2(K(2)), [{ v: rnd(C - I(1) - am, 2), m: 'Seul l’amortissement diminue le capital dû : les intérêts ne remboursent pas le capital.' }]), num('e', I(n), 2, e2(I(n)), [{ v: I(1), m: 'Les intérêts se calculent sur le capital restant dû de la dernière année.' }]), num('f', cost, 2, e2(cost), [{ v: rnd(n * (I(1) + am), 2), m: 'Le coût de l’emprunt, ce sont les intérêts seulement : on additionne la colonne des intérêts.' }])];
      xs(items, { a: `${fr(C)} × ${fr(t)} = ${e2(I(1))}`, b: `${fr(C)} ÷ ${n} = ${e2(am)}`, c: `${e2(I(1))} + ${e2(am)} = ${e2(I(1) + am)}`, d: `${fr(C)} − ${e2(am)} = ${e2(K(2))}`, e: `${e2(K(n))} × ${fr(t)} = ${e2(I(n))}`, f: `${Array.from({ length: n }, (_, i) => fr(rnd(I(i + 1), 2), 2)).join(' + ')} = ${e2(cost)}` });
      return { titre: 'Un tableau d’amortissement', consigne: `Emprunt de ${fr(C)} € sur ${n} ans au taux annuel de ${pct(tp)}, à amortissement constant. Complète le tableau.`,
        support: table(head, rows) + `<p class="tr-l">f. Coût total de l’emprunt (somme des intérêts) : ${tb('f', e2(cost), 22)}</p>`, items,
        hints: ['Amortissement constant : capital emprunté ÷ nombre d’années.', 'Intérêts de l’année = capital restant dû au début de l’année × taux.', 'Annuité = intérêts + amortissement. Le capital dû baisse de l’amortissement.'] };
    }
    const [C, t, n] = pick(R, ANN), a = rnd(ann(C, t, n), 2), i1 = rnd(C * t, 2), m1 = rnd(a - i1, 2), K2 = rnd(C - m1, 2), i2 = rnd(K2 * t, 2), m2 = rnd(a - i2, 2), cost = rnd(n * a - C, 2);
    const rows = [['1', e2(C), tb('a', e2(i1), 18), tb('b', e2(m1), 18), e2(a)], ['2', tb('c', e2(K2), 22), tb('d', e2(i2), 18), tb('e', e2(m2), 18), e2(a)], ['⋮', '⋮', '⋮', '⋮', '⋮']];
    const items = [num('a', i1, 2, e2(i1), [{ v: rnd(C * t * 100, 2), m: `Le taux ${fr(t * 100)} % s’écrit ${fr(t)}.` }]), num('b', m1, 2, e2(m1), [{ v: rnd(a + i1, 2), m: 'Amortissement = annuité − intérêts : on soustrait.' }]), num('c', K2, 2, e2(K2), [{ v: rnd(C - a, 2), m: 'Le capital dû ne baisse que de l’amortissement, pas de toute l’annuité.' }]),
      num('d', i2, 2, e2(i2), [{ v: i1, m: 'Les intérêts de l’année 2 se calculent sur le nouveau capital restant dû.' }]), num('e', m2, 2, e2(m2), [{ v: m1, m: 'L’amortissement augmente chaque année : recalcule annuité − intérêts.' }]), num('f', cost, 2, e2(cost), [{ v: rnd(n * a, 2), m: 'Le coût, c’est ce qu’on paie en plus du capital : total des annuités − capital emprunté.' }])];
    xs(items, { a: `${fr(C)} × ${fr(t)} = ${e2(i1)}`, b: `${e2(a)} − ${e2(i1)} = ${e2(m1)}`, c: `${fr(C)} − ${e2(m1)} = ${e2(K2)}`, d: `${e2(K2)} × ${fr(t)} ≈ ${e2(i2)}`, e: `${e2(a)} − ${e2(i2)} = ${e2(m2)}`, f: `${n} × ${e2(a)} − ${fr(C)} € = ${e2(cost)}` });
    return { titre: 'Un tableau d’amortissement', consigne: `Emprunt de ${fr(C)} € sur ${n} ans à ${pct(t * 100)} par an, annuité constante ${e2(a)}. Complète les deux premières lignes.`,
      support: table(head, rows) + `<p class="tr-l">f. Coût total de l’emprunt : ${n} × ${e2(a)} − ${fr(C)} € = ${tb('f', e2(cost), 22)}</p>`, items,
      hints: ['Intérêts de l’année = capital restant dû × taux.', 'Amortissement = annuité − intérêts.', 'Capital dû de l’année suivante = capital dû − amortissement.'] };
  };
  if (typeof module !== 'undefined') module.exports = {};
})(typeof module !== 'undefined' ? module.exports : window);
