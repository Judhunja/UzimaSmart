"""
Supabase client configuration for real-time features and authentication
"""
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Create Supabase clients
def get_supabase_client() -> Client:
    """Get Supabase client with anon key for general operations"""
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        raise ValueError("Supabase URL and Anon Key must be provided")
    return create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def get_supabase_admin_client() -> Client:
    """Get Supabase client with service role for admin operations"""
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        raise ValueError("Supabase URL and Service Key must be provided")
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Initialize clients
supabase_client = get_supabase_client() if SUPABASE_URL and SUPABASE_ANON_KEY else None
supabase_admin = get_supabase_admin_client() if SUPABASE_URL and SUPABASE_SERVICE_KEY else None

class SupabaseService:
    """Service class for Supabase operations"""
    
    def __init__(self):
        self.client = supabase_client
        self.admin = supabase_admin
    
    async def authenticate_user(self, phone: str, otp: str):
        """Authenticate user with phone number and OTP"""
        try:
            response = self.client.auth.verify_otp({
                'phone': phone,
                'token': otp,
                'type': 'sms'
            })
            return response
        except Exception as e:
            print(f"Authentication error: {e}")
            return None
    
    async def send_otp(self, phone: str):
        """Send OTP to phone number"""
        try:
            response = self.client.auth.sign_in_with_otp({
                'phone': phone
            })
            return response
        except Exception as e:
            print(f"OTP send error: {e}")
            return None
    
    async def get_user_profile(self, user_id: str):
        """Get user profile from Supabase"""
        try:
            response = self.client.table('user_profiles').select('*').eq('id', user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Profile fetch error: {e}")
            return None
    
    async def create_user_profile(self, user_data: dict):
        """Create user profile in Supabase"""
        try:
            response = self.client.table('user_profiles').insert(user_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Profile creation error: {e}")
            return None
    
    async def subscribe_to_realtime(self, table: str, callback):
        """Subscribe to real-time updates for a table"""
        try:
            self.client.postgrest.rpc('realtime', {
                'table': table,
                'callback': callback
            })
        except Exception as e:
            print(f"Realtime subscription error: {e}")
    
    async def insert_climate_data(self, data: dict):
        """Insert climate data with real-time notification"""
        try:
            response = self.admin.table('climate_data').insert(data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Climate data insert error: {e}")
            return None
    
    async def insert_community_report(self, data: dict):
        """Insert community report with real-time notification"""
        try:
            response = self.admin.table('community_reports').insert(data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Community report insert error: {e}")
            return None
    
    async def get_weather_alerts_for_county(self, county_id: int):
        """Get active weather alerts for a county"""
        try:
            response = self.client.table('weather_alerts')\
                .select('*')\
                .eq('county_id', county_id)\
                .eq('is_active', True)\
                .execute()
            return response.data
        except Exception as e:
            print(f"Weather alerts fetch error: {e}")
            return []
    
    async def create_weather_alert(self, alert_data: dict):
        """Create weather alert with real-time notification"""
        try:
            response = self.admin.table('weather_alerts').insert(alert_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Weather alert creation error: {e}")
            return None

# Initialize service instance
supabase_service = SupabaseService() if supabase_client else None
