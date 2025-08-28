'use client'

import { useState } from 'react'
import Link from 'next/link'

interface NavigationProps {
  selectedCounty?: string
  onCountyChange?: (county: string) => void
}

const kenyanCounties = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Meru', 
  'Nyeri', 'Machakos', 'Kilifi', 'Garissa', 'Kakamega', 'Thika',
  'Kiambu', 'Kajiado', 'Murang\'a', 'Kitui', 'Embu', 'Tharaka-Nithi'
]

export default function Navigation({ selectedCounty = 'Nairobi', onCountyChange }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl">🌍</div>
            <h1 className="text-xl font-bold text-gray-900">UzimaSmart</h1>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/reports" className="text-gray-600 hover:text-blue-600 transition-colors">
              Reports
            </Link>
            <Link href="/maps" className="text-gray-600 hover:text-blue-600 transition-colors">
              Maps
            </Link>
            
            {onCountyChange && (
              <select 
                value={selectedCounty}
                onChange={(e) => onCountyChange?.(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {kenyanCounties.map(county => (
                  <option key={county} value={county}>{county}</option>
                ))}
              </select>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-gray-600"></div>
              <div className="w-full h-0.5 bg-gray-600"></div>
              <div className="w-full h-0.5 bg-gray-600"></div>
            </div>
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
              <Link href="/reports" className="text-gray-600 hover:text-blue-600">Reports</Link>
              <Link href="/maps" className="text-gray-600 hover:text-blue-600">Maps</Link>
              
              {onCountyChange && (
                <select 
                  value={selectedCounty}
                  onChange={(e) => onCountyChange?.(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {kenyanCounties.map(county => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
