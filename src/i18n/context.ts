import { createContext } from 'react';
import type { Locale, RouteKey } from './config';
import type { Dictionary } from './dictionaries';

export interface I18nValue {
    locale: Locale;
    t: Dictionary;
    path: (route: RouteKey, hash?: string) => string;
    changeLocale: (locale: Locale) => void;
    formatNumber: (value: number) => string;
}

export const I18nContext = createContext<I18nValue | null>(null);
