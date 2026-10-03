import { getDictionary } from '@/i18n/dictionaries';
import { buildAdjacency, nodeLabelMap, orderedNodes, sortedNodes } from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId, TraceRow, TraceTable } from '../graph/types';
import { labelOf, requireNodes, requireStart, traceText } from './shared';

type Color = 'white' | 'gray' | 'black';
type EdgeKind = 'tree' | 'back' | 'forward' | 'cross';

const pairOf = (directed: boolean, from: string, to: string) =>
    directed ? `(${from}, ${to})` : `{${from}, ${to}}`;

export const depthFirstSearch: AlgorithmDefinition = {
    id: 'dfs',
    category: 'search',
    needsStart: true,
    needsEnd: false,
    validate: (context) => [...requireNodes(context), ...requireStart(context)],
    run: ({ graph, startId, order, locale }) => {
        const shared = traceText(locale);
        const text = getDictionary(locale).algorithms.dfs.trace;
        const builder = createTraceBuilder(graph);
        const adjacency = buildAdjacency(graph, order);
        const labels = nodeLabelMap(graph);

        const color = new Map<NodeId, Color>();
        const discovery = new Map<NodeId, number>();
        const finish = new Map<NodeId, number>();
        const parent = new Map<NodeId, NodeId | null>();
        const classification = new Map<string, EdgeKind>();
        const recursionStack: NodeId[] = [];
        const visitOrder: string[] = [];
        let time = 0;

        graph.nodes.forEach((node) => {
            color.set(node.id, 'white');
            parent.set(node.id, null);
        });

        const timesTable = (highlight?: NodeId): TraceTable => {
            const rows: TraceRow[] = sortedNodes(graph).map((node) => ({
                key: node.id,
                emphasis:
                    node.id === highlight
                        ? 'active'
                        : color.get(node.id) === 'black'
                          ? 'done'
                          : undefined,
                cells: {
                    vertex: node.label,
                    discovery: String(discovery.get(node.id) ?? 0),
                    finish: String(finish.get(node.id) ?? 0),
                    parent: labels.get(parent.get(node.id) ?? '') ?? '-',
                },
            }));
            return {
                id: 'dfs-times',
                title: text.timesTitle,
                columns: [
                    { key: 'vertex', label: shared.columns.vertex },
                    { key: 'discovery', label: text.discoveryColumn },
                    { key: 'finish', label: text.finishColumn },
                    { key: 'parent', label: shared.columns.parent },
                ],
                rows,
            };
        };

        const edgesTable = (): TraceTable => ({
            id: 'dfs-edges',
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

        const stackList = () => ({
            id: 'stack',
            title: text.stackTitle,
            variant: 'stack' as const,
            items: recursionStack.map((id) => labels.get(id) ?? ''),
        });

        const snapshot = (highlight?: NodeId) => ({
            tables: [timesTable(highlight), edgesTable()],
            lists: [stackList()],
            metrics: [{ label: shared.visitOrder, value: visitOrder.join(' → ') || '-' }],
        });

        builder.commit({
            title: shared.initialization,
            description: text.initDescription,
            ...snapshot(),
        });

        const visit = (current: NodeId, arrivalEdgeId: string | null) => {
            time += 1;
            discovery.set(current, time);
            color.set(current, 'gray');
            recursionStack.push(current);
            visitOrder.push(labels.get(current) ?? '');
            builder.setNode(current, 'active');
            builder.setNodeBadge(current, `${time}/…`);

            builder.commit({
                title: text.discoverTitle(labelOf(graph, current)),
                description: text.discoverDescription(labelOf(graph, current), time),
                ...snapshot(current),
            });

            const neighbours = adjacency.get(current) ?? [];
            for (const entry of neighbours) {
                if (!entry.edge.directed && entry.edge.id === arrivalEdgeId) continue;

                const neighbourColor = color.get(entry.to) ?? 'white';

                if (neighbourColor === 'white') {
                    parent.set(entry.to, current);
                    classification.set(entry.edge.id, 'tree');
                    builder.setEdge(entry.edge.id, 'done');
                    builder.commit({
                        title: text.treeEdgeTitle(
                            pairOf(
                                entry.edge.directed,
                                labelOf(graph, current),
                                labelOf(graph, entry.to)
                            )
                        ),
                        description: text.treeEdgeDescription(
                            labelOf(graph, current),
                            labelOf(graph, entry.to)
                        ),
                        ...snapshot(entry.to),
                    });
                    visit(entry.to, entry.edge.id);
                    builder.setNode(current, 'active');
                    builder.commit({
                        title: text.returnTitle(labelOf(graph, current)),
                        description: text.returnDescription(labelOf(graph, current)),
                        ...snapshot(current),
                    });
                    continue;
                }

                if (!classification.has(entry.edge.id)) {
                    if (!entry.edge.directed && neighbourColor === 'black') continue;

                    const kind: Exclude<EdgeKind, 'tree'> = !entry.edge.directed
                        ? 'back'
                        : neighbourColor === 'gray'
                          ? 'back'
                          : (discovery.get(current) ?? 0) < (discovery.get(entry.to) ?? 0)
                            ? 'forward'
                            : 'cross';
                    classification.set(entry.edge.id, kind);
                    builder.setEdge(entry.edge.id, kind === 'back' ? 'reject' : 'frontier');

                    const pair = pairOf(
                        entry.edge.directed,
                        labelOf(graph, current),
                        labelOf(graph, entry.to)
                    );
                    const from = labelOf(graph, current);
                    const to = labelOf(graph, entry.to);
                    const reason = entry.edge.directed
                        ? kind === 'back'
                            ? text.backReasonDirected(from, to)
                            : kind === 'forward'
                              ? text.forwardReason(from, to)
                              : text.crossReason(from, to)
                        : text.backReasonUndirected(from, to);

                    builder.commit({
                        title: text.classifiedTitle(kind),
                        description: text.classifiedDescription(reason, pair, kind),
                        ...snapshot(entry.to),
                    });
                }
            }

            color.set(current, 'black');
            time += 1;
            finish.set(current, time);
            recursionStack.pop();
            builder.setNode(current, 'done');
            builder.setNodeBadge(current, `${discovery.get(current)}/${time}`);

            builder.commit({
                title: text.exploredTitle(labelOf(graph, current)),
                description: text.exploredDescription(
                    labelOf(graph, current),
                    discovery.get(current) ?? 0,
                    time
                ),
                ...snapshot(),
            });
        };

        visit(startId as NodeId, null);

        const remaining = orderedNodes(graph, order).filter(
            (node) => color.get(node.id) === 'white'
        );
        remaining.forEach((node) => {
            builder.commit({
                title: text.newRootTitle(node.label),
                description: text.newRootDescription(node.label),
                ...snapshot(node.id),
            });
            visit(node.id, null);
        });

        const treeEdges = graph.edges.filter((edge) => classification.get(edge.id) === 'tree');
        const backEdges = graph.edges.filter((edge) => classification.get(edge.id) === 'back');

        builder.commit({
            title: shared.searchComplete,
            description: text.completeDescription(treeEdges.length),
            ...snapshot(),
        });

        return builder.build([
            text.visitOrderConclusion(visitOrder.join(' → ')),
            text.countsConclusion(treeEdges.length, backEdges.length),
            backEdges.length > 0 ? text.cycleConclusion : text.acyclicConclusion,
            text.intervalsConclusion,
        ]);
    },
};
