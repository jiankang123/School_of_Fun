// app.js
const store = require('./utils/store');

App({
  onLaunch() {
    store.load();
  },

  globalData: {
    // 通过 store 模块统一管理
  }
});
