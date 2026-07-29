document.addEventListener('DOMContentLoaded', () => {

  /* ============ NAVBAR SCROLL STATE ============ */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const scrollTopBtn = document.getElementById('scrollTop');

  function onScroll(){
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    scrollTopBtn.classList.toggle('visible', y > 300);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top:0, behavior:'smooth' });
  });

  /* ============ MOBILE NAV ============ */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  function setMenu(open){
    navToggle.classList.toggle('open', open);
    navMenu.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
  }

  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setMenu(!navMenu.classList.contains('open'));
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && e.target !== navToggle){
      setMenu(false);
    }
  });

  /* ============ ACTIVE SECTION INDICATOR ============ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function setActiveNav(id){
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === id);
    });
  }

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActiveNav(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(sec => sectionObserver.observe(sec));

  /* Handle the very bottom of the page (last section may be shorter than viewport) */
  window.addEventListener('scroll', () => {
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) setActiveNav(sections[sections.length - 1].id);
  }, { passive:true });

  /* ============ SCROLL REVEAL (Intersection Observer) ============ */
  const revealTargets = document.querySelectorAll(
    '.reason-card, .skill-row, .soft-skill-card, .timeline-item, .project-card, .edu-card, .cert-card, .contact-card'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ============ SKILL BAR FILL ON VIEW ============ */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.style.width = entry.target.style.width; // trigger from CSS width already set inline
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  skillBars.forEach(bar => skillObserver.observe(bar));

  /* ============ LIGHTBOX GALLERY ============ */
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryItems = [];
  let currentIndex = 0;

  function openLightbox(items, index){
    currentGalleryItems = items;
    currentIndex = index;
    renderLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    const multi = items.length > 1;
    lightboxPrev.style.display = multi ? 'flex' : 'none';
    lightboxNext.style.display = multi ? 'flex' : 'none';
  }

  function renderLightbox(){
    const item = currentGalleryItems[currentIndex];
    const img = item.querySelector('img');
    const isFallback = item.classList.contains('img-fallback');
    const label = img ? img.alt : '';

    if (isFallback){
      lightboxContent.innerHTML = `
        <div class="lightbox-fallback">
          <i class="fa-solid fa-image"></i>
          <span>${label}</span>
        </div>`;
    } else {
      lightboxContent.innerHTML = `<img src="${img.src}" alt="${label}">`;
    }
  }

  function closeLightbox(){
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-gallery, .timeline-gallery').forEach(gallery => {
    const items = Array.from(gallery.querySelectorAll('.gallery-item'));
    items.forEach((item, idx) => {
      item.addEventListener('click', () => openLightbox(items, idx));
    });
  });

  /* Standalone single-image galleries (e.g. certificate thumbnails) */
  document.querySelectorAll('.cert-thumb.gallery-item').forEach(item => {
    item.addEventListener('click', () => openLightbox([item], 0));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  lightboxPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
    renderLightbox();
  });
  lightboxNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentGalleryItems.length;
    renderLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

});
