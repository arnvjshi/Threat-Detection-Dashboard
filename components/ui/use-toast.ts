"use client"

// This is a simplified version of the use-toast hook
import { useState } from "react"

type ToastProps = {
  title: string
  description: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    setToasts((prev) => [...prev, props])

    // In a real implementation, we would show a toast notification
    // For this demo, we'll just log to console
    console.log(`Toast: ${props.title} - ${props.description}`)

    // Remove the toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t !== props))
    }, 3000)
  }

  return { toast, toasts }
}
