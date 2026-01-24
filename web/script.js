// ==================== INITIALIZATION ====================
let map;
let markers = [];
let coverageCircles = [];
let simulationRunning = false;
let placementMode = false;
let equipmentData = [];

document.addEventListener('DOMContentLoaded', () => {
    initializeLogin();
    initializeSystemTime();
});

// ==================== LOGIN SYSTEM ====================
function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username && password) {
            authenticateUser(username);
        }
    });
}

function authenticateUser(username) {
    // Simulate authentication
    console.log(`[AUTH] User login: ${username}`);
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('dashboardPage').classList.add('active');
    document.getElementById('currentUser').textContent = username.toUpperCase();
    
    // Initialize dashboard after login
    setTimeout(() => {
        initializeMap();
        initializeSidebar();
        initializeButtons();
    }, 300);
}

// ==================== SYSTEM TIME ====================
function initializeSystemTime() {
    function updateTime() {
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const element = document.getElementById('systemTime');
        if (element) {
            element.textContent = time;
        }
    }
    
    updateTime();
    setInterval(updateTime, 1000);
}

// ==================== MAP INITIALIZATION ====================
function initializeMap() {
    // Set default center (South Asia - India centered)
    const defaultLat = 20.5937;
    const defaultLng = 78.9629;
    
    map = L.map('map', {
        center: [defaultLat, defaultLng],
        zoom: 5,
        attributionControl: false,
        maxZoom: 19,
        minZoom: 3
    });
    
    // Dark tile layer (using CartoDB Positron with modifications)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '',
        maxZoom: 19
    }).addTo(map);
    
    // Add country borders for South Asia
    addSouthAsiaBorders();
    
    // Add grid overlay
    addGridOverlay();
    
    // Add default marker at India center
    addDefaultMarker(defaultLat, defaultLng);
    
    addLogEntry('MAP', 'Cartographic systems initialized', 'success');
    addLogEntry('MAP', 'South Asia region: LOADED', 'success');
    addLogEntry('MAP', 'Country borders: ACTIVE', 'success');
    addLogEntry('MAP', 'Grid overlay: ACTIVE', 'success');
}

function addDefaultMarker(lat, lng) {
    const marker = L.circleMarker([lat, lng], {
        radius: 7,
        fillColor: '#00ff41',
        color: '#00d4ff',
        weight: 1.5,
        opacity: 0.7,
        fillOpacity: 0.6
    }).addTo(map);
    
    marker.bindPopup('<div style="color: #00ff41; font-family: monospace; font-size: 11px;">COMMAND CENTER<br/>Lat: ' + lat.toFixed(4) + '<br/>Lng: ' + lng.toFixed(4) + '</div>');
}

// South Asia country coordinates for borders
const southAsiaCountries = {
    'India': {
        bounds: [[35.5, 68.2], [7.5, 97.5]],
        color: '#00ff41',
        label: 'INDIA'
    },
    'Pakistan': {
        bounds: [[37.0, 61.0], [23.5, 77.0]],
        color: '#00d4ff',
        label: 'PAKISTAN'
    },
    'Bangladesh': {
        bounds: [[26.6, 88.0], [21.5, 92.7]],
        color: '#ffaa00',
        label: 'BANGLADESH'
    },
    'Nepal': {
        bounds: [[30.5, 80.0], [26.2, 88.2]],
        color: '#ff6b9d',
        label: 'NEPAL'
    },
    'Bhutan': {
        bounds: [[28.5, 88.7], [26.8, 92.1]],
        color: '#00ff41',
        label: 'BHUTAN'
    },
    'Sri Lanka': {
        bounds: [[7.4, 80.7], [5.8, 81.9]],
        color: '#00d4ff',
        label: 'SRI LANKA'
    }
};

