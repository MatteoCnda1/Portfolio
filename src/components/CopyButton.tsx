import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

interface Props {
  value: string;
  label: string;
  copyText: string;
  copiedText: string;
}

/** Copie une adresse dans le presse-papiers, avec un retour visuel et une annonce pour lecteurs d'écran. */
export default function CopyButton({ value, label, copyText, copiedText }: Props) {
  const [copied, setCopied] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(id);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${value}`;
    }
  }

  const y = reduce ? 0 : 14;
  return (
    <button type="button" className="copy mono" onClick={copy} aria-label={`${label} — ${value}`}>
      <span className="copy__slot" aria-hidden="true">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={copied ? 'done' : 'idle'}
            initial={{ y, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -y, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          >
            {copied ? `✓ ${copiedText}` : copyText}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="sr-only" role="status">{copied ? copiedText : ''}</span>
    </button>
  );
}
