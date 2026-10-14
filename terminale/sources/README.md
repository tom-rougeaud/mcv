# Sources de « Maths et MCV · Tle » (manuel PDF + appli)

Ces fichiers fabriquent le manuel de terminale Bac Pro (version élève et version professeur), les PDF par chapitre, les trois sujets de CCF et l’appli publiée dans `terminale/`.
Programme : terminale professionnelle, groupement sans physique-chimie (arrêté du 3 février 2020, BO spécial n° 1 du 6 février 2020). Le chapitre 7 (exponentielle et logarithme népérien) relève du programme complémentaire « poursuite d’études » et porte le badge ➕.
Tous les résultats sont calculés et contrôlés par programme (`chk`) : une erreur de calcul arrête la construction.
Toutes les courbes, droites d’ajustement, nuages, arbres et tableaux de variations sont tracés par calcul (`shared/g1.js`, `shared/t1.js` … `shared/t7.js`), jamais à main levée.

## Organisation
- `contentT/` : les 7 chapitres (`c1.js` … `c7.js`), le glossaire visuel (`gl_c1.js` … `gl_c7.js`), les évaluations au format CCF (`evalsT.js`), les trois sujets de CCF (`ccfT.js`), le lien avec la 1re (`pontT.js`), les métiers (`metiersT.js`), les dessins « Je découvre » et les données réelles (`skT.js`) ; `index.js` charge et vérifie le tout.
- `shared/` : `g1.js` (repère, courbes, moindres carrés), `train.js` (moteur des exercices), `t1.js` … `t7.js` (documents de départ et exercices à support visuel, communs au manuel et à l’appli), `autoT.js` (automatismes).
- `lib/` : méthodes visuelles, scènes au trait (`scenesT.js`), pagination A4, couverture, QR codes, KaTeX.
- `app/` : l’appli (`app3.js`, `app3.css`, `widgets.js` pour les simulateurs « Je manipule »).
- `style/` : charte du manuel et polices embarquées. `notice/` : la notice d’installation.

## Construire
Prérequis : Node.js 18 ou plus, Python 3 avec `playwright` et `pypdf`, un Chromium ; `npm install` (KaTeX).

```
node test-train.js                     # documents de départ, exercices visuels et automatismes (42 000 + 52 500 tirages)
node lint3.js                          # contrôles pédagogiques (phrases, consignes, mots interdits, format CCF, supports)
python3 make3.py                       # manuel élève + professeur + PDF par chapitre + sujets de CCF → build/
node build-app3.js ../index.html       # l’appli en un seul fichier
python3 test-app3.py "$PWD/../index.html"   # test de bout en bout (ordinateur et téléphone)
```

La version professeur (`build/maths-et-mcv-tle-professeur.pdf`) n’est pas publiée.

Données réelles : Fevad (chiffres clés 2024 et 2026), Insee (indice des prix à la consommation), info.gouv.fr (Livret A, LEP), Banque de France (seuils de l’usure). Les entreprises des exercices sont fictives et signalées comme telles.

Tom Rougeaud · licence CC BY-NC 4.0.
