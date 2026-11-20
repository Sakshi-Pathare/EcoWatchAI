import base64
import binascii
import csv
import io
import math
import os
import secrets
import uuid
from collections import Counter
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, ConfigDict, Field, field_validator
from sqlalchemy import delete, func, or_, select
from sqlalchemy.orm import Session
from starlette.responses import StreamingResponse

from .database import BACKEND_DIR, get_db
from .jurisdiction import geometry_boundary_distance_meters, geometry_contains, resolve_jurisdiction
from .models import (
    AuditLog,
    AuthSession,
    Cleanup,
    Municipality,
    Notification,
    Report,
    User,
    WardBoundary,
    utc_now,
)
from .security import (
    get_current_user,
    hash_password,
    issue_session,
    require_permissions,
    require_roles,
    revoke_session,
    user_json,
    verify_password,
)
from .vision import detect_objects, detector_status


api = APIRouter(prefix="/api/v1")
UPLOAD_DIR = BACKEND_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
MAX_IMAGE_BYTES = 8 * 1024 * 1024
ALLOWED_IMAGE_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
ADMIN_PERMISSIONS = {
    "reports:read",
    "reports:manage",
    "reports:delete",
    "cleanups:read",
    "cleanups:manage",
    "analytics:read",
    "citizens:read",
    "notes:read",
    "notes:manage",
    "audit:read",
    "exports:read",
    "notifications:read",
}
admin_user = require_roles("municipal_admin", "super_admin")
citizen_user = require_roles("citizen")
super_admin = require_roles("super_admin")
optional_bearer = HTTPBearer(auto_error=False)


def _camel_case(value: str) -> str:
    first, *rest = value.split("_")
    return first + "".join(part.capitalize() for part in rest)


class APIModel(BaseModel):
    model_config = ConfigDict(alias_generator=_camel_case, populate_by_name=True)


class RegisterPayload(APIModel):
    name: str = Field(min_length=2, max_length=120)
    email: str = Field(min_length=3, max_length=254)
    phone: str | None = Field(default=None, max_length=40)
    password: str = Field(min_length=12, max_length=128)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized.count("@") != 1 or "." not in normalized.rsplit("@", 1)[-1]:
            raise ValueError("Enter a valid email address.")
        return normalized


class LoginPayload(APIModel):
    email: str = Field(min_length=3, max_length=254)
    password: str = Field(min_length=1, max_length=128)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()


class ReportCreate(APIModel):
    title: str = Field(min_length=3, max_length=160)
    description: str = Field(default="", max_length=4000)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    address: str = Field(default="", max_length=300)
    category: Literal["plastic", "glass", "metal", "paper", "hazardous", "organic", "mixed"] = "mixed"
    severity: Literal["low", "medium", "high"] = "medium"
    estimated_kg: float = Field(default=1, gt=0, le=10000)
    image_url: str | None = Field(default=None, max_length=12_000_000)

    @field_validator("title")
    @classmethod
    def title_must_not_be_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Title must not be blank.")
        return value.strip()


class StatusUpdate(APIModel):
    status: Literal["pending", "verified", "scheduled", "cleaned", "in_progress", "completed"]
    after_image_url: str | None = Field(default=None, max_length=12_000_000)


class CleanupCreate(APIModel):
    report_id: str = Field(min_length=1, max_length=32)
    assigned_team: str = Field(default="Municipal Sanitation Crew", max_length=160)
    scheduled_date: str | None = Field(default=None, max_length=40)


class CleanupAssign(APIModel):
    assigned_team: str = Field(min_length=1, max_length=160)
    scheduled_date: str | None = Field(default=None, max_length=40)


class InternalNoteUpdate(APIModel):
    note: str = Field(max_length=4000)


class MunicipalityCreate(APIModel):
    code: str = Field(min_length=2, max_length=32)
    name: str = Field(min_length=2, max_length=180)
    boundary_geojson: dict
    boundary_source: str = Field(min_length=3, max_length=500)
    ward_boundaries: list[dict] = Field(default_factory=list)


class BoundaryUpdate(APIModel):
    geometry: dict
    source: str = Field(min_length=3, max_length=500)
    wards: list[dict] = Field(default_factory=list)


class MunicipalAdminCreate(APIModel):
    municipality_code: str = Field(min_length=2, max_length=32)
    name: str = Field(min_length=2, max_length=120)
    email: str = Field(min_length=3, max_length=254)
    phone: str | None = Field(default=None, max_length=40)
    password: str = Field(min_length=12, max_length=128)
    authorized_ward_ids: list[str] | None = None
    authorized_zone_ids: list[str] | None = None
    permissions: list[str] = Field(default_factory=lambda: sorted(ADMIN_PERMISSIONS))

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized.count("@") != 1 or "." not in normalized.rsplit("@", 1)[-1]:
            raise ValueError("Enter a valid email address.")
        return normalized


class JurisdictionCorrection(APIModel):
    municipality_code: str = Field(min_length=2, max_length=32)
    reason: str = Field(min_length=10, max_length=1000)


def _image_url(value: str | None, key: str) -> str | None:
    if not value or not value.startswith("data:"):
        return value
    try:
        header, encoded = value.split(",", 1)
        mime_type = header[5:].split(";", 1)[0].lower()
        extension = ALLOWED_IMAGE_TYPES.get(mime_type)
        if not extension or ";base64" not in header:
            raise HTTPException(status_code=400, detail="Only JPEG, PNG, and WebP image uploads are supported.")
        content = base64.b64decode(encoded, validate=True)
    except (ValueError, binascii.Error) as exc:
        raise HTTPException(status_code=400, detail="The uploaded image is not valid base64 data.") from exc

    if not content:
        return None
    if len(content) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Compressed images must be 8 MB or smaller.")
    valid_signature = (
        (mime_type == "image/jpeg" and content.startswith(b"\xff\xd8\xff"))
        or (mime_type == "image/png" and content.startswith(b"\x89PNG\r\n\x1a\n"))
        or (mime_type == "image/webp" and content.startswith(b"RIFF") and content[8:12] == b"WEBP")
    )
    if not valid_signature:
        raise HTTPException(status_code=400, detail="The uploaded file content does not match its image type.")

    file_name = f"{key}-{uuid.uuid4().hex}{extension}"
    (UPLOAD_DIR / file_name).write_bytes(content)
    return f"/static/uploads/{file_name}"


