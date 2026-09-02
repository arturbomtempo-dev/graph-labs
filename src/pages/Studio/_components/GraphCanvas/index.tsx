import { Maximize2, Minus, Plus } from 'lucide-react';
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
} from 'react';
import { IconButton } from '@/components/IconButton';
import { hasWeight } from '@/lib/graph/helpers';
import type { AlgorithmStep, ElementState, Graph, NodeId } from '@/lib/graph/types';
import { cn } from '@/lib/utils/cn';
import {
    curveOffsets,
    edgeGeometry,
    graphBounds,
    NODE_RADIUS,
    nodesById,
    type Point,
} from './geometry';
import {
    edgeStrokeClasses,
    edgeStrokeWidth,
    elementStates,
    groupColor,
    markerFillClasses,
    nodeFillClasses,
    nodeStrokeWidth,
} from './styles';

export type CanvasTool = 'select' | 'node' | 'edge' | 'erase';

interface GraphCanvasProps {
    graph: Graph;
    tool: CanvasTool;
    step: AlgorithmStep | null;
    selectedNodeId: NodeId | null;
    selectedEdgeId: string | null;
    pendingSourceId: NodeId | null;
    startId: NodeId | null;
    endId: NodeId | null;
    startLabel: string;
    endLabel: string;
    autoFitKey: number;
    onBackgroundClick: (point: Point) => void;
    onNodePointerDown: (id: NodeId) => void;
    onEdgePointerDown: (id: string) => void;
    onNodeDragStart: () => void;
    onNodeDrag: (id: NodeId, x: number, y: number) => void;
}

interface DragState {
    kind: 'node' | 'pan';
    nodeId?: NodeId;
    pointerOrigin: Point;
    viewOrigin: Point;
    nodeOrigin: Point;
    moved: boolean;
}

const MIN_SCALE = 0.3;
const MAX_SCALE = 2.6;

