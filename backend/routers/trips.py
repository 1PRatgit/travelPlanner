from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
from db.db import get_async_session
from db import models
from schemas.schemas import TripCreate, Trip

router = APIRouter(prefix="/trips", tags=["trips"])

TripModel = models.Trip

#***** To create a trip *****
@router.post("/{user_id}", response_model=Trip, status_code=status.HTTP_201_CREATED)
async def create_trip(trip_in: TripCreate,user_id:int, db: AsyncSession = Depends(get_async_session)):
    db_trip = TripModel(**trip_in.model_dump(), owner_id=user_id)  # owner_id placeholder
    db.add(db_trip)
    try:
        await db.commit()
        await db.refresh(db_trip)
    except Exception:
        await db.rollback()
        raise
    

    # Reload the trip with relationships eagerly loaded before returning
    result = await db.execute(
        select(TripModel)
        .filter_by(id=db_trip.id)
        .options(
            selectinload(TripModel.trip_to_accommodation),
            selectinload(TripModel.itineraries),
            selectinload(TripModel.owner),
            selectinload(TripModel.itineraries).selectinload(models.Itinerary.activities_in_day),
        )
    )
    trip_with_rels = result.scalars().first()
    return trip_with_rels

#***** To list all trips *****
@router.get("/", response_model=List[Trip])
async def list_trips(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(TripModel)
        .offset(skip)
        .limit(limit)
        .options(
            selectinload(TripModel.trip_to_accommodation),
            selectinload(TripModel.itineraries),
            selectinload(TripModel.owner),
            selectinload(TripModel.itineraries).selectinload(models.Itinerary.activities_in_day),
        )
    )
    return result.scalars().all()

#***** To get a specific trip by ID *****
@router.get("/{trip_id}", response_model=Trip)
async def get_trip(trip_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(TripModel)
        .filter_by(id=trip_id)
        .options(
            selectinload(TripModel.trip_to_accommodation),
            selectinload(TripModel.itineraries),
            selectinload(TripModel.owner),
            selectinload(TripModel.itineraries).selectinload(models.Itinerary.activities_in_day),
        )
    )
    obj = result.scalars().first()
    if not obj:
        raise HTTPException(status_code=404, detail="Trip not found")
    return obj

#***** To delete  a trip *****
@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trip(trip_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(TripModel).filter_by(id=trip_id))
    obj = result.scalars().first()
    if not obj:
        raise HTTPException(status_code=404, detail="Trip not found")
    await db.delete(obj)
    try:
        await db.commit()
    except Exception:
        await db.rollback()
        raise
    return

@router.get("/user/{user_id}", response_model=List[Trip])
async def get_user_trips(user_id: int, db: AsyncSession = Depends(get_async_session)):
   
    result = await db.execute(
        select(TripModel)
        .filter(TripModel.owner_id == user_id)
        .options(
            # Eagerly load all relationships required by the TripSchema
            selectinload(TripModel.trip_to_accommodation),
            selectinload(TripModel.itineraries),
            selectinload(TripModel.owner),
            selectinload(TripModel.itineraries).selectinload(models.Itinerary.activities_in_day),
        )
    )
    user_trips = result.scalars().all()
    if not user_trips:
        user_exists = await db.scalar(select(models.User).filter_by(owner_id=user_id))
        if not user_exists:
            raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")

    return user_trips