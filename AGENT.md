I want to build the structure for a scroll-driven 3D portfolio website.

Tech stack:
- React
- Vite
- Tailwind CSS
- Three.js using React Three Fiber
- Drei
- GSAP ScrollTrigger or a clean custom scroll-progress hook

Important:
I already have microscope models made in Blender. The agent does NOT need to create or model a microscope. The website should load my existing `.glb` or `.gltf` microscope model from the public/models folder.

Main concept:
The landing view shows a 3D microscope in a clean white/blue laboratory-style scene. As the user scrolls, the camera moves toward the microscope lens. When the camera reaches the lens, the page transitions into portfolio content sections.

The agent should focus only on the technical structure, not final visual design.

Core requirements:

1. Project setup
- Create a clean React + Vite + Tailwind project structure.
- Install and configure:
  - three
  - @react-three/fiber
  - @react-three/drei
  - gsap if needed
- Keep the code modular and easy to edit.

2. 3D model loading
- Load a microscope model from:
  public/models/microscope.glb
- Use Drei’s `useGLTF`.
- Add a clean component called `MicroscopeModel.jsx`.
- Make it easy to adjust:
  - model scale
  - model position
  - model rotation
  - material tweaks if needed
- Add comments showing where I can change the model path.

3. Scene structure
- Create a full-screen fixed Canvas behind the page.
- Add lighting suitable for a clean laboratory scene:
  - ambient light
  - directional light
  - optional area/point lights
- Add a simple floor or desk plane.
- Add camera controls only for development, but make them easy to disable for production.
- Add basic loading support with `Suspense`.

4. Scroll-driven camera animation
- Create a `ScrollCamera.jsx` component or hook.
- The camera should animate based on scroll progress.
- The camera path should have at least three stages:
  - Stage 1: camera starts in front of the microscope.
  - Stage 2: camera moves closer to the microscope lens.
  - Stage 3: camera appears to enter the lens.
- Make the camera positions easy to edit in one config object.
- Use smooth interpolation/lerp so the movement feels cinematic.
- Do not hardcode everything in one huge component.

5. Lens transition
- Create a `LensTransition.jsx` component.
- The transition should be a simple fake effect for now:
  - circular overlay
  - blur/fade
  - blue/black lens color
  - opacity controlled by scroll progress
- The effect should activate near the end of the camera move.
- It should create the illusion of entering the microscope lens.
- Keep it CSS/Tailwind-based first. Do not use complex shaders in the MVP.

6. Portfolio content structure
- After the lens transition, show normal HTML/Tailwind portfolio sections.
- Create `PortfolioSections.jsx`.
- Add placeholder sections:
  - Hero / Intro
  - About
  - Projects
  - Skills
  - Research
  - Contact
- Make the sections easy to rename and restyle.
- The design should support the idea that I may later turn projects into “slides” or “specimens,” but do not implement the final design yet.

7. File structure

src/
  main.jsx
  App.jsx
  index.css
  components/
    scene/
      Scene.jsx
      MicroscopeModel.jsx
      ScrollCamera.jsx
      Lights.jsx
      Environment.jsx
    ui/
      LensTransition.jsx
      PortfolioSections.jsx
      LoadingScreen.jsx
    hooks/
      useScrollProgress.js
    config/
      cameraPath.js

8. Performance
- Use reasonable defaults for performance.
- Limit device pixel ratio.
- Add mobile fallback behavior.
- On small screens, simplify camera movement and reduce heavy effects.
- Make it possible to disable shadows or lower quality easily.

9. Acceptance criteria
- The app runs without errors.
- The microscope model loads from public/models/microscope.glb.
- The 3D canvas fills the first part of the page.
- Scrolling moves the camera toward the microscope lens.
- A lens transition appears near the end of the scroll movement.
- Portfolio sections appear after the transition.
- The project is structured so I can replace assets, adjust camera points, and design the final content myself.

Assume my Blender model may not be perfectly centered, scaled, or rotated.

Please include clear variables for:
- MODEL_POSITION
- MODEL_ROTATION
- MODEL_SCALE
- LENS_TARGET_POSITION
- CAMERA_START_POSITION
- CAMERA_MID_POSITION
- CAMERA_END_POSITION

I want to tune these manually after seeing the model in the browser.

Do not:
- create a microscope from primitives;
- spend time on final copywriting;
- create overly complex shaders;
- hardcode the camera movement inside App.jsx;
- make the whole website depend on WebGL only;
- ignore mobile fallback;
- create a huge single-file component;
- use random placeholder libraries unless necessary.

Do not spend time creating the final artistic design. Focus on a clean, extensible technical foundation.