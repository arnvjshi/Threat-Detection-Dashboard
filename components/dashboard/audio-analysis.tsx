"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Mic, Upload, Play, Pause, Loader2, StopCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface AudioAnalysisResult {
  threatProbability: number
  threatLevel: string
  detectedKeywords?: string[]
  analysis?: string
  recommendation?: string
  timestamp: string
}

export function AudioAnalysis() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AudioAnalysisResult | null>(null)
  const [transcription, setTranscription] = useState<string>("")
  const [historicalData, setHistoricalData] = useState<AudioAnalysisResult[]>([])
  const [isClient, setIsClient] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const recognitionRef = useRef<any>(null)
  const { toast } = useToast()

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load historical data from localStorage on component mount (client-side only)
  useEffect(() => {
    if (!isClient) return

    const storedData = localStorage.getItem("audioAnalysisHistory")
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setHistoricalData(parsedData)
      } catch (error) {
        console.error("Error parsing stored data:", error)
      }
    }
  }, [isClient])

  // Speech recognition setup
  const startSpeechRecognition = () => {
    if (typeof window === "undefined") return false

    // Check if the browser supports the Web Speech API
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition. Try using Chrome.",
        variant: "destructive",
      })
      return false
    }

    // @ts-ignore - SpeechRecognition is not in the TypeScript types
   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

let finalTranscript = ""; 

recognition.onresult = (event: any) => {
  let interimTranscript = "";

  for (let i = event.resultIndex; i < event.results.length; ++i) {
    const transcript = event.results[i][0].transcript;

    if (event.results[i].isFinal) {
      finalTranscript += transcript + " ";
    } else {
      interimTranscript += transcript;
    }
  }

 
  setTranscription(finalTranscript + interimTranscript);
};


    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error)
      toast({
        title: "Recognition Error",
        description: `Error: ${event.error}`,
        variant: "destructive",
      })
      setIsRecording(false)
    }

    recognition.onend = () => {
      // Only restart if still recording
      if (isRecording) {
        recognition.start()
      }
    }

    recognitionRef.current = recognition
    recognition.start()
    return true
  }

  const startRecording = async () => {
    if (typeof window === "undefined") return

    try {
      // Start audio recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        setAudioBlob(audioBlob)
        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioUrl(audioUrl)
      }

      mediaRecorderRef.current.start()

      // Clear previous transcription when starting a new recording
      setTranscription("")

      // Start speech recognition
      const recognitionStarted = startSpeechRecognition()
      if (!recognitionStarted) {
        // If speech recognition fails, stop recording
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop()
          mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
        }
        return
      }

      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
      toast({
        title: "Recording failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()

      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())

      // Stop speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }

      setIsRecording(false)
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const analyzeAudio = async () => {
    if (!transcription.trim()) {
      toast({
        title: "No audio transcription",
        description: "Please record audio first or upload an audio file.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcription }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze audio")
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
        localStorage.setItem("audioAnalysisHistory", JSON.stringify(newHistoricalData))

        // Dispatch event for the overview component
        if (data.threatLevel !== "none" && data.threatLevel !== "low") {
          const event = new CustomEvent("threatDetected", {
            detail: {
              type: "audio",
              message: `Suspicious audio detected: ${data.detectedKeywords?.join(", ")}`,
            },
          })
          window.dispatchEvent(event)
        }
      }
    } catch (error) {
      console.error("Error analyzing audio:", error)
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing the audio. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Create audio URL for playback
      const url = URL.createObjectURL(file)
      setAudioUrl(url)
      setAudioBlob(file)

      // Show toast to inform user they need to manually transcribe
      toast({
        title: "Audio file uploaded",
        description: "Please manually transcribe the audio content in the text area below for analysis.",
      })
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

  useEffect(() => {
    if (!isClient) return

    // Create audio element for playback
    audioRef.current = new Audio()

    // Handle audio playback events
    if (audioRef.current) {
      audioRef.current.onended = () => setIsPlaying(false)
    }

    return () => {
      // Clean up on component unmount
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop()
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isClient])

  useEffect(() => {
    // Update audio source when audioUrl changes
    if (audioRef.current && audioUrl) {
      audioRef.current.src = audioUrl
    }
  }, [audioUrl])

  return (
    <Card className="overflow-hidden border-0 bg-white/5 backdrop-blur-lg">
      <CardHeader className="bg-white/5 pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          <Mic className="h-5 w-5 text-purple-500" />
          Audio Analysis
        </CardTitle>
        <CardDescription className="text-slate-300">Detect threats in audio content</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <Button
            className={`flex-1 ${isRecording ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"}`}
            onClick={toggleRecording}
          >
            {isRecording ? (
              <>
                <StopCircle className="mr-2 h-4 w-4" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Start Recording
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-purple-500 text-purple-500 hover:bg-purple-950/20"
            onClick={() => document.getElementById("audio-upload")?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Audio
          </Button>
          <input id="audio-upload" type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
        </div>

        {audioUrl && (
          <div className="mb-4 rounded-lg bg-white/5 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-medium text-white">Recorded Audio</h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/10"
                onClick={togglePlayback}
                disabled={isAnalyzing}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
            <div className="h-16 w-full">
              <div className="flex h-full w-full items-center justify-between">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1/3 w-1 bg-purple-500"
                    style={{
                      height: `${Math.sin(i * 0.5) * 50 + 50}%`,
                      opacity: i % 3 === 0 ? 1 : 0.7,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="transcription" className="mb-2 block text-sm font-medium text-white">
            Transcription
          </label>
          <textarea
            id="transcription"
            className="min-h-24 w-full rounded-md bg-white/5 p-2 text-white placeholder:text-slate-400"
            placeholder={
              isRecording ? "Speak now... transcription will appear here" : "Enter or edit transcription here..."
            }
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={analyzeAudio}
            disabled={isAnalyzing || !transcription.trim()}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Transcription"
            )}
          </Button>
        </div>

        {isAnalyzing && (
          <div className="mb-4 flex items-center justify-center rounded-lg bg-white/5 p-8">
            <div className="flex flex-col items-center">
              <Loader2 className="mb-2 h-8 w-8 animate-spin text-purple-500" />
              <p className="text-slate-300">Analyzing audio content...</p>
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

            {result.detectedKeywords && result.detectedKeywords.length > 0 && (
              <div className="rounded-lg bg-white/5 p-4">
                <h4 className="mb-2 font-medium text-white">Detected Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {result.detectedKeywords.map((keyword: string, index: number) => (
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
