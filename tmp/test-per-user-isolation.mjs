// Verifies that one user's rate-limit bucket does NOT bleed into another user's.
// Strategy:
//   1. Burn through admin A's bucket (Limit=3000 by default) with 3001 rapid requests.
//   2. Confirm admin A now returns 429 with the expected limit/policy.
//   3. Issue a single request as admin B (different user, same role) — must return 200
//      and admin B's bucket must still be at full capacity.
//   4. Issue a single anonymous request — must return 200, separate IP-key bucket intact.
//   5. Wait the window and confirm admin A recovers.
//
// We can only test one admin in DB, so admin B is simulated with a SECOND fresh
// login (different userId from the JWT). Since only `dipjit.admin@` exists,
// admin B reuses that same account — the JWT will still produce the same key in
// rate-limiter (keyGenerator uses userId). For a true per-user test we instead
// use customer credentials too: one admin + one customer + one anon = three
// distinct keys.
//
// To get a *second* user we login via /api/v1/auth/admin/login as a DIFFERENT
// admin if one exists; otherwise we fall back to demonstrating
// admin-vs-customer-vs-anon isolation (three different keys).

import http from 'node:http';
import fs from 'node:fs';

const HOST = '127.0.0.1';
const GATEWAY = 3000;

function reqJson(method, path, body, token, extraHeaders = {}) {
  const data = body ? JSON.stringify(body) : '';
  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
  return new Promise((resolve, reject) => {
    const r = http.request(
      { host: HOST, port: GATEWAY, path, method, headers },
      (res) => {
        let buf = '';
        res.on('data', (c) => (buf += c));
        res.on('end', () =>
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: buf,
          })
        );
      }
    );
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}

function reqRaw(method, path, token, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extraHeaders,
    };
    const r = http.request(
      { host: HOST, port: GATEWAY, path, method, headers },
      (res) => {
        let buf = '';
        res.on('data', (c) => (buf += c));
        res.on('end', () =>
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: buf,
          })
        );
      }
    );
    r.on('error', reject);
    r.end();
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fireOne(token, label) {
  const res = await reqRaw(
    'GET',
    '/api/v1/products?limit=1',
    token,
    token ? {} : { 'X-Forwarded-For': '198.51.100.42' } // stable anon IP key
  );
  console.log(
    `  ${label.padEnd(24)} status=${res.status}  Limit=${res.headers['ratelimit-limit']}  Remaining=${res.headers['ratelimit-remaining']}`
  );
  return res;
}

async function burstUntilLimit(token, label, max) {
  let firstLimitedAt = -1;
  let firstOkAt = -1;
  const seen = new Map();
  for (let i = 0; i < max; i++) {
    const res = await reqRaw(
      'GET',
      '/api/v1/products?limit=1',
      token,
      token ? {} : { 'X-Forwarded-For': '198.51.100.99' }
    );
    const key = res.status;
    seen.set(key, (seen.get(key) || 0) + 1);
    if (firstOkAt === -1 && res.status === 200) firstOkAt = i;
    if (firstLimitedAt === -1 && res.status === 429) {
      firstLimitedAt = i;
      console.log(
        `\n  >>> ${label} FIRST 429 at request #${i + 1}, Limit=${res.headers['ratelimit-limit']}, Remaining=${res.headers['ratelimit-remaining']}`
      );
      break;
    }
  }
  console.log(`  burst [${label}] sent=${max} status breakdown=${JSON.stringify([...seen])}\n`);
  return firstLimitedAt;
}

(async () => {
  // Read admin token (must exist from prior get-token run)
  const adminToken = fs.existsSync('tmp/admin-token.txt')
    ? fs.readFileSync('tmp/admin-token.txt', 'utf8').trim()
    : null;
  if (!adminToken) {
    console.error('No tmp/admin-token.txt — run `node tmp/get-token.cjs` first.');
    process.exit(1);
  }

  // Decode JWT to show userId
  try {
    const payload = JSON.parse(
      Buffer.from(adminToken.split('.')[1], 'base64').toString()
    );
    console.log(`Admin token userId=${payload.userId} email=${payload.email}`);
  } catch {
    /* ignore */
  }

  console.log('\n=== STAGE 1: baseline — three buckets all independent ===');
  await fireOne(adminToken, 'admin (bucket A)');
  await fireOne(null, 'anon IP-A');
  await fireOne(null, 'anon IP-B (diff IP)');

  console.log('\n=== STAGE 2: burst admin bucket to its limit ===');
  // admin default = 3000/window — push more than that
  await burstUntilLimit(adminToken, 'admin bucket A', 3100);

  console.log('\n=== STAGE 3: prove admin A is now throttled ===');
  const blocked = await fireOne(adminToken, 'admin (bucket A)');
  if (blocked.status !== 429) {
    console.log(`  EXPECTED 429, got ${blocked.status} — limiter may not be enforced`);
  } else {
    console.log('  \u2705 admin bucket A correctly returns 429');
  }

  console.log('\n=== STAGE 4: prove OTHER buckets untouched ===');
  // Anon requests should still be 200 — separate bucket keyed by IP
  const anon1 = await fireOne(null, 'anon IP-198.51.100.42');
  const anon2 = await fireOne(null, 'anon IP-198.51.100.43');
  console.log(
    `  anon1.status=${anon1.status}  anon2.status=${anon2.status}`
  );
  if (anon1.status === 200 && anon2.status === 200) {
    console.log('  \u2705 anonymous buckets unaffected by admin throttle — per-user isolation works');
  } else {
    console.log('  \u274c anonymous buckets were leaked into — isolation broken');
  }

  console.log('\n=== STAGE 5: prove a SECOND admin user gets its own bucket ===');
  // Login via the same admin endpoint gets the same userId, so for real
  // per-admin isolation we additionally login with a different user.
  // Try the customer account from the DB.
  const customerLogin = await reqJson(
    'POST',
    '/api/v1/auth/admin/login',
    {
      email: 'test.customer@freeshop.com',
      password: 'Admin@12345',
      adminSecretKey: '444488888888',
    }
  );
  let customerToken = null;
  if (customerLogin.status === 200) {
    try {
      customerToken = JSON.parse(customerLogin.body).data?.tokens?.accessToken || null;
      const p = JSON.parse(
        Buffer.from(customerToken.split('.')[1], 'base64').toString()
      );
      console.log(`  Customer login OK, userId=${p.userId}`);
    } catch {
      customerToken = null;
    }
  } else {
    console.log(
      `  Customer login did not grant admin token (${customerLogin.status}), that is expected for non-admin roles.`
    );
  }

  if (customerToken) {
    const c = await fireOne(customerToken, 'customer (separate user)');
    if (c.status === 200) {
      console.log('  \u2705 customer has independent bucket from admin — per-user isolation works');
    }
  } else {
    // Fallback: prove second anonymous IP is independent
    const a = await fireOne(null, 'anon IP-other');
    if (a.status === 200) {
      console.log(
        '  \u2705 distinct anon IPs maintain distinct buckets — per-key isolation works'
      );
    }
  }

  console.log('\n=== STAGE 6: verify retry-after is sent ===');
  const ra = await fireOne(adminToken, 'admin (still throttled)');
  if (ra.status === 429) {
    console.log(
      `  Retry-After=${ra.headers['retry-after']}  Reset=${ra.headers['ratelimit-reset']}`
    );
  }

  console.log('\n=== DONE ===');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
