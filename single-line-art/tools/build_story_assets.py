"""Pack the vectorized illustrations and the deck's background plate into story-assets.js.
usage: python3 build_story_assets.py <couple.json> <sitting.json> <plate.jpg> <out.js>"""
import sys, json, base64, io
from PIL import Image

def pack(path, n=5200):
    d = json.load(open(path))
    P = d['pts']
    # resample by arc length, keeping pen-up flags
    import math
    cum = [0.0]
    for a, b in zip(P, P[1:]):
        cum.append(cum[-1] + math.hypot(b[0] - a[0], b[1] - a[1]))
    L = cum[-1]; out = []; j = 0
    for i in range(n):
        t = L * i / (n - 1)
        while j < len(P) - 2 and cum[j + 1] < t: j += 1
        seg = (cum[j + 1] - cum[j]) or 1; u = (t - cum[j]) / seg
        a, b = P[j], P[j + 1]
        out += [round((a[0] + (b[0] - a[0]) * u) * 1e4), round((a[1] + (b[1] - a[1]) * u) * 1e4), b[2] if 0 < u <= 1 else 0]
    return out

couple, sitting, plate, dst = sys.argv[1:5]
im = Image.open(plate).convert('RGB'); im = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
buf = io.BytesIO(); im.save(buf, 'JPEG', quality=82)
logo = Image.open(plate).convert('RGB').crop((30, 1270, 310, 1500))
lb = io.BytesIO(); logo.save(lb, 'PNG')
js = 'window.STORY_ASSETS=' + json.dumps({
    'couple': pack(couple), 'sitting': pack(sitting),
    'plate': 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode(),
    'logo': 'data:image/png;base64,' + base64.b64encode(lb.getvalue()).decode(),
}, separators=(',', ':')) + ';\n'
open(dst, 'w').write(js)
print(dst, len(js) // 1024, 'KB')
