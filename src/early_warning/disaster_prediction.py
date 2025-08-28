import numpy as np
from datetime import datetime, timedelta
import json

class KenyaEarlyWarningSystem:
    def __init__(self):
        self.risk_thresholds = {
            'drought': {'low': 0.3, 'medium': 0.6, 'high': 0.8},
            'flood': {'low': 0.25, 'medium': 0.5, 'high': 0.75},
            'locust': {'low': 0.2, 'medium': 0.4, 'high': 0.7}
        }
        
        self.vulnerable_counties = {
            'drought': ['Turkana', 'Marsabit', 'Samburu', 'Baringo'],
            'flood': ['Nairobi', 'Kisumu', 'Mombasa', 'Kilifi'],
            'locust': ['Mandera', 'Wajir', 'Garissa', 'Isiolo']
        }

    def predict_drought_risk(self, county, historical_rainfall, soil_moisture, vegetation_index):
        """
        AI-powered drought prediction model
        Uses satellite data, weather patterns, and vegetation indices
        """
        # Simulate AI model using multiple indicators
        rainfall_score = max(0, 1 - (historical_rainfall / 100))  # Lower rainfall = higher risk
        soil_score = max(0, 1 - (soil_moisture / 50))  # Lower moisture = higher risk
        vegetation_score = max(0, 1 - (vegetation_index / 0.8))  # Lower NDVI = higher risk
        
        # Weight factors based on Kenya-specific conditions
        drought_risk = (rainfall_score * 0.4 + soil_score * 0.35 + vegetation_score * 0.25)
        
        # Adjust for county vulnerability
        if county in self.vulnerable_counties['drought']:
            drought_risk *= 1.2
        
        risk_level = self.categorize_risk(drought_risk, 'drought')
        
        return {
            'risk_score': drought_risk,
            'risk_level': risk_level,
            'prediction_days': 90,  # 3-month forecast
            'confidence': 0.85,
            'next_update': datetime.now() + timedelta(days=7)
        }

    def predict_flood_risk(self, county, river_levels, rainfall_forecast, soil_saturation):
        """
        AI flood prediction using hydrological models
        """
        # River level factor (normalized)
        river_factor = min(1.0, river_levels / 100)
        
        # Rainfall intensity factor
        rainfall_factor = min(1.0, rainfall_forecast / 150)
        
        # Soil saturation factor
        saturation_factor = soil_saturation / 100
        
        flood_risk = (river_factor * 0.4 + rainfall_factor * 0.4 + saturation_factor * 0.2)
        
        # Urban areas have higher flood risk
        if county in ['Nairobi', 'Mombasa', 'Kisumu']:
            flood_risk *= 1.3
        
        risk_level = self.categorize_risk(flood_risk, 'flood')
        
        return {
            'risk_score': flood_risk,
            'risk_level': risk_level,
            'prediction_days': 7,  # 7-day forecast
            'confidence': 0.78,
            'evacuation_zones': self.get_evacuation_zones(county) if risk_level == 'high' else []
        }

    def predict_locust_swarm(self, county, temperature, humidity, wind_patterns, breeding_sites):
        """
        AI locust swarm prediction using environmental factors
        """
        # Temperature suitability (25-35°C optimal)
        temp_factor = 1 - abs(temperature - 30) / 20 if 20 <= temperature <= 40 else 0
        
        # Humidity factor (breeding requires moisture)
        humidity_factor = min(1.0, humidity / 80)
        
        # Wind pattern analysis (affects migration)
        wind_factor = min(1.0, wind_patterns / 25)
        
        # Breeding site density
        breeding_factor = min(1.0, breeding_sites / 10)
        
        locust_risk = (temp_factor * 0.3 + humidity_factor * 0.3 + 
                      wind_factor * 0.2 + breeding_factor * 0.2)
        
        # Northern counties are more vulnerable
        if county in self.vulnerable_counties['locust']:
            locust_risk *= 1.4
        
        risk_level = self.categorize_risk(locust_risk, 'locust')
        
        return {
            'risk_score': locust_risk,
            'risk_level': risk_level,
            'prediction_days': 60,  # 2-month forecast
            'confidence': 0.72,
            'migration_path': self.predict_migration_path(county) if risk_level in ['medium', 'high'] else None
        }

    def categorize_risk(self, risk_score, disaster_type):
        """Categorize risk based on thresholds"""
        thresholds = self.risk_thresholds[disaster_type]
        
        if risk_score >= thresholds['high']:
            return 'high'
        elif risk_score >= thresholds['medium']:
            return 'medium'
        elif risk_score >= thresholds['low']:
            return 'low'
        else:
            return 'minimal'

    def get_evacuation_zones(self, county):
        """Return evacuation zones for high-risk areas"""
        # Mock evacuation zones - would be integrated with real geographic data
        zones = {
            'Nairobi': ['Mathare', 'Kibera', 'Mukuru'],
            'Mombasa': ['Old Town', 'Tudor', 'Likoni'],
            'Kisumu': ['Nyalenda', 'Obunga', 'Bandani']
        }
        return zones.get(county, [])

    def predict_migration_path(self, county):
        """Predict locust migration patterns"""
        # Simplified migration prediction
        return f"Predicted movement from {county} towards South-Southeast"

    def generate_early_warning_alert(self, county, disaster_type, risk_data):
        """Generate standardized early warning message"""
        alert = {
            'timestamp': datetime.now().isoformat(),
            'county': county,
            'disaster_type': disaster_type,
            'risk_level': risk_data['risk_level'],
            'confidence': risk_data['confidence'],
            'valid_until': (datetime.now() + timedelta(days=risk_data['prediction_days'])).isoformat(),
            'message': self.create_alert_message(county, disaster_type, risk_data),
            'actions_recommended': self.get_recommended_actions(disaster_type, risk_data['risk_level'])
        }
        return alert

    def create_alert_message(self, county, disaster_type, risk_data):
        """Create human-readable alert message"""
        messages = {
            'drought': f"AI models predict {risk_data['risk_level']} drought risk for {county} over the next {risk_data['prediction_days']} days.",
            'flood': f"Flood warning for {county}: {risk_data['risk_level']} risk detected for the next {risk_data['prediction_days']} days.",
            'locust': f"Locust swarm risk in {county}: {risk_data['risk_level']} probability over {risk_data['prediction_days']} days."
        }
        return messages.get(disaster_type, "Climate risk detected")

    def get_recommended_actions(self, disaster_type, risk_level):
        """Get recommended actions based on disaster type and risk level"""
        actions = {
            'drought': {
                'low': ['Monitor water sources', 'Prepare backup irrigation'],
                'medium': ['Implement water conservation', 'Consider drought-resistant crops'],
                'high': ['Emergency water distribution', 'Livestock destocking', 'Food aid preparation']
            },
            'flood': {
                'low': ['Monitor river levels', 'Clear drainage systems'],
                'medium': ['Prepare sandbags', 'Move valuables to higher ground'],
                'high': ['Evacuate low-lying areas', 'Emergency shelters activated']
            },
            'locust': {
                'low': ['Monitor vegetation', 'Report unusual insect activity'],
                'medium': ['Prepare pesticides', 'Community surveillance teams'],
                'high': ['Aerial spraying operations', 'Crop protection measures']
            }
        }
        return actions.get(disaster_type, {}).get(risk_level, [])

# Example usage
if __name__ == "__main__":
    warning_system = KenyaEarlyWarningSystem()
    
    # Test drought prediction
    drought_risk = warning_system.predict_drought_risk(
        county="Turkana",
        historical_rainfall=25.5,  # mm
        soil_moisture=15.2,  # percentage
        vegetation_index=0.3  # NDVI
    )
    
    print("Drought Prediction for Turkana:")
    print(json.dumps(drought_risk, indent=2))
    
    # Generate alert
    alert = warning_system.generate_early_warning_alert("Turkana", "drought", drought_risk)
    print("\nGenerated Alert:")
    print(json.dumps(alert, indent=2))