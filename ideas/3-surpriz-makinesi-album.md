# Sürpriz Makinesi ve Çıkartma Albümü

> Stars carry over into a glass piggy bank in the Garage that feeds a gumball Sürpriz Makinesi; every crank pops a capsule with an exclusive car part, a living sticker for the album, or a joke capsule, and everything persists.

## Evaluation history

| Round | Consistency | Design | Entertainment | Avg |
|---|---|---|---|---|
| 1 | 7.5 | 7.5 | 8 | 7.67 |
| 2 | 8.5 | 8 | 7.7 | 8.07 |

**Status:** not chosen — best avg 8.07 (target was 8.5; "Yolcu Partisi v2" reached it first and was implemented instead).

_Note: the plan below is the latest revision written after the last scored round; that revision was not scored again before the selection was made._

---

# Direction 3: Sürpriz Makinesi ve Çıkartma Albümü (plan v3)

> One-line pitch: stars finally *go somewhere*. They pour into a glass piggy bank in the Garage, and the piggy bank feeds a giant gumball **Sürpriz Makinesi**. Every crank pops a capsule that holds one of three things: an exclusive car part, a sticker that jumps out alive before it is slapped flat, or a joke capsule (one of them is a runaway animal you catch). Stickers do not just sit in a book: the child **sticks one on the car**, where it rides along in the race and joins the horn, and the dressed-up animals from the album start appearing on the road. Every crank gives something, nothing can be lost, and the car, the bank and the collection all persist.

### What changed since v2 (short)
- **Stickers are used, not just collected.** One sticker slot on the car: in the album the child taps a sticker, then taps the car, and it slaps on as a die-cut decal clipped to the body like the pattern. It shows in the Garage, the pickers, Drive and End, and when the car honks the sticker joins in (the cow sticker moos after every horn). The sticker is saved with the car.
- **The race gets more fun, not just the meta loop.** (1) The sticker on the car rides along and honks with you. (2) Six of the 18 stickers are now **new silly characters**: four **dressed-up animals** (Taçlı inek, Kovboy ördek, Aşçı tavuk, Korsan domuz), Uzaylı and Ahtapot. Once a dressed animal is owned, half of that species on the road wear the same hat, and the hat pops up when they flee from your horn. (3) The gold-wheel and dino-horn signatures stay. Low-surprise stickers (ramp, mud, paint, star, gift, cloud, magic gate) are cut.
- **The runaway animal can really be caught.** The overlay closes, the animal runs along the Garage floor in front of the car with two "look at me" pauses, and a tap anywhere near it (r 100) or any key catches it: hug bounce, its sound, hearts, `'Yakaladın!'` and +5 stars that fly into the pig. If nobody catches it, after 4 s it waves and trots off. Nothing negative happens.
- **Exact joke staging:** each joke has a timed script (overlay close, gag, input rules, end) in §2.3.
- **Won parts stay won.** A new "magic rule": random *magic* events (gift pickup, magic gate, the `sihir` capsule) never replace a category that is wearing an exclusive part; the part gives a ✨ ding instead. Only the child's own actions (picker, 🎲, keys) can take it off.
- **Speech fixed properly.** `Voice.until` is derived from the real clip (mp3 `buffer.duration + 0.3 s`; TTS `max(3.2 s, 1.0 s + 90 ms/char)` as a cap, cleared by `onend`), so a long line is never cut. Queued lines no longer touch `Voice.last`, so a child's picker name is never throttled by narration.
- **One hint at a time.** On the very first visit the opening line is the gift line instead of 'Arabanı değiştir!', the 👇 over the knob is the only hint, and the 👈/🏁 pulse wait until the first crank is done. Later visits show 👇 only for the first 8 s and the 👈 only after 9 s.
- **Deposit stars come out of the 🏁 button** (the race they were earned in) and arc into the pig, instead of from an empty corner.
- **Less risk, fewer lines.** No `let ctx`, no `withCtx`, no offscreen sticker cache: owned stickers are drawn live on a white die-cut blob, missing ones as a faint ghost (alpha 0.2) under a dashed outline and "?". Cut: the candle-crown car-wash gag (and its `CANDLE_OUT` flag), the gold colour (so the paint pickup code stays untouched), the glitter horn, the album "slap" animation (now a stretch item) and the crank drag (now a stretch item). Exclusive parts are now 6. Core budget is about 870 lines instead of 900-980.
- **Parents can reset on an iPad:** hold 🔊 for 5 s on the Title screen, then hold a big 🗑️ for 3 s. Mute is now persisted too (3 lines).
- **Shorter cranks:** 5.8 s full / 3.6 s fast with no input (was 6.5 / 4.1).

---

## 1. Vision: why this is fun for a 4-year-old

- **Collect-and-reveal is very strong at this age.** Kinder eggs, gumball machines and sticker books all work on three beats: *anticipation* (crank, rattle, wobble), *surprise* (pop!) and *ownership* ("that's MINE now"). The game has lots of juice but no memory: the star counter resets every race and the car is forgotten on reload.
- **Sticker joy is in the sticking.** A four-year-old does not want a sticker in a book, they want it on their stuff. Here the favourite sticker goes on the car, rides in every race, and moos or quacks along with the horn. The collection feeds the core toy (the car) instead of living beside it.
- **Cause and effect a toddler can see.** Stars fly out of the 🏁 into a see-through pig, and the pig fills up. Stars fly from the pig into the machine, and a capsule falls out. Every step is a physical object moving on screen, with no numbers or text.
- **Surprise and laughter.** A sticker capsule bursts out as a real cow that moos and hops before it is slapped flat with a *thwap*. Every fourth crank is a joke: an animal escapes and you catch it, a fart cloud puffs out and the car farts back, or a magic burst makes the whole car over.
- **The road changes because of the collection.** Win "Kovboy ördek" and cowboy ducks start waddling on the road. Win the dino horn and fleeing animals jump twice as high. The child's sticker is on the car door in every race.
- **Zero failure.** Every crank gives something, every finished race earns at least one crank, and tapping the machine without enough stars still pops a bouncing gumball. The game never says "no". An uncaught runaway animal just waves goodbye.
- **Silhouettes show what is missing without words.** A faint ghost picture with a "?" is a wish a non-reader understands right away: "I still need the octopus!"
- **Exclusive parts feel special and stay.** Gold wheels and the dino car wear a ✨ badge in the pickers, and magic on the road cannot take them away.

---

## 2. Player experience, moment by moment

### 2.1 First launch (fresh save)
1. Title → ▶️ → Garage. The **glass pig** (left, x 290) already holds 20 stars as a welcome gift. The **Sürpriz Makinesi** (right, x 1010) blinks its bulbs and one capsule lamp is lit.
2. **Only instruction:** `say('Sana bir hediye var! Makineyi çevir!', true)` replaces 'Arabanı değiştir!' on this visit (rule: `SAVE.cranks === 0`). A big 👇 bobs right above the knob. The 👈 hint and the 🏁 pulse are suppressed until the first crank has finished; 🏁 itself still works.
3. The child taps the machine or presses `9`. **Full crank** (the first one of this Garage visit):

