/**
 * HistoricalTrends Component - Shows historical climate trends and patterns
 */

'use client'

import { useState, useEffect } from 'react'

interface HistoricalTrendsProps {
  countyId: number
}

interface TrendData {
  year: number
  rainfall: number
  temperature: number
  ndvi: number
}

interface TrendsAnalysis {
  rainfallTrend: 'increasing' | 'decreasing' | 'stable'
  temperatureTrend: 'increasing' | 'decreasing' | 'stable'
  ndviTrend: 'increasing' | 'decreasing' | 'stable'
  data: TrendData[]
}

export function HistoricalTrends({ countyId }: HistoricalTrendsProps) {
  const [trendsData, setTrendsData] = useState<TrendsAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<'rainfall' | 'temperature' | 'ndvi'>('rainfall')

  useEffect(() => {
    loadTrendsData()
  }, [countyId])

  const loadTrendsData = async () => {
    setLoading(true)
    try {
      // Simulate API call - replace with actual historical data API
      setTimeout(() => {
        setTrendsData({
          rainfallTrend: 'decreasing',
          temperatureTrend: 'increasing',
          ndviTrend: 'decreasing',
          data: [
            { year: 2020, rainfall: 850, temperature: 22.5, ndvi: 0.65 },
            { year: 2021, rainfall: 780, temperature: 23.1, ndvi: 0.62 },
            { year: 2022, rainfall: 720, temperature: 23.8, ndvi: 0.58 },
            { year: 2023, rainfall: 690, temperature: 24.2, ndvi: 0.55 },
            { year: 2024, rainfall: 650, temperature: 24.8, ndvi: 0.52 },
          ]
        })
        setLoading(false)
      }, 1200)
    } catch (error) {
      console.error('Error loading trends data:', error)
      setLoading(false)
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '📈'
      case 'decreasing': return '📉'
      case 'stable': return '➡️'
      default: return '❓'
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-600'
      case 'decreasing': return 'text-red-600'
      case 'stable': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getMetricUnit = (metric: string) => {
    switch (metric) {
      case 'rainfall': return 'mm'
      case 'temperature': return '°C'
      case 'ndvi': return ''
      default: return ''
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Historical Trends</h2>
        <div className="animate-pulse space-y-6">
          <div className="flex space-x-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded flex-1"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!trendsData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Historical Trends</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📈</div>
          <p className="text-gray-500">No historical data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Historical Trends (2020-2024)</h2>
      
      {/* Trend Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900">Rainfall</h3>
              <p className={`text-sm font-medium ${getTrendColor(trendsData.rainfallTrend)}`}>
                {trendsData.rainfallTrend.charAt(0).toUpperCase() + trendsData.rainfallTrend.slice(1)}
              </p>
            </div>
            <div className="text-2xl">{getTrendIcon(trendsData.rainfallTrend)}</div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-red-900">Temperature</h3>
              <p className={`text-sm font-medium ${getTrendColor(trendsData.temperatureTrend)}`}>
                {trendsData.temperatureTrend.charAt(0).toUpperCase() + trendsData.temperatureTrend.slice(1)}
              </p>
            </div>
            <div className="text-2xl">{getTrendIcon(trendsData.temperatureTrend)}</div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-green-900">Vegetation (NDVI)</h3>
              <p className={`text-sm font-medium ${getTrendColor(trendsData.ndviTrend)}`}>
                {trendsData.ndviTrend.charAt(0).toUpperCase() + trendsData.ndviTrend.slice(1)}
              </p>
            </div>
            <div className="text-2xl">{getTrendIcon(trendsData.ndviTrend)}</div>
          </div>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {[
            { key: 'rainfall', label: 'Rainfall (mm)', color: 'blue' },
            { key: 'temperature', label: 'Temperature (°C)', color: 'red' },
            { key: 'ndvi', label: 'Vegetation Index', color: 'green' }
          ].map((metric) => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedMetric === metric.key
                  ? `bg-${metric.color}-100 text-${metric.color}-700 border-${metric.color}-300`
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              } border`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* Simple Data Visualization */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Trend
        </h3>
        
        <div className="space-y-3">
          {trendsData.data.map((item, index) => {
            const value = item[selectedMetric]
            const maxValue = Math.max(...trendsData.data.map(d => d[selectedMetric]))
            const minValue = Math.min(...trendsData.data.map(d => d[selectedMetric]))
            const percentage = ((value - minValue) / (maxValue - minValue)) * 100
            
            return (
              <div key={item.year} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium text-gray-700">
                  {item.year}
                </div>
                <div className="flex-1 bg-white rounded-full h-6 relative">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedMetric === 'rainfall' ? 'bg-blue-500' :
                      selectedMetric === 'temperature' ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-end pr-2">
                    <span className="text-xs font-medium text-gray-700">
                      {typeof value === 'number' ? value.toFixed(selectedMetric === 'ndvi' ? 2 : 0) : value}
                      {getMetricUnit(selectedMetric)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p>* Data shown is simulated for demonstration purposes</p>
        </div>
      </div>
    </div>
  )
}