export function GraphCanvas({
    graph,
    tool,
    step,
    selectedNodeId,
    selectedEdgeId,
    pendingSourceId,
    startId,
    endId,
    startLabel,
    endLabel,
    autoFitKey,
    onBackgroundClick,
    onNodePointerDown,
    onEdgePointerDown,
    onNodeDragStart,
    onNodeDrag,
}: GraphCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const dragRef = useRef<DragState | null>(null);
    const pointersRef = useRef(new Map<number, Point>());
    const pinchRef = useRef<{ distance: number; scale: number } | null>(null);
    const fittedRef = useRef(false);
    const fitRef = useRef<() => void>(() => {});

    const [view, setView] = useState<{ x: number; y: number; scale: number }>({
        x: 40,
        y: 40,
        scale: 1,
    });
    const [cursor, setCursor] = useState<Point | null>(null);

    const nodeMap = nodesById(graph);
    const offsets = curveOffsets(graph.edges);

    const toGraphPoint = useCallback(
        (clientX: number, clientY: number): Point => {
            const rect = svgRef.current?.getBoundingClientRect();
            if (!rect) return { x: 0, y: 0 };
            return {
                x: (clientX - rect.left - view.x) / view.scale,
                y: (clientY - rect.top - view.y) / view.scale,
            };
        },
        [view]
    );

    const fitToContent = useCallback(() => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect || rect.width === 0) return;
        const bounds = graphBounds(graph);
        const padding = 90;
        const width = bounds.maxX - bounds.minX + padding * 2;
        const height = bounds.maxY - bounds.minY + padding * 2;
        const scale = Math.min(rect.width / width, rect.height / height, 1.5);
        const clamped = Math.max(Math.min(scale, MAX_SCALE), MIN_SCALE);
        setView({
            scale: clamped,
            x: rect.width / 2 - ((bounds.minX + bounds.maxX) / 2) * clamped,
            y: rect.height / 2 - ((bounds.minY + bounds.maxY) / 2) * clamped,
        });
        fittedRef.current = true;
    }, [graph]);

    useLayoutEffect(() => {
        fitRef.current = fitToContent;
    }, [fitToContent]);

    useLayoutEffect(() => {
        fitRef.current();
    }, [autoFitKey]);

    useEffect(() => {
        const element = containerRef.current;
        if (!element || typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver(() => {
            if (fittedRef.current) return;
            fitRef.current();
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const element = svgRef.current;
        if (!element) return;

        const handleWheel = (event: WheelEvent) => {
            event.preventDefault();
            const rect = element.getBoundingClientRect();
            const pointerX = event.clientX - rect.left;
            const pointerY = event.clientY - rect.top;
            setView((current) => {
                const factor = Math.exp(-event.deltaY * 0.0016);
                const scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, current.scale * factor));
                const ratio = scale / current.scale;
                return {
                    scale,
                    x: pointerX - (pointerX - current.x) * ratio,
                    y: pointerY - (pointerY - current.y) * ratio,
                };
            });
        };

        element.addEventListener('wheel', handleWheel, { passive: false });
        return () => element.removeEventListener('wheel', handleWheel);
    }, []);

    const zoomBy = (factor: number) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        setView((current) => {
            const scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, current.scale * factor));
            const ratio = scale / current.scale;
            return {
                scale,
                x: centerX - (centerX - current.x) * ratio,
                y: centerY - (centerY - current.y) * ratio,
            };
        });
    };

    const handlePointerDownBackground = (event: ReactPointerEvent<SVGSVGElement>) => {
        pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (pointersRef.current.size === 2) {
            const [first, second] = [...pointersRef.current.values()];
            pinchRef.current = {
                distance: Math.hypot(first.x - second.x, first.y - second.y),
                scale: view.scale,
            };
            dragRef.current = null;
            return;
        }
        if ((event.target as Element).closest('[data-graph-element]')) return;

        svgRef.current?.setPointerCapture(event.pointerId);
        dragRef.current = {
            kind: 'pan',
            pointerOrigin: { x: event.clientX, y: event.clientY },
            viewOrigin: { x: view.x, y: view.y },
            nodeOrigin: { x: 0, y: 0 },
            moved: false,
        };
    };

    const handleNodePointerDown = (event: ReactPointerEvent, nodeId: NodeId) => {
        event.stopPropagation();
        pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (tool === 'select') {
            const node = nodeMap.get(nodeId);
            if (!node) return;
            svgRef.current?.setPointerCapture(event.pointerId);
            dragRef.current = {
                kind: 'node',
                nodeId,
                pointerOrigin: { x: event.clientX, y: event.clientY },
                viewOrigin: { x: view.x, y: view.y },
                nodeOrigin: { x: node.x, y: node.y },
                moved: false,
            };
        }
        onNodePointerDown(nodeId);
    };

    const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
        if (pointersRef.current.has(event.pointerId)) {
            pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
        }

        if (pointersRef.current.size === 2 && pinchRef.current) {
            const [first, second] = [...pointersRef.current.values()];
            const distance = Math.hypot(first.x - second.x, first.y - second.y);
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            const centerX = (first.x + second.x) / 2 - rect.left;
            const centerY = (first.y + second.y) / 2 - rect.top;
            setView((current) => {
                const target = Math.max(
                    MIN_SCALE,
                    Math.min(
                        MAX_SCALE,
                        (pinchRef.current as { scale: number }).scale *
                            (distance / (pinchRef.current as { distance: number }).distance)
                    )
                );
                const ratio = target / current.scale;
                return {
                    scale: target,
                    x: centerX - (centerX - current.x) * ratio,
                    y: centerY - (centerY - current.y) * ratio,
                };
            });
            return;
        }

        if (tool === 'edge' && pendingSourceId) {
            setCursor(toGraphPoint(event.clientX, event.clientY));
        }

        const drag = dragRef.current;
        if (!drag) return;

        const deltaX = event.clientX - drag.pointerOrigin.x;
        const deltaY = event.clientY - drag.pointerOrigin.y;
        if (!drag.moved && Math.hypot(deltaX, deltaY) > 4) {
            drag.moved = true;
            if (drag.kind === 'node') onNodeDragStart();
        }
        if (!drag.moved) return;

        if (drag.kind === 'pan') {
            setView((current) => ({
                ...current,
                x: drag.viewOrigin.x + deltaX,
                y: drag.viewOrigin.y + deltaY,
            }));
            return;
        }

        if (drag.nodeId) {
            onNodeDrag(
                drag.nodeId,
                drag.nodeOrigin.x + deltaX / view.scale,
                drag.nodeOrigin.y + deltaY / view.scale
            );
        }
    };

    const handlePointerUp = (event: ReactPointerEvent<SVGSVGElement>) => {
        pointersRef.current.delete(event.pointerId);
        if (pointersRef.current.size < 2) pinchRef.current = null;

        const drag = dragRef.current;
        dragRef.current = null;
        svgRef.current?.releasePointerCapture?.(event.pointerId);

        if (!drag) return;

        if (drag.kind === 'node') return;

        if (drag.kind === 'pan' && !drag.moved) {
            onBackgroundClick(toGraphPoint(event.clientX, event.clientY));
        }
    };

    const stepNodeState = (id: NodeId): ElementState => step?.nodeStates[id] ?? 'idle';
    const stepEdgeState = (id: string): ElementState => step?.edgeStates[id] ?? 'idle';

    const cursorClass =
        tool === 'node'
            ? 'cursor-copy'
            : tool === 'erase'
              ? 'cursor-crosshair'
              : tool === 'edge'
                ? 'cursor-cell'
                : 'cursor-grab active:cursor-grabbing';

    const pendingNode = pendingSourceId ? nodeMap.get(pendingSourceId) : null;

    return (
        <div
            ref={containerRef}
            className="bg-canvas relative h-full w-full touch-none overflow-hidden"
        >
            <svg
                ref={svgRef}
                className={cn('h-full w-full touch-none select-none', cursorClass)}
                onPointerDown={handlePointerDownBackground}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onPointerLeave={() => setCursor(null)}
            >
                <defs>
                    <pattern
                        id="canvas-grid"
                        width={26}
                        height={26}
                        patternUnits="userSpaceOnUse"
                        patternTransform={`translate(${view.x} ${view.y}) scale(${view.scale})`}
                    >
                        <circle cx={1} cy={1} r={1} className="fill-line-strong opacity-60" />
                    </pattern>
                    {elementStates.map((state) => (
                        <marker
                            key={state}
                            id={`arrow-${state}`}
                            viewBox="0 0 10 10"
                            refX={9}
                            refY={5}
                            markerWidth={6}
                            markerHeight={6}
                            orient="auto-start-reverse"
                        >
                            <path d="M 0 0 L 10 5 L 0 10 z" className={markerFillClasses[state]} />
                        </marker>
                    ))}
                </defs>

                <rect width="100%" height="100%" fill="url(#canvas-grid)" />

                <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
                    {pendingNode && cursor ? (
                        <line
                            x1={pendingNode.x}
                            y1={pendingNode.y}
                            x2={cursor.x}
                            y2={cursor.y}
                            className="stroke-brand"
                            strokeWidth={2}
                            strokeDasharray="6 6"
                        />
                    ) : null}

                    {graph.edges.map((edge) => {
                        const source = nodeMap.get(edge.source);
                        const target = nodeMap.get(edge.target);
                        if (!source || !target) return null;

                        const state = stepEdgeState(edge.id);
                        const geometry = edgeGeometry(
                            edge,
                            source,
                            target,
                            offsets.get(edge.id) ?? 0
                        );
                        const isSelected = selectedEdgeId === edge.id;
                        const badge = step?.edgeBadges?.[edge.id];
                        const label = badge ?? (hasWeight(edge) ? String(edge.weight) : null);
                        const labelWidth = (label?.length ?? 0) * 7.5 + 14;

                        return (
                            <g key={edge.id} data-graph-element="edge">
                                <path
                                    d={geometry.path}
                                    fill="none"
                                    stroke="transparent"
                                    strokeWidth={20}
                                    className="cursor-pointer"
                                    onPointerDown={(event) => {
                                        event.stopPropagation();
                                        onEdgePointerDown(edge.id);
                                    }}
                                />
                                <path
                                    d={geometry.path}
                                    fill="none"
                                    className={cn(
                                        edgeStrokeClasses[state],
                                        'pointer-events-none transition-[stroke] duration-200'
                                    )}
                                    strokeWidth={edgeStrokeWidth[state]}
                                    strokeLinecap="round"
                                    strokeDasharray={state === 'reject' ? '7 5' : undefined}
                                    markerEnd={edge.directed ? `url(#arrow-${state})` : undefined}
                                />
                                {isSelected ? (
                                    <path
                                        d={geometry.path}
                                        fill="none"
                                        className="stroke-brand pointer-events-none opacity-40"
                                        strokeWidth={edgeStrokeWidth[state] + 7}
                                        strokeLinecap="round"
                                    />
                                ) : null}
                                {label !== null ? (
                                    <g className="pointer-events-none">
                                        <rect
                                            x={geometry.midpoint.x - labelWidth / 2}
                                            y={geometry.midpoint.y - 10}
                                            width={labelWidth}
                                            height={20}
                                            rx={6}
                                            className="fill-surface stroke-line"
                                            strokeWidth={1}
                                        />
                                        <text
                                            x={geometry.midpoint.x}
                                            y={geometry.midpoint.y + 4}
                                            textAnchor="middle"
                                            className="fill-ink-soft font-mono text-[11px] font-medium"
                                        >
                                            {label}
                                        </text>
                                    </g>
                                ) : null}
                            </g>
                        );
                    })}

                    {graph.nodes.map((node) => {
                        const state = stepNodeState(node.id);
                        const isSelected = selectedNodeId === node.id;
                        const isPending = pendingSourceId === node.id;
                        const badge = step?.nodeBadges?.[node.id];
                        const group = step?.nodeGroups?.[node.id];

                        return (
                            <g
                                key={node.id}
                                data-graph-element="node"
                                transform={`translate(${node.x} ${node.y})`}
                                className={cn(
                                    tool === 'select' ? 'cursor-grab' : 'cursor-pointer',
                                    'transition-opacity'
                                )}
                                onPointerDown={(event) => handleNodePointerDown(event, node.id)}
                            >
                                {state === 'active' ? (
                                    <circle
                                        r={NODE_RADIUS}
                                        className="fill-state-active animate-pulse-ring pointer-events-none"
                                    />
                                ) : null}
                                {group !== undefined ? (
                                    <circle
                                        r={NODE_RADIUS + 3.5}
                                        fill="none"
                                        stroke={groupColor(group)}
                                        strokeWidth={3}
                                        className="pointer-events-none"
                                    />
                                ) : null}
                                {startId === node.id || endId === node.id ? (
                                    <circle
                                        r={NODE_RADIUS + 7}
                                        fill="none"
                                        className={cn(
                                            'pointer-events-none',
                                            startId === node.id
                                                ? 'stroke-brand'
                                                : 'stroke-state-path'
                                        )}
                                        strokeWidth={1.5}
                                        strokeDasharray="4 4"
                                    />
                                ) : null}
                                {isSelected || isPending ? (
                                    <circle
                                        r={NODE_RADIUS + 5}
                                        className="fill-brand/15 stroke-brand pointer-events-none"
                                        strokeWidth={1.5}
                                    />
                                ) : null}
                                <circle
                                    r={NODE_RADIUS}
                                    className={cn(
                                        nodeFillClasses[state],
                                        'transition-[fill,stroke] duration-200'
                                    )}
                                    strokeWidth={nodeStrokeWidth[state]}
                                />
                                <text
                                    textAnchor="middle"
                                    y={5}
                                    className="fill-ink pointer-events-none text-sm font-semibold"
                                >
                                    {node.label}
                                </text>
                                {badge ? (
                                    <g className="pointer-events-none">
                                        <rect
                                            x={-(badge.length * 4.5 + 10) / 2}
                                            y={NODE_RADIUS + 5}
                                            width={badge.length * 4.5 + 10}
                                            height={17}
                                            rx={5}
                                            className="fill-brand"
                                        />
                                        <text
                                            textAnchor="middle"
                                            y={NODE_RADIUS + 17}
                                            className="fill-brand-ink font-mono text-[10px] font-semibold"
                                        >
                                            {badge}
                                        </text>
                                    </g>
                                ) : null}
                                {startId === node.id ? (
                                    <text
                                        textAnchor="middle"
                                        y={-NODE_RADIUS - 13}
                                        className="fill-brand pointer-events-none text-[10px] font-semibold tracking-wide uppercase"
                                    >
                                        {startLabel}
                                    </text>
                                ) : null}
                                {endId === node.id ? (
                                    <text
                                        textAnchor="middle"
                                        y={-NODE_RADIUS - 13}
                                        className="fill-state-path pointer-events-none text-[10px] font-semibold tracking-wide uppercase"
                                    >
                                        {endLabel}
                                    </text>
                                ) : null}
                            </g>
                        );
                    })}
                </g>
            </svg>

            <div className="absolute right-3 bottom-3 flex flex-col gap-1">
                <IconButton
                    label="Aproximar"
                    variant="soft"
                    size="sm"
                    icon={<Plus size={15} />}
                    onClick={() => zoomBy(1.25)}
                />
                <IconButton
                    label="Afastar"
                    variant="soft"
                    size="sm"
                    icon={<Minus size={15} />}
                    onClick={() => zoomBy(0.8)}
                />
                <IconButton
                    label="Enquadrar grafo"
                    variant="soft"
                    size="sm"
                    icon={<Maximize2 size={14} />}
                    onClick={fitToContent}
                />
            </div>
        </div>
    );
}
