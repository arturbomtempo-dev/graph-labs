export const locales = ['en', 'pt-br', 'es'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const LOCALE_STORAGE_KEY = 'graph-labs-locale';

interface LocaleSettings {
    prefix: string;
    htmlLang: string;
    label: string;
    shortLabel: string;
}

export const localeSettings: Record<Locale, LocaleSettings> = {
    en: { prefix: '', htmlLang: 'en', label: 'English', shortLabel: 'EN' },
    'pt-br': { prefix: '/pt-br', htmlLang: 'pt-BR', label: 'Português (Brasil)', shortLabel: 'PT' },
    es: { prefix: '/es', htmlLang: 'es', label: 'Español', shortLabel: 'ES' },
};

export type RouteKey = 'home' | 'studio' | 'algorithms' | 'docs' | 'about';

export const routeSlugs: Record<RouteKey, string> = {
    home: '',
    studio: 'studio',
    algorithms: 'algorithms',
    docs: 'docs',
    about: 'about',
};

const routeKeys = Object.keys(routeSlugs) as RouteKey[];

export const legacyRoutes: { path: string; route: RouteKey }[] = [
    { path: '/estudio', route: 'studio' },
    { path: '/algoritmos', route: 'algorithms' },
    { path: '/documentacao', route: 'docs' },
    { path: '/sobre', route: 'about' },
];

export const prefixedLocales = locales.filter((locale) => locale !== defaultLocale);

export function isLocale(value: string | null): value is Locale {
    return locales.includes(value as Locale);
}

function joinPath(...segments: string[]): string {
    return `/${segments
        .map((segment) => segment.replace(/^\/+|\/+$/g, ''))
        .filter(Boolean)
        .join('/')}`;
}

export function localizedPath(locale: Locale, route: RouteKey, hash?: string): string {
    const path = joinPath(localeSettings[locale].prefix, routeSlugs[route]);
    return hash ? `${path}#${hash}` : path;
}

export function localeFromPath(pathname: string): Locale {
    const [firstSegment] = pathname.split('/').filter(Boolean);
    return prefixedLocales.find((locale) => locale === firstSegment) ?? defaultLocale;
}

function pathWithoutPrefix(pathname: string, locale: Locale): string {
    const prefix = localeSettings[locale].prefix;
    const rest = prefix && pathname.startsWith(prefix) ? pathname.slice(prefix.length) : pathname;
    return rest.replace(/^\/+|\/+$/g, '');
}

export function routeFromPath(pathname: string): RouteKey | null {
    const slug = pathWithoutPrefix(pathname, localeFromPath(pathname));
    return routeKeys.find((route) => routeSlugs[route] === slug) ?? null;
}

export function translatePath(pathname: string, target: Locale): string {
    return joinPath(
        localeSettings[target].prefix,
        pathWithoutPrefix(pathname, localeFromPath(pathname))
    );
}

export function readStoredLocale(): Locale | null {
    try {
        const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
        return isLocale(stored) ? stored : null;
    } catch {
        return null;
    }
}

export function storeLocale(locale: Locale) {
    try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
        return;
    }
}
