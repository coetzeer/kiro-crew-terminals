import { execFile } from 'node:child_process';
import { Provider } from './registry.mjs';
import { findBin } from './paths.mjs';

const run = (cmd, args) =>
  new Promise((resolve) => {
    execFile(cmd, args, { encoding: 'utf8', env: { ...process.env, TERM: 'xterm-256color' } }, (err, stdout) => {
      resolve(err ? { ok: false, out: '' } : { ok: true, out: stdout });
    });
  });

export class ScreenProvider extends Provider {
  constructor() {
    super({ id: 'screen', label: 'screen', bin: 'screen' });
  }

  async list() {
    const bin = findBin('screen');
    const r = await run(bin, ['-ls']);
    if (!r.ok) return [];
    const sessions = [];
    const re = /(\d+)\.([\w.-]+)/g;
    let m;
    while ((m = re.exec(r.out)) !== null) {
      const pid = m[1];
      const name = m[2];
      if (name.includes('_') || name === 'pts') continue;
      sessions.push({ ref: pid, name, provider: this.id, cmd: [bin, '-r', pid] });
    }
    return sessions;
  }

  async create(name) {
    const bin = findBin('screen');
    await run(bin, ['-d', '-m', '-S', name, '/bin/bash', '-l']);
    await new Promise((r) => setTimeout(r, 400));
    const sessions = await this.list();
    return sessions.find((s) => s.name === name) || { ref: name, name, provider: this.id, cmd: [bin, '-r', name] };
  }
}
