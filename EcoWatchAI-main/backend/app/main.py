import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .api import UPLOAD_DIR, api
from .database import Base, SessionLocal, engine, migrate_existing_schema
from .security import bootstrap_super_admin


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    migrate_existing_schema()
    with SessionLocal() as db:
        bootstrap_super_admin(db)
    yield


app = FastAPI(
    title="Vasundhara AI API",
    description="Municipality-routed litter reports, isolated municipal operations, cleanup workflows, and analytics.",
    version="2.0.0",
    lifespan=lifespan,
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173",
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "vasundhara-ai-api"}


app.include_router(api)
