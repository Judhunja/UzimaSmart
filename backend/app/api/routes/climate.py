"""
Enhanced Climate API Routes for all 47 Kenya Counties
Supports data visualization and weather predictions
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List
from datetime import datetime, timedelta
import json

from ...utils.database import get_db
from ...services.enhanced_climate_service import enhanced_climate_service
from ...data.kenya_counties import KENYA_COUNTIES, CLIMATE_ZONES, get_county_by_name, get_counties_by_climate_zone
from ...utils.cache import get_cache, set_cache

router = APIRouter()

@router.get("/counties")
async def get_all_counties():
    """Get list of all 47 Kenya counties with basic info"""
    return {
        "total_counties": len(KENYA_COUNTIES),
        "counties": [
            {
                "id": county_id,
                "name": county_data["name"],
                "capital": county_data["capital"],
                "climate_zone": county_data["climate_zone"],
                "population": county_data["population"],
                "area_km2": county_data["area_km2"],
                "elevation_m": county_data["elevation_m"]
            }
            for county_id, county_data in KENYA_COUNTIES.items()
        ],
        "climate_zones": list(CLIMATE_ZONES.keys())
    }

@router.get("/counties/search")
async def search_counties(
    name: Optional[str] = Query(None, description="County name to search for"),
    climate_zone: Optional[str] = Query(None, description="Filter by climate zone")
):
    """Search counties by name or climate zone"""
    try:
        results = []
        
        if name:
            county_id, county_data = get_county_by_name(name)
            if county_data:
                results.append({
                    "id": county_id,
                    "name": county_data["name"],
                    "climate_zone": county_data["climate_zone"],
                    "capital": county_data["capital"]
                })
        
        if climate_zone:
            counties_in_zone = get_counties_by_climate_zone(climate_zone)
            for county_id, county_data in counties_in_zone:
                results.append({
                    "id": county_id,
                    "name": county_data["name"],
                    "climate_zone": county_data["climate_zone"],
                    "capital": county_data["capital"]
                })
        
        return {
            "search_criteria": {"name": name, "climate_zone": climate_zone},
            "results_count": len(results),
            "results": results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.get("/overview/current")
async def get_current_overview():
    """Get current climate overview for all counties"""
    try:
        data = await enhanced_climate_service.get_all_counties_current_data()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Overview failed: {str(e)}")

@router.get("/counties/{county_id}")
async def get_county_details(county_id: int):
    """Get detailed information about a specific county"""
    if county_id not in KENYA_COUNTIES:
        raise HTTPException(status_code=404, detail="County not found")
    
    county_data = KENYA_COUNTIES[county_id]
    climate_zone_info = CLIMATE_ZONES.get(county_data["climate_zone"], {})
    
    return {
        "county": county_data,
        "climate_zone_details": climate_zone_info,
        "coordinates": {
            "center": {
                "latitude": (county_data["bounds"]["north"] + county_data["bounds"]["south"]) / 2,
                "longitude": (county_data["bounds"]["east"] + county_data["bounds"]["west"]) / 2
            },
            "bounds": county_data["bounds"]
        }
    }

@router.get("/counties/{county_id}/historical")
async def get_county_historical_data(
    county_id: int,
    months: int = Query(12, ge=1, le=60, description="Number of months of historical data")
):
    """Get historical climate data for a county"""
    if county_id not in KENYA_COUNTIES:
        raise HTTPException(status_code=404, detail="County not found")
    
    try:
        data = await enhanced_climate_service.get_county_historical_data(county_id, months)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Historical data failed: {str(e)}")

@router.get("/counties/{county_id}/predictions")
async def get_county_predictions(
    county_id: int,
    months: int = Query(6, ge=1, le=12, description="Number of months to predict ahead")
):
    """Get weather predictions for a county"""
    if county_id not in KENYA_COUNTIES:
        raise HTTPException(status_code=404, detail="County not found")
    
    try:
        data = await enhanced_climate_service.get_county_predictions(county_id, months)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Predictions failed: {str(e)}")

@router.get("/counties/{county_id}/visualization-data")
async def get_county_visualization_data(
    county_id: int,
    timeframe: str = Query("12_months", description="Timeframe: 3_months, 6_months, 12_months, 24_months"),
    include_predictions: bool = Query(True, description="Include future predictions")
):
    """Get comprehensive data for visualization charts"""
    if county_id not in KENYA_COUNTIES:
        raise HTTPException(status_code=404, detail="County not found")
    
    try:
        # Parse timeframe
        timeframe_map = {
            "3_months": 3,
            "6_months": 6,
            "12_months": 12,
            "24_months": 24
        }
        
        months = timeframe_map.get(timeframe, 12)
        prediction_months = min(6, months // 2) if include_predictions else 0
        
        # Get historical data
        historical = await enhanced_climate_service.get_county_historical_data(county_id, months)
        
        result = {
            "county_id": county_id,
            "county_name": KENYA_COUNTIES[county_id]["name"],
            "timeframe": timeframe,
            "historical": historical,
            "visualization_ready": True
        }
        
        # Add predictions if requested
        if include_predictions and prediction_months > 0:
            predictions = await enhanced_climate_service.get_county_predictions(county_id, prediction_months)
            result["predictions"] = predictions
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Visualization data failed: {str(e)}")

@router.get("/comparison")
async def compare_counties(
    county_ids: str = Query(..., description="Comma-separated county IDs"),
    months: int = Query(6, ge=1, le=24, description="Comparison period in months")
):
    """Compare climate data across multiple counties"""
    try:
        # Parse county IDs
        county_list = [int(id.strip()) for id in county_ids.split(",")]
        
        # Validate county IDs
        invalid_counties = [id for id in county_list if id not in KENYA_COUNTIES]
        if invalid_counties:
            raise HTTPException(status_code=400, detail=f"Invalid counties: {invalid_counties}")
        
        if len(county_list) > 10:
            raise HTTPException(status_code=400, detail="Maximum 10 counties can be compared")
        
        data = await enhanced_climate_service.get_climate_comparison(county_list, months)
        return data
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid county IDs format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison failed: {str(e)}")

@router.get("/drought-risk/assessment")
async def get_drought_risk_assessment(
    months_ahead: int = Query(3, ge=1, le=6, description="Months ahead for risk assessment")
):
    """Get drought risk assessment for all counties"""
    try:
        data = await enhanced_climate_service.get_drought_risk_assessment(months_ahead)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Drought assessment failed: {str(e)}")

@router.get("/climate-zones")
async def get_climate_zones():
    """Get information about Kenya's climate zones"""
    return {
        "total_zones": len(CLIMATE_ZONES),
        "climate_zones": CLIMATE_ZONES,
        "counties_by_zone": {
            zone: [
                {"id": county_id, "name": county_data["name"]}
                for county_id, county_data in get_counties_by_climate_zone(zone)
            ]
            for zone in CLIMATE_ZONES.keys()
        }
    }

