# Recycle

A simple looped timer web app to remind you to recycle your characters while camping Ant Queen.

**Live app:** https://haswelldev.github.io/recycle/

## Usage

1. Pick a loop duration (default 5 minutes).
2. Pick a sound (default "nihao").
3. Click **Start**. When the timer hits zero it plays the sound and automatically restarts.
4. **Pause** stops the countdown; **Reset** returns it to the selected duration.

## Development

No build step — plain HTML/CSS/JS. Just open `index.html` in a browser, or serve the
directory locally:

```sh
python3 -m http.server
```

## Deployment

Deployed automatically to GitHub Pages via [GitHub Actions](.github/workflows/deploy.yml)
on every push to `main`.

## License

Licensed under the [GNU General Public License v3.0](LICENSE).

---

Made for Veridis Quo with Love.
