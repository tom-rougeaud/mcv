/* Chapitre 2 · Statistique à une variable — version 3 (BO 2019, 2de pro). Outils : Casio collège, Excel. */
'use strict';
const K = require('../lib/kit3');
const { rnd, H, FM, M, R, adapt } = K;
const { S, T, Rc, Ln, Ar, Br, st } = require('../lib/visu');
const P = require('../lib/pics');
const V2 = require('../content2/c2.js');

module.exports = function (chk) {
  const old = V2(chk);
  const c = { id: 'c2', n: 2, col: 'donnees', icone: '📊', dom: 'Statistique et probabilités', titre: 'Statistique à une variable' };
  c.travail = { question: `L’enseigne promet : « ${H('70 % des clients')} attendent ${H('moins de 4 minutes')} à l’accueil ». Le relevé de 80 clients le confirme-t-il ? Tu sauras répondre à la fin du chapitre (sujet « vers le bac »).` };
  c.objectifs = ['Je saurai calculer une fréquence et la lire sur un diagramme.', 'Je saurai calculer une moyenne, même avec des effectifs.', 'Je saurai trouver la médiane et les quartiles d’une série rangée.', 'Je saurai comparer deux séries avec une boîte à moustaches.'];
  c.depart = 'c2';

  /* ---------- méthodes visuelles ---------- */
  // 1. les jetons : 20 tickets rangés par moyen de paiement
  const PAY = [['carte', 12], ['sans contact', 5], ['espèces', 3]];
  let jet = '', k = 0;
  PAY.forEach(([nom, n], g) => { for (let i = 0; i < n; i++, k++) jet += `<circle cx="${70 + (k % 10) * 26}" cy="${50 + Math.floor(k / 10) * 28}" r="10" class="${g === 0 ? 'k' : 'k2 ks'}" stroke-width="2"${g === 2 ? ' stroke-dasharray="3 2"' : ''}/>`; });
  const jetons = S(600, 200, st(1, jet + T(200, 26, '20 tickets de caisse', { fs: 14, c: 'ts' }) + `<circle cx="432" cy="51" r="7" class="k"/><circle cx="432" cy="75" r="7" class="k2 ks" stroke-width="2"/><circle cx="432" cy="99" r="7" class="k2 ks" stroke-width="2" stroke-dasharray="3 2"/>` + T(446, 56, '12 carte', { fs: 14, a: 'start', c: 'kt' }) + T(446, 80, '5 sans contact', { fs: 14, a: 'start' }) + T(446, 104, '3 espèces', { fs: 14, a: 'start' }))
    + st(2, Br(58, 372, 120, 'effectif total : N = 20', { fs: 15 }))
    + st(3, T(300, 176, 'fréquence « carte » = 12 ÷ 20 = 0,6 = 60 %', { fs: 17, c: 'kt' }) + T(300, 196, 'les trois fréquences : 60 % + 25 % + 15 % = 100 %', { fs: 13, c: 'ts' })), 'Vingt jetons, un par ticket, rangés par moyen de paiement');
  // 2. les piles qu’on égalise (moyenne)
  const PI = [2, 6, 4, 3, 5], hj = 20;
  const pile = (x, n, cls) => Array.from({ length: n }, (_, i) => Rc(x, 170 - (i + 1) * hj, 50, hj - 3, { c: cls, rx: 4 })).join('');
  const piles = S(600, 230, st(1, PI.map((n, i) => pile(40 + i * 64, n, 'k2') + T(65 + i * 64, 192, n + ' €', { fs: 14 })).join('') + T(170, 216, '5 paniers : 2 € ; 6 € ; 4 € ; 3 € ; 5 €', { fs: 14, c: 'ts' }))
    + st(2, `<path d="M120 52 Q150 20 170 70" class="ks" stroke-width="2.4" fill="none" stroke-dasharray="5 4"/><path d="M250 92 Q236 74 222 108" class="ks" stroke-width="2.4" fill="none" stroke-dasharray="5 4"/>` + T(170, 26, 'on déplace des jetons', { fs: 13, c: 'kt' }))
    + st(3, PI.map((_, i) => pile(380 + i * 42, 4, 'k').replace(/width="50"/g, 'width="36"')).join('') + Ln(370, 90, 596, 90, { dash: '6 4' }) + T(488, 78, 'tout le monde a 4 €', { fs: 14, c: 'kt' }) + T(488, 192, '20 € ÷ 5 = 4 €', { fs: 16 }) + T(488, 216, 'la moyenne', { fs: 14, c: 'kt' })), 'Des piles de jetons que l’on égalise pour trouver la moyenne');
  // 3. la file rangée : médiane, quartiles (11 tickets)
  const F = [12, 15, 18, 18, 22, 25, 27, 30, 34, 41, 58], bw = 44, gx = 6, x0 = (600 - 11 * (bw + gx)) / 2, cx = i => x0 + i * (bw + gx) + bw / 2;
  const file = (cut) => F.map((v, i) => Rc(x0 + i * (bw + gx), 50, bw, 38, { c: (cut && [2, 5, 8].includes(i)) ? 'k' : 'k2', rx: 5 }) + T(cx(i), 75, v, { fs: 16, c: (cut && [2, 5, 8].includes(i)) ? 'tw' : 'tx' }) + T(cx(i), 104, 'rang ' + (i + 1), { fs: 10, c: 'ts', w: 400 })).join('');
  const fileVis = S(600, 210, st(1, file(false) + T(300, 26, '11 tickets (€), rangés du plus petit au plus grand', { fs: 14, c: 'ts' }))
    + st(2, Ln(cx(5), 34, cx(5), 92, { w: 3 }) + Ln(cx(5), 112, cx(5), 124, { w: 3 }) + Rc(x0 + 5 * (bw + gx), 50, bw, 38, { c: 'k', rx: 5 }) + T(cx(5), 75, '25', { fs: 16, c: 'tw' }) + T(cx(5), 140, 'médiane : 5 valeurs de chaque côté', { fs: 15, c: 'kt' }))
    + st(3, Rc(x0 + 2 * (bw + gx), 50, bw, 38, { c: 'k', rx: 5 }) + T(cx(2), 75, '18', { fs: 16, c: 'tw' }) + Rc(x0 + 8 * (bw + gx), 50, bw, 38, { c: 'k', rx: 5 }) + T(cx(8), 75, '34', { fs: 16, c: 'tw' }) + T(cx(2), 168, 'Q₁ : rang 11 ÷ 4 = 2,75 → 3', { fs: 13 }) + T(cx(8), 168, 'Q₃ : rang 33 ÷ 4 = 8,25 → 9', { fs: 13 }) + T(300, 196, 'on arrondit toujours le rang à l’entier supérieur', { fs: 13, c: 'ts' })), 'La file des valeurs rangées, coupée en deux puis en quatre');
  // 4. la boîte dessinée sous la file
  const ax = v => 30 + v * 9;   // 0 € → 30, 60 € → 570
  const boiteVis = S(600, 250, st(1, F.map(v => `<circle cx="${ax(v)}" cy="44" r="6" class="k"/>`).join('') + T(300, 20, 'les 11 tickets placés sur l’axe', { fs: 13, c: 'ts' }) + Ln(30, 176, 570, 176, { w: 1.6 }) + [0, 10, 20, 30, 40, 50, 60].map(v => Ln(ax(v), 172, ax(v), 180, { w: 1.6 }) + T(ax(v), 196, v, { fs: 12, w: 400 })).join('') + T(588, 196, '€', { fs: 12 }))
    + st(2, Rc(ax(18), 100, ax(34) - ax(18), 44, { c: 'k2' }) + Ln(ax(25), 100, ax(25), 144, { w: 4 }) + [18, 25, 34].map(v => Ln(ax(v), 52, ax(v), 98, { dash: '3 3', w: 1.4 })).join(''))
    + st(3, Ln(ax(12), 122, ax(18), 122, { w: 2.4 }) + Ln(ax(34), 122, ax(58), 122, { w: 2.4 }) + Ln(ax(12), 110, ax(12), 134) + Ln(ax(58), 110, ax(58), 134) + T(ax(12), 162, 'min', { fs: 12, c: 'kt' }) + T(ax(18), 162, 'Q₁', { fs: 12, c: 'kt' }) + T(ax(25), 162, 'Me', { fs: 12, c: 'kt' }) + T(ax(34), 162, 'Q₃', { fs: 12, c: 'kt' }) + T(ax(58), 162, 'max', { fs: 12, c: 'kt' }))
    + st(4, Br(ax(18), ax(34), 206, 'Q₃ − Q₁ = 16 € : la moitié centrale des tickets', { fs: 13 })), 'La boîte à moustaches construite à partir de la file rangée');
  const sF = F.reduce((a, b) => a + b, 0);
  chk(sF === 300 && F[5] === 25 && F[Math.ceil(11 / 4) - 1] === 18 && F[Math.ceil(33 / 4) - 1] === 34 && 12 / 20 === .6 && 5 / 20 === .25 && PI.reduce((a, b) => a + b) === 20, 'c2 visuels');

  c.notions = [
    { titre: 'Effectifs et fréquences', decouvre: { txt: `Sur ${H('20 tickets')}, ${H('12')} sont payés par carte. Est-ce plus ou moins de la moitié ? Et en pourcentage ?`, img: P.frequence() },
      comprends: `<p>Une <b>série statistique</b> est une liste de données : des montants, des durées, des notes.</p><p>L’<b>effectif</b> d’une valeur, c’est le nombre de fois où elle apparaît. L’<b>effectif total</b> N, c’est le nombre de données.</p><p>La <b>fréquence</b> compare un effectif au total. On divise l’effectif par N. On l’écrit souvent en %.</p><p>Les fréquences permettent de comparer deux groupes de tailles différentes. Leur somme fait toujours 100 %.</p><p>Un diagramme montre ces fréquences d’un coup d’œil : barres pour comparer, secteurs pour montrer les parts d’un tout.</p>`,
      vois: jetons, voisLeg: 'Un jeton par ticket. On compte les jetons d’une couleur, puis on divise par le nombre total de jetons.',
      retiens: `<p>${FM(R`\text{fréquence}=\dfrac{\text{effectif}}{\text{effectif total}}`)}</p><p>Diagramme en secteurs : ${FM(R`\text{angle}=\text{fréquence}\times 360^\circ`)}</p>`,
      exemple: `<p>12 tickets « carte » sur 20 : 12 ÷ 20 = 0,6 = <b>60 %</b>.</p><p>Angle du secteur : 0,6 × 360 = <b>216°</b>.</p>`,
      attention: 'On divise l’effectif par le total, pas le total par l’effectif : 12 ÷ 20, pas 20 ÷ 12.', astuce: { k: 'verif', t: 'Additionne tes fréquences : tu dois retrouver 100 % (à l’arrondi près).' } },
    { titre: 'La moyenne', decouvre: { txt: `Cinq clients ont des paniers de ${H('2, 6, 4, 3 et 5 €')}. Si tout le monde avait dépensé pareil, combien chacun aurait-il dépensé ?`, img: P.moyenne() },
      comprends: `<p>La <b>moyenne</b>, c’est la valeur que chacun aurait si l’on partageait le total de façon égale.</p><p>On additionne toutes les valeurs, puis on divise par le nombre de valeurs.</p><p>Quand une valeur se répète, on utilise son effectif. On multiplie chaque valeur par son effectif, on additionne, puis on divise par N. C’est une moyenne <b>pondérée</b>.</p><p>Une valeur très grande tire la moyenne vers le haut. Un seul gros panier peut donc fausser l’image.</p><p>Dans Excel, la formule ${M(R`\texttt{=MOYENNE(B2:B21)}`)} calcule la moyenne des cases B2 à B21.</p>`,
      vois: piles, voisLeg: 'On prend des jetons aux grandes piles pour les donner aux petites. Quand toutes les piles sont égales, leur hauteur est la moyenne.',
      retiens: `<p>${FM(R`\bar{x}=\dfrac{\text{somme des valeurs}}{N}`)} · avec des effectifs : ${FM(R`\bar{x}=\dfrac{n_1x_1+n_2x_2+\dots}{N}`)}</p>`,
      exemple: `<p>2 ; 6 ; 4 ; 3 ; 5 : (2 + 6 + 4 + 3 + 5) ÷ 5 = 20 ÷ 5 = <b>4 €</b>.</p><p>14 tickets à 1 article et 6 tickets à 2 articles : (14 × 1 + 6 × 2) ÷ 20 = <b>1,3 article</b>.</p>`,
      attention: 'Avec un tableau, on divise par l’effectif total N, pas par le nombre de colonnes.', astuce: { k: 'og', t: 'La moyenne est toujours entre la plus petite et la plus grande valeur. Sinon, recommence.' } },
    { titre: 'La médiane et les quartiles', decouvre: { txt: `On range ${H('11 tickets')} du plus petit au plus grand. Quel ticket se trouve exactement au milieu de la file ?`, img: P.mediane() },
      comprends: `<p>Pour trouver la médiane, on <b>range</b> d’abord la série dans l’ordre croissant. Cette étape est obligatoire.</p><p>La <b>médiane</b> est la valeur du milieu de la file. Il y a autant de valeurs avant qu’après. Avec N impair, c’est la valeur de rang ${M(R`\dfrac{N+1}{2}`)}. Avec N pair, c’est la moyenne des deux valeurs du milieu.</p><p>Les <b>quartiles</b> coupent la file en quatre. Pour ${M('Q_1')}, on calcule N ÷ 4 ; pour ${M('Q_3')}, 3N ÷ 4. On arrondit le rang à l’entier supérieur.</p><p>Excel a sa propre méthode pour les quartiles : en classe, on utilise la méthode des rangs.</p>`,
      vois: fileVis, voisLeg: 'La médiane coupe la file rangée en deux moitiés. Q₁ et Q₃ coupent chaque moitié à peu près en deux.',
      retiens: `<p>Médiane, N impair : rang ${FM(R`\dfrac{N+1}{2}`)} · ${FM(R`Q_1`)} : rang ${FM(R`\dfrac{N}{4}`)} · ${FM(R`Q_3`)} : rang ${FM(R`\dfrac{3N}{4}`)}, arrondis à l’entier supérieur.</p>`,
      exemple: `<p>11 tickets rangés : la médiane est au rang 6 → <b>25 €</b>.</p><p>Q₁ : 11 ÷ 4 = 2,75 → rang 3 → <b>18 €</b>. Q₃ : 33 ÷ 4 = 8,25 → rang 9 → <b>34 €</b>.</p>`,
      attention: 'Sans ranger la série, la valeur du milieu de la liste n’est pas la médiane.', astuce: { k: 'sens', t: 'Médiane 25 € : la moitié des clients dépense 25 € ou moins.' } },
    { titre: 'Dispersion et boîte à moustaches', decouvre: { txt: `Deux magasins ont le même panier moyen. Dans l’un, tous les paniers se ressemblent. Comment le montrer ?`, img: P.boite() },
      comprends: `<p>Deux séries peuvent avoir la même moyenne et être très différentes. La <b>dispersion</b> dit si les valeurs sont serrées ou étalées.</p><p>L’<b>étendue</b> est l’écart entre la plus grande et la plus petite valeur.</p><p>L’<b>écart interquartile</b> ${M('Q_3-Q_1')} mesure la moitié centrale des valeurs. Une valeur extrême ne le change pas.</p><p>La <b>boîte à moustaches</b> dessine ces cinq nombres : min, ${M('Q_1')}, médiane, ${M('Q_3')}, max. Une boîte étroite signifie des valeurs régulières.</p><p>L’<b>écart type</b> σ mesure l’écart moyen à la moyenne. On le calcule dans Excel avec ${M(R`\texttt{=ECARTYPE.PEARSON(B2:B21)}`)}.</p>`,
      vois: boiteVis, voisLeg: 'La boîte va de Q₁ à Q₃, le trait intérieur est la médiane, les moustaches vont jusqu’au minimum et au maximum.',
      retiens: `<p>${FM(R`\text{étendue}=\max-\min`)} · ${FM(R`\text{écart interquartile}=Q_3-Q_1`)}</p><p>Pour comparer deux séries : on compare les médianes (où se trouvent les valeurs) et les écarts interquartiles (la régularité).</p>`,
      exemple: `<p>Tickets de 12 € à 58 € : étendue = 58 − 12 = <b>46 €</b>.</p><p>Q₃ − Q₁ = 34 − 18 = <b>16 €</b> : la moitié centrale des paniers tient dans 16 €.</p>`,
      attention: 'La boîte contient la moitié des valeurs, pas toutes : les moustaches complètent.', astuce: { k: 'verif', t: 'Toujours : min ≤ Q₁ ≤ médiane ≤ Q₃ ≤ max.' } }];
  chk(rnd(216) === 216 && .6 * 360 === 216 && (14 + 12) / 20 === 1.3 && 58 - 12 === 46 && 34 - 18 === 16, 'c2 notions');

  c.mots = [['effectif', 'nombre de fois où une valeur apparaît', '12 clients ont payé par carte.'], ['fréquence', 'effectif ÷ effectif total, souvent en %', '60 % des tickets sont payés par carte.'], ['moyenne', 'somme des valeurs ÷ nombre de valeurs', 'Le panier moyen est de 27,30 €.'], ['médiane', 'valeur du milieu de la série rangée', 'La moitié des clients attend 4 min ou moins.'], ['quartiles Q₁ et Q₃', 'valeurs qui coupent la série rangée au quart et aux trois quarts', '75 % des paniers valent 34 € ou moins.'], ['étendue', 'max − min', 'Les attentes vont de 1 à 12 min : étendue 11 min.'], ['écart type', 'mesure de l’écart moyen à la moyenne (Excel)', 'Un petit écart type : des ventes régulières.']];

  /* ---------- exercices résolus ---------- */
  const W = [4, 7, 2, 9, 5, 3, 8, 6, 12], ws = W.slice().sort((a, b) => a - b);
  chk(ws[4] === 6 && ws[Math.ceil(9 / 4) - 1] === 4 && ws[Math.ceil(27 / 4) - 1] === 8 && ws.join(' ') === '2 3 4 5 6 7 8 9 12', 'c2 résolus');
  c.resolus = [
    { titre: 'Médiane et quartiles d’une liste', outil: '✏️ à la main', enonce: `Montants de ${H('11 tickets')} (en €) : ${H('25 ; 18 ; 41 ; 12 ; 30 ; 22 ; 58 ; 15 ; 27 ; 34 ; 18')}. Trouve la médiane et les quartiles.`,
      rows: [['12 ; 15 ; 18 ; 18 ; 22 ; <b class="nw">25</b> ; 27 ; 30 ; 34 ; 41 ; 58', 'Je range la série. Je compte : N = 11.'], ['Médiane : rang (11 + 1) ÷ 2 = 6 → <b class="nw">25 €</b>', 'N est impair : je prends la valeur du milieu.'], ['Q<sub>1</sub> : 11 ÷ 4 = 2,75 → rang 3 → <b class="nw">18 €</b>', 'J’arrondis le rang à l’entier supérieur.'], ['Q<sub>3</sub> : 33 ÷ 4 = 8,25 → rang 9 → <b class="nw">34 €</b>', 'Même méthode avec 3N ÷ 4.']], verif: '12 ≤ 18 ≤ 25 ≤ 34 ≤ 58 : les valeurs sont dans le bon ordre.', rep: 'Médiane 25 € ; Q₁ = 18 € ; Q₃ = 34 €.', go: ['e2'] },
    { titre: 'À toi : la même méthode', outil: '✏️ à la main', enonce: `Temps d’attente de ${H('9 clients')} (en min) : ${H('4 ; 7 ; 2 ; 9 ; 5 ; 3 ; 8 ; 6 ; 12')}. Trouve la médiane et les quartiles.`, trous: [0, 1, 2, 3],
      rows: [['2 ; 3 ; 4 ; ⟦5⟧ ; 6 ; 7 ; ⟦8⟧ ; 9 ; 12', 'Je range la série. Je compte : N = 9.'], ['Médiane : rang (9 + 1) ÷ 2 = ⟦5⟧ → ⟦6 min⟧', 'N est impair : je prends la valeur du milieu.'], ['Q<sub>1</sub> : 9 ÷ 4 = 2,25 → rang ⟦3⟧ → ⟦4 min⟧', 'J’arrondis le rang à l’entier supérieur.'], ['Q<sub>3</sub> : 27 ÷ 4 = 6,75 → rang ⟦7⟧ → ⟦8 min⟧', 'Même méthode avec 3N ÷ 4.']], verif: '2 ≤ 4 ≤ 6 ≤ 8 ≤ 12 : les valeurs sont dans le bon ordre.', rep: 'Médiane 6 min ; Q₁ = 4 min ; Q₃ = 8 min.', go: ['e2'] }];
  c.entraine = [{ id: 'e1', gen: 'c2e1', lc: 1 }, { id: 'e2', gen: 'c2e2', lc: 3 }, { id: 'e3', gen: 'c2e3', lc: 2 }];

  /* ---------- je résous ---------- */
  const pick = id => old.probs.find(p => p.id === id);
  c.probs = [
    adapt(pick('p1'), { etape: 2, hints: ['Lis la hauteur de chaque barre : c’est le nombre de clients.', 'Notion 2 : moyenne avec des effectifs.', 'c. (1 × 4 + 2 × 9 + 3 × 12 + …) ÷ 40.'], err: { 1: [{ v: 30, m: 'Tu as pris seulement les clients à 3 min. « 3 minutes ou moins » : additionne 1, 2 et 3 min.' }], 2: [{ v: 3.5, m: 'Tu as fait la moyenne des durées sans les effectifs. Multiplie chaque durée par son nombre de clients.' }] } }),
    adapt(pick('c1'), { etape: 3, defi: 4, bulle: 'Ce cas se fait en 4 étapes. Tu sais déjà lire une boîte : c’est la notion 4. Commence par repérer Q₁, Me et Q₃ de chaque magasin.', autravail: { comp: 'ana', txt: 'comparer deux magasins pour savoir où renforcer l’équipe ou adapter l’offre.' }, hints: ['Le trait dans la boîte est la médiane.', 'Écart interquartile = bord droit − bord gauche de la boîte.', 'Le magasin le plus régulier a la boîte la plus étroite.'], err: { 1: [{ v: 66, m: 'Tu as calculé l’étendue (max − min). L’écart interquartile, c’est Q₃ − Q₁.' }] } }),
    adapt(pick('b1'), { etape: 4, defi: 5, bulle: 'Voici la question du début du chapitre ! Elle se fait en 5 étapes. Pour les classes, remplace chaque intervalle par son centre. Une question ratée ne fait pas un exercice raté : continue.', autravail: { comp: 'com', txt: 'rendre compte à son responsable de la qualité de l’accueil, chiffres à l’appui.' }, hints: ['La classe modale a le plus grand effectif.', 'Centres des classes : 1 ; 3 ; 5 ; 7 ; 9.', 'Moins de 4 minutes : les classes [0 ; 2[ et [2 ; 4[.'], err: { 2: [{ v: 37.5, m: 'Tu as pris une seule classe. « Moins de 4 minutes » regroupe [0 ; 2[ et [2 ; 4[.' }] } })];

  c.bilan = [['Je sais calculer une fréquence.', ['e1']], ['Je sais calculer une moyenne avec des effectifs.', ['e3', 'p1']], ['Je sais trouver la médiane et les quartiles.', ['e2']], ['Je sais comparer deux séries avec des boîtes.', ['c1']], ['Je sais vérifier un objectif avec des données.', ['b1']]];
  c.words = old.words;
  c.plusloin = { meca: old.meca.filter(m => m.gen !== 'sigma'), probs: old.probs.filter(p => !['p1', 'c1', 'b1'].includes(p.id)) };
  return c;
};
