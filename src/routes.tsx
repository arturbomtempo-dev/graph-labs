import { LocaleLayout } from '@/components/LocaleLayout';
import { legacyRoutes, localizedPath, routeSlugs, type RouteKey } from '@/i18n/config';
import { About } from '@/pages/About';
import { Algorithms } from '@/pages/Algorithms';
import { Docs } from '@/pages/Docs';
import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';
import { Studio } from '@/pages/Studio';
import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const pages: { route: Exclude<RouteKey, 'home'>; element: ReactElement }[] = [
    { route: 'studio', element: <Studio /> },
    { route: 'algorithms', element: <Algorithms /> },
    { route: 'docs', element: <Docs /> },
    { route: 'about', element: <About /> },
];

export function AppRoutes() {
    return (
        <Routes>
            {legacyRoutes.map((legacy) => (
                <Route
                    key={legacy.path}
                    path={legacy.path}
                    element={<Navigate to={localizedPath('pt-br', legacy.route)} replace />}
                />
            ))}
            <Route path="/:locale?" element={<LocaleLayout />}>
                <Route index element={<Home />} />
                {pages.map((page) => (
                    <Route key={page.route} path={routeSlugs[page.route]} element={page.element} />
                ))}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
