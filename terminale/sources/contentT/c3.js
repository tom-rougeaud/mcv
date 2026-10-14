/* Chapitre 3 · Fonctions polynômes de degré 3 — Terminale Bac Pro (arrêté du 3 février 2020). */
'use strict';
const K = require('./kitT');
const { rnd, H, FM, R, Q, BQ, PB, S, T, Rc, Ar, st, MCVP, bl, tab } = K;
const { SK } = require('./skT');
const { MCVT } = require('../shared/train.js');
const { fr } = K.MCVG;
const sg = n => n < 0 ? '− ' + fr(-n) : fr(n);

module.exports = function (chk) {
  const c = { id: 'c3', n: 3, col: 'fonction', icone: '〽️', dom: 'Algèbre-analyse · fonctions', titre: 'Fonctions polynômes de degré 3', sous: 'La cubique et le meilleur résultat' };
  c.parties = [{ t: 'La fonction cube', n: [1] }, { t: 'Dérivée et variations', n: [2, 3] }, { t: 'Équations f(x) = c', n: [4] }];
  c.travail = { question: `Le bénéfice mensuel d’un atelier de coffrets (entreprise fictive) est B(x) = − x³ + 15x² − 48x − 20, en centaines d’euros, pour ${H('x centaines de coffrets')}. Combien de coffrets faut-il vendre pour gagner le plus ? Pour gagner ${H('3 000 €')} ? Tu sauras répondre aux notions 3 et 4.` };
  c.objectifs = ['Je saurai décrire la fonction cube : courbe, dérivée et variations.', 'Je saurai dériver un polynôme de degré 3.', 'Je saurai dresser un tableau de variations et trouver un maximum ou un minimum local.', 'Je saurai compter les solutions de f(x) = c et en donner une valeur approchée.'];
  c.depart = 'c3';

  /* ---------- données ---------- */
  const B = x => -(x ** 3) + 15 * x * x - 48 * x - 20, dB = x => -3 * x * x + 30 * x - 48;
  chk([0, 2, 7, 8, 9, 10].map(B).join() === '-20,-64,36,44,34,0' && dB(2) === 0 && dB(8) === 0 && dB(1) === -21 && dB(5) === 27, 'c3 bénéfice');
  chk(B(6.6) < 30 && B(6.7) > 30 && B(9.1) > 30 && B(9.2) < 30, 'c3 solutions de B(x) = 30');
  const tabvar = MCVT.H.tabvar, inner = svgs => svgs.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');

  /* ---------- méthodes visuelles ---------- */
  const ORG = MCVP.ORG, RED = MCVP.RED, BLUE = MCVP.BLUE;
  // 1. la fonction cube
  const g1 = MCVP.plot({ W: 600, H: 300, x: [-2.5, 2.5, .5], y: [-15, 15, 5], ml: 50, mt: 16, mb: 30, zeroAxes: true, lx: 2, lab: 'Courbe de la fonction cube' });
  const v1 = S(600, 300, st(1, g1.base + g1.pts([-2, -1, 0, 1, 2].map(x => [x, x ** 3]), { r: 5 }) + g1.txt(2, 8, '(2 ; 8)', { dx: -10, dy: -4, a: 'end' }) + g1.txt(-2, -8, '(− 2 ; − 8)', { dx: 10, dy: 16, a: 'start' }))
    + st(2, g1.curve(x => x ** 3, { stroke: ORG, w: 3 }) + g1.txt(2.4, 14, 'f(x) = x³', { a: 'end', fs: 15 }))
    + st(3, g1.seg(-2, -8, 2, 8, { stroke: RED, dash: '6 5', w: 1.6 }) + g1.dot(0, 0, { r: 5, fill: '#FFC233' }) + g1.txt(-2.4, 12, 'symétrie par rapport à l’origine O', { a: 'start', fs: 13 }))
    + st(4, g1.seg(-.9, 0, .9, 0, { stroke: BLUE, w: 3.4 }) + g1.txt(.3, -9, 'f′(0) = 0 : tangente horizontale en O,', { a: 'start', fs: 12.5 }) + g1.txt(.3, -11.4, 'mais f reste croissante', { a: 'start', fs: 12.5 })),
  'La courbe de x³ monte toujours ; elle est symétrique par rapport à l’origine et a une tangente horizontale en 0');
  // 2. dériver terme à terme
  const terms = [['− x³', '− 3x²'], ['+ 15x²', '+ 30x'], ['− 48x', '− 48'], ['− 20', '0']];
  const v2 = S(600, 250, st(1, T(40, 34, 'B(x) =', { fs: 17, a: 'start' }) + terms.map(([a], i) => Rc(130 + i * 115, 12, 100, 36, { c: 'k2', rx: 8 }) + T(180 + i * 115, 37, a, { fs: 17 })).join(''))
    + st(2, terms.map((_, i) => Ar(180 + i * 115, 54, 180 + i * 115, 96, { w: 2.4, h: 9 })).join('') + ['× 3, puis x²', '× 2, puis x', 'x devient 1', 'disparaît'].map((t, i) => T(186 + i * 115, 80, t, { fs: 11.5, a: 'start', c: 'ts' })).join(''))
    + st(3, T(40, 126, 'B′(x) =', { fs: 17, a: 'start' }) + terms.map(([, b], i) => Rc(130 + i * 115, 104, 100, 36, { c: i === 3 ? 'wh' : 'k', rx: 8 }) + T(180 + i * 115, 129, b, { fs: 17, c: i === 3 ? 'ts' : 'tw' })).join(''))
    + st(4, `<rect x="60" y="168" width="480" height="64" rx="10" class="k2 ks" stroke-width="2"/>` + T(300, 194, 'B′(x) = − 3x² + 30x − 48', { fs: 17, c: 'kt' }) + T(300, 220, 'un polynôme de degré 2 : on sait étudier son signe (1re)', { fs: 13 })),
  'Chaque terme de B(x) se dérive séparément ; la dérivée est un polynôme de degré 2');
  // 3. du signe de la dérivée au tableau de variations
  const g3 = MCVP.plot({ W: 600, H: 150, x: [0, 10, 1], y: [-60, 30, 30], ml: 50, mt: 10, mb: 26, zeroAxes: true, fs: 11, lab: 'Courbe de la dérivée' });
  const TV = inner(tabvar({ xs: ['0', '2', '8', '10'], signs: ['−', '+', '−'], vals: [-20, -64, 44, 0], f: 'B' }));
  const v3 = S(600, 356, st(1, g3.base + g3.curve(dB, { stroke: BLUE, w: 2.6 }) + g3.txt(9.8, 22, 'B′(x) = − 3(x − 2)(x − 8)', { a: 'end', fs: 12.5 }))
    + st(2, g3.band(2, 8, { fill: '#1E7F45', op: .14 }) + g3.txt(5, -10, 'B′ > 0', { fs: 13, fill: '#1E7F45', cls: '' }) + g3.txt(.9, -50, 'B′ < 0', { fs: 12, fill: RED, cls: '' }) + g3.txt(9.1, -50, 'B′ < 0', { fs: 12, fill: RED, cls: '' }))
    + st(3, `<g transform="translate(0 170)">${TV}</g>`)
    + st(4, T(590, 164, 'maximum local B(8) = 44 · minimum local B(2) = − 64', { fs: 12.5, c: 'kt', a: 'end' })),
  'Le signe de la dérivée (en haut) se reporte dans le tableau de variations (en bas)');
  // 4. compter les solutions avec des droites horizontales
  const g4 = MCVP.plot({ W: 600, H: 300, x: [0, 10, 1], y: [-80, 60, 20], ml: 50, mt: 16, mb: 30, zeroAxes: true, lab: 'Courbe du bénéfice et droites y = 30 et y = 50' });
  const v4 = S(600, 300, st(1, g4.base + g4.curve(B, { stroke: ORG, w: 3 }) + g4.dot(2, -64, { r: 5, lab: '(2 ; − 64)', dx: 10, dy: 6 }) + g4.dot(8, 44, { r: 5, lab: '(8 ; 44)', dx: -10, dy: -24, a: 'end' }))
    + st(2, g4.seg(0, 30, 10, 30, { stroke: RED, dash: '7 5', w: 2 }) + g4.txt(.2, 34, 'y = 30', { a: 'start', fill: RED, cls: '' }) + g4.pts([[6.647, 30], [9.173, 30]], { r: 5.5, fill: '#FFC233' }) + g4.txt(.2, 18, '2 points : 2 solutions', { a: 'start', fs: 12.5 }))
    + st(3, g4.seg(0, 50, 10, 50, { stroke: BLUE, dash: '7 5', w: 2 }) + g4.txt(.2, 54, 'y = 50 : aucun point, aucune solution', { a: 'start', fill: BLUE, cls: '' }))
    + st(4, g4.guide(6.647, 30) + g4.txt(6.65, -76, '≈ 6,6', { fs: 12.5 }) + g4.txt(9.17, -76, '≈ 9,2', { fs: 12.5 })),
  'La droite y = 30 coupe la courbe deux fois ; la droite y = 50 ne la coupe pas');

  c.notions = [
    { titre: 'La fonction cube', decouvre: { txt: `Un fabricant de cartons cubiques (entreprise fictive) propose des boîtes d’arête ${H('x décimètres')}. La contenance, en litres, est ${H('x³')}. Que devient la contenance quand l’arête double ?`, img: SK.cartonCube() },
      comprends: `<p>La <b>fonction cube</b> associe à chaque nombre x son cube : f(x) = x³ = x × x × x.</p><p>Le cube d’un nombre négatif est négatif : (− 2)³ = − 8. Le cube de l’opposé est l’opposé du cube. La courbe est donc symétrique par rapport à l’origine du repère.</p><p>Sa dérivée est f′(x) = 3x². Un carré n’est jamais négatif, donc f′(x) ≥ 0. La fonction cube est <b>croissante</b> sur ℝ. En 0, la dérivée est nulle : la courbe y est horizontale un instant, puis elle remonte.</p><p>Pour le carton : une arête de 2 dm donne 8 L ; une arête de 4 dm donne 64 L. Doubler l’arête multiplie la contenance par 8.</p>`,
      vois: v1, voisLeg: 'Les points (− 2 ; − 8) et (2 ; 8) sont symétriques par rapport à O. En 0, la tangente est horizontale, mais la courbe continue de monter.',
      retiens: `<p>${FM(R`f(x)=x^3 \qquad f'(x)=3x^2`)}</p><p>La fonction cube est croissante sur ℝ. Sa courbe est symétrique par rapport à l’origine.</p>`,
      exemple: `<p>(− 3)³ = <b>− 27</b> ; 1,5³ = <b>3,375</b>.</p><p>f′(2) = 3 × 2² = <b>12</b>.</p>`,
      wide: K.rais('un contre-exemple', `<p>« Si f′(a) = 0, alors f admet un maximum ou un minimum en a. » Cette phrase est <b>fausse</b>. Contre-exemple : la fonction cube. Sa dérivée s’annule en 0, mais la fonction est croissante : pas de maximum, pas de minimum. Pour un extremum, la dérivée doit s’annuler <b>en changeant de signe</b>.</p>`),
      attention: '2³ = 2 × 2 × 2 = 8, et non 2 × 3 = 6 : un cube n’est pas un triple.', astuce: { k: 'og', t: 'Le cube d’un nombre compris entre 0 et 1 est plus petit que lui : 0,5³ = 0,125.' } },
    { titre: 'Dériver un polynôme de degré 3', decouvre: { txt: `Le bénéfice mensuel d’un atelier de coffrets (entreprise fictive) est ${H('B(x) = − x³ + 15x² − 48x − 20')}, en centaines d’euros, pour x centaines de coffrets. Comment calculer sa dérivée ?`, img: SK.coffrets() },
      comprends: `<p>On dérive un polynôme <b>terme par terme</b>. Quatre règles suffisent : (x³)′ = 3x², (x²)′ = 2x, (x)′ = 1 ; une constante a pour dérivée 0.</p><p>Un coefficient reste devant la dérivée de son terme : (15x²)′ = 15 × 2x = 30x. Plus généralement, la dérivée de ax³ + bx² + cx + d est 3ax² + 2bx + c.</p><p>Pour l’atelier : B′(x) = − 3x² + 30x − 48. La dérivée d’un polynôme de degré 3 est un polynôme de degré 2, étudié en 1re.</p><p>B′(x) donne la pente de la tangente. B′(1) = − 21 : le bénéfice baisse quand x vaut 1. B′(5) = 27 : il augmente quand x vaut 5.</p>`,
      vois: v2, voisLeg: 'Chaque terme se dérive seul : − x³ devient − 3x², 15x² devient 30x, − 48x devient − 48 et la constante − 20 disparaît.',
      retiens: `<p>${FM(R`(ax^3+bx^2+cx+d)'=3ax^2+2bx+c`)}</p><p>(x³)′ = 3x² · (x²)′ = 2x · (x)′ = 1 · (constante)′ = 0</p>`,
      exemple: `<p>B′(x) = <b>− 3x² + 30x − 48</b>.</p><p>B′(5) = − 75 + 150 − 48 = <b>27</b>.</p>`,
      wide: K.prog('calculer la dérivée en plusieurs points', 'La fonction <code>derivee</code> renvoie B′(x). La boucle affiche sa valeur pour x = 0, 1, …, 10.', `def derivee(x):\n    return -3*x**2 + 30*x - 48\n\nfor x in range(0, 11):\n    print(x, derivee(x))`, `<p class="prog-q">Pour quelles valeurs de x le programme affiche-t-il 0 ? ${bl(24, '2 et 8')} Que vaut <code>derivee(10)</code> ? ${bl(16, '−48')}</p>`),
      attention: 'La dérivée de la constante − 20 est 0 : elle disparaît, elle ne devient pas − 20x.', astuce: { k: 'verif', t: 'Vérifie le degré : la dérivée d’un polynôme de degré 3 est de degré 2.' } },
    { titre: 'Variations et extremums locaux', decouvre: { txt: `B′(x) = − 3x² + 30x − 48 s’écrit aussi ${H('− 3(x − 2)(x − 8)')}. Pour quelles quantités le bénéfice augmente-t-il ? Quelle quantité donne le meilleur bénéfice ?`, img: SK.tabvarMini() },
      comprends: `<p>Le signe de la dérivée donne le sens de variation. Si B′(x) &gt; 0, B est croissante ; si B′(x) &lt; 0, B est décroissante.</p><p>La forme factorisée B′(x) = − 3(x − 2)(x − 8) s’annule en 2 et en 8. C’est un polynôme de degré 2 de coefficient − 3 : il est négatif à l’extérieur des racines, positif entre elles.</p><p>On range ces signes dans un <b>tableau de variations</b>. B décroît sur [0 ; 2], croît sur [2 ; 8], puis décroît sur [8 ; 10].</p><p>B(2) = − 64 est un <b>minimum local</b> ; B(8) = 44 est un <b>maximum local</b>. Le meilleur bénéfice, 4 400 €, est atteint pour 800 coffrets.</p>`,
      vois: v3, voisLeg: 'En haut, la courbe de B′ : elle est au-dessus de l’axe entre 2 et 8. En bas, le tableau de variations reporte ces signes et les valeurs B(2) et B(8).',
      retiens: `<p>${FM(R`B'(x)>0`)} : B croissante · ${FM(R`B'(x)<0`)} : B décroissante.</p><p>Si B′ s’annule <b>en changeant de signe</b> en a, B(a) est un extremum local : maximum si B′ passe de + à −, minimum si B′ passe de − à +.</p>`,
      exemple: `<p>B(8) = − 512 + 960 − 384 − 20 = <b>44</b> : maximum local.</p><p>B(2) = <b>− 64</b> : minimum local.</p>`,
      wide: K.rais('une disjonction de cas', `<p>Pour le signe de − 3(x − 2)(x − 8), on étudie trois cas : x &lt; 2, puis 2 &lt; x &lt; 8, puis x &gt; 8. Dans chaque cas, on compte les facteurs négatifs. Pour x = 5 : − 3 &lt; 0, 5 − 2 &gt; 0 et 5 − 8 &lt; 0 ; deux facteurs négatifs, donc un produit <b>positif</b>.</p>`),
      attention: 'Le maximum est la valeur B(8) = 44, atteinte pour x = 8 : ne confonds pas l’abscisse et la valeur.', astuce: { k: 'verif', t: 'Contrôle avec deux voisins : B(7) = 36 et B(9) = 34 sont tous deux inférieurs à B(8) = 44.' } },
    { titre: 'Nombre de solutions de f(x) = c', decouvre: { txt: `L’atelier veut un bénéfice de ${H('3 000 €')}, soit B(x) = 30. Combien de quantités conviennent ? Et pour un bénéfice de ${H('5 000 €')} ?`, img: SK.droiteHoriz() },
      comprends: `<p>Résoudre B(x) = c, c’est chercher les abscisses des points de la courbe situés à la hauteur c.</p><p>Le tableau de variations suffit pour <b>compter</b> les solutions. Sur un intervalle où B croît, ou décroît, la valeur c est atteinte au plus une fois. Elle l’est si c est entre les deux valeurs extrêmes de l’intervalle.</p><p>Pour c = 30 : sur [2 ; 8], B passe de − 64 à 44 ; sur [8 ; 10], de 44 à 0. Il y a <b>2 solutions</b>. Pour c = 50 : 50 dépasse le maximum, il n’y a <b>aucune solution</b>.</p><p>Pour une valeur approchée, on utilise GeoGebra ou un tableau de valeurs. B(6,6) &lt; 30 &lt; B(6,7) : une solution vaut environ 6,6.</p>`,
      vois: v4, voisLeg: 'La droite rouge y = 30 rencontre la courbe en deux points : deux solutions. La droite bleue y = 50 passe au-dessus du maximum : aucune solution.',
      retiens: `<p>Sur un intervalle où f est strictement croissante (ou décroissante), ${FM(R`f(x)=c`)} a au plus une solution.</p><p>Compter : avec le tableau de variations. Approcher : GeoGebra, tableau de valeurs, balayage.</p>`,
      exemple: `<p>B(x) = 30 : <b>2 solutions</b>, environ 6,6 et 9,2.</p><p>B(x) = 50 : <b>aucune solution</b>.</p>`,
      wide: K.prog('chercher une solution par balayage', 'La boucle avance de 0,1 en 0,1 tant que le bénéfice reste sous 30.', `x = 6\nwhile -x**3 + 15*x**2 - 48*x - 20 < 30:\n    x = round(x + 0.1, 1)\nprint(x)    # affiche 6.7`, `<p class="prog-q">Entre quelles valeurs se trouve la solution ? ${bl(30, 'entre 6,6 et 6,7')} Que changer pour une précision au centième ? ${bl(40, 'avancer de 0.01')}</p>`),
      attention: 'Si c vaut exactement le maximum (c = 44), il n’y a qu’une solution sur [2 ; 10] : x = 8.', astuce: { k: 'og', t: 'Trace la droite horizontale y = c : chaque point de rencontre avec la courbe est une solution.' } }];

  c.mots = [['fonction cube', 'la fonction x ↦ x³', 'La contenance d’un carton est une fonction cube de son arête.'], ['polynôme de degré 3', 'expression ax³ + bx² + cx + d, avec a ≠ 0', 'Le bénéfice est un polynôme de degré 3.'], ['dériver terme à terme', 'dériver chaque terme du polynôme séparément', 'La dérivée de − x³ est − 3x².'], ['tableau de variations', 'tableau du signe de f′ et du sens de variation de f', 'Le tableau de variations montre le maximum.'], ['maximum local', 'plus grande valeur de f autour d’un point', 'B(8) = 44 est un maximum local.'], ['minimum local', 'plus petite valeur de f autour d’un point', 'B(2) = − 64 est un minimum local.'], ['extremum', 'un maximum ou un minimum', 'La dérivée s’annule en changeant de signe à un extremum.'], ['nombre de solutions', 'nombre de valeurs de x telles que f(x) = c', 'B(x) = 30 a deux solutions.'], ['valeur approchée', 'solution donnée au dixième ou au centième', 'Une solution vaut environ 6,6.']];

  /* ---------- exercices résolus ---------- */
  const h = x => x ** 3 - 3 * x * x - 9 * x + 5, g = x => -(x ** 3) + 3 * x * x + 24 * x - 30;
  chk(h(-1) === 10 && h(3) === -22 && h(-3) === -22 && h(5) === 10 && g(4) === 50 && g(0) === -30 && g(6) === 6, 'c3 résolus');
  c.resolus = [
    { titre: 'Étudier les variations', outil: '🧮 calculatrice', enonce: `Étudie les variations de ${H('f(x) = x³ − 3x² − 9x + 5')} sur ${H('[− 3 ; 5]')}, puis donne ses extremums locaux.`,
      rows: [['f′(x) = <b>3x² − 6x − 9</b>', 'On dérive terme par terme.'], ['3(x + 1)(x − 3) = 3x² − 6x − 9 : f′ s’annule en <b>− 1</b> et <b>3</b>', 'On vérifie la forme factorisée en la développant.'], ['f′ &gt; 0 sur [− 3 ; − 1[, &lt; 0 sur ]− 1 ; 3[, &gt; 0 sur ]3 ; 5]', 'Coefficient 3 &gt; 0 : positif à l’extérieur des racines.'], ['f(− 1) = <b>10</b> (maximum local) ; f(3) = <b>− 22</b> (minimum local)', 'On calcule les images aux points où f′ change de signe.']], verif: 'f(0) = 5 est bien compris entre − 22 et 10 ✓, et f(− 3) = − 22 ≤ 10 ✓.', rep: 'f croît sur [− 3 ; − 1], décroît sur [− 1 ; 3], croît sur [3 ; 5] ; maximum local 10 en − 1, minimum local − 22 en 3.', go: ['e1', 'e2'] },
    { titre: 'À toi : le meilleur bénéfice', outil: '🧮 calculatrice', enonce: `Le bénéfice d’une boutique est ${H('g(x) = − x³ + 3x² + 24x − 30')}, en centaines d’euros, pour x centaines d’articles, avec ${H('x dans [0 ; 6]')}. Trouve le bénéfice maximal.`, trous: [0, 1, 2, 3],
      rows: [['g′(x) = ⟦− 3x² + 6x + 24⟧', 'On dérive terme par terme.'], ['g′(x) = − 3(x + 2)(x − 4) s’annule en x = ⟦4⟧ sur [0 ; 6]', '− 2 n’est pas dans l’intervalle.'], ['g′ &gt; 0 sur [0 ; 4[, g′ &lt; 0 sur ]4 ; 6] : g est ⟦croissante⟧ puis décroissante', 'Coefficient − 3 &lt; 0 : positif entre les racines.'], ['g(4) = − 64 + 48 + 96 − 30 = ⟦50⟧', 'On calcule l’image du maximum.']], verif: 'g(3) = 42 et g(5) = 40 sont inférieurs à 50 ✓.', rep: 'Le bénéfice maximal est de 5 000 €, pour 400 articles.', go: ['e2', 'e3'] }];
  c.entraine = [{ id: 'e1', gen: 'c3e1', lc: 2 }, { id: 'e2', gen: 'c3e2', lc: 3 }, { id: 'e3', gen: 'c3e3', lc: 4 }];

  /* ---------- je résous ---------- */
  const P = x => -(x ** 3) + 9 * x * x - 15 * x - 10, V = x => x * (24 - 2 * x) ** 2;
  chk(P(5) === 15 && P(1) === -17 && P(0) === -10 && P(7) === -17 && -3 * 9 + 18 * 3 - 15 === 12, 'c3 p2');
  chk(V(2) === 800 && V(4) === 1024 && V(6.41) > 800 && V(6.42) < 800, 'c3 p3');
  c.probs = [
    PB({ id: 'p1', etape: 2, lc: 1, comps: ['app', 'rea'], titre: 'Des cartons cubiques',
      intro: `<p>La contenance, en litres, d’un carton cubique d’arête x décimètres est ${H('f(x) = x³')}.</p>`,
      qs: [Q('a.', 'Calcule la contenance d’un carton d’arête 2,5 dm.', '2,5³ = 15,625 L', 15.625, { w: 26, tol: .0006 }), Q('b.', 'Quelle arête donne une contenance de 27 L ?', '3³ = 27 : 3 dm', 3, { w: 22 }), Q('c.', 'Calcule f′(3), avec f′(x) = 3x².', '3 × 3² = 27', 27, { w: 22 }), Q('d.', 'La contenance augmente-t-elle toujours quand l’arête augmente ? Justifie.', 'Oui : f′(x) = 3x² ≥ 0, la fonction cube est croissante.', null, { lines: 2 })],
      err: { 0: [{ v: 7.5, m: '2,5³ = 2,5 × 2,5 × 2,5, et non 2,5 × 3.' }, { v: 6.25, m: 'Ça, c’est 2,5². Il faut multiplier encore une fois par 2,5.' }], 1: [{ v: 9, m: '9 × 9 × 9 = 729. Cherche le nombre dont le cube vaut 27.' }], 2: [{ v: 9, m: 'f′(3) = 3 × 3² = 3 × 9.' }] },
      hints: ['Le cube : on multiplie trois fois le nombre par lui-même.', 'Essaie 2, 3, 4 : lequel a un cube égal à 27 ?', 'Un carré n’est jamais négatif.'], pouce: 'x³ = x × x × x. Pour b, essaie des entiers. Pour c, remplace x par 3 dans 3x².', corr: 'a. 15,625 L. b. 3 dm. c. 27. d. Oui : f′(x) = 3x² ≥ 0, donc f est croissante.' }),
    PB({ id: 'p2', etape: 3, lc: 3, defi: 4, bulle: 'Ce cas se fait en 4 étapes : dériver, vérifier la forme factorisée, faire le tableau de variations, conclure. Le chemin est toujours le même.', autravail: { comp: 'ana', txt: 'repérer le volume de commandes qui donne le meilleur bénéfice, et le dire à son responsable.' }, comps: ['rea', 'ana', 'com'], titre: 'Le meilleur bénéfice d’une boutique en ligne',
      intro: `<p>Une boutique en ligne (entreprise fictive) estime son bénéfice mensuel à ${H('P(x) = − x³ + 9x² − 15x − 10')}, en centaines d’euros, pour x centaines de commandes, avec ${H('x dans [0 ; 7]')}.</p>`,
      qs: [Q('a.', 'Calcule P′(x). Donne P′(3).', 'P′(x) = − 3x² + 18x − 15 ; P′(3) = 12', 12, { w: 22 }), Q('b.', 'Vérifie que P′(x) = − 3(x − 1)(x − 5). Pour quelles valeurs P′ s’annule-t-elle ? Donne la plus grande.', 'en x = 1 et x = 5', 5, { w: 22 }), Q('c.', 'Dresse le tableau de variations de P sur [0 ; 7]. Donne P(5).', 'P décroît sur [0 ; 1], croît sur [1 ; 5], décroît sur [5 ; 7] ; P(5) = 15', 15, { w: 22 }), Q('d.', 'Rédige une phrase pour le responsable : nombre de commandes et bénéfice maximal.', 'Avec 500 commandes, le bénéfice est maximal : 1 500 €.', null, { lines: 2 })],
      err: { 0: [{ v: P(3), m: 'Tu as calculé P(3). On demande P′(3) : remplace x dans la dérivée.' }], 2: [{ v: -17, m: 'P(1) = − 17 est le minimum local. Le maximum est en x = 5.' }] },
      hints: ['(− x³)′ = − 3x² ; (9x²)′ = 18x ; (− 15x)′ = − 15.', 'Développe − 3(x − 1)(x − 5) et compare.', 'Coefficient − 3 : P′ est positive entre 1 et 5.'], pouce: 'P′(x) = − 3x² + 18x − 15 = − 3(x − 1)(x − 5). Positive entre 1 et 5 : P monte jusqu’en x = 5.', corr: 'a. P′(x) = − 3x² + 18x − 15 ; P′(3) = 12. b. P′ s’annule en 1 et 5. c. Décroissante, croissante, décroissante ; P(5) = 15. d. 500 commandes donnent le bénéfice maximal de 1 500 €.' }),
    PB({ id: 'p3', etape: 4, lc: 4, cls: 'bac', defi: 5, bulle: 'Voici une question de « vers le bac » : 5 étapes. On fabrique une boîte en découpant les coins d’un carré de carton. Une question ratée ne fait pas un exercice raté : continue.', autravail: { comp: 'rea', txt: 'concevoir un présentoir de vitrine qui contient le plus possible de produits.' }, comps: ['app', 'rea', 'ana', 'val'], titre: 'Une boîte-présentoir pour la vitrine',
      intro: `<p>Pour une vitrine, on fabrique une boîte sans couvercle dans un carré de carton de ${H('24 cm de côté')} : on découpe un carré de côté x cm à chaque coin, puis on relève les bords. Le volume de la boîte, en cm³, est ${H('V(x) = x(24 − 2x)²')}, avec x dans [0 ; 12].</p>`,
      qs: [BQ('1', 'Calculer V(2).', 'rea', '2 × 20² = 800 cm³', 800, { w: 26 }), BQ('2', 'On admet que V(x) = 4x³ − 96x² + 576x. Calculer V′(x) et vérifier que V′(x) = 12(x − 4)(x − 12).', 'ana', 'V′(x) = 12x² − 192x + 576 = 12(x² − 16x + 48) = 12(x − 4)(x − 12)', null, { lines: 2 }), BQ('3', 'Dresser le tableau de variations de V sur [0 ; 12], puis donner le volume maximal.', 'rea', 'V croît sur [0 ; 4] et décroît sur [4 ; 12] ; V(4) = 1 024 cm³', 1024, { w: 26 }), BQ('4', 'Donner les dimensions de la boîte de volume maximal.', 'app', 'hauteur 4 cm ; base 16 cm × 16 cm', 16, { w: 22, lab: 'côté de la base :' }), BQ('5', 'Avec GeoGebra, déterminer les valeurs de x qui donnent un volume de 800 cm³. Donner la plus grande, au centième.', 'val', 'x = 2 et x ≈ 6,42', 6.42, { w: 22, tol: .006 })],
      err: { 0: [{ v: 2 * 22 * 22, m: 'On enlève x à chaque bord : 24 − 2 × 2 = 20, et non 22.' }], 2: [{ v: 4, m: '4 est la valeur de x qui donne le maximum. Le volume maximal est V(4).' }], 3: [{ v: 24, m: 'La base perd x de chaque côté : 24 − 2 × 4 = 16 cm.' }] },
      hints: ['V(2) = 2 × (24 − 4)².', 'La dérivée de 4x³ est 12x² ; celle de − 96x², − 192x.', 'V′ ≥ 0 entre 0 et 4 : V monte, puis descend jusqu’à 12.'], pouce: 'V′(x) = 12(x − 4)(x − 12) : positive avant 4, négative entre 4 et 12. Le maximum est V(4).', corr: '1. V(2) = 800 cm³. 2. V′(x) = 12x² − 192x + 576 = 12(x − 4)(x − 12). 3. Croissante sur [0 ; 4], décroissante sur [4 ; 12] ; maximum V(4) = 1 024 cm³. 4. Hauteur 4 cm, base 16 cm × 16 cm. 5. x = 2 ou x ≈ 6,42.' })];

  c.bilan = [['Je sais décrire la fonction cube.', ['p1']], ['Je sais dériver un polynôme de degré 3.', ['e1', 'p2']], ['Je sais dresser un tableau de variations et trouver un extremum local.', ['e2', 'p2', 'p3']], ['Je sais compter les solutions de f(x) = c et en donner une valeur approchée.', ['e3', 'p3']]];
  c.words = require('./glT')('c3');
  c.plusloin = { meca: [], probs: [] };
  return c;
};
