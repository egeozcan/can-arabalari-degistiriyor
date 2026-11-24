# Sürpriz Ustası: Anne-Babayla Birlikte

> A play-together mode: a grown-up opens a hidden 🎩 tray and drops real gags (animals, paint, balloons, ramps, mud, gifts) onto the road ahead of the child's car, with a horn duet, an optional friend car, a child prank button and a shared 'Beraber birinci olduk!' finish.

## Evaluation history

| Round | Consistency | Design | Entertainment | Avg |
|---|---|---|---|---|
| 1 | 8 | 7.5 | 7.5 | 7.67 |
| 2 | 8.5 | 7.6 | 8 | 8.03 |

**Status:** not chosen — best avg 8.03 (target was 8.5; "Yolcu Partisi v2" reached it first and was implemented instead).

_Note: the plan below is the latest revision written after the last scored round; that revision was not scored again before the selection was made._

---

# Direction 5: "Sürpriz Ustası: Anne-Babayla Birlikte" (play-together mode)

Version 3 (revised after the round-2 evaluation; the change log is in §11). Target: one engineer, one focused session, inside the single `game.js` file. No frameworks, no build step, works offline.

---

## 1. Vision, and why a 4-year-old will love it

A parent or older sibling sits next to the child and becomes the **Sürpriz Ustası** (surprise master). The child drives as usual. The grown-up has a slim tray of picture buttons along the top of the screen (or the number row on the laptop) and drops gags just ahead of the child's car: a cow trots in from the grass, balloons float down, a ramp springs out of the asphalt with its stars popping up after it, a rainbow gate grows across the road. About a second and a half later the child honks the cow away, flies off the ramp or splashes through the paint, and both of them laugh at the timing.

The grown-up can also bring in **their own car**. It drives one lane over, a little ahead of the child's car, with a waving flag that shows 👨, 👩 or 🧑, and the voice says "Baban geldi!" (or "Annen geldi!", or "Arkadaşın geldi!"). Then the roles flip: the child **taps Daddy's car** and a mud pie, a paint bucket or a banana peel flies across the road and lands on it. "Baban çamur oldu!" *"I made Daddy's car all muddy!"* is the best joke a 4-year-old knows, and now the game says it out loud, using the right name.

Why this works at age 4:

- **Shared laughter beats solo play.** The best moment in a game at this age is when Mom or Dad laughs *with* you. The adult gets a real role that is not "helping" or "teaching": they are the prankster, and the child is the hero who handles every prank.
- **Role reversal is the biggest laugh.** Pranking the grown-up and watching their car splat, wobble and honk in protest is preschool comedy gold. The child does this by tapping the target itself, which is the most natural gesture there is.
- **It is clearly *their* car.** The grown-up picks 👨/👩/🧑 once (saved) and can re-roll the car's look with 🎲 until the child shouts "that one!". The flag and the voice lines name the person.
- **Anticipation and payoff in about 1.5 seconds.** A gag icon flies from the tray to the road, the gag appears, and the child has about 1-2 s to react. That is long enough to notice and short enough that the child does not get bored.
- **Unfairness made by the grown-up is funny, never punishing.** Every gag reuses the existing no-losing objects. The child can never lose to the parent, and the parent's car can never "beat" the child: there is no ranking anywhere in the game, and the End crowns both.
- **A duet is a small ritual.** The grown-up honks and says "now you!", the 📯 button rings yellow, the child answers: 'ÇİFT KORNA!', a rainbow burst and bonus stars. Only a real answer counts (a child spamming the horn does not get it for free, §4.6).
- **Always a tie.** At the finish the two cars jump and high-five ("ÇAK!"). The End screen says "Beraber birinci olduk!" and shows two "1" rosettes.
- **Solo play is genuinely untouched.** Opening the tray takes a deliberate double tap on a small grown-up button, and **opening it changes nothing by itself**: no director, no thinning, no plural End, until somebody actually presses a tray button. The open state is never saved to disk, and a race with no tray input closes the tray again (§6.4).

---

## 2. Player experience, moment to moment

### 2.1 Child (driver)
1. The race starts as usual with the traffic light and "Başla!".
2. A gag icon (for example 🐄) arcs from the top of the screen down to the road ahead in the child's lane with a slide-whistle "fiiiuu". The gag appears where it lands and plays its **entrance**. Most gags have a spoken announcement ("Bak, kim geldi?", "Balonlar geliyor!") when the voice channel is free (§4.11):
   - 🐄 an animal **trots in** from the grass verge with running legs and little hops
   - 🎈 balloons **float down** from the sky with a sway
   - 🛹 a ramp **springs up** from the road with a "boing-up", then its four arc stars **pop up** one by one with rising dings
   - 🌈 a magic gate **grows up** from the road with sparkles
   - 🎨 paint and 🟤 mud **splat** down with splash particles
   - 🍌 a banana **spins in** from above
   - ⭐ a star shower **rains** seven stars into a zig-zag
   - 🎁 a gift **drops and bounces**
3. The child reacts with the controls they already know: honk (the animal runs off, +1 star), change lane (dodge or catch), or ride through. The existing `hit()` reactions fire unchanged: ŞLAP!, ÇAMUR!, KAYDIK!, PAT PAT!, SİHİR!, VIIIN!, Hoop!
4. **Duet:** when the grown-up's horn 📣 sounds, the child's 📯 button pulses with a big yellow ring for **0.9 s** ("your turn!"). If the child answers inside that window, the screen shows 'ÇİFT KORNA!', rainbow rings burst from the child's car, a sparkle chord plays and +3 stars fly to the counter. The third duet in a race gives 'SÜPER İKİLİ!', confetti and +5.
5. **The grown-up's car:** it rolls in from behind, overtakes and settles **one lane over and 240 px ahead** of the child's car, never overlapping it. A flag on a little pole at its back waves 👨/👩/🧑. The voice says "Baban geldi!" and, the first time per session, "Babana şaka yap!" while the car itself wiggles and a pulsing 👆 hand bobs over it.
   - **Tap the grown-up's car** (or the big pink prank button above 📯, or `Enter`): the mud pie, paint bucket or banana peel spins sideways across the road from the child's car onto the grown-up's car. SPLAT: it gets muddy, changes color or wobbles, its hat flies up, it honks back in protest, a comic 'ÇAMUR!' / 'ŞLAP!' / 'KAYDI!' bursts over it, the voice says "Baban çamur oldu!" (or "…boyandı!", "…kaydı!"), and the child gets +1 star. Every third prank the voice says "Şakacı seni!" instead. The next prank (🟤 → 🎨 → 🍌) shows on the pink button and as a small icon floating over the child's car.
   - Tapping again during the short reload makes the grown-up's car hop and beep: something always happens.
   - If the child steers into the grown-up's lane, the grown-up's car hops sideways into the lane the child left ("Yer değiştirdik!").
6. **Finish:** "Yaşasın! Bitiş çizgisi!". Then both cars jump and two hands ✋🤚 fly together between them: "ÇAK!", a clap, and "Çak bir beşlik!". With the tray but no grown-up car, a giant ✋ swoops down from the 🎩 to high-five the child's car.
7. **End:** in together mode, two "1" rosettes appear: one over the child's car and one over the grown-up's car (or over a big dancing 🎩 if there was no grown-up car). The voice says "Beraber birinci olduk!", then "Harikaydınız! Bir daha oynayalım mı?".

### 2.2 Grown-up (Sürpriz Ustası)
- **Open the tray:** tap the small 🎩 next to the progress bar **twice** (the first tap turns it into a red ❓ for 2.5 s, exactly like the existing 🏠). The tray slides down with 9 gag buttons, a 📣 horn and a 🚙 car toggle. While the car is on, 👤 (who am I) and 🎲 (new look) are added. On the laptop, click 🎩 twice with the trackpad once. After that the number-row keys work.
- **First press:** the road just ahead is quietly cleared (off-screen only), so the very first gag lands about 1.5 s ahead, exactly where the parent expects it (§4.4).
- **Tap a gag** (or press `1`-`9`): it drops in the child's lane at the right distance. All tray actions fire on pointerdown, so they are instant.
- **📣** (or `-`): grown-up horn, the duet partner of the child's 📯.
- **🚙** (or `0`): the grown-up's car comes in or drives off. **👤** (tap only): cycles 🧑 → 👨 → 👩; the car's flag changes and the voice greets the new name. **🎲** (or `=`): the car poofs into a new random look. Who and look are saved.
- **Feedback:** a cooldown wedge sweeps over each button. A blocked button shakes with a soft "boop". A little 🪄 wiggles over the button the auto-director just used, which teaches the buttons.
- **If the grown-up wanders off:** after 9 s with no grown-up input, the **auto-director** drops a gentle gag every 4-6 s. If the child pranks the grown-up's car while the grown-up is away, the director "takes revenge" 2.5 s later: the car honks and a soft gag lands in front of the child. Any grown-up input takes over again at once.

---

## 3. Integration with existing scenes, flow and systems

Flow is unchanged: **Title → Garage ⇄ WheelStudio; Garage → Drive → End**. Everything new lives in **Drive** and **End**, plus small additions to `Snd`, the particle system and `buildCourse`. **WheelStudio, Garage, Title, the input layer and the child's own physics code are not touched.**

