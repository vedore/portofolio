# Microscope Portfolio

Scroll-driven portfolio built with React, Vite, Tailwind CSS, and React Three Fiber. The experience starts in a 3D microscope scene, moves the camera toward the lens as the user scrolls, then transitions into a circular scope-style content view with detail pages for each section.

## Main Features

- 3D microscope scene rendered with Three.js through React Three Fiber
- Scroll-driven camera choreography defined in a dedicated config file
- Lens-entry overlay transition that blends the scene into the portfolio UI
- Scope-style section carousel driven by static content data
- Full-screen loading overlay tied to asset loading progress
- Development-only orbit/camera tuning mode controlled by an environment variable
- WebGL fallback background when the browser cannot create a WebGL context

## Tech Stack

- React 19
- Vite 7
- Tailwind CSS 3
- Three.js
- `@react-three/fiber`
- `@react-three/drei`

## Project Structure

```text
.
├── public/
│   ├── images/
│   └── models/
│       └── microscope.glb
├── src/
│   ├── components/
│   │   ├── scene/
│   │   │   ├── CameraTuner.jsx
│   │   │   ├── Environment.jsx
│   │   │   ├── Lights.jsx
│   │   │   ├── MicroscopeModel.jsx
│   │   │   ├── Scene.jsx
│   │   │   └── ScrollCamera.jsx
│   │   └── ui/
│   │       ├── section-pages/
│   │       ├── LensTransition.jsx
│   │       ├── LoadingScreen.jsx
│   │       ├── ScopeView.jsx
│   │       └── SectionPage.jsx
│   ├── config/
│   │   └── cameraPath.js
│   ├── data/
│   │   └── ScopeViewSections.data.js
│   ├── hooks/
│   │   └── useScrollProgress.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── docs/
│   └── docs.txt
├── AGENT.md
├── README.md
└── .env.local
```

## How the App Is Organized

### App Shell

- `src/main.jsx` mounts the React app.
- `src/App.jsx` coordinates the page-level experience:
  - scroll state from `useScrollProgress`
  - 3D background scene
  - lens overlay
  - scope view
  - section detail overlay
  - loading screen

### 3D Scene

- `src/components/scene/Scene.jsx` owns the fixed full-screen `<Canvas>`, WebGL capability detection, and conditional rendering of the 3D scene.
- `src/components/scene/MicroscopeModel.jsx` loads `public/models/microscope.glb` via `useGLTF`, tweaks material properties, and renders a circular floor spot under the microscope.
- `src/components/scene/ScrollCamera.jsx` interpolates camera positions across several progress bands.
- `src/components/scene/Lights.jsx` defines the scene lighting.
- `src/components/scene/Environment.jsx` currently provides contact shadows only on non-mobile screens.
- `src/components/scene/CameraTuner.jsx` is a development helper that enables orbit controls and prints camera/target coordinates to the console.

### UI Layer

- `src/components/ui/LensTransition.jsx` creates the red-to-black lens-entry overlay with blur and radial gradients.
- `src/components/ui/ScopeView.jsx` renders the circular microscope view and transitions between section cards.
- `src/components/ui/SectionPage.jsx` opens a full-screen detail page for a selected section.
- `src/components/ui/LoadingScreen.jsx` displays a themed loading overlay using `useProgress` from Drei.
- `src/components/ui/section-pages/AboutPage.jsx` is the only custom section-page layout currently wired in.
- `src/components/ui/section-pages/DefaultSectionPage.jsx` renders generic detail blocks for the remaining sections.

### Data and Config

- `src/data/ScopeViewSections.data.js` is the main content source for scope cards and detail pages.
- `src/config/cameraPath.js` centralizes desktop/mobile camera coordinates.
- `src/hooks/useScrollProgress.js` converts window scroll into normalized animation progress and a mobile flag.

## Prerequisites

- Node.js installed locally
- npm available locally

The repository includes `package-lock.json`, so the documented package manager is npm.

## Installation

```bash
npm install
```

## Environment Setup

The repository currently references one Vite environment variable:

- `VITE_ENABLE_ORBIT`
  - `true`: enables development orbit controls and camera tuning helpers
  - `false`: uses the scroll-driven production camera path

Example local setup:

```bash
cp .env.local .env.local.backup
```

Current `.env.local` value in the repository:

```env
VITE_ENABLE_ORBIT=false
```

No other environment variables were found in the source tree.

## Local Development Commands

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates a production build in `dist/`.

```bash
npm run preview
```

Serves the built app locally for verification.

## Important Scripts

The current `package.json` defines only three scripts:

- `npm run dev`: start Vite in development mode
- `npm run build`: build the production bundle
- `npm run preview`: preview the production build

No dedicated `test`, `lint`, `typecheck`, or `format` scripts are present right now.

## Basic Usage Flow

1. Open the app.
2. The loading overlay remains visible until 3D assets finish loading and a minimum display time elapses.
3. The initial hero section appears over the microscope scene.
4. Scrolling updates normalized progress values.
5. The scene camera advances toward the microscope lens.
6. Near the end of the hero scroll, the lens transition overlay takes over.
7. The scope view appears and cycles through the configured sections.
8. Clicking a section title opens its full-screen detail page.

## Styling Notes

- Tailwind utility classes are the primary styling method.
- `src/index.css` contains global gradients, loader effects, and animation keyframes that are not practical as inline utility classes alone.
- The Tailwind theme extends a small `lab` color palette and a custom `lens` box shadow.
- The design language is currently light, laboratory-themed, and highly gradient-driven.

## Troubleshooting

### WebGL scene does not appear

- `Scene.jsx` falls back to a static gradient background if WebGL context creation fails.
- Confirm the browser/device supports WebGL and that graphics acceleration is enabled.

### Camera tuning is needed

- Set `VITE_ENABLE_ORBIT=true`.
- Run the app and use the helper controls from `CameraTuner.jsx`.
- The scene also logs camera/target coordinates to the console when the tuner is active.

### Section content looks incomplete

- Most section text is placeholder/demo portfolio copy stored in `src/data/ScopeViewSections.data.js`.
- `AboutPage.jsx` uses fallback values for name, role, photo, and highlights if they are missing from the section data.

### Anchor link in About page does not jump anywhere

- `AboutPage.jsx` links to `#projects`, but the current app structure does not render a matching DOM anchor target.
- This likely needs follow-up if in-page navigation is intended.

## Build and Deployment Notes

- A production build completed successfully with `npm run build` during repository inspection.
- `dist/` is present in the repository. Whether built assets should remain committed is a workflow decision and is not documented elsewhere in the repo.
- No deployment configuration files were found for Vercel, Netlify, Docker, or similar platforms.

## Notes for Contributors

- Keep documentation aligned with the current implementation, not earlier concept notes.
- Treat `src/config/cameraPath.js`, `src/components/scene/ScrollCamera.jsx`, and `src/components/ui/LensTransition.jsx` as the core interaction layer.
- Update `src/data/ScopeViewSections.data.js` before hardcoding content in components.
- Avoid adding undocumented environment variables or build steps without also documenting them.

## Known Gaps and Unclear Areas

- `src/components/ui/section-pages/ContactPage.jsx` exists but is empty and unused.
- `src/components/ui/section-pages/ProjectsPage.tsx` exists but is empty and unused.
- `src/components/ui/section-pages/SkillsPage.tsx` exists but is empty and unused.
- `AGENT.md` appears to be an older project brief rather than live documentation.
- `docs/docs.txt` contains concept notes for a different lab/computer idea and does not describe the current microscope implementation.
- No backend, worker, authentication, database, API, or routing layer was found in the repository.
