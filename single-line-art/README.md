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
