import { SegmentedControl } from '@/components/SegmentedControl';
import { useAlgorithmRunner } from '@/hooks/useAlgorithmRunner';
import { useGraphEditor } from '@/hooks/useGraphEditor';
import { algorithms, findAlgorithm } from '@/lib/algorithms';
import { sortedNodes } from '@/lib/graph/helpers';
import type { NodeId } from '@/lib/graph/types';
import { Hammer, ListChecks, Play } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlgorithmPanel } from './_components/AlgorithmPanel';
import { BuilderPanel } from './_components/BuilderPanel';
import { CanvasLegend } from './_components/CanvasLegend';
import { GraphCanvas, type CanvasTool } from './_components/GraphCanvas';
import { GraphToolbar } from './_components/GraphToolbar';
import { StepPanel } from './_components/StepPanel';

type StudioTab = 'build' | 'run' | 'steps';

const tabs = [
    { value: 'build' as const, label: 'Construir', icon: <Hammer size={13} /> },
    { value: 'run' as const, label: 'Executar', icon: <Play size={13} /> },
    { value: 'steps' as const, label: 'Passos', icon: <ListChecks size={13} /> },
];

const toolHints: Record<CanvasTool, string> = {
    select: 'Arraste os vértices para reposicionar e o fundo para mover a visão.',
    node: 'Clique em qualquer ponto vazio do canvas para criar um vértice.',
    edge: 'Clique no primeiro vértice e depois no segundo para criar a aresta.',
    erase: 'Clique em um vértice ou aresta para removê-lo do grafo.',
};

