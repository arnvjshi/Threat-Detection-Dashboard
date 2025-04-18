"use client"

import React, { useRef, useState } from "react"
import { Mic, Square, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { analyzeText } from "@/lib/threat-analysis" 
import SpeechToText from "speech-to-text";



interface AudioStreamProps {
  onAnalysis: (detected: boolean, level: number) => void
}

export function AudioStream({ onAnalysis }: AudioStreamProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioLevel, setAudioLevel] = useState(0)
  const [transcript, setTranscript] = useState("")
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const speechListenerRef = useRef<any>(null)
  const transcriptRef = useRef("") // ✅ Store live transcript

  // Start recording audio
  const startRecording = async () => {
    // ✅ Clear transcript
    setTranscript("")
    transcriptRef.current = ""

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const microphone = audioContext.createMediaStreamSource(stream)
      microphone.connect(analyser)
      analyser.fftSize = 256

      audioContextRef.current = audioContext
      analyserRef.current = analyser

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        const audioUrl = URL.createObjectURL(audioBlob)

        if (audioRef.current) {
          audioRef.current.src = audioUrl
        }

        if (speechListenerRef.current) {
          speechListenerRef.current.stopListening()
        }

        console.log("Final Transcript:", transcriptRef.current)

        analyzeText(transcriptRef.current.trim())
          .then((result) => {
            onAnalysis(result.threatDetected, result.threatLevel)
          })
          .catch((err) => {
            console.error("Error analyzing audio:", err)
          })
      }

      const onAnythingSaid = (text: string) => {
        console.log("Interim:", text)
      }

      const onFinalised = (text: string) => {
        console.log("Finalised:", text)
        transcriptRef.current += " " + text
        setTranscript(transcriptRef.current)
      }

      const onEndEvent = () => {
        console.log("Speech recognition ended")
      }

      try {
        const listener = new SpeechToText(onFinalised, onEndEvent, onAnythingSaid)
        speechListenerRef.current = listener
        listener.startListening()
      } catch (err: any) {
        console.error("Error initializing speech recognition:", err.message)
      }

      mediaRecorder.start()
      setIsRecording(true)
      visualizeAudio()
    } catch (err) {
      console.error("Error starting audio recording:", err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()

      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      }

      setIsRecording(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAudioFile(file)

      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(file)
      }

      analyzeText("I'm going to kill you tonight")
        .then((result) => {
          onAnalysis(result.threatDetected, result.threatLevel)
        })
        .catch((err) => {
          console.error("Error analyzing audio file:", err)
        })
    }
  }

  const visualizeAudio = () => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)

    const updateAudioLevel = () => {
      if (!analyserRef.current || !isRecording) return

      analyserRef.current.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length
      setAudioLevel(average)

      requestAnimationFrame(updateAudioLevel)
    }

    updateAudioLevel()
  }

  return (
    <div className="space-y-4">
      <div className="bg-muted p-6 rounded-lg flex flex-col items-center justify-center gap-4">
        {isRecording ? (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
              <Mic className="h-8 w-8 text-white" />
            </div>
            <div className="text-center">
              <p>Recording in progress</p>
              <p className="text-sm text-muted-foreground">Analyzing audio for threats</p>
            </div>
            <Progress value={audioLevel} className="w-full max-w-xs" />
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-muted-foreground/20 flex items-center justify-center">
              <Mic className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p>No audio stream active</p>
              <p className="text-sm text-muted-foreground">Start recording or upload an audio file</p>
            </div>
          </>
        )}
      </div>

      <audio ref={audioRef} className="w-full" controls />

      <div className="flex flex-wrap gap-2">
        {!isRecording ? (
          <>
            <Button onClick={startRecording} className="gap-2">
              <Mic className="h-4 w-4" />
              Start Recording
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <label>
                <Upload className="h-4 w-4" />
                Upload Audio
                <input type="file" accept="audio/*" className="hidden" onChange={handleFileChange} />
              </label>
            </Button>
          </>
        ) : (
          <Button onClick={stopRecording} variant="destructive" className="gap-2">
            <Square className="h-4 w-4" />
            Stop Recording
          </Button>
        )}
      </div>
    </div>
  )
}
