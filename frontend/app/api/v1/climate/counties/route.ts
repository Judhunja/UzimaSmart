import { NextResponse } from 'next/server'

// Kenya county data with climate information
const kenyanCounties = [
  {
    id: '1',
    name: 'Nairobi',
    capital: 'Nairobi',
    coordinates: { lat: -1.2921, lng: 36.8219 },
    population: 4397073,
    area_km2: 696,
    climate_zone: 'Temperate',
    elevation: 1795
  },
  {
    id: '2',
    name: 'Mombasa',
    capital: 'Mombasa',
    coordinates: { lat: -4.0435, lng: 39.6682 },
    population: 1208333,
    area_km2: 230,
    climate_zone: 'Coastal',
    elevation: 17
  },
  {
    id: '3',
    name: 'Kisumu',
    capital: 'Kisumu',
    coordinates: { lat: -0.0917, lng: 34.7680 },
    population: 610082,
    area_km2: 2009,
    climate_zone: 'Lake Basin',
    elevation: 1131
  },
  {
    id: '4',
    name: 'Nakuru',
    capital: 'Nakuru',
    coordinates: { lat: -0.3031, lng: 36.0800 },
    population: 2162202,
    area_km2: 7509,
    climate_zone: 'Highland',
    elevation: 1850
  },
  {
    id: '5',
    name: 'Eldoret',
    capital: 'Eldoret',
    coordinates: { lat: 0.5143, lng: 35.2698 },
    population: 1163186,
    area_km2: 3738,
    climate_zone: 'Highland',
    elevation: 2085
  },
  {
    id: '6',
    name: 'Machakos',
    capital: 'Machakos',
    coordinates: { lat: -1.5177, lng: 37.2634 },
    population: 1421932,
    area_km2: 5952,
    climate_zone: 'Semi-Arid',
    elevation: 1549
  },
  {
    id: '7',
    name: 'Kiambu',
    capital: 'Kiambu',
    coordinates: { lat: -1.1714, lng: 36.8356 },
    population: 2417735,
    area_km2: 2449,
    climate_zone: 'Highland',
    elevation: 1720
  },
  {
    id: '8',
    name: 'Nyeri',
    capital: 'Nyeri',
    coordinates: { lat: -0.4167, lng: 36.9500 },
    population: 759164,
    area_km2: 2361,
    climate_zone: 'Highland',
    elevation: 1759
  },
  {
    id: '9',
    name: 'Meru',
    capital: 'Meru',
    coordinates: { lat: 0.0467, lng: 37.6556 },
    population: 1545714,
    area_km2: 6936,
    climate_zone: 'Highland',
    elevation: 1554
  },
  {
    id: '10',
    name: 'Kakamega',
    capital: 'Kakamega',
    coordinates: { lat: 0.2827, lng: 34.7519 },
    population: 1867579,
    area_km2: 3033,
    climate_zone: 'Lake Basin',
    elevation: 1535
  },
  {
    id: '11',
    name: 'Kilifi',
    capital: 'Kilifi',
    coordinates: { lat: -3.6309, lng: 39.8493 },
    population: 1453787,
    area_km2: 12245,
    climate_zone: 'Coastal',
    elevation: 25
  },
  {
    id: '12',
    name: 'Kwale',
    capital: 'Kwale',
    coordinates: { lat: -4.1741, lng: 39.4861 },
    population: 866820,
    area_km2: 8270,
    climate_zone: 'Coastal',
    elevation: 200
  },
  {
    id: '13',
    name: 'Bungoma',
    capital: 'Bungoma',
    coordinates: { lat: 0.5692, lng: 34.5605 },
    population: 1670570,
    area_km2: 2069,
    climate_zone: 'Highland',
    elevation: 1426
  },
  {
    id: '14',
    name: 'Kitui',
    capital: 'Kitui',
    coordinates: { lat: -1.3667, lng: 38.0100 },
    population: 1136187,
    area_km2: 24385,
    climate_zone: 'Semi-Arid',
    elevation: 1136
  },
  {
    id: '15',
    name: 'Garissa',
    capital: 'Garissa',
    coordinates: { lat: -0.4536, lng: 39.6401 },
    population: 841353,
    area_km2: 45720,
    climate_zone: 'Arid',
    elevation: 147
  }
]

// Generate realistic climate data based on location and season
function generateClimateData(county: any) {
  const baseTemp = county.climate_zone === 'Coastal' ? 28 : 
                   county.climate_zone === 'Highland' ? 18 : 
                   county.climate_zone === 'Arid' ? 32 : 
                   county.climate_zone === 'Semi-Arid' ? 26 : 22
  
  const baseRainfall = county.climate_zone === 'Coastal' ? 80 : 
                       county.climate_zone === 'Highland' ? 120 : 
                       county.climate_zone === 'Arid' ? 20 : 
                       county.climate_zone === 'Semi-Arid' ? 45 : 90

  // Add some randomness for realism
  const currentTemp = Math.round(baseTemp + (Math.random() - 0.5) * 8)
  const rainfall = Math.round(baseRainfall + (Math.random() - 0.5) * 40)
  const humidity = county.climate_zone === 'Coastal' ? 75 + Math.random() * 15 :
                   county.climate_zone === 'Highland' ? 60 + Math.random() * 20 :
                   county.climate_zone === 'Arid' ? 30 + Math.random() * 15 :
                   55 + Math.random() * 20

  // NDVI values (0-1, higher is greener)
  const ndvi = county.climate_zone === 'Highland' ? 0.6 + Math.random() * 0.3 :
               county.climate_zone === 'Coastal' ? 0.5 + Math.random() * 0.3 :
               county.climate_zone === 'Lake Basin' ? 0.65 + Math.random() * 0.25 :
               county.climate_zone === 'Arid' ? 0.1 + Math.random() * 0.3 :
               0.3 + Math.random() * 0.4

  const alerts = Math.floor(Math.random() * 4) // 0-3 alerts

  return {
    currentTemp,
    rainfall,
    humidity: Math.round(humidity),
    ndvi: parseFloat(ndvi.toFixed(3)),
    alerts,
    lastUpdated: new Date().toISOString()
  }
}

export async function GET() {
  try {
    // Add current climate data to each county
    const countiesWithClimate = kenyanCounties.map(county => ({
      ...county,
      climate: generateClimateData(county)
    }))

    return NextResponse.json({
      success: true,
      counties: countiesWithClimate,
      total: countiesWithClimate.length,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching county data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch county data',
        counties: []
      },
      { status: 500 }
    )
  }
}
