/* ═══════════════════════════════════════════════════
   YOSER ARAYA — PORTFOLIO SCRIPTS
   Scroll reveal, navbar, smooth scroll, mobile menu
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Scroll Reveal (IntersectionObserver) ─────────
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ── Navbar scroll effect ─────────────────────────
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;

      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ── Scroll Spy (active nav link) ─────────────────
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  if (sections.length > 0 && navLinks.length > 0) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => spyObserver.observe(section));
  }

  // ── Smooth Scroll for anchor links ───────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });

        // Close mobile menu if open
        const navLinksContainer = document.querySelector('.nav-links');
        if (navLinksContainer) {
          navLinksContainer.classList.remove('open');
        }
      }
    });
  });

  // ── Mobile Menu Toggle ───────────────────────────
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksContainer = document.querySelector('.nav-links');

  if (navToggle && navLinksContainer) {
    navToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('open');

      // Toggle icon between menu and X
      const menuIcon = navToggle.querySelector('.icon-menu');
      const closeIcon = navToggle.querySelector('.icon-close');

      if (menuIcon && closeIcon) {
        const isOpen = navLinksContainer.classList.contains('open');
        menuIcon.style.display = isOpen ? 'none' : 'block';
        closeIcon.style.display = isOpen ? 'block' : 'none';
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinksContainer.classList.remove('open');
        const menuIcon = navToggle.querySelector('.icon-menu');
        const closeIcon = navToggle.querySelector('.icon-close');
        if (menuIcon && closeIcon) {
          menuIcon.style.display = 'block';
          closeIcon.style.display = 'none';
        }
      }
    });
  }

  // ── Stagger animation for tag elements ───────────
  const tagContainers = document.querySelectorAll('.tags');
  tagContainers.forEach(container => {
    const tags = container.querySelectorAll('.tag');
    tags.forEach((tag, index) => {
      tag.style.animationDelay = `${index * 50}ms`;
    });
  });

  // ── Starfield Animation (Starry Sky) ──────────────
  const canvas = document.getElementById('starfield');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let stars = [];
    let shootingStars = [];

    // Colors matching the design system:
    // White/Cream (Text), Lime Green (Accent 1), Rose Pink (Accent 2), and Light Blue (Depth)
    const starColors = [
      'rgba(240, 237, 248, ', // --text-primary
      'rgba(200, 255, 0, ',   // --accent
      'rgba(255, 59, 107, ',  // --accent-2
      'rgba(147, 197, 253, '  // Soft blue-purple
    ];

    function createStar() {
      const rand = Math.random();
      let size = 0.5;
      // Size distribution: mostly tiny background stars, few larger foreground ones
      if (rand > 0.95) size = 2.0;
      else if (rand > 0.82) size = 1.3;
      else if (rand > 0.55) size = 0.8;

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: size,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        twinkleSpeed: (0.004 + Math.random() * 0.012) * (size > 1 ? 0.6 : 1),
        phase: Math.random() * Math.PI * 2
      };
    }

    function initStars() {
      // Dynamic star count based on window size
      const starCount = Math.floor((width * height) / 9000);

      if (stars.length === 0) {
        for (let i = 0; i < starCount; i++) {
          stars.push(createStar());
        }
      } else {
        if (stars.length < starCount) {
          while (stars.length < starCount) {
            stars.push(createStar());
          }
        } else if (stars.length > starCount) {
          stars.splice(starCount);
        }
      }
    }

    function createShootingStar() {
      const angle = Math.PI / 6 + Math.random() * (Math.PI / 12); // ~30 to 45 deg
      const speed = 14 + Math.random() * 12;
      shootingStars.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.4), // upper 40% of screen
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        opacity: 1.0,
        fadeSpeed: 0.018 + Math.random() * 0.02,
        length: 50 + Math.random() * 70,
        width: 1 + Math.random() * 1.5
      });
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      initStars();
    }

    // Initialize dimensions
    resize();
    window.addEventListener('resize', resize);

    function animate() {
      ctx.clearRect(0, 0, width, height);
      const currentScrollY = window.scrollY;

      // Render & update stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Twinkle (sine wave phase change)
        star.phase += star.twinkleSpeed;
        const opacity = 0.2 + (Math.sin(star.phase) + 1) * 0.4;

        // Slow diagonal drift
        star.x -= 0.03 * star.size;
        star.y -= 0.015 * star.size;

        // Parallax offset relative to scroll position
        // Larger stars move faster to simulate depth
        const parallaxFactor = star.size * 0.12;

        let renderX = star.x;
        let renderY = star.y - (currentScrollY * parallaxFactor);

        // Canvas screen wrap
        if (star.x < -10) star.x = width + 10;
        if (star.y < -10) star.y = height + 10;

        renderX = (renderX + width) % width;
        renderY = (renderY + height) % height;
        if (renderY < 0) renderY += height;

        ctx.fillStyle = `${star.color}${opacity})`;
        ctx.beginPath();
        ctx.arc(renderX, renderY, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render & update shooting stars
      // ~0.08% chance per frame (about once every 10-15 seconds)
      if (Math.random() < 0.0008 && shootingStars.length < 2) {
        createShootingStar();
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.opacity -= ss.fadeSpeed;

        if (ss.opacity <= 0 || ss.x < 0 || ss.x > width || ss.y < 0 || ss.y > height) {
          shootingStars.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(255, 255, 255, ${ss.opacity})`;
        ctx.lineWidth = ss.width;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 2.5, ss.y - ss.vy * 2.5);
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    }

    // Start animation loop
    animate();
  }

  // ═══════════════════════════════════════════════════
  // GYMX SHOWCASE MODAL
  // ═══════════════════════════════════════════════════

  /**
   * GymX image data.
   * ─────────────────────────────────────────────────
   * Para cada imagen, edita los campos:
   *   · "tag"  → Título corto de la pantalla/feature (ej: "Dashboard Principal")
   *   · "desc" → Tu descripción detallada de lo que se muestra en la imagen.
   *              Puedes escribir lo que quieras aquí: tecnologías usadas, decisiones
   *              de diseño, flujo del usuario, retos técnicos resueltos, etc.
   * ─────────────────────────────────────────────────
   */
  const GYMX_IMAGES = [
    {
      src: './ImgGym/gymX.png',
      alt: 'GymX — Vista general',
      // ✏️ EDITA AQUÍ — Tag: etiqueta corta de la pantalla mostrada
      tag: 'Dashboard Principal',
      // ✏️ EDITA AQUÍ — Descripción detallada de esta imagen
      desc: 'Panel de Navegación Lateral (Menú Principal). A la izquierda de la pantalla se encuentra el acceso a las diferentes secciones del software de administración del gimnasio: Dashboard, Miembros, Cobros, Check-in, Clases, Rutinas y Ajustes. La opción Punto de Venta se encuentra resaltada en color verde limón, indicando la sección activa.'
    },
    {
      src: './ImgGym/gym1.png',
      alt: 'GymX — Pantalla 1',
      // ✏️ EDITA AQUÍ — Tag: etiqueta corta de la pantalla mostrada
      tag: 'Usuarios',
      // ✏️ EDITA AQUÍ — Descripción detallada de esta imagen
      desc: 'Métricas clave: Cuatro tarjetas superiores con el resumen de membresías: 10 socios totales, 7 activos, 1 por vencer y 2 vencidos. Filtros y búsqueda: Un buscador rápido por nombre o email, junto con pestañas para filtrar la lista según el estado de la membresía (Todos, Activo, Por vencer, Vencido). Listado de socios: Una tabla detallada que muestra el nombre y correo del miembro, tipo de plan (VIP, Mensual, Trimestral), estado de su cuenta, fecha de vencimiento y el historial de asistencias (visitas). Acciones: Un botón destacado en verde limón para registrar un "Nuevo Miembro".'
    },
    {
      src: './ImgGym/gym2.png',
      alt: 'GymX — Pantalla 2',
      // ✏️ EDITA AQUÍ — Tag: etiqueta corta de la pantalla mostrada
      tag: 'Rutinas y progreso de los miembros',
      // ✏️ EDITA AQUÍ — Descripción detallada de esta imagen
      desc: 'Muestra los planes de entrenamiento de los miembros. Se observa desplegada la "Rutina Full Body - Principiante" de la socia Ana Gómez (asignada por el Coach Diego), detallando los ejercicios del lunes (series, repeticiones y descansos), como press de banca, jalón al pecho y press militar.'
    },
    {
      src: './ImgGym/gym3.png',
      alt: 'GymX — Pantalla 3',
      // ✏️ EDITA AQUÍ — Tag: etiqueta corta de la pantalla mostrada
      tag: 'Punto de venta',
      // ✏️ EDITA AQUÍ — Descripción detallada de esta imagen
      desc: 'Una lista con artículos disponibles como bebidas, suplementos, snacks y accesorios (ej. agua, proteína, barra energética, toalla).Un panel a la derecha que muestra un carrito de compras con 1 barra energética seleccionada por un precio de $30. Un botón verde llamativo que indica "Cobrar $30" para finalizar la transacción de manera directa.'
    }
  ];

  // ── DOM references ─────────────────────────────────
  const overlay = document.getElementById('gymx-modal');
  const openBtn = document.getElementById('gymx-showcase-btn');
  const closeBtn = document.getElementById('gymx-modal-close');
  const viewport = document.getElementById('gymx-gallery-viewport');
  const captionEl = document.getElementById('gymx-caption');
  const thumbnailsEl = document.getElementById('gymx-thumbnails');
  const countEl = document.getElementById('gymx-gallery-count');
  const prevBtn = document.getElementById('gymx-prev');
  const nextBtn = document.getElementById('gymx-next');

  if (!overlay || !openBtn) return; // Safety guard

  let currentIndex = 0;

  // ── Build gallery DOM ──────────────────────────────
  function buildGallery() {
    // Clear any previous renders (in case of hot reload)
    viewport.innerHTML = '';
    thumbnailsEl.innerHTML = '';

    GYMX_IMAGES.forEach((img, i) => {
      // Main viewport image
      const el = document.createElement('img');
      el.src = img.src;
      el.alt = img.alt;
      el.draggable = false;
      if (i === 0) el.classList.add('active');
      viewport.appendChild(el);

      // Thumbnail
      const thumb = document.createElement('button');
      thumb.className = 'gymx-thumb' + (i === 0 ? ' active' : '');
      thumb.setAttribute('role', 'tab');
      thumb.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      thumb.setAttribute('aria-label', `Ver imagen ${i + 1}: ${img.tag}`);
      thumb.setAttribute('data-index', i);

      const thumbImg = document.createElement('img');
      thumbImg.src = img.src;
      thumbImg.alt = img.alt;
      thumb.appendChild(thumbImg);

      thumb.addEventListener('click', () => goTo(i));
      thumbnailsEl.appendChild(thumb);
    });

    renderCaption(0);
    updateCount(0);
  }

  // ── Navigate to a specific index ──────────────────
  function goTo(index) {
    const images = viewport.querySelectorAll('img');
    const thumbs = thumbnailsEl.querySelectorAll('.gymx-thumb');

    // Deactivate current
    images[currentIndex]?.classList.remove('active');
    thumbs[currentIndex]?.classList.remove('active');
    thumbs[currentIndex]?.setAttribute('aria-selected', 'false');

    // Activate new
    currentIndex = (index + GYMX_IMAGES.length) % GYMX_IMAGES.length;
    images[currentIndex]?.classList.add('active');
    thumbs[currentIndex]?.classList.add('active');
    thumbs[currentIndex]?.setAttribute('aria-selected', 'true');

    renderCaption(currentIndex);
    updateCount(currentIndex);
  }

  function renderCaption(i) {
    const { tag, desc } = GYMX_IMAGES[i];
    captionEl.innerHTML = `
      <div class="gymx-caption-tag">${tag}</div>
      <p class="gymx-caption-text">${desc}</p>
    `;
  }

  function updateCount(i) {
    countEl.textContent = `${i + 1} / ${GYMX_IMAGES.length}`;
  }

  // ── Open / Close ───────────────────────────────────
  function openModal() {
    buildGallery();
    overlay.removeAttribute('hidden');
    // Delay to trigger CSS transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add('is-open');
      });
    });
    document.body.style.overflow = 'hidden'; // lock scroll
    closeBtn.focus();
  }

  function closeModal() {
    overlay.classList.remove('is-open');
    overlay.addEventListener('transitionend', () => {
      overlay.setAttribute('hidden', '');
      document.body.style.overflow = '';
      openBtn.focus(); // return focus to trigger
    }, { once: true });
  }

  // ── Event listeners ────────────────────────────────
  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);

  // Close on overlay background click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (overlay.hasAttribute('hidden')) return;

    switch (e.key) {
      case 'Escape':
        closeModal();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        goTo(currentIndex - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        goTo(currentIndex + 1);
        break;
    }
  });

  // Prev / Next arrow buttons
  prevBtn?.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn?.addEventListener('click', () => goTo(currentIndex + 1));

});