| Phase | Full | What the child sees and hears |
|---|---|---|
| turn | 0.8 s | The red knob turns 360° with 4 ratchet clicks (`Snd.crank`), the gumballs in the globe jiggle. 10 stars (2 each) fly one by one from the pig's coin slot (290,404) in an arc into the machine slot (1055,518), each with a rising `Snd.coin(k)`. The pig squashes slightly and its pile drops. Voice: `'Çevir çevir!'`. |
| drop | 0.3 s | A capsule falls down the chute with `Snd.clunk`; the flap swings open. |
| roll | 0.3 s | It rolls onto the floor and bounces once (small `Snd.boing`). |
| fly | 0.4 s | The screen dims (dark violet, 55%). The capsule zooms to (640,330), growing 0.5× → 1.8×. Voice: `'Dokun, açılsın!'` (first 3 cranks ever) or `'Ne çıkacak acaba?'`. |
| wobble | 3 taps, or 1.4 s | The capsule wobbles and rattles (`Snd.rattle(k)`). Each tap adds a crack, a bigger wobble, a sparkle and a louder rattle. |
| open | 0.3 s | The halves fly apart (top spins up, bottom drops), `Snd.pop` + `Snd.fanfare`, 60 confetti, a ring burst. Rotating rays start behind the prize. |
| show | min 1.0 s; auto at 1.8 s (but not before the prize-name line has *started*, capped at 3.0 s) | The prize, big, bobs on the rays. |
| apply | 0.5 s | A part flies to the car and is equipped; a sticker shrinks into the 📖 button. |

   **Total with no input: 0.8+0.3+0.3+0.4+1.4+0.3+1.8+0.5 = 5.8 s.** With eager tapping about 4 s.

   - **Show, part:** a mini copy of the current car wearing the new part (`Object.assign({}, car, {[key]: i})`, scale 0.75) spins slowly on the rays. Voice `'Yeni parça!'`, then the name from CATS (`'Altın tekerlek'`). Horn part: the horn icon big, `'Yeni korna!'`, and the horn honks twice with its comic text.
   - **Show, sticker ("live then flat"):** for 0.9 s the subject *acts* (cow hops and moos with its `ANIMAL_TXT` comic, the banana slides with `Snd.wiu`, the balloons pop one by one, the octopus wiggles with bubbles). Then it squashes to 10% height, *thwap* (`Snd.stick`), and springs back as a flat sticker on a white die-cut blob with a sparkle. Voice `'Yeni çıkartma!'`, then `st.say` (`'Kovboy ördek'`).
   - **Apply, part:** flies to `Garage.partPos(key)`, `car[key] = i`, `afterChange(key)` (poof, jump, squash). The child sees the gold wheels on the car at once.
   - **Apply, sticker:** flies, shrinking, into 📖; the book flaps and its red dot pulses. First 2 stickers ever: `'Albüme yapıştıralım!'`.
4. When the first crank ever ends: `Talk.say('Arabanı değiştir!')`, and the hint clock restarts (`this.hintT0 = this.t`), so 👈 / 🏁 pulse come 9-10 s later.

### 2.2 Repeat cranks in the same visit (fast mode)
Once `Garage.cranksHere ≥ 1`: turn 0.5 s (5 stars × 4), drop 0.25 s, no roll, fly 0.3 s straight from the chute, **one tap opens**, wobble ≤ 0.7 s, open 0.3 s, show min 0.7 / auto 1.2 s, apply 0.35 s. **3.6 s with no input, about 2.4 s with a tap.** Only the prize name is spoken (no 'Çevir çevir', no 'Ne çıkacak'). Three banked turns take about 13 s untouched, 9 s with taps. Banked turns never expire, so the child can stop and race at any time.

### 2.3 Joke capsules: exact staging (every 4th crank)
All times are measured from the end of the **open** phase. While a joke runs, Garage buttons, pickers and 🏁 are drawn at alpha 0.45 and ignore taps; only the joke reacts. The longest joke blocks input for 5.5 s.

**`kacak` — the runaway animal (catchable)**
| t | What happens |
|---|---|
| 0-0.5 s | A random farm animal (wearing its hat if the child owns its dressed sticker) springs out of the capsule with its sound and `ANIMAL_TXT` comic, arcs down to the floor at (980,660). The overlay fades out over 0.3 s. `Talk.say('Kaçak hayvan! Yakala!')`. |
| 0.5-4.5 s (chase) | It trots along the floor **in front of the turntable** (ground y 660, scale 0.55, about 110×95 px, drawn after the car and the buttons), legs in `'flee'` state, a dust puff every 0.25 s. Route: 980 → 640 at 260 px/s, **pause 0.7 s** at x 640 in front of the car (it looks at the child, wiggles, makes its sound), → 330, **pause 0.4 s** and turn, → back right until the chase ends. |
| catch | Hit circle **r 100 around (x, 615)**, or **any key**. Hug bounce (two squashes), animal sound, `comic(ANIMAL_TXT)`, 12 hearts + sparkle, `Talk.clear(); say('Yakaladın!', true)`. **+5 stars:** `SAVE.bank += 5; saveGame()` right away, then 5 flystars arc from the animal into the pig slot. After 1.0 s it hops off to the nearest edge (0.6 s). |
| miss tap | A tap outside the hit circle makes the animal leap up in surprise (hop 40 px, its sound, max once per 0.4 s) plus a sparkle at the tap point. Still a reaction, never a "no". |
| no catch by 4.5 s | It stops in front of the car, hops twice waving, makes its sound and trots off right at 900 px/s (0.9 s). No voice, nothing lost. |

Total: at most 0.5 + 4.0 + 1.0 = 5.5 s after open, usually 2-3 s because catching is easy.

**`pirt` — fart capsule**
| t | What happens |
|---|---|
| 0 | The capsule turns into a green cloud at the centre (8 particles in the horn-3 cloud style, size 40-70), `Snd.fart(0,1)`, `comic('PIRT!', 640, 260)`, `Talk.say('Pırt kapsülü! Hah ha!')`. |
| 0.5 s | The overlay fades out over 0.3 s. |
| 0.7 s | **The car answers:** `car.squash = -0.5`, `car.hatV += 400`, 4 small clouds at its trail anchor, `Snd.fart(0, 0.6)`. |
| 1.6 s | Done. Taps during it add one more puff with a small fart (at most 3, ≥ 0.25 s apart). |

**`sihir` — magic makeover**
| t | What happens |
|---|---|
| 0 | Star burst at the centre (30 sparkles), `Snd.magic`, `Talk.say('Sihirli kapsül!')`. |
| 0.2 s | The overlay fades out over 0.3 s; 12 sparkle flystars arc from (640,330) to the car (640,460), 0.45 s. |
| 0.65 s | `randomAll(true)`: the quiet variant skips its own voice line and uses the **magic rule** (§4.5), so exclusive parts stay. Double confetti and a poof on the car. |
| 1.4 s | Done. Taps only add sparkles. |

Jokes never repeat back to back (`SAVE.lastJoke`). The first time everything is collected, the joke is preceded by a 1.5 s celebration: fanfare, 150 confetti, `'Her şeyi topladın! Konfeti partisi!'`.

### 2.4 After a race (the main loop)
1. **End:** the trophy and star counter count up as today. When the count-up finishes, the **trophy shoots bonus stars** into the counter (`bonus = max(10, 20 - stars)`), each with a ding. The full deposit (`stars + bonus`) is banked and saved in `End.enter()`, so a closed tab loses nothing.
2. 🔧 gets a small capsule badge (red/white half ball) and pulses. Voice via `Talk`: `'Harikaydın! Bir daha oynayalım mı?'` at 0.4 s, then `'Sürpriz seni bekliyor!'` after it has ended. 🔁 works as before; the bank keeps growing.
3. **Garage with a pending deposit:** `say('Arabanı değiştir!', true)`, then `Talk.say('Yıldızlar kumbaraya!')`. **The stars pop out of the 🏁 button** (770,650), which bounces (`press = 0.6`) with a soft pop every third star, and arc into the pig's slot (290,404): at most 30 flystars, 0.06 s apart, 0.6 s each, a coin ding and a pig squash per landing. Lamps light as turns become available. 🏁 stays tappable.
4. The child cranks (§2.1 / §2.2), or goes straight back to racing.

