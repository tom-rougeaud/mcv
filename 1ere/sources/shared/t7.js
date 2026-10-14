/* 1re · chapitre 7 — Probabilités : évènements, contraire, réunion, intersection, tableau croisé. */
(function (root) {
  'use strict';
  const { DEP, TR, H } = typeof module !== 'undefined' ? require('./train.js').MCVT : root.MCVT;
  const { fr, rnd, tb, T, num, qcm, pick, int, shuffle, P } = H;
  const C1 = '#C2332A', C2 = '#FFC233', C3 = '#DCE2F2', INK = P.INK;
  const pr = (k, n) => rnd(k / n, 4);
  /* grille de n cases colorées (exact : une case = une issue) */
  const grille = (n, groups, lab) => { const cols = n <= 20 ? 10 : n <= 25 ? 5 : 10, rows = Math.ceil(n / cols), s = 34, W = 600, x0 = (W - cols * s) / 2; let k = 0, out = '';
    groups.forEach(([cnt, fill]) => { for (let i = 0; i < cnt; i++, k++) { const r = Math.floor(k / cols), c = k % cols; out += `<rect x="${x0 + c * s + 2}" y="${10 + r * s + 2}" width="${s - 4}" height="${s - 4}" rx="5" fill="${fill}" stroke="${INK}" stroke-width="1.4"/>`; } });
    const H2 = 20 + rows * s; return `<svg viewBox="0 0 ${W} ${H2 + 30}" class="pic vis trs" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${lab}">${out}${groups.map(([cnt, fill, t], i) => `<rect x="${60 + i * 180}" y="${H2 + 6}" width="16" height="16" rx="3" fill="${fill}" stroke="${INK}" stroke-width="1.2"/>` + T(82 + i * 180, H2 + 19, `${t} : ${cnt}`, { fs: 13, a: 'start', w: 600 })).join('')}</svg>`; };
  /* diagramme de Venn exact : deux disques, effectifs placés au centre de chaque zone */
  const venn = (N, nA, nB, nAB, la, lb, blanks = {}) => { const W = 600, Hh = 250; let s = `<rect x="20" y="10" width="560" height="${Hh - 20}" rx="10" fill="#fff" stroke="${INK}" stroke-width="2"/>` + T(44, 34, `${N} clients`, { fs: 13, a: 'start', c: 'ts' });
    s += `<circle cx="235" cy="132" r="92" fill="${C1}" fill-opacity=".16" stroke="${C1}" stroke-width="2.6"/><circle cx="365" cy="132" r="92" fill="#1D5FC2" fill-opacity=".16" stroke="#1D5FC2" stroke-width="2.6"/>`;
    s += T(180, 36, la, { fs: 14, fill: C1 }).replace('class="tx"', `fill="${C1}"`) + T(420, 36, lb, { fs: 14 }).replace('class="tx"', 'fill="#1D5FC2"');
    const val = (x, y, v, k) => blanks[k] ? H.sb(x - 26, y - 18, 52, blanks[k][0], blanks[k][1]) : T(x, y + 6, String(v), { fs: 18 });
    s += val(185, 132, nA - nAB, 'A') + val(300, 132, nAB, 'AB') + val(415, 132, nB - nAB, 'B') + val(530, 214, N - nA - nB + nAB, 'N');
    return `<svg viewBox="0 0 ${W} ${Hh}" class="pic vis trs" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagramme de deux ensembles qui se chevauchent">${s}</svg>`; };

  /* point de départ : une roue de jeu-concours */
  DEP.c7 = R => {
    const n = pick(R, [8, 10]), g = 1, p = pick(R, [2, 3]), l = n - g - p, cols = shuffle(R, [...Array(g).fill(C1), ...Array(p).fill(C2), ...Array(l).fill(C3)]);
    let s = ''; const cx = 300, cy = 140, r = 118;
    cols.forEach((c, i) => { const a0 = -Math.PI / 2 + i * 2 * Math.PI / n, a1 = a0 + 2 * Math.PI / n; s += `<path d="M${cx} ${cy}L${(cx + r * Math.cos(a0)).toFixed(1)} ${(cy + r * Math.sin(a0)).toFixed(1)}A${r} ${r} 0 0 1 ${(cx + r * Math.cos(a1)).toFixed(1)} ${(cy + r * Math.sin(a1)).toFixed(1)}Z" fill="${c}" stroke="${INK}" stroke-width="2"/>`; });
    s += `<polygon points="${cx - 10},8 ${cx + 10},8 ${cx},28" fill="${INK}"/>` + `<circle cx="${cx}" cy="${cy}" r="9" fill="#fff" stroke="${INK}" stroke-width="2"/>`;
    const leg = [[C1, 'bon de 50 €'], [C2, 'bon de 5 €'], [C3, 'perdu']].map(([c, t], i) => `<rect x="450" y="${70 + i * 30}" width="18" height="18" rx="3" fill="${c}" stroke="${INK}"/>` + T(476, 84 + i * 30, t, { fs: 14, a: 'start', w: 600 })).join('');
    const svg = `<svg viewBox="0 0 600 270" class="pic vis" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Roue partagée en ${n} secteurs égaux">${s}${leg}</svg>`;
    return { titre: 'La roue du jeu-concours', doc: `<div class="wfig">${svg}</div><p class="srcl">Roue de ${n} secteurs égaux, lancée une fois par client. Jeu fictif.</p>`,
      qs: [{ t: 'Combien la roue a-t-elle de secteurs ?', kind: 'num', v: n, tol: .01, a: String(n) },
        { t: 'Combien de secteurs donnent un bon de 5 € ?', kind: 'num', v: p, tol: .01, a: String(p) },
        { t: 'Quelle est la probabilité de gagner le bon de 50 € ? (en décimal)', kind: 'num', v: pr(g, n), tol: .0006, a: `1 ÷ ${n} = ${fr(pr(g, n))}` },
        { t: 'Quel résultat est le plus probable ?', kind: 'qcm', choices: ['bon de 50 €', 'bon de 5 €', 'perdu'], ok: 2, a: `perdu : ${l} secteurs sur ${n}` },
        { t: 'Quelle est la probabilité de gagner un bon (50 € ou 5 €) ? (en décimal)', kind: 'num', v: pr(g + p, n), tol: .0006, a: `${g + p} ÷ ${n} = ${fr(pr(g + p, n))}` },
        { t: 'Rappel : écris 3 ÷ 10 en décimal.', kind: 'num', v: .3, tol: .0006, a: '0,3' }] };
  };

  /* e1 · tickets : probabilité, contraire, réunion d’évènements incompatibles */
  TR.c7e1 = R => {
    const n = pick(R, [20, 25, 40, 50]), g = pick(R, [1, 2]), p = pick(R, [3, 4, 5, 6]), l = n - g - p;
    const sv = grille(n, [[g, C1, 'gros lot'], [p, C2, 'petit lot'], [l, C3, 'perdu']], `${n} tickets`);
    const items = [num('a', pr(g, n), 3, fr(pr(g, n)), [{ v: g, m: 'Une probabilité est un quotient : cas favorables ÷ cas possibles.' }]), num('b', pr(g + p, n), 3, fr(pr(g + p, n)), [{ v: pr(p, n), m: 'Gagner un lot, c’est gagner le gros lot ou un petit lot : additionne les deux.' }]), num('c', pr(l, n), 3, fr(pr(l, n)), [{ v: pr(g + p, n), m: 'C’est la probabilité de gagner. Perdre est l’évènement contraire : 1 − P(gagner).' }]), qcm('d', ['oui', 'non'], 0, 'oui : un ticket ne peut pas être à la fois gros lot et petit lot')];
    return { titre: 'Tirer un ticket', consigne: `Une urne contient ${n} tickets, chacun a la même chance d’être tiré. On tire un ticket au hasard. Donne les probabilités en décimal.`, support: sv + `<p class="tr-l">a. P(gros lot) = ${tb('a', items[0].a, 14)} &nbsp; b. P(gagner un lot) = ${tb('b', items[1].a, 14)}</p><p class="tr-l">c. P(perdre) = ${tb('c', items[2].a, 14)} (évènement contraire de « gagner un lot »)</p><p class="tr-l">d. Les évènements « gros lot » et « petit lot » sont-ils incompatibles ?</p>`, items,
      hints: ['Compte les cases de la bonne couleur, puis divise par le nombre total de tickets.', 'Pour des évènements incompatibles, on additionne les probabilités.', 'P(contraire) = 1 − P(évènement).'] };
  };

  /* e2 · réunion et intersection avec un diagramme */
  TR.c7e2 = R => {
    const N = pick(R, [100, 200]), nA = pick(R, [40, 50, 60, 70]), nB = pick(R, [30, 40, 50]), nAB = pick(R, [10, 15, 20]), u = nA + nB - nAB;
    const items = [num('a', nA - nAB, 0, String(nA - nAB), [{ v: nA, m: 'Dans la zone « seulement A », on enlève ceux qui sont aussi dans B.' }]), num('b', u, 0, String(u), [{ v: nA + nB, m: 'Tu as compté deux fois la partie commune : enlève-la une fois.' }]), num('c', pr(nAB, N), 3, fr(pr(nAB, N))), num('d', pr(u, N), 3, fr(pr(u, N)), [{ v: pr(nA + nB, N), m: 'P(A ou B) = P(A) + P(B) − P(A et B) : n’oublie pas d’enlever la partie commune.' }]), num('e', pr(N - u, N), 3, fr(pr(N - u, N)))];
    return { titre: 'Et, ou', consigne: `Sur ${N} clients, ${nA} ont la carte de fidélité (A), ${nB} ont acheté en ligne (B) et ${nAB} ont les deux. Complète le diagramme et calcule les probabilités pour un client pris au hasard (en décimal).`, support: venn(N, nA, nB, nAB, 'A : carte', 'B : en ligne', { A: ['a', String(nA - nAB)] }) + `<p class="tr-l">a. Clients avec la carte seulement : case a du diagramme &nbsp; b. Clients dans A ou B : ${tb('b', items[1].a, 12)}</p><p class="tr-l">c. P(A et B) = ${tb('c', items[2].a, 14)} &nbsp; d. P(A ou B) = ${tb('d', items[3].a, 14)} &nbsp; e. P(ni A ni B) = ${tb('e', items[4].a, 14)}</p>`, items,
      hints: ['Le centre du diagramme compte les clients qui sont dans A et dans B.', 'A ou B : on additionne les trois zones colorées.', 'Ni A ni B : ce qui reste en dehors des deux disques.'] };
  };

  /* e3 · tableau croisé */
  TR.c7e3 = R => {
    const a = pick(R, [40, 45, 52, 60]), b = pick(R, [8, 10, 12, 15]), c = pick(R, [60, 66, 70, 75]), d = pick(R, [20, 24, 25, 30]), N = a + b + c + d;
    const L = a + b, M = c + d, S = a + c;
    const items = [num('a', L, 0, String(L)), num('b', S, 0, String(S)), num('c', N, 0, String(N)), num('d', rnd(a / N, 3), 3, fr(rnd(a / N, 3)), [{ v: rnd(a / L, 3), m: 'Ici on prend un client parmi tous les clients : divise par le total général.' }]), num('e', rnd(a / L, 3), 3, fr(rnd(a / L, 3)), [{ v: rnd(a / N, 3), m: '« Parmi les clients en ligne » : divise par le total de la ligne « en ligne ».' }, { v: rnd(a / S, 3), m: 'Divise par le total des clients en ligne, pas par celui des satisfaits.' }])];
    const tabl = `<table class="dt tcx dt-sm dt-c"><thead><tr><th></th><th>satisfait</th><th>pas satisfait</th><th>total</th></tr></thead><tbody><tr><th>en ligne</th><td>${a}</td><td>${b}</td><td>${tb('a', String(L), 12)}</td></tr><tr><th>en magasin</th><td>${c}</td><td>${d}</td><td>${M}</td></tr><tr><th>total</th><td>${tb('b', String(S), 12)}</td><td>${b + d}</td><td>${tb('c', String(N), 12)}</td></tr></tbody></table>`;
    return { titre: 'Un tableau croisé', consigne: 'Une enquête classe les clients selon leur mode d’achat et leur satisfaction. Complète les totaux (a, b, c), puis calcule les probabilités en décimal, arrondies au millième.', support: tabl + `<p class="tr-l">d. P(en ligne et satisfait) = ${tb('d', items[3].a, 14)}</p><p class="tr-l">e. Parmi les clients en ligne, probabilité d’être satisfait = ${tb('e', items[4].a, 14)}</p>`, items,
      hints: ['Additionne chaque ligne et chaque colonne.', 'Pour un client pris parmi tous : divise par le total général.', '« Parmi les clients en ligne » : divise par le total de cette ligne.'] };
  };
  if (typeof module !== 'undefined') module.exports = { grille, venn };
  else root.MCVT7 = { grille, venn };
})(typeof module !== 'undefined' ? module.exports : window);
