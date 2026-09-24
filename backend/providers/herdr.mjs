import { execFile } from 'node:child_process';
import { Provider } from '../lib/registry.mjs';
import { findBin } from '../lib/paths.mjs';

const run = (cmd, args) =>
  new Promise((resolve) => {
    execFile(cmd, args, { encoding: 'utf8', env: { ...process.env, TERM: 'xterm-256color' } }, (err, stdout, stderr) => {
      resolve(err ? { ok: false, out: '', err: String(stderr || err.message || err).trim() } : { ok: true, out: stdout, err: '' });
    });
  });

// herdr is a terminal workspace manager for agents. Its CLI has no headless
// "create" verb: a named session is created by the act of attaching to it, so
// `herdr --session <name>` is BOTH the create and the attach command. The
// earlier `herdr init -y <name>` and the `sessions`/`status --format json`
// probes were guesses at a surface that never existed — herdr 0.9.1 answered
// "unknown command: init", and every herdr create failed on it.
//
// Verified against herdr 0.9.1 (protocol 22):
//   herdr session list --json  ->  {"sessions":[{"name","running","default",...}]}
//   herdr --session <name>     ->  launch or attach to that named session
export class HerdrProvider extends Provider {
  constructor() {
    super({ id: 'herdr', label: 'herdr', bin: 'herdr', multi: false });
  }

  async list() {
    const bin = findBin('herdr');
    const r = await run(bin, ['session', 'list', '--json']);
    if (r.ok && r.out.trim()) {
      try {
        const data = JSON.parse(r.out);
        const arr = Array.isArray(data) ? data : data.sessions || [];
        return arr
          .map((it) => {
            const name = String(it.name || '').trim();
            if (!name) return null;
            return { ref: name, name, provider: this.id, cmd: [bin, '--session', name] };
          })
          .filter(Boolean);
      } catch {
        /* not json — fall through to the plain listing */
      }
    }
    // Plain `session list` is a table whose first column is the name and whose
    // first line is a header. Parsed rather than dropped so an older/newer
    // herdr that lacks --json still shows something instead of an empty list.
    const p = await run(bin, ['session', 'list']);
    if (!p.ok) return [];
    return p.out
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line, i) => !(i === 0 && /^name\s/i.test(line)))
      .map((line) => line.split(/\s+/)[0])
      .filter(Boolean)
      .map((name) => ({ ref: name, name, provider: this.id, cmd: [bin, '--session', name] }));
  }

  async create(name) {
    const bin = findBin('herdr');
    // There is nothing to pre-create. `herdr --session <name>` materialises the
    // session when the mirror runs it, so the honest return is that attach
    // command — running `herdr init` here (which does not exist) is what made
    // this provider refuse every name. A duplicate name is still caught: the
    // route's free-name check lists sessions first and answers 409.
    return { ref: name, name, provider: this.id, cmd: [bin, '--session', name] };
  }

  createCommand(name) {
    return [this.bin, '--session', name];
  }
}
