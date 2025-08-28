"""
Database models for Kenya Climate Change PWA
"""
from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
from geoalchemy2 import Geometry
import uuid
from datetime import datetime

Base = declarative_base()

class County(Base):
    """Kenya Counties Model"""
    __tablename__ = "counties"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True)
    code = Column(String(10), unique=True, index=True)
    geometry = Column(Geometry('POLYGON'))  # County boundaries
    population = Column(Integer)
    area_km2 = Column(Float)
    capital = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)

class ClimateData(Base):
    """Satellite and climate data from GEE"""
    __tablename__ = "climate_data"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    county_id = Column(Integer, index=True)
    date = Column(DateTime, index=True)
    
    # Satellite data
    ndvi_mean = Column(Float)  # Vegetation index
    ndvi_min = Column(Float)
    ndvi_max = Column(Float)
    
    # Weather data
    temperature_mean = Column(Float)  # Celsius
    temperature_min = Column(Float)
    temperature_max = Column(Float)
    rainfall = Column(Float)  # mm
    humidity = Column(Float)  # %
    
    # Additional metrics
    drought_risk = Column(Float)  # 0-1 scale
    flood_risk = Column(Float)   # 0-1 scale
    
    # Metadata
    data_source = Column(String(50))  # 'GEE', 'OPENWEATHER', etc.
    created_at = Column(DateTime, default=datetime.utcnow)

class CommunityReport(Base):
    """Community-reported climate events"""
    __tablename__ = "community_reports"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Location
    county_id = Column(Integer, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    location_name = Column(String(200))
    
    # Report details
    event_type = Column(String(50), index=True)  # 'flood', 'drought', 'crop_damage'
    severity = Column(String(20))  # 'low', 'medium', 'high', 'critical'
    description = Column(Text)
    
    # Reporter info
    reporter_phone = Column(String(20))
    reporter_name = Column(String(100))
    
    # Verification
    verification_status = Column(String(20), default='unverified')  # 'verified', 'pending', 'unverified', 'false'
    trust_score = Column(Float, default=0.0)  # 0-1 scale
    verification_method = Column(String(50))  # 'satellite', 'clustering', 'manual'
    
    # Media
    image_url = Column(String(500))
    
    # Timestamps
    event_date = Column(DateTime)
    reported_at = Column(DateTime, default=datetime.utcnow)
    verified_at = Column(DateTime)

class SMS_USSD_Log(Base):
    """Log of SMS and USSD interactions"""
    __tablename__ = "sms_ussd_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    phone_number = Column(String(20), index=True)
    service_type = Column(String(10))  # 'SMS' or 'USSD'
    
    # USSD specific
    session_id = Column(String(100))
    ussd_code = Column(String(20))
    menu_level = Column(Integer, default=0)
    
    # Message content
    message_in = Column(Text)  # User input
    message_out = Column(Text)  # System response
    
    # Metadata
    county_id = Column(Integer)
    status = Column(String(20))  # 'sent', 'delivered', 'failed'
    cost = Column(Float)  # Cost in KES
    
    created_at = Column(DateTime, default=datetime.utcnow)

class WeatherAlert(Base):
    """Weather alerts and predictions"""
    __tablename__ = "weather_alerts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    county_id = Column(Integer, index=True)
    alert_type = Column(String(50))  # 'drought', 'flood', 'storm', 'heatwave'
    severity = Column(String(20))    # 'low', 'medium', 'high', 'critical'
    
    title = Column(String(200))
    description = Column(Text)
    
    # Timing
    issued_at = Column(DateTime, default=datetime.utcnow)
    valid_from = Column(DateTime)
    valid_until = Column(DateTime)
    
    # ML predictions
    confidence = Column(Float)  # 0-1 scale
    prediction_model = Column(String(50))
    
    # Status
    is_active = Column(Boolean, default=True)
    notifications_sent = Column(Integer, default=0)

class UserSubscription(Base):
    """User subscriptions for alerts"""
    __tablename__ = "user_subscriptions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    phone_number = Column(String(20), index=True)
    county_id = Column(Integer, index=True)
    
    # Subscription preferences
    alert_types = Column(JSON)  # ['drought', 'flood', 'weather']
    preferred_language = Column(String(10), default='en')  # 'en', 'sw'
    
    # Status
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_alert_sent = Column(DateTime)

class CropSuitability(Base):
    """Crop suitability analysis results"""
    __tablename__ = "crop_suitability"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    county_id = Column(Integer, index=True)
    crop_type = Column(String(50))  # 'maize', 'beans', 'coffee', etc.
    
    # Suitability metrics
    suitability_score = Column(Float)  # 0-1 scale
    yield_prediction = Column(Float)   # Tons per hectare
    
    # Contributing factors
    climate_suitability = Column(Float)
    soil_suitability = Column(Float)
    water_availability = Column(Float)
    
    # Season
    season = Column(String(20))  # 'short_rains', 'long_rains', 'dry'
    year = Column(Integer)
    
    created_at = Column(DateTime, default=datetime.utcnow)
