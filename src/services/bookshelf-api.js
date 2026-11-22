import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4040';

async function fetchStaticDatabase() {
  const { data } = await axios.get(`${process.env.PUBLIC_URL}/db.json`);
  return data;
}

export async function fetchAuthors() {
  if (process.env.NODE_ENV === 'production') {
    const { authors, books } = await fetchStaticDatabase();
    return authors.map(author => ({
      ...author,
      books: books.filter(book => book.authorId === author.id),
    }));
  }

  const { data } = await axios.get(`/authors?_embed=books`);
  return data;
}

export async function fetchBooks() {
  if (process.env.NODE_ENV === 'production') {
    const { books } = await fetchStaticDatabase();
    return books;
  }

  const { data } = await axios.get(`/books`);
  return data;
}

export async function fetchBookById(bookId) {
  if (process.env.NODE_ENV === 'production') {
    const { books, authors } = await fetchStaticDatabase();
    const book = books.find(item => String(item.id) === String(bookId));
    if (!book) {
      throw new Error('Book not found');
    }
    return {
      ...book,
      author: authors.find(author => author.id === book.authorId),
    };
  }

  const { data } = await axios.get(`/books/${bookId}?_expand=author`);
  return data;
}
