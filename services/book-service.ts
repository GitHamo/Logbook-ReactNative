import type { Book } from "../types"

// Mock data
let books: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
  },
  {
    id: "4",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
  },
  {
    id: "5",
    title: "Pride and Prejudice",
    author: "Jane Austen",
  },
]

// Mock function to fetch books
export async function fetchBooks(): Promise<Book[]> {
  return new Promise((resolve) => {
    // Simulate API call with 1-second delay
    setTimeout(() => {
      resolve([...books])
    }, 1000)
  })
}

// Mock function to get a single book
export async function getBook(id: string): Promise<Book | null> {
  return new Promise((resolve) => {
    // Simulate API call with 500ms delay
    setTimeout(() => {
      const book = books.find((b) => b.id === id)
      resolve(book || null)
    }, 500)
  })
}

// Mock function to create a new book
export async function createBook(bookData: Partial<Book>): Promise<Book> {
  return new Promise((resolve) => {
    // Simulate API call with 1-second delay
    setTimeout(() => {
      const newBook: Book = {
        id: Date.now().toString(), // Generate a unique ID
        title: bookData.title || "Untitled",
        author: bookData.author || "Unknown",
      }

      books.push(newBook)
      resolve(newBook)
    }, 1000)
  })
}

// Mock function to update a book
export async function updateBook(id: string, bookData: Partial<Book>): Promise<Book> {
  return new Promise((resolve, reject) => {
    // Simulate API call with 1-second delay
    setTimeout(() => {
      const index = books.findIndex((b) => b.id === id)

      if (index === -1) {
        reject(new Error("Book not found"))
        return
      }

      books[index] = {
        ...books[index],
        ...bookData,
      }

      resolve(books[index])
    }, 1000)
  })
}

// Mock function to delete a book
export async function deleteBook(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Simulate API call with 1-second delay
    setTimeout(() => {
      const initialLength = books.length
      books = books.filter((b) => b.id !== id)

      if (books.length === initialLength) {
        reject(new Error("Book not found"))
        return
      }

      resolve()
    }, 1000)
  })
}
