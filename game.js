/* Çılgın Araba Atölyesi — 4 yaş için araba oyunu
 * Arabanın her şeyini değiştir, yola çık, komik şeyler yaşa, bitiş çizgisine ulaş, tekrar oyna!
 */
'use strict';

// ============================================================ temel
const W = 1280, H = 720, TAU = Math.PI * 2;
const cv = document.getElementById('game');
const ctx = cv.getContext('2d');
let DPR = 1, SC = 1, OX = 0, OY = 0;
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.round(innerWidth * DPR);
  cv.height = Math.round(innerHeight * DPR);
  cv.style.width = innerWidth + 'px';
  cv.style.height = innerHeight + 'px';
  SC = Math.min(innerWidth / W, innerHeight / H);
  OX = (innerWidth - W * SC) / 2;
  OY = (innerHeight - H * SC) / 2;
}
addEventListener('resize', resize);
resize();

const FONT = '"Baloo 2","Comic Sans MS","Chalkboard SE","Trebuchet MS",sans-serif';
const EMOJI = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Segoe UI Symbol",sans-serif';
const OUT = '#2d2a3a';
const GLASS = '#bfe8ff';

const rand = (a, b) => a + Math.random() * (b - a);
const randi = (a, b) => Math.floor(rand(a, b + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = t => 1 - (1 - t) * (1 - t);
function hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function hexToRgb(h) {
  h = h.replace('#', '');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function shade(h, amt) {
  const [r, g, b] = hexToRgb(h);
  const f = v => Math.round(clamp(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt, 0, 255));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
function lum(h) { const [r, g, b] = hexToRgb(h); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; }

function rr(x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}
function circ(x, y, r, fill, stroke) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) ctx.stroke();
}
function ell(x, y, rx, ry, rot, fill, stroke) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot || 0, 0, TAU);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) ctx.stroke();
}
function starPath(x, y, r, ri, n = 5, rot = -Math.PI / 2) {
  ctx.beginPath();
  for (let i = 0; i < n * 2; i++) {
    const rad = i % 2 ? ri : r, a = rot + (i * Math.PI) / n;
    ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
  }
  ctx.closePath();
}
function heartPath(x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.9);
  ctx.bezierCurveTo(x - s * 1.5, y + s * 0.0, x - s * 0.9, y - s * 1.2, x, y - s * 0.4);
  ctx.bezierCurveTo(x + s * 0.9, y - s * 1.2, x + s * 1.5, y + s * 0.0, x, y + s * 0.9);
  ctx.closePath();
}
function text(str, x, y, size, fill, opts = {}) {
  ctx.font = `${opts.weight || 800} ${size}px ${opts.font || FONT}`;
  ctx.textAlign = opts.align || 'center';
  ctx.textBaseline = 'middle';
  if (opts.stroke) {
    ctx.lineWidth = opts.lw || size * 0.16; ctx.strokeStyle = opts.stroke; ctx.lineJoin = 'round';
    ctx.strokeText(str, x, y);
  }
  ctx.fillStyle = fill; ctx.fillText(str, x, y);
}
function emoji(str, x, y, size) {
  ctx.font = `${size}px ${EMOJI}`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#000';
  ctx.fillText(str, x, y + size * 0.06);
}

// ============================================================ ses
const Snd = {
  ac: null, master: null, music: null, nbuf: null, muted: false,
  init() {
    if (this.ac) { if (this.ac.state === 'suspended') this.ac.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      this.ac = new AC();
      this.master = this.ac.createGain();
      this.master.gain.value = this.muted ? 0 : 0.8;
      this.master.connect(this.ac.destination);
      this.music = this.ac.createGain();
      this.music.gain.value = 0.55;
      this.music.connect(this.master);
      const len = this.ac.sampleRate * 2;
      this.nbuf = this.ac.createBuffer(1, len, this.ac.sampleRate);
      const d = this.nbuf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) { this.ac = null; }
  },
  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : 0.8;
    if (m && 'speechSynthesis' in window) speechSynthesis.cancel();
  },
  tone(f, dur, o = {}) {
    const ac = this.ac; if (!ac) return;
    const t0 = ac.currentTime + (o.delay || 0);
    const osc = ac.createOscillator();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(f, t0);
    if (o.slide) osc.frequency.exponentialRampToValueAtTime(o.slide, t0 + dur);
    const g = ac.createGain();
    const v = o.vol == null ? 0.2 : o.vol;
    const att = o.attack || 0.01;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(v, t0 + att);
    if (o.hold) g.gain.setValueAtTime(v, t0 + dur * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    let node = osc;
    if (o.filter) {
      const fl = ac.createBiquadFilter();
      fl.type = o.ftype || 'lowpass'; fl.frequency.value = o.filter; fl.Q.value = o.q || 1;
      osc.connect(fl); node = fl;
    }
    node.connect(g); g.connect(o.dest || this.master);
    if (o.vib) {
      const l = ac.createOscillator(); l.frequency.value = o.vib[0];
      const lg = ac.createGain(); lg.gain.value = o.vib[1];
      l.connect(lg); lg.connect(osc.frequency); l.start(t0); l.stop(t0 + dur + 0.05);
    }
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  },
  noise(dur, o = {}) {
    const ac = this.ac; if (!ac) return;
    const t0 = ac.currentTime + (o.delay || 0);
    const src = ac.createBufferSource(); src.buffer = this.nbuf;
    const fl = ac.createBiquadFilter(); fl.type = o.ftype || 'lowpass';
    fl.frequency.setValueAtTime(o.freq || 1000, t0); fl.Q.value = o.q || 1;
    if (o.slide) fl.frequency.exponentialRampToValueAtTime(o.slide, t0 + dur);
    const g = ac.createGain(); const v = o.vol || 0.3;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(v, t0 + (o.attack || 0.01));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(fl); fl.connect(g); g.connect(this.master);
    src.start(t0, Math.random()); src.stop(t0 + dur + 0.05);
  },
  // ---- korna sesleri
  horn(i) {
    switch (i) {
      case 0: // düt düt
        this.tone(523, 0.16, { type: 'square', vol: 0.11, filter: 2500 });
        this.tone(659, 0.16, { type: 'square', vol: 0.07, filter: 2500 });
        this.tone(440, 0.24, { type: 'square', vol: 0.11, filter: 2500, delay: 0.2 });
        this.tone(554, 0.24, { type: 'square', vol: 0.07, filter: 2500, delay: 0.2 });
        break;
      case 1: this.quack(0); this.quack(0.2); break;
      case 2: this.moo(); break;
      case 3: this.fart(); break;
      case 4: this.tone(160, 0.6, { type: 'sine', vol: 0.3, slide: 620, vib: [16, 50] }); break;
      case 5:
        for (let k = 0; k < 2; k++) {
          this.tone(700, 0.3, { type: 'triangle', vol: 0.16, slide: 1000, delay: k * 0.6 });
          this.tone(1000, 0.3, { type: 'triangle', vol: 0.16, slide: 700, delay: k * 0.6 + 0.3 });
        }
        break;
      case 6:
        for (let k = 0; k < 4; k++) this.tone(2400, 0.08, { type: 'sine', vol: 0.14, slide: 3400, delay: k * 0.11 });
        break;
    }
  },
  quack(d = 0) {
    this.tone(620, 0.16, { type: 'sawtooth', vol: 0.14, slide: 380, filter: 1600, ftype: 'bandpass', q: 2, delay: d });
    this.tone(310, 0.16, { type: 'square', vol: 0.05, slide: 200, filter: 1200, delay: d });
  },
  moo() {
    this.tone(175, 1.0, { type: 'sawtooth', vol: 0.18, slide: 120, filter: 700, hold: true, attack: 0.08, vib: [5, 6] });
    this.tone(350, 1.0, { type: 'sawtooth', vol: 0.05, slide: 240, filter: 900, hold: true, attack: 0.1 });
  },
  fart(d = 0, v = 1) {
    this.tone(95, 0.55, { type: 'sawtooth', vol: 0.22 * v, slide: 55, filter: 500, vib: [30, 35], hold: true, delay: d });
    this.noise(0.5, { freq: 350, vol: 0.25 * v, delay: d });
  },
  cluck() { for (let k = 0; k < 3; k++) this.tone(700 + k * 80, 0.09, { type: 'square', vol: 0.08, slide: 450, filter: 2000, delay: k * 0.12 }); },
  oink() { for (let k = 0; k < 2; k++) this.tone(260, 0.16, { type: 'sawtooth', vol: 0.15, slide: 180, filter: 900, ftype: 'bandpass', q: 3, delay: k * 0.2 }); },
  baa() { this.tone(420, 0.7, { type: 'sawtooth', vol: 0.12, slide: 380, filter: 1500, vib: [11, 25], hold: true }); },
  pop() { this.tone(500, 0.09, { type: 'sine', vol: 0.25, slide: 1300 }); },
  click() { this.tone(900, 0.05, { type: 'triangle', vol: 0.15, slide: 1400 }); },
  ding() {
    this.tone(1318, 0.18, { type: 'triangle', vol: 0.13 });
    this.tone(1976, 0.28, { type: 'triangle', vol: 0.1, delay: 0.07 });
  },
  poof() {
    this.noise(0.45, { freq: 2500, slide: 300, ftype: 'bandpass', vol: 0.35 });
    [880, 1109, 1318, 1760].forEach((f, i) => this.tone(f, 0.18, { type: 'triangle', vol: 0.08, delay: 0.05 + i * 0.06 }));
  },
  magic() {
    [523, 659, 784, 1046, 1318, 1568, 2093].forEach((f, i) => this.tone(f, 0.25, { type: 'triangle', vol: 0.09, delay: i * 0.06 }));
    this.noise(0.8, { freq: 4000, slide: 800, ftype: 'bandpass', vol: 0.2 });
  },
  splash() { this.noise(0.4, { freq: 1200, slide: 300, vol: 0.45 }); this.tone(300, 0.2, { vol: 0.1, slide: 900 }); },
  squelch() { this.noise(0.35, { freq: 500, slide: 150, vol: 0.5 }); this.tone(140, 0.3, { type: 'sawtooth', vol: 0.12, slide: 60, filter: 400 }); },
  whee() { this.tone(300, 0.8, { type: 'sine', vol: 0.18, slide: 1400, vib: [7, 30] }); },
  wiu() { this.tone(1100, 0.8, { type: 'triangle', vol: 0.15, slide: 220, vib: [9, 80] }); },
  boing() { this.tone(150, 0.45, { type: 'sine', vol: 0.3, slide: 520, vib: [14, 40] }); },
  thud() { this.tone(120, 0.18, { type: 'sine', vol: 0.3, slide: 50 }); this.noise(0.15, { freq: 400, vol: 0.2 }); },
  whoosh() { this.noise(0.5, { freq: 600, slide: 3000, ftype: 'bandpass', vol: 0.3 }); },
  swish() { this.noise(0.18, { freq: 1500, slide: 3500, ftype: 'bandpass', vol: 0.18 }); },
  bubble() { this.tone(rand(500, 900), 0.08, { vol: 0.1, slide: rand(1200, 1800) }); },
  beep(hi) { this.tone(hi ? 880 : 440, hi ? 0.5 : 0.22, { type: 'square', vol: 0.1, filter: 3000 }); },
  fanfare() {
    const n = [523, 659, 784, 1046];
    n.forEach((f, i) => this.tone(f, 0.2, { type: 'square', vol: 0.08, filter: 3000, delay: i * 0.13 }));
    [1046, 1318, 1568].forEach(f => this.tone(f, 0.9, { type: 'triangle', vol: 0.09, delay: 0.55, hold: true }));
    [523, 659, 784].forEach(f => this.tone(f, 0.9, { type: 'square', vol: 0.04, filter: 2000, delay: 0.55, hold: true }));
  },
};

const HORN_TXT = ['DÜT DÜT!', 'VAK VAK!', 'MÖÖÖ!', 'PIRT!', 'BOİİNG!', 'DİYU DİYU!', 'CİK CİK!'];

// ---- müzik
const TRACKS = {
  garage: { bpm: 104, wave: 'triangle', vol: 0.05, roots: [0, 5, 7, 0],
    mel: [0, null, 4, null, 7, null, 4, null, 9, null, 7, null, 4, null, null, null,
      5, null, 9, null, 12, null, 9, null, 7, null, 4, null, 2, null, null, null] },
  drive: { bpm: 148, wave: 'square', vol: 0.025, roots: [0, 5, 7, 0],
    mel: [0, 4, 7, 12, 7, 4, 0, 4, 5, 9, 12, 9, 5, 9, 12, null,
      7, 11, 14, 11, 7, null, 2, null, 4, 7, 12, 7, 4, null, 0, null] },
};
const Music = {
  cur: null, step: 0, next: 0,
  play(n) { if (this.cur === n) return; this.cur = n; this.step = 0; this.next = 0; },
  stop() { this.cur = null; },
  update() {
    const ac = Snd.ac; if (!ac || !this.cur || Snd.muted) return;
    const tr = TRACKS[this.cur]; const sp = 60 / tr.bpm / 2;
    if (this.next < ac.currentTime) this.next = ac.currentTime + 0.05;
    while (this.next < ac.currentTime + 0.25) {
      const i = this.step % tr.mel.length, n = tr.mel[i], d = this.next - ac.currentTime;
      if (n != null) Snd.tone(523.25 * 2 ** (n / 12), sp * 1.7, { type: tr.wave, vol: tr.vol, delay: d, dest: Snd.music, filter: 3000 });
      if (i % 4 === 0) {
        const bar = Math.floor(i / 8) % tr.roots.length;
        const r = tr.roots[bar] + (i % 8 === 4 ? 7 : 0);
        Snd.tone(130.81 * 2 ** (r / 12), sp * 3, { type: 'triangle', vol: 0.09, delay: d, dest: Snd.music });
      }
      this.next += sp; this.step++;
    }
  },
};

// ---- konuşma (Türkçe ses varsa)
const Voice = {
  v: null, last: 0,
  init() {
    if (!('speechSynthesis' in window)) return;
    const load = () => {
      const vs = speechSynthesis.getVoices();
      this.v = vs.find(v => /^tr/i.test(v.lang) && /female|kadın|yelda|seda|emel|filiz/i.test(v.name))
        || vs.find(v => /^tr/i.test(v.lang)) || null;
    };
    load();
    speechSynthesis.onvoiceschanged = load;
  },
  say(t, force) {
    if (!this.v || Snd.muted) return;
    const now = performance.now();
    if (!force && now - this.last < 900) return;
    this.last = now;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(t);
      u.voice = this.v; u.lang = this.v.lang; u.rate = 1.05; u.pitch = 1.35; u.volume = 1;
      speechSynthesis.speak(u);
    } catch (e) { /* sessiz kal */ }
  },
};
Voice.init();
const say = (t, f) => Voice.say(t, f);

