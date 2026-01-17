# OneDrive File Sync (Personal)

Bidirectional sync for a single file using Microsoft Graph. Designed for local cron usage with "last write wins".
This variant uses the app folder scope, so the app only sees its own OneDrive folder.

## Setup

1. Register an app in Azure Portal (Microsoft Entra ID).
2. Add a redirect URI (e.g. `http://localhost:53682`).
3. Ensure delegated permissions include `Files.ReadWrite.AppFolder`.
4. Copy `.env.example` to `.env` and fill values.

## Azure configuration (step-by-step)

1. Sign in at `https://portal.azure.com`.
2. Switch directory to your Azure Free tenant (avatar → **Switch directory**).
3. Go to **Microsoft Entra ID** → **App registrations** → **New registration**.
4. Name: `onedrive-file-sync` (or any name).
5. Supported account types:
   - Choose **Personal Microsoft accounts only** (or the mixed option if you need both).
6. Redirect URI:
   - Platform: **Mobile and desktop applications (Windows, UWP, Console...)**
   - URI: `http://localhost:53682`
7. After creation, go to **Authentication**:
   - **Allow public client flows = Yes**
   - Ensure the redirect URI is under **Mobile and desktop applications**.
   - If a **Web** platform exists, remove it to avoid `client_secret` errors.
8. Go to **API permissions**:
   - **Add a permission** → **Microsoft Graph** → **Delegated permissions**
   - Add **Files.ReadWrite.AppFolder**
9. Copy **Application (client) ID** and set it in `.env` as `CLIENT_ID`.
10. Set `TENANT_ID=consumers` in `.env`.
11. When changing permissions/scopes, delete token cache and re-login:
    ```bash
    rm -rf .auth
    ./run.sh
    ```

## Install & build

Requires Node.js 18+ (for native `fetch`).

```bash
npm install
npm run build
```

## Lint & format

```bash
npm run lint
npm run format
npm run typecheck
```

## Conventional commits

```bash
npm run commit
```

## First run (interactive)

```bash
node dist/index.js
```

The first run will print an auth URL. Open it in a browser to grant access. Tokens are cached in `.auth/`.

## CLI overrides

You can override the `.env` values per run:

```bash
./run.sh --local /path/to/local.db --remote backups/home-manager/local.db
```

## Cron usage

Use the `run.sh` wrapper so the script runs from the project root and loads `.env`.

```bash
./run.sh
```

Example cron (every 5 minutes):

```cron
*/5 * * * * /Users/E054116/BBVA/desarrollo/personal/project-manager/projects/onedrive-file-sync/run.sh >> /tmp/onedrive-file-sync.log 2>&1
```

## Notes

- If both sides change between runs, the newest mtime wins.
- The script assumes the OneDrive path is relative to the app folder (e.g. `data/mi.txt`).
- The app folder appears in OneDrive under `Apps/<app-name>/`.
