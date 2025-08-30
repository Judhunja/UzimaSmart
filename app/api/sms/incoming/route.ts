import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/services/notificationService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    
    // Africa's Talking incoming SMS parameters
    const from = body.get('from') as string;
    const text = body.get('text') as string;
    const to = body.get('to') as string;
    const id = body.get('id') as string;
    const date = body.get('date') as string;

    console.log('Incoming SMS:', {
      from,
      text,
      to,
      id,
      date
    });

    // Validate required parameters
    if (!from || !text) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Handle the incoming SMS
    const response = await notificationService.handleIncomingSMS(from, text);

    // Send auto-reply if needed
    if (response) {
      // Log the auto-reply (in production, you might want to send it back)
      console.log('Auto-reply to', from, ':', response);
      
      // Optional: Send the reply back automatically
      // await africasTalkingService.sendSMS({
      //   to: [from],
      //   message: response
      // });
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'SMS processed successfully',
        autoReply: response
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Incoming SMS API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for testing
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      success: true,
      service: 'Incoming SMS API',
      status: 'Available',
      description: 'Handles incoming SMS messages from Africa\'s Talking',
      supportedCommands: [
        'HELP - Get help information',
        'STOP - Unsubscribe from alerts',
        'START - Subscribe to alerts',
        'WEATHER - Get weather updates'
      ]
    },
    { status: 200 }
  );
}
