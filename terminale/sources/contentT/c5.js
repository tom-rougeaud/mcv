/* Chapitre 5 · Statistique à deux variables — Terminale Bac Pro (arrêté du 3 février 2020). Données réelles : Fevad. */
'use strict';
const K = require('./kitT');
const { rnd, H, FM, R, Q, BQ, PB, S, T, Rc, Ar, st, MCVP, bl, tab } = K;
const { SK, FEVAD } = require('./skT');
const { fr } = K.MCVG;
const L10 = Math.log10;

module.exports = function (chk) {
  const c = { id: 'c5', n: 5, col: 'donnees', icone: '📊', dom: 'Statistique et probabilités', titre: 'Statistique à deux variables', sous: 'Choisir le bon modèle pour prévoir' };
  c.parties = [{ t: 'Choisir un modèle d’ajustement', n: [1, 2] }, { t: 'Changements de variable', n: [3, 4] }, { t: 'Interpoler et extrapoler', n: [5] }];
  c.travail = { question: `De 2017 à 2023, les ventes en ligne en France sont passées de ${H('80,5')} à ${H('159,9 milliards d’euros')} (Fevad). Ton responsable veut une prévision pour 2025 et 2030. Quel modèle choisir, et quelle confiance lui accorder ? Notions 2 et 5.` };
  c.objectifs = ['Je saurai choisir un modèle d’ajustement adapté au nuage de points, avec un outil numérique.', 'Je saurai utiliser le coefficient de détermination R² pour comparer deux modèles.', 'Je saurai faire un changement de variable : z = log(y), z = 1/x ou z = qˣ.', 'Je saurai interpoler et extrapoler, en restant prudent.'];
  c.depart = 'c5';

  /* ---------- données réelles : ventes en ligne 2017-2023 (Fevad), x = année − 2017 ---------- */
  const PTS = FEVAD.map(([a, v]) => [a - 2017, v]);
  const fl = MCVP.fit(PTS), fz = MCVP.fit(PTS.map(([x, y]) => [x, L10(y)]));
  chk(rnd(fl.a) === 13.23 && rnd(fl.b) === 76.86 && rnd(fl.r2, 3) === .984 && rnd(fz.a, 4) === .0497 && rnd(fz.b, 4) === 1.9061 && rnd(fz.r2, 3) === .997, 'c5 ajustements Fevad');
  const q = Math.pow(10, fz.a), k = Math.pow(10, fz.b), E = x => k * Math.pow(q, x), Lf = x => fl.a * x + fl.b;
  chk(rnd(q, 3) === 1.121 && rnd(k) === 80.55 && rnd(E(8), 1) === 201.1 && rnd(Lf(8), 1) === 182.7 && rnd(E(13), 1) === 356.3 && rnd(Lf(13), 1) === 248.8, 'c5 prévisions');
  const Em = x => 80.55 * Math.pow(1.121, x);
  chk(rnd(Em(3.5), 1) === 120.1 && rnd(Em(3), 1) === 113.5, 'c5 interpolation');
  const PV = [[10, 138], [15, 101], [20, 82], [25, 67], [30, 61], [40, 49]], fpz = MCVP.fit(PV.map(([x, y]) => [1 / x, y])), fpl = MCVP.fit(PV);
  chk(rnd(fpz.a, 1) === 1182.6 && rnd(fpz.b, 1) === 20.9 && rnd(fpz.r2, 3) === .998 && rnd(fpl.r2, 2) === .86 && Math.round(1182.6 / 12 + 20.9) === 119, 'c5 prix et ventes');

  /* ---------- méthodes visuelles ---------- */
  const ORG = MCVP.ORG, BLUE = MCVP.BLUE, RED = MCVP.RED, VIO = MCVP.VIO;
  // 1. le nuage et deux courbes de tendance
  const g1 = MCVP.plot({ W: 600, H: 300, x: [0, 7, 1], y: [60, 180, 20], ml: 56, mt: 16, mb: 34, xl: 'x = année − 2017', yl: 'Md€', lab: 'Ventes en ligne 2017-2023 et deux modèles' });
  const v1 = S(600, 300, st(1, g1.base + g1.pts(PTS, { r: 5.5 }) + T(300, 297, 'l’axe vertical commence à 60', { fs: 11, c: 'ts' }))
    + st(2, g1.line(fl.a, fl.b, { stroke: BLUE, w: 2.4, dash: '8 5' }) + g1.txt(.2, 172, 'droite : y = 13,23x + 76,86', { a: 'start', fill: BLUE, cls: '' }))
    + st(3, g1.curve(E, { stroke: ORG, w: 2.6 }) + g1.txt(.2, 160, 'exponentielle : y = 80,55 × 1,121ˣ', { a: 'start', fill: ORG, cls: '' }))
    + st(4, g1.txt(6.9, 72, 'deux modèles proches des points : lequel garder ?', { a: 'end', fs: 13 })),
  'Les sept points des ventes en ligne, une droite et une courbe exponentielle d’ajustement');
  // 2. R² : les écarts entre les points et le modèle
  const g2 = MCVP.plot({ W: 600, H: 290, x: [0, 7, 1], y: [60, 180, 20], ml: 56, mr: 190, mt: 16, mb: 34, lab: 'Écarts entre les points et la droite' });
  const gauge = (y, lab, v, col) => T(430, y, `${lab} : R² ≈ ${fr(rnd(v, 3))}`, { fs: 12.5, a: 'start', fill: col }) + `<rect x="430" y="${y + 8}" width="150" height="14" rx="7" fill="#EEF0F7"/><rect x="430" y="${y + 8}" width="${(150 * v).toFixed(1)}" height="14" rx="7" fill="${col}"/>`;
  const v2 = S(600, 290, st(1, g2.base + g2.pts(PTS, { r: 5 }) + g2.line(fl.a, fl.b, { stroke: BLUE, w: 2.2, dash: '8 5' }))
    + st(2, PTS.map(([x, y]) => g2.seg(x, y, x, Lf(x), { stroke: RED, w: 2.6 })).join('') + g2.txt(.2, 172, 'écarts à la droite', { a: 'start', fill: RED, cls: '' }))
    + st(3, gauge(60, 'droite', fl.r2, BLUE) + gauge(120, 'exponentielle', fz.r2, ORG))
    + st(4, T(430, 186, 'plus R² est proche de 1,', { fs: 13, a: 'start' }) + T(430, 206, 'plus les écarts sont petits', { fs: 13, a: 'start' }) + T(430, 236, 'on garde l’exponentielle', { fs: 14, a: 'start', c: 'kt' })),
  'Les segments rouges sont les écarts entre les points et la droite ; les jauges comparent les R² des deux modèles');
  // 3. le changement de variable z = log(y)
  const ga = MCVP.plot({ W: 290, H: 270, x: [0, 6, 2], y: [60, 180, 40], ml: 44, mr: 8, mt: 24, mb: 30, fs: 11, lab: 'y en fonction de x' }), gb = MCVP.plot({ W: 290, H: 270, x: [0, 6, 2], y: [1.8, 2.3, .1], ml: 44, mr: 8, mt: 24, mb: 30, fs: 11, lab: 'z = log y en fonction de x' });
  const v3 = S(600, 300, st(1, ga.base + ga.pts(PTS, { r: 4.6 }) + ga.curve(E, { stroke: ORG, w: 2 }) + T(150, 16, 'points (x ; y) : une courbe', { fs: 13 }))
    + st(2, `<g transform="translate(310 0)">${gb.base + gb.pts(PTS.map(([x, y]) => [x, L10(y)]), { r: 4.6 })}</g>` + T(460, 16, 'points (x ; z), avec z = log(y)', { fs: 13 }) + Ar(268, 140, 318, 140, { w: 2.4, h: 9 }))
    + st(3, `<g transform="translate(310 0)">${gb.line(fz.a, fz.b, { stroke: RED, w: 2.4 })}</g>` + T(460, 292, 'z = 0,0497x + 1,9061 : une droite', { fs: 13, c: 'kt' }))
    + st(4, T(150, 292, 'q = 10^0,0497 ≈ 1,121 · k = 10^1,9061 ≈ 80,55', { fs: 12.5, c: 'kt' })),
  'À gauche, les points (x ; y) forment une courbe ; à droite, les points (x ; log y) sont alignés');
  // 4. le changement de variable z = 1/x
  const gc = MCVP.plot({ W: 290, H: 270, x: [0, 40, 10], y: [0, 160, 40], ml: 44, mr: 8, mt: 24, mb: 30, fs: 11, lab: 'ventes en fonction du prix' }), gd = MCVP.plot({ W: 290, H: 270, x: [0, .1, .025], y: [0, 160, 40], ml: 44, mr: 12, mt: 24, mb: 30, fs: 10, lx: 2, lab: 'ventes en fonction de 1/x' });
  const v4 = S(600, 300, st(1, gc.base + gc.pts(PV, { r: 4.6 }) + T(150, 16, 'ventes y selon le prix x (€)', { fs: 13 }))
    + st(2, gc.line(fpl.a, fpl.b, { stroke: BLUE, w: 1.8, dash: '6 4' }) + T(150, 292, 'droite en x : R² ≈ 0,86', { fs: 12.5, fill: BLUE }))
    + st(3, `<g transform="translate(310 0)">${gd.base + gd.pts(PV.map(([x, y]) => [1 / x, y]), { r: 4.6 }) + gd.line(fpz.a, fpz.b, { stroke: RED, w: 2.2 })}</g>` + T(460, 16, 'ventes y selon z = 1/x', { fs: 13 }) + Ar(268, 140, 318, 140, { w: 2.4, h: 9 }))
    + st(4, T(460, 292, 'y = 1 182,6z + 20,9 : R² ≈ 0,998', { fs: 12.5, c: 'kt' })),
  'À gauche, les ventes selon le prix ne sont pas alignées ; à droite, selon z = 1/x, elles le sont presque');
  // 5. interpoler et extrapoler
  const g5 = MCVP.plot({ W: 600, H: 300, x: [0, 13, 1], y: [0, 400, 50], ml: 56, mt: 16, mb: 34, xt: [0, 2, 4, 6, 8, 10, 12, 13].map(x => [x, String(2017 + x)]), yl: 'Md€', lab: 'Deux modèles prolongés jusqu’en 2030' });
  const v5 = S(600, 300, st(1, g5.base + g5.band(0, 6, { fill: '#FFC233', op: .22 }) + g5.pts(PTS, { r: 4.6 }) + g5.txt(3, 380, 'interpolation', { fs: 13 }) + g5.txt(9.5, 380, 'extrapolation', { fs: 13, fill: RED, cls: '' }))
    + st(2, g5.curve(E, { stroke: ORG, w: 2.4 }) + g5.line(fl.a, fl.b, { stroke: BLUE, w: 2.2, dash: '8 5' }))
    + st(3, g5.dot(8, 196.4, { r: 6.5, fill: '#FFC233', lab: '2025 : 196,4 (Fevad)', dx: 10, dy: 22 }))
    + st(4, g5.dot(13, E(13), { r: 5, fill: ORG }) + g5.txt(12.85, E(13), '356,3', { dx: -10, a: 'end', fs: 12.5 }) + g5.dot(13, Lf(13), { r: 5, fill: BLUE }) + g5.txt(12.85, Lf(13), '248,8', { dx: -10, dy: 16, a: 'end', fs: 12.5 })),
  'Dans la zone jaune, les deux modèles sont proches ; au-delà, ils s’écartent de plus en plus');

  c.notions = [
    { titre: 'Nuage de points et choix d’un modèle', decouvre: { txt: `De 2017 à 2023, selon la Fevad, les ventes en ligne sont passées de ${H('80,5')} à ${H('159,9 milliards d’euros')}. Les points du nuage sont-ils alignés ? Quelle forme de courbe les décrit le mieux ?`, img: SK.fevad() },
      comprends: `<p>Pour deux variables x et y, on place le <b>nuage de points</b> (xᵢ ; yᵢ). Sa forme guide le choix d’un <b>modèle d’ajustement</b>.</p><p>Points presque alignés : modèle <b>affine</b>, y = ax + b. Points qui montent de plus en plus vite : modèle <b>exponentiel</b>, y = k × qˣ. Points qui montent puis redescendent : modèle <b>polynomial</b> de degré 2.</p><p>Un tableur ou GeoGebra trace ces modèles : ce sont les « courbes de tendance ». Pour les ventes en ligne, on prend x = année − 2017. On obtient la droite y = 13,23x + 76,86 et la courbe y = 80,55 × 1,121ˣ.</p><p>Les deux semblent proches des points. Pour choisir, il faut un indicateur.</p>`,
      vois: v1, voisLeg: 'Les points réels (Fevad) sont proches de la droite bleue et de la courbe orange. À l’œil, difficile de trancher.',
      retiens: `<p>Affine : ${FM(R`y=ax+b`)} · exponentiel : ${FM(R`y=k\times q^x`)} · polynomial : ${FM(R`y=ax^2+bx+c`)}</p><p>Outils : courbe de tendance du tableur, commande « Ajustement » de GeoGebra.</p>`,
      exemple: `<p>Droite : <b>y = 13,23x + 76,86</b>.</p><p>Exponentielle : <b>y = 80,55 × 1,121ˣ</b>, soit + 12,1 % par an.</p>`,
      attention: 'Dans le tableur, x est le rang (0 pour 2017), pas l’année : avec 2017, les coefficients seraient énormes et peu lisibles.', astuce: { k: 'sens', t: 'Regarde d’abord le nuage : la forme des points propose le modèle, le calcul le confirme.' } },
    { titre: 'Le coefficient de détermination R²', decouvre: { txt: `Le tableur affiche ${H('R² ≈ 0,984')} pour la droite et ${H('R² ≈ 0,997')} pour la courbe exponentielle. Que mesurent ces nombres ? Quel modèle garder ?`, img: SK.r2gauge() },
      comprends: `<p>Le <b>coefficient de détermination R²</b> mesure la qualité d’un ajustement. Il est compris entre 0 et 1.</p><p>Plus R² est proche de 1, plus les points sont proches du modèle. Un R² proche de 0 indique qu’un modèle de ce type ne convient pas.</p><p>Pour les ventes en ligne : 0,984 pour la droite et 0,997 pour l’exponentielle. Les deux sont bons, mais l’exponentiel l’est davantage. La croissance se fait plutôt à pourcentage constant, environ + 12 % par an.</p><p>R² ne suffit pas toujours : le modèle doit aussi avoir du sens. Un modèle qui prévoit des ventes négatives ne convient pas, même avec un bon R².</p>`,
      vois: v2, voisLeg: 'Les segments rouges sont les écarts entre les points et la droite. R² résume ces écarts : plus il est proche de 1, plus ils sont petits.',
      retiens: `<p>${FM(R`0\le R^2\le 1`)} : plus R² est proche de 1, meilleur est l’ajustement.</p><p>Tableur : =COEFFICIENT.DETERMINATION, ou « Afficher le coefficient de détermination » sur la courbe de tendance.</p>`,
      exemple: `<p>Affine : R² ≈ 0,984. Exponentiel : R² ≈ 0,997.</p><p>On garde le modèle <b>exponentiel</b>.</p>`,
      wide: K.rais('comparer, sans affirmer', `<p>R² ≈ 0,997 ne <b>prouve</b> pas que les ventes suivront ce modèle. Il dit seulement que, de 2017 à 2023, les points sont très proches de la courbe. Une phrase juste : « parmi les deux modèles testés, l’exponentiel est le plus proche des données ».</p>`),
      attention: 'R² ≈ 0,98 ne veut pas dire « 98 % de bonnes prévisions » : il mesure seulement la proximité des points observés.', astuce: { k: 'verif', t: 'Teste le modèle sur un point connu : pour 2020 (x = 3), 80,55 × 1,121³ ≈ 113,5, contre 110,4 réels.' } },
    { titre: 'Le changement de variable z = log(y)', decouvre: { txt: `Dans le tableau des ventes en ligne, on ajoute une ligne ${H('z = log(y)')}. Les points (x ; z) sont-ils mieux alignés que les points (x ; y) ?`, img: SK.zlog() },
      comprends: `<p>Un <b>changement de variable</b> transforme les données pour qu’un modèle affine convienne.</p><p>Si y = k × qˣ, alors log(y) = log(k) + x × log(q). En posant <b>z = log(y)</b>, on obtient z = ax + b : les points (x ; z) sont alignés.</p><p>Pour les ventes en ligne, le tableur donne z = 0,0497x + 1,9061, avec R² ≈ 0,997. On revient à y : q = 10<sup>0,0497</sup> ≈ 1,121 et k = 10<sup>1,9061</sup> ≈ 80,55.</p><p>On retrouve y = 80,55 × 1,121ˣ : c’est la courbe de tendance exponentielle du tableur. Le taux annuel moyen vaut environ 12,1 %.</p>`,
      vois: v3, voisLeg: 'Le logarithme « redresse » la courbe : les points (x ; log y) sont alignés, et la droite rouge donne les coefficients du modèle exponentiel.',
      retiens: `<p>${FM(R`z=\log y=ax+b \;\Rightarrow\; y=10^b\times(10^a)^x`)}</p><p>q = 10ᵃ donne le coefficient multiplicateur ; k = 10ᵇ, la valeur pour x = 0.</p>`,
      exemple: `<p>z = 0,0497x + 1,9061 → <b>y ≈ 80,55 × 1,121ˣ</b>.</p>`,
      wide: K.prog('calculer les logarithmes', 'Le module <code>math</code> de Python contient le logarithme décimal <code>log10</code>.', `import math\nventes = [80.5, 91.3, 101.8, 110.4, 127.2, 144.7, 159.9]\nfor y in ventes:\n    print(round(math.log10(y), 3))`, `<p class="prog-q">Quelle est la première valeur affichée ? ${bl(20, '1.906')} Combien de valeurs sont affichées ? ${bl(12, '7')}</p>`),
      attention: 'À la fin, reviens toujours à y : la prévision est un chiffre d’affaires, pas son logarithme.', astuce: { k: 'vite', t: 'q = 10ᵃ donne directement le taux : 1,121 correspond à + 12,1 % par an.' } },
    { titre: 'Les changements de variable z = 1/x et z = qˣ', decouvre: { txt: `Une boutique (entreprise fictive) teste ${H('six prix')} pour un même article et relève les ventes de la semaine. Plus le prix monte, moins elle vend, mais la baisse ralentit. Quel modèle choisir ?`, img: SK.prixVentes() },
      comprends: `<p>Quand y semble proportionnel à 1/x, on pose <b>z = 1/x</b>. Le modèle y = az + b est alors affine en z.</p><p>Pour les six prix testés, la droite en x ne donne que R² ≈ 0,86. Avec z = 1/x, le tableur donne y = 1 182,6z + 20,9 et R² ≈ 0,998. Pour un prix de 12 €, on prévoit 1 182,6 ÷ 12 + 20,9 ≈ 119 ventes.</p><p>Parfois, y se rapproche d’un palier : des ventes saisonnières qui se stabilisent, par exemple. On essaie alors <b>z = qˣ</b>, avec un q donné : y = az + b.</p><p>Dans tous les cas, on calcule z, on ajuste y en fonction de z, puis on revient à x.</p>`,
      vois: v4, voisLeg: 'À gauche, les ventes selon le prix forment une courbe. À droite, en fonction de z = 1/x, elles s’alignent sur la droite rouge.',
      retiens: `${K.tab(['Changement', 'Modèle affine obtenu', 'Modèle en x'], [['z = log(y)', 'z = ax + b', 'y = 10ᵇ × (10ᵃ)ˣ'], ['z = 1/x', 'y = az + b', 'y = a ÷ x + b'], ['z = qˣ', 'y = az + b', 'y = a × qˣ + b']])}`,
      exemple: `<p>Prix de 12 € : y ≈ 1 182,6 ÷ 12 + 20,9 ≈ <b>119 ventes</b>.</p><p>Ventes saisonnières : avec z = 0,7ˣ, le tableur donne y ≈ 201z + 49,8.</p>`,
      attention: 'Dans y = 1 182,6z + 20,9, on remplace z par 1 ÷ 12, et non par 12.', astuce: { k: 'og', t: 'Pour un prix très élevé, z = 1/x est presque nul : les ventes se rapprochent de b ≈ 21 par semaine.' } },
    { titre: 'Interpoler et extrapoler', decouvre: { txt: `La Fevad annonce ${H('196,4 milliards d’euros')} de ventes en ligne en 2025. Le modèle exponentiel construit sur 2017-2023 prévoyait 201,1 milliards ; la droite, 182,7. Peut-on se fier à une prévision pour 2030 ?`, img: SK.prevoir() },
      comprends: `<p>Utiliser un modèle <b>à l’intérieur</b> des données observées, c’est <b>interpoler</b>. Par exemple, estimer les ventes au milieu de l’année 2020 (x = 3,5).</p><p>L’utiliser <b>en dehors</b>, c’est <b>extrapoler</b> : prévoir 2025 ou 2030. C’est plus risqué, car rien ne garantit que la tendance continue.</p><p>Pour 2025 (x = 8), le modèle exponentiel donne 201,1 milliards et la droite 182,7. La valeur annoncée, 196,4, est entre les deux. Pour 2030 (x = 13), les modèles donnent 356,3 et 248,8 : plus de 100 milliards d’écart !</p><p>Plus on s’éloigne des données, plus les modèles divergent. Une extrapolation se présente toujours avec prudence.</p>`,
      vois: v5, voisLeg: 'Dans la zone jaune (2017-2023), les deux modèles collent aux points. Au-delà, ils s’écartent. Le point jaune est la valeur réelle de 2025.',
      retiens: `<p><b>Interpolation</b> : x dans l’intervalle des données. <b>Extrapolation</b> : x en dehors, avec prudence.</p><p>Une prévision s’accompagne du modèle utilisé et d’une réserve.</p>`,
      exemple: `<p>x = 3,5 (mi-2020) : 80,55 × 1,121<sup>3,5</sup> ≈ <b>120,1 Md€</b>.</p><p>2030 : entre 248,8 et 356,3 Md€ : trop incertain.</p>`,
      wide: K.rais('un contre-exemple', `<p>« Si R² est proche de 1, alors la prévision sera juste. » Cette phrase est fausse. Contre-exemple : en 2025, le modèle exponentiel (R² ≈ 0,997) se trompe d’environ 5 milliards. Un bon ajustement sur le passé ne garantit pas l’avenir.</p>`),
      attention: 'Une prévision lointaine n’est pas un résultat certain : donne-la avec un ordre de grandeur et une réserve.', astuce: { k: 'sens', t: 'Compare toujours deux modèles : s’ils divergent beaucoup, la prévision est fragile.' } }];

  c.mots = [['nuage de points', 'ensemble des points (xᵢ ; yᵢ) d’une série à deux variables', 'Le nuage des ventes monte de plus en plus vite.'], ['modèle d’ajustement', 'fonction simple qui approche le nuage', 'Le modèle exponentiel colle aux ventes.'], ['courbe de tendance', 'nom de l’ajustement dans un tableur', 'J’ajoute une courbe de tendance exponentielle.'], ['coefficient R²', 'nombre entre 0 et 1 qui mesure la qualité d’un ajustement', 'R² ≈ 0,997 : très bon ajustement.'], ['changement de variable', 'calcul d’une nouvelle variable (log y, 1/x…) pour obtenir un modèle affine', 'Avec z = log(y), les points s’alignent.'], ['interpolation', 'estimation à l’intérieur des données', 'Les ventes de mi-2020 sont une interpolation.'], ['extrapolation', 'prévision en dehors des données', 'Prévoir 2030, c’est extrapoler.'], ['taux annuel moyen', 'pourcentage constant qui résume une croissance', 'Le taux annuel moyen est d’environ 12 %.']];

  /* ---------- exercices résolus ---------- */
  const R1 = [[0, 12], [1, 14.5], [2, 17], [3, 20.5], [4, 24.5], [5, 29.5]], r1l = MCVP.fit(R1), r1z = MCVP.fit(R1.map(([x, y]) => [x, L10(y)]));
  chk(rnd(r1l.r2, 3) === .98 && rnd(r1z.r2, 4) === .9996 && rnd(Math.pow(10, r1z.a), 3) === 1.196 && rnd(Math.pow(10, r1z.b), 2) === 12.01 && rnd(12.01 * Math.pow(1.196, 7), 1) === 42, 'c5 résolu 1');
  chk(rnd(Math.pow(10, .0792), 2) === 1.2 && rnd(100 * Math.pow(1.2, 5), 2) === 248.83, 'c5 résolu 2');
  c.resolus = [
    { titre: 'Choisir et utiliser un modèle', outil: '📊 tableur', enonce: `Les visites mensuelles d’un site (fictif), en milliers, sont : ${H('12 ; 14,5 ; 17 ; 20,5 ; 24,5 ; 29,5')} pour x = 0 à 5. Le tableur donne deux courbes de tendance. Choisis un modèle et prévois les visites pour x = 7.`,
      rows: [['affine : y = 3,46x + 11,02, R² ≈ <b>0,980</b>', 'Première courbe de tendance.'], ['exponentielle : y = 12,01 × 1,196ˣ, R² ≈ <b>0,9996</b>', 'Deuxième courbe de tendance.'], ['0,9996 &gt; 0,980 : on garde l’<b>exponentielle</b>', 'R² le plus proche de 1.'], ['y(7) = 12,01 × 1,196⁷ ≈ <b>42,0</b> milliers', 'x = 7 est hors des données : extrapolation.']], verif: 'Pour x = 5 : 12,01 × 1,196⁵ ≈ 29,4, proche de 29,5 ✓.', rep: 'Avec le modèle exponentiel, on prévoit environ 42 000 visites pour x = 7, avec prudence (extrapolation).', go: ['e1'] },
    { titre: 'À toi : revenir de z = log(y) au modèle', outil: '🧮 calculatrice', enonce: `Après le changement de variable ${H('z = log(y)')}, le tableur donne ${H('z = 0,0792x + 2')}. Trouve le modèle y = k × qˣ, puis prévois y pour x = 5.`, trous: [0, 1, 2, 3],
      rows: [['q = 10<sup>0,0792</sup> ≈ ⟦1,2⟧', 'q = 10 puissance le coefficient de x.'], ['k = 10² = ⟦100⟧', 'k = 10 puissance l’ordonnée à l’origine.'], ['y = 100 × 1,2ˣ : hausse de ⟦20⟧ % par période', 'q = 1,2 : + 20 %.'], ['y(5) = 100 × 1,2⁵ ≈ ⟦248,83⟧', 'On remplace x par 5.']], verif: 'log(248,83) ≈ 2,396 et 0,0792 × 5 + 2 = 2,396 ✓.', rep: 'Le modèle est y = 100 × 1,2ˣ ; pour x = 5, y ≈ 248,83.', go: ['e2', 'e3'] }];
  c.entraine = [{ id: 'e1', gen: 'c5e1', lc: 2 }, { id: 'e2', gen: 'c5e2', lc: 3 }, { id: 'e3', gen: 'c5e3', lc: 4 }];

  /* ---------- je résous ---------- */
  const P1 = [[1, 210], [2, 260], [3, 300], [4, 355], [5, 400], [6, 450]], p1l = MCVP.fit(P1), p1z = MCVP.fit(P1.map(([x, y]) => [x, L10(y)]));
  chk(rnd(p1l.a, 2) === 47.86 && rnd(p1l.b, 2) === 161.67 && rnd(p1l.r2, 3) === .999 && rnd(p1z.r2, 3) === .989 && Math.round(47.86 * 8 + 161.67) === 545, 'c5 p1');
  const P2 = [[8, 121], [10, 99], [12, 85], [16, 67], [20, 56], [25, 46], [30, 40]], p2z = MCVP.fit(P2.map(([x, y]) => [1 / x, y])), p2l = MCVP.fit(P2);
  chk(rnd(p2z.a, 1) === 879.8 && rnd(p2z.b, 1) === 11.3 && rnd(p2z.r2, 4) === .9996 && rnd(p2l.r2, 2) === .89 && Math.round(879.8 / 18 + 11.3) === 60 && Math.round(879.8 / (70 - 11.3)) === 15, 'c5 p2');
  const TRS = [1.72, 1.81, 2.11, 2.24, 2.35].map((y, i) => [i, y]), tl = MCVP.fit(TRS), tz = MCVP.fit(TRS.map(([x, y]) => [x, L10(y)]));
  chk(rnd(tl.a, 3) === .169 && rnd(tl.b, 3) === 1.708 && rnd(tl.r2, 3) === .965 && rnd(tz.a, 4) === .0364 && rnd(tz.b, 3) === .235 && rnd(tz.r2, 3) === .957 && rnd(Math.pow(10, .0364), 3) === 1.087 && rnd(Math.pow(10, .235), 3) === 1.718 && rnd(.169 * 6 + 1.708, 2) === 2.72, 'c5 p3');
  c.probs = [
    PB({ id: 'p1', etape: 2, lc: 2, comps: ['app', 'rea'], titre: 'Les inscrits à une lettre d’information',
      intro: `<p>Une boutique (entreprise fictive) compte ses inscrits à sa lettre d’information chaque mois.</p>${tab(['Mois x', '1', '2', '3', '4', '5', '6'], [['Inscrits y', '210', '260', '300', '355', '400', '450']], 'dt-c')}<p>Le tableur propose : y = 47,86x + 161,67 (R² ≈ 0,999) et y = 188,1 × 1,163ˣ (R² ≈ 0,989).</p>`,
      qs: [Q('a.', 'Quel modèle a le meilleur R² ?', 'le modèle affine : 0,999 > 0,989', null, { lines: 1 }), Q('b.', 'Avec ce modèle, prévois le nombre d’inscrits au mois 8, à l’unité.', '47,86 × 8 + 161,67 ≈ 545', 545, { w: 22, tol: .6 }), Q('c.', 'Cette prévision est-elle une interpolation ou une extrapolation ?', 'une extrapolation : le mois 8 est après les données', null, { lines: 1 }), Q('d.', 'Estime les inscrits au milieu du mois 3 (x = 3,5), à l’unité.', '47,86 × 3,5 + 161,67 ≈ 329', 329, { w: 22, tol: .6 })],
      err: { 1: [{ v: Math.round(188.1 * Math.pow(1.163, 8)), m: 'Tu as utilisé le modèle exponentiel. Ici, c’est le modèle affine qui a le meilleur R².' }] },
      hints: ['Le meilleur modèle a le R² le plus proche de 1.', 'Remplace x par 8 dans y = 47,86x + 161,67.', 'Interpolation : dans les données ; extrapolation : en dehors.'], pouce: 'R² affine 0,999 > 0,989 : modèle affine. Pour x = 8 : 47,86 × 8 + 161,67.', corr: 'a. Affine (R² ≈ 0,999). b. ≈ 545 inscrits. c. Extrapolation. d. ≈ 329 inscrits (interpolation).' }),
    PB({ id: 'p2', etape: 3, lc: 4, defi: 4, bulle: 'Ce cas se fait en 4 étapes. Le changement de variable z = 1/x transforme une courbe en droite : on ajuste, puis on revient au prix.', autravail: { comp: 'ana', txt: 'choisir le prix d’un article à partir des ventes observées en magasin.' }, comps: ['app', 'rea', 'ana', 'com'], titre: 'Fixer le prix d’un article',
      intro: `<p>Une boutique (entreprise fictive) a testé plusieurs prix pour un article et relevé les ventes de la semaine.</p>${tab(['Prix x (€)', '8', '10', '12', '16', '20', '25', '30'], [['Ventes y', '121', '99', '85', '67', '56', '46', '40']], 'dt-c')}<p>La droite y = ax + b donne R² ≈ 0,89. Avec z = 1/x, le tableur donne y = 879,8z + 11,3 et R² ≈ 0,9996.</p>`,
      qs: [Q('a.', 'Calcule z pour x = 8 et pour x = 20.', '1 ÷ 8 = 0,125 ; 1 ÷ 20 = 0,05', null, { lines: 1 }), Q('b.', 'Quel modèle choisir ? Justifie avec R².', 'y = 879,8z + 11,3 : R² ≈ 0,9996 est plus proche de 1 que 0,89.', null, { lines: 1 }), Q('c.', 'Prévois les ventes pour un prix de 18 €, à l’unité.', '879,8 ÷ 18 + 11,3 ≈ 60', 60, { w: 22, tol: .6 }), Q('d.', 'Quel prix permet de vendre environ 70 articles par semaine ? Donne-le à l’euro près.', '879,8 ÷ x + 11,3 = 70 donne x ≈ 15 €', 15, { w: 22, tol: .6 })],
      err: { 2: [{ v: Math.round(879.8 * 18 + 11.3), m: 'On remplace z par 1 ÷ 18, et non par 18.' }] },
      hints: ['z = 1 ÷ x.', 'Pour 18 € : z = 1 ÷ 18, puis y = 879,8z + 11,3.', 'Pour 70 ventes : 879,8 ÷ x = 70 − 11,3, donc x = 879,8 ÷ 58,7.'], pouce: 'Modèle en z = 1/x. Pour un prix x : y = 879,8 ÷ x + 11,3. Pour 70 ventes, résous 879,8 ÷ x = 58,7.', corr: 'a. 0,125 et 0,05. b. Le modèle en z (R² ≈ 0,9996). c. ≈ 60 ventes. d. x ≈ 15 €.' }),
    PB({ id: 'p3', etape: 4, lc: 5, cls: 'bac', defi: 5, bulle: 'Voici une question de « vers le bac » : 5 étapes, avec des données réelles. Deux modèles, deux R², puis une prévision à confronter à la réalité. Une question ratée ne fait pas un exercice raté : continue.', autravail: { comp: 'val', txt: 'présenter une prévision de ventes à un responsable, en disant jusqu’où on peut lui faire confiance.' }, comps: ['rea', 'ana', 'val', 'com'], titre: 'Les achats en ligne : quel modèle ?',
      intro: `<p>Le tableau donne le nombre de transactions en ligne en France, en milliards, avec x = année − 2019.</p>${tab(['Année', '2019', '2020', '2021', '2022', '2023'], [['x', '0', '1', '2', '3', '4'], ['Transactions y', '1,72', '1,81', '2,11', '2,24', '2,35']], 'dt-c')}<p class="srcl">Source : Fevad, chiffres clés 2024. Pour 2025, la Fevad annonce 3,2 milliards de transactions (chiffres clés 2026).</p>`,
      qs: [BQ('1', 'Calculer z = log(y) pour 2019 et pour 2023, au millième.', 'rea', 'log(1,72) ≈ 0,236 ; log(2,35) ≈ 0,371', null, { lines: 1 }), BQ('2', 'Le tableur donne z = 0,0364x + 0,235 (R² ≈ 0,957). En déduire q = 10^0,0364 au millième.', 'rea', 'q ≈ 1,087 ; k = 10^0,235 ≈ 1,718 : y ≈ 1,718 × 1,087ˣ', 1.087, { w: 22, tol: .0006 }), BQ('3', 'Le modèle affine est y = 0,169x + 1,708 (R² ≈ 0,965). Quel modèle choisir ? Justifier.', 'ana', 'L’affine : son R² (0,965) est plus proche de 1 que 0,957.', null, { lines: 2 }), BQ('4', 'Prévoir le nombre de transactions en 2025 avec le modèle choisi, au centième.', 'rea', 'x = 6 : 0,169 × 6 + 1,708 ≈ 2,72 milliards', 2.72, { w: 22 }), BQ('5', 'Comparer à la valeur annoncée par la Fevad pour 2025, puis rédiger une conclusion pour un responsable.', 'com', 'Écart d’environ 0,48 milliard : la croissance a accéléré. Une extrapolation reste une estimation prudente.', null, { lines: 3 })],
      err: { 3: [{ v: rnd(1.718 * Math.pow(1.087, 6), 2), m: 'Tu as utilisé le modèle exponentiel. Ici, l’affine a le meilleur R².' }, { v: rnd(.169 * 2025 + 1.708, 2), m: 'x n’est pas l’année : pour 2025, x = 2025 − 2019 = 6.' }] },
      hints: ['z = log(y) : touche log.', 'q = 10 puissance 0,0364.', 'Pour 2025, x = 6.'], pouce: 'Compare les R² : 0,965 (affine) > 0,957. Prévision 2025 : x = 6 dans y = 0,169x + 1,708.', corr: '1. 0,236 et 0,371. 2. q ≈ 1,087. 3. L’affine (R² ≈ 0,965). 4. ≈ 2,72 milliards. 5. La Fevad annonce 3,2 milliards : le modèle sous-estime d’environ 0,48 milliard ; une extrapolation est une estimation prudente.' })];

  c.bilan = [['Je sais choisir un modèle d’ajustement avec un outil numérique.', ['e1', 'p1']], ['Je sais comparer deux modèles avec R².', ['e1', 'p3']], ['Je sais faire un changement de variable.', ['e2', 'e3', 'p2']], ['Je sais interpoler et extrapoler avec prudence.', ['p1', 'p3']]];
  c.words = require('./glT')('c5');
  c.plusloin = { meca: [], probs: [] };
  return c;
};
