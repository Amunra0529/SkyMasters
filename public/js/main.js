/**
 * ===================================================
 * Script Global: SkyMaster Aviation System
 * Selector dinámico de idioma, cotizadores y hangares
 * ===================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('✈️ [SkyMaster] Frontend interactivo de referencia inicializado.');

  // ========================================================
  // 1. Selector dinámico de idioma con localStorage
  // ========================================================
  let currentLang = localStorage.getItem('skymaster_lang') || 'es';
  const langToggleBtn = document.getElementById('lang-toggle-btn');

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('skymaster_lang', lang);

    // Actualizar todos los elementos traducibles
    const translatableEls = document.querySelectorAll('[data-es][data-en]');
    translatableEls.forEach(el => {
      const targetText = el.getAttribute(`data-${lang}`);
      if (targetText) {
        if (targetText.includes('<') && targetText.includes('>')) {
          el.innerHTML = targetText;
        } else {
          el.textContent = targetText;
        }
      }
    });

    // Actualizar banderas del botón
    if (langToggleBtn) {
      const flagUs = langToggleBtn.querySelector('.flag-us');
      const flagVe = langToggleBtn.querySelector('.flag-ve');

      if (lang === 'es') {
        if (flagVe) flagVe.style.display = 'block';
        if (flagUs) flagUs.style.display = 'none';
        langToggleBtn.setAttribute('data-lang', 'es');
        langToggleBtn.setAttribute('title', 'Idioma actual: Español (VE) - Clic para cambiar a English (US)');
      } else {
        if (flagVe) flagVe.style.display = 'none';
        if (flagUs) flagUs.style.display = 'block';
        langToggleBtn.setAttribute('data-lang', 'en');
        langToggleBtn.setAttribute('title', 'Current language: English (US) - Click to switch to Español (VE)');
      }
    }
  }

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const newLang = currentLang === 'es' ? 'en' : 'es';
      applyLanguage(newLang);
    });
  }

  // Aplicar idioma guardado al cargar
  applyLanguage(currentLang);

  // ========================================================
  // 2. Control del Menú Hamburguesa Móvil
  // ========================================================
  const hamburgerButtons = document.querySelectorAll('.nav-hamburger');
  hamburgerButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const header = btn.closest('.skymaster-navbar');
      if (!header) return;
      const navLinks = header.querySelector('.nav-links');
      const iconMenu = btn.querySelector('.icon-menu');
      const iconClose = btn.querySelector('.icon-close');

      if (navLinks) {
        navLinks.classList.toggle('nav-open');
        const isOpen = navLinks.classList.contains('nav-open');

        if (iconMenu && iconClose) {
          iconMenu.style.display = isOpen ? 'none' : 'block';
          iconClose.style.display = isOpen ? 'block' : 'none';
        }
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    });
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => closeAllMobileMenus());
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.skymaster-navbar')) {
      closeAllMobileMenus();
    }
  });

  function closeAllMobileMenus() {
    document.querySelectorAll('.nav-links.nav-open').forEach(menu => {
      menu.classList.remove('nav-open');
    });
    document.querySelectorAll('.nav-hamburger').forEach(btn => {
      const iconMenu = btn.querySelector('.icon-menu');
      const iconClose = btn.querySelector('.icon-close');
      if (iconMenu && iconClose) {
        iconMenu.style.display = 'block';
        iconClose.style.display = 'none';
      }
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  // ========================================================
  // 3. Navbar Transparente exclusivo del Index
  // ========================================================
  const isIndex = document.body.classList.contains('index-white-bg') || document.body.classList.contains('is-index-page');
  const publicNavbar = document.querySelector('.skymaster-navbar');

  if (isIndex && publicNavbar) {
    const onScrollNavbar = () => {
      if (window.scrollY > 35) {
        publicNavbar.classList.add('navbar-scrolled');
      } else {
        publicNavbar.classList.remove('navbar-scrolled');
      }
    };
    window.addEventListener('scroll', onScrollNavbar, { passive: true });
    onScrollNavbar();
  }

  // ========================================================
  // 4. ANIMACIÓN FLUIDA DE SCROLL PARA LA IMAGEN DEL PRESIDENTE (ABOUT US)
  // ========================================================
  const aboutBgOverlay = document.getElementById('about-bg-overlay');
  const presidentPhotoCard = document.getElementById('president-photo-card');

  if (aboutBgOverlay) {
    const onAboutScroll = () => {
      if (window.scrollY > 160) {
        document.body.classList.add('bg-active');
        if (presidentPhotoCard) {
          presidentPhotoCard.style.transform = 'scale(0.98)';
          presidentPhotoCard.style.opacity = '0.85';
        }
      } else {
        document.body.classList.remove('bg-active');
        if (presidentPhotoCard) {
          presidentPhotoCard.style.transform = 'scale(1)';
          presidentPhotoCard.style.opacity = '1';
        }
      }
    };

    window.addEventListener('scroll', onAboutScroll, { passive: true });
    onAboutScroll();
  }

  // ========================================================
  // 5. FILTRO INTERACTIVO DE HANGARES / BASES (CONTACTO)
  // ========================================================
  const hangarPills = document.querySelectorAll('#hangar-base-pills .cat-pill');
  const hangarCards = document.querySelectorAll('.hangar-card');

  if (hangarPills.length > 0 && hangarCards.length > 0) {
    hangarPills.forEach(pill => {
      pill.addEventListener('click', () => {
        hangarPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const targetBase = pill.getAttribute('data-base');

        hangarCards.forEach(card => {
          const cardBase = card.getAttribute('data-base');
          if (targetBase === 'all' || cardBase === targetBase) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});
