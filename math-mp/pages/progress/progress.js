const app = getApp()
const { STAGES } = require('../../data/stages')

Page({
  data: {
    stars: 0, streak: 0,
    doneLevels: 0, totalStars: 0,
    stagePcts: [], badges: []
  },

  onShow() {
    const g = app.globalData
    let doneLevels = 0, totalStars = 0

    const stagePcts = STAGES.map(s => {
      let done = 0
      s.levels.forEach((_, i) => {
        const p = app.getLevelProgress(s.key, i)
        if (p.done) { done++; doneLevels++; totalStars += p.stars || 0 }
      })
      return {
        key: s.key, name: s.name, emoji: s.emoji,
        color: s.color,
        pct: s.levels.length ? Math.round((done / s.levels.length) * 100) : 0
      }
    })

    const badges = [
      { emoji: '🍎', name: '数数达人', locked: doneLevels < 1 },
      { emoji: '🔥', name: '连续7天',  locked: (g.streak || 0) < 7 },
      { emoji: '⚡', name: '闪电算手', locked: (g.stars || 0) < 50 },
      { emoji: '🏆', name: '全星通关', locked: totalStars < 30 },
      { emoji: '🌟', name: '学前毕业', locked: stagePcts[0]?.pct < 100 },
      { emoji: '🦄', name: '连续30天', locked: (g.streak || 0) < 30 },
    ]

    this.setData({
      stars: g.stars || 0,
      streak: g.streak || 0,
      doneLevels, totalStars,
      stagePcts, badges
    })
  }
})
