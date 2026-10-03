import { ArrowRight, Minus, Plus, Spline, Trash2, Waypoints } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card, CardHeader } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { IconButton } from '@/components/IconButton';
import { Select } from '@/components/Select';
import { TextField } from '@/components/TextField';
import { useI18n } from '@/hooks/useI18n';
import { sortedNodes } from '@/lib/graph/helpers';
import { presets } from '@/lib/graph/presets';
import type { Graph, GraphEdge, NodeId } from '@/lib/graph/types';
import { cn } from '@/lib/utils/cn';

interface BuilderPanelProps {
    graph: Graph;
    stats: {
        nodeCount: number;
        edgeCount: number;
        directedCount: number;
        undirectedCount: number;
        isMixed: boolean;
    };
    selectedNodeId: NodeId | null;
    selectedEdgeId: string | null;
    onSelectNode: (id: NodeId | null) => void;
    onSelectEdge: (id: string | null) => void;
    onAddNode: () => void;
    onRenameNode: (id: NodeId, label: string) => void;
    onRemoveNode: (id: NodeId) => void;
    onAddEdge: (
        source: NodeId,
        target: NodeId,
        weight: number | undefined,
        directed: boolean
    ) => boolean;
    onUpdateEdge: (id: string, patch: Partial<Omit<GraphEdge, 'id'>>) => void;
    onRemoveEdge: (id: string) => void;
    onLoadPreset: (id: string) => void;
    onSetAllDirected: (directed: boolean) => void;
}

