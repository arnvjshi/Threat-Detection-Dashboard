import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: 'ThreatShield',
  description: 'Created by Arnav Joshi',
  generator: 'arnavjoshi.vercel.app',
  //icons: { favicon: '/favicon.ico' },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Analytics/>
      <body>{children}</body>
    </html>
  )
}
