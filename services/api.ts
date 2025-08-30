/**
 * Climate API Service - Handles all API calls to the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface County {
  id: number
  name: string
}

interface ClimateDataResponse {
  data: {
    ndvi?: any
    rainfall?: any
    temperature?: any
  }
}

interface CountiesResponse {
  counties: County[]
}

class ClimateAPI {
  private async fetchAPI(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getCounties(): Promise<CountiesResponse> {
    try {
      return await this.fetchAPI('/api/counties')
    } catch (error) {
      console.error('Error fetching counties:', error)
      // Return mock data for now
      return {
        counties: [
          { id: 1, name: 'Nairobi' },
          { id: 2, name: 'Mombasa' },
          { id: 3, name: 'Kisumu' },
          { id: 4, name: 'Nakuru' },
          { id: 5, name: 'Eldoret' },
          { id: 6, name: 'Meru' },
          { id: 7, name: 'Nyeri' },
          { id: 8, name: 'Machakos' },
          { id: 9, name: 'Kilifi' },
          { id: 10, name: 'Garissa' }
        ]
      }
    }
  }

  async getCountyClimateData(
    countyId: number,
    startDate: string,
    endDate: string,
    metrics: string
  ): Promise<ClimateDataResponse> {
    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        metrics
      })
      
      return await this.fetchAPI(`/api/counties/${countyId}/climate-data?${params}`)
    } catch (error) {
      console.error('Error fetching climate data:', error)
      // Return mock data for now
      return {
        data: {
          ndvi: { value: 0.65, status: 'available' },
          rainfall: { value: 45.2, unit: 'mm', status: 'available' },
          temperature: { value: 24.5, unit: 'celsius', status: 'available' }
        }
      }
    }
  }

  async submitReport(reportData: any): Promise<{ success: boolean; id?: number }> {
    try {
      return await this.fetchAPI('/api/reports', {
        method: 'POST',
        body: JSON.stringify(reportData),
      })
    } catch (error) {
      console.error('Error submitting report:', error)
      // Simulate success for now
      return { success: true, id: Math.floor(Math.random() * 1000) }
    }
  }

  async getReports(countyId?: number): Promise<{ reports: any[] }> {
    try {
      const endpoint = countyId ? `/api/reports?county_id=${countyId}` : '/api/reports'
      return await this.fetchAPI(endpoint)
    } catch (error) {
      console.error('Error fetching reports:', error)
      // Return mock data for now
      return {
        reports: [
          {
            id: 1,
            type: 'Drought',
            description: 'Severe water shortage affecting local farmers',
            location: 'Kibera',
            severity: 'high',
            submittedAt: '2025-08-26T10:30:00Z'
          }
        ]
      }
    }
  }

  async getWeatherAlerts(countyId?: number): Promise<{ alerts: any[] }> {
    try {
      const endpoint = countyId ? `/api/alerts?county_id=${countyId}` : '/api/alerts'
      return await this.fetchAPI(endpoint)
    } catch (error) {
      console.error('Error fetching weather alerts:', error)
      // Return mock data for now
      return {
        alerts: [
          {
            id: 1,
            type: 'warning',
            severity: 'high',
            title: 'Drought Warning',
            description: 'Extended dry period expected',
            issuedAt: '2025-08-27T08:00:00Z',
            expiresAt: '2025-09-03T08:00:00Z'
          }
        ]
      }
    }
  }

  async getDroughtAnalysis(countyId: number): Promise<any> {
    try {
      return await this.fetchAPI(`/api/counties/${countyId}/drought-analysis`)
    } catch (error) {
      console.error('Error fetching drought analysis:', error)
      // Return mock data for now
      return {
        currentLevel: 'moderate',
        riskScore: 65,
        lastRainfall: '2025-08-15',
        soilMoisture: 35,
        vegetationHealth: 40,
        historicalAverage: 75
      }
    }
  }

  async getHistoricalTrends(countyId: number): Promise<any> {
    try {
      return await this.fetchAPI(`/api/counties/${countyId}/historical-trends`)
    } catch (error) {
      console.error('Error fetching historical trends:', error)
      // Return mock data for now
      return {
        rainfallTrend: 'decreasing',
        temperatureTrend: 'increasing',
        ndviTrend: 'decreasing',
        data: [
          { year: 2020, rainfall: 850, temperature: 22.5, ndvi: 0.65 },
          { year: 2021, rainfall: 780, temperature: 23.1, ndvi: 0.62 },
          { year: 2022, rainfall: 720, temperature: 23.8, ndvi: 0.58 },
          { year: 2023, rainfall: 690, temperature: 24.2, ndvi: 0.55 },
          { year: 2024, rainfall: 650, temperature: 24.8, ndvi: 0.52 },
        ]
      }
    }
  }
}

export const climateAPI = new ClimateAPI()
