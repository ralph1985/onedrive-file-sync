# Project Guidelines

## Overview

- Single-file bidirectional sync for OneDrive Personal via Microsoft Graph.
- Local-only automation intended for cron usage.
- Auth uses MSAL with auth code flow and token cache under `.auth/`.
- Graph access uses the app folder scope (`Files.ReadWrite.AppFolder`) to limit access.
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

## Task and Time Tracking

- Before starting, identify the `projectId` in `../../dashboard/data/projects.json`.
- Check if there is an "En curso" task in `../../dashboard/data/projects-tasks.json` for that `projectId`.
- If it exists, log time in `../../dashboard/data/task-entries.json` with `taskId`, `date` (`dd/mm/aaaa`), `hours`, and `note`; always add a note in `../../dashboard/data/task-notes.json`.
- If it doesn't exist, create a new task (recommended: `node ../../dashboard/scripts/add-task.js` from the monorepo) or edit `projects-tasks.json` manually with incremental `id`, `title`, `projectId`, `phase`, `status`, `ownerId`, `startDate`, `endDate`, then add the hours entry in `task-entries.json`.

## Commit Guidelines

- Conventional commits (`feat:`, `fix:`, `chore:`, etc.).
- Use Commitizen via `npm run commit` for interactive commit messages.
- Commit messages in English.
