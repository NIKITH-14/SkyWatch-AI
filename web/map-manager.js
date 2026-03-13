// Map Manager - Handles Leaflet map and visualization
class MapManager {
  constructor(app) {
    this.app = app;
    this.map = null;
    this.markers = {};
    this.pathLines = {};
    this.currentMapStyle = 'normal';
    this.radarAnimation = null;
    this.gridOverlay = null;

    this.missileModeActive = true;

    // Earth imagery layer (for both 2D and 3D maps)
    this.currentEarthLayer = 'satellite';

    // Missile simulation state
    this.missile = {
      name: 'Agni-5',
      rangeKm: 8000,
      speedKms: 2.0, // dummy speed in km/s
      launchLatLng: null,
      targetLatLng: null,
      selectingLaunch: false,
      selectingTarget: false,
      rangeCircle: null,
      pathLine: null,
      missileMarker: null,
      animReq: null,
      startTime: null,
      totalDistanceKm: 0,
      estimatedTimeSec: 0
    };

    // Dual-map support properties
    this.mapType = 'leaflet'; // 'leaflet' or 'cesium'
    this.cesiumViewer = null;
    this.worldwindGlobe = null;

    // Routing support properties
    this.routingMode = false;
    this.routing = {
      enabled: false,
      startPoint: null,
      endPoint: null,
      polyline: null,
      startMarker: null,
      endMarker: null,
      isCalculating: false
    };
  }

  init() {
    // Hide HUD panels on dashboard
    const hudPanels = document.querySelector('.hud-panels');
    if (hudPanels) {
      hudPanels.style.display = 'none';
    }

    // Setup layer selector UI
    this.setupLayerSelector();

    // Initialize appropriate map based on mapType property
    if (this.mapType === 'cesium') {
      this.initCesium();
    } else {
      this.initLeaflet();
    }

    // Draw country borders
    this.drawCountryBorders();

    // Add radar animation and grid (Leaflet only)
    if (this.mapType === 'leaflet') {
      this.addRadarAnimation();
      this.addGridOverlay();

      // Add map event listeners for Leaflet
      this.map.on('click', (e) => {
        this.handleMapClick(e);
      });
    } else if (this.mapType === 'cesium') {
      // Cesium click handler is set up in initCesium()
    }
  }

