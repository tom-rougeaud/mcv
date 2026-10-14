/* Chapitre 6 · Probabilités — Terminale Bac Pro (arrêté du 3 février 2020). */
'use strict';
const K = require('./kitT');
const { rnd, H, FM, R, Q, BQ, PB, S, T, Rc, Ar, st, MCVP, bl, tab } = K;
const { SK } = require('./skT');
const { MCVT } = require('../shared/train.js');
const { fr } = K.MCVG;

module.exports = function (chk) {
  const c = { id: 'c6', n: 6, col: 'geometrie', icone: '🎲', dom: 'Statistique et probabilités', titre: 'Probabilités', sous: 'Arbres pondérés et conditions' };
  c.parties = [{ t: 'Arbres pondérés', n: [1, 2] }, { t: 'Probabilités conditionnelles', n: [3, 4] }, { t: 'Indépendance', n: [5] }];
  c.travail = { question: `Une enseigne (entreprise fictive) livre ${H('60 %')} de ses commandes à domicile ; les autres sont retirées en magasin. ${H('15 %')} des colis livrés à domicile reviennent, contre ${H('5 %')} des retraits. Quelle part de tous les colis revient ? Un colis qui revient a-t-il plutôt été livré ? Notions 2 à 4.` };
  c.objectifs = ['Je saurai construire et lire un arbre pondéré.', 'Je saurai calculer la probabilité d’un chemin.', 'Je saurai calculer une probabilité conditionnelle, avec un arbre ou un tableau croisé.', 'Je saurai calculer une probabilité par la somme des chemins (probabilités totales).', 'Je saurai reconnaître deux évènements indépendants.'];
  c.depart = 'c6';

  /* ---------- données (enseigne fictive) ---------- */
  const pD = .6, pRD = .15, pRM = .05, DR = rnd(pD * pRD, 4), DN = rnd(pD * (1 - pRD), 4), MR = rnd((1 - pD) * pRM, 4), MN = rnd((1 - pD) * (1 - pRM), 4), pR = rnd(DR + MR, 4), pDR = rnd(DR / pR, 4);
  chk(DR === .09 && DN === .51 && MR === .02 && MN === .38 && rnd(DR + DN + MR + MN, 4) === 1 && pR === .11 && rnd(pDR, 3) === .818 && rnd(pD * pR, 4) === .066, 'c6 arbre des retours');
  const tree = MCVT.H.tree, inner = s => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const base = { A: ['D', 'M'], B: ['R', 'R̄'], w1: ['0,6', '0,4'], w2: [['0,15', '0,85'], ['0,05', '0,95']] };

  /* ---------- méthodes visuelles ---------- */
  const RED = MCVP.RED, BLUE = MCVP.BLUE;
  const note = (x, y, s, o = {}) => T(x, y, s, { fs: 13, c: 'kt', a: o.a || 'middle' });
  // 1. le vocabulaire de l’arbre
  const v1 = S(600, 300, st(1, `<g transform="translate(0 16)">${inner(tree(base))}</g>`)
    + st(2, note(34, 186, 'racine') + note(220, 24, 'nœud D') + note(110, 236, 'branche : 0,4', { a: 'middle' }))
    + st(3, `<g transform="translate(0 16)">${inner(tree({ ...base, hl: [0] }))}</g>` + note(470, 40, 'un chemin : D puis R', { a: 'start' }))
    + st(4, `<rect x="440" y="196" width="150" height="54" rx="8" class="k2 ks" stroke-width="2"/>` + T(515, 218, 'au nœud D :', { fs: 13 }) + T(515, 240, '0,15 + 0,85 = 1', { fs: 13, c: 'kt' })),
  'Un arbre pondéré : racine, nœuds D et M, branches pondérées, et le chemin D puis R');
  // 2. la probabilité d’un chemin
  const leaf = ['0,6 × 0,15 = 0,09', '0,6 × 0,85 = 0,51', '0,4 × 0,05 = 0,02', '0,4 × 0,95 = 0,38'];
  const v2 = S(600, 300, st(1, `<g transform="translate(0 0)">${inner(tree({ ...base }))}</g>`)
    + st(2, `<g transform="translate(0 0)">${inner(tree({ ...base, hl: [0], leaf: [leaf[0], '', '', ''] }))}</g>`)
    + st(3, `<g transform="translate(0 0)">${inner(tree({ ...base, hl: [0], leaf }))}</g>`)
    + st(4, T(300, 292, 'somme des 4 chemins : 0,09 + 0,51 + 0,02 + 0,38 = 1', { fs: 14, c: 'kt' })),
  'Chaque chemin a pour probabilité le produit de ses branches ; les quatre produits ont pour somme 1');
  // 3. la probabilité conditionnelle : on change de total
  const v3 = S(600, 280, st(1, `<rect x="30" y="30" width="540" height="70" rx="8" fill="#fff" stroke="#9aa3c7" stroke-width="1.6"/><rect x="30" y="30" width="324" height="70" rx="8" class="k2"/>` + T(192, 70, '600 livrées à domicile (D)', { fs: 14 }) + T(462, 70, '400 retirées (M)', { fs: 14 }) + T(300, 20, '1 000 commandes', { fs: 13, c: 'ts' }))
    + st(2, `<rect x="30" y="30" width="48.6" height="70" class="k" opacity=".85"/>` + T(54, 120, '90 R', { fs: 13, c: 'kt' }) + `<rect x="354" y="30" width="10.8" height="70" class="k" opacity=".85"/>` + T(360, 120, '20 R', { fs: 13, c: 'kt' }))
    + st(3, `<rect x="30" y="140" width="324" height="56" rx="8" fill="none" stroke="${RED}" stroke-width="2.6"/>` + T(192, 166, 'sachant D : on se place parmi les 600', { fs: 13.5 }) + T(192, 188, 'P<tspan baseline-shift="sub" font-size="10">D</tspan>(R) = 90 ÷ 600 = 0,15', { fs: 15, c: 'kt' }))
    + st(4, T(470, 160, 'P(D ∩ R) = 90 ÷ 1 000 = 0,09', { fs: 13.5 }) + T(470, 184, '0,09 ÷ 0,6 = 0,15', { fs: 13.5, c: 'kt' }) + T(300, 240, 'P<tspan baseline-shift="sub" font-size="10">A</tspan>(B) = P(A ∩ B) ÷ P(A)', { fs: 17, c: 'kt' })),
  'Sur 1 000 commandes, 600 livrées dont 90 retournées : sachant D, on divise par 600');
  // 4. la formule des probabilités totales
  const v4 = S(600, 330, st(1, inner(tree({ ...base, leaf: ['0,09', '0,51', '0,02', '0,38'] })))
    + st(2, inner(tree({ ...base, hl: [0, 2], leaf: ['0,09', '0,51', '0,02', '0,38'] })))
    + st(3, `<rect x="30" y="282" width="250" height="40" rx="8" class="k2 ks" stroke-width="2"/>` + T(155, 308, 'P(R) = 0,09 + 0,02 = 0,11', { fs: 14, c: 'kt' }))
    + st(4, T(440, 308, 'P<tspan baseline-shift="sub" font-size="10">R</tspan>(D) = 0,09 ÷ 0,11 ≈ 0,82', { fs: 14 })),
  'Deux chemins mènent à R ; la probabilité de R est la somme de leurs probabilités');
  // 5. indépendance : deux carrés unités
  const sq = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"`;
  const v5 = S(600, 290, st(1, T(150, 22, 'carte (F) et promotion (P)', { fs: 14 }) + sq(40, 34, 220, 200) + ` fill="#fff" stroke="#9aa3c7" stroke-width="1.6"/>` + sq(40, 34, 88, 200) + ` class="k2"/>` + T(84, 254, 'F : 0,4', { fs: 13 }) + T(194, 254, 'F̄ : 0,6', { fs: 13 }))
    + st(2, sq(40, 34, 220, 60) + ` fill="none" stroke="${RED}" stroke-width="2.4"/>` + sq(40, 34, 88, 60) + ` class="k" opacity=".85"/>` + T(84, 70, '0,12', { fs: 15, c: 'tw' }) + T(272, 70, 'P : 0,3', { fs: 13, a: 'start', fill: RED }) + T(150, 280, '0,4 × 0,3 = 0,12 : indépendants', { fs: 13.5, c: 'kt' }))
    + st(3, T(450, 22, 'livraison (D) et retour (R)', { fs: 14 }) + sq(340, 34, 220, 200) + ` fill="#fff" stroke="#9aa3c7" stroke-width="1.6"/>` + sq(340, 34, 132, 200) + ` class="k2"/>` + sq(340, 34, 132, 30) + ` class="k" opacity=".85"/>` + sq(472, 34, 88, 10) + ` class="k" opacity=".85"/>` + T(406, 254, 'D : 0,6', { fs: 13 }) + T(516, 254, 'M : 0,4', { fs: 13 }))
    + st(4, T(406, 84, '15 %', { fs: 13, c: 'kt' }) + T(516, 64, '5 %', { fs: 13, c: 'kt' }) + T(450, 280, 'proportions différentes : pas indépendants', { fs: 13.5, c: 'kt' })),
  'À gauche, la part de P est la même dans F et hors de F : indépendants. À droite, la part de R change entre D et M : pas indépendants');

  c.notions = [
    { titre: 'L’arbre pondéré', decouvre: { txt: `Une enseigne (entreprise fictive) livre ${H('60 %')} de ses commandes en ligne à domicile (D) ; les autres sont retirées en magasin (M). ${H('15 %')} des colis livrés à domicile sont retournés (R), contre ${H('5 %')} des retraits. Comment représenter ces informations ?`, img: SK.colis() },
      comprends: `<p>Un <b>arbre pondéré</b> représente une expérience en plusieurs étapes. Il part d’une <b>racine</b>. Chaque <b>nœud</b> est un évènement. Chaque <b>branche</b> porte une probabilité : sa <b>pondération</b>.</p><p>Ici, la première étape est le mode de livraison : D ou M. La seconde est le retour : R, ou son contraire R̄.</p><p>Sur les branches de la deuxième étape, on écrit des probabilités <b>conditionnelles</b>. Ainsi, 0,15 est la probabilité d’un retour sachant que le colis est livré à domicile.</p><p><b>Règle des nœuds</b> : la somme des probabilités des branches issues d’un même nœud vaut 1. Ainsi P(M) = 1 − 0,6 = 0,4.</p>`,
      vois: v1, voisLeg: 'La racine à gauche, les nœuds D et M, puis R et R̄. Le chemin rouge va de la racine à « D puis R ». Au nœud D, les branches font 1 en tout.',
      retiens: `<p>Racine, nœud, branche, chemin. Sur une branche de la 2e étape : une probabilité conditionnelle, par exemple ${FM(R`P_D(R)=0{,}15`)}.</p><p>Règle des nœuds : la somme des branches issues d’un même nœud vaut 1.</p>`,
      exemple: `<p>P(M) = 1 − 0,6 = <b>0,4</b>.</p><p>P<sub>D</sub>(R̄) = 1 − 0,15 = <b>0,85</b>.</p>`,
      attention: '0,15 n’est pas la probabilité qu’un colis soit retourné : c’est la probabilité qu’il soit retourné sachant qu’il est livré à domicile.', astuce: { k: 'verif', t: 'Vérifie chaque nœud : les branches qui en partent font 1 en tout.' } },
    { titre: 'La probabilité d’un chemin', decouvre: { txt: `Quelle est la probabilité qu’une commande soit livrée à domicile ${H('et')} retournée ?`, img: SK.arbreMini() },
      comprends: `<p>Un <b>chemin</b> va de la racine à une extrémité de l’arbre. Il correspond à l’intersection des évènements rencontrés.</p><p>La probabilité d’un chemin est le <b>produit</b> des probabilités de ses branches. P(D ∩ R) = 0,6 × 0,15 = 0,09 : 9 % des commandes sont livrées à domicile, puis retournées.</p><p>Les quatre chemins donnent 0,09 ; 0,51 ; 0,02 et 0,38. Leur somme vaut 1 : on a bien envisagé tous les cas possibles.</p><p>Sur 1 000 commandes, on peut donc s’attendre à environ 90 retours de colis livrés à domicile.</p>`,
      vois: v2, voisLeg: 'À droite de chaque extrémité, la probabilité du chemin : le produit des deux branches. Le chemin rouge, D puis R, vaut 0,09.',
      retiens: `<p>${FM(R`P(D\cap R)=P(D)\times P_D(R)`)}</p><p>La somme des probabilités de tous les chemins vaut 1.</p>`,
      exemple: `<p>P(M ∩ R) = 0,4 × 0,05 = <b>0,02</b>.</p><p>0,09 + 0,51 + 0,02 + 0,38 = <b>1</b>.</p>`,
      wide: K.prog('simuler 1 000 commandes', 'Le module <code>random</code> tire un nombre au hasard entre 0 et 1. Un nombre inférieur à 0,6 représente une livraison à domicile.', `import random\nretours = 0\nfor k in range(1000):\n    if random.random() < 0.6:\n        if random.random() < 0.15:\n            retours = retours + 1\nprint(retours)     # environ 90`, `<p class="prog-q">Que compte la variable <code>retours</code> ? ${bl(56, 'les commandes livrées à domicile puis retournées')} Pourquoi le résultat change-t-il d’une exécution à l’autre ? ${bl(40, 'c’est une simulation du hasard')}</p>`),
      attention: 'Le long d’un chemin, on multiplie : on n’additionne pas 0,6 et 0,15.', astuce: { k: 'og', t: 'La probabilité d’un chemin est plus petite que chacune de ses branches : 0,09 < 0,15 < 0,6.' } },
    { titre: 'La probabilité conditionnelle', decouvre: { txt: `Sur ${H('1 000 commandes')}, 600 sont livrées à domicile, et ${H('90')} d’entre elles sont retournées. Parmi les colis livrés à domicile, quelle proportion est retournée ?`, img: SK.retour() },
      comprends: `<p>La <b>probabilité de B sachant A</b>, notée P<sub>A</sub>(B), est la probabilité de B quand on sait que A est réalisé. On se place uniquement parmi les cas où A a lieu.</p><p>Dans un tableau croisé, on lit une ligne ou une colonne : P<sub>D</sub>(R) = 90 ÷ 600 = 0,15.</p><p>Avec les probabilités : P<sub>A</sub>(B) = P(A ∩ B) ÷ P(A). Ici, 0,09 ÷ 0,6 = 0,15 : on retrouve la pondération de la branche.</p><p>L’ordre compte. P<sub>R</sub>(D) est la probabilité qu’un colis retourné ait été livré à domicile. C’est un autre nombre : environ 0,82, calculé à la notion suivante.</p>`,
      vois: v3, voisLeg: 'Sachant D, on ne regarde que les 600 commandes livrées à domicile : 90 sur 600, soit 0,15.',
      retiens: `<p>${FM(R`P_A(B)=\dfrac{P(A\cap B)}{P(A)}`)}</p><p>et donc ${FM(R`P(A\cap B)=P(A)\times P_A(B)`)}</p>`,
      exemple: `<p>P<sub>D</sub>(R) = 0,09 ÷ 0,6 = <b>0,15</b>.</p><p>Tableau croisé : 90 retours sur 600 livraisons.</p>`,
      wide: K.rais('l’ordre des évènements', `<p>P<sub>D</sub>(R) et P<sub>R</sub>(D) ne répondent pas à la même question. La première : parmi les colis livrés à domicile, combien reviennent ? La seconde : parmi les colis revenus, combien avaient été livrés à domicile ? Avant de calculer, repère l’évènement qui suit le mot « sachant ».</p>`),
      attention: 'P<sub>D</sub>(R) se calcule sur les 600 livraisons à domicile, et non sur les 1 000 commandes.', astuce: { k: 'sens', t: '« Sachant D » veut dire « parmi les D » : on change de total.' } },
    { titre: 'La formule des probabilités totales', decouvre: { txt: `Quelle est la probabilité qu’un colis, ${H('quel que soit son mode de livraison')}, soit retourné ? Et si un colis revient, quelle est la probabilité qu’il ait été livré à domicile ?`, img: SK.colis() },
      comprends: `<p>Un retour peut venir de deux chemins : D puis R, ou M puis R. Ces deux chemins ne peuvent pas se produire en même temps.</p><p>La probabilité de R est donc la <b>somme des probabilités des chemins</b> qui mènent à R : P(R) = 0,09 + 0,02 = 0,11. C’est la formule des probabilités totales.</p><p>11 % des colis reviennent : c’est entre 5 % et 15 %, plus près de 15 %, car la livraison à domicile est plus fréquente.</p><p>On peut ensuite « remonter » l’arbre : P<sub>R</sub>(D) = P(D ∩ R) ÷ P(R) = 0,09 ÷ 0,11 ≈ 0,82. Plus de 8 retours sur 10 viennent de livraisons à domicile.</p>`,
      vois: v4, voisLeg: 'Les deux chemins rouges mènent à R. On additionne leurs probabilités : 0,09 + 0,02 = 0,11.',
      retiens: `<p>${FM(R`P(R)=P(D)\times P_D(R)+P(M)\times P_M(R)`)}</p><p>On additionne les probabilités de tous les chemins qui mènent à R.</p>`,
      exemple: `<p>P(R) = 0,6 × 0,15 + 0,4 × 0,05 = <b>0,11</b>.</p><p>P<sub>R</sub>(D) = 0,09 ÷ 0,11 ≈ <b>0,818</b>.</p>`,
      attention: 'P(R) n’est pas 0,15 + 0,05 = 0,20 : on additionne les chemins (des produits), pas les branches.', astuce: { k: 'og', t: 'P(R) est toujours comprise entre les deux probabilités conditionnelles : 0,05 ≤ 0,11 ≤ 0,15.' } },
    { titre: 'Évènements indépendants', decouvre: { txt: `Dans un magasin (enquête fictive), ${H('40 %')} des clients ont la carte de fidélité (F), ${H('30 %')} achètent un article en promotion (P), et ${H('12 %')} font les deux. Avoir la carte change-t-il la probabilité d’acheter en promotion ?`, img: SK.indep() },
      comprends: `<p>Deux évènements A et B sont <b>indépendants</b> quand l’un n’a pas d’influence sur l’autre. Savoir que A est réalisé ne change pas la probabilité de B : P<sub>A</sub>(B) = P(B).</p><p>C’est équivalent à : <b>P(A ∩ B) = P(A) × P(B)</b>.</p><p>Pour la carte et la promotion : P(F) × P(P) = 0,4 × 0,3 = 0,12 = P(F ∩ P). Les évènements sont indépendants : la carte ne change pas l’achat en promotion.</p><p>Pour la livraison et le retour : P(D) × P(R) = 0,6 × 0,11 = 0,066, mais P(D ∩ R) = 0,09. Ils ne sont pas indépendants : un colis livré à domicile revient plus souvent.</p>`,
      vois: v5, voisLeg: 'À gauche, la promotion occupe la même part (30 %) avec ou sans carte. À droite, le retour occupe 15 % des D mais 5 % des M.',
      retiens: `<p>${FM(R`A \text{ et } B \text{ indépendants} \iff P(A\cap B)=P(A)\times P(B)`)}</p><p>ou encore ${FM(R`P_A(B)=P(B)`)}</p>`,
      exemple: `<p>0,4 × 0,3 = 0,12 = P(F ∩ P) : <b>indépendants</b>.</p><p>0,6 × 0,11 = 0,066 ≠ 0,09 : <b>pas indépendants</b>.</p>`,
      wide: K.rais('indépendants ou incompatibles ?', `<p>Deux évènements <b>incompatibles</b> ne peuvent pas se produire ensemble : P(A ∩ B) = 0. Deux évènements <b>indépendants</b> n’ont pas d’influence l’un sur l’autre. Ce sont deux notions différentes : la carte et la promotion sont indépendantes, et pourtant 12 % des clients ont les deux.</p>`),
      attention: 'Indépendants ne veut pas dire incompatibles : ici, 12 % des clients ont la carte et achètent en promotion.', astuce: { k: 'verif', t: 'Pour tester l’indépendance, compare deux nombres : P(A ∩ B) et le produit P(A) × P(B).' } }];

  c.mots = [['arbre pondéré', 'schéma d’une expérience en étapes, avec une probabilité sur chaque branche', 'L’arbre montre la livraison puis le retour.'], ['nœud', 'point de l’arbre d’où partent des branches', 'Au nœud D, les branches font 1.'], ['chemin', 'suite de branches de la racine à une extrémité', 'Le chemin D puis R vaut 0,09.'], ['probabilité conditionnelle', 'probabilité de B quand on sait que A est réalisé', 'P sachant D de R vaut 0,15.'], ['intersection A ∩ B', 'A et B se produisent tous les deux', 'D ∩ R : livré à domicile et retourné.'], ['probabilités totales', 'somme des probabilités des chemins qui mènent à un évènement', 'P(R) = 0,09 + 0,02 = 0,11.'], ['évènement contraire', 'Ā : A ne se produit pas', 'R̄ : le colis n’est pas retourné.'], ['évènements indépendants', 'savoir que l’un a lieu ne change pas la probabilité de l’autre', 'La carte et la promotion sont indépendantes.']];

  /* ---------- exercices résolus ---------- */
  chk(rnd(.35 * .6, 4) === .21 && rnd(.65 * .4, 4) === .26 && rnd(.21 / .47, 4) === .4468, 'c6 résolu 1');
  chk(.5 * .2 === .1 && .1 / .5 === .2, 'c6 résolu 2');
  c.resolus = [
    { titre: 'Calculer avec un arbre', outil: '🧮 calculatrice', enonce: `Dans une boutique (fictive), ${H('35 %')} des clients paient par téléphone mobile (Mo), les autres par carte (Ca). Le panier dépasse 50 € (B) pour ${H('60 %')} des paiements mobiles et ${H('40 %')} des paiements par carte. Calcule P(B), puis P<sub>B</sub>(Mo).`,
      rows: [['P(Ca) = 1 − 0,35 = <b>0,65</b>', 'Règle des nœuds.'], ['P(Mo ∩ B) = 0,35 × 0,6 = <b>0,21</b> ; P(Ca ∩ B) = 0,65 × 0,4 = <b>0,26</b>', 'Probabilité d’un chemin : produit.'], ['P(B) = 0,21 + 0,26 = <b>0,47</b>', 'Somme des chemins qui mènent à B.'], ['P<sub>B</sub>(Mo) = 0,21 ÷ 0,47 ≈ <b>0,447</b>', 'P(Mo ∩ B) ÷ P(B).']], verif: '0,47 est bien entre 0,4 et 0,6 ✓.', rep: '47 % des paniers dépassent 50 € ; parmi eux, environ 44,7 % sont payés par mobile.', go: ['e1', 'e2'] },
    { titre: 'À toi : avis client et carte de fidélité', outil: '🧮 calculatrice', enonce: `Une enquête (fictive) donne : ${H('50 %')} des clients ont la carte (F), ${H('20 %')} laissent un avis en ligne (A), et ${H('10 %')} font les deux. Les évènements F et A sont-ils indépendants ?`, trous: [0, 1, 2, 3],
      rows: [['P(F) × P(A) = 0,5 × 0,2 = ⟦0,1⟧', 'On calcule le produit.'], ['P(F ∩ A) = ⟦0,1⟧', 'On lit l’énoncé.'], ['Le produit est égal à P(F ∩ A) : F et A sont ⟦indépendants⟧', 'Définition de l’indépendance.'], ['P<sub>F</sub>(A) = 0,1 ÷ 0,5 = ⟦0,2⟧', 'Contrôle : c’est bien P(A).']], verif: 'P<sub>F</sub>(A) = P(A) = 0,2 : avoir la carte ne change pas la probabilité de laisser un avis ✓.', rep: 'F et A sont indépendants.', go: ['e3'] }];
  c.entraine = [{ id: 'e1', gen: 'c6e1', lc: 2 }, { id: 'e2', gen: 'c6e2', lc: 3 }, { id: 'e3', gen: 'c6e3', lc: 5 }];

  /* ---------- je résous ---------- */
  chk(rnd(.2 * .1, 4) === .02 && 500 * .02 === 10 && rnd(.2 * .9, 4) === .18, 'c6 p1');
  chk(rnd(.7 * .12, 4) === .084 && rnd(.3 * .04, 4) === .012 && rnd(.084 + .012, 4) === .096 && rnd(.084 / .096, 4) === .875, 'c6 p2');
  chk(rnd(.55 * .8, 4) === .44 && rnd(.45 * .7, 4) === .315 && rnd(.44 + .315, 4) === .755 && rnd(.315 / .755, 3) === .417 && rnd(.45 * .755, 5) === .33975 && Math.round(2000 * .245) === 490, 'c6 p3');
  c.probs = [
    PB({ id: 'p1', etape: 2, lc: 2, comps: ['app', 'rea'], titre: 'Des cartes à gratter',
      intro: `<p>Pour son anniversaire, un magasin (entreprise fictive) offre une carte à gratter à chaque client. ${H('20 %')} des cartes sont gagnantes (G). Parmi les cartes gagnantes, ${H('10 %')} donnent un bon d’achat de 50 € (C) ; les autres, un bon de 5 €.</p>`,
      qs: [Q('a.', 'Construis l’arbre pondéré. Donne P(Ḡ).', '1 − 0,2 = 0,8', .8, { w: 22 }), Q('b.', 'Calcule la probabilité qu’un client gagne un bon de 50 €.', '0,2 × 0,1 = 0,02', .02, { w: 22, tol: .0006 }), Q('c.', 'Calcule la probabilité qu’un client gagne un bon de 5 €.', '0,2 × 0,9 = 0,18', .18, { w: 22, tol: .0006 }), Q('d.', 'Le magasin distribue 500 cartes. Combien de bons de 50 € peut-il prévoir ?', '500 × 0,02 = 10 bons', 10, { w: 22 })],
      err: { 1: [{ v: .1, m: '0,1 est la probabilité sachant que la carte est gagnante. Le chemin complet : 0,2 × 0,1.' }, { v: .3, m: 'Le long d’un chemin, on multiplie.' }] },
      hints: ['Au premier nœud : G (0,2) et Ḡ (0,8).', 'Bon de 50 € : chemin G puis C.', 'Nombre moyen de bons : nombre de cartes × probabilité.'], pouce: 'Chemin « gagnante puis bon de 50 € » : 0,2 × 0,1. Sur 500 cartes : 500 × cette probabilité.', corr: 'a. P(Ḡ) = 0,8. b. 0,02. c. 0,18. d. Environ 10 bons de 50 €.' }),
    PB({ id: 'p2', etape: 3, lc: 4, defi: 4, bulle: 'Ce cas se fait en 4 étapes. Dessine l’arbre d’abord : chaque réponse est un chemin, une somme de chemins, ou un quotient.', autravail: { comp: 'ana', txt: 'repérer d’où viennent les retours de colis, pour améliorer le service.' }, comps: ['app', 'rea', 'ana', 'com'], titre: 'D’où viennent les retours ?',
      intro: `<p>Une autre enseigne (fictive) livre ${H('70 %')} de ses commandes à domicile (D) ; les autres sont retirées en point relais. ${H('12 %')} des colis livrés à domicile sont retournés (R), contre ${H('4 %')} des colis retirés en point relais.</p>`,
      qs: [Q('a.', 'Calcule P(D ∩ R).', '0,7 × 0,12 = 0,084', .084, { w: 22, tol: .0006 }), Q('b.', 'Calcule P(R), la probabilité qu’un colis soit retourné.', '0,084 + 0,3 × 0,04 = 0,096', .096, { w: 22, tol: .0006 }), Q('c.', 'Un colis est retourné. Calcule la probabilité qu’il ait été livré à domicile.', '0,084 ÷ 0,096 = 0,875', .875, { w: 22, tol: .0006 }), Q('d.', 'Rédige une phrase pour le responsable logistique.', '9,6 % des colis reviennent, et 87,5 % des retours viennent de livraisons à domicile : c’est là qu’il faut agir.', null, { lines: 2 })],
      err: { 1: [{ v: .16, m: 'On n’additionne pas 0,12 et 0,04 : on additionne les chemins 0,7 × 0,12 et 0,3 × 0,04.' }], 2: [{ v: .12, m: '0,12 est P<sub>D</sub>(R). On demande P<sub>R</sub>(D) : divise P(D ∩ R) par P(R).' }] },
      hints: ['P(D ∩ R) : produit des branches du chemin D puis R.', 'P(R) : somme des deux chemins qui mènent à R.', 'P<sub>R</sub>(D) = P(D ∩ R) ÷ P(R).'], pouce: 'Chemins vers R : 0,7 × 0,12 et 0,3 × 0,04. Leur somme donne P(R). Puis P<sub>R</sub>(D) = 0,084 ÷ P(R).', corr: 'a. 0,084. b. 0,096. c. 0,875. d. Environ 1 colis sur 10 revient, et presque 9 retours sur 10 viennent de livraisons à domicile.' }),
    PB({ id: 'p3', etape: 4, lc: 5, cls: 'bac', defi: 5, bulle: 'Voici une question de « vers le bac » : 5 étapes. Arbre, probabilités totales, probabilité conditionnelle, puis indépendance. Une question ratée ne fait pas un exercice raté : continue.', autravail: { comp: 'com', txt: 'analyser l’efficacité d’un service client et proposer une amélioration.' }, comps: ['app', 'rea', 'val', 'com'], titre: 'Le service client',
      intro: `<p>Le service client d’une enseigne (fictive) reçoit des demandes par téléphone (T) ou par chat (C). ${H('55 %')} des demandes arrivent par téléphone. Le problème est résolu au premier contact (S) dans ${H('80 %')} des appels téléphoniques et dans ${H('70 %')} des chats.</p>`,
      qs: [BQ('1', 'Construire l’arbre pondéré de la situation.', 'app', 'T (0,55) puis S (0,8), S̄ (0,2) ; C (0,45) puis S (0,7), S̄ (0,3)', null, { lines: 2 }), BQ('2', 'Calculer P(S), la probabilité qu’une demande soit résolue au premier contact.', 'rea', '0,55 × 0,8 + 0,45 × 0,7 = 0,44 + 0,315 = 0,755', .755, { w: 22, tol: .0006 }), BQ('3', 'Une demande est résolue au premier contact. Calculer la probabilité qu’elle soit arrivée par chat, au millième.', 'rea', '0,315 ÷ 0,755 ≈ 0,417', .417, { w: 22, tol: .0006 }), BQ('4', 'Les évènements C et S sont-ils indépendants ? Justifier.', 'val', 'P(C) × P(S) = 0,45 × 0,755 ≈ 0,340 ≠ 0,315 = P(C ∩ S) : pas indépendants.', null, { lines: 2 }), BQ('5', 'Sur 2 000 demandes par mois, combien ne sont pas résolues au premier contact ? Proposer une piste au responsable.', 'com', '2 000 × 0,245 = 490 demandes ; améliorer le chat, moins efficace que le téléphone.', 490, { w: 22 })],
      err: { 1: [{ v: .75, m: 'On n’additionne pas 0,8 et 0,7 puis on ne divise pas par 2 : on additionne les chemins 0,55 × 0,8 et 0,45 × 0,7.' }], 2: [{ v: .7, m: '0,7 est P<sub>C</sub>(S). On demande P<sub>S</sub>(C) = P(C ∩ S) ÷ P(S).' }], 4: [{ v: 1510, m: '1 510 demandes sont résolues. On demande celles qui ne le sont pas : 1 − 0,755 = 0,245.' }] },
      hints: ['Au premier nœud : T (0,55) et C (0,45).', 'P(S) : somme des chemins T puis S et C puis S.', 'Indépendance : compare P(C ∩ S) au produit P(C) × P(S).'], pouce: 'P(S) = 0,44 + 0,315. P<sub>S</sub>(C) = 0,315 ÷ P(S). Puis compare 0,315 à 0,45 × P(S).', corr: '1. Arbre : T 0,55 (S 0,8 ; S̄ 0,2) et C 0,45 (S 0,7 ; S̄ 0,3). 2. 0,755. 3. ≈ 0,417. 4. 0,45 × 0,755 ≈ 0,340 ≠ 0,315 : pas indépendants. 5. 490 demandes non résolues ; agir sur le chat.' })];

  c.bilan = [['Je sais construire et lire un arbre pondéré.', ['e1', 'p1']], ['Je sais calculer la probabilité d’un chemin.', ['e1', 'p1']], ['Je sais calculer une probabilité conditionnelle.', ['e2', 'p2']], ['Je sais utiliser les probabilités totales.', ['e1', 'p2', 'p3']], ['Je sais reconnaître deux évènements indépendants.', ['e3', 'p3']]];
  c.words = require('./glT')('c6');
  c.plusloin = { meca: [], probs: [] };
  return c;
};
