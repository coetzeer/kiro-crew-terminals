---
title: Add custom terminal icon for the sidebar
date: 2026-09-23
theme: frontend
status: completed
owner: unassigned
summary: Add a custom SVG icon so the Kiro Crew sidebar shows a distinctive terminal glyph for this app instead of the generic Terminal fallback.
---

# Add custom terminal icon for the sidebar

## Objective

Add a small custom icon so the Kiro Crew left sidebar displays a distinctive
terminal icon for this app instead of the generic built-in `Terminal` glyph.

## Context

- `app.json` (repo root) declares the UI page with `"icon": "Terminal"` and now
  also carries `"iconUrl": "icon.svg"`; the asset lives at `ui/icon.svg`.
- The app is served/mounted under `/apps/kiro-herdr-views/` (see
  `app.json` -> `ui.backend.routes` and `ui.pages[0].route`); the UI entry is
  built to `ui/dist/index.mjs` (`ui/vite.config.js`, `ui/package.json` script
  `build`).
- Icon resolution order in KiroCrew (`ui/src/index.jsx` mount flow / host shell):
  1. top-level page `iconUrl` (URL relative to the app origin), then
  2. page-relative `iconUrl`, then
  3. builtin Lucide `icon` name as a fallback glyph.
  Today step 1/2 are present via `iconUrl: "icon.svg"`, so step 3 (`Terminal`)
  is the fallback.

## Scope

### In scope

- Create `ui/icon.svg` (24x24 viewport, `currentColor`-based single-color aesthetic).
- Register the asset in `app.json`: `"iconUrl": "icon.svg"` on `ui.pages[0]`,
  keeping `"icon": "Terminal"` as the fallback.
- Document the asset location and the rebuild/validation steps.

### Out of scope

- Changes to the UI bundle output (`dist/index.mjs` is unaffected; the icon is a
  static asset served from the `ui/` path).
- Dark/light asset variants (a single `currentColor` SVG adapts to the host
  theme).

## Plan

- [ ] Create `ui/icon.svg`: rounded terminal window shape with status dots,
      prompt/output detail, and a friendly Kiro-like face; styled with
      `currentColor` and subtle opacity for depth.
- [ ] Add `"iconUrl": "icon.svg"` to `ui.pages[0]` in `app.json` while keeping
      `"icon": "Terminal"` as the fallback.
- [ ] Verify the asset is served at the app origin (e.g.
      `/apps/kiro-herdr-views/ui/icon.svg`).
- [ ] Confirm `cd ui && npm run build` still succeeds.

## Implementation order

1. Finalize the SVG contents (confirm the face reads as intended at 16px).
2. Confirm the asset-serving root so `iconUrl` is reachable (Vite `public/` vs.
   copy-into-`dist`).
3. Add `iconUrl` to `app.json`.
4. Rebuild and validate.

## Validation

- SVG validity: `viewBox="0 0 24 24"`, valid XML, all styling uses `currentColor`
  (inspect fill/stroke attributes), no absolute colors.
- Asset placement: verify the chosen location is served at
  `/apps/kiro-herdr-views/ui/icon.svg` (or the documented equivalent).
- Manifest: `app.json` is valid JSON and `ui.pages[0]` has both
  `icon: "Terminal"` and `iconUrl: "icon.svg"`.
- Icon resolution: open the host sidebar and confirm the custom icon renders
  for the app entry; remove `iconUrl` (or point to a bad URL) to confirm the
  `Terminal` fallback is used.
- Static checks: `python3 -m json.tool app.json >/dev/null` (manifest parses);
  `xmllint --noout ui/icon.svg` or a Python SVG assertion if `xmllint` is
  unavailable.
- Rebuild: `cd ui && npm run build` still succeeds and the icon asset is
  present in the output (e.g. copied to `ui/dist/`).

## Risks and mitigations

- A bad `iconUrl` path silently falls back to the `Terminal` glyph; verify the
  served path against the host's static-file routing before relying on the
  custom icon.
- `currentColor` styling depends on the host sidebar's text/fill color; test in
  both light and dark host themes.

## Completion criteria

- `ui/icon.svg` exists, is valid XML with `viewBox="0 0 24 24"`, and uses only
  `currentColor` styling.
- `app.json` is valid JSON with `ui.pages[0]` declaring both `icon: "Terminal"`
  and `iconUrl: "icon.svg"`.
- The custom icon renders in the host sidebar, with the `Terminal` glyph as a
  verified fallback.
- `cd ui && npm run build` succeeds and the icon asset is present in the output.