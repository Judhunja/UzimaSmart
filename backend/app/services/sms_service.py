"""
SMS and USSD Service using Africa's Talking API
"""
import os
import africastalking
from typing import Dict, List, Optional
from datetime import datetime
from ..utils.database import get_db
from ..models.models import SMS_USSD_Log, UserSubscription

class SMSService:
    """SMS service using Africa's Talking"""
    
    def __init__(self):
        username = os.getenv('AFRICASTALKING_USERNAME', 'sandbox')
        api_key = os.getenv('AFRICASTALKING_API_KEY')
        self.sender_id = os.getenv('AFRICASTALKING_SENDER_ID', 'AFTKNG')
        
        if not api_key:
            raise ValueError("Africa's Talking API key not found")
        
        africastalking.initialize(username, api_key)
        self.sms = africastalking.SMS
        
    async def send_sms(self, phone_numbers: List[str], message: str, county_id: Optional[int] = None) -> Dict:
        """Send SMS to multiple recipients"""
        try:
            # Format phone numbers for Kenya (+254)
            formatted_numbers = []
            for number in phone_numbers:
                if not number.startswith('+254'):
                    if number.startswith('0'):
                        number = '+254' + number[1:]
                    elif number.startswith('254'):
                        number = '+' + number
                    else:
                        number = '+254' + number
                formatted_numbers.append(number)
            
            # Send SMS via Africa's Talking with sender ID
            response = self.sms.send(message, formatted_numbers, sender_id=self.sender_id)
            
            # Log the SMS
            async with get_db() as db:
                for i, recipient in enumerate(formatted_numbers):
                    sms_log = SMS_USSD_Log(
                        phone_number=recipient,
                        service_type='SMS',
                        message_out=message,
                        county_id=county_id,
                        status='sent' if response['SMSMessageData']['Recipients'][i]['status'] == 'Success' else 'failed'
                    )
                    db.add(sms_log)
                await db.commit()
            
            return {
                'success': True,
                'message_id': response['SMSMessageData']['Message'],
                'recipients': response['SMSMessageData']['Recipients']
            }
            
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    async def send_weather_alert(self, county_id: int, alert_type: str, message: str) -> Dict:
        """Send weather alert to subscribed users in a county"""
        try:
            async with get_db() as db:
                # Get subscribed users for this county
                subscriptions = await db.execute(
                    """
                    SELECT phone_number FROM user_subscriptions 
                    WHERE county_id = :county_id 
                    AND is_active = true 
                    AND (:alert_type = ANY(alert_types) OR alert_types @> '["all"]')
                    """,
                    {'county_id': county_id, 'alert_type': alert_type}
                )
                
                phone_numbers = [row[0] for row in subscriptions.fetchall()]
                
                if not phone_numbers:
                    return {'success': True, 'message': 'No subscribers found', 'sent_count': 0}
                
                # Send SMS
                result = await self.send_sms(phone_numbers, message, county_id)
                
                return {
                    'success': result['success'],
                    'sent_count': len(phone_numbers),
                    'details': result
                }
                
        except Exception as e:
            return {'success': False, 'error': str(e)}

