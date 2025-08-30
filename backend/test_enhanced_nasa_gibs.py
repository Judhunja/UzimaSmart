"""
Test script for Enhanced NASA GIBS Service
Tests real satellite data retrieval and processing
"""
import asyncio
import sys
import os

# Add the parent directory to sys.path to import the service
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.enhanced_nasa_gibs import EnhancedNASAGIBSService
from datetime import datetime, timedelta

async def test_enhanced_nasa_gibs():
    """Test the enhanced NASA GIBS service"""
    print("🚀 Testing Enhanced NASA GIBS Service")
    print("=" * 50)
    
    # Initialize service
    service = EnhancedNASAGIBSService()
    await service.initialize()
    
    try:
        # Test parameters
        county_id = 1  # Nairobi
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=7)
        
        start_str = start_date.isoformat() + "Z"
        end_str = end_date.isoformat() + "Z"
        
        print(f"📅 Testing for County {county_id} (Nairobi)")
        print(f"   Period: {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}")
        print()
        
        # Test NDVI data
        print("🌱 Testing NDVI Data...")
        ndvi_result = await service.get_ndvi_data(county_id, start_str, end_str)
        if "error" in ndvi_result:
            print(f"   ❌ NDVI Error: {ndvi_result['error']}")
        else:
            print(f"   ✅ NDVI Mean: {ndvi_result.get('ndvi_mean', 'N/A')}")
            print(f"   📊 Pixel Count: {ndvi_result.get('pixel_count', 'N/A')}")
            print(f"   🎯 Confidence: {ndvi_result.get('confidence', 'N/A')}")
        print()
        
        # Test Temperature data
        print("🌡️ Testing Temperature Data...")
        temp_result = await service.get_temperature_data(county_id, start_str, end_str)
        if "error" in temp_result:
            print(f"   ❌ Temperature Error: {temp_result['error']}")
        else:
            print(f"   ✅ Temperature Mean: {temp_result.get('temperature_mean', 'N/A')}°C")
            print(f"   📊 Pixel Count: {temp_result.get('pixel_count', 'N/A')}")
            print(f"   🎯 Confidence: {temp_result.get('confidence', 'N/A')}")
        print()
        
        # Test Precipitation data
        print("🌧️ Testing Precipitation Data...")
        precip_result = await service.get_precipitation_data(county_id, start_str, end_str)
        if "error" in precip_result:
            print(f"   ❌ Precipitation Error: {precip_result['error']}")
        else:
            print(f"   ✅ Rainfall Total: {precip_result.get('rainfall_total', 'N/A')} mm")
            print(f"   📊 Pixel Count: {precip_result.get('pixel_count', 'N/A')}")
            print(f"   🎯 Confidence: {precip_result.get('confidence', 'N/A')}")
        print()
        
        # Test comprehensive climate data
        print("🌍 Testing Comprehensive Climate Data...")
        climate_result = await service.get_county_climate_data(county_id, days=7)
        if "error" in climate_result:
            print(f"   ❌ Climate Data Error: {climate_result['error']}")
        else:
            print(f"   ✅ Data collected for {climate_result.get('date_range', {}).get('days', 'N/A')} days")
            print(f"   🌱 NDVI: {climate_result.get('ndvi_mean', 'N/A')}")
            print(f"   🌡️ Temperature: {climate_result.get('temperature_mean', 'N/A')}°C")
            print(f"   🌧️ Rainfall: {climate_result.get('rainfall_total', 'N/A')} mm")
        print()
        
        # Test drought detection
        print("🔍 Testing Drought Detection...")
        drought_result = await service.detect_drought_conditions(county_id, historical_days=90)
        if "error" in drought_result:
            print(f"   ❌ Drought Analysis Error: {drought_result['error']}")
        else:
            severity = drought_result.get('drought_severity', 'N/A')
            alert_level = drought_result.get('alert_level', 'N/A')
            drought_index = drought_result.get('drought_index', 'N/A')
            
            print(f"   ✅ Drought Severity: {severity}")
            print(f"   🚨 Alert Level: {alert_level}")
            print(f"   📈 Drought Index: {drought_index}")
            print(f"   💡 Recommendation: {drought_result.get('recommendation', 'N/A')}")
        print()
        
        # Test data sources
        print("📡 Data Source Information:")
        print(f"   NDVI: {ndvi_result.get('data_source', 'N/A')}")
        print(f"   Temperature: {temp_result.get('data_source', 'N/A')}")
        print(f"   Precipitation: {precip_result.get('data_source', 'N/A')}")
        print()
        
        print("🎉 Enhanced NASA GIBS Service Test Complete!")
        print("=" * 50)
        
        # Summary
        success_count = 0
        if "error" not in ndvi_result:
            success_count += 1
        if "error" not in temp_result:
            success_count += 1
        if "error" not in precip_result:
            success_count += 1
        if "error" not in drought_result:
            success_count += 1
            
        print(f"📊 Test Results: {success_count}/4 services working")
        
        if success_count >= 3:
            print("✅ NASA GIBS Enhanced Service is ready for production!")
        elif success_count >= 2:
            print("⚠️ NASA GIBS Enhanced Service is partially working")
        else:
            print("❌ NASA GIBS Enhanced Service needs troubleshooting")
        
    except Exception as e:
        print(f"❌ Test failed with exception: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        await service.close()

if __name__ == "__main__":
    asyncio.run(test_enhanced_nasa_gibs())
