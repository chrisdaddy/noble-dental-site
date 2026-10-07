// Noble Dental site helpers: scroll reveal + header shadow. No-JS = everything visible.
(function () {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function reveal(root) {
    root = root || document;
    const els = Array.from(root.querySelectorAll('[data-reveal]:not([data-revealed])'));
    if (!els.length) return;
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(e => e.setAttribute('data-revealed', '1')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const d = parseInt(el.getAttribute('data-reveal') || '0', 10) || 0;
        el.style.transition = 'opacity .7s cubic-bezier(.2,.7,.2,1) ' + d + 'ms, transform .8s cubic-bezier(.2,.7,.2,1) ' + d + 'ms';
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.setAttribute('data-revealed', '1');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9) { el.setAttribute('data-revealed', '1'); return; }
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.willChange = 'opacity,transform';
      io.observe(el);
    });
  }
  function headerShadow(el) {
    if (!el) return;
    const on = () => { el.style.boxShadow = window.scrollY > 8 ? '0 10px 30px rgba(31,41,51,.08)' : 'none'; };
    window.addEventListener('scroll', on, { passive: true }); on();
  }
  window.NDSite = { reveal, headerShadow };
})();
