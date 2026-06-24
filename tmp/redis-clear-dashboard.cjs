const Redis = require('ioredis');
(async () => {
  const r = new Redis({
    host: '127.0.0.1',
    port: 6379,
    password: 'Freesh0p_Rd_S3cur3_2026',
  });
  const keys = await r.keys('dashboard:*');
  console.log('keys:', keys);
  if (keys.length) {
    const n = await r.del(...keys);
    console.log('deleted:', n);
  }
  await r.quit();
})().catch((e) => { console.error(e); process.exit(1); });
