# Kiro Crew Terminals — build / test / install / dev
#
# install/uninstall drive the kirocrew CLI through scripts/kirocrew.sh, which
# resolves it from $KIROCREW, then $PATH, then the mount of a running gateway,
# and finally mounts the Kiro Crew AppImage headless (it bundles the CLI; the
# AppImage itself is the Electron desktop app and takes no CLI verbs).
#
# Usage:
#   make install    # install this checkout into ~/.kiro/crew/apps
#   make build      # rebuild UI + backend deps
#   make test       # run available checks
#   make dev        # run backend standalone for debugging
#   make health     # curl the backend health endpoint
#   make uninstall  # remove the app (per-app data is kept)

KIRO_APP ?= $(HOME)/apps/KiroCrew-x86_64.AppImage
APP_NAME ?= kiro-crew-terminals
APP_DIR ?= $(HOME)/.kiro/crew/apps/$(APP_NAME)

# Discovery and any AppImage mounting live in scripts/kirocrew.sh; these are the
# overrides it honours.
KIROCREW ?=
export KIRO_APP KIROCREW

.PHONY: all build install test dev health uninstall clean

all: build

# --- Build ---------------------------------------------------------------

build: ui-build backend-deps

ui-build:
	@echo "==> Building UI"
	cd ui && npm install && npm run build

backend-deps:
	@echo "==> Installing backend deps"
	cd backend && npm install --omit=dev

# --- Install / uninstall -------------------------------------------------

install: build
	@echo "==> Installing $(APP_NAME)"
	@if [ -d "$(APP_DIR)" ] && [ -f "$(APP_DIR)/app.json" ]; then \
	  echo "==> Existing install found - uninstalling it first (per-app data is kept)"; \
	  scripts/kirocrew.sh app uninstall "$(APP_NAME)" >/dev/null 2>&1 || true; \
	fi
	@echo "==> Staging app from $(CURDIR)"
	@scripts/kirocrew.sh app install "$(CURDIR)"
	@echo "==> Provisioning installed app deps (the gateway often skips onInstall npm hooks)"
	@if [ -d "$(APP_DIR)/backend" ]; then \
	  cd "$(APP_DIR)/backend" && npm install --omit=dev; \
	fi
	@if [ -d "$(APP_DIR)/ui" ] && [ -f "$(APP_DIR)/ui/package.json" ]; then \
	  cd "$(APP_DIR)/ui" && npm install && npm run build; \
	fi
	@echo "==> Installed. Enable $(APP_NAME) from the dashboard (App Store > Library) - the CLI cannot enable from here."

uninstall:
	@echo "==> Uninstalling $(APP_NAME)"
	@scripts/kirocrew.sh app uninstall "$(APP_NAME)" \
	  || echo "(uninstall is best-effort; if $(APP_NAME) is already gone this is expected)"

# --- Dev / debugging -----------------------------------------------------

dev:
	@echo "==> Running backend standalone on :8787 (unsigned)"
	KIRO_HERRD_ALLOW_UNSIGNED=1 KIRO_HERRD_PORT=8787 KIRO_HERRD_MAIN=1 \
	  node backend/server.mjs

health:
	@echo "==> Health check"
	(curl -fsS http://127.0.0.1:8787/health || echo "(backend not reachable on :8787)"

# --- Test ----------------------------------------------------------------

test: test-unit test-ui test-backend

# Framework-free unit tests via Node's built-in test runner (no extra deps).
# Tests inject fake PTYs, stub providers and scripted command runners, so
# node-pty does NOT need to be compiled first — only express + ws must be
# present in backend/node_modules (`make backend-deps` or a plain npm install).
test-unit:
	@echo "==> Unit tests (node --test)"
	node --test "backend/test/*.test.mjs" "ui/test/*.test.mjs"

# Same suite with per-file coverage; covers server.mjs, session-manager.mjs,
# the providers and the extracted UI logic, not just the helper modules.
test-coverage:
	@echo "==> Unit tests with coverage (node --test)"
	node --test --experimental-test-coverage "backend/test/*.test.mjs" "ui/test/*.test.mjs"

test-backend:
	@echo "==> Backend syntax check"
	node --check backend/server.mjs
	node --check backend/lib/session-manager.mjs
	node --check backend/lib/registry.mjs
	node --check backend/lib/proxy-verify.mjs
	node --check backend/lib/paths.mjs
	for f in backend/providers/*.mjs; do node --check "$$f"; done

test-ui:
	@echo "==> UI build + bundle checks"
	cd ui && npm run build
	@echo "==> Checking bundle exports"
	grep -qPz 'export \{[^}]*\bas default\b' ui/dist/index.mjs || { echo "FAIL: no default export"; exit 1; }
	grep -qz 'as mount' ui/dist/index.mjs || { echo "FAIL: no mount export"; exit 1; }
	grep -q 'from "react"' ui/dist/index.mjs || { echo "FAIL: react not external"; exit 1; }
	grep -q 'process\.env' ui/dist/index.mjs && { echo "FAIL: process.env present"; exit 1; } || true
	@echo "==> All checks passed"

# --- Cleanup -------------------------------------------------------------

clean:
	rm -rf ui/node_modules ui/dist backend/node_modules
