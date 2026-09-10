import { Footer } from '@/components/Footer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils/cn';
import { Waypoints } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const navigation = [
    { to: '/', label: 'Início', end: true },
    { to: '/estudio', label: 'Estúdio', end: false },
    { to: '/algoritmos', label: 'Algoritmos', end: false },
    { to: '/sobre', label: 'Sobre', end: false },
];

export function AppShell() {
    const { pathname } = useLocation();
    const isStudio = pathname.startsWith('/estudio');

    return (
        <div className="flex min-h-dvh flex-col">
            <header className="border-line bg-surface/85 sticky top-0 z-30 border-b backdrop-blur-md">
                <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center gap-2 px-4 sm:gap-3 sm:px-6">
                    <NavLink to="/" className="flex shrink-0 items-center gap-2">
                        <span className="bg-brand text-brand-ink flex size-7 items-center justify-center rounded-lg">
                            <Waypoints size={16} />
                        </span>
                        <span className="text-ink hidden text-sm font-semibold tracking-tight sm:block">
                            Graph Labs
                        </span>
                    </NavLink>

                    <nav className="bg-surface-sunken border-line no-scrollbar ml-auto flex min-w-0 items-center gap-0.5 overflow-x-auto rounded-lg border p-0.5">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    cn(
                                        'shrink-0 rounded-[6px] px-2 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-150 sm:px-3',
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

                    <ThemeToggle />
                </div>
            </header>

            <main className="flex flex-1 flex-col">
                <Outlet />
            </main>

            {isStudio ? null : <Footer />}
        </div>
    );
}
