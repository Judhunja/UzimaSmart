'use client'

interface AlertsCardProps {
  county: string
}

export default function AlertsCard({ county }: AlertsCardProps) {
  // Mock alerts data
  const alerts = [
    {
      id: 1,
      type: 'drought',
      severity: 'medium',
      message: 'Prolonged dry spell expected',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'temperature',
      severity: 'low',
      message: 'Temperature rising above average',
      time: '6 hours ago'
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'drought': return '🌵'
      case 'temperature': return '🌡️'
      case 'rainfall': return '🌧️'
      default: return '⚠️'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Weather Alerts</h3>
        <span className="text-2xl">⚠️</span>
      </div>
      
      {alerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">✅</div>
          <p>No active alerts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className="border-l-4 border-yellow-400 pl-4 py-2">
              <div className="flex items-start space-x-2">
                <span className="text-lg">{getAlertIcon(alert.type)}</span>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800">
        View All Alerts →
      </button>
    </div>
  )
}