// ============================================================ parçacıklar
let P = [];
function addP(o) {
  const p = Object.assign({ x: 0, y: 0, vx: 0, vy: 0, g: 0, life: 1, size: 10, grow: 0, rot: 0, vr: 0,
    kind: 'circle', col: '#fff', alpha: 1, drag: 0 }, o);
  p.max = p.life;
  if (P.length > 900) P.shift();
  P.push(p);
  return p;
}
function updateP(dt) {
  for (let i = P.length - 1; i >= 0; i--) {
    const p = P[i];
    p.life -= dt;
    if (p.life <= 0) { if (p.onDone) p.onDone(); P.splice(i, 1); continue; }
    if (p.kind === 'flystar') {
      p.t += dt; const k = easeOut(clamp(p.t / p.dur, 0, 1));
      p.x = lerp(p.sx, p.tx, k); p.y = lerp(p.sy, p.ty, k) - Math.sin(k * Math.PI) * 120;
      if (p.t >= p.dur) { p.life = 0; }
      continue;
    }
    p.vy += p.g * dt;
    if (p.drag) { p.vx *= 1 - p.drag * dt; p.vy *= 1 - p.drag * dt; }
    p.x += p.vx * dt; p.y += p.vy * dt;
    p.size = Math.max(0, p.size + p.grow * dt);
    p.rot += p.vr * dt;
  }
}
function drawP() {
  for (const p of P) {
    const a = clamp(p.life / p.max, 0, 1);
    ctx.globalAlpha = p.alpha * (p.kind === 'confetti' || p.kind === 'flystar' ? 1 : Math.min(1, a * 1.6));
    switch (p.kind) {
      case 'circle': circ(p.x, p.y, p.size, p.col); break;
      case 'bubble':
        ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(80,160,230,0.9)';
        circ(p.x, p.y, p.size, 'rgba(200,235,255,0.35)', true);
        circ(p.x - p.size * 0.35, p.y - p.size * 0.35, p.size * 0.25, 'rgba(255,255,255,0.9)');
        break;
      case 'heart': heartPath(p.x, p.y, p.size); ctx.fillStyle = p.col; ctx.fill(); break;
      case 'star':
        starPath(p.x, p.y, p.size, p.size * 0.45, 5, p.rot - Math.PI / 2);
        ctx.fillStyle = p.col; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(180,110,0,0.8)'; ctx.stroke();
        break;
      case 'rect':
        ctx.fillStyle = p.col; ctx.fillRect(p.x - p.size / 2, p.y - p.h / 2, p.size, p.h); break;
      case 'confetti':
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, Math.cos(p.rot * 3));
        ctx.fillStyle = p.col; ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); ctx.restore();
        p.vx += Math.sin(p.life * 6 + p.size) * 4;
        break;
      case 'text': {
        const age = p.max - p.life;
        const sc = age < 0.15 ? easeOut(age / 0.15) * 1.25 : 1.25 - Math.min(0.25, (age - 0.15));
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(sc, sc);
        text(p.str, 0, 0, p.size, p.col, { stroke: OUT, lw: p.size * 0.22 });
        ctx.restore();
        break;
      }
      case 'burst': { // çizgi roman patlaması
        const age = p.max - p.life;
        const sc = Math.min(1, age / 0.12);
        ctx.save(); ctx.translate(p.x, p.y); ctx.scale(sc, sc); ctx.rotate(p.rot);
        starPath(0, 0, p.size, p.size * 0.72, 12, 0);
        ctx.fillStyle = p.col; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = OUT; ctx.stroke();
        ctx.rotate(-p.rot);
        text(p.str, 0, 2, p.size * 0.42, '#fff', { stroke: OUT, lw: 7 });
        ctx.restore();
        break;
      }
      case 'ring':
        ctx.lineWidth = 6 * a; ctx.strokeStyle = p.col; circ(p.x, p.y, p.size, null, true); break;
      case 'flystar':
        starPath(p.x, p.y, 20, 9, 5, p.t * 8);
        ctx.fillStyle = '#ffd93b'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#b8860b'; ctx.stroke();
        break;
      case 'z': text('z', p.x, p.y, p.size, '#fff', { stroke: OUT, lw: 5 }); break;
      case 'note': text('♪', p.x, p.y, p.size, p.col, { stroke: OUT, lw: 4, font: 'sans-serif' }); break;
    }
  }
  ctx.globalAlpha = 1;
}
function poof(x, y, s = 1) {
  for (let i = 0; i < 16; i++) {
    const a = rand(0, TAU), sp = rand(80, 260) * s;
    addP({ x: x + Math.cos(a) * 20 * s, y: y + Math.sin(a) * 20 * s, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      drag: 4, size: rand(18, 34) * s, grow: 30 * s, life: rand(0.35, 0.6), col: '#ffffff' });
  }
  sparkle(x, y, s, 10);
}
function sparkle(x, y, s = 1, n = 8) {
  const cols = ['#ffd93b', '#ff6fb5', '#6fe3ff', '#9dff6f', '#ffffff'];
  for (let i = 0; i < n; i++) {
    const a = rand(0, TAU), sp = rand(150, 380) * s;
    addP({ kind: 'star', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 300, drag: 1.5,
      size: rand(7, 13) * s, life: rand(0.6, 1.0), col: pick(cols), vr: rand(-8, 8) });
  }
}
function confetti(n, x0 = 0, x1 = W, y = -20) {
  const cols = ['#ff4747', '#ffd23f', '#4cc95a', '#3d8bff', '#ff6fb5', '#9b5de5', '#ff9f1c'];
  for (let i = 0; i < n; i++) {
    addP({ kind: 'confetti', x: rand(x0, x1), y: y + rand(-60, 0), vx: rand(-60, 60), vy: rand(60, 220), g: 120,
      drag: 0.6, size: rand(10, 18), life: rand(2.5, 4.5), col: pick(cols), rot: rand(0, TAU), vr: rand(-6, 6) });
  }
}
function comic(str, x, y, col = '#ffd93b', size = 70) {
  ctx.font = `800 ${size * 0.42}px ${FONT}`;
  size = Math.max(size, ctx.measureText(str).width * 0.62 + 10);
  x = clamp(x, size + 10, W - size - 10); y = clamp(y, size + 10, H - size);
  P = P.filter(q => q.kind !== 'burst');
  addP({ kind: 'burst', str, x, y, size, col, life: 0.9, rot: rand(-0.2, 0.2), vy: -30 });
}

// ============================================================ araba seçenekleri
const COLORS = [
  ['#ff4747', 'Kırmızı'], ['#ff9f1c', 'Turuncu'], ['#ffd23f', 'Sarı'], ['#4cc95a', 'Yeşil'],
  ['#3d8bff', 'Mavi'], ['#9b5de5', 'Mor'], ['#ff6fb5', 'Pembe'], ['#25c4c4', 'Turkuaz'],
  ['#f4f4f4', 'Beyaz'], ['#4b4b6e', 'Siyah'],
];
const CATS = [
  { key: 'color', icon: '🎨', bg: '#ff6b6b', names: COLORS.map(c => c[1]) },
  { key: 'pattern', icon: '🐞', bg: '#ffa94d', names: ['Düz', 'Benekli', 'Çizgili', 'Alevli', 'Kalpli', 'Yıldızlı'] },
  { key: 'body', icon: '🚙', bg: '#ffd43b', names: ['Araba', 'Kamyon', 'Otobüs', 'Yarış arabası', 'Dondurma arabası', 'Ördek araba', 'Pasta araba'] },
  { key: 'wheels', icon: '', bg: '#69db7c', names: ['Normal tekerlek', 'Kocaman tekerlek', 'Donut tekerlek', 'Kare tekerlek', 'Çiçek tekerlek', 'Karpuz tekerlek'] },
  { key: 'face', icon: '😜', bg: '#4dabf7', names: ['Mutlu', 'Güneş gözlüğü', 'Yıldız gözler', 'Kalp gözler', 'Uykucu', 'Dil çıkaran', 'Tek göz'] },
  { key: 'hat', icon: '🎩', bg: '#9775fa', names: ['Şapkasız', 'Taç', 'Parti şapkası', 'Kovboy şapkası', 'Aşçı şapkası', 'Pervane', 'Tavşan kulakları', 'Viking'] },
  { key: 'trail', icon: '🌈', bg: '#f783ac', names: ['Duman', 'Gökkuşağı', 'Baloncuk', 'Kalpler', 'Yıldızlar', 'Pırt bulutu'] },
  { key: 'horn', icon: '📯', bg: '#3bc9db', names: ['Düt düt', 'Vak vak', 'Möö', 'Pırt', 'Boing', 'Siren', 'Cik cik'] },
];
const CAT = {}; CATS.forEach((c, i) => { CAT[c.key] = c; c.idx = i; });

function newCar() {
  return { color: 0, pattern: 0, body: 0, wheels: 0, face: 0, hat: 2, trail: 1, horn: 0,
    mud: [], seed: Math.random() * 10000, wheelA: 0, hatLift: 0, hatV: 0, honkT: 0, squash: 0, changeT: 0 };
}
function setCat(c, key, v) {
  const n = CAT[key].names.length;
  c[key] = ((v % n) + n) % n;
}
function randomOther(c, key) {
  const n = CAT[key].names.length;
  let v = c[key];
  while (v === c[key]) v = randi(0, n - 1);
  c[key] = v;
}

// ============================================================ arabayı çizmek
function glass() {
  ctx.fillStyle = GLASS; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = OUT; ctx.stroke();
}
function light(x, y, r, col) { ctx.lineWidth = 3; ctx.strokeStyle = OUT; circ(x, y, r, col, true); }

const BODIES = [
  { // 0 araba
    wheels: [-78, 80], eye: { x: 44, y: -122, s: 0.85 }, mouth: { x: 112, y: -56, s: 0.9 },
    hat: { x: 4, y: -152 }, trail: { x: -134, y: -48 },
    path() {
      rr(-132, -102, 264, 78, 32);
      ctx.moveTo(-90, -100); ctx.bezierCurveTo(-82, -172, 72, -177, 102, -100); ctx.closePath();
    },
    details() {
      ctx.beginPath(); ctx.moveTo(-76, -103); ctx.bezierCurveTo(-70, -136, -40, -146, -10, -146); ctx.lineTo(-10, -103); ctx.closePath(); glass();
      ctx.beginPath(); ctx.moveTo(2, -146); ctx.bezierCurveTo(40, -146, 78, -134, 88, -103); ctx.lineTo(2, -103); ctx.closePath(); glass();
      ctx.lineWidth = 4; ctx.strokeStyle = OUT;
      ctx.beginPath(); ctx.moveTo(-10, -100); ctx.lineTo(-10, -40); ctx.stroke();
      ctx.beginPath(); rr(-34, -88, 16, 7, 3); ctx.fillStyle = OUT; ctx.fill();
      light(126, -80, 10, '#fff7a8'); ctx.beginPath(); rr(-138, -88, 12, 18, 4); ctx.fillStyle = '#ff5a5a'; ctx.fill(); ctx.stroke();
    },
  },
  { // 1 kamyon
    wheels: [-112, -48, 92], eye: { x: 93, y: -120, s: 0.85 }, mouth: { x: 118, y: -55, s: 0.85 },
    hat: { x: 82, y: -160 }, trail: { x: -152, y: -42 },
    path() { rr(-152, -152, 190, 127, 12); rr(30, -160, 106, 135, 24); },
    details(c, t, col) {
      ctx.beginPath(); rr(-140, -140, 166, 102, 8); ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.fill();
      // kasada kocaman bir yıldız
      starPath(-57, -90, 34, 16); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fill();
      ctx.beginPath(); rr(60, -148, 64, 54, 14); glass();
      light(134, -78, 9, '#fff7a8');
      ctx.beginPath(); rr(128, -48, 16, 20, 5); ctx.fillStyle = '#aab'; ctx.fill(); ctx.lineWidth = 3; ctx.stroke();
    },
  },
  { // 2 otobüs
    wheels: [-102, 102], eye: { x: 126, y: -128, s: 0.66 }, mouth: { x: 132, y: -52, s: 0.8 },
    hat: { x: -20, y: -176 }, trail: { x: -158, y: -42 },
    path() { rr(-158, -178, 316, 153, 28); },
    details(c, t) {
      ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fillRect(-150, -98, 300, 12);
      for (let i = 0; i < 4; i++) {
        const x = -142 + i * 58;
        ctx.beginPath(); rr(x, -160, 46, 50, 10); glass();
        // yolcular: küçük hayvancıklar zıplıyor
        const bob = Math.sin(t * 6 + i * 1.7) * 3;
        ctx.save(); ctx.beginPath(); rr(x, -160, 46, 50, 10); ctx.clip();
        const pc = ['#ffb347', '#a5d8ff', '#ffc9e3', '#d0f4a8'][i];
        ctx.lineWidth = 3; ctx.strokeStyle = OUT;
        circ(x + 23, -122 + bob, 15, pc, true);
        circ(x + 13, -136 + bob, 6, pc, true); circ(x + 33, -136 + bob, 6, pc, true);
        circ(x + 18, -124 + bob, 2.5, OUT); circ(x + 28, -124 + bob, 2.5, OUT);
        ctx.beginPath(); ctx.arc(x + 23, -118 + bob, 5, 0.2, Math.PI - 0.2); ctx.stroke();
        ctx.restore();
        ctx.beginPath(); rr(x, -160, 46, 50, 10); ctx.lineWidth = 4; ctx.strokeStyle = OUT; ctx.stroke();
      }
      ctx.beginPath(); rr(100, -162, 48, 72, 12); glass();
      light(150, -66, 9, '#fff7a8');
      ctx.beginPath(); rr(-162, -78, 10, 20, 4); ctx.fillStyle = '#ff5a5a'; ctx.fill(); ctx.lineWidth = 3; ctx.stroke();
    },
  },
  { // 3 yarış
    wheels: [-92, 90], eye: { x: -6, y: -102, s: 0.62 }, mouth: { x: 132, y: -46, s: 0.7 },
    hat: { x: -8, y: -124 }, trail: { x: -150, y: -50 },
    back(c, t, col) {
      ctx.lineWidth = 5; ctx.strokeStyle = OUT;
      ctx.beginPath(); rr(-138, -122, 9, 36, 3); ctx.fillStyle = '#444'; ctx.fill(); ctx.stroke();
      ctx.beginPath(); rr(-164, -132, 66, 14, 6); ctx.fillStyle = shade(col, -0.3); ctx.fill(); ctx.stroke();
    },
    path() {
      ctx.moveTo(-146, -28); ctx.lineTo(-150, -78); ctx.quadraticCurveTo(-142, -94, -110, -94);
      ctx.lineTo(-46, -94); ctx.quadraticCurveTo(-12, -142, 32, -98); ctx.lineTo(122, -72);
      ctx.quadraticCurveTo(160, -62, 152, -30); ctx.closePath();
    },
    details() {
      ctx.beginPath(); ctx.moveTo(-40, -95); ctx.quadraticCurveTo(-10, -134, 26, -97); ctx.closePath(); glass();
      ctx.lineWidth = 4; ctx.strokeStyle = OUT; circ(-82, -60, 20, '#fff', true);
      text('1', -82, -58, 28, OUT);
      light(146, -52, 7, '#fff7a8');
    },
  },
  { // 4 dondurma
    wheels: [-86, 82], eye: { x: 100, y: -126, s: 0.75 }, mouth: { x: 120, y: -55, s: 0.85 },
    hat: { x: -30, y: -306 }, trail: { x: -142, y: -45 },
    back() {
      // kocaman dondurma külahı
      ctx.lineWidth = 5; ctx.strokeStyle = OUT;
      ctx.beginPath(); ctx.moveTo(-30, -158); ctx.lineTo(-64, -232); ctx.lineTo(4, -232); ctx.closePath();
      ctx.fillStyle = '#e8b062'; ctx.fill(); ctx.stroke();
      ctx.save(); ctx.clip(); ctx.lineWidth = 3; ctx.strokeStyle = '#b97a30';
      for (let i = -4; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-80 + i * 16, -240); ctx.lineTo(-40 + i * 16, -150); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(20 - i * 16, -240); ctx.lineTo(-20 - i * 16, -150); ctx.stroke(); }
      ctx.restore();
      ctx.lineWidth = 5; ctx.strokeStyle = OUT;
      circ(-30, -250, 34, '#ff9ccf', true);
      circ(-30, -288, 27, '#9ff0c8', true);
      circ(-30, -312, 9, '#ff3b3b', true);
      ctx.fillStyle = '#fff'; circ(-40, -262, 5, '#fff'); circ(-18, -296, 4, '#fff');
    },
    path() { rr(-142, -166, 274, 141, 30); },
    details() {
      ctx.beginPath(); ctx.moveTo(70, -154); ctx.lineTo(112, -154); ctx.quadraticCurveTo(128, -150, 130, -100); ctx.lineTo(70, -100); ctx.closePath(); glass();
      ctx.beginPath(); rr(-118, -142, 150, 66, 10); ctx.fillStyle = '#5a3d2b'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = OUT; ctx.stroke();
      // tente
      for (let i = 0; i < 6; i++) {
        ctx.beginPath(); ctx.moveTo(-122 + i * 26, -146); ctx.lineTo(-96 + i * 26, -146);
        ctx.arc(-109 + i * 26, -146, 13, 0, Math.PI); ctx.closePath();
        ctx.fillStyle = i % 2 ? '#fff' : '#ff4f6d'; ctx.fill(); ctx.lineWidth = 3; ctx.stroke();
      }
      // vitrindeki minik dondurmalar
      for (let i = 0; i < 3; i++) {
        const x = -88 + i * 45;
        ctx.beginPath(); ctx.moveTo(x, -82); ctx.lineTo(x - 10, -106); ctx.lineTo(x + 10, -106); ctx.closePath(); ctx.fillStyle = '#e8b062'; ctx.fill(); ctx.lineWidth = 2; ctx.stroke();
        ctx.lineWidth = 2; circ(x, -112, 11, ['#ffe066', '#ff9ccf', '#8b5a2b'][i], true);
      }
      light(128, -76, 9, '#fff7a8');
    },
  },
  { // 5 ördek
    wheels: [-72, 66], eye: { x: 92, y: -160, s: 0.78 }, mouth: null,
    hat: { x: 84, y: -192 }, trail: { x: -150, y: -80 },
    path() {
      // gövde (saat yönünün tersi), kafa da aynı yönde
      ctx.moveTo(-156, -124);
      ctx.quadraticCurveTo(-140, -50, -90, -28);
      ctx.bezierCurveTo(-10, -18, 122, -20, 126, -82);
      ctx.bezierCurveTo(128, -110, 92, -118, 62, -110);
      ctx.lineTo(-58, -106);
      ctx.bezierCurveTo(-100, -100, -124, -110, -156, -124);
      ctx.closePath();
      ctx.moveTo(130, -148); ctx.arc(82, -148, 48, 0, TAU, true); ctx.closePath();
    },
    details(c, t, col, honk) {
      ctx.lineWidth = 4; ctx.strokeStyle = OUT;
      // kanat
      ctx.beginPath(); ctx.ellipse(-24, -76, 58, 30, -0.15, 0, TAU); ctx.fillStyle = shade(col, -0.18); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-70, -70); ctx.quadraticCurveTo(-40, -56, -10, -66); ctx.stroke();
      // gaga (korna çalınca açılır)
      const open = honk > 0 ? 10 : 0;
      ctx.fillStyle = '#ff9a1f';
      ctx.beginPath(); ctx.moveTo(122, -150); ctx.quadraticCurveTo(170, -156, 176, -140 - open * 0.3); ctx.quadraticCurveTo(150, -136, 122, -136); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(122, -134); ctx.quadraticCurveTo(150, -134 + open * 0.2, 168, -132 + open); ctx.quadraticCurveTo(150, -118 + open, 122, -124); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(255,120,150,0.5)'; circ(104, -130, 9, 'rgba(255,120,150,0.5)');
    },
  },
  { // 6 pasta
    wheels: [-82, 82], eye: { x: 8, y: -142, s: 0.9 }, mouth: { x: 8, y: -64, s: 1.2 },
    hat: { x: 0, y: -178 }, trail: { x: -134, y: -45 },
    path() { rr(-132, -112, 264, 87, 16); rr(-92, -178, 184, 72, 16); },
    details(c, t) {
      ctx.lineWidth = 4; ctx.strokeStyle = OUT;
      // krema damlaları
      const drip = (x0, x1, y) => {
        ctx.beginPath(); ctx.moveTo(x0, y - 4);
        for (let x = x0; x < x1; x += 24) {
          const d = 10 + hash(x * 0.37 + y) * 16;
          ctx.lineTo(x + 2, y + 6); ctx.quadraticCurveTo(x + 6, y + d, x + 12, y + d);
          ctx.quadraticCurveTo(x + 18, y + d, x + 20, y + 6);
        }
        ctx.lineTo(x1, y + 6); ctx.lineTo(x1, y - 4); ctx.closePath();
        ctx.fillStyle = '#fff6e9'; ctx.fill(); ctx.stroke();
      };
      drip(-128, 128, -108);
      drip(-88, 88, -174);
      // mumlar
      for (const x of [-62, 62]) {
        ctx.beginPath(); rr(x - 7, -214, 14, 38, 4); ctx.fillStyle = '#9ad7ff'; ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.fillRect(x - 6, -204, 12, 5); ctx.fillRect(x - 6, -190, 12, 5);
        const fl = 1 + Math.sin(t * 20 + x) * 0.15;
        ctx.save(); ctx.translate(x, -218); ctx.scale(fl, 1 / fl);
        ctx.beginPath(); ctx.moveTo(0, -22); ctx.quadraticCurveTo(10, -6, 0, 2); ctx.quadraticCurveTo(-10, -6, 0, -22);
        ctx.fillStyle = '#ffb020'; ctx.fill(); ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
      }
      // çilekler
      for (const x of [-100, -40, 40, 100]) {
        ctx.lineWidth = 3; circ(x, -38, 8, '#ff3b5c', true);
      }
    },
  },
];

