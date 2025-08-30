// Simple test to verify Supabase connection
import { supabase } from './frontend/lib/supabase.js';

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Connection...\n');

  try {
    // Test 1: Basic connection
    console.log('1. Testing basic connection...');
    const { data, error } = await supabase.from('counties').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('📊 Sample query result:', data);
    
    // Test 2: Check if user_reports table exists
    console.log('\n2. Testing user_reports table...');
    const { data: reportsData, error: reportsError } = await supabase
      .from('user_reports')
      .select('count')
      .limit(1);
    
    if (reportsError) {
      console.error('❌ user_reports table access failed:', reportsError.message);
      console.log('💡 Hint: Make sure the Supabase schema has been applied');
    } else {
      console.log('✅ user_reports table accessible!');
    }
    
    console.log('\n🎉 Supabase testing completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testSupabaseConnection();
