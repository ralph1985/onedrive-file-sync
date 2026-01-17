# Project Guidelines

## Overview

- Single-file bidirectional sync for OneDrive Personal via Microsoft Graph.
- Local-only automation intended for cron usage.
- Auth uses MSAL with auth code flow and token cache under `.auth/`.
- State is stored under `.state/` (mtime/hash + remote metadata).

## Project Structure

- `src/config.ts`: env + paths.
- `src/auth.ts`: OAuth flow and token cache.
- `src/graph.ts`: Graph API helpers (metadata, download, upload).
- `src/sync.ts`: sync logic (last write wins).
- `src/state.ts`: local state read/write.
- `src/index.ts`: entry point.
- `.env.example`: required config keys.
- `run.sh`: cron-friendly wrapper.

## Build, Lint, and Typecheck

- `npm install`: install dependencies.
- `npm run build`: compile TypeScript to `dist/`.
- `npm run typecheck`: TS typecheck without emit.
- `npm run lint`: ESLint.
- `npm run format` / `npm run format:check`: Prettier.

## Dependency Management

- Use exact versions (no `^` in `package.json`).

## Coding Style

- ESLint + Prettier are enforced via Husky + lint-staged.
- Prefer 2 spaces and single quotes (Prettier config).

## Security Notes

- Never commit `.env` or tokens.
- `.auth/` and `.state/` are ignored and stay local.

## Commit Guidelines

- Conventional commits (`feat:`, `fix:`, `chore:`, etc.).
- Commit messages in English.
