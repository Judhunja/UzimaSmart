// Weather Service with OpenWeather API integration
export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  rainfall: number;
  windSpeed: number;
  windDirection: number;
  cloudCover: number;
  uvIndex: number;
  visibility: number;
  description: string;
  icon: string;
  timestamp: number;
}

export interface WeatherForecast {
  date: string;
  temperature: {
    min: number;
    max: number;
    avg: number;
  };
  humidity: number;
  rainfall: number;
  description: string;
  icon: string;
}

export interface HistoricalWeatherData {
  date: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  pressure: number;
}

export interface CountyWeatherData {
  county: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  current: WeatherData;
  forecast: WeatherForecast[];
  historical: HistoricalWeatherData[];
}

export class WeatherService {
  private apiKey: string;
  private baseUrl: string;
  private historicalUrl: string;

  constructor() {
    // Using a demo API key - in production, this should be from environment variables
    this.apiKey = 'your_openweather_api_key'; // Replace with actual API key
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.historicalUrl = 'https://api.openweathermap.org/data/3.0';
  }

  // Major Kenyan counties with coordinates
  private kenyaCounties = [
    { name: 'Nairobi', lat: -1.2921, lon: 36.8219 },
    { name: 'Mombasa', lat: -4.0435, lon: 39.6682 },
    { name: 'Kisumu', lat: -0.1022, lon: 34.7617 },
    { name: 'Nakuru', lat: -0.3031, lon: 36.0800 },
    { name: 'Eldoret', lat: 0.5143, lon: 35.2698 },
    { name: 'Meru', lat: 0.0467, lon: 37.6500 },
    { name: 'Kitale', lat: 1.0153, lon: 35.0065 },
    { name: 'Machakos', lat: -1.5177, lon: 37.2634 },
    { name: 'Nyeri', lat: -0.4167, lon: 36.9500 },
    { name: 'Kakamega', lat: 0.2841, lon: 34.7519 }
  ];

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    try {
      // For demo purposes, return simulated data since we don't have a real API key
      return this.generateSimulatedWeatherData();
      
      /* Uncomment when you have a real API key:
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      return this.transformWeatherData(data);
      */
    } catch (error) {
      console.error('Error fetching current weather:', error);
      return this.generateSimulatedWeatherData();
    }
  }

  async getWeatherForecast(lat: number, lon: number): Promise<WeatherForecast[]> {
    try {
      // For demo purposes, return simulated data
      return this.generateSimulatedForecast();
      
      /* Uncomment when you have a real API key:
      const response = await fetch(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
      }
      
      const data = await response.json();
      return this.transformForecastData(data);
      */
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      return this.generateSimulatedForecast();
    }
  }

  async getHistoricalWeather(lat: number, lon: number, days: number = 30): Promise<HistoricalWeatherData[]> {
    try {
      // For demo purposes, return simulated historical data
      return this.generateSimulatedHistoricalData(days);
      
      /* Uncomment when you have a real API key:
      const endDate = Math.floor(Date.now() / 1000);
      const startDate = endDate - (days * 24 * 60 * 60);
      
      const response = await fetch(
        `${this.historicalUrl}/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${startDate}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Historical weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      return this.transformHistoricalData(data);
      */
    } catch (error) {
      console.error('Error fetching historical weather:', error);
      return this.generateSimulatedHistoricalData(days);
    }
  }

  async getAllCountyWeatherData(): Promise<CountyWeatherData[]> {
    const results: CountyWeatherData[] = [];
    
    for (const county of this.kenyaCounties) {
      try {
        const [current, forecast, historical] = await Promise.all([
          this.getCurrentWeather(county.lat, county.lon),
          this.getWeatherForecast(county.lat, county.lon),
          this.getHistoricalWeather(county.lat, county.lon, 30)
        ]);

        results.push({
          county: county.name,
          coordinates: { lat: county.lat, lon: county.lon },
          current,
          forecast,
          historical
        });
      } catch (error) {
        console.error(`Error fetching weather for ${county.name}:`, error);
      }
    }
    
    return results;
  }

  // Simulated data generators for demo purposes
  private generateSimulatedWeatherData(): WeatherData {
    const baseTemp = 20 + Math.random() * 15; // 20-35°C range for Kenya
    return {
      temperature: Math.round(baseTemp * 10) / 10,
      humidity: Math.round((40 + Math.random() * 40) * 10) / 10, // 40-80%
      pressure: Math.round((1010 + Math.random() * 20) * 10) / 10, // 1010-1030 hPa
      rainfall: Math.round(Math.random() * 10 * 10) / 10, // 0-10mm
      windSpeed: Math.round(Math.random() * 15 * 10) / 10, // 0-15 m/s
      windDirection: Math.round(Math.random() * 360),
      cloudCover: Math.round(Math.random() * 100),
      uvIndex: Math.round(Math.random() * 12),
      visibility: Math.round((5 + Math.random() * 15) * 10) / 10, // 5-20 km
      description: this.getRandomWeatherDescription(),
      icon: this.getRandomWeatherIcon(),
      timestamp: Date.now()
    };
  }

  private generateSimulatedForecast(): WeatherForecast[] {
    const forecast: WeatherForecast[] = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const minTemp = 18 + Math.random() * 8; // 18-26°C
      const maxTemp = minTemp + 5 + Math.random() * 10; // +5-15°C above min
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        temperature: {
          min: Math.round(minTemp * 10) / 10,
          max: Math.round(maxTemp * 10) / 10,
          avg: Math.round(((minTemp + maxTemp) / 2) * 10) / 10
        },
        humidity: Math.round((40 + Math.random() * 40) * 10) / 10,
        rainfall: Math.round(Math.random() * 15 * 10) / 10,
        description: this.getRandomWeatherDescription(),
        icon: this.getRandomWeatherIcon()
      });
    }
    
    return forecast;
  }

  private generateSimulatedHistoricalData(days: number): HistoricalWeatherData[] {
    const historical: HistoricalWeatherData[] = [];
    const today = new Date();
    
    for (let i = days; i > 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      historical.push({
        date: date.toISOString().split('T')[0],
        temperature: Math.round((20 + Math.random() * 15) * 10) / 10,
        humidity: Math.round((40 + Math.random() * 40) * 10) / 10,
        rainfall: Math.round(Math.random() * 20 * 10) / 10,
        pressure: Math.round((1010 + Math.random() * 20) * 10) / 10
      });
    }
    
    return historical;
  }

  private getRandomWeatherDescription(): string {
    const descriptions = [
      'Clear sky', 'Few clouds', 'Scattered clouds', 'Broken clouds',
      'Light rain', 'Moderate rain', 'Heavy rain', 'Thunderstorm',
      'Partly cloudy', 'Overcast'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private getRandomWeatherIcon(): string {
    const icons = ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d'];
    return icons[Math.floor(Math.random() * icons.length)];
  }

  // Transform real API data (for when you have actual API key)
  private transformWeatherData(apiData: any): WeatherData {
    return {
      temperature: apiData.main.temp,
      humidity: apiData.main.humidity,
      pressure: apiData.main.pressure,
      rainfall: apiData.rain?.['1h'] || 0,
      windSpeed: apiData.wind.speed,
      windDirection: apiData.wind.deg,
      cloudCover: apiData.clouds.all,
      uvIndex: apiData.uvi || 0,
      visibility: (apiData.visibility || 10000) / 1000,
      description: apiData.weather[0].description,
      icon: apiData.weather[0].icon,
      timestamp: apiData.dt * 1000
    };
  }

  private transformForecastData(apiData: any): WeatherForecast[] {
    return apiData.list.map((item: any) => ({
      date: new Date(item.dt * 1000).toISOString().split('T')[0],
      temperature: {
        min: item.main.temp_min,
        max: item.main.temp_max,
        avg: item.main.temp
      },
      humidity: item.main.humidity,
      rainfall: item.rain?.['3h'] || 0,
      description: item.weather[0].description,
      icon: item.weather[0].icon
    }));
  }

  private transformHistoricalData(apiData: any): HistoricalWeatherData[] {
    return apiData.hourly.map((item: any) => ({
      date: new Date(item.dt * 1000).toISOString().split('T')[0],
      temperature: item.temp,
      humidity: item.humidity,
      rainfall: item.rain?.['1h'] || 0,
      pressure: item.pressure
    }));
  }
}

// Export singleton instance
export const weatherService = new WeatherService();
