/* Terminale — « S’évaluer au format CCF » : une situation d’évaluation par chapitre, comme au contrôle en cours de formation.
   45 minutes, notée sur 10, un ou deux exercices de plus en plus approfondis, et au moins une question « appel » 📞
   résolue devant l’examinateur avec un outil numérique (tableur, GeoGebra, calculatrice, Python).
   Arrêté du 17 juin 2020 (modalités d’évaluation des mathématiques en baccalauréat professionnel). La grille est écrite en phrases d’élève. */
'use strict';
const K = require('./kitT');
const { rnd, H, tab, S, T, Rc, Ln, MCVP } = K;

const GR = {
  c2: { app: 'Je relève un taux et un capital dans un document.', ana: 'Je choisis entre intérêts simples et composés, et je cherche une durée.', rea: 'Je calcule un capital acquis, des intérêts et une ligne de tableau d’amortissement.', val: 'Je vérifie qu’un crédit respecte le taux d’usure.', com: 'J’explique le coût d’un crédit au client.' },
  c3: { app: 'Je calcule une image avec la fonction cube.', ana: 'Je dresse un tableau de variations à partir du signe de la dérivée.', rea: 'Je dérive un polynôme de degré 3 et je calcule des images.', val: 'Je vérifie une forme factorisée et je contrôle un résultat avec GeoGebra.', com: 'Je conclus par une phrase sur le meilleur bénéfice.' },
  c4: { app: 'Je relève un taux et je calcule une puissance.', ana: 'Je ramène une inéquation à la forme qˣ ≥ a.', rea: 'Je résous une équation avec le logarithme.', val: 'Je contrôle un résultat avec un tableur et je surveille le sens d’une inégalité.', com: 'J’annonce une durée au client par une phrase.' },
  c5: { app: 'Je décris la forme d’un nuage de points.', ana: 'Je choisis un modèle avec R².', rea: 'Je fais un changement de variable et je calcule une prévision.', val: 'Je dis si une prévision est une interpolation ou une extrapolation.', com: 'Je présente une prévision avec une réserve.' },
  c6: { app: 'Je traduis un énoncé par un arbre pondéré.', ana: 'Je choisis entre chemin, somme de chemins et probabilité conditionnelle.', rea: 'Je calcule des probabilités avec l’arbre.', val: 'Je compare une fréquence simulée à une probabilité, et je teste l’indépendance.', com: 'J’explique un résultat au responsable du magasin.' },
  c7: { app: 'Je calcule une valeur avec e.', ana: 'Je ramène une équation à la forme eˣ = a.', rea: 'Je dérive e^(kx) et je résous avec ln.', val: 'Je vérifie un résultat avec la calculatrice ou un tableur.', com: 'J’explique un résultat par une phrase.' },
  c1: { app: 'Je relève un taux, un capital ou une baisse dans un document.', ana: 'Je reconnais une suite géométrique et je donne sa raison.', rea: 'Je calcule un terme avec uₙ = u₀ × qⁿ et j’utilise un tableur.', val: 'Je justifie le sens de variation par la raison q.', com: 'J’explique un résultat au client par une phrase.' }
};
const doc = {};
const E = {};
const chk0 = [];

