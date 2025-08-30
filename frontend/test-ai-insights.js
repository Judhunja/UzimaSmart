// Test script for AI Insights Service
const { generateInsights } = require('./services/aiInsightsService');

async function testAIInsights() {
  console.log('Testing AI Insights Service...');

  const testData = {
    type: 'temperature',
    values: [25.3, 26.1, 24.8, 27.2, 28.0],
    location: 'Nairobi County',
    timeframe: 'last 5 days'
  };

  try {
    const insights = await generateInsights(testData, 'weather');
    console.log('✅ AI Insights generated successfully:');
    console.log(insights);
  } catch (error) {
    console.error('❌ Error generating AI insights:', error.message);
  }
}

testAIInsights();
