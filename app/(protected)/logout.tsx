"use client"

import { useRouter } from "expo-router"
import { useEffect } from "react"
import { ActivityIndicator, StyleSheet, Text, View } from "react-native"
import { useAuth } from "../../context/auth"
import { logout } from "../../services/auth-service"

export default function LogoutScreen() {
  const router = useRouter()
  const { clearUser } = useAuth()

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Call logout service (mocked with delay)
        await logout()

        // Clear user from auth context
        clearUser()

        // Navigate to login screen
        router.replace("/(auth)/login")
      } catch (error) {
        console.error("Logout failed:", error)
        // Even if logout fails, we should still redirect to login
        clearUser()
        router.replace("/(auth)/login")
      }
    }

    performLogout()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Logging out...</Text>
      <ActivityIndicator size="large" color="#007AFF" style={styles.spinner} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  spinner: {
    marginTop: 20,
  },
})
