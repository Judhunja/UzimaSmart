'use client'

import React, { useState, useEffect } from 'react'
import { AIInsights } from '@/components/insights/AIInsights'
import { 
  ChartBarIcon, 
  GlobeAltIcon, 
  ExclamationTriangleIcon,
  FireIcon,
  CloudIcon,
  SunIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'
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
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface ClimateMetrics {
  temperature: {
    current: number
    historical: number[]
    co2Impact: number
    energyCost: number
  }
  rainfall: {
    current: number
    historical: number[]
    waterDeficit: number
    harvestPotential: number
  }
  humidity: {
    current: number
    historical: number[]
    diseaseRisk: number
    energyPenalty: number
  }
  ndvi: {
    current: number
    historical: number[]
    carbonLoss: number
    erosionRisk: string
  }
  alerts: {
    count: number
    severity: string
    economicImpact: number
  }
}

export default function EnhancedClimateDashboard() {
  const [climateData, setClimateData] = useState<ClimateMetrics | null>(null)
  const [selectedCounty, setSelectedCounty] = useState('Nairobi')
  const [loading, setLoading] = useState(true)

  // Generate chart data for visualizations
  const generateChartData = (data: ClimateMetrics) => {
    const last30Days = Array.from({length: 30}, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    })

    return {
      temperatureChart: {
        labels: last30Days,
        datasets: [
          {
            label: 'Temperature (°C)',
            data: data.temperature.historical,
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      rainfallChart: {
        labels: last30Days,
        datasets: [
          {
            label: 'Rainfall (mm)',
            data: data.rainfall.historical,
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1
          }
        ]
      },
      humidityChart: {
        labels: last30Days,
        datasets: [
          {
            label: 'Humidity (%)',
            data: data.humidity.historical,
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      ndviChart: {
        labels: last30Days,
        datasets: [
          {
            label: 'NDVI',
            data: data.ndvi.historical,
            borderColor: 'rgb(101, 163, 13)',
            backgroundColor: 'rgba(101, 163, 13, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      riskDistribution: {
        labels: ['Temperature Risk', 'Water Deficit', 'Disease Risk', 'Erosion Risk'],
        datasets: [
          {
            data: [
              data.temperature.co2Impact,
              data.rainfall.waterDeficit / 10,
              data.humidity.diseaseRisk,
              data.ndvi.erosionRisk === 'HIGH' ? 25 : data.ndvi.erosionRisk === 'MODERATE' ? 15 : 5
            ],
            backgroundColor: [
              '#ef4444',
              '#3b82f6',
              '#22c55e',
              '#f59e0b'
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
          }
        ]
      }
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
        beginAtZero: true,
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: false,
      },
    },
  }

  useEffect(() => {
    generateSampleClimateData()
  }, [selectedCounty])

  const generateSampleClimateData = async () => {
    setLoading(true)
    
    // Simulate realistic climate data with variations
    const baseTemp = selectedCounty === 'Nairobi' ? 19 : 
                    selectedCounty === 'Mombasa' ? 27 : 
                    selectedCounty === 'Kisumu' ? 23 : 21
    
    const baseRain = selectedCounty === 'Nairobi' ? 78 : 
                    selectedCounty === 'Mombasa' ? 115 : 
                    selectedCounty === 'Kisumu' ? 120 : 95

    const tempData = Array.from({ length: 30 }, (_, i) => 
      baseTemp + Math.sin(i / 10) * 3 + (Math.random() - 0.5) * 4
    )
    
    const rainData = Array.from({ length: 30 }, (_, i) => 
      Math.max(0, baseRain + Math.sin(i / 15) * 40 + (Math.random() - 0.5) * 60)
    )
    
    const humidityData = Array.from({ length: 30 }, (_, i) => 
      60 + Math.sin(i / 8) * 15 + (Math.random() - 0.5) * 10
    )
    
    const ndviData = Array.from({ length: 30 }, (_, i) => 
      Math.max(0.1, 0.5 + Math.sin(i / 20) * 0.2 + (Math.random() - 0.5) * 0.1)
    )

    const currentTemp = tempData[tempData.length - 1]
    const currentRain = rainData[rainData.length - 1]
    const currentHumidity = humidityData[humidityData.length - 1]
    const currentNdvi = ndviData[ndviData.length - 1]

    const data: ClimateMetrics = {
      temperature: {
        current: currentTemp,
        historical: tempData,
        co2Impact: Math.max(0, currentTemp - 24) * 15,
        energyCost: Math.max(0, currentTemp - 25) * 500
      },
      rainfall: {
        current: currentRain,
        historical: rainData,
        waterDeficit: Math.max(0, 800 - currentRain * 12),
        harvestPotential: currentRain * 0.7
      },
      humidity: {
        current: currentHumidity,
        historical: humidityData,
        diseaseRisk: currentHumidity > 80 ? 15 : currentHumidity > 70 ? 8 : 3,
        energyPenalty: Math.max(0, currentHumidity - 60) * 2
      },
      ndvi: {
        current: currentNdvi,
        historical: ndviData,
        carbonLoss: Math.max(0, 0.6 - currentNdvi) * 2.5,
        erosionRisk: currentNdvi < 0.4 ? 'HIGH' : currentNdvi < 0.5 ? 'MODERATE' : 'LOW'
      },
      alerts: {
        count: Math.floor(Math.random() * 5) + 1,
        severity: Math.random() > 0.7 ? 'HIGH' : Math.random() > 0.4 ? 'MEDIUM' : 'LOW',
        economicImpact: Math.floor(Math.random() * 500000) + 50000
      }
    }

    setClimateData(data)
    setLoading(false)
  }

  const counties = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Machakos']

  if (loading || !climateData) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          🌍 Climate Change Impact Dashboard
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          AI-powered climate analysis with specific metrics, actionable recommendations, 
          and measurable targets for climate change mitigation and adaptation
        </p>
        
        {/* County Selector */}
        <div className="flex justify-center">
          <select 
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {counties.map(county => (
              <option key={county} value={county}>{county} County</option>
            ))}
          </select>
        </div>
      </div>

      {/* Climate Data Visualization Charts */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          📊 Climate Data Trends - Last 30 Days
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Temperature Chart */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
              <FireIcon className="w-5 h-5 mr-2" />
              Temperature Trends
            </h3>
            <div className="h-64">
              <Line data={generateChartData(climateData).temperatureChart} options={chartOptions} />
            </div>
          </div>

          {/* Rainfall Chart */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
              <CloudIcon className="w-5 h-5 mr-2" />
              Rainfall Distribution
            </h3>
            <div className="h-64">
              <Bar data={generateChartData(climateData).rainfallChart} options={chartOptions} />
            </div>
          </div>

          {/* Humidity Chart */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
              <BeakerIcon className="w-5 h-5 mr-2" />
              Humidity Levels
            </h3>
            <div className="h-64">
              <Line data={generateChartData(climateData).humidityChart} options={chartOptions} />
            </div>
          </div>

          {/* NDVI Chart */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
            <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
              <GlobeAltIcon className="w-5 h-5 mr-2" />
              Vegetation Health (NDVI)
            </h3>
            <div className="h-64">
              <Line data={generateChartData(climateData).ndviChart} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Risk Distribution Chart */}
        <div className="mt-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-4 text-center flex items-center justify-center">
            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
            Climate Risk Distribution
          </h3>
          <div className="h-80 flex justify-center">
            <div className="w-80">
              <Doughnut data={generateChartData(climateData).riskDistribution} options={doughnutOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Climate Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Temperature Card */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FireIcon className="w-6 h-6 text-red-500" />
              <h3 className="font-semibold text-red-800">Temperature</h3>
            </div>
            <span className="text-2xl font-bold text-red-600">
              {climateData.temperature.current.toFixed(1)}°C
            </span>
          </div>
          <div className="space-y-2 text-sm text-red-700">
            <div>CO2 Impact: <span className="font-medium">{climateData.temperature.co2Impact.toFixed(1)} kg</span></div>
            <div>Energy Cost: <span className="font-medium">{climateData.temperature.energyCost.toFixed(0)} KES/month</span></div>
            <div>Range: <span className="font-medium">{Math.min(...climateData.temperature.historical).toFixed(1)}°C - {Math.max(...climateData.temperature.historical).toFixed(1)}°C</span></div>
          </div>
        </div>

        {/* Rainfall Card */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <CloudIcon className="w-6 h-6 text-blue-500" />
              <h3 className="font-semibold text-blue-800">Rainfall</h3>
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {climateData.rainfall.current.toFixed(0)}mm
            </span>
          </div>
          <div className="space-y-2 text-sm text-blue-700">
            <div>Water Deficit: <span className="font-medium">{climateData.rainfall.waterDeficit.toFixed(0)} mm/year</span></div>
            <div>Harvest Potential: <span className="font-medium">{climateData.rainfall.harvestPotential.toFixed(0)} mm</span></div>
            <div>Monthly Avg: <span className="font-medium">{(climateData.rainfall.historical.reduce((a, b) => a + b, 0) / climateData.rainfall.historical.length).toFixed(0)} mm</span></div>
          </div>
        </div>

        {/* Humidity Card */}
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-200 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BeakerIcon className="w-6 h-6 text-green-500" />
              <h3 className="font-semibold text-green-800">Humidity</h3>
            </div>
            <span className="text-2xl font-bold text-green-600">
              {climateData.humidity.current.toFixed(0)}%
            </span>
          </div>
          <div className="space-y-2 text-sm text-green-700">
            <div>Disease Risk: <span className="font-medium">{climateData.humidity.diseaseRisk.toFixed(0)}%</span></div>
            <div>Energy Penalty: <span className="font-medium">{climateData.humidity.energyPenalty.toFixed(0)}%</span></div>
            <div>Health Index: <span className="font-medium">{climateData.humidity.current < 60 ? 'GOOD' : climateData.humidity.current < 80 ? 'MODERATE' : 'RISK'}</span></div>
          </div>
        </div>

        {/* NDVI/Vegetation Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <GlobeAltIcon className="w-6 h-6 text-emerald-500" />
              <h3 className="font-semibold text-emerald-800">Vegetation</h3>
            </div>
            <span className="text-2xl font-bold text-emerald-600">
              {climateData.ndvi.current.toFixed(3)}
            </span>
          </div>
          <div className="space-y-2 text-sm text-emerald-700">
            <div>Carbon Loss: <span className="font-medium">{climateData.ndvi.carbonLoss.toFixed(1)} tCO2/ha</span></div>
            <div>Erosion Risk: <span className="font-medium">{climateData.ndvi.erosionRisk}</span></div>
            <div>Health Status: <span className="font-medium">{climateData.ndvi.current > 0.5 ? 'HEALTHY' : 'DEGRADED'}</span></div>
          </div>
        </div>
      </div>

      {/* Climate Alerts Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-l-4 border-yellow-400 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
          <div>
            <h2 className="text-xl font-bold text-yellow-800">Climate Risk Assessment</h2>
            <p className="text-yellow-700">Current alerts and economic impact analysis</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg border">
            <div className="font-semibold text-gray-800">Active Alerts</div>
            <div className="text-2xl font-bold text-yellow-600">{climateData.alerts.count}</div>
            <div className="text-gray-600">Severity: {climateData.alerts.severity}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="font-semibold text-gray-800">Economic Impact</div>
            <div className="text-2xl font-bold text-red-600">{(climateData.alerts.economicImpact / 1000).toFixed(0)}K KES</div>
            <div className="text-gray-600">Estimated losses</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="font-semibold text-gray-800">Risk Level</div>
            <div className={`text-2xl font-bold ${climateData.alerts.count > 3 ? 'text-red-600' : climateData.alerts.count > 1 ? 'text-yellow-600' : 'text-green-600'}`}>
              {climateData.alerts.count > 3 ? 'EXTREME' : climateData.alerts.count > 1 ? 'HIGH' : 'MODERATE'}
            </div>
            <div className="text-gray-600">Current status</div>
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="space-y-6">
        <div className="text-center bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
          <h2 className="text-3xl font-bold text-indigo-900 mb-2">
            🤖 AI Climate Insights & Recommendations
          </h2>
          <p className="text-lg text-indigo-700">
            Based on the visual data trends shown above, our AI analyzes patterns and provides specific actionable recommendations
          </p>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          🤖 AI-Powered Climate Insights & Recommendations
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIInsights 
            data={{
              type: 'temperature',
              values: climateData.temperature.historical,
              location: selectedCounty,
              timeframe: 'last 30 days',
              metadata: { 
                co2Impact: climateData.temperature.co2Impact,
                energyCost: climateData.temperature.energyCost
              }
            }}
            title="🌡️ Temperature Impact Analysis"
          />
          
          <AIInsights 
            data={{
              type: 'rainfall',
              values: climateData.rainfall.historical,
              location: selectedCounty,
              timeframe: 'last 30 days',
              metadata: {
                waterDeficit: climateData.rainfall.waterDeficit,
                harvestPotential: climateData.rainfall.harvestPotential
              }
            }}
            title="💧 Water Security Analysis"
          />
          
          <AIInsights 
            data={{
              type: 'humidity',
              values: climateData.humidity.historical,
              location: selectedCounty,
              timeframe: 'last 30 days',
              metadata: {
                diseaseRisk: climateData.humidity.diseaseRisk,
                energyPenalty: climateData.humidity.energyPenalty
              }
            }}
            title="🌫️ Humidity Health Impact"
          />
          
          <AIInsights 
            data={{
              type: 'ndvi',
              values: climateData.ndvi.historical,
              location: selectedCounty,
              timeframe: 'last 30 days',
              metadata: {
                carbonLoss: climateData.ndvi.carbonLoss,
                erosionRisk: climateData.ndvi.erosionRisk
              }
            }}
            title="🌱 Ecosystem Health Analysis"
          />
        </div>

        {/* County-wide Insights */}
        <AIInsights 
          data={{
            type: 'alerts',
            values: [climateData.alerts.count],
            location: selectedCounty,
            timeframe: 'current',
            metadata: {
              severity: climateData.alerts.severity,
              economicImpact: climateData.alerts.economicImpact,
              severityDistribution: {
                high: climateData.alerts.severity === 'HIGH' ? 1 : 0,
                medium: climateData.alerts.severity === 'MEDIUM' ? 1 : 0,
                low: climateData.alerts.severity === 'LOW' ? 1 : 0
              }
            }
          }}
          title={`🏛️ ${selectedCounty} County Climate Action Plan`}
          className="lg:col-span-2"
        />
      </div>

      {/* Action Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-8 text-center border border-purple-200 shadow-lg">
        <h2 className="text-2xl font-bold text-purple-900 mb-4">
          🎯 Climate Action Targets for {selectedCounty} County
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <div className="text-3xl font-bold text-purple-600">
              {Math.floor((climateData.temperature.co2Impact + climateData.ndvi.carbonLoss) * 10)}
            </div>
            <div className="font-semibold text-purple-800">Tons CO2 Reduction Target</div>
            <div className="text-purple-600">Annual emission cuts needed</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <div className="text-3xl font-bold text-purple-600">
              {Math.floor(climateData.rainfall.waterDeficit / 10)}%
            </div>
            <div className="font-semibold text-purple-800">Water Security Improvement</div>
            <div className="text-purple-600">Through harvesting & conservation</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <div className="text-3xl font-bold text-purple-600">
              {Math.floor((100 - climateData.humidity.diseaseRisk * 2))}%
            </div>
            <div className="font-semibold text-purple-800">Health Risk Reduction</div>
            <div className="text-purple-600">Disease prevention target</div>
          </div>
        </div>
      </div>
    </div>
  )
}
