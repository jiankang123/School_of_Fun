// utils/data.js  —— 关卡数据
const STAGES = {
  starter: {
    title: '启蒙班', desc: '2–3 岁 · 基础认知',
    emoji: '🌱', color: '#66BB6A',
    bg: 'linear-gradient(160deg,#66BB6A,#388E3C)',
    levels: [
      { 
        name: '认动物①', emoji: '🐶', color: '#66BB6A', type: 'recognize', category: 'animal', 
        items: [
          'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=400&fit=crop#狗#https://www.pacdv.com/sounds/domestic_animals_sounds/dog-1.mp3',
          'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&h=400&fit=crop#猫#https://www.pacdv.com/sounds/domestic_animals_sounds/cat-meow-1.mp3',
          'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=500&h=400&fit=crop#猪#https://www.pacdv.com/sounds/domestic_animals_sounds/pig-1.mp3'
        ]
      },
      { 
        name: '认水果①', emoji: '🍎', color: '#8BC34A', type: 'recognize', category: 'fruit', 
        items: ['🍎苹果', '🍌香蕉', '🍊橙子'] 
      },
      { 
        name: '认动物②', emoji: '🐘', color: '#4CAF50', type: 'recognize', category: 'animal', 
        items: [
          'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=500&h=400&fit=crop#大象#https://www.pacdv.com/sounds/animals_sounds/elephant-1.mp3',
          'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=500&h=400&fit=crop#猴子#https://www.pacdv.com/sounds/animals_sounds/monkey-1.mp3',
          'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=500&h=400&fit=crop#兔子',
          'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=500&h=400&fit=crop#狮子#https://www.pacdv.com/sounds/animals_sounds/lion-roar-1.mp3'
        ]
      },
      { 
        name: '认颜色①', emoji: '🎨', color: '#66BB6A', type: 'recognize', category: 'color', 
        items: ['🔴红色', '🔵蓝色', '🟢绿色'] 
      },
      { 
        name: '认水果②', emoji: '🍇', color: '#9CCC65', type: 'recognize', category: 'fruit', 
        items: ['🍇葡萄', '🍉西瓜', '🍓草莓', '🥝猕猴桃'] 
      },
      { 
        name: '认交通工具', emoji: '🚗', color: '#7CB342', type: 'recognize', category: 'vehicle', 
        items: ['🚗汽车', '🚌公交车', '✈️飞机', '🚂火车'] 
      },
      { 
        name: '认形状①', emoji: '⭕', color: '#689F38', type: 'recognize', category: 'shape', 
        items: ['⭕圆形', '⬛方形', '🔺三角形'] 
      },
      { 
        name: '认数字①', emoji: '1️⃣', color: '#558B2F', type: 'recognize', category: 'number', 
        items: ['1️⃣一', '2️⃣二', '3️⃣三'] 
      }
    ]
  },
  pre: {
    title: '学前班', desc: '3–5 岁 · 建立数字概念',
    emoji: '🍎', color: '#FFB300',
    bg: 'linear-gradient(160deg,#FFB300,#FF6F00)',
    levels: [
      { name: '数苹果①', emoji: '🍎', color: '#FFB300', type: 'count', max: 5 },
      { name: '数香蕉②', emoji: '🍌', color: '#FFC107', type: 'count', max: 6 },
      { name: '连线配对①', emoji: '〰️', color: '#AB47BC', type: 'match', pairs: 3 },
      { name: '数草莓③', emoji: '🍓', color: '#EF5350', type: 'count', max: 7 },
      { name: '数星星④', emoji: '⭐', color: '#FF8F00', type: 'count', max: 8 },
      { name: '连线配对②', emoji: '🔗', color: '#8E24AA', type: 'match', pairs: 4 },
      { name: '数气球⑤', emoji: '🎈', color: '#EF5350', type: 'count', max: 9 },
      { name: '数小鱼⑥', emoji: '🐟', color: '#4FC3F7', type: 'count', max: 10 },
      { name: '连线配对③', emoji: '✨', color: '#7B1FA2', type: 'match', pairs: 5 }
    ]
  },
  kinder: {
    title: '幼儿园', desc: '5–6 岁 · 基础计算',
    emoji: '🚂', color: '#4FC3F7',
    bg: 'linear-gradient(160deg,#4FC3F7,#0288D1)',
    levels: [
      { name: '加法①', emoji: '➕', color: '#4FC3F7', type: 'add', maxA: 5, maxB: 4 },
      { name: '加法②', emoji: '➕', color: '#29B6F6', type: 'add', maxA: 8, maxB: 8 },
      { name: '减法①', emoji: '➖', color: '#0288D1', type: 'sub', maxSum: 8 },
      { name: '减法②', emoji: '➖', color: '#0277BD', type: 'sub', maxSum: 12 },
      { name: '混合①', emoji: '🔢', color: '#AB47BC', type: 'mix', maxA: 5, maxSum: 8 }
    ]
  },
  grade1: {
    title: '小学一年级', desc: '6–7 岁 · 20以内加减法',
    emoji: '🏫', color: '#AB47BC',
    bg: 'linear-gradient(160deg,#AB47BC,#6A1B9A)',
    levels: [
      { name: '加到10①', emoji: '➕', color: '#AB47BC', type: 'add20', maxA: 6,  maxB: 6,  limit: 10 },
      { name: '加到20①', emoji: '➕', color: '#9C27B0', type: 'add20', maxA: 10, maxB: 10, limit: 20 },
      { name: '减法①',   emoji: '➖', color: '#8E24AA', type: 'sub20', maxSum: 10 },
      { name: '减法②',   emoji: '➖', color: '#7B1FA2', type: 'sub20', maxSum: 20 },
      { name: '填空加法', emoji: '🔲', color: '#E91E63', type: 'fill',  op: 'add', max: 10 },
      { name: '填空减法', emoji: '🔲', color: '#C2185B', type: 'fill',  op: 'sub', max: 10 },
      { name: '比大小①', emoji: '⚖️', color: '#FF5722', type: 'cmp',   max: 10 },
      { name: '比大小②', emoji: '⚖️', color: '#E64A19', type: 'cmp',   max: 20 },
      { name: '综合加减', emoji: '🔢', color: '#FF6F00', type: 'mix20', maxA: 10, maxSum: 20 },
      { name: '挑战关',   emoji: '🏆', color: '#F44336', type: 'mix20', maxA: 15, maxSum: 20 }
    ]
  }
};

module.exports = { STAGES };
