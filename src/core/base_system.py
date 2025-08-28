# File: src/core/base_system.py

import os
from datetime import datetime
import logging
import asyncio
from typing import Dict, List, Optional

class KenyaClimateAIPlatform:
    """
    Main platform coordinator for all climate AI systems
    """
    def __init__(self):
        self.systems = {
            'agriculture': None,
            'early_warning': None,
            'carbon_monitoring': None,
            'smart_grid': None,
            'urban_climate': None
        }
        self.data_sources = {
            'weather_api': 'https://api.openweathermap.org/data/2.5',
            'satellite_imagery': 'sentinel_hub_api',
            'iot_sensors': 'mqtt_broker',
            'government_data': 'kenya_met_department'
        }
        self.setup_logging()

    def setup_logging(self):
        """Setup comprehensive logging system"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('climate_ai_platform.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)

    async def initialize_systems(self):
        """Initialize all AI systems"""
        try:
            # Import and initialize each system
            from agriculture.crop_prediction import KenyaAgricultureAI
            from early_warning.disaster_prediction import KenyaEarlyWarningSystem
            from carbon.monitoring_system import KenyaCarbonMonitoringAI
            from energy.smart_grid import KenyaSmartGridAI
            from energy.smart_grid import KenyaUrbanClimateAI
            
            self.systems['agriculture'] = KenyaAgricultureAI()
            self.systems['early_warning'] = KenyaEarlyWarningSystem()
            self.systems['carbon_monitoring'] = KenyaCarbonMonitoringAI()
            self.systems['smart_grid'] = KenyaSmartGridAI()
            self.systems['urban_climate'] = KenyaUrbanClimateAI()
            
            self.logger.info("All climate AI systems initialized successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"Error initializing systems: {str(e)}")
            return False

    async def get_comprehensive_climate_status(self, county: str) -> Dict:
        """
        Get comprehensive climate status for a specific county
        """
        results = {}
        
        # Parallel execution of different system queries
        tasks = []
        
        if self.systems['early_warning']:
            task = asyncio.create_task(
                self.get_disaster_risks(county)
            )
            tasks.append(('disaster_risks', task))
        
        if self.systems['agriculture']:
            task = asyncio.create_task(
                self.get_agriculture_insights(county)
            )
            tasks.append(('agriculture', task))
        
        if self.systems['carbon_monitoring']:
            task = asyncio.create_task(
                self.get_carbon_status(county)
            )
            tasks.append(('carbon_status', task))
        
        # Execute all tasks
        for name, task in tasks:
            try:
                results[name] = await task
            except Exception as e:
                self.logger.error(f"Error in {name} for {county}: {str(e)}")
                results[name] = {'error': str(e)}
        
        return {
            'county': county,
            'timestamp': datetime.now().isoformat(),
            'systems_status': results
        }

    async def get_disaster_risks(self, county: str) -> Dict:
        """Get disaster risk assessments"""
        if not self.systems['early_warning']:
            return {'error': 'Early warning system not initialized'}
        
        system = self.systems['early_warning']
        
        # Mock current conditions - replace with real data integration
        drought_risk = system.predict_drought_risk(county, 25.5, 15.2, 0.3)
        flood_risk = system.predict_flood_risk(county, 45.0, 85.0, 65.0)
        
        return {
            'drought_risk': drought_risk,
            'flood_risk': flood_risk,
            'overall_risk_level': max(drought_risk['risk_score'], flood_risk['risk_score'])
        }

    async def get_agriculture_insights(self, county: str) -> Dict:
        """Get agricultural insights and predictions"""
        if not self.systems['agriculture']:
            return {'error': 'Agriculture system not initialized'}
        
        system = self.systems['agriculture']
        system.initialize_mock_data()
        
        # Generate insights for major crops
        insights = {}
        for crop in ['maize', 'beans', 'sorghum']:
            yield_pred, confidence, recommendations = system.predict_crop_yield(
                county, crop, datetime.now()
            )
            if yield_pred:
                insights[crop] = {
                    'predicted_yield': yield_pred,
                    'confidence': confidence,
                    'recommendations': recommendations
                }
        
        return insights

    async def get_carbon_status(self, county: str) -> Dict:
        """Get carbon monitoring status"""
        if not self.systems['carbon_monitoring']:
            return {'error': 'Carbon monitoring system not initialized'}
        
        system = self.systems['carbon_monitoring']
        
        # Forest analysis
        forest_analysis = system.analyze_satellite_imagery(county, datetime.now())
        
        # Soil carbon assessment
        soil_assessment = system.soil_carbon_assessment(county, [], 'agroforestry')
        
        return {
            'forest_analysis': forest_analysis,
            'soil_carbon': soil_assessment
        }

# Database Models (using SQLAlchemy)
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class ClimateData(Base):
    __tablename__ = 'climate_data'
    
    id = Column(Integer, primary_key=True)
    county = Column(String(50), nullable=False)
    timestamp = Column(DateTime, nullable=False)
    temperature = Column(Float)
    humidity = Column(Float)
    rainfall = Column(Float)
    wind_speed = Column(Float)
    solar_irradiance = Column(Float)
    data_source = Column(String(100))

class DisasterAlert(Base):
    __tablename__ = 'disaster_alerts'
    
    id = Column(Integer, primary_key=True)
    county = Column(String(50), nullable=False)
    disaster_type = Column(String(50), nullable=False)
    risk_level = Column(String(20), nullable=False)
    risk_score = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    alert_message = Column(Text)
    created_at = Column(DateTime, default=datetime.now)
    is_active = Column(Boolean, default=True)

class CropPrediction(Base):
    __tablename__ = 'crop_predictions'
    
    id = Column(Integer, primary_key=True)
    county = Column(String(50), nullable=False)
    crop_type = Column(String(50), nullable=False)
    predicted_yield = Column(Float, nullable=False)
    confidence_score = Column(Float, nullable=False)
    planting_date = Column(DateTime, nullable=False)
    prediction_date = Column(DateTime, default=datetime.now)
    recommendations = Column(Text)

# API Endpoints (FastAPI)
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Kenya Climate AI Platform API", version="1.0.0")

# Enable CORS for web frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global platform instance
platform = KenyaClimateAIPlatform()

@app.on_event("startup")
async def startup_event():
    """Initialize the platform on startup"""
    success = await platform.initialize_systems()
    if not success:
        raise RuntimeError("Failed to initialize climate AI systems")

# Request/Response Models
class ClimateStatusRequest(BaseModel):
    county: str
    include_predictions: bool = True
    include_alerts: bool = True

class DisasterRiskResponse(BaseModel):
    county: str
    disaster_type: str
    risk_level: str
    risk_score: float
    confidence: float
    recommendations: List[str]

# API Endpoints
@app.get("/")
async def root():
    return {"message": "Kenya Climate AI Platform API", "version": "1.0.0"}

@app.post("/climate-status/{county}")
async def get_climate_status(county: str, request: ClimateStatusRequest = None):
    """Get comprehensive climate status for a county"""
    try:
        if not county or county.strip() == "":
            raise HTTPException(status_code=400, detail="County name is required")
        
        status = await platform.get_comprehensive_climate_status(county)
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/counties")
async def get_supported_counties():
    """Get list of supported counties"""
    counties = [
        'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi',
        'Turkana', 'Marsabit', 'Samburu', 'Baringo', 'Machakos', 'Embu',
        'Uasin Gishu', 'Trans Nzoia', 'Kiambu', 'Murang\'a', 'Nyeri',
        'Mandera', 'Wajir', 'Garissa', 'Isiolo', 'Kilifi', 'Taita Taveta'
    ]
    return {"counties": counties, "total": len(counties)}

@app.get("/agriculture/predictions/{county}")
async def get_agriculture_predictions(county: str):
    """Get agricultural predictions for a county"""
    try:
        if not platform.systems.get('agriculture'):
            raise HTTPException(status_code=503, detail="Agriculture system not available")
        
        insights = await platform.get_agriculture_insights(county)
        return insights
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/early-warning/alerts/{county}")
async def get_early_warning_alerts(county: str):
    """Get early warning alerts for a county"""
    try:
        if not platform.systems.get('early_warning'):
            raise HTTPException(status_code=503, detail="Early warning system not available")
        
        risks = await platform.get_disaster_risks(county)
        return risks
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/carbon/status/{county}")
async def get_carbon_status(county: str):
    """Get carbon monitoring status for a county"""
    try:
        if not platform.systems.get('carbon_monitoring'):
            raise HTTPException(status_code=503, detail="Carbon monitoring system not available")
        
        status = await platform.get_carbon_status(county)
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/energy/grid-status")
async def get_grid_status():
    """Get national grid status and renewable energy generation"""
    try:
        if not platform.systems.get('smart_grid'):
            raise HTTPException(status_code=503, detail="Smart grid system not available")
        
        system = platform.systems['smart_grid']
        
        # Mock weather data for demonstration
        weather_forecast = {
            'solar_irradiance': 750,
            'cloud_cover': 20,
            'wind_speed': 12,
            'recent_rainfall': 65
        }
        
        optimization = system.optimize_renewable_generation(weather_forecast, 1200)
        return optimization
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/urban/air-quality/{city}")
async def get_air_quality(city: str):
    """Get air quality predictions for urban areas"""
    try:
        if not platform.systems.get('urban_climate'):
            raise HTTPException(status_code=503, detail="Urban climate system not available")
        
        system = platform.systems['urban_climate']
        
        # Mock current conditions
        weather_conditions = {'wind_speed': 2.5, 'humidity': 75, 'temperature': 26}
        traffic_data = {'congestion_level': 1.3}
        industrial_data = {'activity_level': 1.1}
        
        air_quality = system.air_quality_prediction(city, weather_conditions, traffic_data, industrial_data)
        return air_quality
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)