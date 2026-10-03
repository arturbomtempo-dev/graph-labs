import { getDictionary } from '@/i18n/dictionaries';
import {
    buildAdjacency,
    hasUndirectedEdges,
    nodeLabelMap,
    orderedNodes,
    sortedNodes,
} from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId, TraceTable } from '../graph/types';
import { requireEdges, requireNodes, traceText } from './shared';

export const kahn: AlgorithmDefinition = {
    id: 'kahn',
    category: 'topological-sort',
    needsStart: false,
    needsEnd: false,
    validate: (context) => {
        const errors = [...requireNodes(context), ...requireEdges(context)];
        if (hasUndirectedEdges(context.graph)) {
            errors.push(traceText(context.locale).topological.undirectedIssue);
        }
        return errors;
    },
    run: ({ graph, order, locale }) => {
        const shared = traceText(locale);
        const text = getDictionary(locale).algorithms.kahn.trace;
        const builder = createTraceBuilder(graph);
        const adjacency = buildAdjacency(graph, order);
        const labels = nodeLabelMap(graph);
        const ordered = sortedNodes(graph);

        const inDegree = new Map<NodeId, number>();
        ordered.forEach((node) => inDegree.set(node.id, 0));
        graph.edges.forEach((edge) => {
            inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
        });

        const queue: NodeId[] = [];
        const result: NodeId[] = [];

        const degreeTable = (highlight?: NodeId): TraceTable => ({
            id: 'kahn-degrees',
            title: text.degreesTitle,
            columns: [
                { key: 'vertex', label: shared.columns.vertex },
                { key: 'degree', label: 'M[v]' },
                { key: 'status', label: shared.columns.status },
            ],
            rows: ordered.map((node) => ({
                key: node.id,
                emphasis:
                    node.id === highlight
                        ? 'active'
                        : result.includes(node.id)
                          ? 'done'
                          : undefined,
                cells: {
                    vertex: node.label,
                    degree: String(inDegree.get(node.id) ?? 0),
                    status: result.includes(node.id)
                        ? text.positionStatus(result.indexOf(node.id) + 1)
                        : queue.includes(node.id)
                          ? text.queuedStatus
                          : text.waitingStatus,
                },
            })),
        });

        const queueList = () => ({
            id: 'kahn-queue',
            title: shared.queue,
            variant: 'queue' as const,
            items: queue.map((id) => labels.get(id) ?? ''),
        });

        const resultList = () => ({
            id: 'kahn-result',
            title: shared.topological.result,
            variant: 'set' as const,
            items: result.map((id) => labels.get(id) ?? ''),
        });

        const snapshot = (highlight?: NodeId) => ({
            tables: [degreeTable(highlight)],
            lists: [queueList(), resultList()],
        });

        builder.commit({
            title: shared.initialization,
            description: text.initDescription,
            ...snapshot(),
        });

        orderedNodes(graph, order).forEach((node) => {
            if ((inDegree.get(node.id) ?? 0) === 0) {
                queue.push(node.id);
                builder.setNode(node.id, 'frontier');
            }
        });

        builder.commit({
            title: text.sourcesTitle,
            description:
                queue.length > 0
                    ? text.sourcesDescription(queue.map((id) => labels.get(id)).join(', '))
                    : text.noSourcesDescription,
            ...snapshot(),
        });

        while (queue.length > 0) {
            const current = queue.shift() as NodeId;
            result.push(current);
            builder.resetEdgesWithState('active', 'idle');
            builder.setNode(current, 'done');
            builder.setNodeBadge(current, String(result.length));

            builder.commit({
                title: text.insertTitle(labels.get(current) ?? '', result.length),
                description: text.insertDescription(labels.get(current) ?? '', result.length),
                ...snapshot(current),
            });

            for (const entry of adjacency.get(current) ?? []) {
                const before = inDegree.get(entry.to) ?? 0;
                inDegree.set(entry.to, before - 1);
                builder.setEdge(entry.edge.id, 'done');

                if (before - 1 === 0) {
                    queue.push(entry.to);
                    builder.setNode(entry.to, 'frontier');
                    builder.commit({
                        title: text.zeroTitle(labels.get(entry.to) ?? ''),
                        description: text.zeroDescription(
                            labels.get(current) ?? '',
                            labels.get(entry.to) ?? '',
                            before
                        ),
                        ...snapshot(entry.to),
                    });
                } else {
                    builder.commit({
                        title: `M[${labels.get(entry.to)}] = ${before - 1}`,
                        description: text.decreasedDescription(
                            labels.get(current) ?? '',
                            labels.get(entry.to) ?? '',
                            before
                        ),
                        ...snapshot(entry.to),
                    });
                }
            }
        }

        builder.resetEdgesWithState('active', 'idle');

        const pending = ordered.filter((node) => !result.includes(node.id));

        if (pending.length > 0) {
            pending.forEach((node) => {
                builder.setNode(node.id, 'reject');
                builder.setNodeBadge(node.id, `M=${inDegree.get(node.id) ?? 0}`);
            });
            graph.edges.forEach((edge) => {
                const inCycle =
                    pending.some((node) => node.id === edge.source) &&
                    pending.some((node) => node.id === edge.target);
                if (inCycle) builder.setEdge(edge.id, 'reject');
            });

            builder.commit({
                title: text.cycleTitle,
                description: text.cycleDescription(
                    pending.length,
                    pending.map((node) => node.label).join(', ')
                ),
                ...snapshot(),
            });

            return builder.build([
                text.pendingConclusion(pending.map((node) => node.label).join(', ')),
                shared.topological.cycleConclusion,
            ]);
        }

        builder.commit({
            title: shared.topological.completeTitle,
            description: text.completeDescription(
                result.length,
                result.map((id) => labels.get(id)).join(' → ')
            ),
            ...snapshot(),
        });

        return builder.build([
            shared.topological.orderConclusion(result.map((id) => labels.get(id)).join(' → ')),
            text.numberingConclusion,
            text.acyclicConclusion,
        ]);
    },
};
