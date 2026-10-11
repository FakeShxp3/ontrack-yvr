# OnTrackYVR

A complete React website for student transit advocacy at Burnaby North Secondary, based on the original `ontrackyvr_content_inventory.md` in the parent folder.

## Run locally

Requires Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run start
```

## Design and interactions

- TransLink-inspired navy and blue palette, cool white surfaces, sky-blue display accents and restrained yellow action highlights. The club retains its own logo and identity.
- React 19 with Vinext, TypeScript, and Tailwind CSS 4.
- Lenis smooth scrolling and anchor navigation.
- Original Three.js architectural transit model: moving three-car train, elevated loop, skyline, trees, station, soft shadows, horizontal dragging, keyboard rotation, and reset controls.
- Shared pause control and support for system reduced-motion preferences.
- WebGL loading/error fallback to the original raster artwork.
- Pointer-responsive team cards with accessible team-detail dialogs.
- Floating glass navigation tabs and an accessible photo-backed expanded menu.
- Three-chapter pinned manifesto with scroll-scrubbed photo motion, chapter controls, skip link and a static reduced-motion reading layout.
- Five real Metro Vancouver photos, responsive WebP hero variants and visible photographer/licence credits.
- Expandable project descriptions and responsive mobile navigation.
- Scroll reveals, animated statistics, and a moving typography strip.
- Expanding navigation with a three-line menu icon and a fixed mobile title/close row.
- Informative manifesto chapters about research, Grade 7 outreach, and media, framed by six supplied club photos.
- Fanned executive cards with locally extracted portrait cutouts, soft blue backlighting, layered shadows, and hover, keyboard focus and tap selection; selected portraits lift while other cards fade. The cutouts preserve the original photographs rather than generating new faces. Kevin Bae's card retains a photo placeholder until his portrait is available.
- Network status badges with a hover/focus highlight and light sweep.
- Corrected Instagram (@ontrackyvr_), Discord invite and email links, plus email copying with honest failure feedback.
- Local WOFF2 fonts and optimized WebP/PNG imagery. No SVG images or icon representations are rendered by the website. The installed component catalog is retained; the page uses icon-free controls and disables the dialog's default SVG close icon.

## Content

Team leaders, executives, project scopes, contacts, and partnership statuses follow the supplied brief. This is a presentation site, with no backend signup form or invented submission flow.

The regional statistics were corrected against [TransLink's 2023 Transit Service Performance Review](https://www.translink.ca/plans-and-projects/strategies-plans-and-guidelines/managing-the-transit-network): more than 233 million journeys in 2023, 430,000 unique customers on an average fall weekday, and approximately one-third of Metro Vancouver residents using transit weekly. These replace the brief's unverified 463 million / 346 thousand / 72% figures. The website labels the snapshot as 2023 and links the source.

The generated architectural artwork is conceptual and does not depict a documented OnTrackYVR project or an actual train design. Its source and prompt are recorded in `docs/art-direction.md`.

## Main files

- `app/page.tsx`: page content, navigation, interactions, and motion coordination.
- `app/content.ts`: team, project, partnership, and executive data.
- `components/transit-scene.tsx`: custom WebGL scene and resource lifecycle.
- `app/globals.css`: responsive styling and Tailwind theme.
- `app/refinements.css`: photographic layouts, glass navigation and pinned story styles.
- `components/manifesto.tsx`: scroll-driven three-chapter manifesto.
- `public/photos/credits.json`: photographic provenance and licence documentation.
- `.openai/hosting.json`: Sites project registration.

Private publication is managed with Sites. The original Markdown inventory is preserved outside this project.
