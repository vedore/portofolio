# AGENTS.md

## Project overview

This is João Vedor's frontend-only interactive portfolio. It combines a
scroll-driven React/Three.js microscope scene with a full-screen circular
"scope" carousel and data-backed portfolio detail pages.

There is no backend, API, authentication, database, router, service worker,
deployment configuration, or automated test/lint setup in this repository.

## Stack and commands

- React 19 with plain JavaScript (`.js` / `.jsx`)
- Vite 7
- Tailwind CSS 3 with a small global stylesheet in `src/index.css`
- Three.js, `@react-three/fiber`, and `@react-three/drei`
- `@vercel/analytics`
- npm is the package manager; `package-lock.json` is committed

```bash
npm install
npm run dev
npm run build
npm run preview
```

`npm run build` is the required verification after source changes. No `test`,
`lint`, `typecheck`, or formatter scripts currently exist.

## Repository map

```text
src/
  App.jsx                              # application shell and orchestration
  main.jsx                              # React mount point
  index.css                             # global styles and reduced-motion rules
  config/
    cameraPath.js                       # desktop/mobile camera coordinates
    scopeTiming.js                      # hero, scope, camera, and modal timing
    sceneThemes.js                      # legacy day/night config for unused scene experiments
  data/
    ScopeViewSections.data.js           # source of truth for portfolio content
  hooks/
    useScrollProgress.js                # container-scroll normalization
    useScopeProgress.js                 # phase and specimen progress calculations
    useScrollNavigation.js              # requestAnimationFrame scroll navigation
  utils/
    dom.js                              # viewport and interactive-target helpers
    progress.js                          # shared clamp/easing functions
    scopeProgress.js                    # section index -> scope progress mapping
  components/
    scene/
      Scene.jsx                         # WebGL detection, Canvas, scene composition
      ScrollCamera.jsx                  # staged camera choreography
      MicroscopeModel.jsx               # `/models/microscope.glb` loader
      MicroscopeChamber.jsx             # laboratory geometry
      WaterfallPlane.jsx                # animated shader display
      ThemeTransition.jsx               # warm/cold material and light interpolation
      Lights.jsx                         # theme-aware scene lighting
      CameraTuner.jsx                   # development-only orbit controls
      Environment.jsx, SunBeam.jsx,
      WavePlane.jsx                     # currently not rendered by Scene.jsx
    ui/
      HeroTitleCard.jsx                 # landing card, direct navigation, theme toggle
      LensTransition.jsx                # transition from scene to scope
      ScopeView.jsx                     # circular section carousel
      ScrollMeter.jsx                   # phase controls, shown after scrolling begins
      LoadingScreen.jsx                 # Drei asset-loading overlay
      SectionPage.jsx                   # lazy-loaded accessible detail modal
      section-pages/                    # About, Projects, Skills, Contact layouts
public/
  models/microscope.glb
  images/1766444787358.jpeg
  images/jv-simple-white-icon.svg
  documents/Joao_Vedor_CV.pdf
```

## Runtime flow

1. `src/main.jsx` mounts `App`.
2. `App` creates the scroll container and passes it to `useScrollProgress`.
   The document body is intentionally non-scrollable; the inner app container
   owns vertical scrolling.
3. `useScopeProgress` translates hero scroll progress into navigation phases,
   `scopeProgress`, and the hero-card fade. `useScrollNavigation` maps UI
   actions back to container `scrollTop` using `requestAnimationFrame`.
4. `Scene` renders a demand-driven `<Canvas>` when WebGL is available; when it
   is not, it renders a static fallback gradient.
5. `ScrollCamera` interpolates through the configured start, mid, end, and
   scope-entry positions. `LensTransition` and `ScopeView` take over near the
   scope entry.
6. Scope cards are built from `ScopeViewSections.data.js`. Arrow buttons,
   keyboard navigation, the hero links, and the scroll meter all use the same
   phase/progress calculations.
7. Opening a card lazily loads `SectionPage`, which renders the layout named by
   `section.layout` (`about`, `projects`, `skills`, or `contact`). Escape and
   the Close button dismiss the modal.

## Source-of-truth rules

- Portfolio copy, assets, links, contact details, project entries, skills, and
  layout-specific data belong in `src/data/ScopeViewSections.data.js`.
