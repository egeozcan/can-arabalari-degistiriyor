# Oto Yıkama ve Bakım Atölyesi

> A hands-on CarWash scene chosen from the End screen: the child scrubs off the car's real race mud with a finger to find a hidden surprise sticker, then rinses, dries and polishes it, with gags at every step.

## Evaluation history

| Round | Consistency | Design | Entertainment | Avg |
|---|---|---|---|---|
| 1 | 7.5 | 7.5 | 8.5 | 7.83 |
| 2 | 7.5 | 7.5 | 7.5 | 7.50 |

**Status:** not chosen — best avg 7.83 (target was 8.5; "Yolcu Partisi v2" reached it first and was implemented instead).

_Note: the plan below is the latest revision written after the last scored round; that revision was not scored again before the selection was made._

---

# Direction 4: Oto Yıkama ve Bakım Atölyesi (car wash and care workshop)

Plan v3. This adds one new scene, `CarWash`. The child **chooses** to enter it from the End screen with a big 🫧 button. Inside, the car they just raced is covered in its real race mud, and they scrub it clean with a finger. Hidden treasure waits under the mud. Then they rinse and dry it, and it ends with a drink that makes the car burp. It is a tactile care toy with no rules.

### What changed from v2 (short)
- **Mud is drawn above the windows and details.** `drawCar` gets a second body clip after `B.details()` and before `drawFace()`. Road mud, stickers and the wash mask are drawn there, so mud on a window is visible and can be scrubbed. The face is always drawn on top, so mood reactions are never hidden. The coverage grid only counts cells the child can actually see. Face, hat and wheel cells are excluded, and the surprise and stickers are never placed on them.
- **One voice queue for every scripted line.** Tool names, auto-advance announcements, step completions, the surprise and the drink reactions all go through `qsay()`. A queued line starts only when `Voice.idle()` says the current line has really finished (a new ~10-line busy estimate in `Voice`). Fixed time slots are gone. Chatter waits until the queue is empty. ✅ no longer speaks. End speaks the thank-you and waits for the voice to be idle first.
- **A real laugh is now core.** The ⛽ drink pump with 🧃 (a big burp, orange exhaust bubbles, and every third time a mega-burp that blows the hat off) and 🥛 (a moo and a milk mustache) is core. It is also the finale the car asks for: "Çok susadım!".
- **Stickers are protected and persistent.** 🎲 no longer touches them. They are saved in `cade-yikama`. A 12-slot **treasure shelf** on the bay wall shows every surprise ever found. When the car is full (6 stickers), the oldest one peels off and flies onto its shelf slot. It is visibly kept, never deleted.
- **Scope cut.** The cloth (✨ Parlak) moves to stretch, so the core has 3 care steps plus the drink. The must-ship cut is Checkpoint 2: sponge, surprise and hose. The full core is ≈ 830 lines (§9).
- Smaller fixes:
  - The mud field is a true road-wide event that ignores lanes.
  - End's count-up formula is stated (`from + floor(t*25)`).
  - `ykCarMatrix` includes squash.
  - The fan auto-aims at the car and blows in a cone, so what is drawn matches the wind.
  - The hose hangs from a ceiling reel and no longer collides with the tool column.
  - Only Esc leaves the wash from the keyboard.
  - The End invitation rotates 3 phrasings and plays only every other muddy race.
  - The mask is now full resolution.

---

## 1. Vision: why a 4-year-old will love it

Four-year-olds love caretaking play: bathing a doll, feeding a pet, putting a plaster on a teddy. They also love fast cause and effect, like rubbing something dirty until it is clean.

Today the game collects mud during the race (`car.mud`), wipes it at the 92% wash span, and throws it away. In this direction the mud pays off. The car finishes the race dirty and dances muddy on the trophy screen, and sometimes it asks: **"Çok çamurlandım! Beni yıkar mısın?"**. Tap 🫧 and the child washes their own car with a finger.

What makes it fun:
- **Rubbing reveals.** Every stroke uncovers the car's real color right away, like a scratch card. That includes the windows.
- **Treasure under the mud.** Every wash hides one surprise picture (🦄, 🦖, 👑, …) under the thickest mud, with a twinkle hinting where it is. Scrubbing it free makes it pop and stick onto the car as a sticker. The car keeps the sticker in the next race and after a reload. Each new surprise also lights up a slot on the treasure shelf. "Which one is next?" is the reason to come back, and 12 to collect is a goal a parent can talk about.
- **Foam is a toy in itself.** The sponge leaves wobbling bubbles, and the hose pops them in squeaky chains. The foam color changes each visit (white, pink, blue, rainbow).
- **The car is alive.** It giggles when the sponge tickles its face, squints and shivers under the spray, puffs its cheeks in the wind, and loses its hat to the fan.
- **A big laugh at the end.** The clean car is thirsty. Juice makes it burp loudly with orange bubbles from the exhaust, and sometimes the burp is so big the hat flies off. Milk makes it moo and leaves a milk mustache.
- **It never forces anything.** The wash is a choice on End. Inside, ✅ is always there, and the steps are a suggested path, not a requirement.

Core rules are kept: no losing, no timer, huge targets, instant sound, particle and face feedback for every input, and nothing to read.

---

## 2. Moment-to-moment player experience

### 2.1 End screen: the invitation
1. The race ends as today (finish line, fanfare, `go(End)` after 3.2 s). A **mud field** across the whole road at 90% of the course (§3.1) means the car always arrives at End visibly muddy, even during a lane change or a jump.
2. End is as today (trophy, star count-up, confetti, the dancing car, now muddy), with one extra big button: **🫧 (340, 640, r 60)**. It is cyan and, while `car.mud.length > 0`, it pulses with small bubbles rising from it. Brown drips fall off the dancing car every 0.7 s.
3. End's opening line ("Harikaydın! Bir daha oynayalım mı?") is now spoken from `update()` once `t > 0.4` and the voice is idle (at most a 2 s wait). On **every other** muddy End visit (the 1st, 3rd, …), once that line has finished and `t > 2.4`: `say(pick(['Çok çamurlandım! Beni yıkar mısın?', 'Iyy, çamurlu oldum!', 'Köpük yapalım mı?']), true)`, plus a bouncing 👇 over 🫧 for 3 s. On the other visits only the button pulses. The voice does not nag.
4. 🔁 and 🔧 are unchanged. A child who just wants to race again taps 🔁 as before. Nothing in the replay loop got longer.

### 2.2 Arrival in the wash bay (about 2 s; a tap or key skips it)
- The bay is bright, with aqua tiles. There is a ceiling hose reel at (300, 30), a drain, a puddle by the entrance, and the **treasure shelf** (a wooden strip with 12 slots at y 118). Found surprises sit on the shelf, and empty slots are faint bubbles. The wash music starts.
- The car rolls in from the left with its wheels turning and parks at (640, 600) with a squash.
- If it has little mud (`car.mud.length < 14`, for example on a second wash in a row), it rolls through the puddle first: *ŞLAP!*, a squelch, and blobs splatting onto the body one by one. Queued: **"Şlap! Çamura battım!"**
- Then queued **"Yıkama zamanı!"**. The 🧽 sponge is already selected and pulsing, and the tools pop in.

