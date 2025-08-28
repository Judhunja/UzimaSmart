'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'

interface Report {
  id: string
  title: string
  description: string
  county: string
  category: 'weather' | 'crops' | 'livestock' | 'environment'
  severity: 'low' | 'medium' | 'high'
  status: 'pending' | 'verified' | 'resolved'
  submittedBy: string
  timestamp: string
  images?: string[]
}

export default function ReportsPage() {
  const [selectedCounty, setSelectedCounty] = useState('Nairobi')
  const [showReportForm, setShowReportForm] = useState(false)
  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
    category: 'weather' as const,
    severity: 'medium' as const
  })

  const mockReports: Report[] = [
    {
      id: '1',
      title: 'Heavy Rainfall Flooding',
      description: 'Excessive rainfall has caused flooding in the lower regions affecting crop fields.',
      county: selectedCounty,
      category: 'weather',
      severity: 'high',
      status: 'pending',
      submittedBy: 'John Kiprotich',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      title: 'Maize Crop Pest Infestation',
      description: 'Observed fall armyworm infestation in maize crops. Immediate intervention needed.',
      county: selectedCounty,
      category: 'crops',
      severity: 'high',
      status: 'verified',
      submittedBy: 'Mary Wanjiku',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      title: 'Drought Stress in Livestock',
      description: 'Cattle showing signs of drought stress due to lack of pasture and water.',
      county: selectedCounty,
      category: 'livestock',
      severity: 'medium',
      status: 'verified',
      submittedBy: 'David Kiplagat',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]

  const handleSubmitReport = () => {
    // In a real app, this would submit to an API
    console.log('Submitting report:', newReport)
    setShowReportForm(false)
    setNewReport({
      title: '',
      description: '',
      category: 'weather',
      severity: 'medium'
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'resolved': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weather': return '🌤️'
      case 'crops': return '🌾'
      case 'livestock': return '🐄'
      case 'environment': return '🌍'
      default: return '📋'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation selectedCounty={selectedCounty} onCountyChange={setSelectedCounty} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Community Reports
            </h1>
            <p className="text-xl text-gray-600">
              Climate and agricultural reports from {selectedCounty}
            </p>
          </div>
          <button 
            onClick={() => setShowReportForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Submit Report</span>
          </button>
        </div>

        {/* Report Form Modal */}
        {showReportForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Submit New Report</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newReport.title}
                    onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief title of the issue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newReport.description}
                    onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Detailed description of the issue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newReport.category}
                    onChange={(e) => setNewReport({...newReport, category: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="weather">Weather</option>
                    <option value="crops">Crops</option>
                    <option value="livestock">Livestock</option>
                    <option value="environment">Environment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity
                  </label>
                  <select
                    value={newReport.severity}
                    onChange={(e) => setNewReport({...newReport, severity: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleSubmitReport}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Submit Report
                </button>
                <button
                  onClick={() => setShowReportForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-4">📊</div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{mockReports.length}</div>
                <div className="text-sm text-gray-600">Total Reports</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-4">⏳</div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {mockReports.filter(r => r.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-4">✅</div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {mockReports.filter(r => r.status === 'verified').length}
                </div>
                <div className="text-sm text-gray-600">Verified</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-4">🚨</div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {mockReports.filter(r => r.severity === 'high').length}
                </div>
                <div className="text-sm text-gray-600">High Priority</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {mockReports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{getCategoryIcon(report.category)}</span>
                      <h4 className="text-lg font-semibold text-gray-900">{report.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getSeverityColor(report.severity)}`}>
                        {report.severity}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{report.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>📍 {report.county}</span>
                      <span>👤 {report.submittedBy}</span>
                      <span>🕒 {new Date(report.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
