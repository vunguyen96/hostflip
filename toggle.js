/**
 * Shared configuration + URL toggling logic for HostFlip.
 * Imported by the service worker and the options page.
 */

export const CONFIG_DEFAULTS = Object.freeze({
  developmentDomain: 'localhost:4200',
  productionDomain: 'github.com',
});

const LOCAL_HOSTNAMES = Object.freeze(['localhost', '127.0.0.1', '0.0.0.0', '::1']);

/** Load the stored configuration, falling back to defaults for blank values. */
export async function loadConfig() {
  const stored = await chrome.storage.sync.get(CONFIG_DEFAULTS);
  return {
    developmentDomain:
      normalizeDomain(stored.developmentDomain) || CONFIG_DEFAULTS.developmentDomain,
    productionDomain:
      normalizeDomain(stored.productionDomain) || CONFIG_DEFAULTS.productionDomain,
  };
}

/** Persist the configuration, applying defaults for blank values. */
export async function saveConfig(config) {
  await chrome.storage.sync.set({
    developmentDomain:
      normalizeDomain(config.developmentDomain) || CONFIG_DEFAULTS.developmentDomain,
    productionDomain:
      normalizeDomain(config.productionDomain) || CONFIG_DEFAULTS.productionDomain,
  });
}

/** Strip protocol, path, trailing slashes and whitespace; keep host and port. */
export function normalizeDomain(value) {
  const raw = String(value ?? '').trim();
  if (raw === '') {
    return '';
  }
  const withoutProtocol = raw.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '');
  return withoutProtocol.replace(/\/.*$/, '').replace(/\/+$/, '').trim();
}

/** Hostname portion of a "host[:port]" string, brackets stripped for IPv6. */
const hostnameOf = (hostWithPort) =>
  String(hostWithPort)
    .replace(/:\d+$/, '')
    .replace(/^\[|\]$/g, '')
    .toLowerCase();

const isLocalHostname = (hostname) => LOCAL_HOSTNAMES.includes(hostname.toLowerCase());

/** Pick a scheme for a target host: http for local hosts, https otherwise. */
const schemeFor = (hostWithPort) =>
  isLocalHostname(hostnameOf(hostWithPort)) ? 'http' : 'https';

/**
 * Compute the toggled URL, or return a reason why toggling is impossible.
 * @returns {{ url: string } | { error: string }}
 */
export function toggleUrl(currentUrl, config) {
  const dev = normalizeDomain(config?.developmentDomain) || CONFIG_DEFAULTS.developmentDomain;
  const prod = normalizeDomain(config?.productionDomain) || CONFIG_DEFAULTS.productionDomain;

  let parsed;
  try {
    parsed = new URL(currentUrl);
  } catch {
    return { error: 'invalid-url' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { error: 'unsupported-scheme' };
  }

  const suffix = `${parsed.pathname}${parsed.search}${parsed.hash}`;
  const host = parsed.host.toLowerCase();

  if (host === dev.toLowerCase()) {
    return { url: `${schemeFor(prod)}://${prod}${suffix}` };
  }

  if (host === prod.toLowerCase()) {
    return { url: `${schemeFor(dev)}://${dev}${suffix}` };
  }

  return { error: 'host-mismatch', dev, prod, actualHost: parsed.host };
}
