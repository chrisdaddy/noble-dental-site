# Noble Dental site — notes for Claude Code

- Static HTML, zero build. Deploy root to Vercel (preset: Other).
- Pages render through `support.js`; shared header/footer/CTA are `nd-nav.dc.html`, `nd-footer.dc.html`, `nd-cta.dc.html` fetched at runtime — never delete or rename them.
- Styling is inline on every element by design. Brand: blue #2D8FD5, green #12984B, white, soft blue-grey #F1F7FC, charcoal text #1F2933, muted #5A6B78, hairlines #E1ECF4. **Never introduce navy.** Headlines Poppins 600, body Manrope.
- Nav links are charcoal with a green underline on hover/active — don't make them blue.
- Icons: `assets/icons/*.png` (1024px, transparent). Logo: `assets/logo/` (nd-mark, nd-lockup, nd-horizontal; -white variants for colored grounds).
- Work through TODO.md before launch.
- `nd-scene.js` — `<nd-scene kind="…">` animated isometric compositions (kinds: emergency, repair, maintenance, equipment, mailin, team, bench, support). Shadow DOM; keep it.
- Mobile: each page's `<style>` ends with a `@media (max-width:640px)` block that overrides inline styles (needs `!important`) via `data-m` hooks — `hero` (home hero grid), `ctas` (button rows → full-width stacked), `help` (home "Get help today" cards) — plus 16px form controls and full-width submit buttons. Add `data-m="ctas"` to any new CTA row.
