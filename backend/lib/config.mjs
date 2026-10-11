import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { appDataDir } from './paths.mjs';

let configCache = null;

export function loadConfig() {
  if (configCache) return configCache;

  const configPath = path.join(appDataDir('kiro-herdr-views'), 'config.json');
  if (!existsSync(configPath)) {
    configCache = getDefaultConfig();
    return configCache;
  }

  try {
    const raw = readFileSync(configPath, 'utf8');
    const parsed = JSON.parse(raw);
    configCache = { ...getDefaultConfig(), ...parsed };
  } catch {
    configCache = getDefaultConfig();
  }
  return configCache;
}

function getDefaultConfig() {
  return {
    providers: {
      aoe: {
        enabled: true,
        // If true, disable AOE provider when external AOE web dashboard is detected
        disableIfDashboardRunning: false,
        // Port where AOE web dashboard runs (default 4000)
        dashboardPort: 4000,
        // Also check for local `aoe` process (TUI or web)
        checkForProcess: true,
      },
    },
  };
}

export function getProviderConfig(providerId) {
  const config = loadConfig();
  return config.providers?.[providerId] || {};
}

export async function checkAoeDashboardPort(port = 4000) {
  return new Promise((resolve) => {
    const net = require('node:net');
    const socket = new net.Socket();
    socket.setTimeout(100);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      resolve(false);
    });
    socket.connect(port, '127.0.0.1');
  });
}