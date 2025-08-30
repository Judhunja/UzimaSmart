import { WeatherDashboard } from '@/components/weather/WeatherDashboard'

export default function WeatherPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Weather Monitoring</h1>
          <p className="text-gray-600">Real-time weather data and forecasts for Kenya's counties</p>
        </div>
        <WeatherDashboard />
      </main>
    </div>
  )
}
