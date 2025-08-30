#!/usr/bin/env node

// Test SMS Subscription UI Functionality
async function testSubscriptionUI() {
  console.log('🖥️  Testing SMS Subscription UI Functionality\n');

  const baseUrl = 'http://localhost:3000'; // API server running on 3000
  const phoneNumber = '+254793322831';
  
  console.log(`Testing with phone number: ${phoneNumber}`);
  console.log(`Frontend URL: ${baseUrl}\n`);

  // Test the API endpoints that the UI will call
  console.log('1️⃣ Testing Subscribe API...');
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
      console.log('✅ Subscribe API Response:', result);
    } else {
      const errorText = await subscribeResponse.text();
      console.log('❌ Subscribe API Error:', subscribeResponse.status, errorText);
    }
  } catch (error) {
    console.log('❌ Subscribe API Request Error:', error.message);
  }

  // Test status API
  console.log('\n2️⃣ Testing Status API...');
  try {
    const statusResponse = await fetch(`${baseUrl}/api/sms/status?phoneNumber=${encodeURIComponent(phoneNumber)}`);
    
    if (statusResponse.ok) {
      const statusResult = await statusResponse.json();
      console.log('✅ Status API Response:', statusResult);
    } else {
      const errorText = await statusResponse.text();
      console.log('❌ Status API Error:', statusResponse.status, errorText);
    }
  } catch (error) {
    console.log('❌ Status API Request Error:', error.message);
  }

  // Test unsubscribe API
  console.log('\n3️⃣ Testing Unsubscribe API...');
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
      console.log('✅ Unsubscribe API Response:', result);
    } else {
      const errorText = await unsubscribeResponse.text();
      console.log('❌ Unsubscribe API Error:', unsubscribeResponse.status, errorText);
    }
  } catch (error) {
    console.log('❌ Unsubscribe API Request Error:', error.message);
  }

  console.log('\n🎯 UI Test Summary:');
  console.log('🌐 Frontend URL:', baseUrl);
  console.log('📱 SMS Subscription UI Components:');
  console.log('   • SMSSubscriptionPanel - Full featured panel with preferences');
  console.log('   • SMSManager - Simple subscribe/unsubscribe widget');
  console.log('\n✅ Next Steps:');
  console.log('1. Open browser to:', baseUrl);
  console.log('2. Scroll to SMS Notifications section');
  console.log('3. Enter your phone number:', phoneNumber);
  console.log('4. Test subscribe/unsubscribe buttons');
  console.log('5. Check your phone for SMS confirmations');
}

testSubscriptionUI().catch(console.error);
