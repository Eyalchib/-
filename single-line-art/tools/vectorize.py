"""Turn a raster one-line illustration into a single ordered polyline.

Steps: threshold -> Zhang-Suen thinning -> spur pruning -> walk the skeleton from the
left end of the ground line to its right end, exploring every side branch on the way
(branches are walked out and back, so the result is one continuous line).
Detached pieces (tear drops, small breaks) are joined with pen-up moves.
Output: JSON list of [x, y, penUp] in a box where the ground line sits at y = 1.

usage: python3 vectorize.py <image> <x0> <y0> <x1> <y1> <out.json> [scale]
"""
import sys, json
from collections import deque
import numpy as np
from PIL import Image

src, x0, y0, x1, y1, out = sys.argv[1], *map(int, sys.argv[2:6]), sys.argv[6]
scale = float(sys.argv[7]) if len(sys.argv) > 7 else 2.0
im = Image.open(src).convert('L').crop((x0, y0, x1, y1))
im = im.resize((int(im.width * scale), int(im.height * scale)), Image.BICUBIC)
a = np.asarray(im, dtype=np.float32)
B = (a < 150).astype(np.uint8)
B[[0, -1], :] = 0; B[:, [0, -1]] = 0

def thin(img):
    img = img.copy()
    while True:
        changed = False
        for step in (0, 1):
            P = np.pad(img, 1)
            p2, p3, p4 = P[:-2, 1:-1], P[:-2, 2:], P[1:-1, 2:]
            p5, p6, p7 = P[2:, 2:], P[2:, 1:-1], P[2:, :-2]
            p8, p9 = P[1:-1, :-2], P[:-2, :-2]
            nb = [p2, p3, p4, p5, p6, p7, p8, p9]
            Bn = sum(n.astype(np.int32) for n in nb)
            seq = nb + [p2]
            A = sum(((seq[i] == 0) & (seq[i + 1] == 1)).astype(np.int32) for i in range(8))
            if step == 0:
                c = (p2 * p4 * p6 == 0) & (p4 * p6 * p8 == 0)
            else:
                c = (p2 * p4 * p8 == 0) & (p2 * p6 * p8 == 0)
            m = (img == 1) & (Bn >= 2) & (Bn <= 6) & (A == 1) & c
            if m.any():
                img[m] = 0; changed = True
        if not changed:
            return img

S = thin(B)
H, W = S.shape
N8 = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]
def nbrs(p):
    y, x = p
    return [(y + dy, x + dx) for dy, dx in N8 if 0 <= y + dy < H and 0 <= x + dx < W and S[y + dy, x + dx]]

# prune short spurs
for _ in range(2):
    pts = list(zip(*np.nonzero(S)))
    ends = [p for p in pts if len(nbrs(p)) == 1]
    for e in ends:
        path = [e]; cur = e; prev = None
        while True:
            nb = [q for q in nbrs(cur) if q != prev and q not in path]
            if len(nb) != 1 or len(path) > int(8 * scale):
                break
            prev, cur = cur, nb[0]; path.append(cur)
        if len(path) <= int(8 * scale) and len(nbrs(cur)) >= 3:
            for q in path[:-1]: S[q] = 0

pix = set(zip(*np.nonzero(S)))
# ground row: the row with the most skeleton pixels in the bottom fifth
rows = np.bincount([p[0] for p in pix], minlength=H)
lo = int(H * 0.8)
gy = lo + int(np.argmax(rows[lo:]))
ground = [p for p in pix if abs(p[0] - gy) <= 2]
start = min(ground, key=lambda p: p[1]); end = max(ground, key=lambda p: p[1])

def bfs(a, b):
    prev = {a: None}; dq = deque([a])
    while dq:
        c = dq.popleft()
        if c == b: break
        for q in nbrs(c):
            if q not in prev: prev[q] = c; dq.append(q)
    path = []; c = b
    while c is not None: path.append(c); c = prev.get(c)
    return path[::-1] if path[-1] == a else [a]

spine = bfs(start, end)
onspine = set(spine)
visited = set()
walk = []  # (y, x, penUp)

def explore(root):
    """walk every unvisited branch hanging off root, out and back (iterative DFS)."""
    stack = [(root, iter(nbrs(root)))]
    while stack:
        node, it = stack[-1]
        nxt = None
        for q in it:
            if q not in visited and q not in onspine:
                nxt = q; break
        if nxt is None:
            stack.pop()
            if stack: walk.append((*stack[-1][0], 0))
            continue
        visited.add(nxt); walk.append((*nxt, 0)); stack.append((nxt, iter(nbrs(nxt))))

for p in spine:
    visited.add(p); walk.append((*p, 0)); explore(p)

# detached pieces: visit each, nearest first, with pen-up jumps, then return to the end
rest = pix - visited
while True:
    rest = {p for p in rest if p not in visited}
    comps = []
    seen = set()
    for p in rest:
        if p in seen: continue
        comp = []; dq = deque([p]); seen.add(p)
        while dq:
            c = dq.popleft(); comp.append(c)
            for q in nbrs(c):
                if q not in seen: seen.add(q); dq.append(q)
        if len(comp) >= int(4 * scale): comps.append(comp)
    if not comps: break
    last = walk[-1][:2]
    comp = min(comps, key=lambda c: min((q[0] - last[0]) ** 2 + (q[1] - last[1]) ** 2 for q in c))
    entry = min(comp, key=lambda q: (q[0] - last[0]) ** 2 + (q[1] - last[1]) ** 2)
    visited.add(entry); walk.append((*entry, 1)); explore(entry)
    rest -= set(comp)
walk.append((*end, 1 if walk[-1][:2] != end else 0))

# thin out and smooth (keep pen-up flags)
pts = [p for i, p in enumerate(walk) if i % 2 == 0 or p[2] or (i + 1 < len(walk) and walk[i + 1][2])] + [walk[-1]]
arr = np.array([[p[1], p[0]] for p in pts], dtype=np.float64)
flags = [p[2] for p in pts]
sm = arr.copy()
for i in range(len(arr)):
    lo_, hi_ = max(0, i - 2), min(len(arr), i + 3)
    if any(flags[lo_ + 1:hi_]): continue
    sm[i] = arr[lo_:hi_].mean(axis=0)
h = gy  # ground at y = 1
box = max(W, h)
res = [[round(float(x) / box, 4), round(float(y) / h, 4), int(f)] for (x, y), f in zip(sm, flags)]
json.dump({'w': W / box, 'pts': res}, open(out, 'w'))
print(out, 'skeleton px', len(pix), 'walk', len(walk), 'out', len(res), 'pen-ups', sum(flags), 'aspect', round(W / h, 3))
