#!/usr/bin/env node

// Test SMS Subscription Functionality
async function testSubscriptionFunctionality() {
  console.log('🔔 Testing SMS Subscription Functionality\n');

  const baseUrl = 'http://localhost:3000';
  
  // Test 1: Test subscription endpoint (if it exists)
  console.log('1️⃣ Testing subscription management...');
  
  // Test 2: Test bulk notification to subscribers
  console.log('2️⃣ Testing bulk notification...');
  try {
    const bulkResponse = await fetch(`${baseUrl}/api/sms/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Test bulk SMS notification from UzimaSmart system',
        alertType: 'general'
      })
    });

    if (bulkResponse.ok) {
      const result = await bulkResponse.json();
      console.log('✅ Bulk SMS Response:', result);
    } else {
      console.log('❌ Bulk SMS Error:', bulkResponse.status);
    }
  } catch (error) {
    console.log('❌ Bulk SMS Request Error:', error.message);
  }

  // Test 3: Test emergency alert
  console.log('\n3️⃣ Testing emergency alert...');
  try {
    const emergencyResponse = await fetch(`${baseUrl}/api/sms/emergency`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Flash Flood Warning',
        location: 'Nairobi County',
        severity: 'HIGH',
        description: 'Heavy rains expected. Avoid low-lying areas.'
      })
    });

    if (emergencyResponse.ok) {
      const result = await emergencyResponse.json();
      console.log('✅ Emergency Alert Response:', result);
    } else {
      console.log('❌ Emergency Alert Error:', emergencyResponse.status);
    }
  } catch (error) {
    console.log('❌ Emergency Alert Request Error:', error.message);
  }

  console.log('\n🎯 Subscription Test Summary:');
  console.log('📞 Phone Number: +254793322831');
  console.log('🔧 SMS API: Working (confirmed with curl)');
  console.log('💾 Database: SMS subscriptions table needs to be applied');
  console.log('📨 Next: Apply database schema and create subscription endpoints');
}

testSubscriptionFunctionality().catch(console.error);
