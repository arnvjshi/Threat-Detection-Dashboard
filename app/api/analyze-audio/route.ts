import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { NextResponse } from "next/server"

export const runtime = "nodejs" // Specify Node.js runtime for Vercel

export async function POST(req: Request) {
  try {
    const { transcription } = await req.json()

    if (!transcription || transcription.trim() === "") {
      return NextResponse.json({ error: "Audio transcription is required" }, { status: 400 })
    }

    const prompt = `
      You are a threat detection AI. Analyze the following audio transcription for potential threats, harmful content, or concerning language.
      
      Provide your analysis in the following JSON format:
      {
        "threatProbability": <number between 0 and 100>,
        "threatLevel": <"none", "low", "medium", "high", "critical">,
        "detectedKeywords": <array of concerning keywords found>,
        "analysis": <brief description of the analysis>,
        "recommendation": <recommendation based on the threat level>
      }
      
      Audio transcription: "${transcription}"
      
      JSON response:
    `

    // Use generateText instead of streamText for more reliable JSON parsing
    const { text: responseText } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: prompt,
    })

    let jsonResponse

    try {
      jsonResponse = JSON.parse(responseText)
    } catch (error) {
      // If the response is not valid JSON, try to extract JSON from the text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonResponse = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("Failed to parse JSON response")
      }
    }

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("Error analyzing audio:", error)
    return NextResponse.json({ error: "Failed to analyze audio" }, { status: 500 })
  }
}
