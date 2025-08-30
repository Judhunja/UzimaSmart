#!/usr/bin/env node

// SMS Test for Jude's Phone Number
async function testSMSToJude() {
  console.log('📱 Testing SMS to +254793322831\n');

  const baseUrl = 'http://localhost:3000';
  const phoneNumber = '+254793322831';
  
  // Test 1: Direct SMS Send
  console.log('1️⃣ Sending test SMS...');
  try {
    const smsResponse = await fetch(`${baseUrl}/api/sms/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: [phoneNumber],
        message: '🌍 Hello from UzimaSmart! This is a test SMS from your climate reporting system. The SMS integration is working correctly! ✅'
      })
    });

    if (smsResponse.ok) {
      const smsResult = await smsResponse.json();
      console.log('✅ SMS API Response:', smsResult);
      console.log('📱 Check your phone for the SMS!');
    } else {
      const errorText = await smsResponse.text();
      console.log('❌ SMS API Error:', smsResponse.status, errorText);
    }
  } catch (error) {
    console.log('❌ SMS Request Error:', error.message);
  }

  // Test 2: Report with SMS Confirmation
  console.log('\n2️⃣ Testing report submission with SMS confirmation...');
  try {
    const reportResponse = await fetch(`${baseUrl}/api/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType: 'drought',
        county: 'Nairobi',
        description: 'SMS test report from UzimaSmart system. Testing climate report confirmation SMS functionality.',
        severity: 'medium',
        contactNumber: phoneNumber,
        reporterName: 'Jude (SMS Test)',
        locationDetails: 'Test Location for SMS',
        latitude: -1.2921,
        longitude: 36.8219,
        isEmergency: false
      })
    });

    if (reportResponse.ok) {
      const reportResult = await reportResponse.json();
      console.log('✅ Report submitted successfully!');
      console.log('📝 Report ID:', reportResult.report?.id);
      console.log('📱 Confirmation SMS should be sent to', phoneNumber);
    } else {
      const errorText = await reportResponse.text();
      console.log('❌ Report Error:', reportResponse.status);
      console.log('Error details:', errorText.substring(0, 500) + '...');
    }
  } catch (error) {
    console.log('❌ Report Request Error:', error.message);
  }

  console.log('\n🎯 Test Summary:');
  console.log('📞 Phone Number:', phoneNumber);
  console.log('📨 Sender ID: AFTKNG (configured in .env)');
  console.log('🔧 API Key configured for Africa\'s Talking');
  console.log('\n📱 Check your phone for SMS messages!');
}

// Run the test
testSMSToJude().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
