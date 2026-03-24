Page({
  data: { url: '' },
  onLoad(options) {
    const url = decodeURIComponent(options.url || '')
    this.setData({ url })
    wx.setNavigationBarTitle({ title: '外部链接' })
  }
})
