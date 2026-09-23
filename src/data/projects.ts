import type { ImageMetadata } from 'astro';
import type { L10n } from '@/i18n';
import content from './project-content.json';

/* Contenu détaillé des projets (repris à l'identique des anciennes modals) : project-content.json.
   Ici on ne décrit que la présentation : ordre, slug, contexte, domaines, visuels. */

type Html = L10n; // fragments HTML inline (<strong>, <code>, <span>)

export type Block =
  | { type: 'p'; fr: string; en: string }
  | { type: 'list'; items: Html[] }
  | { type: 'skills'; items: { title: Html; text: Html }[] }
  | { type: 'gallery'; items: { src: string | null; alt: string; caption: Html }[] }
  | { type: 'doc'; title: Html; text: Html; href: string };

export interface Section { title: L10n; blocks: Block[] }
export interface Doc { title: Html; text: Html; href: string }
export type Tag = string | L10n;

interface Content {
  card: { image: string; category: L10n; title: L10n; description: L10n; modal: string };
  category: L10n;
  title: L10n;
  subtitle: L10n;
  cover: string | null;
  sections: Section[];
  docs: Doc[];
  tags: Tag[];
}

export type Domain = 'network' | 'security' | 'embedded' | 'data';

export const domains: { id: Domain; label: L10n }[] = [
  { id: 'network', label: { fr: 'Réseaux & systèmes', en: 'Networks & systems' } },
  { id: 'security', label: { fr: 'Sécurité', en: 'Security' } },
  { id: 'embedded', label: { fr: 'Embarqué & IoT', en: 'Embedded & IoT' } },
  { id: 'data', label: { fr: 'Données & vision', en: 'Data & vision' } },
];

interface Meta {
  modal: string;
  slug: string;
  context: L10n;
  domains: Domain[];
  /** Visuel principal (cartes, index, couverture) */
  image: string;
  /** contain pour les schémas, cover pour les photos/illustrations */
  fit: 'cover' | 'contain';
  position?: string;
  /** Titre court pour l'index */
  short: L10n;
}

// Ordre = pertinence professionnelle : le plus récent et le plus technique d'abord.
const meta: Meta[] = [
  {
    modal: 'modal8', slug: 'lab-kvm-bastion-teleport',
    context: { fr: 'Lab personnel', en: 'Personal lab' },
    domains: ['network', 'security'],
    image: 'assets/projects/ansible-lab/architecture.png', fit: 'contain',
    short: { fr: 'Lab KVM — Bastion, Ansible & Teleport', en: 'KVM Lab — Bastion, Ansible & Teleport' },
  },
  {
    modal: 'modal7', slug: 'stage-steami-ble',
    context: { fr: 'Stage BUT 2 · 2026', en: 'Internship · 2026' },
    domains: ['embedded'],
    image: 'assets/projects/stage/iter_stand.jpg', fit: 'cover', position: '50% 55%',
    short: { fr: 'Stage — Embarqué BLE sur STeaMi', en: 'Internship — BLE on STeaMi' },
  },
  {
    modal: 'modal6', slug: 'projet-integratif',
    context: { fr: 'BUT R&T', en: 'BUT R&T' },
    domains: ['network'],
    image: 'assets/pr_integratif.png', fit: 'contain',
    short: { fr: 'Projet intégratif — Réseau d’entreprise', en: 'Integrative project — Enterprise network' },
  },
  {
    modal: 'modal5', slug: 'supervision-dhcp',
    context: { fr: 'Projet interne', en: 'In-house project' },
    domains: ['network'],
    image: 'assets/superv_pr.png', fit: 'contain',
    short: { fr: 'Supervision DHCP & parc', en: 'DHCP & fleet monitoring' },
  },
  {
    modal: 'modal4', slug: 'vision-par-ordinateur',
    context: { fr: 'SAE · BUT R&T', en: 'Coursework · BUT R&T' },
    domains: ['data', 'security'],
    image: 'assets/projects/computer_vision.png', fit: 'cover',
    short: { fr: 'Détection de silhouettes', en: 'Silhouette detection' },
  },
  {
    modal: 'modal3', slug: 'capture-the-flag',
    context: { fr: 'SAE · BUT 1', en: 'Coursework · Year 1' },
    domains: ['security'],
    image: 'assets/projects/ctf.jpg', fit: 'cover',
    short: { fr: 'Capture The Flag', en: 'Capture The Flag' },
  },
  {
    modal: 'modal2', slug: 'analyse-donnees-twitter',
    context: { fr: 'SAE · BUT 1', en: 'Coursework · Year 1' },
    domains: ['data'],
    image: 'assets/projects/twitter.png', fit: 'cover',
    short: { fr: 'Analyse de données Twitter', en: 'Twitter data analysis' },
  },
  {
    modal: 'modal1', slug: 'ruche-connectee',
    context: { fr: 'Lycée · Terminale', en: 'High school' },
    domains: ['embedded'],
    image: 'assets/projects/ruche.png', fit: 'cover', position: '50% 40%',
    short: { fr: 'Ruche connectée', en: 'Connected beehive' },
  },
];

const images = import.meta.glob<ImageMetadata>('/src/assets/**/*.{png,jpg,jpeg}', { eager: true, import: 'default' });

export function img(path: string): ImageMetadata {
  const found = images[`/src/${path}`];
  if (!found) throw new Error(`Image introuvable : ${path}`);
  return found;
}

export interface Project extends Omit<Content, 'card'>, Omit<Meta, 'modal' | 'image'> {
  index: number;
  number: string;
  summary: L10n;
  cardTags: Tag[];
  image: ImageMetadata;
}

const bySource = new Map((content as Content[]).map((p) => [p.card.modal, p]));

export const projects: Project[] = meta.map((m, i) => {
  const src = bySource.get(m.modal);
  if (!src) throw new Error(`Projet manquant : ${m.modal}`);
  const { card, ...rest } = src;
  const { modal: _modal, image, ...info } = m;
  return {
    ...rest,
    ...info,
    index: i,
    number: String(i + 1).padStart(2, '0'),
    summary: card.description,
    cardTags: rest.tags.slice(0, 4),
    image: img(image),
  };
});

export const featured = projects.slice(0, 3);

export function tagLabel(tag: Tag, lang: 'fr' | 'en'): string {
  return typeof tag === 'string' ? tag : tag[lang];
}
