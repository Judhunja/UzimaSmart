'use client'

interface SimpleAlertsProps {
  county?: string
}

export default function SimpleAlerts({ county = 'nairobi' }: SimpleAlertsProps) {
  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'High Temperature Alert',
      message: 'Temperature expected to reach 35°C today',
      severity: 'medium',
      icon: '🌡️'
    },
    {
      id: 2,
      type: 'info',
      title: 'Rainfall Forecast',
      message: 'Light rain expected this afternoon',
      severity: 'low',
      icon: '🌧️'
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800'
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      default: return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        🚨 Weather Alerts
      </h3>
      
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start space-x-3">
              <span className="text-lg">{alert.icon}</span>
              <div className="flex-1">
                <h4 className="font-medium">{alert.title}</h4>
                <p className="text-sm opacity-80 mt-1">{alert.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
        View All Alerts →
      </button>
    </div>
  )
}
