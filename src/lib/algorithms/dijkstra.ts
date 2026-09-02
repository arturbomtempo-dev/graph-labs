import {
    buildAdjacency,
    formatDistance,
    formatWeight,
    hasNegativeWeights,
    nodeLabelMap,
    sortedNodes,
} from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId } from '../graph/types';
import {
    distanceTable,
    edgesAlongPath,
    labelOf,
    pathFromParents,
    requireEdges,
    requireNodes,
    requireStart,
} from './shared';

export const dijkstra: AlgorithmDefinition = {
    id: 'dijkstra',
    name: 'Método de Dijkstra',
    shortName: 'Dijkstra',
    category: 'Caminho mínimo',
    tagline:
        '"Fecha" um vértice por iteração — sempre o de menor dist — e relaxa as arestas tensas que saem dele.',
    complexity: 'O(n²)',
    needsStart: true,
    needsEnd: false,
    constraints: [
        'Aceita arestas direcionadas e não direcionadas',
        'Exige custos não negativos',
        'Baseia-se no princípio da relaxação',
    ],
    validate: (context) => {
        const errors = [
            ...requireNodes(context),
            ...requireEdges(context),
            ...requireStart(context),
        ];
        if (hasNegativeWeights(context.graph)) {
            errors.push(
                'O método de Dijkstra falha com arestas de custo negativo: use Bellman-Ford. Reponderar, adicionando uma constante a todas as arestas, também pode falhar.'
            );
        }
        return errors;
    },
    run: ({ graph, startId, endId }) => {
        const builder = createTraceBuilder(graph);
        const adjacency = buildAdjacency(graph);
        const labels = nodeLabelMap(graph);
        const root = startId as NodeId;

        const distance = new Map<NodeId, number>();
        const pred = new Map<NodeId, NodeId | null>();
        const predEdge = new Map<NodeId, string | null>();
        // S: conjunto dos vértices já "fechados".
        const closed = new Set<NodeId>();

        graph.nodes.forEach((node) => {
            distance.set(node.id, Number.POSITIVE_INFINITY);
            pred.set(node.id, null);
            predEdge.set(node.id, null);
        });
        distance.set(root, 0);
        builder.setNodeBadge(root, '0');

        const table = (highlight?: NodeId) =>
            distanceTable(graph, distance, pred, {
                id: 'dijkstra-table',
                title: 'dist e pred',
                distanceLabel: 'dist',
                parentLabel: 'pred',
                highlight: highlight ? new Set([highlight]) : undefined,
                settled: closed,
            });

        const openList = () => ({
            id: 'open-set',
            title: 'Vértices ainda não fechados',
            variant: 'set' as const,
            items: sortedNodes(graph)
                .filter((node) => !closed.has(node.id))
                .map(
                    (node) =>
                        `${node.label}: ${formatDistance(distance.get(node.id) ?? Number.POSITIVE_INFINITY)}`
                ),
        });

        builder.commit({
            title: 'Inicialização',
            description: `dist[${labelOf(graph, root)}] = 0 na raiz e dist[v] = ∞ nos demais vértices, com pred[v] = nulo. Nenhum vértice foi fechado ainda, isto é, S = ∅.`,
            tables: [table()],
            lists: [openList()],
        });

        while (closed.size < graph.nodes.length) {
            let candidate: NodeId | null = null;
            let best = Number.POSITIVE_INFINITY;
            sortedNodes(graph).forEach((node) => {
                if (closed.has(node.id)) return;
                const value = distance.get(node.id) ?? Number.POSITIVE_INFINITY;
                if (value < best) {
                    best = value;
                    candidate = node.id;
                }
            });

            if (candidate === null) {
                builder.commit({
                    title: 'Vértices inalcançáveis',
                    description:
                        'Todos os vértices ainda não fechados têm dist = ∞: eles não são alcançáveis a partir da raiz e o algoritmo encerra.',
                    tables: [table()],
                    lists: [openList()],
                });
                break;
            }

            const current: NodeId = candidate;
            closed.add(current);
            builder.resetEdgesWithState('active', 'idle');
            builder.setNode(current, 'done');

            const linkingEdge = predEdge.get(current);
            if (linkingEdge) builder.setEdge(linkingEdge, 'done');

            builder.commit({
                title: `Fecha ${labels.get(current)} com dist = ${formatWeight(best)}`,
                description: `${labels.get(current)} é o vértice não fechado com o menor valor de dist, portanto entra em S. Como não há custos negativos, dist[${labels.get(current)}] já é o custo definitivo do caminho mínimo desde a raiz.`,
                tables: [table(current)],
                lists: [openList()],
            });

            for (const entry of adjacency.get(current) ?? []) {
                if (closed.has(entry.to)) continue;
                const relaxed = best + entry.edge.weight;
                const currentDistance = distance.get(entry.to) ?? Number.POSITIVE_INFINITY;
                builder.setEdge(entry.edge.id, 'active');

                if (relaxed < currentDistance) {
                    distance.set(entry.to, relaxed);
                    pred.set(entry.to, current);
                    predEdge.set(entry.to, entry.edge.id);
                    builder.setNode(entry.to, 'frontier');
                    builder.setNodeBadge(entry.to, formatWeight(relaxed));
                    builder.commit({
                        title: `Aresta tensa (${labels.get(current)}, ${labels.get(entry.to)}) — relaxada`,
                        description: `dist[${labels.get(entry.to)}] = ${formatDistance(currentDistance)} > dist[${labels.get(current)}] + d = ${formatWeight(best)} + ${formatWeight(entry.edge.weight)} = ${formatWeight(relaxed)}. Logo dist[${labels.get(entry.to)}] ← ${formatWeight(relaxed)} e pred[${labels.get(entry.to)}] ← ${labels.get(current)}.`,
                        tables: [table(entry.to)],
                        lists: [openList()],
                    });
                } else {
                    builder.commit({
                        title: `Aresta (${labels.get(current)}, ${labels.get(entry.to)}) não está tensa`,
                        description: `dist[${labels.get(current)}] + d = ${formatWeight(best)} + ${formatWeight(entry.edge.weight)} = ${formatWeight(relaxed)} não é menor que dist[${labels.get(entry.to)}] = ${formatDistance(currentDistance)}, então nada muda.`,
                        tables: [table(entry.to)],
                        lists: [openList()],
                    });
                }
            }
        }

        builder.resetEdgesWithState('active', 'idle');
        builder.resetEdgesWithState('frontier', 'idle');

        const conclusions = [
            `dist[ ] final a partir da raiz ${labelOf(graph, root)}: ${sortedNodes(graph)
                .map(
                    (node) =>
                        `${node.label} = ${formatDistance(distance.get(node.id) ?? Number.POSITIVE_INFINITY)}`
                )
                .join(', ')}.`,
            'dist[ ] guarda apenas os custos dos caminhos mínimos; os caminhos em si são recuperados percorrendo a lista de predecessores pred[ ].',
        ];

        if (endId && Number.isFinite(distance.get(endId) ?? Infinity)) {
            const path = pathFromParents(pred, endId);
            if (path) {
                edgesAlongPath(graph, path).forEach((edgeId) => builder.setEdge(edgeId, 'path'));
                path.forEach((nodeId) => builder.setNode(nodeId, 'path'));
                conclusions.push(
                    `Caminho mínimo até ${labelOf(graph, endId)}, obtido por pred[ ]: ${path.map((id) => labels.get(id)).join(' → ')} (custo ${formatDistance(distance.get(endId) ?? Infinity)}).`
                );
            }
        }

        builder.commit({
            title: 'Caminhos mínimos calculados',
            description:
                endId && Number.isFinite(distance.get(endId) ?? Infinity)
                    ? `O caminho mínimo até ${labelOf(graph, endId)} está destacado em roxo.`
                    : 'Todos os vértices alcançáveis foram fechados com seu valor definitivo de dist.',
            tables: [table()],
        });

        return builder.build(conclusions);
    },
};
