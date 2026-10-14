/* 1re — « S’évaluer » : un contrôle blanc par chapitre, 10 à 12 questions, un document central, noté sur 20.
   La grille est écrite en phrases d’élève. */
'use strict';
const K = require('./kit1');
const { rnd, H, tab, S, T, Rc, Ln, MCVP } = K;

const GR = {
  c1: { app: 'Je repère les coûts et les prix dans une fiche de gestion.', ana: 'Je choisis la bonne formule (taux, résultat de la commande).', rea: 'Je calcule un coût, une recette, un résultat, un coût moyen.', val: 'Je contrôle un résultat avec une autre méthode.', com: 'Je conseille par une phrase qui justifie ma décision.' },
  c2: { app: 'Je lis un point, un coût ou un prix sur le graphique.', ana: 'Je repère le point d’intersection et la zone de la moins chère.', rea: 'Je calcule un coût, une recette, un résultat.', val: 'Je contrôle un résultat avec le calcul.', com: 'Je conseille une décision par une phrase qui justifie.' }, c3: { app: 'Je lis des coordonnées et des racines sur une courbe.', ana: 'Je trouve le signe, le sommet ou le maximum.', rea: 'Je calcule une valeur de la fonction.', val: 'Je vérifie qu’un nombre est une racine.', com: 'Je justifie une décision par une phrase.' }, c4: { app: 'Je lis un point, une pente et un nombre sur le graphique.', ana: 'Je choisis la règle : dérivée, signe, annulation.', rea: 'Je calcule une dérivée, un nombre dérivé, un coût.', val: 'Je compare coût marginal et dérivée.', com: 'Je justifie une conclusion par une phrase.' }, c5: { app: 'Je relève les termes d’une suite dans un tableau.', ana: 'Je reconnais une suite arithmétique et sa raison.', rea: 'Je calcule un terme avec la formule.', val: 'Je contrôle un résultat avec un autre calcul.', com: 'Je justifie un choix par une phrase.' }, c6: { app: 'Je relève des valeurs dans un tableau et un tableur.', ana: 'Je résous l’équation pour trouver x.', rea: 'Je calcule un point moyen, une estimation.', val: 'Je juge un ajustement avec R² et je vérifie le point moyen.', com: 'Je décris une tendance et je discute une prévision.' }, c7: { app: 'Je relève des effectifs dans un tableau croisé.', ana: 'Je choisis le bon total et la bonne formule.', rea: 'Je calcule une probabilité.', val: 'Je contrôle avec l’évènement contraire.', com: 'J’explique ce qu’une probabilité veut dire.' }, c8: { app: 'Je relève des dimensions sur un dessin et une fiche technique.', ana: 'Je choisis la bonne formule et je décris une section.', rea: 'Je calcule des volumes et je convertis.', val: 'Je convertis et je contrôle un ordre de grandeur.', com: 'Je justifie le choix d’un emballage.' }
};
const doc = {};
const E = {};

