from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from routers import trips as trips_router
from routers import users as users_router
from db.db import create_tables
import db.models  # ensure model classes are imported so Base.metadata includes them

app = FastAPI(
    title="Travel Planner Backend", 
    description="Backend functinalities for Travel Planner Application using FastAPI", 
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)
print(f" ***********************************CORS Allowed Origins: {settings.ALLOW_ORIGINS}")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(trips_router.router, prefix=settings.API_PREFIX)
app.include_router(users_router.router, prefix=settings.API_PREFIX)

@app.on_event("startup")
async def on_startup():
    await create_tables()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)