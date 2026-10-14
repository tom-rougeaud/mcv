/* Chapitre 1 · Calculs commerciaux et financiers — 1re Bac Pro (arrêté du 3 février 2020, BO spécial n° 1 du 6 février 2020). */
'use strict';
const K = require('./kit1');
const { rnd, H, FM, R, Q, BQ, PB, prog, S, T, Rc, Ln, Ar, Br, st, Sketch, MCVP, bl } = K;
const { SK } = require('./sk1');
/* accolade horizontale avec son texte dessous */
const acco = (x1, x2, y, lab, fs = 15) => `<path d="M${x1} ${y}v7h${x2 - x1}v-7" fill="none" class="ks" stroke-width="2"/>` + T((x1 + x2) / 2, y + 28, lab, { fs, c: 'kt' });
const HACH = `<defs><pattern id="hh1" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#FFF0B8"/><line x1="0" y1="0" x2="0" y2="7" stroke="#B88A00" stroke-width="2.4"/></pattern></defs>`;

module.exports = function (chk) {
  const c = { id: 'c1', n: 1, col: 'nombre', icone: '💶', dom: 'Algèbre-analyse · calculs commerciaux et financiers', titre: 'Calculs commerciaux et financiers', sous: 'Coûts, résultat et intérêts' };
  c.parties = [{ t: 'Coûts et résultat', n: [1, 2] }, { t: 'Intérêts simples', n: [3, 4] }];
  c.travail = { question: `Mia fabrique des bougies. Chaque mois, elle paie ${H('600 € de charges fixes')}, puis ${H('4 €')} par bougie fabriquée. Elle vend chaque bougie ${H('12 € HT')}. Si elle en vend ${H('100')}, que lui reste-t-il à la fin du mois ? Tu sauras répondre dès la première leçon, et trouver le seuil de rentabilité au chapitre 2.` };
  c.objectifs = ['Je saurai calculer un coût total, une recette et un résultat.', 'Je saurai calculer un coût moyen et un coût marginal.', 'Je saurai calculer des intérêts simples.', 'Je saurai passer d’un taux annuel à un taux mensuel, par quinzaine ou par jour.'];
  c.depart = 'c1';

  /* ---------- données du fil rouge : Atelier Mia (entreprise fictive) ---------- */
  const cf = 600, cv = 4, p = 12;
  const C = q => cf + cv * q, Rec = q => p * q, B = q => Rec(q) - C(q);
  chk(C(100) === 1000 && Rec(100) === 1200 && B(100) === 200 && C(101) - C(100) === 4 && C(100) / 100 === 10, 'c1 données de Mia');

  /* ---------- méthodes visuelles ---------- */
  // 1. la pile de 100 bougies : fixe + variable + résultat = recette
  const k = 500 / 1200, x0 = 50;
  const pile = S(600, 268, st(1, Rc(x0, 40, cf * k, 40, { c: 'k2', rx: 3 }) + T(x0 + cf * k / 2, 66, 'fixes 600 €', { fs: 14 }) + T(300, 24, 'q = 100 bougies vendues', { fs: 14, c: 'ts' }))
    + st(2, Rc(x0 + cf * k, 40, 400 * k, 40, { c: 'k', rx: 3 }) + T(x0 + (cf + 200) * k, 66, 'variable 400 €', { fs: 14, c: 'tw' }) + acco(x0, x0 + 1000 * k, 86, 'coût total C(100) = 1 000 €'))
    + st(3, Rc(x0, 150, 1200 * k, 40, { c: 'wh', rx: 3 }) + T(x0 + 600 * k, 176, 'recette R(100) = 12 × 100 = 1 200 €', { fs: 14 }))
    + st(4, HACH + `<rect x="${x0 + 1000 * k}" y="150" width="${200 * k}" height="40" rx="3" fill="url(#hh1)" stroke="#B88A00" stroke-width="2"/>` + acco(x0 + 1000 * k, x0 + 1200 * k, 196, 'résultat 200 €') + T(300, 256, 'résultat = recette − coût total = 1 200 − 1 000 = 200 €', { fs: 15, c: 'kt' })),
  'Les barres : charges fixes, coût variable, coût total, recette et résultat pour 100 bougies');
  // 2. coût moyen et coût marginal : CM(q) pour 25, 50, 100, 200, 400 bougies
  const qs = [25, 50, 100, 200, 400], cms = qs.map(q => C(q) / q);
  chk(cms.join() === '28,16,10,7,5.5', 'c1 coûts moyens');
  const g2 = MCVP.plot({ W: 600, H: 290, x: [0, 5, 1], y: [0, 35, 5], xt: qs.map((q, i) => [i + .5, String(q)]), ml: 52, mr: 118, mt: 22, mb: 44, xl: '', yl: 'coût moyen (€)', lab: 'Coût moyen pour 25, 50, 100, 200 et 400 bougies' });
  const bars = cms.map((v, i) => `<rect x="${g2.X(i + .12).toFixed(1)}" y="${g2.Y(v).toFixed(1)}" width="${(g2.X(i + .88) - g2.X(i + .12)).toFixed(1)}" height="${(g2.Y(0) - g2.Y(v)).toFixed(1)}" class="k2 ks" stroke-width="2"/>` + T(g2.X(i + .5), g2.Y(v) - 6, String(v).replace('.', ',') + ' €', { fs: 13 })).join('');
  const moyen = S(600, 290, st(1, g2.base + T(g2.X(2.5), 282, 'nombre de bougies fabriquées', { fs: 12, c: 'ts' }))
    + st(2, bars)
    + st(3, `<line x1="${g2.X(0)}" y1="${g2.Y(4)}" x2="${g2.X(5)}" y2="${g2.Y(4)}" stroke="#C2332A" stroke-width="2.6" stroke-dasharray="8 5"/>` + T(g2.X(5) + 6, g2.Y(4) + 4, 'coût marginal', { fs: 13, a: 'start', fill: '#C2332A' }) + T(g2.X(5) + 6, g2.Y(4) + 20, '= 4 €', { fs: 13, a: 'start', fill: '#C2332A' }))
    + st(4, T(g2.X(3.3), g2.Y(26), 'le coût moyen diminue,', { fs: 14, c: 'kt' }) + T(g2.X(3.3), g2.Y(26) + 18, 'mais reste au-dessus de 4 €', { fs: 14, c: 'kt' })),
  'Le coût moyen diminue quand on fabrique plus de bougies, mais reste au-dessus du coût marginal');
  // 3. la valeur d’un capital placé à intérêts simples : droite
  const g3 = MCVP.plot({ W: 600, H: 290, x: [0, 4, 1], y: [1900, 2300, 100], ml: 62, mb: 40, xl: 'années', yl: 'valeur acquise (€)', lab: 'Valeur d’un capital de 2 000 € placé à 3 % en intérêts simples' });
  const V = n => 2000 + 60 * n;
  const interets = S(600, 290, st(1, g3.base + g3.pts([[0, 2000]]) + g3.txt(0, 2000, '2 000 €', { dx: 16, dy: -16, a: 'start' }) + T(300, 283, 'l’axe vertical commence à 1 900 €', { fs: 11, c: 'ts' }))
    + st(2, g3.line(60, 2000, { stroke: '#1D5FC2' }) + g3.pts([[1, V(1)], [2, V(2)], [3, V(3)], [4, V(4)]]) + g3.txt(2, V(2), '+ 60 € chaque année', { dx: -8, dy: 26, a: 'middle' }))
    + st(3, g3.guide(.5, V(.5)) + g3.dot(.5, V(.5), { lab: '6 mois : 2 030 €', dx: 12, dy: 26 }))
    + st(4, g3.txt(3.9, 1960, 'I = C × t × n', { a: 'end', fs: 15 })),
  'Les intérêts simples augmentent de 60 € par an : les points sont alignés');
  chk(V(.5) === 2030 && 2000 * .03 * .5 === 30, 'c1 intérêts simples');
  // 4. l’échelle des taux
  const lad = (y, lab, val, op) => Rc(150, y, 300, 40, { c: 'k2', rx: 8 }) + T(300, y + 26, `${lab} : ${val}`, { fs: 15 });
  const ech = S(600, 300, st(1, lad(14, 'taux annuel', '3 %')) + st(2, Ar(300, 56, 300, 86, { w: 3, lab: '÷ 12', dx: 34, dy: 6 }) + lad(88, 'taux mensuel', '0,25 %'))
    + st(3, Ar(300, 130, 300, 160, { w: 3, lab: '÷ 2', dx: 34, dy: 6 }) + lad(162, 'par quinzaine', '0,125 %'))
    + st(4, `<path d="M456 34H540V260H456" fill="none" class="ks" stroke-width="2.4" stroke-dasharray="6 4"/>` + T(498, 150, '÷ 360', { fs: 15, c: 'kt' }) + lad(236, 'taux journalier', '≈ 0,0083 %').replace('x="150"', 'x="150"') + T(300, 292, '1 an = 12 mois = 24 quinzaines = 360 jours (année commerciale)', { fs: 13, c: 'ts' })),
  'De 3 % par an à 0,25 % par mois, 0,125 % par quinzaine et 0,0083 % par jour');
  chk(rnd(3 / 12, 4) === .25 && rnd(3 / 24, 4) === .125 && rnd(3 / 360, 4) === .0083, 'c1 taux');

  c.notions = [
    { titre: 'Coût total, recette et résultat', decouvre: { txt: `Mia a ${H('600 € de charges fixes')} par mois. Chaque bougie lui coûte ${H('4 €')} à fabriquer et elle la vend ${H('12 €')}. Combien lui reste-t-il si elle vend ${H('100 bougies')} ?`, img: SK.bougies() },
      comprends: `<p>Une entreprise a deux sortes de coûts. Les <b>coûts fixes</b> ne dépendent pas du nombre d’articles : le loyer, l’abonnement internet. Les <b>coûts variables</b> augmentent avec le nombre d’articles : la cire, les pots, les mèches.</p><p>Le <b>coût total</b> additionne les deux. Si q est le nombre de bougies, on note C(q) ce coût : C(q) = coûts fixes + coût d’une bougie × q.</p><p>La <b>recette</b> est l’argent encaissé : R(q) = prix de vente × q. Le <b>résultat</b> est ce qui reste : B(q) = R(q) − C(q). Positif, c’est un <b>bénéfice</b>. Négatif, c’est une <b>perte</b>.</p><p>Pour 100 bougies : C(100) = 600 + 4 × 100 = 1 000 €, R(100) = 1 200 €, donc B(100) = 200 €.</p>`,
      vois: pile, voisLeg: 'Les trois barres sont à la même échelle. La zone hachurée est ce que la recette ajoute au-dessus du coût total : le résultat.',
      retiens: `<p>${FM(R`C(q)=\text{coûts fixes}+\text{coût par article}\times q`)}</p><p>${FM(R`R(q)=\text{prix}\times q \qquad B(q)=R(q)-C(q)`)}</p><p>Pour Mia : ${FM(R`C(q)=600+4q,\ R(q)=12q,\ B(q)=8q-600`)}</p>`,
      exemple: `<p>q = 100 : C = 1 000 € ; R = 1 200 € ; B = <b>200 €</b>.</p><p>q = 50 : C = 800 € ; R = 600 € ; B = <b>− 200 €</b> (une perte).</p>`,
      wide: K.prog('calculer le résultat', 'Une fonction Python calcule le résultat pour n’importe quel nombre de bougies. <code>def</code> la définit, <code>return</code> renvoie la valeur.', `def resultat(q):\n    cout = 600 + 4 * q\n    recette = 12 * q\n    return recette - cout\n\nprint(resultat(100))   # affiche 200\nprint(resultat(50))    # affiche -200`, `<p class="prog-q">Que renvoie <code>resultat(75)</code> ? ${bl(18, '0')} Que cela veut-il dire pour Mia ? ${bl(60, 'elle ne gagne rien et ne perd rien')}</p>`),
      attention: 'Le résultat se calcule toujours « recette − coût total ». Dans l’autre sens, le signe est faux.', astuce: { k: 'verif', t: 'Contrôle le signe : si la recette est plus petite que le coût total, le résultat doit être négatif.' } },
    { titre: 'Coût moyen et coût marginal', decouvre: { txt: `Pour 100 bougies, le coût total est ${H('1 000 €')}. Pour 101 bougies, il est de ${H('1 004 €')}. Combien coûte une bougie « en moyenne » ? Et la 101e ?`, img: SK.etiquette() },
      comprends: `<p>Le <b>coût moyen unitaire</b> partage tout le coût total entre les articles : CM(q) = C(q) ÷ q. Pour 100 bougies : 1 000 ÷ 100 = 10 € par bougie. C’est un prix de revient : il doit rester sous le prix de vente.</p><p>Le <b>coût marginal</b> est le coût de l’article en plus : C(q + 1) − C(q). De 100 à 101 bougies : 1 004 − 1 000 = 4 €. Ici, chaque bougie a le même coût variable, donc le coût marginal vaut toujours 4 €.</p><p>Quand on fabrique davantage, les charges fixes se partagent entre plus d’articles : le coût moyen baisse. Il reste cependant au-dessus du coût marginal tant qu’il y a des charges fixes.</p>`,
      vois: moyen, voisLeg: 'Les barres sont les coûts moyens calculés pour 25, 50, 100, 200 et 400 bougies. Le trait pointillé est le coût marginal.',
      retiens: `<p>${FM(R`CM(q)=\dfrac{C(q)}{q}`)} · ${FM(R`\text{coût marginal}=C(q+1)-C(q)`)}</p><p>Pour Mia : ${FM(R`CM(q)=\dfrac{600+4q}{q}=4+\dfrac{600}{q}`)}</p>`,
      exemple: `<p>q = 100 : CM = 1 000 ÷ 100 = <b>10 €</b>.</p><p>q = 400 : CM = 2 200 ÷ 400 = <b>5,50 €</b>.</p><p>Coût marginal : <b>4 €</b> dans les deux cas.</p>`,
      attention: 'Le coût moyen (10 €) et le coût marginal (4 €) ne sont pas le même nombre : le coût moyen contient les charges fixes, le coût marginal non.', astuce: { k: 'sens', t: 'Le coût marginal répond à « combien coûte une de plus ? », le coût moyen à « combien coûte chacune, en moyenne ? ».' } },
    { titre: 'Les intérêts simples', decouvre: { txt: `Mia place ${H('2 000 €')} à ${H('3 % par an')}. Chaque année, les intérêts sont calculés sur les 2 000 € de départ. Combien reçoit-elle au bout de ${H('6 mois')} ?`, img: SK.tirelire() },
      comprends: `<p>Quand on place de l’argent, la banque verse des <b>intérêts</b>. Avec les <b>intérêts simples</b>, ils se calculent toujours sur le capital de départ C. On n’y ajoute jamais les intérêts déjà gagnés.</p><p>Le taux annuel t s’écrit en pourcentage dans l’énoncé, mais on calcule avec son écriture décimale : 3 % = 0,03. La durée n se compte en <b>années</b> : 6 mois, c’est 6 ÷ 12 = 0,5 an.</p><p>Intérêts : I = C × t × n. Ici, I = 2 000 × 0,03 × 0,5 = 30 €. La <b>valeur acquise</b> est le capital plus les intérêts : 2 030 €.</p><p>Chaque année rapporte le même montant : les points de la valeur acquise sont alignés.</p>`,
      vois: interets, voisLeg: 'Chaque année ajoute 60 € : 2 000 × 0,03. À 6 mois, les intérêts sont la moitié : 30 €.',
      retiens: `<p>${FM(R`I=C\times t\times n \qquad V=C+I`)}</p><p>C : capital · t : taux annuel (décimal) · n : durée en années · V : valeur acquise.</p>`,
      exemple: `<p>C = 2 000 € ; t = 0,03 ; n = 6 ÷ 12 = 0,5.</p><p>I = 2 000 × 0,03 × 0,5 = <b>30 €</b> ; V = <b>2 030 €</b>.</p>`,
      attention: 'La durée de la formule est en années : 6 mois s’écrit 0,5, pas 6. Et 3 % s’écrit 0,03.', astuce: { k: 'og', t: 'Un an à 3 % sur 2 000 € rapporte 60 € ; six mois, la moitié : 30 €. Un résultat très différent est suspect.' } },
    { titre: 'Les taux : an, mois, quinzaine, jour', decouvre: { txt: `Un placement de Mia est payé à la quinzaine. Son taux annuel est ${H('3 %')}. Quel est le taux pour une quinzaine ? Et pour un jour ?`, img: SK.calendrier() },
      comprends: `<p>Avec les intérêts simples, un taux se partage <b>proportionnellement</b> à la durée. Une année compte 12 mois : le taux mensuel est le taux annuel ÷ 12. Un mois compte 2 quinzaines : le taux par quinzaine est le taux annuel ÷ 24.</p><p>En calcul commercial, l’année compte 360 jours : le taux journalier est le taux annuel ÷ 360.</p><p>Pour un taux annuel de 3 %, on obtient 0,25 % par mois, 0,125 % par quinzaine et environ 0,0083 % par jour.</p><p>On peut alors choisir la durée qu’on veut. Pour 45 jours : I = 2 000 × 0,03 × 45 ÷ 360 = 7,50 €.</p>`,
      vois: ech, voisLeg: 'On descend l’échelle en divisant. Pour le jour, on divise le taux annuel par 360, l’année commerciale.',
      retiens: `<p>${FM(R`t_{\text{mois}}=\dfrac{t}{12}\quad t_{\text{quinzaine}}=\dfrac{t}{24}\quad t_{\text{jour}}=\dfrac{t}{360}`)}</p><p>Intérêts sur j jours : ${FM(R`I=C\times t\times\dfrac{j}{360}`)}</p>`,
      exemple: `<p>t = 3 % : mois <b>0,25 %</b> ; quinzaine <b>0,125 %</b>.</p><p>2 000 € pendant 45 jours : I = 2 000 × 0,03 × 45 ÷ 360 = <b>7,50 €</b>.</p>`,
      attention: 'Ne mélange pas les unités : un taux mensuel se multiplie par un nombre de mois, un taux annuel par un nombre d’années.', astuce: { k: 'vite', t: 'Pour passer de l’année au mois, divise par 12 : 2,4 % par an donne 0,2 % par mois.' } }];

  c.mots = [['coûts fixes', 'dépenses qui ne changent pas avec le nombre d’articles', 'Le loyer fait partie des coûts fixes.'], ['coût variable', 'dépense qui augmente avec le nombre d’articles', 'La cire est un coût variable.'], ['coût total', 'coûts fixes plus coût variable', 'Pour 100 bougies, le coût total est 1 000 €.'], ['recette', 'argent encaissé grâce aux ventes', 'La recette est de 1 200 €.'], ['résultat', 'recette moins coût total : bénéfice ou perte', 'Le résultat du mois est de 200 €.'], ['coût moyen', 'coût total divisé par le nombre d’articles', 'Le coût moyen d’une bougie est de 10 €.'], ['coût marginal', 'coût de l’article supplémentaire', 'Une bougie de plus coûte 4 € : c’est le coût marginal.'], ['intérêts simples', 'intérêts toujours calculés sur le capital de départ', 'Les intérêts simples sont de 30 €.'], ['valeur acquise', 'capital plus intérêts', 'La valeur acquise est de 2 030 €.']];

  /* ---------- exercices résolus ---------- */
  chk(C(250) === 1600 && Rec(250) === 3000 && B(250) === 1400 && 1600 / 250 === 6.4, 'c1 résolu 1');
  chk(rnd(3500 * .024 * .75) === 63 && 3500 + 63 === 3563 && rnd(3500 * .002 * 9) === 63, 'c1 résolu 2');
  c.resolus = [
    { titre: 'Coût, recette, résultat et coût moyen', outil: '🧮 calculatrice', enonce: `Pour la commande de Noël, Mia fabrique ${H('250 bougies')}. Charges fixes : ${H('600 €')}. Fabrication : ${H('4 €')} par bougie. Prix de vente : ${H('12 € HT')}. Calcule le coût total, la recette, le résultat et le coût moyen d’une bougie.`,
      rows: [['C(250) = 600 + 4 × 250 = <b class="nw">1 600 €</b>', 'Charges fixes plus coût variable.'], ['R(250) = 12 × 250 = <b class="nw">3 000 €</b>', 'Prix de vente multiplié par le nombre.'], ['B(250) = 3 000 − 1 600 = <b class="nw">1 400 €</b>', 'Recette moins coût total.'], ['CM(250) = 1 600 ÷ 250 = <b class="nw">6,40 €</b>', 'Le coût total est partagé entre les 250 bougies.']], verif: 'Le coût moyen, 6,40 €, est plus grand que 4 € (une bougie) et plus petit que 12 € (le prix) : c’est plausible.', rep: 'Le résultat est de 1 400 € et le coût moyen de 6,40 € par bougie.', go: ['e1', 'e2'] },
    { titre: 'À toi : intérêts simples', outil: '🧮 calculatrice', enonce: `Mia place ${H('3 500 €')} à ${H('2,4 % par an')} pendant ${H('9 mois')}, en intérêts simples. Calcule les intérêts et la valeur acquise.`, trous: [0, 1, 2, 3],
      rows: [['n = 9 ÷ 12 = ⟦0,75⟧ an', 'Je convertis la durée en années.'], ['I = 3 500 × 0,024 × 0,75 = ⟦63⟧ €', 'Capital × taux (décimal) × durée.'], ['V = 3 500 + ⟦63⟧ = ⟦3 563⟧ €', 'Valeur acquise : capital plus intérêts.'], ['t<sub>mois</sub> = 2,4 ÷ 12 = ⟦0,2⟧ %', 'Taux mensuel, pour contrôler le résultat.']], verif: '3 500 × 0,002 × 9 = 63 € : même résultat avec le taux mensuel ✓.', rep: 'Les intérêts sont de 63 € et la valeur acquise de 3 563 €.', go: ['e3'] }];
  c.entraine = [{ id: 'e1', gen: 'c1e1', lc: 1 }, { id: 'e2', gen: 'c1e2', lc: 2 }, { id: 'e3', gen: 'c1e3', lc: 3 }];

  /* ---------- je résous ---------- */
  chk(C(180) === 1320 && Rec(180) === 2160 && B(180) === 840 && rnd(1320 / 180) === 7.33, 'c1 p1');
  chk(rnd(8000 * .024 * 10 / 12) === 160 && rnd(.024 / 12 * 100, 4) === .2 && rnd(8000 * .0021 * 10) === 168 && 168 - 160 === 8, 'c1 p2');
  chk(C(240) - C(180) === 240 && 60 * 5 === 300 && 300 - 240 === 60 && C(240) / 240 === 6.5, 'c1 p3');
  c.probs = [
    PB({ id: 'p1', etape: 2, lc: 1, comps: ['app', 'rea'], titre: 'Le mois de novembre', intro: `<p>En novembre, Mia a vendu ${H('180 bougies')} à ${H('12 € HT')}. Ses charges fixes sont de ${H('600 €')} et chaque bougie coûte ${H('4 €')} à fabriquer.</p>`,
      qs: [Q('a.', 'Calcule le coût total du mois.', '600 + 4 × 180 = 1 320 €', 1320, { w: 30 }), Q('b.', 'Calcule la recette.', '12 × 180 = 2 160 €', 2160, { w: 30 }), Q('c.', 'Calcule le résultat.', '2 160 − 1 320 = 840 €', 840, { w: 30 }), Q('d.', 'Calcule le coût moyen d’une bougie, au centime près.', '1 320 ÷ 180 ≈ 7,33 €', 7.33, { w: 30 })],
      err: { 0: [{ v: 720, m: 'Tu as oublié les charges fixes de 600 €.' }], 2: [{ v: -840, m: 'Le résultat est « recette − coût total », pas l’inverse.' }], 3: [{ v: 4, m: 'Le coût moyen partage le coût total entre toutes les bougies : ce n’est pas le coût variable.' }] },
      hints: ['Le coût total, c’est les charges fixes plus 180 fois 4 €.', 'La recette, c’est 180 fois le prix de vente.', 'Le coût moyen : coût total divisé par 180.'], pouce: 'Calcule d’abord le coût total, puis la recette : le résultat est leur différence.', corr: 'a. 600 + 720 = 1 320 €. b. 2 160 €. c. 840 €. d. 1 320 ÷ 180 ≈ 7,33 €.' }),
    PB({ id: 'p2', etape: 3, lc: 3, defi: 4, bulle: 'Ce cas se fait en 4 étapes. Pour comparer deux offres, ramène-les à la même unité de temps : ici, le mois ou l’année.', autravail: { comp: 'ana', txt: 'comparer deux offres de placement pour faire fructifier la trésorerie d’une boutique.' }, comps: ['ana', 'rea', 'val'], titre: 'Placer la trésorerie',
      intro: `<p>Mia place ${H('8 000 €')} pendant ${H('10 mois')} (intérêts simples). La banque A propose ${H('2,4 % par an')}. La banque B propose ${H('0,21 % par mois')}.</p>`,
      qs: [Q('a.', 'Calcule les intérêts avec la banque A.', '8 000 × 0,024 × 10 ÷ 12 = 160 €', 160, { w: 30 }), Q('b.', 'Donne le taux mensuel équivalent de la banque A (en %).', '2,4 ÷ 12 = 0,2 %', 0.2, { w: 24, tol: .0006 }), Q('c.', 'Calcule les intérêts avec la banque B.', '8 000 × 0,0021 × 10 = 168 €', 168, { w: 30 }), Q('d.', 'De combien d’euros la meilleure offre rapporte-t-elle de plus ?', '168 − 160 = 8 € : la banque B est meilleure', 8, { w: 30 })],
      err: { 0: [{ v: 1920, m: 'La durée est de 10 mois : 10 ÷ 12 d’année, pas 10 ans.' }, { v: 192, m: 'Tu as calculé les intérêts d’une année. Multiplie par 10 ÷ 12.' }], 2: [{ v: 16.8, m: 'Le taux de B est mensuel : multiplie par 10 mois, pas par 1.' }] },
      hints: ['Offre A : taux annuel, durée en années (10 ÷ 12).', 'Offre B : taux mensuel, durée en mois (10).', 'Compare les intérêts obtenus sur la même durée.'], pouce: 'Pour A, la durée est 10 ÷ 12 d’année. Pour B, le taux est par mois : multiplie par 10.', corr: 'a. 160 €. b. 0,2 % par mois. c. 168 €. d. 8 € de plus avec la banque B.' }),
    PB({ id: 'p3', etape: 4, lc: 2, cls: 'bac', defi: 5, bulle: 'Voici une question de « vers le bac » : 5 étapes. Le cœur du problème : une bougie de plus coûte 4 €, pas 6,50 €. Une question ratée ne fait pas un exercice raté : continue.', autravail: { comp: 'com', txt: 'décider d’accepter ou non une commande spéciale, et expliquer son choix à un client ou à sa tutrice.' }, comps: ['rea', 'ana', 'com'], titre: 'Accepter une commande spéciale',
      intro: `<p>Mia a déjà vendu ${H('180 bougies')} ce mois-ci. Une boutique voisine lui propose une commande de ${H('60 bougies de plus')} à ${H('5 € HT')} l’unité. Les charges fixes de ${H('600 €')} sont déjà payées ; une bougie coûte ${H('4 €')} à fabriquer.</p>`,
      qs: [BQ('1', 'Calculer le coût de fabrication des 60 bougies de la commande.', 'rea', '60 × 4 = 240 €', 240, { w: 28 }), BQ('2', 'Calculer la recette de cette commande.', 'rea', '60 × 5 = 300 €', 300, { w: 28 }), BQ('3', 'Calculer le résultat gagné grâce à cette commande.', 'rea', '300 − 240 = 60 €', 60, { w: 28 }), BQ('4', 'Calculer le coût moyen d’une bougie pour 240 bougies fabriquées (au centime).', 'ana', 'C(240) = 600 + 960 = 1 560 € ; 1 560 ÷ 240 = 6,50 €', 6.5, { w: 28 }), BQ('5', 'Justifier : Mia doit-elle accepter, alors que 5 € est inférieur au coût moyen ?', 'com', 'Oui : chaque bougie de la commande rapporte 5 € et coûte 4 € de plus (coût marginal) : résultat + 60 €.', null, { lines: 3 })],
      err: { 0: [{ v: 1560, m: 'Les charges fixes sont déjà payées : elles ne s’ajoutent pas à la commande.' }], 2: [{ v: 300, m: 'Tu as donné la recette. Le résultat enlève le coût de fabrication.' }], 3: [{ v: 4, m: 'Le coût moyen divise le coût total (charges fixes comprises) par 240.' }] },
      hints: ['Les charges fixes sont déjà payées : seule la fabrication des 60 bougies compte.', 'Le résultat de la commande : recette moins coût de fabrication.', 'Compare 5 € au coût marginal, pas au coût moyen.'], pouce: 'La commande ajoute 60 bougies : seul leur coût variable s’ajoute. Compare le prix de 5 € au coût marginal de 4 €.', corr: '1. 240 €. 2. 300 €. 3. 60 €. 4. 1 560 ÷ 240 = 6,50 €. 5. Elle accepte : 5 € > 4 € de coût marginal, le résultat augmente de 60 €.' })];

  c.bilan = [['Je sais calculer un coût total, une recette et un résultat.', ['e1', 'p1']], ['Je sais calculer un coût moyen et un coût marginal.', ['e2', 'p3']], ['Je sais calculer des intérêts simples.', ['e3', 'p2']], ['Je sais passer d’un taux annuel à un taux mensuel, par quinzaine ou par jour.', ['e3']]];
  c.words = require('./gl1')('c1');
  c.plusloin = { meca: [], probs: [] };
  return c;
};