/* ---------- chapitre 1 ---------- */
{
  const cf = 900, cv = 15, p = 35, C = q => cf + cv * q;
  doc.c1 = `<div class="evdoc">${tab(['Fiche de gestion · Les Délices de Léa (entreprise fictive)', 'Montant'], [['Charges fixes par mois', '900 €'], ['Coût de fabrication d’un coffret', '15 €'], ['Prix de vente d’un coffret (HT)', '35 €']])}</div>`;
  E.c1 = { lieu: 'Boutique de coffrets gourmands', duree: '40 min', grille: GR.c1, exos: [
    { t: 'Le mois de décembre', intro: `<p>Léa a vendu ${H('80 coffrets')} en décembre.</p>`, qs: [
      { t: 'Relever dans la fiche le coût de fabrication d’un coffret.', comp: 'app', pts: 1, a: '15 €', v: 15, tol: .006, w: 28 },
      { t: 'Calculer le coût total du mois.', comp: 'rea', pts: 2, a: '900 + 15 × 80 = 2 100 €', v: C(80), tol: .006, w: 30 },
      { t: 'Calculer la recette du mois.', comp: 'rea', pts: 2, a: '35 × 80 = 2 800 €', v: p * 80, tol: .006, w: 30 },
      { t: 'Calculer le résultat du mois.', comp: 'rea', pts: 1, a: '2 800 − 2 100 = 700 €', v: p * 80 - C(80), tol: .006, w: 30 },
      { t: 'Calculer le coût moyen d’un coffret, au centime près.', comp: 'rea', pts: 2, a: '2 100 ÷ 80 = 26,25 €', v: rnd(C(80) / 80), tol: .006, w: 30 }] },
    { t: 'Un placement', intro: `<p>Léa place ${H('5 000 €')} à ${H('2,4 % par an')} pendant ${H('9 mois')}, en intérêts simples.</p>`, qs: [
      { t: 'Donner le taux mensuel équivalent, en %.', comp: 'ana', pts: 2, a: '2,4 ÷ 12 = 0,2 %', v: 0.2, tol: .0006, w: 24 },
      { t: 'Calculer les intérêts.', comp: 'rea', pts: 2, a: '5 000 × 0,024 × 9 ÷ 12 = 90 €', v: rnd(5000 * .024 * 9 / 12), tol: .006, w: 30 },
      { t: 'Vérifier le résultat avec le taux mensuel : calculer 5 000 × 0,002 × 9.', comp: 'val', pts: 2, a: '90 € : le même résultat ✓', v: rnd(5000 * .002 * 9), tol: .006, w: 30 }] },
    { t: 'Une commande spéciale', intro: `<p>Un traiteur commande ${H('50 coffrets de plus')} à ${H('22 € HT')} l’unité. Les charges fixes sont déjà payées.</p>`, qs: [
      { t: 'Calculer le coût de fabrication de ces 50 coffrets.', comp: 'rea', pts: 2, a: '15 × 50 = 750 €', v: 750, tol: .006, w: 30 },
      { t: 'Calculer le résultat gagné grâce à cette commande.', comp: 'ana', pts: 2, a: '22 × 50 − 750 = 350 €', v: 22 * 50 - 750, tol: .006, w: 30 },
      { t: 'Léa doit-elle accepter ? Répondre par une phrase qui justifie.', comp: 'com', pts: 2, a: 'Oui : chaque coffret rapporte 22 € et coûte 15 € de plus (coût marginal) : + 350 €.', v: null, lines: 3 }] }] };
}