def _remove_local_image(url: str | None) -> None:
    if not url or not url.startswith("/static/uploads/"):
        return
    target = (UPLOAD_DIR / Path(url).name).resolve()
    if target.parent == UPLOAD_DIR.resolve() and target.is_file():
        target.unlink()


def _municipality_json(municipality: Municipality) -> dict:
    return {
        "id": municipality.id,
        "code": municipality.code,
        "name": municipality.name,
        "boundarySource": municipality.boundary_source,
        "boundaryAvailable": bool(municipality.boundary_geojson),
        "active": municipality.active,
    }


def _report_json(
    report: Report,
    db: Session,
    *,
    include_contact: bool = False,
    include_internal_notes: bool = False,
) -> dict:
    municipality = db.get(Municipality, report.municipality_id) if report.municipality_id else None
    payload = {
        "id": report.id,
        "title": report.title,
        "description": report.description,
        "latitude": report.latitude,
        "longitude": report.longitude,
        "address": report.address,
        "category": report.category,
        "severity": report.severity,
        "status": report.status,
        "jurisdictionStatus": report.jurisdiction_status,
        "municipalityId": report.municipality_id,
        "municipalityCode": municipality.code if municipality else None,
        "municipalityName": municipality.name if municipality else None,
        "wardId": report.ward_id,
        "zoneId": report.zone_id,
        "jurisdictionAssignmentSource": report.jurisdiction_assignment_source,
        "jurisdictionAssignmentDate": (
            report.jurisdiction_assignment_date.isoformat()
            if report.jurisdiction_assignment_date else None
        ),
        "estimatedKg": report.estimated_kg,
        "imageUrl": report.image_url,
        "detectionNote": report.detection_note,
        "detections": report.detections or [],
        "reportedAt": report.reported_at.isoformat() if report.reported_at else None,
        "updatedAt": report.updated_at.isoformat() if report.updated_at else None,
    }
    if include_contact:
        reporter = db.get(User, report.citizen_user_id) if report.citizen_user_id else None
        payload.update({
            "reporterId": report.reporter_id,
            "reporterName": reporter.name if reporter else report.reporter_name,
            "reporterEmail": reporter.email if reporter else None,
            "reporterPhone": reporter.phone if reporter else None,
        })
    if include_internal_notes:
        payload["internalNotes"] = report.internal_notes
    return payload


def _public_report_json(report: Report, db: Session) -> dict:
    report_data = _report_json(report, db)
    report_data.pop("description", None)
    report_data.pop("detectionNote", None)
    report_data.pop("detections", None)
    return report_data


def _citizen_report_json(report: Report, db: Session) -> dict:
    return _report_json(report, db)


def _cleanup_json(cleanup: Cleanup) -> dict:
    return {
        "id": cleanup.id,
        "reportId": cleanup.report_id,
        "taskName": cleanup.task_name,
        "location": cleanup.location,
        "assignedTeam": cleanup.assigned_team,
        "contactLead": cleanup.contact_lead,
        "scheduledDate": cleanup.scheduled_date,
        "status": cleanup.status,
        "priority": cleanup.priority,
        "estimatedHours": cleanup.estimated_hours,
        "wasteVolumeEstimate": cleanup.waste_volume_estimate,
        "beforeImageUrl": cleanup.before_image_url,
        "afterImageUrl": cleanup.after_image_url,
        "notes": cleanup.notes,
        "completedAt": cleanup.completed_at.isoformat() if cleanup.completed_at else None,
        "updatedAt": cleanup.updated_at.isoformat() if cleanup.updated_at else None,
    }


def _audit(
    db: Session,
    action: str,
    *,
    actor: User | None,
    report: Report | None = None,
    municipality_id: str | None = None,
    details: dict | None = None,
) -> None:
    db.add(AuditLog(
        id=uuid.uuid4().hex,
        actor_user_id=actor.id if actor else None,
        municipality_id=municipality_id or (report.municipality_id if report else None),
        report_id=report.id if report else None,
        action=action,
        details=details or {},
    ))


def _require_scoped_permission(user: User, permission: str) -> None:
    require_permissions(user, permission)


def _scope_report_query(query, user: User):
    if user.role == "super_admin":
        return query
    if user.role != "municipal_admin" or not user.municipality_id:
        raise HTTPException(status_code=403, detail="Municipal administrator access is required.")
    query = query.where(
        Report.municipality_id == user.municipality_id,
        Report.jurisdiction_status == "assigned",
    )
    if user.authorized_ward_ids is not None:
        if not user.authorized_ward_ids:
            return query.where(False)
        query = query.where(Report.ward_id.in_(user.authorized_ward_ids))
    if user.authorized_zone_ids is not None:
        if not user.authorized_zone_ids:
            return query.where(False)
        query = query.where(Report.zone_id.in_(user.authorized_zone_ids))
    return query


