const app = getApp()
const { STAGES } = require('../../data/stages')

// 每关题目数量
const QUESTIONS_PER_LEVEL = 5

Page({
  data: {
    stageKey: '',
    levelIdx: 0,
    levelName: '',
    gameType: 'count',
    itemEmoji: '🍎',
    progress: 0,
    livesArr: ['❤️', '❤️', '❤️'],

    // count 游戏
    items: [],
    options: [],
    countedNum: 0,

    // match 游戏
    matchLeft: [],
    matchRight: [],
    leftSel: -1,
    rightSel: -1,

    // 反馈
    showFeedback: false,
    feedbackText: '',
    feedbackType: 'correct',
  },

  _qIndex: 0,
  _lives: 3,
  _correctCount: 0,
  _levelConfig: null,
  _matchPaired: 0,

  onLoad(options) {
    const stageKey = options.stageKey || 'pre'
    const levelIdx = parseInt(options.levelIdx) || 0
    const stage = STAGES.find(s => s.key === stageKey)
    const lv = stage ? stage.levels[levelIdx] : null
    if (!lv) { wx.navigateBack(); return }

    this._levelConfig = lv
    this.setData({
      stageKey,
      levelIdx,
      levelName: `${lv.emoji} ${lv.name}`,
      gameType: lv.type,
    })
    this._newQuestion()
  },

  // ─────────────────────────────────
  //  出题
  // ─────────────────────────────────
  _newQuestion() {
    const lv = this._levelConfig
    if (this.data.gameType === 'count') {
      this._newCountQuestion(lv)
    } else if (this.data.gameType === 'match') {
      this._newMatchQuestion(lv)
    }
  },

  _newCountQuestion(lv) {
    const max = lv.maxNum || 5
    const min = Math.max(1, max - 4)
    const answer = Math.floor(Math.random() * (max - min + 1)) + min

    // 生成物品数组
    const items = Array.from({ length: answer }, () => ({ counted: false }))

    // 生成 5 个选项（包含正确答案）
    const opts = new Set([answer])
    while (opts.size < 5) {
      const n = Math.floor(Math.random() * max) + 1
      opts.add(n)
    }
    const options = [...opts]
      .sort(() => Math.random() - 0.5)
      .map(v => ({ value: v, state: '' }))

    this.setData({
      items,
      options,
      countedNum: 0,
      itemEmoji: lv.emoji || '🍎',
      _answer: answer
    })
    this._answer = answer
  },

  _newMatchQuestion(lv) {
    const pairs = lv.pairs || 3
    // 随机生成 pairs 对数字（1-10）
    const nums = []
    while (nums.length < pairs) {
      const n = Math.floor(Math.random() * 9) + 1
      if (!nums.includes(n)) nums.push(n)
    }

    const DOT_EMOJIS = ['', '●', '●●', '●●●', '●●●●', '●●●●●',
      '●●●\n●●●', '●●●\n●●●\n●', '●●●●\n●●●●', '●●●\n●●●\n●●●']

    const left = nums.map((n, i) => ({ label: String(n), value: n, matched: false, id: i }))
    // 右侧打乱顺序
    const right = [...nums]
      .sort(() => Math.random() - 0.5)
      .map((n, i) => ({ dots: DOT_EMOJIS[n] || '●'.repeat(n), value: n, matched: false, id: i }))

    this._matchPaired = 0
    this.setData({
      matchLeft: left,
      matchRight: right,
      leftSel: -1,
      rightSel: -1
    })
  },

  // ─────────────────────────────────
  //  count 游戏交互
  // ─────────────────────────────────
  tapItem(e) {
    const idx = e.currentTarget.dataset.index
    const items = this.data.items
    if (items[idx].counted) return
    items[idx].counted = true
    const countedNum = items.filter(it => it.counted).length
    this.setData({ items, countedNum })
  },

  selectOption(e) {
    const { value, index } = e.currentTarget.dataset
    const correct = this._answer
    if (this.data.options[index].state) return  // 防重复点击

    const options = this.data.options
    if (value === correct) {
      options[index].state = 'correct'
      this.setData({ options })
      this._onCorrect()
    } else {
      options[index].state = 'wrong'
      this.setData({ options })
      this._onWrong()
      setTimeout(() => {
        options[index].state = ''
        this.setData({ options })
      }, 600)
    }
  },

  // ─────────────────────────────────
  //  match 游戏交互
  // ─────────────────────────────────
  tapLeft(e) {
    const idx = e.currentTarget.dataset.index
    if (this.data.matchLeft[idx].matched) return
    this.setData({ leftSel: idx })
    this._tryMatch()
  },

  tapRight(e) {
    const idx = e.currentTarget.dataset.index
    if (this.data.matchRight[idx].matched) return
    this.setData({ rightSel: idx })
    this._tryMatch()
  },

  _tryMatch() {
    const { leftSel, rightSel, matchLeft, matchRight } = this.data
    if (leftSel === -1 || rightSel === -1) return

    const lv = matchLeft[leftSel]
    const rv = matchRight[rightSel]

    if (lv.value === rv.value) {
      // 匹配成功
      matchLeft[leftSel].matched = true
      matchRight[rightSel].matched = true
      this._matchPaired++
      this.setData({ matchLeft, matchRight, leftSel: -1, rightSel: -1 })
      this._showFeedback('correct', '配对正确 🎉')

      if (this._matchPaired >= matchLeft.length) {
        // 本轮全部配对完成
        setTimeout(() => this._onCorrect(), 500)
      }
    } else {
      this._onWrong()
      this.setData({ leftSel: -1, rightSel: -1 })
    }
  },

  // ─────────────────────────────────
  //  答题结果处理
  // ─────────────────────────────────
  _onCorrect() {
    this._correctCount++
    this._qIndex++
    const progress = Math.round((this._qIndex / QUESTIONS_PER_LEVEL) * 100)
    this.setData({ progress })
    this._showFeedback('correct', '太棒了！✨')

    if (this._qIndex >= QUESTIONS_PER_LEVEL) {
      // 关卡完成
      setTimeout(() => this._finishLevel(), 700)
    } else {
      setTimeout(() => this._newQuestion(), 900)
    }
  },

  _onWrong() {
    this._lives--
    const livesArr = ['❤️'.repeat(this._lives), ...Array(3 - this._lives).fill('🖤')].join('').split('')
    // 简化：直接用字符串
    const hearts = '❤️'.repeat(Math.max(0, this._lives))
    this.setData({ livesArr: hearts ? [...hearts.matchAll(/❤️/g)].map(() => '❤️') : [] })
    this._showFeedback('wrong', '再想想 🤔')

    if (this._lives <= 0) {
      setTimeout(() => this._gameOver(), 800)
    }
  },

  _showFeedback(type, text) {
    this.setData({ showFeedback: true, feedbackType: type, feedbackText: text })
    setTimeout(() => this.setData({ showFeedback: false }), 1000)
  },

  _finishLevel() {
    const stars = this._lives >= 3 ? 3 : this._lives >= 1 ? 2 : 1
    app.saveProgress(this.data.stageKey, this.data.levelIdx, stars)
    app.addStars(stars * 10)
    wx.redirectTo({
      url: `/pages/reward/reward?stars=${stars}&stageKey=${this.data.stageKey}&levelIdx=${this.data.levelIdx}`
    })
  },

  _gameOver() {
    wx.showModal({
      title: '别灰心！',
      content: '再试一次，你一定可以的 💪',
      confirmText: '再试一次',
      cancelText: '回关卡',
      success: (res) => {
        if (res.confirm) {
          this._qIndex = 0
          this._lives = 3
          this._correctCount = 0
          this.setData({
            progress: 0,
            livesArr: ['❤️', '❤️', '❤️'],
            countedNum: 0
          })
          this._newQuestion()
        } else {
          wx.navigateBack()
        }
      }
    })
  },

  goBack() {
    wx.navigateBack()
  }
})
