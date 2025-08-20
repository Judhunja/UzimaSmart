import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageData, farmId, cropType } = body

    if (!imageData) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 })
    }

    // Mock AI disease detection (in real app, this would use TensorFlow.js or cloud AI)
    const diseases = ['Healthy', 'Leaf Blight', 'Leaf Rust', 'Stem Rot', 'Mosaic Virus']
    const randomDisease = diseases[Math.floor(Math.random() * diseases.length)]
    const confidence = 0.7 + (Math.random() * 0.3) // 70-100% confidence

    const recommendations: Record<string, string[]> = {
      'Healthy': [
        'Continue current care practices',
        'Monitor regularly for any changes',
        'Maintain proper nutrition and watering'
      ],
      'Leaf Blight': [
        'Remove affected leaves immediately',
        'Apply copper-based fungicide',
        'Improve air circulation around plants',
        'Avoid overhead watering'
      ],
      'Leaf Rust': [
        'Apply rust-resistant varieties next season',
        'Use appropriate fungicide treatment',
        'Remove infected plant debris',
        'Ensure proper plant spacing'
      ],
      'Stem Rot': [
        'Improve drainage in affected areas',
        'Reduce watering frequency',
        'Apply biological control agents',
        'Remove and destroy infected plants'
      ],
      'Mosaic Virus': [
        'Remove infected plants immediately',
        'Control aphid populations',
        'Use virus-resistant varieties',
        'Disinfect tools between plants'
      ]
    }

    return NextResponse.json({
      disease: randomDisease,
      confidence: Math.round(confidence * 100) / 100,
      severity: confidence > 0.9 ? 'high' : confidence > 0.75 ? 'medium' : 'low',
      recommendations: recommendations[randomDisease] || ['Consult with local agricultural extension officer'],
      detectedAt: new Date().toISOString(),
      farmId,
      cropType
    })
  } catch (error) {
    console.error('Disease detection API error:', error)
    return NextResponse.json({ error: 'Failed to process disease detection' }, { status: 500 })
  }
}
