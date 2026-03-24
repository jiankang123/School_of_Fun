// data/stages.js
const STAGES = [
  {
    key: 'pre',
    name: '学前班',
    ageRange: '3–5 岁',
    desc: '建立数字概念',
    emoji: '🍎',
    color: '#FFB300',
    bgGradient: 'linear-gradient(160deg, #FFB300, #FF6F00)',
    levels: [
      { name: '数苹果①', emoji: '🍎', color: '#FFB300', type: 'count', maxNum: 5 },
      { name: '数香蕉②', emoji: '🍌', color: '#FFC107', type: 'count', maxNum: 6 },
      { name: '数草莓③', emoji: '🍓', color: '#EF5350', type: 'count', maxNum: 7 },
      { name: '数星星④', emoji: '⭐', color: '#FF8F00', type: 'count', maxNum: 8 },
      { name: '连线配对①', emoji: '〰️', color: '#AB47BC', type: 'match', pairs: 3 },
      { name: '连线配对②', emoji: '🔗', color: '#8E24AA', type: 'match', pairs: 4 },
      { name: '数气球⑤', emoji: '🎈', color: '#EF5350', type: 'count', maxNum: 9 },
      { name: '数小鱼⑥', emoji: '🐟', color: '#4FC3F7', type: 'count', maxNum: 10 },
      { name: '连线配对③', emoji: '✨', color: '#7B1FA2', type: 'match', pairs: 5 },
    ]
  },
  {
    key: 'kinder',
    name: '幼儿园',
    ageRange: '5–6 岁',
    desc: '基础计算',
    emoji: '🚂',
    color: '#4FC3F7',
    bgGradient: 'linear-gradient(160deg, #4FC3F7, #0288D1)',
    levels: [
      { name: '加法①', emoji: '➕', color: '#4FC3F7', type: 'count', maxNum: 10 },
      { name: '减法①', emoji: '➖', color: '#29B6F6', type: 'count', maxNum: 10 },
      { name: '排序①', emoji: '🚂', color: '#0288D1', type: 'match', pairs: 4 },
    ]
  },
  {
    key: 'g1',
    name: '小学一年级',
    ageRange: '6–7 岁',
    desc: '20以内加减法',
    emoji: '🐱',
    color: '#AB47BC',
    bgGradient: 'linear-gradient(160deg, #AB47BC, #7B1FA2)',
    locked: true,
    levels: [
      { name: '加法进阶', emoji: '🐱', color: '#AB47BC', type: 'count', maxNum: 20 },
    ]
  }
]

module.exports = { STAGES }
