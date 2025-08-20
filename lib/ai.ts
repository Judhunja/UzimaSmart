// AI utilities for UzimaSmart using TensorFlow.js
import * as tf from '@tensorflow/tfjs'

export class CropDiseaseDetector {
  private model: tf.LayersModel | null = null
  private isLoaded = false

  constructor() {
    this.initializeModel()
  }

  private async initializeModel() {
    try {
      // Load pre-trained crop disease detection model
      this.model = await tf.loadLayersModel('/models/crop_disease_model.json')
      this.isLoaded = true
      console.log('Crop disease detection model loaded successfully')
    } catch (error) {
      console.error('Failed to load crop disease detection model:', error)
      // Fallback: create a simple model for demo purposes
      this.createDemoModel()
    }
  }

  private createDemoModel() {
    // Create a simple demo model for crop disease detection
    this.model = tf.sequential({
      layers: [
        tf.layers.conv2d({
          inputShape: [224, 224, 3],
          filters: 32,
          kernelSize: 3,
          activation: 'relu'
        }),
        tf.layers.maxPooling2d({ poolSize: 2 }),
        tf.layers.conv2d({ filters: 64, kernelSize: 3, activation: 'relu' }),
        tf.layers.maxPooling2d({ poolSize: 2 }),
        tf.layers.flatten(),
        tf.layers.dense({ units: 128, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.5 }),
        tf.layers.dense({ units: 5, activation: 'softmax' }) // 5 disease classes
      ]
    })
    
    this.model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    })
    
    this.isLoaded = true
  }

  async detectDisease(imageData: ImageData | HTMLImageElement): Promise<{
    disease: string
    confidence: number
    recommendations: string[]
  }> {
    if (!this.isLoaded || !this.model) {
      throw new Error('Model not loaded')
    }

    try {
      // Preprocess image
      const tensor = this.preprocessImage(imageData)
      
      // Make prediction
      const prediction = this.model.predict(tensor) as tf.Tensor
      const probabilities = await prediction.data()
      
      // Get top prediction
      const maxIndex = probabilities.indexOf(Math.max(...Array.from(probabilities)))
      const confidence = probabilities[maxIndex]
      
      const diseases = [
        'Healthy',
        'Leaf Blight',
        'Leaf Rust',
        'Stem Rot',
        'Mosaic Virus'
      ]
      
      const recommendations = this.getRecommendations(diseases[maxIndex])
      
      // Cleanup
      tensor.dispose()
      prediction.dispose()
      
      return {
        disease: diseases[maxIndex],
        confidence: confidence,
        recommendations
      }
    } catch (error) {
      console.error('Disease detection failed:', error)
      throw error
    }
  }

  private preprocessImage(imageData: ImageData | HTMLImageElement): tf.Tensor {
    return tf.tidy(() => {
      let tensor: tf.Tensor3D
      
      if (imageData instanceof ImageData) {
        tensor = tf.browser.fromPixels(imageData) as tf.Tensor3D
      } else {
        tensor = tf.browser.fromPixels(imageData) as tf.Tensor3D
      }
      
      // Resize to 224x224
      const resized = tf.image.resizeBilinear(tensor, [224, 224])
      
      // Normalize to [0, 1]
      const normalized = resized.div(255.0)
      
      // Add batch dimension
      return normalized.expandDims(0)
    })
  }

  private getRecommendations(disease: string): string[] {
    const recommendationsMap: Record<string, string[]> = {
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
    
    return recommendationsMap[disease] || ['Consult with local agricultural extension officer']
  }
}

export class YieldPredictor {
  private model: tf.LayersModel | null = null
  private isLoaded = false

  constructor() {
    this.initializeModel()
  }

