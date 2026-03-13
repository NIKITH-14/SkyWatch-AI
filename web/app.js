// SkyWatch AI - Main Application Controller
class SkyWatchApp {
  constructor() {
    // Objects removed - map focused on missile simulation only
    this.objects = {};

    this.currentObjectId = 'jet-1';
    this.alerts = [];
    this.keysPressed = {};
    this.mapManager = null;
    this.aiEngine = null;
    this.animationSpeed = 5;
    this.aiEnabled = false;
    this.historyPlaying = false;

    this.init();
  }

  init() {
    this.setupEventListeners();
    // System time is now handled by ui-effects.js
    this.startAnimationLoop();

    // Initialize AI Engine
    this.aiEngine = new AIEngine(this);
    
    // Initialize map after a short delay to ensure DOM is ready
    setTimeout(() => {
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        this.mapManager = new MapManager(this);
        this.mapManager.init();
        window.mapManager = this.mapManager; // Global reference
        // Apply current missile selection to map manager
        const missileType = document.getElementById('missileType');
        if (missileType) {
          const opt = missileType.options[missileType.selectedIndex];
          const name = opt.value;
          const rangeKm = parseFloat(opt.getAttribute('data-range')) || 0;
          const speedKms = parseFloat(opt.getAttribute('data-speed')) || 2.0;
          this.mapManager.setMissileType(name, rangeKm, speedKms);
        }
      }
    }, 100);

