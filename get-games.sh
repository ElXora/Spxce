#!/bin/bash
# run from the Spxce folder:  bash get-games.sh
set -e
rm -rf /tmp/gh-html && git clone --depth 1 https://github.com/freebuisness/html.git /tmp/gh-html
mkdir -p public/game
python3 - <<'PY'
import json,re,os,shutil
S='/tmp/gh-html'; files=set(os.listdir(S))
def best(n):
    if n in files: return n
    st=n[:-5]
    c=[f for f in files if re.fullmatch(re.escape(st)+r'-[a-z0-9]+\.html',f)]
    key=lambda f:(int((re.search(r'(\d+)\.html$',f) or [0,0])[1] or 0),len(f))
    return sorted(c,key=key)[-1] if c else None
p='public/json/games.json'; d=json.load(open(p)); ok=miss=0
for g in d:
    m=re.search(r'(?:freebuisness/html@main/|^/game/)(.+\.html)$',g['url'])
    if not m: continue
    b=best(m.group(1))
    if b:
        shutil.copy(f'{S}/{b}',f'public/game/{m.group(1)}')
        g['url']='/game/'+m.group(1); g['proxy']=False; ok+=1
    else: miss+=1
json.dump(d,open(p,'w'),indent=1)
print(f'downloaded {ok} games into public/game, {miss} not in repo (left as-is)')
PY