### 2.3 Free play: three care steps
Left column: the tools 🧽 🚿 💨 ⛽. Right: ✅. Top center: three small **decorative** step icons 🧽 💧 💨. Each fills with a ring and gets a gold ✓.

**🧽 Sponge (scrub → step "Temiz").** Finger down shows a big yellow sponge under the finger that squishes in the direction of motion.
- It erases mud along the path in the same frame, windows included.
- It leaves foam bubbles in this visit's foam color, one per ~14 px of travel. They grow to 8–22 px and wobble.
- A soft squeaky rub plays every 0.09 s while moving, pitched by speed. Held still, the sponge scrubs in a small circle on its own, so a resting finger still cleans.
- **Near the face** (within 60 local px of the eye or mouth point): ^ ^ eyes, a laughing mouth, blush, a giggle sfx and a wiggle. Chatter: **"Gıdıklanıyorum!" / "Hi hi hi!" / "Gıdı gıdı!"**. It also wipes the milk mustache if there is one.
- **Off the car**: the sponge still shows, plays a softer rub, and leaves short-lived suds particles. Nothing happens silently.
- At 25+ foam bubbles, the first time: chatter **"Köpük köpük!"** (the mp3 already exists).
- Once ≤ 10% of the visible mud is left, the rest vanishes in a left→right sparkle wipe. Queued **"Çamur gitti!"**, +3 ⭐.

**The surprise under the mud.**
- One emoji is hidden under an extra-thick mud blob on a visible body cell. Every 2 s a small twinkle sparkles over it while it is covered.
- Scrubbing reveals it gradually. When its 3×3 cell neighbourhood is ≤ 20% dirty, it pops (scale 1→1.8→1.1) with magic plus a ding and the comic 'SÜRPRİZ!'. Queued **"Bir sürpriz buldum!"**, +2 ⭐.
- It stays on the car as a sticker, and a copy flies to its shelf slot, which glows. If that was the last missing slot, queued **"Hepsini buldum!"** and confetti.
- Any cleaning tool can reveal it.

**🚿 Hose (rinse → step "Durulama").** The hose hangs from the ceiling reel down to a nozzle held just above-left of the finger. A fat water stream hits exactly under the finger, with splash drops where it lands.
- Foam within 70 px of the hit point pops **one bubble every 30 ms**, each with a size-pitched squeak and a ring. This chain pop is the main thrill.
- Mud near the hit point washes away gradually (slower than the sponge).
- Water drops stick to the body and slide down a little, and the body gets a wet blue sheen.
- **On the face**: > < squint, a shiver and a wavy mouth. Chatter **"Brrr, soğuk!" / "Islandım!"**
- On the hat: the hat wobbles on its spring (`car.hatV += 300`).
- Rinse completes when **mud is done, no foam is left, and the hose has run ≥ 0.8 s**. Queued **"Köpükler gitti!"**, +3 ⭐.

**💨 Fan (dry → step "Kuru").** Finger down shows a giant round fan (cage and spinning blades) at the finger. It **always turns to face the car's center** and blows a **cone** (±50°) toward it. White wind streaks fly from the fan along the cone, and there is a low whooshing hum. Wherever the child puts it, it blows at the car, and the picture matches the wind.
- At a point: strength = `(1 - d/420) × cone(angle)`. Points within 90 px of the fan count as fully in the blast.
- Drops in the wind are flicked off as `drop` particles flying along the wind. Foam detaches as floating bubbles.
- **Cheeks**: the eye point in the wind makes the car puff its cheeks, which wobble with strength. Chatter **"Yanaklarım uçuyor!"**
- **The hat flies off**: when the hat point has strength > 0.35 and the hat is on, `hatLaunch(dir)` (shared with the mega-burp, §4.6) sends it tumbling along the wind. It bounces on the floor. Queued (stale after 1.5 s) **"Şapkam uçtu!"**. Tapping the hat, or waiting 2.5 s, boomerangs it back with a boing. Chatter **"Şapkam geri geldi!"**. There is a 6 s cooldown.
- Dry completes when **the car has been wet and no drops are left**. Queued **"Kupkuru oldum!"**, +3 ⭐.

**Which tool can finish which step (honest table):**

| step | finished by | note |
|---|---|---|
| Temiz (mud) | sponge (fast), hose (slow) | auto-finish at ≤ 10% of visible mud left |
| Durulama | hose only | needs Temiz first, so "foam gone" means something |
| Kuru | fan (and the cloth if Stretch A is built) | needs the car to have been wet |

**All steps done:**
- Closed bliss eyes, hearts, a happy sigh, a full shine sweep across the body (a gloss band plus `Snd.twinkle`) and confetti.
- Queued **"Mis gibi oldum!"**, +5 ⭐. Then queued **"Çok susadım!"**, and ⛽ starts pulsing.
- ✅ grows and pulses too, so a parent can see the wash is finished.

**Auto-advance (the direct-gesture shortcut).**
- When a step completes while its own tool is selected, the next tool is selected. That is the next unfinished step's tool, or ⛽ after the last step. The button bounces and the cursor changes with a poof.
- Its name is **queued after** the completion line, so the order is always "Çamur gitti!" → "Bir sürpriz buldum!" → "Hortum!".
- Auto-advance never switches while the finger is down; it waits for `up()`.
- A child who only ever drags or taps on the car is walked through every step and the drink without ever touching a tool.

### 2.4 ⛽ Drink pump (core: the laugh)
Selecting ⛽ wheels a colorful pump in to the right of the car, with two big taps: **🧃 (1010, 330, r 56)** and **🥛 (1010, 470, r 56)**. Tapping a tap, or tapping the car (it alternates, untried drink first), runs this sequence:
1. The drink name is queued, stale after 1.5 s: **"Meyve suyu!" / "Süt!"**. A hose swings over and a straw pops into the mouth point (`ykMouth(B)`).
2. Colored blobs travel along the hose for 1.2 s with glug sounds while the cheeks puff.
3. At +1.4 s comes the reaction. The sfx is instant and the line is queued:
   - 🧃 **BURP**:
     - `Snd.burp()`, the comic 'GEERRK!', a big O mouth and 12 orange bubbles puffing out of the exhaust (trail anchor). The car squashes and the hat jumps (`hatV += 600`). Queued **"Pardon!" / "Afiyet olsun!"** (one of the two).
     - **Every third juice is a MEGA-BURP**: a longer, lower burp, a screen shake, and `hatLaunch()` blows the hat off backwards (no hat: the car hops instead).
   - 🥛 **MOO**: `Snd.moo()`, the comic 'MÖÖ!', a white milk mustache that stays for the visit (the sponge on the mouth wipes it with a giggle). Queued **"Süt bıyığım oldu!"**
4. +1 ⭐ the first time each drink is tried in a visit. Taps during a drink give a bubble blip and queue at most one more.

### 2.5 Leaving
✅ (1188, 610, r 60) is visible from the end of the intro, so a parent can leave at any time. Tapping ✅ makes the car squash and honk, and after 0.6 s `go(End)`.

On End the counter starts at the pre-wash total and counts up through the wash stars. End says **"Teşekkür ederim! Hadi yarışalım!"** once the voice is idle, so a "Mis gibi oldum!" still playing is not cut off. The clean car dances with its new sticker, and 🔁 races it.