/* ---------- chapitre 1 · suites ---------- */
{
  const C = n => 2000 * Math.pow(1.017, n), v = n => 450 * Math.pow(.88, n);
  doc.c1 = `<div class="evdoc">${tab(['Livret A', 'Information'], [['Taux annuel depuis le 1er août 2026', '1,7 %'], ['Plafond des dépôts', '22 950 €'], ['Versement des intérêts', 'une fois par an, ajoutés au capital']])}<p class="srcl">Source : info.gouv.fr, « Le taux du livret A augmente à compter du 1er août 2026 » (31 juillet 2026). On suppose que le taux reste à 1,7 % et qu’Inès ne fait aucun retrait.</p></div>`;
  E.c1 = { lieu: 'Agence bancaire et magasin d’occasion', duree: '45 min', grille: GR.c1, exos: [
    { t: 'Un Livret A', intro: `<p>Le 1er janvier, Inès place ${H('2 000 €')} sur un Livret A. On note Cₙ le capital au bout de n années : C₀ = 2 000.</p>`, qs: [
      { t: 'Calculer C₁, le capital au bout d’un an.', comp: 'rea', pts: 1, a: '2 000 × 1,017 = 2 034 €', v: 2034, tol: .006, w: 30 },
      { t: 'Justifier que la suite (Cₙ) est géométrique et donner sa raison.', comp: 'ana', pts: 1.5, a: 'Chaque année, le capital est multiplié par 1 + 1,7 ÷ 100 = 1,017 : raison q = 1,017.', v: 1.017, tol: .0006, w: 30 },
      { t: 'Exprimer Cₙ en fonction de n, puis calculer C₁₀ au centime.', comp: 'rea', pts: 1.5, a: 'Cₙ = 2 000 × 1,017ⁿ ; C₁₀ ≈ 2 367,22 €', v: rnd(C(10)), tol: .006, w: 30 },
      { t: 'Avec un tableur, déterminer au bout de combien d’années le capital dépasse 2 300 €.', comp: 'rea', pts: 2, appel: 'Montre ta feuille de calcul : la colonne des années, la formule recopiée (=B2*1,017) et la ligne où le capital dépasse 2 300 €.', a: '9 ans : C₈ ≈ 2 288,75 € et C₉ ≈ 2 327,65 €', v: 9, tol: .01, w: 24 }] },
    { t: 'Racheter une trottinette', intro: `<p>Un magasin d’occasion estime qu’une trottinette électrique vendue ${H('450 €')} neuve perd ${H('12 % de sa valeur')} chaque année. On note vₙ sa valeur au bout de n années : v₀ = 450.</p>`, qs: [
      { t: 'Donner la raison de la suite géométrique (vₙ).', comp: 'app', pts: 1, a: '1 − 0,12 = 0,88', v: .88, tol: .0006, w: 24 },
      { t: 'La suite (vₙ) est-elle croissante ou décroissante ? Justifier.', comp: 'val', pts: 1, a: 'Décroissante : v₀ > 0 et la raison 0,88 est comprise entre 0 et 1.', v: null, lines: 2 },
      { t: 'Calculer v₃ au centime.', comp: 'rea', pts: 1, a: '450 × 0,88³ ≈ 306,66 €', v: rnd(v(3)), tol: .006, w: 30 },
      { t: 'Le magasin reprend la trottinette de 3 ans à 60 % de v₃. Annoncer ce prix au client par une phrase.', comp: 'com', pts: 1, a: '0,6 × 306,66 ≈ 184 € : « Nous pouvons vous la reprendre 184 €. »', v: null, lines: 2 }] }] };
}

/* ---------- chapitre 2 · calculs financiers ---------- */
{
  const C = n => 5000 * Math.pow(1.025, n);
  doc.c2 = `<div class="evdoc">${tab(['Épargne réglementée au 1er août 2026', 'Taux annuel', 'Plafond'], [['Livret A', '1,7 %', '22 950 €'], ['LEP', '2,5 %', '10 000 €']])}<p class="srcl">Source : info.gouv.fr (31 juillet 2026). Intérêts ajoutés au capital une fois par an. On suppose que le taux ne change pas.</p></div>`;
  E.c2 = { lieu: 'Agence bancaire', duree: '45 min', grille: GR.c2, exos: [
    { t: 'Un placement sur un LEP', intro: `<p>Maël place ${H('5 000 €')} sur un LEP, en intérêts composés.</p>`, qs: [
      { t: 'Calculer le capital acquis au bout de 3 ans, au centime.', comp: 'rea', pts: 1.5, a: '5 000 × 1,025³ ≈ 5 384,45 €', v: rnd(C(3)), tol: .006, w: 30 },
      { t: 'Avec un tableur, déterminer le nombre d’années nécessaire pour dépasser 5 500 €.', comp: 'ana', pts: 1.5, appel: 'Montre ta feuille de calcul : les années, la formule recopiée (=B2*1,025) et la première année où le capital dépasse 5 500 €.', a: '4 ans : C₃ ≈ 5 384,45 € et C₄ ≈ 5 519,06 €', v: 4, tol: .01, w: 24 },
      { t: 'Calculer le taux mensuel équivalent à 2,5 % par an, en %, au millième.', comp: 'rea', pts: 1, a: '1,025^(1/12) − 1 ≈ 0,206 %', v: .206, tol: .0006, w: 24 }] },
    { t: 'Un crédit pour une moto', intro: `<p>Maël emprunte ${H('8 000 €')} sur ${H('4 ans')} au taux annuel de ${H('6 %')}, à amortissement constant. Au 1er octobre 2026, le taux d’usure des prêts personnels de plus de 6 000 € est de 8,56 % (Banque de France).</p>`, qs: [
      { t: 'Calculer l’amortissement annuel.', comp: 'app', pts: 1, a: '8 000 ÷ 4 = 2 000 €', v: 2000, tol: .006, w: 24 },
      { t: 'Calculer les intérêts et l’annuité de la première année.', comp: 'rea', pts: 1.5, a: '8 000 × 0,06 = 480 € ; annuité 2 480 €', v: 2480, tol: .006, lab: 'annuité :', w: 24 },
      { t: 'Calculer le capital restant dû au début de l’année 2, puis les intérêts de l’année 2.', comp: 'rea', pts: 1, a: '6 000 € ; 6 000 × 0,06 = 360 €', v: 360, tol: .006, lab: 'intérêts :', w: 24 },
      { t: 'Calculer le coût total de l’emprunt.', comp: 'rea', pts: 1.5, a: '480 + 360 + 240 + 120 = 1 200 €', v: 1200, tol: .006, w: 24 },
      { t: 'Ce crédit respecte-t-il le taux d’usure ? Répondre au client par une phrase.', comp: 'val', pts: 1, a: 'Oui : 6 % est inférieur à 8,56 %. Le crédit vous coûtera 1 200 € d’intérêts.', v: null, lines: 2 }] }] };
}

