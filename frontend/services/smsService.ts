import { NextRequest, NextResponse } from 'next/server';

interface SMSData {
  to: string[];
  message: string;
  from?: string;
}

class AfricasTalkingService {
  private username: string;
  private apiKey: string;
  private baseUrl: string;
  private senderId: string;

  constructor() {
    this.username = process.env.AFRICASTALKING_USERNAME || 'AfyaApp';
    this.apiKey = process.env.AFRICASTALKING_API_KEY || '';
    this.baseUrl = 'https://api.africastalking.com/version1';
    this.senderId = process.env.AFRICASTALKING_SENDER_ID || 'AFTKNG';
  }

  async sendSMS(data: SMSData): Promise<any> {
    if (!this.apiKey) {
      console.warn('Africa\'s Talking API key not configured');
      return { success: false, error: 'SMS service not configured' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/messaging`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'apiKey': this.apiKey
        },
        body: new URLSearchParams({
          username: this.username,
          to: data.to.join(','),
          message: data.message,
          from: data.from || this.senderId
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('SMS sent successfully:', result);
        return { success: true, data: result };
      } else {
        console.error('SMS sending failed:', result);
        return { success: false, error: result.message || 'Failed to send SMS' };
      }
    } catch (error) {
      console.error('SMS service error:', error);
      return { success: false, error: 'Network error while sending SMS' };
    }
  }

  // Format phone number to Kenya format (+254)
  formatPhoneNumber(phone: string): string {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Handle different formats
    if (cleaned.startsWith('254')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('0')) {
      return `+254${cleaned.substring(1)}`;
    } else if (cleaned.length === 9) {
      return `+254${cleaned}`;
    }
    
    return phone; // Return as-is if can't format
  }

  // Validate Kenya phone number
  isValidKenyanPhone(phone: string): boolean {
    const phoneRegex = /^\+254[7-9][0-9]{8}$/;
    return phoneRegex.test(phone);
  }
}

export const africasTalkingService = new AfricasTalkingService();