/* ---------- chapitre 2 ---------- */
{
  const g = MCVP.plot({ W: 600, H: 280, x: [0, 1000, 200], y: [0, 300, 50], ml: 56, mt: 18, xl: 'flyers', yl: 'prix (€)', fine: true, lab: 'Prix de deux imprimeurs selon le nombre de flyers' });
  doc.c2 = `<div class="evdoc"><div class="wfig">${g.wrap(g.base + g.line(.2, 0, { stroke: '#C2332A', w: 3 }) + g.line(.05, 30, { stroke: '#1D5FC2', w: 3 }) + g.txt(940, 188, 'imprimeur A', { dy: -8, a: 'end', fill: '#C2332A', cls: '' }) + g.txt(940, 77, 'imprimeur B', { dy: 22, a: 'end', fill: '#1D5FC2', cls: '' }))}</div><p class="srcl">Imprimeur A : 0,20 € par flyer. Imprimeur B : 30 € de forfait + 0,05 € par flyer. Entreprises fictives.</p></div>`;
  const A = x => .2 * x, B = x => 30 + .05 * x;
  E.c2 = { lieu: 'Boutique de créations', duree: '40 min', grille: GR.c2, exos: [
    { t: 'Lire le graphique', intro: `<p>Léa compare deux imprimeurs pour ses flyers. Utilise le graphique.</p>`, qs: [
      { t: 'Lire le prix de l’imprimeur A pour 400 flyers.', comp: 'app', pts: 1, a: '80 €', v: A(400), tol: .006, w: 28 },
      { t: 'Lire le forfait de l’imprimeur B (prix pour 0 flyer).', comp: 'app', pts: 1, a: '30 €', v: 30, tol: .006, w: 28 },
      { t: 'Lire le nombre de flyers pour lequel les deux prix sont égaux.', comp: 'ana', pts: 2, a: '200 flyers', v: 200, tol: .6, w: 28 },
      { t: 'Lire le prix commun à ce point.', comp: 'ana', pts: 2, a: '40 €', v: 40, tol: .6, w: 28 },
      { t: 'Pour 600 flyers, quel imprimeur est le moins cher ? Justifier par le graphique.', comp: 'com', pts: 2, a: 'L’imprimeur B : sa droite est en dessous de celle de A à droite de 200.', v: null, lines: 2 }] },
    { t: 'Calculer pour vérifier', intro: `<p>Léa veut vérifier par le calcul.</p>`, qs: [
      { t: 'Calculer le prix de l’imprimeur B pour 600 flyers.', comp: 'rea', pts: 2, a: '30 + 0,05 × 600 = 60 €', v: B(600), tol: .006, w: 28 },
      { t: 'Calculer le prix de l’imprimeur A pour 600 flyers.', comp: 'rea', pts: 2, a: '0,2 × 600 = 120 €', v: A(600), tol: .006, w: 28 },
      { t: 'Résoudre 0,2 x = 30 + 0,05 x. Donner x.', comp: 'val', pts: 3, a: '0,15 x = 30 donc x = 200', v: 200, tol: .006, w: 28 }] },
    { t: 'Une nouvelle gamme', intro: `<p>Léa lance des cartes de vœux. Son coût total est ${H('C(q) = 1 200 + 5 q')} et sa recette ${H('R(q) = 13 q')}, en euros.</p>`, qs: [
      { t: 'Calculer le résultat pour 200 cartes.', comp: 'rea', pts: 2, a: '13 × 200 − (1 200 + 5 × 200) = 400 €', v: 400, tol: .006, w: 28 },
      { t: 'Calculer le seuil de rentabilité : résoudre 13 q = 1 200 + 5 q.', comp: 'ana', pts: 3, a: '8 q = 1 200 donc q = 150 cartes', v: 150, tol: .006, w: 28 }] }] };
}

/* ---------- chapitre 3 ---------- */
{
  const Bf = x => -(x - 1) * (x - 7), g = MCVP.plot({ W: 600, H: 290, x: [0, 8, 1], y: [-8, 10, 2], ml: 48, mt: 16, mb: 30, zeroAxes: true, fine: true, lab: 'Bénéfice du stand de Léa selon le prix' });
  doc.c3 = `<div class="evdoc"><div class="wfig">${g.wrap(g.base + g.curve(Bf, { stroke: '#1D5FC2', w: 3.2 }))}</div><p class="srcl">B(x) = − (x − 1)(x − 7) : bénéfice du jour (en dizaines d’euros) pour un prix de vente de x euros. Stand fictif.</p></div>`;
  E.c3 = { lieu: 'Stand de créations', duree: '40 min', grille: GR.c3, exos: [
    { t: 'Lire la courbe', intro: `<p>Léa étudie le bénéfice de son stand. Utilise le graphique.</p>`, qs: [
      { t: 'Lire la plus petite racine de B.', comp: 'app', pts: 1, a: '1', v: 1, tol: .06, w: 24 },
      { t: 'Lire la plus grande racine de B.', comp: 'app', pts: 1, a: '7', v: 7, tol: .06, w: 24 },
      { t: 'Donner l’abscisse du sommet.', comp: 'ana', pts: 2, a: '4', v: 4, tol: .06, w: 24 },
      { t: 'Donner le bénéfice maximal.', comp: 'ana', pts: 2, a: '9', v: 9, tol: .06, w: 24 },
      { t: 'Pour quels prix le bénéfice est-il positif ? Répondre par une phrase.', comp: 'com', pts: 2, a: 'Entre 1 € et 7 € : la courbe est au-dessus de l’axe.', v: null, lines: 2 }] },
    { t: 'Calculer', intro: `<p>Léa vérifie par le calcul, avec B(x) = − x² + 8x − 7.</p>`, qs: [
      { t: 'Calculer B(3).', comp: 'rea', pts: 2, a: '− 9 + 24 − 7 = 8', v: Bf(3), tol: .006, w: 24 },
      { t: 'Calculer B(8).', comp: 'rea', pts: 2, a: '− 64 + 64 − 7 = − 7', v: Bf(8), tol: .006, w: 24 },
      { t: 'Vérifier que 7 est une racine : calculer B(7).', comp: 'val', pts: 2, a: '− 49 + 56 − 7 = 0 ✓', v: Bf(7), tol: .006, w: 24 }] },
    { t: 'L’aire d’un stand', intro: `<p>Léa dispose de 12 m de cordon pour un stand rectangulaire de longueur ${H('x')} et de largeur ${H('6 − x')} (en m). L’aire est ${H('A(x) = x (6 − x)')}.</p>`, qs: [
      { t: 'Calculer l’aire (en m²) pour x = 4.', comp: 'rea', pts: 3, a: '4 × 2 = 8 m²', v: 8, tol: .006, w: 24 },
      { t: 'Donner la valeur de x pour laquelle l’aire est maximale (milieu des racines 0 et 6).', comp: 'ana', pts: 3, a: '3 m', v: 3, tol: .006, w: 24 }] }] };
}

