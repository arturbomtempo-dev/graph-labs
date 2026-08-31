import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
    return (
        <div
            className={cn('bg-surface border-line rounded-card border shadow-soft', className)}
            {...props}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
    icon?: ReactNode;
}

export function CardHeader({ title, description, action, icon }: CardHeaderProps) {
    return (
        <div className="border-line flex items-start justify-between gap-3 border-b px-4 py-3">
            <div className="flex items-start gap-2.5">
                {icon ? <span className="text-ink-faint mt-0.5">{icon}</span> : null}
                <div>
                    <h3 className="text-ink text-sm font-semibold tracking-tight">{title}</h3>
                    {description ? (
                        <p className="text-ink-soft mt-0.5 text-xs leading-relaxed">
                            {description}
                        </p>
                    ) : null}
                </div>
            </div>
            {action}
        </div>
    );
}
