import { AlertTriangle, Check, Play } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card, CardHeader } from '@/components/Card';
import { Select } from '@/components/Select';
import { algorithms } from '@/lib/algorithms';
import { sortedNodes } from '@/lib/graph/helpers';
import type { AlgorithmCategory, AlgorithmDefinition, Graph, NodeId } from '@/lib/graph/types';
import { cn } from '@/lib/utils/cn';
import { VisitOrderPicker } from '../VisitOrderPicker';

interface AlgorithmPanelProps {
    graph: Graph;
    selectedAlgorithm: AlgorithmDefinition;
    onSelectAlgorithm: (id: string) => void;
    startId: NodeId | null;
    endId: NodeId | null;
    onStartChange: (id: NodeId | null) => void;
    onEndChange: (id: NodeId | null) => void;
    issues: string[];
    order: NodeId[];
    onOrderChange: (order: NodeId[]) => void;
    onRun: () => void;
}

const categoryOrder: AlgorithmCategory[] = [
    'Busca em grafos',
    'Conectividade',
    'Grafos eulerianos',
    'Árvore geradora mínima',
    'Caminho mínimo',
    'Fluxo máximo',
    'Ordenação topológica',
    'Emparelhamento',
    'Coloração',
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
    order,
    onOrderChange,
    onRun,
}: AlgorithmPanelProps) {
    const nodeOptions = sortedNodes(graph).map((node) => ({ value: node.id, label: node.label }));
    const isFlow = selectedAlgorithm.category === 'Fluxo máximo';
    const isShortestPath = selectedAlgorithm.category === 'Caminho mínimo';
    const showStart =
        selectedAlgorithm.needsStart || isShortestPath || selectedAlgorithm.id === 'fleury';
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
                            label={isFlow ? 'Fonte s' : 'Raiz / origem'}
                            hint={
                                selectedAlgorithm.needsStart
                                    ? undefined
                                    : selectedAlgorithm.id === 'fleury'
                                      ? 'Opcional: com vértices de grau ímpar, o trajeto precisa partir de um deles.'
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
                            label={isFlow ? 'Sumidouro t' : 'Vértice de destino'}
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

                    <div className="border-line border-t pt-3">
                        <VisitOrderPicker
                            graph={graph}
                            order={order}
                            onChange={onOrderChange}
                            rootLabel={
                                isFlow
                                    ? 'o primeiro vizinho tentado na busca'
                                    : showStart
                                      ? 'a raiz quando nenhuma for escolhida acima'
                                      : 'a raiz da execução'
                            }
                        />
                    </div>

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
