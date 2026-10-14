/* Chapitre 8 · Géométrie dans l’espace — 1re Bac Pro. */
'use strict';
const K = require('./kit1');
const { rnd, H, FM, R, Q, BQ, PB, prog, rais, tab, S, T, Rc, Ln, Ar, Br, st, MCVP, bl } = K;
const { SK } = require('./sk1');
const G = require('../shared/t8.js');
const RED = MCVP.RED, INK = MCVP.INK, GRN = MCVP.GRN, BLUE = MCVP.BLUE;
const PI = Math.PI;
const Tf = (x, y, s, fill, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 14}" text-anchor="${o.a || 'middle'}" font-weight="700" fill="${fill}">${s}</text>`;

module.exports = function (chk) {
  const c = { id: 'c8', n: 8, col: 'geometrie', icone: '📦', dom: 'Géométrie · géométrie dans l’espace', titre: 'Solides, volumes et emballages' };
  c.travail = { question: `L’Atelier Mia lance des bougies en forme de ${H('cylindre')}, de ${H('cône')} et de ${H('boule')}. Combien de cire faut-il pour chacune ? Dans quelle boîte les ranger pour perdre le moins de place ? Pour répondre, il faut savoir dessiner un solide, calculer son volume et imaginer ce qu’on voit quand on le coupe.` };
  c.objectifs = ['Je saurai lire et compléter un solide en perspective cavalière.', 'Je saurai calculer le volume d’un prisme, d’un cylindre, d’une pyramide et d’un cône.', 'Je saurai calculer le volume d’une boule.', 'Je saurai reconnaître la section d’un solide par un plan.'];
  c.depart = 'c8';

  /* 1. perspective cavalière d’un carton 30 × 20 × 15 cm (échelle 6 px/cm, fuyantes à 45°, coefficient 0,5) */
  const s1 = 6.4, ox = 150, oy = 240, p = G.cav(ox, oy, s1), Wd = 30, Hd = 20, Dd = 15, v = (x, y, z) => p(x * Wd, y * Hd, z * Dd);
  const A = v(0, 0, 0), B = v(1, 0, 0), C = v(1, 1, 0), D = v(0, 1, 0), E = v(0, 0, 1), F = v(1, 0, 1), Gg = v(1, 1, 1), Hh = v(0, 1, 1);
  chk(Math.abs((F[0] - B[0]) - 15 * s1 * .5 * Math.SQRT1_2) < 1e-9 && Math.abs((B[1] - F[1]) - (F[0] - B[0])) < 1e-9, 'c8 perspective : fuyante à 45°, coefficient 0,5');
  const arc = `<path d="M${(B[0] + 34).toFixed(1)} ${B[1]} A34 34 0 0 0 ${(B[0] + 34 * Math.SQRT1_2).toFixed(1)} ${(B[1] - 34 * Math.SQRT1_2).toFixed(1)}" fill="none" stroke="${RED}" stroke-width="2"/>`;
  const persp = S(600, 290, st(1, G.poly([A, B, C, D], { fill: '#F3E1C7', op: .7 }) + [[A, B], [B, C], [C, D], [D, A]].map(([a, b]) => G.L(a, b)).join('') + G.cote([A[0], A[1] + 14], [B[0], B[1] + 14], '30 cm', { dy: 18 }) + G.cote([A[0] - 14, A[1]], [D[0] - 14, D[1]], '20 cm', { dx: -30 }) + T(300, 24, 'face avant : en vraie grandeur', { fs: 14, c: 'ts' }))
    + st(2, [[B, F], [C, Gg], [D, Hh]].map(([a, b]) => G.L(a, b, { stroke: RED, w: 2.6 })).join('') + arc + Tf(B[0] + 44, B[1] - 8, '45°', RED, { a: 'start' }) + Tf(Gg[0] + 10, Gg[1] + 4, 'fuyante : 15 cm, dessinée 7,5 cm', RED, { a: 'start', fs: 13 }))
    + st(3, [[F, Gg], [Gg, Hh]].map(([a, b]) => G.L(a, b)).join('') + [[A, E], [E, F], [E, Hh]].map(([a, b]) => G.L(a, b, { dash: 1, w: 1.8 })).join('') + Tf(E[0] + 8, E[1] - 30, 'arêtes cachées en pointillés', BLUE, { a: 'start', fs: 13 })),
  'Un carton dessiné en perspective cavalière : face avant en vraie grandeur, fuyantes à 45 degrés réduites de moitié, arêtes cachées en pointillés');

  /* 2. cylindre et cône de même base et même hauteur : r = 4 cm, h = 9 cm */
  const Vcy = 144 * PI, Vco = 48 * PI;
  chk(rnd(Vcy, 2) === 452.39 && rnd(Vco, 2) === 150.8 && rnd(16 * PI, 2) === 50.27 && rnd(Vco * .9, 1) === 135.7, 'c8 volumes cylindre et cône');
  const s2 = 18, by = 230;
  const vol = S(600, 290, st(1, G.cyl(160, by, s2, 4, 9, { fill: '#E0EBFD' }) + G.L([160, by], [160 + 72, by], { stroke: RED, w: 1.6 }) + T(196, by + 20, 'r = 4 cm', { fs: 13, c: 'kt' }) + T(160, 30, 'cylindre : V = aire de base × h', { fs: 14 }) + T(160, 282, '≈ 452,39 cm³', { fs: 15, c: 'kt' }))
    + st(2, G.cone(440, by, s2, 4, 9, { fill: '#FDE3E0' }) + T(440, 30, 'cône : V = aire de base × h ÷ 3', { fs: 14 }) + T(440, 282, '≈ 150,80 cm³', { fs: 15, c: 'kt' }) + G.L([440, by], [440, by - 162], { stroke: RED, w: 1.4, dash: 1 }) + T(448, by - 81, 'h = 9 cm', { fs: 13, a: 'start', c: 'kt' }))
    + st(3, Ar(255, 150, 340, 150, { w: 3, lab: '÷ 3', dy: -10 })),
  'Un cylindre et un cône de même base et de même hauteur : le cône a un volume trois fois plus petit');

  /* 3. la boule dans sa boîte : vue de face, r = 3 cm, cube de 6 cm */
  const Vb = 36 * PI;
  chk(rnd(Vb, 2) === 113.1 && 6 * 6 * 6 === 216 && Math.round(Vb / 216 * 100) === 52, 'c8 boule');
  const k3 = 30, bx = 120, byy = 40;
  const boule = S(600, 260, st(1, `<rect x="${bx}" y="${byy}" width="${6 * k3}" height="${6 * k3}" rx="3" fill="#F3E1C7" stroke="${INK}" stroke-width="2.4"/>` + T(bx + 3 * k3, byy + 6 * k3 + 24, 'boîte cubique : 6 cm de côté (vue de face)', { fs: 13, c: 'ts' }))
    + st(2, `<circle cx="${bx + 3 * k3}" cy="${byy + 3 * k3}" r="${3 * k3}" fill="#D6F2F2" stroke="${INK}" stroke-width="2.4"/>` + G.L([bx + 3 * k3, byy + 3 * k3], [bx + 6 * k3, byy + 3 * k3], { stroke: RED, w: 2 }) + T(bx + 4.5 * k3, byy + 3 * k3 - 8, 'r = 3 cm', { fs: 13, c: 'kt' }) + `<circle cx="${bx + 3 * k3}" cy="${byy + 3 * k3}" r="3" fill="${INK}"/>`)
    + st(3, T(450, 90, 'boule : 4/3 × π × 3³', { fs: 14 }) + T(450, 114, '≈ 113,10 cm³', { fs: 16, c: 'kt' }) + T(450, 150, 'cube : 6³ = 216 cm³', { fs: 14 }) + T(450, 186, 'la boule remplit', { fs: 14 }) + T(450, 208, 'environ 52 % de la boîte', { fs: 15, c: 'kt' })),
  'Une boule de rayon 3 centimètres dans une boîte cubique de 6 centimètres');

  /* 4. sections planes : quatre solides */
  const SEC = G.SECTIONS, pick4 = ['pave', 'cylH', 'cone', 'pyr'].map(k => SEC.find(x => x.k === k));
  const secs = S(600, 300, pick4.map((sx, i) => st(i + 1, `<g transform="translate(${(i % 2) * 300} ${Math.floor(i / 2) * 150 - 34}) scale(.75)">${sx.draw(200, 200)}</g>` + T((i % 2) * 300 + 150, Math.floor(i / 2) * 150 + 140, `${['pavé', 'cylindre', 'cône', 'pyramide'][i]} → ${sx.rep}`, { fs: 14, c: 'kt' }))).join(''),
  'Sections par un plan parallèle à une face ou à la base : rectangle, disque, disque plus petit, carré plus petit');

  c.notions = [
    { titre: 'Représenter un solide en perspective', decouvre: { txt: `Pour une fiche produit, il faut dessiner un carton de ${H('30 × 20 × 15 cm')} sur une feuille plate. Comment montrer qu’il a une profondeur ?`, img: SK.cartons() },
      comprends: `<p>Les <b>solides usuels</b> sont le cube, le pavé droit et le prisme droit. Ce sont aussi le cylindre, la pyramide, le cône et la boule.</p><p>Pour les dessiner, on utilise la <b>perspective cavalière</b>.</p><ul><li>La face avant est dessinée en <b>vraie grandeur</b>.</li><li>Les arêtes qui partent vers l’arrière s’appellent les <b>fuyantes</b>. Elles sont parallèles et inclinées, souvent à 45°.</li><li>Leur longueur est multipliée par un <b>coefficient</b>, souvent 0,5.</li><li>Les <b>arêtes cachées</b> sont en pointillés.</li></ul><p>Ici, la profondeur de 15 cm est dessinée 7,5 cm (à l’échelle du dessin).</p>`,
      vois: persp, voisLeg: 'Étape 1 : la face avant. Étape 2 : trois fuyantes rouges, parallèles, à 45°. Étape 3 : la face arrière et les arêtes cachées.',
      retiens: `<p>Face avant : <b>vraie grandeur</b>. Fuyantes : <b>parallèles</b>, angle de <b>45°</b>, longueur × <b>0,5</b>.</p><p>Arêtes cachées : <b>pointillés</b>.</p>`,
      exemple: `<p>Profondeur réelle 15 cm → fuyante dessinée <b>7,5</b> (même unité).</p><p>Un pavé a <b>12</b> arêtes, dont <b>3</b> cachées en perspective.</p>`,
      wide: K.rais('le dessin trompe un peu', `<p>Sur le dessin, la face du dessus n’a pas d’angle droit, et la profondeur paraît plus courte. Pourtant, dans la réalité, toutes les faces du carton sont des rectangles. Pour calculer, on utilise toujours les <b>vraies</b> dimensions, jamais celles qu’on mesure sur les fuyantes du dessin.</p>`),
      attention: 'Ne mesure pas une fuyante sur le dessin pour connaître une longueur : elle est réduite.', astuce: { k: 'verif', t: 'Contrôle : dans un pavé, les arêtes parallèles dans la réalité restent parallèles sur le dessin.' } },
    { titre: 'Volumes : prismes, cylindres, pyramides, cônes', decouvre: { txt: `Une bougie cylindrique et une bougie conique ont la même base (${H('rayon 4 cm')}) et la même hauteur (${H('9 cm')}). Faut-il la même quantité de cire ?`, img: SK.cylindre() },
      comprends: `<p>Pour un <b>prisme droit</b> ou un <b>cylindre</b> (vu en 2de), le volume est l’aire de la base multipliée par la hauteur : V = B × h.</p><p>Pour une <b>pyramide</b> ou un <b>cône</b>, qui se terminent en pointe, le volume est trois fois plus petit : V = B × h ÷ 3.</p><p>Bougie cylindrique : B = π × 4² ≈ 50,27 cm², V ≈ 50,27 × 9 ≈ 452,39 cm³. Bougie conique : V = 452,39 ÷ 3 ≈ 150,80 cm³.</p><p>Conversions : 1 dm³ = 1 L = 1 000 cm³. La bougie conique contient donc environ 0,15 L de cire.</p>`,
      vois: vol, voisLeg: 'Même base et même hauteur : il faudrait trois cônes de cire pour remplir le cylindre.',
      retiens: `<p>Prisme, cylindre : ${FM(R`V=B\times h`)} · Pyramide, cône : ${FM(R`V=\dfrac{B\times h}{3}`)}</p><p>Disque : ${FM(R`B=\pi r^2`)} · ${FM(R`1\ \text{L}=1\ \text{dm}^3=1\,000\ \text{cm}^3`)}</p>`,
      exemple: `<p>Cône : r = 4, h = 9 : V = π × 16 × 9 ÷ 3 ≈ <b>150,80 cm³</b>.</p><p>Pyramide à base carrée de 6 cm, h = 9 : V = 36 × 9 ÷ 3 = <b>108 cm³</b>.</p>`,
      wide: K.prog('une fonction volume', 'Le module <code>math</code> donne la valeur de π. Une fonction calcule le volume d’un cône pour n’importe quel rayon et n’importe quelle hauteur.', `from math import pi\n\ndef volume_cone(r, h):\n    return pi * r**2 * h / 3\n\nprint(round(volume_cone(4, 9), 2))   # affiche 150.8`, `<p class="prog-q">Quelle ligne changer pour un cylindre ? ${bl(40, 'enlever « / 3 »')} Que renvoie <code>volume_cone(3, 10)</code>, au centième ? ${bl(18, '94,25')}</p>`),
      attention: 'Dans π × r², c’est le rayon qui est au carré, pas le diamètre. Divise d’abord le diamètre par 2.', astuce: { k: 'og', t: 'Ordre de grandeur : π ≈ 3. Pour r = 4 et h = 9 : 3 × 16 × 9 ÷ 3 = 144, proche de 150,80.' } },
    { titre: 'Le volume de la boule', decouvre: { txt: `Une bougie en forme de ${H('boule')} a un rayon de ${H('3 cm')}. On la vend dans une boîte cubique de ${H('6 cm')} de côté. Quelle part de la boîte la bougie occupe-t-elle ?`, img: SK.section() },
      comprends: `<p>Une <b>sphère</b> est une surface : tous ses points sont à la même distance r du centre. La <b>boule</b> est le solide plein qu’elle entoure.</p><p>Le volume d’une boule de rayon r est V = 4/3 × π × r³. Pour r = 3 cm : V = 4/3 × π × 27 = 36 π ≈ 113,10 cm³.</p><p>La boîte cubique a un volume de 6 × 6 × 6 = 216 cm³. La bougie en occupe environ 113,10 ÷ 216 ≈ 0,52, soit 52 % : près de la moitié de la boîte est vide. Pour une boule de rayon 4 cm, on trouve environ 268,08 cm³.</p>`,
      vois: boule, voisLeg: 'Vue de face : le disque de rayon 3 cm touche les quatre bords du carré de 6 cm, mais les coins restent vides.',
      retiens: `<p>${FM(R`V_{\text{boule}}=\dfrac43\times\pi\times r^3`)}</p><p>Le diamètre de la boule vaut 2r.</p>`,
      exemple: `<p>r = 3 cm : V = 36 π ≈ <b>113,10 cm³</b>.</p><p>r = 4 cm : V ≈ <b>268,08 cm³</b>.</p>`,
      attention: 'Dans la formule, r est au cube (r × r × r), et on multiplie par 4/3, pas par 4.', astuce: { k: 'vite', t: 'Sur la calculatrice : 4 ÷ 3 × π × 3 ^ 3. Contrôle : le résultat est plus petit que le cube qui contient la boule.' } },
    { titre: 'Les sections planes', decouvre: { txt: `Mia coupe ses bougies avant de les emballer. Quelle forme voit-on sur la face coupée d’un ${H('pavé')}, d’un ${H('cylindre')} ou d’un ${H('cône')} ?`, img: SK.pyramide() },
      comprends: `<p>Quand on coupe un solide par un plan, la face obtenue est une <b>section plane</b>.</p><ul><li>Pavé coupé parallèlement à une face : un <b>rectangle</b> identique à cette face.</li><li>Cylindre coupé parallèlement à la base : un <b>disque</b> de même rayon. Coupé par un plan qui contient l’axe : un <b>rectangle</b>.</li><li>Cône ou pyramide coupés parallèlement à la base : un disque ou un polygone <b>plus petit</b>, une <b>réduction</b> de la base.</li><li>Boule coupée par un plan : toujours un <b>disque</b>.</li></ul><p>Pour un cône de rayon 4 cm et de hauteur 12 cm, coupé à mi-hauteur, la section est un disque de rayon 4 × 1/2 = 2 cm.</p>`,
      vois: secs, voisLeg: 'La section est en rouge. Pour le cône et la pyramide, elle est plus petite que la base.',
      retiens: `<p>Plan parallèle à la base d’un cône ou d’une pyramide : section = <b>réduction</b> de la base, de coefficient ${FM(R`k=\dfrac{\text{distance au sommet}}{\text{hauteur}}`)}.</p>`,
      exemple: `<p>Cône r = 4 cm, coupé à mi-hauteur : rayon <b>2 cm</b>.</p><p>Cylindre coupé parallèlement à la base : disque de rayon <b>r</b>.</p>`,
      attention: 'La section d’un cylindre parallèle à la base a le même rayon que la base ; celle d’un cône non.', astuce: { k: 'sens', t: 'Imagine que tu tranches l’objet avec un couteau : la section est la forme de la tranche.' } }];

  c.mots = [['solide', 'objet de l’espace qui a un volume', 'Le cône est un solide.'], ['perspective cavalière', 'façon de dessiner un solide sur une feuille', 'Le carton est dessiné en perspective cavalière.'], ['fuyante', 'arête dessinée vers l’arrière, inclinée et réduite', 'Les fuyantes sont parallèles.'], ['arête cachée', 'arête qu’on ne voit pas, dessinée en pointillés', 'Le pavé a trois arêtes cachées.'], ['cylindre', 'solide à deux bases en disques identiques', 'La bougie A est un cylindre.'], ['cône', 'solide à base en disque qui se termine en pointe', 'Le volume du cône est le tiers de celui du cylindre.'], ['pyramide', 'solide à base polygonale qui se termine en pointe', 'La pyramide a une base carrée.'], ['boule', 'solide plein entouré par une sphère', 'La bougie boule a un rayon de 3 cm.'], ['section plane', 'face obtenue en coupant un solide par un plan', 'La section du cylindre est un disque.']];

  /* ---------- exercices résolus ---------- */
  chk(rnd(Vco / 1000, 2) === .15 && rnd(113.1 / 216, 2) === .52, 'c8 résolus');
  c.resolus = [
    { titre: 'Le volume d’une bougie conique', outil: '🧮 calculatrice', enonce: `Une bougie conique a un rayon de ${H('4 cm')} et une hauteur de ${H('9 cm')}. Calcule son volume, convertis-le en litres, puis calcule la masse de cire (la cire pèse environ ${H('0,9 g par cm³')}).`,
      rows: [['B = π × 4² ≈ <b class="nw">50,27 cm²</b>', 'Aire du disque de base.'], ['V = 50,27 × 9 ÷ 3 ≈ <b class="nw">150,80 cm³</b>', 'Cône : aire de base × hauteur ÷ 3.'], ['150,80 cm³ ≈ <b class="nw">0,15 L</b>', '1 L = 1 000 cm³ : je divise par 1 000.'], ['m ≈ 150,80 × 0,9 ≈ <b class="nw">135,7 g</b>', 'Masse = volume × masse d’un cm³.']], verif: 'Avec π ≈ 3 : 3 × 16 × 9 ÷ 3 = 144 cm³, proche de 150,80 ✓.', rep: 'La bougie a un volume d’environ 150,80 cm³ (0,15 L) et contient environ 136 g de cire.', go: ['e1', 'e2'] },
    { titre: 'À toi : la boule dans sa boîte', outil: '🧮 calculatrice', enonce: `Une bougie boule de ${H('rayon 3 cm')} est vendue dans une boîte cubique de ${H('6 cm')} de côté. Quelle part de la boîte occupe-t-elle ?`, trous: [0, 1, 2, 3],
      rows: [['V = 4/3 × π × 3³ = ⟦36⟧ π', 'Formule du volume de la boule.'], ['V ≈ ⟦113,10⟧ cm³', 'Arrondi au centième.'], ['Boîte : 6 × 6 × 6 = ⟦216⟧ cm³', 'Volume du cube.'], ['113,10 ÷ 216 ≈ ⟦0,52⟧, soit 52 %', 'Part de la boîte occupée.']], verif: 'La boule est plus petite que la boîte : 113,10 < 216 ✓.', rep: 'La bougie occupe environ 52 % de la boîte.', go: ['e3'] }];
  c.entraine = [{ id: 'e1', gen: 'c8e1', lc: 1 }, { id: 'e2', gen: 'c8e2', lc: 2 }, { id: 'e3', gen: 'c8e3', lc: 4 }];

  /* ---------- je résous ---------- */
  chk(40 * 30 * 20 === 24000 && 24000 / 1000 === 24 && 4 * 3 * 2 === 24, 'c8 p1');
  chk(36 * 10 / 3 === 120 && rnd(PI * 9 * 10 / 3, 2) === 94.25 && rnd(120 - 94.25, 2) === 25.75 && rnd(120 * .02, 2) === 2.4, 'c8 p2');
  chk(rnd(256 * PI / 3, 2) === 268.08 && rnd(128 * PI, 2) === 402.12 && rnd(402.12 - 268.08, 2) === 134.04 && rnd(512 - 268.08, 2) === 243.92 && rnd(268.08 / 402.12, 2) === .67, 'c8 p3');
  c.probs = [
    PB({ id: 'p1', etape: 2, lc: 2, comps: ['app', 'rea'], titre: 'Le carton d’expédition', intro: `<p>Un carton d’expédition est un pavé droit de ${H('40 cm × 30 cm × 20 cm')}. On y range des boîtes cubiques de ${H('10 cm')} de côté.</p>`,
      qs: [Q('a.', 'Calcule le volume du carton en cm³.', '40 × 30 × 20 = 24 000 cm³', 24000, { w: 28 }), Q('b.', 'Convertis ce volume en litres.', '24 000 ÷ 1 000 = 24 L', 24, { w: 24 }), Q('c.', 'Combien de boîtes cubiques peut-on ranger dans le carton ?', '4 × 3 × 2 = 24 boîtes', 24, { w: 24 }), Q('d.', 'Quel est le volume d’une boîte, en litres ?', '10 × 10 × 10 = 1 000 cm³ = 1 L', 1, { w: 24 })],
      err: { 0: [{ v: 90, m: 'Le volume est un produit, pas une somme.' }], 1: [{ v: 240, m: '1 L = 1 000 cm³ : divise par 1 000.' }], 2: [{ v: 2400, m: 'Compte les boîtes dans chaque direction : 40 ÷ 10, 30 ÷ 10, 20 ÷ 10.' }] },
      hints: ['V = longueur × largeur × hauteur.', '1 L = 1 000 cm³.', 'Dans la longueur, 4 boîtes ; dans la largeur, 3 ; dans la hauteur, 2.'], pouce: 'Pour le nombre de boîtes, raisonne direction par direction : 4 × 3 × 2.', corr: 'a. 24 000 cm³. b. 24 L. c. 24 boîtes. d. 1 L.' }),
    PB({ id: 'p2', etape: 3, lc: 2, defi: 4, bulle: 'Ce cas se fait en 4 étapes. Les deux bougies se terminent en pointe : n’oublie pas de diviser par 3.', autravail: { comp: 'ana', txt: 'comparer la quantité de matière de deux produits pour fixer un prix.' }, comps: ['ana', 'rea', 'val'], titre: 'Pyramide ou cône ?',
      intro: `<p>Mia hésite entre deux bougies de ${H('10 cm')} de haut : une pyramide à base carrée de ${H('6 cm')} de côté et un cône de ${H('6 cm')} de diamètre. La cire coûte ${H('0,02 € par cm³')}.</p>`,
      qs: [Q('a.', 'Calcule le volume de la pyramide (cm³).', '6 × 6 × 10 ÷ 3 = 120 cm³', 120, { w: 24 }), Q('b.', 'Calcule le volume du cône, au centième (cm³).', 'π × 3² × 10 ÷ 3 ≈ 94,25 cm³', 94.25, { w: 24 }), Q('c.', 'Quelle est la différence de volume (cm³) ?', '120 − 94,25 = 25,75 cm³', 25.75, { w: 24 }), Q('d.', 'Calcule le coût de la cire de la pyramide.', '120 × 0,02 = 2,40 €', 2.4, { w: 24 })],
      err: { 0: [{ v: 360, m: 'La pyramide se termine en pointe : divise par 3.' }], 1: [{ v: 377, m: 'Le rayon est 3 cm (diamètre ÷ 2), pas 6 cm.' }, { v: 282.74, m: 'Le cône se termine en pointe : divise par 3.' }] },
      hints: ['Pyramide : aire du carré × hauteur ÷ 3.', 'Cône : rayon = 6 ÷ 2 = 3 cm.', 'Coût = volume × 0,02.'], pouce: 'Le diamètre du cône est 6 cm : son rayon est 3 cm.', corr: 'a. 120 cm³. b. ≈ 94,25 cm³. c. 25,75 cm³. d. 2,40 €.' }),
    PB({ id: 'p3', etape: 4, lc: 3, cls: 'bac', defi: 5, bulle: 'Voici une question de « vers le bac » : 5 étapes. Compare les volumes vides des deux boîtes avant de conclure.', autravail: { comp: 'com', txt: 'choisir un emballage qui protège le produit et limite le carton et le calage.' }, comps: ['rea', 'ana', 'com'], titre: 'Quelle boîte pour la bougie boule ?',
      intro: `<p>Une bougie boule a un rayon de ${H('4 cm')}. Deux boîtes sont possibles : un ${H('cylindre de rayon 4 cm et de hauteur 8 cm')} ou un ${H('cube de 8 cm de côté')}.</p>`,
      qs: [BQ('1', 'Calculer le volume de la bougie, au centième.', 'rea', '4/3 × π × 4³ ≈ 268,08 cm³', 268.08, { w: 26 }), BQ('2', 'Calculer le volume de la boîte cylindrique, au centième.', 'rea', 'π × 4² × 8 ≈ 402,12 cm³', 402.12, { w: 26 }), BQ('3', 'Calculer le volume vide dans la boîte cylindrique.', 'rea', '402,12 − 268,08 = 134,04 cm³', 134.04, { w: 26 }), BQ('4', 'Calculer le volume vide dans la boîte cubique.', 'ana', '512 − 268,08 = 243,92 cm³', 243.92, { w: 26 }), BQ('5', 'Justifier le choix de la boîte.', 'com', 'La boîte cylindrique : elle laisse environ 134 cm³ de vide, contre 244 cm³ pour le cube ; il faut moins de calage.', null, { lines: 3 })],
      err: { 0: [{ v: 201.06, m: 'Dans la formule, r est au cube : 4³ = 64.' }], 1: [{ v: 1608.5, m: 'Le rayon est 4 cm : π × 4² × 8.' }], 3: [{ v: 512, m: 'C’est le volume du cube. Enlève le volume de la bougie.' }] },
      hints: ['Boule : 4/3 × π × r³.', 'Cylindre : π × r² × h.', 'Volume vide = volume de la boîte − volume de la bougie.'], pouce: 'Calcule les deux volumes vides : le plus petit indique la boîte la plus ajustée.', corr: '1. ≈ 268,08 cm³. 2. ≈ 402,12 cm³. 3. ≈ 134,04 cm³. 4. ≈ 243,92 cm³. 5. La boîte cylindrique.' })];

  c.bilan = [['Je sais lire et compléter un solide en perspective cavalière.', ['e1', 'p1']], ['Je sais calculer le volume d’un prisme, d’un cylindre, d’une pyramide et d’un cône.', ['e2', 'p2']], ['Je sais calculer le volume d’une boule.', ['p3']], ['Je sais reconnaître la section d’un solide par un plan.', ['e3']]];
  c.words = require('./gl1')('c8');
  c.plusloin = { meca: [], probs: [] };
  return c;
};
