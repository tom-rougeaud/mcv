/* Chargement des 8 chapitres (contenu commun à l’appli et au manuel) :
   coups de pouce ajoutés, lien avec les métiers, contrôle « S’évaluer », puis formules KaTeX rendues. */
'use strict';
const POUCES = require('./pouces');
const METIERS = require('./metiers');
const TEX = require('../lib/tex');
module.exports = chk => {
  const EVALS = require('./evals')(chk);
  return [1, 2, 3, 4, 5, 6, 7, 8].map(n => {
    const c = require(`./c${n}.js`)(chk), add = POUCES[c.id] || {};
    for (const [id, txt] of Object.entries(add)) { const p = c.probs.find(x => x.id === id); chk(!!p, `pouce : ${c.id} ${id} introuvable`); if (p && !p.pouce) p.pouce = txt; }
    c.metier = METIERS[c.id];
    c.eval = EVALS[c.id];
    chk(!!c.metier && !!c.eval, `métier ou contrôle manquant : ${c.id}`);
    return TEX.deep(c);
  });
};
