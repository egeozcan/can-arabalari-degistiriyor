# Sihirli Harita: Diyarlara Yolculuk

> After the Garage, a world map opens with big picture medallions (Çiftlik, Uzay, Dinozor Vadisi, Deniz Kenarı, later Orman and Şeker Diyarı); one tap drives the car to a land with its own scenery, animals, gags, music and horn twist, and the map grows with flags and visitors after each trip.

## Evaluation history

| Round | Consistency | Design | Entertainment | Avg |
|---|---|---|---|---|
| 1 | 8.5 | 7.5 | 8 | 8.00 |
| 2 | 8.5 | 8 | 8.5 | 8.33 |

**Status:** not chosen — best avg 8.33 (target was 8.5; "Yolcu Partisi v2" reached it first and was implemented instead).

_Note: the plan below is the latest revision written after the last scored round; that revision was not scored again before the selection was made._

---

# Plan 1: "Sihirli Harita: Diyarlara Yolculuk" (Magic Map: Journey to the Lands)

Direction key: `harita-diyarlar`. Baseline: commit `f7f9a1b`, `game.js` ~3040 lines.

**Revision 3.** Changes from round 2:
- **Rungs can't get lost.** `MapSave.fresh` is now a persisted `pending` queue. Rungs earned through End's 🔁 replay loop stay hidden on the map until their reveal plays, and End shows a picture badge on 🗺️ when one is waiting.
- **One voice line at a time, for real.** Every Drive line now goes through one gate, `Drive.say(line, pri)`. It has a one-slot queue, and narrative lines wait instead of cutting. On the map, committing a trip clears the voice queue, so nothing can cut the "going" line. End's line waits for silence.
- **Medallions show their icons.** Each land has a hand-composed 480×480 vignette built from shared icon helpers (`drawVolcano`, `drawEarth`, …). The old world-camera crop is gone. If a vignette fails, the fallback is the land's big emoji.
- **The horn does something in every land, all race long.** Uzay: honking on the ground makes a moon **hop**, and honking in the air fires the **rocket** (a double-tap flip); high floating star rows reward this. Deniz: honking anywhere calls a **dolphin from the sea beside the road, which squirts the car clean**, and there are **two** tides, with the dolphin leaping over the car while you swim. Dinozor: the volcano always answers.
- **The volcano is tamed.** Only the first two big burps shake the screen (0.4, then 0.15, then none). The cooldown grows (3 → 5 → 7 → 9 s). While it is cooling down, a honk gets a small puff and no stars.
- **The volcano tap keeps its lane meaning.** The volcano hit area is only above y 400, which is lane-up territory for every lane. The tap burps **and still** changes lane up, so no control changes.
- The End mascot pose is defined with one `poseH()` helper. Landing in the tide is allowed now, and it gets a big splash.
- **Re-scoped honestly.** 6 pure-reskin variants, the 3rd animal per land, the 4th prop per land, 🎲, the rainbow rung and the idle "calls" all move to Tier B. Tier A is ≈ 1,000 lines (it was 1,225), and the plan keeps "playable after every step".

---

## 1. Vision, and why a 4-year-old will love it

Today every race runs on the same farm road, and only the sky changes. This plan adds one new decision, "where are we going today?", and every answer leads to a little world that **plays differently**, not just one that looks different.

After the Garage, a big bright **world map** opens. The child's own customized car is parked at a tiny garage in the middle. Dotted roads lead out to four huge round **picture medallions**. Each one shows its land's iconic picture (a smiling volcano, a smiling Earth, a sea with a sailboat, a red barn), with its mascot standing in front, bobbing:

