import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThreeBackground } from "@/components/three-background"
import { Navbar } from "@/components/navbar"
import { Features } from "@/components/features"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
      <ThreeBackground />
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <Features />
          <section className="container mx-auto px-4 py-20 text-center">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Ready to enhance your security?
              </h2>
              <p className="mb-10 text-xl text-slate-300">
                Start detecting threats in real-time with our advanced AI-powered platform.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                    Access Dashboard
                  </Button>
                </Link>
                <Link href="/developers">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-purple-500 text-purple-500 hover:bg-purple-950/20"
                  >
                    Meet Our Team
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  )
}
