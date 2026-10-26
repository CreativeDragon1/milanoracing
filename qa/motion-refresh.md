# Motion refresh validation — 26 October 2026

- Production build passed. Existing Three.js bundle size warning remains.
- Inspected Recorsa's live homepage, scrolling sections and public motion styles. Adapted masked text, staggered entrances, travelling typography and drawn rules to Milano's existing artwork and palette.
- Desktop light/dark and 390 x 844 mobile inspected in Chromium. Mobile document width 375 <= viewport 390; no horizontal page overflow.
- Home and Team browser titles use ` | `. Navigation, keyboard quote reveal and focus-visible static reveal state checked.
- Scroll reversal: content and ribbon transforms match exactly at the same scroll position after scrolling down and back; see motion-reversal.json.
- Warm, uninterrupted 12-second 1280 x 720 development-browser scroll: p95 7.1 ms, max 21 ms, no long tasks, no WebGL drawing and no layout-rectangle reads. See motion-performance.json. This is a local test, not a universal frame-rate guarantee. An initial run while switching tabs and running build work was noisy (p95 27.9 ms, max 1618 ms); it was repeated without those concurrent operations.
- Reduced-motion CSS rules were applied in the QA iframe: headline, panels, ribbon, bars and reveals became static and the progress line was hidden. This checks the CSS rules, not an OS preference change. See motion-reduced-styles.json.
- No new runtime library or scroll listener added. Native timelines handle scroll effects; older browsers retain the existing Motion reveal fallback and show a static ribbon.
