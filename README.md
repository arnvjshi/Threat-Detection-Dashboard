# 🔍 ThreatDetect

**ThreatDetect** is a lightweight threat detection system that uses **GROQ** to analyze **text and audio** data. Audio is transcribed to text and processed using GROQ’s high-speed language models to flag potential threats in real time.

> 📍 Repo: [Threat-Detection-Dashboard](https://github.com/arnvjshi/Threat-Detection-Dashboard)

---

## 🚀 Features

- 🔊 **Audio-to-Text Threat Analysis** – Upload audio, convert to text, and detect threats using GROQ.
- 📝 **Text Input Support** – Paste or upload text for instant threat insights.
- ⚡ Powered by **GROQ** – Fast and efficient large language model processing.

---

## 🧠 Tech Stack

- **Next.js + TypeScript** – Frontend & interface.
- **GROQ SDK** – Backend processing for threat detection.
- **Whisper (planned)** – For local audio transcription.
- **Tailwind CSS** – For clean, responsive UI.

---

## 📦 Getting Started

```bash
git clone https://github.com/arnvjshi/Threat-Detection-Dashboard.git
cd Threat-Detection-Dashboard
npm install
npm run dev
```

Create a `.env.local` file with your GROQ API key:

```env
GROQ_API_KEY=your_key_here
```

---

## 🧪 How It Works

1. Upload a `.txt` file or audio file (`.mp3`, `.wav`).
2. Audio is transcribed into text.
3. GROQ analyzes the text and returns threat-related summaries or alerts.
4. Results are shown in a user-friendly dashboard.

---

## ✅ Roadmap

- [x] Text-based threat detection  
- [x] Audio-to-text support  
- [ ] Video analysis (coming soon)  
- [ ] Python backend for advanced processing  

---

## 🤝 Contributing

Feel free to open issues or submit PRs. This is a growing project, and all help is welcome!

---

## 📄 License

MIT License

---
