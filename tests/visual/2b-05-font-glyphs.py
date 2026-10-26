import sys; sys.path.insert(0, '/tmp/claude-0/-home-user-webchinhthuc/1900487a-6900-57f5-abbe-3137ea7f2a0f/scratchpad/tools/py')
import sys,glob,os
from fontTools.ttLib import TTFont
vn="ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠạẢảẤấẦầẨẩẪẫẬậẮắẰằẲẳẴẵẶặẸẹẺẻẼẽẾếỀềỂểỄễỆệỈỉỊịỌọỎỏỐốỒồỔổỖỗỘộỚớỜờỞởỠỡỢợỤụỦủỨứỪừỬửỮữỰựỲỳỴỵỶỷỸỹ₫“”‘’–—…"
for f in sorted(glob.glob(sys.argv[1]+'/*.woff2')):
    t=TTFont(f); cmap=t.getBestCmap(); miss=[c for c in vn if ord(c) not in cmap]
    name=t['name'].getDebugName(4); w=t['OS/2'].usWeightClass; fv='fvar' in t
    print(os.path.basename(f), os.path.getsize(f), '|', name, '| wght', w, '| variable' if fv else '', '| glyphs', len(cmap), '| missingVN', ''.join(miss) or 'none')