| Existing piece | How this direction uses or changes it |
|---|---|
| `buildCourse()` | **Content and random draws unchanged.** It only tags objects with two inert fields: every event's objects share `g = x` (the event's start x; the opening star run gets `g = 700`), and the opening run plus the three forced events (gift, animal, ramp) get `keep: true`. That is about 5 lines: `const n0 = o.length;` before each event and a tagging loop after it. Thinning is done afterwards by `Usta.thinAhead()` (§4.4), so `buildCourse` takes no new argument. |
| `Drive.objs` (sorted by x; `collide` breaks at dx > 1100) | Gags are real course objects inserted with `insertObj(objs, o)` (splice at the sorted index). Removals use `Drive.objs = Drive.objs.filter(…)`. Both happen only from input handlers and from `Usta.update` (which runs before `collide`), never during iteration. Gag objects carry `usta:true`, `gag`, `ent` (entrance kind), `dur`, `ua` (age in seconds, **the single animation clock**) and optionally `ud` (stagger delay). |
| `Drive.collide` / `hit()` / `hitSpan()` | Gags are real `star`/`gift`/`paint`/`mud`/`banana`/`animal`/`ramp`/`balloons`/`gate` objects, so `collide`, `hit()` and `hitSpan()` work unchanged. `hitSpan` gets one hook line at its top, `Usta.span(o)`: it sets the voice quiet window (§4.11), and the gate re-styles the grown-up's car, the wash cleans it, and the finish starts the high-five. |
| `Drive.updateAnimal` | **Unchanged.** Walk-in is driven by `Usta.update` through `o.ua` (§4.3). A walk-in animal is in state `'idle'` from spawn, so honk and auto-jump always work. |
| `Drive.doHonk()` | Skips animals with `o.ua < FLY` (still in flight, invisible): one condition added to the existing `if`. Calls `Usta.kidHonk()` in both the countdown and the normal path. |
| `Drive.enter()` | Adds `Usta.reset(); this.prevLane = 1;` after `this.objs = buildCourse();`. |
| `Drive.update(dt)` | One line, `Usta.update(dt)`, right after `updateCarAnim(car, dt)` and before the countdown `return`, so the tray, entrances and the grown-up car's roll-in animate during the countdown too. One line, `Usta.collide2(dt)`, right after `this.collide(dt)`. **The child's lane, jump, ramp and wobble code is not touched**; the grown-up's car has its own ~30-line physics in `Usta` (§4.7). |
| `laneUp/laneDown` | Record `this.prevLane = this.lane` before changing. |
| `Drive.key(e)` | First line: `if (Usta.key(e)) return;`. It returns false whenever the tray is closed, so solo keys are byte-identical. |
| `Drive.click(p)` | After the 🏠 check: `if (Usta.click(p)) return;`. The 🎩 handle is always checked. Tray buttons, the prank button and the **grown-up car tap box** (§6.2) are checked only when visible. The box is clamped so it never overlaps the child's own-car honk box, so the child's rules (honk on own car, lane up/down, honk) follow unchanged for every other point. |
| `Drive.buttons()` | Appends `Usta.buttons()` (hover cursor on the laptop). |
| `Drive.draw()` | In the `vis` loop: `if (o.ua < FLY + (o.ud \|\| 0)) continue;` (course objects have `ua` undefined, so the test is false). Each of the three object draw calls is wrapped: `const w = Usta.introPre(o, sx); …draw…; if (w) ctx.restore();`. The two duplicated decal lists become one `const DECALS = ['paint','mud','banana','boost']`. The grown-up's car is pushed into the depth list next to the existing `list.push({ y: this.ly + 0.5, car: true })` as `{ y: p2.ly + 0.5, car2: true }`, and the list loop calls `Usta.drawCar2(t)` for it. In `drawObj`'s animal case, `drawAnimal(..., o.walk ? 'flee' : o.state, ...)` makes the legs run during the walk-in. |
| `Drive.drawHUD(t)` | The keyboard hint box is gated by `!Usta.open` (it sits at x 372..908, y 84..160, where the tray goes). `Usta.drawHUD(t)` (🎩, tray, prank button, 👆 hint) is drawn **before** the traffic light, so the light stays on top during the countdown. The 📯 button gets a yellow ring while `Usta.kidWin > 0`. |
| `End` | `enter()` reads `Usta.together()` and `Usta.p2.on`. Together mode draws two rosettes and runs its voice lines on an `End.update` timeline. Solo End is unchanged, including its `setTimeout` line. |
| `honk`, `updateCarAnim`, `emitTrail`, `drawCar`, `carTop`, `randomOther`, `newCar`, `WHEEL_R`, `addStar`, `poof`, `sparkle`, `confetti` | Reused. The grown-up's car uses a new `honkQuiet(c, x, y, s)` (horn + `text` particle, **no `comic`**), so it never steals the child's comic burst. |
| `Voice` / `say` | **Unchanged.** All new lines go through `Usta.say(t, kind)`, which applies the priority rules of §4.11 and then calls the normal `say`. |
| Particles | One new kind, `toss`: an emoji tweened along an arc with spin. It shares the `flystar` update branch (`if (p.kind === 'flystar' \|\| p.kind === 'toss')`, with arc height `p.arc ?? 120`). It is used for the gag flight, the child's pranks and the high-five hands. |
| `Snd` | New: `drop()`, `rise()`, `clap()`, `duet()`, `nope()`. |
| Input layer, `toLogical`, WheelStudio | **Unchanged.** See §6.3 for why no `pointerId` bookkeeping is needed. |
| Persistence | New `localStorage['cade-usta']`, which holds only who the grown-up is and their car's look (§7). |
| `window.__game` | Add `Usta`, `GAGS`, `buildCourse`. |

---

## 4. Mechanics and content

### 4.1 Timing constants (one place, used by every rule below)
- `FLY = 0.3` s: the icon's flight from the tray to the road. The object is not drawn and cannot be honked before this.
- **Entrance budget:** every gag object that sits at the gag's own x finishes its entrance within **0.85 s** of spawn (FLY + the longest `dur` 0.5 = 0.8 s; star shower 0.3 + 6×0.04 + 0.3 = 0.84 s). The ramp's arc stars sit further ahead and have their own, larger budget (below).
- **Lead:** `lead = clamp(max(Drive.speed, Drive.boostT > 0 ? 900 : 0) * 1.8, 650, 1050)`, measured from `cx = Drive.dist + CARX`.
- **Earliest possible contact:** the first trigger point of any gag is at dx = 135 (the animal auto-jump), and for decals at dx ≤ 60. At turbo (900 px/s, lead capped at 1050) the car reaches dx = 135 after (1050 − 135) / 900 = **1.02 s**. At base speed: (792 − 135) / 440 = 1.49 s. Worst case when a boost starts right after the spawn at base speed (speed eases 440 → 900 at rate 2.5/s): about 603 px are covered in 0.85 s, which is less than the 657 px needed, so the entrance still finishes first. **Invariant: 0.85 s < 1.02 s, so every gag has fully landed (and every animal is standing on the road, idle) before the car can touch it.**
- **Ramp arc stars:** they sit at `x + 230 + 85·i` (i = 0..3, as in `buildCourse`) and pop in with `ud = 0.25 + i·0.06`, `dur = 0.2`, so the last one finishes at 0.3 + 0.43 + 0.2 = **0.93 s**. The first one is reachable (star `hw` 42) only after (1050 + 230 − 42) / 900 = **1.37 s** at turbo. The ramp itself (`rise`, 0.35 s) is fully up at 0.65 s.
- During the countdown, speed is 0, so lead = 650. The gag lands and waits, and it arrives about 1.5-2 s after "Başla!".

### 4.2 Gag catalog (`GAGS`, one entry per line, data-driven)

| # | Key | Icon | Spawns (existing type) | `ent`, `dur` | Announce (`say:` property) | Button cd |
|---|---|---|---|---|---|---|
| 0 | 1 | 🐄 | `animal`, `kind` cycles through `ANIMALS` (inek first), `state:'idle'`, `st:0`, `walk:true` | `walk`, 0.45 | `'Bak, kim geldi?'` | 0.8 s |
| 1 | 2 | 🎨 | `paint`, `ci` ≠ `car.color` | `splat`, 0.3 | `'Boya geliyor!'` | 0.6 s |
| 2 | 3 | 🎈 | `balloons` (3 colors as in `buildCourse`) | `float`, 0.5 | `'Balonlar geliyor!'` | 0.6 s |
| 3 | 4 | 🛹 | `ramp` (`rise`, 0.35) + its 4 arc stars (`pop`, 0.2, staggered per §4.1), all with the same `g` | `rise` / `pop` | `'Rampa çıktı!'` | 1.2 s |
| 4 | 5 | 🌈 | `gate` span | `grow`, 0.45 | `'Sihirli kapı geliyor!'` | 8 s |
| 5 | 6 | 🍌 | `banana` | `spin`, 0.4 | `'Dikkat, muz!'` | 0.6 s |
| 6 | 7 | 🟤 | `mud` | `splat`, 0.3 | `'Çamur geliyor!'` | 0.6 s |
| 7 | 8 | ⭐ | 7 `star`s, h 45, zig-zag from the target lane, 75 px apart, `ud = i·0.04` | `fall`, 0.3 | `'Yıldız yağmuru!'` | 1.0 s |
| 8 | 9 | 🎁 | `gift` (color as in `buildCourse`) | `fall`, 0.35, with a bounce squash | `'Hediye geliyor!'` | 1.0 s |

