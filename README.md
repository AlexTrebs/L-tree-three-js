# L-tree-three-js

Procedural 3D tree generator using L-systems and Three.js.

Generates tree structures by expanding a simple axiom through rewrite rules, then interprets the result with a 3D turtle using quaternion orientation. Trees are rendered as tapered cylinders with sphere leaves and grow in animated, one branch at a time.

## Setup

Requires [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/).

```
pnpm install
pnpm dev
```

## How it works

1. **L-system expansion** - Rewrites the axiom `F` using the rule `F[+F][&F][-F]` over multiple iterations to produce a string encoding the tree structure.
2. **Turtle interpretation** - Walks the string character by character, maintaining position and orientation as a quaternion. `F` draws a branch, `+`/`-` yaw, `&` pitches, `[`/`]` push/pop state with a random roll for 3D distribution.
3. **Rendering** - Branches are queued and added to the scene one per frame, so the tree visibly grows from trunk to tips.

## Controls

A GUI panel exposes all parameters. Click "regenerate" to rebuild the tree.

| Parameter | Description |
|---|---|
| iterations | Number of L-system expansion passes (high values = slow) |
| angle | Base branching angle in degrees |
| branchLength | Length of the trunk segment |
| lengthDecay | Length multiplier per depth level |
| branchRadius | Radius of the trunk |
| radiusDecay | Radius multiplier per depth level |
| barkColor | Branch colour |
| leafColor | Leaf colour |
| randomness | Angle jitter (0 = uniform, 1 = chaotic) |
| leafStartDepth | Depth at which leaves appear |
| verticalSpread | Vertical spread angle |
| windStrength | How much wind pushes branches (scales with depth) |
| windDirection | Compass direction of wind in degrees |

## Project structure

```
src/
  main.js           - Scene setup, rendering, GUI, grow animation
  TreeGenerator.js   - L-system expansion and turtle interpreter
  utils.js           - Quaternion helpers (getHeading, rotateLocal, jitteredAngle)
  params.js          - Default parameter values
```

## Dependencies

- [three](https://threejs.org/) - 3D rendering
- [lil-gui](https://lil-gui.georgealways.com/) - Parameter UI
- [vite](https://vitejs.dev/) - Dev server and bundling
