'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface CountyData {
  id: string
  name: string
  capital: string
  coordinates: [number, number]
  population: number
  area_km2: number
  climate_zone: string
  currentTemp?: number
  rainfall?: number
  alerts?: number
}

interface MapFilters {
  showAlerts: boolean
  showWeatherStations: boolean
  climateZone: string
  dataLayer: 'temperature' | 'rainfall' | 'ndvi' | 'alerts'
}

interface LeafletMapProps {
  counties: CountyData[]
  filters: MapFilters
  getDataValue: (county: CountyData) => number
  getColorByValue: (value: number, layer: string) => string
}

export default function LeafletMap({ counties, filters, getDataValue, getColorByValue }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return

    // Initialize map if not already created
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([-0.0236, 37.9062], 6)

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current)
    }

    const map = mapInstanceRef.current

    // Clear existing markers and layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        map.removeLayer(layer)
      }
    })

    // Add county markers
    counties.forEach((county) => {
      const value = getDataValue(county)
      const color = getColorByValue(value, filters.dataLayer)
      
      // Create circle marker for each county
      const marker = L.circleMarker(county.coordinates, {
        radius: Math.max(8, Math.min(20, value / 2)),
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7
      })

      // Create popup content
      const popupContent = `
        <div class="p-2">
          <h3 class="font-bold text-lg">${county.name}</h3>
          <p class="text-sm text-gray-600">Capital: ${county.capital}</p>
          <p class="text-sm text-gray-600">Climate Zone: ${county.climate_zone}</p>
          <div class="mt-2 space-y-1">
            <p class="text-sm"><strong>Temperature:</strong> ${county.currentTemp}°C</p>
            <p class="text-sm"><strong>Rainfall:</strong> ${county.rainfall}mm</p>
            <p class="text-sm"><strong>Population:</strong> ${county.population.toLocaleString()}</p>
            <p class="text-sm"><strong>Area:</strong> ${county.area_km2} km²</p>
            ${county.alerts ? `<p class="text-sm text-red-600"><strong>Active Alerts:</strong> ${county.alerts}</p>` : ''}
          </div>
        </div>
      `

      marker.bindPopup(popupContent)
      marker.addTo(map)

      // Add alert indicators if enabled
      if (filters.showAlerts && county.alerts && county.alerts > 0) {
        const alertMarker = L.marker(county.coordinates, {
          icon: L.divIcon({
            className: 'alert-marker',
            html: `<div class="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">${county.alerts}</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          })
        })
        alertMarker.addTo(map)
      }

      // Add weather stations if enabled
      if (filters.showWeatherStations) {
        const stationMarker = L.marker(
          [county.coordinates[0] + 0.1, county.coordinates[1] + 0.1],
          {
            icon: L.divIcon({
              className: 'weather-station-marker',
              html: '<div class="bg-blue-500 text-white rounded-full w-4 h-4"></div>',
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            })
          }
        )
        stationMarker.bindTooltip('Weather Station')
        stationMarker.addTo(map)
      }
    })

    return () => {
      // Cleanup function - map will persist
    }
  }, [counties, filters, getDataValue, getColorByValue])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Custom CSS for markers */}
      <style jsx global>{`
        .alert-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .weather-station-marker {
          background: transparent !important;
          border: none !important;
        }

        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }

        .leaflet-popup-content {
          margin: 0;
        }
      `}</style>
    </div>
  )
}
