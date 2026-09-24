import { execFile } from 'node:child_process';
import { Provider } from '../lib/registry.mjs';
import { findBin } from '../lib/paths.mjs';

const run = (cmd, args) =>
  new Promise((resolve) => {
    execFile(cmd, args, { encoding: 'utf8', env: { ...process.env, TERM: 'xterm-256color' } }, (err, stdout, stderr) => {
      resolve(err ? { ok: false, out: '', err: String(stderr || err.message || err).trim() } : { ok: true, out: stdout, err: '' });
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
    const r = await run(bin, ['-d', '-m', '-S', name, '/bin/bash', '-l']);
    if (!r.ok) {
      throw new Error('screen refused to create session "' + name + '": ' + (r.err || 'unknown screen error'));
    }
    await new Promise((r) => setTimeout(r, 400));
    const sessions = await this.list();
    // Prefer the pid as the identity: screen allows two sessions with the same
    // name, so the name alone cannot tell two of them apart.
    return sessions.find((s) => s.name === name) || { ref: name, name, provider: this.id, cmd: [bin, '-r', name] };
  }

  createCommand(name) {
    return [this.bin, '-d', '-m', '-S', name, '/bin/bash', '-l'];
  }

  canKill() {
    return true;
  }

  async kill({ key, name }) {
    const bin = findBin('screen');
    const target = String(key || name || '');
    if (!target) return { ok: false, reason: 'no screen session given' };
    const r = await run(bin, ['-S', target, '-X', 'quit']);
    if (r.ok) return { ok: true };
    // Same reasoning as tmux: a non-zero exit can simply mean the session was
    // already gone. Confirm against the session list before reporting failure.
    await new Promise((resolve) => setTimeout(resolve, 250));
    const still = await this.list();
    return still.some((s) => s.name === name || String(s.ref) === target)
      ? { ok: false, reason: 'screen could not quit session "' + target + '": ' + (r.err || 'unknown screen error') }
      : { ok: true };
  }
}
