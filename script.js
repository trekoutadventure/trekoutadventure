/* =========================================================================
   TREK-OUT ADVENTURE — SCRIPT
   Modular vanilla JS. Sections:
   1. Data          2. Utils            3. Product render/filter
   4. Product modal 5. Admin modal      6. Navbar & mobile menu
   7. Scroll fx     8. Testimonial slider
   9. FAQ accordion 10. Packages render  11. Misc (ripple, preload, init)
   ========================================================================= */

(() => {
  'use strict';

  /* ============================ 1. DATA ============================ */

  const IMAGES = {
    Camping: [
      'TrekOut - BG.png'
    ],
    'Peralatan Masak': [
      'TrekOut - BG.png'
    ],
    'Tas & Carrier': [
      'TrekOut - BG.png'
    ],
    'Peralatan Pribadi': [
      'TrekOut - BG.png'
    ],
    'Peralatan Santai': [
      'TrekOut - BG.png'
    ]
  };

  const rawProducts = [
    // Camping
    ['Water Bag', 'Camping', 5000],
    ['Matras', 'Camping', 5000],
    ['Matras Ultra Light', 'Camping', 5000],
    ['Headlamp', 'Camping', 10000],
    ['Lampu Tenda', 'Camping', 10000],
    ['Lampu Tenda Multifungsi', 'Camping', 15000],
    ['Hammock', 'Camping', 10000],
    ['Sleeping Bag', 'Camping', 10000],
    ['Tiang Flysheet', 'Camping', 10000],
    ['Flysheet', 'Camping', 15000],
    ['Emergency Blanket', 'Camping', 15000],
    ['Hand Body Foot Warmer', 'Camping', 15000],
    ['Tenda Double Layer Kap.2', 'Camping', 35000],
    ['Tenda Double Layer + Teras Kap.4', 'Camping', 50000],
    ['Tenda Double Layer + Teras Kap.6', 'Camping', 70000],
    // Peralatan Masak
    ['Gas Portable', 'Peralatan Masak', 7000],
    ['Kompor Camp Kotak', 'Peralatan Masak', 10000],
    ['Kompor Camp Kembang', 'Peralatan Masak', 15000],
    ['Nesting 2 in 1', 'Peralatan Masak', 10000],
    ['Nesting 2 in 1 + Teko', 'Peralatan Masak', 15000],
    ['Pan Grill BBQ Bulat', 'Peralatan Masak', 10000],
    ['Pan Grill BBQ Kotak', 'Peralatan Masak', 15000],
    ['Kompor Portable', 'Peralatan Masak', 25000],
    // Tas & Carrier
    ['Hydropack', 'Tas & Carrier', 15000],
    ['Daypack', 'Tas & Carrier', 20000],
    ['Carrier 45L + Raincover', 'Tas & Carrier', 25000],
    ['Carrier 50L + Raincover', 'Tas & Carrier', 30000],
    ['Carrier 60L + Raincover', 'Tas & Carrier', 35000],
    // Peralatan Pribadi
    ['Topi', 'Peralatan Pribadi', 5000],
    ['Sarung Tangan', 'Peralatan Pribadi', 10000],
    ['Tracking Pole', 'Peralatan Pribadi', 10000],
    ['Tracking Pole Premium', 'Peralatan Pribadi', 15000],
    ['Power Bank', 'Peralatan Pribadi', 15000],
    ['Jaket Anti UV / Baselayer', 'Peralatan Pribadi', 15000],
    ['Celana Outdoor', 'Peralatan Pribadi', 15000],
    ['Sepatu Outdoor', 'Peralatan Pribadi', 25000],
    ['Jaket Outdoor', 'Peralatan Pribadi', 25000],
    // Peralatan Santai
    ['Kacamata', 'Peralatan Santai', 5000],
    ['Tripod', 'Peralatan Santai', 10000],
    ['Kursi Lipat L', 'Peralatan Santai', 10000],
    ['Kursi Lipat XL', 'Peralatan Santai', 15000],
    ['Meja Lipat L', 'Peralatan Santai', 10000],
    ['Meja Lipat XL', 'Peralatan Santai', 15000]
  ];

  // Build product objects with dummy but deterministic stock/status data
  const products = rawProducts.map((p, i) => {
    const [name, category, price] = p;
    const imgs = IMAGES[category];
    const stockToday = (i * 3 + 2) % 12;      // 0-11 deterministic pseudo-random
    const stockTomorrow = (i * 5 + 4) % 14;   // 0-13
    let status = 'tersedia';
    if (stockToday === 0) status = 'habis';
    else if (stockToday <= 3) status = 'hampir';

    return {
      id: 'p' + (i + 1),
      name, category, price, stockToday, stockTomorrow, status,
      images: [imgs[i % imgs.length]],
      desc: `${name} siap pakai untuk kebutuhan perjalanan outdoor kamu. Sudah dicek kebersihan dan kelengkapannya sebelum disewakan.`,
      specs: ['Kondisi terawat & higienis', 'Cocok untuk pemula maupun profesional', 'Termasuk pengecekan sebelum keberangkatan']
    };
  });

  const admins = [
    { 
      name: 'Difta Priyadi', 
      photo: 'profil.jpg', 
      wa: '6281312617176',
      status: 'Online'
    },
    { 
      name: 'Tedi Firdaus', 
      photo: 'profil.jpg', 
      wa: '62895369666466',
      status: 'Offline'
    },
    { 
      name: 'Azi Pratama', 
      photo: 'profil.jpg', 
      wa: '62895428693600',
      status: 'Online'
    }
  ];

  const packages = [
    {
      name: 'Paket Tektok Cewek', price: 70000,
      img: 'TrekOut - BG.png',
      items: ['Tenda Double Layer Kap.2', 'Sleeping Bag x2', 'Matras x2', 'Kompor + Nesting']
    },
    {
      name: 'Paket Kalcer', price: 90000,
      img: 'TrekOut - BG.png',
      items: ['Tenda Kap.4', 'Sleeping Bag x3', 'Matras x3', 'Kompor + Nesting + Teko']
    },
    {
      name: 'Paket Couple', price: 150000,
      img: 'TrekOut - BG.png',
      items: ['Tenda Kap.6', 'Sleeping Bag x5', 'Matras x5', 'Kompor Portable', 'Kursi Lipat x4']
    },
    {
      name: 'Paket Camping Berdua', price: 90000,
      img: 'TrekOut - BG.png',
      items: ['2x Tenda Kap.6', 'Sleeping Bag x10', 'Matras x10', '2x Kompor Portable', 'Meja + Kursi Lipat']
    },
    {
      name: 'Paket Camping Berempat', price: 145000,
      img: 'TrekOut - BG.png',
      items: ['2x Tenda Kap.6', 'Sleeping Bag x10', 'Matras x10', '2x Kompor Portable', 'Meja + Kursi Lipat']
    },
    {
      name: 'Paket Camp Squad / Family', price: 340000,
      img: 'TrekOut - BG.png',
      items: ['2x Tenda Kap.6', 'Sleeping Bag x10', 'Matras x10', '2x Kompor Portable', 'Meja + Kursi Lipat']
    }
  ];

  const testimonials = [
  {
    name: 'Radit Pratama',
    role: 'Pendaki Gunung',
    rating: 5,
    comment: 'The best emang. Jangan lupa sewa alat naik gunung di sini, udah murah dan pelayanannya ramah banget.'
  },
  {
    name: 'Rifan Akbar',
    role: 'Customer Trek-Out Adventure',
    rating: 5,
    comment: 'Kerennn, harganya murmer tapi kualitasnya gak murahan.'
  },
  {
    name: 'Anggun Anggun Nurul',
    role: 'Tektok Gunung Papandayan',
    rating: 5,
    comment: 'Wajib sewa alat di sini kalau mau tektok ke Gunung Papandayan. Alatnya bagus dan kakaknya ramah-ramah banget.'
  },
  {
    name: 'Zatnika Z095',
    role: 'Pecinta Camping',
    rating: 5,
    comment: 'Pelayanannya ramah, alat sewanya bagus dan nyaman dipakai. Best banget.'
  },
  {
    name: 'Nalya Arum',
    role: 'Customer Rental Outdoor',
    rating: 5,
    comment: 'Barangnya bagus-bagus, kakaknya ramah dan sangat membantu. Best banget.'
  },
  {
    name: 'Indah Ayu',
    role: 'Pendaki & Camper',
    rating: 5,
    comment: 'Rekomen banget buat sewa alat atau outfit muncak. Harganya ramah di kantong pelajar dan pelayanannya juga sangat baik.'
  },
  {
    name: 'Masayu Nurfadilah',
    role: 'Outdoor Enthusiast',
    rating: 5,
    comment: 'Barangnya keren, bagus-bagus dan harganya murah. The best pokoknya.'
  },
  {
    name: 'Sls Bln',
    role: 'Customer Trek-Out Adventure',
    rating: 5,
    comment: 'Best lah, adminnya ramah dan sepatunya nyaman dipakai. Pokoknya seru banget sewa di sini.'
  },
  {
    name: 'Fahmi Maulana',
    role: 'Customer Rental Outdoor',
    rating: 5,
    comment: 'Sangat bagus.'
  },
  {
    name: 'Dy',
    role: 'Customer Rental Outdoor',
    rating: 5,
    comment: 'Sangat puas dengan pelayanan dan kualitasnya. Ramah, cepat, dan terpercaya.'
  },
  {
    name: 'Ahmad Fauzi',
    role: 'Pendaki Gunung',
    rating: 5,
    comment: 'Alat-alatnya masih baru jadi sangat direkomendasikan buat sewa di sini.'
  },
  {
    name: '067_M Rival Sofari Putra',
    role: 'Pecinta Camping',
    rating: 5,
    comment: 'Rekomendasi rental alat camping dan perlengkapan outdoor lainnya.'
  },
  {
    name: 'Nina Herlina',
    role: 'Customer Rental Outdoor',
    rating: 5,
    comment: 'Barang sewanya murah dan kakak-kakaknya ramah banget.'
  },
  {
    name: 'Syabana Andika',
    role: 'Pendaki Gunung',
    rating: 5,
    comment: 'Sumpah barangnya bagus-bagus dan adminnya ramah banget. Semoga selalu lancar rezekinya dan sehat selalu.'
  },
  {
    name: 'Aulia Febriyanti Rachmadani',
    role: 'Customer Trek-Out Adventure',
    rating: 5,
    comment: 'Pelayanannya sangat memuaskan.'
  },
  {
    name: 'Cici Choi',
    role: 'Customer Trek-Out Adventure',
    rating: 5,
    comment: 'Bener-bener guuudddd, recommended banget pokoknya.'
  },
  {
    name: 'Ade Sugiarti',
    role: 'Pecinta Camping',
    rating: 5,
    comment: 'Rekomended, lokasinya dekat dan sangat memudahkan. Bintang 5.'
  },
  {
    name: 'Dimas Lama',
    role: 'Pendaki Gunung',
    rating: 5,
    comment: 'Next trip pasti sewa ke sini lagi. Harganya murah banget.'
  },
  {
    name: 'Nabila Dewi',
    role: 'Camping & Hiking Enthusiast',
    rating: 5,
    comment: 'Gak nyesel sewa peralatan di sini. Harganya murah, peralatannya bersih dan nyaman dipakai.'
  },
  {
    name: 'Duwi Mulyanti',
    role: 'Hiking & Camping Enthusiast',
    rating: 5,
    comment: 'Harganya murah-murah. Buat yang mau hiking atau camping wajib sewa di tempat ini.'
  },
  {
    name: 'Parisah Nasihah',
    role: 'Customer Trek-Out Adventure',
    rating: 5,
    comment: 'Pelayanannya bagus dan harganya sangat merakyat.'
  },
  {
    name: 'Muhammad Alfi Salman Farizi',
    role: 'Customer Rental Outdoor',
    rating: 5,
    comment: 'Pelayanannya bagus dan barangnya juga oke.'
  },
  {
    name: 'Pahri Pauji',
    role: 'Customer Trek-Out Adventure',
    rating: 5,
    comment: 'Kerennn bangetttt bangggg.'
  },
  {
    name: 'Yuda Trisna',
    role: 'Customer Trek-Out Adventure',
    rating: 5,
    comment: 'Rekomen banget.'
  },
  {
    name: 'Alfi Nur Kholizza',
    role: 'Hiking & Camping Enthusiast',
    rating: 5,
    comment: 'Harganya sangat murah. Buat yang mau camping atau hiking mending sewa peralatannya di sini.'
  },
  {
    name: 'Tedi Firdaus',
    role: 'Outdoor Enthusiast',
    rating: 5,
    comment: 'Tempat sewa alat outdoor paling recommended. Peralatannya lengkap, harganya murah dan ramah di kantong.'
  },
  {
    name: 'Iqbal Taftazani',
    role: 'Hiking & Camping Enthusiast',
    rating: 5,
    comment: 'Tempat sewa alat hiking dan camping termurah serta terlengkap di Garut. Lokasinya strategis dan cocok buat berbagai tujuan pendakian.'
  },
  {
    name: 'Ridwan Baul',
    role: 'Customer Trek-Out Adventure',
    rating: 5,
    comment: 'Pelayanannya mantap dan recommended banget.'
  },
  {
    name: 'Revaa Ramadhanii',
    role: 'Pendaki Gunung Garut',
    rating: 5,
    comment: 'Barangnya masih banyak yang baru dan harganya benar-benar worth it. Sangat direkomendasikan buat yang mau sewa alat ke gunung-gunung di Garut.'
  },
  {
    name: 'Ahaya Alazrya Basari',
    role: 'Customer Trek-Out Adventure',
    rating: 5,
    comment: 'Pelayanannya mantap.'
  },
  {
    name: 'Dafi Fadlika',
    role: 'Trip Pantai & Outdoor',
    rating: 5,
    comment: 'Pelayanannya ramah sekali waktu saya sewa alat buat ke pantai.'
  },
  {
    name: 'Tijani Jauharuddin Basyarah',
    role: 'Local Guide & Outdoor Enthusiast',
    rating: 5,
    comment: 'Termurah se Garut Raya.'
  }
];


testimonials.forEach(t => {
  t.role = 'Customer Trek-Out Adventure';
});


  const faqs = [
    { q: 'Berapa lama minimal sewa peralatan?', a: 'Minimal sewa adalah 1 hari (24 jam) sejak alat diambil. Perpanjangan bisa dikonfirmasi langsung ke admin.' },
    { q: 'Apakah ada denda jika alat rusak atau hilang?', a: 'Ada biaya penggantian sesuai kondisi kerusakan atau kehilangan, akan diinformasikan sebelum penyewaan dimulai.' },
    { q: 'Bagaimana cara cek ketersediaan alat?', a: 'Kamu bisa cek langsung di katalog website ini, badge status akan menunjukkan Tersedia, Hampir Habis, atau Habis secara real-time.' },
    { q: 'Apakah bisa booking dari luar kota?', a: 'Bisa, silakan hubungi admin untuk konfirmasi jadwal pengambilan dan metode pembayaran.' },
    { q: 'Apa saja persyaratan yang digunakan?', a: 'Untuk persyaratan hanya menggunakan kartu identitas seperti KTP, SIM, Kartu Pelajar, atau kartu identitas lainnya. Kartu identitas yang disimpan hanya sebagai jaminan dan tidak akan disalahgunakan.' }
  ];

  /* ============================ 2. UTILS ============================ */

  const rupiah = (n) => 'Rp' + n.toLocaleString('id-ID');
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const statusMeta = {
    tersedia: { label: 'Tersedia', cls: 'badge-tersedia' },
    hampir: { label: 'Hampir Habis', cls: 'badge-hampir' },
    habis: { label: 'Habis', cls: 'badge-habis' }
  };

  function waLink(number, productName) {
    const msg = `Halo Admin Trek-Out Adventure.\nSaya ingin bertanya mengenai penyewaan:\n${productName}\nApakah masih tersedia?\nTerima kasih.`;
    return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
  }

  /* ============================ 3. PRODUCT RENDER / FILTER ============================ */

  const catalogGrid = $('#catalogGrid');
  const catalogEmpty = $('#catalogEmpty');
  const searchInput = $('#searchInput');
  const filterChips = $$('.filter-chip');

  let currentFilter = 'Semua';
  let currentSearch = '';

  function productCardHTML(p) {
    const meta = statusMeta[p.status];
    return `
      <article class="product-card" data-aos="fade-up">
        <div class="product-media">
          <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
          <span class="product-badge">${p.category}</span>
        </div>
        <div class="product-body">
          <h3 class="product-name">${p.name}</h3>
          <p class="product-price">${rupiah(p.price)}<small> / hari</small></p>
          <div class="product-stock">
            <span>Hari ini: <strong>${p.stockToday}</strong></span>
            <span>Besok: <strong>${p.stockTomorrow}</strong></span>
          </div>
          <div class="product-actions">
            <button class="btn btn-ghost btn-sm" data-detail="${p.id}">Detail</button>
            <button class="btn btn-primary btn-sm btn-ripple" data-ask="${p.name}">Tanya Admin</button>
          </div>
        </div>
      </article>`;
  }

  function renderCatalog() {
    const term = currentSearch.trim().toLowerCase();
    const filtered = products.filter(p => {
      const matchCat = currentFilter === 'Semua' || p.category === currentFilter;
      const matchSearch = !term || p.name.toLowerCase().includes(term);
      return matchCat && matchSearch;
    });

    catalogGrid.innerHTML = filtered.map(productCardHTML).join('');
    catalogEmpty.hidden = filtered.length !== 0;

    // reveal newly injected cards
    requestAnimationFrame(() => {
      $$('.product-card[data-aos]', catalogGrid).forEach(el => el.classList.add('aos-in'));
    });
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      renderCatalog();
    });
  });

  let searchDebounce;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      currentSearch = e.target.value;
      renderCatalog();
    }, 180);
  });

  /* ============================ 4. PRODUCT DETAIL MODAL ============================ */

  const productModalOverlay = $('#productModalOverlay');
  const productModalBody = $('#productModalBody');
  const productModalClose = $('#productModalClose');
  let pmGalleryTimer = null;

  function openProductModal(product) {
    const meta = statusMeta[product.status];
    productModalBody.innerHTML = `
      <div class="pm-gallery">
        ${product.images.map((src, i) => `<img src="${src}" alt="${product.name}" class="${i === 0 ? 'active' : ''}">`).join('')}
        <div class="pm-gallery-dots">
          ${product.images.map((_, i) => `<span class="${i === 0 ? 'active' : ''}"></span>`).join('')}
        </div>
      </div>
      <div class="pm-info">
        <span class="pm-cat">${product.category}</span>
        <h3 class="pm-name">${product.name}</h3>
        <p class="pm-price">${rupiah(product.price)} <small style="font-size:13px;color:var(--muted);font-weight:500;">/ hari</small></p>
        <p class="pm-desc">${product.desc}</p>
        <ul class="pm-specs">${product.specs.map(s => `<li>${s}</li>`).join('')}</ul>
        <div class="pm-stock">
          <div><strong>${product.stockToday}</strong>Stok Hari Ini</div>
          <div><strong>${product.stockTomorrow}</strong>Stok Besok</div>
          <div><span class="product-badge ${meta.cls}" style="position:static;display:inline-block;">${meta.label}</span></div>
        </div>
        <button class="btn btn-primary btn-block btn-ripple" data-ask="${product.name}">Tanya Admin</button>
      </div>`;

    productModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // simple gallery auto-rotate while modal open
    const imgs = $$('.pm-gallery img', productModalBody);
    const dots = $$('.pm-gallery-dots span', productModalBody);
    let idx = 0;
    clearInterval(pmGalleryTimer);
    if (imgs.length > 1) {
      pmGalleryTimer = setInterval(() => {
        imgs[idx].classList.remove('active');
        dots[idx].classList.remove('active');
        idx = (idx + 1) % imgs.length;
        imgs[idx].classList.add('active');
        dots[idx].classList.add('active');
      }, 2800);
    }
  }

  function closeProductModal() {
    productModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    clearInterval(pmGalleryTimer);
  }

  catalogGrid.addEventListener('click', (e) => {
    const detailBtn = e.target.closest('[data-detail]');
    if (detailBtn) {
      const product = products.find(p => p.id === detailBtn.dataset.detail);
      if (product) openProductModal(product);
    }
  });

  productModalClose.addEventListener('click', closeProductModal);
  productModalOverlay.addEventListener('click', (e) => { if (e.target === productModalOverlay) closeProductModal(); });

  /* ============================ 5. ADMIN "TANYA ADMIN" MODAL ============================ */

  const adminModalOverlay = $('#adminModalOverlay');
  const adminModalClose = $('#adminModalClose');
  const adminCardsWrap = $('#adminCards');
  let pendingProductName = 'Peralatan Outdoor';

  function renderAdminCards() {
  adminCardsWrap.innerHTML = admins.map(a => `
    <div class="admin-card">
      <div class="admin-photo">
        <img src="${a.photo}" alt="${a.name}">
        <span class="admin-online-dot ${a.status === 'Online' ? '' : 'offline'}"></span>
      </div>

      <div class="admin-info">
        <p class="admin-name">${a.name}</p>
        <p class="admin-status ${a.status === 'Online' ? '' : 'offline'}">${a.status}</p>
      </div>

      <a class="admin-contact-btn" href="${waLink(a.wa, pendingProductName)}" target="_blank" rel="noopener">
        Hubungi
      </a>
    </div>
  `).join('');
  }

  function openAdminModal(productName) {
    pendingProductName = productName || 'Peralatan Outdoor';
    renderAdminCards();
    adminModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAdminModal() {
    adminModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', (e) => {
    const askBtn = e.target.closest('[data-ask]');
    if (askBtn) openAdminModal(askBtn.dataset.ask);
  });

  $('#ctaAskAdmin').addEventListener('click', () => openAdminModal('Peralatan Outdoor'));
  adminModalClose.addEventListener('click', closeAdminModal);
  adminModalOverlay.addEventListener('click', (e) => { if (e.target === adminModalOverlay) closeAdminModal(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeProductModal(); closeAdminModal(); }
  });

  /* ============================ 6. NAVBAR & MOBILE MENU ============================ */

  const navbar = $('#navbar');
  const navbarToggle = $('#navbarToggle');
  const navbarMenu = $('#navbarMenu');
  const navLinks = $$('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  navbarToggle.addEventListener('click', () => {
    navbarMenu.classList.toggle('open');
    navbarToggle.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbarMenu.classList.remove('open');
      navbarToggle.classList.remove('open');
    });
  });

  $('#navbarCta').addEventListener('click', () => openAdminModal('Alat Outdoor'));

  // active link on scroll
  const sections = $$('section[id], .hero[id]');
  const scrollSpy = () => {
    const pos = window.scrollY + 140;
    sections.forEach(sec => {
      if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + sec.id));
      }
    });
  };
  window.addEventListener('scroll', scrollSpy);

  /* ============================ 7. SCROLL FX: progress bar, reveal, counters, back-to-top ============================ */

  const progressPath = $('#progressPath');
  const pathLength = progressPath.getTotalLength();
  progressPath.style.strokeDasharray = pathLength;
  progressPath.style.strokeDashoffset = pathLength;

  const backToTop = $('#backToTop');

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = docHeight > 0 ? scrollTop / docHeight : 0;
    progressPath.style.strokeDashoffset = pathLength * (1 - ratio);
    backToTop.classList.toggle('show', scrollTop > 500);
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // fade-up reveal via IntersectionObserver
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  function observeReveals(root = document) {
    $$('[data-aos]', root).forEach(el => revealObserver.observe(el));
  }

  // counter animation
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  $$('.stat-number').forEach(el => counterObserver.observe(el));

  /* ============================ 8. TESTIMONIAL SLIDER ============================ */

  const testimonialTrack = $('#testimonialTrack');
  const testiDotsWrap = $('#testiDots');
  const testiPrev = $('#testiPrev');
  const testiNext = $('#testiNext');
  let testiIndex = 0;
  let testiTimer = null;

