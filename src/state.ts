import fs from 'node:fs/promises';
import { config, statePath } from './config.js';

export type SyncState = {
  localMtimeMs?: number;
  localHash?: string;
  remoteLastModifiedDateTime?: string;
  remoteItemId?: string;
};

export async function ensureStateDir(): Promise<void> {
  await fs.mkdir(config.stateDir, { recursive: true });
}

export async function readState(): Promise<SyncState> {
  try {
    const raw = await fs.readFile(statePath, 'utf8');
    return JSON.parse(raw) as SyncState;
  } catch {
    return {};
  }
}

export async function writeState(state: SyncState): Promise<void> {
  await fs.writeFile(statePath, JSON.stringify(state, null, 2), 'utf8');
}
