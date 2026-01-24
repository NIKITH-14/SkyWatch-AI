# 🚀 Quick Start Guide - SkyWatch AI Command Center

## What You Have

A complete, production-ready South Asia strategic command center simulation dashboard.

**Three files:**
- `index.html` - Dashboard structure
- `style.css` - Dark hacker-theme styling  
- `script.js` - All functionality

## How to Run (3 Steps)

### Step 1: Prepare Files
Place all three files in the same folder:
```
folder/
├── index.html
├── style.css
└── script.js
```

### Step 2: Open Browser
- Double-click `index.html`
- OR right-click → "Open with" → Choose your browser
- OR drag file into browser window

### Step 3: Login
- **Username**: Enter any text (or just "admin")
- **Password**: Enter any text (or just "admin")
- Click **INITIALIZE ACCESS**

## What to Try First

### 1. **Explore the Map** (Dashboard tab - selected by default)
- See South Asia region with country borders
- Color-coded: India (green), Pakistan (cyan), Bangladesh (orange), Nepal (pink), Bhutan (green), Sri Lanka (cyan)
- Zoom in/out with scroll wheel
- Click reset button to return to default view

### 2. **Place Equipment** (Left sidebar)
- Click "PLACE EQUIPMENT" in the menu
- Select equipment type: Sensor Node, Relay Station, Command Hub, or Monitoring Station
- Set coverage radius (1-50 km)
- Click "ACTIVATE PLACEMENT MODE"
- **Click on map** to place systems
- Watch coverage circles appear with neon glow
- Equipment list updates automatically
- See real-time stats update (Active count, Coverage)

### 3. **Run Simulation** (Left sidebar)
- Go to "SIMULATE" 
- Adjust speed slider (1x = slow, 10x = fast)
- Choose scenario (Standard, Adverse, Peak Load, Stress Test)
- Click "START SIMULATION"
- Watch real-time console logs below
- Shows network activity, latency, throughput
- Click "STOP SIMULATION" to end

### 4. **Test Systems** (Left sidebar)
- Go to "TEST MODE"
- Click any test button:
  - Connectivity Test
  - Security Scan
  - Performance Test
  - Coverage Analysis
- See detailed results in console
- All show PASSED status ✓

### 5. **View Analytics** (Left sidebar)
- Go to "ANALYSIS"
- See 4 analytics cards:
  - System Uptime: 99.8%
  - Coverage Efficiency: 85%
  - Equipment Status: Shows count
  - Data Processed: 1.2M req/hr
- Detailed log below shows all system events

### 6. **Create Strategy** (Left sidebar)
- Go to "CREATE STRATEGY"
- Enter strategy name
- Set coverage area (km²)
- Choose priority level
- Click "CREATE STRATEGY"

## Key Features

✅ **Dark Hacker Theme** - Neon green/blue on black  
✅ **South Asia Focus** - India centered with 6 countries visible  
✅ **Interactive Map** - Leaflet.js powered, zoom/pan works  
✅ **Real Equipment Placement** - Click map, drag coverage radius circles  
✅ **Live Simulations** - Run with variable speed  
✅ **Testing Suite** - 4 different test types  
✅ **Analytics Dashboard** - Real-time stats and logs  
✅ **No Backend Needed** - Everything works offline  
✅ **Educational Content** - Abstract, no real military data  
✅ **Terminal Style UI** - Monospace font, grid overlay  

## Visual Highlights

🎨 **Status Bar** - Shows: SYSTEM ONLINE | USER | TIME | LOGOUT button  
🎯 **Glowing Buttons** - Neon green on hover with shadow effects  
📊 **Coverage Circles** - Dashed neon circles showing system range  
📍 **Country Labels** - Labeled with color-coded borders  
🌊 **Ocean Label** - "INDIAN OCEAN" visible in maritime area  
⚡ **Animations** - Pulsing indicators, scan line effect  
💻 **Console Logs** - Green monospace text like terminal  

## Controls

| Action | How |
|--------|-----|
| Zoom Map | Scroll wheel |
| Pan Map | Click & drag |
| Place Equipment | Click on map (after activation) |
| Change Section | Click sidebar menu items |
| Adjust Speed | Drag slider in Simulate |
| Run Tests | Click test buttons |
| Cancel Equipment Mode | Click "CANCEL PLACEMENT" |
| Logout | Click logout button (top right) |
| Remove Equipment | Click "REMOVE" next to item in list |

## Demo Credentials

**Any username/password works!** Examples:
- admin / admin
- test / test
- user123 / pass123
- (nothing required, just click through)

## Customization Ideas

### Change Colors
Edit `style.css` line 10-14:
```css
--accent-green: #00ff41;    /* Change this */
--accent-blue: #00d4ff;     /* Change this */
--accent-red: #ff0055;      /* Change this */
```

### Change Map Region
Edit `script.js` line 66-67:
```javascript
const defaultLat = 20.5937;  // Change to new latitude
const defaultLng = 78.9629;  // Change to new longitude
```

### Modify Equipment Types
Edit `script.js` line 211 in the `placeEquipment()` function to add new types

## Browser Compatibility

✅ Chrome/Chromium (recommended)  
✅ Firefox  
✅ Safari  
✅ Edge  

Requires JavaScript enabled and modern browser (2020+)

## Troubleshooting

**Map not showing?**
- Check internet connection (needed for map tiles)
- Try zooming in/out
- Refresh the page

**Equipment not placing?**
- Make sure you clicked "ACTIVATE PLACEMENT MODE"
- Click directly on the map area
- Check that zoom level allows placement

**Console errors?**
- Try different browser
- Clear browser cache
- Ensure all 3 files are in same folder

**Buttons not responding?**
- Ensure JavaScript is enabled
- Try refreshing page
- Check browser console (F12) for errors

## File Sizes

- `index.html` - ~10 KB
- `style.css` - ~25 KB  
- `script.js` - ~20 KB
- **Total**: ~55 KB (very lightweight!)

## No Internet Requirements

The dashboard works completely offline EXCEPT:
- Map tiles need internet (but work if internet drops briefly)
- No backend server needed
- All logic runs in your browser

## Pro Tips

💡 Use keyboard F12 to open developer tools and see console logs  
💡 Right-click map for context menu (browser default)  
💡 Each equipment type has different color coding  
💡 Hover over buttons to see glow effect  
💡 Simulation logs persist while running  
💡 Stats update in real-time as you place equipment  

## What's NOT Included

❌ No real military data  
❌ No weapon simulations  
❌ No real coordinates or locations  
❌ No backend/database  
❌ No login persistence  
❌ No file saving  

All systems are abstract and educational.

---

**Ready to demo?** Open `index.html` and start exploring! 🚀
