// UI Effects - Dashboard navigation, system time, and HUD updates
// Auth flow now handled in auth.js

class UIEffects {
  constructor() {
    this.setupDashboard();
    this.setupNavigation();
    this.updateSystemTime();
    setInterval(() => this.updateSystemTime(), 1000);
  }

  // ==================== DASHBOARD ====================
  setupDashboard() {
    // Dashboard is initialized after login in auth.js
    // This method is reserved for future dashboard-specific effects
  }

  // ==================== NAVIGATION ====================
  setupNavigation() {
    // Sidebar nav buttons - show/hide sidebar content panels
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const screen = btn.getAttribute('data-screen');
        this.switchToScreen(screen);
        this.updateActiveNavBtn(btn);
      });
    });

    // Map style buttons
    document.querySelectorAll('.map-style-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.map-style-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const style = btn.getAttribute('data-style');
        if (window.mapManager) {
          window.mapManager.changeMapStyle(style);
        }
      });
    });

    // Speed control slider
    const speedControl = document.getElementById('speedControl');
    if (speedControl) {
      speedControl.addEventListener('input', () => {
        document.getElementById('speedValue').textContent = speedControl.value;
        if (window.skyWatchApp) {
          window.skyWatchApp.animationSpeed = parseInt(speedControl.value);
        }
      });
    }

    // Clear alerts button
    const btnClearAlerts = document.getElementById('btnClearAlerts');
    if (btnClearAlerts) {
      btnClearAlerts.addEventListener('click', () => {
        const alertsList = document.getElementById('alertsList');
        alertsList.innerHTML = '<p style="color: #a8b0be; text-align: center; padding: 20px 0;">No alerts at this time</p>';
        if (window.skyWatchApp) {
          window.skyWatchApp.alerts = [];
        }
      });
    }

    // Logout button - reload page
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        location.reload();
      });
    }

    // Footer menu buttons
    document.querySelectorAll('.footer-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-footer-action');

        // Update active state
        document.querySelectorAll('.footer-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Map action to screen
        const screenMap = {
          'dashboard': 'dashboard',
          'missile-testing': 'missile-testing',
          'ai-analysis': 'ai-analysis',
          'alerts': 'alerts',
          'settings': 'settings'
        };

        const screen = screenMap[action] || action;
        this.switchToScreen(screen);
      });
    });
  }

  switchToScreen(screen) {
    // Update sidebar content panels
    document.querySelectorAll('.sidebar-content').forEach(content => {
      content.classList.remove('active');
    });

    const screenElement = document.getElementById(`screen-${screen}`);
    if (screenElement) {
      screenElement.classList.add('active');
    }

    // Toggle missile mode for map clicks
    if (window.mapManager) {
      window.mapManager.setMissileMode(screen === 'missile-testing');
    }

    // Map is always visible now - no need to toggle views
    const mapView = document.getElementById('mapView');
    if (mapView && !mapView.classList.contains('active')) {
      mapView.classList.add('active');
    }

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-screen') === screen) {
        btn.classList.add('active');
      }
    });
  }

  updateActiveNavBtn(btn) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  // ==================== SYSTEM TIME ====================
  updateSystemTime() {
    const now = new Date();

    // Use local system time (24-hour format)
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    // Update topbar clock
    const timeElement = document.getElementById('systemTime');
    if (timeElement) {
      timeElement.textContent = timeString;
    }

    // Update HUD panels
    this.updateHUDPanels();
  }

  updateHUDPanels() {
    // Update alert count
    if (window.skyWatchApp) {
      const alertCount = window.skyWatchApp.alerts.length;
      const hudAlertCount = document.getElementById('hudAlertCount');
      if (hudAlertCount) {
        hudAlertCount.textContent = alertCount;
        if (alertCount > 0) {
          hudAlertCount.classList.add('has-alerts');
        } else {
          hudAlertCount.classList.remove('has-alerts');
        }
      }

      // Update system status
      const hudSystemStatus = document.getElementById('hudSystemStatus');
      if (hudSystemStatus) {
        hudSystemStatus.textContent = 'OPERATIONAL';
      }

      // Update coordinates (centered on India)
      const hudCoordinates = document.getElementById('hudCoordinates');
      if (hudCoordinates) {
        hudCoordinates.textContent = '20.5937°N, 78.9629°E';
      }
    }
  }
}

// Initialize UI Effects when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.uiEffects = new UIEffects();
});
