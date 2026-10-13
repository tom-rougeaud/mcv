# Sources de « Maths et MCV · 2de » (manuel PDF + appli) — version 3

Ces fichiers fabriquent le manuel (version élève et version professeur), les PDF par chapitre et l’appli publiée dans `2de/`.
Tous les résultats des exercices sont calculés et contrôlés par programme (`chk`) : une erreur de calcul arrête la construction.

## Ce que change la version 3
- Chaque chapitre part d’une scène « Au travail » et d’un **point de départ** : un document du métier, 6 questions.
- La **leçon** suit six temps par notion : je découvre, je comprends (80 à 150 mots), je vois (méthode visuelle annotée, animée dans l’appli), je retiens, exemple, attention (+ une astuce).
- **Méthodes** : un exercice résolu, puis le même à compléter, chacun avec « Je vérifie ».
- **Je m’entraîne** : 3 exercices à support visuel (cases lettrées) ; **Je résous** : 3 problèmes, avec badge « Défi · n étapes », bulle d’encouragement et ligne « Au travail, cela sert à… ».
- **S’évaluer** : 10 à 12 questions, un document central, grille écrite en phrases d’élève, noté sur 20.
- Coups de pouce imprimés à l’envers en bas de page, réponses de « Je m’entraîne » en fin de manuel.
- Appli : 6 onglets (Départ · Leçon · Méthodes · S’entraîner · Problèmes · S’évaluer), indices progressifs, correction qui nomme l’erreur fréquente, liste « Je sais faire », « Pour aller plus loin » (exercices de la version 2).

## Organisation
- `content3/` : les 8 chapitres de la version 3 (`c1.js` … `c8.js`), les contrôles resserrés (`evals3.js`) ; `index.js` charge le tout. Les problèmes et les exercices de « Pour aller plus loin » sont repris de `content2/`.
- `shared/train.js` : les documents de départ et les exercices à support visuel (communs au manuel et à l’appli) ; `shared/gens.js` : les générateurs de la version 2.
- `lib/` : `visu.js` (méthodes visuelles), `scenes.js` (scènes au trait, compétences), `kit3.js` (tutoiement, reprise des problèmes), pagination A4 (`paginate.js`), couverture, QR codes, KaTeX.
- `app/` : l’appli (`app3.js`, `app3.css`, `widgets.js` pour les simulateurs).
- `style/` : charte du manuel (`v3.css` pour la version 3) et polices embarquées.
- `notice/` : la notice d’installation.

## Construire
Prérequis : Node.js 18 ou plus, Python 3 avec `playwright`, `pypdf` et un Chromium installé ; `npm install` (KaTeX).

```
node test-train.js                     # documents de départ et exercices visuels (48 000 tirages)
node test-gens.js                      # générateurs de « Pour aller plus loin » (222 000 tirages)
node lint3.js                          # contrôles pédagogiques (phrases, consignes, mots interdits, volumes, supports)
python3 make3.py                       # manuel élève + professeur + PDF par chapitre → build/
node build-app3.js ../index.html       # l’appli, en un seul fichier
python3 test-app3.py ../index.html     # test de bout en bout de l’appli (ordinateur et téléphone)
```

Les fichiers de la version 2 (`content2/`, `gen2.js`, `make.py`, `build-app.js`, `test-app.py`) restent pour mémoire.
La version professeur (`build/maths-et-mcv-2de-professeur.pdf`) ne doit jamais être publiée.
Licence CC BY-NC 4.0 — Tom Rougeaud.