class USSDService:
    """USSD service using Africa's Talking"""
    
    def __init__(self):
        username = os.getenv('AFRICASTALKING_USERNAME', 'sandbox')
        api_key = os.getenv('AFRICASTALKING_API_KEY')
        
        if not api_key:
            raise ValueError("Africa's Talking API key not found")
        
        africastalking.initialize(username, api_key)
        
    async def handle_ussd_request(self, session_id: str, phone_number: str, text: str) -> str:
        """Handle USSD session"""
        try:
            # Log the USSD interaction
            async with get_db() as db:
                ussd_log = SMS_USSD_Log(
                    phone_number=phone_number,
                    service_type='USSD',
                    session_id=session_id,
                    ussd_code='*384*XX#',
                    message_in=text
                )
                db.add(ussd_log)
                await db.commit()
            
            # Parse user input
            text_array = text.split('*') if text else ['']
            level = len(text_array)
            
            response = ""
            
            if text == "":
                # Main menu
                response = "CON Welcome to Kenya Climate Info\n"
                response += "1. Weather Forecast\n"
                response += "2. Report Climate Event\n"
                response += "3. Get Alerts\n"
                response += "4. Agricultural Advice"
                
            elif text == "1":
                # Weather submenu
                response = "CON Weather Forecast\n"
                response += "1. Today's Weather\n"
                response += "2. 7-Day Forecast\n"
                response += "3. Seasonal Outlook\n"
                response += "0. Back to main menu"
                
            elif text == "1*1":
                # Today's weather
                weather_data = await self._get_current_weather(phone_number)
                response = f"END Today's Weather:\n{weather_data}"
                
            elif text == "1*2":
                # 7-day forecast
                forecast_data = await self._get_7day_forecast(phone_number)
                response = f"END 7-Day Forecast:\n{forecast_data}"
                
            elif text == "1*3":
                # Seasonal outlook
                seasonal_data = await self._get_seasonal_outlook(phone_number)
                response = f"END Seasonal Outlook:\n{seasonal_data}"
                
            elif text == "2":
                # Report climate event
                response = "CON Report Climate Event\n"
                response += "1. Flooding\n"
                response += "2. Drought\n"
                response += "3. Crop Damage\n"
                response += "0. Back to main menu"
                
            elif text == "2*1":
                response = "CON Report Flooding\n"
                response += "1. Light flooding\n"
                response += "2. Moderate flooding\n"
                response += "3. Severe flooding\n"
                response += "0. Back"
                
            elif text.startswith("2*1*"):
                # Process flooding report
                severity_map = {"1": "light", "2": "moderate", "3": "severe"}
                severity = severity_map.get(text.split('*')[2], "unknown")
                
                await self._save_community_report(
                    phone_number, "flooding", severity, "USSD report"
                )
                
                response = "END Thank you for reporting flooding. "
                response += "Your report has been submitted and will be verified."
                
            elif text == "3":
                # Alerts menu
                response = "CON Alert Services\n"
                response += "1. Subscribe to Alerts\n"
                response += "2. Unsubscribe\n"
                response += "3. Alert Settings\n"
                response += "0. Back to main menu"
                
            elif text == "3*1":
                # Subscribe to alerts
                await self._subscribe_user(phone_number)
                response = "END You have been subscribed to weather alerts. "
                response += "You will receive notifications for your area."
                
            elif text == "3*2":
                # Unsubscribe
                await self._unsubscribe_user(phone_number)
                response = "END You have been unsubscribed from alerts."
                
            elif text == "4":
                # Agricultural advice
                advice = await self._get_agricultural_advice(phone_number)
                response = f"END Agricultural Advice:\n{advice}"
                
            else:
                # Invalid input
                response = "END Invalid selection. Please dial *384*XX# to start again."
            
            # Log response
            async with get_db() as db:
                await db.execute(
                    "UPDATE sms_ussd_logs SET message_out = :response WHERE session_id = :session_id",
                    {'response': response, 'session_id': session_id}
                )
                await db.commit()
            
            return response
            
        except Exception as e:
            return f"END Service temporarily unavailable. Error: {str(e)}"
    
    async def _get_current_weather(self, phone_number: str) -> str:
        """Get current weather for user's location"""
        # This would integrate with weather API
        return "Nairobi: 24°C, Partly cloudy, 60% humidity, Light winds"
    
    async def _get_7day_forecast(self, phone_number: str) -> str:
        """Get 7-day forecast"""
        return "Mon: 26°C Rain\nTue: 24°C Cloudy\nWed: 28°C Sunny\nThu: 25°C Rain\nFri: 27°C Sunny\nSat: 23°C Cloudy\nSun: 26°C Partly cloudy"
    
    async def _get_seasonal_outlook(self, phone_number: str) -> str:
        """Get seasonal weather outlook"""
        return "Oct-Dec 2024: Enhanced rainfall expected. Above normal temperatures. Good conditions for long-season crops."
    
    async def _save_community_report(self, phone_number: str, event_type: str, severity: str, description: str):
        """Save community report from USSD"""
        from ..models.models import CommunityReport
        
        async with get_db() as db:
            report = CommunityReport(
                event_type=event_type,
                severity=severity,
                description=description,
                reporter_phone=phone_number,
                event_date=datetime.utcnow(),
                county_id=1  # Default to Nairobi, should be determined by phone number
            )
            db.add(report)
            await db.commit()
    
    async def _subscribe_user(self, phone_number: str):
        """Subscribe user to alerts"""
        async with get_db() as db:
            # Check if already subscribed
            existing = await db.execute(
                "SELECT id FROM user_subscriptions WHERE phone_number = :phone",
                {'phone': phone_number}
            )
            
            if not existing.fetchone():
                subscription = UserSubscription(
                    phone_number=phone_number,
                    county_id=1,  # Default to Nairobi
                    alert_types=['weather', 'drought', 'flood']
                )
                db.add(subscription)
                await db.commit()
    
    async def _unsubscribe_user(self, phone_number: str):
        """Unsubscribe user from alerts"""
        async with get_db() as db:
            await db.execute(
                "UPDATE user_subscriptions SET is_active = false WHERE phone_number = :phone",
                {'phone': phone_number}
            )
            await db.commit()
    
    async def _get_agricultural_advice(self, phone_number: str) -> str:
        """Get agricultural advice for user's location"""
        return "Current advice for your area:\n- Plant drought-resistant maize varieties\n- Apply mulching to conserve moisture\n- Monitor for Fall Armyworm\n- Harvest rainwater during short rains"

# Global service instances
sms_service = SMSService()
ussd_service = USSDService()
