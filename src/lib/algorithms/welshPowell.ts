import { getDictionary } from '@/i18n/dictionaries';
import { buildAdjacency, hasDirectedEdges, orderComparator, orderedNodes } from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId } from '../graph/types';
import { colorTable, undirectedDegrees } from './greedyColoring';
import { requireNodes, traceText } from './shared';

export const welshPowell: AlgorithmDefinition = {
    id: 'welsh-powell',
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
        const text = getDictionary(locale).algorithms['welsh-powell'].trace;
        const builder = createTraceBuilder(graph);
        const adjacency = buildAdjacency(graph, order);
        const alphabetical = orderedNodes(graph, order);
        const degree = undirectedDegrees(adjacency, alphabetical);

        const compare = orderComparator(graph, order);
        const sequence = [...alphabetical].sort((a, b) => {
            const byDegree = (degree.get(b.id) ?? 0) - (degree.get(a.id) ?? 0);
            return byDegree !== 0 ? byDegree : compare(a.id, b.id);
        });

        const color = new Map<NodeId, number>();
        const adjacentTo = (node: NodeId) =>
            new Set((adjacency.get(node) ?? []).map((entry) => entry.to));

        const snapshot = (highlight?: NodeId, usedColors = 0) => ({
            tables: [colorTable('wp-colors', sequence, color, degree, locale, highlight)],
            metrics: [
                { label: coloring.colorsUsed, value: String(usedColors) },
                {
                    label: 'Δ(G)',
                    value: String(Math.max(0, ...sequence.map((n) => degree.get(n.id) ?? 0))),
                },
            ],
        });

        builder.commit({
            title: text.sortTitle,
            description: text.sortDescription(
                sequence.map((node) => `${node.label} (d = ${degree.get(node.id)})`).join(', ')
            ),
            ...snapshot(),
        });

        let current = 0;

        while (color.size < sequence.length) {
            const painted: string[] = [];
            const blocked = new Set<NodeId>();

            builder.commit({
                title: text.passTitle(current + 1),
                description: text.passDescription(current + 1),
                ...snapshot(undefined, current),
            });

            for (const node of sequence) {
                if (color.has(node.id)) continue;

                if (blocked.has(node.id)) {
                    builder.commit({
                        title: text.blockedTitle(node.label, current + 1),
                        description: text.blockedDescription(node.label, current + 1),
                        ...snapshot(node.id, current + 1),
                    });
                    continue;
                }

                color.set(node.id, current);
                painted.push(node.label);
                builder.setNodeGroup(node.id, current);
                builder.setNodeBadge(node.id, coloring.badge(current + 1));
                builder.setNode(node.id, 'done');
                adjacentTo(node.id).forEach((neighbour) => blocked.add(neighbour));
                (adjacency.get(node.id) ?? []).forEach((entry) => {
                    if (color.has(entry.to)) builder.setEdge(entry.edge.id, 'done');
                });

                builder.commit({
                    title: coloring.colorTitle(node.label, current + 1),
                    description: text.colorDescription(node.label, current + 1),
                    ...snapshot(node.id, current + 1),
                });
            }

            builder.commit({
                title: text.passDoneTitle(current + 1),
                description: text.passDoneDescription(
                    current + 1,
                    painted,
                    color.size < sequence.length
                ),
                ...snapshot(undefined, current + 1),
            });

            current += 1;
        }

        const maxDegree = Math.max(0, ...sequence.map((node) => degree.get(node.id) ?? 0));

        builder.commit({
            title: coloring.completeTitle,
            description: text.completeDescription(current),
            ...snapshot(undefined, current),
        });

        return builder.build([
            text.resultConclusion(current),
            coloring.boundConclusion(maxDegree),
            text.comparisonConclusion,
        ]);
    },
};
