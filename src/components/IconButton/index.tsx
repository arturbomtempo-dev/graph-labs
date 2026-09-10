import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type Variant = 'solid' | 'soft' | 'ghost' | 'danger';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    icon: ReactNode;
    variant?: Variant;
    active?: boolean;
    size?: 'sm' | 'md';
}

const variantClasses: Record<Variant, string> = {
    solid: 'bg-brand text-brand-ink hover:brightness-110',
    soft: 'bg-surface-raised border border-line text-ink-soft hover:text-ink hover:border-line-strong',
    ghost: 'text-ink-soft hover:bg-surface-sunken hover:text-ink',
    danger: 'text-ink-soft hover:bg-state-reject/10 hover:text-state-reject',
};

export function IconButton({
    label,
    icon,
    variant = 'ghost',
    active,
    size = 'md',
    className,
    ...props
}: IconButtonProps) {
    return (
        <button
            aria-label={label}
            title={label}
            aria-pressed={active}
            className={cn(
                'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg transition-all duration-150',
                'disabled:pointer-events-none disabled:opacity-40',
                size === 'sm' ? 'size-8' : 'size-10',
                variantClasses[variant],
                active && 'bg-brand text-brand-ink border-transparent hover:brightness-110',
                className
            )}
            {...props}
        >
            {icon}
        </button>
    );
}
