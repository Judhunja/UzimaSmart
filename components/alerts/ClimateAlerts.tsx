'use client'

import { useState, useEffect } from 'react'
import { 
  ExclamationTriangleIcon,
  FireIcon,
  CloudIcon,
  SunIcon,
  MapPinIcon,
  ClockIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { AIInsights } from '@/components/insights/AIInsights'

interface ClimateAlert {
  id: string
  type: 'drought' | 'flood' | 'storm' | 'heatwave' | 'frost' | 'wildfire'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  counties: string[]
  coordinates: {
    lat: number
    lng: number
  }
  issuedAt: string
  expiresAt: string
  isActive: boolean
  source: string
  affectedPopulation?: number
  recommendations: string[]
}

export function ClimateAlerts() {
  const [alerts, setAlerts] = useState<ClimateAlert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<ClimateAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    severity: 'all',
    type: 'all',
    status: 'active'
  })

  useEffect(() => {
    fetchAlerts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [alerts, filters])

  const fetchAlerts = async () => {
    try {
      // Mock alerts data - in real app this would come from backend
      const mockAlerts: ClimateAlert[] = [
        {
          id: '1',
          type: 'drought',
          severity: 'critical',
          title: 'Severe Drought Emergency',
          description: 'Extreme drought conditions persist with rainfall 75% below normal. Immediate water conservation and livestock management required.',
          counties: ['Turkana', 'Marsabit', 'Mandera', 'Wajir'],
          coordinates: { lat: 3.1192, lng: 35.6045 },
          issuedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
          source: 'National Drought Management Authority',
          affectedPopulation: 500000,
          recommendations: [
            'Implement emergency water trucking',
            'Distribute drought-resistant seeds',
            'Provide livestock feed supplements',
            'Set up temporary water points'
          ]
        },
        {
          id: '2',
          type: 'flood',
          severity: 'high',
          title: 'Flash Flood Warning',
          description: 'Heavy rainfall expected to cause flash flooding in river basins and low-lying areas over the next 48 hours.',
          counties: ['Tana River', 'Garissa', 'Lamu'],
          coordinates: { lat: -1.0, lng: 40.0 },
          issuedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
          source: 'Kenya Meteorological Department',
          affectedPopulation: 200000,
          recommendations: [
            'Evacuate from flood-prone areas',
            'Avoid crossing swollen rivers',
            'Move livestock to higher ground',
            'Prepare emergency supplies'
          ]
        },
        {
          id: '3',
          type: 'heatwave',
          severity: 'medium',
          title: 'Extreme Heat Advisory',
          description: 'Temperatures expected to reach 38-42°C. Heat stress risk for vulnerable populations and livestock.',
          counties: ['Mombasa', 'Kilifi', 'Kwale', 'Taita Taveta'],
          coordinates: { lat: -4.0435, lng: 39.6682 },
          issuedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
          source: 'Kenya Meteorological Department',
          affectedPopulation: 3500000,
          recommendations: [
            'Stay hydrated and avoid direct sunlight',
            'Provide adequate shade for livestock',
            'Adjust work schedules to cooler hours',
            'Check on vulnerable community members'
          ]
        },
        {
          id: '4',
          type: 'storm',
          severity: 'high',
          title: 'Severe Thunderstorm Warning',
          description: 'Severe thunderstorms with strong winds, heavy rain, and possible hail expected.',
          counties: ['Nairobi', 'Kiambu', 'Kajiado'],
          coordinates: { lat: -1.2921, lng: 36.8219 },
          issuedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
          isActive: true,
          source: 'Kenya Meteorological Department',
          affectedPopulation: 6000000,
          recommendations: [
            'Secure loose outdoor items',
            'Avoid travel if possible',
            'Stay indoors during the storm',
            'Protect crops and livestock'
          ]
        },
        {
          id: '5',
          type: 'wildfire',
          severity: 'medium',
          title: 'Wildfire Risk Elevated',
          description: 'Dry conditions and strong winds create elevated wildfire risk. Exercise extreme caution with any fire use.',
          counties: ['Laikipia', 'Nyeri', 'Nyandarua'],
          coordinates: { lat: 0.0, lng: 36.5 },
          issuedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
          source: 'Kenya Forest Service',
          affectedPopulation: 800000,
          recommendations: [
            'Avoid outdoor burning',
            'Clear vegetation around buildings',
            'Prepare evacuation plans',
            'Report smoke or fires immediately'
          ]
        },
        {
          id: '6',
          type: 'frost',
          severity: 'low',
          title: 'Frost Advisory',
          description: 'Temperatures may drop below 0°C in highland areas. Protect sensitive crops.',
          counties: ['Nyandarua', 'Nyeri', 'Meru'],
          coordinates: { lat: -0.4, lng: 36.9 },
          issuedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          isActive: false,
          source: 'Kenya Meteorological Department',
          affectedPopulation: 300000,
          recommendations: [
            'Cover sensitive plants',
            'Protect water pipes from freezing',
            'Provide shelter for livestock',
            'Monitor vulnerable crops'
          ]
        }
      ]

      setAlerts(mockAlerts)
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = alerts

    if (filters.status === 'active') {
      filtered = filtered.filter(alert => alert.isActive)
    } else if (filters.status === 'expired') {
      filtered = filtered.filter(alert => !alert.isActive)
    }

    if (filters.severity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === filters.severity)
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(alert => alert.type === filters.type)
    }

    setFilteredAlerts(filtered)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-700'
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-700'
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-700'
      case 'low': return 'bg-blue-100 border-blue-500 text-blue-700'
      default: return 'bg-gray-100 border-gray-500 text-gray-700'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'drought': return SunIcon
      case 'flood': return CloudIcon
      case 'storm': return CloudIcon
      case 'heatwave': return SunIcon
      case 'frost': return SunIcon
      case 'wildfire': return FireIcon
      default: return ExclamationTriangleIcon
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'drought': return 'text-yellow-600'
      case 'flood': return 'text-blue-600'
      case 'storm': return 'text-gray-600'
      case 'heatwave': return 'text-red-600'
      case 'frost': return 'text-cyan-600'
      case 'wildfire': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  const activeAlerts = alerts.filter(alert => alert.isActive)
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical')
  const totalAffected = activeAlerts.reduce((sum, alert) => sum + (alert.affectedPopulation || 0), 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Climate Alerts</h2>
            <p className="text-red-100">Early warning system for climate hazards</p>
          </div>
          <ExclamationTriangleIcon className="w-12 h-12 text-red-200" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">{activeAlerts.length}</div>
            <div className="text-sm text-red-100">Active Alerts</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">{criticalAlerts.length}</div>
            <div className="text-sm text-red-100">Critical Alerts</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">{(totalAffected / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-red-100">People Affected</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-wrap items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Filter Alerts</h3>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Severity:</label>
            <select
              value={filters.severity}
              onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              <option value="all">All</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Type:</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              <option value="all">All</option>
              <option value="drought">Drought</option>
              <option value="flood">Flood</option>
              <option value="storm">Storm</option>
              <option value="heatwave">Heatwave</option>
              <option value="frost">Frost</option>
              <option value="wildfire">Wildfire</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredAlerts.length} of {alerts.length} alerts
          </div>
        </div>

        {/* AI Insights for Alert Patterns */}
        <div className="mt-6">
          <AIInsights
            data={{
              type: 'alerts',
              values: filteredAlerts.map((_, index) => index),
              location: 'Kenya',
              timeframe: 'current',
              metadata: {
                severityDistribution: {
                  critical: filteredAlerts.filter(a => a.severity === 'critical').length,
                  high: filteredAlerts.filter(a => a.severity === 'high').length,
                  medium: filteredAlerts.filter(a => a.severity === 'medium').length,
                  low: filteredAlerts.filter(a => a.severity === 'low').length
                },
                typeDistribution: {
                  drought: filteredAlerts.filter(a => a.type === 'drought').length,
                  flood: filteredAlerts.filter(a => a.type === 'flood').length,
                  storm: filteredAlerts.filter(a => a.type === 'storm').length,
                  heatwave: filteredAlerts.filter(a => a.type === 'heatwave').length,
                  wildfire: filteredAlerts.filter(a => a.type === 'wildfire').length,
                  frost: filteredAlerts.filter(a => a.type === 'frost').length
                },
                totalAffected: filteredAlerts.reduce((sum, alert) => sum + (alert.affectedPopulation || 0), 0)
              }
            }}
            title="Alert Pattern Analysis"
          />
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Alerts Found</h3>
            <p className="text-gray-600">
              {filters.status === 'active' 
                ? 'No active climate alerts matching your filters'
                : 'No alerts found matching your criteria'
              }
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const TypeIcon = getTypeIcon(alert.type)
            const StatusIcon = alert.isActive ? ExclamationTriangleIcon : CheckCircleIcon
            
            return (
              <div key={alert.id} className={`border-l-4 rounded-lg shadow-lg ${getSeverityColor(alert.severity)}`}>
                <div className="bg-white p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${alert.isActive ? 'bg-red-100' : 'bg-green-100'}`}>
                        <TypeIcon className={`w-6 h-6 ${getTypeColor(alert.type)}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          {alert.isActive ? (
                            <span className="flex items-center text-xs text-red-600">
                              <StatusIcon className="w-4 h-4 mr-1" />
                              ACTIVE
                            </span>
                          ) : (
                            <span className="flex items-center text-xs text-green-600">
                              <StatusIcon className="w-4 h-4 mr-1" />
                              EXPIRED
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-700 mb-4">{alert.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="flex items-center text-gray-600 mb-1">
                              <MapPinIcon className="w-4 h-4 mr-2" />
                              <strong>Affected Counties:</strong>
                            </div>
                            <div className="ml-6">{alert.counties.join(', ')}</div>
                          </div>
                          
                          <div>
                            <div className="flex items-center text-gray-600 mb-1">
                              <EyeIcon className="w-4 h-4 mr-2" />
                              <strong>Population Affected:</strong>
                            </div>
                            <div className="ml-6">{alert.affectedPopulation?.toLocaleString() || 'Unknown'}</div>
                          </div>
                          
                          <div>
                            <div className="flex items-center text-gray-600 mb-1">
                              <ClockIcon className="w-4 h-4 mr-2" />
                              <strong>Issued:</strong>
                            </div>
                            <div className="ml-6">{new Date(alert.issuedAt).toLocaleString()}</div>
                          </div>
                          
                          <div>
                            <div className="flex items-center text-gray-600 mb-1">
                              <ClockIcon className="w-4 h-4 mr-2" />
                              <strong>Expires:</strong>
                            </div>
                            <div className="ml-6">{new Date(alert.expiresAt).toLocaleString()}</div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-900 mb-2">Recommended Actions:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {alert.recommendations.map((rec, index) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mt-4 text-xs text-gray-500">
                          <strong>Source:</strong> {alert.source}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
