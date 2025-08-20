import { NextRequest, NextResponse } from 'next/server'

// Mock carbon credit data for demo
const mockCarbonCredits = [
  {
    id: '1',
    farmerId: 'farmer_001',
    amount: 125,
    source: 'reforestation',
    verificationStatus: 'verified',
    tokenId: '0x7d4a...',
    ipfsHash: 'QmX7Y8Z9...',
    issuedDate: '2024-01-15',
    location: { lat: -1.2921, lng: 36.8219 }
  },
  {
    id: '2',
    farmerId: 'farmer_002',
    amount: 89,
    source: 'renewable_energy',
    verificationStatus: 'verified',
    tokenId: '0x9f2b...',
    ipfsHash: 'QmA1B2C3...',
    issuedDate: '2024-01-14',
    location: { lat: -1.2921, lng: 36.8219 }
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const farmerId = searchParams.get('farmerId')

  try {
    let credits = mockCarbonCredits
    
    if (farmerId) {
      credits = credits.filter(credit => credit.farmerId === farmerId)
    }

    const totalCredits = credits.reduce((sum, credit) => sum + credit.amount, 0)
    const verifiedCredits = credits
      .filter(credit => credit.verificationStatus === 'verified')
      .reduce((sum, credit) => sum + credit.amount, 0)
    const pendingCredits = totalCredits - verifiedCredits

    return NextResponse.json({
      credits,
      summary: {
        totalCredits,
        verifiedCredits,
        pendingCredits,
        totalValue: totalCredits * 60, // KES 60 per tCO2e
        monthlyGrowth: 12.5
      }
    })
  } catch (error) {
    console.error('Carbon credits API error:', error)
    return NextResponse.json({ error: 'Failed to fetch carbon credits' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { farmerId, amount, source, location } = body

    if (!farmerId || !amount || !source) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // In a real app, this would save to database and blockchain
    const newCredit = {
      id: Math.random().toString(36).substr(2, 9),
      farmerId,
      amount,
      source,
      verificationStatus: 'pending',
      location,
      issuedDate: new Date().toISOString(),
      ipfsHash: 'Qm' + Math.random().toString(36).substr(2, 44) // Mock IPFS hash
    }

    return NextResponse.json(newCredit, { status: 201 })
  } catch (error) {
    console.error('Carbon credits POST error:', error)
    return NextResponse.json({ error: 'Failed to create carbon credit' }, { status: 500 })
  }
}
