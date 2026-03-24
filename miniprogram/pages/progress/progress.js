// pages/progress/progress.js
const store  = require('../../utils/store');
const { STAGES } = require('../../utils/data');

Page({
  data: {
    stars: 0, streak: 1, doneCnt: 0, totalStars: 0,
    stages: [], badges: []
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    const G    = store.get();
    const done = Object.values(G.prog).filter(p => p.done).length;

    const stages = Object.entries(STAGES).map(([sk, st]) => ({
      sk,
      title: st.title,
      emoji: st.emoji,
      color: st.color,
      pct:   store.pct(sk)
    }));

    const badges = [
      { ico: '🍎', name: '数数达人',   locked: done < 1 },
      { ico: '🔥', name: '连续7天',    locked: G.streak < 7 },
      { ico: '⚡', name: '闪电算手',   locked: G.stars < 50 },
      { ico: '🏆', name: '全星通关',   locked: store.totalStars() < 30 },
      { ico: '🌟', name: '学前毕业',   locked: store.cdn('pre') < STAGES.pre.levels.length },
      { ico: '🎓', name: '幼儿园毕业', locked: store.cdn('kinder') < STAGES.kinder.levels.length },
      { ico: '🏫', name: '一年级先锋', locked: store.cdn('grade1') < 1 },
      { ico: '🦄', name: '连续30天',   locked: G.streak < 30 }
    ];

    this.setData({
      stars:      G.stars,
      streak:     G.streak,
      doneCnt:    done,
      totalStars: store.totalStars(),
      stages,
      badges
    });
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '📊 看看我的数学学习进度！一起来玩数学启蒙星球',
      path: '/pages/home/home',
      imageUrl: ''
    };
  }
});
