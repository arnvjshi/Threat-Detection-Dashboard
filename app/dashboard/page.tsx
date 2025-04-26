"use client"

import { Navbar } from "@/components/navbar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ThreeBackground } from "@/components/three-background"
import dynamic from "next/dynamic"
import { useState } from "react"

// Dynamically import components
const AudioAnalysis = dynamic(() => import("@/components/dashboard/audio-analysis").then((mod) => ({ default: mod.AudioAnalysis })), { ssr: false })
const TextAnalysis = dynamic(() => import("@/components/dashboard/text-analysis").then((mod) => ({ default: mod.TextAnalysis })), { ssr: false })
const ImageAnalysis = dynamic(() => import("@/components/dashboard/image-analysis").then((mod) => ({ default: mod.ImageAnalysis })), { ssr: false })
const ThreatsOverview = dynamic(() => import("@/components/dashboard/threats-overview").then((mod) => ({ default: mod.ThreatsOverview })), { ssr: false })

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("all")

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
      <ThreeBackground intensity={0.3} />
      <div className="relative z-10">
      
        <Navbar />
        <main className="container mx-auto px-4 py-8">
        <div className="pt-20">
          <DashboardHeader selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

          {/* Render content based on selected tab */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {selectedTab === "all" && (
              <>
                <ThreatsOverview />
                <div className="grid gap-6">
                  <AudioAnalysis />
                  <TextAnalysis />
                </div>
                <div className="lg:col-span-2">
                  <ImageAnalysis />
                </div>
              </>
            )}
            {selectedTab === "audio" && <AudioAnalysis />}
            {selectedTab === "text" && <TextAnalysis />}
            {selectedTab === "image" && <ImageAnalysis />}
          </div>
        </div>
        </main>
      </div>
    </div>
  )
}
