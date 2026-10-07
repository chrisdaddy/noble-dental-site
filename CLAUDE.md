# Noble Dental site — notes for Claude Code

- Static HTML, zero build. Deploy root to Vercel (preset: Other).
- Pages render through `support.js`; shared header/footer/CTA are `nd-nav.dc.html`, `nd-footer.dc.html`, `nd-cta.dc.html` fetched at runtime — never delete or rename them.
- Styling is inline on every element by design. Brand: blue #2D8FD5, green #12984B, white, soft blue-grey #F1F7FC, charcoal text #1F2933, muted #5A6B78, hairlines #E1ECF4. **Never introduce navy.** Headlines Poppins 600, body Manrope.
- Nav links are charcoal with a green underline on hover/active — don't make them blue.
- Icons: `assets/icons/*.png` (1024px, transparent). Logo: `assets/logo/` (nd-mark, nd-lockup, nd-horizontal; -white variants for colored grounds).
- Work through TODO.md before launch.
