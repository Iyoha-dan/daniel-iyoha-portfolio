// Bug blaster: a small retro shooter drawn on a 240×320 canvas and scaled up with crisp pixels.
// The bugs are kinds of software bug: typos wobble, layout bugs drift out of line and bounce,
// 404s blink in and out (and can't be hit while gone), and every fifth sprint ends with the
// Flaky Test boss, which is only sometimes there. A bug that reaches the bottom ships to
// production and costs a life. Sprint 1 is a gentle line of typos straight down the middle.
//
// One engine runs both screens: the mini player (demo mode, the ship plays itself) and the
// full-size game in the dialog.

export const W = 240;
export const H = 320;

/* ---------- Palette and sprites (original pixel art) ---------- */

const PAL: Record<string, string> = {
  g: '#5fd09a', // site green
  G: '#2b8a5e',
  w: '#e9e8e1',
  d: '#7d7b72',
  k: '#151513',
  r: '#ff6b5b',
  R: '#b3261e',
  y: '#f5c84c',
  Y: '#c9971f',
  b: '#6ea8ff',
  B: '#3b6fd1',
  p: '#c084fc',
  P: '#8b4fd6',
  o: '#ff9f43',
};

type Art = string[];
const ART: Record<string, Art[]> = {
  ship: [
    [
      '......w......',
      '.....www.....',
      '.....wgw.....',
      '....wgggw....',
      '....wgkgw....',
      '...wggkggw...',
      '..wgggggggw..',
      '.wggGgggGggw.',
      'wggGG.g.GGggw',
      'wgGG..g..GGgw',
      '.w....o....w.',
      '......y......',
    ],
    [
      '......w......',
      '.....www.....',
      '.....wgw.....',
      '....wgggw....',
      '....wgkgw....',
      '...wggkggw...',
      '..wgggggggw..',
      '.wggGgggGggw.',
      'wggGG.g.GGggw',
      'wgGG..g..GGgw',
      '.w....y....w.',
      '......o......',
    ],
  ],
  typo: [
    [
      '..d.....d..',
      '...d...d...',
      '...yyyyy...',
      'd.yywyywy.d',
      '.dyykyykyd.',
      '..yyyyyyy..',
      'd.yYyyyYy.d',
      '...yYYYy...',
      '..d.....d..',
    ],
    [
      '..d.....d..',
      '...d...d...',
      '...yyyyy...',
      '..yywyywy..',
      'ddyykyykydd',
      '..yyyyyyy..',
      '..yYyyyYy..',
      'd..yYYYy..d',
      '.d.......d.',
    ],
  ],
  layout: [
    [
      '.b.......b.',
      '..b.....b..',
      '.bbbbbbbbb.',
      '.bwkbbbwkb.',
      '.bbbbbbbbb.',
      'bBb.bbb.bBb',
      '.bbbbbbbbb.',
      '..b..b..b..',
      '.b...b...b.',
    ],
    [
      '.b.......b.',
      '..b.....b..',
      '.bbbbbbbbb.',
      '.bkwbbbkwb.',
      '.bbbbbbbbb.',
      '.Bb.bbb.bB.',
      'bbbbbbbbbbb',
      '.b...b...b.',
      '..b..b..b..',
    ],
  ],
  e404: [
    [
      '...ppppp...',
      '..ppppppp..',
      '.ppwkpwkpp.',
      '.ppppppppp.',
      '.pPpPpPpPp.',
      '.ppppppppp.',
      '.pp.ppp.pp.',
      '.p...p...p.',
    ],
    [
      '...ppppp...',
      '..ppppppp..',
      '.ppkwpkwpp.',
      '.ppppppppp.',
      '.ppPpPpPpp.',
      '.ppppppppp.',
      '..pp.p.pp..',
      '.p..p.p..p.',
    ],
  ],
  boss: [
    [
      '....d.................d....',
      '.....d...............d.....',
      '......d.............d......',
      '.......rrrrrrrrrrrrr.......',
      '.....rrrrrrrrrrrrrrrrr.....',
      '....rrrwwwrrrrrrrwwwrrr....',
      '...rrrrwkwrrrrrrrwkwrrrr...',
      '..rrrrrrrrrrrRrrrrrrrrrrr..',
      'd.rrRRrrrrrrRRRrrrrrrRRrr.d',
      '.drrRRrrrrrrrrrrrrrrrRRrrd.',
      '..rrrrrrrRRRRRRRRRrrrrrrr..',
      'd.rrrrrrRwwwwwwwwwRrrrrrr.d',
      '.drrrrrrRRRRRRRRRRRrrrrrd..',
      '...rrrrrrrrrrrrrrrrrrrr....',
      '..d.rrrrrrrrrrrrrrrrrr.d...',
      '.d....rrrrrrrrrrrrrr....d..',
      'd.......rrr.....rrr.......d',
    ],
    [
      '....d.................d....',
      '....d.................d....',
      '.....d...............d.....',
      '.......rrrrrrrrrrrrr.......',
      '.....rrrrrrrrrrrrrrrrr.....',
      '....rrrwwwrrrrrrrwwwrrr....',
      '...rrrrwwkrrrrrrrwwkrrrr...',
      '..rrrrrrrrrrrRrrrrrrrrrrr..',
      '.drrRRrrrrrrRRRrrrrrrRRrrd.',
      'd.rrRRrrrrrrrrrrrrrrrRRrr.d',
      '..rrrrrrrRRRRRRRRRrrrrrrr..',
      '.drrrrrrRwwwwwwwwwRrrrrrd..',
      'd.rrrrrrRRRRRRRRRRRrrrrr.d.',
      '...rrrrrrrrrrrrrrrrrrrr....',
      '.d..rrrrrrrrrrrrrrrrrr..d..',
      'd.....rrrrrrrrrrrrrr.....d.',
      '.......rrr.......rrr.......',
    ],
  ],
  power: [
    ['.ggg.', 'gwgwg', 'ggwgg', 'gwgwg', '.ggg.'],
    ['.GGG.', 'GwGwG', 'GGwGG', 'GwGwG', '.GGG.'],
  ],
  life: [['..g..', '.ggg.', 'ggggg', 'g.g.g']],
};

