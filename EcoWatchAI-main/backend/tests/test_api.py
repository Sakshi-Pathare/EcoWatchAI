import os
from pathlib import Path

original_database_url = os.environ.get("DATABASE_URL")
os.environ["DATABASE_URL"] = "sqlite://"

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import UPLOAD_DIR, app
from app.models import Municipality, User, WardBoundary
from app.security import hash_password

if original_database_url is None:
    os.environ.pop("DATABASE_URL", None)
else:
    os.environ["DATABASE_URL"] = original_database_url


test_engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestSession = sessionmaker(bind=test_engine, autoflush=False, expire_on_commit=False)


def override_get_db():
    db = TestSession()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


def rectangle(west, south, east, north):
    return {
        "type": "Polygon",
        "coordinates": [[
            [west, south],
            [east, south],
            [east, north],
            [west, north],
            [west, south],
        ]],
    }


def setup_function():
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    with TestSession() as db:
        db.add_all([
            Municipality(
                id="PCMC",
                code="PCMC",
                name="Pimpri-Chinchwad Municipal Corporation",
                boundary_geojson=rectangle(73.70, 18.55, 73.88, 18.72),
                boundary_source="Test-only rectangle; not official municipal boundary data.",
                active=True,
            ),
            Municipality(
                id="PMC",
                code="PMC",
                name="Pune Municipal Corporation",
                boundary_geojson=rectangle(73.88, 18.45, 74.05, 18.55),
                boundary_source="Test-only rectangle; not official municipal boundary data.",
                active=True,
            ),
        ])
        db.add(WardBoundary(
            id="ward-pcmc-1",
            municipality_id="PCMC",
            ward_id="W-1",
            zone_id="Z-1",
            geometry=rectangle(73.72, 18.57, 73.86, 18.70),
            source="Test-only ward boundary.",
        ))
        db.add_all([
            User(
                id="admin-pcmc",
                email="pcmc@example.test",
                password_hash=hash_password("PCMC-test-password-2026"),
                name="PCMC Officer",
                role="municipal_admin",
                municipality_id="PCMC",
                permissions=[
                    "reports:read", "reports:manage", "reports:delete",
                    "cleanups:read", "cleanups:manage", "analytics:read",
                    "citizens:read", "notes:read", "notes:manage",
                    "audit:read", "exports:read", "notifications:read",
                ],
                active=True,
            ),
            User(
                id="admin-pmc",
                email="pmc@example.test",
                password_hash=hash_password("PMC-test-password-2026"),
                name="PMC Officer",
                role="municipal_admin",
                municipality_id="PMC",
                permissions=[
                    "reports:read", "reports:manage", "reports:delete",
                    "cleanups:read", "cleanups:manage", "analytics:read",
                    "citizens:read", "notes:read", "notes:manage",
                    "audit:read", "exports:read", "notifications:read",
                ],
                active=True,
            ),
            User(
                id="admin-pcmc-ward",
                email="ward@example.test",
                password_hash=hash_password("Ward-test-password-2026"),
                name="PCMC Ward Officer",
                role="municipal_admin",
                municipality_id="PCMC",
                authorized_ward_ids=["W-1"],
                authorized_zone_ids=["Z-1"],
                permissions=["reports:read", "analytics:read"],
                active=True,
            ),
            User(
                id="admin-super",
                email="super@example.test",
                password_hash=hash_password("Super-test-password-2026"),
                name="Platform Super Admin",
                role="super_admin",
                permissions=["*"],
                active=True,
            ),
        ])
        db.commit()


def register_citizen(client, email="citizen@example.test"):
    response = client.post("/api/v1/auth/register", json={
        "name": "Test Citizen",
        "email": email,
        "phone": "+1-555-0100",
        "password": "citizen-test-password-2026",
    })
    assert response.status_code == 201, response.text
    return {"Authorization": f"Bearer {response.json()['accessToken']}"}


def login(client, email, password):
    response = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200, response.text
    return {"Authorization": f"Bearer {response.json()['accessToken']}"}


