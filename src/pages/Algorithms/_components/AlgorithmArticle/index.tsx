import { AlertTriangle, Lightbulb, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import type { AlgorithmDocumentation } from '@/lib/algorithms/documentation';
import type { AlgorithmDefinition } from '@/lib/graph/types';

interface AlgorithmArticleProps {
    algorithm: AlgorithmDefinition;
    documentation?: AlgorithmDocumentation;
}

export function AlgorithmArticle({ algorithm, documentation }: AlgorithmArticleProps) {
    return (
        <Card id={algorithm.id} className="scroll-mt-20 overflow-hidden">
            <div className="border-line flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4">
                <div className="min-w-0">
                    <p className="text-ink-faint text-[10px] font-semibold tracking-wider uppercase">
                        {algorithm.category}
                    </p>
                    <h2 className="text-ink mt-1 text-lg font-semibold tracking-tight">
                        {algorithm.name}
                    </h2>
                    <p className="text-ink-soft mt-1 text-sm leading-relaxed">
                        {algorithm.tagline}
                    </p>
                </div>
                <Badge tone="brand" className="font-mono">
                    {algorithm.complexity}
                </Badge>
            </div>

            <div className="grid gap-5 p-5 lg:grid-cols-2">
                <div className="flex flex-col gap-5">
                    {documentation ? (
                        <div>
                            <h3 className="text-ink flex items-center gap-1.5 text-xs font-semibold">
                                <Lightbulb size={14} className="text-state-frontier" />
                                Ideia central
                            </h3>
                            <p className="text-ink-soft mt-1.5 text-[13px] leading-relaxed">
                                {documentation.idea}
                            </p>
                        </div>
                    ) : null}

                    {documentation ? (
                        <div>
                            <h3 className="text-ink flex items-center gap-1.5 text-xs font-semibold">
                                <ShieldCheck size={14} className="text-state-done" />
                                Invariante
                            </h3>
                            <p className="text-ink-soft mt-1.5 text-[13px] leading-relaxed">
                                {documentation.invariant}
                            </p>
                        </div>
                    ) : null}

                    <div>
                        <h3 className="text-ink text-xs font-semibold">Requisitos do grafo</h3>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {algorithm.constraints.map((constraint) => (
                                <Badge key={constraint}>{constraint}</Badge>
                            ))}
                        </div>
                    </div>

                    {documentation ? (
                        <div>
                            <h3 className="text-ink flex items-center gap-1.5 text-xs font-semibold">
                                <AlertTriangle size={14} className="text-state-reject" />
                                Erros comuns
                            </h3>
                            <ul className="mt-2 flex flex-col gap-1.5">
                                {documentation.pitfalls.map((pitfall) => (
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
                    ) : null}
                </div>

                {documentation ? (
                    <div className="bg-surface-sunken border-line overflow-x-auto rounded-lg border p-4">
                        <pre className="text-ink-soft font-mono text-[11.5px] leading-[1.7]">
                            {documentation.pseudocode.map((line, index) => (
                                <div key={`${algorithm.id}-${index}`}>{line || ' '}</div>
                            ))}
                        </pre>
                    </div>
                ) : null}
            </div>
        </Card>
    );
}
