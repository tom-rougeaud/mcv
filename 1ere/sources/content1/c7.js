/* Chapitre 7 · Probabilités — 1re Bac Pro. */
'use strict';
const K = require('./kit1');
const { rnd, H, FM, R, Q, BQ, PB, prog, rais, tab, S, T, Rc, Ln, Ar, Br, st, MCVP, bl } = K;
const { SK } = require('./sk1');
const RED = MCVP.RED, BLUE = MCVP.BLUE, GRN = MCVP.GRN, INK = MCVP.INK;
const YEL = '#FFC233', GRY = '#DCE2F2';
const Tf = (x, y, s, fill, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 15}" text-anchor="${o.a || 'middle'}" font-weight="700" fill="${fill}">${s}</text>`;

module.exports = function (chk) {
  const c = { id: 'c7', n: 7, col: 'donnees', icone: '🎲', dom: 'Statistique et probabilités · probabilités', titre: 'Probabilités', sous: 'La chance en chiffres' };
  c.parties = [{ t: 'Probabilité d’un évènement', n: [1, 2] }, { t: 'Réunion et intersection', n: [3] }, { t: 'Tableaux croisés et probabilités conditionnelles', n: [4, 5] }];
  c.travail = { question: `Pour ses 10 ans, une boutique organise un jeu : ${H('50 tickets')} dans une urne, dont ${H('5 bons de 20 €')} et ${H('10 bons de 5 €')}. Quelle chance a un client de gagner ? Et parmi les clients venus en ligne, combien sont satisfaits ? Les probabilités mettent des nombres sur le hasard.` };
  c.objectifs = ['Je saurai calculer la probabilité d’un évènement, avec ou sans équiprobabilité.', 'Je saurai utiliser l’évènement contraire et des évènements incompatibles.', 'Je saurai calculer la probabilité d’une réunion et d’une intersection.', 'Je saurai lire un tableau croisé et calculer une probabilité conditionnelle P_A(B).'];
  c.depart = 'c7';

  /* 1. 50 tickets */
  const cell = (k, fill) => { const r = Math.floor(k / 10), cc = k % 10, s = 40, x0 = 100; return `<rect x="${x0 + cc * s + 3}" y="${16 + r * s + 3}" width="${s - 6}" height="${s - 6}" rx="6" fill="${fill}" stroke="${INK}" stroke-width="1.4"/>`; };
  let base1 = '', red = '', yel = ''; for (let k = 0; k < 50; k++) base1 += cell(k, GRY); for (let k = 0; k < 5; k++) red += cell(k, RED); for (let k = 5; k < 15; k++) yel += cell(k, YEL);
  chk(5 / 50 === .1 && 15 / 50 === .3 && 35 / 50 === .7, 'c7 tickets');
  const tickets = S(600, 290, st(1, base1 + T(300, 234, '50 tickets, chacun a la même chance d’être tiré', { fs: 14, c: 'ts' }))
    + st(2, red + Tf(300, 258, 'P(bon de 20 €) = 5 ÷ 50 = 0,1', RED, { fs: 15 }))
    + st(3, yel + T(300, 282, 'P(gagner) = (5 + 10) ÷ 50 = 15 ÷ 50 = 0,3', { fs: 15, c: 'kt' })),
  'Cinquante cases : 5 rouges (bons de 20 euros), 10 jaunes (bons de 5 euros), 35 grises (perdu)');

  /* 2. échelle des probabilités : contraire */
  const X = p => 50 + p * 500;
  const ech = S(600, 220, st(1, `<line x1="${X(0)}" y1="70" x2="${X(1)}" y2="70" stroke="${INK}" stroke-width="2.4"/>` + [0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1].map(p => `<line x1="${X(p)}" y1="64" x2="${X(p)}" y2="76" stroke="${INK}" stroke-width="1.6"/>` + T(X(p), 98, String(p).replace('.', ','), { fs: 12, w: 400, c: 'ts' })).join('') + T(X(0), 40, 'impossible', { fs: 13, c: 'ts' }) + T(X(1), 40, 'certain', { fs: 13, c: 'ts' }))
    + st(2, `<rect x="${X(0)}" y="120" width="${X(.3) - X(0)}" height="36" rx="4" fill="${YEL}" stroke="${INK}" stroke-width="1.6"/>` + T((X(0) + X(.3)) / 2, 144, 'gagner : 0,3', { fs: 14 }))
    + st(3, `<rect x="${X(.3)}" y="120" width="${X(1) - X(.3)}" height="36" rx="4" fill="${GRY}" stroke="${INK}" stroke-width="1.6"/>` + T((X(.3) + X(1)) / 2, 144, 'perdre (contraire) : 1 − 0,3 = 0,7', { fs: 14 }) + T(300, 196, 'les deux parts remplissent toute l’échelle : 0,3 + 0,7 = 1', { fs: 14, c: 'kt' })),
  'Une probabilité est entre 0 et 1 ; gagner (0,3) et perdre (0,7) se complètent jusqu’à 1');

  /* 3. réunion et intersection : 200 clients, A carte (90), B en ligne (80), A et B (30) */
  const N = 200, nA = 90, nB = 80, nAB = 30, nU = nA + nB - nAB;
  chk(nU === 140 && nU / N === .7 && rnd(nA / N + nB / N - nAB / N, 4) === .7 && (N - nU) / N === .3, 'c7 réunion');
  const venn = S(600, 260, st(1, `<rect x="20" y="10" width="560" height="240" rx="10" fill="#fff" stroke="${INK}" stroke-width="2"/>` + T(44, 36, '200 clients', { fs: 13, a: 'start', c: 'ts' }) + `<circle cx="235" cy="138" r="94" fill="${RED}" fill-opacity=".14" stroke="${RED}" stroke-width="2.6"/><circle cx="365" cy="138" r="94" fill="${BLUE}" fill-opacity=".14" stroke="${BLUE}" stroke-width="2.6"/>` + Tf(170, 40, 'A : carte (90)', RED, { fs: 14 }) + Tf(430, 40, 'B : en ligne (80)', BLUE, { fs: 14 }))
    + st(2, T(300, 144, '30', { fs: 22 }) + T(300, 166, 'A et B', { fs: 12, c: 'ts' }))
    + st(3, T(185, 144, '60', { fs: 20 }) + T(415, 144, '50', { fs: 20 }) + T(530, 226, '60', { fs: 18 }) + T(530, 206, 'ni A ni B', { fs: 11, c: 'ts' }))
    + st(4, T(300, 254 - 8, 'A ou B : 60 + 30 + 50 = 140 clients', { fs: 14, c: 'kt' })),
  'Deux disques qui se chevauchent : 60 seulement A, 30 A et B, 50 seulement B, 60 en dehors');

  /* 4. tableau croisé : 200 clients, en ligne 80 (68 satisfaits), magasin 120 (90 satisfaits) */
  const tc = [[68, 12, 80], [90, 30, 120], [158, 42, 200]];
  chk(68 + 12 === 80 && 90 + 30 === 120 && 68 + 90 === 158 && 12 + 30 === 42 && 80 + 120 === 200 && 68 / 200 === .34 && 68 / 80 === .85 && 90 / 120 === .75 && 158 / 200 === .79, 'c7 tableau croisé');
  const cx = [240, 380, 520], rowY = [68, 116, 164], head = ['satisfait', 'pas satisfait', 'total'], rows = ['en ligne', 'en magasin', 'total'];
  let tg = `<rect x="40" y="20" width="550" height="192" rx="6" fill="#fff" stroke="${INK}" stroke-width="2"/>`;
  rowY.forEach((y, i) => { tg += `<line x1="40" y1="${y}" x2="590" y2="${y}" stroke="${INK}" stroke-width="${i === 2 ? 2 : 1.2}"/>`; });
  [170, 310, 450].forEach(x => { tg += `<line x1="${x}" y1="20" x2="${x}" y2="212" stroke="${INK}" stroke-width="${x === 450 ? 2 : 1.2}"/>`; });
  head.forEach((h, j) => { tg += T(cx[j], 50, h, { fs: 14 }); }); rows.forEach((r, i) => { tg += T(105, rowY[i] + 30, r, { fs: 14 }); });
  let vals = ''; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) vals += T(cx[j], rowY[i] + 31, String(tc[i][j]), { fs: 17, w: 600 });
  const hl = (x, y, w, h, col) => `<rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${h - 4}" rx="4" fill="${col}" opacity=".4"/>`;
  const croise = S(600, 284, st(1, tg + vals)
    + st(2, hl(170, 68, 140, 48, YEL) + hl(450, 164, 140, 48, YEL) + T(300, 240, 'P(en ligne et satisfait) = 68 ÷ 200 = 0,34', { fs: 14, c: 'kt' }))
    + st(3, hl(170, 68, 140, 48, GRN) + hl(450, 68, 140, 48, GRN) + Tf(300, 270, 'parmi les clients en ligne : 68 ÷ 80 = 0,85', GRN, { fs: 14 })),
  'Tableau croisé de 200 clients : en ligne 68 satisfaits sur 80, en magasin 90 sur 120');

  /* 5. probabilité conditionnelle : on se limite à A (90 clients) */
  chk(rnd(30 / 90, 3) === .333 && 30 / 80 === .375 && rnd(.15 / .45, 3) === .333, 'c7 conditionnelle');
  const condi = S(600, 320, st(1, `<defs><clipPath id="c7cA"><circle cx="235" cy="138" r="94"/></clipPath></defs><rect x="20" y="10" width="560" height="300" rx="10" fill="#fff" stroke="${INK}" stroke-width="2"/>` + T(44, 36, '200 clients', { fs: 13, a: 'start', c: 'ts' }) + `<circle cx="235" cy="138" r="94" fill="${RED}" fill-opacity=".1" stroke="${RED}" stroke-width="2.6"/><circle cx="365" cy="138" r="94" fill="${BLUE}" fill-opacity=".1" stroke="${BLUE}" stroke-width="2.6"/>` + Tf(170, 40, 'A : carte (90)', RED, { fs: 14 }) + Tf(430, 40, 'B : en ligne (80)', BLUE, { fs: 14 }) + T(185, 144, '60', { fs: 18 }) + T(415, 144, '50', { fs: 18 }) + T(300, 144, '30', { fs: 20 }))
    + st(2, `<circle cx="235" cy="138" r="94" fill="none" stroke="${YEL}" stroke-width="9" opacity=".9"/>` + T(300, 256, 'on se limite à A : 90 clients', { fs: 13, c: 'kt' }))
    + st(3, `<circle cx="365" cy="138" r="94" fill="${YEL}" fill-opacity=".85" clip-path="url(#c7cA)"/>` + T(300, 144, '30', { fs: 20 }) + Tf(300, 278, 'P<tspan baseline-shift="sub" font-size="11">A</tspan>(B) = 30 ÷ 90 ≈ 0,33', GRN, { fs: 15 }))
    + st(4, Tf(300, 298, 'P<tspan baseline-shift="sub" font-size="10">B</tspan>(A) = 30 ÷ 80 = 0,375', BLUE, { fs: 13 })),
  'Parmi les 90 clients de A, 30 sont aussi dans B : la probabilité de B sachant A vaut 30 sur 90');

  c.notions = [
    { titre: 'Expérience aléatoire et probabilité', decouvre: { txt: `L’urne contient ${H('50 tickets')} : ${H('5 bons de 20 €')}, ${H('10 bons de 5 €')}, le reste perdant. Un client tire un ticket au hasard. A-t-il plus de chances de gagner ou de perdre ?`, img: SK.urne() },
      comprends: `<p>Tirer un ticket au hasard est une <b>expérience aléatoire</b> : on connaît les résultats possibles, mais pas celui qui va sortir. Chaque résultat possible est une <b>issue</b> ; ici, il y a 50 issues.</p><p>Un <b>évènement</b> est un ensemble d’issues : « gagner un bon de 20 € » contient 5 issues.</p><p>Quand toutes les issues ont la même chance (<b>équiprobabilité</b>), la <b>probabilité</b> d’un évènement est le nombre d’issues favorables divisé par le nombre d’issues possibles.</p><p>P(bon de 20 €) = 5 ÷ 50 = 0,1. P(gagner) = 15 ÷ 50 = 0,3. Une probabilité est toujours entre 0 (impossible) et 1 (certain).</p><p>Sans équiprobabilité (une roue aux secteurs inégaux, par exemple), chaque issue a sa propre probabilité ; leur somme vaut 1. La probabilité d’un évènement est la somme des probabilités de ses issues.</p>`,
      vois: tickets, voisLeg: 'Chaque case est un ticket. On compte les cases de l’évènement, puis on divise par 50.',
      retiens: `<p>${FM(R`P(A)=\dfrac{\text{nombre d’issues favorables à }A}{\text{nombre d’issues possibles}}`)}</p><p>${FM(R`0\le P(A)\le 1`)} · somme des probabilités des issues = 1</p>`,
      exemple: `<p>P(bon de 20 €) = 5 ÷ 50 = <b>0,1</b>, soit 10 %.</p><p>Roue : P(gros lot) = 0,05, P(petit lot) = 0,25, P(perdu) = 0,7 ; P(gagner) = 0,05 + 0,25 = <b>0,3</b>.</p>`,
      wide: K.prog('simuler 1 000 tirages', '<code>random.randint(1, 50)</code> tire un nombre entier au hasard entre 1 et 50. Les numéros 1 à 15 sont les tickets gagnants.', `import random\ngagne = 0\nfor i in range(1000):\n    if random.randint(1, 50) <= 15:\n        gagne = gagne + 1\nprint(gagne / 1000)   # proche de 0.3`, `<p class="prog-q">Pourquoi le résultat change-t-il à chaque exécution ? ${bl(50, 'les tirages sont au hasard')} De quel nombre est-il proche ? ${bl(14, '0,3')}</p>`),
      attention: 'Une probabilité ne dépasse jamais 1. Si tu trouves 15 ou 1,5, tu as oublié de diviser.', astuce: { k: 'sens', t: 'P = 0,3 veut dire : sur un grand nombre de tirages, environ 3 clients sur 10 gagnent.' } },
    { titre: 'Contraire et incompatibles', decouvre: { txt: `La probabilité de gagner est ${H('0,3')}. Quelle est la probabilité de perdre ? Faut-il recompter les tickets perdants ?`, img: SK.croise() },
      comprends: `<p>L’<b>évènement contraire</b> de A, noté Ā (« non A »), contient toutes les issues qui ne sont pas dans A. A et Ā se partagent toutes les issues, donc P(Ā) = 1 − P(A).</p><p>P(perdre) = 1 − P(gagner) = 1 − 0,3 = 0,7. Contrôle : 35 ÷ 50 = 0,7.</p><p>Deux évènements sont <b>incompatibles</b> s’ils ne peuvent pas se produire en même temps : un ticket ne peut pas être à la fois un bon de 20 € et un bon de 5 €. Pour des évènements incompatibles, on additionne : P(bon de 20 € ou bon de 5 €) = 0,1 + 0,2 = 0,3.</p>`,
      vois: ech, voisLeg: 'Sur l’échelle de 0 à 1, gagner et perdre se partagent toute la longueur : leurs probabilités font 1.',
      retiens: `<p>${FM(R`P(\bar A)=1-P(A)`)}</p><p>A et B incompatibles : ${FM(R`P(A\text{ ou }B)=P(A)+P(B)`)}</p>`,
      exemple: `<p>P(perdre) = 1 − 0,3 = <b>0,7</b>.</p><p>P(20 € ou 5 €) = 0,1 + 0,2 = <b>0,3</b>.</p>`,
      attention: 'On n’additionne directement que des évènements incompatibles. S’ils ont des issues communes, voir la notion suivante.', astuce: { k: 'vite', t: 'Quand l’évènement contraire est plus simple à compter, calcule-le puis fais 1 − …' } },
    { titre: 'Réunion et intersection', decouvre: { txt: `Sur ${H('200 clients')}, ${H('90')} ont la carte de fidélité, ${H('80')} achètent en ligne et ${H('30')} font les deux. Combien de clients ont la carte ou achètent en ligne ? Est-ce 90 + 80 ?`, img: SK.union() },
      comprends: `<p>L’<b>intersection</b> « A et B » contient les issues qui sont dans A <b>et</b> dans B : ici les 30 clients qui ont la carte et achètent en ligne.</p><p>La <b>réunion</b> « A ou B » contient les issues qui sont dans A, dans B, ou dans les deux.</p><p>Si on additionne 90 + 80 = 170, on compte deux fois les 30 clients communs. Il faut les enlever une fois : 90 + 80 − 30 = 140. Donc P(A ou B) = 140 ÷ 200 = 0,7.</p><p>Avec les probabilités : P(A ou B) = 0,45 + 0,4 − 0,15 = 0,7.</p>`,
      vois: venn, voisLeg: 'Le centre (30) est l’intersection. Les trois zones colorées forment la réunion : 60 + 30 + 50 = 140.',
      retiens: `<p>${FM(R`P(A\text{ ou }B)=P(A)+P(B)-P(A\text{ et }B)`)}</p><p>On note aussi A ∪ B (réunion) et A ∩ B (intersection).</p>`,
      exemple: `<p>P(A et B) = 30 ÷ 200 = <b>0,15</b>.</p><p>P(A ou B) = 0,45 + 0,4 − 0,15 = <b>0,7</b>.</p>`,
      wide: K.rais('le « ou » des mathématiques', `<p>Au restaurant, « fromage ou dessert » veut souvent dire l’un <b>ou bien</b> l’autre, pas les deux. En mathématiques, « A ou B » est <b>inclusif</b> : il comprend aussi les clients qui sont dans A et dans B. C’est pour cela que la zone commune fait partie de la réunion.</p>`),
      attention: 'N’additionne pas P(A) + P(B) sans enlever P(A et B) : la zone commune serait comptée deux fois.', astuce: { k: 'verif', t: 'Contrôle avec le diagramme : la réunion est la somme des trois zones colorées.' } },
    { titre: 'Le tableau croisé', decouvre: { txt: `Une enquête classe ${H('200 clients')} selon leur mode d’achat (en ligne ou en magasin) et leur satisfaction. Les clients en ligne sont-ils plus souvent satisfaits que ceux du magasin ?`, img: SK.conditionnel() },
      comprends: `<p>Un <b>tableau croisé d’effectifs</b> range une population selon deux critères. Chaque case compte les individus qui vérifient les deux critères ; la dernière ligne et la dernière colonne donnent les totaux.</p><p>Pour un client pris au hasard parmi les 200 : P(en ligne et satisfait) = 68 ÷ 200 = 0,34.</p><p>On peut aussi se limiter aux clients en ligne. On divise alors par le total de cette ligne : 68 ÷ 80 = 0,85. C’est la <b>fréquence conditionnelle</b> des clients satisfaits parmi les clients en ligne. Parmi les clients du magasin, elle vaut 90 ÷ 120 = 0,75.</p><p>On compare donc des proportions, pas des effectifs. Il y a 90 satisfaits en magasin, plus que 68. Mais c’est une plus petite part.</p>`,
      vois: croise, voisLeg: 'En jaune : une case divisée par le total général. En vert : la même case divisée par le total de sa ligne.',
      retiens: `<p>Un client parmi tous : ${FM(R`\dfrac{\text{case}}{\text{total général}}`)}</p><p>« Parmi les clients en ligne » : ${FM(R`\dfrac{\text{case}}{\text{total de la ligne}}`)}</p>`,
      exemple: `<p>P(en ligne et satisfait) = <b>0,34</b>.</p><p>Parmi les clients en ligne : <b>0,85</b> ; en magasin : <b>0,75</b>.</p>`,
      attention: 'Le mot « parmi » change le total par lequel on divise. Lis la question deux fois avant de diviser.', astuce: { k: 'og', t: 'Contrôle les totaux : chaque ligne et chaque colonne doivent tomber juste avant tout calcul.' } },
    { titre: 'La probabilité conditionnelle', decouvre: { txt: `On choisit un client ${H('parmi ceux qui ont la carte')} (A). Quelle est la probabilité qu’il achète aussi en ligne (B) ? Est-ce la même chose que choisir un client en ligne et regarder s’il a la carte ?`, img: SK.conditionnel() },
      comprends: `<p>On note P<sub>A</sub>(B) la <b>probabilité de B sachant A</b>. C’est la probabilité que B se réalise quand on sait déjà que A est réalisé. On se limite aux issues de A, qui devient le nouvel univers.</p><p>Avec des effectifs : P<sub>A</sub>(B) = n(A ∩ B) ÷ n(A). Ici, 30 clients ont la carte et achètent en ligne, sur 90 clients qui ont la carte : P<sub>A</sub>(B) = 30 ÷ 90 ≈ 0,33.</p><p>Avec des probabilités : P<sub>A</sub>(B) = P(A ∩ B) ÷ P(A) = 0,15 ÷ 0,45 ≈ 0,33.</p><p>L’ordre compte : P<sub>B</sub>(A) = 30 ÷ 80 = 0,375. Ce n’est pas le même nombre : on ne se limite pas au même groupe. Dans un tableau croisé, P<sub>A</sub>(B) est la fréquence conditionnelle lue sur la ligne (ou la colonne) de A.</p>`,
      vois: condi, voisLeg: 'On ne regarde plus que le disque A (90 clients). La zone jaune, A ∩ B, en contient 30.',
      retiens: `<p>${FM(R`P_A(B)=\dfrac{n(A\cap B)}{n(A)}=\dfrac{P(A\cap B)}{P(A)}`)}</p><p>En général, ${FM(R`P_A(B)\neq P_B(A)`)}.</p>`,
      exemple: `<p>P<sub>A</sub>(B) = 30 ÷ 90 ≈ <b>0,33</b>.</p><p>P<sub>B</sub>(A) = 30 ÷ 80 = <b>0,375</b>.</p>`,
      wide: K.rais('∈, ⊂ et complémentaire', `<p>Un client x <b>appartient</b> à A : on écrit x ∈ A. Les clients de A ∩ B sont tous dans A : A ∩ B est <b>inclus</b> dans A, on écrit A ∩ B ⊂ A. Le <b>complémentaire</b> de A, noté Ā, contient tous les clients qui ne sont pas dans A : c’est l’évènement contraire.</p>`),
      attention: '« Sachant A » : on divise par l’effectif de A, pas par l’effectif total.', astuce: { k: 'sens', t: 'Lis « sachant A » comme « parmi les A » : c’est la même question que dans le tableau croisé.' } }];

  c.mots = [['expérience aléatoire', 'expérience dont on connaît les résultats possibles mais pas celui qui sortira', 'Tirer un ticket est une expérience aléatoire.'], ['issue', 'résultat possible d’une expérience', 'Il y a 50 issues : les 50 tickets.'], ['évènement', 'ensemble d’issues', '« Gagner » est un évènement.'], ['probabilité', 'nombre entre 0 et 1 qui mesure la chance d’un évènement', 'La probabilité de gagner est 0,3.'], ['équiprobabilité', 'toutes les issues ont la même probabilité', 'Avec des tickets identiques, il y a équiprobabilité.'], ['évènement contraire', 'ensemble des issues qui ne sont pas dans l’évènement', 'Perdre est l’évènement contraire de gagner.'], ['incompatibles', 'qui ne peuvent pas se produire en même temps', 'Bon de 20 € et bon de 5 € sont incompatibles.'], ['intersection', 'issues dans A et dans B', 'L’intersection compte 30 clients.'], ['réunion', 'issues dans A ou dans B (ou les deux)', 'La réunion compte 140 clients.']];

  /* ---------- exercices résolus ---------- */
  chk(rnd(.45 + .4 - .15, 4) === .7 && 60 + 30 + 50 === 140 && rnd(1 - .79, 2) === .21, 'c7 résolus');
  c.resolus = [
    { titre: 'Probabilité d’une réunion', outil: '🧮 calculatrice', enonce: `Sur ${H('200 clients')}, ${H('90')} ont la carte (A), ${H('80')} achètent en ligne (B), ${H('30')} font les deux. On choisit un client au hasard. Calcule P(A), P(B), P(A et B) puis P(A ou B).`,
      rows: [['P(A) = 90 ÷ 200 = <b class="nw">0,45</b> ; P(B) = 80 ÷ 200 = <b class="nw">0,4</b>', 'Issues favorables ÷ issues possibles.'], ['P(A et B) = 30 ÷ 200 = <b class="nw">0,15</b>', 'Les clients des deux groupes.'], ['P(A ou B) = 0,45 + 0,4 − 0,15 = <b class="nw">0,7</b>', 'J’enlève l’intersection, comptée deux fois.'], ['P(ni A ni B) = 1 − 0,7 = <b class="nw">0,3</b>', 'Évènement contraire de « A ou B ».']], verif: 'Avec les effectifs : 60 + 30 + 50 = 140 et 140 ÷ 200 = 0,7 ✓.', rep: 'P(A ou B) = 0,7 : 7 clients sur 10 ont la carte ou achètent en ligne.', go: ['e1', 'e2'] },
    { titre: 'À toi : lire un tableau croisé', outil: '🧮 calculatrice', enonce: `Avec le tableau croisé des 200 clients (en ligne : 68 satisfaits sur 80 ; magasin : 90 satisfaits sur 120), calcule les probabilités demandées.`, trous: [0, 1, 2, 3],
      rows: [['P(satisfait) = 158 ÷ 200 = ⟦0,79⟧', 'Total des satisfaits ÷ total général.'], ['P(pas satisfait) = 1 − 0,79 = ⟦0,21⟧', 'Évènement contraire.'], ['Parmi les clients du magasin : 90 ÷ 120 = ⟦0,75⟧', 'Je divise par le total de la ligne « magasin ».'], ['Parmi les clients en ligne : 68 ÷ 80 = ⟦0,85⟧', 'Je divise par le total de la ligne « en ligne ».']], verif: '42 ÷ 200 = 0,21 : même résultat qu’avec le contraire ✓.', rep: 'Les clients en ligne sont plus souvent satisfaits (0,85) que ceux du magasin (0,75).', go: ['e3'] }];
  c.entraine = [{ id: 'e1', gen: 'c7e1', lc: 2 }, { id: 'e2', gen: 'c7e2', lc: 3 }, { id: 'e3', gen: 'c7e3', lc: 4 }];

  /* ---------- je résous ---------- */
  chk(2 / 40 === .05 && 8 / 40 === .2 && 1 - .2 === .8 && 400 * .2 === 80, 'c7 p1');
  chk(60 / 150 === .4 && rnd(25 / 150, 3) === .167 && rnd(110 / 150, 3) === .733 && rnd(40 / 150, 3) === .267, 'c7 p2');
  chk(40 / 250 === .16 && 30 / 250 === .12 && 30 / 150 === .2 && 10 / 100 === .1, 'c7 p3');
  c.probs = [
    PB({ id: 'p1', etape: 2, lc: 2, comps: ['app', 'rea'], titre: 'Les cartes à gratter', intro: `<p>Un magasin distribue des cartes à gratter. Dans un paquet de ${H('40 cartes')} : ${H('2 bons de 30 €')}, ${H('6 bons de 10 €')}, les autres sont perdantes. Un client reçoit une carte au hasard.</p>`,
      qs: [Q('a.', 'Calcule P(bon de 30 €).', '2 ÷ 40 = 0,05', .05, { w: 24, tol: .0006 }), Q('b.', 'Calcule P(gagner un bon).', '(2 + 6) ÷ 40 = 0,2', .2, { w: 24, tol: .0006 }), Q('c.', 'Calcule P(perdre).', '1 − 0,2 = 0,8', .8, { w: 24, tol: .0006 }), Q('d.', 'Sur 400 clients, combien de gagnants peut-on attendre ?', '400 × 0,2 = 80 gagnants environ', 80, { w: 24 })],
      err: { 0: [{ v: 2, m: 'Une probabilité est un quotient : 2 ÷ 40.' }], 1: [{ v: .15, m: 'Tu as pris seulement les bons de 10 €. Gagner, c’est 30 € ou 10 €.' }], 2: [{ v: .2, m: 'C’est la probabilité de gagner. Perdre est le contraire : 1 − 0,2.' }] },
      hints: ['Compte les cartes favorables, divise par 40.', 'Les évènements « 30 € » et « 10 € » sont incompatibles : additionne.', 'Le nombre attendu est 400 × P(gagner).'], pouce: 'Perdre est l’évènement contraire de gagner : 1 − P(gagner).', corr: 'a. 0,05. b. 0,2. c. 0,8. d. Environ 80 gagnants.' }),
    PB({ id: 'p2', etape: 3, lc: 3, defi: 4, bulle: 'Ce cas se fait en 4 étapes. Fais d’abord un diagramme : la zone commune ne doit être comptée qu’une fois.', autravail: { comp: 'ana', txt: 'exploiter une enquête de fréquentation pour cibler une promotion.' }, comps: ['ana', 'rea', 'val'], titre: 'Le samedi et les promotions',
      intro: `<p>Sur ${H('150 clients')} interrogés, ${H('60')} viennent le samedi (S), ${H('75')} achètent un produit en promotion (Pm) et ${H('25')} font les deux. On choisit un client au hasard. Donne les probabilités au millième.</p>`,
      qs: [Q('a.', 'Calcule P(S).', '60 ÷ 150 = 0,4', .4, { w: 24, tol: .0006 }), Q('b.', 'Calcule P(S et Pm).', '25 ÷ 150 ≈ 0,167', .167, { w: 24, tol: .0006 }), Q('c.', 'Calcule P(S ou Pm).', '(60 + 75 − 25) ÷ 150 = 110 ÷ 150 ≈ 0,733', .733, { w: 24, tol: .0006 }), Q('d.', 'Calcule la probabilité qu’un client ne vienne pas le samedi et n’achète pas en promotion.', '1 − 0,733… = 40 ÷ 150 ≈ 0,267', .267, { w: 24, tol: .0006 })],
      err: { 2: [{ v: .9, m: '60 + 75 compte deux fois les 25 clients communs : enlève-les.' }], 3: [{ v: .733, m: 'C’est P(S ou Pm). On demande l’évènement contraire.' }] },
      hints: ['Place 25 au centre du diagramme, puis 35 et 50 autour.', 'P(S ou Pm) = P(S) + P(Pm) − P(S et Pm).', '« Ni l’un ni l’autre » est le contraire de « S ou Pm ».'], pouce: 'Calcule l’effectif de la réunion : 60 + 75 − 25 = 110.', corr: 'a. 0,4. b. ≈ 0,167. c. ≈ 0,733. d. ≈ 0,267.' }),
    PB({ id: 'p3', etape: 4, lc: 4, cls: 'bac', defi: 5, bulle: 'Voici une question de « vers le bac » : 5 étapes. Attention au mot « parmi » : il change le nombre par lequel tu divises.', autravail: { comp: 'com', txt: 'conseiller un client sur un mode de livraison en s’appuyant sur des chiffres.' }, comps: ['rea', 'ana', 'com'], titre: 'Domicile ou point relais ?',
      intro: `<p>Une boutique en ligne a étudié ${H('250 commandes')}.</p>${tab(['', 'en retard', 'à l’heure', 'total'], [['livraison à domicile', '30', '120', '150'], ['point relais', '10', '90', '100'], ['total', '40', '210', '250']], 'dt-c')}`,
      qs: [BQ('1', 'Calculer la probabilité qu’une commande soit en retard.', 'rea', '40 ÷ 250 = 0,16', .16, { w: 24, tol: .0006 }), BQ('2', 'Calculer P(domicile et en retard).', 'rea', '30 ÷ 250 = 0,12', .12, { w: 24, tol: .0006 }), BQ('3', 'Parmi les livraisons à domicile, calculer la probabilité d’un retard.', 'ana', '30 ÷ 150 = 0,2', .2, { w: 24, tol: .0006 }), BQ('4', 'Parmi les livraisons en point relais, calculer la probabilité d’un retard.', 'ana', '10 ÷ 100 = 0,1', .1, { w: 24, tol: .0006 }), BQ('5', 'Justifier : quel mode de livraison conseiller à un client pressé ?', 'com', 'Le point relais : la probabilité de retard y est de 0,1, contre 0,2 à domicile.', null, { lines: 3 })],
      err: { 2: [{ v: .12, m: '« Parmi les livraisons à domicile » : divise par 150, le total de la ligne.' }], 3: [{ v: .04, m: '« Parmi les livraisons en point relais » : divise par 100.' }] },
      hints: ['Pour une commande parmi toutes : divise par 250.', '« Parmi les livraisons à domicile » : divise par 150.', 'Compare les deux proportions de retard.'], pouce: 'Pour comparer les deux modes, divise chaque case « en retard » par le total de sa ligne.', corr: '1. 0,16. 2. 0,12. 3. 0,2. 4. 0,1. 5. Le point relais : deux fois moins de retards en proportion.' })];

  c.bilan = [['Je sais calculer la probabilité d’un évènement.', ['e1', 'p1']], ['Je sais utiliser l’évènement contraire et des évènements incompatibles.', ['e1', 'p1']], ['Je sais calculer la probabilité d’une réunion et d’une intersection.', ['e2', 'p2']], ['Je sais lire et utiliser un tableau croisé.', ['e3', 'p3']], ['Je sais calculer une probabilité conditionnelle P_A(B).', ['e3', 'p3']]];
  c.words = require('./gl1')('c7');
  c.plusTr = [{ id: 't1', gen: 'c7t1', lc: 1 }];
  c.plusloin = { meca: [], probs: [] };
  return c;
};
