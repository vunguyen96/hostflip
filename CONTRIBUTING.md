# Contributing to HostFlip

Thank you for taking the time to contribute. HostFlip is a small project, so
clear reports, focused pull requests, and thoughtful documentation are all
especially valuable.

## Before you start

1. Search existing issues and pull requests before opening a new one.
2. For a large change, open an issue first so the approach can be discussed.
3. Keep changes focused. A pull request should solve one problem when possible.

## Local development

HostFlip has no build step and no external runtime dependencies.

1. Fork the repository and clone your fork.
2. Make your change using plain JavaScript, HTML, and CSS.
3. Load the repository as an unpacked extension in Chrome or Edge.
4. Reload the extension after changes.
5. Exercise both the changed behavior and the surrounding flow manually.

When testing URL toggling, check paths, query strings, hashes, ports, local
hosts, unsupported browser pages, and hosts that match neither configuration.
Do not use real secrets or private browsing data in screenshots or examples.

## Code guidelines

- Prefer small, readable functions and the existing project patterns.
- Preserve Manifest V3 compatibility in both Chrome and Edge.
- Keep permissions minimal and document any permission change.
- Do not add analytics, remote code, or data collection without an explicit
  design discussion and privacy update.
- Keep user-facing text clear, friendly, and accessible.
- Update the README or privacy policy when behavior or permissions change.

## Pull requests

Please include:

- A concise description of the problem and solution.
- Steps used to test the change in Chrome or Edge.
- Screenshots or short recordings for visible UI changes, with sensitive data
  removed.
- Notes about changed permissions, privacy implications, or compatibility.

Pull requests should be ready for review, avoid unrelated formatting changes,
and explain any behavior that reviewers may not infer from the diff.

## Commit messages

Use a short, imperative subject line, such as:

```text
Improve error message for unsupported pages
```

## Questions

If you are unsure about an approach, open an issue or discussion and describe
what you tried. New contributors are welcome.
