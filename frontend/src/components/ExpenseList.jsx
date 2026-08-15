// src/components/ExpenseList.jsx - List & Table View of Expenses
import React from 'react';
import EmptyState from './EmptyState';

export default function ExpenseList({ expenses, onEdit, onDelete, onOpenAddModal, activeCategory }) {
  if (!expenses || expenses.length === 0) {
    return <EmptyState onAddExpense={onOpenAddModal} activeCategory={activeCategory} />;
  }

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(val);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const cleanDate = dateStr.split('T')[0];
    const [year, month, day] = cleanDate.split('-');
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="card" style={{ padding: '0.75rem', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.925rem'
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Date</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Title</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Category</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>Amount</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(item => (
              <tr 
                key={item.id}
                style={{
                  borderBottom: '1px solid var(--border-color)',
                  transition: 'var(--transition-fast)'
                }}
              >
                <td style={{ padding: '0.95rem 1rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                  {formatDate(item.date)}
                </td>
                <td style={{ padding: '0.95rem 1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {item.title}
                </td>
                <td style={{ padding: '0.95rem 1rem' }}>
                  <span className="badge">
                    {item.category}
                  </span>
                </td>
                <td style={{ padding: '0.95rem 1rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {formatCurrency(item.amount)}
                </td>
                <td style={{ padding: '0.95rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    {/* Edit Button */}
                    <button
                      onClick={() => onEdit(item)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: '0.35rem',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'var(--transition-fast)'
                      }}
                      title="Edit expense"
                      aria-label={`Edit ${item.title}`}
                    >
                      <svg className="icon" viewBox="0 0 24 24">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => onDelete(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#C85A6E',
                        cursor: 'pointer',
                        padding: '0.35rem',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'var(--transition-fast)'
                      }}
                      title="Delete expense"
                      aria-label={`Delete ${item.title}`}
                    >
                      <svg className="icon" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