### 2.6 Guidance without reading
- The suggested tool pulses, and auto-advance selects it (§2.3).
- After 10 s with no interaction, the suggested step's hint is spoken as chatter: **"Süngerle ovala!" / "Şimdi su sık!" / "Rüzgarla kurula!"**, or **"Çok susadım!"** when only the drink is left.
- The surprise twinkle draws the eye to a dirty spot.

---

## 3. Integration with the existing game

### 3.1 Flow and changed code
New flow: **Drive → End ⇄ CarWash**. End → Drive | Garage as before. Drive 🏠 → Garage is unchanged.

| Existing code | Change |
|---|---|
| `Voice` (~295) | Add `busyUntil: 0` and `idle() { return Snd.muted \|\| performance.now() >= this.busyUntil; }`.<br>In `say()` after `stop()`: `this.busyUntil = now + 600 + 75 * t.length` (an estimate and upper bound).<br>`u.onstart`: re-estimate from the real start. `u.onend`: `busyUntil = performance.now()`.<br>`playRecording`: on `s.start()`, `busyUntil = performance.now() + buf.duration*1000 + 80`. On a dropped or failed load, `busyUntil = performance.now()`. On the Audio element, `onended`/`onerror` do the same.<br>≈ 10 lines. No existing behavior changes. |
| `buildCourse()` specials (~2327) | Remove `{ type: 'wash', x: L * 0.92 }` and keep the 55% wash.<br>Add `const mudX = L * 0.9;` and extend `near(x)` with `\|\| Math.abs(x - mudX) < 320`.<br>After the loop, push `{ type: 'mud', x: mudX, lane: ln, t: 0, field: true }` for `ln = 0..2` (three road decals, drawn by the existing `drawDecal` and both decal lists). |
| `Drive.collide` (~2477) | `const laneHit = o.field \|\| Math.abs(this.ly - LANES[o.lane]) < 46;`<br>Before `this.hit(...)`: `if (o.field) for (const q of this.objs) if (q.field) q.done = true;`.<br>The car gets exactly one mud hit (9 blobs) in any lane, mid lane change, or mid jump (mud has no z check today). |
| `End` (~2876) | `enter()`:<br>• `const back = this.washBack; this.washBack = null; this.back = !!back; this.from = back ? back.from : 0; this.shown = this.from;`<br>• `this.said = false;`<br>• `this.invite = !back && car.mud.length >= 9 && (this.invN = (this.invN \|\| 0) + 1) % 2 === 1;`<br>• `this.wash = new Button({x:340,y:640,r:60,bg:'#3bc9db',icon:'🫧'}); this.focus = 1;`<br>• **Remove** the `setTimeout(() => say(...), 400)`.<br>`update()`:<br>• count-up `const target = Math.min(this.stars, this.from + Math.floor(this.t * 25));`<br>• opening line `if (!this.said && this.t > 0.4 && (Voice.idle() \|\| this.t > 2)) { this.said = true; say(this.back ? 'Teşekkür ederim! Hadi yarışalım!' : 'Harikaydın! Bir daha oynayalım mı?', true); }`<br>• the invitation (§2.1, gated on `this.said && this.t > 2.4 && Voice.idle()`)<br>• `wash.pulse = car.mud.length > 0`, with bubbles and drips.<br>`click`: `wash.hit` → `Snd.bubble(); go(CarWash)`.<br>`key`: ←/→ move `focus` over [🫧, 🔁, 🔧] (gold ring). Enter activates the focused button (default 🔁, so Enter = replay as today). Other keys honk.<br>`buttons()` adds `wash`. |
| `newCar()` (~552) | add `stickers: []`. **`Garage.randomAll()` is not changed: 🎲 never removes stickers.** |
| `drawCar(c,x,y,s,o)` (~1418) | (a) **Move** the `for (const m of c.mud)` loop out of the first clip.<br>(b) After `B.details(...)` and before `drawFace(...)`: `if (c.mud.length \|\| (c.stickers && c.stickers.length) \|\| o.overlay) { ctx.save(); ctx.beginPath(); B.path(); ctx.clip(); ykDrawStickers(c); mud loop; if (o.overlay) o.overlay(B, t); ctx.restore(); }`.<br>(c) Just before the final `ctx.restore()`: `if (o.post) o.post(B, t);` (car-local, unclipped: foam, straw, mustache).<br>The pattern and the bottom shadow band stay in the first clip. One extra clip is added only for muddy or stickered cars. |
| `drawFace(c,B,t,honk)` (~1155) | first line: `if (c.mood) { drawMood(c, B, t); return; }`, with a new `drawMood` right after it. |
| `TRACKS` (~266) | add `wash`. |
| `Snd` (~100–261) | new SFX (§5.2). |
| after `const car = newCar()` (~1775) | nothing there. The CarWash section's top-level code runs `car.stickers = ykLoad().on;` after its own constants (it is still above `go(Title)`, so there is no TDZ problem). |
| `window.__game` (~3038) | add `CarWash`. |
| `README.md` | a new "🫧 Oto yıkama" section. |

Without `mood`, `overlay`, `post` or stickers, every scene draws exactly as before. The only visible change elsewhere: road mud now also covers windows (in Drive and End). That makes it consistent with the wash, where those windows can be scrubbed.

**Car state during the wash:** each frame, `tmpCar()` returns `Object.assign({}, car, { mud: [], mood, hat: hatOn ? car.hat : 0 })`. `mud: []` is essential, because the mask is the **only** mud renderer during the wash. Only `car.stickers` and (on exit) `car.mud` are written back to the global car. `car.wheelA`, `squash` and `hatV` animate on the global car through `updateCarAnim(car, dt)`, as in End.

### 3.2 Systems reused
- **WheelStudio painting technique**: an offscreen canvas plus `destination-out` round-cap strokes (`WheelStudio.paint`, ~2142) → the mud mask `ykDirtCv`.
- **Particles**: `bubble`, `drop`, `ring`, `star`, `heart`, `flystar`, `poof`, `sparkle`, `comic`, `confetti`.
- **Car rendering**: `drawCar` (with the hooks), `drawFace` (with moods), `drawHat(i,t)` for the flying hat, `updateCarAnim`, `honk()`, `customRide` (a pure function of `c.wheelA`), `wheelXs`, `WHEEL_R`, `BODIES[i].path()/eye/mouth/hat/trail`.
- **UI**: `Button` (r ≥ 54 for child tools), `emoji`, `text`, `rr`, `circ`, `ell`, `starPath`, `heartPath`.
- **Audio**: `Snd.tone/noise`, existing `pop, bubble, splash, squelch, moo, boing, magic, ding, whoosh, swish, thud`, `Music.play('wash')`, `say()` (with the new `Voice.idle()`).
- **Input**: the scene `click/move/up/key/buttons` interface, `keys{}`.

---

## 4. Mechanics in detail

