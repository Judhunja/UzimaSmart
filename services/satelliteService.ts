// NASA GIBS Satellite Service
export class SatelliteService {
  private baseUrl = 'http://localhost:8000/api/v1';

  async getNDVIData(county: string, startDate?: string, endDate?: string) {
    try {
      const params = new URLSearchParams({
        county_id: this.getCountyId(county).toString(),
        start_date: startDate || this.getLastWeek(),
        end_date: endDate || this.getToday()
      });

      const response = await fetch(`${this.baseUrl}/satellite/ndvi?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch NDVI data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching NDVI data:', error);
      return this.getMockNDVIData();
    }
  }

  async getTemperatureData(county: string, startDate?: string, endDate?: string) {
    try {
      const params = new URLSearchParams({
        county_id: this.getCountyId(county).toString(),
        start_date: startDate || this.getLastWeek(),
        end_date: endDate || this.getToday()
      });

      const response = await fetch(`${this.baseUrl}/satellite/temperature?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch temperature data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching temperature data:', error);
      return this.getMockTemperatureData();
    }
  }

  async getPrecipitationData(county: string, startDate?: string, endDate?: string) {
    try {
      const params = new URLSearchParams({
        county_id: this.getCountyId(county).toString(),
        start_date: startDate || this.getLastWeek(),
        end_date: endDate || this.getToday()
      });

      const response = await fetch(`${this.baseUrl}/satellite/precipitation?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch precipitation data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching precipitation data:', error);
      return this.getMockPrecipitationData();
    }
  }

  private getCountyId(county: string): number {
    const countyMap: { [key: string]: number } = {
      'nairobi': 1,
      'mombasa': 2,
      'kisumu': 3,
      'nakuru': 4,
      'eldoret': 5,
      'machakos': 6,
      'meru': 7,
      'nyeri': 8,
      'thika': 9,
      'malindi': 10
    };
    return countyMap[county.toLowerCase()] || 1;
  }

  private getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getLastWeek(): string {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  }

  // Mock data for fallback when API is not available
  private getMockNDVIData() {
    return {
      status: 'success',
      data: {
        ndvi_value: 0.75,
        vegetation_status: 'Healthy',
        trend: 'Improving',
        last_updated: this.getToday()
      }
    };
  }

  private getMockTemperatureData() {
    return {
      status: 'success',
      data: {
        temperature: 26.5,
        min_temp: 18.2,
        max_temp: 31.7,
        trend: 'Stable',
        last_updated: this.getToday()
      }
    };
  }

  private getMockPrecipitationData() {
    return {
      status: 'success',
      data: {
        precipitation: 15.3,
        weekly_total: 45.8,
        trend: 'Increasing',
        last_updated: this.getToday()
      }
    };
  }
}

export default new SatelliteService();
