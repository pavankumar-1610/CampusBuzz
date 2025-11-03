/* script.js — Shared JS for CampusBuzz
   - Navbar toggle (mobile)
   - Smooth scrolling behavior for anchor links
   - Contact form validation + mailto fallback
   - Blog modal open/close
   - Scroll-to-top button
   - Preloader and fade-in on scroll (IntersectionObserver)
   - Menu icon toggle (added)
*/

/* Utility: safe selector */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  // --- Preloader ---
  const preloader = $('#preloader');
  if (preloader) {
    window.setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.pointerEvents = 'none';
      preloader.remove();
    }, 600);
  }

  // --- Navbar toggle for mobile (button .nav-toggle) ---
  const navToggleButtons = $$('.nav-toggle');
  navToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mobileSidebar = document.getElementById('mobileSidebar');
      const sidebarBackdrop = document.getElementById('sidebarBackdrop');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));

      // If there is a mobile sidebar element, open/close it. Otherwise fallback to nav-links
      if (mobileSidebar && sidebarBackdrop) {
        mobileSidebar.classList.toggle('open');
        sidebarBackdrop.classList.toggle('open');
        mobileSidebar.setAttribute('aria-hidden', String(expanded));
        sidebarBackdrop.setAttribute('aria-hidden', String(expanded));
        document.body.classList.toggle('nav-open', !expanded);
      } else {
        const nav = btn.closest('.nav');
        const links = $('.nav-links', nav);
        links.classList.toggle('show');
      }
    });
  });

  // Close nav helper
  const closeNavIfOpen = () => {
    $$('.nav-links').forEach(links => {
      if (links.classList.contains('show') || links.classList.contains('active')) {
        links.classList.remove('show');
        links.classList.remove('active');
      }
    });
    const mobileSidebar = document.getElementById('mobileSidebar');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    if (mobileSidebar && (mobileSidebar.classList.contains('open') || (sidebarBackdrop && sidebarBackdrop.classList.contains('open')))) {
      mobileSidebar.classList.remove('open');
      if (sidebarBackdrop) sidebarBackdrop.classList.remove('open');
      if (mobileSidebar) mobileSidebar.setAttribute('aria-hidden', 'true');
      if (sidebarBackdrop) sidebarBackdrop.setAttribute('aria-hidden', 'true');
    }
    const t = document.querySelector('.nav-toggle');
    if (t) t.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  // Close when clicking outside the mobile nav
  document.addEventListener('click', (e) => {
    const openNav = document.querySelector('.nav-links.show, .nav-links.active');
    if (!openNav) return;
    const insideNav = openNav.contains(e.target);
    const toggle = document.querySelector('.nav-toggle');
    if (toggle && toggle.contains(e.target)) return; // clicking toggle
    if (!insideNav) closeNavIfOpen();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNavIfOpen();
  });

  // --- Mobile sidebar controls (close button, backdrop clicks, link clicks) ---
  const mobileSidebar = document.getElementById('mobileSidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  if (mobileSidebar) {
    const sidebarClose = mobileSidebar.querySelector('.sidebar-close');
    if (sidebarClose) sidebarClose.addEventListener('click', closeNavIfOpen);
    // Close when clicking links inside the sidebar
    $$('.sidebar-links a', mobileSidebar).forEach(a => a.addEventListener('click', closeNavIfOpen));
  }
  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeNavIfOpen);
  }

  // --- Menu icon toggle (your added code) ---
  const menuIcon = document.querySelector('.menu-icon');
  const navLinks = document.querySelector('.nav-links');
  if (menuIcon && navLinks) {
    menuIcon.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // --- Close mobile nav when a link is clicked ---
  $$('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      const links = $('.nav-links');
      if (links.classList.contains('show')) {
        links.classList.remove('show');
        const toggle = $('.nav-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // --- Smooth scroll for internal anchors ---
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // --- Contact form handling (no backend) ---
  const contactForm = $('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      if (!name || name.length < 2) return alert('Please enter your name (at least 2 characters).');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert('Please enter a valid email address.');
      if (!message || message.length < 10) return alert('Please enter a message (at least 10 characters).');

      const subject = encodeURIComponent(`Contact from ${name} via CampusBuzz`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:hello@campusbuzz.site?subject=${subject}&body=${body}`;
      setTimeout(() => {
        alert('Thank you! Your default mail client should open. If it does not, please email hello@campusbuzz.site');
      }, 200);
      contactForm.reset();
    });
  }

  // --- Blog modal ---
  const modal = $('#blogModal');
  if (modal) {
    const openButtons = $$('.readmore');
    const modalTitle = $('#modalTitle');
    const modalDate = $('#modalDate');
    const modalBody = $('#modalBody');
    const modalClose = $('.modal-close');

    openButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.dataset.title || 'Article';
        const date = btn.dataset.date || '';
        const content = btn.dataset.content || 'Content unavailable.';
        modalTitle.textContent = title;
        modalDate.textContent = date;
        modalBody.textContent = content;
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    modalClose.addEventListener('click', () => {
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  }

  // --- Scroll-to-top button ---
  const scrollTopBtn = $('#scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // --- Fade-in on scroll ---
  const faders = $$('.fade-in');
  if ('IntersectionObserver' in window && faders.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    faders.forEach(f => io.observe(f));
  } else {
    faders.forEach(f => f.classList.add('in-view'));
  }

  // --- Button press animation ---
  $$('button, .btn, .btn-small, a.btn-ghost').forEach(el => {
    el.addEventListener('mousedown', () => el.classList.add('pressed'));
    el.addEventListener('mouseup', () => el.classList.remove('pressed'));
    el.addEventListener('mouseleave', () => el.classList.remove('pressed'));
  });
});