type Sprite = { w: number; h: number; frames: HTMLCanvasElement[]; flash: HTMLCanvasElement[] };

const bake = (rows: Art, solid?: string): HTMLCanvasElement => {
  const c = document.createElement('canvas');
  c.width = rows[0].length;
  c.height = rows.length;
  const x = c.getContext('2d')!;
  rows.forEach((row, j) =>
    [...row].forEach((ch, i) => {
      if (ch === '.') return;
      x.fillStyle = solid ?? PAL[ch];
      x.fillRect(i, j, 1, 1);
    }),
  );
  return c;
};

let sprites: Record<string, Sprite> | null = null;
const getSprites = () => {
  if (!sprites) {
    sprites = {};
    for (const [name, frames] of Object.entries(ART)) {
      sprites[name] = {
        w: frames[0][0].length,
        h: frames[0].length,
        frames: frames.map((f) => bake(f)),
        flash: frames.map((f) => bake(f, '#ffffff')),
      };
    }
  }
  return sprites;
};

/* ---------- 3×5 pixel font ---------- */

// Each glyph is 5 rows of 3 pixels.
const GLYPHS: Record<string, string> = {
  'A': '.#. #.# ### #.# #.#',
  'B': '##. #.# ##. #.# ##.',
  'C': '.## #.. #.. #.. .##',
  'D': '##. #.# #.# #.# ##.',
  'E': '### #.. ##. #.. ###',
  'F': '### #.. ##. #.. #..',
  'G': '.## #.. #.# #.# .##',
  'H': '#.# #.# ### #.# #.#',
  'I': '### .#. .#. .#. ###',
  'J': '..# ..# ..# #.# .#.',
  'K': '#.# #.# ##. #.# #.#',
  'L': '#.. #.. #.. #.. ###',
  'M': '#.# ### ### #.# #.#',
  'N': '##. #.# #.# #.# #.#',
  'O': '.#. #.# #.# #.# .#.',
  'P': '##. #.# ##. #.. #..',
  'Q': '.#. #.# #.# ##. .##',
  'R': '##. #.# ##. #.# #.#',
  'S': '.## #.. .#. ..# ##.',
  'T': '### .#. .#. .#. .#.',
  'U': '#.# #.# #.# #.# ###',
  'V': '#.# #.# #.# #.# .#.',
  'W': '#.# #.# ### ### #.#',
  'X': '#.# #.# .#. #.# #.#',
  'Y': '#.# #.# .#. .#. .#.',
  'Z': '### ..# .#. #.. ###',
  '0': '### #.# #.# #.# ###',
  '1': '.#. ##. .#. .#. ###',
  '2': '##. ..# .#. #.. ###',
  '3': '##. ..# .#. ..# ##.',
  '4': '#.# #.# ### ..# ..#',
  '5': '### #.. ##. ..# ##.',
  '6': '.## #.. ### #.# ###',
  '7': '### ..# .#. .#. .#.',
  '8': '### #.# ### #.# ###',
  '9': '### #.# ### ..# ##.',
  ':': '... .#. ... .#. ...',
  '.': '... ... ... ... .#.',
  '!': '.#. .#. .#. ... .#.',
  '-': '... ... ### ... ...',
  '/': '..# ..# .#. #.. #..',
  "'": '.#. .#. ... ... ...',
  '?': '##. ..# .#. ... .#.',
  '>': '#.. .#. ..# .#. #..',
  '+': '... .#. ### .#. ...',
  ' ': '... ... ... ... ...',
};
const FONT: Record<string, string> = Object.fromEntries(Object.entries(GLYPHS).map(([k, v]) => [k, v.replaceAll(' ', '')]));

