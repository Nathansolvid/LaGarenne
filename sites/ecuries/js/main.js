/**
 * ============================================================
 * Écuries du Domaine de Garenne — JavaScript principal
 * ============================================================
 */

'use strict';

/* ===== NAVIGATION ===== */
function initNav() {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  if (!nav) return;

  function updateNav() {
    if (window.scrollY > 60) {
      nav.classList.add('nav--solid');
      nav.classList.remove('nav--transparent');
    } else {
      nav.classList.remove('nav--solid');
      nav.classList.add('nav--transparent');
    }
  }
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
    mobileMenu.querySelectorAll('.nav__mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        mobileMenu.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
  }

  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('[data-nav-link]').forEach(link => {
    if (link.getAttribute('href') === currentFile) link.classList.add('nav__link--active');
  });
}

/* ===== SCROLL REVEAL ===== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length || !('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  elements.forEach(el => observer.observe(el));
}

/* ===== HERO SCROLL ===== */
function initHeroScroll() {
  const btn = document.querySelector('.hero__scroll');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = document.querySelector('main section, main .section');
    if (next) window.scrollTo({ top: next.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
}

/* ===== FORMAT PRIX ===== */
function fmt(n) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(n);
}

/* ===== ICÔNES ===== */
const ico = {
  camera: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" /></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>`,
  arrow: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>`,
};

/* ===== CHARGEMENT FORMULES PENSION (pension.html) ===== */
async function loadPension() {
  const container = document.getElementById('formules-grid');
  if (!container) return;

  try {
    const res = await fetch('data/pension.json');
    const { formules } = await res.json();

    container.innerHTML = formules.map(f => {
      const inclus = f.inclus.map(item =>
        `<li>${ico.check}<span>${item}</span></li>`
      ).join('');

      const badgePop = f.populaire
        ? `<span class="card-formule__badge-pop">Recommandée</span>` : '';

      return `
        <article class="card-formule ${f.populaire ? 'card-formule--populaire' : ''} reveal">
          <div class="card-formule__header">
            ${badgePop}
            <h2 class="card-formule__title">${f.nom}</h2>
            <p class="card-formule__desc">${f.description}</p>
            <div class="card-formule__prix">
              <span class="card-formule__ht">${fmt(f.prix_ht)}</span>
              <span class="card-formule__ttc">HT &nbsp;·&nbsp; ${fmt(f.prix_ttc)} TTC / mois</span>
            </div>
          </div>
          <div class="card-formule__body">
            <p class="card-formule__inclus-title">Inclus dans cette formule</p>
            <ul class="card-formule__inclus">${inclus}</ul>
          </div>
        </article>`;
    }).join('');

    initScrollReveal();
  } catch (err) {
    container.innerHTML = `<p style="padding:2rem;color:var(--c-text-mid);">
      Impossible de charger les formules. Servir depuis un serveur web (Vercel ou <code>npx serve sites/ecuries</code>).
    </p>`;
    console.error(err);
  }
}

/* ===== FORMULAIRE CONTACT ===== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const success = document.getElementById('form-success');
    btn.disabled = true;
    btn.textContent = 'Envoi en cours…';

    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(form) });
      if (res.ok) {
        form.style.display = 'none';
        if (success) success.style.display = 'block';
      } else throw new Error('Erreur serveur');
    } catch (err) {
      btn.disabled = false;
      btn.textContent = 'Envoyer le message';
      alert('Une erreur est survenue. Contactez-nous directement au 07 67 17 62 69.');
      console.error(err);
    }
  });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initHeroScroll();
  loadPension();
  initContactForm();
});
