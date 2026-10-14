/* Chapitre 3 · Fonctions du second degré — 1re Bac Pro. */
'use strict';
const K = require('./kit1');
const { rnd, H, FM, R, Q, BQ, PB, prog, rais, tab, S, T, Rc, Ln, Ar, Br, st, MCVP, bl } = K;
const { SK } = require('./sk1');
const RED = MCVP.RED, BLUE = MCVP.BLUE, GRN = MCVP.GRN;

module.exports = function (chk) {
  const c = { id: 'c3', n: 3, col: 'algebre', icone: '🏔️', dom: 'Algèbre-analyse · fonctions du second degré', titre: 'Fonctions polynômes de degré 2', sous: 'La parabole et le meilleur bénéfice' };
  c.parties = [{ t: 'La parabole', n: [1] }, { t: 'Racines, forme factorisée et signe', n: [2, 3] }, { t: 'Sommet et extremum', n: [4] }];
  c.travail = { question: `Sur un marché, le bénéfice d’un stand dépend du prix de vente. Il vaut ${H('B(x) = − x² + 10 x − 16')} dizaines d’euros pour un prix de x euros. À quel prix faut-il vendre pour gagner le plus ? Et à partir de quel prix perd-on de l’argent ? Une courbe en forme d’arche te le dit.` };
  c.objectifs = ['Je saurai reconnaître une parabole et son sens.', 'Je saurai trouver les racines d’une fonction du second degré.', 'Je saurai étudier le signe avec la forme factorisée.', 'Je saurai trouver le sommet et l’extremum.'];
  c.depart = 'c3';

  const B = x => -x * x + 10 * x - 16;
  chk(B(2) === 0 && B(8) === 0 && B(5) === 9 && B(3) === 5 && B(7) === 5 && B(4) === 8 && B(6) === 8 && B(0) === -16 && B(10) === -16 && -(3 - 2) * (3 - 8) === 5, 'c3 fil rouge');
  const rep = (lab, o = {}) => MCVP.plot({ W: 600, H: 300, x: [0, 10, 1], y: [-16, 12, 4], ml: 52, mt: 18, mb: 30, zeroAxes: true, fine: true, lab, ...o });

  // 1. sens de la parabole
  const f1 = x => x * x / 2, f2 = x => -x * x / 2;
  const g1 = MCVP.plot({ W: 600, H: 290, x: [-4, 4, 1], y: [-8, 8, 2], ml: 48, zeroAxes: true, fine: true, lab: 'Deux paraboles : y = 0,5 x² et y = − 0,5 x²' });
  const sens = S(600, 290, st(1, g1.base + g1.curve(f1, { stroke: BLUE, w: 3.2 }) + g1.dot(0, 0, { r: 5, fill: '#FFC233' }) + g1.txt(-3.9, 7, 'a > 0 : vers le haut', { a: 'start', fill: BLUE, cls: '' }) + g1.txt(-3.9, 5.8, 'le sommet est un minimum', { a: 'start', fs: 12 }))
    + st(2, g1.curve(f2, { stroke: RED, w: 3.2 }) + g1.txt(-3.9, -5.8, 'a < 0 : vers le bas', { a: 'start', fill: RED, cls: '' }) + g1.txt(-3.9, -7, 'le sommet est un maximum', { a: 'start', fs: 12 })),
  'Deux paraboles : une ouverte vers le haut, une ouverte vers le bas');
  chk(f1(4) === 8 && f2(4) === -8 && [0, 1, 2, 3, 4].map(x => x * x - 4 * x + 3).join() === '3,0,-1,0,3', 'c3 sens');

  // 2. racines : 2, 1, 0
  const pan = (dx, f, x0, x1, y0, y1, roots, titre, bas) => { const g = MCVP.plot({ W: 190, H: 190, x: [x0, x1, 1], y: [y0, y1, 1], ml: 30, mr: 8, mt: 12, mb: 26, fs: 10, zeroAxes: true, fine: true }); return `<g transform="translate(${dx} 0)">${g.base + g.curve(f, { stroke: BLUE, w: 2.8 }) + roots.map(r => g.dot(r, 0, { r: 4.5, fill: '#FFC233' })).join('') + T(100, 14, titre, { fs: 13, c: 'kt' }) + T(100, 205, bas, { fs: 12 })}</g>`; };
  const rac = S(600, 214, st(1, pan(0, x => x * x - 4 * x + 3, 0, 4, -2, 3, [1, 3], '2 racines', 'x = 1 et x = 3')) + st(2, pan(205, x => (x - 2) * (x - 2), 0, 4, 0, 4, [2], '1 racine', 'x = 2')) + st(3, pan(410, x => (x - 2) * (x - 2) + 1, 0, 4, 0, 5, [], '0 racine', 'la courbe ne touche pas l’axe')),
  'Une parabole peut couper l’axe horizontal en 2 points, en 1 point ou en aucun point');
  chk(1 - 4 + 3 === 0 && 27 - 12 * 3 + 9 - 0 === 0 && true, 'c3 racines');

  // 3. forme factorisée et signe
  const g3 = rep('B(x) = − (x − 2)(x − 8) : positif entre 2 et 8');
  const signe = S(600, 300, st(1, g3.base + g3.curve(B, { stroke: BLUE, w: 3.2 }) + g3.dot(2, 0, { r: 5.5, fill: '#FFC233' }) + g3.dot(8, 0, { r: 5.5, fill: '#FFC233' }) + g3.txt(2, 0, '2', { dy: -12, fs: 14 }) + g3.txt(8, 0, '8', { dy: -12, fs: 14 }))
    + st(2, g3.band(2, 8, { fill: '#1E7F45', op: .15 }) + g3.txt(5, 11, 'B(x) > 0 : bénéfice', { fs: 13, fill: GRN, cls: '' }))
    + st(3, g3.band(0, 2, { fill: '#C2332A', op: .12 }) + g3.band(8, 10, { fill: '#C2332A', op: .12 }) + g3.txt(1, -13, 'B < 0', { fs: 13, fill: RED, cls: '' }) + g3.txt(9, -13, 'B < 0', { fs: 13, fill: RED, cls: '' }) + g3.txt(5, -14, 'perte', { fs: 13, fill: RED, cls: '', dy: 0 })),
  'La courbe est au-dessus de l’axe entre 2 et 8, en dessous en dehors');
  chk(-(4 - 2) * (4 - 8) === 8 && -(1 - 2) * (1 - 8) === -7 && B(1) === -7 && B(9) === -7, 'c3 signe');

  // 4. sommet, axe de symétrie
  const g4 = rep('Le sommet de la parabole est le point (5 ; 9)');
  const sommet = S(600, 300, st(1, g4.base + g4.curve(B, { stroke: BLUE, w: 3.2 }) + g4.dot(2, 0, { r: 5, fill: '#FFC233' }) + g4.dot(8, 0, { r: 5, fill: '#FFC233' }))
    + st(2, `<line x1="${g4.X(5)}" y1="${g4.Y(-16)}" x2="${g4.X(5)}" y2="${g4.Y(12)}" stroke="${RED}" stroke-width="2.2" stroke-dasharray="7 5"/>` + g4.txt(5, -16, 'axe de symétrie : x = 5', { dx: 8, dy: -8, a: 'start', fill: RED, cls: '', fs: 12 }))
    + st(3, g4.dot(5, 9, { r: 6.5, fill: '#FFC233' }) + g4.txt(5, 9, 'sommet (5 ; 9)', { dx: 12, dy: -6, a: 'start' }) + g4.guide(5, 9))
    + st(4, g4.pts([[3, 5], [7, 5]], { r: 5, fill: GRN }) + g4.seg(3, 5, 7, 5, { stroke: GRN, dash: '5 4', w: 2 }) + g4.txt(5, 5, 'B(3) = B(7) = 5', { dy: 20, fs: 12 })),
  'L’axe de symétrie passe par le sommet ; deux points symétriques ont la même ordonnée');

  c.notions = [
    { titre: 'La parabole : ax² + bx + c', decouvre: { txt: `Un stand gagne ${H('B(x) = − x² + 10x − 16')} dizaines d’euros à x euros le prix. Pour ${H('x = 3')}, que vaut B ? Quelle forme a la courbe ?`, img: SK.parabole() },
      comprends: `<p>Une <b>fonction du second degré</b> s’écrit f(x) = ax² + bx + c, avec a différent de 0. Sa courbe est une <b>parabole</b>.</p><p>Le signe de <b>a</b> donne le sens. Si a est positif, la parabole est ouverte <b>vers le haut</b> : son sommet est le point le plus bas. Si a est négatif, elle est ouverte <b>vers le bas</b> : son sommet est le point le plus haut.</p><p>Pour tracer, on dresse un tableau de valeurs. Pour f(x) = x² − 4x + 3 :</p>${tab(['x', '0', '1', '2', '3', '4'], [['f(x)', '3', '0', '− 1', '0', '3']], 'dt-c')}<p>Les valeurs sont symétriques : f(0) = f(4) et f(1) = f(3).</p><p>L’<b>ordonnée à l’origine</b> est f(0) = c : la parabole coupe l’axe vertical au point (0 ; c). Pour B, B(0) = − 16.</p>`,
      vois: sens, voisLeg: 'Les deux paraboles ont le même sommet (0 ; 0). La bleue est ouverte vers le haut (a > 0), la rouge vers le bas (a < 0).',
      retiens: `<p>${FM(R`f(x)=ax^2+bx+c \quad (a\neq 0)`)}</p><p><b>a &gt; 0</b> : vers le haut, sommet = minimum. <b>a &lt; 0</b> : vers le bas, sommet = maximum.</p><p>Ordonnée à l’origine : ${FM(R`f(0)=c`)}.</p>`,
      exemple: `<p>B(x) = − x² + 10x − 16 : a = − 1, vers le bas.</p><p>B(3) = − 9 + 30 − 16 = <b>5</b>.</p>`,
      attention: 'Dans − x², seul x est au carré : pour x = 3, − x² vaut − 9, pas + 9. Mets des parenthèses : − (3²).', astuce: { k: 'verif', t: 'Sur la calculatrice, écris (−3)² avec des parenthèses, et − 3² pour un « moins » devant le carré.' } },
    { titre: 'Les racines : f(x) = 0', decouvre: { txt: `Pour quels prix le stand ne gagne et ne perd rien ? C’est-à-dire ${H('B(x) = 0')}. Où cela se lit-il sur la courbe ?`, img: SK.racines() },
      comprends: `<p>Une <b>racine</b> de f est un nombre x tel que f(x) = 0. Sur la courbe, c’est l’abscisse d’un point où la parabole touche l’axe horizontal.</p><p>Une parabole peut avoir <b>deux racines</b> (elle coupe l’axe en deux points), <b>une seule racine</b> (elle touche l’axe) ou <b>aucune racine</b> (elle ne rencontre pas l’axe).</p><p>Pour B, on lit deux racines : 2 et 8. Contrôle : B(2) = − 4 + 20 − 16 = 0 et B(8) = − 64 + 80 − 16 = 0.</p><p>Résoudre f(x) = 0 revient à résoudre f(x) = g(x) avec g(x) = 0 : l’axe horizontal est une droite !</p>`,
      vois: rac, voisLeg: 'Les points jaunes sont les racines. Trois paraboles : deux points, un seul point, aucun point sur l’axe.',
      retiens: `<p>${FM(R`x \text{ est une racine de } f \iff f(x)=0`)}</p><p>Racines = abscisses des points où la courbe rencontre l’axe horizontal.</p>`,
      exemple: `<p>B(x) = 0 pour x = <b>2</b> ou x = <b>8</b>.</p><p>Aux prix de 2 € et de 8 €, le stand ne gagne rien.</p>`,
      attention: 'Une racine est un nombre x (une abscisse), pas une valeur de f. Elle se lit sur l’axe horizontal.', astuce: { k: 'sens', t: 'Racine : la fonction vaut zéro. Cherche où la courbe touche l’axe horizontal.' } },
    { titre: 'Forme factorisée et signe', decouvre: { txt: `On peut écrire ${H('B(x) = − (x − 2)(x − 8)')}. Pour quels prix le stand gagne-t-il de l’argent ? Et pour quels prix en perd-il ?`, img: SK.facto() },
      comprends: `<p>La <b>forme factorisée</b> est f(x) = a (x − x₁)(x − x₂), où x₁ et x₂ sont les racines. Elle donne les racines tout de suite : un produit est nul si l’un de ses facteurs est nul.</p><p>Pour B : − (x − 2)(x − 8) = 0 donne x − 2 = 0 ou x − 8 = 0, donc x = 2 ou x = 8.</p><p>On en déduit le <b>signe</b>. Comme a = − 1 est négatif, la parabole est au-dessus de l’axe <b>entre</b> les racines et en dessous <b>à l’extérieur</b>. Le bénéfice est positif pour x entre 2 et 8.</p>${tab(['x', 'avant 2', '2', 'entre 2 et 8', '8', 'après 8'], [['signe de B(x)', '−', '0', '+', '0', '−']], 'dt-c')}`,
      vois: signe, voisLeg: 'La zone verte est celle où B(x) est positif (bénéfice). Les zones rouges sont celles où B(x) est négatif (perte).',
      retiens: `<p>${FM(R`f(x)=a(x-x_1)(x-x_2)`)}</p><p>Si <b>a &lt; 0</b> : f est positive entre les racines. Si <b>a &gt; 0</b> : f est négative entre les racines.</p>`,
      exemple: `<p>B(4) = − (2)(− 4) = <b>8</b> : positif.</p><p>B(1) = − (− 1)(− 7) = <b>− 7</b> : négatif.</p>`,
      wide: K.rais('le produit nul', `<p>Si un produit de facteurs est égal à 0, alors <b>au moins un</b> des facteurs est égal à 0. Pour (x − 2)(x − 8) = 0, on a donc x − 2 = 0 <b>ou</b> x − 8 = 0. Le mot « ou » signifie ici qu’il y a deux solutions possibles.</p>`),
      attention: 'Le signe entre les racines dépend de a : il est contraire à celui de a. Vérifie avec un nombre test.', astuce: { k: 'verif', t: 'Pour contrôler un signe, choisis un nombre entre les racines et calcule : B(5) = 9 est positif.' } },
    { titre: 'Le sommet et l’extremum', decouvre: { txt: `À quel prix le stand gagne-t-il le plus d’argent ? Observe la courbe : deux prix symétriques donnent le même bénéfice, par exemple ${H('3 €')} et ${H('7 €')}.`, img: SK.sommet() },
      comprends: `<p>Le <b>sommet</b> est le point le plus haut (ou le plus bas) de la parabole. Sa valeur est l’<b>extremum</b> : un <b>maximum</b> si a &lt; 0, un <b>minimum</b> si a &gt; 0.</p><p>La parabole est symétrique par rapport à la droite verticale qui passe par le sommet : c’est l’<b>axe de symétrie</b>. L’abscisse du sommet est donc le <b>milieu des deux racines</b> : x<sub>S</sub> = (2 + 8) ÷ 2 = 5.</p><p>On calcule ensuite l’ordonnée : B(5) = − 25 + 50 − 16 = 9. Le bénéfice maximal est de 9 dizaines d’euros, soit 90 €, pour un prix de 5 €.</p>`,
      vois: sommet, voisLeg: 'Le trait rouge est l’axe de symétrie, x = 5. Les points verts (3 ; 5) et (7 ; 5) sont symétriques : même ordonnée.',
      retiens: `<p>${FM(R`x_S=\dfrac{x_1+x_2}{2} \qquad y_S=f(x_S)`)}</p><p class="small">Complément : on a aussi ${FM(R`x_S=-\dfrac{b}{2a}`)}.</p><p>Le sommet est le point <b>S(x<sub>S</sub> ; y<sub>S</sub>)</b>.</p>`,
      exemple: `<p>x<sub>S</sub> = (2 + 8) ÷ 2 = <b>5</b>.</p><p>B(5) = <b>9</b> : maximum atteint pour un prix de 5 €.</p>`,
      wide: K.prog('un tableau de valeurs', 'Une boucle <code>for</code> répète un calcul pour plusieurs valeurs de x. Elle affiche le tableau de valeurs de B.', `def B(x):\n    return -x**2 + 10*x - 16\n\nfor x in range(0, 11):\n    print(x, B(x))`, `<p class="prog-q">Quelle est la plus grande valeur affichée ? ${bl(14, '9')} Pour quel x ? ${bl(14, '5')}</p>`),
      attention: 'L’extremum est l’ordonnée du sommet (9), pas son abscisse (5). Le prix est 5 €, le bénéfice est 9.', astuce: { k: 'og', t: 'L’abscisse du sommet est toujours au milieu des deux racines. Si tu trouves un autre nombre, contrôle.' } }];

  c.mots = [['fonction du second degré', 'fonction de la forme ax² + bx + c avec a ≠ 0', 'B(x) = − x² + 10x − 16 est une fonction du second degré.'], ['parabole', 'courbe d’une fonction du second degré', 'La courbe du bénéfice est une parabole.'], ['racine', 'nombre x pour lequel f(x) = 0', '2 et 8 sont les racines de B.'], ['forme factorisée', 'écriture a(x − x₁)(x − x₂)', 'B(x) = − (x − 2)(x − 8) est la forme factorisée.'], ['produit nul', 'un produit est nul si un facteur est nul', 'Par le produit nul, x − 2 = 0 ou x − 8 = 0.'], ['sommet', 'point le plus haut ou le plus bas de la parabole', 'Le sommet de la parabole est (5 ; 9).'], ['axe de symétrie', 'droite verticale qui passe par le sommet', 'L’axe de symétrie a pour équation x = 5.'], ['extremum', 'maximum ou minimum d’une fonction', 'Le bénéfice maximal est un extremum : 9.'], ['signe', 'positif, nul ou négatif', 'B(x) est de signe positif entre 2 et 8.']];

  /* ---------- exercices résolus ---------- */
  chk(B(3) === 5 && (2 + 8) / 2 === 5 && B(5) === 9 && 1 - 6 + 5 === 0 && 25 - 30 + 5 === 0 && 9 - 18 + 5 === -4 && (1 + 5) / 2 === 3, 'c3 résolus');
  c.resolus = [
    { titre: 'Étudier la fonction du bénéfice', outil: '🧮 calculatrice', enonce: `Pour B(x) = − x² + 10 x − 16 = − (x − 2)(x − 8), calcule B(3), trouve les racines, le sommet et le bénéfice maximal.`,
      rows: [['B(3) = − 3² + 10 × 3 − 16 = − 9 + 30 − 16 = <b class="nw">5</b>', 'Le carré se calcule avant le « moins » : − 3² = − 9.'], ['B(x) = 0 : x − 2 = 0 ou x − 8 = 0, donc <b class="nw">x = 2 ou x = 8</b>', 'Produit nul : un facteur est nul.'], ['x<sub>S</sub> = (2 + 8) ÷ 2 = <b class="nw">5</b>', 'Le sommet est au milieu des racines.'], ['B(5) = − 25 + 50 − 16 = <b class="nw">9</b>', 'Maximum, car a = − 1 est négatif.']], verif: 'B(3) = B(7) = 5 : les points 3 et 7 sont symétriques par rapport à 5 ✓.', rep: 'Les racines sont 2 et 8. Le maximum, 9, est atteint pour x = 5.', go: ['e1', 'e2'] },
    { titre: 'À toi : un minimum', outil: '🧮 calculatrice', enonce: `Étudie f(x) = x² − 6 x + 5 = (x − 1)(x − 5) : racines, sommet, extremum.`, trous: [0, 1, 2, 3],
      rows: [['f(x) = 0 : x − 1 = 0 ou x − 5 = 0, donc x = ⟦1⟧ ou x = ⟦5⟧', 'Produit nul.'], ['x<sub>S</sub> = (1 + 5) ÷ 2 = ⟦3⟧', 'Milieu des racines.'], ['f(3) = 3² − 6 × 3 + 5 = ⟦− 4⟧', 'Ordonnée du sommet.'], ['a = 1 est positif : le ⟦minimum⟧ vaut − 4', 'a positif : parabole ouverte vers le haut.']], verif: 'f(1) = 1 − 6 + 5 = 0 et f(5) = 25 − 30 + 5 = 0 ✓.', rep: 'Racines 1 et 5, sommet (3 ; − 4), minimum égal à − 4.', go: ['e3'] }];
  c.entraine = [{ id: 'e1', gen: 'c3e1', lc: 1 }, { id: 'e2', gen: 'c3e2', lc: 1 }, { id: 'e3', gen: 'c3e3', lc: 3 }];

  /* ---------- je résous ---------- */
  chk(B(4) === 8 && -(16) + 40 - 16 === 8 && 16 + 40 - 16 === 40 && B(6) === 8, 'c3 p1');
  const A = x => x * (10 - x);
  chk(A(2) === 16 && A(10) === 0 && A(5) === 25 && 2 * (2 + 8) === 20, 'c3 p2');
  const B2 = x => -2 * x * x + 24 * x - 54;
  chk(B2(5) === 16 && B2(3) === 0 && B2(9) === 0 && B2(6) === 18 && B2(10) === -14 && -2 * (3 - 3) * (3 - 9) === 0 && -2 * (6 - 3) * (6 - 9) === 18, 'c3 p3');
  c.probs = [
    PB({ id: 'p1', etape: 2, lc: 4, comps: ['app', 'rea'], titre: 'Le meilleur prix de vente', intro: `<p>Le bénéfice du stand de bougies est ${H('B(x) = − x² + 10 x − 16')} dizaines d’euros, pour un prix de x euros.</p>`,
      qs: [Q('a.', 'Calcule B(4).', '− 16 + 40 − 16 = 8', 8, { w: 24 }), Q('b.', 'Calcule B(6).', '− 36 + 60 − 16 = 8', 8, { w: 24 }), Q('c.', 'Pour quel prix x le bénéfice est-il le plus grand ? (milieu de 4 et 6)', '(4 + 6) ÷ 2 = 5 €', 5, { w: 24 }), Q('d.', 'Quel est ce bénéfice maximal, en dizaines d’euros ?', 'B(5) = − 25 + 50 − 16 = 9', 9, { w: 24 })],
      err: { 0: [{ v: 40, m: '− x² vaut − 16 pour x = 4 : le carré est calculé avant le signe moins.' }], 2: [{ v: 8, m: 'Tu as donné le bénéfice. On demande le prix.' }], 3: [{ v: 5, m: 'Tu as donné le prix. Le maximum est la valeur de B en ce prix.' }] },
      hints: ['Remplace x par 4 puis par 6. Attention à − x².', 'Deux prix qui donnent le même bénéfice sont symétriques par rapport au sommet.', 'Pour le maximum, calcule B au prix du sommet.'], pouce: 'B(4) = B(6) : le sommet est au milieu de 4 et 6.', corr: 'a. 8. b. 8. c. 5 €. d. B(5) = 9 dizaines d’euros, soit 90 €.' }),
    PB({ id: 'p2', etape: 3, lc: 4, defi: 4, bulle: 'Ce cas se fait en 4 étapes. L’aire dépend d’une longueur x : c’est une fonction du second degré.', autravail: { comp: 'ana', txt: 'choisir les dimensions d’un espace d’exposition pour avoir la plus grande surface.' }, comps: ['ana', 'rea', 'val'], titre: 'Un enclos pour la vitrine',
      intro: `<p>Pour une exposition, Mia dispose de ${H('20 m')} de cordon : elle forme un rectangle de longueur ${H('x')} et de largeur ${H('10 − x')} (en mètres). L’aire est ${H('A(x) = x (10 − x)')}.</p>`,
      qs: [Q('a.', 'Calcule l’aire pour x = 2 (en m²).', '2 × 8 = 16 m²', 16, { w: 24 }), Q('b.', 'Pour quelle valeur de x non nulle l’aire est-elle nulle ? (A(x) = 0)', 'x (10 − x) = 0 : x = 0 ou x = 10', 10, { w: 24 }), Q('c.', 'Pour quelle valeur de x l’aire est-elle maximale ?', '(0 + 10) ÷ 2 = 5 m', 5, { w: 24 }), Q('d.', 'Quelle est l’aire maximale (en m²) ?', 'A(5) = 5 × 5 = 25 m²', 25, { w: 24 })],
      err: { 0: [{ v: 20, m: 'Tu as additionné. L’aire est le produit : longueur × largeur.' }], 2: [{ v: 25, m: 'Tu as donné l’aire. La question demande la longueur x.' }], 3: [{ v: 5, m: 'Tu as donné x. L’aire maximale est la valeur de A en ce point.' }] },
      hints: ['La largeur est 10 − x : pour x = 2, elle vaut 8.', 'Un produit est nul si un des facteurs est nul.', 'L’abscisse du sommet est au milieu des racines 0 et 10.'], pouce: 'Les racines sont 0 et 10 : le maximum est au milieu.', corr: 'a. 16 m². b. x = 10. c. x = 5 m. d. 25 m² : un carré de 5 m de côté.' }),
    PB({ id: 'p3', etape: 4, lc: 4, cls: 'bac', defi: 5, bulle: 'Voici une question de « vers le bac » : 5 étapes. La forme factorisée donne les racines, puis le sommet, puis le maximum.', autravail: { comp: 'com', txt: 'conseiller un prix de vente à une commerçante et expliquer pourquoi un prix trop élevé fait perdre de l’argent.' }, comps: ['rea', 'ana', 'com'], titre: 'Le prix des coussins',
      intro: `<p>Une boutique vend des coussins. Son bénéfice, en euros, pour un prix de x euros est ${H('B(x) = − 2x² + 24x − 54')}, soit ${H('B(x) = − 2 (x − 3)(x − 9)')}.</p>`,
      qs: [BQ('1', 'Calculer B(5).', 'rea', '− 50 + 120 − 54 = 16 €', 16, { w: 24 }), BQ('2', 'Donner le plus petit prix pour lequel le bénéfice est nul.', 'ana', '(x − 3)(x − 9) = 0 : x = 3 ou x = 9', 3, { w: 24 }), BQ('3', 'Donner le prix qui rapporte le plus.', 'ana', '(3 + 9) ÷ 2 = 6 €', 6, { w: 24 }), BQ('4', 'Calculer le bénéfice maximal.', 'rea', 'B(6) = − 72 + 144 − 54 = 18 €', 18, { w: 24 }), BQ('5', 'Justifier : à 10 €, la boutique gagne-t-elle de l’argent ?', 'com', 'Non : B(10) = − 200 + 240 − 54 = − 14 € : une perte, car 10 est au-delà de la racine 9.', null, { lines: 3 })],
      err: { 0: [{ v: -84, m: '− 2x² : le carré se calcule avant le « moins » et la multiplication par 2.' }], 2: [{ v: 9, m: 'Tu as donné la plus grande racine. Le prix qui rapporte le plus est au milieu des racines.' }], 3: [{ v: 6, m: 'Tu as donné le prix. Le bénéfice maximal est la valeur de B en ce prix.' }] },
      hints: ['Remplace x par 5 : 2 × 25 = 50, avec le signe moins.', 'La forme factorisée donne les racines tout de suite.', 'Pour savoir si B(10) est positif, calcule-le ou regarde le signe après la dernière racine.'], pouce: 'Racines 3 et 9 : le prix qui rapporte le plus est leur milieu.', corr: '1. 16 €. 2. 3 €. 3. 6 €. 4. 18 €. 5. Non : B(10) = − 14 €, c’est une perte.' })];

  c.bilan = [['Je sais reconnaître une parabole et son sens.', ['e1', 'p1']], ['Je sais trouver les racines d’une fonction du second degré.', ['e1', 'e3']], ['Je sais étudier le signe avec la forme factorisée.', ['e3', 'p3']], ['Je sais trouver le sommet et l’extremum.', ['e3', 'p2']]];
  c.words = require('./gl1')('c3');
  c.plusloin = { meca: [], probs: [] };
  return c;
};
