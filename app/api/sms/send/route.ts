import { NextRequest, NextResponse } from 'next/server';
import { africasTalkingService } from '../../../../services/smsService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, phoneNumber, message, from } = body;

    console.log('SMS API received:', { to, phoneNumber, message, from });

    // Support both formats: to (array) or phoneNumber (string)
    let recipients: string[] = [];
    if (to && Array.isArray(to)) {
      recipients = to;
    } else if (phoneNumber && typeof phoneNumber === 'string') {
      recipients = [phoneNumber];
    }

    // Validate input
    if (recipients.length === 0) {
      console.log('Validation failed: no recipients specified');
      return NextResponse.json(
        { success: false, error: 'Recipients must be specified as "to" array or "phoneNumber" string' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string') {
      console.log('Validation failed: message invalid', { message });
      return NextResponse.json(
        { success: false, error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate phone numbers (basic validation)
    const phoneRegex = /^\+254[0-9]{9}$/;
    const invalidNumbers = recipients.filter(phone => !phoneRegex.test(phone));
    
    if (invalidNumbers.length > 0) {
      console.log('Validation failed: invalid phone numbers', { invalidNumbers });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid phone numbers detected',
          invalidNumbers 
        },
        { status: 400 }
      );
    }

    // Send SMS
    const result = await africasTalkingService.sendSMS({
      to: recipients,
      message,
      from
    });

    if (result.success) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'SMS sent successfully',
          data: result.data
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('SMS API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for SMS status or testing
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(
      { 
        success: true,
        service: 'SMS API',
        status: 'Available',
        provider: 'Africa\'s Talking',
        endpoints: {
          send: 'POST /api/sms/send',
          ussd: 'POST /api/sms/ussd'
        }
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Service unavailable' 
      },
      { status: 500 }
    );
  }
}
