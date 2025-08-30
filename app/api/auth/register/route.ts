import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phoneNumber, password } = body;

    if (!name || !email || !phoneNumber || !password) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate phone number format (Kenyan)
    const phoneRegex = /^\+254[0-9]{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Kenyan phone number format. Use +254xxxxxxxxx' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${email},phone_number.eq.${phoneNumber}`)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists with this email or phone number' },
        { status: 400 }
      );
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        name,
        email,
        phone_number: phoneNumber,
        password_hash: hashedPassword,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id, name, email, phone_number, created_at')
      .single();

    if (error) {
      console.error('Registration error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    // Return user data (without password)
    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phone_number,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