/* ---------- chapitre 3 · polynômes de degré 3 ---------- */
{
  const B = x => -(x ** 3) + 12 * x * x - 21 * x + 5;
  const g = MCVP.plot({ W: 600, H: 250, x: [0, 10, 1], y: [-20, 120, 20], ml: 50, mt: 16, mb: 30, zeroAxes: true, xl: 'x (centaines)', yl: 'B(x) (centaines d’€)', lab: 'Courbe du bénéfice B' });
  const docB = `<div class="evdoc"><div class="wfig">${g.wrap(g.base + g.curve(B, { stroke: MCVP.ORG, w: 3 }))}</div><p class="srcl">Bénéfice mensuel B(x), en centaines d’euros, pour x centaines de bougies vendues, x dans [0 ; 10]. Entreprise fictive.</p></div>`;
  E.c3 = { lieu: 'Atelier de bougies', duree: '45 min', grille: GR.c3, exos: [
    { t: 'Des boîtes cubiques', intro: `<p>Une boîte cubique d’arête x décimètres contient ${H('x³ litres')}.</p>`, qs: [
      { t: 'Calculer la contenance d’une boîte d’arête 1,5 dm.', comp: 'app', pts: 1, a: '1,5³ = 3,375 L', v: 3.375, tol: .0006, w: 24 },
      { t: 'Donner la dérivée de f(x) = x³. Justifier que f est croissante.', comp: 'rea', pts: 1.5, a: 'f′(x) = 3x² ≥ 0 : f est croissante', v: null, lines: 2 }] },
    { t: 'Le bénéfice d’un atelier', intro: `${docB}<p>Le bénéfice de l’atelier est ${H('B(x) = − x³ + 12x² − 21x + 5')} (courbe ci-dessus).</p>`, qs: [
      { t: 'Calculer B′(x).', comp: 'rea', pts: 1.5, a: 'B′(x) = − 3x² + 24x − 21', v: null, lines: 1 },
      { t: 'Vérifier que B′(x) = − 3(x − 1)(x − 7), puis dresser le tableau de variations de B sur [0 ; 10].', comp: 'ana', pts: 2, a: 'B décroît sur [0 ; 1], croît sur [1 ; 7], décroît sur [7 ; 10] ; B(1) = − 5, B(7) = 103', v: null, lines: 3 },
      { t: 'Donner le bénéfice maximal, en euros, et la quantité correspondante.', comp: 'com', pts: 1, a: '10 300 € pour 700 bougies', v: 10300, tol: .01, w: 26 },
      { t: 'Avec GeoGebra, déterminer combien de quantités donnent un bénéfice de 5 000 €, et leurs valeurs approchées au centième.', comp: 'val', pts: 3, appel: 'Montre la courbe de B dans GeoGebra, la droite y = 50 et les points d’intersection que tu as obtenus.', a: '2 solutions : x ≈ 4,04 et x ≈ 9,18', v: 2, tol: .01, lab: 'nombre de solutions :', w: 20 }] }] };
}

