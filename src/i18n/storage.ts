import { isLocale, LOCALE_STORAGE_KEY, type Locale } from './config';

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
