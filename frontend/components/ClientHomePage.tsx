'use client'

import Navigation from '@/components/Navigation'
import Link from 'next/link'

export default function ClientHomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            UzimaSmart Climate Monitor
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering Kenyan communities with real-time climate data, weather forecasts, 
            and intelligent analytics to support informed agricultural and environmental decisions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🌡️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Weather Monitoring</h3>
            <p className="text-gray-600 mb-4">
              Real-time weather data and 7-day forecasts for all 47 Kenyan counties 
              with temperature, humidity, rainfall, and wind speed tracking.
            </p>
            <div className="text-sm text-blue-600">
              • Live weather updates
              • County-specific forecasts
              • Historical weather data
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Climate Analytics</h3>
            <p className="text-gray-600 mb-4">
              Advanced analytics powered by satellite data including NDVI vegetation index, 
              soil moisture levels, and drought risk assessment.
            </p>
            <div className="text-sm text-green-600">
              • NDVI vegetation monitoring
              • Soil moisture analysis
              • Drought risk indicators
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🚨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Alert System</h3>
            <p className="text-gray-600 mb-4">
              Intelligent early warning system for extreme weather events, pest outbreaks, 
              and agricultural advisories delivered via SMS and app notifications.
            </p>
            <div className="text-sm text-orange-600">
              • Weather warnings
              • Agricultural alerts
              • SMS notifications
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Reports</h3>
            <p className="text-gray-600 mb-4">
              Crowdsourced reports from farmers and local communities about crop health, 
              pest sightings, and local climate observations.
            </p>
            <div className="text-sm text-purple-600">
              • Crop health reports
              • Pest & disease alerts
              • Local observations
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Maps</h3>
            <p className="text-gray-600 mb-4">
              Visual climate maps showing rainfall patterns, temperature distributions, 
              and vegetation health across Kenya.
            </p>
            <div className="text-sm text-indigo-600">
              • Rainfall maps
              • Temperature overlays
              • Vegetation indices
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile & USSD Access</h3>
            <p className="text-gray-600 mb-4">
              Access climate data through multiple channels including web app, 
              mobile USSD codes, and SMS for farmers without smartphones.
            </p>
            <div className="text-sm text-teal-600">
              • USSD integration
              • SMS services
              • Mobile-first design
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Supporting Kenya's Agricultural Community
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">47</div>
              <div className="text-sm text-gray-600">Counties Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">1000+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">500+</div>
              <div className="text-sm text-gray-600">Daily Reports</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-gray-600">Data Monitoring</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Make Informed Climate Decisions?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of Kenyan farmers and communities using UzimaSmart 
              for better agricultural and environmental planning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/dashboard"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View Dashboard
              </Link>
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Need Help Getting Started?
            </h3>
            <p className="text-gray-600 mb-4">
              Contact our support team for training and technical assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <div className="flex items-center justify-center space-x-2">
                <span>📞</span>
                <span>+254 700 000 000</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>✉️</span>
                <span>support@uzimasmart.ke</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>📱</span>
                <span>*123# (USSD)</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
