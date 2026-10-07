// <nd-video src="…" poster="…" label="…"> — muted autoplay-when-visible loop with tap-to-unmute.
// Renders into shadow DOM so the page runtime never fights over its children. No src → labeled placeholder.
(function () {
  const PHONE = '<svg width="22" height="22" viewBox="0 0 24 24" fill="#2D8FD5"><path d="M8 5v14l11-7z"></path></svg>';
  const SPK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
  class NDVideo extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); }
    connectedCallback() {
      const src = this.getAttribute('src') || '', poster = this.getAttribute('poster') || '', label = this.getAttribute('label') || 'Explainer video';
      const css = ':host{display:block;position:relative;width:100%;height:100%;background:#F1F7FC;overflow:hidden;font-family:Manrope,Helvetica,Arial,sans-serif}';
      if (!src) {
        this.shadowRoot.innerHTML = `<style>${css}</style><div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;border:1.5px dashed #C9D6E0;border-radius:inherit;color:#5A6B78;font-size:14px;font-weight:600;line-height:1.4;text-align:center;padding:24px;box-sizing:border-box"><span style="width:64px;height:64px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 12px 30px rgba(10,40,70,.12)">${PHONE}</span><span>${label}</span><span style="font-weight:500;font-size:12px;color:#7A8894">Set src on &lt;nd-video&gt; to the exported MP4</span></div>`;
        return;
      }
      this.shadowRoot.innerHTML = `<style>${css}</style><video src="${src}"${poster ? ` poster="${poster}"` : ''} muted loop playsinline preload="metadata" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block"></video><button type="button" aria-label="Unmute" style="position:absolute;right:16px;bottom:16px;height:40px;padding:0 14px;border-radius:999px;border:0;background:rgba(255,255,255,.94);color:#1F2933;font:700 13px/1 Manrope,Helvetica,Arial,sans-serif;display:flex;align-items:center;gap:8px;cursor:pointer;box-shadow:0 10px 30px rgba(10,40,70,.18)">${SPK}<span>Sound</span></button>`;
      const v = this.shadowRoot.querySelector('video'), b = this.shadowRoot.querySelector('button');
      b.addEventListener('click', () => { v.muted = !v.muted; b.querySelector('span').textContent = v.muted ? 'Sound' : 'Mute'; b.setAttribute('aria-label', v.muted ? 'Unmute' : 'Mute'); if (v.paused) v.play().catch(() => {}); });
      if ('IntersectionObserver' in window) new IntersectionObserver((en) => en.forEach(e => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }), { threshold: 0.35 }).observe(this);
      else v.play().catch(() => {});
    }
  }
  if (!customElements.get('nd-video')) customElements.define('nd-video', NDVideo);
})();