/* ---------- chapitre 4 ---------- */
{
  const Bf = x => -x * x + 8 * x - 7, g = MCVP.plot({ W: 600, H: 300, x: [0, 8, 1], y: [-8, 10, 2], ml: 48, mt: 16, mb: 30, zeroAxes: true, fine: true, lab: 'Bénéfice du stand de Léa et tangente en A' });
  doc.c4 = `<div class="evdoc"><div class="wfig">${g.wrap(g.base + g.curve(Bf, { stroke: '#1D5FC2', w: 3.2 }) + g.line(4, -3, { stroke: '#C2332A', w: 2.6 }) + g.dot(2, 5, { r: 6, fill: '#FFC233' }) + g.dot(3, 9, { r: 5, fill: '#fff', stroke: '#C2332A' }) + g.txt(2, 5, 'A', { dx: -14, dy: -8, fs: 15 }) + g.txt(3, 9, 'C', { dx: 12, dy: -8, fs: 15 }))}</div><p class="srcl">B(x) = − x² + 8x − 7 : bénéfice du jour (en dizaines d’euros) pour un prix de x euros. La droite rouge est la tangente en A. Stand fictif.</p></div>`;
  const Cf = q => .5 * q * q + 4 * q + 30;
  E.c4 = { lieu: 'Stand de créations', duree: '40 min', grille: GR.c4, exos: [
    { t: 'Lire le graphique', intro: `<p>Léa étudie son bénéfice. Le point A a pour abscisse 2 ; le point C est sur la tangente en A, d’abscisse 3.</p>`, qs: [
      { t: 'Lire l’ordonnée de A.', comp: 'app', pts: 1, a: '5', v: 5, tol: .06, w: 24 },
      { t: 'Lire l’ordonnée de C.', comp: 'app', pts: 1, a: '9', v: 9, tol: .06, w: 24 },
      { t: 'En déduire la pente de la tangente, c’est-à-dire B′(2).', comp: 'ana', pts: 2, a: '9 − 5 = 4', v: 4, tol: .06, w: 24 },
      { t: 'En A, B est-elle croissante ou décroissante ? Justifier.', comp: 'com', pts: 2, a: 'Croissante : la pente de la tangente est positive (4).', v: null, lines: 2 }] },
    { t: 'Calculer avec la dérivée', intro: `<p>La dérivée de B est ${H('B′(x) = − 2x + 8')}.</p>`, qs: [
      { t: 'Calculer B′(5).', comp: 'rea', pts: 2, a: '− 10 + 8 = − 2', v: -2, tol: .006, w: 24 },
      { t: 'Résoudre B′(x) = 0.', comp: 'ana', pts: 2, a: '− 2x + 8 = 0 donc x = 4', v: 4, tol: .006, w: 24 },
      { t: 'Calculer le bénéfice maximal B(4).', comp: 'rea', pts: 2, a: '− 16 + 32 − 7 = 9', v: Bf(4), tol: .006, w: 24 }] },
    { t: 'Le coût marginal', intro: `<p>Le coût de fabrication de q coffrets est ${H('C(q) = 0,5 q² + 4q + 30')} euros. Sa dérivée est ${H('C′(q) = q + 4')}.</p>`, qs: [
      { t: 'Calculer le coût marginal en 10 : C(11) − C(10).', comp: 'rea', pts: 3, a: '134,5 − 120 = 14,5 €', v: Cf(11) - Cf(10), tol: .006, w: 24 },
      { t: 'Calculer C′(10).', comp: 'rea', pts: 2, a: '10 + 4 = 14', v: 14, tol: .006, w: 24 },
      { t: 'Comparer les deux résultats par une phrase.', comp: 'val', pts: 3, a: '14,5 et 14 sont proches : la dérivée donne une approximation du coût marginal.', v: null, lines: 2 }] }] };
}

