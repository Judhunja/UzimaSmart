// Test script for the reports API functionality
const API_BASE = 'http://localhost:3000/api';

async function testReportsAPI() {
  console.log('🧪 Testing Reports API...\n');

  try {
    // Test 1: GET /api/reports (should handle empty case gracefully)
    console.log('1. Testing GET /api/reports...');
    const getResponse = await fetch(`${API_BASE}/reports?limit=5`);
    const getResult = await getResponse.json();
    console.log('✅ GET Response status:', getResponse.status);
    console.log('📄 Response data:', getResult);
    console.log('');

    // Test 2: POST /api/reports (create new report)
    console.log('2. Testing POST /api/reports...');
    const testReport = {
      eventType: 'drought',
      county: 'Nairobi',
      description: 'Test drought report from API test script. Water levels critically low in local reservoirs.',
      severity: 'high',
      contactNumber: '+254700000000',
      reporterName: 'Test Reporter',
      locationDetails: 'Kasarani area',
      isEmergency: true
    };

    const postResponse = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testReport)
    });

    const postResult = await postResponse.json();
    console.log('✅ POST Response status:', postResponse.status);
    console.log('📄 Response data:', postResult);
    
    if (postResult.success && postResult.data) {
      const reportId = postResult.data.id;
      console.log('📋 Created report ID:', reportId);

      // Test 3: Interaction endpoint
      console.log('\n3. Testing POST /api/reports/[id]/interact...');
      const interactResponse = await fetch(`${API_BASE}/reports/${reportId}/interact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'confirm',
          userId: 'test-user-123'
        })
      });

      const interactResult = await interactResponse.json();
      console.log('✅ Interaction Response status:', interactResponse.status);
      console.log('📄 Response data:', interactResult);
    }

    console.log('\n🎉 Reports API testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testReportsAPI();
