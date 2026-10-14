/* Terminale · chapitre 6 — Probabilités : arbres pondérés, probabilités conditionnelles, probabilités totales, indépendance. */
(function (root) {
  'use strict';
  const { DEP, TR, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, rnd, tb, sb, T, svg, table, num, qcm, pick, int } = H;
  const p2 = x => fr(rnd(x, 4));
  /* arbre pondéré à deux étapes : o = { A: ['D', 'M'], B: ['R', 'R̄'], w1: [x, y], w2: [[x, y], [x, y]], leaf: [x, x, x, x] }
     chaque poids ou feuille peut être un texte ou une case { k, a } ; hl : indices des chemins mis en valeur */
  H.tree = (o, W = 600, Ht = 270) => {
    const x0 = 34, x1 = 220, x2 = 410, y0 = Ht / 2, ys1 = [Ht * .27, Ht * .73], ys2 = [Ht * .1, Ht * .4, Ht * .6, Ht * .9].map(v => v + 4), xl = 470;
    const lab = (c, x, y, w = 70) => typeof c === 'object' ? sb(x - w / 2, y - 18, w, c.k, c.a, 26) : `<rect x="${x - 30}" y="${y - 17}" width="60" height="24" rx="6" fill="#fff"/>` + T(x, y, c, { fs: 14 });
    const node = (x, y, s) => `<circle cx="${x}" cy="${y}" r="17" class="k2 ks" stroke-width="2"/>` + T(x, y + 5, s, { fs: 15 });
    const hl = o.hl || [];
    let s = '';
    ys1.forEach((y, i) => { s += `<line x1="${x0 + 10}" y1="${y0}" x2="${x1 - 17}" y2="${y}" stroke="${hl.some(h => Math.floor(h / 2) === i) ? '#C2332A' : '#1D2240'}" stroke-width="${hl.some(h => Math.floor(h / 2) === i) ? 3.4 : 2}"/>`; });
    ys2.forEach((y, j) => { const i = Math.floor(j / 2); s += `<line x1="${x1 + 17}" y1="${ys1[i]}" x2="${x2 - 17}" y2="${y}" stroke="${hl.includes(j) ? '#C2332A' : '#1D2240'}" stroke-width="${hl.includes(j) ? 3.4 : 2}"/>`; });
    s += `<circle cx="${x0}" cy="${y0}" r="8" fill="#1D2240"/>`;
    ys1.forEach((y, i) => { s += node(x1, y, o.A[i]) + lab(o.w1[i], (x0 + x1) / 2 - 6, (y0 + y) / 2 + (i ? 14 : -4)); });
    ys2.forEach((y, j) => { const i = Math.floor(j / 2); s += node(x2, y, o.B[j % 2]) + lab(o.w2[i][j % 2], (x1 + x2) / 2 + 4, (ys1[i] + y) / 2 + (j % 2 ? 12 : -2)); if (o.leaf) s += T(xl - 26, y + 5, '→', { fs: 14 }) + (typeof o.leaf[j] === 'object' ? sb(xl - 10, y - 14, 120, o.leaf[j].k, o.leaf[j].a, 26) : T(xl - 6, y + 5, o.leaf[j], { fs: 13, a: 'start' })); });
    return svg(W, Ht, s, o.lab || 'Arbre pondéré');
  };

  /* point de départ : une enquête de satisfaction en tableau croisé (effectifs entiers) */
  DEP.c6 = R => {
    const n = pick(R, [200, 400, 500]), pf = pick(R, [.4, .5, .6]), ps1 = pick(R, [.8, .9, .7]), ps2 = pick(R, [.6, .5, .7]);
    const F = n * pf, NF = n - F, FS = Math.round(F * ps1), NFS = Math.round(NF * ps2), S = FS + NFS;
    const doc = `<table class="dt tcx dt-sm dt-c"><thead><tr><th></th><th>Satisfait</th><th>Pas satisfait</th><th>Total</th></tr></thead><tbody><tr><th>Avec carte de fidélité</th><td data-cell="fs">${FS}</td><td>${F - FS}</td><td data-cell="f">${F}</td></tr><tr><th>Sans carte</th><td>${NFS}</td><td>${NF - NFS}</td><td>${NF}</td></tr><tr><th>Total</th><td data-cell="s">${S}</td><td>${n - S}</td><td data-cell="n">${n}</td></tr></tbody></table><p class="srcl">Enquête auprès des clients d’un magasin (entreprise fictive).</p>`;
    return { titre: 'Une enquête de satisfaction', doc,
      qs: [{ t: 'Combien de clients ont répondu ?', kind: 'tap', cell: 'n', v: n, tol: .01, a: String(n) },
        { t: 'Combien de clients ont la carte de fidélité ?', kind: 'tap', cell: 'f', v: F, tol: .01, a: String(F) },
        { t: 'On choisit un client au hasard. Probabilité qu’il ait la carte ?', kind: 'num', v: pf, tol: .001, a: `${F} ÷ ${n} = ${fr(pf)}` },
        { t: 'Probabilité qu’il ait la carte et soit satisfait ?', kind: 'num', v: rnd(FS / n, 4), tol: .001, a: `${FS} ÷ ${n} = ${p2(FS / n)}` },
        { t: 'Parmi les clients avec carte, quelle proportion est satisfaite ?', kind: 'num', v: rnd(FS / F, 4), tol: .001, a: `${FS} ÷ ${F} = ${p2(FS / F)}` }] };
  };

  /* e1 · compléter un arbre pondéré, puis deux probabilités */
  TR.c6e1 = R => {
    const a = pick(R, [.6, .7, .55, .4, .35]), b1 = pick(R, [.15, .2, .1, .25]), b2 = pick(R, [.05, .08, .3, .4]), ctx = pick(R, [['D', 'M', 'R', 'R̄', 'livraison à domicile (D) ou retrait en magasin (M) ; R : colis retourné'], ['C', 'W', 'S', 'S̄', 'contact par téléphone (C) ou par le site (W) ; S : client satisfait']]);
    const pAB = rnd(a * b1, 4), pB = rnd(a * b1 + (1 - a) * b2, 4);
    const pic = H.tree({ A: [ctx[0], ctx[1]], B: [ctx[2], ctx[3]], w1: [fr(a), { k: 'a', a: fr(rnd(1 - a, 2)) }], w2: [[fr(b1), { k: 'b', a: fr(rnd(1 - b1, 2)) }], [fr(b2), { k: 'c', a: fr(rnd(1 - b2, 2)) }]], lab: 'Arbre pondéré à compléter' });
    const items = [num('a', rnd(1 - a, 2), 2, fr(rnd(1 - a, 2)), [{ v: a, m: 'La somme des probabilités issues d’un même nœud vaut 1 : 1 − ' + fr(a) + '.' }]), num('b', rnd(1 - b1, 2), 2, fr(rnd(1 - b1, 2)), [{ v: rnd(1 - a, 2), m: 'Sur cette branche, on complète à 1 la probabilité ' + fr(b1) + ' du même nœud.' }]), num('c', rnd(1 - b2, 2), 2, fr(rnd(1 - b2, 2))),
      num('d', pAB, 4, p2(pAB), [{ v: rnd(a + b1, 4), m: 'Le long d’un chemin, on multiplie les probabilités, on ne les additionne pas.' }]), num('e', pB, 4, p2(pB), [{ v: pAB, m: 'Deux chemins mènent à ' + ctx[2] + ' : il faut additionner leurs probabilités.' }, { v: rnd(b1 + b2, 4), m: 'On additionne les probabilités des chemins (produits), pas les probabilités des branches.' }])];
    return { titre: 'Compléter un arbre pondéré', consigne: `${ctx[4]}. Complète l’arbre, puis calcule les probabilités demandées (à 0,0001 près).`,
      support: pic + `<p class="tr-l">d. P(${ctx[0]} ∩ ${ctx[2]}) = ${tb('d', p2(pAB), 18)} · e. P(${ctx[2]}) = ${tb('e', p2(pB), 18)}</p>`, items,
      hints: ['Les branches qui partent d’un même nœud ont une somme égale à 1.', 'Probabilité d’un chemin : produit des probabilités de ses branches.', `P(${ctx[2]}) : somme des probabilités des chemins qui mènent à ${ctx[2]}.`] };
  };

  /* e2 · du tableau croisé à l’arbre : probabilités conditionnelles */
  TR.c6e2 = R => {
    const n = pick(R, [500, 800, 1000]), pa = pick(R, [.4, .6, .25]), pba = pick(R, [.2, .3, .15]), pbn = pick(R, [.1, .05, .4]);
    const A = n * pa, NA = n - A, AB = Math.round(A * pba), NAB = Math.round(NA * pbn), B = AB + NAB;
    const tabl = table(['', 'Achat en promotion (P)', 'Sans promotion', 'Total'], [['Client avec carte (C)', String(AB), String(A - AB), String(A)], ['Client sans carte', String(NAB), String(NA - NAB), String(NA)], ['Total', String(B), String(n - B), String(n)]], 'dt-c');
    const items = [num('a', pa, 4, p2(pa), [{ v: A, m: 'Une probabilité est un nombre entre 0 et 1 : divise l’effectif par le total ' + n + '.' }]), num('b', rnd(AB / A, 4), 4, p2(AB / A), [{ v: rnd(AB / n, 4), m: 'Sachant C, on ne regarde que la ligne des clients avec carte : divise par ' + A + ', pas par ' + n + '.' }]),
      num('c', rnd(AB / n, 4), 4, p2(AB / n), [{ v: rnd(AB / A, 4), m: 'P(C ∩ P) se calcule sur tous les clients : divise par ' + n + '.' }]), num('d', rnd(AB / B, 4), 4, p2(AB / B), [{ v: rnd(AB / A, 4), m: 'Sachant P, on se place dans la colonne « promotion » : divise par ' + B + '.' }])];
    return { titre: 'Du tableau croisé aux probabilités conditionnelles', consigne: `${n} tickets de caisse d’un magasin (fictif). On choisit un ticket au hasard. Calcule à 0,0001 près.`,
      support: tabl + `<p class="tr-l">a. P(C) = ${tb('a', p2(pa), 16)} · b. P<sub>C</sub>(P) = ${tb('b', p2(AB / A), 16)}</p><p class="tr-l">c. P(C ∩ P) = ${tb('c', p2(AB / n), 16)} · d. P<sub>P</sub>(C) = ${tb('d', p2(AB / B), 16)}</p>`, items,
      hints: ['P(C) : effectif des clients avec carte ÷ effectif total.', 'P<sub>C</sub>(P) : parmi les clients avec carte seulement.', 'P<sub>P</sub>(C) : parmi les achats en promotion seulement.'] };
  };

  /* e3 · indépendants ou non ? */
  TR.c6e3 = R => {
    const pa = pick(R, [.4, .5, .3, .6]), pb = pick(R, [.2, .25, .5, .3]), ind = R() < .5, pab = ind ? rnd(pa * pb, 4) : rnd(pa * pb + pick(R, [.05, -.04, .08]), 4);
    const pa2 = pick(R, [.25, .45]), pb2 = pick(R, [.4, .6]), pab2 = ind ? rnd(pa2 * pb2 + .06, 4) : rnd(pa2 * pb2, 4);
    const rows = [['Cas 1 : carte (A) et achat en ligne (B)', fr(pa), fr(pb), fr(pab), tb('a', p2(pa * pb), 14)], ['Cas 2 : moins de 25 ans (A) et paiement mobile (B)', fr(pa2), fr(pb2), fr(pab2), tb('c', p2(pa2 * pb2), 14)]];
    const items = [num('a', rnd(pa * pb, 4), 4, p2(pa * pb), [{ v: rnd(pa + pb, 4), m: 'On multiplie P(A) par P(B).' }]), qcm('b', ['indépendants', 'pas indépendants'], ind ? 0 : 1, ind ? 'indépendants : P(A ∩ B) = P(A) × P(B)' : 'pas indépendants : P(A ∩ B) ≠ P(A) × P(B)'),
      num('c', rnd(pa2 * pb2, 4), 4, p2(pa2 * pb2)), qcm('d', ['indépendants', 'pas indépendants'], ind ? 1 : 0, !ind ? 'indépendants : P(A ∩ B) = P(A) × P(B)' : 'pas indépendants : P(A ∩ B) ≠ P(A) × P(B)')];
    return { titre: 'Indépendants ou pas ?', consigne: 'Pour chaque cas, calcule P(A) × P(B), puis compare à P(A ∩ B).',
      support: table(['Situation (enquête fictive)', 'P(A)', 'P(B)', 'P(A ∩ B)', 'P(A) × P(B)'], rows) + `<p class="tr-l">b. Dans le cas 1, A et B sont :</p><p class="tr-l">d. Dans le cas 2, A et B sont :</p>`, items,
      hints: ['Calcule le produit P(A) × P(B).', 'Si ce produit est égal à P(A ∩ B), les évènements sont indépendants.', 'Sinon, savoir que A est réalisé change la probabilité de B.'] };
  };
  if (typeof module !== 'undefined') module.exports = {};
})(typeof module !== 'undefined' ? module.exports : window);
