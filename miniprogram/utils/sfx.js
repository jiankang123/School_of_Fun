// utils/sfx.js  —— 小程序音效（真机兼容版：base64 → 临时文件 → 播放）

// ── 纯 JS Base64 编码器（不依赖 btoa）──
const B64CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function encodeBase64(bytes) {
  let out = '', i = 0, len = bytes.length;
  while (i < len) {
    const b0 = bytes[i++], b1 = i < len ? bytes[i++] : 0, b2 = i < len ? bytes[i++] : 0;
    out += B64CHARS[b0 >> 2];
    out += B64CHARS[((b0 & 3) << 4) | (b1 >> 4)];
    out += B64CHARS[((b1 & 0xf) << 2) | (b2 >> 6)];
    out += B64CHARS[b2 & 0x3f];
  }
  const pad = len % 3;
  if (pad === 1) out = out.slice(0, -2) + '==';
  else if (pad === 2) out = out.slice(0, -1) + '=';
  return out;
}

// ── 写小端整数 ──
function w32le(arr, offset, v) {
  arr[offset]   =  v        & 0xff;
  arr[offset+1] = (v >>  8) & 0xff;
  arr[offset+2] = (v >> 16) & 0xff;
  arr[offset+3] = (v >> 24) & 0xff;
}
function w16le(arr, offset, v) {
  arr[offset]   =  v       & 0xff;
  arr[offset+1] = (v >> 8) & 0xff;
}

/**
 * 生成多段正弦音符，返回 ArrayBuffer (WAV 格式)
 */
function makeToneWAV(freqs, durs) {
  const RATE = 8000;

  const segments = freqs.map((f, idx) => {
    const dur     = durs[idx] || 0.12;
    const n       = Math.floor(RATE * dur);
    const buf     = new Array(n);
    for (let i = 0; i < n; i++) {
      const t    = i / RATE;
      const fade = i < 200 ? i / 200 : (i > n - 400 ? (n - i) / 400 : 1);
      buf[i] = Math.floor(127 + 110 * Math.sin(2 * Math.PI * f * t) * fade);
    }
    return buf;
  });

  let totalLen = 0;
  segments.forEach(s => { totalLen += s.length; });
  const pcm = new Array(totalLen);
  let off = 0;
  segments.forEach(s => { s.forEach(v => { pcm[off++] = v; }); });

  const dataLen = totalLen;
  const fileLen = 36 + dataLen;
  const wav     = new Array(44 + dataLen);

  wav[0]=0x52; wav[1]=0x49; wav[2]=0x46; wav[3]=0x46; // "RIFF"
  w32le(wav, 4, fileLen);
  wav[8]=0x57; wav[9]=0x41; wav[10]=0x56; wav[11]=0x45; // "WAVE"
  wav[12]=0x66; wav[13]=0x6d; wav[14]=0x74; wav[15]=0x20; // "fmt "
  w32le(wav, 16, 16);
  w16le(wav, 20, 1);
  w16le(wav, 22, 1);
  w32le(wav, 24, RATE);
  w32le(wav, 28, RATE);
  w16le(wav, 32, 1);
  w16le(wav, 34, 8);
  wav[36]=0x64; wav[37]=0x61; wav[38]=0x74; wav[39]=0x61; // "data"
  w32le(wav, 40, dataLen);
  for (let i = 0; i < dataLen; i++) wav[44 + i] = pcm[i] & 0xff;

  // 转成 ArrayBuffer
  const buffer = new ArrayBuffer(wav.length);
  const view   = new Uint8Array(buffer);
  for (let i = 0; i < wav.length; i++) view[i] = wav[i];
  return buffer;
}

// ── 预生成各音效的 WAV ArrayBuffer ──
const SFX_BUFFERS = {
  correct: makeToneWAV([523, 659],              [0.08, 0.13]),
  wrong:   makeToneWAV([196, 165],              [0.12, 0.18]),
  tap:     makeToneWAV([880],                   [0.06]),
  win:     makeToneWAV([523, 659, 784],         [0.10, 0.10, 0.22]),
  win3:    makeToneWAV([523, 659, 784, 1047],   [0.09, 0.09, 0.09, 0.28]),
  coin:    makeToneWAV([523, 659, 784, 880, 1047], [0.06, 0.06, 0.06, 0.06, 0.10])
};

// ── 临时文件缓存（写一次，重复用）──
const _tempFiles = {};
const _ctxMap    = {};

function sfx(name) {
  const buffer = SFX_BUFFERS[name];
  if (!buffer) return;

  // 如果已有临时文件，直接播放
  if (_tempFiles[name]) {
    playFromPath(_tempFiles[name], name);
    return;
  }

  // 否则写临时文件
  const fs   = wx.getFileSystemManager();
  const path = `${wx.env.USER_DATA_PATH}/sfx_${name}.wav`;
  try {
    fs.writeFileSync(path, buffer, 'binary');
    _tempFiles[name] = path;
    playFromPath(path, name);
  } catch (e) {
    console.warn('sfx write failed:', e);
  }
}

function playFromPath(path, name) {
  try {
    if (_ctxMap[name]) {
      _ctxMap[name].stop();
      _ctxMap[name].destroy();
    }
    const ctx  = wx.createInnerAudioContext();
    ctx.src    = path;
    ctx.volume = 0.8;
    ctx.play();
    _ctxMap[name] = ctx;
  } catch (e) {
    console.warn('sfx play failed:', e);
  }
}

module.exports = { sfx };