def _get_scoped_report(
    db: Session,
    report_id: str,
    user: User,
    *,
    conceal_forbidden: bool = False,
) -> Report:
    report = db.get(Report, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")
    scoped = db.scalar(_scope_report_query(select(Report).where(Report.id == report_id), user))
    if not scoped:
        if conceal_forbidden:
            raise HTTPException(status_code=404, detail="Report not found.")
        raise HTTPException(status_code=403, detail="This report is outside your authorized jurisdiction.")
    return report


def _report_list_options(
    query,
    *,
    severity: str | None,
    report_status: str | None,
    category: str | None,
    search: str | None,
    ward_id: str | None = None,
):
    if severity and severity != "all":
        query = query.where(Report.severity == severity)
    if report_status and report_status != "all":
        query = query.where(Report.status == report_status)
    if category and category != "all":
        query = query.where(Report.category == category)
    if ward_id:
        query = query.where(Report.ward_id == ward_id)
    if search:
        needle = f"%{search.strip()}%"
        query = query.where(
            Report.title.ilike(needle)
            | Report.address.ilike(needle)
            | Report.id.ilike(needle)
        )
    return query


def _reporters_for_scope(db: Session, user: User) -> list[User]:
    scoped_reports = _scope_report_query(select(Report.citizen_user_id), user)
    user_ids = [value for value in db.scalars(scoped_reports).all() if value]
    if not user_ids:
        return []
    return db.scalars(select(User).where(User.id.in_(set(user_ids)), User.role == "citizen")).all()


def _distance_meters(left: Report, right: Report) -> float:
    lat1, lat2 = math.radians(left.latitude), math.radians(right.latitude)
    delta_lat = lat2 - lat1
    delta_lon = math.radians(right.longitude - left.longitude)
    value = math.sin(delta_lat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(delta_lon / 2) ** 2
    return 6_371_000 * 2 * math.atan2(math.sqrt(value), math.sqrt(max(0, 1 - value)))


def _hotspots(reports: list[Report], db: Session) -> list[dict]:
    by_municipality: dict[str, list[Report]] = {}
    for report in reports:
        if report.jurisdiction_status == "assigned" and report.municipality_id:
            by_municipality.setdefault(report.municipality_id, []).append(report)

    clusters = []
    for municipality_id, municipality_reports in by_municipality.items():
        remaining = set(range(len(municipality_reports)))
        while remaining:
            seed = min(remaining)
            remaining.remove(seed)
            cluster = {seed}
            frontier = [seed]
            while frontier:
                current = frontier.pop()
                neighbors = [
                    candidate for candidate in sorted(remaining)
                    if _distance_meters(municipality_reports[current], municipality_reports[candidate]) <= 300
                ]
                for candidate in neighbors:
                    remaining.remove(candidate)
                    cluster.add(candidate)
                    frontier.append(candidate)
            if len(cluster) >= 2:
                clusters.append((municipality_id, [municipality_reports[index] for index in cluster]))

    clusters.sort(key=lambda group: (
        group[0],
        sum(report.latitude for report in group[1]) / len(group[1]),
        sum(report.longitude for report in group[1]) / len(group[1]),
    ))
    result = []
    for index, (municipality_id, cluster) in enumerate(clusters, start=1):
        municipality = db.get(Municipality, municipality_id)
        latitude = sum(report.latitude for report in cluster) / len(cluster)
        longitude = sum(report.longitude for report in cluster) / len(cluster)
        categories = Counter(report.category for report in cluster)
        severity_weight = {"low": 15, "medium": 35, "high": 55}
        newest = max(report.reported_at or utc_now() for report in cluster)
        oldest = min(report.reported_at or utc_now() for report in cluster)
        oldest_utc = oldest.replace(tzinfo=timezone.utc) if oldest.tzinfo is None else oldest
        elapsed_days = max(0, (utc_now() - oldest_utc).days)
        average_severity = sum(severity_weight.get(report.severity, 25) for report in cluster) / len(cluster)
        priority = min(100, round(
            average_severity
            + min(35, (len(cluster) - 1) * 12)
            + max(0, 10 - elapsed_days // 7)
        ))
        result.append({
            "id": f"HOT-{municipality.code if municipality else municipality_id}-{index:03d}",
            "name": f"Recurring litter cluster near {cluster[0].address or 'reported locations'}",
            "district": municipality.name if municipality else "Municipality",
            "municipalityId": municipality_id,
            "municipalityCode": municipality.code if municipality else municipality_id,
            "latitude": latitude,
            "longitude": longitude,
            "radiusMeters": 300,
            "recurrenceCount": len(cluster),
            "severity": "high" if priority >= 70 else "medium" if priority >= 40 else "low",
            "priorityScore": priority,
            "dominantCategory": categories.most_common(1)[0][0],
            "lastReportedDate": newest.isoformat(),
            "trend": "Based on submitted reports",
            "environmentalRisk": f"{len(cluster)} reports within 300 meters; assess drainage and public access.",
            "suggestedAction": "Review this location and schedule a site inspection.",
        })
    return result


def _scoped_reports(db: Session, user: User) -> list[Report]:
    query = _scope_report_query(select(Report), user)
    return db.scalars(query.order_by(Report.reported_at.desc())).all()


def _metrics(reports: list[Report], cleanups: list[Cleanup], db: Session) -> dict:
    pending = sum(report.status == "pending" for report in reports)
    verified = sum(report.status == "verified" for report in reports)
    scheduled = sum(report.status == "scheduled" for report in reports)
    cleaned = sum(report.status == "cleaned" for report in reports)
    active = sum(item.status in {"pending", "in_progress"} for item in cleanups)
    hotspots = _hotspots(reports, db)
    total = len(reports)
    return {
        "totalReports": total,
        "pendingReports": pending,
        "verifiedReports": verified,
        "scheduledCleanups": scheduled,
        "completedCleanups": cleaned,
        "totalReportsLogged": total,
        "verifiedIncidents": verified + scheduled + cleaned,
        "pendingReview": pending,
        "activeCleanupTasks": active,
        "totalWasteCollectedKg": round(sum(report.estimated_kg for report in reports if report.status == "cleaned"), 1),
        "averageResponseTimeHours": 0,
        "activeHotspotsTracked": len(hotspots),
        "communityVolunteers": len({report.citizen_user_id for report in reports if report.citizen_user_id}),
        "civicSatisfactionScore": None,
    }


def _cleanup_rows_for_reports(db: Session, reports: list[Report]) -> list[Cleanup]:
    if not reports:
        return []
    return db.scalars(select(Cleanup).where(Cleanup.report_id.in_([report.id for report in reports]))).all()


def _geometry_only(value: dict) -> dict:
    if not isinstance(value, dict):
        raise HTTPException(status_code=422, detail="A GeoJSON Polygon or MultiPolygon boundary is required.")
    geometry = value.get("geometry") if value.get("type") == "Feature" else value
    if not isinstance(geometry, dict) or geometry.get("type") not in {"Polygon", "MultiPolygon"}:
        raise HTTPException(status_code=422, detail="Boundary GeoJSON must contain a Polygon or MultiPolygon.")
    coordinates = geometry.get("coordinates")
    polygons = [coordinates] if geometry["type"] == "Polygon" else coordinates
    if not isinstance(polygons, list) or not polygons:
        raise HTTPException(status_code=422, detail="Boundary GeoJSON contains no polygon coordinates.")
    for polygon in polygons:
        if not isinstance(polygon, list) or not polygon:
            raise HTTPException(status_code=422, detail="Boundary GeoJSON contains an empty polygon.")
        for ring in polygon:
            if not isinstance(ring, list) or len(ring) < 4 or ring[0] != ring[-1]:
                raise HTTPException(status_code=422, detail="GeoJSON polygon rings must be closed and have at least four positions.")
            for position in ring:
                if (
                    not isinstance(position, list)
                    or len(position) < 2
                    or not -180 <= float(position[0]) <= 180
                    or not -90 <= float(position[1]) <= 90
                ):
                    raise HTTPException(status_code=422, detail="Boundary coordinates must be valid longitude/latitude pairs.")
    return geometry


def _replace_wards(db: Session, municipality_id: str, wards: list[dict], source: str) -> None:
    db.execute(delete(WardBoundary).where(WardBoundary.municipality_id == municipality_id))
    for item in wards:
        geometry = _geometry_only(item.get("geometry") or item)
        ward_id = item.get("wardId") or item.get("ward_id")
        zone_id = item.get("zoneId") or item.get("zone_id")
        db.add(WardBoundary(
            id=uuid.uuid4().hex,
            municipality_id=municipality_id,
            ward_id=str(ward_id) if ward_id is not None else None,
            zone_id=str(zone_id) if zone_id is not None else None,
            geometry=geometry,
            source=str(item.get("source") or source),
        ))


def _ward_scope_applies(user: User, report: Report) -> bool:
    if user.role == "super_admin":
        return True
    if user.authorized_ward_ids is not None and report.ward_id not in user.authorized_ward_ids:
        return False
    if user.authorized_zone_ids is not None and report.zone_id not in user.authorized_zone_ids:
        return False
    return True


@api.get("/ai/status")
def ai_status():
    return detector_status()


@api.post("/auth/register", status_code=201)
def register(payload: RegisterPayload, db: Session = Depends(get_db)):
    if db.scalar(select(User.id).where(User.email == payload.email)):
        raise HTTPException(status_code=409, detail="An account with this email already exists.")
    user = User(
        id=f"USR-{secrets.token_hex(8).upper()}",
        email=payload.email,
        password_hash=hash_password(payload.password),
        name=payload.name.strip(),
        phone=payload.phone.strip() if payload.phone else None,
        role="citizen",
        permissions=[],
        active=True,
    )
    db.add(user)
    token, expires_at = issue_session(db, user)
    db.commit()
    return {"accessToken": token, "tokenType": "bearer", "expiresAt": expires_at.isoformat(), "user": user_json(user)}


@api.post("/auth/login")
def login(payload: LoginPayload, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email))
    if not user or not user.active or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email or password is incorrect.")
    municipality = db.get(Municipality, user.municipality_id) if user.municipality_id else None
    token, expires_at = issue_session(db, user)
    db.commit()
    return {
        "accessToken": token,
        "tokenType": "bearer",
        "expiresAt": expires_at.isoformat(),
        "user": user_json(user, municipality.name if municipality else None),
    }


@api.get("/auth/me")
def current_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    municipality = db.get(Municipality, user.municipality_id) if user.municipality_id else None
    return user_json(user, municipality.name if municipality else None)


@api.post("/auth/logout", status_code=204)
def logout(
    credentials: HTTPAuthorizationCredentials | None = Depends(optional_bearer),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if credentials:
        revoke_session(db, credentials.credentials)
        db.commit()
    return Response(status_code=204)


@api.get("/health")
def api_health(db: Session = Depends(get_db)):
    db.execute(select(1))
    return {"status": "ok", "database": "connected"}


@api.get("/public/metrics")
def public_metrics(db: Session = Depends(get_db)):
    reports = db.scalars(select(Report).where(
        Report.jurisdiction_status == "assigned",
        Report.municipality_id.is_not(None),
    )).all()
    cleanups = _cleanup_rows_for_reports(db, reports)
    return _metrics(reports, cleanups, db)


@api.get("/public/reports")
def public_reports(
    severity: str | None = None,
    status: str | None = None,
    category: str | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
):
    query = select(Report).where(
        Report.jurisdiction_status == "assigned",
        Report.municipality_id.is_not(None),
    )
    query = _report_list_options(
        query,
        severity=severity,
        report_status=status,
        category=category,
        search=search,
    )
    return [_public_report_json(report, db) for report in db.scalars(query.order_by(Report.reported_at.desc())).all()]


@api.get("/public/hotspots")
def public_hotspots(
    sort_by: Literal["priority", "recurrence", "date"] = Query(default="priority"),
    db: Session = Depends(get_db),
):
    reports = db.scalars(select(Report).where(
        Report.jurisdiction_status == "assigned",
        Report.municipality_id.is_not(None),
    ).order_by(Report.reported_at.desc())).all()
    sort_key = {
        "priority": lambda item: item["priorityScore"],
        "recurrence": lambda item: item["recurrenceCount"],
        "date": lambda item: item["lastReportedDate"],
    }[sort_by]
    return sorted(_hotspots(reports, db), key=sort_key, reverse=True)


@api.post("/reports", status_code=201)
def create_report(
    payload: ReportCreate,
    db: Session = Depends(get_db),
    user: User = Depends(citizen_user),
):
    report_id = f"EW-{uuid.uuid4().hex[:12].upper()}"
    image_url = _image_url(payload.image_url, report_id)
    detections = []
    detection_note = "AI detector not configured; report classification is user-provided."
    if image_url and image_url.startswith("/static/uploads/"):
        try:
            detections, detection_note = detect_objects(UPLOAD_DIR / Path(image_url).name)
        except RuntimeError as exc:
            _remove_local_image(image_url)
            raise HTTPException(status_code=503, detail=str(exc)) from exc

    jurisdiction = resolve_jurisdiction(db, payload.latitude, payload.longitude)
    municipality = jurisdiction["municipality"]
    report = Report(
        id=report_id,
        title=payload.title,
        description=payload.description.strip(),
        latitude=payload.latitude,
        longitude=payload.longitude,
        address=payload.address.strip(),
        category=payload.category,
        severity=payload.severity,
        status="pending",
        jurisdiction_status=jurisdiction["status"],
        municipality_id=municipality.id if municipality else None,
        ward_id=jurisdiction["wardId"],
        zone_id=jurisdiction["zoneId"],
        jurisdiction_assignment_source=jurisdiction["source"],
        jurisdiction_assignment_date=utc_now(),
        citizen_user_id=user.id,
        reporter_id=user.id,
        reporter_name=user.name,
        estimated_kg=payload.estimated_kg,
        image_url=image_url,
        detections=detections,
        detection_note=detection_note,
    )
    db.add(report)
    db.flush()
    if municipality:
        admins = db.scalars(select(User).where(
            User.role == "municipal_admin",
            User.municipality_id == municipality.id,
            User.active.is_(True),
        )).all()
        for administrator in admins:
            if _ward_scope_applies(administrator, report) and "notifications:read" in (administrator.permissions or []):
                db.add(Notification(
                    id=uuid.uuid4().hex,
                    user_id=administrator.id,
                    municipality_id=municipality.id,
                    report_id=report.id,
                    message=f"New {payload.category} litter report received in your jurisdiction.",
                ))
        _audit(db, "report.routed", actor=user, report=report, details={
            "source": jurisdiction["source"],
            "wardId": report.ward_id,
            "zoneId": report.zone_id,
        })
    else:
        routing_officers = db.scalars(select(User).where(
            User.role == "routing_officer",
            User.active.is_(True),
        )).all()
        for officer in routing_officers:
            db.add(Notification(
                id=uuid.uuid4().hex,
                user_id=officer.id,
                municipality_id=officer.municipality_id or "UNASSIGNED",
                report_id=report.id,
                message="A litter report needs jurisdiction review.",
            ))
        _audit(db, "report.jurisdiction_pending", actor=user, report=report, details={
            "source": jurisdiction["source"],
        })
    db.commit()
    db.refresh(report)
    return _citizen_report_json(report, db)


@api.get("/reports/mine")
def my_reports(
    user: User = Depends(citizen_user),
    db: Session = Depends(get_db),
):
    reports = db.scalars(
        select(Report).where(Report.citizen_user_id == user.id).order_by(Report.reported_at.desc())
    ).all()
    return [_citizen_report_json(report, db) for report in reports]


@api.get("/reports")
def list_admin_reports(
    severity: str | None = None,
    status: str | None = None,
    category: str | None = None,
    search: str | None = None,
    ward_id: str | None = None,
    db: Session = Depends(get_db),
    user: User = Depends(admin_user),
):
    _require_scoped_permission(user, "reports:read")
    query = _scope_report_query(select(Report), user)
    query = _report_list_options(
        query,
        severity=severity,
        report_status=status,
        category=category,
        search=search,
        ward_id=ward_id,
    )
    include_contact = user.role == "super_admin" or "citizens:read" in (user.permissions or [])
    include_notes = user.role == "super_admin" or "notes:read" in (user.permissions or [])
    reports = db.scalars(query.order_by(Report.reported_at.desc())).all()
    return [
        _report_json(report, db, include_contact=include_contact, include_internal_notes=include_notes)
        for report in reports
    ]


@api.get("/reports/export.csv")
def export_admin_reports(
    user: User = Depends(admin_user),
    db: Session = Depends(get_db),
):
    _require_scoped_permission(user, "exports:read")
    reports = _scoped_reports(db, user)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "report_id", "municipality_code", "ward_id", "zone_id", "title", "latitude",
        "longitude", "category", "severity", "status", "reported_at",
    ])
    for report in reports:
        municipality = db.get(Municipality, report.municipality_id) if report.municipality_id else None
        writer.writerow([
            report.id,
            municipality.code if municipality else "",
            report.ward_id or "",
            report.zone_id or "",
            report.title,
            report.latitude,
            report.longitude,
            report.category,
            report.severity,
            report.status,
            report.reported_at.isoformat() if report.reported_at else "",
        ])
    municipality = db.get(Municipality, user.municipality_id) if user.municipality_id else None
    file_name = f"ecowatch-{municipality.code if municipality else 'platform'}-reports.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{file_name}"'},
    )


