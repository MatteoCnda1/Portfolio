// ========================
// LANGUE
// ========================
function toggleLanguage() {
  const cur = document.body.getAttribute('lang') || 'fr';
  const next = cur === 'fr' ? 'en' : 'fr';
  document.body.setAttribute('lang', next);
  try { localStorage.setItem('preferredLang', next); } catch (e) {}
}

window.addEventListener('DOMContentLoaded', function () {
  // Langue sauvegardée
  let lang = 'fr';
  try { lang = localStorage.getItem('preferredLang') || 'fr'; } catch (e) {}
  document.body.setAttribute('lang', lang);

  // Smooth scroll ancres
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const t = document.querySelector(this.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // Lien actif navbar
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    if (link.getAttribute('href') === page) link.style.color = 'var(--ink)';
  });

  // Menu mobile (sobre, sans néon)
  const container = document.querySelector('.nav-container');
  const links = document.querySelector('.nav-links');
  if (container && links && !document.querySelector('.hamburger')) {
    const burger = document.createElement('button');
    burger.className = 'hamburger';
    burger.setAttribute('aria-label', 'Menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(burger);
    burger.addEventListener('click', function () {
      const open = links.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open'); burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }));
  }
});
