import os
from pathlib import Path

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from dotenv import load_dotenv


BACKEND_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BACKEND_DIR / ".env")
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{(BACKEND_DIR / 'ecowatch.db').as_posix()}",
)

engine_options = {"pool_pre_ping": True}
if DATABASE_URL.startswith("sqlite"):
    engine_options["connect_args"] = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, **engine_options)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)

REPORT_COLUMNS = {
    "jurisdiction_status": "VARCHAR(24) NOT NULL DEFAULT 'pending'",
    "municipality_id": "VARCHAR(32)",
    "ward_id": "VARCHAR(80)",
    "zone_id": "VARCHAR(80)",
    "jurisdiction_assignment_source": "VARCHAR(40) NOT NULL DEFAULT 'unresolved'",
    "jurisdiction_assignment_date": "DATETIME",
    "citizen_user_id": "VARCHAR(32)",
    "internal_notes": "TEXT NOT NULL DEFAULT ''",
}


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def migrate_existing_schema():
    if "reports" not in inspect(engine).get_table_names():
        return
    columns = {column["name"] for column in inspect(engine).get_columns("reports")}
    datetime_type = "TIMESTAMP WITH TIME ZONE" if engine.dialect.name == "postgresql" else "DATETIME"
    report_columns = dict(REPORT_COLUMNS)
    report_columns["jurisdiction_assignment_date"] = datetime_type
    with engine.begin() as connection:
        for column_name, definition in report_columns.items():
            if column_name not in columns:
                connection.execute(text(f"ALTER TABLE reports ADD COLUMN {column_name} {definition}"))
