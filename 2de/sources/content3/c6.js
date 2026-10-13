/* Chapitre 6 · Fluctuation et probabilités — version 3 (BO 2019, 2de pro). */
'use strict';
const K = require('../lib/kit3');
const { rnd, H, FM, M, R, adapt } = K;
const { S, T, Rc, Ln, Ar, Br, st } = require('../lib/visu');
const P = require('../lib/pics');
const V2 = require('../content2/c6.js');

module.exports = function (chk) {
  const old = V2(chk);
  const c = { id: 'c6', n: 6, col: 'algo', icone: '🎲', dom: 'Statistique et probabilités', titre: 'Fluctuation et probabilités' };
  c.travail = { question: `Une épicerie fait tourner une roue à ${H('12 secteurs')} à chaque client. ${H('Un seul secteur')} fait gagner un panier garni. Combien de paniers prévoir pour ${H('600 clients')} ? Tu sauras répondre à la fin du chapitre (sujet « vers le bac »).` };
  c.objectifs = ['Je saurai placer une probabilité entre 0 et 1.', 'Je saurai calculer une probabilité : cas favorables sur cas possibles.', 'Je saurai compter les issues avec un arbre ou un tableau.', 'Je saurai expliquer pourquoi une fréquence observée fluctue.'];
  c.depart = 'c6';

  /* ---------- méthodes visuelles ---------- */
  const miniRoue = `<svg viewBox="0 0 170 100" class="pic" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="une roue de 12 secteurs">${Array.from({ length: 12 }, (_, i) => { const a0 = -Math.PI / 2 + i * Math.PI / 6, a1 = a0 + Math.PI / 6, r = 42, cx = 85, cy = 54; return `<path d="M${cx} ${cy}L${(cx + r * Math.cos(a0)).toFixed(1)} ${(cy + r * Math.sin(a0)).toFixed(1)}A${r} ${r} 0 0 1 ${(cx + r * Math.cos(a1)).toFixed(1)} ${(cy + r * Math.sin(a1)).toFixed(1)}Z" class="${i === 0 ? 'k' : i <= 3 ? 'k2' : 'wh'} ks" stroke-width="1.4"/>`; }).join('')}<path d="M85 8 l-6 -8 h12 z" class="k"/></svg>`;
  // 1. la ligne des probabilités
  const lx = p => 50 + p * 500;
  const ligne = S(600, 256, st(1, `<rect x="50" y="70" width="500" height="16" rx="8" class="k2 ks" stroke-width="2"/>` + [[0, '0'], [.5, '0,5'], [1, '1']].map(([p, t]) => Ln(lx(p), 62, lx(p), 94, { w: 2.4 }) + T(lx(p), 54, t, { fs: 16 })).join('') + T(lx(0), 116, 'impossible', { fs: 13, c: 'kt' }) + T(lx(.5), 116, 'une chance sur deux', { fs: 13, c: 'kt' }) + T(lx(1), 116, 'certain', { fs: 13, c: 'kt' }) + T(300, 24, 'on lance un dé à 6 faces', { fs: 13, c: 'ts' }))
    + st(2, [[0, 'obtenir 7'], [1 / 6, 'obtenir 6'], [.5, 'un nombre pair'], [1, 'moins de 7']].map(([p, t], i) => `<circle cx="${lx(p)}" cy="78" r="8" class="k"/>` + T(lx(p) + (i === 0 ? 4 : i === 3 ? -4 : 0), i === 1 ? 166 : 146, t, { fs: 13, a: i === 0 ? 'start' : i === 3 ? 'end' : 'middle' })).join('') + T(lx(1 / 6), 54, '1/6', { fs: 14, c: 'kt' }))
    + st(3, Br(lx(0), lx(1 / 6), 182, 'P(6) = 1/6', { fs: 13 }) + Br(lx(1 / 6), lx(1), 182, 'P(pas 6) = 5/6', { fs: 13 }))
    + st(4, T(300, 244, 'un événement et son contraire se partagent la ligne : 1/6 + 5/6 = 1', { fs: 14, c: 'kt' })), 'La ligne des probabilités, de 0 (impossible) à 1 (certain)');
  // 2. la roue de 12 secteurs
  const sect = (i, cls) => { const a0 = -Math.PI / 2 + i * Math.PI / 6, a1 = a0 + Math.PI / 6, r = 90, cx = 150, cy = 125; return `<path d="M${cx} ${cy}L${(cx + r * Math.cos(a0)).toFixed(1)} ${(cy + r * Math.sin(a0)).toFixed(1)}A${r} ${r} 0 0 1 ${(cx + r * Math.cos(a1)).toFixed(1)} ${(cy + r * Math.sin(a1)).toFixed(1)}Z" class="${cls} ks" stroke-width="2"/>`; };
  const roue = S(600, 250, st(1, Array.from({ length: 12 }, (_, i) => sect(i, i === 0 ? 'k' : i <= 3 ? 'k2' : 'wh')).join('') + `<path d="M150 22 l-9 -16 h18 z" class="k"/>` + T(150, 240, '12 secteurs identiques', { fs: 13, c: 'ts' }))
    + st(2, Rc(300, 40, 22, 22, { c: 'k', rx: 4 }) + T(332, 57, '1 panier garni', { fs: 15, a: 'start' }) + Rc(300, 76, 22, 22, { c: 'k2', rx: 4 }) + T(332, 93, '3 bons de − 20 %', { fs: 15, a: 'start' }) + Rc(300, 112, 22, 22, { c: 'wh', rx: 4 }) + T(332, 129, '8 bons de − 5 %', { fs: 15, a: 'start' }))
    + st(3, T(300, 176, 'P(panier) = 1 ÷ 12 ≈ 0,083', { fs: 16, c: 'kt', a: 'start' }) + T(300, 202, 'P(− 20 %) = 3 ÷ 12 = 0,25', { fs: 16, c: 'kt', a: 'start' }))
    + st(4, T(300, 232, 'cas favorables ÷ cas possibles', { fs: 14, a: 'start' })), 'Une roue de 12 secteurs coloriés');
  // 3. l’arbre et le tableau
  const L1 = [['papier', 70], ['tissu', 170]], L2 = ['carte', 'espèces', 'sans contact'];
  let arb = '';
  L1.forEach(([s, y]) => { arb += Ln(30, 120, 110, y, { w: 2 }) + Rc(110, y - 14, 70, 28, { c: 'k2', rx: 6 }) + T(145, y + 5, s, { fs: 13 }); L2.forEach((p, j) => { const y2 = y - 32 + j * 32; arb += Ln(180, y, 240, y2, { w: 1.6 }) + T(246, y2 + 5, p, { fs: 12, a: 'start' }); }); });
  const arbre = S(600, 250, st(1, `<circle cx="30" cy="120" r="6" class="k"/>` + arb + T(150, 236, 'l’arbre : sac, puis paiement', { fs: 13, c: 'ts' }))
    + st(2, (() => { const x0 = 326, cw = 70, cx = j => x0 + 60 + j * cw; let g = Rc(x0, 40, 60, 30, { c: 'wh', rx: 0, sw: 1.2 }); L2.forEach((h, j) => { g += Rc(cx(j), 40, cw, 30, { c: 'k', rx: 0, sw: 1.2 }) + T(cx(j) + cw / 2, 60, h, { fs: 11, c: 'tw' }); }); L1.forEach(([sac], i) => { g += Rc(x0, 70 + i * 30, 60, 30, { c: 'k', rx: 0, sw: 1.2 }) + T(x0 + 30, 90 + i * 30, sac, { fs: 11, c: 'tw' }); L2.forEach((_, j) => { g += Rc(cx(j), 70 + i * 30, cw, 30, { c: 'wh', rx: 0, sw: 1.2 }) + `<circle cx="${cx(j) + cw / 2}" cy="${85 + i * 30}" r="5" class="${i === 1 && j === 2 ? 'k' : 'k2'}"/>`; }); }); return g; })() + T(461, 150, 'le tableau : une case par issue', { fs: 13, c: 'ts' }))
    + st(3, T(461, 186, '2 × 3 = 6 issues', { fs: 18, c: 'kt' }))
    + st(4, T(461, 216, 'P(tissu et sans contact) = 1/6', { fs: 15 }) + T(461, 238, 'si tous les choix ont la même chance', { fs: 12, c: 'ts' })), 'Un arbre et un tableau pour compter les issues');
  // 4. la courbe des fréquences qui se stabilise
  const FQ = [.4, .1, .3, .2, .25, .13, .2, .15, .19, .16, .18, .165, .17, .162, .168, .166, .167];
  const fx = i => 60 + i * 31, fy = f => 210 - f * 400;
  const courbe = S(600, 250, st(1, Ln(60, 210, 570, 210, { w: 1.6 }) + Ln(60, 210, 60, 40, { w: 1.6 }) + [0, .1, .2, .3, .4].map(f => T(52, fy(f) + 4, String(f).replace('.', ','), { fs: 11, a: 'end', w: 400 })).join('') + T(315, 236, 'nombre de lancers : de 10 à 2 000', { fs: 12, c: 'ts' }) + T(70, 30, 'fréquence des « 6 »', { fs: 12, a: 'start', c: 'ts' }))
    + st(2, `<polyline points="${FQ.map((f, i) => fx(i) + ',' + fy(f).toFixed(1)).join(' ')}" class="ks" stroke-width="2.6" fill="none"/>` + FQ.map((f, i) => `<circle cx="${fx(i)}" cy="${fy(f).toFixed(1)}" r="3.5" class="k"/>`).join('') + T(150, 54, 'au début : ça saute beaucoup', { fs: 13, c: 'kt', a: 'start' }))
    + st(3, Ln(60, fy(1 / 6), 570, fy(1 / 6), { dash: '6 4', w: 2 }) + T(566, fy(1 / 6) - 10, 'probabilité 1/6 ≈ 0,17', { fs: 13, a: 'end', c: 'kt' }))
    + st(4, T(450, 84, 'avec beaucoup de lancers,', { fs: 13 }) + T(450, 102, 'la fréquence se stabilise', { fs: 13 })), 'La fréquence des 6 se rapproche de 1/6 quand on lance beaucoup de fois');
  chk(rnd(1 / 12, 3) === .083 && 3 / 12 === .25 && 2 * 3 === 6 && rnd(1 / 6, 2) === .17, 'c6 visuels');

  c.notions = [
    { titre: 'Qu’est-ce qu’une probabilité ?', decouvre: { txt: `On lance un dé. Obtenir ${H('7')}, obtenir ${H('un nombre pair')}, obtenir ${H('moins de 7')} : range ces événements du moins au plus probable.`, img: P.proba() },
      comprends: `<p>Une <b>expérience aléatoire</b> a plusieurs résultats possibles, et on ne peut pas savoir lequel va sortir. Lancer un dé, tourner une roue, tirer un ticket.</p><p>Chaque résultat possible est une <b>issue</b>. Un <b>événement</b> regroupe une ou plusieurs issues : « obtenir un nombre pair ».</p><p>La <b>probabilité</b> d’un événement mesure ses chances de se produire. C’est un nombre entre 0 et 1. 0 : impossible. 1 : certain. 0,5 : une chance sur deux.</p><p>L’<b>événement contraire</b> de A, noté « non A », se produit quand A ne se produit pas. Les deux se partagent toutes les chances : leurs probabilités font 1 à elles deux.</p>`,
      vois: ligne, voisLeg: 'Chaque événement trouve sa place sur la ligne, entre 0 et 1. Un événement et son contraire se partagent toute la ligne.',
      retiens: `<p>${FM(R`0\le P(A)\le 1`)} · ${FM(R`P(\text{non }A)=1-P(A)`)}</p>`,
      exemple: `<p>P(obtenir 6) = ${M(R`\dfrac{1}{6}`)} ≈ 0,17.</p><p>P(ne pas obtenir 6) = 1 − ${M(R`\dfrac{1}{6}`)} = ${M(R`\dfrac{5}{6}`)} ≈ <b>0,83</b>.</p>`,
      attention: 'Une probabilité ne dépasse jamais 1. Si tu trouves 1,2 ou 12, tu as divisé dans le mauvais sens.', astuce: { k: 'verif', t: 'P(A) + P(non A) = 1 : utilise le contraire quand il est plus rapide à calculer.' } },
    { titre: 'Calculer une probabilité', decouvre: { txt: `Une roue a ${H('12 secteurs identiques')}. ${H('Un seul')} fait gagner un panier garni. Quelle est la probabilité de le gagner ?`, img: miniRoue },
      comprends: `<p>Quand toutes les issues ont la même chance, on dit qu’on est en situation d’<b>équiprobabilité</b>. Une roue aux secteurs identiques, un dé équilibré, une urne bien mélangée.</p><p>Dans ce cas, la probabilité se calcule. On compte les issues qui réalisent l’événement : ce sont les <b>cas favorables</b>. On compte toutes les issues : ce sont les <b>cas possibles</b>. Puis on divise.</p><p>Le résultat s’écrit en fraction, en décimal ou en pourcentage. 1/12 ≈ 0,083 ≈ 8,3 %.</p><p>Si les secteurs ne sont pas identiques, on ne peut plus compter ainsi.</p>`,
      vois: roue, voisLeg: 'On compte les secteurs de chaque couleur. Les 12 secteurs ont la même taille : chacun a une chance sur 12.',
      retiens: `<p>${FM(R`P(A)=\dfrac{\text{nombre de cas favorables}}{\text{nombre de cas possibles}}`)}</p>`,
      exemple: `<p>P(panier) = ${M(R`\dfrac{1}{12}`)} ≈ <b>0,083</b>.</p><p>P(gagner un bon de − 20 % ou un panier) = ${M(R`\dfrac{4}{12}`)} = ${M(R`\dfrac{1}{3}`)} ≈ <b>0,33</b>.</p>`,
      attention: 'On divise les cas favorables par les cas possibles, jamais l’inverse : 1 ÷ 12, pas 12 ÷ 1.', astuce: { k: 'sens', t: 'Probabilité × nombre de clients = nombre de lots à prévoir, en moyenne.' } },
    { titre: 'Compter avec un arbre ou un tableau', decouvre: { txt: `Chaque client choisit un sac (${H('papier ou tissu')}) et un paiement (${H('carte, espèces, sans contact')}). Combien de combinaisons possibles ?`, img: P.arbre() },
      comprends: `<p>Quand une expérience se fait en deux étapes, on oublie facilement des issues. Il faut une méthode pour les compter toutes.</p><p>L’<b>arbre</b> suit l’ordre des étapes. Une première branche pour chaque sac, puis une branche pour chaque paiement. Chaque chemin complet est une issue.</p><p>Le <b>tableau à double entrée</b> range les mêmes issues : une ligne par sac, une colonne par paiement. Chaque case est une issue.</p><p>Ici : 2 sacs × 3 paiements = 6 issues. Si chaque issue a la même chance, chacune a la probabilité 1/6.</p>`,
      vois: arbre, voisLeg: 'L’arbre et le tableau donnent les mêmes 6 issues. La case coloriée correspond à « tissu et sans contact ».',
      retiens: `<p>Deux étapes avec n et p choix : ${FM(R`n\times p\ \text{issues}`)}</p><p>Arbre : un chemin = une issue. Tableau : une case = une issue.</p>`,
      exemple: `<p>2 sacs et 3 paiements : 2 × 3 = <b>6 issues</b>.</p><p>P(tissu et sans contact) = ${M(R`\dfrac{1}{6}`)} ≈ <b>0,17</b>.</p>`,
      attention: 'Dans un vrai magasin, les choix n’ont pas tous la même chance : la plupart des clients paient par carte.', astuce: { k: 'vite', t: 'Pour vérifier un arbre, compte les bouts de branches : il doit y en avoir n × p.' } },
    { titre: 'Fréquence et fluctuation', decouvre: { txt: `Sur ${H('600 clients')}, ${H('47')} ont gagné le panier garni. On en attendait environ 50. Le jeu est-il truqué ?`, img: P.frequence() },
      comprends: `<p>La probabilité dit ce qui devrait se passer en moyenne. La <b>fréquence</b> dit ce qui s’est vraiment passé : nombre de fois observé ÷ nombre d’essais.</p><p>Sur peu d’essais, la fréquence peut être loin de la probabilité. D’un essai à l’autre, elle change : c’est la <b>fluctuation</b> d’échantillonnage.</p><p>Quand le nombre d’essais augmente, la fréquence se rapproche de la probabilité. Elle se <b>stabilise</b>.</p><p>On peut aussi faire l’inverse. Quand on ne connaît pas une probabilité, on l’<b>estime</b> par la fréquence observée sur un grand nombre d’essais.</p><p>Excel permet de simuler des milliers de tirages avec ${M(R`\texttt{=ALEA.ENTRE.BORNES(1;6)}`)}.</p>`,
      vois: courbe, voisLeg: 'Au début, la fréquence saute beaucoup. Avec 2 000 lancers, elle reste très près de 1/6.',
      retiens: `<p>${FM(R`f=\dfrac{\text{nombre de fois observé}}{\text{nombre d’essais}}`)}</p><p>Beaucoup d’essais : la fréquence se rapproche de la probabilité.</p>`,
      exemple: `<p>47 paniers sur 600 : f = 47 ÷ 600 ≈ <b>0,078</b>.</p><p>La probabilité vaut 1/12 ≈ 0,083 : l’écart est petit, c’est la fluctuation.</p>`,
      attention: 'Une fréquence un peu différente de la probabilité ne prouve pas que le jeu est truqué.', astuce: { k: 'og', t: 'Pour juger un écart, regarde le nombre d’essais : plus il est grand, plus l’écart devrait être petit.' } }];
  chk(rnd(5 / 6, 2) === .83 && rnd(4 / 12, 2) === .33 && rnd(47 / 600, 3) === .078 && 600 / 12 === 50, 'c6 notions');

  c.mots = [['expérience aléatoire', 'on ne peut pas prévoir le résultat', 'Tourner la roue du magasin.'], ['issue', 'un résultat possible', 'Le secteur « panier garni ».'], ['événement', 'un ensemble d’issues', '« Gagner un bon de réduction ».'], ['probabilité', 'nombre entre 0 et 1 qui mesure les chances', 'P(panier) = 1/12.'], ['événement contraire', '« non A » : A ne se produit pas', '« Ne rien gagner ».'], ['fréquence', 'nombre de fois observé ÷ nombre d’essais', '47 paniers sur 600 clients.'], ['fluctuation', 'la fréquence change d’un échantillon à l’autre', 'Lundi 0,05, mardi 0,11.']];

  /* ---------- exercices résolus ---------- */
  chk(1 / 10 === .1 && 5 / 10 === .5 && 2 / 40 === .05 && 8 / 40 === .2 && rnd(1 - .2, 2) === .8, 'c6 résolus');
  c.resolus = [
    { titre: 'Probabilité et événement contraire', outil: '🧮 calculatrice', enonce: `Une roue a ${H('10 secteurs identiques')} : ${H('1')} « bon de 15 € », ${H('4')} « − 10 % », ${H('5')} « merci ». Calcule P(bon de 15 €), P(gagner quelque chose), P(ne rien gagner).`,
      rows: [['10 cas possibles', 'Je compte toutes les issues : les 10 secteurs.'], ['P(bon) = 1 ÷ 10 = <b class="nw">0,1</b>', '1 cas favorable.'], ['P(gagner) = 5 ÷ 10 = <b class="nw">0,5</b>', '1 + 4 = 5 cas favorables.'], ['P(rien) = 1 − 0,5 = <b class="nw">0,5</b>', '« Ne rien gagner » est le contraire de « gagner ».']], verif: '5 secteurs « merci » sur 10 : 5 ÷ 10 = 0,5 ✓.', rep: 'P(bon) = 0,1 ; P(gagner) = 0,5 ; P(rien) = 0,5.', go: ['e1'] },
    { titre: 'À toi : la même méthode', outil: '🧮 calculatrice', enonce: `Une urne contient ${H('40 tickets')} : ${H('2')} « parfum offert », ${H('6')} « − 20 % », ${H('32')} « merci ». Calcule P(parfum), P(gagner), P(ne rien gagner).`, trous: [0, 1, 2, 3],
      rows: [['⟦40⟧ cas possibles', 'Je compte toutes les issues : les tickets.'], ['P(parfum) = 2 ÷ 40 = ⟦0,05⟧', '2 cas favorables.'], ['P(gagner) = ⟦8⟧ ÷ 40 = ⟦0,2⟧', '2 + 6 cas favorables.'], ['P(rien) = 1 − 0,2 = ⟦0,8⟧', '« Ne rien gagner » est le contraire de « gagner ».']], verif: '32 tickets « merci » sur 40 : 32 ÷ 40 = 0,8 ✓.', rep: 'P(parfum) = 0,05 ; P(gagner) = 0,2 ; P(rien) = 0,8.', go: ['e1'] }];
  c.entraine = [{ id: 'e1', gen: 'c6e1', lc: 2 }, { id: 'e2', gen: 'c6e2', lc: 3 }, { id: 'e3', gen: 'c6e3', lc: 4 }];

  /* ---------- je résous ---------- */
  const pick = id => old.probs.find(p => p.id === id);
  c.probs = [
    adapt(pick('p1'), { etape: 2, hints: ['Cas possibles : les 200 cartes.', 'Notion 2 : cas favorables ÷ cas possibles.', 'c. « Ne rien gagner » est le contraire de « gagner quelque chose ».'], err: { 0: [{ v: 2, m: 'C’est le nombre de cartes gagnantes. Divise-le par le nombre total de cartes.' }, { v: 100, m: 'Tu as divisé dans le mauvais sens : 2 ÷ 200.' }], 1: [{ v: .09, m: 'Tu as compté seulement les cartes « − 10 % ». « Gagner quelque chose » compte aussi les bons d’achat.' }] } }),
    adapt(pick('c1'), { etape: 3, defi: 4, bulle: 'Ce cas se fait en 4 étapes. Lis bien le graphique : chaque point est un échantillon de 100 clients. La notion 4 explique pourquoi les points ne sont pas tous à la même hauteur.', autravail: { comp: 'val', txt: 'vérifier une affirmation du directeur avec des données, avant de commander du matériel.' }, hints: ['Repère le point le plus bas et le plus haut.', 'Étendue = plus grande − plus petite fréquence.', 'Moyenne : additionne les 10 fréquences, puis divise par 10.'] }),
    adapt(pick('b1'), { etape: 4, defi: 5, bulle: 'Voici la question du début du chapitre ! Elle se fait en 5 étapes. Les deux premières ressemblent à l’exemple de la notion 2. Une question ratée ne fait pas un exercice raté : continue.', autravail: { comp: 'com', txt: 'prévoir le bon nombre de lots pour un jeu en magasin : ni rupture, ni gaspillage.' }, hints: ['12 secteurs identiques : 12 cas possibles.', 'Fréquence = 47 ÷ 600.', 'Nombre de paniers à prévoir ≈ 600 × probabilité.'], err: { 0: [{ v: 12, m: 'Tu as divisé dans le mauvais sens : 1 ÷ 12.' }], 2: [{ v: 12.77, m: 'Tu as divisé dans le mauvais sens : 47 ÷ 600.' }] } })];

  c.bilan = [['Je sais calculer une probabilité.', ['e1', 'p1']], ['Je sais utiliser l’événement contraire.', ['p1']], ['Je sais compter les issues.', ['e2']], ['Je sais expliquer la fluctuation.', ['e3', 'c1', 'b1']]];
  c.words = old.words;
  c.plusloin = { meca: old.meca, probs: old.probs.filter(p => !['p1', 'c1', 'b1'].includes(p.id)) };
  return c;
};
