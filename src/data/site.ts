import type { L10n } from '@/i18n';

export const person = {
  name: 'Mattéo Canada',
  email: 'm.canada13960@gmail.com',
  emailUniv: 'matteo.canada@etu.univ-amu.fr',
  linkedin: 'https://www.linkedin.com/in/matt%C3%A9o-canada-a46074335/',
  github: 'https://github.com/MatteoCnda1',
  knowledgeBase: 'https://knowledge.rudylink.eu',
  coords: '43°17′N — 5°22′E',
};

export const socials = [
  { label: 'LinkedIn', href: person.linkedin },
  { label: 'GitHub', href: person.github },
  { label: { fr: 'Base de connaissances', en: 'Knowledge base' } satisfies L10n, href: person.knowledgeBase },
] as const;