### 2.5 Not enough stars (bank < 20): consolation
The knob jiggles and one gumball pops out of the chute (a `circle` particle with gravity and bounce), boinging three times across the floor with a rising `Snd.boing`, then fading. The pig jingles (`Snd.coin` ×3) and its stars bounce. 🏁 pulses with 👈. Voice: `Talk.clear(); say('Hadi yıldız toplayalım!', true)`. 1 s cooldown, so mashing keeps popping gumballs. This only happens after the bank has been spent, because every finished race refills at least one turn.

### 2.6 Album (📖) and the car sticker
1. Tap 📖 (290,652,r50) or press `Tab` → `go(Album)`. A big spiral-bound book on a wooden table; on the right, the child's car stands on a little podium. Voice: `Talk.say('Çıkartma albümü!')`.
2. It opens on the page of the first fresh sticker (else the last viewed page). Fresh stickers on the shown page sparkle and say their names (first 3 via `Talk`), and are then removed from `fresh` (saved).
3. **Two pages** of 3×3 big slots (270×170): **🐄 Hayvanlar** and **🎈 Komik şeyler**, switched by two big tabs on the right.
4. **Tap an owned sticker:** it performs its act in its slot (hop and moo, slide, pop…), says its name, and becomes **selected** (lifted 1.08×, gold glow ring). The car hops and a 👇 bobs over it for 3 s. First 2 selections ever: `Talk.say('Arabana yapıştır!')`.
5. **Tap the car while a sticker is selected:** the sticker flies (0.35 s) to the car's decal spot, *thwap* (`Snd.stick`), 10-star sparkle, the car jumps and squashes, `'Çok yakıştı!'`. `car.deco = id`, saved. The slot of the sticker on the car gets a small 🚗 badge. Selecting that same sticker and tapping the car again **peels it off** (`Snd.rip`, it flies back to its slot). Tapping the car with nothing selected honks (and the sticker joins in).
6. **Tap a silhouette:** "?" wobble, a soft bubble, `'Bu bir sürpriz!'`.
7. A completed page gets a gold frame and a big 👑 seal; the first time: fanfare, confetti, `'Sayfa tamam! Süpersin!'`.
8. 🔙 (60,60,r46), Escape or Backspace → Garage. The car now wears its sticker on the turntable.

### 2.7 On the road
- The sticker rides on the car (Drive scale ≈ 0.6, so a ~50 px badge). **Every honk:** the decal wiggles and 0.22 s after the horn its own sound plays (moo, quack, ding, wiu, bubble…). This lives in `honk()`, so it works in Garage, Drive and End.
- **Dressed animals:** for each owned dressed sticker, 50% of that species' road animals wear the matching hat (crown cows, cowboy ducks, chef hens, pirate pigs). When they flee from the horn the hat pops up 20 px and lands back.
- Gold wheels throw 12 gold star particles on every hard landing (`vz < -500`). With the dino horn, fleeing animals jump twice as high and the screen shakes a little.
- Magic gates and gift boxes change everything **except** exclusive parts, which give a ✨ sparkle and a ding (§4.5).

### 2.8 Parent reset (hidden, reachable on an iPad)
On the Title screen, hold 🔊 for 5 s. The tap toggles mute as usual; after 1 s a thin ring starts filling around 🔊. At 5 s the mute state is restored to what it was and a **parent panel** opens: dimmed screen, a card showing 🐷⭐📖🚗 (what will be erased), a red 🗑️ (500,470,r70) and a green ✖️ (780,470,r70). 🗑️ must be **held 3 s** (ring + ticking `Snd.click`); releasing early does nothing. On completion: `resetSave()` → `localStorage.removeItem('cade-save')` → `location.reload()`. ✖️, Escape, a tap outside the card or 10 s idle closes it. The custom wheel keys (`cade-wheel-*`) are kept. While the panel is open, Title ignores its normal "any key/▶️ → Garage".

### 2.9 Stretch: "my parked cars" (only if time allows, §10 step S3)
Two photo frames on each shortened wall board (4 total). Tap an empty frame: shutter, white flash, a polaroid of the current car flies into it, `'Fotoğraf çektim!'`. Tap a filled frame: the car poofs into that design, `'Bu araba geri geldi!'`. A full frame is replaced only by holding it 1.2 s (a ring fills). Photos are drawn live (`drawCar(cfg, fx, fy, 0.2)`), no image cache.

---

## 3. Integration with existing scenes and systems

| Existing piece | Change |
|---|---|
| `Voice` (~295-384) | New `until` (ms timestamp) and `busy() = performance.now() < this.until`. `say(t, force, queued)`: when `queued` it does **not** write `this.last`, so narration never throttles a child's line. `say` sets a provisional `until = now + 1600 + cap(t)`. `speak()`: `onstart` → `until = now + cap(t)` with `cap(t) = max(3200, 1000 + 90·t.length)`; `onend` → `until = now`. `playRecording()`: while loading `until = now + 1600`; on start `until = now + buf.duration·1000 + 300`, `s.onended` → `until = now` (if still current); load failure or the 1.5 s drop → `until = now`; `<audio>` path: `onloadedmetadata` → `until = now + a.duration·1000 + 300`, `onended` → `until = now`. `stop()` sets `until = 0`. |
| New `Talk` (right after `const say`) | `q[]`, `say(t)` pushes `{t, at}`, `clear()`, `update()`: drop entries older than 8 s; if `q.length && !Voice.busy() && now - lastStart > 500` → `Voice.say(next, true, true)`. Called from `frame()` after `scene.update(dt)`. `go()` calls `Talk.clear()`. `Talk.say('…')` is discovered by gen-voice (`\bsay\(` matches after the `.`). |
| New `sayChild(t)` | `Talk.clear(); say(t)` for direct child actions (picker names, category keys, sticker taps). Non-forced, so mashing is still throttled among child lines only. |
| `CATS` (~539-547) | Append exclusive names **on the same line**: pattern `'Simli'`, body `'Dinozor araba'`, wheels `'Altın tekerlek'` (index 11, after custom 10), hat `'Mumlu taç'`, trail `'Şekerler'` (+ icon 🍭), horn `'Dinozor korna'` (+ icon 🦖; horn names are not voiced). `COLORS` is unchanged. |
| New `BASE_N` | `{color:16, pattern:10, body:12, wheels:11, face:12, hat:16, trail:12, horn:13}`; an index ≥ `BASE_N[key]` is exclusive and locked until owned. |
| `setCat(c,key,v)` (~556) | Steps in the direction of change until it lands on an owned index. |
| `randomOther(c,key)` (~560) | Picks only owned indices (Title demo, 🎲, key mash). Every category keeps ≥ 2 owned options. |
| New `magicOther(c,key)` | `if (c[key] >= BASE_N[key]) return false; randomOther(c,key); return true;`. Used by the gift `hit` (~2521), gate `hitSpan` (~2567) and `randomAll(true)`. |
| `newCar()` (~552) | Adds `deco: null, decoWig: 0`. |
| `drawCar` (~1418) | Inside the body clip, after the mud loop and before the shadow band: `if (c.deco) drawDeco(c, B, t)` (white die-cut blob + live sticker art at `DECO[c.body] = [x, y, s]`, rotated -0.12 + `sin(decoWig·20)·0.2·decoWig`). |
| `updateCarAnim` (~1500) | Decays `c.decoWig`. |
| `honk(c,x,y,s)` (~1507) | `if (c.deco) { c.decoWig = 1; setTimeout(() => STK[c.deco]?.shout(), 220); }` (sound only; harmless across scene changes per gotcha 12). |
| `WHEEL_R` (~856), `drawWheel` (~990) | Append case 11 (gold). Appended after custom 10, so no `=== 10` check changes. |
| `drawPattern` (~1089) | Case 10 Simli. |
| `BODIES` (~573-854) | Append entry 12, the dino car. |
| `drawHat` (~1278) | Case 16 Mumlu taç (flickering flames only; no wash gag). |
| `emitTrail` (~1476) | Case 12 Şekerler + `every[]` entry; new particle kind `'emoji'` in `drawP` (~434). |
| `Snd.horn` (~168), `HORN_TXT` (~263) | Horn 13 Dinozor korna ('ROAAR!'). |
| `Snd` | New `crank`, `clunk`, `rattle(k)`, `coin(k)`, `stick`, `rip`, `alien` (wiu-wiu). |
| `Snd.setMuted` (~121) | Also `SAVE.muted = m; saveGame()`. `loadSave` sets `Snd.muted` before the AudioContext exists (`init` already reads it at ~109). |
| `buildCourse` animal case | Adds `hat: dressedHat(kind)` (the hat index if the dressed sticker is owned and `Math.random() < 0.5`, else 0). |
| `Drive.drawObj` animal case | After `drawAnimal`, `if (o.hat) drawAnimalHat(o.kind, o.hat, t, o.state === 'flee' ? 20 : 0)`. |
| `Drive` | 🏠 confirm: `bankStars(this.stars)` before `go(Garage)`. Landing branch (~2428): gold sparkles if `car.wheels === 11`. `doHonk`: hop ×2 and `shake = 0.6` if `car.horn === 13`. `enter()`: `flushSave()`. |
| `End` (~2876) | Bonus stars, `bankStars` + `flushSave` in `enter`, capsule badge on 🔧, `Talk` lines replace the `setTimeout`. The trophy drawing moves into `drawTrophy(x,y,s,t)` for the Kupa sticker. |
| `Title` (~1778) | Parent-reset hold (§2.8): `muteDown()` hook, `up()`, panel draw/click/key. |
| Global `pointerdown` (~2989) | After the mute toggle: `scene.muteDown?.()`. |
| `Garage` (~1821-2043) | Props (pig, machine), 📖 button, `gacha` sub-state (like `picker`), deposit, joke actors, keys `9`/`Tab`, picker filtering + ✨ badges, hint gating, `sayChild`, `saveSoon()` on car changes. |
| `Garage.pickerLayout/drawPicker/pickerClick` | Iterate `ownedList(key)`; a cell carries `c.i` (real index); ✨ corner badge when `i >= BASE_N[key]`. |
| New scene `Album` | After `End`, before `go(Title)`; added to `window.__game`. |
| `const car = newCar()` (~1775) | Followed by `applyCfg(car, SAVE.car)`. |
| `window.__game` (~3038) | Add `Album`, `get SAVE`, `resetSave`, `giveStars(n)`, `unlockAll()`. |

