# Milano Racing

A complete responsive React + TypeScript website with Vite, Motion for React, React Router and a custom tactile CSS design system. Native scrolling; no idle animation loops or scroll hijacking.

## Run locally

Use Node.js 22.12+ (Node 24 was used for this build).

```sh
npm ci
npm run dev
```

Open the Local URL printed by Vite, normally `http://127.0.0.1:5173`.

```sh
npm run build
npm run preview
```

The production output is `dist/`. No API keys, database, account or environment variables are needed. Contact links open the visitor's email application; the copy-email control copies the real team email. There is no pretend form submission.

## Project structure

```text
src/
  App.tsx                 Routes, navigation transitions, focus and scroll handling
  main.tsx                React entry point
  content.ts              Editable cars, people, sponsors, journal and contact links
  motion.tsx              Central springs, Press, Reveal and PageMotion components
  styles.css              Design tokens, tactile surfaces and responsive layouts
  components/site.tsx     Shared header, footer, headings and links
  components/JerseyViewer.tsx Accessible interactive garment viewer
  lib/jerseyScene.ts        Lazy-loaded Three.js scene and camera controls
  lib/jerseyArtwork.ts      Original PDF artwork, sponsor placement and personalisation
  jersey.css               Base kit viewer styles
  identity.css             Team palette and original dragon motif
  kit-product.css          Studio viewer and personalisation layout
  assets.ts                Shared web and standalone asset resolver
  pages/                  Home, Evolution, Team, Journal, Article, Partners, NotFound
public/assets/            Actual supplied brand assets and verified member graphics
index.html                Metadata and HTML entry point
vite.config.ts            Build configuration
```

## Edit content

Team, sponsor and journal content lives in `src/content.ts`; public engineering data and partnership plans have their own editable files below.

- **Cars and charts:** `src/data/public-engineering.json` holds the illustrative public dataset supplied in `website_charts.zip`. `content.ts` exports its four versions. The six supplied chart images live in `public/assets/`; their selector is `components/EngineeringCharts.tsx`. Actual competition results are not included in the current public build. Replace chart images and JSON together when updating them.
- **Models:** MK 1 Arrow, MK 2 Blade, MK 3 Hoop and MK 4 Apex use web meshes converted directly from the supplied STEP assemblies, retaining their colours. MR 26 is a sealed Coming soon entry with no model, photograph or statistics.
- **Partnership plans:** edit `components/PartnershipPlans.tsx`. Prices, benefits and package inheritance match page 4 of the supplied prospectus, including its unusual Signature/Essence price order. Currency is shown as `$` because the document does not specify a currency code. Enquiry links open an email draft; they do not send or purchase anything.
- **People:** `people` contains all six confirmed members. The latest three graphics were supplied directly by the team, with surnames and kit numbers from its shirt specification. Set optional `introduction` and `highlights` fields to replace the editable introduction placeholders. Member biographies and contributions remain editable until supplied.
- **Sponsors:** the five supplied sponsors are confirmed by the user. No sponsorship tiers, amounts, services or contractual benefits are invented. Sponsor recognition does not imply website endorsement or a fabricated outbound URL.
- **Journal:** add actual updates to `posts`. Current entries are undated notes based on supplied assets and results, not invented event reports. Add manufacturing/testing photographs and dates when available.
- **Contact:** change the `contact` object. The LinkedIn link is the direct company URL, with the supplied YouTube tracking redirect removed.

## Motion and accessibility

Central spring values are in `src/motion.tsx`. Press feedback uses springs; the same components support hover, tap and content reveals. Page changes fade gently and version details switch within a reserved area. Buttons also have a CSS pressed state.

`MotionConfig reducedMotion="user"`, `useReducedMotion` and the CSS `prefers-reduced-motion` rule remove spatial animation for users who request it. Mobile navigation has an expanded state and Escape support. Car tabs support Left/Right/Home/End keys, roving focus, tab-panel labels and selected states. All pages include a skip link and visible keyboard focus.

## Deploy

The build is suitable for static hosting; upload the **contents** of `dist/`. Configure unknown routes to return `index.html` so direct visits to `/evolution`, `/team`, `/journal`, `/journal/livery` and `/partners` work.

- **Vercel:** import this project; build command `npm run build`, output `dist`. The included `vercel.json` supplies the SPA rewrite.
- **Netlify / Cloudflare Pages:** build command `npm run build`, output `dist`; `public/_redirects` is copied to the output.
- **Other hosts:** configure the equivalent SPA fallback. A normal file server without a fallback will return 404 for deep links.

