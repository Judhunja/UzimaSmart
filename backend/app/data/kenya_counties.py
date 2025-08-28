"""
Complete Kenya Counties Data
All 47 counties with geographical boundaries and climate characteristics
"""

KENYA_COUNTIES = {
    # Nairobi Region
    1: {
        "name": "Nairobi",
        "bounds": {"north": -1.163, "south": -1.444, "east": 37.104, "west": 36.752},
        "capital": "Nairobi",
        "climate_zone": "Highland Urban",
        "population": 4397073,
        "area_km2": 696,
        "elevation_m": 1795,
        "annual_rainfall_mm": 874,
        "avg_temp_c": 19.3
    },
    
    # Central Kenya
    2: {
        "name": "Kiambu",
        "bounds": {"north": -0.85, "south": -1.45, "east": 37.25, "west": 36.55},
        "capital": "Kiambu",
        "climate_zone": "Highland Agricultural",
        "population": 2417735,
        "area_km2": 2449,
        "elevation_m": 1720,
        "annual_rainfall_mm": 1050,
        "avg_temp_c": 18.8
    },
    3: {
        "name": "Murang'a",
        "bounds": {"north": -0.55, "south": -1.15, "east": 37.25, "west": 36.75},
        "capital": "Murang'a",
        "climate_zone": "Highland Agricultural",
        "population": 1056640,
        "area_km2": 2558,
        "elevation_m": 1524,
        "annual_rainfall_mm": 1200,
        "avg_temp_c": 19.2
    },
    4: {
        "name": "Nyeri",
        "bounds": {"north": -0.25, "south": -0.95, "east": 37.25, "west": 36.65},
        "capital": "Nyeri",
        "climate_zone": "Highland Agricultural",
        "population": 759164,
        "area_km2": 3356,
        "elevation_m": 1759,
        "annual_rainfall_mm": 1100,
        "avg_temp_c": 17.8
    },
    5: {
        "name": "Kirinyaga",
        "bounds": {"north": -0.35, "south": -0.75, "east": 37.55, "west": 37.05},
        "capital": "Kerugoya",
        "climate_zone": "Highland Agricultural",
        "population": 610411,
        "area_km2": 1478,
        "elevation_m": 1432,
        "annual_rainfall_mm": 1150,
        "avg_temp_c": 19.5
    },
    6: {
        "name": "Nyandarua",
        "bounds": {"north": -0.15, "south": -0.75, "east": 36.95, "west": 36.25},
        "capital": "Ol Kalou",
        "climate_zone": "Highland Cold",
        "population": 638289,
        "area_km2": 3304,
        "elevation_m": 2359,
        "annual_rainfall_mm": 950,
        "avg_temp_c": 14.2
    },
    
    # Coast Province
    7: {
        "name": "Mombasa",
        "bounds": {"north": -3.95, "south": -4.3, "east": 39.82, "west": 39.52},
        "capital": "Mombasa",
        "climate_zone": "Coastal Tropical",
        "population": 1208333,
        "area_km2": 230,
        "elevation_m": 17,
        "annual_rainfall_mm": 1200,
        "avg_temp_c": 27.1
    },
    8: {
        "name": "Kwale",
        "bounds": {"north": -3.85, "south": -4.75, "east": 39.65, "west": 39.15},
        "capital": "Kwale",
        "climate_zone": "Coastal",
        "population": 866820,
        "area_km2": 8270,
        "elevation_m": 30,
        "annual_rainfall_mm": 1100,
        "avg_temp_c": 26.8
    },
    9: {
        "name": "Kilifi",
        "bounds": {"north": -2.85, "south": -4.05, "east": 40.15, "west": 39.65},
        "capital": "Kilifi",
        "climate_zone": "Coastal",
        "population": 1453787,
        "area_km2": 12245,
        "elevation_m": 25,
        "annual_rainfall_mm": 1050,
        "avg_temp_c": 26.5
    },
    10: {
        "name": "Tana River",
        "bounds": {"north": -0.85, "south": -2.95, "east": 40.35, "west": 38.85},
        "capital": "Hola",
        "climate_zone": "Arid",
        "population": 315943,
        "area_km2": 38437,
        "elevation_m": 40,
        "annual_rainfall_mm": 350,
        "avg_temp_c": 28.2
    },
    11: {
        "name": "Lamu",
        "bounds": {"north": -1.85, "south": -2.35, "east": 41.05, "west": 40.45},
        "capital": "Lamu",
        "climate_zone": "Coastal",
        "population": 143920,
        "area_km2": 6273,
        "elevation_m": 5,
        "annual_rainfall_mm": 900,
        "avg_temp_c": 27.8
    },
    12: {
        "name": "Taita-Taveta",
        "bounds": {"north": -3.15, "south": -4.25, "east": 38.95, "west": 37.65},
        "capital": "Voi",
        "climate_zone": "Semi-Arid",
        "population": 340671,
        "area_km2": 17084,
        "elevation_m": 600,
        "annual_rainfall_mm": 650,
        "avg_temp_c": 25.1
    },
    
    # Eastern Province
    13: {
        "name": "Garissa",
        "bounds": {"north": 1.45, "south": -1.65, "east": 41.35, "west": 38.85},
        "capital": "Garissa",
        "climate_zone": "Arid",
        "population": 841353,
        "area_km2": 45720,
        "elevation_m": 147,
        "annual_rainfall_mm": 280,
        "avg_temp_c": 29.5
    },
    14: {
        "name": "Wajir",
        "bounds": {"north": 3.85, "south": 1.45, "east": 41.85, "west": 39.85},
        "capital": "Wajir",
        "climate_zone": "Arid",
        "population": 781263,
        "area_km2": 55840,
        "elevation_m": 244,
        "annual_rainfall_mm": 250,
        "avg_temp_c": 30.8
    },
    15: {
        "name": "Mandera",
        "bounds": {"north": 4.15, "south": 2.85, "east": 42.15, "west": 40.85},
        "capital": "Mandera",
        "climate_zone": "Arid",
        "population": 1025756,
        "area_km2": 26740,
        "elevation_m": 230,
        "annual_rainfall_mm": 200,
        "avg_temp_c": 31.2
    },
    16: {
        "name": "Marsabit",
        "bounds": {"north": 4.45, "south": 1.85, "east": 39.85, "west": 36.85},
        "capital": "Marsabit",
        "climate_zone": "Arid",
        "population": 459785,
        "area_km2": 61296,
        "elevation_m": 1345,
        "annual_rainfall_mm": 350,
        "avg_temp_c": 22.8
    },
    17: {
        "name": "Isiolo",
        "bounds": {"north": 1.85, "south": 0.35, "east": 39.35, "west": 37.35},
        "capital": "Isiolo",
        "climate_zone": "Arid",
        "population": 268002,
        "area_km2": 25336,
        "elevation_m": 1165,
        "annual_rainfall_mm": 320,
        "avg_temp_c": 26.1
    },
    18: {
        "name": "Meru",
        "bounds": {"north": 0.55, "south": -0.25, "east": 38.25, "west": 37.25},
        "capital": "Meru",
        "climate_zone": "Highland Agricultural",
        "population": 1545714,
        "area_km2": 6936,
        "elevation_m": 1554,
        "annual_rainfall_mm": 1400,
        "avg_temp_c": 20.1
    },
    19: {
        "name": "Tharaka-Nithi",
        "bounds": {"north": 0.15, "south": -0.45, "east": 38.05, "west": 37.45},
        "capital": "Chuka",
        "climate_zone": "Highland Agricultural",
        "population": 393177,
        "area_km2": 2609,
        "elevation_m": 1200,
        "annual_rainfall_mm": 1200,
        "avg_temp_c": 21.3
    },
    20: {
        "name": "Embu",
        "bounds": {"north": -0.25, "south": -0.85, "east": 37.95, "west": 37.25},
        "capital": "Embu",
        "climate_zone": "Highland Agricultural",
        "population": 608599,
        "area_km2": 2821,
        "elevation_m": 1493,
        "annual_rainfall_mm": 1300,
        "avg_temp_c": 19.8
    },
    21: {
        "name": "Kitui",
        "bounds": {"north": -0.45, "south": -1.95, "east": 38.95, "west": 37.45},
        "capital": "Kitui",
        "climate_zone": "Semi-Arid",
        "population": 1136187,
        "area_km2": 24385,
        "elevation_m": 1100,
        "annual_rainfall_mm": 650,
        "avg_temp_c": 23.4
    },
    22: {
        "name": "Machakos",
        "bounds": {"north": -1.05, "south": -1.85, "east": 37.95, "west": 36.85},
        "capital": "Machakos",
        "climate_zone": "Semi-Arid",
        "population": 1421932,
        "area_km2": 5952,
        "elevation_m": 1500,
        "annual_rainfall_mm": 700,
        "avg_temp_c": 21.5
    },
    23: {
        "name": "Makueni",
        "bounds": {"north": -1.65, "south": -3.05, "east": 38.45, "west": 37.35},
        "capital": "Wote",
        "climate_zone": "Semi-Arid",
        "population": 987653,
        "area_km2": 8008,
        "elevation_m": 1000,
        "annual_rainfall_mm": 600,
        "avg_temp_c": 24.2
    },
    
    # North Eastern Province
    24: {
        "name": "Turkana",
        "bounds": {"north": 5.55, "south": 1.55, "east": 36.85, "west": 34.85},
        "capital": "Lodwar",
        "climate_zone": "Arid",
        "population": 926976,
        "area_km2": 68680,
        "elevation_m": 500,
        "annual_rainfall_mm": 200,
        "avg_temp_c": 32.1
    },
    25: {
        "name": "West Pokot",
        "bounds": {"north": 3.55, "south": 1.25, "east": 35.85, "west": 34.85},
        "capital": "Kapenguria",
        "climate_zone": "Semi-Arid",
        "population": 621241,
        "area_km2": 9169,
        "elevation_m": 1200,
        "annual_rainfall_mm": 800,
        "avg_temp_c": 22.5
    },
    26: {
        "name": "Samburu",
        "bounds": {"north": 2.85, "south": 0.55, "east": 38.25, "west": 36.25},
        "capital": "Maralal",
        "climate_zone": "Arid",
        "population": 310327,
        "area_km2": 20182,
        "elevation_m": 1965,
        "annual_rainfall_mm": 450,
        "avg_temp_c": 19.8
    },
    
    # Rift Valley Province
    27: {
        "name": "Trans-Nzoia",
        "bounds": {"north": 1.35, "south": 0.65, "east": 35.35, "west": 34.65},
        "capital": "Kitale",
        "climate_zone": "Highland Agricultural",
        "population": 818757,
        "area_km2": 2495,
        "elevation_m": 1875,
        "annual_rainfall_mm": 1200,
        "avg_temp_c": 18.9
    },
    28: {
        "name": "Uasin Gishu",
        "bounds": {"north": 1.15, "south": 0.25, "east": 35.85, "west": 35.05},
        "capital": "Eldoret",
        "climate_zone": "Highland Agricultural",
        "population": 1163186,
        "area_km2": 3327,
        "elevation_m": 2100,
        "annual_rainfall_mm": 1150,
        "avg_temp_c": 16.8
    },
    29: {
        "name": "Elgeyo-Marakwet",
        "bounds": {"north": 1.45, "south": 0.55, "east": 35.85, "west": 35.25},
        "capital": "Iten",
        "climate_zone": "Highland",
        "population": 454480,
        "area_km2": 3049,
        "elevation_m": 2200,
        "annual_rainfall_mm": 1100,
        "avg_temp_c": 15.2
    },
    30: {
        "name": "Nandi",
        "bounds": {"north": 0.65, "south": -0.15, "east": 35.35, "west": 34.85},
        "capital": "Kapsabet",
        "climate_zone": "Highland Agricultural",
        "population": 885711,
        "area_km2": 2884,
        "elevation_m": 1950,
        "annual_rainfall_mm": 1300,
        "avg_temp_c": 17.5
    },
    31: {
        "name": "Baringo",
        "bounds": {"north": 1.75, "south": 0.15, "east": 36.35, "west": 35.35},
        "capital": "Kabarnet",
        "climate_zone": "Semi-Arid",
        "population": 666763,
        "area_km2": 11015,
        "elevation_m": 1000,
        "annual_rainfall_mm": 650,
        "avg_temp_c": 24.8
    },
    32: {
        "name": "Laikipia",
        "bounds": {"north": 0.75, "south": -0.15, "east": 37.35, "west": 36.25},
        "capital": "Nanyuki",
        "climate_zone": "Highland Semi-Arid",
        "population": 518560,
        "area_km2": 9229,
        "elevation_m": 1950,
        "annual_rainfall_mm": 650,
        "avg_temp_c": 16.9
    },
    33: {
        "name": "Nakuru",
        "bounds": {"north": 0.25, "south": -1.25, "east": 36.45, "west": 35.55},
        "capital": "Nakuru",
        "climate_zone": "Highland Agricultural",
        "population": 2162202,
        "area_km2": 7509,
        "elevation_m": 1850,
        "annual_rainfall_mm": 950,
        "avg_temp_c": 18.1
    },
    34: {
        "name": "Narok",
        "bounds": {"north": -0.85, "south": -2.15, "east": 36.85, "west": 35.25},
        "capital": "Narok",
        "climate_zone": "Highland Semi-Arid",
        "population": 1157873,
        "area_km2": 17944,
        "elevation_m": 1827,
        "annual_rainfall_mm": 800,
        "avg_temp_c": 19.4
    },
    35: {
        "name": "Kajiado",
        "bounds": {"north": -1.25, "south": -2.95, "east": 37.95, "west": 36.05},
        "capital": "Kajiado",
        "climate_zone": "Semi-Arid",
        "population": 1117840,
        "area_km2": 21292,
        "elevation_m": 1500,
        "annual_rainfall_mm": 600,
        "avg_temp_c": 20.8
    },
    36: {
        "name": "Kericho",
        "bounds": {"north": -0.15, "south": -0.85, "east": 35.65, "west": 35.05},
        "capital": "Kericho",
        "climate_zone": "Highland Agricultural",
        "population": 901777,
        "area_km2": 2479,
        "elevation_m": 2002,
        "annual_rainfall_mm": 1400,
        "avg_temp_c": 16.2
    },
    37: {
        "name": "Bomet",
        "bounds": {"north": -0.45, "south": -1.15, "east": 35.45, "west": 34.95},
        "capital": "Bomet",
        "climate_zone": "Highland Agricultural",
        "population": 875689,
        "area_km2": 1997,
        "elevation_m": 1875,
        "annual_rainfall_mm": 1300,
        "avg_temp_c": 17.1
    },
    
    # Western Province
    38: {
        "name": "Kakamega",
        "bounds": {"north": 0.95, "south": -0.25, "east": 35.05, "west": 34.35},
        "capital": "Kakamega",
        "climate_zone": "Highland Tropical",
        "population": 1867579,
        "area_km2": 3033,
        "elevation_m": 1535,
        "annual_rainfall_mm": 1800,
        "avg_temp_c": 21.8
    },
    39: {
        "name": "Vihiga",
        "bounds": {"north": 0.15, "south": -0.15, "east": 34.85, "west": 34.55},
        "capital": "Vihiga",
        "climate_zone": "Highland Tropical",
        "population": 590013,
        "area_km2": 563,
        "elevation_m": 1400,
        "annual_rainfall_mm": 1900,
        "avg_temp_c": 21.2
    },
    40: {
        "name": "Bungoma",
        "bounds": {"north": 1.05, "south": 0.35, "east": 35.05, "west": 34.25},
        "capital": "Bungoma",
        "climate_zone": "Highland Tropical",
        "population": 1670570,
        "area_km2": 2069,
        "elevation_m": 1400,
        "annual_rainfall_mm": 1600,
        "avg_temp_c": 20.5
    },
    41: {
        "name": "Busia",
        "bounds": {"north": 0.85, "south": 0.05, "east": 34.45, "west": 33.95},
        "capital": "Busia",
        "climate_zone": "Tropical",
        "population": 893681,
        "area_km2": 1628,
        "elevation_m": 1140,
        "annual_rainfall_mm": 1500,
        "avg_temp_c": 23.1
    },
    
    # Nyanza Province
    42: {
        "name": "Siaya",
        "bounds": {"north": 0.45, "south": -0.15, "east": 34.55, "west": 33.85},
        "capital": "Siaya",
        "climate_zone": "Tropical",
        "population": 993183,
        "area_km2": 2530,
        "elevation_m": 1143,
        "annual_rainfall_mm": 1400,
        "avg_temp_c": 23.8
    },
    43: {
        "name": "Kisumu",
        "bounds": {"north": 0.15, "south": -0.45, "east": 35.15, "west": 34.45},
        "capital": "Kisumu",
        "climate_zone": "Tropical Lakeside",
        "population": 1155574,
        "area_km2": 2009,
        "elevation_m": 1131,
        "annual_rainfall_mm": 1200,
        "avg_temp_c": 24.2
    },
    44: {
        "name": "Homa Bay",
        "bounds": {"north": -0.15, "south": -0.95, "east": 34.85, "west": 34.15},
        "capital": "Homa Bay",
        "climate_zone": "Tropical Lakeside",
        "population": 1131950,
        "area_km2": 3154,
        "elevation_m": 1230,
        "annual_rainfall_mm": 1100,
        "avg_temp_c": 24.5
    },
    45: {
        "name": "Migori",
        "bounds": {"north": -0.65, "south": -1.45, "east": 34.85, "west": 34.15},
        "capital": "Migori",
        "climate_zone": "Tropical",
        "population": 1116436,
        "area_km2": 2586,
        "elevation_m": 1200,
        "annual_rainfall_mm": 1300,
        "avg_temp_c": 23.9
    },
    46: {
        "name": "Kisii",
        "bounds": {"north": -0.45, "south": -1.15, "east": 35.05, "west": 34.65},
        "capital": "Kisii",
        "climate_zone": "Highland Tropical",
        "population": 1266860,
        "area_km2": 1318,
        "elevation_m": 1700,
        "annual_rainfall_mm": 1600,
        "avg_temp_c": 19.8
    },
    47: {
        "name": "Nyamira",
        "bounds": {"north": -0.55, "south": -1.05, "east": 35.05, "west": 34.75},
        "capital": "Nyamira",
        "climate_zone": "Highland Tropical",
        "population": 605576,
        "area_km2": 899,
        "elevation_m": 1800,
        "annual_rainfall_mm": 1700,
        "avg_temp_c": 18.5
    }
}

