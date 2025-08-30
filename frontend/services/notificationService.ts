import { africasTalkingService } from './smsService';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface NotificationPreferences {
  phoneNumber: string;
  weatherAlerts: boolean;
  emergencyAlerts: boolean;
  reportConfirmations: boolean;
  userId?: number; // Optional user ID for authenticated users
}

class NotificationService {
  // Send SMS confirmation when a report is submitted
  async sendReportConfirmation(phoneNumber: string, reportData: any): Promise<boolean> {
    try {
      const formattedPhone = africasTalkingService.formatPhoneNumber(phoneNumber);
      
      if (!africasTalkingService.isValidKenyanPhone(formattedPhone)) {
        console.warn('Invalid phone number format:', phoneNumber);
        return false;
      }

      const message = `Report Confirmed! 
Event: ${reportData.eventType}
Location: ${reportData.county}
Severity: ${reportData.severity}
Report ID: ${reportData.id}

Thank you for using UzimaSmart. We'll keep you updated.`;

      const result = await africasTalkingService.sendSMS({
        to: [formattedPhone],
        message
      });

      return result.success;
    } catch (error) {
      console.error('Error sending report confirmation:', error);
      return false;
    }
  }

  // Send emergency alert to subscribers
  async sendEmergencyAlert(alertData: any): Promise<void> {
    try {
      // Get all subscribers who want emergency alerts
      const { data: subscribers } = await supabase
        .from('sms_subscriptions')
        .select('phone_number')
        .eq('emergency_alerts', true)
        .eq('is_active', true);

      if (!subscribers || subscribers.length === 0) {
        console.log('No emergency alert subscribers found');
        return;
      }

      const phoneNumbers = subscribers.map(sub => 
        africasTalkingService.formatPhoneNumber(sub.phone_number)
      ).filter(phone => 
        africasTalkingService.isValidKenyanPhone(phone)
      );

      if (phoneNumbers.length === 0) {
        console.log('No valid phone numbers for emergency alerts');
        return;
      }

      const message = `🚨 EMERGENCY CLIMATE ALERT 🚨
${alertData.title}

Location: ${alertData.location}
Severity: ${alertData.severity}

${alertData.description}

Take necessary precautions. Stay safe!

UzimaSmart Climate System`;

      // Send in batches of 100 (Africa's Talking limit)
      const batchSize = 100;
      for (let i = 0; i < phoneNumbers.length; i += batchSize) {
        const batch = phoneNumbers.slice(i, i + batchSize);
        
        await africasTalkingService.sendSMS({
          to: batch,
          message
        });

        // Add small delay between batches
        if (i + batchSize < phoneNumbers.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      console.log(`Emergency alert sent to ${phoneNumbers.length} subscribers`);
    } catch (error) {
      console.error('Error sending emergency alerts:', error);
    }
  }

  // Subscribe a phone number to notifications
  async subscribeToNotifications(preferences: NotificationPreferences): Promise<boolean> {
    try {
      const formattedPhone = africasTalkingService.formatPhoneNumber(preferences.phoneNumber);
      
      if (!africasTalkingService.isValidKenyanPhone(formattedPhone)) {
        throw new Error('Invalid phone number format');
      }

      // Check if already subscribed and active
      const existingSubscription = await this.getSubscriptionStatus(formattedPhone);
      
      const subscriptionData = {
        phone_number: formattedPhone,
        user_id: preferences.userId || null, // Add user_id support
        weather_alerts: preferences.weatherAlerts,
        emergency_alerts: preferences.emergencyAlerts,
        report_confirmations: preferences.reportConfirmations,
        is_active: true,
        subscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('sms_subscriptions')
        .upsert(subscriptionData, {
          onConflict: 'phone_number'
        });

      if (error) {
        console.error('Subscription error:', error);
        
        // If table doesn't exist, log specific message
        if (error.code === '42P01') {
          console.error('SMS subscriptions table does not exist. Please apply the database schema first.');
          throw new Error('Database table not found. Please contact administrator.');
        }
        return false;
      }

      // Send welcome SMS only if it's a new subscription or reactivation
      const isNewSubscription = !existingSubscription || !existingSubscription.is_active;
      
      if (isNewSubscription) {
        const welcomeMessage = `Welcome to UzimaSmart SMS Alerts! 🌍

Your subscriptions:
${preferences.weatherAlerts ? '✅' : '❌'} Weather Updates
${preferences.emergencyAlerts ? '✅' : '❌'} Emergency Alerts  
${preferences.reportConfirmations ? '✅' : '❌'} Report Confirmations

Reply STOP to unsubscribe anytime.

UzimaSmart Climate System`;

        try {
          const smsResult = await africasTalkingService.sendSMS({
            to: [formattedPhone],
            message: welcomeMessage
          });

          if (!smsResult.success) {
            console.error('Failed to send welcome SMS:', smsResult.error);
            // Don't fail the subscription just because SMS failed
          }
        } catch (smsError) {
          console.error('Error sending welcome SMS:', smsError);
          // Don't fail the subscription just because SMS failed
        }
      } else {
        // For existing active subscriptions, send update confirmation
        const updateMessage = `Your UzimaSmart SMS preferences have been updated! 📱

Current subscriptions:
${preferences.weatherAlerts ? '✅' : '❌'} Weather Updates
${preferences.emergencyAlerts ? '✅' : '❌'} Emergency Alerts  
${preferences.reportConfirmations ? '✅' : '❌'} Report Confirmations

UzimaSmart Climate System`;

        try {
          await africasTalkingService.sendSMS({
            to: [formattedPhone],
            message: updateMessage
          });
        } catch (smsError) {
          console.error('Error sending update SMS:', smsError);
          // Don't fail the subscription just because SMS failed
        }
      }

      return true;
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      return false;
    }
  }

  // Send bulk SMS to all active subscribers
  async sendBulkNotification(message: string, alertType: 'weather' | 'emergency' | 'general' = 'general'): Promise<void> {
    try {
      let query = supabase
        .from('sms_subscriptions')
        .select('phone_number')
        .eq('is_active', true);

      // Filter by alert type preference
      if (alertType === 'weather') {
        query = query.eq('weather_alerts', true);
      } else if (alertType === 'emergency') {
        query = query.eq('emergency_alerts', true);
      }

      const { data: subscribers } = await query;

      if (!subscribers || subscribers.length === 0) {
        console.log(`No subscribers found for ${alertType} notifications`);
        return;
      }

      const phoneNumbers = subscribers.map(sub => 
        africasTalkingService.formatPhoneNumber(sub.phone_number)
      ).filter(phone => 
        africasTalkingService.isValidKenyanPhone(phone)
      );

      // Send in batches
      const batchSize = 100;
      for (let i = 0; i < phoneNumbers.length; i += batchSize) {
        const batch = phoneNumbers.slice(i, i + batchSize);
        
        await africasTalkingService.sendSMS({
          to: batch,
          message: `${message}\n\nUzimaSmart Climate System`
        });

        if (i + batchSize < phoneNumbers.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      console.log(`Bulk notification sent to ${phoneNumbers.length} subscribers`);
    } catch (error) {
      console.error('Error sending bulk notification:', error);
    }
  }

  // Unsubscribe a phone number from notifications
  async unsubscribeFromNotifications(phoneNumber: string): Promise<boolean> {
    try {
      const formattedPhone = africasTalkingService.formatPhoneNumber(phoneNumber);
      
      if (!africasTalkingService.isValidKenyanPhone(formattedPhone)) {
        throw new Error('Invalid phone number format');
      }

      const { error } = await supabase
        .from('sms_subscriptions')
        .update({
          is_active: false,
          unsubscribed_at: new Date().toISOString()
        })
        .eq('phone_number', formattedPhone);

      if (error) {
        console.error('Unsubscribe error:', error);
        return false;
      }

      // Send unsubscribe confirmation SMS
      const confirmationMessage = `You have been successfully unsubscribed from UzimaSmart SMS alerts.

To resubscribe, visit our app or website.

Thank you for using UzimaSmart!`;

      await africasTalkingService.sendSMS({
        to: [formattedPhone],
        message: confirmationMessage
      });

      return true;
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
      return false;
    }
  }

  // Get subscription status for a phone number
  async getSubscriptionStatus(phoneNumber: string): Promise<any> {
    try {
      const formattedPhone = africasTalkingService.formatPhoneNumber(phoneNumber);
      
      if (!africasTalkingService.isValidKenyanPhone(formattedPhone)) {
        throw new Error('Invalid phone number format');
      }

      const { data, error } = await supabase
        .from('sms_subscriptions')
        .select('*')
        .eq('phone_number', formattedPhone)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error getting subscription status:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting subscription status:', error);
      return null;
    }
  }
}

export const notificationService = new NotificationService();