    // Store app reference globally
    window.skyWatchApp = this;
  }

  setupEventListeners() {
    // Object selector disabled - no tracking objects
    const objSelector = document.getElementById('objectSelector');
    if (objSelector) {
      objSelector.disabled = true;
      objSelector.style.opacity = '0.5';
    }

    // Control buttons disabled - missile simulation only
    const btnStart = document.getElementById('btnStart');
    const btnStop = document.getElementById('btnStop');
    const btnReset = document.getElementById('btnReset');

    if (btnStart) { btnStart.disabled = true; btnStart.style.opacity = '0.5'; }
    if (btnStop) { btnStop.disabled = true; btnStop.style.opacity = '0.5'; }
    if (btnReset) { btnReset.disabled = true; btnReset.style.opacity = '0.5'; }

    // History controls
    const btnPlayHistory = document.getElementById('btnPlayHistory');
    const btnPauseHistory = document.getElementById('btnPauseHistory');
    const btnResetHistory = document.getElementById('btnResetHistory');

    if (btnPlayHistory) btnPlayHistory.addEventListener('click', () => this.playHistory());
    if (btnPauseHistory) btnPauseHistory.addEventListener('click', () => this.pauseHistory());
    if (btnResetHistory) btnResetHistory.addEventListener('click', () => this.resetHistory());

    // Settings - AI button
    const btnEnableAI = document.getElementById('btnEnableAI');
    if (btnEnableAI) btnEnableAI.addEventListener('click', () => this.toggleAI());

    // Missile controls
    const missileType = document.getElementById('missileType');
    const missileNameEl = document.getElementById('missileName');
    const missileRangeEl = document.getElementById('missileRange');
    if (missileType) {
      const applyMissileSelection = () => {
        const opt = missileType.options[missileType.selectedIndex];
        const name = opt.value;
        const rangeKm = parseFloat(opt.getAttribute('data-range')) || 0;
        const speedKms = parseFloat(opt.getAttribute('data-speed')) || 2.0;
        if (missileNameEl) missileNameEl.textContent = name;
        if (missileRangeEl) missileRangeEl.textContent = `${rangeKm} km`;
        if (window.mapManager) window.mapManager.setMissileType(name, rangeKm, speedKms);
      };
      missileType.addEventListener('change', applyMissileSelection);
      // initialize once
      applyMissileSelection();
    }

    const btnMissileSelectLaunch = document.getElementById('btnMissileSelectLaunch');
    const btnMissileSelectTarget = document.getElementById('btnMissileSelectTarget');
    const btnMissileStart = document.getElementById('btnMissileStart');
    const btnMissileReset = document.getElementById('btnMissileReset');

    if (btnMissileSelectLaunch) btnMissileSelectLaunch.addEventListener('click', () => {
      if (!window.mapManager) return;
      window.mapManager.enableLaunchSelection();
      this.addAlert('Select a launch point on the map', 'info');
    });

    if (btnMissileSelectTarget) btnMissileSelectTarget.addEventListener('click', () => {
      if (!window.mapManager) return;
      window.mapManager.enableTargetSelection();
      this.addAlert('Select a target point on the map', 'info');
    });

    if (btnMissileStart) btnMissileStart.addEventListener('click', () => {
      if (!window.mapManager) return;
      window.mapManager.startMissileSimulation();
      this.addAlert('Missile simulation started', 'success');
    });

    if (btnMissileReset) btnMissileReset.addEventListener('click', () => {
      if (!window.mapManager) return;
      window.mapManager.resetMissileSimulation();
      this.addAlert('Missile simulation reset', 'info');
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      this.keysPressed[e.key.toLowerCase()] = true;
    });
    document.addEventListener('keyup', (e) => {
      this.keysPressed[e.key.toLowerCase()] = false;
    });
  }

  updateSystemTime() {
    setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
      document.getElementById('systemTime').textContent = timeStr + ' UTC';
      
      this.updateSystemStatus();
    }, 1000);
  }

  updateSystemStatus() {
    const objectCount = Object.values(this.objects).filter(o => o.isMoving).length;
    const alertCount = this.alerts.length;
    
    // Update topbar stats
    const systemStatus = document.getElementById('systemStatus');
    if (systemStatus) {
      systemStatus.textContent = `Objects: ${objectCount} | Alerts: ${alertCount}`;
    }

    // Update sidebar stats
    const statAlerts = document.getElementById('stat-alerts');
    if (statAlerts) {
      statAlerts.textContent = alertCount;
    }
  }

  startObject() {
    const obj = this.objects[this.currentObjectId];
    obj.isMoving = true;
    obj.status = 'moving';
    obj.speed = 50;
    this.addAlert(`${obj.name} started moving`, 'info');
  }

  stopObject() {
    const obj = this.objects[this.currentObjectId];
    obj.isMoving = false;
    obj.status = 'idle';
    obj.speed = 0;
    this.addAlert(`${obj.name} stopped`, 'info');
  }

  resetObject() {
    const obj = this.objects[this.currentObjectId];
    obj.lat = this.getInitialLat(obj.id);
    obj.lng = this.getInitialLng(obj.id);
    obj.speed = 0;
    obj.direction = 0;
    obj.isMoving = false;
    obj.path = [];
    obj.status = 'idle';
    if (this.mapManager) this.mapManager.updateMarkers();
    this.updateObjectDetails();
    this.addAlert(`${obj.name} reset to starting position`, 'info');
  }

  getInitialLat(id) {
    const initial = { 'jet-1': 35.6892, 'vehicle-1': 35.6850, 'drone-1': 35.7000 };
    return initial[id] || 35.6892;
  }

  getInitialLng(id) {
    const initial = { 'jet-1': 139.6917, 'vehicle-1': 139.7000, 'drone-1': 139.6800 };
    return initial[id] || 139.6917;
  }

  updateObjectDetails() {
    // No tracking objects - clear display
    document.getElementById('detail-id').textContent = '--';
    document.getElementById('detail-speed').textContent = '--';
    document.getElementById('detail-direction').textContent = '--';
    document.getElementById('detail-lat').textContent = '--';
    document.getElementById('detail-lng').textContent = '--';
    document.getElementById('detail-status').textContent = 'DISABLED';
  }

  addAlert(message, type = 'info') {
    const alert = {
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      message,
      type
    };
    this.alerts.push(alert);
    if (this.alerts.length > 50) this.alerts.shift();

    const alertsList = document.getElementById('alertsList');
    const alertEl = document.createElement('div');
    alertEl.className = `alert-item alert-${type}`;
    alertEl.innerHTML = `<span class="alert-time">${alert.time}</span><span class="alert-msg">${message}</span>`;
    alertsList.insertBefore(alertEl, alertsList.firstChild);
  }

  toggleAI() {
    this.aiEnabled = !this.aiEnabled;
    const btn = document.getElementById('btnEnableAI');
    if (this.aiEnabled) {
      btn.textContent = 'Disable AI Monitoring';
      btn.classList.remove('btn-green');
      btn.classList.add('btn-danger');
      if (this.aiEngine) {
        this.aiEngine.startMonitoring();
      }
      this.addAlert('AI Monitoring enabled', 'success');
    } else {
      btn.textContent = 'Enable AI Monitoring';
      btn.classList.add('btn-green');
      btn.classList.remove('btn-danger');
      this.addAlert('AI Monitoring disabled', 'info');
    }
  }

  playHistory() {
    this.historyPlaying = true;
    this.addAlert('History playback started', 'info');
  }

  pauseHistory() {
    this.historyPlaying = false;
    this.addAlert('History playback paused', 'info');
  }

  resetHistory() {
    Object.values(this.objects).forEach(obj => obj.path = []);
    this.historyPlaying = false;
    if (this.mapManager) this.mapManager.updateMarkers();
    this.addAlert('History cleared', 'info');
  }

  clearAllData() {
    if (confirm('Clear all tracking data?')) {
      Object.values(this.objects).forEach(obj => {
        obj.path = [];
        obj.isMoving = false;
        obj.status = 'idle';
      });
      this.alerts = [];
      document.getElementById('alertsList').innerHTML = '<div class="alert-item alert-info"><span class="alert-time">--:--:--</span><span class="alert-msg">System cleared</span></div>';
      if (this.mapManager) this.mapManager.updateMarkers();
      this.addAlert('All data cleared', 'warning');
    }
  }

  // Animation loop disabled - no tracking objects
  startAnimationLoop() {
    // Only missile simulation uses animation
    setInterval(() => {
      this.updateSystemStatus();
    }, 1000);
  }

  updateObjectPosition(obj) {
    // Handle keyboard input
    const speedIncrement = 0.01 * this.animationSpeed;
    const directionIncrement = 1 * this.animationSpeed;

    if (this.keysPressed['w'] || this.keysPressed['arrowup']) {
      obj.speed = Math.min(obj.speed + speedIncrement, 120);
    }
    if (this.keysPressed['s'] || this.keysPressed['arrowdown']) {
      obj.speed = Math.max(obj.speed - speedIncrement, 0);
    }
    if (this.keysPressed['a'] || this.keysPressed['arrowleft']) {
      obj.direction = (obj.direction - directionIncrement) % 360;
    }
    if (this.keysPressed['d'] || this.keysPressed['arrowright']) {
      obj.direction = (obj.direction + directionIncrement) % 360;
    }

    // Move object based on speed and direction
    if (obj.speed > 0.1) {
      const radians = (obj.direction * Math.PI) / 180;
      const latDelta = (obj.speed * Math.cos(radians)) * 0.0001;
      const lngDelta = (obj.speed * Math.sin(radians)) * 0.0001;

      obj.lat += latDelta;
      obj.lng += lngDelta;

      // Add to path
      obj.path.push({ lat: obj.lat, lng: obj.lng });
      if (obj.path.length > 500) obj.path.shift();

      // Check for alerts
      if (this.aiEnabled && Math.random() > 0.95) {
        this.addAlert(`AI: Unusual pattern detected on ${obj.name}`, 'warning');
      }
    }
  }
}

// Initialize app after successful login
// This function will be called from auth.js after user logs in
// and dashboard becomes visible
function initSkyWatchApp() {
  if (!window.skyWatchApp) {
    window.skyWatchApp = new SkyWatchApp();
  }
}

// Store the init function globally for auth.js to call
window.initSkyWatchApp = initSkyWatchApp;
