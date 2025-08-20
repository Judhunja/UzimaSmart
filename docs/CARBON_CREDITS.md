# Carbon Credit Tokenization System - UzimaSmart

## Overview

UzimaSmart's Carbon Credit Tokenization System is a comprehensive blockchain-backed platform that enables transparent verification of carbon sequestration through satellite data and AI analytics. The system stores immutable records on IPFS and creates tokenized carbon credits on public blockchain networks.

## Architecture

### Core Components

1. **IPFS Storage Infrastructure** (`lib/carbon-credits/ipfs-storage.ts`)
   - Immutable, tamper-proof storage for verification data
   - Uses Web3.Storage with 5GB free tier
   - Stores JSON verification reports with metadata

2. **Blockchain Token Architecture** (`lib/carbon-credits/blockchain-token.ts`)
   - ERC-20 compatible carbon credit tokens
   - Supports Polygon Mumbai testnet for development
   - Mintable, transferable, and retirable tokens

3. **Verification System** (`lib/carbon-credits/verification-system.ts`)
   - AI-powered satellite data analysis
   - Automated verification report generation
   - Complete workflow management

4. **Dashboard Interface** (`components/sections/CarbonCreditDashboard.tsx`)
   - Real-time portfolio tracking
   - Verification report access
   - Wallet integration and token management

## Data Structures

### Carbon Credit Record
```typescript
interface CarbonCreditRecord {
  reportId: string
  farmDetails: {
    locationId: string
    ownerAddress: string
    landArea: number
    coordinates: { latitude: number, longitude: number }
  }
  measurement: {
    timestamp: string
    carbonSequestered: number
    measurementPeriod: { start: string, end: string }
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
```

## Key Features

### 1. Immutable Records
- All verification data stored permanently on IPFS
- Cryptographic hashing ensures data integrity
- Public accessibility for transparency

### 2. Transparent Auditing
- Complete audit trail from measurement to retirement
- Public verification of all carbon sequestration claims
- Real-time status tracking

### 3. Anti-Double-Counting
- Unique token IDs prevent credit duplication
- Blockchain-based ownership verification
- Immutable transaction history

### 4. Automated Verification
- AI-powered satellite image analysis
- Confidence scoring for reliability
- Reduced manual verification processes

## Usage Guide

### Environment Setup

1. **Web3.Storage Configuration**
```bash
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_web3_storage_token
```

2. **Blockchain Configuration**
```bash
NEXT_PUBLIC_POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
```

### Basic Operations

#### 1. Upload Verification Data to IPFS
```typescript
import { ipfsStorage } from './lib/carbon-credits/ipfs-storage'

const carbonData = {
  reportId: 'CR-123456',
  farmDetails: { /* farm data */ },
  measurement: { /* measurement data */ },
  proof: { /* verification proof */ },
  blockchain: { /* blockchain info */ }
}

const cid = await ipfsStorage.uploadCarbonRecord(carbonData)
```

#### 2. Mint Carbon Credit Tokens
```typescript
import { carbonToken } from './lib/carbon-credits/blockchain-token'

const mintParams = {
  to: '0x1234567890123456789012345678901234567890',
  amount: 25.5, // tons CO2
  ipfsCid: 'QmX7Y8Z9...',
  verificationData: {
    farmId: 'FARM-001',
    carbonAmount: 25.5,
    timestamp: '2024-01-15T10:00:00Z'
  }
}

const txHash = await carbonToken.mintCarbonCredits(mintParams)
```

#### 3. Complete Verification Workflow
```typescript
import { verificationSystem } from './lib/carbon-credits/verification-system'

const farmData = {
  farmId: 'FARM-001',
  ownerAddress: '0x1234...',
  landArea: 50,
  coordinates: { latitude: -1.2921, longitude: 36.8219 },
  cropType: 'Maize',
  farmingPractices: ['Agroforestry', 'Cover Cropping']
}

const satelliteData = {
  imageUrl: 'https://satellite-image.jpg',
  timestamp: '2024-01-15T10:00:00Z',
  coordinates: { latitude: -1.2921, longitude: 36.8219 },
  resolution: 10,
  cloudCover: 15
}

const result = await verificationSystem.completeVerificationWorkflow(
  farmData, 
  satelliteData
)
```

## API Endpoints

### GET `/api/carbon-credits`

**Query Parameters:**
- `action`: Operation type (`stats`, `reports`, `mock`)
- `farmerId`: Filter by farmer ID
- `reportId`: Get specific report
- `ownerAddress`: Filter by owner

**Example:**
```bash
GET /api/carbon-credits?action=stats
```

### POST `/api/carbon-credits`

**Body:**
```json
{
  "action": "create",
  "farmerId": "farmer_001",
  "amount": 25.5,
  "source": "agroforestry"
}
```

## Security Features

### 1. Data Integrity
- SHA-256 hashing of all verification data
- IPFS content addressing for tamper detection
- Cryptographic proof of data authenticity

### 2. Fraud Prevention
- AI confidence scoring (minimum 70% for minting)
- Timestamp validation (no future dates, reasonable age limits)
- Duplicate prevention through unique identifiers

### 3. Regulatory Compliance
- Structured data format following carbon credit standards
- Complete audit trail maintenance
- Public verification data access

## Development Workflow

1. **Local Development**
   - Use Polygon Mumbai testnet for free transactions
   - Mock satellite data for testing
   - Local IPFS node or Web3.Storage

2. **Testing**
   - Unit tests for core functions
   - Integration tests for full workflows
   - Mock data for reproducible tests

3. **Production Deployment**
   - Mainnet blockchain integration
   - Real satellite data sources
   - Production IPFS infrastructure

## Cost Considerations

### Development (Free)
- Polygon Mumbai testnet: Free transactions
- Web3.Storage: 5GB free tier
- Mock satellite data: No cost

### Production
- Polygon mainnet: ~$0.01 per transaction
- Web3.Storage: $5/month for 100GB
- Satellite data: Variable based on provider

## Monitoring and Analytics

### Dashboard Metrics
- Total carbon credits minted
- Verification success rate
- Average confidence scores
- Transaction volume and value

### System Health
- IPFS storage status
- Blockchain network connectivity
- API response times
- Error rates and types

## Future Enhancements

1. **Advanced AI Models**
   - Improved carbon sequestration calculations
   - Multi-spectral satellite analysis
   - Machine learning model versioning

2. **Cross-Chain Support**
   - Multi-blockchain deployment
   - Bridge contracts for interoperability
   - Layer 2 scaling solutions

3. **Market Integration**
   - Automated trading interfaces
   - Price discovery mechanisms
   - Liquidity pool integration

4. **Regulatory Features**
   - Compliance reporting automation
   - Jurisdiction-specific standards
   - Government integration APIs

## Support and Maintenance

### Error Handling
- Graceful IPFS failures with retry logic
- Blockchain transaction failure recovery
- User-friendly error messages

### Backup and Recovery
- IPFS data redundancy across multiple nodes
- Blockchain data is inherently backed up
- Regular database snapshots for metadata

### Performance Optimization
- IPFS caching for frequently accessed data
- Blockchain batch operations for efficiency
- CDN integration for global access

## Conclusion

The Carbon Credit Tokenization System provides a complete, transparent, and secure platform for carbon credit verification and trading. By combining AI analysis, satellite data, IPFS storage, and blockchain technology, it creates an immutable and trustworthy carbon offset marketplace that benefits both farmers and environmental initiatives.