The wash stays course-only (at 55% and 92%), so a mud gag still pays off later with "Tertemiz oldu!".

### 4.3 The single animation clock and the entrances
- `Usta.update(dt)` advances `o.ua += dt` for every Usta object still ahead (`!o.done`, dx > −400). This is the **only** clock that entrances read. It also runs during the countdown, so nothing freezes there. `o.st` and `o.t` keep their existing meaning (updated by `updateAnimal`), and entrances never read them.
- Progress: `k = clamp((o.ua − FLY − (o.ud || 0)) / dur, 0, 1)`. When `k` first reaches 1, `landFx(o)` fires once (sfx and particles) and `o.landed = true`.
- `Usta.introPre(o, sx)` returns false (no transform) if `!o.usta || o.landed || o.ent === 'walk'`. Otherwise it does `ctx.save()`, applies the transform about the ground point `(sx, LANES[o.lane])` (spans: `(sx, ROAD_BOT)`; stars: their drawn point `(sx, LANES[o.lane] − o.h)`), and returns true:
  - `fall`: translate y by `−400·(1−k)²`, plus a squash `scale(1+0.2·b, 1−0.2·b)` with `b = max(0, 1 − |k−0.9|·10)` near landing.
  - `float`: translate y by `−480·(1−easeOut(k))`, translate x by `sin(k·9)·14·(1−k)`.
  - `spin`: translate y by `−300·(1−k)`, rotate `(1−k)·4π` about the point 20 px above the ground.
  - `rise`: `scale(1, s)` with `s = k < 0.7 ? k/0.7·1.15 : 1.15 − 0.15·(k−0.7)/0.3`.
  - `grow` (gate): the same scale curve on y about `ROAD_BOT`, applied to both the back and the front span draws.
  - `splat`: `scale(s, s)` with the same overshoot curve.
  - `pop` (ramp arc stars): `scale(s, s)` with the same overshoot curve about the star's own point. `landFx` plays `Snd.ding` pitched up by `i` semitones (via `tone`), so the four pops make a rising "ding-ding-ding-ding" that ends on the ramp's flight path.
- **Walk-in animal (`ent:'walk'`) needs no canvas transform.** `Usta.update` writes the animal's existing fields directly while `o.state === 'idle' && o.walk`:
  - `o.dy = v0 · (1 − easeOut(k))`, with `v0 = 405 − LANES[0]` for lane 0, `712 − LANES[2]` for lane 2, and a random one of the two for lane 1 (the same verge offsets that `doHonk` uses for fleeing).
  - `o.hop = |sin(o.ua·14)| · 22 · (1 − k)`
  - At `k = 1`: `o.dy = 0`, `o.hop = 0`, `o.walk = false`, plus the animal sound.
  - `drawObj` passes `'flee'` to `drawAnimal` while `o.walk` is set, so the legs run (that is the only state with leg animation).
  - If the child honks during the walk-in, `doHonk` switches the animal to `'flee'`. The `o.state === 'idle'` guard stops the walk-in writes, and `updateAnimal`'s flee branch eases `o.dy` from wherever it is toward `fleeTo`. The movement stays continuous.
  - The auto-jump in `collide` keeps requiring `'idle'`, which holds from spawn. By the invariant in §4.1 the walk-in has finished before dx = 135.

### 4.4 Spawn rules, conflicts and thinning

**Thinning (`Usta.thinAhead(strip)`)** removes whole course groups (all objects with one `g`) that are completely off-screen ahead (every member has `o.x > Drive.dist + W + 40`), never spans, never `keep` groups, never Usta objects:
- `strip = true` also removes **every** such group whose first member is before `cx + 1700` (a "landing strip" of about 700 px just past the right edge of the screen).
- Beyond the strip (or everywhere, for `strip = false`), each non-star group is removed with p = 0.45. Star runs stay, so the road keeps its sparkle.
- **When it runs:** (a) in `Usta.reset()` with `strip = false`, if the tray is open and the grown-up has acted this session (`open && sessionAct`), so a together race starts with room for gags but still opens with today's gift, animal and ramp; (b) on the **first grown-up input of a race** (§6.4) with `strip = true`, if (a) has not already run. This is the usual first-time case (tray opened mid-race), and it means the very first gag lands on empty road about 1.5 s ahead. Because it only removes off-screen objects, nothing visibly vanishes. Opening the tray alone never thins anything.

**`Usta.spawn(gi, auto)`:**
1. **Blocked** (button shake, `Snd.nope()`, no voice) when any of these hold: `Drive.finished`; the button is cooling down; less than 0.4 s since the last spawn; 3 or more Usta gags still pending ahead (a ramp group or star shower counts once); or the final `wx > COURSE_LEN − 450`.
2. If this is a grown-up input (`!auto`), run the first-input rule of §6.4 first (which may call `thinAhead(true)`).
3. `lane = Drive.lane` (the **target** lane, so a lane change in progress is respected). `wx = cx + lead`.
4. **Footprint** of the gag: x range `[wx − 150, wx + ext]`, with `ext` 150 by default, 600 for a ramp (its arc stars) and 510 for the star shower. **Lanes:** a gag conflicts only with objects **in the same lane**. Two exceptions: the star shower zig-zags through all three lanes, so its footprint covers all lanes; a gate is a span, so its footprint also covers all lanes. **Spans always conflict across all lanes**: a gate gag needs no other span within ±650, and every other gag must stay out of ±320 of every span (the same spacing `buildCourse` uses).
5. **Resolve conflicts** (`Usta.place`):
   a. Try `wx`, `wx+120`, `wx+240`, `wx+360`. Take the first free footprint.
   b. If a span is the blocker, jump to `span.x + 320 + 150` once and recheck.
   c. If course objects still block: take the conflicting groups. If every member of every such group is off-screen, remove those groups whole (so a ramp never leaves orphan arc stars). If any member is visible, jump past the group's last member (`max x + 160`) and recheck once.
   d. Still blocked, or `wx > cx + 1700`: spawn blocked.
   With same-lane conflicts and the landing strip, (a) almost always succeeds at `wx` or `wx + 120`. A placement further ahead only gives the gag *more* time than §4.1 assumes.
6. Insert every object with `insertObj`. Set `ua = 0`, `usta = true`, `ent`, `dur`, `gag = gi`.
7. **Flight:** a `toss` particle with the gag icon (size 50, spin 6) goes from the tray button (or from the 🪄 ghost, for director gags) to the predicted landing point `(min(W − 40, wx − Drive.dist − Drive.speed·FLY), LANES[lane] − 60)`, with `dur = FLY`, `arc = 160`, plus `Snd.drop()`. (A gag shifted beyond the screen edge simply arrives already landed as it scrolls in. The v2 peek bubble is cut.)
8. **Voice:** the first gag of each race uses `Usta.say('Sürpriz geliyor!', 'host')`. Later gags use `Usta.say(GAGS[gi].say, 'ann')`. See §4.11.
9. Unless `auto`: `Usta.lastAct = Drive.t`.

### 4.5 Auto-director
- Runs only while `Usta.open && Usta.sessionAct` (a grown-up has pressed a tray input at least once this page session), `Drive.startT <= 0`, not finished, and `cx < COURSE_LEN − 1500`. **A child who opens the tray alone never starts the director.**
- **Idle director:** when `Drive.t − Usta.lastAct > 9` (a together race that starts with the tray open begins with `lastAct = −6`, so the director starts about 3 s into the race if the grown-up stays quiet), every `rand(4, 6)` s, if no Usta gag is pending, it picks from the weights `[[0,3],[2,2],[1,2],[7,2],[3,2],[5,1],[6,1],[8,1]]` (never the gate, never the same gag twice in a row). It sets that button's `ghost = 0.5` (🪄 wiggle) and spawns 0.3 s later with `auto = true`.
- **Revenge rule:** after a child prank (§4.8), if the grown-up has been idle for more than 9 s, it schedules one gag from `{paint, mud, banana, balloons}` 2.5 s later, preceded by a `honkQuiet` from the grown-up's car. There is at most one pending revenge.
- All timers live in `Usta.update`. There is no `setTimeout` for state.

