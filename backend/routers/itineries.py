from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
from db.db import get_async_session
from db import models
from schemas.schemas import ItineraryDayCreate, ItineraryDay, ActivityCreate, AccommodationCreate

router = APIRouter(prefix="/itineraries", tags=["itineraries"])
ItineraryModel = models.Itinerary


@router.post("/trips/{trip_id}/", response_model=ItineraryDay, status_code=status.HTTP_201_CREATED)
async def create_itinerary(
    trip_id: int,
    itinerary_data: ItineraryDayCreate, 
    db: AsyncSession = Depends(get_async_session)
    ):
    # 1. Create the Itinerary Day record
    # Use only the fields from the ItineraryDayBase part of the model
    db_itinerary = ItineraryModel(**itinerary_data.model_dump(
        exclude=['activities_in_day'] # Exclude related lists/objects
    ), trip_id=trip_id)
    db.add(db_itinerary)
    
    try:
        await db.commit()
        await db.refresh(db_itinerary)
    except Exception:
        await db.rollback("Failed to create itinerary day")
        raise

    # 2. Create activities and link them to the itinerary
    if itinerary_data.activities_in_day:
        db_activities = []
        for activity_in in itinerary_data.activities_in_day:
            # Directly create the Activity model instance
            db_activity = models.Activity(
                **activity_in.model_dump(),
                itinerary_id=db_itinerary.id 
            )
            db_activities.append(db_activity)
        db.add_all(db_activities)

        try:
            await db.commit()
        except Exception:
            await db.rollback()
            raise

    # 3. Reload the itinerary with relationships (Keep this logic)
    result = await db.execute(
        select(ItineraryModel)
        .filter_by(id=db_itinerary.id)
        .options(
            selectinload(ItineraryModel.activities_in_day),
        )
    )
    itinerary_with_rels = result.scalars().first()
    if not itinerary_with_rels:
        # Should not happen, but a safeguard
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Itinerary not found after creation.")
    return itinerary_with_rels

#***** To list all itineraries for a specific trip *****
@router.get("/trip/{trip_id}", response_model=List[ItineraryDay])
async def list_itineraries_for_trip(trip_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(ItineraryModel)
        .filter_by(trip_id=trip_id)
        .options(
            selectinload(ItineraryModel.trip),
            selectinload(ItineraryModel.activities_in_day),
        )
    )
    itineraries = result.scalars().all()
    if not itineraries:
        raise HTTPException(status_code=404, detail="Trip not found")
    return itineraries 

#***** To get a specific itinerary by ID *****
@router.get("/{itinerary_id}", response_model=ItineraryDay)
async def get_itinerary(itinerary_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(ItineraryModel)
        .filter_by(id=itinerary_id)
        .options(
            selectinload(ItineraryModel.trip),
            selectinload(ItineraryModel.activities_in_day),
        )
    )
    itinerary = result.scalars().first()
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    return itinerary



#***** To list all itineraries *****@router.get("/", response_model=List[Itinerary])
async def list_itineraries(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(ItineraryModel)
        .offset(skip)
        .limit(limit)
        .options(
            selectinload(ItineraryModel.trip),
            selectinload(ItineraryModel.activities_in_day),
        )
    )
    return result.scalars().all()

#***** To delete an itinerary *****
@router.delete("/{itinerary_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_itinerary(itinerary_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(ItineraryModel).filter_by(id=itinerary_id))
    obj = result.scalars().first()
    if not obj:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    await db.delete(obj)
    try:
        await db.commit()
    except Exception:
        await db.rollback()
        raise   
    return