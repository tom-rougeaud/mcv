/* 1re — chargement des 8 chapitres (contenu commun à l’appli et au manuel). */
'use strict';
const fs = require('fs'), path = require('path');
const METIERS = require('./metiers1');
const PONT = require('./pont1');
const TEX = require('../lib/tex');
module.exports = chk => {
  const EVALS = require('./evals1')(chk);
  const ids = [1, 2, 3, 4, 5, 6, 7, 8].filter(n => fs.existsSync(path.join(__dirname, `c${n}.js`)));
  return ids.map(n => {
    const c = require(`./c${n}.js`)(chk);
    c.metier = METIERS[c.id]; c.eval = EVALS[c.id]; c.pont = PONT[c.id];
    chk(!!c.pont && c.pont.de.length >= 1 && c.pont.plus.length >= 2, `${c.id} : encart « De la 2de à la 1re »`);
    chk(!!c.metier && !!c.eval, `métier ou contrôle manquant : ${c.id}`);
    chk(c.notions.length >= 3 && c.notions.length <= 6, `${c.id} : 3 à 6 notions`);
    chk(!!c.parties && c.parties.flatMap(p => p.n).join() === c.notions.map((_, i) => i + 1).join(), `${c.id} : les parties couvrent toutes les notions, dans l’ordre`);
    chk(c.entraine.length === 3 && c.probs.length === 3, `${c.id} : 3 exercices et 3 problèmes`);
    chk(c.resolus.length === 2 && !!c.resolus[1].trous, `${c.id} : un résolu complet et un à trous`);
    return TEX.deep(c);
  });
};