const WHEEL_R = [30, 50, 33, 30, 34, 34];

function drawWheel(type, x, y, r, a) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  ctx.lineWidth = 5; ctx.strokeStyle = OUT;
  switch (type) {
    case 0:
      circ(0, 0, r, '#33323d', true);
      circ(0, 0, r * 0.58, '#dfe4ea', true);
      ctx.lineWidth = 4;
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(i * TAU / 4) * r * 0.55, Math.sin(i * TAU / 4) * r * 0.55); ctx.stroke(); }
      circ(0, 0, r * 0.2, '#ff5a5a', true);
      break;
    case 1:
      for (let i = 0; i < 14; i++) {
        ctx.save(); ctx.rotate(i * TAU / 14); ctx.beginPath(); rr(-r * 0.13, -r - 7, r * 0.26, 14, 3);
        ctx.fillStyle = '#33323d'; ctx.fill(); ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
      }
      circ(0, 0, r, '#33323d', true);
      ctx.lineWidth = 3; ctx.strokeStyle = '#55545f'; circ(0, 0, r * 0.8, null, true);
      ctx.lineWidth = 5; ctx.strokeStyle = OUT;
      circ(0, 0, r * 0.5, '#ffcc00', true);
      for (let i = 0; i < 5; i++) circ(Math.cos(i * TAU / 5) * r * 0.3, Math.sin(i * TAU / 5) * r * 0.3, r * 0.07, '#8a6d00');
      break;
    case 2: { // donut
      circ(0, 0, r, '#e0a15a', true);
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) { const an = i / 40 * TAU; const rad = r * 0.8 + Math.sin(an * 9) * r * 0.07; ctx.lineTo(Math.cos(an) * rad, Math.sin(an) * rad); }
      ctx.closePath(); ctx.fillStyle = '#ff8fc8'; ctx.fill(); ctx.lineWidth = 3; ctx.stroke();
      const sc = ['#fff', '#ffe066', '#6fe3ff', '#7cff8a', '#b388ff'];
      for (let i = 0; i < 12; i++) {
        const an = i * 2.4, rad = r * (0.45 + (i % 3) * 0.12);
        ctx.save(); ctx.translate(Math.cos(an) * rad, Math.sin(an) * rad); ctx.rotate(an * 3);
        ctx.fillStyle = sc[i % 5]; ctx.fillRect(-4, -1.5, 8, 3); ctx.restore();
      }
      ctx.lineWidth = 4; circ(0, 0, r * 0.28, '#6b4a2b', true);
      break;
    }
    case 3: // kare
      ctx.beginPath(); rr(-r, -r, r * 2, r * 2, 7); ctx.fillStyle = '#33323d'; ctx.fill(); ctx.stroke();
      ctx.beginPath(); rr(-r * 0.55, -r * 0.55, r * 1.1, r * 1.1, 4); ctx.fillStyle = '#dfe4ea'; ctx.fill(); ctx.stroke();
      circ(0, 0, r * 0.18, '#ff5a5a', true);
      break;
    case 4: { // çiçek
      const pc = ['#ff6fb5', '#ffd23f', '#6fb7ff', '#ff8a5b', '#b07cff', '#7cdd6b', '#ff6fb5'];
      ctx.lineWidth = 3;
      for (let i = 0; i < 7; i++) {
        const an = i * TAU / 7;
        ell(Math.cos(an) * r * 0.58, Math.sin(an) * r * 0.58, r * 0.45, r * 0.3, an, pc[i], true);
      }
      ctx.lineWidth = 4; circ(0, 0, r * 0.42, '#ffd23f', true);
      circ(-r * 0.14, -r * 0.08, 2.5, OUT); circ(r * 0.14, -r * 0.08, 2.5, OUT);
      ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, r * 0.04, r * 0.16, 0.3, Math.PI - 0.3); ctx.stroke();
      break;
    }
    case 5: // karpuz
      circ(0, 0, r, '#2f8f3a', true);
      circ(0, 0, r * 0.86, '#bff0a0');
      circ(0, 0, r * 0.76, '#ff4d5e');
      for (let i = 0; i < 8; i++) {
        const an = i * TAU / 8;
        ell(Math.cos(an) * r * 0.45, Math.sin(an) * r * 0.45, 3, 5.5, an, '#222');
      }
      ctx.lineWidth = 4; ctx.strokeStyle = OUT; circ(0, 0, r, null, true);
      break;
  }
  ctx.restore();
}

function drawPattern(i, col, t) {
  if (!i) return;
  const pc = lum(col) > 0.72 ? 'rgba(60,40,90,0.25)' : 'rgba(255,255,255,0.6)';
  ctx.fillStyle = pc;
  if (i === 1) {
    for (let gy = -330, r = 0; gy <= 0; gy += 40, r++) {
      for (let gx = -190; gx <= 190; gx += 48) {
        const ox = (r % 2) * 24 + hash(gx + gy) * 10;
        circ(gx + ox, gy + hash(gx * 3 + gy) * 10, 9 + hash(gx - gy) * 6, pc);
      }
    }
  } else if (i === 2) {
    for (const y of [-84, -66, -150, -132]) ctx.fillRect(-220, y, 440, y === -84 || y === -150 ? 11 : 6);
  } else if (i === 3) {
    const flame = k => {
      ctx.save(); ctx.translate(170, -72); ctx.scale(k, k); ctx.translate(-170, 72);
      ctx.beginPath(); ctx.moveTo(170, -36); ctx.lineTo(60, -36);
      ctx.quadraticCurveTo(10, -40, -50, -52); ctx.quadraticCurveTo(0, -60, 24, -64);
      ctx.quadraticCurveTo(-20, -76, -76, -82); ctx.quadraticCurveTo(-6, -90, 36, -92);
      ctx.quadraticCurveTo(0, -104, -34, -118); ctx.quadraticCurveTo(46, -116, 80, -106);
      ctx.lineTo(170, -108); ctx.closePath(); ctx.fill(); ctx.restore();
    };
    ctx.fillStyle = '#ff6a00'; flame(1); ctx.fillStyle = '#ffd000'; flame(0.62);
  } else if (i === 4) {
    for (let gy = -320, r = 0; gy <= 0; gy += 38, r++) {
      for (let gx = -190; gx <= 190; gx += 44) { heartPath(gx + (r % 2) * 22, gy, 9); ctx.fillStyle = lum(col) > 0.72 ? '#ff6fb5' : 'rgba(255,255,255,0.65)'; ctx.fill(); }
    }
  } else if (i === 5) {
    for (let gy = -320, r = 0; gy <= 0; gy += 42, r++) {
      for (let gx = -190; gx <= 190; gx += 50) { starPath(gx + (r % 2) * 25, gy, 12, 5.5, 5, -Math.PI / 2 + gx); ctx.fillStyle = lum(col) > 0.72 ? '#ffb000' : '#fff27a'; ctx.fill(); }
    }
  }
}

function eyeBall(x, y, r, px, py, blink, iris) {
  ctx.save(); ctx.translate(x, y); ctx.scale(1, blink);
  ctx.lineWidth = 3.5; ctx.strokeStyle = OUT;
  circ(0, 0, r, '#fff', true);
  if (iris) circ(px * r * 0.35, py * r * 0.35, r * 0.55, iris);
  circ(px * r * 0.4, py * r * 0.4, r * 0.42, OUT);
  circ(px * r * 0.4 - r * 0.15, py * r * 0.4 - r * 0.18, r * 0.14, '#fff');
  ctx.restore();
}

function drawFace(c, B, t, honk) {
  const e = B.eye;
  const look = { x: 0.6 + Math.sin(t * 0.9 + c.seed) * 0.35, y: Math.sin(t * 1.3 + c.seed) * 0.3 };
  const ph = ((t * 1000 + c.seed) % 3400);
  const blink = ph < 130 ? 0.12 : 1;
  ctx.save(); ctx.translate(e.x, e.y); ctx.scale(e.s, e.s);
  ctx.lineWidth = 3.5; ctx.strokeStyle = OUT;
  switch (c.face) {
    case 0: eyeBall(-15, 0, 13, look.x, look.y, blink); eyeBall(15, 0, 13, look.x, look.y, blink); break;
    case 1:
      ctx.fillStyle = '#1f1d2b';
      ctx.beginPath(); rr(-33, -12, 29, 22, 9); ctx.fill(); ctx.beginPath(); rr(4, -12, 29, 22, 9); ctx.fill();
      ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-6, -6); ctx.lineTo(6, -6); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-26, -6); ctx.lineTo(-18, 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(11, -6); ctx.lineTo(19, 2); ctx.stroke();
      break;
    case 2: {
      const s = 1 + Math.sin(t * 8) * 0.12;
      for (const x of [-16, 16]) { starPath(x, 0, 16 * s, 7 * s); ctx.fillStyle = '#ffd93b'; ctx.fill(); ctx.stroke(); }
      break;
    }
    case 3: {
      const s = 1 + Math.sin(t * 9) * 0.14;
      for (const x of [-16, 16]) { heartPath(x, -1, 12 * s); ctx.fillStyle = '#ff3b6b'; ctx.fill(); ctx.stroke(); }
      break;
    }
    case 4:
      for (const x of [-15, 15]) {
        circ(x, 0, 13, '#fff', true);
        circ(x + 3, 5, 5.5, OUT);
        ctx.beginPath(); ctx.arc(x, 0, 13, Math.PI, TAU); ctx.closePath(); ctx.fillStyle = shade(BODY_COL, -0.2); ctx.fill(); ctx.stroke();
      }
      break;
    case 5: {
      const j1x = Math.sin(t * 13) * 0.7, j1y = Math.cos(t * 11) * 0.7, j2x = Math.sin(t * 9 + 2) * 0.7, j2y = Math.cos(t * 15) * 0.7;
      eyeBall(-17, 2, 11, j1x, j1y, 1); eyeBall(13, -3, 17, j2x, j2y, 1);
      break;
    }
    case 6:
      eyeBall(0, 0, 22, look.x, look.y, blink, '#4cc95a');
      ctx.lineWidth = 3;
      for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(i * 10, -21); ctx.lineTo(i * 15, -31); ctx.stroke(); }
      break;
  }
  ctx.restore();

  if (c.face === 4) { // uykucu: z z z
    for (let i = 0; i < 3; i++) { const k = (t * 0.6 + i / 3) % 1; ctx.globalAlpha = 1 - k;
      text('z', e.x + 20 + k * 40, e.y - 25 - k * 50, 16 + k * 14, '#fff', { stroke: OUT, lw: 5 }); }
    ctx.globalAlpha = 1;
  }

  if (!B.mouth) return;
  const m = B.mouth;
  ctx.save(); ctx.translate(m.x, m.y); ctx.scale(m.s, m.s);
  ctx.lineWidth = 4; ctx.strokeStyle = OUT; ctx.lineCap = 'round';
  if (honk > 0) {
    const o = 0.7 + Math.sin(t * 30) * 0.3;
    ell(0, 0, 11, 13 * o, 0, '#7a1f2b', true);
    ell(0, 6 * o, 6, 4 * o, 0, '#ff7a8a');
  } else switch (c.face) {
    case 2: ctx.beginPath(); ctx.arc(0, -4, 13, 0.1, Math.PI - 0.1); ctx.closePath(); ctx.fillStyle = '#7a1f2b'; ctx.fill(); ctx.stroke();
      ell(0, 4, 6, 3.5, 0, '#ff7a8a'); break;
    case 4: ctx.beginPath(); ctx.arc(0, 0, 5, 0, TAU); ctx.stroke(); break;
    case 5: {
      ctx.beginPath(); ctx.arc(0, -6, 14, 0.2, Math.PI - 0.2); ctx.stroke();
      const w = Math.sin(t * 10) * 0.25;
      ctx.save(); ctx.translate(2, 6); ctx.rotate(w);
      ctx.beginPath(); rr(-7, -2, 14, 20, 7); ctx.fillStyle = '#ff6f8a'; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, 2); ctx.lineTo(0, 12); ctx.lineWidth = 2; ctx.stroke();
      ctx.restore(); break;
    }
    case 6:
      ctx.beginPath(); ctx.moveTo(-15, -4); ctx.quadraticCurveTo(0, 16, 15, -4); ctx.closePath(); ctx.fillStyle = '#fff'; ctx.fill(); ctx.stroke();
      ctx.lineWidth = 2; for (const x of [-6, 0, 6]) { ctx.beginPath(); ctx.moveTo(x, -3); ctx.lineTo(x, 5); ctx.stroke(); }
      break;
    default: ctx.beginPath(); ctx.arc(0, -6, 13, 0.25, Math.PI - 0.25); ctx.stroke();
      ctx.fillStyle = 'rgba(255,110,140,0.45)'; circ(-18, -6, 6, 'rgba(255,110,140,0.45)'); circ(18, -6, 6, 'rgba(255,110,140,0.45)');
  }
  ctx.restore();
}
let BODY_COL = '#ff4747';