export function BuilderPanel({
    graph,
    stats,
    selectedNodeId,
    selectedEdgeId,
    onSelectNode,
    onSelectEdge,
    onAddNode,
    onRenameNode,
    onRemoveNode,
    onAddEdge,
    onUpdateEdge,
    onRemoveEdge,
    onLoadPreset,
    onSetAllDirected,
}: BuilderPanelProps) {
    const { t } = useI18n();
    const text = t.studio.builder;
    const nodes = sortedNodes(graph);
    const [source, setSource] = useState('');
    const [target, setTarget] = useState('');
    const [weight, setWeight] = useState('');
    const [directed, setDirected] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);

    const nodeOptions = nodes.map((node) => ({ value: node.id, label: node.label }));
    const labelOf = (id: NodeId) => graph.nodes.find((node) => node.id === id)?.label ?? '?';

    const handleAddEdge = () => {
        if (!source || !target) {
            setFeedback(text.errors.chooseBoth);
            return;
        }
        if (source === target) {
            setFeedback(text.errors.noLoops);
            return;
        }
        const trimmed = weight.trim();
        const parsed = trimmed === '' ? undefined : Number(trimmed.replace(',', '.'));
        if (parsed !== undefined && !Number.isFinite(parsed)) {
            setFeedback(text.errors.invalidWeight);
            return;
        }
        const created = onAddEdge(source, target, parsed, directed);
        setFeedback(created ? null : text.errors.duplicate);
    };

    return (
        <div className="flex flex-col gap-3">
            <Card>
                <CardHeader title={text.presetsTitle} description={text.presetsDescription} />
                <div className="flex flex-col gap-1.5 p-3">
                    {presets.map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => onLoadPreset(preset.id)}
                            className="border-line hover:border-brand hover:bg-brand/5 group cursor-pointer rounded-lg border px-3 py-2.5 text-left transition-all"
                        >
                            <p className="text-ink group-hover:text-brand text-xs font-semibold transition-colors">
                                {t.presets[preset.id].name}
                            </p>
                            <p className="text-ink-soft mt-0.5 text-[11px] leading-relaxed">
                                {t.presets[preset.id].description}
                            </p>
                        </button>
                    ))}
                </div>
            </Card>

            <Card>
                <CardHeader
                    title={text.verticesTitle}
                    description={text.verticesCount(stats.nodeCount)}
                    action={
                        <Button
                            size="sm"
                            variant="secondary"
                            icon={<Plus size={14} />}
                            onClick={onAddNode}
                        >
                            {text.newVertex}
                        </Button>
                    }
                />
                {nodes.length === 0 ? (
                    <EmptyState
                        icon={<Waypoints size={18} />}
                        title={text.noVerticesTitle}
                        description={text.noVerticesDescription}
                    />
                ) : (
                    <ul className="flex flex-col p-2">
                        {nodes.map((node) => (
                            <li
                                key={node.id}
                                className={cn(
                                    'flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors',
                                    selectedNodeId === node.id
                                        ? 'bg-brand/10'
                                        : 'hover:bg-surface-sunken'
                                )}
                            >
                                <button
                                    onClick={() => onSelectNode(node.id)}
                                    className="border-line bg-surface-sunken text-ink flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border text-[11px] font-semibold"
                                >
                                    {node.label.slice(0, 2)}
                                </button>
                                <input
                                    value={node.label}
                                    onChange={(event) =>
                                        onRenameNode(node.id, event.target.value.slice(0, 6))
                                    }
                                    onFocus={() => onSelectNode(node.id)}
                                    className="text-ink min-w-0 flex-1 bg-transparent text-sm outline-none"
                                />
                                <IconButton
                                    label={text.removeVertex(node.label)}
                                    size="sm"
                                    variant="danger"
                                    icon={<Trash2 size={14} />}
                                    onClick={() => onRemoveNode(node.id)}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </Card>

            <Card>
                <CardHeader
                    title={text.edgesTitle}
                    description={text.edgesSummary(
                        stats.edgeCount,
                        stats.directedCount,
                        stats.undirectedCount
                    )}
                />

                <div className="border-line flex flex-col gap-2.5 border-b p-3">
                    <div className="flex items-end gap-2">
                        <Select
                            label={text.from}
                            options={nodeOptions}
                            placeholder={text.select}
                            value={source}
                            onChange={(event) => {
                                setSource(event.target.value);
                                setFeedback(null);
                            }}
                        />
                        <ArrowRight size={15} className="text-ink-faint mb-3 shrink-0" />
                        <Select
                            label={text.to}
                            options={nodeOptions}
                            placeholder={text.select}
                            value={target}
                            onChange={(event) => {
                                setTarget(event.target.value);
                                setFeedback(null);
                            }}
                        />
                    </div>

                    <div className="flex items-end gap-2">
                        <TextField
                            label={text.weight}
                            className="w-24 shrink-0"
                            placeholder={text.optional}
                            inputMode="decimal"
                            value={weight}
                            onChange={(event) => setWeight(event.target.value)}
                        />
                        <div className="flex flex-1 flex-col gap-1.5">
                            <label className="text-ink-soft text-xs font-medium">{text.type}</label>
                            <div className="bg-surface-sunken border-line flex h-10 gap-0.5 rounded-lg border p-0.5">
                                <button
                                    onClick={() => setDirected(false)}
                                    className={cn(
                                        'flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md text-[11px] font-medium transition-all',
                                        !directed
                                            ? 'bg-surface text-ink shadow-soft'
                                            : 'text-ink-soft hover:text-ink'
                                    )}
                                >
                                    <Minus size={13} /> {text.undirected}
                                </button>
                                <button
                                    onClick={() => setDirected(true)}
                                    className={cn(
                                        'flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md text-[11px] font-medium transition-all',
                                        directed
                                            ? 'bg-surface text-ink shadow-soft'
                                            : 'text-ink-soft hover:text-ink'
                                    )}
                                >
                                    <ArrowRight size={13} /> {text.directed}
                                </button>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        icon={<Plus size={14} />}
                        onClick={handleAddEdge}
                    >
                        {text.addEdge}
                    </Button>

                    {feedback ? <p className="text-state-reject text-[11px]">{feedback}</p> : null}

                    {stats.isMixed ? (
                        <div className="border-state-frontier/25 bg-state-frontier/10 flex flex-col gap-2 rounded-lg border p-2.5">
                            <p className="text-ink-soft text-[11px] leading-relaxed">
                                {text.mixedWarning}
                            </p>
                            <div className="flex gap-1.5">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => onSetAllDirected(true)}
                                >
                                    {text.allDirected}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => onSetAllDirected(false)}
                                >
                                    {text.allUndirected}
                                </Button>
                            </div>
                        </div>
                    ) : null}
                </div>

                {graph.edges.length === 0 ? (
                    <EmptyState
                        icon={<Spline size={18} />}
                        title={text.noEdgesTitle}
                        description={text.noEdgesDescription}
                    />
                ) : (
                    <ul className="flex flex-col p-2">
                        {graph.edges.map((edge) => (
                            <li
                                key={edge.id}
                                className={cn(
                                    'flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors',
                                    selectedEdgeId === edge.id
                                        ? 'bg-brand/10'
                                        : 'hover:bg-surface-sunken'
                                )}
                            >
                                <button
                                    onClick={() => onSelectEdge(edge.id)}
                                    className="text-ink flex min-w-0 flex-1 cursor-pointer items-center gap-1.5 text-left text-xs font-medium"
                                >
                                    <span className="truncate">{labelOf(edge.source)}</span>
                                    <span className="text-ink-faint shrink-0">
                                        {edge.directed ? '→' : '-'}
                                    </span>
                                    <span className="truncate">{labelOf(edge.target)}</span>
                                </button>
                                <input
                                    value={edge.weight === undefined ? '' : String(edge.weight)}
                                    inputMode="decimal"
                                    placeholder={text.noWeight}
                                    title={text.weightTitle}
                                    onChange={(event) => {
                                        const raw = event.target.value.trim();
                                        if (raw === '') {
                                            onUpdateEdge(edge.id, { weight: undefined });
                                            return;
                                        }
                                        const parsed = Number(raw.replace(',', '.'));
                                        if (Number.isFinite(parsed)) {
                                            onUpdateEdge(edge.id, { weight: parsed });
                                        }
                                    }}
                                    className="border-line bg-surface-sunken text-ink-soft focus:border-brand placeholder:text-ink-faint h-7 w-16 shrink-0 rounded-md border text-center font-mono text-[11px] outline-none"
                                />
                                <button
                                    onClick={() =>
                                        onUpdateEdge(edge.id, { directed: !edge.directed })
                                    }
                                    title={text.toggleDirection}
                                    className="shrink-0 cursor-pointer"
                                >
                                    <Badge tone={edge.directed ? 'brand' : 'neutral'}>
                                        {edge.directed ? text.directedBadge : text.undirectedBadge}
                                    </Badge>
                                </button>
                                <IconButton
                                    label={text.removeEdge(
                                        labelOf(edge.source),
                                        labelOf(edge.target)
                                    )}
                                    size="sm"
                                    variant="danger"
                                    icon={<Trash2 size={14} />}
                                    onClick={() => onRemoveEdge(edge.id)}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
        </div>
    );
}