def create_report(
    client,
    citizen_headers,
    *,
    latitude=18.62,
    longitude=73.80,
    title="Street litter",
    extra=None,
):
    payload = {
        "title": title,
        "description": "Trash beside a public footpath.",
        "latitude": latitude,
        "longitude": longitude,
        "address": "Community Footpath",
        "category": "plastic",
        "severity": "high",
        "estimatedKg": 4,
    }
    if extra:
        payload.update(extra)
    return client.post("/api/v1/reports", json=payload, headers=citizen_headers)


def test_report_is_routed_from_coordinates_and_frontend_tenant_fields_are_ignored():
    with TestClient(app) as client:
        citizen = register_citizen(client)
        pcmc = create_report(
            client,
            citizen,
            extra={"municipalityId": "PMC", "municipalityCode": "PMC", "reporterId": "forged"},
        )
        pmc = create_report(client, citizen, latitude=18.50, longitude=73.95, title="Pune report")
        assert pcmc.status_code == pmc.status_code == 201
        assert pcmc.json()["municipalityCode"] == "PCMC"
        assert pcmc.json()["municipalityName"] == "Pimpri-Chinchwad Municipal Corporation"
        assert pcmc.json()["wardId"] == "W-1"
        assert pcmc.json()["zoneId"] == "Z-1"
        assert pcmc.json()["jurisdictionAssignmentSource"] == "municipal-boundary"
        assert pmc.json()["municipalityCode"] == "PMC"


def test_municipal_admins_are_isolated_across_reports_details_and_status_updates():
    with TestClient(app) as client:
        citizen = register_citizen(client)
        pcmc = create_report(client, citizen).json()
        pmc = create_report(client, citizen, latitude=18.50, longitude=73.95, title="Pune litter").json()
        pcmc_admin = login(client, "pcmc@example.test", "PCMC-test-password-2026")
        pmc_admin = login(client, "pmc@example.test", "PMC-test-password-2026")

        pcmc_inbox = client.get("/api/v1/reports", headers=pcmc_admin).json()
        pmc_inbox = client.get("/api/v1/reports", headers=pmc_admin).json()
        assert [item["id"] for item in pcmc_inbox] == [pcmc["id"]]
        assert [item["id"] for item in pmc_inbox] == [pmc["id"]]
        assert client.get(f"/api/v1/reports/{pcmc['id']}", headers=pmc_admin).status_code == 404
        assert client.patch(
            f"/api/v1/reports/{pcmc['id']}/status",
            json={"status": "verified"},
            headers=pmc_admin,
        ).status_code == 403
        assert client.post(
            "/api/v1/cleanups",
            json={"reportId": pcmc["id"]},
            headers=pmc_admin,
        ).status_code == 403


def test_admin_analytics_map_hotspots_csv_and_notifications_are_tenant_scoped():
    with TestClient(app) as client:
        citizen = register_citizen(client)
        pcmc_first = create_report(client, citizen, title="PCMC first").json()
        pcmc_second = create_report(
            client,
            citizen,
            latitude=18.621,
            longitude=73.801,
            title="PCMC repeat",
        ).json()
        pmc_report = create_report(
            client,
            citizen,
            latitude=18.50,
            longitude=73.95,
            title="PMC report",
        ).json()
        pcmc_admin = login(client, "pcmc@example.test", "PCMC-test-password-2026")
        pmc_admin = login(client, "pmc@example.test", "PMC-test-password-2026")

        assert client.get("/api/v1/analytics/metrics", headers=pcmc_admin).json()["totalReports"] == 2
        assert client.get("/api/v1/analytics/metrics", headers=pmc_admin).json()["totalReports"] == 1
        assert len(client.get("/api/v1/hotspots", headers=pcmc_admin).json()) == 1
        assert client.get("/api/v1/hotspots", headers=pmc_admin).json() == []
        assert client.get("/api/v1/admin/notifications", headers=pcmc_admin).json()
        pmc_notifications = client.get("/api/v1/admin/notifications", headers=pmc_admin).json()
        assert [item["reportId"] for item in pmc_notifications] == [pmc_report["id"]]
        assert all(item["reportId"] not in {pcmc_first["id"], pcmc_second["id"]} for item in pmc_notifications)

        pcmc_csv = client.get("/api/v1/reports/export.csv", headers=pcmc_admin)
        pmc_csv = client.get("/api/v1/reports/export.csv", headers=pmc_admin)
        assert pcmc_csv.status_code == pmc_csv.status_code == 200
        assert "PMC report" not in pcmc_csv.text
        assert pcmc_first["id"] in pcmc_csv.text and pcmc_second["id"] in pcmc_csv.text
        assert pmc_report["id"] in pmc_csv.text
        assert pcmc_first["id"] not in pmc_csv.text


