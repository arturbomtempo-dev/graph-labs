import { getDictionary } from '@/i18n/dictionaries';
import {
    buildAdjacency,
    buildReverseAdjacency,
    hasUndirectedEdges,
    nodeLabelMap,
    orderedNodes,
} from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId, TraceTable } from '../graph/types';
import { requireEdges, requireNodes, traceText } from './shared';

export const kosaraju: AlgorithmDefinition = {
    id: 'kosaraju',
    category: 'connectivity',
    needsStart: false,
    needsEnd: false,
    validate: (context) => {
        const errors = [...requireNodes(context), ...requireEdges(context)];
        if (hasUndirectedEdges(context.graph)) {
            errors.push(traceText(context.locale).issues.directedOnly('Kosaraju'));
        }
        return errors;
    },
    run: ({ graph, order, locale }) => {
        const shared = traceText(locale);
        const text = getDictionary(locale).algorithms.kosaraju.trace;
        const builder = createTraceBuilder(graph);
        const adjacency = buildAdjacency(graph, order);
        const reverse = buildReverseAdjacency(graph, order);
        const labels = nodeLabelMap(graph);

        const finishOrder: NodeId[] = [];
        const visitedFirst = new Set<NodeId>();
        const component = new Map<NodeId, number>();

        const orderList = () => ({
            id: 'finish-order',
            title: text.finishStackTitle,
            variant: 'stack' as const,
            items: finishOrder.map((id) => labels.get(id) ?? ''),
        });

        const componentsTable = (): TraceTable => {
            const groups = new Map<number, string[]>();
            component.forEach((index, nodeId) => {
                const bucket = groups.get(index) ?? [];
                bucket.push(labels.get(nodeId) ?? '');
                groups.set(index, bucket);
            });
            return {
                id: 'scc-table',
                title: text.componentsTitle,
                columns: [
                    { key: 'component', label: shared.columns.component },
                    { key: 'members', label: shared.columns.vertices },
                ],
                rows: [...groups.entries()]
                    .sort((a, b) => a[0] - b[0])
                    .map(([index, members]) => ({
                        key: `scc-${index}`,
                        emphasis: 'done' as const,
                        cells: {
                            component: `C${index + 1}`,
                            members: members.sort().join(', '),
                        },
                    })),
            };
        };

        builder.commit({
            title: text.step1Title,
            description: text.step1Description,
            lists: [orderList()],
        });

        const firstPass = (current: NodeId) => {
            visitedFirst.add(current);
            builder.setNode(current, 'active');
            builder.commit({
                title: text.visitTitle(labels.get(current) ?? ''),
                description: text.visitDescription(labels.get(current) ?? ''),
                lists: [orderList()],
            });

            (adjacency.get(current) ?? []).forEach((entry) => {
                if (!visitedFirst.has(entry.to)) {
                    builder.setEdge(entry.edge.id, 'done');
                    firstPass(entry.to);
                    builder.setNode(current, 'active');
                }
            });

            finishOrder.push(current);
            builder.setNode(current, 'done');
            builder.commit({
                title: text.finishTitle(labels.get(current) ?? ''),
                description: text.finishDescription(labels.get(current) ?? ''),
                lists: [orderList()],
            });
        };

        orderedNodes(graph, order).forEach((node) => {
            if (!visitedFirst.has(node.id)) firstPass(node.id);
        });

        graph.nodes.forEach((node) => builder.setNode(node.id, 'idle'));
        graph.edges.forEach((edge) => builder.setEdge(edge.id, 'idle'));

        builder.commit({
            title: text.step2Title,
            description: text.step2Description(
                [...finishOrder]
                    .reverse()
                    .map((id) => labels.get(id))
                    .join(', ')
            ),
            lists: [orderList()],
        });

        const visitedSecond = new Set<NodeId>();
        let componentIndex = 0;

        const secondPass = (current: NodeId, index: number) => {
            visitedSecond.add(current);
            component.set(current, index);
            builder.setNode(current, 'done');
            builder.setNodeGroup(current, index);
            builder.setNodeBadge(current, `C${index + 1}`);

            builder.commit({
                title: text.joinTitle(labels.get(current) ?? '', `C${index + 1}`),
                description: text.joinDescription(labels.get(current) ?? ''),
                tables: [componentsTable()],
                lists: [orderList()],
            });

            (reverse.get(current) ?? []).forEach((entry) => {
                if (!visitedSecond.has(entry.to)) {
                    builder.setEdge(entry.edge.id, 'done');
                    secondPass(entry.to, index);
                }
            });
        };

        [...finishOrder].reverse().forEach((nodeId) => {
            if (visitedSecond.has(nodeId)) return;
            builder.commit({
                title: text.newComponentTitle(labels.get(nodeId) ?? ''),
                description: text.newComponentDescription(
                    labels.get(nodeId) ?? '',
                    `C${componentIndex + 1}`
                ),
                tables: [componentsTable()],
                lists: [orderList()],
            });
            secondPass(nodeId, componentIndex);
            componentIndex += 1;
        });

        graph.edges.forEach((edge) => {
            const sameComponent = component.get(edge.source) === component.get(edge.target);
            builder.setEdge(edge.id, sameComponent ? 'done' : 'idle');
        });

        builder.commit({
            title: text.step3Title,
            description: text.step3Description(componentIndex),
            tables: [componentsTable()],
        });

        return builder.build([
            text.countConclusion(componentIndex),
            componentIndex === 1
                ? text.stronglyConnectedConclusion
                : text.notStronglyConnectedConclusion,
        ]);
    },
};
