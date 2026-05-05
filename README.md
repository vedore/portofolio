# Microscope Portfolio

## Lens Transition Notes

In `src/components/ui/LensTransition.jsx`, the transition is driven by `progress`, which goes from `0` to `1`.

The pattern:

```js
clamp((progress - start) / duration)
```

means:

- before `start`: value is `0`
- over `duration`: value ramps from `0` to `1`
- after that: value stays at `1`

### Phase Controls

```js
const approach = clamp((progress - 0.9) / 0.06);
```

- Starts at `0.90`
- Ends at `0.96`
- Drives the early buildup into the lens

Used for:

- blur
- red glow
- part of the red scale

To change it:

- start earlier: lower `0.9`
- last longer: increase `0.06`

```js
const redEntry = clamp((progress - 0.94) / 0.04);
```

- Starts at `0.94`
- Ends at `0.98`
- Drives the red ocular-entry phase

To change it:

- start earlier: lower `0.94`
- last longer: increase `0.04`

```js
const scopeReveal = clamp((progress - 0.982) / 0.018);
```

- Starts at `0.982`
- Ends at `1.0`
- Drives the black microscope-scope handoff

To change it:

- start earlier: lower `0.982`
- reveal more slowly: increase `0.018`

```js
const overlayOpacity = clamp((progress - 0.9) / 0.1);
```

- Starts at `0.9`
- Reaches full opacity at `1.0`
- Controls the opacity of the whole lens overlay

To change it:

- make the full overlay appear earlier: lower `0.9`
- make the fade-in longer: increase `0.1`

### Visual Output Controls

```js
const blurAmount = approach * (isMobile ? 8 : 14);
```

- Mobile max blur: `8`
- Desktop max blur: `14`
- Grows with `approach`

To change it:

- stronger blur: increase values
- softer blur: decrease values

```js
const redGlowOpacity = 0.18 + approach * 0.3;
```

- Base red glow is already `0.18`
- At full approach it becomes `0.48`

To change it:

- stronger base glow: increase `0.18`
- stronger ramp-up: increase `0.3`

```js
const redFillOpacity = redEntry * (1 - scopeReveal * 0.55);
```

- `redEntry` makes the red fill appear
- `scopeReveal` reduces it as the black scope takes over

When `scopeReveal = 1`, the multiplier becomes `0.45`, so the red still remains partially visible.

To change it:

- fade red more aggressively during scope reveal: increase `0.55`
- keep red visible longer: decrease `0.55`

```js
const redCoreScale = 0.7 + approach * 0.4 + redEntry * 1.6;
```

- Base scale: `0.7`
- `approach` can add `0.4`
- `redEntry` can add `1.6`

At full values, total scale is:

```js
0.7 + 0.4 + 1.6 = 2.7
```

To change it:

- larger initial red core: increase `0.7`
- stronger early swelling: increase `0.4`
- stronger red-entry swell: increase `1.6`

```js
const blackIrisScale = 0.45 + scopeReveal * (isMobile ? 4.4 : 6.2);
```

- Base black iris scale: `0.45`
- Full reveal scale on mobile: `4.85`
- Full reveal scale on desktop: `6.65`

To change it:

- stronger takeover: increase `4.4` / `6.2`
- softer takeover: decrease them

```js
const blackIrisOpacity = scopeReveal;
```

- Black iris opacity matches the reveal phase directly

To change it:

- faster opacity buildup: use something like `clamp(scopeReveal * 1.4)`
- softer opacity: use something like `scopeReveal * 0.8`

### Mental Model

- `approach` = getting close to the lens
- `redEntry` = passing through the red ocular glass
- `scopeReveal` = arriving in the black microscope scope view

And:

- `blurAmount` = softness behind the lens
- `redGlowOpacity` = red atmospheric glow
- `redFillOpacity` = red lens body visibility
- `redCoreScale` = red lens expansion
- `blackIrisScale` = black scope takeover size
- `blackIrisOpacity` = black scope visibility

### Example Tweaks

Red phase earlier and longer:

```js
const redEntry = clamp((progress - 0.92) / 0.06);
```

Black scope earlier:

```js
const scopeReveal = clamp((progress - 0.96) / 0.04);
```

Stronger red swelling:

```js
const redCoreScale = 0.7 + approach * 0.5 + redEntry * 2.2;
```

Less blur:

```js
const blurAmount = approach * (isMobile ? 5 : 9);
```
