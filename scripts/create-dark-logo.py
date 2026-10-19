from pathlib import Path
import base64

assets=Path(__file__).resolve().parents[1] / 'public/assets'
original=base64.b64encode((assets/'milano-official.png').read_bytes()).decode()
# A native SVG presentation of the unchanged original image. The mask selects
# only near-black pixels; the final composite retains the original alpha.
svg='''<svg xmlns="http://www.w3.org/2000/svg" viewBox="25 230 555 185">
<defs><filter id="white-ink" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%">
<feColorMatrix in="SourceGraphic" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" result="red"/>
<feColorMatrix in="SourceGraphic" values="0 1 0 0 0  0 1 0 0 0  0 1 0 0 0  0 0 0 0 1" result="green"/>
<feColorMatrix in="SourceGraphic" values="0 0 1 0 0  0 0 1 0 0  0 0 1 0 0  0 0 0 0 1" result="blue"/>
<feBlend in="red" in2="green" mode="lighten" result="rg"/>
<feBlend in="rg" in2="blue" mode="lighten"/>
<feColorMatrix type="luminanceToAlpha"/>
<feComponentTransfer result="ink"><feFuncA type="table" tableValues="1 1 0 0 0 0 0 0 0 0 0"/></feComponentTransfer>

<feFlood flood-color="white"/>
<feComposite in2="ink" operator="in" result="white"/>
<feColorMatrix in="SourceGraphic" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1" result="solid"/>
<feComposite in="white" in2="solid" operator="over"/>
<feComposite in2="SourceAlpha" operator="in"/>
</filter></defs>
<image width="648" height="648" href="data:image/png;base64,IMAGE" filter="url(#white-ink)"/>
</svg>'''.replace('IMAGE',original)
(assets/'milano-dark.svg').write_text(svg)
print('Dark SVG uses the exact original embedded logo with selective white ink and original transparency.')


