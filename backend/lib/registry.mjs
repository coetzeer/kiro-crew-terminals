import { haveBin } from './paths.mjs';

export class Provider {
  constructor(opts) {
    this.id = opts.id;
    this.label = opts.label;
    this.bin = opts.bin || opts.id;
    this.multi = opts.multi !== false;
  }

  available() {
    return haveBin(this.bin);
  }

  async list() {
    return [];
  }

  attachCommand(sessionRef) {
    return sessionRef.cmd || [];
  }

  createCommand(name) {
    return [];
  }

  // Terminating the underlying host session is opt-in per provider: the base
  // class refuses, and providers with a stable stop verb override both of
  // these. The UI only offers Kill where canKill() is true, so an unsupported
  // provider can never be the target of a destructive call.
  canKill() {
    return false;
  }

  async kill() {
    return { ok: false, reason: this.id + ' sessions can only be stopped from ' + this.id + ' itself' };
  }

  toInfo() {
    return { id: this.id, label: this.label, available: this.available(), killable: this.canKill() };
  }
}

export class ProviderRegistry {
  constructor() {
    this.providers = new Map();
  }

  register(p) {
    this.providers.set(p.id, p);
  }

  get(id) {
    return this.providers.get(id);
  }

  all() {
    return [...this.providers.values()];
  }

  available() {
    return this.all().filter((p) => p.available());
  }

  async listAll() {
    const out = [];
    for (const p of this.all()) {
      let sessions = [];
      try {
        sessions = await p.list().catch(() => []);
      } catch {
        sessions = [];
      }
      // `id` is what the UI keys rows and filters on. It has to come from
      // toInfo(), not be spelled out here — the two drifted apart once already
      // and the UI silently rendered nothing but empty rows.
      out.push({ ...p.toInfo(), provider: p.id, sessions });
    }
    return out;
  }
}