def test_public_reports_exclude_private_data_and_admin_routes_require_authentication():
    with TestClient(app) as client:
        citizen = register_citizen(client)
        report = create_report(client, citizen).json()
        public_reports = client.get("/api/v1/public/reports").json()
        assert len(public_reports) == 1
        assert public_reports[0]["id"] == report["id"]
        for key in ("reporterId", "reporterName", "reporterEmail", "reporterPhone", "internalNotes", "description"):
            assert key not in public_reports[0]
        assert client.get("/api/v1/reports").status_code == 401
        assert client.get("/api/v1/analytics/metrics").status_code == 401
        assert client.get("/api/v1/admin/citizens").status_code == 401
        assert client.get("/api/v1/reports", headers=citizen).status_code == 403
        assert client.get("/api/v1/admin/citizens", headers=login(
            client, "pcmc@example.test", "PCMC-test-password-2026"
        )).status_code == 200


def test_ward_scope_restricts_admin_reports_without_broadening_tenant_access():
    with TestClient(app) as client:
        citizen = register_citizen(client)
        in_ward = create_report(client, citizen, longitude=73.80, latitude=18.62).json()
        outside_ward = create_report(client, citizen, longitude=73.87, latitude=18.71).json()
        ward_admin = login(client, "ward@example.test", "Ward-test-password-2026")
        assert [item["id"] for item in client.get("/api/v1/reports", headers=ward_admin).json()] == [in_ward["id"]]
        assert client.get(f"/api/v1/reports/{outside_ward['id']}", headers=ward_admin).status_code == 404


def test_unknown_and_near_boundary_reports_are_quarantined_until_superadmin_review():
    with TestClient(app) as client:
        citizen = register_citizen(client)
        unknown = create_report(client, citizen, latitude=19.0, longitude=75.0, title="Outside boundary").json()
        near_edge = create_report(client, citizen, latitude=18.62, longitude=73.8799, title="Boundary report").json()
        assert unknown["jurisdictionStatus"] == "pending"
        assert near_edge["jurisdictionStatus"] == "pending"
        assert client.get("/api/v1/public/reports").json() == []
        pcmc_admin = login(client, "pcmc@example.test", "PCMC-test-password-2026")
        assert client.get("/api/v1/reports", headers=pcmc_admin).json() == []
        super_headers = login(client, "super@example.test", "Super-test-password-2026")
        pending = client.get("/api/v1/superadmin/reports/pending-jurisdiction", headers=super_headers)
        assert {item["id"] for item in pending.json()} == {unknown["id"], near_edge["id"]}
        assert client.post(
            f"/api/v1/superadmin/reports/{unknown['id']}/jurisdiction",
            json={"municipalityCode": "PCMC", "reason": "Verified coordinates against the test boundary."},
            headers=super_headers,
        ).status_code == 422
        resolved = client.post(
            f"/api/v1/superadmin/reports/{near_edge['id']}/jurisdiction",
            json={"municipalityCode": "PCMC", "reason": "Verified original pin and confirmed jurisdiction."},
            headers=super_headers,
        )
        assert resolved.status_code == 200
        assert resolved.json()["municipalityCode"] == "PCMC"
        assert resolved.json()["jurisdictionAssignmentSource"] == "superadmin-override"