- Add a new section by updating that data first, then adding a layout and a
  `SectionPage` switch case only when its presentation genuinely differs from
  `DefaultSectionPage`.
- Camera positions live only in `src/config/cameraPath.js`.
- Scroll, scope, fade, and modal constants live in `src/config/scopeTiming.js`.
  These values are consumed across hooks and components; do not duplicate them
  locally.
- Shared section page motion primitives belong in
  `section-pages/DetailPageElements.jsx` and their CSS in `src/index.css`.
- The active theme values are `warm` and `cold`. They are implemented by
  `ThemeTransition.jsx`, `Lights.jsx`, `MicroscopeChamber.jsx`, and
  `WaterfallPlane.jsx`.

## Interaction and performance constraints

- Preserve the custom scroll container. Do not change navigation to
  `window.scrollTo`; all scroll math depends on `scrollContainerRef`.
- `Scene` uses `frameloop="demand"` in production. Animated components must
  call Fiber's `invalidate()` while they need another frame. Do not switch to
  an always-running render loop without measuring the impact.
- Keep development camera controls behind `VITE_ENABLE_ORBIT=true`. In this
  mode, `CameraTuner` replaces `ScrollCamera` and pointer interactions are
  deliberately enabled for the Canvas.
- `ScrollCamera` logs current progress/camera/target on the `c` key for tuning.
- The scope carousel is memoized and quantizes its progress updates. Preserve
  the custom comparison unless profiling demonstrates a regression-free reason
  to change it.
- Keep the WebGL fallback in `Scene.jsx`; it is the functional non-WebGL path.
- Preserve keyboard behavior: arrows/space advance phases outside interactive
  elements, Escape closes an open detail dialog, and the scroll meter exposes
  slider keyboard controls on desktop.
- Preserve `prefers-reduced-motion` support in `src/index.css` and visible
  focus styles on interactive controls.

## Sensitive tuning points

Do not casually alter these without manually exercising desktop and mobile
navigation from start through every scope section:

- `src/config/cameraPath.js`
- `src/config/scopeTiming.js`
- camera movement bands in `src/components/scene/ScrollCamera.jsx`
- scope-card transition calculations in `src/components/ui/ScopeView.jsx`
- `LensTransition.jsx` thresholds/opacity behavior
- `SectionPage` transition timing and its matching `App` close timeout
- the `scrollContainerRef` flow in the three scroll hooks

Changing one threshold often changes perceived timing elsewhere. Update the
shared config and verify direct navigation, meter scrubbing, arrow-key movement,
scope arrows, and modal open/close behavior together.

## Assets and external links

- The microscope is loaded at runtime from `/models/microscope.glb`; do not
  rename or replace it without checking its geometry/material assumptions in
  `MicroscopeModel.jsx`.
- Public asset paths in section data must start with `/` because Vite serves
  `public/` at the application root.
- Treat portfolio URLs, email addresses, CV paths, and public biographical copy
  as user-facing facts. Confirm them before changing them.
- Avoid committing generated `dist/`, dependency directories, or `.env*` files.
  The project ignores them. `VITE_ENABLE_ORBIT` is the only environment value
  currently read by source code.

## Known repository state

- `src/config/sceneThemes.js`, `SunBeam.jsx`, `WavePlane.jsx`, and
  `Environment.jsx` remain tracked but are not imported by the active
  `Scene.jsx` composition. Do not treat them as live rendering paths without
  wiring and verifying them.
- `SCENE_THEMES` uses legacy `day`/`night` names, while the active theme system
  uses `warm`/`cold`; they are separate systems.
- The latest recorded work changed the landing page to an SVG title cutout with
  high-contrast content panels and delays `ScrollMeter` until the user has
  begun scrolling. Keep that intent intact unless deliberately redesigning the
  landing experience.

## Safe change workflow

1. Read `App.jsx`, the relevant hook/config/data file, and the component being
   changed before editing.
2. Prefer a data or config change over hardcoding a new value in a component.
3. For interaction work, verify the whole path rather than one isolated state:
   initial hero, theme toggle, direct navigation, scrolling, scope arrows,
   keyboard navigation, scroll meter, modal open/close, and mobile layout.
4. Run `npm run build` and inspect the output for warnings/errors.
5. Do not invent backend, deployment, analytics, auth, CI, or test details;
   they are not present in this repository.