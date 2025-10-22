from datetime import datetime, timezone
from sqlalchemy import Column, Date, Integer, String, DateTime, Boolean, ForeignKey, Float, JSON, Text
from sqlalchemy.orm import relationship
from db.db import Base # Assuming this is available

# Using singular class names for better SQLAlchemy practice

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    trips = relationship("Trip", back_populates="owner") 
    
class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    category = Column(String, index=True)
    destination = Column(String(255), index=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    estimated_budget = Column(Float)
    preferences = Column(JSON)
    is_deleted = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    notes = Column(Text)
    booking_ref = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # One-to-Many: Trip to Itinerary
    itineraries = relationship("Itinerary", back_populates="trip", cascade="all, delete-orphan")
    # One-to-Many: Trip to Accommodation
    accommodations = relationship("Accommodation", back_populates="trip", cascade="all, delete-orphan")
    # Many-to-One: Trip to User
    owner = relationship("User", back_populates="trips") # Matches 'trips' in User class
    
class Itinerary(Base):
    __tablename__ = "itineraries"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), index=True, nullable=False)
    day_number = Column(Integer, nullable=False)
    accommodation_id = Column(Integer, ForeignKey("accommodations.id"), nullable=True)
    transport_id = Column(Integer, nullable=True)
    # activity_id = Column(Integer, ForeignKey("activities.id"), nullable=True) - redundancy removed
    Date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))  
    
    # Many-to-One: Itinerary to Trip
    trip = relationship("Trip", back_populates="itineraries") # Matches 'itineraries' in Trip class
    # One-to-Many: Itinerary to Activity
    activities_in_day = relationship("Activity", back_populates="itinerary", cascade="all, delete-orphan",foreign_keys="[Activity.day_id]")
    # Many-to-One: Itinerary to Accommodation (Days stayed in an accommodation)
    accommodation_details = relationship("Accommodation", back_populates="days_stayed") # Matches 'days_stayed' in Accommodation class

class Accommodation(Base):
    __tablename__ = "accommodations"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), index=True, nullable=False)
    title = Column(String, nullable=False)
    booking_ref = Column(String)
    location = Column(String, nullable=False)
    check_in = Column(DateTime)
    check_out = Column(DateTime)
    cost = Column(Float)
    # One-to-Many: Accommodation to Itinerary (Which itinerary days use this accommodation)
    days_stayed = relationship("Itinerary", back_populates="accommodation_details")
    # Many-to-One: Accommodation to Trip
    trip = relationship("Trip", back_populates="accommodations") # Matches 'accommodations' in Trip class

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    day_id = Column(Integer, ForeignKey("itineraries.id"), index=True, nullable=False)
    title = Column(String, nullable=False)
    location = Column(String, nullable=False)
    activity_date = Column(DateTime)
    booking_reference = Column(String)
    cost = Column(Float)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    
    # Many-to-One: Activity to Itinerary (Day)
    itinerary = relationship("Itinerary", back_populates="activities_in_day") # Matches 'activities_in_day' in Itinerary class