### 4.1 Coordinates: exact matrix
- The car's screen ground point is `(this.cx, YK_Y=600)` at scale `YK_S=1.2`. `cx` animates −260 → 640 during the intro. No `rot` or `bob` is passed to `drawCar` in the wash.
- **Car-local space** is `drawCar`'s space after all its transforms. The mask, grid, foam, drops, surprise and stickers live there.
- `ykCarMatrix(c, x, y, s)` mirrors `drawCar` line by line:
  ```js
  const m = new DOMMatrix().translateSelf(x, y).scaleSelf(s, s)
    .scaleSelf(1 + sq * 0.22, 1 - sq * 0.22).translateSelf(0, -lift - sqb);
  if (pitch) m.translateSelf(pivX, lift - wr).rotateSelf(pitch * 180 / Math.PI).translateSelf(-pivX, wr - lift);
  ```
  It uses the same `wr`, `lift`, square-wheel `sqb` and `customRide` values, with `sq = c.squash`.
- It is recomputed every frame together with its inverse, so hit-testing stays exact during roll-in, squash wiggles (giggle, honk, burp) and custom-wheel pitch.
- `carLocal(p) = this.inv.transformPoint(p)`, `carScreen(l) = this.m.transformPoint(l)`. `DOMMatrix` works in Safari 11+.

### 4.2 Coverage grid: only cells the child can see (no `getImageData`)
- `ykCover(c)` is cached per key `body|wheels|hatOn`. The local box is x −240..240, y −360..20, with `YK_CELL=20`, giving 24×19 = 456 cells.
- `body[i] = 1` when the cell center is inside `BODIES[bi].path()` (`isPointInPath` with an identity transform, inside save/restore).
- `free[i] = body[i]` and none of these excludes it:
  - **face**: `|x-e.x| < 44·e.s+10 && |y-e.y| < 26·e.s+10`, and the same for the mouth box (`34·m.s+10`, `22·m.s+10`) when `B.mouth` exists. The face is drawn over the mud.
  - **hat** (when on): `|x-hat.x| < 60 && y < hat.y+14`.
  - **wheels**: within `wr·k+8` of each wheel center `(wx, -wr·k+lift)` from `wheelXs`.
- It returns `{body, free, freeList, bx0, by0, bx1, by1}` (the bbox of the free cell centers). At most a few × 456 calls per session.
- Dirt, the surprise and sticker snapping use **free** cells only. The mask is still painted and erased everywhere in the clip, so mud under the eyes is real but never blocks completion.
- `dirt: Float32Array(456)` is 1 for free cells within `r·1.5+6` of a mask blob. `dirt0` is the initial sum (≥ 6, guaranteed by the puddle, §8.1).
- The sponge sets `dirt = 0` within 46 local px. The hose does `dirt -= 2.2·dt` within 40. Running sums are kept incrementally.

### 4.3 The mud mask
- `ykDirtCv` is **480×380 at full local resolution**, with `setTransform(1,0,0,1,240,360)`. At scale 1.2 and DPR 2 that is about 2.4 device px per mask px. Edges are slightly soft, which suits mud. It costs 730 KB of memory and one `drawImage` per frame.
- `this.blobs = car.mud.map(copy)` plus the puddle blobs (`r` 10–22 on random free cells, **also pushed into `car.mud`**).
- `ykMudBlob(b)` paints a main circle (`r·1.5`, `#7a4a1e`), 3–4 satellites, one drip and a `#9a6a3a` speck.
- **The surprise**: on enter, pick the dirty free cell nearest the mud centroid and paint one extra blob (r 34) at its center (in `this.blobs` only). Store `this.sur = {x, y, e, found:false, pop:0}`.
- Erasing uses `ykErase(a, b, w, alpha)`: `destination-out`, `globalAlpha=alpha`, round caps. The sponge uses w 92 with alpha 1. The hose uses w 80 with alpha 0.18 per frame.
- In `o.overlay` (the post-details clip, above the windows), the draw order is: wet sheen, then the surprise emoji (size 54), then `ctx.drawImage(ykDirtCv, -240, -360)`, then the drops, then the shine band. Stickers were already drawn just before the overlay, so old stickers are also under the mud and get re-discovered.
- Auto-finish happens at `dirtSum/dirt0 ≤ 0.10`: `clearRect`, all dirt set to 0, a sparkle sweep, and the surprise is found if it was not already.

### 4.4 Foam
- `this.foam = [{x,y,r,tr,ph,age,life}]` in local coords, capped at **120** (the oldest pops).
- Spawn: one per 14 px of sponge travel, jitter ±22, only within 30 px of a body cell. `tr` 8–22, `life` 10–20 s, `r += (tr-r)·6·dt`.
- Color comes from `YK_FOAM[visits % 4]` (white, `#ffc9e3`, `#c5e8ff`, rainbow = hue per bubble).
- Drawn in `o.post` (unclipped, so it overhangs fluffily) as a wobbling circle, a rim and a highlight dot.
- `popFoam(i)` plays `Snd.squeak(1800 - r·40)`, spawns a ring and 3 drops.
- The hose fills `popQ` with bubbles within 70 px and pops one every 30 ms. The fan detaches bubbles into `bubble` particles moving along the wind.

### 4.5 Drops and wetness
- `this.drops = [{x,y,r,vy,stop}]`, capped at 60, placed on free cells.
- The hose adds about one drop per 0.05 s near the hit point. Drops slide down 6–20 px/s to a random stop.
- `this.wet` (0..1) rises under the spray and falls under the fan. `wetEver` is set on the first drop.
- The fan removes each drop in the wind with chance `dt·6·str`, turning it into a `drop` particle.

### 4.6 Wind, cheeks and the shared hat flight
- **Wind.** The fan is at finger point F. Its aim is `A = normalize(carScreen(0,-90) - F)`. For a local point L: `v = carScreen(L) - F`, `d = |v|`, `cone = d < 90 ? 1 : clamp((dot(v/d, A) - cos50°)/(1 - cos50°), 0, 1)`, `str = max(0, 1 - d/420) · cone`. Wind streaks (≤ 2 per frame) leave F along `A` ± 40°, and the fan drawing is rotated to `A`.
- **Cheeks.** When `str(eye) > 0`, mood is set to `'puff'` (refreshed for 0.3 s), with wobble ∝ str.
- **Hat.** `hatLaunch(dir)` is built in Checkpoint 3 with the mega-burp and reused by the fan.
  - State: `this.hatF = {state:'on'|'fly'|'floor'|'back', x,y,vx,vy,rot,vr,t}`, plus a cooldown `cd`.
  - Launch: from the hat screen point with `v = dir·520 + (0,-380)`, `vr = 9`, gravity 1400, a whoosh.
  - It bounces at y 660 (×0.45, boing), then switches to `'floor'` (x clamped 200..1080).
  - Return (`'back'`): a tap within 80 px, or 2.5 s, starts a 0.7 s arc tween to the hat point, then a boing, `car.hatV += 500`, `cd = 6`.
  - While not `'on'`, `tmpCar().hat = 0` and `drawHat(car.hat, t)` is drawn at `hatF`.
  - The fan launches along the wind direction. The mega-burp launches backward and up (`dir = (-0.6,-0.8)`).

### 4.7 Shine at the end
When all steps are done, a diagonal gloss band (a linear-gradient stripe 60 px wide) sweeps the body once in 0.8 s inside `o.overlay`, with `Snd.twinkle()`. After that a sparkle appears at a random free cell every 0.6 s. Stretch A (the cloth) turns this into an interactive step.

