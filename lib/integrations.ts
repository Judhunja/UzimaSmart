// API utilities for UzimaSmart integrations
import axios from 'axios'

// Weather Data Integration
export class WeatherAPI {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || ''
    this.baseUrl = 'https://api.openweathermap.org/data/2.5'
  }

  async getCurrentWeather(lat: number, lng: number) {
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon: lng,
          appid: this.apiKey,
          units: 'metric'
        }
      })

      return {
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        windSpeed: response.data.wind.speed,
        description: response.data.weather[0].description,
        location: response.data.name
      }
    } catch (error) {
      console.error('Weather API error:', error)
      throw error
    }
  }

  async getWeatherForecast(lat: number, lng: number, days: number = 5) {
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat,
          lon: lng,
          appid: this.apiKey,
          units: 'metric',
          cnt: days * 8 // 8 forecasts per day (3-hour intervals)
        }
      })

      return response.data.list.map((item: any) => ({
        datetime: new Date(item.dt * 1000),
        temperature: item.main.temp,
        humidity: item.main.humidity,
        rainfall: item.rain?.['3h'] || 0,
        description: item.weather[0].description
      }))
    } catch (error) {
      console.error('Weather forecast error:', error)
      throw error
    }
  }
}

// Satellite Data Integration
export class SatelliteAPI {
  private sentinelClientId: string
  private sentinelClientSecret: string

  constructor() {
    this.sentinelClientId = process.env.SENTINEL_HUB_CLIENT_ID || ''
    this.sentinelClientSecret = process.env.SENTINEL_HUB_CLIENT_SECRET || ''
  }

  async getNDVIData(bbox: [number, number, number, number], date: string) {
    try {
      // Simplified NDVI calculation using Sentinel-2 data
      const evalscript = `
        //VERSION=3
        function setup() {
          return {
            input: ["B04", "B08"],
            output: { bands: 1, sampleType: "FLOAT32" }
          }
        }
        
        function evaluatePixel(sample) {
          let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04)
          return [ndvi]
        }
      `

      const requestBody = {
        input: {
          bounds: {
            bbox: bbox,
            properties: {
              crs: "http://www.opengis.net/def/crs/EPSG/0/4326"
            }
          },
          data: [
            {
              type: "sentinel-2-l2a",
              dataFilter: {
                timeRange: {
                  from: date,
                  to: date
                }
              }
            }
          ]
        },
        output: {
          width: 512,
          height: 512,
          responses: [
            {
              identifier: "default",
              format: {
                type: "image/tiff"
              }
            }
          ]
        },
        evalscript: evalscript
      }

      // Note: This would require proper authentication with Sentinel Hub
      // For demo purposes, return mock data
      return {
        ndvi: 0.67,
        date: date,
        confidence: 0.92,
        imageUrl: '/images/ndvi-sample.jpg'
      }
    } catch (error) {
      console.error('Satellite API error:', error)
      throw error
    }
  }

  async getLandCoverData(lat: number, lng: number) {
    // Mock implementation for land cover analysis
    return {
      primaryCover: 'Agricultural land',
      forestCover: 0.23,
      urbanCover: 0.12,
      waterCover: 0.05,
      bareEarth: 0.08,
      vegetation: 0.52
    }
  }
}

// Africa's Talking SMS Integration
export class SMSService {
  private username: string
  private apiKey: string
  private senderId: string

  constructor() {
    this.username = process.env.AFRICAS_TALKING_USERNAME || ''
    this.apiKey = process.env.AFRICAS_TALKING_API_KEY || ''
    this.senderId = process.env.AFRICAS_TALKING_SENDER_ID || 'UzimaSmart'
  }

