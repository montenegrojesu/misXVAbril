// ===== Álbum XV — interacciones =====
document.addEventListener('DOMContentLoaded', () => {

  /* 1) Barra de progreso de scroll */
  const progressBar = document.getElementById('progress-bar');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }

  /* 2) Resaltar el link del menú según la sección visible (scroll-spy) */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('nav a');
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach(sec => spyObserver.observe(sec));

  /* 3) Animación de aparición al hacer scroll */
  const revealTargets = document.querySelectorAll('.section-head, .gallery-grid, .video-frame, .cta-btn, .cta-note');
  revealTargets.forEach(el => el.classList.add('reveal'));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => revealObserver.observe(el));

  /* 3b) Menú móvil (hamburguesa) */
  const navToggle = document.getElementById('nav-toggle');
  const navLinksEl = document.getElementById('nav-links');
  const navScrim = document.getElementById('nav-scrim');

  function openMenu() {
    navLinksEl?.classList.add('open');
    navScrim?.classList.add('show');
    navToggle?.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    navLinksEl?.classList.remove('open');
    navScrim?.classList.remove('show');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
  navToggle?.addEventListener('click', () => {
    navLinksEl?.classList.contains('open') ? closeMenu() : openMenu();
  });
  navScrim?.addEventListener('click', closeMenu);
  navLinksEl?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 640) closeMenu(); });

  /* 4) Botón "volver arriba" */
  const backToTop = document.getElementById('back-to-top');
  function toggleBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle('show', window.scrollY > 600);
  }
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* 5) Lightbox: click en una foto la amplía */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const lightboxCaption = lightbox?.querySelector('.lb-caption');
  const lightboxClose = lightbox?.querySelector('.lb-close');

  function openLightbox(tile) {
    if (!lightbox) return;
    const img = tile.querySelector('img');
    const label = tile.querySelector('span')?.textContent || '';
    const category = tile.closest('.gallery-grid')?.dataset.category || '';
    if (img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxImg.style.display = 'inline-block';
    } else {
      lightboxImg.style.display = 'none';
    }
    lightboxCaption.textContent = category ? `${label} · ${category}` : label;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox?.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('.tile').forEach(tile => {
    tile.setAttribute('tabindex', '0');
    tile.setAttribute('role', 'button');
    tile.addEventListener('click', () => openLightbox(tile));
    tile.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(tile); }
    });
  });
  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* 6) Placeholder de video: click muestra un mensaje (reemplazar por iframe real) */
  const videoFrame = document.querySelector('.video-frame');
  videoFrame?.addEventListener('click', () => {
    const note = videoFrame.querySelector('.vf-note');
    if (note) note.textContent = 'Todavía no hay video cargado. Reemplazá este bloque por un <iframe> cuando lo tengas.';
  });

  /* Scroll listeners (throttled con requestAnimationFrame) */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        toggleBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  });
  updateProgress();
  toggleBackToTop();
});