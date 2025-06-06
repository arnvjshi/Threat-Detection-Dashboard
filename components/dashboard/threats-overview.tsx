"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, FileText, ImageIcon, ShieldAlert, TrendingUp } from "lucide-react"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface ThreatStats {
  audio: { count: number; trend: string }
  text: { count: number; trend: string }
  image: { count: number; trend: string }
  video : { count: number; trend: string }
  total: { count: number; trend: string }
}

interface Alert {
  type: "audio" | "text" | "image" | "video"
  message: string
  time: string
  icon: any
  color: string
}

export function ThreatsOverview() {
  const [stats, setStats] = useState<ThreatStats>({
    audio: { count: 0, trend: "0%" },
    text: { count: 0, trend: "0%" },
    image: { count: 0, trend: "0%" },
    video: { count: 0, trend: "0%" },
    total: { count: 0, trend: "0%" },
  })

  const [alerts, setAlerts] = useState<Alert[]>([])
  const [threatDistribution, setThreatDistribution] = useState<any[]>([])
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Function to load data from localStorage
  const loadDataFromLocalStorage = () => {
    if (typeof window === "undefined") return

    try {
      // Load audio analysis history
      const audioData = localStorage.getItem("audioAnalysisHistory")
      const audioHistory = audioData ? JSON.parse(audioData) : []

      // Load text analysis history
      const textData = localStorage.getItem("textAnalysisHistory")
      const textHistory = textData ? JSON.parse(textData) : []

      // Load image analysis history
      const imageData = localStorage.getItem("imageAnalysisHistory")
      const imageHistory = imageData ? JSON.parse(imageData) : []

      const videoData = localStorage.getItem("videoAnalysisHistory")
      const videoHistory = videoData ? JSON.parse(videoData) : []

      // Count threats by level
      const audioThreats = audioHistory.filter(
        (item: any) => item.threatLevel !== "none" && item.threatLevel !== "low",
      ).length

      const textThreats = textHistory.filter(
        (item: any) => item.threatLevel !== "none" && item.threatLevel !== "low",
      ).length

      const imageThreats = imageHistory.filter(
        (item: any) => item.threatLevel !== "none" && item.threatLevel !== "low",
      ).length

      const videoThreats = videoHistory.filter(
        (item: any) => item.threatLevel !== "none" && item.threatLevel !== "low",
      ).length

      const totalThreats = audioThreats + textThreats + imageThreats + videoThreats

      // Calculate trends (simplified for demo)
      const calculateTrend = (count: number) => {
        const random = Math.random() * 20 - 10 // Random between -10% and +10%
        return `${random > 0 ? "+" : ""}${random.toFixed(1)}%`
      }

      setStats({
        audio: { count: audioThreats, trend: calculateTrend(audioThreats) },
        text: { count: textThreats, trend: calculateTrend(textThreats) },
        image: { count: imageThreats, trend: calculateTrend(imageThreats) },
        video: { count: videoThreats, trend: calculateTrend(videoHistory) },
        total: { count: totalThreats, trend: calculateTrend(totalThreats) },
      })

      // Create threat distribution data for pie chart
      setThreatDistribution([
        { name: "Audio", value: audioThreats, color: "#ef4444" },
        { name: "Text", value: textThreats, color: "#f59e0b" },
        { name: "Image", value: imageThreats, color: "#8b5cf6" },
        { name: "Video", value: videoThreats, color: "#8b5cf6" },
      ])

      // Generate alerts from the most recent threats
      const newAlerts: Alert[] = []

      // Add audio alerts
      audioHistory
        .filter((item: any) => item.threatLevel !== "none" && item.threatLevel !== "low")
        .slice(-2)
        .forEach((item: any) => {
          const keywords = Array.isArray(item.detectedKeywords)
            ? item.detectedKeywords
                .map((kw: any) => (typeof kw === "string" ? kw : kw.keyword || String(kw)))
                .slice(0, 2)
                .join(", ")
            : "unknown threat"

          newAlerts.push({
            type: "audio",
            message: `Suspicious audio detected: ${keywords}`,
            time: new Date(item.timestamp).toLocaleTimeString(),
            icon: AlertTriangle,
            color: "text-red-500",
          })
        })

      // Add text alerts
      textHistory
        .filter((item: any) => item.threatLevel !== "none" && item.threatLevel !== "low")
        .slice(-2)
        .forEach((item: any) => {
          const keywords = Array.isArray(item.keywords)
            ? item.keywords
                .map((kw: any) => (typeof kw === "string" ? kw : kw.keyword || String(kw)))
                .slice(0, 2)
                .join(", ")
            : "concerning content"

          newAlerts.push({
            type: "text",
            message: `Threatening text identified: ${keywords}`,
            time: new Date(item.timestamp).toLocaleTimeString(),
            icon: FileText,
            color: "text-amber-500",
          })
        })

      // Add image alerts
      imageHistory
        .filter((item: any) => item.threatLevel !== "none" && item.threatLevel !== "low")
        .slice(-2)
        .forEach((item: any) => {
          const dangerousObjects = Array.isArray(item.dangerousObjects)
            ? item.dangerousObjects
                .map((obj: any) => (typeof obj === "string" ? obj : obj.object || String(obj)))
                .slice(0, 2)
                .join(", ")
            : "suspicious item"

          newAlerts.push({
            type: "image",
            message: `Dangerous object detected: ${dangerousObjects}`,
            time: new Date(item.timestamp).toLocaleTimeString(),
            icon: ImageIcon,
            color: "text-purple-500",
          })
        })

      // Sort by time (most recent first) and limit to 5
      newAlerts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      setAlerts(newAlerts.slice(0, 5))
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
    }
  }

  // Load data on component mount (client-side only)
  useEffect(() => {
    if (isClient) {
      loadDataFromLocalStorage()

      // Set up interval to refresh data
      const interval = setInterval(loadDataFromLocalStorage, 5000)
      return () => clearInterval(interval)
    }
  }, [isClient])

  // Listen for custom events from the analysis components
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleThreatDetected = (event: CustomEvent) => {
      const { type, message } = event.detail

      // Add new alert
      const newAlert: Alert = {
        type: type as "audio" | "text" | "image" | "video",
        message,
        time: "Just now",
        icon: type === "audio" ? AlertTriangle : type === "text" ? FileText : ImageIcon,
        color: type === "audio" ? "text-red-500" : type === "text" ? "text-amber-500" : "text-purple-500",
      }

      setAlerts((prev) => [newAlert, ...prev.slice(0, 4)])

      // Update stats
      setStats((prev) => {
        const newStats = { ...prev }
        newStats[type].count += 1
        newStats.total.count += 1
        return newStats
      })

      // Refresh data from localStorage
      loadDataFromLocalStorage()
    }

    // Add event listener
    window.addEventListener("threatDetected" as any, handleThreatDetected as EventListener)

    // Clean up
    return () => {
      window.removeEventListener("threatDetected" as any, handleThreatDetected as EventListener)
    }
  }, [isClient])

  return (
    <Card className="overflow-hidden border-0 bg-white/5 backdrop-blur-lg">
      <CardHeader className="bg-white/5 pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-purple-500" />
          Threats Overview
        </CardTitle>
        <CardDescription className="text-slate-300">Summary of detected threats across all channels</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-red-500/20 p-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Audio Threats</p>
                  <p className="text-2xl font-bold text-white">{stats.audio.count}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 text-xs text-red-400">
                <TrendingUp className="h-3 w-3" />
                <span>{stats.audio.trend}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-amber-500/20 p-2">
                  <FileText className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Text Threats</p>
                  <p className="text-2xl font-bold text-white">{stats.text.count}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-400">
                <TrendingUp className="h-3 w-3" />
                <span>{stats.text.trend}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-purple-500/20 p-2">
                  <ImageIcon className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Image Threats</p>
                  <p className="text-2xl font-bold text-white">{stats.image.count}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-1 text-xs text-purple-400">
                <TrendingUp className="h-3 w-3" />
                <span>{stats.image.trend}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-amber-500/20 p-2">
                  <FileText className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Video Threats</p>
                  <p className="text-2xl font-bold text-white">{stats.text.count}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-400">
                <TrendingUp className="h-3 w-3" />
                <span>{stats.video.trend}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-blue-500/20 p-2">
                  <ShieldAlert className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Total Threats</p>
                  <p className="text-2xl font-bold text-white">{stats.total.count}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-400">
                <TrendingUp className="h-3 w-3" />
                <span>{stats.total.trend}</span>
              </div>
            </div>
          </div>
        </div>

        {isClient && threatDistribution.length > 0 && threatDistribution.some((item) => item.value > 0) && (
          <div className="mt-6 rounded-lg bg-white/5 p-4">
            <h3 className="mb-4 text-lg font-medium text-white">Threat Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={threatDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {threatDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} threats`, "Count"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="mt-6 rounded-lg bg-white/5 p-4">
          <h3 className="mb-4 text-lg font-medium text-white">Recent Alerts</h3>
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between rounded-md bg-white/5 p-3">
                  <div className="flex items-center gap-3">
                    <alert.icon className={`h-5 w-5 ${alert.color}`} />
                    <div>
                      <p className="text-sm font-medium text-white">{alert.message}</p>
                      <p className="text-xs text-slate-400">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-md bg-white/5 p-6">
              <p className="text-slate-400">No recent alerts</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
