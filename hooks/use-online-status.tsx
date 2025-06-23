"use client"

import { useState, useEffect } from "react"

export function useOnlineStatus() {
  // Initialize with safe default value
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Ensure we're in browser environment
    if (typeof window === "undefined") return

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Set initial value safely
    setIsOnline(navigator.onLine)

    // Add event listeners
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return isOnline
}