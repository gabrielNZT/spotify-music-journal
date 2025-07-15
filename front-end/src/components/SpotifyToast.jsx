import React from 'react';
import styles from './SpotifyToast.module.css';

export default function SpotifyToast({ message, type = 'info', onClose }) {
  return (
    <div className={`${styles.toast} ${styles[type]}`}> 
      <div className={styles.icon}>
        {type === 'error' ? (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#E22134"/><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
        ) : (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1DB954"/><path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
        )}
      </div>
      <span className={styles.message}>{message}</span>
      <button className={styles.close} onClick={onClose} aria-label="Fechar">×</button>
    </div>
  );
}