### 4.8 Surprise, stickers and the treasure shelf
- `YK_SURPRISES = ['🦄','🦖','👑','🐶','🍓','🌈','🚀','🐞','🍭','🦋','⭐','🐱']`.
- **Which surprise**: the first emoji in that order that is not yet in `got`. Once all 12 are collected, it is `YK_SURPRISES[visits % 12]`. The collection always moves forward.
- **When it is found**:
  - `car.stickers.push({u, v, e, rot: rand(-0.4,0.4)})`, where `u,v` is the position normalized within the cover bbox (`(x-bx0)/(bx1-bx0)`).
  - `e` is added to `got`.
  - It is saved right away (§7).
  - A copy flies along a scene-local emoji tween (`this.fly`) to its shelf slot, which glows and pops.
- **Cap 6 on the car, never a loss.** When a 7th sticker arrives, the oldest one peels off (a scale and rotate wobble, `Snd.swish`) and flies to its shelf slot. It is already in `got`, so it stays on the shelf forever. **Nothing ever removes stickers otherwise.** 🎲, Garage, gates and Drive leave them alone.
- **Drawing on any body** (Garage, picker previews, Drive, End, after a gate):
  - `ykStickerXY(c, k)` maps `u,v` into `ykCover(c)`'s bbox and snaps to the nearest **free** cell center. The result is cached in `k.at[key]`.
  - So a sticker is never under the eyes, the mouth, the hat or a wheel. It may sit on a window, like a real sticker.
  - It is drawn in the post-details clip with `emoji(k.e, 0, 0, 40)`, translated and rotated.
- **The shelf** is decoration in the bay: 12 slots at x 380 + i·47, y 118, slot r 20. A collected slot shows its emoji; an empty one shows a faint bubble. Tapping a collected one gives a pop, a sparkle and a wiggle (no voice, since names are not voiced).

### 4.9 Moods (`drawMood(c, B, t)`)
`c.mood` comes from `this.mood = {name, until}`. Eyes are drawn at `B.eye` (scale `e.s`). The mouth is drawn at `ykMouth(B) = B.mouth || {x: B.eye.x + 20·B.eye.s, y: B.eye.y + 34·B.eye.s, s: B.eye.s}`. The duck (5) and rocket (10), which have `mouth: null`, get the eyes plus cheeks only. The straw and mustache use the `ykMouth` point. **No new code reads `B.mouth.x` directly.**

| mood | eyes | mouth | extra | tier |
|---|---|---|---|---|
| giggle | ^ ^ arcs | big open laugh | blush, tiny tears | core |
| squint | > < chevrons | wavy line | blue shiver lines | core |
| puff | round, forward | small o | two wobbling cheek circles `shade(BODY_COL, 0.15)` | core |
| bliss | closed U arcs | wide smile | blush; the scene emits hearts | core |
| burp | wide, small pupils | big O | — | core |
| sour / hyper | × squeezed / spirals | pucker / toothy grin | green tint / — | stretch B |

The milk mustache is not a mood. It is drawn in `o.post` at the `ykMouth` point (three white overlapping ellipses with an OUT stroke), so it shows over any face.

### 4.10 Scene timers and the voice queue
- **Timers**: `this.q=[{at,fn}]` with `later(sec, fn)`, processed in `update` and reset in `enter()`, so nothing survives `go()`. `setTimeout` is used only for pure sound staggering.
- **One queue for every scripted line**: `this.vq = [{text, tool?, exp?}]`.
  - `qsay(text, stale?)` pushes a line. With `stale`, the line is dropped if it has not started within that many seconds, because a late "Şapkam uçtu!" is worse than none.
  - `qsayTool(text)` first removes any queued tool item, then pushes with `stale = 1.5` (auto-advance uses 4).
  - Pump in `update`:
    ```js
    if (this.vq.length && this.t >= this.vGap && (Voice.idle() || this.cur === 'c')) {
      const it = this.vq.shift();
      if (!it.exp || this.t <= it.exp) { say(it.text, true); this.cur = 'n'; this.vGap = this.t + 0.25; }
    }
    ```
  - Queued lines wait for each other by real duration, through `Voice.idle()`. Chatter is the only speech a queued line may interrupt.
  - Write it as `this.qsay('Çamur gitti!');` on one line. `qsay(` contains `say(`, so gen-voice discovers the literal. Tool names come from `say:` properties.
- **Chatter gate**: `quiet()` is true only when `!this.vq.length && Voice.idle() && this.t >= this.chatT`. It then sets `chatT = t + 2.0` and `cur = 'c'`. Chatter is written as `if (this.quiet()) say(pick(['Gıdıklanıyorum!', 'Hi hi hi!', 'Gıdı gıdı!']));`. Chatter never cuts a queued line, and the 900 ms throttle cannot eat it.
- **Tool select** queues exactly one line through `qsayTool`: care tools say their name, ⛽ says 'Çok susadım!'. A tap gives instant sfx and a bounce. The name follows as soon as the voice is free, or is dropped after 1.5 s.

### 4.11 Stars without loss
- `this.bank` (stars earned this visit) is incremented **at award time**. The `flystar` to (60,52) is cosmetic.
- On exit: `End.washBack = { from: Drive.stars }; Drive.stars += this.bank; go(End)`.
- Rewards: Temiz, Durulama and Kuru +3 each, all done +5, surprise +2, each drink +1 the first time, for about 18 per visit. Every wash rewards again, and no score ever goes down.

---

## 5. Content lists

### 5.1 Catalogs (near the scene)
```js
const YK_TOOLS = [
  { id: 'sunger', icon: '🧽', bg: '#ffd23f', step: 'temiz',    say: 'Sünger!' },
  { id: 'hortum', icon: '🚿', bg: '#4dabf7', step: 'durulama', say: 'Hortum!' },
  { id: 'fan',    icon: '💨', bg: '#a5d8ff', step: 'kuru',     say: 'Rüzgar!' },
  { id: 'icecek', icon: '⛽', bg: '#ff8787', step: null,       say: 'Çok susadım!' },
  // stretch A: { id: 'bez', icon: '✨', bg: '#ff8fb8', step: 'parlak', say: 'Parlat!' },
];
const YK_STEPS = [['temiz', '🧽'], ['durulama', '💧'], ['kuru', '💨']]; // filtered to built tools
const YK_SURPRISES = ['🦄', '🦖', '👑', '🐶', '🍓', '🌈', '🚀', '🐞', '🍭', '🦋', '⭐', '🐱'];
const YK_FOAM = ['#ffffff', '#ffc9e3', '#c5e8ff', 'rainbow'];
const YK_DRINKS = [
  { id: 'meyve', icon: '🧃', col: '#ffa94d', say: 'Meyve suyu!' },
  { id: 'sut',   icon: '🥛', col: '#f8f9fa', say: 'Süt!' },
  // stretch B: 🍬 'Şeker suyu!', 🍋 'Limonata!'
];
```
Tool positions are computed: x 92, y spread evenly over 170..560, r 54 for ≤ 4 tools and r 50 for 5. Each `say: '…'` sits on its entry's line, so gen-voice rule 2 finds it.