function drawHat(i, t) {
  ctx.lineWidth = 4.5; ctx.strokeStyle = OUT; ctx.lineJoin = 'round';
  switch (i) {
    case 1:
      ctx.beginPath(); ctx.moveTo(-32, 0); ctx.lineTo(-36, -42); ctx.lineTo(-18, -22); ctx.lineTo(0, -50); ctx.lineTo(18, -22); ctx.lineTo(36, -42); ctx.lineTo(32, 0); ctx.closePath();
      ctx.fillStyle = '#ffd23f'; ctx.fill(); ctx.stroke();
      ctx.lineWidth = 3; circ(-36, -44, 5, '#ff4d6d', true); circ(0, -52, 6, '#4dabf7', true); circ(36, -44, 5, '#4cc95a', true);
      circ(0, -12, 6, '#ff4d6d', true);
      break;
    case 2:
      ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(0, -74); ctx.lineTo(26, 0); ctx.closePath();
      ctx.fillStyle = '#4dabf7'; ctx.fill();
      ctx.save(); ctx.clip(); ctx.fillStyle = '#ffd23f';
      for (let k = 0; k < 4; k++) { ctx.save(); ctx.translate(0, -12 - k * 18); ctx.rotate(-0.4); ctx.fillRect(-40, -4, 80, 8); ctx.restore(); }
      ctx.restore(); ctx.stroke();
      circ(0, -76, 10, '#ff6fb5', true);
      break;
    case 3:
      ctx.beginPath(); rr(-26, -46, 52, 44, 14); ctx.fillStyle = '#a0612b'; ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#5b3414'; ctx.fillRect(-25, -16, 50, 9);
      ctx.beginPath(); ctx.moveTo(-58, -6); ctx.quadraticCurveTo(-60, -18, -48, -14); ctx.quadraticCurveTo(0, -2, 48, -14);
      ctx.quadraticCurveTo(60, -18, 58, -6); ctx.quadraticCurveTo(0, 8, -58, -6); ctx.closePath(); ctx.fillStyle = '#b8742f'; ctx.fill(); ctx.stroke();
      starPath(0, -30, 9, 4); ctx.fillStyle = '#ffd23f'; ctx.fill();
      break;
    case 4:
      ctx.fillStyle = '#fff';
      ctx.beginPath(); rr(-24, -20, 48, 20, 4); ctx.fill(); ctx.stroke();
      circ(-18, -34, 18, '#fff', true); circ(18, -34, 18, '#fff', true); circ(0, -46, 23, '#fff', true);
      ctx.fillRect(-20, -30, 40, 14);
      break;
    case 5: {
      ctx.beginPath(); ctx.arc(0, 0, 28, Math.PI, TAU); ctx.closePath(); ctx.fillStyle = '#ff4747'; ctx.fill();
      ctx.save(); ctx.clip(); ctx.fillStyle = '#ffd23f'; ctx.fillRect(-10, -30, 10, 30); ctx.fillStyle = '#3d8bff'; ctx.fillRect(10, -30, 20, 30); ctx.restore();
      ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -28); ctx.lineTo(0, -40); ctx.stroke();
      const w = Math.cos(t * 25) * 34;
      ell(w / 2, -42, Math.abs(w / 2) + 2, 6, 0, '#4cc95a', true);
      ell(-w / 2, -42, Math.abs(w / 2) + 2, 6, 0, '#ff9f1c', true);
      circ(0, -42, 4, OUT);
      break;
    }
    case 6:
      for (const s of [-1, 1]) {
        ctx.save(); ctx.translate(s * 14, -4); ctx.rotate(s * 0.25 + Math.sin(t * 5 + s) * 0.12);
        ell(0, -32, 12, 34, 0, '#fff', true); ell(0, -30, 6, 24, 0, '#ffb3cf');
        ctx.restore();
      }
      ctx.beginPath(); rr(-28, -8, 56, 10, 5); ctx.fillStyle = '#ff6fb5'; ctx.fill(); ctx.stroke();
      break;
    case 7:
      for (const s of [-1, 1]) {
        ctx.beginPath(); ctx.moveTo(s * 22, -14); ctx.quadraticCurveTo(s * 52, -18, s * 50, -58); ctx.quadraticCurveTo(s * 40, -30, s * 18, -28); ctx.closePath();
        ctx.fillStyle = '#fff3d6'; ctx.fill(); ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(0, 0, 30, Math.PI, TAU); ctx.closePath(); ctx.fillStyle = '#aab2bf'; ctx.fill(); ctx.stroke();
      ctx.beginPath(); rr(-32, -8, 64, 10, 4); ctx.fillStyle = '#ffcc33'; ctx.fill(); ctx.stroke();
      for (const x of [-18, 0, 18]) circ(x, -3, 2.5, OUT);
      break;
  }
}

function wheelXs(c) {
  const ws = BODIES[c.body].wheels;
  return c.wheels === 1 && ws.length > 2 ? [ws[0], ws[ws.length - 1]] : ws;
}
/* Arabayı çiz. (x,y) yer teması, s ölçek. */
function drawCar(c, x, y, s, o = {}) {
  const t = o.t || 0;
  const B = BODIES[c.body];
  const col = COLORS[c.color][0];
  BODY_COL = col;
  const wr = WHEEL_R[c.wheels];
  const lift = (wr - 30) * 1.6;
  let sqb = 0;
  if (c.wheels === 3) { const a = c.wheelA % (Math.PI / 2); sqb = wr * (Math.abs(Math.cos(a)) + Math.abs(Math.sin(a)) - 1); }
  ctx.save();
  ctx.translate(x, y); ctx.scale(s, s);
  const sq = c.squash || 0;
  ctx.scale(1 + sq * 0.22, 1 - sq * 0.22);
  if (o.rot) { ctx.translate(0, -90); ctx.rotate(o.rot); ctx.translate(0, 90); }
  ctx.translate(0, -lift - sqb + (o.bob || 0));
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';

  // canavar tekerlek amortisörleri
  if (c.wheels === 1) {
    ctx.lineWidth = 6; ctx.strokeStyle = '#555';
    for (const wx of wheelXs(c)) { ctx.beginPath(); ctx.moveTo(wx, -40); ctx.lineTo(wx, -30 + lift); ctx.stroke(); }
  }
  if (B.back) B.back(c, t, col);
  ctx.beginPath(); B.path();
  ctx.lineWidth = 10; ctx.strokeStyle = OUT; ctx.stroke();
  ctx.fillStyle = col; ctx.fill();
  ctx.save(); ctx.clip();
  drawPattern(c.pattern, col, t);
  for (const m of c.mud) { circ(m.x, m.y, m.r, '#7a4a1e'); circ(m.x + m.r * 0.3, m.y - m.r * 0.3, m.r * 0.3, '#9a6a3a'); }
  ctx.fillStyle = 'rgba(0,0,0,0.13)'; ctx.fillRect(-220, -52, 440, 60);
  ctx.restore();
  B.details(c, t, col, c.honkT);
  drawFace(c, B, t, c.honkT);

  // şapka
  if (c.hat) {
    ctx.save(); ctx.translate(B.hat.x, B.hat.y - c.hatLift); ctx.rotate(Math.sin(t * 3) * 0.05 - c.hatLift * 0.004);
    drawHat(c.hat, t); ctx.restore();
  }
  // tekerlekler
  for (const wx of wheelXs(c)) drawWheel(c.wheels, wx, -wr + lift, wr, c.wheelA);
  ctx.restore();
}

function carAnchor(c, x, y, s, which) {
  const B = BODIES[c.body]; const wr = WHEEL_R[c.wheels]; const lift = (wr - 30) * 1.6;
  const a = B[which];
  return { x: x + a.x * s, y: y + (a.y - lift) * s };
}
function carTop(c, x, y, s) {
  const B = BODIES[c.body]; const wr = WHEEL_R[c.wheels]; const lift = (wr - 30) * 1.6;
  return { x: x + B.hat.x * s, y: y + (B.hat.y - lift - (c.hat ? 50 : 0)) * s };
}

// ---- egzoz izi
function emitTrail(c, x, y, s, dt, worldVX, acc) {
  const a = carAnchor(c, x, y, s, 'trail');
  c.trailAcc = (c.trailAcc || 0) + dt;
  const every = [0.07, 0.016, 0.07, 0.11, 0.09, 0.09][c.trail];
  while (c.trailAcc > every) {
    c.trailAcc -= every;
    switch (c.trail) {
      case 0: addP({ x: a.x, y: a.y, vx: worldVX - 40, vy: rand(-30, -10), size: rand(6, 10) * s * 1.6, grow: 30 * s, life: 0.8, col: 'rgba(200,200,210,0.8)' }); break;
      case 1: {
        const rc = ['#ff4747', '#ff9f1c', '#ffd23f', '#4cc95a', '#3d8bff', '#9b5de5'];
        for (let k = 0; k < 6; k++) addP({ kind: 'rect', x: a.x, y: a.y - 26 * s + k * 9 * s, vx: worldVX - 30, vy: 0, size: Math.max(4, (Math.abs(worldVX) + 40) * every + 2), h: 9.5 * s, life: 0.7, col: rc[k] });
        break;
      }
      case 2: addP({ kind: 'bubble', x: a.x, y: a.y, vx: worldVX * 0.6 - 30 + rand(-20, 20), vy: rand(-90, -40), size: rand(6, 14) * s * 1.5, life: 1.2 }); break;
      case 3: addP({ kind: 'heart', x: a.x, y: a.y, vx: worldVX * 0.6 - 30, vy: rand(-90, -50), size: rand(7, 11) * s * 1.5, life: 1.1, col: pick(['#ff4d79', '#ff8fb8', '#ff2f5f']) }); break;
      case 4: addP({ kind: 'star', x: a.x, y: a.y, vx: worldVX * 0.6 - 40, vy: rand(-80, -20), size: rand(7, 12) * s * 1.5, life: 1.0, col: pick(['#ffd93b', '#fff27a', '#ffb000']), vr: rand(-6, 6) }); break;
      case 5: addP({ x: a.x, y: a.y, vx: worldVX * 0.5 - 50, vy: rand(-30, 0), size: rand(10, 16) * s * 1.6, grow: 40 * s, life: 0.9, col: pick(['rgba(140,200,60,0.75)', 'rgba(170,220,80,0.7)', 'rgba(110,170,40,0.7)']) }); break;
    }
  }
}

// ---- araba fiziği (şapka, sıkışma, korna zamanlayıcısı)
function updateCarAnim(c, dt) {
  c.honkT = Math.max(0, c.honkT - dt);
  c.squash *= Math.pow(0.002, dt);
  if (Math.abs(c.squash) < 0.01) c.squash = 0;
  c.hatV += (-c.hatLift * 160 - c.hatV * 9) * dt;
  c.hatLift += c.hatV * dt;
}
function honk(c, x, y, s) {
  Snd.horn(c.horn);
  c.honkT = 0.55; c.squash = -0.35; c.hatV += 260;
  const top = carTop(c, x, y, s);
  comic(HORN_TXT[c.horn], top.x + 40, top.y - 30, pick(['#ffd93b', '#ff6fb5', '#6fe3ff', '#9dff6f']), 62 * Math.max(0.8, s));
  if (c.horn === 3) for (let i = 0; i < 6; i++) {
    const a = carAnchor(c, x, y, s, 'trail');
    addP({ x: a.x, y: a.y, vx: rand(-200, -60), vy: rand(-60, 20), size: rand(14, 22), grow: 50, life: 1, col: 'rgba(140,200,60,0.75)' });
  }
}

// ============================================================ düğmeler
class Button {
  constructor(o) { Object.assign(this, { r: 50, bg: '#4dabf7', press: 0, wiggle: 0, visible: true }, o); }
  hit(p) { return this.visible && Math.hypot(p.x - this.x, p.y - this.y) < this.r * 1.08; }
  draw(t) {
    if (!this.visible) return;
    this.press = Math.max(0, this.press - 1 / 60 * 5);
    const hov = this.hover ? 1.06 : 1;
    const pulse = this.pulse ? 1 + Math.sin(t * 5) * 0.06 : 1;
    const sc = (1 - this.press * 0.18) * hov * pulse;
    ctx.save(); ctx.translate(this.x, this.y); ctx.scale(sc, sc);
    ctx.rotate(Math.sin(t * 2 + this.x) * 0.03 + (this.press ? Math.sin(this.press * 20) * 0.15 : 0));
    circ(0, 7, this.r, 'rgba(0,0,0,0.25)');
    ctx.lineWidth = 6; ctx.strokeStyle = '#fff';
    circ(0, 0, this.r, this.bg, true);
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, this.r, 0, TAU); ctx.clip();
    ell(-this.r * 0.25, -this.r * 0.55, this.r * 0.7, this.r * 0.35, -0.3, 'rgba(255,255,255,0.28)');
    ctx.restore();
    if (this.drawIcon) this.drawIcon(t, this.r);
    else if (this.icon) emoji(this.icon, 0, 0, this.r * 1.05);
    ctx.restore();
  }
}
function drawRoundIconWheel(type, r, t) {
  drawWheel(type, 0, 0, r * 0.62 / (type === 1 ? 1.15 : 1), t * 2);
}

