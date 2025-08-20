'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  GlobeAltIcon, 
  CurrencyDollarIcon, 
  ShieldCheckIcon, 
  DocumentTextIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { verificationSystem, VerificationReport } from '../../lib/carbon-credits/verification-system'
import { carbonToken } from '../../lib/carbon-credits/blockchain-token'

interface CarbonCreditStats {
  totalCredits: number
  verifiedProjects: number
  totalValue: number
  pendingVerifications: number
}

interface WalletInfo {
  address: string | null
  balance: number
  connected: boolean
}

export default function CarbonCreditDashboard() {
  const [stats, setStats] = useState<CarbonCreditStats>({
    totalCredits: 0,
    verifiedProjects: 0,
    totalValue: 0,
    pendingVerifications: 0
  })

  const [wallet, setWallet] = useState<WalletInfo>({
    address: null,
    balance: 0,
    connected: false
  })

  const [reports, setReports] = useState<VerificationReport[]>([])
  const [selectedReport, setSelectedReport] = useState<VerificationReport | null>(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load verification reports
      const allReports = verificationSystem.getAllVerificationReports()
      setReports(allReports)

      // Calculate stats
      const verifiedProjects = allReports.filter(r => r.status === 'minted').length
      const totalCredits = allReports
        .filter(r => r.status === 'minted')
        .reduce((sum, r) => sum + r.measurement.carbonSequestered, 0)
      const pendingVerifications = allReports.filter(r => r.status === 'pending').length

      setStats({
        totalCredits: Math.round(totalCredits * 100) / 100,
        verifiedProjects,
        totalValue: Math.round(totalCredits * 25 * 100) / 100, // Assuming $25 per credit
        pendingVerifications
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    }
  }

  const connectWallet = async () => {
    setIsLoading(true)
    try {
      const address = await carbonToken.connectWallet()
      if (address) {
        const balance = await carbonToken.getBalance(address)
        setWallet({
          address,
          balance: Math.round(balance * 100) / 100,
          connected: true
        })
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateDemoVerification = async () => {
    setIsLoading(true)
    try {
      // Demo farm data
      const farmData = {
        farmId: `FARM-${Date.now()}`,
        ownerAddress: wallet.address || '0x1234567890123456789012345678901234567890',
        landArea: Math.random() * 50 + 10, // 10-60 hectares
        coordinates: {
          latitude: -1.2921 + (Math.random() - 0.5) * 0.1, // Around Nairobi
          longitude: 36.8219 + (Math.random() - 0.5) * 0.1
        },
        cropType: ['Maize', 'Coffee', 'Tea', 'Sugarcane'][Math.floor(Math.random() * 4)],
        farmingPractices: ['Agroforestry', 'Cover Cropping', 'Organic Fertilizers']
      }

      // Demo satellite data
      const satelliteData = {
        imageUrl: 'https://example.com/satellite-image.jpg',
        timestamp: new Date().toISOString(),
        coordinates: farmData.coordinates,
        resolution: 10, // meters
        cloudCover: Math.random() * 30 // 0-30% cloud cover
      }

      // Complete verification workflow
      const result = await verificationSystem.completeVerificationWorkflow(farmData, satelliteData)
      
      if (result) {
        console.log('Demo verification completed:', result)
        await loadDashboardData() // Refresh data
        
        // Update wallet balance if connected
        if (wallet.connected && wallet.address) {
          const newBalance = await carbonToken.getBalance(wallet.address)
          setWallet(prev => ({ ...prev, balance: Math.round(newBalance * 100) / 100 }))
        }
      }
    } catch (error) {
      console.error('Failed to generate demo verification:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const viewReportDetails = (report: VerificationReport) => {
    setSelectedReport(report)
    setShowReportModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'minted': return 'text-green-600 bg-green-100'
      case 'verified': return 'text-blue-600 bg-blue-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              {trend > 0 ? (
                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Carbon Credit Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Track, verify, and trade carbon credits with blockchain technology
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="mb-8">
          {!wallet.connected ? (
            <button
              onClick={connectWallet}
              disabled={isLoading}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Connected Wallet</p>
                  <p className="font-mono text-sm text-gray-900">
                    {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Balance</p>
                  <p className="text-lg font-semibold text-primary-600">
                    {wallet.balance} CCT
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Carbon Credits"
            value={`${stats.totalCredits} tCO₂`}
            icon={GlobeAltIcon}
            trend={12}
            color="text-green-600"
          />
          <StatCard
            title="Verified Projects"
            value={stats.verifiedProjects}
            icon={ShieldCheckIcon}
            trend={8}
            color="text-blue-600"
          />
          <StatCard
            title="Total Value"
            value={`$${stats.totalValue.toLocaleString()}`}
            icon={CurrencyDollarIcon}
            trend={15}
            color="text-purple-600"
          />
          <StatCard
            title="Pending Verifications"
            value={stats.pendingVerifications}
            icon={DocumentTextIcon}
            color="text-yellow-600"
          />
        </div>

        {/* Actions */}
        <div className="mb-8">
          <button
            onClick={generateDemoVerification}
            disabled={isLoading}
            className="bg-secondary-600 hover:bg-secondary-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            {isLoading ? 'Processing...' : 'Generate Demo Verification'}
          </button>
        </div>

        {/* Verification Reports Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Verification Reports</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Farm ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carbon Credits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.reportId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {report.reportId.slice(0, 12)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.farmDetails.locationId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.measurement.carbonSequestered} tCO₂
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(report.measurement.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => viewReportDetails(report)}
                        className="text-primary-600 hover:text-primary-900 flex items-center"
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No verification reports found. Generate a demo verification to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Report Details Modal */}
        {showReportModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Verification Report Details</h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Report Information</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <p><span className="font-medium">Report ID:</span> {selectedReport.reportId}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded ${getStatusColor(selectedReport.status)}`}>
                        {selectedReport.status}
                      </span>
                    </p>
                    <p><span className="font-medium">Carbon Sequestered:</span> {selectedReport.measurement.carbonSequestered} tCO₂</p>
                    <p><span className="font-medium">Confidence Score:</span> {(selectedReport.proof.confidenceScore * 100).toFixed(1)}%</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Farm Details</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <p><span className="font-medium">Location ID:</span> {selectedReport.farmDetails.locationId}</p>
                    <p><span className="font-medium">Land Area:</span> {selectedReport.farmDetails.landArea} hectares</p>
                    <p><span className="font-medium">Coordinates:</span> {selectedReport.farmDetails.coordinates.latitude.toFixed(4)}, {selectedReport.farmDetails.coordinates.longitude.toFixed(4)}</p>
                  </div>
                </div>

                {selectedReport.ipfsCid && (
                  <div>
                    <h4 className="font-medium text-gray-900">IPFS Storage</h4>
                    <div className="mt-2 text-sm">
                      <p><span className="font-medium">CID:</span> 
                        <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">{selectedReport.ipfsCid}</code>
                      </p>
                    </div>
                  </div>
                )}

                {selectedReport.blockchain.transactionHash && (
                  <div>
                    <h4 className="font-medium text-gray-900">Blockchain Transaction</h4>
                    <div className="mt-2 text-sm">
                      <p><span className="font-medium">TX Hash:</span> 
                        <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">{selectedReport.blockchain.transactionHash}</code>
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-200">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
