from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession 
from typing import List, Dict, Any
from sqlalchemy.orm import selectinload
from schemas.schemas import UserResponse, UserCreate, Trip as TripSchema
from sqlalchemy import select
from db.db import get_async_session
from utils.auth import get_password_hash, verify_password
from db import models
from passlib.context import CryptContext
router = APIRouter(prefix="/users", tags=["users"])

UserModel = models.User
@router.get("/", response_model=List[UserResponse])
async def list_users(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(models.User).offset(skip).limit(limit)
    )
    return result.scalars().all()

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: AsyncSession = Depends(get_async_session)):
    user = await db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/{user_id}", status_code=204)
async def delete_user(user_id: int, db: AsyncSession = Depends(get_async_session)):
    user = await db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    await db.delete(user)
    try:
        await db.commit()
    except Exception:
        await db.rollback()
        raise

@router.post("/signup", response_model=UserResponse)
async def signup_user(user_in: UserCreate, db: AsyncSession = Depends(get_async_session)):
    # 1. HASH THE PASSWORD
    hashed_password = get_password_hash(user_in.password)
    
    # 2. Create the user model with the HASHED password
    db_user = models.User(
       email=user_in.email,
        username=user_in.username,
        full_name=user_in.full_name, 
        hashed_password=hashed_password,
        is_active=True
    )
    
    db.add(db_user)
    try:
        await db.commit()
        await db.refresh(db_user)
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Signup failed, possibly duplicate email/username.")                        
    return db_user

# @router.get("/{user_id}/trips", response_model=List[TripSchema])
# async def get_user_trips(user_id: int, db: AsyncSession = Depends(get_async_session)):
#     result = await db.execute(
#         select(UserModel)
#         .filter_by(id=user_id)
#         .options(
#             selectinload(UserModel.trips),
#         )
#     )
#     user = result.scalars().first()
#     if not user:
#         raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")
#     user_trips = user.trips
#     return user_trips

@router.post("/login", response_model=UserResponse)
async def login_user(username: str = Form(...), password: str = Form(...), db: AsyncSession = Depends(get_async_session)):
    # 1. Retrieve the user by email/username
    result = await db.execute(
        select(models.User).where(models.User.username == username) 
        
    )
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username")
    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid password")
        
    # 3. Successful login
    return user
