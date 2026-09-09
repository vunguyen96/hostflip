# HostFlip

HostFlip is a small, privacy-first Chrome and Microsoft Edge extension that
switches the active tab between a development host and a production host while
preserving its path, query string, and hash.

```text
http://localhost:4200/orders/42?tab=lines#top
        press Alt+Shift+V
https://github.com/orders/42?tab=lines#top
```

## Why HostFlip?

Moving between a local app and its deployed version usually means editing the
same URL by hand. HostFlip makes that transition one keyboard shortcut away.
It performs the URL transformation locally in the browser and does not collect
or transmit browsing data.

## Features

- Configure a development host and a production host, including ports.
- Sensible defaults work immediately: `localhost:4200` and `github.com`.
- Preserve the path, query string, and hash when switching.
- Use an optional browser keyboard shortcut (suggested default: `Alt+Shift+V`).
- Open settings by clicking the toolbar icon.
- Show a helpful message instead of navigating when the current host does not
  match either configured host.
- Use `http` for local hosts and `https` for other hosts.

## Install for development

HostFlip is currently distributed as an unpacked extension for local use.

1. Clone or download this repository.
2. Open `chrome://extensions` in Chrome or `edge://extensions` in Edge.
3. Enable **Developer mode**.
4. Select **Load unpacked** and choose the repository folder.
5. Configure your hosts from the settings page. It opens after installation, or
   you can click the HostFlip toolbar icon.

The extension has no build step or package installation. Changes to the
extension files can be tested by selecting **Reload** on its extensions page.

## Configure and use

1. Enter the development and production hosts without a protocol, for example
   `localhost:4200` and `app.example.com`.
2. Click **Save configuration**.
3. Set or change the shortcut from the settings page, or from:
   - Chrome: `chrome://extensions/shortcuts`
   - Edge: `edge://extensions/shortcuts`
4. Open a page on either configured host and press the shortcut.

Host comparison includes the port, so `localhost:4200` and `localhost:3000`
are different hosts. Only `http` and `https` pages can be toggled.

## Privacy and permissions

HostFlip stores only the two configured hosts using the browser's
`storage.sync` API. It does not collect, sell, or transmit personal data.
URLs are read and transformed locally only when you invoke the toggle.

The extension requests these permissions:

| Permission | Purpose |
| --- | --- |
| `storage` | Save the configured hosts. |
| `tabs` | Read and navigate the active tab. |
| `scripting` | Show an on-page message when a toggle is unavailable. |
| `notifications` | Provide a fallback message on restricted pages. |

Read the full [privacy policy](PRIVACY.md) for details.

## Project structure

| File | Purpose |
| --- | --- |
| `manifest.json` | Manifest V3 metadata, permissions, action, and command. |
| `background.js` | Service worker for the toolbar action and shortcut. |
| `toggle.js` | Shared configuration and URL-toggling logic. |
| `options.html` | Settings page markup. |
| `options.css` | Settings page styling. |
| `options.js` | Settings page behavior. |
| `icons/` | Extension icons. |

## Contributing

Contributions are welcome, including bug reports, documentation improvements,
accessibility fixes, browser compatibility feedback, and new features. Please
read [CONTRIBUTING.md](CONTRIBUTING.md) before opening an issue or pull
request. By participating, you agree to follow the
[Code of Conduct](CODE_OF_CONDUCT.md).

## Support and security

- For questions and usage help, see [SUPPORT.md](SUPPORT.md).
- For bugs and feature ideas, use the repository's issue tracker.
- For security concerns, follow [SECURITY.md](SECURITY.md) rather than posting
  sensitive details publicly.

## License

HostFlip is released under the [MIT License](LICENSE).
