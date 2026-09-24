import { execFile } from 'node:child_process';
import { Provider } from '../lib/registry.mjs';
import { findBin } from '../lib/paths.mjs';

// stderr is kept: a mux's own message ("session not found", "unexpected
// argument") is the only thing that explains a failure, and swallowing it is
// how a provider can look broken for months without anyone noticing.
const run = (cmd, args) =>
  new Promise((resolve) => {
    execFile(cmd, args, { encoding: 'utf8', env: { ...process.env, TERM: 'xterm-256color' } }, (err, stdout, stderr) => {
      resolve(err ? { ok: false, out: '', err: String(stderr || err.message || err).trim() } : { ok: true, out: stdout, err: '' });
    });
  });

export class TmuxProvider extends Provider {
  constructor() {
    super({ id: 'tmux', label: 'tmux', bin: 'tmux' });
  }

  async list() {
    const bin = findBin('tmux');
    const r = await run(bin, ['list-sessions', '-F', '#{session_name}']);
    if (!r.ok) return [];
    return r.out
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      // The name is the identity: it is what attach and kill-session target,
      // and unlike the session id (#{session_id}, e.g. "$0") it is stable across
      // server restarts and matches what a created session is keyed by.
      .map((name) => ({ ref: name, name, provider: this.id, cmd: [bin, 'attach', '-t', name] }));
  }

  async create(name) {
    const bin = findBin('tmux');
    const r = await run(bin, ['new-session', '-d', '-s', name]);
    // Swallowing this failure is what made three providers all end up attached
    // to one tmux session: tmux rejects a duplicate name, the error was dropped,
    // and the returned attach command pointed at the session that already
    // existed. Fail loudly instead so the route can answer 409.
    if (!r.ok) {
      throw new Error('tmux refused to create session "' + name + '": ' + (r.err || 'unknown tmux error'));
    }
    return { ref: name, name, provider: this.id, cmd: [bin, 'attach', '-t', name] };
  }

  createCommand(name) {
    return [this.bin, 'new-session', '-d', '-s', name];
  }

  canKill() {
    return true;
  }

  async kill({ key, name }) {
    const bin = findBin('tmux');
    const target = String(key || name || '');
    if (!target) return { ok: false, reason: 'no tmux session name given' };
    // `=` forces an exact-name target. Without it tmux falls back to prefix
    // matching, so killing "work" would happily kill "workshop" when the exact
    // name is already gone.
    const r = await run(bin, ['kill-session', '-t', '=' + target]);
    if (r.ok) return { ok: true };
    // "no server running" and friends mean the session is already gone, so the
    // goal is met even though the exit code says failure. Report the state, not
    // the exit code — otherwise the UI cries failure over a killed session.
    await new Promise((resolve) => setTimeout(resolve, 250));
    const still = await this.list();
    return still.some((s) => s.name === target)
      ? { ok: false, reason: 'tmux could not kill session "' + target + '": ' + (r.err || 'unknown tmux error') }
      : { ok: true };
  }
}