/* ---------- chapitre 4 · exponentielles et logarithme ---------- */
{
  const L10 = Math.log10;
  doc.c4 = `<div class="evdoc">${tab(['Livret A', 'Information'], [['Taux annuel depuis le 1er août 2026', '1,7 %'], ['Versement des intérêts', 'une fois par an, ajoutés au capital']])}<p class="srcl">Source : info.gouv.fr (31 juillet 2026). On suppose que le taux ne change pas.</p></div>`;
  E.c4 = { lieu: 'Agence bancaire', duree: '45 min', grille: GR.c4, exos: [
    { t: 'Doubler son épargne', intro: `<p>Noé place ${H('3 000 €')} sur un Livret A. Au bout de x années, son capital vaut C(x) = 3 000 × 1,017ˣ.</p>`, qs: [
      { t: 'Calculer C(5), au centime.', comp: 'app', pts: 1, a: '3 000 × 1,017⁵ ≈ 3 263,82 €', v: 3263.82, tol: .006, w: 28 },
      { t: 'Résoudre 1,017ˣ = 2 par le calcul. Arrondir au centième.', comp: 'rea', pts: 2, a: 'x = log(2) ÷ log(1,017) ≈ 41,12', v: rnd(L10(2) / L10(1.017)), tol: .006, w: 22 },
      { t: 'Avec un tableur, vérifier le nombre d’années entières nécessaires pour doubler le capital.', comp: 'val', pts: 2, appel: 'Montre ta feuille de calcul : la colonne des années, la formule =3000*1,017^A2 recopiée, et la première ligne où le capital atteint 6 000 €.', a: '42 ans : C(41) ≈ 5 987,98 € et C(42) ≈ 6 089,78 €', v: 42, tol: .01, w: 20 },
      { t: 'Annoncer la réponse à Noé par une phrase.', comp: 'com', pts: 1, a: '« Si le taux reste à 1,7 %, votre capital aura doublé au bout de 42 ans. »', v: null, lines: 2 }] },
    { t: 'Le logarithme au service des calculs', intro: '<p>Sans tableur cette fois.</p>', qs: [
      { t: 'Donner log(10 000) et log(0,001).', comp: 'app', pts: 1, a: '4 et − 3', v: null, lines: 1 },
      { t: 'Résoudre log(x) = 1,5. Arrondir au centième.', comp: 'rea', pts: 1, a: 'x = 10^1,5 ≈ 31,62', v: 31.62, tol: .006, w: 22 },
      { t: 'Résoudre l’inéquation 0,8ˣ ≤ 0,25, puis donner le plus petit entier solution.', comp: 'ana', pts: 2, a: 'log(0,8) < 0 : x ≥ log(0,25) ÷ log(0,8) ≈ 6,21, donc 7', v: 7, tol: .01, w: 20 }] }] };
  chk0.push(Math.round(3000 * Math.pow(1.017, 41) * 100) / 100 === 5987.98 && Math.round(3000 * Math.pow(1.017, 42) * 100) / 100 === 6089.78);
}

