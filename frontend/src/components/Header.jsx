// src/components/Header.jsx - Modus Header & Action Bar
import React from 'react';

export default function Header({ onOpenAddModal }) {
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

      <button 
        onClick={onOpenAddModal} 
        className="btn btn-primary"
        style={{ padding: '0.65rem 1.25rem', fontSize: '0.925rem' }}
      >
        {/* SVG Plus Icon - No Emoji */}
        <svg className="icon" viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add expense
      </button>
    </header>
  );
}