/* ---------- chapitre 5 ---------- */
{
  doc.c5 = `<div class="evdoc">${tab(['Mois n', '0', '1', '2', '3'], [['Coffrets fabriqués', '150', '162', '174', '186']], 'dt-c')}<p class="srcl">Production mensuelle de coffrets de Léa (entreprise fictive).</p></div>`;
  E.c5 = { lieu: 'Atelier de coffrets', duree: '40 min', grille: GR.c5, exos: [
    { t: 'Une production qui augmente', intro: `<p>La production suit une suite arithmétique (uₙ).</p>`, qs: [
      { t: 'Relever u₀.', comp: 'app', pts: 1, a: '150', v: 150, tol: .006, w: 24 },
      { t: 'Calculer la raison r.', comp: 'ana', pts: 2, a: '162 − 150 = 12', v: 12, tol: .006, w: 24 },
      { t: 'Calculer u₁₂ avec le terme général.', comp: 'rea', pts: 2, a: '150 + 12 × 12 = 294', v: 294, tol: .006, w: 24 },
      { t: 'À partir de quel mois la production dépasse-t-elle 300 coffrets ?', comp: 'val', pts: 2, a: 'u₁₂ = 294 ; u₁₃ = 306 : au mois 13', v: 13, tol: .006, w: 24 }] },
    { t: 'Le prix d’un coffret', intro: `<p>Pour une commande de n coffrets, le prix d’un coffret est ${H('pₙ = 12 + 24 ÷ n')} euros.</p>`, qs: [
      { t: 'Calculer p₂.', comp: 'rea', pts: 2, a: '12 + 24 ÷ 2 = 24 €', v: 24, tol: .006, w: 24 },
      { t: 'Calculer p₃ − p₂.', comp: 'rea', pts: 2, a: '20 − 24 = − 4', v: -4, tol: .006, w: 24 },
      { t: 'La suite (pₙ) semble-t-elle croissante ou décroissante ? Justifier.', comp: 'com', pts: 2, a: 'Décroissante : p₁ = 36, p₂ = 24, p₃ = 20, p₄ = 18 ; chaque différence est négative.', v: null, lines: 2 }] },
    { t: 'Une épargne qui augmente', intro: `<p>Léa met de côté ${H('50 €')} le 1er mois, puis ${H('10 € de plus')} chaque mois. On note uₙ le versement du mois n (u₁ = 50).</p>`, qs: [
      { t: 'Calculer le versement du 12ᵉ mois, u₁₂.', comp: 'rea', pts: 2, a: '50 + 11 × 10 = 160 €', v: 160, tol: .006, w: 24 },
      { t: 'Calculer le total versé en 12 mois.', comp: 'rea', pts: 3, a: '12 × (50 + 160) ÷ 2 = 1 260 €', v: 1260, tol: .006, w: 24 },
      { t: 'Léa veut 1 200 € au bout d’un an. Est-ce atteint ? Justifier.', comp: 'com', pts: 2, a: 'Oui : 1 260 € ≥ 1 200 €.', v: null, lines: 2 }] }] };
}

