export const langs = ['fr', 'en'] as const;
export type Lang = (typeof langs)[number];
export type L10n<T = string> = Record<Lang, T>;

/** Routes logiques → chemins localisés. Les slugs de projets sont identiques dans les deux langues. */
const routes = {
  home: { fr: '/', en: '/en/' },
  projects: { fr: '/projets/', en: '/en/projects/' },
  about: { fr: '/a-propos/', en: '/en/about/' },
  contact: { fr: '/contact/', en: '/en/contact/' },
} as const satisfies Record<string, L10n>;

export type RouteKey = keyof typeof routes;

export function path(route: RouteKey, lang: Lang): string {
  return routes[route][lang];
}

export function projectPath(slug: string, lang: Lang): string {
  return `${routes.projects[lang]}${slug}/`;
}

export const ui = {
  skip: { fr: 'Aller au contenu', en: 'Skip to content' },
  nav: {
    home: { fr: 'Accueil', en: 'Home' },
    projects: { fr: 'Projets', en: 'Work' },
    about: { fr: 'À propos', en: 'About' },
    contact: { fr: 'Contact', en: 'Contact' },
    menu: { fr: 'Menu', en: 'Menu' },
    close: { fr: 'Fermer', en: 'Close' },
    primary: { fr: 'Navigation principale', en: 'Main navigation' },
    switchTo: { fr: 'Read in English', en: 'Lire en français' },
  },
  role: {
    fr: 'Réseaux · Systèmes · Cybersécurité',
    en: 'Networks · Systems · Security',
  },
  location: { fr: 'Marseille, France', en: 'Marseille, France' },
  view: { fr: 'Voir', en: 'View' },
  open: { fr: 'Ouvrir', en: 'Open' },
  copy: { fr: 'Copier', en: 'Copy' },
  copied: { fr: 'Copié', en: 'Copied' },
  copyLabel: { fr: 'Copier l’adresse', en: 'Copy address' },
  newTab: { fr: '(nouvel onglet)', en: '(opens in new tab)' },
  allProjects: { fr: 'Tous les projets', en: 'All work' },
  nextProject: { fr: 'Projet suivant', en: 'Next project' },
  backToTop: { fr: 'Haut de page', en: 'Back to top' },
  rights: { fr: 'Conçu et développé à Marseille.', en: 'Designed and built in Marseille.' },
} as const;

export function otherLang(lang: Lang): Lang {
  return lang === 'fr' ? 'en' : 'fr';
}

export const htmlLang: L10n = { fr: 'fr-FR', en: 'en-GB' };
export const ogLocale: L10n = { fr: 'fr_FR', en: 'en_GB' };
