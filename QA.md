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
- Car-version changes were checked for reserved panel height; the earlier archive entries returned the same panel height after the spacing correction (superseded by the public dataset below).

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


## Public charts and prospectus packages

- Imported the supplied illustrative V1–V4 data, all six supplied charts, selectable versions and drag/downforce/mass comparisons. Previous actual drag statistics and splitter detail are absent from the current public application.
- Checked keyboard arrow selection, both comparison selectors and all six chart buttons in the live browser. Added original-resolution chart download links for small screens.
- Matched all five plan names, prices and benefits to the prospectus page image. Enquiry links contain the correct team email and selected package subject; no email was sent.
- Removed the proposed homepage portrait strip at the user's request. Section-specific photography remains pending.
- Re-ran 36 route/width checks: no page overflow, broken loaded images or missing/duplicate main headings. Desktop package layout and 320 px mobile package layout visually inspected. No browser warnings/errors in the focused inspection.
- This update does not revalidate physical garment accuracy, CFD results, real devices or sustained frame rate.

## Individual portrait replacement

All six supplied 1080 x 1350 JPEGs were copied byte-for-byte and verified as loaded in the browser. The Team cards use 4:5 contain sizing. Both desktop rows were visually reviewed; the Team route at 320 px had no horizontal overflow or broken loaded images. Production build and standalone asset validation passed.

## Livery component explorer

All seven hotspots were clicked in the running browser and showed their corresponding explanation. The explanation container stayed at 600 px across desktop selections. Both cyclic next/previous controls and Enter activation were checked, as was selection from the component list. Targeted livery checks at 320, 390, 768 and 1280 px found no horizontal page overflow, broken loaded images or missing link destinations. Mobile uses a horizontally scrollable component list to bring the explanation closer to the image. Touch targets are 44 px; reduced-motion styling is implemented. Results are in qa/livery-results.json. This does not constitute physical-device or screen-reader certification.


## CAD archive, sponsor equality, motion and countdown

- Loaded all four supplied STEP-derived GLBs in the browser; tested viewpoint buttons, rotation, zoom, reset and keyboard controls. The models preserve source geometry and colors, with display tessellation. This is not aerodynamic validation.
- MK 1–MK 4 labels are consistent across the archive, comparisons and charts. MR 26 remains a sealed Coming soon panel with no livery or performance statistics. Comparison previews use the same 12:7 landscape ratio; rows use equal heights, including MR 26, with stacked phone layouts.
- Checked all five sponsor slots at seven widths on Home and Partners (14 checks): equal dimensions, all visible, no horizontal overflow.
- Centralized spring settings, reduced-motion handling, navigation feedback and comparison transitions. The 3D viewer renders on interaction rather than continuously; no sustained frame-rate benchmark or physical-device certification was performed.
- Countdown updates were observed in the browser. Boundary checks passed one day and one second before the deadline, at competition start and on the following day. Deadline is 2026-11-23T00:00:00+08:00; the visible date/time and digits use the visitor’s browser locale and local time zone. No location permission is requested. Hidden tabs pause scheduled updates and resume from the clock.
- Repeated 36 route/width checks after adding the countdown: no horizontal page overflow, broken loaded images or missing/duplicate main headings.
- Production and standalone builds checked separately. Standalone HTML assets are byte-validated; direct file URL interaction remains untested because the browser tool blocked file launch.


## Livery release teaser

Replaced the public livery explorer with a dedicated blue/orange sealed reveal, using existing dragon artwork. Home hero and Home/Journal story previews share the same teaser; no release date is invented. The old explorer source is retained for future release but is no longer imported into the public UI. Hover motion is decorative and disabled with reduced-motion preferences.

Livery teaser verification: 36 route/width checks passed after correcting the compact card intrinsic sizing. Visually checked the 320 px release page and desktop Home/Journal previews. Home teaser navigation, Back to journal and the Design filter work. Production and standalone builds passed.


## Spacing and team quotes