### 4.6 Duet ("ÇİFT KORNA!")
- `Usta.parT` holds the `Drive.t` of the last grown-up honk. `Usta.kidT` holds the last **answer-eligible** child honk, and `Usta.kidPrev` the last child honk of any kind. `kidHonk()` is called from `doHonk` (both paths); `parentHonk()` from 📣 or the `Minus` key.
- **Answer rule (anti-spam):** a child honk is answer-eligible only if the previous child honk was at least **0.45 s** earlier (`Drive.t − kidPrev ≥ 0.45`). A child mashing the horn at 3-5 presses per second therefore never "answers"; a child who stops and honks once does.
- **Duet** when the child gives an eligible honk within **0.9 s after** a grown-up honk, or the grown-up honks within 0.9 s after an eligible child honk (the grown-up joining in). `duetCd` 2.0 s. Both timestamps are cleared after a duet. It also works during the countdown, which is a natural place for "1, 2, 3, together!".
- **Invitation:** `parentHonk` sets `Usta.kidWin = 0.9`. For that whole time `Drive.hornBtn.pulse = true`, and a yellow ring (r 52 → 70, alpha fading with `kidWin/0.9`) is drawn around 📯. An eligible `kidHonk` sets `parWin = 0.9`, and 📣 glows for that time.
- **Effect:** `comic('ÇİFT KORNA!', 640, 300, '#ff6fb5', 80)` (y 300 keeps it below the tray). 6 rainbow `ring` particles grow from the child's car top. 24 rainbow `star` particles burst outward, plus a `sparkle` at 📣. `Snd.duet()`, `Drive.addStar(CARX, carY − 100, 3)` and `Usta.say('Çift korna!', 'kid')`. The 3rd duet in a race instead does `comic('SÜPER İKİLİ!', …)`, `confetti(60)`, +5 stars and `Usta.say('Süper ikili!', 'kid')`.
- **Grown-up horn sound:** with the grown-up's car, `honkQuiet(Usta.car, …)` over that car. Without it, `Snd.horn(9)` plus a `text` particle `HORN_TXT[9]` under 📣. The grown-up horn does not scare animals. That stays the child's job.

### 4.7 The grown-up's car (M2)

**Screen position (the main v3 fix).** The grown-up's car is drawn at its own screen x: `X2 = CARX + p2.xo`, with `p2.xo` easing to **`FX = 240`** (so x = 540). Its world x for collisions is `cx + p2.xo`. Body half-widths are at most 170 px × lane scale (0.56 / 0.62 / 0.68 → 95 / 105 / 116 px). The two cars are never in the same lane, so the closest pair of edges is:

| Child lane | Grown-up lane | Child right edge | Grown-up left edge | Gap |
|---|---|---|---|---|
| 1 | 0 | 300 + 105 = 405 | 540 − 95 = 445 | 40 |
| 1 | 2 | 405 | 540 − 116 = 424 | 19 |
| 0 | 1 | 300 + 95 = 395 | 540 − 105 = 435 | 40 |
| 2 | 1 | 300 + 116 = 416 | 435 | 19 |
| 0 | 2 | 395 | 424 | 29 |
| 2 | 0 | 416 | 445 | 29 |

So the bodies never overlap in any pairing, and hats (drawn within the body width) never cover the other car. Exhaust trails may drift over each other, which is fine. The only moments of overlap are the 1-s roll-in (it overtakes from behind) and a lane-swap hop, both in motion.

- **State** `Usta.p2 = { on, lane, ly, z, vz, rot, flipV, wobT, onRamp, xo, leaving, swapSayT, tapT }`. Look: `Usta.car`, a `newCar()` loaded from `cade-usta` or randomized (every category random, `wheels` 0..9, `color ≠ car.color`). Who: `Usta.who` (0 = 🧑 arkadaş, 1 = 👨 baba, 2 = 👩 anne).
- **Own small physics, `Usta.p2Step(dt)` (≈ 30 lines, no change to the child's code):** lane easing `ly += (LANES[lane] − ly)·min(1, dt·11)`; jump with `GRAV`; `rot += flipV·dt` in the air; landing resets `z, vz, rot, flipV`, squashes the car and puffs dust at `X2` (a quiet `Snd.thud` only if `vz < −500`, and **no `Drive.shake`**); banana wobble from `wobT`; wheel spin `wheelA += Drive.speed·dt / (WHEEL_R[c.wheels]·s2)`; `xo` easing `xo += (target − xo)·min(1, dt·2.5)` with target `leaving ? 1400 : FX`; `updateCarAnim(Usta.car, dt)` and `emitTrail(Usta.car, X2, Y2, s2, dt, Drive.speed)` (no random farts). This duplicates about 15 lines of the child's logic on purpose: the child's code stays byte-identical, so solo play cannot regress.
- **Join** (🚙 / `Digit0`, cooldown 1.5 s): lane = a free lane next to the child's (else the other free one), `xo = −520` easing to 240 (it overtakes in about 1.2 s), `Snd.whoosh()`, `Usta.say(USTA_SAY['join' + who].say, 'host')`. The first time per page session, `Usta.hintT = 2.0` then gives `Usta.say(USTA_SAY['hint' + who].say, 'host')`, and for 4 s the car wiggles, the prank button pulses and a 👆 emoji (size 56) bobs over the car. **Leave:** `leaving = true`, `xo` eases to +1400, then `on = false`, with `Usta.say('Görüşürüz!', 'ann')`.
- **Identity:** `Usta.drawCar2` draws a shadow ellipse and `drawCar(Usta.car, X2, Y2, s2, { t, rot })`, then a **flag**: a 4-px OUT pole at `X2 − 118·s2` from `Y2 − 80·s2` up to `Y2 − 240·s2`, with a white pennant (waving `sin(t·6)`) carrying the who emoji (👨/👩/🧑, size 32). The flag is the grown-up's mark everywhere: on the road, in the End, and as a badge on the 🚙 tray button.
- **👤 (tap only):** cycles `who`, `poof` over the flag, a `honkQuiet`, and (car on) `Usta.say(USTA_SAY['join' + who].say, 'host')`, so the grown-up hears the new name. Saved.
- **🎲 / `Equal`:** with the car on: `poof` over it, `Snd.magic()`, re-roll about 85% of the categories of `Usta.car` (wheel guard, `color ≠ car.color`), `Usta.say(pick(['Abrakadabra!', 'Vay canına!']), 'host')` (both lines already exist as mp3s). With the car off: the stored look is re-rolled and the 🚙 icon poofs. Saved.
- **Lanes:** each frame, if `Drive.lane === p2.lane`, p2 moves to `Drive.prevLane` (or the other free lane) with a sideways hop (`vz = 520`, `Snd.boing`), and `Usta.say('Yer değiştirdik!', 'ann')` at most every 6 s. The child's lane is never the grown-up's lane, so gags dropped in the child's lane are never taken by the grown-up's car.
- **Across races:** `Usta.reset()` (in `Drive.enter`) keeps `p2.on` if it was on and not leaving. The car then **starts the race already in place**: `xo = FX`, `lane = p2.lane === 0 ? 0 : 2` (its old side if possible, since the child always starts in lane 1), `z = vz = rot = 0`, `Usta.car.mud = []`, waiting at the traffic light with the child. There is no roll-in and no join line; at "Başla!" it gives one `honkQuiet`. If it was leaving, `p2.on = false`. `Usta.raceEnd()` (called from `End.enter`) turns the car off together with the tray only when the race had no grown-up input (§6.4).
- **`Usta.collide2(dt)`** (called after `collide`, so not during the countdown): `cx2 = cx + p2.xo`; loop over `Drive.objs` (`dx2 = o.x − cx2`; `dx2 > 200` → break; `dx2 < −200`, `done` or `span` → continue). `laneHit2 = |p2.ly − LANES[o.lane]| < 46`. Reactions use sfx plus `text` particles, **no voice and no `comic`**:
  - star (height window vs `p2.z`) → `Snd.ding`, `Drive.addStar` (one shared team counter)
  - paint / mud / banana → `Usta.p2Fx('paint' | 'mud' | 'banana')`, **the same function the child's pranks use** (§4.8): new color with splash / blobs into `Usta.car.mud` (max 40) / `wobT = 1.3` with `Snd.wiu`
  - gift, balloons, boost → one shared reaction: `poof`, a hop (`vz = 420`), `Snd.pop`; gift also re-rolls two categories (wheel guard), balloons give +3 shared stars
  - idle animal at `dx2 < 135` → `vz = 720`, the animal goes `'duck'` (`o.done = true`), `Snd.boing` plus the animal sound
  - ramp → a 10-line copy of the ride: while `laneHit2 && −len ≤ dx2 ≤ 0`, `z = rh·(−dx2/len)`, `onRamp = o`; past `−len`: `o.done = true`, `vz = 980`, `flipV = TAU / (2·980/GRAV)`, `Snd.whee()`
- **Spans:** `Usta.span(o)` from `hitSpan`: gate → every category of `Usta.car` re-rolled (with the wheel guard) plus a `poof`; wash → `Usta.car.mud = []` plus bubbles; finish → `Usta.finish()`.

### 4.8 Child's prank (M2, the role reversal)
- **`PRANKS = ['mud', 'paint', 'banana']`** with icons 🟤 🎨 🍌 and comics `'ÇAMUR!'`, `'ŞLAP!'`, `'KAYDI!'`. The voice lines live in `USTA_SAY` (§5), keyed by prank and who, for example `mud1: { say: 'Baban çamur oldu!' }`.
- **Three ways to throw, all equivalent:**
  1. **Tap the grown-up's car** (primary): the tap box of §6.2.
  2. The pink **prank button** `Usta.prankBtn = new Button({ x: 82, y: 512, r: 50, bg: '#ff6fb5' })`. Its `drawIcon` draws the next prank's icon at size 56 plus a tiny flag badge with the who emoji. When `!touchUsed`, it also gets a `⏎` key-cap badge.
  3. `Enter` while the grown-up's car is on.
- All three are active only while `p2.on && !p2.leaving && p2.xo > 150 && !Drive.finished`. The next prank's icon also floats (size 34, bobbing) just above the child's car, so the child sees what they are holding.
- **Throw:** cooldown **0.9 s** (pie wedge on the button). A `toss` particle, icon size 54, from the child's car `(CARX + 70, carY − 120·s)` to the grown-up's car top `(X2, Y2 − 130·s2)`: a clear sideways throw of about 240 px across the lanes, with `arc = 140`, `dur = 0.45`, `spin = 10`, plus `Snd.swish()`. `onDone` calls `Usta.prankHit(kind)` (if the scene changes, `go()` clears particles, so `onDone` never fires: harmless).
- **During the cooldown**, a tap on the car or the button is never dead: the grown-up's car hops (`vz = 300`) and gives a `honkQuiet` (at most every 0.4 s).
- **`prankHit`** works on the car's *current* position: `Usta.p2Fx(kind)` plus the **reaction**: `Usta.car.squash = 0.6`, `hatV += 900` (the hat flies), a protest `honkQuiet` 0.25 s later (an `Usta.update` timer), `comic(comicText, X2, Y2 − 170·s2, …)` (the child made this happen, so it uses the child's comic channel), `Drive.addStar(…, 1)`, and the voice `Usta.say(USTA_SAY[kind + who].say, 'kid')`, except every 3rd prank, which uses `Usta.say('Şakacı seni!', 'kid')`. The prank index then advances (🟤 → 🎨 → 🍌).
- This is not an object on the road, so it never conflicts with the course, needs no lane logic, and pays off in under half a second.

