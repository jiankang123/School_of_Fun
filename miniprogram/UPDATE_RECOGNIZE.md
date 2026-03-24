# 启蒙班优化更新说明

## 修复的问题

### 1. ✅ **修复答案判断错误**
**问题**：选任何答案都提示错误  
**原因**：`onOptTap` 对所有答案都用 `Number()` 转换，导致文字答案（如"狗"）转成 `NaN`，永远不等于正确答案  
**解决**：根据游戏类型智能判断，数字游戏用数字比较，文字游戏用字符串比较

```javascript
// 修改前
const val = Number(e.currentTarget.dataset.val);  // 所有答案都转数字
if (val === this._g.ans) { ... }

// 修改后
let userAnswer = val;
if (gameType === 'calc' || gameType === 'count') {
  userAnswer = Number(val);  // 只有数字游戏才转换
}
if (userAnswer === correctAnswer) { ... }
```

---

## 新增功能

### 2. ✅ **使用真实动物图片**
- 使用 **Unsplash 高质量免费图片**
- 图片尺寸：500×400px，圆角卡片，带阴影
- 支持 emoji 和真实图片混合使用

**数据格式**：
```javascript
// 真实图片格式：图片URL#名字#叫声URL
'https://images.unsplash.com/photo-xxx#狗#sound.mp3'

// emoji 格式（向下兼容）
'🍎苹果'
```

### 3. ✅ **添加动物叫声**
- 题目出现 300ms 后自动播放叫声
- 使用免费音效库（pacdv.com）
- 支持的叫声：狗叫、猫叫、猪叫、大象、猴子、狮子吼

### 4. ✅ **避免题目重复**
- 记录已出现的题目（`usedRecogItems`）
- 同一关卡内不会重复出现相同题目
- 全部用完后自动重置，开始新一轮

---

## 修改的文件

| 文件 | 修改内容 |
|------|---------|
| **`pages/game/game.js`** | 1. 修复 `onOptTap` 字符串判断<br>2. `buildRecognize` 支持图片/叫声<br>3. 添加题目去重逻辑 |
| **`pages/game/game.wxml`** | 添加 `<image>` 显示真实图片 |
| **`pages/game/game.wxss`** | 添加 `.recog-image` 样式 |
| **`utils/data.js`** | 更新启蒙班数据，添加真实图片和叫声 URL |

---

## 技术细节

### 图片加载
```xml
<image class="recog-image" wx:if="{{recogImage}}" src="{{recogImage}}" mode="aspectFill"></image>
```
- `mode="aspectFill"`：保持比例填充，裁剪多余部分
- 宽 500rpx × 高 400rpx，自适应屏幕
- 带浮动动画（`animation: float`）

### 叫声播放
```javascript
const audio = wx.createInnerAudioContext();
audio.src = soundUrl;
audio.play();
audio.onEnded(() => audio.destroy());  // 播放完销毁，避免内存泄漏
```

### 题目去重
```javascript
if (!this._g.usedRecogItems) this._g.usedRecogItems = [];
let availableItems = items.filter(it => !this._g.usedRecogItems.includes(it));
if (availableItems.length === 0) {
  this._g.usedRecogItems = [];  // 重置
  availableItems = [...items];
}
```

---

## 当前启蒙班内容

| 关卡 | 类型 | 是否有真实图片 | 是否有叫声 |
|------|------|---------------|-----------|
| 认动物① | 狗、猫、猪 | ✅ | ✅ |
| 认水果① | 苹果、香蕉、橙子 | ❌ emoji | ❌ |
| 认动物② | 大象、猴子、兔子、狮子 | ✅ | ✅ (除兔子) |
| 认颜色① | 红蓝绿 | ❌ emoji | ❌ |
| 认水果② | 葡萄、西瓜等 | ❌ emoji | ❌ |
| 认交通工具 | 汽车、飞机等 | ❌ emoji | ❌ |
| 认形状① | 圆形、方形、三角形 | ❌ emoji | ❌ |
| 认数字① | 一二三 | ❌ emoji | ❌ |

---

## 如何添加更多真实图片/叫声

### 1. 找图片（推荐 Unsplash）
```
https://unsplash.com/s/photos/dog
复制图片 URL，添加裁剪参数：?w=500&h=400&fit=crop
```

### 2. 找叫声（推荐音效库）
- https://www.pacdv.com/sounds/ (免费音效)
- https://freesound.org/ (开源音效)
- https://mixkit.co/free-sound-effects/ (商用免费)

### 3. 更新数据
```javascript
items: [
  '图片URL#名字#叫声URL',
  'https://images.unsplash.com/photo-xxx?w=500&h=400&fit=crop#老虎#https://xxx.com/tiger-roar.mp3'
]
```

---

## 注意事项

1. **网络图片加载**：需要在小程序后台配置域名白名单
   - 登录 mp.weixin.qq.com
   - 开发 → 开发管理 → 服务器域名
   - 添加：`images.unsplash.com`、`www.pacdv.com` 等

2. **音频格式**：建议使用 MP3 或 M4A，体积小，兼容性好

3. **流量消耗**：真实图片会消耗流量，建议只在 Wi-Fi 环境使用，或添加图片缓存

4. **降级策略**：如果图片加载失败，自动显示 emoji（已实现）
