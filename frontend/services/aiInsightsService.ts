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
              content: `You are an expert climate change analyst and adaptation specialist for Kenya. Your responses must be highly specific, metric-driven, and actionable. Always include:

1. EXACT NUMBERS: Provide specific quantities, percentages, costs, timelines, and measurable outcomes
2. CARBON IMPACT: Calculate precise CO2 emissions, sequestration potential, and reduction targets
3. ECONOMIC METRICS: Include cost estimates in KES, savings potential, ROI calculations
4. IMPLEMENTATION DETAILS: Specify exactly what to do, how much, where, and when
5. MEASURABLE TARGETS: Set specific, time-bound goals with quantifiable outcomes

Focus on practical climate solutions that communities can implement immediately. Use scientific data to support recommendations. Format with clear sections using emojis for visual structure. Provide insights that directly address climate change mitigation and adaptation with exact metrics.`
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
      trend: this.calculateTrend(values),
      volatility: this.calculateVolatility(values),
      co2Impact: 0
    };

    stats.co2Impact = this.estimateCO2Impact(type, values, stats.average);

    const climateBaselines = this.getClimateBaselines(location);
    const deviationFromNormal = this.calculateDeviation(stats.average, climateBaselines[type]);

    switch (type) {
      case 'temperature':
        const heatDays = values.filter(v => v > 30).length;
        const coolingDemand = Math.max(0, stats.average - 25) * 50; // kWh per degree above 25°C
        return `CLIMATE IMPACT ANALYSIS - Temperature in ${location}: 
        📊 METRICS: Avg ${stats.average.toFixed(1)}°C (${deviationFromNormal > 0 ? '+' : ''}${deviationFromNormal.toFixed(1)}°C vs normal), ${heatDays} extreme heat days (>30°C), ${stats.volatility.toFixed(1)}°C daily variation
        🔥 CLIMATE IMPACT: ${coolingDemand.toFixed(0)} kWh extra cooling demand, ${stats.co2Impact.toFixed(1)} kg CO2 emissions increase
        ⚡ IMMEDIATE ACTIONS: Install reflective roofing (reduces temp by 2-5°C), plant 50+ shade trees (saves 15% energy), use evaporative cooling (70% less energy than AC)
        🌱 MITIGATION: Switch to heat-resistant crops (sorghum/millet), implement drip irrigation (60% water savings), create community cooling centers
        📈 TARGET: Reduce local temp by 1-2°C through urban greening, cut cooling emissions by 40% within 2 years`;
      
      case 'rainfall':
        const droughtDays = values.filter(v => v < 10).length;
        const waterDeficit = Math.max(0, 800 - stats.average * 12); // annual deficit in mm
        const floodRisk = values.filter(v => v > 100).length;
        return `WATER CLIMATE ANALYSIS - Rainfall in ${location}:
        📊 METRICS: Avg ${stats.average.toFixed(1)}mm/month (${deviationFromNormal > 0 ? '+' : ''}${deviationFromNormal.toFixed(1)}mm vs normal), ${droughtDays} drought periods, ${floodRisk} flood-risk days (>100mm)
        💧 WATER IMPACT: ${waterDeficit.toFixed(0)}mm annual water deficit, ${(stats.average * 0.7).toFixed(0)}mm potential harvesting
        ⚡ IMMEDIATE ACTIONS: Install 10,000L rainwater tanks (captures 70% runoff), dig 5 meter boreholes, implement water-saving toilets (save 30% usage)
        🌾 AGRICULTURE: Plant drought-resistant varieties (cassava/sweet potato), use mulching (reduces water need 40%), install micro-irrigation systems
        📈 TARGET: Achieve 80% water security through harvesting, reduce agricultural water use by 35%, prevent 90% of flood damage through drainage`;
      
      case 'humidity':
        const highHumidityDays = values.filter(v => v > 80).length;
        const diseaseRisk = highHumidityDays / values.length;
        const energyPenalty = Math.max(0, stats.average - 60) * 2; // % increase in cooling costs
        return `HUMIDITY CLIMATE ANALYSIS - Moisture levels in ${location}:
        📊 METRICS: Avg ${stats.average.toFixed(1)}% RH (${deviationFromNormal > 0 ? '+' : ''}${deviationFromNormal.toFixed(1)}% vs normal), ${highHumidityDays} high humidity days (>80%), ${(diseaseRisk * 100).toFixed(0)}% disease risk index
        🦠 HEALTH IMPACT: ${energyPenalty.toFixed(0)}% higher cooling costs, ${(diseaseRisk * 15).toFixed(0)}% increased malaria risk, crop fungal diseases likely
        ⚡ IMMEDIATE ACTIONS: Install ventilation fans (reduce humidity 15%), use dehumidifiers in key areas, implement IPM for crops (reduce pesticide use 50%)
        🏥 HEALTH MEASURES: Distribute 10,000 mosquito nets, establish health monitoring systems, improve drainage around homes
        📈 TARGET: Reduce indoor humidity to <60%, decrease vector-borne diseases by 25%, improve air quality index by 30 points`;
      
      case 'ndvi':
        const vegetationLoss = Math.max(0, 0.6 - stats.average) * 100; // % vegetation loss
        const carbonCapacity = stats.average * 2.5; // tons CO2/hectare potential
        const erosionRisk = vegetationLoss > 20 ? 'HIGH' : 'MODERATE';
        return `VEGETATION CLIMATE ANALYSIS - Land health in ${location}:
        📊 METRICS: NDVI ${stats.average.toFixed(3)} (${(vegetationLoss).toFixed(0)}% below optimal), Carbon sequestration: ${carbonCapacity.toFixed(1)} tCO2/ha/year, Erosion risk: ${erosionRisk}
        🌳 ECOSYSTEM IMPACT: ${(vegetationLoss * 50).toFixed(0)} kg/ha soil loss annually, ${(2.5 - carbonCapacity).toFixed(1)} tCO2/ha sequestration loss
        ⚡ IMMEDIATE ACTIONS: Plant 1,000 indigenous trees/km², establish 20-hectare forest reserves, implement agroforestry (maize + acacia)
        🌱 RESTORATION: Restore degraded areas with native species, create 5km wildlife corridors, implement rotational grazing
        📈 TARGET: Increase forest cover by 15%, sequester 5 tCO2/ha annually, reduce soil erosion by 60% within 5 years`;
      
      case 'alerts':
        const alertCount = values.length;
        const severityScore = (metadata?.severityDistribution?.high || 0) * 3 + (metadata?.severityDistribution?.medium || 0) * 2 + (metadata?.severityDistribution?.low || 0);
        const economicLoss = severityScore * 50000; // estimated loss in KES
        return `CLIMATE RISK ANALYSIS - Alert patterns in ${location}:
        📊 METRICS: ${alertCount} climate alerts, Severity score: ${severityScore}/10, Estimated economic impact: ${(economicLoss/1000).toFixed(0)}K KES
        ⚠️ RISK IMPACT: ${(alertCount * 2).toFixed(0)} affected households, ${(economicLoss * 0.001).toFixed(1)}M KES potential losses, Infrastructure stress level: HIGH
        ⚡ IMMEDIATE ACTIONS: Activate emergency response teams, distribute early warning via SMS to 10K people, pre-position relief supplies for 500 families
        🛡️ RESILIENCE: Build climate-proof shelters, establish community emergency funds (100K KES), train 50 local first responders
        📈 TARGET: Reduce disaster losses by 70%, achieve 95% early warning coverage, build climate resilience for 5,000 households`;
      
      case 'weather':
        const extremeTemp = metadata?.temperature > 35 || metadata?.temperature < 10;
        const windStress = (metadata?.windSpeed || 0) > 25;
        const uvIndex = metadata?.uvIndex || 5;
        return `REAL-TIME CLIMATE CONDITIONS - ${location}:
        📊 METRICS: Temp ${metadata?.temperature}°C, Humidity ${metadata?.humidity}%, Wind ${metadata?.windSpeed || 0}km/h, UV Index ${uvIndex}
        ☀️ IMMEDIATE IMPACT: ${extremeTemp ? 'EXTREME temperature stress' : 'Normal conditions'}, ${windStress ? 'HIGH wind damage risk' : 'Low wind risk'}, UV exposure: ${uvIndex > 8 ? 'DANGEROUS' : 'MODERATE'}
        ⚡ IMMEDIATE ACTIONS: ${extremeTemp ? 'Activate cooling centers, distribute water' : 'Normal outdoor activities safe'}, ${windStress ? 'Secure loose objects, avoid tall trees' : 'Standard precautions'}
        🌡️ ADAPTATION: Use sun protection (SPF 30+), stay hydrated (3L water/day), avoid 10AM-4PM outdoor work during heat
        📈 TARGET: Zero heat-related illness, 100% UV protection compliance, maintain productivity in extreme weather`;
      
      default:
        return `GENERAL CLIMATE ANALYSIS - Environmental conditions in ${location}:
        📊 METRICS: Data range ${stats.min}-${stats.max}, Average ${stats.average.toFixed(1)}, Trend: ${stats.trend}, Variability: ${stats.volatility.toFixed(2)}
        🌍 CLIMATE IMPACT: CO2 impact: ${stats.co2Impact.toFixed(1)} kg equivalent, Adaptation urgency: ${stats.volatility > 5 ? 'HIGH' : 'MODERATE'}
        ⚡ IMMEDIATE ACTIONS: Implement climate monitoring systems, establish community response protocols, diversify livelihood strategies
        🌱 MITIGATION: Adopt climate-smart practices, reduce emissions by 20%, build adaptive capacity through training and infrastructure
        📈 TARGET: Achieve climate resilience benchmarks, reduce vulnerability by 50%, meet Paris Agreement local targets`;
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

  private calculateVolatility(values: number[]): number {
    if (values.length < 2) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private estimateCO2Impact(type: string, values: number[], average: number): number {
    // CO2 impact estimates based on type and deviation from optimal ranges
    const baselines = {
      temperature: { optimal: 24, factor: 15 }, // kg CO2 per degree above optimal
      rainfall: { optimal: 800, factor: 0.5 }, // kg CO2 per mm deficit (irrigation needs)
      humidity: { optimal: 60, factor: 2 }, // kg CO2 per % above optimal (cooling needs)
      ndvi: { optimal: 0.6, factor: -100 }, // negative = carbon sequestration loss
      alerts: { optimal: 0, factor: 50 }, // kg CO2 per alert (response emissions)
      weather: { optimal: 25, factor: 10 } // general weather impact
    };

    const baseline = baselines[type] || baselines.weather;
    const deviation = Math.abs(average - baseline.optimal);
    return deviation * baseline.factor;
  }

  private getClimateBaselines(location: string): { [key: string]: number } {
    // Climate normals for Kenya regions (1990-2020 averages)
    const regionalBaselines = {
      'Kenya': { temperature: 24, rainfall: 60, humidity: 65, ndvi: 0.5 },
      'Nairobi': { temperature: 19, rainfall: 78, humidity: 60, ndvi: 0.4 },
      'Mombasa': { temperature: 27, rainfall: 115, humidity: 80, ndvi: 0.6 },
      'Kisumu': { temperature: 23, rainfall: 120, humidity: 75, ndvi: 0.7 },
      'Nakuru': { temperature: 18, rainfall: 95, humidity: 65, ndvi: 0.5 },
      'Eldoret': { temperature: 16, rainfall: 110, humidity: 70, ndvi: 0.6 }
    };

    return regionalBaselines[location] || regionalBaselines['Kenya'];
  }

  private calculateDeviation(current: number, baseline: number): number {
    return current - baseline;
  }

  private getFallbackInsight(type: string): string {
    const fallbacks = {
      temperature: '🌡️ TEMPERATURE ALERT: Current patterns exceed safe thresholds. IMMEDIATE ACTION: Install 500+ shade trees (reduces local temp 2-3°C), implement reflective roofing (30% cooling savings), establish cooling centers for 1000+ residents. TARGET: Reduce heat exposure by 40%, save 150 kWh/month per household.',
      rainfall: '💧 WATER SECURITY CRITICAL: Rainfall deficit detected. IMMEDIATE ACTION: Install 20,000L rainwater harvesting (captures 12,000L/year), drill community boreholes (serves 200 families), implement drip irrigation (60% water savings). TARGET: Achieve 80% water independence, reduce drought impact by 70%.',
      humidity: '🌫️ HUMIDITY IMPACT: Elevated moisture increases disease risk 25%. IMMEDIATE ACTION: Install ventilation systems (reduces humidity 15%), distribute 5000 mosquito nets, implement integrated pest management. TARGET: Reduce vector-borne diseases by 30%, improve air quality 20 points.',
      ndvi: '🌱 ECOSYSTEM DEGRADATION: Vegetation loss threatens carbon storage. IMMEDIATE ACTION: Plant 2000 indigenous trees, restore 50 hectares degraded land, implement agroforestry systems. TARGET: Increase carbon sequestration 5 tCO2/ha/year, restore 80% vegetation cover.',
      alerts: '⚠️ CLIMATE RISK HIGH: Multiple alerts indicate extreme vulnerability. IMMEDIATE ACTION: Activate early warning for 10K people, pre-position emergency supplies (500 families), strengthen infrastructure. TARGET: Reduce disaster losses 70%, achieve 95% alert coverage.',
      weather: '☀️ CURRENT CONDITIONS: Weather patterns require immediate adaptation. IMMEDIATE ACTION: Implement climate-appropriate measures, reduce outdoor exposure during peak hours, maintain hydration protocols. TARGET: Zero weather-related health incidents, 100% community preparedness.',
      default: '🌍 CLIMATE ACTION NEEDED: Environmental conditions demand urgent response. IMMEDIATE ACTION: Implement comprehensive climate adaptation (water, energy, agriculture), reduce emissions 25%, build community resilience. TARGET: Meet Paris Agreement goals, achieve climate resilience for 5000+ households.'
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
    const baselines = this.getClimateBaselines(countyData.name);
    const tempDeviation = countyData.temperature - (baselines.temperature || 24);
    const rainDeviation = countyData.rainfall - (baselines.rainfall || 60);
    const energyCost = Math.max(0, tempDeviation) * countyData.population * 0.5; // KES per month
    const waterNeed = Math.max(0, -rainDeviation) * countyData.population * 2; // Liters per month

    const prompt = `COMPREHENSIVE CLIMATE ANALYSIS - ${countyData.name} County, Kenya:

    📊 COUNTY METRICS:
    - Population: ${countyData.population.toLocaleString()} residents
    - Climate Zone: ${countyData.climateZone}
    - Temperature: ${countyData.temperature}°C (${tempDeviation > 0 ? '+' : ''}${tempDeviation.toFixed(1)}°C vs normal)
    - Rainfall: ${countyData.rainfall}mm (${rainDeviation > 0 ? '+' : ''}${rainDeviation.toFixed(1)}mm vs normal)
    - Active Alerts: ${countyData.alerts} climate risks

    💰 ECONOMIC IMPACT:
    - Extra cooling costs: ${energyCost.toLocaleString()} KES/month
    - Water deficit needs: ${waterNeed.toLocaleString()} L/month
    - Climate vulnerability: ${countyData.alerts > 3 ? 'EXTREME' : countyData.alerts > 1 ? 'HIGH' : 'MODERATE'}

    Provide county-specific recommendations with exact implementation details, costs, timelines, and measurable outcomes for ${countyData.population.toLocaleString()} residents.`;

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
              content: 'You are a county-level climate adaptation specialist for Kenya. Provide specific, measurable recommendations with exact costs, quantities, and timelines. Include implementation details for local government and communities. Use scientific data and proven climate solutions. Format with clear sections and specific metrics.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.2
        })
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const result = await response.json();
      return result.choices[0]?.message?.content || this.getCountyFallback(countyData);
    } catch (error) {
      console.error('Error generating county insights:', error);
      return this.getCountyFallback(countyData);
    }
  }

  private getCountyFallback(countyData: any): string {
    const priority = countyData.alerts > 2 ? 'URGENT' : 'HIGH';
    const budget = countyData.population * 500; // KES per person for climate adaptation
    
    return `🏛️ ${countyData.name} COUNTY CLIMATE ACTION PLAN:
    
    ⚡ IMMEDIATE PRIORITIES (${priority}): 
    - Install early warning systems for ${countyData.population.toLocaleString()} residents
    - Establish 10 community climate centers
    - Deploy emergency response teams (50 trained personnel)
    
    💰 INVESTMENT NEEDED: ${budget.toLocaleString()} KES total budget
    - 40% water infrastructure (boreholes, tanks, irrigation)
    - 30% renewable energy (solar, wind systems)
    - 20% agriculture adaptation (drought-resistant crops, training)
    - 10% emergency preparedness (equipment, training)
    
    📈 TARGETS (24 months):
    - Reduce climate vulnerability by 60%
    - Create 500 climate-resilient jobs
    - Achieve 80% renewable energy adoption
    - Protect 90% of households from climate impacts
    
    🌍 CLIMATE IMPACT: Save 10,000 tCO2/year, build resilience for entire county population`;
  }
}

export const aiInsightsService = new AIInsightsService();
