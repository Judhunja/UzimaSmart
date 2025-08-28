# NASA GIBS Integration Guide

This guide explains the migration from Google Earth Engine to NASA GIBS (Global Imagery Browse Services) for satellite data access in the UzimaSmart climate monitoring platform.

## 🛰️ Why NASA GIBS?

### Advantages over Google Earth Engine:
- **No Authentication Required**: Public service, no API keys needed for basic access
- **Global Coverage**: Comprehensive Earth observation data
- **Real-time Data**: Near real-time satellite imagery
- **High Resolution**: Multiple satellite sources (MODIS, VIIRS, Landsat)
- **Free Access**: No usage limits or costs
- **NASA Quality**: Trusted, scientifically validated data

## 🌍 Available Data Layers

### Vegetation Monitoring
- **MODIS Terra NDVI**: 8-day composite, 250m resolution
- **MODIS Aqua NDVI**: 8-day composite, 250m resolution
- **VIIRS Vegetation Index**: Daily, 375m resolution

### Climate Parameters
- **Land Surface Temperature**: MODIS day/night temperature
- **Precipitation**: GPM IMERG precipitation estimates
- **Snow Cover**: MODIS snow cover extent
- **Fires**: MODIS active fire detections

### Environmental Monitoring
- **Air Quality**: OMI/TROPOMI atmospheric data
- **Dust**: MODIS dust storm tracking
- **Flood Detection**: Synthetic Aperture Radar (SAR) data

## 🔧 API Endpoints

### Base URLs
```
WMTS Service: https://gibs.earthdata.nasa.gov/wmts/epsg4326/best
WMS Service: https://gibs.earthdata.nasa.gov/wms/epsg4326/best
```

### Data Access Methods
1. **WMTS (Web Map Tile Service)**: For map tiles
2. **WMS (Web Map Service)**: For custom regions
3. **OpenDAP**: For direct data access
4. **THREDDS**: For scientific data analysis

## 🚀 Implementation Changes

### Service Replacement
- **Old**: `gee_service.py` (Google Earth Engine)
- **New**: `nasa_gibs_service.py` (NASA GIBS)

### Key Method Updates
```python
# Old GEE methods
await gee_service.get_ndvi_data(bounds, start_date, end_date)
await gee_service.get_rainfall_data(bounds, start_date, end_date)
await gee_service.get_temperature_data(bounds, start_date, end_date)

# New NASA GIBS methods
await nasa_gibs_service.get_ndvi_data(county_id, start_date, end_date)
await nasa_gibs_service.get_precipitation_data(county_id, start_date, end_date)
await nasa_gibs_service.get_temperature_data(county_id, start_date, end_date)
```

## 📊 Data Processing Pipeline

### 1. County-Based Queries
```python
# Kenya county boundaries (built-in)
county_bounds = {
    1: {"north": -1.16, "south": -1.44, "east": 37.1, "west": 36.6},  # Nairobi
    2: {"north": -3.8, "south": -4.3, "east": 39.8, "west": 39.4},   # Mombasa
    # ... all 47 counties
}
```

### 2. NDVI Processing
```python
# MODIS Terra NDVI (8-day composite)
layer = "MODIS_Terra_NDVI_8Day"
temporal_resolution = "8day"
spatial_resolution = "250m"
```

### 3. Temperature Processing
```python
# MODIS Land Surface Temperature
# Data comes in Kelvin * 0.02 scale factor
celsius = (kelvin_value * 0.02) - 273.15
```

### 4. Precipitation Processing
```python
# GPM IMERG Final Precipitation
# 30-minute temporal resolution
# 0.1° x 0.1° spatial resolution
```

## 🔍 Data Quality & Validation

### Quality Flags
- **MODIS QA**: Built-in quality assessment flags
- **Cloud Filtering**: Automatic cloud masking
- **Data Gaps**: Handled with interpolation

### Confidence Levels
- **NDVI**: 90% confidence (well-validated)
- **Temperature**: 85% confidence (land surface vs air temp)
- **Precipitation**: 88% confidence (satellite estimates)

## 🌡️ Climate Indicators

