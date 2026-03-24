// utils/store.js  —— 全局状态 + wx.storage 持久化
const { STAGES } = require('./data');

let G = {
  stars:   0,
  streak:  1,
  claimed: false,
  prog:    {},
  curSk:   'pre',
  curLi:   0
};

function load() {
  try {
    const saved = wx.getStorageSync('G');
    if (saved) G = Object.assign(G, saved);
  } catch(e) {}
}

function save() {
  try { wx.setStorageSync('G', G); } catch(e) {}
}

function get()       { return G; }
function getG(key)   { return G[key]; }
function setG(key, v){ G[key] = v; save(); }

function gp(sk, li) {
  return G.prog[sk + '-' + li] || { stars: 0, done: false };
}

function sp(sk, li, s) {
  const k   = sk + '-' + li;
  const old = G.prog[k] || { stars: 0, done: false };
  G.prog[k] = { stars: Math.max(old.stars || 0, s), done: true };
  save();
}

function cdn(sk) {
  return STAGES[sk].levels.filter((_, i) => gp(sk, i).done).length;
}

function totalStars() {
  return Object.values(G.prog).reduce((a, p) => a + (p.stars || 0), 0);
}

function pct(sk) {
  const s = STAGES[sk];
  return s.levels.length ? Math.round(cdn(sk) / s.levels.length * 100) : 0;
}

module.exports = { load, save, get, getG, setG, gp, sp, cdn, totalStars, pct };
