'use client'

import { useState, useEffect } from 'react'
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
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

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
  ArcElement
)

// Define interfaces for type safety
interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  description: string
  pressure: number
  visibility: number
  uvIndex: number
  dewPoint: number
}

interface ClimateData {
  rainfall: number
  temperature: number
  ndvi: number
  soilMoisture: number
  airQuality: number
}

interface HistoricalData {
  date: string
  temperature: number
  rainfall: number
  humidity: number
  windSpeed: number
  pressure: number
  airQuality: number
}

interface PredictionData {
  date: string
  temperature: number
  temperatureMin: number
  temperatureMax: number
  rainfall: number
  humidity: number
  windSpeed: number
  pressure: number
  confidence: number
}

interface AlertData {
  id: string
  type: 'warning' | 'danger' | 'info'
  title: string
  message: string
  timestamp: string
}

interface ReportData {
  id: string
  title: string
  description: string
  location: string
  timestamp: string
  status: 'pending' | 'verified' | 'resolved'
}

type TimeFrame = '7d' | '30d' | '90d' | '1y'

export default function ClientDashboard() {
  const [selectedCounty, setSelectedCounty] = useState('Nairobi')
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [climateData, setClimateData] = useState<ClimateData | null>(null)
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
  const [predictionData, setPredictionData] = useState<PredictionData[]>([])
  const [alerts, setAlerts] = useState<AlertData[]>([])
  const [reports, setReports] = useState<ReportData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('30d')
  const [selectedAnalysis, setSelectedAnalysis] = useState<'temperature' | 'rainfall' | 'humidity' | 'pressure'>('temperature')

  // Generate mock historical data
  const generateHistoricalData = (days: number): HistoricalData[] => {
    const data: HistoricalData[] = []
    const now = new Date()
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      data.push({
        date: date.toISOString().split('T')[0],
        temperature: Math.round((20 + Math.sin(i * 0.1) * 5 + Math.random() * 8) * 10) / 10,
        rainfall: Math.round(Math.random() * 15 * 10) / 10,
        humidity: Math.round((60 + Math.sin(i * 0.15) * 20 + Math.random() * 15) * 10) / 10,
        windSpeed: Math.round((8 + Math.random() * 12) * 10) / 10,
        pressure: Math.round((1010 + Math.sin(i * 0.2) * 15 + Math.random() * 10) * 10) / 10,
        airQuality: Math.round(50 + Math.random() * 50)
      })
    }
    return data
  }

  // Generate mock prediction data
  const generatePredictionData = (days: number): PredictionData[] => {
    const data: PredictionData[] = []
    const now = new Date()
    
    for (let i = 1; i <= days; i++) {
      const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000)
      const baseTemp = 22 + Math.sin(i * 0.1) * 3
      data.push({
        date: date.toISOString().split('T')[0],
        temperature: Math.round(baseTemp * 10) / 10,
        temperatureMin: Math.round((baseTemp - 3) * 10) / 10,
        temperatureMax: Math.round((baseTemp + 5) * 10) / 10,
        rainfall: Math.round(Math.random() * 12 * 10) / 10,
        humidity: Math.round((65 + Math.sin(i * 0.15) * 15) * 10) / 10,
        windSpeed: Math.round((6 + Math.random() * 8) * 10) / 10,
        pressure: Math.round((1012 + Math.sin(i * 0.2) * 10) * 10) / 10,
        confidence: Math.round((0.95 - i * 0.02) * 100) / 100
      })
    }
    return data
  }

  useEffect(() => {
    // Simulate API calls to fetch data
    const fetchData = async () => {
      setLoading(true)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock weather data with new fields
      setWeatherData({
        temperature: Math.round(20 + Math.random() * 15),
        humidity: Math.round(50 + Math.random() * 30),
        windSpeed: Math.round(5 + Math.random() * 15),
        description: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
        pressure: Math.round(1000 + Math.random() * 50),
        visibility: Math.round(8 + Math.random() * 7),
        uvIndex: Math.round(Math.random() * 11),
        dewPoint: Math.round(15 + Math.random() * 10)
      })

      // Mock climate data
      setClimateData({
        rainfall: Math.round(Math.random() * 100 * 10) / 10,
        temperature: Math.round(20 + Math.random() * 10),
        ndvi: Math.round(Math.random() * 100) / 100,
        soilMoisture: Math.round(20 + Math.random() * 60),
        airQuality: Math.round(50 + Math.random() * 100)
      })

      // Generate historical data based on timeframe
      const days = selectedTimeFrame === '7d' ? 7 : selectedTimeFrame === '30d' ? 30 : selectedTimeFrame === '90d' ? 90 : 365
      setHistoricalData(generateHistoricalData(days))
      setPredictionData(generatePredictionData(14)) // Always show 14 days of predictions

      // Mock alerts
      setAlerts([
        {
          id: '1',
          type: 'warning',
          title: 'High Temperature Alert',
          message: `Temperature expected to reach ${Math.round(30 + Math.random() * 5)}°C in ${selectedCounty}`,
          timestamp: new Date().toISOString()
        },
        {
          id: '2', 
          type: 'info',
          title: 'Rainfall Forecast',
          message: 'Light rain expected this evening',
          timestamp: new Date().toISOString()
        }
      ])

      // Mock reports
      setReports([
        {
          id: '1',
          title: 'Crop Health Report',
          description: `Good maize growth observed in ${selectedCounty} region`,
          location: selectedCounty,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'verified'
        },
        {
          id: '2',
          title: 'Water Level Concern',
          description: 'Decreasing water levels in local reservoir',
          location: selectedCounty,
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          status: 'pending'
        }
      ])

      setLoading(false)
    }

    fetchData()
  }, [selectedCounty, selectedTimeFrame])

  // Chart data configurations
  const getHistoricalChartData = () => {
    const labels = historicalData.map(d => {
      const date = new Date(d.date)
      return selectedTimeFrame === '7d' 
        ? date.toLocaleDateString('en-US', { weekday: 'short' })
        : selectedTimeFrame === '30d'
        ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    })

    const datasets = []
    
    if (selectedAnalysis === 'temperature') {
      datasets.push({
        label: 'Temperature (°C)',
        data: historicalData.map(d => d.temperature),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      })
    } else if (selectedAnalysis === 'rainfall') {
      datasets.push({
        label: 'Rainfall (mm)',
        data: historicalData.map(d => d.rainfall),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      })
    } else if (selectedAnalysis === 'humidity') {
      datasets.push({
        label: 'Humidity (%)',
        data: historicalData.map(d => d.humidity),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: true,
        tension: 0.4
      })
    } else if (selectedAnalysis === 'pressure') {
      datasets.push({
        label: 'Pressure (hPa)',
        data: historicalData.map(d => d.pressure),
        borderColor: 'rgb(234, 88, 12)',
        backgroundColor: 'rgba(234, 88, 12, 0.1)',
        fill: true,
        tension: 0.4
      })
    }

    return { labels, datasets }
  }

  const getPredictionChartData = () => {
    const labels = predictionData.map(d => {
      const date = new Date(d.date)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    })

    return {
      labels,
      datasets: [
        {
          label: 'Predicted Temperature (°C)',
          data: predictionData.map(d => d.temperature),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: '+1',
          tension: 0.4
        },
        {
          label: 'Temperature Range',
          data: predictionData.map(d => d.temperatureMax),
          borderColor: 'rgba(239, 68, 68, 0.3)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: false,
          tension: 0.4,
          pointRadius: 0
        },
        {
          label: 'Temperature Min',
          data: predictionData.map(d => d.temperatureMin),
          borderColor: 'rgba(239, 68, 68, 0.3)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: false,
          tension: 0.4,
          pointRadius: 0
        }
      ]
    }
  }

  const getWeatherDistributionData = () => {
    const descriptions = historicalData.map(d => {
      // Simulate weather description based on temperature and rainfall
      if (d.rainfall > 5) return 'Rainy'
      if (d.temperature > 28) return 'Hot'
      if (d.temperature < 18) return 'Cool'
      return 'Pleasant'
    })

    const counts = descriptions.reduce((acc, desc) => {
      acc[desc] = (acc[desc] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(239, 68, 68)',
          'rgb(34, 197, 94)',
          'rgb(168, 85, 247)'
        ],
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
            Advanced Climate Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive climate monitoring and predictions for {selectedCounty}, Kenya
          </p>
        </div>

        <div className="space-y-8">
          {/* Current Weather Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Current Weather</h3>
                <span className="text-2xl">
                  {weatherData?.description === 'Sunny' ? '☀️' : 
                   weatherData?.description === 'Partly Cloudy' ? '⛅' :
                   weatherData?.description === 'Cloudy' ? '☁️' : '🌧️'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center bg-blue-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-600">{weatherData?.temperature}°C</div>
                  <div className="text-sm text-gray-600">Temperature</div>
                </div>
                <div className="text-center bg-green-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-600">{weatherData?.humidity}%</div>
                  <div className="text-sm text-gray-600">Humidity</div>
                </div>
                <div className="text-center bg-purple-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-purple-600">{weatherData?.windSpeed}km/h</div>
                  <div className="text-sm text-gray-600">Wind Speed</div>
                </div>
                <div className="text-center bg-orange-50 rounded-lg p-4">
                  <div className="text-lg font-semibold text-orange-700">{weatherData?.description}</div>
                  <div className="text-sm text-gray-600">Conditions</div>
                </div>
              </div>

              {/* Additional weather metrics */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pressure:</span>
                    <span className="text-sm font-medium">{weatherData?.pressure} hPa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Visibility:</span>
                    <span className="text-sm font-medium">{weatherData?.visibility} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">UV Index:</span>
                    <span className="text-sm font-medium">{weatherData?.uvIndex}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Dew Point:</span>
                    <span className="text-sm font-medium">{weatherData?.dewPoint}°C</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
                <span className="text-2xl">🚨</span>
              </div>
              
              <div className="space-y-3">
                {alerts.map(alert => (
                  <div key={alert.id} className={`border-l-4 p-3 ${
                    alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                    alert.type === 'danger' ? 'bg-red-50 border-red-400' :
                    'bg-blue-50 border-blue-400'
                  }`}>
                    <div className={`text-sm font-medium ${
                      alert.type === 'warning' ? 'text-yellow-800' :
                      alert.type === 'danger' ? 'text-red-800' :
                      'text-blue-800'
                    }`}>
                      {alert.title}
                    </div>
                    <div className={`text-xs ${
                      alert.type === 'warning' ? 'text-yellow-600' :
                      alert.type === 'danger' ? 'text-red-600' :
                      'text-blue-600'
                    }`}>
                      {alert.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analysis Controls */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Climate Analysis & Predictions</h3>
                <p className="text-sm text-gray-600">Select timeframe and data type to analyze</p>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex space-x-2">
                  <label className="text-sm font-medium text-gray-700">Timeframe:</label>
                  <select 
                    value={selectedTimeFrame} 
                    onChange={(e) => setSelectedTimeFrame(e.target.value as TimeFrame)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="7d">7 Days</option>
                    <option value="30d">30 Days</option>
                    <option value="90d">90 Days</option>
                    <option value="1y">1 Year</option>
                  </select>
                </div>
                
                <div className="flex space-x-2">
                  <label className="text-sm font-medium text-gray-700">Analysis:</label>
                  <select 
                    value={selectedAnalysis} 
                    onChange={(e) => setSelectedAnalysis(e.target.value as 'temperature' | 'rainfall' | 'humidity' | 'pressure')}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="temperature">Temperature</option>
                    <option value="rainfall">Rainfall</option>
                    <option value="humidity">Humidity</option>
                    <option value="pressure">Pressure</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Historical Trends Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Historical {selectedAnalysis.charAt(0).toUpperCase() + selectedAnalysis.slice(1)} Trends
              </h3>
              <div className="h-80">
                <Line data={getHistoricalChartData()} options={chartOptions} />
              </div>
            </div>

            {/* Weather Predictions Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                14-Day Temperature Forecast
              </h3>
              <div className="h-80">
                <Line data={getPredictionChartData()} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Additional Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weather Distribution */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Distribution</h3>
              <div className="h-64">
                <Doughnut data={getWeatherDistributionData()} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                    },
                  },
                }} />
              </div>
            </div>

            {/* Climate Data Summary */}
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
                  <span className="font-semibold">{climateData?.rainfall}mm</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span>🌡️</span>
                    <span className="text-sm">Avg Temperature</span>
                  </div>
                  <span className="font-semibold">{climateData?.temperature}°C</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span>🌱</span>
                    <span className="text-sm">NDVI</span>
                  </div>
                  <span className="font-semibold">{climateData?.ndvi}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span>💧</span>
                    <span className="text-sm">Soil Moisture</span>
                  </div>
                  <span className="font-semibold">{climateData?.soilMoisture}%</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span>🌬️</span>
                    <span className="text-sm">Air Quality</span>
                  </div>
                  <span className="font-semibold">{climateData?.airQuality} AQI</span>
                </div>
              </div>
            </div>
            
            {/* Community Reports */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Community Reports</h3>
                <span className="text-2xl">📋</span>
              </div>
              
              <div className="space-y-4">
                {reports.map(report => (
                  <div key={report.id} className="border-l-4 border-green-400 pl-4">
                    <div className="flex justify-between items-start">
                      <div className="text-sm font-medium text-gray-900">{report.title}</div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        report.status === 'verified' ? 'bg-green-100 text-green-800' :
                        report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {new Date(report.timestamp).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-700 mt-1">
                      {report.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prediction Confidence & Insights */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Forecast Insights & Confidence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900">Next 3 Days</h4>
                <p className="text-2xl font-bold text-blue-700">
                  {predictionData.slice(0, 3).reduce((sum, d) => sum + d.confidence, 0) / 3 * 100}%
                </p>
                <p className="text-sm text-blue-600">Confidence</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900">Week Ahead</h4>
                <p className="text-2xl font-bold text-green-700">
                  {predictionData.slice(0, 7).reduce((sum, d) => sum + d.confidence, 0) / 7 * 100}%
                </p>
                <p className="text-sm text-green-600">Confidence</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900">Expected Rainfall</h4>
                <p className="text-2xl font-bold text-orange-700">
                  {predictionData.slice(0, 7).reduce((sum, d) => sum + d.rainfall, 0).toFixed(1)}mm
                </p>
                <p className="text-sm text-orange-600">Next 7 days</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900">Temp Range</h4>
                <p className="text-2xl font-bold text-purple-700">
                  {Math.min(...predictionData.slice(0, 7).map(d => d.temperatureMin))}° - {Math.max(...predictionData.slice(0, 7).map(d => d.temperatureMax))}°
                </p>
                <p className="text-sm text-purple-600">Next 7 days</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <span>📝</span>
                <span>Submit Report</span>
              </button>
              <button className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                <span>📊</span>
                <span>Export Data</span>
              </button>
              <button className="bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2">
                <span>📱</span>
                <span>Alert Settings</span>
              </button>
              <button className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                <span>🗺️</span>
                <span>View Maps</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
