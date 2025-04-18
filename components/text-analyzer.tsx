"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { analyzeText } from "@/lib/threat-analysis"

interface TextAnalyzerProps {
  onAnalysis: (detected: boolean, level: number) => void
}

export function TextAnalyzer({ onAnalysis }: TextAnalyzerProps) {
  const [text, setText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [history, setHistory] = useState<{ text: string; result: { threatDetected: boolean; threatLevel: number } }[]>(
    [],
  )

  const handleAnalyze = async () => {
    if (!text.trim()) return

    setIsAnalyzing(true)

    try {
      const result = await analyzeText(text)
      onAnalysis(result.threatDetected, result.threatLevel)

      // Add to history with more detailed information
      setHistory((prev) => [
        {
          text,
          result: {
            threatDetected: result.threatDetected,
            threatLevel: result.threatLevel,
          },
        },
        ...prev,
      ])
      setText("")
    } catch (err) {
      console.error("Error analyzing text:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Textarea
          placeholder="Enter text to analyze for threats..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
        />
        <Button onClick={handleAnalyze} disabled={!text.trim() || isAnalyzing} className="self-end gap-2">
          {isAnalyzing ? "Analyzing..." : "Analyze"}
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {history.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 font-medium">Analysis History</div>
          <div className="divide-y max-h-[300px] overflow-y-auto">
            {history.map((item, index) => (
              <div key={index} className="p-4">
                <div className="text-sm mb-1">{item.text}</div>
                <div className="flex flex-col gap-1">
                  <span
                    className={`font-bold text-base ${item.result.threatDetected ? "text-red-500" : "text-green-500"}`}
                  >
                    {item.result.threatDetected ? "THREAT DETECTED" : "SAFE"}
                  </span>
                  <span className={`text-sm ${item.result.threatDetected ? "text-red-500" : "text-muted-foreground"}`}>
                    Threat Level: {item.result.threatLevel}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
