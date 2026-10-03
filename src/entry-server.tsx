import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { localeFromPath, locales, localizedPath, routeFromPath } from './i18n/config';
import { loadDictionary } from './i18n/dictionaries';
import { createPageHead, createSitemap, pageRoutes, renderHeadTags } from './i18n/seo';
import { AppRoutes } from './routes';

export const NOT_FOUND_PATH = '/404';

export const prerenderPaths = [
    ...pageRoutes.flatMap((route) => locales.map((locale) => localizedPath(locale, route))),
    NOT_FOUND_PATH,
];

export async function render(path: string) {
    const locale = localeFromPath(path);
    const dictionary = await loadDictionary(locale);
    const isNotFound = path === NOT_FOUND_PATH;
    const page = isNotFound ? 'notFound' : (routeFromPath(path) ?? 'notFound');
    const head = createPageHead(locale, page, dictionary);

    const html = renderToString(
        <StrictMode>
            <StaticRouter location={path}>
                <AppRoutes />
            </StaticRouter>
        </StrictMode>
    );

    return {
        html,
        lang: head.lang,
        locale,
        headTags: renderHeadTags(head),
        hydrate: !isNotFound,
    };
}

export { createSitemap };
