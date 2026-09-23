# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Fixed

- **Backend dependency installation path (app.json:38-39)**: The `onInstall` and `onUpdate` scripts incorrectly used `cd ..` after building the UI, which walked above the app root directory (`/home/raymondcoetzee/.kiro/crew/apps/`). This caused `npm install --omit=dev` to fail silently (no package.json in parent directory), leaving `backend/node_modules` empty. Fixed to `cd ../backend` so dependencies (`ws`, `express`, `node-pty`) are properly installed.

- **Provider import paths (backend/providers/*.mjs)**: All 5 provider files (`tmux.mjs`, `screen.mjs`, `zellij.mjs`, `herdr.mjs`, `aoe.mjs`) had incorrect relative imports:
  - `import { Provider } from './registry.mjs'` → `import { Provider } from '../lib/registry.mjs'`
  - `import { findBin } from './paths.mjs'` → `import { findBin } from '../lib/paths.mjs'`
  This caused `ERR_MODULE_NOT_FOUND` errors when the backend started, as the modules don't exist in the `providers/` directory.

- **Missing `createCommand()` methods (backend/providers/*.mjs)**: The base `Provider` class in `backend/lib/registry.mjs` declares an abstract `createCommand(name)` method. All 5 providers were missing this implementation, which would cause runtime errors when the API endpoint `/providers/:id/create-command` is called. Added proper implementations to each provider.

- **UI entry paths in app.json**: Changed `ui/dist/index.mjs` to `dist/index.mjs` in both `ui.entry` and `ui.pages[0].entryPoint` to match the actual build output location.

### Added

- **Backend health verification**: Verified `/health` endpoint returns `{"ok":true,"name":"kiro-herdr-views"}` and `/api/apps/kiro-herdr-views/providers` returns all 5 providers (tmux, screen, zellij, herdr, aoe) with correct availability status.

### Changed

- **UI rebuilt**: Ran `npm install && npm run build` in `ui/` to sync uncommitted frontend changes to the installed app copy.