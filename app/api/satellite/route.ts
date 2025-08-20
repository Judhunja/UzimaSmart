import { NextRequest, NextResponse } from 'next/server'

// Mock satellite/NDVI data for demo
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 })
  }

  try {
    // Mock NDVI calculation (in real app, this would call Sentinel Hub or NASA APIs)
    const mockNDVI = 0.6 + (Math.random() * 0.3) // NDVI between 0.6-0.9
    const mockSoilMoisture = 60 + (Math.random() * 30) // 60-90%
    
    return NextResponse.json({
      ndvi: Math.round(mockNDVI * 100) / 100,
      evi: Math.round((mockNDVI * 0.85) * 100) / 100,
      soilMoisture: Math.round(mockSoilMoisture),
      landCover: 'Agricultural land',
      date: date,
      location: { lat: parseFloat(lat), lng: parseFloat(lng) },
      confidence: 0.92,
      source: 'sentinel-2',
      imageUrl: '/images/satellite-sample.jpg'
    })
  } catch (error) {
    console.error('Satellite data API error:', error)
    return NextResponse.json({ error: 'Failed to fetch satellite data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { farmId, bbox, startDate, endDate } = body

    // Mock time series NDVI data
    const timeSeriesData = []
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 7)) {
      timeSeriesData.push({
        date: d.toISOString().split('T')[0],
        ndvi: 0.6 + (Math.random() * 0.3),
        evi: 0.5 + (Math.random() * 0.3),
        soilMoisture: 60 + (Math.random() * 30)
      })
    }

    return NextResponse.json({
      farmId,
      bbox,
      timeSeries: timeSeriesData,
      summary: {
        avgNDVI: timeSeriesData.reduce((sum, d) => sum + d.ndvi, 0) / timeSeriesData.length,
        trend: Math.random() > 0.5 ? 'increasing' : 'stable',
        healthScore: Math.round((timeSeriesData[timeSeriesData.length - 1].ndvi * 100))
      }
    })
  } catch (error) {
    console.error('Satellite data POST error:', error)
    return NextResponse.json({ error: 'Failed to process satellite data request' }, { status: 500 })
  }
}
