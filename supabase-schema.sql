-- Supabase SQL Migration: Initialize Kenya Climate PWA Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Counties table (47 Kenyan counties)
CREATE TABLE IF NOT EXISTS counties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    capital VARCHAR(100),
    population INTEGER,
    area_km2 DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Climate data from Google Earth Engine and other sources
CREATE TABLE IF NOT EXISTS climate_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    county_id INTEGER NOT NULL REFERENCES counties(id),
    date DATE NOT NULL,
    ndvi_mean DECIMAL(5,3),
    ndvi_std DECIMAL(5,3),
    temperature_mean DECIMAL(5,2),
    temperature_max DECIMAL(5,2),
    temperature_min DECIMAL(5,2),
    rainfall DECIMAL(8,2),
    humidity DECIMAL(5,2),
    wind_speed DECIMAL(5,2),
    solar_radiation DECIMAL(8,2),
    data_source VARCHAR(50) DEFAULT 'GEE',
    confidence_level DECIMAL(3,2) DEFAULT 0.95,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(county_id, date, data_source)
);

-- Index for efficient climate data queries
CREATE INDEX IF NOT EXISTS idx_climate_data_county_date ON climate_data(county_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_climate_data_date ON climate_data(date DESC);

-- Community reports for crowdsourced climate events
CREATE TABLE IF NOT EXISTS community_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    county_id INTEGER NOT NULL REFERENCES counties(id),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    location_point GEOMETRY(POINT, 4326),
    location_name VARCHAR(255),
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('flood', 'drought', 'storm', 'hail', 'extreme_heat', 'cold_wave', 'landslide', 'other')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT,
    reporter_phone VARCHAR(20),
    reporter_name VARCHAR(100),
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    verified_by VARCHAR(100),
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to update location_point from lat/lng
CREATE OR REPLACE FUNCTION update_location_point()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location_point = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_location_point
    BEFORE INSERT OR UPDATE ON community_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_location_point();

-- SMS and USSD interaction logs
CREATE TABLE IF NOT EXISTS sms_ussd_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) NOT NULL,
    message_type VARCHAR(10) NOT NULL CHECK (message_type IN ('SMS', 'USSD')),
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    content TEXT,
    ussd_session_id VARCHAR(100),
    menu_level INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'sent',
    county_id INTEGER REFERENCES counties(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather alerts and notifications
CREATE TABLE IF NOT EXISTS weather_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    county_id INTEGER NOT NULL REFERENCES counties(id),
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    confidence DECIMAL(3,2) DEFAULT 0.80,
    source VARCHAR(100) DEFAULT 'UzimaSmart AI',
    is_active BOOLEAN DEFAULT true,
    sent_sms BOOLEAN DEFAULT false,
    sent_push BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions for alerts
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) NOT NULL,
    county_id INTEGER NOT NULL REFERENCES counties(id),
    alert_types JSON NOT NULL DEFAULT '[]'::json,
    language VARCHAR(10) DEFAULT 'en' CHECK (language IN ('en', 'sw')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(phone_number, county_id)
);

-- Crop suitability analysis
CREATE TABLE IF NOT EXISTS crop_suitability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    county_id INTEGER NOT NULL REFERENCES counties(id),
    crop_name VARCHAR(100) NOT NULL,
    season VARCHAR(20) NOT NULL CHECK (season IN ('long_rains', 'short_rains', 'dry_season')),
    suitability_score DECIMAL(3,2) NOT NULL CHECK (suitability_score >= 0 AND suitability_score <= 1),
    climate_factors JSON,
    recommendations TEXT,
    analysis_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(county_id, crop_name, season, analysis_date)
);

-- User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    phone_number VARCHAR(20),
    full_name VARCHAR(100),
    county_id INTEGER REFERENCES counties(id),
    occupation VARCHAR(100),
    farm_size_hectares DECIMAL(8,2),
    primary_crops JSON,
    language_preference VARCHAR(10) DEFAULT 'en',
    notification_preferences JSON DEFAULT '{"sms": true, "push": true, "email": false}'::json,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User generated reports (separate from community_reports)
