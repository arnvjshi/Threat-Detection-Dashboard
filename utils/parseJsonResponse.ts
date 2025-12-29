/**
 * Utility function to parse JSON from AI response text
 * Handles cases where JSON might be wrapped in markdown or other text
 * @returns The parsed JSON object, or throws an error if parsing fails
 */
export function parseJsonResponse(responseText: string): unknown {
  try {
    // Try direct parse first
    return JSON.parse(responseText)
  } catch (error) {
    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error("Failed to parse JSON response")
  }
}
