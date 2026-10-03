import { getDictionary } from '@/i18n/dictionaries';
import {
    buildAdjacency,
    formatDistance,
    formatWeight,
    hasDirectedEdges,
    nodeLabelMap,
    orderedNodes,
    sortedNodes,
    weightOf,
} from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId, TraceTable } from '../graph/types';
import { labelOf, requireEdges, requireNodes, requireStart, traceText } from './shared';

export const prim: AlgorithmDefinition = {
    id: 'prim',
    category: 'spanning-tree',
    needsStart: true,
    needsEnd: false,
    validate: (context) => {
        const errors = [
            ...requireNodes(context),
            ...requireEdges(context),
            ...requireStart(context),
        ];
        if (hasDirectedEdges(context.graph)) {
            errors.push(traceText(context.locale).issues.undirectedOnly('Prim'));
        }
        return errors;
    },
    run: ({ graph, startId, order, locale }) => {
        const shared = traceText(locale);
        const text = getDictionary(locale).algorithms.prim.trace;
        const builder = createTraceBuilder(graph);
        const adjacency = buildAdjacency(graph, order);
        const labels = nodeLabelMap(graph);

        const key = new Map<NodeId, number>();
        const parent = new Map<NodeId, NodeId | null>();
        const parentEdge = new Map<NodeId, string | null>();
        const inTree = new Set<NodeId>();
        const treeEdges: string[] = [];
        let totalWeight = 0;

        graph.nodes.forEach((node) => {
            key.set(node.id, Number.POSITIVE_INFINITY);
            parent.set(node.id, null);
            parentEdge.set(node.id, null);
        });
        key.set(startId as NodeId, 0);
        builder.setNodeBadge(startId as NodeId, '0');

        const keyTable = (highlight?: NodeId): TraceTable => ({
            id: 'prim-keys',
            title: text.keysTitle,
            columns: [
                { key: 'vertex', label: text.vertexColumn },
                { key: 'keyValue', label: text.minWeightColumn },
                { key: 'parent', label: 'v ∈ V(T)' },
                { key: 'status', label: shared.columns.status },
            ],
            rows: sortedNodes(graph).map((node) => ({
                key: node.id,
                emphasis:
                    node.id === highlight ? 'active' : inTree.has(node.id) ? 'done' : undefined,
                cells: {
                    vertex: node.label,
                    keyValue: formatDistance(key.get(node.id) ?? Number.POSITIVE_INFINITY),
                    parent: labels.get(parent.get(node.id) ?? '') ?? '-',
                    status: inTree.has(node.id) ? text.inTreeStatus : text.outsideTreeStatus,
                },
            })),
        });

        const metrics = () => [
            {
                label: shared.spanningTree.edgesMetric,
                value: `${treeEdges.length} / ${graph.nodes.length - 1}`,
            },
            { label: shared.spanningTree.totalWeightMetric, value: formatWeight(totalWeight) },
        ];

        builder.commit({
            title: shared.initialization,
            description: text.initDescription(labelOf(graph, startId)),
            tables: [keyTable()],
            metrics: metrics(),
        });

        while (inTree.size < graph.nodes.length) {
            let candidate: NodeId | null = null;
            let bestKey = Number.POSITIVE_INFINITY;
            orderedNodes(graph, order).forEach((node) => {
                if (inTree.has(node.id)) return;
                const value = key.get(node.id) ?? Number.POSITIVE_INFINITY;
                if (value < bestKey) {
                    bestKey = value;
                    candidate = node.id;
                }
            });

            if (candidate === null) {
                builder.commit({
                    title: text.disconnectedTitle,
                    description: text.disconnectedDescription,
                    tables: [keyTable()],
                    metrics: metrics(),
                });
                break;
            }

            const current: NodeId = candidate;
            inTree.add(current);
            builder.resetEdgesWithState('active', 'idle');
            builder.setNode(current, 'done');

            const linkingEdge = parentEdge.get(current);
            if (linkingEdge) {
                treeEdges.push(linkingEdge);
                totalWeight += bestKey;
                builder.setEdge(linkingEdge, 'done');
            }

            builder.commit({
                title: text.addTitle(labels.get(current) ?? ''),
                description: linkingEdge
                    ? text.addDescription(
                          labelOf(graph, parent.get(current)),
                          labels.get(current) ?? '',
                          formatWeight(bestKey)
                      )
                    : text.rootDescription(labels.get(current) ?? ''),
                tables: [keyTable(current)],
                metrics: metrics(),
            });

            for (const entry of adjacency.get(current) ?? []) {
                if (inTree.has(entry.to)) continue;
                const weight = weightOf(entry.edge);
                const currentKey = key.get(entry.to) ?? Number.POSITIVE_INFINITY;

                if (weight < currentKey) {
                    key.set(entry.to, weight);
                    parent.set(entry.to, current);
                    parentEdge.set(entry.to, entry.edge.id);
                    builder.setNode(entry.to, 'frontier');
                    builder.setNodeBadge(entry.to, formatWeight(weight));
                    builder.setEdge(entry.edge.id, 'active');
                    builder.commit({
                        title: text.candidateTitle(labels.get(entry.to) ?? ''),
                        description: text.candidateDescription(
                            labels.get(current) ?? '',
                            labels.get(entry.to) ?? '',
                            formatWeight(weight),
                            formatDistance(currentKey)
                        ),
                        tables: [keyTable(entry.to)],
                        metrics: metrics(),
                    });
                } else {
                    builder.commit({
                        title: text.keepTitle(labels.get(entry.to) ?? ''),
                        description: text.keepDescription(
                            labels.get(current) ?? '',
                            labels.get(entry.to) ?? '',
                            formatWeight(weight),
                            formatDistance(currentKey)
                        ),
                        tables: [keyTable(entry.to)],
                        metrics: metrics(),
                    });
                }
            }
        }

        builder.resetEdgesWithState('active', 'idle');
        builder.resetEdgesWithState('frontier', 'idle');
        graph.nodes.forEach((node) => {
            if (inTree.has(node.id)) builder.setNode(node.id, 'done');
        });

        builder.commit({
            title: text.completeTitle,
            description: text.completeDescription(treeEdges.length, formatWeight(totalWeight)),
            tables: [keyTable()],
            metrics: metrics(),
        });

        return builder.build([
            text.totalConclusion(formatWeight(totalWeight)),
            text.edgesConclusion(treeEdges.length, inTree.size),
            inTree.size < graph.nodes.length
                ? text.disconnectedConclusion
                : text.spanningConclusion,
        ]);
    },
};
