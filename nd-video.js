/* nd-video.js — <nd-video src poster label>
   Noble Dental explainer video web component. Shadow DOM, inline styles only (no stylesheet).
   - Muted autoplay once ≥35% of the element is in view; pauses when it scrolls off-screen.
   - Tap-to-unmute button, bottom-right.
   - If `src` is empty/missing, renders a labeled dashed placeholder (like <image-slot>).
   Usage: <nd-video src="./assets/video/x.mp4" poster="./assets/video/x.jpg" label="Explainer — 30 sec"></nd-video>
   Put it inside a wrapper that sets the aspect-ratio / border-radius / overflow:hidden. */
(function () {
  'use strict';
  if (!window.customElements || customElements.get('nd-video')) return;

  var SVG_OPEN = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var ICON_MUTED = SVG_OPEN + '<path d="M11 5 6 9H2v6h4l5 4z"></path><path d="m23 9-6 6"></path><path d="m17 9 6 6"></path></svg>';
  var ICON_SOUND = SVG_OPEN + '<path d="M11 5 6 9H2v6h4l5 4z"></path><path d="M15.5 8.5a5 5 0 0 1 0 7"></path><path d="M19 5a9 9 0 0 1 0 14"></path></svg>';
  var ICON_PLAY = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"></path></svg>';

  var IN_VIEW_RATIO = 0.35;

  function NdVideo() {
    var self = Reflect.construct(HTMLElement, [], NdVideo);
    self.attachShadow({ mode: 'open' });
    self._io = null;
    self._video = null;
    self._btn = null;
    self._inView = false;
    self._onIntersect = self._onIntersect.bind(self);
    self._toggleMute = self._toggleMute.bind(self);
    self._hostMo = null;
    return self;
  }
  NdVideo.prototype = Object.create(HTMLElement.prototype);
  NdVideo.prototype.constructor = NdVideo;
  Object.setPrototypeOf(NdVideo, HTMLElement);

  Object.defineProperty(NdVideo, 'observedAttributes', { get: function () { return ['src', 'poster', 'label']; } });

  // The page runtime (support.js) rewrites inline `style` on template elements after upgrade,
  // which can wipe the host box. Apply the host style inline and re-apply if it gets cleared.
  NdVideo.prototype._applyHostStyle = function () {
    var st = this.style;
    if (st.display === 'block' && st.position === 'relative' && st.width === '100%' && st.height === '100%') return;
    st.display = 'block';
    st.position = 'relative';
    st.width = '100%';
    st.height = '100%';
  };

  NdVideo.prototype.connectedCallback = function () {
    var self = this;
    this._applyHostStyle();
    if (!this._hostMo && 'MutationObserver' in window) {
      this._hostMo = new MutationObserver(function () { self._applyHostStyle(); });
      this._hostMo.observe(this, { attributes: true, attributeFilter: ['style'] });
    }
    this._render();
  };
  NdVideo.prototype.disconnectedCallback = function () {
    if (this._hostMo) { this._hostMo.disconnect(); this._hostMo = null; }
    this._teardown();
  };
  NdVideo.prototype.attributeChangedCallback = function () { if (this.isConnected) this._render(); };

  NdVideo.prototype._teardown = function () {
    if (this._io) { this._io.disconnect(); this._io = null; }
    if (this._video) {
      try { this._video.pause(); } catch (e) { /* ignore */ }
      this._video.removeAttribute('src');
      try { this._video.load(); } catch (e) { /* ignore */ }
    }
    this._video = null;
    this._btn = null;
    this._inView = false;
  };

  NdVideo.prototype._render = function () {
    this._teardown();
    var root = this.shadowRoot;
    while (root.firstChild) root.removeChild(root.firstChild);

    var src = (this.getAttribute('src') || '').trim();
    var poster = (this.getAttribute('poster') || '').trim();
    var label = (this.getAttribute('label') || 'Video').trim();

    if (!src) { root.appendChild(this._placeholder(label)); return; }

    var video = document.createElement('video');
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('loop', '');
    video.setAttribute('preload', 'metadata');
    video.setAttribute('aria-label', label);
    video.setAttribute('title', label);
    if (poster) video.setAttribute('poster', poster);
    video.setAttribute('src', src);
    video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;background:#F1F7FC;';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.style.cssText = 'position:absolute;right:14px;bottom:14px;width:44px;height:44px;border-radius:50%;border:0;padding:0;margin:0;cursor:pointer;background:rgba(255,255,255,.92);color:#1F2933;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(10,40,70,.22);transition:transform .15s ease,background .15s ease;-webkit-tap-highlight-color:transparent;font:inherit;line-height:0;';
    btn.addEventListener('click', this._toggleMute);
    btn.addEventListener('mouseenter', function () { btn.style.transform = 'scale(1.06)'; btn.style.background = '#fff'; });
    btn.addEventListener('mouseleave', function () { btn.style.transform = ''; btn.style.background = 'rgba(255,255,255,.92)'; });

    root.appendChild(video);
    root.appendChild(btn);
    this._video = video;
    this._btn = btn;
    this._syncBtn();

    if ('IntersectionObserver' in window) {
      this._io = new IntersectionObserver(this._onIntersect, { threshold: [0, IN_VIEW_RATIO, 0.6, 1] });
      this._io.observe(this);
    } else {
      this._inView = true;
      this._play();
    }
  };

  NdVideo.prototype._placeholder = function (label) {
    var box = document.createElement('div');
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', label + ' (video placeholder)');
    box.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:24px;box-sizing:border-box;border:2px dashed #2D8FD5;border-radius:inherit;background:#F1F7FC;color:#5A6B78;font-family:Manrope,system-ui,sans-serif;text-align:center;';
    var ring = document.createElement('span');
    ring.style.cssText = 'width:64px;height:64px;border-radius:50%;background:#fff;color:#2D8FD5;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 10px 30px rgba(10,40,70,.12);';
    ring.innerHTML = ICON_PLAY;
    var text = document.createElement('span');
    text.textContent = label;
    text.style.cssText = 'font-family:Poppins,sans-serif;font-weight:600;font-size:clamp(15px,1.6vw,18px);color:#1F2933;letter-spacing:-.01em;';
    var sub = document.createElement('span');
    sub.textContent = 'Video placeholder — add src to <nd-video>';
    sub.style.cssText = 'font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#5A6B78;';
    box.appendChild(ring);
    box.appendChild(text);
    box.appendChild(sub);
    return box;
  };

  NdVideo.prototype._play = function () {
    var video = this._video;
    if (!video) return;
    var p = video.play();
    if (p && typeof p.catch === 'function') {
      p.catch(function () {
        // Autoplay with sound refused — fall back to muted and retry once.
        if (!video.muted) {
          video.muted = true;
          var again = video.play();
          if (again && typeof again.catch === 'function') again.catch(function () { /* give up quietly */ });
        }
      });
    }
  };

  NdVideo.prototype._onIntersect = function (entries) {
    var entry = entries[entries.length - 1];
    if (!entry || !this._video) return;
    var inView = entry.isIntersecting && entry.intersectionRatio >= IN_VIEW_RATIO;
    if (inView === this._inView) return;
    this._inView = inView;
    if (inView) this._play();
    else { try { this._video.pause(); } catch (e) { /* ignore */ } }
  };

  NdVideo.prototype._toggleMute = function (e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    var video = this._video;
    if (!video) return;
    video.muted = !video.muted;
    this._syncBtn();
    if (!video.muted && (video.paused || !this._inView)) this._play();
  };

  NdVideo.prototype._syncBtn = function () {
    var video = this._video, btn = this._btn;
    if (!video || !btn) return;
    var muted = video.muted;
    btn.innerHTML = muted ? ICON_MUTED : ICON_SOUND;
    btn.setAttribute('aria-label', muted ? 'Unmute video' : 'Mute video');
    btn.setAttribute('title', muted ? 'Tap to unmute' : 'Mute');
    btn.setAttribute('aria-pressed', muted ? 'false' : 'true');
  };

  customElements.define('nd-video', NdVideo);
})();
