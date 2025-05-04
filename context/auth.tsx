"use client"

import * as SecureStore from "expo-secure-store"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { Platform } from "react-native"

// Define user type
type User = {
    id: string
    username: string
    token: string
}

// Define auth context type
type AuthContextType = {
    user: User | null
    isAuthenticated: boolean
    setUser: (user: User) => void
    clearUser: () => void
}

// Create auth context with default values
const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    setUser: () => { },
    clearUser: () => { },
})

// Cross-platform storage implementation
const storage = {
    async getItem(key: string): Promise<string | null> {
        try {
            if (Platform.OS === "web") {
                const item = localStorage.getItem(key)
                return item
            } else {
                return await SecureStore.getItemAsync(key)
            }
        } catch (e) {
            console.error("Error getting item from storage:", e)
            return null
        }
    },

    async setItem(key: string, value: string): Promise<void> {
        try {
            if (Platform.OS === "web") {
                localStorage.setItem(key, value)
            } else {
                await SecureStore.setItemAsync(key, value)
            }
        } catch (e) {
            console.error("Error setting item in storage:", e)
        }
    },

    async removeItem(key: string): Promise<void> {
        try {
            if (Platform.OS === "web") {
                localStorage.removeItem(key)
            } else {
                await SecureStore.deleteItemAsync(key)
            }
        } catch (e) {
            console.error("Error removing item from storage:", e)
        }
    },
}

// Auth provider props
type AuthProviderProps = {
    children: ReactNode
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUserState] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Load user from storage on mount
    useEffect(() => {
        const loadUser = async () => {
            try {
                const userJson = await storage.getItem("user")
                if (userJson) {
                    setUserState(JSON.parse(userJson))
                }
            } catch (error) {
                console.error("Failed to load user from storage:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadUser()
    }, [])

    // Set user and save to storage
    const setUser = async (userData: User) => {
        try {
            await storage.setItem("user", JSON.stringify(userData))
            setUserState(userData)
        } catch (error) {
            console.error("Failed to save user to storage:", error)
        }
    }

    // Clear user from state and storage
    const clearUser = async () => {
        try {
            await storage.removeItem("user")
            setUserState(null)
        } catch (error) {
            console.error("Failed to clear user from storage:", error)
        }
    }

    // Provide auth context
    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                setUser,
                clearUser,
            }}
        >
            {!isLoading && children}
        </AuthContext.Provider>
    )
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
