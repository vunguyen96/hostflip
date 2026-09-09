import { loadConfig, toggleUrl } from './toggle.js';

/** Open the settings page. */
function openOptions() {
  chrome.runtime.openOptionsPage();
}

/** Briefly show a badge on the toolbar icon. */
async function flashBadge(text, color) {
  try {
    await chrome.action.setBadgeBackgroundColor({ color });
    await chrome.action.setBadgeText({ text });
    setTimeout(() => chrome.action.setBadgeText({ text: '' }), 2500);
  } catch {
    // Badge is best-effort only.
  }
}

/** Best-effort OS notification (fallback when a page toast is impossible). */
function notify(message) {
  try {
    chrome.notifications.create(`hostflip-${Date.now()}`, {
      type: 'basic',
      iconUrl: chrome.runtime.getURL('icons/icon128.png'),
      title: 'HostFlip',
      message,
      priority: 2,
    });
  } catch {
    // Notifications are best-effort only.
  }
}

/**
 * Runs inside the active page (injected) to render a self-contained toast.
 * Must not reference anything outside its arguments.
 */
function pageToast(message) {
  const id = '__hostflip_toast__';
  document.getElementById(id)?.remove();

  const el = document.createElement('div');
  el.id = id;
  el.textContent = message;
  Object.assign(el.style, {
    position: 'fixed',
    top: '16px',
    right: '16px',
    zIndex: '2147483647',
    maxWidth: '360px',
    padding: '12px 16px',
    background: '#1e293b',
    color: '#ffffff',
    font: '14px/1.4 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
    borderLeft: '4px solid #edae49',
    opacity: '0',
    transition: 'opacity 0.2s ease',
  });

  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.opacity = '1';
  });
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, 4000);
}

/** Show a message: try an in-page toast first, fall back to a notification. */
async function showMessage(tabId, message) {
  await flashBadge('!', '#edae49');

  if (tabId) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        func: pageToast,
        args: [message],
      });
      return;
    } catch {
      // Injection fails on restricted pages (chrome://, web store, PDFs, ...).
    }
  }

  notify(message);
}

/** Core action: read the active tab and navigate it to the toggled URL. */
async function performToggle() {
  const config = await loadConfig();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.id || !tab.url) {
    await showMessage(tab?.id, 'HostFlip: no active page to toggle.');
    return;
  }

  const result = toggleUrl(tab.url, config);

  if ('url' in result) {
    await chrome.tabs.update(tab.id, { url: result.url });
    return;
  }

  const messages = {
    'invalid-url': 'HostFlip: the current tab has no toggleable URL.',
    'unsupported-scheme': 'HostFlip: only http and https pages can be toggled.',
    'host-mismatch': `HostFlip: this page (${result.actualHost}) matches neither your development domain (${result.dev}) nor your production domain (${result.prod}).`,
  };

  await showMessage(tab.id, messages[result.error] ?? 'HostFlip: unable to toggle this page.');
}

// Toolbar icon click: open the settings page.
chrome.action.onClicked.addListener(() => {
  openOptions();
});

// Keyboard shortcut: toggle the current tab.
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-host') {
    performToggle();
  }
});

// Show the settings page once on install (configuration is optional; defaults apply).
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    openOptions();
  }
});
