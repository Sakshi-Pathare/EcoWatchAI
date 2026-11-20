import os
from functools import lru_cache
from pathlib import Path


@lru_cache(maxsize=1)
def _get_model():
    model_path = os.getenv("YOLO_MODEL_PATH", "").strip()
    if not model_path:
        return None

    try:
        from ultralytics import YOLO
    except ImportError as exc:
        raise RuntimeError(
            "YOLO_MODEL_PATH is set, but the optional 'ultralytics' package is not installed."
        ) from exc

    if not Path(model_path).is_file():
        raise RuntimeError(f"YOLO model file does not exist: {model_path}")
    return YOLO(model_path)


def detector_status():
    model_path = os.getenv("YOLO_MODEL_PATH", "").strip()
    if not model_path:
        return {
            "available": False,
            "model": None,
            "message": "No trained detector configured. Reports remain manually classified.",
        }
    try:
        _get_model()
    except RuntimeError as exc:
        return {"available": False, "model": model_path, "message": str(exc)}
    return {"available": True, "model": Path(model_path).name, "message": "YOLO detector ready."}


def detect_objects(image_path: Path):
    model = _get_model()
    if model is None:
        return [], "AI detector not configured; report classification is user-provided."

    results = model.predict(source=str(image_path), verbose=False)
    detections = []
    for result in results:
        names = result.names
        boxes = result.boxes
        if boxes is None:
            continue
        for box in boxes:
            class_id = int(box.cls.item())
            coordinates = [round(float(value), 2) for value in box.xyxy[0].tolist()]
            detections.append({
                "label": str(names[class_id]),
                "confidence": round(float(box.conf.item()), 4),
                "box": coordinates,
            })

    if detections:
        note = f"YOLO detected {len(detections)} object(s); confirm waste classification during review."
    else:
        note = "YOLO found no objects above the model confidence threshold."
    return detections, note
