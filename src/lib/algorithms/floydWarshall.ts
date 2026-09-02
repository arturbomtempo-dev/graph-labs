import { formatDistance, formatWeight, sortedNodes } from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, GraphNode, NodeId, TraceTable } from '../graph/types';
import { edgesAlongPath, labelOf, requireEdges, requireNodes } from './shared';

export const floydWarshall: AlgorithmDefinition = {
    id: 'floyd-warshall',
    name: 'Método de Floyd-Warshall',
    shortName: 'Floyd-Warshall',
    category: 'Caminho mínimo',
    tagline:
        'Caminhos mínimos entre todos os pares por programação dinâmica: a rodada k libera o vértice k como intermediário.',
    complexity: 'O(n³)',
    needsStart: false,
    needsEnd: false,
    constraints: [
        'Admite arestas de custo negativo',
        'Não admite ciclo de custo negativo',
        'Calcula todos os pares de vértices de uma só vez',
    ],
    validate: (context) => [...requireNodes(context), ...requireEdges(context)],
    run: ({ graph, startId, endId }) => {
        const builder = createTraceBuilder(graph);
        const nodes: GraphNode[] = sortedNodes(graph);
        const index = new Map<NodeId, number>(nodes.map((node, position) => [node.id, position]));
        const size = nodes.length;

        // dist[i][j] e pred[i][j]: pred guarda o penúltimo vértice do caminho de i para j.
        const distance: number[][] = nodes.map((_, i) =>
            nodes.map((__, j) => (i === j ? 0 : Number.POSITIVE_INFINITY))
        );
        const pred: (NodeId | null)[][] = nodes.map((from, i) =>
            nodes.map((_, j) => (i === j ? from.id : null))
        );

        graph.edges.forEach((edge) => {
            const i = index.get(edge.source) as number;
            const j = index.get(edge.target) as number;
            if (edge.weight < distance[i][j]) {
                distance[i][j] = edge.weight;
                pred[i][j] = edge.source;
            }
            if (!edge.directed && edge.weight < distance[j][i]) {
                distance[j][i] = edge.weight;
                pred[j][i] = edge.target;
            }
        });

        const matrix = (
            highlightRow?: number,
            highlightColumn?: number,
            pivot?: number
        ): TraceTable => ({
            id: 'fw-matrix',
            title: 'Matriz dist',
            columns: [
                { key: 'origin', label: 'i \\ j' },
                ...nodes.map((node) => ({ key: node.id, label: node.label })),
            ],
            rows: nodes.map((from, i) => ({
                key: from.id,
                emphasis: i === pivot ? 'done' : i === highlightRow ? 'active' : undefined,
                cells: {
                    origin: from.label,
                    ...Object.fromEntries(
                        nodes.map((to, j) => [
                            to.id,
                            `${formatDistance(distance[i][j])}${
                                i === highlightRow && j === highlightColumn ? ' •' : ''
                            }`,
                        ])
                    ),
                },
            })),
        });

        const predecessors = (): TraceTable => ({
            id: 'fw-pred',
            title: 'Matriz pred',
            columns: [
                { key: 'origin', label: 'i \\ j' },
                ...nodes.map((node) => ({ key: node.id, label: node.label })),
            ],
            rows: nodes.map((from, i) => ({
                key: `pred-${from.id}`,
                cells: {
                    origin: from.label,
                    ...Object.fromEntries(
                        nodes.map((to, j) => [
                            to.id,
                            pred[i][j] ? (labelOf(graph, pred[i][j]) ?? '—') : '—',
                        ])
                    ),
                },
            })),
        });

        builder.commit({
            title: 'Matrizes iniciais (k = 0)',
            description:
                'dist⁰[i, i] = 0, dist⁰[i, j] = dij para toda aresta (i, j) ∈ E(G) e ∞ para os pares sem ligação direta. Em pred, cada par ligado por aresta recebe o próprio i, pois i é o penúltimo vértice do caminho direto de i para j.',
            tables: [matrix(), predecessors()],
        });

        for (let k = 0; k < size; k += 1) {
            const pivotNode = nodes[k];
            builder.setNodes(
                nodes.map((node) => node.id),
                'idle'
            );
            builder.setNode(pivotNode.id, 'active');
            builder.setNodeBadge(pivotNode.id, 'k');

            let improvements = 0;

            builder.commit({
                title: `k = ${pivotNode.label}`,
                description: `Agora os vértices { ${nodes
                    .slice(0, k + 1)
                    .map((node) => node.label)
                    .join(
                        ', '
                    )} } podem ser usados como intermediários. Para todo par (i, j), testa-se se dist[i, j] > dist[i, ${pivotNode.label}] + dist[${pivotNode.label}, j].`,
                tables: [matrix(undefined, undefined, k), predecessors()],
                metrics: [{ label: 'Intermediário k', value: `${k + 1} / ${size}` }],
            });

            for (let i = 0; i < size; i += 1) {
                for (let j = 0; j < size; j += 1) {
                    const throughPivot = distance[i][k] + distance[k][j];
                    if (!Number.isFinite(throughPivot)) continue;
                    if (throughPivot >= distance[i][j]) continue;

                    const previous = distance[i][j];
                    distance[i][j] = throughPivot;
                    pred[i][j] = pred[k][j];
                    improvements += 1;

                    builder.commit({
                        title: `dist[${nodes[i].label}, ${nodes[j].label}] ← ${formatWeight(throughPivot)}`,
                        description: `dist[${nodes[i].label}, ${pivotNode.label}] + dist[${pivotNode.label}, ${nodes[j].label}] = ${formatWeight(distance[i][k])} + ${formatWeight(distance[k][j])} = ${formatWeight(throughPivot)}, menor que ${formatDistance(previous)}. Atualiza-se também pred[${nodes[i].label}, ${nodes[j].label}] ← pred[${pivotNode.label}, ${nodes[j].label}] = ${labelOf(graph, pred[k][j])}.`,
                        tables: [matrix(i, j, k), predecessors()],
                        metrics: [{ label: 'Intermediário k', value: `${k + 1} / ${size}` }],
                    });
                }
            }

            if (improvements === 0) {
                builder.commit({
                    title: `Nenhuma melhoria com k = ${pivotNode.label}`,
                    description: `Nenhum par (i, j) reduz sua distância passando por ${pivotNode.label}.`,
                    tables: [matrix(undefined, undefined, k), predecessors()],
                });
            }
        }

        builder.setNodes(
            nodes.map((node) => node.id),
            'done'
        );

        const negativeCycleNodes = nodes.filter((_, i) => distance[i][i] < 0);
        const conclusions: string[] = [];

        if (negativeCycleNodes.length > 0) {
            negativeCycleNodes.forEach((node) => {
                builder.setNode(node.id, 'reject');
                builder.setNodeBadge(node.id, 'ciclo −');
            });
            conclusions.push(
                `Ciclo de custo negativo detectado: dist[i, i] < 0 para ${negativeCycleNodes
                    .map((node) => node.label)
                    .join(
                        ', '
                    )}. Nesse caso não há caminho mínimo bem definido entre os pares afetados.`
            );
        } else {
            conclusions.push(
                'Nenhuma entrada da diagonal ficou negativa, portanto o grafo não possui ciclo de custo negativo.'
            );
        }

        if (startId && endId && startId !== endId) {
            const i = index.get(startId) as number;
            const j = index.get(endId) as number;
            const path: NodeId[] = [endId];
            let cursor: NodeId = endId;
            let guard = 0;

            while (cursor !== startId && guard < size + 1) {
                const previous = pred[i][index.get(cursor) as number];
                if (!previous) break;
                path.unshift(previous);
                cursor = previous;
                guard += 1;
            }

            if (path[0] === startId && Number.isFinite(distance[i][j])) {
                edgesAlongPath(graph, path).forEach((edgeId) => builder.setEdge(edgeId, 'path'));
                path.forEach((nodeId) => builder.setNode(nodeId, 'path'));
                conclusions.push(
                    `Caminho mínimo de ${labelOf(graph, startId)} até ${labelOf(graph, endId)}, recuperado de trás para frente pela matriz pred: ${path
                        .map((id) => labelOf(graph, id))
                        .join(' → ')} (custo ${formatDistance(distance[i][j])}).`
                );
            }
        }

        builder.commit({
            title: 'Matrizes finais',
            description:
                'Após liberar todos os vértices como intermediários, dist[i, j] contém a distância mínima entre cada par de vértices e pred[i, j] permite recuperar os caminhos.',
            tables: [matrix(), predecessors()],
        });

        return builder.build(conclusions);
    },
};
