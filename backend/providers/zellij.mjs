import { execFile } from 'node:child_process';
import { Provider } from '../lib/registry.mjs';
import { findBin } from '../lib/paths.mjs';

const run = (cmd, args) =>
  new Promise((resolve) => {
    execFile(cmd, args, { encoding: 'utf8', env: { ...process.env, TERM: 'xterm-256color' } }, (err, stdout, stderr) => {
      resolve(err ? { ok: false, out: '', err: String(stderr || err.message || err).trim() } : { ok: true, out: stdout, err: '' });
    });
  });

export class ZellijProvider extends Provider {
  constructor() {
    super({ id: 'zellij', label: 'zellij', bin: 'zellij' });
  }

  async list() {
    const bin = findBin('zellij');
    // --short prints the bare session name. `-n` is not enough: it strips the
    // ANSI colour but still appends " [Created 6m 20s ago]", so every discovered
    // zellij session arrived with that suffix glued onto its name.
    const r = await run(bin, ['list-sessions', '--short']);
    if (!r.ok) return [];
    return r.out
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((name) => ({ ref: name, name, provider: this.id, cmd: [bin, 'attach', name] }));
  }

  // `zellij --session NAME --detach` was the documented way to create a
  // detached session, but 0.45 removed `--detach` ("unexpected argument"), so
  // creation had been failing and the failure was swallowed. `attach
  // --create-background` is the current spelling; the legacy form is tried
  // second so older installs keep working.
  async create(name) {
    const bin = findBin('zellij');
    let r = await run(bin, ['attach', '--create-background', name]);
    if (!r.ok) r = await run(bin, ['--session', name, '--detach']);
    if (!r.ok) {
      throw new Error('zellij refused to create session "' + name + '": ' + (r.err || 'unknown zellij error'));
    }
    await this.waitReady(name);
    // `attach -c` creates the session if it is not there yet, which closes the
    // window between the background create above and this attach command
    // reaching the PTY. Without it the pane could attach to a session that had
    // not registered yet and exit immediately.
    return { ref: name, name, provider: this.id, cmd: [bin, 'attach', '-c', name] };
  }

  // The background create returns as soon as the CLI exits, but the session
  // server registers the new session a moment later. Best-effort: a session
  // that is still slow to appear must not turn into a hard failure, which is
  // why this reports rather than throws.
  async waitReady(name, timeoutMs = 4000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const sessions = await this.list();
      if (sessions.some((s) => s.name === name)) return true;
      await new Promise((r) => setTimeout(r, 200));
    }
    return false;
  }

  createCommand(name) {
    return [this.bin, 'attach', '--create-background', name];
  }

  canKill() {
    return true;
  }

  async kill({ key, name }) {
    const bin = findBin('zellij');
    const target = String(key || name || '');
    if (!target) return { ok: false, reason: 'no zellij session name given' };
    // --force is required to delete a session that still has clients attached.
    // Older zellij only knows kill-session. A freshly created session can still
    // be bootstrapping its server, during which both verbs refuse, so the pair
    // is retried once before giving up.
    let r = { ok: false, err: '' };
    for (let attempt = 0; attempt < 2; attempt++) {
      r = await run(bin, ['delete-session', '--force', target]);
      if (r.ok) return { ok: true };
      if (await this.isGone(target)) return { ok: true };
      r = await run(bin, ['kill-session', target]);
      if (r.ok) return { ok: true };
      if (await this.isGone(target)) return { ok: true };
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    return { ok: false, reason: 'zellij could not delete session "' + target + '": ' + (r.err || 'unknown zellij error') };
  }

  // zellij's delete-session exits non-zero when it force-kills a session that
  // has a client attached — which is exactly the case here, because our mirror
  // is attached — even though the deletion went through. So the exit code alone
  // would report a failure the user would try to act on while the session is
  // already gone. Ask the session list instead.
  async isGone(name) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const sessions = await this.list();
    return !sessions.some((s) => s.name === name);
  }
}
