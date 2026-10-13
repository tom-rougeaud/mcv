/* Version 3 — « S’évaluer » : le contrôle blanc de la version 2, resserré.
   10 à 12 questions, un document visuel central, une grille écrite en phrases d’élève, toujours noté sur 20. */
'use strict';
const K = require('../lib/kit3');
const { rnd, fr, H, D, tu } = K;
const { S, T, Rc, Ln, Ar } = require('../lib/visu');

/* la grille : ce que l’élève sait faire, compétence par compétence */
const GR = {
  c1: { app: 'Je repère les prix HT, TTC et le coût d’achat dans un document.', ana: 'Je trouve la remise qui respecte une règle de l’enseigne.', rea: 'Je calcule un prix TTC, une marge, un taux de marque.', val: 'Je vérifie qu’un prix soldé respecte la règle.', com: 'J’écris un message clair à ma tutrice.' },
  c2: { app: 'Je lis une série ou une boîte à moustaches.', ana: 'Je compare deux séries avec la médiane et l’écart interquartile.', rea: 'Je calcule une moyenne, une médiane, des quartiles.', val: 'Je vérifie si un objectif est atteint.', com: 'J’interprète un résultat par une phrase.' },
  c3: { app: 'Je repère les données utiles du stand.', ana: 'Je traduis une phrase par une équation ou une inéquation.', rea: 'Je résous une équation, une inéquation.', val: 'Je vérifie ma solution dans l’énoncé.', com: 'Je réponds par une phrase avec l’unité.' },
  c4: { app: 'Je reconnais les mentions d’une facture.', ana: 'Je retrouve une durée de placement.', rea: 'Je complète une facture et calcule des intérêts.', val: 'Je contrôle l’ordre de grandeur d’un total.', com: 'Je réponds au gérant par une phrase.' },
  c5: { app: 'Je lis une image ou un antécédent sur un graphique.', ana: 'Je compare deux tarifs selon la quantité.', rea: 'Je calcule une image et résous f(x) = k.', val: 'Je vérifie un résultat lu sur le graphique.', com: 'Je conseille un client avec une phrase.' },
  c6: { app: 'Je compte les issues avec un arbre ou un tableau.', ana: 'Je prévois un nombre de lots avec une probabilité.', rea: 'Je calcule une probabilité et une fréquence.', val: 'J’explique un écart par la fluctuation.', com: 'J’écris une consigne claire pour l’équipe.' },
  c7: { app: 'Je relève les dimensions sur un plan.', ana: 'Je trouve combien de boîtes tiennent dans un carton.', rea: 'Je calcule une aire, un volume, une longueur.', val: 'Je vérifie qu’un angle est droit.', com: 'J’écris une consigne pour le préparateur.' },
  c8: { app: 'Je lis une case et un total dans un tableau croisé.', ana: 'Je choisis le bon total pour un « parmi ».', rea: 'Je complète le tableau et calcule une fréquence.', val: 'Je compare deux groupes avec des pourcentages.', com: 'Je rédige une phrase pour le directeur.' } };

