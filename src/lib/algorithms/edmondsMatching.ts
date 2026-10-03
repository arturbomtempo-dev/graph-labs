import { getDictionary } from '@/i18n/dictionaries';
import { hasDirectedEdges, nodeLabelMap, orderedNodes } from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId, TraceTable } from '../graph/types';
import { requireEdges, requireNodes, traceText } from './shared';

export const edmondsMatching: AlgorithmDefinition = {
    id: 'edmonds',
    category: 'matching',
    needsStart: false,
    needsEnd: false,
    validate: (context) => {
        const errors = [...requireNodes(context), ...requireEdges(context)];
        if (hasDirectedEdges(context.graph)) {
            errors.push(getDictionary(context.locale).algorithms.edmonds.issues.undirectedOnly);
        }
        return errors;
    },
    run: ({ graph, order, locale }) => {
        const shared = traceText(locale);
        const text = getDictionary(locale).algorithms.edmonds.trace;
        const builder = createTraceBuilder(graph);
        const labels = nodeLabelMap(graph);
        const nodes = orderedNodes(graph, order);
        const size = nodes.length;
        const indexOf = new Map<NodeId, number>(nodes.map((node, position) => [node.id, position]));
        const name = (i: number) => labels.get(nodes[i].id) ?? '';

        const adjacency: number[][] = nodes.map(() => []);
        graph.edges.forEach((edge) => {
            const a = indexOf.get(edge.source);
            const b = indexOf.get(edge.target);
            if (a === undefined || b === undefined || a === b) return;
            if (!adjacency[a].includes(b)) adjacency[a].push(b);
            if (!adjacency[b].includes(a)) adjacency[b].push(a);
        });
        adjacency.forEach((list) => list.sort((x, y) => x - y));

        const edgeBetween = (a: number, b: number) =>
            graph.edges.find(
                (edge) =>
                    (indexOf.get(edge.source) === a && indexOf.get(edge.target) === b) ||
                    (indexOf.get(edge.source) === b && indexOf.get(edge.target) === a)
            );

        const match = new Array<number>(size).fill(-1);

        const parent = new Array<number>(size).fill(-1);
        const base = new Array<number>(size).fill(0);

        const matchingTable = (): TraceTable => ({
            id: 'edmonds-matching',
            title: text.matchingTitle,
            columns: [
                { key: 'vertex', label: shared.columns.vertex },
                { key: 'partner', label: text.partnerColumn },
                { key: 'status', label: shared.columns.status },
            ],
            rows: nodes.map((node, i) => ({
                key: node.id,
                emphasis: match[i] !== -1 ? 'done' : undefined,
                cells: {
                    vertex: node.label,
                    partner: match[i] === -1 ? '-' : name(match[i]),
                    status: match[i] === -1 ? text.exposedStatus : text.coveredStatus,
                },
            })),
        });

        const paint = () => {
            let pair = 0;
            const seen = new Set<number>();
            builder.clearNodeGroups();
            graph.edges.forEach((edge) => builder.setEdge(edge.id, 'idle'));
            nodes.forEach((node, i) => {
                if (match[i] === -1) {
                    builder.setNode(node.id, 'idle');
                    builder.setNodeBadge(node.id, text.exposedStatus);
                    return;
                }
                builder.setNode(node.id, 'done');
                builder.setNodeBadge(node.id, name(match[i]));
                if (seen.has(i)) return;
                seen.add(i);
                seen.add(match[i]);
                builder.setNodeGroup(node.id, pair);
                builder.setNodeGroup(nodes[match[i]].id, pair);
                const edge = edgeBetween(i, match[i]);
                if (edge) builder.setEdge(edge.id, 'done');
                pair += 1;
            });
        };

        const exposedCount = () => match.filter((value) => value === -1).length;

        const metrics = () => [
            { label: '|M|', value: String(match.filter((value) => value !== -1).length / 2) },
            { label: text.exposedMetric, value: String(exposedCount()) },
        ];

        paint();
        builder.commit({
            title: text.initTitle,
            description: text.initDescription,
            tables: [matchingTable()],
            metrics: metrics(),
        });

        const lowestCommonBase = (a: number, b: number): number => {
            const visited = new Array<boolean>(size).fill(false);
            let cursor = a;
            for (;;) {
                cursor = base[cursor];
                visited[cursor] = true;
                if (match[cursor] === -1) break;
                cursor = parent[match[cursor]];
            }
            cursor = b;
            for (;;) {
                cursor = base[cursor];
                if (visited[cursor]) return cursor;
                cursor = parent[match[cursor]];
            }
        };

        const markPath = (from: number, blossomBase: number, child: number, mark: boolean[]) => {
            let v = from;
            let next = child;
            while (base[v] !== blossomBase) {
                mark[base[v]] = true;
                mark[base[match[v]]] = true;
                parent[v] = next;
                next = match[v];
                v = parent[match[v]];
            }
        };

        const findAugmentingPath = (root: number): number => {
            const even = new Array<boolean>(size).fill(false);
            parent.fill(-1);
            for (let i = 0; i < size; i += 1) base[i] = i;

            even[root] = true;
            const queue: number[] = [root];
            let head = 0;

            while (head < queue.length) {
                const v = queue[head];
                head += 1;

                for (const to of adjacency[v]) {
                    if (base[v] === base[to] || match[v] === to) continue;

                    const closesBlossom =
                        to === root || (match[to] !== -1 && parent[match[to]] !== -1);

                    if (closesBlossom) {
                        const blossomBase = lowestCommonBase(v, to);
                        const mark = new Array<boolean>(size).fill(false);
                        markPath(v, blossomBase, to, mark);
                        markPath(to, blossomBase, v, mark);

                        const contracted: number[] = [];
                        for (let i = 0; i < size; i += 1) {
                            if (!mark[base[i]]) continue;
                            base[i] = blossomBase;
                            contracted.push(i);
                            if (!even[i]) {
                                even[i] = true;
                                queue.push(i);
                            }
                        }

                        if (contracted.length > 0) {
                            const edge = edgeBetween(v, to);
                            if (edge) builder.setEdge(edge.id, 'reject');
                            contracted.forEach((i) => {
                                builder.setNode(nodes[i].id, 'reject');
                                builder.setNodeBadge(
                                    nodes[i].id,
                                    text.blossomBadge(name(blossomBase))
                                );
                            });

                            builder.commit({
                                title: text.blossomTitle(name(blossomBase)),
                                description: text.blossomDescription(
                                    `{${name(v)}, ${name(to)}}`,
                                    contracted.map((i) => name(i)).join(', '),
                                    name(blossomBase)
                                ),
                                tables: [matchingTable()],
                                metrics: metrics(),
                            });
                        }
                        continue;
                    }

                    if (parent[to] !== -1) continue;

                    parent[to] = v;

                    if (match[to] === -1) {
                        const edge = edgeBetween(v, to);
                        if (edge) builder.setEdge(edge.id, 'active');
                        builder.setNode(nodes[to].id, 'path');
                        builder.commit({
                            title: text.augmentingTitle(name(to)),
                            description: text.augmentingDescription(name(to), name(root)),
                            tables: [matchingTable()],
                            metrics: metrics(),
                        });
                        return to;
                    }

                    const partner = match[to];
                    even[partner] = true;
                    queue.push(partner);

                    const treeEdge = edgeBetween(v, to);
                    if (treeEdge) builder.setEdge(treeEdge.id, 'frontier');
                    builder.setNode(nodes[to].id, 'frontier');
                    builder.setNode(nodes[partner].id, 'active');

                    builder.commit({
                        title: text.growTitle(name(v), name(to), name(partner)),
                        description: text.growDescription(name(v), name(to), name(partner)),
                        tables: [matchingTable()],
                        metrics: metrics(),
                    });
                }
            }

            return -1;
        };

        const augment = (endpoint: number): string[] => {
            const changed: string[] = [];
            let v = endpoint;
            while (v !== -1) {
                const pv = parent[v];
                const ppv = match[pv];
                match[v] = pv;
                match[pv] = v;
                changed.push(`{${name(v)}, ${name(pv)}}`);
                v = ppv;
            }
            return changed.reverse();
        };

        let augmentations = 0;

        for (let root = 0; root < size; root += 1) {
            if (match[root] !== -1) continue;

            paint();
            builder.setNode(nodes[root].id, 'active');
            builder.setNodeBadge(nodes[root].id, text.rootBadge);
            builder.commit({
                title: text.treeTitle(name(root)),
                description: text.treeDescription(name(root)),
                tables: [matchingTable()],
                metrics: metrics(),
            });

            const endpoint = findAugmentingPath(root);

            if (endpoint === -1) {
                paint();
                builder.commit({
                    title: text.noPathTitle(name(root)),
                    description: text.noPathDescription(name(root)),
                    tables: [matchingTable()],
                    metrics: metrics(),
                });
                continue;
            }

            const changed = augment(endpoint);
            augmentations += 1;
            paint();

            builder.commit({
                title: text.augmentTitle(match.filter((value) => value !== -1).length / 2),
                description: text.augmentDescription(
                    changed.join(', '),
                    name(root),
                    name(endpoint)
                ),
                tables: [matchingTable()],
                metrics: metrics(),
            });
        }

        paint();
        const matchedPairs = match.filter((value) => value !== -1).length / 2;
        const exposed = nodes.filter((_, i) => match[i] === -1);

        builder.commit({
            title: text.maximumTitle,
            description: text.maximumDescription(matchedPairs),
            tables: [matchingTable()],
            metrics: metrics(),
        });

        const pairs: string[] = [];
        const seen = new Set<number>();
        nodes.forEach((_, i) => {
            if (match[i] === -1 || seen.has(i)) return;
            seen.add(i);
            seen.add(match[i]);
            pairs.push(`{${name(i)}, ${name(match[i])}}`);
        });

        return builder.build([
            text.matchingConclusion(matchedPairs, pairs.join(', ') || '-'),
            text.augmentationsConclusion(augmentations),
            exposed.length === 0
                ? text.perfectConclusion
                : text.exposedConclusion(
                      exposed.length,
                      exposed.map((node) => node.label).join(', ')
                  ),
        ]);
    },
};
