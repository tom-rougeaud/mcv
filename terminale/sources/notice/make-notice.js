/* Notice d’installation (PDF A4) — appli et manuel « Maths et MCV · Tle ». */
'use strict';
const fs = require('fs'), path = require('path');
const HERE = path.join(__dirname, '..');
const FONTS = fs.readFileSync(path.join(HERE, 'style', 'fonts.css'), 'utf8');
const RES = k => { try { return JSON.parse(fs.readFileSync(path.join(HERE, 'build', k + '.result.json'), 'utf8')).pages; } catch (e) { return '…'; } };
const QR = JSON.parse(fs.readFileSync(path.join(HERE, 'lib', 'qr.json'), 'utf8'));
const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Notice d’installation · Maths et MCV · Tle</title><style>${FONTS}
@page{size:A4;margin:13mm 14mm 14mm}
*{box-sizing:border-box}
body{font-family:'Andika','Noto Color Emoji','DejaVu Sans',sans-serif;font-size:9.9pt;line-height:1.33;color:#1D2240;margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1,h2,.k,.tag,th{font-family:'Inter','Noto Color Emoji','DejaVu Sans',sans-serif}
.hd{display:grid;grid-template-columns:auto 1fr 34mm;gap:5mm;align-items:center;background:#F5C827;color:#1D2240;border-radius:6mm;padding:5mm 6mm;position:relative;overflow:hidden}
.hd::after{content:"";position:absolute;right:-18mm;top:-22mm;width:60mm;height:60mm;border-radius:50%;background:#FCE27C}
.hd>*{position:relative;z-index:1}
.sig{display:grid;place-items:center;width:17mm;height:17mm;border-radius:4.5mm;background:#1D2240;color:#F5C827;font:800 28pt 'Inter'}
.k{font-weight:800;font-size:8.6pt;letter-spacing:.08em;text-transform:uppercase;color:#6B4A00;margin:0}
h1{margin:.5mm 0 1mm;font-size:21pt;line-height:1.05}
.hd p{margin:0}
.qr{background:#fff;border-radius:3mm;padding:1.6mm;text-align:center;color:#444DB0;font:800 7pt 'Inter'}.qr svg{width:100%;display:block}
h2{font-size:12pt;color:#444DB0;margin:3.6mm 0 1.4mm;break-after:avoid;display:flex;align-items:center;gap:2mm}
h2 b{display:inline-grid;place-items:center;width:7mm;height:7mm;border-radius:50%;background:#F5C827;color:#1D2240;font-size:10pt}
.box{border:1.6px solid #D9DEF2;border-radius:4mm;padding:2.2mm 3.6mm;background:#fff;break-inside:avoid}
.box.y{background:#FFFBEA;border-color:#F3DA7A}.box.g{background:#EEF9F1;border-color:#BFE6CB}.box.r{background:#FDEEEC;border-color:#F3C3BD}
p{margin:1mm 0}ul{margin:1mm 0;padding-left:5mm}li{margin:.6mm 0}
code{font-family:'DejaVu Sans Mono',monospace;font-size:9pt;background:#F1F3FA;border-radius:1mm;padding:0 1mm}
.two{display:grid;grid-template-columns:1fr 1fr;gap:4mm}
table{width:100%;border-collapse:collapse;font-size:9.6pt}th,td{border:1px solid #D9DEF2;padding:.9mm 2mm;text-align:left;vertical-align:top}th{background:#EEF0FB;font-size:8.8pt}
.tag{display:inline-block;white-space:nowrap;font-weight:800;font-size:8pt;border-radius:99px;padding:.2mm 2.4mm;color:#fff;background:#1E7F45}.tag.no{background:#C2332A}.tag.mid{background:#B05200}
.small{font-size:8.8pt;color:#545B7A}
.pb{break-before:page}
</style></head><body>
<div class="hd"><span class="sig">Σ</span><div><p class="k">Notice d’installation · octobre 2026</p><h1>Maths et MCV · Tle</h1><p>L’appli en ligne et le manuel PDF pour la terminale Bac Pro Métiers de la relation client</p></div><div class="qr">${QR.home.svg}L’appli</div></div>

<h2><b>1</b>Ce qui est en ligne</h2>
<div class="box"><table><tr><th style="width:30%">Élément</th><th>Adresse</th></tr>
<tr><td>📱 L’appli (7 chapitres + 3 sujets de CCF)</td><td><code>https://tom-rougeaud.github.io/mcv/terminale/</code></td></tr>
<tr><td>📘 Le manuel élève (PDF, ${RES('eleve')} pages)</td><td><code>…/mcv/terminale/pdf/maths-et-mcv-tle.pdf</code> · le bouton « Le manuel PDF » de l’appli y renvoie.</td></tr>
<tr><td>📄 Un PDF par chapitre, et les sujets de CCF</td><td><code>…/mcv/terminale/pdf/chapitres/</code> : <code>maths-et-mcv-tle-chapitre-1.pdf</code> à <code>-7.pdf</code>, et <code>maths-et-mcv-tle-sujets-ccf.pdf</code>.</td></tr>
<tr><td>🎓 Les sujets de CCF dans l’appli</td><td><code>…/mcv/terminale/#/ccf</code> : 3 sujets, chrono de 45 minutes, appels guidés, note sur 10.</td></tr>
<tr><td>🔗 De la 1re à la terminale</td><td><code>…/mcv/terminale/#/de-1re</code> : chaque chapitre relié aux chapitres du manuel de 1re (liens vers <code>…/mcv/1ere/</code>).</td></tr>
<tr><td>🏠 Site principal, 2de et 1re</td><td><b>Inchangés</b> (le manuel de 1re reçoit seulement deux corrections, voir § 7). Le README du dépôt a reçu une section « Terminale ».</td></tr></table></div>

<h2><b>2</b>Dans le dépôt GitHub</h2>
<div class="box"><p>Dépôt <code>tom-rougeaud/mcv</code>, branche <code>main</code>, nouveau dossier <code>terminale/</code>, à côté de <code>2de/</code> et <code>1ere/</code> :</p>
<ul><li><code>terminale/index.html</code> : l’appli, en un seul fichier (aucune ressource externe, aucun traceur).</li>
<li><code>terminale/pdf/maths-et-mcv-tle.pdf</code> : le manuel, version élève ; <code>terminale/pdf/chapitres/</code> : les 7 chapitres et les sujets de CCF.</li>
<li><code>terminale/sources/</code> : les fichiers qui produisent le manuel et l’appli (Node + Playwright).</li></ul>
<p><b>Supabase</b> : rien à changer, l’appli ne s’y connecte pas. <b>Version professeur</b> : jointe à la conversation seulement, <b>ne la déposez pas sur GitHub</b>.</p></div>

<h2><b>3</b>Programme, découpage, 1re → terminale, automatismes</h2>
<div class="box"><ul>
<li><b>Programme de terminale, groupement sans physique-chimie</b> (arrêté du 3 février 2020, BO spécial n° 1 du 6 février 2020), titres de chapitres = titres du programme, découpés en parties A, B, C : 1 Suites numériques · 2 Calculs commerciaux et financiers · 3 Fonctions polynômes de degré 3 · 4 Fonctions exponentielles et logarithme décimal · 5 Statistique à deux variables · 6 Probabilités · 7 Exponentielle et logarithme népérien (programme complémentaire « poursuite d’études », badge ➕).</li>
<li><b>De la 1re à la terminale</b> : en ouverture de chaque chapitre, la même situation traitée en 1re puis en terminale, ce qui reste, ce qui change, à quoi ça sert. Version professeur : capacités du programme couvertes, automatismes à réactiver, points de vigilance.</li>
<li><b>⚡ Automatismes</b> : 5 questions flash par chapitre, tirées de la liste des automatismes de terminale (probabilités, terme d’une suite arithmétique, second degré, dérivée), plus un prérequis du chapitre et toujours un intérêt simple ou une valeur acquise. Nouvelles questions à chaque tirage dans l’appli.</li>
<li><b>Python et logique</b> : encadrés « 🐍 Je programme » (boucles for et while, fonctions, listes, simulations) et « 🧠 Je raisonne » (contre-exemple, implication et réciproque, disjonction de cas, quantificateurs, sens du signe « = », statut des lettres).</li></ul></div>

<h2><b>4</b>Le format CCF</h2>
<div class="box y"><ul><li>Chaque chapitre se termine par une évaluation <b>au format CCF</b> : 45 minutes, notée sur 10, un ou deux exercices, au moins un <b>appel 📞</b> résolu avec un outil numérique (tableur, GeoGebra, calculatrice, Python), grille des 5 compétences sur 4 niveaux.</li>
<li>Après le chapitre 7, <b>trois sujets complets</b> mêlant 1re et terminale : A « La box Éclat » (suites, tableau croisé, arbre, indépendance) · B « Cap Glisse » (degré 3, emprunt à annuités constantes) · C « Allô Conseil » (ajustement exponentiel, logarithme, arbre pondéré). Corrigés et barèmes dans la version professeur.</li>
<li>Dans l’appli : chrono de 45 minutes (compte à rebours), consignes d’appel dépliables, correction automatique des réponses chiffrées, auto-évaluation des réponses rédigées, meilleure note conservée.</li></ul></div>

<h2><b>5</b>Les 7 chapitres et leurs simulateurs (rubrique « Je manipule »)</h2>
<div class="box"><table><tr><th>Chapitre</th><th>Simulateur et défi</th><th>Données réelles</th></tr>
<tr><td>1 Suites numériques</td><td>Suite géométrique : nuage, terme, somme · défi : doubler en 12 rangs</td><td>Fevad (ventes en ligne 2017-2025), Insee (inflation 2024-2025)</td></tr>
<tr><td>2 Calculs commerciaux et financiers</td><td>Tableau d’amortissement (annuités ou amortissement constants) · défi : annuité &lt; 3 000 €</td><td>Taux du Livret A, LDDS, LEP au 1er août 2026 ; taux d’usure au 1er octobre 2026</td></tr>
<tr><td>3 Polynômes de degré 3</td><td>Cubique, extremums, droite y = c · défi : 3 solutions</td><td>—</td></tr>
<tr><td>4 Exponentielles et log</td><td>Temps de doublement x = log(a) ÷ log(q) · défi : doubler en 10 ans</td><td>Livret A, LEP ; chiffres clés Fevad 2025</td></tr>
<tr><td>5 Statistique à deux variables</td><td>Affine ou exponentiel, interpolation, extrapolation · défi : écart &gt; 50 Md€</td><td>Fevad : chiffre d’affaires et transactions</td></tr>
<tr><td>6 Probabilités</td><td>Arbre pondéré, simulation de 1 000 commandes · défi : rendre D et R indépendants</td><td>—</td></tr>
<tr><td>7 Exp et ln (complémentaire)</td><td>(1 + 1/n)ⁿ → e, croissance continue · défi : doubler en 10 ans</td><td>Livret A</td></tr></table>
<p class="small">Chaque chapitre a 6 onglets : Départ (scène, plan, « De la 1re à la terminale », automatismes, document à toucher), Leçon (notions en 6 temps, méthode visuelle animée), Méthodes (résolu, résolu à trous, simulateur), S’entraîner (3 supports visuels qui changent à chaque essai, indices, erreurs fréquentes expliquées), Problèmes (3, dont un défi et un « vers le bac »), S’évaluer (format CCF).</p></div>

<h2><b>6</b>Données personnelles et utilisation</h2>
<div class="box g"><ul><li>Aucun compte, aucun cookie, aucun traceur, aucune police ni script externe. La progression reste dans le navigateur, sous les clés <code>mcvtle.v1.progression</code> et <code>mcvtle.v1.preferences</code>, distinctes de la 1re (<code>mcv1re.v1.*</code>).</li><li>Export, import et effacement depuis « Mes données ». Une fois ouverte, l’appli fonctionne sans réseau ; on peut aussi enregistrer <code>index.html</code> sur un poste.</li></ul></div>

<h2><b>7</b>Les manuels PDF, et deux corrections en 1re</h2>
<div class="box"><ul><li><b>Version élève</b> (${RES('eleve')} pages) : couverture or, « Comment ça marche », les 5 compétences, sommaire, « De la 1re à la terminale », 7 chapitres, les 3 sujets de CCF, les réponses de « Je m’entraîne », le glossaire visuel.</li>
<li><b>Version professeur</b> (${RES('prof')} pages) : réponses en rouge, pages « Continuité 1re → terminale », corrigé complet avec les barèmes des sujets de CCF et les attendus des appels. <b>Ne pas la déposer sur GitHub.</b></li>
<li><b>Manuel de 1re corrigé</b> : la référence du programme est maintenant « arrêté du 3 février 2020, BO spécial n° 1 du 6 février 2020 » (au lieu d’une référence erronée), et la colonne « Ce que je sais faire » des grilles des contrôles blancs n’est plus écrasée.</li></ul></div>

<h2><b>8</b>Ce qui a été vérifié, et ce qui ne l’a pas été</h2>
<div class="box"><table><tr><th>Vérification</th><th>Résultat</th></tr>
<tr><td>Tous les nombres des leçons, exercices, évaluations et sujets de CCF recalculés par programme</td><td><span class="tag">OK</span></td></tr>
<tr><td>21 générateurs d’exercices, 7 points de départ : 42 000 tirages ; automatismes : 52 500 questions</td><td><span class="tag">0 erreur</span></td></tr>
<tr><td>Test automatique : 7 chapitres × 6 onglets et 3 sujets de CCF, sur ordinateur (1 280 px) et téléphone (375 px)</td><td><span class="tag">OK</span></td></tr>
<tr><td>Contrôle visuel des pages du manuel, chapitre par chapitre</td><td><span class="tag">OK</span></td></tr>
<tr><td>Navigateurs testés : Chromium seulement ; Safari, Firefox, iPad et tablettes Android non testés ; lecture à voix haute non testée</td><td><span class="tag mid">à vérifier</span></td></tr></table></div>

<div class="box"><p>Données réelles : Fevad (chiffres clés 2024 et 2026), Insee (indice des prix à la consommation, janvier 2026), info.gouv.fr (taux du Livret A et du LEP, 31 juillet 2026), Banque de France (seuils de l’usure au 1er octobre 2026). Les entreprises des exercices sont fictives et signalées comme telles.</p>
<p>Tom Rougeaud · licence <b>CC BY-NC 4.0</b>.</p></div>
</body></html>`;
fs.writeFileSync(path.join(__dirname, 'notice.html'), html);

