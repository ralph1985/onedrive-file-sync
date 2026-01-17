import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REQUIRED_ENV = ['LOCAL_FILE_PATH', 'ONEDRIVE_FILE_PATH', 'CLIENT_ID', 'TENANT_ID', 'REDIRECT_URI'] as const;

type EnvKey = (typeof REQUIRED_ENV)[number];

function mustGetEnv(key: EnvKey): string {
  const value = process.env[key];
  if (!value) {
    console.error(`Missing ${key} in .env`);
    process.exit(1);
  }
  return value;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

export const config = {
  localFilePath: mustGetEnv('LOCAL_FILE_PATH'),
  remoteFilePath: mustGetEnv('ONEDRIVE_FILE_PATH'),
  clientId: mustGetEnv('CLIENT_ID'),
  tenantId: mustGetEnv('TENANT_ID'),
  redirectUri: mustGetEnv('REDIRECT_URI'),
  projectRoot,
  authDir: path.join(projectRoot, '.auth'),
  stateDir: path.join(projectRoot, '.state'),
};

export const cachePath = path.join(config.authDir, 'msal-cache.json');
export const statePath = path.join(config.stateDir, 'state.json');

export const scopes = ['Files.ReadWrite', 'offline_access'];
