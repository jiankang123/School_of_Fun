// pages/reward/reward.js
const { STAGES } = require('../../utils/data');

Page({
  data: {
    sk: '', li: 0, stars: 0,
    ico: '🏆', ttl: '', sub: '', earnPts: 0,
    nextBtnText: '下一关 →'
  },

  onLoad(options) {
    const sk    = options.sk || 'pre';
    const li    = parseInt(options.li) || 0;
    const stars = parseInt(options.stars) || 1;
    const next  = li + 1;
    const hasNext = next < STAGES[sk].levels.length;

    const cfg = {
      3: { ico: '🏆', ttl: '完美通关！', sub: '三颗星！太厉害了！' },
      2: { ico: '🎉', ttl: '棒极了！',   sub: '两颗星，继续加油！' },
      1: { ico: '👍', ttl: '完成了！',   sub: '多练练会更棒哦！' }
    }[stars] || { ico: '👍', ttl: '完成！', sub: '' };

    this.setData({
      sk, li, stars,
      ico: cfg.ico, ttl: cfg.ttl, sub: cfg.sub,
      earnPts: stars * 10,
      nextBtnText: hasNext ? '下一关 →' : '返回地图'
    });
  },

  replay() {
    wx.redirectTo({ url: `/pages/game/game?sk=${this.data.sk}&li=${this.data.li}` });
  },

  nextLevel() {
    const { sk, li } = this.data;
    const next = li + 1;
    if (next < STAGES[sk].levels.length) {
      wx.redirectTo({ url: `/pages/game/game?sk=${sk}&li=${next}` });
    } else {
      wx.navigateBack({ delta: 2 });
    }
  },

  backStage() {
    wx.navigateBack({ delta: 2 });
  },

  // 分享功能
  onShareAppMessage() {
    const { stars } = this.data;
    return {
      title: `🏆 获得了 ${stars} 颗星！一起来挑战数学启蒙星球吧`,
      path: '/pages/home/home',
      imageUrl: ''
    };
  }
});
