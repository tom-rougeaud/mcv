/* 1re — « De la 2de à la 1re » : ce que chaque chapitre reprend du manuel de 2de et ce qu’il approfondit.
   de   : chapitres de 2de mobilisés (numéro, titre exact du manuel de 2de, ce que l’élève y a appris)
   plus : ce que l’élève approfondit en 1re (tutoiement)
   fil  : une phrase de synthèse (page d’ouverture du manuel)
   reac : automatismes de 2de à réactiver (version professeur)
   vig  : points de vigilance (version professeur) */
'use strict';
const T2 = { 1: 'Prix, marges et TVA', 2: 'Statistique à une variable', 3: 'Problèmes du premier degré', 4: 'Factures, réductions et intérêts', 5: 'Fonctions', 6: 'Fluctuation et probabilités', 7: 'Géométrie', 8: 'Croisement de deux variables' };
const d = (n, sais) => ({ n, titre: T2[n], sais });
module.exports = {
  c1: { de: [d(1, 'tu calculais la marge sur un article : prix de vente moins prix d’achat.'), d(4, 'tu calculais des intérêts simples pour une durée en années.')],
    plus: ['Tu passes d’un article à tout le mois : coûts fixes, coûts variables, recette et résultat.', 'Tu découvres le coût moyen et le coût marginal, pour décider d’accepter ou non une commande.', 'Tu calcules des intérêts sur des mois, des quinzaines ou des jours, avec des taux proportionnels.'],
    fil: 'De la marge sur un article au résultat de tout un mois, et des intérêts sur des années à des intérêts au jour près.',
    reac: ['Pourcentage et écriture décimale : 3 % = 0,03.', 'Durée en années : 9 mois = 9 ÷ 12 = 0,75 an.', 'Priorités opératoires dans 600 + 4 × 100.'],
    vig: ['La marge unitaire (2de) n’est pas le résultat du mois : les coûts fixes s’ajoutent une seule fois.', 'Coût moyen et coût marginal sont deux nombres différents ; le second ne contient pas les charges fixes.', 'Année commerciale de 360 jours pour le taux journalier.'] },
  c2: { de: [d(5, 'tu lisais une image et un antécédent sur une courbe.'), d(3, 'tu résolvais une équation et une inéquation par le calcul, et tu écrivais un intervalle.')],
    plus: ['Tu compares deux fonctions sur le même graphique : f(x) = g(x) se lit au point d’intersection.', 'Tu résous f(x) ≥ g(x) en repérant la courbe qui est au-dessus, et tu réponds par un intervalle.', 'Tu trouves un seuil de rentabilité, en reliant ce chapitre aux coûts du chapitre 1.'],
    fil: 'De la lecture d’une seule courbe à la comparaison de deux courbes, pour choisir une offre ou trouver un seuil de rentabilité.',
    reac: ['Lire les graduations et les unités des deux axes.', 'Résoudre a x + b = c x + d.', 'Écrire un intervalle avec les bons crochets.'],
    vig: ['La solution de f(x) = g(x) est une abscisse, pas une ordonnée.', 'L’offre la moins chère est la courbe la plus basse.', 'Au seuil, le résultat est nul : le bénéfice commence après.'] },
  c3: { de: [d(5, 'tu connaissais la fonction carré, sa courbe en « U » et son sens de variation.'), d(3, 'tu résolvais des équations du premier degré.')],
    plus: ['Tu étudies toute une famille de courbes, ax² + bx + c, ouvertes vers le haut ou vers le bas selon le signe de a.', 'Tu trouves les racines avec la forme factorisée et la règle du produit nul.', 'Tu repères le sommet pour trouver le meilleur bénéfice, et le signe pour savoir quand on perd de l’argent.'],
    fil: 'De la fonction carré à toutes les paraboles : racines, signe et sommet, pour chercher le meilleur bénéfice.',
    reac: ['Carré d’un nombre négatif : (− 3)² = 9.', 'Remplacer x par un nombre dans une expression.', 'Résoudre x − 2 = 0.'],
    vig: ['− 3² = − 9 mais (− 3)² = 9 : le piège de la calculatrice.', 'L’extremum est l’ordonnée du sommet, pas son abscisse.', 'Le signe entre les racines est contraire à celui de a.'] },
  c4: { de: [d(5, 'tu lisais le coefficient directeur (la pente) d’une droite et le sens de variation d’une fonction.')],
    plus: ['La pente ne concerne plus seulement les droites : tu calcules la pente d’une courbe en un point, le nombre dérivé.', 'Tu calcules une fonction dérivée avec des règles, sans tracer de tangente.', 'Tu justifies le sens de variation par le signe de la dérivée, et tu relies la dérivée au coût marginal du chapitre 1.'],
    fil: 'De la pente d’une droite à la pente d’une courbe : la dérivée explique pourquoi une fonction monte ou descend.',
    reac: ['Pente d’une droite : variation de y pour une avancée de 1 en x.', 'Calculs avec des nombres relatifs : − 2 × 3 + 10.', 'Résoudre − 2x + 10 = 0.'],
    vig: ['Le nombre dérivé est une pente, pas une valeur de la fonction.', 'La dérivée de ax² est 2ax.', 'La dérivée donne une approximation du coût marginal : on écrit ≈.'] },
  c5: { de: [d(1, 'tu traduisais une hausse de 10 % par une multiplication par 1,1.'), d(4, 'tu calculais des intérêts simples : le même montant chaque année.'), d(5, 'tu savais qu’une fonction affine donne des points alignés.')],
    plus: ['Tu ranges des valeurs successives dans une suite : u₀, u₁, u₂…', 'Une hausse du même montant donne une suite arithmétique ; une hausse du même pourcentage, une suite géométrique.', 'Tu découvres les intérêts composés et tu compares deux placements sur plusieurs années.'],
    fil: 'Du coefficient multiplicateur et des intérêts simples aux suites : ajouter le même montant ou multiplier par le même nombre.',
    reac: ['Coefficient multiplicateur : + t % → × (1 + t ÷ 100).', 'Puissance à la calculatrice : touche ^ ou xʸ.', 'Recopier une formule vers le bas dans un tableur.'],
    vig: ['Le premier terme est u₀ : u₃ est le 4ᵉ terme.', 'Raison arithmétique : une différence ; raison géométrique : un quotient.', '+ 8 % donne q = 1,08, ni 8 ni 0,08.'] },
  c6: { de: [d(2, 'tu calculais une moyenne et tu lisais un diagramme pour une seule variable.'), d(5, 'tu lisais une droite d’équation y = a x + b.')],
    plus: ['Tu étudies deux variables à la fois et tu les places dans un nuage de points.', 'Tu résumes le nuage par une droite d’ajustement obtenue au tableur, et tu juges sa qualité avec R².', 'Tu fais des prévisions en distinguant interpolation et extrapolation, et un lien statistique d’une cause.'],
    fil: 'D’une variable à deux variables : le nuage de points, la droite d’ajustement et des prévisions prudentes.',
    reac: ['Calculer une moyenne.', 'Calculer y avec y = a x + b, et retrouver x à partir de y.', 'Arrondir à la précision demandée.'],
    vig: ['Dans un point, x vient en premier.', 'R² mesure la proximité des points à la droite, pas le sens de la droite.', 'Une extrapolation est une estimation fragile ; une corrélation n’est pas une cause.'] },
  c7: { de: [d(6, 'tu calculais une probabilité : cas favorables divisés par cas possibles, avec un arbre ou un tableau.'), d(8, 'tu lisais un tableau croisé et tu choisissais le bon total, « sur l’ensemble » ou « parmi ».')],
    plus: ['Tu nommes les évènements : contraire, incompatibles, « A et B », « A ou B ».', 'Tu utilises la formule P(A ou B) = P(A) + P(B) − P(A et B).', 'Les proportions d’un tableau croisé deviennent des probabilités, pour un client pris au hasard.'],
    fil: 'Des cas favorables et du tableau croisé au langage des évènements : contraire, « et », « ou ».',
    reac: ['Écrire une fraction en décimal : 15 ÷ 50 = 0,3.', 'Compléter les totaux d’un tableau croisé.', 'Le mot « parmi » change le total par lequel on divise.'],
    vig: ['« A ou B » est inclusif : la zone commune en fait partie.', 'Additionner P(A) + P(B) sans retirer P(A et B) compte deux fois la zone commune.', 'Une probabilité est toujours entre 0 et 1.'] },
  c8: { de: [d(7, 'tu calculais des aires, des volumes de pavés et de cylindres, tu convertissais en litres et tu utilisais le théorème de Pythagore.')],
    plus: ['Tu reconnais et représentes des solides en perspective : pyramide, cône, boule.', 'Tu calcules leurs volumes et tu compares des emballages.', 'Tu imagines la section d’un solide par un plan : la forme obtenue en le coupant.'],
    fil: 'Des volumes du pavé et du cylindre aux autres solides : pyramide, cône, boule, et leurs sections.',
    reac: ['Aire d’un rectangle et d’un disque (π r²).', '1 dm³ = 1 L ; 1 m³ = 1 000 L.', 'Théorème de Pythagore dans un triangle rectangle.'],
    vig: ['Pyramide et cône : on multiplie par 1/3.', 'Rayon et diamètre : r = D ÷ 2.', 'Les volumes s’expriment en unités cubes.'] }
};