function addSouthAsiaBorders() {
    // Create visual border rectangles for South Asia countries
    Object.entries(southAsiaCountries).forEach(([country, data]) => {
        const bounds = L.latLngBounds(data.bounds);
        
        // Draw border rectangle with reduced opacity for clean look
        L.rectangle(data.bounds, {
            color: data.color,
            weight: 1.5,
            opacity: 0.5,
            fill: true,
            fillColor: data.color,
            fillOpacity: 0.03,
            dashArray: '5, 5'
        }).addTo(map);
        
        // Add country label with subtle glow
        const center = bounds.getCenter();
        const label = L.marker(center, {
            icon: L.divIcon({
                className: 'country-label',
                html: `<div style="color: ${data.color}; font-family: monospace; font-size: 11px; text-shadow: 0 0 3px ${data.color}; font-weight: bold; white-space: nowrap;">${data.label}</div>`,
                iconSize: [100, 20],
                iconAnchor: [50, 10]
            })
        }).addTo(map);
    });
    
    // Add ocean label in Indian Ocean with subtle styling
    const oceanLabel = L.marker([15, 75], {
        icon: L.divIcon({
            className: 'ocean-label',
            html: `<div style="color: rgba(0, 212, 255, 0.4); font-family: monospace; font-size: 13px; text-shadow: 0 0 2px rgba(0, 212, 255, 0.6); font-weight: bold; white-space: nowrap;">INDIAN OCEAN</div>`,
            iconSize: [120, 20],
            iconAnchor: [60, 10]
        })
    }).addTo(map);
}

function addGridOverlay() {
    // Grid overlay removed for clean professional look
    // Map uses CartoDB Dark tiles which provide a clean background
}

// ==================== SIDEBAR NAVIGATION ====================
function initializeSidebar() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all items
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Add active to clicked item
            item.classList.add('active');
            
            // Show corresponding section
            const section = item.dataset.section;
            showSection(section);
        });
    });
}

function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const selectedSection = document.getElementById(`section-${sectionName}`);
    if (selectedSection) {
        selectedSection.classList.add('active');
        addLogEntry('SYSTEM', `Switched to ${sectionName.toUpperCase()} module`, 'info');
    }
}

// ==================== BUTTON HANDLERS ====================
function initializeButtons() {
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Map controls
    document.getElementById('resetMap').addEventListener('click', resetMap);
    document.getElementById('toggleGrid').addEventListener('click', toggleGrid);
    
    // Equipment placement
    document.getElementById('enablePlacement').addEventListener('click', enablePlacementMode);
    document.getElementById('cancelPlacement').addEventListener('click', cancelPlacementMode);
    
    // Simulation
    document.getElementById('simSpeed').addEventListener('input', (e) => {
        document.getElementById('speedValue').textContent = e.target.value + 'x';
    });
    document.getElementById('startSim').addEventListener('click', startSimulation);
    document.getElementById('stopSim').addEventListener('click', stopSimulation);
    
    // Test mode buttons
    const testButtons = document.querySelectorAll('.btn-test');
    testButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => runTest(index));
    });
    
    // Clear console button
    const clearBtn = document.getElementById('clearConsole');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            const activityLog = document.getElementById('activityLog');
            if (activityLog) {
                activityLog.innerHTML = '';
                addActivityLog('SYSTEM', 'Activity log cleared', 'info');
            }
        });
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        document.getElementById('dashboardPage').classList.remove('active');
        document.getElementById('loginPage').classList.add('active');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('username').focus();
        
        // Clear markers and circles
        markers.forEach(m => map.removeLayer(m));
        coverageCircles.forEach(c => map.removeLayer(c));
        markers = [];
        coverageCircles = [];
        equipmentData = [];
        
        addLogEntry('SYSTEM', 'Session terminated', 'info');
    }
}

function resetMap() {
    map.setView([20.5937, 78.9629], 5);
    addLogEntry('MAP', 'View reset to South Asia coordinates', 'info');
}

let gridVisible = true;
function toggleGrid() {
    gridVisible = !gridVisible;
    // This would require storing grid references - simplified for demo
    addLogEntry('MAP', `Grid overlay: ${gridVisible ? 'ENABLED' : 'DISABLED'}`, 'success');
}

// ==================== EQUIPMENT PLACEMENT ====================
function enablePlacementMode() {
    placementMode = true;
    document.getElementById('enablePlacement').style.display = 'none';
    document.getElementById('cancelPlacement').style.display = 'block';
    map.dragging.disable();
    map.on('click', placeEquipment);
    addLogEntry('EQUIPMENT', 'Placement mode: ACTIVATED', 'success');
}

function cancelPlacementMode() {
    placementMode = false;
    document.getElementById('enablePlacement').style.display = 'block';
    document.getElementById('cancelPlacement').style.display = 'none';
    map.dragging.enable();
    map.off('click', placeEquipment);
    addLogEntry('EQUIPMENT', 'Placement mode: CANCELLED', 'info');
}

