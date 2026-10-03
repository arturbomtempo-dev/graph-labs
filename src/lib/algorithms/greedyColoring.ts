import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { buildAdjacency, hasDirectedEdges, orderedNodes } from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, GraphNode, NodeId, TraceTable } from '../graph/types';
import { requireNodes, traceText } from './shared';

export function colorTable(
    id: string,
    order: GraphNode[],
    color: Map<NodeId, number>,
    degree: Map<NodeId, number>,
    locale: Locale,
    highlight?: NodeId
): TraceTable {
    const shared = traceText(locale);
    return {
        id,
        title: shared.coloring.tableTitle,
        columns: [
            { key: 'vertex', label: shared.columns.vertex },
            { key: 'degree', label: 'd(v)' },
            { key: 'colorIndex', label: shared.coloring.colorColumn },
        ],
        rows: order.map((node) => ({
            key: node.id,
            emphasis: node.id === highlight ? 'active' : color.has(node.id) ? 'done' : undefined,
            cells: {
                vertex: node.label,
                degree: String(degree.get(node.id) ?? 0),
                colorIndex: color.has(node.id) ? String((color.get(node.id) as number) + 1) : '-',
            },
        })),
    };
}

export function undirectedDegrees(
    adjacency: Map<NodeId, { to: NodeId }[]>,
    nodes: GraphNode[]
): Map<NodeId, number> {
    const degree = new Map<NodeId, number>();
    nodes.forEach((node) => degree.set(node.id, (adjacency.get(node.id) ?? []).length));
    return degree;
}

export const greedyColoring: AlgorithmDefinition = {
    id: 'greedy-coloring',
    category: 'coloring',
    needsStart: false,
    needsEnd: false,
    validate: (context) => {
        const errors = [...requireNodes(context)];
        if (hasDirectedEdges(context.graph)) {
            errors.push(traceText(context.locale).coloring.undirectedOnly);
        }
        return errors;
    },
    run: ({ graph, order, locale }) => {
        const coloring = traceText(locale).coloring;
        const text = getDictionary(locale).algorithms['greedy-coloring'].trace;
        const builder = createTraceBuilder(graph);
        const adjacency = buildAdjacency(graph, order);
        const sequence = orderedNodes(graph, order);
        const degree = undirectedDegrees(adjacency, sequence);

        const color = new Map<NodeId, number>();
        let used = 0;

        const snapshot = (highlight?: NodeId) => ({
            tables: [colorTable('greedy-colors', sequence, color, degree, locale, highlight)],
            metrics: [
                { label: coloring.colorsUsed, value: String(used) },
                {
                    label: 'Δ(G)',
                    value: String(Math.max(0, ...sequence.map((n) => degree.get(n.id) ?? 0))),
                },
            ],
        });

        builder.commit({
            title: traceText(locale).initialization,
            description: text.initDescription(sequence.map((node) => node.label).join(', ')),
            ...snapshot(),
        });

        for (const node of sequence) {
            builder.setNode(node.id, 'active');
            const neighbours = adjacency.get(node.id) ?? [];
            const forbidden = new Set<number>();
            neighbours.forEach((entry) => {
                const neighbourColor = color.get(entry.to);
                if (neighbourColor !== undefined) forbidden.add(neighbourColor);
            });

            let chosen = 0;
            while (forbidden.has(chosen)) chosen += 1;

            color.set(node.id, chosen);
            used = Math.max(used, chosen + 1);
            builder.setNodeGroup(node.id, chosen);
            builder.setNodeBadge(node.id, coloring.badge(chosen + 1));
            builder.setNode(node.id, 'done');
            neighbours.forEach((entry) => {
                if (color.has(entry.to)) builder.setEdge(entry.edge.id, 'done');
            });

            const usedByNeighbours = [...forbidden].sort((a, b) => a - b).map((c) => c + 1);

            builder.commit({
                title: coloring.colorTitle(node.label, chosen + 1),
                description:
                    usedByNeighbours.length > 0
                        ? text.neighborsDescription(node.label, usedByNeighbours, chosen + 1)
                        : text.freeDescription(node.label, chosen + 1),
                ...snapshot(node.id),
            });
        }

        const maxDegree = Math.max(0, ...sequence.map((node) => degree.get(node.id) ?? 0));

        builder.commit({
            title: coloring.completeTitle,
            description: text.completeDescription(used),
            ...snapshot(),
        });

        return builder.build([
            text.resultConclusion(used),
            coloring.boundConclusion(maxDegree),
            text.orderConclusion,
        ]);
    },
};