@api.get("/reports/{report_id}")
def get_admin_report(
    report_id: str,
    user: User = Depends(admin_user),
    db: Session = Depends(get_db),
):
    _require_scoped_permission(user, "reports:read")
    report = _get_scoped_report(db, report_id, user, conceal_forbidden=True)
    include_contact = user.role == "super_admin" or "citizens:read" in (user.permissions or [])
    include_notes = user.role == "super_admin" or "notes:read" in (user.permissions or [])
    return _report_json(report, db, include_contact=include_contact, include_internal_notes=include_notes)


@api.patch("/reports/{report_id}/status")
def update_report_status(
    report_id: str,
    payload: StatusUpdate,
    user: User = Depends(admin_user),
    db: Session = Depends(get_db),
):
    _require_scoped_permission(user, "reports:manage")
    report = _get_scoped_report(db, report_id, user)
    if payload.status in {"in_progress", "completed"}:
        raise HTTPException(status_code=422, detail="Use cleanup operations to update cleanup status.")
    if payload.status == "cleaned":
        raise HTTPException(status_code=422, detail="A report can only be marked cleaned through photo-verified cleanup operations.")
    previous_status = report.status
    report.status = payload.status
    report.updated_at = utc_now()
    _audit(db, "report.status_changed", actor=user, report=report, details={
        "from": previous_status,
        "to": payload.status,
    })
    db.commit()
    db.refresh(report)
    include_contact = user.role == "super_admin" or "citizens:read" in (user.permissions or [])
    include_notes = user.role == "super_admin" or "notes:read" in (user.permissions or [])
    return _report_json(report, db, include_contact=include_contact, include_internal_notes=include_notes)


