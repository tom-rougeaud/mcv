/* Chapitre 3 · Problèmes du premier degré — version 3 (BO 2019, 2de pro). */
'use strict';
const K = require('../lib/kit3');
const { rnd, H, FM, M, R, adapt } = K;
const { S, T, Rc, Ln, Ar, Br, st } = require('../lib/visu');
const P = require('../lib/pics');
const V2 = require('../content2/c3.js');

module.exports = function (chk) {
  const old = V2(chk);
  const c = { id: 'c3', n: 3, col: 'algebre', icone: '⚖️', dom: 'Algèbre', titre: 'Problèmes du premier degré' };
  c.travail = { question: `Une boutique encaisse ${H('6 000 € par mois')} par carte. Terminal « Fixe » : ${H('18 € + 0,9 %')} ; terminal « Libre » : ${H('1,75 %')}. Lequel conseiller, et à partir de quel montant ? Tu sauras répondre à la fin du chapitre (sujet « vers le bac »).` };
  c.objectifs = ['Je saurai résoudre une équation en faisant la même opération des deux côtés.', 'Je saurai traduire un énoncé par une équation.', 'Je saurai lire et écrire un intervalle.', 'Je saurai résoudre une inéquation et répondre par une phrase.'];
  c.depart = 'c3';

  /* ---------- méthodes visuelles ---------- */
  // 1. la balance
  const plate = (cx, y, items) => { const w = items.reduce((a, b) => a + b[1] + 4, -4); let x = cx - w / 2, s = ''; for (const [lab, wd, cls] of items) { s += Rc(x, y - 34, wd, 32, { c: cls, rx: 5 }) + T(x + wd / 2, y - 12, lab, { fs: 16, c: cls === 'k' ? 'tw' : 'tx' }); x += wd + 4; } return s; };
  const fleau = Ln(300, 48, 300, 150, { w: 4 }) + Ln(250, 150, 350, 150, { w: 5 }) + `<path d="M300 36 L290 52 H310 Z" class="k"/>` + Ln(150, 48, 450, 48, { w: 4 })
    + [170, 430].map(x => Ln(150 + (x - 170), 48, x - 62, 122, { w: 1.4 }) + Ln(190 + (x - 170), 48, x + 62, 122, { w: 1.4 }) + Ln(x - 74, 124, x + 74, 124, { w: 4 })).join('');
  const balance = S(600, 270, st(1, fleau + plate(170, 122, [['x', 34, 'k'], ['x', 34, 'k'], ['x', 34, 'k'], ['5', 26, 'k2']]) + plate(430, 122, [['20', 50, 'k2']]) + T(300, 20, 'les deux plateaux pèsent autant', { fs: 13, c: 'ts' }) + T(300, 182, '3x + 5 = 20', { fs: 20 }))
    + st(2, Ln(212, 86, 242, 122, { w: 3 }) + T(430, 78, '20 − 5 = 15', { fs: 14, c: 'kt' }) + T(300, 208, '− 5 des deux côtés  →  3x = 15', { fs: 17, c: 'kt' }))
    + st(3, T(300, 234, '÷ 3 des deux côtés  →  x = 5', { fs: 17, c: 'kt' }))
    + st(4, T(300, 262, 'Je vérifie : 3 × 5 + 5 = 15 + 5 = 20 ✓', { fs: 15 })), 'Une balance en équilibre : 3x + 5 d’un côté, 20 de l’autre');
  // 2. le schéma en barres (3 paquets + 4,50 € = 28,20 €)
  const barres = S(600, 230, st(1, Rc(60, 40, 480, 34, { c: 'k2' }) + T(300, 63, 'total payé : 28,20 €', { fs: 16 }))
    + st(2, [0, 1, 2].map(i => Rc(60 + i * 140, 92, 140, 34, { c: 'k', rx: 4 }) + T(130 + i * 140, 115, 'x', { fs: 17, c: 'tw' })).join('') + Rc(480, 92, 60, 34, { c: 'k2', rx: 4 }) + T(510, 114, '4,50', { fs: 14 }) + T(510, 146, 'port', { fs: 12, c: 'ts' }))
    + st(3, Br(60, 480, 134, '3x = 28,20 − 4,50 = 23,70', { fs: 16 }))
    + st(4, T(300, 200, 'x = 23,70 ÷ 3 = 7,90 € : un paquet coûte 7,90 €', { fs: 16, c: 'kt' }) + T(300, 222, 'l’équation : 3x + 4,5 = 28,2', { fs: 14, c: 'ts' })), 'Le schéma en barres : le total au-dessus, les morceaux en dessous');
  // 3. la droite graduée
  const gx = v => 40 + v * 50;   // 0 → 40, 10 → 540
  const br = (x, y, d) => `<path d="M${x + 9 * d} ${y - 15} H${x} V${y + 15} H${x + 9 * d}" fill="none" class="ks" stroke-width="3.4"/>`;
  const axe = y => Ln(30, y, 570, y, { w: 1.6 }) + Array.from({ length: 11 }, (_, v) => Ln(gx(v), y - 5, gx(v), y + 5, { w: 1.4 }) + T(gx(v), y + 24, v, { fs: 12, w: 400 })).join('');
  const droite = S(600, 240, st(1, axe(60) + T(300, 22, '2 ≤ x < 5', { fs: 17 }))
    + st(2, `<line x1="${gx(2)}" y1="60" x2="${gx(5)}" y2="60" class="ks" stroke-width="7" opacity=".55"/>` + br(gx(2), 60, 1) + br(gx(5), 60, 1) + T(gx(2), 104, '2 est compris', { fs: 12, c: 'kt' }) + T(gx(5), 104, '5 n’est pas compris', { fs: 12, c: 'kt' }) + T(470, 22, '→ [2 ; 5[', { fs: 17, c: 'kt' }))
    + st(3, axe(170) + `<line x1="${gx(7)}" y1="170" x2="580" y2="170" class="ks" stroke-width="7" opacity=".55"/>` + br(gx(7), 170, 1) + T(300, 136, 'x ≥ 7', { fs: 17 }) + T(470, 136, '→ [7 ; +∞[', { fs: 17, c: 'kt' }))
    + st(4, T(300, 228, 'crochet tourné vers le nombre : le nombre est compris', { fs: 14, c: 'ts' })), 'La droite graduée avec des crochets');
  // 4. l’inéquation « au moins » : 3n ≥ 180
  const ineq = S(600, 244, st(1, [[50, 150, false], [60, 180, null], [70, 210, true]].map(([n, m, ok], i) => Rc(40 + i * 180, 30, 160, 66, { c: ok === false ? 'k2' : 'k2', rx: 8 }) + T(120 + i * 180, 56, `${n} pots → ${m} €`, { fs: 15 }) + T(120 + i * 180, 82, ok === false ? 'pas assez' : ok ? 'ça couvre ✓' : 'tout juste ✓', { fs: 13, c: 'kt' })).join('') + T(300, 18, 'marge : 3 € par pot ; stand : 180 €', { fs: 13, c: 'ts' }))
    + st(2, T(300, 128, '3n ≥ 180  →  n ≥ 180 ÷ 3  →  n ≥ 60', { fs: 18, c: 'kt' }))
    + st(3, Ln(30, 180, 570, 180, { w: 1.6 }) + [30, 40, 50, 60, 70, 80, 90].map((v, i) => Ln(60 + i * 80, 175, 60 + i * 80, 185, { w: 1.4 }) + T(60 + i * 80, 206, v, { fs: 12, w: 400 })).join('') + `<line x1="300" y1="180" x2="580" y2="180" class="ks" stroke-width="7" opacity=".55"/>` + br(300, 180, 1) + T(440, 160, 'n ∈ [60 ; +∞[', { fs: 15, c: 'kt' }))
    + st(4, T(300, 236, 'Il faut vendre au moins 60 pots.', { fs: 15 })), 'Essais puis inéquation : à partir de combien de pots la marge couvre le stand');
  chk(3 * 5 + 5 === 20 && rnd(28.2 - 4.5) === 23.7 && rnd(23.7 / 3) === 7.9 && 180 / 3 === 60 && 3 * 50 === 150 && 3 * 70 === 210, 'c3 visuels');

  c.notions = [
    { titre: 'Résoudre une équation', decouvre: { txt: `Sur une balance, ${H('3 boîtes identiques et 5 kg')} pèsent autant que ${H('20 kg')}. Combien pèse une boîte ?`, img: P.equation() },
      comprends: `<p>Une <b>équation</b> est une égalité avec un nombre inconnu, noté x. La résoudre, c’est trouver la valeur de x qui rend l’égalité vraie.</p><p>Pense à une balance en équilibre. Si tu enlèves 5 kg d’un seul plateau, elle penche. Si tu enlèves 5 kg des deux côtés, elle reste en équilibre.</p><p>C’est la règle : on fait <b>la même opération des deux côtés</b>. On ajoute, on soustrait, on multiplie ou on divise par le même nombre.</p><p>But : isoler x seul d’un côté. On commence par retirer les nombres seuls, puis on divise.</p><p>On finit toujours en <b>vérifiant</b> : on remplace x par la valeur trouvée.</p>`,
      vois: balance, voisLeg: 'Ce que l’on fait sur un plateau, on le fait sur l’autre. La balance reste en équilibre jusqu’à x = 5.',
      retiens: `<p>${FM(R`a = b \iff a + c = b + c`)} · ${FM(R`a = b \iff \dfrac{a}{k}=\dfrac{b}{k}\ (k\neq 0)`)}</p><p>Je résous, puis je vérifie en remplaçant x.</p>`,
      exemple: `<p>3x + 5 = 20 → 3x = 15 → x = <b>5</b>.</p><p>Vérification : 3 × 5 + 5 = 20 ✓.</p>`,
      attention: '3x = 15 ne donne pas x = 15 − 3. « 3x », c’est 3 × x : on divise par 3.', astuce: { k: 'verif', t: 'Remplace x par ta réponse dans l’énoncé : les deux côtés doivent donner le même nombre.' } },
    { titre: 'Mettre un problème en équation', decouvre: { txt: `Une cliente paie ${H('28,20 €')} pour ${H('3 paquets identiques')} et ${H('4,50 € de port')}. Combien coûte un paquet ?`, img: P.cout() },
      comprends: `<p>Un énoncé de magasin peut presque toujours s’écrire comme une équation. Il faut d’abord bien voir ce que l’on cherche.</p><p><b>Étape 1</b> : je choisis l’inconnue. x = ce que l’on cherche (le prix d’un paquet).</p><p><b>Étape 2</b> : je dessine le schéma en barres. Le total en haut, les morceaux en dessous.</p><p><b>Étape 3</b> : j’écris l’équation en lisant le schéma : 3x + 4,5 = 28,2.</p><p><b>Étape 4</b> : je résous, je vérifie, puis je réponds par une phrase avec l’unité.</p><p>Sans schéma, on se trompe souvent d’opération.</p>`,
      vois: barres, voisLeg: 'Le total payé est en haut. En dessous : trois paquets de même prix x et les frais de port.',
      retiens: `<p>1. Je choisis x · 2. Je dessine · 3. J’écris l’équation · 4. Je résous, je vérifie, je réponds.</p><p>${FM(R`3x+4{,}5=28{,}2\ \Rightarrow\ x=7{,}90`)}</p>`,
      exemple: `<p>3x + 4,5 = 28,2 → 3x = 23,7 → x = <b>7,90 €</b>.</p><p>Vérification : 3 × 7,90 + 4,50 = 28,20 ✓. Un paquet coûte 7,90 €.</p>`,
      attention: 'Ne divise pas 28,20 par 3 tout de suite : retire d’abord les frais de port.', astuce: { k: 'sens', t: 'Écris en une phrase ce que représente x avant de calculer : « x est le prix d’un paquet ».' } },
    { titre: 'Les intervalles', decouvre: { txt: `Une promotion vaut pour ${H('les achats d’au moins 2 € et de moins de 5 €')}. Comment l’écrire en peu de signes ?`, img: P.intervalle() },
      comprends: `<p>Un <b>intervalle</b> est un morceau de la droite graduée. Il contient tous les nombres entre deux bornes.</p><p>Les <b>crochets</b> disent si la borne est comprise. Crochet tourné vers le nombre : le nombre est compris. Crochet tourné vers l’extérieur : il est exclu.</p><p>« Au moins 2 », c’est x ≥ 2 : 2 est compris. « Moins de 5 », c’est x < 5 : 5 est exclu. On écrit [2 ; 5[.</p><p>Quand il n’y a pas de fin, on écrit +∞ (plus l’infini). Le crochet est toujours ouvert du côté de l’infini.</p><p>Un intervalle n’est pas un nombre seul : c’est toute une plage de nombres.</p>`,
      vois: droite, voisLeg: 'On colorie la partie de la droite qui convient. Les crochets montrent si les bornes sont comprises.',
      retiens: `<p>${FM(R`[a\,;b] : a\le x\le b`)} · ${FM(R`]a\,;b[ : a<x<b`)} · ${FM(R`[a\,;+\infty[ : x\ge a`)} · ${FM(R`]-\infty\,;b] : x\le b`)}</p>`,
      exemple: `<p>2 ≤ x < 5 : <b>[2 ; 5[</b>.</p><p>« au moins 17 ans » : x ≥ 17 : <b>[17 ; +∞[</b>.</p>`,
      attention: 'Du côté de l’infini, le crochet est toujours ouvert : [7 ; +∞[, jamais [7 ; +∞].', astuce: { k: 'vite', t: '« au moins », « à partir de » : ≥. « moins de », « en dessous de » : <.' } },
    { titre: 'Résoudre une inéquation', decouvre: { txt: `Un stand coûte ${H('180 €')}. Chaque pot vendu rapporte ${H('3 € de marge')}. Combien de pots faut-il vendre, au minimum ?`, img: P.marge() },
      comprends: `<p>Une <b>inéquation</b> ressemble à une équation, avec un signe ≤, <, ≥ ou > à la place du signe =.</p><p>« La marge couvre au moins le stand » s’écrit 3n ≥ 180. On cherche tous les nombres de pots qui conviennent.</p><p>On résout comme une équation : même opération des deux côtés. 3n ≥ 180 donne n ≥ 60.</p><p>Il y a un seul piège. Si l’on multiplie ou divise par un nombre <b>négatif</b>, on change le sens du signe.</p><p>Les solutions forment un intervalle. On termine par une phrase : « Il faut vendre au moins 60 pots ».</p>`,
      vois: ineq, voisLeg: 'Les essais montrent l’idée. L’inéquation donne d’un coup tous les nombres qui conviennent.',
      retiens: `<p>${FM(R`3n\ge 180 \iff n\ge 60`)} · solutions : ${FM(R`[60\,;+\infty[`)}</p><p>Diviser par un nombre négatif change le sens : ${FM(R`-2x\le 6 \iff x\ge -3`)}</p>`,
      exemple: `<p>2x + 3 < 11 → 2x < 8 → x < 4 : solutions <b>]−∞ ; 4[</b>.</p><p>3n ≥ 180 → n ≥ 60 : il faut vendre <b>au moins 60 pots</b>.</p>`,
      attention: 'Pour un nombre de pots ou de clients, la réponse est un nombre entier : arrondis vers le haut si besoin.', astuce: { k: 'verif', t: 'Teste une valeur de l’intervalle : avec 70 pots, 3 × 70 = 210 ≥ 180 ✓.' } }];
  chk(-2 * -3 === 6 && 2 * 4 + 3 === 11, 'c3 notions');

  c.mots = [['inconnue', 'nombre que l’on cherche, noté x', 'x est le prix d’un paquet.'], ['équation', 'égalité qui contient une inconnue', '3x + 4,5 = 28,2'], ['solution', 'valeur de x qui rend l’égalité vraie', '7,90 est la solution.'], ['vérifier', 'remplacer x par la solution trouvée', '3 × 7,90 + 4,50 = 28,20 ✓'], ['intervalle', 'tous les nombres entre deux bornes', 'Les remises valent sur [50 ; 100[.'], ['inéquation', 'inégalité qui contient une inconnue', '3n ≥ 180'], ['au moins', 'supérieur ou égal (≥)', 'Vendre au moins 60 pots.']];

  /* ---------- exercices résolus ---------- */
  chk(rnd((47 - 12) / 3.5) === 10 && (74 - 6) / 4 === 17, 'c3 résolus');
  c.resolus = [
    { titre: 'Mettre en équation et résoudre', outil: '✏️ à la main', enonce: `Un livreur facture ${H('12 € de forfait')} plus ${H('3,50 € par colis')}. La facture est de ${H('47 €')}. Combien de colis a-t-il livrés ?`,
      rows: [['x = nombre de colis', 'Je choisis l’inconnue : ce que l’on cherche.'], ['<b class="nw">12 + 3,5x = 47</b>', 'Le forfait plus 3,50 € par colis donne le total.'], ['3,5x = 35', '− 12 des deux côtés.'], ['x = 35 ÷ 3,5 = <b class="nw">10</b>', '÷ 3,5 des deux côtés.']], verif: '12 + 3,5 × 10 = 12 + 35 = 47 ✓.', rep: 'Le livreur a livré 10 colis.', go: ['e1', 'e2'] },
    { titre: 'À toi : la même méthode', outil: '✏️ à la main', enonce: `${H('4 coffrets identiques')} et ${H('6 € de port')} coûtent ${H('74 €')}. Trouve le prix d’un coffret.`, trous: [0, 1, 2, 3],
      rows: [['x = ⟦prix d’un coffret⟧', 'Je choisis l’inconnue : ce que l’on cherche.'], ['⟦4x + 6 = 74⟧', 'Quatre coffrets plus le port donnent le total.'], ['4x = ⟦68⟧', '− 6 des deux côtés.'], ['x = ⟦17⟧ €', '÷ 4 des deux côtés.']], verif: '4 × 17 + 6 = 68 + 6 = 74 ✓.', rep: 'Un coffret coûte 17 €.', go: ['e2'] }];
  c.entraine = [{ id: 'e1', gen: 'c3e1', lc: 1 }, { id: 'e2', gen: 'c3e2', lc: 2 }, { id: 'e3', gen: 'c3e3', lc: 3 }];

  /* ---------- je résous ---------- */
  const pick = id => old.probs.find(p => p.id === id);
  c.probs = [
    adapt(pick('p1'), { etape: 2, hints: ['Ce que l’on cherche : le prix d’un paquet. C’est x.', 'Notion 2 : dessine la barre du total, puis 3 paquets et le port.', '3x + 4,5 = 28,2.'], err: { 1: [{ v: 9.4, m: 'Tu as divisé 28,20 par 3 sans retirer les frais de port. Retire d’abord 4,50 €.' }, { v: 10.9, m: 'Les frais de port se retirent : 28,20 − 4,50, pas 28,20 + 4,50.' }] } }),
    adapt(pick('c1'), { etape: 3, defi: 4, bulle: 'Ce cas se fait en 4 étapes. Commence par le graphique : le point où les droites se croisent donne déjà la réponse de la question a.', autravail: { comp: 'val', txt: 'comparer deux offres avant de signer, pour ne pas payer trop cher un emplacement.' }, hints: ['Cherche le point où les deux droites se coupent.', '35j = 120 + 20j : retire 20j des deux côtés.', 'Pour 10 jours : A = 35 × 10 ; B = 120 + 20 × 10.'], err: { 2: [{ v: 320, m: 'Tu as calculé l’offre B. La case attend le coût de l’offre A : 35 × 10.' }] } }),
    adapt(pick('b1'), { etape: 4, defi: 5, bulle: 'Voici la question du début du chapitre ! Elle se fait en 5 étapes. Les questions 1 et 2 se font avec des pourcentages, comme au chapitre 1. Une question ratée ne fait pas un exercice raté : continue.', autravail: { comp: 'com', txt: 'conseiller une gérante sur un contrat, avec un calcul qui justifie le choix.' }, hints: ['0,9 % de 6 000 € : 6 000 × 0,009.', 'Fixe : 18 + 0,009x ; Libre : 0,0175x.', '18 + 0,009x = 0,0175x → 18 = 0,0085x.'], err: { 0: [{ v: 54, m: 'Tu as oublié la location de 18 € par mois.' }] } })];

  c.bilan = [['Je sais résoudre une équation.', ['e1']], ['Je sais traduire un énoncé par une équation.', ['e2', 'p1']], ['Je sais lire un intervalle.', ['e3']], ['Je sais comparer deux offres.', ['c1']], ['Je sais conseiller avec une équation.', ['b1']]];
  c.words = old.words;
  c.plusloin = { meca: old.meca, probs: old.probs.filter(p => !['p1', 'c1', 'b1'].includes(p.id)) };
  return c;
};