CREATE TABLE IF NOT EXISTS user_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    county_id INTEGER NOT NULL REFERENCES counties(id),
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('flooding', 'drought', 'crop_damage', 'extreme_weather', 'pest_outbreak', 'disease_outbreak', 'other')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'moderate', 'high', 'severe')),
    title VARCHAR(255),
    description TEXT NOT NULL,
    location_details VARCHAR(255),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    contact_number VARCHAR(20),
    reporter_name VARCHAR(100),
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'duplicate')),
    verified_by VARCHAR(100),
    verification_notes TEXT,
    confidence_score DECIMAL(3,2) DEFAULT 0.5,
    report_count INTEGER DEFAULT 1,
    similar_reports UUID[] DEFAULT '{}',
    attachments JSON DEFAULT '[]'::json,
    metadata JSON DEFAULT '{}'::json,
    is_public BOOLEAN DEFAULT true,
    is_emergency BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Report interactions (likes, confirms, disputes)
CREATE TABLE IF NOT EXISTS report_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES user_reports(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    interaction_type VARCHAR(20) NOT NULL CHECK (interaction_type IN ('confirm', 'dispute', 'update', 'similar')),
    phone_number VARCHAR(20),
    details TEXT,
    metadata JSON DEFAULT '{}'::json,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(report_id, user_id, interaction_type),
    UNIQUE(report_id, phone_number, interaction_type)
);

-- Report analytics and aggregations
CREATE TABLE IF NOT EXISTS report_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    county_id INTEGER NOT NULL REFERENCES counties(id),
    event_type VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    total_reports INTEGER DEFAULT 0,
    verified_reports INTEGER DEFAULT 0,
    severity_breakdown JSON DEFAULT '{}'::json,
    confidence_avg DECIMAL(3,2) DEFAULT 0,
    response_time_hours DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(county_id, event_type, date)
);

-- RLS (Row Level Security) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_interactions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Policy: Users can view all community reports but only edit their own
CREATE POLICY "Anyone can view community reports" ON community_reports
    FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Users can insert community reports" ON community_reports
    FOR INSERT TO authenticated WITH CHECK (true);

-- Policy: Users can manage their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
    FOR ALL USING (true); -- Allow anonymous access for SMS users

-- Policy: User reports are publicly viewable but only editable by creator
CREATE POLICY "Anyone can view public user reports" ON user_reports
    FOR SELECT TO authenticated, anon USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports" ON user_reports
    FOR INSERT TO authenticated, anon WITH CHECK (true);

CREATE POLICY "Users can update own reports" ON user_reports
    FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Report interactions
CREATE POLICY "Anyone can view report interactions" ON report_interactions
    FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Users can add interactions" ON report_interactions
    FOR INSERT TO authenticated, anon WITH CHECK (true);