@router.get("/analytics/trends")
async def get_climate_trends(
    metric: str = Query("temperature", description="Metric: temperature, rainfall, ndvi"),
    region: Optional[str] = Query(None, description="Climate zone or 'all' for nationwide"),
    period: str = Query("12_months", description="Period: 6_months, 12_months, 24_months")
):
    """Get climate trends analysis"""
    try:
        # Parse period
        period_map = {"6_months": 6, "12_months": 12, "24_months": 24}
        months = period_map.get(period, 12)
        
        # Determine counties to analyze
        if region and region != "all":
            counties_to_analyze = get_counties_by_climate_zone(region)
            county_ids = [county_id for county_id, _ in counties_to_analyze]
        else:
            county_ids = list(KENYA_COUNTIES.keys())
        
        # Sample analysis for first 10 counties to avoid timeout
        sample_counties = county_ids[:10]
        trends_data = {}
        
        for county_id in sample_counties:
            historical = await enhanced_climate_service.get_county_historical_data(county_id, months)
            if "error" not in historical:
                county_name = KENYA_COUNTIES[county_id]["name"]
                time_series = historical["time_series"]
                
                if metric in time_series:
                    values = time_series[metric]
                    if len(values) >= 2:
                        # Simple trend calculation
                        trend_slope = (values[-1] - values[0]) / len(values)
                        trend_direction = "increasing" if trend_slope > 0.1 else "decreasing" if trend_slope < -0.1 else "stable"
                        
                        trends_data[county_id] = {
                            "name": county_name,
                            "trend_direction": trend_direction,
                            "trend_slope": round(trend_slope, 3),
                            "current_value": values[-1],
                            "period_average": round(sum(values) / len(values), 2)
                        }
        
        return {
            "metric": metric,
            "region": region or "all",
            "period": period,
            "counties_analyzed": len(trends_data),
            "trends": trends_data,
            "analysis_date": datetime.utcnow().isoformat() + "Z"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Trends analysis failed: {str(e)}")

@router.get("/export/county-data")
async def export_county_data(
    county_id: int,
    format: str = Query("json", description="Export format: json, csv"),
    include_predictions: bool = Query(True, description="Include predictions in export")
):
    """Export comprehensive county data for external use"""
    if county_id not in KENYA_COUNTIES:
        raise HTTPException(status_code=404, detail="County not found")
    
    try:
        # Get comprehensive data
        county_info = KENYA_COUNTIES[county_id]
        historical = await enhanced_climate_service.get_county_historical_data(county_id, 12)
        
        export_data = {
            "county_info": county_info,
            "historical_data": historical,
            "export_metadata": {
                "export_date": datetime.utcnow().isoformat() + "Z",
                "format": format,
                "data_source": "UzimaSmart Enhanced Climate Service"
            }
        }
        
        if include_predictions:
            predictions = await enhanced_climate_service.get_county_predictions(county_id, 6)
            export_data["predictions"] = predictions
        
        # For now, return JSON (CSV conversion would require additional logic)
        return export_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")

# Legacy route compatibility for backward compatibility with existing implementations
@router.get("/counties/{county_id}/climate-data")
async def get_county_climate_data(
    county_id: int,
    start_date: str = Query(..., description="Start date (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date (YYYY-MM-DD)"),
    data_types: str = Query("ndvi,temperature,precipitation", description="Comma-separated data types")
):
    """Legacy climate data endpoint for backward compatibility"""
    if county_id not in KENYA_COUNTIES:
        raise HTTPException(status_code=404, detail="County not found")
    
    try:
        # Use the enhanced service for better data
        historical = await enhanced_climate_service.get_county_historical_data(county_id, 1)
        
        if "error" in historical:
            raise HTTPException(status_code=500, detail=historical["error"])
        
        # Format for legacy compatibility
        return {
            "county_id": county_id,
            "county_name": historical["county_name"],
            "date_range": f"{start_date} to {end_date}",
            "data": {
                "ndvi": {
                    "ndvi_mean": historical["averages"]["ndvi"],
                    "confidence": 0.85
                },
                "temperature": {
                    "temperature_mean": historical["averages"]["temperature"],
                    "confidence": 0.82
                },
                "precipitation": {
                    "rainfall_total": historical["averages"]["rainfall"],
                    "confidence": 0.78
                }
            },
            "data_source": "Enhanced_Climate_Service_Legacy",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Legacy data failed: {str(e)}")

@router.get("/counties/{county_id}/drought-analysis")
async def get_drought_analysis(county_id: int):
    """Get drought risk analysis for a county"""
    if county_id not in KENYA_COUNTIES:
        raise HTTPException(status_code=404, detail="County not found")
    
    try:
        county_data = KENYA_COUNTIES[county_id]
        
        # Use enhanced service for drought analysis
        current_date = datetime.now().strftime('%Y-%m-%d')
        assessment = await enhanced_climate_service.get_drought_risk_assessment(1)
        
        # Extract analysis for specific county
        analysis = {}
        if "county_assessments" in assessment and str(county_id) in assessment["county_assessments"]:
            county_assessment = assessment["county_assessments"][str(county_id)]
            analysis = {
                "drought_risk_score": county_assessment.get("drought_risk_score", 0),
                "risk_level": county_assessment.get("risk_level", "unknown"),
                "vegetation_stress": county_assessment.get("vegetation_stress", 0),
                "rainfall_deficit": county_assessment.get("rainfall_deficit", 0),
                "temperature_stress": county_assessment.get("temperature_stress", 0),
                "recommendations": county_assessment.get("recommendations", [])
            }
        else:
            analysis = {"error": "No drought analysis data available"}
        
        return {
            "county_id": county_id,
            "county_name": county_data["name"],
            "analysis_date": current_date,
            "drought_analysis": analysis
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error performing drought analysis: {str(e)}")

@router.get("/counties/{county_id}/historical-trends")
async def get_historical_trends(
    county_id: int,
    metric: str = Query(..., description="Metric to analyze (ndvi, rainfall, temperature)"),
    years: int = Query(5, description="Number of years to analyze")
):
    """Get historical trends for a specific metric"""
    if county_id not in KENYA_COUNTIES:
        raise HTTPException(status_code=404, detail="County not found")
    
    if metric not in ['ndvi', 'rainfall', 'temperature']:
        raise HTTPException(status_code=400, detail="Invalid metric")
    
    try:
        cache_key = f"trends_{county_id}_{metric}_{years}"
        cached_data = await get_cache(cache_key)
        if cached_data:
            return cached_data
        
        county_data = KENYA_COUNTIES[county_id]
        
        # Use enhanced service for better data
        months = years * 12
        historical = await enhanced_climate_service.get_county_historical_data(county_id, months)
        
        if "error" in historical:
            raise HTTPException(status_code=500, detail=historical["error"])
        
        # Extract trends from time series data
        time_series = historical.get("time_series", {})
        if metric not in time_series:
            raise HTTPException(status_code=500, detail=f"No {metric} data available")
        
        values = time_series[metric]
        trends_data = []
        
        # Group by years (assuming monthly data)
        for year_offset in range(years):
            year = datetime.now().year - year_offset
            start_idx = year_offset * 12
            end_idx = min(start_idx + 12, len(values))
            
            if start_idx < len(values):
                year_values = values[start_idx:end_idx]
                avg_value = sum(year_values) / len(year_values) if year_values else 0
                
                trends_data.append({
                    "year": year,
                    "value": round(avg_value, 3)
                })
        
        result = {
            "county_id": county_id,
            "county_name": county_data["name"],
            "metric": metric,
            "years_analyzed": years,
            "trends": sorted(trends_data, key=lambda x: x['year']),
            "statistics": {
                "mean": round(sum([d['value'] for d in trends_data]) / len(trends_data), 3) if trends_data else 0,
                "min": min([d['value'] for d in trends_data]) if trends_data else 0,
                "max": max([d['value'] for d in trends_data]) if trends_data else 0
            }
        }
        
        # Cache for 24 hours
        await set_cache(cache_key, result, 86400)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving historical trends: {str(e)}")

@router.get("/anomalies/current")
async def get_current_anomalies():
    """Get current climate anomalies across all counties"""
    try:
        # Use enhanced service for comprehensive analysis
        assessment = await enhanced_climate_service.get_drought_risk_assessment(1)
        
        if "error" in assessment:
            raise HTTPException(status_code=500, detail=assessment["error"])
        
        anomalies = []
        risk_levels = assessment.get("county_assessments", {})
        
        for county_id, risk_data in risk_levels.items():
            if isinstance(county_id, str):
                county_id = int(county_id)
            
            county_data = KENYA_COUNTIES.get(county_id, {})
            anomalies.append({
                "county_id": county_id,
                "county_name": county_data.get("name", "Unknown"),
                "drought_risk": risk_data.get("drought_risk_score", 0),
                "risk_level": risk_data.get("risk_level", "unknown"),
                "ndvi_anomaly": risk_data.get("vegetation_stress", 0),
                "rainfall_anomaly": risk_data.get("rainfall_deficit", 0),
                "temperature_anomaly": risk_data.get("temperature_stress", 0)
            })
        
        current_date = datetime.now().strftime('%Y-%m-%d')
        
        return {
            "analysis_date": current_date,
            "total_counties": len(anomalies),
            "anomalies": sorted(anomalies, key=lambda x: x['drought_risk'], reverse=True)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving anomalies: {str(e)}")
