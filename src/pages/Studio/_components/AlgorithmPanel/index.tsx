import { AlertTriangle, Check, Play } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card, CardHeader } from '@/components/Card';
import { Select } from '@/components/Select';
import { algorithms } from '@/lib/algorithms';
import { sortedNodes } from '@/lib/graph/helpers';
import type { AlgorithmCategory, AlgorithmDefinition, Graph, NodeId } from '@/lib/graph/types';
import { cn } from '@/lib/utils/cn';

interface AlgorithmPanelProps {
    graph: Graph;
    selectedAlgorithm: AlgorithmDefinition;
    onSelectAlgorithm: (id: string) => void;
    startId: NodeId | null;
    endId: NodeId | null;
    onStartChange: (id: NodeId | null) => void;
    onEndChange: (id: NodeId | null) => void;
    issues: string[];
    onRun: () => void;
}

const categoryOrder: AlgorithmCategory[] = [
    'Percursos',
    'Conectividade',
    'Árvore geradora mínima',
    'Caminhos mínimos',
    'Fluxo máximo',
];

export function AlgorithmPanel({
    graph,
    selectedAlgorithm,
    onSelectAlgorithm,
    startId,
    endId,
    onStartChange,
    onEndChange,
    issues,
    onRun,
}: AlgorithmPanelProps) {
    const nodeOptions = sortedNodes(graph).map((node) => ({ value: node.id, label: node.label }));
    const isFlow = selectedAlgorithm.id === 'ford-fulkerson';
    const isShortestPath = selectedAlgorithm.category === 'Caminhos mínimos';
    const showStart = selectedAlgorithm.needsStart || isShortestPath;
    const showEnd = selectedAlgorithm.needsEnd || isShortestPath;

    return (
        <div className="flex flex-col gap-3">
            <Card>
                <CardHeader
                    title="Algoritmo"
                    description="Escolha o procedimento que será executado passo a passo."
                />
                <div className="flex flex-col gap-4 p-3">
                    {categoryOrder.map((category) => {
                        const group = algorithms.filter(
                            (algorithm) => algorithm.category === category
                        );
                        if (group.length === 0) return null;

                        return (
                            <div key={category} className="flex flex-col gap-1.5">
                                <p className="text-ink-faint px-1 text-[10px] font-semibold tracking-wider uppercase">
                                    {category}
                                </p>
                                {group.map((algorithm) => {
                                    const isSelected = algorithm.id === selectedAlgorithm.id;
                                    return (
                                        <button
                                            key={algorithm.id}
                                            onClick={() => onSelectAlgorithm(algorithm.id)}
                                            className={cn(
                                                'rounded-lg border px-3 py-2.5 text-left transition-all',
                                                isSelected
                                                    ? 'border-brand bg-brand/8'
                                                    : 'border-line hover:border-line-strong hover:bg-surface-sunken'
                                            )}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <p
                                                    className={cn(
                                                        'text-xs font-semibold',
                                                        isSelected ? 'text-brand' : 'text-ink'
                                                    )}
                                                >
                                                    {algorithm.name}
                                                </p>
                                                <span className="text-ink-faint shrink-0 font-mono text-[10px]">
                                                    {algorithm.complexity}
                                                </span>
                                            </div>
                                            <p className="text-ink-soft mt-0.5 text-[11px] leading-relaxed">
                                                {algorithm.tagline}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </Card>

            <Card>
                <CardHeader
                    title="Parâmetros"
                    description={`${selectedAlgorithm.name} · ${selectedAlgorithm.complexity}`}
                />
                <div className="flex flex-col gap-3 p-3">
                    <div className="flex flex-wrap gap-1.5">
                        {selectedAlgorithm.constraints.map((constraint) => (
                            <Badge key={constraint}>{constraint}</Badge>
                        ))}
                    </div>

                    {showStart ? (
                        <Select
                            label={isFlow ? 'Fonte' : 'Vértice de origem'}
                            hint={
                                selectedAlgorithm.needsStart
                                    ? undefined
                                    : 'Opcional: define de onde parte o caminho destacado.'
                            }
                            placeholder={selectedAlgorithm.needsStart ? 'Selecione' : 'Nenhum'}
                            options={nodeOptions}
                            value={startId ?? ''}
                            onChange={(event) => onStartChange(event.target.value || null)}
                        />
                    ) : null}

                    {showEnd ? (
                        <Select
                            label={isFlow ? 'Sumidouro' : 'Vértice de destino'}
                            hint={
                                selectedAlgorithm.needsEnd
                                    ? undefined
                                    : 'Opcional: destaca o caminho mínimo até este vértice.'
                            }
                            placeholder={selectedAlgorithm.needsEnd ? 'Selecione' : 'Nenhum'}
                            options={nodeOptions}
                            value={endId ?? ''}
                            onChange={(event) => onEndChange(event.target.value || null)}
                        />
                    ) : null}

                    {issues.length > 0 ? (
                        <div className="border-state-reject/25 bg-state-reject/8 flex flex-col gap-1.5 rounded-lg border p-2.5">
                            {issues.map((issue) => (
                                <p
                                    key={issue}
                                    className="text-state-reject flex items-start gap-1.5 text-[11px] leading-relaxed"
                                >
                                    <AlertTriangle size={13} className="mt-px shrink-0" />
                                    {issue}
                                </p>
                            ))}
                        </div>
                    ) : (
                        <p className="text-state-done flex items-center gap-1.5 text-[11px]">
                            <Check size={13} />O grafo atende aos requisitos deste algoritmo.
                        </p>
                    )}

                    <Button
                        variant="primary"
                        fullWidth
                        icon={<Play size={15} />}
                        disabled={issues.length > 0}
                        onClick={onRun}
                    >
                        Executar {selectedAlgorithm.shortName}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
