import { useI18n } from '@/hooks/useI18n';
import { localeSettings, locales } from '@/i18n/config';
import { cn } from '@/lib/utils/cn';
import { Check, Languages } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

export function LanguageSwitcher() {
    const { locale, t, changeLocale } = useI18n();
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const menuId = useId();

    useEffect(() => {
        if (!open) return;
        const handlePointerDown = (event: PointerEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false);
        };
        window.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [open]);

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                aria-label={t.shell.language.change}
                title={t.shell.language.change}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={menuId}
                onClick={() => setOpen((current) => !current)}
                className={cn(
                    'text-ink-soft hover:bg-surface-sunken hover:text-ink flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-xs font-medium transition-colors duration-150',
                    open && 'bg-surface-sunken text-ink'
                )}
            >
                <Languages size={15} />
                <span className="font-mono text-[11px]">{localeSettings[locale].shortLabel}</span>
            </button>

            <div
                id={menuId}
                role="menu"
                aria-label={t.shell.language.label}
                inert={!open}
                className={cn(
                    'border-line bg-surface shadow-pop absolute top-10 right-0 z-40 w-52 rounded-xl border p-1',
                    'origin-top-right transition-[opacity,scale] duration-150 ease-out motion-reduce:transition-none',
                    open ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
                )}
            >
                <p className="text-ink-faint px-2.5 pt-1.5 pb-1 text-[10px] font-semibold tracking-wider uppercase">
                    {t.shell.language.label}
                </p>
                {locales.map((option) => {
                    const isActive = option === locale;
                    return (
                        <button
                            key={option}
                            type="button"
                            role="menuitemradio"
                            aria-checked={isActive}
                            lang={localeSettings[option].htmlLang}
                            onClick={() => {
                                setOpen(false);
                                changeLocale(option);
                            }}
                            className={cn(
                                'flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors',
                                isActive
                                    ? 'bg-brand/10 text-brand font-medium'
                                    : 'text-ink-soft hover:bg-surface-sunken hover:text-ink'
                            )}
                        >
                            {localeSettings[option].label}
                            {isActive ? <Check size={14} /> : null}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
