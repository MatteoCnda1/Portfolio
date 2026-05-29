// ========================
// LANGUAGE TOGGLE
// ========================
function toggleLanguage() {
  const currentLang = document.body.getAttribute('lang');
  const newLang = currentLang === 'fr' ? 'en' : 'fr';
  document.body.setAttribute('lang', newLang);
  
  try {
    localStorage.setItem('preferredLang', newLang);
  } catch (e) {}
}

// ========================
// INITIALISATION
// ========================
window.addEventListener('DOMContentLoaded', function() {
  
  // Charger langue
  let savedLang = 'fr';
  try {
    savedLang = localStorage.getItem('preferredLang') || 'fr';
  } catch (e) {}
  document.body.setAttribute('lang', savedLang);
  
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  
  // Animation au scroll
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  const elementsToAnimate = document.querySelectorAll(
    '.project-card, .skill-item, .bio-section, .certifications-list li, .contact-info, .contact-form'
  );
  
  elementsToAnimate.forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
  });
  
  // Accordion projets
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(function(card) {
    card.addEventListener('click', function() {
      const details = this.querySelector('.project-details');
      if (details) {
        document.querySelectorAll('.project-details').forEach(function(detail) {
          if (detail !== details) {
            detail.classList.remove('open');
          }
        });
        details.classList.toggle('open');
      }
    });
  });
  
  // Lien actif navbar
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function(link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.style.color = 'var(--accent)';
    }
  });
  
  // Validation formulaire
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      
      let isValid = true;
      let errorMessage = '';
      
      if (name && name.value.trim().length < 2) {
        errorMessage = document.body.getAttribute('lang') === 'fr' 
          ? 'Veuillez entrer un nom valide (minimum 2 caractères)' 
          : 'Please enter a valid name (minimum 2 characters)';
        isValid = false;
      }
      
      if (email && !email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errorMessage = document.body.getAttribute('lang') === 'fr' 
          ? 'Veuillez entrer un email valide' 
          : 'Please enter a valid email';
        isValid = false;
      }
      
      if (message && message.value.trim().length < 10) {
        errorMessage = document.body.getAttribute('lang') === 'fr' 
          ? 'Le message doit contenir au moins 10 caractères' 
          : 'Message must be at least 10 characters';
        isValid = false;
      }
      
      if (!isValid) {
        e.preventDefault();
        alert(errorMessage);
      }
    });
    
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(function(input) {
      input.addEventListener('focus', function() {
        this.style.transform = 'scale(1.02)';
      });
      input.addEventListener('blur', function() {
        this.style.transform = 'scale(1)';
      });
    });
  }
  
  // Menu mobile
  if (window.innerWidth <= 768) {
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    
    if (navContainer && navLinks && !document.querySelector('.hamburger')) {
      const hamburger = document.createElement('button');
      hamburger.className = 'hamburger';
      hamburger.innerHTML = '☰';
      hamburger.style.cssText = `
        display: block;
        background: none;
        border: 2px solid var(--accent);
        color: var(--accent);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 8px;
        transition: all 0.3s ease;
      `;
      
      navContainer.insertBefore(hamburger, navLinks);
      navLinks.style.display = 'none';
      
      hamburger.addEventListener('click', function() {
        if (navLinks.style.display === 'none' || navLinks.style.display === '') {
          navLinks.style.display = 'flex';
          hamburger.innerHTML = '✕';
        } else {
          navLinks.style.display = 'none';
          hamburger.innerHTML = '☰';
        }
      });
      
      navLinks.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
          navLinks.style.display = 'none';
          hamburger.innerHTML = '☰';
        });
      });
    }
  }
  
  // ========================
  // EFFETS AVANCÉS PAGE HERO
  // ========================
  const heroImg = document.querySelector('.hero-img');
  
  // Parallax image hero
  if (heroImg) {
    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.3;
      if (scrolled < window.innerHeight) {
        heroImg.style.transform = 'translateY(' + rate + 'px)';
      }
    });
  }
  
  // Effet de souris sur les cartes de projet
  projectCards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });
  
  // Effet typing sur la description hero
  const heroDesc = document.querySelector('.hero-description');
  if (heroDesc) {
    const textElements = heroDesc.querySelectorAll('.lang-fr, .lang-en');
    textElements.forEach(function(el) {
      const originalText = el.textContent;
      el.setAttribute('data-text', originalText);
    });
  }
  
  // Particules animées (optionnel)
  createParticles();
  
  console.log('Portfolio chargé! 🚀');
});

// ========================
// SYSTÈME DE PARTICULES
// ========================
function createParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles-container';
  particlesContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
  `;
  
  hero.insertBefore(particlesContainer, hero.firstChild);
  
  for (let i = 0; i < 30; i++) {
    createParticle(particlesContainer);
  }
}

function createParticle(container) {
  const particle = document.createElement('div');
  const size = Math.random() * 4 + 2;
  const startX = Math.random() * 100;
  const duration = Math.random() * 20 + 15;
  const delay = Math.random() * 5;
  
  particle.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    background: radial-gradient(circle, rgba(0, 217, 255, 0.8) 0%, transparent 70%);
    border-radius: 50%;
    left: ${startX}%;
    bottom: -10px;
    animation: floatUp ${duration}s linear ${delay}s infinite;
    opacity: 0;
  `;
  
  container.appendChild(particle);
}

// Ajouter l'animation CSS pour les particules
const style = document.createElement('style');
style.textContent = `
  @keyframes floatUp {
    0% {
      transform: translateY(0) translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 0.6;
    }
    90% {
      opacity: 0.3;
    }
    100% {
      transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);