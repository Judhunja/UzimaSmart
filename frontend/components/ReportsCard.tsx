'use client'

interface ReportsCardProps {
  county: string
}

export default function ReportsCard({ county }: ReportsCardProps) {
  // Mock reports data
  const reports = [
    {
      id: 1,
      type: 'Drought',
      location: 'Kibera',
      severity: 'high',
      time: '1 hour ago'
    },
    {
      id: 2,
      type: 'Flooding',
      location: 'Westlands',
      severity: 'medium',
      time: '3 hours ago'
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'Drought': return '🌵'
      case 'Flooding': return '🌊'
      case 'Heat': return '🔥'
      default: return '📝'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Community Reports</h3>
        <span className="text-2xl">📝</span>
      </div>
      
      {reports.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📝</div>
          <p>No recent reports</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map(report => (
            <div key={report.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">{getReportIcon(report.type)}</span>
                <span className="font-medium text-gray-900">{report.type}</span>
                <span className={`text-xs font-medium ${getSeverityColor(report.severity)}`}>
                  ({report.severity})
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <div>📍 {report.location}</div>
                <div className="text-xs text-gray-500 mt-1">🕒 {report.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 space-y-2">
        <button className="w-full text-sm bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Submit New Report
        </button>
        <button className="w-full text-sm text-blue-600 hover:text-blue-800">
          View All Reports →
        </button>
      </div>
    </div>
  )
}
