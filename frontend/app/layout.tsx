import type { Metadata } from 'next'
import './globals.css'
import { ClimateNavigation } from '@/components/layout/ClimateNavigation'

export const metadata = {
  title: 'UzimaSmart - Kenya Climate Monitor',
  description: 'Empowering Kenyan communities with real-time climate data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClimateNavigation />
        {children}
      </body>
    </html>
  )
}
