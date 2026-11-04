// Renders studio.html drawings to PNG stills or MP4 videos (needs Playwright + ffmpeg).
// usage: node render.mjs still <outdir>
//        node render.mjs story <out.mp4> [16:9|9:16]      (story.html, full film)
//        node render.mjs story-still <outdir> [ratio]          (one still per scene)
//        node render.mjs video <out.mp4> <drawing> <style> <ratio> <duration> [caption] [ending]
import { createRequire } from 'module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { spawn } from 'child_process';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const isStory = process.argv[2]?.startsWith('story');
let body = readFileSync(resolve(here, isStory ? 'story.html' : 'studio.html'), 'utf8');
if (isStory) body = body.replace('<script src="story-assets.js"></script>', () => `<script>${readFileSync(resolve(here, 'story-assets.js'), 'utf8')}</script>`);
const doc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${body}</body></html>`;
const [mode, out, drawing, style, ratio = '1:1', duration = '6', caption = '', ending = 'fade'] = process.argv.slice(2);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1300, height: 900 } });
page.on('pageerror', e => console.error('pageerror', e.message));
await page.setContent(doc, { waitUntil: 'networkidle' }).catch(() => {});
await page.waitForFunction(() => window.LineStudio?.main || window.Story);
await page.evaluate(() => document.fonts && document.fonts.ready);
await page.evaluate(() => window.Story?.ready?.());

if (mode === 'story' || mode === 'story-still') {
  const ratio = drawing || '16:9';
  await page.evaluate(r => Story.setRatio(r), ratio);
  const grab = t => page.evaluate(t => { Story.renderAt(t); return Story.canvas.toDataURL('image/jpeg', 0.92); }, t);
  if (mode === 'story-still') {
    mkdirSync(out, { recursive: true });
    const times = await page.evaluate(() => Story.SCENES.map(s => s.t0 + s.in + 1.6));
    for (let i = 0; i < times.length; i++) writeFileSync(`${out}/scene${String(i + 1).padStart(2, '0')}.jpg`, Buffer.from((await grab(times[i])).split(',')[1], 'base64'));
    console.log('story stills ->', out);
  } else {
    const fps = 30, total = await page.evaluate(() => Story.TOTAL), frames = Math.round(total * fps);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', '-preset', 'medium', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let f = 0; f < frames; f++) { const b = Buffer.from((await grab(f / fps)).split(',')[1], 'base64'); if (!ff.stdin.write(b)) await new Promise(r => ff.stdin.once('drain', r)); }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
    console.log('story ->', out, ratio, `${total.toFixed(1)}s`);
  }
  await browser.close(); process.exit(0);
}

if (mode === 'still') {
  mkdirSync(out, { recursive: true });
  const ids = await page.evaluate(() => Object.keys(LineStudio.DRAWINGS).filter(k => k !== 'custom'));
  for (const id of ids) {
    const url = await page.evaluate((id) => {
      const c = document.createElement('canvas'); c.width = c.height = 600;
      const d = LineStudio.DRAWINGS[id];
      const p = new LineStudio.Player(c, { drawing: id, style: d.style, duration: 4, ending: 'hold', small: true });
      const T = d.morph ? 3.5 : 4.01; for (let t = 0; t <= T; t += 0.25) p.renderAt(t);
      return c.toDataURL('image/png');
    }, id);
    writeFileSync(`${out}/${id}.png`, Buffer.from(url.split(',')[1], 'base64'));
  }
  console.log('stills ->', out, ids.join(' '));
} else {
  const fps = 30;
  const info = await page.evaluate(([drawing, style, ratio, duration, caption, ending]) => {
    const S = LineStudio.state; S.ratio = ratio; LineStudio.applyRatio();
    LineStudio.loadDrawing(drawing); const m = LineStudio.main;
    m.style = style; m.duration = +duration; m.caption = caption; m.ending = ending; m.restart();
    const len = ending === 'hold' ? m.duration + 2.5 : m.cycle;
    return { len, w: m.c.width, h: m.c.height };
  }, [drawing, style, ratio, duration, caption, ending]);
  const frames = Math.round(info.len * fps);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-preset', 'medium', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = 0; f < frames; f++) {
    const url = await page.evaluate((t) => { const m = LineStudio.main; m.renderAt(t); return m.c.toDataURL('image/jpeg', 0.92); }, f / fps);
    if (!ff.stdin.write(Buffer.from(url.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  console.log('video ->', out, `${info.w}x${info.h}`, `${info.len.toFixed(1)}s`);
}
await browser.close();