const text = (ctx: CanvasRenderingContext2D, str: string, x: number, y: number, color: string, scale = 1, align: 'left' | 'center' | 'right' = 'left') => {
  const s = str.toUpperCase();
  const width = (s.length * 4 - 1) * scale;
  let cx = align === 'center' ? Math.round(x - width / 2) : align === 'right' ? x - width : x;
  ctx.fillStyle = color;
  for (const ch of s) {
    const g = FONT[ch] ?? FONT['?'];
    for (let i = 0; i < 15; i++) if (g[i] === '#') ctx.fillRect(cx + (i % 3) * scale, y + Math.floor(i / 3) * scale, scale, scale);
    cx += 4 * scale;
  }
};

/* ---------- Sound (off unless the player turns it on) ---------- */

let audio: AudioContext | null = null;
export const sound = { on: false };
const beep = (freq: number, dur: number, type: OscillatorType = 'square', vol = 0.04, slideTo?: number) => {
  if (!sound.on) return;
  audio ??= new AudioContext();
  const t = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(audio.destination);
  osc.start(t);
  osc.stop(t + dur);
};
const sfx = {
  shoot: () => beep(880, 0.06, 'square', 0.025, 440),
  hit: () => beep(300, 0.05, 'square', 0.03, 180),
  pop: () => beep(160, 0.18, 'sawtooth', 0.04, 50),
  power: () => [523, 659, 784].forEach((f, i) => setTimeout(() => beep(f, 0.08, 'square', 0.03), i * 70)),
  hurt: () => beep(220, 0.35, 'sawtooth', 0.05, 60),
};

/* ---------- The game ---------- */

type Kind = 'typo' | 'layout' | 'e404' | 'boss';
type Bug = { kind: Kind; x: number; y: number; vx: number; vy: number; baseX: number; t: number; hp: number; flash: number; fire: number; entered: boolean };
type Shot = { x: number; y: number; vx: number; vy: number; enemy: boolean };
type Bit = { x: number; y: number; vx: number; vy: number; life: number; color: string };
type Note = { x: number; y: number; text: string; life: number; color: string };
export type State = 'attract' | 'ready' | 'play' | 'paused' | 'over';

const POINTS: Record<Kind, number> = { typo: 10, layout: 15, e404: 20, boss: 250 };
const NAMES: Record<Kind, string> = { typo: 'TYPO', layout: 'LAYOUT BUG', e404: '404', boss: 'FLAKY TEST' };

