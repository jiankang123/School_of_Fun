const { QA } = require('../../data/qa')

Page({
  data: {
    item: null,
    prevId: 0,
    nextId: 0,
    keyword: '',
    filteredIds: []
  },

  onLoad(options) {
    const id = parseInt(options.id)
    const keyword = decodeURIComponent(options.keyword || '')
    this.setData({ keyword })

    // 重建过滤后的 ID 列表（保持和首页一致的顺序）
    const kw = keyword.trim().toLowerCase()
    const filteredIds = QA
      .filter(q => !kw || q.q.toLowerCase().includes(kw) || q.a.toLowerCase().includes(kw) || q.steps.join(' ').toLowerCase().includes(kw))
      .map(q => q.id)

    this.setData({ filteredIds })
    this._loadItem(id)
  },

  _loadItem(id) {
    const item = QA.find(q => q.id === id)
    if (!item) return

    const { filteredIds } = this.data
    const idx = filteredIds.indexOf(id)
    const prevId = idx > 0 ? filteredIds[idx - 1] : 0
    const nextId = idx < filteredIds.length - 1 ? filteredIds[idx + 1] : 0

    this.setData({ item, prevId, nextId })
    wx.setNavigationBarTitle({ title: `Q${item.id} · ${item.cat}` })
  },

  goPrev() {
    if (this.data.prevId) this._loadItem(this.data.prevId)
  },

  goNext() {
    if (this.data.nextId) this._loadItem(this.data.nextId)
  }
})