**Untouched:** `const ctx` (no global swap), WheelStudio, Drive physics, `buildCourse` except the animal `hat`, the paint pickup and paint `hit` (no exclusive colours), `drawWorld`, Music, `tools/gen-voice.mjs`.

---

## 4. Mechanics and content

### 4.1 Economy
```js
const CRANK_COST = 20, FINISH_BONUS = 10, WELCOME_STARS = 20, CATCH_STARS = 5, PIG_VIS_MAX = 60;
```
- End bonus = `max(FINISH_BONUS, CRANK_COST - Drive.stars)`; deposit = `Drive.stars + bonus`. **Every finished race earns at least one turn**, and the bonus shown is exactly what is banked. Typical races (25-50 stars) deposit 35-60, i.e. 1-3 turns.
- 🏠 abort: deposit `Drive.stars` (no bonus, nothing lost). Catching a runaway animal: +5.
- Turns = `floor(bank / 20)`; up to 5 lamps lit, a "+" on the 5th above 5. The bank is an uncapped saved integer.

### 4.2 Exclusive parts (6), in `PART_ORDER`
| # | id | key / index | Voiced name | Look | Road signature |
|---|---|---|---|---|---|
| 1 | `p-altin-teker` | wheels 11 | Altın tekerlek | gold tire, ruby centre, 6 spokes, a twinkle; `WHEEL_R` 34 | 12 gold sparkles on every hard landing |
| 2 | `p-mumlu-tac` | hat 16 | Mumlu taç | gold crown, 3 candles with flickering flames (`sin(t*17+k)`), a gem | — |
| 3 | `p-dino` | body 12 | Dinozor araba | green dino: rounded belly body, neck and head at the front (eye on the head, toothy smile as mouth), tail in `back()` wagging `sin(t*6)`, 5 orange back spikes, wheels at [-80, 84]; ~45 lines | the tail wags (from `t`) |
| 4 | `p-seker` | trail 12 | Şekerler | emoji particles 🍬🍭🍩, `every` 0.09 | — |
| 5 | `p-dino-korna` | horn 13 | (not voiced) | icon 🦖, `HORN_TXT` 'ROAAR!', sawtooth 110→70 Hz with vibrato over 0.8 s, lowpass 900, plus a noise growl | fleeing animals jump ×2, light screen shake |
| 6 | `p-simli` | pattern 10 | Simli | 40 hash-placed twinkling sparkles plus small white 4-point stars | — |

### 4.3 Stickers (18), `STICKERS` in `PRIZES`, one per line
Each entry: `{id, kind:'sticker', page, say:'…', act, snd, shout?, art(t, a)}` where `art` draws centred in a ±50 unit box (fitted per entry with a `fit:[dx,dy,s]`) and `shout` defaults to `snd`.

| Page | Voiced name (`say`) | Art | Act / sound |
|---|---|---|---|
| 🐄 | İnek, Ördek, Tavuk, Domuz, Koyun | `drawAnimal(kind, t, 'idle', 0)` | `hop` + `animalSound(kind)` + `ANIMAL_TXT` comic |
| 🐄 | Taçlı inek | inek + `drawAnimalHat('inek', 1)` | `hop`, the crown flies up and lands; moo |
| 🐄 | Kovboy ördek | ordek + hat 3 | `hop`; quack |
| 🐄 | Aşçı tavuk | tavuk + hat 4 | `hop`; cluck |
| 🐄 | Korsan domuz | domuz + hat 8 | `hop`; oink |
| 🎈 | Güneş | `drawSun` | `spin`; ding |
| 🎈 | Ay | `drawMoon` | `spin`; soft magic |
| 🎈 | Kardan adam | new `drawSnowman` (~10 lines) | `hop` + flakes; boing |
| 🎈 | Gülen muz | `Drive.drawDecal({type:'banana',…})` + two eyes and a smile | `slide` + 'KAYDIK!' comic; wiu |
| 🎈 | Balonlar | `Drive.drawObj({type:'balloons',…})` | `hop`; pop ×3 (shout: pop ×1) |
| 🎈 | Gökkuşağı | new `drawRainbowArch` (~6 lines) | `spin`; magic (mp3 already exists, same slug as the trail) |
| 🎈 | Kupa | `drawTrophy` (moved out of `End.draw`) | `hop`; fanfare (shout: ding) |
| 🎈 | Uzaylı | new `drawAlien` (~10 lines: green blob, one big eye, two antenna balls, grin) | `hop`; `Snd.alien` |
| 🎈 | Ahtapot | new `drawOctopus` (~12 lines: purple head, 6 legs waving with `sin`, two eyes, smile) | `slide`; bubble |

