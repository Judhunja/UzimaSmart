/**
 * DroughtAnalysis Component - Drought monitoring and analysis for counties
 */

'use client'

import { useState, useEffect } from 'react'

interface DroughtAnalysisProps {
  countyId: number
}

interface DroughtData {
  currentLevel: 'none' | 'mild' | 'moderate' | 'severe' | 'extreme'
  riskScore: number
  lastRainfall: string
  soilMoisture: number
  vegetationHealth: number
  historicalAverage: number
}

export function DroughtAnalysis({ countyId }: DroughtAnalysisProps) {
  const [droughtData, setDroughtData] = useState<DroughtData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadDroughtData()
  }, [countyId])

  const loadDroughtData = async () => {
    setLoading(true)
    try {
      // Simulate API call - replace with actual drought analysis API
      setTimeout(() => {
        setDroughtData({
          currentLevel: 'moderate',
          riskScore: 65,
          lastRainfall: '2025-08-15',
          soilMoisture: 35,
          vegetationHealth: 40,
          historicalAverage: 75
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error loading drought data:', error)
      setLoading(false)
    }
  }

  const getDroughtLevelColor = (level: string) => {
    switch (level) {
      case 'none': return 'text-green-600 bg-green-100'
      case 'mild': return 'text-yellow-600 bg-yellow-100'
      case 'moderate': return 'text-orange-600 bg-orange-100'
      case 'severe': return 'text-red-600 bg-red-100'
      case 'extreme': return 'text-red-800 bg-red-200'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600'
    if (score >= 60) return 'text-orange-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-green-600'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Drought Analysis</h2>
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!droughtData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Drought Analysis</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-500">No drought data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Drought Analysis</h2>
      
      {/* Current Drought Level */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Current Drought Level</h3>
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${getDroughtLevelColor(droughtData.currentLevel)}`}>
            {droughtData.currentLevel.charAt(0).toUpperCase() + droughtData.currentLevel.slice(1)}
          </div>
          <div className={`text-2xl font-bold mt-2 ${getRiskColor(droughtData.riskScore)}`}>
            Risk Score: {droughtData.riskScore}/100
          </div>
        </div>
      </div>

      {/* Key Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">Last Rainfall</h4>
              <p className="text-sm text-blue-700">
                {new Date(droughtData.lastRainfall).toLocaleDateString()}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {Math.floor((Date.now() - new Date(droughtData.lastRainfall).getTime()) / (1000 * 60 * 60 * 24))} days ago
              </p>
            </div>
            <div className="text-2xl">🌧️</div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-amber-900">Soil Moisture</h4>
              <p className="text-sm text-amber-700">{droughtData.soilMoisture}%</p>
              <p className="text-xs text-amber-600 mt-1">of field capacity</p>
            </div>
            <div className="text-2xl">💧</div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-green-900">Vegetation Health</h4>
              <p className="text-sm text-green-700">{droughtData.vegetationHealth}%</p>
              <p className="text-xs text-green-600 mt-1">NDVI relative to normal</p>
            </div>
            <div className="text-2xl">🌱</div>
          </div>
        </div>
      </div>

      {/* Historical Comparison */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Historical Comparison</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Current conditions vs. historical average
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm">
                  <strong>Current:</strong> {droughtData.vegetationHealth}%
                </span>
                <span className="text-sm">
                  <strong>Historical Avg:</strong> {droughtData.historicalAverage}%
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-lg font-semibold ${droughtData.vegetationHealth < droughtData.historicalAverage ? 'text-red-600' : 'text-green-600'}`}>
                {droughtData.vegetationHealth < droughtData.historicalAverage ? '↓' : '↑'}
                {Math.abs(droughtData.vegetationHealth - droughtData.historicalAverage)}%
              </div>
              <p className="text-xs text-gray-500">
                {droughtData.vegetationHealth < droughtData.historicalAverage ? 'Below' : 'Above'} average
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
