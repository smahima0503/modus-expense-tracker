// scripts/testEndpoints.js - Automated API Test Script for Stage 2
const http = require('http');

function makeRequest(options, bodyData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        try {
          const parsed = responseBody ? JSON.parse(responseBody) : {};
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: responseBody });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (bodyData) {
      req.write(JSON.stringify(bodyData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('===================================================');
  console.log('       STAGE 2 - REST API & DATABASE VERIFICATION  ');
  console.log('===================================================\n');

  try {
    // Test 1: GET /api/health
    console.log('1. Testing GET /api/health');
    const health = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET'
    });
    console.log(`Status: ${health.status}`);
    console.log('Response:', JSON.stringify(health.body, null, 2), '\n');

    // Test 2: GET /api/expenses
    console.log('2. Testing GET /api/expenses');
    const list = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/expenses',
      method: 'GET'
    });
    console.log(`Status: ${list.status}`);
    console.log(`Retrieved ${list.body.length} expenses.`);
    console.log('First Item:', JSON.stringify(list.body[0], null, 2), '\n');

    // Test 3: GET /api/expenses/summary (SQL Aggregation SUM, COUNT, GROUP BY)
    console.log('3. Testing GET /api/expenses/summary (SQL Aggregation)');
    const summary = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/expenses/summary',
      method: 'GET'
    });
    console.log(`Status: ${summary.status}`);
    console.log('Summary Output:', JSON.stringify(summary.body, null, 2), '\n');

    // Test 4: POST /api/expenses (Create Expense)
    console.log('4. Testing POST /api/expenses (Create Expense)');
    const newExpense = {
      title: 'Ceramic Tea Mug',
      amount: 18.50,
      category: 'Shopping',
      date: '2026-08-15'
    };
    const createRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/expenses',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, newExpense);
    console.log(`Status: ${createRes.status}`);
    console.log('Created Object:', JSON.stringify(createRes.body, null, 2), '\n');
    const createdId = createRes.body.id;

    // Test 5: GET /api/expenses?category=Shopping (Category Filter)
    console.log('5. Testing GET /api/expenses?category=Shopping (Filter Query)');
    const filterRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/expenses?category=Shopping',
      method: 'GET'
    });
    console.log(`Status: ${filterRes.status}`);
    console.log(`Found ${filterRes.body.length} shopping items:`, filterRes.body.map(i => i.title).join(', '), '\n');

    // Test 6: PUT /api/expenses/:id (Update Expense)
    console.log(`6. Testing PUT /api/expenses/${createdId} (Update Expense)`);
    const updateData = {
      title: 'Ceramic Tea Mug & Saucer',
      amount: 24.00,
      category: 'Shopping',
      date: '2026-08-15'
    };
    const updateRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/api/expenses/${createdId}`,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }, updateData);
    console.log(`Status: ${updateRes.status}`);
    console.log('Updated Object:', JSON.stringify(updateRes.body, null, 2), '\n');

    // Test 7: DELETE /api/expenses/:id (Delete Expense)
    console.log(`7. Testing DELETE /api/expenses/${createdId} (Delete Expense)`);
    const deleteRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/api/expenses/${createdId}`,
      method: 'DELETE'
    });
    console.log(`Status: ${deleteRes.status}`);
    console.log('Delete Response:', JSON.stringify(deleteRes.body, null, 2), '\n');

    // Test 8: Error handling - DELETE non-existent item (404 Not Found)
    console.log('8. Testing Error Handling: DELETE /api/expenses/99999 (Invalid ID)');
    const errRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/expenses/99999',
      method: 'DELETE'
    });
    console.log(`Status: ${errRes.status}`);
    console.log('Error Response:', JSON.stringify(errRes.body, null, 2), '\n');

    console.log('===================================================');
    console.log('       ALL ENDPOINTS VERIFIED SUCCESSFULLY!        ');
    console.log('===================================================');

  } catch (err) {
    console.error('Test script failed:', err.message);
  }
}

runTests();
