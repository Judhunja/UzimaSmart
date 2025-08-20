'use client'

import { useState, useEffect } from 'react'
import { 
  PuzzlePieceIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  EyeIcon,
  CameraIcon,
  CloudIcon
} from '@heroicons/react/24/outline'

interface CropHealth {
  id: string
  cropType: string
  health: number
  diseaseRisk: string
  lastUpdate: string
  location: string
  area: number
}

interface WeatherAlert {
  type: 'rain' | 'drought' | 'frost' | 'storm'
  severity: 'low' | 'medium' | 'high'
  message: string
  timestamp: string
}

export function AgricultureDashboard() {
  const [crops, setCrops] = useState<CropHealth[]>([])
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([])
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Simulate loading crop data
    setCrops([
      {
        id: '1',
        cropType: 'Maize',
        health: 87,
        diseaseRisk: 'Low',
        lastUpdate: '2 hours ago',
        location: 'Field A',
        area: 2.5
      },
      {
        id: '2',
        cropType: 'Beans',
        health: 92,
        diseaseRisk: 'Very Low',
        lastUpdate: '4 hours ago',
        location: 'Field B',
        area: 1.8
      },
      {
        id: '3',
        cropType: 'Coffee',
        health: 73,
        diseaseRisk: 'Medium',
        lastUpdate: '1 hour ago',
        location: 'Field C',
        area: 3.2
      }
    ])

    setWeatherAlerts([
      {
        type: 'rain',
        severity: 'medium',
        message: 'Heavy rainfall expected in the next 48 hours',
        timestamp: '30 minutes ago'
      },
      {
        type: 'drought',
        severity: 'low',
        message: 'Dry conditions forecasted for next week',
        timestamp: '2 hours ago'
      }
    ])
  }, [])

  const handleImageAnalysis = () => {
    setIsAnalyzing(true)
    // Simulate AI image analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      alert('Image analysis complete! Disease detected: Leaf Rust (73% confidence)')
    }, 3000)
  }

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-600 bg-green-100'
    if (health >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getRiskColor = (risk: string) => {
    if (risk === 'Very Low' || risk === 'Low') return 'text-green-700 bg-green-100'
    if (risk === 'Medium') return 'text-yellow-700 bg-yellow-100'
    return 'text-red-700 bg-red-100'
  }

  return (
    <section className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Smart Agriculture
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Monitor crop health, detect diseases early, and optimize farming 
            practices with satellite data and machine learning.
          </p>
        </div>

        {/* Weather Alerts */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <CloudIcon className="w-5 h-5 mr-2 text-blue-500" />
              Weather Alerts
            </h3>
            <span className="text-sm text-gray-500">Updated every hour</span>
          </div>
          <div className="space-y-3">
            {weatherAlerts.map((alert, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className={`w-5 h-5 mr-2 ${
                      alert.severity === 'high' ? 'text-red-500' :
                      alert.severity === 'medium' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`} />
                    <span className="font-medium text-gray-900">{alert.message}</span>
                  </div>
                  <span className="text-sm text-gray-500">{alert.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crop Health Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Crop Cards */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-green-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Crop Health Overview</h3>
                <p className="text-sm text-gray-600">Real-time monitoring via satellite NDVI analysis</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {crops.map((crop) => (
                    <div 
                      key={crop.id}
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                        selectedCrop === crop.id 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-green-300 hover:bg-green-25'
                      }`}
                      onClick={() => setSelectedCrop(crop.id)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <PuzzlePieceIcon className="w-8 h-8 text-green-600 mr-3" />
                          <div>
                            <h4 className="font-semibold text-gray-900">{crop.cropType}</h4>
                            <p className="text-sm text-gray-600">{crop.location} • {crop.area} ha</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getHealthColor(crop.health)}`}>
                            {crop.health}%
                          </div>
                          <p className="text-xs text-gray-500">Health Score</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(crop.diseaseRisk)}`}>
                          {crop.diseaseRisk} Risk
                        </span>
                        <span className="text-xs text-gray-500">{crop.lastUpdate}</span>
                      </div>

                      {/* Health Progress Bar */}
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              crop.health >= 80 ? 'bg-green-500' :
                              crop.health >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${crop.health}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis Panel */}
          <div className="space-y-6">
            {/* Disease Detection */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CameraIcon className="w-5 h-5 mr-2 text-purple-500" />
                AI Disease Detection
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload crop images for instant AI-powered disease analysis
              </p>
              
              <button 
                onClick={handleImageAnalysis}
                disabled={isAnalyzing}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isAnalyzing
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Analyzing...
                  </div>
                ) : (
                  'Analyze Crop Image'
                )}
              </button>

              {/* Analysis Results */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                  Last analysis: Healthy crops detected
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Confidence: 94% • 2 hours ago
                </div>
              </div>
            </div>

            {/* Satellite Monitoring */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <EyeIcon className="w-5 h-5 mr-2 text-blue-500" />
                Satellite Monitoring
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">NDVI Index</span>
                  <span className="font-semibold text-green-600">0.67</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Soil Moisture</span>
                  <span className="font-semibold text-blue-600">72%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Coverage</span>
                  <span className="font-semibold text-gray-900">98.2%</span>
                </div>
              </div>

              <button className="w-full mt-4 py-2 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                View Satellite Images
              </button>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Recommendations</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Apply organic fertilizer to Field C next week</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Monitor maize for potential pest activity</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Optimal harvesting window: 2-3 weeks</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary px-8 py-3 text-lg">
              Upload Crop Images
            </button>
            <button className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-200">
              View Field Map
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200">
              Download Report
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
