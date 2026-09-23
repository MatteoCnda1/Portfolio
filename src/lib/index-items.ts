import { getImage } from 'astro:assets';
import type { IndexItem } from '@/components/ProjectIndex';
import { projectPath, type Lang } from '@/i18n';
import { domains, projects } from '@/data/projects';

/** Données sérialisables pour l'îlot React de l'index (images pré-optimisées au build). */
export async function indexItems(lang: Lang): Promise<IndexItem[]> {
  return Promise.all(
    projects.map(async (p) => {
      const [preview, thumb] = await Promise.all([
        getImage({ src: p.image, width: 760, format: 'webp', quality: 78 }),
        getImage({ src: p.image, width: 160, height: 160, fit: 'cover', format: 'webp', quality: 70 }),
      ]);
      return {
        slug: p.slug,
        href: projectPath(p.slug, lang),
        number: p.number,
        title: p.short[lang],
        category: p.category[lang],
        context: p.context[lang],
        domains: p.domains,
        fit: p.fit,
        preview: preview.src,
        thumb: thumb.src,
      };
    }),
  );
}

export function domainFilters(lang: Lang) {
  return domains.map((d) => ({ id: d.id, label: d.label[lang] }));
}
