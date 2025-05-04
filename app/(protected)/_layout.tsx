"use client"

import { Slot, useRouter, useSegments } from "expo-router"
import { useEffect } from "react"
import { useAuth } from "../../context/auth"

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    // Check if the user is authenticated
    if (!isAuthenticated) {
      // Redirect to the login page if not authenticated
      router.replace("/(auth)/login")
    }
  }, [isAuthenticated, segments])

  // If not authenticated, don't render the children
  if (!isAuthenticated) {
    return null
  }

  return <Slot />
}
