# Wii U GamePad Sync Helper

A small React + TypeScript web app for syncing a Wii U GamePad when you **can't see the TV**, for example because the HDMI port is broken.

When you sync a GamePad, the console shows a 4-symbol code made of ♠ ♥ ♦ ♣ on the TV, and you enter it on the GamePad. Without a picture, the only option is to try all **4⁴ = 256** combinations. This app takes you through them one at a time.

## Features

- **Guided mode:** shows one large code at a time with *Back*, *Didn't work → Next* and *It worked!* buttons. Keyboard: `Space`/`Enter`/`→` for next, `←` for back.
- **Full list:** all 256 combinations in a grid. Click one to jump to it, or use its checkbox to mark it tried or untried. You can also hide codes you've already tried.
- **Progress:** a progress bar, saved in `localStorage`, so closing the tab doesn't lose your place.
- **Works on phones:** a large *Next* button, touch targets of at least 44px, no double-tap zoom, safe-area padding for notched phones, and short vibration feedback where the phone supports it. Tapping a code in the list scrolls back up to the current code.
- **Keeps the screen on** (on browsers that support it), so your phone doesn't lock while you're entering codes on the GamePad.
- Built-in step-by-step sync instructions.

## Development

```bash
npm install
npm run dev      # start dev server
npm test         # run unit tests (Vitest)
npm run lint     # oxlint
npm run build    # production build to dist/
```

## Deploying to GitHub Pages

The workflow in [.github/workflows/deploy.yml](.github/workflows/deploy.yml) lints, tests, builds, and deploys the app every time you push to `main`.

1. Push this repository to GitHub.
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main`, or run the workflow by hand from the **Actions** tab.

`vite.config.ts` uses `base: './'`, so the site works at `https://<user>.github.io/<repo>/` whatever the repository is called.