def test_cleanup_lifecycle_is_scoped_and_completion_requires_after_photo():
    with TestClient(app) as client:
        citizen = register_citizen(client)
        report = create_report(client, citizen).json()
        pcmc_admin = login(client, "pcmc@example.test", "PCMC-test-password-2026")
        pmc_admin = login(client, "pmc@example.test", "PMC-test-password-2026")
        created = client.post(
            "/api/v1/cleanups",
            json={"reportId": report["id"]},
            headers=pcmc_admin,
        )
        assert created.status_code == 201
        cleanup = created.json()
        assert client.patch(
            f"/api/v1/cleanups/{cleanup['id']}/status",
            json={"status": "completed"},
            headers=pcmc_admin,
        ).status_code == 422
        assert client.patch(
            f"/api/v1/cleanups/{cleanup['id']}/status",
            json={"status": "in_progress"},
            headers=pmc_admin,
        ).status_code == 403

        after_photo = "data:image/jpeg;base64,/9j/AA=="
        completed = client.patch(
            f"/api/v1/cleanups/{cleanup['id']}/status",
            json={"status": "completed", "afterImageUrl": after_photo},
            headers=pcmc_admin,
        )
        assert completed.status_code == 200
        assert client.get("/api/v1/reports/mine", headers=citizen).json()[0]["status"] == "cleaned"
        image_path = UPLOAD_DIR / Path(completed.json()["afterImageUrl"]).name
        try:
            assert client.get(completed.json()["afterImageUrl"]).content == b"\xff\xd8\xff\x00"
        finally:
            image_path.unlink(missing_ok=True)


def test_tenant_internal_notes_and_history_are_private():
    with TestClient(app) as client:
        citizen = register_citizen(client)
        report = create_report(client, citizen).json()
        pcmc_admin = login(client, "pcmc@example.test", "PCMC-test-password-2026")
        pmc_admin = login(client, "pmc@example.test", "PMC-test-password-2026")
        updated = client.patch(
            f"/api/v1/reports/{report['id']}/notes",
            json={"note": "Internal dispatch note."},
            headers=pcmc_admin,
        )
        assert updated.status_code == 200
        details = client.get(f"/api/v1/reports/{report['id']}", headers=pcmc_admin).json()
        assert details["internalNotes"] == "Internal dispatch note."
        assert client.get(f"/api/v1/reports/{report['id']}/history", headers=pmc_admin).status_code == 404
        assert client.get(f"/api/v1/reports/{report['id']}/history", headers=pcmc_admin).json()


def test_health_and_geojson_municipality_admin_setup():
    with TestClient(app) as client:
        assert client.get("/api/v1/health").json() == {"status": "ok", "database": "connected"}
        super_headers = login(client, "super@example.test", "Super-test-password-2026")
        municipality = client.post("/api/v1/superadmin/municipalities", headers=super_headers, json={
            "code": "TEST",
            "name": "Test Municipality",
            "boundaryGeojson": rectangle(77, 20, 77.1, 20.1),
            "boundarySource": "Test-only GeoJSON fixture.",
        })
        assert municipality.status_code == 201, municipality.text
        created_admin = client.post("/api/v1/superadmin/admins", headers=super_headers, json={
            "municipalityCode": "TEST",
            "name": "New Municipal Officer",
            "email": "new-admin@example.test",
            "password": "new-admin-password-2026",
        })
        assert created_admin.status_code == 201, created_admin.text
        assert created_admin.json()["municipalityCode"] == "TEST"
        assert client.post("/api/v1/superadmin/admins", headers=login(
            client, "pcmc@example.test", "PCMC-test-password-2026"
        ), json={
            "municipalityCode": "TEST",
            "name": "Unauthorized Admin",
            "email": "unauthorized@example.test",
            "password": "unauthorized-password-2026",
        }).status_code == 403
