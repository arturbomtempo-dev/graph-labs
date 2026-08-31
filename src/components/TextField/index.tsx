import { useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    hint?: string;
}

export function TextField({ label, hint, className, ...props }: TextFieldProps) {
    const id = useId();

    return (
        <div className={cn('flex w-full flex-col gap-1.5', className)}>
            {label ? (
                <label htmlFor={id} className="text-ink-soft text-xs font-medium">
                    {label}
                </label>
            ) : null}
            <input
                id={id}
                className={cn(
                    'bg-surface-raised border-line text-ink placeholder:text-ink-faint h-10 w-full rounded-lg border px-3 text-sm',
                    'hover:border-line-strong focus:border-brand transition-colors outline-none',
                    'disabled:cursor-not-allowed disabled:opacity-40'
                )}
                {...props}
            />
            {hint ? <p className="text-ink-faint text-[11px]">{hint}</p> : null}
        </div>
    );
}