export class BugBlaster {
  ctx: CanvasRenderingContext2D;
  demo: boolean;
  state: State;
  onChange: (g: BugBlaster) => void = () => {};
  onGameOver: (score: number, best: number) => void = () => {};

  // Player
  px = W / 2;
  py = H - 34;
  lives = 3;
  hurt = 0;
  cool = 0;
  spread = 0;
  // Run
  score = 0;
  best = 0;
  sprint = 1;
  queue: Kind[] = [];
  spawnIn = 0;
  banner = 0;
  bannerText = '';
  bugs: Bug[] = [];
  shots: Shot[] = [];
  bits: Bit[] = [];
  notes: Note[] = [];
  powers: { x: number; y: number; t: number }[] = [];
  stars = Array.from({ length: 60 }, (_, i) => ({ x: Math.random() * W, y: Math.random() * H, z: (i % 3) + 1 }));
  clock = 0;
  // Input
  keys = new Set<string>();
  pointer: { x: number; y: number } | null = null;

  private raf = 0;
  private last = 0;
  private acc = 0;

  constructor(canvas: HTMLCanvasElement, opts: { demo?: boolean } = {}) {
    canvas.width = W;
    canvas.height = H;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = false;
    this.demo = !!opts.demo;
    this.state = this.demo ? 'attract' : 'ready';
    try {
      this.best = Number(localStorage.getItem('bug-blaster-best')) || 0;
    } catch {}
    if (this.demo) {
      this.newRun();
      this.sprint = 2;
      this.startSprint();
    }
  }

  /* Run control */
  newRun() {
    this.px = W / 2;
    this.lives = 3;
    this.hurt = 0;
    this.spread = 0;
    this.score = 0;
    this.sprint = 1;
    this.bugs = [];
    this.shots = [];
    this.powers = [];
    this.notes = [];
    this.startSprint();
  }
  start() {
    if (this.state === 'ready' || this.state === 'over') {
      this.newRun();
      this.state = 'play';
      this.onChange(this);
    } else if (this.state === 'paused') {
      this.state = 'play';
      this.onChange(this);
    }
  }
  pause() {
    if (this.state === 'play') {
      this.state = 'paused';
      this.keys.clear();
      this.pointer = null;
      this.onChange(this);
    }
  }

  private startSprint() {
    const n = this.sprint;
    const q: Kind[] = [];
    if (n === 1) q.push('typo', 'typo', 'typo', 'typo', 'typo');
    else if (n % 5 === 0) q.push('boss', 'typo', 'typo', 'typo');
    else {
      const count = Math.min(6 + n * 2, 22);
      for (let i = 0; i < count; i++) {
        const r = Math.random();
        q.push(n >= 3 && r < 0.25 ? 'e404' : n >= 2 && r < 0.6 ? 'layout' : 'typo');
      }
    }
    this.queue = q;
    this.spawnIn = 1.2;
    this.banner = 1.6;
    this.bannerText = n % 5 === 0 ? 'RELEASE DAY' : `SPRINT ${n}`;
  }

  private spawn(kind: Kind) {
    const n = this.sprint;
    const tutorial = n === 1;
    const x = tutorial ? W / 2 : 16 + Math.random() * (W - 32);
    const bug: Bug = { kind, x, y: -12, vx: 0, vy: 0, baseX: x, t: Math.random() * 6, hp: 1, flash: 0, fire: 1.5 + Math.random() * 2, entered: false };
    if (kind === 'typo') bug.vy = tutorial ? 20 : 22 + n * 3;
    if (kind === 'layout') {
      bug.vy = 16 + n * 2;
      bug.vx = (Math.random() < 0.5 ? -1 : 1) * (35 + n * 3);
    }
    if (kind === 'e404') bug.vy = 20 + n * 2;
    if (kind === 'boss') {
      bug.x = bug.baseX = W / 2;
      bug.y = -20;
      bug.vy = 30;
      bug.vx = 40;
      bug.hp = 24 + n * 3;
    }
    if (kind === 'layout' || kind === 'e404') bug.hp = 2;
    this.bugs.push(bug);
  }