export function Studio() {
    const editor = useGraphEditor();
    const runner = useAlgorithmRunner();

    const [tool, setTool] = useState<CanvasTool>('select');
    const [tab, setTab] = useState<StudioTab>('build');
    const [selectedNodeId, setSelectedNodeId] = useState<NodeId | null>(null);
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
    const [pendingSourceId, setPendingSourceId] = useState<NodeId | null>(null);
    const [defaultDirected, setDefaultDirected] = useState(false);
    const [algorithmId, setAlgorithmId] = useState(algorithms[0].id);
    const [startId, setStartId] = useState<NodeId | null>(null);
    const [endId, setEndId] = useState<NodeId | null>(null);
    const [autoFitKey, setAutoFitKey] = useState(0);

    const { graph } = editor;
    const algorithm = findAlgorithm(algorithmId) ?? algorithms[0];

    const structureKey = useMemo(
        () =>
            JSON.stringify({
                nodes: graph.nodes.map((node) => `${node.id}:${node.label}`),
                edges: graph.edges.map(
                    (edge) =>
                        `${edge.id}:${edge.source}:${edge.target}:${edge.weight}:${edge.directed}`
                ),
            }),
        [graph]
    );

    const { reset } = runner;
    useEffect(() => {
        reset();
    }, [structureKey, algorithmId, reset]);

    const nodeIds = useMemo(() => new Set(graph.nodes.map((node) => node.id)), [graph.nodes]);
    const orderedNodeIds = useMemo(() => sortedNodes(graph).map((node) => node.id), [graph]);

    const resolvedStartId = useMemo(() => {
        if (startId && nodeIds.has(startId)) return startId;
        return algorithm.needsStart ? (orderedNodeIds[0] ?? null) : null;
    }, [startId, nodeIds, algorithm.needsStart, orderedNodeIds]);

    const resolvedEndId = useMemo(() => {
        if (endId && nodeIds.has(endId)) return endId;
        if (!algorithm.needsEnd) return null;
        return orderedNodeIds.find((id) => id !== resolvedStartId) ?? null;
    }, [endId, nodeIds, algorithm.needsEnd, orderedNodeIds, resolvedStartId]);

    const usesStart = algorithm.needsStart || algorithm.category === 'Caminho mínimo';
    const usesEnd = algorithm.needsEnd || algorithm.category === 'Caminho mínimo';
    const activeStartId = usesStart ? resolvedStartId : null;
    const activeEndId = usesEnd ? resolvedEndId : null;

    const resolvedSelectedNodeId =
        selectedNodeId && nodeIds.has(selectedNodeId) ? selectedNodeId : null;
    const resolvedSelectedEdgeId =
        selectedEdgeId && graph.edges.some((edge) => edge.id === selectedEdgeId)
            ? selectedEdgeId
            : null;

    const context = useMemo(
        () => ({ graph, startId: activeStartId, endId: activeEndId }),
        [graph, activeStartId, activeEndId]
    );
    const issues = useMemo(() => algorithm.validate(context), [algorithm, context]);

    const handleRun = useCallback(() => {
        if (runner.execute(algorithm, context)) {
            setTab('steps');
            setTool('select');
        }
    }, [algorithm, context, runner]);

    const handleLoadPreset = useCallback(
        (presetId: string) => {
            editor.loadPreset(presetId);
            setStartId(null);
            setEndId(null);
            setSelectedNodeId(null);
            setSelectedEdgeId(null);
            setPendingSourceId(null);
            setAutoFitKey((current) => current + 1);
        },
        [editor]
    );

    const handleBackgroundClick = useCallback(
        (point: { x: number; y: number }) => {
            if (tool === 'node') {
                editor.addNode(point.x, point.y);
                return;
            }
            setSelectedNodeId(null);
            setSelectedEdgeId(null);
            setPendingSourceId(null);
        },
        [tool, editor]
    );

    const handleNodePointerDown = useCallback(
        (id: NodeId) => {
            if (tool === 'erase') {
                editor.removeNode(id);
                return;
            }
            if (tool === 'edge') {
                if (!pendingSourceId) {
                    setPendingSourceId(id);
                    return;
                }
                editor.addEdge(pendingSourceId, id, 1, defaultDirected);
                setPendingSourceId(null);
                return;
            }
            setSelectedNodeId(id);
            setSelectedEdgeId(null);
        },
        [tool, editor, pendingSourceId, defaultDirected]
    );

    const handleEdgePointerDown = useCallback(
        (id: string) => {
            if (tool === 'erase') {
                editor.removeEdge(id);
                return;
            }
            setSelectedEdgeId(id);
            setSelectedNodeId(null);
        },
        [tool, editor]
    );

    const handleAddNodeFromPanel = useCallback(() => {
        const offset = graph.nodes.length * 37;
        editor.addNode(160 + (offset % 420), 120 + ((offset * 1.7) % 260));
    }, [editor, graph.nodes.length]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'SELECT') return;

            if (event.key === 'Escape') {
                setPendingSourceId(null);
                setSelectedNodeId(null);
                setSelectedEdgeId(null);
                return;
            }
            if (event.key === 'Delete' || event.key === 'Backspace') {
                if (resolvedSelectedNodeId) editor.removeNode(resolvedSelectedNodeId);
                if (resolvedSelectedEdgeId) editor.removeEdge(resolvedSelectedEdgeId);
                return;
            }
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
                event.preventDefault();
                if (event.shiftKey) editor.redo();
                else editor.undo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [editor, resolvedSelectedNodeId, resolvedSelectedEdgeId]);

    return (
        <div className="flex flex-1 flex-col lg:h-[calc(100dvh-3.5rem)] lg:flex-row lg:overflow-hidden">
            <section className="border-line relative h-[52dvh] shrink-0 border-b lg:h-auto lg:flex-1 lg:border-r lg:border-b-0">
                <GraphCanvas
                    graph={graph}
                    tool={tool}
                    step={runner.currentStep}
                    selectedNodeId={resolvedSelectedNodeId}
                    selectedEdgeId={resolvedSelectedEdgeId}
                    pendingSourceId={pendingSourceId}
                    startId={activeStartId}
                    endId={activeEndId}
                    startLabel={algorithm.id === 'ford-fulkerson' ? 'fonte' : 'raiz'}
                    endLabel={algorithm.id === 'ford-fulkerson' ? 'sumidouro' : 'destino'}
                    autoFitKey={autoFitKey}
                    onBackgroundClick={handleBackgroundClick}
                    onNodePointerDown={handleNodePointerDown}
                    onEdgePointerDown={handleEdgePointerDown}
                    onNodeDragStart={editor.beginHistoryCheckpoint}
                    onNodeDrag={editor.moveNode}
                />

                <GraphToolbar
                    tool={tool}
                    onToolChange={(next) => {
                        setTool(next);
                        setPendingSourceId(null);
                    }}
                    canUndo={editor.canUndo}
                    canRedo={editor.canRedo}
                    onUndo={editor.undo}
                    onRedo={editor.redo}
                    onClear={editor.clear}
                    defaultDirected={defaultDirected}
                    onDefaultDirectedChange={setDefaultDirected}
                    hint={toolHints[tool]}
                />

                <CanvasLegend className="absolute bottom-3 left-3 max-w-[calc(100%-4.5rem)]" />
            </section>

            <aside className="bg-surface-sunken/40 flex w-full flex-col lg:w-[400px] lg:shrink-0 lg:overflow-hidden">
                <div className="border-line bg-surface/85 sticky top-14 z-20 border-b p-3 backdrop-blur-md lg:static">
                    <SegmentedControl options={tabs} value={tab} onChange={setTab} size="sm" />
                </div>

                <div className="flex-1 p-3 lg:overflow-y-auto">
                    {tab === 'build' ? (
                        <BuilderPanel
                            graph={graph}
                            stats={editor.stats}
                            selectedNodeId={resolvedSelectedNodeId}
                            selectedEdgeId={resolvedSelectedEdgeId}
                            onSelectNode={setSelectedNodeId}
                            onSelectEdge={setSelectedEdgeId}
                            onAddNode={handleAddNodeFromPanel}
                            onRenameNode={editor.renameNode}
                            onRemoveNode={editor.removeNode}
                            onAddEdge={editor.addEdge}
                            onUpdateEdge={editor.updateEdge}
                            onRemoveEdge={editor.removeEdge}
                            onLoadPreset={handleLoadPreset}
                            onSetAllDirected={editor.setAllDirected}
                        />
                    ) : null}

                    {tab === 'run' ? (
                        <AlgorithmPanel
                            graph={graph}
                            selectedAlgorithm={algorithm}
                            onSelectAlgorithm={setAlgorithmId}
                            startId={activeStartId}
                            endId={activeEndId}
                            onStartChange={setStartId}
                            onEndChange={setEndId}
                            issues={issues}
                            onRun={handleRun}
                        />
                    ) : null}

                    {tab === 'steps' ? (
                        <StepPanel
                            algorithm={algorithm}
                            trace={runner.trace}
                            currentStep={runner.currentStep}
                            stepIndex={runner.stepIndex}
                            totalSteps={runner.totalSteps}
                            isPlaying={runner.isPlaying}
                            interval={runner.interval}
                            onIntervalChange={runner.setInterval}
                            onGoTo={runner.goTo}
                            onReset={runner.reset}
                            controls={runner.controls}
                        />
                    ) : null}
                </div>
            </aside>
        </div>
    );
}
