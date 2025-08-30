import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/services/notificationService';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      phoneNumber, 
      county,
      weatherAlerts = true, 
      emergencyAlerts = true, 
      reportConfirmations = true,
      userId // New field for authenticated users
    } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate Kenyan phone number format
    const phoneRegex = /^\+254[0-9]{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Kenyan phone number format. Use +254xxxxxxxxx' },
        { status: 400 }
      );
    }

    // If userId is provided, verify the user exists and phone number matches
    if (userId) {
      const { data: user } = await supabase
        .from('users')
        .select('id, phone_number')
        .eq('id', userId)
        .single();

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      // Verify the phone number matches the user's phone number
      if (user.phone_number !== phoneNumber) {
        return NextResponse.json(
          { success: false, error: 'Phone number does not match user account' },
          { status: 400 }
        );
      }
    }

    console.log('Subscription request for:', phoneNumber, { weatherAlerts, emergencyAlerts, reportConfirmations, userId });

    const result = await notificationService.subscribeToNotifications({
      phoneNumber,
      weatherAlerts,
      emergencyAlerts,
      reportConfirmations,
      userId // Pass userId to the service
    });

    if (result) {
      console.log('Subscription successful for:', phoneNumber);
      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed to SMS notifications',
        phoneNumber,
        userId
      });
    } else {
      console.error('Subscription failed for:', phoneNumber);
      return NextResponse.json(
        { success: false, error: 'Failed to subscribe to notifications' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Subscription API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
