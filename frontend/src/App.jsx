// src/App.jsx - Main Application Container & Session Orchestrator
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import SummaryCards from './components/SummaryCards';
import CategoryFilter from './components/CategoryFilter';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import CategoryBreakdown from './components/CategoryBreakdown';
import { 
  getMe, 
  loginUser, 
  registerUser, 
  logoutUser, 
  getExpenses, 
  getSummary, 
  createExpense, 
  updateExpense, 
  deleteExpense 
} from './services/api';

export default function App() {
  // Auth State
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Expense Data State
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ totalAmount: 0, totalCount: 0, topCategory: 'None', categoryBreakdown: [] });
  const [activeCategory, setActiveCategory] = useState('All');
  
  // UI Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  
  // Network & Error State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch expense list & summary for authenticated user
  const loadExpenseData = useCallback(async (category = activeCategory) => {
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
      console.error('Error loading expense data:', err.message);
      setErrorMessage(err.message || 'Failed to load expense data.');
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory]);

  // Initial Auth Check on app mount
  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const data = await getMe();
        if (data && data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Auth verification error:', err.message);
        setCurrentUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    }
    checkAuthStatus();
  }, []);

  // Fetch expenses whenever authenticated user or category filter changes
  useEffect(() => {
    if (currentUser) {
      loadExpenseData(activeCategory);
    }
  }, [currentUser, activeCategory, loadExpenseData]);

  // Handler: Login submission
  const handleLogin = async (credentials) => {
    const data = await loginUser(credentials);
    if (data && data.user) {
      setCurrentUser(data.user);
      setActiveCategory('All');
    }
  };

  // Handler: Registration submission
  const handleRegister = async (userData) => {
    const data = await registerUser(userData);
    if (data && data.user) {
      setCurrentUser(data.user);
      setActiveCategory('All');
    }
  };

  // Handler: Logout
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err.message);
    } finally {
      setCurrentUser(null);
      setExpenses([]);
      setSummary({ totalAmount: 0, totalCount: 0, topCategory: 'None', categoryBreakdown: [] });
      setAuthMode('login');
    }
  };

  // Handlers for Expense Form Modal
  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (editingExpense && editingExpense.id) {
      await updateExpense(editingExpense.id, formData);
    } else {
      await createExpense(formData);
    }
    await loadExpenseData(activeCategory);
  };

  const handleDeleteExpense = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this expense?');
    if (!confirmDelete) return;

    try {
      await deleteExpense(id);
      await loadExpenseData(activeCategory);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  // Initial Auth Check Spinner
  if (isCheckingAuth) {
    return (
      <div className="app-container" style={{ textAlign: 'center', paddingTop: '6rem', color: 'var(--text-muted)' }}>
        Loading Modus...
      </div>
    );
  }

  // -------------------------------------------------------------
  // Unauthenticated View (Login or Register)
  // -------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="app-container">
        {authMode === 'login' ? (
          <Login 
            onLoginSuccess={handleLogin} 
            onSwitchToRegister={() => setAuthMode('register')} 
          />
        ) : (
          <Register 
            onRegisterSuccess={handleRegister} 
            onSwitchToLogin={() => setAuthMode('login')} 
          />
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // Authenticated View (Modus Dashboard)
  // -------------------------------------------------------------
  return (
    <div className="app-container">
      {/* Header with User Greeting and Logout */}
      <Header 
        currentUser={currentUser} 
        onOpenAddModal={handleOpenAddModal} 
        onLogout={handleLogout} 
      />

      {/* Connection / API Error Banner */}
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
            <h4 style={{ color: '#C85A6E', fontSize: '1rem', marginBottom: '0.2rem' }}>Error loading data</h4>
            <p style={{ color: '#A04253', fontSize: '0.9rem' }}>{errorMessage}</p>
          </div>
          <button onClick={() => loadExpenseData(activeCategory)} className="btn btn-secondary">
            Retry connection
          </button>
        </div>
      )}

      {/* Summary Stat Cards */}
      <SummaryCards summary={summary} />

      {/* Dashboard Section Header */}
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
        onSelectCategory={setActiveCategory} 
      />

      {/* Loading State or Expense List */}
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

      {/* Category Spending Breakdown */}
      <CategoryBreakdown summary={summary} />

      {/* Add / Edit Expense Form Modal */}
      <ExpenseForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingExpense}
      />
    </div>
  );
}
