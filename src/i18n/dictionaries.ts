import type { Locale } from './config';
import { en } from './locales/en';
import { es } from './locales/es';
import { ptBr } from './locales/pt-br';

export type Dictionary = typeof en;

export type AlgorithmTexts = Dictionary['algorithms'];

const dictionaries: Record<Locale, Dictionary> = {
    en,
    'pt-br': ptBr,
    es,
};

export function getDictionary(locale: Locale): Dictionary {
    return dictionaries[locale];
}
