// src/services/api.js - Centralized API Service for Modus REST Endpoints
const API_BASE_URL = '/api/expenses';

// Helper to handle API responses and throw informative errors
async function handleResponse(response) {
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

// 1. GET /api/expenses (with optional category filter)
export async function getExpenses(category = 'All') {
  const url = category && category !== 'All' 
    ? `${API_BASE_URL}?category=${encodeURIComponent(category)}`
    : API_BASE_URL;

  const response = await fetch(url);
  return await handleResponse(response);
}

// 2. GET /api/expenses/summary (SQL Aggregation SUM, COUNT, GROUP BY)
export async function getSummary() {
  const response = await fetch(`${API_BASE_URL}/summary`);
  return await handleResponse(response);
}

// 3. POST /api/expenses (Add Expense)
export async function createExpense(expenseData) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expenseData)
  });
  return await handleResponse(response);
}

// 4. PUT /api/expenses/:id (Update Expense)
export async function updateExpense(id, expenseData) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expenseData)
  });
  return await handleResponse(response);
}

// 5. DELETE /api/expenses/:id (Delete Expense)
export async function deleteExpense(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE'
  });
  return await handleResponse(response);
}
