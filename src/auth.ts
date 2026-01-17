import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import http from 'node:http';
import { URL } from 'node:url';
import { PublicClientApplication, type Configuration } from '@azure/msal-node';
import { cachePath, config, scopes } from './config.js';

const authority = `https://login.microsoftonline.com/${config.tenantId}`;

const cachePlugin = {
  beforeCacheAccess: async (cacheContext: {
    cacheHasChanged: boolean;
    tokenCache: { deserialize: (cache: string) => void };
  }) => {
    if (!fsSync.existsSync(cachePath)) {
      return;
    }
    const cache = await fs.readFile(cachePath, 'utf8');
    cacheContext.tokenCache.deserialize(cache);
  },
  afterCacheAccess: async (cacheContext: {
    cacheHasChanged: boolean;
    tokenCache: { serialize: () => string };
  }) => {
    if (cacheContext.cacheHasChanged) {
      const cache = cacheContext.tokenCache.serialize();
      await fs.writeFile(cachePath, cache, 'utf8');
    }
  },
};

const msalConfig: Configuration = {
  auth: {
    clientId: config.clientId,
    authority,
  },
  cache: {
    cachePlugin,
  },
};

const msalClient = new PublicClientApplication(msalConfig);

async function persistTokenCache(): Promise<void> {
  const cache = msalClient.getTokenCache().serialize();
  await fs.writeFile(cachePath, cache, 'utf8');
}

async function waitForAuthCode(redirect: string): Promise<string> {
  const redirectUrl = new URL(redirect);

  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      if (!req.url) {
        res.writeHead(400);
        res.end('Missing URL');
        return;
      }

      const requestUrl = new URL(req.url, redirectUrl.origin);
      if (requestUrl.pathname !== redirectUrl.pathname) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }

      const code = requestUrl.searchParams.get('code');
      if (!code) {
        res.writeHead(400);
        res.end('Missing code');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Authentication complete. You can close this window.');
      server.close();
      resolve(code);
    });

    server.on('error', (err) => {
      reject(err);
    });

    server.listen(Number(redirectUrl.port || 80), redirectUrl.hostname);
  });
}

export async function acquireToken(): Promise<string> {
  await fs.mkdir(config.authDir, { recursive: true });

  const accounts = await msalClient.getTokenCache().getAllAccounts();
  if (accounts.length > 0) {
    try {
      const result = await msalClient.acquireTokenSilent({
        account: accounts[0],
        scopes,
      });
      if (result?.accessToken) {
        await persistTokenCache();
        return result.accessToken;
      }
    } catch {
      // fall through to interactive
    }
  }

  const authCodeUrl = await msalClient.getAuthCodeUrl({
    scopes,
    redirectUri: config.redirectUri,
  });

  console.log('Open this URL in your browser to authorize:');
  console.log(authCodeUrl);

  const code = await waitForAuthCode(config.redirectUri);
  const tokenResult = await msalClient.acquireTokenByCode({
    code,
    scopes,
    redirectUri: config.redirectUri,
  });

  if (!tokenResult?.accessToken) {
    throw new Error('Failed to acquire access token');
  }

  await persistTokenCache();
  return tokenResult.accessToken;
}
