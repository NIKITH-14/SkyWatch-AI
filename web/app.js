// SkyWatch AI - Main Application Controller
class SkyWatchApp {
  constructor() {
    this.objects = {
      'jet-1': {
        id: 'jet-1',
        name: 'Jet Alpha-1',
        type: 'jet',
        lat: 35.6892,
        lng: 139.6917,
        speed: 0,
        direction: 0,
        status: 'idle',
        icon: '✈️',
        color: '#2edc81',
        path: [],
        isMoving: false,
      },
      'vehicle-1': {
        id: 'vehicle-1',
        name: 'Vehicle Bravo-1',
        type: 'vehicle',
        lat: 35.6850,
        lng: 139.7000,
        speed: 0,
        direction: 45,
        status: 'idle',
        icon: '🚗',
        color: '#3d75c9',
        path: [],
        isMoving: false,
      },
      'drone-1': {
        id: 'drone-1',
        name: 'Drone Charlie-1',
        type: 'drone',
        lat: 35.7000,
        lng: 139.6800,
        speed: 0,
        direction: 90,
        status: 'idle',
        icon: '🛸',
        color: '#f39c12',
        path: [],
        isMoving: false,
      }
    };

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
    this.updateSystemTime();
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
      }
    }, 100);

    // Store app reference globally
    window.skyWatchApp = this;
  }

  setupEventListeners() {
    // Object selector
    const objSelector = document.getElementById('objectSelector');
    if (objSelector) {
      objSelector.addEventListener('change', (e) => {
        this.currentObjectId = e.target.value;
        this.updateObjectDetails();
      });
    }

    // Control buttons
    const btnStart = document.getElementById('btnStart');
    const btnStop = document.getElementById('btnStop');
    const btnReset = document.getElementById('btnReset');

    if (btnStart) btnStart.addEventListener('click', () => this.startObject());
    if (btnStop) btnStop.addEventListener('click', () => this.stopObject());
    if (btnReset) btnReset.addEventListener('click', () => this.resetObject());

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
    const obj = this.objects[this.currentObjectId];
    document.getElementById('detail-id').textContent = obj.id;
    document.getElementById('detail-speed').textContent = obj.speed.toFixed(1) + ' m/s';
    document.getElementById('detail-direction').textContent = obj.direction.toFixed(0) + '°';
    document.getElementById('detail-lat').textContent = obj.lat.toFixed(4);
    document.getElementById('detail-lng').textContent = obj.lng.toFixed(4);
    document.getElementById('detail-status').textContent = obj.status.toUpperCase();
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

  // Animation loop for continuous movement
  startAnimationLoop() {
    setInterval(() => {
      Object.values(this.objects).forEach(obj => {
        if (obj.isMoving) {
          this.updateObjectPosition(obj);
        }
      });

      if (this.mapManager) {
        this.mapManager.updateMarkers();
      }

      this.updateObjectDetails();
      this.updateSystemStatus();
    }, 100);
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

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new SkyWatchApp();
});
