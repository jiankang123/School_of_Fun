const { STAGES } = require('../../data/stages')

Page({
  data: {
    stars: 0,
    earnedStars: 0,
    resultEmoji: '🎉',
    resultTitle: '太棒了！',
    resultSub: '你完成了这一关！',
    stageKey: '',
    levelIdx: 0,
    hasNext: false
  },

  onLoad(options) {
    const stars = parseInt(options.stars) || 1
    const stageKey = options.stageKey || 'pre'
    const levelIdx = parseInt(options.levelIdx) || 0

    const stage = STAGES.find(s => s.key === stageKey)
    const hasNext = stage && levelIdx < stage.levels.length - 1

    const configs = {
      3: { emoji: '🏆', title: '完美通关！', sub: '三颗星！太厉害了！' },
      2: { emoji: '🎉', title: '棒极了！', sub: '两颗星，继续加油！' },
      1: { emoji: '👍', title: '完成了！', sub: '一颗星，多练练更棒哦！' },
    }
    const cfg = configs[stars] || configs[1]

    this.setData({
      stars,
      earnedStars: stars * 10,
      resultEmoji: cfg.emoji,
      resultTitle: cfg.title,
      resultSub: cfg.sub,
      stageKey,
      levelIdx,
      hasNext
    })
  },

  replay() {
    const { stageKey, levelIdx } = this.data
    wx.redirectTo({
      url: `/pages/game/game?stageKey=${stageKey}&levelIdx=${levelIdx}`
    })
  },

  nextLevel() {
    const { stageKey, levelIdx, hasNext } = this.data
    if (hasNext) {
      wx.redirectTo({
        url: `/pages/game/game?stageKey=${stageKey}&levelIdx=${levelIdx + 1}`
      })
    } else {
      wx.navigateBack({ delta: 2 })
    }
  },

  backToStage() {
    wx.navigateBack({ delta: 2 })
  }
})
