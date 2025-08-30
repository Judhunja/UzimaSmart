'use client'

interface County {
  id: string
  name: string
  latitude: number
  longitude: number
}

interface SimpleCountySelectorProps {
  counties: County[]
  selectedCounty: string
  onCountyChange: (county: string) => void
}

export default function SimpleCountySelector({ 
  counties, 
  selectedCounty, 
  onCountyChange 
}: SimpleCountySelectorProps) {
  return (
    <div className="relative">
      <select
        value={selectedCounty}
        onChange={(e) => onCountyChange(e.target.value)}
        className="block w-full px-4 py-3 text-base border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
      >
        {counties.map((county) => (
          <option key={county.id} value={county.id}>
            📍 {county.name}
          </option>
        ))}
      </select>
    </div>
  )
}