-- Insert Kenya's 47 counties
INSERT INTO counties (id, name, code, capital, population, area_km2) VALUES
(1, 'Nairobi', 'NBI', 'Nairobi', 4397073, 696),
(2, 'Mombasa', 'MSA', 'Mombasa', 1208333, 230),
(3, 'Kisumu', 'KSM', 'Kisumu', 1155574, 2009),
(4, 'Nakuru', 'NKU', 'Nakuru', 2162202, 7496),
(5, 'Machakos', 'MCK', 'Machakos', 1421932, 5953),
(6, 'Kiambu', 'KBU', 'Kiambu', 2417735, 2449),
(7, 'Meru', 'MRU', 'Meru', 1545714, 6936),
(8, 'Kakamega', 'KKG', 'Kakamega', 1867579, 3033),
(9, 'Kilifi', 'KLF', 'Kilifi', 1453787, 12245),
(10, 'Turkana', 'TRK', 'Lodwar', 926976, 68680),
(11, 'Bungoma', 'BGM', 'Bungoma', 1670570, 2206),
(12, 'Garissa', 'GRS', 'Garissa', 841353, 45720),
(13, 'Mandera', 'MND', 'Mandera', 1025756, 26744),
(14, 'Wajir', 'WJR', 'Wajir', 781263, 55840),
(15, 'Marsabit', 'MSB', 'Marsabit', 459785, 66923),
(16, 'Isiolo', 'ISL', 'Isiolo', 268002, 25336),
(17, 'Samburu', 'SMB', 'Maralal', 310327, 20182),
(18, 'Trans Nzoia', 'TNZ', 'Kitale', 990341, 2469),
(19, 'Uasin Gishu', 'UGS', 'Eldoret', 1163186, 3327),
(20, 'Elgeyo-Marakwet', 'EMK', 'Iten', 454480, 3049),
(21, 'Nandi', 'NND', 'Kapsabet', 885711, 2884),
(22, 'Baringo', 'BRG', 'Kabarnet', 666763, 11015),
(23, 'Laikipia', 'LKP', 'Nanyuki', 518560, 9229),
(24, 'West Pokot', 'WPK', 'Kapenguria', 621241, 9169),
(25, 'Kajiado', 'KJD', 'Kajiado', 1117840, 21292),
(26, 'Kericho', 'KRC', 'Kericho', 901777, 2111),
(27, 'Bomet', 'BMT', 'Bomet', 875689, 1997),
(28, 'Narok', 'NRK', 'Narok', 1157873, 17944),
(29, 'Nyamira', 'NYM', 'Nyamira', 605576, 899),
(30, 'Kisii', 'KSI', 'Kisii', 1266860, 1318),
(31, 'Migori', 'MGR', 'Migori', 1116436, 2586),
(32, 'Homa Bay', 'HMB', 'Homa Bay', 1131950, 3154),
(33, 'Siaya', 'SYA', 'Siaya', 993183, 2530),
(34, 'Busia', 'BSA', 'Busia', 893681, 1628),
(35, 'Vihiga', 'VHG', 'Vihiga', 590013, 531),
(36, 'Nyandarua', 'NND', 'Ol Kalou', 638289, 3304),
(37, 'Nyeri', 'NYR', 'Nyeri', 759164, 2361),
(38, 'Kirinyaga', 'KRY', 'Kerugoya', 610411, 1205),
(39, 'Murang''a', 'MRG', 'Murang''a', 1056640, 2325),
(40, 'Kiambu', 'KBU', 'Kiambu', 2417735, 2449),
(41, 'Embu', 'EMB', 'Embu', 608599, 2821),
(42, 'Tharaka-Nithi', 'THN', 'Kathwana', 393177, 2609),
(43, 'Meru', 'MRU', 'Meru', 1545714, 6936),
(44, 'Makueni', 'MKN', 'Wote', 987653, 8008),
(45, 'Kitui', 'KTI', 'Kitui', 1136187, 30496),
(46, 'Taita-Taveta', 'TTV', 'Voi', 340671, 17083),
(47, 'Lamu', 'LAM', 'Lamu', 143920, 6273)
ON CONFLICT (id) DO NOTHING;

