import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface Props {
  items: { id: string; label: string; num: string }[];
  label: string;
}

/** Sommaire collant des études de cas : suit la section lue, marqueur animé. */
export default function CaseToc({ items, label }: Props) {
  const [active, setActive] = useState(items[0]?.id ?? '');
  const reduce = useReducedMotion();

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -65% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav className="toc" aria-label={label}>
      <p className="toc__label mono">{label}</p>
      <ol role="list">
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} aria-current={active === i.id ? 'location' : undefined}>
              {active === i.id && (
                <motion.span
                  className="toc__marker"
                  layoutId="toc-marker"
                  transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 32 }}
                />
              )}
              <span className="mono">{i.num}</span>
              <span>{i.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
