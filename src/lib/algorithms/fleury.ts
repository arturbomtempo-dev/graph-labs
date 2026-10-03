import { getDictionary } from '@/i18n/dictionaries';
import {
    hasDirectedEdges,
    nodeLabelMap,
    orderComparator,
    orderedNodes,
    weightOf,
} from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, GraphEdge, NodeId, TraceTable } from '../graph/types';
import { requireEdges, requireNodes, traceText } from './shared';

function degreeOf(edges: GraphEdge[], node: NodeId): number {
    return edges.reduce((total, edge) => {
        if (edge.source === node && edge.target === node) return total + 2;
        if (edge.source === node || edge.target === node) return total + 1;
        return total;
    }, 0);
}

function otherEnd(edge: GraphEdge, node: NodeId): NodeId {
    return edge.source === node ? edge.target : edge.source;
}

function reachable(edges: GraphEdge[], from: NodeId): Set<NodeId> {
    const seen = new Set<NodeId>([from]);
    const stack = [from];
    while (stack.length > 0) {
        const current = stack.pop() as NodeId;
        edges.forEach((edge) => {
            if (edge.source !== current && edge.target !== current) return;
            const next = otherEnd(edge, current);
            if (seen.has(next)) return;
            seen.add(next);
            stack.push(next);
        });
    }
    return seen;
}

function isBridge(edges: GraphEdge[], edge: GraphEdge, from: NodeId): boolean {
    const remaining = edges.filter((candidate) => candidate.id !== edge.id);
    const target = otherEnd(edge, from);
    return !reachable(remaining, from).has(target);
}