The project bundles local open-license fonts; no font requests leave the site. Images are local; the main car render is an optimized WebP derivative. The jersey uses a shaped garment mesh, original supplied logos and the exact dragon artwork extracted from the shirt PDF; the personal jersey photographs are not displayed. Lazy loading is used below the fold. There are no analytics or social tracking embeds.

The garment viewer loads Three.js and its model only near the viewport. Rendering occurs during interaction or resize, not continuously while idle. Drag, keyboard arrows, front/back presets, zoom, reset, fullscreen and PNG capture are supported. Reduced motion removes the spring camera transition. Devices without WebGL receive front/back rendered posters. The model is a visual reconstruction rather than a measured digital twin. See `THIRD-PARTY-ASSETS.md` for the CC0 garment base.

See `CONTENT-SOURCES.md` for provenance and `QA.md` for verification scope and remaining content gaps.

## Standalone HTML

`npm run build:html` creates `downloads/Milano-Racing.html` inside the project folder. This single file embeds the application, photos, fonts, artwork and garment model. Open it in a modern browser with JavaScript and WebGL enabled. It uses hash routes so navigation works from disk. No server or connection is required for the site itself; external social/contact links still open their destinations. The normal Vite build uses clean URL routes.

The HTML was checked for embedded asset completeness and JavaScript syntax. Direct `file://` browser automation was blocked by the testing tool, so local-file launch was not interactively verified.

## Team kit

The kit uses the original PDF dragon motif, original sponsor logos, blue neck/raglan trim, orange side panels and black sleeve cuffs. The viewer supports rotation, zoom, front/back presets, reset, fullscreen and PNG capture. A compact panel accepts an optional name and two-digit number, plus all six team presets. It starts with a blank back. Personalisation is in-memory only and is never submitted.

The generic CC0 garment was adapted into this interactive visual preview; it is not a measured production pattern or manufacturing specification. Exact artwork is preserved, while custom names/numbers use bundled open-license fonts (see asset provenance).


## Livery hotspots

The livery article includes seven selectable component hotspots. Edit `src/data/livery-components.ts` for names, percentage-based image positions and explanations. `components/LiveryExplorer.tsx` supplies matching component buttons, previous/next navigation, live selection announcements and a stable-height explanation panel. Its scoped CSS respects reduced motion and keeps 44 px hotspot targets. The source render is unchanged.


## Model viewer and sponsor layout

`src/components/CarViewer.tsx` and `src/lib/carScene.ts` provide the lazy-loaded, demand-rendered Three.js car viewer. Drag or use keyboard arrows to rotate; buttons offer perspective, side, top and front views, zoom and reset. Page scrolling remains native. The four `concept-v*.glb` files correspond to MK 1 through MK 4; `concept-v*.webp` are renders of those same meshes for comparisons and 3D fallbacks. Display names live in `src/data/public-engineering.json`. Source V identifiers are internal file keys only. All engineering figures remain illustrative; importing geometry does not validate those figures.

Sponsor artwork uses its original colours and aspect ratio. `SponsorLogo.tsx` normalises transparent padding for balanced prominence. All five sponsors have identical card and logo slots at each breakpoint, with no featured sponsor or carousel.

The homepage countdown targets 23 November 2026 at 00:00 Singapore time. Visitors see the event date in their browser locale and local time zone, with locale-formatted numbers. The deadline is a single global instant. Change `competitionStart` and the time element’s `dateTime` in `src/components/CompetitionCountdown.tsx` when a confirmed start time is available.

The livery is currently sealed for release. `LiveryPreview.tsx` supplies the teaser on Home, Journal and the livery route. The previous explorer is retained in source for the team to reintroduce on release day.

MR 26 and the livery use the shared `SignatureReveal` component and `teaserMotion` timings. Each sequence starts once on entering view and settles after 3.6 seconds; full teaser pages offer replay. Reduced-motion visitors see the final composition immediately. Linked previews have no nested replay buttons.

Kit exports are rendered locally using a separate WebGL renderer, so output size does not depend on device pixel ratio or the viewer's zoom. PNG: 2400 x 3000. GIF: 960 x 1200, 180 frames at 25 fps, 7.2-second full rotation, infinite loop. GIF encoding runs in an inline bundled worker; frames are transferred one at a time to limit memory. Export progress, cancellation, error messages and object-URL cleanup are included. The PNG uses the current azimuth with a consistent product framing; GIF starts on the personalised back.
