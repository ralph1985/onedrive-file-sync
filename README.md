# OneDrive File Sync (Personal)

Bidirectional sync for a single file using Microsoft Graph. Designed for local cron usage with "last write wins".

## Setup

1. Register an app in Azure Portal (Microsoft Entra ID).
2. Add a redirect URI (e.g. `http://localhost:53682`).
3. Ensure delegated permissions include `Files.ReadWrite`.
4. Copy `.env.example` to `.env` and fill values.

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
- The script assumes the OneDrive path is relative to root (e.g. `Documents/mi.txt`).
