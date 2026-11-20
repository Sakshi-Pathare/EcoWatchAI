# Vasundhara AI API

FastAPI backend for persistent litter reports, cleanup work orders, derived hotspot clusters, analytics, and photo storage.

## Run locally

From the `backend` directory:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

SQLite is the default database and is created at `backend/ecowatch.db`. The API creates its tables on startup. Interactive API documentation is available at `http://localhost:8001/docs`; `http://localhost:8001/health` is the health check.

Copy `.env.example` to `.env` to configure the database, CORS origins, or optional model path. Before the first startup, set `ECOWATCH_SUPERADMIN_EMAIL` and `ECOWATCH_SUPERADMIN_PASSWORD` in `.env`; the password must be at least 12 characters. The application bootstraps that account once and does not provide default credentials. Environment variables already set by the shell take precedence.

To use PostgreSQL, set `DATABASE_URL` before starting the API, for example:

```powershell
$env:DATABASE_URL = "postgresql+psycopg://postgres:your-password@localhost:5432/ecowatch"
```

The database must already exist. The application creates its tables automatically.

## Start the frontend

In another terminal, from the project root:

```powershell
npm install
npm run dev
```

Vite forwards `/api` and `/static` requests to `http://localhost:8001`. Set `VITE_API_BASE_URL` if the API runs elsewhere.

## Computer vision

The API accepts and stores photographs even when no detector is installed. It never fabricates detections: `/ai/status` reports whether a model is configured, and the report clearly says when manual classification was used.

To enable YOLO inference, install `requirements-ai.txt` and set `YOLO_MODEL_PATH` to a locally available model trained for waste/litter classes. Generic pretrained object models are not presented as litter-specific models. Uploaded images and model files are not sent to an external service.

Run API tests from this directory with `python -m pytest`.

## API overview

- `POST /api/v1/auth/register`, `/auth/login`; `GET /auth/me`; `POST /auth/logout`
- `GET /api/v1/public/reports`, `/public/hotspots`, `/public/metrics` provide privacy-limited public data
- `POST /api/v1/reports` and `GET /reports/mine` are citizen-authenticated
- Admin report, cleanup, hotspot, and analytics endpoints require municipal-admin or super-admin access and apply server-side municipality and optional ward/zone scoping
- `/api/v1/superadmin/*` registers municipalities, their authoritative boundaries, municipal administrators, and manual jurisdiction resolutions
- `GET /api/v1/ai/status`

Hotspots are calculated from assigned submitted reports; reports within 300 meters are connected into clusters, and only clusters with at least two reports are returned. Priority uses cluster recurrence, report severity, and report age. Cleanup completion requires an after-photo and synchronizes the linked report status. `GET /api/v1/health` verifies both API and database connectivity; the frontend checks it periodically and shows a retryable warning if the backend is unavailable.

Municipal boundaries are not bundled because they must be obtained and verified from an authoritative source. Unassigned and boundary-ambiguous reports are excluded from public data and ordinary municipal access until resolved by a super-admin.
