#!/usr/bin/env node
// Activates the DOCKER values in the root .env file.
// Run with: pnpm env:docker   (or: node scripts/dev/use-docker-env.mjs)
//
// Strategy: for every line of the form
//     KEY=<local-value>
//   where the preceding 1-2 lines are commented hints starting with
//     # DOCKER: KEY=...
//     # LOCAL : KEY=...
//   we replace the active value with the # DOCKER: one.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '..', '.env');

if (!existsSync(envPath)) {
  console.error(`✗ .env not found at ${envPath}`);
  process.exit(1);
}

const raw = readFileSync(envPath, 'utf8');
const lines = raw.split(/\r?\n/);

let switched = 0;

for (let i = 0; i < lines.length; i++) {
  const cur = lines[i];
  const m = cur.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (!m) continue;
  const [, key, curVal] = m;

  let dockerVal = null;
  for (let j = Math.max(0, i - 3); j < i; j++) {
    const hint = lines[j].match(/^#\s*DOCKER\s*:\s*([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (hint && hint[1] === key) {
      dockerVal = hint[2];
      break;
    }
  }
  if (dockerVal === null) continue;
  if (curVal === dockerVal) continue; // already docker

  lines[i] = `${key}=${dockerVal}`;
  switched++;
}

if (switched === 0) {
  console.log('• .env already in DOCKER mode (no changes).');
} else {
  writeFileSync(envPath, lines.join('\n'), 'utf8');
  console.log(`✓ Switched ${switched} value(s) to DOCKER in .env`);
}
