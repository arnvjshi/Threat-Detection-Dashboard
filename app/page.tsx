// File: pages/index.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import * as THREE from "three"
import { 
  ArrowRight, 
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
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

// ThreeJS Background Component
const ThreeBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!mountRef.current) return
    
    // Setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 1000
    
    const positionArray = new Float32Array(particlesCount * 3)
    const colorArray = new Float32Array(particlesCount * 3)
    
    for (let i = 0; i < particlesCount * 3; i++) {
      // Position
      positionArray[i] = (Math.random() - 0.5) * 10
      
      // Color - shades of blue and purple
      if (i % 3 === 0) {
        colorArray[i] = Math.random() * 0.3 + 0.2 // R (blue-ish)
      } else if (i % 3 === 1) {
        colorArray[i] = Math.random() * 0.2 // G (low)
      } else {
        colorArray[i] = Math.random() * 0.5 + 0.5 // B (high)
      }
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))
    
    const particlesMaterial = new THREE.PointsMaterial({ 
      size: 0.02, 
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    })
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)
    
    camera.position.z = 4
    
    // Mouse movement effect
    let mouseX = 0
    let mouseY = 0
    
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    
    window.addEventListener('resize', handleResize)
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      
      // Rotate particles slowly
      particlesMesh.rotation.x += 0.0003
      particlesMesh.rotation.y += 0.0002
      
      // Move based on mouse position
      particlesMesh.rotation.x += mouseY * 0.0001
      particlesMesh.rotation.y += mouseX * 0.0001
      
      renderer.render(scene, camera)
    }
    
    animate()
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [])
  
  return <div ref={mountRef} className="fixed inset-0 z-0" />
}

// NavLink component with subtle hover effect
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

// Scroll Progress Bar
const ScrollProgress = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      const scrollTop = window.scrollY
      
      const percentage = (scrollTop / documentHeight) * 100
      setScrollPercentage(percentage)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
        style={{ width: `${scrollPercentage}%` }}
      />
    </div>
  )
}

export default function Home(): JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // For reveal animations
      setIsVisible(true);
    };

    window.addEventListener("scroll", handleScroll);
    
    // Initial visibility after a small delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Three.js Background */}
      <ThreeBackground />
      
      {/* Scroll Progress Bar */}
      <ScrollProgress />
      
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
              <NavLink href="/dashboard">Dashboard</NavLink>
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
              <Link href="/dashboard">
                Dashboard
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
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-16"></div>

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-background/80">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className={`flex flex-col justify-center space-y-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
                <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary max-w-max">
                  <span className="animate-pulse">●</span>
                  <span>Active Protection</span>
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    Advanced Threat Detection System
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Real-time analysis of video, audio, and text using advanced AI to identify potential threats and
                    keep you safe.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button 
                    asChild 
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-primary/30 transition-all duration-300"
                  >
                    <Link href="/dashboard">
                      Launch Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    variant="outline" 
                    size="lg"
                    className="border-primary/20 hover:border-primary hover:bg-primary/10 transition-all duration-300"
                  >
                    <Link href="/demo">
                      Watch Demo
                      <Video className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className={`mx-auto lg:mr-0 flex items-center justify-center transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
                <div className="relative w-full max-w-[500px] aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse" />
                  <div className="relative bg-background/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-[10px_10px_20px_rgba(0,0,0,0.1),-10px_-10px_20px_rgba(255,255,255,0.05)] p-6 flex items-center justify-center transition-transform duration-500 hover:rotate-2 hover:scale-102">
                    <Shield className="h-32 w-32 text-primary animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our system uses advanced AI to detect threats across multiple input types
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
              <Card className={`border border-primary/10 shadow-lg hover:shadow-primary/20 transition-all duration-500 flex flex-col items-center text-center ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: "100ms"}}>
                <CardHeader>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <Video className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Video Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Real-time video stream analysis to detect visual threats and suspicious activities
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className={`border border-primary/10 shadow-lg hover:shadow-primary/20 transition-all duration-500 flex flex-col items-center text-center ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: "200ms"}}>
                <CardHeader>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <FileAudio className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Audio Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Advanced audio processing to identify verbal threats and concerning sounds
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className={`border border-primary/10 shadow-lg hover:shadow-primary/20 transition-all duration-500 flex flex-col items-center text-center ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: "300ms"}}>
                <CardHeader>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Text Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Powerful text processing to detect threatening language and harmful content
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Ready to Get Started?</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Launch the dashboard to start monitoring for potential threats
                </p>
              </div>
              <Button 
                asChild 
                size="lg" 
                className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-primary/30 transition-all duration-300"
              >
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0 backdrop-blur-sm bg-background/30">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ThreatDetect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}