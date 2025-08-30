'use client'

import { useState, useEffect } from 'react'
import { MapPinIcon, ExclamationTriangleIcon, CheckCircleIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { reportsService, Report, CreateReportData } from '@/services/reportsService'

const eventTypes = [
  { id: 'flooding', name: 'Flooding', description: 'Water overflow, waterlogged areas', color: 'blue' },
  { id: 'drought', name: 'Drought', description: 'Extended dry conditions, water scarcity', color: 'red' },
  { id: 'crop_damage', name: 'Crop Damage', description: 'Pest attacks, disease, weather damage', color: 'yellow' },
  { id: 'extreme_weather', name: 'Extreme Weather', description: 'Unusual temperature, wind, hail', color: 'purple' },
  { id: 'pest_outbreak', name: 'Pest Outbreak', description: 'Insect or pest damage to crops', color: 'orange' },
  { id: 'disease_outbreak', name: 'Disease Outbreak', description: 'Plant or animal diseases', color: 'pink' }
]

const kenyanCounties = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Meru', 'Nyeri', 'Machakos',
  'Kilifi', 'Garissa', 'Kakamega', 'Thika', 'Kiambu', 'Kajiado', 'Muranga', 'Kitui',
  'Embu', 'Tharaka-Nithi', 'Lamu', 'Taita-Taveta', 'Kwale', 'Tana River', 'Homa Bay',
  'Migori', 'Kisii', 'Nyamira', 'Narok', 'Bomet', 'Kericho', 'Nandi', 'Baringo',
  'Laikipia', 'Samburu', 'Trans-Nzoia', 'Uasin Gishu', 'Elgeyo-Marakwet', 'West Pokot',
  'Turkana', 'Marsabit', 'Isiolo', 'Wajir', 'Mandera', 'Siaya', 'Busia', 'Vihiga',
  'Bungoma', 'Makueni'
]

export default function CommunityReportsPage() {
  const [formData, setFormData] = useState<CreateReportData>({
    eventType: '',
    county: '',
    description: '',
    severity: 'moderate',
    contactNumber: '',
    reporterName: '',
    locationDetails: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [recentReports, setRecentReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  // Load recent reports
  useEffect(() => {
    const loadReports = async () => {
      setLoading(true)
      const result = await reportsService.getReports({ limit: 10 })
      if (result.success && result.data) {
        setRecentReports(result.data.reports)
      }
      setLoading(false)
    }

    loadReports()

    // Subscribe to real-time updates
    const subscribePromise = reportsService.subscribeToReports((reports) => {
      setRecentReports(reports.slice(0, 10)) // Keep only recent 10
    }, { limit: 10 })

    return () => {
      subscribePromise.then(unsubscribe => {
        if (unsubscribe) unsubscribe()
      })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      const result = await reportsService.createReport(formData)
      
      if (result.success) {
        setSubmitSuccess(true)
        setFormData({
          eventType: '',
          county: '',
          description: '',
          severity: 'moderate',
          contactNumber: '',
          reporterName: '',
          locationDetails: ''
        })
        
        // Hide success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000)
        
        // Refresh reports list
        const updatedReports = await reportsService.getReports({ limit: 10 })
        if (updatedReports.success && updatedReports.data) {
          setRecentReports(updatedReports.data.reports)
        }
      } else {
        setSubmitError(result.error || 'Failed to submit report')
      }
    } catch (error) {
      setSubmitError('Network error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmReport = async (reportId: string) => {
    const phoneNumber = prompt('Enter your phone number to confirm this report:')
    if (phoneNumber) {
      const result = await reportsService.addInteraction(reportId, 'confirm', phoneNumber, 'Confirmed via web interface')
      if (result.success) {
        // Refresh reports to show updated data
        const updatedReports = await reportsService.getReports({ limit: 10 })
        if (updatedReports.success && updatedReports.data) {
          setRecentReports(updatedReports.data.reports)
        }
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'bg-green-100 text-green-800'
      case 'PENDING_REVIEW': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEventColor = (type: string) => {
    const event = eventTypes.find(e => e.id === type)
    switch (event?.color) {
      case 'blue': return 'text-blue-600'
      case 'red': return 'text-red-600'
      case 'yellow': return 'text-yellow-600'
      case 'purple': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Climate Reports</h1>
          <p className="text-gray-600">Report climate events in your area to help your community prepare and respond</p>
        </div>

        {submitSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800">Report submitted successfully! It will be verified and shared with the community.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Report Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Submit Climate Event Report</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Event Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {eventTypes.map((event) => (
                    <label
                      key={event.id}
                      className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                        formData.eventType === event.id
                          ? 'border-blue-600 ring-2 ring-blue-600'
                          : 'border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="eventType"
                        value={event.id}
                        className="sr-only"
                        onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                      />
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">{event.name}</p>
                            <p className="text-gray-500">{event.description}</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* County */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">County</label>
                <select
                  value={formData.county}
                  onChange={(e) => setFormData({...formData, county: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select your county</option>
                  {kenyanCounties.map((county) => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe what you observed... (location, severity, impact)"
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Severity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({...formData, severity: e.target.value as 'low' | 'moderate' | 'high' | 'severe'})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low - Minor impact</option>
                  <option value="moderate">Moderate - Some concern</option>
                  <option value="high">High - Significant impact</option>
                  <option value="severe">Severe - Emergency response needed</option>
                </select>
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  For verification and important updates about this report
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !formData.eventType || !formData.county || !formData.description}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Report'
                )}
              </button>
            </form>
          </div>

          {/* Recent Reports */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Community Reports</h2>
              
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading reports...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentReports.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No reports found. Be the first to report!</p>
                  ) : (
                    recentReports.map((report) => (
                      <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <ExclamationTriangleIcon className={`h-5 w-5 mr-2 ${reportsService.getEventTypeColor(report.event_type)}`} />
                            <span className="font-medium text-gray-900 capitalize">
                              {report.event_type.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${reportsService.getStatusColor(report.verification_status)}`}>
                              {report.verification_status.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${reportsService.getSeverityColor(report.severity)}`}>
                              {report.severity.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span>{report.counties?.name || 'Unknown'} County</span>
                          {report.location_details && (
                            <span className="ml-2 text-gray-500">• {report.location_details}</span>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm mb-3">{report.description}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                          <span>{reportsService.formatTimeAgo(report.created_at)}</span>
                          <span>{report.report_count} similar report{report.report_count !== 1 ? 's' : ''}</span>
                        </div>
                        {report.contact_number && (
                          <div className="flex items-center text-xs text-gray-500 mb-2">
                            <PhoneIcon className="h-3 w-3 mr-1" />
                            <span>Contact: {report.contact_number}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Confidence: {Math.round(report.confidence_score * 100)}%</span>
                          </div>
                          <button
                            onClick={() => handleConfirmReport(report.id)}
                            className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                          >
                            Confirm Report
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Verification Info */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">How Report Verification Works</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>Reports are cross-checked with satellite data and weather patterns</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>Multiple reports from the same area increase verification confidence</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>Verified reports trigger SMS alerts to nearby communities</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>Trusted reporters get faster verification for future reports</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
