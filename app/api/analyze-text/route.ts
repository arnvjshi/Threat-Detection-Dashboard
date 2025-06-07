import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { NextResponse } from "next/server"
import { sendMail } from "@/utils/sendMail"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const prompt = `
        You are an advanced threat detection AI with deep linguistic, contextual, and semantic analysis capabilities.

        Your task is to analyze the following text for **any signs of threat, harmful intent, or concerning behavior**, even if they are **coded, metaphorical, hidden in euphemism**, or intentionally obfuscated. This includes but is not limited to violent plans, self-harm indicators, radical ideologies, cyber threats, terrorism, and psychological manipulation.

        Consider the **tone, intention, encoded language**, and **context clues**. Decipher slang, nicknames, metaphors, acronyms, or coded phrases that may be used to mask malicious intent.

        Return your analysis in the following strict JSON format:

        {
          "threatProbability": <number between 0 and 100>,
          "threatLevel": <"none", "low", "medium", "high", "critical">,
          "sentiment": {
            "negative": <percentage as number>,
            "neutral": <percentage as number>,
            "positive": <percentage as number>
          },
          "flaggedContent": <description of any threatening or harmful content or metaphors detected>,
          "keywords": <array of keywords, slangs, or coded terms that may indicate threat>,
          "summary": <brief contextual summary explaining your findings and reasoning>
        }

        Text to analyze:
        "${text}"

        Respond with only the JSON result:
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


    const html = `
      <h2>Text Threat Analysis Result</h2>
      <p><strong>Threat Probability:</strong> ${jsonResponse.threatProbability}%</p>
      <p><strong>Threat Level:</strong> ${jsonResponse.threatLevel}</p>
      <p><strong>Sentiment:</strong></p>
      <ul>
        <li>Negative: ${jsonResponse.sentiment.negative}%</li>
        <li>Neutral: ${jsonResponse.sentiment.neutral}%</li>
        <li>Positive: ${jsonResponse.sentiment.positive}%</li>
      </ul>
      <p><strong>Flagged Content:</strong> ${jsonResponse.flaggedContent || "None"}</p>
      <p><strong>Keywords:</strong> ${jsonResponse.keywords.join(", ")}</p>
      <p><strong>Summary:</strong> ${jsonResponse.summary}</p>
    `

    await sendMail("temp.practice.webdev@gmail.com", "Text Threat Analysis Completed", html)

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("Error analyzing text:", error)
    return NextResponse.json({ error: "Failed to analyze text" }, { status: 500 })
  }
}
