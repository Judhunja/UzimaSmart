'use client'

interface ClimateDataCardProps {
  county: string
}

export default function ClimateDataCard({ county }: ClimateDataCardProps) {
  // Mock climate data
  const climateData = {
    rainfall: 45.2,
    temperature: 24.5,
    ndvi: 0.65,
    soilMoisture: 35
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Climate Data</h3>
        <span className="text-2xl">📊</span>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span>🌧️</span>
            <span className="text-sm">Rainfall</span>
          </div>
          <span className="font-semibold">{climateData.rainfall}mm</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span>🌡️</span>
            <span className="text-sm">Avg Temperature</span>
          </div>
          <span className="font-semibold">{climateData.temperature}°C</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span>🌱</span>
            <span className="text-sm">Vegetation Index</span>
          </div>
          <span className="font-semibold">{climateData.ndvi}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span>💧</span>
            <span className="text-sm">Soil Moisture</span>
          </div>
          <span className="font-semibold">{climateData.soilMoisture}%</span>
        </div>
      </div>
      
      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800">
        View Detailed Analysis →
      </button>
    </div>
  )
}
