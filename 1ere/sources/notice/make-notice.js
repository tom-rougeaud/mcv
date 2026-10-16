/* Notice d’installation (PDF A4) — appli et manuel « Maths et MCV · 1re ». */
'use strict';
const fs = require('fs'), path = require('path');
const HERE = path.join(__dirname, '..');
const FONTS = fs.readFileSync(path.join(HERE, 'style', 'fonts.css'), 'utf8');
const QR = JSON.parse(fs.readFileSync(path.join(HERE, 'lib', 'qr.json'), 'utf8'));
const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Notice d’installation · Maths et MCV · 1re</title><style>${FONTS}
@page{size:A4;margin:13mm 14mm 14mm}
*{box-sizing:border-box}
body{font-family:'Andika','Noto Color Emoji','DejaVu Sans',sans-serif;font-size:9.9pt;line-height:1.33;color:#1D2240;margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1,h2,.k,.tag,th{font-family:'Inter','Noto Color Emoji','DejaVu Sans',sans-serif}
.hd{display:grid;grid-template-columns:auto 1fr 34mm;gap:5mm;align-items:center;background:#5B2A9E;color:#fff;border-radius:6mm;padding:5mm 6mm;position:relative;overflow:hidden}
.hd::after{content:"";position:absolute;right:-18mm;top:-22mm;width:60mm;height:60mm;border-radius:50%;background:#7438C0}
.hd>*{position:relative;z-index:1}
.sig{display:grid;place-items:center;width:17mm;height:17mm;border-radius:4.5mm;background:#FFC233;color:#1F7A3A;font:800 28pt 'Inter'}
.k{font-weight:800;font-size:8.6pt;letter-spacing:.08em;text-transform:uppercase;color:#FFC233;margin:0}
h1{margin:.5mm 0 1mm;font-size:21pt;line-height:1.05}
.hd p{margin:0}
.qr{background:#fff;border-radius:3mm;padding:1.6mm;text-align:center;color:#1F7A3A;font:800 7pt 'Inter'}.qr svg{width:100%;display:block}
h2{font-size:12pt;color:#1F7A3A;margin:3.6mm 0 1.4mm;break-after:avoid;display:flex;align-items:center;gap:2mm}
h2 b{display:inline-grid;place-items:center;width:7mm;height:7mm;border-radius:50%;background:#FFC233;color:#1F7A3A;font-size:10pt}
.box{border:1.6px solid #D9DEF2;border-radius:4mm;padding:2.2mm 3.6mm;background:#fff;break-inside:avoid}
.box.y{background:#FFFBEA;border-color:#F3DA7A}.box.g{background:#EEF9F1;border-color:#BFE6CB}.box.r{background:#FDEEEC;border-color:#F3C3BD}
p{margin:1mm 0}ul{margin:1mm 0;padding-left:5mm}li{margin:.6mm 0}
code{font-family:'DejaVu Sans Mono',monospace;font-size:9pt;background:#F1F3FA;border-radius:1mm;padding:0 1mm}
.two{display:grid;grid-template-columns:1fr 1fr;gap:4mm}
table{width:100%;border-collapse:collapse;font-size:9.6pt}th,td{border:1px solid #D9DEF2;padding:.9mm 2mm;text-align:left;vertical-align:top}th{background:#EEF0FB;font-size:8.8pt}
.tag{display:inline-block;font-weight:800;font-size:8pt;border-radius:99px;padding:.2mm 2.4mm;color:#fff;background:#1E7F45}.tag.no{background:#C2332A}.tag.mid{background:#B05200}
.small{font-size:8.8pt;color:#545B7A}
.pb{break-before:page}
</style></head><body>
<div class="hd"><span class="sig">Σ</span><div><p class="k">Notice d’installation · octobre 2026</p><h1>Maths et MCV · 1re</h1><p>L’appli en ligne et le manuel PDF pour la 1re Bac Pro Métiers de la relation client</p></div><div class="qr">${QR.home.svg}L’appli</div></div>

<h2><b>1</b>Ce qui est en ligne</h2>
<div class="box"><table><tr><th style="width:30%">Élément</th><th>Adresse</th></tr>
<tr><td>📱 L’appli (8 chapitres)</td><td><code>https://tom-rougeaud.github.io/mcv/1ere/</code></td></tr>
<tr><td>📘 Le manuel élève (PDF, 158 pages)</td><td><code>https://tom-rougeaud.github.io/mcv/1ere/pdf/maths-et-mcv-1re.pdf</code><br><span class="small">Le bouton « Le manuel PDF » de l’appli y renvoie.</span></td></tr>
<tr><td>📄 Un chapitre en PDF</td><td><code>…/1ere/pdf/chapitres/maths-et-mcv-1re-chapitre-1.pdf</code> à <code>-8.pdf</code> : le bouton « PDF du chapitre » de l’appli les télécharge.</td></tr>
<tr><td>🧭 Un chapitre de l’appli</td><td><code>…/mcv/1ere/#/c1</code> à <code>#/c8</code> : ce sont les adresses des QR codes imprimés en tête de chaque chapitre.</td></tr>
<tr><td>🔗 De la 2de à la 1re</td><td><code>…/mcv/1ere/#/de-2de</code> : la page qui relie chaque chapitre aux chapitres de 2de. Les numéros de chapitre y ouvrent directement l’appli de 2de (<code>…/mcv/2de/#/c1</code>…).</td></tr>
<tr><td>🏠 Site principal et 2de</td><td><code>https://tom-rougeaud.github.io/mcv/</code> et <code>…/mcv/2de/</code> : <b>inchangés</b>. Seul le README a reçu une section « 1re ».</td></tr></table></div>

<h2><b>2</b>Les fichiers déposés sur GitHub</h2>
<div class="box"><p>Dépôt <code>tom-rougeaud/mcv</code>, branche <code>main</code>, nouveau dossier <code>1ere/</code>, à côté de <code>2de/</code> :</p>
<ul><li><code>1ere/index.html</code> : l’appli complète, en un seul fichier (environ 1,7 Mo). Polices, formules (KaTeX rendu à l’avance), styles, contenus, graphiques et scripts sont embarqués : ni CDN, ni police externe, ni traceur.</li>
<li><code>1ere/pdf/maths-et-mcv-1re.pdf</code> : le manuel, version élève.</li><li><code>1ere/pdf/chapitres/</code> : les 8 chapitres en PDF séparés (version élève, contrôle blanc compris).</li><li><code>1ere/sources/</code> : les sources (contenus <code>content1/</code>, générateurs <code>shared/</code>, mise en page <code>gen3.js</code>, appli <code>app/</code>, <code>build-app3.js</code>, tests).</li></ul>
<p><b>GitHub Pages est déjà actif sur ce dépôt</b> : il n’y a rien à régler. Le nouveau dossier apparaît en ligne une à deux minutes après l’envoi.</p>
<p><b>Supabase : rien à changer.</b> L’appli n’utilise aucune base de données en ligne.</p></div>

<h2><b>3</b>Programme, découpage, 2de → 1re, automatismes</h2>
<div class="box y"><ul><li><b>Programme</b> : chaque chapitre porte le titre du programme de 1re (calculs commerciaux et financiers ; résolution graphique ; fonctions polynômes de degré 2 ; fonction dérivée et étude des variations ; suites numériques ; statistique à deux variables quantitatives ; probabilités ; géométrie dans l’espace) et se découpe en <b>parties A, B, C</b>, visibles sur la page d’ouverture, dans le sommaire, en tête de chaque notion et dans l’appli. Le titre « métier » est devenu un sous-titre.</li>
<li><b>Ajouts du programme</b> : sens de variation d’une suite, uₙ = f(n), somme des premiers termes ; probabilité conditionnelle P<sub>A</sub>(B) et univers non équiprobable ; fonction inverse, extremums locaux et globaux, équation réduite de la tangente ; ordonnée à l’origine ; solides composés et sections avec GeoGebra 3D ; vocabulaire ∈, ⊂, complémentaire, « et », « ou ».</li>
<li><b>Au-delà du programme, conservé</b> : suites géométriques et intérêts composés (notions marquées « ➕ Pour aller plus loin · programme de terminale », exercices et problèmes dans « Pour aller plus loin » de l’appli), dérivée de x³ et formule −b/(2a) (signalées « complément »).</li>
<li><b>De la 2de à la 1re</b> : après l’ouverture de chaque chapitre, un bloc montre la même situation du métier traitée en 2de puis en 1re, avec ce qui reste, ce qui change et à quoi ça sert. La page d’ensemble est en début de manuel. La version professeur ajoute, pour chaque chapitre, les capacités du programme couvertes, les automatismes de 2de à réactiver et les points de vigilance.</li>
<li><b>⚡ Automatismes</b> : une zone de 5 questions flash au début de chaque chapitre, sans calculatrice. Elles réactivent les prérequis de 2de et posent toujours un intérêt simple ou une valeur acquise. Dans l’appli, « 🔄 Nouvelles questions » en tire d’autres. Les questions « Rappel » du point de départ ont été retirées.</li></ul></div>

<h2><b>4</b>Pour vos élèves</h2>
<div class="two"><div class="box y"><p><b>Ouvrir l’appli</b></p><ul><li>Scanner le QR code (ci-dessus, page 2 du manuel ou en tête de chapitre), ou taper l’adresse.</li><li>Pas de compte, pas de mot de passe, pas d’installation.</li></ul>
<p><b>La mettre sur l’écran d’accueil</b></p><ul><li><b>iPhone</b> (Safari) : bouton Partager, puis « Sur l’écran d’accueil ».</li><li><b>Android</b> (Chrome) : menu ⋮, puis « Ajouter à l’écran d’accueil ».</li></ul></div>
<div class="box y"><p><b>Sans connexion</b></p><ul><li>Une fois ouverte, l’appli fonctionne même si le réseau coupe.</li><li>Pour un poste sans Internet : enregistrer la page (fichier <code>index.html</code>) et l’ouvrir dans un navigateur. Les liens vers les PDF et vers l’appli de 2de demandent alors une connexion.</li></ul>
<p><b>Au vidéoprojecteur</b></p><ul><li>Onglet 📘 Leçon : un clic par temps ; la méthode visuelle s’anime, « ▶ Rejouer » la relance.</li><li>Onglet 🧭 Méthodes : « Étape suivante » dévoile le résolu, puis « 🎛️ Je manipule » ouvre le simulateur du chapitre.</li><li>Mes données → Taille du texte : « Très grande ».</li></ul></div></div>

<h2><b>5</b>Les 8 chapitres et leurs simulateurs</h2>
<div class="box"><table><tr><th style="width:35%">Chapitre</th><th>Simulateur « Je manipule » (avec un défi)</th></tr>
<tr><td>1 · Calculs commerciaux et financiers</td><td>Résultat du mois : charges fixes, coût unitaire, prix, quantité ; coût moyen, coût marginal, seuil.</td></tr>
<tr><td>2 · Résolution graphique</td><td>Deux offres sur le même graphique, point d’intersection calculé.</td></tr>
<tr><td>3 · Fonctions polynômes de degré 2</td><td>Forme factorisée a(x − x₁)(x − x₂) : sens, racines, sommet, signe.</td></tr>
<tr><td>4 · Fonction dérivée et variations</td><td>Tangente qui glisse sur la courbe, nombre dérivé et sens de variation.</td></tr>
<tr><td>5 · Suites numériques</td><td>Placement arithmétique contre placement géométrique : quand B dépasse A.</td></tr>
<tr><td>6 · Statistique à deux variables</td><td>Nuage modifiable : droite des moindres carrés, point moyen, R².</td></tr>
<tr><td>7 · Probabilités</td><td>Tableau croisé réglable, probabilités « et », « ou », « parmi », et 100 tirages au hasard.</td></tr>
<tr><td>8 · Géométrie dans l’espace</td><td>Cylindre, cône, pyramide ou boule : volume, conversion en litres, section à la hauteur choisie.</td></tr></table>
<p class="small">Chaque chapitre a 6 onglets : Départ (avec « De la 2de à la 1re » et les automatismes), Leçon (4 à 6 notions en parties A, B, C, avec un encadré « 🐍 Je programme » ou « 🧠 Je raisonne »), Méthodes, S’entraîner (3 exercices à support visuel, nouveaux nombres à chaque essai), Problèmes (3, dont un défi et un sujet « vers le bac ») et S’évaluer (contrôle blanc sur 20).</p></div>

<h2><b>6</b>Données et confidentialité (RGPD)</h2>
<div class="box g"><ul><li><b>Aucune donnée personnelle n’est collectée</b> : pas de compte, pas de cookie, pas de statistiques de visite, rien n’est envoyé sur Internet.</li>
<li>La progression reste dans le navigateur de l’élève (stockage local), sous les clés <code>mcv1re.v1.progression</code> et <code>mcv1re.v1.preferences</code>. Elles sont distinctes de celles de la 2de (<code>mcv2de.v1.…</code>) : les deux applis ne se gênent pas.</li>
<li>Si le stockage est bloqué (navigation privée), l’appli fonctionne quand même ; la progression est alors oubliée à la fermeture.</li>
<li>Page <b>Mes données</b> : <b>Exporter</b> (fichier <code>maths-et-mcv-1re-progression.json</code>), <b>Importer</b>, <b>Effacer</b>.</li>
<li>Les pages « À propos » et « Confidentialité » de l’appli reprennent ces informations pour les familles.</li></ul></div>

<h2><b>7</b>Le manuel PDF</h2>
<div class="box"><ul><li><b>Version élève</b> (158 pages) : couverture, « Comment ça marche », les 5 compétences, sommaire, la page « De la 2de à la 1re », puis 8 chapitres de 14 à 16 pages : Au travail et encart 2de → 1re, Point de départ, leçon en 4 notions, mots à connaître, Méthodes, Je m’entraîne (3), Je résous (3), Je sais faire, S’évaluer sur une feuille recto verso. Réponses de « Je m’entraîne » et glossaire visuel (72 mots, chacun avec un schéma exact) à la fin.</li>
<li><b>Version professeur</b> (168 pages) : les réponses en rouge sur les pages, les pages « Continuité 2de → 1re », et un corrigé complet à la fin. Elle est seulement jointe à cette conversation. <b>Ne la déposez pas sur GitHub</b> : un dépôt public est lisible par tous.</li>
<li>Toutes les courbes, nuages, droites d’ajustement et solides sont calculés par programme (aucun tracé à main levée) ; les entreprises et les données des exercices sont fictives et signalées comme telles.</li></ul></div>

<h2><b>8</b>Ce qui a été vérifié, et ce qui ne l’a pas été</h2>
<div class="box"><table><tr><th style="width:62%">Vérification</th><th>Résultat</th></tr>
<tr><td>Syntaxe des scripts (<code>node --check</code>)</td><td><span class="tag">OK</span></td></tr>
<tr><td>27 exercices visuels, 8 documents de départ (52 500 tirages) et 8 zones d’automatismes (60 000 questions) : chaque réponse affichée est acceptée</td><td><span class="tag">0 erreur</span></td></tr>
<tr><td>Calculs des leçons, résolus, problèmes, contrôles blancs et glossaire recalculés par programme (contrôles intégrés au contenu)</td><td><span class="tag">OK</span></td></tr>
<tr><td>Contrôles pédagogiques automatiques : longueur des textes et des phrases, aucun mot interdit (facile, difficile, niveau), volumes, un support visuel par question</td><td><span class="tag">OK</span></td></tr>
<tr><td>Test automatique des 8 chapitres × 6 onglets, en largeur ordinateur (1 280 px) et téléphone (375 px) : pas d’erreur, pas de défilement horizontal, départs, résolus, exercices, problèmes et contrôles blancs justes ; simulateurs lancés ; export et effacement</td><td><span class="tag">OK</span></td></tr>
<tr><td>Relecture visuelle des pages du manuel (graphiques, tableaux, glossaire)</td><td><span class="tag">OK</span></td></tr>
<tr><td>Safari (iPhone, iPad), Firefox, vrais téléphones Android</td><td><span class="tag mid">non testé</span></td></tr>
<tr><td>Voix de lecture à voix haute, impression réelle (marges, couleurs, coups de pouce à l’envers)</td><td><span class="tag mid">non testé</span></td></tr>
<tr><td>Usage réel par des élèves</td><td><span class="tag mid">non testé</span></td></tr></table></div>

<h2><b>9</b>Sources et licence</h2>
<div class="box"><p>Programme de mathématiques de première professionnelle (arrêté du 3 février 2020, BO spécial n° 1 du 6 février 2020), avec le module « Calculs commerciaux et financiers ». Le résumé du programme utilisé pour construire la progression vient d’un document académique : à recouper avec le texte officiel du BO. Les chapitres de 2de cités sont ceux du manuel « Maths et MCV · 2de ».</p>
<p>Tom Rougeaud · licence <b>CC BY-NC 4.0</b>.</p></div>
</body></html>`;
fs.writeFileSync(path.join(__dirname, 'notice.html'), html);

