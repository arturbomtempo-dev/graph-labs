import type { ElementState, Graph, GraphEdge, GraphNode, NodeId } from './types';

export const INFINITY_LABEL = '∞';

export interface AdjacencyEntry {
    edge: GraphEdge;
    from: NodeId;
    to: NodeId;
}

export function compareLabels(a: string, b: string): number {
    return a.localeCompare(b, 'pt-BR', { numeric: true, sensitivity: 'base' });
}

export function sortedNodes(graph: Graph): GraphNode[] {
    return [...graph.nodes].sort((a, b) => compareLabels(a.label, b.label));
}

export function nodeLabelMap(graph: Graph): Map<NodeId, string> {
    return new Map(graph.nodes.map((node) => [node.id, node.label]));
}

export function buildAdjacency(graph: Graph): Map<NodeId, AdjacencyEntry[]> {
    const labels = nodeLabelMap(graph);
    const adjacency = new Map<NodeId, AdjacencyEntry[]>();
    graph.nodes.forEach((node) => adjacency.set(node.id, []));

    graph.edges.forEach((edge) => {
        adjacency.get(edge.source)?.push({ edge, from: edge.source, to: edge.target });
        if (!edge.directed) {
            adjacency.get(edge.target)?.push({ edge, from: edge.target, to: edge.source });
        }
    });

    adjacency.forEach((entries) => {
        entries.sort((a, b) => {
            const byLabel = compareLabels(labels.get(a.to) ?? '', labels.get(b.to) ?? '');
            return byLabel !== 0 ? byLabel : a.edge.weight - b.edge.weight;
        });
    });

    return adjacency;
}

export function buildReverseAdjacency(graph: Graph): Map<NodeId, AdjacencyEntry[]> {
    const reversed: Graph = {
        nodes: graph.nodes,
        edges: graph.edges.map((edge) => ({
            ...edge,
            source: edge.directed ? edge.target : edge.source,
            target: edge.directed ? edge.source : edge.target,
        })),
    };
    return buildAdjacency(reversed);
}

export function idleStates(graph: Graph): {
    nodeStates: Record<NodeId, ElementState>;
    edgeStates: Record<string, ElementState>;
} {
    const nodeStates: Record<NodeId, ElementState> = {};
    const edgeStates: Record<string, ElementState> = {};
    graph.nodes.forEach((node) => {
        nodeStates[node.id] = 'idle';
    });
    graph.edges.forEach((edge) => {
        edgeStates[edge.id] = 'idle';
    });
    return { nodeStates, edgeStates };
}

export function hasDirectedEdges(graph: Graph): boolean {
    return graph.edges.some((edge) => edge.directed);
}

export function hasUndirectedEdges(graph: Graph): boolean {
    return graph.edges.some((edge) => !edge.directed);
}

export function hasNegativeWeights(graph: Graph): boolean {
    return graph.edges.some((edge) => edge.weight < 0);
}

export function formatWeight(weight: number): string {
    return Number.isInteger(weight) ? String(weight) : weight.toFixed(2);
}

export function formatDistance(value: number): string {
    if (!Number.isFinite(value)) return INFINITY_LABEL;
    return formatWeight(value);
}

export function createNodeId(): string {
    return `n_${Math.random().toString(36).slice(2, 10)}`;
}

export function createEdgeId(): string {
    return `e_${Math.random().toString(36).slice(2, 10)}`;
}

export function nextNodeLabel(existing: GraphNode[]): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const taken = new Set(existing.map((node) => node.label));
    for (let index = 0; index < 1000; index += 1) {
        const suffix = Math.floor(index / alphabet.length);
        const candidate = `${alphabet[index % alphabet.length]}${suffix > 0 ? suffix : ''}`;
        if (!taken.has(candidate)) return candidate;
    }
    return `V${existing.length + 1}`;
}

export function edgeExists(graph: Graph, source: NodeId, target: NodeId): boolean {
    return graph.edges.some(
        (edge) =>
            (edge.source === source && edge.target === target) ||
            (!edge.directed && edge.source === target && edge.target === source)
    );
}
