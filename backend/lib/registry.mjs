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

  toInfo() {
    return { id: this.id, label: this.label, available: this.available() };
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
      out.push({ provider: p.id, label: p.label, available: p.available(), sessions });
    }
    return out;
  }
}
