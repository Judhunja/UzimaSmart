'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  CloudIcon, 
  ExclamationTriangleIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FireIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { AIInsights } from '../insights/AIInsights';
import { weatherService } from '../../services/weatherService';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  rainfall: number;
  windSpeed: number;
  windDirection: number;
  cloudCover: number;
  uvIndex: number;
  visibility: number;
  description: string;
  icon: string;
  timestamp: number;
}

interface ClimateStats {
  avgTemp: number;
  totalRainfall: number;
  avgHumidity: number;
  droughtRisk: number;
  floodRisk: number;
  extremeEvents: number;
}

const ClimateDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [historicalData, setHistoricalData] = useState<WeatherData[]>([]);
  const [climateStats, setClimateStats] = useState<ClimateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Counties data for Kenya
  const counties = [
    { name: 'Nairobi', temp: 22, rainfall: 45, risk: 'low' },
    { name: 'Mombasa', temp: 28, rainfall: 120, risk: 'medium' },
    { name: 'Kisumu', temp: 25, rainfall: 180, risk: 'high' },
    { name: 'Nakuru', temp: 20, rainfall: 95, risk: 'medium' },
    { name: 'Eldoret', temp: 18, rainfall: 110, risk: 'medium' },
    { name: 'Meru', temp: 19, rainfall: 140, risk: 'high' },
  ];

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        
        // Fetch current weather for Nairobi (lat: -1.286389, lon: 36.817223)
        const currentWeather = await weatherService.getCurrentWeather(-1.286389, 36.817223);
        setWeatherData(currentWeather);

        // Generate historical data for charts
        const historical = generateHistoricalData();
        setHistoricalData(historical);

        // Calculate climate statistics
        const stats = calculateClimateStats(historical);
        setClimateStats(stats);

        setError(null);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Failed to fetch weather data');
        // Set fallback data
        setWeatherData({
          temperature: 22,
          humidity: 65,
          pressure: 1013,
          rainfall: 45,
          windSpeed: 12,
          windDirection: 180,
          cloudCover: 40,
          uvIndex: 6,
          visibility: 10,
          description: 'Partly cloudy',
          icon: '02d',
          timestamp: Date.now()
        });
        
        const fallbackHistorical = generateHistoricalData();
        setHistoricalData(fallbackHistorical);
        setClimateStats(calculateClimateStats(fallbackHistorical));
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const generateHistoricalData = (): WeatherData[] => {
    const data: WeatherData[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 12; i++) {
      // Simulate realistic Kenyan climate patterns
      const isRainySeason = i >= 2 && i <= 5 || i >= 9 && i <= 11;
      const baseTemp = 20 + Math.sin((i / 12) * 2 * Math.PI) * 3;
      
      data.push({
        temperature: Math.round(baseTemp + Math.random() * 4),
        humidity: isRainySeason ? 70 + Math.random() * 20 : 50 + Math.random() * 15,
        rainfall: isRainySeason ? 80 + Math.random() * 100 : 10 + Math.random() * 30,
        windSpeed: 8 + Math.random() * 8,
        windDirection: Math.random() * 360,
        pressure: 1010 + Math.random() * 10,
        cloudCover: isRainySeason ? 70 + Math.random() * 30 : 20 + Math.random() * 40,
        uvIndex: Math.random() * 10,
        visibility: 8 + Math.random() * 7,
        description: isRainySeason ? 'Rainy' : 'Partly cloudy',
        icon: isRainySeason ? '09d' : '02d',
        timestamp: new Date(`2024-${String(i + 1).padStart(2, '0')}-15`).getTime()
      });
    }
    
    return data;
  };

  const calculateClimateStats = (data: WeatherData[]): ClimateStats => {
    const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
    const totalRainfall = data.reduce((sum, d) => sum + d.rainfall, 0);
    const avgHumidity = data.reduce((sum, d) => sum + d.humidity, 0) / data.length;
    
    // Calculate risk indicators
    const droughtRisk = data.filter(d => d.rainfall < 25).length / data.length * 100;
    const floodRisk = data.filter(d => d.rainfall > 150).length / data.length * 100;
    const extremeEvents = data.filter(d => d.temperature > 30 || d.temperature < 10 || d.rainfall > 200).length;

    return {
      avgTemp: Math.round(avgTemp * 10) / 10,
      totalRainfall: Math.round(totalRainfall),
      avgHumidity: Math.round(avgHumidity),
      droughtRisk: Math.round(droughtRisk),
      floodRisk: Math.round(floodRisk),
      extremeEvents
    };
  };

  // Chart configurations
  const temperatureChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: historicalData.map(d => d.temperature),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const rainfallChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Rainfall (mm)',
        data: historicalData.map(d => d.rainfall),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const humidityChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Humidity (%)',
        data: historicalData.map(d => d.humidity),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const riskDistributionData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        data: [40, 35, 25],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const multiVariableChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: historicalData.map(d => d.temperature),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        yAxisID: 'y',
      },
      {
        label: 'Rainfall (mm/10)',
        data: historicalData.map(d => d.rainfall / 10),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        yAxisID: 'y',
      },
      {
        label: 'Humidity (%)',
        data: historicalData.map(d => d.humidity),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const multiVariableOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Temperature (°C) / Rainfall (mm/10)',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Humidity (%)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading climate data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <CloudIcon className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900">Climate Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'analytics', name: 'Analytics', icon: ArrowTrendingUpIcon },
              { id: 'counties', name: 'Counties', icon: MapPinIcon },
              { id: 'alerts', name: 'Alerts', icon: ExclamationTriangleIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Current Weather Conditions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Weather Conditions</h2>
              {weatherData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <FireIcon className="h-8 w-8 text-red-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-900">Temperature</p>
                        <p className="text-2xl font-bold text-red-600">{weatherData.temperature}°C</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <CloudIcon className="h-8 w-8 text-blue-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-900">Humidity</p>
                        <p className="text-2xl font-bold text-blue-600">{weatherData.humidity}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <BeakerIcon className="h-8 w-8 text-green-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-900">Pressure</p>
                        <p className="text-2xl font-bold text-green-600">{weatherData.pressure} hPa</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-purple-900">Wind Speed</p>
                        <p className="text-2xl font-bold text-purple-600">{weatherData.windSpeed} km/h</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Insights for Current Conditions */}
            <AIInsights
              data={{
                type: 'weather',
                values: [weatherData?.temperature || 22],
                location: 'Nairobi',
                metadata: {
                  temperature: weatherData?.temperature || 22,
                  humidity: weatherData?.humidity || 65,
                  conditions: weatherData?.description || 'Partly cloudy'
                }
              }}
              title="Current Weather Analysis"
            />

            {/* Key Statistics */}
            {climateStats && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Climate Statistics (Annual)</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{climateStats.avgTemp}°C</p>
                    <p className="text-sm text-gray-600">Avg Temperature</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{climateStats.totalRainfall}mm</p>
                    <p className="text-sm text-gray-600">Total Rainfall</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{climateStats.avgHumidity}%</p>
                    <p className="text-sm text-gray-600">Avg Humidity</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{climateStats.droughtRisk}%</p>
                    <p className="text-sm text-gray-600">Drought Risk</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{climateStats.floodRisk}%</p>
                    <p className="text-sm text-gray-600">Flood Risk</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{climateStats.extremeEvents}</p>
                    <p className="text-sm text-gray-600">Extreme Events</p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Insights for Climate Statistics */}
            <AIInsights
              data={{
                type: 'temperature',
                values: [climateStats?.avgTemp || 22],
                metadata: {
                  avgTemperature: climateStats?.avgTemp || 22,
                  totalRainfall: climateStats?.totalRainfall || 850,
                  droughtRisk: climateStats?.droughtRisk || 15,
                  floodRisk: climateStats?.floodRisk || 10,
                  extremeEvents: climateStats?.extremeEvents || 3
                }
              }}
              title="Annual Climate Statistics Analysis"
            />

            {/* Temperature Trends */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Temperature Trends</h2>
              <div className="h-64">
                <Line data={temperatureChartData} options={chartOptions} />
              </div>
            </div>

            {/* AI Insights for Temperature Trends */}
            <AIInsights
              data={{
                type: 'temperature',
                values: historicalData.map(d => d.temperature),
                timeframe: '12 months',
                metadata: {
                  averageTemp: climateStats?.avgTemp || 22,
                  seasonalVariation: 'moderate'
                }
              }}
              title="Temperature Trends Analysis"
            />

            {/* Rainfall Patterns */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Rainfall Patterns</h2>
              <div className="h-64">
                <Bar data={rainfallChartData} options={chartOptions} />
              </div>
            </div>

            {/* AI Insights for Rainfall Patterns */}
            <AIInsights
              data={{
                type: 'rainfall',
                values: historicalData.map(d => d.rainfall),
                timeframe: '12 months',
                metadata: {
                  totalAnnual: climateStats?.totalRainfall || 850,
                  rainySeasons: ['Mar-May', 'Oct-Dec']
                }
              }}
              title="Rainfall Patterns Analysis"
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Humidity Trends */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Humidity Trends</h2>
              <div className="h-64">
                <Line data={humidityChartData} options={chartOptions} />
              </div>
            </div>

            {/* AI Insights for Humidity Trends */}
            <AIInsights
              data={{
                type: 'humidity',
                values: historicalData.map(d => d.humidity),
                timeframe: '12 months',
                metadata: {
                  averageHumidity: climateStats?.avgHumidity || 65,
                  seasonalPattern: 'high during rainy seasons'
                }
              }}
              title="Humidity Trends Analysis"
            />

            {/* Multi-Variable Climate Analysis */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Multi-Variable Climate Analysis</h2>
              <div className="h-64">
                <Line data={multiVariableChartData} options={multiVariableOptions} />
              </div>
            </div>

            {/* AI Insights for Multi-Variable Analysis */}
            <AIInsights
              data={{
                type: 'temperature',
                values: historicalData.map(d => d.temperature),
                metadata: {
                  temperature: historicalData.map(d => d.temperature),
                  rainfall: historicalData.map(d => d.rainfall),
                  humidity: historicalData.map(d => d.humidity),
                  correlations: 'rainfall and humidity strongly correlated'
                }
              }}
              title="Multi-Variable Climate Analysis"
            />

            {/* Regional Climate Risk Assessment */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Regional Climate Risk Assessment</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64">
                  <Doughnut data={riskDistributionData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800 font-medium">Low Risk Areas</span>
                    <span className="text-green-600 font-bold">40%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-yellow-800 font-medium">Medium Risk Areas</span>
                    <span className="text-yellow-600 font-bold">35%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="text-red-800 font-medium">High Risk Areas</span>
                    <span className="text-red-600 font-bold">25%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights for Regional Risk Assessment */}
            <AIInsights
              data={{
                type: 'alerts',
                values: [40, 35, 25],
                metadata: {
                  lowRisk: 40,
                  mediumRisk: 35,
                  highRisk: 25,
                  primaryThreats: ['drought', 'flooding', 'extreme temperatures']
                }
              }}
              title="Regional Climate Risk Assessment"
            />
          </div>
        )}

        {activeTab === 'counties' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">County Climate Data</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {counties.map((county) => (
                  <div key={county.name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{county.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        county.risk === 'low' ? 'bg-green-100 text-green-800' :
                        county.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {county.risk} risk
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Temperature:</span>
                        <span className="text-sm font-medium">{county.temp}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Rainfall:</span>
                        <span className="text-sm font-medium">{county.rainfall}mm</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights for County Data */}
            <AIInsights
              data={{
                type: 'temperature',
                values: counties.map(c => c.temp),
                metadata: {
                  counties: counties.map(c => ({
                    name: c.name,
                    temperature: c.temp,
                    rainfall: c.rainfall,
                    riskLevel: c.risk
                  })),
                  highestRisk: counties.filter(c => c.risk === 'high').map(c => c.name),
                  averageTemp: counties.reduce((sum, c) => sum + c.temp, 0) / counties.length
                }
              }}
              title="County Climate Analysis"
            />
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Climate Alerts & Warnings</h2>
              
              {/* Alert Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-900">Critical Alerts</p>
                      <p className="text-xl font-bold text-red-600">3</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-yellow-900">Medium Alerts</p>
                      <p className="text-xl font-bold text-yellow-600">7</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <CloudIcon className="h-6 w-6 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-900">Weather Watches</p>
                      <p className="text-xl font-bold text-blue-600">12</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-900">Advisories</p>
                      <p className="text-xl font-bold text-green-600">15</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-red-500 bg-red-50 p-4">
                  <div className="flex">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Drought Warning - Northern Kenya</h3>
                      <p className="mt-1 text-sm text-red-700">
                        Severe drought conditions expected in Turkana and Marsabit counties. Water levels critically low.
                      </p>
                      <p className="mt-1 text-xs text-red-600">Issued: 2 hours ago</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4">
                  <div className="flex">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Heavy Rainfall Alert - Coast Region</h3>
                      <p className="mt-1 text-sm text-yellow-700">
                        Above-normal rainfall expected in Mombasa and Kilifi. Potential for localized flooding.
                      </p>
                      <p className="mt-1 text-xs text-yellow-600">Issued: 6 hours ago</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
                  <div className="flex">
                    <CloudIcon className="h-5 w-5 text-blue-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Temperature Advisory - Central Kenya</h3>
                      <p className="mt-1 text-sm text-blue-700">
                        Unusually high temperatures expected in Nairobi and surrounding areas this week.
                      </p>
                      <p className="mt-1 text-xs text-blue-600">Issued: 1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights for Alert System */}
            <AIInsights
              data={{
                type: 'alerts',
                values: [3, 7, 12, 15],
                metadata: {
                  criticalAlerts: 3,
                  mediumAlerts: 7,
                  weatherWatches: 12,
                  advisories: 15,
                  primaryThreats: ['drought', 'heavy rainfall', 'extreme temperatures'],
                  affectedRegions: ['Northern Kenya', 'Coast Region', 'Central Kenya']
                }
              }}
              title="Climate Alert System Analysis"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClimateDashboard;