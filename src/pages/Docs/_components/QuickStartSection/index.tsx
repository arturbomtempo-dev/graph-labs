import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/Button';
import { RichText } from '@/components/RichText';
import { useI18n } from '@/hooks/useI18n';
import { Callout } from '../Callout';
import { DocSection, DocSubsection } from '../DocSection';

export function QuickStartSection() {
    const { t, path } = useI18n();
    const text = t.docs.quickStart;

    return (
        <DocSection section="quickStart" description={text.description}>
            <ol className="grid gap-3 sm:grid-cols-2">
                {text.steps.map((step, index) => (
                    <li
                        key={step.title}
                        className="border-line bg-surface rounded-card relative flex flex-col gap-2 border p-4"
                    >
                        <span className="bg-brand text-brand-ink flex size-6 items-center justify-center rounded-full font-mono text-[11px] font-semibold">
                            {index + 1}
                        </span>
                        <p className="text-ink text-[13px] font-semibold">{step.title}</p>
                        <p className="text-ink-soft text-xs leading-relaxed">{step.description}</p>
                    </li>
                ))}
            </ol>

            <DocSubsection title={text.exampleTitle}>
                <p>{text.exampleIntro}</p>
                <ol className="flex flex-col gap-2">
                    {text.exampleSteps.map((item, index) => (
                        <li key={item} className="flex gap-3">
                            <span className="text-brand w-4 shrink-0 font-mono text-xs leading-5 font-semibold">
                                {index + 1}.
                            </span>
                            <span>
                                <RichText text={item} />
                            </span>
                        </li>
                    ))}
                </ol>
                <div>
                    <Link to={path('studio')} className="inline-block">
                        <Button size="sm" variant="primary" trailingIcon={<ArrowRight size={14} />}>
                            {text.tryIt}
                        </Button>
                    </Link>
                </div>
            </DocSubsection>

            <Callout tone="tip">{text.tip}</Callout>
        </DocSection>
    );
}
