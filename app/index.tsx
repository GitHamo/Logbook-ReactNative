"use client"

import { useRouter } from "expo-router"
import { useEffect } from "react"
import { ActivityIndicator, StyleSheet, Text, View } from "react-native"
import { useAuth } from "../context/auth"
import { checkAuthStatus } from "../services/auth-service"

export default function SplashScreen() {
  const router = useRouter()
  const { setUser, isAuthenticated } = useAuth()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Mock API call with 5-second delay
        const userData = await checkAuthStatus()

        if (userData) {
          setUser(userData)
          router.replace("/(protected)/(tabs)/books")
        } else {
          router.replace("/(auth)/login")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.replace("/(auth)/login")
      }
    }

    checkAuth()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logbook</Text>
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
})
