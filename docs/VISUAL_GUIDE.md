# 🎮 VISUAL GUIDE - SkyWatch AI Command Center

## 📱 Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  SYSTEM STATUS: ONLINE │ USER: ADMIN │ 14:35:22 │ [LOGOUT]      │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐  ┌──────────────────────────────────────┐  │
│  │   OPERATIONS    │  │                                        │  │
│  ├─────────────────┤  │  SOUTH ASIA COMMAND CENTER           │  │
│  │ ⚙ DASHBOARD   ◄│  │  [Interactive Map with borders]       │  │
│  │ 📋 STRATEGY    │  │                                        │  │
│  │ 📍 EQUIPMENT   │  │  [Map Controls: Reset / Grid Toggle]  │  │
│  │ ▶ SIMULATE     │  │                                        │  │
│  │ 🧪 TEST MODE  │  │                                        │  │
│  │ 📊 ANALYSIS    │  │                                        │  │
│  ├─────────────────┤  └──────────────────────────────────────┘  │
│  │ ACTIVE:    0    │                                             │
│  │ COVERAGE: 0 km  │                                             │
│  └─────────────────┘                                             │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## 🎨 Color & Style Reference

### Primary Colors
```
Dark Background:   #0a0e27 ████████████████████████████
Neon Green:        #00ff41 ████████████████████████████
Neon Cyan:         #00d4ff ████████████████████████████
Neon Red:          #ff0055 ████████████████████████████
Orange Accent:     #ffaa00 ████████████████████████████
Pink Accent:       #ff6b9d ████████████████████████████
```

### Typography
```
Font Family: Courier New, monospace
Font Sizes:
  - Headers: 14-32px
  - Body: 11-13px
  - Labels: 10-12px
  - Mono: 9-13px
```

### Effects
```
Glow Effect:      text-shadow: 0 0 10px rgba(0, 255, 65, 0.5)
Border Glow:      box-shadow: 0 0 15px rgba(0, 255, 65, 0.6)
Scan Lines:       Repeating linear gradient animation
Grid Pattern:     Dashed border grid overlay
Button Hover:     Background fill + glow effect
```

---

## 🗺️ Map View Details

### South Asia Regional Map
```
┌──────────────────────────────────────────────────────┐
│        SOUTH ASIA COMMAND CENTER - OPERATIONS MAP    │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │                                                │ │
│  │    ╔═════════════════════════════════╗        │ │
│  │    ║  BHUTAN          BANGLADESH     ║        │ │
│  │    ║      NEPAL   INDIA              ║        │ │
│  │    ║           PAKISTAN              ║        │ │
│  │    ║                                 ║        │ │
│  │    ║          SRI LANKA              ║        │ │
│  │    ╠═════════════════════════════════╣        │ │
│  │    ║    INDIAN OCEAN                 ║        │ │
│  │    └═════════════════════════════════┘        │ │
│  │                                                │ │
│  │                      🎯 [Reset]  ▦ [Grid]    │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘

Legend:
  🟢 = India (Neon Green)
  🔵 = Pakistan (Cyan Blue)
  🟠 = Bangladesh (Orange)
  💗 = Nepal (Pink)
  🟢 = Bhutan (Neon Green)
  🔵 = Sri Lanka (Cyan Blue)
  🌊 = Indian Ocean
```

