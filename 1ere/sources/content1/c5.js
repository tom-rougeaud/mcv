/* Chapitre 5 · Suites numériques — 1re Bac Pro. */
'use strict';
const K = require('./kit1');
const { rnd, H, FM, R, Q, BQ, PB, prog, rais, tab, S, T, Rc, Ln, Ar, Br, st, MCVP, bl } = K;
const { SK } = require('./sk1');
const RED = MCVP.RED, BLUE = MCVP.BLUE, GRN = MCVP.GRN, INK = MCVP.INK, ORG = MCVP.ORG;
const f2 = x => rnd(x, 2);
const fr2 = x => String(f2(x)).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

module.exports = function (chk) {
  const c = { id: 'c5', n: 5, col: 'algo', icone: '🪜', dom: 'Algèbre-analyse · suites numériques', titre: 'Suites numériques', sous: 'Prévoir mois après mois' };
  c.parties = [{ t: 'Notation et sens de variation', n: [1, 2] }, { t: 'Suites arithmétiques et sommes', n: [3, 4] }, { t: 'Pour aller plus loin : suites géométriques', n: [5, 6] }];
  c.travail = { question: `La box « Bougies du mois » compte ${H('120 abonnés')} au lancement et en gagne ${H('15 par mois')}. Combien d’abonnés au bout d’un an ? Et combien de box l’atelier aura-t-il envoyées en tout pendant ces 12 mois ? Une suite range ces nombres mois après mois ; leur somme répond à la seconde question.` };
  c.objectifs = ['Je saurai lire et calculer les termes d’une suite, avec la notation uₙ.', 'Je saurai étudier le sens de variation d’une suite.', 'Je saurai reconnaître et utiliser une suite arithmétique.', 'Je saurai calculer la somme des premiers termes d’une suite arithmétique.'];
  c.depart = 'c5';

  const u = n => 120 + 15 * n, v = n => 500 * Math.pow(1.1, n);
  chk(u(1) === 135 && u(4) === 180 && u(8) === 240 && u(10) === 270 && u(12) === 300, 'c5 fil rouge');

  // 1. générer une suite : boîtes et flèches +15
  const bx = (i, val, n) => Rc(26 + i * 112, 70, 92, 46, { c: i ? 'k2' : 'k', rx: 8 }) + T(72 + i * 112, 100, val, { fs: 17, c: i ? 'tx' : 'tw' }) + T(72 + i * 112, 60, n, { fs: 14, c: 'ts' });
  const arc = i => `<path d="M${84 + i * 112} 122 Q${128 + i * 112} 156 ${172 + i * 112} 122" fill="none" stroke="${GRN}" stroke-width="2.4"/><polygon points="${172 + i * 112},122 ${163 + i * 112},126 ${169 + i * 112},133" fill="${GRN}"/>` + T(128 + i * 112, 162, '+ 15', { fs: 14, fill: GRN, c: '' });
  const gen = S(600, 250, st(1, [0, 1, 2, 3, 4].map(i => bx(i, String(u(i)), `u${'₀₁₂₃₄'[i]}`)).join('') + T(300, 30, 'n : le rang (le mois) · uₙ : le terme (les abonnés)', { fs: 14, c: 'ts' }))
    + st(2, [0, 1, 2, 3].map(arc).join(''))
    + st(3, T(160, 214, 'de proche en proche : uₙ₊₁ = uₙ + 15', { fs: 15, c: 'kt' }) + T(460, 214, 'formule : uₙ = 120 + 15 n', { fs: 15, c: 'kt' }) + `<line x1="300" y1="196" x2="300" y2="226" stroke="${INK}" stroke-width="1.4"/>`),
  'Les termes 120, 135, 150, 165, 180 : on ajoute 15 à chaque mois');

  // 2. suite arithmétique : points alignés, marches
  const g2 = MCVP.plot({ W: 600, H: 290, x: [0, 8, 1], y: [100, 260, 20], ml: 52, mt: 18, mb: 34, xl: 'mois n', yl: 'abonnés uₙ', fine: true, lab: 'Suite arithmétique : uₙ = 120 + 15n' });
  let stairs = ''; for (let n = 0; n < 8; n++) stairs += g2.seg(n, u(n), n + 1, u(n), { stroke: '#545B7A', dash: '4 3', w: 1.6 }) + g2.seg(n + 1, u(n), n + 1, u(n + 1), { stroke: GRN, w: 2.6 });
  const ari = S(600, 290, st(1, g2.base + g2.pts([0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => [n, u(n)]), { r: 5.5, fill: BLUE }))
    + st(2, stairs + g2.txt(1, 142, '+ 15', { dx: 8, a: 'start', fill: GRN, cls: '', fs: 13 }) + g2.txt(.5, 112, '+ 1', { fs: 12, dy: 0 }))
    + st(3, g2.line(15, 120, { stroke: RED, w: 1.8, dash: '8 5' }) + g2.txt(0.2, 250, 'points alignés : même hausse chaque mois', { fs: 13, a: 'start' }))
    + st(4, g2.dot(8, 240, { r: 6.5, fill: '#FFC233' }) + g2.txt(8, 240, 'u₈ = 120 + 8 × 15 = 240', { dx: -14, dy: -12, a: 'end' })),
  'Les points de la suite arithmétique sont alignés ; chaque marche monte de 15');

  // 3. sens de variation : coût moyen cₙ = 4 + 6 ÷ n (n centaines de bougies)
  const cm = n => 4 + 6 / n;
  chk([1, 2, 3, 4, 5].map(n => rnd(cm(n), 2)).join() === '10,7,6,5.5,5.2' && cm(2) - cm(1) === -3, 'c5 sens de variation');
  const g3 = MCVP.plot({ W: 600, H: 290, x: [0, 6, 1], y: [0, 12, 2], ml: 52, mt: 22, mb: 34, xl: 'n (centaines)', yl: 'cₙ (€)', fine: true, lab: 'Coût moyen d’une bougie : cₙ = 4 + 6 ÷ n' });
  let downs = ''; for (let n = 1; n < 5; n++) downs += g3.seg(n, cm(n), n + 1, cm(n), { stroke: '#545B7A', dash: '4 3', w: 1.6 }) + g3.seg(n + 1, cm(n), n + 1, cm(n + 1), { stroke: RED, w: 2.8 }) + g3.txt(n + 1, (cm(n) + cm(n + 1)) / 2, '− ' + String(rnd(cm(n) - cm(n + 1), 2)).replace('.', ','), { dx: 8, dy: 4, a: 'start', fs: 12, fill: RED, cls: '' });
  const sens = S(600, 290, st(1, g3.base + g3.pts([1, 2, 3, 4, 5].map(n => [n, cm(n)]), { r: 5.5, fill: BLUE }) + g3.txt(1, cm(1), 'c₁ = 10', { dx: 12, dy: 4, a: 'start' }))
    + st(2, downs)
    + st(3, g3.txt(2.2, 11, 'chaque terme est plus petit que le précédent :', { a: 'start', fs: 13 }) + g3.txt(2.2, 10, 'cₙ₊₁ − cₙ < 0, la suite est décroissante', { a: 'start', fs: 13, fill: RED, cls: '' })),
  'Les points descendent : la différence entre deux termes consécutifs est toujours négative');

  // 4. somme des premiers termes : 12 mois de box, appariement premier + dernier
  const N = 12, us = [...Array(N).keys()].map(u), Ssum = us.reduce((a, b) => a + b, 0);
  chk(Ssum === 2430 && u(11) === 285 && u(0) + u(11) === 405 && N * 405 / 2 === 2430, 'c5 somme');
  const bw = 40, x0s = 60, base = 262, ks = 190 / 405;
  let bars = '', rev = '';
  us.forEach((v, i) => { bars += `<rect x="${x0s + i * bw + 3}" y="${(base - v * ks).toFixed(1)}" width="${bw - 6}" height="${(v * ks).toFixed(1)}" fill="${BLUE}" opacity=".85"/>`; const w = us[N - 1 - i]; rev += `<rect x="${x0s + i * bw + 3}" y="${(base - 405 * ks).toFixed(1)}" width="${bw - 6}" height="${(w * ks).toFixed(1)}" fill="${ORG}" opacity=".75"/>`; });
  const somme = S(600, 310, st(1, bars + `<line x1="${x0s}" y1="${base}" x2="${x0s + N * bw}" y2="${base}" stroke="${INK}" stroke-width="2"/>` + T(x0s + 3 + (bw - 6) / 2, base + 18, 'u₀', { fs: 12, c: 'ts' }) + T(x0s + 11 * bw + 3 + (bw - 6) / 2, base + 18, 'u₁₁', { fs: 12, c: 'ts' }) + T(300, 302, 'box envoyées chaque mois : 120, 135, …, 285', { fs: 13, c: 'ts' }))
    + st(2, rev + T(300, 26, 'la même liste, retournée, posée au-dessus', { fs: 13, c: 'ts' }))
    + st(3, `<rect x="${x0s}" y="${(base - 405 * ks).toFixed(1)}" width="${N * bw}" height="${(405 * ks).toFixed(1)}" fill="none" stroke="${RED}" stroke-width="3"/>` + T(x0s + N * bw + 6, (base - 202 * ks).toFixed(1), '405', { fs: 14, a: 'start', c: 'kt' }) + T(300, 50, '12 colonnes de 120 + 285 = 405 : 12 × 405 = 4 860 = deux fois la somme', { fs: 13, c: 'kt' })),
  'Deux escaliers identiques, l’un retourné, forment un rectangle : la somme vaut la moitié de 12 fois 405');

  // 3. suite géométrique : × 1,1, écarts qui grandissent
  const gG = MCVP.plot({ W: 600, H: 300, x: [0, 8, 1], y: [400, 1100, 100], ml: 56, mt: 18, mb: 34, xl: 'mois n', yl: 'abonnés vₙ', fine: true, lab: 'Suite géométrique : vₙ = 500 × 1,1ⁿ' });
  let gaps = ''; for (const n of [0, 3, 7]) gaps += gG.seg(n + 1, v(n), n + 1, v(n + 1), { stroke: GRN, w: 2.8 }) + gG.seg(n, v(n), n + 1, v(n), { stroke: '#545B7A', dash: '4 3', w: 1.6 }) + gG.txt(n + 1, (v(n) + v(n + 1)) / 2, '+ ' + fr2(v(n + 1) - v(n)), n === 7 ? { dx: -8, dy: 22, a: 'end', fs: 12, fill: GRN, cls: '' } : { dx: 8, dy: 4, a: 'start', fs: 12, fill: GRN, cls: '' });
  const geo = S(600, 300, st(1, gG.base + gG.pts([0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => [n, v(n)]), { r: 5.5, fill: ORG }))
    + st(2, gaps)
    + st(3, gG.seg(0, 500, 8, v(8), { stroke: RED, dash: '8 5', w: 1.8 }) + gG.txt(0.2, 1040, 'les points ne sont pas alignés :', { a: 'start', fs: 13 }) + gG.txt(0.2, 990, 'la hausse grandit à chaque mois', { a: 'start', fs: 13 }))
    + st(4, gG.dot(8, v(8), { r: 6.5, fill: '#FFC233' }) + gG.txt(0.2, 940, 'v₈ = 500 × 1,1⁸ ≈ 1 071,79', { a: 'start', fs: 13 })),
  'Les points de la suite géométrique ne sont pas alignés : les écarts passent de 50 à 66,55 puis 97,44');
  chk(f2(v(1) - v(0)) === 50 && f2(v(4) - v(3)) === 66.55 && f2(v(8) - v(7)) === 97.44, 'c5 écarts');

  // 4. comparer : intérêts simples (arithmétique) et composés (géométrique)
  const A = n => 1000 + 60 * n, Bc = n => 1000 * Math.pow(1.05, n);
  chk(A(8) === 1480 && f2(Bc(8)) === 1477.46 && A(9) === 1540 && f2(Bc(9)) === 1551.33 && f2(Bc(5)) === 1276.28 && f2(Bc(10)) === 1628.89, 'c5 comparaison');
  const gC = MCVP.plot({ W: 600, H: 300, x: [0, 12, 1], y: [900, 1900, 100], ml: 58, mt: 18, mb: 34, xl: 'années n', yl: 'capital (€)', fine: true, lab: 'Placement A : + 60 € par an ; placement B : + 5 % par an' });
  const N12 = [...Array(13).keys()];
  const comp = S(600, 300, st(1, gC.base + gC.pts(N12.map(n => [n, A(n)]), { r: 4.6, fill: BLUE }) + gC.txt(0.3, 1620, '● A : 1 000 + 60 n', { a: 'start', fill: BLUE, cls: '' }))
    + st(2, gC.pts(N12.map(n => [n, Bc(n)]), { r: 4.6, fill: ORG }) + gC.txt(0.3, 1550, '● B : 1 000 × 1,05ⁿ', { a: 'start', fill: ORG, cls: '' }))
    + st(3, gC.band(8.5, 12, { fill: '#FFC233', op: .2 }) + gC.dot(9, Bc(9), { r: 6.5, fill: '#FFC233' }) + gC.txt(9, Bc(9), 'B dépasse A à n = 9', { dx: -14, dy: 4, a: 'end' }))
    + st(4, gC.txt(0.3, 1800, 'avant 9 ans : A est meilleur', { a: 'start', fs: 13 }) + gC.txt(0.3, 1720, 'à partir de 9 ans : B est meilleur', { a: 'start', fs: 13 })),
  'Les points bleus (arithmétique) sont alignés ; les points orange (géométrique) les dépassent à partir de 9 ans');


  c.notions = [
    { titre: 'Notation indicielle et termes', decouvre: { txt: `La box compte ${H('120 abonnés')} au mois 0, puis ${H('15 de plus')} chaque mois. Écris la liste des abonnés des mois 0 à 4. Comment trouver directement le mois 10 ?`, img: SK.tableur() },
      comprends: `<p>Une <b>suite</b> est une liste de nombres numérotés : u₀, u₁, u₂… Le numéro n est le <b>rang</b> (ici, le mois). Le nombre uₙ est le <b>terme</b> de rang n : c’est la <b>notation indicielle</b>.</p><p>On peut calculer les termes de deux façons.</p><p><b>De proche en proche</b>, par une <b>relation de récurrence</b> : on calcule chaque terme à partir du précédent. Ici uₙ₊₁ = uₙ + 15 donne 120, 135, 150, 165…</p><p><b>Par une formule</b> uₙ = f(n) : on calcule directement uₙ à partir de n. Ici uₙ = 120 + 15 n, avec la fonction f(x) = 120 + 15 x. Donc u₁₀ = f(10) = 270.</p><p>Dans un tableur, la récurrence s’écrit dans B3 : <b>=B2+15</b>, puis on recopie vers le bas.</p>`,
      vois: gen, voisLeg: 'Les cases sont les termes ; les flèches vertes montrent qu’on ajoute 15 pour passer d’un mois au suivant.',
      retiens: `<p>Formule : ${FM(R`u_n=f(n)`)} · Récurrence : ${FM(R`u_{n+1}=u_n+15`)}</p><p>n : le rang · uₙ : le terme de rang n · u₀ : le premier terme.</p>`,
      exemple: `<p>u₃ = 120 + 15 × 3 = <b>165</b>.</p><p>u₁₀ = f(10) = <b>270</b>.</p>`,
      attention: 'uₙ₊₁ est le terme qui suit uₙ ; uₙ + 1 est uₙ augmenté de 1. Ce ne sont pas les mêmes nombres.', astuce: { k: 'vite', t: 'Pour un rang éloigné (u₁₀₀), utilise la formule : la récurrence demanderait 100 calculs.' } },
    { titre: 'Le sens de variation d’une suite', decouvre: { txt: `Quand Mia fabrique n centaines de bougies, le coût moyen d’une bougie est ${H('cₙ = 4 + 6 ÷ n')} euros. Ce coût monte-t-il ou descend-il quand n augmente ?`, img: SK.escalier() },
      comprends: `<p>Une suite est <b>croissante</b> si chaque terme est plus grand que le précédent : uₙ₊₁ ≥ uₙ. Elle est <b>décroissante</b> si chaque terme est plus petit : uₙ₊₁ ≤ uₙ.</p><p>Pour le savoir, on étudie le signe de la différence uₙ₊₁ − uₙ. Si elle est toujours positive, la suite est croissante. Si elle est toujours négative, la suite est décroissante.</p><p>Pour le coût moyen : c₁ = 10, c₂ = 7, c₃ = 6, c₄ = 5,50. Les différences valent − 3, − 1 et − 0,50. Elles sont toutes négatives : la suite est décroissante.</p><p>Une suite peut aussi monter puis descendre : elle n’est alors ni croissante ni décroissante.</p>`,
      vois: sens, voisLeg: 'Chaque marche rouge descend : la différence entre deux termes consécutifs est négative.',
      retiens: `<p>${FM(R`u_{n+1}-u_n\ge 0`)} pour tout n : suite <b>croissante</b>.</p><p>${FM(R`u_{n+1}-u_n\le 0`)} pour tout n : suite <b>décroissante</b>.</p>`,
      exemple: `<p>c₂ − c₁ = 7 − 10 = <b>− 3</b>.</p><p>Toutes les différences sont négatives : (cₙ) est <b>décroissante</b>.</p>`,
      wide: K.rais('« pour tout n »', `<p>« La suite est croissante » veut dire : uₙ₊₁ ≥ uₙ <b>pour tout</b> rang n, pas seulement pour les premiers. Calculer trois termes permet de <b>conjecturer</b> le sens de variation ; pour l’affirmer, il faut un argument valable pour tous les n, comme le signe de la raison d’une suite arithmétique.</p>`),
      attention: 'Calcule toujours « terme suivant moins terme précédent », dans cet ordre : sinon le signe s’inverse.', astuce: { k: 'verif', t: 'Place les points (n ; uₙ) : s’ils montent de gauche à droite, la suite est croissante.' } },
    { titre: 'Les suites arithmétiques', decouvre: { txt: `Les abonnés augmentent toujours de ${H('15')} chaque mois. Que remarques-tu quand tu places les points (n ; uₙ) dans un repère ?`, img: SK.escalier() },
      comprends: `<p>Une suite est <b>arithmétique</b> quand on passe d’un terme au suivant en <b>ajoutant toujours le même nombre r</b>. Ce nombre s’appelle la <b>raison</b> : uₙ₊₁ = uₙ + r.</p><p>Le terme de rang n est uₙ = u₀ + n × r. En effet, depuis u₀, on a ajouté n fois la raison.</p><p>C’est la fonction affine f(x) = u₀ + r x prise aux nombres entiers : les points (n ; uₙ) sont <b>alignés</b> sur sa droite. La raison r est le coefficient directeur.</p><p>Le sens de variation se lit sur la raison : r positive, suite croissante ; r négative, suite décroissante. Pour les abonnés, r = 15 : la suite est croissante.</p>`,
      vois: ari, voisLeg: 'Chaque marche avance de 1 mois et monte de 15 abonnés : les points sont sur la droite y = 120 + 15 x.',
      retiens: `<p>${FM(R`u_{n+1}=u_n+r \qquad u_n=u_0+n\times r`)}</p><p>Raison : ${FM(R`r=u_{n+1}-u_n`)}. r &gt; 0 : croissante ; r &lt; 0 : décroissante.</p>`,
      exemple: `<p>u₀ = 120, r = 15 : u₈ = 120 + 8 × 15 = <b>240</b>.</p><p>Stock 480, r = − 35 : u₄ = 480 − 140 = <b>340</b>.</p>`,
      wide: K.rais('vérifier tous les écarts', `<p>La suite 2 ; 4 ; 8 est-elle arithmétique ? On a 4 − 2 = 2, mais 8 − 4 = 4. Les écarts ne sont pas tous égaux : <b>non</b>. Pour dire qu’une suite est arithmétique, il faut que <b>tous</b> les écarts soient égaux ; pour dire qu’elle ne l’est pas, un seul écart différent suffit.</p>`),
      attention: 'Le terme de rang n est u₀ + n × r : on multiplie n par r, on ne les additionne pas.', astuce: { k: 'verif', t: 'Contrôle u₁ avec la formule : 120 + 1 × 15 = 135, c’est bien le 2ᵉ terme.' } },
    { titre: 'La somme des premiers termes', decouvre: { txt: `La box envoie ${H('120 colis')} le mois 0, puis ${H('15 de plus')} chaque mois. Combien de colis en tout pendant ${H('12 mois')} ?`, img: SK.pile() },
      comprends: `<p>On cherche S = u₀ + u₁ + … + u₁₁ : la <b>somme des 12 premiers termes</b>.</p><p>Avec un <b>tableur</b>, on écrit les termes dans une colonne, puis <b>=SOMME(B2:B13)</b>. Avec Python, une boucle ajoute les termes un par un.</p><p>Pour une suite arithmétique, il existe aussi une astuce. On écrit la liste à l’endroit, puis à l’envers. Le premier et le dernier font 120 + 285 = 405 ; le deuxième et l’avant-dernier aussi, et ainsi de suite. Douze colonnes de 405 font 4 860, soit deux fois la somme. Donc S = 2 430 colis.</p><p>La formule n’est pas à connaître : retiens la méthode.</p>`,
      vois: somme, voisLeg: 'L’escalier bleu et le même escalier retourné (orange) forment un rectangle de 12 colonnes de 405.',
      retiens: `<p>Somme des premiers termes : on les additionne (tableur, Python, ou à la main).</p><p>Astuce pour une suite arithmétique : ${FM(R`S=\dfrac{\text{nombre de termes}\times(\text{premier}+\text{dernier})}{2}`)}</p>`,
      exemple: `<p>12 termes, premier 120, dernier 285.</p><p>S = 12 × 405 ÷ 2 = <b>2 430</b>.</p>`,
      wide: K.prog('additionner les termes', 'La variable <code>total</code> part de 0 ; la boucle lui ajoute chaque terme, puis passe au terme suivant.', `u = 120\ntotal = 0\nfor n in range(12):\n    total = total + u\n    u = u + 15\nprint(total)   # affiche 2430`, `<p class="prog-q">Quelle ligne calcule le terme suivant ? ${bl(30, 'u = u + 15')} Que faut-il changer pour 24 mois ? ${bl(30, 'range(24)')}</p>`),
      attention: 'Compte bien les termes : de u₀ à u₁₁, il y en a 12, pas 11.', astuce: { k: 'og', t: 'Ordre de grandeur : la somme vaut à peu près le nombre de termes × le terme du milieu (environ 200), soit 12 × 200 = 2 400.' } },
    { titre: 'Les suites géométriques', hp: 'terminale', decouvre: { txt: `Un compte compte ${H('500 abonnés')} et en gagne ${H('10 %')} chaque mois. Les hausses sont-elles toujours les mêmes ? Que deviennent les points dans un repère ?`, img: SK.expo() },
      comprends: `<p>Augmenter de 10 %, c’est multiplier par 1 + 10 ÷ 100 = <b>1,1</b>. Une suite est <b>géométrique</b> quand on passe d’un terme au suivant en <b>multipliant toujours par le même nombre q</b>, appelé la <b>raison</b> : vₙ₊₁ = vₙ × q.</p><p>Son terme général est vₙ = v₀ × qⁿ : depuis v₀, on a multiplié n fois par q.</p><p>Pour v₀ = 500 et q = 1,1 : v₁ = 550, v₂ = 605, v₃ = 665,50. Les hausses grandissent (+ 50, + 55, + 60,50…) : les points ne sont <b>pas alignés</b>.</p><p>Si q est plus grand que 1, la suite (positive) est croissante ; si q est entre 0 et 1, elle est décroissante. Une baisse de 20 % correspond à q = 0,8.</p>`,
      vois: geo, voisLeg: 'Les écarts verts grandissent : + 50 au début, + 97,44 à la fin. Les points restent au-dessus du segment rouge tracé entre le premier et le dernier.',
      retiens: `<p>${FM(R`v_{n+1}=v_n\times q \qquad v_n=v_0\times q^n`)}</p><p>Raison : ${FM(R`q=\dfrac{v_{n+1}}{v_n}`)} (un quotient). Hausse de t % : ${FM(R`q=1+\dfrac{t}{100}`)}</p>`,
      exemple: `<p>v₃ = 500 × 1,1³ = <b>665,50</b>.</p><p>Baisse de 20 % : q = <b>0,8</b>.</p>`,
      attention: 'Une hausse de 10 % donne q = 1,1, pas q = 10 ni q = 0,1.', astuce: { k: 'og', t: 'Ordre de grandeur : avec + 10 % par mois, le nombre double en un peu plus de 7 mois.' } },
    { titre: 'Choisir le bon modèle', hp: 'terminale', decouvre: { txt: `On place ${H('1 000 €')}. Placement A : ${H('+ 60 € par an')}. Placement B : ${H('+ 5 % par an')}, intérêts compris. Lequel rapporte le plus ? Cela dépend-il de la durée ?`, img: SK.deuxSuites() },
      comprends: `<p>Une hausse d’un <b>même montant</b> donne une suite arithmétique. Une hausse d’un <b>même pourcentage</b> donne une suite géométrique.</p><p>Placement A (intérêts simples, chapitre 1) : Aₙ = 1 000 + 60 n. Placement B (<b>intérêts composés</b> : les intérêts produisent à leur tour des intérêts) : Bₙ = 1 000 × 1,05ⁿ.</p><p>La première année, A rapporte 60 € et B 50 €. Mais les intérêts de B augmentent chaque année. On calcule de proche en proche : au bout de 8 ans, A vaut 1 480 € et B ≈ 1 477,46 € ; au bout de 9 ans, A vaut 1 540 € et B ≈ 1 551,33 €.</p><p>Sur une longue durée, une suite géométrique de raison plus grande que 1 finit toujours par dépasser une suite arithmétique.</p>`,
      vois: comp, voisLeg: 'Bleu : placement A, points alignés. Orange : placement B, qui part plus bas mais dépasse A à partir de 9 ans.',
      retiens: `<p>Même <b>montant</b> ajouté : arithmétique. Même <b>pourcentage</b> : géométrique.</p><p>${FM(R`A_n=1000+60n \qquad B_n=1000\times1{,}05^n`)}</p>`,
      exemple: `<p>A₉ = 1 000 + 540 = <b>1 540 €</b>.</p><p>B₉ = 1 000 × 1,05⁹ ≈ <b>1 551,33 €</b>.</p>`,
      wide: K.prog('trouver quand B dépasse A', 'La boucle calcule les deux placements année après année, tant que B ne dépasse pas A.', `a = 1000\nb = 1000\nn = 0\nwhile b <= a:\n    n = n + 1\n    a = a + 60\n    b = b * 1.05\nprint(n)    # affiche 9`, `<p class="prog-q">Quelle ligne fait de A une suite arithmétique ? ${bl(30, 'a = a + 60')} Et de B une suite géométrique ? ${bl(30, 'b = b * 1.05')}</p>`),
      attention: 'Ne conclus pas trop vite : A est meilleur les premières années, B à partir de 9 ans. La réponse dépend de la durée.', astuce: { k: 'sens', t: 'Dans un énoncé, « de … € » annonce une suite arithmétique, « de … % » une suite géométrique.' } }];

  c.mots = [['suite', 'liste de nombres numérotés u₀, u₁, u₂…', 'Le nombre d’abonnés forme une suite.'], ['rang', 'numéro n d’un terme', 'Le terme de rang 3 est u₃.'], ['terme', 'nombre uₙ de la suite', 'Le terme u₃ vaut 165.'], ['récurrence', 'calcul d’un terme à partir du précédent', 'Par récurrence, uₙ₊₁ = uₙ + 15.'], ['formule uₙ = f(n)', 'calcul direct d’un terme à partir de son rang', 'Avec uₙ = 120 + 15n, on obtient u₁₀ = 270.'], ['sens de variation', 'la suite monte (croissante) ou descend (décroissante)', 'La suite des coûts moyens est décroissante.'], ['suite arithmétique', 'on ajoute toujours la même raison r', 'Le nombre d’abonnés suit une suite arithmétique.'], ['raison', 'nombre r ajouté à chaque étape', 'La raison de la suite est 15.'], ['somme des termes', 'total des premiers termes d’une suite', 'La somme des 12 premiers termes est 2 430.']];

  /* ---------- exercices résolus ---------- */
  const w = n => 20 + 5 * n;
  chk(u(10) === 270 && (300 - 120) / 15 === 12 && w(9) === 65 && w(0) + w(9) === 85 && [...Array(10).keys()].reduce((a, n) => a + w(n), 0) === 425, 'c5 résolus');
  c.resolus = [
    { titre: 'Une suite arithmétique : prévoir les abonnés', outil: '🧮 calculatrice', enonce: `La box a ${H('120 abonnés')} au mois 0 et en gagne ${H('15 par mois')}. Calcule u₁, écris le terme de rang n, calcule u₁₀, donne le sens de variation puis trouve le mois où la box atteint 300 abonnés.`,
      rows: [['u₁ = 120 + 15 = <b class="nw">135</b>', 'J’ajoute la raison r = 15.'], ['uₙ = <b class="nw">120 + 15 n</b> ; u₁₀ = <b class="nw">270</b>', 'Suite arithmétique : u₀ + n × r.'], ['r = 15 &gt; 0 : suite <b class="nw">croissante</b>', 'Le signe de la raison donne le sens.'], ['120 + 15 n = 300 ⇔ 15 n = 180 ⇔ <b class="nw">n = 12</b>', 'Je résous une équation du premier degré.']], verif: 'u₁₂ = 120 + 180 = 300 ✓.', rep: 'u₁₀ = 270 abonnés ; la suite est croissante ; la box atteint 300 abonnés au mois 12.', go: ['e1', 'e2'] },
    { titre: 'À toi : une somme de versements', outil: '🧮 calculatrice', enonce: `Mia met de côté ${H('20 €')} le premier mois, puis ${H('5 € de plus')} chaque mois : 20, 25, 30… (u₀ = 20). Combien a-t-elle mis de côté en ${H('10 mois')} ?`, trous: [0, 1, 2, 3],
      rows: [['Dernier versement : u₉ = 20 + 9 × 5 = ⟦65⟧ €', 'Dix termes : de u₀ à u₉.'], ['Premier + dernier : 20 + 65 = ⟦85⟧ €', 'Chaque paire vaut 85.'], ['S = 10 × 85 ÷ 2 = ⟦425⟧ €', 'Astuce de la somme.'], ['r = 5 &gt; 0 : la suite est ⟦croissante⟧', 'Sens de variation.']], verif: '20 + 25 + 30 + 35 + 40 + 45 + 50 + 55 + 60 + 65 = 425 ✓.', rep: 'Mia a mis 425 € de côté en 10 mois.', go: ['e3'] }];
  c.entraine = [{ id: 'e1', gen: 'c5e1', lc: 3 }, { id: 'e2', gen: 'c5e2', lc: 2 }, { id: 'e3', gen: 'c5e3', lc: 4 }];

  /* ---------- je résous ---------- */
  const s = n => 480 - 35 * n;
  chk(s(1) === 445 && s(4) === 340 && s(10) === 130 && s(11) === 95, 'c5 p1');
  const vis = n => -n * n + 10 * n + 100;
  chk(vis(1) === 109 && vis(4) === 124 && vis(5) - vis(4) === 1 && vis(6) < vis(5) && vis(5) > vis(4), 'c5 p2');
  const loy = n => 400 + 15 * (n - 1);
  chk(loy(12) === 565 && [...Array(12).keys()].reduce((a, k) => a + loy(k + 1), 0) === 5790 && 12 * 480 === 5760, 'c5 p3');
  c.probs = [
    PB({ id: 'p1', etape: 2, lc: 3, comps: ['app', 'rea'], titre: 'Le stock de cartons', intro: `<p>La boutique a un stock de ${H('480 cartons')} d’expédition. Elle en utilise ${H('35 par semaine')}. On note uₙ le stock au bout de n semaines (u₀ = 480).</p>`,
      qs: [Q('a.', 'Calcule u₁.', '480 − 35 = 445', 445, { w: 24 }), Q('b.', 'Donne la raison r de cette suite arithmétique.', 'r = − 35 : la suite est décroissante', -35, { w: 24 }), Q('c.', 'Calcule u₄ avec le terme de rang n.', '480 + 4 × (− 35) = 340', 340, { w: 24 }), Q('d.', 'Au bout de combien de semaines le stock passe-t-il sous 100 cartons ?', 'u₁₀ = 130 ; u₁₁ = 95 : au bout de 11 semaines', 11, { w: 24 })],
      err: { 1: [{ v: 35, m: 'Le stock diminue : la raison est négative.' }], 2: [{ v: 620, m: 'Le stock baisse : on enlève 35 à chaque semaine.' }], 3: [{ v: 10, m: 'u₁₀ = 130 : il reste encore plus de 100 cartons.' }] },
      hints: ['Chaque semaine, on enlève 35 cartons.', 'uₙ = 480 − 35 n.', 'Calcule u₁₀ et u₁₁ et compare à 100.'], pouce: 'Le stock baisse de 35 par semaine : la raison vaut − 35.', corr: 'a. 445. b. − 35 (suite décroissante). c. 340. d. 11 semaines (u₁₁ = 95).' }),
    PB({ id: 'p2', etape: 3, lc: 2, defi: 4, bulle: 'Ce cas se fait en 4 étapes. Calcule plusieurs termes, puis regarde le signe des différences.', autravail: { comp: 'ana', txt: 'repérer le jour où la fréquentation d’un salon commence à baisser pour adapter le nombre de vendeurs.' }, comps: ['ana', 'rea', 'val'], titre: 'La fréquentation d’un salon',
      intro: `<p>Un salon dure 10 jours. Le nombre de visiteurs le jour n (en dizaines) est ${H('vₙ = − n² + 10 n + 100')}.</p>`,
      qs: [Q('a.', 'Calcule v₁.', '− 1 + 10 + 100 = 109', 109, { w: 24 }), Q('b.', 'Calcule v₄.', '− 16 + 40 + 100 = 124', 124, { w: 24 }), Q('c.', 'Calcule v₅ − v₄.', '125 − 124 = 1', 1, { w: 24 }), Q('d.', 'Pour quel n a-t-on, pour la première fois, vₙ₊₁ < vₙ ?', 'v₅ = 125 et v₆ = 124 : n = 5', 5, { w: 24 })],
      err: { 0: [{ v: 111, m: '− n² vaut − 1 pour n = 1 : le carré se calcule avant le signe moins.' }], 2: [{ v: -1, m: 'Fais « terme suivant moins terme précédent » : v₅ − v₄.' }], 3: [{ v: 6, m: 'On cherche n tel que vₙ₊₁ < vₙ : ici n = 5 (v₆ < v₅).' }] },
      hints: ['Remplace n par 1, puis par 4.', 'Calcule v₅, puis v₅ − v₄.', 'Calcule v₆ et compare-le à v₅.'], pouce: 'La suite n’est pas arithmétique : les écarts valent 9, 7, 5, 3, 1, puis − 1.', corr: 'a. 109. b. 124. c. 1. d. n = 5 : la fréquentation monte jusqu’au jour 5, puis baisse ; la suite n’est ni croissante ni décroissante.' }),
    PB({ id: 'p3', etape: 4, lc: 4, cls: 'bac', defi: 5, bulle: 'Voici une question de « vers le bac » : 5 étapes. Le contrat A commence moins cher, mais il faut additionner les 12 loyers avant de conclure.', autravail: { comp: 'com', txt: 'comparer deux contrats de location sur une année et conseiller sa responsable.' }, comps: ['rea', 'ana', 'com'], titre: 'Louer une vitrine',
      intro: `<p>Pour louer une vitrine, contrat A : ${H('400 € le 1er mois')}, puis ${H('15 € de plus chaque mois')}. Contrat B : ${H('480 € par mois')}. On note uₙ le loyer A du mois n (u₁ = 400).</p>`,
      qs: [BQ('1', 'Donner la raison de la suite (uₙ) et son sens de variation.', 'ana', 'r = 15 &gt; 0 : suite croissante', 15, { w: 24 }), BQ('2', 'Calculer le loyer A du 12ᵉ mois, u₁₂.', 'rea', '400 + 11 × 15 = 565 €', 565, { w: 24 }), BQ('3', 'Calculer le total des 12 loyers du contrat A.', 'rea', '12 × (400 + 565) ÷ 2 = 5 790 €', 5790, { w: 24 }), BQ('4', 'Calculer le total des 12 loyers du contrat B.', 'rea', '12 × 480 = 5 760 €', 5760, { w: 24 }), BQ('5', 'Justifier : quel contrat conseiller pour un an ?', 'com', 'Le contrat B : 5 760 € contre 5 790 €, même si A est moins cher les premiers mois.', null, { lines: 3 })],
      err: { 1: [{ v: 580, m: 'Du mois 1 au mois 12, on ajoute la raison 11 fois, pas 12.' }], 2: [{ v: 5880, m: 'Le dernier loyer est u₁₂ = 565 € : 12 × (400 + 565) ÷ 2.' }] },
      hints: ['La raison est ce qu’on ajoute chaque mois.', 'u₁₂ = u₁ + 11 × 15.', 'Somme = nombre de termes × (premier + dernier) ÷ 2.'], pouce: 'Du 1er au 12ᵉ mois, il y a 11 hausses de 15 €.', corr: '1. r = 15, croissante. 2. 565 €. 3. 5 790 €. 4. 5 760 €. 5. Le contrat B est moins cher sur un an (30 € d’écart).' })];

  c.bilan = [['Je sais calculer les termes d’une suite.', ['e1', 'p1']], ['Je sais étudier le sens de variation d’une suite.', ['e2', 'p2']], ['Je sais reconnaître et utiliser une suite arithmétique.', ['e1', 'p1']], ['Je sais calculer la somme des premiers termes d’une suite arithmétique.', ['e3', 'p3']]];
  c.words = require('./gl1')('c5');
  /* pour aller plus loin (appli) : suites géométriques et intérêts composés, au programme de terminale */
  c.plusTr = [{ id: 'g1', gen: 'c5g1', lc: 5 }, { id: 'g2', gen: 'c5g2', lc: 6 }];
  c.plusNote = 'suites géométriques, au programme de terminale';
  c.plusloin = { meca: [], probs: [
PB({ id: 'x1', etape: 3, lc: 3, defi: 4, bulle: 'Ce cas se fait en 4 étapes. Transforme d’abord le pourcentage en multiplicateur.', autravail: { comp: 'ana', txt: 'prévoir le nombre d’abonnés d’un compte de réseau social professionnel.' }, comps: ['ana', 'rea', 'val'], titre: 'Les abonnés du compte de la boutique',
      intro: `<p>Le compte de la boutique compte ${H('2 500 abonnés')} et gagne ${H('8 % d’abonnés par mois')}. On note vₙ le nombre d’abonnés au bout de n mois.</p>`,
      qs: [Q('a.', 'Donne la raison q de cette suite géométrique.', '1 + 8 ÷ 100 = 1,08', 1.08, { w: 24, tol: .0006 }), Q('b.', 'Calcule v₁.', '2 500 × 1,08 = 2 700', 2700, { w: 24 }), Q('c.', 'Calcule v₂.', '2 700 × 1,08 = 2 916', 2916, { w: 24 }), Q('d.', 'Calcule v₆, arrondi à l’unité.', '2 500 × 1,08⁶ ≈ 3 967', 3967, { w: 24, tol: .6 })],
      err: { 0: [{ v: 8, m: 'Une hausse de 8 % multiplie par 1,08.' }, { v: .08, m: 'Multiplier par 0,08 donnerait les 8 % seulement. Ajoute 1 : q = 1,08.' }], 2: [{ v: 2900, m: 'Tu as ajouté 200 comme le premier mois. La hausse est de 8 % du nouveau nombre.' }], 3: [{ v: 3700, m: 'Tu as ajouté 200 par mois (suite arithmétique). Ici on multiplie par 1,08.' }] },
      hints: ['+ 8 % : on multiplie par 1 + 0,08.', 'v₂ = v₁ × q.', 'v₆ = 2 500 × 1,08 puissance 6 (touche ^ ou xʸ).'], pouce: 'q = 1,08. Sur la calculatrice : 2500 × 1,08 ^ 6.', corr: 'a. 1,08. b. 2 700. c. 2 916. d. ≈ 3 967 abonnés.' }),
    PB({ id: 'x2', etape: 4, lc: 4, cls: 'bac', defi: 5, bulle: 'Voici une question de « vers le bac » : 5 étapes. Un placement est arithmétique, l’autre géométrique : calcule les deux avant de conclure.', autravail: { comp: 'com', txt: 'conseiller un client sur un placement selon la durée prévue.' }, comps: ['rea', 'ana', 'com'], titre: 'Conseiller un placement',
      intro: `<p>Un client place ${H('1 000 €')}. Placement A : ${H('+ 60 € par an')} (intérêts simples). Placement B : ${H('+ 5 % par an')} (intérêts composés).</p>`,
      qs: [BQ('1', 'Calculer la valeur du placement A au bout de 5 ans.', 'rea', '1 000 + 5 × 60 = 1 300 €', 1300, { w: 26 }), BQ('2', 'Calculer la valeur du placement B au bout de 5 ans, au centime.', 'rea', '1 000 × 1,05⁵ ≈ 1 276,28 €', 1276.28, { w: 26 }), BQ('3', 'Donner la raison de la suite géométrique du placement B.', 'ana', 'q = 1,05', 1.05, { w: 26, tol: .0006 }), BQ('4', 'Calculer la valeur du placement B au bout de 10 ans, au centime.', 'rea', '1 000 × 1,05¹⁰ ≈ 1 628,89 €', 1628.89, { w: 26 }), BQ('5', 'Justifier : quel placement conseiller pour 5 ans ? Pour 10 ans ?', 'com', 'Pour 5 ans, A (1 300 € > 1 276,28 €). Pour 10 ans, B (1 628,89 € > 1 600 €).', null, { lines: 3 })],
      err: { 1: [{ v: 1250, m: 'Tu as ajouté 50 € par an : c’est un calcul arithmétique. Pour B, multiplie par 1,05 chaque année.' }], 2: [{ v: 5, m: 'Une hausse de 5 % multiplie par 1,05.' }], 3: [{ v: 1500, m: 'Tu as ajouté 50 € par an. Pour B, utilise 1 000 × 1,05¹⁰.' }] },
      hints: ['A : 1 000 + n × 60.', 'B : 1 000 × 1,05 puissance n.', 'Compare les deux valeurs pour chaque durée.'], pouce: 'Le placement B part moins vite, mais ses intérêts grandissent chaque année.', corr: '1. 1 300 €. 2. 1 276,28 €. 3. 1,05. 4. 1 628,89 €. 5. A pour 5 ans, B pour 10 ans.' })
  ] };
  return c;
};
