"use client"

import * as Font from "expo-font"
import { Slot, SplashScreen } from "expo-router"
import { useEffect } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AuthProvider } from "../context/auth"
import { ThemeProvider } from "../context/theme"

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  useEffect(() => {
    // Load any resources or data needed for the app
    async function prepare() {
      try {
        // Load fonts, etc.
        await Font.loadAsync({
          // Add your custom fonts here
        })
      } catch (e) {
        console.warn(e)
      } finally {
        // Tell the splash screen to hide after resources are loaded
        SplashScreen.hideAsync()
      }
    }

    prepare()
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <Slot />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
