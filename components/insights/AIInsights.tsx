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
    <div className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200 ${className}`}>
      <div className="flex items-center space-x-2 mb-2">
        {getInsightIcon()}
        <span className="text-sm font-medium text-blue-700">
          {title || 'AI Insights'}
        </span>
        <button
          onClick={generateInsight}
          className="ml-auto text-xs text-blue-600 hover:text-blue-800"
          title="Regenerate insight"
        >
          ↻
        </button>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">
        {insight}
      </p>
    </div>
  )
}