/* ---------- chapitre 6 ---------- */
{
  const P = [[2, 14], [3, 19], [4, 23], [5, 30], [6, 33], [7, 39]], F = MCVP.fit(P);
  const g = MCVP.plot({ W: 600, H: 250, x: [0, 8, 1], y: [0, 45, 5], ml: 48, mt: 26, mb: 36, xl: 'vendeurs', yl: 'ventes (centaines d’€)', fine: true, lab: 'Ventes du samedi selon le nombre de vendeurs' });
  doc.c6 = `<div class="evdoc">${tab(['vendeurs x', '2', '3', '4', '5', '6', '7'], [['ventes y', '14', '19', '23', '30', '33', '39']], 'dt-c')}<div class="wfig">${g.wrap(g.base + g.pts(P, { r: 5.5, fill: '#1D5FC2' }))}</div><p class="srcl">Tableur : =PENTE → ${String(rnd(F.a, 6)).replace('.', ',')} ; =ORDONNEE.ORIGINE → ${String(rnd(F.b, 6)).replace('.', ',')} ; =COEFFICIENT.DETERMINATION → ${String(rnd(F.r2, 4)).replace('.', ',')}. Magasin fictif.</p></div>`;
  E.c6 = { lieu: 'Magasin de décoration', duree: '40 min', grille: GR.c6, exos: [
    { t: 'Le nuage de points', intro: `<p>Le samedi, le magasin note le nombre de vendeurs x et les ventes y (en centaines d’euros).</p>`, qs: [
      { t: 'Calculer x̄.', comp: 'rea', pts: 2, a: '27 ÷ 6 = 4,5', v: 4.5, tol: .006, w: 24 },
      { t: 'Calculer ȳ, au centième.', comp: 'rea', pts: 2, a: '158 ÷ 6 ≈ 26,33', v: 26.33, tol: .006, w: 24 },
      { t: 'Décrire la tendance du nuage par une phrase.', comp: 'com', pts: 1, a: 'Le nuage monte : plus il y a de vendeurs, plus les ventes sont fortes.', v: null, lines: 2 }] },
    { t: 'La droite d’ajustement', intro: `<p>Utiliser les résultats du tableur.</p>`, qs: [
      { t: 'Relever a, arrondi au centième.', comp: 'app', pts: 1, a: '4,97', v: rnd(F.a, 2), tol: .006, w: 24 },
      { t: 'Relever b, arrondi au centième.', comp: 'app', pts: 1, a: '3,96', v: rnd(F.b, 2), tol: .006, w: 24 },
      { t: 'L’ajustement affine est-il pertinent ? Justifier avec R².', comp: 'val', pts: 2, a: 'Oui : R² ≈ 0,994 est très proche de 1.', v: null, lines: 2 }] },
    { t: 'Prévoir', intro: `<p>On utilise la droite ${H('y = 4,97 x + 3,96')}.</p>`, qs: [
      { t: 'Estimer les ventes avec 8 vendeurs.', comp: 'rea', pts: 3, a: '4,97 × 8 + 3,96 = 43,72 centaines d’€', v: rnd(4.97 * 8 + 3.96, 2), tol: .006, w: 24 },
      { t: 'Combien de vendeurs faut-il pour 35 centaines d’euros ? (au dixième)', comp: 'ana', pts: 3, a: '(35 − 3,96) ÷ 4,97 ≈ 6,2', v: rnd((35 - 3.96) / 4.97, 1), tol: .06, w: 24 },
      { t: 'L’estimation pour 8 vendeurs est-elle une interpolation ou une extrapolation ? Justifier.', comp: 'com', pts: 2, a: 'Une extrapolation : 8 est en dehors des données (de 2 à 7).', v: null, lines: 2 },
      { t: 'Vérifier que G est presque sur la droite : calculer 4,97 × 4,5 + 3,96.', comp: 'val', pts: 3, a: '26,325 ≈ 26,33 ✓', v: rnd(4.97 * 4.5 + 3.96, 3), tol: .006, w: 24 }] }] };
}

