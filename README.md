# EcoWatch AI — Pollution Hotspot Intelligence Platform

EcoWatch AI is an environmental intelligence web application that identifies public litter, records precise geographical coordinates, clusters recurring pollution hotspots, and prioritizes municipal cleanup activities.

Built as a pure software solution without physical sensors, the platform combines OpenStreetMap GIS mapping, data visualization, modular service architectures, and upcoming computer vision integration.

---

## 1. Key Features & Page Directory

The application includes all 8 core platform interfaces:

1. **Landing Page (`/`)**:
   - Executive overview of EcoWatch AI's mission and civic methodology.
   - Primary and secondary CTAs (*"Report Litter"*, *"Explore Pollution Map"*).
   - Real-time environmental impact counters (waste removed, hotspots tracked, resolution rates).
   - 4-step civic-to-municipal operational workflow.
   - Core technological capabilities and institutional footer.

2. **User Dashboard (`/dashboard`)**:
   - Overview of citizen-submitted pollution reports.
   - Real-time status indicators (Under Review, Scheduled, Cleaned).
   - Recent report cards with addresses, GPS coordinates, and relative time stamps.
   - District sanitation progress bars and community milestone tracking.
   - Floating quick-action button to submit new reports.

3. **Report Litter Portal (`/report`)**:
   - Drag-and-drop photographic evidence uploader with instant image preview.
   - Interactive Leaflet map location picker (click anywhere to pin or use browser GPS).
   - Incident description, primary material classification, and estimated weight (kg).
   - Transparent AI staging notice explaining future YOLOv8 computer vision classification without mock AI claims.

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
   - Detailed modal inspector showing GPS coordinates, material classification, and inspection notes.

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

---

## 2. Design System & Aesthetic Direction

EcoWatch AI implements a professional, light-themed environmental technology design system:
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
- **Service Architecture:** Modular, decoupled API service wrappers (`apiClient.js`, `reportService.js`, `hotspotService.js`, `cleanupService.js`, `analyticsService.js`) with localStorage persistence for seamless testing.

---

## 4. Installation & Execution Guide

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Setup Instructions

1. Clone or navigate to the project directory:
   ```bash
   cd "c:\Users\Sakshi Pathare\OneDrive\CODING\PROJECTS\evs final"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```

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

## 5. Architectural Roadmap for Backend & AI Integration

### Phase 2: FastAPI & PostgreSQL Integration
- All UI components fetch data through `src/services/reportService.js`, `hotspotService.js`, and `cleanupService.js`.
- To transition from mock storage to live backend endpoints:
  1. Configure `VITE_API_BASE_URL=http://localhost:8000/api/v1` in a `.env` file.
  2. Set `USE_MOCK = false` in `src/services/apiClient.js`.
  3. The mock schemas match the PostgreSQL PostGIS database tables (`reports`, `hotspots`, `cleanups`).

### Phase 3: YOLOv8 Computer Vision Pipeline
- The image uploader in `/report` submits `multipart/form-data` with raw image bytes.
- The FastAPI backend routes images to an inference handler (`yolov8n.pt`) trained on waste datasets (TACO / TrashNet).
- Bounding boxes and class confidence scores (e.g. `bottle: 0.94`, `plastic_bag: 0.88`) return automatically to populate report metadata.