### 5.2 New SFX (`Snd` methods from `tone`/`noise`)
| method | recipe | use |
|---|---|---|
| `squeak(f=1600)` | sine f 0.07 s, slide ×1.6, vib [30,40], vol 0.12 | foam pop |
| `scrub(v)` | bandpass noise 0.08 s, freq 900+v·900, q 3, vol 0.12 + sine chirp 1200→1500 | sponge (every 0.09 s) |
| `sprayTick()` | highpass noise 0.07 s, 2500 Hz, vol 0.10 | hose (every 60 ms) |
| `fanTick(s)` | lowpass noise 0.12 s, 350+s·300 + saw 70 Hz vol 0.04 | fan (every 100 ms) |
| `giggle()` | 4 triangle blips 700→900, vib [18,60], 70 ms apart | tickle |
| `twinkle()` | sine arpeggio 1320/1660/1980/2640, 60 ms apart | shine, surprise |
| `sigh()` | triangle 520→330 0.7 s + 440→300 0.6 s (delay 0.5) | all clean |
| `burp(big)` | saw 110→70 0.55 s (big: 95→55, 1.1 s), lowpass 500, vib [22,15], vol 0.3 | juice |
| `glug()` | sine 180–260 0.09 s slide ×1.8 | drinking |

Reused: `pop, bubble, splash, squelch, magic, ding, boing, whoosh, swish, moo, thud`. All core.

### 5.3 Music
`TRACKS.wash = { bpm: 116, wave: 'triangle', vol: 0.09, roots: [0,5,7,5], mel: [12,null,16,null,19,null,16,null, 14,null,17,null,21,null,17,null, 12,14,16,null,19,null,24,null, 21,null,19,null,16,null,null,null] }`. `Music.play('wash')` runs in `enter()`. End switches back to `'garage'` as today.

### 5.4 All new voice lines (exact text)
Q = queued (`qsay`, forced when it plays, waits for `Voice.idle()`); Q* = queued and stale after 1.5 s; C = chatter (`quiet()`); E = End (forced, waits for idle).

| when | line(s) | mode |
|---|---|---|
| End, muddy, every other visit | `pick(['Çok çamurlandım! Beni yıkar mısın?', 'Iyy, çamurlu oldum!', 'Köpük yapalım mı?'])` | E |
| End after a wash | `'Teşekkür ederim! Hadi yarışalım!'` | E |
| puddle | `'Şlap! Çamura battım!'` | Q |
| intro done | `'Yıkama zamanı!'` | Q |
| tool names | `'Sünger!'`, `'Hortum!'`, `'Rüzgar!'`, `'Çok susadım!'` (⛽) | Q* (tool) |
| sponge on face | `pick(['Gıdıklanıyorum!', 'Hi hi hi!', 'Gıdı gıdı!'])` | C |
| 25+ foam (mp3 exists) | `'Köpük köpük!'` | C |
| mud done | `'Çamur gitti!'` | Q |
| surprise found | `'Bir sürpriz buldum!'` | Q |
| shelf complete | `'Hepsini buldum!'` | Q |
| hose on face | `pick(['Brrr, soğuk!', 'Islandım!'])` | C |
| rinse done | `'Köpükler gitti!'` | Q |
| fan on face | `'Yanaklarım uçuyor!'` | C |
| hat flies | `'Şapkam uçtu!'` | Q* |
| hat returns | `'Şapkam geri geldi!'` | C |
| dry done | `'Kupkuru oldum!'` | Q |
| all done | `'Mis gibi oldum!'`, then `'Çok susadım!'` | Q |
| drink names | `'Meyve suyu!'`, `'Süt!'` | Q* |
| juice reaction | `pick(['Pardon!', 'Afiyet olsun!'])` | Q |
| milk reaction | `'Süt bıyığım oldu!'` | Q |
| idle hint | `'Süngerle ovala!'`, `'Şimdi su sık!'`, `'Rüzgarla kurula!'` (or `'Çok susadım!'`) | C |

Core: 30 new mp3s ('Köpük köpük!' exists). Stretch A: `'Parlat!'`, `'Bezle parlat!'`, `'Pırıl pırıl oldum!'`. Stretch B: `'Şeker suyu!'`, `'Limonata!'`, `'Şekerden uçuyorum!'`, `'Çok ekşi!'`.

Rules:
- No apostrophes.
- Each `say(`/`qsay(` literal stays on one line.
- Comic texts ('ŞLAP!', 'SÜRPRİZ!', 'GEERRK!', 'MÖÖ!') go on separate statements from any `say(`.
- After implementing, `node tools/gen-voice.mjs --missing` must list exactly the lines of the built tiers. Generate them (`FAL_KEY` or the fal MCP) or list them in the commit message.

---

## 6. UI and controls

### 6.1 Layout (logical 1280×720)
- **Tools** (left): x 92, y 170/300/430/560, **r 54**. The selected tool gets a gold ring (r+10, lw 8) and a bounce. The suggested tool pulses.
- **✅** (1188, 610), r 60, green.
- **Drink taps** (only while ⛽ is selected): 🧃 (1010, 330) and 🥛 (1010, 470), r 56, on a pump drawn at x 960..1060. They stay clear of the car (body x ≈ 400..880) and of ✅.
- **Top of the screen**:
  - step icons at x 560/640/720, y 50, r 28, decorative only
  - treasure shelf at y 118, x 380..900
  - star counter at (60, 52)
  - the hose reel at (300, 30), decorative and away from the tool column
  - the top-right HUD is left free
- **Car**: (640, 600) at scale 1.2.
- **End**: 🫧 (340, 640, r 60) sits next to 🔁 (540) and 🔧 (740).

### 6.2 Touch and mouse
- `click(p)` checks, in order:
  1. buttons (select, pop, sparkle, one queued line)
  2. drink taps
  3. the floor hat or a shelf slot
  4. otherwise `down=true` and the tool's `start(p)` runs (⛽: the car gives a drink)
- `move(p)` updates `this.p`, so the mouse shows the tool cursor on hover. While `down`, `drag(lastP→p)` is interpolated every 10 px, so fast flicks leave no gaps.
- `up()` sets `down=false`. Spray, fan and scrub stop, and a pending auto-advance applies.
- One finger at a time. A second finger only moves `this.p`, which is harmless.

### 6.3 Keyboard
| key | action |
|---|---|
| `1`–`4` (`5` stretch) | select a tool |
| Tab | next tool |
| Arrows / WASD | move the tool cursor at 520 px/s (clamped x 180..1100, y 90..690); it appears on the first press |
| Space (held) | finger down at the cursor |
| **Esc** (after 1.5 s) | ✅ — the only exit key. Corner key, a parent key, and leaving gives no loss anyway. |
| any other key, incl. Enter and Backspace (non-repeat) | **helper burst**: the current tool performs a 0.4 s virtual stroke at a useful target through the same `drag()` path. Targets: a dirty cell (the surprise first), foam, a drop, the face for the fan. With ⛽ it gives the next drink. Mashing keys cleans the car, and mashing never leaves the wash. |

