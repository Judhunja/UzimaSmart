'use client'

interface SimpleMapProps {
  selectedCounty: string
  climateData: any
}

export default function SimpleMap({ selectedCounty, climateData }: SimpleMapProps) {
  const kenyaCounties = [
    { name: 'Nairobi', temp: 22, lat: -1.286389, lng: 36.817223 },
    { name: 'Mombasa', temp: 28, lat: -4.043477, lng: 39.668206 },
    { name: 'Kisumu', temp: 25, lat: -0.091702, lng: 34.767956 },
    { name: 'Nakuru', temp: 20, lat: -0.303099, lng: 36.066700 },
    { name: 'Eldoret', temp: 18, lat: 0.520160, lng: 35.269779 },
  ]

  return (
    <div className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden">
      {/* Simplified Kenya Map Visualization */}
      <div className="h-96 relative p-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Kenya Climate Map</h3>
            <p className="text-gray-600 mb-6">Interactive visualization coming soon</p>
            
            {/* County Data Display */}
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm mx-auto">
              <h4 className="font-semibold text-lg mb-4">
                📍 {selectedCounty.charAt(0).toUpperCase() + selectedCounty.slice(1)}
              </h4>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-blue-50 rounded">
                  <div className="text-2xl font-bold text-blue-600">
                    {climateData?.temperature?.toFixed(1) || '22.5'}°C
                  </div>
                  <div className="text-gray-600">Temperature</div>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="text-2xl font-bold text-green-600">
                    {climateData?.humidity?.toFixed(0) || '65'}%
                  </div>
                  <div className="text-gray-600">Humidity</div>
                </div>
                
                <div className="text-center p-3 bg-purple-50 rounded">
                  <div className="text-2xl font-bold text-purple-600">
                    {climateData?.rainfall?.toFixed(1) || '12.3'}mm
                  </div>
                  <div className="text-gray-600">Rainfall</div>
                </div>
                
                <div className="text-center p-3 bg-orange-50 rounded">
                  <div className="text-2xl font-bold text-orange-600">
                    {climateData?.windSpeed?.toFixed(1) || '8.2'}m/s
                  </div>
                  <div className="text-gray-600">Wind</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
