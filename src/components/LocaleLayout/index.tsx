import { AppShell } from '@/components/AppShell';
import { NotFound } from '@/pages/NotFound';
import {
    defaultLocale,
    localeSettings,
    localizedPath,
    prefixedLocales,
    readStoredLocale,
    routeFromPath,
    storeLocale,
    translatePath,
    type Locale,
    type RouteKey,
} from '@/i18n/config';
import { I18nContext, type I18nValue } from '@/i18n/context';
import { getDictionary, hasDictionary, loadDictionary } from '@/i18n/dictionaries';
import { applyPageHead, createPageHead } from '@/i18n/seo';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function resolveSegment(segment: string | undefined): { locale: Locale; valid: boolean } {
    if (segment === undefined) return { locale: defaultLocale, valid: true };
    const locale = prefixedLocales.find((candidate) => candidate === segment);
    return locale ? { locale, valid: true } : { locale: defaultLocale, valid: false };
}

export function LocaleLayout() {
    const { locale: segment } = useParams();
    const { pathname, search, hash } = useLocation();
    const navigate = useNavigate();
    const { locale: requestedLocale, valid } = resolveSegment(segment);

    const [readyLocale, setReadyLocale] = useState<Locale>(requestedLocale);
    const locale = hasDictionary(requestedLocale) ? requestedLocale : readyLocale;
    const t = getDictionary(locale);
    const page = valid ? (routeFromPath(pathname) ?? 'notFound') : 'notFound';

    useEffect(() => {
        let active = true;
        loadDictionary(requestedLocale).then(() => {
            if (active) setReadyLocale(requestedLocale);
        });
        return () => {
            active = false;
        };
    }, [requestedLocale]);

    useEffect(() => {
        const stored = readStoredLocale();
        if (requestedLocale !== defaultLocale || !stored || stored === defaultLocale) return;
        navigate(`${translatePath(pathname, stored)}${search}${hash}`, { replace: true });
    }, [requestedLocale, navigate, pathname, search, hash]);

    useEffect(() => {
        applyPageHead(createPageHead(locale, page, t));
    }, [locale, page, t]);

    const changeLocale = useCallback(
        async (next: Locale) => {
            storeLocale(next);
            if (next === locale) return;
            await loadDictionary(next);
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

    return (
        <I18nContext.Provider value={value}>
            <AppShell>{valid ? undefined : <NotFound />}</AppShell>
        </I18nContext.Provider>
    );
}
