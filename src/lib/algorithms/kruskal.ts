import { getDictionary } from '@/i18n/dictionaries';
import {
    formatWeight,
    hasDirectedEdges,
    nodeLabelMap,
    orderComparator,
    sortedNodes,
    weightOf,
} from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId, TraceTable } from '../graph/types';
import { requireEdges, requireNodes, traceText } from './shared';

export const kruskal: AlgorithmDefinition = {
    id: 'kruskal',
    category: 'spanning-tree',
    needsStart: false,
    needsEnd: false,
    validate: (context) => {
        const errors = [...requireNodes(context), ...requireEdges(context)];
        if (hasDirectedEdges(context.graph)) {
            errors.push(traceText(context.locale).issues.undirectedOnly('Kruskal'));
        }
        return errors;
    },
    run: ({ graph, order, locale }) => {
        const shared = traceText(locale);
        const text = getDictionary(locale).algorithms.kruskal.trace;
        const builder = createTraceBuilder(graph);
        const labels = nodeLabelMap(graph);

        const parent = new Map<NodeId, NodeId>();
        const rank = new Map<NodeId, number>();
        graph.nodes.forEach((node) => {
            parent.set(node.id, node.id);
            rank.set(node.id, 0);
        });

        const find = (node: NodeId): NodeId => {
            let root = node;
            while (parent.get(root) !== root) root = parent.get(root) as NodeId;
            let current = node;
            while (parent.get(current) !== root) {
                const next = parent.get(current) as NodeId;
                parent.set(current, root);
                current = next;
            }
            return root;
        };

        const union = (a: NodeId, b: NodeId) => {
            const rootA = find(a);
            const rootB = find(b);
            if (rootA === rootB) return false;
            const rankA = rank.get(rootA) ?? 0;
            const rankB = rank.get(rootB) ?? 0;
            if (rankA < rankB) {
                parent.set(rootA, rootB);
            } else if (rankA > rankB) {
                parent.set(rootB, rootA);
            } else {
                parent.set(rootB, rootA);
                rank.set(rootA, rankA + 1);
            }
            return true;
        };

        const compare = orderComparator(graph, order);
        const ordered = [...graph.edges].sort((a, b) => {
            if (weightOf(a) !== weightOf(b)) return weightOf(a) - weightOf(b);
            const bySource = compare(a.source, b.source);
            return bySource !== 0 ? bySource : compare(a.target, b.target);
        });

        const accepted: string[] = [];
        const rejected: string[] = [];
        let totalWeight = 0;
        let examinedIndex = -1;

        const applyGroups = () => {
            const roots = new Map<NodeId, number>();
            sortedNodes(graph).forEach((node) => {
                const root = find(node.id);
                if (!roots.has(root)) roots.set(root, roots.size);
                builder.setNodeGroup(node.id, roots.get(root) as number);
                builder.setNodeBadge(node.id, `T${(roots.get(root) as number) + 1}`);
            });
            return roots.size;
        };

        const edgeQueueTable = (): TraceTable => ({
            id: 'kruskal-edges',
            title: text.edgesTitle,
            columns: [
                { key: 'edge', label: shared.columns.edge },
                { key: 'weight', label: shared.columns.weight },
                { key: 'decision', label: shared.columns.decision },
            ],
            rows: ordered.map((edge, index) => ({
                key: edge.id,
                emphasis:
                    index === examinedIndex
                        ? 'active'
                        : accepted.includes(edge.id)
                          ? 'done'
                          : rejected.includes(edge.id)
                            ? 'reject'
                            : undefined,
                cells: {
                    edge: `{${labels.get(edge.source)}, ${labels.get(edge.target)}}`,
                    weight: formatWeight(weightOf(edge)),
                    decision: accepted.includes(edge.id)
                        ? text.decisions.accepted
                        : rejected.includes(edge.id)
                          ? text.decisions.rejected
                          : index === examinedIndex
                            ? text.decisions.examining
                            : text.decisions.waiting,
                },
            })),
        });

        const setsTable = (): TraceTable => {
            const groups = new Map<NodeId, string[]>();
            sortedNodes(graph).forEach((node) => {
                const root = find(node.id);
                const bucket = groups.get(root) ?? [];
                bucket.push(node.label);
                groups.set(root, bucket);
            });
            return {
                id: 'kruskal-sets',
                title: text.setsTitle,
                columns: [
                    { key: 'setName', label: shared.columns.component },
                    { key: 'members', label: shared.columns.vertices },
                ],
                rows: [...groups.values()].map((members, index) => ({
                    key: `set-${index}`,
                    cells: { setName: `T${index + 1}`, members: members.join(', ') },
                })),
            };
        };

        const metrics = () => [
            {
                label: shared.spanningTree.edgesMetric,
                value: `${accepted.length} / ${Math.max(graph.nodes.length - 1, 0)}`,
            },
            { label: shared.spanningTree.totalWeightMetric, value: formatWeight(totalWeight) },
        ];

        applyGroups();
        builder.commit({
            title: shared.initialization,
            description: text.initDescription(ordered.length),
            tables: [edgeQueueTable(), setsTable()],
            metrics: metrics(),
        });

        const target = Math.max(graph.nodes.length - 1, 0);
        let iterationsUsed = 0;

        for (const [index, edge] of ordered.entries()) {
            if (accepted.length >= target) break;
            iterationsUsed = index + 1;
            examinedIndex = index;
            builder.resetEdgesWithState('active', 'idle');
            builder.setEdge(edge.id, 'active');
            builder.setNode(edge.source, 'frontier');
            builder.setNode(edge.target, 'frontier');

            const rootSource = find(edge.source);
            const rootTarget = find(edge.target);
            const createsCycle = rootSource === rootTarget;

            builder.commit({
                title: text.examineTitle(
                    `{${labels.get(edge.source)}, ${labels.get(edge.target)}}`,
                    formatWeight(weightOf(edge))
                ),
                description: createsCycle ? text.cycleDescription : text.noCycleDescription,
                tables: [edgeQueueTable(), setsTable()],
                metrics: metrics(),
            });

            if (createsCycle) {
                rejected.push(edge.id);
                builder.setEdge(edge.id, 'reject');
            } else {
                union(edge.source, edge.target);
                accepted.push(edge.id);
                totalWeight += weightOf(edge);
                builder.setEdge(edge.id, 'done');
                builder.setNode(edge.source, 'done');
                builder.setNode(edge.target, 'done');
                applyGroups();
            }

            builder.commit({
                title: createsCycle ? text.rejectedTitle : text.acceptedTitle,
                description: createsCycle
                    ? text.rejectedDescription
                    : text.acceptedDescription(
                          labels.get(edge.source) ?? '',
                          labels.get(edge.target) ?? ''
                      ),
                tables: [edgeQueueTable(), setsTable()],
                metrics: metrics(),
            });
        }

        examinedIndex = -1;
        builder.resetEdgesWithState('active', 'idle');
        builder.setNodes(
            graph.nodes.map((node) => node.id),
            'done'
        );
        const componentCount = applyGroups();

        builder.commit({
            title: text.completeTitle,
            description:
                accepted.length >= target
                    ? text.completeDescription(target, formatWeight(totalWeight))
                    : text.incompleteDescription(target, formatWeight(totalWeight)),
            tables: [edgeQueueTable(), setsTable()],
            metrics: metrics(),
        });

        return builder.build([
            text.weightConclusion(formatWeight(totalWeight), accepted.length, rejected.length),
            text.iterationsConclusion(iterationsUsed, accepted.length),
            componentCount === 1 ? text.treeConclusion : text.forestConclusion(componentCount),
        ]);
    },
};
