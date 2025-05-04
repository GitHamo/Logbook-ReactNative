"use client"

import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { createBook, getBook, updateBook } from "../../services/book-service"
import type { Book } from "../../types"

export default function BookFormScreen() {
    const { id, mode } = useLocalSearchParams<{ id?: string; mode: "edit" | "new" }>()
    const isEditMode = mode === "edit" && id
    const router = useRouter()

    const [title, setTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(isEditMode)
    const [error, setError] = useState("")

    useEffect(() => {
        const loadBook = async () => {
            if (isEditMode) {
                try {
                    const book = await getBook(id!)
                    if (book) {
                        setTitle(book.title)
                        setAuthor(book.author)
                    }
                } catch (err) {
                    console.error("Failed to load book:", err)
                    setError("Failed to load book details")
                } finally {
                    setInitialLoading(false)
                }
            }
        }

        loadBook()
    }, [id, isEditMode])

    const handleSave = async () => {
        if (!title.trim() || !author.trim()) {
            setError("Title and author are required")
            return
        }

        setLoading(true)
        setError("")

        try {
            const bookData: Partial<Book> = {
                title: title.trim(),
                author: author.trim(),
            }

            let resultBook: Book

            if (isEditMode) {
                resultBook = await updateBook(id!, bookData)
                // Pass the updated book back to the books screen
                router.back({
                    params: { updatedBook: JSON.stringify(resultBook) },
                })
            } else {
                resultBook = await createBook(bookData)
                // Pass the new book back to the books screen
                router.back({
                    params: { newBook: JSON.stringify(resultBook) },
                })
            }
        } catch (err) {
            console.error("Failed to save book:", err)
            setError(`Failed to ${isEditMode ? "update" : "create"} book`)
            setLoading(false)
        }
    }

    if (initialLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.title}>{isEditMode ? "Edit Book" : "Add New Book"}</Text>
                <View style={styles.placeholder} />
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter book title" />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Author</Text>
                    <TextInput style={styles.input} value={author} onChangeText={setAuthor} placeholder="Enter author name" />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.buttonText}>Save</Text>}
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    placeholder: {
        width: 40,
    },
    form: {
        padding: 16,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: "500",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    error: {
        color: "red",
        padding: 16,
        textAlign: "center",
    },
})
