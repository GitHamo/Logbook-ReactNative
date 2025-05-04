import type { Book } from "../types"

// Mock function to fetch books
export async function fetchBooks(): Promise<Book[]> {
  return new Promise((resolve) => {
    // Simulate API call with 1-second delay
    setTimeout(() => {
      resolve([
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
      ])
    }, 1000)
  })
}