/* ---------- chapitre 5 · statistique à deux variables ---------- */
{
  const D = [[0, 12.0], [1, 13.9], [2, 16.1], [3, 18.4], [4, 21.5], [5, 24.6], [6, 28.6]], fl = MCVP.fit(D), fz = MCVP.fit(D.map(([x, y]) => [x, Math.log10(y)]));
  chk0.push(rnd(fl.r2, 3) === .984 && rnd(fz.r2, 4) === .9998 && rnd(fz.a, 4) === .0626 && rnd(fz.b, 4) === 1.0798 && rnd(Math.pow(10, .0626), 3) === 1.155 && rnd(Math.pow(10, 1.0798), 2) === 12.02 && rnd(12.02 * Math.pow(1.155, 9), 1) === 44.0);
  const g = MCVP.plot({ W: 600, H: 230, x: [0, 7, 1], y: [0, 30, 5], ml: 46, mt: 14, mb: 30, xl: 'mois x', yl: 'CA (k€)', fine: true, lab: 'Nuage du chiffre d’affaires mensuel' });
  doc.c5 = `<div class="evdoc">${tab(['Mois x', ...D.map(p => String(p[0]))], [['Chiffre d’affaires y (k€)', ...D.map(p => K.MCVG.fr(p[1], 1))]], 'dt-c')}<div class="wfig">${g.wrap(g.base + g.pts(D, { r: 5 }))}</div><p class="srcl">Chiffre d’affaires mensuel d’une boutique en ligne qui démarre. Entreprise fictive.</p></div>`;
  E.c5 = { lieu: 'Boutique en ligne', duree: '45 min', grille: GR.c5, exos: [
    { t: 'Prévoir le chiffre d’affaires', intro: '<p>La gérante veut prévoir le chiffre d’affaires des prochains mois.</p>', qs: [
      { t: 'Décrire la forme du nuage de points.', comp: 'app', pts: 1, a: 'Les points montent de plus en plus vite : forme exponentielle.', v: null, lines: 2 },
      { t: 'Avec le tableur, afficher une courbe de tendance affine puis exponentielle, avec R². Quel modèle choisir ?', comp: 'ana', pts: 2.5, appel: 'Montre le graphique du tableur avec les deux courbes de tendance, leurs équations et leurs R².', a: 'Affine : R² ≈ 0,984 ; exponentielle : R² ≈ 0,9998. On choisit l’exponentielle.', v: null, lines: 2 },
      { t: 'Avec z = log(y), le tableur donne z = 0,0626x + 1,0798. En déduire q = 10^0,0626 au millième.', comp: 'rea', pts: 2, a: 'q ≈ 1,155 et k = 10^1,0798 ≈ 12,02 : y ≈ 12,02 × 1,155ˣ', v: 1.155, tol: .0006, w: 22 },
      { t: 'Prévoir le chiffre d’affaires du mois 9, au dixième de k€.', comp: 'rea', pts: 1.5, a: '12,02 × 1,155⁹ ≈ 44,0 k€', v: 44, tol: .06, w: 22 },
      { t: 'Cette prévision est-elle une interpolation ou une extrapolation ? Justifier.', comp: 'val', pts: 1, a: 'Une extrapolation : le mois 9 est en dehors des mois 0 à 6.', v: null, lines: 1 },
      { t: 'Rédiger une phrase pour la gérante, avec une réserve.', comp: 'com', pts: 2, a: '« Si la croissance continue au même rythme (+ 15,5 % par mois), le CA du mois 9 serait d’environ 44 000 €. C’est une estimation : la tendance peut ralentir. »', v: null, lines: 3 }] }] };
}

/* ---------- chapitre 6 · probabilités ---------- */
{
  chk0.push(rnd(.35 * .4, 4) === .14 && rnd(.65 * .1, 4) === .065 && rnd(.14 + .065, 4) === .205 && rnd(.14 / .205, 3) === .683 && rnd(.35 * .205, 5) === .07175);
  doc.c6 = `<div class="evdoc">${tab(['Commandes en ligne (enseigne fictive)', 'Part des commandes', 'Achat d’un article en plus'], [['Retrait en magasin (M)', '35 %', '40 % des clients M'], ['Livraison à domicile (L)', '65 %', '10 % des clients L, après relance']])}</div>`;
  E.c6 = { lieu: 'Magasin avec retrait de commandes', duree: '45 min', grille: GR.c6, exos: [
    { t: 'Le retrait en magasin', intro: `<p>Dans une enseigne (entreprise fictive), ${H('35 %')} des commandes en ligne sont retirées en magasin (M) ; les autres sont livrées à domicile (L). Parmi les clients qui retirent en magasin, ${H('40 %')} achètent un article en plus (A). Parmi les clients livrés, ${H('10 %')} achètent un article en plus après une relance par courriel.</p>`, qs: [
      { t: 'Construire l’arbre pondéré de la situation.', comp: 'app', pts: 1.5, a: 'M (0,35) : A 0,4, Ā 0,6 ; L (0,65) : A 0,1, Ā 0,9', v: null, lines: 3 },
      { t: 'Calculer P(M ∩ A).', comp: 'rea', pts: 1, a: '0,35 × 0,4 = 0,14', v: .14, tol: .0006, w: 22 },
      { t: 'Calculer P(A), la probabilité qu’un client achète un article en plus.', comp: 'ana', pts: 1.5, a: '0,14 + 0,65 × 0,1 = 0,205', v: .205, tol: .0006, w: 22 },
      { t: 'Avec un tableur, simuler 1 000 commandes et calculer la fréquence des achats en plus. La comparer à P(A).', comp: 'val', pts: 2, appel: 'Montre ta simulation : colonne A =SI(ALEA()<0,35;1;0) (1 = retrait), colonne B =SI(A2=1;SI(ALEA()<0,4;1;0);SI(ALEA()<0,1;1;0)), puis =MOYENNE(B2:B1001).', a: 'Une fréquence proche de 0,205 (par exemple entre 0,18 et 0,23) : elle fluctue autour de la probabilité.', v: null, lines: 2 },
      { t: 'Un client a acheté un article en plus. Calculer la probabilité qu’il ait retiré sa commande en magasin, au millième.', comp: 'rea', pts: 1.5, a: '0,14 ÷ 0,205 ≈ 0,683', v: .683, tol: .0006, w: 22 },
      { t: 'Les évènements M et A sont-ils indépendants ? Expliquer au responsable ce que cela signifie pour le magasin.', comp: 'com', pts: 2.5, a: 'P(M) × P(A) = 0,35 × 0,205 ≈ 0,072 ≠ 0,14 : pas indépendants. Les clients qui viennent en magasin achètent plus souvent un article en plus : il faut encourager le retrait en magasin.', v: null, lines: 3 }] }] };
}

