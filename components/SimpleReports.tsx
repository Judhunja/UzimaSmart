'use client'

interface SimpleReportsProps {
  county?: string
}

export default function SimpleReports({ county = 'nairobi' }: SimpleReportsProps) {
  const reports = [
    {
      id: 1,
      title: 'Drought conditions reported',
      location: 'Machakos County',
      time: '2 hours ago',
      severity: 'high',
      icon: '🏜️'
    },
    {
      id: 2,
      title: 'Heavy rainfall in progress',
      location: 'Kisumu County',
      time: '4 hours ago',
      severity: 'medium',
      icon: '🌧️'
    },
    {
      id: 3,
      title: 'Normal weather conditions',
      location: 'Nairobi County',
      time: '6 hours ago',
      severity: 'low',
      icon: '☀️'
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      default: return 'text-green-600'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        📋 Community Reports
      </h3>
      
      <div className="space-y-3">
        {reports.map((report) => (
          <div key={report.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
            <span className="text-lg">{report.icon}</span>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{report.title}</h4>
              <p className="text-sm text-gray-600">{report.location}</p>
              <p className="text-xs text-gray-500 mt-1">{report.time}</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${getSeverityColor(report.severity)} bg-current opacity-30`}></div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
        Submit Report →
      </button>
    </div>
  )
}
