import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { NextResponse } from "next/server"
import { sendMail } from "@/utils/sendMail" // Adjust based on your project structure

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { transcription, email } = await req.json()

    if (!transcription || transcription.trim() === "") {
      return NextResponse.json({ error: "Audio transcription is required" }, { status: 400 })
    }

    if (!email || email.trim() === "") {
      return NextResponse.json({ error: "User email is required for notification" }, { status: 400 })
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

    const { text: responseText } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt,
    })

    let jsonResponse

    try {
      jsonResponse = JSON.parse(responseText)
    } catch (error) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonResponse = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("Failed to parse JSON response")
      }
    }

    // Email body
    const html = `
      <h2>Threat Analysis Result</h2>
      <p><strong>Threat Probability:</strong> ${jsonResponse.threatProbability}%</p>
      <p><strong>Threat Level:</strong> ${jsonResponse.threatLevel}</p>
      <p><strong>Detected Keywords:</strong> ${jsonResponse.detectedKeywords.join(", ")}</p>
      <p><strong>Analysis:</strong> ${jsonResponse.analysis}</p>
      <p><strong>Recommendation:</strong> ${jsonResponse.recommendation}</p>
    `

    await sendMail(email, "Threat Analysis Completed", html)

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("Error analyzing audio:", error)
    return NextResponse.json({ error: "Failed to analyze audio" }, { status: 500 })
  }
}
