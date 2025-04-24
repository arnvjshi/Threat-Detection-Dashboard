"use client"

import { Navbar } from "@/components/navbar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ThreeBackground } from "@/components/three-background"
import dynamic from "next/dynamic"

// Dynamically import components that use localStorage with SSR disabled
const AudioAnalysis = dynamic(
  () => import("@/components/dashboard/audio-analysis").then((mod) => ({ default: mod.AudioAnalysis })),
  { ssr: false },
)
const TextAnalysis = dynamic(
  () => import("@/components/dashboard/text-analysis").then((mod) => ({ default: mod.TextAnalysis })),
  { ssr: false },
)
const ImageAnalysis = dynamic(
  () => import("@/components/dashboard/image-analysis").then((mod) => ({ default: mod.ImageAnalysis })),
  { ssr: false },
)
const ThreatsOverview = dynamic(
  () => import("@/components/dashboard/threats-overview").then((mod) => ({ default: mod.ThreatsOverview })),
  { ssr: false },
)

export default function Dashboard() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
      <ThreeBackground intensity={0.3} />
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <DashboardHeader />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ThreatsOverview />
            <div className="grid gap-6">
              <AudioAnalysis />
              <TextAnalysis />
            </div>
            <div className="lg:col-span-2">
              <ImageAnalysis />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
