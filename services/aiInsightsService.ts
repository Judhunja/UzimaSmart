// AI Insights Service using Inflection AI API
export class AIInsightsService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = 'XHinNJ5ZVEIG6Et4vcRbOYUdbr3KCLODFj2U2HPJY';
    this.baseUrl = 'https://api.inflection.ai/v1';
  }

  async generateClimateInsights(data: {
    type: 'temperature' | 'rainfall' | 'humidity' | 'alerts' | 'ndvi' | 'weather';
    values: number[];
    location?: string;
    timeframe?: string;
    metadata?: any;
  }): Promise<string> {
    try {
      const prompt = this.buildPrompt(data);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'inflection-2.5',
          messages: [
            {
              role: 'system',
              content: 'You are a climate change adaptation expert analyzing environmental data for Kenya. Focus on practical climate resilience strategies, adaptation measures, and actionable recommendations for communities and farmers. Provide concise, actionable insights in 2-3 sentences that help address climate change impacts.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 150,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const result = await response.json();
      return result.choices[0]?.message?.content || 'Unable to generate insights at this time.';
    } catch (error) {
      console.error('Error generating AI insights:', error);
      return this.getFallbackInsight(data.type);
    }
  }

  private buildPrompt(data: {
    type: string;
    values: number[];
    location?: string;
    timeframe?: string;
    metadata?: any;
  }): string {
    const { type, values, location = 'Kenya', timeframe = 'recent', metadata } = data;
    
    const stats = {
      average: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      trend: this.calculateTrend(values)
    };

    switch (type) {
      case 'temperature':
        return `Climate temperature analysis for ${location}: Average ${stats.average.toFixed(1)}°C, Range ${stats.min}°C to ${stats.max}°C, Trend: ${stats.trend}. What climate adaptation strategies should communities implement for these temperature patterns? Focus on heat resilience, crop adaptation, and community health measures.`;
      
      case 'rainfall':
        return `Climate rainfall analysis for ${location}: Average ${stats.average.toFixed(1)}mm, Range ${stats.min}mm to ${stats.max}mm, Trend: ${stats.trend}. What climate adaptation measures are needed for water management? Recommend drought-resistant crops, water harvesting, and flood mitigation strategies.`;
      
      case 'humidity':
        return `Climate humidity analysis for ${location}: Average ${stats.average.toFixed(1)}%, Range ${stats.min}% to ${stats.max}%, Trend: ${stats.trend}. How can communities adapt to these humidity patterns? Focus on health adaptation, agricultural practices, and infrastructure resilience.`;
      
      case 'ndvi':
        return `Vegetation health analysis for ${location}: Average ${stats.average.toFixed(2)}, Range ${stats.min.toFixed(2)} to ${stats.max.toFixed(2)}, Trend: ${stats.trend}. What climate-smart agriculture practices should be implemented? Recommend ecosystem restoration and sustainable land management strategies.`;
      
      case 'alerts':
        const alertCount = values.length;
        const severityDistribution = metadata?.severityDistribution || {};
        return `Climate risk analysis for ${location}: ${alertCount} climate alerts detected. What early warning and climate adaptation systems should communities establish? Focus on disaster preparedness and resilience building measures.`;
      
      case 'weather':
        return `Current climate conditions for ${location}: Temperature ${metadata?.temperature}°C, Humidity ${metadata?.humidity}%, Additional factors: ${JSON.stringify(metadata)}. What immediate climate adaptation actions should communities take? Provide weather-appropriate resilience recommendations.`;
      
      default:
        return `Climate data analysis for ${location}: Values range from ${stats.min} to ${stats.max}, average ${stats.average.toFixed(1)}, trend: ${stats.trend}. What climate change adaptation strategies are most relevant for these conditions? Focus on community resilience and sustainable practices.`;
    }
  }

  private calculateTrend(values: number[]): string {
    if (values.length < 2) return 'stable';
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const change = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    if (change > 5) return 'increasing';
    if (change < -5) return 'decreasing';
    return 'stable';
  }

  private getFallbackInsight(type: string): string {
    const fallbacks = {
      temperature: 'Temperature patterns indicate need for heat-resilient infrastructure and drought-resistant crops. Communities should implement shade structures and water conservation measures.',
      rainfall: 'Rainfall variability suggests implementing rainwater harvesting systems and drought-resistant agriculture. Develop flood management and water storage infrastructure.',
      humidity: 'Humidity levels require adaptation strategies including improved ventilation systems and disease-resistant crop varieties. Focus on health and agricultural resilience.',
      ndvi: 'Vegetation patterns indicate opportunities for ecosystem restoration and climate-smart agriculture. Implement soil conservation and sustainable land management practices.',
      alerts: 'Climate alerts highlight need for early warning systems and community preparedness. Strengthen disaster resilience and adaptive capacity measures.',
      weather: 'Current conditions support implementation of climate adaptation measures. Focus on building community resilience and sustainable practices.',
      default: 'Climate data suggests implementing comprehensive adaptation strategies including water management, sustainable agriculture, and community resilience measures.'
    };
    
    return fallbacks[type] || fallbacks.default;
  }

  async generateCountyInsights(countyData: {
    name: string;
    temperature: number;
    rainfall: number;
    alerts: number;
    population: number;
    climateZone: string;
  }): Promise<string> {
    const prompt = `Analyze climate conditions for ${countyData.name} County, Kenya (${countyData.climateZone} climate zone): 
    - Temperature: ${countyData.temperature}°C
    - Rainfall: ${countyData.rainfall}mm
    - Active alerts: ${countyData.alerts}
    - Population: ${countyData.population.toLocaleString()}
    
    Provide specific recommendations for this county's climate challenges and opportunities.`;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'inflection-2.5',
          messages: [
            {
              role: 'system',
              content: 'You are a climate advisor for Kenya providing county-specific climate insights and recommendations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const result = await response.json();
      return result.choices[0]?.message?.content || `${countyData.name} County shows typical ${countyData.climateZone} climate patterns. Monitor weather conditions and follow agricultural best practices for this region.`;
    } catch (error) {
      console.error('Error generating county insights:', error);
      return `${countyData.name} County shows typical ${countyData.climateZone} climate patterns. Monitor weather conditions and follow agricultural best practices for this region.`;
    }
  }
}

export const aiInsightsService = new AIInsightsService();
