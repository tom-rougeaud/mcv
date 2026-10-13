/* Maths et MCV · 2de — version 3 : documents « Point de départ » et exercices « Je m’entraîne » à support visuel.
   Communs au manuel (tirage fixe) et à l’appli (nouveau tirage à chaque essai).
   Un exercice = { titre, consigne, support (HTML ou SVG avec des cases lettrées), items:[{k, a, v, tol, err:[{v, m}], qcm?}], hints:[…] }.
   Un point de départ = { doc (HTML), qs:[{t, a, v, tol, kind:'num'|'qcm'|'tap', choices, ok, cell}] }.
   Toutes les réponses sont calculées, jamais écrites à la main. */
(function (root) {
  'use strict';
  const MC = typeof module !== 'undefined' ? require('./gens.js').MCVG : root.MCVG;
  const { fr, rnd, rng } = MC;
  const NB = ' ';
  const eur = (x, d = 2) => fr(x, d) + NB + '€', pct = x => fr(x) + NB + '%';
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const TOL = d => 0.5 * Math.pow(10, -d) + 1e-9;
  const L = 'abcdefghijklmnop';
  /* case à compléter dans un texte ou un tableau */
  const tb = (k, a, w = 16) => `<span class="tb" data-k="${k}" data-a="${esc(a)}" style="min-width:${w}mm"><i>${k}</i></span>`;
  /* case à compléter dans un dessin */
  const sb = (x, y, w, k, a, h = 26) => `<g class="sb"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" class="sbr"/><text x="${x + 5}" y="${y + 11}" font-size="10" class="sbk">${k}</text><text x="${x + w / 2 + 4}" y="${y + h / 2 + 6}" font-size="15" text-anchor="middle" class="pa">${esc(a)}</text></g>`;
  const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 14}" text-anchor="${o.a || 'middle'}" font-weight="${o.w || 700}" class="${o.c || 'tx'}"${o.r ? ` transform="rotate(${o.r} ${x} ${y})"` : ''}>${s}</text>`;
  const svg = (w, h, body, lab = '') => `<svg viewBox="0 0 ${w} ${h}" class="pic vis trs" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(lab)}">${body}</svg>`;
  const table = (head, rows, cls = '') => `<table class="dt tcx dt-sm ${cls}"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, j) => j === 0 ? `<th>${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const num = (k, v, d, a, err = []) => ({ k, v, tol: TOL(d), a, err: err.filter(e => Number.isFinite(e.v) && Math.abs(e.v - v) > TOL(d)) });
  const qcm = (k, choices, ok, a) => ({ k, qcm: { choices, ok }, a: a || choices[ok], v: null });
  const pick = (R, arr) => arr[Math.floor(R() * arr.length)];

  const DEP = {}, TR = {};

  /* ======================= 1 · Prix, marges et TVA ======================= */
  DEP.c1 = R => {
    const A = { n: 'Sac à dos', p: pick(R, [20, 40, 80, 120]), r: 25 }, B = { n: 'Veste polaire', p: pick(R, [30, 50, 70, 90]), r: 50 }, C = { n: 'Gourde', p: pick(R, [9.9, 19.9, 29.9]), r: 10 };
    const et = (o, i) => `<div class="et3" data-cell="${i}"><span class="et3-r">− ${o.r} %</span><b>${o.n}</b><span class="et3-p">${eur(o.p)}</span><small>prix avant remise</small></div>`;
    const sC = rnd(C.p * .9), seuil = { 9.9: 8, 19.9: 19, 29.9: 25 }[C.p];
    return { titre: 'Les étiquettes du rayon soldes', doc: `<div class="et3s">${[A, B, C].map(et).join('')}</div><p class="srcl">Rayon randonnée, premier jour des soldes (magasin fictif).</p>`,
      qs: [{ t: `Quel est le prix du ${A.n.toLowerCase()} avant la remise ?`, kind: 'num', v: A.p, tol: .006, a: eur(A.p, 0) },
        { t: 'Quel article a la plus forte remise ?', kind: 'qcm', choices: [A.n, B.n, C.n], ok: 1, a: `${B.n} (− 50 %)` },
        { t: `Combien coûte la ${B.n.toLowerCase()} soldée ?`, kind: 'num', v: B.p / 2, tol: .006, a: eur(B.p / 2, 0) + ' (la moitié)' },
        { t: `La ${C.n.toLowerCase()} soldée coûte-t-elle plus ou moins de ${eur(seuil)} ?`, kind: 'qcm', choices: ['plus', 'moins'], ok: sC > seuil ? 0 : 1, a: `${sC > seuil ? 'plus' : 'moins'} : environ ${eur(sC)}` },
        { t: `Rappel : combien font 10 % de ${fr(A.p)} € ?`, kind: 'num', v: A.p / 10, tol: .006, a: eur(A.p / 10, 0) },
        { t: 'Vrai ou faux : « Avec − 50 %, on paie la moitié du prix. »', kind: 'qcm', choices: ['vrai', 'faux'], ok: 0, a: 'vrai' }] };
  };
  TR.c1e1 = R => {
    const P = pick(R, [40, 60, 80, 120, 200, 240]), ts = [10, 25, 50, 75, 15];
    const W = 600, x0 = 40, x1 = 560, X = t => x0 + (x1 - x0) * t / 100;
    let s = `<rect x="${x0}" y="40" width="${x1 - x0}" height="34" rx="6" class="k2 ks" stroke-width="2"/>`;
    [0, 10, 25, 50, 75, 100].forEach(t => { s += `<line x1="${X(t)}" x2="${X(t)}" y1="34" y2="80" class="ks" stroke-width="2"/>` + T(X(t), 28, t + ' %', { fs: 13, c: 'kt' }); });
    s += T(X(0), 104, '0 €', { fs: 14 }) + T(X(100), 104, eur(P, 0), { fs: 15 });
    const xs = [X(10) - 31, X(25) - 26, X(50) - 30, X(75) - 30];
    ts.slice(0, 4).forEach((t, i) => { s += sb(xs[i], 88, 62, L[i], eur(P * t / 100)); });
    return { titre: 'La barre des 100 %', consigne: `Le prix complet est ${eur(P, 0)}. Complète la valeur en euros sous chaque pourcentage (a à d), puis trouve 15 % (e).`, support: svg(W, 124, s, 'Barre des 100 %') + `<p class="tr-l">e. 15 % = 10 % + 5 % = ${tb('e', eur(P * .15), 18)}</p>`,
      items: ts.map((t, i) => num(L[i], rnd(P * t / 100), 2, eur(P * t / 100), [{ v: rnd(P / t), m: `${t} % de ${fr(P)}, ce n’est pas ${fr(P)} ÷ ${t}. Calcule ${fr(P)} × ${fr(t / 100)}.` }, { v: t, m: 'Tu as recopié le pourcentage : on veut une somme en euros.' }])),
      hints: ['10 %, c’est le dixième : divise par 10.', '25 %, c’est le quart ; 50 %, la moitié ; 75 %, trois quarts.', '15 % = 10 % + 5 %, et 5 %, c’est la moitié de 10 %.'] };
  };
  TR.c1e2 = R => {
    const rows = Array.from({ length: 3 }, (_, i) => { const p = pick(R, [20, 40, 50, 60, 80, 120, 150]), t = pick(R, i === 1 ? [10, 20, 30, 50] : [5, 10, 20, 25]) * (i === 1 ? -1 : 1) * (i === 2 ? -1 : 1); return { p, t, cm: rnd(1 + t / 100, 4), n: rnd(p * (1 + t / 100)) }; });
    let s = ''; const items = [];
    rows.forEach((r, i) => { const y = 14 + i * 66;
      s += `<rect x="20" y="${y}" width="110" height="40" rx="8" class="k2 ks" stroke-width="2"/>` + T(75, y + 26, eur(r.p, 0), { fs: 16 });
      s += `<path d="M140 ${y + 20}H420" class="ks" stroke-width="3" fill="none"/><path d="M412 ${y + 12}L424 ${y + 20}L412 ${y + 28}Z" class="k"/>` + T(200, y + 12, (r.t > 0 ? '+ ' : '− ') + Math.abs(r.t) + ' %', { fs: 14, c: 'kt' });
      s += T(268, y + 12, '× CM =', { fs: 13 }) + sb(300, y - 6, 74, L[2 * i], fr(r.cm));
      s += sb(434, y + 6, 120, L[2 * i + 1], eur(r.n));
      items.push(num(L[2 * i], r.cm, 4, fr(r.cm), [{ v: rnd(1 - r.t / 100, 4), m: r.t < 0 ? 'Une baisse donne un coefficient plus petit que 1 : 1 − taux.' : 'Une hausse donne un coefficient plus grand que 1 : 1 + taux.' }, { v: rnd(r.t / 100, 4), m: 'Le coefficient, c’est 1 + taux (ou 1 − taux), pas le taux seul.' }]),
        num(L[2 * i + 1], r.n, 2, eur(r.n), [{ v: rnd(r.p * Math.abs(r.t) / 100), m: 'Tu as calculé seulement la variation. Multiplie le prix de départ par le coefficient.' }]));
    });
    return { titre: 'La flèche « × CM »', consigne: 'Pour chaque flèche, écris le coefficient multiplicateur, puis le prix d’arrivée.', support: svg(600, 210, s, 'Flèches du coefficient multiplicateur'), items,
      hints: ['Hausse de t % : coefficient 1 + t ÷ 100. Baisse : 1 − t ÷ 100.', '− 20 % : il reste 80 %, donc × 0,8.', 'Prix d’arrivée = prix de départ × coefficient.'] };
  };
  TR.c1e3 = R => {
    const rows = [[pick(R, [50, 80, 120, 250]), 20, 'ht'], [pick(R, [12, 40, 60, 200]), 5.5, 'ht'], [pick(R, [36, 60, 96, 180]), 20, 'ttc'], [pick(R, [22, 55, 110, 330]), 10, 'ttc']];
    const items = []; const body = rows.map((r, i) => { const k = L[i];
      if (r[2] === 'ht') { const v = rnd(r[0] * (1 + r[1] / 100)); items.push(num(k, v, 2, eur(v), [{ v: rnd(r[0] * r[1] / 100), m: 'Ça, c’est la TVA seule. Le prix TTC = HT + TVA.' }])); return [`${i + 1}`, eur(r[0]), fr(r[1]) + ' %', tb(k, eur(v), 20)]; }
      const v = rnd(r[0] / (1 + r[1] / 100)); items.push(num(k, v, 2, eur(v), [{ v: rnd(r[0] * (1 - r[1] / 100)), m: `Pour retrouver le HT, divise par ${fr(1 + r[1] / 100)} : on ne retire pas ${fr(r[1])} % du TTC.` }]));
      return [`${i + 1}`, tb(k, eur(v), 20), fr(r[1]) + ' %', eur(r[0])]; });
    const pile = svg(600, 96, `<rect x="40" y="18" width="380" height="44" rx="6" class="k2 ks" stroke-width="2"/>${T(230, 46, 'prix HT (100 %)', { fs: 15 })}<rect x="420" y="18" width="80" height="44" rx="6" class="k"/>${T(460, 46, 'TVA', { fs: 15, c: 'tw' })}<path d="M40 74V82H500V74" class="ks" stroke-width="2" fill="none"/>${T(270, 94, 'prix TTC = HT × (1 + taux)', { fs: 14, c: 'kt' })}`, 'HT plus TVA égale TTC');
    return { titre: 'HT, TVA, TTC', consigne: 'Complète le tableau. Aide-toi de la pile : le TTC, c’est le HT plus la TVA.', support: pile + table(['Ligne', 'Prix HT', 'TVA', 'Prix TTC'], body), items,
      hints: ['Du HT au TTC : multiplie par 1 + taux (1,2 pour 20 %).', 'Du TTC au HT : divise par 1 + taux.', 'Vérifie : le TTC est toujours plus grand que le HT.'] };
  };

  /* ======================= 2 · Statistique ======================= */
  DEP.c2 = R => {
    let v; do { v = [pick(R, [4, 6, 8]), pick(R, [8, 10, 12]), pick(R, [12, 14, 16]), pick(R, [6, 8, 10])]; } while (v.reduce((a, b) => a + b) % 4 || new Set(v).size < 4);
    const h = ['9 h', '10 h', '11 h', '12 h'], N = v.reduce((a, b) => a + b), mx = v.indexOf(Math.max(...v));
    const W = 600, H = 220, X = i => 90 + i * 120, Y = c => 180 - c * 8;
    let s = `<line x1="60" x2="580" y1="180" y2="180" stroke="#1D2240" stroke-width="2"/><line x1="60" x2="60" y1="40" y2="180" stroke="#1D2240" stroke-width="2"/>`;
    for (let c = 0; c <= 16; c += 4) s += `<line x1="60" x2="580" y1="${Y(c)}" y2="${Y(c)}" stroke="#DCE2F2"/>` + T(50, Y(c) + 5, c, { fs: 12, a: 'end', c: 'ts' });
    v.forEach((c, i) => { s += `<rect x="${X(i)}" y="${Y(c)}" width="70" height="${c * 8}" rx="4" class="k" data-cell="${i}"/>` + T(X(i) + 35, 198, h[i] + '–' + (parseInt(h[i]) + 1) + ' h', { fs: 13 }); });
    s += T(320, 22, 'Clients à l’accueil, samedi matin', { fs: 15 }) + T(20, 110, 'clients', { fs: 12, c: 'ts', r: -90 });
    const big = Math.max(...v), small = Math.min(...v), dbl = big === 2 * small;
    return { titre: 'Le samedi matin à l’accueil', doc: `<div class="wfig">${svg(W, H, s, 'Diagramme en barres des clients par heure')}</div>`,
      qs: [{ t: 'Combien de clients sont venus entre 10 h et 11 h ?', kind: 'num', v: v[1], tol: .5, a: String(v[1]) },
        { t: 'À quelle heure y a-t-il eu le plus de clients ?', kind: 'qcm', choices: h.map((x, i) => x + '–' + (parseInt(x) + 1) + ' h'), ok: mx, a: h[mx] + '–' + (parseInt(h[mx]) + 1) + ' h' },
        { t: 'Combien de clients en tout sur la matinée ?', kind: 'num', v: N, tol: .5, a: String(N) },
        { t: `En moyenne, plus ou moins de 10 clients par heure ?`, kind: 'qcm', choices: ['plus', 'moins', 'exactement 10'], ok: N / 4 > 10 ? 0 : N / 4 < 10 ? 1 : 2, a: `${fr(N / 4)} clients par heure` },
        { t: 'Rappel : combien font 50 % de 16 ?', kind: 'num', v: 8, tol: .01, a: '8' },
        { t: `Vrai ou faux : « Il est venu deux fois plus de clients à l’heure la plus chargée qu’à la plus calme. »`, kind: 'qcm', choices: ['vrai', 'faux'], ok: dbl ? 0 : 1, a: `${dbl ? 'vrai' : 'faux'} : ${big} et ${small}` }] };
  };
  TR.c2e1 = R => {
    let N, c; do { N = pick(R, [20, 40, 50, 80, 100, 200]); const a = rnd(N * pick(R, [.45, .5, .55, .4])), b = rnd(N * pick(R, [.25, .2, .3])), d = rnd(N * pick(R, [.05, .1])); c = [a, b, N - a - b - d, d]; } while (c.some(x => x <= 0 || !Number.isInteger(x * 100 / N)));
    const modes = ['Carte (code)', 'Sans contact', 'Espèces', 'Téléphone'], items = c.map((x, i) => num(L[i], x / N * 100, 1, pct(x / N * 100), [{ v: x, m: 'C’est l’effectif. La fréquence = effectif ÷ effectif total, puis × 100.' }, { v: rnd(N / x, 2), m: 'Divise l’effectif par le total, pas l’inverse.' }]));
    return { titre: 'Effectifs et fréquences', consigne: `Sur ${N} tickets, complète la fréquence de chaque moyen de paiement (en %).`, support: table(['Moyen de paiement', 'Nombre de tickets', 'Fréquence'], modes.map((m, i) => [m, String(c[i]), tb(L[i], pct(c[i] / N * 100), 16)]).concat([['Total', String(N), '100 %']])), items,
      hints: ['Fréquence = effectif ÷ effectif total.', `Ici l’effectif total est ${N}.`, 'Vérifie : la somme des fréquences fait 100 %.'] };
  };
  TR.c2e2 = R => {
    const n = pick(R, [9, 11]), v = Array.from({ length: n }, () => 5 + Math.floor(R() * 40)), s2 = v.slice().sort((a, b) => a - b);
    const me = s2[(n - 1) / 2], q1 = s2[Math.ceil(n / 4) - 1], q3 = s2[Math.ceil(3 * n / 4) - 1];
    const bw = 46, x0 = (600 - n * (bw + 6)) / 2; let s = T(300, 18, 'Les montants des paniers (€), dans l’ordre d’arrivée', { fs: 13, c: 'ts' });
    v.forEach((x, i) => { s += `<rect x="${x0 + i * (bw + 6)}" y="28" width="${bw}" height="34" rx="6" class="k2 ks" stroke-width="1.6"/>` + T(x0 + i * (bw + 6) + bw / 2, 51, x, { fs: 15 }); });
    s += T(300, 90, 'Range-les ici, du plus petit au plus grand', { fs: 13, c: 'ts' });
    v.forEach((x, i) => { s += `<rect x="${x0 + i * (bw + 6)}" y="100" width="${bw}" height="34" rx="6" fill="#fff" class="ks" stroke-width="1.6" stroke-dasharray="4 3"/><text x="${x0 + i * (bw + 6) + bw / 2}" y="123" font-size="15" text-anchor="middle" class="pa">${s2[i]}</text>`; });
    const items = [num('a', s2[0], 0, String(s2[0])), num('b', s2[n - 1], 0, String(s2[n - 1])), num('c', me, 0, String(me), [{ v: v[(n - 1) / 2], m: 'Tu as pris la valeur du milieu de la liste non rangée. Range d’abord la série !' }]), num('d', q1, 0, String(q1)), num('e', q3, 0, String(q3))];
    return { titre: 'La file rangée', consigne: `Range les ${n} valeurs, puis donne le minimum (a), le maximum (b), la médiane (c), Q₁ (d) et Q₃ (e).`, support: svg(600, 146, s, 'Valeurs à ranger') + `<p class="tr-l">a. min ${tb('a', items[0].a, 12)} b. max ${tb('b', items[1].a, 12)} c. médiane ${tb('c', items[2].a, 12)} d. Q₁ ${tb('d', items[3].a, 12)} e. Q₃ ${tb('e', items[4].a, 12)}</p>`, items,
      hints: ['Range les valeurs : barre-les au fur et à mesure.', `${n} valeurs : la médiane est la ${(n + 1) / 2}e.`, `Q₁ : rang ${n} ÷ 4 arrondi au-dessus, soit le ${Math.ceil(n / 4)}e ; Q₃ : le ${Math.ceil(3 * n / 4)}e.`] };
  };
  TR.c2e3 = R => {
    let e; do { e = [1, 2, 3, 4].map(() => 2 + Math.floor(R() * 12)); } while (e.reduce((a, b) => a + b) % 5);
    const N = e.reduce((a, b) => a + b), S = e.reduce((a, x, i) => a + x * (i + 1), 0), m = rnd(S / N, 2);
    const items = [num('a', N, 0, String(N), [{ v: 4, m: 'Le total, c’est la somme des effectifs (le nombre de tickets).' }]), num('b', S, 0, String(S), [{ v: N, m: 'Multiplie chaque nombre d’articles par son effectif avant d’additionner.' }]), num('c', m, 2, fr(m), [{ v: 2.5, m: 'Tu as fait la moyenne de 1, 2, 3, 4 sans tenir compte des effectifs.' }])];
    return { titre: 'La moyenne avec des effectifs', consigne: 'Nombre d’articles par ticket : complète le total des tickets (a), le total des articles (b) puis la moyenne au centième (c).',
      support: table(['Articles par ticket', '1', '2', '3', '4', 'Total'], [['Nombre de tickets', ...e.map(String), tb('a', String(N), 12)], ['Articles × tickets', ...e.map((x, i) => String(x * (i + 1))), tb('b', String(S), 12)]]) + `<p class="tr-l">c. Moyenne = b ÷ a = ${tb('c', fr(m), 16)} article(s) par ticket (au centième)</p>`, items,
      hints: ['a : additionne les nombres de tickets.', 'b : additionne la dernière ligne (articles × tickets).', 'c : moyenne = b ÷ a.'] };
  };

  /* ======================= 3 · Premier degré ======================= */
  DEP.c3 = R => {
    const p = pick(R, [6, 8, 9, 12]), st = p * pick(R, [10, 15, 20]), n = st / p, test = n - pick(R, [2, 3, 4]);
    return { titre: 'Le stand du marché de Noël', doc: `<div class="aff3"><div class="aff3-h">🎄 Marché de Noël · location du stand</div><p><b>${eur(st, 0)}</b> la journée</p><div class="aff3-p"><span>Pot de miel</span><b>${eur(p, 0)}</b></div></div>`,
      qs: [{ t: 'Combien coûte un pot de miel ?', kind: 'num', v: p, tol: .006, a: eur(p, 0) },
        { t: 'Combien rapportent 5 pots vendus ?', kind: 'num', v: 5 * p, tol: .006, a: eur(5 * p, 0) },
        { t: `Combien de pots faut-il vendre pour rapporter ${eur(st, 0)} ?`, kind: 'num', v: n, tol: .5, a: String(n) },
        { t: `Avec ${test} pots vendus, la location du stand est-elle payée ?`, kind: 'qcm', choices: ['oui', 'non'], ok: 1, a: `non : ${test} × ${p} = ${test * p} €` },
        { t: `Rappel : quel nombre multiplié par ${p} donne ${3 * p} ?`, kind: 'num', v: 3, tol: .01, a: '3' },
        { t: 'Vrai ou faux : « Si je vends deux fois plus de pots, la recette double. »', kind: 'qcm', choices: ['vrai', 'faux'], ok: 0, a: 'vrai' }] };
  };
  TR.c3e1 = R => {
    const eqs = Array.from({ length: 4 }, () => { const a = 2 + Math.floor(R() * 6), x = 1 + Math.floor(R() * 12), b = 1 + Math.floor(R() * 20); return { a, b, x, c: a * x + b }; });
    let s = ''; eqs.forEach((e, i) => { const cx = 150 + (i % 2) * 300, cy = 20 + Math.floor(i / 2) * 110;
      s += `<path d="M${cx - 95} ${cy + 46}H${cx + 95}" class="ks" stroke-width="3"/><path d="M${cx} ${cy + 46}V${cy + 90}M${cx - 30} ${cy + 90}H${cx + 30}" class="ks" stroke-width="3"/>`;
      s += `<rect x="${cx - 120}" y="${cy + 8}" width="110" height="36" rx="8" class="k2 ks" stroke-width="2"/>` + T(cx - 65, cy + 32, `${e.a}x + ${e.b}`, { fs: 17 });
      s += `<rect x="${cx + 10}" y="${cy + 8}" width="110" height="36" rx="8" class="k2 ks" stroke-width="2"/>` + T(cx + 65, cy + 32, `${e.c}`, { fs: 17 }) + T(cx - 128, cy + 2, L[i] + '.', { fs: 14, a: 'start', c: 'kt' }); });
    return { titre: 'La balance', consigne: 'Chaque balance est en équilibre. Trouve la valeur de x.', support: svg(600, 225, s, 'Quatre balances') + `<p class="tr-l">${eqs.map((e, i) => `${L[i]}. x = ${tb(L[i], fr(e.x), 12)}`).join(' ')}</p>`,
      items: eqs.map((e, i) => num(L[i], e.x, 2, fr(e.x), [{ v: rnd((e.c + e.b) / e.a, 2), m: `Pour enlever « + ${e.b} », il faut soustraire ${e.b} des deux côtés, pas ajouter.` }, { v: rnd(e.c / e.a - e.b, 2), m: 'Commence par enlever le nombre seul, puis divise.' }])),
      hints: ['Enlève d’abord le nombre seul des deux côtés.', 'Il reste « a × x = … » : divise les deux côtés par a.', 'Vérifie en remplaçant x dans l’équation.'] };
  };
  TR.c3e2 = R => {
    const S = [{ w: 'cartes cadeaux', u: '€' }, { w: 'coffrets', u: '€' }, { w: 'places de parking', u: '€' }];
    const pb = S.map(o => { const n = 2 + Math.floor(R() * 3), x = pick(R, [4, 5, 6, 8, 12, 15]), f = pick(R, [3, 5, 6, 9, 10]); return { ...o, n, x, f, t: n * x + f }; });
    let s = ''; const items = [];
    pb.forEach((p, i) => { const y = 14 + i * 64, bw = 70; s += T(14, y + 26, L[i] + '.', { fs: 14, a: 'start', c: 'kt' });
      for (let j = 0; j < p.n; j++) s += `<rect x="${40 + j * bw}" y="${y + 6}" width="${bw}" height="30" class="k2 ks" stroke-width="2"/>` + T(40 + j * bw + bw / 2, y + 27, 'x', { fs: 16, c: 'kt' });
      s += `<rect x="${40 + p.n * bw}" y="${y + 6}" width="${40 + p.f * 3}" height="30" class="k" />` + T(40 + p.n * bw + 20 + p.f * 1.5, y + 27, p.f + ' €', { fs: 14, c: 'tw' });
      s += `<path d="M40 ${y + 44}V${y + 50}H${80 + p.n * bw + p.f * 3}V${y + 44}" class="ks" stroke-width="1.6" fill="none"/>` + T(60 + p.n * bw / 2 + p.f * 1.5, y + 62, 'total : ' + p.t + ' €', { fs: 13 });
      items.push(num(L[i], p.x, 2, fr(p.x) + ' €', [{ v: rnd(p.t / p.n, 2), m: `Retire d’abord les ${p.f} € qui ne sont pas des x, puis divise.` }])); });
    return { titre: 'Le schéma en barres', consigne: 'Chaque case « x » a le même prix. Trouve x pour chaque schéma.', support: svg(600, 206, s, 'Schémas en barres') + `<p class="tr-l">${pb.map((p, i) => `${L[i]}. ${p.n}x + ${p.f} = ${p.t} → x = ${tb(L[i], fr(p.x) + ' €', 14)}`).join('<br>')}</p>`, items,
      hints: ['Le bloc foncé n’est pas un x : enlève-le du total.', 'Le reste se partage en parts égales.', 'Vérifie : n × x + bloc = total.'] };
  };
  TR.c3e3 = R => {
    const ivs = Array.from({ length: 4 }, (_, i) => { const a = -4 + Math.floor(R() * 5), b = a + 2 + Math.floor(R() * 5), lo = R() < .5, hi = R() < .5; return { a, b, lo, hi }; });
    const w = iv => `${iv.lo ? '[' : ']'}${fr(iv.a)} ; ${fr(iv.b)}${iv.hi ? ']' : '['}`;
    let s = ''; ivs.forEach((iv, i) => { const y = 24 + i * 52, X = v => 60 + (v + 5) * 40;
      s += T(18, y + 6, L[i] + '.', { fs: 14, a: 'start', c: 'kt' }) + `<line x1="50" x2="560" y1="${y}" y2="${y}" stroke="#1D2240" stroke-width="1.6"/>`;
      for (let v = -5; v <= 7; v++) s += `<line x1="${X(v)}" x2="${X(v)}" y1="${y - 4}" y2="${y + 4}" stroke="#1D2240"/>` + T(X(v), y + 20, v, { fs: 11, c: 'ts', w: 400 });
      s += `<line x1="${X(iv.a)}" x2="${X(iv.b)}" y1="${y}" y2="${y}" class="ks" stroke-width="6"/>`;
      const br = (x, open, left) => { const d = (left ? 1 : -1) * (open ? -1 : 1); return `<path d="M${x + d * 7} ${y - 11}H${x}V${y + 11}H${x + d * 7}" class="ks" stroke-width="3" fill="none"/>`; };
      s += br(X(iv.a), !iv.lo, true) + br(X(iv.b), !iv.hi, false); });
    const items = ivs.map((iv, i) => { const good = w(iv), alt = [w({ ...iv, lo: !iv.lo }), w({ ...iv, hi: !iv.hi }), w({ ...iv, lo: !iv.lo, hi: !iv.hi })]; const ch = [good, ...alt.slice(0, 2)].sort(() => R() - .5); return qcm(L[i], ch, ch.indexOf(good), good); });
    return { titre: 'Sur la droite graduée', consigne: 'Coche l’intervalle dessiné sur chaque droite. Crochet tourné vers le trait : le nombre est compris.', support: svg(600, 220, s, 'Intervalles sur des droites graduées'), items,
      hints: ['Regarde d’abord les deux bornes : le plus petit nombre à gauche.', 'Crochet tourné vers le trait coloré : la borne est comprise.', 'Crochet tourné vers l’extérieur : la borne n’est pas comprise.'] };
  };

  /* ======================= 4 · Factures, réductions, intérêts ======================= */
  DEP.c4 = R => {
    const q1 = pick(R, [10, 20, 50]), p1 = pick(R, [2, 3, 4]), q2 = pick(R, [5, 10]), p2 = pick(R, [6, 8, 10]), b = q1 * p1 + q2 * p2;
    return { titre: 'Le bon de commande', doc: table(['Article', 'Quantité', 'Prix unitaire HT', 'Montant HT'], [['Stylos', String(q1), eur(p1), '…'], ['Classeurs', String(q2), eur(p2), '…'], ['Remise', '', '', '10 %']]) + '<p class="srcl">Commande d’une agence immobilière à un grossiste (entreprises fictives).</p>',
      qs: [{ t: 'Combien de stylos sont commandés ?', kind: 'num', v: q1, tol: .5, a: String(q1) },
        { t: 'Calcule le montant HT des stylos.', kind: 'num', v: q1 * p1, tol: .006, a: eur(q1 * p1, 0) },
        { t: 'Calcule le montant brut HT de la commande.', kind: 'num', v: b, tol: .006, a: eur(b, 0) },
        { t: 'Combien vaut la remise de 10 % ?', kind: 'num', v: b / 10, tol: .006, a: eur(b / 10) },
        { t: 'Rappel : combien font 20 % de 50 € ?', kind: 'num', v: 10, tol: .006, a: '10 €' },
        { t: 'Vrai ou faux : « La TVA se calcule après la remise. »', kind: 'qcm', choices: ['vrai', 'faux'], ok: 0, a: 'vrai : on applique la TVA au net' }] };
  };
  TR.c4e1 = R => {
    const st = [0, 1].map(() => { const p = pick(R, [200, 400, 500, 800, 1000]), r1 = pick(R, [10, 20]), r2 = pick(R, [5, 10]); const n1 = rnd(p * (1 - r1 / 100)), n2 = rnd(n1 * (1 - r2 / 100)); return { p, r1, r2, n1, n2 }; });
    let s = ''; const items = [];
    st.forEach((o, i) => { const x0 = 20 + i * 300;
      s += `<path d="M${x0} 40H${x0 + 90}V90H${x0 + 180}V140H${x0 + 270}" class="ks" stroke-width="3" fill="none"/>`;
      s += T(x0 + 45, 30, eur(o.p, 0), { fs: 16 }) + T(x0 + 100, 70, '− ' + o.r1 + ' %', { fs: 13, c: 'kt', a: 'start' }) + sb(x0 + 92, 96, 86, L[2 * i], eur(o.n1)) + T(x0 + 190, 120, '− ' + o.r2 + ' %', { fs: 13, c: 'kt', a: 'start' }) + sb(x0 + 182, 146, 86, L[2 * i + 1], eur(o.n2));
      items.push(num(L[2 * i], o.n1, 2, eur(o.n1)), num(L[2 * i + 1], o.n2, 2, eur(o.n2), [{ v: rnd(o.p * (1 - (o.r1 + o.r2) / 100)), m: `Les remises ne s’additionnent pas : la 2e remise s’applique à ${eur(o.n1)}, pas au prix de départ.` }])); });
    return { titre: 'L’escalier des remises', consigne: 'Chaque marche est une remise. Calcule le net après chaque marche.', support: svg(600, 186, s, 'Escaliers des remises'), items,
      hints: ['Une remise de 10 % : × 0,9.', 'La 2e remise part du net obtenu à la 1re marche.', 'Vérifie : chaque marche fait baisser le prix.'] };
  };
  TR.c4e2 = R => {
    const q1 = pick(R, [10, 20, 25]), p1 = pick(R, [3.2, 4.8, 6]), q2 = pick(R, [5, 8, 10]), p2 = pick(R, [12, 15, 24]), r = pick(R, [5, 10]);
    const b = rnd(q1 * p1 + q2 * p2), rem = rnd(b * r / 100), net = rnd(b - rem), tva = rnd(net * .2), ttc = rnd(net + tva);
    const items = [num('a', b, 2, eur(b)), num('b', rem, 2, eur(rem), [{ v: r, m: 'On veut la remise en euros : brut × taux.' }]), num('c', net, 2, eur(net)), num('d', tva, 2, eur(tva), [{ v: rnd(b * .2), m: 'La TVA se calcule sur le net commercial (après la remise), pas sur le brut.' }]), num('e', ttc, 2, eur(ttc))];
    return { titre: 'La facture à compléter', consigne: 'Complète la facture de haut en bas. Chaque ligne se calcule avec la précédente.',
      support: `<div class="fac">${table(['Désignation', 'Qté', 'P.U. HT', 'Montant HT'], [['Ramettes de papier', String(q1), eur(p1), eur(q1 * p1)], ['Cartouches d’encre', String(q2), eur(p2), eur(q2 * p2)], ['<b>Montant brut HT</b>', '', '', tb('a', eur(b), 22)], [`Remise ${r} %`, '', '', tb('b', eur(rem), 22)], ['<b>Net commercial HT</b>', '', '', tb('c', eur(net), 22)], ['TVA 20 %', '', '', tb('d', eur(tva), 22)], ['<b>Net à payer TTC</b>', '', '', tb('e', eur(ttc), 22)]])}</div>`, items,
      hints: ['Brut = somme des montants des lignes.', 'Remise = brut × taux ; net = brut − remise.', 'TVA = net × 0,2 ; TTC = net + TVA.'] };
  };
  TR.c4e3 = R => {
    const C = pick(R, [1200, 2400, 3600, 6000, 12000]), t = pick(R, [2, 2.5, 3, 4]), ds = [[12, '1 an'], [6, '6 mois'], [3, '3 mois'], [24, '2 ans']];
    const I = m => rnd(C * t / 100 * m / 12);
    let s = `<line x1="40" x2="570" y1="70" y2="70" class="ks" stroke-width="3"/>`; const X = m => 50 + m / 24 * 500;
    [0, 3, 6, 12, 24].forEach(m => { s += `<line x1="${X(m)}" x2="${X(m)}" y1="62" y2="78" class="ks" stroke-width="2"/>` + T(X(m), 54, m ? (m < 12 ? m + ' mois' : m / 12 + ' an' + (m > 12 ? 's' : '')) : 'départ', { fs: 13 }); });
    ds.forEach(([m], i) => { s += sb(X(m) - 44, 88, 88, L[i], eur(I(m))); });
    return { titre: 'La frise des intérêts', consigne: `${eur(C, 0)} sont placés à ${fr(t)} % par an (intérêts simples). Calcule les intérêts à chaque date.`, support: svg(600, 128, s, 'Frise du temps'),
      items: ds.map(([m], i) => num(L[i], I(m), 2, eur(I(m)), m !== 12 ? [{ v: rnd(C * t / 100 * m), m: `La durée doit être en années : ${m} mois = ${fr(m / 12)} an.` }] : [])),
      hints: ['Commence par 1 an : capital × taux.', '6 mois, c’est la moitié d’un an ; 3 mois, le quart.', '2 ans : deux fois les intérêts d’un an.'] };
  };

  /* ======================= 5 · Fonctions ======================= */
  DEP.c5 = R => {
    const f = pick(R, [4, 5, 6, 8]), k = pick(R, [.4, .5, 1]), xs = [0, 5, 10, 15, 20], ys = xs.map(x => rnd(f + k * x));
    return { titre: 'La grille de livraison', doc: table(['Distance (km)', ...xs.map(String)], [['Prix de la livraison', ...ys.map(y => eur(y))]]) + '<p class="srcl">Tarifs d’un fleuriste (commerce fictif).</p>',
      qs: [{ t: 'Combien coûte une livraison à 10 km ?', kind: 'num', v: ys[2], tol: .006, a: eur(ys[2]) },
        { t: 'Combien coûte une livraison à 0 km (le prix fixe) ?', kind: 'num', v: f, tol: .006, a: eur(f, 0) },
        { t: 'De combien le prix augmente-t-il tous les 5 km ?', kind: 'num', v: rnd(5 * k), tol: .006, a: eur(5 * k) },
        { t: `Pour 25 km, le prix sera-t-il plus ou moins de ${eur(ys[4] + 1, 0)} ?`, kind: 'qcm', choices: ['plus', 'moins'], ok: rnd(f + 25 * k) > ys[4] + 1 ? 0 : 1, a: `${rnd(f + 25 * k) > ys[4] + 1 ? 'plus' : 'moins'} : ${eur(rnd(f + 25 * k))}` },
        { t: `Rappel : combien font ${fr(k)} × 10 ?`, kind: 'num', v: rnd(10 * k), tol: .006, a: fr(10 * k) },
        { t: 'Vrai ou faux : « Le prix est proportionnel à la distance. »', kind: 'qcm', choices: ['vrai', 'faux'], ok: 1, a: `faux : à 0 km, on paie déjà ${eur(f, 0)}` }] };
  };
  TR.c5e1 = R => {
    const a = pick(R, [2, 3, 4, 0.5]), b = pick(R, [1, 3, 5, 6, 10]), xs = [pick(R, [1, 2]), pick(R, [4, 5, 6]), pick(R, [10, 12])], y4 = pick(R, [20, 30, 40]);
    const ant = rnd((y4 - b) / a, 2);
    let s = `<rect x="200" y="30" width="200" height="90" rx="16" class="k2 ks" stroke-width="3"/>` + T(300, 66, `× ${fr(a)}`, { fs: 20, c: 'kt' }) + T(300, 96, `puis + ${fr(b)}`, { fs: 20, c: 'kt' });
    s += `<path d="M120 75H192" class="ks" stroke-width="3"/><path d="M186 67L198 75L186 83Z" class="k"/><path d="M402 75H474" class="ks" stroke-width="3"/><path d="M468 67L480 75L468 83Z" class="k"/>` + T(80, 80, 'x entre', { fs: 15 }) + T(530, 80, 'f(x) sort', { fs: 15 });
    const items = xs.map((x, i) => num(L[i], rnd(a * x + b), 2, fr(rnd(a * x + b)), [{ v: rnd(a * (x + b)), m: 'Fais d’abord la multiplication, puis l’addition.' }]));
    items.push(num('d', ant, 2, fr(ant), [{ v: rnd(a * y4 + b), m: 'Ici on connaît ce qui SORT : il faut retrouver ce qui est entré (l’antécédent).' }]));
    return { titre: 'La machine à transformer', consigne: `La machine calcule f(x) = ${fr(a)}x + ${fr(b)}. Complète.`, support: svg(600, 140, s, 'Machine') + table(['x (entre)', ...xs.map(String), tb('d', fr(ant), 14)], [['f(x) (sort)', ...xs.map((x, i) => tb(L[i], items[i].a, 14)), String(y4)]]), items,
      hints: ['Image : remplace x par le nombre, multiplie, puis ajoute.', 'Antécédent : fais le chemin à l’envers (soustrais, puis divise).', 'Vérifie l’antécédent en le remettant dans la machine.'] };
  };
  TR.c5e2 = R => {
    const car = R() < .5, a = car ? pick(R, [1, 2, .5]) : pick(R, [2, 3, -2]), b = car ? pick(R, [0, 1, -2]) : pick(R, [1, -1, 4]), xs = [-2, -1, 0, 1, 2], f = x => rnd(car ? a * x * x + b : a * x + b, 2);
    const items = xs.map((x, i) => num(L[i], f(x), 2, fr(f(x)), car && x < 0 ? [{ v: rnd(-a * x * x + b, 2), m: `(${x})² = ${x * x} : un carré n’est jamais négatif.` }] : []));
    const expr = car ? `${a === 1 ? '' : fr(a)}x² ${b < 0 ? '− ' + fr(-b) : b ? '+ ' + fr(b) : ''}` : `${fr(a)}x ${b < 0 ? '− ' + fr(-b) : '+ ' + fr(b)}`;
    return { titre: 'Le tableau de valeurs', consigne: `f(x) = ${expr.trim()}. Complète le tableau, puis place les points dans un repère (sur ton cahier ou dans GeoGebra).`, support: table(['x', ...xs.map(x => fr(x))], [['f(x)', ...xs.map((x, i) => tb(L[i], fr(f(x)), 12))]]), items,
      hints: ['Remplace x par chaque nombre du tableau.', car ? 'Calcule d’abord le carré : (−2)² = 4.' : 'Attention aux signes : 3 × (−2) = −6.', 'Les points sont alignés pour une fonction affine, en forme de U pour une fonction carré.'] };
  };
  TR.c5e3 = R => {
    const a = pick(R, [1, 2, -1, .5]), b = pick(R, [1, 2, 3, -1]), f = x => a * x + b, cand = [-3, -2, -1, 1, 2, 3, 4, 5].filter(y => y !== b && Number.isInteger((y - b) / a) && Math.abs((y - b) / a) <= 4), yq = pick(R, cand);
    const S = 26, X = x => 300 + x * S * 1.6, Y = y => 130 - y * S * .9;
    let s = ''; for (let i = -5; i <= 5; i++) s += `<line x1="${X(i)}" x2="${X(i)}" y1="${Y(6)}" y2="${Y(-4)}" stroke="#E1E6F5"/>`; for (let j = -4; j <= 6; j++) s += `<line x1="${X(-5)}" x2="${X(5)}" y1="${Y(j)}" y2="${Y(j)}" stroke="#E1E6F5"/>`;
    s += `<line x1="${X(-5)}" x2="${X(5)}" y1="${Y(0)}" y2="${Y(0)}" stroke="#1D2240" stroke-width="1.6"/><line x1="${X(0)}" x2="${X(0)}" y1="${Y(6)}" y2="${Y(-4)}" stroke="#1D2240" stroke-width="1.6"/>`;
    for (let i = -5; i <= 5; i++) if (i) s += T(X(i), Y(0) + 15, i, { fs: 11, w: 400, c: 'ts' }); for (let j = -4; j <= 6; j++) if (j) s += T(X(0) - 8, Y(j) + 4, j, { fs: 11, w: 400, a: 'end', c: 'ts' });
    const pts = []; for (let x = -5; x <= 5; x += .1) { const y = f(x); if (y >= -4 && y <= 6) pts.push(X(x).toFixed(1) + ',' + Y(y).toFixed(1)); }
    s += `<polyline points="${pts.join(' ')}" fill="none" class="ks" stroke-width="3.4"/>`;
    const items = [num('a', b, 2, fr(b), [{ v: a, m: 'L’ordonnée à l’origine se lit sur l’axe vertical, là où la droite le coupe.' }]), num('b', f(2), 2, fr(f(2))), num('c', (yq - b) / a, 2, fr((yq - b) / a), [{ v: f(yq), m: 'On cherche x tel que f(x) = ' + yq + ' : pars de l’axe vertical.' }]), num('d', a, 2, fr(a), [{ v: b, m: 'Le coefficient directeur se lit avec l’escalier : +1 en x, de combien monte-t-on ?' }])];
    return { titre: 'Lire le graphique', consigne: `Lis sur le graphique : a. f(0) ; b. f(2) ; c. l’antécédent de ${yq} ; d. le coefficient directeur.`, support: svg(600, 240, s, 'Droite dans un repère') + `<p class="tr-l">a. ${tb('a', items[0].a, 12)} b. ${tb('b', items[1].a, 12)} c. ${tb('c', items[2].a, 12)} d. ${tb('d', items[3].a, 12)}</p>`, items,
      hints: ['f(0) : là où la droite coupe l’axe vertical.', 'Image : pars de l’axe horizontal, monte jusqu’à la droite, lis à gauche.', 'Coefficient directeur : avance de 1 vers la droite, compte de combien la droite monte (ou descend).'] };
  };

  /* ======================= 6 · Probabilités ======================= */
  DEP.c6 = R => {
    const n = 10, g = 1, m = pick(R, [2, 3, 4]), z = n - g - m;
    const cols = ['#FFC233', 'var(--cc)', '#E1E6F5'], lab = ['bon de 20 €', '− 10 %', 'merci'];
    let s = '', a0 = -90; const seg = []; for (let i = 0; i < g; i++) seg.push(0); for (let i = 0; i < m; i++) seg.push(1); for (let i = 0; i < z; i++) seg.push(2);
    seg.forEach((k, i) => { const a1 = a0 + 36, r = 90, cx = 150, cy = 110, p = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)];
      const [x1, y1] = p(a0), [x2, y2] = p(a1); s += `<path d="M${cx} ${cy}L${x1.toFixed(1)} ${y1.toFixed(1)}A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}Z" fill="${cols[k]}" stroke="#fff" stroke-width="2"/>`; a0 = a1; });
    s += `<path d="M150 8L142 24H158Z" fill="#1D2240"/>`;
    lab.forEach((l, i) => { s += `<rect x="290" y="${60 + i * 36}" width="22" height="22" rx="4" fill="${cols[i]}" stroke="#C9D1EA"/>` + T(322, 77 + i * 36, `${l} : ${[g, m, z][i]} secteur${[g, m, z][i] > 1 ? 's' : ''}`, { fs: 15, a: 'start' }); });
    return { titre: 'La roue de la fête des mères', doc: svg(600, 220, s, 'Roue de jeu'),
      qs: [{ t: 'Combien la roue a-t-elle de secteurs en tout ?', kind: 'num', v: n, tol: .5, a: String(n) },
        { t: 'Combien de secteurs donnent « − 10 % » ?', kind: 'num', v: m, tol: .5, a: String(m) },
        { t: 'Combien de secteurs font gagner quelque chose ?', kind: 'num', v: g + m, tol: .5, a: String(g + m) },
        { t: 'A-t-on plus de chances de gagner quelque chose ou de tomber sur « merci » ?', kind: 'qcm', choices: ['gagner', 'merci'], ok: g + m > z ? 0 : 1, a: `${g + m > z ? 'gagner' : '« merci »'} : ${g + m} secteurs contre ${z}` },
        { t: `Rappel : ${m} sur 10, c’est quel pourcentage ?`, kind: 'num', v: m * 10, tol: .006, a: pct(m * 10) },
        { t: 'Vrai ou faux : « Le bon de 20 € a autant de chances de sortir que « merci ». »', kind: 'qcm', choices: ['vrai', 'faux'], ok: 1, a: `faux : 1 secteur contre ${z}` }] };
  };
  TR.c6e1 = R => {
    let n, c; do { n = pick(R, [8, 10, 12, 20]); const r = 1 + Math.floor(R() * (n / 2)), b = 1 + Math.floor(R() * (n / 3)); c = [r, b, n - r - b]; } while (c[2] < 1);
    const cols = ['#C2332A', '#1D5FC2', '#FFC233'], nm = ['rouge', 'bleu', 'jaune'];
    let s = '', a0 = -90; const seg = []; c.forEach((k, i) => { for (let j = 0; j < k; j++) seg.push(i); });
    seg.forEach(k => { const a1 = a0 + 360 / n, r = 80, cx = 110, cy = 96, p = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)]; const [x1, y1] = p(a0), [x2, y2] = p(a1);
      s += `<path d="M${cx} ${cy}L${x1.toFixed(1)} ${y1.toFixed(1)}A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}Z" fill="${cols[k]}" stroke="#fff" stroke-width="2"/>`; a0 = a1; });
    s += T(110, 192, `${n} secteurs identiques`, { fs: 13, c: 'ts' });
    const P = x => rnd(x / n, 4), fq = (x) => `${x}/${n} = ${fr(P(x))}`;
    const items = [num('a', P(c[0]), 2, fq(c[0]), [{ v: c[0], m: 'Une probabilité est une fraction : cas favorables ÷ cas possibles.' }]), num('b', P(c[1]), 2, fq(c[1])), num('c', P(n - c[0]), 2, fq(n - c[0]), [{ v: P(c[0]), m: '« Pas rouge » : c’est l’événement contraire, 1 − P(rouge).' }]), num('d', P(c[1] + c[2]), 2, fq(c[1] + c[2]))];
    items.forEach(it => { it.tol = .006; });
    return { titre: 'La roue colorée', consigne: 'On tourne la roue. Écris chaque probabilité (fraction ou décimal).', support: `<div class="two w3"><div>${svg(220, 200, s, 'Roue colorée')}</div><div><p class="tr-l">a. P(${nm[0]}) = ${tb('a', items[0].a, 18)}</p><p class="tr-l">b. P(${nm[1]}) = ${tb('b', items[1].a, 18)}</p><p class="tr-l">c. P(pas ${nm[0]}) = ${tb('c', items[2].a, 18)}</p><p class="tr-l">d. P(${nm[1]} ou ${nm[2]}) = ${tb('d', items[3].a, 18)}</p></div></div>`, items,
      hints: ['Compte les secteurs de la couleur : ce sont les cas favorables.', `Cas possibles : les ${n} secteurs.`, 'P(pas rouge) = 1 − P(rouge).'] };
  };
  TR.c6e2 = R => {
    const A = pick(R, [['papier', 'tissu'], ['petit', 'grand']]), B = pick(R, [['carte', 'espèces', 'sans contact'], ['matin', 'midi', 'soir']]);
    const ia = Math.floor(R() * 2), ib = Math.floor(R() * 3);
    const items = [num('a', 6, 0, '6 issues', [{ v: 5, m: 'Compte toutes les cases du tableau : 2 lignes × 3 colonnes.' }]), num('b', rnd(1 / 6, 4), 2, '1/6 ≈ 0,17'), num('c', rnd(3 / 6, 4), 2, '3/6 = 0,5', [{ v: rnd(1 / 6, 4), m: `« ${A[ia]} » : toute une ligne, donc 3 cases.` }])];
    items.forEach(it => { if (it.k !== 'a') it.tol = .006; });
    return { titre: 'Le tableau des issues', consigne: `Chaque client choisit un sac (${A.join(' ou ')}) et un paiement (${B.join(', ')}). On suppose que tous les choix ont la même chance.`,
      support: table(['', ...B], A.map((a, i) => [a, ...B.map((b, j) => i === 0 && j === 0 ? `${a} · ${b}` : '…')])) + `<p class="tr-l">a. Nombre d’issues : ${tb('a', '6', 12)}</p><p class="tr-l">b. P(${A[1 - ia]} et ${B[ib]}) = ${tb('b', '1/6', 14)}</p><p class="tr-l">c. P(${A[ia]}) = ${tb('c', '3/6 = 0,5', 14)}</p>`, items,
      hints: ['Complète chaque case du tableau : une case = une issue.', '2 sacs × 3 paiements.', 'P = cases favorables ÷ cases possibles.'] };
  };
  TR.c6e3 = R => {
    const ns = [10, 50, 100, 500], ks = ns.map(n => Math.round(n * (1 / 6 + (R() - .5) * (n < 60 ? .2 : n < 200 ? .08 : .03))));
    const items = ns.map((n, i) => num(L[i], rnd(ks[i] / n, 2), 2, fr(rnd(ks[i] / n, 2)), [{ v: rnd(n / ks[i], 2), m: 'Fréquence = nombre de 6 ÷ nombre de lancers.' }]));
    items.forEach(it => { it.tol = .006; });
    return { titre: 'Les fréquences des lancers', consigne: 'On lance un dé et on compte les 6. Calcule chaque fréquence (au centième). Que remarques-tu quand le nombre de lancers augmente ?',
      support: table(['Nombre de lancers', ...ns.map(String)], [['Nombre de 6', ...ks.map(String)], ['Fréquence', ...ns.map((n, i) => tb(L[i], items[i].a, 12))]]) + '<p class="tr-l">Probabilité d’obtenir 6 : 1/6 ≈ 0,17.</p>', items,
      hints: ['Fréquence = nombre de 6 ÷ nombre de lancers.', 'Arrondis au centième : 2 chiffres après la virgule.', 'Compare avec 0,17 : de plus en plus proche ?'] };
  };

  /* ======================= 7 · Géométrie ======================= */
  DEP.c7 = R => {
    const L0 = pick(R, [8, 10, 12]), P0 = pick(R, [5, 6]), pw = pick(R, [2, 3]), ph = 2;
    const c = 24; let s = '';
    for (let i = 0; i <= L0; i++) s += `<line x1="${30 + i * c}" x2="${30 + i * c}" y1="20" y2="${20 + P0 * c}" stroke="#DCE2F2"/>`; for (let j = 0; j <= P0; j++) s += `<line x1="30" x2="${30 + L0 * c}" y1="${20 + j * c}" y2="${20 + j * c}" stroke="#DCE2F2"/>`;
    s += `<rect x="30" y="20" width="${L0 * c}" height="${P0 * c}" fill="none" class="ks" stroke-width="3"/><rect x="${30 + c}" y="${20 + c}" width="${pw * c}" height="${ph * c}" class="k" opacity=".8"/>` + T(30 + c + pw * c / 2, 20 + c + ph * c / 2 + 5, 'podium', { fs: 12, c: 'tw' });
    s += T(30 + L0 * c / 2, 20 + P0 * c + 22, `fond de la vitrine · 1 carreau = 50 cm`, { fs: 13, c: 'ts' });
    const tap = rnd(L0 * .5) >= 3 && rnd(P0 * .5) >= 2;
    return { titre: 'Le plan de la vitrine', doc: svg(600, 20 + P0 * c + 34, s, 'Plan de vitrine sur quadrillage'),
      qs: [{ t: 'Combien de carreaux mesure la longueur du fond ?', kind: 'num', v: L0, tol: .5, a: String(L0) },
        { t: 'Quelle est cette longueur en mètres ?', kind: 'num', v: L0 / 2, tol: .006, a: fr(L0 / 2) + ' m' },
        { t: 'Combien de carreaux occupe le podium ?', kind: 'num', v: pw * ph, tol: .5, a: String(pw * ph) },
        { t: 'Un tapis de 3 m sur 2 m peut-il tenir au sol de la vitrine ?', kind: 'qcm', choices: ['oui', 'non'], ok: tap ? 0 : 1, a: `${tap ? 'oui' : 'non'} : la vitrine mesure ${fr(L0 / 2)} m sur ${fr(P0 / 2)} m` },
        { t: 'Rappel : 2,5 m, c’est combien de centimètres ?', kind: 'num', v: 250, tol: .5, a: '250 cm' },
        { t: 'Vrai ou faux : « Si on double la longueur et la largeur, la surface double aussi. »', kind: 'qcm', choices: ['vrai', 'faux'], ok: 1, a: 'faux : elle est multipliée par 4' }] };
  };
  TR.c7e1 = R => {
    const a = pick(R, [4, 5, 6]), b = pick(R, [2, 3]), c1 = pick(R, [4, 6]), c2 = pick(R, [3, 4]), l1 = pick(R, [4, 5]), l2 = pick(R, [3, 4]);
    const C = 22; let s = '';
    for (let i = 0; i <= 26; i++) s += `<line x1="${10 + i * C}" x2="${10 + i * C}" y1="10" y2="${10 + 7 * C}" stroke="#E7EBF6"/>`; for (let j = 0; j <= 7; j++) s += `<line x1="10" x2="${10 + 26 * C}" y1="${10 + j * C}" y2="${10 + j * C}" stroke="#E7EBF6"/>`;
    const x = i => 10 + i * C, y = j => 10 + j * C;
    s += `<rect x="${x(1)}" y="${y(1)}" width="${a * C}" height="${b * C}" class="k" opacity=".75"/>` + T(x(1) + a * C / 2, y(1) + b * C + 18, 'a', { fs: 15, c: 'kt' });
    s += `<path d="M${x(9)} ${y(1 + c2)}H${x(9 + c1)}V${y(1)}Z" class="k" opacity=".75"/>` + T(x(9) + c1 * C / 2, y(1 + c2) + 18, 'b', { fs: 15, c: 'kt' });
    s += `<path d="M${x(17)} ${y(1)}H${x(17 + 2)}V${y(1 + l2 - 1)}H${x(17 + l1)}V${y(1 + l2)}H${x(17)}Z" class="k" opacity=".75"/>` + T(x(17) + l1 * C / 2, y(1 + l2) + 18, 'c', { fs: 15, c: 'kt' });
    const A3 = 2 * (l2 - 1) + l1 * 1;
    const items = [num('a', a * b, 2, a * b + ' cm²', [{ v: 2 * (a + b), m: 'Ça, c’est le périmètre (le tour). L’aire compte les carreaux à l’intérieur.' }]), num('b', c1 * c2 / 2, 2, fr(c1 * c2 / 2) + ' cm²', [{ v: c1 * c2, m: 'Le triangle, c’est la moitié du rectangle : divise par 2.' }]), num('c', A3, 2, A3 + ' cm²')];
    return { titre: 'Le quadrillage', consigne: '1 carreau = 1 cm². Trouve l’aire de chaque forme (compte, ou calcule).', support: svg(600, 196, s, 'Formes sur quadrillage') + `<p class="tr-l">a. ${tb('a', items[0].a, 16)} b. ${tb('b', items[1].a, 16)} c. ${tb('c', items[2].a, 16)}</p>`, items,
      hints: ['Rectangle : longueur × largeur (compte les carreaux d’un côté et de l’autre).', 'Triangle rectangle : la moitié d’un rectangle.', 'Forme en L : découpe-la en deux rectangles.'] };
  };
  TR.c7e2 = R => {
    const bx = [0, 1, 2].map(() => [pick(R, [2, 3, 4, 5]), pick(R, [2, 3]), pick(R, [1, 2, 3])]);
    let s = ''; bx.forEach((b, i) => { const ox = 30 + i * 195, oy = 150, u = 18, dx = 9, dy = -7;
      for (let z = 0; z < b[2]; z++) for (let yv = b[1] - 1; yv >= 0; yv--) for (let xv = 0; xv < b[0]; xv++) { const X0 = ox + xv * u + yv * dx, Y0 = oy - z * u + yv * dy;
        s += `<path d="M${X0} ${Y0}h${u}v${-u}h${-u}Z" class="k2 ks" stroke-width="1"/><path d="M${X0} ${Y0 - u}l${dx} ${dy}h${u}l${-dx} ${-dy}Z" class="k" opacity=".35"/><path d="M${X0 + u} ${Y0}l${dx} ${dy}v${-u}l${-dx} ${-dy}Z" class="k" opacity=".6"/>`; }
      s += T(ox + 50, 178, `${L[i]}. ${b[0]} × ${b[1]} × ${b[2]}`, { fs: 13, c: 'kt' }); });
    const items = bx.map((b, i) => num(L[i], b[0] * b[1] * b[2], 2, b[0] * b[1] * b[2] + ' cm³', [{ v: b[0] + b[1] + b[2], m: 'Le volume se calcule en multipliant : longueur × largeur × hauteur.' }]));
    const big = pick(R, [[30, 20, 10], [20, 20, 15], [40, 25, 10]]), V = big[0] * big[1] * big[2];
    items.push(num('d', V / 1000, 3, fr(V / 1000) + ' L', [{ v: V, m: 'C’est le volume en cm³. Divise par 1 000 pour avoir des litres.' }]));
    return { titre: 'Les cubes', consigne: 'Chaque petit cube fait 1 cm³. Trouve le volume de chaque pavé, puis convertis.', support: svg(600, 190, s, 'Pavés en cubes') + `<p class="tr-l">a. ${tb('a', items[0].a, 14)} b. ${tb('b', items[1].a, 14)} c. ${tb('c', items[2].a, 14)}</p><p class="tr-l">d. Un carton de ${big.join(' cm × ')} cm contient ${fr(V)} cm³, soit ${tb('d', items[3].a, 14)} (1 L = 1 000 cm³).</p>`, items,
      hints: ['Compte les cubes d’une couche, puis multiplie par le nombre de couches.', 'Volume = L × l × h.', '1 L = 1 dm³ = 1 000 cm³.'] };
  };
  TR.c7e3 = R => {
    const T3 = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]], tr = [0, 1, 2].map(() => pick(R, T3)), mode = ['hyp', 'hyp', 'cote'];
    let s = ''; const items = [];
    tr.forEach((t, i) => { const ox = 40 + i * 190, oy = 160, k = 100 / Math.max(t[0], t[1]), w = t[1] * k, hh = t[0] * k;
      s += `<path d="M${ox} ${oy}H${ox + w}L${ox} ${oy - hh}Z" class="k2 ks" stroke-width="2.4"/><path d="M${ox} ${oy - 12}h12v12" fill="none" class="ks" stroke-width="1.6"/>`;
      const lab = mode[i] === 'hyp' ? [t[0], t[1], '?'] : [t[0], '?', t[2]];
      s += T(ox - 8, oy - hh / 2, lab[0], { fs: 14, a: 'end' }) + T(ox + w / 2, oy + 18, lab[1], { fs: 14 }) + T(ox + w / 2 + 12, oy - hh / 2 - 6, lab[2], { fs: 14, c: 'kt' }) + T(ox + w / 2, oy + 36, L[i] + '.', { fs: 14, c: 'kt' });
      const v = mode[i] === 'hyp' ? t[2] : t[1];
      items.push(num(L[i], v, 2, v + ' cm', mode[i] === 'hyp' ? [{ v: t[0] + t[1], m: 'On n’additionne pas les côtés : on additionne leurs carrés, puis on prend la racine.' }] : [{ v: rnd(Math.sqrt(t[0] ** 2 + t[2] ** 2), 2), m: 'Ici, on connaît l’hypoténuse : il faut soustraire les carrés.' }])); });
    return { titre: 'Pythagore', consigne: 'Les longueurs sont en cm. Calcule chaque longueur manquante « ? ».', support: svg(600, 206, s, 'Triangles rectangles') + `<p class="tr-l">a. ${tb('a', items[0].a, 14)} b. ${tb('b', items[1].a, 14)} c. ${tb('c', items[2].a, 14)}</p>`, items,
      hints: ['L’hypoténuse est le côté en face de l’angle droit, le plus long.', 'Hypoténuse² = côté² + côté².', 'Côté² = hypoténuse² − autre côté².'] };
  };

  /* ======================= 8 · Croisement de deux variables ======================= */
  const tcTable = (rows, cols, v, cells = true) => { const R2 = v.map(r => r.reduce((a, b) => a + b, 0)), C2 = cols.map((_, j) => v.reduce((a, r) => a + r[j], 0)), N = R2.reduce((a, b) => a + b);
    return `<table class="dt tcx dt-sm"><thead><tr><th></th>${cols.map(c => `<th>${c}</th>`).join('')}<th>Total</th></tr></thead><tbody>${v.map((r, i) => `<tr><th>${rows[i]}</th>${r.map((n, j) => `<td${cells ? ` data-cell="${i}-${j}"` : ''}>${n}</td>`).join('')}<td class="tot"${cells ? ` data-cell="${i}-t"` : ''}>${R2[i]}</td></tr>`).join('')}<tr class="tot"><th>Total</th>${C2.map((n, j) => `<td${cells ? ` data-cell="t-${j}"` : ''}>${n}</td>`).join('')}<td${cells ? ' data-cell="t-t"' : ''}>${N}</td></tr></tbody></table>`; };
  const TCS = [{ rows: ['Satisfaits', 'Pas satisfaits'], cols: ['En ligne', 'En boutique'], who: 'clients', titre: 'L’enquête du magasin' }, { rows: ['Avec carte', 'Sans carte'], cols: ['Semaine', 'Samedi'], who: 'clients', titre: 'La carte de fidélité' }, { rows: ['Acheteurs', 'Non-acheteurs'], cols: ['Matin', 'Après-midi'], who: 'visiteurs', titre: 'Les visiteurs du magasin' }];
  const tcVals = R => { for (;;) { const c0 = pick(R, [80, 100, 120, 150, 160, 200]), c1 = pick(R, [40, 50, 60, 80, 100]), p0 = pick(R, [.5, .6, .7, .75, .8]), p1 = pick(R, [.3, .4, .5, .6, .7]); const a = c0 * p0, b = c1 * p1; if (Number.isInteger(a) && Number.isInteger(b) && c0 !== c1) return [[a, b], [c0 - a, c1 - b]]; } };
  DEP.c8 = R => {
    const S = TCS[0], v = tcVals(R), C0 = v[0][0] + v[1][0], C1 = v[0][1] + v[1][1], N = C0 + C1, half = v[0][0] > C0 / 2;
    return { titre: S.titre, doc: `<p>${N} clients ont répondu à la question « Êtes-vous satisfait de votre achat ? ».</p>` + tcTable(S.rows, S.cols, v),
      qs: [{ t: 'Combien de clients ont acheté en ligne et sont satisfaits ?', kind: 'tap', cell: '0-0', v: v[0][0], tol: .5, a: String(v[0][0]) },
        { t: 'Combien de clients ont répondu en tout ?', kind: 'tap', cell: 't-t', v: N, tol: .5, a: String(N) },
        { t: 'Combien de clients ont acheté en boutique ?', kind: 'tap', cell: 't-1', v: C1, tol: .5, a: String(C1) },
        { t: 'Parmi les clients en ligne, plus ou moins de la moitié sont satisfaits ?', kind: 'qcm', choices: ['plus', 'moins'], ok: half ? 0 : 1, a: `${half ? 'plus' : 'moins'} : ${v[0][0]} sur ${C0}, la moitié serait ${C0 / 2}` },
        { t: `Rappel : combien font 25 % de ${C1} ?`, kind: 'num', v: C1 / 4, tol: .006, a: fr(C1 / 4) },
        { t: '« La plupart des clients achètent en boutique. » Vrai ou faux ?', kind: 'qcm', choices: ['vrai', 'faux'], ok: C1 > C0 ? 0 : 1, a: `${C1 > C0 ? 'vrai' : 'faux'} : ${C0} en ligne, ${C1} en boutique` }] };
  };
  TR.c8e1 = R => {
    const S = TCS[1], v = tcVals(R), R0 = v[0][0] + v[0][1], C1 = v[0][1] + v[1][1], N = v.flat().reduce((a, b) => a + b);
    const items = [num('a', v[0][1], 0, String(v[0][1])), num('b', R0, 0, String(R0), [{ v: v[0][0], m: 'Le total d’une ligne est dans la colonne « Total ».' }]), num('c', C1, 0, String(C1)), num('d', N, 0, String(N)), num('e', v[1][0], 0, String(v[1][0]))];
    return { titre: 'Lire le tableau croisé', consigne: 'Croise du doigt la ligne et la colonne. Combien de clients…', support: tcTable(S.rows, S.cols, v, false) + `<p class="tr-l">a. ont la carte et viennent le samedi ? ${tb('a', items[0].a, 12)}</p><p class="tr-l">b. ont la carte (en tout) ? ${tb('b', items[1].a, 12)}</p><p class="tr-l">c. viennent le samedi (en tout) ? ${tb('c', items[2].a, 12)}</p><p class="tr-l">d. ont été comptés en tout ? ${tb('d', items[3].a, 12)}</p><p class="tr-l">e. n’ont pas la carte et viennent en semaine ? ${tb('e', items[4].a, 12)}</p>`, items,
      hints: ['« Et » : une seule case, au croisement d’une ligne et d’une colonne.', '« En tout » : une case « Total ».', 'Le total général est en bas à droite.'] };
  };
  TR.c8e2 = R => {
    const S = TCS[2], v = tcVals(R), R0 = v[0][0] + v[0][1], R1 = v[1][0] + v[1][1], C0 = v[0][0] + v[1][0], C1 = v[0][1] + v[1][1], N = R0 + R1;
    const items = [num('a', v[0][1], 0, String(v[0][1]), [{ v: R0 + v[0][0], m: 'Total − case connue : on soustrait.' }]), num('b', v[1][0], 0, String(v[1][0])), num('c', R1, 0, String(R1)), num('d', C1, 0, String(C1))];
    return { titre: 'Compléter le tableau', consigne: 'Chaque ligne et chaque colonne s’additionne. Complète les cases a, b, c, d.',
      support: `<table class="dt tcx dt-sm"><thead><tr><th></th><th>${S.cols[0]}</th><th>${S.cols[1]}</th><th>Total</th></tr></thead><tbody><tr><th>${S.rows[0]}</th><td>${v[0][0]}</td><td>${tb('a', items[0].a, 12)}</td><td class="tot">${R0}</td></tr><tr><th>${S.rows[1]}</th><td>${tb('b', items[1].a, 12)}</td><td>${v[1][1]}</td><td class="tot">${tb('c', items[2].a, 12)}</td></tr><tr class="tot"><th>Total</th><td>${C0}</td><td>${tb('d', items[3].a, 12)}</td><td>${N}</td></tr></tbody></table>`, items,
      hints: ['Commence par une ligne où il ne manque qu’une case.', 'Case manquante = total − case connue.', 'Vérifie : le total des totaux de lignes = le total des totaux de colonnes.'] };
  };
  TR.c8e3 = R => {
    const S = TCS[0], v = tcVals(R), C0 = v[0][0] + v[1][0], R0 = v[0][0] + v[0][1], N = v.flat().reduce((a, b) => a + b);
    const f = (a, b) => rnd(a / b * 100, 1);
    const items = [num('a', f(v[0][0], N), 1, pct(f(v[0][0], N)), [{ v: f(v[0][0], C0), m: '« Et » : sur l’ensemble des clients, on divise par N, pas par le total d’une colonne.' }]), num('b', f(v[0][0], C0), 1, pct(f(v[0][0], C0)), [{ v: f(v[0][0], N), m: '« Parmi les clients en ligne » : on divise par le total de la colonne « En ligne ».' }, { v: f(v[0][0], R0), m: 'Tu as divisé par le total des satisfaits : ici, le groupe, ce sont les clients en ligne.' }]), num('c', f(v[0][0], R0), 1, pct(f(v[0][0], R0))), num('d', f(C0, N), 1, pct(f(C0, N)))];
    return { titre: 'Sur le total, ou « parmi » ?', consigne: 'Calcule chaque fréquence en % (au dixième). Surligne d’abord le total par lequel tu divises.', support: tcTable(S.rows, S.cols, v, false) + `<p class="tr-l">a. les clients satisfaits <b>et</b> en ligne, sur tous les clients : ${tb('a', items[0].a, 14)}</p><p class="tr-l">b. <b>parmi</b> les clients en ligne, les satisfaits : ${tb('b', items[1].a, 14)}</p><p class="tr-l">c. <b>parmi</b> les satisfaits, ceux qui ont acheté en ligne : ${tb('c', items[2].a, 14)}</p><p class="tr-l">d. les clients en ligne, sur tous les clients : ${tb('d', items[3].a, 14)}</p>`, items,
      hints: ['« Et », « sur tous » : divise par N, en bas à droite.', '« Parmi les … » : divise par le total de ce groupe seulement.', 'Une fréquence est toujours entre 0 % et 100 %.'] };
  };

  /* vérification d’une réponse, avec l’erreur fréquente reconnue */
  function verdict(it, s) {
    if (it.qcm) return { ok: +s === it.qcm.ok };
    const x = MC.parse(s); if (!Number.isFinite(x)) return { ok: false, empty: String(s).trim() === '' };
    if (Math.abs(x - it.v) <= (it.tol == null ? 1e-6 : it.tol)) return { ok: true };
    const e = (it.err || []).find(e => Math.abs(x - e.v) <= Math.max(it.tol || 0, 1e-6)); return { ok: false, msg: e ? e.m : null };
  }
  const make = (tab, id, seed) => { const g = tab[id]; if (!g) throw new Error('générateur inconnu : ' + id); return g(rng(seed)); };
  root.MCVT = { DEP, TR, verdict, dep: (id, s) => make(DEP, id, s), tr: (id, s) => make(TR, id, s), L };
})(typeof module !== 'undefined' ? module.exports : window);
