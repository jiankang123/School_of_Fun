// pages/stage/stage.js
const store  = require('../../utils/store');
const { STAGES } = require('../../utils/data');

Page({
  data: {
    sk: 'pre', title: '', desc: '', emoji: '', bg: '',
    progPct: 0, doneCnt: 0, totalCnt: 0,
    levels: []
  },

  onLoad(options) {
    this.sk = options.sk || store.getG('curSk') || 'pre';
    this.renderStage();
  },

  onShow() {
    // switchTab 跳转时 onLoad 不重新触发，从 store 拿最新 sk
    const sk = store.getG('curSk') || this.sk || 'pre';
    this.sk = sk;
    this.renderStage();
  },

  renderStage() {
    const sk = this.sk;
    const st = STAGES[sk];
    const d  = store.cdn(sk);
    const t  = st.levels.length;
    const levels = st.levels.map((lv, i) => ({
      ...lv,
      locked: i > 0 && !store.gp(sk, i - 1).done,
      stars:  store.gp(sk, i).stars || 0
    }));
    this.setData({
      sk, title: st.title, desc: st.desc, emoji: st.emoji, bg: st.bg,
      progPct:  t ? Math.round(d / t * 100) : 0,
      doneCnt:  d,
      totalCnt: t,
      levels
    });
  },

  goBack() {
    wx.navigateBack();
  },

  onLvTap(e) {
    const idx    = e.currentTarget.dataset.idx;
    const locked = e.currentTarget.dataset.locked;
    if (locked) {
      wx.showToast({ title: '先完成上一关才能解锁哦 🔒', icon: 'none', duration: 1500 });
      return;
    }
    wx.navigateTo({ url: `/pages/game/game?sk=${this.sk}&li=${idx}` });
  },

  // 分享功能（注意：stage 是 tabBar 页，分享路径不能带参数）
  onShareAppMessage() {
    const st = STAGES[this.sk] || STAGES.pre;
    // tabBar 页不能带参数，只能分享到 home 页，或者改为分享非 tabBar 子页
    return {
      title: `${st.emoji} ${st.title} - 一起来挑战数学启蒙！`,
      path: '/pages/home/home',
      imageUrl: ''
    };
  },

  onShareTimeline() {
    const st = STAGES[this.sk] || STAGES.pre;
    return {
      title: `数学启蒙星球 · ${st.title}`,
      query: '',
      imageUrl: ''
    };
  }
});
