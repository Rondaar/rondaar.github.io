# rondaar.github.io

My portfolio, live at https://rondaar.github.io.

It's one page written by hand in plain HTML, CSS and a few lines of JavaScript. No framework and no build step, so what you see in the repo is exactly what GitHub Pages serves.

## Running it locally

Any static server works, for example:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Structure

- `index.html` - the whole page
- `css/style.css` - design tokens (colours, type, spacing) at the top, then layout and components
- `js/main.js` - highlights the current section in the sidebar and plays the clips only while they are on screen (a click pauses them)
- `fonts/` - Work Sans and Geist Mono, self-hosted as woff2 (SIL Open Font License, see the `OFL-*.txt` files)
- `media/` - images and video clips, plus `og-image.jpg` for link previews
- `favicon.ico`, `apple-touch-icon.png` - icons
