// pages/game/game.js
const store  = require('../../utils/store');
const { STAGES } = require('../../utils/data');
const { sfx }    = require('../../utils/sfx');

// ── 辅助 ──
function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(arr)  { return arr.slice().sort(() => Math.random() - .5); }
function makeDots(n) {
  if (n <= 5) return '●'.repeat(n);
  if (n <= 8) { const r = Math.ceil(n / 2); return '●'.repeat(r) + '\n' + '●'.repeat(n - r); }
  return '●●●\n●●●\n' + '●'.repeat(n - 6);
}

Page({
  data: {
    // 公共
    lvEmoji: '', lvName: '', progPct: 0, livesStr: '❤️❤️❤️',
    gameType: '',   // recognize | count | calc | fill | cmp | match
    fbtShow: false, fbtText: '', fbtClass: '',
    // recognize
    recogEmoji: '', recogImage: '', recogName: '',
    // count
    countEmoji: '', countItems: [], counted: 0, cntBump: false,
    // calc
    calcQ: '', calcHint: '',
    // fill
    fillParts: [], fillInput: '', fillBoxState: '', numKeys: [],
    // cmp
    cmpA: 0, cmpB: 0, cmpMid: '?', cmpMidStyle: '', cmpGtState: '', cmpEqState: '', cmpLtState: '',
    // match
    matchLeft: [], matchRight: [], matchLines: [],
    // opts (shared)
    opts: []
  },

  // 内部状态（不需要 setData 的）
  _g: {},

  onLoad(options) {
    const sk = options.sk || 'pre';
    const li = parseInt(options.li) || 0;
    this.startGame(sk, li);
  },

  // ════════ 核心流程 ════════
  startGame(sk, li) {
    const lv = STAGES[sk].levels[li];
    this._g = { sk, li, lv, qIdx: 0, total: 5, lives: 3, locked: false };
    this.setData({
      lvEmoji:  lv.emoji,
      lvName:   lv.name,
      progPct:  0,
      livesStr: '❤️❤️❤️'
    });
    this.nextQ();
  },

  nextQ() {
    this.hideFbt();
    const t = this._g.lv.type;
    if      (t === 'recognize')                          this.buildRecognize();
    else if (t === 'count')                              this.buildCount();
    else if (t === 'match')                              this.buildMatch();
    else if (t === 'add' || t === 'sub' || t === 'mix')  this.buildCalc(false);
    else if (t === 'add20' || t === 'sub20' || t === 'mix20') this.buildCalc(true);
    else if (t === 'fill')                               this.buildFill();
    else if (t === 'cmp')                                this.buildCmp();
  },

  // ════════ RECOGNIZE（认知类游戏）════════
  buildRecognize() {
    const lv = this._g.lv;
    const items = lv.items || [];
    if (items.length === 0) return;

    // 初始化已用题目池（避免重复）
    if (!this._g.usedRecogItems) this._g.usedRecogItems = [];
    
    // 筛选未用过的题目
    let availableItems = items.filter(it => !this._g.usedRecogItems.includes(it));
    if (availableItems.length === 0) {
      // 全部用完了，重置
      this._g.usedRecogItems = [];
      availableItems = [...items];
    }

    // 随机选一个作为题目
    const target = availableItems[rnd(0, availableItems.length - 1)];
    this._g.usedRecogItems.push(target);
    
    // 分离 emoji/图片URL 和文字
    // 格式：'🐶狗' 或 'https://...#狗'
    let emoji = '';
    let imageUrl = '';
    let name = '';
    let soundUrl = '';
    
    if (target.includes('#')) {
      // 真实图片格式：URL#名字#叫声URL
      const parts = target.split('#');
      imageUrl = parts[0];
      name = parts[1] || '';
      soundUrl = parts[2] || '';
    } else {
      // emoji 格式
      const chars = Array.from(target);
      if (chars.length >= 2) {
        emoji = chars[0];
        name = chars.slice(1).join('');
      } else {
        return;
      }
    }

    this._g.ans = name;

    // 生成选项：正确答案 + 其他项
    let pool = [name];
    const otherItems = items.filter(it => it !== target);
    shuffle(otherItems).slice(0, 3).forEach(it => {
      if (it.includes('#')) {
        const ps = it.split('#');
        if (ps[1]) pool.push(ps[1]);
      } else {
        const cs = Array.from(it);
        if (cs.length >= 2) pool.push(cs.slice(1).join(''));
      }
    });
    
    // 如果不够 4 个选项，用默认填充
    while (pool.length < 4) pool.push('？');
    pool = shuffle(pool);

    this.setData({
      gameType: 'recognize',
      recogEmoji: emoji,
      recogImage: imageUrl,
      recogName: name,
      opts: pool.map(v => ({ val: v, state: '' }))
    });
    
    // 播放叫声
    if (soundUrl) {
      setTimeout(() => {
        const audio = wx.createInnerAudioContext();
        audio.src = soundUrl;
        audio.play();
        audio.onEnded(() => audio.destroy());
        audio.onError(() => audio.destroy());
      }, 300);
    }
  },

  // ════════ COUNT ════════
  buildCount() {
    const lv  = this._g.lv;
    const max = lv.max || 5, min = Math.max(1, max - 4);
    const ans = rnd(min, max);
    this._g.ans = ans;
    const items = Array.from({ length: ans }, (_, i) => ({ idx: i, hit: false }));
    let pool = [ans];
    for (let t = 0; pool.length < 5 && t < 50; t++) {
      const c = rnd(1, max);
      if (!pool.includes(c)) pool.push(c);
    }
    pool = shuffle(pool);
    this.setData({
      gameType: 'count',
      countEmoji: lv.emoji,
      countItems: items,
      counted: 0,
      cntBump: false,
      opts: pool.map(v => ({ val: v, state: '' }))
    });
  },

  onDotTap(e) {
    const idx   = e.currentTarget.dataset.idx;
    const items = this.data.countItems;
    if (items[idx].hit) return;
    items[idx].hit = true;
    const cnt = this.data.counted + 1;
    this.setData({ countItems: items, counted: cnt, cntBump: false });
    setTimeout(() => this.setData({ cntBump: true }), 10);
    sfx('tap');
  },

  // ════════ CALC ════════
  buildCalc(is20) {
    const lv   = this._g.lv;
    const rawT = lv.type;
    const type = (rawT === 'mix' || rawT === 'mix20')
      ? (Math.random() < .5 ? (is20 ? 'add20' : 'add') : (is20 ? 'sub20' : 'sub'))
      : rawT;

    let a, b, ans, qText, hint;

    if (type === 'add' || type === 'add20') {
      const limit = lv.limit || (is20 ? 20 : 18);
      do {
        a = rnd(1, lv.maxA || 10);
        b = rnd(1, lv.maxB || 10);
      } while (a + b > limit);
      ans   = a + b;
      qText = `${a} + ${b} = ?`;
      hint  = is20 ? `${a} 加 ${b}，答案在 1 ~ ${limit} 之间`
                   : '●'.repeat(a) + '  +  ' + '●'.repeat(b);
    } else {
      const maxSum = lv.maxSum || (is20 ? 20 : 12);
      const sum    = rnd(3, maxSum);
      b = rnd(1, sum - 1);
      a = sum; ans = a - b;
      qText = `${a} − ${b} = ?`;
      hint  = is20 ? `${a} 减 ${b}，结果是几？`
                   : '●'.repeat(ans) + '  ~~' + '●'.repeat(b) + '~~';
    }
    this._g.ans = ans;

    const maxV = lv.maxSum || (is20 ? 20 : 12);
    let pool = [ans];
    for (let t = 0; pool.length < 4 && t < 80; t++) {
      const d    = rnd(-3, 3);
      if (d === 0) continue;
      const cand = ans + d;
      if (cand >= 0 && cand <= maxV + 3 && !pool.includes(cand)) pool.push(cand);
    }
    let fill = 0;
    while (pool.length < 4) { if (!pool.includes(fill)) pool.push(fill); fill++; }
    pool = shuffle(pool);

    this.setData({
      gameType: 'calc',
      calcQ:    qText,
      calcHint: hint,
      opts:     pool.map(v => ({ val: v, state: '' }))
    });
  },

  onOptTap(e) {
    if (this._g.locked) return;
    const idx = e.currentTarget.dataset.idx;
    const val = e.currentTarget.dataset.val;
    
    // 识别答案类型：数字游戏用 Number 比较，文字游戏用字符串比较
    let userAnswer = val;
    let correctAnswer = this._g.ans;
    
    if (this.data.gameType === 'calc' || this.data.gameType === 'count') {
      userAnswer = Number(val);
      correctAnswer = Number(this._g.ans);
    }
    
    this._g.locked = true;
    const opts = this.data.opts.map((o, i) => ({ ...o }));
    
    if (userAnswer === correctAnswer) {
      opts[idx].state = 'ok';
      this.setData({ opts });
      this.showFbt('ok', '✨ 答对了！');
      this.onCorrect();
    } else {
      opts[idx].state = 'bad';
      this.setData({ opts });
      this.showFbt('bad', '再想想 🤔');
      this.onWrong();
      setTimeout(() => {
        opts[idx].state = '';
        this.setData({ opts });
        this._g.locked = false;
      }, 750);
    }
  },

  // ════════ FILL ════════
  buildFill() {
    const lv  = this._g.lv;
    const op  = lv.op || 'add';
    const max = lv.max || 10;
    let a, b, ans, parts;

    if (op === 'add') {
      const sum = rnd(2, max);
      b = rnd(1, sum - 1); a = sum - b;
      if (Math.random() < .5) { ans = a; parts = [{ type:'box' }, { type:'op', val:'+' }, { type:'num', val:b }, { type:'op', val:'=' }, { type:'num', val:sum }]; }
      else                     { ans = b; parts = [{ type:'num', val:a }, { type:'op', val:'+' }, { type:'box' }, { type:'op', val:'=' }, { type:'num', val:sum }]; }
    } else {
      const total = rnd(2, max);
      b = rnd(1, total - 1); a = total;
      ans   = b;
      parts = [{ type:'num', val:a }, { type:'op', val:'−' }, { type:'box' }, { type:'op', val:'=' }, { type:'num', val:a - b }];
    }
    this._g.ans      = ans;
    this._g.fillInput = '';

    const maxKey = Math.min(max, 20);
    const keys   = [];
    for (let i = 1; i <= maxKey; i++) keys.push(i);
    keys.push(0); keys.push('⌫');

    this.setData({
      gameType:     'fill',
      fillParts:    parts,
      fillInput:    '',
      fillBoxState: '',
      numKeys:      keys
    });
  },

  onNumTap(e) {
    if (this._g.locked) return;
    const k  = e.currentTarget.dataset.k;
    let cur  = this.data.fillInput;

    if (k === '⌫') { this.setData({ fillInput: '', fillBoxState: '' }); this._g.fillInput = ''; return; }

    let next = cur + String(k);
    if (next.length > 2) next = String(k);
    this._g.fillInput = next;
    this.setData({ fillInput: next });

    const val      = parseInt(next, 10);
    const needTwo  = this._g.ans >= 10;
    if (needTwo && next.length < 2) return;

    this._g.locked = true;
    if (val === this._g.ans) {
      this.setData({ fillBoxState: 'ok' });
      this.showFbt('ok', '✨ 答对了！');
      this.onCorrect();
    } else if (!needTwo || next.length === 2) {
      this.setData({ fillBoxState: 'bad' });
      this.showFbt('bad', '再想想 🤔');
      this.onWrong();
      setTimeout(() => {
        this.setData({ fillInput: '', fillBoxState: '' });
        this._g.fillInput = '';
        this._g.locked = false;
      }, 750);
    }
  },

  // ════════ CMP ════════
  buildCmp() {
    const max = this._g.lv.max || 10;
    let a = rnd(0, max), b = rnd(0, max);
    while (a === b) b = rnd(0, max);
    this._g.ans = a > b ? '>' : '<';
    this.setData({
      gameType: 'cmp', cmpA: a, cmpB: b,
      cmpMid: '?', cmpMidStyle: 'color:#FFB300',
      cmpGtState: '', cmpEqState: '', cmpLtState: ''
    });
  },

  onCmpTap(e) {
    if (this._g.locked) return;
    const v = e.currentTarget.dataset.v;
    this._g.locked = true;
    const stKey = v === '>' ? 'cmpGtState' : v === '=' ? 'cmpEqState' : 'cmpLtState';
    if (v === this._g.ans) {
      this.setData({ [stKey]: 'ok', cmpMid: v, cmpMidStyle: 'color:#66BB6A' });
      this.showFbt('ok', '✨ 答对了！');
      this.onCorrect();
    } else {
      this.setData({ [stKey]: 'bad' });
      this.showFbt('bad', '再想想 🤔');
      this.onWrong();
      setTimeout(() => { this.setData({ [stKey]: '' }); this._g.locked = false; }, 750);
    }
  },

  // ════════ MATCH ════════
  buildMatch() {
    const pairs = this._g.lv.pairs || 3;
    let nums = [];
    while (nums.length < pairs) {
      const n = rnd(1, 9);
      if (!nums.includes(n)) nums.push(n);
    }
    const shuffled = shuffle(nums);
    this._g.mLeft   = nums;
    this._g.mRight  = shuffled;
    this._g.mPaired = 0;
    this._g.lSel    = -1;
    this._g.rSel    = -1;
    this._g.pairs   = pairs;
    this._g.lines   = [];
    this._rowRects  = null;

    const left  = nums.map(n => ({ val: n, state: '' }));
    const right = shuffled.map(n => ({ val: n, dots: makeDots(n), state: '' }));

    this.setData({ gameType: 'match', matchLeft: left, matchRight: right, matchLines: [] });
    setTimeout(() => this.measureRows(), 300);
  },

  measureRows() {
    const query = wx.createSelectorQuery().in(this);
    query.select('.match-wrap').boundingClientRect();
    query.selectAll('.mi.num').boundingClientRect();
    query.selectAll('.mi.dots').boundingClientRect();
    query.exec(res => {
      const wrap   = res[0];
      const lefts  = res[1];
      const rights = res[2];
      if (!wrap || !lefts || !rights) return;

      this._rowRects = {
        wrapW: wrap.width,
        left:  lefts.map(r => ({
          y:  r.top   - wrap.top  + r.height / 2,
          x2: r.right - wrap.left
        })),
        right: rights.map(r => ({
          y:  r.top  - wrap.top  + r.height / 2,
          x1: r.left - wrap.left
        }))
      };
      this.redrawLines();
    });
  },

  redrawLines() {
    const rects = this._rowRects;
    if (!rects) return;

    const lines = this._g.lines.map(line => {
      const lRect = rects.left[line.li];
      const rRect = rects.right[line.ri];
      if (!lRect || !rRect) return null;

      const x1 = lRect.x2;
      const y1 = lRect.y;
      const x2 = rRect.x1;
      const y2 = rRect.y;

      const dx  = x2 - x1;
      const dy  = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      const deg = Math.atan2(dy, dx) * 180 / Math.PI;

      return {
        ok:   line.ok,
        top:  y1,
        left: x1,
        width: len,
        deg:  deg
      };
    }).filter(Boolean);

    this.setData({ matchLines: lines });
  },

  onLeftTap(e) {
    if (this._g.locked) return;
    const li = Number(e.currentTarget.dataset.li);
    const left = this.data.matchLeft.map((m, i) =>
      ({ ...m, state: m.state === 'ok' ? 'ok' : (i === li ? 'sel' : '') })
    );
    this.setData({ matchLeft: left });
    this._g.lSel = li;
    this.tryPair();
  },

  onRightTap(e) {
    if (this._g.locked) return;
    const ri = Number(e.currentTarget.dataset.ri);
    const right = this.data.matchRight.map((m, i) =>
      ({ ...m, state: m.state === 'ok' ? 'ok' : (i === ri ? 'sel' : '') })
    );
    this.setData({ matchRight: right });
    this._g.rSel = ri;
    this.tryPair();
  },

  tryPair() {
    const { lSel, rSel, mLeft, mRight } = this._g;
    if (lSel === -1 || rSel === -1) return;
    const lv = mLeft[lSel], rv = mRight[rSel];
    if (lv === rv) {
      const left  = this.data.matchLeft.map((m, i)  => ({ ...m, state: i === lSel ? 'ok' : m.state }));
      const right = this.data.matchRight.map((m, i) => ({ ...m, state: i === rSel ? 'ok' : m.state }));
      this.setData({ matchLeft: left, matchRight: right });
      this._g.lines.push({ li: lSel, ri: rSel, ok: true });
      this.redrawLines();
      this._g.mPaired++;
      this._g.lSel = -1; this._g.rSel = -1;
      this.showFbt('ok', '配对正确 🎉');
      if (this._g.mPaired >= this._g.pairs) setTimeout(() => this.onCorrect(), 600);
    } else {
      const left  = this.data.matchLeft.map((m, i)  => ({ ...m, state: i === lSel ? 'bad' : m.state }));
      const right = this.data.matchRight.map((m, i) => ({ ...m, state: i === rSel ? 'bad' : m.state }));
      this.setData({ matchLeft: left, matchRight: right });
      this._g.lines.push({ li: lSel, ri: rSel, ok: false });
      this.redrawLines();
      this.showFbt('bad', '再想想 🤔');
      this.onWrong();
      setTimeout(() => {
        const l2 = this.data.matchLeft.map(m  => ({ ...m, state: m.state === 'bad' ? '' : m.state }));
        const r2 = this.data.matchRight.map(m => ({ ...m, state: m.state === 'bad' ? '' : m.state }));
        this.setData({ matchLeft: l2, matchRight: r2 });
        this._g.lines = this._g.lines.filter(ln => ln.ok);
        this.redrawLines();
        this._g.lSel = -1; this._g.rSel = -1;
      }, 700);
    }
  },

  // ════════ 结果处理 ════════
  onCorrect() {
    this._g.qIdx++;
    const pct = Math.round(this._g.qIdx / this._g.total * 100);
    this.setData({ progPct: pct });
    if (this._g.qIdx >= this._g.total) {
      setTimeout(() => this.finishLevel(), 600);
    } else {
      setTimeout(() => { this._g.locked = false; this.nextQ(); }, 900);
    }
  },

  onWrong() {
    this._g.lives = Math.max(0, this._g.lives - 1);
    const n = this._g.lives;
    this.setData({ livesStr: '❤️'.repeat(n) + '🖤'.repeat(3 - n) });
    if (n <= 0) setTimeout(() => this.gameOver(), 800);
  },

  finishLevel() {
    const stars = this._g.lives >= 3 ? 3 : this._g.lives >= 1 ? 2 : 1;
    store.sp(this._g.sk, this._g.li, stars);
    const G = store.get();
    store.setG('stars', G.stars + stars * 10);
    sfx(stars === 3 ? 'win3' : 'win');
    wx.redirectTo({
      url: `/pages/reward/reward?sk=${this._g.sk}&li=${this._g.li}&stars=${stars}&lives=${this._g.lives}`
    });
  },

  gameOver() {
    wx.showToast({ title: '别灰心，再试一次！💪', icon: 'none', duration: 1500 });
    setTimeout(() => this.startGame(this._g.sk, this._g.li), 1800);
  },

  // ════════ 反馈 ════════
  showFbt(type, text) {
    clearTimeout(this._fbtTimer);
    this.setData({ fbtShow: true, fbtText: text, fbtClass: type });
    if (type === 'ok') sfx('correct');
    else               sfx('wrong');
    this._fbtTimer = setTimeout(() => this.hideFbt(), 1000);
  },

  hideFbt() { this.setData({ fbtShow: false }); },

  goBack() {
    wx.navigateBack();
  },

  // 分享功能
  onShareAppMessage() {
    const lv = this._g.lv || {};
    return {
      title: `${lv.emoji} ${lv.name} - 来挑战这一关！`,
      path: `/pages/game/game?sk=${this._g.sk}&li=${this._g.li}`,
      imageUrl: ''
    };
  }
});
