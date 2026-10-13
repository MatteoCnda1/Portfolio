import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import './ProjectIndex.css';

export interface IndexItem {
  slug: string;
  href: string;
  number: string;
  title: string;
  category: string;
  context: string;
  domains: string[];
  fit: 'cover' | 'contain';
  preview: string;
  thumb: string;
}

interface Props {
  items: IndexItem[];
  filters?: { id: string; label: string }[];
  allLabel?: string;
  filterLabel?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ProjectIndex({ items, filters, allLabel = 'Tous', filterLabel = 'Filtrer' }: Props) {
  const [filter, setFilter] = useState<string>('all');
  const [active, setActive] = useState<string | null>(null);
  const [fine, setFine] = useState(false);
  // Les aperçus ne sont chargés qu'au premier survol de la liste.
  const [armed, setArmed] = useState(false);
  const reduce = useReducedMotion();

  // Vignette flottante : position brute + ressort (l'image traîne un peu derrière le curseur).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const soft = reduce ? { stiffness: 2000, damping: 100 } : { stiffness: 170, damping: 22, mass: 0.6 };
  const imgX = useSpring(px, soft);
  const imgY = useSpring(py, soft);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 761px)');
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const visible = useMemo(
    () => (filter === 'all' ? items : items.filter((i) => i.domains.includes(filter))),
    [filter, items],
  );
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const i of items) for (const d of i.domains) c[d] = (c[d] ?? 0) + 1;
    return c;
  }, [items]);

  function onMove(e: React.MouseEvent) {
    px.set(e.clientX);
    py.set(e.clientY);
  }

  function onFocusRow(slug: string, el: HTMLElement) {
    // Au clavier : on ancre l'aperçu à droite de la ligne focalisée.
    const r = el.getBoundingClientRect();
    px.set(r.right - 360);
    py.set(r.top + r.height / 2);
    setActive(slug);
  }

  const activeItem = items.find((i) => i.slug === active);

  return (
    <div className="pindex" data-fine={fine ? '' : undefined}>
      {filters && (
        <div className="pindex__filters" role="group" aria-label={filterLabel}>
          {[{ id: 'all', label: allLabel }, ...filters].map((f) => {
            const on = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                className="pindex__filter mono"
                aria-pressed={on}
                onClick={() => setFilter(f.id)}
              >
                {on && (
                  <motion.span
                    className="pindex__filter-bg"
                    layoutId="filter-bg"
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 }}
                  />
                )}
                <span className="pindex__filter-label">{f.label}</span>
                <sup>{f.id === 'all' ? items.length : counts[f.id] ?? 0}</sup>
              </button>
            );
          })}
        </div>
      )}

      <ul
        role="list"
        className="pindex__list"
        onMouseMove={fine ? onMove : undefined}
        onMouseEnter={() => setArmed(true)}
        onFocus={() => setArmed(true)}
        onMouseLeave={() => setActive(null)}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((item) => (
            <motion.li
              key={item.slug}
              layout={!reduce}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <a
                href={item.href}
                className="pindex__row"
                data-curtain={item.title}
                data-active={active === item.slug ? '' : undefined}
                onMouseEnter={() => setActive(item.slug)}
                onFocus={(e) => onFocusRow(item.slug, e.currentTarget)}
                onBlur={() => setActive(null)}
              >
                <span className="pindex__num mono">{item.number}</span>
                <span className="pindex__title">{item.title}</span>
                <span className="pindex__cat">{item.category}</span>
                <span className="pindex__ctx mono">{item.context}</span>
                <span className="pindex__arrow" aria-hidden="true">→</span>
                <span className="pindex__thumb plate" aria-hidden="true">
                  <img src={item.thumb} alt="" loading="lazy" decoding="async" width="160" height="160" />
                </span>
              </a>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {fine && (
        <motion.div className="pindex__preview" style={{ x: imgX, y: imgY }} aria-hidden="true">
          <motion.div
            className="pindex__preview-frame"
            initial={false}
            animate={activeItem ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: reduce ? 1 : 0.86, rotate: reduce ? 0 : -2 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {armed && items.map((i) => (
              <motion.img
                key={i.slug}
                src={i.preview}
                alt=""
                decoding="async"
                data-fit={i.fit}
                initial={false}
                animate={{ opacity: active === i.slug ? 1 : 0, scale: active === i.slug || reduce ? 1 : 1.08 }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
