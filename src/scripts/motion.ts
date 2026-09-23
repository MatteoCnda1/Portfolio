/* Mouvement « statique » du site, sans React : reveals, traces, parallaxe, progression.
   Même moteur que Framer Motion (package `motion`), ~quelques ko.
   Rien ne s'exécute si l'utilisateur préfère réduire les animations : le CSS affiche alors tout. */
import { animate, inView, scroll, stagger } from 'motion';

const EASE = [0.22, 1, 0.36, 1] as const;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 761px)').matches;

function reveals() {
  // Lignes de titre masquées : chaque ligne glisse depuis sous son masque.
  document.querySelectorAll<HTMLElement>('[data-reveal="line"]').forEach((el) => {
    const spans = el.querySelectorAll<HTMLElement>('.line > span');
    const delay = Number(el.dataset.delay ?? 0);
    inView(el, () => {
      animate(spans, { y: ['105%', '0%'] }, { duration: 1.05, ease: EASE, delay: stagger(0.085, { startDelay: delay }) });
    }, { amount: 0.4 });
  });

  // Blocs : fondu + légère montée. Les enfants d'un groupe arrivent en cascade.
  document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal="line"])').forEach((el) => {
    const group = el.closest<HTMLElement>('[data-reveal-group]');
    const siblings = group ? Array.from(group.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal="line"])')) : [el];
    const i = Math.max(0, siblings.indexOf(el));
    const delay = Number(el.dataset.delay ?? 0) + Math.min(i, 6) * 0.07;
    inView(el, () => {
      animate(el, { opacity: [0, 1], y: [22, 0] }, { duration: 0.9, ease: EASE, delay });
    }, { margin: '0px 0px -12% 0px' });
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

  // Ligne de temps du parcours qui se remplit au fil du scroll.
  document.querySelectorAll<HTMLElement>('[data-progress-line]').forEach((el) => {
    const target = el.parentElement ?? el;
    scroll(animate(el, { scaleY: [0, 1] }, { ease: 'linear' }), { target, offset: ['start 75%', 'end 60%'] });
  });

  // Barre de lecture (case studies).
  document.querySelectorAll<HTMLElement>('[data-reading]').forEach((el) => {
    const target = document.querySelector<HTMLElement>(el.dataset.reading || 'main') ?? undefined;
    scroll(animate(el, { scaleX: [0, 1] }, { ease: 'linear' }), { target, offset: ['start start', 'end end'] });
  });
}

document.documentElement.dataset.motion = 'ready';

if (!reduce) {
  reveals();
  scrollLinked();
}
