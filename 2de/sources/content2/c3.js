/* Chapitre 3 · Problèmes du premier degré (BO 2019, 2de pro) */
'use strict';
const K = require('../lib/kit');
const { rnd, fr, eur, pct, H, FX, Q, BQ, prob, D, G, P } = K;

module.exports = function (chk) {
  const c = { id: 'c3', n: 3, col: 'algebre', icone: '⚖️', dom: 'Algèbre', titre: 'Problèmes du premier degré',
    intro: 'Combien d’articles vendre pour couvrir ses frais ? Quelle offre choisir ? Une équation ou une inéquation répond.',
    obj: ['Résoudre une équation du premier degré.', 'Mettre un problème en équation.', 'Écrire un intervalle.', 'Résoudre une inéquation et interpréter la solution.'] };
  c.auto = ['eq1', 'eq1', 'estSol', 'ivl', 'pctOf', 'apply'];
  c.lecons = [
    { titre: 'Résoudre une équation', rule: `<p>Une équation reste vraie si l’on ${FX('ajoute ou soustrait')} le même nombre aux deux membres, ou si l’on ${FX('multiplie ou divise')} les deux membres par un même nombre non nul.</p><p>But : obtenir x = …, puis vérifier.</p>`, ex: `<p>3x + 5 = 20</p><p>3x = 15 (− 5 des deux côtés)</p><p>x = 5 (÷ 3) ; vérif : 3 × 5 + 5 = 20 ✓</p>`, ill: P.equation() },
    { titre: 'Mettre un problème en équation', rule: `<p>1. Je choisis l’inconnue x (ce que l’on cherche).</p><p>2. Je traduis l’énoncé par une équation.</p><p>3. Je résous, je vérifie.</p><p>4. Je réponds par une phrase, avec l’unité.</p>`, ex: `<p>3 paquets identiques + 4,50 € de frais = 28,20 €</p><p>3x + 4,5 = 28,2 → x = <b>7,90 €</b></p>` },
    { titre: 'Les intervalles', rule: `<p>${FX('[a ; b]')} : a ≤ x ≤ b ; ${FX(']a ; b[')} : a < x < b.</p><p>${FX('[a ; +∞[')} : x ≥ a ; ${FX(']−∞ ; b[')} : x < b.</p><p>Crochet tourné vers le nombre : le nombre est compris.</p>`, ex: `<p>2 ≤ x < 5 : <b>[2 ; 5[</b></p><p>x ≥ 17 500 : <b>[17 500 ; +∞[</b></p>`, ill: P.intervalle() },
    { titre: 'Résoudre une inéquation', rule: `<p>Mêmes règles que pour une équation, mais si l’on ${FX('multiplie ou divise par un nombre négatif')}, on ${FX('change le sens')} de l’inégalité.</p><p>Les solutions forment un intervalle.</p>`, ex: `<p>2x + 3 < 11 → 2x < 8 → x < 4</p><p>Solutions : <b>]−∞ ; 4[</b></p><p>− 2x ≤ 6 → x <b>≥</b> − 3</p>`, att: 'On vérifie avec un nombre de l’intervalle : x = 0 donne 3 < 11 ✓.' }];
  c.mots = [['équation', 'égalité avec une inconnue'], ['inconnue', 'nombre cherché, noté x'], ['solution', 'valeur de x qui rend l’égalité vraie'], ['inéquation', 'inégalité avec une inconnue (<, ≤, >, ≥)'], ['intervalle', 'ensemble des nombres compris entre deux bornes']];
  c.astuces = [
    { k: 'vite', ic: '⚡', t: 'Calculer vite', items: ['Je passe d’abord les nombres « seuls » de l’autre côté, puis je divise.', 'Je regroupe les x d’un côté : 5x − 2x = 3x.'] },
    { k: 'og', ic: '🎯', t: 'Estimer', items: ['7,90 € × 3 ≈ 24 € : plausible pour 28,20 € avec les frais.', 'Un nombre d’articles est entier : j’arrondis dans le bon sens.'] },
    { k: 'sens', ic: '💡', t: 'Donner du sens', items: ['« au moins » : ≥ ; « au plus » : ≤ ; « moins de » : <.', 'La réponse est une phrase : « Il faut vendre au moins 60 articles. »'] },
    { k: 'verif', ic: '✅', t: 'Vérifier', items: ['Je remplace x par ma solution dans l’équation de départ.', 'Pour une inéquation, je teste une valeur dans l’intervalle et une dehors.'] }];
  chk(4 * 8 - 7 === 25 && 2 * 8 + 9 === 25 && rnd(350 / .02) === 17500, 'c3 résolus');
  c.resolus = [
    { titre: 'Résoudre une équation', outil: '✏️ à la main', enonce: `Résoudre ${H('4x − 7 = 2x + 9')}.`,
      rows: [['4x − 2x − 7 = 9', 'Je regroupe les x à gauche : − 2x des deux côtés.'], ['2x = 9 + 7 = <b class="nw">16</b>', 'J’ajoute 7 des deux côtés.'], ['x = 16 ÷ 2 = <b class="nw">8</b>', 'Je divise par 2.'], ['4 × 8 − 7 = 25 et 2 × 8 + 9 = 25 ✓', 'Je vérifie dans l’équation de départ.']], rep: 'La solution est x = 8.', go: ['m3', 'p1'] },
    { titre: 'Mettre en inéquation : la commission', outil: '🧮 calculatrice', enonce: `Une vendeuse touche un fixe de ${H('1 450 €')} plus ${H('2 %')} du chiffre d’affaires (CA) qu’elle réalise. Quel CA doit-elle réaliser pour gagner ${H('au moins 1 800 €')} ?`,
      rows: [['x = CA réalisé (en €)', 'Je nomme l’inconnue.'], ['1 450 + 0,02x <b class="nw">≥</b> 1 800', '« au moins » se traduit par ≥.'], ['0,02x ≥ 350', 'Je retire 1 450 des deux côtés.'], ['x ≥ 350 ÷ 0,02 = <b class="nw">17 500</b>', 'Je divise par 0,02, nombre positif : le sens ne change pas.'], ['Solutions : [17 500 ; +∞[', 'J’écris l’intervalle.'], ['1 450 + 0,02 × 17 500 = 1 800 ✓', 'Je vérifie la borne.']], rep: 'Elle doit réaliser au moins 17 500 € de chiffre d’affaires.', go: ['m7', 'p2'] }];
  c.meca = [
    { id: 'm1', lc: 1, titre: 'Équations ax = b', consigne: 'Résolvez.', gen: 'eq1', n: 6, cols: 3, w: 14 },
    { id: 'm2', lc: 1, titre: 'Équations ax + b = c', consigne: 'Résolvez.', gen: 'eq2', n: 6, cols: 2, w: 16 },
    { id: 'm3', lc: 1, titre: 'Inconnue des deux côtés', consigne: 'Résolvez.', gen: 'eq3', n: 4, cols: 2, w: 16 },
    { id: 'm4', lc: 1, titre: 'Est-ce une solution ?', consigne: 'Cochez la bonne réponse.', gen: 'estSol', n: 4, cols: 1 },
    { id: 'm5', lc: 2, titre: 'Traduire un énoncé', consigne: 'Cochez l’équation qui correspond.', gen: 'trad', n: 3, cols: 1 },
    { id: 'm6', lc: 3, titre: 'Écrire un intervalle', consigne: 'Cochez l’intervalle qui correspond.', gen: 'ivl', n: 4, cols: 1 },
    { id: 'm7', lc: 4, titre: 'Inéquations', consigne: 'Cochez l’ensemble des solutions.', gen: 'ineq', n: 4, cols: 1 }];
  c.probs = [];
  const add = x => c.probs.push(prob(x));
  chk(rnd((28.2 - 4.5) / 3) === 7.9, 'c3 p1');
  add({ id: 'p1', etape: 2, lc: 2, comps: ['ana', 'rea'], titre: 'Le prix d’un paquet', intro: `<p>Une cliente commande ${H('3 paquets identiques')} de cartouches d’encre. Avec ${H('4,50 € de frais de port')}, elle paie ${H('28,20 €')}.</p>`,
    qs: [Q('a.', 'Écrivez une équation (x : prix d’un paquet).', '3x + 4,5 = 28,2', null, { w: 40 }), Q('b.', 'Résolvez-la, puis vérifiez.', 'x = 7,90 €', 7.9)], corr: 'a. 3x + 4,5 = 28,2. b. 3x = 23,7 ; x = 7,90 € ; 3 × 7,90 + 4,50 = 28,20 ✓.' });
  const n2 = Math.floor((60 - 5.9) / 12.5); chk(n2 === 4, 'c3 p2');
  add({ id: 'p2', etape: 2, lc: 4, comps: ['ana', 'rea', 'val'], titre: 'Le budget en ligne', intro: `<p>Un site vend des coques de téléphone à ${H('12,50 €')} l’unité, avec ${H('5,90 €')} de livraison par commande. Léa dispose de ${H('60 €')}.</p>`,
    qs: [Q('a.', 'Écrivez une inéquation (n : nombre de coques).', '12,5n + 5,9 ≤ 60', null, { w: 40 }), Q('b.', 'Résolvez-la.', 'n ≤ 4,33', 4.33, { tol: .01 }), Q('c.', 'Combien de coques Léa peut-elle acheter au maximum ?', '4 coques', 4, { tol: 0 })], corr: 'a. 12,5n + 5,9 ≤ 60. b. 12,5n ≤ 54,1 ; n ≤ 4,328. c. 4 coques (n est entier).' });
  add({ id: 'p3', etape: 2, lc: 2, comps: ['rea'], titre: 'Retrouver un prix HT', intro: `<p>Un article coûte ${H('78 € TTC')}, avec une ${H('TVA à 20 %')}. On note x son prix HT.</p>`,
    qs: [Q('a.', 'Écrivez l’équation qui relie x et 78.', '1,2x = 78', null, { w: 30 }), Q('b.', 'Résolvez-la.', 'x = 65 €', 65)], corr: 'a. 1,2x = 78. b. x = 78 ÷ 1,2 = 65 €.' });
  chk(240 - 18 * 10 === 60 && 240 - 18 * 11 < 60, 'c3 p4');
  add({ id: 'p4', etape: 2, lc: 4, comps: ['ana', 'rea'], titre: 'Le réassort', intro: `<p>Un rayon contient ${H('240 articles')}. On en vend environ ${H('18 par jour')}. Il faut passer commande quand il en reste ${H('moins de 60')}.</p>`,
    qs: [Q('a.', 'Écrivez une inéquation (j : nombre de jours).', '240 − 18j < 60', null, { w: 34 }), Q('b.', 'Résolvez-la (attention au signe de − 18).', 'j > 10', 10, { tol: 0 }), Q('c.', 'Au bout de combien de jours faut-il commander ?', 'le 11e jour', 11, { tol: 0 })], corr: 'a. 240 − 18j < 60. b. − 18j < − 180 ; on divise par − 18 (négatif) : j > 10. c. Dès le 11e jour.', pouce: 'Diviser par un nombre négatif change le sens de l’inégalité.' });
  // cas pratiques
  chk(35 * 8 === 120 + 20 * 8 && 35 * 10 === 350 && 120 + 200 === 320, 'c3 c1');
  add({ id: 'c1', etape: 3, lc: 2, comps: ['app', 'ana', 'rea', 'com'], titre: 'Louer un stand au marché de Noël', intro: `<div class="two">${D.doc(1, 'Offre A', '<p><b>35 € par jour</b>, sans frais fixes.</p>')}${D.doc(2, 'Offre B', '<p><b>120 € de frais d’inscription</b> + <b>20 € par jour</b>.</p>')}</div><div class="wfig">${G.fplot({ title: 'Coût de location selon le nombre de jours', xMin: 0, xMax: 14, xStep: 2, yMin: 0, yMax: 500, yStep: 100, xLabel: 'jours', yLabel: 'coût (€)', fns: [{ f: x => 35 * x, name: 'Offre A', color: '#C2332A' }, { f: x => 120 + 20 * x, name: 'Offre B', color: '#1D5FC2', dash: '8 5' }], h: 280 })}</div>`,
    qs: [Q('a.', 'Lisez sur le graphique pour quel nombre de jours les deux offres coûtent autant.', '8 jours', 8, { tol: 0 }), Q('b.', 'Retrouvez ce résultat en résolvant 35j = 120 + 20j.', 'j = 8', 8, { tol: 0 }), Q('c.', `Le marché dure ${H('10 jours')}. Calculez le coût de chaque offre.`, 'A : 350 € ; B : 320 €', 350, { w: 40, lab: 'A puis B :' }), Q('d.', 'Quelle offre conseillez-vous ? Justifiez.', 'B : elle coûte 30 € de moins pour 10 jours.', null, { lines: 2 })], corr: 'a. 8 jours. b. 15j = 120 ; j = 8. c. A : 35 × 10 = 350 € ; B : 120 + 200 = 320 €. d. Offre B (moins chère au-delà de 8 jours).' });
  chk(270 / 4.5 === 60, 'c3 c2');
  add({ id: 'c2', etape: 3, lc: 4, comps: ['app', 'ana', 'rea', 'val'], titre: 'Couvrir les frais d’un stand', intro: `<p>Une créatrice vend des bougies sur un salon. Le stand coûte ${H('270 €')}. Sur chaque bougie vendue, elle réalise une ${H('marge de 4,50 €')}.</p>`,
    qs: [Q('a.', 'Écrivez l’inéquation qui traduit « la marge totale couvre au moins les frais » (n : nombre de bougies).', '4,5n ≥ 270', null, { w: 34 }), Q('b.', 'Résolvez-la.', 'n ≥ 60', 60, { tol: 0 }), Q('c.', `Elle vend ${H('75 bougies')}. Calculez son bénéfice.`, '75 × 4,50 − 270 = 67,50 €', 67.5, { w: 50 })], corr: 'a. 4,5n ≥ 270. b. n ≥ 60. c. 337,50 − 270 = 67,50 €.' });
  // vers le bac
  const seuil = rnd(18 / .0085, 2), f1 = rnd(18 + .009 * 6000), f2 = rnd(.0175 * 6000);
  chk(seuil === 2117.65 && f1 === 72 && f2 === 105, 'c3 bac');
  add({ id: 'b1', etape: 4, comps: ['app', 'ana', 'rea', 'val', 'com'], titre: 'Choisir son terminal de paiement', cls: 'bac', intro: `<p>Une boutique encaisse environ <b>6 000 € par mois</b> par carte bancaire. Elle compare deux formules de terminal de paiement.</p><div class="two">${D.doc(1, 'Formule Fixe', '<p>Location : <b>18 € par mois</b></p><p>Commission : <b>0,9 %</b> de chaque paiement</p>')}${D.doc(2, 'Formule Libre', '<p>Pas de location</p><p>Commission : <b>1,75 %</b> de chaque paiement</p>')}</div>`,
    qs: [BQ(1, 'Calculer le coût mensuel de chaque formule pour 6 000 € encaissés.', 'rea', 'Fixe : 72 € ; Libre : 105 €', f1, { w: 50, lab: 'Fixe :' }), BQ(2, 'Exprimer le coût de chaque formule en fonction du montant x encaissé.', 'ana', 'Fixe : 18 + 0,009x ; Libre : 0,0175x', null, { lines: 1 }), BQ(3, 'Résoudre l’équation 18 + 0,009x = 0,0175x (au centime).', 'rea', 'x ≈ 2 117,65 €', seuil, { tol: .01 }), BQ(4, 'Indiquer pour quels montants la formule Fixe est la moins chère.', 'val', 'au-delà de 2 117,65 € par mois', null, { lines: 1 }), BQ(5, 'Rédiger une recommandation pour la gérante.', 'com', 'Choisir la formule Fixe : 33 € d’économie par mois pour 6 000 € encaissés.', null, { lines: 2 })],
    corr: `1. Fixe : 18 + 54 = 72 € ; Libre : 105 €. 2. 18 + 0,009x et 0,0175x. 3. 0,0085x = 18 ; x ≈ 2 117,65 €. 4. Pour plus de 2 117,65 € encaissés par mois. 5. Formule Fixe (33 € économisés par mois).` });
  c.words = [
    { id: 'equation', mot: 'l’équation', pic: P.equation(), def: 'Égalité qui contient une inconnue.', formule: '3x + 5 = 20', phrase: 'Je résous l’équation pour trouver le prix d’un paquet.' },
    { id: 'solution', mot: 'la solution', pic: P.image(), def: 'Valeur de l’inconnue qui rend l’égalité vraie.', sens: 'Dans la vie courante : la réponse à un problème. Ici : un nombre précis.', phrase: 'La solution est x = 8.' },
    { id: 'intervalle', mot: 'l’intervalle', pic: P.intervalle(), def: 'Ensemble des nombres compris entre deux bornes.', formule: '[2 ; 5[ : 2 ≤ x < 5', phrase: 'Les solutions forment l’intervalle [17 500 ; +∞[.' },
    { id: 'inequation', mot: 'l’inéquation', pic: P.intervalle(), def: 'Inégalité qui contient une inconnue.', formule: '2x + 3 < 11', phrase: 'Je résous une inéquation pour trouver un seuil.' }];
  c.bilan = [['résoudre une équation', ['m1', 'm2', 'm3']], ['mettre un problème en équation', ['m5', 'p1', 'p3']], ['écrire un intervalle', ['m6']], ['résoudre une inéquation', ['m7', 'p2', 'p4']], ['comparer deux offres', ['c1', 'b1']]];
  return c;
};
