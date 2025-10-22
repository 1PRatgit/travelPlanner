from __future__ import annotations
from pydantic import BaseModel, Field
from datetime import date, time,datetime
from typing import Optional


# ******* Trip Schemas *******

class TripBase(BaseModel):
    """Base schema for creating and updating a Trip."""
    title: str = Field(..., max_length=255)
    category: Optional[str] = Field(None, max_length=100)
    destination: str = Field(..., max_length=255)
    start_date: datetime
    end_date: datetime
    estimated_budget: Optional[float] = None
    preferences: Optional[dict] = None
    notes: Optional[str] = None
    booking_ref: Optional[str] = Field(None, max_length=100)

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
    days: list[ItineraryDay] = Field(default_factory=list)
    accommodations: list[Accommodation] = Field(default_factory=list)

    class Config:
        from_attributes= True  # Allows Pydantic to read data directly from SQLAlchemy models

# ******* Accommodation Schemas *******

class AccommodationBase(BaseModel):
    title: str = Field(..., max_length=255)
    booking_ref: Optional[str] = Field(None, max_length=100)
    location: str = Field(..., max_length=255)
    check_in_date: date
    check_out_date: date
    cost: Optional[float] = None

class AccommodationCreate(AccommodationBase):
    # Note: trip_id is often passed via the URL path in the API, not the body
    pass

class Accommodation(AccommodationBase):
    id: int
    trip_id: int

    class Config:
        from_attributes= True  # Allows Pydantic to read data directly from SQLAlchemy models

# ******* Itinerary Day Schemas *******

class ItineraryDayBase(BaseModel):
    day_number: int
    date: date
    accommodation_id: Optional[int] = None
    transport_id: Optional[int] = None
    activity_id: Optional[int] = None

class ItineraryDayCreate(ItineraryDayBase):
    activities: list[ActivityCreate] = Field(default_factory=list)

class ItineraryDay(ItineraryDayBase):
    id: int
    trip_id: int
    activities: list[Activity] = Field(default_factory=list)
    accommodation_details: Optional[Accommodation] = None
    class Config:
        from_attributes= True 

# ******* Activity Schemas *******

class ActivityBase(BaseModel):
    title: str = Field(..., max_length=255)
    category: str = Field(..., max_length=50, description="e.g., 'Sightseeing', 'Meal', 'Transit'")
    start_time: time
    end_time: Optional[time] = None
    location_name: Optional[str] = Field(None, max_length=255)
    notes: Optional[str] = None
    is_completed: bool = False

class ActivityCreate(ActivityBase):
    pass

class Activity(ActivityBase):
    id: int
    day_id: int

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