@api.patch("/reports/{report_id}/notes")
def update_internal_notes(
    report_id: str,
    payload: InternalNoteUpdate,
    user: User = Depends(admin_user),
    db: Session = Depends(get_db),
):
    _require_scoped_permission(user, "notes:manage")
    report = _get_scoped_report(db, report_id, user)
    report.internal_notes = payload.note.strip()
    report.updated_at = utc_now()
    _audit(db, "report.internal_notes_updated", actor=user, report=report)
    db.commit()
    return {"reportId": report.id, "internalNotes": report.internal_notes}


@api.get("/reports/{report_id}/history")
def report_history(
    report_id: str,
    user: User = Depends(admin_user),
    db: Session = Depends(get_db),
):
    _require_scoped_permission(user, "audit:read")
    report = _get_scoped_report(db, report_id, user, conceal_forbidden=True)
    rows = db.scalars(select(AuditLog).where(
        AuditLog.report_id == report.id,
        AuditLog.municipality_id == report.municipality_id,
    ).order_by(AuditLog.created_at.desc())).all()
    return [{
        "id": row.id,
        "action": row.action,
        "details": row.details,
        "createdAt": row.created_at.isoformat(),
        "actorName": (db.get(User, row.actor_user_id).name if row.actor_user_id and db.get(User, row.actor_user_id) else None),
    } for row in rows]


@api.delete("/reports/{report_id}", status_code=204)
def delete_admin_report(
    report_id: str,
    user: User = Depends(admin_user),
    db: Session = Depends(get_db),
):
    _require_scoped_permission(user, "reports:delete")
    report = _get_scoped_report(db, report_id, user)
    cleanup = db.scalar(select(Cleanup).where(Cleanup.report_id == report_id))
    if cleanup:
        _remove_local_image(cleanup.after_image_url)
        db.delete(cleanup)
    _remove_local_image(report.image_url)
    _audit(db, "report.deleted", actor=user, report=report)
    db.delete(report)
    db.commit()
    return Response(status_code=204)


