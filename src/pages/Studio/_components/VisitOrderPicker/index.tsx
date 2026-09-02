import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/Button';
import { sortedNodes } from '@/lib/graph/helpers';
import type { Graph, NodeId } from '@/lib/graph/types';
import { cn } from '@/lib/utils/cn';

interface VisitOrderPickerProps {
    graph: Graph;
    order: NodeId[];
    onChange: (order: NodeId[]) => void;
    rootLabel: string;
}

export function VisitOrderPicker({ graph, order, onChange, rootLabel }: VisitOrderPickerProps) {
    const all = sortedNodes(graph);
    const labelOf = (id: NodeId) => graph.nodes.find((node) => node.id === id)?.label ?? '?';
    const chosen = order.filter((id) => graph.nodes.some((node) => node.id === id));
    const remaining = all.filter((node) => !chosen.includes(node.id));

    if (all.length === 0) return null;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
                <label className="text-ink-soft text-xs font-medium">Sequência de visita</label>
                {chosen.length > 0 ? (
                    <Button size="sm" icon={<RotateCcw size={12} />} onClick={() => onChange([])}>
                        Padrão
                    </Button>
                ) : null}
            </div>

            <div className="border-line bg-surface-sunken flex min-h-[2.5rem] flex-wrap items-center gap-1 rounded-lg border p-1.5">
                {chosen.length === 0 ? (
                    <span className="text-ink-faint px-1 text-[11px]">
                        Ordem alfabética (padrão)
                    </span>
                ) : (
                    chosen.map((id, index) => (
                        <button
                            key={id}
                            onClick={() => onChange(chosen.filter((item) => item !== id))}
                            title="Remover da sequência"
                            className={cn(
                                'flex items-center gap-1 rounded-md px-1.5 py-1 font-mono text-[11px] font-semibold transition-colors',
                                index === 0
                                    ? 'bg-brand text-brand-ink'
                                    : 'bg-surface text-ink border-line border'
                            )}
                        >
                            <span className="opacity-60">{index + 1}.</span>
                            {labelOf(id)}
                        </button>
                    ))
                )}
            </div>

            {remaining.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                    {remaining.map((node) => (
                        <button
                            key={node.id}
                            onClick={() => onChange([...chosen, node.id])}
                            title="Acrescentar à sequência"
                            className="border-line bg-surface text-ink-soft hover:border-brand hover:text-ink rounded-md border px-1.5 py-1 font-mono text-[11px] transition-colors"
                        >
                            {node.label}
                        </button>
                    ))}
                </div>
            ) : null}

            <p className="text-ink-faint text-[11px] leading-relaxed">
                Clique nos vértices na ordem desejada. O primeiro escolhido vira {rootLabel} e a
                sequência decide qual vizinho é examinado antes. Os vértices não escolhidos seguem
                em ordem alfabética.
            </p>
        </div>
    );
}
