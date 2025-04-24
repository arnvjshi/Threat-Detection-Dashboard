import Link from "next/link"
import { Shield, Github, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-purple-500" />
              <span className="text-xl font-bold text-white">ThreatShield</span>
            </Link>
            <p className="mt-4 text-slate-300">
              Advanced threat detection powered by AI for audio, text, and image analysis.
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="https://github.com/arnvjshi/Threat-Detection-Dashboard" target="_blank" className="text-slate-400 hover:text-purple-500">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="https://www.linkedin.com/in/arnav-joshi-aj05/" target="_blank" className="text-slate-400 hover:text-purple-500">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-300 hover:text-purple-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-slate-300 hover:text-purple-300">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/developers" className="text-slate-300 hover:text-purple-300">
                  Developers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Contact</h3>
            <ul className="space-y-2">
              <li className="text-slate-300">Email: arnavjoshi0512@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-slate-400">&copy; {new Date().getFullYear()} ThreatShield. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
