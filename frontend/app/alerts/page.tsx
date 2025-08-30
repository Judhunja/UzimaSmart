import { ClimateAlerts } from '@/components/alerts/ClimateAlerts'

export default function AlertsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Climate Alerts</h1>
          <p className="text-gray-600">Early warning system for climate-related events and conditions</p>
        </div>
        <ClimateAlerts />
      </main>
    </div>
  )
}
