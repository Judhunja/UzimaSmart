import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UzimaSmart - Kenya Climate Monitoring',
  description: 'Real-time climate monitoring and community reporting for Kenya',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
