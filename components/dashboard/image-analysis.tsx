"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ImageIcon, Upload, AlertTriangle, Loader2, Camera, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ThreatData {
  threatDetected: boolean
  threatProbability: number
  threatLevel: "none" | "low" | "medium" | "high" | "critical"
  detectedObjects: string[] | Array<{ object: string; confidence: number }>
  dangerousObjects: string[] | Array<{ object: string; confidence: number }>
  analysis: string
  recommendation: string
  timestamp: string
}

export function ImageAnalysis() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<ThreatData | null>(null)
  const [historicalData, setHistoricalData] = useState<ThreatData[]>([])
  const [isClient, setIsClient] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load historical data from localStorage on component mount (client-side only)
  useEffect(() => {
    if (!isClient) return

    const storedData = localStorage.getItem("imageAnalysisHistory")
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setHistoricalData(parsedData)
      } catch (error) {
        console.error("Error parsing stored data:", error)
      }
    }
  }, [isClient])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const captureImage = async () => {
    if (typeof window === "undefined") return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      const video = document.createElement("video")
      video.srcObject = stream

      // Wait for video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve
      })

      video.play()

      // Create canvas and capture image
      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(video, 0, 0)

      // Convert to file
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" })
          setSelectedImage(file)
          setImagePreview(canvas.toDataURL("image/jpeg"))
        }

        // Stop all video tracks
        stream.getTracks().forEach((track) => track.stop())
      }, "image/jpeg")
    } catch (error) {
      console.error("Error capturing image:", error)
      toast({
        title: "Camera access failed",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const clearImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please select or capture an image first.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append("image", selectedImage)

      const response = await fetch("/api/analyze-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to analyze image")
      }

      const data = await response.json()

      // Normalize the data to ensure detectedObjects and dangerousObjects are always string arrays
      const normalizedData = {
        ...data,
        detectedObjects: Array.isArray(data.detectedObjects)
          ? data.detectedObjects.map((obj: any) => (typeof obj === "string" ? obj : obj.object || String(obj)))
          : [],
        dangerousObjects: Array.isArray(data.dangerousObjects)
          ? data.dangerousObjects.map((obj: any) => (typeof obj === "string" ? obj : obj.object || String(obj)))
          : [],
      }

      setResult(normalizedData)

      // Save to localStorage (client-side only)
      if (typeof window !== "undefined") {
        const newHistoricalData = [...historicalData, normalizedData]
        setHistoricalData(newHistoricalData)
        localStorage.setItem("imageAnalysisHistory", JSON.stringify(newHistoricalData))

        // Dispatch event for the overview component
        if (
          normalizedData.threatDetected &&
          normalizedData.threatLevel !== "none" &&
          normalizedData.threatLevel !== "low"
        ) {
          const event = new CustomEvent("threatDetected", {
            detail: {
              type: "image",
              message: `Dangerous object detected: ${normalizedData.dangerousObjects.slice(0, 2).join(", ")}`,
            },
          })
          window.dispatchEvent(event)
        }
      }
    } catch (error) {
      console.error("Error analyzing image:", error)
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing the image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getThreatLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "none":
        return "text-green-400"
      case "low":
        return "text-blue-400"
      case "medium":
        return "text-amber-400"
      case "high":
        return "text-orange-400"
      case "critical":
        return "text-red-400"
      default:
        return "text-slate-400"
    }
  }

  const getThreatLevelProgressColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "none":
        return "bg-green-500"
      case "low":
        return "bg-blue-500"
      case "medium":
        return "bg-amber-500"
      case "high":
        return "bg-orange-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-slate-500"
    }
  }

  // Prepare chart data
  const chartData = historicalData.slice(-10).map((item) => ({
    timestamp: new Date(item.timestamp).toLocaleTimeString(),
    probability: item.threatProbability,
    level: item.threatLevel,
  }))

  return (
    <Card className="overflow-hidden border-0 bg-white/5 backdrop-blur-lg">
      <CardHeader className="bg-white/5 pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-purple-500" />
          Image Analysis
        </CardTitle>
        <CardDescription className="text-slate-300">Detect threats and dangerous objects in images</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row">
          <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
          <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={captureImage}>
            <Camera className="mr-2 h-4 w-4" />
            Capture Image
          </Button>
        </div>

        {imagePreview && (
          <div className="mb-6 relative">
            <div className="absolute top-2 right-2 z-10">
              <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full" onClick={clearImage}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="overflow-hidden rounded-lg border border-white/10">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Selected"
                className="w-full h-auto object-contain max-h-[300px]"
              />
            </div>
            <div className="mt-4 flex justify-center">
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={analyzeImage} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Analyze for Threats
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="mb-6 flex items-center justify-center rounded-lg bg-white/5 p-8">
            <div className="flex flex-col items-center">
              <Loader2 className="mb-2 h-8 w-8 animate-spin text-purple-500" />
              <p className="text-slate-300">Analyzing image for potential threats...</p>
            </div>
          </div>
        )}

        {result && !isAnalyzing && (
          <div className="space-y-4">
            <div className="rounded-lg bg-white/5 p-4">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-medium text-white">Threat Probability</h4>
                <span className={`text-sm ${getThreatLevelColor(result.threatLevel)}`}>
                  {result.threatLevel} ({result.threatProbability}%)
                </span>
              </div>
              <Progress
                value={result.threatProbability}
                className="h-2 bg-white/10"
                indicatorClassName={getThreatLevelProgressColor(result.threatLevel)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {result.detectedObjects && result.detectedObjects.length > 0 && (
                <div className="rounded-lg bg-white/5 p-4">
                  <h4 className="mb-2 font-medium text-white">Detected Objects</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.detectedObjects.map((object, index) => (
                      <span key={index} className="rounded-full bg-slate-500/20 px-3 py-1 text-xs text-slate-300">
                        {object}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.dangerousObjects && result.dangerousObjects.length > 0 && (
                <div className="rounded-lg bg-white/5 p-4">
                  <h4 className="mb-2 font-medium text-white">Dangerous Objects</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.dangerousObjects.map((object, index) => (
                      <span
                        key={index}
                        className={`rounded-full ${
                          result.threatLevel === "high" || result.threatLevel === "critical"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-amber-500/20 text-amber-400"
                        } px-3 py-1 text-xs`}
                      >
                        {object}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {result.analysis && (
              <div className="rounded-lg bg-white/5 p-4">
                <h4 className="mb-2 font-medium text-white">Analysis</h4>
                <p className="text-sm text-slate-300">{result.analysis}</p>
              </div>
            )}

            {result.recommendation && (
              <div className="rounded-lg bg-white/5 p-4">
                <h4 className="mb-2 font-medium text-white">Recommendation</h4>
                <p className="text-sm text-slate-300">{result.recommendation}</p>
              </div>
            )}
          </div>
        )}

        {isClient && historicalData.length > 0 && (
          <div className="mt-6 rounded-lg bg-white/5 p-4">
            <h4 className="mb-4 font-medium text-white">Threat Detection History</h4>
            <div className="h-64">
              <ChartContainer
                config={{
                  probability: {
                    label: "Threat Probability",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                      dataKey="timestamp"
                      stroke="rgba(255,255,255,0.5)"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="probability"
                      stroke="var(--color-probability)"
                      name="Threat Probability"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
