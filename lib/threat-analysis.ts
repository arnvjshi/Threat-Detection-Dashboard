import { createGroq } from "@ai-sdk/groq"
import { generateText } from "ai"

// Create Groq instance with API key directly (not recommended for production)
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || "your-groq-api-key",
})

// Function to analyze text using Groq API
export async function analyzeText(text: string): Promise<{ threatDetected: boolean; threatLevel: number }> {
  try {
    const { text: responseText } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `You are a threat detection system. Analyze the following text for potential threats.
               Rate the threat level from 0-100 and determine if it contains threats.
               
               Text: "${text}"
               
               Important: If the text contains words like "kill", "die", "threat", "bomb", "attack", "weapon", 
               automatically mark it as a threat with a level of at least 75.
               
               Respond in JSON format:
               {
                 "threatDetected": true/false,
                 "threatLevel": number
               }`,
    })

    try {
      // Parse the response
      const result = JSON.parse(responseText)
      return {
        threatDetected: result.threatDetected,
        threatLevel: result.threatLevel,
      }
    } catch (parseError) {
      console.error("Error parsing Groq response:", parseError)

      // Fallback to keyword analysis if parsing fails
      return performKeywordAnalysis(text)
    }
  } catch (error) {
    console.error("Error analyzing text with Groq:", error)

    // Fallback to keyword analysis if API fails
    return performKeywordAnalysis(text)
  }
}

// Keyword analysis as a fallback
function performKeywordAnalysis(text: string): { threatDetected: boolean; threatLevel: number } {
  const threatKeywords = ["threat", "attack", "bomb", "kill", "weapon", "dangerous", "die", "murder"]
  const lowercaseText = text.toLowerCase()

  let threatLevel = 0
  let containsHighThreatWord = false

  // Check for threat keywords
  threatKeywords.forEach((keyword) => {
    if (lowercaseText.includes(keyword)) {
      if (keyword === "kill" || keyword === "die" || keyword === "bomb" || keyword === "murder") {
        threatLevel += 50
        containsHighThreatWord = true
      } else {
        threatLevel += 25
      }
    }
  })

  // Cap at 100
  threatLevel = Math.min(threatLevel, 100)

  // Ensure high threat words always trigger detection
  const threatDetected = containsHighThreatWord || threatLevel > 50

  return {
    threatDetected,
    threatLevel,
  }
}

// Function to analyze video frames
export async function analyzeVideoFrame(
  imageData: ImageData,
): Promise<{ threatDetected: boolean; threatLevel: number }> {
  // In a real implementation, you would:
  // 1. Convert the imageData to a base64 string
  // 2. Send the image to a vision model via Groq or another API

  // For demo purposes, we'll return random results
  await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate API delay

  const randomLevel = Math.floor(Math.random() * 100)
  const threatDetected = randomLevel > 70

  return {
    threatDetected,
    threatLevel: randomLevel,
  }
}

// Function to convert audio to text and then analyze
export async function analyzeAudio(audioBlob: Blob): Promise<{ threatDetected: boolean; threatLevel: number }> {
  try {
    // In a real implementation, you would:
    // 1. Convert the audio to text using a speech-to-text service
    // 2. Then analyze the resulting text with Groq

    // For demo purposes, we'll simulate audio-to-text conversion
    // and then analyze a placeholder text

    // Simulate audio-to-text conversion delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Placeholder text that would come from audio transcription
    // In a real app, this would be the result of speech-to-text conversion
    const transcribedText = "This is simulated text from audio transcription"

    // Now analyze the transcribed text using our text analysis function
    return await analyzeText(transcribedText)
  } catch (error) {
    console.error("Error analyzing audio:", error)

    // Fallback to random results if the process fails
    const randomLevel = Math.floor(Math.random() * 100)
    const threatDetected = randomLevel > 70

    return {
      threatDetected,
      threatLevel: randomLevel,
    }
  }
}