- `drawAnimalHat(kind, hatIdx, t, lift)`: `ANIMAL_HAT = {inek:[-80,-148,0.55], ordek:[-34,-108,0.5], tavuk:[-30,-124,0.45], domuz:[-58,-120,0.55], koyun:[-58,-120,0.5]}` (head-top anchors read from `drawAnimal`; tune by eye), then `translate; scale; drawHat(hatIdx, t)`. Shared by stickers, the road, and the kacak animal. ~8 lines.
- Fake road objects are drawn after `ctx.translate(cx, cy - LANES[0])` with `{type, x:0, lane:0, t:0, cols}`; these are runtime calls on `Drive`, so there is no TDZ issue.
- **3 act types** (`hop`, `spin`, `slide`; v2's `splat` went with the mud and paint stickers): each is a few lines of transform from `a` (act time 0..0.9) plus particles. Dressed animals use `hop` with the hat drawn at `lift = sin(a·π)·30`, so it flies up and lands back.
- **Sticker look:** a white rounded blob (`rr`, radius 30, slight `hash` rotation, OUT stroke 4, a tiny folded "peel" corner) with the live art on top. **Ghost (missing):** dashed cream outline, the art at `globalAlpha 0.2`, a big "?" bubble. No offscreen canvases, no `getImageData`.

### 4.4 The roll: `rollPrize()` (decided and saved when paying)
```
n = SAVE.cranks; c = SAVE.collects
uP = PART_ORDER ids not owned; uS = sticker ids not owned
if (!uP.length && !uS.length)              → joke (first time: celebration, allDone = true)
elif (n % 4 === 3)                         → joke (not SAVE.lastJoke)
elif (uP.length && (c % 3 === 0 || !uS.length)) → uP[0]   (collects++)
else                                       → pick(uS)   (collects++)
```
- **Rhythm:** parts land on cranks **1, 5, 9, 13, 17, 21**, which is always the crank right after a joke (crank 1 = Altın tekerlek). Jokes on 4, 8, 12, … Stickers fill the rest.
- **Arithmetic:** 24 collectibles; crank k has given `k - floor(k/4)` collectibles, so all 24 are owned after **crank 31** (31 − 7 = 24). At about 2 turns per race that is ~15 races. Crank 32 onward: celebration once, then jokes (catching the animal still pays +5).
- No duplicates. **Adding content later is data-only:** a new `PRIZES` line (+ art) automatically appears as a new ghost in old saves and enters the roll.

### 4.5 The magic rule (won parts stay won)
- `magicOther` refuses to change a category whose current value is exclusive.
- **Gift pickup** (`hit` 'gift', ~2518): picks 2 categories among the unprotected ones; if any protected category exists, `sparkle(CARX, ly-90, 1, 14)` + `Snd.ding()` once.
- **Magic gate** (`hitSpan`, ~2567): changes every unprotected category (horn 50% as today); protected ones sparkle.
- **`sihir` capsule:** `randomAll(true)` uses `magicOther`.
- **Not covered (the child's own choice):** pickers, 🎲, keyboard mash. Those can take a part off, and it stays in the picker with its ✨.

### 4.6 Capsule colours
Top halves from `#ff4d6d #4dabf7 #ffd23f #40c057 #9775fa #ff922b`, the bottom always white. The 14 gumballs in the globe use the same palette at fixed `hash` positions and jiggle while cranking.

---

## 5. Layouts (logical 1280×720)

### 5.1 Garage (checked against game.js ~1986-2020)
| Element | Position | Notes |
|---|---|---|
| Category buttons | unchanged, x 100 / 1180, ys 150/290/430/570, r58 | |
| Window | unchanged 470..810 × 150..320 | |
| Left / right tool board | **shortened** to 190..410 / 870..1090 × 140..288 (today 140..340) | Emoji moved up: 🔧🔨 y≈195, 🪛🪣 y≈255; 🎨⭐ / 🎈🧸 likewise. Stretch frames: centres (245,214) (355,214) (925,214) (1035,214). |
| **Glass pig** | centre (290,468), body ellipse 78×62 (212..368 × 406..530), ears, snout right, legs to y≈555, coin slot (290,404) | Replaces the paint cans (~2000). Tap: `Snd.coin` ×3, stars bounce, `'Şıkır şıkır!'`. |
| **📖 Album** | (290,652), r50, bg `#ff8787` | Red dot (fresh count for parents) pulses while stickers are fresh. |
| 🎲 / 🏁 | unchanged (520,652,r50) / (770,650,r62) | 👈 hint unchanged (ends ≈ x 925). 🏁 is also the deposit source. |
| **Sürpriz Makinesi** | globe (1010,404) r80; brass collar 484..500 with 5 lamps x 970..1050; red body 940..1080 × 500..648; coin slot (1055,518); knob (1010,566) r42 (white T-handle, rotates); chute (1010,630) with a flap | Replaces the tire stack (~1999). **Hit rect 935..1100 × 316..660.** Bulbs blink while a turn is available. |
| 👇 knob hint | (1010, 505 + bob) size 54 | See hint rules below. |
| Joke floor lane | ground y 660, x 330..980 | In front of the turntable (its bottom edge is y 612), drawn after the car and the buttons. |

Checks: the 👈 ends at ~925 and the machine body starts at 940; the globe (y 324..484) clears the shortened boards (≤ 288); the turntable (390..890) clears the pig (≤ 368) and the machine (≥ 930); the honk area (420..860 × 160..600) overlaps none of them; the machine rect (≤ 1100) clears the right buttons (≥ 1117 with slack); the top-right HUD is untouched.

**Hint rules (never two at once):**
- `knobHint = !gacha && turns() ≥ 1 && cranksHere === 0 && (SAVE.cranks === 0 || this.t < 8)`.
- 👈 and `goBtn.pulse`: `!picker && !gacha && SAVE.cranks > 0 && !knobHint && (changes ≥ 3 || t - hintT0 > 9 /* 10 for pulse */)`. Exception: the consolation (§2.5) pulses 🏁 directly.
- Idle nag (12 s): `knobHint`-state → `say('Sürpriz makinesini çevir!')` on its own line; otherwise the existing lines.

### 5.2 Album
| Element | Position |
|---|---|
| Table | `#b97a45` with grain lines |
| Book page | cream rect 120..1010 × 96..694, 12 spiral rings down the left edge, page icon (🐄 / 🎈) as a big decoration in the top-left corner of the page |
| Slots | 3×3, 270×170, `x = 150 + col·285`, `y = 130 + row·185` (to 990 × 670) |
| Tabs | 🐄 (1150,170,r56), 🎈 (1150,310,r56); the current one is drawn bigger with a gold rim |
| Car podium | car at (1145,640), scale 0.5, on an ellipse podium; hit rect 1030..1260 × 470..690 |
| 🔙 | (60,60,r46) |

### 5.3 Title parent panel
Card 340..940 × 200..560; 🐷⭐📖🚗 row at y 290; 🗑️ (500,470,r70, `#ff6b6b`), ✖️ (780,470,r70, `#40c057`).

---

## 6. New voiced Turkish lines (exact) and SFX

All single-quoted, capitalised, no apostrophes, one literal per line (`say('…')` or `Talk.say('…')`), so `tools/gen-voice.mjs` finds them.

| Line | Where | Path |
|---|---|---|
| `'Sana bir hediye var! Makineyi çevir!'` | Garage enter while `SAVE.cranks === 0` (replaces 'Arabanı değiştir!') | say, forced |
| `'Sürpriz makinesini çevir!'` | idle nag while the knob hint applies | say |
| `'Çevir çevir!'` | full crank start | Talk |
| `'Dokun, açılsın!'` | fly phase, first 3 cranks ever | Talk |
| `'Ne çıkacak acaba?'` | fly phase, later full cranks | Talk |
| `'Yeni parça!'` | part reveal, full mode | Talk |
| `'Yeni korna!'` | horn part reveal, full mode | Talk |
| `'Yeni çıkartma!'` | sticker reveal, full mode | Talk |
| `'Albüme yapıştıralım!'` | sticker apply, first 2 ever | Talk |
| `'Kaçak hayvan! Yakala!'` | joke `kacak` start | Talk |
| `'Yakaladın!'` | runaway animal caught | say, forced |
| `'Pırt kapsülü! Hah ha!'` | joke `pirt` | Talk |
| `'Sihirli kapsül!'` | joke `sihir` | Talk |
| `'Her şeyi topladın! Konfeti partisi!'` | first time all collected | Talk |
| `'Hadi yıldız toplayalım!'` | machine tapped with < 20 stars | say, forced |
| `'Yıldızlar kumbaraya!'` | deposit start | Talk |
| `'Şıkır şıkır!'` | pig tapped | sayChild |
| `'Sürpriz seni bekliyor!'` | End, after 'Harikaydın!…' | Talk |
| `'Çıkartma albümü!'` | Album enter | Talk |
| `'Bu bir sürpriz!'` | silhouette tapped | sayChild |
| `'Sayfa tamam! Süpersin!'` | first completed-page view | Talk |
| `'Arabana yapıştır!'` | first 2 sticker selections ever | Talk |
| `'Çok yakıştı!'` | sticker stuck on the car | say, forced |
| *(stretch)* `'Fotoğraf çektim!'`, `'Bu araba geri geldi!'` | parked cars | sayChild |

**Option names** (CATS `names` lines): `Simli`, `Dinozor araba`, `Altın tekerlek`, `Mumlu taç`, `Şekerler` (horn names are never spoken).
**Sticker names** (`say:` properties): `İnek, Ördek, Tavuk, Domuz, Koyun, Taçlı inek, Kovboy ördek, Aşçı tavuk, Korsan domuz, Güneş, Ay, Kardan adam, Gülen muz, Balonlar, Gökkuşağı, Kupa, Uzaylı, Ahtapot`. Spoken as `Talk.say(st.say)` / `sayChild(st.say)` — the same field everywhere.
Part names are spoken as `Talk.say(CAT[key].names[i])`; the literal is discovered from the CATS line, the slug matches.
**Slug checks:** none of the new names occur in game.js today (grep: no `Yakalad`, `yakıştı`, `yapıştır`, `Uzaylı`, `Ahtapot`, `Taçlı`, `Kovboy ördek`); `gokkusagi.mp3` already exists and is reused. Expected `--missing` for the core: **45** (23 narrative + 5 option names + 17 sticker names), 47 with the stretch.
**Comic texts (not voiced, own statements):** 'ROAAR!', and the existing 'PIRT!' and 'KAYDIK!'.

### SFX (in `Snd`, from `tone`/`noise`)
- `crank(fast)`: 4 `click()` 0.2 s apart (0.13 s fast), pitch 600→900, plus a low ratchet noise tick.
- `clunk()`: tone 180→90 Hz, 0.12 s square (filter 800) + 0.06 s noise at 1200 Hz.
- `rattle(k)`: 5 bandpass noise bursts (3000 Hz, 0.03 s, 0.05 s apart), louder with k.
- `coin(k)`: triangle at `1200 + min(k,20)·40` Hz, 0.12 s.
- `stick()`: noise 0.09 s lowpass 900 + tone 220→120 Hz (thwap).
- `rip()`: noise 0.25 s bandpass sweeping 800→3000 Hz (peel).
- `alien()`: two sine `tone`s 900→1400 Hz with vibrato `[18, 60]`, 0.18 s each.
- Horn 13 (dino): see §4.2. *(stretch)* `shutter()`.
Reused: `pop, fanfare, magic, boing, bubble, ding, click, wiu, whee, fart, animalSound`.

### Speech rules
- Narrative goes through `Talk`; it starts the next line only when the previous one has really ended (`Voice.until` from the clip), so lines are never cut and never throttled.
- Child actions use `sayChild` (clears the queue, then a normal throttled `say`) or a forced `say` for celebratory feedback (`'Yakaladın!'`, `'Çok yakıştı!'`). The child's action always wins over narration.
- Show phases wait (up to 3.0 s) for the prize-name line to start, so the name is heard while the prize is on screen.
- End: flags in `update` replace the `setTimeout`: `Talk.say('Harikaydın! Bir daha oynayalım mı?')` at t ≥ 0.4 s, `Talk.say('Sürpriz seni bekliyor!')` after the bonus.

---

## 7. Controls (touch and keyboard, no reading anywhere)

### Garage
| Action | Touch | Keyboard |
|---|---|---|
| Crank | tap anywhere on the machine (935..1100 × 316..660) | `9` |
| Advance the reveal | tap anywhere | any key |
| Catch the runaway animal | tap near it (r 100) | any key |
| Album | 📖 | `Tab` (already `preventDefault`ed; not a single character, so outside the mash path) |
| Pig jingle | tap the pig | — |
| Existing | unchanged | 1-8, Space, Enter, letters/arrows → random change |

While a gacha or joke runs, every tap and key goes to it; buttons are dimmed and inert. Mashing stays harmless: letters keep randomising, `9` gives a prize (show has a minimum time, `e.repeat` ignored), and no single printable key switches scenes or touches saved data. In the Album only Escape, Backspace and 🔙 leave, and Tab means "next page" there, so Garage ⇄ Album cannot ping-pong.

### Album
| Action | Touch | Keyboard |
|---|---|---|
| Switch page | 🐄 / 🎈 tabs | `1`, `2`, ←/→, Tab |
| Act + select a sticker | tap its slot | Space or any letter: a random owned sticker on the page acts and is selected |
| Stick / peel on the car | tap the car | Enter |
| Honk | tap the car with nothing selected | Enter with nothing selected |
| Back | 🔙 | Escape, Backspace |

### Title
Unchanged for the child. Parents: hold 🔊 5 s → panel; hold 🗑️ 3 s to reset; ✖️ / Escape to close (§2.8).

All child targets are r ≥ 46 or rects ≥ 96 px (the joke animal's hit circle is r 100).

---

## 8. Persistence

One new key, **`localStorage['cade-save']`**, JSON v1, < 1 KB:
```js
SAVE = {
  v: 1,
  bank: 20,          // int ≥ 0
  pending: 0,        // stars still to animate into the pig (cosmetic)
  cranks: 0, collects: 0, lastJoke: '',
  owned: [],         // exclusive part ids
  stickers: [], fresh: [], pagesDone: [], allDone: false,
  car: null,         // {color,pattern,body,wheels,face,hat,trail,horn,deco}
  hintOpen: 0,       // 'Dokun, açılsın!' count (max 3)
  hintStick: 0,      // 'Arabana yapıştır!' count (max 2)
  muted: false,
  parked: [null, null, null, null], // stretch
};
```
- `loadSave()` runs once after `CATS` and `PRIZES`, before `const car` (~1775); try/catch; every field validated: ints clamped ≥ 0, id arrays filtered to known ids and de-duplicated, `fresh ⊆ stickers`, `validCfg(c)` (each category an int in range **and** owned, otherwise the `newCar()` default; `deco` must be an owned sticker id, else `null`). Unparsable → defaults.
- `saveGame()`: try/catch around `setItem`; errors ignored (private mode works for the session).
- **Write moments:** `bankStars` (End.enter, 🏠), `payCrank` (bank, cranks, collects and the prize in **one write before the animation**), the catch +5, fresh cleared in the album, the page celebration, `allDone`, hint counters, mute, and the car (incl. `deco`) via `saveSoon()` (dirty flag flushed from `Garage.update`/`Album.update` at most every 0.5 s, plus `Drive.enter`, `End.enter`, `pagehide` and `visibilitychange: hidden`).
- Reset: the Title parent panel (§2.8) or `__game.resetSave()`.

---

## 9. Edge cases

1. **Reload mid-crank:** the prize was saved at pay time: a part is owned (not equipped), a sticker sits in `fresh`. A crank can never be paid without a prize or paid out twice.
2. **Leaving during the deposit** (🏁 allowed): the bank is saved; `pending` is zeroed when the animation starts, so it never replays.
3. **Several races without a Garage visit:** bank and `pending` add up; at most 30 stars are animated, the rest pour in as one sparkle burst.
4. **🏠 abort:** `bankStars(Drive.stars)`, no bonus.
5. **Locked indices:** `setCat`, `randomOther`, `magicOther`, pickers and the Title demo all go through `ownedList`. `unlockAll()` exists only in the debug hook.
6. **Picker sizing:** the grid uses the owned count; ✏️ stays on wheel 10, ✨ on every index ≥ `BASE_N`.
7. **Gold wheels won while the car has the custom wheel (10):** the car switches to 11; the custom art/shape stay saved.
8. **Magic rule with many exclusives equipped:** a gate may change only a few categories; it still plays its full magic, confetti and line, and the protected parts sparkle. The gift still changes two unprotected categories (there are always ≥ 2: face has no exclusive).
9. **Sticker on bodies with little flat area** (duck, ice cream, rocket): the decal is clipped to the body path, so it can never spill; `DECO[b]` is tuned per body with `unlockAll()`.
10. **Honk shout across a scene change:** sound-only `setTimeout`, so harmless. `STK[c.deco]?.` guards an invalid id.
11. **Runaway animal and scene change:** the +5 is saved at the catch; the actor is Garage-local state and vanishes on `go()`.
12. **Joke input:** during a joke all taps/keys go to the joke; buttons are dimmed so it is visibly "the animal's turn". The worst case is 5.5 s.
13. **Spam taps during a reveal:** each tap advances at most one phase; show ignores taps before its minimum (1.0 s / 0.7 s).
14. **Speech:** `Talk.clear()` in `go()`; muted → `say` returns early, `until` stays 0, the queue drains silently; Safari's missing `onend` is covered by the `until` cap; stale lines (> 8 s) are dropped.
15. **Everything collected:** the crank costs 20 and gives a joke; the celebration plays once.
16. **Corrupt or newer save / unknown ids:** filtered out; loading never throws.
17. **`go()` clears particles:** the sticker flying to 📖 is Garage-only; album animations are Album state.
18. **Click order in `Garage.click`:** joke → gacha → picker → buttons (📖, 🎲, 🏁, categories) → stretch frames → machine → pig → car honk area.
19. **Parent reset hold:** the 🔊 tap toggles mute immediately (unchanged behaviour); at 5 s the previous state is restored. Releasing (`Title.up()`) before 5 s cancels. The 🗑️ hold is tracked by `Title.click` + `Title.up()`; a drag off the button still counts as a hold until release, which is acceptable because the panel is already parent-only.
20. **Album with zero stickers:** all ghosts; tapping the car honks; Enter honks.
21. **Peeling while the sticker's page is not shown:** impossible by design; peeling requires selecting it on its page.

---

## 10. Implementation plan (single game.js, one focused session)

**Budget:** about **870 new or changed lines** in game.js for the core (about +29%; roughly a quarter is data tables and straight-line drawing), about 35 in README.md. No new files; pages.yml unchanged; new mp3s go into `voice/`. Sections in the existing `// ==== …` style with Turkish comments. Built in four milestones, each tested in the browser with Playwright via `window.__game` while watching the console (the `frame()` try/catch hides errors).

### Milestone A — foundation (invisible; ~210 lines)
**Step 0: Voice and Talk (~35), at ~295-384.** `until`, `busy()`, `cap(t)`, the `queued` flag, the `onended`/`onloadedmetadata` handlers; `Talk` and `sayChild` after `const say`; `Talk.update()` in `frame()`, `Talk.clear()` in `go()`. *Test:* `Talk.say('Başla!'); Talk.say('Harikaydın! Bir daha oynayalım mı?')` plays both fully, in order, with both the mp3 path (no TR voice) and TTS.
**Step 1: Ownership (~35), after `CATS`/`CAT` (~565).** Exclusive names on the CATS lines, `BASE_N`, `isOwned`, `ownedList` (cached, invalidated on unlock), ownership-aware `setCat`/`randomOther`, `magicOther`; gift and gate switched to `magicOther`. *Test:* a race plays unchanged.
**Step 2: PRIZES and SAVE (~105), new section `// ==== sürpriz makinesi: kayıt ve ödüller`.** `PRIZES` (6 parts, 18 stickers one per line), `PRIZE[id]`, `STK`, `PART_ORDER`, `JOKES`, `SAVE` defaults, `loadSave`, `validCfg`, `saveGame`, `saveSoon`/`flushSave`, `bankStars`, `turns`, `rollPrize`, `payCrank`, `carCfg`/`applyCfg`; `deco` in `newCar`; `applyCfg(car, SAVE.car)` after `const car`; mute persistence; the `pagehide`/`visibilitychange` flush. *Test:* `__game.SAVE`, reload keeps bank, car and mute.
**Step 3: SFX + `'emoji'` particle (~35), in `Snd` (~255) and `drawP` (~458).**

### Milestone B — exclusive parts (~100 lines)
**Step 4:** `drawPattern` 10, `WHEEL_R`/`drawWheel` 11, `BODIES[12]` dino (~45), `drawHat` 16, `emitTrail` 12, horn 13 + `HORN_TXT`; pickers iterate `ownedList` with ✨ badges. *Test:* `__game.unlockAll()`, every picker, a race with dino + gold wheels + candy trail + dino horn; dino face/hat/trail anchors right.

### Milestone C — the Garage loop (~380 lines)
**Step 5: Sticker art (~85), new section `// ==== çıkartmalar`.** `drawTrophy` moved out of `End.draw`; `drawSnowman`, `drawRainbowArch`, `drawAlien`, `drawOctopus`, `ANIMAL_HAT` + `drawAnimalHat`; `drawSticker(st, x, y, s, t, a, mode)` with modes `live` (act), `flat` (blob + art), `ghost`; `drawDeco(c, B, t)` + `DECO[13]`; the decal call in `drawCar`, `decoWig` in `updateCarAnim`, the shout in `honk`. *Test:* `car.deco = 'st-inek'` in the console → visible in Garage, pickers, Drive; honk moos.
**Step 6: Garage props (~95), in `Garage.draw` (~1986-2020).** Shorten the boards, remove the paint cans and tire stack; `drawPig(x,y,t,count,squash)`; `drawMachine(t, knobA, lamps, shake, flapA)`; `albumBtn` with its dot; the hint gating (§5.1).
**Step 7: Deposit, gacha, jokes, consolation (~200), new Garage methods.** `enter()` (deposit start, welcome-vs-normal line, `cranksHere = 0`, `hintT0 = 0`); deposit flystars from 🏁; the phase machine driven by `PH = {full:{turn:.8,drop:.3,roll:.3,fly:.4,wob:1.4,open:.3,showMin:1,show:1.8,apply:.5}, fast:{turn:.5,drop:.25,roll:0,fly:.3,wob:.7,open:.3,showMin:.7,show:1.2,apply:.35}}`, `taps:{full:3, fast:1}`; `startCrank()` (calls `payCrank` first), `gachaTap()`, `gachaFinish()`; `drawGacha(t)` (dim, capsule halves + band + zigzag cracks, 12 rotating ray wedges, `drawPrize`); the 3 joke scripts as a `joke = {id, t, …}` sub-state with the timelines of §2.3 (`kacak` actor with route keyframes, catch/miss/bye; `pirt`; `sihir`); `noStars()`; click order, keys `9`/`Tab`, `sayChild` in the picker and key paths; `saveSoon()` after `afterChange`. *Test:* fresh profile → welcome line → crank (≤ 5.8 s untouched) → gold wheels; `giveStars(200)` → fast cranks, first joke at crank 4, catch the animal by tap and by key, let one escape.

### Milestone D — album, race, End, Title (~180 lines)
**Step 8: Album scene (~110), `const Album = {…}` after `End`.** `enter` (page choice, buttons, `Music.play('garage')`, `Talk.say('Çıkartma albümü!')`, fresh sparkle + names), `update` (act timers, the flying sticker tween, page-complete check, `saveSoon` flush), `draw` (§5.2), `click`/`key`/`buttons`, select → stick/peel logic.
**Step 9: Drive and End hooks (~45).** 🏠 `bankStars`; landing sparkles; dino-horn hop/shake; `flushSave` in `enter`; animal `hat` in `buildCourse` + `drawObj`; gift/gate sparkle for protected parts. End: bonus, `bankStars` + `flushSave`, bonus flystars from the trophy, 🔧 capsule badge + pulse, `Talk` flags.
**Step 10: Title reset, debug, README, voices (~40 + 35).** `muteDown` hook, hold ring, panel, 🗑️ hold, `resetSave`; `window.__game` additions; README section "Sürpriz Makinesi, kumbara, albüm ve çıkartmalar" (keys `9`, `Tab`, album keys, parent reset); `node tools/gen-voice.mjs --missing` → generate (FAL_KEY or the fal MCP) or list in the commit.
**Final Playwright pass:** fresh → Title → Garage → crank → gold wheels → race → End bonus + both lines without overlap → deposit from 🏁 → cranks to the first joke → catch → album → select İnek → stick on car → race (decal visible, honk moos) → `giveStars(2000)` + 40 cranks (rhythm check) → dressed animals on the road → key-mash test → reload (everything persists) → parent reset. No console errors.

### Stretch (in this order, only if time remains)
- **S1 crank drag (~25):** knob follows the finger (`move`/`up`, forward deltas only, auto-completes at 1.5× when released early).
- **S2 album slap (~25):** fresh stickers fall into their slot from 2.2× with a thwap.
- **S3 parked cars (~70):** §2.9.

### Cut order if the core runs long
(1) Uzaylı + Ahtapot art → replace with `drawStar3d` "Yıldız" and `drawGift` "Hediye" (−20; names/voice change with them); (2) page-complete seal (−15); (3) dino-horn and gold-wheel signatures (−8); (4) the `pirt` joke (−15, keep 2 jokes). **Never cut:** pig, machine, full/fast reveal, catchable runaway, the 6 parts, sticker acts, album with stick-on-car, honk shout, dressed animals on the road, persistence, the magic rule, Talk timing, parent reset.

**Checkpoint:** if Milestone C is not done by about 60% of the session, take cuts (1)-(2) before starting D.

**Follow-ups (not in this plan):** more parts (Lolipop tekerlek, Uzaylı antenleri, Süper maske, a gold colour), the candle crown wash gag, a third album page for parts, more jokes, two sticker slots on the car.

---

## 11. Acceptance criteria

1. **First visit (fresh save):** the pig shows 20 stars and one lit lamp; the only line is 'Sana bir hediye var! Makineyi çevir!'; the 👇 over the knob is the only hint (no 👈, no 🏁 pulse) until the first crank ends; then 'Arabanı değiştir!' plays and 👈 appears ≥ 9 s later.
2. One tap on the machine runs pay → turn → drop → roll → fly → wobble → open → show → apply in **≤ 5.8 s without further input**, and the car ends up wearing Altın tekerlek.
3. **Fast mode:** a second crank in the same visit takes ≤ 3.6 s untouched and opens on the first tap; the show phase is never skipped before its minimum (1.0 / 0.7 s).
4. **Speech:** 'Çevir çevir!', 'Ne çıkacak acaba?' / 'Dokun, açılsın!', 'Yeni …!' and the prize name play completely, in order, with no overlap, on the mp3 path and on TTS, including 'Her şeyi topladın! Konfeti partisi!'. On End, 'Harikaydın! Bir daha oynayalım mı?' is followed by 'Sürpriz seni bekliyor!' with no overlap. A picker name tapped within 900 ms of a narration line is still spoken.
5. Every finished race banks ≥ 20 stars (the End bonus equals what is banked). A 🏠 abort banks the collected stars. Deposit stars visibly fly out of 🏁 into the pig; a reload neither replays the deposit nor changes the bank.
6. **No exclusive option** appears in any picker, random change, gift, gate or the Title demo before it is won. After winning it has a ✨ badge and works in Drive (dino anchors correct, gold wheels roll and sparkle on landings, the dino horn roars and doubles the flee hop, the candy trail emits emoji, the candle flames flicker).
7. **Magic rule:** with gold wheels equipped, 10 gift pickups and 2 gates never remove them (each time a ✨ + ding), while other categories still change. 🎲 and pickers can still change wheels.
8. **Prize rules:** crank 1 = gold wheels; parts on cranks 1, 5, 9, 13, 17, 21 in `PART_ORDER`; jokes on every 4th crank, never the same twice in a row; all 24 collectibles owned after exactly 31 cranks; then the celebration once and only jokes. Every crank gives something (`giveStars(2000)`, 40 cranks).
9. **Jokes:** `kacak` closes the overlay, the animal runs on the floor in front of the car with two pauses; a tap within r 100 or any key catches it ('Yakaladın!', hearts, +5 stars into the pig, saved); a missed tap makes it hop; uncaught, it leaves on its own by 5.5 s. `pirt` and `sihir` follow their timelines (1.6 s / 1.4 s); `sihir` keeps exclusive parts. Buttons are dimmed and inert during jokes and work again right after.
10. **Too few stars:** a bouncing gumball, pig jingle, 🏁 pulse and 'Hadi yıldız toplayalım!'; nothing negative.
11. **Album:** 2 pages of 9; ghosts with "?" for missing stickers; fresh stickers sparkle and are named; tapping an owned sticker acts and selects it; tapping the car sticks it ('Çok yakıştı!') and the slot shows 🚗; tapping it again with the same selection peels it off; tabs, `1`/`2`, arrows and Tab switch pages; Space acts, Enter sticks; 🔙/Escape/Backspace go back. A completed page shows the gold frame and 👑 once with its celebration.
12. **Sticker on the road:** the decal is visible (clipped to the body) in Garage, pickers, Drive and End for all 13 bodies; every honk wiggles it and plays its sound; it survives reloads, gates, gifts and 🎲.
13. **Dressed animals:** after owning Kovboy ördek, cowboy-hatted ducks appear on the road (about half of the ducks) and their hat pops when they flee.
14. **Keyboard mash:** 30 s of random keys in Garage and Album never deletes or overwrites saved data (except the car, by design), never ping-pongs scenes, and always produces visible and audible reactions.
15. **Persistence:** after a reload the car (incl. sticker), bank, owned parts, stickers, fresh queue, `cranks`/`collects`, hint counters and mute are restored. Corrupt JSON falls back to defaults without errors; with localStorage disabled the game works for the session.
16. **Parent reset:** holding 🔊 5 s on Title opens the panel and leaves mute as it was; a short 🔊 tap still just toggles mute; 🗑️ needs a 3 s hold; after reset the game starts as a fresh save, and the custom wheel is kept.
17. All new child targets r ≥ 46 (or rects ≥ 96 px); the 👈 never overlaps the machine; no on-screen word has to be read.
18. `node tools/gen-voice.mjs --missing` lists exactly the 45 new core lines of §6 (none with an apostrophe); after generation it reports 0.
19. No console errors in a full Playwright session; Garage and Album frame time not noticeably worse on an iPad-class device (no offscreen canvases, no `getImageData`, at most 9 live stickers per album page).
20. README.md (Turkish) documents the machine, piggy bank, album, car sticker, new keys and the parent reset.
