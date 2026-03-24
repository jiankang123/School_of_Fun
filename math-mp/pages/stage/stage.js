const app = getApp()
const { STAGES } = require('../../data/stages')

Page({
  data: {
    stage: {},
    levels: [],
    pct: 0,
    doneCnt: 0,
    totalCnt: 0
  },

  onLoad(options) {
    this.stageKey = options.key || 'pre'
    this._load()
  },

  onShow() {
    this._load()
  },

  _load() {
    const stageData = STAGES.find(s => s.key === this.stageKey)
    if (!stageData) return

    const totalCnt = stageData.levels.length
    let doneCnt = 0

    const levels = stageData.levels.map((lv, i) => {
      const prog = app.getLevelProgress(this.stageKey, i)
      if (prog.done) doneCnt++

      // 前两关直接解锁，后续关卡需要前一关完成
      const locked = i > 1 && !app.getLevelProgress(this.stageKey, i - 1).done

      return {
        ...lv,
        stars: prog.stars || 0,
        done: prog.done || false,
        locked
      }
    })

    const pct = totalCnt ? Math.round((doneCnt / totalCnt) * 100) : 0

    this.setData({ stage: stageData, levels, pct, doneCnt, totalCnt })
    wx.setNavigationBarTitle({ title: stageData.name })
  },

  startLevel(e) {
    const { index, locked } = e.currentTarget.dataset
    if (locked) {
      wx.showToast({ title: '先完成上一关哦！', icon: 'none' })
      return
    }
    wx.navigateTo({
      url: `/pages/game/game?stageKey=${this.stageKey}&levelIdx=${index}`
    })
  },

  goBack() {
    wx.navigateBack()
  }
})