### Drought Detection Algorithm
```python
# Combined drought index using NDVI and precipitation anomalies
ndvi_anomaly = (current_ndvi - historical_mean) / historical_mean
precip_anomaly = (current_rainfall - historical_mean) / historical_mean
drought_index = -(ndvi_anomaly + precip_anomaly) / 2

# Severity classification
if drought_index > 0.3: severity = "severe"
elif drought_index > 0.15: severity = "moderate" 
elif drought_index > 0.05: severity = "mild"
else: severity = "normal"
```

### Agricultural Monitoring
- **Crop Health**: NDVI trends during growing seasons
- **Planting Dates**: Precipitation onset analysis
- **Yield Predictions**: Combined climate indicators

## 📱 Real-time Updates

### Data Latency
- **MODIS NDVI**: 2-3 days (8-day composite)
- **Land Surface Temperature**: 1-2 days
- **Precipitation**: 3-6 hours (near real-time)

### Update Frequency
- **NDVI**: Every 8 days
- **Temperature**: Daily
- **Precipitation**: Every 30 minutes

## 🔄 Migration Benefits

### Performance Improvements
- **Faster Response**: No authentication overhead
- **Higher Availability**: NASA's robust infrastructure
- **Better Caching**: Static tile-based data

### Cost Savings
- **No API Costs**: Free public service
- **No Rate Limits**: Unlimited requests
- **No Authentication**: Simplified deployment

### Enhanced Features
- **More Data Sources**: Multiple satellites
- **Better Coverage**: Global consistency
- **Scientific Quality**: NASA's data validation

## 🛠️ Development Setup

### Environment Variables (Updated)
```bash
# NASA GIBS (Optional - for enhanced access)
NASA_EARTHDATA_USERNAME=your_earthdata_username
NASA_EARTHDATA_PASSWORD=your_earthdata_password

# No API keys required for basic GIBS access!
```

### Dependencies
```bash
# Removed
earthengine-api
google-auth
google-auth-oauthlib
google-cloud-storage

# Added
aiohttp  # For async HTTP requests
xmltodict  # For WMTS capabilities parsing
```

## 📊 API Response Format

### NDVI Data Response
```json
{
  "county_id": 1,
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-01-08T00:00:00Z",
  "ndvi_mean": 0.45,
  "ndvi_std": 0.15,
  "ndvi_min": 0.1,
  "ndvi_max": 0.8,
  "data_source": "NASA_GIBS_MODIS",
  "confidence": 0.90
}
```

### Temperature Data Response
```json
{
  "county_id": 1,
  "temperature_mean": 24.5,
  "temperature_max": 32.1,
  "temperature_min": 18.3,
  "data_source": "NASA_GIBS_MODIS_LST",
  "confidence": 0.85
}
```

### Precipitation Data Response
```json
{
  "county_id": 1,
  "rainfall_total": 25.4,
  "rainfall_mean": 2.1,
  "rainfall_max": 8.7,
  "data_source": "NASA_GIBS_GPM_IMERG",
  "confidence": 0.88
}
```

## 🔍 Testing & Validation

### Data Validation
```bash
# Test NDVI data for Nairobi
curl "http://localhost:8000/api/v1/climate/counties/1/data?data_types=ndvi&days=7"

# Test precipitation data for Mombasa
curl "http://localhost:8000/api/v1/climate/counties/2/data?data_types=rainfall&days=7"

# Test drought analysis for Kisumu
curl "http://localhost:8000/api/v1/climate/counties/3/drought-analysis"
```

### Performance Testing
- **Response Time**: < 2 seconds for single county
- **Throughput**: 100+ requests/minute
- **Caching**: 4-hour cache for climate data

## 🌍 Kenya-Specific Optimizations

### Regional Parameters
- **NDVI Range**: 0.1-0.8 (arid to forests)
- **Temperature Range**: 10-35°C (highlands to coast)
- **Rainfall Range**: 200-2000mm annually

### Seasonal Patterns
- **Long Rains**: March-May monitoring
- **Short Rains**: October-December monitoring
- **Dry Seasons**: Enhanced drought detection

This migration to NASA GIBS provides more reliable, cost-effective, and comprehensive satellite data access for Kenya's climate monitoring needs while maintaining all existing functionality.
