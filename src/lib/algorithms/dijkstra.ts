import { getDictionary } from '@/i18n/dictionaries';
import {
    buildAdjacency,
    formatDistance,
    formatWeight,
    hasNegativeWeights,
    nodeLabelMap,
    orderedNodes,
    sortedNodes,
    weightOf,
} from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId } from '../graph/types';
import {
    distanceTable,
    edgesAlongPath,
    labelOf,
    pathFromParents,
    requireEdges,
    requireNodes,
    requireStart,
    traceText,
} from './shared';

export const dijkstra: AlgorithmDefinition = {
    id: 'dijkstra',
    category: 'shortest-path',
    needsStart: true,
    needsEnd: false,
    validate: (context) => {
        const errors = [
            ...requireNodes(context),
            ...requireEdges(context),
            ...requireStart(context),
        ];
        if (hasNegativeWeights(context.graph)) {
            errors.push(getDictionary(context.locale).algorithms.dijkstra.issues.negativeWeights);
        }
        return errors;
    },
    run: ({ graph, startId, endId, order, locale }) => {
        const shared = traceText(locale);
        const text = getDictionary(locale).algorithms.dijkstra.trace;
        const builder = createTraceBuilder(graph);
        const adjacency = buildAdjacency(graph, order);
        const labels = nodeLabelMap(graph);
        const root = startId as NodeId;

        const distance = new Map<NodeId, number>();
        const pred = new Map<NodeId, NodeId | null>();
        const predEdge = new Map<NodeId, string | null>();

        const closed = new Set<NodeId>();

        graph.nodes.forEach((node) => {
            distance.set(node.id, Number.POSITIVE_INFINITY);
            pred.set(node.id, null);
            predEdge.set(node.id, null);
        });
        distance.set(root, 0);
        builder.setNodeBadge(root, '0');

        const table = (highlight?: NodeId) =>
            distanceTable(graph, distance, pred, {
                id: 'dijkstra-table',
                title: shared.shortestPath.tableTitle,
                vertexLabel: shared.columns.vertex,
                distanceLabel: 'dist',
                parentLabel: 'pred',
                highlight: highlight ? new Set([highlight]) : undefined,
                settled: closed,
            });

        const openList = () => ({
            id: 'open-set',
            title: text.openSetTitle,
            variant: 'set' as const,
            items: sortedNodes(graph)
                .filter((node) => !closed.has(node.id))
                .map(
                    (node) =>
                        `${node.label}: ${formatDistance(distance.get(node.id) ?? Number.POSITIVE_INFINITY)}`
                ),
        });

        builder.commit({
            title: shared.initialization,
            description: text.initDescription(labelOf(graph, root)),
            tables: [table()],
            lists: [openList()],
        });

        while (closed.size < graph.nodes.length) {
            let candidate: NodeId | null = null;
            let best = Number.POSITIVE_INFINITY;
            orderedNodes(graph, order).forEach((node) => {
                if (closed.has(node.id)) return;
                const value = distance.get(node.id) ?? Number.POSITIVE_INFINITY;
                if (value < best) {
                    best = value;
                    candidate = node.id;
                }
            });

            if (candidate === null) {
                builder.commit({
                    title: text.unreachableTitle,
                    description: text.unreachableDescription,
                    tables: [table()],
                    lists: [openList()],
                });
                break;
            }

            const current: NodeId = candidate;
            closed.add(current);
            builder.resetEdgesWithState('active', 'idle');
            builder.setNode(current, 'done');

            const linkingEdge = predEdge.get(current);
            if (linkingEdge) builder.setEdge(linkingEdge, 'done');

            builder.commit({
                title: text.closeTitle(labels.get(current) ?? '', formatWeight(best)),
                description: text.closeDescription(labels.get(current) ?? ''),
                tables: [table(current)],
                lists: [openList()],
            });

            for (const entry of adjacency.get(current) ?? []) {
                if (closed.has(entry.to)) continue;
                const relaxed = best + weightOf(entry.edge);
                const currentDistance = distance.get(entry.to) ?? Number.POSITIVE_INFINITY;
                builder.setEdge(entry.edge.id, 'active');

                if (relaxed < currentDistance) {
                    distance.set(entry.to, relaxed);
                    pred.set(entry.to, current);
                    predEdge.set(entry.to, entry.edge.id);
                    builder.setNode(entry.to, 'frontier');
                    builder.setNodeBadge(entry.to, formatWeight(relaxed));
                    builder.commit({
                        title: shared.shortestPath.relaxedTitle(
                            labels.get(current) ?? '',
                            labels.get(entry.to) ?? ''
                        ),
                        description: shared.shortestPath.relaxedDescription({
                            from: labels.get(current) ?? '',
                            to: labels.get(entry.to) ?? '',
                            current: formatDistance(currentDistance),
                            fromDistance: formatWeight(best),
                            weight: formatWeight(weightOf(entry.edge)),
                            candidate: formatWeight(relaxed),
                        }),
                        tables: [table(entry.to)],
                        lists: [openList()],
                    });
                } else {
                    builder.commit({
                        title: text.notTenseTitle(
                            labels.get(current) ?? '',
                            labels.get(entry.to) ?? ''
                        ),
                        description: text.notTenseDescription({
                            from: labels.get(current) ?? '',
                            to: labels.get(entry.to) ?? '',
                            current: formatDistance(currentDistance),
                            fromDistance: formatWeight(best),
                            weight: formatWeight(weightOf(entry.edge)),
                            candidate: formatWeight(relaxed),
                        }),
                        tables: [table(entry.to)],
                        lists: [openList()],
                    });
                }
            }
        }

        builder.resetEdgesWithState('active', 'idle');
        builder.resetEdgesWithState('frontier', 'idle');

        const conclusions = [
            shared.shortestPath.finalDistances(
                labelOf(graph, root),
                sortedNodes(graph)
                    .map(
                        (node) =>
                            `${node.label} = ${formatDistance(distance.get(node.id) ?? Number.POSITIVE_INFINITY)}`
                    )
                    .join(', ')
            ),
            text.predConclusion,
        ];

        if (endId && Number.isFinite(distance.get(endId) ?? Infinity)) {
            const path = pathFromParents(pred, endId);
            if (path) {
                edgesAlongPath(graph, path).forEach((edgeId) => builder.setEdge(edgeId, 'path'));
                path.forEach((nodeId) => builder.setNode(nodeId, 'path'));
                conclusions.push(
                    shared.shortestPath.pathConclusion(
                        labelOf(graph, endId),
                        path.map((id) => labels.get(id)).join(' → '),
                        formatDistance(distance.get(endId) ?? Infinity)
                    )
                );
            }
        }

        builder.commit({
            title: shared.shortestPath.doneTitle,
            description:
                endId && Number.isFinite(distance.get(endId) ?? Infinity)
                    ? text.pathHighlighted(labelOf(graph, endId))
                    : text.allClosedDescription,
            tables: [table()],
        });

        return builder.build(conclusions);
    },
};
