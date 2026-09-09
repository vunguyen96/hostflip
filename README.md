# HostFlip

A tiny Chrome/Edge (Manifest V3) browser extension that toggles the current tab
between your **development domain** and your **production domain**, preserving the
path, query string and hash.

```
http://localhost:4200/orders/42?tab=lines#top
        (press the shortcut)
https://github.com/orders/42?tab=lines#top
```

## Features

- Configure a **development domain** and a **production domain**.
  Configuration is **optional** — sensible defaults apply out of the box:
  - Development domain default: `localhost:4200`
  - Production domain default: `github.com`
- Optional keyboard shortcut (suggested default: `Alt+Shift+V`).
- **Clicking the toolbar icon opens the settings page** to update the
  development domain, production domain and shortcut.
- **Toggle by pressing the keyboard shortcut.**
- Keeps everything after the host (path, `?query`, `#hash`).
- If the current host matches neither domain, a message pops up **on the page**
  (with an OS-notification fallback) instead of navigating.

## Install (unpacked)

1. Open `chrome://extensions` (or `edge://extensions`).
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `HostFlip` folder.
4. It works immediately with the defaults. To customise, open the settings page
   (it opens automatically on install, or click the toolbar icon) and set:
   - **Development domain**, e.g. `localhost:4200` or `dev.example.com`
   - **Production domain**, e.g. `github.com` or `app.example.com`
5. Click **Save configuration**.

## Set / change the keyboard shortcut

The shortcut is optional. Set or change it at:

- Chrome: `chrome://extensions/shortcuts`
- Edge: `edge://extensions/shortcuts`

The **Change shortcut…** button on the settings page opens that page for you.

## How toggling works

Press the keyboard shortcut to toggle. Clicking the toolbar icon opens the
settings page instead. The host comparison includes the port, so
`localhost:4200` and `localhost:3000` are treated as different hosts.

| Current page host       | Result                                     |
| ----------------------- | ------------------------------------------ |
| your development domain | Switches to the production domain          |
| your production domain  | Switches to the development domain         |
| any other host          | No change; a message explains the mismatch |

The target scheme is chosen automatically: `http` for local hosts
(`localhost`, `127.0.0.1`, `0.0.0.0`, `::1`), `https` otherwise. Only
`http`/`https` pages can be toggled.

## Files

| File            | Purpose                                            |
| --------------- | -------------------------------------------------- |
| `manifest.json` | Extension manifest (MV3), action + command.        |
| `background.js` | Service worker: handles click, shortcut, messages. |
| `toggle.js`     | Shared config + URL-toggling logic.                |
| `options.html`  | Settings / configuration page.                     |
| `options.css`   | Styling for the settings page.                     |
| `options.js`    | Settings page behaviour.                            |
| `icons/`        | Toolbar and store icons.                           |
