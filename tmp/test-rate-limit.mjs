// Quick smoke test of the tier-aware rate limiter against the running gateway.
// - Anonymous burst to /api/v1/products (should land in `anonymous` tier, default 300/min)
// - Admin burst to /api/v1/products (should land in `admin` tier, default 3000/min)
// - Customer burst to /api/v1/products (should land in `customer` tier, default 300/min)
//
// We also re-use a previous admin token from tmp/admin-token.txt, and log in as a
// customer to get a token for that tier.

import http from 'node:http';
import fs from 'node:fs';

const HOST = '127.0.0.1';
const GATEWAY = 3000;
const AUTH = 3001;

function req(port, method, path, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : '';
    const r = http.request(
      { host: HOST, port, path, method, headers: { ...headers, ...(data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {}) } },
      (res) => {
        let buf = '';
        res.on('data', (c) => (buf += c));
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: buf }));
      }
    );
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}

async function login(email, password, extra = {}) {
  const r = await req(AUTH, 'POST', '/api/v1/auth/login', {}, { email, password, ...extra });
  if (r.status !== 200 && r.status !== 201) {
    console.error(`login failed for ${email}: ${r.status} ${r.body}`);
    return null;
  }
  const json = JSON.parse(r.body);
  return json?.data?.tokens?.accessToken || json?.data?.accessToken || json?.accessToken;
}

async function burst(label, token, n) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  // Fake XFF so the anonymous key generator picks a stable client IP.
  if (!token) headers['X-Forwarded-For'] = '203.0.113.7';
  const results = [];
  for (let i = 0; i < n; i++) {
    const r = await req(GATEWAY, 'GET', '/api/v1/products?limit=5', headers);
    results.push(r.status);
  }
  const by = results.reduce((acc, s) => ((acc[s] = (acc[s] || 0) + 1), acc), {});
  const first = await req(GATEWAY, 'GET', '/api/v1/products?limit=5', headers);
  const limit = first.headers['ratelimit-limit'];
  const remaining = first.headers['ratelimit-remaining'];
  const policy = first.headers['ratelimit-policy'];
  console.log(`\n[${label}] sent=${n}  status=${JSON.stringify(by)}  Limit=${limit}  Remaining(first)=${remaining}  Policy=${policy}`);
  // Pull tier from log line if available
  return { by, limit, remaining, policy };
}

async function main() {
  // 1. Admin token from file
  let adminToken = null;
  try { adminToken = fs.readFileSync('tmp/admin-token.txt', 'utf8').trim(); } catch {}
  if (!adminToken) {
    adminToken = await login('dipjit.admin@freeshop.com', 'Admin@12345', { adminSecretKey: '444488888888' });
  }
  if (adminToken) console.log('admin token: present');

  // 2. Customer token (login via customer account if one exists)
  let customerToken = null;
  // Try common seed customers
  for (const [email, pw] of [
    ['customer@freeshop.com', 'Customer@123'],
    ['dipjit.customer@freeshop.com', 'Customer@123'],
    ['john.doe@example.com', 'Password@123'],
  ]) {
    customerToken = await login(email, pw);
    if (customerToken) { console.log(`customer token: present (${email})`); break; }
  }

  // 3. Run bursts. Anonymous bursts are cheap; we'll do a smaller N.
  await burst('anonymous  (no token)', null, 10);
  if (customerToken) await burst('customer  (token)', customerToken, 10);
  if (adminToken)    await burst('admin     (token)', adminToken, 10);

  // 4. Hammer products from one IP to confirm tier isolation:
  //    customer bursts should NOT be affected by anonymous bursts and vice versa.
  console.log('\n--- tier-isolation check ---');
  if (customerToken) {
    const r = await req(GATEWAY, 'GET', '/api/v1/products?limit=5', { Authorization: `Bearer ${customerToken}` });
    console.log(`customer after anon burst: ${r.status}  Limit=${r.headers['ratelimit-limit']}  Remaining=${r.headers['ratelimit-remaining']}`);
  }
  if (adminToken) {
    const r = await req(GATEWAY, 'GET', '/api/v1/products?limit=5', { Authorization: `Bearer ${adminToken}` });
    console.log(`admin after anon burst:    ${r.status}  Limit=${r.headers['ratelimit-limit']}  Remaining=${r.headers['ratelimit-remaining']}`);
  }
  const anon = await req(GATEWAY, 'GET', '/api/v1/products?limit=5', { 'X-Forwarded-For': '203.0.113.7' });
  console.log(`anon same IP after burst:  ${anon.status}  Limit=${anon.headers['ratelimit-limit']}  Remaining=${anon.headers['ratelimit-remaining']}`);
}

main().catch((e) => { console.error(e); process.exit(1); });