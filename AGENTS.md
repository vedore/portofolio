# AGENTS.md

## Project Overview

This repository contains a client-side portfolio experience built around a scroll-driven 3D microscope scene. The user starts in a hero section layered over a fixed WebGL background, scrolls toward the microscope lens, then transitions into a circular scope-style content browser. Clicking a section opens a full-screen detail overlay.

The current codebase is frontend-only. No backend services, workers, APIs, authentication system, or database integration were found during repository inspection.

## Tech Stack

- React 19
- Vite 7
- Tailwind CSS 3
- Three.js
- `@react-three/fiber`
- `@react-three/drei`
- Plain JavaScript for most source files
- A few `.tsx` files exist, but they are currently empty placeholders

## Repository Map

```text
src/
  App.jsx                         # page composition and state orchestration
  main.jsx                        # React entry point
  index.css                       # global CSS, gradients, loader effects, keyframes
  components/
    scene/
      Scene.jsx                   # fixed Canvas wrapper, WebGL detection, render gating
      MicroscopeModel.jsx         # GLB loading and model/material tuning
      ScrollCamera.jsx            # scroll-driven camera interpolation
      Lights.jsx                  # scene lights
      Environment.jsx             # non-mobile contact shadows
      CameraTuner.jsx             # orbit-control dev helper
    ui/
      LensTransition.jsx          # lens-entry overlay effect
      ScopeView.jsx               # circular scope interface and section transitions
      SectionPage.jsx             # full-screen detail overlay
      LoadingScreen.jsx           # asset-loading overlay
      section-pages/
        AboutPage.jsx             # custom "about" detail layout
        DefaultSectionPage.jsx    # default detail layout
        ContactPage.jsx           # empty, unused
        ProjectsPage.tsx          # empty, unused
        SkillsPage.tsx            # empty, unused
  config/
    cameraPath.js                 # desktop/mobile camera coordinates
  data/
    ScopeViewSections.data.js     # section metadata and content
  hooks/
    useScrollProgress.js          # normalized scroll progress + mobile detection

public/
  models/microscope.glb           # microscope model used by the scene
  images/1766444787358.jpeg       # default profile image fallback in AboutPage

docs/
  docs.txt                        # concept notes, not current implementation docs
```

## Frontend / Backend / Worker Organization

### Frontend

All active application logic is in the frontend:

- app shell and scroll state in `src/App.jsx`
- WebGL scene in `src/components/scene/*`
- overlay and content UI in `src/components/ui/*`
- static content in `src/data/*`
- animation tuning constants in `src/config/*`

### Backend

Not yet documented because no backend code was found.

### Workers

Not yet documented because no worker or service-worker files were found.

## Current Runtime Flow

1. `main.jsx` mounts `App`.
2. `App.jsx` reads normalized scroll state from `useScrollProgress`.
3. `Scene.jsx` renders a fixed `<Canvas>` if WebGL is available and the scope transition has not progressed too far.
4. `ScrollCamera.jsx` updates the camera position across several progress bands using config from `cameraPath.js`.
5. `LensTransition.jsx` overlays the screen near the end of the hero scroll.
6. `ScopeView.jsx` takes over visually and cycles through section cards based on `scopeProgress`.
7. Clicking a section title opens `SectionPage.jsx`.
8. `SectionPage.jsx` uses `AboutPage` for `layout: "about"` and `DefaultSectionPage` for everything else.

## Important Conventions

- Camera positions are centralized in `src/config/cameraPath.js`. Do not hardcode camera coordinates into `App.jsx`.
- Section content is data-driven from `src/data/ScopeViewSections.data.js`.
- Styling is primarily Tailwind utilities, with global effects and keyframes in `src/index.css`.
- The repo uses Vite env access through `import.meta.env`, not `process.env`.
- The 3D microscope model is loaded from `/models/microscope.glb` using Drei `useGLTF`.
- Mobile behavior is derived from `window.innerWidth < 768` inside `useScrollProgress`.
- The app intentionally supports a non-WebGL fallback background in `Scene.jsx`.
- Section overlay open/close timing is coordinated with `SECTION_PAGE_TRANSITION_MS` in `App.jsx`.

