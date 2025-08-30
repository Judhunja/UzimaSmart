// Test AI Insights Service
const { AIInsightsService } = require('./services/aiInsightsService');

async function testClimateInsights() {
  console.log('🧪 Testing AI Climate Insights Service...\n');

  const service = new AIInsightsService();

  // Test climate adaptation insights
  const testData = {
    type: 'temperature',
    values: [28.5, 29.2, 27.8, 30.1, 31.5],
    location: 'Nairobi County',
    timeframe: 'this week',
    metadata: {
      adaptationContext: 'climate resilience strategies'
    }
  };

  try {
    console.log('📊 Input Data:', JSON.stringify(testData, null, 2));
    console.log('\n🤖 Generating AI insights...');
    
    const insights = await service.generateClimateInsights(testData);
    
    console.log('\n✅ AI Climate Adaptation Insights:');
    console.log('━'.repeat(50));
    console.log(insights);
    console.log('━'.repeat(50));
    
    console.log('\n🎯 Key Features:');
    console.log('• Uses Inflection AI API key: XHinNJ5ZVEIG6Et4vcRbOYUdbr3KCLODFj2U2HPJY');
    console.log('• Focuses on climate change adaptation strategies');
    console.log('• Provides actionable recommendations for communities');
    console.log('• Integrates with all data visualizations');
    
  } catch (error) {
    console.error('❌ Error testing AI insights:', error.message);
    console.log('\n🔧 Fallback insight will be used in production');
  }
}

// Run the test
testClimateInsights();