# Climate zone classifications
CLIMATE_ZONES = {
    "Arid": {
        "description": "Very low rainfall, high temperatures",
        "rainfall_range": "150-500mm",
        "temp_range": "25-35°C",
        "characteristics": ["Low vegetation", "High drought risk", "Pastoralism"]
    },
    "Semi-Arid": {
        "description": "Low to moderate rainfall, warm temperatures",
        "rainfall_range": "500-800mm", 
        "temp_range": "20-28°C",
        "characteristics": ["Mixed farming", "Moderate drought risk", "Seasonal crops"]
    },
    "Highland Agricultural": {
        "description": "High rainfall, cool temperatures, fertile soils",
        "rainfall_range": "1000-1500mm",
        "temp_range": "15-22°C", 
        "characteristics": ["Intensive agriculture", "Low drought risk", "High NDVI"]
    },
    "Highland Tropical": {
        "description": "Very high rainfall, moderate temperatures",
        "rainfall_range": "1500-2000mm",
        "temp_range": "18-25°C",
        "characteristics": ["Dense vegetation", "Minimal drought risk", "Year-round crops"]
    },
    "Coastal": {
        "description": "Moderate to high rainfall, warm humid temperatures",
        "rainfall_range": "800-1200mm",
        "temp_range": "24-28°C",
        "characteristics": ["Coastal vegetation", "Seasonal rains", "Tourism agriculture"]
    },
    "Tropical": {
        "description": "High rainfall, warm temperatures",
        "rainfall_range": "1200-1600mm",
        "temp_range": "22-26°C",
        "characteristics": ["Rich biodiversity", "Consistent rainfall", "Multiple cropping"]
    }
}

