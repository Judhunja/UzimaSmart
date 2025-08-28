// IPFS Storage Infrastructure for Carbon Credit Verification
let Web3Storage: any = null

// Dynamically import Web3Storage to handle potential server-side issues
try {
  if (typeof window !== 'undefined') {
    import('web3.storage').then(module => {
      Web3Storage = module.Web3Storage
    })
  }
} catch (error) {
  console.warn('Web3Storage not available:', error)
}

export interface CarbonCreditRecord {
  reportId: string
  farmDetails: {
    locationId: string
    ownerAddress: string
    landArea: number
    coordinates: {
      latitude: number
      longitude: number
    }
  }
  measurement: {
    timestamp: string
    carbonSequestered: number
    measurementPeriod: {
      start: string
      end: string
    }
    verificationMethod: string
  }
  proof: {
    satelliteImageCid?: string
    aiModelVersion: string
    confidenceScore: number
    rawDataHash: string
  }
  blockchain: {
    tokenId?: string
    transactionHash?: string
    networkId: string
  }
}

export class IPFSCarbonStorage {
  private client: any = null

  constructor() {
    this.initializeClient()
  }

  private initializeClient() {
    const token = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN
    if (!token) {
      console.warn('Web3.Storage token not found. IPFS features will be limited.')
      return
    }
    
    try {
      if (Web3Storage) {
        this.client = new Web3Storage({ token })
      }
    } catch (error) {
      console.error('Failed to initialize Web3.Storage client:', error)
    }
  }

  /**
   * Upload carbon credit verification data to IPFS
   */
  async uploadCarbonRecord(carbonData: CarbonCreditRecord): Promise<string | null> {
    if (!this.client) {
      console.error('IPFS client not initialized')
      return null
    }

    try {
      // Add metadata
      const enrichedData = {
        ...carbonData,
        uploadTimestamp: new Date().toISOString(),
        version: '1.0',
        standard: 'Carbon Credit Verification Standard v1.0'
      }

      // Create file from JSON data
      const file = new File(
        [JSON.stringify(enrichedData, null, 2)],
        `carbon-record-${carbonData.reportId}.json`,
        { type: 'application/json' }
      )

      // Upload to IPFS
      const cid = await this.client.put([file], {
        name: `Carbon Credit Record ${carbonData.reportId}`,
        maxRetries: 3
      })

      console.log(`Carbon record uploaded to IPFS: ${cid}`)
      return cid
    } catch (error) {
      console.error('Failed to upload carbon record to IPFS:', error)
      return null
    }
  }

  /**
   * Retrieve verification report from IPFS
   */
  async retrieveVerificationReport(cid: string): Promise<CarbonCreditRecord | null> {
    if (!this.client) {
      console.error('IPFS client not initialized')
      return null
    }

    try {
      const res = await this.client.get(cid)
      if (!res?.ok) {
        throw new Error(`Failed to fetch from IPFS: ${res?.status}`)
      }

      const files = await res.files()
      if (files.length === 0) {
        throw new Error('No files found in IPFS response')
      }

      const file = files[0]
      const content = await file.text()
      const carbonData = JSON.parse(content) as CarbonCreditRecord

      return carbonData
    } catch (error) {
      console.error('Failed to retrieve verification report from IPFS:', error)
      return null
    }
  }

  /**
   * Validate data integrity using hash comparison
   */
  async validateDataIntegrity(cid: string, expectedHash: string): Promise<boolean> {
    try {
      const data = await this.retrieveVerificationReport(cid)
      if (!data) return false

      // Create hash of the retrieved data
      const dataString = JSON.stringify(data)
      const encoder = new TextEncoder()
      const dataBuffer = encoder.encode(dataString)
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

      return hashHex === expectedHash
    } catch (error) {
      console.error('Failed to validate data integrity:', error)
      return false
    }
  }

  /**
   * Generate IPFS gateway URL for public access
   */
  getPublicUrl(cid: string, filename?: string): string {
    const baseUrl = 'https://w3s.link/ipfs'
    return filename ? `${baseUrl}/${cid}/${filename}` : `${baseUrl}/${cid}`
  }

  /**
   * List all files for a given CID
   */
  async listFiles(cid: string): Promise<string[]> {
    if (!this.client) {
      console.error('IPFS client not initialized')
      return []
    }

    try {
      const res = await this.client.get(cid)
      if (!res?.ok) {
        throw new Error(`Failed to fetch from IPFS: ${res?.status}`)
      }

      const files = await res.files()
      return files.map((file: any) => file.name)
    } catch (error) {
      console.error('Failed to list files from IPFS:', error)
      return []
    }
  }

  /**
   * Upload satellite image data to IPFS
   */
  async uploadSatelliteImage(imageBlob: Blob, recordId: string): Promise<string | null> {
    if (!this.client) {
      console.error('IPFS client not initialized')
      return null
    }

    try {
      const file = new File(
        [imageBlob],
        `satellite-image-${recordId}.jpg`,
        { type: 'image/jpeg' }
      )

      const cid = await this.client.put([file], {
        name: `Satellite Image ${recordId}`,
        maxRetries: 3
      })

      console.log(`Satellite image uploaded to IPFS: ${cid}`)
      return cid
    } catch (error) {
      console.error('Failed to upload satellite image to IPFS:', error)
      return null
    }
  }
}

// Export singleton instance
export const ipfsStorage = new IPFSCarbonStorage()
