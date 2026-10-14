/* Chapitre 7 · Pour aller plus loin — programme complémentaire « poursuite d’études » : exponentielle de base e et logarithme népérien.
   Terminale Bac Pro (arrêté du 3 février 2020, module complémentaire pour les élèves qui préparent une poursuite d’études, notamment en BTS). */
'use strict';
const K = require('./kitT');
const { rnd, H, FM, R, Q, BQ, PB, S, T, Rc, Ar, st, MCVP, bl, tab } = K;
const { SK } = require('./skT');
const { fr } = K.MCVG;
const HP = 'poursuite d’études';

module.exports = function (chk) {
  const c = { id: 'c7', n: 7, col: 'verbe', icone: '🎓', dom: 'Programme complémentaire · poursuite d’études', titre: 'Exponentielle et logarithme népérien', sous: 'Pour aller plus loin : préparer le BTS' };
  c.parties = [{ t: 'La fonction exponentielle de base e', n: [1, 2] }, { t: 'Le logarithme népérien', n: [3, 4] }];
  c.travail = { question: `Une banque verse des intérêts ${H('chaque jour')}, ou même « en continu ». Le capital grandit-il sans limite ? Un nombre célèbre, ${H('e ≈ 2,718')}, donne la réponse. Ce chapitre prépare les mathématiques des BTS de la relation client (NDRC, MCO).` };
  c.objectifs = ['Je saurai d’où vient le nombre e et calculer avec la fonction x ↦ eˣ.', 'Je saurai dériver eˣ et e^(kx), et décrire une croissance continue.', 'Je saurai utiliser le logarithme népérien ln et ses propriétés.', 'Je saurai résoudre eˣ = a et ln(x) = a.'];
  c.depart = 'c7';

  /* ---------- données ---------- */
  const seq = [1, 2, 4, 12, 52, 365].map(n => rnd(Math.pow(1 + 1 / n, n), 4));
  chk(seq.join() === '2,2.25,2.4414,2.613,2.6926,2.7146' && rnd(Math.E, 3) === 2.718 && rnd(Math.exp(.05), 4) === 1.0513 && rnd(Math.log(2) / .05, 2) === 13.86 && rnd(Math.log(2) / Math.log(1.017), 2) === 41.12, 'c7 données');

  /* ---------- méthodes visuelles ---------- */
  const GRN = MCVP.GRN, RED = MCVP.RED, VIO = MCVP.VIO;
  // 1. (1 + 1/n)ⁿ se rapproche de e
  const g1 = MCVP.plot({ W: 600, H: 290, x: [0, 7, 1], y: [1.8, 2.8, .2], xt: [[1, '1'], [2, '2'], [3, '4'], [4, '12'], [5, '52'], [6, '365']], ml: 50, mt: 16, mb: 34, xl: 'n (versements par an)', lab: 'Les valeurs de (1 + 1/n) puissance n' });
  const v1 = S(600, 290, st(1, g1.base + g1.pts(seq.map((v, i) => [i + 1, v]), { r: 5.5, fill: GRN }))
    + st(2, seq.map((v, i) => g1.txt(i + 1, v, fr(v), { dy: 20, fs: 12 })).join(''))
    + st(3, g1.seg(0, Math.E, 7, Math.E, { stroke: RED, dash: '8 5', w: 2 }) + g1.txt(.2, 2.75, 'e ≈ 2,718', { a: 'start', fill: RED, cls: '' }))
    + st(4, g1.txt(6.8, 1.9, 'plus n est grand, plus (1 + 1/n)ⁿ est proche de e', { a: 'end', fs: 13 })),
  'Les points montent de 2 vers 2,7146 et se rapprochent de la droite y = e');
  // 2. la dérivée de eˣ : la pente vaut la hauteur
  const g2 = MCVP.plot({ W: 600, H: 300, x: [-2, 2.2, 1], y: [0, 9, 1], ml: 46, mt: 16, mb: 30, zeroAxes: true, lab: 'La courbe de e puissance x et deux tangentes' });
  const v2 = S(600, 300, st(1, g2.base + g2.curve(x => Math.exp(x), { stroke: GRN, w: 3 }) + g2.txt(2.1, 8.6, 'y = eˣ', { a: 'end', fill: GRN, cls: '' }))
    + st(2, g2.line(1, 1, { stroke: RED, w: 2, dash: '7 5' }) + g2.dot(0, 1, { r: 5.5, fill: '#FFC233' }) + g2.txt(-1.9, 3.6, 'en x = 0 : hauteur 1, pente 1', { a: 'start', fs: 13 }))
    + st(3, g2.line(Math.E, 0, { stroke: VIO, w: 2, dash: '7 5' }) + g2.dot(1, Math.E, { r: 5.5, fill: '#FFC233' }) + g2.txt(-1.9, 5.6, 'en x = 1 : hauteur e, pente e', { a: 'start', fs: 13 }))
    + st(4, `<rect x="250" y="${g2.Y(8.4)}" width="200" height="34" rx="8" class="k2 ks" stroke-width="2"/>` + T(350, g2.Y(8.4) + 23, '(eˣ)′ = eˣ', { fs: 17, c: 'kt' })),
  'En chaque point de la courbe de e puissance x, la pente de la tangente est égale à la hauteur');
  // 3. exp et ln : courbes symétriques
  const g3 = MCVP.plot({ W: 600, H: 300, x: [-2, 5, 1], y: [-2, 5, 1], ml: 40, mt: 16, mb: 30, zeroAxes: true, lab: 'Courbes de exp et de ln' });
  const v3 = S(600, 300, st(1, g3.base + g3.curve(x => Math.exp(x), { stroke: GRN, w: 3 }) + g3.txt(1.7, 4.6, 'y = eˣ', { a: 'end', fill: GRN, cls: '' }))
    + st(2, g3.curve(x => Math.log(x), { a: .14, b: 5, stroke: VIO, w: 3 }) + g3.txt(4.9, 1.9, 'y = ln(x)', { a: 'end', fill: VIO, cls: '' }))
    + st(3, g3.line(1, 0, { stroke: '#545B7A', w: 1.6, dash: '5 4' }) + g3.dot(0, 1, { r: 5 }) + g3.dot(1, 0, { r: 5 }) + g3.txt(-.15, 1.35, '(0 ; 1)', { a: 'end', fs: 12.5 }) + g3.txt(1.1, -.45, '(1 ; 0)', { a: 'start', fs: 12.5 }))
    + st(4, g3.txt(1.6, -1.05, 'eᵃ = b ⟺ a = ln(b) :', { a: 'start', fs: 13 }) + g3.txt(1.6, -1.6, 'symétrie par rapport à y = x', { a: 'start', fs: 13 })),
  'Les courbes de e puissance x et de ln sont symétriques par rapport à la droite y = x');
  // 4. le temps de doublement d’une croissance continue
  const g4 = MCVP.plot({ W: 600, H: 290, x: [0, 25, 5], y: [.8, 3.6, .4], ml: 50, mt: 16, mb: 34, xl: 't (années)', yl: 'coefficient', lab: 'Coefficient e puissance 0,05 t' });
  const td = Math.log(2) / .05;
  const v4 = S(600, 290, st(1, g4.base + g4.curve(t => Math.exp(.05 * t), { stroke: GRN, w: 3 }) + T(300, 287, 'l’axe vertical commence à 0,8', { fs: 11, c: 'ts' }))
    + st(2, g4.seg(0, 2, 25, 2, { stroke: RED, dash: '8 5', w: 2 }) + g4.txt(.5, 2.1, 'double : e^(0,05t) = 2', { a: 'start', fill: RED, cls: '' }))
    + st(3, g4.guide(td, 2) + g4.dot(td, 2, { r: 6, fill: '#FFC233' }) + g4.txt(td, .9, 't ≈ 13,86', { dx: 6, a: 'start', fs: 13 }))
    + st(4, `<rect x="66" y="${g4.Y(3.3)}" width="270" height="34" rx="8" class="k2 ks" stroke-width="2"/>` + T(201, g4.Y(3.3) + 23, 't = ln(2) ÷ 0,05 ≈ 13,86 ans', { fs: 14.5, c: 'kt' })),
  'La courbe du coefficient croise la droite y = 2 en t ≈ 13,86');

  c.notions = [
    { titre: 'Le nombre e et la fonction exponentielle', hp: HP, decouvre: { txt: `On place ${H('1 €')} à ${H('100 %')} par an. Intérêts versés une fois : 2 € au bout d’un an. Versés chaque mois : (1 + 1/12)¹² ≈ 2,61 €. Versés chaque jour ? « En continu » ? Le capital grandit-il sans limite ?`, img: SK.euler() },
      comprends: `<p>Avec n versements par an, le capital d’un euro placé à 100 % devient (1 + 1/n)ⁿ au bout d’un an : 2 ; 2,25 ; 2,61 ; 2,71…</p><p>Plus n est grand, plus ce nombre se rapproche d’une limite : le <b>nombre e ≈ 2,718</b>. Il ne s’écrit pas avec un nombre fini de décimales, comme π.</p><p>La <b>fonction exponentielle</b> est la fonction x ↦ eˣ, notée aussi exp(x). C’est la fonction x ↦ qˣ du chapitre 4, avec q = e. Elle a donc les mêmes propriétés : e⁰ = 1, eˣ &gt; 0, eᵃ × eᵇ = eᵃ⁺ᵇ.</p><p>Comme e &gt; 1, elle est croissante. La touche eˣ de la calculatrice donne ses valeurs.</p>`,
      vois: v1, voisLeg: 'Avec 1, 2, 4, 12, 52 puis 365 versements par an, les valeurs montent mais restent sous la droite rouge y = e.',
      retiens: `<p>${FM(R`e\approx 2{,}718 \qquad \exp(x)=e^x`)}</p><p>${FM(R`e^0=1 \quad e^x>0 \quad e^a\times e^b=e^{a+b} \quad e^{-a}=\dfrac{1}{e^a}`)}</p>`,
      exemple: `<p>e² ≈ <b>7,389</b> ; e⁻¹ ≈ <b>0,368</b>.</p><p>1 000 € à 12 % en continu : 1 000 × e<sup>0,12</sup> ≈ <b>1 127,50 €</b>.</p>`,
      attention: 'e² n’est pas e × 2 : e² = e × e ≈ 7,389.', astuce: { k: 'og', t: 'e est un peu moins que 3 : e² est un peu moins que 9, e³ un peu moins que 27.' } },
    { titre: 'Dérivée de eˣ et croissance continue', hp: HP, decouvre: { txt: `Une audience (entreprise fictive) grandit « en continu » : ${H('f(t) = 2 000 × e^(0,03t)')} abonnés au bout de t mois. À quelle vitesse augmente-t-elle au bout d’un an ?`, img: SK.expTan() },
      comprends: `<p>La fonction exponentielle a une propriété unique : elle est <b>égale à sa dérivée</b>. (eˣ)′ = eˣ. En chaque point, la pente de la tangente est égale à la hauteur de la courbe.</p><p>Plus généralement, (e^(kx))′ = k × e^(kx). Une fonction f(t) = C × e^(kt) décrit une <b>croissance continue</b> au taux k (si k &gt; 0), ou une décroissance (si k &lt; 0).</p><p>Pour l’audience : f′(t) = 2 000 × 0,03 × e^(0,03t) = 60 e^(0,03t). Au bout de 12 mois, f(12) ≈ 2 866,66 et f′(12) ≈ 86 : l’audience gagne environ 86 abonnés par mois à ce moment.</p><p>Un taux continu de 5 % correspond à e<sup>0,05</sup> ≈ 1,0513, soit 5,13 % par an.</p>`,
      vois: v2, voisLeg: 'En x = 0, la courbe est à la hauteur 1 et sa tangente a pour pente 1. En x = 1, hauteur et pente valent toutes deux e.',
      retiens: `<p>${FM(R`(e^x)'=e^x \qquad (e^{kx})'=k\,e^{kx}`)}</p><p>${FM(R`f(t)=C\,e^{kt}`)} : croissance continue si k &gt; 0, décroissance si k &lt; 0.</p>`,
      exemple: `<p>f′(t) = <b>60 e^(0,03t)</b> ; f′(12) ≈ <b>86</b> abonnés par mois.</p><p>e<sup>0,05</sup> ≈ 1,0513 : 5 % en continu ≈ <b>5,13 %</b> par an.</p>`,
      attention: 'La dérivée de e^(0,03t) est 0,03 e^(0,03t) : n’oublie pas le facteur k = 0,03.', astuce: { k: 'verif', t: 'eˣ est toujours positive : le signe de la dérivée de C e^(kt) est celui du nombre C × k.' } },
    { titre: 'Le logarithme népérien', hp: HP, decouvre: { txt: `Au chapitre 4, log(b) était l’exposant à donner à 10 pour obtenir b. Quel est l’exposant à donner à ${H('e')} pour obtenir ${H('2')} ?`, img: SK.lnSym() },
      comprends: `<p>Pour b &gt; 0, le <b>logarithme népérien</b> de b, noté ln(b), est la solution de l’équation eˣ = b. C’est l’exposant qu’il faut donner à e pour obtenir b.</p><p>Ainsi ln(1) = 0 et ln(e) = 1. La touche ln donne : ln(2) ≈ 0,693.</p><p>ln a les mêmes propriétés que log : ln(a × b) = ln(a) + ln(b) et ln(aⁿ) = n × ln(a). Les deux sont liés : log(x) = ln(x) ÷ ln(10).</p><p>La fonction ln est croissante sur ]0 ; + ∞[ et sa dérivée est 1/x. Sa courbe est la symétrique de celle de eˣ par rapport à la droite y = x.</p>`,
      vois: v3, voisLeg: 'La courbe de ln (violet) est le reflet de celle de eˣ (vert) dans la droite y = x : (0 ; 1) devient (1 ; 0).',
      retiens: `<p>${FM(R`\ln(b)=x \iff e^x=b`)} (b &gt; 0) · ln(1) = 0 · ln(e) = 1</p><p>${FM(R`\ln(ab)=\ln a+\ln b \quad \ln(a^n)=n\ln a \quad (\ln x)'=\dfrac{1}{x}`)}</p>`,
      exemple: `<p>ln(2) ≈ <b>0,693</b>.</p><p>log(1 000) = ln(1 000) ÷ ln(10) = <b>3</b>.</p>`,
      attention: 'ln(0) et ln d’un nombre négatif n’existent pas : eˣ est toujours strictement positif.', astuce: { k: 'vite', t: 'ln et log donnent les mêmes solutions pour qˣ = a : ln(a) ÷ ln(q) = log(a) ÷ log(q).' } },
    { titre: 'Résoudre eˣ = a et ln(x) = a', hp: HP, decouvre: { txt: `Un placement grandit en continu au taux de ${H('5 %')} : le coefficient est e^(0,05t). En combien de temps le capital double-t-il ?`, img: SK.bts() },
      comprends: `<p>Pour a &gt; 0, l’équation eˣ = a a une seule solution : x = ln(a). Pour l’équation ln(x) = b, on revient à la définition : x = eᵇ.</p><p>Pour le placement : e^(0,05t) = 2 donne 0,05t = ln(2), donc t = ln(2) ÷ 0,05 ≈ 13,86 ans.</p><p>On peut aussi résoudre qˣ = a avec ln : x = ln(a) ÷ ln(q). Pour le Livret A à 1,7 %, ln(2) ÷ ln(1,017) ≈ 41,12 : c’est le même résultat qu’avec log au chapitre 4.</p><p>En BTS, on rencontre surtout ln et e. Retiens que log et ln jouent le même rôle : faire « descendre » un exposant.</p>`,
      vois: v4, voisLeg: 'La courbe e^(0,05t) croise la droite y = 2 en t ≈ 13,86 : c’est le temps de doublement.',
      retiens: `<p>${FM(R`e^x=a \iff x=\ln a`)} (a &gt; 0) · ${FM(R`\ln x=b \iff x=e^b`)}</p><p>${FM(R`e^{kt}=2 \iff t=\dfrac{\ln 2}{k}`)}</p>`,
      exemple: `<p>e^(0,05t) = 2 : t ≈ <b>13,86 ans</b>.</p><p>ln(x) = 2 : x = e² ≈ <b>7,389</b>.</p>`,
      wide: K.prog('vérifier avec Python', 'Le module <code>math</code> contient <code>exp</code> et <code>log</code>. Attention : en Python, <code>math.log</code> est le logarithme népérien ln.', `import math\nt = math.log(2) / 0.05\nprint(round(t, 2))          # affiche 13.86\nprint(math.exp(0.05 * t))   # affiche 2.0 (environ)`, `<p class="prog-q">Que calcule <code>math.log(2)</code> ? ${bl(30, 'ln(2), environ 0,693')} Quelle fonction Python donne le logarithme décimal ? ${bl(26, 'math.log10')}</p>`),
      attention: 'ln(2) ÷ 0,05 n’est pas ln(2 ÷ 0,05) : on divise le logarithme par k.', astuce: { k: 'og', t: 'Règle de 70 : avec un taux continu de k %, le doublement prend environ 70 ÷ k années (70 ÷ 5 = 14).' } }];

  c.mots = [['le nombre e', 'constante ≈ 2,718, limite de (1 + 1/n)ⁿ', 'e apparaît avec des intérêts versés en continu.'], ['fonction exponentielle', 'la fonction x ↦ eˣ, notée exp', 'exp(0) = 1.'], ['croissance continue', 'évolution du type C × e^(kt)', 'L’audience suit une croissance continue.'], ['logarithme népérien', 'ln(b) : l’exposant x tel que eˣ = b', 'ln(e) = 1.'], ['temps de doublement', 'durée t telle que e^(kt) = 2', 'À 5 % en continu, le temps de doublement est d’environ 13,86 ans.'], ['poursuite d’études', 'études après le bac, en BTS par exemple', 'Ce chapitre prépare la poursuite d’études.']];

  /* ---------- exercices résolus ---------- */
  chk(rnd(Math.exp(1.2), 3) === 3.32 && rnd(Math.log(50) / .04, 1) === 97.8 && rnd(Math.log(5), 3) === 1.609 && rnd(Math.exp(1.5), 3) === 4.482, 'c7 résolus');
  c.resolus = [
    { titre: 'Dériver et calculer', outil: '🧮 calculatrice', enonce: `Le chiffre d’affaires d’une boutique en ligne (fictive), en milliers d’euros, est modélisé par ${H('f(t) = 10 e^(0,04t)')}, où t est en mois. Calcule f′(t), puis f(30) et f′(30).`,
      rows: [['f′(t) = 10 × 0,04 × e^(0,04t) = <b>0,4 e^(0,04t)</b>', '(e^(kt))′ = k e^(kt).'], ['f(30) = 10 e<sup>1,2</sup> ≈ <b>33,20</b>', 'e^1,2 ≈ 3,320.'], ['f′(30) = 0,4 e<sup>1,2</sup> ≈ <b>1,33</b>', 'Même puissance, autre coefficient.'], ['f′(t) &gt; 0 : f est <b>croissante</b>', 'eˣ est toujours positive.']], verif: 'f′(30) ÷ f(30) = 0,04 : le taux de croissance continu ✓.', rep: 'Au bout de 30 mois, le CA est d’environ 33 200 € et augmente d’environ 1 330 € par mois.', go: ['e1', 'e2'] },
    { titre: 'À toi : résoudre avec ln', outil: '🧮 calculatrice', enonce: `Avec le même modèle f(t) = 10 e^(0,04t), au bout de combien de mois le CA atteint-il ${H('50 milliers d’euros')} ?`, trous: [0, 1, 2, 3],
      rows: [['10 e^(0,04t) = 50, soit e^(0,04t) = ⟦5⟧', 'On divise par 10.'], ['0,04t = ln(5) ≈ ⟦1,609⟧', 'eˣ = a ⟺ x = ln(a).'], ['t = ln(5) ÷ 0,04 ≈ ⟦40,24⟧', 'On divise par 0,04.'], ['réponse : au cours du ⟦41e⟧ mois', 'Entier supérieur.']], verif: '10 × e^(0,04 × 40,24) ≈ 50 ✓.', rep: 'Le CA atteint 50 000 € au cours du 41e mois.', go: ['e3'] }];
  chk(rnd(Math.log(5) / .04, 2) === 40.24, 'c7 résolu 2');
  c.entraine = [{ id: 'e1', gen: 'c7e1', lc: 1 }, { id: 'e2', gen: 'c7e2', lc: 2 }, { id: 'e3', gen: 'c7e3', lc: 4 }];

  /* ---------- je résous ---------- */
  chk(rnd(2000 * Math.exp(.36)) === 2866.66 && rnd(60 * Math.exp(.36)) === 86 && rnd(Math.log(2) / .03, 1) === 23.1, 'c7 p2');
  const Rv = p => 500 * p * Math.exp(-.04 * p);
  chk(rnd(500 * Math.exp(-.8)) === 224.66 && rnd(Rv(25)) === 4598.49 && Rv(20) < Rv(25) && Rv(30) < Rv(25), 'c7 p3');
  c.probs = [
    PB({ id: 'p1', etape: 2, lc: 1, comps: ['app', 'rea'], titre: 'Des intérêts en continu',
      intro: `<p>On place ${H('1 000 €')} à ${H('12 % par an')}. Si les intérêts sont versés en continu, le capital au bout de t années vaut C(t) = 1 000 e^(0,12t).</p>`,
      qs: [Q('a.', 'Calcule C(0). Que représente ce nombre ?', 'C(0) = 1 000 × e⁰ = 1 000 € : le capital placé', 1000, { w: 22 }), Q('b.', 'Calcule C(1), au centime.', '1 000 e^0,12 ≈ 1 127,50 €', 1127.5, { w: 24 }), Q('c.', 'Avec des intérêts versés une fois par an, le capital serait 1 120 €. Calcule l’écart.', '1 127,50 − 1 120 = 7,50 €', 7.5, { w: 22 }), Q('d.', 'Calcule C(5), au centime.', '1 000 e^0,6 ≈ 1 822,12 €', 1822.12, { w: 24 })],
      err: { 1: [{ v: 1120, m: 'Ça, c’est avec un seul versement par an. En continu : 1 000 × e^0,12.' }], 3: [{ v: rnd(1000 * Math.pow(1.12, 5)), m: 'Le versement est continu : 1 000 × e^(0,12 × 5).' }] },
      hints: ['e⁰ = 1.', 'Utilise la touche eˣ : e^0,12.', 'C(5) = 1 000 × e^(0,6).'], pouce: 'C(t) = 1 000 × e^(0,12 t) : remplace t, puis utilise la touche eˣ.', corr: 'a. 1 000 €. b. ≈ 1 127,50 €. c. 7,50 €. d. ≈ 1 822,12 €.' }),
    PB({ id: 'p2', etape: 3, lc: 4, defi: 4, bulle: 'Ce cas se fait en 4 étapes. Pour la dérivée, multiplie par k = 0,03 ; pour la durée, utilise ln.', autravail: { comp: 'ana', txt: 'prévoir l’évolution d’une audience en ligne et fixer un objectif réaliste.' }, comps: ['rea', 'ana', 'com'], titre: 'Une audience en croissance continue',
      intro: `<p>Le compte d’une marque (fictive) a ${H('2 000 abonnés')}. On modélise le nombre d’abonnés au bout de t mois par f(t) = 2 000 e^(0,03t).</p>`,
      qs: [Q('a.', 'Calcule f(12), au centième.', '2 000 e^0,36 ≈ 2 866,66', 2866.66, { w: 24 }), Q('b.', 'Calcule f′(t), puis f′(12) à l’unité.', 'f′(t) = 60 e^(0,03t) ; f′(12) ≈ 86', 86, { w: 22, tol: .6 }), Q('c.', 'Résous f(t) = 4 000. Donne t au dixième.', 'e^(0,03t) = 2 ; t = ln(2) ÷ 0,03 ≈ 23,1', 23.1, { w: 22, tol: .06 }), Q('d.', 'Annonce l’objectif « 4 000 abonnés » à l’équipe, avec une date réaliste.', 'Au rythme actuel, 4 000 abonnés dans environ 24 mois, soit 2 ans.', null, { lines: 2 })],
      err: { 1: [{ v: rnd(2000 * Math.exp(.36)), m: 'Ça, c’est f(12). La dérivée multiplie par 0,03 : f′(12) = 60 e^0,36.' }], 2: [{ v: rnd(2 / .03, 1), m: 't = ln(2) ÷ 0,03, et non 2 ÷ 0,03.' }] },
      hints: ['f(12) = 2 000 × e^(0,36).', '(e^(0,03t))′ = 0,03 e^(0,03t).', 'f(t) = 4 000 ⟺ e^(0,03t) = 2 ⟺ 0,03t = ln(2).'], pouce: 'Divise par 2 000 : e^(0,03t) = 2. Puis prends ln : t = ln(2) ÷ 0,03.', corr: 'a. ≈ 2 866,66. b. f′(t) = 60 e^(0,03t) ; f′(12) ≈ 86. c. t ≈ 23,1 mois. d. Environ 24 mois.' }),
    PB({ id: 'p3', etape: 4, lc: 2, cls: 'bac', defi: 5, bulle: 'Voici un sujet dans l’esprit du BTS : 5 étapes. La dérivée est donnée : il reste à étudier son signe. Une question ratée ne fait pas un exercice raté : continue.', autravail: { comp: 'val', txt: 'fixer le prix qui rapporte la plus grande recette, en tenant compte de la baisse de la demande.' }, comps: ['rea', 'ana', 'val', 'com'], titre: 'Le prix qui rapporte le plus',
      intro: `<p>Une boutique (fictive) estime qu’au prix de p euros, elle vend d(p) = 500 e^(−0,04p) articles par mois. La recette est donc R(p) = 500p e^(−0,04p), pour p dans [0 ; 60].</p>`,
      qs: [BQ('1', 'Calculer d(20), à l’unité.', 'rea', '500 e^(−0,8) ≈ 225 articles', 225, { w: 22, tol: .6 }), BQ('2', 'Justifier que la demande diminue quand le prix augmente.', 'val', 'd′(p) = − 20 e^(−0,04p) < 0 : d est décroissante.', null, { lines: 2 }), BQ('3', 'On admet que R′(p) = 500(1 − 0,04p) e^(−0,04p). Étudier le signe de R′(p).', 'ana', 'e^(−0,04p) > 0 : R′ a le signe de 1 − 0,04p, positif avant 25, négatif après.', null, { lines: 2 }), BQ('4', 'En déduire le prix qui rend la recette maximale, et calculer cette recette au centime.', 'rea', 'p = 25 € ; R(25) = 12 500 e⁻¹ ≈ 4 598,49 €', 4598.49, { w: 26 }), BQ('5', 'Rédiger une recommandation pour la gérante.', 'com', 'Vendre l’article 25 € : environ 184 ventes par mois et une recette maximale d’environ 4 598 €.', null, { lines: 2 })],
      err: { 3: [{ v: 25, m: '25 € est le prix. On demande aussi la recette maximale : R(25).' }] },
      hints: ['d(20) = 500 × e^(−0,8).', 'Une exponentielle est toujours positive.', '1 − 0,04p = 0 pour p = 25.'], pouce: 'e^(−0,04p) > 0, donc R′ a le signe de 1 − 0,04p : positif avant 25 €, négatif après. La recette est maximale à 25 €.', corr: '1. ≈ 225 articles. 2. d′(p) = − 20 e^(−0,04p) < 0. 3. R′ > 0 sur [0 ; 25[, R′ < 0 sur ]25 ; 60]. 4. p = 25 € ; R(25) ≈ 4 598,49 €. 5. Prix conseillé : 25 €.' })];
  chk(rnd(1000 * Math.exp(.6)) === 1822.12 && Math.round(500 * Math.exp(-1)) === 184, 'c7 p1 p3');

  c.bilan = [['Je sais calculer avec le nombre e.', ['e1', 'p1']], ['Je sais dériver eˣ et e^(kx).', ['e2', 'p2', 'p3']], ['Je sais utiliser le logarithme népérien.', ['e3']], ['Je sais résoudre eˣ = a et ln(x) = a.', ['e3', 'p2']]];
  c.words = require('./glT')('c7');
  c.plusloin = { meca: [], probs: [] };
  c.plusNote = 'programme complémentaire, poursuite d’études';
  return c;
};
