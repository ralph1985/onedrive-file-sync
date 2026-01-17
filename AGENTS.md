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

## Gestion de tareas y horas

- Antes de empezar, identifica el `projectId` en `../../dashboard/data/projects.json`.
- Busca si ya existe una tarea "En curso" en `../../dashboard/data/projects-tasks.json` para ese `projectId`.
- Si existe, registra el tiempo en `../../dashboard/data/task-entries.json` con `taskId`, `date` (`dd/mm/aaaa`), `hours` y `note`; anade siempre una nota en `../../dashboard/data/task-notes.json`.
- Si no existe, crea una nueva tarea (recomendado: `node ../../dashboard/scripts/add-task.js` desde el monorepo) o edita a mano en `projects-tasks.json` con `id` incremental, `title`, `projectId`, `phase`, `status`, `ownerId`, `startDate`, `endDate`, y luego anade la entrada de horas en `task-entries.json`.

## Commit Guidelines

- Conventional commits (`feat:`, `fix:`, `chore:`, etc.).
- Use Commitizen via `npm run commit` for interactive commit messages.
- Commit messages in English.
