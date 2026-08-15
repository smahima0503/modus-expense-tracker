// src/services/api.js - Centralized REST API Service for Modus
const API_BASE_URL = '/api';

// Helper to handle HTTP responses and include credentials for session cookies
async function handleRequest(endpoint, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json'
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    },
    credentials: 'include' // Always pass session cookie (connect.sid)
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const contentType = response.headers.get('content-type');
  let data = {};

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const errorMessage = data.error || `HTTP Error ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return data;
}

// -------------------------------------------------------------
// Authentication Endpoints
// -------------------------------------------------------------

// 1. POST /api/auth/register
export async function registerUser({ name, email, password }) {
  return await handleRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
}

// 2. POST /api/auth/login
export async function loginUser({ email, password }) {
  return await handleRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

// 3. POST /api/auth/logout
export async function logoutUser() {
  return await handleRequest('/auth/logout', {
    method: 'POST'
  });
}

// 4. GET /api/auth/me
export async function getMe() {
  return await handleRequest('/auth/me', {
    method: 'GET'
  });
}

// -------------------------------------------------------------
// Expense Endpoints (User Data Isolated)
// -------------------------------------------------------------

// 5. GET /api/expenses
export async function getExpenses(category = 'All') {
  const url = category && category !== 'All'
    ? `/expenses?category=${encodeURIComponent(category)}`
    : '/expenses';
  return await handleRequest(url, { method: 'GET' });
}

// 6. GET /api/expenses/summary
export async function getSummary() {
  return await handleRequest('/expenses/summary', { method: 'GET' });
}

// 7. POST /api/expenses
export async function createExpense(expenseData) {
  return await handleRequest('/expenses', {
    method: 'POST',
    body: JSON.stringify(expenseData)
  });
}

// 8. PUT /api/expenses/:id
export async function updateExpense(id, expenseData) {
  return await handleRequest(`/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(expenseData)
  });
}

// 9. DELETE /api/expenses/:id
export async function deleteExpense(id) {
  return await handleRequest(`/expenses/${id}`, {
    method: 'DELETE'
  });
}
