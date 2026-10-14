/* Chapitre 1 · Suites numériques — Terminale Bac Pro (arrêté du 3 février 2020, BO spécial n° 1 du 6 février 2020). */
'use strict';
const K = require('./kitT');
const { rnd, H, FM, R, Q, BQ, PB, S, T, Rc, Ar, Br, st, MCVP, bl, tab } = K;
const { SK, FEVAD } = require('./skT');
const { fr } = K.MCVG;
const f2 = x => fr(rnd(x, 2));

module.exports = function (chk) {
  const c = { id: 'c1', n: 1, col: 'algo', icone: '📈', dom: 'Algèbre-analyse · suites numériques', titre: 'Suites numériques', sous: 'Évoluer à taux fixe' };
  c.parties = [{ t: 'Suites géométriques', n: [1, 2] }, { t: 'Sens de variation et représentation', n: [3] }, { t: 'Sommes et évolution à taux fixe', n: [4, 5] }];
  c.travail = { question: `La box « Éclat » (entreprise fictive) compte ${H('800 abonnés')} et en gagne ${H('5 %')} chaque mois. Combien en aura-t-elle dans un an ? Combien de box aura-t-elle envoyées en tout ? Tu sauras répondre aux notions 2 et 4.` };
  c.objectifs = ['Je saurai reconnaître une suite géométrique et donner sa raison.', 'Je saurai calculer le terme de rang n : uₙ = u₀ × qⁿ.', 'Je saurai justifier le sens de variation et représenter le nuage de points (n ; uₙ).', 'Je saurai additionner les premiers termes avec un tableur ou Python.', 'Je saurai relier une évolution à taux fixe à une fonction exponentielle.'];
  c.depart = 'c1';

  /* ---------- données ---------- */
  const u = n => 800 * Math.pow(1.05, n), v = n => 600 * Math.pow(.85, n), p = x => 100 * Math.pow(1.02, x);
  let S12 = 0, S11 = 0; for (let n = 0; n < 12; n++) { S12 += u(n); if (n < 11) S11 += u(n); }
  chk(rnd(u(12)) === 1436.69 && rnd(S12) === 12733.7 && rnd(S11) === 11365.43 && rnd(u(10)) === 1303.12 && rnd(u(11)) === 1368.27, 'c1 box');
  chk(rnd(v(3)) === 368.48 && rnd(v(5)) === 266.22 && rnd(p(2.5)) === 105.08 && rnd(p(10)) === 121.9, 'c1 téléphone et panier');
  const QF = FEVAD.slice(1).map(([a, x], i) => rnd(x / FEVAD[i][1], 3));
  chk(QF.join() === '1.134,1.115,1.084,1.152,1.138,1.105', 'c1 quotients Fevad');

  /* ---------- méthodes visuelles ---------- */
  const ORG = MCVP.ORG, BLUE = MCVP.BLUE, RED = MCVP.RED;
  // 1. la chaîne des termes : on multiplie toujours par 1,05
  const xs = [30, 175, 320, 465], vals = ['u₀ = 800', 'u₁ = 840', 'u₂ = 882', 'u₃ = 926,1'];
  const chaine = S(600, 230, st(1, xs.map((x, i) => Rc(x, 44, 110, 46, { c: i ? 'k2' : 'k', rx: 10 }) + T(x + 55, 73, vals[i], { fs: 15, c: i ? 'tx' : 'tw' })).join(''))
    + st(2, [0, 1, 2].map(i => Ar(xs[i] + 112, 67, xs[i + 1] - 2, 67, { w: 2.6, h: 9 }) + T(xs[i] + 127, 32, '× 1,05', { fs: 15, c: 'kt' })).join(''))
    + st(3, [0, 1, 2].map(i => T(xs[i] + 127, 116, ['+ 40', '+ 42', '+ 44,1'][i], { fs: 14, c: 'ts' })).join('') + T(300, 146, 'les écarts changent : la suite n’est pas arithmétique', { fs: 14, c: 'ts' }))
    + st(4, `<rect x="40" y="162" width="520" height="56" rx="10" class="k2 ks" stroke-width="2"/>` + T(300, 186, '840 ÷ 800 = 882 ÷ 840 = 926,1 ÷ 882 = 1,05', { fs: 15 }) + T(300, 208, 'le quotient est constant : suite géométrique de raison q = 1,05', { fs: 13, c: 'kt' })),
  'Quatre termes reliés par « × 1,05 » : les écarts changent, mais le quotient reste 1,05');
  chk(rnd(u(1) - u(0), 2) === 40 && rnd(u(2) - u(1), 2) === 42 && rnd(u(3) - u(2), 2) === 44.1 && rnd(u(3), 2) === 926.1, 'c1 chaîne');
  // 2. le terme de rang 12 : 12 fois × 1,05, puis la calculatrice
  const key = (x, y, s, hot) => `<rect x="${x}" y="${y}" width="34" height="30" rx="6" class="${hot ? 'k' : 'wh'} ks" stroke-width="1.8"/>` + T(x + 17, y + 20, s, { fs: 14, c: hot ? 'tw' : 'tx' });
  const rang = S(600, 290, st(1, Rc(14, 30, 104, 44, { c: 'k', rx: 10 }) + T(66, 58, 'u₀ = 800', { fs: 15, c: 'tw' }) + Array.from({ length: 12 }, (_, i) => Rc(130 + i * 38, 36, 34, 32, { c: 'k2', rx: 7, sw: 1.6 }) + T(147 + i * 38, 57, '× q', { fs: 12 })).join('') + Br(130, 582, 76, '12 fois × 1,05'))
    + st(2, T(300, 142, 'u₁₂ = 800 × 1,05¹²', { fs: 22, c: 'kt' }))
    + st(3, ['8', '0', '0', '×', '1', ',', '0', '5', '^', '1', '2', '='].map((s, i) => key(48 + i * 43, 168, s, s === '^')).join(''))
    + st(4, T(300, 236, 'l’écran affiche 1 436,69…', { fs: 15 }) + T(300, 268, 'environ 1 437 abonnés au mois 12 (on arrondit à l’unité)', { fs: 15, c: 'kt' })),
  'Du rang 0 au rang 12, on multiplie 12 fois par 1,05 ; la calculatrice donne 1 436,69');
  // 3. sens de variation : deux nuages de points
  const g3 = MCVP.plot({ W: 600, H: 300, x: [0, 12, 1], y: [0, 1600, 400], ml: 56, mt: 18, mb: 34, xl: 'rang n', yl: 'valeur', fine: true, lab: 'Abonnés (q = 1,05) et valeur d’un téléphone (q = 0,85)' });
  const N13 = [...Array(13).keys()];
  const sens = S(600, 300, st(1, g3.base + g3.pts(N13.map(n => [n, u(n)]), { r: 5, fill: ORG }) + g3.txt(7.5, 1300, '● q = 1,05 > 1 : croissante', { a: 'end', fill: ORG, cls: '' }))
    + st(2, g3.pts(N13.map(n => [n, v(n)]), { r: 5, fill: BLUE }) + g3.txt(11.8, 560, '● 0 < q = 0,85 < 1 : décroissante', { a: 'end', fill: BLUE, cls: '' }))
    + st(3, g3.seg(0, u(0), 12, u(12), { stroke: RED, dash: '8 5', w: 1.8 }) + g3.txt(0.3, 1530, 'les points orange restent sous le segment rouge : ils ne sont pas alignés', { a: 'start', fs: 12.5 }))
    + st(4, g3.dot(12, u(12), { r: 6, fill: '#FFC233' }) + g3.dot(12, v(12), { r: 6, fill: '#FFC233' })),
  'Les points orange montent de plus en plus vite ; les points bleus descendent de moins en moins vite');
  // 4. la somme au tableur
  const cw = [40, 80, 200, 360, 540], rh = 27, y0 = 22;
  const rowsT = [['', 'A', 'B', 'C'], ['1', 'n', 'uₙ', 'cumul'], ['2', '0', '800', '800'], ['3', '1', '840', '1 640'], ['4', '2', '882', '2 522'], ['⋮', '⋮', '⋮', '⋮'], ['12', '10', fr(u(10), 2), fr(S11, 2)], ['13', '11', fr(u(11), 2), fr(S12, 2)]];
  const cellX = j => (cw[j] + cw[j + 1]) / 2;
  const grid = rowsT.map((r, i) => r.map((s, j) => `<rect x="${cw[j]}" y="${y0 + i * rh}" width="${cw[j + 1] - cw[j]}" height="${rh}" class="${i === 0 || j === 0 ? 'k2' : 'wh'}" stroke="#9aa3c7" stroke-width="1"/>`).join('')).join('');
  const txt = (cols) => rowsT.map((r, i) => r.map((s, j) => cols.includes(j) || i < 2 ? T(cellX(j), y0 + i * rh + 19, s, { fs: 13, c: i < 2 ? 'kt' : 'tx', w: i < 2 ? 800 : 600 }) : '').join('')).join('');
  const somme = S(600, 300, st(1, grid + txt([0, 1, 2]))
    + st(2, rowsT.slice(2).map((r, k) => T(cellX(3), y0 + (k + 2) * rh + 19, r[3], { fs: 13, w: 600 })).join(''))
    + st(3, `<rect x="360" y="${y0 + 7 * rh}" width="180" height="${rh}" fill="none" stroke="${RED}" stroke-width="3"/>` + T(450, y0 + 8 * rh + 22, 'en C13 : =C12+B13', { fs: 14, c: 'kt' }))
    + st(4, T(40, 290, 'Total des 12 premiers mois ≈ 12 733,70 : environ 12 734 box', { fs: 15, a: 'start', c: 'kt' })),
  'Un tableur : les termes en colonne B, leur cumul en colonne C ; la dernière case vaut 12 733,70');
  // 5. de la suite à la fonction exponentielle
  const g5 = MCVP.plot({ W: 600, H: 300, x: [0, 20, 2], y: [80, 160, 20], ml: 56, mt: 18, mb: 34, xl: 'années', yl: 'prix (€)', lab: 'Prix d’un panier de 100 € qui augmente de 2 % par an' });
  const expo = S(600, 300, st(1, g5.base + g5.pts([...Array(21).keys()].map(n => [n, p(n)]), { r: 4.2, fill: ORG }) + T(300, 296, 'l’axe vertical commence à 80 €', { fs: 11, c: 'ts' }))
    + st(2, g5.curve(p, { stroke: ORG, w: 2.6 }) + g5.txt(.4, 150, 'f(x) = 100 × 1,02ˣ', { a: 'start', fs: 15 }))
    + st(3, g5.guide(2.5, p(2.5)) + g5.dot(2.5, p(2.5), { r: 6, fill: '#FFC233', lab: 'f(2,5) ≈ 105,08', dx: 14, dy: 22 }))
    + st(4, g5.dot(10, p(10), { r: 6, fill: '#FFC233', lab: 'f(10) ≈ 121,90', dx: -12, dy: -14, a: 'end' }) + g5.txt(19.6, 92, 'la courbe passe par tous les points de la suite', { a: 'end', fs: 13 })),
  'Les points de la suite sont sur la courbe de la fonction exponentielle f(x) = 100 × 1,02 puissance x');

  c.notions = [
    { titre: 'Reconnaître une suite géométrique', decouvre: { txt: `Selon la Fevad, les ventes en ligne en France sont passées de ${H('80,5 milliards d’euros')} en 2017 à ${H('91,3 milliards')} en 2018, puis ${H('101,8 milliards')} en 2019. Les hausses en euros sont-elles les mêmes ? Et en pourcentage ?`, img: SK.fevad() },
      comprends: `<p>Une suite est <b>géométrique</b> quand on passe d’un terme au suivant en <b>multipliant toujours par le même nombre q</b>. Ce nombre est la <b>raison</b> : uₙ₊₁ = uₙ × q. Dans ce chapitre, q est positif.</p><p>Pour reconnaître une telle suite, on calcule les <b>quotients</b> de deux termes consécutifs. S’ils sont tous égaux, la suite est géométrique.</p><p>La box « Éclat » compte 800 abonnés, puis gagne 5 % d’abonnés par mois. Augmenter de 5 %, c’est multiplier par 1,05. On obtient 800, 840, 882, 926,1… Les écarts changent, mais le quotient reste 1,05.</p><p>Les ventes en ligne n’ont pas une raison exacte : leurs quotients vont de 1,08 à 1,15. Une suite géométrique en donne un <b>modèle</b> approché.</p>`,
      vois: chaine, voisLeg: 'On passe d’un terme au suivant par « × 1,05 ». Les écarts en abonnés changent (+ 40, + 42, + 44,1) ; le quotient, lui, ne change pas.',
      retiens: `<p>${FM(R`u_{n+1}=u_n\times q \qquad q=\dfrac{u_{n+1}}{u_n}`)}</p><p>Hausse de t % : ${FM(R`q=1+\dfrac{t}{100}`)} · Baisse de t % : ${FM(R`q=1-\dfrac{t}{100}`)}</p>`,
      exemple: `<p>840 ÷ 800 = 882 ÷ 840 = 1,05 : suite géométrique, <b>q = 1,05</b>.</p><p>Baisse de 15 % par an : <b>q = 0,85</b>.</p>`,
      wide: K.rais('un contre-exemple suffit', `<p>La suite 2 ; 6 ; 18 ; 50 est-elle géométrique ? 6 ÷ 2 = 3 et 18 ÷ 6 = 3, mais 50 ÷ 18 ≈ 2,78. Pour dire « oui », il faut que <b>tous</b> les quotients soient égaux. Pour dire « non », <b>un seul</b> quotient différent suffit : c’est un <b>contre-exemple</b>.</p>`),
      attention: 'La raison d’une suite géométrique est un quotient, pas une différence : q = 840 ÷ 800, et non 840 − 800.', astuce: { k: 'sens', t: '« + 5 € chaque mois » annonce une suite arithmétique ; « + 5 % chaque mois », une suite géométrique.' } },
    { titre: 'Le terme de rang n', decouvre: { txt: `La box « Éclat » part de ${H('800 abonnés')} et gagne ${H('5 %')} par mois. Faut-il calculer les mois un par un pour connaître le nombre d’abonnés au ${H('mois 12')} ?`, img: SK.calculette() },
      comprends: `<p>De u₀ à u₁, on multiplie une fois par q. De u₀ à u₂, deux fois. De u₀ à uₙ, on multiplie <b>n fois</b> par q. D’où la formule du <b>terme de rang n</b> : uₙ = u₀ × qⁿ.</p><p>Pour la box : u₁₂ = 800 × 1,05¹². À la calculatrice, on utilise la touche puissance. On trouve environ 1 436,69 : il y aura environ 1 437 abonnés au mois 12.</p><p>Si la suite commence au rang 1, la formule devient uₙ = u₁ × qⁿ⁻¹. En effet, de u₁ à uₙ, on multiplie n − 1 fois.</p><p>Au tableur, on écrit en B2 la formule =800*1,05^A2, puis on la recopie vers le bas.</p>`,
      vois: rang, voisLeg: 'Douze multiplications par 1,05 s’écrivent avec une puissance. La touche puissance de la calculatrice fait le calcul en une fois.',
      retiens: `<p>${FM(R`u_n=u_0\times q^n`)}</p><p>Si le premier terme est u₁ : ${FM(R`u_n=u_1\times q^{\,n-1}`)}</p>`,
      exemple: `<p>u₁₂ = 800 × 1,05¹² ≈ 1 436,69 : environ <b>1 437 abonnés</b>.</p><p>Téléphone : v₃ = 600 × 0,85³ ≈ <b>368,48 €</b>.</p>`,
      wide: K.prog('calculer un terme', 'La fonction <code>terme</code> applique la formule u₀ × qⁿ. En Python, la puissance s’écrit <code>**</code>.', `def terme(u0, q, n):\n    return u0 * q ** n\n\nprint(round(terme(800, 1.05, 12), 2))   # affiche 1436.69`, `<p class="prog-q">Que renvoie <code>round(terme(600, 0.85, 3), 2)</code> ? ${bl(20, '368.48')} Que représente ce nombre ? ${bl(56, 'la valeur du téléphone au bout de 3 ans')}</p>`),
      attention: 'u₁₂ = 800 × 1,05¹², pas 800 × 1,05 × 12 : l’exposant n’est pas un facteur.', astuce: { k: 'og', t: 'Avec + 5 % par mois, un nombre double en 14 à 15 mois. Au mois 12, on attend un peu moins du double de 800 : 1 437 convient.' } },
    { titre: 'Sens de variation et nuage de points', decouvre: { txt: `Un téléphone reconditionné vaut ${H('600 €')}. Sa valeur baisse de ${H('15 %')} chaque année. Les points (n ; valeur) montent-ils ou descendent-ils ? Sont-ils alignés ?`, img: SK.phone() },
      comprends: `<p>Une suite géométrique de premier terme positif varie selon sa raison q.</p><p>Si <b>q &gt; 1</b>, chaque terme est plus grand que le précédent : la suite est <b>croissante</b>. C’est le cas des abonnés, avec q = 1,05.</p><p>Si <b>0 &lt; q &lt; 1</b>, chaque terme est plus petit : la suite est <b>décroissante</b>. C’est le cas du téléphone : baisser de 15 %, c’est multiplier par 0,85.</p><p>Si q = 1, tous les termes sont égaux : la suite est constante.</p><p>On représente la suite par le <b>nuage de points</b> (n ; uₙ). Ces points ne sont pas alignés. Les écarts grandissent quand la suite croît ; ils rétrécissent quand elle décroît.</p>`,
      vois: sens, voisLeg: 'Orange : les abonnés, q = 1,05. Bleu : la valeur du téléphone, q = 0,85. Aucun des deux nuages n’est aligné.',
      retiens: `<p>Pour u₀ &gt; 0 : ${FM(R`q>1`)} croissante · ${FM(R`0<q<1`)} décroissante · ${FM(R`q=1`)} constante.</p><p>Le nuage (n ; uₙ) d’une suite géométrique n’est pas aligné.</p>`,
      exemple: `<p>Abonnés : q = 1,05 &gt; 1 → <b>croissante</b>.</p><p>Téléphone : q = 0,85 → <b>décroissante</b> ; v₅ ≈ 266,22 €.</p>`,
      wide: K.rais('une preuve pour tout n', `<p>uₙ₊₁ − uₙ = uₙ × q − uₙ = uₙ × (q − 1). Si tous les termes sont positifs, cette différence a le signe de q − 1, <b>pour tout</b> rang n. Avec q = 1,05 : q − 1 = 0,05 &gt; 0, donc la suite est croissante. Calculer trois termes donne seulement une <b>conjecture</b> ; ce calcul est une <b>preuve</b>.</p>`),
      attention: 'Une baisse de 15 % donne q = 0,85, et non q = − 0,15 : la raison reste positive.', astuce: { k: 'verif', t: 'Regarde le nuage : des points qui montent de plus en plus vite signalent une suite géométrique croissante.' } },
    { titre: 'La somme des premiers termes', decouvre: { txt: `Chaque abonné reçoit une box par mois. Combien de box la marque « Éclat » enverra-t-elle en tout pendant ${H('les 12 premiers mois')}, du mois 0 au mois 11 ?`, img: SK.cumul() },
      comprends: `<p>On cherche S = u₀ + u₁ + … + u₁₁ : la <b>somme des 12 premiers termes</b>.</p><p>Au <b>tableur</b>, la colonne B contient les termes. La colonne C les <b>cumule</b> : en C3, on écrit =C2+B3, puis on recopie vers le bas. La formule =SOMME(B2:B13) donne le même total.</p><p>Avec <b>Python</b>, une boucle ajoute chaque terme au total, puis calcule le terme suivant.</p><p>On trouve S ≈ 12 733,70 : la marque enverra environ 12 734 box en un an.</p><p>Il existe une formule, mais elle n’est pas à connaître. Retiens la méthode : on cumule les termes un par un, avec un outil numérique.</p>`,
      vois: somme, voisLeg: 'Chaque case de la colonne C ajoute le terme de la ligne au cumul de la ligne du dessus. La dernière case donne la somme des 12 termes.',
      retiens: `<p>${FM(R`S=u_0+u_1+\dots+u_{n-1}`)} : la somme des n premiers termes.</p><p>Tableur : =SOMME(B2:B13), ou un cumul =C2+B3 recopié. Python : une boucle <code>for</code>.</p><p class="small">Pour aller plus loin (formule non exigible) : ${FM(R`S=u_0\times\dfrac{1-q^n}{1-q}`)}</p>`,
      exemple: `<p>Mois 0 à 2 : 800 + 840 + 882 = <b>2 522</b>.</p><p>Mois 0 à 11 : S ≈ <b>12 733,70</b>, soit environ 12 734 box.</p>`,
      wide: K.prog('cumuler les termes', 'La variable <code>total</code> part de 0. La boucle lui ajoute chaque terme, puis passe au terme suivant en multipliant par 1,05.', `u = 800\ntotal = 0\nfor n in range(12):\n    total = total + u\n    u = u * 1.05\nprint(round(total, 2))   # affiche 12733.7`, `<p class="prog-q">Quelle ligne calcule le terme suivant ? ${bl(30, 'u = u * 1.05')} Que faut-il changer pour 24 mois ? ${bl(30, 'range(24)')}</p>`),
      attention: 'Du mois 0 au mois 11, il y a 12 termes, et non 11.', astuce: { k: 'og', t: 'Ordre de grandeur : 12 termes entre 800 et 1 368. La somme est entre 12 × 800 = 9 600 et 12 × 1 368 ≈ 16 400.' } },
    { titre: 'Évolution à taux fixe et fonction exponentielle', decouvre: { txt: `Selon l’Insee, les prix à la consommation ont augmenté de ${H('2,0 %')} en 2024 et de ${H('0,9 %')} en 2025. Imagine un panier de ${H('100 €')} dont le prix augmente de 2 % chaque année. Que vaut-il au bout de deux ans et demi ?`, img: SK.prix() },
      comprends: `<p>Une grandeur qui augmente, ou baisse, d’un même pourcentage à chaque période <b>évolue à taux fixe</b>. Ses valeurs forment une suite géométrique : uₙ = u₀ × qⁿ.</p><p>Pour le panier : uₙ = 100 × 1,02ⁿ. Mais le temps ne s’arrête pas aux années entières. On remplace n par un nombre x quelconque : f(x) = 100 × 1,02ˣ. C’est une <b>fonction exponentielle</b>, étudiée au chapitre 4.</p><p>Sa courbe passe par tous les points de la suite. On peut calculer des valeurs intermédiaires : f(2,5) = 100 × 1,02<sup>2,5</sup> ≈ 105,08 €.</p><p>Dans la réalité, le taux change chaque année : 2,0 % puis 0,9 %. Le taux fixe est un <b>modèle</b>.</p>`,
      vois: expo, voisLeg: 'Les points orange sont les valeurs de la suite, année par année. La courbe de f les relie et donne aussi les valeurs entre deux années.',
      retiens: `<p>Évolution à taux fixe : ${FM(R`f(x)=u_0\times q^x`)}, avec ${FM(R`f(n)=u_n`)} aux nombres entiers.</p><p>q &gt; 1 : la fonction est croissante ; 0 &lt; q &lt; 1 : elle est décroissante.</p>`,
      exemple: `<p>f(10) = 100 × 1,02¹⁰ ≈ <b>121,90 €</b>.</p><p>f(2,5) = 100 × 1,02<sup>2,5</sup> ≈ <b>105,08 €</b>.</p>`,
      wide: K.rais('le statut des lettres', `<p>Dans uₙ, la lettre n est un <b>rang</b> : un nombre entier (0, 1, 2…). Dans f(x), la lettre x est une <b>variable</b> : elle peut prendre toutes les valeurs d’un intervalle, par exemple 2,5. La suite, c’est la fonction f prise aux nombres entiers.</p>`),
      attention: 'Une évolution à taux fixe n’est pas affine : pour 2,5 ans, ne calcule pas 100 + 2,5 × 2. Calcule 100 × 1,02<sup>2,5</sup>.', astuce: { k: 'sens', t: 'Taux fixe, suite géométrique, fonction exponentielle : trois façons de décrire la même évolution.' } }];

  c.mots = [['suite géométrique', 'suite où l’on multiplie toujours par le même nombre', 'Les abonnés suivent une suite géométrique.'], ['raison q', 'nombre par lequel on multiplie à chaque rang', 'La raison est 1,05.'], ['terme de rang n', 'le nombre uₙ, calculé par uₙ = u₀ × qⁿ', 'Le terme de rang 12 vaut environ 1 437.'], ['coefficient multiplicateur', 'nombre qui traduit une hausse ou une baisse en %', 'Une baisse de 15 % : coefficient 0,85.'], ['croissante, décroissante', 'les termes montent, ou descendent', 'La valeur du téléphone est décroissante.'], ['nuage de points', 'les points (n ; uₙ) placés dans un repère', 'Le nuage n’est pas aligné.'], ['somme cumulée', 'total des premiers termes', 'En un an, environ 12 734 box.'], ['évolution à taux fixe', 'même pourcentage à chaque période', 'Le prix évolue à taux fixe : + 2 % par an.'], ['modèle', 'calcul simple qui approche des données réelles', 'Le modèle à + 12 % par an approche les ventes en ligne.']];

  /* ---------- exercices résolus ---------- */
  chk(rnd(v(2), 2) === 433.5 && rnd(rnd(v(3), 2) - rnd(v(2), 2), 2) === -65.02, 'c1 résolu 2');
  c.resolus = [
    { titre: 'Prévoir des abonnés', outil: '🧮 calculatrice', enonce: `La box « Éclat » (entreprise fictive) compte ${H('800 abonnés')} au mois 0 et gagne ${H('5 %')} d’abonnés par mois. Donne la raison, le sens de variation et le nombre d’abonnés au mois 12.`,
      rows: [['q = 1 + 5 ÷ 100 = <b>1,05</b>', 'Une hausse de 5 % multiplie par 1,05.'], ['q = 1,05 &gt; 1 et u₀ &gt; 0 : suite <b>croissante</b>', 'Le sens de variation se lit sur la raison.'], ['uₙ = 800 × 1,05ⁿ', 'Terme de rang n : u₀ × qⁿ.'], ['u₁₂ = 800 × 1,05¹² ≈ <b class="nw">1 436,69</b>', 'Touche puissance de la calculatrice.']], verif: 'u₁ = 840 et 840 ÷ 800 = 1,05 ✓. Le résultat est un peu moins du double de 800 : cohérent avec + 5 % par mois pendant un an.', rep: 'La suite est croissante ; il y aura environ 1 437 abonnés au mois 12.', go: ['e1'] },
    { titre: 'À toi : la décote d’un téléphone', outil: '🧮 calculatrice', enonce: `Un téléphone reconditionné vaut ${H('600 €')}. Sa valeur baisse de ${H('15 %')} par an. Trouve la raison, le sens de variation et la valeur au bout de 3 ans.`, trous: [0, 1, 2, 3],
      rows: [['q = 1 − 15 ÷ 100 = ⟦0,85⟧', 'Une baisse de 15 % multiplie par 0,85.'], ['0 &lt; q &lt; 1 : suite ⟦décroissante⟧', 'Le sens de variation se lit sur la raison.'], ['v₃ = 600 × 0,85³ ≈ ⟦368,48⟧ €', 'Terme de rang 3 : v₀ × q³.'], ['v₃ − v₂ ≈ 368,48 − 433,50 = ⟦− 65,02⟧ €', 'La baisse en euros de la 3e année.']], verif: '368,48 ÷ 433,50 ≈ 0,85 ✓ : on retrouve la raison.', rep: 'Le téléphone vaut environ 368,48 € au bout de 3 ans ; la suite est décroissante.', go: ['e2', 'e3'] }];
  c.entraine = [{ id: 'e1', gen: 'c1e1', lc: 1 }, { id: 'e2', gen: 'c1e2', lc: 2 }, { id: 'e3', gen: 'c1e3', lc: 4 }];

  /* ---------- je résous ---------- */
  const a = n => 1200 * Math.pow(1.04, n);
  chk(rnd(a(1)) === 1248 && Math.round(a(6)) === 1518, 'c1 p1');
  chk(rnd(v(4)) === 313.2 && v(4) > 300 && v(5) < 300 && rnd(v(0) - v(1)) === 90 && rnd(v(1) - v(2)) === 76.5, 'c1 p2');
  const m = n => 80.5 * Math.pow(1.12, n); let SM = 0; for (let n = 0; n <= 6; n++) SM += m(n);
  const SR = FEVAD.reduce((s, x) => s + x[1], 0);
  chk(rnd(91.3 / 80.5, 3) === 1.134 && rnd(m(6)) === 158.89 && rnd(m(8)) === 199.32 && rnd(SM, 1) === 812.2 && rnd(SR, 1) === 815.8, 'c1 p3');
  c.probs = [
    PB({ id: 'p1', etape: 2, lc: 2, comps: ['app', 'rea'], titre: 'Les abonnés d’une lettre d’information',
      intro: `<p>Un site de vente de plantes (entreprise fictive) compte ${H('1 200 abonnés')} à sa lettre d’information en janvier. Chaque mois, il en gagne ${H('4 %')}. On note uₙ le nombre d’abonnés n mois après janvier.</p>`,
      qs: [Q('a.', 'Donne la raison q de la suite (uₙ).', '1 + 4 ÷ 100 = 1,04', 1.04, { w: 24, tol: .0006 }), Q('b.', 'Calcule u₁.', '1 200 × 1,04 = 1 248', 1248, { w: 24 }), Q('c.', 'Calcule u₆, arrondi à l’unité.', '1 200 × 1,04⁶ ≈ 1 518', 1518, { w: 24, tol: .4 }), Q('d.', 'Combien d’abonnés le site gagne-t-il entre janvier et juillet ?', '1 518 − 1 200 = 318', 318, { w: 24, tol: .4 })],
      err: { 0: [{ v: 4, m: 'La raison n’est pas le pourcentage : une hausse de 4 % revient à multiplier par 1,04.' }, { v: .04, m: 'Il faut ajouter 1 : q = 1 + 0,04.' }], 2: [{ v: 1488, m: 'Tu as ajouté 48 abonnés chaque mois, comme une suite arithmétique. Ici, on multiplie par 1,04.' }] },
      hints: ['Une hausse de 4 % : on multiplie par 1 + 4 ÷ 100.', 'u₆ = u₀ × q⁶ : utilise la touche puissance.', 'Juillet, c’est 6 mois après janvier.'], pouce: 'Hausse de 4 % : × 1,04. Puis uₙ = 1 200 × 1,04ⁿ avec n = 6.', corr: 'a. q = 1,04. b. u₁ = 1 248. c. u₆ = 1 200 × 1,04⁶ ≈ 1 518. d. 318 abonnés de plus.' }),
    PB({ id: 'p2', etape: 3, lc: 3, defi: 4, bulle: 'Ce cas se fait en 4 étapes. Pour trouver « au bout de combien d’années », calcule les termes un par un : un tableur ou une boucle Python le fait pour toi.', autravail: { comp: 'com', txt: 'annoncer à un client la valeur de reprise de son appareil, et lui expliquer la règle de décote.' }, comps: ['ana', 'rea', 'com'], titre: 'Reprendre un téléphone',
      intro: `<p>Un magasin reprend les téléphones d’occasion. Un modèle vendu ${H('600 €')} neuf perd ${H('15 % de sa valeur')} chaque année. Le magasin ne le reprend plus quand sa valeur passe ${H('sous 300 €')}. On note vₙ sa valeur au bout de n années.</p>`,
      qs: [Q('a.', 'Donne la raison de la suite (vₙ).', '1 − 0,15 = 0,85', .85, { w: 24, tol: .0006 }), Q('b.', 'Calcule v₄ au centime.', '600 × 0,85⁴ ≈ 313,20 €', 313.2, { w: 28 }), Q('c.', 'Au bout de combien d’années la valeur passe-t-elle sous 300 € ?', 'v₄ ≈ 313,20 € et v₅ ≈ 266,22 € : au bout de 5 ans', 5, { w: 24, tol: .01 }), Q('d.', 'Explique au client pourquoi la baisse en euros est de plus en plus petite.', 'On enlève toujours 15 %, mais d’une valeur plus petite : 90 € la 1re année, 76,50 € la 2e…', null, { lines: 2 })],
      outro: K.prog('chercher le rang', 'La boucle <code>while</code> continue tant que la valeur reste au moins égale à 300 €.', `v = 600\nn = 0\nwhile v >= 300:\n    v = v * 0.85\n    n = n + 1\nprint(n)`, ''),
      err: { 0: [{ v: .15, m: 'La raison n’est pas le pourcentage de baisse : on garde 85 % de la valeur, donc q = 0,85.' }, { v: -.15, m: 'La raison d’une suite géométrique est positive ici : q = 1 − 0,15.' }], 1: [{ v: 240, m: 'Tu as enlevé 15 % de 600 € quatre fois (90 € par an). Chaque année, on enlève 15 % de la valeur de l’année précédente.' }], 2: [{ v: 4, m: 'Au bout de 4 ans, la valeur est encore de 313,20 € : elle n’est pas sous 300 €.' }] },
      hints: ['Une baisse de 15 % : on multiplie par 1 − 0,15.', 'v₄ = 600 × q⁴.', 'Calcule v₄, puis v₅ : la première valeur sous 300 € donne la réponse.'], pouce: 'Baisse de 15 % : × 0,85. Calcule les valeurs année après année jusqu’à passer sous 300 €.', corr: 'a. q = 0,85. b. v₄ ≈ 313,20 €. c. v₅ ≈ 266,22 € < 300 : au bout de 5 ans (le programme affiche 5). d. On enlève 15 % d’une valeur qui diminue : 90 €, puis 76,50 €, puis 65,03 €…' }),
    PB({ id: 'p3', etape: 4, lc: 5, cls: 'bac', defi: 5, bulle: 'Voici une question de « vers le bac » : 5 étapes, avec des données réelles. Un modèle ne colle jamais exactement : on mesure l’écart. Une question ratée ne fait pas un exercice raté : continue.', autravail: { comp: 'val', txt: 'vérifier une prévision de chiffre d’affaires avant de la présenter en réunion.' }, comps: ['app', 'ana', 'rea', 'val'], titre: 'Le commerce en ligne en France',
      intro: `<p>Le tableau donne le chiffre d’affaires du commerce en ligne en France (produits et services), en milliards d’euros.</p>${tab(['Année', ...FEVAD.map(x => x[0])], [['Md€', ...FEVAD.map(x => fr(x[1]))]], 'dt-c')}<p class="srcl">Source : Fevad, « Chiffres clés du e-commerce 2024 » (données 2017 à 2023).</p>`,
      qs: [BQ('1', 'Calculer le quotient du chiffre d’affaires de 2018 par celui de 2017, au millième.', 'app', '91,3 ÷ 80,5 ≈ 1,134', 1.134, { w: 24, tol: .0006 }), BQ('2', 'On modélise par une suite géométrique (uₙ) : u₀ = 80,5 en 2017 et q = 1,12. Justifier ce choix de raison.', 'ana', 'Les quotients sont entre 1,08 et 1,15 : 1,12 est une valeur moyenne, soit environ + 12 % par an.', null, { lines: 2 }), BQ('3', 'Calculer u₆ (année 2023) au centième, et le comparer à la valeur réelle.', 'val', '80,5 × 1,12⁶ ≈ 158,89 Md€, contre 159,9 réels : environ 1 Md€ d’écart.', 158.89, { w: 28 }), BQ('4', 'Calculer u₈ (année 2025) au centième. La Fevad annonce 196,4 Md€ pour 2025 : comparer.', 'rea', '80,5 × 1,12⁸ ≈ 199,32 Md€ : environ 3 Md€ de plus que la réalité (1,5 %).', 199.32, { w: 28 }), BQ('5', 'Avec un tableur, calculer le total des ventes de 2017 à 2023 selon le modèle, au dixième.', 'rea', 'u₀ + … + u₆ ≈ 812,2 Md€ (réel : 815,8 Md€).', 812.2, { w: 28, tol: .06 })],
      err: { 0: [{ v: 10.8, m: 'Tu as calculé une différence. Le quotient se calcule par une division : 91,3 ÷ 80,5.' }], 2: [{ v: 1.12 * 6 * 80.5, m: 'u₆ = 80,5 × 1,12⁶ : l’exposant n’est pas un facteur.' }], 3: [{ v: rnd(80.5 * Math.pow(1.12, 7)), m: 'De 2017 à 2025, il y a 8 ans : l’exposant est 8.' }], 4: [{ v: rnd(m(6), 1), m: 'Tu as donné le dernier terme. Il faut additionner les 7 termes, de 2017 à 2023.' }] },
      hints: ['Un quotient : valeur de 2018 ÷ valeur de 2017.', 'Rang n : nombre d’années depuis 2017. 2023 → n = 6 ; 2025 → n = 8.', 'Au tableur : une colonne des termes, puis =SOMME.'], pouce: 'Rang n = année − 2017. Terme : 80,5 × 1,12ⁿ. Le total s’obtient en additionnant les 7 termes au tableur.', corr: '1. ≈ 1,134. 2. Quotients entre 1,08 et 1,15 : 1,12 est une moyenne. 3. u₆ ≈ 158,89 Md€ (réel 159,9). 4. u₈ ≈ 199,32 Md€, proche des 196,4 Md€ annoncés. 5. ≈ 812,2 Md€.' })];

  c.bilan = [['Je sais reconnaître une suite géométrique et donner sa raison.', ['e1', 'p1']], ['Je sais calculer le terme de rang n.', ['e2', 'p2']], ['Je sais justifier le sens de variation par la raison.', ['e1', 'p2']], ['Je sais additionner les premiers termes avec un outil numérique.', ['e3', 'p3']], ['Je sais relier une évolution à taux fixe et une fonction exponentielle.', ['p3']]];
  c.words = require('./glT')('c1');
  c.plusloin = { meca: [], probs: [] };
  return c;
};
