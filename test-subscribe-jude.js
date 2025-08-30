#!/usr/bin/env node

// Test subscribing Jude's number to SMS notifications
async function testSubscribeJude() {
  console.log('📱 Subscribing +254793322831 to SMS notifications\n');

  const baseUrl = 'http://localhost:3000';
  const phoneNumber = '+254793322831';
  
  // Test 1: Subscribe to notifications
  console.log('1️⃣ Subscribing to SMS notifications...');
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

  // Test 2: Send a test bulk notification
  console.log('\n2️⃣ Sending test bulk notification...');
  try {
    const bulkResponse = await fetch(`${baseUrl}/api/sms/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: '🌦️ Weather Update: Partly cloudy with scattered showers expected in Nairobi today. Temperature: 18-24°C',
        alertType: 'weather'
      })
    });

    if (bulkResponse.ok) {
      const result = await bulkResponse.json();
      console.log('✅ Bulk Notification Response:', result);
    } else {
      const errorText = await bulkResponse.text();
      console.log('❌ Bulk Notification Error:', bulkResponse.status, errorText);
    }
  } catch (error) {
    console.log('❌ Bulk Notification Request Error:', error.message);
  }

  console.log('\n🎯 Test Summary:');
  console.log('📞 Phone Number: +254793322831');
  console.log('📨 Expected SMS Messages:');
  console.log('   1. Welcome/subscription confirmation');
  console.log('   2. Weather update notification');
  console.log('📱 Check your phone for SMS messages!');
}

testSubscribeJude().catch(console.error);
