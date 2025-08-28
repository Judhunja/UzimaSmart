/**
 * ClimateMap Component - Interactive map displaying climate data
 */

'use client'

import { useEffect, useRef } from 'react'

interface County {
  id: number
  name: string
}

interface ClimateData {
  ndvi?: any
  rainfall?: any
  temperature?: any
}

interface ClimateMapProps {
  selectedCounty: County | null
  climateData: ClimateData | null
}

export function ClimateMap({ selectedCounty, climateData }: ClimateMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize map here when ready
    // For now, this is a placeholder
  }, [selectedCounty, climateData])

  return (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-2">🗺️</div>
        <h3 className="text-lg font-medium text-gray-700">Climate Map</h3>
        {selectedCounty ? (
          <p className="text-sm text-gray-500">
            Showing data for {selectedCounty.name}
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            Select a county to view climate data
          </p>
        )}
        <div className="mt-4 text-xs text-gray-400">
          Map component will be implemented here
        </div>
      </div>
    </div>
  )
}