  /* Loop */
  run() {
    cancelAnimationFrame(this.raf);
    this.last = performance.now();
    const frame = (now: number) => {
      this.acc += Math.min((now - this.last) / 1000, 0.1);
      this.last = now;
      while (this.acc >= 1 / 60) {
        this.update(1 / 60);
        this.acc -= 1 / 60;
      }
      this.draw();
      this.raf = requestAnimationFrame(frame);
    };
    this.raf = requestAnimationFrame(frame);
  }
  stop() {
    cancelAnimationFrame(this.raf);
  }

  /* Update */
  update(dt: number) {
    this.clock += dt;
    for (const s of this.stars) {
      s.y += s.z * 12 * dt;
      if (s.y > H) {
        s.y = 0;
        s.x = Math.random() * W;
      }
    }
    this.bits = this.bits.filter((b) => ((b.x += b.vx * dt), (b.y += b.vy * dt), (b.life -= dt) > 0));
    this.notes = this.notes.filter((n) => ((n.y -= 14 * dt), (n.life -= dt) > 0));
    if (this.state !== 'play' && this.state !== 'attract') return;

    const playing = this.state === 'play';
    this.banner = Math.max(0, this.banner - dt);
    this.hurt = Math.max(0, this.hurt - dt);
    this.spread = Math.max(0, this.spread - dt);
    this.cool -= dt;

    // Move the ship: keys, a finger/mouse drag, or the demo pilot.
    let dx = 0;
    let dy = 0;
    let firing = false;
    if (playing) {
      if (this.keys.has('left')) dx -= 1;
      if (this.keys.has('right')) dx += 1;
      if (this.keys.has('up')) dy -= 1;
      if (this.keys.has('down')) dy += 1;
      firing = this.keys.has('fire') || !!this.pointer;
      if (this.pointer) {
        const tx = this.pointer.x;
        const ty = this.pointer.y - 28; // keep the ship above the finger
        this.px += Math.max(-1, Math.min(1, (tx - this.px) / 6)) * 150 * dt;
        this.py += Math.max(-1, Math.min(1, (ty - this.py) / 6)) * 150 * dt;
      }
    } else {
      const target = this.bugs.filter((b) => b.y > 0 && b.y < H - 80).sort((a, b) => b.y - a.y)[0];
      if (target) dx = Math.abs(target.x - this.px) > 3 ? Math.sign(target.x - this.px) : 0;
      firing = !!target && Math.abs(target.x - this.px) < 10;
    }
    this.px = Math.max(8, Math.min(W - 8, this.px + dx * 120 * dt));
    this.py = Math.max(H * 0.45, Math.min(H - 12, this.py + dy * 110 * dt));

    if (firing && this.cool <= 0) {
      this.cool = this.demo ? 0.28 : 0.17;
      this.shots.push({ x: this.px, y: this.py - 8, vx: 0, vy: -230, enemy: false });
      if (this.spread > 0) {
        this.shots.push({ x: this.px - 3, y: this.py - 6, vx: -55, vy: -220, enemy: false });
        this.shots.push({ x: this.px + 3, y: this.py - 6, vx: 55, vy: -220, enemy: false });
      }
      if (playing) sfx.shoot();
    }

    // Spawn the sprint's bugs, one after another.
    if (this.banner < 0.6 && this.queue.length) {
      this.spawnIn -= dt;
      if (this.spawnIn <= 0) {
        this.spawn(this.queue.shift()!);
        this.spawnIn = this.sprint === 1 ? 1.1 : Math.max(0.28, 0.75 - this.sprint * 0.04);
      }
    }

    // Bugs
    for (const b of this.bugs) {
      b.t += dt;
      b.flash = Math.max(0, b.flash - dt);
      if (b.kind === 'typo') {
        b.y += b.vy * dt;
        b.x = b.baseX + Math.sin(b.t * 3) * (this.sprint === 1 ? 5 : 14);
      } else if (b.kind === 'layout') {
        b.y += b.vy * dt;
        b.x += b.vx * dt;
        if (b.x < 8 || b.x > W - 8) b.vx *= -1;
      } else if (b.kind === 'e404') {
        b.y += b.vy * dt;
        b.x = b.baseX + Math.sin(b.t * 2) * 8;
        // Gone for a moment every 1.8s; reappears somewhere nearby.
        const gone = b.t % 1.8 > 1.2;
        if (gone && !b.entered) {
          b.entered = true;
          b.baseX = Math.max(14, Math.min(W - 14, b.baseX + (Math.random() - 0.5) * 60));
        }
        if (!gone) b.entered = false;
      } else {
        if (b.y < 64) b.y += b.vy * dt;
        b.x += b.vx * dt;
        if (b.x < 20 || b.x > W - 20) b.vx *= -1;
      }
      // Bugs shoot back from sprint 2.
      if (this.sprint > 1 && b.y > 10 && b.y < H - 60 && !this.isGone(b)) {
        b.fire -= dt;
        if (b.fire <= 0) {
          const boss = b.kind === 'boss';
          b.fire = boss ? 0.9 : Math.max(1.2, 4.5 - this.sprint * 0.25) + Math.random() * 2;
          const speeds = boss ? [-45, 0, 45] : [0];
          for (const vx of speeds) this.shots.push({ x: b.x, y: b.y + 8, vx, vy: boss ? 95 : 85 + this.sprint * 3, enemy: true });
        }
      }
    }

    // Shots
    for (const s of this.shots) {
      s.x += s.vx * dt;
      s.y += s.vy * dt;
    }
    this.shots = this.shots.filter((s) => s.y > -10 && s.y < H + 10 && s.x > -10 && s.x < W + 10);

    const sp = getSprites();
    for (const s of this.shots) {
      if (s.enemy) continue;
      for (const b of this.bugs) {
        if (b.hp <= 0 || this.isGone(b)) continue;
        const spr = sp[b.kind];
        if (Math.abs(s.x - b.x) < spr.w / 2 + 1 && Math.abs(s.y - b.y) < spr.h / 2 + 2) {
          s.y = -100;
          b.hp -= 1;
          b.flash = 0.08;
          if (b.hp <= 0) this.squash(b);
          else if (playing) sfx.hit();
          break;
        }
      }
    }

    // Power-ups (wider shot for a while)
    for (const p of this.powers) {
      p.y += 40 * dt;
      p.t += dt;
      if (Math.abs(p.x - this.px) < 9 && Math.abs(p.y - this.py) < 9) {
        p.y = H + 50;
        this.spread = 8;
        this.note(this.px, this.py - 14, 'WIDE SHOT', PAL.g);
        if (playing) sfx.power();
      }
    }
    this.powers = this.powers.filter((p) => p.y < H + 10);

    // Getting hit, and bugs slipping through
    if (playing && this.hurt <= 0) {
      const hitShot = this.shots.find((s) => s.enemy && Math.abs(s.x - this.px) < 5 && Math.abs(s.y - this.py) < 6);
      const hitBug = this.bugs.find((b) => b.hp > 0 && !this.isGone(b) && Math.abs(b.x - this.px) < sp[b.kind].w / 2 + 3 && Math.abs(b.y - this.py) < sp[b.kind].h / 2 + 3);
      if (hitShot || hitBug) {
        if (hitShot) hitShot.y = H + 100;
        if (hitBug && hitBug.kind !== 'boss') this.squash(hitBug, false);
        this.loseLife('HIT!');
      }
    }
    for (const b of this.bugs) {
      if (b.hp > 0 && b.y > H + 8) {
        b.hp = 0;
        if (playing) this.loseLife('SHIPPED TO PROD!');
      }
    }
    this.bugs = this.bugs.filter((b) => b.hp > 0);

    // Sprint cleared
    if (this.state !== 'over' && !this.queue.length && !this.bugs.length && this.banner <= 0) {
      if (playing && this.sprint >= 1) this.note(W / 2, H / 2 + 12, `SPRINT ${this.sprint} CLEAR`, PAL.g);
      this.sprint += 1;
      if (this.demo && this.sprint > 4) this.sprint = 2;
      this.startSprint();
      this.onChange(this);
    }
  }

