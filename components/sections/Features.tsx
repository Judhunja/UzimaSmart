'use client'

import { 
  ChartBarIcon,
  PuzzlePieceIcon,
  BoltIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'

export function Features() {
  const features = [
    {
      name: 'AI Climate Insights',
      description: 'Smart climate adaptation strategies powered by AI, providing actionable recommendations for climate resilience.',
      icon: ChartBarIcon,
      stats: '47 counties covered',
      color: 'from-green-400 to-blue-500'
    },
    {
      name: 'Smart Agriculture',
      description: 'AI-powered crop disease detection, NDVI monitoring, and climate-smart farming advisories using satellite data.',
      icon: PuzzlePieceIcon,
      stats: '50K+ farmers',
      color: 'from-green-400 to-emerald-600'
    },
    {
      name: 'Clean Energy Optimization',
      description: 'Real-time energy consumption monitoring and AI-driven demand forecasting for smart grid optimization.',
      icon: BoltIcon,
      stats: '15% energy savings',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      name: 'Conservation Monitoring',
      description: 'AI analysis of satellite imagery to detect deforestation, illegal logging, and ecosystem health changes.',
      icon: ShieldCheckIcon,
      stats: '100K hectares protected',
      color: 'from-blue-400 to-purple-600'
    },
    {
      name: 'Weather & Climate Intelligence',
      description: 'Real-time weather alerts, climate predictions, and early warning systems for disaster preparedness.',
      icon: GlobeAltIcon,
      stats: '99.2% accuracy',
      color: 'from-indigo-400 to-cyan-600'
    },
    {
      name: 'AI-Powered Analytics',
      description: 'Advanced machine learning models for predictive analytics, trend analysis, and actionable insights.',
      icon: BeakerIcon,
      stats: 'TensorFlow.js AI',
      color: 'from-purple-400 to-pink-600'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Climate Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering Kenya with AI-driven tools for sustainable development, 
            environmental conservation, and climate resilience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.name}
              className="group relative bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-6`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.name}
              </h3>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                {feature.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary-600">
                  {feature.stats}
                </span>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-primary-100 transition-colors duration-300">
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Make an Impact?
            </h3>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of Kenyan farmers, conservationists, and energy managers 
              already using UzimaSmart to drive sustainable change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200">
                Get Started Free
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
