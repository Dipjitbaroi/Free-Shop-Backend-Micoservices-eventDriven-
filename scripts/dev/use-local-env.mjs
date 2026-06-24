#!/usr/bin/env node
// Activates the LOCAL values in the root .env file.
// Run with: pnpm env:local   (or: node scripts/dev/use-local-env.mjs)
//
// Strategy: for every line of the form
//     KEY=<docker-value>
//   where the preceding 1-2 lines are commented hints starting with
//     # DOCKER: KEY=...
//     # LOCAL : KEY=...
//   we replace the active value with the # LOCAL : one.
// Lines that don't have such a hint pair are left untouched.

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

// Scan with a 3-line sliding window: (prev2, prev1, current).
for (let i = 0; i < lines.length; i++) {
  const cur = lines[i];
  // Match active assignment: KEY=VALUE  (no leading whitespace, not commented)
  const m = cur.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (!m) continue;
  const [, key, curVal] = m;

  // Look back up to 3 lines for a "# LOCAL : KEY=..." hint
  let localVal = null;
  for (let j = Math.max(0, i - 3); j < i; j++) {
    const hint = lines[j].match(/^#\s*LOCAL\s*:\s*([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (hint && hint[1] === key) {
      localVal = hint[2];
      break;
    }
  }
  if (localVal === null) continue;
  if (curVal === localVal) continue; // already local

  lines[i] = `${key}=${localVal}`;
  switched++;
}

if (switched === 0) {
  console.log('• .env already in LOCAL mode (no changes).');
} else {
  writeFileSync(envPath, lines.join('\n'), 'utf8');
  console.log(`✓ Switched ${switched} value(s) to LOCAL in .env`);
}
