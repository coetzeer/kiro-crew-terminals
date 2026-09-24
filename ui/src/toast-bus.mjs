// Framework-free toast bus. Extracted from index.jsx so the dedupe and
// overlay-collapse logic is unit-testable with plain node:test — no React, no
// DOM required. index.jsx keeps the singleton (toastBus) and the React
// ToastHost component; this module holds the state plus the pure functions.
//
// In-app toasts must survive on screen until the user dismisses them, but the
// host toast's lifetime is out of our control (best-effort postMessage), so
// errors are pushed to a persistent, dismissible overlay. dedupeKey collapses
// repeats onto a single toast — e.g. the 8s provider poll that keeps failing —
// so a persistent error does not stack a fresh toast per tick, and the host
// isn't re-pinged with the identical error either.

export function createToastBus(hostPing) {
  const listeners = new Set();
  let toastSeq = 0;
  // Keys of toasts currently on screen in the overlay.
  const activeToastKeys = new Set();
  const ping = hostPing || defaultHostPing;

  function pushToast(text, severity, dedupeKey) {
    const key = dedupeKey || '';
    if (key) activeToastKeys.add(key);
    const toast = { id: ++toastSeq, text: String(text), severity: severity === 'error' ? 'error' : 'info', dedupeKey: key };
    listeners.forEach((fn) => { try { fn({ op: 'add', toast }); } catch {} });
  }

  function clearToast(dedupeKey) {
    if (!dedupeKey) return;
    activeToastKeys.delete(dedupeKey);
    listeners.forEach((fn) => { try { fn({ op: 'clear', dedupeKey }); } catch {} });
  }

  function notify(text, type, dedupeKey) {
    // A surviving toast for this key means the failure is already on screen in
    // both layers; a repeat tick must not re-ping the host with the identical
    // error. The key stays active until the source clears it on recovery.
    const repeat = Boolean(dedupeKey) && activeToastKeys.has(dedupeKey);
    if (!repeat) ping(type === 'error' ? 'error' : 'info', text);
    // Only errors get the persistent in-app toast; info stays a transient host
    // notification so success pings don't pile up needing manual dismissal.
    if (type === 'error') pushToast(text, 'error', dedupeKey);
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }

  function keyCount() {
    return activeToastKeys.size;
  }

  return { pushToast, clearToast, notify, subscribe, keyCount };
}

// Overlay reducer: collapses same-key toasts onto one, drops on clear. Pure so
// the ToastHost component and the unit tests share exactly the same behavior.
export function reduceToasts(prev, evt) {
  if (evt.op === 'clear') return prev.filter((t) => t.dedupeKey !== evt.dedupeKey);
  const t = evt.toast;
  const rest = t.dedupeKey ? prev.filter((x) => x.dedupeKey !== t.dedupeKey) : prev;
  return [...rest, t];
}

function defaultHostPing(severity, text) {
  try {
    // best-effort host toast; ignore failures when running without the host SDK
    if (typeof window !== 'undefined' && window.parent && typeof window.parent.postMessage === 'function' && window.parent !== window) {
      window.parent.postMessage({ source: 'kiro-herdr-views', type: 'notify', text, severity }, '*');
    }
  } catch {}
  console.log('[herdr-views]', text);
}

// The singleton index.jsx renders. Tests build their own buses with a spy ping.
export const toastBus = createToastBus();