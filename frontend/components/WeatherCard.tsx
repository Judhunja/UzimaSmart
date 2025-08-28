'use client'

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  description: string
}

interface WeatherCardProps {
  data: WeatherData | null
  county: string
}

export default function WeatherCard({ data, county }: WeatherCardProps) {
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Current Weather</h3>
        <span className="text-2xl">🌤️</span>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-3xl font-bold text-gray-900">{data.temperature}°C</span>
          <span className="text-gray-600">{data.description}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <span>💧</span>
            <span>Humidity: {data.humidity}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>💨</span>
            <span>Wind: {data.windSpeed} km/h</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mt-4">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