/* documents centraux ajoutés aux contrôles qui n’en avaient pas */
function docs(chk) {
  const o = {};
  // c3 : deux offres de location, en graphique
  const gx = j => 60 + j * 46, gy = v => 200 - v * .6;
  let g = '';
  for (let j = 0; j <= 10; j += 2) g += Ln(gx(j), 200, gx(j), 20, { c: 'grid', stroke: '#D5DAEC', w: .6 }) + T(gx(j), 216, j, { fs: 11, w: 400 });
  for (let v = 0; v <= 300; v += 50) g += Ln(60, gy(v), 520, gy(v), { c: 'grid', stroke: '#D5DAEC', w: .6 }) + T(54, gy(v) + 4, v, { fs: 11, a: 'end', w: 400 });
  g += Ln(60, 200, 530, 200, { w: 1.6 }) + Ln(60, 200, 60, 12, { w: 1.6 }) + T(530, 234, 'nombre de jours', { fs: 11, a: 'end', c: 'ts' }) + T(66, 14, 'coût (€)', { fs: 11, a: 'start', c: 'ts' });
  g += `<line x1="${gx(0)}" y1="${gy(0)}" x2="${gx(10)}" y2="${gy(250)}" class="ks" stroke-width="3"/><line x1="${gx(0)}" y1="${gy(60)}" x2="${gx(10)}" y2="${gy(210)}" stroke="#2B2D7C" stroke-width="3" stroke-dasharray="8 4"/>`;
  g += T(gx(10) - 4, gy(250) - 8, 'offre A', { fs: 13, a: 'end', c: 'kt' }) + T(gx(10) - 4, gy(210) + 20, 'offre B', { fs: 13, a: 'end' });
  o.c3 = `<div class="evdoc">${S(560, 240, g, 'Coût des deux offres de location selon le nombre de jours')}<p class="srcl">Offre A : 25 € par jour. Offre B : 60 € + 15 € par jour (commerce fictif).</p></div>`;
  chk(25 * 10 === 250 && 60 + 150 === 210 && 25 * 6 === 60 + 15 * 6, 'ev3 doc');
  // c4 : le bon de commande
  o.c4 = `<div class="evdoc">${D.table(['Désignation', 'Quantité', 'Prix unitaire HT', 'Montant HT'], [['Classeurs', '40', '3,20 €', '…'], ['Ramettes de papier', '25', '4,80 €', '…'], ['<b>Montant brut HT</b>', '', '', '…'], ['Remise 5 %', '', '', '…'], ['<b>Net commercial HT</b>', '', '', '…'], ['Frais de port', '', '', '15,00 €'], ['<b>Total HT</b>', '', '', '…'], ['TVA 20 %', '', '', '…'], ['<b>Net à payer TTC</b>', '', '', '…']], 'dt-sm evfac')}<p class="srcl">Bon de commande d’un grossiste en fournitures de bureau (entreprise fictive).</p></div>`;
  // c6 : l’urne de 50 tickets
  let u = '';
  for (let i = 0; i < 50; i++) { const x = 40 + (i % 10) * 34, y = 30 + Math.floor(i / 10) * 30; u += Rc(x, y, 28, 22, { c: i < 2 ? 'k' : i < 10 ? 'k2' : 'wh', rx: 4, sw: 1.4 }) + (i < 2 ? T(x + 14, y + 16, '20 €', { fs: 9, c: 'tw' }) : i < 10 ? T(x + 14, y + 16, '−10 %', { fs: 8.5 }) : ''); }
  u += Rc(400, 40, 22, 18, { c: 'k', rx: 3 }) + T(430, 54, '2 bons de 20 €', { fs: 13, a: 'start' }) + Rc(400, 74, 22, 18, { c: 'k2', rx: 3 }) + T(430, 88, '8 « − 10 % »', { fs: 13, a: 'start' }) + Rc(400, 108, 22, 18, { c: 'wh', rx: 3 }) + T(430, 122, '40 « merci »', { fs: 13, a: 'start' }) + T(400, 166, 'Le ticket est remis', { fs: 12, a: 'start', c: 'ts' }) + T(400, 182, 'dans l’urne après chaque tirage.', { fs: 12, a: 'start', c: 'ts' });
  o.c6 = `<div class="evdoc">${S(580, 190, u, 'Les 50 tickets de l’urne')}</div>`;
  chk(2 + 8 + 40 === 50, 'ev6 doc');
  // c7 : le fond de la vitrine
  const v = Rc(60, 30, 288, 216 * .75, { c: 'k2', rx: 2 }) + `<line x1="60" y1="${30 + 162}" x2="348" y2="30" class="ks" stroke-width="3" stroke-dasharray="8 5"/>` + T(204, 22, '2,4 m', { fs: 14 }) + T(366, 115, '1,8 m', { fs: 14, a: 'start' }) + T(214, 124, 'guirlande ?', { fs: 13, c: 'kt', r: -29 }) + `<path d="M60 ${192 - 14}h14v14" fill="none" class="ks" stroke-width="2"/>`
    + Rc(440, 70, 90, 60, { c: 'k2', rx: 3 }) + `<path d="M440 70l20 -16h90l-20 16z" class="k2 ks" stroke-width="2"/><path d="M530 70l20 -16v60l-20 16z" class="k2 ks" stroke-width="2"/>` + T(485, 150, 'boîte cadeau', { fs: 12, c: 'ts' }) + T(485, 168, '30 × 20 × 15 cm', { fs: 12 });
  o.c7 = `<div class="evdoc">${S(580, 210, v, 'Le fond de la vitrine et la boîte cadeau')}<p class="srcl">Adhésif décoratif : 15 € le m². Guirlande : 3,2 m. Carton d’expédition : 60 cm × 40 cm × 30 cm.</p></div>`;
  return o;
}

module.exports = function (chk, E2) {
  const DOC = docs(chk), E = {};
  for (const [id, e] of Object.entries(E2)) {
    const exos = e.exos.map(x => ({ ...x, qs: x.qs.map(q => ({ ...q })) }));
    const rest = exos.slice(1).reduce((a, x) => a + x.qs.length, 0), keep = Math.min(exos[0].qs.length, 12 - rest);
    const drop = exos[0].qs.slice(keep).reduce((a, q) => a + q.pts, 0);
    exos[0].qs = exos[0].qs.slice(0, keep);
    for (let i = 0; i < drop; i++) exos[0].qs[i % keep].pts += 1;
    exos.forEach(x => { if (x.intro) x.intro = tu(x.intro.replace(/vous confie/g, 'te confie').replace(/Vous relevez/g, 'Tu relèves')); });
    if (DOC[id]) { const k = { c3: 2 }[id] || 1; exos[k].intro = DOC[id] + (exos[k].intro || ''); }
    const n = exos.reduce((a, x) => a + x.qs.length, 0), pts = exos.reduce((a, x) => a + x.qs.reduce((b, q) => b + q.pts, 0), 0);
    chk(n >= 10 && n <= 12 && pts === 20, `S’évaluer ${id} : ${n} questions, ${pts} points`);
    E[id] = { ...e, exos, grille: GR[id], nq: n };
  }
  return E;
};