// ============================================================ arka planlar
function drawSky(top = '#62bdff', bot = '#d8f3ff') {
  const g = ctx.createLinearGradient(0, 0, 0, 430);
  g.addColorStop(0, top); g.addColorStop(1, bot);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, 440);
}
function drawSun(x, y, t) {
  ctx.save(); ctx.translate(x, y);
  ctx.save(); ctx.rotate(t * 0.3);
  ctx.fillStyle = 'rgba(255,214,60,0.55)';
  for (let i = 0; i < 12; i++) { ctx.rotate(TAU / 12); ctx.beginPath(); ctx.moveTo(-10, -62); ctx.lineTo(0, -92); ctx.lineTo(10, -62); ctx.fill(); }
  ctx.restore();
  ctx.lineWidth = 5; ctx.strokeStyle = '#f0a500';
  circ(0, 0, 54, '#ffd93b', true);
  ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(-18, -6, 8, Math.PI + 0.3, TAU - 0.3); ctx.stroke();
  ctx.beginPath(); ctx.arc(18, -6, 8, Math.PI + 0.3, TAU - 0.3); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 8, 20, 0.3, Math.PI - 0.3); ctx.stroke();
  circ(-32, 10, 8, 'rgba(255,120,120,0.5)'); circ(32, 10, 8, 'rgba(255,120,120,0.5)');
  ctx.restore();
}
function drawCloud(x, y, s) {
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x, y, 34 * s, 0, TAU); ctx.arc(x + 40 * s, y - 14 * s, 42 * s, 0, TAU);
  ctx.arc(x + 85 * s, y, 32 * s, 0, TAU); ctx.arc(x + 42 * s, y + 14 * s, 34 * s, 0, TAU);
  ctx.fill();
}
function drawClouds(off) {
  const cl = [[100, 90, 1], [430, 160, 0.75], [760, 70, 1.15], [1060, 175, 0.85], [1420, 110, 1]];
  const span = W + 500;
  for (const c of cl) { const x = ((c[0] - off) % span + span) % span - 250; drawCloud(x, c[1], c[2]); }
}
function drawHills(off, baseY, amp, col, f) {
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, H);
  for (let x = 0; x <= W + 16; x += 16) {
    const u = x + off;
    ctx.lineTo(x, baseY - amp * (0.6 * Math.sin(u * f) + 0.4 * Math.sin(u * f * 2.3 + 1)));
  }
  ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
}
function drawTree(x, y, s, k) {
  ctx.lineWidth = 4; ctx.strokeStyle = OUT;
  ctx.beginPath(); rr(x - 7 * s, y - 50 * s, 14 * s, 50 * s, 4); ctx.fillStyle = '#9a6a3a'; ctx.fill(); ctx.stroke();
  const g = ['#3fae49', '#56c35b', '#2f9e44'][k % 3];
  if (k % 2) { circ(x, y - 72 * s, 34 * s, g, true); circ(x - 10 * s, y - 80 * s, 8 * s, 'rgba(255,255,255,0.25)'); for (let i = 0; i < 3; i++) circ(x + (i - 1) * 16 * s, y - 64 * s + (i % 2) * 14 * s, 5 * s, '#ff4d5e'); }
  else { ctx.beginPath(); ctx.moveTo(x - 32 * s, y - 38 * s); ctx.lineTo(x, y - 120 * s); ctx.lineTo(x + 32 * s, y - 38 * s); ctx.closePath(); ctx.fillStyle = g; ctx.fill(); ctx.stroke(); }
}
function drawHouse(x, y, k) {
  ctx.lineWidth = 4; ctx.strokeStyle = OUT;
  const c = ['#ffd6a5', '#caffbf', '#a0c4ff', '#ffc6ff'][k % 4];
  ctx.beginPath(); rr(x - 50, y - 80, 100, 80, 4); ctx.fillStyle = c; ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 62, y - 78); ctx.lineTo(x, y - 128); ctx.lineTo(x + 62, y - 78); ctx.closePath(); ctx.fillStyle = '#ff6b6b'; ctx.fill(); ctx.stroke();
  ctx.beginPath(); rr(x - 34, y - 62, 26, 24, 3); ctx.fillStyle = GLASS; ctx.fill(); ctx.stroke();
  ctx.beginPath(); rr(x + 8, y - 50, 24, 50, 3); ctx.fillStyle = '#9a6a3a'; ctx.fill(); ctx.stroke();
}
const ROAD_TOP = 425, ROAD_BOT = 700;
function drawWorld(dist, t, sunMood) {
  drawSky();
  drawSun(1110, 105, t);
  drawClouds(dist * 0.06 + t * 12);
  drawHills(dist * 0.12, 345, 34, '#9fe0a0', 0.0042);
  drawHills(dist * 0.3, 395, 26, '#74cc72', 0.0065);
  // ağaçlar ve evler
  const off = dist * 0.55, sp = 170;
  for (let k = Math.floor(off / sp) - 1; k * sp - off < W + 100; k++) {
    const x = k * sp - off, h = hash(k);
    if (h < 0.18) drawHouse(x, 418, k);
    else if (h < 0.75) drawTree(x + h * 40, 420, 0.8 + h * 0.4, k);
  }
  ctx.fillStyle = '#66c466'; ctx.fillRect(0, 405, W, 25);
  // çiçekler
  for (let k = Math.floor(dist / 60) - 1; k * 60 - dist < W + 40; k++) {
    const x = k * 60 - dist + hash(k * 7) * 40;
    if (hash(k * 3) < 0.5) { circ(x, 414 + hash(k) * 8, 5, ['#ff6fb5', '#ffd23f', '#fff', '#ff4747'][k & 3]); circ(x, 414 + hash(k) * 8, 2, '#ffb000'); }
  }
  // yol
  ctx.fillStyle = '#5f6370'; ctx.fillRect(0, ROAD_TOP, W, ROAD_BOT - ROAD_TOP);
  ctx.fillStyle = '#6a6e7c'; ctx.fillRect(0, ROAD_TOP + 8, W, 30);
  const cOff = dist % 80;
  for (let x = -cOff; x < W; x += 80) {
    ctx.fillStyle = '#ff5a5a'; ctx.fillRect(x, ROAD_TOP - 6, 40, 12); ctx.fillStyle = '#fff'; ctx.fillRect(x + 40, ROAD_TOP - 6, 40, 12);
    ctx.fillStyle = '#ff5a5a'; ctx.fillRect(x, ROAD_BOT - 4, 40, 12); ctx.fillStyle = '#fff'; ctx.fillRect(x + 40, ROAD_BOT - 4, 40, 12);
  }
  const dOff = dist % 100;
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let x = -dOff; x < W; x += 100) { ctx.fillRect(x, 512, 54, 7); ctx.fillRect(x, 606, 54, 7); }
  ctx.fillStyle = '#5fb85f'; ctx.fillRect(0, ROAD_BOT + 8, W, H - ROAD_BOT);
}

// ============================================================ hayvanlar ve yol nesneleri
function drawAnimal(kind, t, state, st) {
  ctx.lineWidth = 4; ctx.strokeStyle = OUT; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const dizzy = state === 'duck' && st < 2.5;
  const eye = (x, y, r) => {
    if (dizzy) { ctx.save(); ctx.translate(x, y); ctx.rotate(t * 10); ctx.lineWidth = 2.5; ctx.beginPath(); for (let a = 0; a < 10; a += 0.3) ctx.lineTo(Math.cos(a) * a * r / 10, Math.sin(a) * a * r / 10); ctx.stroke(); ctx.restore(); }
    else { circ(x, y, r, '#fff', true); circ(x - r * 0.3, y, r * 0.5, OUT); }
  };
  const legs = (xs, top, col) => {
    const run = state === 'flee' ? Math.sin(t * 25) * 8 : 0;
    xs.forEach((x, i) => { ctx.beginPath(); rr(x - 6 + (i % 2 ? run : -run), top, 12, -top, 4); ctx.fillStyle = col; ctx.fill(); ctx.stroke(); });
  };
  switch (kind) {
    case 'inek':
      legs([-45, -20, 25, 50], -55, '#fff');
      ctx.beginPath(); ctx.moveTo(70, -95); ctx.quadraticCurveTo(95, -80, 88, -50); ctx.stroke();
      ell(0, -90, 75, 42, 0, '#fff', true);
      ctx.save(); ctx.beginPath(); ctx.ellipse(0, -90, 75, 42, 0, 0, TAU); ctx.clip();
      circ(-20, -105, 18, OUT); circ(30, -80, 14, OUT); circ(55, -110, 12, OUT); ctx.restore();
      ell(-10, -50, 16, 9, 0, '#ffb3c7', true);
      ell(-82, -118, 32, 28, 0, '#fff', true);
      ell(-100, -104, 22, 16, 0, '#ffb3c7', true); circ(-106, -104, 3, OUT); circ(-94, -104, 3, OUT);
      eye(-88, -126, 7); eye(-70, -126, 7);
      ctx.beginPath(); ctx.moveTo(-76, -144); ctx.quadraticCurveTo(-76, -160, -66, -160); ctx.stroke();
      ell(-56, -134, 12, 6, 0.4, '#fff', true);
      break;
    case 'ordek':
      legs([-10, 12], -22, '#ff9a1f');
      ell(0, -50, 44, 32, 0, '#ffe14d', true);
      circ(-34, -86, 24, '#ffe14d', true);
      ctx.beginPath(); ctx.moveTo(-54, -88); ctx.quadraticCurveTo(-78, -86, -76, -76); ctx.quadraticCurveTo(-62, -72, -50, -78); ctx.closePath(); ctx.fillStyle = '#ff9a1f'; ctx.fill(); ctx.stroke();
      eye(-38, -94, 6);
      ell(10, -52, 22, 12, -0.2, '#ffd21a', true);
      break;
    case 'tavuk':
      legs([-10, 12], -22, '#ff9a1f');
      ell(0, -56, 40, 36, 0, '#fff', true);
      circ(-30, -94, 22, '#fff', true);
      ctx.fillStyle = '#ff3b3b'; for (const x of [-38, -28, -18]) circ(x, -118, 8, '#ff3b3b', true);
      ctx.beginPath(); ctx.moveTo(-50, -94); ctx.lineTo(-66, -88); ctx.lineTo(-50, -84); ctx.closePath(); ctx.fillStyle = '#ffb000'; ctx.fill(); ctx.stroke();
      ell(-46, -78, 5, 8, 0, '#ff3b3b');
      eye(-34, -98, 6);
      ctx.beginPath(); ctx.moveTo(36, -70); ctx.quadraticCurveTo(56, -96, 46, -60); ctx.stroke();
      break;
    case 'domuz':
      legs([-36, -14, 16, 38], -40, '#ffb3c7');
      ctx.beginPath(); ctx.moveTo(58, -80); ctx.bezierCurveTo(80, -90, 70, -70, 80, -64); ctx.stroke();
      ell(0, -74, 62, 40, 0, '#ffb3c7', true);
      circ(-60, -92, 30, '#ffb3c7', true);
      ell(-86, -88, 12, 15, 0, '#ff8fb1', true); circ(-88, -93, 2.5, OUT); circ(-88, -83, 2.5, OUT);
      eye(-64, -104, 6); eye(-48, -106, 6);
      ctx.beginPath(); ctx.moveTo(-60, -118); ctx.lineTo(-52, -132); ctx.lineTo(-42, -116); ctx.closePath(); ctx.fillStyle = '#ff8fb1'; ctx.fill(); ctx.stroke();
      break;
    case 'koyun':
      legs([-30, -10, 14, 34], -40, '#3a3a4a');
      ctx.fillStyle = '#fff';
      ctx.beginPath(); for (let i = 0; i < 9; i++) { const a = i / 9 * TAU; ctx.moveTo(Math.cos(a) * 46 + 18, -80 + Math.sin(a) * 26); ctx.arc(Math.cos(a) * 46, -80 + Math.sin(a) * 26, 18, 0, TAU); } ctx.fill(); ctx.stroke();
      ell(0, -80, 52, 32, 0, '#fff');
      ell(-58, -96, 20, 26, 0.2, '#3a3a4a', true);
      eye(-64, -102, 6); eye(-50, -104, 6);
      ell(-46, -116, 12, 6, 0.5, '#3a3a4a', true);
      break;
  }
  if (state === 'duck' && st < 2.5) {
    for (let i = 0; i < 3; i++) {
      const a = t * 4 + i * TAU / 3;
      starPath(-50 + Math.cos(a) * 40, -170 + Math.sin(a) * 10, 9, 4); ctx.fillStyle = '#ffd93b'; ctx.fill(); ctx.lineWidth = 2; ctx.stroke();
    }
  }
}

function drawStar3d(x, y, r, t) {
  const sx = Math.cos(t * 3);
  ctx.save(); ctx.translate(x, y); ctx.scale(Math.abs(sx) * 0.8 + 0.2, 1);
  ctx.fillStyle = 'rgba(255,240,120,0.35)'; circ(0, 0, r * 1.5, 'rgba(255,240,120,0.35)');
  starPath(0, 0, r, r * 0.48); ctx.fillStyle = sx > 0 ? '#ffd93b' : '#ffc400'; ctx.fill();
  ctx.lineWidth = 4; ctx.strokeStyle = '#c58a00'; ctx.stroke();
  circ(-r * 0.2, -r * 0.1, r * 0.1, OUT); circ(r * 0.2, -r * 0.1, r * 0.1, OUT);
  ctx.lineWidth = 2.5; ctx.strokeStyle = OUT; ctx.beginPath(); ctx.arc(0, r * 0.08, r * 0.18, 0.3, Math.PI - 0.3); ctx.stroke();
  ctx.restore();
}

function drawGift(t, col) {
  const b = -Math.abs(Math.sin(t * 4)) * 14;
  ctx.save(); ctx.translate(0, b);
  ctx.lineWidth = 5; ctx.strokeStyle = OUT;
  ctx.beginPath(); rr(-38, -76, 76, 66, 8); ctx.fillStyle = col; ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffd23f'; ctx.fillRect(-8, -76, 16, 66);
  ctx.beginPath(); rr(-44, -92, 88, 20, 5); ctx.fillStyle = shade(col, 0.15); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffd23f'; ctx.fillRect(-8, -92, 16, 20);
  ell(-16, -102, 16, 10, -0.4, '#ffd23f', true); ell(16, -102, 16, 10, 0.4, '#ffd23f', true);
  text('?', 0, -42, 44, '#fff', { stroke: OUT, lw: 8 });
  ctx.restore();
}

const ANIMALS = ['inek', 'ordek', 'tavuk', 'domuz', 'koyun'];
function animalSound(k) {
  ({ inek: () => Snd.moo(), ordek: () => { Snd.quack(); Snd.quack(0.2); }, tavuk: () => Snd.cluck(), domuz: () => Snd.oink(), koyun: () => Snd.baa() })[k]();
}
const ANIMAL_TXT = { inek: 'MÖÖ!', ordek: 'VAK!', tavuk: 'GIDAK!', domuz: 'OİNK!', koyun: 'MEE!' };

// ============================================================ sahneler
let scene = null;
function go(s) { if (scene && scene.exit) scene.exit(); scene = s; P = []; if (s.enter) s.enter(); }
const car = newCar();

// ---------------- Başlık
const Title = {
  enter() { this.t = 0; this.changeT = 1; this.car = newCar(); this.car.color = 4; this.car.hat = 1; this.car.face = 2; this.car.trail = 1;
    this.play = new Button({ x: 640, y: 640, r: 62, bg: '#40c057', icon: '▶️', pulse: true });
    Music.play('garage'); },
  update(dt) {
    this.t += dt; this.changeT -= dt;
    const c = this.car; updateCarAnim(c, dt);
    c.wheelA += dt * 8;
    if (this.changeT < 0) {
      this.changeT = 1.3;
      randomOther(c, pick(['color', 'body', 'wheels', 'face', 'hat', 'trail', 'pattern']));
      c.squash = 0.5; poof(640, 400, 1.2);
    }
    emitTrail(c, 640, 540, 1.05, dt, -300);
  },
  draw() {
    const t = this.t;
    drawWorld(t * 300, t);
    ell(640, 545, 170, 18, 0, 'rgba(0,0,0,0.2)');
    drawP();
    drawCar(this.car, 640, 540, 1.05, { t, bob: Math.sin(t * 10) * 3 });
    const title = 'ÇILGIN ARABALAR';
    ctx.font = `800 96px ${FONT}`;
    let tw = ctx.measureText(title).width, x = 640 - tw / 2;
    const cols = ['#ff4747', '#ff9f1c', '#ffd23f', '#4cc95a', '#3d8bff', '#9b5de5', '#ff6fb5'];
    for (let i = 0; i < title.length; i++) {
      const ch = title[i]; const w = ctx.measureText(ch).width;
      const y = 92 + Math.sin(t * 4 + i * 0.6) * 10;
      ctx.save(); ctx.translate(x + w / 2, y); ctx.rotate(Math.sin(t * 3 + i) * 0.08);
      text(ch, 0, 0, 96, cols[i % cols.length], { stroke: '#fff', lw: 16 });
      text(ch, 0, 0, 96, cols[i % cols.length], { stroke: OUT, lw: 6 });
      ctx.restore();
      ctx.font = `800 96px ${FONT}`;
      x += w;
    }
    this.play.draw(t);
  },
  click(p) { this.play.press = 1; Snd.pop(); go(Garage); },
  key(e) { if (e.key.length === 1 || e.key === 'Enter' || e.key.startsWith('Arrow')) { Snd.pop(); go(Garage); } },
  buttons() { return [this.play]; },
};