function placeEquipment(e) {
    if (!placementMode) return;
    
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    const equipmentType = document.getElementById('equipmentType').value;
    const coverageRadius = parseFloat(document.getElementById('coverageRadius').value);
    
    // Create marker
    const markerColor = getEquipmentColor(equipmentType);
    const marker = L.circleMarker([lat, lng], {
        radius: 6,
        fillColor: markerColor,
        color: '#00d4ff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
    }).addTo(map);
    
    // Add popup
    const equipmentName = `${equipmentType.toUpperCase()}-${markers.length + 1}`;
    marker.bindPopup(`<div style="color: #00ff41; font-family: monospace; font-size: 11px;">
        <strong>${equipmentName}</strong><br/>
        Type: ${equipmentType}<br/>
        Coverage: ${coverageRadius}km<br/>
        Lat: ${lat.toFixed(4)}<br/>
        Lng: ${lng.toFixed(4)}
    </div>`);
    
    // Create coverage circle with subtle styling
    const meterRadius = coverageRadius * 1000;
    const circle = L.circle([lat, lng], {
        radius: meterRadius,
        color: markerColor,
        fillColor: markerColor,
        weight: 1,
        opacity: 0.2,
        fillOpacity: 0.05,
        dashArray: '5, 5'
    }).addTo(map);
    
    markers.push(marker);
    coverageCircles.push(circle);
    
    // Store equipment data
    equipmentData.push({
        name: equipmentName,
        type: equipmentType,
        lat: lat,
        lng: lng,
        radius: coverageRadius
    });
    
    // Update equipment list
    updateEquipmentList();
    updateStats();
    
    addLogEntry('EQUIPMENT', `${equipmentName} placed at (${lat.toFixed(4)}, ${lng.toFixed(4)})`, 'success');
}

function getEquipmentColor(type) {
    const colors = {
        'sensor': '#00ff41',
        'relay': '#00d4ff',
        'hub': '#ffaa00',
        'monitor': '#ff0055'
    };
    return colors[type] || '#00ff41';
}

function updateEquipmentList() {
    const list = document.getElementById('equipmentList');
    list.innerHTML = '';
    
    equipmentData.forEach((equipment, index) => {
        const div = document.createElement('div');
        div.className = 'equipment-item';
        div.innerHTML = `
            <div class="equipment-item-text">
                <div class="equipment-item-name">${equipment.name}</div>
                <div class="equipment-item-details">Type: ${equipment.type} | Coverage: ${equipment.radius}km</div>
            </div>
            <button class="btn-remove" onclick="removeEquipment(${index})">REMOVE</button>
        `;
        list.appendChild(div);
    });
}

function removeEquipment(index) {
    if (equipmentData[index]) {
        const equipment = equipmentData[index];
        map.removeLayer(markers[index]);
        map.removeLayer(coverageCircles[index]);
        equipmentData.splice(index, 1);
        markers.splice(index, 1);
        coverageCircles.splice(index, 1);
        updateEquipmentList();
        updateStats();
        addLogEntry('EQUIPMENT', `${equipment.name} removed from deployment`, 'info');
    }
}

// ==================== SIMULATION ====================
function startSimulation() {
    if (simulationRunning) return;
    
    simulationRunning = true;
    document.getElementById('startSim').style.display = 'none';
    document.getElementById('stopSim').style.display = 'block';
    
    const speed = parseInt(document.getElementById('simSpeed').value);
    
    addLogEntry('SIM', 'Simulation started', 'success');
    addLogEntry('SIM', `Speed: ${speed}x`, 'success');
    
    let iteration = 0;
    const simInterval = setInterval(() => {
        if (!simulationRunning) {
            clearInterval(simInterval);
            return;
        }
        
        iteration++;
        const timestamp = new Date().toLocaleTimeString();
        const activities = [
            'Signal strength monitoring: NORMAL',
            'Packet loss rate: 0.02%',
            'Network latency: 12ms',
            'Coverage optimization: IN PROGRESS',
            'System load: 42%',
            'Data throughput: 1.2 Gbps'
        ];
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        addLogEntry('SIM', `[${timestamp}] ${randomActivity}`, 'info');
        
        // Update stats
        if (iteration % 3 === 0) {
            document.getElementById('coverageValue').textContent = 
                (70 + Math.random() * 20).toFixed(1) + '%';
        }
    }, 2000 / speed);
}

function stopSimulation() {
    simulationRunning = false;
    document.getElementById('startSim').style.display = 'block';
    document.getElementById('stopSim').style.display = 'none';
    addLogEntry('SIM', 'Simulation terminated', 'info');
}

