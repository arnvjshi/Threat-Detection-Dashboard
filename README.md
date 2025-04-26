# ThreatShield 

**Live Demo**: [https://threat-detection-dashboard.vercel.app](https://threat-detection-dashboard.vercel.app)

**ThreatShield** is not just another threat detection tool. It's an AI-powered security assistant that analyzes **text**, **audio**, and (soon) **images** to detect potential risks — faster than you can say "data breach."

Powered by models from **Groq** and **Google's Gemini**, ThreatShield helps organizations spot threats before they turn into headlines, combining cutting-edge technology with a focus on speed, accuracy, and a user experience that doesn’t require a PhD to understand.

## About the Project

ThreatShield was built with a simple goal:  
**Make threat detection smarter, faster, and less of a nightmare.**

The platform leverages real-time AI analysis across multiple input types, providing instant feedback without sending your data across the internet. Your secrets stay secret. Your threats don't.

All analysis happens directly in the browser. No external databases. No shady "we care about your privacy" statements. Just actual privacy.

## Features

- Text analysis for toxicity, threats, hate speech, and more.
- Audio support: Upload your voice, and let the AI do the eavesdropping you authorized.
- Image analysis (coming soon, because training an AI to recognize danger in memes takes time).
- Real-time threat scoring with recommendations.
- Sleek, minimal, and actually-usable UI.
- Built with client-side privacy in mind: Your data never leaves your machine.

## Technology Stack

| Area          | Tech Used                            |
|---------------|---------------------------------------|
| Frontend      | Next.js, React, Tailwind CSS           |
| Backend       | Serverless Functions (Next.js API routes) |
| AI/ML Models  | Groq, Google's Gemini                 |
| Deployment    | Vercel                                |
| Data Storage  | Client-side only (browser-local)       |

## Getting Started

Want to run ThreatShield locally and pretend you're part of a secret government agency? Here's how:

### Prerequisites
- Node.js (v18+)
- Yarn or npm

### Installation
```bash
git clone https://github.com/arnvjshi/Threat-Detection-Dashboard.git
cd Threat-Detection-Dashboard
npm install
# or
yarn install
```

### Development
```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) and you’re good to go.

## Roadmap

- Text threat analysis
- Audio-to-text and threat detection
- Image threat analysis
- Admin analytics dashboard
- Support for multiple languages

## Contributing

Pull requests are welcome.  
Bug reports are encouraged.  
Compliments are mandatory.

If you have ideas, issues, or just strong opinions, feel free to open a discussion or submit a PR. Bonus points if you make us laugh.

## License

This project is licensed under the MIT License.  
Yes, that means you can use it. Just don’t sell it back to us.

## Contact

Built with an unhealthy amount of caffeine and ambition by the ThreatShield Team.  
Developers: [Arnav Joshi](https://github.com/arnvjshi) , [Nehanshu Gaidhani](https://github.com/arnvjshi), [Paras Baidwaik](https://github.com/arnvjshi), [Ayush Dhamecha](https://github.com/arnvjshi)

Website: [ThreatShield Dashboard](https://threat-detection-dashboard.vercel.app)
