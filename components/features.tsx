import { Shield, Lock, Zap, BarChart, Clock, Cpu } from "lucide-react"

export function Features() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Comprehensive Threat Detection
        </h2>
        <p className="mb-16 text-xl text-slate-300">
          Our platform uses cutting-edge AI to detect and analyze threats across multiple channels.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-white/5 p-6 backdrop-blur-lg">
          <div className="mb-4 rounded-full bg-purple-500/20 p-3 w-fit">
            <Shield className="h-6 w-6 text-purple-500" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">Multi-Channel Detection</h3>
          <p className="text-slate-300">
            Analyze audio, text, and images simultaneously for comprehensive threat detection.
          </p>
        </div>

        <div className="rounded-xl bg-white/5 p-6 backdrop-blur-lg">
          <div className="mb-4 rounded-full bg-purple-500/20 p-3 w-fit">
            <Lock className="h-6 w-6 text-purple-500" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">Privacy-Focused</h3>
          <p className="text-slate-300">All data is processed locally in your browser for maximum privacy.</p>
        </div>

        <div className="rounded-xl bg-white/5 p-6 backdrop-blur-lg">
          <div className="mb-4 rounded-full bg-purple-500/20 p-3 w-fit">
            <Zap className="h-6 w-6 text-purple-500" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">Real-Time Alerts</h3>
          <p className="text-slate-300">Receive instant notifications when potential threats are detected.</p>
        </div>

        <div className="rounded-xl bg-white/5 p-6 backdrop-blur-lg">
          <div className="mb-4 rounded-full bg-purple-500/20 p-3 w-fit">
            <BarChart className="h-6 w-6 text-purple-500" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">Advanced Analytics</h3>
          <p className="text-slate-300">Gain insights with detailed threat analysis and reporting.</p>
        </div>

        <div className="rounded-xl bg-white/5 p-6 backdrop-blur-lg">
          <div className="mb-4 rounded-full bg-purple-500/20 p-3 w-fit">
            <Clock className="h-6 w-6 text-purple-500" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">Historical Tracking</h3>
          <p className="text-slate-300">Track threat patterns over time with historical data visualization.</p>
        </div>

        <div className="rounded-xl bg-white/5 p-6 backdrop-blur-lg">
          <div className="mb-4 rounded-full bg-purple-500/20 p-3 w-fit">
            <Cpu className="h-6 w-6 text-purple-500" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">Powered by Gemini 2.0 Flash</h3>
          <p className="text-slate-300">
            Leveraging Google's Gemini 2.0 Flash for fast, accurate image threat detection and analysis.
          </p>
        </div>
      </div>
    </section>
  )
}