// ==================== TEST MODE ====================
function runTest(testIndex) {
    const testNames = [
        'CONNECTIVITY TEST',
        'SECURITY SCAN',
        'PERFORMANCE TEST',
        'COVERAGE ANALYSIS'
    ];
    
    addLogEntry('TEST', `Starting: ${testNames[testIndex]}`, 'info');
    
    const testLog = document.getElementById('testLog');
    
    const tests = [
        // Connectivity Test
        [
            'Pinging nodes... [OK]',
            'Checking latency... 45ms [OK]',
            'Verifying bandwidth... 100 Mbps [OK]',
            'Testing failover... [OK]',
            'Result: PASSED ✓'
        ],
        // Security Scan
        [
            'Scanning for vulnerabilities... [OK]',
            'Checking encryption status... [OK]',
            'Verifying authentication protocols... [OK]',
            'Analyzing packet integrity... [OK]',
            'Result: PASSED ✓'
        ],
        // Performance Test
        [
            'Measuring throughput... 1.2 Gbps [OK]',
            'Checking response time... 15ms [OK]',
            'CPU usage: 32% [OK]',
            'Memory usage: 54% [OK]',
            'Result: PASSED ✓'
        ],
        // Coverage Analysis
        [
            'Analyzing signal distribution... [OK]',
            'Checking coverage gaps... None found [OK]',
            'Verifying redundancy... 95% [OK]',
            'Optimization opportunities: 5',
            'Result: PASSED ✓'
        ]
    ];
    
    const testSteps = tests[testIndex];
    let stepIndex = 0;
    
    const testInterval = setInterval(() => {
        if (stepIndex < testSteps.length) {
            addLogEntry('TEST', testSteps[stepIndex], stepIndex === testSteps.length - 1 ? 'success' : 'info');
            stepIndex++;
        } else {
            clearInterval(testInterval);
        }
    }, 600);
}

// ==================== LOGGING ====================
function addLogEntry(system, message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const logDiv = document.getElementById('simLog') || createSimLog();
    
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${timestamp}] ${system}: ${message}`;
    
    logDiv.appendChild(entry);
    logDiv.scrollTop = logDiv.scrollHeight;
    
    // Keep only last 20 entries
    const entries = logDiv.querySelectorAll('.log-entry');
    if (entries.length > 20) {
        entries[0].remove();
    }
    
    // Also log to activity console
    addActivityLog(system, message, type);
}

function addActivityLog(system, message, type = 'info') {
    const activityLog = document.getElementById('activityLog');
    if (!activityLog) return;
    
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${timestamp}] ${system}: ${message}`;
    
    activityLog.appendChild(entry);
    activityLog.scrollTop = activityLog.scrollHeight;
    
    // Keep only last 50 entries
    const entries = activityLog.querySelectorAll('.log-entry');
    if (entries.length > 50) {
        entries[0].remove();
    }
}

function createSimLog() {
    const div = document.createElement('div');
    div.id = 'simLog';
    div.className = 'console-output';
    document.querySelector('.section.active').appendChild(div);
    return div;
}

// ==================== STATS UPDATES ====================
function updateStats() {
    document.getElementById('activeCount').textContent = markers.length;
    document.getElementById('equipmentStatusStat').textContent = markers.length;
    
    if (markers.length > 0) {
        // Calculate average coverage
        const totalCoverage = equipmentData.reduce((sum, eq) => sum + eq.radius, 0);
        const avgCoverage = (totalCoverage / equipmentData.length).toFixed(0);
        document.getElementById('coverageValue').textContent = avgCoverage + ' km';
    } else {
        document.getElementById('coverageValue').textContent = '0 km';
    }
}

// ==================== UTILITY FUNCTIONS ====================
function getRandomCoords() {
    // Generate random coordinates within South Asia region
    const baseX = 20.5937;
    const baseY = 78.9629;
    const offsetLat = 10;
    const offsetLng = 12;
    
    return {
        lat: baseX + (Math.random() - 0.5) * offsetLat,
        lng: baseY + (Math.random() - 0.5) * offsetLng
    };
}

// Initialize analysis section on load
document.addEventListener('DOMContentLoaded', () => {
    addLogEntry('SYSTEM', 'SkyWatch AI Command Center initialized', 'success');
    addLogEntry('SYSTEM', 'Authentication system: READY', 'success');
    addLogEntry('SYSTEM', 'Map services: READY', 'success');
    addLogEntry('SYSTEM', 'All systems operational', 'success');
});
