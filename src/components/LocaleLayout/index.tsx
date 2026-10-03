import { AppShell } from '@/components/AppShell';
import {
    defaultLocale,
    localeSettings,
    localizedPath,
    readStoredLocale,
    storeLocale,
    translatePath,
    type Locale,
    type RouteKey,
} from '@/i18n/config';
import { I18nContext, type I18nValue } from '@/i18n/context';
import { getDictionary } from '@/i18n/dictionaries';
import { useCallback, useEffect, useMemo } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

interface LocaleLayoutProps {
    locale: Locale;
}

export function LocaleLayout({ locale }: LocaleLayoutProps) {
    const { pathname, search, hash } = useLocation();
    const navigate = useNavigate();
    const storedLocale = readStoredLocale();
    const t = getDictionary(locale);

    useEffect(() => {
        document.documentElement.lang = localeSettings[locale].htmlLang;
        document.title = t.shell.meta.title;
        document
            .querySelector('meta[name="description"]')
            ?.setAttribute('content', t.shell.meta.description);
    }, [locale, t]);

    const changeLocale = useCallback(
        (next: Locale) => {
            storeLocale(next);
            if (next === locale) return;
            navigate(`${translatePath(pathname, next)}${search}${hash}`);
        },
        [locale, navigate, pathname, search, hash]
    );

    const value = useMemo<I18nValue>(() => {
        const numberFormat = new Intl.NumberFormat(localeSettings[locale].htmlLang);
        return {
            locale,
            t,
            path: (route: RouteKey, target?: string) => localizedPath(locale, route, target),
            changeLocale,
            formatNumber: (number: number) => numberFormat.format(number),
        };
    }, [locale, t, changeLocale]);

    if (locale === defaultLocale && storedLocale && storedLocale !== defaultLocale) {
        return <Navigate to={`${translatePath(pathname, storedLocale)}${search}${hash}`} replace />;
    }

    return (
        <I18nContext.Provider value={value}>
            <AppShell />
        </I18nContext.Provider>
    );
}