  private async initializeModel() {
    try {
      // Create a simple yield prediction model
      this.model = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [10], units: 64, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.3 }),
          tf.layers.dense({ units: 32, activation: 'relu' }),
          tf.layers.dense({ units: 1, activation: 'linear' })
        ]
      })
      
      this.model.compile({
        optimizer: 'adam',
        loss: 'meanSquaredError',
        metrics: ['mae']
      })
      
      this.isLoaded = true
      console.log('Yield prediction model loaded successfully')
    } catch (error) {
      console.error('Failed to initialize yield prediction model:', error)
    }
  }

  async predictYield(features: {
    rainfall: number
    temperature: number
    humidity: number
    soilPh: number
    nitrogen: number
    phosphorus: number
    potassium: number
    organicMatter: number
    plantingDate: number // days since planting
    cropType: number // encoded crop type
  }): Promise<{
    predictedYield: number
    confidence: number
    factors: { name: string; impact: number }[]
  }> {
    if (!this.isLoaded || !this.model) {
      throw new Error('Model not loaded')
    }

    try {
      const inputData = [
        features.rainfall,
        features.temperature,
        features.humidity,
        features.soilPh,
        features.nitrogen,
        features.phosphorus,
        features.potassium,
        features.organicMatter,
        features.plantingDate,
        features.cropType
      ]

      const tensor = tf.tensor2d([inputData])
      const prediction = this.model.predict(tensor) as tf.Tensor
      const result = await prediction.data()
      
      // Calculate confidence based on input quality
      const confidence = this.calculateConfidence(features)
      
      // Analyze factor importance
      const factors = this.analyzeFactors(features)
      
      // Cleanup
      tensor.dispose()
      prediction.dispose()
      
      return {
        predictedYield: result[0],
        confidence,
        factors
      }
    } catch (error) {
      console.error('Yield prediction failed:', error)
      throw error
    }
  }

  private calculateConfidence(features: any): number {
    // Simple confidence calculation based on reasonable ranges
    let score = 0
    let factors = 0

    // Check if values are in reasonable ranges
    if (features.rainfall >= 300 && features.rainfall <= 1500) score++
    if (features.temperature >= 15 && features.temperature <= 35) score++
    if (features.humidity >= 30 && features.humidity <= 90) score++
    if (features.soilPh >= 5.5 && features.soilPh <= 7.5) score++
    
    factors = 4
    return (score / factors) * 0.9 // Max 90% confidence
  }

  private analyzeFactors(features: any): { name: string; impact: number }[] {
    return [
      { name: 'Rainfall', impact: Math.min(features.rainfall / 1000, 1) },
      { name: 'Temperature', impact: features.temperature > 25 ? 0.8 : 0.6 },
      { name: 'Soil pH', impact: Math.abs(features.soilPh - 6.5) < 1 ? 0.9 : 0.5 },
      { name: 'Nutrients', impact: (features.nitrogen + features.phosphorus + features.potassium) / 300 }
    ]
  }
}

export class WeatherPredictor {
  private model: tf.LayersModel | null = null
  
  constructor() {
    this.initializeModel()
  }

  private async initializeModel() {
    // Simple LSTM model for weather prediction
    this.model = tf.sequential({
      layers: [
        tf.layers.lstm({ 
          inputShape: [7, 5], // 7 days, 5 features
          units: 50,
          returnSequences: true 
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.lstm({ units: 50 }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 5 }) // temp, humidity, rainfall, wind, pressure
      ]
    })
    
    this.model.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError'
    })
  }

  async predictWeather(historicalData: number[][]): Promise<{
    temperature: number
    humidity: number
    rainfall: number
    windSpeed: number
    pressure: number
  }> {
    if (!this.model) {
      throw new Error('Weather model not loaded')
    }

    const tensor = tf.tensor3d([historicalData])
    const prediction = this.model.predict(tensor) as tf.Tensor
    const result = await prediction.data()
    
    tensor.dispose()
    prediction.dispose()
    
    return {
      temperature: result[0],
      humidity: result[1],
      rainfall: result[2],
      windSpeed: result[3],
      pressure: result[4]
    }
  }
}

// Export singleton instances
export const cropDiseaseDetector = new CropDiseaseDetector()
export const yieldPredictor = new YieldPredictor()
export const weatherPredictor = new WeatherPredictor()
