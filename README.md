# qobiloga.github.io

My personal site — **[qobiloga.github.io](https://qobiloga.github.io)**

A one-page portfolio: a sticky profile column on the left, sections scrolling
past on the right, over an animated backdrop built from programming notation.

## What it is built from

Plain HTML, CSS and JavaScript. No framework, no bundler, no build step — what
is in this repository is exactly what the browser gets.

```
index.html              markup and copy
assets/css/style.css    all styling, one file
assets/js/main.js       theme, language, section nav, drawer, portfolio dialog
assets/img/             portraits, project covers, icons
```

## A few things worth knowing

**Light by default.** The page opens in light mode for every visitor, whatever
the operating system prefers. Dark is opt-in and remembered in `localStorage`.

**English by default.** The markup ships in English and carries `data-i18n`
keys; the Uzbek dictionary lives in `main.js`. The English strings are read
back out of the DOM at load, so no copy is written twice. Product and
technology names stay untranslated in both languages.

**One backdrop, always moving.** A graph-paper grid, a clock signal that traces
itself, a network graph and a binary tree, with programming notation drifting
over them. Everything animates `transform`, `opacity` or `stroke-dashoffset`
only, and the whole layer sits behind the page on a negative `z-index`.

**Responsive down to 320px.** Below 980px the sidebar unwraps: the portrait
moves up beside the name and the section links become a drawer that slides in
from the left.

**`prefers-reduced-motion` is respected** — every animation stops for visitors
who ask for that.

## Running it locally

No tooling required. Serve the folder over HTTP:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` straight from the file
system mostly works, but a couple of browser features behave better over HTTP.

## Deployment

GitHub Pages serves `master` from the repository root. Pushing to `master`
publishes the site.
