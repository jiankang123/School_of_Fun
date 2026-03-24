const app = getApp()
const { STAGES } = require('../../data/stages')

Page({
  data: {
    stars: 0,
    streak: 0,
    rewardClaimed: false,
    todayDone: 0,
    todayTotal: 5,
    stages: [],
    dailyTasks: []
  },

  onShow() {
    const g = app.globalData
    this.setData({
      stars: g.stars || 0,
      streak: g.streak || 0,
      rewardClaimed: g.todayRewardClaimed || false,
    })
    this._buildStages()
    this._buildDailyTasks()
  },

  _buildStages() {
    const stages = STAGES.map(s => {
      const total = s.levels.length
      const done = s.levels.filter((_, i) =>
        app.getLevelProgress(s.key, i).done
      ).length
      const pct = total ? Math.round((done / total) * 100) : 0
      return {
        ...s,
        pct,
        iconBg: s.color + '22',   // 浅色背景
        locked: s.locked || false
      }
    })
    this.setData({ stages })
  },

  _buildDailyTasks() {
    // 取前 5 个学前班关卡作为每日任务
    const stage = STAGES[0]
    const tasks = stage.levels.slice(0, 5).map((lv, i) => {
      const prog = app.getLevelProgress(stage.key, i)
      return {
        name: `${lv.emoji} ${lv.name}`,
        done: prog.done || false,
        reward: 10,
        stageKey: stage.key,
        levelIdx: i
      }
    })
    const todayDone = tasks.filter(t => t.done).length
    this.setData({ dailyTasks: tasks, todayDone })
  },

  gotoStage(e) {
    const { key, locked } = e.currentTarget.dataset
    if (locked) {
      wx.showToast({ title: '完成上一阶段后解锁', icon: 'none' })
      return
    }
    wx.navigateTo({ url: `/pages/stage/stage?key=${key}` })
  },

  startTask(e) {
    const task = this.data.dailyTasks[e.currentTarget.dataset.index]
    if (task.done) return
    wx.navigateTo({
      url: `/pages/game/game?stageKey=${task.stageKey}&levelIdx=${task.levelIdx}`
    })
  },

  claimReward() {
    if (app.globalData.todayRewardClaimed) return
    app.addStars(20)
    app.globalData.todayRewardClaimed = true
    this.setData({ rewardClaimed: true, stars: app.globalData.stars })
    wx.showToast({ title: '领取成功！+20 ⭐', icon: 'success' })
  }
})
