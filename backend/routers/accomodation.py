from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
from db.db import get_async_session
from db import models
from schemas.schemas import AccommodationCreate, Accommodation

router = APIRouter(prefix="/accommodations", tags=["accommodations"])
AccommodationModel = models.Accommodation   

#***** To create an accommodation *****
@router.post("/", response_model=Accommodation, status_code=status.HTTP_201_CREATED)
async def create_accommodation(accommodation_in: AccommodationCreate, db: AsyncSession = Depends(get_async_session)):
    db_accommodation = AccommodationModel(**accommodation_in.model_dump())
    db.add(db_accommodation)
    try:
        await db.commit()
        await db.refresh(db_accommodation)
    except Exception:
        await db.rollback()
        raise

    # Reload the accommodation with relationships eagerly loaded before returning
    result = await db.execute(
        select(AccommodationModel)
        .filter_by(id=db_accommodation.id)
        .options(selectinload(AccommodationModel.accommodation_to_trip))
    )
    accommodation_with_rels = result.scalars().first()
    return accommodation_with_rels

#***** To list all accommodations for a specific trip *****
@router.get("/trip/{trip_id}", response_model=List[Accommodation])
async def list_accommodations_for_trip(trip_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(AccommodationModel)
        .filter_by(trip_id=trip_id)
        .options(
            selectinload(AccommodationModel.accommodation_to_trip),
        )
    )
    accommodations = result.scalars().all()
    if not accommodations:
        accommodations=[]
        raise HTTPException(status_code=404, detail="Trip not found")
    return accommodations  


#***** To get a specific accommodation by ID *****
@router.get("/{accommodation_id}", response_model=Accommodation)
async def get_accommodation(accommodation_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(AccommodationModel)
        .filter_by(id=accommodation_id)
        .options(
            selectinload(AccommodationModel.accommodation_to_trip),
        )
    )
    accommodation = result.scalars().first()
    if not accommodation:
        raise HTTPException(status_code=404, detail="Accommodation not found")
    return accommodation    

# ***** To delete a specific accommodation by ID *****
@router.delete("/{accommodation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_accommodation(accommodation_id: int, db: AsyncSession = Depends(get_async_session)): 
    result = await db.execute(
        select(AccommodationModel).filter_by(id=accommodation_id)
    )
    accommodation = result.scalars().first()
    if not accommodation:
        raise HTTPException(status_code=404, detail="Accommodation not found")
    
    await db.delete(accommodation)
    try:
        await db.commit()
    except Exception:
        await db.rollback()
        raise