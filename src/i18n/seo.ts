import { locales, localeSettings, localizedPath, routeSlugs, type Locale, type RouteKey } from './config';
import type { Dictionary } from './dictionaries';

export const SITE_URL = 'https://www.graphlabs.arturbomtempo.dev';

export const SEO_ATTRIBUTE = 'data-seo';

export type PageKey = RouteKey | 'notFound';

const ogLocales: Record<Locale, string> = {
    en: 'en_US',
    'pt-br': 'pt_BR',
    es: 'es_ES',
};

export interface PageHead {
    lang: string;
    title: string;
    description: string;
    imageAlt: string;
    url: string | null;
    ogLocale: string;
    alternateOgLocales: string[];
    alternates: { hreflang: string; href: string }[];
    indexable: boolean;
}

export const pageRoutes = Object.keys(routeSlugs) as RouteKey[];

export function absoluteUrl(path: string): string {
    return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

function alternatesFor(route: RouteKey): PageHead['alternates'] {
    return [
        ...locales.map((locale) => ({
            hreflang: localeSettings[locale].htmlLang,
            href: absoluteUrl(localizedPath(locale, route)),
        })),
        { hreflang: 'x-default', href: absoluteUrl(localizedPath('en', route)) },
    ];
}

export function createPageHead(locale: Locale, page: PageKey, dictionary: Dictionary): PageHead {
    const meta = dictionary.shell.meta;
    const isPage = page !== 'notFound';

    return {
        lang: localeSettings[locale].htmlLang,
        title: meta.pages[page].title,
        description: meta.pages[page].description,
        imageAlt: meta.imageAlt,
        url: isPage ? absoluteUrl(localizedPath(locale, page)) : null,
        ogLocale: ogLocales[locale],
        alternateOgLocales: locales
            .filter((candidate) => candidate !== locale)
            .map((candidate) => ogLocales[candidate]),
        alternates: isPage ? alternatesFor(page) : [],
        indexable: isPage,
    };
}

function escapeAttribute(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

export function renderHeadTags(head: PageHead): string {
    const marker = SEO_ATTRIBUTE;
    const meta = (key: 'name' | 'property', name: string, content: string) =>
        `<meta ${key}="${name}" content="${escapeAttribute(content)}" ${marker} />`;

    return [
        `<title ${marker}>${escapeAttribute(head.title)}</title>`,
        meta('name', 'description', head.description),
        head.indexable ? null : meta('name', 'robots', 'noindex'),
        head.url ? `<link rel="canonical" href="${head.url}" ${marker} />` : null,
        ...head.alternates.map(
            (alternate) =>
                `<link rel="alternate" hreflang="${alternate.hreflang}" href="${alternate.href}" ${marker} />`
        ),
        head.url ? meta('property', 'og:url', head.url) : null,
        meta('property', 'og:title', head.title),
        meta('property', 'og:description', head.description),
        meta('property', 'og:locale', head.ogLocale),
        ...head.alternateOgLocales.map((locale) => meta('property', 'og:locale:alternate', locale)),
        meta('property', 'og:image:alt', head.imageAlt),
        meta('name', 'twitter:title', head.title),
        meta('name', 'twitter:description', head.description),
    ]
        .filter(Boolean)
        .join('\n        ');
}

export function applyPageHead(head: PageHead) {
    document.documentElement.lang = head.lang;
    document.head.querySelectorAll(`[${SEO_ATTRIBUTE}]`).forEach((element) => element.remove());
    document.head.insertAdjacentHTML('beforeend', renderHeadTags(head));
}

export function createSitemap(): string {
    const entries = pageRoutes.flatMap((route) =>
        locales.map((locale) => {
            const links = alternatesFor(route)
                .map(
                    (alternate) =>
                        `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${alternate.href}" />`
                )
                .join('\n');
            return `  <url>\n    <loc>${absoluteUrl(localizedPath(locale, route))}</loc>\n${links}\n  </url>`;
        })
    );

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`;
}
