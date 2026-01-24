# SkyWatch AI

SkyWatch AI is a web-based simulation and visualization platform designed for
education and training in monitoring, movement tracking, and emergency response
decision-making.

The platform allows users to place abstract systems on a map, create and control
abstract flying objects, and visualize how monitoring and response systems behave
in different scenarios.

⚠️ This project is strictly educational and non-operational.
It does NOT control real weapons, does NOT use real military data, and does NOT
perform real-world targeting or attacks.

All systems, objects, and scenarios are fictional and abstract.

---

## 🎯 Project Purpose

In complex environments, it is hard to understand how:
- system placement,
- coverage,
- object movement,
- and emergency response timing

work together using only static maps or documents.

SkyWatch AI provides an interactive and visual website where users can:
- experiment with system placement,
- design and move objects,
- observe detection and coverage,
- and learn how decisions affect outcomes.

The goal is learning, planning, and understanding system behavior in a safe
simulation environment.

---

## 🌐 Overall Website Flow

1. User opens the website and sees a map and a control panel.
2. User uploads a dataset that defines abstract systems (sensor nodes, stations).
3. The systems appear automatically on the map with coverage areas.
4. User runs simulations with moving objects.
5. The system visualizes detection, tracking, and response concepts.
6. The website displays results and explanations of what happened.

---

## 🧩 Feature-by-Feature Explanation

---

### 1. Dataset-Based System Placement

**What it does:**  
Users upload a dataset file (CSV or JSON) that contains a list of abstract systems.

Each system includes:
- System name (fictional)
- System type (Sensor Node, Monitoring Station, Mobile Unit)
- Latitude and longitude
- Coverage range

**How it works:**  
- The backend reads the dataset file.
- The frontend places each system as an icon on the map.
- Coverage range is drawn as a circle around each system.

**What the user sees:**  
- Small icons on the map
- Coverage zones showing how far each system can monitor

**Purpose:**  
Helps users understand how placement affects coverage.

---

### 2. Interactive Map Visualization

**What it does:**  
Shows all systems, objects, and movement on a single interactive map.

**How it works:**  
- A map (region or ocean area) is displayed.
- Systems and objects are drawn as markers.
- Paths and zones are drawn as lines and circles.

**What the user sees:**  
- A live map that updates during simulation
- Colors to show active systems and coverage

**Purpose:**  
Gives a visual understanding of the entire scenario.

---

### 3. System Detail Interaction

**What it does:**  
Allows the user to click on any system on the map.

**How it works:**  
- Clicking an icon opens a side panel.
- The panel shows:
  - Name
  - Type
  - Coverage range
  - Current status

**What the user sees:**  
A small information card about the selected system.

**Purpose:**  
Helps users inspect and understand each system individually.

---

### 4. Abstract Object Simulation (Movement Control)

**What it does:**  
Allows the user to launch and control an abstract flying object (not a weapon).

**How it works:**  
- User clicks “Start Simulation”.
- A moving object appears on the map.
- The user controls direction and speed using keyboard keys.
- The object follows a path on the map.

**What the user sees:**  
- A moving dot or 3D object
- A trail showing its path
- Speed and direction changes

**Purpose:**  
Demonstrates how objects move and how systems track them.

---

### 5. Custom Object Generator (Design Tool)

**What it does:**  
Lets the user design a custom test object by entering parameters:
- Length
- Width
- Weight
- Speed

**How it works:**  
- The system generates a simple 3D model based on the values.
- The animation reflects size and speed differences.
- The object is used in the simulation.

**What the user sees:**  
- A new object model
- Visual difference in size and movement speed

**Purpose:**  
Helps users understand how design parameters affect movement behavior.

---

### 6. Sensor and Coverage Configuration

**What it does:**  
Allows the user to adjust system settings.

**How it works:**  
The user can change:
- Detection range
- Coverage size
- Sensitivity

The map updates instantly to reflect the changes.

**What the user sees:**  
- Coverage zones grow or shrink
- Detection behavior changes

**Purpose:**  
Shows how configuration affects monitoring effectiveness.

---

### 7. Emergency Response Scenario Simulation

**What it does:**  
Simulates a time-critical safety scenario when an object does not respond to an abort command.

**How it works:**  
- System triggers an alert.
- Displays a countdown or warning message.
- Shows conceptual containment or monitoring zones.
- Suggests safe response actions visually.

No real interception or destruction is performed.

**What the user sees:**  
- Warning indicators
- Highlighted zones
- Messages such as:
  - “Abort not acknowledged”
  - “Emergency response activated”

**Purpose:**  
Teaches how automated systems assist humans during unexpected events.

---

### 8. Visual Results and Feedback

**What it does:**  
Displays the outcome of each simulation.

**How it works:**  
After simulation ends, the system shows:
- Object path
- Detection timeline
- Coverage effectiveness
- Status messages

**What the user sees:**  
Messages like:
- “Tracking successful”
- “Coverage gap detected”
- “Response delayed”

**Purpose:**  
Helps users understand what happened and why.

---

## 🧩 Key Features (Summary)

- Dataset-based system placement
- Interactive map visualization
- Clickable system details
- Abstract object launch and control
- Custom object design generator
- Sensor and coverage configuration
- Emergency response scenario simulation
- 3D animation support
- Visual feedback and explanation

---

## 🚫 What This Project Is NOT

- No real weapons
- No real missile systems
- No real country targeting
- No real interception logic
- No operational military use

All systems and objects are fictional and used only for learning and simulation.

---

## 🏗️ Hackathon Context

SkyWatch AI is built as part of a hackathon project with limited development time.
The focus is on:
- Clear visualization
- Interactive simulation
- Educational value
- Simple and clean design
- Easy demonstration

---
