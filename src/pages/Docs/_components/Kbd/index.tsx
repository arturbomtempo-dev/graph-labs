import type { ReactNode } from 'react';

export function Kbd({ children }: { children: ReactNode }) {
    return (
        <kbd className="border-line bg-surface-sunken text-ink inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-b-2 px-1.5 font-mono text-[11px] font-medium">
            {children}
        </kbd>
    );
}