/* ---------- chapitre 7 · exponentielle et logarithme népérien (poursuite d’études) ---------- */
{
  chk0.push(rnd(5000 * Math.exp(.02 * 10)) === 6107.01 && rnd(100 * Math.exp(.02 * 10)) === 122.14 && rnd(Math.log(2) / .02, 2) === 34.66 && rnd(5000 * Math.exp(.02 * 35)) === 10068.76);
  const g = MCVP.plot({ W: 600, H: 220, x: [0, 40, 5], y: [4000, 12000, 2000], ml: 60, mt: 14, mb: 30, xl: 't (années)', yl: 'capital (€)', lab: 'Capital placé en continu' });
  doc.c7 = `<div class="evdoc"><div class="wfig">${g.wrap(g.base + g.curve(x => 5000 * Math.exp(.02 * x), { stroke: MCVP.GRN, w: 3 }))}</div><p class="srcl">Capital C(t) = 5 000 e^(0,02t) d’un placement fictif à intérêts versés en continu. L’axe vertical commence à 4 000 €.</p></div>`;
  E.c7 = { lieu: 'Banque (préparation au BTS)', duree: '45 min', grille: GR.c7, exos: [
    { t: 'Un placement en continu', intro: '<p>On place 5 000 € à intérêts versés en continu, au taux de 2 % : C(t) = 5 000 e^(0,02t).</p>', qs: [
      { t: 'Calculer C(10), au centime.', comp: 'app', pts: 1.5, a: '5 000 e^0,2 ≈ 6 107,01 €', v: 6107.01, tol: .006, w: 26 },
      { t: 'Calculer C′(t), puis C′(10) au centime.', comp: 'rea', pts: 2, a: 'C′(t) = 100 e^(0,02t) ; C′(10) ≈ 122,14 € par an', v: 122.14, tol: .006, w: 24 },
      { t: 'Résoudre C(t) = 10 000. Arrondir au centième.', comp: 'ana', pts: 2.5, a: 'e^(0,02t) = 2 ; t = ln(2) ÷ 0,02 ≈ 34,66 ans', v: 34.66, tol: .006, w: 22 },
      { t: 'Avec un tableur ou la calculatrice, vérifier que le capital dépasse 10 000 € au bout de 35 ans.', comp: 'val', pts: 2, appel: 'Montre ton calcul de C(34) et C(35), ou la feuille de calcul qui donne C(t) année par année.', a: 'C(34) ≈ 9 869,39 € et C(35) ≈ 10 068,76 € ✓', v: null, lines: 2 },
      { t: 'Expliquer à un client ce que signifie ce résultat.', comp: 'com', pts: 2, a: '« À 2 % en continu, votre capital double en un peu moins de 35 ans. »', v: null, lines: 2 }] }] };
}

/* vérification du format CCF : 45 min, 10 points, 1 ou 2 exercices, au moins un appel */
module.exports = (chk, extra = {}) => {
  Object.assign(E, extra);
  chk(chk0.every(Boolean), 'S’évaluer : contrôles de calcul');
  for (const [id, e] of Object.entries(E)) {
    if (doc[id] && !e.exos[0].intro.startsWith(doc[id])) e.exos[0].intro = doc[id] + (e.exos[0].intro || '');
    const n = e.exos.reduce((a, x) => a + x.qs.length, 0), pts = e.exos.reduce((a, x) => a + x.qs.reduce((b, q) => b + q.pts, 0), 0), app = e.exos.reduce((a, x) => a + x.qs.filter(q => q.appel).length, 0);
    chk(e.duree === '45 min' && e.exos.length >= 1 && e.exos.length <= 2 && n >= 5 && n <= 10 && Math.abs(pts - 10) < 1e-9 && app >= 1, `S’évaluer ${id} : ${e.exos.length} exercice(s), ${n} questions, ${pts} points, ${app} appel(s)`);
  }
  return E;
};
module.exports.GR = GR; module.exports.doc = doc; module.exports.E = E;
