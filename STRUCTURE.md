# SkyWatch AI – Project Structure

## Overview
SkyWatch AI is a web-based simulation platform built for educational and training purposes.
This document explains how the project is structured and how different parts of the system
fit together.

The project follows a simple frontend–backend separation so that multiple team members
can work independently.

---

## Folder Structure

SkyWatch-AI/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/      # UI components (map, panels, controls)
│       ├── pages/           # Main screens of the app
│       ├── assets/          # Icons, images, styles
│       └── App.jsx          # Main frontend entry
│
├── backend/
│   ├── main.py              # Backend entry point
│   ├── routes/              # API routes
│   ├── services/            # Simulation & processing logic
│   └── utils/               # Helper functions
│
├── data/
│   └── sample_assets.csv    # Sample dataset for system placement
│
├── docs/
│   └── demo-flow.md         # Notes for hackathon demo
│
├── README.md
└── STRUCTURE.md

---

## How the System Works (High-Level)

1. The **frontend** handles:
   - User interface
   - Map visualization
   - Dataset upload
   - User interactions (clicks, simulations)

2. The **backend** handles:
   - Reading uploaded datasets
   - Processing system locations
   - Running simulation logic
   - Sending processed data back to the frontend

3. The **data** folder contains:
   - Example datasets for testing and demo purposes

---

## Notes for Contributors

- Keep everything abstract and educational
- Do not add real weapon names or real-world attack logic
- Follow the folder structure to avoid confusion
