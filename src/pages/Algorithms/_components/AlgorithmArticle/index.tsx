import { AlertTriangle, Lightbulb, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { useI18n } from '@/hooks/useI18n';
import type { AlgorithmDefinition } from '@/lib/graph/types';

interface AlgorithmArticleProps {
    algorithm: AlgorithmDefinition;
}

export function AlgorithmArticle({ algorithm }: AlgorithmArticleProps) {
    const { t } = useI18n();
    const text = t.algorithms[algorithm.id];
    const reference = text.reference;
    const labels = t.algorithmsPage;

    return (
        <Card id={algorithm.id} className="scroll-mt-20 overflow-hidden">
            <div className="border-line flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4">
                <div className="min-w-0">
                    <p className="text-ink-faint text-[10px] font-semibold tracking-wider uppercase">
                        {t.categories[algorithm.category]}
                    </p>
                    <h2 className="text-ink mt-1 text-lg font-semibold tracking-tight">
                        {text.name}
                    </h2>
                    <p className="text-ink-soft mt-1 text-sm leading-relaxed">{text.tagline}</p>
                </div>
                <Badge tone="brand" className="font-mono">
                    {text.complexity}
                </Badge>
            </div>

            <div className="grid gap-5 p-5 lg:grid-cols-2">
                <div className="flex flex-col gap-5">
                    <div>
                        <h3 className="text-ink flex items-center gap-1.5 text-xs font-semibold">
                            <Lightbulb size={14} className="text-state-frontier" />
                            {labels.idea}
                        </h3>
                        <p className="text-ink-soft mt-1.5 text-[13px] leading-relaxed">
                            {reference.idea}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-ink flex items-center gap-1.5 text-xs font-semibold">
                            <ShieldCheck size={14} className="text-state-done" />
                            {labels.invariant}
                        </h3>
                        <p className="text-ink-soft mt-1.5 text-[13px] leading-relaxed">
                            {reference.invariant}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-ink text-xs font-semibold">{labels.requirements}</h3>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {text.constraints.map((constraint) => (
                                <Badge key={constraint}>{constraint}</Badge>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-ink flex items-center gap-1.5 text-xs font-semibold">
                            <AlertTriangle size={14} className="text-state-reject" />
                            {labels.pitfalls}
                        </h3>
                        <ul className="mt-2 flex flex-col gap-1.5">
                            {reference.pitfalls.map((pitfall) => (
                                <li
                                    key={pitfall}
                                    className="text-ink-soft flex gap-2 text-[13px] leading-relaxed"
                                >
                                    <span className="bg-state-reject mt-1.5 size-1.5 shrink-0 rounded-full" />
                                    {pitfall}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="bg-surface-sunken border-line overflow-x-auto rounded-lg border p-4">
                    <pre className="text-ink-soft font-mono text-[11.5px] leading-[1.7]">
                        {reference.pseudocode.map((line, index) => (
                            <div key={`${algorithm.id}-${index}`}>{line || ' '}</div>
                        ))}
                    </pre>
                </div>
            </div>
        </Card>
    );
}
