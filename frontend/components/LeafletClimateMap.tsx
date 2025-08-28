'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface ClimateDataPoint {
  county: string
  latitude: number
  longitude: number
  temperature: number
  rainfall: number
  humidity: number
  ndvi: number
  soilMoisture: number
  airQuality: number
}

interface MapLayer {
  id: string
  name: string
  color: string
  unit: string
  active: boolean
}

interface LeafletClimateMapProps {
  data: ClimateDataPoint[]
  activeLayer: MapLayer | undefined
  onLocationClick: (data: ClimateDataPoint) => void
}

const LeafletClimateMap: React.FC<LeafletClimateMapProps> = ({ 
  data, 
  activeLayer, 
  onLocationClick 
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null)
  const [kenyaGeoData, setKenyaGeoData] = useState<any>(null)

  // Load Kenya GeoJSON data
  useEffect(() => {
    const loadKenyaData = async () => {
      try {
        const response = await fetch('/data/kenya-counties.geojson')
        const geoJsonData = await response.json()
        setKenyaGeoData(geoJsonData)
        console.log('Kenya GeoJSON loaded:', geoJsonData)
      } catch (error) {
        console.error('Error loading Kenya GeoJSON:', error)
      }
    }
    
    loadKenyaData()
  }, [])

  // Get climate value for a county based on active layer
  const getClimateValue = (countyName: string): number => {
    if (!activeLayer) return 0
    
    const climateData = data.find(d => 
      d.county.toLowerCase().includes(countyName.toLowerCase()) ||
      countyName.toLowerCase().includes(d.county.toLowerCase())
    )
    
    if (!climateData) return 0
    
    switch (activeLayer.id) {
      case 'temperature': return climateData.temperature
      case 'rainfall': return climateData.rainfall
      case 'humidity': return climateData.humidity
      case 'ndvi': return climateData.ndvi
      case 'soil-moisture': return climateData.soilMoisture
      case 'air-quality': return climateData.airQuality
      default: return 0
    }
  }

  // Get color based on value and parameter type
  const getColor = (value: number, parameterType: string): string => {
    let normalizedValue: number
    
    switch (parameterType) {
      case 'temperature':
        normalizedValue = Math.max(0, Math.min(1, (value - 15) / 25))
        break
      case 'rainfall':
        normalizedValue = Math.max(0, Math.min(1, value / 150))
        break
      case 'humidity':
        normalizedValue = Math.max(0, Math.min(1, (value - 30) / 60))
        break
      case 'ndvi':
        normalizedValue = Math.max(0, Math.min(1, (value - 0.1) / 0.8))
        break
      case 'soil-moisture':
        normalizedValue = Math.max(0, Math.min(1, (value - 20) / 60))
        break
      case 'air-quality':
        normalizedValue = Math.max(0, Math.min(1, (200 - value) / 180)) // Inverted for air quality
        break
      default:
        normalizedValue = 0.5
    }

    // Color interpolation based on parameter
    if (parameterType === 'temperature') {
      if (normalizedValue < 0.25) return `rgb(${59 + normalizedValue * 4 * 57}, ${130 + normalizedValue * 4 * 71}, 246)`
      if (normalizedValue < 0.5) return `rgb(${16 + (normalizedValue - 0.25) * 4 * 229}, ${185 + (normalizedValue - 0.25) * 4 * 58}, ${129 + (normalizedValue - 0.25) * 4 * 10})`
      if (normalizedValue < 0.75) return `rgb(${245 + (normalizedValue - 0.5) * 4 * 9}, ${158 + (normalizedValue - 0.5) * 4 * 80}, ${11 + (normalizedValue - 0.5) * 4 * 57})`
      return `rgb(${239 + (normalizedValue - 0.75) * 4 * (-115)}, ${68 + (normalizedValue - 0.75) * 4 * (-23)}, ${68 + (normalizedValue - 0.75) * 4 * (-50)})`
    } else if (parameterType === 'rainfall') {
      if (normalizedValue < 0.33) return `rgb(${254 - normalizedValue * 3 * 171}, ${243 - normalizedValue * 3 * 11}, ${199 - normalizedValue * 3 * 27})`
      if (normalizedValue < 0.67) return `rgb(${96 + (normalizedValue - 0.33) * 3 * 3}, ${165 + (normalizedValue - 0.33) * 3 * 17}, ${250 + (normalizedValue - 0.33) * 3 * (-4)})`
      return `rgb(${59 + (normalizedValue - 0.67) * 3 * (-29)}, ${130 + (normalizedValue - 0.67) * 3 * (-66)}, ${246 + (normalizedValue - 0.67) * 3 * (-71)})`
    } else if (parameterType === 'humidity') {
      if (normalizedValue < 0.25) return `rgb(${252 - normalizedValue * 4 * 61}, ${165 - normalizedValue * 4 * 70}, ${165 - normalizedValue * 4 * 69})`
      if (normalizedValue < 0.5) return `rgb(${251 + (normalizedValue - 0.25) * 4 * (-62)}, ${191 + (normalizedValue - 0.25) * 4 * (-131)}, ${36 + (normalizedValue - 0.25) * 4 * 117})`
      if (normalizedValue < 0.75) return `rgb(${52 + (normalizedValue - 0.5) * 4 * (-18)}, ${211 + (normalizedValue - 0.5) * 4 * (-58)}, ${153 + (normalizedValue - 0.5) * 4 * 0})`
      return `rgb(${5 + (normalizedValue - 0.75) * 4 * 1}, ${150 + (normalizedValue - 0.75) * 4 * (-55)}, ${105 + (normalizedValue - 0.75) * 4 * (-35)})`
    } else if (parameterType === 'ndvi') {
      if (normalizedValue < 0.25) return `rgb(${254 - normalizedValue * 4 * 64}, ${243 - normalizedValue * 4 * 1}, ${199 - normalizedValue * 4 * 99})`
      if (normalizedValue < 0.5) return `rgb(${190 + (normalizedValue - 0.25) * 4 * (-58)}, ${242 + (normalizedValue - 0.25) * 4 * 10}, ${100 + (normalizedValue - 0.25) * 4 * 22})`
      if (normalizedValue < 0.75) return `rgb(${132 + (normalizedValue - 0.5) * 4 * (-66)}, ${204 + (normalizedValue - 0.5) * 4 * (-71)}, ${22 + (normalizedValue - 0.5) * 4 * 72})`
      return `rgb(${34 + (normalizedValue - 0.75) * 4 * (-13)}, ${197 + (normalizedValue - 0.75) * 4 * (-77)}, ${94 + (normalizedValue - 0.75) * 4 * 24})`
    } else if (parameterType === 'air-quality') {
      if (normalizedValue < 0.2) return `rgb(${127 + normalizedValue * 5 * (-110)}, ${29 + normalizedValue * 5 * 193}, ${29 + normalizedValue * 5 * 171})`
      if (normalizedValue < 0.4) return `rgb(${220 + (normalizedValue - 0.2) * 5 * 25}, ${184 + (normalizedValue - 0.2) * 5 * 71}, ${11 + (normalizedValue - 0.2) * 5 * (-11)})`
      if (normalizedValue < 0.6) return `rgb(${239 + (normalizedValue - 0.4) * 5 * 0}, ${68 + (normalizedValue - 0.4) * 5 * 0}, ${68 + (normalizedValue - 0.4) * 5 * 0})`
      if (normalizedValue < 0.8) return `rgb(${220 + (normalizedValue - 0.6) * 5 * (-2)}, ${38 + (normalizedValue - 0.6) * 5 * 0}, ${38 + (normalizedValue - 0.6) * 5 * 0})`
      return `rgb(${16 + (normalizedValue - 0.8) * 5 * 0}, ${185 + (normalizedValue - 0.8) * 5 * (-86)}, ${129 + (normalizedValue - 0.8) * 5 * (-118)})`
    }
    
    return '#94a3b8' // Default gray
  }

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center: [-0.0236, 37.9062], // Center of Kenya
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true
    })

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Add Kenya GeoJSON layer
  useEffect(() => {
    if (!mapInstanceRef.current || !kenyaGeoData) return

    // Remove existing layer
    if (geoJsonLayerRef.current) {
      mapInstanceRef.current.removeLayer(geoJsonLayerRef.current)
    }

    // Add GeoJSON layer
    geoJsonLayerRef.current = L.geoJSON(kenyaGeoData, {
      style: (feature) => {
        const countyName = feature?.properties?.COUNTY_NAM || 'Unknown'
        const value = getClimateValue(countyName)
        const fillColor = activeLayer ? getColor(value, activeLayer.id) : '#e2e8f0'
        
        return {
          fillColor: fillColor,
          weight: 1,
          opacity: 1,
          color: '#475569',
          fillOpacity: 0.7
        }
      },
      onEachFeature: (feature, layer) => {
        const countyName = feature?.properties?.COUNTY_NAM || 'Unknown County'
        const climateData = data.find(d => 
          d.county.toLowerCase().includes(countyName.toLowerCase()) ||
          countyName.toLowerCase().includes(d.county.toLowerCase())
        )
        
        // Popup content
        let popupContent = `
          <div class="p-3 max-w-xs">
            <h3 class="font-bold text-lg mb-2">${countyName}</h3>
        `
        
        if (climateData) {
          popupContent += `
            <div class="space-y-1 text-sm">
              <div><strong>Temperature:</strong> ${climateData.temperature}°C</div>
              <div><strong>Rainfall:</strong> ${climateData.rainfall}mm</div>
              <div><strong>Humidity:</strong> ${climateData.humidity}%</div>
              <div><strong>NDVI:</strong> ${climateData.ndvi}</div>
              <div><strong>Soil Moisture:</strong> ${climateData.soilMoisture}%</div>
              <div><strong>Air Quality:</strong> ${climateData.airQuality} AQI</div>
            </div>
          `
          
          if (activeLayer) {
            const value = getClimateValue(countyName)
            popupContent += `
              <div class="mt-2 p-2 bg-blue-50 rounded">
                <strong>${activeLayer.name}:</strong> ${value.toFixed(1)} ${activeLayer.unit}
              </div>
            `
          }
        } else {
          popupContent += '<div class="text-gray-500">No climate data available</div>'
        }
        
        popupContent += '</div>'
        
        layer.bindPopup(popupContent)
        
        // Mouse events
        layer.on({
          mouseover: function(e) {
            const layer = e.target
            layer.setStyle({
              weight: 2,
              color: '#1e40af',
              fillOpacity: 0.9
            })
          },
          mouseout: function(e) {
            geoJsonLayerRef.current?.resetStyle(e.target)
          },
          click: function(e) {
            if (climateData) {
              onLocationClick(climateData)
            }
            mapInstanceRef.current?.fitBounds(e.target.getBounds())
          }
        })
      }
    }).addTo(mapInstanceRef.current)

    // Fit map to Kenya bounds
    if (geoJsonLayerRef.current) {
      mapInstanceRef.current.fitBounds(geoJsonLayerRef.current.getBounds())
    }

  }, [kenyaGeoData, data, activeLayer, onLocationClick])

  return (
    <div className="relative w-full h-96">
      <div ref={mapRef} className="w-full h-full rounded-lg border border-gray-300" />
      
      {/* Legend */}
      {activeLayer && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000] max-w-xs">
          <div className="text-sm font-medium text-gray-700 mb-2">
            {activeLayer.name} ({activeLayer.unit})
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Low</span>
            <div className="flex space-x-1 mx-2">
              {[0.1, 0.3, 0.5, 0.7, 0.9].map((intensity, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-sm border border-gray-300"
                  style={{
                    backgroundColor: getColor(intensity * 100, activeLayer.id)
                  }}
                ></div>
              ))}
            </div>
            <span>High</span>
          </div>
        </div>
      )}
      
      {/* Reset button */}
      <div className="absolute top-4 left-4 z-[1000]">
        <button
          onClick={() => {
            if (mapInstanceRef.current && geoJsonLayerRef.current) {
              mapInstanceRef.current.fitBounds(geoJsonLayerRef.current.getBounds())
            }
          }}
          className="bg-white rounded-lg p-2 shadow-lg hover:shadow-xl transition-shadow border border-gray-300"
          title="Reset to Kenya view"
        >
          🏠
        </button>
      </div>
    </div>
  )
}

export default LeafletClimateMap