export const fleury: AlgorithmDefinition = {
    id: 'fleury',
    category: 'eulerian',
    needsStart: false,
    needsEnd: false,
    validate: (context) => {
        const errors = [...requireNodes(context), ...requireEdges(context)];
        const { graph, startId } = context;
        const issues = getDictionary(context.locale).algorithms.fleury.issues;

        if (hasDirectedEdges(graph)) {
            errors.push(issues.undirectedOnly);
            return errors;
        }

        const odd = graph.nodes.filter((node) => degreeOf(graph.edges, node.id) % 2 === 1);
        if (odd.length > 2) {
            errors.push(issues.tooManyOdd(odd.map((node) => node.label)));
        }

        const withEdges = graph.nodes.filter((node) => degreeOf(graph.edges, node.id) > 0);
        if (withEdges.length > 0) {
            const seen = reachable(graph.edges, withEdges[0].id);
            if (withEdges.some((node) => !seen.has(node.id))) {
                errors.push(issues.disconnected);
            }
        }

        if (startId && odd.length > 0 && !odd.some((node) => node.id === startId)) {
            errors.push(issues.mustStartAtOdd(odd.map((node) => node.label)));
        }

        return errors;
    },
    run: ({ graph, startId, order, locale }) => {
        const shared = traceText(locale);
        const text = getDictionary(locale).algorithms.fleury.trace;
        const builder = createTraceBuilder(graph);
        const labels = nodeLabelMap(graph);
        const ordered = orderedNodes(graph, order);
        const compare = orderComparator(graph, order);

        const odd = ordered.filter((node) => degreeOf(graph.edges, node.id) % 2 === 1);
        const withEdges = ordered.filter((node) => degreeOf(graph.edges, node.id) > 0);
        const isEulerian = odd.length === 0;

        const start =
            startId && withEdges.some((node) => node.id === startId)
                ? startId
                : (odd[0]?.id ?? withEdges[0]?.id ?? ordered[0].id);

        let available = [...graph.edges];
        const trail: NodeId[] = [start];
        const usedEdges: string[] = [];
        let current = start;

        const remainingTable = (highlight?: string): TraceTable => ({
            id: 'fleury-edges',
            title: text.remainingTitle,
            columns: [
                { key: 'edge', label: shared.columns.edge },
                { key: 'status', label: shared.columns.status },
            ],
            rows: graph.edges.map((edge) => ({
                key: edge.id,
                emphasis:
                    edge.id === highlight
                        ? 'active'
                        : usedEdges.includes(edge.id)
                          ? 'done'
                          : undefined,
                cells: {
                    edge: `{${labels.get(edge.source)}, ${labels.get(edge.target)}}`,
                    status: usedEdges.includes(edge.id)
                        ? text.traversedStatus(usedEdges.indexOf(edge.id) + 1)
                        : text.pendingStatus,
                },
            })),
        });

        const degreeTable = (): TraceTable => ({
            id: 'fleury-degrees',
            title: text.degreesTitle,
            columns: [
                { key: 'vertex', label: shared.columns.vertex },
                { key: 'degree', label: text.degreeInRemaining },
                { key: 'original', label: text.degreeInOriginal },
            ],
            rows: ordered.map((node) => ({
                key: node.id,
                emphasis: node.id === current ? 'active' : undefined,
                cells: {
                    vertex: node.label,
                    degree: String(degreeOf(available, node.id)),
                    original: String(degreeOf(graph.edges, node.id)),
                },
            })),
        });

        const trailMetric = () => ({
            label: text.trailLabel,
            value: trail.map((id) => labels.get(id)).join(' / '),
        });

        const snapshot = (highlight?: string) => ({
            tables: [remainingTable(highlight), degreeTable()],
            metrics: [
                trailMetric(),
                { label: text.remainingTitle, value: String(available.length) },
            ],
        });

        builder.setNode(start, 'active');
        builder.setNodeBadge(start, text.startBadge);

        builder.commit({
            title: text.initTitle(labels.get(start) ?? ''),
            description: isEulerian
                ? text.initEulerian(labels.get(start) ?? '')
                : text.initSemiEulerian(
                      odd.map((node) => node.label),
                      labels.get(start) ?? ''
                  ),
            ...snapshot(),
        });

        while (available.length > 0) {
            const incident = available
                .filter((edge) => edge.source === current || edge.target === current)
                .sort((a, b) => {
                    const byOrder = compare(otherEnd(a, current), otherEnd(b, current));
                    return byOrder !== 0 ? byOrder : weightOf(a) - weightOf(b);
                });

            if (incident.length === 0) break;

            let chosen: GraphEdge;
            let reason: string;

            if (incident.length === 1) {
                chosen = incident[0];
                reason = text.onlyEdgeReason(labels.get(current) ?? '');
            } else {
                const bridges = incident.filter((edge) => isBridge(available, edge, current));
                const safe = incident.find((edge) => !bridges.includes(edge));
                chosen = safe ?? incident[0];
                const bridgeLabels = bridges.map(
                    (edge) => `{${labels.get(current)}, ${labels.get(otherEnd(edge, current))}}`
                );
                const chosenLabel = `{${labels.get(current)}, ${labels.get(otherEnd(chosen, current))}}`;
                reason = safe
                    ? bridges.length > 0
                        ? text.avoidBridgesReason(incident.length, bridgeLabels, chosenLabel)
                        : text.noBridgesReason(incident.length, chosenLabel)
                    : text.allBridgesReason;
            }

            const next = otherEnd(chosen, current);
            builder.setEdge(chosen.id, 'active');
            builder.commit({
                title: text.analyzeTitle(labels.get(current) ?? ''),
                description: reason,
                ...snapshot(chosen.id),
            });

            available = available.filter((edge) => edge.id !== chosen.id);
            usedEdges.push(chosen.id);
            trail.push(next);
            builder.setEdge(chosen.id, 'done');
            builder.setEdgeBadge(chosen.id, String(usedEdges.length));
            builder.setNode(current, 'done');
            builder.setNode(next, 'active');
            current = next;

            builder.commit({
                title: text.walkTitle(labels.get(next) ?? ''),
                description: text.walkDescription(labels.get(next) ?? '', available.length),
                ...snapshot(),
            });
        }

        builder.setNode(current, 'done');
        builder.setNodeBadge(current, text.endBadge);

        const closed = trail[0] === trail[trail.length - 1];
        const complete = usedEdges.length === graph.edges.length;
        const trailText = trail.map((id) => labels.get(id)).join(' / ');

        builder.commit({
            title: complete
                ? closed
                    ? text.circuitTitle
                    : text.trailTitle
                : text.interruptedTitle,
            description: complete
                ? text.completeDescription(graph.edges.length)
                : text.interruptedDescription(available.length),
            ...snapshot(),
        });

        const conclusions = [
            text.trailConclusion(closed, trailText),
            text.countConclusion(usedEdges.length, graph.edges.length),
            isEulerian
                ? text.eulerianConclusion
                : text.semiEulerianConclusion(odd.map((node) => node.label)),
        ];

        return builder.build(conclusions);
    },
};
