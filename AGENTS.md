# AGENTS.md

## Project Overview

This repository contains a frontend-only portfolio experience built around a
scroll-driven 3D microscope scene. The user starts in a sticky hero section
over a fixed WebGL background, scrolls toward the microscope lens, then enters
the circular `ScopeView` interface. From there, each specimen can open a
full-screen detail page.

No backend, API layer, authentication flow, database integration, worker, or
service worker was found in the repository.

## Tech Stack

- React 19
- Vite 7
- Tailwind CSS 3
- Three.js
- `@react-three/fiber`
- `@react-three/drei`
- Plain JavaScript `.jsx` / `.js`

## Repository Map

```text
src/
  App.jsx
  main.jsx
  index.css
  components/
    scene/
      Scene.jsx
      MicroscopeModel.jsx
      ScrollCamera.jsx
      Lights.jsx
      Environment.jsx
      CameraTuner.jsx
    ui/
      LensTransition.jsx
      ScopeView.jsx
      SectionPage.jsx
      LoadingScreen.jsx
      section-pages/
        AboutPage.jsx
        ProjectsPage.jsx
        SkillsPage.jsx
        ContactPage.jsx
        DefaultSectionPage.jsx
  config/
    cameraPath.js
  data/
    ScopeViewSections.data.js
  hooks/
    useScrollProgress.js

public/
  models/microscope.glb
  images/1766444787358.jpeg
  documents/XMR4EL.pdf

docs/
  docs.txt
```

## Runtime Flow

1. `src/main.jsx` mounts `App`.
2. `src/App.jsx` derives `progress`, `heroProgress`, and `isMobile` from
   `useScrollProgress`.
3. `Scene.jsx` renders the fixed `<Canvas>` when WebGL is available, and fades
   it out as scope mode takes over.
4. `ScrollCamera.jsx` moves the camera through staged progress bands using
   positions from `src/config/cameraPath.js`.
5. `LensTransition.jsx` overlays the red-to-black lens entry effect near the
   end of the scroll sequence.
6. `ScopeView.jsx` renders the circular microscope UI and determines which
   specimen card is current or incoming based on `scopeProgress`.
7. The previous/next buttons in `ScopeView.jsx` call
   `App.jsx -> navigateToSpecimen()`, which uses `window.scrollTo({ behavior:
   'smooth' })` to move the page to the correct scroll position.
8. Clicking a specimen title opens `SectionPage.jsx`.
9. `SectionPage.jsx` routes by `section.layout` to `AboutPage`,
   `ProjectsPage`, `SkillsPage`, `ContactPage`, or `DefaultSectionPage`.

## Important Conventions

- Keep camera coordinates in `src/config/cameraPath.js`.
- Keep scope/detail content in `src/data/ScopeViewSections.data.js`.
- Treat `ScopeView.jsx`, `LensTransition.jsx`, and `ScrollCamera.jsx` as the
  core interaction layer. Small threshold changes here can noticeably change
  the feel of the site.
- The microscope model is loaded from `/models/microscope.glb` with Drei
  `useGLTF`.
- Mobile behavior is derived from `window.innerWidth < 768` inside
  `useScrollProgress.js`.
- Dev camera controls are guarded by `VITE_ENABLE_ORBIT`.
- The app intentionally has a non-WebGL fallback in `Scene.jsx`.

## Current Tuning Points

- `src/App.jsx`
  - `HERO_SCROLL_HEIGHT`
  - `HERO_SCOPE_START`
  - `HERO_SCOPE_END`
  - `SECTION_PAGE_TRANSITION_MS`
- `src/components/scene/ScrollCamera.jsx`
  - `START_HOLD_END`
  - `MID_MOVE_END`
  - `MID_HOLD_END`
  - `END_MOVE_END`
  - `END_HOLD_END`
- `src/components/ui/LensTransition.jsx`
  - `approach`
  - `redEntry`
  - `scopeReveal`
  - `overlayOpacity`
- `src/components/ui/ScopeView.jsx`
  - `SECTION_HOLD_START`
  - `SECTION_HOLD_END`
  - `NEXT_FADE_DELAY`

## How To Run

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build production output:

```bash
npm run build
```

Preview the build:

```bash
npm run preview
```

## Scripts Present

- `dev`
- `build`
- `preview`

No `test`, `lint`, `typecheck`, or formatter script is currently defined in
`package.json`.

## Environment Variables

Environment variables referenced in source:

- `VITE_ENABLE_ORBIT`
  - `true`: enable `CameraTuner` / orbit-style development mode
  - `false`: use the normal scroll-driven camera

No other Vite env references were found during inspection.

## Frontend 

### Frontend

All active logic is frontend code:

- app state orchestration in `src/App.jsx`
- scroll normalization in `src/hooks/useScrollProgress.js`
- 3D scene code in `src/components/scene/*`
- overlay and detail UI in `src/components/ui/*`
- content data in `src/data/*`

## Styling Conventions

- Tailwind utilities are the main styling mechanism.
- `src/index.css` holds global visual effects and keyframes that are not kept
  inline.
- The UI language is soft, rounded, and gradient-heavy.
- Section page layouts are data-backed; avoid hardcoding content into components
  when it belongs in `ScopeViewSections.data.js`.

## Safe Workflow For Changes

1. Inspect `package.json`, `src/App.jsx`, `src/config/cameraPath.js`, and the
   specific scene/UI component before editing.
2. Prefer data/config changes before structural component changes.
3. If you change perceived animation timing for scope navigation, check both:
   `ScopeView.jsx` thresholds and `App.jsx -> navigateToSpecimen()`.
4. Keep dev-only helpers behind `VITE_ENABLE_ORBIT`.
5. Run `npm run build` after code changes because there is no automated lint or
   test safety net.
6. Do not invent backend, auth, deployment, or CI details that are not present
   in the repository.

## Debugging Notes

- To tune camera positions, set `VITE_ENABLE_ORBIT=true` and use
  `CameraTuner.jsx`.
- `ScrollCamera.jsx` logs progress/camera/target when `c` is pressed.
- If the WebGL scene disappears too early, inspect `scopeFade` in `Scene.jsx`.
- If scope cards feel too fast or too slow during manual scrolling, inspect
  `SECTION_HOLD_START`, `SECTION_HOLD_END`, and `NEXT_FADE_DELAY` in
  `ScopeView.jsx`.
- If next/previous button navigation feels too fast, inspect
  `navigateToSpecimen()` in `src/App.jsx`. The buttons trigger a smooth scroll,
  so the perceived timing comes from how far the page scrolls and from the
  browser's smooth-scroll behavior.
- If section pages close too abruptly, inspect `SECTION_PAGE_TRANSITION_MS` and
  the matching timeout in `src/App.jsx`.

## Things To Avoid Changing Without Permission

- `public/models/microscope.glb`
- camera coordinates in `src/config/cameraPath.js`
- transition thresholds in `ScrollCamera.jsx`, `LensTransition.jsx`, and
  `ScopeView.jsx`
- `SECTION_PAGE_TRANSITION_MS` in `src/App.jsx`
- WebGL fallback behavior in `Scene.jsx`

These values directly shape the core experience and are easy to destabilize.