### 4.9 Finish high-five (timeline driven by `Drive.finT`, in `Usta.update`)
- `Usta.finish()` sets `Usta.hi = { stage: 0 }` when `Usta.together()`.
- **With the grown-up's car:** at `finT ≥ 1.2`, both cars jump (`vz = 560`) and the grown-up's car leans back toward the child (`xo` eases 240 → 200, still clear by the table in §4.7). At `finT ≥ 1.45`, two `toss` particles ✋ (from the child's car top) and 🤚 (from the grown-up's car top) fly to the midpoint above the gap (x ≈ 420), `dur 0.15`. At `finT ≥ 1.6`: `Snd.clap()`, `sparkle`, 12 star particles and a `text` particle 'ÇAK!' (size 70). At `finT ≥ 1.8`: `Usta.say('Çak bir beşlik!', 'host')`, after the finish quiet window (§4.11) so "Yaşasın! Bitiş çizgisi!" is never cut off.
- **Tray only:** at `finT ≥ 1.25` a giant ✋ `toss` (size 90, `dur 0.35`) flies from 🎩 (960, 44) to just above the child's car. At 1.6 the same clap and 'ÇAK!', at 1.8 the same voice.
- **About the tie:** the grown-up's car is 240 px ahead, so it passes the line about half a second before the child. It triggers nothing there: no fanfare, no text, no voice. The fanfare, confetti and "Yaşasın!" happen when the child crosses, and they celebrate both cars. The game has no ranking or position display anywhere (the progress bar shows only the child's mini car), so "ahead" never means "winning". The End then crowns both.
- `go(End)` stays at `finT > 3.2`.

### 4.10 End "beraber birinci"
- `End.enter`: `this.together = Usta.together(); this.duo = this.together && Usta.p2.on; this.vo = 0;`. The existing `setTimeout(say('Harikaydın!...'))` runs only when `!this.together`. Then `Usta.raceEnd()` runs the auto-close rule (§6.4) and saves `cade-usta`.
- `End.update`: if `together`, at `t ≥ 0.4` `say('Beraber birinci olduk!', true)`, and at `t ≥ 2.6` `say('Harikaydınız! Bir daha oynayalım mı?', true)`. When `duo`, it also runs `updateCarAnim(Usta.car)`, the wheel spin and the beat squash.
- `End.draw` when `together`: the child's car at (520, 530) scale 0.8. The partner is either the grown-up's car at (800, 534) scale 0.7, dancing in the opposite phase, with its flag, or a big 🎩 emoji (size 120) bouncing at (800, 470). A "1" rosette goes over each (circle + two ribbon tails + `text('1')`, y 360). If `Usta.duets > 0`, a 📯📯 × N badge appears at (960, 240). The trophy and the star counter are unchanged. A tap in the middle honks the car on that side.

### 4.11 Voice priority policy (`Usta.say(t, kind)`)
The existing `Voice` stays untouched; every new line goes through this one gate, which then calls the normal `say`. Three kinds:

| Kind | Used for | Rule |
|---|---|---|
| `'ann'` | gag announcements, "Görüşürüz!", "Yer değiştirdik!" | Non-forced. Skipped during a quiet window, and skipped if any line started less than **1.5 s** ago (`performance.now() − Voice.last < 1500`). Announcements therefore never collide with `hit()` lines like "Hoop!" or "Iyy, çamur!": they yield. |
| `'kid'` | duet, prank lines, "Şakacı seni!" (moments the child caused) | Forced, but only outside a quiet window and at least **1.8 s** after the previous forced Usta line. Otherwise the line is dropped: the comic, sfx and stars still carry the moment. |
| `'host'` | "Sürpriz Ustası geldi!", "Sürpriz geliyor!", join, hint, 👤 greeting, 🎲 line, "Çak bir beşlik!" | Forced under the same two conditions. If they fail, the line goes into a single pending slot (the newest wins) and is spoken as soon as both conditions hold, or dropped if it is more than 2.5 s old. |

- **Quiet windows** (narrative lines are never cut by Usta lines): `Usta.span(o)` sets `quietT` to 2.4 s for a gate ("Sihirli kapı! Her şey değişti!"), 1.4 s for a wash and 1.7 s for the finish. The start is quiet while `0.3 ≥ Drive.startT > −1.5`, which covers "Başla!" or the theme line.
- Spacing of forced Usta lines (1.8 s) plus the 0.9 s prank cooldown means a child pranking as fast as possible hears every second prank line, and every prank still gets its comic and splat.
- The method is declared as `say(t, kind) {` inside `Usta`, so gen-voice's "starts with `say(t`" exclusion skips the definition line. Calls with literals, like `Usta.say('Çift korna!', 'kid')`, contain `say(` and are discovered by rule 1 (the lowercase `'kid'` is ignored).

---

## 5. New voiced Turkish lines (exact text) and SFX

All spoken strings are single-quoted, start with an uppercase Turkish letter, and contain no apostrophes. Each literal `Usta.say('…')` or `say('…')` sits on its own line. Gag lines are `say:` properties on their own `GAGS` lines, and the who-dependent lines are `say:` properties in `USTA_SAY`, **one entry per line** (scanner rule 2), for example:

```js
const USTA_SAY = {
  join0: { say: 'Arkadaşın geldi!' },
  join1: { say: 'Baban geldi!' },
  join2: { say: 'Annen geldi!' },
  // … hint0-2, mud0-2, paint0-2, banana0-2
};
```

No `comic('…')` is ever on a `say(` line.

| Line | When | Kind |
|---|---|---|
| `Sürpriz Ustası geldi!` | the tray opens (first time per page session) | host |
| `Sürpriz geliyor!` | first gag of each race | host |
| `Bak, kim geldi?` | 🐄 gag | ann |
| `Boya geliyor!` | 🎨 gag | ann |
| `Balonlar geliyor!` | 🎈 gag | ann |
| `Rampa çıktı!` | 🛹 gag | ann |
| `Sihirli kapı geliyor!` | 🌈 gag | ann |
| `Dikkat, muz!` | 🍌 gag | ann |
| `Çamur geliyor!` | 🟤 gag | ann |
| `Yıldız yağmuru!` | ⭐ gag | ann |
| `Hediye geliyor!` | 🎁 gag | ann |
| `Çift korna!` | duet | kid |
| `Süper ikili!` | 3rd duet in a race | kid |
| `Arkadaşın geldi!` / `Baban geldi!` / `Annen geldi!` | car joins, or 👤 changes who | host |
| `Ona şaka yap!` / `Babana şaka yap!` / `Annene şaka yap!` | 2 s after the first join in a page session | host |
| `Arkadaşın çamur oldu!` / `Baban çamur oldu!` / `Annen çamur oldu!` | child's mud pie hits | kid |
| `Arkadaşın boyandı!` / `Baban boyandı!` / `Annen boyandı!` | child's paint bucket hits | kid |
| `Arkadaşın kaydı!` / `Baban kaydı!` / `Annen kaydı!` | child's banana hits | kid |
| `Şakacı seni!` | every 3rd child prank | kid |
| `Görüşürüz!` | the grown-up's car leaves | ann |
| `Yer değiştirdik!` | child steers into the grown-up's lane (max every 6 s) | ann |
| `Çak bir beşlik!` | finish high-five | host |
| `Beraber birinci olduk!` | End, together mode | End (forced) |
| `Harikaydınız! Bir daha oynayalım mı?` | End, together mode | End (forced) |

