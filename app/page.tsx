import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { CarbonTracker } from '@/components/sections/CarbonTracker'
import { AgricultureDashboard } from '@/components/sections/AgricultureDashboard'
import { EnergyMonitor } from '@/components/sections/EnergyMonitor'
import { ConservationAlerts } from '@/components/sections/ConservationAlerts'
import CarbonCreditDashboard from '@/components/sections/CarbonCreditDashboard'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <CarbonTracker />
      <CarbonCreditDashboard />
      <AgricultureDashboard />
      <EnergyMonitor />
      <ConservationAlerts />
    </div>
  )
}