### Equipment Placement Example
```
┌─────────────────────────────────────────┐
│  PLACE EQUIPMENT                        │
├─────────────────────────────────────────┤
│                                         │
│  Equipment Type: [SENSOR NODE]▼        │
│  Coverage Radius: [5 km]                │
│  [ACTIVATE PLACEMENT MODE] [CANCEL]    │
│                                         │
│  PLACED EQUIPMENT                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │
│  ✓ SENSOR-1: Type: sensor | 5km [X]   │
│  ✓ RELAY-1:  Type: relay | 10km [X]   │
│  ✓ HUB-1:    Type: hub | 15km [X]      │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📊 Dashboard Sections Visual

### 1. DASHBOARD (Map View)
```
┌─────────────────────────────────────────┐
│  SOUTH ASIA COMMAND CENTER - OPS MAP    │
├─────────────────────────────────────────┤
│                                         │
│  [Full interactive Leaflet map]         │
│  - Dark tiles                           │
│  - Country borders                      │
│  - Equipment markers                    │
│  - Coverage circles                     │
│  - Grid overlay                         │
│                                         │
│              🎯 ▦                       │
│                                         │
└─────────────────────────────────────────┘
```

### 2. CREATE STRATEGY
```
┌─────────────────────────────────────────┐
│  CREATE STRATEGY                        │
├─────────────────────────────────────────┤
│                                         │
│  STRATEGY NAME                          │
│  [______________________]               │
│                                         │
│  COVERAGE AREA (km²)                    │
│  [100___________________]               │
│                                         │
│  PRIORITY LEVEL                         │
│  [HIGH_______________]▼                │
│                                         │
│  [CREATE STRATEGY]                      │
│                                         │
└─────────────────────────────────────────┘
```

### 3. PLACE EQUIPMENT
```
┌─────────────────────────────────────────┐
│  PLACE EQUIPMENT                        │
├─────────────────────────────────────────┤
│                                         │
│  Equipment Type: [SENSOR NODE▼]         │
│  Coverage Radius: [5]                   │
│  [ACTIVATE PLACEMENT MODE]              │
│                                         │
│  PLACED EQUIPMENT                       │
│  ✓ SENSOR-1   Type: sensor | 5km [X]   │
│  ✓ RELAY-1    Type: relay | 10km [X]   │
│                                         │
└─────────────────────────────────────────┘
```

### 4. SIMULATE
```
┌─────────────────────────────────────────┐
│  SIMULATION ENGINE                      │
├─────────────────────────────────────────┤
│                                         │
│  SIMULATION SPEED                       │
│  ▓▓▓▓▓░░░░░ 5x                         │
│                                         │
│  SCENARIO                               │
│  [STANDARD DEPLOYMENT▼]                 │
│                                         │
│  [START SIMULATION] [STOP]              │
│                                         │
│  [14:35:22] SIM: Simulation started    │
│  [14:35:23] SIM: Speed: 5x             │
│  [14:35:24] SIM: Signal strength: OK   │
│  [14:35:25] SIM: Network latency: 12ms│
│                                         │
└─────────────────────────────────────────┘
```

### 5. TEST MODE
```
┌─────────────────────────────────────────┐
│  TEST MODE                              │
├─────────────────────────────────────────┤
│                                         │
│  [RUN CONNECTIVITY TEST]                │
│  [RUN SECURITY SCAN]                    │
│  [RUN PERFORMANCE TEST]                 │
│  [RUN COVERAGE ANALYSIS]                │
│                                         │
│  [14:35:22] TEST: Pinging nodes... OK  │
│  [14:35:23] TEST: Checking latency... OK
│  [14:35:24] TEST: Verifying bandwidth..
│  [14:35:25] TEST: Testing failover... OK
│  [14:35:26] TEST: Result: PASSED ✓     │
│                                         │
└─────────────────────────────────────────┘
```

### 6. ANALYSIS
```
┌─────────────────────────────────────────┐
│  DATA ANALYSIS                          │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────┐  ┌──────────┐            │
│  │UPTIME    │  │COVERAGE  │            │
│  │  99.8%   │  │   85%    │            │
│  │▓▓▓▓▓▓▓▓▓▓│  │▓▓▓▓▓▓▓▓▓░│            │
│  └──────────┘  └──────────┘            │
│                                         │
│  ┌──────────┐  ┌──────────┐            │
│  │EQUIPMENT │  │DATA      │            │
│  │    3     │  │  1.2M    │            │
│  │ units ops│  │req/hour  │            │
│  └──────────┘  └──────────┘            │
│                                         │
│  DETAILED LOG                           │
│  [14:35:22] System initialization      │
│  [14:35:23] Auth system: READY         │
│  [14:35:24] Map services: READY        │
│  [14:35:25] All systems operational    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔐 Login Page Layout

```
┌─────────────────────────────────────────┐
│                                         │
│         ╔═══════════════════╗           │
│         ║   SKYWATCH AI     ║           │
│         ║ COMMAND CENTER    ║           │
│         ║   ACCESS PROTOCOL ║           │
│         ║         ●         ║           │
│         ╠═══════════════════╣           │
│         ║                   ║           │
│         ║ USER ID           ║           │
│         ║ [________________]║           │
│         ║                   ║           │
│         ║ PASSWORD          ║           │
│         ║ [________________]║           │
│         ║                   ║           │
│         ║ [INITIALIZE ACCESS]          │
│         ║                   ║           │
│         ║ SECURE PROTOCOL   ║           │
│         ║ Demo: any user/pwd║           │
│         ╚═══════════════════╝           │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📈 Button States

### Normal Button
```
┌──────────────────────┐
│ BUTTON TEXT          │
└──────────────────────┘
```

### Hover Button
```
┌──────────────────────┐
│ BUTTON TEXT          │ ✨ Glow effect
└──────────────────────┘ (Background fill + shadow)
```

### Active Button
```
┌──────────────────────┐
│ ● BUTTON TEXT   ─┐   │ (Indicator bar)
└──────────────────────┘ (Highlighted)
```

---

## 🎮 Interactive Elements

### Input Fields
```
Label Text
[Input field with border]
  ↑ Focus shows glow
  ↑ Placeholder text fades in
  ↑ Border becomes bright green
