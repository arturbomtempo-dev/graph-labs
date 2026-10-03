import { LocaleLayout } from '@/components/LocaleLayout';
import { localeSettings, localizedPath, locales, routeSlugs, type RouteKey } from '@/i18n/config';
import { About } from '@/pages/About';
import { Algorithms } from '@/pages/Algorithms';
import { Docs } from '@/pages/Docs';
import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';
import { Studio } from '@/pages/Studio';
import type { ReactElement } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

const pages: { route: Exclude<RouteKey, 'home'>; element: ReactElement }[] = [
    { route: 'studio', element: <Studio /> },
    { route: 'algorithms', element: <Algorithms /> },
    { route: 'docs', element: <Docs /> },
    { route: 'about', element: <About /> },
];

const legacyPaths: { path: string; route: RouteKey }[] = [
    { path: '/estudio', route: 'studio' },
    { path: '/algoritmos', route: 'algorithms' },
    { path: '/documentacao', route: 'docs' },
    { path: '/sobre', route: 'about' },
];

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {legacyPaths.map((legacy) => (
                    <Route
                        key={legacy.path}
                        path={legacy.path}
                        element={<Navigate to={localizedPath('pt-br', legacy.route)} replace />}
                    />
                ))}
                {locales.map((locale) => (
                    <Route
                        key={locale}
                        path={localeSettings[locale].prefix || '/'}
                        element={<LocaleLayout locale={locale} />}
                    >
                        <Route index element={<Home />} />
                        {pages.map((page) => (
                            <Route
                                key={page.route}
                                path={routeSlugs[page.route]}
                                element={page.element}
                            />
                        ))}
                        <Route path="*" element={<NotFound />} />
                    </Route>
                ))}
            </Routes>
        </BrowserRouter>
    );
}
