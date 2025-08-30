import { NextRequest, NextResponse } from 'next/server'

// Generate realistic weather data based on coordinates in Kenya
function generateWeatherData(lat: number, lng: number) {
  // Determine climate zone based on location
  let climateZone = 'Highland'
  let baseTemp = 22
  let baseRainfall = 90
  let baseHumidity = 65

  // Coastal region (eastern Kenya near Indian Ocean)
  if (lng > 39 && lat < -2) {
    climateZone = 'Coastal'
    baseTemp = 28
    baseRainfall = 80
    baseHumidity = 80
  }
  // Arid/Semi-arid (northern and northeastern Kenya)
  else if (lat > 1 || (lat > -1 && lng > 38)) {
    climateZone = 'Arid'
    baseTemp = 32
    baseRainfall = 25
    baseHumidity = 35
  }
  // Lake Basin (western Kenya around Lake Victoria)
  else if (lng < 35.5 && lat > -1.5) {
    climateZone = 'Lake Basin'
    baseTemp = 24
    baseRainfall = 120
    baseHumidity = 70
  }
  // Highland (central Kenya)
  else {
    climateZone = 'Highland'
    baseTemp = 20
    baseRainfall = 110
    baseHumidity = 60
  }

  // Add seasonal and random variations
  const temperature = Math.round(baseTemp + (Math.random() - 0.5) * 8)
  const rainfall = Math.round(Math.max(0, baseRainfall + (Math.random() - 0.5) * 60))
  const humidity = Math.round(Math.max(20, Math.min(95, baseHumidity + (Math.random() - 0.5) * 25)))
  
  // NDVI calculation based on climate
  const ndvi = climateZone === 'Highland' ? 0.65 + Math.random() * 0.25 :
               climateZone === 'Coastal' ? 0.55 + Math.random() * 0.3 :
               climateZone === 'Lake Basin' ? 0.7 + Math.random() * 0.2 :
               0.15 + Math.random() * 0.35

  // Wind data
  const windSpeed = Math.round(Math.random() * 15 + 5) // 5-20 km/h
  const windDirection = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)]

  // UV Index
  const uvIndex = Math.round(Math.random() * 8 + 3) // 3-11

  // Generate 7-day forecast
  const forecast = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    
    return {
      date: date.toISOString().split('T')[0],
      temperature: {
        max: Math.round(temperature + (Math.random() - 0.5) * 6),
        min: Math.round(temperature - 5 + (Math.random() - 0.5) * 4)
      },
      humidity: Math.round(humidity + (Math.random() - 0.5) * 15),
      rainfall: Math.round(Math.max(0, rainfall * 0.7 + (Math.random() - 0.5) * 40)),
      condition: ['sunny', 'partly-cloudy', 'cloudy', 'rainy'][Math.floor(Math.random() * 4)]
    }
  })

  return {
    location: {
      latitude: lat,
      longitude: lng,
      climateZone
    },
    current: {
      temperature,
      humidity,
      rainfall: rainfall,
      ndvi: parseFloat(ndvi.toFixed(3)),
      windSpeed,
      windDirection,
      uvIndex,
      pressure: Math.round(1013 + (Math.random() - 0.5) * 20), // hPa
      visibility: Math.round(10 + (Math.random() - 0.5) * 8), // km
      timestamp: new Date().toISOString()
    },
    forecast,
    alerts: generateAlerts(climateZone, temperature, rainfall, humidity)
  }
}

function generateAlerts(climateZone: string, temp: number, rainfall: number, humidity: number) {
  const alerts = []

  // Temperature alerts
  if (temp > 35) {
    alerts.push({
      type: 'heat_warning',
      severity: 'high',
      message: 'Extreme heat warning. Stay hydrated and avoid outdoor activities during peak hours.',
      timestamp: new Date().toISOString()
    })
  } else if (temp < 10) {
    alerts.push({
      type: 'cold_warning',
      severity: 'medium',
      message: 'Cold weather alert. Protect crops and livestock from frost.',
      timestamp: new Date().toISOString()
    })
  }

  // Rainfall alerts
  if (rainfall > 100) {
    alerts.push({
      type: 'flood_risk',
      severity: 'high',
      message: 'Heavy rainfall expected. Risk of flooding in low-lying areas.',
      timestamp: new Date().toISOString()
    })
  } else if (rainfall < 10 && climateZone !== 'Arid') {
    alerts.push({
      type: 'drought_risk',
      severity: 'medium',
      message: 'Low rainfall levels. Consider water conservation measures.',
      timestamp: new Date().toISOString()
    })
  }

  // Humidity alerts
  if (humidity > 85) {
    alerts.push({
      type: 'disease_risk',
      severity: 'medium',
      message: 'High humidity levels increase risk of crop diseases.',
      timestamp: new Date().toISOString()
    })
  }

  return alerts
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get('lat') || '-1.2921') // Default to Nairobi
  const lng = parseFloat(searchParams.get('lng') || '36.8219')

  // Validate coordinates for Kenya
  if (lat < -4.5 || lat > 5.5 || lng < 33.5 || lng > 42) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Coordinates outside Kenya boundaries',
        message: 'Please provide coordinates within Kenya (lat: -4.5 to 5.5, lng: 33.5 to 42)'
      },
      { status: 400 }
    )
  }

  try {
    const weatherData = generateWeatherData(lat, lng)

    return NextResponse.json({
      success: true,
      data: weatherData,
      source: 'UzimaSmart Weather Service',
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error generating weather data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate weather data',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
