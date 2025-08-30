#!/usr/bin/env node

// Comprehensive SMS Subscription Test
async function testSubscriptionFunctionality() {
  console.log('🔔 Testing SMS Subscription System\n');

  const baseUrl = 'http://localhost:3000';
  const phoneNumber = '+254793322831';
  
  console.log(`Testing with phone number: ${phoneNumber}\n`);

  // Test 1: Check current subscription status
  console.log('1️⃣ Checking subscription status...');
  try {
    const statusResponse = await fetch(`${baseUrl}/api/sms/status?phoneNumber=${encodeURIComponent(phoneNumber)}`);
    
    if (statusResponse.ok) {
      const statusResult = await statusResponse.json();
      console.log('✅ Status Response:', statusResult);
    } else {
      const errorText = await statusResponse.text();
      console.log('❌ Status Error:', statusResponse.status, errorText);
    }
  } catch (error) {
    console.log('❌ Status Request Error:', error.message);
  }

  // Test 2: Subscribe to notifications
  console.log('\n2️⃣ Subscribing to SMS notifications...');
  try {
    const subscribeResponse = await fetch(`${baseUrl}/api/sms/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: phoneNumber,
        county: 'Nairobi',
        weatherAlerts: true,
        emergencyAlerts: true,
        reportConfirmations: true
      })
    });

    if (subscribeResponse.ok) {
      const result = await subscribeResponse.json();
      console.log('✅ Subscription Response:', result);
      console.log('📱 Check your phone for a welcome SMS!');
    } else {
      const errorText = await subscribeResponse.text();
      console.log('❌ Subscription Error:', subscribeResponse.status, errorText);
    }
  } catch (error) {
    console.log('❌ Subscription Request Error:', error.message);
  }

  // Test 3: Send a test weather alert
  console.log('\n3️⃣ Sending test weather alert...');
  try {
    const weatherResponse = await fetch(`${baseUrl}/api/sms/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: '🌦️ Weather Alert: Heavy rains expected in Nairobi today. Temperature: 18-24°C. Stay safe and carry an umbrella!',
        alertType: 'weather'
      })
    });

    if (weatherResponse.ok) {
      const result = await weatherResponse.json();
      console.log('✅ Weather Alert Response:', result);
      console.log('📱 Check your phone for the weather alert!');
    } else {
      const errorText = await weatherResponse.text();
      console.log('❌ Weather Alert Error:', weatherResponse.status, errorText);
    }
  } catch (error) {
    console.log('❌ Weather Alert Request Error:', error.message);
  }

  // Test 4: Check subscription status again
  console.log('\n4️⃣ Checking subscription status after subscribing...');
  try {
    const statusResponse = await fetch(`${baseUrl}/api/sms/status?phoneNumber=${encodeURIComponent(phoneNumber)}`);
    
    if (statusResponse.ok) {
      const statusResult = await statusResponse.json();
      console.log('✅ Updated Status Response:', statusResult);
    } else {
      const errorText = await statusResponse.text();
      console.log('❌ Status Error:', statusResponse.status, errorText);
    }
  } catch (error) {
    console.log('❌ Status Request Error:', error.message);
  }

  // Test 5: Unsubscribe
  console.log('\n5️⃣ Testing unsubscribe functionality...');
  try {
    const unsubscribeResponse = await fetch(`${baseUrl}/api/sms/unsubscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: phoneNumber
      })
    });

    if (unsubscribeResponse.ok) {
      const result = await unsubscribeResponse.json();
      console.log('✅ Unsubscribe Response:', result);
      console.log('📱 Check your phone for unsubscribe confirmation!');
    } else {
      const errorText = await unsubscribeResponse.text();
      console.log('❌ Unsubscribe Error:', unsubscribeResponse.status, errorText);
    }
  } catch (error) {
    console.log('❌ Unsubscribe Request Error:', error.message);
  }

  console.log('\n🎯 Subscription Test Summary:');
  console.log('📞 Phone Number:', phoneNumber);
  console.log('📨 Expected SMS Messages:');
  console.log('   1. Welcome/subscription confirmation');
  console.log('   2. Weather alert notification');
  console.log('   3. Unsubscribe confirmation');
  console.log('\n💡 Note: If subscription fails, make sure to apply the SMS subscriptions database schema first.');
  console.log('📋 Run this command in Supabase SQL Editor:');
  console.log('   cat sms_subscriptions_table.sql');
}

testSubscriptionFunctionality().catch(console.error);
