from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
from dotenv import load_dotenv

from app.database import engine, Base, cleanup, get_db
from app.utils.logger import log_event
from app.utils.seeder import seed_data_if_needed
from app.routers import payments, invoices, summary, assistant, logs
from app.models.payments import Payment
from app.models.invoices import Invoice

load_dotenv()

# Lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting system... Initializing database...")

    # create tables
    Base.metadata.create_all(bind=engine)

    def seed_db():
        db = next(get_db())
        try:
            seed_data_if_needed(db)
        finally:
            db.close()

    await asyncio.to_thread(seed_db)

    await asyncio.to_thread(lambda: log_event("SYSTEM_STARTUP", "Mock data seeded"))

    print("Startup complete.")

    yield  # app runs

    await asyncio.to_thread(cleanup)

def create_app() -> FastAPI:
    app = FastAPI(
        title="Data Agent Simulation API",
        version="1.0.0",
        description="Simulated Payments & Invoices Agents with Summary and AI Assistant",
        lifespan=lifespan
    )

    

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
    )

    # Routers
    app.include_router(payments.router, prefix="/api")
    app.include_router(invoices.router, prefix="/api")
    app.include_router(summary.router, prefix="/api")
    app.include_router(assistant.router, prefix="/api")
    app.include_router(logs.router, prefix="/api")

    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
