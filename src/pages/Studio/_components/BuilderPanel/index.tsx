import { ArrowRight, Minus, Plus, Spline, Trash2, Waypoints } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card, CardHeader } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { IconButton } from '@/components/IconButton';
import { Select } from '@/components/Select';
import { TextField } from '@/components/TextField';
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
            setFeedback('Escolha os dois vértices da aresta.');
            return;
        }
        if (source === target) {
            setFeedback('Laços não são suportados: escolha vértices diferentes.');
            return;
        }
        const trimmed = weight.trim();
        const parsed = trimmed === '' ? undefined : Number(trimmed.replace(',', '.'));
        if (parsed !== undefined && !Number.isFinite(parsed)) {
            setFeedback('Informe um peso numérico válido ou deixe o campo vazio.');
            return;
        }
        const created = onAddEdge(source, target, parsed, directed);
        setFeedback(created ? null : 'Já existe uma aresta entre esses vértices.');
    };

    return (
        <div className="flex flex-col gap-3">
            <Card>
                <CardHeader
                    title="Modelos prontos"
                    description="Carregue um grafo de exemplo para testar rapidamente."
                />
                <div className="flex flex-col gap-1.5 p-3">
                    {presets.map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => onLoadPreset(preset.id)}
                            className="border-line hover:border-brand hover:bg-brand/5 group rounded-lg border px-3 py-2.5 text-left transition-all"
                        >
                            <p className="text-ink group-hover:text-brand text-xs font-semibold transition-colors">
                                {preset.name}
                            </p>
                            <p className="text-ink-soft mt-0.5 text-[11px] leading-relaxed">
                                {preset.description}
                            </p>
                        </button>
                    ))}
                </div>
            </Card>

            <Card>
                <CardHeader
                    title="Vértices"
                    description={`${stats.nodeCount} vértice(s) no grafo.`}
                    action={
                        <Button
                            size="sm"
                            variant="secondary"
                            icon={<Plus size={14} />}
                            onClick={onAddNode}
                        >
                            Novo
                        </Button>
                    }
                />
                {nodes.length === 0 ? (
                    <EmptyState
                        icon={<Waypoints size={18} />}
                        title="Nenhum vértice ainda"
                        description="Use a ferramenta de adicionar vértice no canvas ou o botão Novo."
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
                                    className="border-line bg-surface-sunken text-ink flex size-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold"
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
                                    label={`Remover vértice ${node.label}`}
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
                    title="Arestas"
                    description={`${stats.edgeCount} aresta(s) · ${stats.directedCount} direcionada(s) · ${stats.undirectedCount} não direcionada(s).`}
                />

                <div className="border-line flex flex-col gap-2.5 border-b p-3">
                    <div className="flex items-end gap-2">
                        <Select
                            label="De"
                            options={nodeOptions}
                            placeholder="Selecione"
                            value={source}
                            onChange={(event) => {
                                setSource(event.target.value);
                                setFeedback(null);
                            }}
                        />
                        <ArrowRight size={15} className="text-ink-faint mb-3 shrink-0" />
                        <Select
                            label="Para"
                            options={nodeOptions}
                            placeholder="Selecione"
                            value={target}
                            onChange={(event) => {
                                setTarget(event.target.value);
                                setFeedback(null);
                            }}
                        />
                    </div>

                    <div className="flex items-end gap-2">
                        <TextField
                            label="Peso"
                            className="w-24 shrink-0"
                            placeholder="opcional"
                            inputMode="decimal"
                            value={weight}
                            onChange={(event) => setWeight(event.target.value)}
                        />
                        <div className="flex flex-1 flex-col gap-1.5">
                            <label className="text-ink-soft text-xs font-medium">Tipo</label>
                            <div className="bg-surface-sunken border-line flex h-10 gap-0.5 rounded-lg border p-0.5">
                                <button
                                    onClick={() => setDirected(false)}
                                    className={cn(
                                        'flex flex-1 items-center justify-center gap-1 rounded-[6px] text-[11px] font-medium transition-all',
                                        !directed
                                            ? 'bg-surface text-ink shadow-soft'
                                            : 'text-ink-soft hover:text-ink'
                                    )}
                                >
                                    <Minus size={13} /> Simples
                                </button>
                                <button
                                    onClick={() => setDirected(true)}
                                    className={cn(
                                        'flex flex-1 items-center justify-center gap-1 rounded-[6px] text-[11px] font-medium transition-all',
                                        directed
                                            ? 'bg-surface text-ink shadow-soft'
                                            : 'text-ink-soft hover:text-ink'
                                    )}
                                >
                                    <ArrowRight size={13} /> Dirigida
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
                        Adicionar aresta
                    </Button>

                    {feedback ? <p className="text-state-reject text-[11px]">{feedback}</p> : null}

                    {stats.isMixed ? (
                        <div className="border-state-frontier/25 bg-state-frontier/10 flex flex-col gap-2 rounded-lg border p-2.5">
                            <p className="text-ink-soft text-[11px] leading-relaxed">
                                O grafo mistura arestas direcionadas e não direcionadas. Alguns
                                algoritmos exigem um único tipo.
                            </p>
                            <div className="flex gap-1.5">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => onSetAllDirected(true)}
                                >
                                    Todas direcionadas
                                </Button>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => onSetAllDirected(false)}
                                >
                                    Todas simples
                                </Button>
                            </div>
                        </div>
                    ) : null}
                </div>

                {graph.edges.length === 0 ? (
                    <EmptyState
                        icon={<Spline size={18} />}
                        title="Nenhuma aresta ainda"
                        description="Conecte dois vértices pelo canvas ou pelo formulário acima."
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
                                    className="text-ink flex min-w-0 flex-1 items-center gap-1.5 text-left text-xs font-medium"
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
                                    placeholder="sem peso"
                                    title="Peso da aresta (deixe vazio para não usar peso)"
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
                                    title="Alternar direção"
                                    className="shrink-0"
                                >
                                    <Badge tone={edge.directed ? 'brand' : 'neutral'}>
                                        {edge.directed ? 'direcionada' : 'simples'}
                                    </Badge>
                                </button>
                                <IconButton
                                    label={`Remover aresta ${labelOf(edge.source)} ${labelOf(edge.target)}`}
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
