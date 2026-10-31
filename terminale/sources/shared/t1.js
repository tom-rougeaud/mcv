/* Terminale · chapitre 1 — Suites numériques : suites géométriques, terme de rang n, sens de variation, somme des premiers termes. */
(function (root) {
  'use strict';
  const { DEP, TR, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, rnd, tb, sb, T, svg, table, num, qcm, pick, int, P, xs } = H;
  const sup = n => String(n).split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('');
  const sub = n => String(n).split('').map(d => '₀₁₂₃₄₅₆₇₈₉'[d]).join('');
  const f2 = x => fr(rnd(x, 2));
  /* axe gradué : un maximum et un pas « ronds » (4 à 5 graduations) */
  const axis = m => { const raw = m / 4, p = Math.pow(10, Math.floor(Math.log10(raw))), step = [1, 2, 2.5, 5, 10].map(k => k * p).find(s => s >= raw); return [Math.ceil(m / step - 1e-9) * step, step]; };

  /* point de départ : un tableau de suivi mensuel (suite géométrique à termes entiers) */
  const SETS = [{ u0: 625, q: 1.2 }, { u0: 1250, q: 1.2 }, { u0: 160, q: 1.5 }, { u0: 320, q: 1.5 }, { u0: 10000, q: 1.1 }, { u0: 625, q: .8 }, { u0: 1250, q: .8 }, { u0: 2000, q: .9 }];
  DEP.c1 = R => {
    const { u0, q } = pick(R, SETS), up = q > 1, u = n => rnd(u0 * Math.pow(q, n), 4), N = [0, 1, 2, 3, 4], k = int(R, 1, 4), pc = rnd(Math.abs(q - 1) * 100, 2);
    const what = up ? 'Abonnés à la lettre d’information' : 'Visites d’une ancienne page produit';
    const tabl = `<table class="dt tcx dt-sm dt-c"><thead><tr><th>Mois n</th>${N.map(n => `<th>${n}</th>`).join('')}</tr></thead><tbody><tr><th>${up ? 'Abonnés' : 'Visites'}</th>${N.map(n => `<td data-cell="${n}">${fr(u(n))}</td>`).join('')}</tr></tbody></table>`;
    const [ym, ys] = axis(Math.max(u(0), u(4)) * 1.08), g = P.plot({ W: 600, H: 220, x: [0, 5, 1], y: [0, ym, ys], ml: 58, mt: 22, mb: 34, xl: 'mois n', yl: up ? 'abonnés' : 'visites', fine: true });
    const d = rnd(u(4) - u(3), 4);
    const ch = [`${fr(u(4))} × ${fr(q)}`, `${fr(u(4))} ${d >= 0 ? '+' : '−'} ${fr(Math.abs(d))}`, `${fr(u0)} × 5`], o = int(R, 0, 2), rot = [...ch.slice(o), ...ch.slice(0, o)];
    return { titre: `${what} · Boutique Lina`, doc: tabl + `<div class="wfig">${g.wrap(g.base + g.pts(N.map(n => [n, u(n)]), { r: 5 }))}</div><p class="srcl">Relevé du premier jour de chaque mois (mois 0 : début du suivi).</p>`,
      qs: [{ t: `Quelle est la valeur au mois ${k} ?`, kind: 'tap', cell: String(k), v: u(k), tol: .01, a: fr(u(k)) },
        { t: 'Par quel nombre multiplie-t-on pour passer d’un mois au suivant ?', kind: 'num', v: q, tol: .001, a: fr(q), x: `${fr(u(1))} ÷ ${fr(u0)} = ${fr(q)}` },
        { t: 'Les écarts d’un mois à l’autre sont-ils toujours les mêmes ?', kind: 'qcm', choices: ['oui', 'non'], ok: 1, a: `non : ${fr(u(1) - u(0))} puis ${fr(u(2) - u(1))}… la suite n’est pas arithmétique` },
        { t: `C’est une ${up ? 'hausse' : 'baisse'} de combien de pour cent chaque mois ?`, kind: 'num', v: pc, tol: .01, a: `${fr(pc)} %`, x: `q = ${fr(q)} = 1 ${up ? '+' : '−'} ${fr(pc / 100)} : ${up ? 'hausse' : 'baisse'} de ${fr(pc)} % par mois` },
        { t: 'Quel calcul donne la valeur du mois 5 ?', kind: 'qcm', choices: rot, ok: rot.indexOf(ch[0]), a: `${ch[0]} = ${fr(rnd(u(5), 2))}` }] };
  };

  /* e1 · arithmétique ou géométrique ? */
  TR.c1e1 = R => {
    const u0 = pick(R, [200, 400, 500, 800, 1000, 1600]), q = pick(R, [1.1, 1.2, 1.5, .8, .9, .5]), v0 = pick(R, [200, 300, 450, 600]), r = pick(R, [20, 25, 40, -15, -30]);
    const G = n => rnd(u0 * Math.pow(q, n), 6), A = n => v0 + r * n, N = [0, 1, 2, 3, 4], gFirst = R() < .5;
    const rows = gFirst ? [['Suite A', G], ['Suite B', A]] : [['Suite A', A], ['Suite B', G]], gName = gFirst ? 'A' : 'B', aName = gFirst ? 'B' : 'A';
    const items = [num('a', q, 3, fr(q), [{ v: rnd(G(1) - G(0), 4), m: 'Tu as calculé une différence. Pour une suite géométrique, on divise : terme suivant ÷ terme précédent.' }]),
      num('b', q, 3, fr(q), [{ v: rnd(G(4) - G(3), 4), m: 'On divise le terme de rang 4 par celui de rang 3.' }]),
      qcm('c', ['la suite A', 'la suite B'], gFirst ? 0 : 1, `la suite ${gName} : le quotient est toujours ${fr(q)}`),
      num('d', r, 2, fr(r), [{ v: rnd(A(1) / A(0), 4), m: 'Pour une suite arithmétique, la raison est une différence : terme suivant − terme précédent.' }, { v: -r, m: 'Calcule « terme suivant moins terme précédent », dans cet ordre.' }]),
      num('e', G(5), 2, f2(G(5)), [{ v: rnd(G(4) + (G(4) - G(3)), 4), m: 'Tu as ajouté le dernier écart, comme pour une suite arithmétique. Ici, on multiplie par la raison.' }]),
      qcm('f', ['croissante', 'décroissante'], q > 1 ? 0 : 1, q > 1 ? `croissante : q = ${fr(q)} > 1` : `décroissante : 0 < q = ${fr(q)} < 1`)];
    xs(items, { a: `${f2(G(1))} ÷ ${f2(G(0))} = ${fr(q)}`, b: `${f2(G(4))} ÷ ${f2(G(3))} = ${fr(q)}`, c: `quotients constants (${fr(q)}) pour la suite ${gName} ; écarts constants (${fr(r)}) pour la suite ${aName}`, d: `${f2(A(1))} − ${f2(A(0))} = ${fr(r)}`, e: `${f2(G(4))} × ${fr(q)} = ${f2(G(5))}` });
    const body = rows.map(([lab, f]) => [lab, ...N.map(n => f2(f(n)))]);
    return { titre: 'Arithmétique ou géométrique ?', consigne: 'Une des deux suites est géométrique. Calcule les quotients, trouve-la, puis complète.',
      support: table(['', ...N.map(n => 'rang ' + n)], body) + `<p class="tr-l">a. Suite ${gName} : rang 1 ÷ rang 0 = ${tb('a', fr(q), 16)} · b. rang 4 ÷ rang 3 = ${tb('b', fr(q), 16)}</p><p class="tr-l">c. La suite géométrique est :</p><p class="tr-l">d. Raison de la suite arithmétique ${aName} : ${tb('d', fr(r), 16)} · e. Suite ${gName}, terme de rang 5 : ${tb('e', f2(G(5)), 20)}</p><p class="tr-l">f. La suite géométrique est :</p>`, items,
      hints: ['Suite géométrique : on divise un terme par le précédent, le résultat est toujours le même.', 'Suite arithmétique : on soustrait, le résultat est toujours le même.', 'Le terme suivant d’une suite géométrique : dernier terme × raison.'] };
  };

  /* e2 · le terme de rang n, sur un nuage de points */
  TR.c1e2 = R => {
    const u0 = pick(R, [500, 800, 1200, 2000]), t = pick(R, [4, 5, 8, -10, -15, -20]), q = rnd(1 + t / 100, 4), u = n => u0 * Math.pow(q, n), N = [0, 1, 2, 3, 4, 5, 6], M = pick(R, [10, 12, 15]);
    const [top, ys] = axis(Math.max(u(0), u(6)) * 1.25), g = P.plot({ W: 600, H: 290, x: [0, 7, 1], y: [0, top, ys], ml: 60, mt: 18, mb: 34, xl: 'rang n', yl: 'uₙ', fine: true });
    const ring = n => `<circle cx="${g.X(n).toFixed(1)}" cy="${g.Y(u(n)).toFixed(1)}" r="9" fill="none" stroke="${P.RED}" stroke-width="2.4"/>` + T(g.X(n), g.Y(u(n)) + (t > 0 ? 24 : -14), 'u' + sub(n), { fs: 13, c: 'kt' });
    const s = g.base + g.pts(N.map(n => [n, u(n)]), { r: 5 }) + ring(3) + ring(6) + `<rect x="${t > 0 ? 70 : 380}" y="22" width="200" height="74" rx="8" fill="#fff" stroke="#DCE2F2"/>` + T(t > 0 ? 84 : 394, 50, 'u₃ =', { fs: 14, a: 'start' }) + sb(t > 0 ? 130 : 440, 30, 128, 'b', f2(u(3)), 28) + T(t > 0 ? 84 : 394, 86, 'u₆ =', { fs: 14, a: 'start' }) + sb(t > 0 ? 130 : 440, 64, 128, 'c', f2(u(6)), 28);
    const items = [num('a', q, 4, fr(q), [{ v: t, m: `On n’utilise pas ${t} directement : une ${t > 0 ? 'hausse' : 'baisse'} de ${Math.abs(t)} % revient à multiplier par 1 ${t > 0 ? '+' : '−'} ${fr(Math.abs(t) / 100)}.` }, { v: rnd(t / 100, 4), m: `Il faut ajouter 1 : q = 1 ${t > 0 ? '+' : '−'} ${fr(Math.abs(t) / 100)}.` }]),
      num('b', rnd(u(3), 2), 2, f2(u(3)), [{ v: rnd(u0 * q * 3, 2), m: 'u₃ = u₀ × q³ : on multiplie trois fois par q, on ne multiplie pas par 3q.' }]),
      num('c', rnd(u(6), 2), 2, f2(u(6)), [{ v: rnd(u0 * Math.pow(q, 5), 2), m: 'De u₀ à u₆, on multiplie 6 fois par la raison : l’exposant est 6.' }]),
      num('d', rnd(u(M), 2), 2, f2(u(M)), [{ v: rnd(u0 + M * (u(1) - u0), 2), m: 'Tu as utilisé la formule d’une suite arithmétique. Ici : uₙ = u₀ × qⁿ.' }, { v: rnd(u0 * Math.pow(q, M - 1), 2), m: `L’exposant est le rang : ${M}.` }]),
      qcm('e', ['croissante', 'décroissante'], t > 0 ? 0 : 1, t > 0 ? `croissante : q = ${fr(q)} > 1` : `décroissante : 0 < q = ${fr(q)} < 1`)];
    xs(items, { a: `q = 1 ${t > 0 ? '+' : '−'} ${Math.abs(t)} ÷ 100 = ${fr(q)}`, b: `u₃ = ${fr(u0)} × ${fr(q)}³ ≈ ${f2(u(3))}`, c: `u₆ = ${fr(u0)} × ${fr(q)}⁶ ≈ ${f2(u(6))}`, d: `u${sub(M)} = ${fr(u0)} × ${fr(q)}${sup(M)} ≈ ${f2(u(M))}` });
    return { titre: 'Le terme de rang n', consigne: `u₀ = ${fr(u0)}, et chaque terme ${t > 0 ? 'augmente' : 'baisse'} de ${Math.abs(t)} %. Trouve la raison, puis les termes demandés, au centième.`,
      support: `<p class="tr-l">a. Raison : q = ${tb('a', fr(q), 16)}</p>` + svg(600, 290, s, 'Nuage de points de la suite, avec les termes de rang 3 et 6 entourés') + `<p class="tr-l">d. u${sub(M)} = ${fr(u0)} × ${fr(q)}${String(M).split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('')} = ${tb('d', f2(u(M)), 22)}</p><p class="tr-l">e. La suite est :</p>`, items,
      hints: [`Une ${t > 0 ? 'hausse' : 'baisse'} de ${Math.abs(t)} % : on multiplie par 1 ${t > 0 ? '+' : '−'} ${fr(Math.abs(t) / 100)}.`, 'Terme de rang n : uₙ = u₀ × qⁿ. Utilise la touche puissance de la calculatrice.', 'Raison plus grande que 1 : la suite monte. Entre 0 et 1 : elle descend.'] };
  };

  /* e3 · cumuler les termes, comme dans un tableur */
  const CUM = [{ u0: 64, q: 1.5 }, { u0: 50, q: 2 }, { u0: 625, q: 1.2 }, { u0: 1000, q: 1.1 }, { u0: 80, q: 1.5 }, { u0: 3125, q: .8 }];
  TR.c1e3 = R => {
    const { u0, q } = pick(R, CUM), u = n => rnd(u0 * Math.pow(q, n), 6), S = n => { let s = 0; for (let k = 0; k <= n; k++) s += u(k); return rnd(s, 6); };
    const cell = (k, v, w = 18) => tb(k, f2(v), w);
    const rows = [0, 1, 2, 3, 4, 5].map(n => [String(n + 2), String(n), n === 2 ? cell('a', u(2)) : n === 5 ? cell('c', u(5)) : f2(u(n)), n === 2 ? cell('b', S(2)) : n === 5 ? cell('d', S(5)) : n === 0 ? f2(S(0)) : (n === 1 || n === 3 || n === 4) ? f2(S(n)) : '']);
    const items = [num('a', u(2), 2, f2(u(2)), [{ v: rnd(u(1) + (u(1) - u(0)), 4), m: 'La suite est géométrique : on multiplie par la raison, on n’ajoute pas l’écart.' }]),
      num('b', S(2), 2, f2(S(2)), [{ v: u(2), m: 'La colonne C cumule : on ajoute le nouveau terme au cumul précédent.' }]),
      num('c', u(5), 2, f2(u(5)), [{ v: rnd(u0 * q * 5, 4), m: 'u₅ = u₀ × q⁵ : la raison est multipliée 5 fois, elle n’est pas multipliée par 5.' }]),
      num('d', S(5), 2, f2(S(5)), [{ v: rnd(S(4), 4), m: 'N’oublie pas d’ajouter le terme de rang 5.' }, { v: u(5), m: 'La somme des 6 premiers termes, ce n’est pas le dernier terme.' }]),
      qcm('e', ['=C3+B4', '=B3+B4', '=C3*B4'], 0, '=C3+B4 : cumul précédent + nouveau terme')];
    xs(items, { a: `B4 = B3 × ${fr(q)} = ${f2(u(1))} × ${fr(q)} = ${f2(u(2))}`, b: `C4 = C3 + B4 = ${f2(S(1))} + ${f2(u(2))} = ${f2(S(2))}`, c: `B7 = ${f2(u(4))} × ${fr(q)} = ${f2(u(5))}`, d: `C7 = C6 + B7 = ${f2(S(4))} + ${f2(u(5))} = ${f2(S(5))}` });
    return { titre: 'Cumuler au tableur', consigne: `Une boutique en ligne expédie ${fr(u0)} colis le mois 0, puis multiplie ce nombre par ${fr(q)} chaque mois. Complète la feuille.`,
      support: table(['', 'A · mois n', 'B · colis uₙ', 'C · cumul'], [['1', 'n', 'uₙ', 'cumul'], ...rows].slice(1)) + `<p class="tr-l">En B3 : <code>=B2*${fr(q)}</code> recopiée vers le bas. En C2 : <code>=B2</code>.</p><p class="tr-l">e. Quelle formule écrire en C4, puis recopier vers le bas ?</p>`, items,
      hints: ['Colonne B : chaque terme est le précédent multiplié par la raison.', 'Colonne C : cumul précédent + nouveau terme de la ligne.', 'Le total des 6 premiers mois est dans la dernière case de la colonne C.'] };
  };
  if (typeof module !== 'undefined') module.exports = {};
  /* ===== exercices ajoutés : notions 3 (sens de variation et nuage) et 5 (évolution à taux fixe et fonction exponentielle) ===== */
  {
    const { Q, fr, rnd, pick, int, table, eur } = H;
    TR.c1e4 = R => {
      const u0 = pick(R, [200, 400, 800, 1000]), q = pick(R, [1.05, 1.1, 1.2, 0.9, 0.85, 0.8]), u = n => u0 * Math.pow(q, n), up = q > 1, ctx = up ? 'abonnés d’une plateforme' : 'valeur d’un téléphone (en €)';
      const N = [0, 1, 2, 3, 4];
      return Q('Sens de variation et nuage de points', `Les termes d’une suite géométrique (uₙ) décrivent la ${up ? 'progression des ' : ''}${ctx}. Voici les premiers termes (arrondis au centième).`, [
        { lab: 'La raison q = u₁ ÷ u₀', v: q, d: 2, w: 14, x: `${fr(u(1))} ÷ ${fr(u0, 0)} = ${fr(q)}`, err: [{ v: rnd(u(1) - u0, 2), m: 'La raison est un quotient : u₁ ÷ u₀.' }] },
        { lab: 'La suite est…', qcm: ['croissante', 'décroissante', 'constante'], ok: up ? 0 : 1, x: up ? `q = ${fr(q)} > 1 et u₀ > 0 : la suite est croissante.` : `0 < q = ${fr(q)} < 1 et u₀ > 0 : la suite est décroissante.` },
        { lab: 'Le terme u₅ = u₄ × q, au centième', v: rnd(u(5), 2), d: 2, w: 16, x: `u₅ = ${fr(u(4))} × ${fr(q)} ≈ ${fr(u(5))}`, err: [{ v: rnd(u(4) + (u(1) - u0), 2), m: 'Pour passer au terme suivant, on multiplie par q, on n’ajoute pas.' }] },
        { lab: 'Le nuage des points (n ; uₙ) est-il aligné ?', qcm: ['oui', 'non'], ok: 1, x: 'Pour une suite géométrique de raison différente de 1, les points (n ; uₙ) ne sont pas alignés : le nuage forme une courbe.' },
        { lab: 'Si q = 1, la suite est…', qcm: ['croissante', 'décroissante', 'constante'], ok: 2, x: 'Si q = 1, chaque terme est égal au précédent multiplié par 1 : la suite est constante.' }],
        ['Raison : q = terme suivant ÷ terme précédent.', 'Pour u₀ > 0 : q > 1 croissante, 0 < q < 1 décroissante, q = 1 constante.', 'Pour passer d’un terme au suivant, on multiplie par q.'],
        table(['n', ...N], [['uₙ', ...N.map(n => fr(u(n)))]]));
    };
    TR.c1e5 = R => {
      const C0 = pick(R, [100, 500, 1000, 2000]), t = pick(R, [2, 3, 4, -2, -5]), q = 1 + t / 100, f = x => C0 * Math.pow(q, x), x1 = pick(R, [5, 8, 10]), x2 = pick(R, [1.5, 2.5, 3.5]), up = t > 0;
      return Q('Évolution à taux fixe', `Une grandeur de ${fr(C0, 0)} ${up ? 'augmente' : 'diminue'} de ${Math.abs(t)} % par an. On modélise par f(x) = ${fr(C0, 0)} × q^x, où x est la durée en années.`, [
        { lab: 'La valeur de q', v: q, d: 2, w: 14, x: `${up ? 'Hausse' : 'Baisse'} de ${Math.abs(t)} % : q = 1 ${up ? '+' : '−'} ${Math.abs(t)} ÷ 100 = ${fr(q)}`, err: [{ v: rnd(t / 100, 2), m: 'q est un coefficient multiplicateur : 1 ' + (up ? '+' : '−') + ' ' + fr(Math.abs(t) / 100) + '.' }] },
        { lab: `f(${x1}), au centième`, v: rnd(f(x1), 2), d: 2, w: 16, x: `${fr(C0, 0)} × ${fr(q)}^${x1} ≈ ${fr(f(x1))}`, err: [{ v: rnd(C0 * q * x1, 2), m: 'x est l’exposant : on calcule q^x avec la touche puissance, on ne multiplie pas par x.' }] },
        { lab: `f(${fr(x2)}), au centième (x n’est pas entier)`, v: rnd(f(x2), 2), d: 2, w: 16, x: `${fr(C0, 0)} × ${fr(q)}^${fr(x2)} ≈ ${fr(f(x2))} : la fonction exponentielle permet un exposant non entier.` },
        { lab: 'La fonction f est…', qcm: ['croissante', 'décroissante'], ok: up ? 0 : 1, x: up ? `q = ${fr(q)} > 1 : f est croissante.` : `0 < q = ${fr(q)} < 1 : f est décroissante.` },
        { lab: 'f(0), valeur de départ', v: C0, d: 2, w: 14, x: `q^0 = 1, donc f(0) = ${fr(C0, 0)} × 1 = ${fr(C0, 0)}` }],
        ['Hausse de t % : q = 1 + t ÷ 100. Baisse : q = 1 − t ÷ 100.', 'f(x) = C₀ × q^x : utilise la touche puissance, y compris pour un exposant non entier.', 'q > 1 : f croissante ; 0 < q < 1 : f décroissante.'],
        table(['Fonction', 'Valeur de départ', 'Évolution'], [['f(x) = C₀ × q^x', fr(C0, 0), `${t > 0 ? '+' : '−'} ${Math.abs(t)} % par an`]]));
    };
  }
  /* ===== rappels de première (pour le « Point de départ » du chapitre 1) : suites arithmétiques et géométriques ===== */
  {
    const { Q, fr, rnd, pick, table } = H;
    /* rt1 : suite arithmétique */
    TR.rt1 = R => {
      const u0 = pick(R, [3, 5, 8, 12, 20, 50]), r = pick(R, [2, 3, 4, 5, 6, 8]), n = pick(R, [12, 15, 18, 20, 25]), V = u0 + n * r;
      return Q('Suite arithmétique : termes et rang', `Une association compte ${u0} adhérents (u₀ = ${u0}) et en gagne ${r} de plus chaque année. uₙ est le nombre d’adhérents après n années.`, [
        { lab: 'u₁ (après 1 an)', v: u0 + r, d: 0, w: 12, x: `u₁ = u₀ + ${r} = ${u0} + ${r} = ${u0 + r}`, err: [{ v: u0 * r, m: 'Une suite arithmétique ajoute la raison à chaque rang ; elle ne la multiplie pas.' }] },
        { lab: 'u₂ (après 2 ans)', v: u0 + 2 * r, d: 0, w: 12, x: `u₂ = u₁ + ${r} = ${u0 + r} + ${r} = ${u0 + 2 * r}` },
        { lab: 'u₁₀ (après 10 ans), avec uₙ = u₀ + n × r', v: u0 + 10 * r, d: 0, w: 12, x: `u₁₀ = ${u0} + 10 × ${r} = ${u0} + ${10 * r} = ${u0 + 10 * r}`, err: [{ v: u0 + r + 10, m: 'La formule est uₙ = u₀ + n × r : on ajoute n fois la raison.' }] },
        { lab: `Au bout de combien d’années y a-t-il ${V} adhérents ?`, v: n, d: 0, w: 12, x: `${V} = ${u0} + n × ${r}, donc n × ${r} = ${V - u0} et n = ${V - u0} ÷ ${r} = ${n}`, err: [{ v: V - u0, m: 'Tu as calculé le total gagné. Divise-le par ' + r + ' pour obtenir le nombre d’années.' }] }],
      ['Suite arithmétique : on passe d’un terme au suivant en ajoutant toujours la même raison r.', 'Terme de rang n : uₙ = u₀ + n × r.', 'Pour trouver n : (valeur − u₀) ÷ r.'],
      table(['Rang n', '0', '1', '2', '…', '10'], [['Adhérents uₙ', String(u0), '?', '?', '…', '?']]));
    };
    /* rt2 : suite géométrique */
    TR.rt2 = R => {
      const u0 = pick(R, [32, 64, 96, 160, 320]), q = pick(R, [2, 3, 1.5]), u = k => rnd(u0 * Math.pow(q, k), 2);
      return Q('Suite géométrique : multiplier à chaque rang', `Un site compte ${u0} visiteurs (u₀ = ${u0}). Chaque semaine, ce nombre est multiplié par ${fr(q)}. uₙ : visiteurs à la semaine n.`, [
        { lab: 'u₁', v: u(1), d: 0, w: 12, x: `u₁ = u₀ × ${fr(q)} = ${u0} × ${fr(q)} = ${fr(u(1))}`, err: [{ v: rnd(u0 + q, 2), m: 'Une suite géométrique multiplie par la raison ; elle ne l’ajoute pas.' }] },
        { lab: 'u₂', v: u(2), d: 0, w: 12, x: `u₂ = u₁ × ${fr(q)} = ${fr(u(1))} × ${fr(q)} = ${fr(u(2))}` },
        { lab: 'u₃', v: u(3), d: 0, w: 12, x: `u₃ = u₂ × ${fr(q)} = ${fr(u(2))} × ${fr(q)} = ${fr(u(3))}` },
        { lab: 'u₄, avec uₙ = u₀ × qⁿ', v: u(4), d: 0, w: 12, x: `u₄ = ${u0} × ${fr(q)}⁴ = ${u0} × ${fr(rnd(Math.pow(q, 4), 4))} = ${fr(u(4))}`, err: [{ v: rnd(u0 * q * 4, 2), m: 'qⁿ veut dire q × q × … (n fois), pas n × q.' }] },
        { lab: 'Cette suite est…', qcm: ['arithmétique', 'géométrique'], ok: 1, x: 'On multiplie chaque terme par le même nombre : la suite est géométrique, de raison ' + fr(q) + '.' }],
      ['Suite géométrique : on passe d’un terme au suivant en multipliant toujours par la même raison q.', 'Terme de rang n : uₙ = u₀ × qⁿ.', 'qⁿ : on multiplie q par lui-même n fois.'],
      table(['Semaine n', '0', '1', '2', '3', '4'], [['Visiteurs uₙ', String(u0), '?', '?', '?', '?']]));
    };
    /* rt3 : reconnaître le type d’une suite */
    TR.rt3 = R => {
      const a0 = pick(R, [3, 5, 10, 20]), r = pick(R, [2, 3, 4, 5, 6]), b0 = pick(R, [2, 3, 4, 5]), q = pick(R, [2, 3]), c0 = pick(R, [1, 2, 3, 4]);
      const seqs = [{ t: 0, v: [a0, a0 + r, a0 + 2 * r, a0 + 3 * r] }, { t: 1, v: [b0, b0 * q, b0 * q * q, b0 * q * q * q] }, { t: 2, v: [c0, c0 + 1, c0 + 3, c0 + 6] }];
      const perm = pick(R, [[0, 1, 2], [1, 2, 0], [2, 0, 1], [0, 2, 1], [2, 1, 0], [1, 0, 2]]), L3 = ['A', 'B', 'C'], S = perm.map(i => seqs[i]);
      const nom = ['arithmétique', 'géométrique', 'ni l’une ni l’autre'], ex = ['on ajoute toujours ' + r, 'on multiplie toujours par ' + q, 'les écarts changent (+1, +2, +3) et les rapports aussi'];
      const rows = S.map((s, i) => ({ lab: `Suite ${L3[i]} : ${s.v.join(' ; ')} ; …`, qcm: ['arithmétique', 'géométrique', 'ni l’une, ni l’autre'], ok: s.t, x: `${nom[s.t]} : ${ex[s.t]}` }));
      const ia = S.findIndex(s => s.t === 0), ig = S.findIndex(s => s.t === 1);
      rows.push({ lab: `Raison de la suite arithmétique (suite ${L3[ia]})`, v: r, d: 0, w: 12, x: `${a0 + r} − ${a0} = ${r}`, err: [{ v: q, m: 'Cette valeur est la raison de l’autre suite.' }] });
      rows.push({ lab: `Raison de la suite géométrique (suite ${L3[ig]})`, v: q, d: 0, w: 12, x: `${b0 * q} ÷ ${b0} = ${q}`, err: [{ v: r, m: 'Cette valeur est la raison de l’autre suite.' }] });
      return Q('Reconnaître une suite arithmétique ou géométrique', 'Pour chaque suite, regarde comment on passe d’un terme au suivant : en ajoutant, en multipliant, ou ni l’un ni l’autre.', rows,
        ['Arithmétique : l’écart entre deux termes qui se suivent est toujours le même (raison = écart).', 'Géométrique : le rapport entre deux termes qui se suivent est toujours le même (raison = rapport).', 'Si ni l’écart ni le rapport ne reste constant, la suite n’est ni l’une ni l’autre.']);
    };
  }
})(typeof module !== 'undefined' ? module.exports : window);
