/* 1re · chapitre 2 — Résolution graphique : image, antécédent, f(x) = g(x), f(x) ≥ g(x), seuil de rentabilité. */
(function (root) {
  'use strict';
  const { DEP, TR, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, rnd, eur, pct, tb, sb, T, svg, table, num, qcm, pick, int, L, P } = H;
  const RED = P.RED;
  /* deux offres de location : A = a·j ; B = f + b·j ; elles coûtent pareil pour j0 jours */
  const offres = R => { for (;;) { const j0 = pick(R, [4, 5, 6, 8]), f = pick(R, [40, 60, 80, 120, 160]), b = pick(R, [10, 12, 15, 20]); if (f % j0) continue; return { j0, f, b, a: b + f / j0 }; } };
  const gOff = (o, ymax, lab) => { const jm = 2 * o.j0 + 2, ym = ymax || Math.ceil((o.a * jm) / 100) * 100, dy = ym / 5, g = P.plot({ W: 600, H: 290, x: [0, jm, jm > 12 ? 2 : 1], y: [0, ym, dy], ml: 56, xl: 'jours', yl: 'coût (€)', cls: 'pic vis trs', lab: lab || 'Deux offres de location', fine: true });
    return { g, svg: g.wrap(g.base + g.line(o.a, 0, { stroke: RED, w: 3 }) + g.line(o.b, o.f, { stroke: '#1D5FC2', w: 3 }) + g.txt(jm * .86, o.a * jm * .86, 'offre A', { dy: -10, fill: RED, cls: '', a: 'middle' }) + g.txt(jm * .86, o.f + o.b * jm * .86, 'offre B', { dy: 22, fill: '#1D5FC2', a: 'middle' })) }; };

  DEP.c2 = R => {
    const o = offres(R), { svg: s } = gOff(o), j1 = o.j0 - 1 - int(R, 0, 1), j2 = o.j0 + 2 + int(R, 0, 2), A = j => o.a * j, B = j => o.f + o.b * j;
    return { titre: 'Deux offres de location de stand', doc: `<div class="wfig">${s}</div><p class="srcl">Salon des créateurs : offre A (sans forfait) et offre B (avec forfait de départ). Entreprise fictive.</p>`,
      qs: [{ t: 'Quel est le forfait de départ de l’offre B (coût pour 0 jour) ?', kind: 'num', v: o.f, tol: .006, a: eur(o.f, 0) },
        { t: 'Combien coûte l’offre A pour 2 jours ?', kind: 'num', v: A(2), tol: .006, a: eur(A(2), 0) },
        { t: `Pour ${j1} jours, quelle offre est la moins chère ?`, kind: 'qcm', choices: ['offre A', 'offre B'], ok: A(j1) < B(j1) ? 0 : 1, a: `${A(j1) < B(j1) ? 'offre A' : 'offre B'} : ${A(j1)} € contre ${B(j1)} €` },
        { t: `Pour ${j2} jours, quelle offre est la moins chère ?`, kind: 'qcm', choices: ['offre A', 'offre B'], ok: A(j2) < B(j2) ? 0 : 1, a: `${A(j2) < B(j2) ? 'offre A' : 'offre B'} : ${A(j2)} € contre ${B(j2)} €` },
        { t: 'Pour combien de jours les deux offres coûtent-elles pareil ?', kind: 'num', v: o.j0, tol: .01, a: `${o.j0} jours` }] };
  };
  /* e1 · image et antécédent */
  TR.c2e1 = R => {
    let a, b; do { a = pick(R, [1, 2, 3, 4, -1, -2]); b = int(R, 0, 4); } while (a * 0 + b < 0);
    const f = x => a * x + b, xs = shuffleInts(R, 1, 8, 2), ys = [f(xs[0]), f(xs[1])];
    const xmax = 8, ymin = Math.min(0, f(0), f(xmax)), ymax = Math.max(f(0), f(xmax)), step = (ymax - ymin) > 20 ? 5 : 2, ytop = Math.ceil(ymax / step) * step, ybot = Math.floor(ymin / step) * step;
    const g = P.plot({ W: 600, H: 270, x: [0, xmax, 1], y: [ybot, ytop, step], ml: 44, cls: 'pic vis trs', lab: 'Droite représentative de f', zeroAxes: true, fine: true });
    let s = g.base + g.line(a, b, { w: 3.2 });
    const x1 = xs[0];
    s += g.pts([[x1, f(x1)], [xs[1], f(xs[1])]], { r: 4.5 });
    // antécédents : on choisit deux ordonnées atteintes en des abscisses entières
    const ax = [pick(R, [2, 3, 5]), pick(R, [6, 7, 8])], ay = ax.map(f);
    const out = [num('a', f(x1), 0, String(f(x1)), [{ v: x1, m: 'Tu as relu l’abscisse. L’image se lit sur l’axe vertical.' }]), num('b', f(xs[1]), 0, String(f(xs[1])), [{ v: xs[1], m: 'Tu as relu l’abscisse. L’image se lit sur l’axe vertical.' }]), num('c', ax[0], 0, String(ax[0]), [{ v: ay[0], m: 'Un antécédent se lit sur l’axe horizontal : c’est la valeur de x.' }]), num('d', ax[1], 0, String(ax[1]), [{ v: ay[1], m: 'Un antécédent se lit sur l’axe horizontal : c’est la valeur de x.' }])];
    s += g.dot(ax[0], ay[0], { r: 4.5, fill: '#FFC233' }) + g.dot(ax[1], ay[1], { r: 4.5, fill: '#FFC233' });
    const consigne = `Les deux points bleus ont pour abscisses ${x1} et ${xs[1]}. Lis leurs images (a, b). Les deux points jaunes ont pour ordonnées ${ay[0]} et ${ay[1]} : lis leurs antécédents (c, d).`;
    return { titre: 'Image et antécédent', consigne, support: g.wrap(s) + `<p class="tr-l">a. f(${x1}) = ${tb('a', out[0].a, 12)} &nbsp; b. f(${xs[1]}) = ${tb('b', out[1].a, 12)} &nbsp; c. f(x) = ${ay[0]} pour x = ${tb('c', out[2].a, 12)} &nbsp; d. f(x) = ${ay[1]} pour x = ${tb('d', out[3].a, 12)}</p>`, items: out,
      hints: ['L’image de x se lit sur l’axe vertical, en partant de x sur l’axe horizontal.', 'Un antécédent de y se lit sur l’axe horizontal, en partant de y sur l’axe vertical.', 'Suis les quadrillages avec le doigt, jusqu’à la droite.'] };
  };
  function shuffleInts(R, lo, hi, n) { const a = []; while (a.length < n) { const v = int(R, lo, hi); if (!a.includes(v)) a.push(v); } return a; }
  /* e2 · où se croisent les droites ? */
  TR.c2e2 = R => {
    const o = offres(R), A = j => o.a * j, B = j => o.f + o.b * j, { svg: s } = gOff(o, null, 'Deux droites qui se croisent');
    const jt = o.j0 + 2, jl = o.j0 - 2 > 0 ? o.j0 - 2 : 1;
    const items = [num('a', o.j0, 0, String(o.j0), [{ v: A(o.j0), m: 'Tu as donné le coût. L’abscisse du point de croisement est le nombre de jours.' }]), num('b', A(o.j0), 0, eur(A(o.j0), 0), [{ v: o.j0, m: 'L’ordonnée est le coût en euros, pas le nombre de jours.' }]), num('c', B(o.j0), 0, eur(B(o.j0), 0)), qcm('d', ['offre A', 'offre B'], A(jt) < B(jt) ? 0 : 1, `${A(jt) < B(jt) ? 'offre A' : 'offre B'} : la moins chère est celle dont la droite est en dessous`), qcm('e', ['offre A', 'offre B'], A(jl) < B(jl) ? 0 : 1, `${A(jl) < B(jl) ? 'offre A' : 'offre B'} : la moins chère est celle dont la droite est en dessous`)];
    return { titre: 'Où se croisent les droites ?', consigne: 'Le point de croisement des deux droites donne la solution de l’équation « offre A = offre B ». Complète a, b, c, puis réponds à d et e.', support: s + `<p class="tr-l">a. Abscisse du point de croisement : ${tb('a', items[0].a, 12)} jours</p><p class="tr-l">b. Coût de l’offre A à ce point : ${tb('b', items[1].a, 16)}</p><p class="tr-l">c. Coût de l’offre B à ce point : ${tb('c', items[2].a, 16)}</p><p class="tr-l">d. Pour ${jt} jours, la moins chère est</p><p class="tr-l">e. Pour ${jl} jour${jl > 1 ? 's' : ''}, la moins chère est</p>`, items,
      hints: ['Cherche le point où les deux droites se coupent.', 'Lis son abscisse sur l’axe horizontal, puis son ordonnée sur l’axe vertical.', 'La moins chère est celle dont la droite est la plus basse.'] };
  };
  /* e3 · le seuil de rentabilité */
  TR.c2e3 = R => {
    const m = pick(R, [5, 6, 8, 10]), qs = pick(R, [20, 30, 40, 50, 60]), cv = pick(R, [3, 4, 5, 6]), cf = m * qs, p = cv + m, ym = Math.ceil(p * qs * 1.8 / 100) * 100, xm = Math.ceil(qs * 1.8 / 10) * 10;
    const g = P.plot({ W: 600, H: 290, x: [0, xm, xm / 5], y: [0, ym, ym / 5], ml: 56, xl: 'nombre d’articles', yl: '€', cls: 'pic vis trs', lab: 'Coût total et recette', fine: true });
    let s = g.base + g.line(cv, cf, { stroke: RED, w: 3 }) + g.line(p, 0, { stroke: '#1E7F45', w: 3 }) + g.txt(xm * .9, cv * xm * .9 + cf, 'coût total', { dy: -10, fill: RED, cls: '', a: 'middle' }) + g.txt(xm * .9, p * xm * .9, 'recette', { dy: 20, fill: '#1E7F45', cls: '', a: 'middle' });
    const q2 = qs + pick(R, [10, 20, 30]), q3 = qs - pick(R, [5, 10]), rs = q => p * q - (cf + cv * q);
    const items = [num('a', qs, 0, String(qs), [{ v: p * qs, m: 'Tu as lu l’ordonnée. Le seuil est un nombre d’articles : c’est l’abscisse.' }]), num('b', p * qs, 0, eur(p * qs, 0)), num('c', rs(q2), 0, eur(rs(q2), 0), [{ v: p * q2, m: 'Tu as donné la recette. Le résultat = recette − coût total.' }]), qcm('d', ['un bénéfice', 'une perte'], 1, `une perte : ${q3} articles est en dessous du seuil de ${qs}`)];
    return { titre: 'Le seuil de rentabilité', consigne: `Le coût total vaut ${cf} + ${cv}q et la recette ${p}q. Lis le seuil sur le graphique (a, b), puis calcule le résultat pour ${q2} articles (c) et réponds à d.`, support: g.wrap(s) + `<p class="tr-l">a. Seuil de rentabilité (nombre d’articles) : ${tb('a', items[0].a, 12)}</p><p class="tr-l">b. Recette et coût total à ce seuil : ${tb('b', items[1].a, 18)}</p><p class="tr-l">c. Résultat pour ${q2} articles : ${tb('c', items[2].a, 18)}</p><p class="tr-l">d. Avec ${q3} articles vendus, l’entreprise réalise : </p>`, items,
      hints: ['Le seuil est le point où la recette rejoint le coût total.', 'À droite du seuil, la droite verte est au-dessus : le résultat est positif.', 'Résultat = recette − coût total = ' + p + 'q − (' + cf + ' + ' + cv + 'q).'] };
  };
  if (typeof module !== 'undefined') module.exports = {};
})(typeof module !== 'undefined' ? module.exports : window);
