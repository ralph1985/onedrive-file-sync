import fs from 'node:fs/promises';
import { config } from './config.js';
import { acquireToken } from './auth.js';
import { ensureStateDir } from './state.js';
import { type SyncPaths, syncOnce } from './sync.js';

async function ensureDirs(): Promise<void> {
  await fs.mkdir(config.authDir, { recursive: true });
  await ensureStateDir();
}

export async function runApp(paths: SyncPaths): Promise<void> {
  await ensureDirs();
  const token = await acquireToken();
  await syncOnce(token, paths);
}
