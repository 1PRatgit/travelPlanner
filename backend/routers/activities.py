from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
from db.db import get_async_session
from db import models
from schemas.schemas import ActivityCreate, Activity, ActivityUpdate

router = APIRouter(prefix = "/activities", tags=["activities"])

@router.post("/", response_model=Activity, status_code=status.HTTP_201_CREATED)
async def create_activity(request: Request,activity_in: ActivityCreate, db: AsyncSession = Depends(get_async_session)):
    body = await request.json()
    itinerary_id = body.get("itinerary_id")
    db_activity = models.Activity(**activity_in.model_dump(),itinerary_id=itinerary_id)
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

# # ***** To get a all activity by itinerary_id *****
# @router.get("/{activity_id}", response_model=Activity)
# async def get_activity(itinerary_id: int, db: AsyncSession = Depends(get_async_session)):
#     result = await db.execute(
#         select(models.Activity)
#         .filter_by(id=itinerary_id)
#         .options(
#             selectinload(models.Activity.itinerary),
#         )
#     )
#     activity = result.scalars().first()
#     if not activity:
#         raise HTTPException(status_code=404, detail="Activity not found")
        
#     return activity 

# ***** To get a specific activity by activities_id *****
@router.get("/{activity_id}", response_model=Activity)
async def get_activity(activity_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(models.Activity)
        .filter_by(id=activity_id)
        .options(
            selectinload(models.Activity.itinerary),
        )
    )
    activity = result.scalars().first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
        
    return activity 
# ***** To update a specific activity by ID *****
@router.patch("/{activity_id}", response_model=Activity, status_code=status.HTTP_200_OK)
async def update_activity(
    activity_id: int, 
    activity_data: ActivityUpdate, 
    db: AsyncSession = Depends(get_async_session)
    ):
    result = await db.execute(
        select(models.Activity).filter_by(id=activity_id)
    )
    db_activity = result.scalars().first()
    
    if not db_activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
        
    # 2. Update fields
    # model_dump(exclude_unset=True) ensures only fields present in the request are updated
    update_data = activity_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_activity, key, value)
        
    # 3. Commit and Reload
    try:
        await db.commit()
        await db.refresh(db_activity)
    except Exception as e:
        await db.rollback()
        # In a real app, log the error (e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update activity.")

    # 4. Reload the activity with relationships
    result = await db.execute(
        select(models.Activity)
        .filter_by(id=db_activity.id)
        .options(
            selectinload(models.Activity.itinerary),
        )
    )
    activity_with_rels = result.scalars().first()
    return activity_with_rels

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