
import ClimateDashboard from '@/components/dashboard/ClimateDashboard'
import EnhancedClimateDashboard from '@/components/dashboard/EnhancedClimateDashboard'
import { ClimateMap } from '@/components/maps/ClimateMap'
import { WeatherDashboard } from '@/components/weather/WeatherDashboard'
import { ClimateAlerts } from '@/components/alerts/ClimateAlerts'
import SMSSubscriptionPanel from '@/components/sms/SMSSubscriptionPanel'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        <EnhancedClimateDashboard />
        <ClimateMap />
        <WeatherDashboard />
        <ClimateAlerts />
        <SMSSubscriptionPanel />
      </main>
    </div>
  )
}
