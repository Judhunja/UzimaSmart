'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js'
import { Line, Bar, Doughnut, Scatter } from 'react-chartjs-2'

// Dynamic import to prevent SSR issues with Leaflet
const LeafletClimateMap = dynamic(() => import('@/components/LeafletClimateMap'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading interactive map...</p>
      </div>
    </div>
  )
})

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
)

interface MapLayer {
  id: string
  name: string
  description: string
  icon: string
  active: boolean
  color: string
  unit: string
}

interface ClimateData {
  county: string
  latitude: number
  longitude: number
  temperature: number
  rainfall: number
  humidity: number
  ndvi: number
  soilMoisture: number
  airQuality: number
  windSpeed: number
  pressure: number
  elevation: number
}

interface TimeSeriesData {
  date: string
  temperature: number
  rainfall: number
  humidity: number
  ndvi: number
  soilMoisture: number
  airQuality: number
}

interface RegionalComparison {
  county: string
  temperature: number
  rainfall: number
  ndvi: number
  population: number
  area: number
}

type TimeFrame = '7d' | '30d' | '90d' | '1y' | '5y'
type ViewMode = 'map' | 'trends' | 'comparison' | 'insights'

export default function MapsPage() {
  const [selectedCounty, setSelectedCounty] = useState('Nairobi')
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('30d')
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const [mapLayers, setMapLayers] = useState<MapLayer[]>([
    {
      id: 'rainfall',
      name: 'Rainfall',
      description: 'Current rainfall patterns and intensity',
      icon: '🌧️',
      active: true,
      color: '#3B82F6',
      unit: 'mm'
    },
    {
      id: 'temperature',
      name: 'Temperature',
      description: 'Temperature distribution across regions',
      icon: '🌡️',
      active: false,
      color: '#EF4444',
      unit: '°C'
    },
    {
      id: 'ndvi',
      name: 'Vegetation (NDVI)',
      description: 'Vegetation health and density',
      icon: '🌱',
      active: false,
      color: '#22C55E',
      unit: 'index'
    },
    {
      id: 'soil-moisture',
      name: 'Soil Moisture',
      description: 'Soil moisture levels',
      icon: '💧',
      active: false,
      color: '#06B6D4',
      unit: '%'
    },
    {
      id: 'air-quality',
      name: 'Air Quality',
      description: 'Air quality index and pollution levels',
      icon: '🌬️',
      active: false,
      color: '#A855F7',
      unit: 'AQI'
    }
  ])

  const [climateData, setClimateData] = useState<ClimateData[]>([])
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([])
  const [regionalComparison, setRegionalComparison] = useState<RegionalComparison[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data generation with all 47 Kenyan counties
  const generateClimateData = (): ClimateData[] => {
    const counties = [
      { name: 'Nairobi', lat: -1.2921, lng: 36.8219 },
      { name: 'Mombasa', lat: -4.0435, lng: 39.6682 },
      { name: 'Kwale', lat: -4.1742, lng: 39.4597 },
      { name: 'Kilifi', lat: -3.5106, lng: 39.8498 },
      { name: 'Tana River', lat: -1.8369, lng: 40.0892 },
      { name: 'Lamu', lat: -2.2717, lng: 40.9020 },
      { name: 'Taita Taveta', lat: -3.3167, lng: 38.3500 },
      { name: 'Garissa', lat: -0.4536, lng: 39.6401 },
      { name: 'Wajir', lat: 1.7471, lng: 40.0573 },
      { name: 'Mandera', lat: 3.9366, lng: 41.8669 },
      { name: 'Marsabit', lat: 2.3284, lng: 37.9901 },
      { name: 'Isiolo', lat: 0.3496, lng: 37.5820 },
      { name: 'Meru', lat: 0.0469, lng: 37.6556 },
      { name: 'Tharaka Nithi', lat: -0.1591, lng: 37.9099 },
      { name: 'Embu', lat: -0.5317, lng: 37.4502 },
      { name: 'Kitui', lat: -1.3670, lng: 38.0109 },
      { name: 'Machakos', lat: -1.5177, lng: 37.2634 },
      { name: 'Makueni', lat: -2.2769, lng: 37.6243 },
      { name: 'Nyandarua', lat: -0.3711, lng: 36.3472 },
      { name: 'Nyeri', lat: -0.4203, lng: 36.9467 },
      { name: 'Kirinyaga', lat: -0.6613, lng: 37.3072 },
      { name: 'Murang\'a', lat: -0.7210, lng: 36.9776 },
      { name: 'Kiambu', lat: -1.1742, lng: 36.8350 },
      { name: 'Turkana', lat: 3.1167, lng: 35.6000 },
      { name: 'West Pokot', lat: 1.4000, lng: 35.1167 },
      { name: 'Samburu', lat: 1.1736, lng: 36.8006 },
      { name: 'Trans Nzoia', lat: 1.0167, lng: 35.0000 },
      { name: 'Uasin Gishu', lat: 0.5143, lng: 35.2697 },
      { name: 'Elgeyo Marakwet', lat: 0.8333, lng: 35.5500 },
      { name: 'Nandi', lat: 0.1833, lng: 35.1000 },
      { name: 'Baringo', lat: 0.4667, lng: 35.9667 },
      { name: 'Laikipia', lat: 0.2167, lng: 36.7833 },
      { name: 'Nakuru', lat: -0.3031, lng: 36.0800 },
      { name: 'Narok', lat: -1.0833, lng: 35.8667 },
      { name: 'Kajiado', lat: -1.8500, lng: 36.7833 },
      { name: 'Kericho', lat: -0.3686, lng: 35.2861 },
      { name: 'Bomet', lat: -0.7833, lng: 35.3417 },
      { name: 'Kakamega', lat: 0.2827, lng: 34.7519 },
      { name: 'Vihiga', lat: 0.0667, lng: 34.7167 },
      { name: 'Bungoma', lat: 0.5635, lng: 34.5606 },
      { name: 'Busia', lat: 0.4597, lng: 34.1115 },
      { name: 'Siaya', lat: 0.0606, lng: 34.2880 },
      { name: 'Kisumu', lat: -0.0917, lng: 34.7680 },
      { name: 'Homa Bay', lat: -0.5273, lng: 34.4569 },
      { name: 'Migori', lat: -1.0634, lng: 34.4731 },
      { name: 'Kisii', lat: -0.6817, lng: 34.7683 },
      { name: 'Nyamira', lat: -0.5633, lng: 34.9358 }
    ]

    return counties.map(county => ({
      county: county.name,
      latitude: county.lat,
      longitude: county.lng,
      temperature: Math.round((18 + Math.random() * 20) * 10) / 10, // 18-38°C
      rainfall: Math.round(Math.random() * 150 * 10) / 10, // 0-150mm
      humidity: Math.round((40 + Math.random() * 50) * 10) / 10, // 40-90%
      ndvi: Math.round((0.1 + Math.random() * 0.8) * 100) / 100, // 0.1-0.9
      soilMoisture: Math.round((20 + Math.random() * 60) * 10) / 10, // 20-80%
      airQuality: Math.round(20 + Math.random() * 150), // 20-170 AQI
      windSpeed: Math.round((2 + Math.random() * 18) * 10) / 10, // 2-20 km/h
      pressure: Math.round((950 + Math.random() * 100) * 10) / 10, // 950-1050 hPa
      elevation: Math.round(Math.random() * 3000) // 0-3000m
    }))
  }

  const generateTimeSeriesData = (days: number): TimeSeriesData[] => {
    const data: TimeSeriesData[] = []
    const now = new Date()
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      data.push({
        date: date.toISOString().split('T')[0],
        temperature: Math.round((22 + Math.sin(i * 0.1) * 5 + Math.random() * 6) * 10) / 10,
        rainfall: Math.round(Math.random() * 20 * 10) / 10,
        humidity: Math.round((60 + Math.sin(i * 0.15) * 20 + Math.random() * 15) * 10) / 10,
        ndvi: Math.round((0.3 + Math.sin(i * 0.05) * 0.2 + Math.random() * 0.3) * 100) / 100,
        soilMoisture: Math.round((40 + Math.sin(i * 0.12) * 20 + Math.random() * 20) * 10) / 10,
        airQuality: Math.round(50 + Math.random() * 50)
      })
    }
    return data
  }

  const generateRegionalComparison = (): RegionalComparison[] => {
    const counties = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Meru', 'Nyeri', 'Machakos']
    return counties.map(county => ({
      county,
      temperature: Math.round((20 + Math.random() * 15) * 10) / 10,
      rainfall: Math.round(Math.random() * 100 * 10) / 10,
      ndvi: Math.round(Math.random() * 100) / 100,
      population: Math.round(50000 + Math.random() * 4000000),
      area: Math.round(1000 + Math.random() * 5000)
    }))
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setClimateData(generateClimateData())
      const days = selectedTimeFrame === '7d' ? 7 : selectedTimeFrame === '30d' ? 30 : 
                   selectedTimeFrame === '90d' ? 90 : selectedTimeFrame === '1y' ? 365 : 1825
      setTimeSeriesData(generateTimeSeriesData(days))
      setRegionalComparison(generateRegionalComparison())
      
      setLoading(false)
    }

    fetchData()
  }, [selectedCounty, selectedTimeFrame])

  const toggleLayer = (layerId: string) => {
    setMapLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, active: !layer.active } : layer
    ))
  }

  const getActiveLayerData = () => {
    const activeLayer = mapLayers.find(layer => layer.active)
    if (!activeLayer) return []
    
    return climateData.map(data => {
      let value = 0
      switch (activeLayer.id) {
        case 'rainfall': value = data.rainfall; break
        case 'temperature': value = data.temperature; break
        case 'ndvi': value = data.ndvi; break
        case 'soil-moisture': value = data.soilMoisture; break
        case 'air-quality': value = data.airQuality; break
      }
      return { ...data, value }
    })
  }

  // Chart configurations
  const getTrendsChartData = () => {
    const labels = timeSeriesData.map(d => {
      const date = new Date(d.date)
      return selectedTimeFrame === '7d' 
        ? date.toLocaleDateString('en-US', { weekday: 'short' })
        : selectedTimeFrame === '30d'
        ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    })

    const activeLayer = mapLayers.find(layer => layer.active)
    if (!activeLayer) return { labels: [], datasets: [] }

    let data: number[] = []
    let label = ''
    
    switch (activeLayer.id) {
      case 'rainfall':
        data = timeSeriesData.map(d => d.rainfall)
        label = `Rainfall (${activeLayer.unit})`
        break
      case 'temperature':
        data = timeSeriesData.map(d => d.temperature)
        label = `Temperature (${activeLayer.unit})`
        break
      case 'ndvi':
        data = timeSeriesData.map(d => d.ndvi)
        label = `NDVI (${activeLayer.unit})`
        break
      case 'soil-moisture':
        data = timeSeriesData.map(d => d.soilMoisture)
        label = `Soil Moisture (${activeLayer.unit})`
        break
      case 'air-quality':
        data = timeSeriesData.map(d => d.airQuality)
        label = `Air Quality (${activeLayer.unit})`
        break
    }

    return {
      labels,
      datasets: [{
        label,
        data,
        borderColor: activeLayer.color,
        backgroundColor: `${activeLayer.color}20`,
        fill: true,
        tension: 0.4
      }]
    }
  }

  const getComparisonChartData = () => {
    const activeLayer = mapLayers.find(layer => layer.active)
    if (!activeLayer) return { labels: [], datasets: [] }

    let data: number[] = []
    let label = ''
    
    switch (activeLayer.id) {
      case 'rainfall':
        data = regionalComparison.map(d => d.rainfall)
        label = `Rainfall (${activeLayer.unit})`
        break
      case 'temperature':
        data = regionalComparison.map(d => d.temperature)
        label = `Temperature (${activeLayer.unit})`
        break
      case 'ndvi':
        data = regionalComparison.map(d => d.ndvi)
        label = `NDVI (${activeLayer.unit})`
        break
    }

    return {
      labels: regionalComparison.map(d => d.county),
      datasets: [{
        label,
        data,
        backgroundColor: `${activeLayer.color}80`,
        borderColor: activeLayer.color,
        borderWidth: 2
      }]
    }
  }

  const getCorrelationData = () => {
    return {
      datasets: [{
        label: 'Temperature vs Rainfall',
        data: climateData.map(d => ({ x: d.temperature, y: d.rainfall })),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
      }]
    }
  }

  const getMultiLayerTrendsData = () => {
    const labels = timeSeriesData.map(d => {
      const date = new Date(d.date)
      return selectedTimeFrame === '7d' 
        ? date.toLocaleDateString('en-US', { weekday: 'short' })
        : selectedTimeFrame === '30d'
        ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    })

    return {
      labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: timeSeriesData.map(d => d.temperature),
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          yAxisID: 'y',
          tension: 0.4
        },
        {
          label: 'Rainfall (mm)',
          data: timeSeriesData.map(d => d.rainfall),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          yAxisID: 'y1',
          tension: 0.4
        },
        {
          label: 'Humidity (%)',
          data: timeSeriesData.map(d => d.humidity),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          yAxisID: 'y2',
          tension: 0.4
        }
      ]
    }
  }

  const getClimateDistributionData = () => {
    const activeLayer = mapLayers.find(layer => layer.active)
    if (!activeLayer) return { labels: [], datasets: [] }

    let data: number[] = []
    let labels: string[] = []
    
    switch (activeLayer.id) {
      case 'rainfall':
        data = climateData.map(d => d.rainfall)
        labels = climateData.map(d => d.county)
        break
      case 'temperature':
        data = climateData.map(d => d.temperature)
        labels = climateData.map(d => d.county)
        break
      case 'ndvi':
        data = climateData.map(d => d.ndvi)
        labels = climateData.map(d => d.county)
        break
      case 'soil-moisture':
        data = climateData.map(d => d.soilMoisture)
        labels = climateData.map(d => d.county)
        break
      case 'air-quality':
        data = climateData.map(d => d.airQuality)
        labels = climateData.map(d => d.county)
        break
    }

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(139, 69, 19, 0.8)'
        ],
        borderColor: activeLayer.color,
        borderWidth: 2
      }]
    }
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  }

  const multiAxisChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time Period'
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Temperature (°C)'
        },
        grid: {
          color: 'rgba(239, 68, 68, 0.1)',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Rainfall (mm)'
        },
        grid: {
          drawOnChartArea: false,
          color: 'rgba(59, 130, 246, 0.1)',
        },
      },
      y2: {
        type: 'linear' as const,
        display: false,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Humidity (%)'
        },
      },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation selectedCounty={selectedCounty} onCountyChange={setSelectedCounty} />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation selectedCounty={selectedCounty} onCountyChange={setSelectedCounty} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Advanced Climate Maps & Analytics
          </h1>
          <p className="text-xl text-gray-600">
            Interactive climate visualization and regional analysis for Kenya
          </p>
        </div>

        {/* View Mode Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex space-x-2">
              {(['map', 'trends', 'comparison', 'insights'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {mode === 'map' ? '🗺️ Interactive Map' : 
                   mode === 'trends' ? '📈 Trends Analysis' :
                   mode === 'comparison' ? '📊 Regional Comparison' : 
                   '🔍 Climate Insights'}
                </button>
              ))}
            </div>
            
            <div className="flex space-x-4">
              <select 
                value={selectedTimeFrame} 
                onChange={(e) => setSelectedTimeFrame(e.target.value as TimeFrame)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
                <option value="5y">Last 5 Years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Map Layers Control */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Climate Data Layers</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {mapLayers.map(layer => (
              <button
                key={layer.id}
                onClick={() => toggleLayer(layer.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  layer.active 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{layer.icon}</div>
                <div className="text-sm font-medium text-gray-900">{layer.name}</div>
                <div className="text-xs text-gray-600 mt-1">{layer.description}</div>
                {layer.active && (
                  <div className="mt-2 text-xs font-medium" style={{ color: layer.color }}>
                    Active Layer
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'map' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Interactive Climate Map */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Interactive Climate Map</h3>
                  <select 
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                    value={mapLayers.find(l => l.active)?.id || 'temperature'}
                    onChange={(e) => {
                      setMapLayers(prev => prev.map(layer => ({
                        ...layer,
                        active: layer.id === e.target.value
                      })))
                    }}
                  >
                    {mapLayers.map(layer => (
                      <option key={layer.id} value={layer.id}>{layer.name}</option>
                    ))}
                  </select>
                </div>
                <LeafletClimateMap 
                  data={climateData}
                  activeLayer={mapLayers.find(l => l.active)}
                  onLocationClick={(data: any) => {
                    // Handle location selection if needed
                    console.log('Selected location:', data)
                  }}
                />
              </div>

              {/* Real-time Data Summary */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Real-time Climate Data</h3>
                <div className="space-y-4">
                  {mapLayers.filter(layer => layer.active).map(layer => {
                    const data = getActiveLayerData()
                    const avgValue = data.reduce((sum, d) => sum + d.value, 0) / data.length
                    const maxValue = Math.max(...data.map(d => d.value))
                    const minValue = Math.min(...data.map(d => d.value))
                    
                    return (
                      <div key={layer.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-700">{layer.name}</h4>
                          <span 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: layer.color }}
                          ></span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500">Average</div>
                            <div className="font-semibold">{avgValue.toFixed(1)} {layer.unit}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Maximum</div>
                            <div className="font-semibold text-red-600">{maxValue.toFixed(1)} {layer.unit}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Minimum</div>
                            <div className="font-semibold text-blue-600">{minValue.toFixed(1)} {layer.unit}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Climate Distribution Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Climate Data Distribution</h3>
              <div className="h-64">
                <Bar data={getClimateDistributionData()} options={chartOptions} />
              </div>
            </div>
          </div>
        )}

        {viewMode === 'trends' && (
          <div className="space-y-6">
            {/* Trends Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {mapLayers.find(l => l.active)?.name || 'Climate'} Trends - {selectedTimeFrame}
              </h3>
              <div className="h-80">
                <Line data={getTrendsChartData()} options={chartOptions} />
              </div>
            </div>

            {/* Multiple Parameter Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Multi-Parameter Trends</h3>
                <div className="h-64">
                  <Line data={getMultiLayerTrendsData()} options={multiAxisChartOptions} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Temperature vs Rainfall Correlation</h3>
                <div className="h-64">
                  <Scatter 
                    data={getCorrelationData()} 
                    options={{
                      ...chartOptions,
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Temperature (°C)'
                          }
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Rainfall (mm)'
                          }
                        }
                      }
                    }} 
                  />
                </div>
              </div>
            </div>

            {/* Trend Analysis Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Analysis Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900">Temperature Trend</h4>
                  <p className="text-2xl font-bold text-blue-700">
                    {timeSeriesData.length > 1 
                      ? (timeSeriesData[timeSeriesData.length - 1].temperature - timeSeriesData[0].temperature > 0 ? '+' : '')
                      + (timeSeriesData[timeSeriesData.length - 1].temperature - timeSeriesData[0].temperature).toFixed(1)
                      : '0'
                    }°C
                  </p>
                  <p className="text-sm text-blue-600">Change over period</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900">Rainfall Trend</h4>
                  <p className="text-2xl font-bold text-green-700">
                    {timeSeriesData.reduce((sum, d) => sum + d.rainfall, 0).toFixed(1)}mm
                  </p>
                  <p className="text-sm text-green-600">Total rainfall</p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900">NDVI Average</h4>
                  <p className="text-2xl font-bold text-purple-700">
                    {timeSeriesData.length > 0 
                      ? (timeSeriesData.reduce((sum, d) => sum + d.ndvi, 0) / timeSeriesData.length).toFixed(3)
                      : '0'
                    }
                  </p>
                  <p className="text-sm text-purple-600">Vegetation index</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'comparison' && (
          <div className="space-y-6">
            {/* Regional Comparison Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Regional {mapLayers.find(l => l.active)?.name || 'Climate'} Comparison
              </h3>
              <div className="h-80">
                <Bar data={getComparisonChartData()} options={chartOptions} />
              </div>
            </div>

            {/* Detailed Comparison Table */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Regional Analysis</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">County</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature (°C)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rainfall (mm)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NDVI</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Population</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area (km²)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {regionalComparison.map((region, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{region.county}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{region.temperature.toFixed(1)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{region.rainfall.toFixed(1)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{region.ndvi.toFixed(3)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{region.population.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{region.area.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'insights' && (
          <div className="space-y-6">
            {/* Climate Insights Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <h4 className="font-semibold mb-2">Climate Trend</h4>
                <div className="text-3xl font-bold mb-1">
                  {timeSeriesData.length > 1 && timeSeriesData[timeSeriesData.length - 1].temperature > timeSeriesData[0].temperature ? '📈' : '📉'}
                </div>
                <p className="text-sm opacity-90">
                  {timeSeriesData.length > 1 && timeSeriesData[timeSeriesData.length - 1].temperature > timeSeriesData[0].temperature 
                    ? 'Warming trend detected' 
                    : 'Cooling trend detected'}
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                <h4 className="font-semibold mb-2">Rainfall Status</h4>
                <div className="text-3xl font-bold mb-1">
                  {timeSeriesData.reduce((sum, d) => sum + d.rainfall, 0) / timeSeriesData.length > 15 ? '💧' : '🌵'}
                </div>
                <p className="text-sm opacity-90">
                  {timeSeriesData.reduce((sum, d) => sum + d.rainfall, 0) / timeSeriesData.length > 15 
                    ? 'Above average rainfall' 
                    : 'Below average rainfall'}
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <h4 className="font-semibold mb-2">Vegetation Health</h4>
                <div className="text-3xl font-bold mb-1">
                  {timeSeriesData.reduce((sum, d) => sum + d.ndvi, 0) / timeSeriesData.length > 0.5 ? '🌱' : '🍂'}
                </div>
                <p className="text-sm opacity-90">
                  {timeSeriesData.reduce((sum, d) => sum + d.ndvi, 0) / timeSeriesData.length > 0.5 
                    ? 'Healthy vegetation' 
                    : 'Stressed vegetation'}
                </p>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                <h4 className="font-semibold mb-2">Air Quality</h4>
                <div className="text-3xl font-bold mb-1">
                  {timeSeriesData.reduce((sum, d) => sum + d.airQuality, 0) / timeSeriesData.length < 50 ? '✅' : '⚠️'}
                </div>
                <p className="text-sm opacity-90">
                  {timeSeriesData.reduce((sum, d) => sum + d.airQuality, 0) / timeSeriesData.length < 50 
                    ? 'Good air quality' 
                    : 'Moderate air quality'}
                </p>
              </div>
            </div>

            {/* Detailed Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Climate Analysis Summary</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-900">Temperature Patterns</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Average temperature over the selected period is{' '}
                      {timeSeriesData.length > 0 
                        ? (timeSeriesData.reduce((sum, d) => sum + d.temperature, 0) / timeSeriesData.length).toFixed(1)
                        : '0'}°C. 
                      {timeSeriesData.length > 1 && 
                        (timeSeriesData[timeSeriesData.length - 1].temperature > timeSeriesData[0].temperature 
                          ? ' An increasing trend suggests warming conditions.' 
                          : ' A decreasing trend suggests cooling conditions.')}
                    </p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium text-gray-900">Precipitation Analysis</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Total rainfall recorded is {timeSeriesData.reduce((sum, d) => sum + d.rainfall, 0).toFixed(1)}mm.
                      {timeSeriesData.reduce((sum, d) => sum + d.rainfall, 0) / timeSeriesData.length > 15 
                        ? ' Rainfall levels are adequate for agricultural activities.'
                        : ' Low rainfall may impact crop yields and water resources.'}
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-medium text-gray-900">Vegetation Index</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Average NDVI is{' '}
                      {timeSeriesData.length > 0 
                        ? (timeSeriesData.reduce((sum, d) => sum + d.ndvi, 0) / timeSeriesData.length).toFixed(3)
                        : '0'}.
                      {timeSeriesData.reduce((sum, d) => sum + d.ndvi, 0) / timeSeriesData.length > 0.5 
                        ? ' Vegetation appears healthy and dense.'
                        : ' Vegetation shows signs of stress or sparsity.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 flex items-center">
                      🌡️ Temperature Management
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {timeSeriesData.length > 1 && timeSeriesData[timeSeriesData.length - 1].temperature > timeSeriesData[0].temperature
                        ? 'Consider heat-resistant crop varieties and improved irrigation systems.'
                        : 'Monitor for potential frost damage and cold-sensitive crops.'}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 flex items-center">
                      💧 Water Management
                    </h4>
                    <p className="text-sm text-green-700 mt-1">
                      {timeSeriesData.reduce((sum, d) => sum + d.rainfall, 0) / timeSeriesData.length > 15
                        ? 'Implement rainwater harvesting to maximize water storage.'
                        : 'Focus on water conservation and drought-resistant practices.'}
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 flex items-center">
                      🌱 Agricultural Planning
                    </h4>
                    <p className="text-sm text-purple-700 mt-1">
                      {timeSeriesData.reduce((sum, d) => sum + d.ndvi, 0) / timeSeriesData.length > 0.5
                        ? 'Optimal conditions for crop growth. Consider expanding cultivation areas.'
                        : 'Focus on soil improvement and sustainable farming practices.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Predictive Insights */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Predictive Climate Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">🔮</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Next Month Outlook</h4>
                  <p className="text-sm text-gray-600">
                    Based on current trends, expect{' '}
                    {timeSeriesData.length > 1 && timeSeriesData[timeSeriesData.length - 1].temperature > timeSeriesData[0].temperature
                      ? 'continued warming with potential heat stress'
                      : 'stable to cooling temperatures'}
                    {' '}and{' '}
                    {timeSeriesData.reduce((sum, d) => sum + d.rainfall, 0) / timeSeriesData.length > 15
                      ? 'adequate precipitation levels'
                      : 'below-average rainfall patterns'}.
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-4xl mb-2">⚠️</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Risk Assessment</h4>
                  <p className="text-sm text-gray-600">
                    {timeSeriesData.reduce((sum, d) => sum + d.rainfall, 0) / timeSeriesData.length < 10
                      ? 'High drought risk - implement water conservation measures'
                      : timeSeriesData.reduce((sum, d) => sum + d.rainfall, 0) / timeSeriesData.length > 30
                      ? 'Flood risk possible - prepare drainage systems'
                      : 'Moderate climate conditions - maintain current practices'}.
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-4xl mb-2">📅</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Planning Horizon</h4>
                  <p className="text-sm text-gray-600">
                    Optimal planting window is{' '}
                    {timeSeriesData.reduce((sum, d) => sum + d.rainfall, 0) / timeSeriesData.length > 15
                      ? 'currently open - proceed with seasonal crops'
                      : 'limited - consider drought-resistant varieties or wait for better conditions'}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
