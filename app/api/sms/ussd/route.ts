import { NextRequest, NextResponse } from 'next/server';
import { africasTalkingService } from '@/services/smsService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    
    // Africa's Talking USSD parameters
    const sessionId = body.get('sessionId') as string;
    const serviceCode = body.get('serviceCode') as string;
    const phoneNumber = body.get('phoneNumber') as string;
    const text = body.get('text') as string;

    console.log('USSD Request:', {
      sessionId,
      serviceCode, 
      phoneNumber,
      text
    });

    // Validate required parameters
    if (!sessionId || !phoneNumber) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Handle USSD session
    const response = await africasTalkingService.handleUSSD({
      sessionId,
      phoneNumber,
      text: text || ''
    });

    // Return response in Africa's Talking expected format
    return new Response(response, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });

  } catch (error) {
    console.error('USSD API error:', error);
    return new Response('END Service temporarily unavailable. Please try again later.', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}

// Handle GET requests for testing
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      success: true,
      service: 'USSD API',
      status: 'Available',
      serviceCode: '*555*123#',
      description: 'UzimaSmart Climate Reports USSD Service',
      features: [
        'Report climate events',
        'Get weather updates', 
        'View recent reports',
        'Subscribe to alerts',
        'Get help and support'
      ]
    },
    { status: 200 }
  );
}
