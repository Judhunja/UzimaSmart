import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/services/notificationService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, alertType = 'general' } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    await notificationService.sendBulkNotification(message, alertType);

    return NextResponse.json({
      success: true,
      message: 'Bulk notification sent successfully',
      alertType
    });
  } catch (error) {
    console.error('Bulk notification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send bulk notification' },
      { status: 500 }
    );
  }
}
