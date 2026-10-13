/* Maths et MCV · 2de — onglet « Manipuler » : un simulateur par chapitre.
   Tout se calcule dans le navigateur ; rien n’est envoyé ni enregistré. */
(function () {
  'use strict';
  const M = window.MCVG, fr = M.fr, rnd = M.rnd;
  const eur = x => fr(x, 2) + ' €', pct = (x, d = 1) => fr(rnd(x, d)) + ' %';
  const h = (tag, attrs = '', inner = '') => `<${tag} ${attrs}>${inner}</${tag}>`;
  const num = (v, d = 2) => fr(rnd(v, d));
  const parseNum = s => { const v = parseFloat(String(s).replace(/\s/g, '').replace(',', '.')); return Number.isFinite(v) ? v : NaN; };
  const slider = (id, lab, min, max, step, val, unit = '') => `<label class="wg-sl"><span>${lab}</span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"><output for="${id}" id="${id}-o"></output>${unit ? `<small>${unit}</small>` : ''}</label>`;
  const box = (title, intro, body) => `<section class="wg"><h2 class="wg-t">🎛️ ${title}</h2><p class="wg-i">${intro}</p>${body}</section>`;
  const defi = (id, txt) => `<p class="wg-defi" id="${id}"><span class="wg-dk">🎯 Défi</span> ${txt} <b class="wg-ok" hidden>✅ Réussi !</b></p>`;
  const setDefi = (el, id, ok) => { const d = el.querySelector('#' + id); if (!d) return; d.classList.toggle('done', !!ok); d.querySelector('.wg-ok').hidden = !ok; };
  const W = {};

  /* ---------------- 1 · prix, marges, TVA ---------------- */
  W.c1 = el => {
    el.innerHTML = box('Le simulateur d’étiquette', 'Changez le coût d’achat, le prix affiché, la TVA ou la remise : tout se recalcule, et la barre montre ce que contient le prix payé par le client.',
      `<div class="wg-grid">${slider('c1-cout', 'Coût d’achat HT', 5, 150, .5, 40, '€')}${slider('c1-ttc', 'Prix affiché TTC', 10, 250, .1, 89.9, '€')}<label class="wg-sl"><span>TVA</span><select id="c1-tva"><option value="20" selected>20 %</option><option value="10">10 %</option><option value="5.5">5,5 %</option><option value="2.1">2,1 %</option></select></label>${slider('c1-rem', 'Remise', 0, 70, 1, 25, '%')}</div>
      <div class="wg-bars" id="c1-bars"></div><div class="wg-calc" id="c1-calc"></div>${defi('c1-d', 'Trouvez la plus forte remise qui garde un <b>taux de marque d’au moins 30 %</b> après la remise.')}`);
    const $ = s => el.querySelector(s);
    const bar = (lab, parts, tot) => `<div class="wg-bar"><span class="wg-bl">${lab}</span><div class="wg-bt">${parts.map(p => `<i style="width:${Math.max(0, p[1] / tot * 100)}%;background:${p[2]};color:${p[2] === 'var(--cc)' ? '#fff' : '#1D2240'}" title="${p[0]}">${p[1] / tot > .12 ? `${p[0]}<b>${eur(p[1])}</b>` : ''}</i>`).join('')}</div></div>`;
    const up = () => {
      const c = +$('#c1-cout').value, ttc = +$('#c1-ttc').value, t = +$('#c1-tva').value / 100, r = +$('#c1-rem').value / 100;
      ['cout', 'ttc', 'rem'].forEach(k => { $(`#c1-${k}-o`).textContent = k === 'rem' ? fr(+$(`#c1-${k}`).value) : fr(+$(`#c1-${k}`).value, k === 'ttc' ? 2 : 2); });
      const ht = rnd(ttc / (1 + t)), mg = rnd(ht - c), so = rnd(ttc * (1 - r)), sht = rnd(so / (1 + t)), smg = rnd(sht - c), tq = smg / sht * 100;
      $('#c1-bars').innerHTML = bar('Prix affiché', [['coût', c, '#9DB9EA'], ['marge', Math.max(0, mg), 'var(--cc)'], ['TVA', ttc - ht, '#FFC233']], ttc) + bar('Après remise', [['coût', Math.min(c, sht), '#9DB9EA'], ['marge', Math.max(0, smg), 'var(--cc)'], ['TVA', so - sht, '#FFC233']], ttc);
      $('#c1-calc').innerHTML = `<p>Prix HT = ${fr(ttc, 2)} ÷ ${fr(1 + t)} = <b>${eur(ht)}</b> ; TVA = <b>${eur(rnd(ttc - ht))}</b></p><p>Marge = ${fr(ht, 2)} − ${fr(c, 2)} = <b class="${mg < 0 ? 'neg' : ''}">${eur(mg)}</b> ; taux de marque = <b>${pct(mg / ht * 100)}</b> ; taux de marge = <b>${c > 0 ? pct(mg / c * 100) : '—'}</b></p><p>Remise de ${fr(r * 100)} % : coefficient ${fr(1 - r)} → prix soldé <b>${eur(so)}</b> TTC, soit <b>${eur(sht)}</b> HT</p><p>Marge après remise : <b class="${smg < 0 ? 'neg' : ''}">${eur(smg)}</b> ; taux de marque : <b class="${tq < 30 ? 'neg' : 'pos'}">${pct(tq)}</b>${smg < 0 ? ' ⚠️ on vend à perte !' : ''}</p>`;
      const rr = Math.round(r * 100), nxt = rnd(rnd(ttc * (1 - (rr + 1) / 100)) / (1 + t)); setDefi(el, 'c1-d', tq >= 30 && ((nxt - c) / nxt * 100 < 30));
    };
    el.addEventListener('input', up); up();
  };

  /* ---------------- 2 · statistique ---------------- */
  W.c2 = el => {
    el.innerHTML = box('La série en direct', 'Tapez des montants de paniers (séparés par des espaces ou des points-virgules). Les indicateurs et la boîte à moustaches se mettent à jour.',
      `<label class="wg-ta"><span>Valeurs</span><textarea id="c2-v" rows="2">25 18 41 12 30 22 58 15 27 34 18</textarea></label><p class="wg-btns"><button class="btn sm ghost" data-c2="big">+ un panier de 200 €</button><button class="btn sm ghost" data-c2="pop">Retirer la dernière valeur</button><button class="btn sm ghost" data-c2="rand">🎲 Série au hasard</button></p>
      <div id="c2-sorted" class="wg-chips"></div><div class="wg-kpis" id="c2-k"></div><div id="c2-svg" class="wg-svg"></div><p class="wg-note" id="c2-n"></p>`);
    const $ = s => el.querySelector(s), ta = $('#c2-v');
    const up = () => {
      const v = ta.value.split(/[\s;]+/).map(parseNum).filter(Number.isFinite);
      if (v.length < 2) { $('#c2-k').innerHTML = '<p>Il faut au moins deux valeurs.</p>'; $('#c2-svg').innerHTML = ''; return; }
      const s = v.slice().sort((a, b) => a - b), N = s.length, mean = s.reduce((a, b) => a + b, 0) / N;
      const med = N % 2 ? s[(N - 1) / 2] : (s[N / 2 - 1] + s[N / 2]) / 2, q1 = s[Math.ceil(N / 4) - 1], q3 = s[Math.ceil(3 * N / 4) - 1];
      const sd = Math.sqrt(s.reduce((a, x) => a + (x - mean) ** 2, 0) / N), mn = s[0], mx = s[N - 1];
      $('#c2-sorted').innerHTML = s.map((x, i) => `<span class="${i === Math.ceil(N / 4) - 1 ? 'q' : ''}${i === Math.ceil(3 * N / 4) - 1 ? ' q' : ''}${(N % 2 && i === (N - 1) / 2) || (!(N % 2) && (i === N / 2 - 1 || i === N / 2)) ? ' me' : ''}">${fr(x)}</span>`).join('');
      const k = [['N', N], ['Moyenne', num(mean, 2)], ['Médiane', num(med, 2)], ['Q₁', num(q1)], ['Q₃', num(q3)], ['Étendue', num(mx - mn)], ['Q₃ − Q₁', num(q3 - q1)], ['Écart type σ', num(sd, 2)]];
      $('#c2-k').innerHTML = k.map(([a, b]) => `<div><small>${a}</small><b>${b}</b></div>`).join('');
      const Wd = 600, X = x => 30 + (x - mn) / ((mx - mn) || 1) * (Wd - 60);
      let g = `<svg viewBox="0 0 ${Wd} 150" class="wg-chart" role="img" aria-label="Boîte à moustaches">`;
      s.forEach((x, i) => { const same = s.slice(0, i).filter(y => y === x).length; g += `<circle cx="${X(x)}" cy="${40 - same * 9}" r="4.5" fill="var(--cc)" opacity=".75"/>`; });
      g += `<line x1="${X(mn)}" x2="${X(q1)}" y1="95" y2="95" stroke="#1D2240" stroke-width="2"/><line x1="${X(q3)}" x2="${X(mx)}" y1="95" y2="95" stroke="#1D2240" stroke-width="2"/><rect x="${X(q1)}" y="78" width="${Math.max(1, X(q3) - X(q1))}" height="34" fill="var(--tt)" stroke="var(--cc)" stroke-width="2.4" rx="3"/><line x1="${X(med)}" x2="${X(med)}" y1="78" y2="112" stroke="var(--cc)" stroke-width="4"/><line x1="${X(mean)}" x2="${X(mean)}" y1="66" y2="124" stroke="#C2332A" stroke-width="2" stroke-dasharray="4 3"/>`;
      g += `<text x="${X(mean)}" y="140" font-size="12" fill="#C2332A" text-anchor="middle" font-weight="700">moyenne</text><text x="${X(med)}" y="72" font-size="12" fill="var(--cc)" text-anchor="middle" font-weight="700">médiane</text>`;
      g += `<text x="${X(mn)}" y="140" font-size="11" text-anchor="middle">${fr(mn)}</text><text x="${X(mx)}" y="140" font-size="11" text-anchor="middle">${fr(mx)}</text></svg>`;
      $('#c2-svg').innerHTML = g;
      $('#c2-n').innerHTML = Math.abs(mean - med) > .15 * (mx - mn) ? '💡 La moyenne s’éloigne de la médiane : une valeur extrême tire la moyenne, pas la médiane.' : '💡 Moyenne et médiane sont proches : pas de valeur extrême qui déséquilibre la série.';
    };
    el.addEventListener('input', up);
    el.addEventListener('click', e => { const b = e.target.closest('[data-c2]'); if (!b) return; const a = b.dataset.c2;
      if (a === 'big') ta.value += ' 200'; if (a === 'pop') ta.value = ta.value.trim().split(/[\s;]+/).slice(0, -1).join(' ');
      if (a === 'rand') ta.value = Array.from({ length: 9 + Math.floor(Math.random() * 6) }, () => 10 + Math.floor(Math.random() * 50)).join(' '); up(); });
    up();
  };

  /* ---------------- 3 · premier degré ---------------- */
  W.c3 = el => {
    let E = null, solved = 0;
    el.innerHTML = box('Résoudre pas à pas', 'Choisissez la bonne opération à faire <b>des deux côtés</b> : la balance reste en équilibre jusqu’à x = … Pour une inéquation, attention au sens quand on divise par un nombre négatif !',
      `<p class="wg-btns"><button class="btn sm" data-c3="eq">Nouvelle équation</button><button class="btn sm ghost" data-c3="in">Nouvelle inéquation</button><span class="wg-score" id="c3-s"></span></p><div class="wg-eq" id="c3-eq"></div><div class="wg-btns" id="c3-ops"></div><p class="wg-note" id="c3-n"></p><ol class="wg-steps" id="c3-st"></ol>`);
    const $ = s => el.querySelector(s);
    const sgn = (b) => b < 0 ? `− ${fr(-b)}` : `+ ${fr(b)}`;
    const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    const nouveau = ineq => { let a = 0; while (!a) a = ri(-5, 9); if (!ineq && a < 0) a = -a; if (a === 1) a = 2; const x = ri(-6, 12), b = ri(-15, 15) || 4; const sign = ineq ? ['<', '≤', '>', '≥'][ri(0, 3)] : '=';
      E = { a, b, c: a * x + b, x, sign, step: 0, ineq }; $('#c3-st').innerHTML = ''; $('#c3-n').textContent = ''; draw(); };
    const flip = s => ({ '<': '>', '>': '<', '≤': '≥', '≥': '≤', '=': '=' })[s];
    const draw = () => {
      const { a, b, c, sign, step } = E; let L, Rr;
      if (step === 0) { L = `${a === -1 ? '−' : fr(a)}x ${sgn(b)}`; Rr = fr(c); }
      else if (step === 1) { L = `${a === -1 ? '−' : fr(a)}x`; Rr = fr(c - b); }
      else { L = 'x'; Rr = fr((c - b) / a); }
      $('#c3-eq').innerHTML = `<div class="wg-bal ${step === 2 ? 'ok' : ''}"><span class="pl">${L}</span><span class="sg">${E.cur || sign}</span><span class="pl">${Rr}</span></div>`;
      $('#c3-ops').innerHTML = step === 0 ? `<button class="btn sm" data-op="sub">${b > 0 ? `Soustraire ${fr(b)}` : `Ajouter ${fr(-b)}`} des deux côtés</button><button class="btn sm ghost" data-op="div">Diviser par ${fr(a)} des deux côtés</button>` : step === 1 ? `<button class="btn sm" data-op="div">Diviser par ${fr(a)} des deux côtés</button><button class="btn sm ghost" data-op="sub2">Soustraire ${fr(a)}</button>` : `<button class="btn sm ghost" data-op="check">✅ Vérifier en remplaçant</button>`;
      $('#c3-s').textContent = solved ? `${solved} résolue${solved > 1 ? 's' : ''} ✨` : '';
    };
    const log = t => { $('#c3-st').insertAdjacentHTML('beforeend', `<li>${t}</li>`); };
    el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.c3) return nouveau(b.dataset.c3 === 'in');
      const op = b.dataset.op; if (!op || !E) return; E.cur = E.cur || E.sign;
      if (op === 'sub' && E.step === 0) { log(`${E.b > 0 ? '− ' + fr(E.b) : '+ ' + fr(-E.b)} des deux côtés : ${fr(E.a)}x ${E.cur} ${fr(E.c - E.b)}`); E.step = 1; $('#c3-n').textContent = '👍 Bien : on isole d’abord le terme en x.'; }
      else if (op === 'div' && E.step === 0) { $('#c3-n').textContent = '🤔 Possible, mais on obtient des fractions : retirez d’abord le nombre seul.'; return; }
      else if (op === 'div' && E.step === 1) { const neg = E.a < 0; if (neg && E.ineq) E.cur = flip(E.cur); log(`÷ ${fr(E.a)} des deux côtés${neg && E.ineq ? ' (nombre négatif : <b>le sens change</b>)' : ''} : x ${E.cur} ${fr((E.c - E.b) / E.a)}`); E.step = 2; solved++; $('#c3-n').innerHTML = E.ineq ? `🎉 Solutions : tous les nombres x ${E.cur} ${fr((E.c - E.b) / E.a)}.` : `🎉 Solution : x = ${fr(E.x)}.`; }
      else if (op === 'sub2') { $('#c3-n').textContent = '❌ Non : ' + fr(E.a) + 'x veut dire ' + fr(E.a) + ' × x. Le contraire d’une multiplication, c’est une division.'; return; }
      else if (op === 'check') { const v = (E.c - E.b) / E.a; $('#c3-n').innerHTML = E.ineq ? `Test avec x = ${fr(v + (/[>≥]/.test(E.cur) ? 1 : -1))} : ${fr(E.a)} × ${fr(v + (/[>≥]/.test(E.cur) ? 1 : -1))} ${sgn(E.b)} = ${fr(E.a * (v + (/[>≥]/.test(E.cur) ? 1 : -1)) + E.b)} ${E.sign} ${fr(E.c)} ✓` : `${fr(E.a)} × ${fr(v)} ${sgn(E.b)} = ${fr(E.a * v + E.b)} ✓`; return; }
      draw(); });
    nouveau(false);
  };

  /* ---------------- 4 · facture et intérêts ---------------- */
  W.c4 = el => {
    const L0 = [['Classeurs', 40, 3.2], ['Ramettes de papier', 25, 4.8], ['Stylos (boîte)', 10, 6.5]];
    el.innerHTML = box('La facture et le placement', 'Modifiez les quantités, les prix et la remise : la facture se calcule ligne par ligne. Puis faites varier un placement à intérêts simples.',
      `<div class="wg-fac"><table class="wg-t"><thead><tr><th>Désignation</th><th>Qté</th><th>P.U. HT (€)</th><th>Montant HT</th></tr></thead><tbody>${L0.map((l, i) => `<tr><td>${l[0]}</td><td><input type="number" min="0" step="1" value="${l[1]}" data-q="${i}" inputmode="numeric"></td><td><input type="number" min="0" step="0.01" value="${l[2]}" data-p="${i}" inputmode="decimal"></td><td id="c4-l${i}"></td></tr>`).join('')}</tbody></table>
      <div class="wg-grid">${slider('c4-rem', 'Remise', 0, 20, 1, 5, '%')}${slider('c4-port', 'Frais de port HT', 0, 40, 1, 15, '€')}<label class="wg-sl"><span>TVA</span><select id="c4-tva"><option value="20">20 %</option><option value="10">10 %</option><option value="5.5">5,5 %</option></select></label></div><div class="wg-calc" id="c4-f"></div></div>
      <h3 class="wg-h3">💶 Placement à intérêts simples</h3><div class="wg-grid">${slider('c4-C', 'Capital', 500, 20000, 100, 12000, '€')}${slider('c4-t', 'Taux annuel', .5, 5, .1, 2.5, '%')}${slider('c4-n', 'Durée', 1, 60, 1, 9, 'mois')}</div><div class="wg-calc" id="c4-i"></div><div id="c4-g" class="wg-svg"></div>${defi('c4-d', 'Réglez la durée pour obtenir <b>au moins 400 €</b> d’intérêts avec 12 000 € à 2,5 %.')}`);
    const $ = s => el.querySelector(s);
    const up = () => {
      let brut = 0; L0.forEach((l, i) => { const q = parseNum($(`[data-q="${i}"]`).value) || 0, p = parseNum($(`[data-p="${i}"]`).value) || 0, m = rnd(q * p); brut += m; $('#c4-l' + i).textContent = eur(m); });
      brut = rnd(brut); const r = +$('#c4-rem').value, port = +$('#c4-port').value, t = +$('#c4-tva').value; $('#c4-rem-o').textContent = r; $('#c4-port-o').textContent = port;
      const rem = rnd(brut * r / 100), net = rnd(brut - rem), tht = rnd(net + port), tva = rnd(tht * t / 100), ttc = rnd(tht + tva);
      $('#c4-f').innerHTML = `<p>Montant brut HT : <b>${eur(brut)}</b></p><p>− remise ${r} % : ${eur(rem)} → net commercial HT : <b>${eur(net)}</b></p><p>+ port : ${eur(port)} → total HT : <b>${eur(tht)}</b></p><p>+ TVA ${fr(t)} % : ${eur(tva)} → <b class="big2">net à payer : ${eur(ttc)}</b></p>`;
      const C = +$('#c4-C').value, tx = +$('#c4-t').value, n = +$('#c4-n').value; $('#c4-C-o').textContent = fr(C); $('#c4-t-o').textContent = fr(tx); $('#c4-n-o').textContent = n;
      const I = rnd(C * tx / 100 * n / 12);
      $('#c4-i').innerHTML = `<p>I = C × t × n = ${fr(C)} × ${fr(tx / 100)} × ${n}/12 = <b>${eur(I)}</b> ; valeur acquise : <b>${eur(C + I)}</b></p>`;
      const Wd = 600, Hh = 170, maxI = C * tx / 100 * 5, X = m => 40 + m / 60 * (Wd - 60), Y = v => Hh - 25 - v / (maxI || 1) * (Hh - 40);
      $('#c4-g').innerHTML = `<svg viewBox="0 0 ${Wd} ${Hh}" class="wg-chart"><line x1="40" x2="${Wd - 20}" y1="${Hh - 25}" y2="${Hh - 25}" stroke="#1D2240"/><line x1="40" x2="40" y1="10" y2="${Hh - 25}" stroke="#1D2240"/><line x1="${X(0)}" y1="${Y(0)}" x2="${X(60)}" y2="${Y(maxI)}" stroke="var(--cc)" stroke-width="3"/><circle cx="${X(n)}" cy="${Y(I)}" r="7" fill="#FFC233" stroke="#1D2240"/><line x1="${X(n)}" x2="${X(n)}" y1="${Y(I)}" y2="${Hh - 25}" stroke="#1D2240" stroke-dasharray="4 3"/><text x="${X(n)}" y="${Hh - 8}" font-size="12" text-anchor="middle">${n} mois</text><text x="${X(n) + 10}" y="${Y(I) - 8}" font-size="13" font-weight="700">${eur(I)}</text><text x="${Wd - 20}" y="${Hh - 30}" font-size="11" text-anchor="end">durée (mois)</text><text x="46" y="20" font-size="11">intérêts (€)</text></svg>`;
      setDefi(el, 'c4-d', C === 12000 && Math.abs(tx - 2.5) < 1e-9 && I >= 400 && rnd(C * tx / 100 * (n - 1) / 12) < 400);
    };
    el.addEventListener('input', up); up();
  };

  /* ---------------- 5 · fonctions ---------------- */
  W.c5 = el => {
    let mode = 'aff';
    el.innerHTML = box('Droites et paraboles', 'Faites varier les paramètres : la courbe bouge en direct. Le point jaune montre l’image d’un nombre x.',
      `<p class="wg-btns"><button class="btn sm" data-c5="aff">f(x) = ax + b</button><button class="btn sm ghost" data-c5="car">f(x) = kx² + c</button></p><div class="wg-grid" id="c5-s"></div><div id="c5-g" class="wg-svg"></div><div class="wg-calc" id="c5-c"></div>${defi('c5-d', 'Mode droite : réglez a et b pour que la droite passe par <b>A(0 ; 1)</b> et <b>B(2 ; 5)</b>.')}`);
    const $ = s => el.querySelector(s);
    const sliders = () => { $('#c5-s').innerHTML = mode === 'aff' ? slider('c5-a', 'a', -3, 3, .1, .5) + slider('c5-b', 'b', -8, 8, .5, 2) + slider('c5-x', 'x', -8, 8, .5, 3) : slider('c5-a', 'k', -2, 2, .1, .5) + slider('c5-b', 'c', -8, 8, .5, 0) + slider('c5-x', 'x', -6, 6, .5, 2);
      el.querySelectorAll('[data-c5]').forEach(b => b.classList.toggle('ghost', b.dataset.c5 !== mode)); };
    const up = () => {
      const a = +$('#c5-a').value, b = +$('#c5-b').value, x0 = +$('#c5-x').value; ['a', 'b', 'x'].forEach(k => $(`#c5-${k}-o`).textContent = fr(+$(`#c5-${k}`).value));
      const f = mode === 'aff' ? x => a * x + b : x => a * x * x + b, Wd = 600, Hh = 360, S = 10, X = x => Wd / 2 + x / S * (Wd / 2 - 20), Y = y => Hh / 2 - y / S * (Hh / 2 - 15);
      let g = `<svg viewBox="0 0 ${Wd} ${Hh}" class="wg-chart" role="img" aria-label="Courbe">`;
      for (let i = -S; i <= S; i += 2) g += `<line x1="${X(i)}" x2="${X(i)}" y1="${Y(S)}" y2="${Y(-S)}" stroke="#E1E6F5"/><line x1="${X(-S)}" x2="${X(S)}" y1="${Y(i)}" y2="${Y(i)}" stroke="#E1E6F5"/>` + (i ? `<text x="${X(i)}" y="${Y(0) + 14}" font-size="10" text-anchor="middle" fill="#545B7A">${i}</text><text x="${X(0) - 5}" y="${Y(i) + 4}" font-size="10" text-anchor="end" fill="#545B7A">${i}</text>` : '');
      g += `<line x1="${X(-S)}" x2="${X(S)}" y1="${Y(0)}" y2="${Y(0)}" stroke="#1D2240" stroke-width="1.6"/><line x1="${X(0)}" x2="${X(0)}" y1="${Y(S)}" y2="${Y(-S)}" stroke="#1D2240" stroke-width="1.6"/>`;
      let d = '', pen = false; for (let i = 0; i <= 240; i++) { const x = -S + 2 * S * i / 240, y = f(x); if (Math.abs(y) > S * 1.15) { pen = false; continue; } d += (pen ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(y).toFixed(1); pen = true; }
      g += `<path d="${d}" fill="none" stroke="var(--cc)" stroke-width="3.4"/>`;
      const y0 = f(x0); if (Math.abs(y0) <= S) g += `<line x1="${X(x0)}" x2="${X(x0)}" y1="${Y(0)}" y2="${Y(y0)}" stroke="#1D2240" stroke-dasharray="4 3"/><line x1="${X(0)}" x2="${X(x0)}" y1="${Y(y0)}" y2="${Y(y0)}" stroke="#1D2240" stroke-dasharray="4 3"/><circle cx="${X(x0)}" cy="${Y(y0)}" r="7" fill="#FFC233" stroke="#1D2240"/>`;
      if (mode === 'aff') g += `<circle cx="${X(0)}" cy="${Y(1)}" r="5" fill="#1D2240"/><text x="${X(0) + 8}" y="${Y(1) - 6}" font-size="12" font-weight="700">A</text><circle cx="${X(2)}" cy="${Y(5)}" r="5" fill="#1D2240"/><text x="${X(2) + 8}" y="${Y(5) - 6}" font-size="12" font-weight="700">B</text>`;
      $('#c5-g').innerHTML = g + '</svg>';
      const ex = mode === 'aff' ? `f(x) = ${fr(a)}x ${b < 0 ? '−' : '+'} ${fr(Math.abs(b))}` : `f(x) = ${fr(a)}x² ${b < 0 ? '−' : '+'} ${fr(Math.abs(b))}`;
      const sens = mode === 'aff' ? (a > 0 ? 'croissante (a > 0)' : a < 0 ? 'décroissante (a < 0)' : 'constante (a = 0)') : (a > 0 ? 'décroissante puis croissante : minimum ' + fr(b) + ' en x = 0' : a < 0 ? 'croissante puis décroissante : maximum ' + fr(b) + ' en x = 0' : 'constante');
      $('#c5-c').innerHTML = `<p><b>${ex}</b> ; image de ${fr(x0)} : f(${fr(x0)}) = <b>${fr(rnd(y0, 2))}</b></p><p>Fonction ${sens}.${mode === 'aff' && b === 0 ? ' b = 0 : fonction linéaire, situation de proportionnalité.' : ''}</p>`;
      setDefi(el, 'c5-d', mode === 'aff' && Math.abs(a - 2) < 1e-9 && Math.abs(b - 1) < 1e-9);
    };
    el.addEventListener('input', up);
    el.addEventListener('click', e => { const b = e.target.closest('[data-c5]'); if (!b) return; mode = b.dataset.c5; sliders(); up(); });
    sliders(); up();
  };

  /* ---------------- 6 · fluctuation et probabilités ---------------- */
  W.c6 = el => {
    const EXP = { de: ['Lancer un dé : obtenir 6', 1 / 6], piece: ['Lancer une pièce : pile', 1 / 2], roue: ['Roue de 12 secteurs : panier garni', 1 / 12], urne: ['Urne : 10 tickets gagnants sur 50', .2] };
    let k = 'de', n = 0, s = 0, hist = [];
    el.innerHTML = box('Le simulateur de jeu', 'Lancez l’expérience 1, 10, 100 ou 1 000 fois : la fréquence des succès fluctue beaucoup au début, puis se stabilise près de la probabilité.',
      `<label class="wg-sl"><span>Expérience</span><select id="c6-e">${Object.entries(EXP).map(([a, b]) => `<option value="${a}">${b[0]}</option>`).join('')}</select></label><p class="wg-btns">${[1, 10, 100, 1000].map(m => `<button class="btn sm" data-n="${m}">+ ${fr(m)}</button>`).join('')}<button class="btn sm ghost" data-n="0">Recommencer</button></p><div class="wg-kpis" id="c6-k"></div><div id="c6-g" class="wg-svg"></div>
      <h3 class="wg-h3">📦 50 échantillons de même taille</h3><div class="wg-grid">${slider('c6-t', 'Taille des échantillons', 10, 500, 10, 50)}</div><p class="wg-btns"><button class="btn sm ghost" data-ech>Tirer 50 échantillons</button></p><div id="c6-f" class="wg-svg"></div><p class="wg-note" id="c6-fn"></p>`);
    const $ = s2 => el.querySelector(s2);
    const up = () => {
      const p = EXP[k][1], f = n ? s / n : 0;
      $('#c6-k').innerHTML = `<div><small>Lancers</small><b>${fr(n)}</b></div><div><small>Succès</small><b>${fr(s)}</b></div><div><small>Fréquence</small><b>${n ? fr(rnd(f, 3)) : '—'}</b></div><div><small>Probabilité</small><b>${fr(rnd(p, 3))}</b></div>`;
      const Wd = 600, Hh = 220, X = i => 40 + i / Math.max(10, hist.length - 1) * (Wd - 60), Y = v => Hh - 25 - v * (Hh - 40);
      let g = `<svg viewBox="0 0 ${Wd} ${Hh}" class="wg-chart"><line x1="40" x2="${Wd - 20}" y1="${Y(0)}" y2="${Y(0)}" stroke="#1D2240"/><line x1="40" x2="40" y1="${Y(1)}" y2="${Y(0)}" stroke="#1D2240"/>${[0, .25, .5, .75, 1].map(v => `<text x="34" y="${Y(v) + 4}" font-size="10" text-anchor="end" fill="#545B7A">${fr(v)}</text><line x1="40" x2="${Wd - 20}" y1="${Y(v)}" y2="${Y(v)}" stroke="#EEF0F7"/>`).join('')}<line x1="40" x2="${Wd - 20}" y1="${Y(p)}" y2="${Y(p)}" stroke="#C2332A" stroke-dasharray="6 4" stroke-width="2"/><text x="${Wd - 22}" y="${Y(p) - 6}" font-size="11" text-anchor="end" fill="#C2332A" font-weight="700">probabilité ${fr(rnd(p, 3))}</text>`;
      if (hist.length > 1) g += `<polyline fill="none" stroke="var(--cc)" stroke-width="2.4" points="${hist.map((v, i) => X(i).toFixed(1) + ',' + Y(v).toFixed(1)).join(' ')}"/>`;
      $('#c6-g').innerHTML = g + `<text x="${Wd - 20}" y="${Hh - 6}" font-size="11" text-anchor="end">nombre de lancers : ${fr(n)}</text></svg>`;
    };
    const play = m => { const p = EXP[k][1]; for (let i = 0; i < m; i++) { n++; if (Math.random() < p) s++; if (n <= 50 || n % Math.ceil(n / 200) === 0) hist.push(s / n); } up(); };
    el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.n != null) { const m = +b.dataset.n; if (!m) { n = 0; s = 0; hist = []; up(); } else play(m); }
      if (b.hasAttribute('data-ech')) { const t = +$('#c6-t').value, p = EXP[k][1], fs = Array.from({ length: 50 }, () => { let c = 0; for (let i = 0; i < t; i++) if (Math.random() < p) c++; return c / t; });
        const mn = Math.min(...fs), mx = Math.max(...fs), Wd = 600, X = v => 30 + v * (Wd - 60);
        $('#c6-f').innerHTML = `<svg viewBox="0 0 ${Wd} 120" class="wg-chart"><line x1="30" x2="${Wd - 30}" y1="80" y2="80" stroke="#1D2240"/>${[0, .25, .5, .75, 1].map(v => `<text x="${X(v)}" y="98" font-size="10" text-anchor="middle">${fr(v)}</text>`).join('')}<rect x="${X(mn)}" y="30" width="${X(mx) - X(mn)}" height="44" fill="var(--tt)"/>${fs.map((v, i) => `<circle cx="${X(v)}" cy="${36 + (i % 8) * 5}" r="3.4" fill="var(--cc)" opacity=".8"/>`).join('')}<line x1="${X(p)}" x2="${X(p)}" y1="20" y2="84" stroke="#C2332A" stroke-width="2" stroke-dasharray="5 3"/></svg>`;
        $('#c6-fn').innerHTML = `Étendue des 50 fréquences : <b>${fr(rnd(mx - mn, 3))}</b> (de ${fr(rnd(mn, 3))} à ${fr(rnd(mx, 3))}). Plus les échantillons sont grands, plus les fréquences se resserrent autour de la probabilité.`; }
    });
    el.addEventListener('input', e => { if (e.target.id === 'c6-e') { k = e.target.value; n = 0; s = 0; hist = []; up(); } if (e.target.id === 'c6-t') $('#c6-t-o').textContent = e.target.value; });
    $('#c6-t-o').textContent = 50; up();
  };

  /* ---------------- 7 · géométrie ---------------- */
  W.c7 = el => {
    el.innerHTML = box('Agrandir, réduire, Pythagore', 'Faites varier le rapport k : les longueurs sont multipliées par k, les aires par k², les volumes par k³. Puis construisez un triangle rectangle.',
      `<div class="wg-grid">${slider('c7-k', 'Rapport k', .25, 3, .25, 2)}</div><div id="c7-g" class="wg-svg"></div><div class="wg-calc" id="c7-c"></div>${defi('c7-d', 'Trouvez k pour que <b>l’aire soit multipliée par 4</b>.')}
      <h3 class="wg-h3">📐 Triangle rectangle</h3><div class="wg-grid">${slider('c7-a', 'Côté a', 1, 12, .5, 3, 'cm')}${slider('c7-b', 'Côté b', 1, 12, .5, 4, 'cm')}</div><div id="c7-p" class="wg-svg"></div><div class="wg-calc" id="c7-pc"></div>`);
    const $ = s => el.querySelector(s);
    const up = () => {
      const k = +$('#c7-k').value; $('#c7-k-o').textContent = fr(k);
      const L = 4, l = 3, h0 = 2, sc = 34, Wd = 600, Hh = 230;
      $('#c7-g').innerHTML = `<svg viewBox="0 0 ${Wd} ${Hh}" class="wg-chart"><rect x="20" y="${Hh - 20 - l * sc}" width="${L * sc}" height="${l * sc}" fill="var(--tt)" stroke="var(--cc)" stroke-width="2"/><text x="${20 + L * sc / 2}" y="${Hh - 6}" font-size="12" text-anchor="middle">4 cm × 3 cm</text><rect x="200" y="${Hh - 20 - Math.min(l * k * sc, Hh - 30)}" width="${Math.min(L * k * sc, Wd - 210)}" height="${Math.min(l * k * sc, Hh - 30)}" fill="var(--cc)" opacity=".75" stroke="#1D2240" stroke-width="2"/><text x="${200 + Math.min(L * k * sc, Wd - 210) / 2}" y="${Hh - 6}" font-size="12" text-anchor="middle">${fr(L * k)} cm × ${fr(l * k)} cm</text></svg>`;
      $('#c7-c').innerHTML = `<p>Longueurs × ${fr(k)} : 4 cm → <b>${fr(4 * k)} cm</b></p><p>Aire × k² = × ${fr(k * k)} : 12 cm² → <b>${fr(12 * k * k)} cm²</b></p><p>Volume d’une boîte de 4 × 3 × 2 cm (24 cm³) × k³ = × ${fr(rnd(k ** 3, 3))} → <b>${fr(rnd(24 * k ** 3, 3))} cm³</b></p>`;
      setDefi(el, 'c7-d', k === 2);
      const a = +$('#c7-a').value, b = +$('#c7-b').value; $('#c7-a-o').textContent = fr(a); $('#c7-b-o').textContent = fr(b);
      const c = Math.sqrt(a * a + b * b), s2 = 160 / Math.max(a, b), x0 = 120, y0 = 200;
      $('#c7-p').innerHTML = `<svg viewBox="0 0 600 230" class="wg-chart"><polygon points="${x0},${y0} ${x0 + b * s2},${y0} ${x0},${y0 - a * s2}" fill="var(--tt)" stroke="var(--cc)" stroke-width="3"/><path d="M${x0} ${y0 - 14}h14v14" fill="none" stroke="#1D2240" stroke-width="1.6"/><text x="${x0 - 8}" y="${y0 - a * s2 / 2}" font-size="14" text-anchor="end" font-weight="700">a = ${fr(a)}</text><text x="${x0 + b * s2 / 2}" y="${y0 + 18}" font-size="14" text-anchor="middle" font-weight="700">b = ${fr(b)}</text><text x="${x0 + b * s2 / 2 + 12}" y="${y0 - a * s2 / 2 - 8}" font-size="14" font-weight="700" fill="var(--cc)">c ≈ ${fr(rnd(c, 2))}</text></svg>`;
      $('#c7-pc').innerHTML = `<p>c² = a² + b² = ${fr(a * a)} + ${fr(b * b)} = <b>${fr(rnd(a * a + b * b, 2))}</b> ; c = √${fr(rnd(a * a + b * b, 2))} ≈ <b>${fr(rnd(c, 2))} cm</b>${Number.isInteger(c) ? ' 🎉 un triplet entier !' : ''}</p>`;
    };
    el.addEventListener('input', up); up();
  };

  /* ---------------- 8 · croisement de deux variables ---------------- */
  W.c8 = el => {
    const PRE = {
      canal: { t: 'Satisfaction selon le canal d’achat', who: 'clients', rows: ['satisfaits', 'non satisfaits'], cols: ['en ligne', 'en boutique'], v: [[90, 56], [30, 24]] },
      accueil: { t: 'Motif de visite à l’accueil selon le jour', who: 'visites', rows: ['renseignement', 'retour, échange', 'retrait de commande'], cols: ['en semaine', 'le samedi'], v: [[84, 71], [46, 58], [70, 91]] },
      salon: { t: 'Demandes de devis selon l’âge (salon de l’habitat)', who: 'visiteurs', rows: ['avec devis', 'sans devis'], cols: ['18–34 ans', '35–54 ans', '55 ans et +'], v: [[120, 360, 160], [480, 540, 340]] } };
    let P = null, mode = 'eff', sel = null;
    el.innerHTML = box('Le tableau croisé vivant', 'Modifiez les effectifs : les totaux se recalculent. Changez d’affichage pour voir les fréquences, puis cliquez sur une case pour lire sa signification.',
      `<label class="wg-sl"><span>Enquête</span><select id="c8-p">${Object.entries(PRE).map(([a, b]) => `<option value="${a}">${b.t}</option>`).join('')}</select></label>
      <p class="wg-btns wg-seg">${[['eff', 'Effectifs'], ['tot', 'Fréquences (÷ N)'], ['col', 'Parmi chaque colonne'], ['row', 'Parmi chaque ligne']].map(([a, b]) => `<button class="btn sm${a === 'eff' ? '' : ' ghost'}" data-m="${a}">${b}</button>`).join('')}</p>
      <div class="wg-tc" id="c8-t"></div><p class="wg-sent" id="c8-s">👆 Cliquez sur une case du tableau.</p><div id="c8-g" class="wg-svg"></div>${defi('c8-d', 'Dans l’enquête « canal d’achat », modifiez les effectifs pour que les clients <b>en boutique</b> soient <b>plus satisfaits</b> que les clients en ligne (en pourcentage).')}`);
    const $ = s => el.querySelector(s);
    const load = k => { P = JSON.parse(JSON.stringify(PRE[k])); P.k = k; sel = null; $('#c8-s').innerHTML = '👆 Cliquez sur une case du tableau.'; draw(); };
    const tot = () => { const R = P.v.map(r => r.reduce((a, b) => a + b, 0)), C = P.cols.map((_, j) => P.v.reduce((a, r) => a + r[j], 0)), N = R.reduce((a, b) => a + b, 0); return { R, C, N }; };
    const val = (n, i, j, T) => mode === 'eff' ? fr(n) : mode === 'tot' ? pct(n / T.N * 100) : mode === 'col' ? (j < P.cols.length ? pct(n / T.C[j] * 100) : pct(n / T.N * 100)) : (i < P.rows.length ? pct(n / T.R[i] * 100) : pct(n / T.N * 100));
    const draw = () => {
      const T = tot(), E = mode === 'eff';
      let t = `<table class="dt tcx wg-tct"><thead><tr><th></th>${P.cols.map(c => `<th>${c}</th>`).join('')}<th>Total</th></tr></thead><tbody>`;
      P.v.forEach((r, i) => { t += `<tr><th>${P.rows[i]}</th>${r.map((n, j) => `<td data-i="${i}" data-j="${j}" class="${sel && sel[0] === i && sel[1] === j ? 'hlc' : ''}">${E ? `<input type="number" min="0" step="1" value="${n}" data-i="${i}" data-j="${j}" aria-label="${P.rows[i]}, ${P.cols[j]}" inputmode="numeric">` : val(n, i, j, T)}</td>`).join('')}<td class="tot" data-i="${i}" data-j="${P.cols.length}">${val(T.R[i], i, P.cols.length, T)}</td></tr>`; });
      t += `<tr class="tot"><th>Total</th>${T.C.map((n, j) => `<td data-i="${P.rows.length}" data-j="${j}">${val(n, P.rows.length, j, T)}</td>`).join('')}<td>${mode === 'eff' ? fr(T.N) : '100 %'}</td></tr></tbody></table>`;
      $('#c8-t').innerHTML = t;
      el.querySelectorAll('[data-m]').forEach(b => b.classList.toggle('ghost', b.dataset.m !== mode));
      bars();
    };
    const bars = () => {
      // barres à 100 % : par colonne (ou par ligne)
      const byRow = mode === 'row', groups = byRow ? P.rows : P.cols, keys = byRow ? P.cols : P.rows, cols = ['var(--cc)', '#FFC233', '#9DB9EA', '#C2332A'];
      $('#c8-g').innerHTML = `<div class="wg-bars">${groups.map((gname, a) => { const vals = keys.map((_, b) => byRow ? P.v[a][b] : P.v[b][a]), s2 = vals.reduce((x, y) => x + y, 0) || 1;
        return `<div class="wg-bar"><span class="wg-bl">${gname}</span><div class="wg-bt">${vals.map((v, b) => `<i style="width:${v / s2 * 100}%;background:${cols[b % 4]};color:${b === 1 ? '#1D2240' : '#fff'}">${v / s2 > .1 ? `<b>${pct(v / s2 * 100)}</b>` : ''}</i>`).join('')}</div></div>`; }).join('')}</div><p class="wg-leg">${keys.map((k, b) => `<span><i style="background:${cols[b % 4]}"></i>${k}</span>`).join('')}</p>`;
      if (P.k === 'canal') { const T2 = tot(); setDefi(el, 'c8-d', P.v[0][1] / T2.C[1] > P.v[0][0] / T2.C[0]); } else setDefi(el, 'c8-d', false);
    };
    const explain = (i, j) => { const T = tot(), nr = P.rows.length, nc = P.cols.length;
      if (i < nr && j < nc) { const n = P.v[i][j];
        const s = mode === 'col' ? `Parmi les ${fr(T.C[j])} ${P.who} « ${P.cols[j]} », <b>${pct(n / T.C[j] * 100)}</b> sont « ${P.rows[i]} » : ${fr(n)} ÷ ${fr(T.C[j])} (on divise par le total de la colonne).`
          : mode === 'row' ? `Parmi les ${fr(T.R[i])} ${P.who} « ${P.rows[i]} », <b>${pct(n / T.R[i] * 100)}</b> sont « ${P.cols[j]} » : ${fr(n)} ÷ ${fr(T.R[i])} (on divise par le total de la ligne).`
          : mode === 'tot' ? `<b>${pct(n / T.N * 100)}</b> des ${P.who} sont à la fois « ${P.rows[i]} » et « ${P.cols[j]} » : ${fr(n)} ÷ ${fr(T.N)} (on divise par N).`
          : `<b>${fr(n)}</b> ${P.who} sont à la fois « ${P.rows[i]} » et « ${P.cols[j]} ». Notation : n<sub>${i + 1};${j + 1}</sub> = ${fr(n)}.`;
        $('#c8-s').innerHTML = '💬 ' + s; }
      else if (j === nc && i < nr) $('#c8-s').innerHTML = `💬 Effectif marginal : <b>${fr(T.R[i])}</b> ${P.who} « ${P.rows[i]} » en tout, soit ${pct(T.R[i] / T.N * 100)} des ${P.who} (fréquence marginale).`;
      else if (i === nr && j < nc) $('#c8-s').innerHTML = `💬 Effectif marginal : <b>${fr(T.C[j])}</b> ${P.who} « ${P.cols[j]} » en tout, soit ${pct(T.C[j] / T.N * 100)} des ${P.who} (fréquence marginale).`; };
    el.addEventListener('input', e => { if (e.target.id === 'c8-p') return load(e.target.value); const i = e.target.dataset.i, j = e.target.dataset.j; if (i == null || j == null) return;
      P.v[+i][+j] = Math.max(0, Math.round(parseNum(e.target.value) || 0)); const T = tot();
      el.querySelectorAll('.wg-tct tbody tr').forEach((tr, a) => { if (a < P.rows.length) tr.lastElementChild.textContent = fr(T.R[a]); });
      const last = el.querySelector('.wg-tct tr.tot'); if (last) [...last.children].slice(1).forEach((td, b) => { td.textContent = b < P.cols.length ? fr(T.C[b]) : fr(T.N); });
      explain(+i, +j); bars(); });
    el.addEventListener('click', e => { const b = e.target.closest('[data-m]'); if (b) { mode = b.dataset.m; draw(); if (sel) explain(sel[0], sel[1]); return; }
      const td = e.target.closest('.wg-tct td'); if (td && td.dataset.i != null) { sel = [+td.dataset.i, +td.dataset.j]; explain(sel[0], sel[1]); if (mode !== 'eff') { el.querySelectorAll('.wg-tct td').forEach(x => x.classList.remove('hlc')); td.classList.add('hlc'); } } });
    load('canal');
  };

  window.MCVW = W;
})();
