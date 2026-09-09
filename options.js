import { loadConfig, saveConfig, normalizeDomain, CONFIG_DEFAULTS } from './toggle.js';

const els = {
  form: document.getElementById('config-form'),
  dev: document.getElementById('developmentDomain'),
  prod: document.getElementById('productionDomain'),
  status: document.getElementById('status'),
  shortcutDisplay: document.getElementById('shortcut-display'),
  editShortcut: document.getElementById('edit-shortcut'),
};

let statusTimer;

function setStatus(message, kind) {
  clearTimeout(statusTimer);
  els.status.textContent = message;
  els.status.className = `status ${kind}`;
  if (message) {
    statusTimer = setTimeout(() => {
      els.status.textContent = '';
      els.status.className = 'status';
    }, 3000);
  }
}

async function showShortcut() {
  const commands = await chrome.commands.getAll();
  const toggle = commands.find((c) => c.name === 'toggle-host');
  els.shortcutDisplay.textContent = toggle?.shortcut ? toggle.shortcut : 'not set';
}

async function restore() {
  const config = await loadConfig();
  els.dev.value = config.developmentDomain;
  els.prod.value = config.productionDomain;
  await showShortcut();
}

els.form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const dev = normalizeDomain(els.dev.value) || CONFIG_DEFAULTS.developmentDomain;
  const prod = normalizeDomain(els.prod.value) || CONFIG_DEFAULTS.productionDomain;

  els.dev.value = dev;
  els.prod.value = prod;

  await saveConfig({ developmentDomain: dev, productionDomain: prod });
  setStatus('Saved \u2713', 'ok');
});

els.editShortcut.addEventListener('click', () => {
  const url = navigator.userAgent.includes('Edg/')
    ? 'edge://extensions/shortcuts'
    : 'chrome://extensions/shortcuts';
  chrome.tabs.create({ url });
});

restore();
