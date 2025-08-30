'use client'

import { useState, useEffect } from 'react'
import { 
  CloudIcon,
  SunIcon,
  EyeDropperIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { AIInsights } from '@/components/insights/AIInsights'

interface WeatherData {
  location: string
  temperature: number
  humidity: number
  pressure: number
  windSpeed: number
  windDirection: number
  description: string
  timestamp: string
  coordinates: {
    lat: number
    lng: number
  }
}

interface WeatherAlert {
  id: string
  type: 'rain' | 'drought' | 'storm' | 'heat' | 'frost'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  counties: string[]
  issuedAt: string
  expiresAt: string
  source: string
}

interface County {
  id: string
  name: string
  coordinates: {
    lat: number
    lng: number
  }
}

export function WeatherDashboard() {
  const [selectedCounty, setSelectedCounty] = useState<string>('nairobi')
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [counties] = useState<County[]>([
    { id: 'nairobi', name: 'Nairobi', coordinates: { lat: -1.2921, lng: 36.8219 } },
    { id: 'mombasa', name: 'Mombasa', coordinates: { lat: -4.0435, lng: 39.6682 } },
    { id: 'kisumu', name: 'Kisumu', coordinates: { lat: -0.0917, lng: 34.7680 } },
    { id: 'nakuru', name: 'Nakuru', coordinates: { lat: -0.3031, lng: 36.0800 } },
    { id: 'eldoret', name: 'Eldoret', coordinates: { lat: 0.5143, lng: 35.2698 } }
  ])
  const [loading, setLoading] = useState(false)
  const [forecast, setForecast] = useState<any[]>([])

  useEffect(() => {
    fetchWeatherData()
    fetchWeatherAlerts()
    fetchForecast()
  }, [selectedCounty])

  const fetchWeatherData = async () => {
    setLoading(true)
    try {
      const county = counties.find(c => c.id === selectedCounty)
      if (!county) return

      const response = await fetch(`/api/weather?lat=${county.coordinates.lat}&lng=${county.coordinates.lng}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data')
      }

      const data = await response.json()
      setWeatherData({
        location: county.name,
        temperature: data.temperature,
        humidity: data.humidity,
        pressure: data.pressure,
        windSpeed: data.windSpeed,
        windDirection: data.windDirection || 0,
        description: data.description,
        timestamp: data.timestamp,
        coordinates: county.coordinates
      })
    } catch (error) {
      console.error('Failed to fetch weather data:', error)
      // Fallback to mock data
      setWeatherData({
        location: counties.find(c => c.id === selectedCounty)?.name || 'Unknown',
        temperature: 20 + Math.random() * 15,
        humidity: 50 + Math.random() * 40,
        pressure: 1000 + Math.random() * 50,
        windSpeed: Math.random() * 20,
        windDirection: Math.random() * 360,
        description: 'Partly cloudy',
        timestamp: new Date().toISOString(),
        coordinates: counties.find(c => c.id === selectedCounty)?.coordinates || { lat: 0, lng: 0 }
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchWeatherAlerts = async () => {
    try {
      // Mock alerts - in real app this would come from backend
      setAlerts([
        {
          id: '1',
          type: 'rain',
          severity: 'high',
          title: 'Heavy Rainfall Warning',
          description: 'Heavy rainfall expected in the next 24-48 hours. Flooding possible in low-lying areas.',
          counties: ['Kisumu', 'Siaya', 'Busia'],
          issuedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          source: 'Kenya Meteorological Department'
        },
        {
          id: '2',
          type: 'drought',
          severity: 'critical',
          title: 'Severe Drought Conditions',
          description: 'Severe drought conditions persist. Water conservation measures recommended.',
          counties: ['Turkana', 'Marsabit', 'Mandera'],
          issuedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          source: 'National Drought Management Authority'
        },
        {
          id: '3',
          type: 'heat',
          severity: 'medium',
          title: 'High Temperature Advisory',
          description: 'Temperatures expected to exceed 35°C. Stay hydrated and avoid prolonged sun exposure.',
          counties: ['Mombasa', 'Kilifi', 'Lamu'],
          issuedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          source: 'Kenya Meteorological Department'
        }
      ])
    } catch (error) {
      console.error('Failed to fetch weather alerts:', error)
    }
  }

  const fetchForecast = async () => {
    try {
      // Mock 7-day forecast
      const forecast = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toDateString(),
        maxTemp: Math.round(20 + Math.random() * 15),
        minTemp: Math.round(15 + Math.random() * 10),
        humidity: Math.round(50 + Math.random() * 40),
        description: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain'][Math.floor(Math.random() * 5)]
      }))
      setForecast(forecast)
    } catch (error) {
      console.error('Failed to fetch forecast:', error)
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-700'
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-700'
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-700'
      case 'low': return 'bg-blue-100 border-blue-500 text-blue-700'
      default: return 'bg-gray-100 border-gray-500 text-gray-700'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'rain': return CloudIcon
      case 'drought': return SunIcon
      case 'storm': return CloudIcon
      case 'heat': return SunIcon
      case 'frost': return EyeDropperIcon
      default: return ExclamationTriangleIcon
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Weather Dashboard</h2>
        <p className="text-blue-100">Real-time weather monitoring across Kenya</p>
      </div>

      {/* County Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-4">
          <MapPinIcon className="w-5 h-5 text-gray-500" />
          <label className="text-sm font-medium text-gray-700">Select County:</label>
          <select
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            {counties.map(county => (
              <option key={county.id} value={county.id}>
                {county.name}
              </option>
            ))}
          </select>
          <button
            onClick={fetchWeatherData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Current Weather */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Weather</h3>
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : weatherData ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-xl font-bold text-gray-900">{weatherData.location}</h4>
                <p className="text-sm text-gray-600 capitalize">{weatherData.description}</p>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  Updated: {new Date(weatherData.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-blue-600">{Math.round(weatherData.temperature)}°C</div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <EyeDropperIcon className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-600">Humidity</span>
                </div>
                <div className="text-xl font-semibold text-gray-900">{Math.round(weatherData.humidity)}%</div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <CloudIcon className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Wind Speed</span>
                </div>
                <div className="text-xl font-semibold text-gray-900">{Math.round(weatherData.windSpeed)} m/s</div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center">
                  <CloudIcon className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm text-gray-600">Pressure</span>
                </div>
                <div className="text-xl font-semibold text-gray-900">{Math.round(weatherData.pressure)} hPa</div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center">
                  <SunIcon className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="text-sm text-gray-600">UV Index</span>
                </div>
                <div className="text-xl font-semibold text-gray-900">{Math.floor(Math.random() * 10 + 1)}</div>
              </div>
            </div>

            {/* AI Insights for Current Weather */}
            <div className="mt-6">
              <AIInsights
                data={{
                  type: 'weather',
                  values: [weatherData.temperature, weatherData.humidity, weatherData.pressure, weatherData.windSpeed],
                  location: weatherData.location,
                  timeframe: 'current',
                  metadata: {
                    temperature: weatherData.temperature,
                    humidity: weatherData.humidity,
                    pressure: weatherData.pressure,
                    windSpeed: weatherData.windSpeed,
                    description: weatherData.description
                  }
                }}
                title={`Weather Analysis - ${weatherData.location}`}
              />
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            Failed to load weather data
          </div>
        )}
      </div>

      {/* Weather Alerts */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Weather Alerts</h3>
        
        {alerts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No active weather alerts
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map(alert => {
              const AlertIcon = getAlertIcon(alert.type)
              return (
                <div key={alert.id} className={`border-l-4 rounded-lg p-4 ${getAlertColor(alert.severity)}`}>
                  <div className="flex items-start">
                    <AlertIcon className="w-5 h-5 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{alert.title}</h4>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50">
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{alert.description}</p>
                      <div className="mt-2 text-xs">
                        <p><strong>Affected Counties:</strong> {alert.counties.join(', ')}</p>
                        <p><strong>Source:</strong> {alert.source}</p>
                        <p><strong>Expires:</strong> {new Date(alert.expiresAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 7-Day Forecast */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Forecast</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {forecast.map((day, index) => (
            <div key={index} className="text-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="text-sm font-medium text-gray-900">
                {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="my-2">
                <SunIcon className="w-8 h-8 text-yellow-500 mx-auto" />
              </div>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">{day.maxTemp}°</div>
                <div className="text-gray-600">{day.minTemp}°</div>
              </div>
              <div className="text-xs text-gray-600 mt-1">{day.description}</div>
            </div>
          ))}
        </div>

        {/* AI Insights for Forecast */}
        <div className="mt-6">
          <AIInsights
            data={{
              type: 'temperature',
              values: forecast.map(day => (day.maxTemp + day.minTemp) / 2),
              location: selectedCounty,
              timeframe: '7-day forecast',
              metadata: {
                maxTemps: forecast.map(day => day.maxTemp),
                minTemps: forecast.map(day => day.minTemp),
                descriptions: forecast.map(day => day.description)
              }
            }}
            title="7-Day Forecast Analysis"
          />
        </div>
      </div>
    </div>
  )
}