@api.get("/cleanups")
def list_cleanups(
    status: Literal["all", "pending", "in_progress", "completed"] = "all",
    user: User = Depends(admin_user),
    db: Session = Depends(get_db),
):
    _require_scoped_permission(user, "cleanups:read")
    report_query = _scope_report_query(select(Report.id), user)
    report_ids = db.scalars(report_query).all()
    if not report_ids:
        return []
    query = select(Cleanup).where(Cleanup.report_id.in_(report_ids))
    if status != "all":
        query = query.where(Cleanup.status == status)
    cleanups = db.scalars(query.order_by(Cleanup.created_at.desc())).all()
    return [_cleanup_json(item) for item in cleanups]


@api.post("/cleanups", status_code=201)
def create_cleanup(
    payload: CleanupCreate,
    user: User = Depends(admin_user),
    db: Session = Depends(get_db),
):
    _require_scoped_permission(user, "cleanups:manage")
    report = _get_scoped_report(db, payload.report_id, user)
    existing = db.scalar(select(Cleanup).where(Cleanup.report_id == report.id))
    scheduled_date = payload.scheduled_date or (utc_now() + timedelta(days=1)).date().isoformat()
    if existing:
        existing.status = "pending"
        existing.assigned_team = payload.assigned_team
        existing.scheduled_date = scheduled_date
        existing.updated_at = utc_now()
        cleanup = existing
    else:
        cleanup = Cleanup(
            id=f"CLN-{uuid.uuid4().hex[:8].upper()}",
            report_id=report.id,
            task_name=f"{report.title} Clearance",
            location=report.address or "Reported Location",
            assigned_team=payload.assigned_team,
            scheduled_date=scheduled_date,
            status="pending",
            priority=report.severity,
            estimated_hours=3.5 if report.estimated_kg > 20 else 1.5,
            waste_volume_estimate=f"{report.estimated_kg:g} kg",
            before_image_url=report.image_url,
            notes=f"Generated from incident report ({report.id}): {report.description}",
        )
        db.add(cleanup)
    old_status = report.status
    report.status = "scheduled"
    report.updated_at = utc_now()
    _audit(db, "cleanup.dispatched", actor=user, report=report, details={
        "assignedTeam": payload.assigned_team,
        "previousReportStatus": old_status,
    })
    db.commit()
    db.refresh(cleanup)
    return _cleanup_json(cleanup)


def _get_scoped_cleanup(db: Session, cleanup_id: str, user: User) -> tuple[Cleanup, Report]:
    cleanup = db.get(Cleanup, cleanup_id)
    if not cleanup:
        raise HTTPException(status_code=404, detail="Cleanup task not found.")
    report = _get_scoped_report(db, cleanup.report_id, user)
    return cleanup, report


@api.patch("/cleanups/{cleanup_id}/status")
def update_cleanup_status(
    cleanup_id: str,
    payload: StatusUpdate,
    user: User = Depends(admin_user),
    db: Session = Depends(get_db),
):
    _require_scoped_permission(user, "cleanups:manage")
    cleanup, report = _get_scoped_cleanup(db, cleanup_id, user)
    if payload.status not in {"pending", "in_progress", "completed"}:
        raise HTTPException(status_code=422, detail="Cleanup status must be pending, in_progress, or completed.")
    if payload.status == "completed" and not (payload.after_image_url or cleanup.after_image_url):
        raise HTTPException(status_code=422, detail="Upload an after-cleanup photo before completing this task.")
    if payload.after_image_url:
        cleanup.after_image_url = _image_url(payload.after_image_url, cleanup.id)
    old_status = cleanup.status
    cleanup.status = payload.status
    cleanup.updated_at = utc_now()
    cleanup.completed_at = utc_now() if payload.status == "completed" else None
    report.status = "cleaned" if payload.status == "completed" else "scheduled"
    report.updated_at = utc_now()
    _audit(db, "cleanup.status_changed", actor=user, report=report, details={
        "cleanupId": cleanup.id,
        "from": old_status,
        "to": payload.status,
    })
    db.commit()
    db.refresh(cleanup)
    return _cleanup_json(cleanup)


@api.patch("/cleanups/{cleanup_id}/assign")
def assign_cleanup(
    cleanup_id: str,
    payload: CleanupAssign,
    user: User = Depends(admin_user),
    db: Session = Depends(get_db),
):
    _require_scoped_permission(user, "cleanups:manage")
    cleanup, report = _get_scoped_cleanup(db, cleanup_id, user)
    cleanup.assigned_team = payload.assigned_team.strip()
    cleanup.scheduled_date = payload.scheduled_date
    cleanup.updated_at = utc_now()
    _audit(db, "cleanup.assigned", actor=user, report=report, details={
        "cleanupId": cleanup.id,
        "assignedTeam": cleanup.assigned_team,
        "scheduledDate": cleanup.scheduled_date,
    })
    db.commit()
    db.refresh(cleanup)
    return _cleanup_json(cleanup)


@api.get("/hotspots")
def list_admin_hotspots(
    sort_by: Literal["priority", "recurrence", "date"] = Query(default="priority"),
    user: User = Depends(admin_user),
    db: Session = Depends(get_db),
):
    _require_scoped_permission(user, "analytics:read")
    hotspots = _hotspots(_scoped_reports(db, user), db)
    sort_key = {
        "priority": lambda item: item["priorityScore"],
        "recurrence": lambda item: item["recurrenceCount"],
        "date": lambda item: item["lastReportedDate"],
    }[sort_by]
    return sorted(hotspots, key=sort_key, reverse=True)


@api.get("/hotspots/{hotspot_id}")
def get_admin_hotspot(
    hotspot_id: str,
    user: User = Depends(admin_user),
    db: Session = Depends(get_db),
):
    _require_scoped_permission(user, "analytics:read")
    hotspot = next((item for item in _hotspots(_scoped_reports(db, user), db) if item["id"] == hotspot_id), None)
    if not hotspot:
        raise HTTPException(status_code=404, detail="Hotspot not found.")
    return hotspot


@api.get("/analytics/metrics")
def get_analytics_metrics(
    user: User = Depends(admin_user),
    db: Session = Depends(get_db),
):
    _require_scoped_permission(user, "analytics:read")
    reports = _scoped_reports(db, user)
    return _metrics(reports, _cleanup_rows_for_reports(db, reports), db)