Removed fixed hero minimum heights and tightened section/header spacing while preserving readable gaps. Kept the Every detail heading and added the existing Milano logo beneath it with a vector viewport around its transparent padding. Added the five user-supplied quotes verbatim, matched by member ID; no quote was invented for Ashmitha. Checked the quote/name pairs in the browser, desktop logo placement and all 36 route/width combinations with no overflow or broken loaded images.


## Flag alignment and chart title cleanup

Singapore and its flag are grouped in a nonbreaking inline layout on Team. Regenerated all six SVG charts without their embedded plot titles; data, axes, legends and illustrative-data labels remain. All six chart selectors were tested and their images loaded in the browser.


## Competition identity copy

Home, Team and Partners now explicitly describe Milano Racing as competing in STEM Racing. Team location is on a separate block line, with Singapore and the flag kept together. Verified the three descriptions in the rendered browser and visually checked the Team line break.

Signature teaser update: MR 26 and livery initial reveals and replay completion checked in the browser. Both return to the sealed composition with replay enabled. 36 route/viewport checks passed at 320, 390, 768 and 1280px with no horizontal overflow or broken images. At 320px the MR 26 comparison preview remains 221 x 129px and paired cards have equal 371px heights; signature and text visually fit. Reduced-motion fallback implemented through Motion and CSS; OS preference was not emulated. Production and standalone builds passed.

Portrait quote update: five supplied quotes now reveal over portraits on mouse hover or keyboard focus, with a tap toggle and Escape dismissal. Browser checked quote opening, Escape closure, text wrapping and 320px layout (no overflow or broken images). Short and long quotes visually checked; reduced-motion CSS removes transitions. No quote invented for Ashmitha. Production and standalone builds passed.

Kit export verification: personalised GEET / 33 PNG downloaded at 2400 x 3000. GIF downloaded and decoded with Pillow: 960 x 1200, 90 frames, 7200ms total duration, loop=0, 5 distinct sampled views; front, back and sides reviewed. Cancel then retry restored controls and preserved personalisation. No browser errors recorded during the completed GIF. Background, Milano signature and all garment artwork remain visible in the exports.

Production preview: inline GIF worker completed all frames and the resulting 960 x 1200 GIF loaded in the browser. Production PNG downloaded successfully. The jersey article at 320px had no horizontal overflow, broken images or empty links. Production and standalone builds passed; standalone assets and script syntax verified.

Rotation refinement: downloaded GIF decoded successfully at 960 x 1200 with 180 frames, every delay 40ms (25 fps), total duration 7200ms, infinite loop. Export caption visually verified as ALWAYS THE FASTEST; bottom label is MILANO RACING. Shared PNG/GIF composition uses the same captions. Production and standalone builds passed.


## Contact links — 20 October 2026
Contact buttons offer Gmail, another email app and a copyable address. All five partnership CTAs route to the contact panel and preserve the correct plan in both email URLs. Header and footer contact links reset to a general enquiry. Verified all five plan selections, generated URL parameters and copy feedback in the browser; no email was sent. Responsive sweep passed all 36 route/width combinations. Production build and embedded HTML validation passed. External social pages were not fully verifiable through automated fetching; their supplied destinations are retained.

Email-provider follow-up: Gmail now explicitly targets the visitor default session at /mail/u/0/. The expandable alternative-service menu provides Outlook/Hotmail, Microsoft 365, Yahoo compose URLs and a default-app mailto. Verified generated recipient, subject and body parameters, menu expansion and 320px layout without overflow. Authenticated provider compose screens were not tested; no account discovery or email sending is performed.


## Interactive engineering charts — 20 October 2026
Replaced all six static chart views with responsive HTML/SVG charts driven by the existing illustrative JSON. Added bar selection, pointer inspection, keyboard/touch sliders, series toggles, tables and CSV exports. Drag and mass have separate labelled axes. Verified all chart selections, series visibility, keyboard endpoints, a component share and table expansion. Downloaded convergence CSV and compared all 101 iterations / 404 drag values with the source. Numerical dataset matches the supplied ZIP (version names retain the requested MK naming). All 36 route/width layout checks passed, including the engineering article at 320px. Removed visible source-credit copy as requested.

