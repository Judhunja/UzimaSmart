/**
 * CommunityReports Component - Displays community-submitted climate reports
 */

'use client'

import { useState, useEffect } from 'react'

interface CommunityReportsProps {
  countyId?: number
}

interface Report {
  id: number
  type: string
  description: string
  location: string
  submittedAt: string
  severity: 'low' | 'medium' | 'high'
}

export function CommunityReports({ countyId }: CommunityReportsProps) {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (countyId) {
      loadReports()
    }
  }, [countyId])

  const loadReports = async () => {
    setLoading(true)
    try {
      // Simulate API call - replace with actual API
      setTimeout(() => {
        setReports([
          {
            id: 1,
            type: 'Drought',
            description: 'Severe water shortage in the area. Livestock dying.',
            location: 'Kibera',
            submittedAt: '2025-08-26T10:30:00Z',
            severity: 'high'
          },
          {
            id: 2,
            type: 'Flooding',
            description: 'Roads flooded after heavy rainfall.',
            location: 'Westlands',
            submittedAt: '2025-08-25T14:15:00Z',
            severity: 'medium'
          }
        ])
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error loading reports:', error)
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Community Reports</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Community Reports</h2>
        <span className="text-sm text-gray-500">
          {reports.length} report{reports.length !== 1 ? 's' : ''}
        </span>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📝</div>
          <p className="text-gray-500">No reports available for this county</p>
          <p className="text-sm text-gray-400 mt-1">
            Community members can submit climate-related reports
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium text-gray-900">{report.type}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                      {report.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{report.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>📍 {report.location}</span>
                    <span>🕒 {new Date(report.submittedAt).toLocaleDateString()}</span>
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
