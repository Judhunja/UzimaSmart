import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/services/notificationService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, location, severity, description } = body;

    if (!title || !location || !severity || !description) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Title, location, severity, and description are required' 
        },
        { status: 400 }
      );
    }

    await notificationService.sendEmergencyAlert({
      title,
      location,
      severity,
      description
    });

    return NextResponse.json({
      success: true,
      message: 'Emergency alert sent successfully',
      alert: { title, location, severity }
    });
  } catch (error) {
    console.error('Emergency alert error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send emergency alert' },
      { status: 500 }
    );
  }
}