@api.get("/analytics/trends")
def get_analytics_trends(
    user: User = Depends(admin_user),
    db: Session = Depends(get_db),
):
    _require_scoped_permission(user, "analytics:read")
    reports = _scoped_reports(db, user)
    now = datetime.now(timezone.utc)
    trends = []
    for offset in range(5, -1, -1):
        month_number = now.month - offset
        year = now.year
        while month_number <= 0:
            month_number += 12
            year -= 1
        month_start = datetime(year, month_number, 1, tzinfo=timezone.utc)
        next_month = (month_start.replace(day=28) + timedelta(days=4)).replace(day=1)
        month_reports = []
        for report in reports:
            reported_at = report.reported_at.replace(tzinfo=timezone.utc) if report.reported_at.tzinfo is None else report.reported_at
            if month_start <= reported_at < next_month:
                month_reports.append(report)
        trends.append({
            "month": month_start.strftime("%b"),
            "reports": len(month_reports),
            "resolved": sum(report.status == "cleaned" for report in month_reports),
            "hotspotAlerts": 0,
        })
    return trends


@api.get("/analytics/categories")
def get_analytics_categories(
    user: User = Depends(admin_user),
    db: Session = Depends(get_db),
):
    _require_scoped_permission(user, "analytics:read")
    labels = {
        "plastic": ("Plastics & Packaging", "#184730"),
        "mixed": ("Mixed Public Litter", "#758F71"),
        "glass": ("Glass & Bottles", "#059669"),
        "paper": ("Paper & Cardboard", "#94AC90"),
        "hazardous": ("Hazardous & E-Waste", "#E11D48"),
        "metal": ("Metals & Scrap", "#D97706"),
        "organic": ("Organic Waste", "#65A30D"),
    }
    counts = Counter(report.category for report in _scoped_reports(db, user))
    total_reports = sum(counts.values())
    return [
        {
            "name": labels[key][0],
            "value": count / total_reports * 100,
            "color": labels[key][1],
        }
        for key, count in counts.items()
        if count and total_reports
    ]


@api.get("/admin/ward-stats")
def admin_ward_stats(
    user: User = Depends(admin_user),
    db: Session = Depends(get_db),
):
    _require_scoped_permission(user, "analytics:read")
    reports = _scoped_reports(db, user)
    by_ward: dict[str, dict] = {}
    for report in reports:
        ward_id = report.ward_id or "Unassigned ward"
        stats = by_ward.setdefault(ward_id, {"wardId": ward_id, "totalReports": 0, "cleanedReports": 0, "pendingReports": 0})
        stats["totalReports"] += 1
        stats["cleanedReports"] += report.status == "cleaned"
        stats["pendingReports"] += report.status == "pending"
    return list(by_ward.values())


@api.get("/admin/citizens")
def admin_citizens(
    user: User = Depends(admin_user),
    db: Session = Depends(get_db),
):
    _require_scoped_permission(user, "citizens:read")
    users = _reporters_for_scope(db, user)
    counts = dict(db.execute(
        select(Report.citizen_user_id, func.count(Report.id))
        .where(Report.citizen_user_id.in_([item.id for item in users]))
        .group_by(Report.citizen_user_id)
    ).all()) if users else {}
    return [{
        "id": citizen.id,
        "name": citizen.name,
        "email": citizen.email,
        "phone": citizen.phone,
        "reportCountInJurisdiction": counts.get(citizen.id, 0),
    } for citizen in users]


@api.get("/admin/cleanup-teams")
def admin_cleanup_teams(
    user: User = Depends(admin_user),
    db: Session = Depends(get_db),
):
    _require_scoped_permission(user, "cleanups:read")
    report_ids = db.scalars(_scope_report_query(select(Report.id), user)).all()
    if not report_ids:
        return []
    teams = db.execute(
        select(Cleanup.assigned_team, func.count(Cleanup.id))
        .where(Cleanup.report_id.in_(report_ids))
        .group_by(Cleanup.assigned_team)
        .order_by(Cleanup.assigned_team)
    ).all()
    return [{"team": team, "taskCount": count} for team, count in teams]


@api.get("/admin/municipality")
def admin_municipality(
    user: User = Depends(admin_user),
    db: Session = Depends(get_db),
):
    if user.role == "super_admin":
        return {"platformWide": True, "municipalities": [
            _municipality_json(item)
            for item in db.scalars(select(Municipality).order_by(Municipality.code)).all()
        ]}
    municipality = db.get(Municipality, user.municipality_id) if user.municipality_id else None
    if not municipality:
        raise HTTPException(status_code=403, detail="Your account is not assigned to a municipality.")
    return {
        **_municipality_json(municipality),
        "authorizedWardIds": user.authorized_ward_ids,
        "authorizedZoneIds": user.authorized_zone_ids,
    }


@api.get("/admin/notifications")
def admin_notifications(
    user: User = Depends(admin_user),
    db: Session = Depends(get_db),
):
    _require_scoped_permission(user, "notifications:read")
    rows = db.scalars(select(Notification).where(
        Notification.user_id == user.id,
        Notification.municipality_id == user.municipality_id,
    ).order_by(Notification.created_at.desc())).all()
    return [{
        "id": item.id,
        "reportId": item.report_id,
        "message": item.message,
        "readAt": item.read_at.isoformat() if item.read_at else None,
        "createdAt": item.created_at.isoformat(),
    } for item in rows]


@api.patch("/admin/notifications/{notification_id}/read")
def mark_notification_read(
    notification_id: str,
    user: User = Depends(admin_user),
    db: Session = Depends(get_db),
):
    _require_scoped_permission(user, "notifications:read")
    notification = db.scalar(select(Notification).where(
        Notification.id == notification_id,
        Notification.user_id == user.id,
        Notification.municipality_id == user.municipality_id,
    ))
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found.")
    notification.read_at = utc_now()
    db.commit()
    return {"id": notification.id, "readAt": notification.read_at.isoformat()}


@api.get("/superadmin/municipalities")
def superadmin_list_municipalities(
    _: User = Depends(super_admin),
    db: Session = Depends(get_db),
):
    return [
        _municipality_json(item)
        for item in db.scalars(select(Municipality).order_by(Municipality.code)).all()
    ]