// ---------------- Garaj (arabanı değiştir!)
const Garage = {
  enter() {
    this.t = 0; this.z = 0; this.vz = 0; this.idle = 0; this.changes = 0;
    car.mud = []; car.hatLift = 0; car.hatV = 0;
    const L = [0, 1, 2, 3], R = [4, 5, 6, 7], ys = [150, 290, 430, 570];
    this.btns = [];
    L.forEach((ci, k) => this.btns.push(this.catButton(ci, 100, ys[k])));
    R.forEach((ci, k) => this.btns.push(this.catButton(ci, 1180, ys[k])));
    this.dice = new Button({ x: 520, y: 652, r: 50, bg: '#ff922b', icon: '🎲', onClick: () => this.randomAll() });
    this.goBtn = new Button({ x: 770, y: 650, r: 62, bg: '#40c057', icon: '🏁', onClick: () => this.start() });
    this.btns.push(this.dice, this.goBtn);
    Music.play('garage');
    say('Arabanı değiştir!', true);
  },
  catButton(ci, x, y) {
    const cat = CATS[ci];
    const b = new Button({ x, y, r: 58, bg: cat.bg, icon: cat.icon, onClick: () => this.change(cat.key, +1) });
    if (cat.key === 'wheels') b.drawIcon = (t, r) => drawRoundIconWheel(car.wheels, r, t);
    if (cat.key === 'color') b.drawIcon = (t, r) => {
      const cs = [0, 2, 3, 4, 6];
      cs.forEach((ci2, i) => { const a = i / 5 * TAU - Math.PI / 2 + t * 0.5; ctx.lineWidth = 3; ctx.strokeStyle = OUT; circ(Math.cos(a) * r * 0.48, Math.sin(a) * r * 0.48, r * 0.2, COLORS[ci2][0], true); });
      ctx.lineWidth = 4; circ(0, 0, r * 0.26, COLORS[car.color][0], true);
    };
    if (cat.key === 'hat') b.drawIcon = (t, r) => { ctx.save(); ctx.translate(0, r * 0.38); ctx.scale(0.75, 0.75); if (car.hat) drawHat(car.hat, t); else emoji('🎩', 0, -r * 0.5, r); ctx.restore(); };
    return b;
  },
  partPos(key) {
    const s = 1.2, x = 640, y = 560 - this.z;
    const B = BODIES[car.body];
    switch (key) {
      case 'wheels': return { x: x + B.wheels[0] * s, y: y - 30 * s };
      case 'hat': return carTop(car, x, y, s);
      case 'face': return carAnchor(car, x, y, s, 'eye');
      case 'trail': case 'horn': return carAnchor(car, x, y, s, 'trail');
      default: return { x, y: y - 100 * s };
    }
  },
  change(key, d) {
    setCat(car, key, car[key] + d);
    this.afterChange(key);
    const name = CAT[key].names[car[key]];
    if (key !== 'horn') say(name);
  },
  afterChange(key) {
    this.changes++;
    this.idle = 0;
    const p = this.partPos(key);
    if (key === 'body' || key === 'color' || key === 'pattern') { Snd.poof(); poof(640, 460 - this.z, 1.5); }
    else { Snd.pop(); poof(p.x, p.y, 0.8); }
    if (key === 'horn') { honk(car, 640, 560 - this.z, 1.2); }
    if (key === 'trail') { for (let i = 0; i < 30; i++) emitTrail(car, 640 + rand(-10, 10), 560 - this.z, 1.2, 0.1, -250); }
    if (this.z <= 0) this.vz = 520;
    car.squash = 0.45; car.hatV += 300;
  },
  randomAll() {
    for (const c of CATS) if (Math.random() < 0.85) randomOther(car, c.key);
    Snd.magic(); poof(640, 440, 2.2); confetti(30, 300, 980, 200);
    if (this.z <= 0) this.vz = 700;
    car.squash = 0.6; car.hatV += 500;
    this.idle = 0; this.changes++;
    say(pick(['Sihirli zar!', 'Abrakadabra!', 'Vay canına!']), true);
  },
  start() { Snd.whoosh(); go(Drive); },
  update(dt) {
    this.t += dt; this.idle += dt;
    updateCarAnim(car, dt);
    if (this.z > 0 || this.vz > 0) {
      this.vz -= 2200 * dt; this.z += this.vz * dt;
      if (this.z <= 0) { this.z = 0; this.vz = 0; car.squash = 0.5; }
    }
    car.wheelA += dt * 1.5;
    emitTrail(car, 640, 560 - this.z, 1.2, dt * 0.5, -160);
    this.goBtn.pulse = this.changes >= 3 || this.t > 10;
    if (this.idle > 12) { this.idle = 0; say(pick(['Bir düğmeye bas!', 'Hadi yarışalım!', 'Bayrağa bas!'])); }
  },
  draw() {
    const t = this.t;
    // duvar
    const g = ctx.createLinearGradient(0, 0, 0, 520); g.addColorStop(0, '#ffe8c2'); g.addColorStop(1, '#ffd59a');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, 520);
    // tuğla deseni
    ctx.strokeStyle = 'rgba(200,140,80,0.25)'; ctx.lineWidth = 3;
    for (let y = 30, r = 0; y < 520; y += 46, r++) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      for (let x = (r % 2) * 60; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 46); ctx.stroke(); } }
    // pencere
    ctx.lineWidth = 8; ctx.strokeStyle = '#8b5a2b';
    ctx.save(); ctx.beginPath(); rr(470, 150, 340, 170, 20); ctx.clip();
    drawSky(); drawSun(740, 210, t); drawCloud(520 + (t * 15) % 320, 230, 0.6); ctx.restore();
    ctx.beginPath(); rr(470, 150, 340, 170, 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(640, 150); ctx.lineTo(640, 320); ctx.moveTo(470, 235); ctx.lineTo(810, 235); ctx.stroke();
    // alet panosu
    ctx.fillStyle = '#c9905a'; ctx.beginPath(); rr(190, 140, 220, 200, 12); ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#8b5a2b'; ctx.stroke();
    emoji('🔧', 240, 200, 52); emoji('🔨', 330, 205, 52); emoji('🪛', 245, 285, 46); emoji('🪣', 335, 285, 52);
    ctx.fillStyle = '#c9905a'; ctx.beginPath(); rr(870, 140, 220, 200, 12); ctx.fill(); ctx.stroke();
    emoji('🎨', 925, 205, 54); emoji('⭐', 1030, 200, 50); emoji('🎈', 925, 285, 50); emoji('🧸', 1030, 285, 50);
    // zemin
    ctx.fillStyle = '#b97a45'; ctx.fillRect(0, 520, W, 200);
    ctx.strokeStyle = 'rgba(80,40,10,0.25)'; ctx.lineWidth = 3;
    for (let y = 545; y < H; y += 36) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    // lastik yığını ve boya kutuları
    for (let i = 0; i < 3; i++) { ctx.lineWidth = 4; ctx.strokeStyle = OUT; ell(1040, 560 - i * 26, 46, 16, 0, '#33323d', true); ell(1040, 560 - i * 26, 20, 6, 0, '#55545f'); }
    for (let i = 0; i < 3; i++) { const x = 230 + i * 62; ctx.beginPath(); rr(x - 24, 510, 48, 56, 6); ctx.fillStyle = ['#ff4747', '#3d8bff', '#ffd23f'][i]; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = OUT; ctx.stroke(); ell(x, 510, 24, 7, 0, '#ddd', true); }
    // döner platform
    ctx.lineWidth = 6; ctx.strokeStyle = OUT;
    ell(640, 572, 250, 40, 0, '#8d96a8', true);
    ell(640, 566, 236, 32, 0, '#b7c0cf');
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + t; circ(640 + Math.cos(a) * 243, 572 + Math.sin(a) * 36, 5, Math.floor(t * 4 + i) % 2 ? '#ffd93b' : '#ff6b6b'); }
    // başlık
    const ts = 1 + Math.sin(t * 3) * 0.03;
    ctx.save(); ctx.translate(640, 62); ctx.scale(ts, ts);
    text('ARABANI DEĞİŞTİR!', 0, 0, 64, '#ff5a8a', { stroke: '#fff', lw: 14 });
    text('ARABANI DEĞİŞTİR!', 0, 0, 64, '#ff5a8a', { stroke: OUT, lw: 5 });
    ctx.restore();
    // araba
    ell(640, 566, 190 * (1 - this.z / 600), 22, 0, 'rgba(0,0,0,0.25)');
    drawP();
    drawCar(car, 640, 560 - this.z, 1.2, { t });
    for (const b of this.btns) b.draw(t);
  },
  click(p) {
    for (const b of this.btns) if (b.hit(p)) { b.press = 1; b.onClick(); return; }
    // arabaya tıkla = korna
    if (p.x > 420 && p.x < 860 && p.y > 160 && p.y < 600) { honk(car, 640, 560 - this.z, 1.2); if (this.z <= 0) this.vz = 380; this.idle = 0; }
  },
  key(e) {
    const k = e.key;
    if (e.repeat) return;
    if (k === 'Enter') { this.goBtn.press = 1; this.start(); return; }
    if (k === ' ') { honk(car, 640, 560 - this.z, 1.2); if (this.z <= 0) this.vz = 380; this.idle = 0; return; }
    if (k >= '1' && k <= '8') { const b = this.btns[+k - 1]; b.press = 1; b.onClick(); return; }
    if (k.length === 1 || k.startsWith('Arrow')) {
      // rastgele tuşa basmak = rastgele bir şey değişir
      const cat = pick(CATS);
      const b = this.btns.find(bb => bb.icon === cat.icon); if (b) b.press = 1;
      randomOther(car, cat.key); this.afterChange(cat.key);
      if (cat.key !== 'horn') say(cat.names[car[cat.key]]);
    }
  },
  buttons() { return this.btns; },
};

// ---------------- Yarış
const LANES = [470, 563, 656];
const COURSE_LEN = 17500;
const CARX = 300;
const GRAV = 2300;
const laneScale = y => 0.56 + (y - LANES[0]) / (LANES[2] - LANES[0]) * 0.12;

function buildCourse() {
  const o = [];
  const L = COURSE_LEN;
  const specials = [
    { type: 'gate', x: L * 0.3 }, { type: 'wash', x: L * 0.55 }, { type: 'gate', x: L * 0.75 }, { type: 'wash', x: L * 0.92 },
  ];
  specials.forEach(s => { s.span = true; o.push(s); });
  const near = x => specials.some(s => Math.abs(s.x - x) < 320);
  let x = 900, n = 0, lastType = '';
  const add = (type, lane, extra = {}) => o.push(Object.assign({ type, x, lane, t: rand(0, 10) }, extra));
  // ilk birkaç şey: kolay yıldızlar
  for (let i = 0; i < 5; i++) o.push({ type: 'star', x: 700 + i * 80, lane: 1, h: 45 });
  x = 1250;
  const table = [['stars', 26], ['gift', 13], ['paint', 10], ['mud', 7], ['banana', 8], ['animal', 15], ['ramp', 9], ['balloons', 7], ['boost', 5]];
  const tot = table.reduce((a, b) => a + b[1], 0);
  while (x < L - 500) {
    if (near(x)) { x += 260; continue; }
    let r = Math.random() * tot, type = 'stars';
    for (const [k, w] of table) { if ((r -= w) < 0) { type = k; break; } }
    if (type === lastType && type !== 'stars') type = 'stars';
    if (n < 3 && type !== 'stars') type = ['gift', 'animal', 'ramp'][n];
    lastType = type; n++;
    const lane = randi(0, 2);
    switch (type) {
      case 'stars': {
        const zig = Math.random() < 0.5; let l = lane;
        for (let i = 0; i < 6; i++) {
          o.push({ type: 'star', x: x + i * 75, lane: l, h: 45 });
          if (zig && i % 2 === 1) l = clamp(l + pick([-1, 1]), 0, 2);
        }
        x += 6 * 75;
        break;
      }
      case 'gift': add('gift', lane, { col: pick(['#ff4d6d', '#4dabf7', '#9775fa', '#40c057']) });
        o.push({ type: 'star', x: x, lane: (lane + 1) % 3, h: 45 }); o.push({ type: 'star', x: x, lane: (lane + 2) % 3, h: 45 }); break;
      case 'paint': add('paint', lane, { ci: randi(0, COLORS.length - 1) }); break;
      case 'mud': add('mud', lane); break;
      case 'banana': add('banana', lane); break;
      case 'animal': add('animal', lane, { kind: pick(ANIMALS), state: 'idle', st: 0, dy: 0, hop: 0 }); break;
      case 'ramp': add('ramp', lane);
        for (let i = 0; i < 4; i++) o.push({ type: 'star', x: x + 230 + i * 85, lane, h: 120 + Math.sin((i + 0.5) / 4 * Math.PI) * 90 });
        x += 500; break;
      case 'balloons': add('balloons', lane, { cols: [pick(['#ff4747', '#ff6fb5']), pick(['#3d8bff', '#25c4c4']), pick(['#ffd23f', '#4cc95a'])], popped: 0 }); break;
      case 'boost': add('boost', lane); break;
    }
    x += rand(300, 430);
  }
  o.push({ type: 'finish', x: L, span: true });
  o.sort((a, b) => a.x - b.x);
  return o;
}

