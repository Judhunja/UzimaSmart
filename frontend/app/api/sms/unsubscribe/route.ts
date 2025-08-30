import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/services/notificationService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    const result = await notificationService.unsubscribeFromNotifications(phoneNumber);

    if (result) {
      return NextResponse.json({
        success: true,
        message: 'Successfully unsubscribed from SMS notifications',
        phoneNumber
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to unsubscribe from notifications' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