## Minimal scroll motion — 20 October 2026
Shared scroll reveals use a 12px lift and 550ms eased fade, with short bounded delays on team and journal cards. Reveals play once per mounted page; sponsor cards use equal timing. Browser frame sampling verified intermediate opacity values, stable element height, completion and no replay on return. Keyboard focus reveals content immediately; the contact anchor lands on visible content. An isolated matchMedia simulation verified all 12 homepage reveals are visible without transforms under reduced motion (the user's OS preference was not changed). All 36 route/viewport checks at 320, 390, 768 and 1280px passed without horizontal overflow or broken images. Production and standalone builds passed. Evidence: qa/scroll-motion-results.json; repeatable browser harnesses: qa/scroll-motion.html and qa/reduced-motion.html.

## Jersey studio background — 20 October 2026
Replaced the large MILANO watermark and pale grey viewer backdrop with a charcoal studio gradient, a fine orbit line, soft floor shading and a small monochrome Milano signature. Decorative layers are hidden from assistive technology and do not intercept pointer input. Controls have contrasting dark surfaces and visible focus outlines. The canvas is absolutely positioned within the stage so its drawing-buffer dimensions cannot grow the layout. Browser verified rotation from 10 to 40 degrees, fullscreen entry, article appearance and the team kit at 320px without horizontal overflow, broken images or empty links. PNG/GIF export composition was not changed. Production and standalone builds passed.

Studio branding refinement: restored a large responsive MILANO wordmark behind the garment, replaced the orbit ring with soft directional lighting and enlarged the silver signature. The signature now maps the original artwork's luminance to silver shades instead of flattening it into a silhouette. Desktop article and 320px team kit reviewed visually; mobile audit found no horizontal overflow, broken images or empty links. Production and standalone builds passed.

## Cloth realism refinement — 20 October 2026
Enhanced the cloth normal texture, added subtle roughness variation and two anti-aliased rows of hem stitching. Retuned key, fill and rim lighting; enabled self-shadowing with separate inner/hem shadow rules to avoid coincident-surface artifacts. Neck binding uses a cloth-like physical material. Original mesh, printed artwork, sleeve logo placement and studio background remain intact. Front, side and back reviewed in-browser. PNG creation completed at 2400 x 3000 during visual iteration; final rotating GIF decoded at 960 x 1200, 180 frames, 40ms per frame (25fps), 7200ms duration, infinite loop. Viewer and exports share lighting, materials and shadow settings. Production and standalone builds passed. Physical fabric simulation is not implemented; the existing garment geometry is preserved.


## High-frame-rate kit exports — 20 October 2026
Downloaded and decoded the actual browser exports: GIF 960 x 1200, 360 frames, all delays 20ms (50fps), 7200ms, infinite loop. MP4 H.264 960 x 1200, 432 decoded frames, both reported rates 60/1, duration 7.200000 seconds. MP4 cancellation at 1 percent restored the viewer and export controls. Production and standalone builds passed; embedded script syntax and asset integrity checked. Browser playback cadence depends on the device; file frame rates were verified directly. Evidence: qa/kit-framerate-export.json.


## Team role layout — 20 October 2026
Swapped Ajinkya and Raahi: desktop top row is Lead Engineer, Team Leader, Aerodynamicist; second row is Designer, Resource Lead, Outreach Lead. Equal cards preserve full 4:5 introduction artwork, with aligned role/name/link spacing. Reading order is shared by visual and keyboard navigation, flowing to two columns on tablet and one on phones. Browser layout checks at 320, 390, 768 and 1280px passed without horizontal overflow, broken loaded images or empty links. Desktop and phone appearance reviewed. Production and standalone builds passed. Evidence: qa/team-layout-results.json.
