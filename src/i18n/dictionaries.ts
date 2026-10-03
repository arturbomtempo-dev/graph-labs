import type { Locale } from './config';
import type { en } from './locales/en';

export type Dictionary = typeof en;

export type AlgorithmTexts = Dictionary['algorithms'];

const loaders: Record<Locale, () => Promise<Dictionary>> = {
    en: () => import('./locales/en').then((module) => module.en),
    'pt-br': () => import('./locales/pt-br').then((module) => module.ptBr),
    es: () => import('./locales/es').then((module) => module.es),
};

const loaded = new Map<Locale, Dictionary>();
const pending = new Map<Locale, Promise<Dictionary>>();

export function hasDictionary(locale: Locale): boolean {
    return loaded.has(locale);
}

export function loadDictionary(locale: Locale): Promise<Dictionary> {
    const cached = loaded.get(locale);
    if (cached) return Promise.resolve(cached);

    const inFlight = pending.get(locale);
    if (inFlight) return inFlight;

    const request = loaders[locale]()
        .then((dictionary) => {
            loaded.set(locale, dictionary);
            return dictionary;
        })
        .finally(() => pending.delete(locale));
    pending.set(locale, request);
    return request;
}

export function getDictionary(locale: Locale): Dictionary {
    const dictionary = loaded.get(locale);
    if (!dictionary) throw new Error(`The "${locale}" dictionary has not been loaded yet.`);
    return dictionary;
}