That is **34 new lines**. Their slugs were checked against the 126 files in `voice/`: none exists yet, and none collide with each other (for example `harikaydiniz-…` ≠ `harikaydin-…`, `baban-geldi` ≠ `babana-saka-yap`). The 🎲 line reuses the existing `Abrakadabra!` and `Vay canına!`. After implementing, `node tools/gen-voice.mjs --missing` must list exactly these 34. Generate them with `FAL_KEY=... node tools/gen-voice.mjs` (or the fal MCP), or list them in the commit body.

Comic and decoration text (not voiced, never on a `say(` line): `ÇİFT KORNA!`, `SÜPER İKİLİ!`, `ÇAK!`, `KAYDI!` (`ÇAMUR!` and `ŞLAP!` already exist).

**New SFX in `Snd`** (each 1-4 lines from `tone`/`noise`):
- `drop()`: a slide whistle, sine 1500 → 520 over 0.28 s with a light vibrato. Used for gag flights.
- `rise()`: sine 180 → 720 over 0.18 s, plus a short triangle 900 Hz blip (the spring-up "boing-up").
- `clap()`: two bandpass noise bursts (1800 Hz, q 1.2, 0.05 s) 45 ms apart, plus `ding` at +0.08 s.
- `duet()`: a triangle arpeggio C6-E6-G6-C7, 0.07 s apart and 0.18 s each, then a soft high shimmer (highpass noise at 6000 Hz, 0.25 s).
- `nope()`: square 260 Hz then 200 Hz, 0.07 s each, vol 0.05. Soft, meant for the grown-up only.

Landing and reaction sounds reuse existing ones: `splash`, `squelch`, `magic`, `boing`, `pop`, `ding` (pitched for the arc-star pops), `thud`, `swish`, `wiu`, `whee`, `whoosh`, and the animal sounds.

---

## 6. UI and controls (zero reading)

### 6.1 Layout (logical 1280×720)
- **🎩 handle:** `Button {x: 960, y: 44, r: 28, bg: '#7048e8'}`, between 🏁 (≈ 902-922) and 🏠 (1098). It is grown-up-sized on purpose and does **not** pulse, so it does not invite the child. The first tap arms it (red ❓ for 2.5 s, `Snd.click`) and the second opens or closes the tray, the same idiom as 🏠. When the tray is open, the handle shows a small ✖ badge.
- **Tray panel:** a rounded rect x 124 → 1102, y 86 → 158, fill `rgba(60,30,90,0.55)`, OUT stroke 4, with twinkling dots along its edge. It slides down from y −120 over 0.25 s (`trayK` easing). It clears the star counter (its number is left-aligned at x 104, bottom ≈ 83), 🏠/⛶/🔊 (bottom 72) and every child button. The traffic light (x 580..700, y 100..400) is drawn over it during the countdown.
- **Gag buttons:** 9 `Button`s, r 34, y 122, x = 166 + i·74 (166…758; the 74 px pitch clears the 1.08 hit slack, 2·34·1.08 = 73.4). Colors: cow `#f8f9fa`, paint `#ff6fb5`, balloons `#74c0fc`, ramp `#e0a15a`, gate `#b197fc`, banana `#ffe066`, mud `#a0703a`, stars `#ffd43b`, gift `#ff8787`. Overlays: dark cooldown pie, 🪄 ghost, 45% alpha after the finish, a shake (`wiggle`) when blocked.
- **📣** r 34 at (840, 122), bg `#ffa94d`, glowing while `parWin > 0`. **🚙** r 34 at (914, 122), bg `#69db7c`, with a ✓ badge when on and a tiny flag badge with the who emoji. **👤** r 34 at (988, 122), bg `#f8f9fa`, showing 🧑/👨/👩, and **🎲** r 34 at (1062, 122), bg `#ffd43b`. 👤 and 🎲 are visible only while the car is on.
- **Child's prank button:** r 50 at (82, 512), only with the grown-up's car. Its distance to 📯 (82, 640) is 128 > 50 + 52. It is far from ⬆️⬇️ (1196, 518/640).
- **📯 duet ring:** drawn around (82, 640) while `kidWin > 0`.

