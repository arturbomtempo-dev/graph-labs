import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card, CardHeader } from '@/components/Card';
import { Select } from '@/components/Select';
import { useI18n } from '@/hooks/useI18n';
import { algorithmCategories, algorithms } from '@/lib/algorithms';
import { sortedNodes } from '@/lib/graph/helpers';
import type { AlgorithmDefinition, AlgorithmId, Graph, NodeId } from '@/lib/graph/types';
import { cn } from '@/lib/utils/cn';
import { AlertTriangle, Check, Play } from 'lucide-react';
import { VisitOrderPicker } from '../VisitOrderPicker';

interface AlgorithmPanelProps {
    graph: Graph;
    selectedAlgorithm: AlgorithmDefinition;
    onSelectAlgorithm: (id: AlgorithmId) => void;
    startId: NodeId | null;
    endId: NodeId | null;
    onStartChange: (id: NodeId | null) => void;
    onEndChange: (id: NodeId | null) => void;
    issues: string[];
    order: NodeId[];
    onOrderChange: (order: NodeId[]) => void;
    onRun: () => void;
}

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
    const { t } = useI18n();
    const text = t.studio.run;
    const selectedText = t.algorithms[selectedAlgorithm.id];
    const nodeOptions = sortedNodes(graph).map((node) => ({ value: node.id, label: node.label }));
    const isFlow = selectedAlgorithm.category === 'max-flow';
    const isShortestPath = selectedAlgorithm.category === 'shortest-path';
    const showStart =
        selectedAlgorithm.needsStart || isShortestPath || selectedAlgorithm.id === 'fleury';
    const showEnd = selectedAlgorithm.needsEnd || isShortestPath;

    return (
        <div className="flex flex-col gap-3">
            <Card>
                <CardHeader title={text.algorithmTitle} description={text.algorithmDescription} />
                <div className="flex flex-col gap-4 p-3">
                    {algorithmCategories.map((category) => {
                        const group = algorithms.filter(
                            (algorithm) => algorithm.category === category
                        );
                        if (group.length === 0) return null;

                        return (
                            <div key={category} className="flex flex-col gap-1.5">
                                <p className="text-ink-faint px-1 text-[10px] font-semibold tracking-wider uppercase">
                                    {t.categories[category]}
                                </p>
                                {group.map((algorithm) => {
                                    const isSelected = algorithm.id === selectedAlgorithm.id;
                                    return (
                                        <button
                                            key={algorithm.id}
                                            onClick={() => onSelectAlgorithm(algorithm.id)}
                                            className={cn(
                                                'cursor-pointer rounded-lg border px-3 py-2.5 text-left transition-all',
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
                                                    {t.algorithms[algorithm.id].name}
                                                </p>
                                                <span className="text-ink-faint shrink-0 font-mono text-[10px]">
                                                    {t.algorithms[algorithm.id].complexity}
                                                </span>
                                            </div>
                                            <p className="text-ink-soft mt-0.5 text-[11px] leading-relaxed">
                                                {t.algorithms[algorithm.id].tagline}
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
                    title={text.parametersTitle}
                    description={`${selectedText.name} · ${selectedText.complexity}`}
                />
                <div className="flex flex-col gap-3 p-3">
                    <div className="flex flex-wrap gap-1.5">
                        {selectedText.constraints.map((constraint) => (
                            <Badge key={constraint}>{constraint}</Badge>
                        ))}
                    </div>

                    {showStart ? (
                        <Select
                            label={isFlow ? text.source : text.root}
                            hint={
                                selectedAlgorithm.needsStart
                                    ? undefined
                                    : selectedAlgorithm.id === 'fleury'
                                      ? text.fleuryHint
                                      : text.optionalStartHint
                            }
                            placeholder={selectedAlgorithm.needsStart ? text.select : text.none}
                            options={nodeOptions}
                            value={startId ?? ''}
                            onChange={(event) => onStartChange(event.target.value || null)}
                        />
                    ) : null}

                    {showEnd ? (
                        <Select
                            label={isFlow ? text.sink : text.target}
                            hint={selectedAlgorithm.needsEnd ? undefined : text.optionalTargetHint}
                            placeholder={selectedAlgorithm.needsEnd ? text.select : text.none}
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
                                    ? text.rootRoles.flow
                                    : showStart
                                      ? text.rootRoles.fallback
                                      : text.rootRoles.root
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
                            <Check size={13} />
                            {text.requirementsMet}
                        </p>
                    )}

                    <Button
                        variant="primary"
                        fullWidth
                        icon={<Play size={15} />}
                        disabled={issues.length > 0}
                        onClick={onRun}
                    >
                        {text.execute(selectedText.shortName)}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
