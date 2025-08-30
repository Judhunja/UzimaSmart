'use client'

interface SimpleWeatherCardProps {
  title: string
  value: string
  icon: string
  trend?: 'up' | 'down' | 'stable'
  change?: string
}

export default function SimpleWeatherCard({ 
  title, 
  value, 
  icon, 
  trend = 'stable', 
  change 
}: SimpleWeatherCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↗️'
      case 'down': return '↘️'
      default: return '→'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${getTrendColor()} flex items-center mt-1`}>
              <span className="mr-1">{getTrendIcon()}</span>
              {change}
            </p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  )
}
