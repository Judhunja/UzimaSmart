# File: tests/test_climate_systems.py
# Comprehensive testing suite

import pytest
import asyncio
from datetime import datetime
from unittest.mock import Mock, patch

# Import system modules
from src.agriculture.crop_prediction import KenyaAgricultureAI
from src.early_warning.disaster_prediction import KenyaEarlyWarningSystem
from src.carbon.monitoring_system import KenyaCarbonMonitoringAI
from src.energy.smart_grid import KenyaSmartGridAI, KenyaUrbanClimateAI

class TestKenyaAgricultureAI:
    def setup_method(self):
        self.ai_system = KenyaAgricultureAI()
        self.ai_system.initialize_mock_data()

    def test_crop_yield_prediction(self):
        """Test crop yield prediction functionality"""
        county = "Nakuru"
        crop_type = "maize"
        planting_date = datetime.now()
        
        yield_pred, confidence, recommendations = self.ai_system.predict_crop_yield(
            county, crop_type, planting_date
        )
        
        assert yield_pred is not None
        assert 0 <= confidence <= 1
        assert isinstance(recommendations, list)
        assert len(recommendations) > 0

    def test_invalid_county(self):
        """Test handling of invalid county"""
        yield_pred, confidence, recommendations = self.ai_system.predict_crop_yield(
            "InvalidCounty", "maize", datetime.now()
        )
        
        assert yield_pred is None
        assert confidence == 0
        assert "Invalid county or crop type" in recommendations

    def test_pest_disease_prediction(self):
        """Test pest and disease prediction"""
        county = "Nakuru"
        crop_type = "maize"
        weather = {'humidity': 75, 'temperature': 30, 'rainfall': 90}
        
        risks = self.ai_system.pest_disease_prediction(county, crop_type, weather)
        
        assert isinstance(risks, dict)
        assert 'fall_armyworm' in risks
        assert all(0 <= risk <= 1 for risk in risks.values())

class TestKenyaEarlyWarningSystem:
    def setup_method(self):
        self.warning_system = KenyaEarlyWarningSystem()

    def test_drought_prediction(self):
        """Test drought risk prediction"""
        result = self.warning_system.predict_drought_risk(
            county="Turkana",
            historical_rainfall=25.5,
            soil_moisture=15.2,
            vegetation_index=0.3
        )
        
        assert 'risk_score' in result
        assert 'risk_level' in result
        assert result['risk_level'] in ['minimal', 'low', 'medium', 'high']
        assert 0 <= result['risk_score'] <= 1

    def test_flood_prediction(self):
        """Test flood risk prediction"""
        result = self.warning_system.predict_flood_risk(
            county="Nairobi",
            river_levels=85.0,
            rainfall_forecast=120.0,
            soil_saturation=78.0
        )
        
        assert 'risk_score' in result
        assert 'risk_level' in result
        assert 'prediction_days' in result
        assert result['prediction_days'] == 7

    def test_alert_generation(self):
        """Test early warning alert generation"""
        risk_data = {
            'risk_level': 'high',
            'risk_score': 0.85,
            'confidence': 0.78,
            'prediction_days': 90
        }
        
        alert = self.warning_system.generate_early_warning_alert(
            "Turkana", "drought", risk_data
        )
        
        assert 'timestamp' in alert
        assert 'county' in alert
        assert 'message' in alert
        assert 'actions_recommended' in alert
        assert alert['risk_level'] == 'high'

class TestKenyaCarbonMonitoringAI:
    def setup_method(self):
        self.carbon_system = KenyaCarbonMonitoringAI()

    def test_satellite_imagery_analysis(self):
        """Test satellite imagery analysis"""
        result = self.carbon_system.analyze_satellite_imagery(
            "Mau_Complex", datetime.now()
        )
        
        assert 'region' in result
        assert 'forest_cover_percentage' in result
        assert 'carbon_stock_per_hectare' in result
        assert 'confidence_score' in result
        assert 0 <= result['confidence_score'] <= 1

    def test_sequestration_calculation(self):
        """Test carbon sequestration potential calculation"""
        result = self.carbon_system.calculate_sequestration_potential(
            land_use_type="agroforestry",
            area_hectares=100,
            management_practice="climate_smart"
        )
        
        assert 'annual_sequestration_tco2' in result
        assert 'sequestration_rate_per_hectare' in result
        assert result['annual_sequestration_tco2'] > 0

    def test_carbon_credit_report(self):
        """Test carbon credit report generation"""
        report = self.carbon_system.generate_carbon_credit_report(
            project_id="TEST-001",
            project_type="agroforestry",
            area=50,
            duration_months=12
        )
        
        assert 'verified_credits_tco2' in report
        assert 'estimated_value_usd' in report
        assert report['verified_credits_tco2'] > 0

# Integration tests
@pytest.mark.asyncio
async def test_comprehensive_system_integration():
    """Test integration between different AI systems"""
    from src.core.base_system import KenyaClimateAIPlatform
    
    platform = KenyaClimateAIPlatform()
    success = await platform.initialize_systems()
    
    assert success
    assert platform.systems['agriculture'] is not None
    assert platform.systems['early_warning'] is not None
    assert platform.systems['carbon_monitoring'] is not None

    # Test comprehensive status retrieval
    status = await platform.get_comprehensive_climate_status("Nakuru")
    
    assert 'county' in status
    assert 'timestamp' in status
    assert 'systems_status' in status

# Performance tests
def test_system_response_time():
    """Test that AI systems respond within acceptable time limits"""
    import time
    
    start_time = time.time()
    
    ai_system = KenyaAgricultureAI()
    ai_system.initialize_mock_data()
    
    yield_pred, confidence, recommendations = ai_system.predict_crop_yield(
        "Nakuru", "maize", datetime.now()
    )
    
    end_time = time.time()
    response_time = end_time - start_time
    
    # Should respond within 2 seconds for real-time applications
    assert response_time < 2.0

if __name__ == "__main__":
    pytest.main(["-v", "tests/"])