// API endpoint for carbon credit operations
import { NextRequest, NextResponse } from 'next/server'

// Mock carbon credit data for demo (keeping for backward compatibility)
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
    verificationStatus: 'pending',
    tokenId: '0x8e5b...',
    ipfsHash: 'QmA1B2C3...',
    issuedDate: '2024-01-20',
    location: { lat: -1.3460, lng: 36.9020 }
  },
  {
    id: '3',
    farmerId: 'farmer_003',
    amount: 67,
    source: 'sustainable_agriculture',
    verificationStatus: 'verified',
    tokenId: '0x9f2b...',
    ipfsHash: 'QmD4E5F6...',
    issuedDate: '2024-01-14',
    location: { lat: -1.2921, lng: 36.8219 }
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const farmerId = searchParams.get('farmerId')
  const action = searchParams.get('action')

  try {
    // Handle different actions
    if (action === 'stats') {
      const totalCredits = mockCarbonCredits.reduce((sum, credit) => sum + credit.amount, 0)
      const verifiedCredits = mockCarbonCredits
        .filter(credit => credit.verificationStatus === 'verified')
        .reduce((sum, credit) => sum + credit.amount, 0)
      const pendingCredits = totalCredits - verifiedCredits

      return NextResponse.json({
        success: true,
        data: {
          totalCredits,
          verifiedCredits,
          pendingCredits,
          totalProjects: mockCarbonCredits.length,
          verifiedProjects: mockCarbonCredits.filter(c => c.verificationStatus === 'verified').length
        }
      })
    }

    // Default: return credits
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
      success: true,
      data: {
        credits,
        summary: {
          totalCredits,
          verifiedCredits,
          pendingCredits
        }
      }
    })
  } catch (error) {
    console.error('Carbon credits API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, farmerId, amount, source } = body

    if (action === 'create') {
      // Create new carbon credit (mock)
      const newCredit = {
        id: Date.now().toString(),
        farmerId,
        amount,
        source,
        verificationStatus: 'pending',
        tokenId: `0x${Math.random().toString(16).substr(2, 8)}...`,
        ipfsHash: `Qm${Math.random().toString(36).substr(2, 8)}...`,
        issuedDate: new Date().toISOString().split('T')[0],
        location: { lat: -1.2921 + (Math.random() - 0.5) * 0.1, lng: 36.8219 + (Math.random() - 0.5) * 0.1 }
      }

      mockCarbonCredits.push(newCredit)

      return NextResponse.json({
        success: true,
        data: newCredit,
        message: 'Carbon credit created successfully'
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Carbon credits POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
