import { NextResponse } from "next/server"

export const runtime = "nodejs" // Specify Node.js runtime for Vercel

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const imageFile = formData.get("image") as File | null

    if (!imageFile) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 })
    }

    // Convert the file to base64
    const buffer = await imageFile.arrayBuffer()
    const base64Image = Buffer.from(buffer).toString("base64")

    // Prepare the request to Gemini API
    const apiKey = process.env.GEMINI_API_KEY
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`

    const requestData = {
      contents: [
        {
          parts: [
            {
              text: 'Analyze this image for potential security threats or dangerous objects. Provide a detailed assessment in JSON format with the following structure: { "threatDetected": boolean, "threatProbability": number (0-100), "threatLevel": "none"|"low"|"medium"|"high"|"critical", "detectedObjects": [array of strings with object names], "dangerousObjects": [array of strings with dangerous object names], "analysis": string (detailed analysis), "recommendation": string (security recommendation) }',
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

    // Make the request to Gemini API
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

    // Extract the JSON from the text response
    let jsonResponse
    try {
      const textContent = data.candidates[0].content.parts[0].text
      // Find JSON in the response
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

    // Normalize the response to ensure consistent data format
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

    return NextResponse.json(normalizedResponse)
  } catch (error) {
    console.error("Error analyzing image:", error)
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 })
  }
}
