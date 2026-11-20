# Vasundhara AI — Smart Environmental Monitoring for a Cleaner Tomorrow

Vasundhara AI is an environmental intelligence web application that identifies public litter, records precise geographical coordinates, clusters recurring pollution hotspots, and prioritizes municipal cleanup activities.

Built as a pure software solution without physical sensors, the platform combines OpenStreetMap GIS mapping, a persistent FastAPI backend, data visualization, and optional locally configured YOLO inference.

---

## 1. Key Features & Page Directory

The application includes the following core platform interfaces:

1. **Landing Page (`/`)**:
   - Executive overview of Vasundhara AI's mission and civic methodology.
   - Primary and secondary CTAs (*"Report Litter"*, *"Explore Pollution Map"*).
   - Database-backed counters for reports, completed cleanups, estimated collected waste, and recurring hotspots.
   - 4-step civic-to-municipal operational workflow.
   - Core technological capabilities and institutional footer.

2. **User Dashboard (`/dashboard`)**:
   - Overview of citizen-submitted pollution reports.
   - Real-time status indicators (Under Review, Scheduled, Cleaned).
   - Recent report cards with addresses, GPS coordinates, and relative time stamps.
   - Report-resolution progress for the signed-in citizen account.
   - Floating quick-action button to submit new reports.

3. **Report Litter Portal (`/report`)**:
   - Drag-and-drop photographic evidence uploader with instant image preview.
   - Interactive Leaflet map location picker (click anywhere to pin or use browser GPS).
   - Incident description, primary material classification, and estimated weight (kg).
   - Server-side photo storage and model-backed analysis when trained YOLO weights are configured; manual classification remains available without weights.

4. **Pollution & Hotspot Map (`/map`)**:
   - Fullscreen Leaflet and OpenStreetMap GIS exploration.
   - Distinct marker styles based on incident severity:
     - **Critical / High Impact**: Crimson pin with urgent indicator.
     - **Moderate Impact**: Amber pin with hazard indicator.
     - **Low Impact**: Emerald pin with circle indicator.
   - Interactive report popups with photographic thumbnails, status badges, and metadata.
   - Dynamic hotspot risk buffer zones (circular recurrence radius).
   - Toggle between interactive GIS map view and filterable list/card view.
   - Multi-dimensional filters (severity, status, material category, and search query).

5. **My Submissions & History (`/my-reports`)**:
   - Personal historical ledger of user-submitted litter incidents.
   - Status tracking from submission through municipal verification to certified cleanup.
   - Detailed modal inspector showing GPS coordinates, material classification, and detection results.

6. **Admin Command Center (`/admin`)**:
   - High-level municipal operations dashboard.
   - Analytical KPI metric cards (Total Submissions, Pending Verification, Active Cleanups, Certified Cleared).
   - Interactive Recharts area chart displaying 6-month pollution trends versus cleanup resolutions.
   - Material composition donut chart showing percentages of plastic, glass, metal, and hazardous waste.
   - Actionable queue allowing municipal officers to verify reports or schedule cleanups with one click.
   - Top priority hotspot summary.

7. **Hotspot Intelligence Engine (`/hotspots`)**:
   - Ranked pollution recurrence clusters ordered by algorithmic **Priority Score (0 - 100)**.
   - Recurrence frequency counts, dominant waste types, and environmental risk analysis.
   - Recommended municipal interventions (e.g., bin installations, bi-weekly sweep schedules).
   - Dynamic sorting by Priority Score, Recurrence Frequency, or Most Recent Incident.

8. **Cleanup Operations Hub (`/cleanups`)**:
   - Dispatch task ledger categorized into *All Operations*, *Pending Dispatch*, *In Progress*, and *Completed & Certified*.
   - Crew assignment modal (assign squads and execution dates).
   - Status updater (mark tasks in-progress or certified clean).
   - **Before-and-After Photographic Verification Viewer** for incontrovertible completion audits.

