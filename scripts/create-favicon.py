"""Build tab icons from the existing Milano artwork without reshaping it."""
from pathlib import Path
import base64
import io
from PIL import Image

public = Path(__file__).resolve().parents[1] / "public"
original = Image.open(public / "assets/milano-official.png").convert("RGBA")
light = original.crop((25, 230, 580, 415))
dark = light.copy()
# Same selective white ink as milano-dark.svg; preserve the original alpha.
pixels = []
for r, g, b, a in dark.getdata():
    ink = max(0, min(1, (.2 - max(r, g, b) / 255) / .1))
    pixels.append(tuple(round(c * (1 - ink) + 255 * ink) for c in (r, g, b)) + (a,))
dark.putdata(pixels)

def data_uri(image):
    output = io.BytesIO()
    image.resize((180, 60), Image.Resampling.LANCZOS).save(output, format="PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(output.getvalue()).decode()

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<style>.dark{{display:none}}@media(prefers-color-scheme:dark){{.light{{display:none}}.dark{{display:block}}}}</style>
<image class="light" x="2" y="22" width="60" height="20" href="{data_uri(light)}"/>
<image class="dark" x="2" y="22" width="60" height="20" href="{data_uri(dark)}"/>
</svg>'''
(public / "favicon.svg").write_text(svg, encoding="utf-8")
icon = Image.new("RGBA", (64, 64))
icon.alpha_composite(light.resize((60, 20), Image.Resampling.LANCZOS), (2, 22))
icon.save(public / "favicon.ico", sizes=[(16,16), (32,32), (48,48), (64,64)])
print("Created theme-aware SVG and multi-size ICO tab icons.")