```

### Dropdown Selector
```
Label Text
[Selected Option▼]
```

### Sliders
```
Label Text
▓▓▓▓▓░░░░░ Value
```

### Checkboxes & Lists
```
✓ Item 1 - Type: sensor | Coverage: 5km [X]
✓ Item 2 - Type: relay  | Coverage: 10km [X]
```

---

## 📊 Console Log Styling

### Success Entry
```
[14:35:22] SYSTEM: Operation completed ✓
            ↑        ↑       ↑            ↑
        Timestamp  System  Message    Green color
```

### Info Entry
```
[14:35:23] MAP: Grid overlay: ENABLED
            ↑    ↑     ↑          ↑
        Timestamp System Message Blue color
```

### Error Entry
```
[14:35:24] TEST: Connection failed
            ↑    ↑       ↑          ↑
        Timestamp System Message Red color
```

---

## 🎨 Animation Effects

### Scan Lines (Repeating)
```
█████████████████████  (opacity: 0.15)
░░░░░░░░░░░░░░░░░░░░  (moving down)
█████████████████████
░░░░░░░░░░░░░░░░░░░░  (refresh every 8s)
```

### Pulsing Indicator
```
Frame 1: ● (full bright)
Frame 2: ◐ (medium)
Frame 3: ○ (fading)
Frame 4: ◑ (coming back)
         → Loop continues
```

### Glitch Animation
```
SKYWATCH AI
S╱K╲WATCH AI    (offset text)
SKYWATCH A╱I    (creates glitch effect)
SKYWATCH AI    (returns to normal)
```

---

## 🌐 Responsive Breakpoints

### Desktop (1024px+)
```
Full sidebar | Full content area
All features visible
Optimal experience
```

### Tablet (768px-1023px)
```
Sidebar adapts | Content adjusts
Some features may scroll
Responsive layout
```

### Mobile (< 768px)
```
Sidebar stacks | Single column
Limited map view
Touch-optimized
```

---

## 🚨 Status Indicators

### System Online
```
● ONLINE     (green, pulsing)
```

### System Offline
```
○ OFFLINE    (red, static)
```

### Equipment Status
```
✓ Active     (green checkmark)
! Warning    (yellow triangle)
✗ Failed     (red X)
```

---

## 📍 Map Markers

### Equipment Markers
```
Sensor Node:     ● Green dot
Relay Station:   ● Cyan dot
Command Hub:     ● Orange dot
Monitoring:      ● Red dot
```

### Coverage Circles
```
Color: Matches equipment
Style: Dashed border
Fill: Semi-transparent
Glow: Neon effect
```

---

## 🎯 User Flow Diagram

```
START
  ↓
[LOGIN PAGE]
  ↓
[ENTER CREDENTIALS] → [AUTHENTICATE]
  ↓
[DASHBOARD]
  ├→ [PLACE EQUIPMENT] → [CLICK MAP] → [ADD MARKERS]
  ├→ [SIMULATE] → [START] → [LOGS]
  ├→ [TEST MODE] → [CHOOSE TEST] → [RESULTS]
  ├→ [ANALYSIS] → [VIEW STATS]
  ├→ [CREATE STRATEGY] → [FORM SUBMIT]
  └→ [LOGOUT] → [LOGIN PAGE]
```

---

## 💻 Code Layout (File Structure)

### index.html Structure
```
<html>
  <head>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="leaflet.css">
  </head>
  <body>
    <div id="loginPage">
      <!-- Login form -->
    </div>
    
    <div id="dashboardPage">
      <div class="top-bar"><!-- Status bar --></div>
      <div class="main-content">
        <div class="sidebar"><!-- Menu --></div>
        <div class="content-area">
          <!-- 6 Sections -->
        </div>
      </div>
    </div>
    
    <script src="leaflet.js"></script>
    <script src="script.js"></script>
  </body>
</html>
```

### CSS Structure
```
style.css
├── Global Styles
├── Scan Lines Effect
├── Login Page
├── Dashboard Layout
├── Sidebar
├── Content Areas
├── Forms & Inputs
├── Buttons
├── Map Container
├── Console
├── Analytics
├── Leaflet Overrides
└── Responsive Design
```

### JavaScript Structure
```
script.js
├── Initialization
├── Login System
├── System Time
├── Map Functions
├── Sidebar Navigation
├── Button Handlers
├── Equipment Placement
├── Simulations
├── Testing Suite
├── Logging System
├── Statistics
└── Utilities
```

---

**Visual guide complete! Open `index.html` to see all these elements in action.** 🎮
