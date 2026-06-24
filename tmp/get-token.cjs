const http = require('http');
function req(method, path, body, token) {
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
  const login = await req('POST', '/api/v1/auth/admin/login', {
    email: 'dipjit.admin@freeshop.com',
    password: 'Admin@12345',
    adminSecretKey: '444488888888',
  });
  console.log('login status:', login.status);
  const json = JSON.parse(login.body);
  const token = json.data?.tokens?.accessToken;
  console.log('token:', token);
  if (token) {
    require('fs').writeFileSync('tmp/admin-token.txt', token);
    console.log('saved to tmp/admin-token.txt');
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
