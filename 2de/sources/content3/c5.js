/* Chapitre 5 · Fonctions — version 3 (BO 2019, 2de pro). Outils : Casio collège, GeoGebra, Excel. */
'use strict';
const K = require('../lib/kit3');
const { rnd, H, FM, M, R, adapt } = K;
const { S, T, Rc, Ln, Ar, Br, st } = require('../lib/visu');
const P = require('../lib/pics');
const V2 = require('../content2/c5.js');

module.exports = function (chk) {
  const old = V2(chk);
  const c = { id: 'c5', n: 5, col: 'fonction', icone: '📈', dom: 'Algèbre – Analyse', titre: 'Fonctions' };
  c.travail = { question: `Un food truck vend ses sandwichs ${H('6 €')}. Chaque jour, il dépense ${H('140 €')} plus ${H('2,50 € par sandwich')}. À partir de combien de sandwichs gagne-t-il de l’argent ? Tu sauras répondre à la fin du chapitre (sujet « vers le bac »).` };
  c.objectifs = ['Je saurai calculer une image et retrouver un antécédent.', 'Je saurai construire un tableau de valeurs et tracer la courbe.', 'Je saurai lire le coefficient directeur et l’ordonnée à l’origine d’une droite.', 'Je saurai reconnaître la fonction carré et lire un sens de variation.'];
  c.depart = 'c5';

  /* ---------- méthodes visuelles ---------- */
  // repère générique
  const rep = (ox, oy, sx, sy, xm, ym, stepx, stepy, labx, laby) => {
    let s = '';
    for (let x = 0; x <= xm; x += stepx) s += Ln(ox + x * sx, oy, ox + x * sx, oy - ym * sy, { w: .6, c: 'grid', stroke: '#D5DAEC' }) + T(ox + x * sx, oy + 16, String(x).replace('.', ','), { fs: 11, w: 400 });
    for (let y = 0; y <= ym; y += stepy) s += Ln(ox, oy - y * sy, ox + xm * sx, oy - y * sy, { w: .6, c: 'grid', stroke: '#D5DAEC' }) + (y ? T(ox - 6, oy - y * sy + 4, String(y).replace('.', ','), { fs: 11, a: 'end', w: 400 }) : '');
    return s + Ar(ox, oy, ox + xm * sx + 14, oy, { w: 1.6, h: 8, c: 'ks', f: 'k' }) + Ar(ox, oy, ox, oy - ym * sy - 14, { w: 1.6, h: 8 }) + T(ox + xm * sx + 12, oy - 8, labx, { fs: 12, a: 'end', c: 'ts' }) + T(ox + 6, oy - ym * sy - 12, laby, { fs: 12, a: 'start', c: 'ts' });
  };
  // 1. la machine à transformer : f(x) = 0,5x + 5 (livraison)
  const machine = S(600, 240, st(1, Rc(200, 40, 200, 90, { c: 'k2', rx: 14 }) + T(300, 76, 'machine f', { fs: 16, c: 'kt' }) + T(300, 104, '× 0,5   puis   + 5', { fs: 17 }) + `<circle cx="230" cy="138" r="9" class="k"/><circle cx="370" cy="138" r="9" class="k"/>`)
    + st(2, Rc(30, 62, 110, 46, { c: 'k2' }) + T(85, 92, 'x = 12', { fs: 17 }) + T(85, 52, 'entrée : km', { fs: 12, c: 'ts' }) + Ar(142, 85, 196, 85, { w: 3 }))
    + st(3, Ar(404, 85, 456, 85, { w: 3 }) + Rc(460, 62, 120, 46, { c: 'k', s: false }) + T(520, 92, 'f(12) = 11', { fs: 17, c: 'tw' }) + T(520, 52, 'sortie : €', { fs: 12, c: 'ts' }) + T(300, 178, '12 × 0,5 + 5 = 11 : l’image de 12 est 11', { fs: 15, c: 'kt' }))
    + st(4, T(300, 212, 'À l’envers : f(x) = 9,50 €  →  − 5 puis ÷ 0,5  →  x = 9 km', { fs: 15 }) + T(300, 234, '9 est un antécédent de 9,50', { fs: 13, c: 'ts' })), 'La machine à transformer : un nombre entre, son image sort');
  // 2. tableau → points → droite
  const TV = [0, 2, 4, 6, 8, 10], f1 = x => .5 * x + 5;
  const ox2 = 330, oy2 = 210, sx2 = 22, sy2 = 16;
  const tabl = `<g>${TV.map((x, i) => Rc(30 + i * 44, 60, 44, 32, { c: 'k2', rx: 0, sw: 1.2 }) + T(52 + i * 44, 82, x, { fs: 14 }) + Rc(30 + i * 44, 92, 44, 32, { c: 'k2', rx: 0, sw: 1.2 }) + T(52 + i * 44, 114, String(f1(x)).replace('.', ','), { fs: 14 })).join('')}</g>` + T(20, 82, 'x', { fs: 14, a: 'end', c: 'kt' }) + T(20, 114, 'f(x)', { fs: 13, a: 'end', c: 'kt' });
  const pts = TV.map(x => `<circle cx="${ox2 + x * sx2}" cy="${oy2 - f1(x) * sy2}" r="5" class="k"/>`).join('');
  const tabVis = S(600, 250, st(1, tabl + T(160, 40, 'f(x) = 0,5x + 5', { fs: 16, c: 'kt' }) + T(160, 150, '1. je calcule les images', { fs: 13, c: 'ts' }))
    + st(2, rep(ox2, oy2, sx2, sy2, 10, 11, 2, 2, 'km', '€') + pts + T(160, 176, '2. je place les points (x ; f(x))', { fs: 13, c: 'ts' }))
    + st(3, `<line x1="${ox2}" y1="${oy2 - 5 * sy2}" x2="${ox2 + 10 * sx2}" y2="${oy2 - 10 * sy2}" class="ks" stroke-width="3"/>` + T(160, 202, '3. je relie : c’est une droite', { fs: 13, c: 'ts' }))
    + st(4, T(160, 236, 'GeoGebra : je tape f(x) = 0.5x + 5', { fs: 13, c: 'kt' })), 'Du tableau de valeurs aux points, puis à la droite');
  // 3. l’escalier de la pente : f(x) = 2x + 1
  const ox3 = 60, oy3 = 225, sx3 = 50, sy3 = 19, f3 = x => 2 * x + 1, X3 = x => ox3 + x * sx3, Y3 = y => oy3 - y * sy3;
  let esc = '';
  for (let x = 0; x < 4; x++) esc += Ln(X3(x), Y3(f3(x)), X3(x + 1), Y3(f3(x)), { w: 3, dash: '5 3' }) + Ln(X3(x + 1), Y3(f3(x)), X3(x + 1), Y3(f3(x + 1)), { w: 3.4 }) + T(X3(x) + 25, Y3(f3(x)) - 5, '+1', { fs: 11, c: 'ts' }) + T(X3(x + 1) + 6, Y3(f3(x) + 1) + 5, '+2', { fs: 13, c: 'kt', a: 'start' });
  const pente = S(600, 250, st(1, rep(ox3, oy3, sx3, sy3, 4, 10, 1, 2, 'x', 'y') + `<line x1="${X3(0)}" y1="${Y3(1)}" x2="${X3(4.4)}" y2="${Y3(f3(4.4))}" class="ks" stroke-width="2.4" opacity=".45"/>` + T(440, 40, 'f(x) = 2x + 1', { fs: 18 }))
    + st(2, `<circle cx="${X3(0)}" cy="${Y3(1)}" r="7" class="k"/>` + T(X3(0) - 12, Y3(1) + 5, 'b', { fs: 14, c: 'kt', a: 'end' }) + T(440, 76, 'b = 1 : la droite coupe', { fs: 14, c: 'kt' }) + T(440, 94, 'l’axe vertical en 1', { fs: 14, c: 'kt' }))
    + st(3, esc + T(440, 128, '+1 en x  →  +2 en y', { fs: 17, c: 'kt' }) + T(440, 150, 'coefficient directeur a = 2', { fs: 14 }))
    + st(4, T(440, 184, 'a > 0 : la droite monte', { fs: 14 }) + T(440, 204, 'a < 0 : elle descend', { fs: 14 }) + T(440, 226, 'b = 0 : proportionnalité', { fs: 13, c: 'ts' })), 'L’escalier de la pente : un pas à droite, a pas vers le haut');
  // 4. la fonction carré : côté × 2 → aire × 4
  const car = S(600, 250, st(1, [1, 2, 3].map((k, i) => { const x = [30, 100, 190][i], u = 26; let g = ''; for (let a = 0; a < k; a++) for (let b = 0; b < k; b++) g += Rc(x + a * u, 150 - (b + 1) * u, u - 2, u - 2, { c: 'k2', rx: 2, sw: 1.2 }); return g + T(x + k * u / 2, 170, `côté ${k}`, { fs: 12 }) + T(x + k * u / 2, 186, `aire ${k * k}`, { fs: 12, c: 'kt' }); }).join('') + T(150, 30, 'des carrés de côté x', { fs: 13, c: 'ts' }))
    + st(2, T(150, 214, 'côté × 2  →  aire × 4', { fs: 16, c: 'kt' }) + T(150, 236, 'ce n’est pas proportionnel', { fs: 13, c: 'ts' }))
    + st(3, rep(340, 210, 60, 4.4, 4, 40, 1, 10, 'x', 'x²') + `<path d="${Array.from({ length: 41 }, (_, i) => { const x = i / 10; return (i ? 'L' : 'M') + (340 + x * 60).toFixed(1) + ' ' + (210 - Math.min(x * x, 40) * 4.4).toFixed(1); }).join('')}" class="ks" stroke-width="3" fill="none"/>` + [1, 2, 3].map(x => `<circle cx="${340 + x * 60}" cy="${210 - x * x * 4.4}" r="5" class="k"/>`).join(''))
    + st(4, T(470, 60, 'une courbe :', { fs: 14, a: 'end' }) + T(470, 80, 'la parabole', { fs: 14, a: 'end', c: 'kt' })), 'La fonction carré : l’aire d’un carré quand son côté grandit');
  chk(f1(12) === 11 && (9.5 - 5) / .5 === 9 && f1(10) === 10 && f3(4) === 9 && f3(1) - f3(0) === 2, 'c5 visuels');

  c.notions = [
    { titre: 'Image et antécédent', decouvre: { txt: `Un fleuriste livre pour ${H('5 € plus 0,50 € par km')}. Combien coûte une livraison à ${H('12 km')} ? Et quelle distance pour ${H('9,50 €')} ?`, img: P.image() },
      comprends: `<p>Une <b>fonction</b> est comme une machine. On y fait entrer un nombre x. Elle fait toujours les mêmes calculs. Il en sort un seul nombre, noté f(x).</p><p>Le nombre qui sort s’appelle l’<b>image</b> de x. Pour la livraison, f(x) = 0,5x + 5 : l’image de 12 est 11. Une livraison à 12 km coûte 11 €.</p><p>Parfois, on connaît la sortie et on cherche l’entrée. C’est un <b>antécédent</b>. On fait marcher la machine à l’envers, ou on résout une équation, comme au chapitre 3.</p><p>Image : je calcule. Antécédent : je résous.</p>`,
      vois: machine, voisLeg: 'Le nombre x entre à gauche. La machine fait ses calculs. L’image f(x) sort à droite. Pour l’antécédent, on remonte la machine.',
      retiens: `<p>${FM(R`x\ \longmapsto\ f(x)`)} : x a pour <b>image</b> f(x) ; x est un <b>antécédent</b> de f(x).</p><p>Image : je remplace x. Antécédent : je résous ${FM(R`f(x)=k`)}.</p>`,
      exemple: `<p>f(x) = 0,5x + 5. Image de 12 : 0,5 × 12 + 5 = <b>11</b>.</p><p>Antécédent de 9,5 : 0,5x + 5 = 9,5 → 0,5x = 4,5 → x = <b>9</b>.</p>`,
      attention: 'f(12) ne veut pas dire « f × 12 ». C’est l’image de 12 par f.', astuce: { k: 'vite', t: 'Casio collège : tape 0,5 × 12 + 5, puis change seulement le 12 pour d’autres images.' } },
    { titre: 'Tableau de valeurs et courbe', decouvre: { txt: `Le fleuriste veut afficher ses tarifs de ${H('0 à 10 km')}. Comment les montrer d’un seul coup d’œil ?`, img: P.affine() },
      comprends: `<p>Pour voir une fonction, on la <b>représente</b> dans un repère. On procède en trois étapes.</p><p><b>1.</b> Je fais un <b>tableau de valeurs</b> : je choisis des x, je calcule leurs images.</p><p><b>2.</b> Chaque colonne du tableau donne un point de coordonnées (x ; f(x)). Je place les points.</p><p><b>3.</b> Je relie les points. L’ensemble de ces points s’appelle la <b>courbe</b> de f.</p><p>Ensuite, on lit la courbe dans les deux sens. Une image se lit sur l’axe vertical. Un antécédent se lit sur l’axe horizontal.</p><p>GeoGebra trace la courbe tout seul : il suffit de taper la formule.</p>`,
      vois: tabVis, voisLeg: 'Chaque colonne du tableau devient un point. Ici, les points sont alignés : la courbe est une droite.',
      retiens: `<p>Le point ${FM(R`(x\,;\,f(x))`)} est sur la courbe de f.</p><p>Lire une image : je pars de l’axe des x, je monte jusqu’à la courbe, je lis sur l’axe des y. Lire un antécédent : je fais le chemin inverse.</p>`,
      exemple: `<p>Pour x = 4 : f(4) = 0,5 × 4 + 5 = 7. Le point (4 ; 7) est sur la droite.</p><p>Sur le graphique, la droite passe à 8 € pour x = 6 : <b>f(6) = 8</b>.</p>`,
      attention: 'Dans un point (x ; y), x vient toujours en premier : (4 ; 7) n’est pas (7 ; 4).', astuce: { k: 'verif', t: 'Si un point « dépasse » des autres, recalcule son image : c’est souvent une erreur de calcul.' } },
    { titre: 'Fonction affine : la pente', decouvre: { txt: `Une droite monte de ${H('2 carreaux')} chaque fois qu’on avance d’${H('1 carreau')}. Quel nombre décrit cette pente ?`, img: P.affine() },
      comprends: `<p>Une fonction <b>affine</b> s’écrit f(x) = ax + b. Sa courbe est toujours une droite.</p><p>Le nombre <b>b</b> est l’<b>ordonnée à l’origine</b> : la droite coupe l’axe vertical à la hauteur b. Pour la livraison, b = 5 : ce sont les frais fixes.</p><p>Le nombre <b>a</b> est le <b>coefficient directeur</b>. Quand x augmente de 1, f(x) augmente de a. C’est la pente de la droite. Pour la livraison, a = 0,5 : chaque km coûte 0,50 €.</p><p>Si a > 0, la droite monte : f est <b>croissante</b>. Si a < 0, elle descend : f est <b>décroissante</b>.</p><p>Quand b = 0, f(x) = ax est une fonction <b>linéaire</b> : c’est une situation de proportionnalité.</p>`,
      vois: pente, voisLeg: 'Un pas vers la droite, a pas vers le haut : c’est l’escalier de la pente. Le premier point est sur l’axe vertical, à la hauteur b.',
      retiens: `<p>${FM(R`f(x)=ax+b`)} · a : coefficient directeur · b : ordonnée à l’origine</p><p>${FM(R`a=\dfrac{\text{variation de }y}{\text{variation de }x}`)}</p>`,
      exemple: `<p>f(x) = 2x + 1 : la droite coupe l’axe en <b>1</b> et monte de <b>2</b> à chaque pas.</p><p>La droite passe par (0 ; 5) et (10 ; 10) : a = (10 − 5) ÷ (10 − 0) = <b>0,5</b>.</p>`,
      attention: 'Dans f(x) = 5 + 0,5x, le coefficient directeur est 0,5 : c’est le nombre devant x, où qu’il soit écrit.', astuce: { k: 'sens', t: 'Au travail, a est souvent un prix unitaire et b un forfait (frais fixes).' } },
    { titre: 'La fonction carré, le sens de variation', decouvre: { txt: `Un tapis carré coûte selon son aire. Si son côté ${H('double')}, son prix double-t-il ?`, img: P.parabole() },
      comprends: `<p>La <b>fonction carré</b> associe à x le nombre x² = x × x. C’est l’aire d’un carré de côté x.</p><p>Elle n’est pas affine. Quand le côté double, l’aire est multipliée par 4. Sa courbe n’est pas une droite : c’est une <b>parabole</b>.</p><p>Pour les nombres positifs, la parabole monte : la fonction carré est croissante.</p><p>Plus généralement, on lit le <b>sens de variation</b> sur une courbe, de gauche à droite. Si la courbe monte, la fonction est croissante. Si elle descend, elle est décroissante.</p><p>Le plus haut point s’appelle le <b>maximum</b>. Le plus bas, le <b>minimum</b>.</p>`,
      vois: car, voisLeg: 'Les carrés de côté 1, 2 et 3 ont des aires 1, 4 et 9. Les points ne sont pas alignés : la courbe se relève de plus en plus vite.',
      retiens: `<p>${FM(R`f(x)=x^2`)} · ${FM(R`f(x)=kx^2`)} : la courbe est une parabole.</p><p>Côté × 2 : ${FM(R`(2x)^2=4x^2`)}, l’aire est multipliée par 4.</p>`,
      exemple: `<p>Tapis à 25 € le m² : un tapis de 1,6 m de côté coûte 25 × 1,6² = <b>64 €</b>.</p><p>Un tapis de 3,2 m coûte 25 × 3,2² = <b>256 €</b> : quatre fois plus.</p>`,
      attention: '1,6² n’est pas 1,6 × 2. C’est 1,6 × 1,6 = 2,56.', astuce: { k: 'vite', t: 'Casio collège : la touche x² calcule le carré directement.' } }];
  chk(rnd(25 * 1.6 * 1.6) === 64 && rnd(25 * 3.2 * 3.2) === 256 && rnd(1.6 * 1.6) === 2.56 && (10 - 5) / 10 === .5, 'c5 notions');

  c.mots = [['fonction', 'machine qui associe à chaque x un seul nombre f(x)', 'f(x) = prix d’une livraison de x km.'], ['image', 'nombre qui sort : f(x)', 'L’image de 12 est 11.'], ['antécédent', 'nombre qui entre, quand on connaît la sortie', '9 km est un antécédent de 9,50 €.'], ['courbe', 'tous les points (x ; f(x))', 'GeoGebra trace la courbe.'], ['fonction affine', 'f(x) = ax + b, sa courbe est une droite', 'Un forfait plus un prix au km.'], ['coefficient directeur', 'a : ce que gagne f(x) quand x augmente de 1', '0,50 € par km.'], ['croissante', 'la courbe monte de gauche à droite', 'Plus on roule, plus on paie.']];

  /* ---------- exercices résolus ---------- */
  chk(2 * 4 + 3 === 11 && (15 - 3) / 2 === 6 && 1.5 * 6 + 4 === 13 && (10 - 4) / 1.5 === 4, 'c5 résolus');
  c.resolus = [
    { titre: 'Image et antécédent', outil: '🧮 calculatrice', enonce: `Un loueur de vélos facture ${H('3 €')} plus ${H('2 € par heure')} : f(x) = 2x + 3. Calcule le prix pour ${H('4 h')}, puis la durée pour ${H('15 €')}.`,
      rows: [['f(4) = 2 × 4 + 3 = <b class="nw">11</b>', 'Image : je remplace x par 4.'], ['2x + 3 = 15', 'Antécédent : je cherche x tel que f(x) = 15.'], ['2x = 12', '− 3 des deux côtés.'], ['x = <b class="nw">6</b>', '÷ 2 des deux côtés.']], verif: 'f(6) = 2 × 6 + 3 = 15 ✓.', rep: '4 h coûtent 11 € ; avec 15 €, on loue 6 h.', go: ['e1'] },
    { titre: 'À toi : la même méthode', outil: '🧮 calculatrice', enonce: `Un parking coûte ${H('4 €')} plus ${H('1,50 € par heure')} : f(x) = 1,5x + 4. Calcule le prix pour ${H('6 h')}, puis la durée pour ${H('10 €')}.`, trous: [0, 1, 2, 3],
      rows: [['f(6) = 1,5 × 6 + 4 = ⟦13⟧', 'Image : je remplace x par 6.'], ['⟦1,5x + 4 = 10⟧', 'Antécédent : je cherche x tel que f(x) = 10.'], ['1,5x = ⟦6⟧', '− 4 des deux côtés.'], ['x = ⟦4⟧', '÷ 1,5 des deux côtés.']], verif: 'f(4) = 1,5 × 4 + 4 = 10 ✓.', rep: '6 h coûtent 13 € ; avec 10 €, on stationne 4 h.', go: ['e1'] }];
  c.entraine = [{ id: 'e1', gen: 'c5e1', lc: 1 }, { id: 'e2', gen: 'c5e2', lc: 2 }, { id: 'e3', gen: 'c5e3', lc: 3 }];

  /* ---------- je résous ---------- */
  const pick = id => old.probs.find(p => p.id === id);
  c.probs = [
    adapt(pick('p1'), { etape: 2, hints: ['Le forfait est b, le prix par km est a.', 'Notion 1 : image = je calcule ; antécédent = je résous.', 'c. 0,5x + 5 = 9,5.'], err: { 1: [{ v: 6, m: 'Tu as oublié les 5 € fixes : ajoute-les.' }, { v: 60.5, m: 'C’est 0,50 € par km : 0,5 × 12, pas 5 × 12.' }], 2: [{ v: 9.75, m: 'Tu as calculé l’image de 9,50. Ici, on connaît le prix : résous 0,5x + 5 = 9,5.' }] } }),
    adapt(pick('c1'), { etape: 3, defi: 4, bulle: 'Ce cas se fait en 4 étapes. Le graphique donne presque tout : cherche le point où les deux droites se croisent.', autravail: { comp: 'ana', txt: 'choisir le transporteur le moins cher selon le poids du colis, pour chaque commande.' }, hints: ['Lis l’abscisse du point d’intersection des deux droites.', '0,8x = 12 + 0,3x : retire 0,3x des deux côtés.', '30 kg : Express = 0,8 × 30 ; Éco = 12 + 0,3 × 30.'], err: { 2: [{ v: 21, m: 'C’est le prix Éco. La case attend d’abord le prix Express : 0,8 × 30.' }] } }),
    adapt(pick('b1'), { etape: 4, defi: 5, bulle: 'Voici la question du début du chapitre ! Elle se fait en 5 étapes. La recette et le coût sont deux fonctions affines : la notion 3 t’aide à les écrire. Une question ratée ne fait pas un exercice raté : continue.', autravail: { comp: 'com', txt: 'savoir à partir de quand une activité devient rentable, et l’expliquer au gérant.' }, hints: ['Recette : 6 € par sandwich. Coût : 140 € plus 2,50 € par sandwich.', 'Sur le graphique, cherche où les deux droites se croisent.', 'Bénéfice = recette − coût.'], err: { 3: [{ v: 360, m: 'C’est la recette. Le bénéfice, c’est la recette moins le coût.' }, { v: 290, m: 'C’est le coût. Le bénéfice, c’est la recette moins le coût.' }] } })];

  c.bilan = [['Je sais calculer une image et un antécédent.', ['e1', 'p1']], ['Je sais faire un tableau de valeurs et tracer la droite.', ['e2']], ['Je sais lire un graphique.', ['e3', 'c1']], ['Je sais comparer deux tarifs avec des fonctions.', ['c1', 'b1']]];
  c.words = old.words;
  c.plusloin = { meca: old.meca, probs: old.probs.filter(p => !['p1', 'c1', 'b1'].includes(p.id)) };
  return c;
};
