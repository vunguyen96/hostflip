# HostFlip Privacy Policy

_Last updated: 2026-09-09_

HostFlip is a browser extension that toggles the current tab between a local
development server and a production domain.

## Data collection

HostFlip does **not** collect, store, sell, or transmit any personal data to the
developer or any third party.

## Data stored

The only data HostFlip stores is the configuration you enter on the setup page:

- the development domain (default `localhost:4200`)
- the production domain (default `github.com`)
- (optionally) your chosen keyboard shortcut, managed by the browser

This configuration is saved using the browser's `storage.sync` API. It stays in
your browser (and, if you are signed in, syncs across your own browser profiles
through your browser vendor). It is never sent to the developer.

## Permissions and why they are used

- **storage** — save your development domain and production domain.
- **tabs** — read the active tab's URL so it can be rewritten, and navigate the
  active tab to the toggled URL. URLs are processed locally and never stored or
  transmitted.
- **scripting** — display a short message on the current page (a toast) when the
  page cannot be toggled. The injected code only shows that message; it never
  reads or transmits page content.
- **notifications** — fallback message when an on-page toast cannot be shown
  (for example on browser-internal pages).

## Contact

For questions about this policy, open an issue on the project's repository.
