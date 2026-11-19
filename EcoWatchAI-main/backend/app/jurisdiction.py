import math
import os

from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Municipality, WardBoundary


DEFAULT_BOUNDARY_MARGIN_METERS = 25.0


def _point_on_segment(x: float, y: float, start: list, end: list) -> bool:
    x1, y1 = float(start[0]), float(start[1])
    x2, y2 = float(end[0]), float(end[1])
    cross = (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1)
    if abs(cross) > 1e-10:
        return False
    return min(x1, x2) - 1e-10 <= x <= max(x1, x2) + 1e-10 and min(y1, y2) - 1e-10 <= y <= max(y1, y2) + 1e-10


def _ring_contains(x: float, y: float, ring: list) -> bool:
    inside = False
    for index, end in enumerate(ring):
        start = ring[index - 1]
        if _point_on_segment(x, y, start, end):
            return True
        x1, y1 = float(start[0]), float(start[1])
        x2, y2 = float(end[0]), float(end[1])
        if (y1 > y) != (y2 > y):
            intersection_x = (x2 - x1) * (y - y1) / (y2 - y1) + x1
            if x < intersection_x:
                inside = not inside
    return inside


def _polygon_contains(x: float, y: float, polygon: list) -> bool:
    if not polygon or not _ring_contains(x, y, polygon[0]):
        return False
    return not any(_ring_contains(x, y, hole) for hole in polygon[1:])


def geometry_contains(geometry: dict, longitude: float, latitude: float) -> bool:
    if not isinstance(geometry, dict):
        return False
    geometry_type = geometry.get("type")
    coordinates = geometry.get("coordinates")
    if geometry_type == "Feature":
        return geometry_contains(geometry.get("geometry") or {}, longitude, latitude)
    if geometry_type == "Polygon":
        return _polygon_contains(longitude, latitude, coordinates or [])
    if geometry_type == "MultiPolygon":
        return any(_polygon_contains(longitude, latitude, polygon) for polygon in coordinates or [])
    if geometry_type == "FeatureCollection":
        return any(geometry_contains(feature, longitude, latitude) for feature in geometry.get("features", []))
    return False


def _segment_distance_meters(
    longitude: float,
    latitude: float,
    start: list,
    end: list,
) -> float:
    latitude_scale = 111_320.0
    longitude_scale = latitude_scale * max(0.01, math.cos(math.radians(latitude)))
    x1 = (float(start[0]) - longitude) * longitude_scale
    y1 = (float(start[1]) - latitude) * latitude_scale
    x2 = (float(end[0]) - longitude) * longitude_scale
    y2 = (float(end[1]) - latitude) * latitude_scale
    delta_x = x2 - x1
    delta_y = y2 - y1
    length_squared = delta_x * delta_x + delta_y * delta_y
    fraction = 0 if length_squared == 0 else max(0, min(1, -(x1 * delta_x + y1 * delta_y) / length_squared))
    return math.hypot(x1 + fraction * delta_x, y1 + fraction * delta_y)


def _ring_distance_meters(longitude: float, latitude: float, ring: list) -> float:
    if not ring:
        return float("inf")
    return min(
        _segment_distance_meters(longitude, latitude, ring[index - 1], end)
        for index, end in enumerate(ring)
    )


def geometry_boundary_distance_meters(geometry: dict, longitude: float, latitude: float) -> float:
    if not isinstance(geometry, dict):
        return float("inf")
    geometry_type = geometry.get("type")
    coordinates = geometry.get("coordinates")
    if geometry_type == "Feature":
        return geometry_boundary_distance_meters(geometry.get("geometry") or {}, longitude, latitude)
    if geometry_type == "Polygon":
        polygons = [coordinates or []]
    elif geometry_type == "MultiPolygon":
        polygons = coordinates or []
    elif geometry_type == "FeatureCollection":
        return min(
            (geometry_boundary_distance_meters(feature, longitude, latitude) for feature in geometry.get("features", [])),
            default=float("inf"),
        )
    else:
        return float("inf")
    return min(
        (_ring_distance_meters(longitude, latitude, ring) for polygon in polygons for ring in polygon),
        default=float("inf"),
    )


def _boundary_margin_meters() -> float:
    configured = os.getenv("JURISDICTION_BOUNDARY_MARGIN_METERS", str(DEFAULT_BOUNDARY_MARGIN_METERS))
    try:
        return max(0.0, float(configured))
    except ValueError as exc:
        raise RuntimeError("JURISDICTION_BOUNDARY_MARGIN_METERS must be a non-negative number.") from exc


def resolve_jurisdiction(db: Session, latitude: float, longitude: float) -> dict:
    municipalities = db.scalars(
        select(Municipality).where(Municipality.active.is_(True)).order_by(Municipality.code)
    ).all()
    matches = [
        municipality
        for municipality in municipalities
        if municipality.boundary_geojson
        and geometry_contains(municipality.boundary_geojson, longitude, latitude)
    ]

    if len(matches) != 1:
        reason = "unknown" if not matches else "overlapping"
        return {
            "status": "pending",
            "municipality": None,
            "wardId": None,
            "zoneId": None,
            "source": f"boundary-{reason}",
        }

    municipality = matches[0]
    distance = geometry_boundary_distance_meters(municipality.boundary_geojson, longitude, latitude)
    if distance <= _boundary_margin_meters():
        return {
            "status": "pending",
            "municipality": None,
            "wardId": None,
            "zoneId": None,
            "source": "boundary-near-edge",
        }

    wards = db.scalars(
        select(WardBoundary).where(WardBoundary.municipality_id == municipality.id)
    ).all()
    ward_matches = [ward for ward in wards if geometry_contains(ward.geometry, longitude, latitude)]
    ward_id = ward_matches[0].ward_id if len(ward_matches) == 1 else None
    zone_id = ward_matches[0].zone_id if len(ward_matches) == 1 else None
    return {
        "status": "assigned",
        "municipality": municipality,
        "wardId": ward_id,
        "zoneId": zone_id,
        "source": "municipal-boundary",
    }
