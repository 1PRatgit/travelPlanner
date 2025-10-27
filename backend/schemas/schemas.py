from __future__ import annotations
from pydantic import BaseModel, Field
from datetime import date, time,datetime
from sqlalchemy import Date
from typing import List, Optional


# ******* Trip Schemas *******

class TripBase(BaseModel):
    """Base schema for creating and updating a Trip."""
    title: str 
    category: Optional[str] = None
    destination: str 
    start_date: date  
    end_date: date   
    estimated_budget: Optional[float] = None
    preferences: Optional[dict] = None
    notes: Optional[str] = None
    # accommodation_id: Optional[int] = None

class TripCreate(TripBase):
    """Schema for creating a new Trip."""
    # id will be auto-generated and passed via URL path in the API, so no need to include it here
    pass

class Trip(TripBase):
    """Schema for reading (returning) Trip data."""
    id: int
    is_deleted: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime
    itineraries: List[ItineraryDay] = Field(default_factory=list, alias="itineraries")
    trip_to_accommodation: List[Accommodation] = Field(default_factory=list, alias="accommodations")

    class Config:
        from_attributes= True  # Allows Pydantic to read data directly from SQLAlchemy models
        populate_by_name = True  # To allow using alias names during population

# ******* Accommodation Schemas *******

class AccommodationBase(BaseModel):
    title: str = Field(..., max_length=255)
    booking_ref: Optional[str] = Field(None, max_length=100)
    location: str 
    check_in: datetime = Field(alias="check_in")
    check_out: datetime = Field(alias="check_out")
    cost: Optional[float] = None
    trip_id: int

class AccommodationCreate(AccommodationBase):
    # Note: trip_id is often passed via the URL path in the API, not the body
    pass

class Accommodation(AccommodationBase):
    id: int

    class Config:
        from_attributes= True  # Allows Pydantic to read data directly from SQLAlchemy models

# ******* Itinerary Day Schemas *******

class ItineraryDayBase(BaseModel):
    day_number: int
    Date: date 
    transport_id: Optional[int] = None

class ItineraryDayCreate(ItineraryDayBase):
    activities_in_day: list[ActivityCreate] = Field(default_factory=list)

class ItineraryDay(ItineraryDayBase):
    id: int
    trip_id: int
    activities_in_day: list[Activity] = Field(default_factory=list)
    class Config:
        from_attributes= True 

# ******* Activity Schemas *******

class ActivityBase(BaseModel):
    title: str = Field(..., max_length=255)
    category: str = Field(..., max_length=50, description="e.g., 'Sightseeing', 'Meal', 'Transit'")
    start_time: time
    end_time: Optional[time] = None
    location: Optional[str] = Field(None, max_length=255)
    notes: Optional[str] = None
    is_completed: bool = False
    activity_date: date
    cost: Optional[float] = None

class ActivityCreate(ActivityBase):
    pass

class Activity(ActivityBase):
    # id: int
    # itinerary_id: int
    class Config:
        from_attributes= True

# ******* User Schemas *******  
class UserBase(BaseModel):
    username: str = Field(..., max_length=150)
    email: str = Field(..., max_length=255)
    full_name: Optional[str] = Field(None, max_length=255)
    hashed_password: str 

class UserCreate(UserBase):
    pass
    
class UserResponse(UserBase):
    id: int
    is_active: bool
    class Config:
        from_attributes= True