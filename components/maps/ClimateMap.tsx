'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { AIInsights } from '@/components/insights/AIInsights'

// Dynamically import Leaflet to avoid SSR issues
const DynamicMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  )
})

interface CountyData {
  id: string
  name: string
  capital: string
  coordinates: [number, number]
  population: number
  area_km2: number
  climate_zone: string
  currentTemp?: number
  rainfall?: number
  alerts?: number
}

interface MapFilters {
  showAlerts: boolean
  showWeatherStations: boolean
  climateZone: string
  dataLayer: 'temperature' | 'rainfall' | 'ndvi' | 'alerts'
}

export function ClimateMap() {
  const [counties, setCounties] = useState<CountyData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<MapFilters>({
    showAlerts: true,
    showWeatherStations: false,
    climateZone: 'all',
    dataLayer: 'temperature'
  })

  useEffect(() => {
    const fetchCounties = async () => {
      try {
        const response = await fetch('/api/v1/climate/counties')
        if (!response.ok) {
          throw new Error('Failed to fetch counties')
        }
        const data = await response.json()
        
        // Transform backend data to include mock climate data
        const countiesWithClimateData = data.counties.map((county: any) => ({
          ...county,
          coordinates: [county.coordinates.lat, county.coordinates.lng] as [number, number],
          currentTemp: Math.round(20 + Math.random() * 15), // 20-35°C
          rainfall: Math.round(Math.random() * 200), // 0-200mm
          alerts: Math.floor(Math.random() * 5) // 0-4 alerts
        }))
        
        setCounties(countiesWithClimateData)
      } catch (err) {
        console.error('Error fetching counties:', err)
        setError('Failed to load county data')
        
        // Fallback to mock data
        setCounties([
          {
            id: '1',
            name: 'Nairobi',
            capital: 'Nairobi',
            coordinates: [-1.2921, 36.8219],
            population: 4397073,
            area_km2: 696,
            climate_zone: 'Temperate',
            currentTemp: 24,
            rainfall: 85,
            alerts: 2
          },
          {
            id: '2', 
            name: 'Mombasa',
            capital: 'Mombasa',
            coordinates: [-4.0435, 39.6682],
            population: 1208333,
            area_km2: 230,
            climate_zone: 'Coastal',
            currentTemp: 28,
            rainfall: 45,
            alerts: 1
          },
          {
            id: '3',
            name: 'Kisumu',
            capital: 'Kisumu',
            coordinates: [-0.0917, 34.7680],
            population: 1155574,
            area_km2: 2086,
            climate_zone: 'Lake Victoria Basin',
            currentTemp: 26,
            rainfall: 120,
            alerts: 0
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCounties()
  }, [])

  const climateZones = ['all', 'Arid', 'Semi-Arid', 'Temperate', 'Coastal', 'Highland', 'Lake Victoria Basin']

  const filteredCounties = counties.filter(county => {
    if (filters.climateZone !== 'all' && county.climate_zone !== filters.climateZone) {
      return false
    }
    return true
  })

  const getDataValue = (county: CountyData) => {
    switch (filters.dataLayer) {
      case 'temperature':
        return county.currentTemp || 0
      case 'rainfall':
        return county.rainfall || 0
      case 'ndvi':
        return Math.random() * 100 // Mock NDVI data
      case 'alerts':
        return county.alerts || 0
      default:
        return 0
    }
  }

  const getColorByValue = (value: number, layer: string) => {
    switch (layer) {
      case 'temperature':
        if (value < 20) return '#3b82f6' // Blue - Cool
        if (value < 25) return '#10b981' // Green - Moderate  
        if (value < 30) return '#f59e0b' // Orange - Warm
        return '#ef4444' // Red - Hot
      case 'rainfall':
        if (value < 50) return '#fef3c7' // Light yellow - Low
        if (value < 100) return '#60a5fa' // Blue - Moderate
        if (value < 150) return '#3b82f6' // Darker blue - High
        return '#1e40af' // Navy - Very high
      case 'alerts':
        if (value === 0) return '#10b981' // Green - No alerts
        if (value <= 2) return '#f59e0b' // Orange - Few alerts
        return '#ef4444' // Red - Many alerts
      default:
        return '#6b7280' // Gray
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Map Controls */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Kenya Climate Map</h3>
          
          {/* Data Layer Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Layer:</label>
            <select
              value={filters.dataLayer}
              onChange={(e) => setFilters(prev => ({ ...prev, dataLayer: e.target.value as any }))}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              <option value="temperature">Temperature</option>
              <option value="rainfall">Rainfall</option>
              <option value="ndvi">Vegetation (NDVI)</option>
              <option value="alerts">Alerts</option>
            </select>
          </div>

          {/* Climate Zone Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Climate Zone:</label>
            <select
              value={filters.climateZone}
              onChange={(e) => setFilters(prev => ({ ...prev, climateZone: e.target.value }))}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              {climateZones.map(zone => (
                <option key={zone} value={zone}>
                  {zone === 'all' ? 'All Zones' : zone}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle Controls */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={filters.showAlerts}
                onChange={(e) => setFilters(prev => ({ ...prev, showAlerts: e.target.checked }))}
                className="mr-2"
              />
              Show Alerts
            </label>
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={filters.showWeatherStations}
                onChange={(e) => setFilters(prev => ({ ...prev, showWeatherStations: e.target.checked }))}
                className="mr-2"
              />
              Weather Stations
            </label>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-96 lg:h-[500px]">
        {error ? (
          <div className="h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="text-red-600 mb-2">Failed to load map data</div>
              <button 
                onClick={() => window.location.reload()}
                className="text-blue-600 hover:text-blue-700"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <DynamicMap
            counties={filteredCounties}
            filters={filters}
            getDataValue={getDataValue}
            getColorByValue={getColorByValue}
          />
        )}
      </div>

      {/* Legend */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700">
              {filters.dataLayer.charAt(0).toUpperCase() + filters.dataLayer.slice(1)} Data
            </span>
            <span className="text-xs text-gray-500 ml-2">
              ({filteredCounties.length} counties shown)
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Low</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Moderate</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>High</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Critical</span>
            </div>
          </div>
        </div>

        {/* AI Climate Change Adaptation Insights */}
        <div className="mt-4">
          <AIInsights
            data={{
              type: filters.dataLayer,
              values: filteredCounties.map(county => getDataValue(county)),
              location: filters.climateZone === 'all' ? 'Kenya' : `${filters.climateZone} Climate Zone`,
              timeframe: 'current',
              metadata: {
                dataLayer: filters.dataLayer,
                climateZone: filters.climateZone,
                countiesCount: filteredCounties.length,
                averageValue: filteredCounties.length > 0 
                  ? (filteredCounties.reduce((sum, county) => sum + getDataValue(county), 0) / filteredCounties.length).toFixed(1)
                  : 0,
                adaptationContext: 'climate resilience strategies'
              }
            }}
            title={`Climate Adaptation Insights: ${filters.dataLayer.charAt(0).toUpperCase() + filters.dataLayer.slice(1)}`}
          />
        </div>
      </div>
    </div>
  )
}
