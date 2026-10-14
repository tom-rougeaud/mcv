/* Terminale — outils de rédaction communs aux 7 chapitres. */
'use strict';
const K = require('../lib/kit3');
const { MCVP } = require('../shared/g1.js');
const { S, T, Rc, Ln, Ar, Br, st, Sketch, esc } = require('../lib/visu');

/* un problème : K.prob + ce que demande la version 3 (défi, bulle, au travail, indices, coup de pouce, erreurs fréquentes par question) */
function PB(o) {
  const p = K.prob(o);
  p.defi = o.defi || 0; p.bulle = o.bulle || ''; p.autravail = o.autravail || null; p.hints = o.hints || []; p.pouce = o.pouce || '';
  Object.entries(o.err || {}).forEach(([i, e]) => { if (p.qs[i]) p.qs[i].err = e; });
  p.qs.forEach(q => { q.err = q.err || []; });
  return p;
}
/* encadré « Je programme » : code Python lisible, avec ce que l’on observe */
const prog = (titre, texte, code, suite = '') => `<div class="prog"><div class="prog-h">🐍 Je programme · ${titre}</div><p>${texte}</p><pre>${esc(code)}</pre>${suite}</div>`;
/* encadré « Je raisonne » : vocabulaire et logique */
const rais = (titre, texte) => `<div class="rais"><div class="rais-h">🧠 Je raisonne · ${titre}</div>${texte}</div>`;
/* petit tableau HTML de données */
const tab = (head, rows, cls = '') => `<table class="dt tcx dt-sm ${cls}"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, j) => j === 0 ? `<th>${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
/* pictogramme simple : un objet du magasin au trait (sans visage) */
const pic = (w, h, body, lab) => S(w, h, body, lab).replace('class="pic vis"', 'class="pic vis dsc"');
module.exports = { ...K, PB, prog, rais, tab, pic, MCVP, S, T, Rc, Ln, Ar, Br, st, Sketch, esc };