End: ←/→ move the focus over 🫧 🔁 🔧. Enter activates the focused button (default 🔁, today's behavior). Other keys honk.

---

## 7. Persistence
**`cade-yikama`** holds JSON `{v:2, visits, got:[…], on:[…]}`. It is read in try/catch and validated field by field, like `cwLoad`:
- `visits`: an integer 0..9999, else 0.
- `got`: unique strings that are in `YK_SURPRISES`. Anything else is dropped.
- `on`: at most 6 entries `{u,v,e,rot}`, with `u,v` finite and in [0,1], `e` in `YK_SURPRISES`, `rot` in [-1,1]. Invalid entries are dropped one by one. The non-serialized `at` cache is never saved.
- A v1 object (`{v:1, visits}`) keeps its visits; `got` and `on` start empty.
- `ykLoad()` runs once at startup and sets `car.stickers`. `ykSave()` writes when a surprise is found, on a peel and on exit. The data is under 1 KB.

`visits` is incremented on enter. It picks the foam color and shortens the intro from visit 3 on (roll-in 1.2 s, no puddle line if mud was already there).

**Mud on exit**: if Temiz completed, `car.mud = []`. Otherwise `car.mud = this.blobs.filter(b => !b.surprise && dirtAt(b) > 0.5)`. That is the mud still visible on the car, road and puddle alike, so End honestly shows what is left. `Drive.enter` resets mud as today. The mask is rebuilt every visit, and no canvas data is stored.

The car configuration itself is still not persisted (unchanged). Stickers re-project onto whatever body the reloaded default car has.

---

## 8. Edge cases
1. **Clean car enters** (a second wash in a row): the puddle adds `18 - mud.length` blobs on **free** cells, so `dirt0 ≥ 6` is guaranteed. If the grid still finds fewer than 6 dirty cells (theoretical), Temiz completes on the first sponge touch.
2. **Lane change or jump at the mud field**: `o.field` ignores the lane test, and mud has no z check, so the car gets one hit in any lane at any height.
3. **Mud under the face, hat or wheels**: it is painted and erasable, but not counted. It can never block completion. Auto-finish clears it.
4. **Duck (5) and rocket (10), no mouth**: `ykMouth(B)` provides a point. Moods draw eyes and cheeks. The straw and mustache use the point, and no new code reads `B.mouth` directly.
5. **Hat 0**: no hat flight. The fan gives cheeks only, and the mega-burp makes the car hop. `drawHat` is never called with 0.
6. **Tall and odd bodies** (the ice cream cone up to −320): the grid covers y −360..20, and clipping uses the real `B.path()`.
7. **Road mud outside the silhouette**: it is clipped away visually and marks no cells.
8. **Custom wheel (10) on a bumpy angle, squash wiggles**: the matrix includes pitch and squash, so hit-testing stays under the finger.
9. **Voice**:
   - Muted: `Voice.idle()` is true, so the queue drains silently and every visual still plays.
   - No TTS and no mp3: the busy estimate expires and the queue moves on.
   - iOS never firing `onend`: the estimate caps the wait.
   - A stale tool, drink or hat line is dropped, never played late.
10. **Tool spam**: the selection switches instantly, an active drag ends, and only the latest tool name stays queued.
11. **Drag starts on a button**: never activates the tool.
12. **✅ mid-animation** (hat in the air, a drink): all state is scene or temp-car state, the timers live in `this.q`, and `enter()` resets everything. Stars are banked at award time. End waits for the voice to be idle before its line.
13. **Body changed between visits** (a gate, the Garage, a reload): stickers re-project to free cells (§4.8). The grid is per current body, wheels and hat.
14. **7th sticker**: the oldest one peels off onto the shelf. Nothing is lost.
15. **All 12 found**: "Hepsini buldum!" plays once (saved in `got`). After that the surprises cycle with `visits % 12`. Stickers keep coming, and the shelf stays full.
16. **Corrupted storage or private mode**: try/catch. Defaults are used and the game plays normally.
17. **Particle cap 900**: spray ≤ 3 per frame, wind ≤ 2 per frame, burp bubbles 12, sparkles throttled. Foam and drops are scene arrays.
18. **Re-entry** (End → 🫧 → ✅ → 🫧): a full reset, the next surprise, the puddle (since the car is clean), and stars rewarded again.
19. **Picker previews in the Garage** draw up to 16 cars with stickers. That is ≤ 6 emoji each plus one `ykCover` build per body on first sight.
20. **Performance (iPad, DPR 2)**: one 480×380 `drawImage`, ≤ 120 foam, ≤ 60 drops, one gradient, one `drawCar` with one extra clip. No `shadowBlur`, `filter` or `getImageData`.

---

## 9. Implementation plan (one focused session)

**Honest size**: must-ship (Checkpoint 2) ≈ **620 lines**. The full core (Checkpoint 4) ≈ **830 lines**. Stretch A ≈ 60, B ≈ 70, C ≈ 110, D ≈ 40. README +25. The section header is `// ============================================================ oto yıkama`, with Turkish comments and `YK_`/`yk` prefixes.

### Steps and checkpoints
1. **Voice and SFX (≈ 40)**:
   - `Voice.busyUntil` and `idle()` (§3.1)
   - the 9 `Snd` methods after `bubble()` (~253)
   - `TRACKS.wash`
   - Check from the console that `Voice.idle()` flips back after a line.
2. **Shared hooks (≈ 75)**:
   - `newCar().stickers`
   - the `drawCar` post-details clip (the mud loop moved, stickers, `o.overlay`) and `o.post`
   - the `drawFace` mood hook and `drawMood` with 5 moods
   - Check that Garage, Drive, End and WheelStudio look identical except for mud now over windows.
3. **Course and End (≈ 55)**:
   - remove the 0.92 wash; add the mud field and the `o.field` collide rule
   - End: 🫧, focus keys, the update-based opening line, the invitation, the `from` count-up, the `washBack` handoff
4. **CarWash skeleton (≈ 230)**:
   - catalogs, `ykCover`, `ykCarMatrix`, `ykDirtCv`/`ykMudBlob`/`ykErase`
   - `ykLoad`/`ykSave` with validation, and `car.stickers = ykLoad().on`
   - `enter()`: reset, buttons, cover, blobs, puddle, surprise, visits, music
   - `later`, `qsay`/`qsayTool`/`quiet` and the pump
   - `tmpCar()` with `mud: []`, the bank, `complete(step)`, `suggested()`, auto-advance
   - intro roll-in, ✅ → End
   - bay background, shelf, step icons, star counter
   - **Checkpoint 1**: End → 🫧 → the muddy car parks with mud over its windows → ✅ → End counts up from the old total.
5. **Sponge, foam, surprise and stickers (≈ 150)**:
   - drag interpolation, scrub erase, foam, the face giggle, off-body suds, auto-finish
   - surprise reveal, the sticker push and save, the shelf fly, the 6-cap peel
   - `ykStickerXY` re-projection
6. **Hose (≈ 75)**: the ceiling hose and stream, drops and wetness, chain pops, the squint, the Durulama check.
7. **Keyboard core (≈ 40)**: number keys, Tab, Esc, letter helper bursts (sponge and hose targets).
   - **Checkpoint 2 = MUST-SHIP** (≈ 620): race → muddy End → wash → scrub with giggles → find the surprise → chain-pop rinse → ✅. The sticker persists across a reload. **If the session runs short, stop here and ship. The step list then has two entries, and nothing references unbuilt tools.**
8. **⛽ Drinks (≈ 95)**:
   - the pump and taps, the straw, the glug blobs
   - the burp reaction and the mega-burp with `hatLaunch()` and the hat physics (shared with step 9)
   - milk with the moo and the mustache (wiped by the sponge)
   - "Çok susadım!" after the last step
   - **Checkpoint 3**: the core has its laugh.
9. **Fan (≈ 70)**: the cone wind, cheeks, the hat launch along the wind, drops and foam blown off, the Kuru check, the all-done shine sweep, bliss and the sigh. Also the fan, face and drink targets for the helper bursts, the cursor and Space-hold (≈ 30).
   - **Checkpoint 4 = full core** (≈ 830).
10. **Stretch, in order** (each one is self-contained behind its own button or timer; an unbuilt one leaves no trace in game.js):
    - **A** ✨ the cloth as a 4th step, "Parlak": an interactive gloss band, a pol grid, 'PIRIL!', and the 3 lines. Tools then use r 50.
    - **B** 🍬 and 🍋 drinks with the hyper and sour moods.
    - **C** 🎈 the tire pump: `c.inf` hooks in `drawCar/customRide/wheelXs/carAnchor/carTop/ykCarMatrix`, the `ykInfMax` cap, and the fart on deflate.
    - **D** a ghost-hand 👆 demo after 6 s idle.
11. **Voices**: run `node tools/gen-voice.mjs --missing`, then generate the lines or list them. **README**: add the "🫧 Oto yıkama" section in Turkish (the End button, the tools, the treasure shelf, the drinks, Esc).
12. **Test pass (Playwright + `window.__game`)**:
    - A full race in each lane, and one forced mid lane change at the field: End shows a muddy car, mud sits on the windows, 🫧 pulses, and the invitation plays on the 1st and 3rd End visits but not the 2nd.
    - `__game.go(__game.CarWash)` with `car.mud=[]`: the puddle fires, and the mask is the only mud (erase a stroke and the clean color shows, windows included).
    - Simulated drags: mud gone, `done.temiz`, the surprise found on a free cell (not under the eyes), auto-advance to 🚿. The voice log, via a wrapped `Voice.say`, shows "Çamur gitti!" → "Bir sürpriz buldum!" → "Hortum!" with no line starting before `Voice.idle()`.
    - Rinse, then dry with the fan from the left, right, top and on the face (cheeks and the hat flight). Three juices give a mega-burp and the hat launch. Milk gives the mustache, and the sponge wipes it.
    - Bodies 0, 1 (3 wheels), 5 (duck), 7 (bus), 8 (big rear wheel), 10 (rocket) and the ice cream cone; wheels 1, 3 and 10 (pitched). Tap accuracy is checked during a honk squash.
    - Stickers: they survive Drive, a gate, 🎲 and a page reload. The 7th sticker peels onto the shelf. A corrupted `cade-yikama` value loads defaults.
    - Keyboard only: End ←/→/Enter, the wash by letter mashing (Enter and Backspace do not exit), Esc exits.
    - Zero console errors through race → End → wash → End → 🔁 → race → End → wash → reload.

---

## 10. Acceptance criteria
1. **End after a race.** After every finished race, End appears exactly as before (same timing, 🔁 and 🔧 unchanged). The car is visibly muddy in every case, including a lane change or a jump at the mud field (one hit, 9 blobs). 🫧 is present and pulses while muddy. A rotating invitation is spoken on every other muddy End visit, after the opening line has finished.
2. **Entering the wash.** 🫧 or End keyboard focus opens `CarWash`. A car with fewer than 14 blobs gets the puddle splash, so the car is muddy on 100% of visits.
3. **Mud drawing.** Road mud is drawn above windows and details and under the face, in every scene. During the wash, mud is drawn **only** by the mask. It matches the road and puddle blobs, and is clipped to all 12 silhouettes.
4. **What counts as dirty.** Only visible cells count toward cleaning: no face, hat or wheel cells. Scrubbing a window visibly removes its mud, and that counts.
5. **Sponge.** A drag erases the mud under the finger in the same frame, leaves wobbling foam in the visit's color, and plays the rub. Holding still keeps scrubbing. Off the body it still gives suds and sound.
6. **The surprise.** Each visit hides one surprise on a free cell: the next uncollected one, then cycling. Revealing it pops it with sound, voice and +2 ⭐. It becomes a sticker, and its shelf slot fills.
7. **Stickers.** They persist on the car into End, Garage and Drive, through 🎲, gates, body changes and page reloads (`cade-yikama`). They never sit under the eyes, mouth, hat or wheels. The 7th one moves the oldest to the shelf, and nothing else removes them.
8. **Hose and fan.** The hose stream hits under the finger, chain-pops foam one bubble at a time, and leaves drops. The fan always faces the car and blows a cone toward it, and the streaks match the wind. On or beside the face it puffs the cheeks. Near the hat it blows the hat off along the wind, and the hat returns on a tap or after 2.5 s.
9. **Steps.** Steps complete per the table in §2.3. Each gives a gold ✓, a queued line and +3 ⭐. All steps together give the shine sweep, "Mis gibi oldum!", +5 ⭐ and then "Çok susadım!" with ⛽ pulsing.
10. **Drinks.** 🧃 always gives an audible burp, orange exhaust bubbles and a line. Every third juice is a mega-burp that launches the hat (or makes a hatless car hop). 🥛 gives the moo and a mustache that stays until the sponge wipes it.
11. **Auto-advance.** A child who only drags or taps on the car (never a tool) is moved through sponge → hose → fan → ⛽ and reaches the burp.
12. **Voice.** Every scripted line goes through the queue and starts only when `Voice.idle()` is true. No queued line cuts off another, and chatter never cuts a queued line. Tool select queues exactly one line, and stale tool, drink and hat lines are dropped, not played late. End's thank-you does not cut off a line still playing from the wash.
13. **Face.** The face reacts within 100 ms (giggle, squint, puff, bliss, burp). The duck and rocket show the eye moods. No error occurs on any body. Hit-testing stays under the finger during squash and custom-wheel pitch.
14. **Leaving.** ✅ is visible after the intro. Leaving leads to End, whose counter climbs as `from + floor(t·25)` from the pre-wash total to race + wash stars, even if ✅ is tapped while stars are flying. Leaving early shows exactly the remaining mud on End.
15. **Keyboard.** Keyboard-only play can complete every step and the drink (letter mashing alone, or cursor plus Space) and can reach the wash from End. Only Esc leaves the wash. Enter, Backspace and letters never do.
16. **Targets and HUD.** All child targets have r ≥ 50 (tools 54, drink taps 56, ✅ 60, 🫧 60). The top-right HUD is untouched.
17. **Must-ship.** Checkpoint 2 alone is a complete, shippable feature with no references to unbuilt tools.
18. **Voice files.** `node tools/gen-voice.mjs --missing` lists exactly the §5.4 lines of the built tiers, and the mp3s exist or are listed in the commit.
19. **Performance.** No `getImageData`, `shadowBlur` or `filter`. 60 fps on iPad with 120 foam. Zero console errors through the test loop in §9.12.
20. **Nothing else changes.** Garage, Drive, WheelStudio and End look and behave as before, except for: 🫧 and the focus keys on End, the update-based opening line, the removed 92% wash, the mud field, mud over windows, and stickers. The README is updated, and no new top-level files are added (`pages.yml` is unchanged).