  async sendSMS(phoneNumber: string, message: string) {
    try {
      const response = await axios.post(
        'https://api.africastalking.com/version1/messaging',
        new URLSearchParams({
          username: this.username,
          to: phoneNumber,
          message: message,
          from: this.senderId
        }),
        {
          headers: {
            'apiKey': this.apiKey,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      return response.data
    } catch (error) {
      console.error('SMS API error:', error)
      throw error
    }
  }

  async sendWeatherAlert(phoneNumber: string, weatherData: any) {
    const message = `UzimaSmart Weather Alert: ${weatherData.description}. 
    Temp: ${weatherData.temperature}°C, Humidity: ${weatherData.humidity}%. 
    Take appropriate farming precautions.`
    
    return this.sendSMS(phoneNumber, message)
  }

  async sendCropHealthAlert(phoneNumber: string, cropData: any) {
    const message = `UzimaSmart Crop Alert: ${cropData.cropType} health score is ${cropData.health}%. 
    Disease risk: ${cropData.diseaseRisk}. Check your fields and take recommended actions.`
    
    return this.sendSMS(phoneNumber, message)
  }
}

// MQTT IoT Integration
export class IoTService {
  private mqtt: any
  private client: any

  constructor() {
    // MQTT will be initialized in the client component
  }

  async connectMQTT(brokerUrl: string, options: any) {
    if (typeof window !== 'undefined') {
      const mqtt = await import('mqtt')
      this.client = mqtt.connect(brokerUrl, options)
      
      this.client.on('connect', () => {
        console.log('Connected to MQTT broker')
      })

      this.client.on('error', (error: any) => {
        console.error('MQTT connection error:', error)
      })

      return this.client
    }
  }

  subscribeToSensorData(farmerId: string, callback: (data: any) => void) {
    if (this.client) {
      const topic = `uzima/farm/${farmerId}/sensors/+`
      
      this.client.subscribe(topic, (error: any) => {
        if (error) {
          console.error('MQTT subscription error:', error)
        }
      })

      this.client.on('message', (topic: string, message: Buffer) => {
        try {
          const data = JSON.parse(message.toString())
          callback({ topic, data })
        } catch (error) {
          console.error('MQTT message parse error:', error)
        }
      })
    }
  }

  publishSensorData(farmerId: string, sensorType: string, data: any) {
    if (this.client) {
      const topic = `uzima/farm/${farmerId}/sensors/${sensorType}`
      const message = JSON.stringify({
        ...data,
        timestamp: new Date().toISOString()
      })

      this.client.publish(topic, message)
    }
  }
}

// Web3.Storage / IPFS Integration
export class IPFSService {
  private web3Storage: any
  private token: string

  constructor() {
    this.token = process.env.WEB3_STORAGE_TOKEN || ''
  }

  async initializeWeb3Storage() {
    if (typeof window !== 'undefined') {
      const { Web3Storage } = await import('web3.storage')
      this.web3Storage = new Web3Storage({ token: this.token })
    }
  }

  async storeCarbonCreditData(data: any): Promise<string> {
    await this.initializeWeb3Storage()
    
    if (!this.web3Storage) {
      throw new Error('Web3.Storage not initialized')
    }

    try {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
      const file = new File([blob], 'carbon-credit.json')
      const cid = await this.web3Storage.put([file])
      
      return cid
    } catch (error) {
      console.error('IPFS storage error:', error)
      throw error
    }
  }

  async retrieveCarbonCreditData(cid: string): Promise<any> {
    try {
      const gatewayUrl = `https://w3s.link/ipfs/${cid}/carbon-credit.json`
      const response = await fetch(gatewayUrl)
      
      if (!response.ok) {
        throw new Error('Failed to retrieve data from IPFS')
      }

      return await response.json()
    } catch (error) {
      console.error('IPFS retrieval error:', error)
      throw error
    }
  }
}

// Push Notification Service
export class PushNotificationService {
  private oneSignalAppId: string

  constructor() {
    this.oneSignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || ''
  }

  async initializeOneSignal() {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const OneSignal = (await import('react-onesignal')).default
      
      await OneSignal.init({
        appId: this.oneSignalAppId,
        safari_web_id: this.oneSignalAppId,
        notifyButton: {
          enable: true
        }
      })

      return OneSignal
    }
  }

  async sendNotification(title: string, message: string, data?: any) {
    try {
      const OneSignal = await this.initializeOneSignal()
      
      if (OneSignal) {
        await OneSignal.sendTag('notification', {
          title,
          message,
          data
        })
      }
    } catch (error) {
      console.error('Push notification error:', error)
    }
  }

  async requestPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }
}

// Export service instances
export const weatherAPI = new WeatherAPI()
export const satelliteAPI = new SatelliteAPI()
export const smsService = new SMSService()
export const iotService = new IoTService()
export const ipfsService = new IPFSService()
export const pushNotificationService = new PushNotificationService()
