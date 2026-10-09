# Launch checklist

## Replace placeholders (find-and-replace across *.html + nd-*.dc.html)
- [x] Phone → (855) 505-2244 (Noble Med main line, `tel:8555052244`); form field examples use (405) 555-0123
- [x] Email → service@noblemedicalservice.com
- [ ] `[Street address]` / `[ZIP]` (work-order.html, contact.html) → shop address
- [ ] `href="#"` on **Client Portal** links (nav, footer, home, contact, request-service) → portal URL
- [ ] `href="#"` on Facebook / Instagram (footer, contact) → real URLs, or remove
- [x] Domain: www.nobledentalservice.com attached on Vercel; no `nobledental.com` copy remains
- [ ] Service Terms & Privacy links (footer) → pages or remove

## Photos
- [ ] index hero is a solid blue→green gradient for now. When real footage lands, insert `<div style="position:absolute;inset:0"><img|video … style="width:100%;height:100%;object-fit:cover"></div>` as the first child of `<section id="top">` and add `mix-blend-mode:multiply;opacity:.9` back onto the gradient div. Everything else uses animated `<nd-scene>` icon compositions.

## Forms (currently simulate submit in the page logic class)
- [ ] request-service.html — wire `submit` handler to Formspree / Resend / your backend
- [ ] work-order.html — same; also needs real file upload + return-label generation (or link to shipping provider)

## Nice-to-have
- [x] Favicon + apple-touch-icon (PNG, generated from `assets/logo/nd-mark.png`: `favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png`)
- [ ] OG image: `assets/logo/nd-lockup.png` is set; consider a 1200×630 branded card
- [ ] Analytics — enable Web Analytics on the Vercel project, then add `<script defer src="/_vercel/insights/script.js"></script>` to every page
- [x] sitemap.xml + robots.txt → https://www.nobledentalservice.com (apex 308s to www)
