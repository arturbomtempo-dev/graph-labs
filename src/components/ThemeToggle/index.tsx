import { Moon, Sun } from 'lucide-react';
import { IconButton } from '@/components/IconButton';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <IconButton
            label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
            icon={theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        />
    );
}
