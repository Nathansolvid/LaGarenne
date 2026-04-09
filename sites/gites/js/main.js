/**
 * ============================================================
 * Gîtes du Domaine de Garenne — JavaScript principal
 * ============================================================
 */

'use strict';

/* ===== NAVIGATION ===== */
function initNav() {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  if (!nav) return;

  const banner = document.querySelector('.top-banner');
  const bannerH = banner ? banner.offsetHeight : 0;
  nav.style.top = bannerH + 'px';

  function updateNav() {
    const scrolled = window.scrollY > bannerH;
    nav.style.top = scrolled ? '0' : bannerH + 'px';
    if (scrolled) {
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

  // Lien actif
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('[data-nav-link]').forEach(link => {
    if (link.getAttribute('href') === currentFile) {
      link.classList.add('nav__link--active');
    }
  });
}

/* ===== SCROLL REVEAL ===== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length || !('IntersectionObserver' in window)) {
    // Fallback: tout afficher
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
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
    if (next) {
      const top = next.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
}

/* ===== FORMAT PRIX ===== */
function fmt(n) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(n);
}

/* ===== ICÔNES INLINE ===== */
const ico = {
  camera: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" /></svg>`,
  users: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>`,
  home:  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>`,
  arrow: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>`,
  star:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" /></svg>`,
  dog:   `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.9M18.75 9.75h-1.875a1.875 1.875 0 0 0 0 3.75h1.875M4.5 12.75l2.25-4.5" /></svg>`,
  nodog: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" /></svg>`,
};

/* ===== CHARGEMENT DES HÉBERGEMENTS (hebergements.html) ===== */
async function loadHebergements() {
  const container = document.getElementById('hebergements-grid');
  if (!container) return;

  try {
    const [hRes, tRes] = await Promise.all([
      fetch('data/hebergements.json'),
      fetch('data/tarifs.json')
    ]);
    const { hebergements } = await hRes.json();
    const { tarifs } = await tRes.json();

    // Index tarifs par ID
    const tarifsById = {};
    tarifs.forEach(t => { tarifsById[t.hebergement_id] = t; });

    container.innerHTML = hebergements.map((h, idx) => {
      const t = tarifsById[h.id] || {};
      let prixHtml = '';
      if (t.nuit) {
        prixHtml = `<div class="card-hebergement__price">${fmt(t.nuit.prix)} <small>/ nuit</small></div>
                    <div class="card-hebergement__price-note">${t.nuit.note}</div>`;
      } else if (t.weekend) {
        prixHtml = `<div class="card-hebergement__price">À partir de ${fmt(t.weekend.prix)} <small>/ week-end</small></div>
                    <div class="card-hebergement__price-note">${t.weekend.note}</div>`;
      }

      const badges = [];
      badges.push(`<span class="badge">${ico.users} ${h.capacite} pers.</span>`);
      if (h.surface) badges.push(`<span class="badge">${ico.home} ${h.surface} m²</span>`);
      if (h.chambres) badges.push(`<span class="badge">${h.chambres} ch.</span>`);

      const animauxHtml = h.type === 'gite'
        ? `<p class="card-hebergement__animaux">${h.animaux ? '🐾 Animaux acceptés (renseignez-vous)' : '🚫 Animaux non acceptés'}</p>`
        : '';

      // Carrousel photo
      const carId = `carousel-${h.id}`;
      let imageHtml;
      if (h.images && h.images.length > 0) {
        const slides = h.images.map((src, i) =>
          `<div class="carousel__slide" role="group" aria-label="${i + 1} / ${h.images.length}">
            <img src="${src}" alt="${h.nom} — photo ${i + 1}" loading="${i === 0 ? 'eager' : 'lazy'}">
          </div>`
        ).join('');
        const dots = h.images.length > 1 ? `
          <div class="carousel__dots" aria-hidden="true">
            ${h.images.map((_, i) => `<button class="carousel__dot${i === 0 ? ' is-active' : ''}" data-index="${i}" aria-label="Photo ${i + 1}"></button>`).join('')}
          </div>` : '';
        const arrows = h.images.length > 1 ? `
          <button class="carousel__prev" aria-label="Photo précédente">&#8249;</button>
          <button class="carousel__next" aria-label="Photo suivante">&#8250;</button>` : '';
        imageHtml = `
          <div class="carousel" id="${carId}" data-current="0">
            <div class="carousel__track">${slides}</div>
            ${arrows}${dots}
          </div>`;
      } else {
        imageHtml = `<div class="photo-ph photo-ph--ratio-4-3" style="background-color: ${h.couleur_placeholder};">
          <div class="photo-ph__inner">${ico.camera}<span>${h.nom}</span></div>
        </div>`;
      }

      return `
        <article class="card-hebergement reveal">
          <div class="card-hebergement__image">${imageHtml}</div>
          <div class="card-hebergement__body">
            <span class="card-hebergement__type">${h.type === 'gite' ? 'Gîte' : 'Roulotte'}</span>
            <h2 class="card-hebergement__title">${h.nom}</h2>
            <p class="card-hebergement__accroche">${h.accroche}</p>
            <div class="card-hebergement__badges">${badges.join('')}</div>
            <p class="card-hebergement__desc">${h.description}</p>
            ${prixHtml}
            ${animauxHtml}
            <a href="contact.html" class="card-hebergement__link">
              Réserver / Renseignements ${ico.arrow}
            </a>
          </div>
        </article>`;
    }).join('');

    // Réactiver le scroll reveal sur les nouveaux éléments
    initScrollReveal();
    // Initialiser les carrousels
    initCarousels();

  } catch (err) {
    container.innerHTML = `<p style="color:var(--c-text-mid); padding:2rem;">
      Impossible de charger les hébergements. Vérifiez que la page est servie depuis un serveur web.
    </p>`;
    console.error('Erreur chargement hébergements:', err);
  }
}

/* ===== CARROUSELS PHOTOS ===== */
function initCarousels() {
  document.querySelectorAll('.carousel').forEach(car => {
    const track = car.querySelector('.carousel__track');
    const slides = car.querySelectorAll('.carousel__slide');
    const dots = car.querySelectorAll('.carousel__dot');
    if (!track || slides.length < 2) return;

    let current = 0;

    function goTo(n) {
      current = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
      car.dataset.current = current;
    }

    car.querySelector('.carousel__prev')?.addEventListener('click', () => goTo(current - 1));
    car.querySelector('.carousel__next')?.addEventListener('click', () => goTo(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    // Swipe tactile
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    }, { passive: true });
  });
}

/* ===== CHARGEMENT DES SÉJOURS (sejours.html) ===== */
async function loadSejours() {
  const container = document.getElementById('sejours-grid');
  if (!container) return;

  try {
    const res = await fetch('data/sejours.json');
    const { sejours } = await res.json();

    container.innerHTML = sejours.map(s => {
      const inclus = s.inclus.map(item => `
        <li>${ico.check}<span>${item}</span></li>`).join('');

      const mentionHtml = (!s.disponible && s.mention)
        ? `<p class="card-sejour__mention">${s.mention}</p>` : '';

      const soonBadge = !s.disponible
        ? `<span class="card-sejour__soon-badge">Bientôt disponible</span>` : '';

      const ctaHtml = s.disponible
        ? `<a href="contact.html" class="btn btn-outline-white btn-sm" style="margin-top:auto; align-self:flex-start;">Nous contacter ${ico.arrow}</a>`
        : '';

      return `
        <article class="card-sejour ${!s.disponible ? 'card-sejour--indisponible' : ''} reveal">
          <div class="card-sejour__header">
            ${soonBadge}
            <h2 class="card-sejour__title">${s.nom}</h2>
            <p class="card-sejour__accroche">${s.accroche}</p>
          </div>
          <div class="card-sejour__body">
            <p class="card-sejour__desc">${s.description}</p>
            <div class="card-sejour__inclus">
              <p class="card-sejour__inclus-title">Ce qui est inclus</p>
              <ul>${inclus}</ul>
            </div>
            ${mentionHtml}
            ${ctaHtml}
          </div>
        </article>`;
    }).join('');

    initScrollReveal();
  } catch (err) {
    container.innerHTML = '<p style="padding:2rem;">Erreur de chargement.</p>';
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
      const data = new FormData(form);
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });

      if (res.ok) {
        form.style.display = 'none';
        if (success) success.style.display = 'block';
      } else {
        throw new Error('Réponse serveur non OK');
      }
    } catch (err) {
      btn.disabled = false;
      btn.textContent = 'Envoyer le message';
      alert('Une erreur est survenue. Veuillez nous appeler directement au 07 67 17 62 69.');
      console.error(err);
    }
  });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initHeroScroll();
  loadHebergements();
  loadSejours();
  initContactForm();
});
