import { getDictionary } from '@/i18n/dictionaries';
import { formatWeight, nodeLabelMap, weightOf } from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId, TraceTable } from '../graph/types';
import {
    applyPath,
    bottleneckOf,
    createResidualNetwork,
    flowNetworkErrors,
    reachableFromSource,
    residualTable,
    type ResidualNetwork,
} from './flowShared';
import { labelOf, traceText } from './shared';

function levels(network: ResidualNetwork, source: NodeId): Map<NodeId, number> {
    const dist = new Map<NodeId, number>([[source, 0]]);
    const queue: NodeId[] = [source];
    while (queue.length > 0) {
        const current = queue.shift() as NodeId;
        network.neighboursOf(current).forEach((neighbour) => {
            if (dist.has(neighbour)) return;
            dist.set(neighbour, (dist.get(current) as number) + 1);
            queue.push(neighbour);
        });
    }
    return dist;
}

export const dinic: AlgorithmDefinition = {
    id: 'dinic',
    category: 'max-flow',
    needsStart: true,
    needsEnd: true,
    validate: flowNetworkErrors,
    run: ({ graph, startId, endId, order, locale }) => {
        const shared = traceText(locale);
        const flow = shared.flow;
        const text = getDictionary(locale).algorithms.dinic.trace;
        const builder = createTraceBuilder(graph);
        const labels = nodeLabelMap(graph);
        const network = createResidualNetwork(graph, order);
        const residual = () => residualTable(graph, network, locale);
        const source = startId as NodeId;
        const sink = endId as NodeId;

        let maxFlow = 0;
        let phase = 0;
        const blockingFlows: string[] = [];

        const refreshBadges = () => {
            graph.edges.forEach((edge) => {
                builder.setEdgeBadge(
                    edge.id,
                    `${formatWeight(network.edgeFlow(edge.id))}/${formatWeight(weightOf(edge))}`
                );
            });
        };

        const levelTable = (dist: Map<NodeId, number>): TraceTable => ({
            id: 'dinic-levels',
            title: text.levelsTitle,
            columns: [
                { key: 'vertex', label: shared.columns.vertex },
                { key: 'dist', label: 'dist(v)' },
            ],
            rows: network.order.map((id) => ({
                key: id,
                emphasis: id === sink ? 'active' : dist.has(id) ? 'done' : undefined,
                cells: {
                    vertex: labels.get(id) ?? '',
                    dist: dist.has(id) ? String(dist.get(id)) : '∞',
                },
            })),
        });

        refreshBadges();
        builder.setNodeBadge(source, 's');
        builder.setNodeBadge(sink, 't');

        builder.commit({
            title: text.initTitle,
            description: text.initDescription(labelOf(graph, source), labelOf(graph, sink)),
            tables: [residual()],
            metrics: [{ label: flow.flowValue, value: '0' }],
        });

        const phaseLimit = graph.nodes.length + 2;

        while (phase < phaseLimit) {
            const dist = levels(network, source);

            const inLevelGraph = (from: NodeId, to: NodeId) =>
                network.residualOf(from, to) > 0 &&
                dist.has(from) &&
                dist.has(to) &&
                (dist.get(to) as number) === (dist.get(from) as number) + 1;

            graph.nodes.forEach((node) => {
                const level = dist.get(node.id);
                builder.setNode(node.id, level === undefined ? 'idle' : 'frontier');
                if (node.id !== source && node.id !== sink) {
                    builder.setNodeBadge(node.id, level === undefined ? 'dist ∞' : `dist ${level}`);
                }
                if (level !== undefined) builder.setNodeGroup(node.id, level);
            });
            builder.resetEdgesWithState('path', 'idle');
            builder.resetEdgesWithState('active', 'idle');
            graph.edges.forEach((edge) => {
                builder.setEdge(
                    edge.id,
                    inLevelGraph(edge.source, edge.target) ? 'frontier' : 'idle'
                );
            });

            if (!dist.has(sink)) {
                const inCut = reachableFromSource(network, source);
                const cutEdges = graph.edges.filter(
                    (edge) => inCut.has(edge.source) && !inCut.has(edge.target)
                );
                const cutCapacity = cutEdges.reduce((total, edge) => total + weightOf(edge), 0);

                graph.edges.forEach((edge) => builder.setEdge(edge.id, 'idle'));
                cutEdges.forEach((edge) => builder.setEdge(edge.id, 'reject'));
                graph.nodes.forEach((node) => {
                    builder.setNode(node.id, inCut.has(node.id) ? 'active' : 'done');
                    builder.setNodeGroup(node.id, inCut.has(node.id) ? 0 : 1);
                });

                builder.commit({
                    title: text.endTitle,
                    description: text.endDescription(
                        [...inCut].map((id) => labels.get(id) ?? '').join(', ')
                    ),
                    tables: [residual()],
                    metrics: [
                        { label: flow.flowValue, value: formatWeight(maxFlow) },
                        { label: flow.cutCapacity, value: formatWeight(cutCapacity) },
                        { label: text.blockingFlowsMetric, value: String(phase) },
                    ],
                });

                return builder.build([
                    flow.maxFlowConclusion(
                        labelOf(graph, source),
                        labelOf(graph, sink),
                        formatWeight(maxFlow)
                    ),
                    text.blockingFlowsConclusion(phase, blockingFlows.join(' | ') || '-'),
                    flow.cutConclusion(
                        cutEdges
                            .map(
                                (edge) => `(${labels.get(edge.source)}, ${labels.get(edge.target)})`
                            )
                            .join(', ') || '-',
                        formatWeight(cutCapacity)
                    ),
                    text.levelsConclusion,
                ]);
            }

            phase += 1;

            builder.commit({
                title: text.levelGraphTitle(phase, dist.get(sink) ?? 0),
                description: text.levelGraphDescription(dist.get(sink) ?? 0),
                tables: [levelTable(dist), residual()],
                metrics: [
                    { label: flow.flowValue, value: formatWeight(maxFlow) },
                    { label: 'dist(t)', value: String(dist.get(sink)) },
                ],
            });

            let blocking = 0;
            let pathsInPhase = 0;
            let guard = 0;
            const guardLimit = graph.edges.length * graph.nodes.length + 50;

            for (;;) {
                guard += 1;
                if (guard > guardLimit) break;

                const parent = new Map<NodeId, NodeId | null>([[source, null]]);
                const visited = new Set<NodeId>([source]);
                const stack: NodeId[] = [source];
                let found = false;

                while (stack.length > 0 && !found) {
                    const current = stack.pop() as NodeId;
                    if (current === sink) {
                        found = true;
                        break;
                    }
                    [...network.order]
                        .filter((candidate) => inLevelGraph(current, candidate))
                        .reverse()
                        .forEach((neighbour) => {
                            if (visited.has(neighbour)) return;
                            visited.add(neighbour);
                            parent.set(neighbour, current);
                            stack.push(neighbour);
                        });
                }

                if (!found && !visited.has(sink)) break;

                const path: NodeId[] = [];
                let cursor: NodeId | null = sink;
                while (cursor) {
                    path.unshift(cursor);
                    cursor = parent.get(cursor) ?? null;
                }
                if (path[0] !== source) break;

                const bottleneck = bottleneckOf(network, path);
                if (!Number.isFinite(bottleneck) || bottleneck <= 0) break;

                const pathLabel = path.map((id) => labels.get(id)).join(' → ');
                builder.resetEdgesWithState('path', 'idle');
                for (let position = 0; position < path.length - 1; position += 1) {
                    const from = path[position];
                    const to = path[position + 1];
                    const edge = graph.edges.find(
                        (candidate) =>
                            (candidate.source === from && candidate.target === to) ||
                            (candidate.source === to && candidate.target === from)
                    );
                    if (edge) builder.setEdge(edge.id, 'path');
                }

                applyPath(network, path, bottleneck);
                blocking += bottleneck;
                maxFlow += bottleneck;
                pathsInPhase += 1;
                refreshBadges();

                builder.commit({
                    title: text.pathTitle(phase, pathsInPhase, pathLabel),
                    description: text.pathDescription(pathLabel, formatWeight(bottleneck)),
                    tables: [levelTable(dist), residual()],
                    metrics: [
                        { label: flow.flowValue, value: formatWeight(maxFlow) },
                        { label: text.blockingFlowMetric, value: formatWeight(blocking) },
                    ],
                });
            }

            blockingFlows.push(`fb${phase} = ${formatWeight(blocking)}`);

            builder.resetEdgesWithState('path', 'idle');
            builder.commit({
                title: text.phaseDoneTitle(phase, formatWeight(blocking)),
                description: text.phaseDoneDescription(pathsInPhase, formatWeight(blocking)),
                tables: [residual()],
                metrics: [{ label: flow.flowValue, value: formatWeight(maxFlow) }],
            });
        }

        return builder.build([text.limitConclusion(formatWeight(maxFlow), phase), flow.limitHint]);
    },
};
