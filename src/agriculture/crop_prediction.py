
import numpy as np
from datetime import datetime, timedelta
import json

class KenyaAgricultureAI:
    def __init__(self):
        self.crop_types = ['maize', 'beans', 'sorghum', 'millet', 'cassava']
        self.counties = ['Nakuru', 'Uasin Gishu', 'Trans Nzoia', 'Machakos', 'Embu']
        self.weather_stations = {}
        self.soil_data = {}
        
    def initialize_mock_data(self):
        """Initialize with sample data for development"""
        for county in self.counties:
            self.weather_stations[county] = {
                'temperature': np.random.normal(24, 3),
                'rainfall': np.random.exponential(50),
                'humidity': np.random.normal(65, 10),
                'solar_radiation': np.random.normal(20, 3)
            }
            
            self.soil_data[county] = {
                'ph': np.random.normal(6.5, 0.5),
                'organic_matter': np.random.normal(2.5, 0.8),
                'nitrogen': np.random.normal(0.15, 0.05),
                'phosphorus': np.random.normal(12, 4),
                'potassium': np.random.normal(0.3, 0.1)
            }

    def predict_crop_yield(self, county, crop_type, planting_date):
        """
        Predict crop yield using AI models
        Returns: yield_prediction, confidence_score, recommendations
        """
        if county not in self.counties or crop_type not in self.crop_types:
            return None, 0, ["Invalid county or crop type"]
        
        # Simulate AI model prediction
        base_yield = {
            'maize': 2.5, 'beans': 1.2, 'sorghum': 1.8, 
            'millet': 1.0, 'cassava': 8.5
        }
        
        weather = self.weather_stations[county]
        soil = self.soil_data[county]
        
        # Climate suitability factors
        temp_factor = max(0.5, 1 - abs(weather['temperature'] - 25) / 10)
        rainfall_factor = min(1.0, weather['rainfall'] / 100)
        soil_factor = max(0.3, 1 - abs(soil['ph'] - 6.5) / 2)
        
        predicted_yield = base_yield[crop_type] * temp_factor * rainfall_factor * soil_factor
        confidence = (temp_factor + rainfall_factor + soil_factor) / 3
        
        recommendations = self.generate_recommendations(county, crop_type, weather, soil)
        
        return predicted_yield, confidence, recommendations
    
    def generate_recommendations(self, county, crop_type, weather, soil):
        """Generate AI-powered farming recommendations"""
        recommendations = []
        
        if weather['rainfall'] < 30:
            recommendations.append("Consider drought-tolerant varieties due to low rainfall prediction")
            recommendations.append("Implement water conservation techniques like mulching")
        
        if soil['ph'] < 6.0:
            recommendations.append("Apply lime to improve soil pH for better nutrient uptake")
        
        if weather['temperature'] > 30:
            recommendations.append("Plant during cooler months or use shade nets")
        
        if soil['nitrogen'] < 0.1:
            recommendations.append("Apply nitrogen-rich fertilizer or plant legumes for soil improvement")
            
        return recommendations

    def pest_disease_prediction(self, county, crop_type, current_weather):
        """Predict pest and disease risks using AI models"""
        risk_factors = {
            'fall_armyworm': 0.3 if current_weather.get('humidity', 0) > 70 else 0.1,
            'maize_streak_virus': 0.2 if current_weather.get('temperature', 0) > 28 else 0.05,
            'bean_rust': 0.4 if current_weather.get('rainfall', 0) > 80 else 0.1
        }
        
        return risk_factors

# Example usage and testing
if __name__ == "__main__":
    ai_system = KenyaAgricultureAI()
    ai_system.initialize_mock_data()
    
    # Test prediction
    yield_pred, confidence, recommendations = ai_system.predict_crop_yield(
        "Nakuru", "maize", datetime.now()
    )
    
    print(f"Predicted yield: {yield_pred:.2f} tonnes/hectare")
    print(f"Confidence: {confidence:.2f}")
    print("Recommendations:")
    for rec in recommendations:
        print(f"- {rec}")