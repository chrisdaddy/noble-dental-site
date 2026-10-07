# Launch checklist

## Replace placeholders (find-and-replace across *.html + nd-*.dc.html)
- [ ] `(405) 000-0000` and `tel:4050000000` → real phone
- [ ] `service@nobledental.com` → real email
- [ ] `[Street address]` / `[ZIP]` (work-order.html, contact.html) → shop address
- [ ] `href="#"` on **Client Portal** links (nav, footer, home, contact, request-service) → portal URL
- [ ] `href="#"` on Facebook / Instagram (footer, contact) → real URLs, or remove
- [ ] `nobledental.com` in footer/CTA copy → real domain
- [ ] Service Terms & Privacy links (footer) → pages or remove

## Photos (dashed `<image-slot>` placeholders → `<img>`)
- [ ] index: hero (`nd-hero`), equipment close-up (`nd-equipment-photo`), maintenance (`nd-maint-photo`)
- [ ] services: hero + 3 section photos
- [ ] emergency-calls / equipment-repair / monthly-maintenance: hero photo each
- [ ] why-noble: 3 team photos
Replace each `<image-slot …></image-slot>` with `<img src="…" alt="…" style="width:100%;height:100%;object-fit:cover;display:block">`. Hero on index sits behind a blue→green multiply overlay — any bright photo/video works.

## Forms (currently simulate submit in the page logic class)
- [ ] request-service.html — wire `submit` handler to Formspree / Resend / your backend
- [ ] work-order.html — same; also needs real file upload + return-label generation (or link to shipping provider)

## Nice-to-have
- [x] Favicon + apple-touch-icon (PNG, generated from `assets/logo/nd-mark.png`: `favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png`)
- [ ] OG image: `assets/logo/nd-lockup.png` is set; consider a 1200×630 branded card
- [ ] Analytics — enable Web Analytics on the Vercel project, then add `<script defer src="/_vercel/insights/script.js"></script>` to every page
- [x] sitemap.xml + robots.txt — currently point at `noble-dental-site-opal.vercel.app`; swap to the custom domain when it's attached
- [ ] Explainer video embed (export from the design project) on index between intro and services, and in the services hero
