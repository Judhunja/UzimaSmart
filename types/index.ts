// Global type declarations for UzimaSmart PWA

declare global {
  interface Window {
    workbox?: {
      addEventListener: (event: string, callback: Function) => void
      register: () => void
      messageSkipWaiting: () => void
    }
  }
}

// Climate data types
export interface WeatherData {
  temperature: number
  humidity: number
  rainfall: number
  windSpeed: number
  pressure: number
  location: {
    lat: number
    lng: number
  }
  timestamp: Date
}

export interface CropData {
  id: string
  farmerId: string
  cropType: 'maize' | 'wheat' | 'rice' | 'beans' | 'tea' | 'coffee' | 'other'
  plantingDate: Date
  expectedHarvest: Date
  location: {
    lat: number
    lng: number
  }
  area: number // in hectares
  healthScore: number // 0-100
  yieldPrediction: number
  diseaseRisk: {
    type: string
    probability: number
    recommendations: string[]
  }[]
}

export interface CarbonCredit {
  id: string
  farmerId: string
  amount: number // in tons CO2e
  source: 'reforestation' | 'renewable_energy' | 'soil_carbon' | 'methane_reduction'
  verificationStatus: 'pending' | 'verified' | 'issued'
  tokenId?: string
  ipfsHash: string
  issuedDate?: Date
  location: {
    lat: number
    lng: number
  }
}

export interface EnergyData {
  id: string
  userId: string
  timestamp: Date
  consumption: number // in kWh
  production?: number // in kWh (for solar/renewable)
  cost: number // in KES
  source: 'grid' | 'solar' | 'wind' | 'hydro' | 'biomass'
  efficiency: number // 0-100
  forecast?: {
    nextHour: number
    nextDay: number
    nextWeek: number
  }
}

export interface ConservationAlert {
  id: string
  type: 'deforestation' | 'illegal_logging' | 'wildlife_movement' | 'fire_risk' | 'erosion'
  severity: 'low' | 'medium' | 'high' | 'critical'
  location: {
    lat: number
    lng: number
    area: number // in hectares
  }
  description: string
  detectedAt: Date
  imageUrl?: string
  actions: string[]
  status: 'active' | 'investigating' | 'resolved'
}

export interface SatelliteData {
  id: string
  source: 'landsat' | 'sentinel' | 'modis'
  timestamp: Date
  location: {
    lat: number
    lng: number
  }
  ndvi: number // Normalized Difference Vegetation Index
  evi: number // Enhanced Vegetation Index
  soilMoisture: number
  landCover: string
  imageUrl: string
}

export interface Farmer {
  id: string
  name: string
  email?: string
  phone: string
  location: {
    county: string
    subcounty: string
    ward: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  farmSize: number // in hectares
  crops: string[]
  registrationDate: Date
  carbonCredits: number
  sustainabilityScore: number
}

export interface AIModel {
  id: string
  name: string
  type: 'crop_disease' | 'yield_prediction' | 'weather_forecast' | 'carbon_estimation'
  version: string
  accuracy: number
  lastTrained: Date
  isLoaded: boolean
}

export interface IoTSensor {
  id: string
  farmerId: string
  type: 'soil_moisture' | 'temperature' | 'humidity' | 'ph' | 'light'
  location: {
    lat: number
    lng: number
  }
  value: number
  unit: string
  timestamp: Date
  batteryLevel: number
  status: 'online' | 'offline' | 'maintenance'
}

export interface NotificationPreferences {
  userId: string
  weather: boolean
  crops: boolean
  carbonCredits: boolean
  energy: boolean
  conservation: boolean
  smsEnabled: boolean
  pushEnabled: boolean
  emailEnabled: boolean
  language: 'en' | 'sw' // English or Swahili
}

export {}
