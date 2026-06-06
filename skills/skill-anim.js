/* Scroll/entrance animations + magnetic hover + glass header for skill pages */
(function () {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const header = document.querySelector('header');
    if (header) {
        const f = () => header.classList.toggle('scrolled', window.scrollY > 40);
        f();
        window.addEventListener('scroll', f, { passive: true });
    }

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
