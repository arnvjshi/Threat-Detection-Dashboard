import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { NextResponse } from "next/server"

export const runtime = "nodejs" // Specify Node.js runtime for Vercel

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const prompt = `
      You are a threat detection AI. Analyze the following text for potential threats, harmful content, or concerning language.
      
      Provide your analysis in the following JSON format:
      {
        "threatProbability": <number between 0 and 100>,
        "threatLevel": <"none", "low", "medium", "high", "critical">,
        "sentiment": {
          "negative": <percentage as number>,
          "neutral": <percentage as number>,
          "positive": <percentage as number>
        },
        "flaggedContent": <description of concerning content if any>,
        "keywords": <array of concerning keywords found>,
        "summary": <brief summary of the analysis>
      }
      
      Text to analyze: "${text}"
      
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
    console.error("Error analyzing text:", error)
    return NextResponse.json({ error: "Failed to analyze text" }, { status: 500 })
  }
}
