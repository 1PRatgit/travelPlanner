from datetime import datetime, timezone, date
from sqlalchemy import Column, Date, Integer, String, DateTime, Boolean, ForeignKey, Float, JSON, Text, Time
from sqlalchemy.orm import relationship,Mapped, mapped_column
from db.db import Base # Assuming this is available
import zoneinfo
# Using singular class names for better SQLAlchemy practice

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    # One-to-Many: User → Trip
    trips = relationship("Trip", back_populates="owner") 
    
class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    category = Column(String, index=True)
    destination = Column(String(255), index=True)
    start_date = Column(Date, nullable=False)  # Using Date for just date values
    end_date = Column(Date, nullable=False)    # Using Date for just date values
    estimated_budget = Column(Float)
    preferences = Column(JSON)
    is_deleted = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)  # Using DateTime for timestamp
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # One-to-Many: Trip to Itinerary
    # accommodation_id = Column(Integer, ForeignKey("accommodations.id"), nullable=True)
    # One-to-Many: Trip to Itinerary
    itineraries = relationship("Itinerary", back_populates="trip", cascade="all, delete-orphan")
    # Many-to-One: Trip to User
    owner = relationship("User", back_populates="trips") # Matches 'trips' in User class
     # One-to-Many: Itinerary to Accommodation (Days stayed in an accommodation)
    trip_to_accommodation = relationship(
        "Accommodation",
        back_populates="accommodation_to_trip",
        cascade="all, delete-orphan",
    )

    
class Itinerary(Base):
    __tablename__ = "itineraries"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), index=True, nullable=False)
    day_number = Column(Integer, nullable=False)
    transport_id = Column(Integer, nullable=True)
    Date = Column(Date, nullable=False)  # can't be Changed from Date to lowercase date coz table cant be altered
    created_at = Column(
    DateTime(timezone=True), # Correctly sets the 'timezone' keyword argument
    default=lambda: datetime.now(timezone.utc) # Ensures the default value is offset-aware UTC
    )
    updated_at = Column(
    DateTime(timezone=True),
    default=lambda: datetime.now(timezone.utc),
    onupdate=lambda: datetime.now(timezone.utc)
    )
    # Many-to-One: Itinerary to Trip
    trip = relationship("Trip", back_populates="itineraries", foreign_keys=[trip_id]) # Matches 'itineraries' in Trip class
    # One-to-Many: Itinerary to Activity
    activities_in_day = relationship(
        "Activity", back_populates="itinerary", cascade="all, delete-orphan")
   
class Accommodation(Base):
    __tablename__ = "accommodations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    booking_ref = Column(String)
    trip_id = Column(Integer, ForeignKey("trips.id"), index=True, nullable=False)
    location = Column(String, nullable=False)
    check_in = Column(
    DateTime(timezone=True),
    default=lambda: datetime.now(timezone.utc),
    onupdate=lambda: datetime.now(timezone.utc)
    )    # Using DateTime as it might include time
    check_out = Column(
    DateTime(timezone=True),
    default=lambda: datetime.now(timezone.utc),
    onupdate=lambda: datetime.now(timezone.utc)
    )
    # Using DateTime as it might include time
    cost = Column(Float)
    # Many-to-One: Accommodation to Trip
    accommodation_to_trip = relationship(
        "Trip", # Points to the "one" side
        back_populates="trip_to_accommodation",
        foreign_keys=[trip_id]
    )

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    itinerary_id = Column(Integer, ForeignKey("itineraries.id"), index=True, nullable=False)
    title = Column(String, nullable=False)
    location = Column(String, nullable=False)
    category = Column(String, nullable=False)
    start_time = Column(Time)  # Using DateTime as it includes time
    end_time = Column(Time)    # Using DateTime as it includes time
    notes = Column(Text)
    is_completed = Column(Boolean, default=False)
    activity_date = Column(Date)   
    cost = Column(Float)
    created_at = Column(
    DateTime(timezone=True), 
    default=lambda: datetime.now(timezone.utc) # Ensures the default value is offset-aware UTC
    )
    updated_at = Column(
    DateTime(timezone=True),
    default=lambda: datetime.now(timezone.utc),
    onupdate=lambda: datetime.now(timezone.utc)
    )
    # Many-to-One: Activity to Itinerary
    itinerary = relationship("Itinerary", back_populates="activities_in_day",foreign_keys=[itinerary_id])