| # | Key | Place | Mascot | What the horn does here (the new verb, available the whole race) |
|---|---|---|---|---|
| 1 | `ciftlik` | Çiftlik (today's farm road) | cow | the classic race: honk to scare the animals for stars, with day, sunset, night and snow rotating |
| 2 | `uzay` | Uzay | alien cow ("MÖÖP!") | **on the ground, the horn makes the car hop** (low gravity). **Honking again in the air fires a rocket puff**: the car climbs and does a full spin. Stars float high in space, and hopping catches them |
| 3 | `dinozor` | Dinozor Vadisi | long-neck dino | **the volcano answers your horn**: a big burp rains star-gummies onto the road ahead. While it rests, it gives a small puff. Dinos bow their heads so you can hop over |
| 4 | `deniz` | Deniz Kenarı | crab | **the horn calls a dolphin** out of the sea beside the road, and it **squirts water on the car** (mud gone!). **Twice per race the tide comes in**: the car swims, and then the dolphin leaps right over you |

Why it works for this age:
- **Agency with no wrong answer.** Picking a place is a real choice, and it pays off at once: the mascot cheers, the car drives off, and a voice says "Uzaya gidiyoruz!". Nothing is locked and nothing costs anything.
- **The favourite button gets a new meaning in each land.** The child honks constantly anyway, so they find each land's trick by accident within seconds, then go back to that place to do it again. In every land the horn always gets an answer, so honking is never a dud.
- **Cause and effect a 4-year-old can see.** In Deniz, seaweed sticks to the car, you honk, and the dolphin washes it off. In Uzay, the stars are up high, you hop, and you catch them. In Dinozor you honk at the mountain and the mountain burps sweets.
- **Discovery within ten seconds.** The first three events of every race are that land's signature gags (guaranteed, see §3.3).
- **A map that grows.** Each visit adds something to the map: a flag, a paved road, and then the mascot **moves in** next to your garage. It is a collection that only ever grows, and it needs no reading.

What deliberately stays the same: the farm keeps its familiar race. Its new things are the guaranteed opening and its own rungs on the map. It is the "home" the other lands are compared against.

---

## 2. Player experience, moment to moment

### 2.1 Garage → Map (0-2 s)
1. The child taps 🏁 (or presses Enter) in the Garage: whoosh, then `go(Harita)` instead of `go(Drive)`.
2. The map fades in and the cheerful `harita` track starts. The car rolls out of the little garage at the hub (`Snd.vroom`, with its own exhaust trail).
3. The four medallions pop in (`pop`, stagger 0.08 s, `easeOut` scale 0 → 1). **Taps are accepted from the first frame.**
4. Voice and reveals run on `update` timers (`this.vq`), never on `setTimeout`:
   - **Pending rungs** (§4.6) are revealed one at a time at t = 0.2, 1.6 and 3.0 s (at most 3 per entry). Each reveal is a 1.2 s animation (flag springs up, road paves, or the mascot walks to the hub) plus its forced line, for example **"Bayrak diktik!"**. Then **"Nereye gidelim?"** plays 1.4 s after the last reveal.
   - If no rung is pending, **"Nereye gidelim?"** plays at t = 0.2 s.
   - **The moment a trip is committed** (a medallion, 🔁, a key 1-4 or Enter), `this.vq.length = 0`, the trip's "going" line is forced, and every other map voice source (idle prompts, focus names) is disabled while `this.travel` is set. So nothing can cut the going line. Any rung whose reveal had not started yet stays pending for the next entry (§4.6).

### 2.2 On the map (idle)
- Each medallion is a round picture, r 115, showing that land's **composed vignette** (§3.5). Its iconic element sits in the upper and central part of the circle. The mascot stands at the **lower-right of the rim**, partly outside the frame (feet at `(cx + 0.5r, cy + 0.98r)`), idle-bobbing and blinking. The mascot is at most 92 px tall (0.8 r), so it covers only the lower-right quarter of the picture, where the vignette puts nothing important.
- A small decorative ribbon label sits at the **top** of each medallion for parents (`ÇİFTLİK`, `UZAY`, `DİNOZOR VADİSİ`, `DENİZ KENARI`), drawn with `text()` at 22 px.
- After 6 s with no input, a big 👆 bounces over an **unvisited** medallion (or a random one).
- After 10 s idle: `say(pick(['Bir yere dokun!', 'Hadi bir yer seç!']))` (non-forced, skipped while `Voice.playing()`), then the idle timer resets.
- Mascots that have **moved in** stand around the hub garage and wave. Tapping one makes it hop and make its sound (sound only, no voice).
- *(Tier B)* Every ~4 s one random medallion "calls": its mascot hops, makes its sound, and the medallion wobbles.

### 2.3 Choosing
- **Tap a medallion or its mascot** (the hit area is the circle r 115 × 1.08 **united with** the mascot's box, §4.6):
  1. Immediately: the medallion squashes (`press`), the mascot jumps and makes its sound, sparkle, `Snd.pop`.
  2. Commit (§2.1 step 4): clear `vq`, then force the place's "going" line, for example **"Uzaya gidiyoruz!"**.
  3. The road from the hub lights up yellow and its dashes march. The car (`drawCar`, scale 0.3, mirrored when heading left) drives the quadratic Bézier road in **1.1 s**.
  4. On arrival: `poof`, `Snd.whoosh`, the medallion zooms (scale to 1.4 over 0.25 s), then `go(Drive)` with `Drive.biome = key`. From tap to race is about 1.4 s.
- **Tapping a different medallion during travel** re-targets from the car's current position, and that place's going line is forced. This is the only thing that can interrupt a going line, and it is the child's own new choice. **Tapping the same one again** arrives immediately.
- **🔁 "same place again"** (770, 650, r 50): shown once any place has been visited. Its icon is the last place's mascot head, and one tap travels there. It sits **exactly where 🏁 is in the Garage**, so a "just go!" child who double-taps 🏁 lands on it and goes to the last place.
- **🔧** (86, 650, r 48): back to the Garage (`Snd.pop`, `go(Garage)`).
- Tapping empty map gives a tiny `Snd.click` plus a sparkle at the finger, so every tap gets feedback.
- *(Tier B)* **🎲 Sürpriz** (560, 650, r 50): "Sürpriz yolculuk!" (forced, counted as a commit). A highlight ring hops around the medallions, slowing down over 1.7 s (at least as long as the line, so the going line on landing doesn't cut it). It prefers unvisited places, never picks the last place, and lands with a `ding`. Then the normal travel runs.

### 2.4 Arriving: the race (Drive)
- Scenery, palette, music and road colours belong to the land. The countdown is unchanged. At green, the land's arrival line (**"Uzaya geldik!"**) goes through `this.say(…, 3)`.
- **The first three events are always the land's `first` gags** (the generator fix in §3.3). They reach the car at about 2.2 s, 4-5 s and 6-7 s after green.
- **The horn always does the land's trick, from green to the finish line** (§4.4):
  - Uzay: on the ground it hops (peak 115 px, 1.0 s). In the air it fires the rocket once per airtime. Rows of **high stars** (h 170-220) can only be caught in the air.
  - Dinozor: a big burp with gummies when the volcano is ready, and a small "hm?" puff while it cools down.
  - Deniz: a dolphin squirt (it washes off mud) whenever no dolphin is out, about every 1 s while the child is honking. During either tide, the dolphin leaps over the swimming car instead.
- The existing gags keep their rules (decals stick, ramps launch, washes clean, gifts change the car, animals are hopped over, the horn scares them off for a star). The six Tier A variants (§4.3) change how they look and what they say.
- HUD progress bar: the wash marker is the land's icon (🛸 / 🦕 / 🫧), and Deniz shows a 🐬 at each tide.
- Voice follows the single-line gate (§6.2), so the child hears **one line at a time, in a deliberate order, and nothing ever cuts another line off.**

### 2.5 End
- Same trophy, star count-up and dancing car. **The land's mascot dances next to the car** with its feet at (930, 540). It is drawn in its **head-up pose** (`bow = 0`), at scale `min(0.8, 150 / poseH(m, 0))`, so every mascot is at most 150 px tall (the long-neck: `poseH` = 260, scale 0.58, top at y 390). Tapping the mascot makes it hop and make its sound.
- Buttons: 🔁 same place again (510, 640, r 64, pulsing, the main one), **🗺️ map** (690, 640, r 58), 🔧 garage (850, 640, r 50). The mascot's box (x ~860-1000, y 390-540) sits above 🔧's top edge (590).
- **Rung teaser:** if this race earned a rung (`Drive.rungEarned`), the 🗺️ button gets a pulsing gold ring and a bobbing picture badge at its upper right (🚩 flag, 🛣️ road, or the mascot's head for "friend"), and `Snd.magic` plays at 1.0 s. There's no extra voice. If the child keeps pressing 🔁 instead, nothing is lost: the rung stays pending (§4.6), and the badge shows again on every End until the map has revealed it.
- **End voice waits for silence:** End's `setTimeout(…, 400)` becomes an `update` timer that fires at `t ≥ 0.4 && (!Voice.playing() || t > 2)`, so it never cuts off the finish line. It stays a single `say(` line:
  `say(this.celebrateAll ? 'Her yeri gezdik! Süpersin!' : 'Harikaydın! Bir daha oynayalım mı?', true); this.said = true;`
- **If this race completed the set** (every place in `BIOME_ORDER` visited), there is extra `confetti(150)` and the line is "Her yeri gezdik! Süpersin!".

---

## 3. Integration with existing scenes and systems

### 3.1 Flow change
```
Title → Garage ⇄ WheelStudio
Garage 🏁 → Harita → Drive(biome) → End → (Drive same biome | Harita | Garage)
Drive 🏠 (double tap) → Harita        (the map is the new hub; 🔧 is one tap from there)
Harita 🔧 / Esc / Backspace → Garage
```
- `Garage.start()` (~1961): `Snd.whoosh(); go(Harita);`
- `End` (~2876-2929): add the `map` button, the mascot, the rung badge and the voice timer. `enter()` runs `this.celebrateAll = Drive.celebrateAll; this.rung = MapSave.pending.length ? MapSave.pending[MapSave.pending.length - 1] : null; Drive.celebrateAll = false; this.said = false;`. Keys: Enter = replay, Backspace/Escape = map, other keys = honk (as today). `buttons()` returns `[this.again, this.map, this.garage]`.
- `Drive.click` home branch (~2627): `go(Harita)` instead of `go(Garage)`.
- `window.__game` gets `Harita, BIOMES, MapSave, artSheet, voiceLog` plus `biome(k)`, which sets `Drive.biome = k` and calls `go(Drive)`.

### 3.2 Drive parameterization
- `Drive.biome` (string, default `'ciftlik'`) is set by Harita and survives replays from End.
- `Drive.enter()` (~2376), replacing the theme lines at ~2388-2391:
  ```js
  const B = BIOMES[this.biome] || BIOMES.ciftlik; this.B = B;
  if (B.themes) { const ths = B.themes.filter(k => k !== this.theme); this.theme = this.races ? pick(ths) : B.themes[0]; }
  else this.theme = B.theme;
  this.grav = B.grav || GRAV; this.jumpK = B.jumpK || 1;
  this.vEnd = 0; this.slot = null; this.saidV = {}; this.metKinds = {}; this.firstUse = {};     // ses kapısı (§6.2)
  this.swim = false; this.tideN = 0; this.puffed = false; this.dolph = null; this.drops = [];
  this.burpCd = 0; this.burpN = 0; this.burpA = 0; this.sigT = -9;
  this.celebrateAll = false; this.rungEarned = null;
  this.objs = buildCourse(B);
  Music.play(B.track || 'drive');
  ```
  **Bug avoided:** today's `Object.keys(THEMES)` rotation (~2388) would put space into the farm race once the land themes are added to `THEMES`. `BIOMES.ciftlik.themes = ['gunduz','aksam','gece','kar']` fixes it.
- `Drive.update` (~2423): `this.vz -= this.grav * dt`. The landing-thud threshold becomes `this.vz < -500 * this.jumpK`. On landing, `this.puffed = false`, and **if `this.swim` is set, the landing becomes a big splash** (`Snd.splash`, 40 drops, comic `ŞLAP!`, no shake) in place of the thud. The voice slot pump (§6.2) runs once per frame. At green (~2408), `say(…, true)` becomes `this.say(this.theme === 'gunduz' ? 'Başla!' : THEMES[this.theme].say, 3)`.
- `collide` (~2469):
  - Animal auto-jump: `this.vz = Math.max(this.vz, 720 * this.jumpK)`. The trigger is widened from `this.z < 5` to `this.z < CAST[o.kind].h * ls - 10`, so a car that is low in the air (an Uzay hop coming down) **bounces over** an animal instead of passing through it. In the farm the ramp reserve already prevents this case, so nothing there changes.
  - Ramp launch: `const v = 980 * this.jumpK; this.vz = v; this.flipV = TAU / (2 * v / this.grav);`
  - Decals (`DECAL_TYPES`) are skipped while `this.z > 60`, so hopping over mud is a miss, not a stick. Today nothing launches the car over a decal, so the farm is unaffected.
  - New `tramp` branch (§4.3), the animal intro offer (§6.2), and the bow update (§4.5).
- `hit` (~2514) and `hitSpan` (~2564): `const V = o.v && VARIANTS[o.v];` and use `V.col / V.comic / V.sfx / V.say / V.fx` when present, otherwise today's behaviour. All `say(` calls in Drive become `this.say(…, pri)` (§6.2).
- `drawObj / drawDecal / drawSpan`: `if (V && V.draw) { V.draw(o, sx, t, front); … }` inside the existing transform. Otherwise they draw as today, tinted by `V.col/col2` when present.
- **Dedupe the decal list:** `const DECAL_TYPES = new Set(['paint','mud','banana','boost'])`, used in `Drive.draw` (both places) and `collide`.
- `drawHUD`: the wash marker is `this.B.washIcon || '🫧'`, plus a 🐬 at each `B.tides[i][0]`.
- `doHonk` (~2594): after today's body, `if (this.startT <= 0 && !this.finished) this.biomeHonk();` (§4.4).
- `Drive.click` (~2630): **before** the lane logic, and with no `return`:
  `if (this.B.volcano && p.y < 400 && Math.hypot(p.x - 1000, p.y - 300) < 95) this.burp();`
  The lane logic then runs exactly as today. Every point with y < 400 is already a lane-up tap in every lane (`p.y < this.ly - 50`, and `ly ≥ 470`), so the volcano tap **adds** a burp to the existing gesture and never replaces it.

### 3.3 `buildCourse(B)` (~2323), including the forced-first fix
- Signature `buildCourse(B = BIOMES.ciftlik)`. `table = B.table || DEFAULT_TABLE` (today's table moved into a const). `first = B.first || ['gift','animal','ramp']`.
- **Fix:** today `n++` also runs for star rows, and the forced pick is `if (n < 3 && type !== 'stars')`, so a slot that rolls stars (~26%) silently drops that slot's forced gag. The new rule uses a counter that stars don't advance:
  ```js
  let nf = 0;                                     // zorunlu açılış olaylarından kaçı yerleşti
  ...
  if (nf < first.length) type = first[nf++];      // ilk üç olay her zaman diyarın imza şakaları
  else if (type === lastType && type !== 'stars') type = 'stars';
  ```
  The farm now always opens gift → animal → ramp (what the original comment intended). That is the only change to the farm's course.
- When an event is added: `o.v = B.kit && B.kit[type]`. The `wash` specials get `v: B.kit.wash`, and the gift gets `v: B.kit.gift`.
- Animals: `kind: pick(B.animals)` (`ANIMALS` stays as the farm cast).
- New `case 'tramp'`: `add('tramp', lane, { sq: 0 })` plus 3 stars on its bounce arc, then `x += D + 150`.
- **Physics-derived star arcs** (only when `B.grav` is set or for a tramp; the farm keeps its hand-tuned ramp stars):
  ```js
  const g = B.grav || GRAV, k = B.jumpK || 1;
  const arc = (x0, v, n, lane) => { const T = 2 * v / g, D = 440 * T, top = v * v / (2 * g);
    for (let i = 0; i < n; i++) { const u = (i + 0.5) / n; o.push({ type: 'star', x: x0 + D * u, lane, h: 45 + 4 * top * u * (1 - u) * 0.9 }); }
    return D; };
  ```
  Ramp in Uzay: `x += arc(x + 90, 980 * k, 6, lane) + 150`. T ≈ 1.6 s, D ≈ 700 px, peak ≈ 294 px.
- **High star rows (Uzay):** `B.starHigh = 0.5`, so half of the `stars` rows are placed at `h: 195 + 25 * sin(i * 0.9)` (170-220). The star test is `h > z - 40 && h < z + 150`, so these need `z > 20…70`: they are out of reach on the ground, and a moon hop (peak 115) catches them. On the ground they float just out of reach, which is a visible invitation to honk.
- **Deniz tides:** `B.tides = [[0.30, 0.37], [0.64, 0.71]]` (fractions of L: 5250-6475 and 11200-12425 world px, ~2.8 s each at base speed). Each tide pushes two spans, `{type:'tideIn', x, span:true}` and `{type:'tideOut', x, span:true}`. `near()` treats each tide range ±320 as reserved for ramps, animals, decals and tramps. Inside the range, a sine wave of 8 stars (`h: 45 + 35*sin`) crosses the lanes. **Landing in the water from a jump is allowed** (a boosted ramp jump can carry ~765 px). It is a big splash (§3.2), never a problem.

### 3.4 Scenery: `THEMES` + `BIOME_ART` + shared icon helpers
- New `THEMES` keys `uzay, dinozor, deniz`, with today's shape plus optional road colours and `art`:
  `{ sky:[a,b], hills:[far,near], grass, grass2, road, road2, curb:[a,b], dash, art:'uzay', say:'Uzaya geldik!' }`.
- `drawWorld(dist, t, theme)` (~1623) becomes a thin dispatcher. The existing code stays as the default path. When `th.art` is set, it calls the hooks of `BIOME_ART[th.art] = { sky(t,dist), far(dist,t), near(dist,t), prop(x,y,k,h,t), ground(dist,t), vignette(t) }`, and a missing hook falls back to the default. Road drawing reads `th.road || '#5f6370'`, `th.road2`, `th.curb` and `th.dash`. Road and lane geometry (`ROAD_TOP=425`, `ROAD_BOT=700`, dashes at 512/606) are shared, so collisions never depend on the art.
- **Icon helpers** (new, all take position and scale, so the world layer and the vignette draw the *same* picture):
  `drawEarth(x, y, r, t)` (blue disc, 3 green continent blobs, `eye()` eyes and a smile), `drawRingPlanet(x, y, r)`, `drawVolcano(x, peakY, s, burpA, t)` (cone, lava cap, a smiley face that puffs its cheeks when `burpA > 0`, smoke rings), `drawShadesSun(x, y, t)` (`drawSun` plus two dark rounded rects), `drawSea(y0, y1, off, t)` (gradient band, 3 sine crest lines) and `drawSailboat(x, y, s, t)`.
- Props: the same `k*170 - dist*0.55` loop with `hash(k)`, handing `(x, 418, k, h, t)` to `art.prop`, which picks a prop by `h` bands.
- `drawWorld` stays free of side effects. `BIOME_ART.dinozor.far` reads `Drive.burpA` (it never writes it). Title and End keep working (End already calls `drawWorld(COURSE_LEN - CARX, t, Drive.theme)`).

### 3.5 Map medallion pictures: composed vignettes, cached offscreen
- `ctx` is `const` today (line 9). Change it to `let ctx` and add
  `function withCtx(c2, fn) { const o = ctx; ctx = c2; try { fn(); } finally { ctx = o; } }`.
  Every draw helper reads the global `ctx` at call time.
- `VIG = {}` holds one 480×480 canvas per place, built lazily on the first `Harita.enter()`: `withCtx(c2, () => { clip circle(240,240,240); BIOME_ART[art].vignette(0) })`. That is 4 small renders per page load and 4 `drawImage` calls per frame.
- **Each vignette is composed for the circle, with the icon in the top or centre and the lower-right quarter left clear for the mascot** (coordinates in 480 space; the mascot covers roughly x > 240, y > 285):

| Land | Composition (back to front) |
|---|---|
| Çiftlik | sky `gunduz` gradient; `drawSun(370, 95)` at 0.8; two hill bands at y 250/290; **red barn** `drawHouse(150, 330)` at 1.5; `drawTree(330, 320)` at 1.2; fence; grey road band y 380-440 with white dashes |
| Uzay | night gradient + 40 stars; **smiling Earth** `drawEarth(200, 165, 95)`; **ringed planet** `drawRingPlanet(385, 95, 42)`; crater horizon y 300; road band y 370-440 with cyan dashes; small striped rocket at (70, 330) |
| Dinozor | orange-yellow gradient; **smiling volcano** `drawVolcano(215, 105, 1.25, 0, 0)` (cone base x 40-390 at y 330, two smoke rings above the peak); fern at (50, 360); dirt road y 370-440 |
| Deniz | sky gradient; **sun with sunglasses** `drawShadesSun(110, 105)`; **sea** `drawSea(195, 320)` with **sailboat** at (310, 250); sand y 320+; palm at (60, 330); road band y 385-440 |

- **Fallback:** if a vignette build throws, that medallion is a flat `sky[0]` circle with the land's big emoji at 120 px (🐄 / 🌍 / 🌋 / 🌊) in its upper half, which still reads at a glance.

### 3.6 Audio
- `TRACKS` gets `harita, uzay, dinozor, deniz` (§6.4). `Music.play(B.track)` runs in `Drive.enter`, and `Music.play('harita')` in `Harita.enter`.
- New `Snd` methods (§6.3).
- `animalSound(k)` and `ANIMAL_TXT` (~1815-1818) are replaced by `CAST` (§4.5). The farm keeps its sounds and text exactly.
- **`Voice.playing()`** (new, 4 lines): true while `this.utterance` is set (cleared in `onend` as today), while `this.src` is set (new `s.onended = () => { if (this.src === s) this.src = null; }`), or while `this.loading` is set (set in `playRecording` before `load()`, cleared when it starts or bails). A 4 s ceiling since the last `say` guards against a stuck iOS utterance.

### 3.7 Voice discovery (tools/gen-voice.mjs)
New lines live in data tables as `say…:` properties. A one-line scanner change finds several on one line and names like `sayGo:`:
```js
// before
const th = l.match(/\bsay: '([^']+)'/); if (th) out.add(th[1]);
// after
for (const m of l.matchAll(/\bsay\w*: '([^']+)'/g)) out.add(m[1]);
```
The Drive gate is a method called **`this.say(…)`**, so the existing `\bsay\(` rule already picks up its literal lines with no further change. Check with `node tools/gen-voice.mjs --list` before and after: all 126 old lines must still be there, and `--missing` must list exactly the §6.1 lines for the tier being built.

---

## 4. Mechanics and content

### 4.1 `BIOMES` table (new section `// ==== diyarlar`, after `ANIMAL_TXT`/before `// ==== sahneler`, ~1819)
```js
const BIOME_ORDER = ['ciftlik', 'uzay', 'deniz', 'dinozor']; // haritadaki sıra; tuşlar 1-4
const BIOMES = {
  ciftlik: { themes: ['gunduz', 'aksam', 'gece', 'kar'], track: 'drive', animals: ['inek', 'ordek', 'tavuk', 'domuz', 'koyun'], mascot: 'inek', kit: {}, washIcon: '🫧', icon: '🐄',
    sayName: 'Çiftlik', sayGo: 'Çiftliğe gidiyoruz!' },
  uzay: { theme: 'uzay', track: 'uzay', grav: 920, jumpK: 0.75, rocket: true, starHigh: 0.5, animals: ['uzayinek', 'uzayli'], mascot: 'uzayinek', icon: '🌍',
    kit: { ramp: 'roket', wash: 'ufo', mud: 'aytozu', boost: 'kuyruklu' }, washIcon: '🛸', first: ['ramp', 'animal', 'boost'],
    table: [['stars', 30], ['gift', 12], ['paint', 6], ['mud', 6], ['animal', 15], ['ramp', 14], ['balloons', 7], ['boost', 8]],
    sayName: 'Uzay', sayGo: 'Uzaya gidiyoruz!' },
  dinozor: { theme: 'dinozor', track: 'dinozor', volcano: true, animals: ['uzunboyun', 'ucboynuz'], mascot: 'uzunboyun', icon: '🌋',
    kit: { ramp: 'kuyruk', gift: 'yumurta', mud: 'ayakizi', wash: 'dinodus' }, washIcon: '🦕', first: ['animal', 'ramp', 'gift'],
    table: [['stars', 26], ['gift', 12], ['paint', 7], ['mud', 9], ['animal', 18], ['ramp', 10], ['balloons', 6], ['boost', 5]],
    sayName: 'Dinozor vadisi', sayGo: 'Dinozorlara gidiyoruz!' },
  deniz: { theme: 'deniz', track: 'deniz', tides: [[0.30, 0.37], [0.64, 0.71]], animals: ['yengec', 'fok'], mascot: 'yengec', icon: '🌊',
    kit: { ramp: 'kumkale', tramp: 'plajtopu', mud: 'yosun', wash: 'dalga' }, washIcon: '🫧', first: ['animal', 'tramp', 'ramp'],
    table: [['stars', 26], ['gift', 12], ['paint', 8], ['mud', 10], ['tramp', 8], ['animal', 17], ['ramp', 9], ['balloons', 6], ['boost', 4]],
    sayName: 'Deniz kenarı', sayGo: 'Deniz kenarına gidiyoruz!' },
};
const MAP_LAYOUT = { 4: { r: 115, pos: { ciftlik: [260, 215], uzay: [1020, 215], deniz: [260, 520], dinozor: [1020, 520] } } }; // 6: Ek A
```
`banana` is left out of the new lands. The farm table is unchanged. Deniz has slightly more mud (seaweed) because the dolphin squirt cleans it, which makes a loop. Tier B appends `astroordek`, `bebekdino` and `marti` to the `animals` lists.

### 4.2 Scenery (`BIOME_ART`), 3 prop types per land in Tier A (the 4th is Tier B)
Everything is procedural, deterministic per world x (`hash`), drawn with `OUT` outlines and flat saturated fills. At most ~20 paths per prop and about 8 props visible at a time.

- **Uzay**: `sky ['#0b0630','#3b1d6e']` plus 80 twinkling stars (the night-sky code). `drawEarth(1110, 105, 70)` replaces the sun, and `drawRingPlanet(300, 120, 40)` scrolls at `dist*0.02`. No clouds. *far:* grey crater horizon `#8b8fa8`. *near:* `#a9adc2`. *props:* craters, a parked striped rocket, glowing crystal rocks (*Tier B:* a flag). *ground:* `#b9bdcc`. *road:* `#3d3f55`, curbs `#25e0e0/#fff`, glowing cyan dashes `#7ff9ff`.
- **Dinozor**: `sky ['#ffb36b','#fff1b8']`, sun at (180, 110), away from the volcano. *far:* `drawVolcano(1000, 230, 1, Drive.burpA, t)`, **fixed in screen space** like the sun, base 400 wide at y ~405. *near:* brown-orange `#c98b4a`, then green `#7cbf5a`. *props:* giant ferns, cycad palms, a nest with 3 spotted eggs (*Tier B:* big bones). *ground:* `#6fb04f`. *road:* dirt `#9c7a54`, stone curbs `#8d8d8d/#c9c9c9`, sandy dashes.
- **Deniz**: `sky ['#4fc3f7','#e0f7ff']`, `drawShadesSun(1110, 105)`. *far:* `drawSea(300, 405, dist*0.1, t)` in place of far hills, plus `drawSailboat` scrolling slowly. **This is the sea the dolphin jumps out of.** *near:* sand dunes `#f7d98b`. *props:* palm tree, striped beach umbrella, sandcastle with a pennant (*Tier B:* a lifeguard tower). *ground:* sand `#f3d17c` with shells. *road:* `#6b7080`, curbs `#3d8bff/#fff`, white dashes. The tide water is drawn by `Drive.draw` (§4.4).

### 4.3 Road gag variants (`VARIANTS`, next to `BIOMES`, one per line)
Each variant **keeps its base type's collision and rules**. Fields: `draw(o,sx,t,front?)`, `col/col2`, `blob`, `comic`, `sfx`, `fx(drive)`, `say` (first-hit line).

**Tier A: the 6 that change what happens or are each land's landmark gag:**

| Variant | Land | Base | Look | Extra effect | Comic | First-hit line |
|---|---|---|---|---|---|---|
| `roket` | uzay | ramp | metal launch ramp with blinking lights | the floaty moon jump plus a 6-star arc | `VIIIN!` | **Süper zıplama!** |
| `ufo` | uzay | wash (span) | smiling UFO with a green beam cone | clears mud, **lifts the car** (`vz = 380`), beam sparkles, `Snd.ufo` | `BİİİP!` | **Uzaylılar bizi yıkadı!** |
| `kuyruk` | dinozor | ramp | a stegosaurus lying down whose tail is the ramp (head at the verge, blinks) | it blinks and smiles as you launch | `VIIIN!` | **Dinozor kuyruğu!** |
| `yumurta` | dinozor | gift | big spotted egg, rocking | it cracks: 2 shell halves fly and a baby-dino head pops out, then the normal gift | `CİK!` | **Yumurta çatladı!** |
| `kumkale` | deniz | ramp | sandcastle ramp with towers and a flag | it **crumbles** on launch (30 sand particles, `Snd.poof`) | `VIIIN!` | **Kumdan kale!** |
| `plajtopu` | deniz | tramp | giant striped beach ball half sunk in sand | bounce, and the ball squashes | `BOING!` | **Plaj topu!** |

**Tier B: the 6 pure reskins.** In Tier A they exist **only as data tints** (`{ col, col2, comic }`, one line each, no `draw`, no `say`), so the default puddle, pad or foam renderer draws them in the land's colours: `aytozu` (mud, grey `#9aa0b5`, `PUF!`), `kuyruklu` (boost, cyan), `ayakizi` (mud, brown), `dinodus` (wash), `yosun` (mud, green `#3f9b4a`), `dalga` (wash). In Tier B they get their `draw`, effect and line: `Ay tozu!`, `Kuyruklu yıldız!`, `Kocaman ayak izi!`, `Dinozor bizi yıkadı!`, `Yosun yapıştı!` (with green **strand** blobs on the car), `Dalga geldi!`.

**New base type `tramp`** (upright, depth-sorted, not a decal):
- collide: `laneHit && Math.abs(dx) < 55 && this.z < 10` → `o.done = true; o.sq = 1; this.vz = 900 * this.jumpK; this.flipV = 0; car.squash = 0.8; car.hatV += 700;`, then `Snd.boing2()`, `comic`, the voice line, and `addStar` ×1.
- `o.sq` decays at `dt*3`, and the renderer squashes by `1 - 0.4*o.sq`. It is only checked on the ground.

**Blobs stuck to the car:** `car.mud` entries get optional `c`, `c2`. In `drawCar` (~1448), they draw with `m.c || '#7a4a1e'` / `m.c2 || '#9a6a3a'`. The tinted mud variants pass their colours. (*Tier B:* `k === 'strand'` for seaweed.)

### 4.4 The signature interactions: the horn, everywhere, all race
All three hang off `Drive.biomeHonk()`, which is called after `doHonk`'s normal body, so keyboard and touch work the same way (📯, Space, any letter, tapping the car or the road band). Each one has a **discovery line** on its first use per race (`SIG.*.say`, priority 2, §6.2). **Star rewards from signatures are rate-limited** by `sigStar(n)`: `if (this.t - this.sigT >= 4) { this.sigT = this.t; this.addStar(…, n); }`. Spamming the horn keeps the show going but doesn't inflate the count.

**Uzay: moon hop + rocket puff.**
```js
if (B.rocket && !this.onRamp) {
  if (this.z <= 0) {                                   // yerde: ay zıplaması
    this.vz = 460; this.flipV = 0; car.squash = 0.5; Snd.boing(); this.sig('hop');   // tepe 460²/1840 ≈ 115 px, 1.0 s
    for (let i = 0; i < 8; i++) addP({ /* gri toz, yavaş yükselir */ });
  } else if (this.z > 30 && !this.puffed) {            // havada: roket, her havalanışta bir kez
    const cap = 300;
    this.vz = Math.max(this.vz, Math.sqrt(2 * this.grav * Math.max(0, cap - this.z)));
    const T = (this.vz + Math.sqrt(this.vz * this.vz + 2 * this.grav * this.z)) / this.grav;
    const target = Math.ceil(this.rot / TAU + 0.05) * TAU + TAU;   // bir tam tur daha, dik iner
    this.flipV = (target - this.rot) / T; this.puffed = true;
    Snd.rocket(); car.squash = 0.6; comic('FIŞŞ!', …); /* 14 turuncu-sarı duman parçacığı */ this.sig('rocket');
  }
}
```
- **Honk, honk** = hop, then rocket: a big floaty spin about every 1.5 s if the child wants it. The 300 px cap keeps the car on screen (§8.8). From a hop at z ≈ 100, the rocket gives T ≈ 1.5 s and one full extra turn, and the car lands upright.
- **Why it is fun and reachable:** it works the whole race, not only off ramps. The high star rows give hopping a visible purpose, and the low gravity makes even a plain hop feel like the moon.

**Dinozor: the volcano answers ("Yanardağ geğirdi!").** `Drive.burp()` is called from `biomeHonk` (when `B.volcano`) and from the volcano tap:
```js
burp() {
  if (this.burpCd > 0) { this.burpA = Math.max(this.burpA, 0.35); Snd.burp(0.3); return; }   // dinleniyor: küçük "hı?" dumanı
  const n = this.burpN++;
  this.burpA = 1; Snd.burp(1); comic('PÜF!', 1000, 200, '#ff8c42', 70);
  this.shake = Math.max(this.shake, [0.4, 0.15][n] || 0);   // sadece ilk iki büyük geğirme sarsar
  const m = n === 0 ? 5 : 3;                                // ilk seferde 5, sonra 3 jöle yıldız
  for (let i = 0; i < m; i++) this.drop({ type: 'star', x: this.dist + CARX + 450 + i * 90, lane: randi(0, 2), h: 420, fall: 45, gum: true });
  this.burpCd = Math.min(3 + 2 * n, 9);                     // 3, 5, 7, 9, 9 s
  this.sig('burp');
}
```
- `burpCd` and `burpA` decay in `update`. `drop(o)` = `insertObj(o)` (a binary-search splice that keeps `objs` sorted) plus `this.drops.push(o)`, and `update` lowers `h` by `600*dt` down to `fall`. A `gum` star has a pink rim. Gummies past `L - 200` are skipped.
- **Bounds:** across a ~40 s race, at most ~6 big burps and ≤ 20 gummies, and **only two screen shakes per race**. A honk during the cooldown always gets the small puff, so the horn is never ignored.
- *(Tier B)* An ambient small burp every `rand(10,14)` s, with no stars and no shake.

**Deniz: dolphin squirt everywhere, swimming twice.**
- **Squirt (on land):** honk while `!this.swim && !this.dolph` → `this.dolph = { t: 0, mode: 'squirt' }`. A smiling dolphin leaps out of the far-layer sea at screen x 700, y 400, peaks at y 280 at t = 0.45, and dives back at x 820 by t = 1.0. It is drawn after `drawWorld` and before the road objects, so it really is "behind the road, in the sea". At t = 0.45 it spits a **water jet** (a thick light-blue quadratic stroke with a white core, drawn for 0.25 s and in front of everything) that lands on the car at t = 0.6: `car.mud = []`, 12 drops, `Snd.splash()`, `car.squash = 0.5`, comic `ŞLAP!`, `sigStar(1)`, and `this.sig('squirt')`. A muddy car is visibly cleaned, and a clean one just gets a happy splash.
- **Tides:** `hitSpan('tideIn')`: `this.swim = true; this.tideN++`, `Snd.splash()`, 30 drops, and on the first tide only, `this.say('Yüzüyoruz!', 3)`. `hitSpan('tideOut')`: `this.swim = false`, `Snd.splash()`, and on the first tide only, `this.say('Karaya çıktık!', 3)`. The second tide is sound and comic only, which leaves voice room for the dolphin.
- While `swim`: the car bobs (`sin(t*4)*6`) and rocks (`sin(t*2.2)*0.07` when not jumping), its speed target is ×0.85, a wake of white `drop`/`bubble` particles trails behind, and `wheelA` keeps spinning. Lane changes still work.
- `Drive.draw`: when a tide range is on screen, a water band covers the road (`#4fc3f7`, alpha 0.85) with wavy foam edges and 3 crest lines. While `swim`, the car is followed by a **front water lip** (`ell(CARX, carY - 4, 175*s, 24*s, 0, 'rgba(79,195,247,0.9)')` plus a crest stroke).
- **Leap-over (in water):** honk while `swim && !this.dolph` → `mode: 'over'`. The dolphin arcs from below the road (y 720) over the car to the top verge (y 410) in 1.0 s, splashing at both ends, `sigStar(2)` at the top, and `this.sig('dolph')`.
- **Why it is fun and reachable:** the dolphin is one honk away for the whole race. It cleans the seaweed-mud (Deniz has the most mud), and twice per race the car becomes a boat.

`sig(k)` = `if (!this.firstUse[k]) this.say(SIG[k].say, 2, () => this.firstUse[k] = true);`. The line is marked as used only when it actually plays.

### 4.5 `CAST`: every animal kind (one per line, replacing `ANIMAL_TXT` + `animalSound`)
`h` is the drawing's height in local units in its **hop pose**, and `hUp` is the head-up height for the long-neck. One helper is used everywhere (map, End, art sheet):
`const poseH = (k, bow = 1) => { const c = CAST[k]; return c.hUp ? c.hUp + (c.h - c.hUp) * bow : c.h; };`
```js
const CAST = {
  inek: { txt: 'MÖÖ!', snd: 'moo', h: 160 }, ordek: { txt: 'VAK!', snd: 'quack2', h: 110 }, tavuk: { txt: 'GIDAK!', snd: 'cluck', h: 126 },
  domuz: { txt: 'OİNK!', snd: 'oink', h: 132 }, koyun: { txt: 'MEE!', snd: 'baa', h: 122 },
  uzayinek: { txt: 'MÖÖP!', snd: 'moop', float: true, h: 160, say: 'Bak, uzay ineği!' },
  uzayli: { txt: 'BİP BOP!', snd: 'bipbop', float: true, h: 140, say: 'Bak, uzaylı!' },
  uzunboyun: { txt: 'HUUU!', snd: 'dinoLow', bow: true, h: 150, hUp: 260, say: 'Bak, uzun boyunlu dinozor!' },
  ucboynuz: { txt: 'GÜM GÜM!', snd: 'dinoRoar', h: 135, say: 'Bak, üç boynuzlu dinozor!' },
  yengec: { txt: 'ÇIT ÇIT!', snd: 'snip', h: 90, say: 'Bak, yengeç!' },
  fok: { txt: 'ORK ORK!', snd: 'seal', h: 150, say: 'Bak, fok!' },
};
const animalSound = k => { const c = CAST[k]; if (c) Snd[c.snd](); };
const ANIMAL_SKIN = { uzayinek: { base: 'inek', body: '#9cff9c', spot: '#9b5de5', antenna: true } };
```
(The farm `snd` values match today's `animalSound` mapping at ~1815. The duck's double quack becomes the one-line `Snd.quack2()`.)
- `ANIMAL_TXT[o.kind]` usages (collide, doHonk) become `CAST[o.kind].txt`. The farm has no intro lines.
- **Tier A drawings (5):** `uzayli` (green, 3 eye stalks, waving arm), `uzunboyun` (see below), `ucboynuz` (frill, 3 rounded horns, stubby legs), `yengec` (red oval, eye stalks, claws open and close with `sin(t*8)`, scuttles ±10 px), `fok` (grey teardrop, clapping flippers, ball on its nose). **Skin (1):** `uzayinek`. `drawAnimal(kind, t, state, st, o)` gets an optional 5th argument.
- **Bowing long-neck:** the body back is ≤ 105 local units. The neck is a thick quadratic curve to a small smiling head. `o.bow` goes from 0 (head up, `hUp` 260) to 1 (head down in front at about (-120, -60), neck apex ≤ 150). In the collide loop, `if (CAST[o.kind].bow && o.state === 'idle') o.bow = clamp((700 - dx) / 400, 0, 1)`, so it is fully bowed by dx = 300, before the auto-hop at dx < 135.
- `float` (Uzay cast): the idle bob is 3× larger and slower, and honk-flee floats them up and away (`fleeTo = -380`, slow) like balloons.
- **Tier B:** `astroordek` (ordek skin + helmet, `quack2`), `bebekdino` (baby T-rex in eggshell "pants", `dinoBaby`), `marti` (ordek skin, white/grey, `gull`, `fly`: flees upward, wings flap), and `stomp` for `ucboynuz` (`shake = max(shake, 0.2)` once per race plus 3 `Snd.thud`).

### 4.6 The map (`Harita` scene)
**Layout (4 places, r 115):** Çiftlik (260,215), Uzay (1020,215), Deniz (260,520), Dinozor (1020,520). Hub garage at (640,395) (~90×80), car parked at (640,470). Bottom row: 🔧 (86,650,r48), 🔁 (770,650,r50), and *(Tier B)* 🎲 (560,650,r50).
Clearances I checked: medallions are 305 px apart vertically and 760 px horizontally. The top edge is y 100, and Uzay's centre is 221 px from ⛶ (1160,44), more than 115+28. Top-row mascot boxes end at y 344, above the bottom-row circle tops at 405. Deniz is 217 px from 🔧 (> 163). Dinozor is 282 px from 🔁 (> 165). Ribbon labels at y ~79-113 clear the HUD.

**Background:** ocean `#5ec8f2`, one big land blob (a closed Catmull-Rom through ~14 deterministic points, `#9be37b`, sandy rim `#f3d17c`), small trees and houses (`drawTree`/`drawHouse` at 0.4). *(Tier B:* scrolling squiggle waves and drifting clouds.)

**Roads:** quadratic Bézier paths from the hub to each medallion's rim, control points bent outward. Unvisited roads are dotted (`[2,18]`, lineWidth 10, cream `#fff3c4` over an `OUT` underlay). The active road gets yellow marching dashes (`lineDashOffset = -t*60`).

**Medallion:** shadow, cached vignette (§3.5), an 8 px white rim and a 4 px `OUT` ring, then the live mascot. **Mascot scale** = `min(0.7, 0.8 * r / poseH(m, 0.4))`. The long-neck is drawn at `bow = 0.4` (a friendly half-nod): `poseH` = 216, scale 0.43, ~92 px tall. Feet at `(cx + 0.5r, cy + 0.98r)`. **Hit test:** `Math.hypot(p.x-cx, p.y-cy) < r*1.08 || (|p.x - mx| < 75 && p.y > my - mh - 10 && p.y < my + 18)`.

**Growth rungs (long-term pull).** Ordered by visit count. A rung is drawn once `seen[k].n ≥ rung.n` **and it is not in `MapSave.pending`**:
```js
const RUNGS = [
  { n: 1, id: 'bayrak', say: 'Bayrak diktik!', badge: '🚩' },      // rimde dalgalanan bayrak, son arabanın renginde
  { n: 2, id: 'yol', say: 'Yol yapıldı!', badge: '🛣️' },           // o yerin yolu noktalıdan taşlı, dolu bir yola dönüşür
  { n: 3, id: 'arkadas', say: 'Yeni arkadaş geldi!', badge: null }, // maskot garajın yanına taşınır (rozet: maskot kafası)
  // Tier B: { n: 5, id: 'gokkusagi', say: 'Gökkuşağı çıktı!', badge: '🌈' }
];
```
- Flag: a pole plus a waving triangle at `(cx - 0.7r, cy - 0.7r)` (top-left, away from the mascot) in `COLORS[seen.c][0]`.
- Paved road: a solid cream band with a stone-dot border, replacing the dotted one.
- Friend: the mascot at scale 0.32 at its hub slot (ciftlik (520,455), uzay (760,455), deniz (530,545), dinozor (750,545)), waving. Hit circle r 46: hop plus sound. The car hit box (580-700 × 435-505) is checked first.
- **Reveal queue (nothing is ever lost):** `visit()` pushes `{k, id}` onto the **persisted** `MapSave.pending` (§7) whenever a rung is reached, however the next race was started (🔁, map or Garage). `Harita.enter` takes up to 3 entries, `this.rq = MapSave.pending.slice(0, 3)`, and schedules them in `vq` at 0.2 / 1.6 / 3.0 s. **An entry is removed from `pending` (and saved) at the moment its reveal starts.** Until then the rung stays hidden, so the child always sees it appear. If the child commits a trip before an entry's slot, that entry stays pending for the next map entry. A reveal that has already started finishes visually during travel (the scene keeps animating until `go(Drive)`), but its voice line is cut by the going line, because the child's choice wins.
- Each reveal lasts 1.2 s: scale 0 → 1.2 → 1, boing, sparkle, a confetti burst at the medallion, and the rung's forced `say`. For the friend rung, the mascot visibly walks along the road from its medallion to its hub slot.
- Across 4 places that is 12 visible changes over ~12 races in Tier A (16 with the Tier B rainbow).

**Scene object:**
```js
const Harita = {
  enter() { /* t=0, pop-in, VIG build (try/catch → emoji fallback), this.rq = MapSave.pending.slice(0, 3);
               this.vq = [...this.rq.map((r, i) => [0.2 + 1.4 * i, 'rung', r]), [0.2 + 1.4 * this.rq.length, 'go']];
               this.meds = BIOME_ORDER.map(k => medallion(k)); this.travel = null; leaving = false; focus = null; kbd = false;
               Music.play('harita'); */ },
  update(dt) { /* pump vq ('rung' → reveal + remove from pending + say(r.say, true); 'go' → say('Nereye gidelim?', true));
                  idle 👆 and prompt (only when !this.travel && !Voice.playing()), travel, zoom → go(Drive) */ },
  commit(k) { this.vq.length = 0; say(BIOMES[k].sayGo, true); this.startTravel(k); },   // tek giriş noktası: dokunma, 🔁, 1-4, Enter
  draw() { /* background, roads, rungs (pending gizli), medallions, mascots, friends, hub, car, focus ring, buttons, 👆 */ },
  click(p) { /* leaving → ignore; 🔧, 🔁; car (honk); friends; medallions (closest centre wins) → commit; else click+sparkle */ },
  key(e) { /* §5 */ },
  buttons() { return [this.back, ...(this.lastBtn.visible ? [this.lastBtn] : []), ...this.meds]; },
};
```
`medallion(k)` returns `{ k, x, y, r, press, hover, hit(p) /* union test */ }`. `draw` scales a medallion by 1.04 while `hover` is set. (`say(BIOMES[k].sayGo, true)` has no literal, so the scanner picks up the line from the `sayGo:` property.)

---

## 5. UI and controls (zero reading)

### Touch / mouse
| Target | Size | Action |
|---|---|---|
| Medallion + its mascot (4) | r 115 (hit ×1.08) ∪ mascot box | choose and travel (tap again = arrive now, tap another = re-target) |
| 🔁 last place | r 50 | travel to the last place (where 🏁 sits in the Garage) |
| 🔧 | r 48 | back to the Garage |
| Car at the hub | ~120×70 box | honk |
| Moved-in friends | r 46 | hop + sound |
| Elsewhere | none | `Snd.click` + sparkle |
| End: 🔁 / 🗺️ / 🔧 / mascot | r 64 / 58 / 50 / box | replay / map (with rung badge) / garage / sound |
| Drive: horn / tap car / tap road band | as today | honk **plus the land's trick** |
| Drive: volcano face (Dinozor) | circle r 95 at (1000,300), only above y 400 | burp, **and the lane-up tap still happens as today** |
| Drive 🏠 ×2 | r 28 (for parents) | to the map |
| *(Tier B)* 🎲 | r 50 | surprise spin |

### Keyboard
| Key | Map | End |
|---|---|---|
| 1-4 | `commit(BIOME_ORDER[n-1])` | honk |
| ← → ↑ ↓ | move focus to the neighbouring medallion (2×2 grid, wraps), mascot sound + `say(B.sayName)` (non-forced, skipped while `Voice.playing()`) | honk |
| Enter / Space | commit the focused place; **with no focus, the last place** (or Çiftlik) | Enter = replay, Space = honk |
| Backspace / Escape | Garage | map |
| any other letter | **only** moves focus to the next place, with the mascot sound and its name. It never commits | honk |
| Repeats | ignored (`e.repeat`) | as today |

In Drive, every key that honks today (Space, Enter, letters) also triggers the land's trick. The focus ring (a thick pulsing yellow ring at r 127) appears only after a key has been used. While `this.travel` is set, focus keys only make the mascot sound, so the going line is never cut.

---

## 6. Voice, SFX and music

### 6.1 New voiced lines (exact text, no apostrophes, each a one-line `say(…)`/`this.say(…)` literal or a `say…:` property)

**Tier A: 37 lines**
- Map: 1. `Nereye gidelim?` 2. `Bir yere dokun!` 3. `Hadi bir yer seç!`
- Rungs: 4. `Bayrak diktik!` 5. `Yol yapıldı!` 6. `Yeni arkadaş geldi!`
- End: 7. `Her yeri gezdik! Süpersin!`
- Places (`sayName`/`sayGo`): 8. `Çiftlik` 9. `Çiftliğe gidiyoruz!` 10. `Uzay` 11. `Uzaya gidiyoruz!` 12. `Dinozor vadisi` 13. `Dinozorlara gidiyoruz!` 14. `Deniz kenarı` 15. `Deniz kenarına gidiyoruz!`
- Arrivals (`THEMES.*.say`): 16. `Uzaya geldik!` 17. `Dinozor vadisine geldik!` 18. `Denize geldik!`
- Variants: 19. `Süper zıplama!` 20. `Uzaylılar bizi yıkadı!` 21. `Dinozor kuyruğu!` 22. `Yumurta çatladı!` 23. `Kumdan kale!` 24. `Plaj topu!`
- Animals: 25. `Bak, uzay ineği!` 26. `Bak, uzaylı!` 27. `Bak, uzun boyunlu dinozor!` 28. `Bak, üç boynuzlu dinozor!` 29. `Bak, yengeç!` 30. `Bak, fok!`
- Signatures: `const SIG = { hop: { say: 'Ayda zıplıyoruz!' }, rocket: { say: 'Roket gücü!' }, burp: { say: 'Yanardağ geğirdi!' }, squirt: { say: 'Yunus su fışkırttı!' }, dolph: { say: 'Yunus atladı!' } };` 31. `Ayda zıplıyoruz!` 32. `Roket gücü!` 33. `Yanardağ geğirdi!` 34. `Yunus su fışkırttı!` 35. `Yunus atladı!`. Tide (`this.say(` literals in `hitSpan`): 36. `Yüzüyoruz!` 37. `Karaya çıktık!`

**Tier B: 11 lines**: `Sürpriz yolculuk!`, `Gökkuşağı çıktı!`, `Ay tozu!`, `Kuyruklu yıldız!`, `Kocaman ayak izi!`, `Dinozor bizi yıkadı!`, `Yosun yapıştı!`, `Dalga geldi!`, `Bak, astronot ördek!`, `Bak, bebek dinozor!`, `Bak, martı!`. A Tier B line is added to the code only together with its feature, so `--missing` stays exact.

None collides with an existing slug (`--list` warns on collisions). Generate them with `FAL_KEY=… node tools/gen-voice.mjs` (or the fal MCP with the same endpoint and settings). Without a key, list them in the commit message; browser TTS covers them on devices that have a Turkish voice. Keep `comic('…')` on separate lines from `say(` (scanner rule 1).

### 6.2 Voice policy: one line at a time, nothing cuts anything (Drive)
**Every** line spoken in Drive goes through one method. Today's `say(…)` calls in `collide`, `hit`, `hitSpan`, `doHonk` and the countdown are rewritten as `this.say(…, pri)`, which keeps each literal on its line for the scanner:
```js
busy() { return this.t < this.vEnd || Voice.playing(); },
say(line, pri = 1, done) {                      // pri: 1 genel, 2 keşif, 3 anlatı
  if (!line) return false;
  if (!this.busy()) { Voice.say(line, true); this.vEnd = this.t + lineDur(line); if (done) done(); return true; }
  if (pri === 3) this.slot = { line, pri, done, exp: this.t + 2.5 };                                  // anlatı bekler, en yenisi kazanır
  else if (pri === 2 && (!this.slot || this.slot.pri === 2)) this.slot = { line, pri, done, exp: this.t + 1.2 };
  return false;                                  // genel cümle meşgulken düşer
},
// update içinde: if (this.slot && !this.busy()) { const s = this.slot; this.slot = null; if (this.t < s.exp) this.say(s.line, s.pri, s.done); }
const lineDur = l => clamp(0.45 + l.length * 0.065, 1.1, 2.6);   // en az bekleme; gerçek bitişi Voice.playing() söyler
```
- **Narrative (3):** arrival at green, gate, wash (a wash variant's line *replaces* the generic wash line), tide in/out, finish. These are **never refused and never cut anything**. If a line is playing, they wait in the slot for up to 2.5 s.
- **Discovery (2):** variant first-hit lines, animal intros, signature first uses. They wait in the slot for up to 1.2 s if it holds nothing more important. `done` marks them as said only when they actually play. Otherwise they are offered again at the next natural trigger: the variant's next hit, the animal's next frame while `300 < dx < 700` and `this.slot?.line !== line`, or the signature's next use. At most one intro per kind per race (`metKinds`).
- **Generic (1):** Hoop/Zıpla, Uçuyoruz, Sihir, Kaçtı, colour names, the mud/banana/paint/boost lines. They play only when the voice is free, otherwise they are dropped. When a variant's first-hit line plays, the generic line for that hit is skipped.
- `Voice.playing()` (§3.6) makes "busy" mean real audio, so a long recording is never cut by the length estimate.
- **Uzay opening (worked example, times approximate):** 0 s "Uzaya geldik!" (busy until ~1.4) → 0.8 s the first honk hops; "Ayda zıplıyoruz!" waits in the slot and plays at 1.4 (until ~2.5) → 2.2 s the roket launch: "Süper zıplama!" waits and plays at 2.5 (until ~3.4); the generic "Uçuyoruz!" is skipped → 2.9 s an air honk fires the rocket; "Roket gücü!" waits and plays at 3.4 (until ~4.2) → ~4.0 s the uzayinek is offered and plays at 4.2 → ~5.3 s the hop over it: "Hoop!" is dropped (busy) → ~6.8 s the boost: "Hızlı!" plays. **Every line is heard whole, one after another.**
- **Deniz, first tide (the round-2 failure case):** "Yüzüyoruz!" plays at tideIn. The child honks at once, the dolphin leaps, and "Yunus atladı!" waits in the slot. It plays when "Yüzüyoruz!" ends, if that is within 1.2 s, or else on the next leap. "Karaya çıktık!" later waits for whatever is playing, because it is narrative.
- **Farm:** its lines go through the same gate. In practice the only difference is that a generic line can no longer cut a forced one.

**Map:** the reveal and prompt queue `vq` runs on timers. `commit()` clears it and forces the going line, and while `travel` is set no other map voice source runs (§2.1). **End:** its single line waits for `!Voice.playing()` (max 2 s, §2.5).

### 6.3 New SFX (`Snd` methods, 1-3 lines each)
**Tier A: 12**
| Method | Recipe |
|---|---|
| `snip()` crab | 2× `tone(2400,0.03,{type:'square',vol:0.08})` 0.07 s apart + short highpass noise |
| `seal()` | 2× `tone(320,0.18,{type:'sawtooth',slide:220,ftype:'bandpass',q:4,filter:900})` + 2 clap noises |
| `moop()` | `moo()` shortened to 0.6 s + `sine` 400→900 uptick |
| `bipbop()` | `square` 880 0.1 s, then 660 0.1 s, `vib:[30,20]` |
| `dinoLow()` | `sawtooth` 90→70 0.9 s, `filter:500`, `vib:[5,8]` |
| `dinoRoar()` | `sawtooth` 420→180 0.5 s, bandpass `q:2`, `vib:[20,30]` (cartoon, not scary) |
| `ufo()` | `tone(600,1.0,{type:'sine',vib:[8,220],vol:0.12})` + `wiu()` |
| `burp(v=1)` | `tone(85,0.5*(0.5+v/2),{type:'sawtooth',slide:60,filter:300,vib:[25,20],vol:0.3*v})` + low noise puff |
| `rocket()` | `noise(0.5,{freq:1200,slide:300,vol:0.35})` + `tone(200,0.4,{type:'sawtooth',slide:700,filter:1500,vol:0.12})` |
| `boing2()` | `tone(220,0.5,{type:'sine',slide:900,vib:[16,50],vol:0.3})` |
| `vroom()` | `tone(110,0.9,{type:'sawtooth',slide:260,filter:700,vol:0.12})` |
| `quack2()` | `quack(); quack(0.2)` (today's duck sound, moved so `CAST` can name it) |

The existing `splash`, `boing`, `poof`, `magic`, `thud` and `bubble` cover the dolphin, hop, sandcastle, rung badge and tides.
**Tier B: 3**: `gull()`, `dinoBaby()` and `wave()` (`noise(1.0,{freq:800,slide:200,vol:0.4})` + a high hiss).

### 6.4 Music (`TRACKS`, same format: semitones from C5 on an 8th grid, `roots` per bar from C3): 4 (data only, Tier A)
```js
harita:  { bpm: 112, wave: 'triangle', vol: 0.05, roots: [0, 9, 5, 7],
  mel: [0, null, 7, null, 9, 7, 4, null, 5, null, 4, 2, 0, null, null, null, 7, null, 12, null, 11, 9, 7, null, 5, 7, 9, 7, 4, null, 2, null] },
uzay:    { bpm: 92, wave: 'sine', vol: 0.07, roots: [0, 8, 3, 10],
  mel: [0, null, null, 7, null, null, 12, null, 10, null, 7, null, null, null, null, null, 3, null, null, 10, null, null, 15, null, 12, null, 10, null, 7, null, null, null] },
dinozor: { bpm: 116, wave: 'sawtooth', vol: 0.02, roots: [0, 0, 5, 7],
  mel: [-12, null, -12, null, -5, null, -12, null, -9, null, -7, -5, -7, null, null, null, -12, null, -12, null, -5, null, -3, null, -5, -7, -9, -7, -12, null, null, null] },
deniz:   { bpm: 124, wave: 'triangle', vol: 0.05, roots: [0, 5, 7, 0],
  mel: [7, null, 7, 9, null, 7, 4, null, 5, null, 5, 7, null, 5, 2, null, 4, null, 4, 5, null, 4, 0, null, 2, 4, 5, 7, 9, null, 7, null] },
```
`Music.update` needs no changes.

---

## 7. Persistence

New key `cade-harita`, JSON, with try/catch on every read and write, validated on load like `cwLoad`:
```js
const MapSave = {
  seen: {},      // { [biomeKey]: { n: ziyaret 1..999, c: renk 0..COLORS.length-1 } }
  last: null,    // son gidilen yer: 🔁 ve Enter kısayolu
  allN: 0,       // "her yeri gezdik" kutlaması kaç yerle yapıldı (Ek A'da yer sayısı artınca bir kez daha)
  pending: [],   // [{ k, id }] haritada henüz gösterilmemiş basamaklar — kalıcı, en fazla 8
  load() { try { const d = JSON.parse(localStorage.getItem('cade-harita') || 'null'); if (!d || typeof d !== 'object') return;
    for (const k in d.seen || {}) if (BIOMES[k]) { const s = d.seen[k] || {}; this.seen[k] = { n: clamp(+s.n | 0, 1, 999), c: clamp(+s.c | 0, 0, COLORS.length - 1) }; }
    this.last = BIOMES[d.last] ? d.last : null; this.allN = clamp(+d.allN | 0, 0, 99);
    this.pending = (Array.isArray(d.pending) ? d.pending : []).filter(p => p && BIOMES[p.k] && RUNGS.some(r => r.id === p.id)).slice(-8);
  } catch (e) { /* yok say */ } },
  save() { try { localStorage.setItem('cade-harita', JSON.stringify({ v: 1, seen: this.seen, last: this.last, allN: this.allN, pending: this.pending })); } catch (e) { /* yok say */ } },
  visit(k) { const n = ((this.seen[k] || {}).n || 0) + 1; this.seen[k] = { n, c: car.color }; this.last = k;
    const r = RUNGS.find(g => g.n === n); if (r) this.pending = [...this.pending, { k, id: r.id }].slice(-8);
    const done = BIOME_ORDER.every(b => this.seen[b]); const celebrate = done && this.allN < BIOME_ORDER.length;
    if (celebrate) this.allN = BIOME_ORDER.length; this.save(); return { celebrate, rung: r || null }; },
  shown(p) { this.pending = this.pending.filter(q => q !== p); this.save(); },   // açılış animasyonu başlarken
};
MapSave.load();
```
- `visit()` is called in `hitSpan('finish')`, and its result sets `Drive.celebrateAll` and `Drive.rungEarned`. End reads `MapSave.pending` for the badge (§2.5).
- If `pending` overflows (more than 8 unrevealed rungs, about 8 replays without ever opening the map), the oldest entries are dropped from the queue. Those rungs are then simply drawn as already there, so nothing breaks.
- The flag colour follows the latest car colour on every visit.
- A few hundred bytes, so quota is not an issue.
- Debug: `__game.mapReset()` removes the key and resets the fields. `__game.mapVisits(k, n)` sets a count (with no pending entries), for screenshots of each rung.

---

## 8. Edge cases

1. **Farm theme rotation** uses `BIOMES.ciftlik.themes`, never `Object.keys(THEMES)`.
2. **`go(Drive)` without a biome** (debug, old paths) defaults to `ciftlik`, and `Drive.B` always exists.
3. **Map voice and reveals run on `update` timers**, never `setTimeout`, so nothing fires after leaving the map. `commit()` empties `vq`.
4. **Re-targeting mid-travel** rebuilds the path from the car's current position. Its going line is the only allowed cut (the child's own new choice).
5. **Double tap on the same medallion** arrives now. Taps during the 0.25 s zoom are ignored (`leaving`), so `go(Drive)` can't fire twice.
6. **🔁 during travel** re-targets to the last place.
7. **Garage 🏁 double tap:** the second tap lands at (770,650). If 🔁 is visible it travels there; if not, it is an empty-map sparkle. Both are fine.
8. **Staying on screen in Uzay:** the rocket caps the peak at `max(300, z)`, and z itself never exceeds the 294 px ramp peak, so the top-lane car bottom is at y ≥ 170 and car + hat reach y ≈ 40. A hop peaks at 115. `comic()` already clamps.
9. **Height budget for road animals:** the auto-hop peaks at 720²/(2·2300) ≈ 113 px (Uzay: 540²/1840 ≈ 158 px). At lane scale ≤ 0.68, an animal must be ≤ 160 local units tall in its hop pose. `CAST.h` records this, and the art sheet draws a guide line at -160. **A low airborne car bounces over an animal instead of passing through it** (§3.2), which covers a hop coming down.
10. **Airborne passes:** decals are skipped above z 60, and gifts and balloons above z 120 (as today). Flying over something is a miss, never a loss. Uzay's high star rows reward the air.
11. **Tide landing:** a jump can land in the water (a boosted ramp jump carries ~765 px, more than the ±320 reserve). Spans fire by x regardless of height, so `swim` is already set, and the landing becomes a big splash instead of a thud. It is intended and funny.
12. **Volcano gummies:** `insertObj` keeps `objs` sorted. It runs only from `doHonk`/`click`, never inside the `collide` loop. Gummies past `L - 200` are skipped. There are at most two shakes per race.
13. **Volcano tap and lanes:** the volcano hit area is entirely above y 400, which is lane-up territory for every lane. The tap burps and the lane logic runs unchanged.
14. **Honking during the countdown or after the finish:** `biomeHonk` doesn't run (plain honk, as today).
15. **Dolphin spam:** one dolphin at a time (`this.dolph`), and stars are limited by `sigStar` (one reward per 4 s).
16. **Mute:** voice and music are silent (`Voice.playing()` is false, and the `lineDur` floor still paces lines), and everything visual still works.
17. **Stuck `Voice.playing()`** (an iOS utterance with no `onend`): ignored 4 s after the last `say`.
18. **Audio before the first gesture:** the map is reached from a Garage tap or key, so audio is already unlocked.
19. **localStorage blocked, corrupt, or with unknown keys/rung ids:** ignored and filtered. With storage blocked, `pending` still works in memory for the session.
20. **Vignette cache** uses no text (the fallback emoji is drawn live, not cached). It is wrapped in try/catch.
21. **`let ctx`:** `withCtx` restores in `finally`, and `frame()` resets the main transform every frame.
22. **Particles:** `go()` clears `P`, so the arrival poof is dropped, as intended.
23. **Performance:** the map per frame costs about the same as the Garage picker. Land scenery stays at or below today's farm path count. The tide is 1 band + 3 strokes + 1 ellipse.
24. **Title** keeps the farm (`drawWorld(t*300)`), unchanged.
25. **Phase 2** adds places to `BIOME_ORDER`. Old saves still load, and the set is celebrated once more.

---

## 9. Implementation plan (playable after every step)

Each step ends with a browser check through Playwright or the console (`__game.biome('uzay')`, `__game.go(__game.Harita)`) while watching the console, because `frame()` swallows exceptions. `__game.voiceLog()` turns on logging of `[t, line, pri, played|queued|dropped]` for every voice decision.

### Tier A: must ship (≈ 1,000 game.js lines, about +33%, plus ~30 README lines)
This is one long, focused session. The order makes sure that if time runs out, what exists is coherent and shippable.

| # | Step | Where in game.js | Est. |
|---|---|---|---|
| 0 | Prep: `let ctx` + `withCtx()`; `DECAL_TYPES`; `DEFAULT_TABLE`; the **forced-first fix**; scanner one-liner; `Voice.playing()`; `--list` unchanged | top, ~330, ~2323, tools | 30 |
| 1 | **Voice gate**: `Drive.busy/say/slot/lineDur`, rewrite every Drive `say(` as `this.say(…, pri)`, End voice timer, `voiceLog`. The farm must sound the same | Drive, End | 35 |
| 2 | Data: `BIOME_ORDER`, `BIOMES`, `MAP_LAYOUT`, `VARIANTS` (6 stubs + 6 tints), `CAST` + `poseH` + `ANIMAL_SKIN` + `animalSound`, `SIG`, `RUNGS`, 3 `THEMES` | new `// ==== diyarlar` ~1819; THEMES ~1607 | 70 |
| 3 | Drive parameterization: enter, `grav/jumpK`, `buildCourse(B)` (arc, high stars, tramp, `o.v`, tide reserves), tramp collide/hit/default renderer, variant hooks + tints, animal bounce-over, decal z-skip, intros, bow update, HUD icons. **Every land is now playable with default visuals** | ~2323-2870, ~1448 | 140 |
| 4 | **Signature interactions**: `biomeHonk`, hop + rocket, `burp` + `drop/insertObj` + volcano tap, `sigStar`, `sig`, tides + swim + water band + lip + splash landing, dolphin squirt + leap-over | Drive | 150 |
| 5 | Harita scene + flow: layout, hub, roads, medallions (emoji fallback first), union hit test, `commit`, travel/re-target, 🔁/🔧, 👆 + idle prompt, focus ring, keys, `vq`; `MapSave` + `pending` + `visit()` + rungs 1-3 + reveal queue; Garage → map; End 🗺️ + mascot + badge + `celebrateAll`; Drive 🏠 → map; `__game` additions | new `// ---- Harita` after Garage (~2044) | 240 |
| 6 | Icon helpers + `BIOME_ART` for 3 lands (dispatcher, road colours, 3 props each) + 4 **vignettes** | after `drawWorld` ~1670 | 170 |
| 7 | Animals: 5 drawings + 1 skin, `float`, `bow` | `drawAnimal` ~1672 | 100 |
| 8 | 6 Tier A variant renderers + their `fx` | `VARIANTS` | 60 |
| 9 | Audio: 12 SFX, 4 tracks | `Snd` ~255, `TRACKS` ~266 | 35 |
| 10 | Art sheet (§10.1), screenshots, fix or fall back | debug helper near `__game` | 20 |
| 11 | Voice: `--missing` lists exactly the 37 Tier A lines; generate them (FAL_KEY or the fal MCP); check `playRecording` | voice/ | none |
| 12 | README.md (Turkish): "Harita ve diyarlar" (places, the horn trick in each, controls, the growing map) | README | 30 |

The signature interactions (step 4) come **before** the map and the art. Even with flat visuals, the three lands already play differently, and that is the core of the direction.

### Tier B: polish (≈ 260 lines), in this order, any prefix can ship
1. The 6 reskin variants' art, effects and lines (`aytozu`, `kuyruklu`, `ayakizi`, `dinodus`, `yosun` + strand blobs, `dalga`, plus `wave()`): ~80
2. Third animal per land (`astroordek`, `bebekdino`, `marti` + `fly`) and `ucboynuz` `stomp`, plus their SFX and lines: ~70
3. 🎲 Sürpriz with its line: ~25
4. A 4th prop per land (flag, bones, lifeguard tower): ~30
5. Rung 5 rainbow + gold star and its line: ~15
6. Ambient volcano burps, idle medallion "calls", map waves and clouds: ~40

**Not cuttable** (Tier A): the map with 4 places, composed vignettes (or their emoji fallback), travel, 🔁, rungs 1-3 with the reveal queue and End badge, persistence; the three lands' palettes, 3 prop types each, road colours, and arrival lines; the 6 Tier A variants; 2 animals per land with sounds and intros; **the three signature interactions in their always-available form**; Uzay low gravity; the voice gate; the 4 tracks; the 37 voice lines.

The biggest risk is the art (steps 6-8, ~330 lines, down from ~480). The art sheet and the per-asset fallbacks in §10.1 cap it: a fallback is a skinned farm shape of 5-10 lines, so a drawing that won't read costs minutes, not the session.

**Phase 2 (a separate session, Appendix A):** Orman and Şeker. The code is shaped so phase 2 only adds data, art and one layout entry.

Deployment: no new top-level files (only `voice/*.mp3`, which is already copied), so `pages.yml` is unchanged.

---

## 10. Acceptance criteria

### 10.1 Art acceptance (per asset, before calling the art done)
- `__game.artSheet()` swaps in a temporary debug draw that renders, on a light road-coloured background: every new animal **at lane scale 0.56 and 0.68** in idle, duck and (for the long-neck) bow 0/0.4/1 poses, **next to the farm `inek` and `ordek`**; every Tier A variant at lane scale; each land's props at `drawWorld` scale; the 4 vignettes **with their mascots in place**; and End's mascot pose for each land. A dashed guide line marks -160 local units. Take a Playwright screenshot.
- Every asset must pass:
  1. **Reads at 0.56:** someone who hasn't seen the code (a parent, or a fresh subagent shown only the screenshot) can name it in one or two words. For the vignettes: they can name the **place** from the circle alone ("volcano/dinosaurs", "space", "sea/beach", "farm").
  2. **Same family as the farm:** `OUT` outline at lineWidth 4 local (5 for big props), flat saturated fills, no gradients except sky and sea bands, eyes drawn with `eye()`.
  3. **Height budget:** below the -160 line in the hop pose.
  4. **No detail thinner than ~6 screen px at 0.56**, and ≤ 25 path operations.
  5. **Vignettes:** the iconic element (volcano / Earth + planet / sea + sailboat / barn) is fully inside the circle and not covered by the mascot.
- **Fallback rule:** each drawing is time-boxed to ~15 minutes, with one revision if it fails. If it still fails, ship its fallback: `uzayli` → `koyun` skin, green wool, antenna; `uzunboyun` → `inek` body green, no spots, plus a neck stroke and head circle; `ucboynuz` → `domuz` skin green-orange plus a frill disc and 3 horn triangles; `yengec` → `domuz` skin red, `scale(1.2,0.6)`, plus 2 claw circles and eye stalks; `fok` → `domuz` skin grey, no ears, plus the ball. For props and variants: drop detail until one silhouette plus one accent reads. For a vignette: the emoji fallback.

### 10.2 Flow
- [ ] Garage 🏁 / Enter opens the map. "Nereye gidelim?" plays once, the 4 medallions pop in with live mascots, and the car stands at the hub.
- [ ] Tapping a medallion **or its mascot** gives sound, voice and a reaction within 100 ms. The car drives the lit road in ~1.1 s, and the race starts in that land. Tap again to arrive now; tap another to re-target smoothly.
- [ ] **Commit-at-frame-0 test:** tapping Uzay at t < 0.1 s on a map entry with 2 pending rungs plays "Uzaya gidiyoruz!" whole, with no "Nereye gidelim?" or rung line after it (check with `voiceLog`), and both rungs are still pending on the next entry.
- [ ] 🔁 appears after the first visit and goes to the last place, and double-tapping 🏁 in the Garage reaches it. 🔧 goes back to the Garage.
- [ ] End shows 🔁, 🗺️ and 🔧, with the mascot dancing head-up (long-neck fully visible, top ≥ y 380). Drive 🏠 ×2 goes to the map.
- [ ] Keyboard: 1-4 commit; arrows move a visible focus ring with mascot sound and name; Enter/Space go (with no focus, to the last place); Esc/Backspace go to the Garage; random letters only move focus and never start a trip.

### 10.3 Lands
- [ ] Uzay, Dinozor and Deniz each have their own sky, far and near layers, 3 prop types, ground, road colours, track and arrival line. A screenshot of any two is unmistakably different.
- [ ] **Each race's first three events are exactly the land's `first` list** (build 50 courses per land in the console; the first three non-star types always match). The farm always opens gift → animal → ramp.
- [ ] Every Tier A variant renders with its own art, comic word, sound and first-hit line, and keeps its base no-lose behaviour. The Tier B tints render in land colours without errors.
- [ ] **Uzay:** a ground honk hops (~115 px, ~1 s). An air honk fires the rocket once per airtime (climb + extra spin, lands upright, stays on screen). High star rows exist and can be collected by hopping, and are not collected on the ground. A ramp jump floats (~1.6 s, a 6-star arc). A hop that comes down near an animal bounces over it with no visible overlap.
- [ ] **Dinozor:** honking or tapping the volcano makes it burp (face, PÜF) and drops 5, then 3, catchable gummies. **Honking non-stop for a whole race gives ≤ 2 screen shakes and ≤ 6 big burps**, and every honk during the cooldown gets the small puff. A volcano tap while in lane 1 or 2 also moves the car up one lane (as before). The long-neck is fully bowed before the hop, and the car clears it.
- [ ] **Deniz:** a honk on land makes a dolphin leap from the sea and squirt the car, and mud is cleared. At ~30% and ~64% the road floods, the car swims (bob, wake, water lip) and comes back to land. A honk while swimming makes the dolphin leap over the car. Landing a jump in the water splashes. The plaj topu bounces the car. Non-stop honking yields at most one signature star per 4 s.
- [ ] The farm plays as before: same table, ramp stars, theme rotation (day, sunset, night, snow only) and lines. The only changes are the guaranteed opening and that lines can no longer cut each other.

### 10.4 Voice
- [ ] With `voiceLog` on, in the first 15 s of each land (and through both Deniz tides, honking constantly), **no `played` entry starts while `Voice.playing()` is true**. Every narrative line is `played` (directly or from the slot within 2.5 s). Discovery lines are `played` or retried later, never cut.
- [ ] After an animal intro, the generic "Hoop!" is not heard for that hop.
- [ ] End's line starts only after the finish line has ended.
- [ ] Completing the set plays "Her yeri gezdik! Süpersin!" instead of the usual End line, exactly once.

### 10.5 Persistence and growth
- [ ] Visits 1, 2 and 3 to a place each add their rung (flag in the car colour, paved road, friend at the hub). Each one animates **once**, with its line, on the next map entry, and stays hidden until then.
- [ ] **Replay-loop test:** from a fresh save, race Uzay, then press End 🔁 twice (3 visits, never opening the map). Each End shows the 🗺️ badge. Opening the map then reveals flag → road → friend in sequence with their lines, followed by "Nereye gidelim?". A reload in between loses nothing.
- [ ] Corrupt or missing `cade-harita` never throws, and the map still works.

### 10.6 Quality
- [ ] No console errors through a full loop of all 4 places (Garage → map → race → End → map ...).
- [ ] `node tools/gen-voice.mjs --list` still contains all 126 old lines, and `--missing` lists exactly the 37 Tier A lines before generation and 0 after.
- [ ] Child-facing tap targets are ≥ r 46, and nothing overlaps the HUD buttons at y 44.
- [ ] Smooth on iPad (no `shadowBlur`/`filter`, cached vignettes, particles within the cap).
- [ ] README.md (Turkish) documents the map, the places, the horn trick in each, the growing map and the controls.

---

## Appendix A: Phase 2 (separate session): Orman and Şeker Diyarı

Not built in this session. Everything below plugs into the Tier A structures as **data + art + one layout entry + one `biomeHonk` branch**.

- **Layout:** `MAP_LAYOUT[6] = { r: 100, pos: { ciftlik: [200,250], orman: [470,170], uzay: [810,170], seker: [1080,265], dinozor: [1050,548], deniz: [230,545] } }`. The hub stays at (640,420). Phase 2 must re-check the mascot boxes, the vignette compositions at r 100 and the bottom-row buttons.
- **Orman** (bear mascot). Palette: sky `['#7ec8e3','#e6f7d9']`, dark green pointed mountains, round forest hills, pines, a giant red mushroom, a stump, a blinking owl, a dirt road `#8a6a48`, falling-leaf overlay. Cast: `ayi`, `sincap`, `tavsan`. Variants: `yaprak` (mud), `kutuk` (ramp), `mantar` (tramp), `selale` (wash). **Horn verb (always available):** honking shakes the roadside trees and acorns rain onto the road, and a squirrel scurries after them (rate-limited like the volcano). Track `orman` (bpm 108). Lines: `Orman`, `Ormana gidiyoruz!`, `Ormana geldik!`, `Yapraklar uçtu!`, `Kütük rampası!`, `Zıp zıp mantar!`, `Şelale!`, `Bak, ayı!`, `Bak, sincap!`, `Bak, tavşan!`, `Palamutlar düştü!`.
- **Şeker Diyarı** (gummy-bear mascot). Palette: sky `['#ff9ed8','#ffe3c2']`, cotton-candy clouds, striped candy hills, mint frosting, lollipop trees, candy canes, a chocolate road with candy-cane curbs, sprinkle overlay. Cast: `joleayi`, `kurabiye`, `pembekoyun`. Variants: `cikolata` (mud), `jole` (banana wobble), `sakiz` (tramp **with a backflip**), `gofret` (ramp), `pamuk` (wash). **Horn verb (always available):** honking blows a bubble-gum bubble on the hood that grows with each honk and pops on the third, with sprinkle confetti and a star. Track `seker` (bpm 138). Lines: `Şeker diyarı`, `Şeker diyarına gidiyoruz!`, `Şeker diyarına geldik!`, `Mmm, çikolata!`, `Titrek jöle!`, `Sakız zıplattı!`, `Pamuk şeker!`, `Bak, jöle ayıcık!`, `Bak, kurabiye adam!`, `Bak, pembe koyun!`, `Balon patladı!`.
- Extra SFX: `bear, chirp, hop, jelly, giggle, rustle, pop2`.
- Saves from phase 1 stay valid (`pending` entries for unknown keys are filtered), and `allN` re-arms the set celebration for 6 places.
