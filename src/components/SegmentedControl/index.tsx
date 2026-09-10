import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface SegmentOption<T extends string> {
    value: T;
    label: string;
    icon?: ReactNode;
}

interface SegmentedControlProps<T extends string> {
    options: SegmentOption<T>[];
    value: T;
    onChange: (value: T) => void;
    className?: string;
    size?: 'sm' | 'md';
}

export function SegmentedControl<T extends string>({
    options,
    value,
    onChange,
    className,
    size = 'md',
}: SegmentedControlProps<T>) {
    return (
        <div
            role="tablist"
            className={cn(
                'bg-surface-sunken border-line flex gap-0.5 rounded-lg border p-0.5',
                className
            )}
        >
            {options.map((option) => (
                <button
                    key={option.value}
                    role="tab"
                    aria-selected={value === option.value}
                    onClick={() => onChange(option.value)}
                    className={cn(
                        'flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[6px] font-medium transition-all duration-150',
                        size === 'sm' ? 'h-7 px-2 text-[11px]' : 'h-9 px-3 text-xs',
                        value === option.value
                            ? 'bg-surface text-ink shadow-soft'
                            : 'text-ink-soft hover:text-ink'
                    )}
                >
                    {option.icon}
                    <span className="truncate">{option.label}</span>
                </button>
            ))}
        </div>
    );
}
