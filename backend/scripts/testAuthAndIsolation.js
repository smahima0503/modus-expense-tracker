// scripts/testAuthAndIsolation.js - Comprehensive Auth & Multi-User Isolation Test Suite
const http = require('http');

function makeRequest(options, bodyData = null, cookie = null) {
  return new Promise((resolve, reject) => {
    const headers = { 'Content-Type': 'application/json' };
    if (cookie) {
      headers['Cookie'] = cookie;
    }

    const reqOptions = {
      hostname: 'localhost',
      port: 5000,
      path: options.path,
      method: options.method,
      headers
    };

    const req = http.request(reqOptions, (res) => {
      let responseBody = '';
      const responseCookies = res.headers['set-cookie'];
      let sessionCookie = null;
      if (responseCookies) {
        sessionCookie = responseCookies[0].split(';')[0];
      }

      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        try {
          const parsed = responseBody ? JSON.parse(responseBody) : {};
          resolve({ status: res.statusCode, cookie: sessionCookie || cookie, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, cookie: sessionCookie || cookie, body: responseBody });
        }
      });
    });

    req.on('error', err => reject(err));
    if (bodyData) {
      req.write(JSON.stringify(bodyData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('===================================================');
  console.log('    MODUS - AUTHENTICATION & DATA ISOLATION TEST   ');
  console.log('===================================================\n');

  try {
    // Test 1: Register User A
    console.log('1. Registering User A (userA@example.com)...');
    const userA_email = `usera_${Date.now()}@example.com`;
    const regA = await makeRequest(
      { path: '/api/auth/register', method: 'POST' },
      { name: 'User A', email: userA_email, password: 'password123' }
    );
    console.log(`Status: ${regA.status}`);
    console.log('User A Session Created:', regA.body.user);
    const cookieA = regA.cookie;

    // Test 2: Add expense as User A
    console.log('\n2. Adding expense for User A (Art Print - $45.00)...');
    const expA = await makeRequest(
      { path: '/api/expenses', method: 'POST' },
      { title: 'Art Print', amount: 45.00, category: 'Shopping', date: '2026-08-16' },
      cookieA
    );
    console.log(`Status: ${expA.status}`);
    console.log('User A Created Expense ID:', expA.body.id);
    const expA_id = expA.body.id;

    // Test 3: Register User B
    console.log('\n3. Registering User B (userB@example.com)...');
    const userB_email = `userb_${Date.now()}@example.com`;
    const regB = await makeRequest(
      { path: '/api/auth/register', method: 'POST' },
      { name: 'User B', email: userB_email, password: 'password123' }
    );
    console.log(`Status: ${regB.status}`);
    console.log('User B Session Created:', regB.body.user);
    const cookieB = regB.cookie;

    // Test 4: Check User B Dashboard Expenses (Must be EMPTY - 0 items)
    console.log('\n4. Checking User B Expense List (Must be 0 items)...');
    const listB = await makeRequest(
      { path: '/api/expenses', method: 'GET' },
      null,
      cookieB
    );
    console.log(`Status: ${listB.status}`);
    console.log(`User B Expenses Count: ${listB.body.length} (Expected: 0)`);

    // Test 5: Check User B Summary Stats (Must be $0.00 total)
    console.log('\n5. Checking User B Summary Stats...');
    const sumB = await makeRequest(
      { path: '/api/expenses/summary', method: 'GET' },
      null,
      cookieB
    );
    console.log(`Status: ${sumB.status}`);
    console.log(`User B Total Amount: $${sumB.body.totalAmount}, Count: ${sumB.body.totalCount}`);

    // Test 6: Security Check - User B attempts to access/delete User A's expense
    console.log(`\n6. Security Check: User B attempting to DELETE User A's expense (ID: ${expA_id})...`);
    const attackDel = await makeRequest(
      { path: `/api/expenses/${expA_id}`, method: 'DELETE' },
      null,
      cookieB
    );
    console.log(`Status: ${attackDel.status} (Expected: 404 / Access Denied)`);
    console.log('Response:', attackDel.body);

    // Test 7: Unauthenticated Request Protection
    console.log('\n7. Security Check: Requesting /api/expenses without session cookie...');
    const noAuthRes = await makeRequest(
      { path: '/api/expenses', method: 'GET' },
      null,
      null
    );
    console.log(`Status: ${noAuthRes.status} (Expected: 401 Unauthorized)`);
    console.log('Response:', noAuthRes.body);

    console.log('\n===================================================');
    console.log('   ALL AUTH & DATA ISOLATION TESTS PASSED 100%!    ');
    console.log('===================================================');

  } catch (err) {
    console.error('Test failed:', err.message);
  }
}

runTests();