const Drive = {
  enter() {
    Object.assign(this, { t: 0, dist: 0, speed: 0, lane: 1, ly: LANES[1], z: 0, vz: 0, rot: 0, flipV: 0, wobT: 0,
      boostT: 0, stars: 0, finished: false, finT: 0, onRamp: null, starPulse: 0, startT: 2.6, beeps: 0, pirtT: 3, shake: 0 });
    this.objs = buildCourse();
    car.mud = []; car.hatLift = 0; car.hatV = 0;
    this.home = new Button({ x: 1220, y: 690, r: 24, bg: '#868e96', icon: '🏠' });
    Music.play('drive');
  },
  carS() { return laneScale(this.ly); },
  carY() { return this.ly - this.z; },
  update(dt) {
    this.t += dt;
    updateCarAnim(car, dt);
    this.starPulse = Math.max(0, this.starPulse - dt * 3);
    this.shake = Math.max(0, this.shake - dt * 3);
    const s = this.carS();
    if (this.startT > 0) {
      this.startT -= dt;
      const b = this.startT > 1.8 ? 0 : this.startT > 1.0 ? 1 : this.startT > 0.2 ? 2 : 3;
      if (b > this.beeps) { this.beeps = b; Snd.beep(b === 3); if (b === 3) say('Başla!', true); }
      if (this.beeps === 0 && this.startT < 2.5) { this.beeps = 0.5; Snd.beep(false); }
      emitTrail(car, CARX, this.carY(), s, dt * 0.4, -120);
      return;
    }
    // hız
    let target = 440;
    if (keys.ArrowRight || keys.d || keys.D) target = 640;
    if (keys.ArrowLeft || keys.a || keys.A) target = 260;
    if (this.boostT > 0) { this.boostT -= dt; target = 900; }
    if (this.finished) target = 0;
    this.speed += (target - this.speed) * Math.min(1, dt * (this.finished ? 1.6 : 2.5));
    this.dist += this.speed * dt;
    this.ly += (LANES[this.lane] - this.ly) * Math.min(1, dt * 11);
    // zıplama
    if (this.z > 0 || this.vz > 0) {
      this.vz -= GRAV * dt; this.z += this.vz * dt;
      if (this.flipV) this.rot += this.flipV * dt;
      if (this.z <= 0) {
        this.z = 0;
        if (this.vz < -500) { car.squash = 0.7; Snd.thud(); this.shake = 1; for (let i = 0; i < 10; i++) addP({ x: CARX + rand(-60, 60), y: this.ly, vx: rand(-200, 100) - this.speed * 0.5, vy: rand(-120, -30), size: rand(6, 12), grow: 20, life: 0.5, col: 'rgba(230,220,200,0.9)' }); }
        this.vz = 0; this.rot = 0; this.flipV = 0;
      }
    }
    if (this.wobT > 0) { this.wobT -= dt; this.rot = Math.sin(this.wobT * 16) * 0.4 * Math.min(1, this.wobT); if (this.wobT <= 0) this.rot = 0; }
    const wr = WHEEL_R[car.wheels];
    car.wheelA += this.speed * dt / (wr * s);
    emitTrail(car, CARX, this.carY(), s, dt, -this.speed);
    if (this.boostT > 0) {
      const a = carAnchor(car, CARX, this.carY(), s, 'trail');
      for (let i = 0; i < 2; i++) addP({ x: a.x, y: a.y + rand(-8, 8), vx: -this.speed - 200, vy: rand(-30, 30), size: rand(8, 16), grow: -10, life: 0.35, col: pick(['#ff6a00', '#ffd000', '#ff3b00']) });
    }
    if (car.trail === 5 && !this.finished) { this.pirtT -= dt; if (this.pirtT < 0) { this.pirtT = rand(3, 6); Snd.fart(0, 0.5); } }
    this.collide(dt);
    if (this.finished) {
      this.finT += dt;
      if (Math.random() < 0.5) confetti(2);
      if (this.finT > 3.2) go(End);
    }
  },
  collide(dt) {
    const cx = this.dist + CARX, s = this.carS();
    for (const o of this.objs) {
      const dx = o.x - cx;
      if (o.type === 'animal') this.updateAnimal(o, dt, dx);
      if (dx > 1100) break;
      if (o.done) continue;
      if (o.span) { if (dx <= 0) { o.done = true; this.hitSpan(o); } continue; }
      const laneHit = Math.abs(this.ly - LANES[o.lane]) < 46;
      const ls = laneScale(LANES[o.lane]);
      if (o.type === 'animal') {
        if (o.state === 'idle' && laneHit && dx < 135 && dx > -30 && this.z < 5) {
          o.state = 'duck'; o.st = 0; o.done = true;
          this.vz = 720; this.flipV = 0; car.hatV += 500; Snd.boing();
          setTimeout(() => animalSound(o.kind), 150);
          comic(ANIMAL_TXT[o.kind], o.x - this.dist, LANES[o.lane] - 150 * ls, '#ffffff', 56);
          say(pick(['Hoop!', 'Zıpla!', 'Az kalsın!']));
        }
        continue;
      }
      if (o.type === 'ramp') {
        const len = 150 * ls, rh = 64 * ls;
        if (laneHit && dx <= 0 && dx >= -len && this.z <= rh * (-dx / len) + 4 && this.vz <= 0) {
          this.z = rh * (-dx / len); this.vz = 0; this.onRamp = o;
        } else if (this.onRamp === o && dx < -len) {
          this.onRamp = null; o.done = true;
          this.vz = 980; this.flipV = TAU / (2 * 980 / GRAV); car.hatV += 900;
          Snd.whee(); say(pick(['Uçuyoruz!', 'Yuppii!', 'Vuuuu!']), true);
          comic('VIIIN!', CARX + 60, this.carY() - 160 * s, '#6fe3ff', 60);
        }
        continue;
      }
      const hw = { star: 42, gift: 48, paint: 60, mud: 55, banana: 36, balloons: 42, boost: 60 }[o.type] || 40;
      if (!laneHit || Math.abs(dx) > hw) continue;
      if (o.type === 'star' && !(o.h > this.z - 40 && o.h < this.z + 150)) continue;
      if ((o.type === 'gift' || o.type === 'balloons') && this.z > 120) continue;
      o.done = true;
      this.hit(o, o.x - this.dist, LANES[o.lane], ls);
    }
  },
  addStar(x, y, n = 1) {
    for (let i = 0; i < n; i++) {
      addP({ kind: 'flystar', sx: x + i * 10, sy: y, tx: 60, ty: 52, t: -i * 0.08, dur: 0.75, life: 2, onDone: () => { this.stars++; this.starPulse = 1; } });
    }
  },
  hit(o, sx, gy, ls) {
    const s = this.carS(), cy = this.carY();
    switch (o.type) {
      case 'star': Snd.ding(); sparkle(sx, gy - o.h, 0.6, 5); this.addStar(sx, gy - o.h); break;
      case 'gift': {
        const keys2 = ['body', 'wheels', 'face', 'hat', 'trail', 'pattern', 'horn', 'color'];
        const a = pick(keys2); let b = pick(keys2); while (b === a) b = pick(keys2);
        randomOther(car, a); randomOther(car, b);
        Snd.poof(); poof(CARX, cy - 80 * s, 1.4); car.squash = 0.6; car.hatV += 400;
        comic('SİHİR!', CARX + 40, cy - 190 * s, '#c77dff', 60);
        say(pick(['Sihir!', 'Abrakadabra!', 'Vay! Araba değişti!', 'Bu ne böyle!']), true);
        this.addStar(sx, gy - 60, 2);
        break;
      }
      case 'paint': {
        let ci = o.ci; if (ci === car.color) ci = (ci + 3) % COLORS.length;
        car.color = ci; const col = COLORS[ci][0];
        Snd.splash();
        for (let i = 0; i < 24; i++) addP({ x: CARX + rand(-60, 60) * s, y: gy - rand(0, 40), vx: rand(-260, 200), vy: rand(-520, -150), g: 1400, size: rand(5, 11), life: 0.9, col });
        car.squash = 0.5; comic('ŞLAP!', CARX + 40, cy - 170 * s, col, 56);
        say(COLORS[ci][1] + '!');
        break;
      }
      case 'mud':
        Snd.squelch(); car.squash = 0.6;
        for (let i = 0; i < 9; i++) car.mud.push({ x: rand(-140, 140), y: rand(-160, -30), r: rand(9, 20) });
        if (car.mud.length > 40) car.mud.splice(0, car.mud.length - 40);
        for (let i = 0; i < 16; i++) addP({ x: CARX + rand(-60, 60) * s, y: gy - rand(0, 20), vx: rand(-300, 150), vy: rand(-450, -120), g: 1400, size: rand(5, 10), life: 0.8, col: '#7a4a1e' });
        comic('ÇAMUR!', CARX + 40, cy - 170 * s, '#a0703a', 56);
        say(pick(['Iyy, çamur!', 'Çamur oldu!']));
        break;
      case 'banana':
        Snd.wiu(); this.wobT = 1.3; car.hatV += 300;
        comic('KAYDIK!', CARX + 40, cy - 170 * s, '#ffe14d', 56);
        for (let i = 0; i < 5; i++) addP({ kind: 'star', x: CARX, y: cy - 150 * s, vx: rand(-90, 90), vy: rand(-90, -40), size: 9, life: 1.2, col: '#ffd93b', vr: 6 });
        say(pick(['Kaydııık!', 'Muz kabuğu!']));
        break;
      case 'balloons':
        for (let i = 0; i < 3; i++) setTimeout(() => { Snd.pop(); }, i * 110);
        o.popped = 1;
        for (let i = 0; i < 3; i++) { const bx = sx + (i - 1) * 30 * ls, by = gy - (190 + i * 20) * ls; sparkle(bx, by, 0.7, 6); confetti(8, bx - 20, bx + 20, by); }
        this.addStar(sx, gy - 200 * ls, 3);
        comic('PAT PAT!', sx + 20, gy - 260 * ls, '#ff6fb5', 56);
        break;
      case 'boost':
        this.boostT = 1.8; Snd.whoosh(); comic('HIZ!', CARX + 60, cy - 160 * s, '#ff922b', 60);
        say(pick(['Hızlı!', 'Turbo!']));
        break;
    }
  },
  hitSpan(o) {
    const s = this.carS(), cy = this.carY();
    if (o.type === 'gate') {
      for (const c of CATS) if (c.key !== 'horn' || Math.random() < 0.5) randomOther(car, c.key);
      Snd.magic(); poof(CARX, cy - 90 * s, 2); confetti(40, 0, 700);
      car.squash = 0.7; car.hatV += 600;
      comic('HER ŞEY DEĞİŞTİ!', 640, 250, '#ff6fb5', 80);
      say('Sihirli kapı! Her şey değişti!', true);
      this.addStar(CARX, cy - 100, 3);
    } else if (o.type === 'wash') {
      const had = car.mud.length > 0; car.mud = [];
      for (let i = 0; i < 30; i++) addP({ kind: 'bubble', x: CARX + rand(-90, 90), y: cy - rand(0, 140) * s, vx: rand(-200, 50) - 100, vy: rand(-120, -20), size: rand(8, 20), life: rand(0.8, 1.6) });
      for (let i = 0; i < 6; i++) setTimeout(() => Snd.bubble(), i * 70);
      sparkle(CARX, cy - 80 * s, 1, 10);
      comic(had ? 'TERTEMİZ!' : 'KÖPÜK!', CARX + 60, cy - 170 * s, '#6fe3ff', 60);
      say(had ? 'Tertemiz oldu!' : 'Köpük köpük!', true);
    } else if (o.type === 'finish') {
      this.finished = true; this.finT = 0;
      Snd.fanfare(); confetti(120); car.hatV += 700; this.vz = 600;
      say('Yaşasın! Bitiş çizgisi!', true);
      comic('BİTTİ!', 640, 220, '#ffd93b', 100);
    }
  },
  updateAnimal(o, dt, dx) {
    o.t += dt; o.st += dt;
    if (o.state === 'flee') {
      o.dy += (o.fleeTo - o.dy) * Math.min(1, dt * 3);
      o.hop = Math.abs(Math.sin(o.st * 9)) * 30 * Math.max(0, 1 - o.st / 1.5);
    }
  },
  doHonk() {
    if (this.startT > 0) { honk(car, CARX, this.carY(), this.carS()); return; }
    honk(car, CARX, this.carY(), this.carS());
    const cx = this.dist + CARX;
    let scared = 0;
    for (const o of this.objs) {
      const dx = o.x - cx;
      if (dx > 800) break;
      if (o.type === 'animal' && o.state === 'idle' && dx > -20) {
        o.state = 'flee'; o.st = 0; o.done = true;
        const gy = LANES[o.lane];
        o.fleeTo = (o.lane === 2 ? 712 : o.lane === 0 ? 405 : (Math.random() < 0.5 ? 405 : 712)) - gy;
        setTimeout(() => animalSound(o.kind), 250 + scared * 200);
        const ls = laneScale(gy);
        comic(ANIMAL_TXT[o.kind], o.x - this.dist, gy - 160 * ls, '#fff', 50);
        this.addStar(o.x - this.dist, gy - 100 * ls, 1);
        scared++;
      }
    }
    if (scared) say(pick(['Kaçtı!', 'Çekil yoldan!', 'Hah ha!']));
  },
  laneUp() { if (this.lane > 0) { this.lane--; Snd.swish(); } },
  laneDown() { if (this.lane < 2) { this.lane++; Snd.swish(); } },
  key(e) {
    const k = e.key;
    if (this.finished) return;
    if (k === 'ArrowUp' || k === 'w' || k === 'W') this.laneUp();
    else if (k === 'ArrowDown' || k === 's' || k === 'S') this.laneDown();
    else if (k === 'ArrowRight' || k === 'ArrowLeft' || k === 'Shift' || k === 'Control' || k === 'Alt' || k === 'Meta') { /* hız */ }
    else if (k === ' ' || k === 'Enter' || k.length === 1) { if (!e.repeat) this.doHonk(); }
  },
  click(p) {
    if (this.home.hit(p)) { Snd.pop(); go(Garage); return; }
    if (this.finished) return;
    const cy = this.carY(), s = this.carS();
    if (Math.abs(p.x - CARX) < 150 * s * 1.2 && p.y > cy - 200 * s && p.y < cy + 10) { this.doHonk(); return; }
    if (p.y < this.ly - 50) this.laneUp(); else if (p.y > this.ly + 25) this.laneDown(); else this.doHonk();
  },
  buttons() { return [this.home]; },
  drawObj(o, sx, t) {
    const gy = LANES[o.lane] + (o.dy || 0), ls = laneScale(LANES[o.lane]);
    ctx.save(); ctx.translate(sx, gy); ctx.scale(ls, ls);
    switch (o.type) {
      case 'star': if (!o.done) { ctx.restore(); drawStar3d(sx, LANES[o.lane] - o.h * (o.h > 50 ? 1 : 1), 23, t + o.x * 0.01); return; } break;
      case 'gift': if (!o.done) { ell(0, 0, 44, 10, 0, 'rgba(0,0,0,0.2)'); drawGift(t + o.t, o.col); } break;
      case 'animal': {
        ell(0, 0, 70, 12, 0, 'rgba(0,0,0,0.2)');
        ctx.translate(0, -(o.hop || 0));
        if (o.state === 'duck') { const sq = Math.max(0, 1 - o.st * 2) * 0.35; ctx.scale(1 + sq, 1 - sq); }
        if (o.state === 'idle') ctx.translate(0, -Math.abs(Math.sin(t * 3 + o.t)) * 4);
        if (o.state === 'flee' && o.fleeTo < 0) ctx.scale(0.9, 0.9);
        drawAnimal(o.kind, t + o.t, o.state, o.st);
        break;
      }
      case 'ramp': {
        ctx.lineWidth = 5; ctx.strokeStyle = OUT; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(150, -82); ctx.lineTo(150, -64); ctx.lineTo(0, 0); ctx.closePath(); ctx.fillStyle = '#e0a15a'; ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(150, -64); ctx.lineTo(150, 0); ctx.closePath(); ctx.fillStyle = '#c47f3a'; ctx.fill(); ctx.stroke();
        ctx.save(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(150, -64); ctx.lineTo(150, 0); ctx.closePath(); ctx.clip();
        for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? '#ffd23f' : OUT; ctx.fillRect(40 + i * 20, -70, 20, 80); }
        ctx.restore(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(150, -64); ctx.lineTo(150, 0); ctx.closePath(); ctx.stroke();
        break;
      }
      case 'balloons': {
        if (o.popped) break;
        ctx.lineWidth = 3; ctx.strokeStyle = OUT;
        ctx.beginPath(); rr(-14, -20, 28, 20, 4); ctx.fillStyle = '#868e96'; ctx.fill(); ctx.stroke();
        for (let i = 0; i < 3; i++) {
          const bx = (i - 1) * 32 + Math.sin(t * 2 + i) * 8, by = -190 - i * 20 + Math.sin(t * 3 + i * 2) * 6;
          ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -20); ctx.quadraticCurveTo(bx * 0.5, (by - 20) / 2, bx, by + 34); ctx.stroke();
          ctx.lineWidth = 4; ell(bx, by, 28, 34, 0, o.cols[i], true);
          ell(bx - 9, by - 12, 7, 11, -0.4, 'rgba(255,255,255,0.6)');
        }
        break;
      }
    }
    ctx.restore();
  },
  drawDecal(o, sx, t) {
    const gy = LANES[o.lane], ls = laneScale(gy);
    ctx.save(); ctx.translate(sx, gy); ctx.scale(ls, ls);
    ctx.lineWidth = 4; ctx.strokeStyle = OUT;
    switch (o.type) {
      case 'paint': {
        const col = COLORS[o.ci][0];
        ctx.fillStyle = col; ctx.beginPath();
        for (let i = 0; i <= 24; i++) { const a = i / 24 * TAU; const r = 1 + hash(i + o.x) * 0.35; ctx.lineTo(Math.cos(a) * 80 * r, Math.sin(a) * 22 * r - 10); }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // devrilmiş kova
        ctx.save(); ctx.translate(70, -30); ctx.rotate(-1.2);
        ctx.beginPath(); ctx.moveTo(-22, -26); ctx.lineTo(22, -26); ctx.lineTo(17, 22); ctx.lineTo(-17, 22); ctx.closePath(); ctx.fillStyle = '#dfe4ea'; ctx.fill(); ctx.stroke();
        ell(0, -26, 22, 7, 0, col, true); ctx.restore();
        break;
      }
      case 'mud':
        ctx.fillStyle = '#7a4a1e'; ctx.beginPath();
        for (let i = 0; i <= 24; i++) { const a = i / 24 * TAU; const r = 1 + hash(i * 3 + o.x) * 0.3; ctx.lineTo(Math.cos(a) * 80 * r, Math.sin(a) * 22 * r - 8); }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        for (let i = 0; i < 3; i++) { const ph = (t * 0.8 + i * 0.33) % 1; circ(-30 + i * 30, -10, 4 + ph * 6, `rgba(160,110,60,${1 - ph})`); }
        break;
      case 'banana':
        if (o.done) break;
        ctx.scale(1.7, 1.7); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(-34, -10); ctx.quadraticCurveTo(0, -34, 34, -10); ctx.quadraticCurveTo(0, -18, -34, -10); ctx.closePath(); ctx.fillStyle = '#ffe14d'; ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -24); ctx.quadraticCurveTo(-30, -8, -40, 4); ctx.quadraticCurveTo(-16, -10, 0, -18); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(4, -24); ctx.quadraticCurveTo(30, -8, 42, 6); ctx.quadraticCurveTo(18, -10, 4, -18); ctx.closePath(); ctx.fill(); ctx.stroke();
        circ(0, -26, 5, '#7a5a1e', true);
        break;
      case 'boost': {
        ctx.scale(1.3, 1.3);
        ctx.beginPath(); rr(-80, -26, 160, 34, 10); ctx.fillStyle = '#3a3a4a'; ctx.fill(); ctx.stroke();
        for (let i = 0; i < 4; i++) {
          const on = Math.floor(t * 8 - i) % 4 === 0;
          ctx.beginPath(); ctx.moveTo(-60 + i * 34, -20); ctx.lineTo(-40 + i * 34, -9); ctx.lineTo(-60 + i * 34, 2);
          ctx.lineWidth = 8; ctx.strokeStyle = on ? '#fff27a' : '#ff922b'; ctx.stroke();
        }
        break;
      }
    }
    ctx.restore();
  },
  // yolun tamamını kaplayan şeyler: sihirli kapı, yıkama, bitiş
  drawSpan(o, sx, t, front) {
    const topY = ROAD_TOP + 2, botY = ROAD_BOT;
    const slant = 40; // eğik perspektif
    const xt = sx + slant, xb = sx - 10;
    if (o.type === 'finish') {
      if (!front) {
        ctx.save();
        ctx.beginPath(); ctx.moveTo(xt - 24, topY); ctx.lineTo(xt + 24, topY); ctx.lineTo(xb + 24, botY); ctx.lineTo(xb - 24, botY); ctx.closePath(); ctx.clip();
        for (let r = 0; r < 14; r++) for (let c = 0; c < 4; c++) { ctx.fillStyle = (r + c) % 2 ? '#fff' : '#222'; ctx.fillRect(xb - 60 + c * 24 + (14 - r) * 3.6, topY + r * 20.5, 24, 20.5); }
        ctx.restore();
        this.pole(xt, topY, 260, t, true);
      } else this.pole(xb, botY, 300, t, true);
      return;
    }
    if (o.type === 'gate') {
      if (!front) { this.pole(xt, topY, 240, t, false); return; }
      ctx.save(); ctx.globalAlpha = 0.45 + Math.sin(t * 6) * 0.1;
      const rc = ['#ff4747', '#ff9f1c', '#ffd23f', '#4cc95a', '#3d8bff', '#9b5de5'];
      for (let i = 0; i < 6; i++) {
        ctx.fillStyle = rc[i]; ctx.beginPath();
        const w = 14, ox = (i - 3) * w;
        ctx.moveTo(xt + ox, topY - 220); ctx.lineTo(xt + ox + w, topY - 220); ctx.lineTo(xb + ox + w, botY); ctx.lineTo(xb + ox, botY); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
      for (let i = 0; i < 6; i++) { const k = (t * 0.7 + i / 6) % 1; starPath(lerp(xt, xb, k) + Math.sin(t * 5 + i) * 30, lerp(topY - 220, botY, k), 9, 4); ctx.fillStyle = '#fff'; ctx.fill(); }
      this.pole(xb, botY, 300, t, false);
      // tepede gökkuşağı yayı
      ctx.lineWidth = 12;
      rc.forEach((c, i) => { ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(xt + 3, topY - 210, 70 - i * 11, Math.PI, TAU); ctx.stroke(); });
      return;
    }
    if (o.type === 'wash') {
      if (!front) {
        ctx.lineWidth = 5; ctx.strokeStyle = OUT;
        ctx.beginPath(); rr(xt - 90, topY - 170, 180, 120, 14); ctx.fillStyle = '#74c0fc'; ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(xt - 105, topY - 165); ctx.lineTo(xt, topY - 215); ctx.lineTo(xt + 105, topY - 165); ctx.closePath(); ctx.fillStyle = '#4dabf7'; ctx.fill(); ctx.stroke();
        emoji('🫧', xt, topY - 110, 60);
        this.brush(xt, topY + 10, t);
        return;
      }
      ctx.save(); ctx.globalAlpha = 0.35;
      for (let i = 0; i < 5; i++) { ctx.fillStyle = i % 2 ? '#a5d8ff' : '#e7f5ff'; ctx.beginPath(); const w = 16, ox = (i - 2.5) * w;
        ctx.moveTo(xt + ox, topY); ctx.lineTo(xt + ox + w, topY); ctx.lineTo(xb + ox + w, botY); ctx.lineTo(xb + ox, botY); ctx.closePath(); ctx.fill(); }
      ctx.restore();
      for (let i = 0; i < 8; i++) { const k = (t * 0.9 + i / 8) % 1; ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(80,160,230,0.9)'; circ(lerp(xt, xb, k) + Math.sin(t * 4 + i) * 40, lerp(topY, botY, k), 8 + (i % 3) * 4, 'rgba(220,240,255,0.5)', true); }
      this.brush(xb, botY - 10, t);
    }
  },
  pole(x, y, h, t, checker) {
    ctx.lineWidth = 5; ctx.strokeStyle = OUT;
    ctx.beginPath(); rr(x - 7, y - h, 14, h, 5); ctx.fillStyle = '#e9ecef'; ctx.fill(); ctx.stroke();
    const wv = Math.sin(t * 6) * 8;
    ctx.beginPath(); ctx.moveTo(x + 7, y - h + 4); ctx.quadraticCurveTo(x + 40, y - h - 6 + wv, x + 80, y - h + 4); ctx.lineTo(x + 80, y - h + 54); ctx.quadraticCurveTo(x + 40, y - h + 44 + wv, x + 7, y - h + 54); ctx.closePath();
    if (checker) {
      ctx.save(); ctx.clip(); for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) { ctx.fillStyle = (r + c) % 2 ? '#fff' : '#222'; ctx.fillRect(x + 7 + c * 13, y - h - 10 + r * 17, 13, 17); } ctx.restore();
    } else { ctx.fillStyle = '#ff6fb5'; ctx.fill(); }
    ctx.stroke();
    starPath(x, y - h - 10, 14, 6); ctx.fillStyle = '#ffd93b'; ctx.fill(); ctx.stroke();
  },
  brush(x, y, t) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(t * 8);
    ctx.lineWidth = 4; ctx.strokeStyle = OUT; circ(0, 0, 36, '#ff6b6b', true);
    ctx.strokeStyle = '#ffc9c9'; ctx.lineWidth = 3;
    for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 12, Math.sin(a) * 12); ctx.lineTo(Math.cos(a) * 34, Math.sin(a) * 34); ctx.stroke(); }
    ctx.restore();
  },
  draw() {
    const t = this.t;
    ctx.save();
    if (this.shake) ctx.translate(rand(-1, 1) * this.shake * 6, rand(-1, 1) * this.shake * 6);
    drawWorld(this.dist, t);
    const vis = [];
    for (const o of this.objs) {
      const sx = o.x - this.dist;
      if (sx < -400 || sx > W + 400) continue;
      vis.push([o, sx]);
    }
    // yol üstü (düz) şeyler
    for (const [o, sx] of vis) if (['paint', 'mud', 'banana', 'boost'].includes(o.type)) this.drawDecal(o, sx, t);
    for (const [o, sx] of vis) if (o.span) this.drawSpan(o, sx, t, false);
    // derinliğe göre sırala
    const list = [];
    for (const [o, sx] of vis) if (!o.span && !['paint', 'mud', 'banana', 'boost'].includes(o.type)) list.push({ y: LANES[o.lane] + (o.dy || 0), o, sx });
    list.push({ y: this.ly + 0.5, car: true });
    list.sort((a, b) => a.y - b.y);
    const s = this.carS();
    for (const it of list) {
      if (it.car) {
        const shw = 120 * s * Math.max(0.3, 1 - this.z / 400);
        ell(CARX, this.ly + 2, shw * 1.2, 12 * s * 1.5, 0, 'rgba(0,0,0,0.25)');
        let x = CARX; if (this.startT > 0) x += Math.sin(t * 70) * 1.5;
        drawCar(car, x, this.carY(), s, { t, rot: this.rot });
      } else this.drawObj(it.o, it.sx, t);
    }
    for (const [o, sx] of vis) if (o.span) this.drawSpan(o, sx, t, true);
    drawP();
    ctx.restore();
    this.drawHUD(t);
  },
  drawHUD(t) {
    // yıldız sayacı
    const sp = 1 + this.starPulse * 0.35;
    ctx.save(); ctx.translate(60, 52); ctx.scale(sp, sp);
    ctx.lineWidth = 5; ctx.strokeStyle = '#b8860b'; starPath(0, 0, 34, 16); ctx.fillStyle = '#ffd93b'; ctx.fill(); ctx.stroke();
    ctx.restore();
    text(String(this.stars), 104, 56, 54, '#fff', { align: 'left', stroke: OUT, lw: 10 });
    // ilerleme çubuğu
    const p = clamp((this.dist + CARX) / COURSE_LEN, 0, 1);
    const bx = 400, bw = 480, by = 40;
    ctx.lineWidth = 5; ctx.strokeStyle = OUT;
    ctx.beginPath(); rr(bx, by, bw, 22, 11); ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fill(); ctx.stroke();
    ctx.beginPath(); rr(bx + 3, by + 3, Math.max(16, (bw - 6) * p), 16, 8); ctx.fillStyle = '#69db7c'; ctx.fill();
    for (const o of this.objs) if (o.type === 'gate' || o.type === 'wash') emoji(o.type === 'gate' ? '🌈' : '🫧', bx + bw * o.x / COURSE_LEN, by + 11, 22);
    emoji('🏁', bx + bw + 22, by + 8, 40);
    ctx.save(); const mc = { ...car, hatLift: 0, honkT: 0, squash: 0, mud: car.mud };
    drawCar(mc, bx + bw * p, by + 18, 0.2, { t }); ctx.restore();
    // ipuçları
    if (this.startT <= 0 && this.t < 14 && !this.finished) {
      const a = clamp((14 - this.t) / 2, 0, 1);
      ctx.globalAlpha = a;
      const kc = (x, y, s) => { ctx.lineWidth = 4; ctx.strokeStyle = OUT; ctx.beginPath(); rr(x - 26, y - 24, 52, 48, 10); ctx.fillStyle = '#fff'; ctx.fill(); ctx.stroke(); text(s, x, y + 2, 30, OUT); };
      ctx.save(); ctx.translate(475, 0);
      ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); rr(14, 84, 330, 76, 18); ctx.fill();
      kc(50, 122, '▲'); kc(108, 122, '▼');
      ctx.lineWidth = 4; ctx.strokeStyle = OUT; ctx.beginPath(); rr(156, 98, 110, 48, 10); ctx.fillStyle = '#fff'; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(176, 112); ctx.lineTo(176, 130); ctx.lineTo(246, 130); ctx.lineTo(246, 112); ctx.lineWidth = 4; ctx.stroke(); emoji('📯', 300, 122, 40);
      ctx.restore();
      ctx.globalAlpha = 1;
    }
    // trafik ışığı
    if (this.startT > 0) {
      ctx.save(); ctx.translate(640, 250);
      ctx.lineWidth = 6; ctx.strokeStyle = OUT; ctx.beginPath(); rr(-60, -150, 120, 300, 30); ctx.fillStyle = '#343a40'; ctx.fill(); ctx.stroke();
      const b = this.beeps;
      circ(0, -90, 36, b >= 0.5 && b < 3 ? '#ff4747' : '#5c2020', true);
      circ(0, 0, 36, b >= 2 && b < 3 ? '#ffd23f' : '#5c5020', true);
      circ(0, 90, 36, b >= 3 ? '#40c057' : '#1f4a28', true);
      ctx.restore();
    }
    if (this.startT <= 0 && this.startT > -0.8) {
      const k = -this.startT / 0.8;
      ctx.globalAlpha = 1 - k; text('BAŞLA!', 640, 250, 110 + k * 60, '#40c057', { stroke: '#fff', lw: 18 }); ctx.globalAlpha = 1;
    }
    this.home.draw(t);
  },
};
// başlangıç sayacı sonrası "BAŞLA" yazısının görünmesi için startT eksiye devam etsin
const _du = Drive.update;
Drive.update = function (dt) { if (this.startT <= 0 && this.startT > -1) this.startT -= dt; _du.call(this, dt); };