def get_county_by_name(name: str):
    """Get county data by name"""
    for county_id, county_data in KENYA_COUNTIES.items():
        if county_data["name"].lower() == name.lower():
            return county_id, county_data
    return None, None

def get_counties_by_climate_zone(zone: str):
    """Get all counties in a specific climate zone"""
    counties = []
    for county_id, county_data in KENYA_COUNTIES.items():
        if county_data["climate_zone"] == zone:
            counties.append((county_id, county_data))
    return counties

def get_county_neighbors(county_id: int, distance_threshold: float = 2.0):
    """Get neighboring counties based on geographical proximity"""
    if county_id not in KENYA_COUNTIES:
        return []
    
    target_county = KENYA_COUNTIES[county_id]
    target_center_lat = (target_county["bounds"]["north"] + target_county["bounds"]["south"]) / 2
    target_center_lon = (target_county["bounds"]["east"] + target_county["bounds"]["west"]) / 2
    
    neighbors = []
    for other_id, other_county in KENYA_COUNTIES.items():
        if other_id == county_id:
            continue
            
        other_center_lat = (other_county["bounds"]["north"] + other_county["bounds"]["south"]) / 2
        other_center_lon = (other_county["bounds"]["east"] + other_county["bounds"]["west"]) / 2
        
        # Simple distance calculation
        distance = ((target_center_lat - other_center_lat) ** 2 + 
                   (target_center_lon - other_center_lon) ** 2) ** 0.5
        
        if distance <= distance_threshold:
            neighbors.append((other_id, other_county, distance))
    
    return sorted(neighbors, key=lambda x: x[2])  # Sort by distance
