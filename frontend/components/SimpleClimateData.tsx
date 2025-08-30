'use client'

interface SimpleClimateDataProps {
  data: any
  county: string
}

export default function SimpleClimateData({ data, county }: SimpleClimateDataProps) {
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        🌡️ Climate Data - {county.charAt(0).toUpperCase() + county.slice(1)}
      </h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Temperature</span>
          <span className="text-lg font-bold text-blue-600">
            {data.temperature?.toFixed(1)}°C
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Humidity</span>
          <span className="text-lg font-bold text-green-600">
            {data.humidity?.toFixed(0)}%
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Rainfall</span>
          <span className="text-lg font-bold text-purple-600">
            {data.rainfall?.toFixed(1)}mm
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Wind Speed</span>
          <span className="text-lg font-bold text-orange-600">
            {data.windSpeed?.toFixed(1)} m/s
          </span>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        Last updated: {new Date(data.timestamp).toLocaleString()}
      </div>
    </div>
  )
}
