-- Initialize database for Kenya Climate PWA
-- This script sets up the initial schema and sample data

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create Kenya counties table with sample data
INSERT INTO counties (id, name, code, capital, population, area_km2) VALUES
(1, 'Nairobi', 'NBI', 'Nairobi', 4397073, 696),
(2, 'Mombasa', 'MSA', 'Mombasa', 1208333, 230),
(3, 'Kisumu', 'KSM', 'Kisumu', 1155574, 2009),
(4, 'Nakuru', 'NKU', 'Nakuru', 2162202, 7496),
(5, 'Machakos', 'MCK', 'Machakos', 1421932, 5953)
ON CONFLICT (id) DO NOTHING;

-- Create sample climate data
INSERT INTO climate_data (county_id, date, ndvi_mean, temperature_mean, rainfall, data_source) VALUES
(1, '2024-01-01', 0.45, 24.5, 15.2, 'GEE'),
(1, '2024-01-02', 0.46, 25.1, 8.7, 'GEE'),
(2, '2024-01-01', 0.52, 28.3, 22.1, 'GEE'),
(2, '2024-01-02', 0.51, 28.9, 18.5, 'GEE'),
(3, '2024-01-01', 0.58, 26.7, 35.4, 'GEE'),
(3, '2024-01-02', 0.57, 27.2, 28.9, 'GEE')
ON CONFLICT (id) DO NOTHING;

-- Create sample community reports
INSERT INTO community_reports (
    county_id, latitude, longitude, location_name, event_type, severity,
    description, reporter_phone, verification_status, event_date
) VALUES
(1, -1.2921, 36.8219, 'Nairobi CBD', 'flood', 'medium', 'Flash flooding in downtown area after heavy rainfall', '+254700000001', 'verified', '2024-01-15'),
(2, -4.0435, 39.6682, 'Mombasa Port', 'storm', 'high', 'Strong winds and heavy rain affecting port operations', '+254700000002', 'verified', '2024-01-16'),
(3, -0.0917, 34.7680, 'Kisumu Market', 'drought', 'high', 'Extended dry period affecting local agriculture', '+254700000003', 'pending', '2024-01-17')
ON CONFLICT (id) DO NOTHING;

-- Create sample user subscriptions
INSERT INTO user_subscriptions (phone_number, county_id, alert_types, is_active) VALUES
('+254700000001', 1, '["flood", "drought", "weather"]', true),
('+254700000002', 2, '["storm", "flood"]', true),
('+254700000003', 3, '["drought", "weather"]', true)
ON CONFLICT (id) DO NOTHING;

-- Create sample weather alerts
INSERT INTO weather_alerts (
    county_id, alert_type, severity, title, description,
    valid_from, valid_until, confidence, is_active
) VALUES
(1, 'flood', 'medium', 'Flash Flood Warning', 'Heavy rainfall expected in Nairobi area. Avoid low-lying areas.', 
 NOW(), NOW() + INTERVAL '6 hours', 0.85, true),
(2, 'storm', 'high', 'Coastal Storm Alert', 'Strong winds and heavy rain expected along the coast.',
 NOW(), NOW() + INTERVAL '12 hours', 0.92, true)
ON CONFLICT (id) DO NOTHING;
