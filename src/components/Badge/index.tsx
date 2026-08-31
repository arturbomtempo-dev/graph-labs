import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'purple';

interface BadgeProps {
    children: ReactNode;
    tone?: Tone;
    className?: string;
}

const toneClasses: Record<Tone, string> = {
    neutral: 'bg-surface-sunken text-ink-soft border-line',
    brand: 'bg-brand/10 text-brand border-brand/25',
    success: 'bg-state-done/10 text-state-done border-state-done/25',
    warning: 'bg-state-frontier/10 text-state-frontier border-state-frontier/25',
    danger: 'bg-state-reject/10 text-state-reject border-state-reject/25',
    purple: 'bg-state-path/10 text-state-path border-state-path/25',
};

export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap',
                toneClasses[tone],
                className
            )}
        >
            {children}
        </span>
    );
}
