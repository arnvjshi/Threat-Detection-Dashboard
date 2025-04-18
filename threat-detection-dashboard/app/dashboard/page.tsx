"use client"

import { useState } from "react"
import Link from "next/link"
import { AlertCircle, CheckCircle, Home } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ThreatChart } from "@/components/threat-chart"
import { VideoStream } from "@/components/video-stream"
import { AudioStream } from "@/components/audio-stream"
import { TextAnalyzer } from "@/components/text-analyzer"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Dashboard() {
  const [threatDetected, setThreatDetected] = useState(false)
  const [threatLevel, setThreatLevel] = useState(0)
  const [threatData, setThreatData] = useState<{ time: string; level: number }[]>([])

  // This would be connected to your actual threat detection logic
  const updateThreatStatus = (detected: boolean, level: number) => {
    setThreatDetected(detected)
    setThreatLevel(level)

    // Add new data point to chart
    const now = new Date()
    const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`

    setThreatData((prev) => {
      const newData = [...prev, { time: timeString, level }]
      // Keep only the last 20 data points for the chart
      if (newData.length > 20) {
        return newData.slice(newData.length - 20)
      }
      return newData
    })
  }

  const resetVals=()=>{
    setThreatDetected(false)
    setThreatLevel(0)
    setThreatData([])
  }

  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold">Multimodal Threat Detection System</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" size="icon" asChild>
              <Link href="/">
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6 space-y-6">
        {/* Threat Status Card */}
        <Card className={threatDetected ? "border-red-500" : "border-green-500"}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              {threatDetected ? (
                <>
                  <AlertCircle className="h-6 w-6 text-red-500" />
                  <span className="text-red-500 text-xl">THREAT DETECTED</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-green-500 text-xl">SAFE</span>
                </>
              )}
            </CardTitle>
            <CardDescription className={threatDetected ? "text-red-500 font-medium" : ""}>
              Current threat level: {threatLevel}/100
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Threat Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Threat Detection Levels</CardTitle>
            <CardDescription>Real-time monitoring of threat levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ThreatChart data={threatData} />
            </div>
          </CardContent>
        </Card>

        {/* Input Streams */}
        <Card>
          <CardHeader>
            <CardTitle>Input Streams</CardTitle>
            <CardDescription>Select an input method for threat analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="text">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="video" onClick={resetVals}>Video</TabsTrigger>
                <TabsTrigger value="audio" onClick={resetVals}>Audio</TabsTrigger>
                <TabsTrigger value="text" onClick={resetVals}>Text</TabsTrigger>
              </TabsList>
              <TabsContent value="video" className="mt-4">
                <VideoStream onAnalysis={updateThreatStatus} />
              </TabsContent>
              <TabsContent value="audio" className="mt-4">
                <AudioStream onAnalysis={updateThreatStatus} />
              </TabsContent>
              <TabsContent value="text" className="mt-4">
                <TextAnalyzer onAnalysis={updateThreatStatus} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
