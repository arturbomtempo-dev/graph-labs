import { useI18n } from '@/hooks/useI18n';
import { cn } from '@/lib/utils/cn';
import { ChevronDown } from 'lucide-react';
import type { MouseEvent } from 'react';

export interface TocItem {
    id: string;
    title: string;
}

interface TableOfContentsProps {
    items: TocItem[];
    activeId: string | null;
    onNavigate: (id: string) => void;
}

function createNavigateHandler(onNavigate: (id: string) => void) {
    return (event: MouseEvent<HTMLAnchorElement>, id: string) => {
        event.preventDefault();
        onNavigate(id);
    };
}

export function TableOfContents({ items, activeId, onNavigate }: TableOfContentsProps) {
    const { t } = useI18n();
    const handleClick = createNavigateHandler(onNavigate);

    return (
        <nav aria-label={t.docs.toc.ariaLabel}>
            <p className="text-ink-faint px-3 text-[10px] font-semibold tracking-wider uppercase">
                {t.docs.toc.label}
            </p>
            <ol className="border-line mt-3 flex flex-col border-l">
                {items.map((item, index) => {
                    const isActive = item.id === activeId;
                    return (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                onClick={(event) => handleClick(event, item.id)}
                                aria-current={isActive ? 'location' : undefined}
                                className={cn(
                                    '-ml-px flex gap-2 border-l-2 py-1.5 pr-2 pl-3 text-xs transition-colors duration-150',
                                    isActive
                                        ? 'border-brand text-brand font-medium'
                                        : 'text-ink-soft hover:text-ink hover:border-line-strong border-transparent'
                                )}
                            >
                                <span className="text-ink-faint w-4 shrink-0 font-mono text-[10px] leading-[18px]">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                {item.title}
                            </a>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export function MobileTableOfContents({
    items,
    onNavigate,
}: Omit<TableOfContentsProps, 'activeId'>) {
    const { t } = useI18n();
    const handleClick = createNavigateHandler(onNavigate);

    return (
        <details className="border-line bg-surface shadow-soft group rounded-card border lg:hidden">
            <summary className="text-ink flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                {t.docs.toc.label}
                <ChevronDown
                    size={16}
                    className="text-ink-faint transition-transform duration-200 group-open:rotate-180"
                />
            </summary>
            <ol className="border-line grid gap-0.5 border-t p-2 sm:grid-cols-2">
                {items.map((item, index) => (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            onClick={(event) => handleClick(event, item.id)}
                            className="text-ink-soft hover:bg-surface-sunken hover:text-ink flex gap-2 rounded-lg px-2.5 py-2 text-[13px] transition-colors"
                        >
                            <span className="text-ink-faint font-mono text-[11px] leading-5">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            {item.title}
                        </a>
                    </li>
                ))}
            </ol>
        </details>
    );
}
