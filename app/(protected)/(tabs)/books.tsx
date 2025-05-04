"use client"

import { AntDesign, Feather } from "@expo/vector-icons"
import { useFocusEffect, useRouter } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { deleteBook, fetchBooks } from "../../../services/book-service"
import type { Book } from "../../../types"

export default function BooksScreen() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const router = useRouter()

  const loadBooks = async () => {
    setLoading(true)
    try {
      const booksData = await fetchBooks()
      setBooks(booksData)
      setError("")
    } catch (err) {
      setError("Failed to load books")
      console.error(err)
    } finally {
      setLoading(false)
      setIsInitialLoad(false)
    }
  }

  // Only load books on initial component mount
  useEffect(() => {
    if (isInitialLoad) {
      loadBooks()
    }
  }, [isInitialLoad])

  // Handle navigation with book updates
  useFocusEffect(
    useCallback(() => {
      // This runs when the screen comes into focus
      const handleScreenFocus = async () => {
        // Check if we're returning with updated book data
        const updatedBook = router.current?.params?.updatedBook
        const newBook = router.current?.params?.newBook
        const deletedBookId = router.current?.params?.deletedBookId

        if (updatedBook) {
          // Update the specific book in the list without a full reload
          const bookData = JSON.parse(updatedBook as string) as Book
          setBooks((prevBooks) => prevBooks.map((book) => (book.id === bookData.id ? bookData : book)))
        } else if (newBook) {
          // Add the new book to the list without a full reload
          const bookData = JSON.parse(newBook as string) as Book
          setBooks((prevBooks) => [...prevBooks, bookData])
        } else if (deletedBookId) {
          // Remove the deleted book from the list
          setBooks((prevBooks) => prevBooks.filter((book) => book.id !== deletedBookId))
        }
      }

      handleScreenFocus()

      // Clear params after handling them
      if (
        router.current?.params?.updatedBook ||
        router.current?.params?.newBook ||
        router.current?.params?.deletedBookId
      ) {
        router.setParams({})
      }
    }, [router]),
  )

  const handleEdit = (book: Book) => {
    router.push({
      pathname: "/(protected)/book-form",
      params: { id: book.id, mode: "edit" },
    })
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteBook(id)
      // Update local state without reloading from API
      setBooks(books.filter((book) => book.id !== id))
    } catch (err) {
      console.error("Failed to delete book:", err)
      setError("Failed to delete book")
    }
  }

  const handleAddNew = () => {
    router.push({
      pathname: "/(protected)/book-form",
      params: { mode: "new" },
    })
  }

  const handleRefresh = () => {
    loadBooks()
  }

  if (loading && isInitialLoad) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  if (error && books.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookAuthor}>by {item.author}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => handleEdit(item)}>
                <Feather name="edit" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(item.id)}
              >
                <Feather name="trash-2" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No books available</Text>
            <Text style={styles.emptySubText}>Tap the + button to add a new book</Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddNew}>
        <AntDesign name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bookItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bookAuthor: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: "#007AFF",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
  error: {
    color: "red",
    fontSize: 16,
    marginBottom: 16,
  },
  errorBanner: {
    color: "white",
    backgroundColor: "#FF3B30",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#007AFF",
    borderRadius: 28,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
})
