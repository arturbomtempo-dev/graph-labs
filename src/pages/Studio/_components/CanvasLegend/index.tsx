import { cn } from '@/lib/utils/cn';

const items = [
    { label: 'Não explorado', dot: 'bg-line-strong' },
    { label: 'Marcado', dot: 'bg-state-frontier' },
    { label: 'Em análise', dot: 'bg-state-active' },
    { label: 'Explorado / na solução', dot: 'bg-state-done' },
    { label: 'Descartado', dot: 'bg-state-reject' },
    { label: 'Caminho', dot: 'bg-state-path' },
];

export function CanvasLegend({ className }: { className?: string }) {
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
                    key={item.label}
                    className="text-ink-soft flex items-center gap-1.5 text-[11px]"
                >
                    <span className={cn('size-2 rounded-full', item.dot)} />
                    {item.label}
                </span>
            ))}
        </div>
    );
}