  private isGone(b: Bug) {
    if (b.kind === 'e404') return b.t % 1.8 > 1.2;
    if (b.kind === 'boss') return b.y >= 64 && b.t % 3.2 > 2.3; // flaky: sometimes not there
    return false;
  }

  private squash(b: Bug, scored = true) {
    b.hp = 0;
    const colors = { typo: PAL.y, layout: PAL.b, e404: PAL.p, boss: PAL.r }[b.kind];
    const n = b.kind === 'boss' ? 60 : 14;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 20 + Math.random() * (b.kind === 'boss' ? 90 : 60);
      this.bits.push({ x: b.x, y: b.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.3 + Math.random() * 0.4, color: Math.random() < 0.3 ? PAL.w : colors });
    }
    if (!scored) return;
    if (this.state === 'play') {
      this.score += POINTS[b.kind];
      this.note(b.x, b.y - 8, b.kind === 'boss' ? 'FLAKY TEST FIXED +250' : `+${POINTS[b.kind]}`, PAL.w);
      sfx.pop();
      this.onChange(this);
    }
    if (Math.random() < (b.kind === 'boss' ? 1 : 0.07)) this.powers.push({ x: b.x, y: b.y, t: 0 });
  }

  private loseLife(why: string) {
    this.lives -= 1;
    this.hurt = 1.6;
    this.note(W / 2, H - 70, why, PAL.r);
    sfx.hurt();
    for (let i = 0; i < 20; i++) {
      const a = Math.random() * Math.PI * 2;
      this.bits.push({ x: this.px, y: this.py, vx: Math.cos(a) * 50, vy: Math.sin(a) * 50, life: 0.5, color: PAL.g });
    }
    if (this.lives <= 0) {
      this.state = 'over';
      if (this.score > this.best) {
        this.best = this.score;
        try {
          localStorage.setItem('bug-blaster-best', String(this.best));
        } catch {}
      }
      this.onGameOver(this.score, this.best);
    }
    this.onChange(this);
  }

  private note(x: number, y: number, t: string, color: string) {
    this.notes.push({ x, y, text: t, life: 0.9, color });
  }

  /* Draw */
  draw() {
    const c = this.ctx;
    const sp = getSprites();
    c.fillStyle = '#0b0b0a';
    c.fillRect(0, 0, W, H);
    for (const s of this.stars) {
      c.fillStyle = s.z === 3 ? '#e9e8e1' : s.z === 2 ? '#7d7b72' : '#3a3934';
      c.fillRect(Math.round(s.x), Math.round(s.y), 1, s.z === 3 ? 2 : 1);
    }
    const frame = Math.floor(this.clock * 4) % 2;
    const put = (name: string, x: number, y: number, flash = false, f = frame) => {
      const s = sp[name];
      c.drawImage((flash ? s.flash : s.frames)[f % s.frames.length], Math.round(x - s.w / 2), Math.round(y - s.h / 2));
    };

    for (const p of this.powers) put('power', p.x, p.y, false, Math.floor(p.t * 6));
    for (const b of this.bugs) {
      const gone = this.isGone(b);
      if (gone) {
        // Barely there: a dotted outline, can't be hit.
        if (Math.floor(this.clock * 20) % 3 === 0) continue;
        c.globalAlpha = 0.25;
      }
      put(b.kind, b.x, b.y, b.flash > 0);
      c.globalAlpha = 1;
    }
    for (const s of this.shots) {
      c.fillStyle = s.enemy ? PAL.r : PAL.g;
      if (s.enemy) c.fillRect(Math.round(s.x) - 1, Math.round(s.y) - 1, 2, 3);
      else c.fillRect(Math.round(s.x) - 1, Math.round(s.y) - 3, 2, 5);
    }
    if (this.state !== 'over' && !(this.hurt > 0 && Math.floor(this.clock * 12) % 2)) put('ship', this.px, this.py);
    for (const b of this.bits) {
      c.fillStyle = b.color;
      c.fillRect(Math.round(b.x), Math.round(b.y), 1, 1);
    }
    for (const n of this.notes) text(c, n.text, Math.round(n.x), Math.round(n.y), n.color, 1, 'center');

    const blink = Math.floor(this.clock * 2) % 2 === 0;
    if (this.state === 'attract') return; // the mini player shows its own title and Play button

    // HUD
    if (this.state !== 'ready') {
      text(c, `SCORE ${String(this.score).padStart(4, '0')}`, 6, 6, PAL.w);
      text(c, this.sprint % 5 === 0 ? 'RELEASE DAY' : `SPRINT ${this.sprint}`, W / 2, 6, PAL.d, 1, 'center');
      for (let i = 0; i < this.lives; i++) c.drawImage(sp.life.frames[0], W - 10 - i * 8, 6);
      if (this.spread > 0) text(c, 'WIDE', W - 6, 16, PAL.g, 1, 'right');
    }
    if (this.banner > 0 && this.state === 'play') {
      text(c, this.bannerText, W / 2, H / 2 - 30, this.sprint % 5 === 0 ? PAL.r : PAL.g, 2, 'center');
      if (this.sprint === 1) text(c, "DON'T LET BUGS REACH PRODUCTION", W / 2, H / 2 - 12, PAL.d, 1, 'center');
      if (this.sprint % 5 === 0) text(c, 'BOSS: FLAKY TEST', W / 2, H / 2 - 12, PAL.d, 1, 'center');
    }

    if (this.state === 'ready') {
      text(c, 'BUG', W / 2, 46, PAL.g, 4, 'center');
      text(c, 'BLASTER', W / 2, 72, PAL.g, 4, 'center');
      text(c, 'SHOOT THE BUGS', W / 2, 112, PAL.w, 1, 'center');
      text(c, 'BEFORE THEY SHIP', W / 2, 120, PAL.w, 1, 'center');
      const legend: [string, Kind][] = [['typo', 'typo'], ['layout', 'layout'], ['e404', 'e404']];
      legend.forEach(([name, kind], i) => {
        put(name, 78, 146 + i * 16);
        text(c, `${NAMES[kind]}  ${POINTS[kind]}`, 92, 144 + i * 16, PAL.d);
      });
      text(c, 'ARROWS/WASD MOVE  SPACE FIRE', W / 2, 206, PAL.d, 1, 'center');
      text(c, 'ON A PHONE: DRAG TO MOVE', W / 2, 216, PAL.d, 1, 'center');
      if (blink) text(c, 'PRESS SPACE OR TAP', W / 2, 246, PAL.w, 2, 'center');
      if (this.best) text(c, `BEST ${this.best}`, W / 2, 272, PAL.g, 1, 'center');
    }
    if (this.state === 'paused') {
      c.fillStyle = 'rgb(11 11 10 / 0.7)';
      c.fillRect(0, 0, W, H);
      text(c, 'PAUSED', W / 2, H / 2 - 20, PAL.w, 3, 'center');
      if (blink) text(c, 'SPACE OR TAP TO GO ON', W / 2, H / 2 + 6, PAL.d, 1, 'center');
    }
    if (this.state === 'over') {
      c.fillStyle = 'rgb(11 11 10 / 0.75)';
      c.fillRect(0, 0, W, H);
      text(c, 'GAME OVER', W / 2, 92, PAL.r, 3, 'center');
      text(c, 'BUGS SQUASHED FOR', W / 2, 130, PAL.d, 1, 'center');
      text(c, String(this.score), W / 2, 142, PAL.w, 3, 'center');
      text(c, `BEST ${this.best}`, W / 2, 170, PAL.g, 1, 'center');
      text(c, `REACHED ${this.sprint % 5 === 0 ? 'RELEASE DAY' : `SPRINT ${this.sprint}`}`, W / 2, 180, PAL.d, 1, 'center');
      if (blink) text(c, 'SPACE OR TAP TO RETRY', W / 2, 220, PAL.w, 1, 'center');
      text(c, 'ESC TO CLOSE', W / 2, 232, PAL.d, 1, 'center');
    }
  }
}
