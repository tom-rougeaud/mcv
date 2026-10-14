/* Chapitre 5 · Suites numériques — 1re Bac Pro. */
'use strict';
const K = require('./kit1');
const { rnd, H, FM, R, Q, BQ, PB, prog, rais, tab, S, T, Rc, Ln, Ar, Br, st, MCVP, bl } = K;
const { SK } = require('./sk1');
const RED = MCVP.RED, BLUE = MCVP.BLUE, GRN = MCVP.GRN, INK = MCVP.INK, ORG = MCVP.ORG;
const f2 = x => rnd(x, 2);
const fr2 = x => String(f2(x)).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

module.exports = function (chk) {
  const c = { id: 'c5', n: 5, col: 'algo', icone: '🪜', dom: 'Algèbre-analyse · suites numériques', titre: 'Suites : prévoir mois après mois' };
  c.travail = { question: `La box « Bougies du mois » compte ${H('120 abonnés')} au lancement et en gagne ${H('15 par mois')}. Un compte de réseau social, lui, gagne ${H('10 % d’abonnés par mois')}. Combien d’abonnés dans un an pour chacun ? Ajouter la même quantité ou multiplier par le même nombre, ça ne grandit pas pareil.` };
  c.objectifs = ['Je saurai calculer les termes d’une suite, par une formule ou de proche en proche.', 'Je saurai reconnaître et utiliser une suite arithmétique.', 'Je saurai reconnaître et utiliser une suite géométrique.', 'Je saurai choisir le bon modèle et comparer deux évolutions.'];
  c.depart = 'c5';

  const u = n => 120 + 15 * n, v = n => 500 * Math.pow(1.1, n);
  chk(u(1) === 135 && u(4) === 180 && u(8) === 240 && u(10) === 270 && u(12) === 300 && f2(v(1)) === 550 && f2(v(2)) === 605 && f2(v(3)) === 665.5 && f2(v(8)) === 1071.79, 'c5 fil rouge');

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

  // 3. suite géométrique : × 1,1, écarts qui grandissent
  const g3 = MCVP.plot({ W: 600, H: 300, x: [0, 8, 1], y: [400, 1100, 100], ml: 56, mt: 18, mb: 34, xl: 'mois n', yl: 'abonnés vₙ', fine: true, lab: 'Suite géométrique : vₙ = 500 × 1,1ⁿ' });
  let gaps = ''; for (const n of [0, 3, 7]) gaps += g3.seg(n + 1, v(n), n + 1, v(n + 1), { stroke: GRN, w: 2.8 }) + g3.seg(n, v(n), n + 1, v(n), { stroke: '#545B7A', dash: '4 3', w: 1.6 }) + g3.txt(n + 1, (v(n) + v(n + 1)) / 2, '+ ' + fr2(v(n + 1) - v(n)), n === 7 ? { dx: -8, dy: 22, a: 'end', fs: 12, fill: GRN, cls: '' } : { dx: 8, dy: 4, a: 'start', fs: 12, fill: GRN, cls: '' });
  const geo = S(600, 300, st(1, g3.base + g3.pts([0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => [n, v(n)]), { r: 5.5, fill: ORG }))
    + st(2, gaps)
    + st(3, g3.seg(0, 500, 8, v(8), { stroke: RED, dash: '8 5', w: 1.8 }) + g3.txt(0.2, 1040, 'les points ne sont pas alignés :', { a: 'start', fs: 13 }) + g3.txt(0.2, 990, 'la hausse grandit à chaque mois', { a: 'start', fs: 13 }))
    + st(4, g3.dot(8, v(8), { r: 6.5, fill: '#FFC233' }) + g3.txt(0.2, 940, 'v₈ = 500 × 1,1⁸ ≈ 1 071,79', { a: 'start', fs: 13 })),
  'Les points de la suite géométrique ne sont pas alignés : les écarts passent de 50 à 66,55 puis 97,44');
  chk(f2(v(1) - v(0)) === 50 && f2(v(4) - v(3)) === 66.55 && f2(v(8) - v(7)) === 97.44, 'c5 écarts');

  // 4. comparer : intérêts simples (arithmétique) et composés (géométrique)
  const A = n => 1000 + 60 * n, Bc = n => 1000 * Math.pow(1.05, n);
  chk(A(8) === 1480 && f2(Bc(8)) === 1477.46 && A(9) === 1540 && f2(Bc(9)) === 1551.33 && f2(Bc(5)) === 1276.28 && f2(Bc(10)) === 1628.89, 'c5 comparaison');
  const g4 = MCVP.plot({ W: 600, H: 300, x: [0, 12, 1], y: [900, 1900, 100], ml: 58, mt: 18, mb: 34, xl: 'années n', yl: 'capital (€)', fine: true, lab: 'Placement A : + 60 € par an ; placement B : + 5 % par an' });
  const N12 = [...Array(13).keys()];
  const comp = S(600, 300, st(1, g4.base + g4.pts(N12.map(n => [n, A(n)]), { r: 4.6, fill: BLUE }) + g4.txt(0.3, 1620, '● A : 1 000 + 60 n', { a: 'start', fill: BLUE, cls: '' }))
    + st(2, g4.pts(N12.map(n => [n, Bc(n)]), { r: 4.6, fill: ORG }) + g4.txt(0.3, 1550, '● B : 1 000 × 1,05ⁿ', { a: 'start', fill: ORG, cls: '' }))
    + st(3, g4.band(8.5, 12, { fill: '#FFC233', op: .2 }) + g4.dot(9, Bc(9), { r: 6.5, fill: '#FFC233' }) + g4.txt(9, Bc(9), 'B dépasse A à n = 9', { dx: -14, dy: 4, a: 'end' }))
    + st(4, g4.txt(0.3, 1800, 'avant 9 ans : A est meilleur', { a: 'start', fs: 13 }) + g4.txt(0.3, 1720, 'à partir de 9 ans : B est meilleur', { a: 'start', fs: 13 })),
  'Les points bleus (arithmétique) sont alignés ; les points orange (géométrique) les dépassent à partir de 9 ans');

  c.notions = [
    { titre: 'Générer une suite', decouvre: { txt: `La box compte ${H('120 abonnés')} au mois 0, puis ${H('15 de plus')} chaque mois. Écris la liste des abonnés des mois 0 à 4. Comment trouver directement le mois 10 ?`, img: SK.tableur() },
      comprends: `<p>Une <b>suite</b> est une liste de nombres numérotés : u₀, u₁, u₂… Le numéro n est le <b>rang</b> (ici, le mois). Le nombre uₙ est le <b>terme</b> de rang n.</p><p>On peut générer une suite de deux façons.</p><p><b>De proche en proche</b> (par <b>récurrence</b>) : on calcule chaque terme à partir du précédent. Ici uₙ₊₁ = uₙ + 15 : 120, 135, 150, 165…</p><p><b>Par une formule</b> (le <b>terme général</b>) : on calcule directement uₙ à partir de n. Ici uₙ = 120 + 15 n, donc u₁₀ = 120 + 150 = 270.</p><p>Dans un tableur, la récurrence s’écrit dans la cellule B3 : <b>=B2+15</b>, puis on recopie vers le bas.</p>`,
      vois: gen, voisLeg: 'Les cases sont les termes ; les flèches vertes montrent qu’on ajoute 15 pour passer d’un mois au suivant.',
      retiens: `<p>Récurrence : ${FM(R`u_{n+1}=u_n+15`)} · Formule : ${FM(R`u_n=120+15n`)}</p><p>n : le rang · uₙ : le terme de rang n · u₀ : le premier terme.</p>`,
      exemple: `<p>u₃ = 120 + 15 × 3 = <b>165</b>.</p><p>u₁₀ = 120 + 15 × 10 = <b>270</b>.</p>`,
      attention: 'Le premier terme est u₀ quand on commence à n = 0. Le terme u₃ est donc le 4ᵉ de la liste.', astuce: { k: 'vite', t: 'Pour un rang éloigné (u₁₀₀), utilise la formule : la récurrence demanderait 100 calculs.' } },
    { titre: 'Les suites arithmétiques', decouvre: { txt: `Les abonnés augmentent toujours de ${H('15')} chaque mois. Que remarques-tu quand tu places les points (n ; uₙ) dans un repère ?`, img: SK.escalier() },
      comprends: `<p>Une suite est <b>arithmétique</b> quand on passe d’un terme au suivant en <b>ajoutant toujours le même nombre r</b>. Ce nombre s’appelle la <b>raison</b> : uₙ₊₁ = uₙ + r.</p><p>Son terme général est uₙ = u₀ + n × r. En effet, depuis u₀, on a ajouté n fois la raison. Pour les abonnés, r = 15 et u₀ = 120.</p><p>Si r est positive, la suite est croissante ; si r est négative, elle est décroissante.</p><p>Dans un repère, les points (n ; uₙ) sont <b>alignés</b> : c’est une évolution linéaire, comme les intérêts simples du chapitre 1.</p>`,
      vois: ari, voisLeg: 'Chaque marche avance de 1 mois et monte de 15 abonnés : les points sont sur une même droite.',
      retiens: `<p>${FM(R`u_{n+1}=u_n+r \qquad u_n=u_0+n\times r`)}</p><p>Raison : ${FM(R`r=u_{n+1}-u_n`)} (une différence).</p>`,
      exemple: `<p>u₀ = 120, r = 15 : u₈ = 120 + 8 × 15 = <b>240</b>.</p><p>Stock 480, r = − 35 : u₄ = 480 − 140 = <b>340</b>.</p>`,
      wide: K.rais('vérifier tous les écarts', `<p>La suite 2 ; 4 ; 8 est-elle arithmétique ? On a 4 − 2 = 2, mais 8 − 4 = 4. Les écarts ne sont pas tous égaux : <b>non</b>. Pour dire qu’une suite est arithmétique, il faut que <b>tous</b> les écarts soient égaux ; pour dire qu’elle ne l’est pas, un seul écart différent suffit.</p>`),
      attention: 'Le terme général est u₀ + n × r : on n’ajoute pas n à r, on multiplie n par r.', astuce: { k: 'verif', t: 'Contrôle u₁ avec la formule : 120 + 1 × 15 = 135, c’est bien le 2ᵉ terme.' } },
    { titre: 'Les suites géométriques', decouvre: { txt: `Un compte compte ${H('500 abonnés')} et en gagne ${H('10 %')} chaque mois. Les hausses sont-elles toujours les mêmes ? Que deviennent les points dans un repère ?`, img: SK.expo() },
      comprends: `<p>Augmenter de 10 %, c’est multiplier par 1 + 10 ÷ 100 = <b>1,1</b>. Une suite est <b>géométrique</b> quand on passe d’un terme au suivant en <b>multipliant toujours par le même nombre q</b>, appelé la <b>raison</b> : vₙ₊₁ = vₙ × q.</p><p>Son terme général est vₙ = v₀ × qⁿ : depuis v₀, on a multiplié n fois par q.</p><p>Pour v₀ = 500 et q = 1,1 : v₁ = 550, v₂ = 605, v₃ = 665,50. Les hausses grandissent (+ 50, + 55, + 60,50…) : les points ne sont <b>pas alignés</b>.</p><p>Si q est plus grand que 1, la suite (positive) est croissante ; si q est entre 0 et 1, elle est décroissante. Une baisse de 20 % correspond à q = 0,8.</p>`,
      vois: geo, voisLeg: 'Les écarts verts grandissent : + 50 au début, + 97,44 à la fin. Les points restent au-dessus du segment rouge tracé entre le premier et le dernier.',
      retiens: `<p>${FM(R`v_{n+1}=v_n\times q \qquad v_n=v_0\times q^n`)}</p><p>Raison : ${FM(R`q=\dfrac{v_{n+1}}{v_n}`)} (un quotient). Hausse de t % : ${FM(R`q=1+\dfrac{t}{100}`)}</p>`,
      exemple: `<p>v₃ = 500 × 1,1³ = <b>665,50</b>.</p><p>Baisse de 20 % : q = <b>0,8</b>.</p>`,
      attention: 'Une hausse de 10 % donne q = 1,1, pas q = 10 ni q = 0,1.', astuce: { k: 'og', t: 'Ordre de grandeur : avec + 10 % par mois, le nombre double en un peu plus de 7 mois.' } },
    { titre: 'Choisir le bon modèle', decouvre: { txt: `On place ${H('1 000 €')}. Placement A : ${H('+ 60 € par an')}. Placement B : ${H('+ 5 % par an')}, intérêts compris. Lequel rapporte le plus ? Cela dépend-il de la durée ?`, img: SK.deuxSuites() },
      comprends: `<p>Une hausse d’un <b>même montant</b> donne une suite arithmétique. Une hausse d’un <b>même pourcentage</b> donne une suite géométrique.</p><p>Placement A (intérêts simples, chapitre 1) : Aₙ = 1 000 + 60 n. Placement B (<b>intérêts composés</b> : les intérêts produisent à leur tour des intérêts) : Bₙ = 1 000 × 1,05ⁿ.</p><p>La première année, A rapporte 60 € et B 50 €. Mais les intérêts de B augmentent chaque année. On calcule de proche en proche : au bout de 8 ans, A vaut 1 480 € et B ≈ 1 477,46 € ; au bout de 9 ans, A vaut 1 540 € et B ≈ 1 551,33 €.</p><p>Sur une longue durée, une suite géométrique de raison plus grande que 1 finit toujours par dépasser une suite arithmétique.</p>`,
      vois: comp, voisLeg: 'Bleu : placement A, points alignés. Orange : placement B, qui part plus bas mais dépasse A à partir de 9 ans.',
      retiens: `<p>Même <b>montant</b> ajouté : arithmétique. Même <b>pourcentage</b> : géométrique.</p><p>${FM(R`A_n=1000+60n \qquad B_n=1000\times1{,}05^n`)}</p>`,
      exemple: `<p>A₉ = 1 000 + 540 = <b>1 540 €</b>.</p><p>B₉ = 1 000 × 1,05⁹ ≈ <b>1 551,33 €</b>.</p>`,
      wide: K.prog('trouver quand B dépasse A', 'La boucle calcule les deux placements année après année, tant que B ne dépasse pas A.', `a = 1000\nb = 1000\nn = 0\nwhile b <= a:\n    n = n + 1\n    a = a + 60\n    b = b * 1.05\nprint(n)    # affiche 9`, `<p class="prog-q">Quelle ligne fait de A une suite arithmétique ? ${bl(30, 'a = a + 60')} Et de B une suite géométrique ? ${bl(30, 'b = b * 1.05')}</p>`),
      attention: 'Ne conclus pas trop vite : A est meilleur les premières années, B à partir de 9 ans. La réponse dépend de la durée.', astuce: { k: 'sens', t: 'Dans un énoncé, « de … € » annonce une suite arithmétique, « de … % » une suite géométrique.' } }];

  c.mots = [['suite', 'liste de nombres numérotés u₀, u₁, u₂…', 'Le nombre d’abonnés forme une suite.'], ['rang', 'numéro n d’un terme', 'Le terme de rang 3 est u₃.'], ['terme', 'nombre uₙ de la suite', 'Le terme u₃ vaut 165.'], ['récurrence', 'calcul d’un terme à partir du précédent', 'Par récurrence, uₙ₊₁ = uₙ + 15.'], ['terme général', 'formule qui donne uₙ à partir de n', 'Le terme général est uₙ = 120 + 15n.'], ['suite arithmétique', 'on ajoute toujours la même raison r', 'Le nombre d’abonnés suit une suite arithmétique.'], ['raison', 'nombre ajouté (r) ou multiplicateur (q) constant', 'La raison de la suite géométrique est 1,1.'], ['suite géométrique', 'on multiplie toujours par la même raison q', 'Une hausse de 10 % par mois donne une suite géométrique.'], ['intérêts composés', 'intérêts ajoutés au capital, qui rapportent à leur tour', 'Avec les intérêts composés, le capital est multiplié par 1,05 chaque année.']];

  /* ---------- exercices résolus ---------- */
  chk(u(10) === 270 && (300 - 120) / 15 === 12 && f2(500 * 1.1) === 550 && f2(550 * 1.1) === 605 && f2(500 * Math.pow(1.1, 3)) === 665.5, 'c5 résolus');
  c.resolus = [
    { titre: 'Une suite arithmétique : prévoir les abonnés', outil: '🧮 calculatrice', enonce: `La box a ${H('120 abonnés')} au mois 0 et en gagne ${H('15 par mois')}. Calcule u₁, écris le terme général, calcule u₁₀ puis trouve le mois où la box atteint 300 abonnés.`,
      rows: [['u₁ = 120 + 15 = <b class="nw">135</b>', 'J’ajoute la raison r = 15.'], ['uₙ = <b class="nw">120 + 15 n</b>', 'Suite arithmétique : u₀ + n × r.'], ['u₁₀ = 120 + 15 × 10 = <b class="nw">270</b>', 'Je remplace n par 10.'], ['120 + 15 n = 300 ⇔ 15 n = 180 ⇔ <b class="nw">n = 12</b>', 'Je résous une équation du premier degré.']], verif: 'u₁₂ = 120 + 180 = 300 ✓.', rep: 'u₁₀ = 270 abonnés ; la box atteint 300 abonnés au mois 12.', go: ['e1', 'e3'] },
    { titre: 'À toi : une suite géométrique', outil: '🧮 calculatrice', enonce: `Un compte a ${H('500 abonnés')} et gagne ${H('10 %')} par mois. Donne la raison, puis v₁, v₂ et v₃.`, trous: [0, 1, 2, 3],
      rows: [['q = 1 + 10 ÷ 100 = ⟦1,1⟧', 'Une hausse de 10 % multiplie par 1,1.'], ['v₁ = 500 × 1,1 = ⟦550⟧', 'Je multiplie par q.'], ['v₂ = 550 × 1,1 = ⟦605⟧', 'De proche en proche.'], ['v₃ = 500 × 1,1³ = ⟦665,5⟧', 'Avec le terme général v₀ × qⁿ.']], verif: '605 × 1,1 = 665,5 : la récurrence donne le même résultat ✓.', rep: 'q = 1,1 ; v₁ = 550 ; v₂ = 605 ; v₃ = 665,50.', go: ['e2'] }];
  c.entraine = [{ id: 'e1', gen: 'c5e1', lc: 2 }, { id: 'e2', gen: 'c5e2', lc: 3 }, { id: 'e3', gen: 'c5e3', lc: 4 }];

  /* ---------- je résous ---------- */
  const s = n => 480 - 35 * n;
  chk(s(1) === 445 && s(4) === 340 && s(10) === 130 && s(11) === 95, 'c5 p1');
  const w = n => 2500 * Math.pow(1.08, n);
  chk(f2(w(1)) === 2700 && f2(w(2)) === 2916 && Math.round(w(6)) === 3967, 'c5 p2');
  chk(A(5) === 1300 && f2(Bc(5)) === 1276.28 && A(10) === 1600 && f2(Bc(10)) === 1628.89, 'c5 p3');
  c.probs = [
    PB({ id: 'p1', etape: 2, lc: 2, comps: ['app', 'rea'], titre: 'Le stock de cartons', intro: `<p>La boutique a un stock de ${H('480 cartons')} d’expédition. Elle en utilise ${H('35 par semaine')}. On note uₙ le stock au bout de n semaines (u₀ = 480).</p>`,
      qs: [Q('a.', 'Calcule u₁.', '480 − 35 = 445', 445, { w: 24 }), Q('b.', 'Donne la raison r de cette suite arithmétique.', 'r = − 35', -35, { w: 24 }), Q('c.', 'Calcule u₄ avec le terme général.', '480 + 4 × (− 35) = 340', 340, { w: 24 }), Q('d.', 'Au bout de combien de semaines le stock passe-t-il sous 100 cartons ?', 'u₁₀ = 130 ; u₁₁ = 95 : au bout de 11 semaines', 11, { w: 24 })],
      err: { 1: [{ v: 35, m: 'Le stock diminue : la raison est négative.' }], 2: [{ v: 620, m: 'Le stock baisse : on enlève 35 à chaque semaine.' }], 3: [{ v: 10, m: 'u₁₀ = 130 : il reste encore plus de 100 cartons.' }] },
      hints: ['Chaque semaine, on enlève 35 cartons.', 'uₙ = 480 − 35 n.', 'Calcule u₁₀ et u₁₁ et compare à 100.'], pouce: 'Le stock baisse de 35 par semaine : la raison vaut − 35.', corr: 'a. 445. b. − 35. c. 340. d. 11 semaines (u₁₁ = 95).' }),
    PB({ id: 'p2', etape: 3, lc: 3, defi: 4, bulle: 'Ce cas se fait en 4 étapes. Transforme d’abord le pourcentage en multiplicateur.', autravail: { comp: 'ana', txt: 'prévoir le nombre d’abonnés d’un compte de réseau social professionnel.' }, comps: ['ana', 'rea', 'val'], titre: 'Les abonnés du compte de la boutique',
      intro: `<p>Le compte de la boutique compte ${H('2 500 abonnés')} et gagne ${H('8 % d’abonnés par mois')}. On note vₙ le nombre d’abonnés au bout de n mois.</p>`,
      qs: [Q('a.', 'Donne la raison q de cette suite géométrique.', '1 + 8 ÷ 100 = 1,08', 1.08, { w: 24, tol: .0006 }), Q('b.', 'Calcule v₁.', '2 500 × 1,08 = 2 700', 2700, { w: 24 }), Q('c.', 'Calcule v₂.', '2 700 × 1,08 = 2 916', 2916, { w: 24 }), Q('d.', 'Calcule v₆, arrondi à l’unité.', '2 500 × 1,08⁶ ≈ 3 967', 3967, { w: 24, tol: .6 })],
      err: { 0: [{ v: 8, m: 'Une hausse de 8 % multiplie par 1,08.' }, { v: .08, m: 'Multiplier par 0,08 donnerait les 8 % seulement. Ajoute 1 : q = 1,08.' }], 2: [{ v: 2900, m: 'Tu as ajouté 200 comme le premier mois. La hausse est de 8 % du nouveau nombre.' }], 3: [{ v: 3700, m: 'Tu as ajouté 200 par mois (suite arithmétique). Ici on multiplie par 1,08.' }] },
      hints: ['+ 8 % : on multiplie par 1 + 0,08.', 'v₂ = v₁ × q.', 'v₆ = 2 500 × 1,08 puissance 6 (touche ^ ou xʸ).'], pouce: 'q = 1,08. Sur la calculatrice : 2500 × 1,08 ^ 6.', corr: 'a. 1,08. b. 2 700. c. 2 916. d. ≈ 3 967 abonnés.' }),
    PB({ id: 'p3', etape: 4, lc: 4, cls: 'bac', defi: 5, bulle: 'Voici une question de « vers le bac » : 5 étapes. Un placement est arithmétique, l’autre géométrique : calcule les deux avant de conclure.', autravail: { comp: 'com', txt: 'conseiller un client sur un placement selon la durée prévue.' }, comps: ['rea', 'ana', 'com'], titre: 'Conseiller un placement',
      intro: `<p>Un client place ${H('1 000 €')}. Placement A : ${H('+ 60 € par an')} (intérêts simples). Placement B : ${H('+ 5 % par an')} (intérêts composés).</p>`,
      qs: [BQ('1', 'Calculer la valeur du placement A au bout de 5 ans.', 'rea', '1 000 + 5 × 60 = 1 300 €', 1300, { w: 26 }), BQ('2', 'Calculer la valeur du placement B au bout de 5 ans, au centime.', 'rea', '1 000 × 1,05⁵ ≈ 1 276,28 €', 1276.28, { w: 26 }), BQ('3', 'Donner la raison de la suite géométrique du placement B.', 'ana', 'q = 1,05', 1.05, { w: 26, tol: .0006 }), BQ('4', 'Calculer la valeur du placement B au bout de 10 ans, au centime.', 'rea', '1 000 × 1,05¹⁰ ≈ 1 628,89 €', 1628.89, { w: 26 }), BQ('5', 'Justifier : quel placement conseiller pour 5 ans ? Pour 10 ans ?', 'com', 'Pour 5 ans, A (1 300 € > 1 276,28 €). Pour 10 ans, B (1 628,89 € > 1 600 €).', null, { lines: 3 })],
      err: { 1: [{ v: 1250, m: 'Tu as ajouté 50 € par an : c’est un calcul arithmétique. Pour B, multiplie par 1,05 chaque année.' }], 2: [{ v: 5, m: 'Une hausse de 5 % multiplie par 1,05.' }], 3: [{ v: 1500, m: 'Tu as ajouté 50 € par an. Pour B, utilise 1 000 × 1,05¹⁰.' }] },
      hints: ['A : 1 000 + n × 60.', 'B : 1 000 × 1,05 puissance n.', 'Compare les deux valeurs pour chaque durée.'], pouce: 'Le placement B part moins vite, mais ses intérêts grandissent chaque année.', corr: '1. 1 300 €. 2. 1 276,28 €. 3. 1,05. 4. 1 628,89 €. 5. A pour 5 ans, B pour 10 ans.' })];

  c.bilan = [['Je sais calculer les termes d’une suite.', ['e1', 'p1']], ['Je sais reconnaître et utiliser une suite arithmétique.', ['e1', 'p1']], ['Je sais reconnaître et utiliser une suite géométrique.', ['e2', 'p2']], ['Je sais choisir le bon modèle et comparer deux évolutions.', ['e3', 'p3']]];
  c.words = require('./gl1')('c5');
  c.plusloin = { meca: [], probs: [] };
  return c;
};
