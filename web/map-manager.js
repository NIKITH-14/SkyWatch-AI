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
  }

  init() {
    // Initialize Leaflet map - Centered on India
    this.map = L.map('map', {
      center: [20.5937, 78.9629], // India center
      zoom: 5,
      attributionControl: false,
      zoomControl: true,
      minZoom: 3,
      maxZoom: 16,
    });

    this.setMapStyle('dark');

    // Add dark overlay
    this.addDarkOverlay();

    // Draw country borders
    this.drawCountryBorders();

    // Add country labels
    this.addCountryLabels();

    // Add radar animation
    this.addRadarAnimation();

    // Add grid overlay
    this.addGridOverlay();

    // Add map event listeners
    this.map.on('click', (e) => {
      this.handleMapClick(e);
    });

    // Create markers and path lines
    Object.entries(this.app.objects).forEach(([id, obj]) => {
      this.createMarker(id, obj);
      this.createPathLine(id);
    });

    this.updateMarkers();
  }

  setMapStyle(style) {
    this.currentMapStyle = style;
    
    const tileUrls = {
      'normal': 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'satellite': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      'dark': 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
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
  }

  changeMapStyle(style) {
    this.setMapStyle(style);
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
    const obj = this.app.objects[this.app.currentObjectId];
    obj.lat = e.latlng.lat;
    obj.lng = e.latlng.lng;
    obj.path = [[e.latlng.lat, e.latlng.lng]];
    this.updateMarkers();
    this.app.addAlert(`${obj.name} repositioned to ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`, 'info');
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
    // Define country bounding boxes and coordinates for glowing borders
    const countries = {
      'India': {
        bounds: [[8.4, 68.7], [35.5, 97.4]],
        center: [20.5937, 78.9629],
        color: '#1ecc71'
      },
      'Pakistan': {
        bounds: [[23.5, 60.5], [37.1, 77.8]],
        center: [30.3753, 69.3451],
        color: '#00ff88'
      },
      'Nepal': {
        bounds: [[26.3, 80.1], [30.4, 88.2]],
        center: [28.3949, 84.1240],
        color: '#00ff88'
      },
      'Bhutan': {
        bounds: [[26.8, 88.7], [28.2, 92.5]],
        center: [27.5142, 90.4336],
        color: '#00ff88'
      },
      'Bangladesh': {
        bounds: [[20.7, 88.0], [26.6, 92.7]],
        center: [23.6850, 90.3563],
        color: '#00ff88'
      },
      'Sri Lanka': {
        bounds: [5.9, 80.0], [7.7, 81.9],
        center: [7.8731, 80.7718],
        color: '#00ff88'
      },
      'Myanmar': {
        bounds: [[9.3, 92.2], [28.5, 101.9]],
        center: [21.9162, 95.9560],
        color: '#00ff88'
      },
      'China': {
        bounds: [[35.5, 73.5], [39.5, 100.0]],
        center: [35.8617, 104.1954],
        color: '#0088ff'
      }
    };

    // Draw borders with glowing effect
    Object.entries(countries).forEach(([name, data]) => {
      const rectangle = L.rectangle(data.bounds, {
        color: data.color,
        weight: 2.5,
        opacity: 0.8,
        fillOpacity: 0.02,
        fillColor: data.color,
        dashArray: '3, 3',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(this.map);

      // Add glow effect via CSS class (if styled in CSS)
      const element = rectangle.getElement();
      if (element) {
        element.style.filter = 'drop-shadow(0 0 2px ' + data.color + ')';
      }
    });
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
}
