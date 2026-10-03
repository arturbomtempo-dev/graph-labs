import { getDictionary } from '@/i18n/dictionaries';
import { buildAdjacency, nodeLabelMap, orderedNodes, sortedNodes } from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId, TraceRow, TraceTable } from '../graph/types';
import { labelOf, requireNodes, requireStart, traceText } from './shared';

type EdgeKind = 'tree' | 'uncle' | 'sibling' | 'cousin';

export const breadthFirstSearch: AlgorithmDefinition = {
    id: 'bfs',
    category: 'search',
    needsStart: true,
    needsEnd: false,
    validate: (context) => [...requireNodes(context), ...requireStart(context)],
    run: ({ graph, startId, order, locale }) => {
        const shared = traceText(locale);
        const text = getDictionary(locale).algorithms.bfs.trace;
        const builder = createTraceBuilder(graph);
        const adjacency = buildAdjacency(graph, order);
        const labels = nodeLabelMap(graph);
        const root = startId as NodeId;

        const index = new Map<NodeId, number>();
        const level = new Map<NodeId, number>();
        const parent = new Map<NodeId, NodeId | null>();
        const classification = new Map<string, EdgeKind>();
        graph.nodes.forEach((node) => {
            index.set(node.id, 0);
            level.set(node.id, 0);
            parent.set(node.id, null);
        });

        const queue: NodeId[] = [];
        const visitOrder: string[] = [];
        let time = 0;

        const marked = (id: NodeId) => (index.get(id) ?? 0) > 0;

        const attributesTable = (highlight?: NodeId): TraceTable => {
            const rows: TraceRow[] = sortedNodes(graph).map((node) => ({
                key: node.id,
                emphasis:
                    node.id === highlight
                        ? 'active'
                        : builder.nodeState(node.id) === 'done'
                          ? 'done'
                          : undefined,
                cells: {
                    vertex: node.label,
                    index: marked(node.id) ? String(index.get(node.id)) : '0',
                    level: marked(node.id) ? String(level.get(node.id)) : '-',
                    parent: labels.get(parent.get(node.id) ?? '') ?? '-',
                },
            }));
            return {
                id: 'bfs-attributes',
                title: text.attributesTitle,
                columns: [
                    { key: 'vertex', label: shared.columns.vertex },
                    { key: 'index', label: 'L' },
                    { key: 'level', label: text.levelColumn },
                    { key: 'parent', label: shared.columns.parent },
                ],
                rows,
            };
        };

        const edgesTable = (): TraceTable => ({
            id: 'bfs-edges',
            title: shared.edgeClassification,
            columns: [
                { key: 'edge', label: shared.columns.edge },
                { key: 'kind', label: shared.columns.type },
            ],
            rows: graph.edges
                .filter((edge) => classification.has(edge.id))
                .map((edge) => ({
                    key: edge.id,
                    emphasis: classification.get(edge.id) === 'tree' ? 'done' : undefined,
                    cells: {
                        edge: edge.directed
                            ? `(${labels.get(edge.source)}, ${labels.get(edge.target)})`
                            : `{${labels.get(edge.source)}, ${labels.get(edge.target)}}`,
                        kind: text.edgeKinds[classification.get(edge.id) as EdgeKind],
                    },
                })),
        });

        const queueList = () => ({
            id: 'queue',
            title: shared.queue,
            variant: 'queue' as const,
            items: queue.map((id) => labels.get(id) ?? ''),
        });

        const snapshot = (highlight?: NodeId) => ({
            tables: [attributesTable(highlight), edgesTable()],
            lists: [queueList()],
        });

        builder.commit({
            title: shared.initialization,
            description: text.initDescription,
            ...snapshot(),
        });

        const startSearch = (source: NodeId, isRoot: boolean) => {
            time += 1;
            index.set(source, time);
            level.set(source, 0);
            queue.push(source);
            builder.setNode(source, 'frontier');
            builder.setNodeBadge(source, text.levelBadge(0));

            builder.commit({
                title: isRoot
                    ? text.rootTitle(labelOf(graph, source))
                    : text.newRootTitle(labelOf(graph, source)),
                description: isRoot
                    ? text.rootDescription(labelOf(graph, source), time)
                    : text.newRootDescription(labelOf(graph, source)),
                ...snapshot(source),
            });

            while (queue.length > 0) {
                const current = queue.shift() as NodeId;
                builder.resetEdgesWithState('active', 'idle');
                builder.setNode(current, 'active');
                visitOrder.push(labels.get(current) ?? '');

                builder.commit({
                    title: text.dequeueTitle(labelOf(graph, current)),
                    description: text.dequeueDescription(
                        labelOf(graph, current),
                        level.get(current) ?? 0
                    ),
                    ...snapshot(current),
                    metrics: [{ label: shared.visitOrder, value: visitOrder.join(' → ') }],
                });

                for (const entry of adjacency.get(current) ?? []) {
                    const neighbour = entry.to;

                    if (!marked(neighbour)) {
                        parent.set(neighbour, current);
                        level.set(neighbour, (level.get(current) ?? 0) + 1);
                        time += 1;
                        index.set(neighbour, time);
                        queue.push(neighbour);
                        classification.set(entry.edge.id, 'tree');
                        builder.setNode(neighbour, 'frontier');
                        builder.setNodeBadge(neighbour, text.levelBadge(level.get(neighbour) ?? 0));
                        builder.setEdge(entry.edge.id, 'done');

                        builder.commit({
                            title: text.treeEdgeTitle(
                                labelOf(graph, current),
                                labelOf(graph, neighbour)
                            ),
                            description: text.treeEdgeDescription(
                                labelOf(graph, current),
                                labelOf(graph, neighbour),
                                level.get(neighbour) ?? 0,
                                time
                            ),
                            ...snapshot(neighbour),
                        });
                        continue;
                    }

                    if (classification.has(entry.edge.id)) continue;

                    const currentLevel = level.get(current) ?? 0;
                    const neighbourLevel = level.get(neighbour) ?? 0;
                    const sameParent = parent.get(current) === parent.get(neighbour);
                    const laterIndex = (index.get(neighbour) ?? 0) > (index.get(current) ?? 0);

                    let kind: Exclude<EdgeKind, 'tree'> | null = null;
                    if (neighbourLevel === currentLevel + 1) {
                        kind = 'uncle';
                    } else if (neighbourLevel === currentLevel && laterIndex) {
                        kind = sameParent ? 'sibling' : 'cousin';
                    }

                    if (!kind) continue;

                    classification.set(entry.edge.id, kind);
                    builder.setEdge(entry.edge.id, kind === 'uncle' ? 'frontier' : 'reject');

                    const reason =
                        kind === 'uncle'
                            ? text.uncleReason(labelOf(graph, current), labelOf(graph, neighbour))
                            : text.sameLevelReason(
                                  labelOf(graph, current),
                                  labelOf(graph, neighbour),
                                  sameParent
                              );

                    builder.commit({
                        title: text.classifiedTitle(kind),
                        description: text.classifiedDescription(
                            labelOf(graph, current),
                            labelOf(graph, neighbour),
                            reason,
                            kind
                        ),
                        ...snapshot(neighbour),
                    });
                }

                builder.setNode(current, 'done');
                builder.commit({
                    title: text.exploredTitle(labelOf(graph, current)),
                    description: text.exploredDescription(labelOf(graph, current)),
                    ...snapshot(),
                });
            }
        };

        startSearch(root, true);

        orderedNodes(graph, order)
            .filter((node) => !marked(node.id))
            .forEach((node) => startSearch(node.id, false));

        builder.resetEdgesWithState('active', 'idle');

        const treeEdges = graph.edges.filter((edge) => classification.get(edge.id) === 'tree');
        const reachable = graph.nodes.filter(
            (node) => node.id === root || parent.get(node.id) !== null
        );
        const unreachable = graph.nodes.filter(
            (node) => node.id !== root && parent.get(node.id) === null
        );

        builder.commit({
            title: shared.searchComplete,
            description:
                unreachable.length > 0
                    ? text.completeWithUnreachable(unreachable.length)
                    : text.completeAll,
            ...snapshot(),
            metrics: [{ label: shared.visitOrder, value: visitOrder.join(' → ') }],
        });

        const conclusions = [
            text.visitOrderConclusion(visitOrder.join(' → ')),
            text.treeConclusion(treeEdges.length),
        ];
        if (unreachable.length > 0) {
            conclusions.push(
                text.unreachableConclusion(
                    labelOf(graph, root),
                    unreachable.map((node) => node.label).join(', ')
                )
            );
        } else if (reachable.length === graph.nodes.length) {
            conclusions.push(text.singleTreeConclusion);
        }

        return builder.build(conclusions);
    },
};
