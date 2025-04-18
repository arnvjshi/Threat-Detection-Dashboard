"use client"

import { useState } from "react"
import Link from "next/link"
import {  ArrowRight, 
  Shield, 
  FileAudio, 
  FileText, 
  Video, 
  Bell, 
  Menu, 
  X, 
  Users, 
  Lock, 
  HelpCircle,
  Search,AlertCircle, CheckCircle, Home } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ThreatChart } from "@/components/threat-chart"
import { VideoStream } from "@/components/video-stream"
import { AudioStream } from "@/components/audio-stream"
import { TextAnalyzer } from "@/components/text-analyzer"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Dashboard() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
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
  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    return (
      <Link 
        href={href} 
        className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-300 hover:underline decoration-primary decoration-2 underline-offset-4"
      >
        {children}
      </Link>
    );
  };

  const resetVals=()=>{
    setThreatDetected(false)
    setThreatLevel(0)
    setThreatData([])
  }

  return (
    <div className="flex min-h-screen flex-col">
    <main className="flex min-h-screen flex-col">
       <header className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-lg shadow-md" 
          : "bg-background/30 backdrop-blur-md"
      }`}>
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 hover:scale-105">
                Threat<span className="font-light">Detect</span>
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex ml-8 space-x-6">
              <NavLink href="#"></NavLink>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search button */}
            <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-primary/10 transition-colors">
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Notifications button */}
            <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-primary/10 transition-colors">
              <Bell className="h-5 w-5" />
            </Button>
            
            <ThemeToggle />
            
            {/* Login button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex border-primary/20 hover:border-primary hover:bg-primary/10 transition-all duration-300"
            >
              Log In
            </Button>
            
            {/* CTA button */}
            <Button 
              asChild 
              size="sm"
              className="hidden sm:flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-primary/20 transition-all duration-300"
            >
              <Link href="/">
                Home
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div 
          className={`md:hidden absolute w-full bg-background/95 backdrop-blur-lg border-b border-primary/10 shadow-lg transition-all duration-300 overflow-hidden ${
            isMenuOpen ? "max-h-screen" : "max-h-0"
          }`}
        >
          <nav className="container py-4 flex flex-col space-y-4">
            <Link 
              href="/products" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Shield className="h-5 w-5 text-primary" />
              <span>Products</span>
            </Link>
            <Link 
              href="/solutions" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Lock className="h-5 w-5 text-primary" />
              <span>Solutions</span>
            </Link>
            <Link 
              href="/pricing" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <FileText className="h-5 w-5 text-primary" />
              <span>Pricing</span>
            </Link>
            <Link 
              href="/resources" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <HelpCircle className="h-5 w-5 text-primary" />
              <span>Resources</span>
            </Link>
            <Link 
              href="/contact" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Users className="h-5 w-5 text-primary" />
              <span>Contact</span>
            </Link>
            <div className="flex space-x-2 mt-2 pt-2 border-t border-primary/10">
              <Button 
                className="flex-1 border-primary/20 hover:border-primary hover:bg-primary/10 transition-all duration-300"
                variant="outline"
                onClick={() => setIsMenuOpen(false)}
              >
                Log In
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
                asChild
              >
                <Link href="/">Home</Link>
              </Button>
            </div>
          </nav>
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
  </div>
  )
}
