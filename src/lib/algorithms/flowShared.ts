import {
    compareLabels,
    formatWeight,
    hasUndirectedEdges,
    nodeLabelMap,
    orderedNodes,
    weightOf,
} from '../graph/helpers';
import type { AlgorithmContext, Graph, NodeId, TraceTable } from '../graph/types';
import { requireEdges, requireNodes } from './shared';

export const arcKey = (from: NodeId, to: NodeId) => `${from}>${to}`;

export interface ResidualNetwork {
    capacity: Map<string, number>;
    residual: Map<string, number>;
    order: NodeId[];
    residualOf: (from: NodeId, to: NodeId) => number;
    neighboursOf: (node: NodeId) => NodeId[];
    edgeFlow: (edgeId: string) => number;
    push: (from: NodeId, to: NodeId, amount: number) => void;
}

export function createResidualNetwork(graph: Graph, visitOrder?: NodeId[]): ResidualNetwork {
    const capacity = new Map<string, number>();
    const residual = new Map<string, number>();
    const order = orderedNodes(graph, visitOrder).map((node) => node.id);

    graph.edges.forEach((edge) => {
        const forward = arcKey(edge.source, edge.target);
        const backward = arcKey(edge.target, edge.source);
        const capacityValue = weightOf(edge);
        capacity.set(forward, (capacity.get(forward) ?? 0) + capacityValue);
        residual.set(forward, (residual.get(forward) ?? 0) + capacityValue);
        if (!capacity.has(backward)) capacity.set(backward, 0);
        if (!residual.has(backward)) residual.set(backward, 0);
    });

    const residualOf = (from: NodeId, to: NodeId) => residual.get(arcKey(from, to)) ?? 0;

    return {
        capacity,
        residual,
        order,
        residualOf,
        neighboursOf: (node) => order.filter((candidate) => residualOf(node, candidate) > 0),
        edgeFlow: (edgeId) => {
            const edge = graph.edges.find((candidate) => candidate.id === edgeId);
            if (!edge) return 0;
            const forward = arcKey(edge.source, edge.target);
            return Math.max(0, (capacity.get(forward) ?? 0) - (residual.get(forward) ?? 0));
        },
        push: (from, to, amount) => {
            residual.set(arcKey(from, to), residualOf(from, to) - amount);
            residual.set(arcKey(to, from), residualOf(to, from) + amount);
        },
    };
}

export function flowNetworkErrors(context: AlgorithmContext, method: string): string[] {
    const errors = [...requireNodes(context), ...requireEdges(context)];
    if (!context.startId) errors.push('Selecione o vértice fonte s.');
    if (!context.endId) errors.push('Selecione o vértice sumidouro t.');
    if (context.startId && context.startId === context.endId) {
        errors.push('A fonte s e o sumidouro t precisam ser vértices diferentes.');
    }
    if (hasUndirectedEdges(context.graph)) {
        errors.push(
            `Uma rede de fluxo é um grafo direcionado: converta todas as arestas para direcionadas antes de aplicar ${method}.`
        );
    }
    if (context.graph.edges.some((edge) => weightOf(edge) < 0)) {
        errors.push('Em uma rede de fluxo, toda aresta tem capacidade u(e) > 0.');
    }
    return errors;
}

export function residualTable(graph: Graph, network: ResidualNetwork): TraceTable {
    const labels = nodeLabelMap(graph);
    return {
        id: 'residual',
        title: 'Fluxo e capacidades residuais',
        columns: [
            { key: 'arc', label: 'Aresta e' },
            { key: 'flow', label: 'f(e)' },
            { key: 'capacityValue', label: 'u(e)' },
            { key: 'residualValue', label: 'u_r(e)' },
        ],
        rows: [...graph.edges]
            .sort((a, b) => compareLabels(labels.get(a.source) ?? '', labels.get(b.source) ?? ''))
            .map((edge) => {
                const flow = network.edgeFlow(edge.id);
                return {
                    key: edge.id,
                    emphasis: flow > 0 ? ('done' as const) : undefined,
                    cells: {
                        arc: `(${labels.get(edge.source)}, ${labels.get(edge.target)})`,
                        flow: formatWeight(flow),
                        capacityValue: formatWeight(weightOf(edge)),
                        residualValue: formatWeight(network.residualOf(edge.source, edge.target)),
                    },
                };
            }),
    };
}

function rebuild(parent: Map<NodeId, NodeId | null>, sink: NodeId): NodeId[] {
    const path: NodeId[] = [];
    let cursor: NodeId | null = sink;
    while (cursor) {
        path.unshift(cursor);
        cursor = parent.get(cursor) ?? null;
    }
    return path;
}

export function augmentingPathByDepth(
    network: ResidualNetwork,
    source: NodeId,
    sink: NodeId
): NodeId[] | null {
    const parent = new Map<NodeId, NodeId | null>([[source, null]]);
    const visited = new Set<NodeId>();
    const stack: NodeId[] = [source];

    while (stack.length > 0) {
        const current = stack.pop() as NodeId;
        if (visited.has(current)) continue;
        visited.add(current);
        if (current === sink) return rebuild(parent, sink);

        [...network.neighboursOf(current)].reverse().forEach((neighbour) => {
            if (visited.has(neighbour)) return;
            parent.set(neighbour, current);
            stack.push(neighbour);
        });
    }
    return null;
}

export function augmentingPathByBreadth(
    network: ResidualNetwork,
    source: NodeId,
    sink: NodeId
): NodeId[] | null {
    const parent = new Map<NodeId, NodeId | null>([[source, null]]);
    const visited = new Set<NodeId>([source]);
    const queue: NodeId[] = [source];

    while (queue.length > 0) {
        const current = queue.shift() as NodeId;
        if (current === sink) return rebuild(parent, sink);
        network.neighboursOf(current).forEach((neighbour) => {
            if (visited.has(neighbour)) return;
            visited.add(neighbour);
            parent.set(neighbour, current);
            queue.push(neighbour);
        });
    }
    return visited.has(sink) ? rebuild(parent, sink) : null;
}

export function reachableFromSource(network: ResidualNetwork, source: NodeId): Set<NodeId> {
    const visited = new Set<NodeId>([source]);
    const queue: NodeId[] = [source];
    while (queue.length > 0) {
        const current = queue.shift() as NodeId;
        network.neighboursOf(current).forEach((neighbour) => {
            if (visited.has(neighbour)) return;
            visited.add(neighbour);
            queue.push(neighbour);
        });
    }
    return visited;
}

export function bottleneckOf(network: ResidualNetwork, path: NodeId[]): number {
    let value = Number.POSITIVE_INFINITY;
    for (let index = 0; index < path.length - 1; index += 1) {
        value = Math.min(value, network.residualOf(path[index], path[index + 1]));
    }
    return value;
}

export function applyPath(network: ResidualNetwork, path: NodeId[], amount: number) {
    for (let index = 0; index < path.length - 1; index += 1) {
        network.push(path[index], path[index + 1], amount);
    }
}
