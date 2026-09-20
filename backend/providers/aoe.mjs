import { execFile } from 'node:child_process';
import { Provider } from './registry.mjs';
import { findBin } from './paths.mjs';

const run = (cmd, args) =>
  new Promise((resolve) => {
    execFile(cmd, args, { encoding: 'utf8', env: { ...process.env, TERM: 'xterm-256color' } }, (err, stdout) => {
      resolve(err ? { ok: false, out: '' } : { ok: true, out: stdout });
    });
  });

// agent-of-empires — a persistent agent that runs inside tmux sessions. We
// surface its tmux-backed sessions and expose an `aoe` REPL attach.
export class AoeProvider extends Provider {
  constructor() {
    super({ id: 'aoe', label: 'agent-of-empires', bin: 'aoe', multi: false });
  }

  async list() {
    const bin = findBin('aoe');
    const r = await run(bin, ['status', '--format', 'json']);
    if (r.ok && r.out.trim()) {
      try {
        const data = JSON.parse(r.out);
        const arr = Array.isArray(data) ? data : data.agents || data.empires || [];
        if (Array.isArray(arr)) {
          return arr
            .map((it) => {
              const name = String(it.name || it.id || it.session || '').trim();
              if (!name) return null;
              return { ref: name, name, provider: this.id, cmd: [bin, 'attach', name] };
            })
            .filter(Boolean);
        }
      } catch {
        /* ignore */
      }
    }
    return [];
  }

  async create(name) {
    const bin = findBin('aoe');
    await run(bin, ['new', '-n', name]);
    return { ref: name, name, provider: this.id, cmd: [bin, 'attach', name] };
  }
}
