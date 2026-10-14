/* Chapitre 2 · Résolution graphique — 1re Bac Pro. */
'use strict';
const K = require('./kit1');
const { rnd, H, FM, R, Q, BQ, PB, prog, rais, S, T, Rc, Ln, Ar, Br, st, Sketch, MCVP, bl } = K;
const { SK } = require('./sk1');
const RED = MCVP.RED, BLUE = MCVP.BLUE;

module.exports = function (chk) {
  const c = { id: 'c2', n: 2, col: 'fonction', icone: '📈', dom: 'Algèbre-analyse · résolution graphique', titre: 'Lire et résoudre avec un graphique' };
  c.travail = { question: `Au salon des créateurs, l’offre A coûte ${H('25 € par jour')}. L’offre B demande ${H('60 € de forfait')} puis ${H('15 € par jour')}. Pour combien de jours les deux offres coûtent-elles pareil ? Et ensuite, laquelle choisir ? Un graphique te répond en un coup d’œil.` };
  c.objectifs = ['Je saurai lire une image et un antécédent sur un graphique.', 'Je saurai résoudre f(x) = g(x) avec deux courbes.', 'Je saurai comparer deux offres avec f(x) ≥ g(x).', 'Je saurai trouver un seuil de rentabilité.'];
  c.depart = 'c2';

  /* offres du salon (fictives) */
  const A = j => 25 * j, B = j => 60 + 15 * j;
  chk(A(6) === 150 && B(6) === 150 && A(4) === 100 && B(4) === 120 && B(9) === 195 && A(8) > B(8) && A(3) < B(3), 'c2 offres');
  const gO = (lab) => MCVP.plot({ W: 600, H: 290, x: [0, 10, 1], y: [0, 300, 50], ml: 56, mt: 20, xl: 'jours', yl: 'coût (€)', fine: true, lab });
  const lignes = g => g.line(25, 0, { stroke: RED, w: 3 }) + g.line(15, 60, { stroke: BLUE, w: 3 });
  const nomA = g => g.txt(9.6, A(9.6), 'offre A', { dx: -6, dy: -10, a: 'end', fill: RED, cls: '' }), nomB = g => g.txt(9.6, B(9.6), 'offre B', { dx: -6, dy: 22, a: 'end', fill: BLUE, cls: '' });

  // 1. lire une image et un antécédent
  const g1 = gO('Offre B : 60 € de forfait puis 15 € par jour');
  const lecture = S(600, 290, st(1, g1.base + g1.line(15, 60, { stroke: BLUE, w: 3 }) + g1.txt(0.2, 250, 'offre B : 60 + 15 × j', { a: 'start', fill: BLUE, cls: '' }))
    + st(2, g1.guide(4, B(4)) + g1.dot(4, B(4), { fill: '#FFC233', r: 6 }) + g1.txt(4, B(4), 'image de 4 : 120 €', { dx: 12, dy: 22, a: 'start' }))
    + st(3, g1.guide(9, B(9)) + g1.dot(9, B(9), { fill: '#FFC233', r: 6 }) + g1.txt(9, B(9), 'antécédent de 195 : 9', { dx: -14, dy: -16, a: 'end' })),
  'Pour 4 jours, l’offre B coûte 120 euros ; pour 195 euros, on loue 9 jours');
  // 2. f(x) = g(x)
  const g2 = gO('Les offres A et B se croisent au point (6 ; 150)');
  const croise = S(600, 290, st(1, g2.base + lignes(g2) + nomA(g2) + nomB(g2))
    + st(2, g2.guide(6, 150) + g2.dot(6, 150, { r: 6.5, fill: '#FFC233' }) + g2.txt(6, 150, '(6 ; 150)', { dx: 12, dy: 28, a: 'start' }))
    + st(3, g2.txt(0.25, 285, 'même coût : 150 € pour 6 jours', { a: 'start' }) + g2.txt(0.25, 262, 'solution de 25 j = 60 + 15 j', { a: 'start' })),
  'Les deux droites se croisent pour 6 jours et 150 euros');
  // 3. f(x) >= g(x) : la droite la plus haute
  const g3 = gO('Avant 6 jours l’offre A est la moins chère, après c’est l’offre B');
  const compare = S(600, 290, st(1, g3.base + lignes(g3) + g3.dot(6, 150, { r: 5.5, fill: '#FFC233' }))
    + st(2, g3.band(0, 6, { fill: '#FFC233', op: .2 }) + g3.txt(3, 285, 'j < 6 : A moins chère', { fs: 13, a: 'middle' }))
    + st(3, g3.band(6, 10, { fill: '#1E7F45', op: .16 }) + g3.txt(8, 285, 'j > 6 : B moins chère', { fs: 13, a: 'middle' }))
    + st(4, g3.txt(8.6, 285 - 245, 'A au-dessus de B', { a: 'middle', dy: 4 })),
  'Zone de gauche : l’offre A est la moins chère ; zone de droite : l’offre B est la moins chère');
  // 4. seuil de rentabilité
  const Ct = q => 600 + 4 * q, Re = q => 12 * q;
  chk(Ct(75) === Re(75) && Re(75) === 900 && Re(50) < Ct(50) && Re(100) > Ct(100) && Re(100) - Ct(100) === 200, 'c2 seuil');
  const g4 = MCVP.plot({ W: 600, H: 300, x: [0, 150, 25], y: [0, 1800, 300], ml: 58, mt: 20, xl: 'bougies', yl: 'euros', fine: true, lab: 'Seuil de rentabilité de Mia : 75 bougies, 900 euros' });
  const seuilG = S(600, 300, st(1, g4.base + g4.line(12, 0, { stroke: BLUE, w: 3 }) + g4.line(4, 600, { stroke: RED, w: 3 }) + g4.txt(112, 1560, 'recette R(q)', { a: 'middle', fill: BLUE, cls: '' }) + g4.txt(125, 850, 'coût total C(q)', { a: 'middle', fill: RED, cls: '' }))
    + st(2, g4.guide(75, 900) + g4.dot(75, 900, { r: 6.5, fill: '#FFC233' }) + g4.txt(75, 900, 'seuil : 75 bougies', { dx: -12, dy: -16, a: 'end' }))
    + st(3, g4.band(0, 75, { fill: '#C2332A', op: .1 }) + g4.txt(30, 1600, 'perte', { fs: 15 }) + g4.txt(30, 1500, 'R(q) < C(q)', { fs: 12 }))
    + st(4, g4.band(75, 150, { fill: '#1E7F45', op: .12 }) + g4.txt(112, 450, 'bénéfice', { fs: 15 }) + g4.txt(112, 350, 'R(q) > C(q)', { fs: 12 })),
  'La recette dépasse le coût total à partir de 75 bougies');

  c.notions = [
    { titre: 'Lire une image et un antécédent', decouvre: { txt: `L’offre B coûte ${H('60 + 15 × j')} euros pour j jours. Combien coûtent ${H('4 jours')} ? Et combien de jours peut-on louer avec ${H('195 €')} ?`, img: SK.deuxOffres() },
      comprends: `<p>Une fonction associe à chaque nombre x un nombre f(x). Ici x est le nombre de jours et f(x) le coût.</p><p>L’<b>image</b> de 4 est le nombre f(4). On le lit ainsi : on part de 4 sur l’axe horizontal (les abscisses), on monte jusqu’à la courbe, puis on lit la valeur sur l’axe vertical (les ordonnées). On trouve 120 €.</p><p>Un <b>antécédent</b> de 195 est un nombre x tel que f(x) = 195. On part de 195 sur l’axe vertical, on va jusqu’à la courbe, puis on descend lire x sur l’axe horizontal. On trouve 9 jours.</p><p>Par le calcul : f(4) = 60 + 15 × 4 = 120, et 60 + 15 × 9 = 195.</p>`,
      vois: lecture, voisLeg: 'Les pointillés partent d’un axe, rejoignent la droite, puis vont vers l’autre axe. Pour une image, on part de l’axe horizontal ; pour un antécédent, de l’axe vertical.',
      retiens: `<p>${FM(R`f(a)=b \iff \text{le point }(a\,;\,b)\text{ est sur la courbe}`)}</p><p><b>b</b> est l’<b>image</b> de <b>a</b> ; <b>a</b> est un <b>antécédent</b> de <b>b</b>.</p>`,
      exemple: `<p>f(4) = <b>120</b> : l’image de 4 est 120 €.</p><p>f(9) = 195 : l’antécédent de 195 est <b>9</b> jours.</p>`,
      attention: 'Ne mélange pas les axes : l’image se lit sur l’axe vertical, l’antécédent sur l’axe horizontal.', astuce: { k: 'verif', t: 'Pour contrôler une lecture, remplace dans la formule : 60 + 15 × 9 = 195 ✓.' } },
    { titre: 'Résoudre f(x) = g(x)', decouvre: { txt: `L’offre A coûte ${H('25 € par jour')}. L’offre B coûte ${H('60 € + 15 € par jour')}. Pour quel nombre de jours le prix est-il le même ?`, img: SK.croisement() },
      comprends: `<p>Résoudre <b>f(x) = g(x)</b>, c’est chercher les nombres x pour lesquels deux fonctions donnent le même résultat.</p><p>Sur un graphique, on trace les deux courbes. Un point où elles se coupent a la même ordonnée sur les deux : c’est le <b>point d’intersection</b>. Son abscisse est la solution de l’équation, son ordonnée est la valeur commune.</p><p>Ici, les droites se croisent au point (6 ; 150). Les deux offres coûtent donc 150 € pour 6 jours.</p><p>Par le calcul : 25 j = 60 + 15 j donne 10 j = 60, donc j = 6. Le graphique et le calcul donnent la même réponse.</p>`,
      vois: croise, voisLeg: 'Le point jaune est le point d’intersection. On lit son abscisse (6 jours) puis son ordonnée (150 €).',
      retiens: `<p>${FM(R`f(x)=g(x) \iff x \text{ est l’abscisse d’un point d’intersection}`)}</p><p>Si les courbes ne se coupent pas, l’équation n’a pas de solution.</p>`,
      exemple: `<p>Intersection : <b>(6 ; 150)</b>.</p><p>Solution : 6 jours ; coût commun : 150 €.</p>`,
      attention: 'La solution est l’abscisse du point (le nombre de jours), pas son ordonnée (le coût).', astuce: { k: 'sens', t: 'Demande-toi ce que l’axe horizontal représente : c’est lui qui donne la solution.' } },
    { titre: 'Comparer : f(x) ≥ g(x)', decouvre: { txt: `Pour ${H('3 jours')}, puis pour ${H('8 jours')}, quelle offre est la moins chère ? Comment le voir sans calcul sur le graphique ?`, img: SK.auDessus() },
      comprends: `<p>Résoudre <b>f(x) ≥ g(x)</b>, c’est chercher les valeurs de x pour lesquelles la courbe de f est <b>au-dessus</b> de celle de g (ou à la même hauteur).</p><p>Pour comparer deux prix, la moins chère est la plus <b>basse</b>. Le point d’intersection partage le graphique en deux zones.</p><p>Avant 6 jours, la droite de l’offre A est en dessous : A est la moins chère. Après 6 jours, c’est la droite de l’offre B.</p><p>Vérification : pour 3 jours, A coûte 75 € et B coûte 105 €. Pour 8 jours, A coûte 200 € et B coûte 180 €.</p>`,
      vois: compare, voisLeg: 'Chaque zone est colorée : à gauche de 6 jours, A est la plus basse ; à droite, c’est B.',
      retiens: `<p>${FM(R`f(x)\ge g(x) \iff \text{la courbe de } f \text{ est au-dessus de celle de } g`)}</p><p>On lit les <b>intervalles</b> de x, par exemple « x > 6 ».</p>`,
      exemple: `<p>A ≥ B quand j ≥ 6 : à partir de 6 jours, A est plus chère.</p><p>La moins chère pour 8 jours : <b>B</b> (180 € contre 200 €).</p>`,
      wide: K.rais('un exemple ne prouve pas', `<p>Pour 3 jours, A est moins chère. Peut-on dire « A est toujours moins chère » ? <b>Non</b> : un seul <b>contre-exemple</b> suffit. Ici, pour 8 jours, B est moins chère. Pour affirmer une règle, il faut regarder tout le graphique, pas un seul point.</p>`),
      attention: 'La moins chère est la droite la plus basse, pas la plus haute.', astuce: { k: 'vite', t: 'Repère d’abord le point d’intersection : il sépare les deux zones à comparer.' } },
    { titre: 'Le seuil de rentabilité', decouvre: { txt: `Mia vend ses bougies ${H('12 €')}. Son coût total est ${H('600 + 4q')}. À partir de combien de bougies gagne-t-elle de l’argent ?`, img: SK.seuil() },
      comprends: `<p>Le <b>seuil de rentabilité</b> est le nombre d’articles à vendre pour que la recette égale le coût total : R(q) = C(q). En dessous, l’entreprise perd de l’argent. Au-dessus, elle fait un bénéfice.</p><p>Sur le graphique, c’est le point d’intersection de la droite de la recette et de celle du coût total. Ici, il est en (75 ; 900) : 75 bougies, 900 €.</p><p>Par le calcul : 12 q = 600 + 4 q donne 8 q = 600, donc q = 75.</p><p>Contrôle : pour 100 bougies, le résultat est 1 200 − 1 000 = 200 € ; pour 50 bougies, 600 − 800 = − 200 €.</p>`,
      vois: seuilG, voisLeg: 'La zone rouge est la zone de perte (la recette est sous le coût). La zone verte est la zone de bénéfice.',
      retiens: `<p>${FM(R`\text{seuil de rentabilité} : R(q)=C(q)`)}</p><p>Pour Mia : ${FM(R`12q=600+4q \iff 8q=600 \iff q=75`)}</p>`,
      exemple: `<p>q = 75 : R = C = <b>900 €</b>.</p><p>q = 50 : perte de 200 €. q = 100 : bénéfice de 200 €.</p>`,
      wide: K.prog('trouver le seuil', 'Une boucle <code>while</code> répète tant qu’une condition est vraie. Ici, on augmente q tant que la recette est plus petite que le coût.', `q = 0\nwhile 12 * q < 600 + 4 * q:\n    q = q + 1\nprint(q)   # affiche 75`, `<p class="prog-q">Quel nombre affiche le programme ? ${bl(14, '75')} Pourquoi s’arrête-t-il ? ${bl(60, 'la recette n’est plus plus petite que le coût')}</p>`),
      attention: 'Au seuil, le résultat est nul (ni bénéfice ni perte). Le bénéfice commence après le seuil.', astuce: { k: 'og', t: 'Contrôle : à 75 bougies, 12 × 75 = 900 et 600 + 4 × 75 = 900. Les deux nombres sont égaux.' } }];

  c.mots = [['image', 'valeur f(x) associée à un nombre x', 'L’image de 4 jours est 120 €.'], ['antécédent', 'nombre x dont l’image est donnée', 'Un antécédent de 195 € est 9 jours.'], ['abscisse', 'position sur l’axe horizontal', 'L’abscisse du point est 6.'], ['ordonnée', 'position sur l’axe vertical', 'L’ordonnée du point est 150.'], ['courbe représentative', 'ensemble des points (x ; f(x))', 'La courbe de l’offre B est une droite.'], ['point d’intersection', 'point commun à deux courbes', 'Les droites se coupent au point (6 ; 150).'], ['équation', 'égalité à résoudre, comme f(x) = g(x)', 'L’équation 25j = 60 + 15j a pour solution 6.'], ['contre-exemple', 'un cas qui montre qu’une affirmation est fausse', 'Pour 8 jours, B est moins chère : c’est un contre-exemple.'], ['seuil de rentabilité', 'quantité pour laquelle recette et coût total sont égaux', 'Le seuil de rentabilité est de 75 bougies.']];

  /* ---------- exercices résolus ---------- */
  chk(25 * 6 === 150 && 60 + 15 * 6 === 150 && 900 / 20 === 45 && 35 * 45 === 900 + 15 * 45 && 35 * 45 === 1575, 'c2 résolus');
  c.resolus = [
    { titre: 'Lire un graphique : comparer deux offres', outil: '🧮 calculatrice', enonce: `Sur le graphique du salon, l’offre A est ${H('25 j')} et l’offre B est ${H('60 + 15 j')}. Détermine le nombre de jours pour lequel les prix sont égaux, puis l’offre la moins chère pour ${H('8 jours')}.`,
      rows: [['Les droites se coupent en <b class="nw">(6 ; 150)</b>', 'Je lis l’abscisse et l’ordonnée du point d’intersection.'], ['Les prix sont égaux pour <b class="nw">6 jours</b> (150 €)', 'La solution est l’abscisse.'], ['Pour 8 jours : A = 25 × 8 = <b class="nw">200 €</b> ; B = 60 + 15 × 8 = <b class="nw">180 €</b>', 'Je calcule les deux prix.'], ['La droite de B est plus basse : <b class="nw">B est moins chère</b>', 'Je compare avec le graphique.']], verif: 'Pour 6 jours : 25 × 6 = 150 et 60 + 15 × 6 = 150 ✓.', rep: 'Les prix sont égaux pour 6 jours. Pour 8 jours, l’offre B (180 €) est moins chère que l’offre A (200 €).', go: ['e1', 'e2'] },
    { titre: 'À toi : un seuil de rentabilité', outil: '🧮 calculatrice', enonce: `Léa vend un coffret ${H('35 €')}. Son coût total est ${H('900 + 15 q')}. Résous 35 q = 900 + 15 q pour trouver son seuil de rentabilité.`, trous: [0, 1, 2, 3],
      rows: [['35 q = 900 + 15 q', 'Recette égale coût total.'], ['35 q − 15 q = ⟦900⟧', 'Je regroupe les q d’un côté.'], ['20 q = 900, donc q = 900 ÷ ⟦20⟧ = ⟦45⟧', 'Je divise par 20.'], ['R(45) = 35 × 45 = ⟦1 575⟧ € et C(45) = 900 + 15 × 45 = ⟦1 575⟧ €', 'Je contrôle : les deux valeurs sont égales.']], verif: 'Pour 50 coffrets : 35 × 50 = 1 750 > 900 + 750 = 1 650 : bénéfice ✓.', rep: 'Le seuil de rentabilité est de 45 coffrets.', go: ['e3'] }];
  c.entraine = [{ id: 'e1', gen: 'c2e1', lc: 1 }, { id: 'e2', gen: 'c2e2', lc: 2 }, { id: 'e3', gen: 'c2e3', lc: 4 }];

  /* ---------- je résous ---------- */
  chk(4 + .5 * 4 === 6 && 1.5 * 4 === 6 && 4 + .5 * 10 === 9 && 1.5 * 10 === 15 && 15 - 9 === 6, 'c2 p1');
  chk(30 * 5 === 150 && 90 + 20 * 5 === 190 && 30 * 9 === 90 + 20 * 9 && 30 * 12 === 360 && 90 + 20 * 12 === 330, 'c2 p2');
  chk(1200 + 5 * 200 === 2200 && 13 * 200 === 2600 && 2600 - 2200 === 400 && 13 * 150 === 1200 + 5 * 150 && 13 * 120 - (1200 + 5 * 120) === -240, 'c2 p3');
  c.probs = [
    PB({ id: 'p1', etape: 2, lc: 2, comps: ['app', 'rea'], titre: 'Choisir un transporteur', intro: `<p>Pour envoyer un colis de x kg, Express facture ${H('4 € + 0,50 € par kg')} et Éco facture ${H('1,50 € par kg')}.</p>`,
      qs: [Q('a.', 'Calcule le prix Express pour 4 kg.', '4 + 0,5 × 4 = 6 €', 6, { w: 24 }), Q('b.', 'Calcule le prix Éco pour 4 kg.', '1,5 × 4 = 6 €', 6, { w: 24 }), Q('c.', 'Pour quel poids (en kg) les deux prix sont-ils égaux ? Résous 4 + 0,5 x = 1,5 x.', '4 = x donc x = 4 kg', 4, { w: 24 }), Q('d.', 'Pour 10 kg, combien d’euros économise-t-on avec le moins cher ?', 'Express : 9 € ; Éco : 15 € ; économie : 6 €', 6, { w: 24 })],
      err: { 2: [{ v: 6, m: 'Tu as donné le prix. Le poids est le nombre x de kilogrammes.' }], 3: [{ v: 9, m: 'Tu as donné le prix Express. L’économie est la différence des deux prix.' }, { v: 15, m: 'Tu as donné le prix Éco. L’économie est la différence des deux prix.' }] },
      hints: ['Remplace x par 4 dans chaque formule.', 'Égalité : 4 + 0,5 x = 1,5 x. Regroupe les x.', 'Pour 10 kg, calcule les deux prix puis fais la différence.'], pouce: 'Pour l’égalité, enlève 0,5 x des deux côtés : il reste 4 = x.', corr: 'a. 6 €. b. 6 €. c. x = 4 kg. d. 15 − 9 = 6 €.' }),
    PB({ id: 'p2', etape: 3, lc: 3, defi: 4, bulle: 'Ce cas se fait en 4 étapes. Calcule les deux prix, trouve où ils sont égaux, puis compare pour 12 jours.', autravail: { comp: 'ana', txt: 'comparer deux tarifs de location de stand et conseiller un client.' }, comps: ['ana', 'rea', 'val'], titre: 'Louer un stand de salon',
      intro: `<p>Pour un stand, le salon A demande ${H('30 € par jour')}. Le salon B demande ${H('90 € de forfait + 20 € par jour')}.</p>`,
      qs: [Q('a.', 'Calcule le prix du salon A pour 5 jours.', '30 × 5 = 150 €', 150, { w: 24 }), Q('b.', 'Calcule le prix du salon B pour 5 jours.', '90 + 20 × 5 = 190 €', 190, { w: 24 }), Q('c.', 'Pour combien de jours les prix sont-ils égaux ? Résous 30 j = 90 + 20 j.', '10 j = 90 donc j = 9', 9, { w: 24 }), Q('d.', 'Pour 12 jours, quel est le prix de l’offre la moins chère ?', 'A : 360 € ; B : 330 € ; la moins chère : B à 330 €', 330, { w: 24 })],
      err: { 0: [{ v: 120, m: 'Tu as additionné. Le prix de A est 30 multiplié par le nombre de jours.' }], 2: [{ v: 270, m: 'Tu as donné le prix commun. La question demande le nombre de jours.' }], 3: [{ v: 360, m: 'C’est le prix de A. Compare les deux prix et garde le plus petit.' }] },
      hints: ['Dans B, le forfait de 90 € se paie une seule fois.', 'Égalité : 30 j = 90 + 20 j. Enlève 20 j des deux côtés.', 'Pour 12 jours, calcule les deux prix et garde le plus petit.'], pouce: 'Au-delà de 9 jours, c’est l’offre au forfait qui devient la moins chère.', corr: 'a. 150 €. b. 190 €. c. j = 9 jours. d. B à 330 €.' }),
    PB({ id: 'p3', etape: 4, lc: 4, cls: 'bac', defi: 5, bulle: 'Voici une question de « vers le bac » : 5 étapes. Calcule le coût et la recette, trouve le seuil, puis justifie. Une question ratée ne fait pas un exercice raté : continue.', autravail: { comp: 'com', txt: 'dire à une commerçante à partir de quelle quantité sa nouvelle gamme est rentable.' }, comps: ['rea', 'ana', 'com'], titre: 'Une nouvelle gamme de bougies',
      intro: `<p>Mia lance une gamme de bougies de luxe. Son coût total est ${H('C(q) = 1 200 + 5 q')} et la recette est ${H('R(q) = 13 q')} (en euros, q bougies).</p>`,
      qs: [BQ('1', 'Calculer le coût total pour 200 bougies.', 'rea', '1 200 + 5 × 200 = 2 200 €', 2200, { w: 28 }), BQ('2', 'Calculer la recette pour 200 bougies.', 'rea', '13 × 200 = 2 600 €', 2600, { w: 28 }), BQ('3', 'Calculer le résultat pour 200 bougies.', 'rea', '2 600 − 2 200 = 400 €', 400, { w: 28 }), BQ('4', 'Résoudre 13 q = 1 200 + 5 q pour trouver le seuil de rentabilité.', 'ana', '8 q = 1 200 donc q = 150 bougies', 150, { w: 28 }), BQ('5', 'Justifier : avec 120 bougies vendues, Mia gagne-t-elle de l’argent ?', 'com', 'Non : 120 < 150. R = 1 560 € et C = 1 800 € : une perte de 240 €.', null, { lines: 3 })],
      err: { 0: [{ v: 1000, m: 'Tu as oublié les charges fixes de 1 200 €.' }], 2: [{ v: -400, m: 'Le résultat est « recette − coût total ».' }], 3: [{ v: 900, m: 'Tu as donné la recette au seuil. La question demande le nombre de bougies.' }] },
      hints: ['Le coût total comprend les 1 200 € fixes.', 'Le seuil : recette égale coût total, on regroupe les q.', 'Compare 120 au seuil de 150 bougies.'], pouce: 'Pour trouver le seuil, enlève 5 q des deux côtés : 8 q = 1 200.', corr: '1. 2 200 €. 2. 2 600 €. 3. 400 €. 4. q = 150. 5. Non : sous le seuil, c’est une perte de 240 €.' })];

  c.bilan = [['Je sais lire une image et un antécédent sur un graphique.', ['e1', 'p1']], ['Je sais résoudre f(x) = g(x) avec deux courbes.', ['e2', 'p2']], ['Je sais comparer deux offres.', ['e2', 'p2']], ['Je sais trouver un seuil de rentabilité.', ['e3', 'p3']]];
  c.words = require('./gl1')('c2');
  c.plusloin = { meca: [], probs: [] };
  return c;
};
