// Global type declarations for Web3 integration
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      selectedAddress: string | null
      networkVersion: string
      isMetaMask?: boolean
      on: (event: string, handler: (...args: any[]) => void) => void
      removeListener: (event: string, handler: (...args: any[]) => void) => void
    }
  }
}

export interface Web3Provider {
  request: (args: { method: string; params?: any[] }) => Promise<any>
  selectedAddress: string | null
  networkVersion: string
}

export interface EthereumProvider extends Web3Provider {
  isMetaMask?: boolean
  on: (event: string, handler: (...args: any[]) => void) => void
  removeListener: (event: string, handler: (...args: any[]) => void) => void
}

export {}
