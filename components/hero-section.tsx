import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, FileText, ImageIcon } from "lucide-react"

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-20 text-center md:py-32">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
          Advanced Threat Detection Powered by AI
        </h1>
        <p className="mb-10 text-xl text-slate-300 md:text-2xl">
          Detect threats in real-time across audio, text, and images with our state-of-the-art AI platform.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/dashboard">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Get Started
            </Button>
          </Link>
          <Link href="/developers">
            <Button size="lg" variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-950/20">
              Meet Our Team
            </Button>
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex flex-col items-center rounded-xl bg-white/5 p-6 backdrop-blur-lg">
            <div className="mb-4 rounded-full bg-purple-500/20 p-3">
              <FileText className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">Text Analysis</h3>
            <p className="text-slate-300">Detect threats in written content using advanced NLP.</p>
          </div>

          <div className="flex flex-col items-center rounded-xl bg-white/5 p-6 backdrop-blur-lg">
            <div className="mb-4 rounded-full bg-purple-500/20 p-3">
              <AlertTriangle className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">Audio Detection</h3>
            <p className="text-slate-300">Identify threatening speech and sounds in real-time.</p>
          </div>

          <div className="flex flex-col items-center rounded-xl bg-white/5 p-6 backdrop-blur-lg sm:col-span-2 md:col-span-1">
            <div className="mb-4 rounded-full bg-purple-500/20 p-3">
              <ImageIcon className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">Image Recognition</h3>
            <p className="text-slate-300">Detect objects and threatening items in images using Gemini 2.0 Flash.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
