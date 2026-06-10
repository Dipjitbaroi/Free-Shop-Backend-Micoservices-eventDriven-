// Clear all dashboard cache keys
const { execSync } = require('child_process');

// Read password from .env to avoid quoting issues
const fs = require('fs');
const envText = fs.readFileSync('d:/GitHub/Free-Shop-Backend-Micoservices(eventDriven)/.env', 'utf8');
const m = envText.match(/^REDIS_PASSWORD=(.*)$/m);
const auth = m ? m[1].trim() : '';
console.log('Auth length:', auth.length, 'starts with space:', auth[0] === ' ');

function redisCli(cmd) {
  return execSync(
    `docker exec freeshop-redis-dev sh -c "REDISCLI_AUTH='${auth}' redis-cli ${cmd}"`,
    { encoding: 'utf8', shell: 'cmd.exe' }
  ).trim();
}

console.log('=== Listing dashboard:* keys ===');
const keys = redisCli('KEYS "dashboard:*"');
console.log(keys || '(none)');

if (keys && !keys.includes('NOAUTH') && !keys.includes('WRONGPASS')) {
  const list = keys.split('\n').filter(Boolean);
  for (const k of list) {
    console.log(`Deleting: ${k}`);
    redisCli(`DEL "${k}"`);
  }
}

console.log('\n=== After clear ===');
console.log(redisCli('KEYS "dashboard:*"') || '(empty)');
