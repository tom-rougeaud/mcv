/* Terminale — trois sujets complets de CCF (contrôle en cours de formation), mathématiques, groupement sans physique-chimie.
   Format de l’arrêté du 17 juin 2020 : 45 minutes, noté sur 10, un ou deux exercices aux questions de plus en plus approfondies,
   au moins une question « appel » résolue devant l’examinateur avec un outil numérique.
   La deuxième situation d’évaluation porte sur les programmes de 1re et de terminale : chaque sujet mêle les deux.
   Les entreprises sont fictives ; les données réelles sont sourcées. */
'use strict';
const K = require('./kitT');
const { rnd, H, tab, MCVP } = K;
const { fr } = K.MCVG;

module.exports = function (chk) {
  const S = [];

  /* ---------- Sujet A · la box « Éclat » : suites géométriques et probabilités ---------- */
  {
    const u = n => 2000 * Math.pow(1.08, n); let sum = 0; for (let n = 0; n < 12; n++) sum += u(n);
    chk(Math.round(u(2)) === 2333 && Math.round(u(3)) === 2519 && Math.round(u(4)) === 2721 && Math.round(u(11)) === 4663 && Math.round(sum) === 37954, 'CCF A suites');
    chk(316 / 400 === .79 && 204 / 240 === .85 && 112 / 160 === .7 && rnd(.6 * .79, 3) === .474 && 204 / 400 === .51, 'CCF A probabilités');
    S.push({ id: 'A', titre: 'La box « Éclat »', lieu: 'Service client d’une box beauté par abonnement', sit: 'Situation d’évaluation n° 1 ou n° 2', prog: ['Suites géométriques, terme de rang n, somme des premiers termes (terminale)', 'Tableau croisé, probabilité conditionnelle (1re) ; arbre pondéré, indépendance (terminale)'],
      contexte: `<p>Inès est en stage chez « Éclat », une box beauté envoyée chaque mois à ses abonnées (entreprise fictive). La responsable lui confie deux missions : prévoir les envois de l’année, puis analyser une enquête de satisfaction.</p>`,
      exos: [
        { t: 'Prévoir les envois de l’année', intro: `${tab(['Mois', 'janvier', 'février', 'mars', 'avril', 'mai'], [['Rang n', '0', '1', '2', '3', '4'], ['Abonnées uₙ', '2 000', '2 160', '2 333', '2 519', '2 721']], 'dt-c')}<p class="srcl">Nombre d’abonnées au premier jour de chaque mois.</p>`, qs: [
          { t: 'Calculer le quotient 2 160 ÷ 2 000.', comp: 'app', pts: .5, a: '1,08', v: 1.08, tol: .0006, w: 20 },
          { t: 'Justifier que l’on peut modéliser le nombre d’abonnées par une suite géométrique. Donner son premier terme et sa raison.', comp: 'ana', pts: 1, a: 'Les quotients successifs valent environ 1,08 : suite géométrique de premier terme u₀ = 2 000 et de raison q = 1,08 (+ 8 % par mois).', v: null, lines: 2 },
          { t: 'Calculer u₁₁, le nombre d’abonnées prévu en décembre, arrondi à l’unité.', comp: 'rea', pts: 1, a: '2 000 × 1,08¹¹ ≈ 4 663', v: 4663, tol: .6, w: 22 },
          { t: 'Avec un tableur, calculer le nombre total de box envoyées de janvier à décembre (une box par abonnée et par mois).', comp: 'rea', pts: 1.5, appel: 'Montre la colonne des abonnées (=B2*1,08 recopiée de janvier à décembre) et la cellule =SOMME(B2:B13).', a: 'u₀ + u₁ + … + u₁₁ ≈ 37 954 box', v: 37954, tol: .6, w: 24 },
          { t: 'Le service logistique peut préparer 40 000 box sur l’année. Est-ce suffisant ? Justifier.', comp: 'val', pts: 1, a: 'Oui : 37 954 < 40 000, il reste une marge d’environ 2 000 box.', v: null, lines: 2 }] },
        { t: 'Une enquête de satisfaction', intro: `${tab(['', 'Satisfaite (S)', 'Pas satisfaite', 'Total'], [['Abonnée depuis plus de 6 mois (A)', '204', '36', '240'], ['Abonnée depuis 6 mois ou moins', '112', '48', '160'], ['Total', '316', '84', '400']], 'dt-c')}<p class="srcl">Enquête auprès de 400 abonnées. On choisit une abonnée au hasard.</p>`, qs: [
          { t: 'Calculer la probabilité que l’abonnée soit satisfaite.', comp: 'app', pts: 1, a: '316 ÷ 400 = 0,79', v: .79, tol: .0006, w: 20 },
          { t: 'Calculer la probabilité qu’elle soit satisfaite, sachant qu’elle est abonnée depuis plus de 6 mois.', comp: 'rea', pts: 1, a: 'probabilité de S sachant A : 204 ÷ 240 = 0,85', v: .85, tol: .0006, w: 20 },
          { t: 'Construire l’arbre pondéré de la situation (A, puis S).', comp: 'rea', pts: 1, a: 'A : 0,6 (S : 0,85 ; S̄ : 0,15) ; Ā : 0,4 (S : 0,7 ; S̄ : 0,3)', v: null, lines: 3 },
          { t: 'Les évènements A et S sont-ils indépendants ? Justifier.', comp: 'val', pts: 1, a: 'P(A) × P(S) = 0,6 × 0,79 = 0,474 ≠ P(A ∩ S) = 0,51 : pas indépendants.', v: null, lines: 2 },
          { t: 'Proposer, en une phrase, une action à la responsable.', comp: 'com', pts: 1, a: 'Les nouvelles abonnées sont moins satisfaites (70 % contre 85 %) : soigner leurs premières box, par exemple avec un message d’accueil.', v: null, lines: 2 }] }] });
  }

  /* ---------- Sujet B · le magasin « Cap Glisse » : polynôme de degré 3 et emprunt ---------- */
  {
    const B = x => -(x ** 3) + 18 * x * x - 60 * x - 40, a = rnd(12000 * .045 / (1 - Math.pow(1.045, -3)), 2);
    chk(B(0) === -40 && B(2) === -96 && B(10) === 160 && B(12) === 104 && B(5.32) < 0 && B(5.34) > 0, 'CCF B bénéfice');
    chk(a === 4365.28 && rnd(12000 * .045, 2) === 540 && rnd(a - 540, 2) === 3825.28 && rnd(12000 - 3825.28, 2) === 8174.72 && rnd(8174.72 * .045, 2) === 367.86 && rnd(3 * a - 12000, 2) === 1095.84 && rnd((Math.pow(1.045, 1 / 12) - 1) * 100, 3) === .367, 'CCF B emprunt');
    const g = MCVP.plot({ W: 600, H: 250, x: [0, 12, 1], y: [-100, 200, 50], ml: 50, mt: 14, mb: 30, zeroAxes: true, xl: 'x (dizaines de paddles)', yl: 'B(x) (centaines d’€)', lab: 'Courbe du bénéfice B' });
    S.push({ id: 'B', titre: 'Le magasin « Cap Glisse »', lieu: 'Magasin de sports nautiques', sit: 'Situation d’évaluation n° 2', prog: ['Fonction polynôme de degré 3 : dérivée, tableau de variations, résolution de f(x) = c (terminale)', 'Emprunt à annuités constantes, tableau d’amortissement, coût, taux mensuel équivalent (terminale)', 'Dérivée et signe d’un polynôme de degré 2 (1re)'],
      contexte: `<p>Léo est vendeur au magasin « Cap Glisse » (entreprise fictive), qui vend des planches de stand up paddle. Le gérant lui demande d’étudier le bénéfice de la saison, puis le financement du stock.</p>`,
      exos: [
        { t: 'Le bénéfice de la saison', intro: `<div class="wfig">${g.wrap(g.base + g.curve(B, { stroke: MCVP.ORG, w: 3 }))}</div><p>Le bénéfice de la saison, en centaines d’euros, pour x dizaines de paddles vendus (x dans [0 ; 12]), est ${H('B(x) = − x³ + 18x² − 60x − 40')}.</p>`, qs: [
          { t: 'Calculer B(0). Interpréter ce résultat.', comp: 'app', pts: .5, a: 'B(0) = − 40 : sans vente, le magasin perd 4 000 € (charges fixes).', v: -40, tol: .01, w: 20 },
          { t: 'Calculer B′(x).', comp: 'rea', pts: 1, a: 'B′(x) = − 3x² + 36x − 60', v: null, lines: 1 },
          { t: 'Vérifier que B′(x) = − 3(x − 2)(x − 10), puis dresser le tableau de variations de B sur [0 ; 12].', comp: 'ana', pts: 1.5, a: 'B décroît sur [0 ; 2], croît sur [2 ; 10], décroît sur [10 ; 12] ; B(2) = − 96, B(10) = 160, B(12) = 104.', v: null, lines: 3 },
          { t: 'Donner le bénéfice maximal, en euros, et le nombre de paddles correspondant.', comp: 'com', pts: 1, a: '16 000 € pour 100 paddles', v: 16000, tol: .01, w: 22 },
          { t: 'Avec GeoGebra, déterminer à partir de combien de paddles vendus la saison est rentable (B(x) ≥ 0).', comp: 'val', pts: 1.5, appel: 'Montre la courbe de B dans GeoGebra, le point d’intersection avec l’axe des abscisses et la valeur lue.', a: 'B(x) ≥ 0 pour x ≥ 5,33 environ : à partir de 54 paddles.', v: 54, tol: .6, lab: 'nombre de paddles :', w: 20 }] },
        { t: 'Financer le stock', intro: `<p>Pour acheter le stock, le gérant emprunte ${H('12 000 €')} sur ${H('3 ans')} au taux annuel de ${H('4,5 %')}, à annuités constantes : a = C × t ÷ (1 − (1 + t)⁻ⁿ).</p>`, qs: [
          { t: 'Calculer l’annuité, au centime.', comp: 'rea', pts: 1, a: '12 000 × 0,045 ÷ (1 − 1,045⁻³) ≈ 4 365,28 €', v: 4365.28, tol: .006, w: 24 },
          { t: 'Compléter les deux premières lignes du tableau d’amortissement (capital dû, intérêts, amortissement, annuité).', comp: 'rea', pts: 1.5, a: 'Année 1 : 12 000 ; 540 ; 3 825,28 ; 4 365,28. Année 2 : 8 174,72 ; 367,86 ; 3 997,42 ; 4 365,28.', v: null, lines: 3 },
          { t: 'Calculer le coût total de l’emprunt.', comp: 'rea', pts: 1, a: '3 × 4 365,28 − 12 000 = 1 095,84 €', v: 1095.84, tol: .006, w: 24 },
          { t: 'Calculer le taux mensuel équivalent à 4,5 % par an, en %, au millième.', comp: 'ana', pts: 1, a: '1,045^(1/12) − 1 ≈ 0,367 %', v: .367, tol: .0006, w: 20 }] }] });
  }

  /* ---------- Sujet C · le centre de contacts « Allô Conseil » : statistique et probabilités ---------- */
  {
    const D = [[1, 1200], [2, 1450], [3, 1760], [4, 2120], [5, 2580], [6, 3100]], fl = MCVP.fit(D), fz = MCVP.fit(D.map(([x, y]) => [x, Math.log10(y)]));
    chk(rnd(fl.r2, 4) === .9822 && rnd(fz.r2, 4) === .9999 && rnd(fz.a, 4) === .0826 && rnd(fz.b, 4) === 2.9966 && rnd(Math.pow(10, .0826), 3) === 1.209 && rnd(Math.pow(10, 2.9966), 1) === 992.2, 'CCF C ajustement');
    chk(rnd(992.2 * Math.pow(1.209, 9), 0) === 5476 && rnd(Math.log10(6000 / 992.2) / Math.log10(1.209), 2) === 9.48, 'CCF C prévisions');
    chk(rnd(.7 * .75 + .3 * .9, 3) === .795 && rnd(.27 / .795, 3) === .34 && rnd(.3 * .795, 4) === .2385, 'CCF C probabilités');
    const g = MCVP.plot({ W: 600, H: 230, x: [0, 7, 1], y: [0, 3500, 500], ml: 56, mt: 14, mb: 30, xl: 'mois x', yl: 'messages', fine: true, lab: 'Nuage des messages reçus sur le chat' });
    S.push({ id: 'C', titre: 'Le centre de contacts « Allô Conseil »', lieu: 'Centre de relation client', sit: 'Situation d’évaluation n° 2', prog: ['Statistique à deux variables : choix d’un modèle, R², changement de variable z = log y, extrapolation (terminale)', 'Logarithme décimal : résolution de qˣ = a (terminale)', 'Arbre pondéré, probabilités totales, probabilité conditionnelle, indépendance (terminale) ; probabilité d’un évènement (1re)'],
      contexte: `<p>Sami travaille au centre de contacts « Allô Conseil » (entreprise fictive), qui répond aux clients par chat et par téléphone. Le responsable veut anticiper l’activité du chat et mesurer la qualité des réponses.</p>`,
      exos: [
        { t: 'L’activité du chat', intro: `${tab(['Mois x', '1', '2', '3', '4', '5', '6'], [['Messages y', '1 200', '1 450', '1 760', '2 120', '2 580', '3 100']], 'dt-c')}<div class="wfig">${g.wrap(g.base + g.pts(D, { r: 5 }))}</div>`, qs: [
          { t: 'Décrire l’allure du nuage de points.', comp: 'app', pts: .5, a: 'Les points montent de plus en plus vite : allure exponentielle.', v: null, lines: 1 },
          { t: 'Avec un tableur, afficher une courbe de tendance affine puis exponentielle, avec leur R². Quel modèle choisir ?', comp: 'ana', pts: 1.5, appel: 'Montre le graphique du tableur avec les deux courbes de tendance, leurs équations et leurs coefficients de détermination.', a: 'Affine : R² ≈ 0,982 ; exponentielle : R² ≈ 0,9999. On choisit l’exponentielle.', v: null, lines: 2 },
          { t: 'Avec z = log(y), le tableur donne z = 0,0826x + 2,9966. En déduire q = 10^0,0826 (au millième) et k = 10^2,9966 (au dixième).', comp: 'rea', pts: 1.5, a: 'q ≈ 1,209 et k ≈ 992,2 : y ≈ 992,2 × 1,209ˣ', v: 1.209, tol: .0006, lab: 'q =', w: 20 },
          { t: 'Prévoir le nombre de messages au mois 9, arrondi à l’unité.', comp: 'rea', pts: 1, a: '992,2 × 1,209⁹ ≈ 5 476 messages', v: 5476, tol: 1.01, w: 22 },
          { t: 'L’équipe actuelle traite au plus 6 000 messages par mois. Résoudre 992,2 × 1,209ˣ ≥ 6 000 et indiquer à partir de quel mois il faudra renforcer l’équipe.', comp: 'ana', pts: 1, a: 'x ≥ log(6 000 ÷ 992,2) ÷ log(1,209) ≈ 9,48 : à partir du mois 10.', v: 10, tol: .01, lab: 'mois :', w: 18 }] },
        { t: 'La qualité des réponses', intro: `<p>${H('70 %')} des demandes arrivent par chat (C), les autres par téléphone (T). La demande est résolue au premier contact (S) dans ${H('75 %')} des cas par chat et dans ${H('90 %')} des cas par téléphone. On choisit une demande au hasard.</p>`, qs: [
          { t: 'Construire l’arbre pondéré de la situation.', comp: 'app', pts: 1, a: 'C : 0,7 (S : 0,75 ; S̄ : 0,25) ; T : 0,3 (S : 0,9 ; S̄ : 0,1)', v: null, lines: 3 },
          { t: 'Calculer la probabilité que la demande soit résolue au premier contact.', comp: 'rea', pts: 1, a: '0,7 × 0,75 + 0,3 × 0,9 = 0,525 + 0,27 = 0,795', v: .795, tol: .0006, w: 20 },
          { t: 'La demande a été résolue au premier contact. Calculer la probabilité qu’elle soit arrivée par téléphone, au centième.', comp: 'rea', pts: 1, a: '0,27 ÷ 0,795 ≈ 0,34', v: .34, tol: .006, w: 20 },
          { t: 'Les évènements T et S sont-ils indépendants ? Rédiger une conclusion pour le responsable.', comp: 'com', pts: 1.5, a: 'P(T) × P(S) = 0,3 × 0,795 ≈ 0,239 ≠ 0,27 : pas indépendants. Le téléphone résout plus souvent au premier contact : former l’équipe du chat.', v: null, lines: 3 }] }] });
  }

  /* contrôle du format : 45 min, 10 points, 1 ou 2 exercices, au moins un appel */
  S.forEach(s => { s.duree = '45 min'; const n = s.exos.reduce((a, x) => a + x.qs.length, 0), pts = s.exos.reduce((a, x) => a + x.qs.reduce((b, q) => b + q.pts, 0), 0), app = s.exos.reduce((a, x) => a + x.qs.filter(q => q.appel).length, 0);
    chk(s.exos.length <= 2 && Math.abs(pts - 10) < 1e-9 && app >= 1, `CCF ${s.id} : ${n} questions, ${pts} points, ${app} appel(s)`);
    s.grille = { app: 'Je relève les informations utiles dans les documents.', ana: 'Je choisis une méthode, un modèle ou un outil adapté.', rea: 'Je mène les calculs et j’utilise les outils numériques.', val: 'Je contrôle la vraisemblance d’un résultat et je le critique.', com: 'Je rends compte par des phrases claires, avec les unités.' }; });
  return S;
};
