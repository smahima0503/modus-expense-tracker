// src/components/CategoryBreakdown.jsx - Visual Category Proportion Bars (No Chart Library)
import React from 'react';

export default function CategoryBreakdown({ summary }) {
  const breakdown = summary?.categoryBreakdown || [];
  const totalAmount = summary?.totalAmount || 0;

  if (!breakdown || breakdown.length === 0 || totalAmount <= 0) {
    return null;
  }

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(val);
  };

  // Palette of soft feminine colors for category bars
  const colors = [
    '#8E6C8F', // Soft dark purple
    '#D8A7B1', // Dusty rose
    '#B590B8', // Soft mauve
    '#D0B8D2', // Lavender
    '#C4A1BA', // Plum tint
    '#E2D5E7'  // Pale lavender
  ];

  return (
    <div className="card" style={{ marginTop: '2rem', padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.05rem', marginBottom: '1.25rem', color: 'var(--text-primary)', fontWeight: 700 }}>
        Category breakdown
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        {breakdown.map((item, index) => {
          const percentage = totalAmount > 0 ? Math.round((item.total / totalAmount) * 100) : 0;
          const barColor = colors[index % colors.length];

          return (
            <div key={item.category}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.875rem',
                marginBottom: '0.35rem',
                fontWeight: 600
              }}>
                <span style={{ color: 'var(--text-primary)' }}>
                  {item.category} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({item.count})</span>
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {formatCurrency(item.total)} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>• {percentage}%</span>
                </span>
              </div>

              {/* Progress Bar Container */}
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${percentage}%`,
                  height: '100%',
                  backgroundColor: barColor,
                  borderRadius: '4px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
