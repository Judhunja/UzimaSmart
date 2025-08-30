import { africasTalkingService } from '../frontend/services/smsService.js';

// Simple SMS test
async function testSMS() {
  console.log('🧪 Testing SMS Service...\n');

  // Test phone number formatting
  console.log('1️⃣ Testing phone number formatting:');
  const testNumbers = ['0700000001', '254700000001', '+254700000001', '700000001'];
  testNumbers.forEach(num => {
    const formatted = africasTalkingService.formatPhoneNumber(num);
    const isValid = africasTalkingService.isValidKenyanPhone(formatted);
    console.log(`${num} → ${formatted} (${isValid ? '✅ Valid' : '❌ Invalid'})`);
  });

  // Test SMS sending
  console.log('\n2️⃣ Testing SMS sending:');
  try {
    const result = await africasTalkingService.sendSMS({
      to: ['+254700000001'],
      message: 'Test SMS from UzimaSmart! This confirms your SMS service is working correctly. 📱✅'
    });
    
    console.log('SMS Result:', result);
    
    if (result.success) {
      console.log('✅ SMS sent successfully!');
    } else {
      console.log('❌ SMS failed:', result.error);
    }
  } catch (error) {
    console.log('❌ SMS Error:', error.message);
  }
}

// Export for use
export { testSMS };
