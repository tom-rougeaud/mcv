/* 1re · chapitre 1 — Calculs commerciaux et financiers : coût, recette, résultat, coût moyen, coût marginal, intérêts simples, taux. */
(function (root) {
  'use strict';
  const { DEP, TR, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, rnd, eur, pct, tb, sb, T, svg, table, num, qcm, pick, int, L, P, xs } = H;

  /* « Atelier Mia » : coût fixe cf, coût variable cv par bougie, prix p. Seuil q* = cf ÷ (p − cv), toujours entier. */
  const mia = R => { const m = pick(R, [5, 6, 8]), cv = pick(R, [3, 4, 5, 6]), qs = pick(R, [50, 60, 75, 80, 100]); return { cv, p: cv + m, cf: m * qs, qs, m }; };
  const C = (a, q) => a.cf + a.cv * q;

  DEP.c1 = R => {
    const a = mia(R), qt = pick(R, [a.qs - 10, a.qs + 10]);
    const fiche = `<div class="aff3"><div class="aff3-h">🕯️ Atelier Mia</div>
      <table class="dt tcx dt-sm"><tbody><tr><th>Loyer et charges fixes, par mois</th><td data-cell="0">${eur(a.cf, 0)}</td></tr><tr><th>Coût de fabrication d’une bougie</th><td data-cell="1">${eur(a.cv, 0)}</td></tr><tr><th>Prix de vente d’une bougie (HT)</th><td data-cell="2">${eur(a.p, 0)}</td></tr></tbody></table></div>`;
    const g = rnd(a.p * qt - C(a, qt), 2);
    return { titre: 'La fiche de gestion de l’Atelier Mia', doc: fiche,
      qs: [{ t: 'Combien coûte la fabrication d’une bougie ?', kind: 'tap', cell: '1', v: a.cv, tol: .006, a: eur(a.cv, 0) },
        { t: 'Quelles sont les charges fixes du mois ?', kind: 'tap', cell: '0', v: a.cf, tol: .006, a: eur(a.cf, 0) },
        { t: 'Combien coûte la fabrication de 100 bougies ? (sans le loyer)', kind: 'num', v: 100 * a.cv, tol: .006, a: eur(100 * a.cv, 0), x: `100 × ${a.cv} = ${eur(100 * a.cv, 0)}` },
        { t: 'Quel est le coût total du mois pour 100 bougies ?', kind: 'num', v: C(a, 100), tol: .006, a: eur(C(a, 100), 0), x: `${fr(a.cf)} + 100 × ${a.cv} = ${fr(a.cf)} + ${fr(100 * a.cv)} = ${eur(C(a, 100), 0)}` },
        { t: `Avec ${qt} bougies vendues dans le mois, Mia gagne-t-elle de l’argent ?`, kind: 'qcm', choices: ['oui', 'non'], ok: g > 0 ? 0 : 1, a: `${g > 0 ? 'oui' : 'non'} : ${qt} × ${a.p} − (${a.cf} + ${qt} × ${a.cv}) = ${fr(g)} €` }] };
  };

  /* e1 · le bilan en pile : quatre barres à la même échelle */
  TR.c1e1 = R => {
    let a, q; do { a = mia(R); q = pick(R, [a.qs + 20, a.qs + 40, a.qs + 50, a.qs + 70, a.qs + 100]); } while (q > 220);
    const vc = a.cv * q, ct = C(a, q), rec = a.p * q, res = rec - ct, k = 330 / rec, x0 = 24;
    const bar = (y, segs) => segs.map(([x, w, cls, lab, col]) => `<rect x="${(x0 + x * k).toFixed(1)}" y="${y}" width="${(w * k).toFixed(1)}" height="34" ${cls === 'h' ? 'fill="url(#hh)" stroke="#2B2D7C"' : `class="${cls} ks"`} stroke-width="1.8"/>` + (lab ? T((x0 + (x + w / 2) * k).toFixed(1), y + 22, lab, { fs: 12, c: col || 'tx' }) : '')).join('');
    let s = `<defs><pattern id="hh" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#FFF0B8"/><line x1="0" y1="0" x2="0" y2="7" stroke="#B88A00" stroke-width="2.4"/></pattern></defs>`;
    s += T(300, 16, `${q} bougies vendues · charges fixes ${eur(a.cf, 0)} · fabrication ${eur(a.cv, 0)} par bougie · prix ${eur(a.p, 0)}`, { fs: 13, c: 'ts' });
    const rows = [['a. coût variable = nombre × coût d’une bougie', 0, [[0, vc, 'k2', 'variable']], 'a', vc], ['b. coût total = charges fixes + variable', 1, [[0, a.cf, 'k2', 'fixe'], [a.cf, vc, 'k', 'variable', 'tw']], 'b', ct], ['c. recette = nombre × prix', 2, [[0, rec, 'k2', 'recette']], 'c', rec], ['d. résultat = recette − coût total', 3, [[0, ct, 'wh', ''], [ct, res, 'h', 'résultat']], 'd', res]];
    rows.forEach(([lab, i, segs, key, val]) => { const y = 30 + i * 66; s += T(x0, y + 8, lab, { fs: 12, a: 'start', c: 'kt' }) + bar(y + 14, segs) + sb(372, y + 14, 120, key, eur(val), 34); });
    const items = [num('a', vc, 2, eur(vc), [{ v: a.cv + q, m: 'Tu as additionné. Le coût variable est une multiplication : ' + q + ' × ' + a.cv + '.' }]), num('b', ct, 2, eur(ct), [{ v: vc, m: 'Tu as oublié les charges fixes : coût total = fixes + variable.' }]), num('c', rec, 2, eur(rec), [{ v: ct, m: 'La recette, c’est ce que les clients paient : nombre × prix de vente.' }]), num('d', res, 2, eur(res), [{ v: rec + ct, m: 'Le résultat se calcule par une soustraction : recette − coût total.' }])];
    xs(items, { a: `${q} × ${a.cv} = ${eur(vc)}`, b: `${fr(a.cf)} + ${fr(vc)} = ${eur(ct)}`, c: `${q} × ${a.p} = ${eur(rec)}`, d: `${fr(rec)} − ${fr(ct)} = ${eur(res)}` });
    return { titre: 'Le bilan en pile', consigne: 'Les quatre barres sont à la même échelle. Complète les montants a, b, c et d.', support: svg(600, 296, s, 'Quatre barres : coût variable, coût total, recette, résultat'), items,
      hints: ['Coût variable : multiplie le nombre de bougies par le coût d’une bougie.', 'Coût total : ajoute les charges fixes au coût variable.', 'Résultat : recette moins coût total. La barre hachurée est ce qui dépasse.'] };
  };

  /* e2 · coût moyen et coût marginal */
  TR.c1e2 = R => {
    const a = mia(R), qs = [pick(R, [25, 40, 50]), pick(R, [200, 250, 400])];
    const rows = qs.map((q, i) => { const ct = C(a, q), cm = rnd(ct / q, 2); return { q, ct, cm, k1: L[2 * i], k2: L[2 * i + 1] }; });
    const items = []; rows.forEach(r => { items.push(num(r.k1, r.ct, 2, eur(r.ct, 0), [{ v: a.cv * r.q, m: 'N’oublie pas les charges fixes de ' + eur(a.cf, 0) + '.' }]), num(r.k2, r.cm, 2, eur(r.cm), [{ v: a.cv, m: 'Le coût moyen divise le coût total par le nombre : ce n’est pas le coût d’une bougie.' }, { v: r.ct, m: 'Il faut diviser le coût total par le nombre de bougies.' }])); });
    items.push(num('e', a.cv, 2, eur(a.cv, 0), [{ v: a.cf, m: 'Le coût marginal est le coût d’une bougie en plus : les charges fixes ne bougent pas.' }]), qcm('f', ['diminue', 'augmente'], 0, 'diminue : les charges fixes se partagent entre plus de bougies'));
    const xm = { e: `C(n + 1) − C(n) = ${a.cv} € : seules les fabrications augmentent`, f: `${eur(rows[0].cm)} pour ${rows[0].q} bougies, ${eur(rows[1].cm)} pour ${rows[1].q} bougies` }; rows.forEach(r => { xm[r.k1] = `${fr(a.cf)} + ${a.cv} × ${r.q} = ${eur(r.ct, 0)}`; xm[r.k2] = `${fr(r.ct)} ÷ ${r.q} ≈ ${eur(r.cm)}`; }); xs(items, xm);
    const dm = rows.map(r => [String(r.q), tb(r.k1, eur(r.ct, 0), 22), tb(r.k2, eur(r.cm), 22)]);
    return { titre: 'Coût moyen et coût marginal', consigne: `Charges fixes : ${eur(a.cf, 0)}. Fabrication : ${eur(a.cv, 0)} par bougie. Complète le tableau (coût moyen au centime près), puis réponds à e et f.`,
      support: table(['Nombre de bougies', 'Coût total', 'Coût moyen = total ÷ nombre'], dm) + `<p class="tr-l">e. Le coût de la bougie fabriquée <b>en plus</b> (coût marginal) vaut ${tb('e', eur(a.cv, 0), 16)}</p><p class="tr-l">f. Quand on fabrique plus de bougies, le coût moyen :</p>`, items,
      hints: ['Coût total = charges fixes + coût d’une bougie × nombre.', 'Coût moyen = coût total ÷ nombre de bougies, arrondi au centime.', 'Le coût marginal est ce que coûte une bougie de plus : il ne contient pas les charges fixes.'] };
  };

  /* e3 · intérêts simples et taux proportionnels */
  TR.c1e3 = R => {
    const T0 = [2.4, 3, 3.6, 4.8, 6, 7.2], rows = [0, 1, 2].map(() => ({ c: pick(R, [1200, 1500, 2000, 2400, 3000, 4800]), t: pick(R, T0), n: pick(R, [3, 4, 6, 8, 9, 12]) }));
    const ints = rows.map(r => rnd(r.c * r.t / 100 * r.n / 12, 2)), t = pick(R, T0), tm = rnd(t / 12, 6), tq = rnd(t / 24, 6), cj = pick(R, [1800, 2400, 3600, 5400]), j = pick(R, [30, 45, 60, 90]), ij = rnd(cj * t / 100 * j / 360, 2);
    const items = rows.map((r, i) => num(L[i], ints[i], 2, eur(ints[i]), [{ v: rnd(r.c * r.t / 100, 2), m: 'Tu as calculé les intérêts d’un an. La durée est de ' + r.n + ' mois : multiplie par ' + r.n + ' ÷ 12.' }, { v: rnd(r.c * r.t / 100 * r.n, 2), m: 'Le taux est annuel : une durée de ' + r.n + ' mois, c’est ' + r.n + ' ÷ 12 d’année.' }]));
    items.push(num('d', tm, 4, pct(tm), [{ v: t, m: 'C’est le taux annuel. Pour passer au mois, divise par 12.' }]), num('e', tq, 4, pct(tq), [{ v: tm, m: 'Une quinzaine est la moitié d’un mois : divise encore par 2.' }, { v: rnd(t / 15, 6), m: 'Il y a 24 quinzaines dans une année : divise par 24.' }]), num('f', ij, 2, eur(ij), [{ v: rnd(cj * t / 100 * j / 365, 2), m: 'En calcul commercial, l’année compte 360 jours.' }, { v: rnd(cj * t / 100, 2), m: 'Tu as calculé un an. Il faut multiplier par ' + j + ' ÷ 360.' }]));
    const xm = { d: `${fr(t)} ÷ 12 = ${pct(tm)}`, e: `${fr(t)} ÷ 24 = ${pct(tq)}`, f: `${fr(cj)} × ${fr(t / 100)} × ${j} ÷ 360 = ${eur(ij)}` }; rows.forEach((r, i) => { xm[L[i]] = `${fr(r.c)} × ${fr(r.t / 100)} × ${r.n} ÷ 12 = ${eur(ints[i])}`; }); xs(items, xm);
    const body = rows.map((r, i) => [eur(r.c, 0), pct(r.t), r.n + ' mois', tb(L[i], eur(ints[i]), 22)]);
    let s = T(300, 22, `Taux annuel : ${pct(t)}`, { fs: 16 }) + `<path d="M300 32V52" class="ks" stroke-width="2.4"/><path d="M294 46L300 56L306 46Z" class="k"/>` + T(318, 48, '÷ 12', { fs: 14, a: 'start', c: 'kt' }) + `<rect x="170" y="60" width="260" height="38" rx="8" class="k2 ks" stroke-width="2"/>` + T(230, 84, 'mensuel', { fs: 13 }) + sb(300, 64, 120, 'd', pct(tm), 30)
      + `<path d="M300 100V120" class="ks" stroke-width="2.4"/><path d="M294 114L300 124L306 114Z" class="k"/>` + T(318, 116, '÷ 2', { fs: 14, a: 'start', c: 'kt' }) + `<rect x="170" y="128" width="260" height="38" rx="8" class="k2 ks" stroke-width="2"/>` + T(238, 152, 'par quinzaine', { fs: 13 }) + sb(300, 132, 120, 'e', pct(tq), 30);
    return { titre: 'Intérêts simples et taux', consigne: 'Intérêts simples = capital × taux annuel × durée en années. Complète le tableau (a, b, c), puis l’échelle des taux (d, e) et le calcul en jours (f, année de 360 jours).',
      support: table(['Capital', 'Taux annuel', 'Durée', 'Intérêts'], body) + svg(600, 176, s, 'Du taux annuel au taux mensuel et au taux par quinzaine') + `<p class="tr-l">f. ${eur(cj, 0)} placés à ${pct(t)} pendant ${j} jours rapportent ${tb('f', eur(ij), 20)}</p>`, items,
      hints: ['Intérêts = capital × taux × durée en années. 6 mois = 6 ÷ 12 d’année.', 'Taux mensuel = taux annuel ÷ 12. Taux par quinzaine = taux annuel ÷ 24.', 'En jours : capital × taux × jours ÷ 360.'] };
  };
  if (typeof module !== 'undefined') module.exports = {};
  /* ===== exercice ajouté : notion 4 (les taux : an, mois, quinzaine, jour) ===== */
  {
    const { Q, fr, rnd, pick, int, table, eur } = H;
    TR.c1e4 = R => {
      const t = pick(R, [2.4, 3, 3.6, 4.2, 6]), C = pick(R, [1500, 2000, 2400, 3000, 4800]), j = pick(R, [30, 45, 60, 72, 90, 120]);
      const I = rnd(C * t / 100 * j / 360, 2), tm = t / 12, tq = t / 24;
      return Q('Les taux : an, mois, quinzaine, jour', `Un capital est placé à intérêts simples au taux annuel de ${fr(t, 1)} %. On compte une année de 360 jours et un mois de 30 jours.`, [
        { lab: 'Taux mensuel, en % (t ÷ 12)', v: tm, d: 3, w: 14, x: `${fr(t, 1)} ÷ 12 = ${fr(tm, 3)} %`, err: [{ v: t * 12, m: 'Pour passer à un mois, on divise le taux annuel par 12.' }] },
        { lab: 'Taux par quinzaine, en % (t ÷ 24)', v: tq, d: 3, w: 14, x: `${fr(t, 1)} ÷ 24 = ${fr(tq, 3)} %`, err: [{ v: tm, m: 'Une année compte 24 quinzaines : divise par 24.' }] },
        { lab: `Intérêts sur ${j} jours (C × t × j ÷ 360), en €`, v: I, d: 2, w: 16, x: `${fr(C, 0)} × ${fr(t / 100, 3)} × ${j} ÷ 360 = ${fr(I)} €`, err: [{ v: rnd(C * t / 100, 2), m: 'Ces intérêts sont ceux d’une année entière : multiplie par j ÷ 360.' }] },
        { lab: 'Valeur acquise au bout de ces jours (C + I), en €', v: rnd(C + I, 2), d: 2, w: 16, x: `${fr(C, 0)} + ${fr(I)} = ${fr(C + I)} €` },
        { lab: 'Pour un placement de 360 jours, les intérêts sont…', qcm: ['ceux d’une année entière', 'la moitié d’une année', 'ceux d’un mois'], ok: 0, x: `Sur 360 jours : I = C × t × 360 ÷ 360 = C × t, c’est-à-dire les intérêts d’une année entière.` }],
        ['Un an = 12 mois = 24 quinzaines = 360 jours (année commerciale).', 'Taux d’une période = taux annuel ÷ nombre de périodes dans l’année.', 'Intérêts sur j jours : I = C × t × j ÷ 360.'],
        table(['Capital', 'Taux annuel', 'Durée'], [[eur(C), `${fr(t, 1)} %`, `${j} jours`]]));
    };
  }
  /* ===== rappels de seconde (pour le « Point de départ » du chapitre 1) : pourcentages, proportionnalité, évolutions ===== */
  {
    const { Q, fr, rnd, pick, table, eur } = H;
    /* rp1 : une remise, puis une hausse */
    TR.rp1 = R => {
      const P = pick(R, [80, 120, 160, 200, 240, 400]), t = pick(R, [10, 15, 20, 25, 30]), h = pick(R, [5, 10, 20]);
      const rem = rnd(P * t / 100, 2), np = rnd(P - rem, 2), fin = rnd(np * (1 + h / 100), 2), cm1 = rnd(1 - t / 100, 2), cm2 = rnd(1 + h / 100, 2);
      return Q('Pourcentages : une remise, puis une hausse', `Un article coûte ${eur(P, 0)}. Il est soldé à −${t} %, puis son prix augmente de ${h} %.`, [
        { lab: `Montant de la remise (${t} % de ${fr(P, 0)}), en €`, v: rem, d: 2, w: 14, x: `${fr(P, 0)} × ${fr(t / 100)} = ${fr(rem)} €`, err: [{ v: np, m: 'Tu as calculé le prix soldé. La remise est la part retirée : prix × taux.' }] },
        { lab: 'Prix soldé, en €', v: np, d: 2, w: 14, x: `${fr(P, 0)} − ${fr(rem)} = ${fr(np)} €`, err: [{ v: rem, m: 'C’est le montant de la remise. Prix soldé = prix de départ − remise.' }] },
        { lab: `Prix après la hausse de ${h} %, en €`, v: fin, d: 2, w: 14, x: `${fr(np)} × ${fr(cm2)} = ${fr(fin)} €`, err: [{ v: rnd(np * h / 100, 2), m: 'Tu as calculé seulement la hausse. Ajoute-la au prix soldé.' }, { v: rnd(P * cm2, 2), m: 'La hausse s’applique au prix soldé, pas au prix de départ.' }] },
        { lab: 'Le prix final est…', qcm: ['plus petit que le prix de départ', 'égal au prix de départ', 'plus grand que le prix de départ'], ok: fin < P ? 0 : fin === P ? 1 : 2, x: `${fr(fin)} € ${fin < P ? '<' : fin > P ? '>' : '='} ${fr(P, 0)} € : coefficients ${fr(cm1)} × ${fr(cm2)} = ${fr(rnd(cm1 * cm2, 4))}` }],
      ['Remise = prix × taux ÷ 100. Prix soldé = prix de départ − remise.', 'Une hausse de h % : on multiplie par 1 + h ÷ 100.', 'Une baisse puis une hausse du même ordre ne se compensent pas exactement.'],
      table(['Prix de départ', 'Remise', 'Hausse ensuite'], [[eur(P, 0), `−${t} %`, `+${h} %`]]));
    };
    /* rp2 : proportionnalité */
    TR.rp2 = R => {
      const u = pick(R, [1.5, 2.5, 3, 4, 4.5, 6, 7.5]), n0 = pick(R, [8, 10, 12, 15, 20, 24]), n1 = pick(R, [30, 40, 50, 60, 75]), m = pick(R, [14, 18, 25, 32, 40]);
      const P0 = rnd(u * n0, 2), P1 = rnd(u * n1, 2), B = rnd(u * m, 2);
      return Q('Proportionnalité : prix et quantités', `Dans un atelier, ${n0} bougies coûtent ${eur(P0)}. Le prix est proportionnel au nombre de bougies.`, [
        { lab: 'Prix d’une bougie, en €', v: u, d: 2, w: 14, x: `${fr(P0)} ÷ ${n0} = ${fr(u)} €`, err: [{ v: rnd(n0 / P0, 2), m: 'Tu as divisé dans le mauvais sens. Prix d’une bougie = prix total ÷ nombre de bougies.' }] },
        { lab: `Prix de ${n1} bougies, en €`, v: P1, d: 2, w: 14, x: `${n1} × ${fr(u)} = ${fr(P1)} €`, err: [{ v: rnd(P0 + n1 - n0, 2), m: 'Ce n’est pas une addition : le prix est proportionnel, on multiplie par le prix d’une bougie.' }] },
        { lab: `Nombre de bougies pour ${eur(B)}`, v: m, d: 0, w: 12, x: `${fr(B)} ÷ ${fr(u)} = ${m} bougies`, err: [{ v: rnd(B * u, 2), m: 'Tu as multiplié. Pour trouver un nombre de bougies, on divise le budget par le prix d’une bougie.' }] },
        { lab: 'Avec deux fois plus de bougies, le prix est…', qcm: ['deux fois plus grand', 'le même', 'deux fois plus petit'], ok: 0, x: 'Prix et nombre sont proportionnels : le prix est multiplié par 2 comme le nombre de bougies.' }],
      ['Prix d’une bougie = prix total ÷ nombre de bougies.', 'Prix de n bougies = n × prix d’une bougie.', 'Nombre de bougies = budget ÷ prix d’une bougie.'],
      table(['Nombre de bougies', 'Prix à payer'], [[String(n0), eur(P0)], [String(n1), '?'], [String(m), eur(B)]]));
    };
    /* rp3 : évolution, taux et coefficient multiplicateur */
    TR.rp3 = R => {
      const A = pick(R, [40, 60, 80, 120, 200, 250]), r = pick(R, [5, 10, 15, 20, 25, -5, -10, -20, -25]), cm = rnd(1 + r / 100, 2), B = rnd(A * cm, 2), A2 = pick(R, [100, 300, 400, 600]), B2 = rnd(A2 * cm, 2);
      return Q('Évolution : variation, taux et coefficient', `Le prix d’un article passe de ${eur(A, 0)} à ${eur(B)}.`, [
        { lab: 'Variation (valeur finale − valeur de départ), en €', v: rnd(B - A, 2), d: 2, w: 14, x: `${fr(B)} − ${fr(A, 0)} = ${fr(rnd(B - A, 2))} €`, err: [{ v: rnd(A - B, 2), m: 'Variation = valeur finale − valeur de départ (dans cet ordre).' }] },
        { lab: 'Taux d’évolution, en % (négatif si le prix baisse)', v: r, d: 1, w: 14, x: `(${fr(rnd(B - A, 2))} ÷ ${fr(A, 0)}) × 100 = ${fr(r, 0)} %`, err: [{ v: rnd((B - A) / B * 100, 1), m: 'On divise par la valeur de départ, pas par la valeur finale.' }, { v: rnd(B - A, 2), m: 'C’est la variation en euros. Le taux se calcule en divisant par la valeur de départ.' }] },
        { lab: 'Coefficient multiplicateur (valeur finale ÷ valeur de départ)', v: cm, d: 2, w: 14, x: `${fr(B)} ÷ ${fr(A, 0)} = ${fr(cm)}  (= 1 ${r < 0 ? '−' : '+'} ${fr(Math.abs(r) / 100)})`, err: [{ v: rnd(r / 100, 2), m: 'C’est le taux écrit en nombre. Coefficient multiplicateur = 1 + taux.' }] },
        { lab: `Avec la même évolution, un article à ${eur(A2, 0)} passe à, en €`, v: B2, d: 2, w: 14, x: `${fr(A2, 0)} × ${fr(cm)} = ${fr(B2)} €`, err: [{ v: rnd(A2 * r / 100, 2), m: 'Tu as calculé seulement la variation. Multiplie par le coefficient pour obtenir le nouveau prix.' }] }],
      ['Variation = valeur finale − valeur de départ.', 'Taux d’évolution = variation ÷ valeur de départ, puis × 100 pour l’avoir en %.', 'Coefficient multiplicateur = valeur finale ÷ valeur de départ = 1 + taux.'],
      table(['Valeur de départ', 'Valeur finale'], [[eur(A, 0), eur(B)]]));
    };
  }
})(typeof module !== 'undefined' ? module.exports : window);
