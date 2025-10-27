from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
from db.db import get_async_session
from db import models
from schemas.schemas import ActivityCreate, Activity

router = APIRouter(prefix = "/activities", tags=["activities"])

@router.post("/", response_model=Activity, status_code=status.HTTP_201_CREATED)
async def create_activity(activity_in: ActivityCreate, db: AsyncSession = Depends(get_async_session)):
    db_activity = models.Activity(**activity_in.model_dump())
    db.add(db_activity)
    try:
        await db.commit()
        await db.refresh(db_activity)
    except Exception:
        await db.rollback()
        raise

    # Reload the activity with relationships eagerly loaded before returning
    result = await db.execute(
        select(models.Activity)
        .filter_by(id=db_activity.id)
        .options(
            selectinload(models.Activity.itinerary),
        )
    )
    activity_with_rels = result.scalars().first()
    return activity_with_rels

# **** To list all activities for a specific day *****
@router.get("/day/{itinerary_id}", response_model=List[Activity])
async def list_activities_for_day(itinerary_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(models.Activity)
        .filter_by(itinerary_id=itinerary_id)
        .options(
            selectinload(models.Activity.itinerary),
        )
    )
    activities = result.scalars().all()
    if not activities:
        activities = []
        # raise HTTPException(status_code=404, detail="Itinerary day not found")
    return activities

# ***** To get a all activity by itinerary_id *****
@router.get("/{Activity_id}", response_model=Activity)
async def get_activity(itinerary_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(models.Activity)
        .filter_by(id=itinerary_id)
        .options(
            selectinload(models.Activity.itinerary),
        )
    )
    activity = result.scalars().first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
        
    return activity 

# ***** To delete a specific activity by ID *****
@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_activity(activity_id: int, db: AsyncSession = Depends(get_async_session)): 
    result = await db.execute(
        select(models.Activity).filter_by(id=activity_id)
    )
    activity = result.scalars().first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    await db.delete(activity)
    try:
        await db.commit()
    except Exception:
        await db.rollback()
        raise
    return 

# update activity update db.act and db.itinerayry as well