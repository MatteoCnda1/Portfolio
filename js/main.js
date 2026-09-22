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
  if (window.innerWidth <= 720) {
    const container = document.querySelector('.nav-container');
    const links = document.querySelector('.nav-links');
    if (container && links && !document.querySelector('.hamburger')) {
      const burger = document.createElement('button');
      burger.className = 'hamburger';
      burger.setAttribute('aria-label', 'Menu');
      burger.innerHTML = '☰';
      burger.style.cssText = 'display:block;background:none;border:1px solid var(--line-strong);color:var(--ink);font-size:1.25rem;line-height:1;cursor:pointer;padding:6px 10px;border-radius:8px;';
      container.appendChild(burger);
      links.style.cssText = 'display:none;position:absolute;top:100%;left:0;right:0;flex-direction:column;align-items:flex-start;gap:18px;background:var(--paper);border-bottom:1px solid var(--line);padding:22px var(--gutter);';
      links.querySelectorAll('li').forEach(li => li.style.display = 'block');
      burger.addEventListener('click', function () {
        const open = links.style.display === 'flex';
        links.style.display = open ? 'none' : 'flex';
        burger.innerHTML = open ? '☰' : '✕';
      });
      links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        links.style.display = 'none'; burger.innerHTML = '☰';
      }));
    }
  }
});
