/* Chapitre 7 · Géométrie — version 3 (BO 2019, 2de pro). */
'use strict';
const K = require('../lib/kit3');
const { rnd, H, FM, M, R, adapt } = K;
const { S, T, Rc, Ln, Ar, Br, st } = require('../lib/visu');
const P = require('../lib/pics');
const V2 = require('../content2/c7.js');

module.exports = function (chk) {
  const old = V2(chk);
  const c = { id: 'c7', n: 7, col: 'geometrie', icone: '📐', dom: 'Géométrie', titre: 'Géométrie' };
  c.travail = { question: `Une épicerie fine hésite entre un ${H('coffret pavé')} et une ${H('boîte cylindrique')}. Chaque coffret doit contenir ${H('au moins 3,5 L')}. Lequel choisir, et combien en ranger par carton ? Tu sauras répondre à la fin du chapitre (sujet « vers le bac »).` };
  c.objectifs = ['Je saurai calculer une aire et un périmètre.', 'Je saurai calculer un volume et le convertir en litres.', 'Je saurai calculer une longueur avec le théorème de Pythagore.', 'Je saurai ce que deviennent les aires quand on agrandit une figure.'];
  c.depart = 'c7';

  /* ---------- méthodes visuelles ---------- */
  const miniQuad = `<svg viewBox="0 0 170 100" class="pic" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="un rectangle dans un quadrillage">${Array.from({ length: 15 }, (_, i) => `<rect x="${30 + (i % 5) * 22}" y="${14 + Math.floor(i / 5) * 22}" width="22" height="22" class="k2 ks" stroke-width="1"/>`).join('')}<rect x="30" y="14" width="110" height="66" fill="none" class="ks" stroke-width="3" stroke-dasharray="6 3"/></svg>`;
  // 1. le quadrillage : rectangle 6 × 4
  const u1 = 30, qx = 40, qy = 40;
  let grille = '';
  for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) grille += Rc(qx + i * u1, qy + j * u1, u1, u1, { c: 'k2', rx: 0, sw: 1 });
  const quad = S(600, 230, st(1, grille + T(qx + 3 * u1, qy + 4 * u1 + 22, '1 carreau = 1 cm²', { fs: 13, c: 'ts' }))
    + st(2, T(390, 70, 'aire : je compte les carreaux', { fs: 14, a: 'start' }) + T(390, 96, '6 × 4 = 24 cm²', { fs: 18, c: 'kt', a: 'start' }))
    + st(3, `<rect x="${qx}" y="${qy}" width="${6 * u1}" height="${4 * u1}" fill="none" class="ks" stroke-width="5" stroke-dasharray="10 5"/>` + T(390, 136, 'périmètre : je fais le tour', { fs: 14, a: 'start' }) + T(390, 162, '6 + 4 + 6 + 4 = 20 cm', { fs: 18, c: 'kt', a: 'start' }))
    + st(4, `<path d="M${qx} ${qy + 4 * u1} L${qx + 6 * u1} ${qy} L${qx + 6 * u1} ${qy + 4 * u1} Z" class="k" opacity=".55"/>` + T(390, 200, 'le triangle : la moitié, 12 cm²', { fs: 14, a: 'start' })), 'Un rectangle de 6 carreaux sur 4 dans un quadrillage');
  // 2. les cubes : pavé 4 × 3 × 2
  const cu = 30, dx = 15, dy = -12, px = 60, py = 110;   // profondeur oblique
  let cubes = '';
  for (let i = 0; i <= 4; i++) cubes += Ln(px + i * cu, py, px + i * cu, py + 2 * cu, { w: 1.4 }) + Ln(px + i * cu, py, px + i * cu + 3 * dx, py + 3 * dy, { w: 1.4 });
  for (let j = 0; j <= 2; j++) cubes += Ln(px, py + j * cu, px + 4 * cu, py + j * cu, { w: 1.4 }) + Ln(px + 4 * cu, py + j * cu, px + 4 * cu + 3 * dx, py + j * cu + 3 * dy, { w: 1.4 });
  for (let k = 0; k <= 3; k++) cubes += Ln(px + k * dx, py + k * dy, px + 4 * cu + k * dx, py + k * dy, { w: 1.4 }) + Ln(px + 4 * cu + k * dx, py + k * dy, px + 4 * cu + k * dx, py + 2 * cu + k * dy, { w: 1.4 });
  const faces = `<path d="M${px} ${py}h${4 * cu}v${2 * cu}h${-4 * cu}Z" class="k2"/><path d="M${px} ${py}l${3 * dx} ${3 * dy}h${4 * cu}l${-3 * dx} ${-3 * dy}Z" class="k2" opacity=".7"/><path d="M${px + 4 * cu} ${py}l${3 * dx} ${3 * dy}v${2 * cu}l${-3 * dx} ${-3 * dy}Z" class="k2" opacity=".85"/>`;
  const cube = S(600, 240, st(1, faces + cubes + T(px + 2 * cu, py + 2 * cu + 24, '1 petit cube = 1 cm³', { fs: 13, c: 'ts' }) + T(px + 2 * cu, py + 2 * cu + 44, '4 cm × 3 cm × 2 cm', { fs: 13 }))
    + st(2, T(330, 60, 'une couche : 4 × 3 = 12 cubes', { fs: 15, a: 'start' }) + T(330, 86, 'deux couches : 12 × 2 = 24 cubes', { fs: 15, a: 'start' }) + T(330, 116, 'V = 4 × 3 × 2 = 24 cm³', { fs: 18, c: 'kt', a: 'start' }))
    + st(3, Rc(330, 150, 44, 44, { c: 'k', rx: 3 }) + T(352, 177, '1 L', { fs: 13, c: 'tw' }) + T(386, 166, '1 L = 1 dm³ = 1 000 cm³', { fs: 15, a: 'start' }) + T(386, 188, 'un cube de 10 cm de côté', { fs: 12, a: 'start', c: 'ts' }))
    + st(4, T(330, 226, '24 cm³ = 0,024 L', { fs: 15, c: 'kt', a: 'start' })), 'Un pavé rempli de petits cubes de 1 cm³');
  // 3. Pythagore : les carrés sur les côtés (3, 4, 5)
  const u3 = 24, C = [150, 200], A = [150, 200 - 3 * u3], B = [150 + 4 * u3, 200];
  const sq = (p, q, n, cls) => { const v = [q[0] - p[0], q[1] - p[1]], w = [v[1], -v[0]], pt = (a, b) => [p[0] + v[0] * a / n + w[0] * b / n, p[1] + v[1] * a / n + w[1] * b / n]; let g = `<path d="M${pt(0, 0)}L${pt(n, 0)}L${pt(n, n)}L${pt(0, n)}Z" class="${cls} ks" stroke-width="2"/>`; for (let i = 1; i < n; i++) g += `<path d="M${pt(i, 0)}L${pt(i, n)}M${pt(0, i)}L${pt(n, i)}" ${cls === 'k' ? 'stroke="#fff"' : 'class="ks"'} stroke-width="${cls === 'k' ? 1.2 : .8}" fill="none"/>`; return g; };
  const pyth = S(600, 310, st(1, `<path d="M${C}L${A}L${B}Z" class="wh ks" stroke-width="3"/><path d="M${C[0]} ${C[1] - 12}h12v12" fill="none" class="ks" stroke-width="2"/>` + T(157, 175, '3', { fs: 13, a: 'start' }) + T(200, 196, '4', { fs: 13 }) + T(190, 166, '5', { fs: 13, c: 'kt' }))
    + st(2, sq(C, A, 3, 'k2') + sq(B, C, 4, 'k2') + T(114, 150, '9', { fs: 18, c: 'kt' }) + T(198, 254, '16', { fs: 18, c: 'kt' }))
    + st(3, sq(A, B, 5, 'k') + T(275, 104, '25', { fs: 20, c: 'tw' }))
    + st(4, T(460, 120, '9 + 16 = 25', { fs: 22, c: 'kt' }) + T(460, 150, '3² + 4² = 5²', { fs: 18 }) + T(460, 186, 'le grand carré = les deux petits', { fs: 13, c: 'ts' }) + T(460, 206, 'seulement si l’angle est droit', { fs: 13, c: 'ts' })), 'Les carrés construits sur les trois côtés d’un triangle rectangle');
  // 4. la photocopieuse × 2
  const u4 = 34;
  const photo = S(600, 230, st(1, Rc(40, 80, 2 * u4, u4, { c: 'k2', rx: 2 }) + T(40 + u4, 80 + u4 + 22, '2 cm × 1 cm', { fs: 12 }) + T(40 + u4, 60, 'original', { fs: 13, c: 'ts' }))
    + st(2, Rc(150, 70, 120, 56, { c: 'k2', rx: 10 }) + T(210, 104, '× 2', { fs: 22, c: 'kt' }) + Ar(118, 98, 146, 98, { w: 2.4 }) + Ar(274, 98, 302, 98, { w: 2.4 }) + T(210, 150, 'photocopie agrandie', { fs: 12, c: 'ts' }))
    + st(3, [0, 1].map(i => [0, 1].map(j => Rc(310 + i * 2 * u4, 50 + j * u4, 2 * u4, u4, { c: 'k2', rx: 0 })).join('')).join('') + T(310 + 2 * u4, 50 + 2 * u4 + 22, '4 cm × 2 cm', { fs: 12 }) + T(310 + 2 * u4, 36, 'la copie contient 4 originaux', { fs: 13, c: 'kt' }))
    + st(4, T(530, 70, 'longueurs × 2', { fs: 15 }) + T(530, 98, 'aires × 4', { fs: 15, c: 'kt' }) + T(530, 126, 'volumes × 8', { fs: 15 }) + T(300, 210, 'coefficient k : longueurs × k, aires × k², volumes × k³', { fs: 14, c: 'kt' })), 'Une photocopie agrandie deux fois contient quatre fois l’original');
  chk(6 * 4 === 24 && 2 * (6 + 4) === 20 && 4 * 3 * 2 === 24 && 9 + 16 === 25 && 2 * 2 === 4, 'c7 visuels');

  c.notions = [
    { titre: 'Aires et périmètres', decouvre: { txt: `Une vitrine mesure ${H('3,2 m sur 1,5 m')}. Faut-il acheter de la moquette pour le sol, ou une guirlande pour le tour ?`, img: miniQuad },
      comprends: `<p>Le <b>périmètre</b> est la longueur du tour d’une figure. Il se mesure en m ou en cm : c’est ce qu’il faut pour une guirlande ou une bordure.</p><p>L’<b>aire</b> est la surface à l’intérieur. Elle se mesure en m² ou en cm² : c’est ce qu’il faut pour une moquette ou un adhésif.</p><p>1 cm², c’est un carré de 1 cm de côté. Pour un rectangle, on compte les carreaux d’une ligne, puis on multiplie par le nombre de lignes.</p><p>Un triangle rectangle est la moitié d’un rectangle. Un disque se calcule avec π.</p>`,
      vois: quad, voisLeg: 'L’aire compte les carreaux à l’intérieur. Le périmètre suit le bord en pointillés.',
      retiens: `<p>Rectangle : ${FM(R`\mathcal{A}=L\times \ell`)} · ${FM(R`\mathcal{P}=2\times(L+\ell)`)}</p><p>Triangle : ${FM(R`\mathcal{A}=\dfrac{b\times h}{2}`)} · Disque : ${FM(R`\mathcal{A}=\pi r^2`)} · Cercle : ${FM(R`\mathcal{P}=2\pi r`)}</p>`,
      exemple: `<p>Vitrine de 3,2 m sur 1,5 m : aire = 3,2 × 1,5 = <b>4,8 m²</b>.</p><p>Périmètre = 2 × (3,2 + 1,5) = <b>9,4 m</b>.</p>`,
      attention: 'Une aire s’écrit en m² ou cm², un périmètre en m ou cm. Vérifie l’unité.', astuce: { k: 'sens', t: 'Moquette, peinture, adhésif : aire. Guirlande, bordure, ruban : périmètre.' } },
    { titre: 'Volumes et contenances', decouvre: { txt: `Une boîte mesure ${H('20 cm × 20 cm × 10 cm')}. Contient-elle ${H('3,5 L')} de produits ?`, img: P.volume() },
      comprends: `<p>Le <b>volume</b> mesure la place occupée dans l’espace. On compte combien de petits cubes de 1 cm de côté tiennent dans la boîte : ce sont des cm³.</p><p>Dans un pavé, on compte une couche (longueur × largeur), puis on multiplie par le nombre de couches (la hauteur).</p><p>Pour un cylindre, c’est la même idée : l’aire du disque du fond, multipliée par la hauteur.</p><p>La <b>contenance</b> se dit en litres. Un litre, c’est un cube de 10 cm de côté : 1 L = 1 dm³ = 1 000 cm³.</p>`,
      vois: cube, voisLeg: 'On remplit le pavé couche par couche. Chaque petit cube vaut 1 cm³.',
      retiens: `<p>Pavé : ${FM(R`V=L\times\ell\times h`)} · Cylindre : ${FM(R`V=\pi r^2\times h`)}</p><p>${FM(R`1\ \text{L}=1\ \text{dm}^3=1\,000\ \text{cm}^3`)}</p>`,
      exemple: `<p>20 × 20 × 10 = 4 000 cm³ = <b>4 L</b> : oui, plus que 3,5 L.</p><p>Cylindre r = 10 cm, h = 12 cm : π × 10² × 12 ≈ 3 770 cm³ ≈ <b>3,77 L</b>.</p>`,
      attention: 'Pour passer des cm³ aux litres, on divise par 1 000, pas par 100.', astuce: { k: 'vite', t: 'Casio collège : la touche π et la touche x² évitent les erreurs d’arrondi.' } },
    { titre: 'Le théorème de Pythagore', decouvre: { txt: `Une rampe d’accès part à ${H('6 m')} d’une marche de ${H('0,5 m')}. Quelle est la longueur de la rampe ?`, img: P.pythagore() },
      comprends: `<p>Dans un triangle rectangle, le plus grand côté est en face de l’angle droit. On l’appelle l’<b>hypoténuse</b>.</p><p>Construis un carré sur chaque côté. Le théorème de Pythagore dit : l’aire du grand carré est égale à la somme des aires des deux petits.</p><p>On s’en sert pour calculer une longueur. Pour l’hypoténuse, on additionne les carrés des deux autres côtés, puis on prend la <b>racine carrée</b>.</p><p>Il marche aussi à l’envers. Si l’égalité est vraie, le triangle est rectangle : c’est la <b>réciproque</b>. On vérifie ainsi qu’une étagère est d’équerre.</p>`,
      vois: pyth, voisLeg: 'Les carrés construits sur les côtés 3 et 4 contiennent 9 et 16 carreaux. Le carré sur l’hypoténuse en contient 25.',
      retiens: `<p>Triangle ABC rectangle en C : ${FM(R`AB^2=AC^2+BC^2`)}</p><p>Hypoténuse : ${FM(R`AB=\sqrt{AC^2+BC^2}`)}</p>`,
      exemple: `<p>Côtés 6 m et 0,5 m : ${M(R`\sqrt{6^2+0{,}5^2}=\sqrt{36{,}25}`)} ≈ <b>6,02 m</b>.</p><p>Côtés 60, 80, 100 cm : 60² + 80² = 10 000 = 100² : l’angle est droit.</p>`,
      attention: '√(6² + 0,5²) n’est pas 6 + 0,5. On ne peut pas « simplifier » la racine.', astuce: { k: 'verif', t: 'L’hypoténuse est toujours le plus grand côté, mais plus petite que la somme des deux autres.' } },
    { titre: 'Agrandir et réduire', decouvre: { txt: `Une maquette de stand est ${H('20 fois plus petite')} que le vrai stand. Son sol est-il ${H('20 fois plus petit')} ?`, img: P.agrandir() },
      comprends: `<p>Agrandir une figure, c’est multiplier toutes ses longueurs par un même nombre k. Si k > 1, c’est un agrandissement. Si k < 1, c’est une réduction.</p><p>Les longueurs sont multipliées par k. Mais les aires sont multipliées par k² : la longueur et la largeur ont toutes les deux grandi.</p><p>Les volumes, eux, sont multipliés par k³ : longueur, largeur et hauteur ont grandi.</p><p>Une maquette au 1/20 a des longueurs 20 fois plus petites. Son sol est 20² = 400 fois plus petit.</p><p>Au travail, on s’en sert pour lire un plan ou une maquette de vitrine.</p>`,
      vois: photo, voisLeg: 'La photocopie agrandie deux fois contient exactement quatre fois l’original : longueur × 2 et largeur × 2.',
      retiens: `<p>Coefficient k : longueurs ${FM(R`\times k`)} · aires ${FM(R`\times k^2`)} · volumes ${FM(R`\times k^3`)}</p>`,
      exemple: `<p>Maquette 15 cm × 10 cm au 1/20 : vrai stand 3 m × 2 m.</p><p>Aire : 150 cm² × 20² = 60 000 cm² = <b>6 m²</b>.</p>`,
      attention: 'Une maquette 20 fois plus petite n’a pas une aire 20 fois plus petite, mais 400 fois.', astuce: { k: 'og', t: 'Dessine le petit rectangle dans le grand : tu vois combien de fois il y entre.' } }];
  chk(rnd(3.2 * 1.5) === 4.8 && rnd(2 * (3.2 + 1.5)) === 9.4 && 20 * 20 * 10 === 4000 && rnd(Math.PI * 100 * 12 / 1000) === 3.77 && rnd(Math.sqrt(36.25)) === 6.02 && 60 * 60 + 80 * 80 === 100 * 100 && 150 * 400 === 60000, 'c7 notions');

  c.mots = [['périmètre', 'longueur du tour d’une figure (m, cm)', 'La guirlande fait le tour : 9,4 m.'], ['aire', 'surface intérieure (m², cm²)', 'Il faut 4,8 m² de moquette.'], ['volume', 'place occupée dans l’espace (cm³, m³)', 'Le coffret fait 4 000 cm³.'], ['contenance', 'volume de liquide, en litres', '1 L = 1 000 cm³.'], ['hypoténuse', 'côté opposé à l’angle droit, le plus grand', 'La rampe est l’hypoténuse.'], ['racine carrée', 'nombre qui, au carré, donne le nombre de départ', '√25 = 5.'], ['échelle', 'rapport entre maquette et réalité', 'Maquette au 1/20.']];

  /* ---------- exercices résolus ---------- */
  chk(rnd(Math.sqrt(1.2 ** 2 + .5 ** 2)) === 1.3 && rnd(1.2 ** 2 + .5 ** 2) === 1.69 && rnd(Math.sqrt(1.6 ** 2 + 1.2 ** 2)) === 2 && rnd(1.6 ** 2 + 1.2 ** 2) === 4, 'c7 résolus');
  c.resolus = [
    { titre: 'Calculer l’hypoténuse', outil: '🧮 calculatrice', enonce: `Un présentoir a un montant de ${H('1,2 m')} et une base de ${H('0,5 m')}, à angle droit. Calcule la longueur du renfort qui relie leurs extrémités.`,
      rows: [['Le renfort est l’hypoténuse', 'Il est en face de l’angle droit.'], ['renfort² = 1,2² + 0,5²', 'J’écris l’égalité de Pythagore.'], ['renfort² = 1,44 + 0,25 = 1,69', 'Je calcule les carrés, puis la somme.'], ['renfort = √1,69 = <b class="nw">1,3 m</b>', 'Je prends la racine carrée.']], verif: '1,3 m est plus grand que 1,2 m et plus petit que 1,2 + 0,5 = 1,7 m ✓.', rep: 'Le renfort mesure 1,3 m.', go: ['e3'] },
    { titre: 'À toi : la même méthode', outil: '🧮 calculatrice', enonce: `Un panneau a une hauteur de ${H('1,2 m')} et une largeur de ${H('1,6 m')}. Calcule la longueur de sa diagonale.`, trous: [1, 2, 3],
      rows: [['La diagonale est l’hypoténuse', 'Elle est en face de l’angle droit.'], ['diagonale² = ⟦1,6² + 1,2²⟧', 'J’écris l’égalité de Pythagore.'], ['diagonale² = 2,56 + 1,44 = ⟦4⟧', 'Je calcule les carrés, puis la somme.'], ['diagonale = √4 = ⟦2 m⟧', 'Je prends la racine carrée.']], verif: '2 m est plus grand que 1,6 m et plus petit que 1,6 + 1,2 = 2,8 m ✓.', rep: 'La diagonale mesure 2 m.', go: ['e3'] }];
  c.entraine = [{ id: 'e1', gen: 'c7e1', lc: 1 }, { id: 'e2', gen: 'c7e2', lc: 2 }, { id: 'e3', gen: 'c7e3', lc: 3 }];

  /* ---------- je résous ---------- */
  const pick = id => old.probs.find(p => p.id === id);
  c.probs = [
    adapt(pick('p1'), { etape: 2, hints: ['La rampe, le sol et la marche forment un triangle rectangle.', 'Notion 3 : la rampe est l’hypoténuse.', 'rampe² = 6² + 0,5².'], err: { 0: [{ v: 6.5, m: 'On n’additionne pas les longueurs : additionne leurs carrés, puis prends la racine.' }, { v: 36.25, m: 'Tu as trouvé rampe². Il reste à prendre la racine carrée.' }, { v: 5.98, m: 'La rampe est l’hypoténuse : on additionne les carrés, on ne les soustrait pas.' }] } }),
    adapt(pick('c1'), { etape: 3, defi: 3, bulle: 'Ce cas se fait en 3 étapes. Pense à la photocopieuse de la notion 4 : les longueurs et les aires ne changent pas de la même façon.', autravail: { comp: 'rea', txt: 'présenter un projet de stand ou de vitrine au client avec une maquette à l’échelle.' }, hints: ['Au 1/20 : chaque longueur réelle est 20 fois plus grande.', '15 × 20 = 300 cm = 3 m.', 'Aire réelle = aire de la maquette × 20².'], err: { 0: [{ v: .75, m: 'La maquette est plus petite que le stand : multiplie par 20, ne divise pas.' }, { v: 300, m: 'C’est la longueur en cm. Convertis en m : ÷ 100.' }], 1: [{ v: .3, m: 'Les aires sont multipliées par 20² = 400, pas par 20.' }] } }),
    adapt(pick('b1'), { etape: 4, defi: 5, bulle: 'Voici la question du début du chapitre ! Elle se fait en 5 étapes. Les volumes se calculent comme dans la notion 2. Une question ratée ne fait pas un exercice raté : continue.', autravail: { comp: 'com', txt: 'choisir un emballage qui protège le produit et qui se range bien pour l’expédition.' }, hints: ['Pavé : 20 × 20 × 10 cm³, puis ÷ 1 000 pour les litres.', 'Cylindre : π × 10² × 12.', 'Carton : combien de coffrets en longueur, en largeur, en hauteur ?'], err: { 0: [{ v: 4000, m: 'C’est le volume en cm³. Divise par 1 000 pour l’avoir en litres.' }], 1: [{ v: .38, m: 'Le rayon est au carré : π × 10² × 12.' }, { v: 37.7, m: 'Pour passer des cm³ aux litres, on divise par 1 000.' }] } })];

  c.bilan = [['Je sais calculer une aire et un périmètre.', ['e1']], ['Je sais calculer un volume en litres.', ['e2', 'b1']], ['Je sais utiliser le théorème de Pythagore.', ['e3', 'p1']], ['Je sais utiliser une échelle.', ['c1']]];
  c.words = old.words;
  c.plusloin = { meca: old.meca, probs: old.probs.filter(p => !['p1', 'c1', 'b1'].includes(p.id)) };
  return c;
};
