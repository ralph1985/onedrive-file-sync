import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import crypto from 'node:crypto';
import { downloadFile, getRemoteMetadata, uploadFile } from './graph.js';
import { readState, writeState } from './state.js';

async function sha256File(filePath: string): Promise<string> {
  const data = await fs.readFile(filePath);
  return crypto.createHash('sha256').update(data).digest('hex');
}

function parseRemoteMtime(remoteItem: { lastModifiedDateTime?: string } | null): number {
  if (!remoteItem?.lastModifiedDateTime) {
    return 0;
  }
  const parsed = Date.parse(remoteItem.lastModifiedDateTime);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function isLocalNewer(localMtimeMs: number, remoteMtimeMs: number): boolean {
  return localMtimeMs > remoteMtimeMs + 1000;
}

function isRemoteNewer(localMtimeMs: number, remoteMtimeMs: number): boolean {
  return remoteMtimeMs > localMtimeMs + 1000;
}

export type SyncPaths = {
  localFilePath: string;
  remoteFilePath: string;
};

export async function syncOnce(token: string, paths: SyncPaths): Promise<void> {
  const state = await readState();

  const localExists = fsSync.existsSync(paths.localFilePath);
  const remoteItem = await getRemoteMetadata(token, paths.remoteFilePath);
  const remoteExists = Boolean(remoteItem);

  if (!localExists && !remoteExists) {
    console.error('Neither local nor remote file exists. Nothing to sync.');
    process.exit(1);
  }

  if (localExists && !remoteExists) {
    console.log('Remote missing. Uploading local file.');
    await uploadFile(token, paths.localFilePath, paths.remoteFilePath);
  } else if (!localExists && remoteExists) {
    console.log('Local missing. Downloading remote file.');
    await downloadFile(token, paths.remoteFilePath, paths.localFilePath);
  } else if (localExists && remoteExists) {
    const stat = await fs.stat(paths.localFilePath);
    const localMtimeMs = stat.mtimeMs;
    const remoteMtimeMs = parseRemoteMtime(remoteItem);

    if (isLocalNewer(localMtimeMs, remoteMtimeMs)) {
      console.log('Local is newer. Uploading.');
      await uploadFile(token, paths.localFilePath, paths.remoteFilePath);
    } else if (isRemoteNewer(localMtimeMs, remoteMtimeMs)) {
      console.log('Remote is newer. Downloading.');
      await downloadFile(token, paths.remoteFilePath, paths.localFilePath);
    } else {
      console.log('No changes detected.');
    }
  }

  if (fsSync.existsSync(paths.localFilePath)) {
    const stat = await fs.stat(paths.localFilePath);
    state.localMtimeMs = stat.mtimeMs;
    state.localHash = await sha256File(paths.localFilePath);
  }

  if (remoteItem?.lastModifiedDateTime) {
    state.remoteLastModifiedDateTime = remoteItem.lastModifiedDateTime;
  }
  if (remoteItem?.id) {
    state.remoteItemId = remoteItem.id;
  }

  await writeState(state);
}
