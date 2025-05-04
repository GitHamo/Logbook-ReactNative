import type { User } from "../types"

// Mock function to check authentication status
export async function checkAuthStatus(): Promise<User | null> {
    return new Promise((resolve) => {
        // Simulate API call with 5-second delay
        setTimeout(() => {
            // Check if we have a token in memory or storage
            // For this mock, we'll just return null to simulate not being authenticated
            resolve(null)
        }, 5000)
    })
}

// Mock function to login
export async function login(username: string, password: string, staySignedIn: boolean): Promise<User> {
    return new Promise((resolve, reject) => {
        // Simulate API call with 1-second delay
        setTimeout(() => {
            // For demo purposes, accept any non-empty username/password
            if (username && password) {
                resolve({
                    id: "1",
                    username,
                    token: "mock-jwt-token",
                })
            } else {
                reject(new Error("Invalid credentials"))
            }
        }, 1000)
    })
}

// Mock function to logout
export async function logout(): Promise<void> {
    return new Promise((resolve) => {
        // Simulate API call with 1-second delay
        setTimeout(() => {
            resolve()
        }, 1000)
    })
}
