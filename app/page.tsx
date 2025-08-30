import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { AgricultureDashboard } from '@/components/sections/AgricultureDashboard'
import SimplePhoneSMSPanel from '@/components/sms/SimplePhoneSMSPanel'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <AgricultureDashboard />
      
      {/* SMS Subscription Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              📱 Stay Informed with SMS Alerts
            </h2>
            <p className="text-lg text-gray-600">
              Get real-time climate updates, weather alerts, and emergency notifications directly on your phone
            </p>
          </div>
          <SimplePhoneSMSPanel />
        </div>
      </section>
    </div>
  )
}
