'use client'

import { useState } from 'react'
import { PhoneIcon, ChatBubbleLeftIcon, DevicePhoneMobileIcon, SignalIcon } from '@heroicons/react/24/outline'
import { AIInsights } from '@/components/insights/AIInsights'

const ussdCodes = [
  { code: '*544*1#', description: 'Weather forecast for your county', category: 'weather' },
  { code: '*544*2#', description: 'Current climate alerts', category: 'alerts' },
  { code: '*544*3#', description: 'Agricultural recommendations', category: 'agriculture' },
  { code: '*544*4#', description: 'Report weather observations', category: 'reporting' },
  { code: '*544*5#', description: 'Market prices for crops', category: 'market' }
]

const smsServices = [
  { 
    name: 'Weather Alerts', 
    shortcode: '20544', 
    description: 'Get severe weather alerts sent directly to your phone',
    active: true,
    subscribers: 15420
  },
  { 
    name: 'Daily Forecast', 
    shortcode: '20545', 
    description: 'Daily weather forecast for your registered location',
    active: false,
    subscribers: 8930
  },
  { 
    name: 'Crop Calendar', 
    shortcode: '20546', 
    description: 'Planting and harvesting reminders based on weather patterns',
    active: true,
    subscribers: 12650
  }
]

const recentMessages = [
  {
    id: 1,
    type: 'alert',
    message: 'WEATHER ALERT: Heavy rainfall expected in Central Kenya. Prepare for possible flooding.',
    timestamp: '2 hours ago',
    recipients: 4532
  },
  {
    id: 2,
    type: 'forecast',
    message: 'Today\'s weather: Partly cloudy, 23°C, 40% chance of rain. Good day for field work.',
    timestamp: '6 hours ago',
    recipients: 8920
  },
  {
    id: 3,
    type: 'tip',
    message: 'Farming tip: Plant drought-resistant crops during this season. Sorghum and millet are recommended.',
    timestamp: '1 day ago',
    recipients: 6745
  }
]

export default function SMSUSSDPage() {
  const [selectedCounty, setSelectedCounty] = useState('nairobi')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [selectedService, setSelectedService] = useState('')

  const handleServiceSubscription = () => {
    console.log('Subscribing to service:', selectedService, 'for phone:', phoneNumber)
    // Handle subscription logic
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SMS & USSD Services</h1>
          <p className="text-gray-600">Access climate information via SMS and USSD codes - no internet required</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* USSD Codes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <DevicePhoneMobileIcon className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">USSD Quick Access</h2>
              </div>
              <p className="text-gray-600 mb-6">Dial these codes from any mobile phone to get instant climate information</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ussdCodes.map((ussd, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-lg font-mono font-bold text-blue-600">{ussd.code}</code>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ussd.category === 'weather' ? 'bg-blue-100 text-blue-700' :
                        ussd.category === 'alerts' ? 'bg-red-100 text-red-700' :
                        ussd.category === 'agriculture' ? 'bg-green-100 text-green-700' :
                        ussd.category === 'reporting' ? 'bg-purple-100 text-purple-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {ussd.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{ussd.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SMS Services */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <ChatBubbleLeftIcon className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">SMS Subscription Services</h2>
              </div>
              
              <div className="space-y-4">
                {smsServices.map((service, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-medium text-gray-900 mr-3">{service.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            service.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {service.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>Short code: </span>
                          <code className="font-mono font-medium ml-1">{service.shortcode}</code>
                          <span className="ml-4">{service.subscribers.toLocaleString()} subscribers</span>
                        </div>
                      </div>
                      <button 
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          service.active 
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {service.active ? 'Unsubscribe' : 'Subscribe'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscription Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscribe to SMS Alerts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">County</label>
                  <select
                    value={selectedCounty}
                    onChange={(e) => setSelectedCounty(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="nairobi">Nairobi</option>
                    <option value="kiambu">Kiambu</option>
                    <option value="mombasa">Mombasa</option>
                    <option value="kisumu">Kisumu</option>
                    <option value="nakuru">Nakuru</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Services</label>
                <div className="space-y-2">
                  {smsServices.map((service, index) => (
                    <label key={index} className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600 mr-3" />
                      <span className="text-gray-700">{service.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button
                onClick={handleServiceSubscription}
                className="mt-4 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Subscribe to Services
              </button>
            </div>

            {/* Recent Messages */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Messages Sent</h2>
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        message.type === 'alert' ? 'bg-red-100 text-red-700' :
                        message.type === 'forecast' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {message.type}
                      </span>
                      <div className="text-sm text-gray-500">
                        <span>{message.recipients.toLocaleString()} recipients</span>
                        <span className="mx-2">•</span>
                        <span>{message.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{message.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI SMS Insights */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">SMS Service Insights</h2>
              <AIInsights
                data={{
                  type: 'weather',
                  values: [89, 76, 92], // Example engagement rates
                  location: 'Kenya',
                  timeframe: 'current',
                  metadata: {
                    totalSubscribers: smsServices.reduce((acc, service) => acc + service.subscribers, 0),
                    messagesSent: recentMessages.length,
                    avgEngagement: '89%'
                  }
                }}
                title="SMS Service Performance Insights"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <SignalIcon className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Service Status</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">SMS Gateway</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">USSD Service</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600">Active</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Message Queue</span>
                  <span className="text-sm text-gray-900">24 pending</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery Rate</span>
                  <span className="text-sm text-green-600">98.7%</span>
                </div>
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Subscribers</span>
                  <span className="font-semibold">37,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Messages Today</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">USSD Sessions</span>
                  <span className="font-semibold">892</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Alerts</span>
                  <span className="font-semibold text-orange-600">3</span>
                </div>
              </div>
            </div>

            {/* Cost Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Costs</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">SMS (per message)</span>
                  <span className="font-medium">KES 1.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">USSD (per session)</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Daily Budget Used</span>
                    <span className="text-green-600">67%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Help & Support</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  Call Support
                </button>
                <div className="text-sm text-gray-600">
                  <p className="mb-2">For technical issues:</p>
                  <p>Email: support@uzimasmart.co.ke</p>
                  <p>Phone: +254 700 123 456</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
