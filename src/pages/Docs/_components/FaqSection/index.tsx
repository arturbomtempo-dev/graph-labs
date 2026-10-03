import { ChevronDown } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { DocSection } from '../DocSection';

export function FaqSection() {
    const { t } = useI18n();
    const text = t.docs.faq;

    return (
        <DocSection section="faq" description={text.description}>
            <div className="border-line bg-surface rounded-card divide-line divide-y border">
                {text.items.map((item) => (
                    <details key={item.question} className="group">
                        <summary className="text-ink hover:text-brand flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-[13px] font-semibold transition-colors [&::-webkit-details-marker]:hidden">
                            {item.question}
                            <ChevronDown
                                size={16}
                                className="text-ink-faint shrink-0 transition-transform duration-200 group-open:rotate-180"
                            />
                        </summary>
                        <p className="text-ink-soft px-4 pb-4 text-[13px] leading-relaxed">
                            {item.answer}
                        </p>
                    </details>
                ))}
            </div>
        </DocSection>
    );
}
