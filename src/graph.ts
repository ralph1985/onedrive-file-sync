import fs from 'node:fs/promises';
import path from 'node:path';

export type DriveItem = {
  id: string;
  name: string;
  lastModifiedDateTime?: string;
};

function encodeDrivePath(rawPath: string): string {
  const trimmed = rawPath.replace(/^\/+/, '');
  return encodeURI(trimmed);
}

async function graphRequest<T>(token: string, url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
  });

  if (response.status === 404) {
    throw new Error('REMOTE_NOT_FOUND');
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Graph error ${response.status}: ${text}`);
  }

  return (await response.json()) as T;
}

export async function getRemoteMetadata(token: string, remotePath: string): Promise<DriveItem | null> {
  const url = `https://graph.microsoft.com/v1.0/me/drive/root:/${encodeDrivePath(remotePath)}?select=id,name,lastModifiedDateTime`;
  try {
    return await graphRequest<DriveItem>(token, url);
  } catch (err) {
    if (err instanceof Error && err.message === 'REMOTE_NOT_FOUND') {
      return null;
    }
    throw err;
  }
}

export async function downloadFile(token: string, remotePath: string, localPath: string): Promise<void> {
  const url = `https://graph.microsoft.com/v1.0/me/drive/root:/${encodeDrivePath(remotePath)}:/content`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Download failed ${response.status}: ${text}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  await fs.mkdir(path.dirname(localPath), { recursive: true });
  await fs.writeFile(localPath, Buffer.from(arrayBuffer));
}

export async function uploadFile(token: string, localPath: string, remotePath: string): Promise<void> {
  const url = `https://graph.microsoft.com/v1.0/me/drive/root:/${encodeDrivePath(remotePath)}:/content`;
  const content = await fs.readFile(localPath);

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/octet-stream',
    },
    body: content,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Upload failed ${response.status}: ${text}`);
  }
}
