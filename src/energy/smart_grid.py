# Kenya Smart Grid AI System
# File: src/energy/smart_grid.py

import numpy as np
from datetime import datetime, timedelta
import json

class KenyaSmartGridAI:
    def __init__(self):
        self.generation_capacity = {
            'geothermal': 985,  # MW
            'hydro': 825,
            'wind': 335,
            'solar': 180,
            'thermal': 678
        }
        
        self.regional_demand = {
            'nairobi': 450,  # MW average
            'mombasa': 180,
            'kisumu': 85,
            'nakuru': 65,
            'eldoret': 55
        }

    def predict_energy_demand(self, region, weather_data, economic_indicators):
        """
        AI-powered energy demand forecasting
        """
        base_demand = self.regional_demand.get(region, 50)
        
        # Weather impact factors
        temperature = weather_data.get('temperature', 25)
        humidity = weather_data.get('humidity', 60)
        
        # Temperature-based cooling/heating demand
        if temperature > 28:
            temp_factor = 1 + (temperature - 28) * 0.05  # 5% increase per degree
        elif temperature < 18:
            temp_factor = 1 + (18 - temperature) * 0.03  # 3% increase per degree
        else:
            temp_factor = 1.0
        
        # Economic activity factor
        industrial_activity = economic_indicators.get('industrial_index', 1.0)
        commercial_activity = economic_indicators.get('commercial_index', 1.0)
        
        activity_factor = (industrial_activity * 0.4 + commercial_activity * 0.3 + 0.3)
        
        # Time-based patterns (simplified)
        hour = datetime.now().hour
        if 18 <= hour <= 22:  # Peak evening hours
            time_factor = 1.3
        elif 6 <= hour <= 8:   # Morning peak
            time_factor = 1.15
        elif 0 <= hour <= 6:   # Night low demand
            time_factor = 0.7
        else:
            time_factor = 1.0
        
        predicted_demand = base_demand * temp_factor * activity_factor * time_factor
        
        return {
            'region': region,
            'predicted_demand_mw': predicted_demand,
            'base_demand_mw': base_demand,
            'weather_impact': temp_factor,
            'economic_impact': activity_factor,
            'time_impact': time_factor,
            'confidence': 0.85,
            'forecast_horizon': '24_hours'
        }

    def optimize_renewable_generation(self, weather_forecast, grid_demand):
        """
        Optimize renewable energy generation based on weather and demand
        """
        # Solar generation prediction
        solar_irradiance = weather_forecast.get('solar_irradiance', 600)  # W/m²
        cloud_cover = weather_forecast.get('cloud_cover', 30)  # percentage
        
        solar_efficiency = max(0, (solar_irradiance / 1000) * (1 - cloud_cover / 100))
        predicted_solar = self.generation_capacity['solar'] * solar_efficiency
        
        # Wind generation prediction
        wind_speed = weather_forecast.get('wind_speed', 8)  # m/s
        wind_efficiency = min(1.0, max(0, (wind_speed - 3) / 12))  # Cut-in at 3 m/s
        predicted_wind = self.generation_capacity['wind'] * wind_efficiency
        
        # Hydro generation (seasonal factors)
        rainfall = weather_forecast.get('recent_rainfall', 50)  # mm
        hydro_efficiency = min(1.0, rainfall / 100)  # Simplified reservoir level
        predicted_hydro = self.generation_capacity['hydro'] * hydro_efficiency
        
        # Geothermal (stable baseline)
        predicted_geothermal = self.generation_capacity['geothermal'] * 0.95  # 95% availability
        
        total_renewable = predicted_solar + predicted_wind + predicted_hydro + predicted_geothermal
        
        # Thermal backup calculation
        renewable_shortfall = max(0, grid_demand - total_renewable)
        thermal_needed = min(self.generation_capacity['thermal'], renewable_shortfall)
        
        return {
            'renewable_generation': {
                'solar_mw': predicted_solar,
                'wind_mw': predicted_wind,
                'hydro_mw': predicted_hydro,
                'geothermal_mw': predicted_geothermal,
                'total_renewable_mw': total_renewable
            },
            'thermal_backup_mw': thermal_needed,
            'renewable_percentage': (total_renewable / (total_renewable + thermal_needed)) * 100,
            'grid_stability_score': self.calculate_stability_score(total_renewable, grid_demand),
            'optimization_timestamp': datetime.now().isoformat()
        }

    def calculate_stability_score(self, renewable_output, demand):
        """Calculate grid stability score based on supply-demand balance"""
        balance_ratio = renewable_output / demand if demand > 0 else 0
        
        if 0.95 <= balance_ratio <= 1.05:  # Optimal range
            stability = 0.95
        elif 0.8 <= balance_ratio <= 1.2:  # Acceptable range
            stability = 0.8
        else:
            stability = max(0.3, 1 - abs(balance_ratio - 1))
        
        return stability

    def predictive_maintenance(self, equipment_type, sensor_readings, maintenance_history):
        """
        AI-powered predictive maintenance for grid infrastructure
        """
        # Simulate sensor data analysis
        vibration = sensor_readings.get('vibration', 0.5)
        temperature = sensor_readings.get('temperature', 45)
        current = sensor_readings.get('current', 100)
        
        # Equipment-specific failure prediction models
        failure_indicators = {
            'transformer': {
                'temperature_threshold': 85,
                'current_anomaly': 1.2,
                'vibration_limit': 2.0
            },
            'generator': {
                'temperature_threshold': 75,
                'current_anomaly': 1.15,
                'vibration_limit': 3.0
            },
            'transmission_line': {
                'temperature_threshold': 60,
                'current_anomaly': 1.1,
                'vibration_limit': 1.5
            }
        }
        
        thresholds = failure_indicators.get(equipment_type, failure_indicators['transformer'])
        
        # Risk calculation
        temp_risk = max(0, (temperature - thresholds['temperature_threshold']) / 20)
        current_risk = max(0, (current / 100) - thresholds['current_anomaly'])
        vibration_risk = max(0, (vibration - thresholds['vibration_limit']) / 2)
        
        overall_risk = (temp_risk + current_risk + vibration_risk) / 3
        
        # Maintenance recommendation
        if overall_risk > 0.7:
            recommendation = "Immediate maintenance required"
            priority = "high"
        elif overall_risk > 0.4:
            recommendation = "Schedule maintenance within 7 days"
            priority = "medium"
        elif overall_risk > 0.2:
            recommendation = "Monitor closely, maintenance within 30 days"
            priority = "low"
        else:
            recommendation = "Equipment operating normally"
            priority = "none"
        
        return {
            'equipment_type': equipment_type,
            'risk_score': overall_risk,
            'priority': priority,
            'recommendation': recommendation,
            'sensor_analysis': {
                'temperature_status': 'normal' if temperature < thresholds['temperature_threshold'] else 'elevated',
                'current_status': 'normal' if (current/100) < thresholds['current_anomaly'] else 'anomaly',
                'vibration_status': 'normal' if vibration < thresholds['vibration_limit'] else 'excessive'
            },
            'estimated_failure_probability': overall_risk,
            'recommended_action_date': datetime.now() + timedelta(days=7 if overall_risk > 0.4 else 30)
        }

    def rural_microgrid_optimization(self, community_size, local_generation, storage_capacity):
        """
        Optimize rural microgrid operations for off-grid communities
        """
        # Estimate community energy needs
        households = community_size
        daily_consumption_per_household = 5  # kWh
        total_daily_consumption = households * daily_consumption_per_household
        
        # Solar generation prediction (rural areas typically solar-focused)
        peak_solar_hours = 6
        solar_generation_daily = local_generation * peak_solar_hours
        
        # Battery optimization
        required_storage = total_daily_consumption * 1.5  # 1.5 days backup
        storage_utilization = min(1.0, required_storage / storage_capacity) if storage_capacity > 0 else 0
        
        # Grid autonomy calculation
        energy_balance = solar_generation_daily - total_daily_consumption
        autonomy_days = max(0, storage_capacity / total_daily_consumption) if total_daily_consumption > 0 else 0
        
        return {
            'community_size': households,
            'daily_consumption_kwh': total_daily_consumption,
            'solar_generation_kwh': solar_generation_daily,
            'energy_balance_kwh': energy_balance,
            'storage_utilization': storage_utilization,
            'autonomy_days': autonomy_days,
            'sustainability_score': min(1.0, solar_generation_daily / total_daily_consumption) if total_daily_consumption > 0 else 0,
            'recommendations': self.get_microgrid_recommendations(energy_balance, storage_utilization, autonomy_days)
        }

    def get_microgrid_recommendations(self, energy_balance, storage_utilization, autonomy_days):
        """Generate recommendations for microgrid optimization"""
        recommendations = []
        
        if energy_balance < 0:
            recommendations.append("Increase solar panel capacity by {}kW".format(abs(energy_balance) / 6))
        
        if storage_utilization > 0.9:
            recommendations.append("Add battery storage capacity")
        
        if autonomy_days < 2:
            recommendations.append("Increase backup power storage for better reliability")
        
        if energy_balance > 50:
            recommendations.append("Consider selling excess energy or adding community facilities")
        
        return recommendations

