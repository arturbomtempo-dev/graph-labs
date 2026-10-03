import { useCallback, useSyncExternalStore } from 'react';
import { DARK_THEME_CLASS, THEME_STORAGE_KEY, type Theme } from '@/lib/theme';

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

function readTheme(): Theme {
    return document.documentElement.classList.contains(DARK_THEME_CLASS) ? 'dark' : 'light';
}

function readServerTheme(): Theme {
    return 'light';
}

function persistTheme(theme: Theme): boolean {
    try {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        return true;
    } catch {
        return false;
    }
}

export function useTheme() {
    const theme = useSyncExternalStore(subscribe, readTheme, readServerTheme);

    const toggleTheme = useCallback(() => {
        const next: Theme = readTheme() === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.toggle(DARK_THEME_CLASS, next === 'dark');
        persistTheme(next);
        listeners.forEach((listener) => listener());
    }, []);

    return { theme, toggleTheme };
}
