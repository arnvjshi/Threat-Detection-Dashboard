"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Video, Upload, Camera, Play, Pause, AlertTriangle } from "lucide-react"

export function VideoAnalysis() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLiveStream, setIsLiveStream] = useState(false)

  return (
    <Card className="overflow-hidden border-0 bg-white/5 backdrop-blur-lg">
      <CardHeader className="bg-white/5 pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          <Video className="h-5 w-5 text-purple-500" />
          Video Analysis
        </CardTitle>
        <CardDescription className="text-slate-300">Detect objects and threats in video content</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5">
            <TabsTrigger value="upload">Upload Video</TabsTrigger>
            <TabsTrigger value="stream">Live Stream</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="mt-4">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row">
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                <Upload className="mr-2 h-4 w-4" />
                Upload Video
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-purple-500 text-purple-500 hover:bg-purple-950/20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="stream" className="mt-4">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row">
              <Button
                className={`flex-1 ${isLiveStream ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"}`}
                onClick={() => setIsLiveStream(!isLiveStream)}
              >
                <Camera className="mr-2 h-4 w-4" />
                {isLiveStream ? "Stop Stream" : "Start Stream"}
              </Button>
              <Button variant="outline" className="flex-1 border-purple-500 text-purple-500 hover:bg-purple-950/20">
                <Upload className="mr-2 h-4 w-4" />
                Connect RTSP
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg bg-black/50 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Video className="h-12 w-12 text-white/20" />
          </div>

          {/* Object detection boxes */}
          <div className="absolute left-[10%] top-[20%] h-[30%] w-[25%] rounded-md border-2 border-red-500 bg-red-500/20">
            <div className="absolute -top-6 left-0 rounded-t-md bg-red-500 px-2 py-1 text-xs text-white">
              Weapon (98%)
            </div>
          </div>

          <div className="absolute left-[50%] top-[30%] h-[40%] w-[30%] rounded-md border-2 border-amber-500 bg-amber-500/20">
            <div className="absolute -top-6 left-0 rounded-t-md bg-amber-500 px-2 py-1 text-xs text-white">
              Person (95%)
            </div>
          </div>

          {/* Alert overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-red-500/10">
            <div className="rounded-lg bg-black/60 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-6 w-6" />
                <span className="text-lg font-bold">Threat Detected</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-white/5 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-medium text-white">Threat Probability</h4>
              <span className="text-sm text-red-400">Critical (92%)</span>
            </div>
            <Progress value={92} className="h-2 bg-white/10" indicatorClassName="bg-red-500" />
          </div>

          <div className="rounded-lg bg-white/5 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-medium text-white">Processing Status</h4>
              <span className="text-sm text-green-400">Real-time</span>
            </div>
            <Progress value={100} className="h-2 bg-white/10" indicatorClassName="bg-green-500" />
          </div>

          <div className="rounded-lg bg-white/5 p-4 md:col-span-2">
            <h4 className="mb-3 font-medium text-white">Detected Objects</h4>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="rounded-md bg-white/5 p-3 text-center">
                <div className="text-xs text-slate-300">Person</div>
                <div className="text-lg font-bold text-white">95%</div>
              </div>
              <div className="rounded-md bg-red-500/10 p-3 text-center">
                <div className="text-xs text-red-300">Weapon</div>
                <div className="text-lg font-bold text-red-400">98%</div>
              </div>
              <div className="rounded-md bg-white/5 p-3 text-center">
                <div className="text-xs text-slate-300">Vehicle</div>
                <div className="text-lg font-bold text-white">45%</div>
              </div>
              <div className="rounded-md bg-white/5 p-3 text-center">
                <div className="text-xs text-slate-300">Bag</div>
                <div className="text-lg font-bold text-white">72%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-red-500/10 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h4 className="font-medium text-red-400">Critical Alert</h4>
          </div>
          <p className="mt-2 text-sm text-slate-300">
            Dangerous object detected in video frame. Security personnel have been notified. Timestamp:{" "}
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
