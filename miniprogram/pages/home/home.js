// pages/home/home.js
const store  = require('../../utils/store');
const { STAGES } = require('../../utils/data');
const { sfx }    = require('../../utils/sfx');

Page({
  data: {
    stars: 0, streak: 1, doneToday: 0,
    starterPct: 0, prePct: 0, kinderPct: 0, grade1Pct: 0,
    grade1Locked: true,
    claimed: false,
    dailyTasks: []
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    const G = store.get();
    const kinderDone = store.cdn('kinder') >= STAGES.kinder.levels.length;
    const daily = STAGES.pre.levels.slice(0, 5).map((lv, i) => ({
      ...lv,
      done: store.gp('pre', i).done
    }));
    this.setData({
      stars:        G.stars,
      streak:       G.streak,
      claimed:      G.claimed,
      doneToday:    daily.filter(l => l.done).length,
      starterPct:   store.pct('starter'),
      prePct:       store.pct('pre'),
      kinderPct:    store.pct('kinder'),
      grade1Pct:    store.pct('grade1'),
      grade1Locked: !kinderDone,
      dailyTasks:   daily
    });
  },

  onClaim() {
    const G = store.get();
    if (G.claimed) return;
    store.setG('claimed', true);
    store.setG('stars', G.stars + 20);
    sfx('coin');
    this.refresh();
    wx.showToast({ title: '领取成功！+20 ⭐', icon: 'none' });
  },

  goStage(e) {
    const sk = e.currentTarget.dataset.sk;
    store.setG('curSk', sk);
    wx.switchTab({ url: '/pages/stage/stage' });
  },

  goGrade1() {
    const kinderDone = store.cdn('kinder') >= STAGES.kinder.levels.length;
    if (!kinderDone) {
      wx.showToast({ title: '先完成幼儿园全部关卡才能解锁 🔒', icon: 'none', duration: 2000 });
      return;
    }
    store.setG('curSk', 'grade1');
    wx.switchTab({ url: '/pages/stage/stage' });
  },

  onDailyTap(e) {
    if (e.currentTarget.dataset.done) return;
    const idx = e.currentTarget.dataset.idx;
    store.setG('curSk', 'pre');
    wx.navigateTo({ url: `/pages/game/game?sk=pre&li=${idx}` });
  },

  // 分享功能
  onShareAppMessage() {
    const G = store.get();
    return {
      title: `我在数学启蒙星球已经获得了 ${G.stars} 颗星！一起来挑战吧 ⭐`,
      path: '/pages/home/home',
      imageUrl: '' // 留空使用默认截图
    };
  },

  onShareTimeline() {
    const G = store.get();
    return {
      title: `数学启蒙星球 - 已获得 ${G.stars} 颗星 ⭐`,
      query: '',
      imageUrl: ''
    };
  }
});