function getInitials(name) {
  const words = name
    .trim()
    .split(/\s+/)
    .map(word => word.replace(/[^a-zA-Z]/g, ''))
    .filter(word => word.length > 0);

  if (words.length === 0) return 'U';
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();

  return (words[0][0] + words[1][0]).toUpperCase();
}

function renderTestimonials() {
  testimonialTrack.innerHTML = testimonials.map((t, i) => `
    <div class="testimonial-card ${i === 0 ? 'active' : ''}">
      <div class="testimonial-avatar">
        ${getInitials(t.name)}
      </div>

      <div class="testimonial-stars">
        ${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}
      </div>

      <p class="testimonial-comment">&ldquo;${t.comment}&rdquo;</p>
      <p class="testimonial-name">${t.name}</p>
      <p class="testimonial-role">${t.role}</p>
    </div>
  `).join('');

  testiDotsWrap.innerHTML = testimonials.map((_, i) =>
    `<span class="slider-dot ${i === 0 ? 'active' : ''}" data-idx="${i}"></span>`
  ).join('');
}

  function goToTesti(i) {
  testiIndex = (i + testimonials.length) % testimonials.length;

  const cards = $$('.testimonial-card', testimonialTrack);

  cards.forEach((card, idx) => {
    card.classList.remove(
      'active',
      'prev',
      'next'
    );

    if (idx === testiIndex) {
      card.classList.add('active');
    }

    if (idx === (testiIndex - 1 + testimonials.length) % testimonials.length) {
      card.classList.add('prev');
    }

    if (idx === (testiIndex + 1) % testimonials.length) {
      card.classList.add('next');
    }
  });

  $$('.slider-dot', testiDotsWrap).forEach((d, idx) =>
    d.classList.toggle('active', idx === testiIndex)
  );
}

  function startAutoplay() {
    clearInterval(testiTimer);
    testiTimer = setInterval(() => goToTesti(testiIndex + 1), 5000);
  }

  testiPrev.addEventListener('click', () => { goToTesti(testiIndex - 1); startAutoplay(); });
  testiNext.addEventListener('click', () => { goToTesti(testiIndex + 1); startAutoplay(); });
  testiDotsWrap.addEventListener('click', (e) => {
    const dot = e.target.closest('.slider-dot');
    if (dot) { goToTesti(parseInt(dot.dataset.idx, 10)); startAutoplay(); }
  });

  /* ============================ 9. FAQ ACCORDION ============================ */

  const faqList = $('#faqList');

  function renderFaq() {
    faqList.innerHTML = faqs.map((f, i) => `
      <div class="faq-item" data-idx="${i}">
        <button class="faq-question">
          <span>${f.q}</span>
          <span class="plus">+</span>
        </button>
        <div class="faq-answer">
          <div class="faq-answer-inner">${f.a}</div>
        </div>
      </div>`).join('');
  }

  faqList.addEventListener('click', (e) => {
    const question = e.target.closest('.faq-question');
    if (!question) return;
    const item = question.closest('.faq-item');
    const answer = $('.faq-answer', item);
    const isOpen = item.classList.contains('open');

    $$('.faq-item', faqList).forEach(other => {
      other.classList.remove('open');
      $('.faq-answer', other).style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });

  /* ============================ 10. PACKAGES RENDER ============================ */

  const packagesGrid = $('#packagesGrid');

  function renderPackages() {
    packagesGrid.innerHTML = packages.map(pkg => `
      <div class="package-card" data-aos="fade-up">
        <div class="package-media">
          <img src="${pkg.img}" alt="${pkg.name}">
          <span class="package-name">${pkg.name}</span>
        </div>
        <div class="package-body">
          <p class="package-price">${rupiah(pkg.price)}<small> / hari</small></p>
          <ul class="package-list">${pkg.items.map(it => `<li>${it}</li>`).join('')}</ul>
          <button class="btn btn-primary btn-block btn-ripple" data-ask="${pkg.name}">Tanya Admin</button>
        </div>
      </div>`).join('');
  }

  /* ============================ 11. MISC: ripple, preloader, init ============================ */

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-ripple');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });

  $('#footerYear').textContent = new Date().getFullYear();

  window.addEventListener('load', () => {
    setTimeout(() => $('#preloader').classList.add('hide'), 400);
  });
  // fallback in case load event already fired / takes too long
  setTimeout(() => $('#preloader').classList.add('hide'), 2500);

  function init() {
    renderCatalog();
    renderPackages();
    renderTestimonials();
    renderFaq();
    startAutoplay();
    observeReveals();
    scrollSpy();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
