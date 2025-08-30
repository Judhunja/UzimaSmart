/**
 * ClimateDataPanel Component - Displays climate data metrics
 */

'use client'

interface County {
  id: number
  name: string
}

interface ClimateData {
  ndvi?: any
  rainfall?: any
  temperature?: any
}

interface ClimateDataPanelProps {
  data: ClimateData
  loading: boolean
  county: County | null
}

export function ClimateDataPanel({ data, loading, county }: ClimateDataPanelProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Climate Data</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Climate Data - {county?.name}
      </h3>
      
      <div className="space-y-4">
        {/* NDVI */}
        <div className="border-b pb-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">NDVI</span>
            <span className="text-sm text-gray-500">🌱</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Vegetation Health Index</p>
          <div className="mt-2">
            {data.ndvi ? (
              <span className="text-lg font-semibold text-green-600">Available</span>
            ) : (
              <span className="text-sm text-gray-400">No data</span>
            )}
          </div>
        </div>

        {/* Rainfall */}
        <div className="border-b pb-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Rainfall</span>
            <span className="text-sm text-gray-500">🌧️</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Precipitation Data</p>
          <div className="mt-2">
            {data.rainfall ? (
              <span className="text-lg font-semibold text-blue-600">Available</span>
            ) : (
              <span className="text-sm text-gray-400">No data</span>
            )}
          </div>
        </div>

        {/* Temperature */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Temperature</span>
            <span className="text-sm text-gray-500">🌡️</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Temperature Readings</p>
          <div className="mt-2">
            {data.temperature ? (
              <span className="text-lg font-semibold text-red-600">Available</span>
            ) : (
              <span className="text-sm text-gray-400">No data</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
