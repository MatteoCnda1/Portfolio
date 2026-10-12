/* Mouvement « statique » du site, sans React : reveals, traces, parallaxe, rideau de transition.
   Même moteur que Framer Motion (package `motion`), ~quelques ko.
   Rien ne s'exécute si l'utilisateur préfère réduire les animations : le CSS affiche alors tout. */
import { animate, inView, scroll, stagger } from 'motion';

const EASE = [0.22, 1, 0.36, 1] as const;
const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 761px)').matches;
const root = document.documentElement;

function reveals() {
  // Lignes de titre masquées : chaque ligne glisse depuis sous son masque.
  document.querySelectorAll<HTMLElement>('[data-reveal="line"]').forEach((el) => {
    const spans = el.querySelectorAll<HTMLElement>('.line > span');
    const delay = Number(el.dataset.delay ?? 0);
    inView(el, () => {
      animate(spans, { y: ['105%', '0%'] }, { duration: 1.05, ease: EASE, delay: stagger(0.085, { startDelay: delay }) });
    }, { amount: 0.4 });
  });

  // Blocs : fondu + montée de 32 px. Les enfants d'un groupe arrivent en cascade.
  document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal="line"])').forEach((el) => {
    const group = el.closest<HTMLElement>('[data-reveal-group]');
    const siblings = group ? Array.from(group.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal="line"])')) : [el];
    const i = Math.max(0, siblings.indexOf(el));
    const delay = Number(el.dataset.delay ?? 0) + Math.min(i, 6) * 0.07;
    inView(el, () => {
      animate(el, { opacity: [0, 1], y: [32, 0] }, { duration: 1, ease: EASE, delay });
    }, { margin: '0px 0px -8% 0px' });
  });

  // Traces : le filet se dessine de gauche à droite, les nœuds s'allument ensuite.
  document.querySelectorAll<HTMLElement>('[data-trace]').forEach((el) => {
    const lines = el.querySelectorAll<HTMLElement>('.trace__line');
    const nodes = el.querySelectorAll<HTMLElement>('.trace__node');
    inView(el, () => {
      animate(lines, { scaleX: [0, 1] }, { duration: 1.4, ease: EASE, delay: stagger(0.12) });
      animate(nodes, { opacity: [0, 1], scale: [0.4, 1] }, { duration: 0.5, ease: EASE, delay: stagger(0.18, { startDelay: 0.35 }) });
    }, { amount: 0.6 });
  });
}

function scrollLinked() {
  // Parallaxe légère — desktop uniquement.
  if (finePointer) {
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      const distance = Number(el.dataset.parallax ?? -60);
      scroll(animate(el, { y: [0, distance] }, { ease: 'linear' }), { target: el, offset: ['start end', 'end start'] });
    });
  }

  // Barre de lecture (case studies).
  document.querySelectorAll<HTMLElement>('[data-reading]').forEach((el) => {
    const target = document.querySelector<HTMLElement>(el.dataset.reading || 'main') ?? undefined;
    scroll(animate(el, { scaleX: [0, 1] }, { ease: 'linear' }), { target, offset: ['start start', 'end end'] });
  });
}

/* Hero : l'illustration défile à 0,22× la page et glisse de ±14 px avec la souris. */
function heroParallax() {
  const media = document.querySelector<HTMLElement>('[data-hero-media]');
  if (!media) return;
  let sy = 0;
  let mx = 0;
  let my = 0;
  let frame = 0;
  const apply = () => {
    frame = 0;
    media.style.transform = `translate3d(${mx * -14}px, ${sy * 0.22 + my * -8}px, 0)`;
  };
  const queue = () => { if (!frame) frame = requestAnimationFrame(apply); };
  window.addEventListener('scroll', () => {
    // Au-delà du premier écran, le hero n'est plus visible : inutile de recalculer.
    if (window.scrollY > window.innerHeight * 1.2 && sy > window.innerHeight) return;
    sy = window.scrollY;
    queue();
  }, { passive: true });
  if (finePointer) {
    window.addEventListener('pointermove', (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      queue();
    }, { passive: true });
  }
  sy = window.scrollY;
  apply();
}

/* Rideau vers une étude de cas : il monte, affiche le titre, puis la page suivante le retire
   (voir le script inline de Base.astro et html[data-curtain] dans global.css). */
function curtain() {
  if (root.dataset.curtain === 'in') {
    requestAnimationFrame(() => {
      root.dataset.curtain = 'out';
      window.setTimeout(() => {
        delete root.dataset.curtain;
        root.style.removeProperty('--curtain-title');
      }, 800);
    });
  }

  document.addEventListener('click', (e) => {
    const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[data-curtain]');
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (link.target === '_blank' || link.origin !== window.location.origin) return;
    e.preventDefault();

    const kicker = root.lang.startsWith('fr') ? 'Étude de cas' : 'Case study';
    const el = document.createElement('div');
    el.className = 'curtain';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<span class="curtain__kicker mono"></span><span class="curtain__title"></span>';
    el.firstElementChild!.textContent = kicker;
    el.lastElementChild!.textContent = link.dataset.curtain ?? '';
    document.body.append(el);

    animate(Array.from(el.children), { opacity: [0, 1], y: [40, 0] }, { duration: 0.4, ease: EASE, delay: 0.3 });
    animate(el, { y: ['100%', '0%'] }, { duration: 0.6, ease: CURTAIN_EASE }).then(() => {
      try { sessionStorage.setItem('curtain', link.dataset.curtain ?? ''); } catch { /* stockage indisponible : la page arrive sans rideau */ }
      window.location.assign(link.href);
    });
  });

  // Retour arrière depuis le cache (bfcache) : la page revient telle quelle, rideau compris.
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) document.querySelectorAll('.curtain').forEach((n) => n.remove());
  });
}

root.dataset.motion = 'ready';

if (!reduce) {
  reveals();
  scrollLinked();
  heroParallax();
  curtain();
}
