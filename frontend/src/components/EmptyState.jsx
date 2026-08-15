// src/components/EmptyState.jsx - Simple Empty State Component
import React from 'react';

export default function EmptyState({ onAddExpense, activeCategory }) {
  return (
    <div className="card" style={{
      textAlign: 'center',
      padding: '3.5rem 1.5rem',
      backgroundColor: 'var(--bg-card)',
      border: '1px dashed var(--border-color)',
      borderRadius: 'var(--radius-md)'
    }}>
      {/* Soft decorative SVG graphic - No Emoji */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: 'var(--bg-subtle)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
        color: 'var(--accent-purple)'
      }}>
        <svg className="icon" style={{ width: '24px', height: '24px' }} viewBox="0 0 24 24">
          <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
      </div>

      <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.35rem', fontWeight: 700 }}>
        Nothing here yet
      </h3>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', maxWidth: '340px', margin: '0 auto 1.5rem auto' }}>
        {activeCategory && activeCategory !== 'All' 
          ? `No expenses registered under "${activeCategory}".`
          : 'Keep an eye on your spending by adding your first expense.'}
      </p>

      {onAddExpense && (
        <button onClick={onAddExpense} className="btn btn-secondary">
          Add an expense
        </button>
      )}
    </div>
  );
}
