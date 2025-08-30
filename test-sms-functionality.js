// SMS Test Script for UzimaSmart
// Run this with: node test-sms-functionality.js

const testSMSFunctionality = async () => {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing UzimaSmart SMS Functionality\n');

  // Test 1: Test SMS sending endpoint
  console.log('1️⃣ Testing SMS Send Endpoint...');
  try {
    const smsResponse = await fetch(`${baseUrl}/api/sms/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: '+254700000001',
        message: 'Test SMS from UzimaSmart! This is a test message to verify SMS functionality is working correctly.'
      })
    });

    const smsResult = await smsResponse.json();
    console.log('✅ SMS Send Result:', smsResult);
  } catch (error) {
    console.log('❌ SMS Send Error:', error.message);
  }

  console.log('\n2️⃣ Testing Report Submission with SMS Confirmation...');
  try {
    const reportResponse = await fetch(`${baseUrl}/api/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType: 'drought',
        county: 'Nairobi',
        description: 'Test drought report for SMS functionality testing. Water levels are critically low in several areas.',
        severity: 'high',
        contactNumber: '+254700000001',
        reporterName: 'Test User',
        locationDetails: 'Kibera, Nairobi',
        latitude: -1.3139,
        longitude: 36.7744,
        isEmergency: false
      })
    });

    const reportResult = await reportResponse.json();
    console.log('✅ Report Submission Result:', reportResult);
    
    if (reportResult.success) {
      console.log('📱 SMS confirmation should have been sent to +254700000001');
    }
  } catch (error) {
    console.log('❌ Report Submission Error:', error.message);
  }

  console.log('\n3️⃣ Testing Emergency Report (should trigger emergency alerts)...');
  try {
    const emergencyResponse = await fetch(`${baseUrl}/api/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType: 'flooding',
        county: 'Mombasa',
        description: 'EMERGENCY: Severe flooding in coastal areas. Immediate evacuation needed.',
        severity: 'severe',
        contactNumber: '+254700000002',
        reporterName: 'Emergency Reporter',
        locationDetails: 'Mombasa Island',
        latitude: -4.0435,
        longitude: 39.6682,
        isEmergency: true
      })
    });

    const emergencyResult = await emergencyResponse.json();
    console.log('✅ Emergency Report Result:', emergencyResult);
    console.log('🚨 Emergency alerts should be sent to all subscribers');
  } catch (error) {
    console.log('❌ Emergency Report Error:', error.message);
  }

  console.log('\n4️⃣ Testing SMS Subscription...');
  try {
    // This would test the notification service directly
    console.log('📝 Testing subscription functionality...');
    
    const subscriptionTest = {
      phoneNumber: '+254700000003',
      weatherAlerts: true,
      emergencyAlerts: true,
      reportConfirmations: true
    };
    
    console.log('✅ Subscription test data prepared:', subscriptionTest);
    console.log('💡 To test subscriptions, you would call notificationService.subscribeToNotifications()');
  } catch (error) {
    console.log('❌ Subscription Test Error:', error.message);
  }

  console.log('\n5️⃣ Checking Database Connection...');
  try {
    const reportsResponse = await fetch(`${baseUrl}/api/reports?limit=1`);
    const reportsResult = await reportsResponse.json();
    
    if (reportsResult.success) {
      console.log('✅ Database connection working');
      console.log('📊 Latest report:', reportsResult.reports[0]?.event_type || 'No reports found');
    } else {
      console.log('❌ Database connection issue:', reportsResult.error);
    }
  } catch (error) {
    console.log('❌ Database Test Error:', error.message);
  }

  console.log('\n🎯 Test Summary:');
  console.log('- SMS sending endpoint: /api/sms/send');
  console.log('- Report submission with SMS: /api/reports');
  console.log('- Emergency alerts: Triggered on severe/emergency reports');
  console.log('- SMS confirmations: Sent when contactNumber is provided');
  console.log('\n📱 Check your phone/SMS service for actual message delivery');
  console.log('🔧 Make sure AFRICASTALKING_API_KEY is configured in .env');
};

// Run the test
testSMSFunctionality().catch(console.error);
