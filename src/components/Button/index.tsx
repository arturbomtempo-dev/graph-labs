import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    icon?: ReactNode;
    trailingIcon?: ReactNode;
    fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
    primary:
        'bg-brand text-brand-ink hover:brightness-110 active:brightness-95 shadow-soft disabled:hover:brightness-100',
    secondary:
        'bg-surface-raised text-ink border border-line hover:border-line-strong hover:bg-surface-sunken',
    ghost: 'text-ink-soft hover:bg-surface-sunken hover:text-ink',
    danger: 'bg-state-reject/10 text-state-reject border border-state-reject/25 hover:bg-state-reject/20',
};

const sizeClasses: Record<Size, string> = {
    sm: 'h-8 gap-1.5 px-3 text-xs',
    md: 'h-10 gap-2 px-4 text-sm',
    lg: 'h-12 gap-2.5 px-6 text-sm',
};

export function Button({
    variant = 'secondary',
    size = 'md',
    icon,
    trailingIcon,
    fullWidth,
    className,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg font-medium transition-all duration-150',
                'disabled:pointer-events-none disabled:opacity-40',
                variantClasses[variant],
                sizeClasses[size],
                fullWidth && 'w-full',
                className
            )}
            {...props}
        >
            {icon}
            {children}
            {trailingIcon}
        </button>
    );
}
