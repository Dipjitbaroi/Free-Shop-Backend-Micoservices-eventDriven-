const http = require('http');
const fs = require('fs');

const REDIS_PWD = 'Freesh0p_Rd_S3cur3_2026';
const TOKEN = fs.readFileSync('tmp/admin-token.txt', 'utf8').trim();

function httpReq(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : '';
    const r = http.request(
      {
        host: '127.0.0.1',
        port: 3000,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
      (res) => {
        let buf = '';
        res.on('data', (c) => (buf += c));
        res.on('end', () => resolve({ status: res.statusCode, body: buf }));
      }
    );
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}

(async () => {
  // 1) Try docker exec to clear redis (no module deps)
  const { execSync } = require('child_process');
  try {
    const out = execSync(
      `docker exec -e REDISCLI_AUTH=${REDIS_PWD} freeshop-redis-dev redis-cli KEYS "dashboard:*"`,
      { encoding: 'utf8' }
    );
    console.log('dashboard keys before:', JSON.stringify(out));
    if (out.trim()) {
      const keys = out.trim().split('\n');
      for (const k of keys) {
        if (!k) continue;
        execSync(
          `docker exec -e REDISCLI_AUTH=${REDIS_PWD} freeshop-redis-dev redis-cli DEL "${k}"`,
          { encoding: 'utf8' }
        );
        console.log('deleted', k);
      }
    }
  } catch (e) {
    console.log('redis clear error (continuing):', e.message);
  }

  // 2) Call dashboard
  const r = await httpReq(
    'GET',
    '/api/v1/analytics/section/platform/dashboard?startDate=2026-06-01&endDate=2026-06-09',
    null,
    TOKEN
  );
  console.log('dashboard status:', r.status);
  console.log('dashboard body:', r.body);
})().catch((e) => {
  console.error('ERR:', e);
  process.exit(1);
});
