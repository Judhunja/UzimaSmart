/**
 * CountySelector Component - Dropdown for selecting Kenyan counties
 */

'use client'

import { useState } from 'react'

interface County {
  id: number
  name: string
}

interface CountySelectorProps {
  counties: County[]
  selectedCounty: County | null
  onCountySelect: (county: County) => void
}

export function CountySelector({ counties, selectedCounty, onCountySelect }: CountySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-32"
      >
        {selectedCounty ? selectedCounty.name : 'Select County'}
        <span className="ml-2">▼</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {counties.map((county) => (
            <button
              key={county.id}
              onClick={() => {
                onCountySelect(county)
                setIsOpen(false)
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                selectedCounty?.id === county.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              {county.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
