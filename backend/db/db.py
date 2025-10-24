from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from core.config import settings
# from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import DeclarativeBase
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

engine = create_engine(settings.SQLALCHEMY_DATABASE_URL, echo=settings.DEBUG)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = DeclarativeBase()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)
      
class Base(DeclarativeBase):
    pass

ASYNC_DATABASE_URL = getattr(settings, "ASYNC_SQLALCHEMY_DATABASE_URL", settings.SQLALCHEMY_DATABASE_URL)

async_engine = create_async_engine(ASYNC_DATABASE_URL, echo=settings.DEBUG)
AsyncSessionLocal = async_sessionmaker(bind=async_engine, expire_on_commit=False, class_=AsyncSession)

# Async dependency for routes
async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise

# Helper to create tables (runs in sync context on the async engine)
async def create_tables():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

