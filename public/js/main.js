/**
 * ===================================================
 * Script Global: SkyMaster Aviation System
 * Manejo de interacciones en el frontend
 * ===================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('✈️ [SkyMaster] Frontend interactivo inicializado.');

  // Auto-cierre de alertas flash o notificaciones
  const alertBanners = document.querySelectorAll('.alert-banner');
  alertBanners.forEach(banner => {
    setTimeout(() => {
      banner.style.opacity = '0';
      banner.style.transition = 'opacity 0.5s ease';
      setTimeout(() => banner.remove(), 500);
    }, 5000);
  });

  // Selector interactivo de idioma (Alternar Bandera USA <-> Venezuela)
  const langButtons = document.querySelectorAll('.lang-toggle');
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const flagUs = btn.querySelector('.flag-us');
      const flagVe = btn.querySelector('.flag-ve');
      const currentLang = btn.getAttribute('data-lang') || 'en';

      if (currentLang === 'en') {
        if (flagUs) flagUs.style.display = 'none';
        if (flagVe) flagVe.style.display = 'block';
        btn.setAttribute('data-lang', 'es');
        btn.setAttribute('title', 'Idioma actual: Español (VE) - Clic para cambiar a English (US)');
      } else {
        if (flagUs) flagUs.style.display = 'block';
        if (flagVe) flagVe.style.display = 'none';
        btn.setAttribute('data-lang', 'en');
        btn.setAttribute('title', 'Idioma actual: English (US) - Clic para cambiar a Español (VE)');
      }
    });
  });

  // Control de Menú Hamburguesa Móvil Responsivo
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

  // Cerrar el menú al hacer clic en cualquier enlace
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      closeAllMobileMenus();
    });
  });

  // Cerrar el menú al hacer clic fuera de la cabecera
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
  // Efecto Navbar Transparente exclusivo del Index
  // Se mantiene transparente arriba y toma color de footer al hacer scroll
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
    onScrollNavbar(); // Verificación inicial al cargar la página
  }
});

