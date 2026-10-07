# Noble Dental — website

Static marketing site for Noble Dental (a Noble Med company), Oklahoma City. Nine pages, no build step.

## Deploy (Vercel)
1. Push this folder to GitHub.
2. Vercel → New Project → import repo → Framework preset **Other**, build command empty, output directory `.` (root).
3. Deploy. `vercel.json` enables clean URLs (`/services`, not `/services.html`) and long-cache headers for images/JS.

Routes: `/` · `/services` · `/emergency-calls` · `/equipment-repair` · `/monthly-maintenance` · `/work-order` · `/request-service` · `/why-noble` · `/contact`

## How it works
- Each page is a plain HTML file. `support.js` is a small runtime that renders the `<x-dc>` template (inline-styled markup with `{{ }}` holes, `<sc-if>`/`<sc-for>` control flow) and mounts shared partials via `<dc-import name="nd-nav">` → `nd-nav.dc.html`, `nd-footer.dc.html`, `nd-cta.dc.html`. **Keep the three `nd-*.dc.html` partials** — pages fetch them at runtime.
- `nd-site.js` — scroll-reveal + header shadow. `image-slot.js` — dashed photo placeholders (`<image-slot>`); harmless in production, swap for `<img>` when photos land.
- `nd-map.html` — service-area map (Leaflet, iframe on /contact).
- Fonts: Google Fonts (Poppins, Manrope, Instrument Serif) loaded per page.

## Before launch — see TODO.md
