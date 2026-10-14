/* Maths et MCV · 1re — onglet « Manipuler » : un simulateur par chapitre.
   Tout se calcule dans le navigateur ; rien n’est envoyé ni enregistré. Les graphiques utilisent le même moteur exact que le manuel (MCVP). */
(function () {
  'use strict';
  const M = window.MCVG, P = window.MCVP, fr = M.fr, rnd = M.rnd;
  const eur = x => fr(rnd(x, 2), Number.isInteger(rnd(x, 2)) ? 0 : 2) + ' €';
  const slider = (id, lab, min, max, step, val, unit = '') => `<label class="wg-sl"><span>${lab}</span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"><output for="${id}" id="${id}-o"></output>${unit ? `<small>${unit}</small>` : ''}</label>`;
  const box = (title, intro, body) => `<section class="wg"><h2 class="wg-t">🎛️ ${title}</h2><p class="wg-i">${intro}</p>${body}</section>`;
  const defi = (id, txt) => `<p class="wg-defi" id="${id}"><span class="wg-dk">🎯 Défi</span> ${txt} <b class="wg-ok" hidden>✅ Réussi !</b></p>`;
  const setDefi = (el, id, ok) => { const d = el.querySelector('#' + id); if (!d) return; d.classList.toggle('done', !!ok); d.querySelector('.wg-ok').hidden = !ok; };
  const kpi = (lab, val, cls = '') => `<div><small>${lab}</small><b class="${cls}">${val}</b></div>`;
  const val = (el, id) => +el.querySelector('#' + id).value;
  const out = (el, ids, d = {}) => ids.forEach(k => { const o = el.querySelector('#' + k + '-o'); if (o) o.textContent = fr(val(el, k), d[k] == null ? null : d[k]); });
  const RED = P.RED, BLUE = P.BLUE, GRN = P.GRN, ORG = P.ORG;
  const niceMax = v => { const p = Math.pow(10, Math.floor(Math.log10(Math.max(v, 1)))); for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= v) return m * p; return 10 * p; };
  const W = {};

  /* ---------------- 1 · coûts, résultat ---------------- */
  W.c1 = el => {
    el.innerHTML = box('Le résultat du mois', 'Change les charges fixes, le coût d’une bougie, le prix de vente et la quantité vendue. Les barres sont à la même échelle.',
      `<div class="wg-grid">${slider('c1-cf', 'Charges fixes', 200, 1500, 50, 600, '€')}${slider('c1-cv', 'Coût d’une bougie', 1, 10, .5, 4, '€')}${slider('c1-p', 'Prix de vente HT', 5, 30, .5, 12, '€')}${slider('c1-q', 'Bougies vendues', 0, 300, 1, 100)}</div>
      <div class="wg-bars" id="c1-bars"></div><div class="wg-kpis" id="c1-k"></div>${defi('c1-d', 'Avec 600 € de charges fixes, trouve <b>le plus petit nombre de bougies</b> qui donne un résultat positif.')}`);
    const up = () => {
      out(el, ['c1-cf', 'c1-cv', 'c1-p', 'c1-q']);
      const cf = val(el, 'c1-cf'), cv = val(el, 'c1-cv'), p = val(el, 'c1-p'), q = val(el, 'c1-q'), C = cf + cv * q, Rc = p * q, B = Rc - C, mx = Math.max(C, Rc, 1);
      const bar = (lab, parts) => `<div class="wg-bar"><span class="wg-bl">${lab}</span><div class="wg-bt">${parts.map(([t, v, c]) => `<i style="width:${Math.max(0, v / mx * 100)}%;background:${c};color:#fff" title="${t}">${v / mx > .14 ? t : ''}</i>`).join('')}</div></div>`;
      el.querySelector('#c1-bars').innerHTML = bar('Coût total', [['fixes', cf, '#5B6BA8'], ['variable', cv * q, ORG]]) + bar('Recette', [['recette', Rc, GRN]]);
      const seuil = p > cv ? Math.ceil(cf / (p - cv) - 1e-9) : null;
      el.querySelector('#c1-k').innerHTML = kpi('Coût total', eur(C)) + kpi('Recette', eur(Rc)) + kpi('Résultat', eur(B), B < 0 ? 'neg' : '') + kpi('Coût moyen', q ? eur(C / q) : '—') + kpi('Coût marginal', eur(cv)) + kpi('Seuil', seuil == null ? 'aucun' : seuil + ' bougies');
      setDefi(el, 'c1-d', cf === 600 && B > 0 && Rc - p - (C - cv) <= 0);
    };
    el.addEventListener('input', up); up();
  };

  /* ---------------- 2 · deux offres ---------------- */
  W.c2 = el => {
    el.innerHTML = box('Deux offres sur le même graphique', 'Offre A : un prix par jour. Offre B : un forfait plus un prix par jour. Le point d’intersection montre quand elles coûtent pareil.',
      `<div class="wg-grid">${slider('c2-a', 'A : prix par jour', 10, 40, 1, 25, '€')}${slider('c2-f', 'B : forfait', 0, 150, 5, 60, '€')}${slider('c2-b', 'B : prix par jour', 5, 30, 1, 15, '€')}${slider('c2-j', 'Nombre de jours', 0, 12, 1, 3)}</div>
      <div class="wg-svg" id="c2-g"></div><div class="wg-kpis" id="c2-k"></div>${defi('c2-d', 'Place le curseur des jours <b>exactement</b> sur le point d’intersection (prix égaux).')}`);
    const up = () => {
      out(el, ['c2-a', 'c2-f', 'c2-b', 'c2-j']);
      const a = val(el, 'c2-a'), f = val(el, 'c2-f'), b = val(el, 'c2-b'), j = val(el, 'c2-j'), A = x => a * x, B = x => f + b * x, ym = niceMax(Math.max(A(12), B(12)));
      const g = P.plot({ W: 600, H: 290, x: [0, 12, 1], y: [0, ym, ym / 5], ml: 56, mt: 20, xl: 'jours', yl: 'coût (€)', fine: true, lab: 'Deux offres' });
      let s = g.base + g.line(a, 0, { stroke: RED, w: 3 }) + g.line(b, f, { stroke: BLUE, w: 3 }) + g.txt(11.6, A(11.6), 'A', { dx: 4, dy: -8, fill: RED, cls: '', a: 'start' }) + g.txt(11.6, B(11.6), 'B', { dx: 4, dy: 18, fill: BLUE, cls: '', a: 'start' });
      const xi = a !== b ? f / (a - b) : null;
      if (xi != null && xi >= 0 && xi <= 12) s += g.guide(xi, A(xi)) + g.dot(xi, A(xi), { r: 6, fill: '#FFC233', lab: `(${fr(rnd(xi, 2))} ; ${fr(rnd(A(xi), 2))})`, dx: 10, dy: 22 });
      s += `<line x1="${g.X(j)}" y1="${g.Y(0)}" x2="${g.X(j)}" y2="${g.Y(ym)}" stroke="#7438C0" stroke-width="2" stroke-dasharray="6 4"/>`;
      el.querySelector('#c2-g').innerHTML = g.wrap(s);
      const cheaper = A(j) < B(j) ? 'A' : A(j) > B(j) ? 'B' : 'égalité';
      el.querySelector('#c2-k').innerHTML = kpi(`A pour ${j} j`, eur(A(j))) + kpi(`B pour ${j} j`, eur(B(j))) + kpi('Moins chère', cheaper) + kpi('Prix égaux pour', xi != null && xi >= 0 ? fr(rnd(xi, 2)) + ' j' : 'jamais');
      setDefi(el, 'c2-d', A(j) === B(j));
    };
    el.addEventListener('input', up); up();
  };

  /* ---------------- 3 · parabole ---------------- */
  W.c3 = el => {
    el.innerHTML = box('La parabole sous forme factorisée', 'f(x) = a (x − x₁)(x − x₂). Change a et les deux racines : regarde le sens, le sommet et le signe.',
      `<div class="wg-grid">${slider('c3-a', 'Coefficient a', -2, 2, .5, -1)}${slider('c3-x1', 'Racine x₁', 0, 10, 1, 2)}${slider('c3-x2', 'Racine x₂', 0, 10, 1, 8)}</div>
      <div class="wg-svg" id="c3-g"></div><div class="wg-kpis" id="c3-k"></div>${defi('c3-d', 'Obtiens une parabole de <b>sommet (5 ; 9)</b>.')}`);
    const up = () => {
      out(el, ['c3-a', 'c3-x1', 'c3-x2']);
      let a = val(el, 'c3-a'); if (a === 0) { a = .5; el.querySelector('#c3-a').value = .5; el.querySelector('#c3-a-o').textContent = '0,5'; }
      const x1 = Math.min(val(el, 'c3-x1'), val(el, 'c3-x2')), x2 = Math.max(val(el, 'c3-x1'), val(el, 'c3-x2')), f = x => a * (x - x1) * (x - x2), xs = (x1 + x2) / 2, ys = f(xs);
      const g = P.plot({ W: 600, H: 300, x: [0, 10, 1], y: [-30, 30, 5], ml: 50, mt: 16, mb: 30, zeroAxes: true, fine: true, lab: 'Parabole' });
      let s = g.base + (x2 > x1 ? g.band(x1, x2, { fill: a < 0 ? '#1E7F45' : '#C2332A', op: .14 }) : '') + g.curve(f, { stroke: BLUE, w: 3.2 }) + g.dot(x1, 0, { r: 5, fill: '#FFC233' }) + g.dot(x2, 0, { r: 5, fill: '#FFC233' });
      if (ys >= -30 && ys <= 30) s += g.dot(xs, ys, { r: 6, fill: '#fff', stroke: RED, lab: `S (${fr(xs)} ; ${fr(rnd(ys, 2))})`, dx: 10, dy: a < 0 ? -10 : 22 });
      el.querySelector('#c3-g').innerHTML = g.wrap(s);
      el.querySelector('#c3-k').innerHTML = kpi('Sens', a > 0 ? 'vers le haut' : 'vers le bas') + kpi('Racines', x1 === x2 ? fr(x1) + ' (une seule)' : `${x1} et ${x2}`) + kpi('Sommet', `(${fr(xs)} ; ${fr(rnd(ys, 2))})`) + kpi(a < 0 ? 'Maximum' : 'Minimum', fr(rnd(ys, 2))) + kpi('Entre les racines', x1 === x2 ? '—' : a < 0 ? 'f(x) > 0' : 'f(x) < 0');
      setDefi(el, 'c3-d', xs === 5 && Math.abs(ys - 9) < 1e-9);
    };
    el.addEventListener('input', up); up();
  };

  /* ---------------- 4 · tangente glissante ---------------- */
  W.c4 = el => {
    const B = x => -x * x + 10 * x - 16, Bp = x => -2 * x + 10;
    el.innerHTML = box('La tangente qui glisse', 'B(x) = − x² + 10x − 16 et B′(x) = − 2x + 10. Déplace le point : la pente de la tangente est le nombre dérivé.',
      `<div class="wg-grid">${slider('c4-x', 'Abscisse du point', 0, 10, .1, 3)}</div><div class="wg-svg" id="c4-g"></div><div class="wg-kpis" id="c4-k"></div>${defi('c4-d', 'Place le point là où la <b>tangente est horizontale</b>.')}`);
    const up = () => {
      out(el, ['c4-x'], { 'c4-x': 1 });
      const x0 = rnd(val(el, 'c4-x'), 1), y0 = rnd(B(x0), 4), m = rnd(Bp(x0), 4);
      const g = P.plot({ W: 600, H: 300, x: [0, 10, 1], y: [-16, 12, 4], ml: 52, mt: 18, mb: 30, zeroAxes: true, fine: true, lab: 'Courbe de B et tangente' });
      const s = g.base + g.curve(B, { stroke: BLUE, w: 3.2 }) + g.seg(Math.max(0, x0 - 2), y0 - 2 * m * (x0 - Math.max(0, x0 - 2)) / 2, Math.min(10, x0 + 2), y0 + m * (Math.min(10, x0 + 2) - x0), { stroke: RED, w: 3 }) + g.dot(x0, y0, { r: 6, fill: '#FFC233' });
      el.querySelector('#c4-g').innerHTML = g.wrap(s);
      el.querySelector('#c4-k').innerHTML = kpi('B(x)', fr(rnd(y0, 2))) + kpi('Pente B′(x)', fr(rnd(m, 2))) + kpi('B est', m > 0 ? 'croissante ↗' : m < 0 ? 'décroissante ↘' : 'au sommet');
      setDefi(el, 'c4-d', Math.abs(m) < 1e-9);
    };
    el.addEventListener('input', up); up();
  };

  /* ---------------- 5 · deux suites ---------------- */
  W.c5 = el => {
    el.innerHTML = box('Arithmétique contre géométrique', 'Placement A : on ajoute le même montant chaque année. Placement B : on ajoute le même pourcentage. Lequel gagne, et quand ?',
      `<div class="wg-grid">${slider('c5-c', 'Capital de départ', 500, 5000, 100, 1000, '€')}${slider('c5-r', 'A : + par an', 10, 200, 5, 60, '€')}${slider('c5-t', 'B : + par an', 1, 12, .5, 5, '%')}${slider('c5-n', 'Durée affichée', 5, 25, 1, 12, 'ans')}</div>
      <div class="wg-svg" id="c5-g"></div><div class="wg-kpis" id="c5-k"></div>${defi('c5-d', 'Règle les placements pour que B dépasse A <b>exactement au bout de 5 ans</b>.')}`);
    const up = () => {
      out(el, ['c5-c', 'c5-r', 'c5-t', 'c5-n']);
      const C = val(el, 'c5-c'), r = val(el, 'c5-r'), q = 1 + val(el, 'c5-t') / 100, N = val(el, 'c5-n'), A = n => C + r * n, Bv = n => C * Math.pow(q, n);
      let k = null; for (let n = 1; n <= 200; n++) if (Bv(n) > A(n)) { k = n; break; }
      const ym = niceMax(Math.max(A(N), Bv(N))), y0 = Math.floor(C * .9 / (ym / 10)) * (ym / 10);
      const g = P.plot({ W: 600, H: 290, x: [0, N, N > 15 ? 5 : 1], y: [y0, ym, (ym - y0) / 5], ml: 60, mt: 18, mb: 30, xl: 'années', fine: true, lab: 'Deux placements' });
      const ns = [...Array(N + 1).keys()];
      let s = g.base + g.pts(ns.map(n => [n, A(n)]), { r: 4.2, fill: BLUE }) + g.pts(ns.map(n => [n, Bv(n)]), { r: 4.2, fill: ORG });
      if (k != null && k <= N) s += g.dot(k, Bv(k), { r: 6.5, fill: '#FFC233', lab: `B dépasse A : n = ${k}`, dx: -10, dy: -12, a: 'end' });
      el.querySelector('#c5-g').innerHTML = g.wrap(s);
      el.querySelector('#c5-k').innerHTML = kpi('A : raison r', '+ ' + eur(r)) + kpi('B : raison q', fr(rnd(q, 4))) + kpi(`A au bout de ${N} ans`, eur(A(N))) + kpi(`B au bout de ${N} ans`, eur(rnd(Bv(N), 2))) + kpi('B dépasse A', k == null ? 'pas avant 200 ans' : `à n = ${k}`);
      setDefi(el, 'c5-d', k === 5);
    };
    el.addEventListener('input', up); up();
  };

  /* ---------------- 6 · nuage et droite ---------------- */
  W.c6 = el => {
    const X = [1, 2, 3, 4, 5, 6, 7, 8], Y0 = [21, 24, 28, 31, 34, 38, 41, 43];
    el.innerHTML = box('Le nuage et sa droite', 'Change le chiffre d’affaires d’un mois : la droite des moindres carrés, le point moyen et R² se recalculent.',
      `<div class="wg-grid"><label class="wg-sl"><span>Mois</span><select id="c6-m">${X.map(x => `<option value="${x - 1}">mois ${x}</option>`).join('')}</select></label>${slider('c6-y', 'CA du mois (k€)', 0, 60, 1, Y0[0])}</div>
      <p class="wg-btns"><button class="btn sm ghost" id="c6-r">↺ Données de départ</button></p><div class="wg-svg" id="c6-g"></div><div class="wg-kpis" id="c6-k"></div>${defi('c6-d', 'En changeant <b>un seul mois</b>, fais passer R² sous 0,9.')}`);
    let Y = Y0.slice();
    const sel = el.querySelector('#c6-m'), sl = el.querySelector('#c6-y');
    const draw = () => {
      el.querySelector('#c6-y-o').textContent = fr(Y[+sel.value]);
      const pts = X.map((x, i) => [x, Y[i]]), F = P.fit(pts);
      const g = P.plot({ W: 600, H: 290, x: [0, 9, 1], y: [0, 60, 10], ml: 52, mt: 22, mb: 34, xl: 'budget (centaines d’€)', yl: 'CA (k€)', fine: true, lab: 'Nuage de points' });
      const s = g.base + g.line(F.a, F.b, { stroke: RED, w: 2.6 }) + g.pts(pts, { r: 5.5, fill: BLUE }) + g.dot(X[+sel.value], Y[+sel.value], { r: 7, fill: 'none', stroke: '#7438C0' }) + g.dot(F.mx, F.my, { r: 6, fill: '#FFC233', stroke: RED });
      el.querySelector('#c6-g').innerHTML = g.wrap(s);
      el.querySelector('#c6-k').innerHTML = kpi('Droite', `y = ${fr(rnd(F.a, 2))} x ${F.b < 0 ? '−' : '+'} ${fr(Math.abs(rnd(F.b, 2)))}`) + kpi('Point moyen G', `(${fr(F.mx)} ; ${fr(rnd(F.my, 2))})`) + kpi('R²', fr(rnd(F.r2, 3))) + kpi('Ajustement', F.r2 >= .9 ? 'pertinent' : 'peu pertinent');
      const changed = Y.reduce((n, y, i) => n + (y !== Y0[i] ? 1 : 0), 0);
      setDefi(el, 'c6-d', changed === 1 && F.r2 < .9);
    };
    sel.addEventListener('change', () => { sl.value = Y[+sel.value]; draw(); });
    sl.addEventListener('input', () => { Y[+sel.value] = +sl.value; draw(); });
    el.querySelector('#c6-r').addEventListener('click', () => { Y = Y0.slice(); sl.value = Y[+sel.value]; draw(); });
    draw();
  };

  /* ---------------- 7 · tableau croisé et tirages ---------------- */
  W.c7 = el => {
    el.innerHTML = box('Le tableau croisé en direct', 'Change les effectifs : les probabilités se recalculent. Puis tire des clients au hasard pour voir la fréquence se rapprocher de la probabilité.',
      `<div class="wg-grid">${slider('c7-a', 'En ligne, satisfaits', 0, 120, 1, 68)}${slider('c7-b', 'En ligne, pas satisfaits', 0, 120, 1, 12)}${slider('c7-c', 'Magasin, satisfaits', 0, 160, 1, 90)}${slider('c7-d', 'Magasin, pas satisfaits', 0, 160, 1, 30)}</div>
      <div id="c7-t"></div><div class="wg-kpis" id="c7-k"></div><p class="wg-btns"><button class="btn sm" id="c7-s">🎲 Tirer 100 clients</button></p><p class="wg-note" id="c7-n"></p>${defi('c7-df', 'Règle le tableau pour que la probabilité d’être satisfait soit <b>la même parmi les clients en ligne et parmi ceux du magasin</b>.')}`);
    const up = () => {
      out(el, ['c7-a', 'c7-b', 'c7-c', 'c7-d']);
      const a = val(el, 'c7-a'), b = val(el, 'c7-b'), c = val(el, 'c7-c'), d = val(el, 'c7-d'), L = a + b, Mg = c + d, S = a + c, N = L + Mg;
      el.querySelector('#c7-t').innerHTML = `<table class="dt"><thead><tr><th></th><th>satisfait</th><th>pas satisfait</th><th>total</th></tr></thead><tbody><tr><th>en ligne</th><td>${a}</td><td>${b}</td><td><b>${L}</b></td></tr><tr><th>magasin</th><td>${c}</td><td>${d}</td><td><b>${Mg}</b></td></tr><tr><th>total</th><td><b>${S}</b></td><td><b>${b + d}</b></td><td><b>${N}</b></td></tr></tbody></table>`;
      const p = (k, n) => n ? fr(rnd(k / n, 3)) : '—';
      el.querySelector('#c7-k').innerHTML = kpi('P(satisfait)', p(S, N)) + kpi('P(en ligne et satisfait)', p(a, N)) + kpi('P(en ligne ou satisfait)', p(L + S - a, N)) + kpi('parmi en ligne', p(a, L)) + kpi('parmi magasin', p(c, Mg));
      setDefi(el, 'c7-df', L > 0 && Mg > 0 && a * Mg === c * L);
      return { a, N, S };
    };
    el.addEventListener('input', up);
    el.querySelector('#c7-s').addEventListener('click', () => { const { N, S } = up(); if (!N) return; let k = 0; for (let i = 0; i < 100; i++) if (Math.random() * N < S) k++; el.querySelector('#c7-n').innerHTML = `Sur 100 clients tirés au hasard : <b>${k}</b> satisfaits, soit une fréquence de <b>${fr(k / 100)}</b>. Probabilité : <b>${fr(rnd(S / N, 3))}</b>. Retire : la fréquence change, mais reste proche.`; });
    up();
  };

  /* ---------------- 8 · solides ---------------- */
  W.c8 = el => {
    const G = window.MCVT8;
    el.innerHTML = box('Le solide et sa section', 'Choisis un solide, ses dimensions et la hauteur de coupe. Le dessin, le volume et la section se recalculent.',
      `<div class="wg-grid"><label class="wg-sl"><span>Solide</span><select id="c8-s"><option value="cyl">cylindre</option><option value="cone" selected>cône</option><option value="pyr">pyramide à base carrée</option><option value="boule">boule</option></select></label>${slider('c8-r', 'Rayon ou côté', 1, 10, .5, 4, 'cm')}${slider('c8-h', 'Hauteur', 2, 20, .5, 9, 'cm')}${slider('c8-c', 'Hauteur de coupe', 0, 100, 5, 50, '%')}</div>
      <div class="wg-svg" id="c8-g"></div><div class="wg-kpis" id="c8-k"></div>${defi('c8-d', 'Trouve un cône qui contient <b>1 litre</b> de cire, à 10 cm³ près.')}`);
    const up = () => {
      out(el, ['c8-r', 'c8-h', 'c8-c']);
      const t = el.querySelector('#c8-s').value, r = val(el, 'c8-r'), h = val(el, 'c8-h'), k = val(el, 'c8-c') / 100, PI = Math.PI;
      el.querySelector('#c8-h').disabled = t === 'boule';
      let V, sec, body;
      const s = Math.min(170 / Math.max(h, 2 * r, 1), 120 / Math.max(r, 1) * .9, 16), by = 250, cx = 300, RED2 = 'rgba(194,51,42,.55)';
      if (t === 'cyl') { V = PI * r * r * h; sec = `disque de rayon ${fr(r)} cm`; body = G.cyl(cx, by, s, r, h, { fill: '#E0EBFD', cut: G.ell(cx, by - k * h * s, r * s, { fill: RED2, stroke: RED, w: 2 }) }); }
      else if (t === 'cone') { const rs = r * (1 - k); V = PI * r * r * h / 3; sec = k >= 1 ? 'un point (le sommet)' : `disque de rayon ${fr(rnd(rs, 2))} cm`; body = G.cone(cx, by, s, r, h, { fill: '#FDE3E0', cut: k < 1 ? G.ell(cx, by - k * h * s, rs * s, { fill: RED2, stroke: RED, w: 2 }) : '' }); }
      else if (t === 'pyr') { const c = r, cs = c * (1 - k), m = c / 2, a = cs / 2; V = c * c * h / 3; sec = k >= 1 ? 'un point (le sommet)' : `carré de côté ${fr(rnd(cs, 2))} cm`; body = G.pyr(cx - c * s * .7, by, s, c, h, { fill: '#EEE3FB', cut: p => k < 1 ? G.poly([p(m - a, k * h, m - a), p(m + a, k * h, m - a), p(m + a, k * h, m + a), p(m - a, k * h, m + a)], { fill: '#C2332A', op: .55, stroke: RED, w: 2 }) : '' }); }
      else { const d = (k - .5) * 2 * r, rs = Math.sqrt(Math.max(0, r * r - d * d)); V = 4 / 3 * PI * r * r * r; sec = `disque de rayon ${fr(rnd(rs, 2))} cm`; const cy = by - r * s; body = G.boule(cx, cy, s, r, { fill: '#D6F2F2', cut: G.ell(cx, cy - d * s, rs * s, { fill: RED2, stroke: RED, w: 2 }) }); }
      el.querySelector('#c8-g').innerHTML = G.SV(600, 280, body, 'Solide et section');
      el.querySelector('#c8-k').innerHTML = kpi('Volume', fr(rnd(V, 2)) + ' cm³') + kpi('En litres', fr(rnd(V / 1000, 3)) + ' L') + kpi('Section', sec);
      setDefi(el, 'c8-d', t === 'cone' && Math.abs(V - 1000) <= 10);
    };
    el.addEventListener('input', up); el.addEventListener('change', up); up();
  };

  window.MCVW = W;
})();
