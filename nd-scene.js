// <nd-scene kind="…"> — animated isometric compositions built from assets/icons. Shadow DOM; respects reduced motion.
(function () {
  const I = (n) => `assets/icons/${n}.png`;
  // Each scene: items [icon, left%, top%, size% of width, delay s, z]; accent = small live detail
  const SCENES = {
    emergency: { items: [['emergency-call', 10, 10, 44, 0, 2], ['chair-wrench', 48, 30, 50, .8, 1]], accent: 'pulse', label: 'Techs on call' },
    repair: { items: [['compressor', 4, 38, 46, 0, 2], ['chair-wrench', 44, 6, 42, .6, 1], ['handpiece', 58, 54, 34, 1.2, 3]], accent: 'gauge', label: 'Pressure restored' },
    maintenance: { items: [['sterilizer', 6, 30, 46, 0, 1], ['calendar-check', 50, 8, 44, .7, 2], ['clipboard', 58, 50, 32, 1.3, 3]], accent: 'ticks', label: 'Monthly · every unit' },
    equipment: { items: [['compressor', 2, 44, 40, 0, 1], ['vacuum-pump', 36, 24, 30, .5, 1], ['chair-wrench', 60, 36, 38, 1, 2], ['handpiece', 28, 58, 26, 1.5, 3]], accent: 'none', label: 'Large & small equipment' },
    mailin: { items: [['handpiece', 6, 14, 40, 0, 1], ['shipping-box', 40, 34, 44, .6, 2], ['handpiece-check', 68, 6, 30, 1.2, 3]], accent: 'route', label: 'Ship it · we fix it' },
    team: { items: [['chair-wrench', 8, 24, 44, 0, 1], ['installation', 52, 12, 42, .7, 2]], accent: 'none', label: 'Certified technicians' },
    bench: { items: [['handpiece', 10, 34, 46, 0, 1], ['scaler', 52, 10, 38, .7, 2], ['curing-light', 60, 52, 32, 1.3, 3]], accent: 'none', label: 'Small equipment, bench repaired' },
    support: { items: [['clipboard', 10, 16, 40, 0, 1], ['price-estimate', 54, 40, 40, .7, 2]], accent: 'none', label: 'Estimate first' },
  };
  const CSS = `
:host{display:block;position:relative;width:100%;height:100%;overflow:hidden;border-radius:inherit;background:#F4F8FB;background-image:radial-gradient(#D5E1EB 1.4px,transparent 1.4px);background-size:22px 22px;font-family:Manrope,Helvetica,Arial,sans-serif}
.glow{position:absolute;inset:-20%;background:radial-gradient(ellipse at 50% 60%,rgba(45,143,213,.14),rgba(18,152,75,.06) 45%,transparent 70%);pointer-events:none}
.it{position:absolute;will-change:transform;animation:float 6s ease-in-out infinite;filter:drop-shadow(0 28px 26px rgba(10,40,70,.18))}
.it img{width:100%;height:auto;display:block}
.sh{position:absolute;height:6%;border-radius:50%;background:radial-gradient(rgba(10,40,70,.22),transparent 70%);animation:shade 6s ease-in-out infinite}
.lb{position:absolute;z-index:6;left:14px;bottom:14px;display:flex;align-items:center;gap:9px;background:#fff;border-radius:999px;padding:9px 14px;font-size:13px;font-weight:700;color:#1F2933;box-shadow:0 12px 30px rgba(10,40,70,.12);white-space:nowrap;max-width:calc(100% - 28px);overflow:hidden;text-overflow:ellipsis}
.lb i{width:8px;height:8px;border-radius:50%;background:#12984B;animation:pulse 2.2s infinite}
.ring{position:absolute;border-radius:50%;border:2px solid #12984B;animation:ring 2.4s ease-out infinite;opacity:0}
.route{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none}
.route path{stroke:#2D8FD5;stroke-width:3;fill:none;stroke-dasharray:8 10;animation:dash 1.6s linear infinite}
.tick{position:absolute;z-index:4;width:24px;height:24px;border-radius:50%;background:#12984B;display:flex;align-items:center;justify-content:center;transform:scale(0);animation:tick 5s ease-out infinite}
.gauge{position:absolute;z-index:5;left:14px;top:14px;width:76px;height:76px;border-radius:50%;background:#fff;box-shadow:0 12px 30px rgba(10,40,70,.12);display:flex;align-items:center;justify-content:center}
.gauge svg{width:64px;height:64px;overflow:visible}
.gauge .n{transform-origin:32px 32px;animation:needle 6s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-3.5%)}}
@keyframes shade{0%,100%{transform:scaleX(1);opacity:.9}50%{transform:scaleX(.86);opacity:.6}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(18,152,75,.45)}70%{box-shadow:0 0 0 8px rgba(18,152,75,0)}}
@keyframes ring{0%{transform:scale(.5);opacity:.9}100%{transform:scale(1.6);opacity:0}}
@keyframes dash{to{stroke-dashoffset:-36}}
@keyframes tick{0%,10%{transform:scale(0)}20%,85%{transform:scale(1)}95%,100%{transform:scale(0)}}
@keyframes needle{0%,100%{transform:rotate(-100deg)}45%,65%{transform:rotate(60deg)}}
@media (prefers-reduced-motion:reduce){.it,.sh,.lb i,.ring,.route path,.tick,.gauge .n{animation:none}.tick{transform:scale(1)}.gauge .n{transform:rotate(60deg)}}`;
  class NDScene extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); }
    connectedCallback() {
      const sc = SCENES[this.getAttribute('kind')] || SCENES.equipment;
      const label = this.getAttribute('label') || sc.label;
      const items = sc.items.map(([n, l, t, w, d, z]) => `<div class="sh" style="left:${l + w * 0.12}%;top:${t + w * 0.98}%;width:${w * 0.76}%;animation-delay:${d}s"></div><div class="it" style="left:${l}%;top:${t}%;width:${w}%;z-index:${z};animation-delay:${d}s"><img src="${I(n)}" alt="" loading="lazy"></div>`).join('');
      let accent = '';
      if (sc.accent === 'pulse') accent = `<div class="ring" style="left:14%;top:4%;width:36%;aspect-ratio:1"></div><div class="ring" style="left:14%;top:4%;width:36%;aspect-ratio:1;animation-delay:1.2s"></div>`;
      if (sc.accent === 'gauge') accent = `<div class="gauge"><svg viewBox="0 0 64 64"><path d="M10 46 A26 26 0 1 1 54 46" stroke="#E1ECF4" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M32 46 A26 26 0 0 1 54 46" stroke="#12984B" stroke-width="7" fill="none" stroke-linecap="round"/><line class="n" x1="32" y1="32" x2="32" y2="12" stroke="#1F2933" stroke-width="3.5" stroke-linecap="round"/><circle cx="32" cy="32" r="4" fill="#1F2933"/></svg></div>`;
      if (sc.accent === 'ticks') accent = [0, 1, 2].map(i => `<div class="tick" style="left:${30 + i * 9}%;top:${18 + i * 7}%;animation-delay:${i * 0.5}s"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>`).join('');
      if (sc.accent === 'route') accent = `<svg class="route" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M26 42 C 40 70, 50 30, 62 56 S 80 30, 84 24"/></svg>`;
      this.shadowRoot.innerHTML = `<style>${CSS}</style><div class="glow"></div>${items}${accent}<div class="lb"><i></i>${label}</div>`;
    }
  }
  if (!customElements.get('nd-scene')) customElements.define('nd-scene', NDScene);
})();
