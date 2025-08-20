'use client'

import { useState, useEffect } from 'react'
import { ChartBarIcon, CurrencyDollarIcon, ShieldCheckIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

interface CarbonMetrics {
  totalCredits: number
  verifiedCredits: number
  pendingCredits: number
  totalValue: number
  monthlyGrowth: number
  sustainabilityScore: number
}

export function CarbonTracker() {
  const [metrics, setMetrics] = useState<CarbonMetrics>({
    totalCredits: 0,
    verifiedCredits: 0,
    pendingCredits: 0,
    totalValue: 0,
    monthlyGrowth: 0,
    sustainabilityScore: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Simulate loading carbon credit data
    const loadData = async () => {
      // In a real app, this would fetch from your API/blockchain
      setTimeout(() => {
        setMetrics({
          totalCredits: 2457,
          verifiedCredits: 2240,
          pendingCredits: 217,
          totalValue: 147420, // in KES
          monthlyGrowth: 12.5,
          sustainabilityScore: 87
        })
        setIsLoading(false)
      }, 1500)
    }

    loadData()
  }, [])

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Blockchain-Powered Carbon Tracking
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track, verify, and monetize your carbon credits with transparent 
            blockchain technology and IPFS storage for immutable records.
          </p>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Credits */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              {(isLoading || !isClient) ? (
                <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <span className="text-sm font-medium text-green-600">
                  +{metrics.monthlyGrowth}%
                </span>
              )}
            </div>
            <div>
              {(isLoading || !isClient) ? (
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
              ) : (
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {metrics.totalCredits.toLocaleString()}
                </div>
              )}
              <div className="text-sm text-gray-600">Total Carbon Credits</div>
              <div className="text-xs text-gray-500 mt-1">tCO₂e equivalent</div>
            </div>
          </div>

          {/* Verified Credits */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 text-white" />
              </div>
              {!isLoading && (
                <span className="text-sm font-medium text-blue-600">
                  {Math.round((metrics.verifiedCredits / metrics.totalCredits) * 100)}%
                </span>
              )}
            </div>
            <div>
              {(isLoading || !isClient) ? (
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
              ) : (
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {metrics.verifiedCredits.toLocaleString()}
                </div>
              )}
              <div className="text-sm text-gray-600">Verified Credits</div>
              <div className="text-xs text-gray-500 mt-1">Blockchain verified</div>
            </div>
          </div>

          {/* Total Value */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              {(isLoading || !isClient) ? (
                <div className="w-24 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
              ) : (
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  KES {metrics.totalValue.toLocaleString()}
                </div>
              )}
              <div className="text-sm text-gray-600">Market Value</div>
              <div className="text-xs text-gray-500 mt-1">@ KES 60/tCO₂e</div>
            </div>
          </div>

          {/* Sustainability Score */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                <GlobeAltIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              {(isLoading || !isClient) ? (
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
              ) : (
                <div className="flex items-center mb-1">
                  <div className="text-3xl font-bold text-gray-900">
                    {metrics.sustainabilityScore}
                  </div>
                  <div className="text-lg text-gray-500 ml-1">/100</div>
                </div>
              )}
              <div className="text-sm text-gray-600">Sustainability Score</div>
              {(!isLoading && isClient) && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${metrics.sustainabilityScore}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-12">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Carbon Credit Transactions</h3>
            <p className="text-sm text-gray-600">Latest blockchain-verified transactions</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { id: '0x7d4a...', amount: 125, source: 'Reforestation', status: 'Verified', date: '2024-01-15' },
                  { id: '0x9f2b...', amount: 89, source: 'Solar Energy', status: 'Verified', date: '2024-01-14' },
                  { id: '0x3e8c...', amount: 67, source: 'Soil Carbon', status: 'Pending', date: '2024-01-13' },
                  { id: '0x1a5d...', amount: 234, source: 'Biomass', status: 'Verified', date: '2024-01-12' },
                ].map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-primary-600">{transaction.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.amount} tCO₂e</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.source}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.status === 'Verified' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary px-8 py-3 text-lg">
              Record New Activity
            </button>
            <button className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200">
              View Marketplace
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
