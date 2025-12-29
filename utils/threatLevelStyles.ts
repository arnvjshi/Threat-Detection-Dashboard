/**
 * Utility functions for threat level styling
 * These functions are extracted and shared to avoid duplication
 */

export function getThreatLevelColor(level: string): string {
  switch (level?.toLowerCase()) {
    case "none":
      return "text-green-400"
    case "low":
      return "text-blue-400"
    case "medium":
      return "text-amber-400"
    case "high":
      return "text-orange-400"
    case "critical":
      return "text-red-400"
    default:
      return "text-slate-400"
  }
}

export function getThreatLevelProgressColor(level: string): string {
  switch (level?.toLowerCase()) {
    case "none":
      return "bg-green-500"
    case "low":
      return "bg-blue-500"
    case "medium":
      return "bg-amber-500"
    case "high":
      return "bg-orange-500"
    case "critical":
      return "bg-red-500"
    default:
      return "bg-slate-500"
  }
}
