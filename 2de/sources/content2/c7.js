/* Chapitre 7 · Géométrie (BO 2019, 2de pro) */
'use strict';
const K = require('../lib/kit');
const { rnd, fr, eur, pct, H, FX, Q, BQ, X, prob, D, G, P } = K;

/* petite figure : triangle rectangle légendé */
const tri = (a, b, c) => `<svg viewBox="0 0 252 132" class="fig"><path d="M20 110H200V20Z" fill="#EEE3FB" stroke="#7438C0" stroke-width="2.4"/><path d="M188 110V98H200" fill="none" stroke="#7438C0" stroke-width="2"/><text x="110" y="126" font-size="13" text-anchor="middle" font-weight="700" fill="#1D2240">${a}</text><text x="206" y="68" font-size="13" font-weight="700" fill="#1D2240">${b}</text><text x="96" y="56" font-size="13" text-anchor="middle" font-weight="700" fill="#7438C0">${c}</text></svg>`;
const presentoir = `<svg viewBox="0 0 240 170" class="fig"><path d="M120 12L24 156H216Z" fill="#EEE3FB" stroke="#7438C0" stroke-width="2.4"/><line x1="56" y1="108" x2="184" y2="108" stroke="#7438C0" stroke-width="4"/><g font-size="13" font-weight="700" fill="#1D2240"><text x="120" y="10" text-anchor="middle">A</text><text x="44" y="110">M</text><text x="188" y="110">N</text><text x="12" y="166">B</text><text x="220" y="166">C</text></g><text x="120" y="102" font-size="11" text-anchor="middle" fill="#7438C0">étagère</text></svg>`;