# Urban Climate Resilience Module
class KenyaUrbanClimateAI:
    def __init__(self):
        self.urban_areas = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret']
        self.pollution_thresholds = {
            'pm25': {'good': 12, 'moderate': 35, 'unhealthy': 55},
            'pm10': {'good': 54, 'moderate': 154, 'unhealthy': 254},
            'no2': {'good': 53, 'moderate': 100, 'unhealthy': 360}
        }

    def air_quality_prediction(self, city, weather_conditions, traffic_data, industrial_activity):
        """
        AI-powered air quality forecasting
        """
        # Base pollution levels by city (simplified)
        base_pollution = {
            'Nairobi': {'pm25': 25, 'pm10': 45, 'no2': 35},
            'Mombasa': {'pm25': 22, 'pm10': 40, 'no2': 30},
            'Kisumu': {'pm25': 18, 'pm10': 35, 'no2': 25},
            'Nakuru': {'pm25': 20, 'pm10': 38, 'no2': 28},
            'Eldoret': {'pm25': 16, 'pm10': 32, 'no2': 22}
        }
        
        base_levels = base_pollution.get(city, base_pollution['Nairobi'])
        
        # Weather impact
        wind_speed = weather_conditions.get('wind_speed', 3)  # m/s
        humidity = weather_conditions.get('humidity', 60)
        temperature = weather_conditions.get('temperature', 25)
        
        # Wind disperses pollutants
        wind_factor = max(0.5, 1 - (wind_speed - 2) / 10)
        
        # High humidity can trap pollutants
        humidity_factor = 1 + (humidity - 50) / 200
        
        # Temperature inversion effects
        temp_factor = 1.1 if temperature < 18 else 1.0
        
        # Traffic impact
        traffic_factor = traffic_data.get('congestion_level', 1.0)  # 1.0 = normal, 1.5 = heavy
        
        # Industrial impact
        industrial_factor = industrial_activity.get('activity_level', 1.0)
        
        # Calculate predicted pollutant levels
        predicted_levels = {}
        for pollutant, base_level in base_levels.items():
            predicted = base_level * wind_factor * humidity_factor * temp_factor
            
            if pollutant in ['pm25', 'pm10']:  # Traffic-related
                predicted *= traffic_factor
            if pollutant == 'no2':  # Industrial-related
                predicted *= industrial_factor
            
            predicted_levels[pollutant] = predicted
        
        # Calculate AQI and health recommendations
        aqi_score = self.calculate_aqi(predicted_levels)
        
        return {
            'city': city,
            'predicted_pollutant_levels': predicted_levels,
            'aqi_score': aqi_score,
            'air_quality_category': self.get_aqi_category(aqi_score),
            'health_recommendations': self.get_health_recommendations(aqi_score),
            'forecast_confidence': 0.78,
            'valid_for_hours': 24
        }

    def calculate_aqi(self, pollutant_levels):
        """Calculate Air Quality Index from pollutant levels"""
        # Simplified AQI calculation
        pm25_aqi = min(200, (pollutant_levels['pm25'] / 35) * 100)
        pm10_aqi = min(200, (pollutant_levels['pm10'] / 154) * 100)
        no2_aqi = min(200, (pollutant_levels['no2'] / 100) * 100)
        
        return max(pm25_aqi, pm10_aqi, no2_aqi)

    def get_aqi_category(self, aqi_score):
        """Get AQI category from score"""
        if aqi_score <= 50:
            return 'Good'
        elif aqi_score <= 100:
            return 'Moderate'
        elif aqi_score <= 150:
            return 'Unhealthy for Sensitive Groups'
        else:
            return 'Unhealthy'

    def get_health_recommendations(self, aqi_score):
        """Get health recommendations based on AQI"""
        if aqi_score <= 50:
            return ["Air quality is good. Ideal for outdoor activities."]
        elif aqi_score <= 100:
            return ["Air quality is acceptable.", "Sensitive individuals should consider limiting outdoor activities."]
        elif aqi_score <= 150:
            return ["Unhealthy for sensitive groups.", "Children, elderly, and people with respiratory conditions should limit outdoor activities."]
        else:
            return ["Air quality is unhealthy.", "Everyone should limit outdoor activities.", "Wear masks when outdoors."]

    def urban_heat_island_analysis(self, city, temperature_data, land_use_map, vegetation_index):
        """
        Analyze urban heat island effect and recommend mitigation
        """
        # Simulate urban heat analysis
        urban_temp = temperature_data.get('urban_core', 28)
        rural_temp = temperature_data.get('rural_reference', 25)
        heat_island_intensity = urban_temp - rural_temp
        
        # Land use impact analysis
        concrete_coverage = land_use_map.get('concrete_percentage', 60)
        green_coverage = land_use_map.get('green_percentage', 25)
        
        # Vegetation cooling effect
        vegetation_cooling = vegetation_index * 2  # 2°C max cooling effect
        
        return {
            'city': city,
            'heat_island_intensity': heat_island_intensity,
            'urban_temperature': urban_temp,
            'cooling_potential': vegetation_cooling,
            'concrete_coverage_percent': concrete_coverage,
            'green_coverage_percent': green_coverage,
            'mitigation_recommendations': self.get_heat_mitigation_recommendations(heat_island_intensity, green_coverage),
            'priority_areas': self.identify_priority_cooling_areas(city, heat_island_intensity)
        }

    def get_heat_mitigation_recommendations(self, heat_intensity, green_coverage):
        """Get recommendations for urban heat mitigation"""
        recommendations = []
        
        if heat_intensity > 3:
            recommendations.append("Urgent need for urban cooling interventions")
        
        if green_coverage < 20:
            recommendations.append("Increase urban tree canopy and green spaces")
            recommendations.append("Implement rooftop gardens and vertical greening")
        
        if heat_intensity > 2:
            recommendations.append("Use cool roofing materials and light-colored surfaces")
            recommendations.append("Create shaded walkways and public spaces")
        
        recommendations.append("Improve urban planning to include climate-responsive design")
        
        return recommendations

    def identify_priority_cooling_areas(self, city, heat_intensity):
        """Identify priority areas for cooling interventions"""
        # Mock priority areas - would use real geographic data
        priority_areas = {
            'Nairobi': ['CBD', 'Industrial Area', 'Eastleigh'],
            'Mombasa': ['Old Town', 'Nyali', 'Tudor'],
            'Kisumu': ['City Center', 'Mamboleo', 'Kondele']
        }
        
        return priority_areas.get(city, ['City Center'])

# Example usage
if __name__ == "__main__":
    # Test Smart Grid System
    grid_system = KenyaSmartGridAI()
    
    weather_forecast = {
        'solar_irradiance': 750,
        'cloud_cover': 20,
        'wind_speed': 12,
        'recent_rainfall': 65
    }
    
    optimization = grid_system.optimize_renewable_generation(weather_forecast, 1200)  # 1200 MW demand
    print("Grid Optimization:")
    print(json.dumps(optimization, indent=2, default=str))
    
    # Test Urban Climate System
    urban_system = KenyaUrbanClimateAI()
    
    weather_conditions = {
        'wind_speed': 2.5,
        'humidity': 75,
        'temperature': 26
    }
    
    traffic_data = {'congestion_level': 1.3}
    industrial_data = {'activity_level': 1.1}
    
    air_quality = urban_system.air_quality_prediction('Nairobi', weather_conditions, traffic_data, industrial_data)
    print("\nAir Quality Prediction:")
    print(json.dumps(air_quality, indent=2))