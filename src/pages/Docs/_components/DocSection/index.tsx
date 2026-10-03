import type { ReactNode } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { cn } from '@/lib/utils/cn';
import { sectionId, sectionIndex, type DocSectionKey } from '../../sections';

interface DocSectionProps {
    section: DocSectionKey;
    description: string;
    children: ReactNode;
    className?: string;
}

export function DocSection({ section, description, children, className }: DocSectionProps) {
    const { t } = useI18n();
    const id = sectionId(section);
    const index = sectionIndex(section);
    const title = t.docs.sections[section];

    return (
        <section
            id={id}
            data-doc-section
            className={cn('scroll-mt-20', index > 1 && 'border-line border-t pt-12', className)}
        >
            <p className="text-brand font-mono text-[11px] font-semibold tracking-wider">
                {String(index).padStart(2, '0')}
            </p>
            <h2 className="text-ink mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl">
                {title}
            </h2>
            <p className="text-ink-soft mt-2 max-w-2xl text-sm leading-relaxed">{description}</p>
            <div className="mt-6 flex flex-col gap-6">{children}</div>
        </section>
    );
}

interface DocSubsectionProps {
    id?: string;
    title: string;
    children: ReactNode;
}

export function DocSubsection({ id, title, children }: DocSubsectionProps) {
    return (
        <div id={id} className="scroll-mt-20">
            <h3 className="text-ink text-sm font-semibold tracking-tight">{title}</h3>
            <div className="text-ink-soft mt-2 flex flex-col gap-3 text-[13px] leading-relaxed">
                {children}
            </div>
        </div>
    );
}