9. **Super-Admin Portal (`/superadmin`)**:
   - Register municipalities using verified boundary GeoJSON and source metadata.
   - Create municipal administrators with optional ward/zone scopes.
   - Review reports awaiting jurisdiction assignment and inspect the platform audit log.

Authentication is role-based: citizen reporting and personal history require a citizen account; municipal operations require a municipal administrator or super-admin account. The public map and hotspot data use privacy-limited endpoints.

---

## 2. Design System & Aesthetic Direction

Vasundhara AI implements a professional, light-themed environmental technology design system:
- **Primary Color:** Deep Forest Green (`#184730`)
- **Backgrounds:** Warm off-white (`#FAFBF7`, `#F4F5ED`)
- **Secondary Colors:** Muted Sage Green (`#758F71`, `#E8EDE7`)
- **Typography:** Deep Charcoal (`#1E293B`, `#334155`) with Inter & Manrope typefaces.
- **Accents:** Subtle Lime (`#65A30D`, `#84CC16`) for priority metrics and environmental callouts.
- **Severity Alerts:** Emerald (`#059669`), Amber (`#D97706`), and Crimson (`#E11D48`).
- **Responsive Layout:** Adaptive layouts for mobile, tablet, and wide desktop screens.

---

## 3. Technology Stack

- **Frontend:** React 18, Vite, React Router v6
- **Styling:** Tailwind CSS, PostCSS, Autoprefixer
- **Mapping & GIS:** Leaflet 1.9, React Leaflet, OpenStreetMap
- **Data Visualization:** Recharts (AreaChart, PieChart, ResponsiveContainer)
- **Icons:** Lucide React
- **Backend:** FastAPI, SQLAlchemy, SQLite by default, PostgreSQL support through `DATABASE_URL`, and local image storage.
- **Service Architecture:** Modular API service wrappers connected to persistent backend endpoints.

---

## 4. Installation & Execution Guide

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- Python (3.10 or higher)

### Start the backend

From the `backend` directory:
   ```bash
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   Copy-Item .env.example .env
   # Edit .env and set ECOWATCH_SUPERADMIN_EMAIL and a private
   # ECOWATCH_SUPERADMIN_PASSWORD (at least 12 characters).
   uvicorn app.main:app --reload --port 8001
   ```

The API creates `backend/ecowatch.db` and its tables on startup. The configured super-admin is created on the first startup; no default credentials are provided. Open `http://localhost:8001/docs` to explore the API.

### Start the frontend

In another terminal, from the project root:
   ```bash
   npm install
   npm run dev
   ```

Open `http://localhost:3000`. The Vite development server proxies API and uploaded-image requests to `http://localhost:8001`. Citizens can register from **Sign in**; municipal administrators are created by the super-admin from `/superadmin`.

### Jurisdiction setup

Before real submissions can be assigned, sign in as the super-admin and register each municipality with its authoritative Polygon or MultiPolygon GeoJSON and a traceable boundary source. Do not use sample/test geometry as municipal boundaries. Reports whose coordinates cannot be assigned unambiguously remain private and jurisdiction-pending until reviewed. Municipal administrators can only access the municipality and wards/zones assigned to their account; the public map uses a separate, privacy-limited API.

### Building for Production
To create an optimized production build:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

---

## 5. Backend and computer vision

- Reports, photo URLs, cleanup operations, hotspots, and analytics use the live API under `/api/v1`.
- Reports and before/after photos are saved on the backend, not in browser localStorage.
- Hotspots are derived from reports within 300 meters; only repeated clusters are listed. Priority combines report recurrence, severity, and age.
- Cleanup completion requires an after photo and updates the linked report status.
- SQLite is the no-configuration default. PostgreSQL can be selected with `DATABASE_URL`; see [backend/README.md](./backend/README.md).
- AI inference is optional: install `backend/requirements-ai.txt` and set `YOLO_MODEL_PATH` to an existing model trained for waste/litter classes. The API does not claim detections when the detector is unavailable. Model training/dataset preparation is not included.

