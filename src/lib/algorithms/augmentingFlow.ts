import type { Locale } from '@/i18n/config';
import { formatWeight, nodeLabelMap, weightOf } from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmTrace, Graph, NodeId } from '../graph/types';
import {
    applyPath,
    bottleneckOf,
    createResidualNetwork,
    reachableFromSource,
    residualTable,
    type ResidualNetwork,
} from './flowShared';
import { labelOf, traceText } from './shared';

export interface AugmentingMethodOptions {
    findPath: (network: ResidualNetwork, source: NodeId, sink: NodeId) => NodeId[] | null;
    explainChoice: (pathLabel: string, edgeCount: number) => string;
    methodName: string;
}

export function runAugmentingMethod(
    graph: Graph,
    source: NodeId,
    sink: NodeId,
    options: AugmentingMethodOptions,
    locale: Locale,
    order?: NodeId[]
): AlgorithmTrace {
    const builder = createTraceBuilder(graph);
    const labels = nodeLabelMap(graph);
    const network = createResidualNetwork(graph, order);
    const flow = traceText(locale).flow;
    const text = flow.augmenting;
    const residual = () => residualTable(graph, network, locale);

    let maxFlow = 0;
    let iteration = 0;
    const augmentingPaths: string[] = [];

    const refreshBadges = () => {
        graph.edges.forEach((edge) => {
            builder.setEdgeBadge(
                edge.id,
                `${formatWeight(network.edgeFlow(edge.id))}/${formatWeight(weightOf(edge))}`
            );
        });
    };

    refreshBadges();
    builder.setNode(source, 'active');
    builder.setNode(sink, 'path');
    builder.setNodeBadge(source, 's');
    builder.setNodeBadge(sink, 't');

    builder.commit({
        title: text.initialTitle,
        description: text.initialDescription(labelOf(graph, source), labelOf(graph, sink)),
        tables: [residual()],
        metrics: [{ label: flow.flowValue, value: '0' }],
    });

    const totalCapacity = graph.edges.reduce(
        (total, edge) => total + Math.max(0, weightOf(edge)),
        0
    );
    const iterationLimit = Math.min(2000, Math.ceil(totalCapacity) + graph.edges.length + 50);

    while (iteration < iterationLimit) {
        const path = options.findPath(network, source, sink);

        if (!path) {
            builder.resetEdgesWithState('active', 'idle');
            builder.resetEdgesWithState('path', 'idle');

            const inCut = reachableFromSource(network, source);
            const cutEdges = graph.edges.filter(
                (edge) => inCut.has(edge.source) && !inCut.has(edge.target)
            );
            const cutCapacity = cutEdges.reduce((total, edge) => total + weightOf(edge), 0);

            cutEdges.forEach((edge) => builder.setEdge(edge.id, 'reject'));
            graph.nodes.forEach((node) => {
                builder.setNode(node.id, inCut.has(node.id) ? 'active' : 'done');
                builder.setNodeGroup(node.id, inCut.has(node.id) ? 0 : 1);
            });

            builder.commit({
                title: text.noPathTitle,
                description: text.noPathDescription(
                    [...inCut].map((id) => labels.get(id) ?? '').join(', ')
                ),
                tables: [residual()],
                metrics: [
                    { label: flow.flowValue, value: formatWeight(maxFlow) },
                    { label: flow.cutCapacity, value: formatWeight(cutCapacity) },
                    { label: text.augmentingPaths, value: String(augmentingPaths.length) },
                ],
            });

            return builder.build([
                flow.maxFlowConclusion(
                    labelOf(graph, source),
                    labelOf(graph, sink),
                    formatWeight(maxFlow)
                ),
                text.pathsConclusion(
                    options.methodName,
                    augmentingPaths.length,
                    augmentingPaths.join(' | ') || '-'
                ),
                flow.cutConclusion(
                    cutEdges
                        .map((edge) => `(${labels.get(edge.source)}, ${labels.get(edge.target)})`)
                        .join(', ') || '-',
                    formatWeight(cutCapacity)
                ),
            ]);
        }

        iteration += 1;
        const bottleneck = bottleneckOf(network, path);
        const pathLabel = path.map((id) => labels.get(id)).join(' → ');

        builder.resetEdgesWithState('path', 'idle');
        builder.resetEdgesWithState('active', 'idle');
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
        path.forEach((nodeId) => builder.setNode(nodeId, 'path'));

        builder.commit({
            title: text.pathTitle(iteration, pathLabel),
            description: `${options.explainChoice(pathLabel, path.length - 1)} ${text.bottleneckSentence(formatWeight(bottleneck))}`,
            tables: [residual()],
            metrics: [
                { label: flow.flowValue, value: formatWeight(maxFlow) },
                { label: text.bottleneck, value: formatWeight(bottleneck) },
                { label: text.edgesInPath, value: String(path.length - 1) },
            ],
        });

        applyPath(network, path, bottleneck);
        maxFlow += bottleneck;
        augmentingPaths.push(`${pathLabel} (+${formatWeight(bottleneck)})`);
        refreshBadges();

        builder.commit({
            title: text.augmentedTitle(formatWeight(bottleneck)),
            description: text.augmentedDescription(formatWeight(bottleneck), formatWeight(maxFlow)),
            tables: [residual()],
            metrics: [{ label: flow.flowValue, value: formatWeight(maxFlow) }],
        });
    }

    return builder.build([text.limitConclusion(formatWeight(maxFlow), iteration), flow.limitHint]);
}