/* ---------- chapitre 7 ---------- */
{
  doc.c7 = `<div class="evdoc">${tab(['Visiteurs du salon', 'achat', 'pas d’achat', 'total'], [['moins de 30 ans', '48', '72', '120'], ['30 ans et plus', '90', '90', '180'], ['total', '138', '162', '300']], 'dt-c')}<p class="srcl">Enquête auprès de 300 visiteurs d’un salon (données fictives).</p></div>`;
  E.c7 = { lieu: 'Stand d’un salon', duree: '40 min', grille: GR.c7, exos: [
    { t: 'Lire le tableau', intro: `<p>On choisit un visiteur au hasard parmi les 300.</p>`, qs: [
      { t: 'Relever le nombre de visiteurs qui ont acheté.', comp: 'app', pts: 1, a: '138', v: 138, tol: .006, w: 24 },
      { t: 'Relever le nombre de visiteurs de moins de 30 ans.', comp: 'app', pts: 1, a: '120', v: 120, tol: .006, w: 24 },
      { t: 'Calculer la probabilité qu’un visiteur ait acheté.', comp: 'rea', pts: 2, a: '138 ÷ 300 = 0,46', v: .46, tol: .0006, w: 24 },
      { t: 'En déduire la probabilité qu’il n’ait pas acheté.', comp: 'val', pts: 2, a: '1 − 0,46 = 0,54', v: .54, tol: .0006, w: 24 }] },
    { t: 'Et, ou, parmi', intro: `<p>A : « le visiteur a moins de 30 ans ». B : « le visiteur a acheté ».</p>`, qs: [
      { t: 'Calculer P(A et B).', comp: 'rea', pts: 2, a: '48 ÷ 300 = 0,16', v: .16, tol: .0006, w: 24 },
      { t: 'Calculer P(A ou B).', comp: 'ana', pts: 3, a: '(120 + 138 − 48) ÷ 300 = 0,7', v: .7, tol: .0006, w: 24 },
      { t: 'Calculer la probabilité conditionnelle P<sub>A</sub>(B) : la probabilité d’avoir acheté, sachant que le visiteur a moins de 30 ans.', comp: 'ana', pts: 2, a: 'P<sub>A</sub>(B) = 48 ÷ 120 = 0,4', v: .4, tol: .0006, w: 24 }] },
    { t: 'Le jeu du stand', intro: `<p>Une urne contient ${H('20 tickets')} : ${H('1 gros lot')}, ${H('4 petits lots')}, les autres perdants.</p>`, qs: [
      { t: 'Calculer la probabilité de gagner le gros lot.', comp: 'rea', pts: 2, a: '1 ÷ 20 = 0,05', v: .05, tol: .0006, w: 24 },
      { t: 'Calculer la probabilité de gagner un lot.', comp: 'rea', pts: 2, a: '5 ÷ 20 = 0,25', v: .25, tol: .0006, w: 24 },
      { t: 'Le stand attend 200 joueurs. Combien de lots prévoir, environ ? Expliquer.', comp: 'com', pts: 3, a: '200 × 0,25 = 50 : environ 50 lots, car 1 joueur sur 4 gagne en moyenne.', v: null, lines: 2 }] }] };
}

