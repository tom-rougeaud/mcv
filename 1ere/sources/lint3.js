/* Contrôles pédagogiques automatiques de la version 3 :
   longueur des phrases et des consignes, mots interdits, volumes, support visuel de chaque question.
   Usage : node lint3.js  (code de sortie 1 en cas d’erreur) */
'use strict';
const fs = require('fs'), path = require('path');
const { MCVT } = require('./shared/train.js');
const ERR = [], WARN = [];
const chk = (ok, m) => { if (!ok) ERR.push('calcul : ' + m); };
const err = m => ERR.push(m), warn = m => WARN.push(m);
const plain = h => String(h || '').replace(/<table[\s\S]*?<\/table>/g, ' ').replace(/\\\([\s\S]*?\\\)/g, ' formule ').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/⟦|⟧/g, '').replace(/\s+/g, ' ').trim();
const words = s => plain(s).split(' ').filter(w => /[\p{L}\d]/u.test(w));
const sentences = s => plain(s).split(/(?<=[.!?…])\s+(?=[«A-ZÀ-ÝÉ0-9])/u).filter(x => words(x).length);
const FORBID = /(^|[^\p{L}])(faciles?|difficiles?|difficultés?|niveaux?)(?![\p{L}])/iu;
const forbid = (where, s) => { const m = plain(s).match(FORBID); if (m) err(`${where} : mot interdit « ${m[2]} »`); };
const L = { comprends: [80, 150], sent: 15, sentMax: 20, consigne: 20 };

