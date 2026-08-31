import { formatDistance, nodeLabelMap, sortedNodes } from '../graph/helpers';
import type { AlgorithmContext, Graph, NodeId, TraceRow, TraceTable } from '../graph/types';

export function labelOf(graph: Graph, id: NodeId | null | undefined): string {
    if (!id) return '—';
    return graph.nodes.find((node) => node.id === id)?.label ?? '—';
}

export function requireStart(context: AlgorithmContext): string[] {
    if (!context.startId) return ['Selecione o vértice de origem.'];
    return [];
}

export function requireNodes(context: AlgorithmContext): string[] {
    if (context.graph.nodes.length === 0) return ['Adicione pelo menos um vértice ao grafo.'];
    return [];
}

export function requireEdges(context: AlgorithmContext): string[] {
    if (context.graph.edges.length === 0) return ['Adicione pelo menos uma aresta ao grafo.'];
    return [];
}

export interface DistanceTableOptions {
    id: string;
    title: string;
    distanceLabel?: string;
    parentLabel?: string;
    highlight?: Set<NodeId>;
    settled?: Set<NodeId>;
}

export function distanceTable(
    graph: Graph,
    distance: Map<NodeId, number>,
    parent: Map<NodeId, NodeId | null>,
    options: DistanceTableOptions
): TraceTable {
    const labels = nodeLabelMap(graph);
    const rows: TraceRow[] = sortedNodes(graph).map((node) => {
        const emphasis = options.highlight?.has(node.id)
            ? 'active'
            : options.settled?.has(node.id)
              ? 'done'
              : undefined;
        return {
            key: node.id,
            emphasis,
            cells: {
                vertex: node.label,
                distance: formatDistance(distance.get(node.id) ?? Number.POSITIVE_INFINITY),
                parent: labels.get(parent.get(node.id) ?? '') ?? '—',
            },
        };
    });

    return {
        id: options.id,
        title: options.title,
        columns: [
            { key: 'vertex', label: 'Vértice' },
            { key: 'distance', label: options.distanceLabel ?? 'Distância' },
            { key: 'parent', label: options.parentLabel ?? 'Predecessor' },
        ],
        rows,
    };
}

export function pathFromParents(
    parent: Map<NodeId, NodeId | null>,
    target: NodeId
): NodeId[] | null {
    const path: NodeId[] = [];
    const seen = new Set<NodeId>();
    let current: NodeId | null | undefined = target;
    while (current) {
        if (seen.has(current)) return null;
        seen.add(current);
        path.unshift(current);
        current = parent.get(current) ?? null;
    }
    return path;
}

export function edgesAlongPath(graph: Graph, path: NodeId[]): string[] {
    const ids: string[] = [];
    for (let index = 0; index < path.length - 1; index += 1) {
        const from = path[index];
        const to = path[index + 1];
        const edge = graph.edges.find(
            (candidate) =>
                (candidate.source === from && candidate.target === to) ||
                (!candidate.directed && candidate.source === to && candidate.target === from)
        );
        if (edge) ids.push(edge.id);
    }
    return ids;
}
