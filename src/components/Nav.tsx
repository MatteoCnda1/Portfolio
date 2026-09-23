import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import type { Lang, RouteKey } from '@/i18n';
import './Nav.css';

interface Props {
  lang: Lang;
  current: RouteKey | null;
  links: { key: RouteKey; href: string; label: string }[];
  homeHref: string;
  altHref: string;
  altLang: Lang;
  altLabel: string;
  email: string;
  socials: { label: string; href: string }[];
}

const EASE = [0.22, 1, 0.36, 1] as const;
const t = {
  menu: { fr: 'Menu', en: 'Menu' },
  close: { fr: 'Fermer', en: 'Close' },
  home: { fr: 'Accueil', en: 'Home' },
  nav: { fr: 'Navigation principale', en: 'Main navigation' },
  write: { fr: 'Écrire', en: 'Write' },
};

export default function Nav({ lang, current, links, homeHref, altHref, altLang, altLabel, email, socials }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState<RouteKey | null>(null);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const menuBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    // Se retire quand on descend (plus de place pour le contenu), revient dès qu'on remonte.
    setHidden(!open && y > 480 && y > prev + 4);
    if (y < prev - 4) setHidden(false);
  });

  // Menu plein écran : verrouillage du scroll, Échap, piège à focus, restitution du focus.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    const btn = menuBtn.current;
    const first = panel.current?.querySelector<HTMLElement>('a, button');
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      const header = panel.current?.closest('header');
      if (e.key !== 'Tab' || !header) return;
      // Ordre du DOM : marque, bouton Menu, puis liens du panneau — seuls les éléments visibles comptent.
      const focusables = Array.from(header.querySelectorAll<HTMLElement>('a[href], button')).filter((el) => el.getClientRects().length > 0);
      const i = focusables.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); focusables[focusables.length - 1]?.focus(); }
      else if (!e.shiftKey && i === focusables.length - 1) { e.preventDefault(); focusables[0]?.focus(); }
    };
    const onResize = () => { if (window.innerWidth > 760) setOpen(false); };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      root.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      btn?.focus();
    };
  }, [open]);

  const marker = hovered ?? current;
  const allLinks = [{ key: 'home' as RouteKey, href: homeHref, label: t.home[lang] }, ...links];

  return (
    <header
      className="nav"
      data-scrolled={scrolled || open ? '' : undefined}
      data-hidden={hidden ? '' : undefined}
      data-open={open ? '' : undefined}
    >
      <div className="nav__bar wrap">
        <a className="nav__brand" href={homeHref} aria-current={current === 'home' ? 'page' : undefined}>
          <span>Mattéo Canada</span>
          <span className="nav__node" aria-hidden="true" />
        </a>

        <nav className="nav__links" aria-label={t.nav[lang]} onMouseLeave={() => setHovered(null)}>
          <ul role="list">
            {links.map((l) => (
              <li key={l.key}>
                <a
                  href={l.href}
                  aria-current={current === l.key ? 'page' : undefined}
                  onMouseEnter={() => setHovered(l.key)}
                  onFocus={() => setHovered(l.key)}
                  onBlur={() => setHovered(null)}
                >
                  {l.label}
                  {marker === l.key && (
                    <motion.span
                      className="nav__marker"
                      layoutId="nav-marker"
                      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 34 }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>
          <a className="nav__lang mono" href={altHref} hrefLang={altLang} lang={altLang} aria-label={altLabel}>
            <span aria-hidden="true" className={lang === 'fr' ? 'is-on' : ''}>FR</span>
            <span aria-hidden="true">/</span>
            <span aria-hidden="true" className={lang === 'en' ? 'is-on' : ''}>EN</span>
          </a>
        </nav>

        <button
          ref={menuBtn}
          type="button"
          className="nav__toggle mono"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="nav__toggle-label">{open ? t.close[lang] : t.menu[lang]}</span>
          <span className="nav__toggle-icon" aria-hidden="true"><i /><i /></span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panel}
            className="nav__panel"
            role="dialog"
            aria-modal="true"
            aria-label={t.nav[lang]}
            initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
            exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: reduce ? 0.01 : 0.55, ease: EASE }}
          >
            <nav className="nav__panel-inner wrap" aria-label={t.nav[lang]}>
              <ul role="list" className="nav__panel-links">
                {allLinks.map((l, i) => (
                  <li key={l.key} className="line">
                    <motion.a
                      href={l.href}
                      aria-current={current === l.key ? 'page' : undefined}
                      onClick={() => setOpen(false)}
                      initial={reduce ? false : { y: '100%' }}
                      animate={{ y: '0%' }}
                      exit={reduce ? undefined : { y: '-40%', opacity: 0 }}
                      transition={{ duration: 0.7, ease: EASE, delay: reduce ? 0 : 0.12 + i * 0.06 }}
                    >
                      <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                      {l.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
              <motion.div
                className="nav__panel-foot"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: reduce ? 0 : 0.4 }}
              >
                <a className="nav__panel-mail" href={`mailto:${email}`}>
                  <span className="mono muted">{t.write[lang]}</span>
                  {email}
                </a>
                <div className="nav__panel-row mono">
                  {socials.map((s) => (
                    <a key={s.href} href={s.href} target="_blank" rel="noopener">{s.label} ↗</a>
                  ))}
                  <a href={altHref} hrefLang={altLang} lang={altLang}>{altLabel}</a>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
