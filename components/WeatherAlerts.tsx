/**
 * WeatherAlerts Component - Displays weather alerts and warnings
 */

'use client'

import { useState, useEffect } from 'react'

interface WeatherAlertsProps {
  countyId?: number
}

interface Alert {
  id: number
  type: 'warning' | 'watch' | 'advisory'
  severity: 'low' | 'medium' | 'high' | 'extreme'
  title: string
  description: string
  issuedAt: string
  expiresAt: string
  icon: string
}

export function WeatherAlerts({ countyId }: WeatherAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (countyId) {
      loadAlerts()
    }
  }, [countyId])

  const loadAlerts = async () => {
    setLoading(true)
    try {
      // Simulate API call - replace with actual weather service API
      setTimeout(() => {
        setAlerts([
          {
            id: 1,
            type: 'warning',
            severity: 'high',
            title: 'Drought Warning',
            description: 'Extended dry period expected. Water conservation advised.',
            issuedAt: '2025-08-27T08:00:00Z',
            expiresAt: '2025-09-03T08:00:00Z',
            icon: '🌵'
          },
          {
            id: 2,
            type: 'advisory',
            severity: 'medium',
            title: 'High Temperature Advisory',
            description: 'Temperatures may reach 35°C. Stay hydrated.',
            issuedAt: '2025-08-27T06:00:00Z',
            expiresAt: '2025-08-28T18:00:00Z',
            icon: '🌡️'
          }
        ])
        setLoading(false)
      }, 800)
    } catch (error) {
      console.error('Error loading alerts:', error)
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme': return 'bg-red-600 text-white'
      case 'high': return 'bg-red-500 text-white'
      case 'medium': return 'bg-yellow-500 text-white'
      case 'low': return 'bg-blue-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-red-400 bg-red-50'
      case 'watch': return 'border-yellow-400 bg-yellow-50'
      case 'advisory': return 'border-blue-400 bg-blue-50'
      default: return 'border-gray-400 bg-gray-50'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Weather Alerts</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="border rounded-lg p-3">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Weather Alerts</h3>
      
      {alerts.length === 0 ? (
        <div className="text-center py-6">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-sm text-gray-500">No active alerts</p>
          <p className="text-xs text-gray-400 mt-1">
            All clear for this county
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`border-l-4 rounded-lg p-3 ${getTypeColor(alert.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{alert.icon}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900 text-sm">{alert.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 mt-1">{alert.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Expires: {new Date(alert.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
