import { NextResponse } from "next/server"
import { sendMail } from "@/utils/sendMail" 

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const imageFile = formData.get("image") as File | null

    if (!imageFile) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 })
    }

    const buffer = await imageFile.arrayBuffer()
    const base64Image = Buffer.from(buffer).toString("base64")

    const apiKey = process.env.GEMINI_API_KEY
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`

    const requestData = {
      contents: [
        {
          parts: [
            {
              text: `Analyze this image for potential security threats or dangerous objects. Provide a detailed assessment in JSON format with the following structure:
              {
                "threatDetected": boolean,
                "threatProbability": number (0-100),
                "threatLevel": "none"|"low"|"medium"|"high"|"critical",
                "detectedObjects": [array of strings],
                "dangerousObjects": [array of strings],
                "analysis": string,
                "recommendation": string
              }`,
            },
            {
              inline_data: {
                mime_type: imageFile.type,
                data: base64Image,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 4096,
      },
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gemini API error:", errorData)
      return NextResponse.json({ error: "Failed to analyze image with Gemini API" }, { status: response.status })
    }

    const data = await response.json()

    let jsonResponse
    try {
      const textContent = data.candidates[0].content.parts[0].text
      const jsonMatch = textContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonResponse = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (error) {
      console.error("Error parsing Gemini response:", error)
      return NextResponse.json({ error: "Failed to parse Gemini API response" }, { status: 500 })
    }

    const normalizedResponse = {
      threatDetected: Boolean(jsonResponse.threatDetected),
      threatProbability: Number(jsonResponse.threatProbability) || 0,
      threatLevel: jsonResponse.threatLevel || "none",
      detectedObjects: Array.isArray(jsonResponse.detectedObjects)
        ? jsonResponse.detectedObjects.map((obj: any) => (typeof obj === "string" ? obj : String(obj)))
        : [],
      dangerousObjects: Array.isArray(jsonResponse.dangerousObjects)
        ? jsonResponse.dangerousObjects.map((obj: any) => (typeof obj === "string" ? obj : String(obj)))
        : [],
      analysis: String(jsonResponse.analysis || ""),
      recommendation: String(jsonResponse.recommendation || ""),
      timestamp: new Date().toISOString(),
    }

    const html = `
      <h2>Image Threat Analysis Result</h2>
      <p><strong>Threat Detected:</strong> ${normalizedResponse.threatDetected}</p>
      <p><strong>Threat Probability:</strong> ${normalizedResponse.threatProbability}%</p>
      <p><strong>Threat Level:</strong> ${normalizedResponse.threatLevel}</p>
      <p><strong>Detected Objects:</strong> ${normalizedResponse.detectedObjects.join(", ")}</p>
      <p><strong>Dangerous Objects:</strong> ${normalizedResponse.dangerousObjects.join(", ")}</p>
      <p><strong>Analysis:</strong> ${normalizedResponse.analysis}</p>
      <p><strong>Recommendation:</strong> ${normalizedResponse.recommendation}</p>
      <p><strong>Timestamp:</strong> ${normalizedResponse.timestamp}</p>
    `

    await sendMail("temp.practice.webdev@gmail.com", "Image Threat Analysis Completed", html)

    return NextResponse.json(normalizedResponse)
  } catch (error) {
    console.error("Error analyzing image:", error)
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 })
  }
}
