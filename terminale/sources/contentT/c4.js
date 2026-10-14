/* Chapitre 4 · Fonctions exponentielles et logarithme décimal — Terminale Bac Pro (arrêté du 3 février 2020). */
'use strict';
const K = require('./kitT');
const { rnd, H, FM, R, Q, BQ, PB, S, T, Rc, Ar, Br, st, MCVP, bl } = K;
const { SK } = require('./skT');
const { fr } = K.MCVG;
const L10 = Math.log10;

module.exports = function (chk) {
  const c = { id: 'c4', n: 4, col: 'mesure', icone: '🚀', dom: 'Algèbre-analyse · fonctions', titre: 'Fonctions exponentielles et logarithme décimal', sous: 'Croître, doubler, comparer' };
  c.parties = [{ t: 'Fonctions exponentielles x ↦ qˣ', n: [1, 2] }, { t: 'Le logarithme décimal', n: [3] }, { t: 'Équations et inéquations', n: [4, 5] }];
  c.travail = { question: `Le Livret A rapporte ${H('1,7 % par an')} depuis le 1er août 2026. Un client demande : « En combien de temps mon épargne va-t-elle doubler ? » Le logarithme répond en un seul calcul : notion 4.` };
  c.objectifs = ['Je saurai reconnaître une fonction exponentielle x ↦ qˣ et son sens de variation.', 'Je saurai utiliser les propriétés des puissances.', 'Je saurai utiliser le logarithme décimal et ses propriétés.', 'Je saurai résoudre qˣ = a et log(x) = a.', 'Je saurai résoudre une inéquation par le calcul, graphiquement ou avec un outil numérique.'];
  c.depart = 'c4';

  /* ---------- données ---------- */
  const xd = L10(2) / L10(1.017), xl = L10(2) / L10(1.025), xp = L10(.5) / L10(.85);
  chk(rnd(xd) === 41.12 && Math.pow(1.017, 41) < 2 && Math.pow(1.017, 42) > 2 && rnd(xl) === 28.07 && rnd(L10(7 / 6) / L10(1.025)) === 6.24, 'c4 doublements');
  chk(rnd(xp) === 4.27 && Math.pow(.85, 4) > .5 && Math.pow(.85, 5) < .5 && rnd(L10(158200)) === 5.2 && rnd(L10(3.2e9)) === 9.51 && rnd(L10(196.4e9)) === 11.29, 'c4 logarithmes');
  chk(rnd(1000 / 1.2, 0) === 833 && rnd(Math.pow(1.02, 10), 3) === 1.219, 'c4 exemples');

  /* ---------- méthodes visuelles ---------- */
  const ORG = MCVP.ORG, BLUE = MCVP.BLUE, RED = MCVP.RED;
  // 1. deux fonctions exponentielles
  const g1 = MCVP.plot({ W: 600, H: 300, x: [-3, 3, 1], y: [0, 8, 1], ml: 46, mt: 16, mb: 30, zeroAxes: true, lab: 'Courbes de 2 puissance x et 0,5 puissance x' });
  const v1 = S(600, 300, st(1, g1.base + g1.curve(x => Math.pow(2, x), { stroke: ORG, w: 3 }) + g1.pts([-2, -1, 0, 1, 2, 3].map(x => [x, Math.pow(2, x)]), { r: 4.4, fill: ORG }) + g1.txt(2.9, 7.6, 'y = 2ˣ : croissante', { a: 'end', fill: ORG, cls: '' }))
    + st(2, g1.curve(x => Math.pow(.5, x), { stroke: BLUE, w: 3 }) + g1.txt(-2.9, 7.6, 'y = 0,5ˣ : décroissante', { a: 'start', fill: BLUE, cls: '' }))
    + st(3, g1.dot(0, 1, { r: 6.5, fill: '#FFC233' }) + g1.txt(0, 6.3, 'q⁰ = 1 : les deux courbes passent par (0 ; 1)', { fs: 13.5 }))
    + st(4, g1.txt(0, 5.3, 'elles restent au-dessus de l’axe :', { fs: 13 }) + g1.txt(0, 4.7, 'qˣ est toujours positif', { fs: 13 })),
  'La courbe de 2 puissance x monte, celle de 0,5 puissance x descend ; elles passent toutes deux par (0 ; 1)');
  // 2. les propriétés opératoires en blocs
  const blk = (x, y, w, s, cls = 'k2', c2 = 'tx') => Rc(x, y, w, 38, { c: cls, rx: 8 }) + T(x + w / 2, y + 25, s, { fs: 16, c: c2 });
  const v2 = S(600, 270, st(1, T(20, 26, 'multiplier : on additionne les exposants', { fs: 14, a: 'start', c: 'kt' }) + blk(20, 36, 100, '1,02⁵') + T(134, 61, '×', { fs: 18 }) + blk(148, 36, 100, '1,02⁵') + T(266, 61, '=', { fs: 18 }) + blk(284, 36, 120, '1,02⁵⁺⁵', 'k', 'tw') + T(420, 61, '= 1,02¹⁰ ≈ 1,219', { fs: 15, a: 'start' }))
    + st(2, T(20, 112, 'diviser : on soustrait', { fs: 14, a: 'start', c: 'kt' }) + blk(20, 122, 100, '2⁵') + T(134, 147, '÷', { fs: 18 }) + blk(148, 122, 100, '2⁸') + T(266, 147, '=', { fs: 18 }) + blk(284, 122, 120, '2⁻³', 'k', 'tw') + T(420, 147, '= 1 ÷ 8 = 0,125', { fs: 15, a: 'start' }))
    + st(3, T(20, 198, 'puissance de puissance : on multiplie', { fs: 14, a: 'start', c: 'kt' }) + blk(20, 208, 228, '(1,06^(1/12))¹²') + T(266, 233, '=', { fs: 18 }) + blk(284, 208, 120, '1,06', 'k', 'tw'))
    + st(4, T(420, 233, '12 mois = 1 an', { fs: 15, a: 'start' })),
  'Trois règles : multiplier additionne les exposants, diviser les soustrait, une puissance de puissance les multiplie');
  // 3. la règle logarithmique (données Fevad 2025)
  const X3 = v => 40 + v * 43;
  let ruler = `<line x1="${X3(0)}" y1="150" x2="${X3(12)}" y2="150" stroke="#1D2240" stroke-width="2.4"/>`;
  for (let k = 0; k <= 12; k++) ruler += `<line x1="${X3(k)}" y1="143" x2="${X3(k)}" y2="157" stroke="#1D2240" stroke-width="1.8"/>` + T(X3(k), 176, String(k), { fs: 13 }) + (k % 3 === 0 ? T(X3(k), 196, '10' + String(k).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join(''), { fs: 12, c: 'ts' }) : '');
  const mk = (v, lab, y, col) => `<circle cx="${X3(v).toFixed(1)}" cy="150" r="7" fill="${col}"/>` + `<line x1="${X3(v).toFixed(1)}" y1="143" x2="${X3(v).toFixed(1)}" y2="${y + 8}" stroke="${col}" stroke-width="1.6"/>` + T(X3(v), y, lab, { fs: 13, fill: col });
  const v3 = S(600, 270, st(1, ruler + T(300, 226, 'chaque graduation multiplie par 10 : c’est la règle des logarithmes', { fs: 13, c: 'ts' }))
    + st(2, mk(L10(62), '62 € (panier)', 112, BLUE) + mk(L10(158200), '158 200 sites', 72, ORG))
    + st(3, mk(L10(3.2e9), '3,2 milliards d’achats', 112, RED) + mk(L10(196.4e9), '196,4 Md€', 72, '#7438C0'))
    + st(4, T(300, 30, 'log(158 200) ≈ 5,20 · log(3,2 × 10⁹) ≈ 9,51 · log(196,4 × 10⁹) ≈ 11,29', { fs: 13.5, c: 'kt' }) + T(300, 254, 'source : Fevad, bilan du commerce en ligne 2025', { fs: 11, c: 'ts' })),
  'Une règle graduée de 0 à 12 : chaque nombre est placé à la hauteur de son logarithme');
  // 4. le temps de doublement du Livret A
  const g4 = MCVP.plot({ W: 600, H: 300, x: [0, 50, 5], y: [.8, 2.4, .2], ml: 50, mt: 16, mb: 34, xl: 'années', yl: 'coefficient 1,017ˣ', lab: 'Coefficient multiplicateur d’un capital au Livret A' });
  const v4 = S(600, 300, st(1, g4.base + g4.curve(x => Math.pow(1.017, x), { stroke: ORG, w: 3 }) + T(300, 297, 'l’axe vertical commence à 0,8', { fs: 11, c: 'ts' }))
    + st(2, g4.seg(0, 2, 50, 2, { stroke: RED, dash: '8 5', w: 2 }) + g4.txt(1, 2.06, 'capital doublé : 1,017ˣ = 2', { a: 'start', fill: RED, cls: '' }))
    + st(3, g4.guide(xd, 2) + g4.dot(xd, 2, { r: 6, fill: '#FFC233' }) + g4.txt(xd, .86, 'x ≈ 41,12', { fs: 13, dx: 4, a: 'start' }))
    + st(4, `<rect x="66" y="${g4.Y(1.82)}" width="280" height="54" rx="10" class="k2 ks" stroke-width="2"/>` + T(206, g4.Y(1.82) + 22, 'x = log(2) ÷ log(1,017) ≈ 41,12', { fs: 14 }) + T(206, g4.Y(1.82) + 44, 'intérêts annuels : 42 ans', { fs: 14, c: 'kt' })),
  'La courbe du coefficient croise la droite y = 2 en x ≈ 41,12');
  // 5. une inéquation : la valeur d’un téléphone sous la moitié de son prix
  const g5 = MCVP.plot({ W: 600, H: 290, x: [0, 10, 1], y: [0, 700, 100], ml: 50, mt: 16, mb: 34, xl: 'années', yl: 'valeur (€)', lab: 'Valeur d’un téléphone de 600 € qui perd 15 % par an' });
  const v5 = S(600, 290, st(1, g5.base + g5.curve(x => 600 * Math.pow(.85, x), { stroke: BLUE, w: 3 }) + g5.pts([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(x => [x, 600 * Math.pow(.85, x)]), { r: 3.8, fill: BLUE }))
    + st(2, g5.seg(0, 300, 10, 300, { stroke: RED, dash: '8 5', w: 2 }) + g5.txt(9.9, 320, 'moitié du prix : 300 €', { a: 'end', fill: RED, cls: '' }))
    + st(3, g5.band(xp, 10, { fill: '#FFC233', op: .25 }) + g5.dot(xp, 300, { r: 6, fill: '#FFC233' }) + g5.txt(xp, 660, 'x > 4,27', { fs: 14, dx: 8, a: 'start' }))
    + st(4, g5.txt(9.9, 560, '0,85⁴ ≈ 0,52 et 0,85⁵ ≈ 0,44 : la 5e année', { a: 'end', fs: 13 })),
  'La courbe passe sous la droite y = 300 après x ≈ 4,27 : la zone jaune contient les solutions');

  c.notions = [
    { titre: 'La fonction exponentielle x ↦ qˣ', decouvre: { txt: `Le compte d’une boutique sur un réseau social (entreprise fictive) a ${H('1 000 abonnés')} et en gagne ${H('20 %')} par mois. Au bout de x mois, il en a f(x) = 1 000 × 1,2ˣ. Que vaut f(0) ? Et f(− 1), il y a un mois ?`, img: SK.reseau() },
      comprends: `<p>Soit q un nombre strictement positif et différent de 1. La fonction x ↦ qˣ est la <b>fonction exponentielle</b> de base q. Elle est définie pour tout nombre réel x, même négatif ou décimal.</p><p>Pour tout q, q⁰ = 1 : toutes les courbes passent par le point (0 ; 1). Et qˣ est toujours strictement positif.</p><p>Si <b>q &gt; 1</b>, la fonction est <b>croissante</b> : c’est une hausse à taux fixe. Si <b>0 &lt; q &lt; 1</b>, elle est <b>décroissante</b> : c’est une baisse à taux fixe.</p><p>Pour la boutique : f(0) = 1 000 × 1 = 1 000. Et f(− 1) = 1 000 × 1,2⁻¹ ≈ 833 : il y avait environ 833 abonnés il y a un mois.</p>`,
      vois: v1, voisLeg: 'Orange : y = 2ˣ monte. Bleu : y = 0,5ˣ descend. Les deux courbes passent par (0 ; 1) et ne touchent jamais l’axe horizontal.',
      retiens: `<p>${FM(R`x\mapsto q^x`)} avec q &gt; 0 et q ≠ 1 · ${FM(R`q^0=1`)} · ${FM(R`q^x>0`)}</p><p>q &gt; 1 : croissante · 0 &lt; q &lt; 1 : décroissante.</p>`,
      exemple: `<p>2³ = 8 ; 2⁻¹ = <b>0,5</b> ; 0,5² = 0,25.</p><p>f(− 1) = 1 000 ÷ 1,2 ≈ <b>833</b>.</p>`,
      wide: K.rais('« pour tout » et « il existe »', `<p>« <b>Pour tout</b> réel x, 2ˣ &gt; 0 » : la phrase est vraie pour tous les x, sans exception. « <b>Il existe</b> un réel x tel que 2ˣ = 8 » : il suffit d’un exemple, x = 3. Pour contredire une phrase « pour tout », un seul contre-exemple suffit.</p>`),
      attention: '2⁻¹ n’est pas un nombre négatif : 2⁻¹ = 1 ÷ 2 = 0,5. Une fonction exponentielle ne prend que des valeurs positives.', astuce: { k: 'verif', t: 'Contrôle toujours f(0) : c’est la valeur de départ, ici 1 000 abonnés.' } },
    { titre: 'Les propriétés opératoires', decouvre: { txt: `Un prix augmente de ${H('2 %')} par an pendant ${H('5 ans')}, puis encore ${H('5 ans')}. Le coefficient global est-il 1,02⁵ + 1,02⁵, ou 1,02⁵ × 1,02⁵ ?`, img: SK.puissances() },
      comprends: `<p>Les puissances d’un même nombre q suivent des règles simples. Elles valent pour tous les exposants, entiers ou non. Elles servent à regrouper plusieurs périodes, ou à passer d’une période à une autre.</p><p>Pour multiplier, on <b>additionne</b> les exposants : qᵃ × qᵇ = qᵃ⁺ᵇ. Deux fois cinq ans à + 2 % donnent 1,02⁵ × 1,02⁵ = 1,02¹⁰.</p><p>Pour diviser, on <b>soustrait</b> : qᵃ ÷ qᵇ = qᵃ⁻ᵇ. En particulier, q⁻ᵃ = 1 ÷ qᵃ.</p><p>Pour une puissance de puissance, on <b>multiplie</b> : (qᵃ)ᵇ = qᵃˣᵇ. Ainsi (1,06<sup>1/12</sup>)¹² = 1,06 : douze mois au taux équivalent donnent un an, comme au chapitre 2.</p>`,
      vois: v2, voisLeg: 'Chaque ligne montre une règle : additionner, soustraire ou multiplier les exposants. La dernière relie le taux mensuel équivalent et le taux annuel.',
      retiens: `<p>${FM(R`q^a\times q^b=q^{a+b} \qquad \dfrac{q^a}{q^b}=q^{a-b}`)}</p><p>${FM(R`(q^a)^b=q^{a\times b} \qquad q^{-a}=\dfrac{1}{q^a}`)}</p>`,
      exemple: `<p>1,02⁵ × 1,02⁵ = 1,02¹⁰ ≈ <b>1,219</b> : + 21,9 % en 10 ans.</p><p>2⁻³ = 1 ÷ 8 = <b>0,125</b>.</p>`,
      attention: '1,02⁵ × 1,02⁵ n’est pas 1,02²⁵ : on additionne les exposants, on ne les multiplie pas.', astuce: { k: 'vite', t: 'Pour vérifier une règle, teste-la avec q = 2 : 2² × 2³ = 4 × 8 = 32 = 2⁵.' } },
    { titre: 'Le logarithme décimal', decouvre: { txt: `En 2025, selon la Fevad, il y a eu ${H('3,2 milliards')} d’achats en ligne en France, sur ${H('158 200')} sites marchands actifs. Comment comparer des nombres aussi différents ?`, img: SK.regleLog() },
      comprends: `<p>Pour un nombre b strictement positif, le <b>logarithme décimal</b> de b, noté log(b), est la solution de l’équation 10ˣ = b. C’est l’exposant qu’il faut donner à 10 pour obtenir b.</p><p>Ainsi log(1 000) = 3, log(1) = 0 et log(0,01) = − 2. La touche log de la calculatrice donne les autres valeurs : log(158 200) ≈ 5,20 et log(3,2 milliards) ≈ 9,51. L’écart est d’environ 4 : un rapport d’environ 10⁴.</p><p>La fonction log est <b>croissante</b> sur ]0 ; + ∞[. Elle transforme les produits en sommes : log(a × b) = log(a) + log(b). Et log(aⁿ) = n × log(a).</p>`,
      vois: v3, voisLeg: 'Sur cette règle, avancer d’une graduation, c’est multiplier par 10. Les chiffres du commerce en ligne s’y placent tous, du panier moyen au chiffre d’affaires.',
      retiens: `<p>${FM(R`\log(b)=x \iff 10^x=b`)} (b &gt; 0) · ${FM(R`\log(10^n)=n`)}</p><p>${FM(R`\log(ab)=\log a+\log b \quad \log\dfrac{a}{b}=\log a-\log b \quad \log(a^n)=n\log a`)}</p>`,
      exemple: `<p>log(1 000 000) = <b>6</b>.</p><p>log(2) + log(5) = log(10) = <b>1</b>.</p>`,
      attention: 'log(a + b) n’est pas log(a) + log(b) : la règle concerne les produits. Et log(b) n’existe que pour b &gt; 0.', astuce: { k: 'og', t: 'La partie entière de log(b) donne le nombre de chiffres moins 1 : log(158 200) ≈ 5,2 et 158 200 a 6 chiffres.' } },
    { titre: 'Résoudre qˣ = a', decouvre: { txt: `Le Livret A rapporte ${H('1,7 %')} par an depuis le 1er août 2026. Si ce taux restait le même, en combien d’années un capital doublerait-il ?`, img: SK.doubler() },
      comprends: `<p>On cherche x tel que 1,017ˣ = 2. On prend le logarithme des deux membres : log(1,017ˣ) = log(2), soit x × log(1,017) = log(2).</p><p>Donc x = log(2) ÷ log(1,017) ≈ 41,12. En général, pour q &gt; 0, q ≠ 1 et a &gt; 0 : qˣ = a équivaut à x = log(a) ÷ log(q).</p><p>Les intérêts du Livret A sont ajoutés une fois par an. Le capital a donc doublé au bout de <b>42 ans</b> : c’est la première année entière après 41,12.</p><p>Au chapitre 2, on cherchait la durée année par année. Le logarithme donne la réponse en un calcul : log(7/6) ÷ log(1,025) ≈ 6,24, donc 7 ans.</p>`,
      vois: v4, voisLeg: 'La courbe orange est le coefficient 1,017ˣ. Elle croise la droite rouge y = 2 en x ≈ 41,12 : le capital double en un peu plus de 41 ans.',
      retiens: `<p>${FM(R`q^x=a \iff x=\dfrac{\log a}{\log q}`)} (q &gt; 0, q ≠ 1, a &gt; 0)</p><p>${FM(R`10^x=b \iff x=\log b`)}</p>`,
      exemple: `<p>1,017ˣ = 2 : x ≈ 41,12, soit <b>42 ans</b>.</p><p>LEP à 2,5 % : log(2) ÷ log(1,025) ≈ 28,07, soit <b>29 ans</b>.</p>`,
      wide: K.prog('vérifier par une boucle', 'La boucle compte les années tant que le coefficient reste sous 2.', `coef = 1\nn = 0\nwhile coef < 2:\n    coef = coef * 1.017\n    n = n + 1\nprint(n)    # affiche 42`, `<p class="prog-q">Le programme et le calcul avec log donnent-ils la même réponse ? ${bl(30, 'oui : 42 ans')} Que changer pour le LEP à 2,5 % ? ${bl(36, 'remplacer 1.017 par 1.025')}</p>`),
      attention: 'log(2) ÷ log(1,017) n’est pas log(2 ÷ 1,017) : on divise les deux logarithmes.', astuce: { k: 'og', t: 'Règle de 72 : 72 ÷ 1,7 ≈ 42. Elle estime vite le temps de doublement d’un placement.' } },
    { titre: 'Équation log(x) = a et inéquations', decouvre: { txt: `Un téléphone vaut ${H('600 €')} et perd ${H('15 %')} de sa valeur par an. À partir de quand vaut-il moins de la ${H('moitié')} de son prix ?`, img: SK.phone() },
      comprends: `<p>Pour l’équation log(x) = a, on revient à la définition : x = 10ᵃ. Par exemple, log(x) = 2 donne x = 100.</p><p>Pour une <b>inéquation</b>, on cherche toutes les solutions. Le téléphone vaut 600 × 0,85ˣ, et l’on veut 0,85ˣ &lt; 0,5.</p><p>On prend le logarithme : x × log(0,85) &lt; log(0,5). Or log(0,85) est <b>négatif</b> : en divisant par ce nombre, on <b>change le sens</b> de l’inégalité. On obtient x &gt; log(0,5) ÷ log(0,85) ≈ 4,27.</p><p>La valeur passe sous 300 € pendant la 5e année. On le vérifie sur la courbe ou au tableur : 0,85⁴ ≈ 0,52 et 0,85⁵ ≈ 0,44.</p>`,
      vois: v5, voisLeg: 'La zone jaune contient les années où la courbe est sous la droite des 300 € : x &gt; 4,27.',
      retiens: `<p>${FM(R`\log x=a \iff x=10^a`)}</p><p>Si q &gt; 1 : ${FM(R`q^x\ge a \iff x\ge \dfrac{\log a}{\log q}`)} · si 0 &lt; q &lt; 1, le sens change : ${FM(R`q^x\le a \iff x\ge \dfrac{\log a}{\log q}`)}</p>`,
      exemple: `<p>log(x) = − 1 : x = <b>0,1</b>.</p><p>0,85ˣ &lt; 0,5 : <b>x &gt; 4,27</b>.</p>`,
      wide: K.rais('le sens d’une inégalité', `<p>Multiplier ou diviser les deux membres d’une inégalité par un nombre <b>négatif</b> change son sens : 2 &lt; 3, mais − 2 &gt; − 3. Or log(q) est négatif dès que 0 &lt; q &lt; 1. Avant de diviser par log(q), regarde son signe.</p>`),
      attention: 'log(0,85) ≈ − 0,07 est négatif : sans changer le sens, on trouverait x < 4,27, ce qui est faux.', astuce: { k: 'verif', t: 'Teste une valeur : x = 5 donne 600 × 0,85⁵ ≈ 266 €, bien moins que 300 € ✓.' } }];

  c.mots = [['fonction exponentielle', 'fonction x ↦ qˣ, avec q > 0 et q ≠ 1', 'L’audience suit une fonction exponentielle.'], ['base q', 'nombre que l’on élève à la puissance x', 'La base est 1,2 : + 20 % par mois.'], ['exposant négatif', 'q⁻ᵃ = 1 ÷ qᵃ', '1,2⁻¹ correspond à un mois plus tôt.'], ['propriétés opératoires', 'règles de calcul sur les puissances', 'On additionne les exposants pour multiplier.'], ['logarithme décimal', 'log(b) : l’exposant x tel que 10ˣ = b', 'log(1 000) = 3.'], ['ordre de grandeur', 'puissance de 10 la plus proche', 'Il y a environ 10⁵ sites marchands.'], ['temps de doublement', 'durée pour qu’une grandeur double', 'Au Livret A, le temps de doublement est de 42 ans.'], ['inéquation', 'inégalité dont on cherche toutes les solutions', 'L’inéquation 0,85ˣ < 0,5 a pour solutions x > 4,27.']];

  /* ---------- exercices résolus ---------- */
  const xa = L10(4) / L10(1.08);
  chk(rnd(xa) === 18.01 && 5000 * Math.pow(1.08, 18) < 20000 && 5000 * Math.pow(1.08, 19) > 20000 && Math.pow(1.025, 28) < 2 && Math.pow(1.025, 29) > 2, 'c4 résolus');
  c.resolus = [
    { titre: 'Le temps de doublement d’un LEP', outil: '🧮 calculatrice', enonce: `Le LEP rapporte ${H('2,5 %')} par an (taux au 1er août 2026), intérêts ajoutés une fois par an. Au bout de combien d’années un capital aura-t-il doublé, si le taux ne change pas ?`,
      rows: [['1,025ˣ = 2', 'Doubler : le coefficient global vaut 2.'], ['x × log(1,025) = log(2)', 'On prend le logarithme des deux membres.'], ['x = log(2) ÷ log(1,025) ≈ <b>28,07</b>', 'On divise par log(1,025), qui est positif.'], ['intérêts annuels : <b>29 ans</b>', 'On prend l’entier supérieur.']], verif: '1,025²⁸ ≈ 1,996 &lt; 2 et 1,025²⁹ ≈ 2,046 ≥ 2 ✓.', rep: 'Le capital aura doublé au bout de 29 ans.', go: ['e3'] },
    { titre: 'À toi : quand l’audience quadruple-t-elle ?', outil: '🧮 calculatrice', enonce: `Un compte professionnel (fictif) a ${H('5 000 abonnés')} et en gagne ${H('8 %')} par mois. Au bout de combien de mois en aura-t-il au moins ${H('20 000')} ?`, trous: [0, 1, 2, 3],
      rows: [['5 000 × 1,08ˣ ≥ 20 000, soit 1,08ˣ ≥ ⟦4⟧', 'On divise par 5 000.'], ['x × log(1,08) ≥ log(4)', 'On prend le logarithme ; log(1,08) &gt; 0.'], ['x ≥ log(4) ÷ log(1,08) ≈ ⟦18,01⟧', 'Le sens ne change pas.'], ['réponse : ⟦19⟧ mois', 'On prend l’entier supérieur.']], verif: '5 000 × 1,08¹⁸ ≈ 19 980 &lt; 20 000, et 5 000 × 1,08¹⁹ ≈ 21 579 ✓.', rep: 'Le compte dépasse 20 000 abonnés au bout de 19 mois.', go: ['e1', 'e2'] }];
  c.entraine = [{ id: 'e1', gen: 'c4e1', lc: 1 }, { id: 'e2', gen: 'c4e2', lc: 2 }, { id: 'e3', gen: 'c4e3', lc: 4 }];

  /* ---------- je résous ---------- */
  const fv = x => 2000 * Math.pow(1.1, x), ab = x => 12 * Math.pow(1.05, x), V = x => 4000 * Math.pow(.9, x);
  chk(rnd(fv(3)) === 2662 && rnd(fv(-2)) === 1652.89 && rnd(ab(3)) === 13.89 && rnd(L10(1.5) / L10(1.05)) === 8.31 && ab(8) < 18 && ab(9) > 18, 'c4 p1 p2');
  chk(Math.round(V(6)) === 2126 && rnd(L10(.5) / L10(.9)) === 6.58 && rnd(L10(.25) / L10(.9)) === 13.16 && V(13) > 1000 && V(14) < 1000, 'c4 p3');
  c.probs = [
    PB({ id: 'p1', etape: 2, lc: 1, comps: ['app', 'rea'], titre: 'Les visiteurs d’un site',
      intro: `<p>Un site de vente (entreprise fictive) reçoit ${H('2 000 visiteurs')} par jour ce mois-ci. Ce nombre augmente de ${H('10 %')} par mois. Au bout de x mois, il y aura f(x) = 2 000 × 1,1ˣ visiteurs par jour.</p>`,
      qs: [Q('a.', 'Calcule f(0). Que représente ce nombre ?', '2 000 : les visiteurs de ce mois-ci', 2000, { w: 24 }), Q('b.', 'Calcule f(3).', '2 000 × 1,1³ = 2 662', 2662, { w: 24 }), Q('c.', 'Calcule f(− 2), au centième. Que représente ce nombre ?', '2 000 × 1,1⁻² ≈ 1 652,89 : les visiteurs il y a deux mois', 1652.89, { w: 26 }), Q('d.', 'La fonction f est-elle croissante ? Justifie.', 'Oui : sa base 1,1 est plus grande que 1.', null, { lines: 2 })],
      err: { 1: [{ v: 2600, m: '1,1³ n’est pas 1,3 : 1,1³ = 1,1 × 1,1 × 1,1 = 1,331.' }], 2: [{ v: -2420, m: 'Un exposant négatif ne rend pas le résultat négatif : 1,1⁻² = 1 ÷ 1,1².' }, { v: 2420, m: '1,1⁻² = 1 ÷ 1,1² : on divise, on ne multiplie pas.' }] },
      hints: ['f(0) : tout nombre à la puissance 0 vaut 1.', '1,1⁻² = 1 ÷ 1,1².', 'Base plus grande que 1 : la fonction est croissante.'], pouce: 'f(0) = 2 000 × 1. Pour f(− 2), divise 2 000 par 1,1².', corr: 'a. 2 000, les visiteurs de ce mois. b. 2 662. c. ≈ 1 652,89, il y a deux mois. d. Oui, car 1,1 > 1.' }),
    PB({ id: 'p2', etape: 3, lc: 4, defi: 4, bulle: 'Ce cas se fait en 4 étapes. Ramène l’inéquation à la forme qˣ ≥ a, puis utilise le logarithme : log(1,05) est positif, le sens ne change pas.', autravail: { comp: 'com', txt: 'prévenir un client de l’évolution du prix de son abonnement.' }, comps: ['ana', 'rea', 'com'], titre: 'Un abonnement qui augmente',
      intro: `<p>Un service d’abonnement (entreprise fictive) coûte ${H('12 € par mois')}. Son prix augmente de ${H('5 % par an')}. Au bout de x années, il coûtera p(x) = 12 × 1,05ˣ euros par mois.</p>`,
      qs: [Q('a.', 'Calcule le prix mensuel dans 3 ans, au centime.', '12 × 1,05³ ≈ 13,89 €', 13.89, { w: 24 }), Q('b.', 'Montre que p(x) ≥ 18 revient à 1,05ˣ ≥ 1,5.', 'On divise les deux membres par 12 : 18 ÷ 12 = 1,5.', null, { lines: 1 }), Q('c.', 'Résous 1,05ˣ ≥ 1,5. Donne la borne au centième.', 'x ≥ log(1,5) ÷ log(1,05) ≈ 8,31', 8.31, { w: 22 }), Q('d.', 'Annonce au client à partir de quelle année le prix dépassera 18 € par mois.', 'Au bout de 9 ans, le prix dépassera 18 € par mois.', null, { lines: 2 })],
      err: { 0: [{ v: 13.8, m: 'Tu as ajouté 3 × 5 %. Une hausse de 5 % par an se compose : 1,05³.' }], 2: [{ v: rnd(1.5 / 1.05, 2), m: 'On ne divise pas 1,5 par 1,05 : on divise log(1,5) par log(1,05).' }] },
      hints: ['p(3) = 12 × 1,05³.', 'Divise les deux membres de 12 × 1,05ˣ ≥ 18 par 12.', 'x ≥ log(1,5) ÷ log(1,05) ; puis l’entier supérieur.'], pouce: 'p(x) ≥ 18 ⟺ 1,05ˣ ≥ 1,5 ⟺ x ≥ log(1,5) ÷ log(1,05) ≈ 8,31 : il faut 9 ans.', corr: 'a. ≈ 13,89 €. b. On divise par 12. c. x ≥ 8,31. d. Au bout de 9 ans, le prix dépassera 18 € par mois.' }),
    PB({ id: 'p3', etape: 4, lc: 5, cls: 'bac', defi: 5, bulle: 'Voici une question de « vers le bac » : 5 étapes. Les ventes baissent de 10 % par mois : la base est 0,9, plus petite que 1. Pense au sens de l’inégalité. Une question ratée ne fait pas un exercice raté : continue.', autravail: { comp: 'ana', txt: 'décider quand retirer un produit de la vente, en s’appuyant sur une prévision chiffrée.' }, comps: ['rea', 'val', 'ana', 'com'], titre: 'La fin de série d’un téléphone',
      intro: `<p>Quand un nouveau modèle sort, un magasin vend encore ${H('4 000')} exemplaires par mois de l’ancien modèle. Ces ventes baissent ensuite de ${H('10 % par mois')}. On modélise les ventes mensuelles, x mois après la sortie, par V(x) = 4 000 × 0,9ˣ.</p>`,
      qs: [BQ('1', 'Calculer V(6), arrondi à l’unité.', 'rea', '4 000 × 0,9⁶ ≈ 2 126', 2126, { w: 24, tol: .6 }), BQ('2', 'Justifier le sens de variation de V.', 'val', 'V est décroissante : 4 000 > 0 et la base 0,9 est comprise entre 0 et 1.', null, { lines: 2 }), BQ('3', 'Résoudre V(x) = 2 000 par le calcul. Arrondir au centième.', 'rea', '0,9ˣ = 0,5 donc x = log(0,5) ÷ log(0,9) ≈ 6,58', 6.58, { w: 22 }), BQ('4', 'Le magasin arrête la vente quand les ventes passent sous 1 000 par mois. Résoudre V(x) < 1 000.', 'ana', '0,9ˣ < 0,25 ; log(0,9) < 0 donc x > log(0,25) ÷ log(0,9) ≈ 13,16', 13.16, { w: 22 }), BQ('5', 'Contrôler avec un tableur, puis annoncer au responsable le mois de l’arrêt.', 'com', 'V(13) ≈ 1 017 et V(14) ≈ 915 : arrêt au 14e mois.', null, { lines: 2 })],
      err: { 0: [{ v: 1600, m: 'Une baisse de 10 % par mois pendant 6 mois n’est pas une baisse de 60 % : calcule 0,9⁶.' }], 3: [{ v: -13.16, m: 'log(0,25) et log(0,9) sont tous deux négatifs : leur quotient est positif.' }] },
      hints: ['V(6) = 4 000 × 0,9⁶.', 'V(x) = 2 000 revient à 0,9ˣ = 0,5.', 'log(0,9) est négatif : en divisant, le sens de l’inégalité change.'], pouce: 'Divise par 4 000, puis prends le logarithme. Comme log(0,9) < 0, l’inégalité change de sens.', corr: '1. ≈ 2 126. 2. Décroissante : 0 < 0,9 < 1. 3. x ≈ 6,58. 4. x > 13,16. 5. V(13) ≈ 1 017 et V(14) ≈ 915 : on arrête au 14e mois.' })];

  c.bilan = [['Je sais reconnaître une fonction exponentielle et son sens de variation.', ['e1', 'p1']], ['Je sais utiliser les propriétés des puissances.', ['e2']], ['Je sais utiliser le logarithme décimal.', ['e2', 'e3']], ['Je sais résoudre qˣ = a et log(x) = a.', ['e3', 'p2']], ['Je sais résoudre une inéquation.', ['p2', 'p3']]];
  c.words = require('./glT')('c4');
  c.plusloin = { meca: [], probs: [] };
  return c;
};
