#!/bin/sh
# Run the kirocrew CLI, resolving it from (in order):
#
#   1. $KIROCREW, if set
#   2. kirocrew on $PATH
#   3. the AppImage mount of a running gateway/desktop process
#   4. an AppImage mount already on disk under /tmp/.mount_*
#   5. a fresh headless mount of $KIRO_APP — the Electron desktop AppImage
#      bundles the CLI at resources/backend-dist/kirocrew-backend/bin/kirocrew
#
# Case 5 mounts for the duration of this call and unmounts afterwards, so
# install/uninstall work whether or not the desktop app is running.
#
# Do NOT set FUSERMOUNT_PROG here: the AppImage type-2 runtime execs that value
# verbatim, so a bare program name ("fusermount") fails with ENOENT and the
# mount dies with "fuse: failed to exec $FUSERMOUNT_PROG". Left unset, the
# runtime locates fusermount/fusermount3 itself.

set -eu

CLI_REL="resources/backend-dist/kirocrew-backend/bin/kirocrew"
APPIMAGE="${KIRO_APP:-$HOME/apps/KiroCrew-x86_64.AppImage}"

mount_pid=""
mount_out=""
cleanup() {
	if [ -n "$mount_pid" ]; then
		kill "$mount_pid" 2>/dev/null || true
		wait "$mount_pid" 2>/dev/null || true
	fi
	if [ -n "$mount_out" ]; then
		rm -f "$mount_out"
	fi
	return 0
}
trap cleanup EXIT INT TERM

cli="${KIROCREW:-}"
if [ -z "$cli" ]; then
	cli="$(command -v kirocrew 2>/dev/null || true)"
fi

if [ -z "$cli" ]; then
	pids="$(pgrep -f 'kiro_crew gateway' 2>/dev/null || true)"
	for pid in $pids; do
		exe="$(readlink "/proc/$pid/exe" 2>/dev/null || true)"
		root="${exe%/resources/backend-dist/kirocrew-backend/bin/python3.12}"
		if [ -n "$root" ] && [ "$root" != "$exe" ] && [ -x "$root/$CLI_REL" ]; then
			cli="$root/$CLI_REL"
			break
		fi
	done
fi

if [ -z "$cli" ]; then
	for m in /tmp/.mount_*; do
		if [ -x "$m/$CLI_REL" ]; then
			cli="$m/$CLI_REL"
			break
		fi
	done
fi

if [ -z "$cli" ]; then
	if [ ! -x "$APPIMAGE" ]; then
		echo "kirocrew.sh: no kirocrew CLI found and no AppImage at $APPIMAGE" >&2
		exit 1
	fi
	echo "==> Mounting $APPIMAGE to reach its bundled kirocrew CLI" >&2
	mount_out="$(mktemp)"
	"$APPIMAGE" --appimage-mount >"$mount_out" 2>&1 &
	mount_pid=$!
	i=0
	while [ ! -s "$mount_out" ] && [ "$i" -lt 300 ]; do
		kill -0 "$mount_pid" 2>/dev/null || break
		sleep 0.1
		i=$((i + 1))
	done
	mount_dir="$(head -n 1 "$mount_out" 2>/dev/null || true)"
	cli="$mount_dir/$CLI_REL"
	if [ ! -x "$cli" ]; then
		echo "kirocrew.sh: failed to mount $APPIMAGE" >&2
		sed 's/^/  /' "$mount_out" >&2
		exit 1
	fi
fi

"$cli" "$@"