-- Create indices for better performance
CREATE INDEX IF NOT EXISTS idx_community_reports_county ON community_reports(county_id);
CREATE INDEX IF NOT EXISTS idx_community_reports_event_date ON community_reports(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_community_reports_location ON community_reports USING GIST(location_point);
CREATE INDEX IF NOT EXISTS idx_weather_alerts_county_active ON weather_alerts(county_id, is_active, valid_until);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_phone ON user_subscriptions(phone_number);
CREATE INDEX IF NOT EXISTS idx_sms_ussd_logs_phone ON sms_ussd_logs(phone_number, created_at DESC);

-- User reports indices
CREATE INDEX IF NOT EXISTS idx_user_reports_county_date ON user_reports(county_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_reports_event_type ON user_reports(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_reports_status ON user_reports(verification_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_reports_user ON user_reports(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_reports_public ON user_reports(is_public, created_at DESC) WHERE is_public = true;

-- Report interactions indices  
CREATE INDEX IF NOT EXISTS idx_report_interactions_report ON report_interactions(report_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_report_interactions_user ON report_interactions(user_id, created_at DESC);

-- Report analytics indices
CREATE INDEX IF NOT EXISTS idx_report_analytics_county_date ON report_analytics(county_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_report_analytics_event_date ON report_analytics(event_type, date DESC);

-- Insert sample climate data
INSERT INTO climate_data (county_id, date, ndvi_mean, temperature_mean, rainfall, data_source) VALUES
(1, CURRENT_DATE - INTERVAL '1 day', 0.45, 24.5, 15.2, 'GEE'),
(1, CURRENT_DATE - INTERVAL '2 days', 0.46, 25.1, 8.7, 'GEE'),
(2, CURRENT_DATE - INTERVAL '1 day', 0.52, 28.3, 22.1, 'GEE'),
(2, CURRENT_DATE - INTERVAL '2 days', 0.51, 28.9, 18.5, 'GEE'),
(3, CURRENT_DATE - INTERVAL '1 day', 0.58, 26.7, 35.4, 'GEE'),
(3, CURRENT_DATE - INTERVAL '2 days', 0.57, 27.2, 28.9, 'GEE')
ON CONFLICT (county_id, date, data_source) DO NOTHING;

-- Insert sample community reports
INSERT INTO community_reports (
    county_id, latitude, longitude, location_name, event_type, severity,
    description, reporter_phone, verification_status, event_date
) VALUES
(1, -1.2921, 36.8219, 'Nairobi CBD', 'flood', 'medium', 'Flash flooding in downtown area after heavy rainfall', '+254700000001', 'verified', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
(2, -4.0435, 39.6682, 'Mombasa Port', 'storm', 'high', 'Strong winds and heavy rain affecting port operations', '+254700000002', 'verified', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(3, -0.0917, 34.7680, 'Kisumu Market', 'drought', 'high', 'Extended dry period affecting local agriculture', '+254700000003', 'pending', CURRENT_TIMESTAMP - INTERVAL '6 hours')
ON CONFLICT (id) DO NOTHING;

-- SMS subscriptions table for notification preferences
CREATE TABLE IF NOT EXISTS sms_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    county VARCHAR(100),
    weather_alerts BOOLEAN DEFAULT true,
    emergency_alerts BOOLEAN DEFAULT true,
    report_confirmations BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for efficient SMS subscription queries
CREATE INDEX IF NOT EXISTS idx_sms_subscriptions_phone ON sms_subscriptions(phone_number);
CREATE INDEX IF NOT EXISTS idx_sms_subscriptions_active ON sms_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_sms_subscriptions_county ON sms_subscriptions(county);

-- Insert sample user subscriptions
INSERT INTO user_subscriptions (phone_number, county_id, alert_types, is_active) VALUES
('+254700000001', 1, '["flood", "drought", "weather"]'::json, true),
('+254700000002', 2, '["storm", "flood"]'::json, true),
('+254700000003', 3, '["drought", "weather"]'::json, true)
ON CONFLICT (phone_number, county_id) DO NOTHING;

-- Insert sample SMS subscriptions
INSERT INTO sms_subscriptions (phone_number, county, weather_alerts, emergency_alerts, report_confirmations, is_active) VALUES
('+254700000001', 'Nairobi', true, true, true, true),
('+254700000002', 'Mombasa', true, true, false, true),
('+254700000003', 'Kisumu', false, true, true, true)
ON CONFLICT (phone_number) DO NOTHING;

-- Insert sample weather alerts
INSERT INTO weather_alerts (
    county_id, alert_type, severity, title, description,
    valid_from, valid_until, confidence, is_active
) VALUES
(1, 'flood', 'medium', 'Flash Flood Warning', 'Heavy rainfall expected in Nairobi area. Avoid low-lying areas.', 
 NOW(), NOW() + INTERVAL '6 hours', 0.85, true),
(2, 'storm', 'high', 'Coastal Storm Alert', 'Strong winds and heavy rain expected along the coast.',
 NOW(), NOW() + INTERVAL '12 hours', 0.92, true)
ON CONFLICT (id) DO NOTHING;