@api.post("/superadmin/municipalities", status_code=201)
def superadmin_create_municipality(
    payload: MunicipalityCreate,
    actor: User = Depends(super_admin),
    db: Session = Depends(get_db),
):
    code = payload.code.strip().upper()
    if db.get(Municipality, code) or db.scalar(select(Municipality.id).where(Municipality.code == code)):
        raise HTTPException(status_code=409, detail="Municipality code is already registered.")
    geometry = _geometry_only(payload.boundary_geojson)
    municipality = Municipality(
        id=code,
        code=code,
        name=payload.name.strip(),
        boundary_geojson=geometry,
        boundary_source=payload.boundary_source.strip(),
        boundary_updated_at=utc_now(),
        active=True,
    )
    db.add(municipality)
    db.flush()
    _replace_wards(db, municipality.id, payload.ward_boundaries, municipality.boundary_source)
    _audit(db, "municipality.created", actor=actor, municipality_id=municipality.id)
    db.commit()
    return _municipality_json(municipality)


@api.put("/superadmin/municipalities/{municipality_code}/boundary")
def superadmin_update_boundary(
    municipality_code: str,
    payload: BoundaryUpdate,
    actor: User = Depends(super_admin),
    db: Session = Depends(get_db),
):
    code = municipality_code.strip().upper()
    municipality = db.scalar(select(Municipality).where(Municipality.code == code))
    if not municipality:
        raise HTTPException(status_code=404, detail="Municipality not found.")
    municipality.boundary_geojson = _geometry_only(payload.geometry)
    municipality.boundary_source = payload.source.strip()
    municipality.boundary_updated_at = utc_now()
    _replace_wards(db, municipality.id, payload.wards, municipality.boundary_source)
    _audit(db, "municipality.boundary_updated", actor=actor, municipality_id=municipality.id, details={
        "source": municipality.boundary_source,
        "wardBoundaryCount": len(payload.wards),
    })
    db.commit()
    return _municipality_json(municipality)


@api.post("/superadmin/admins", status_code=201)
def superadmin_create_municipal_admin(
    payload: MunicipalAdminCreate,
    actor: User = Depends(super_admin),
    db: Session = Depends(get_db),
):
    municipality = db.scalar(select(Municipality).where(
        Municipality.code == payload.municipality_code.strip().upper(),
        Municipality.active.is_(True),
    ))
    if not municipality:
        raise HTTPException(status_code=404, detail="Active municipality not found.")
    if db.scalar(select(User.id).where(User.email == payload.email)):
        raise HTTPException(status_code=409, detail="An account with this email already exists.")
    invalid_permissions = set(payload.permissions) - ADMIN_PERMISSIONS
    if invalid_permissions:
        raise HTTPException(status_code=422, detail=f"Unsupported permissions: {', '.join(sorted(invalid_permissions))}.")
    user = User(
        id=f"ADM-{secrets.token_hex(8).upper()}",
        email=payload.email,
        password_hash=hash_password(payload.password),
        name=payload.name.strip(),
        phone=payload.phone.strip() if payload.phone else None,
        role="municipal_admin",
        municipality_id=municipality.id,
        authorized_ward_ids=payload.authorized_ward_ids,
        authorized_zone_ids=payload.authorized_zone_ids,
        permissions=payload.permissions,
        active=True,
    )
    db.add(user)
    _audit(db, "municipal_admin.created", actor=actor, municipality_id=municipality.id, details={
        "adminId": user.id,
        "permissions": payload.permissions,
    })
    db.commit()
    return user_json(user, municipality.name)


@api.get("/superadmin/reports/pending-jurisdiction")
def superadmin_pending_reports(
    _: User = Depends(super_admin),
    db: Session = Depends(get_db),
):
    reports = db.scalars(select(Report).where(
        Report.jurisdiction_status == "pending",
        Report.municipality_id.is_(None),
    ).order_by(Report.reported_at.desc())).all()
    return [_report_json(report, db, include_contact=True) for report in reports]


@api.post("/superadmin/reports/{report_id}/jurisdiction")
def superadmin_resolve_jurisdiction(
    report_id: str,
    payload: JurisdictionCorrection,
    actor: User = Depends(super_admin),
    db: Session = Depends(get_db),
):
    report = db.get(Report, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")
    municipality = db.scalar(select(Municipality).where(
        Municipality.code == payload.municipality_code.strip().upper(),
        Municipality.active.is_(True),
    ))
    if not municipality or not municipality.boundary_geojson:
        raise HTTPException(status_code=404, detail="Municipality boundary not found.")
    if not geometry_contains(municipality.boundary_geojson, report.longitude, report.latitude):
        raise HTTPException(status_code=422, detail="The selected municipality boundary does not contain this report location.")
    previous_source = report.jurisdiction_assignment_source
    report.municipality_id = municipality.id
    report.jurisdiction_status = "assigned"
    report.jurisdiction_assignment_source = "superadmin-override"
    report.jurisdiction_assignment_date = utc_now()
    ward_matches = db.scalars(select(WardBoundary).where(WardBoundary.municipality_id == municipality.id)).all()
    matching_wards = [ward for ward in ward_matches if geometry_contains(ward.geometry, report.longitude, report.latitude)]
    report.ward_id = matching_wards[0].ward_id if len(matching_wards) == 1 else None
    report.zone_id = matching_wards[0].zone_id if len(matching_wards) == 1 else None
    admins = db.scalars(select(User).where(
        User.role == "municipal_admin",
        User.municipality_id == municipality.id,
        User.active.is_(True),
    )).all()
    for administrator in admins:
        if _ward_scope_applies(administrator, report) and "notifications:read" in (administrator.permissions or []):
            db.add(Notification(
                id=uuid.uuid4().hex,
                user_id=administrator.id,
                municipality_id=municipality.id,
                report_id=report.id,
                message="A litter report was assigned to your jurisdiction after review.",
            ))
    _audit(db, "report.jurisdiction_corrected", actor=actor, report=report, details={
        "fromSource": previous_source,
        "toMunicipality": municipality.code,
        "reason": payload.reason,
    })
    db.commit()
    db.refresh(report)
    return _report_json(report, db, include_contact=True)


@api.get("/superadmin/audit")
def superadmin_audit(
    limit: int = Query(default=200, ge=1, le=1000),
    _: User = Depends(super_admin),
    db: Session = Depends(get_db),
):
    rows = db.scalars(select(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit)).all()
    return [{
        "id": row.id,
        "actorUserId": row.actor_user_id,
        "municipalityId": row.municipality_id,
        "reportId": row.report_id,
        "action": row.action,
        "details": row.details,
        "createdAt": row.created_at.isoformat(),
    } for row in rows]