  setupLayerSelector() {
    const layerSelectorBtn = document.getElementById('layerSelectorBtn');
    const layerMenu = document.getElementById('layerMenu');

    if (!layerSelectorBtn || !layerMenu) return;

    // Toggle menu on button click
    layerSelectorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      layerMenu.classList.toggle('hidden');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!layerSelectorBtn.contains(e.target) && !layerMenu.contains(e.target)) {
        layerMenu.classList.add('hidden');
      }
    });

    // Add layer selection handlers
    document.querySelectorAll('.layer-option').forEach(option => {
      option.addEventListener('click', () => {
        const layer = option.getAttribute('data-layer');
        this.changeEarthLayer(layer);
        layerMenu.classList.add('hidden');
      });
    });

    // Set initial active layer
    this.updateLayerSelector('satellite');
  }

  initLeaflet() {
    // Initialize Leaflet map - Centered on India
    this.map = L.map('map', {
      center: [20.5937, 78.9629], // India center
      zoom: 5,
      attributionControl: false,
      zoomControl: true,
      minZoom: 3,
      maxZoom: 16,
    });

    // Set default earth imagery layer (satellite)
    this.setMapStyle('satellite');
    this.updateLayerSelector('satellite');
  }

  setMapStyle(style) {
    this.currentMapStyle = style;
    this.currentEarthLayer = style;

    const tileUrls = {
      'normal': 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'satellite': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      'dark': 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      'roads': 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'hybrid': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    };

    // Remove existing tile layer
    this.map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        this.map.removeLayer(layer);
      }
    });

    L.tileLayer(tileUrls[style], {
      attribution: 'Map data © contributors',
      maxZoom: 19,
    }).addTo(this.map);

    // Update layer selector button
    this.updateLayerSelector(style);
  }

  changeMapStyle(style) {
    this.setMapStyle(style);
  }

  changeEarthLayer(layer) {
    this.currentEarthLayer = layer;
    if (this.mapType === 'leaflet') {
      this.setMapStyle(layer);
    } else {
      this.setWorldWindLayer(layer);
    }
    this.updateLayerSelector(layer);
  }

  setWorldWindLayer(layer) {
    if (!this.worldwindGlobe) return;

    try {
      // Remove all existing layers
      const layerCount = this.worldwindGlobe.layers.length;
      for (let i = layerCount - 1; i >= 0; i--) {
        this.worldwindGlobe.removeLayer(this.worldwindGlobe.layers[i]);
      }

      // Add selected layer
      if (layer === 'satellite') {
        this.worldwindGlobe.addLayer(new WorldWind.BingImageryLayer(WorldWind.BingImageryLayer.LAYER_NAMES.AERIAL));
        this.app.addAlert('Layer: Satellite', 'info');
      } else if (layer === 'roads') {
        this.worldwindGlobe.addLayer(new WorldWind.BingImageryLayer(WorldWind.BingImageryLayer.LAYER_NAMES.ROADS));
        this.app.addAlert('Layer: Roads', 'info');
      } else if (layer === 'hybrid') {
        this.worldwindGlobe.addLayer(new WorldWind.BingImageryLayer(WorldWind.BingImageryLayer.LAYER_NAMES.AERIAL));
        this.app.addAlert('Layer: Hybrid', 'info');
      } else if (layer === 'dark') {
        this.worldwindGlobe.addLayer(new WorldWind.BingImageryLayer(WorldWind.BingImageryLayer.LAYER_NAMES.AERIAL));
        this.app.addAlert('Layer: Dark Mode', 'info');
      } else if (layer === 'normal') {
        this.worldwindGlobe.addLayer(new WorldWind.BingImageryLayer(WorldWind.BingImageryLayer.LAYER_NAMES.ROADS));
        this.app.addAlert('Layer: Normal', 'info');
      }

      this.worldwindGlobe.redraw();
    } catch (error) {
      console.error('WorldWind layer switch error:', error);
    }
  }

  updateLayerSelector(activeLayer) {
    const layerOptions = document.querySelectorAll('.layer-option');
    layerOptions.forEach(option => {
      option.classList.remove('active');
      if (option.getAttribute('data-layer') === activeLayer) {
        option.classList.add('active');
      }
    });
  }

  createMarker(id, obj) {
    const marker = L.marker([obj.lat, obj.lng], {
      icon: L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-content" style="color: ${obj.color}; font-size: 28px;">${obj.icon}</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      }),
      title: obj.name,
    }).addTo(this.map);

    marker.bindPopup(`<strong>${obj.name}</strong><br/>Speed: ${obj.speed.toFixed(1)} m/s<br/>Direction: ${obj.direction.toFixed(0)}°`);

    this.markers[id] = marker;
  }

  createPathLine(id) {
    const pathLine = L.polyline([], {
      color: this.app.objects[id].color,
      weight: 2,
      opacity: 0.6,
      dashArray: '5, 5',
    }).addTo(this.map);

    this.pathLines[id] = pathLine;
  }

  updateMarkers() {
    Object.entries(this.app.objects).forEach(([id, obj]) => {
      const marker = this.markers[id];
      if (marker) {
        marker.setLatLng([obj.lat, obj.lng]);
        marker.setRotationAngle(obj.direction);
        marker.getPopup().setContent(`<strong>${obj.name}</strong><br/>Speed: ${obj.speed.toFixed(1)} m/s<br/>Direction: ${obj.direction.toFixed(0)}°<br/>Status: ${obj.status}`);
      }

      // Update path line
      if (obj.path.length > 0) {
        this.pathLines[id].setLatLngs(obj.path);
      }
    });
  }

  handleMapClick(e) {
    // Routing mode takes precedence
    if (this.routingMode && this.routing.enabled) {
      this.handleRoutingClick(e.latlng.lat, e.latlng.lng);
      return;
    }

    if (!this.missileModeActive) return;
    // Missile selection modes take precedence
    if (this.missile.selectingLaunch) {
      this.missile.launchLatLng = e.latlng;
      this.missile.selectingLaunch = false;
      this.drawMissileRange();
      this.addMissileMarker('launch');
      this.app.addAlert(`Launch point set at ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`, 'success');
      return;
    }
    if (this.missile.selectingTarget) {
      this.missile.targetLatLng = e.latlng;
      this.missile.selectingTarget = false;
      this.drawMissilePath();
      this.addMissileMarker('target');
      this.app.addAlert(`Target point set at ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`, 'warning');
      return;
    }
  }

  setMissileType(name, rangeKm, speedKms) {
    this.missile.name = name;
    this.missile.rangeKm = rangeKm;
    this.missile.speedKms = speedKms || 2.0; // Use provided speed or default
    this.updateMissileInfoHUD(false);
    this.drawMissileRange();
  }

  setMissileMode(active) {
    this.missileModeActive = active;
    if (!active) {
      this.resetMissileSimulation();
    }
  }

  enableLaunchSelection() {
    this.missile.selectingLaunch = true;
    this.missile.selectingTarget = false;
  }

  enableTargetSelection() {
    this.missile.selectingTarget = true;
    this.missile.selectingLaunch = false;
  }

  drawMissileRange() {
    if (!this.missile.launchLatLng) return;
    if (this.missile.rangeCircle) this.map.removeLayer(this.missile.rangeCircle);
    // Leaflet circle radius expects meters
    const radiusMeters = this.missile.rangeKm * 1000;
    this.missile.rangeCircle = L.circle(this.missile.launchLatLng, {
      radius: radiusMeters,
      color: '#1ecc71',
      weight: 1.5,
      opacity: 0.6,
      fillColor: '#1ecc71',
      fillOpacity: 0.08,
    }).addTo(this.map);
    const el = this.missile.rangeCircle.getElement();
    if (el) el.classList.add('missile-range-circle');
  }

  drawMissilePath() {
    if (!this.missile.launchLatLng || !this.missile.targetLatLng) return;
    if (this.missile.pathLine) this.map.removeLayer(this.missile.pathLine);
    const latlngs = [this.missile.launchLatLng, this.missile.targetLatLng];
    this.missile.pathLine = L.polyline(latlngs, {
      color: '#00d4ff',
      weight: 2,
      opacity: 0.9,
      dashArray: '6,4'
    }).addTo(this.map);
    const el = this.missile.pathLine.getElement();
    if (el) el.classList.add('missile-path-line');
    // compute distance
    this.missile.totalDistanceKm = this.haversineKm(latlngs[0], latlngs[1]);
    this.missile.estimatedTimeSec = Math.round(this.missile.totalDistanceKm / this.missile.speedKms);
    this.updateMissileInfoHUD();
  }

  addMissileMarker(which) {
    const iconHtml = which === 'launch' ? '🚀' : '🎯';
    const latlng = which === 'launch' ? this.missile.launchLatLng : this.missile.targetLatLng;
    if (!latlng) return;
    const marker = L.marker(latlng, {
      icon: L.divIcon({
        className: 'missile-marker',
        html: `<div style="font-size:20px;">${iconHtml}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      }),
      interactive: false
    }).addTo(this.map);
    if (which === 'launch') this.missile.launchMarker = marker; else this.missile.targetMarker = marker;
  }

  startMissileSimulation() {
    if (!this.missile.launchLatLng || !this.missile.targetLatLng) return;
    // create missile moving marker
    if (this.missile.missileMarker) this.map.removeLayer(this.missile.missileMarker);
    this.missile.missileMarker = L.marker(this.missile.launchLatLng, {
      icon: L.divIcon({
        className: 'missile-moving',
        html: `<div style="font-size:18px;">🛰️</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      })
    }).addTo(this.map);
    this.missile.startTime = Date.now();
    this.updateMissileInfoHUD(true, 'Launched');

    const start = this.missile.launchLatLng;
    const end = this.missile.targetLatLng;
    const totalKm = this.missile.totalDistanceKm || this.haversineKm(start, end);
    const totalSec = totalKm / this.missile.speedKms;

    const animate = () => {
      const elapsedSec = (Date.now() - this.missile.startTime) / 1000;
      const t = Math.min(elapsedSec / totalSec, 1);
      const lat = start.lat + (end.lat - start.lat) * t;
      const lng = start.lng + (end.lng - start.lng) * t;
      const bearing = this.computeBearing(start, { lat, lng });
      this.missile.missileMarker.setLatLng({ lat, lng });
      if (this.missile.missileMarker.setRotationAngle) {
        this.missile.missileMarker.setRotationAngle(bearing);
        this.missile.missileMarker.setRotationOrigin('center center');
      }
      this.updateMissileInfoHUD(true, t < 1 ? 'In Flight' : 'Target Reached', elapsedSec, totalSec, totalKm);
      if (t < 1) {
        this.missile.animReq = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(this.missile.animReq);
        this.missile.animReq = null;
      }
    };
    this.missile.animReq = requestAnimationFrame(animate);
  }

  resetMissileSimulation() {
    ['rangeCircle','pathLine','missileMarker','launchMarker','targetMarker'].forEach(k => {
      if (this.missile[k]) { this.map.removeLayer(this.missile[k]); this.missile[k] = null; }
    });
    this.missile.launchLatLng = null;
    this.missile.targetLatLng = null;
    this.missile.startTime = null;
    this.missile.totalDistanceKm = 0;
    this.missile.estimatedTimeSec = 0;
    this.updateMissileInfoHUD(false, 'Idle', 0, 0, 0);
  }

  updateMissileInfoHUD(showPanel = false, status = 'Idle', elapsedSec = 0, totalSec = this.missile.estimatedTimeSec, distanceKm = this.missile.totalDistanceKm) {
    let panel = document.getElementById('missile-info-panel');
    if (!panel && showPanel) {
      panel = document.createElement('div');
      panel.id = 'missile-info-panel';
      panel.innerHTML = `
        <div class="title">MISSILE SIMULATION</div>
        <div class="row"><span>Name</span><strong id="hudMissileName"></strong></div>
        <div class="row"><span>Speed</span><strong id="hudMissileSpeed"></strong></div>
        <div class="row"><span>Distance</span><strong id="hudMissileDistance"></strong></div>
        <div class="row"><span>Elapsed</span><strong id="hudMissileElapsed"></strong></div>
        <div class="row"><span>ETA</span><strong id="hudMissileETA"></strong></div>
        <div class="row"><span>Status</span><strong id="hudMissileStatus"></strong></div>
      `;
      this.map._container.appendChild(panel);
      this.makePanelDraggable(panel);
    }
    if (!panel) return;
    panel.style.display = showPanel ? 'block' : 'none';
    const nameEl = panel.querySelector('#hudMissileName');
    const speedEl = panel.querySelector('#hudMissileSpeed');
    const distEl = panel.querySelector('#hudMissileDistance');
    const elapsedEl = panel.querySelector('#hudMissileElapsed');
    const etaEl = panel.querySelector('#hudMissileETA');
    const statusEl = panel.querySelector('#hudMissileStatus');
    if (nameEl) nameEl.textContent = this.missile.name;
    if (speedEl) speedEl.textContent = `${this.missile.speedKms.toFixed(2)} km/s`;
    if (distEl) distEl.textContent = `${(distanceKm||0).toFixed(1)} km`;
    if (elapsedEl) elapsedEl.textContent = `${Math.floor(elapsedSec)} s`;
    if (etaEl) etaEl.textContent = `${Math.max(0, Math.floor(totalSec - elapsedSec))} s`;
    if (statusEl) statusEl.textContent = status;
  }

  makePanelDraggable(panel) {
    let isDragging = false, startX = 0, startY = 0, origX = 0, origY = 0;
    const onDown = (e) => { isDragging = true; startX = e.clientX; startY = e.clientY; const rect = panel.getBoundingClientRect(); origX = rect.left; origY = rect.top; e.preventDefault(); };
    const onMove = (e) => { if (!isDragging) return; const dx = e.clientX - startX; const dy = e.clientY - startY; panel.style.left = `${origX + dx}px`; panel.style.top = `${origY + dy}px`; };
    const onUp = () => { isDragging = false; };
    panel.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  // Utilities
  haversineKm(a, b) {
    const toRad = (x) => x * Math.PI / 180;
    const R = 6371; // km
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h = Math.sin(dLat/2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  computeBearing(a, b) {
    const toRad = (x) => x * Math.PI / 180;
    const toDeg = (x) => x * 180 / Math.PI;
    const φ1 = toRad(a.lat), φ2 = toRad(b.lat);
    const Δλ = toRad(b.lng - a.lng);
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1)*Math.sin(φ2) - Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ);
    const θ = Math.atan2(y, x);
    return (toDeg(θ) + 360) % 360;
  }

  addDarkOverlay() {
    // Create a dark overlay layer for cinematic night-mode effect
    const darkOverlay = L.rectangle([
      [5, 60],
      [40, 100]
    ], {
      color: 'transparent',
      fillColor: '#000000',
      fillOpacity: 0.15,
      weight: 0,
      interactive: false
    }).addTo(this.map);
  }

  drawCountryBorders() {
    // Intentionally left empty: rely on base map's natural borders only
  }

  addCountryLabels() {
    // Country label positions and coordinates
    const countryLabels = [
      { name: 'INDIA', lat: 20.5937, lng: 78.9629, size: '16px', fontWeight: 'bold' },
      { name: 'Pakistan', lat: 30.3753, lng: 69.3451, size: '12px', fontWeight: 'normal' },
      { name: 'Nepal', lat: 28.3949, lng: 84.1240, size: '11px', fontWeight: 'normal' },
      { name: 'Bhutan', lat: 27.5142, lng: 90.4336, size: '10px', fontWeight: 'normal' },
      { name: 'Bangladesh', lat: 23.6850, lng: 90.3563, size: '11px', fontWeight: 'normal' },
      { name: 'Sri Lanka', lat: 7.8731, lng: 80.7718, size: '10px', fontWeight: 'normal' },
      { name: 'Myanmar', lat: 21.9162, lng: 95.9560, size: '11px', fontWeight: 'normal' },
      { name: 'China', lat: 35.8617, lng: 104.1954, size: '12px', fontWeight: 'normal' }
    ];

    countryLabels.forEach(label => {
      const labelIcon = L.divIcon({
        className: 'country-label',
        html: `<div style="
          color: #1ecc71;
          font-size: ${label.size};
          font-weight: ${label.fontWeight};
          text-shadow: 0 0 8px rgba(30, 204, 113, 0.6), 0 0 12px rgba(30, 204, 113, 0.3);
          font-family: 'IBM Plex Mono', monospace;
          white-space: nowrap;
          pointer-events: none;
          text-transform: uppercase;
          letter-spacing: 1px;
        ">${label.name}</div>`,
        iconSize: [100, 30],
        iconAnchor: [50, 15]
      });

      L.marker([label.lat, label.lng], { icon: labelIcon, interactive: false }).addTo(this.map);
    });
  }

  addRadarAnimation() {
    // Create SVG overlay for animated radar effect
    const svgOverlay = document.createElement('div');
    svgOverlay.id = 'radar-overlay';
    svgOverlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 100;
    `;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.cssText = 'position: absolute; top: 0; left: 0;';

    // Create animated radar circle - centered on India
    const radarCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    radarCircle.setAttribute('class', 'radar-circle');
    radarCircle.setAttribute('cx', '50%');
    radarCircle.setAttribute('cy', '50%');
    radarCircle.setAttribute('r', '80px');
    radarCircle.style.cssText = `
      fill: none;
      stroke: #1ecc71;
      stroke-width: 2;
      opacity: 0.3;
      animation: radarPulse 3s infinite;
    `;

    // Create rotating sweep line
    const sweepLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    sweepLine.setAttribute('class', 'radar-sweep');
    sweepLine.setAttribute('x1', '50%');
    sweepLine.setAttribute('y1', '50%');
    sweepLine.setAttribute('x2', '50%');
    sweepLine.setAttribute('y2', '30px');
    sweepLine.style.cssText = `
      stroke: #1ecc71;
      stroke-width: 2;
      opacity: 0.7;
      animation: radarSweep 8s linear infinite;
      filter: drop-shadow(0 0 4px #1ecc71);
    `;

    svg.appendChild(radarCircle);
    svg.appendChild(sweepLine);
    svgOverlay.appendChild(svg);

    this.map._container.appendChild(svgOverlay);

    // Inject CSS animations if not already present
    if (!document.getElementById('radar-animations')) {
      const style = document.createElement('style');
      style.id = 'radar-animations';
      style.textContent = `
        @keyframes radarPulse {
          0%, 100% { 
            r: 80px; 
            stroke-width: 2;
            opacity: 0.3;
          }
          50% { 
            r: 120px; 
            stroke-width: 1;
            opacity: 0.1;
          }
        }
        
        @keyframes radarSweep {
          0% { 
            transform: rotate(0deg);
            opacity: 0.7;
          }
          100% { 
            transform: rotate(360deg);
            opacity: 0.7;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  addGridOverlay() {
    // Create canvas-based grid overlay
    const canvas = document.createElement('canvas');
    canvas.id = 'grid-overlay';
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 50;
    `;

    const ctx = canvas.getContext('2d');
    const container = this.map._container;

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      drawGrid();
    };

    const drawGrid = () => {
      const gridSize = 40; // pixels between grid lines
      const gridColor = 'rgba(30, 204, 113, 0.08)';
      const scanLineColor = 'rgba(30, 204, 113, 0.15)';

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw vertical grid lines
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal grid lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Add scanning line animation
      const now = Date.now();
      const scanPosition = (now / 20) % canvas.height;

      ctx.strokeStyle = scanLineColor;
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(30, 204, 113, 0.5)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(0, scanPosition);
      ctx.lineTo(canvas.width, scanPosition);
      ctx.stroke();
      ctx.shadowBlur = 0;

      requestAnimationFrame(drawGrid);
    };

    container.appendChild(canvas);
    resizeCanvas();

    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
  }

  // ==================== DUAL-MAP AND ROUTING METHODS ====================

  /**
   * Initialize NASA WorldWind 3D Globe
   */
  initCesium() {
    try {
      if (typeof WorldWind === 'undefined') {
        console.error('NASA WorldWind library not loaded');
        this.app.addAlert('WorldWind loading - please wait...', 'info');
        // Retry after a short delay
        setTimeout(() => this.initCesium(), 2000);
        return;
      }

      const cesiumContainer = document.getElementById('cesiumContainer');
      if (!cesiumContainer) {
        console.error('cesiumContainer not found in DOM');
        return;
      }

      // Clear any existing content
      cesiumContainer.innerHTML = '';

      // Create WorldWind Globe viewer
      const wwd = new WorldWind.WorldWindow('cesiumContainer');

      // Add Bing Aerial satellite imagery layer
      wwd.addLayer(new WorldWind.BingImageryLayer(WorldWind.BingImageryLayer.LAYER_NAMES.AERIAL));

      // Set viewport to view Earth from space (satellite perspective)
      // Positioned over India with good zoom level to see the whole Earth
      wwd.navigator.lookAtLatLon = new WorldWind.Location(20, 78, 8000000); // 8 million meters altitude

      // Store reference for later use
      this.worldwindGlobe = wwd;

      // Add click handler for coordinate selection (for missile/routing)
      const self = this;
      cesiumContainer.addEventListener('click', function(event) {
        const x = event.clientX;
        const y = event.clientY;

        try {
          const pickList = wwd.pick(new WorldWind.Vec2(x, y));
          const position = wwd.computePositionFromScreenPoint(new WorldWind.Vec2(x, y));

          if (position) {
            self.handleMapClick({ latlng: { lat: position.latitude, lng: position.longitude } });
          }
        } catch (e) {
          console.log('Click pick error:', e);
        }
      }, false);

      // Update layer selector to show active layer
      this.updateLayerSelector('satellite');

      this.app.addAlert('3D Earth Globe loaded - Satellite View ✓', 'success');
    } catch (error) {
      console.error('WorldWind init error:', error);
      this.app.addAlert('Could not load 3D globe - switching to 2D', 'error');
      // Fallback to Leaflet
      this.mapType = 'leaflet';
      setTimeout(() => this.initLeaflet(), 500);
    }
  }

  /**
   * Switch between Leaflet and Cesium maps
   */
  switchMap(type) {
    if (!['leaflet', 'cesium'].includes(type)) {
      console.error('Invalid map type: ' + type);
      return;
    }

    if (this.mapType === type) return;

    try {
      const mapContainer = document.getElementById('map');
      const cesiumContainer = document.getElementById('cesiumContainer');
      if (!mapContainer || !cesiumContainer) return;

      // Clean up current map
      if (this.mapType === 'leaflet' && this.map) {
        this.map.remove();
        this.map = null;
      }
      if (this.mapType === 'cesium' && this.worldwindGlobe) {
        // WorldWind cleanup
        this.worldwindGlobe = null;
      }
      if (this.mapType === 'cesium' && this.cesiumViewer) {
        // Fallback Cesium cleanup (if still in use)
        this.cesiumViewer = null;
      }

      // Update type first
      this.mapType = type;

      // Show/hide containers
      if (type === 'leaflet') {
        mapContainer.classList.remove('hidden');
        cesiumContainer.classList.add('hidden');
        this.initLeaflet();
        this.addRadarAnimation();
        this.addGridOverlay();
        this.map.on('click', (e) => this.handleMapClick(e));
      } else {
        mapContainer.classList.add('hidden');
        cesiumContainer.classList.remove('hidden');
        this.initCesium();
      }

      // Hide HUD panels when switching maps
      const hudPanels = document.querySelector('.hud-panels');
      if (hudPanels) {
        hudPanels.style.display = 'none';
      }

      this.app.addAlert('Switched to ' + type.toUpperCase() + ' map', 'success');
    } catch (error) {
      console.error('Map switch error:', error);
      this.app.addAlert('Error switching maps', 'error');
    }
  }

  /**
   * Enable/disable routing mode
   */
  setRoutingMode(enabled) {
    this.routingMode = enabled;
    this.routing.enabled = enabled;
    if (enabled) {
      this.clearRoute();
      this.app.addAlert('Routing mode enabled', 'info');
    }
  }

  /**
   * Handle routing click
   */
  handleRoutingClick(lat, lng) {
    if (!this.routingMode) return;

    if (!this.routing.startPoint) {
      this.routing.startPoint = { lat, lng };
      if (this.mapType === 'leaflet') {
        this.addRoutingMarker('start', lat, lng);
      }
      this.app.addAlert('Route start set', 'success');
      return;
    }

    if (!this.routing.endPoint) {
      this.routing.endPoint = { lat, lng };
      if (this.mapType === 'leaflet') {
        this.addRoutingMarker('end', lat, lng);
      }
      this.app.addAlert('Route end set', 'success');
      this.fetchRoute();
      return;
    }

    // Reset
    this.routing.startPoint = { lat, lng };
    this.routing.endPoint = null;
    this.clearRoute();
    if (this.mapType === 'leaflet') {
      this.addRoutingMarker('start', lat, lng);
    }
  }

  /**
   * Add routing marker
   */
  addRoutingMarker(type, lat, lng) {
    if (this.mapType !== 'leaflet' || !this.map) return;

    const icon = type === 'start' ? '📍' : '🎯';
    const color = type === 'start' ? '#00d4ff' : '#ff6b6b';

    try {
      const marker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'routing-marker',
          html: '<div style="font-size:20px;color:' + color + ';">' + icon + '</div>',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        })
      }).addTo(this.map);

      if (type === 'start') {
        if (this.routing.startMarker) this.map.removeLayer(this.routing.startMarker);
        this.routing.startMarker = marker;
      } else {
        if (this.routing.endMarker) this.map.removeLayer(this.routing.endMarker);
        this.routing.endMarker = marker;
      }
    } catch (e) {
      console.error('Marker error:', e);
    }
  }

  /**
   * Fetch route from OSRM API
   */
  async fetchRoute() {
    if (!this.routing.startPoint || !this.routing.endPoint) return;

    try {
      const s = this.routing.startPoint;
      const e = this.routing.endPoint;
      const osrmUrl = 'https://router.project-osrm.org/route/v1/driving/' + s.lng + ',' + s.lat + ';' + e.lng + ',' + e.lat + '?overview=full&geometries=geojson';

      const response = await fetch(osrmUrl);
      const data = await response.json();

      if (data.code === 'Ok' && data.routes.length > 0) {
        const route = data.routes[0];
        this.drawRoute(route.geometry.coordinates, route);
        this.app.addAlert('Route: ' + (route.distance / 1000).toFixed(1) + ' km', 'success');
      } else {
        this.app.addAlert('No route found', 'warning');
      }
    } catch (error) {
      console.error('Route error:', error);
      this.app.addAlert('Routing error', 'error');
    }
  }

  /**
   * Draw route polyline
   */
  drawRoute(coordinates, routeData) {
    if (this.mapType !== 'leaflet' || !this.map) return;

    try {
      if (this.routing.polyline) {
        this.map.removeLayer(this.routing.polyline);
      }

      const latlngs = coordinates.map(c => [c[1], c[0]]);
      this.routing.polyline = L.polyline(latlngs, {
        color: '#00d4ff',
        weight: 3,
        opacity: 0.8,
        dashArray: '4,2'
      }).addTo(this.map);

      const bounds = this.routing.polyline.getBounds();
      this.map.fitBounds(bounds, { padding: [50, 50] });
    } catch (error) {
      console.error('Draw route error:', error);
    }
  }

  /**
   * Clear routing
   */
  clearRoute() {
    if (this.mapType === 'leaflet' && this.map) {
      if (this.routing.polyline) {
        this.map.removeLayer(this.routing.polyline);
        this.routing.polyline = null;
      }
      if (this.routing.startMarker) {
        this.map.removeLayer(this.routing.startMarker);
        this.routing.startMarker = null;
      }
      if (this.routing.endMarker) {
        this.map.removeLayer(this.routing.endMarker);
        this.routing.endMarker = null;
      }
    }
    this.routing.startPoint = null;
    this.routing.endPoint = null;
  }
}
