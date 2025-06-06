"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, RefreshCw } from "lucide-react"

interface DashboardHeaderProps {
  selectedTab: string
  setSelectedTab: (tab: string) => void
}

export function DashboardHeader({ selectedTab, setSelectedTab }: DashboardHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Threat Detection Dashboard</h1>
          <div className="mt-2 flex items-center gap-2 text-slate-300">
            <Clock className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        <Button
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white/5 backdrop-blur-md">
          <TabsTrigger value="all">All Threats</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
