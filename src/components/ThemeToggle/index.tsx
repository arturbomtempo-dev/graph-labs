import { IconButton } from '@/components/IconButton';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const { t } = useI18n();

    return (
        <IconButton
            label={theme === 'dark' ? t.shell.theme.toLight : t.shell.theme.toDark}
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
            icon={theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        />
    );
}
