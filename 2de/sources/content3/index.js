/* Version 3 — chargement des 8 chapitres (contenu commun à l’appli et au manuel) :
   coups de pouce (au tutoiement), lien avec les métiers, contrôle « S’évaluer » resserré, puis formules KaTeX rendues. */
'use strict';
const POUCES = require('../content2/pouces');
const METIERS = require('../content2/metiers');
const TEX = require('../lib/tex');
const { tu, adapt } = require('../lib/kit3');
module.exports = chk => {
  const EVALS = require('./evals3')(chk, require('../content2/evals')(chk));
  return [1, 2, 3, 4, 5, 6, 7, 8].map(n => {
    const c = require(`./c${n}.js`)(chk), add = POUCES[c.id] || {};
    for (const p of [...c.probs, ...c.plusloin.probs]) {
      if (!p.pouce && add[p.id]) p.pouce = tu(add[p.id]);
      else if (p.pouce) p.pouce = tu(p.pouce);
    }
    c.plusloin.probs = c.plusloin.probs.map(p => adapt(p, { etape: p.etape, pouce: p.pouce }));
    c.metier = METIERS[c.id];
    c.eval = EVALS[c.id];
    chk(!!c.metier && !!c.eval, `métier ou contrôle manquant : ${c.id}`);
    chk(c.notions.length >= 3 && c.notions.length <= 4, `${c.id} : 3 ou 4 notions`);
    chk(c.entraine.length === 3 && c.probs.length === 3, `${c.id} : 3 exercices et 3 problèmes`);
    chk(c.resolus.length === 2 && !!c.resolus[1].trous, `${c.id} : un résolu complet et un à trous`);
    return TEX.deep(c);
  });
};
