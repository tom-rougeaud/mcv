/* Maths et MCV · Tle — rubrique « Je manipule » : un simulateur par chapitre.
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
  const VIO = P.VIO;
  const sel = (id, lab, opts) => `<label class="wg-sl"><span>${lab}</span><select id="${id}">${opts.map(([v, t]) => `<option value="${v}">${t}</option>`).join('')}</select></label>`;
  const axis = m => { const raw = Math.max(m, 1e-9) / 4, p = Math.pow(10, Math.floor(Math.log10(raw))), step = [1, 2, 2.5, 5, 10].map(k => k * p).find(v => v >= raw); return [Math.ceil(m / step - 1e-9) * step, step]; };
  const sgn = x => x < 0 ? '− ' + fr(-x) : fr(x);

  /* ---------------- 1 · suite géométrique ---------------- */
  W.c1 = el => {
    el.innerHTML = box('Une suite géométrique', 'Choisis le premier terme, le pourcentage d’évolution à chaque rang et le nombre de rangs. Les points (n ; uₙ) se placent tout seuls.',
      `<div class="wg-grid">${slider('c1-u', 'Premier terme u₀', 100, 2000, 50, 800)}${slider('c1-t', 'Évolution par rang', -30, 30, .5, 5, '%')}${slider('c1-n', 'Nombre de rangs', 4, 24, 1, 12)}</div>
      <div class="wg-svg" id="c1-g"></div><div class="wg-kpis" id="c1-k"></div>${defi('c1-d', 'Trouve le pourcentage qui fait <b>doubler</b> u₀ en 12 rangs (à 0,5 % près).')}`);
    const up = () => {
      out(el, ['c1-u', 'c1-t', 'c1-n']);
      const u0 = val(el, 'c1-u'), t = val(el, 'c1-t'), N = val(el, 'c1-n'), q = 1 + t / 100, u = n => u0 * Math.pow(q, n);
      const pts = Array.from({ length: N + 1 }, (_, n) => [n, u(n)]), [ym, ys] = axis(Math.max(...pts.map(p => p[1])) * 1.08);
      const g = P.plot({ W: 600, H: 280, x: [0, N, N > 12 ? 2 : 1], y: [0, ym, ys], ml: 60, mt: 16, xl: 'rang n', yl: 'uₙ', fine: true, lab: 'Nuage de points de la suite' });
      el.querySelector('#c1-g').innerHTML = g.wrap(g.base + g.pts(pts, { r: 4.6, fill: t >= 0 ? ORG : BLUE }));
      let S = 0; pts.forEach(p => { S += p[1]; });
      el.querySelector('#c1-k').innerHTML = kpi('Raison q', fr(rnd(q, 4))) + kpi(`u${N}`, fr(rnd(u(N), 2))) + kpi(`Somme u₀ à u${N}`, fr(rnd(S, 2))) + kpi('Sens', q > 1 ? 'croissante' : q < 1 ? 'décroissante' : 'constante');
      setDefi(el, 'c1-d', Math.abs(Math.pow(q, 12) - 2) < .07);
    };
    el.addEventListener('input', up); up();
  };

  /* ---------------- 2 · emprunt : tableau d’amortissement ---------------- */
  W.c2 = el => {
    el.innerHTML = box('Le tableau d’amortissement', 'Choisis le montant, le taux, la durée et la formule de remboursement. Le tableau et le coût se mettent à jour.',
      `<div class="wg-grid">${slider('c2-c', 'Capital emprunté', 1000, 30000, 500, 12000, '€')}${slider('c2-t', 'Taux annuel', .5, 9, .1, 5, '%')}${slider('c2-n', 'Durée', 2, 10, 1, 5, 'ans')}${sel('c2-f', 'Formule', [['ann', 'annuités constantes'], ['amc', 'amortissement constant']])}</div>
      <div class="wg-fac" id="c2-tab"></div><div class="wg-kpis" id="c2-k"></div>${defi('c2-d', 'Avec 12 000 € à 5 % en annuités constantes, trouve la <b>plus courte durée</b> pour une annuité inférieure à 3 000 €.')}`);
    const up = () => {
      out(el, ['c2-c', 'c2-t', 'c2-n'], { 'c2-t': 1 });
      const C = val(el, 'c2-c'), t = val(el, 'c2-t') / 100, n = val(el, 'c2-n'), f = el.querySelector('#c2-f').value;
      let K = C, cost = 0, rows = '';
      const a = rnd(C * t / (1 - Math.pow(1 + t, -n)), 2);
      for (let k = 1; k <= n; k++) { const i = rnd(K * t, 2), am = f === 'ann' ? (k === n ? K : rnd(a - i, 2)) : rnd(C / n, 2), an = rnd(i + am, 2); cost += i; rows += `<tr><td>${k}</td><td>${eur(K)}</td><td>${eur(i)}</td><td>${eur(am)}</td><td><b>${eur(an)}</b></td></tr>`; K = rnd(K - am, 2); }
      el.querySelector('#c2-tab').innerHTML = `<table class="wg-t"><tr><th>Année</th><th>Capital dû</th><th>Intérêts</th><th>Amortissement</th><th>Annuité</th></tr>${rows}</table>`;
      el.querySelector('#c2-k').innerHTML = kpi('Coût de l’emprunt', eur(cost)) + kpi('Total remboursé', eur(C + cost)) + kpi('Taux mensuel équivalent', fr(rnd((Math.pow(1 + t, 1 / 12) - 1) * 100, 3)) + ' %') + kpi('Seuil d’usure (> 6 000 €, oct. 2026)', '8,56 %');
      setDefi(el, 'c2-d', C === 12000 && Math.abs(t - .05) < 1e-9 && f === 'ann' && a < 3000 && n === 5);
    };
    el.addEventListener('input', up); el.addEventListener('change', up); up();
  };

  /* ---------------- 3 · polynôme de degré 3 ---------------- */
  W.c3 = el => {
    el.innerHTML = box('Une cubique et ses extremums', 'f(x) = − x³ + 1,5(a + b)x² − 3abx + d : sa dérivée − 3(x − a)(x − b) s’annule en a et b. Déplace aussi la droite y = c.',
      `<div class="wg-grid">${slider('c3-a', 'Racine a de f′', 0, 6, 1, 2)}${slider('c3-b', 'Racine b de f′', 2, 12, 1, 8)}${slider('c3-d', 'Constante d', -60, 60, 5, -20)}${slider('c3-c', 'Hauteur c', -150, 150, 5, 30)}</div>
      <div class="wg-svg" id="c3-g"></div><div class="wg-kpis" id="c3-k"></div>${defi('c3-d2', 'Règle la droite y = c pour obtenir <b>exactement 3 solutions</b> à f(x) = c.')}`);
    const up = () => {
      out(el, ['c3-a', 'c3-b', 'c3-d', 'c3-c']);
      let a = val(el, 'c3-a'), b = val(el, 'c3-b'); if (a > b) [a, b] = [b, a]; const d = val(el, 'c3-d'), c = val(el, 'c3-c');
      const f = x => -(x ** 3) + 1.5 * (a + b) * x * x - 3 * a * b * x + d, hi = b + 3, lo = Math.min(0, a - 1);
      const vals = []; for (let k = 0; k <= 200; k++) vals.push(f(lo + (hi - lo) * k / 200));
      let ymin = Math.min(...vals, c), ymax = Math.max(...vals, c); const [m1, st] = axis((ymax - ymin) * 1.1 || 10); ymin = Math.floor(ymin / st) * st; ymax = ymin + Math.ceil((ymax - ymin) / st) * st;
      const g = P.plot({ W: 600, H: 290, x: [lo, hi, 1], y: [ymin, ymax, st], ml: 56, mt: 16, zeroAxes: true, lab: 'Courbe de f et droite y = c' });
      let ns = 0; for (let k = 0; k < 2000; k++) { const u = lo + (hi - lo) * k / 2000, v = lo + (hi - lo) * (k + 1) / 2000; if ((f(u) - c) * (f(v) - c) < 0 || f(u) === c) ns++; }
      el.querySelector('#c3-g').innerHTML = g.wrap(g.base + g.curve(f, { stroke: ORG, w: 3 }) + g.seg(lo, c, hi, c, { stroke: RED, dash: '7 5', w: 2 }) + (a !== b ? g.dot(a, f(a), { r: 5 }) + g.dot(b, f(b), { r: 5 }) : ''));
      el.querySelector('#c3-k').innerHTML = kpi('f′(x)', `−3(x − ${a})(x − ${b})`) + kpi(`minimum local en ${a}`, a !== b ? fr(f(a)) : '—') + kpi(`maximum local en ${b}`, a !== b ? fr(f(b)) : '—') + kpi(`solutions de f(x) = ${fr(c)}`, String(ns));
      setDefi(el, 'c3-d2', ns === 3);
    };
    el.addEventListener('input', up); up();
  };

  /* ---------------- 4 · exponentielle et logarithme ---------------- */
  W.c4 = el => {
    el.innerHTML = box('Doubler, tripler… avec le logarithme', 'Choisis le taux annuel et le multiplicateur visé. Le logarithme donne la durée : x = log(a) ÷ log(q).',
      `<div class="wg-grid">${slider('c4-t', 'Taux annuel', -20, 20, .1, 1.7, '%')}${slider('c4-a', 'Multiplicateur visé a', .2, 4, .1, 2)}</div>
      <div class="wg-svg" id="c4-g"></div><div class="wg-kpis" id="c4-k"></div>${defi('c4-d', 'Trouve le taux annuel qui fait <b>doubler</b> un capital en <b>10 ans</b> (au dixième de %).')}`);
    const up = () => {
      out(el, ['c4-t', 'c4-a'], { 'c4-t': 1, 'c4-a': 1 });
      const t = val(el, 'c4-t'), a = val(el, 'c4-a'), q = 1 + t / 100, x = q !== 1 ? Math.log10(a) / Math.log10(q) : NaN;
      const X = Number.isFinite(x) && x > 0 ? Math.min(Math.max(10, Math.ceil(x * 1.3 / 5) * 5), 200) : 40, ys = [];
      for (let k = 0; k <= 50; k++) ys.push(Math.pow(q, X * k / 50)); const [ym, st] = axis(Math.max(...ys, a) * 1.08);
      const g = P.plot({ W: 600, H: 280, x: [0, X, X / 5], y: [0, ym, st], ml: 50, mt: 16, xl: 'années', yl: 'coefficient', lab: 'Coefficient q puissance x' });
      let s = g.base + g.curve(v => Math.pow(q, v), { stroke: GRN, w: 3 }) + g.seg(0, a, X, a, { stroke: RED, dash: '7 5', w: 2 });
      if (Number.isFinite(x) && x >= 0 && x <= X) s += g.guide(x, a) + g.dot(x, a, { r: 6, fill: '#FFC233', lab: 'x ≈ ' + fr(rnd(x, 2)), dx: 10, dy: 22 });
      el.querySelector('#c4-g').innerHTML = g.wrap(s);
      el.querySelector('#c4-k').innerHTML = kpi('q', fr(rnd(q, 4))) + kpi('x = log(a) ÷ log(q)', Number.isFinite(x) && x >= 0 ? fr(rnd(x, 2)) : 'jamais') + kpi('en années entières', Number.isFinite(x) && x >= 0 ? String(Math.ceil(x - 1e-9)) : '—') + kpi('Règle de 72', t > 0 ? '≈ ' + fr(rnd(72 / t, 1)) + ' ans' : '—');
      setDefi(el, 'c4-d', Math.abs(a - 2) < 1e-9 && Math.abs(Math.pow(q, 10) - 2) < .02);
    };
    el.addEventListener('input', up); up();
  };

  /* ---------------- 5 · choisir un modèle (données réelles Fevad) ---------------- */
  W.c5 = el => {
    const D = [[2017, 80.5], [2018, 91.3], [2019, 101.8], [2020, 110.4], [2021, 127.2], [2022, 144.7], [2023, 159.9]], PT = D.map(([a, v]) => [a - 2017, v]);
    const fl = P.fit(PT), fz = P.fit(PT.map(([x, y]) => [x, Math.log10(y)])), q = Math.pow(10, fz.a), k = Math.pow(10, fz.b), E = x => k * Math.pow(q, x), Lf = x => fl.a * x + fl.b;
    el.innerHTML = box('Affine ou exponentiel ?', 'Ventes en ligne en France, 2017-2023 (Fevad). Affiche un modèle ou les deux, puis choisis une année : interpolation ou extrapolation ?',
      `<div class="wg-grid">${sel('c5-m', 'Modèle', [['2', 'les deux'], ['a', 'affine'], ['e', 'exponentiel']])}${slider('c5-y', 'Année', 2017, 2032, 1, 2025)}</div>
      <div class="wg-svg" id="c5-g"></div><div class="wg-kpis" id="c5-k"></div>${defi('c5-d', 'Trouve la <b>première année</b> où les deux modèles s’écartent de plus de 50 milliards d’euros.')}`);
    const up = () => {
      out(el, ['c5-y']);
      const m = el.querySelector('#c5-m').value, y = val(el, 'c5-y'), x = y - 2017;
      const g = P.plot({ W: 600, H: 290, x: [0, 15, 1], y: [0, 450, 50], xt: [0, 3, 6, 9, 12, 15].map(v => [v, String(2017 + v)]), ml: 50, mt: 16, yl: 'Md€', lab: 'Ventes en ligne et modèles' });
      let s = g.base + g.band(0, 6, { fill: '#FFC233', op: .2 }) + g.pts(PT, { r: 4.6 });
      if (m !== 'e') s += g.line(fl.a, fl.b, { stroke: BLUE, w: 2.4, dash: '8 5' });
      if (m !== 'a') s += g.curve(E, { stroke: ORG, w: 2.6 });
      s += `<line x1="${g.X(x)}" y1="${g.Y(0)}" x2="${g.X(x)}" y2="${g.Y(450)}" stroke="${VIO}" stroke-width="2" stroke-dasharray="6 4"/>` + (y === 2025 ? g.dot(8, 196.4, { r: 6, fill: '#FFC233', lab: '196,4 (réel)', dx: 10, dy: 18 }) : '');
      el.querySelector('#c5-g').innerHTML = g.wrap(s);
      el.querySelector('#c5-k').innerHTML = kpi('R² affine', fr(rnd(fl.r2, 3))) + kpi('R² exponentiel', fr(rnd(fz.r2, 3))) + kpi(`affine ${y}`, fr(rnd(Lf(x), 1)) + ' Md€') + kpi(`exponentiel ${y}`, fr(rnd(E(x), 1)) + ' Md€') + kpi('Type', x <= 6 ? 'interpolation' : 'extrapolation');
      setDefi(el, 'c5-d', y === 2028 && E(x) - Lf(x) > 50 && E(x - 1) - Lf(x - 1) <= 50);
    };
    el.addEventListener('input', up); el.addEventListener('change', up); up();
  };

  /* ---------------- 6 · arbre pondéré et simulation ---------------- */
  W.c6 = el => {
    el.innerHTML = box('L’arbre des retours', 'Règle les pondérations : l’arbre, P(R) et P sachant R de D se recalculent. Puis simule 1 000 commandes.',
      `<div class="wg-grid">${slider('c6-a', 'P(D) : livraison', 0, 1, .05, .6)}${slider('c6-b', 'P sachant D de R', 0, 1, .01, .15)}${slider('c6-c', 'P sachant M de R', 0, 1, .01, .05)}</div>
      <div class="wg-svg" id="c6-g"></div><div class="wg-kpis" id="c6-k"></div><p class="wg-btns"><button class="btn sm" data-c6sim>🎲 Simuler 1 000 commandes</button><span id="c6-sim" class="wg-note"></span></p>${defi('c6-d', 'Règle les curseurs pour que D et R soient <b>indépendants</b>, avec P(D) = 0,6.')}`);
    const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 14}" text-anchor="${o.a || 'middle'}" font-weight="700" fill="${o.fill || '#1D2240'}">${s}</text>`;
    const up = () => {
      out(el, ['c6-a', 'c6-b', 'c6-c'], { 'c6-a': 2, 'c6-b': 2, 'c6-c': 2 });
      const a = val(el, 'c6-a'), b = val(el, 'c6-b'), c = val(el, 'c6-c'), pR = a * b + (1 - a) * c;
      const leaf = [a * b, a * (1 - b), (1 - a) * c, (1 - a) * (1 - c)], ys = [40, 110, 170, 240], y1 = [75, 205];
      let s = `<circle cx="30" cy="140" r="7" fill="#1D2240"/>`;
      y1.forEach((y, i) => { s += `<line x1="36" y1="140" x2="200" y2="${y}" stroke="#1D2240" stroke-width="2"/>` + T(110, (140 + y) / 2 - 6, fr(rnd(i ? 1 - a : a, 2)), { fill: VIO }); });
      ys.forEach((y, j) => { const i = Math.floor(j / 2); s += `<line x1="220" y1="${y1[i]}" x2="380" y2="${y}" stroke="${j % 2 ? '#1D2240' : RED}" stroke-width="${j % 2 ? 2 : 3}"/>` + T(300, (y1[i] + y) / 2 - 6, fr(rnd([b, 1 - b, c, 1 - c][j], 2)), { fill: VIO }) + `<circle cx="396" cy="${y}" r="15" fill="#EEE3FB" stroke="#7438C0" stroke-width="2"/>` + T(396, y + 5, j % 2 ? 'R̄' : 'R') + T(430, y + 5, '→ ' + fr(rnd(leaf[j], 4)), { a: 'start' }); });
      y1.forEach((y, i) => { s += `<circle cx="210" cy="${y}" r="15" fill="#EEE3FB" stroke="#7438C0" stroke-width="2"/>` + T(210, y + 5, i ? 'M' : 'D'); });
      el.querySelector('#c6-g').innerHTML = `<svg viewBox="0 0 600 280" class="pic vis" role="img" aria-label="Arbre pondéré">${s}</svg>`;
      el.querySelector('#c6-k').innerHTML = kpi('P(R)', fr(rnd(pR, 4))) + kpi('P sachant R de D', pR ? fr(rnd(a * b / pR, 4)) : '—') + kpi('P(D) × P(R)', fr(rnd(a * pR, 4))) + kpi('P(D ∩ R)', fr(rnd(a * b, 4))) + kpi('Indépendants ?', Math.abs(a * b - a * pR) < 1e-9 ? 'oui' : 'non');
      setDefi(el, 'c6-d', Math.abs(a - .6) < 1e-9 && Math.abs(b - c) < 1e-9);
      el.querySelector('#c6-sim').textContent = '';
    };
    el.addEventListener('input', up);
    el.addEventListener('click', e => { if (!e.target.closest('[data-c6sim]')) return; const a = val(el, 'c6-a'), b = val(el, 'c6-b'), c = val(el, 'c6-c'); let r = 0; for (let k = 0; k < 1000; k++) { const D = Math.random() < a; if (Math.random() < (D ? b : c)) r++; } el.querySelector('#c6-sim').textContent = `${r} retours sur 1 000 : fréquence ${fr(r / 1000)} (probabilité ${fr(rnd(a * b + (1 - a) * c, 4))})`; });
    up();
  };

  /* ---------------- 7 · le nombre e et la croissance continue ---------------- */
  W.c7 = el => {
    el.innerHTML = box('Le nombre e et la croissance continue', 'Augmente le nombre de versements par an : (1 + 1/n)ⁿ se rapproche de e. Puis choisis un taux continu k : le temps de doublement vaut ln(2) ÷ k.',
      `<div class="wg-grid">${slider('c7-n', 'Versements par an n', 1, 365, 1, 12)}${slider('c7-k', 'Taux continu k', .5, 15, .1, 5, '%')}</div>
      <div class="wg-svg" id="c7-g"></div><div class="wg-kpis" id="c7-k2"></div>${defi('c7-d', 'Trouve le taux continu k qui fait doubler un capital en <b>10 ans</b> (au dixième de %).')}`);
    const up = () => {
      out(el, ['c7-n', 'c7-k'], { 'c7-k': 1 });
      const n = val(el, 'c7-n'), k = val(el, 'c7-k') / 100, v = Math.pow(1 + 1 / n, n), td = Math.log(2) / k, X = Math.min(140, Math.max(10, Math.ceil(td * 1.3 / 10) * 10));
      const g = P.plot({ W: 600, H: 260, x: [0, X, X / 5], y: [0, 3, .5], ml: 46, mt: 16, xl: 'années', yl: 'coefficient', lab: 'Coefficient e puissance kt' });
      el.querySelector('#c7-g').innerHTML = g.wrap(g.base + g.curve(t => Math.exp(k * t), { stroke: GRN, w: 3 }) + g.seg(0, 2, X, 2, { stroke: RED, dash: '7 5', w: 2 }) + (td <= X ? g.guide(td, 2) + g.dot(td, 2, { r: 6, fill: '#FFC233', lab: 't ≈ ' + fr(rnd(td, 2)), dx: 10, dy: 22 }) : ''));
      el.querySelector('#c7-k2').innerHTML = kpi('(1 + 1/n)ⁿ', fr(rnd(v, 5))) + kpi('e', '2,71828…') + kpi('écart avec e', fr(rnd(Math.E - v, 5))) + kpi('doublement ln 2 ÷ k', fr(rnd(td, 2)) + ' ans');
      setDefi(el, 'c7-d', Math.abs(td - 10) < .15);
    };
    el.addEventListener('input', up); up();
  };

  window.MCVW = W;
})();
