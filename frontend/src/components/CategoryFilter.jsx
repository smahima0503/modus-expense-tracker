// src/components/CategoryFilter.jsx - Category Filter Tabs
import React from 'react';

export const CATEGORIES = [
  'All',
  'Food & Dining',
  'Transport',
  'Shopping',
  'Entertainment',
  'Personal Care',
  'Utilities',
  'Other'
];

export default function CategoryFilter({ activeCategory, onSelectCategory }) {
  return (
    <nav aria-label="Category filter" style={{ marginBottom: '1.75rem', overflowX: 'auto' }}>
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        paddingBottom: '0.25rem'
      }}>
        {CATEGORIES.map(category => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              style={{
                fontFamily: 'var(--font-main)',
                fontSize: '0.875rem',
                fontWeight: isActive ? 700 : 500,
                padding: '0.45rem 0.95rem',
                borderRadius: 'var(--radius-sm)',
                border: isActive ? '1px solid var(--accent-purple)' : '1px solid var(--border-color)',
                backgroundColor: isActive ? 'var(--accent-purple)' : 'var(--bg-card)',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
                whiteSpace: 'nowrap'
              }}
            >
              {category}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
