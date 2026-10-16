/* Notice d’installation (PDF A4) — appli et manuel « Maths et MCV · 2de ». */
'use strict';
const fs = require('fs'), path = require('path');
const HERE = path.join(__dirname, '..');
const FONTS = fs.readFileSync(path.join(HERE, 'style', 'fonts.css'), 'utf8');
const QR = JSON.parse(fs.readFileSync(path.join(HERE, 'lib', 'qr.json'), 'utf8'));
const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Notice d’installation · Maths et MCV · 2de</title><style>${FONTS}
@page{size:A4;margin:13mm 14mm 14mm}
*{box-sizing:border-box}
body{font-family:'Andika','Noto Color Emoji','DejaVu Sans',sans-serif;font-size:9.9pt;line-height:1.33;color:#1D2240;margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1,h2,.k,.tag,th{font-family:'Inter','Noto Color Emoji','DejaVu Sans',sans-serif}
.hd{display:grid;grid-template-columns:auto 1fr 34mm;gap:5mm;align-items:center;background:#2A6A8C;color:#fff;border-radius:6mm;padding:5mm 6mm;position:relative;overflow:hidden}
.hd::after{content:"";position:absolute;right:-18mm;top:-22mm;width:60mm;height:60mm;border-radius:50%;background:#4446B8}
.hd>*{position:relative;z-index:1}
.sig{display:grid;place-items:center;width:17mm;height:17mm;border-radius:4.5mm;background:#FFC233;color:#2A6A8C;font:800 28pt 'Inter'}
.k{font-weight:800;font-size:8.6pt;letter-spacing:.08em;text-transform:uppercase;color:#FFC233;margin:0}
h1{margin:.5mm 0 1mm;font-size:21pt;line-height:1.05}
.hd p{margin:0}
.qr{background:#fff;border-radius:3mm;padding:1.6mm;text-align:center;color:#2A6A8C;font:800 7pt 'Inter'}.qr svg{width:100%;display:block}
h2{font-size:12pt;color:#2A6A8C;margin:3.6mm 0 1.4mm;break-after:avoid;display:flex;align-items:center;gap:2mm}
h2 b{display:inline-grid;place-items:center;width:7mm;height:7mm;border-radius:50%;background:#FFC233;color:#2A6A8C;font-size:10pt}
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
<div class="hd"><span class="sig">Σ</span><div><p class="k">Notice d’installation · version 3 · octobre 2026</p><h1>Maths et MCV · 2de</h1><p>L’appli en ligne et le manuel PDF pour la 2de Bac Pro Métiers de la relation client</p></div><div class="qr">${QR.home.svg}L’appli</div></div>

<h2><b>1</b>Ce qui est en ligne</h2>
<div class="box"><table><tr><th style="width:30%">Élément</th><th>Adresse</th></tr>
<tr><td>📱 L’appli (8 chapitres)</td><td><code>https://tom-rougeaud.github.io/mcv/2de/</code></td></tr>
<tr><td>📘 Le manuel élève (PDF, 128 pages)</td><td><code>https://tom-rougeaud.github.io/mcv/2de/pdf/maths-et-mcv-2de.pdf</code><br><span class="small">Le bouton « Le manuel PDF » de l’appli y renvoie.</span></td></tr>
<tr><td>📄 Un chapitre en PDF</td><td><code>…/2de/pdf/chapitres/maths-et-mcv-2de-chapitre-1.pdf</code> à <code>-8.pdf</code> : le bouton « PDF du chapitre » de l’appli les télécharge.</td></tr>
<tr><td>🧭 Un chapitre de l’appli</td><td><code>…/mcv/2de/#/c1</code> à <code>#/c8</code> : ce sont les adresses des QR codes imprimés en tête de chaque chapitre du manuel.</td></tr>
<tr><td>🏠 Votre site principal</td><td><code>https://tom-rougeaud.github.io/mcv/</code> : <b>inchangé</b>. Seul le README a reçu une section « 2de ».</td></tr></table></div>

<h2><b>2</b>Les fichiers déposés sur GitHub</h2>
<div class="box"><p>Dépôt <code>tom-rougeaud/mcv</code>, branche <code>main</code>, nouveau dossier <code>2de/</code> :</p>
<ul><li><code>2de/index.html</code> : l’appli complète, en un seul fichier (environ 1,3 Mo). Polices, formules (KaTeX rendu à l’avance, polices incluses), styles, contenus et scripts sont embarqués : ni CDN, ni police externe, ni traceur.</li>
<li><code>2de/pdf/maths-et-mcv-2de.pdf</code> : le manuel, version élève.</li><li><code>2de/pdf/chapitres/</code> : les 8 chapitres en PDF séparés (version élève, contrôle blanc compris).</li><li><code>2de/sources/</code> : les sources mises à jour (version 3 : <code>content3/</code>, <code>gen3.js</code>, <code>build-app3.js</code>…).</li></ul><p><b>Ce qui change par rapport à la version 2</b> : ces trois emplacements sont simplement remplacés. Les adresses ne changent pas, les QR codes imprimés restent valables, la progression des élèves est conservée (mêmes clés de stockage).</p>
<p><b>GitHub Pages est déjà actif sur ce dépôt</b> : il n’y a rien à régler. Une mise à jour apparaît en ligne une à deux minutes après l’envoi.</p>
<p><b>Supabase : rien à changer.</b> L’appli n’utilise aucune base de données en ligne.</p></div>

<h2><b>3</b>Pour vos élèves</h2>
<div class="two"><div class="box y"><p><b>Ouvrir l’appli</b></p><ul><li>Scanner le QR code (ci-dessus, page 2 du manuel ou en tête de chapitre), ou taper l’adresse.</li><li>Pas de compte, pas de mot de passe, pas d’installation.</li></ul>
<p><b>La mettre sur l’écran d’accueil</b></p><ul><li><b>iPhone</b> (Safari) : bouton Partager, puis « Sur l’écran d’accueil ».</li><li><b>Android</b> (Chrome) : menu ⋮, puis « Ajouter à l’écran d’accueil ».</li></ul></div>
<div class="box y"><p><b>Sans connexion</b></p><ul><li>Une fois ouverte, l’appli fonctionne même si le réseau coupe.</li><li>Pour un poste sans Internet : enregistrer la page (fichier <code>index.html</code>) et l’ouvrir dans un navigateur. Seul le lien vers le PDF demande alors une connexion.</li></ul>
<p><b>Au vidéoprojecteur</b></p><ul><li>Onglet 📘 Leçon : un clic par temps (je découvre, je comprends, je vois…) ; la méthode visuelle s’anime, « ▶ Rejouer » la relance.</li><li>Onglet 🧭 Méthodes : « Étape suivante » dévoile le résolu une étape à la fois.</li><li>Mes données → Taille du texte : « Très grande ».</li></ul></div></div>

<h2><b>4</b>Ce que contient chaque chapitre de l’appli (6 onglets)</h2>
<div class="box"><p>🚀 <b>Départ</b> : la scène « Au travail », la question du chapitre, puis un document du métier et 6 questions ; on répond en touchant le document (case, barre, étiquette) ; « 🔄 Nouveau document » à chaque essai · 📘 <b>Leçon</b> : chaque notion en six temps, un clic par temps, méthode visuelle animée, lecture à voix haute 🔊, les mots à connaître · 🧭 <b>Méthodes</b> : un exercice résolu pas à pas, le même à compléter (cases vérifiées), le simulateur · ✏️ <b>S’entraîner</b> : 3 exercices à support visuel (on écrit dans les cases du dessin), nouveaux nombres à chaque essai, 3 indices progressifs, correction qui nomme l’erreur fréquente ; « ➕ Pour aller plus loin » garde tous les exercices de la version 2 · 🧩 <b>Problèmes</b> : bulle d’encouragement avant les défis, badge « Défi · n étapes », ligne « Au travail, cela sert à… », indices, coup de pouce, correction · 🎯 <b>S’évaluer</b> : contrôle blanc sur 20, grille en phrases d’élève, bilan par compétence, chrono facultatif · ✅ <b>Je sais faire</b> : la liste du chapitre se coche au fil des réussites. Aucun classement.</p></div>

<h2><b>5</b>Données et confidentialité (RGPD)</h2>
<div class="box g"><ul><li><b>Aucune donnée personnelle n’est collectée</b> : pas de compte, pas de cookie, pas de statistiques de visite, rien n’est envoyé sur Internet.</li>
<li>La progression reste dans le navigateur de l’élève (stockage local), sous les clés <code>mcv2de.v1.progression</code> (départ réussi, exercices réussis, problèmes terminés, meilleure note aux contrôles blancs) et <code>mcv2de.v1.preferences</code> (taille du texte). Ce sont les mêmes clés qu’en version 2 : rien n’est perdu.</li>
<li>Si le stockage est bloqué (navigation privée), l’appli fonctionne quand même ; la progression est alors oubliée à la fermeture.</li>
<li>Page <b>Mes données</b> : <b>Exporter</b> (fichier <code>maths-et-mcv-2de-progression.json</code>), <b>Importer</b> (sur un autre appareil), <b>Effacer</b>.</li>
<li>La lecture à voix haute utilise la voix installée sur l’appareil.</li>
<li>Les pages « À propos » et « Confidentialité » de l’appli reprennent ces informations pour les familles.</li></ul></div>

<h2><b>6</b>Le manuel PDF</h2>
<div class="box"><ul><li><b>Version élève</b> (128 pages) : couverture bleue, « Comment ça marche » (schéma du chapitre, routine de lecture en 3 étapes), double page des 5 compétences expliquées par des gestes du métier, sommaire. Chaque chapitre : Au travail, Point de départ, leçon en six temps, mots à connaître, Méthodes (un résolu, un à compléter), Je m’entraîne (3), Je résous (3, dont un défi et un sujet « vers le bac »), Je sais faire, puis S’évaluer sur une feuille recto verso. Coups de pouce imprimés à l’envers en bas de page ; réponses de « Je m’entraîne » en fin de manuel ; glossaire visuel. A4, recto verso ; chaque chapitre et chaque contrôle commencent sur une page de droite.</li>
<li><b>Version professeur</b> (134 pages) : les réponses en rouge sur les pages (y compris dans les cases des dessins), plus un corrigé complet à la fin (départ, résolus à compléter, problèmes, contrôles). Elle est seulement jointe à cette conversation. <b>Ne la déposez pas sur GitHub</b> : un dépôt public est lisible par tous.</li>
<li>Les nombres du manuel sont tirés une fois pour toutes : élève et professeur sont identiques. Dans l’appli, les nombres changent à chaque essai.</li></ul></div>

<h2><b>7</b>Ce qui a été vérifié, et ce qui ne l’a pas été</h2>
<div class="box"><table><tr><th style="width:62%">Vérification</th><th>Résultat</th></tr>
<tr><td>Syntaxe des scripts (<code>node --check</code>)</td><td><span class="tag">OK</span></td></tr>
<tr><td>24 exercices visuels et 8 documents de départ : 48 000 tirages simulés ; les 74 générateurs de « Pour aller plus loin » : 222 000 tirages. Chaque réponse affichée est acceptée</td><td><span class="tag">0 erreur</span></td></tr><tr><td>Contrôles pédagogiques automatiques : 80 à 150 mots par « Je comprends », phrases de 15 mots au plus en moyenne, aucun mot interdit (facile, difficile, niveau), volumes, un support visuel pour chaque question de départ et d’entraînement</td><td><span class="tag">OK</span></td></tr>
<tr><td>Tous les calculs des leçons, exercices résolus et problèmes recalculés par programme</td><td><span class="tag">OK</span></td></tr>
<tr><td>Test automatique des 8 chapitres × 6 onglets, en largeur ordinateur (1 280 px) et téléphone (375 px) : pas d’erreur, pas de défilement horizontal ; départs réussis (dont les cases touchées), les 31 notions dévoilées temps par temps, résolus à compléter, 48 exercices à support justes, messages d’erreur fréquente affichés, 132 réponses de problèmes acceptées, 8 contrôles blancs à 20/20 ; export et effacement</td><td><span class="tag">OK</span></td></tr>
<tr><td>Mise en page du PDF : aucun débordement, aucun renvoi de page ou de numéro manquant ; chaque contrôle blanc compte 10 à 12 questions notées sur 20 ; relecture visuelle des pages</td><td><span class="tag">OK</span></td></tr>
<tr><td>Safari (iPhone, iPad), Firefox, vrais téléphones Android</td><td><span class="tag mid">non testé</span></td></tr>
<tr><td>Voix de lecture à voix haute selon les appareils</td><td><span class="tag mid">non testé</span></td></tr>
<tr><td>Impression du PDF sur une vraie imprimante (marges, couleurs, lecture des coups de pouce à l’envers)</td><td><span class="tag mid">non testé</span></td></tr><tr><td>Usage réel par des élèves (temps par chapitre, clarté des bulles et des indices)</td><td><span class="tag mid">non testé</span></td></tr></table>
<p class="small">À faire de votre côté : ouvrir l’appli sur un iPhone et un téléphone Android de la classe, et imprimer une page test du manuel.</p></div>

<h2><b>8</b>Sources et licence</h2>
<div class="box"><p>Programme de mathématiques de seconde professionnelle (BO spécial n° 5 du 11 avril 2019), avec le module « Calculs commerciaux et financiers ». Le chapitre 8 (croisement de deux variables) prolonge la statistique ; il est adapté de vos supports (cours, fiches, évaluation). Données réelles : Insee (indice des prix à la consommation, janvier 2026), economie.gouv.fr (taux de TVA), Code de la consommation art. L112-1-1 et DGCCRF (annonces de réduction), service-public.fr (mentions des factures). Les entreprises des exercices sont fictives.</p>
<p>Tom Rougeaud · licence <b>CC BY-NC 4.0</b>.</p></div>
</body></html>`;
fs.writeFileSync(path.join(__dirname, 'notice.html'), html);
