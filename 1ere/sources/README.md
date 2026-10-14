# Sources de « Maths et MCV · 1re » (manuel PDF + appli)

Ces fichiers fabriquent le manuel de 1re Bac Pro (version élève et version professeur), les PDF par chapitre et l’appli publiée dans `1ere/`.
Tous les résultats sont calculés et contrôlés par programme (`chk`) : une erreur de calcul arrête la construction.
Toutes les courbes, droites d’ajustement, nuages et solides sont tracés par calcul (`shared/g1.js`, `shared/t8.js`), jamais à main levée.

## Organisation
- `content1/` : les 8 chapitres (`c1.js` … `c8.js`), le glossaire visuel (`gl_c1.js` … `gl_c8.js`), les contrôles blancs (`evals1.js`), le lien avec la 2de (`pont1.js`), les métiers (`metiers1.js`), les automatismes (`shared/auto1.js`), les dessins « Je découvre » (`sk1.js`) ; `index.js` charge et vérifie le tout.
- `shared/` : `g1.js` (repère, courbes, moindres carrés), `train.js` (moteur des exercices) et `t1.js` … `t8.js` (documents de départ et exercices à support visuel, communs au manuel et à l’appli).
- `lib/` : méthodes visuelles, scènes au trait (`scenes1.js`), pagination A4, couverture, QR codes, KaTeX.
- `app/` : l’appli (`app3.js`, `app3.css`, `widgets.js` pour les simulateurs « Je manipule »).
- `style/` : charte du manuel et polices embarquées. `notice/` : la notice d’installation.

## Construire
Prérequis : Node.js 18 ou plus, Python 3 avec `playwright` et `pypdf`, un Chromium ; `npm install` (KaTeX).

```
node test-train.js                     # documents de départ et exercices visuels (48 000 tirages)
node lint3.js                          # contrôles pédagogiques (phrases, consignes, mots interdits, volumes, supports)
python3 make3.py                       # manuel élève + professeur + PDF par chapitre → build/
node build-app3.js ../index.html       # l’appli en un seul fichier
python3 test-app3.py ../index.html     # test de bout en bout (ordinateur et téléphone)
```

La version professeur (`build/maths-et-mcv-1re-professeur.pdf`) n’est pas publiée.

Tom Rougeaud · licence CC BY-NC 4.0.
