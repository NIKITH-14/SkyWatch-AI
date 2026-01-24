# SkyWatch AI — Educational Simulation (Fictional Assets)

SkyWatch AI is a web-based sci‑fi command center simulator for visualizing fictional systems, placing sensors, and animating abstract vehicle motion across a map and a 3D scene.

Important: This is an educational visualization with synthetic data only. No real-world targeting, weapon data, or operational controls.

## Features
- Dark command-center UI: top status bar, left sidebar, clean central map.
- Interactive map (Leaflet): place fictional sensors, coverage circles, trajectories, region overlays.
- 3D scene (Three.js): cylinder-based vehicle model with WASD/arrow controls, smooth movement, conceptual abort path.
- Simulation controls: start/stop/abort, playback speed.
- Diagnostics console and telemetry stats.

## Tech Stack
- Frontend: HTML, CSS (custom neon theme), JavaScript modules.
- Map: Leaflet CDN (CartoDB dark tiles).
- 3D: Three.js CDN.
- No backend required; static deployment.

## Quick Start (Local)
1. Open `web/index.html` in a modern browser, or serve the `web/` folder via a static server.
2. Use the sidebar:
   - Place Equipment: click "Enable Placement" then click the map to drop sensors and coverage zones.
   - Create Vehicle: choose a fictional name (SkyArrow, Falcon‑X, Horizon‑1, Sentinel Drone), set parameters, then Create.
   - Simulate: Start to animate; use **W/A/S/D** or **Arrow keys** to move the vehicle in 3D. Stop/Abort as needed.
3. Watch telemetry and logs update in real time.

## Deployment
- Host the `web/` folder on any static hosting.
- Ensure CDN access is allowed.

## Safety
- Fictional assets only; no real weapon names or targeting.
- Banner disclaimer embedded in the UI.

## Files
- `web/index.html`: Main UI structure.
- `web/style.css`: Neon sci‑fi theme.
- `web/main.js`: Global state, UI wiring, logs.
- `web/map.js`: Map initialization, equipment placement, trajectories.
- `web/threeScene.js`: 3D vehicle, controls, simulation ticks.
