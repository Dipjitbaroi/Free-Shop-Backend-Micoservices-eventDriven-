#!/usr/bin/env node
/**
 * run-services.mjs
 *
 * Spawns all 10 services natively while overriding docker-internal
 * hostnames in the root `.env` (e.g. `postgres` -> `localhost`,
 * `auth-service` -> `localhost`) so a single centralized .env works
 * for BOTH `docker compose up` AND native `pnpm dev:services`.
 *
 * The root `.env` is the single source of truth and is NOT modified.
 * Overrides are applied only to the child process environment.
 */

import { spawn } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..', '..');

// ---------- 1. Load root .env (single source of truth) ----------
const envPath = resolve(ROOT, '.env');
if (!existsSync(envPath)) {
  console.error(`[dev] .env not found at ${envPath}`);
  console.error('[dev] Run:  Copy-Item .env.example .env   (or  cp .env.example .env)');
  process.exit(1);
}

const env = {};
for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq < 0) continue;
  const key = trimmed.slice(0, eq).trim();
  let val = trimmed.slice(eq + 1).trim();
  // strip optional surrounding quotes
  if ((val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  env[key] = val;
}

// ---------- 2. Apply localhost overrides for native runs ----------
// Postgres is already correct (DATABASE_URLs use @localhost), but
// POSTGRES_HOST is still "postgres" -> flip it.
env.POSTGRES_HOST  = 'localhost';
env.REDIS_HOST     = 'localhost';
env.RABBITMQ_HOST  = 'localhost';

// Rebuild RABBITMQ_URL so user/pass match root .env but host is localhost.
if (env.RABBITMQ_USER && env.RABBITMQ_PASS) {
  env.RABBITMQ_URL =
    `amqp://${env.RABBITMQ_USER}:${env.RABBITMQ_PASS}@localhost:${env.RABBITMQ_PORT || 5672}/${env.RABBITMQ_VHOST || ''}`;
}

// Service-to-service URLs: docker names -> localhost.
const svcUrlFix = (k, port) => {
  if (env[k]) env[k] = `http://localhost:${port}`;
};
svcUrlFix('AUTH_SERVICE_URL',        env.AUTH_SERVICE_PORT        || 3001);
svcUrlFix('USER_SERVICE_URL',        env.USER_SERVICE_PORT        || 3002);
svcUrlFix('PRODUCT_SERVICE_URL',     env.PRODUCT_SERVICE_PORT     || 3003);
svcUrlFix('ORDER_SERVICE_URL',       env.ORDER_SERVICE_PORT       || 3004);
svcUrlFix('PAYMENT_SERVICE_URL',     env.PAYMENT_SERVICE_PORT     || 3005);
svcUrlFix('INVENTORY_SERVICE_URL',   env.INVENTORY_SERVICE_PORT   || 3006);
svcUrlFix('VENDOR_SERVICE_URL',      env.VENDOR_SERVICE_PORT      || 3007);
svcUrlFix('NOTIFICATION_SERVICE_URL',env.NOTIFICATION_SERVICE_PORT|| 3008);
svcUrlFix('ANALYTICS_SERVICE_URL',   env.ANALYTICS_SERVICE_PORT   || 3009);

// Mongo is not part of docker-compose.dev.yml; leave values alone so the
// service fails loud & clear if it tries to use it.
// (You can start a mongo container and keep MONGODB_HOST=mongo only when
// you also run analytics in Docker. For native runs, set MONGODB_HOST=localhost
// in your .env when you spin up a Mongo container on the host.)

// Forward current process env so PATH, TMP, etc. are preserved.
const childEnv = { ...process.env, ...env };

// ---------- 3. Service list ----------
// Note: some packages are published as @freeshop/* and others as bare names
// (inventory, order, payment, user). Use whatever matches their package.json name.
const services = [
  { name: 'gateway',       filter: '@freeshop/api-gateway',        color: 'blue' },
  { name: 'auth',          filter: '@freeshop/auth-service',       color: 'green' },
  { name: 'user',          filter: 'user-service',                 color: 'yellow' },
  { name: 'product',       filter: '@freeshop/product-service',    color: 'magenta' },
  { name: 'order',         filter: 'order-service',                color: 'cyan' },
  { name: 'payment',       filter: 'payment-service',              color: 'red' },
  { name: 'inventory',     filter: 'inventory-service',            color: 'white' },
  { name: 'vendor',        filter: '@freeshop/vendor-service',     color: 'gray' },
  { name: 'notification',  filter: '@freeshop/notification-service', color: 'pink' },
  { name: 'analytics',     filter: '@freeshop/analytics-service',  color: 'orange' },
];

// ---------- 4. Spawn ----------
const procs = [];
const colors = {
  reset: '\x1b[0m', blue: '\x1b[34m', green: '\x1b[32m', yellow: '\x1b[33m',
  magenta: '\x1b[35m', cyan: '\x1b[36m', red: '\x1b[31m', white: '\x1b[37m',
  gray: '\x1b[90m', pink: '\x1b[95m', orange: '\x1b[38;5;208m',
};
const c = (name) => colors[name] || colors.reset;

for (const svc of services) {
  const proc = spawn(
    process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
    ['--filter', svc.filter, 'dev'],
    { cwd: ROOT, env: childEnv, shell: process.platform === 'win32' }
  );
  procs.push({ svc, proc });

  const tag = `[${svc.name}]`.padEnd(15);
  const color = c(svc.color);

  const pipe = (stream, prefix) => stream.on('data', (chunk) => {
    const text = chunk.toString();
    for (const line of text.split(/\r?\n/)) {
      if (!line) continue;
      process.stdout.write(`${color}${tag}${colors.reset} ${line}\n`);
    }
  });
  pipe(proc.stdout, 'out');
  pipe(proc.stderr, 'err');

  proc.on('exit', (code) => {
    console.log(`${color}${tag}${colors.reset} exited with code ${code}`);
  });
}

// ---------- 5. Shutdown ----------
const shutdown = (sig) => {
  console.log(`\n[dev] received ${sig}, stopping all services...`);
  for (const { proc } of procs) {
    try { proc.kill('SIGTERM'); } catch {}
  }
  setTimeout(() => process.exit(0), 500);
};
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
