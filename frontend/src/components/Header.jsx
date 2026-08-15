// src/components/Header.jsx - Modus Header with User Greeting & Logout
import React from 'react';

export default function Header({ currentUser, onOpenAddModal, onLogout }) {
  return (
    <header className="header-container" style={{
      marginBottom: '2.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <div>
        <h1 style={{
          fontSize: '2.1rem',
          color: 'var(--accent-purple)',
          letterSpacing: '-0.02em',
          fontWeight: 800,
          lineHeight: 1.1
        }}>
          Modus
        </h1>
        <p style={{
          fontSize: '0.95rem',
          color: 'var(--text-secondary)',
          fontWeight: 500,
          marginTop: '0.2rem'
        }}>
          Track Your Expenses
        </p>
      </div>

      {currentUser && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Subtle user greeting */}
          <span style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Hello, {currentUser.name}
          </span>

          <button 
            onClick={onOpenAddModal} 
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.1rem', fontSize: '0.9rem' }}
          >
            {/* SVG Plus Icon */}
            <svg className="icon" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add expense
          </button>

          <button 
            onClick={onLogout} 
            className="btn btn-secondary"
            style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}
          >
            {/* SVG Logout Icon */}
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Log out
          </button>
        </div>
      )}
    </header>
  );
}
