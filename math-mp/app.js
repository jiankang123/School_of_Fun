// app.js
App({
  globalData: {
    userInfo: null,
    stars: 0,
    streak: 0,
    lastLoginDate: '',
    unlockedStages: ['pre'],
    progress: {}   // { 'pre-0': { stars:3, done:true }, ... }
  },

  onLaunch() {
    this._loadStorage()
    this._checkStreak()
  },

  _loadStorage() {
    const keys = ['stars', 'streak', 'lastLoginDate', 'unlockedStages', 'progress']
    keys.forEach(k => {
      const val = wx.getStorageSync(k)
      if (val !== '' && val !== null && val !== undefined) {
        this.globalData[k] = val
      }
    })
  },

  _checkStreak() {
    const today = this._today()
    const last = this.globalData.lastLoginDate
    if (last === today) return

    if (last === this._yesterday()) {
      this.globalData.streak = (this.globalData.streak || 0) + 1
    } else if (last !== today) {
      this.globalData.streak = 1
    }
    this.globalData.lastLoginDate = today
    this.globalData.todayRewardClaimed = false
    this.save('streak')
    this.save('lastLoginDate')
  },

  save(key) {
    wx.setStorageSync(key, this.globalData[key])
  },

  addStars(n) {
    this.globalData.stars = (this.globalData.stars || 0) + n
    this.save('stars')
  },

  saveProgress(stageKey, levelIdx, stars) {
    const key = `${stageKey}-${levelIdx}`
    const old = (this.globalData.progress[key] || {}).stars || 0
    if (stars > old) {
      this.globalData.progress[key] = { stars, done: true }
      wx.setStorageSync('progress', this.globalData.progress)
    }
  },

  getLevelProgress(stageKey, levelIdx) {
    return this.globalData.progress[`${stageKey}-${levelIdx}`] || { stars: 0, done: false }
  },

  _today() {
    const d = new Date()
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
  },
  _yesterday() {
    const d = new Date(Date.now() - 86400000)
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
  }
})
