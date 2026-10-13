/* Chapitre 4 · Factures, réductions et intérêts — version 3 (module « Calculs commerciaux et financiers », BO 2019). */
'use strict';
const K = require('../lib/kit3');
const { rnd, H, FM, M, R, adapt } = K;
const { S, T, Rc, Ln, Ar, Br, st } = require('../lib/visu');
const P = require('../lib/pics');
const V2 = require('../content2/c4.js');

module.exports = function (chk) {
  const old = V2(chk);
  const c = { id: 'c4', n: 4, col: 'verbe', icone: '🧾', dom: 'Calculs commerciaux', titre: 'Factures, réductions et intérêts' };
  c.travail = { question: `Un bar de plage doit recevoir ${H('40 parasols')} dans ${H('10 jours')}. Deux fournisseurs envoient un devis, avec des remises différentes. Lequel retenir ? Tu sauras répondre à la fin du chapitre (sujet « vers le bac »).` };
  c.objectifs = ['Je saurai distinguer remise, rabais et ristourne.', 'Je saurai appliquer deux réductions successives.', 'Je saurai compléter une facture, de la quantité au net à payer.', 'Je saurai calculer des intérêts simples et une valeur acquise.'];
  c.depart = 'c4';

  /* ---------- méthodes visuelles ---------- */
  // 1. l’escalier des remises : 500 € − 10 % puis − 5 %
  const hy = v => 200 - v * .3;   // 500 € → 50
  const marche = (x, v, lab, cls) => Rc(x, hy(v), 120, 200 - hy(v), { c: cls, rx: 4 }) + T(x + 60, hy(v) + 26, lab, { fs: 17, c: cls === 'k' ? 'tw' : 'tx' });
  const escalier = S(600, 272, st(1, marche(40, 500, '500 €', 'k2') + T(100, 226, 'prix brut', { fs: 13, c: 'ts' }))
    + st(2, Ar(166, hy(500) + 14, 226, hy(450) + 14, { lab: '× 0,90', fs: 15, dy: -12 }) + marche(230, 450, '450 €', 'k2') + T(290, 226, 'après − 10 %', { fs: 13, c: 'ts' }))
    + st(3, Ar(356, hy(450) + 14, 416, hy(427.5) + 14, { lab: '× 0,95', fs: 15, dy: -12 }) + marche(420, 427.5, '427,50 €', 'k') + T(480, 226, 'après − 5 %', { fs: 13, c: 'ts' }))
    + st(4, T(300, 246, 'chaque marche part du prix de la marche d’avant', { fs: 14, c: 'kt' }) + T(300, 266, '« − 15 % » d’un coup donnerait 500 × 0,85 = 425 € : ce n’est pas pareil', { fs: 13 })), 'L’escalier des remises : chaque remise part du net précédent');
  // 2. la facture annotée
  const FL = [['20 × 18,50 €', 'Montant brut HT', '370,00 €'], ['', 'Remise 10 %', '− 37,00 €'], ['', 'Net commercial HT', '333,00 €'], ['', 'Frais de port HT', '+ 12,00 €'], ['', 'Total HT', '345,00 €'], ['', 'TVA 20 %', '+ 69,00 €'], ['', 'Net à payer TTC', '414,00 €']];
  const fy = i => 30 + i * 30;
  const facture = S(600, 250, st(1, Rc(30, 18, 380, 220, { c: 'k2', rx: 8 }) + FL.map(([q, l, v], i) => (i % 2 === 0 ? Rc(40, fy(i), 360, 26, { c: i === 6 ? 'k' : 'k2', rx: 4, s: i === 6 ? false : true, sw: 1 }) : '') + T(54, fy(i) + 18, l, { fs: 14, a: 'start', c: i === 6 ? 'tw' : 'tx', w: i % 2 === 0 ? 700 : 400 }) + T(392, fy(i) + 18, v, { fs: 14, a: 'end', c: i === 6 ? 'tw' : 'tx' })).join(''))
    + st(2, Ar(420, fy(0) + 13, 420, fy(2) + 13, { w: 2.4 }) + T(432, fy(1) + 18, '− la remise', { fs: 13, a: 'start', c: 'kt' }) + T(432, fy(0) + 18, 'quantité × prix unitaire', { fs: 12, a: 'start', c: 'ts' }))
    + st(3, Ar(420, fy(2) + 13, 420, fy(4) + 13, { w: 2.4 }) + T(432, fy(3) + 18, '+ le port', { fs: 13, a: 'start', c: 'kt' }))
    + st(4, Ar(420, fy(4) + 13, 420, fy(6) + 13, { w: 2.4 }) + T(432, fy(5) + 18, '+ TVA (× 1,2)', { fs: 13, a: 'start', c: 'kt' }) + T(432, fy(6) + 18, 'ce que paie le client', { fs: 12, a: 'start', c: 'ts' })), 'Une facture lue de haut en bas : chaque ligne se calcule avec la précédente');
  // 3. la frise des intérêts : 3 600 € à 2,5 % par an
  const tx = m => 50 + m * 42;   // 0 → 50, 12 mois → 554
  const frise = S(600, 272, st(1, Ln(40, 200, 570, 200, { w: 2 }) + Array.from({ length: 13 }, (_, m) => Ln(tx(m), 195, tx(m), 205, { w: 1.4 }) + (m % 3 === 0 ? T(tx(m), 224, m + ' mois', { fs: 11, w: 400 }) : '')).join('') + T(300, 246, 'capital : 3 600 € placés à 2,5 % par an', { fs: 13, c: 'ts' }))
    + st(2, Array.from({ length: 12 }, (_, m) => Rc(tx(m) + 4, 196 - (m + 1) * 11, 34, (m + 1) * 11 - 2, { c: m === 7 ? 'k' : 'k2', rx: 3, sw: 1.4 })).join('') + T(tx(0) + 21, 176, '7,50', { fs: 11 }) + T(160, 40, 'chaque mois : + 7,50 € d’intérêts', { fs: 14, c: 'kt' }))
    + st(3, Ar(tx(7) + 21, 64, tx(7) + 21, 100, { w: 2.2 }) + T(tx(7) + 21, 56, '8 mois : 8 × 7,50 = 60 €', { fs: 14, c: 'kt' }))
    + st(4, T(tx(12) + 2, 50, '1 an : 90 €', { fs: 14, a: 'end' }) + T(300, 266, 'les intérêts montent comme un escalier régulier', { fs: 13, c: 'kt' })), 'La frise du temps : les intérêts s’empilent de la même hauteur chaque mois');
  chk(rnd(500 * .9) === 450 && rnd(450 * .95) === 427.5 && 500 * .85 === 425 && 20 * 18.5 === 370 && 370 * .9 === 333 && 333 + 12 === 345 && rnd(345 * .2) === 69 && rnd(345 * 1.2) === 414 && rnd(3600 * .025 / 12) === 7.5 && rnd(3600 * .025 * 8 / 12) === 60 && rnd(3600 * .025) === 90, 'c4 visuels');

  c.notions = [
    { titre: 'Les réductions commerciales', decouvre: { txt: `Un fournisseur accorde ${H('− 10 %')} puis ${H('− 5 %')} sur une commande de ${H('500 €')}. Cela fait-il ${H('− 15 %')} ?`, img: P.remise() },
      comprends: `<p>Une entreprise baisse parfois ses prix pour un client. Le nom de la réduction dépend de sa raison.</p><p>La <b>remise</b> récompense une grosse quantité ou un client fidèle. Le <b>rabais</b> compense un défaut ou un retard de livraison. La <b>ristourne</b> est accordée en fin de période, selon le chiffre d’affaires.</p><p>Quand il y a plusieurs réductions, chacune s’applique au prix déjà réduit : le <b>net précédent</b>.</p><p>On multiplie donc les coefficients, comme au chapitre 1. On n’additionne jamais les pourcentages.</p><p>Le nom exact compte : il figure sur la facture.</p>`,
      vois: escalier, voisLeg: 'Chaque marche de l’escalier est une réduction. La deuxième remise se calcule sur 450 €, pas sur 500 €.',
      retiens: `<p>Une remise de t % : ${FM(R`\text{net}=\text{brut}\times\left(1-\dfrac{t}{100}\right)`)}</p><p>Deux remises : ${FM(R`\text{net}=\text{brut}\times\text{CM}_1\times\text{CM}_2`)}</p>`,
      exemple: `<p>500 × 0,90 = 450 € ; 450 × 0,95 = <b>427,50 €</b>.</p><p>Réduction totale : 72,50 €, soit 14,5 %, et non 15 %.</p>`,
      attention: '− 10 % puis − 5 % ne font pas − 15 % : 0,90 × 0,95 = 0,855, soit − 14,5 %.', astuce: { k: 'sens', t: 'Remise = quantité ou fidélité. Rabais = défaut. Ristourne = fin d’année.' } },
    { titre: 'Devis et facture', decouvre: { txt: `Un client commande ${H('20 articles à 18,50 € HT')}, avec ${H('10 % de remise')} et ${H('12 € de port')}. Combien va-t-il payer ?`, img: P.facture() },
      comprends: `<p>Le <b>devis</b> annonce un prix avant la vente. La <b>facture</b> réclame le paiement après la vente. Les deux se calculent de la même façon.</p><p>On lit une facture <b>de haut en bas</b>. Chaque ligne se calcule avec la ligne du dessus.</p><p>D’abord le montant brut : quantité × prix unitaire. Puis on retire les réductions : on obtient le net commercial. On ajoute les frais de port : c’est le total HT. Enfin, on ajoute la TVA : c’est le net à payer.</p><p>Une facture porte aussi des <b>mentions obligatoires</b> : numéro, date, SIREN, taux de TVA, pénalités de retard.</p>`,
      vois: facture, voisLeg: 'Chaque flèche dit ce qu’on fait pour passer d’une ligne à la suivante.',
      retiens: `<p>${FM(R`\text{brut}=\text{quantité}\times\text{P.U. HT}`)} → − réductions → ${FM(R`\text{net commercial}`)} → + port → ${FM(R`\text{total HT}`)} → × 1,2 → ${FM(R`\text{net à payer TTC}`)}</p>`,
      exemple: `<p>20 × 18,50 = 370 € ; 370 × 0,9 = 333 € ; 333 + 12 = 345 € HT.</p><p>345 × 1,2 = <b>414 € TTC</b> (dont 69 € de TVA).</p>`,
      attention: 'La remise se calcule sur le brut, avant les frais de port. La TVA se calcule sur le total HT, port compris.', astuce: { k: 'og', t: 'Le net à payer est toujours plus grand que le total HT : la TVA s’ajoute.' } },
    { titre: 'L’intérêt simple', decouvre: { txt: `Un magasin place ${H('3 600 €')} à ${H('2,5 % par an')}. Combien gagne-t-il en ${H('8 mois')} ?`, img: P.interets() },
      comprends: `<p>Placer de l’argent, c’est le prêter à une banque. En échange, la banque verse des <b>intérêts</b>.</p><p>Le <b>taux annuel</b> dit ce que rapporte le capital en un an. 2,5 % de 3 600 €, c’est 90 € par an.</p><p>Avec les <b>intérêts simples</b>, on gagne la même somme chaque mois : 90 ÷ 12 = 7,50 €. Les intérêts sont proportionnels à la durée.</p><p>La durée n s’écrit en années. 8 mois, c’est 8 ÷ 12 d’année. 45 jours, c’est 45 ÷ 360 d’année.</p><p>La <b>valeur acquise</b> est ce que l’on récupère à la fin : le capital plus les intérêts.</p>`,
      vois: frise, voisLeg: 'Chaque mois ajoute un bloc de même hauteur : 7,50 €. Au bout de 8 mois, il y en a 8.',
      retiens: `<p>${FM(R`I=C\times t\times n`)} (n en années) · ${FM(R`A=C+I`)}</p><p>Retrouver le taux ou la durée : ${FM(R`t=\dfrac{I}{C\times n}`)} · ${FM(R`n=\dfrac{I}{C\times t}`)}</p>`,
      exemple: `<p>I = 3 600 × 0,025 × ${M(R`\dfrac{8}{12}`)} = <b>60 €</b>.</p><p>Valeur acquise : 3 600 + 60 = <b>3 660 €</b>.</p>`,
      attention: 'n est en années : 8 mois ne s’écrit pas 8 mais 8 ÷ 12.', astuce: { k: 'verif', t: 'Calcule d’abord les intérêts d’un an, puis prends-en la part qui correspond à la durée.' } }];
  chk(rnd(3600 * .025 * 8 / 12) === 60 && 3600 + 60 === 3660 && rnd(1 - .9 * .95, 3) === .145, 'c4 notions');

  c.mots = [['remise', 'réduction pour une grosse quantité ou un client fidèle', '− 10 % pour plus de 100 articles.'], ['rabais', 'réduction pour un défaut ou un retard', '− 15 % sur un canapé rayé.'], ['ristourne', 'réduction de fin de période, sur le chiffre d’affaires', '2 % si le client a acheté plus de 5 000 €.'], ['net commercial', 'montant après les réductions', '370 € − 37 € = 333 €.'], ['net à payer', 'ce que le client paie, TVA comprise', 'Net à payer : 414 € TTC.'], ['intérêts simples', 'gain proportionnel à la durée du placement', '7,50 € par mois.'], ['valeur acquise', 'capital + intérêts', '3 600 € + 60 € = 3 660 €.']];

  /* ---------- exercices résolus ---------- */
  chk(1200 * .9 === 1080 && rnd(1080 * .95) === 1026 && rnd(1200 * .855) === 1026 && 800 * .8 === 640 && 640 * .95 === 608, 'c4 résolus');
  c.resolus = [
    { titre: 'Deux remises successives', outil: '🧮 calculatrice', enonce: `Une boutique commande pour ${H('1 200 € HT')}. Le grossiste accorde ${H('10 %')} puis ${H('5 %')} de remise. Calcule le net commercial.`,
      rows: [['CM : 0,90 et 0,95', 'Une remise de t % : je multiplie par (1 − t ÷ 100).'], ['1 200 × 0,90 = <b class="nw">1 080 €</b>', 'Première marche : − 10 %.'], ['1 080 × 0,95 = <b class="nw">1 026 €</b>', 'Deuxième marche : − 5 % sur le net précédent.']], verif: '1 200 × 0,855 = 1 026 ✓. Et c’est plus que 1 200 × 0,85 = 1 020 € : normal.', rep: 'Le net commercial est de 1 026 € HT.', go: ['e1'] },
    { titre: 'À toi : la même méthode', outil: '🧮 calculatrice', enonce: `Un client commande pour ${H('800 € HT')}. Il obtient ${H('20 %')} puis ${H('5 %')} de remise. Calcule le net commercial.`, trous: [0, 1, 2],
      rows: [['CM : ⟦0,80⟧ et ⟦0,95⟧', 'Une remise de t % : je multiplie par (1 − t ÷ 100).'], ['800 × 0,80 = ⟦640 €⟧', 'Première marche : − 20 %.'], ['⟦640⟧ × 0,95 = ⟦608 €⟧', 'Deuxième marche : − 5 % sur le net précédent.']], verif: '800 × 0,76 = 608 ✓. Plus que 800 × 0,75 = 600 € : normal.', rep: 'Le net commercial est de 608 € HT.', go: ['e1'] }];
  c.entraine = [{ id: 'e1', gen: 'c4e1', lc: 1 }, { id: 'e2', gen: 'c4e2', lc: 2 }, { id: 'e3', gen: 'c4e3', lc: 3 }];

  /* ---------- je résous ---------- */
  const pick = id => old.probs.find(p => p.id === id);
  c.probs = [
    adapt(pick('p3'), { etape: 2, hints: ['1 an et 6 mois : combien d’années, avec une virgule ?', 'Notion 3 : I = C × t × n.', '1 500 × 0,02 × 1,5 = …'], err: { 0: [{ v: 1.6, m: '6 mois, c’est une demi-année : 1 an et 6 mois = 1,5 an.' }], 1: [{ v: 30, m: 'Tu as compté 1 an seulement. La durée est 1,5 an.' }] } }),
    adapt(pick('c1'), { etape: 3, defi: 5, bulle: 'Cette facture se complète en 5 étapes, de haut en bas. Tu as vu chaque ligne dans la notion 2 : suis les flèches.', autravail: { comp: 'val', txt: 'contrôler une facture fournisseur avant de la payer : une erreur coûte cher au magasin.' }, hints: ['Montant brut : additionne les deux montants de la colonne « Montant HT ».', 'Remise 8 % : multiplie le brut par 0,92.', 'Net à payer : total HT × 1,2.'], err: { 1: [{ v: 20, m: 'C’est le montant de la remise. Le net commercial, c’est le brut moins la remise.' }], 3: [{ v: 47.98, m: 'C’est la TVA seule. Ajoute-la au total HT.' }] } }),
    adapt(pick('b1'), { etape: 4, defi: 5, bulle: 'Voici la question du début du chapitre ! Elle se fait en 5 étapes. Pour OmbraPro, utilise l’escalier des remises. Une question ratée ne fait pas un exercice raté : continue.', autravail: { comp: 'com', txt: 'choisir un fournisseur et confirmer la commande par un courriel clair.' }, hints: ['Soléo : 40 × 45, puis − 10 %, puis + 60 € de port.', 'OmbraPro : 40 × 49 × 0,88 × 0,97.', 'Relis la date de la fête : 10 jours.'], err: { 1: [{ v: 1666, m: '12 % puis 3 % ne font pas 15 % : multiplie par 0,88 puis par 0,97.' }] } })];

  c.bilan = [['Je sais appliquer une ou deux remises.', ['e1']], ['Je sais compléter une facture.', ['e2', 'c1']], ['Je sais calculer des intérêts simples.', ['e3', 'p3']], ['Je sais comparer deux devis.', ['b1']]];
  c.words = old.words;
  c.plusloin = { meca: old.meca, probs: old.probs.filter(p => !['p3', 'c1', 'b1'].includes(p.id)) };
  return c;
};
