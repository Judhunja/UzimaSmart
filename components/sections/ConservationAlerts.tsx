'use client'

import { useState, useEffect } from 'react'
import { 
  ShieldExclamationIcon, 
  FireIcon, 
  MapIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface ConservationAlert {
  id: string
  type: 'deforestation' | 'fire' | 'illegal_logging' | 'erosion' | 'wildlife'
  severity: 'low' | 'medium' | 'high' | 'critical'
  location: string
  coordinates: { lat: number; lng: number }
  area: number
  description: string
  detectedAt: string
  status: 'active' | 'investigating' | 'resolved'
  confidence: number
}

export function ConservationAlerts() {
  const [alerts, setAlerts] = useState<ConservationAlert[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'critical'>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading conservation alerts from satellite analysis
    const loadAlerts = async () => {
      setTimeout(() => {
        setAlerts([
          {
            id: '1',
            type: 'deforestation',
            severity: 'high',
            location: 'Mau Forest Complex',
            coordinates: { lat: -0.5, lng: 35.8 },
            area: 45.2,
            description: 'Large-scale clearing detected in protected area',
            detectedAt: '2 hours ago',
            status: 'active',
            confidence: 94
          },
          {
            id: '2',
            type: 'fire',
            severity: 'critical',
            location: 'Tsavo East National Park',
            coordinates: { lat: -2.8, lng: 38.5 },
            area: 127.8,
            description: 'Wildfire spreading rapidly in wildlife corridor',
            detectedAt: '45 minutes ago',
            status: 'active',
            confidence: 98
          },
          {
            id: '3',
            type: 'illegal_logging',
            severity: 'medium',
            location: 'Kakamega Forest',
            coordinates: { lat: 0.3, lng: 34.9 },
            area: 12.5,
            description: 'Unusual clearing patterns suggest illegal activity',
            detectedAt: '6 hours ago',
            status: 'investigating',
            confidence: 87
          },
          {
            id: '4',
            type: 'erosion',
            severity: 'low',
            location: 'Laikipia County',
            coordinates: { lat: 0.1, lng: 36.8 },
            area: 8.3,
            description: 'Soil erosion detected along riverbank',
            detectedAt: '1 day ago',
            status: 'resolved',
            confidence: 76
          }
        ])
        setIsLoading(false)
      }, 1000)
    }

    loadAlerts()
  }, [])

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'fire':
        return FireIcon
      case 'deforestation':
      case 'illegal_logging':
        return ShieldExclamationIcon
      default:
        return ExclamationTriangleIcon
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50 text-red-700'
      case 'high':
        return 'border-orange-500 bg-orange-50 text-orange-700'
      case 'medium':
        return 'border-yellow-500 bg-yellow-50 text-yellow-700'
      case 'low':
        return 'border-blue-500 bg-blue-50 text-blue-700'
      default:
        return 'border-gray-500 bg-gray-50 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return CheckCircleIcon
      case 'investigating':
        return ClockIcon
      default:
        return ExclamationTriangleIcon
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'text-green-600 bg-green-100'
      case 'investigating':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-red-600 bg-red-100'
    }
  }

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true
    if (filter === 'active') return alert.status === 'active'
    if (filter === 'critical') return alert.severity === 'critical'
    return true
  })

  const stats = {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    resolved: alerts.filter(a => a.status === 'resolved').length
  }

  return (
    <section className="py-20 bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Conservation Monitoring
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time satellite analysis detects deforestation, illegal logging, 
            and ecosystem threats to protect Kenya's natural heritage.
          </p>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Alerts</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{stats.active}</div>
            <div className="text-sm text-gray-600">Active Threats</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{stats.critical}</div>
            <div className="text-sm text-gray-600">Critical Level</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.resolved}</div>
            <div className="text-sm text-gray-600">Resolved</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg border border-gray-200">
            {(['all', 'active', 'critical'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  filter === filterOption
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)} Alerts
              </button>
            ))}
          </div>
        </div>

        {/* Alerts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {isLoading ? (
            // Loading skeletons
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : (
            filteredAlerts.map((alert) => {
              const AlertIcon = getAlertIcon(alert.type)
              const StatusIcon = getStatusIcon(alert.status)
              
              return (
                <div 
                  key={alert.id} 
                  className={`bg-white rounded-2xl shadow-lg border-l-4 p-6 hover:shadow-xl transition-all duration-300 ${getAlertColor(alert.severity)}`}
                >
                  {/* Alert Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                        alert.severity === 'critical' ? 'bg-red-500' :
                        alert.severity === 'high' ? 'bg-orange-500' :
                        alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}>
                        <AlertIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {alert.type.replace('_', ' ')}
                        </h3>
                        <p className="text-sm text-gray-600">{alert.location}</p>
                      </div>
                    </div>
                    <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                      <StatusIcon className="w-4 h-4 mr-1" />
                      {alert.status}
                    </div>
                  </div>

                  {/* Alert Details */}
                  <div className="mb-4">
                    <p className="text-gray-700 mb-3">{alert.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Area Affected:</span>
                        <div className="text-gray-900">{alert.area} hectares</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Detection Time:</span>
                        <div className="text-gray-900">{alert.detectedAt}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Confidence:</span>
                        <div className="text-gray-900">{alert.confidence}%</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Severity:</span>
                        <div className={`capitalize font-semibold ${
                          alert.severity === 'critical' ? 'text-red-600' :
                          alert.severity === 'high' ? 'text-orange-600' :
                          alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                        }`}>
                          {alert.severity}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center">
                      <MapIcon className="w-4 h-4 mr-2" />
                      View on Map
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200">
                      Take Action
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Satellite Monitoring Info */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Advanced Satellite Monitoring</h3>
            <p className="text-blue-100 mb-6 max-w-3xl mx-auto">
              Our AI analyzes high-resolution satellite imagery from NASA Landsat and Sentinel Hub 
              to detect environmental threats in real-time, enabling rapid response to protect Kenya's ecosystems.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-blue-200 mb-2">24/7</div>
                <div className="text-blue-100">Continuous Monitoring</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-200 mb-2">10m</div>
                <div className="text-purple-100">Resolution Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-200 mb-2">95%</div>
                <div className="text-cyan-100">Detection Accuracy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary px-8 py-3 text-lg">
              Report Environmental Threat
            </button>
            <button className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors duration-200">
              View Conservation Map
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200">
              Download Alert Report
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
