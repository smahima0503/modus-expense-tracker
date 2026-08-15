// src/components/SummaryCards.jsx - 3 Soft Summary Cards for Modus Dashboard
import React from 'react';

export default function SummaryCards({ summary }) {
  const { totalAmount = 0, totalCount = 0, topCategory = 'None' } = summary || {};

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(val);
  };

  return (
    <section className="summary-cards-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2.5rem'
    }}>
      {/* Card 1: Total Spending */}
      <div className="card" style={{ padding: '1.35rem 1.5rem' }}>
        <p style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          marginBottom: '0.4rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          Your spending this month
        </p>
        <div style={{
          fontSize: '1.8rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em'
        }}>
          {formatCurrency(totalAmount)}
        </div>
      </div>

      {/* Card 2: Total Transactions */}
      <div className="card" style={{ padding: '1.35rem 1.5rem' }}>
        <p style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          marginBottom: '0.4rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          Transactions
        </p>
        <div style={{
          fontSize: '1.8rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em'
        }}>
          {totalCount} {totalCount === 1 ? 'expense' : 'expenses'}
        </div>
      </div>

      {/* Card 3: Top Category */}
      <div className="card" style={{ padding: '1.35rem 1.5rem' }}>
        <p style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          marginBottom: '0.4rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          Top category
        </p>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--accent-purple)',
          letterSpacing: '-0.01em',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }}>
          {topCategory}
        </div>
      </div>
    </section>
  );
}