## How To Run Locally

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
```

Preview production bundle:

```bash
npm run preview
```

## Test / Build / Lint Status

Scripts currently present:

- `dev`
- `build`
- `preview`

No `test`, `lint`, `typecheck`, or formatting scripts were found. Do not claim those workflows exist unless they are added to the repository.

## Environment Variables

Environment variables found in the repository:

- `VITE_ENABLE_ORBIT`
  - Purpose: enable development orbit controls and camera tuning mode
  - Expected values seen in repo: `true` or `false`

No other environment variable references were found.

## Auth / Security Flow

No authentication flow, login flow, token handling, or protected backend/API interaction was found.

Relevant security-adjacent behavior that does exist:

- `App.jsx` temporarily sets `document.body.style.overflow = 'hidden'` while a section detail page is open.
- `App.jsx` sets `window.history.scrollRestoration = 'manual'` on mount and restores the previous value on cleanup.

Anything beyond that needs confirmation.

## Styling / Component Conventions

- Tailwind is the dominant styling mechanism.
- `index.css` contains the global visual language:
  - loader surfaces
  - scan effects
  - particle effects
  - lens vignette
  - page background gradients
- The UI relies heavily on rounded shapes, soft borders, and gradient overlays.
- `AboutPage.jsx` has hardcoded fallback content for `name`, `role`, `photo`, and `highlights` when the data file does not provide them.
- The current section-page system is partly prepared for specialized layouts, but only the `about` layout is wired.

## Things To Avoid Changing Without Permission

- `public/models/microscope.glb` and camera tuning values in `src/config/cameraPath.js`
- The progress thresholds in:
  - `src/components/scene/ScrollCamera.jsx`
  - `src/components/ui/LensTransition.jsx`
  - `src/components/ui/ScopeView.jsx`
- `SECTION_PAGE_TRANSITION_MS` and related open/close timing in `src/App.jsx`
- The WebGL fallback behavior in `src/components/scene/Scene.jsx`
- Existing build output handling in `dist/`
  - `dist/` is committed right now, but repo policy for generated assets is not documented

These areas directly shape the core interaction and are easy to destabilize with small edits.

## Safe Workflow For Making Changes

1. Inspect `package.json`, `App.jsx`, `cameraPath.js`, and the relevant scene/UI component before editing.
2. Prefer adjusting data/config first:
   - section text in `ScopeViewSections.data.js`
   - camera coordinates in `cameraPath.js`
3. If changing motion, verify how `progress`, `heroProgress`, and `scopeProgress` are derived before altering thresholds.
4. Keep dev-only helpers behind `VITE_ENABLE_ORBIT`.
5. Run `npm run build` after changes because there is no automated lint/test safety net.
6. Do not invent backend/auth/deployment details in code or docs unless the repo actually adds them.

## Common Debugging Notes

- To tune camera positions, set `VITE_ENABLE_ORBIT=true` and use `CameraTuner.jsx`.
- `CameraTuner.jsx` logs positions/targets on key presses:
  - `c` prints current camera and target
  - `1`, `2`, `3` print labeled captures
- `ScrollCamera.jsx` also listens for `c` and logs progress/camera/target during normal scroll mode.
- If the scene disappears too early, inspect `shouldRenderCanvas` and `scopeFade` in `Scene.jsx`.
- If the scope UI never appears correctly, inspect `scopeProgress` derivation in `App.jsx`.
- If section pages close or unmount abruptly, inspect `SECTION_PAGE_TRANSITION_MS` and the close timer in `App.jsx`.
- If About content looks wrong, check whether `AboutPage.jsx` is showing its fallback values instead of data from `ScopeViewSections.data.js`.
- If navigation is expected from the About page CTA, note that `href="#projects"` currently has no matching rendered anchor target.

## Missing Documentation / TODOs Found During Inspection

- `AGENT.md` is an older scaffold brief, not a current maintenance guide.
- `docs/docs.txt` appears to describe an earlier or alternate concept and does not match the current microscope implementation.
- `src/components/ui/section-pages/ContactPage.jsx` is empty and unused.
- `src/components/ui/section-pages/ProjectsPage.tsx` is empty and unused.
- `src/components/ui/section-pages/SkillsPage.tsx` is empty and unused.
- `SectionPage.jsx` does not route any sections to `ContactPage`, `ProjectsPage`, or `SkillsPage`.
- There is no documented deployment target.
- There is no documented content-editing workflow beyond direct source edits.
- There is a `.DS_Store` file inside `src/`, which should usually not be versioned.

## Documentation Integrity Rules For Future Agents

- Document only what is visible in the repository.
- If a feature is absent or ambiguous, write `Not yet documented` or `Needs confirmation`.
- Do not claim there is a backend, database, auth system, testing setup, or deployment pipeline unless code/config for it exists.
- Preserve useful existing docs where possible, but replace outdated conceptual notes when writing primary developer documentation.
