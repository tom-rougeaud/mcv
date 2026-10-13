# Sources de « Maths et MCV · 2de » (manuel PDF + appli)

Ces fichiers fabriquent le manuel (version élève et version professeur), les PDF par chapitre et l’appli publiée dans `2de/`.
Tous les résultats des exercices sont calculés et contrôlés par programme (`chk`) : une erreur de calcul arrête la construction.

## Organisation
- `content2/` : le contenu des 8 chapitres (`c1.js` … `c8.js`), les contrôles blancs (`evals.js`), les coups de pouce ajoutés (`pouces.js`), le lien avec les métiers (`metiers.js`) ; `index.js` charge le tout.
- `shared/gens.js` : les générateurs d’exercices (communs au manuel et à l’appli).
- `lib/` : outils de mise en forme (graphiques, documents, pictogrammes, couverture, formules KaTeX, pagination A4, QR codes).
- `app/` : l’appli (`app.js`, `widgets.js` pour les simulateurs, `app.css`).
- `style/` : charte du manuel et polices embarquées.
- `notice/` : la notice d’installation.

## Construire
Prérequis : Node.js 18 ou plus, Python 3 avec `playwright`, `pypdf` et un Chromium installé ; `npm install` (KaTeX).

```
node test-gens.js                      # teste les générateurs
python3 make.py                        # manuel élève + professeur + PDF par chapitre → build/
node build-app.js ../index.html        # l’appli, en un seul fichier
python3 test-app.py ../index.html      # test de bout en bout de l’appli
```

La version professeur (`build/maths-et-mcv-2de-professeur.pdf`) ne doit jamais être publiée.
Licence CC BY-NC 4.0 — Tom Rougeaud.
