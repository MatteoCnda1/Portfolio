import type { Lang } from '@/i18n';

/** Texte brut : apostrophes typographiques ; en français, espace fine insécable avant « ; : ! ? » et dans les guillemets. */
export function typoText(text: string, lang: Lang): string {
  const out = text.replace(/(\p{L})'(\p{L})/gu, '$1’$2');
  if (lang !== 'fr') return out;
  return out.replace(/ ([;:!?»])/g, ' $1').replace(/« /g, '« ');
}

/** Fragments HTML : même traitement, plus
 *  - « D@TA-i » jamais coupé à son tiret,
 *  - ordinaux (1ᵉʳ, 2ᵉ, 1ʳᵉ) en vrai exposant — les lettres modificatrices Unicode manquent dans Fraunces,
 *  - guillemets droits de texte (jamais ceux d'un attribut, précédés de « = ») en guillemets typographiques. */
export function typo(html: string, lang: Lang): string {
  return typoText(html, lang)
    .replace(/(^|[\s(>])"([^"<>=]+)"/g, (_, pre: string, inner: string) =>
      lang === 'fr' ? `${pre}«\u202F${inner}\u202F»` : `${pre}“${inner}”`)
    .replace(/ᵉʳ/g, '<sup>er</sup>')
    .replace(/ʳᵉ/g, '<sup>re</sup>')
    .replace(/ᵉ/g, '<sup>e</sup>')
    .replace(/D@TA-i/g, '<span class="nowrap">D@TA-i</span>');
}
