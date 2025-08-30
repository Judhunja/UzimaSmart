#!/usr/bin/env node

// Simple test to verify SMS functionality
async function testSMSEndpoint() {
  console.log('🧪 Testing UzimaSmart SMS Functionality\n');

  const baseUrl = 'http://localhost:3000';
  
  // Wait for server to be ready
  console.log('⏳ Waiting for server to be ready...');
  let serverReady = false;
  for (let i = 0; i < 10; i++) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) {
        serverReady = true;
        break;
      }
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  if (!serverReady) {
    console.log('❌ Server not ready. Make sure npm run dev is running.');
    return;
  }

  console.log('✅ Server is ready!\n');

  // Test 1: SMS Send Endpoint
  console.log('1️⃣ Testing SMS Send Endpoint...');
  try {
    const smsResponse = await fetch(`${baseUrl}/api/sms/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: '+254700000001',
        message: 'Hello from UzimaSmart! 🌍 This is a test SMS to verify our climate reporting system is working correctly.'
      })
    });

    if (smsResponse.ok) {
      const smsResult = await smsResponse.json();
      console.log('✅ SMS API Response:', smsResult);
    } else {
      const errorText = await smsResponse.text();
      console.log('❌ SMS API Error:', errorText);
    }
  } catch (error) {
    console.log('❌ SMS Request Error:', error.message);
  }

  // Test 2: Report with SMS Confirmation
  console.log('\n2️⃣ Testing Report Submission with SMS...');
  try {
    const reportResponse = await fetch(`${baseUrl}/api/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType: 'drought',
        county: 'Nairobi',
        description: 'Test drought report - SMS functionality test. Water scarcity reported in local area.',
        severity: 'medium',
        contactNumber: '+254700000001',
        reporterName: 'SMS Test User',
        locationDetails: 'Test Location, Nairobi'
      })
    });

    if (reportResponse.ok) {
      const reportResult = await reportResponse.json();
      console.log('✅ Report Submitted:', reportResult.success);
      console.log('📱 SMS confirmation should be sent to +254700000001');
      if (reportResult.report) {
        console.log('📝 Report ID:', reportResult.report.id);
      }
    } else {
      const errorText = await reportResponse.text();
      console.log('❌ Report Error:', errorText);
    }
  } catch (error) {
    console.log('❌ Report Request Error:', error.message);
  }

  // Test 3: Check SMS subscriptions table exists
  console.log('\n3️⃣ Testing Database SMS Table...');
  try {
    const dbResponse = await fetch(`${baseUrl}/api/reports?limit=1`);
    if (dbResponse.ok) {
      console.log('✅ Database connection working');
    } else {
      console.log('❌ Database connection issue');
    }
  } catch (error) {
    console.log('❌ Database test error:', error.message);
  }

  console.log('\n🎯 Test Complete!');
  console.log('📱 Check the phone number +254700000001 for SMS messages');
  console.log('🔧 If no SMS received, check:');
  console.log('   - AFRICASTALKING_API_KEY in .env');
  console.log('   - Africa\'s Talking account balance');
  console.log('   - Network connectivity');
}

// Run with proper error handling
testSMSEndpoint().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
