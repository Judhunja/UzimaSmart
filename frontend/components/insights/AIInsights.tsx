'use client'

import { useState, useEffect } from 'react'
import { 
  SparklesIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { aiInsightsService } from '@/services/aiInsightsService'

interface AIInsightsProps {
  data: {
    type: 'temperature' | 'rainfall' | 'humidity' | 'alerts' | 'ndvi' | 'weather'
    values: number[]
    location?: string
    timeframe?: string
    metadata?: any
  }
  title?: string
  className?: string
}

export function AIInsights({ data, title, className = '' }: AIInsightsProps) {
  const [insight, setInsight] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    generateInsight()
  }, [data])

  const generateInsight = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await aiInsightsService.generateClimateInsights(data)
      setInsight(result)
    } catch (err) {
      console.error('Failed to generate AI insight:', err)
      setError('Failed to generate insights')
    } finally {
      setLoading(false)
    }
  }

  const getInsightIcon = () => {
    if (insight.toLowerCase().includes('warning') || insight.toLowerCase().includes('risk')) {
      return <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />
    }
    return <SparklesIcon className="w-5 h-5 text-blue-500" />
  }

  if (loading) {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200 ${className}`}>
        <div className="flex items-center space-x-2 mb-2">
          <SparklesIcon className="w-5 h-5 text-blue-500 animate-pulse" />
          <span className="text-sm font-medium text-blue-700">
            {title || 'AI Insights'}
          </span>
        </div>
        <div className="animate-pulse space-y-2">
          <div className="h-3 bg-blue-200 rounded w-full"></div>
          <div className="h-3 bg-blue-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 border border-gray-200 ${className}`}>
        <div className="flex items-center space-x-2 mb-2">
          <InformationCircleIcon className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {title || 'AI Insights'}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Insights temporarily unavailable. Data is being monitored for patterns.
        </p>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 border-l-4 border-blue-500 shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {getInsightIcon()}
          <span className="text-lg font-bold text-blue-800">
            {title || '🧠 AI Climate Insights'}
          </span>
        </div>
        <button
          onClick={generateInsight}
          className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors duration-200 border border-blue-300"
          title="Regenerate insight"
        >
          🔄 Refresh
        </button>
      </div>
      
      <div className="prose prose-sm max-w-none">
        <div className="text-sm text-gray-800 leading-relaxed space-y-2">
          {insight.split('\n').map((line, index) => {
            if (line.trim() === '') return null;
            
            // Format different sections with appropriate styling
            if (line.includes('📊 METRICS') || line.includes('ANALYSIS')) {
              return (
                <div key={index} className="bg-blue-100 p-2 rounded font-semibold text-blue-900 border-l-2 border-blue-400">
                  {line}
                </div>
              );
            }
            
            if (line.includes('🔥 CLIMATE IMPACT') || line.includes('💧 WATER IMPACT') || line.includes('🦠 HEALTH IMPACT') || line.includes('🌳 ECOSYSTEM IMPACT') || line.includes('⚠️ RISK IMPACT') || line.includes('☀️ IMMEDIATE IMPACT') || line.includes('🌍 CLIMATE IMPACT')) {
              return (
                <div key={index} className="bg-orange-100 p-2 rounded font-medium text-orange-900 border-l-2 border-orange-400">
                  {line}
                </div>
              );
            }
            
            if (line.includes('⚡ IMMEDIATE ACTIONS')) {
              return (
                <div key={index} className="bg-yellow-100 p-2 rounded font-medium text-yellow-900 border-l-2 border-yellow-400">
                  {line}
                </div>
              );
            }
            
            if (line.includes('🌱 MITIGATION') || line.includes('🌾 AGRICULTURE') || line.includes('🏥 HEALTH MEASURES') || line.includes('🛡️ RESILIENCE') || line.includes('🌡️ ADAPTATION')) {
              return (
                <div key={index} className="bg-green-100 p-2 rounded font-medium text-green-900 border-l-2 border-green-400">
                  {line}
                </div>
              );
            }
            
            if (line.includes('📈 TARGET')) {
              return (
                <div key={index} className="bg-purple-100 p-2 rounded font-semibold text-purple-900 border-l-2 border-purple-400">
                  {line}
                </div>
              );
            }
            
            return (
              <div key={index} className="text-gray-700">
                {line}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-blue-200">
        <div className="flex items-center justify-between text-xs text-blue-600">
          <span>🤖 AI-powered climate analysis</span>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  )
}