### 6.2 Touch (iPad)
- Every Usta control acts on **pointerdown** (`Usta.click`): 🎩, the gag buttons, 📣, 🚙, 👤, 🎲, the prank button and the car tap box. Each one gets `press = 1` (or a squash for the car), its sfx and its particle response at once.
- **Grown-up car tap box** (checked in `Usta.click`, before the child's rules in `Drive.click`): `max(CARX + 125, X2 − 135) ≤ p.x ≤ X2 + 135` and `Y2 − 210·s2 ≤ p.y ≤ p2.ly + 25`. That is about 255 × 160-200 px, a huge target. The left clamp at 425 keeps it strictly to the right of the child's own-car honk box (`|p.x − CARX| < 150·s·1.2`, so x ≤ 422 at most). A tap on the child's own car still honks, and taps anywhere else still follow the old lane-up / lane-down / honk rules. Only the area that visibly *is* the grown-up's car now throws instead of changing lanes; the ⬆️⬇️ buttons and taps on open road still change lanes.
- Taps that hit none of these fall through to the child's unchanged rules. If the child taps a tray gag button themselves, it just drops that gag on their own car. That is harmless and fun, and it is rate-limited.

### 6.3 Two people touching at once, and why no pointerId bookkeeping is needed
The canvas already turns **every** `pointerdown` into its own independent `scene.click(p)`. iOS delivers one `pointerdown` per finger, `gesturestart` is already prevented, and `touch-action: none` is set. Because this design has **no drags** and never reads `move`/`up`, two simultaneous taps (the grown-up on the tray, the child on ⬆️ or on the grown-up's car) are two independent clicks that cannot interfere. So `toLogical`, the window `pointerup` handler and WheelStudio stay untouched, and there is zero regression risk there. Acceptance criterion 4 tests two pointers with different `pointerId`s in the same frame.

### 6.4 Keyboard (laptop), and what counts as a grown-up

Dispatched by `e.code`, ignoring `e.repeat`, **only while the tray is open**:

| Who | Key (`e.code`) | Action |
|---|---|---|
| Grown-up | `Digit1`-`Digit9`, `Numpad1`-`9` | gags 1-9 |
| Grown-up | `Digit0`, `Numpad0` | car on/off 🚙 |
| Grown-up | `Minus`, `NumpadSubtract` (the key right of 0) | grown-up horn 📣 |
| Grown-up | `Equal`, `NumpadAdd` (the next key) | new look 🎲 (car on) |
| Child | `Enter` (only while the grown-up's car is on) | prank throw |
| Child | arrows, W/S, A/D, space, every other key | unchanged |

👤 is tap/click only: it is a one-time setup that is saved. `e.code` is physical, so the keys work on Turkish Q and F layouts. With the tray **closed**, `Usta.key` returns false for everything, so digits, `-`, `=` and Enter honk exactly as today. The tray is opened only with the 🎩 double tap or double click.

**Grown-up input (`act`)** is: any gag button or gag key, 📣/`Minus`, 🚙/`Digit0`, 👤, 🎲/`Equal`. **Not** grown-up input: opening or closing the tray with 🎩, director spawns, the child's pranks and taps. On the first grown-up input of a race, `act = true`, `sessionAct = true`, and `thinAhead(true)` runs unless the race was already thinned at start (§4.4).

- `Usta.together()` = `open && (act || p2.on)`. The car counts because the grown-up put it there (it is only carried into a race from a race that had grown-up input).
- **Auto-close rule:** `Usta.raceEnd()` (from `End.enter`) closes the tray and turns the car off if the race finished with `act` false. Together with session-only state (§7), the outcomes are:
  - Child opens the tray alone and never presses a tray button: the tray is visible, nothing else changes (no director, no thinning), the End is the normal solo "Harikaydın!", and the tray closes.
  - Child opens the tray and presses tray buttons themselves: they drop gags on their own car, the race counts as together (we cannot tell who pressed), the End says "Beraber birinci olduk!". This is harmless and happens only after a deliberate double tap.
  - Grown-up plays, then leaves: the next race starts with the car in place and the director covers. If nobody presses anything that race, it ends as together (the car was there) and then everything closes. The race after that is plain solo.

---

## 7. Persistence

`localStorage['cade-usta']`, JSON, read once at definition (`Usta.load()`, IIFE-style like `cwLoad`) and written at `Usta.raceEnd()`, on car creation, on 👤 and on 🎲, all inside try/catch:

```js
{ v: 1, who: 0, car2: { color, pattern, body, wheels, face, hat, trail, horn } }
```

- Validation: `who` must be 0, 1 or 2 (else 0). Each car field must be an integer within `CAT[key].names.length` (and `COLORS.length` for color). `wheels` must be ≤ 9. Any invalid field falls back to a random value, and a bad or missing object falls back to a fresh random car.
- **Session-only (memory, never on disk):** `open`, `sessionAct`, `p2.on`, `greeted` ("Sürpriz Ustası geldi!" once per page load), `hinted` (the hint line once), duet counts, cooldowns, the prank index. A reload always starts in plain solo mode.
- About 130 bytes, so there is no quota concern.

---

## 8. Edge cases

1. **Child alone taps 🎩 once:** it shows ❓ for 2.5 s with a click and nothing else. Twice: the tray opens, and nothing else changes until a tray input (§6.4).
2. **Gag spam:** per-button cooldowns, a 0.4 s global gap and at most 3 pending gags. Blocked presses give a shake plus `nope`, with no voice.
3. **Gate spam:** 8 s cooldown, ±650 span spacing, and never within 450 of the finish.
4. **Spawn on top of course objects:** same-lane conflicts only (except spans and the star shower), the landing strip on the first input, shifts of +120/240/360, then group-aware removal (only fully off-screen groups) or a jump past the group. A ramp's arc stars are never orphaned.
5. **Spawn near or after the finish:** blocked. The tray dims after the finish.
6. **Turbo:** the timing invariant in §4.1 (0.85 s entrance < 1.02 s earliest contact; ramp arc stars 0.93 s < 1.37 s).
7. **Countdown:** gags may be dropped. They land at lead 650 and play their entrance (the `ua` clock runs). Walk-in animals finish walking. Duets work. The car rolls in (or is already waiting). No collisions run until "Başla!", and no Usta line cuts "Başla!" (quiet window).
8. **Honk during a gag's flight (`ua < FLY`):** invisible animals are skipped by `doHonk`. A later honk scares them as usual.
9. **Lane change in progress at spawn:** uses `Drive.lane`, the target lane.
10. **Child steers into the grown-up's lane:** resolved every frame in `Usta.update`, where the car always yields with a sideways hop. The swap voice is throttled.
11. **Grown-up's car on a ramp during a lane hop:** it has its own `onRamp`. If it leaves the lane mid-ramp, `onRamp` is cleared when `laneHit2` fails, and its own gravity brings it down. The child's ramp state is separate and untouched.
12. **Course stars in the grown-up's lane:** it collects them for the shared team counter (they fly to the child's counter).
13. **Prank in flight when the car leaves or hops:** `prankHit` uses the car's current position. If `p2.on` is false it just does a `poof` in mid-air.
14. **Tap on the car while it rolls in or out (`xo ≤ 150` or leaving):** the tap box is inactive, so the tap follows the child's normal rules.
15. **The grown-up's car and the custom wheel:** `wheels === 10` is never allowed on `Usta.car` (guard on random, gift, gate and 🎲 re-rolls), because `customRide` and `artCv` belong to the child's wheel.
16. **`comic()` is single-burst:** the grown-up car's own events and the grown-up horn use `text` particles. Only child-caused moments (pranks, duets) use `comic`.
17. **Voice overlap:** handled by §4.11. Narrative lines (gate, wash, finish, Başla, End) are never cut by an Usta line.
18. **Home 🏠 mid-race / scene change:** `go()` wipes particles, which drops pending tosses and their `onDone`. `Usta.reset()` in `Drive.enter` clears timers, the high-five, revenge, the pending voice slot and the windows. No `setTimeout` changes state.
19. **Muted or no Turkish voice:** everything visual still works.
20. **localStorage blocked:** defaults are used, nothing throws.
21. **Portrait iPad:** unchanged rotate hint. All new UI is inside 1280×720.
22. **Performance:** +1 `drawCar` per frame (the grown-up's car), up to 13 more Button draws while the tray is open, and a few particles. No `shadowBlur`.

---

## 9. Implementation plan (ordered, one focused session)

Estimated new or changed code: **≈ 500 lines** in `game.js` plus about 25 lines of README. The game is playable after every step. The child's existing physics, `collide`, `hit`, `buildCourse`'s content, `Voice` and the input layer are not modified, apart from the one-line hooks listed in §3.

### MVP: tray, gags, director, duet, finish and End (steps 1-6, ≈ 350 lines)
This is a complete, shippable feature without the grown-up's car. The finish high-five (tray variant) and the together End with the 🎩 partner are part of it.

1. **SFX + `toss` particle (≈ 22 lines; `Snd` ~100-261, `updateP`/`drawP` ~416-529).** Add `drop, rise, clap, duet, nope`. In `updateP` extend the flystar branch to `toss` with `p.arc ?? 120`. In `drawP` add `case 'toss'` (save, translate, rotate `p.t * (p.spin || 0)`, `emoji(p.str, 0, 0, p.size)`, restore).
2. **`buildCourse` tags + `insertObj` (≈ 8 lines; ~2323).** `g` on every event's objects, `keep` on the opening run and the three forced events. `function insertObj(objs, o) { let i = objs.findIndex(q => q.x > o.x); if (i < 0) i = objs.length; objs.splice(i, 0, o); }`.
3. **`GAGS`, `USTA_SAY` + `Usta` core (≈ 170 lines).** A new section `// ============================================================ Sürpriz Ustası (birlikte oyun)` after the `_du` monkey patch (~2873) and before `End`, referencing Drive only at runtime.
   - `const FLY = 0.3, FX = 240;`, `const GAGS = [ … ]` and `const USTA_SAY = { … }`, one entry per line.
   - `const Usta = { open:false, act:false, sessionAct:false, lastAct:-6, who:0, greeted:false, btns:[], … load(), save(), reset(), toggleTray(), together(), raceEnd(), grown(), thinAhead(strip), spawn(gi, auto), place(...), build(gi, lane, wx), introPre(o, sx), landFx(o), say(t, kind), update(dt) }`. `grown()` is the single "a grown-up pressed something" function of §6.4.
   - `update(dt)`: tray easing, arm timer, cooldowns and ghosts, the `ua` clock with walk-in writes and landing effects, the director, duet windows, quiet window and the pending voice slot, scheduled actions (revenge, protest honk, hint line), and the high-five timeline.
4. **Drive hooks + tray UI + input (≈ 90 lines).**
   - `enter`, `update` (`Usta.update(dt)` after `updateCarAnim`), `doHonk` (FLY skip + `Usta.kidHonk()` in both paths), `laneUp/Down` (`prevLane`), `key`, `click`, `buttons`, `hitSpan` (`Usta.span(o)`).
   - `draw`: `DECALS` constant, skip in-flight objects, the `introPre` wrap at the three draw sites, `drawObj` leg state for walk-in.
   - `drawHUD`: hint box gated, `Usta.drawHUD(t)` before the traffic light, 📯 ring.
   - `Usta.drawHUD`, `click`, `key`, `buttons` as specified in §6.
5. **Duet (≈ 30 lines).** `kidHonk` (with the 0.45 s eligibility rule), `parentHonk`, `duet()`, the windows and the 📣 button.
6. **Finish high-five + End together (≈ 45 lines).** `Usta.finish()`, the timeline stages, the tray-only ✋, and the `End.enter/update/draw/click` changes with the 🎩 partner and rosettes. `raceEnd()` auto-close.

**Check after the MVP:** a solo race is unchanged; opening the tray alone changes nothing; a tray race works end to end with all 9 gags, the first-input landing strip, the director, the duet, the ✋ high-five and the together End.

### M2: the grown-up's car and the child's prank (steps 7-9, ≈ 150 lines)
7. **The grown-up's car (≈ 95 lines).** `Usta.p2`, `toggleCar()`, `p2Step(dt)`, the roll-in and roll-out, the yield logic, carry-over in `reset()`, `collide2` with `p2Fx` and the ramp copy, `honkQuiet`, `drawCar2` with the flag, the depth-list entry, `Usta.span` gate and wash, the 🚙/👤/🎲 buttons and `Digit0`/`Equal`, and the `cade-usta` save with `who`.
8. **Child prank (≈ 40 lines).** `PRANKS`, the tap box, `prankBtn`, `Enter`, the throw toss, the floating next-prank icon, `prankHit` with the reaction, the cooldown hop, the 👆 hint, and the director's revenge rule.
9. **Two-car high-five + End duo (≈ 15 lines).** The two-hand stage and the End partner car with its flag.

### Wrap-up
10. **Debug hook, README, voices.** Add `Usta, GAGS, buildCourse` to `window.__game`. The README (Turkish) gets a section "👨‍👧 Birlikte oyna: Sürpriz Ustası" covering the 🎩 double tap, the tray buttons, the keys table, the duet, the grown-up's car (👤, 🎲, tap it to prank), "beraber birinci", and the auto-close rule. Run `node tools/gen-voice.mjs --missing` (expect 34 lines), then generate them or list them in the commit body. There are no new asset folders, so `pages.yml` is unchanged.

**Cut (not stretch, just gone):** drag-to-lane, WheelStudio and input `pointerId` changes, the friend-car lane buttons and 🔀 swap (auto-yield is enough now that the cars have their own x), the progress-bar mini friend car, the 🎩 discovery pulse, the Garage friend-car editor (replaced by 👤 + 🎲), the v2 `stepRider`/`rideRamp` refactor of the child's physics, and the v2 peek bubble.

**Testing workflow** (Playwright + `window.__game`, watch the console because `frame()` swallows errors):
- `__game.go(__game.Drive)`, open the tray with `__game.Usta.toggleTray()`, dispatch `KeyboardEvent`s with `code`, step frames, then assert on `Drive.objs` (sorted, `ua`, `landed`), `Usta`, the star counts, and screenshots.
- Solo regression: with a fixed `Math.random` seed stub, compare `buildCourse()` output (minus `g`/`keep`) before and after the change, and record the child's `z`, `rot`, `ly` over a scripted race (lane changes, a ramp, a banana) before and after; they must match.
- Turbo test: set `Drive.boostT = 5`, `Drive.speed = 900`, spawn each gag, step at dt 1/60, and assert `o.landed` (and `!o.walk` for animals) before `o.x − cx < 135`, and every arc star landed before `o.x − cx < 42`.
- Overlap test: with the car on, for each of the 6 lane pairings, draw a frame and check the two cars' body bounding boxes (`X ± 170·s`) do not intersect.
- Two-pointer test: dispatch two `PointerEvent('pointerdown', { pointerId: 1 / 2, pointerType: 'touch' })` on the canvas in the same task (a tray gag + ⬆️, and a tray gag + a tap on the grown-up's car), then assert both effects.

---

## 10. Acceptance criteria

**Solo unchanged**
1. With the tray never opened (fresh load), a full race shows no console errors. Digits, `-`, `=` and Enter honk as before. `buildCourse()` produces today's objects (only the inert `g`/`keep` fields are added). There is no director and no tray, and the keyboard hint box appears as before. The only new visible element is the 🎩 at (960, 44). One tap on 🎩 only shows ❓.
2. The child's jumps, landings (thud, dust, shake), ramp launches with a full flip, and banana wobble behave exactly as before; the code for them is not modified.
3. Opening the tray (double tap) without pressing any tray input: no gags appear, no course objects are removed, the End says "Harikaydın! Bir daha oynayalım mı?", and the tray is closed at the next race.

**Sürpriz Ustası**
4. Double-tapping 🎩 slides the tray in, plays magic and says "Sürpriz Ustası geldi!" (once per page load). A double tap closes it. After a reload the tray is closed. With the tray open, `Digit1`…`Digit9` (and Numpad, and tapping the buttons) insert the matching gag into `Drive.objs` in `Drive.lane` at `dx ∈ [650, 1050]` (or shifted per §4.4), keep `objs` sorted, and show the icon flight, the entrance and the announcement (when the voice channel is free). Two simultaneous pointerdowns (a gag button and ⬆️) both take effect.
5. **First press mid-race:** when the tray was opened mid-race, the first gag pressed lands at `wx` or `wx + 120` (not shifted further, not blocked) in at least 19 of 20 scripted trials across random courses, and no object visible on screen disappears.
6. Each of the 9 gags plays its entrance, is fully landed before the car reaches its trigger distance **at turbo speed** (walk-in animals idle on the road with `dy = 0`; ramp arc stars popped before the car reaches them), and then triggers the existing `hit`/`hitSpan`/animal/ramp behavior. Walk-in animals run their legs while entering.
7. A walk-in animal can be honked away (it flees continuously, +1 star) or is auto-jumped if not honked. It is never driven through without a reaction.
8. Rate limits: mashing digits never produces more than 3 pending gags. The gate respects its 8 s cooldown and ±650 spacing. Nothing spawns within 450 of the finish or after it. A spawn never leaves a ramp's arc stars without their ramp. A gag in lane 0 is never shifted because of an object in lane 2.
9. With the tray open, after at least one grown-up input this session, and 9 s of grown-up idleness, the director drops a gag every 4-6 s (🪄 over the button), never a gate, and stops when the grown-up presses anything.
10. A race that ends with the tray open and no grown-up input closes the tray (and the car) at End. The next race is a normal solo race.

**Duet**
11. A grown-up honk (📣 or `Minus`) followed within 0.9 s by a single child honk (no child honk in the 0.45 s before it), or the reverse order, gives 'ÇİFT KORNA!', rainbow rings and stars, `Snd.duet` and exactly +3 stars. A child honking 4 times per second continuously while the grown-up honks every 2 s gets no duet. The 3rd duet gives 'SÜPER İKİLİ!', confetti and +5. Duets are at most one per 2 s. The 📯 button pulses and rings for the full 0.9 s after the grown-up honks.

**The grown-up's car and the prank**
12. 🚙 or `0` brings the car in from behind; it settles one lane over at screen x 540 with its who flag, and the voice says the matching join line (then, once per session, the hint line). In all 6 lane pairings the two car bodies never overlap. Pressing 🚙 again sends it off ("Görüşürüz!"). 👤 cycles 🧑/👨/👩 and the flag and voice follow. 🎲 / `=` re-styles it. Who and look persist across reloads; on/off does not.
13. In a together replay, the car is already in place at the start (lane 0 or 2, x 540, clean), with no roll-in and no join line.
14. The car never shares the child's lane: it hops to the freed lane when the child steers in ("Yer değiştirdik!", throttled).
15. Objects in the car's lane react to it (shared stars, mud, paint, gift re-style, banana wobble, balloon pops, animal hop, ramp flip) with no voice and without replacing the child's comic burst. Its wheels are never the custom wheel.
16. Tapping anywhere on the grown-up's car (and the r 50 prank button, and `Enter`) throws the shown prank sideways onto it within 0.45 s, with the matching effect, a hat-fly, a protest honk, a comic, +1 star and the matching named voice line ("Baban çamur oldu!" when who = 👨; "Şakacı seni!" every 3rd). A tap on the child's own car still honks, and a tap during the cooldown makes the car hop and beep. With the grown-up idle, a revenge gag follows about 2.5 s later.

**Voice**
17. No Usta line starts while "Başla!" / the theme line, a gate, wash or finish line is playing (quiet windows). Forced Usta lines are at least 1.8 s apart. Gag announcements never cut off a `hit()` line.

**Finish and End**
18. Together mode: with the car, both cars jump and high-five ('ÇAK!', clap, then "Çak bir beşlik!" after "Yaşasın! Bitiş çizgisi!" has finished). With the tray only, a giant ✋ high-fives the child's car. The grown-up's car crossing the line triggers nothing by itself.
19. Together End shows two "1" rosettes (child car + the grown-up's car with its flag, or child car + 🎩), then says "Beraber birinci olduk!" and "Harikaydınız! Bir daha oynayalım mı?". Solo End is unchanged.

**Quality**
20. `node tools/gen-voice.mjs --missing` lists exactly the 34 new lines, with no slug collisions and no apostrophes. No `comic('…')` literal is on a `say(` line.
21. No new top-level files or folders, and `toLogical`, the pointer handlers and WheelStudio are unchanged. It works offline from `file:` and on GitHub Pages. iPad Safari holds a steady frame rate with the tray and the car on.
22. README has the new Turkish section, and `window.__game.Usta` exists.

---

## 11. Change log (v2 → v3)

- **The grown-up's car has its own screen x** (`FX = 240`, x 540). The body gaps were checked for all 6 lane pairings (19-40 px, no overlap). The prank is now a clear sideways throw of about 240 px, and the high-five hands meet over the gap.
- **Tap the grown-up's car to prank** (primary input), using a tap box clamped to the right of the child's own-car honk box. The pink button and `Enter` stay as alternatives. Taps during the cooldown make the car hop and beep. The next prank icon floats over the child's car.
- **It is recognisably the grown-up's car:** 👤 picks 🧑/👨/👩 (saved), a waving flag shows it, and the join, hint and prank lines name the person ("Baban geldi!", "Babana şaka yap!", "Baban çamur oldu!"). 🎲 re-rolls the look (saved). This adds 10 voice lines (34 in total).
- **Conflicts are same-lane only**, except spans and the all-lane star shower (§4.4).
- **Landing strip:** the first grown-up input of a race clears off-screen course groups just past the screen edge and thins the rest, so the first gag lands about 1.5 s ahead and is not refused. `buildCourse` no longer takes a `thin` argument; it only gains inert `g`/`keep` tags.
- **`act` semantics fixed:** opening the tray is no longer grown-up input. The director needs `sessionAct`, thinning needs an input, and `together()` = `open && (act || p2.on)`. A child who opens the tray alone gets the normal solo End and no director.
- **Across races defined:** the car carries over (already in place, clean, no roll-in) when the previous race had grown-up input; `raceEnd()` turns it off together with the tray otherwise.
- **Voice priority policy** (§4.11): announcements yield to everything, child-caused lines are forced but spaced 1.8 s apart, host lines wait in a single pending slot, and quiet windows protect "Başla!", the gate, the wash and the finish lines.
- **Duet anti-spam:** only an isolated child honk (≥ 0.45 s after the previous one) answers.
- **Ramp arc stars** pop in one by one after the ramp rises, with rising dings, inside their own timing budget (0.93 s < 1.37 s).
- **Scope reduced and de-risked:** the `stepRider`/`rideRamp` refactor of the child's physics is gone (the grown-up's car has its own 30-line physics, so solo play cannot regress). `collide2` folds gift/balloons/boost into one reaction and reuses `p2Fx` from the pranks. 🔀 and the peek bubble are cut. The total is about 500 lines (MVP about 350).
