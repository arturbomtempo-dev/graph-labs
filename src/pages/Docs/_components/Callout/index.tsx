import { AlertTriangle, Info, Lightbulb } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type Tone = 'info' | 'tip' | 'warning';

const tones = {
    info: {
        icon: Info,
        label: 'Nota',
        classes: 'border-brand/25 bg-brand/5',
        accent: 'text-brand',
    },
    tip: {
        icon: Lightbulb,
        label: 'Dica',
        classes: 'border-state-done/25 bg-state-done/5',
        accent: 'text-state-done',
    },
    warning: {
        icon: AlertTriangle,
        label: 'Atenção',
        classes: 'border-state-frontier/30 bg-state-frontier/8',
        accent: 'text-state-frontier',
    },
};

interface CalloutProps {
    tone?: Tone;
    title?: string;
    children: ReactNode;
}

export function Callout({ tone = 'info', title, children }: CalloutProps) {
    const { icon: Icon, label, classes, accent } = tones[tone];

    return (
        <div className={cn('flex gap-3 rounded-lg border p-3.5', classes)}>
            <Icon size={16} className={cn('mt-0.5 shrink-0', accent)} />
            <div className="min-w-0">
                <p className={cn('text-xs font-semibold', accent)}>{title ?? label}</p>
                <div className="text-ink-soft mt-1 text-[13px] leading-relaxed">{children}</div>
            </div>
        </div>
    );
}
