# Kiro Herdr Views — build / test / install / dev
#
# Uses the Kiro Crew AppImage at ~/apps/KiroCrew-x86_64.AppImage
# Set KIRO_APP to override the AppImage path.
#
# Usage:
#   make install    # install app into the running AppImage
#   make build      # rebuild UI + backend deps
#   make test       # run available checks
#   make dev        # run backend standalone for debugging
#   make health     # curl the backend health endpoint
#   make uninstall # remove the app from the AppImage (best-effort)

KIRO_APP ?= $(HOME)/apps/KiroCrew-x86_64.AppImage
APP_NAME ?= kiro-herdr-views
APP_DIR ?= $(HOME)/.kiro/crew/apps/$(APP_NAME)

# Locate the kirocrew CLI used for install/uninstall, so the AppImage (which
# needs FUSE to mount — unavailable in most sandboxes) is only a last resort.
# Priority: an explicit KIROCREW override, then $PATH, then the running
# gateway's own AppImage mount — the gateway binary lives inside that mount and
# is never on a normal terminal's $PATH.
KIROCREW ?= $(shell command -v kirocrew 2>/dev/null || true)
ifeq ($(strip $(KIROCREW)),)
KIROCREW := $(shell \
  found=""; \
  for pid in $$(pgrep -f 'kiro_crew gateway' 2>/dev/null); do \
    exe=$$(readlink /proc/$$pid/exe 2>/dev/null) || continue; \
    root=$${exe%/resources/backend-dist/kirocrew-backend/bin/python3.12}; \
    [ -n "$$root" ] && [ "$$root" != "$$exe" ] || continue; \
    cli="$$root/resources/backend-dist/kirocrew-backend/bin/kirocrew"; \
    if [ -x "$$cli" ]; then found="$$cli"; break; fi; \
  done; \
  [ -n "$$found" ] || for m in /tmp/.mount_*; do \
    [ -d "$$m" ] || continue; \
    cli="$$m/resources/backend-dist/kirocrew-backend/bin/kirocrew"; \
    if [ -x "$$cli" ]; then found="$$cli"; break; fi; \
  done; \
  [ -n "$$found" ] && echo "$$found")
endif

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
	  ( [ -n "$(KIROCREW)" ] && $(KIROCREW) app uninstall "$(APP_NAME)" >/dev/null 2>&1 ) \
	    || PATH="/usr/bin:$$PATH" FUSERMOUNT_PROG=fusermount "$(KIRO_APP)" --app-uninstall "$(APP_NAME)" >/dev/null 2>&1 \
	    || true; \
	fi
	@if [ -n "$(KIROCREW)" ]; then \
	  echo "==> Staging app from $(CURDIR) via kirocrew"; \
	  $(KIROCREW) app install "$(CURDIR)"; \
	else \
	  echo "==> Staging app from $(CURDIR) via AppImage (needs FUSE)"; \
	  PATH="/usr/bin:$$PATH" FUSERMOUNT_PROG=fusermount "$(KIRO_APP)" --app-install "$(CURDIR)"; \
	fi || { echo "install step failed"; exit 1; }
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
	@if [ -n "$(KIROCREW)" ]; then \
	  $(KIROCREW) app uninstall "$(APP_NAME)"; \
	else \
	  PATH="/usr/bin:$$PATH" FUSERMOUNT_PROG=fusermount "$(KIRO_APP)" --app-uninstall "$(APP_NAME)"; \
	fi || { echo "uninstall is best-effort; if $(APP_NAME) is already uninstalled this is expected)"; exit 0; }

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
# Backend test files import the compiled node-pty (backend/node_modules),
# which the build step ensures is present.
test-unit:
	@echo "==> Unit tests (node --test)"
	node --test "backend/test/*.test.mjs" "ui/test/*.test.mjs"

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
