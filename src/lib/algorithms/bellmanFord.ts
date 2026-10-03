import { getDictionary } from '@/i18n/dictionaries';
import {
    formatDistance,
    formatWeight,
    nodeLabelMap,
    orderComparator,
    sortedNodes,
    weightOf,
} from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, GraphEdge, NodeId } from '../graph/types';
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

interface Arc {
    edge: GraphEdge;
    from: NodeId;
    to: NodeId;
}

export const bellmanFord: AlgorithmDefinition = {
    id: 'bellman-ford',
    category: 'shortest-path',
    needsStart: true,
    needsEnd: false,
    validate: (context) => [
        ...requireNodes(context),
        ...requireEdges(context),
        ...requireStart(context),
    ],
    run: ({ graph, startId, endId, order, locale }) => {
        const shared = traceText(locale);
        const text = getDictionary(locale).algorithms['bellman-ford'].trace;
        const builder = createTraceBuilder(graph);
        const labels = nodeLabelMap(graph);
        const source = startId as NodeId;

        const arcs: Arc[] = [];
        graph.edges.forEach((edge) => {
            arcs.push({ edge, from: edge.source, to: edge.target });
            if (!edge.directed) arcs.push({ edge, from: edge.target, to: edge.source });
        });
        const compare = orderComparator(graph, order);
        arcs.sort((a, b) => {
            const bySource = compare(a.from, b.from);
            return bySource !== 0 ? bySource : compare(a.to, b.to);
        });

        const distance = new Map<NodeId, number>();
        const parent = new Map<NodeId, NodeId | null>();
        graph.nodes.forEach((node) => {
            distance.set(node.id, Number.POSITIVE_INFINITY);
            parent.set(node.id, null);
        });
        distance.set(source, 0);
        builder.setNode(source, 'active');
        builder.setNodeBadge(source, '0');

        const table = (highlight?: NodeId) =>
            distanceTable(graph, distance, parent, {
                id: 'bf-table',
                title: shared.shortestPath.tableTitle,
                vertexLabel: shared.columns.vertex,
                distanceLabel: 'dist',
                parentLabel: 'pred',
                highlight: highlight ? new Set([highlight]) : undefined,
            });

        const arcList = () => ({
            id: 'arc-order',
            title: text.arcsTitle,
            variant: 'queue' as const,
            items: arcs.map(
                (arc) =>
                    `${labels.get(arc.from)}→${labels.get(arc.to)} (${formatWeight(weightOf(arc.edge))})`
            ),
        });

        builder.commit({
            title: shared.initialization,
            description: text.initDescription(labelOf(graph, source)),
            tables: [table()],
            lists: [arcList()],
        });

        const rounds = Math.max(graph.nodes.length - 1, 0);
        let lastRoundWithChange = 0;

        for (let round = 1; round <= rounds; round += 1) {
            let changed = false;
            builder.commit({
                title: text.iterationTitle(round, rounds),
                description: text.iterationDescription(arcs.length, rounds),
                tables: [table()],
                lists: [arcList()],
                metrics: [{ label: text.iterationMetric, value: `${round} / ${rounds}` }],
            });

            for (const arc of arcs) {
                const fromDistance = distance.get(arc.from) ?? Number.POSITIVE_INFINITY;
                if (!Number.isFinite(fromDistance)) continue;

                const candidate = fromDistance + weightOf(arc.edge);
                const currentDistance = distance.get(arc.to) ?? Number.POSITIVE_INFINITY;
                builder.resetEdgesWithState('active', 'idle');
                builder.setEdge(arc.edge.id, 'active');

                if (candidate < currentDistance) {
                    distance.set(arc.to, candidate);
                    parent.set(arc.to, arc.from);
                    changed = true;
                    lastRoundWithChange = round;
                    builder.setNode(arc.to, 'frontier');
                    builder.setNodeBadge(arc.to, formatWeight(candidate));
                    builder.commit({
                        title: shared.shortestPath.relaxedTitle(
                            labels.get(arc.from) ?? '',
                            labels.get(arc.to) ?? ''
                        ),
                        description: shared.shortestPath.relaxedDescription({
                            from: labels.get(arc.from) ?? '',
                            to: labels.get(arc.to) ?? '',
                            current: formatDistance(currentDistance),
                            fromDistance: formatWeight(fromDistance),
                            weight: formatWeight(weightOf(arc.edge)),
                            candidate: formatWeight(candidate),
                        }),
                        tables: [table(arc.to)],
                        lists: [arcList()],
                        metrics: [{ label: text.iterationMetric, value: `${round} / ${rounds}` }],
                    });
                }
            }

            builder.resetEdgesWithState('active', 'idle');
            if (!changed) {
                builder.commit({
                    title: text.noTenseTitle(round),
                    description: text.noTenseDescription,
                    tables: [table()],
                });
                break;
            }
        }

        graph.nodes.forEach((node) => {
            if (Number.isFinite(distance.get(node.id) ?? Infinity)) {
                builder.setNode(node.id, 'done');
            }
        });

        builder.commit({
            title: text.checkTitle,
            description: text.checkDescription,
            tables: [table()],
        });

        const negativeArcs: Arc[] = [];
        for (const arc of arcs) {
            const fromDistance = distance.get(arc.from) ?? Number.POSITIVE_INFINITY;
            if (!Number.isFinite(fromDistance)) continue;
            const candidate = fromDistance + weightOf(arc.edge);
            if (candidate < (distance.get(arc.to) ?? Number.POSITIVE_INFINITY)) {
                negativeArcs.push(arc);
                builder.setEdge(arc.edge.id, 'reject');
                builder.setNode(arc.to, 'reject');
                builder.commit({
                    title: text.negativeCycleTitle(
                        labels.get(arc.from) ?? '',
                        labels.get(arc.to) ?? ''
                    ),
                    description: text.negativeCycleDescription(
                        formatWeight(fromDistance),
                        formatWeight(weightOf(arc.edge)),
                        formatDistance(distance.get(arc.to) ?? Infinity)
                    ),
                    tables: [table(arc.to)],
                });
            }
        }

        const conclusions: string[] = [];

        if (negativeArcs.length > 0) {
            conclusions.push(text.negativeCycleConclusion);
            builder.commit({
                title: text.invalidTitle,
                description: text.invalidDescription(negativeArcs.length, rounds),
                tables: [table()],
            });
        } else {
            conclusions.push(
                shared.shortestPath.finalDistances(
                    labelOf(graph, source),
                    sortedNodes(graph)
                        .map(
                            (node) =>
                                `${node.label} = ${formatDistance(distance.get(node.id) ?? Number.POSITIVE_INFINITY)}`
                        )
                        .join(', ')
                )
            );
            conclusions.push(text.lastRoundConclusion(lastRoundWithChange || 1, rounds));

            if (endId && Number.isFinite(distance.get(endId) ?? Infinity)) {
                const path = pathFromParents(parent, endId);
                if (path) {
                    edgesAlongPath(graph, path).forEach((edgeId) =>
                        builder.setEdge(edgeId, 'path')
                    );
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
                description: text.doneDescription,
                tables: [table()],
            });
        }

        return builder.build(conclusions);
    },
};
