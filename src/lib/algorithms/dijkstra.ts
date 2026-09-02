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
    name: 'Algoritmo de Dijkstra',
    shortName: 'Dijkstra',
    category: 'Caminho mínimo',
    tagline:
        'Caminhos mínimos de origem única: a cada iteração visita o vértice não visitado com a menor estimativa e relaxa suas arestas.',
    complexity: 'O((n + m) log n)',
    needsStart: true,
    needsEnd: false,
    constraints: [
        'Aceita arestas direcionadas e não direcionadas',
        'Exige w : E → ℝ⁺ (sem pesos negativos)',
    ],
    validate: (context) => {
        const errors = [
            ...requireNodes(context),
            ...requireEdges(context),
            ...requireStart(context),
        ];
        if (hasNegativeWeights(context.graph)) {
            errors.push(
                'Dijkstra exige w : E → ℝ⁺. Com arestas de peso negativo o método falha — use Bellman-Ford. Reponderar somando uma constante também não resolve.'
            );
        }
        return errors;
    },
    run: ({ graph, startId, endId }) => {
        const builder = createTraceBuilder(graph);
        const adjacency = buildAdjacency(graph);
        const labels = nodeLabelMap(graph);
        const source = startId as NodeId;

        const distance = new Map<NodeId, number>();
        const parent = new Map<NodeId, NodeId | null>();
        const parentEdge = new Map<NodeId, string | null>();
        const settled = new Set<NodeId>();

        graph.nodes.forEach((node) => {
            distance.set(node.id, Number.POSITIVE_INFINITY);
            parent.set(node.id, null);
            parentEdge.set(node.id, null);
        });
        distance.set(source, 0);
        builder.setNodeBadge(source, '0');

        const table = (highlight?: NodeId) =>
            distanceTable(graph, distance, parent, {
                id: 'dijkstra-table',
                title: 'Estimativas de caminho mínimo',
                distanceLabel: 'd',
                parentLabel: 'π',
                highlight: highlight ? new Set([highlight]) : undefined,
                settled,
            });

        const queueList = () => ({
            id: 'open-set',
            title: 'Q — vértices não visitados',
            variant: 'set' as const,
            items: sortedNodes(graph)
                .filter((node) => !settled.has(node.id))
                .map(
                    (node) =>
                        `${node.label}: ${formatDistance(distance.get(node.id) ?? Number.POSITIVE_INFINITY)}`
                ),
        });

        builder.commit({
            title: 'Inicialização',
            description: `d[${labelOf(graph, source)}] = 0 na origem e d[v] = ∞ nos demais, com π[v] = NULL. S = ∅ e Q recebe todos os vértices.`,
            tables: [table()],
            lists: [queueList()],
        });

        while (settled.size < graph.nodes.length) {
            let candidate: NodeId | null = null;
            let best = Number.POSITIVE_INFINITY;
            sortedNodes(graph).forEach((node) => {
                if (settled.has(node.id)) return;
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
                        'Todos os vértices restantes em Q têm d = ∞: eles não são alcançáveis a partir da origem e o algoritmo encerra.',
                    tables: [table()],
                    lists: [queueList()],
                });
                break;
            }

            const current: NodeId = candidate;
            settled.add(current);
            builder.resetEdgesWithState('active', 'idle');
            builder.setNode(current, 'done');

            const linkingEdge = parentEdge.get(current);
            if (linkingEdge) builder.setEdge(linkingEdge, 'done');

            builder.commit({
                title: `ExtractMin(Q) = ${labels.get(current)}, d = ${formatWeight(best)}`,
                description: `${labels.get(current)} é o vértice não visitado com a menor estimativa de caminho mais curto e passa a S. Como w : E → ℝ⁺, d[${labels.get(current)}] já é o peso do caminho mínimo definitivo.`,
                tables: [table(current)],
                lists: [queueList()],
            });

            for (const entry of adjacency.get(current) ?? []) {
                if (settled.has(entry.to)) continue;
                const candidateDistance = best + entry.edge.weight;
                const currentDistance = distance.get(entry.to) ?? Number.POSITIVE_INFINITY;
                builder.setEdge(entry.edge.id, 'active');

                if (candidateDistance < currentDistance) {
                    distance.set(entry.to, candidateDistance);
                    parent.set(entry.to, current);
                    parentEdge.set(entry.to, entry.edge.id);
                    builder.setNode(entry.to, 'frontier');
                    builder.setNodeBadge(entry.to, formatWeight(candidateDistance));
                    builder.commit({
                        title: `Relaxa (${labels.get(current)}, ${labels.get(entry.to)})`,
                        description: `d[${labels.get(entry.to)}] = ${formatDistance(currentDistance)} > d[${labels.get(current)}] + w(${labels.get(current)}, ${labels.get(entry.to)}) = ${formatWeight(best)} + ${formatWeight(entry.edge.weight)} = ${formatWeight(candidateDistance)}. Então d[${labels.get(entry.to)}] ← ${formatWeight(candidateDistance)} e π[${labels.get(entry.to)}] ← ${labels.get(current)}.`,
                        tables: [table(entry.to)],
                        lists: [queueList()],
                    });
                } else {
                    builder.commit({
                        title: `Aresta (${labels.get(current)}, ${labels.get(entry.to)}) não relaxa`,
                        description: `d[${labels.get(current)}] + w(${labels.get(current)}, ${labels.get(entry.to)}) = ${formatWeight(best)} + ${formatWeight(entry.edge.weight)} = ${formatWeight(candidateDistance)} não é menor que d[${labels.get(entry.to)}] = ${formatDistance(currentDistance)}, então nada muda.`,
                        tables: [table(entry.to)],
                        lists: [queueList()],
                    });
                }
            }
        }

        builder.resetEdgesWithState('active', 'idle');
        builder.resetEdgesWithState('frontier', 'idle');

        const conclusions = [
            `Pesos dos caminhos mínimos a partir de ${labelOf(graph, source)}: ${sortedNodes(graph)
                .map(
                    (node) =>
                        `${node.label} = ${formatDistance(distance.get(node.id) ?? Number.POSITIVE_INFINITY)}`
                )
                .join(', ')}.`,
            'd[ ] guarda apenas os pesos dos caminhos mínimos; os caminhos em si são recuperados percorrendo a lista de predecessores π[ ].',
        ];

        if (endId && Number.isFinite(distance.get(endId) ?? Infinity)) {
            const path = pathFromParents(parent, endId);
            if (path) {
                edgesAlongPath(graph, path).forEach((edgeId) => builder.setEdge(edgeId, 'path'));
                path.forEach((nodeId) => builder.setNode(nodeId, 'path'));
                conclusions.push(
                    `Caminho mínimo até ${labelOf(graph, endId)}, obtido por π[ ]: ${path.map((id) => labels.get(id)).join(' → ')} (peso ${formatDistance(distance.get(endId) ?? Infinity)}).`
                );
            }
        }

        builder.commit({
            title: 'Caminhos mínimos calculados',
            description:
                endId && Number.isFinite(distance.get(endId) ?? Infinity)
                    ? `O caminho mínimo até ${labelOf(graph, endId)} está destacado em roxo.`
                    : 'Todos os vértices alcançáveis foram visitados e estão em S com sua estimativa definitiva.',
            tables: [table()],
        });

        return builder.build(conclusions);
    },
};
