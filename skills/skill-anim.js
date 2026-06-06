/* Scroll/entrance animations + magnetic hover + glass header for skill pages */
(function () {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const header = document.querySelector('header');
    if (header) {
        const f = () => header.classList.toggle('scrolled', window.scrollY > 40);
        f();
        window.addEventListener('scroll', f, { passive: true });
    }

    // ---- Email mini-menu (Gmail / Copia / client predefinito) ----
    (function setupEmailMenu() {
        const triggers = document.querySelectorAll('[data-email]');
        if (!triggers.length) return;
        const ENV = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>';
        const COPY = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
        const menu = document.createElement('div');
        menu.className = 'email-menu';
        menu.setAttribute('role', 'menu');
        menu.innerHTML =
            '<button type="button" data-act="gmail">' + ENV + 'Apri in Gmail</button>' +
            '<button type="button" data-act="copy">' + COPY + '<span class="lbl">Copia indirizzo</span></button>' +
            '<button type="button" data-act="mailto">' + ENV + 'App email predefinita</button>';
        document.body.appendChild(menu);
        let email = '';
        const lbl = () => menu.querySelector('.lbl');
        function place(el) {
            const r = el.getBoundingClientRect();
            let left = Math.min(r.left, window.innerWidth - 252);
            menu.style.left = Math.max(12, left) + 'px';
            menu.style.top = (r.bottom + 8) + 'px';
        }
        function open(el) { email = el.getAttribute('data-email'); place(el); menu.classList.add('open'); }
        function close() { menu.classList.remove('open'); lbl().textContent = 'Copia indirizzo'; }
        triggers.forEach(t => t.addEventListener('click', e => { e.preventDefault(); open(t); }));
        menu.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            const act = b.dataset.act;
            if (act === 'gmail') { window.open('https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(email), '_blank', 'noopener'); close(); }
            else if (act === 'mailto') { window.location.href = 'mailto:' + email; close(); }
            else if (act === 'copy') {
                if (navigator.clipboard) navigator.clipboard.writeText(email).then(() => { lbl().textContent = 'Copiato!'; setTimeout(close, 900); }).catch(() => { lbl().textContent = email; });
                else { lbl().textContent = email; }
            }
        });
        document.addEventListener('click', e => {
            if (menu.classList.contains('open') && !menu.contains(e.target) && !e.target.closest('[data-email]')) close();
        });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
        window.addEventListener('resize', close, { passive: true });
        window.addEventListener('scroll', close, { passive: true });
    })();

    if (!window.gsap) return;
    gsap.registerPlugin(ScrollTrigger);
    if (reduced) return;

    // Hero entrance
    gsap.from('.hero-content > *', {
        opacity: 0, y: 24, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.1
    });

    // Section titles: clip-path reveal (no CLS)
    gsap.utils.toArray('.section-title').forEach(el => {
        gsap.fromTo(el,
            { clipPath: 'inset(0 0 100% 0)' },
            {
                clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 85%' }
            });
    });

    // Cards / blocks: fade-up
    gsap.utils.toArray('.service-card, .case-card, .faq-item, .step-content, .tech-badge, .section-subtitle, .cta-section')
        .forEach(el => {
            gsap.from(el, {
                opacity: 0, y: 24, duration: 0.7, ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 90%' }
            });
        });

    // Magnetic hover (pointer devices only)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.querySelectorAll('.service-card, .case-card').forEach(card => {
            const xTo = gsap.quickTo(card, 'x', { duration: 0.5, ease: 'power3' });
            const yTo = gsap.quickTo(card, 'y', { duration: 0.5, ease: 'power3' });
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                xTo((e.clientX - r.left - r.width / 2) * 0.1);
                yTo((e.clientY - r.top - r.height / 2) * 0.1);
            });
            card.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
        });
    }
})();
