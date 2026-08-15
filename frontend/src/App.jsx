// src/App.jsx - Main Application Container & State Orchestrator
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import CategoryFilter from './components/CategoryFilter';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import CategoryBreakdown from './components/CategoryBreakdown';
import { getExpenses, getSummary, createExpense, updateExpense, deleteExpense } from './services/api';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ totalAmount: 0, totalCount: 0, topCategory: 'None', categoryBreakdown: [] });
  const [activeCategory, setActiveCategory] = useState('All');
  
  // UI Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  
  // Network & Error State
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch expenses list & summary metrics from REST backend
  const loadData = useCallback(async (category = activeCategory) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const [expenseData, summaryData] = await Promise.all([
        getExpenses(category),
        getSummary()
      ]);
      setExpenses(expenseData || []);
      setSummary(summaryData || { totalAmount: 0, totalCount: 0, topCategory: 'None', categoryBreakdown: [] });
    } catch (err) {
      console.error('Error loading data:', err.message);
      setErrorMessage(err.message || 'Unable to connect to Modus server. Please check your backend connection.');
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    loadData(activeCategory);
  }, [activeCategory, loadData]);

  // Handler: Open modal for creating a new expense
  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  // Handler: Open modal for editing an existing expense
  const handleOpenEditModal = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  // Handler: Submit form (Create or Update)
  const handleFormSubmit = async (formData) => {
    if (editingExpense && editingExpense.id) {
      await updateExpense(editingExpense.id, formData);
    } else {
      await createExpense(formData);
    }
    await loadData(activeCategory);
  };

  // Handler: Delete an expense with window confirmation
  const handleDeleteExpense = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this expense?');
    if (!confirmDelete) return;

    try {
      await deleteExpense(id);
      await loadData(activeCategory);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  // Handler: Category filter change
  const handleSelectCategory = (category) => {
    setActiveCategory(category);
  };

  return (
    <div className="app-container">
      {/* Brand Header */}
      <Header onOpenAddModal={handleOpenAddModal} />

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="card" style={{
          backgroundColor: '#FFF0F2',
          border: '1px solid #F8D7DA',
          color: '#C85A6E',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h4 style={{ color: '#C85A6E', fontSize: '1rem', marginBottom: '0.2rem' }}>Connection issue</h4>
            <p style={{ color: '#A04253', fontSize: '0.9rem' }}>{errorMessage}</p>
          </div>
          <button onClick={() => loadData(activeCategory)} className="btn btn-secondary">
            Retry connection
          </button>
        </div>
      )}

      {/* Summary Stat Cards */}
      <SummaryCards summary={summary} />

      {/* Main Section Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Where did my money go?</h2>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {expenses.length} {expenses.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Category Filter Chips */}
      <CategoryFilter 
        activeCategory={activeCategory} 
        onSelectCategory={handleSelectCategory} 
      />

      {/* Loading Spinner / Expense List */}
      {isLoading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading your expenses...
        </div>
      ) : (
        <ExpenseList 
          expenses={expenses}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteExpense}
          onOpenAddModal={handleOpenAddModal}
          activeCategory={activeCategory}
        />
      )}

      {/* Category-wise Spending Breakdown */}
      <CategoryBreakdown summary={summary} />

      {/* Add / Edit Expense Modal */}
      <ExpenseForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingExpense}
      />
    </div>
  );
}
