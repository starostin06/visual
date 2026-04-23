import React, { useEffect, useState } from 'react';
import BookCard from './components/BookCard';
import styles from './App.module.css';

const BOOKS_API_URL = 'https://fakeapi.extendsclass.com/books';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCovers, setLoadingCovers] = useState(false);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        console.log("Загружаю книги из fakeapi...");
        
        const booksResponse = await fetch(BOOKS_API_URL);
         \
        if (!booksResponse.ok) {
          throw new Error(`Ошибка HTTP: ${booksResponse.status}`);
        }
        
        const booksData = await booksResponse.json();
        console.log("Получено книг:", booksData.length);
        
        const limitedBooks = booksData;
        
        setBooks(limitedBooks.map(book => ({ ...book, coverBlob: null })));
        setLoading(false);
        
        setLoadingCovers(true);
        
        for (const book of limitedBooks) {
          if (!book.isbn) continue;
          
          try {
            const searchResponse = await fetch(
              `https://openlibrary.org/api/books?bibkeys=ISBN:${book.isbn}&format=json&jscmd=data`
            );
            const data = await searchResponse.json();
            const bookData = data[`ISBN:${book.isbn}`];
            
            if (bookData?.cover?.large) {
              const coverResponse = await fetch(bookData.cover.large);
              const blob = await coverResponse.blob();
              
              setBooks(prevBooks => 
                prevBooks.map(b => 
                  b.id === book.id ? { ...b, coverBlob: blob } : b
                )
              );
              console.log(`✅ Обложка загружена для: ${book.title}`);
            } else {
              console.log(`❌ Нет обложки для: ${book.title}`);
            }
          } catch (err) {
            console.log(`⚠️ Ошибка загрузки обложки для: ${book.title}`, err);
          }
        }
        
        setLoadingCovers(false);
        console.log("Загрузка обложек завершена!");
        
      } catch (error) {
        console.error('Ошибка загрузки книг:', error);
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Загрузка книг...</div>;
  }

  return (
    <div className={styles.app}>
      <h1 className={styles.header}>Каталог книг</h1>
      {loadingCovers && (
        <div className={styles.coversLoading}>Загрузка обложек...</div>
      )}
      <div className={styles.grid}>
        {books.map((book) => (
          <BookCard
            key={book.id}
            coverBlob={book.coverBlob}
            title={book.title}
            authors={book.authors}
          />
        ))}
      </div>
    </div>
  );
}

export default App;