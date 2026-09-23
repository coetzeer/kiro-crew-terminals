import { execFile } from 'node:child_process';
import { Provider } from '../lib/registry.mjs';
import { findBin } from '../lib/paths.mjs';

const run = (cmd, args) =>
  new Promise((resolve) => {
    execFile(cmd, args, { encoding: 'utf8', env: { ...process.env, TERM: 'xterm-256color' } }, (err, stdout) => {
      resolve(err ? { ok: false, out: '' } : { ok: true, out: stdout });
    });
  });

// herdr is a swarm/orchestration manager; the admin/attach surface varies by
// version. We surface a best-effort list, and always support creating a
// dedicated mux session scoped to herdr's workspace + a `herdr` REPL attach.
export class HerdrProvider extends Provider {
  constructor() {
    super({ id: 'herdr', label: 'herdr', bin: 'herdr', multi: false });
  }

  async list() {
    const bin = findBin('herdr');
    const attempts = [
      ['herdr', 'sessions', '--format', 'json'],
      ['herdr', 'status', '--format', 'json'],
    ];
    for (const args of attempts) {
      const r = await run(bin, args);
      if (r.ok && r.out.trim()) {
        try {
          const data = JSON.parse(r.out);
          const arr = Array.isArray(data) ? data : data.sessions || data.agents || [];
          if (Array.isArray(arr)) {
            return arr
              .map((it) => {
                const name = String(it.name || it.id || it.key || '').trim();
                if (!name) return null;
                return { ref: name, name, provider: this.id, cmd: [bin, 'attach', name] };
              })
              .filter(Boolean);
          }
        } catch {
          /* not json, fall through */
        }
        return r.out
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)
          .map((name) => ({ ref: name, name, provider: this.id, cmd: [bin, 'attach', name] }));
      }
    }
    return [];
  }

  async create(name) {
    const bin = findBin('herdr');
    await run(bin, ['init', '-y', name]);
    return { ref: name, name, provider: this.id, cmd: [bin, 'agent', 'repl', name] };
  }

  createCommand(name) {
    return [this.bin, 'init', '-y', name];
  }
}
