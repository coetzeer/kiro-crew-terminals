// Pane and persistence state transitions, extracted from index.jsx so the
// sidebar rules (dedupe by ref, prune against live∪known, active selection)
// are unit-testable. Everything is pure except the localStorage loaders, which
// take an optional storage so tests never touch the real one.

const PANE_KEY = 'kiro-herdr-views:panes';
const ACTIVE_KEY = 'kiro-herdr-views:active';

function defaultStorage() {
  try {
    return (typeof window !== 'undefined' && window.localStorage) || null;
  } catch {
    return null;
  }
}

export function loadPanes(storage = defaultStorage()) {
  try {
    const raw = storage && storage.getItem(PANE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((s) => s && s.ref && s.cmd && s.providerId !== 'custom') : [];
  } catch {
    return [];
  }
}

export function savePanes(panes, storage = defaultStorage()) {
  try {
    if (storage) storage.setItem(PANE_KEY, JSON.stringify(panes));
  } catch {}
}

export function loadActive(storage = defaultStorage()) {
  try {
    return (storage && storage.getItem(ACTIVE_KEY)) || '';
  } catch {
    return '';
  }
}

export function saveActive(ref, storage = defaultStorage()) {
  try {
    if (storage) storage.setItem(ACTIVE_KEY, ref || '');
  } catch {}
}

// One pane per mirror: two panes on the same ref means two xterms sending
// input to a single PTY, so every keystroke would be written twice. Returns
// the same array when nothing changed so React state identity is preserved.
export function addPane(panes, session) {
  if (!session || !session.ref) return panes;
  return panes.some((p) => p.ref === session.ref) ? panes : [...panes, session];
}

export function removePane(panes, ref) {
  return panes.filter((p) => p.ref !== ref);
}

// The active session can be closed, pruned or killed out from under the view:
// keep the current selection when it still exists, else fall back to the most
// recently opened pane, else nothing.
export function nextActive(panes, activeRef) {
  if (activeRef && panes.some((p) => p.ref === activeRef)) return activeRef;
  return panes.length ? panes[panes.length - 1].ref : '';
}

// Drop a pane only when the backend has genuinely forgotten the session:
// pruning against live sessions alone wiped every open pane during the window
// after a backend restart, before restore() finished. Panes the user ended
// (or that exited on their own) are kept so they can be restarted.
export function prunePanes(panes, aliveRefs, ended) {
  const alive = aliveRefs instanceof Set ? aliveRefs : new Set(aliveRefs || []);
  const next = panes.filter((p) => alive.has(p.ref) || ended[p.ref]);
  return next.length === panes.length ? panes : next;
}

// Discovered rows: flatten provider groups into one list, tagged with the
// provider id, filtered when a specific provider is selected.
export function flattenDiscovered(providers, selectedProvider) {
  const groups = (providers || []).filter((p) => !selectedProvider || p.id === selectedProvider);
  const found = [];
  for (const g of groups) {
    for (const s of (g.sessions || [])) found.push({ providerId: g.id, ...s });
  }
  return found;
}
