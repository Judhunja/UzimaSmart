// Test script for authentication and SMS functionality
const testAuth = async () => {
  console.log('🧪 Testing Authentication System...');
  
  // Test data
  const testUser = {
    name: 'Jude Test User',
    email: 'jude.test@uzima.com',
    phoneNumber: '+254793322831',
    password: 'testpassword123'
  };

  try {
    // Test Registration
    console.log('\n1. Testing Registration...');
    const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    const registerData = await registerResponse.json();
    console.log('Register Response:', registerData);

    if (registerData.success) {
      console.log('✅ Registration successful!');
      
      // Test Login
      console.log('\n2. Testing Login...');
      const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });
      
      const loginData = await loginResponse.json();
      console.log('Login Response:', loginData);
      
      if (loginData.success) {
        console.log('✅ Login successful!');
        const user = loginData.user;
        
        // Test SMS Subscription with authenticated user
        console.log('\n3. Testing SMS Subscription...');
        const subscribeResponse = await fetch('http://localhost:3000/api/sms/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneNumber: user.phoneNumber,
            userId: user.id,
            weatherAlerts: true,
            emergencyAlerts: true,
            reportConfirmations: true
          })
        });
        
        const subscribeData = await subscribeResponse.json();
        console.log('Subscribe Response:', subscribeData);
        
        if (subscribeData.success) {
          console.log('✅ SMS Subscription successful!');
          
          // Test SMS Status Check
          console.log('\n4. Testing SMS Status Check...');
          const statusResponse = await fetch('http://localhost:3000/api/sms/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phoneNumber: user.phoneNumber
            })
          });
          
          const statusData = await statusResponse.json();
          console.log('Status Response:', statusData);
          
          if (statusData.success) {
            console.log('✅ Status check successful!');
            console.log('\n🎉 All tests passed! Authentication and SMS system is working correctly.');
          }
        }
      }
    } else {
      // If registration fails, try login (user might already exist)
      console.log('Registration failed, trying login...');
      const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });
      
      const loginData = await loginResponse.json();
      console.log('Login Response:', loginData);
      
      if (loginData.success) {
        console.log('✅ Login successful with existing user!');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testAuth();
