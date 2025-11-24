# Dependency
from app.utils.logger import log_event
from sqlalchemy import (
    create_engine
)
from sqlalchemy.orm import declarative_base, sessionmaker, Session


# ---------- Config ----------
DB_URL = "sqlite:///./data.db"  # file-backed sqlite so data persists for the session
PAGE_DEFAULT = 1
PAGE_SIZE_DEFAULT = 10

LOG_MAX = 200

# ---------- DB Setup ----------
Base = declarative_base()
engine = create_engine(DB_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def cleanup():
    """
    Optional cleanup tasks on shutdown:
    - close connections
    - flush logs
    - stop background tasks
    """
    print("Running cleanup...")
    await log_event("SYSTEM_SHUTDOWN", "System is shutting down")
    engine.dispose()
    print("Cleanup complete.")