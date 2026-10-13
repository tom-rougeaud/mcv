/* Chapitre 1 · Prix, marges et TVA — version 3 (module « Calculs commerciaux et financiers », BO 2019). */
'use strict';
const K = require('../lib/kit3');
const { rnd, fr, eur, pct, H, FM, M, R, adapt, D } = K;
const { S, T, Rc, Ln, Ar, Br, st } = require('../lib/visu');
const P = require('../lib/pics');
const V2 = require('../content2/c1.js');

module.exports = function (chk) {
  const old = V2(chk);
  const c = { id: 'c1', n: 1, col: 'nombre', icone: '🏷️', dom: 'Calculs commerciaux', titre: 'Prix, marges et TVA' };
  c.travail = { question: `Une veste affichée ${H('89,90 €')} va être soldée. Le magasin doit garder un ${H('taux de marque d’au moins 30 %')}. Quelle remise maximale peux-tu proposer ? Tu sauras répondre à la fin du chapitre (sujet « vers le bac »).` };
  c.objectifs = ['Je saurai calculer un pourcentage d’un prix.', 'Je saurai appliquer une hausse ou une baisse avec un coefficient multiplicateur.', 'Je saurai passer du prix HT au prix TTC, et revenir au HT.', 'Je saurai calculer une marge, un taux de marge et un taux de marque.'];
  c.depart = 'c1';

  /* ---------- méthodes visuelles ---------- */
  const X = t => 50 + t * 5;   // 0 % → 50, 100 % → 550
  const barre100 = S(600, 190, st(1, Rc(50, 50, 500, 40, { c: 'k2' }) + [0, 10, 25, 50, 100].map(t => Ln(X(t), 42, X(t), 98) + T(X(t), 34, t + ' %', { fs: 14, c: 'kt' })).join('') + T(X(0), 120, '0 €', { fs: 15 }) + T(X(100), 120, '240 €', { fs: 16 }))
    + st(2, Rc(50, 50, 75, 40, { c: 'k', s: false, op: .85 }) + T(X(15) - 37, 76, '15 %', { fs: 14, c: 'tw' }) + T(X(10), 120, '24 €', { fs: 15 }) + T(X(25), 120, '60 €', { fs: 15 }) + T(X(50), 120, '120 €', { fs: 15 }))
    + st(3, Ar(125, 150, 125, 98, { w: 2.5 }) + T(125, 172, '15 % de 240 € = 240 × 0,15 = 36 €', { fs: 16, c: 'kt', a: 'start' })), 'La barre des 100 % alignée sur un prix de 240 €');
  const flecheCM = S(600, 210, st(1, Rc(30, 30, 120, 50, { c: 'k2' }) + T(90, 62, '120 €', { fs: 20 }) + Rc(450, 30, 120, 50, { c: 'k2' }) + T(510, 62, '90 €', { fs: 20 }))
    + st(2, Ar(160, 55, 440, 55, { lab: '− 25 %   donc   × 0,75', fs: 17, dy: -12 }))
    + st(3, Rc(160, 100, 280, 30, { c: 'k2' }) + Rc(160, 100, 210, 30, { c: 'k', s: false, op: .8 }) + T(265, 120, 'il reste 75 %', { fs: 14, c: 'tw' }) + T(405, 120, '25 %', { fs: 13 }) + T(300, 150, '100 % − 25 % = 75 % = 0,75', { fs: 15, c: 'kt' }))
    + st(4, T(300, 190, '+ 10 % puis − 10 % : × 1,1 × 0,9 = × 0,99 → on ne revient pas au départ !', { fs: 14 })), 'La flèche du coefficient multiplicateur');
  const pile = S(600, 200, st(1, Rc(40, 40, 400, 54, { c: 'k2' }) + T(240, 74, 'prix HT : 150 €  (100 %)', { fs: 17 }))
    + st(2, Rc(440, 40, 80, 54, { c: 'k', s: false }) + T(480, 66, 'TVA', { fs: 15, c: 'tw' }) + T(480, 84, '30 €', { fs: 14, c: 'tw' }))
    + st(3, Br(40, 520, 104, 'prix TTC : 180 €  (120 %)', { fs: 17 }))
    + st(4, Ar(60, 160, 260, 160, { lab: '× 1,2', fs: 16, dy: 22 }) + T(160, 152, 'HT → TTC', { fs: 13, c: 'ts' }) + Ar(540, 160, 340, 160, { lab: '÷ 1,2', fs: 16, dy: 22 }) + T(440, 152, 'TTC → HT', { fs: 13, c: 'ts' })), 'Le prix TTC est la somme du HT et de la TVA');
  const marge = S(600, 200, st(1, Rc(50, 60, 250, 50, { c: 'k2' }) + T(175, 90, 'coût d’achat 32,50 €', { fs: 16 }))
    + st(2, Rc(300, 60, 250, 50, { c: 'k', s: false, op: .85 }) + T(425, 90, 'marge 32,50 €', { fs: 16, c: 'tw' }))
    + st(3, Br(50, 550, 120, 'prix de vente HT : 65 €', { fs: 16 }))
    + st(4, T(175, 40, 'taux de marge = marge ÷ coût = 100 %', { fs: 14, c: 'kt' }) + T(425, 175, '', {}) + T(300, 186, 'taux de marque = marge ÷ prix de vente HT = 50 %', { fs: 14, c: 'kt' })), 'Le prix de vente est le coût d’achat plus la marge');

  c.notions = [
    { titre: 'Prendre un pourcentage', decouvre: { txt: `Une veste coûte ${H('240 €')}. Le magasin annonce « ${H('− 15 %')} ». De combien d’euros le prix baisse-t-il ?`, img: P.pourcentage() },
      comprends: `<p>« Pour cent » veut dire « sur 100 ». 15 % signifie : 15 € retirés sur chaque tranche de 100 €.</p><p>Un prix de 240 €, c’est 2,4 fois 100 €. La baisse vaut donc 15 × 2,4 = 36 €.</p><p>Plus rapide : on multiplie le prix par ${M(R`\dfrac{15}{100}`)}, c’est-à-dire par 0,15.</p><p>Certains pourcentages se calculent de tête : 50 %, c’est la moitié ; 25 %, le quart ; 10 %, le dixième.</p><p>Pour trouver la part que représente un nombre, on fait l’inverse : on divise la partie par le total.</p><p>Au magasin, on s’en sert pour afficher une remise ou calculer une part des ventes.</p>`,
      vois: barre100, voisLeg: 'La barre représente 100 % du prix. Chaque pourcentage correspond à une part de la barre.',
      retiens: `<p>${FM(R`t\,\%\text{ de }Q = Q\times\dfrac{t}{100}`)}</p><p>${FM(R`\text{proportion}=\dfrac{\text{partie}}{\text{total}}`)} puis × 100 pour l’écrire en %.</p>`,
      exemple: `<p>15 % de 240 € : 240 × 0,15 = <b>36 €</b>. La veste coûte 240 − 36 = <b>204 €</b>.</p><p>36 € sur 240 € : 36 ÷ 240 = 0,15, soit <b>15 %</b>.</p>`,
      attention: '15 % de 240, ce n’est pas 240 ÷ 15. On multiplie par 0,15.', astuce: { k: 'vite', t: '10 % : divise par 10. 5 % : la moitié de 10 %. 20 % : deux fois 10 %.' } },
    { titre: 'Le coefficient multiplicateur', decouvre: { txt: `Un pantalon à ${H('120 €')} baisse de ${H('25 %')}. Comment trouver le nouveau prix en un seul calcul ?`, img: P.coef() },
      comprends: `<p>Après une baisse de 25 %, il reste 100 % − 25 % = 75 % du prix.</p><p>Le nouveau prix est donc 75 % de 120 € : 120 × 0,75 = 90 €.</p><p>Le nombre 0,75 s’appelle le <b>coefficient multiplicateur</b> (CM). Pour une hausse de 5 %, on obtient 105 % du prix : CM = 1,05.</p><p>Deux évolutions à la suite ? On multiplie les coefficients. On n’additionne jamais les pourcentages.</p><p>Pour mesurer une évolution entre deux prix, on calcule le <b>taux d’évolution</b> : la variation divisée par la valeur de départ.</p><p>Au travail, on s’en sert pour étiqueter vite tout un rayon soldé.</p>`,
      vois: flecheCM, voisLeg: 'La flèche relie le prix de départ au prix d’arrivée : on multiplie par le coefficient.',
      retiens: `<p>Hausse de t % : ${FM(R`\times\left(1+\dfrac{t}{100}\right)`)} · baisse : ${FM(R`\times\left(1-\dfrac{t}{100}\right)`)}</p><p>Taux d’évolution : ${FM(R`t=\dfrac{V_1-V_0}{V_0}`)} · deux évolutions : ${FM(R`\text{CM}=\text{CM}_1\times\text{CM}_2`)}</p>`,
      exemple: `<p>− 25 % sur 120 € : 120 × 0,75 = <b>90 €</b>.</p><p>De 50 € à 60 € : (60 − 50) ÷ 50 = 0,2, soit <b>+ 20 %</b>.</p>`,
      attention: '+ 10 % puis − 10 % ne ramène pas au prix de départ : 1,1 × 0,9 = 0,99, soit − 1 %.', astuce: { k: 'sens', t: 'Une baisse donne un coefficient plus petit que 1, une hausse un coefficient plus grand que 1.' } },
    { titre: 'Prix HT, TVA, prix TTC', decouvre: { txt: `Une perceuse coûte ${H('150 € HT')}. Le client paie la ${H('TVA à 20 %')} en plus. Quel prix affiche-t-on en rayon ?`, img: P.ttc() },
      comprends: `<p>Le prix <b>hors taxes</b> (HT) revient au magasin. La <b>TVA</b> est un impôt payé par le client : le magasin la reverse ensuite à l’État.</p><p>Le prix <b>toutes taxes comprises</b> (TTC) est la somme des deux. C’est le prix affiché en rayon.</p><p>La TVA se calcule sur le HT. Avec un taux de 20 %, le TTC vaut 120 % du HT : on multiplie par 1,2.</p><p>Pour revenir du TTC au HT, on fait le chemin inverse : on divise par 1,2.</p><p>Sur un ticket de caisse, le TTC est toujours le prix payé.</p>`,
      vois: pile, voisLeg: 'Le HT et la TVA s’empilent pour former le prix TTC. Pour aller dans un sens, on multiplie ; dans l’autre, on divise.',
      retiens: `<p>${FM(R`\text{TVA}=\text{HT}\times\text{taux}`)} · ${FM(R`\text{TTC}=\text{HT}\times(1+\text{taux})`)} · ${FM(R`\text{HT}=\dfrac{\text{TTC}}{1+\text{taux}}`)}</p>`,
      exemple: `<p>150 € HT, TVA 20 % : 150 × 1,2 = <b>180 € TTC</b> (TVA : 30 €).</p><p>54 € TTC, TVA 20 % : 54 ÷ 1,2 = <b>45 € HT</b>.</p>`,
      wide: `<table class="tbl tvat"><tr><th>TVA</th><th>Exemples</th><th>Coefficient</th></tr><tr><td><b>20 %</b></td><td>la plupart des produits : vêtements, sport, multimédia</td><td>1,2</td></tr><tr><td><b>10 %</b></td><td>restauration, transport, hôtel</td><td>1,1</td></tr><tr><td><b>5,5 %</b></td><td>alimentation, livres</td><td>1,055</td></tr><tr><td><b>2,1 %</b></td><td>médicaments remboursés</td><td>1,021</td></tr></table><p class="srcl">Source : economie.gouv.fr, taux de TVA en vigueur (janvier 2026).</p>`,
      attention: 'Le HT n’est pas « TTC − 20 % » : 54 − 20 % = 43,20 €, pas 45 €.', astuce: { k: 'verif', t: 'Avec 20 %, la TVA est le sixième du TTC : 54 ÷ 6 = 9 € ; 54 − 9 = 45 € ✓.' } },
    { titre: 'La marge, le taux de marge, le taux de marque', decouvre: { txt: `Le magasin achète une veste ${H('32,50 € HT')} et la vend ${H('65 € HT')}. Combien gagne-t-il sur chaque veste ?`, img: P.marge() },
      comprends: `<p>Le <b>coût d’achat</b> est ce que paie le magasin pour avoir l’article : le prix d’achat, plus les frais (transport…).</p><p>La <b>marge</b> est ce qui reste quand on retire le coût d’achat du prix de vente HT.</p><p>On compare la marge de deux façons. Le <b>taux de marge</b> la compare au coût d’achat : il sert à fixer un prix. Le <b>taux de marque</b> la compare au prix de vente : il sert à suivre la rentabilité.</p><p>Tout se calcule avec des prix HT, car la TVA n’appartient pas au magasin.</p>`,
      vois: marge, voisLeg: 'Le prix de vente HT se partage entre le coût d’achat et la marge.',
      retiens: `<p>${FM(R`\text{marge}=\text{prix de vente HT}-\text{coût d’achat}`)}</p><p>${FM(R`\text{taux de marge}=\dfrac{\text{marge}}{\text{coût d’achat}}`)} · ${FM(R`\text{taux de marque}=\dfrac{\text{marge}}{\text{prix de vente HT}}`)}</p>`,
      exemple: `<p>Marge : 65 − 32,50 = <b>32,50 €</b>.</p><p>Taux de marge : 32,50 ÷ 32,50 = <b>100 %</b>. Taux de marque : 32,50 ÷ 65 = <b>50 %</b>.</p>`,
      attention: 'Ne calcule jamais une marge avec un prix TTC : retire d’abord la TVA.', astuce: { k: 'og', t: 'Le taux de marque reste toujours sous 100 %. Le taux de marge, lui, peut dépasser 100 %.' } }];
  chk(rnd(240 * .15) === 36 && rnd(120 * .75) === 90 && rnd(1.1 * .9, 2) === .99 && 150 * 1.2 === 180 && rnd(54 / 1.2) === 45 && rnd(54 * .8) === 43.2 && 65 - 32.5 === 32.5 && (60 - 50) / 50 === .2, 'c1 notions');

  c.mots = [['pourcentage', 'nombre de parts sur 100', '15 % des clients paient sans contact.'], ['coefficient multiplicateur (CM)', 'nombre par lequel on multiplie pour appliquer une évolution', '− 25 % : × 0,75.'], ['taux d’évolution', 'variation divisée par la valeur de départ', 'Les ventes ont augmenté de 8 %.'], ['HT, TVA, TTC', 'hors taxes ; taxe sur la valeur ajoutée ; toutes taxes comprises', 'Le prix en rayon est TTC.'], ['coût d’achat', 'prix d’achat + frais', 'Avec le transport, la veste revient à 32,50 € HT.'], ['marge', 'prix de vente HT − coût d’achat', 'Le magasin gagne 32,50 € par veste.'], ['taux de marque', 'marge ÷ prix de vente HT', 'L’enseigne veut au moins 30 %.']];

  /* ---------- exercices résolus ---------- */
  const so = rnd(129 * .7);
  chk(rnd(44.9 * .65) === 29.19 && so === 90.3, 'c1 résolus');
  c.resolus = [
    { titre: 'Appliquer une baisse avec le coefficient', outil: '🧮 calculatrice', enonce: `Un sac à dos coûte ${H('44,90 €')}. Il est soldé ${H('− 35 %')}. Calcule son prix soldé.`,
      rows: [['Baisse de <b class="nw">35 %</b>', 'Je repère le sens (baisse) et le taux.'], ['CM = 1 − 0,35 = <b class="nw">0,65</b>', 'Une baisse : j’enlève le taux de 1.'], ['44,90 × 0,65 = 29,185', 'Je multiplie le prix par le coefficient.'], ['Prix soldé ≈ <b class="nw">29,19 €</b>', 'J’arrondis au centime.']], verif: '45 × 0,6 = 27 : on trouve un peu plus, et moins que 44,90 €. C’est cohérent.', rep: 'Le sac soldé coûte 29,19 €.', go: ['e2'] },
    { titre: 'À toi : la même méthode', outil: '🧮 calculatrice', enonce: `Un manteau coûte ${H('129 €')}. Il est soldé ${H('− 30 %')}. Calcule son prix soldé.`, trous: [1, 2, 3],
      rows: [['Baisse de <b class="nw">30 %</b>', 'Je repère le sens (baisse) et le taux.'], ['CM = 1 − 0,30 = ⟦0,7⟧', 'Une baisse : j’enlève le taux de 1.'], ['129 × ⟦0,7⟧ = ⟦90,3⟧', 'Je multiplie le prix par le coefficient.'], ['Prix soldé = ⟦90,30 €⟧', 'J’écris le résultat au centime, avec l’unité.']], verif: '130 × 0,7 = 91 : le résultat est proche et plus petit que 129 €.', rep: 'Le manteau soldé coûte 90,30 €.', go: ['e2'] }];
  c.entraine = [{ id: 'e1', gen: 'c1e1', lc: 1 }, { id: 'e2', gen: 'c1e2', lc: 2 }, { id: 'e3', gen: 'c1e3', lc: 3 }];

  /* ---------- je résous : 3 problèmes repris de la version 2, adaptés ---------- */
  const pick = id => old.probs.find(p => p.id === id);
  c.probs = [
    adapt(pick('p5'), { etape: 2, titre: 'Le coefficient de vente', hints: ['Relis la donnée : on passe du prix d’achat HT au prix de vente TTC en multipliant par 2,4.', 'Notion 3 : pour retirer la TVA, divise par 1,2.', 'a. 22,90 × 2,4 = …'], err: { 0: [{ v: 25.3, m: 'On multiplie par 2,4 ; on n’ajoute pas 2,4.' }], 1: [{ v: 43.92, m: 'Le HT n’est pas « TTC − 20 % » : divise par 1,2.' }] } }),
    adapt(pick('c2'), { etape: 3, defi: 4, bulle: 'Ce cas se fait en 4 étapes. Tu sais déjà calculer un taux d’évolution : c’est la notion 2. Prends le temps de lire le graphique.', autravail: { comp: 'val', txt: 'vérifier qu’une promotion respecte la loi avant de l’afficher en magasin.' }, hints: ['Relis le document 1 : la réduction se calcule à partir du prix le plus bas des 30 jours précédents.', 'Sur le graphique, repère le 28/11 et remonte 30 jours en arrière.', 'Taux de réduction : (59,99 − 79,99) ÷ 79,99.'] }),
    adapt(pick('b1'), { etape: 4, defi: 6, bulle: 'Voici la question du début du chapitre ! Elle se fait en 6 étapes. Les étapes 1 à 4 ressemblent aux exemples des notions 3 et 4. Une question ratée ne fait pas un exercice raté : continue avec la suivante.', autravail: { comp: 'com', txt: 'proposer à son responsable une remise qui protège la marge du magasin.' }, hints: ['Coût d’achat = prix d’achat + frais d’approche.', 'Pour le taux de marque, travaille avec des prix HT : divise le TTC par 1,2.', 'Taux de marque = marge ÷ prix de vente HT.'] })];

  c.bilan = [['Je sais calculer un pourcentage d’un prix.', ['e1']], ['Je sais appliquer une évolution avec un coefficient.', ['e2']], ['Je sais passer du HT au TTC, et l’inverse.', ['e3', 'p5']], ['Je sais calculer une marge et un taux de marque.', ['p5', 'b1']], ['Je sais vérifier une promotion.', ['c2']]];
  c.words = old.words;
  c.plusloin = { meca: old.meca, probs: old.probs.filter(p => !['p5', 'c2', 'b1'].includes(p.id)) };
  return c;
};
