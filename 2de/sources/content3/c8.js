/* Chapitre 8 · Croisement de deux variables — version 3. Prépare la 1re (programme de 1re Bac Pro, statistique à deux variables). */
'use strict';
const K = require('../lib/kit3');
const { rnd, fr, H, FM, M, R, adapt } = K;
const { S, T, Rc, Ln, Ar, Br, st } = require('../lib/visu');
const P = require('../lib/pics');
const V2 = require('../content2/c8.js');

module.exports = function (chk) {
  const old = V2(chk);
  const c = { id: 'c8', n: 8, col: 'mesure', icone: '🗂️', dom: 'Statistique et probabilités', titre: 'Croisement de deux variables', prepa: true };
  c.travail = { question: `Un cuisiniste a reçu ${H('2 000 visiteurs')} sur son stand au salon de l’habitat. ${H('640')} ont demandé un devis. Quelle tranche d’âge cibler pour la prochaine campagne ? Tu sauras répondre à la fin du chapitre (sujet « vers le bac »).` };
  c.objectifs = ['Je saurai lire une case d’un tableau croisé.', 'Je saurai compléter un tableau croisé avec les totaux.', 'Je saurai choisir le bon total : « sur l’ensemble » ou « parmi ».', 'Je saurai comparer deux groupes de tailles différentes.'];
  c.depart = 'c8';

  /* ---------- le tableau du cours : paiement selon l’âge (400 clients) ---------- */
  const COLS = ['moins de 30 ans', '30 ans et plus', 'Total'], ROWS = [['sans contact', 120, 144], ['autre moyen', 40, 96]];
  const tot = ROWS.map(r => r[1] + r[2]), ctot = [ROWS[0][1] + ROWS[1][1], ROWS[0][2] + ROWS[1][2]], N = tot[0] + tot[1];
  chk(ctot[0] === 160 && ctot[1] === 240 && tot[0] === 264 && N === 400 && 120 / 160 === .75 && 144 / 240 === .6 && 120 / 400 === .3, 'c8 tableau');
  const cw = [130, 120, 120, 90], ch = 34, tx0 = 40, ty0 = 30;
  const cx = j => tx0 + cw.slice(0, j).reduce((a, b) => a + b, 0), cy = i => ty0 + i * ch;
  const grid = (o = {}) => {
    const val = (i, j) => { if (i === 0) return j ? COLS[j - 1] : ''; const r = i <= 2 ? ROWS[i - 1] : null; if (j === 0) return r ? r[0] : 'Total'; if (r) return j < 3 ? r[j] : tot[i - 1]; return j < 3 ? ctot[j - 1] : N; };
    let g = '';
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      const head = i === 0 || j === 0, tt = i === 3 || j === 3, hide = o.hide && o.hide.some(([a, b]) => a === i && b === j);
      g += Rc(cx(j), cy(i), cw[j], ch, { c: head ? 'k' : tt ? 'k2' : 'wh', rx: 0, sw: 1.2 }) + T(cx(j) + cw[j] / 2, cy(i) + 22, hide ? '?' : (typeof val(i, j) === 'number' ? fr(val(i, j)) : val(i, j)), { fs: head ? 12 : 15, c: head ? 'tw' : hide ? 'kt' : 'tx', w: tt || head ? 800 : 600 });
    }
    return g;
  };
  const band = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="k" opacity=".18"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="none" class="ks" stroke-width="3"/>`;
  const W = cw.reduce((a, b) => a + b, 0);
  // 1. croiser du doigt
  const croiser = S(600, 250, st(1, grid() + T(tx0, 20, '400 clients d’un magasin de sport (commerce fictif)', { fs: 12, a: 'start', c: 'ts' }))
    + st(2, band(tx0 - 3, cy(1) - 3, W + 6, ch + 6) + T(tx0 + W + 8, cy(1) + 22, '← la ligne', { fs: 12, a: 'start', c: 'kt' }))
    + st(3, band(cx(1) - 3, ty0 - 3, cw[1] + 6, 4 * ch + 6) + T(cx(1) + cw[1] / 2, cy(4) + 20, '↑ la colonne', { fs: 12, c: 'kt' }))
    + st(4, `<circle cx="${cx(1) + cw[1] / 2}" cy="${cy(1) + ch / 2}" r="24" fill="none" class="ks" stroke-width="4"/>` + T(300, 232, '120 clients paient sans contact ET ont moins de 30 ans', { fs: 14, c: 'kt' })), 'Un tableau croisé : on croise une ligne et une colonne');
  // 2. compléter : les totaux s’additionnent
  const completer = S(600, 260, st(1, grid({ hide: [[2, 1], [1, 3], [3, 2]] }) + T(tx0, 20, 'trois cases ont été effacées', { fs: 12, a: 'start', c: 'ts' }))
    + st(2, T(300, 190, 'colonne : 160 − 120 = 40', { fs: 14, c: 'kt' }))
    + st(3, T(300, 212, 'ligne : 120 + 144 = 264', { fs: 14, c: 'kt' }))
    + st(4, T(300, 234, 'total : 400 − 160 = 240', { fs: 14, c: 'kt' }) + T(300, 254, 'chaque ligne et chaque colonne s’additionne jusqu’au total', { fs: 12, c: 'ts' })), 'Compléter un tableau croisé avec les totaux');
  // 3. sur le total ou « parmi »
  const parmi = S(600, 290, st(1, grid())
    + st(2, `<circle cx="${cx(1) + cw[1] / 2}" cy="${cy(1) + ch / 2}" r="22" fill="none" class="ks" stroke-width="3.5"/><circle cx="${cx(3) + cw[3] / 2}" cy="${cy(3) + ch / 2}" r="24" fill="none" class="ks" stroke-width="3.5" stroke-dasharray="5 3"/>` + T(300, 194, 'sur l’ensemble : 120 ÷ 400 = 30 % de tous les clients', { fs: 14 }))
    + st(3, band(cx(1) - 3, ty0 - 3, cw[1] + 6, 4 * ch + 6) + T(300, 222, '« parmi les moins de 30 ans » : je surligne leur colonne', { fs: 14, c: 'kt' }))
    + st(4, T(300, 252, '120 ÷ 160 = 75 % des moins de 30 ans', { fs: 17, c: 'kt' }) + T(300, 278, 'je divise par le total de la partie surlignée', { fs: 12, c: 'ts' })), 'Diviser par le total général ou par le total d’un groupe');
  // 4. les barres à 100 %
  const bx = 170, bw = 380;
  const bar = (y, lab, p, n, t) => Rc(bx, y, bw, 40, { c: 'k2', rx: 4 }) + Rc(bx, y, bw * p, 40, { c: 'k', rx: 4, s: false }) + T(bx + bw * p / 2, y + 26, `${fr(p * 100)} %`, { fs: 16, c: 'tw' }) + T(bx + bw * p + bw * (1 - p) / 2, y + 26, `${fr(100 - p * 100)} %`, { fs: 14 }) + T(bx - 10, y + 18, lab, { fs: 14, a: 'end' }) + T(bx - 10, y + 34, `${n} sur ${t}`, { fs: 11, a: 'end', c: 'ts' });
  const barres = S(600, 240, st(1, T(300, 22, 'part des clients qui paient sans contact, dans chaque groupe', { fs: 13, c: 'ts' }) + bar(40, 'moins de 30 ans', .75, 120, 160))
    + st(2, bar(100, '30 ans et plus', .6, 144, 240))
    + st(3, Ln(bx + bw * .75, 34, bx + bw * .75, 146, { dash: '5 3', w: 2 }) + T(300, 178, '144 > 120 en nombre… mais 60 % < 75 % en proportion', { fs: 15, c: 'kt' }))
    + st(4, T(300, 210, 'deux groupes de tailles différentes : je compare les pourcentages', { fs: 14 })), 'Deux barres à 100 % côte à côte');

  c.notions = [
    { titre: 'Lire un tableau croisé', decouvre: { txt: `Un magasin note ${H('l’âge')} et ${H('le moyen de paiement')} de 400 clients. Combien de clients de moins de 30 ans paient sans contact ?`, img: P.croise() },
      comprends: `<p>Un <b>tableau croisé</b> range des personnes selon <b>deux critères</b> en même temps. Ici, le moyen de paiement (en ligne) et l’âge (en colonne).</p><p>Chaque case compte les personnes qui ont les deux caractères à la fois. Pour la lire, on croise du doigt une ligne et une colonne.</p><p>La dernière ligne et la dernière colonne sont les <b>totaux</b>. Ils ne comptent qu’un seul critère : par exemple, tous les clients de moins de 30 ans.</p><p>La case en bas à droite est l’<b>effectif total</b> : tout le monde.</p>`,
      vois: croiser, voisLeg: 'Le doigt suit la ligne « sans contact », l’autre doigt la colonne « moins de 30 ans ». Ils se rejoignent sur la case 120.',
      retiens: `<p>Case intérieure : <b>deux critères à la fois</b> (« et »). Ligne ou colonne Total : <b>un seul critère</b>. Case en bas à droite : <b>effectif total</b>.</p>`,
      exemple: `<p>Sans contact <b>et</b> moins de 30 ans : <b>120</b> clients.</p><p>Tous les clients de 30 ans et plus : total de la colonne, <b>240</b>.</p>`,
      attention: 'Une case du total ne compte qu’un critère : 264, ce sont tous les paiements sans contact, quel que soit l’âge.', astuce: { k: 'sens', t: 'Lis toujours les titres de la ligne et de la colonne à voix haute avant de lire le nombre.' } },
    { titre: 'Compléter un tableau croisé', decouvre: { txt: `Trois cases du tableau ont été effacées. Peut-on les retrouver sans refaire l’enquête ?`, img: P.croise() },
      comprends: `<p>Dans un tableau croisé, tout s’additionne. Dans chaque ligne, les cases donnent le total de la ligne. Dans chaque colonne, les cases donnent le total de la colonne.</p><p>Pour retrouver une case, on cherche une ligne ou une colonne où il ne manque qu’un nombre. On fait une soustraction : total moins la case connue.</p><p>Parfois, l’énoncé donne un pourcentage. On le transforme d’abord en effectif : 40 % de 400 clients, c’est 400 × 0,4 = 160 clients.</p><p>Excel aide à compléter : ${M(R`\texttt{=SOMME(B2:C2)}`)} additionne une ligne.</p>`,
      vois: completer, voisLeg: 'Chaque case effacée se retrouve par une soustraction, dans sa ligne ou dans sa colonne.',
      retiens: `<p>${FM(R`\text{case}=\text{total}-\text{autres cases}`)} · ${FM(R`\text{effectif}=\text{total}\times\text{pourcentage}`)}</p>`,
      exemple: `<p>Colonne « moins de 30 ans » : 160 − 120 = <b>40</b>.</p><p>« 60 % des 400 clients » : 400 × 0,6 = <b>240</b> clients.</p>`,
      attention: 'Une fois le tableau rempli, vérifie que les lignes et les colonnes donnent bien le même total général.', astuce: { k: 'verif', t: 'Total des totaux de lignes = total des totaux de colonnes = effectif total.' } },
    { titre: 'Sur le total, ou « parmi » ?', decouvre: { txt: `« 30 % des clients paient sans contact et ont moins de 30 ans. » « 75 % des moins de 30 ans paient sans contact. » Les deux phrases sont-elles vraies ?`, img: P.parmi() },
      comprends: `<p>Une fréquence, c’est toujours une partie divisée par un total. Dans un tableau croisé, il y a plusieurs totaux. Tout dépend de la question.</p><p>« Parmi tous les clients » : on divise par l’effectif total, 400.</p><p>« <b>Parmi</b> les moins de 30 ans » : on ne regarde plus que ce groupe. On surligne sa colonne et on divise par son total, 160. C’est une <b>fréquence conditionnelle</b>.</p><p>Le mot « parmi » (ou « chez les », « dans le groupe des ») dit par quel total diviser.</p><p>Lis donc la question jusqu’au bout avant de calculer.</p>`,
      vois: parmi, voisLeg: 'Le même nombre 120 donne 30 % sur l’ensemble, et 75 % parmi les moins de 30 ans. Tout dépend du total choisi.',
      retiens: `<p>${FM(R`f=\dfrac{\text{case}}{\text{effectif total}}`)} · « parmi le groupe G » : ${FM(R`f=\dfrac{\text{case}}{\text{total du groupe G}}`)}</p>`,
      exemple: `<p>120 ÷ 400 = <b>30 %</b> de tous les clients.</p><p>120 ÷ 160 = <b>75 %</b> des moins de 30 ans.</p>`,
      attention: 'Avant de diviser, surligne la ligne ou la colonne du « parmi ». Divise par son total, pas par 400.', astuce: { k: 'vite', t: 'Pas de « parmi » dans la question ? Divise par l’effectif total.' } },
    { titre: 'Comparer deux groupes', decouvre: { txt: `${H('144')} clients de 30 ans et plus paient sans contact, contre ${H('120')} chez les moins de 30 ans. Les plus âgés aiment-ils plus le sans contact ?`, img: P.transfo() },
      comprends: `<p>On ne compare pas deux groupes avec des effectifs. Si un groupe est plus grand, il a souvent plus de monde dans chaque case.</p><p>Ici, il y a 240 clients de 30 ans et plus, et seulement 160 de moins de 30 ans. Comparer 144 et 120 n’a pas de sens.</p><p>On calcule une fréquence dans chaque groupe : 60 % et 75 %. Là, on peut comparer : le sans contact est plus fréquent chez les moins de 30 ans.</p><p>Les <b>barres à 100 %</b> montrent ces fréquences : chaque groupe a une barre de même longueur.</p><p>Au travail, c’est ainsi qu’on compare deux magasins, deux jours ou deux tranches d’âge.</p>`,
      vois: barres, voisLeg: 'Chaque groupe a une barre de même longueur, qui fait 100 %. On compare alors la part colorée.',
      retiens: `<p>Pour comparer deux groupes de tailles différentes, je compare des <b>fréquences conditionnelles</b>, jamais des effectifs.</p>`,
      exemple: `<p>Moins de 30 ans : 120 ÷ 160 = <b>75 %</b>. 30 ans et plus : 144 ÷ 240 = <b>60 %</b>.</p><p>Le sans contact est plus fréquent chez les moins de 30 ans.</p>`,
      attention: '« Plus de personnes » ne veut pas dire « une plus grande part ». Calcule les pourcentages avant de conclure.', astuce: { k: 'og', t: 'Excel : =B2/B4 donne la fréquence ; le format « % » l’affiche en pourcentage.' } }];
  chk(400 * .6 === 240 && 160 - 120 === 40, 'c8 notions');

  c.mots = [['tableau croisé', 'tableau qui range selon deux critères à la fois', 'Âge et moyen de paiement.'], ['critère (caractère)', 'ce que l’on observe sur chaque personne', 'L’âge, le jour, la satisfaction.'], ['effectif total', 'nombre de toutes les personnes, case en bas à droite', '400 clients interrogés.'], ['effectif marginal', 'total d’une ligne ou d’une colonne', '160 clients de moins de 30 ans.'], ['fréquence', 'partie ÷ effectif total', '30 % de tous les clients.'], ['fréquence conditionnelle', 'partie ÷ total d’un groupe (« parmi »)', '75 % des moins de 30 ans.'], ['taux de transformation', 'acheteurs ÷ visiteurs', '102 acheteurs sur 330 visiteurs : 30,9 %.']];

  /* ---------- exercices résolus ---------- */
  const TB = (corner, cols, rows) => `<table class="dt tcx dt-sm"><thead><tr><th>${corner}</th>${cols.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map((r, i) => `<tr${i === rows.length - 1 ? ' class="tot"' : ''}><th>${r[0]}</th>${r.slice(1).map((x, j) => `<td${j === r.length - 2 ? ' class="tot"' : ''}>${fr(x)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  chk(72 + 66 === 138 && 18 + 44 === 62 && 72 / 90 === .8 && 66 / 110 === .6 && 60 / 240 === .25 && rnd(90 / 160 * 100, 1) === 56.3, 'c8 résolus');
  c.resolus = [
    { titre: 'Une fréquence « parmi »', outil: '🧮 calculatrice', enonce: `Une enseigne interroge ${H('200 clients')}. ${H('Parmi les clients livrés à domicile')}, quelle part est satisfaite ?`, doc: TB('', ['Retrait en magasin', 'Livraison', 'Total'], [['Satisfaits', 72, 66, 138], ['Pas satisfaits', 18, 44, 62], ['Total', 90, 110, 200]]),
      rows: [['« Parmi les clients livrés »', 'Je repère le groupe : je surligne la colonne « Livraison ».'], ['Total du groupe : <b class="nw">110</b>', 'Je divise par ce total, pas par 200.'], ['66 ÷ 110 = 0,6 = <b class="nw">60 %</b>', 'Satisfaits et livrés : 66.']], verif: '66 est un peu plus que la moitié de 110 (55) : 60 % est cohérent.', rep: '60 % des clients livrés sont satisfaits (contre 80 % en retrait magasin).', go: ['e3'] },
    { titre: 'À toi : la même méthode', outil: '🧮 calculatrice', enonce: `Un magasin compte ses visiteurs. ${H('Parmi les visiteurs du week-end')}, quelle part achète ? Arrondis au dixième.`, doc: TB('', ['Semaine', 'Week-end', 'Total'], [['Acheteurs', 60, 90, 150], ['Non-acheteurs', 180, 70, 250], ['Total', 240, 160, 400]]), trous: [0, 1, 2],
      rows: [['« Parmi ⟦les visiteurs du week-end⟧ »', 'Je repère le groupe : je surligne sa colonne.'], ['Total du groupe : ⟦160⟧', 'Je divise par ce total, pas par 400.'], ['90 ÷ 160 = ⟦56,3 %⟧', 'Acheteurs et week-end : 90.']], verif: '90 est un peu plus que la moitié de 160 (80) : un peu plus de 50 %, c’est cohérent.', rep: 'Environ 56,3 % des visiteurs du week-end achètent (contre 25 % en semaine).', go: ['e3'] }];
  chk(60 + 90 === 150 && 180 + 70 === 250 && 240 + 160 === 400, 'c8 R2');
  c.entraine = [{ id: 'e1', gen: 'c8e1', lc: 1 }, { id: 'e2', gen: 'c8e2', lc: 2 }, { id: 'e3', gen: 'c8e3', lc: 3 }];

  /* ---------- je résous ---------- */
  const pick = id => old.probs.find(p => p.id === id);
  c.probs = [
    adapt(pick('p1'), { etape: 2, hints: ['Lis les titres : en ligne, le motif ; en colonne, le jour.', 'Notion 1 : croise du doigt la ligne et la colonne.', 'L’effectif total est dans la case en bas à droite.'], err: { 3: [{ v: 46, m: 'C’est la case « en semaine ». La question porte sur le samedi.' }] } }),
    adapt(pick('c1'), { etape: 3, defi: 5, bulle: 'Ce cas se fait en 5 étapes. Commence par transformer les pourcentages en effectifs, puis complète le tableau case par case. Tu as vu chaque étape dans les notions 2 et 3.', autravail: { comp: 'ana', txt: 'suivre le taux de transformation, l’indicateur que le manager regarde chaque jour.' }, hints: ['Visiteurs du week-end : 600 × 0,45.', 'Acheteurs du week-end : 40 % des visiteurs du week-end, pas de tous.', 'Taux en semaine : acheteurs en semaine ÷ visiteurs en semaine.'], err: { 0: [{ v: 330, m: 'C’est le nombre de visiteurs en semaine. Le week-end représente 45 %.' }], 1: [{ v: 84, m: '40 % se calcule parmi les visiteurs du week-end (270), pas parmi les acheteurs.' }, { v: 240, m: '40 % se calcule parmi les visiteurs du week-end (270), pas parmi les 600 visiteurs.' }], 3: [{ v: 17, m: 'Tu as divisé par tous les visiteurs. « En semaine » : divise par les visiteurs de la semaine.' }, { v: 48.6, m: 'Tu as divisé par tous les acheteurs. Divise par les visiteurs de la semaine.' }] } }),
    adapt(pick('b1'), { etape: 4, defi: 6, bulle: 'Voici la question du début du chapitre ! Elle se fait en 6 étapes. Le tableau se remplit comme dans la notion 2 ; la question 4 est un « parmi ». Une question ratée ne fait pas un exercice raté : continue.', autravail: { comp: 'com', txt: 'cibler une campagne commerciale avec des chiffres, et convaincre sa responsable.' }, hints: ['18–34 ans : 30 % de 2 000.', '35–54 ans : 2 000 − 600 − 500.', '« Parmi les 55 ans et plus » : divise par 500.'], err: { 0: [{ v: 30, m: 'C’est le pourcentage. Calcule l’effectif : 2 000 × 0,3.' }], 3: [{ v: 8, m: 'Tu as divisé par tous les visiteurs. « Parmi les 55 ans et plus » : divise par 500.' }, { v: 25, m: 'Tu as divisé par tous les devis. « Parmi les 55 ans et plus » : divise par 500.' }] } })];

  c.bilan = [['Je sais lire une case d’un tableau croisé.', ['e1', 'p1']], ['Je sais compléter un tableau croisé.', ['e2', 'c1']], ['Je sais choisir le bon total (« parmi »).', ['e3']], ['Je sais comparer deux groupes avec des fréquences.', ['c1', 'b1']]];
  c.words = old.words;
  c.plusloin = { meca: old.meca, probs: old.probs.filter(p => !['p1', 'c1', 'b1'].includes(p.id)) };
  return c;
};
