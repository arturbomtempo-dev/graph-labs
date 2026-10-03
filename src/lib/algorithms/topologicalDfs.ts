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

type Mark = 0 | 1 | 2;

export const topologicalDfs: AlgorithmDefinition = {
    id: 'topological-dfs',
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
        const text = getDictionary(locale).algorithms['topological-dfs'].trace;
        const builder = createTraceBuilder(graph);
        const adjacency = buildAdjacency(graph, order);
        const labels = nodeLabelMap(graph);
        const ordered = sortedNodes(graph);

        const mark = new Map<NodeId, Mark>();
        ordered.forEach((node) => mark.set(node.id, 0));

        const result: NodeId[] = [];
        const stack: NodeId[] = [];
        let cycleAt: { from: NodeId; to: NodeId } | null = null;

        const markTable = (highlight?: NodeId): TraceTable => ({
            id: 'topo-marks',
            title: text.marksTitle,
            columns: [
                { key: 'vertex', label: shared.columns.vertex },
                { key: 'mark', label: text.markColumn },
                { key: 'position', label: shared.topological.result },
            ],
            rows: ordered.map((node) => ({
                key: node.id,
                emphasis:
                    node.id === highlight ? 'active' : mark.get(node.id) === 2 ? 'done' : undefined,
                cells: {
                    vertex: node.label,
                    mark: text.markLabels[mark.get(node.id) ?? 0],
                    position: result.includes(node.id) ? String(result.indexOf(node.id) + 1) : '-',
                },
            })),
        });

        const stackList = () => ({
            id: 'topo-stack',
            title: text.callsTitle,
            variant: 'stack' as const,
            items: stack.map((id) => labels.get(id) ?? ''),
        });

        const resultList = () => ({
            id: 'topo-result',
            title: shared.topological.result,
            variant: 'set' as const,
            items: result.map((id) => labels.get(id) ?? ''),
        });

        const snapshot = (highlight?: NodeId) => ({
            tables: [markTable(highlight)],
            lists: [stackList(), resultList()],
        });

        builder.commit({
            title: shared.initialization,
            description: text.initDescription,
            ...snapshot(),
        });

        const visit = (current: NodeId) => {
            if (mark.get(current) === 2) return;

            if (mark.get(current) === 1) {
                cycleAt = { from: stack[stack.length - 1], to: current };
                builder.setNode(current, 'reject');
                builder.commit({
                    title: text.cycleTitle(labels.get(current) ?? ''),
                    description: text.cycleDescription(labels.get(current) ?? ''),
                    ...snapshot(current),
                });
                return;
            }

            mark.set(current, 1);
            stack.push(current);
            builder.setNode(current, 'active');
            builder.setNodeBadge(current, text.temporaryBadge);

            builder.commit({
                title: text.visitTitle(labels.get(current) ?? ''),
                description: text.visitDescription(labels.get(current) ?? ''),
                ...snapshot(current),
            });

            for (const entry of adjacency.get(current) ?? []) {
                if (cycleAt) return;
                builder.setEdge(entry.edge.id, 'active');
                visit(entry.to);
                if (cycleAt) {
                    builder.setEdge(entry.edge.id, 'reject');
                    return;
                }
                builder.setEdge(entry.edge.id, 'done');
                builder.setNode(current, 'active');
            }

            mark.set(current, 2);
            stack.pop();
            result.unshift(current);
            builder.setNode(current, 'done');

            builder.commit({
                title: text.prependTitle(labels.get(current) ?? ''),
                description: text.prependDescription(labels.get(current) ?? ''),
                ...snapshot(current),
            });

            result.forEach((id, position) => builder.setNodeBadge(id, String(position + 1)));
        };

        for (const node of orderedNodes(graph, order)) {
            if (cycleAt) break;
            if (mark.get(node.id) !== 0) continue;
            visit(node.id);
        }

        builder.resetEdgesWithState('active', 'idle');

        if (cycleAt) {
            const { from, to } = cycleAt;
            builder.commit({
                title: text.impossibleTitle,
                description: text.impossibleDescription(
                    labels.get(from) ?? '',
                    labels.get(to) ?? ''
                ),
                ...snapshot(),
            });

            return builder.build([
                text.cycleConclusion(labels.get(from) ?? '', labels.get(to) ?? ''),
                shared.topological.cycleConclusion,
            ]);
        }

        builder.commit({
            title: shared.topological.completeTitle,
            description: text.completeDescription(result.map((id) => labels.get(id)).join(' → ')),
            ...snapshot(),
        });

        return builder.build([
            shared.topological.orderConclusion(result.map((id) => labels.get(id)).join(' → ')),
            text.reverseConclusion,
            text.acyclicConclusion,
        ]);
    },
};
