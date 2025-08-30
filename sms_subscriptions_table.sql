-- SMS Subscriptions Table SQL
-- Run this in your Supabase SQL Editor

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

-- Create indexes for efficient SMS subscription queries
CREATE INDEX IF NOT EXISTS idx_sms_subscriptions_phone ON sms_subscriptions(phone_number);
CREATE INDEX IF NOT EXISTS idx_sms_subscriptions_active ON sms_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_sms_subscriptions_county ON sms_subscriptions(county);

-- Enable Row Level Security (RLS)
ALTER TABLE sms_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for SMS subscriptions
CREATE POLICY "Allow read access to SMS subscriptions" ON sms_subscriptions FOR SELECT USING (true);
CREATE POLICY "Allow insert SMS subscriptions" ON sms_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update SMS subscriptions" ON sms_subscriptions FOR UPDATE USING (true);

-- Insert sample SMS subscriptions for testing
INSERT INTO sms_subscriptions (phone_number, county, weather_alerts, emergency_alerts, report_confirmations, is_active) VALUES
('+254700000001', 'Nairobi', true, true, true, true),
('+254700000002', 'Mombasa', true, true, false, true),
('+254700000003', 'Kisumu', false, true, true, true),
('+254700000004', 'Nakuru', true, false, true, true),
('+254700000005', 'Eldoret', true, true, true, true)
ON CONFLICT (phone_number) DO NOTHING;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_sms_subscriptions_updated_at 
    BEFORE UPDATE ON sms_subscriptions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON sms_subscriptions TO authenticated;
GRANT ALL ON sms_subscriptions TO anon;
