/* Chapitre 6 · Statistique à deux variables — 1re Bac Pro. */
'use strict';
const K = require('./kit1');
const { rnd, H, FM, R, Q, BQ, PB, prog, rais, tab, S, T, Rc, Ln, Ar, Br, st, MCVP, bl } = K;
const { SK } = require('./sk1');
const RED = MCVP.RED, BLUE = MCVP.BLUE, GRN = MCVP.GRN, INK = MCVP.INK, ORG = MCVP.ORG;
const fr = (x, d = 2) => String(rnd(x, d)).replace('-', '− ').replace('.', ',');

module.exports = function (chk) {
  const c = { id: 'c6', n: 6, col: 'donnees', icone: '📊', dom: 'Statistique et probabilités · statistique à deux variables', titre: 'Statistique à deux variables quantitatives', sous: 'Prévoir avec une droite' };
  c.parties = [{ t: 'Nuage de points et ajustement affine', n: [1, 2] }, { t: 'Qualité de l’ajustement et prévisions', n: [3, 4] }];
  c.travail = { question: `Une boutique en ligne a noté, pendant 8 mois, son ${H('budget publicitaire')} et son ${H('chiffre d’affaires')}. Plus elle dépense en publicité, plus elle vend… à peu près. Combien peut-elle espérer vendre avec 1 000 € de publicité ? Une droite bien choisie aide à le prévoir, avec prudence.` };
  c.objectifs = ['Je saurai représenter un nuage de points et calculer le point moyen.', 'Je saurai obtenir une droite d’ajustement avec un outil numérique.', 'Je saurai interpréter le coefficient de détermination R².', 'Je saurai faire une prévision et en discuter la fiabilité.'];
  c.depart = 'c6';

  /* données du fil rouge (boutique fictive) : budget en centaines d’euros, CA en milliers d’euros */
  const X = [1, 2, 3, 4, 5, 6, 7, 8], Y = [21, 24, 28, 31, 34, 38, 41, 43], PTS = X.map((x, i) => [x, Y[i]]), F = MCVP.fit(PTS);
  const a = 3.24, b = 17.93, f = x => rnd(a * x + b, 2);
  chk(F.mx === 4.5 && F.my === 32.5 && rnd(F.a, 2) === a && rnd(F.b, 2) === b && rnd(F.r2, 3) === .996 && f(10) === 50.33 && f(4.5) === 32.51 && rnd((45 - b) / a, 2) === 8.35, 'c6 fil rouge');
  const rep = (lab, o = {}) => MCVP.plot({ W: 600, H: 290, x: [0, 9, 1], y: [10, 50, 5], ml: 52, mt: 26, mb: 36, xl: 'budget (centaines d’€)', yl: 'CA (k€)', fine: true, lab, ...o });

  // 1. nuage et point moyen
  const g1 = rep('Nuage de points du budget publicitaire et du chiffre d’affaires');
  const nuage = S(600, 290, st(1, g1.base + g1.pts(PTS, { r: 5.5, fill: BLUE }))
    + st(2, g1.guide(4.5, 32.5, { stroke: RED }) + g1.dot(4.5, 32.5, { r: 7, fill: '#FFC233', stroke: RED }) + g1.txt(4.5, 32.5, 'G (4,5 ; 32,5)', { dx: 14, dy: 22, a: 'start' }))
    + st(3, g1.txt(0.3, 46, 'x̄ = 36 ÷ 8 = 4,5', { a: 'start', fs: 13 }) + g1.txt(0.3, 42.5, 'ȳ = 260 ÷ 8 = 32,5', { a: 'start', fs: 13 })),
  'Huit points qui montent presque en ligne droite ; le point moyen G est au centre');
  // 2. droite des moindres carrés et écarts
  const g2 = rep('Droite d’ajustement par les moindres carrés');
  const resid = PTS.map(([x, y]) => g2.seg(x, y, x, F.a * x + F.b, { stroke: GRN, w: 2.4 })).join('');
  const ajust = S(600, 290, st(1, g2.base + g2.pts(PTS, { r: 5.5, fill: BLUE }))
    + st(2, g2.line(F.a, F.b, { stroke: RED, w: 2.8 }) + g2.dot(4.5, 32.5, { r: 6, fill: '#FFC233', stroke: RED }) + g2.txt(0.3, 46, 'y = 3,24 x + 17,93', { a: 'start', fill: RED, cls: '' }))
    + st(3, resid + g2.txt(0.3, 42.5, 'écarts verticaux (en vert) : les plus petits possible', { a: 'start', fs: 12, fill: GRN, cls: '' })),
  'La droite rouge passe au plus près des points et par le point moyen G');
  // 3. R² : deux nuages
  const Y2 = [30, 22, 35, 26, 38, 24, 33, 29], P2 = X.map((x, i) => [x, Y2[i]]), F2 = MCVP.fit(P2);
  chk(rnd(F2.r2, 2) === .02, 'c6 R² faible');
  const pan = (dx, pts, Fx, tt, r2) => { const g = MCVP.plot({ W: 290, H: 240, x: [0, 9, 1], y: [10, 50, 10], ml: 34, mr: 8, mt: 34, mb: 26, fs: 10, fine: true }); return `<g transform="translate(${dx} 0)">${g.base + g.line(Fx.a, Fx.b, { stroke: RED, w: 2.4 }) + g.pts(pts, { r: 4.5, fill: BLUE }) + T(150, 16, tt, { fs: 13, c: 'kt' }) + T(150, 31, r2, { fs: 12 })}</g>`; };
  const r2v = S(600, 240, st(1, pan(0, PTS, F, 'points proches de la droite', 'R² ≈ 0,996'))
    + st(2, pan(305, P2, F2, 'points dispersés', 'R² ≈ 0,02')),
  'À gauche, R² proche de 1 : la droite résume bien le nuage. À droite, R² proche de 0 : elle ne le résume pas');
  // 4. prévoir : interpolation / extrapolation
  const g4 = MCVP.plot({ W: 600, H: 290, x: [0, 12, 1], y: [10, 60, 10], ml: 52, mt: 26, mb: 36, xl: 'budget (centaines d’€)', yl: 'CA (k€)', fine: true, lab: 'Prévoir avec la droite : interpolation et extrapolation' });
  const prev = S(600, 290, st(1, g4.base + g4.band(1, 8, { fill: '#1E7F45', op: .12 }) + g4.band(8, 12, { fill: '#FFC233', op: .22 }) + g4.pts(PTS, { r: 5, fill: BLUE }) + g4.txt(4.5, 56, 'interpolation', { fs: 13, fill: GRN, cls: '' }) + g4.txt(10, 56, 'extrapolation', { fs: 13, fill: ORG, cls: '' }))
    + st(2, g4.line(a, b, { stroke: RED, w: 2.6 }))
    + st(3, g4.guide(10, f(10)) + g4.dot(10, f(10), { r: 6.5, fill: '#FFC233' }) + g4.txt(10, f(10), '≈ 50,33', { dx: 12, dy: 20, a: 'start' }))
    + st(4, g4.txt(0.3, 51, 'x = 10 : y ≈ 3,24 × 10 + 17,93', { a: 'start', fs: 13 })),
  'Entre 1 et 8, on interpole ; au-delà de 8, on extrapole : pour x = 10, on estime 50,33 k€');

  c.notions = [
    { titre: 'Nuage de points et point moyen', decouvre: { txt: `Chaque mois, la boutique note son ${H('budget publicitaire x')} (en centaines d’euros) et son ${H('chiffre d’affaires y')} (en milliers d’euros). Comment voir si les deux sont liés ?`, img: SK.nuage() },
      comprends: `<p>Une <b>série statistique à deux variables</b> associe à chaque individu (ici, un mois) deux nombres x et y.</p>${tab(['budget x', '1', '2', '3', '4', '5', '6', '7', '8'], [['CA y', '21', '24', '28', '31', '34', '38', '41', '43']], 'dt-c')}<p>Chaque couple (x ; y) devient un point : l’ensemble forme un <b>nuage de points</b>. Chaque point représente un mois. Ici, le nuage monte et ses points sont presque alignés : plus le budget augmente, plus le chiffre d’affaires augmente.</p><p>Le <b>point moyen</b> G a pour coordonnées la moyenne des x et la moyenne des y : x̄ = 36 ÷ 8 = 4,5 et ȳ = 260 ÷ 8 = 32,5. G (4,5 ; 32,5) est au « centre » du nuage.</p>`,
      vois: nuage, voisLeg: 'Chaque point bleu est un mois. Le point jaune G n’est pas un mois réel : c’est le point moyen.',
      retiens: `<p>${FM(R`\bar x=\dfrac{x_1+x_2+\dots+x_n}{n} \qquad \bar y=\dfrac{y_1+y_2+\dots+y_n}{n}`)}</p><p>Point moyen : <b>G (x̄ ; ȳ)</b>.</p>`,
      exemple: `<p>x̄ = 36 ÷ 8 = <b>4,5</b>.</p><p>ȳ = 260 ÷ 8 = <b>32,5</b>.</p>`,
      wide: K.prog('le point moyen', 'Une liste Python range les valeurs ; <code>sum</code> les additionne et <code>len</code> les compte.', `x = [1, 2, 3, 4, 5, 6, 7, 8]\ny = [21, 24, 28, 31, 34, 38, 41, 43]\nxm = sum(x) / len(x)\nym = sum(y) / len(y)\nprint(xm, ym)   # affiche 4.5 32.5`, `<p class="prog-q">Que contient <code>len(x)</code> ? ${bl(14, '8')} Pourquoi divise-t-on par ce nombre ? ${bl(50, 'pour faire la moyenne des 8 valeurs')}</p>`),
      attention: 'Dans un point, x vient toujours en premier : (4,5 ; 32,5), pas (32,5 ; 4,5).', astuce: { k: 'verif', t: 'Le point moyen est toujours au milieu du nuage : s’il tombe en dehors, recompte tes sommes.' } },
    { titre: 'La droite d’ajustement', decouvre: { txt: `Les points sont presque alignés. Quelle droite les résume le mieux ? Et peut-on la tracer sans « à peu près » à la règle ?`, img: SK.droiteAj() },
      comprends: `<p>Un <b>ajustement affine</b> remplace le nuage par une droite y = a x + b qui passe au plus près des points.</p><p>La <b>méthode des moindres carrés</b> choisit la droite qui rend la somme des carrés des écarts verticaux (en vert) la plus petite possible. Cette droite passe toujours par le point moyen G.</p><p>On la calcule avec un outil numérique. Dans un tableur : <b>=PENTE(B2:B9;A2:A9)</b> donne a ≈ 3,24 et <b>=ORDONNEE.ORIGINE(B2:B9;A2:A9)</b> donne b ≈ 17,93. Dans GeoGebra (tableur), l’outil « Régression à deux variables » donne la même droite.</p><p>Équation : y = 3,24 x + 17,93. Contrôle : 3,24 × 4,5 + 17,93 = 32,51 ≈ 32,5, l’ordonnée de G.</p>`,
      vois: ajust, voisLeg: 'La droite rouge est celle des moindres carrés. Les segments verts sont les écarts entre les points et la droite.',
      retiens: `<p>Droite des moindres carrés : ${FM(R`y=ax+b`)}, obtenue avec la calculatrice, le tableur ou GeoGebra.</p><p>Elle passe par le point moyen ${FM(R`G(\bar x\,;\,\bar y)`)}.</p>`,
      exemple: `<p>Tableur : a ≈ <b>3,24</b> ; b ≈ <b>17,93</b>.</p><p>y = 3,24 x + 17,93.</p>`,
      attention: 'Arrondis a et b seulement à la fin, et dis à quelle précision (ici, au centième).', astuce: { k: 'og', t: 'Contrôle : la droite doit passer par G. Remplace x par x̄ : tu dois retrouver à peu près ȳ.' } },
    { titre: 'Le coefficient de détermination R²', decouvre: { txt: `Deux nuages : l’un presque aligné, l’autre très dispersé. Une droite d’ajustement a-t-elle le même intérêt dans les deux cas ?`, img: SK.r2() },
      comprends: `<p>Le <b>coefficient de détermination</b>, noté R², mesure la qualité de l’ajustement affine. C’est un nombre entre 0 et 1.</p><p>Plus R² est <b>proche de 1</b>, plus les points sont proches de la droite : l’ajustement affine est pertinent. Plus R² est <b>proche de 0</b>, plus les points sont dispersés : la droite résume mal le nuage.</p><p>Dans le tableur : <b>=COEFFICIENT.DETERMINATION(B2:B9;A2:A9)</b>. Pour la boutique, R² ≈ 0,996 : très proche de 1.</p><p>Pour un autre nuage, très dispersé, on trouve R² ≈ 0,02 : une droite ne sert à rien pour prévoir.</p>`,
      vois: r2v, voisLeg: 'Les deux droites rouges sont des droites des moindres carrés. Seule celle de gauche résume bien son nuage.',
      retiens: `<p>${FM(R`0\le R^2\le 1`)}</p><p>R² proche de 1 : ajustement affine <b>pertinent</b>. R² proche de 0 : ajustement <b>pas pertinent</b>.</p>`,
      exemple: `<p>Boutique : R² ≈ <b>0,996</b> → pertinent.</p><p>Nuage dispersé : R² ≈ <b>0,02</b> → pas pertinent.</p>`,
      attention: 'R² ne dit pas si la droite monte ou descend : il dit seulement si les points en sont proches.', astuce: { k: 'sens', t: 'Lis R² comme une note de 0 à 1 : « la droite résume-t-elle bien le nuage ? ».' } },
    { titre: 'Prévoir et rester prudent', decouvre: { txt: `Avec la droite y = 3,24 x + 17,93, quel chiffre d’affaires prévoir pour ${H('1 000 €')} de publicité (x = 10) ? Peut-on faire confiance à cette prévision ?`, img: SK.prevoir() },
      comprends: `<p>Pour <b>estimer</b> y, on remplace x dans l’équation. Pour x = 10 : y ≈ 3,24 × 10 + 17,93 = 50,33 k€.</p><p>Quand x est dans la plage des données (ici de 1 à 8), on fait une <b>interpolation</b>. Quand x en sort, comme x = 10, on fait une <b>extrapolation</b>. Une extrapolation est plus risquée : rien ne garantit que la tendance continue. Plus on s’éloigne des données, moins l’estimation est sûre.</p><p>Pour trouver x à partir de y, on résout l’équation : 3,24 x + 17,93 = 45 donne x = 27,07 ÷ 3,24 ≈ 8,35.</p>`,
      vois: prev, voisLeg: 'La zone verte est celle des données (interpolation). La zone jaune est en dehors (extrapolation).',
      retiens: `<p>Estimation : ${FM(R`y\approx ax+b`)} · Recherche de x : ${FM(R`x=\dfrac{y-b}{a}`)}</p><p>Dans les données : <b>interpolation</b>. Hors des données : <b>extrapolation</b>, à prendre avec prudence.</p>`,
      exemple: `<p>x = 10 : y ≈ <b>50,33 k€</b> (extrapolation).</p><p>y = 45 : x ≈ <b>8,35</b>, soit 835 € de publicité.</p>`,
      wide: K.rais('corrélation n’est pas causalité', `<p>Les ventes de glaces et les coups de soleil augmentent ensemble : le nuage est presque aligné. Les glaces <b>causent</b>-elles les coups de soleil ? <b>Non</b> : les deux dépendent du soleil. Un bon ajustement montre un <b>lien statistique</b> (une corrélation), pas une <b>cause</b>.</p>`),
      attention: 'Une prévision est une estimation : écris « environ » ou ≈, jamais un résultat certain.', astuce: { k: 'vite', t: 'Avant de prévoir, regarde où se trouve x : dans les données ou en dehors ?' } }];

  c.mots = [['série à deux variables', 'liste de couples (x ; y) mesurés sur les mêmes individus', 'Budget et chiffre d’affaires forment une série à deux variables.'], ['nuage de points', 'ensemble des points (x ; y) dans un repère', 'Le nuage de points monte de gauche à droite.'], ['point moyen', 'point G (x̄ ; ȳ) dont les coordonnées sont les moyennes', 'Le point moyen est G (4,5 ; 32,5).'], ['ajustement affine', 'remplacer le nuage par une droite', 'Un ajustement affine permet de prévoir.'], ['moindres carrés', 'méthode qui rend minimale la somme des carrés des écarts', 'La droite des moindres carrés est donnée par le tableur.'], ['coefficient de détermination', 'nombre R² entre 0 et 1 qui mesure la qualité de l’ajustement', 'Le coefficient de détermination vaut 0,996.'], ['interpolation', 'estimation à l’intérieur des données', 'Pour x = 4,5, c’est une interpolation.'], ['extrapolation', 'estimation en dehors des données', 'Pour x = 10, c’est une extrapolation.'], ['corrélation', 'lien statistique entre deux variables', 'Une corrélation forte ne prouve pas une cause.']];

  /* ---------- exercices résolus ---------- */
  chk(rnd(45 - 17.93, 2) === 27.07 && rnd(27.07 / 3.24, 1) === 8.4, 'c6 résolus');
  c.resolus = [
    { titre: 'Ajuster et prévoir', outil: '💻 tableur', enonce: `Avec les données de la boutique (budget x, CA y), calcule le point moyen, donne la droite d’ajustement du tableur et estime le chiffre d’affaires pour ${H('x = 10')}.`,
      rows: [['x̄ = 36 ÷ 8 = <b class="nw">4,5</b> ; ȳ = 260 ÷ 8 = <b class="nw">32,5</b>', 'Les moyennes des x et des y.'], ['Tableur : a ≈ 3,24 ; b ≈ 17,93 ; R² ≈ 0,996', '=PENTE, =ORDONNEE.ORIGINE, =COEFFICIENT.DETERMINATION.'], ['<b class="nw">y = 3,24 x + 17,93</b> : ajustement pertinent', 'R² est très proche de 1.'], ['x = 10 : y ≈ 3,24 × 10 + 17,93 = <b class="nw">50,33 k€</b>', 'Une extrapolation : 10 est hors des données.']], verif: '3,24 × 4,5 + 17,93 = 32,51 ≈ 32,5 : la droite passe bien par G ✓.', rep: 'G (4,5 ; 32,5), y = 3,24 x + 17,93 ; pour 1 000 € de publicité, environ 50,33 k€ de chiffre d’affaires.', go: ['e1', 'e3'] },
    { titre: 'À toi : un objectif de chiffre d’affaires', outil: '🧮 calculatrice', enonce: `La boutique vise ${H('45 k€')} de chiffre d’affaires. Avec y = 3,24 x + 17,93, quel budget publicitaire prévoir ?`, trous: [0, 1, 2, 3],
      rows: [['3,24 x + 17,93 = 45', 'Je remplace y par 45.'], ['3,24 x = 45 − 17,93 = ⟦27,07⟧', 'J’enlève 17,93 des deux côtés.'], ['x = 27,07 ÷ 3,24 ≈ ⟦8,4⟧ (au dixième)', 'Je divise par 3,24.'], ['x > 8 : c’est une ⟦extrapolation⟧ ; budget ≈ ⟦840⟧ €', 'x est en centaines d’euros.']], verif: '3,24 × 8,4 + 17,93 = 45,146 ≈ 45 ✓.', rep: 'Il faut prévoir environ 840 € de publicité, avec prudence (extrapolation).', go: ['e2'] }];
  c.entraine = [{ id: 'e1', gen: 'c6e1', lc: 1 }, { id: 'e2', gen: 'c6e2', lc: 4 }, { id: 'e3', gen: 'c6e3', lc: 3 }];

  /* ---------- je résous ---------- */
  const F1 = MCVP.fit([[2, 15], [4, 27], [5, 30], [7, 42], [8, 48], [10, 57]]);
  chk(F1.mx === 6 && F1.my === 36.5 && rnd(F1.a, 2) === 5.29 && rnd(F1.b, 2) === 4.79 && rnd(5.29 * 9 + 4.79, 2) === 52.4 && rnd((70 - 4.79) / 5.29, 1) === 12.3, 'c6 p1');
  const F2b = MCVP.fit([[14, 62], [17, 80], [20, 101], [23, 118], [26, 140], [29, 157]]);
  chk(rnd(F2b.a, 2) === 6.4 && rnd(F2b.b, 2) === -27.93 && rnd(F2b.r2, 5) === .99905 && rnd(6.4 * 32 - 27.93, 2) === 176.87 && rnd((120 + 27.93) / 6.4, 1) === 23.1, 'c6 p2');
  const F3 = MCVP.fit([[2, 35], [4, 48], [6, 62], [8, 70], [10, 86], [12, 95]]);
  chk(F3.mx === 7 && F3.my === 66 && rnd(F3.a, 2) === 6.03 && rnd(F3.b, 2) === 23.8 && rnd(6.03 * 7 + 23.8, 2) === 66.01 && rnd(6.03 * 15 + 23.8, 2) === 114.25 && rnd(F3.r2, 3) === .995, 'c6 p3');
  c.probs = [
    PB({ id: 'p1', etape: 2, lc: 4, comps: ['app', 'rea'], titre: 'Visites et commandes', intro: `<p>Un site de vente note ses visites x (en centaines) et ses commandes y.</p>${tab(['visites x', '2', '4', '5', '7', '8', '10'], [['commandes y', '15', '27', '30', '42', '48', '57']], 'dt-c')}<p>Le tableur donne la droite d’ajustement ${H('y = 5,29 x + 4,79')}.</p>`,
      qs: [Q('a.', 'Calcule x̄.', '36 ÷ 6 = 6', 6, { w: 24 }), Q('b.', 'Calcule ȳ.', '219 ÷ 6 = 36,5', 36.5, { w: 24 }), Q('c.', 'Estime le nombre de commandes pour 900 visites (x = 9).', '5,29 × 9 + 4,79 = 52,4', 52.4, { w: 24, tol: .06 }), Q('d.', 'Combien de visites (en centaines, au dixième) pour 70 commandes ?', '(70 − 4,79) ÷ 5,29 ≈ 12,3', 12.3, { w: 24, tol: .06 })],
      err: { 0: [{ v: 36, m: 'Tu as fait la somme. Divise-la par le nombre de mois, 6.' }], 2: [{ v: 900, m: 'x est en centaines : 900 visites, c’est x = 9.' }], 3: [{ v: 375.09, m: 'Ici on connaît y : résous 5,29 x + 4,79 = 70.' }] },
      hints: ['Additionne les 6 valeurs, puis divise par 6.', 'Remplace x par 9 dans l’équation.', 'Pour trouver x : (y − b) ÷ a.'], pouce: 'x est exprimé en centaines de visites : 900 visites → x = 9.', corr: 'a. 6. b. 36,5. c. ≈ 52 commandes. d. ≈ 12,3, soit environ 1 230 visites.' }),
    PB({ id: 'p2', etape: 3, lc: 3, defi: 4, bulle: 'Ce cas se fait en 4 étapes. Lis les valeurs du tableur, arrondis-les, puis utilise l’équation dans les deux sens.', autravail: { comp: 'ana', txt: 'prévoir un stock de glaces selon la météo annoncée.' }, comps: ['ana', 'rea', 'val'], titre: 'Les glaces et la météo',
      intro: `<p>Un glacier relève la température t (°C) et ses ventes v (glaces par jour) pendant 6 jours.</p>${tab(['t (°C)', '14', '17', '20', '23', '26', '29'], [['v', '62', '80', '101', '118', '140', '157']], 'dt-c')}<p>Le tableur affiche : PENTE = 6,4 ; ORDONNEE.ORIGINE = − 27,933 333 ; R² = 0,999 05.</p>`,
      qs: [Q('a.', 'Arrondis b au centième.', '− 27,93', -27.93, { w: 24 }), Q('b.', 'L’ajustement est-il pertinent ? Donne R² arrondi au millième.', 'R² ≈ 0,999 : très proche de 1, oui', .999, { w: 24, tol: .0006 }), Q('c.', 'Estime les ventes pour 32 °C (au dixième).', '6,4 × 32 − 27,93 = 176,87 ≈ 176,9', 176.9, { w: 24, tol: .06 }), Q('d.', 'Pour quelle température prévoir 120 glaces ? (au dixième)', '(120 + 27,93) ÷ 6,4 ≈ 23,1 °C', 23.1, { w: 24, tol: .06 })],
      err: { 0: [{ v: 27.93, m: 'L’ordonnée à l’origine est négative : garde le signe moins.' }], 2: [{ v: 232.73, m: 'Le signe de b est faux : 6,4 × 32 − 27,93.' }], 3: [{ v: 14.39, m: 'Pour isoler t, on ajoute 27,93 : (120 + 27,93) ÷ 6,4.' }] },
      hints: ['L’équation est v = 6,4 t − 27,93.', 'Remplace t par 32.', 'Résous 6,4 t − 27,93 = 120.'], pouce: 'b est négatif : v = 6,4 t − 27,93. Pour isoler t, ajoute 27,93 puis divise par 6,4.', corr: 'a. − 27,93. b. 0,999 : pertinent. c. ≈ 177 glaces (extrapolation). d. ≈ 23,1 °C.' }),
    PB({ id: 'p3', etape: 4, lc: 4, cls: 'bac', defi: 5, bulle: 'Voici une question de « vers le bac » : 5 étapes. La dernière demande de discuter : une prévision n’est pas une certitude.', autravail: { comp: 'com', txt: 'présenter une prévision chiffrée à un responsable en expliquant ses limites.' }, comps: ['rea', 'val', 'com'], titre: 'Flyers et clients',
      intro: `<p>Un magasin a distribué x centaines de flyers et compté y nouveaux clients.</p>${tab(['flyers x', '2', '4', '6', '8', '10', '12'], [['clients y', '35', '48', '62', '70', '86', '95']], 'dt-c')}<p>Le tableur donne ${H('y = 6,03 x + 23,8')} et R² ≈ 0,995.</p>`,
      qs: [BQ('1', 'Calculer x̄.', 'rea', '42 ÷ 6 = 7', 7, { w: 24 }), BQ('2', 'Calculer ȳ.', 'rea', '396 ÷ 6 = 66', 66, { w: 24 }), BQ('3', 'Vérifier que G est presque sur la droite : calculer 6,03 × x̄ + 23,8.', 'val', '6,03 × 7 + 23,8 = 66,01 ≈ 66 ✓', 66.01, { w: 24 }), BQ('4', 'Estimer le nombre de clients pour 1 500 flyers.', 'rea', '6,03 × 15 + 23,8 = 114,25 ≈ 114 clients', 114.25, { w: 24, tol: .6 }), BQ('5', 'Justifier : cette prévision est-elle sûre ?', 'com', 'Non : R² ≈ 0,995 montre un bon ajustement, mais x = 15 est hors des données (extrapolation) ; c’est une estimation.', null, { lines: 3 })],
      err: { 0: [{ v: 42, m: 'Tu as fait la somme. Divise-la par 6.' }], 3: [{ v: 9068.8, m: 'x est en centaines : 1 500 flyers, c’est x = 15.' }] },
      hints: ['Additionne les x puis divise par 6.', 'Le point moyen doit vérifier à peu près l’équation.', 'Regarde si x = 15 est dans le tableau.'], pouce: '1 500 flyers → x = 15, plus grand que 12 : c’est une extrapolation.', corr: '1. 7. 2. 66. 3. 66,01 ≈ 66. 4. ≈ 114 clients. 5. Estimation : extrapolation, donc prudence, même si R² est proche de 1.' })];

  c.bilan = [['Je sais représenter un nuage et calculer le point moyen.', ['e1', 'p1']], ['Je sais obtenir une droite d’ajustement avec un outil numérique.', ['e3', 'p2']], ['Je sais interpréter le coefficient de détermination R².', ['e3', 'p2']], ['Je sais faire une prévision et en discuter la fiabilité.', ['e2', 'p3']]];
  c.words = require('./gl1')('c6');
  c.plusloin = { meca: [], probs: [] };
  return c;
};
