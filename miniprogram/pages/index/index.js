const { QA, CATS, RESOURCES } = require('../../data/qa')

Page({
  data: {
    tabs: [
      { key: 'qa', label: '❓ 问题速查' },
      { key: 'start', label: '🚀 新手入门' },
      { key: 'skills', label: '🧩 Skills' },
      { key: 'res', label: '🔗 资源导航' }
    ],
    activeTab: 'qa',
    cats: CATS,
    curCat: '全部',
    keyword: '',
    filteredList: [],
    groupedList: [],
    showGroup: true,
    totalCount: QA.length,
    resources: RESOURCES,
    cmds: [
      { cmd: 'openclaw gateway start', desc: '启动服务' },
      { cmd: 'openclaw gateway stop', desc: '停止服务' },
      { cmd: 'openclaw gateway restart', desc: '重启服务' },
      { cmd: 'openclaw gateway status', desc: '查看状态' },
      { cmd: 'openclaw dashboard', desc: '打开控制台' },
      { cmd: 'openclaw update', desc: '更新版本' },
      { cmd: 'openclaw doctor', desc: '诊断问题' },
      { cmd: 'openclaw logs --follow', desc: '查看实时日志' },
      { cmd: 'openclaw channels status', desc: '检查频道状态' },
      { cmd: 'openclaw cron list', desc: '查看定时任务' },
      { cmd: 'openclaw config get', desc: '查看配置' }
    ],
    skillMarket: [
      { badge: '官方', name: '🏪 ClawHub 官方市场', desc: '5400+ 技能，官方出品', url: 'https://clawhub.ai/' },
      { badge: '精选', name: '⭐ Awesome OpenClaw Skills', desc: 'GitHub 精选技能合集', url: 'https://github.com/VoltAgent/awesome-openclaw-skills' },
      { badge: '社区', name: '🔒 麻小安全策略 Skill v1.2', desc: '社区精选安全配置技能', url: 'https://clawhub.ai/' }
    ],
    skillVideos: [
      { badge: '1min', name: 'Skills 入门教程', desc: 'YouTube · 快速上手', url: 'https://www.youtube.com/watch?v=xFRRo9fo7Ko' },
      { badge: '实用', name: '5 个实用 Skills 推荐', desc: 'YouTube · 效率必备', url: 'https://www.youtube.com/watch?v=F6MUCXQn1n0' },
      { badge: '进阶', name: 'Skills 开发教程', desc: 'YouTube · 自己写 Skill', url: 'https://www.youtube.com/watch?v=CENnPXxVUAc' }
    ]
  },

  onLoad() {
    this._applyFilter()
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.key })
  },

  switchCat(e) {
    this.setData({ curCat: e.currentTarget.dataset.cat }, () => {
      this._applyFilter()
    })
  },

  onSearch(e) {
    this.setData({ keyword: e.detail.value }, () => {
      this._applyFilter()
    })
  },

  clearSearch() {
    this.setData({ keyword: '' }, () => {
      this._applyFilter()
    })
  },

  _applyFilter() {
    const { curCat, keyword } = this.data
    const kw = keyword.trim().toLowerCase()

    const filtered = QA.filter(item => {
      const catOk = curCat === '全部' || item.cat === curCat
      const kwOk = !kw ||
        item.q.toLowerCase().includes(kw) ||
        item.a.toLowerCase().includes(kw) ||
        item.steps.join(' ').toLowerCase().includes(kw)
      return catOk && kwOk
    })

    const showGroup = curCat === '全部' && !kw

    // 分组
    const groupMap = {}
    filtered.forEach(item => {
      if (!groupMap[item.cat]) groupMap[item.cat] = []
      groupMap[item.cat].push(item)
    })
    const groupedList = Object.keys(groupMap).map(cat => ({
      cat,
      list: groupMap[cat]
    }))

    this.setData({ filteredList: filtered, groupedList, showGroup })
  },

  openDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}&keyword=${encodeURIComponent(this.data.keyword)}`
    })
  },

  openUrl(e) {
    const url = e.currentTarget.dataset.url
    if (!url) return
    wx.navigateTo({
      url: `/pages/webview/webview?url=${encodeURIComponent(url)}`
    })
  },

  copyCode(e) {
    const code = e.currentTarget.dataset.code
    wx.setClipboardData({
      data: code,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success', duration: 1200 })
      }
    })
  }
})
