// Framework-free API client. Extracted from index.jsx so the request contract
// (same-origin credentials, JSON serialization, server error surfacing) is
// unit-testable without React. Components keep calling these helpers directly.

export const APP = 'kiro-crew-terminals';
export const PROXY_BASE = '/apps/' + APP + '/api';

export const px = (p) => PROXY_BASE + p;

// Surface the server's own message where there is one. A 409 "name already
// exists" and a failed-kill reason are the only things that tell the user what
// to do next, and reporting a bare status code threw both away.
async function readError(res, label) {
  let detail = '';
  try {
    const body = await res.json();
    detail = (body && (body.error || body.reason)) || '';
  } catch {}
  return new Error(detail || label + ' -> ' + res.status);
}

export async function apiGet(path) {
  const r = await fetch(path, { credentials: 'same-origin' });
  if (!r.ok) throw await readError(r, 'GET ' + path);
  return r.json();
}

export async function apiPost(path, body) {
  const r = await fetch(path, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  });
  if (!r.ok) throw await readError(r, 'POST ' + path);
  return r.json();
}

export async function apiDelete(path) {
  const r = await fetch(path, { method: 'DELETE', credentials: 'same-origin' });
  if (!r.ok) throw await readError(r, 'DELETE ' + path);
  return r.json();
}

// Killing is the one destructive action: always an encoded ref, always the
// explicit ?kill=1 marker — a detach never goes through this URL.
export function killUrl(ref) {
  return px('/sessions/' + encodeURIComponent(ref)) + '?kill=1';
}
