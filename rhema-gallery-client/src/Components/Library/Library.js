import React, { useEffect, useState } from 'react';
import './Library.css';

const Library = () => {
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState('');

  // Fetch all books on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/books'); // Ensure this matches your server endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        console.error('Fetch Error:', err);
      }
    };
    fetchBooks();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/books?category=${category}`); 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error('Search Fetch Error:', err);
    }
  };

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Search"
        value={category}
        onChange={e => setCategory(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <h2>Books</h2>
      <ul className="book-list">
        {books.map(book => (
          <li key={book._id} className="book-item">
            <a href={book.pdfLink} target="_blank" rel="noopener noreferrer">
              <img 
                src={book.coverImage} 
                alt={book.title}
                className="book-cover" 
              />
              <h3>{book.title}</h3>
              <p>by {book.author}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Library;
