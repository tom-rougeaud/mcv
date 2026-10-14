/* Chapitre 4 · Dérivation — 1re Bac Pro. */
'use strict';
const K = require('./kit1');
const { rnd, H, FM, R, Q, BQ, PB, prog, rais, tab, S, T, Rc, Ln, Ar, Br, st, MCVP, bl } = K;
const { SK } = require('./sk1');
const RED = MCVP.RED, BLUE = MCVP.BLUE, GRN = MCVP.GRN, INK = MCVP.INK;

module.exports = function (chk) {
  const c = { id: 'c4', n: 4, col: 'fonction', icone: '📐', dom: 'Algèbre-analyse · dérivation', titre: 'Fonction dérivée et étude des variations', sous: 'La dérivée : suivre une variation' };
  c.parties = [{ t: 'Nombre dérivé et tangente', n: [1] }, { t: 'Fonction dérivée et variations', n: [2, 3] }, { t: 'Applications : coût marginal et fonction inverse', n: [4, 5] }];
  c.travail = { question: `Le bénéfice d’un stand est ${H('B(x) = − x² + 10x − 16')}. Quand on augmente le prix de 1 €, le bénéfice monte-t-il ou descend-il ? De combien, à peu près ? Il y a un outil pour le savoir à chaque prix : la dérivée.` };
  c.objectifs = ['Je saurai calculer un taux de variation et lire la pente d’une tangente.', 'Je saurai calculer un nombre dérivé et une fonction dérivée.', 'Je saurai étudier les variations avec le signe de la dérivée.', 'Je saurai interpréter une dérivée comme un coût marginal.', 'Je saurai étudier la fonction inverse.'];
  c.depart = 'c4';

  const B = x => -x * x + 10 * x - 16, Bp = x => -2 * x + 10;
  chk(B(3) === 5 && B(4) === 8 && B(3.5) === 6.75 && (B(4) - B(3)) === 3 && (B(3.5) - B(3)) / .5 === 3.5 && Bp(3) === 4 && 4 * 3 - 7 === 5 && Bp(5) === 0 && B(5) === 9, 'c4 fil rouge');
  chk([1, .5, .1, .01].map(h => Math.round(((B(3 + h) - B(3)) / h) * 100) / 100).join() === '3,3.5,3.9,3.99', 'c4 taux');
  const rep = (lab, o = {}) => MCVP.plot({ W: 600, H: 300, x: [0, 10, 1], y: [-16, 12, 4], ml: 52, mt: 18, mb: 30, zeroAxes: true, fine: true, lab, ...o });
  const arrow = (x1, y1, x2, y2, col) => { const a = Math.atan2(y2 - y1, x2 - x1), L = 11; return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="3"/><polygon points="${x2},${y2} ${(x2 - L * Math.cos(a - .45)).toFixed(1)},${(y2 - L * Math.sin(a - .45)).toFixed(1)} ${(x2 - L * Math.cos(a + .45)).toFixed(1)},${(y2 - L * Math.sin(a + .45)).toFixed(1)}" fill="${col}"/>`; };

  // 1. de la sécante à la tangente (zoom sur [1 ; 6])
  const g1 = MCVP.plot({ W: 600, H: 300, x: [1, 6, 1], y: [0, 12, 2], ml: 52, mt: 18, mb: 30, fine: true, lab: 'Des sécantes qui se rapprochent de la tangente en A(3 ; 5)' });
  const tang = S(600, 300, st(1, g1.base + g1.curve(B, { stroke: BLUE, w: 3.2 }) + g1.dot(3, 5, { r: 6, fill: '#FFC233' }) + g1.txt(3, 5, 'A (3 ; 5)', { dx: 12, dy: 20, a: 'start' }))
    + st(2, g1.seg(2, 2, 4.6, 9.8, { stroke: '#7438C0', w: 2.2 }) + g1.dot(4, 8, { r: 4.5, fill: '#fff', stroke: '#7438C0' }) + g1.txt(4.6, 9.8, 'pente 3', { dx: 6, dy: -4, a: 'start', fill: '#7438C0', cls: '', fs: 12 }))
    + st(3, g1.seg(2, 1.5, 4.6, 10.6, { stroke: '#B05200', w: 2.2 }) + g1.dot(3.5, 6.75, { r: 4.5, fill: '#fff', stroke: '#B05200' }) + g1.txt(4.6, 10.6, 'pente 3,5', { dx: 6, dy: -4, a: 'start', fill: '#B05200', cls: '', fs: 12 }))
    + st(4, g1.seg(2, 1, 4.6, 11.4, { stroke: RED, w: 3.2 }) + g1.txt(4.6, 11.4, 'tangente : pente 4', { dx: -8, dy: -8, a: 'end', fill: RED, cls: '', fs: 13 })),
  'Les droites passant par A et un point de plus en plus proche ont une pente qui se rapproche de 4, pente de la tangente');

  // 2. la fonction dérivée B'(x) = -2x + 10
  const g2 = MCVP.plot({ W: 600, H: 280, x: [0, 10, 1], y: [-10, 10, 5], ml: 52, mt: 18, mb: 30, zeroAxes: true, fine: true, lab: 'La fonction dérivée B′(x) = − 2x + 10' });
  const deriv = S(600, 280, st(1, g2.base + g2.line(-2, 10, { stroke: RED, w: 3.2 }) + g2.txt(6, 8.5, 'B′(x) = − 2x + 10', { a: 'start', fill: RED, cls: '', fs: 13 }))
    + st(2, g2.guide(3, 4) + g2.dot(3, 4, { r: 5.5, fill: '#FFC233' }) + g2.txt(3, 4, 'B′(3) = 4', { dx: 12, dy: -10, a: 'start' }))
    + st(3, g2.dot(5, 0, { r: 5.5, fill: '#FFC233' }) + g2.txt(5, 0, 'B′(5) = 0', { dx: 10, dy: -12, a: 'start' }) + g2.txt(0.3, -5, 'avant 5 : B′ > 0, B monte', { a: 'start', fs: 12 }) + g2.txt(0.3, -7.5, 'après 5 : B′ < 0, B descend', { a: 'start', fs: 12 })),
  'La droite B′(x) = − 2x + 10 vaut 4 en x = 3 et 0 en x = 5');

  // 3. variations : courbe + tableau aligné
  const g3 = MCVP.plot({ W: 600, H: 240, x: [0, 10, 1], y: [-16, 12, 4], ml: 140, mr: 20, mt: 14, mb: 28, zeroAxes: true, fine: true, lab: 'Variations de B' });
  const X0 = g3.X(0), X5 = g3.X(5), X10 = g3.X(10);
  const tv = (y) => `<rect x="14" y="${y}" width="572" height="150" rx="6" fill="#fff" stroke="${INK}" stroke-width="2"/><line x1="14" y1="${y + 46}" x2="586" y2="${y + 46}" stroke="${INK}" stroke-width="1.6"/><line x1="14" y1="${y + 94}" x2="586" y2="${y + 94}" stroke="${INK}" stroke-width="1.6"/><line x1="124" y1="${y}" x2="124" y2="${y + 150}" stroke="${INK}" stroke-width="1.6"/>`
    + T(69, y + 30, 'x', { fs: 15 }) + T(69, y + 76, 'signe de B′', { fs: 13 }) + T(69, y + 116, 'variations', { fs: 13 }) + T(69, y + 134, 'de B', { fs: 13 }) + T(X0 + 8, y + 30, '0', { fs: 15 }) + T(X5, y + 30, '5', { fs: 15 }) + T(X10 - 8, y + 30, '10', { fs: 15 })
    + T((X0 + X5) / 2, y + 76, '+', { fs: 20, c: 'kt' }) + T(X5, y + 76, '0', { fs: 15 }) + T((X5 + X10) / 2, y + 76, '−', { fs: 22, c: 'kt' })
    + arrow(X0 + 44, y + 136, X5 - 24, y + 108, GRN) + arrow(X5 + 24, y + 108, X10 - 44, y + 136, RED) + T(X0 + 18, y + 142, '− 16', { fs: 13 }) + T(X5, y + 112, '9', { fs: 15 }) + T(X10 - 18, y + 142, '− 16', { fs: 13 });
  const gv = MCVP.plot({ W: 600, H: 240, x: [0, 10, 1], y: [-16, 12, 4], ml: 140, mr: 20, mt: 14, mb: 28, zeroAxes: true, fine: true });
  const varia = S(600, 410, st(1, gv.base + gv.curve(B, { stroke: BLUE, w: 3 }))
    + st(2, gv.curve(B, { stroke: GRN, w: 4.4, a: 0, b: 5 }) + gv.curve(B, { stroke: RED, w: 4.4, a: 5, b: 10 }) + gv.seg(3.6, 9, 6.4, 9, { stroke: INK, dash: '5 4', w: 2 }) + gv.dot(5, 9, { r: 5.5, fill: '#FFC233' }) + gv.txt(5, 9, 'tangente horizontale', { dy: -12, fs: 12 }))
    + st(3, tv(250)),
  'La courbe monte jusqu’à x = 5 puis descend ; le tableau résume la même information');
  chk(B(0) === -16 && B(10) === -16 && Bp(4) > 0 && Bp(6) < 0, 'c4 variations');

  // 4. coût marginal et dérivée
  const Cf = q => .5 * q * q + 3 * q + 10;
  const Ct = q => .5 * q * q + 2 * q + 20;
  chk(Ct(10) === 90 && Ct(11) === 102.5 && (Ct(10) + 12 * 1) === 102 && Cf(20) === 270 && Cf(21) === 293.5, 'c4 coût');
  const g4 = MCVP.plot({ W: 600, H: 300, x: [6, 14, 1], y: [60, 160, 20], ml: 56, mt: 18, mb: 30, fine: true, lab: 'Coût C(q) = 0,5 q² + 2q + 20 et tangente en q = 10' });
  const marg = S(600, 300, st(1, g4.base + g4.curve(Ct, { stroke: BLUE, w: 3.2 }) + g4.dot(10, 90, { r: 6, fill: '#FFC233' }) + g4.txt(10, 90, 'C(10) = 90', { dx: 12, dy: 26, a: 'start' }))
    + st(2, g4.seg(7.5, 12 * 7.5 - 30, 12.6, 12 * 12.6 - 30, { stroke: RED, w: 2.8 }) + g4.txt(6.2, 150, 'tangente en 10 : pente C′(10) = 12', { a: 'start', fill: RED, cls: '' }))
    + st(3, g4.seg(10, 90, 11, 90, { stroke: INK, dash: '4 3', w: 1.8 }) + g4.seg(11, 90, 11, 102.5, { stroke: GRN, w: 3 }) + g4.dot(11, 102.5, { r: 4.5, fill: '#fff', stroke: GRN }) + g4.txt(11, 96, 'C(11) − C(10) = 12,5', { dx: 8, a: 'start', fs: 12, fill: GRN, cls: '' }))
    + st(4, g4.txt(6.2, 138, 'coût marginal : 12,5 ≈ 12', { a: 'start', fill: GRN, cls: '' })),
  'Une unité de plus à partir de 10 coûte 12,5 euros ; la dérivée en 10 vaut 12');

  // 5. fonction inverse
  const inv = x => 1 / x;
  chk(inv(2) === .5 && -1 / (1 * 1) === -1 && rnd(4 + 600 / 100, 2) === 10 && rnd(-600 / (100 * 100), 2) === -.06, 'c4 fonction inverse');
  const g5 = MCVP.plot({ W: 600, H: 300, x: [-4, 4, 1], y: [-4, 4, 1], ml: 44, mt: 16, mb: 30, zeroAxes: true, fine: true, lab: 'La fonction inverse f(x) = 1 ÷ x' });
  const invG = S(600, 300, st(1, g5.base + g5.curve(inv, { a: .25, b: 4, stroke: BLUE, w: 3.2 }) + g5.txt(3, 1 / 3, 'x > 0', { dy: -12, fill: BLUE, cls: '' }))
    + st(2, g5.curve(inv, { a: -4, b: -.25, stroke: BLUE, w: 3.2 }) + g5.txt(-3, -1 / 3, 'x < 0', { dy: 22, fill: BLUE, cls: '' }))
    + st(3, g5.line(-1, 2, { stroke: RED, w: 2.6 }) + g5.dot(1, 1, { r: 6, fill: '#FFC233' }) + g5.txt(1, 1, 'f′(1) = − 1', { dx: 12, dy: -10, a: 'start', fill: RED, cls: '' }))
    + st(4, g5.txt(.3, -2.5, 'f′(x) = − 1 ÷ x² < 0 : f décroît', { a: 'start', fs: 13 }) + g5.txt(.3, -3.1, 'sur ]− ∞ ; 0[ et sur ]0 ; + ∞[', { a: 'start', fs: 13 }) + g5.txt(.3, -3.7, '0 n’a pas d’image', { a: 'start', fs: 12 })),
  'L’hyperbole a deux branches ; la tangente en (1 ; 1) a pour pente − 1');

  c.notions = [
    { titre: 'Taux de variation et tangente', decouvre: { txt: `Au prix de ${H('3 €')}, le bénéfice est ${H('B(3) = 5')}. Si le prix passe à ${H('4 €')}, de combien le bénéfice augmente-t-il ? Et pour une très petite hausse ?`, img: SK.pente() },
      comprends: `<p>Le <b>taux de variation</b> de f entre a et a + h est le rapport (f(a + h) − f(a)) ÷ h. Il donne la variation de f pour une hausse de 1 de x. Sur la courbe, c’est la <b>pente de la sécante</b>, la droite qui passe par les deux points.</p><p>Pour B entre 3 et 4 : (8 − 5) ÷ 1 = 3. Entre 3 et 3,5 : (6,75 − 5) ÷ 0,5 = 3,5. Quand h devient très petit, le taux se rapproche de 4.</p><p>Ce nombre 4 est le <b>nombre dérivé</b> de B en 3, noté B′(3). Il est égal à la <b>pente de la tangente</b> à la courbe en A(3 ; 5). La tangente est la droite qui « épouse » la courbe en ce point.</p>${tab(['h', '1', '0,5', '0,1', '0,01'], [['taux entre 3 et 3 + h', '3', '3,5', '3,9', '3,99']], 'dt-c')}`,
      vois: tang, voisLeg: 'Les trois premières droites passent par A et un second point de plus en plus proche : leurs pentes sont 3, 3,5 puis presque 4. La tangente (rouge) a pour pente 4.',
      retiens: `<p>${FM(R`\text{taux entre } a \text{ et } a+h=\dfrac{f(a+h)-f(a)}{h}`)}</p><p>${FM(R`f'(a)=\text{pente de la tangente en } A(a\,;\,f(a))`)}</p><p>Équation réduite de la tangente en A : ${FM(R`y=f'(a)(x-a)+f(a)`)}</p>`,
      exemple: `<p>Entre 3 et 4 : taux = <b>3</b>.</p><p>B′(3) = <b>4</b> : à 3 €, une hausse de 1 € augmente le bénéfice d’environ 4.</p>`,
      wide: K.prog('un taux de plus en plus précis', 'Ce programme calcule le taux de variation de B entre 3 et 3 + h pour des h de plus en plus petits.', `def B(x):\n    return -x**2 + 10*x - 16\n\nfor h in [1, 0.5, 0.1, 0.01]:\n    taux = (B(3 + h) - B(3)) / h\n    print(h, round(taux, 2))`, `<p class="prog-q">Vers quel nombre tendent les taux affichés ? ${bl(14, '4')} Comment s’appelle ce nombre ? ${bl(40, 'le nombre dérivé B′(3)')}</p>`),
      attention: 'Le nombre dérivé est une pente, pas une valeur de la fonction : B′(3) = 4 alors que B(3) = 5.', astuce: { k: 'sens', t: 'Pente positive : la courbe monte. Pente négative : elle descend. Pente nulle : tangente horizontale.' } },
    { titre: 'La fonction dérivée', decouvre: { txt: `On veut connaître la pente de la tangente à chaque prix, pas seulement en 3. Existe-t-il une formule qui donne ${H('B′(x)')} pour tout x ?`, img: SK.derivee() },
      comprends: `<p>La <b>fonction dérivée</b> f′ donne, pour chaque x, le nombre dérivé f′(x). On la calcule avec des règles, sans tracer de tangente.</p>${tab(['f(x)', 'ax + b', 'x²', 'k × f(x)', 'f(x) + g(x)', '1 ÷ x', 'x³ (complément)'], [['f′(x)', 'a', '2x', 'k × f′(x)', 'f′(x) + g′(x)', '− 1 ÷ x²', '3x²']], 'dt-c')}<p>Un nombre seul a pour dérivée 0. Pour B(x) = − x² + 10x − 16 : la dérivée de − x² est − 2x, celle de 10x est 10, celle de − 16 est 0. Donc B′(x) = − 2x + 10.</p><p>On retrouve B′(3) = − 6 + 10 = 4, comme avec les sécantes. On dérive donc chaque terme séparément, puis on additionne les résultats. Pour f(x) = 3x² − 6x + 1, on obtient f′(x) = 6x − 6.</p>`,
      vois: deriv, voisLeg: 'La courbe de B′ est une droite. En x = 3 elle vaut 4 (pente de la tangente). En x = 5 elle vaut 0 : la tangente de B y est horizontale.',
      retiens: `<p>${FM(R`(ax^2+bx+c)'=2ax+b \qquad (ax+b)'=a`)}</p><p>${FM(R`(k\,f)'=k\,f' \qquad (f+g)'=f'+g' \qquad \left(\dfrac1x\right)'=-\dfrac1{x^2}`)}</p><p class="small">Complément : ${FM(R`(x^3)'=3x^2`)}</p>`,
      exemple: `<p>f(x) = 3x² − 6x + 1 : f′(x) = <b>6x − 6</b>.</p><p>f′(2) = 12 − 6 = <b>6</b>.</p>`,
      attention: 'La dérivée de ax² est 2ax : le facteur 2 se multiplie par a. Ne dérive pas un nombre seul en le gardant : il devient 0.', astuce: { k: 'verif', t: 'Contrôle : la dérivée de ax² + bx + c est de degré 1. Si tu gardes un x², tu as oublié de baisser le degré.' } },
    { titre: 'Signe de la dérivée et variations', decouvre: { txt: `B′(x) = − 2x + 10. Pour quels prix le bénéfice augmente-t-il quand le prix monte ? Pour quels prix diminue-t-il ?`, img: SK.variations() },
      comprends: `<p>Le signe de la dérivée donne le sens de variation : si f′(x) est <b>positive</b> sur un intervalle, f est <b>croissante</b> (la courbe monte). Si f′(x) est <b>négative</b>, f est <b>décroissante</b> (la courbe descend).</p><p>Pour B : B′(x) = 0 pour x = 5. Avant 5, B′ est positive (B′(4) = 2). Après 5, B′ est négative (B′(6) = − 2). Donc B croît jusqu’à 5, puis décroît : B(5) = 9 est un <b>maximum</b>, et la tangente y est horizontale.</p><p>On résume dans un <b>tableau de variations</b> : la ligne du signe de B′, puis les flèches de B.</p><p>Sur [0 ; 10], 9 est le <b>maximum global</b> : aucune valeur de B ne le dépasse. Le <b>minimum global</b>, − 16, est atteint aux bornes, en 0 et en 10. Un extremum <b>local</b> n’est le plus grand (ou le plus petit) que pour les x proches.</p>`,
      vois: varia, voisLeg: 'En vert, la partie où B monte (B′ positive). En rouge, la partie où B descend (B′ négative). Le tableau est aligné sur la courbe.',
      retiens: `<p>${FM(R`f'>0 \Rightarrow f \text{ croissante} \qquad f'<0 \Rightarrow f \text{ décroissante}`)}</p><p>Si f′ s’annule en changeant de signe, f a un <b>extremum</b> en ce point.</p>`,
      exemple: `<p>B′(x) = 0 ⇔ − 2x + 10 = 0 ⇔ <b>x = 5</b>.</p><p>Maximum : B(5) = <b>9</b>.</p>`,
      attention: 'Une dérivée nulle ne suffit pas : il faut que le signe de f′ change de + à − (maximum) ou de − à + (minimum).', astuce: { k: 'og', t: 'Contrôle avec le chapitre 3 : le sommet de B est le milieu des racines 2 et 8, c’est bien x = 5.' } },
    { titre: 'Dérivée et coût marginal', decouvre: { txt: `Le coût de fabrication est ${H('C(q) = 0,5 q² + 2q + 20')}. Combien coûte la 11ᵉ pièce ? Et combien vaut la dérivée en ${H('q = 10')} ?`, img: SK.tangente() },
      comprends: `<p>Le <b>coût marginal</b> est le coût d’un article de plus : C(q + 1) − C(q). Pour C(q) = 0,5 q² + 2q + 20 : C(10) = 90 et C(11) = 102,5. Le coût marginal en 10 est 12,50 €.</p><p>La dérivée C′(q) = q + 2 donne C′(10) = 12. C’est la pente de la tangente en q = 10. Elle est <b>très proche</b> du coût marginal : l’écart est de 0,50.</p><p>En gestion, on utilise donc C′(q) comme une <b>approximation du coût marginal</b>, surtout quand on fabrique beaucoup d’articles. Plus q est grand, plus l’écart relatif est petit.</p>`,
      vois: marg, voisLeg: 'La tangente en q = 10 a pour pente 12. L’écart vertical réel pour une pièce de plus est de 12,5.',
      retiens: `<p>${FM(R`\text{coût marginal}=C(q+1)-C(q)\approx C'(q)`)}</p><p>Plus on fabrique d’articles, plus l’approximation est bonne.</p>`,
      exemple: `<p>C′(q) = q + 2, donc C′(10) = <b>12</b>.</p><p>Réalité : C(11) − C(10) = <b>12,5</b>.</p>`,
      wide: K.rais('≈ n’est pas =', `<p>Le symbole <b>≈</b> veut dire « environ égal ». Ici, 12 ≈ 12,5 : les deux nombres sont proches mais <b>différents</b>. Écrire 12 = 12,5 serait faux. En mathématiques, une approximation se signale toujours.</p>`),
      attention: 'La dérivée donne une approximation du coût marginal, pas sa valeur exacte : on écrit ≈, pas =.', astuce: { k: 'vite', t: 'Pour le coût marginal exact, soustrais C(q + 1) − C(q). Pour une estimation rapide, calcule C′(q).' } },
    { titre: 'La fonction inverse', decouvre: { txt: `Au chapitre 1, le coût moyen d’une bougie était ${H('CM(q) = 4 + 600 ÷ q')}. Il diminue quand q augmente. Comment le prouver avec la dérivée ?`, img: SK.inverse() },
      comprends: `<p>La <b>fonction inverse</b> est f(x) = 1 ÷ x. Elle est définie pour tout x différent de 0 : 0 n’a pas d’image.</p><p>Sa courbe est une <b>hyperbole</b> à deux branches : une pour x &gt; 0, une pour x &lt; 0. Plus x est grand, plus 1 ÷ x est proche de 0.</p><p>Sa dérivée est f′(x) = − 1 ÷ x². Comme x² est positif, f′(x) est toujours <b>négative</b> : f est décroissante sur ]− ∞ ; 0[ et sur ]0 ; + ∞[.</p><p>Application : CM(q) = 4 + 600 × (1 ÷ q). Sa dérivée est CM′(q) = − 600 ÷ q², négative : le coût moyen diminue bien quand la production augmente.</p>`,
      vois: invG, voisLeg: 'Les deux branches de l’hyperbole descendent. La tangente rouge en (1 ; 1) a pour pente f′(1) = − 1.',
      retiens: `<p>${FM(R`f(x)=\dfrac1x \quad (x\neq 0) \qquad f'(x)=-\dfrac1{x^2}`)}</p><p>f est <b>décroissante</b> sur ]− ∞ ; 0[ et sur ]0 ; + ∞[.</p>`,
      exemple: `<p>f(2) = <b>0,5</b> ; f′(2) = − 1 ÷ 4 = <b>− 0,25</b>.</p><p>CM′(100) = − 600 ÷ 10 000 = <b>− 0,06</b>.</p>`,
      wide: K.rais('x ∈ ]0 ; + ∞[', `<p>On écrit <b>x ∈ ]0 ; + ∞[</b> (« x appartient à l’intervalle de 0 exclu à plus l’infini ») pour dire que x est strictement positif. On ne dit pas que f est décroissante « sur ℝ » : elle n’est pas définie en 0, et ses deux branches ne se raccordent pas.</p>`),
      attention: 'Ne divise jamais par 0 : la fonction inverse n’a pas de valeur en x = 0.', astuce: { k: 'verif', t: 'Contrôle : 1 ÷ 4 = 0,25 est plus petit que 1 ÷ 2 = 0,5 ; la fonction décroît bien pour x > 0.' } }];

  c.mots = [['taux de variation', 'variation de f divisée par la variation de x', 'Le taux entre 3 et 4 est 3.'], ['sécante', 'droite qui passe par deux points de la courbe', 'La sécante passe par A et par le point d’abscisse 4.'], ['tangente', 'droite qui touche la courbe en un point et en suit la direction', 'La tangente en A a pour pente 4.'], ['nombre dérivé', 'pente de la tangente en un point, noté f′(a)', 'Le nombre dérivé B′(3) vaut 4.'], ['fonction dérivée', 'fonction qui donne le nombre dérivé pour chaque x', 'B′(x) = − 2x + 10 est la fonction dérivée de B.'], ['fonction croissante', 'fonction dont la courbe monte', 'B est croissante avant 5.'], ['fonction décroissante', 'fonction dont la courbe descend', 'B est décroissante après 5.'], ['tableau de variations', 'tableau qui résume signe de f′ et sens de variation de f', 'Le tableau de variations de B montre un maximum de 9.'], ['coût marginal', 'coût d’un article supplémentaire', 'Le coût marginal en 10 est environ 12.']];

  /* ---------- exercices résolus ---------- */
  const f6 = x => x * x - 6 * x + 5;
  chk(Bp(3) === 4 && B(3) === 5 && 4 * (3 - 3) + 5 === 5 && f6(4) === -3 && 2 * 4 - 6 === 2 && f6(3) === -4, 'c4 résolus');
  c.resolus = [
    { titre: 'Dériver, tangente et variations', outil: '🧮 calculatrice', enonce: `Pour B(x) = − x² + 10x − 16, calcule B′(x), le nombre dérivé en 3, l’équation de la tangente en 3, puis les variations de B.`,
      rows: [['B′(x) = <b class="nw">− 2x + 10</b>', 'Je dérive terme à terme : (− x²)′ = − 2x, (10x)′ = 10, (− 16)′ = 0.'], ['B′(3) = − 2 × 3 + 10 = <b class="nw">4</b>', 'Je remplace x par 3.'], ['y = B′(3)(x − 3) + B(3) = 4(x − 3) + 5 = <b class="nw">4x − 7</b>', 'Équation de la tangente en A(3 ; 5).'], ['B′(x) = 0 ⇔ x = 5 : B croît sur [0 ; 5], décroît sur [5 ; 10], maximum <b class="nw">B(5) = 9</b>', 'B′ est positive avant 5, négative après.']], verif: 'La tangente passe par A : 4 × 3 − 7 = 5 = B(3) ✓.', rep: 'B′(x) = − 2x + 10 ; B′(3) = 4 ; tangente y = 4x − 7 ; maximum 9 pour x = 5.', go: ['e1', 'e2'] },
    { titre: 'À toi : variations d’une fonction', outil: '🧮 calculatrice', enonce: `Étudie f(x) = x² − 6x + 5 : sa dérivée, f′(4), le point où f′ s’annule et l’extremum. (Tu as trouvé le sommet au chapitre 3.)`, trous: [0, 1, 2, 3],
      rows: [['f′(x) = ⟦2⟧x − ⟦6⟧', 'Dérivée de x², de − 6x et de 5.'], ['f′(4) = 2 × 4 − 6 = ⟦2⟧', 'Pente de la tangente en 4.'], ['f′(x) = 0 ⇔ 2x = 6 ⇔ x = ⟦3⟧', 'Là où la tangente est horizontale.'], ['f(3) = 9 − 18 + 5 = ⟦− 4⟧ : un ⟦minimum⟧', 'f′ passe de négative à positive.']], verif: 'On retrouve le sommet (3 ; − 4) du chapitre 3 ✓.', rep: 'f′(x) = 2x − 6 ; f′(4) = 2 ; minimum − 4 pour x = 3.', go: ['e3'] }];
  c.entraine = [{ id: 'e1', gen: 'c4e1', lc: 1 }, { id: 'e2', gen: 'c4e2', lc: 2 }, { id: 'e3', gen: 'c4e3', lc: 3 }];

  /* ---------- je résous ---------- */
  chk(Cf(20) === 270 && Cf(21) === 293.5 && 293.5 - 270 === 23.5 && 20 + 3 === 23, 'c4 p1');
  const Rv = x => -2 * x * x + 40 * x;
  chk(Rv(8) === 192 && -4 * 5 + 40 === 20 && Rv(10) === 200 && -4 * 10 + 40 === 0, 'c4 p2');
  const B3 = x => -x * x + 12 * x - 20;
  chk(B3(2) === 0 && B3(10) === 0 && -2 * 4 + 12 === 4 && B3(6) === 16 && -2 * 8 + 12 === -4 && B3(8) === 12 && B3(9) === 7, 'c4 p3');
  c.probs = [
    PB({ id: 'p1', etape: 3, lc: 4, autravail: { comp: 'ana', txt: 'estimer le coût d’une pièce supplémentaire avant d’accepter une commande.' }, comps: ['app', 'rea', 'ana'], titre: 'Le coût de la pièce de plus', intro: `<p>Le coût total de fabrication de q pièces est ${H('C(q) = 0,5 q² + 3q + 10')} euros.</p>`,
      qs: [Q('a.', 'Calcule C(20).', '0,5 × 400 + 60 + 10 = 270 €', 270, { w: 26 }), Q('b.', 'Calcule C(21).', '0,5 × 441 + 63 + 10 = 293,50 €', 293.5, { w: 26 }), Q('c.', 'Calcule le coût marginal en 20 : C(21) − C(20).', '293,5 − 270 = 23,5 €', 23.5, { w: 26 }), Q('d.', 'La dérivée est C′(q) = q + 3. Calcule C′(20).', '20 + 3 = 23', 23, { w: 26 })],
      err: { 0: [{ v: 210, m: 'Le carré se calcule avant la multiplication par 0,5 : 20² = 400.' }], 2: [{ v: 23, m: 'Tu as donné la dérivée. Ici on soustrait les deux coûts.' }], 3: [{ v: 23.5, m: 'Tu as donné le coût marginal exact. Pour la dérivée, utilise C′(q) = q + 3.' }] },
      hints: ['Remplace q par 20 dans la formule, en calculant le carré d’abord.', 'Le coût marginal est la différence C(21) − C(20).', 'Dans C′(q) = q + 3, remplace q par 20.'], pouce: 'La dérivée 23 et le coût marginal 23,5 sont proches : c’est normal.', corr: 'a. 270 €. b. 293,50 €. c. 23,50 €. d. C′(20) = 23.' }),
    PB({ id: 'p2', etape: 3, lc: 3, defi: 4, bulle: 'Ce cas se fait en 4 étapes. La dérivée sert à repérer où la recette est la plus grande.', autravail: { comp: 'ana', txt: 'choisir le prix d’un produit pour que la recette soit la plus grande.' }, comps: ['ana', 'rea', 'val'], titre: 'La recette selon le prix',
      intro: `<p>La recette d’une boutique en ligne pour un prix de x euros est ${H('R(x) = − 2x² + 40x')} (en euros).</p>`,
      qs: [Q('a.', 'Calcule R(8).', '− 2 × 64 + 320 = 192 €', 192, { w: 26 }), Q('b.', 'La dérivée est R′(x) = − 4x + 40. Calcule R′(5).', '− 20 + 40 = 20', 20, { w: 26 }), Q('c.', 'Pour quel prix x la dérivée s’annule-t-elle ? Résous − 4x + 40 = 0.', '4x = 40 donc x = 10 €', 10, { w: 26 }), Q('d.', 'Quelle est la recette maximale ?', 'R(10) = − 200 + 400 = 200 €', 200, { w: 26 })],
      err: { 0: [{ v: -128, m: 'N’oublie pas le terme 40x : R(8) = − 128 + 320.' }], 2: [{ v: 40, m: 'Tu as donné un coefficient. Résous l’équation pour trouver x.' }], 3: [{ v: 10, m: 'Tu as donné le prix. La recette maximale est R en ce prix.' }] },
      hints: ['Calcule d’abord − 2 × 8².', 'Remplace x par 5 dans − 4x + 40.', 'La recette est maximale là où R′ passe de + à −.'], pouce: 'R′(5) = 20 est positive : la recette augmente encore à 5 €.', corr: 'a. 192 €. b. 20. c. 10 €. d. 200 €.' }),
    PB({ id: 'p3', etape: 4, lc: 3, cls: 'bac', defi: 5, bulle: 'Voici une question de « vers le bac » : 5 étapes. Le signe de la dérivée dit si le bénéfice monte ou descend ; ne le confonds pas avec la valeur du bénéfice.', autravail: { comp: 'com', txt: 'conseiller à un commerçant de ne pas augmenter son prix au-delà d’une valeur.' }, comps: ['rea', 'ana', 'com'], titre: 'Faut-il augmenter le prix ?',
      intro: `<p>Le bénéfice d’un stand, en euros, pour un prix de x euros est ${H('B(x) = − x² + 12x − 20')}. Sa dérivée est ${H('B′(x) = − 2x + 12')}.</p>`,
      qs: [BQ('1', 'Calculer le nombre dérivé B′(4).', 'rea', '− 8 + 12 = 4', 4, { w: 24 }), BQ('2', 'Résoudre B′(x) = 0.', 'ana', '− 2x + 12 = 0 donc x = 6', 6, { w: 24 }), BQ('3', 'Calculer le bénéfice maximal B(6).', 'rea', '− 36 + 72 − 20 = 16 €', 16, { w: 24 }), BQ('4', 'Calculer B′(8).', 'rea', '− 16 + 12 = − 4', -4, { w: 24 }), BQ('5', 'Justifier : à 8 €, faut-il monter le prix à 9 € ?', 'com', 'Non : B′(8) = − 4 est négative, B décroît après 6 : B(8) = 12 € et B(9) = 7 €.', null, { lines: 3 })],
      err: { 0: [{ v: 20, m: 'Tu as calculé 12 + 8. Le terme est − 2x : pour x = 4, il vaut − 8.' }], 1: [{ v: 12, m: 'Tu as donné un coefficient. Résous l’équation pour trouver x.' }], 3: [{ v: 4, m: 'Le signe est faux : − 2 × 8 = − 16, puis + 12 donne − 4.' }] },
      hints: ['Remplace x par 4 dans − 2x + 12.', 'Résous − 2x + 12 = 0 comme une équation.', 'Une dérivée négative veut dire que la fonction décroît.'], pouce: 'Après le maximum (x = 6), la dérivée est négative : le bénéfice baisse.', corr: '1. 4. 2. x = 6. 3. 16 €. 4. − 4. 5. Non : B′(8) < 0 et B(9) = 7 € < B(8) = 12 €.' })];

  c.bilan = [['Je sais calculer un taux de variation et lire la pente d’une tangente.', ['e1', 'p1']], ['Je sais calculer un nombre dérivé et une fonction dérivée.', ['e2', 'p3']], ['Je sais étudier les variations avec le signe de la dérivée.', ['e3', 'p3']], ['Je sais interpréter une dérivée comme un coût marginal.', ['p1', 'p2']], ['Je sais étudier la fonction inverse et sa dérivée.', ['e2']]];
  c.words = require('./gl1')('c4');
  c.plusloin = { meca: [], probs: [] };
  return c;
};
