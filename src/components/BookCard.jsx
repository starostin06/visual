import React, { useEffect, useState } from 'react';
import styles from './BookCard.module.css';

const BookCard = ({ coverBlob, title, authors }) => {
  const [coverUrl, setCoverUrl] = useState(null);

  useEffect(() => {
    if (coverBlob) {
      const url = URL.createObjectURL(coverBlob);
      setCoverUrl(url);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [coverBlob]);

  return (
    <div className={styles.card}>
      {coverUrl ? (
        <img 
          src={coverUrl} 
          alt={`Обложка: ${title}`} 
          className={styles.cover}
        />
      ) : (
        <div className={styles.coverPlaceholder}>
          <span>📚</span>
          <span>Нет обложки</span>
        </div>
      )}
      <div className={styles.title}>{title}</div>
      <div className={styles.authors}>{authors.join(', ')}</div>
    </div>
  );
};

export default BookCard;