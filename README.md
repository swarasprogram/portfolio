# Swarada Joshi — Portfolio

A fast, animated, single-page portfolio. No build step — pure HTML, CSS, and vanilla JS with a Three.js (CDN) WebGL background.

## Features
- 🌌 Three.js particle sphere + floating wireframe torus knot, reacting to mouse & scroll
- ✨ Custom magnetic cursor, tilt cards, project spotlight glow
- ⌨️ Typing role rotator, animated stat counters, scroll-reveal sections
- 📊 Page loader, scroll progress bar, sticky nav, mobile menu
- ♿ Respects `prefers-reduced-motion`; fully responsive

## Files
- `index.html` — markup & content
- `styles.css` — all styling/animations
- `script.js` — interactions + WebGL background

## Run locally
```bash
cd swarada-portfolio
python3 -m http.server 4599
# open http://localhost:4599
```
Or just open `index.html` in a browser.

## Deploy to GitHub Pages
```bash
cd swarada-portfolio
git init && git add . && git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/swarasprogram/portfolio.git
git push -u origin main
```
Then in the repo: **Settings → Pages → Source: `main` / root**. Site goes live at
`https://swarasprogram.github.io/portfolio/`.

> Tip: name the repo `swarasprogram.github.io` to serve it at the root domain
> `https://swarasprogram.github.io/`.

## Links wired in
- GitHub: https://github.com/swarasprogram
- LinkedIn: https://www.linkedin.com/in/swarada2410/
- LeetCode: https://leetcode.com/u/swara2410/
- Email: swaradajoshi05@gmail.com
- Project repos: FinSmart, assist-med-vision, UrbanCare, Companio, Kalarthi, prep-partner