module.exports = function (chk) {
  const c = { id: 'c7', n: 7, col: 'geometrie', icone: '📐', dom: 'Géométrie', titre: 'Géométrie',
    intro: 'Aménager une vitrine, préparer un colis, fabriquer un présentoir : les figures et les solides sont partout dans le magasin.',
    obj: ['Calculer des aires et des volumes.', 'Utiliser le théorème de Pythagore et sa réciproque.', 'Utiliser le théorème de Thalès dans un triangle.', 'Prévoir l’effet d’un agrandissement ou d’une réduction.'] };
  c.auto = ['aireR', 'conv', 'pytH', 'volP', 'pctOf', 'agr'];
  c.lecons = [
    { titre: 'Solides et volumes', rule: `<p>Pavé droit : ${FX('V = L × l × h')} ; cube : ${FX('V = a³')}</p><p>Cylindre : ${FX('V = π × r² × h')}</p><p>Pyramide, cône, boule : la formule est donnée dans l’énoncé.</p><p>${FX('1 dm³ = 1 L')} ; 1 L = 1 000 cm³.</p>`, ex: `<p>Carton 40 cm × 30 cm × 25 cm :</p><p>V = 30 000 cm³ = <b>30 L</b></p>`, ill: P.volume() },
    { titre: 'Aires et périmètres', rule: `<p>Rectangle : ${FX('A = L × l')} ; triangle : ${FX('A = base × hauteur ÷ 2')}</p><p>Disque : ${FX('A = π × r²')} ; cercle : ${FX('périmètre = 2 × π × r')}</p><p>1 m² = 10 000 cm².</p>`, ex: `<p>Vitrine 3,2 m × 1,5 m : A = <b>4,8 m²</b></p><p>Disque r = 10 cm : A ≈ <b>314,2 cm²</b></p>` },
    { titre: 'Le théorème de Pythagore', rule: `<p>Dans un triangle rectangle, ${FX('hypoténuse² = côté² + côté²')} (l’hypoténuse est le côté opposé à l’angle droit).</p><p>${FX('Réciproque')} : si le carré du plus grand côté est égal à la somme des carrés des deux autres, le triangle est rectangle.</p>`, ex: `<p>Côtés 1,2 m et 0,9 m :</p><p>c² = 1,44 + 0,81 = 2,25 ; c = <b>1,5 m</b></p>`, ill: P.pythagore() },
    { titre: 'Le théorème de Thalès', rule: `<p>Dans un triangle ABC, M sur [AB], N sur [AC], ${FX('(MN) parallèle à (BC)')} :</p><p>${FX('AM ÷ AB = AN ÷ AC = MN ÷ BC')}</p>`, ex: `<p>AM = 0,8 ; AB = 1,2 ; BC = 0,9</p><p>MN = 0,9 × 0,8 ÷ 1,2 = <b>0,6</b></p>`, ill: P.thales() },
    { titre: 'Agrandissement, réduction', rule: `<p>Rapport k : les longueurs sont multipliées par ${FX('k')}, les aires par ${FX('k²')}, les volumes par ${FX('k³')}.</p><p>k &gt; 1 : agrandissement ; k &lt; 1 : réduction.</p>`, ex: `<p>Maquette au 1/20 : k = 20 pour passer au réel.</p><p>150 cm² × 20² = 60 000 cm² = <b>6 m²</b></p>`, ill: P.agrandir() }];
  chk(40 * 30 * 25 === 30000 && rnd(3.2 * 1.5, 2) === 4.8 && rnd(Math.PI * 100, 1) === 314.2 && rnd(Math.sqrt(1.44 + .81), 2) === 1.5 && rnd(.9 * .8 / 1.2, 2) === .6 && 150 * 400 === 60000, 'c7 leçon');
  c.mots = [['hypoténuse', 'côté opposé à l’angle droit, le plus long'], ['réciproque', 'théorème « à l’envers » : pour prouver un angle droit'], ['parallèles', 'droites qui ne se coupent jamais'], ['aire, volume', 'surface (m², cm²) ; espace occupé (m³, L)'], ['agrandissement, réduction', 'figure multipliée par un rapport k']];
  c.astuces = [
    { k: 'vite', ic: '⚡', t: 'Calculer vite', items: ['Triplets à connaître : 3-4-5, 6-8-10, 5-12-13.', 'cm³ → L : je divise par 1 000.'] },
    { k: 'og', ic: '🎯', t: 'Estimer', items: ['L’hypoténuse est plus longue que chaque côté, mais plus courte que leur somme.', 'π ≈ 3 pour estimer, la calculatrice pour calculer.'] },
    { k: 'sens', ic: '💡', t: 'Donner du sens', items: ['Une aire s’exprime en unités carrées (m²), un volume en unités cubes (m³) ou en litres.', 'Doubler les longueurs multiplie l’aire par 4.'] },
    { k: 'verif', ic: '✅', t: 'Vérifier', items: ['Je vérifie que toutes les longueurs sont dans la même unité.', 'Pythagore : le plus grand côté est l’hypoténuse.'] }];
  c.resolus = [
    { titre: 'Calculer une longueur avec Pythagore', outil: '🧮 calculatrice', enonce: `Un panneau publicitaire rectangulaire mesure ${H('1,20 m')} sur ${H('0,90 m')}. Calculer la longueur de sa diagonale.${tri('1,20 m', '0,90 m', 'd ?')}`,
      rows: [['Le triangle est rectangle (coin du panneau)', 'Je vérifie que l’on peut utiliser Pythagore.'], ['d² = 1,20² + 0,90²', 'L’hypoténuse est la diagonale, opposée à l’angle droit.'], ['d² = 1,44 + 0,81 = <b class="nw">2,25</b>', 'Je calcule les carrés.'], ['d = √2,25 = <b class="nw">1,5 m</b>', 'Je prends la racine carrée.'], ['1,5 &gt; 1,20 et 1,5 &lt; 1,20 + 0,90 ✓', 'L’hypoténuse est le plus long côté.']], rep: 'La diagonale mesure 1,5 m.', go: ['m1', 'p1'] },
    { titre: 'Calculer un volume et le convertir', outil: '🧮 calculatrice', enonce: `Un carton mesure ${H('40 cm × 30 cm × 25 cm')}. Combien de bouteilles de ${H('1,5 L')} contient-il, au plus, en volume ?`,
      rows: [['V = 40 × 30 × 25 = <b class="nw">30 000 cm³</b>', 'Pavé droit : L × l × h.'], ['30 000 cm³ = <b class="nw">30 L</b>', '1 L = 1 000 cm³ : je divise par 1 000.'], ['30 ÷ 1,5 = <b class="nw">20</b>', 'Je divise le volume du carton par celui d’une bouteille.'], ['En réalité, un peu moins : les bouteilles laissent des vides', 'Je donne du sens au résultat.']], rep: 'Au plus 20 bouteilles (en volume).', go: ['m6', 'p4'] }];
  chk(30000 / 1000 / 1.5 === 20, 'c7 R2');
  c.meca = [
    { id: 'm1', lc: 3, titre: 'Pythagore : l’hypoténuse', consigne: 'Calculez.', gen: ['pytH', 'pytD'], n: 4, cols: 1, w: 16 },
    { id: 'm2', lc: 3, titre: 'Pythagore : un côté', consigne: 'Calculez.', gen: 'pytC', n: 3, cols: 1, w: 16 },
    { id: 'm3', lc: 3, titre: 'Le triangle est-il rectangle ?', consigne: 'Cochez.', gen: 'recip', n: 4, cols: 1 },
    { id: 'm4', lc: 4, titre: 'Thalès', consigne: 'Calculez BC.', gen: 'thales', n: 3, cols: 1, w: 16 },
    { id: 'm5', lc: 2, titre: 'Aires', consigne: 'Calculez.', gen: ['aireR', 'aireD'], n: 4, cols: 1, w: 18 },
    { id: 'm6', lc: 1, titre: 'Volumes', consigne: 'Calculez.', gen: ['volP', 'volC'], n: 4, cols: 1, w: 18 },
    { id: 'm7', lc: 1, titre: 'Conversions', consigne: 'Complétez.', gen: 'conv', n: 6, cols: 2, w: 18 },
    { id: 'm8', lc: 5, titre: 'Agrandir, réduire', consigne: 'Calculez.', gen: 'agr', n: 3, cols: 1, w: 18 }];
  c.probs = [];
  const add = x => c.probs.push(prob(x));
  const r1 = rnd(Math.sqrt(36.25), 2); chk(r1 === 6.02, 'c7 p1');
  add({ id: 'p1', etape: 2, lc: 3, comps: ['app', 'rea'], titre: 'La rampe d’accès', intro: `<div class="two w2"><div><p>L’entrée d’une boutique a une marche de ${H('0,5 m')} de haut. On installe une rampe qui part à ${H('6 m')} de la marche, au sol.</p></div><div>${tri('6 m', '0,5 m', 'rampe ?')}</div></div>`, qs: [Q('a.', 'Calculez la longueur de la rampe (au centième).', '6,02 m', 6.02)], corr: 'a. √(6² + 0,5²) = √36,25 ≈ 6,02 m.' });
  chk(rnd(4.8 * 18, 2) === 86.4, 'c7 p2');
  add({ id: 'p2', etape: 2, lc: 2, comps: ['rea'], titre: 'La moquette de la vitrine', intro: `<p>Le sol d’une vitrine est un rectangle de ${H('3,2 m')} sur ${H('1,5 m')}. La moquette coûte ${H('18 € le m²')}.</p>`, qs: [Q('a.', 'Calculez l’aire du sol.', '4,8 m²', 4.8), Q('b.', 'Calculez le prix de la moquette.', '86,40 €', 86.4)], corr: 'a. 3,2 × 1,5 = 4,8 m². b. 4,8 × 18 = 86,40 €.' });
  add({ id: 'p3', etape: 2, lc: 3, comps: ['val', 'com'], titre: 'L’étagère est-elle d’équerre ?', intro: `<p>Pour vérifier l’angle droit d’une étagère, un employé mesure ${H('60 cm')} sur le montant, ${H('80 cm')} sur la planche et ${H('100 cm')} entre les deux marques.</p>`, qs: [Q('a.', 'Calculez 60² + 80², puis 100².', '10 000 et 10 000', 10000, { w: 40, lab: '60² + 80² :' }), Q('b.', 'L’angle est-il droit ? Justifiez avec le bon théorème.', 'Oui, d’après la réciproque du théorème de Pythagore.', null, { lines: 2 })], corr: 'a. 3 600 + 6 400 = 10 000 et 100² = 10 000. b. Oui : réciproque du théorème de Pythagore.' });
  const V4 = rnd(Math.PI * 225 * 60, 0); chk(V4 === 42412, 'c7 p4 ' + V4);
  add({ id: 'p4', etape: 2, lc: 1, comps: ['rea'], titre: 'Le présentoir cylindrique', intro: `<p>Un présentoir de bonbons est un cylindre de ${H('15 cm de rayon')} et ${H('60 cm de haut')}.</p>`, qs: [Q('a.', 'Calculez son volume en cm³ (à l’unité).', '42 412 cm³', 42412, { tol: 1 }), Q('b.', 'Convertissez en litres (au dixième).', '42,4 L', 42.4, { tol: .06 })], corr: 'a. π × 15² × 60 ≈ 42 412 cm³. b. ≈ 42,4 L.' });
  // cas pratiques
  add({ id: 'c1', etape: 3, lc: 5, comps: ['app', 'ana', 'rea'], titre: 'La maquette du stand', intro: `<p>Un stand de salon est présenté au client sous forme de ${H('maquette au 1/20')} : sur la maquette, le sol du stand mesure ${H('15 cm sur 10 cm')}.</p>`, qs: [Q('a.', 'Calculez les dimensions réelles du stand (en m).', '3 m sur 2 m', 3, { w: 30, lab: 'longueur :' }), Q('b.', 'Calculez l’aire de la maquette, puis l’aire réelle (en m²).', '150 cm² ; 6 m²', 6, { w: 40, lab: 'aire réelle :' }), Q('c.', 'Vérifiez avec la règle « aires × k² ».', '150 × 20² = 60 000 cm² = 6 m² ✓', null, { lines: 1 })], corr: 'a. 15 × 20 = 300 cm = 3 m ; 10 × 20 = 200 cm = 2 m. b. 150 cm² ; 3 × 2 = 6 m². c. 150 × 400 = 60 000 cm² = 6 m².' });
  add({ id: 'c2', etape: 3, lc: 4, comps: ['app', 'rea', 'val'], titre: 'L’étagère du présentoir', intro: `<div class="two w2"><div><p>Un présentoir a la forme d’un triangle ABC. On fixe une ${H('étagère [MN] parallèle à la base [BC]')}.</p><p>${H('AB = 1,2 m')} ; ${H('AM = 0,8 m')} ; ${H('BC = 0,9 m')}.</p></div><div>${presentoir}</div></div>`, qs: [Q('a.', 'Écrivez l’égalité de Thalès.', 'AM ÷ AB = AN ÷ AC = MN ÷ BC', null, { w: 60 }), Q('b.', 'Calculez la longueur de l’étagère MN.', '0,6 m', .6), Q('c.', 'Une planche de 65 cm convient-elle, sans découpe ?', 'Non : il faut 60 cm, on doit la recouper.', null, { lines: 1 })], corr: 'a. AM/AB = AN/AC = MN/BC. b. MN = 0,9 × 0,8 ÷ 1,2 = 0,6 m. c. Non, elle est trop longue de 5 cm.' });
  // vers le bac
  const Vp = 20 * 20 * 10, Vc = rnd(Math.PI * 100 * 12, 0), nb = Math.floor(60 / 20) * Math.floor(40 / 20) * Math.floor(30 / 10);
  chk(Vp === 4000 && Vc === 3770 && nb === 18, 'c7 bac');
  add({ id: 'b1', etape: 4, comps: ['app', 'ana', 'rea', 'val', 'com'], titre: 'Le coffret cadeau', cls: 'bac', intro: `<p>Une épicerie fine prépare des coffrets de fin d’année. Chaque coffret doit contenir <b>au moins 3,5 L</b> de produits.</p><div class="two">${D.doc(1, 'Deux emballages possibles', '<p>Coffret pavé : 20 cm × 20 cm × 10 cm</p><p>Boîte cylindrique : rayon 10 cm, hauteur 12 cm</p>')}${D.doc(2, 'Expédition', '<p>Les coffrets voyagent dans des cartons de <b>60 cm × 40 cm × 30 cm</b>.</p>')}</div>`,
    qs: [BQ(1, 'Calculer le volume du coffret pavé, en litres.', 'rea', '4 L', 4), BQ(2, 'Calculer le volume de la boîte cylindrique, en litres (au centième).', 'rea', '3,77 L', 3.77), BQ(3, 'Les deux emballages respectent-ils la consigne ? Justifier.', 'val', 'Oui : 4 L et 3,77 L sont supérieurs à 3,5 L.', null, { lines: 1 }), BQ(4, 'Déterminer le nombre de coffrets pavés que l’on peut ranger dans un carton (posés à plat).', 'ana', '3 × 2 × 3 = 18', 18, { tol: 0 }), BQ(5, 'Rédiger une recommandation pour le choix de l’emballage.', 'com', 'Le coffret pavé : plus grand volume et rangement sans perte de place (18 par carton).', null, { lines: 2 })],
    corr: `1. 4 000 cm³ = 4 L. 2. π × 10² × 12 ≈ 3 770 cm³ ≈ 3,77 L. 3. Oui. 4. 60 ÷ 20 = 3 ; 40 ÷ 20 = 2 ; 30 ÷ 10 = 3 : 18 coffrets. 5. Réponse libre.` });
  c.words = [
    { id: 'hypo', mot: 'l’hypoténuse', pic: P.pythagore(), def: 'Dans un triangle rectangle, le côté opposé à l’angle droit ; c’est le plus long.', formule: 'c² = a² + b²', phrase: 'La diagonale du panneau est l’hypoténuse.' },
    { id: 'thales', mot: 'le théorème de Thalès', pic: P.thales(), def: 'Avec deux droites parallèles, les longueurs sont proportionnelles.', formule: 'AM ÷ AB = AN ÷ AC = MN ÷ BC', phrase: 'L’étagère mesure 0,6 m d’après Thalès.' },
    { id: 'volume', mot: 'le volume', abr: 'V', pic: P.volume(), def: 'Mesure de l’espace occupé par un solide.', formule: '1 dm³ = 1 L', sens: 'Dans la vie courante, « volume » désigne aussi le son ou un livre.', phrase: 'Le carton a un volume de 30 L.' },
    { id: 'agrandir', mot: 'l’agrandissement', pic: P.agrandir(), def: 'Les longueurs sont multipliées par k &gt; 1 ; les aires par k², les volumes par k³.', phrase: 'La maquette est agrandie 20 fois.' }];
  c.bilan = [['calculer aires et volumes', ['m5', 'm6', 'm7', 'p2', 'p4']], ['utiliser Pythagore et sa réciproque', ['m1', 'm2', 'm3', 'p1', 'p3']], ['utiliser Thalès', ['m4', 'c2']], ['agrandir, réduire', ['m8', 'c1']], ['choisir un emballage', ['b1']]];
  return c;
};
