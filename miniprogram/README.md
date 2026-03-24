# 数学启蒙星球 · 微信小程序

## 项目结构

```
miniprogram/
├── app.js                  # 全局入口（加载 store）
├── app.json                # 页面路由 + tabBar 配置
├── app.wxss                # 全局样式（动画、卡片等）
├── sitemap.json
├── project.config.json     # 微信开发者工具配置
├── assets/                 # tab 图标（可替换为正式图标）
│   ├── tab_home.png / tab_home_on.png
│   ├── tab_game.png / tab_game_on.png
│   └── tab_prog.png / tab_prog_on.png
├── utils/
│   ├── data.js             # 关卡数据（STAGES）
│   ├── store.js            # 全局状态 + wx.storage 持久化
│   └── sfx.js              # 音效引擎（PCM 合成 wav base64）
└── pages/
    ├── home/               # 主页（签到、年龄段选择、每日任务）
    ├── stage/              # 关卡地图
    ├── game/               # 游戏核心（5种玩法）
    ├── reward/             # 通关奖励页
    └── progress/           # 进度 + 徽章页
```

## 游戏类型

| 类型 | 玩法 | 阶段 |
|------|------|------|
| `count` | 点击计数 + 选择答案 | 学前班 |
| `match` | 数字⟷点点连线（Canvas 画线）| 学前班 |
| `add/sub/mix` | 加减法，4选1 + 图示 | 幼儿园 |
| `add20/sub20/mix20` | 20以内加减，4选1 | 一年级 |
| `fill` | 填空题（数字键盘）| 一年级 |
| `cmp` | 比大小 ><=  | 一年级 |

## 导入步骤

1. 打开**微信开发者工具** → 「导入项目」
2. 选择 `miniprogram/` 目录
3. 填入你的 **AppID**（在 `project.config.json` 的 `appid` 字段填入）
4. 点击「确定」即可预览

> Tab 图标为占位纯色块，上线前请替换为正式 PNG 图标（81×81px）。

## 注意事项

- **音效**：使用 `wx.createInnerAudioContext` + base64 内嵌 PCM wav，无需外部文件
- **连线游戏**：使用 Canvas 2D API 画线，需真机或开发者工具 2D canvas 支持
- **数据持久化**：`wx.setStorageSync` 本地存储，卸载后清除
- **解锁逻辑**：幼儿园全部通关 → 解锁一年级；每关需完成前一关
