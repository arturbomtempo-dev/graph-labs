import { ChevronDown } from 'lucide-react';
import { useId, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
    label?: string;
    options: SelectOption[];
    placeholder?: string;
    hint?: string;
}

export function Select({ label, options, placeholder, hint, className, ...props }: SelectProps) {
    const id = useId();

    return (
        <div className={cn('flex w-full flex-col gap-1.5', className)}>
            {label ? (
                <label htmlFor={id} className="text-ink-soft text-xs font-medium">
                    {label}
                </label>
            ) : null}
            <div className="relative">
                <select
                    id={id}
                    className={cn(
                        'bg-surface-raised border-line text-ink h-10 w-full appearance-none rounded-lg border pr-9 pl-3 text-sm',
                        'hover:border-line-strong focus:border-brand transition-colors outline-none',
                        'disabled:cursor-not-allowed disabled:opacity-40'
                    )}
                    {...props}
                >
                    {placeholder ? <option value="">{placeholder}</option> : null}
                    {options.map((option) => (
                        <option key={option.value} value={option.value} disabled={option.disabled}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={15}
                    className="text-ink-faint pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
                />
            </div>
            {hint ? <p className="text-ink-faint text-[11px]">{hint}</p> : null}
        </div>
    );
}
