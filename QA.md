# Verification — 19 October 2026

## Passed

- TypeScript compilation and optimized production build.
- Development server opened and visually inspected in a real Chromium browser.
- Production build served separately and checked with a fresh browser tab; no console errors or warnings were recorded in that production check.
- 36 responsive checks: 9 routes at 320, 390, 768 and 1280 CSS pixels, rendered in same-origin browser frames. Each had one main heading, no horizontal overflow and no failed loaded images. These are browser viewport checks, not physical-device tests.
- Desktop and mobile screenshots visually reviewed for typography, spacing, image clipping and navigation.
- Home, Car Evolution, Team, Journal, Partners, all three article routes and the not-found page.
- Car tabs, all four versions, keyboard arrow navigation, timeline selection, comparison open/close and both comparison selectors.
- Evidence disclosure; team introduction expansion; jersey front/back controls.
- Journal Engineering and Design filters and article navigation; remaining filters share the same filtered-data control.
- Mobile menu opening and route selection, with menu closed after navigation.
- Email-copy success feedback and correct email/Instagram/LinkedIn/YouTube destinations. Email sending and external-account interaction were not performed.
- Route-fragment contact navigation and page focus/scroll handling.
- Car-version changes were checked for reserved panel height; V04/V05/V06/V10 returned the same panel height after the spacing correction.

## Performance and accessibility

- Local assets include a roughly 3 MB garment mesh plus bundled fonts and imagery.
- Application JavaScript is about 138 KB gzip; CSS about 10 KB gzip.
- Main car render reduced from 356 KB PNG to 21 KB WebP. Jersey photographs were replaced by a shaped 3D garment with the original PDF artwork.
- Hero is prioritized; off-screen images lazy-load. The garment renderer is dynamically imported near the viewport, renders on demand and stops after interaction settles. No idle animation or scroll hijacking.
- Reduced-motion handling is implemented in Motion and CSS. A physical reduced-motion device and sustained 60 FPS were not benchmarked.
- Semantic links/buttons, labelled tabs and selectors, skip link, visible keyboard focus and mobile expanded states are present. This is not a formal accessibility certification or screen-reader audit.

## Reproduce responsive checks

Start `npm run dev`, then open `/qa/responsive.html`. Click “Test all routes and sizes”. The suite records width, route, overflow, loaded-image failures and heading count. The harness is source-only and is not included in the production build.

## Content still needed

Version-specific CAD/renders and documented aerodynamic test conditions; personal biographies; dated manufacturing/testing entries. These are clearly labelled content placeholders, not missing navigation or simulated working features. See `CONTENT-SOURCES.md`.

## Garment replacement

- Replaced the flat extruded silhouette with a subdivided polo garment: rounded shoulders, open sleeves, curved neck binding, fabric thickness and subtle folds.
- Confirmed the default back is blank; optional name/number personalisation and all six member presets work. Original sponsor logos are applied to the original PDF artwork.
- Inspected front, side and back in the actual browser, including fullscreen; tested rotation, front/back presets and PNG capture.
- Source type check and production build pass. The optional Three.js chunk is 170 KB gzip and the garment mesh is approximately 3 MB, loaded only for the viewer.
- This is a reference-based visual recreation, not a scanned or measured exact replica.

Final recheck: 36 route/viewport combinations (320, 390, 768, 1280 px), no horizontal overflow or broken loaded images, one h1 per page. After the narrow-screen camera-fit adjustment, 320 px viewer visually checked with both sleeves in frame and 44 px touch controls. Production viewer rendered with no captured browser errors or warnings. Real mobile hardware and frame-rate benchmarking were not performed.

## Latest PDF artwork and studio viewer update

- Applied the supplied orange/blue/black/white throughout the UI; removed the decorative palette display.
- Extracted and used the original PDF dragon and Milano logo assets. Replaced the generated motif.
- Added all six confirmed members, using the supplied composite for Niteesh, Gayatri and Ashmitha.
- Redesigned the garment area as a full-width studio with a separate personalisation panel. Adjusted neckline, sponsor positions, cloth shading and fullscreen framing.
- Final responsive sweep: 36 route/width checks passed (320, 390, 768, 1280 px). Results are saved in `qa/responsive-results.json`.
- Tested custom name/number, blank reset, member presets, front/back, rotation, zoom, fullscreen and PNG capture. Numbers preserve leading zeroes and reject non-digits.
- The standalone HTML embeds assets, fonts and application code. Static validation checks script syntax, asset completeness and model resources. Direct local-file browser launch was blocked by browser tooling; the running app was inspected instead.
- Real-device performance, sustained 60 FPS and screen-reader certification are not claimed.


## Final sleeve, body and site cleanup

- Replaced stretched sleeve projections with separate proportional decals conforming to the fabric; inspected both sides and the back in production.
- Smoothed the torso and made orange side panels continuous around the sides. Removed the old normal-map download and refreshed both fallback posters.
- Applied the original dragon motif across the site; removed school references, status dots and redundant provenance/sponsor labels from the UI. Singapore uses a local SVG flag.
- Added researched descriptions and links for all five sponsors. Identity matches and source limitations are recorded in CONTENT-SOURCES.md.
- Repeated the 36 responsive checks after these changes: all passed. Visually reviewed the 320 px garment view, homepage and partner page, plus the final production viewer.
- Verified Niteesh's preset, blank reset, front/back and rotation after the final rebuild. Production browser console returned no errors or warnings.
- Vite reports a size advisory for the optional Three.js viewer chunk (170 KB gzip); it remains dynamically imported and renders only on interaction/resize.


## Hollow worn-garment refinement

The user clarified a relaxed worn shape without a visible mannequin, plus sleeve marks facing outwards on the upper arms. The torso has neutral chest/waist depth, slight hem ease and shallow hanging folds; neckline adjustment is distributed into surrounding fabric. Sleeve decals project from left/right sides rather than from behind, with cuff clearance. This is a modeled garment preview, not a physically validated cloth simulation. The original artwork and optional personalisation remain intact.

Focused verification for this refinement: TypeScript and production build passed; front and side inspected in the browser; source artwork retained and no mannequin mesh added. This geometry-only update keeps the previously checked page layouts.


## Smooth kit and public-copy cleanup

Replaced the black rectangular back badge with the PDF's exact transparent black-lettered STEM Racing mark. Sleeve stacks now use a shared orientation, centered on each outer arm: Brinda's above Enermax; Axis above NPE. Removed added cloth crease deformation and smoothed the upper fabric. Hid empty member-introduction controls and removed journal/editorial placeholder notes; technical limitations of the drag data remain available.

Transparent back mark and direct side view were visually verified. Axis/NPE now have visible clearance from the cuff and share a center line. The empty team-introduction controls are absent from the rendered page.


## Decorative label removal

Removed the hero car index and miniature-scale caption, livery badge, decorative section numbering/taglines, scroll instruction and repeated field-note labels. Primary headings, navigation, control labels, sponsor recognition and engineering units remain.
