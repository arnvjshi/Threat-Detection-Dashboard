"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, Search, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface TextAnalysisResult {
  threatProbability: number
  threatLevel: string
  sentiment?: {
    negative: number
    neutral: number
    positive: number
  }
  flaggedContent?: string
  keywords?: string[]
  summary?: string
  timestamp: string
}

export function TextAnalysis() {
  const [text, setText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<TextAnalysisResult | null>(null)
  const [historicalData, setHistoricalData] = useState<TextAnalysisResult[]>([])
  const [isClient, setIsClient] = useState(false)
  const { toast } = useToast()

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load historical data from localStorage on component mount (client-side only)
  useEffect(() => {
    if (!isClient) return

    const storedData = localStorage.getItem("textAnalysisHistory")
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setHistoricalData(parsedData)
      } catch (error) {
        console.error("Error parsing stored data:", error)
      }
    }
  }, [isClient])

  const analyzeText = async () => {
    if (!text.trim()) {
      toast({
        title: "Text required",
        description: "Please enter some text to analyze",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze text")
      }

      const data = await response.json()

      // Add timestamp
      const resultWithTimestamp = {
        ...data,
        timestamp: new Date().toISOString(),
      }

      setResult(resultWithTimestamp)

      // Save to localStorage (client-side only)
      if (typeof window !== "undefined") {
        const newHistoricalData = [...historicalData, resultWithTimestamp]
        setHistoricalData(newHistoricalData)
        localStorage.setItem("textAnalysisHistory", JSON.stringify(newHistoricalData))

        // Dispatch event for the overview component
        if (data.threatLevel !== "none" && data.threatLevel !== "low") {
          const event = new CustomEvent("threatDetected", {
            detail: {
              type: "text",
              message: `Threatening text detected: ${data.flaggedContent?.substring(0, 30)}...`,
            },
          })
          window.dispatchEvent(event)
        }
      }
    } catch (error) {
      console.error("Error analyzing text:", error)
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing the text. Please try again.",
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
          <FileText className="h-5 w-5 text-purple-500" />
          Text Analysis
        </CardTitle>
        <CardDescription className="text-slate-300">Detect threats in written content</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4">
          <Textarea
            placeholder="Enter or paste text to analyze..."
            className="min-h-24 bg-white/5 text-white placeholder:text-slate-400"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <Button
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            onClick={analyzeText}
            disabled={isAnalyzing || !text.trim()}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze Text
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-purple-500 text-purple-500 hover:bg-purple-950/20"
            onClick={() => document.getElementById("text-upload")?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
          <input
            id="text-upload"
            type="file"
            accept=".txt,.doc,.docx,.pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0]
                const reader = new FileReader()
                reader.onload = (event) => {
                  if (event.target?.result) {
                    setText(event.target.result.toString())
                  }
                }
                reader.readAsText(file)
              }
            }}
          />
        </div>

        {result && (
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

            {result.sentiment && (
              <div className="rounded-lg bg-white/5 p-4">
                <h4 className="mb-2 font-medium text-white">Sentiment Analysis</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-md bg-white/5 p-2 text-center">
                    <div className="text-xs text-slate-300">Negative</div>
                    <div className="text-lg font-bold text-red-400">{result.sentiment.negative}%</div>
                  </div>
                  <div className="rounded-md bg-white/5 p-2 text-center">
                    <div className="text-xs text-slate-300">Neutral</div>
                    <div className="text-lg font-bold text-slate-300">{result.sentiment.neutral}%</div>
                  </div>
                  <div className="rounded-md bg-white/5 p-2 text-center">
                    <div className="text-xs text-slate-300">Positive</div>
                    <div className="text-lg font-bold text-green-400">{result.sentiment.positive}%</div>
                  </div>
                </div>
              </div>
            )}

            {result.flaggedContent && (
              <div className="rounded-lg bg-white/5 p-4">
                <h4 className="mb-2 font-medium text-white">Flagged Content</h4>
                <div className="text-sm text-slate-300">
                  <p>{result.flaggedContent}</p>
                </div>
              </div>
            )}

            {result.keywords && result.keywords.length > 0 && (
              <div className="rounded-lg bg-white/5 p-4">
                <h4 className="mb-2 font-medium text-white">Detected Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((keyword: string, index: number) => (
                    <span
                      key={index}
                      className={`rounded-full ${
                        result.threatLevel === "high" || result.threatLevel === "critical"
                          ? "bg-red-500/20 text-red-400"
                          : result.threatLevel === "medium"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-slate-500/20 text-slate-400"
                      } px-3 py-1 text-xs`}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.summary && (
              <div className="rounded-lg bg-white/5 p-4">
                <h4 className="mb-2 font-medium text-white">Summary</h4>
                <p className="text-sm text-slate-300">{result.summary}</p>
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
                    <Legend wrapperStyle={{ color: 'white' }}/>
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