/* ---------- chapitre 8 ---------- */
{
  const G = require('../shared/t8.js'), PI = Math.PI, s = 13, by = 250;
  const body = G.cyl(220, by, s, 5, 10, { fill: '#E0EBFD' }) + G.cone(220, by - 130, s, 5, 6, { fill: '#FDE3E0' }).replace(/stroke-dasharray="6 5"/g, '') + G.L([220, by], [285, by], { stroke: '#C2332A', w: 1.6 }) + T(252, by + 20, '5 cm', { fs: 13, c: 'kt' }) + G.L([320, by], [320, by - 130], { stroke: '#C2332A', w: 1.6 }) + T(328, by - 65, '10 cm', { fs: 13, a: 'start', c: 'kt' }) + G.L([320, by - 130], [320, by - 208], { stroke: '#C2332A', w: 1.6 }) + T(328, by - 169, '6 cm', { fs: 13, a: 'start', c: 'kt' });
  doc.c8 = `<div class="evdoc"><div class="wfig">${G.SV(600, 280, body, 'Bougie tour : un cylindre surmonté d’un cône')}</div><p class="srcl">Bougie « tour » : cylindre de rayon 5 cm et de hauteur 10 cm, surmonté d’un cône de même rayon et de hauteur 6 cm. Produit fictif.</p></div>`;
  E.c8 = { lieu: 'Atelier de bougies', duree: '40 min', grille: GR.c8, exos: [
    { t: 'Lire le dessin', intro: `<p>Mia prépare la fiche technique de la bougie « tour ».</p>`, qs: [
      { t: 'Relever le rayon de la bougie.', comp: 'app', pts: 1, a: '5 cm', v: 5, tol: .006, w: 24 },
      { t: 'Relever la hauteur totale de la bougie.', comp: 'app', pts: 1, a: '10 + 6 = 16 cm', v: 16, tol: .006, w: 24 },
      { t: 'On coupe la partie cylindrique parallèlement à la base. Décrire la section.', comp: 'ana', pts: 2, a: 'Un disque de rayon 5 cm.', v: null, lines: 2 }] },
    { t: 'Les volumes', intro: `<p>Donner les résultats au centième.</p>`, qs: [
      { t: 'Calculer le volume du cylindre.', comp: 'rea', pts: 3, a: 'π × 5² × 10 ≈ 785,40 cm³', v: rnd(250 * PI, 2), tol: .006, w: 26 },
      { t: 'Calculer le volume du cône.', comp: 'rea', pts: 3, a: 'π × 5² × 6 ÷ 3 ≈ 157,08 cm³', v: rnd(50 * PI, 2), tol: .006, w: 26 },
      { t: 'Calculer le volume total de la bougie.', comp: 'rea', pts: 2, a: '785,40 + 157,08 = 942,48 cm³', v: 942.48, tol: .006, w: 26 },
      { t: 'Convertir ce volume en litres, au centième.', comp: 'val', pts: 2, a: '942,48 cm³ ≈ 0,94 L', v: .94, tol: .006, w: 24 }] },
    { t: 'L’emballage', intro: `<p>La bougie est vendue dans une boîte en pavé droit de ${H('10 cm × 10 cm × 16 cm')}.</p>`, qs: [
      { t: 'Calculer le volume de la boîte.', comp: 'rea', pts: 2, a: '10 × 10 × 16 = 1 600 cm³', v: 1600, tol: .006, w: 26 },
      { t: 'Calculer le volume vide dans la boîte.', comp: 'ana', pts: 2, a: '1 600 − 942,48 = 657,52 cm³', v: 657.52, tol: .006, w: 26 },
      { t: 'Faut-il prévoir du calage ? Justifier par une phrase.', comp: 'com', pts: 2, a: 'Oui : plus de 650 cm³ restent vides, soit environ 41 % de la boîte.', v: null, lines: 2 }] }] };
}
/* les autres chapitres sont ajoutés au fur et à mesure */
const REG = [];
module.exports = (chk, extra = {}) => {
  Object.assign(E, extra);
  for (const [id, e] of Object.entries(E)) {
    if (doc[id]) e.exos[0].intro = doc[id] + (e.exos[0].intro || '');
    const n = e.exos.reduce((a, x) => a + x.qs.length, 0), pts = e.exos.reduce((a, x) => a + x.qs.reduce((b, q) => b + q.pts, 0), 0);
    chk(n >= 10 && n <= 12 && pts === 20, `S’évaluer ${id} : ${n} questions, ${pts} points`);
  }
  return E;
};
module.exports.GR = GR; module.exports.doc = doc; module.exports.E = E;
