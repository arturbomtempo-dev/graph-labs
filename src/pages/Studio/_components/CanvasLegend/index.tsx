import { useI18n } from '@/hooks/useI18n';
import type { ElementState } from '@/lib/graph/types';
import { cn } from '@/lib/utils/cn';

const items: { state: ElementState; dot: string }[] = [
    { state: 'idle', dot: 'bg-line-strong' },
    { state: 'frontier', dot: 'bg-state-frontier' },
    { state: 'active', dot: 'bg-state-active' },
    { state: 'done', dot: 'bg-state-done' },
    { state: 'reject', dot: 'bg-state-reject' },
    { state: 'path', dot: 'bg-state-path' },
];

export function CanvasLegend({ className }: { className?: string }) {
    const { t } = useI18n();

    return (
        <div
            className={cn(
                'bg-surface/90 border-line shadow-soft flex flex-wrap items-center gap-x-3 gap-y-1.5',
                'rounded-xl border px-3 py-2 backdrop-blur-md',
                className
            )}
        >
            {items.map((item) => (
                <span
                    key={item.state}
                    className="text-ink-soft flex items-center gap-1.5 text-[11px]"
                >
                    <span className={cn('size-2 rounded-full', item.dot)} />
                    {t.studio.legend[item.state]}
                </span>
            ))}
        </div>
    );
}
