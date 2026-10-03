import { getDictionary } from '@/i18n/dictionaries';
import { formatDistance, formatWeight, orderedNodes, weightOf } from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, GraphNode, NodeId, TraceTable } from '../graph/types';
import { edgesAlongPath, labelOf, requireEdges, requireNodes } from './shared';

export const floydWarshall: AlgorithmDefinition = {
    id: 'floyd-warshall',
    category: 'shortest-path',
    needsStart: false,
    needsEnd: false,
    validate: (context) => [...requireNodes(context), ...requireEdges(context)],
    run: ({ graph, startId, endId, order, locale }) => {
        const text = getDictionary(locale).algorithms['floyd-warshall'].trace;
        const builder = createTraceBuilder(graph);
        const nodes: GraphNode[] = orderedNodes(graph, order);
        const index = new Map<NodeId, number>(nodes.map((node, position) => [node.id, position]));
        const size = nodes.length;

        const distance: number[][] = nodes.map((_, i) =>
            nodes.map((__, j) => (i === j ? 0 : Number.POSITIVE_INFINITY))
        );
        const pred: (NodeId | null)[][] = nodes.map((from, i) =>
            nodes.map((_, j) => (i === j ? from.id : null))
        );

        graph.edges.forEach((edge) => {
            const i = index.get(edge.source) as number;
            const j = index.get(edge.target) as number;
            const weight = weightOf(edge);
            if (weight < distance[i][j]) {
                distance[i][j] = weight;
                pred[i][j] = edge.source;
            }
            if (!edge.directed && weight < distance[j][i]) {
                distance[j][i] = weight;
                pred[j][i] = edge.target;
            }
        });

        const matrix = (
            highlightRow?: number,
            highlightColumn?: number,
            pivot?: number
        ): TraceTable => ({
            id: 'fw-matrix',
            title: text.distMatrixTitle,
            columns: [
                { key: 'origin', label: 'i \\ j' },
                ...nodes.map((node) => ({ key: node.id, label: node.label })),
            ],
            rows: nodes.map((from, i) => ({
                key: from.id,
                emphasis: i === pivot ? 'done' : i === highlightRow ? 'active' : undefined,
                cells: {
                    origin: from.label,
                    ...Object.fromEntries(
                        nodes.map((to, j) => [
                            to.id,
                            `${formatDistance(distance[i][j])}${
                                i === highlightRow && j === highlightColumn ? ' •' : ''
                            }`,
                        ])
                    ),
                },
            })),
        });

        const predecessors = (): TraceTable => ({
            id: 'fw-pred',
            title: text.predMatrixTitle,
            columns: [
                { key: 'origin', label: 'i \\ j' },
                ...nodes.map((node) => ({ key: node.id, label: node.label })),
            ],
            rows: nodes.map((from, i) => ({
                key: `pred-${from.id}`,
                cells: {
                    origin: from.label,
                    ...Object.fromEntries(
                        nodes.map((to, j) => [
                            to.id,
                            pred[i][j] ? (labelOf(graph, pred[i][j]) ?? '-') : '-',
                        ])
                    ),
                },
            })),
        });

        builder.commit({
            title: text.initTitle,
            description: text.initDescription,
            tables: [matrix(), predecessors()],
        });

        for (let k = 0; k < size; k += 1) {
            const pivotNode = nodes[k];
            builder.setNodes(
                nodes.map((node) => node.id),
                'idle'
            );
            builder.setNode(pivotNode.id, 'active');
            builder.setNodeBadge(pivotNode.id, 'k');

            let improvements = 0;

            builder.commit({
                title: `k = ${pivotNode.label}`,
                description: text.pivotDescription(
                    nodes
                        .slice(0, k + 1)
                        .map((node) => node.label)
                        .join(', '),
                    pivotNode.label
                ),
                tables: [matrix(undefined, undefined, k), predecessors()],
                metrics: [{ label: text.pivotMetric, value: `${k + 1} / ${size}` }],
            });

            for (let i = 0; i < size; i += 1) {
                for (let j = 0; j < size; j += 1) {
                    const throughPivot = distance[i][k] + distance[k][j];
                    if (!Number.isFinite(throughPivot)) continue;
                    if (throughPivot >= distance[i][j]) continue;

                    const previous = distance[i][j];
                    distance[i][j] = throughPivot;
                    pred[i][j] = pred[k][j];
                    improvements += 1;

                    builder.commit({
                        title: `dist[${nodes[i].label}, ${nodes[j].label}] ← ${formatWeight(throughPivot)}`,
                        description: text.updateDescription({
                            i: nodes[i].label,
                            j: nodes[j].label,
                            k: pivotNode.label,
                            viaFirst: formatWeight(distance[i][k]),
                            viaSecond: formatWeight(distance[k][j]),
                            total: formatWeight(throughPivot),
                            previous: formatDistance(previous),
                            predecessor: labelOf(graph, pred[k][j]),
                        }),
                        tables: [matrix(i, j, k), predecessors()],
                        metrics: [{ label: text.pivotMetric, value: `${k + 1} / ${size}` }],
                    });
                }
            }

            if (improvements === 0) {
                builder.commit({
                    title: text.noImprovementTitle(pivotNode.label),
                    description: text.noImprovementDescription(pivotNode.label),
                    tables: [matrix(undefined, undefined, k), predecessors()],
                });
            }
        }

        builder.setNodes(
            nodes.map((node) => node.id),
            'done'
        );

        const negativeCycleNodes = nodes.filter((_, i) => distance[i][i] < 0);
        const conclusions: string[] = [];

        if (negativeCycleNodes.length > 0) {
            negativeCycleNodes.forEach((node) => {
                builder.setNode(node.id, 'reject');
                builder.setNodeBadge(node.id, text.negativeCycleBadge);
            });
            conclusions.push(
                text.negativeCycleConclusion(
                    negativeCycleNodes.map((node) => node.label).join(', ')
                )
            );
        } else {
            conclusions.push(text.noNegativeCycleConclusion);
        }

        if (startId && endId && startId !== endId) {
            const i = index.get(startId) as number;
            const j = index.get(endId) as number;
            const path: NodeId[] = [endId];
            let cursor: NodeId = endId;
            let guard = 0;

            while (cursor !== startId && guard < size + 1) {
                const previous = pred[i][index.get(cursor) as number];
                if (!previous) break;
                path.unshift(previous);
                cursor = previous;
                guard += 1;
            }

            if (path[0] === startId && Number.isFinite(distance[i][j])) {
                edgesAlongPath(graph, path).forEach((edgeId) => builder.setEdge(edgeId, 'path'));
                path.forEach((nodeId) => builder.setNode(nodeId, 'path'));
                conclusions.push(
                    text.pathConclusion(
                        labelOf(graph, startId),
                        labelOf(graph, endId),
                        path.map((id) => labelOf(graph, id)).join(' → '),
                        formatDistance(distance[i][j])
                    )
                );
            }
        }

        builder.commit({
            title: text.finalTitle,
            description: text.finalDescription,
            tables: [matrix(), predecessors()],
        });

        return builder.build(conclusions);
    },
};
