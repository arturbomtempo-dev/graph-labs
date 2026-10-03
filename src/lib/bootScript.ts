import { LOCALE_STORAGE_KEY, legacyRoutes, prefixedLocales } from '@/i18n/config';
import { DARK_THEME_CLASS, THEME_STORAGE_KEY } from './theme';

export function createBootScript(): string {
    const settings = JSON.stringify({
        themeKey: THEME_STORAGE_KEY,
        darkClass: DARK_THEME_CLASS,
        localeKey: LOCALE_STORAGE_KEY,
        prefixed: prefixedLocales,
        legacy: legacyRoutes.map((route) => route.path),
    });

    return `(function(s){try{var t=localStorage.getItem(s.themeKey);if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add(s.darkClass);var l=localStorage.getItem(s.localeKey),p=location.pathname,f=p.split('/')[1];if(s.prefixed.indexOf(l)!==-1&&s.prefixed.indexOf(f)===-1&&s.legacy.indexOf(p.replace(/\\/+$/,''))===-1&&p.indexOf('.')===-1)location.replace('/'+l+(p==='/'?'':p)+location.search+location.hash)}catch(e){}})(${settings});`;
}
