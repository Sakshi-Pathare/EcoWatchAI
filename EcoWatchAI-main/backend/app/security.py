import base64
import hashlib
import hmac
import os
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from .database import get_db
from .models import AuthSession, User


PASSWORD_ROUNDS = 310_000
SESSION_HOURS = 12
bearer_scheme = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    derived = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PASSWORD_ROUNDS)
    return "pbkdf2_sha256${}${}${}".format(
        PASSWORD_ROUNDS,
        base64.urlsafe_b64encode(salt).decode("ascii"),
        base64.urlsafe_b64encode(derived).decode("ascii"),
    )


def verify_password(password: str, encoded: str) -> bool:
    try:
        algorithm, rounds_text, salt_text, expected = encoded.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        salt = base64.urlsafe_b64decode(salt_text.encode("ascii"))
        actual = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, int(rounds_text))
        return hmac.compare_digest(
            base64.urlsafe_b64encode(actual).decode("ascii"),
            expected,
        )
    except (ValueError, TypeError):
        return False


def issue_session(db: Session, user: User) -> tuple[str, datetime]:
    token = secrets.token_urlsafe(36)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=SESSION_HOURS)
    token_hash = hashlib.sha256(token.encode("ascii")).hexdigest()
    db.add(AuthSession(token_hash=token_hash, user_id=user.id, expires_at=expires_at))
    return token, expires_at


def revoke_session(db: Session, token: str) -> None:
    token_hash = hashlib.sha256(token.encode("ascii")).hexdigest()
    session = db.get(AuthSession, token_hash)
    if session:
        db.delete(session)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sign in to access this resource.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_hash = hashlib.sha256(credentials.credentials.encode("ascii")).hexdigest()
    session = db.get(AuthSession, token_hash)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired session.")
    expires_at = session.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at <= datetime.now(timezone.utc):
        db.delete(session)
        db.commit()
        raise HTTPException(status_code=401, detail="Invalid or expired session.")

    user = db.get(User, session.user_id)
    if not user or not user.active:
        raise HTTPException(status_code=401, detail="Invalid or expired session.")
    return user


def require_roles(*roles: str):
    def dependency(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="Your account is not permitted to perform this action.")
        return user

    return dependency


def require_permissions(user: User, *permissions: str) -> None:
    if user.role == "super_admin":
        return
    granted = set(user.permissions or [])
    if any(permission not in granted for permission in permissions):
        raise HTTPException(status_code=403, detail="Your account does not have the required permission.")


def user_json(user: User, municipality_name: str | None = None) -> dict:
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "phone": user.phone,
        "role": user.role,
        "municipalityId": user.municipality_id,
        "municipalityCode": user.municipality_id,
        "municipalityName": municipality_name,
        "authorizedWardIds": user.authorized_ward_ids,
        "authorizedZoneIds": user.authorized_zone_ids,
        "permissions": user.permissions or [],
    }


def bootstrap_super_admin(db: Session) -> None:
    email = os.getenv("ECOWATCH_SUPERADMIN_EMAIL", "").strip().lower()
    password = os.getenv("ECOWATCH_SUPERADMIN_PASSWORD", "")
    if not email and not password:
        return
    if not email or len(password) < 12:
        raise RuntimeError(
            "Set both ECOWATCH_SUPERADMIN_EMAIL and ECOWATCH_SUPERADMIN_PASSWORD; "
            "the password must contain at least 12 characters."
        )

    existing = db.scalar(select(User).where(User.email == email))
    if existing:
        if existing.role != "super_admin":
            raise RuntimeError("The configured super-admin email is already assigned to a non-super-admin account.")
        return

    db.add(User(
        id=f"USR-{secrets.token_hex(12).upper()}",
        email=email,
        password_hash=hash_password(password),
        name="Vasundhara AI Super Admin",
        role="super_admin",
        permissions=["*"],
        active=True,
    ))
    db.commit()
