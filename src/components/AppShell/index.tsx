import { Footer } from '@/components/Footer';
import { IconButton } from '@/components/IconButton';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useI18n } from '@/hooks/useI18n';
import { routeFromPath, type RouteKey } from '@/i18n/config';
import { cn } from '@/lib/utils/cn';
import { Menu, Waypoints, X } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const navigationRoutes: RouteKey[] = ['home', 'studio', 'algorithms', 'docs', 'about'];

export function AppShell({ children }: { children?: ReactNode }) {
    const { t, path } = useI18n();
    const { pathname } = useLocation();
    const isStudio = routeFromPath(pathname) === 'studio';
    const [menuOpen, setMenuOpen] = useState(false);

    const navigation = navigationRoutes.map((route) => ({
        to: path(route),
        label: t.shell.nav[route],
        end: route === 'home',
    }));

    useEffect(() => {
        if (!menuOpen) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setMenuOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [menuOpen]);

    return (
        <div className="flex min-h-dvh flex-col">
            <header className="border-line bg-surface/85 sticky top-0 z-30 border-b backdrop-blur-md">
                <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center gap-2 px-4 sm:gap-3 sm:px-6">
                    <NavLink to={path('home')} className="flex shrink-0 items-center gap-2">
                        <span className="bg-brand text-brand-ink flex size-7 items-center justify-center rounded-lg">
                            <Waypoints size={16} />
                        </span>
                        <span className="text-ink text-sm font-semibold tracking-tight">
                            Graph Labs
                        </span>
                    </NavLink>

                    <nav
                        aria-label={t.shell.menu.navigation}
                        className="bg-surface-sunken border-line ml-auto hidden items-center gap-0.5 rounded-lg border p-0.5 md:flex"
                    >
                        {navigation.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    cn(
                                        'shrink-0 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-150',
                                        isActive
                                            ? 'bg-surface text-ink shadow-soft'
                                            : 'text-ink-soft hover:text-ink'
                                    )
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="ml-auto flex items-center gap-0.5 md:ml-0">
                        <LanguageSwitcher />
                        <ThemeToggle />
                        <IconButton
                            className="md:hidden"
                            size="sm"
                            label={menuOpen ? t.shell.menu.close : t.shell.menu.open}
                            aria-expanded={menuOpen}
                            aria-controls="menu-mobile"
                            icon={menuOpen ? <X size={17} /> : <Menu size={17} />}
                            onClick={() => setMenuOpen((open) => !open)}
                        />
                    </div>
                </div>

                <nav
                    id="menu-mobile"
                    aria-label={t.shell.menu.navigation}
                    inert={!menuOpen}
                    className={cn(
                        'border-line bg-surface shadow-pop absolute inset-x-0 top-14 border-b py-2 md:hidden',
                        'transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                        menuOpen
                            ? 'translate-y-0 opacity-100'
                            : 'pointer-events-none -translate-y-3 opacity-0'
                    )}
                >
                    <ul className="mx-auto flex w-full max-w-[1600px] flex-col gap-0.5 px-1 sm:px-3">
                        {navigation.map((item) => (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    end={item.end}
                                    onClick={() => setMenuOpen(false)}
                                    className={({ isActive }) =>
                                        cn(
                                            'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                                            isActive
                                                ? 'bg-brand/10 text-brand'
                                                : 'text-ink-soft hover:bg-surface-sunken hover:text-ink'
                                        )
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>

            <button
                aria-hidden
                tabIndex={-1}
                inert={!menuOpen}
                onClick={() => setMenuOpen(false)}
                className={cn(
                    'bg-ink/20 fixed inset-0 top-14 z-20 cursor-default transition-opacity duration-300 ease-out motion-reduce:transition-none md:hidden',
                    menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                )}
            />

            <main className="flex flex-1 flex-col">
                {children ?? <Outlet />}
            </main>

            {isStudio ? null : <Footer />}
        </div>
    );
}
