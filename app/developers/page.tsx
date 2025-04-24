"use client"

import { Navbar } from "@/components/navbar"
import { ThreeBackground } from "@/components/three-background"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Mail, Globe } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"

interface DeveloperProps {
  name: string
  role: string
  github?: string
  email?: string
  website?: string
  description: string
}

function DeveloperCard({ name, role, github, email, website, description }: DeveloperProps) {
  return (
    <Card className="overflow-hidden border-0 bg-white/5 backdrop-blur-lg">
      <CardHeader className="bg-white/5 pb-2">
        <CardTitle className="text-white">{name}</CardTitle>
        <CardDescription className="text-slate-300">{role}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="mb-4 text-slate-300">{description}</p>
        <div className="flex flex-wrap gap-3">
          {github && (
            <Link
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Link>
          )}
          {email && (
            <Link
              href={`mailto:${email}`}
              className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
            >
              <Mail className="h-4 w-4" />
              Email
            </Link>
          )}
          {website && (
            <Link
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
            >
              <Globe className="h-4 w-4" />
              Website
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Developers() {
  const developers = [
    {
      name: "Arnav Joshi",
      role: "Lead Developer",
      github: "https://github.com/arnvjshi",
      email: "arnavjoshi0512@gmail.com",
      website: "https://arnavjoshi.vercel.app",
      description: "Lead developer responsible for the architecture and implementation of the threat detection system with APIs and Structure.",
    },
    {
      name: "Nehanshu Gaidhani",
      role: "Lead Developer",
      github: "https://github.com/nehanshugaidhani",
      email: "nehanshugaidhani@example.com",
      description: "Specialized in in UI and UX design, ensuring a seamless user experience throughout the application.",
    },
    {
      name: "Paras Badwaik",
      role: "Lead Developer",
      github: "https://github.com/parasbadwaik",
      email: "parasbadwaik@example.com",
      description: "Responsible for streaming models for text, audio, and image analysis.",
    },
    {
      name: "Ayush Dhamecha",
      role: "Lead Developer",
      github: "https://github.com/ayushdhamecha",
      email: "ayushdhamecha@example.com",
      description: "Developed the frontend architecture and integrated the backend APIs with the UI.",
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
      <ThreeBackground intensity={0.3} />
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Meet Our Team</h1>
            <p className="mx-auto max-w-2xl text-xl text-slate-300">
              The talented developers behind the ThreatShield AI-powered threat detection platform.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {developers.map((dev) => (
              <DeveloperCard key={dev.name} {...dev} />
            ))}
          </div>

          <div className="mt-16 rounded-xl bg-white/5 p-8 backdrop-blur-lg">
            <h2 className="mb-6 text-2xl font-bold text-white">About the Project</h2>
            <p className="mb-4 text-slate-300">
              ThreatShield is an advanced threat detection platform that leverages AI to analyze text, audio, and images
              for potential security threats. The platform uses state-of-the-art models from Groq and Google's Gemini to
              provide real-time threat analysis and recommendations.
            </p>
            <p className="mb-4 text-slate-300">
              Our team developed this platform to help organizations identify and respond to security threats more
              efficiently, with a focus on accuracy, speed, and user experience.
            </p>
            <p className="text-slate-300">
              The application is built using Next.js, React, and Tailwind CSS for the frontend, with serverless API
              routes for backend functionality. All data is stored locally in the browser for privacy and security.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
