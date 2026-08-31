import type { Graph, GraphEdge, GraphNode, NodeId } from '@/lib/graph/types';

export const NODE_RADIUS = 24;

export interface Point {
    x: number;
    y: number;
}

export interface EdgeGeometry {
    path: string;
    midpoint: Point;
}

export function pairKey(edge: GraphEdge): string {
    return [edge.source, edge.target].sort().join('::');
}

export function curveOffsets(edges: GraphEdge[]): Map<string, number> {
    const groups = new Map<string, GraphEdge[]>();
    edges.forEach((edge) => {
        const key = pairKey(edge);
        groups.set(key, [...(groups.get(key) ?? []), edge]);
    });

    const offsets = new Map<string, number>();
    groups.forEach((group) => {
        group.forEach((edge, index) => {
            const spread = group.length === 1 ? 0 : (index - (group.length - 1) / 2) * 52;
            offsets.set(edge.id, spread);
        });
    });
    return offsets;
}

export function edgeGeometry(
    edge: GraphEdge,
    source: GraphNode,
    target: GraphNode,
    offset: number
): EdgeGeometry {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const length = Math.hypot(dx, dy) || 1;
    const ux = dx / length;
    const uy = dy / length;
    const nx = -uy;
    const ny = ux;

    const startGap = NODE_RADIUS + 3;
    const endGap = NODE_RADIUS + (edge.directed ? 12 : 3);

    const startX = source.x + ux * startGap + nx * offset * 0.32;
    const startY = source.y + uy * startGap + ny * offset * 0.32;
    const endX = target.x - ux * endGap + nx * offset * 0.32;
    const endY = target.y - uy * endGap + ny * offset * 0.32;

    if (offset === 0) {
        return {
            path: `M ${startX} ${startY} L ${endX} ${endY}`,
            midpoint: { x: (startX + endX) / 2, y: (startY + endY) / 2 },
        };
    }

    const controlX = (source.x + target.x) / 2 + nx * offset;
    const controlY = (source.y + target.y) / 2 + ny * offset;

    return {
        path: `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`,
        midpoint: {
            x: 0.25 * startX + 0.5 * controlX + 0.25 * endX,
            y: 0.25 * startY + 0.5 * controlY + 0.25 * endY,
        },
    };
}

export function graphBounds(graph: Graph) {
    if (graph.nodes.length === 0) {
        return { minX: 0, minY: 0, maxX: 640, maxY: 400 };
    }
    const xs = graph.nodes.map((node) => node.x);
    const ys = graph.nodes.map((node) => node.y);
    return {
        minX: Math.min(...xs),
        minY: Math.min(...ys),
        maxX: Math.max(...xs),
        maxY: Math.max(...ys),
    };
}

export function nodesById(graph: Graph): Map<NodeId, GraphNode> {
    return new Map(graph.nodes.map((node) => [node.id, node]));
}