// ---------------- Bitiş / sonuç
const End = {
  enter() {
    this.t = 0; this.stars = Drive.stars; this.shown = 0;
    this.again = new Button({ x: 540, y: 640, r: 64, bg: '#40c057', icon: '🔁', pulse: true });
    this.garage = new Button({ x: 740, y: 640, r: 56, bg: '#4dabf7', icon: '🔧' });
    Music.play('garage');
    setTimeout(() => say('Harikaydın! Bir daha oynayalım mı?', true), 400);
    confetti(80);
  },
  update(dt) {
    this.t += dt;
    updateCarAnim(car, dt);
    if (Math.random() < 0.15) confetti(1);
    const target = Math.min(this.stars, Math.floor(this.t * 25));
    if (target > this.shown) { this.shown = target; if (this.shown % 2 === 0) Snd.tone(800 + this.shown * 8, 0.05, { type: 'triangle', vol: 0.06 }); }
    car.wheelA += dt * 3;
    if (Math.floor(this.t * 2) !== Math.floor((this.t - dt) * 2)) { car.squash = 0.4; car.hatV += 200; }
    emitTrail(car, 640, 520, 1.0, dt * 0.6, -150);
  },
  draw() {
    const t = this.t;
    drawWorld(COURSE_LEN - CARX, t);
    ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(0, 0, W, H);
    // kupa
    ctx.save(); ctx.translate(470, 160 + Math.sin(t * 3) * 6); ctx.rotate(Math.sin(t * 2) * 0.06);
    ctx.lineWidth = 6; ctx.strokeStyle = OUT;
    ctx.beginPath(); ctx.arc(-62, -40, 26, Math.PI * 0.5, Math.PI * 1.5); ctx.stroke(); ctx.beginPath(); ctx.arc(62, -40, 26, -Math.PI * 0.5, Math.PI * 0.5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-62, -80); ctx.lineTo(62, -80); ctx.quadraticCurveTo(60, 10, 0, 20); ctx.quadraticCurveTo(-60, 10, -62, -80); ctx.closePath(); ctx.fillStyle = '#ffd23f'; ctx.fill(); ctx.stroke();
    ctx.beginPath(); rr(-12, 18, 24, 30, 4); ctx.fillStyle = '#ffc400'; ctx.fill(); ctx.stroke();
    ctx.beginPath(); rr(-44, 46, 88, 24, 6); ctx.fillStyle = '#9a6a3a'; ctx.fill(); ctx.stroke();
    starPath(0, -36, 26, 12); ctx.fillStyle = '#fff6b0'; ctx.fill();
    ell(-30, -58, 8, 18, 0.3, 'rgba(255,255,255,0.6)');
    ctx.restore();
    // yıldızlar
    ctx.lineWidth = 5; ctx.strokeStyle = '#b8860b'; starPath(720, 160, 40, 18); ctx.fillStyle = '#ffd93b'; ctx.fill(); ctx.stroke();
    text('× ' + this.shown, 830, 165, 76, '#fff', { stroke: OUT, lw: 12 });
    // dans eden araba
    ell(640, 524, 160, 18, 0, 'rgba(0,0,0,0.3)');
    drawP();
    drawCar(car, 640, 530 - Math.abs(Math.sin(t * Math.PI * 2)) * 14, 0.9, { t, rot: Math.sin(t * Math.PI * 2) * 0.08 });
    this.again.draw(t); this.garage.draw(t);
  },
  click(p) {
    if (this.again.hit(p)) { this.again.press = 1; Snd.pop(); go(Drive); }
    else if (this.garage.hit(p)) { this.garage.press = 1; Snd.pop(); go(Garage); }
    else if (p.y > 300 && p.y < 580) honk(car, 640, 520, 1);
  },
  key(e) {
    if (this.t < 1.2) return;
    if (e.key === 'Enter') go(Drive);
    else if (e.key === ' ' || e.key.length === 1) honk(car, 640, 520, 1);
  },
  buttons() { return [this.again, this.garage]; },
};

// ============================================================ HUD düğmeleri (ses / tam ekran)
const muteBtn = new Button({ x: 1222, y: 44, r: 28, bg: '#495057' });
muteBtn.drawIcon = (t, r) => emoji(Snd.muted ? '🔇' : '🔊', 0, 0, r * 1.0);
const fsBtn = new Button({ x: 1160, y: 44, r: 28, bg: '#495057' });
fsBtn.drawIcon = (t, r) => { ctx.lineWidth = 5; ctx.strokeStyle = '#fff'; ctx.lineCap = 'round';
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { ctx.beginPath(); ctx.moveTo(sx * 12, sy * 4); ctx.lineTo(sx * 12, sy * 12); ctx.lineTo(sx * 4, sy * 12); ctx.stroke(); } };
function toggleFS() {
  try {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
    else document.exitFullscreen && document.exitFullscreen();
  } catch (e) { /* yok say */ }
}

// ============================================================ girdi
const keys = {};
function toLogical(e) { return { x: (e.clientX - OX) / SC, y: (e.clientY - OY) / SC }; }
addEventListener('keydown', e => {
  Snd.init();
  if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Backspace', "'", '/'].includes(e.key)) e.preventDefault();
  keys[e.key] = true;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === 'f' && scene === Title) { toggleFS(); }
  if (scene && scene.key) scene.key(e);
});
addEventListener('keyup', e => { keys[e.key] = false; });
addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
cv.addEventListener('pointerdown', e => {
  e.preventDefault();
  Snd.init(); cv.focus();
  const p = toLogical(e);
  if (muteBtn.hit(p)) { muteBtn.press = 1; Snd.setMuted(!Snd.muted); if (!Snd.muted) Snd.pop(); return; }
  if (fsBtn.hit(p)) { fsBtn.press = 1; toggleFS(); return; }
  if (scene && scene.click) scene.click(p);
});
cv.addEventListener('pointermove', e => {
  const p = toLogical(e);
  const bs = [muteBtn, fsBtn, ...(scene && scene.buttons ? scene.buttons() : [])];
  let any = false;
  for (const b of bs) { b.hover = b.hit(p); any = any || b.hover; }
  cv.style.cursor = any ? 'pointer' : 'default';
});
cv.addEventListener('contextmenu', e => e.preventDefault());

// ============================================================ döngü
let last = performance.now();
function frame(now) {
  let dt = (now - last) / 1000; last = now;
  if (dt > 0.05) dt = 0.05;
  try {
    scene.update(dt);
    updateP(dt);
    Music.update();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#2b2140'; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.setTransform(DPR * SC, 0, 0, DPR * SC, DPR * OX, DPR * OY);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
    scene.draw();
    muteBtn.draw(scene.t || 0); fsBtn.draw(scene.t || 0);
    ctx.restore();
  } catch (err) {
    console.error(err);
  }
  requestAnimationFrame(frame);
}
go(Title);
requestAnimationFrame(frame);

// test / hata ayıklama için
window.__game = { get scene() { return scene; }, Title, Garage, Drive, End, car, go, P: () => P };
