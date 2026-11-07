"""Prepare a sketched line illustration for "drawing itself" in the film.

For every ink pixel we compute when the pen reaches it: a walk along the connected ink
(breadth-first, so it spreads along the lines like flowing ink), starting at the left end
of the ground line; separate pieces are visited one after another, nearest first.

Output PNG (same size as the scaled input):
  R,G = drawing order 0..65535 (high byte, low byte)
  B   = ink strength 0..255 (0 = paper)
usage: python3 reveal_map.py <in.png> <out.png> [max_width]
"""
import sys
from collections import deque
import numpy as np
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
maxw = int(sys.argv[3]) if len(sys.argv) > 3 else 1600
im = Image.open(src).convert('L')
if im.width > maxw:
    im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
a = np.asarray(im, dtype=np.float32)
H, W = a.shape
ink = np.clip((242 - a) / 190, 0, 1)                    # ink strength, paper -> 0
core = a < 205                                            # pixels that carry the walk
# bridge 1-pixel gaps so strokes stay connected
c2 = core.copy()
for dy in (-1, 0, 1):
    for dx in (-1, 0, 1):
        c2 |= np.roll(np.roll(core, dy, 0), dx, 1)
core = c2 & (ink > 0.02)
idx = np.flatnonzero(core)
print('ink px', idx.size, 'of', H * W)

order = np.full(H * W, -1.0)
flat = core.ravel()
nb = [-W - 1, -W, -W + 1, -1, 1, W - 1, W, W + 1]

# label components
label = np.full(H * W, -1, dtype=np.int32)
comps = []
for s in idx:
    if label[s] >= 0:
        continue
    k = len(comps); label[s] = k; q = deque([s]); members = []
    while q:
        c = q.popleft(); members.append(c)
        cx = c % W
        for d in nb:
            n = c + d
            if n < 0 or n >= H * W or abs((n % W) - cx) > 1 or not flat[n] or label[n] >= 0:
                continue
            label[n] = k; q.append(n)
    comps.append(np.array(members))
print('components', len(comps))

# start: leftmost ink pixel in the lower two thirds (the ground line usually enters there)
ys, xs = idx // W, idx % W
band = ys > H * 0.3
cand = idx[band] if band.any() else idx
start = cand[np.argmin(cand % W)]

big = [i for i, c in enumerate(comps) if c.size >= 6]
cent = np.array([[comps[i] % W, comps[i] // W] for i in big], dtype=object)
cxy = np.array([[(comps[i] % W).mean(), (comps[i] // W).mean()] for i in big])
remaining = set(big)
cur = label[start]
offset = 0.0
last = start
visited_count = 0
while True:
    comp = comps[cur]
    # seed: pixel of this component nearest to the last pixel drawn
    px, py = comp % W, comp // W
    lx, ly = last % W, last // W
    seed = comp[np.argmin((px - lx) ** 2 + (py - ly) ** 2)]
    dist = {seed: 0.0}; q = deque([seed]); far = seed; fd = 0.0
    while q:
        c = q.popleft(); dc = dist[c]; cx = c % W
        for j, d in enumerate(nb):
            n = c + d
            if n < 0 or n >= H * W or abs((n % W) - cx) > 1 or not flat[n] or n in dist:
                continue
            nd = dc + (1.414 if j in (0, 2, 5, 7) else 1.0)
            dist[n] = nd; q.append(n)
            if nd > fd: fd, far = nd, n
    for c, d in dist.items():
        order[c] = offset + d
    offset += fd + 25.0          # a short pause for the pen between pieces
    last = far
    remaining.discard(cur)
    if not remaining:
        break
    rem = np.array(sorted(remaining))
    lx, ly = last % W, last // W
    d2 = (cxy[[big.index(r) for r in rem], 0] - lx) ** 2 + (cxy[[big.index(r) for r in rem], 1] - ly) ** 2
    cur = int(rem[np.argmin(d2)])

# faint ink around the strokes takes the order of the nearest stroke pixel
o = order.reshape(H, W)
inkmask = ink > 0.02
for _ in range(6):
    miss = inkmask & (o < 0)
    if not miss.any():
        break
    best = np.full((H, W), -1.0)
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            sh = np.roll(np.roll(o, dy, 0), dx, 1)
            take = (sh >= 0) & ((best < 0) | (sh < best))
            best[take] = sh[take]
    fill = miss & (best >= 0)
    o[fill] = best[fill]
o[(o < 0) & inkmask] = offset            # leftovers appear at the very end
ink[o < 0] = 0
o[o < 0] = 0
q16 = np.round(o / max(o.max(), 1) * 65535).astype(np.uint32)
rgb = np.stack([(q16 >> 8).astype(np.uint8), (q16 & 255).astype(np.uint8), np.round(ink * 255).astype(np.uint8)], -1)
Image.fromarray(rgb, 'RGB').save(dst, optimize=True)
print(dst, W, H)
