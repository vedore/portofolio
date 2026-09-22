// Surface names come from public/models/microscope.glb. Keep optical colors:
// the red lens is also the visual anchor for the existing scope transition.
export const MICROSCOPE_SURFACES = [
  { prefix: 'Rough metal', color: '#c4cdd2', metalness: 0.92, roughness: 0.24, envMapIntensity: 1.1 },
  { prefix: 'metal paint generated', color: '#e4eae7', metalness: 0.22, roughness: 0.32 },
  { prefix: 'Matt plastic', color: '#202d33', metalness: 0.02, roughness: 0.64 },
  { prefix: 'Rubber', color: '#141d23', metalness: 0, roughness: 0.88 },
  { prefix: 'gloss plasti', color: '#152329', metalness: 0.04, roughness: 0.25 },
  { prefix: 'Multicoated glass', color: '#940f38', metalness: 0.45, roughness: 0.08, envMapIntensity: 1.3 },
  { prefix: 'blue metal paint', color: '#3176b8', metalness: 0.45, roughness: 0.3 },
  { prefix: 'yellow metal paint', color: '#d5ad42', metalness: 0.45, roughness: 0.3 },
  { prefix: 'red metal paint', color: '#b84743', metalness: 0.45, roughness: 0.3 },
];

export const LAB = {
  // The GLB's rubber feet end at MODEL_POSITION.y. Seat the bench here
  // instead of moving the microscope and invalidating the lens camera path.
  benchTop: -1.45,
  benchThickness: 0.18,
  floor: -4.9,
  width: 12.6,
  depth: 6.9,
};