const raw = [1, 2, 3, 4, 5, 6, 7, 8].map(n => require(`./content1/c${n}.js`)(chk));
const full = require('./content1')(chk);
const stat = { notions: 0, phrases: 0, consignes: 0, departs: 0, supports: 0 };
raw.forEach((c, i) => {
  const F = full[i], id = c.id;
  /* volumes */
  if (c.notions.length < 3 || c.notions.length > 6) err(`${id} : ${c.notions.length} notions (3 à 6 attendues)`);
  if (c.entraine.length !== 3) err(`${id} : ${c.entraine.length} exercices « Je m’entraîne »`);
  if (c.probs.length !== 3) err(`${id} : ${c.probs.length} problèmes`);
  if (c.mots.length < 5) err(`${id} : seulement ${c.mots.length} mots à connaître`);
  if (c.resolus.length !== 2 || !c.resolus.every(r => r.verif)) err(`${id} : 2 résolus avec « Je vérifie » attendus`);
  const nq = F.eval.exos.reduce((a, x) => a + x.qs.length, 0), pts = F.eval.exos.reduce((a, x) => a + x.qs.reduce((b, q) => b + q.pts, 0), 0);
  if (nq < 10 || nq > 12 || pts !== 20) err(`${id} : contrôle blanc ${nq} questions, ${pts} points`);
  if (!F.eval.exos.some(x => /<svg|<table|class="et|wfig|docx/.test(x.intro || ''))) err(`${id} : contrôle blanc sans document visuel`);
  /* leçon : 80 à 150 mots par « Je comprends », phrases courtes */
  c.notions.forEach((nt, k) => {
    stat.notions++;
    const w = words(nt.comprends).length; if (w < L.comprends[0] || w > L.comprends[1]) err(`${id} notion ${k + 1} : « Je comprends » fait ${w} mots`);
    const ss = sentences(nt.comprends); const avg = ss.reduce((a, s) => a + words(s).length, 0) / ss.length; stat.phrases += ss.length;
    if (avg > L.sent) err(`${id} notion ${k + 1} : phrases de ${avg.toFixed(1)} mots en moyenne`);
    ss.filter(s => words(s).length > L.sentMax).forEach(s => warn(`${id} notion ${k + 1} : phrase de ${words(s).length} mots : « ${s.slice(0, 60)}… »`));
    if (!nt.vois.includes('<svg') || !nt.decouvre.img.includes('<svg')) err(`${id} notion ${k + 1} : image ou méthode visuelle manquante`);
    for (const key of ['decouvre', 'comprends', 'retiens', 'exemple', 'attention']) forbid(`${id} notion ${k + 1} ${key}`, key === 'decouvre' ? nt.decouvre.txt : nt[key]);
    forbid(`${id} notion ${k + 1} astuce`, nt.astuce.t);
  });
  c.mots.forEach(m => forbid(`${id} mots`, m.join(' ')));
  c.resolus.forEach((r, k) => { forbid(`${id} résolu ${k + 1}`, r.enonce + r.rows.flat().join(' ') + r.verif + r.rep); if (words(r.enonce).length > 40) warn(`${id} résolu ${k + 1} : énoncé de ${words(r.enonce).length} mots`); });
  forbid(`${id} question du chapitre`, c.travail.question);
  /* problèmes : bulle avant chaque défi, ligne « Au travail » sur le cas pratique et le sujet bac, consignes courtes */
  F.probs.forEach(p => {
    if (p.defi && !p.bulle) err(`${id} ${p.id} : défi sans bulle d’encouragement`);
    if (p.etape >= 3 && !p.autravail) err(`${id} ${p.id} : ligne « Au travail, cela sert à » manquante`);
    if (!(p.hints || []).length) err(`${id} ${p.id} : pas d’indices pour l’appli`);
    forbid(`${id} ${p.id}`, p.body + (p.bulle || '') + (p.pouce || '') + (p.hints || []).join(' '));
    p.qs.forEach(q => { stat.consignes++; const w = words(q.t).length; if (w > L.consigne) warn(`${id} ${p.id} ${q.l} : consigne de ${w} mots`); });
  });
  F.eval.exos.forEach(x => { forbid(`${id} contrôle`, (x.intro || '') + x.qs.map(q => q.t + ' ' + q.a).join(' ')); x.qs.forEach(q => { stat.consignes++; if (words(q.t).length > L.consigne) warn(`${id} contrôle : consigne de ${words(q.t).length} mots « ${plain(q.t).slice(0, 50)}… »`); }); });
  Object.values(F.eval.grille).forEach(g => forbid(`${id} grille`, g));
  /* départ et entraînement : un support visuel pour chaque question, sur 50 tirages */
  for (let s = 1; s <= 50; s++) {
    const d = MCVT.dep(c.depart, s * 7919);
    if (d.qs.length !== 5) err(`${id} départ : ${d.qs.length} questions`);
    if (!/<table|<svg|class="et3|class="aff3/.test(d.doc)) err(`${id} départ (tirage ${s}) : pas de document visuel`);
    d.qs.forEach(q => { if (words(q.t).length > L.consigne) err(`${id} départ : question de ${words(q.t).length} mots`); forbid(`${id} départ`, q.t + ' ' + q.a); });
    stat.departs++;
    c.entraine.forEach(e => { const g = MCVT.tr(e.gen, s * 104729 + 3);
      if (!/<svg|<table/.test(g.support)) err(`${id} ${e.gen} : pas de support visuel`);
      if (g.items.length < 3 || g.items.length > 6) err(`${id} ${e.gen} : ${g.items.length} items`);
      if (words(g.consigne).length > 25) warn(`${id} ${e.gen} : consigne de ${words(g.consigne).length} mots`);
      if (g.hints.length !== 3) err(`${id} ${e.gen} : ${g.hints.length} indices`);
      forbid(`${id} ${e.gen}`, g.consigne + g.hints.join(' ') + g.items.map(it => (it.err || []).map(x => x.m).join(' ')).join(' '));
      stat.supports++; });
  }
});
/* textes de l’appli et du manuel */
for (const f of ['app/app3.js', 'gen3.js', 'content1/evals1.js', 'content1/pont1.js', 'app/widgets.js', 'shared/train.js', 'shared/t1.js', 'shared/t2.js', 'shared/t3.js', 'shared/t4.js', 'shared/t5.js', 'shared/t6.js', 'shared/t7.js', 'shared/t8.js']) {
  const s = fs.readFileSync(path.join(__dirname, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const m = s.match(/[^\n]{0,40}(?<![\p{L}])(faciles?|difficiles?|difficultés?|niveaux?)(?![\p{L}])[^\n]{0,40}/iu); if (m) err(`${f} : mot interdit dans « ${m[0].trim()} »`);
}
console.log(`Contrôles pédagogiques : ${stat.notions} notions · ${stat.phrases} phrases · ${stat.consignes} consignes · ${stat.departs} documents de départ · ${stat.supports} supports tirés`);
WARN.forEach(w => console.log('  ⚠', w));
ERR.forEach(e => console.log('  ✗', e));
console.log(ERR.length ? `${ERR.length} erreur(s)` : `OK (${WARN.length} remarque(s))`);
process.exit(ERR.length ? 1 : 0);
