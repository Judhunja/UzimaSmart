'use client'

import { useState, useEffect } from 'react'
import { 
  BoltIcon, 
  SunIcon, 
  ChartBarIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'

interface EnergyMetrics {
  currentConsumption: number
  dailyConsumption: number
  solarProduction: number
  gridConsumption: number
  cost: number
  efficiency: number
  carbonSaved: number
}

export function EnergyMonitor() {
  const [metrics, setMetrics] = useState<EnergyMetrics>({
    currentConsumption: 0,
    dailyConsumption: 0,
    solarProduction: 0,
    gridConsumption: 0,
    cost: 0,
    efficiency: 0,
    carbonSaved: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [forecast, setForecast] = useState({
    nextHour: 0,
    nextDay: 0,
    savings: 0
  })

  useEffect(() => {
    // Simulate loading energy data
    const loadData = async () => {
      setTimeout(() => {
        setMetrics({
          currentConsumption: 3.2,
          dailyConsumption: 45.8,
          solarProduction: 12.4,
          gridConsumption: 33.4,
          cost: 687,
          efficiency: 78,
          carbonSaved: 23.5
        })
        setForecast({
          nextHour: 3.8,
          nextDay: 52.1,
          savings: 145
        })
        setIsLoading(false)
      }, 1200)
    }

    loadData()
  }, [])

  return (
    <section className="py-20 bg-gradient-to-b from-yellow-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Smart Energy Optimization
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time energy monitoring, AI-driven demand forecasting, and 
            smart grid optimization for maximum efficiency and cost savings.
          </p>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Current Consumption */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <BoltIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center text-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-green-600 font-medium">Live</span>
              </div>
            </div>
            <div>
              {isLoading ? (
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
              ) : (
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {metrics.currentConsumption} kW
                </div>
              )}
              <div className="text-sm text-gray-600">Current Usage</div>
              <div className="text-xs text-gray-500 mt-1">Real-time monitoring</div>
            </div>
          </div>

          {/* Solar Production */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <SunIcon className="w-6 h-6 text-white" />
              </div>
              {!isLoading && (
                <div className="flex items-center text-sm">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">+12%</span>
                </div>
              )}
            </div>
            <div>
              {isLoading ? (
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
              ) : (
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {metrics.solarProduction} kW
                </div>
              )}
              <div className="text-sm text-gray-600">Solar Generation</div>
              <div className="text-xs text-gray-500 mt-1">Today's peak: 15.2 kW</div>
            </div>
          </div>

          {/* Daily Cost */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              {!isLoading && (
                <div className="flex items-center text-sm">
                  <ArrowTrendingDownIcon className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">-8%</span>
                </div>
              )}
            </div>
            <div>
              {isLoading ? (
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
              ) : (
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  KES {metrics.cost}
                </div>
              )}
              <div className="text-sm text-gray-600">Daily Cost</div>
              <div className="text-xs text-gray-500 mt-1">vs. KES 748 yesterday</div>
            </div>
          </div>

          {/* Efficiency Score */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              {isLoading ? (
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
              ) : (
                <div className="flex items-center mb-1">
                  <div className="text-3xl font-bold text-gray-900">
                    {metrics.efficiency}%
                  </div>
                </div>
              )}
              <div className="text-sm text-gray-600">Efficiency Score</div>
              {!isLoading && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${metrics.efficiency}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Energy Flow Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Energy Sources */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-yellow-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Energy Sources</h3>
              <p className="text-sm text-gray-600">Real-time production and consumption</p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Solar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-4">
                      <SunIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Solar Panels</div>
                      <div className="text-sm text-gray-600">5.2 kW capacity</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-orange-600">
                      {metrics.solarProduction} kW
                    </div>
                    <div className="text-sm text-gray-500">Active</div>
                  </div>
                </div>

                {/* Grid */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                      <BoltIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Grid Connection</div>
                      <div className="text-sm text-gray-600">Kenya Power</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">
                      {metrics.gridConsumption} kW
                    </div>
                    <div className="text-sm text-gray-500">Backup</div>
                  </div>
                </div>

                {/* Total Usage */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900">Total Consumption</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {metrics.dailyConsumption} kWh
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Today's usage</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Forecasting */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">AI Demand Forecast</h3>
              <p className="text-sm text-gray-600">Machine learning predictions</p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Next Hour */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">Next Hour</div>
                    <div className="text-sm text-gray-600">Predicted demand</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">{forecast.nextHour} kW</div>
                    <div className="text-sm text-green-600">↓ 15% from now</div>
                  </div>
                </div>

                {/* Next Day */}
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">Tomorrow</div>
                    <div className="text-sm text-gray-600">Total consumption</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">{forecast.nextDay} kWh</div>
                    <div className="text-sm text-green-600">↑ 8% vs today</div>
                  </div>
                </div>

                {/* Optimization Tips */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Smart Recommendations</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Run heavy appliances between 10 AM - 2 PM for maximum solar usage</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Peak demand expected at 7 PM - consider load shifting</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Potential savings: KES {forecast.savings} this month</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white mb-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Environmental Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-green-200 mb-2">{metrics.carbonSaved} kg</div>
                <div className="text-green-100">CO₂ Saved Today</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-200 mb-2">156 trees</div>
                <div className="text-blue-100">Equivalent Impact</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-200 mb-2">27%</div>
                <div className="text-yellow-100">Grid Independence</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary px-8 py-3 text-lg">
              Optimize Energy Usage
            </button>
            <button className="border-2 border-yellow-600 text-yellow-600 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-50 transition-colors duration-200">
              View Historical Data
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200">
              Export Report
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
