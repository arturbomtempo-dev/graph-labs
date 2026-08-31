import type { ReactNode } from 'react';

interface EmptyStateProps {
    icon: ReactNode;
    title: string;
    description: string;
    action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
            <div className="bg-surface-sunken text-ink-faint flex size-11 items-center justify-center rounded-xl">
                {icon}
            </div>
            <div className="max-w-xs">
                <p className="text-ink text-sm font-medium">{title}</p>
                <p className="text-ink-soft mt-1 text-xs leading-relaxed">{description}</p>
            </div>
            {action}
        </div>
    );
}
