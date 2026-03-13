/* auth.js - Authentication and Verification Protocol */

/**
 * FULLSCREEN ENFORCEMENT & SECURITY
 */
function enterFullScreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch(err => {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
    });
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

document.addEventListener('fullscreenchange', handleFullScreenChange);
document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
document.addEventListener('mozfullscreenchange', handleFullScreenChange);
document.addEventListener('MSFullscreenChange', handleFullScreenChange);

function handleFullScreenChange() {
  const warning = document.getElementById('fullscreen-warning');
  if (warning) {
    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
      warning.classList.remove('hidden');
    } else {
      warning.classList.add('hidden');
    }
  }
}

function requestFullScreenAgain() {
  enterFullScreen();
}

/**
 * TERMINAL & VERIFICATION PROTOCOL
 */
function startVerificationProtocol() {
  document.getElementById('click-overlay').style.display = 'none';
  enterFullScreen();

  const terminal = document.getElementById('terminal-container');
  if (!terminal) return;

  terminal.innerHTML = '';

  const lines = [
    "INITIATING CONNECTION PROTOCOLS...",
    "CHECKING HARDWARE INTERFACES...",
    "[OK] RASPBERRY PI_1 (CAMERA) DETECTED [IP: 192.168.137.8]",
    "[OK] RASPBERRY PI_2 (LCD_KEYPAD) DETECTED [IP: 192.168.137.8]",
    "VERIFYING HOTSPOT IP ADDRESS...",
    "ANALYZING NETWORK TOPOLOGY...",
    "IP ADDRESS: 192.168.137.8 <span class='warning-text'>[VERIFYING...]</span>"
  ];

  let lineIndex = 0;

  function appendNextLine() {
    if (lineIndex < lines.length) {
      appendTerminalLine(terminal, lines[lineIndex]);
      lineIndex++;
      setTimeout(appendNextLine, 500 + Math.random() * 800);
    } else {
      onTerminalComplete();
    }
  }

  appendNextLine();
}

function appendTerminalLine(container, html) {
  const p = document.createElement('p');
  p.className = 'terminal-line';
  p.innerHTML = `> ${html}`;
  container.appendChild(p);
}

function onTerminalComplete() {
  const terminal = document.getElementById('terminal-container');

  setTimeout(() => {
    appendTerminalLine(terminal, "IP ADDRESS: 192.168.137.8 <span class='success-text'>[VERIFIED: SECURE NODE]</span>");

    setTimeout(() => {
      appendTerminalLine(terminal, "HANDSHAKE COMPLETE. REDIRECTING TO SKYWATCH...");

      setTimeout(() => {
        transitionToLogin();
      }, 1500);
    }, 1000);
  }, 2000);
}

function transitionToLogin() {
  const terminalView = document.getElementById('terminal-view');
  const loginView = document.getElementById('login-view');

  terminalView.style.opacity = '0';

  setTimeout(() => {
    terminalView.classList.add('hidden');
    loginView.classList.remove('hidden');

    void loginView.offsetWidth;

    loginView.style.opacity = '1';

    // Start Matrix animation
    setTimeout(() => {
      initMatrixAnimation();
      simulateHardwareValidation();
    }, 100);
  }, 1000);
}

/**
 * MATRIX RAIN ANIMATION
 */
function initMatrixAnimation() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const chars = '0123456789';
  const columns = Math.floor(canvas.width / 16);
  const drops = Array(columns).fill(0);

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff41';
    ctx.font = '16px Courier New';

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * 16, drops[i] * 16);

      if (drops[i] * 16 > canvas.height && Math.random() > 0.95) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  const interval = setInterval(draw, 33);

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

/**
 * HARDWARE VALIDATION SIMULATION
 */
async function simulateHardwareValidation() {
  const step1 = document.getElementById('status-step-1');
  const step2 = document.getElementById('status-step-2');
  const step3 = document.getElementById('status-step-3');
  const step4 = document.getElementById('status-step-4');

  if (!step1 || !step2 || !step3 || !step4) return;

  // Step 1: Face Detection
  await sleep(500);
  setStepActive(step1);
  await sleep(2000);
  setStepSuccess(step1, "[✓]", "FACE MATCHED: AUTHORIZED");

  // Step 2: LCD PIN
  await sleep(500);
  setStepActive(step2);
  await sleep(2000);
  setStepSuccess(step2, "[✓]", "PIN ACCEPTED");

  // Step 3: Retinal Scan
  await sleep(500);
  setStepActive(step3);
  await sleep(2500);
  setStepSuccess(step3, "[✓]", "RETINA VERIFIED");

  // Step 4: User Auth
  await sleep(500);
  setStepActive(step4);
  const indicator = step4.querySelector('.indicator');
  indicator.textContent = "INPUT REQUIRED";

  // Enable form
  const passwordInput = document.getElementById('password');
  const authButton = document.getElementById('auth-button');
  passwordInput.disabled = false;
  authButton.disabled = false;
  passwordInput.focus();
}

function setStepActive(element) {
  element.classList.remove('pending');
  element.classList.add('active');
  element.querySelector('.indicator').textContent = "SCANNING...";
}

function setStepSuccess(element, iconText, msg) {
  element.classList.remove('active');
  element.classList.add('success');
  element.querySelector('.icon').textContent = iconText;
  element.querySelector('.indicator').textContent = msg;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * LOGIN FORM HANDLING
 */
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleLoginSubmit();
    });
  }
});

function handleLoginSubmit() {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const authButton = document.getElementById('auth-button');

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  // Flexible authentication: accept any non-empty credentials
  if (!username || !password) {
    authButton.innerHTML = "CREDENTIALS REQUIRED";
    authButton.style.backgroundColor = "#ff3333";
    authButton.style.color = "#fff";
    setTimeout(() => {
      authButton.innerHTML = "AUTHENTICATE";
      authButton.style.backgroundColor = "";
      authButton.style.color = "";
    }, 2000);
    return;
  }

  // Show authenticating status
  authButton.innerHTML = "AUTHENTICATING...";
  authButton.disabled = true;
  passwordInput.disabled = true;

  // Simulate authentication delay
  setTimeout(() => {
    // Grant access for any valid credentials
    authButton.innerHTML = "ACCESS GRANTED";
    authButton.style.backgroundColor = "#00ff41";
    authButton.style.color = "#000";

    const step4 = document.getElementById('status-step-4');
    if (step4) {
      setStepSuccess(step4, "[✓]", "FULL ACCESS GRANTED");
    }

    // Transition to dashboard
    setTimeout(() => {
      transitionToDashboard(username);
    }, 1500);
  }, 2000);
}

function transitionToDashboard(username) {
  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');

  loginView.style.opacity = '0';

  setTimeout(() => {
    loginView.classList.add('hidden');
    dashboardView.classList.remove('hidden');

    void dashboardView.offsetWidth;

    dashboardView.style.opacity = '1';

    // Update username in topbar
    const loggedUsernameSpan = document.getElementById('loggedUsername');
    if (loggedUsernameSpan) {
      loggedUsernameSpan.textContent = username || 'Operator';
    }

    // Initialize dashboard app (only once)
    if (window.initSkyWatchApp && !window.skyWatchApp) {
      window.initSkyWatchApp();
    }
  }, 500);
}
