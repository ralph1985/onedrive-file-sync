import 'dotenv/config';
import fs from 'node:fs/promises';
import { config } from './config.js';
import { acquireToken } from './auth.js';
import { ensureStateDir } from './state.js';
import { syncOnce } from './sync.js';

async function ensureDirs(): Promise<void> {
  await fs.mkdir(config.authDir, { recursive: true });
  await ensureStateDir();
}

async function main(): Promise<void> {
  await ensureDirs();
  const token = await acquireToken();
  await syncOnce(token);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
