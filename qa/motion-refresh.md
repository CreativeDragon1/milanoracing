# Motion refresh validation — 26 October 2026

- Production build passed. Existing Three.js bundle size warning remains.
- Inspected Recorsa's live homepage, scrolling sections and public motion styles. Adapted masked text, staggered entrances, travelling typography and drawn rules to Milano's existing artwork and palette.
- Desktop light/dark and 390 x 844 mobile inspected in Chromium. Mobile document width 375 <= viewport 390; no horizontal page overflow.
- Home and Team browser titles use ` | `. Navigation, keyboard quote reveal and focus-visible static reveal state checked.
- Scroll reversal: content and ribbon transforms match exactly at the same scroll position after scrolling down and back; see motion-reversal.json.
- Warm, uninterrupted 12-second 1280 x 720 development-browser scroll: p95 7.1 ms, max 21 ms, no long tasks, no WebGL drawing and no layout-rectangle reads. See motion-performance.json. This is a local test, not a universal frame-rate guarantee. An initial run while switching tabs and running build work was noisy (p95 27.9 ms, max 1618 ms); it was repeated without those concurrent operations.
- Reduced-motion CSS rules were applied in the QA iframe: headline, panels, ribbon, bars and reveals became static and the progress line was hidden. This checks the CSS rules, not an OS preference change. See motion-reduced-styles.json.
- No new runtime library or scroll listener added. Native timelines handle scroll effects; older browsers retain the existing Motion reveal fallback and show a static ribbon.

## Full-width banner refinement

- Banner now runs continuously at 52 px/second using the browser animation engine. Pointer hover and keyboard focus ease speed to zero over 650 ms, then ease back on exit. An explicit pause control supports touch users. The animation pauses offscreen and when the tab is hidden, and is omitted for reduced-motion preferences.
- Brand colours verified from computed styles: #0019FF background, #FF7A00 slogan and dividers, #000000 slogan panel, #FFFFFF surrounding text.
- Desktop and phone bounds match the document width within 0.1 px; no horizontal overflow. Synthetic pointer-event checks verify intermediate deceleration, a stable stop and intermediate acceleration: banner-motion-results.json.
- Section reveals continuously translate and scale through the viewport, with exact reversal confirmed separately from the independently moving banner.
- Updated 12-second scroll check: p95 7.1 ms, max 21.1 ms, zero long tasks, layout-rectangle reads or WebGL drawing.

## Parallax and introduction layout refinement

- Native scroll timelines move dragon artwork and foreground lettering on separate depth planes, preserving the teaser's existing ambient drift. Hero artwork, intro logo, livery, MR 26 and kit-preview wordmarks have depth movement; phone distances are reduced. Desktop/phone reversal and reduced-motion style checks passed in parallax-results.json.
- Both Milano Racing and Always the fastest banner labels now use identical orange-on-black treatment.
- Removed the page progress line. All seven page introduction routes were checked at 1280 and 390 pixels: balanced heading measure, consistent description spacing, no horizontal clipping or page overflow; see page-heading-results.json. Null gaps indicate an absent description.
- Production build passed. Final local 12-second homepage scroll: p95 13.8 ms, maximum 48.6 ms, no long tasks, no WebGL draws and no layout-rectangle reads during scrolling. Results are local browser measurements, not a universal FPS guarantee.
