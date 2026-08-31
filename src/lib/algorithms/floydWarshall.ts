import { formatDistance, formatWeight, sortedNodes } from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, GraphNode, NodeId, TraceTable } from '../graph/types';
import { edgesAlongPath, labelOf, requireEdges, requireNodes } from './shared';

export const floydWarshall: AlgorithmDefinition = {
    id: 'floyd-warshall',
    name: 'Floyd-Warshall',
    shortName: 'Floyd-Warshall',
    category: 'Caminhos mínimos',
    tagline:
        'Caminhos mínimos entre todos os pares por programação dinâmica sobre vértices intermediários.',
    complexity: 'O(V³)',
    needsStart: false,
    needsEnd: false,
    constraints: [
        'Aceita pesos negativos sem ciclos negativos',
        'Calcula todos os pares de uma só vez',
    ],
    validate: (context) => [...requireNodes(context), ...requireEdges(context)],
    run: ({ graph, startId, endId }) => {
        const builder = createTraceBuilder(graph);
        const nodes: GraphNode[] = sortedNodes(graph);
        const index = new Map<NodeId, number>(nodes.map((node, position) => [node.id, position]));
        const size = nodes.length;

        const distance: number[][] = nodes.map((_, i) =>
            nodes.map((__, j) => (i === j ? 0 : Number.POSITIVE_INFINITY))
        );
        const via: (NodeId | null)[][] = nodes.map(() => nodes.map(() => null));
        const next: (NodeId | null)[][] = nodes.map((from, i) =>
            nodes.map((_, j) => (i === j ? from.id : null))
        );

        graph.edges.forEach((edge) => {
            const i = index.get(edge.source) as number;
            const j = index.get(edge.target) as number;
            if (edge.weight < distance[i][j]) {
                distance[i][j] = edge.weight;
                next[i][j] = edge.target;
            }
            if (!edge.directed && edge.weight < distance[j][i]) {
                distance[j][i] = edge.weight;
                next[j][i] = edge.source;
            }
        });

        const matrix = (
            highlightRow?: number,
            highlightColumn?: number,
            pivot?: number
        ): TraceTable => ({
            id: 'fw-matrix',
            title: 'Matriz de distâncias',
            columns: [
                { key: 'origin', label: 'de \\ para' },
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

        const intermediaries = (): TraceTable => ({
            id: 'fw-next',
            title: 'Matriz de sucessores',
            columns: [
                { key: 'origin', label: 'de \\ para' },
                ...nodes.map((node) => ({ key: node.id, label: node.label })),
            ],
            rows: nodes.map((from, i) => ({
                key: `next-${from.id}`,
                cells: {
                    origin: from.label,
                    ...Object.fromEntries(
                        nodes.map((to, j) => [
                            to.id,
                            next[i][j] ? (labelOf(graph, next[i][j]) ?? '—') : '—',
                        ])
                    ),
                },
            })),
        });

        builder.commit({
            title: 'Matriz inicial',
            description:
                'A matriz começa com 0 na diagonal, o peso das arestas existentes e ∞ para os pares sem ligação direta.',
            tables: [matrix(), intermediaries()],
        });

        for (let k = 0; k < size; k += 1) {
            const pivotNode = nodes[k];
            builder.setNodes(
                nodes.map((node) => node.id),
                'idle'
            );
            builder.setNode(pivotNode.id, 'active');
            builder.setNodeBadge(pivotNode.id, 'pivô');

            let improvements = 0;

            builder.commit({
                title: `Vértice intermediário k = ${pivotNode.label}`,
                description: `Testa-se, para todo par (i, j), se passar por ${pivotNode.label} é mais barato do que a rota já conhecida.`,
                tables: [matrix(undefined, undefined, k), intermediaries()],
                metrics: [{ label: 'Pivô', value: `${k + 1} / ${size}` }],
            });

            for (let i = 0; i < size; i += 1) {
                for (let j = 0; j < size; j += 1) {
                    const throughPivot = distance[i][k] + distance[k][j];
                    if (!Number.isFinite(throughPivot)) continue;
                    if (throughPivot >= distance[i][j]) continue;

                    const previous = distance[i][j];
                    distance[i][j] = throughPivot;
                    via[i][j] = pivotNode.id;
                    next[i][j] = next[i][k];
                    improvements += 1;

                    builder.commit({
                        title: `d(${nodes[i].label}, ${nodes[j].label}) = ${formatWeight(throughPivot)}`,
                        description: `d(${nodes[i].label}, ${pivotNode.label}) + d(${pivotNode.label}, ${nodes[j].label}) = ${formatWeight(distance[i][k])} + ${formatWeight(distance[k][j])} = ${formatWeight(throughPivot)}, melhor que ${formatDistance(previous)}.`,
                        tables: [matrix(i, j, k), intermediaries()],
                        metrics: [{ label: 'Pivô', value: `${k + 1} / ${size}` }],
                    });
                }
            }

            if (improvements === 0) {
                builder.commit({
                    title: `Nenhuma melhoria com ${pivotNode.label}`,
                    description: `Nenhum par de vértices se beneficia de passar por ${pivotNode.label}.`,
                    tables: [matrix(undefined, undefined, k), intermediaries()],
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
                `Ciclo de peso negativo detectado: ${negativeCycleNodes.map((node) => node.label).join(', ')} têm distância negativa até si mesmos.`
            );
        } else {
            conclusions.push(
                'Nenhuma entrada da diagonal ficou negativa, portanto o grafo não possui ciclos de peso negativo.'
            );
        }

        if (startId && endId) {
            const i = index.get(startId) as number;
            const j = index.get(endId) as number;
            const path: NodeId[] = [];
            const cursor: NodeId | null = next[i][j];
            if (cursor) {
                path.push(startId);
                let guard = 0;
                let position = i;
                while (position !== j && guard < size * size) {
                    const step = next[position][j];
                    if (!step) break;
                    path.push(step);
                    position = index.get(step) as number;
                    guard += 1;
                }
                if (path[path.length - 1] === endId) {
                    edgesAlongPath(graph, path).forEach((edgeId) =>
                        builder.setEdge(edgeId, 'path')
                    );
                    path.forEach((nodeId) => builder.setNode(nodeId, 'path'));
                    conclusions.push(
                        `Caminho mínimo de ${labelOf(graph, startId)} até ${labelOf(graph, endId)}: ${path
                            .map((id) => labelOf(graph, id))
                            .join(' → ')} (custo ${formatDistance(distance[i][j])}).`
                    );
                }
            }
        }

        builder.commit({
            title: 'Matriz final',
            description:
                'Após considerar todos os vértices como intermediários, a matriz contém a distância mínima entre cada par de vértices.',
            tables: [matrix(), intermediaries()],
        });

        return builder.build(conclusions);
    },
};
