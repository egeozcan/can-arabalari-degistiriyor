#!/usr/bin/env node
// Oyundaki tüm konuşma cümlelerini fal.ai (ElevenLabs v4) ile seslendirip voice/ klasörüne yazar.
//   FAL_KEY=... node tools/gen-voice.mjs          → eksik sesleri üretir
//   node tools/gen-voice.mjs --list               → cümleleri ve dosya adlarını listeler
//   node tools/gen-voice.mjs --missing            → yalnızca eksik olanları listeler
//   FAL_KEY=... node tools/gen-voice.mjs --force  → hepsini yeniden üretir
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'voice');
const ENDPOINT = 'elevenlabs/tts/eleven-v4';
const SETTINGS = { voice: 'Lily', language_code: 'tr', stability: 0.35, output_format: 'mp3_44100_64' };

// game.js içindeki Voice.slug ile birebir aynı olmalı
export function slug(t) {
  return t.toLocaleLowerCase('tr')
    .replace(/[çğıöşü]/g, c => ({ ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' })[c])
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function lines() {
  const src = readFileSync(join(ROOT, 'game.js'), 'utf8');
  const out = new Set();
  const strs = s => [...s.matchAll(/'([^'\\]*)'/g)].map(m => m[1]);
  const spoken = s => /^[A-ZÇĞİÖŞÜ]/.test(s); // 'gunduz', 'horn' gibi anahtarları ele
  for (const l of src.split('\n')) {
    if (/\bsay\(/.test(l) && !/^\s*(say\(t|const say)/.test(l)) strs(l).filter(spoken).forEach(s => out.add(s));
    for (const m of l.matchAll(/\bsay\w*: '([^'\\]+)'/g)) out.add(m[1]); // say: '…', sayHi: '…' gibi özellikler
  }
  // seçenek adları (korna hariç; korna adları söylenmiyor)
  for (const m of src.matchAll(/key: '(\w+)'[^\n]*?names: \[([^\]]*)\]/g)) if (m[1] !== 'horn') strs(m[2]).forEach(s => out.add(s));
  // çıkartma adları ve tümsek ölçeri seviyeleri (game.js'te dizi olarak duruyor, ünlemle söylenenler ünlemli)
  strs(src.match(/const STICKER_NAMES = \[([\s\S]*?)\];/)[1]).forEach(s => out.add(s + '!'));
  strs(src.match(/const BUMP_TXT = \[([^\]]*)\]/)[1]).forEach(s => out.add(s));
  for (let n = 3; n <= 16; n++) out.add(`${n} köşe!`);
  const colors = src.match(/const COLORS = \[([\s\S]*?)\];/)[1];
  for (const m of colors.matchAll(/\['#[0-9a-f]+', '([^']+)'\]/gi)) out.add(m[1]);
  return [...out];
}

async function tts(text) {
  const key = process.env.FAL_KEY;
  const r = await fetch(`https://fal.run/${ENDPOINT}`, {
    method: 'POST',
    headers: { Authorization: `Key ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: `[excited] ${text}`, ...SETTINGS }),
  });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  const { audio } = await r.json();
  return Buffer.from(await (await fetch(audio.url)).arrayBuffer());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = process.argv[2];
  const all = lines();
  const seen = new Map();
  for (const t of all) {
    const s = slug(t);
    if (seen.has(s) && seen.get(s) !== t) console.warn(`aynı dosya adı: "${seen.get(s)}" ve "${t}" → ${s}.mp3`);
    seen.set(s, t);
  }
  const todo = [...seen].filter(([s]) => arg === '--force' || !existsSync(join(OUT, s + '.mp3')));
  if (arg === '--list' || arg === '--missing') {
    for (const [s, t] of arg === '--list' ? seen : todo) console.log(`${s}\t${t}`);
    console.error(`${arg === '--list' ? seen.size : todo.length} cümle`);
    process.exit(0);
  }
  if (!process.env.FAL_KEY) { console.error('FAL_KEY gerekli'); process.exit(1); }
  mkdirSync(OUT, { recursive: true });
  for (const [s, t] of todo) {
    process.stdout.write(`${s} … `);
    writeFileSync(join(OUT, s + '.mp3'), await tts(t));
    console.log('tamam');
  }
}
