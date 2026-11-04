# קו אחד: וידאו־ארט בקו רציף

`studio.html` is a small studio for one-line (continuous line) video art. Every drawing is a single
unbroken line that the page animates.

- **Hand-drawn one-line pieces**: face with closed eyes, sitting cat, cup with a steam heart, potted plant, heart on a string.
- **Morph**: the same line turns from face to cat to cup to plant.
- **Generated**: harmonograph, TSP (points joined into one tour), spiral and wave renderings of any image.
- **Your photo**: upload an image and turn it into one line (TSP / spiral / waves).
- Styles: ink on paper, neon, gold on navy, chalk on blackboard, rainbow. Formats 1:1, 9:16 (reels), 16:9.
- The "Record video" button records one full loop in the browser (MP4 or WebM, depending on the browser).

## Rendering MP4 files offline

Needs Node, Playwright (Chromium) and ffmpeg:

```bash
node render.mjs still out/                                   # PNG still of every drawing
node render.mjs video out.mp4 face ink 9:16 6 "קו אחד" fade  # <drawing> <style> <ratio> <seconds> [caption] [fade|retract|hold]
```

Drawings: `face cat cup plant heart morph harmono tsp spiral waves`. Styles: `ink neon gold chalk rainbow`.

Ready-made examples are in `examples/`.

## The story film (`story.html`)

An ~8.5 minute film that follows every slide of the lecture deck, in the deck's visual language (background plate,
logo, Assistant type, one long ground line that every drawing grows out of). Figures move: people walk in and across
the frame, meet, stand up, raise their arms; objects fall, fly and drive past; words and counters appear in turn.
The deck's own line illustrations (the couple back to back, the woman sitting) are vectorized and drawn as they are,
with tears that fall onto the line and spread as ripples. It ends with one tear turning into the "אדוות החיים" logo.

Files:
- `story.html` – the page (player and storyboard).
- `story-scenes.js` – one entry per scene in the `SC` list: slide, heading, subheading, duration, and functions for the
  main line, the overlay icons and the words at time `t`.
- `figures.js` – the one-line people (standing, walking, sitting, lying) and icons.
- `story-assets.js` – vectorized deck illustrations, background plate and logo (rebuild with `tools/vectorize.py`
  and `tools/build_story_assets.py`, which need Python with numpy and Pillow).

```bash
node render.mjs story examples/story-16x9.mp4 16:9   # lecture screen
node render.mjs story examples/story-9x16.mp4 9:16   # reels / stories
```
