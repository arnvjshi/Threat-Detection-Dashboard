"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Camera, Square, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { analyzeVideoFrame } from "@/lib/threat-analysis"

interface VideoStreamProps {
  onAnalysis: (detected: boolean, level: number) => void
}

export function VideoStream({ onAnalysis }: VideoStreamProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)

  // Handle starting the webcam
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsStreaming(true)
      }
    } catch (err) {
      console.error("Error accessing webcam:", err)
    }
  }

  // Handle stopping the webcam
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsStreaming(false)
    }
  }

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0])

      if (videoRef.current) {
        videoRef.current.src = URL.createObjectURL(e.target.files[0])
        videoRef.current.play()
        setIsStreaming(true)
      }
    }
  }

  // Analyze video frames
  useEffect(() => {
    if (!isStreaming) return

    const interval = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const context = canvasRef.current.getContext("2d")
        if (context) {
          // Draw the current video frame to the canvas
          context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)

          // Get the image data from the canvas
          const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)

          // Analyze the frame (this would call your Groq API)
          analyzeVideoFrame(imageData)
            .then((result) => {
              onAnalysis(result.threatDetected, result.threatLevel)
            })
            .catch((err) => {
              console.error("Error analyzing video frame:", err)
            })
        }
      }
    }, 1000) // Analyze once per second

    return () => clearInterval(interval)
  }, [isStreaming, onAnalysis])

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
        <canvas ref={canvasRef} className="hidden" width="640" height="480" />

        {!isStreaming && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <Camera className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <p className="text-muted-foreground">No video stream active</p>
              <p className="text-sm text-muted-foreground">Start webcam or upload a video file</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {!isStreaming ? (
          <>
            <Button onClick={startWebcam} className="gap-2">
              <Camera className="h-4 w-4" />
              Start Webcam
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <label>
                <Upload className="h-4 w-4" />
                Upload Video
                <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
              </label>
            </Button>
          </>
        ) : (
          <>
            <Button onClick={stopWebcam} variant="destructive" className="gap-2">
              <Square className="h-4 w-4" />
              Stop Stream
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
