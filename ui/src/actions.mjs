// User-action flows (open a discovered session, restart, kill) extracted from
// index.jsx. They only need the API client plus callbacks, so every request
// shape — attach by provider-native ref, the restart create-then-attach
// fallback, the confirmed kill URL — is unit-testable without React. Every
// dependency is injectable; index.jsx passes the real ones.

import { apiPost, apiDelete, killUrl, px } from './api.mjs';

// Open a discovered session by sending its provider-native ref (a screen pid,
// say) rather than replaying its command: the ref is what keeps two
// same-named screen sessions apart, and the server resolves it against the
// live list.
export async function openDiscoveredSession(s, { api = { post: apiPost }, onSession, onError, refresh } = {}) {
  const providerId = s.providerId || s.provider;
  try {
    const res = await api.post(px('/sessions'), { provider: providerId, ref: s.ref });
    if (onSession) onSession(res.session);
  } catch (e) {
    if (onError) onError('Could not open ' + providerId + ':' + s.name + ' — ' + String(e));
    if (refresh) refresh();
  }
}

export async function restartSession(session, { api = { post: apiPost }, onSession, onClose, onError } = {}) {
  const isProvider = Boolean(session.providerId && session.providerId !== 'custom');
  if (!isProvider) {
    if (onError) onError('Custom command sessions are no longer supported. Choose a configured tool instead.');
    return;
  }
  try {
    const res = await api.post(px('/sessions'), { provider: session.providerId, name: session.name });
    if (onClose) onClose(session.ref);
    if (onSession) onSession(res.session);
  } catch (e) {
    // The usual restart failure is that only our mirror died while the host
    // session is still there, so creating it again is refused. Attach to what
    // is already running instead of leaving the pane stuck on an error.
    try {
      const res = await api.post(px('/sessions'), { provider: session.providerId, ref: session.key || session.name });
      if (onClose) onClose(session.ref);
      if (onSession) onSession(res.session);
      return;
    } catch {}
    if (onError) onError('Could not restart ' + session.name + ' — ' + String(e));
  }
}

// Kill a session that was discovered but never opened as a pane here. Always
// behind a confirmation — declining must not issue any request.
export async function killDiscoveredSession(session, { api = { del: apiDelete }, confirm, notify, refresh } = {}) {
  const confirmed = confirm(
    'Kill the ' + session.providerId + ' session "' + session.name + '"?\n\n'
    + 'This terminates it on the host and cannot be undone.'
  );
  if (!confirmed) return;
  const ref = session.providerId + ':' + (session.ref || session.name);
  try {
    const res = await api.del(killUrl(ref));
    notify(
      res.killed
        ? 'Killed ' + session.providerId + ':' + session.name
        : 'Could not kill ' + session.providerId + ':' + session.name + '. ' + (res.reason || ''),
      res.killed ? 'info' : 'error',
    );
  } catch (e) {
    notify('Kill failed — ' + String(e), 'error');
  }
  if (refresh) refresh();
}

// Kill the session behind an open pane. The pane is closed either way — the
// mirror is gone once the host session dies — but the user is told whether the
// host session was actually killed or only detached.
export async function killSession(session, { api = { del: apiDelete }, confirm, notify, onClose, refresh } = {}) {
  const confirmed = confirm(
    'Kill the ' + session.providerId + ' session "' + session.name + '"?\n\n'
    + 'This terminates it on the host and cannot be undone. To leave it running, use ✕ instead.'
  );
  if (!confirmed) return;
  try {
    const res = await api.del(killUrl(session.ref));
    if (res.killed) {
      notify('Killed ' + session.providerId + ':' + session.name);
    } else {
      notify('Closed the view. ' + (res.reason || 'The host session could not be killed.'), 'error');
    }
  } catch (e) {
    notify('Kill failed — ' + String(e), 'error');
  }
  if (onClose) onClose(session.ref);
  if (refresh) refresh();
}
