import { execFile } from 'node:child_process';
import { Provider } from '../lib/registry.mjs';
import { findBin } from '../lib/paths.mjs';

const run = (cmd, args) =>
  new Promise((resolve) => {
    execFile(cmd, args, { encoding: 'utf8', env: { ...process.env, TERM: 'xterm-256color' } }, (err, stdout, stderr) => {
      resolve(err ? { ok: false, out: '', err: String(stderr || err.message || err).trim() } : { ok: true, out: stdout, err: '' });
    });
  });

// agent-of-empires manages long-lived agent sessions backed by tmux. The verbs
// are `add` (create the record), `session start` (spawn its tmux process) and
// `session attach` (attach interactively) — there is no `new`, which is what
// the old code called, so every aoe create died with "unrecognized subcommand
// 'new'". Verified against the installed aoe:
//   aoe list --json            -> [{"id","title","state": "live"|"trashed",...}]
//   aoe add --scratch -t NAME  -> creates a scratch session, not yet started
//   aoe session start NAME     -> starts the session's tmux process
//   aoe session attach NAME    -> attach (by title or id)
export class AoeProvider extends Provider {
  constructor() {
    super({ id: 'aoe', label: 'agent-of-empires', bin: 'aoe', multi: false });
  }

  async list() {
    const bin = findBin('aoe');
    const r = await run(bin, ['list', '--json']);
    if (!r.ok || !r.out.trim()) return [];
    let data;
    try {
      data = JSON.parse(r.out);
    } catch {
      return [];
    }
    const arr = Array.isArray(data) ? data : data.sessions || [];
    return arr
      // A trashed session has no process to attach to — offering it would put a
      // row in Discovered that fails the moment it is opened.
      .filter((it) => String(it.state || '') !== 'trashed')
      .map((it) => {
        const name = String(it.title || it.name || it.id || '').trim();
        if (!name) return null;
        return { ref: name, name, provider: this.id, cmd: [bin, 'session', 'attach', name] };
      })
      .filter(Boolean);
  }

  async create(name) {
    const bin = findBin('aoe');
    const added = await run(bin, ['add', '--scratch', '-t', name]);
    if (!added.ok) {
      throw new Error('aoe refused to create "' + name + '": ' + (added.err || 'unknown aoe error'));
    }
    // `add` only writes the record; the tmux process that an attach needs does
    // not exist until the session is started. Reporting success here without
    // this step is how a pane comes up attached to nothing.
    const started = await run(bin, ['session', 'start', name]);
    if (!started.ok) {
      // Undo the record we just made so a failed create does not leave a dead
      // session in `aoe list` for the user to clean up. Best-effort: the
      // original error is what matters and must still surface.
      await run(bin, ['remove', name]).catch(() => {});
      throw new Error('aoe created "' + name + '" but could not start it: ' + (started.err || 'unknown aoe error'));
    }
    return { ref: name, name, provider: this.id, cmd: [bin, 'session', 'attach', name] };
  }

  createCommand(name) {
    return [this.bin, 'add', '--scratch', '-t', name];
  }
}
