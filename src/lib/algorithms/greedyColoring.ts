import { buildAdjacency, hasDirectedEdges, orderedNodes } from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, GraphNode, NodeId, TraceTable } from '../graph/types';
import { requireNodes } from './shared';

export function colorTable(
    id: string,
    order: GraphNode[],
    color: Map<NodeId, number>,
    degree: Map<NodeId, number>,
    highlight?: NodeId
): TraceTable {
    return {
        id,
        title: 'Cores atribuídas',
        columns: [
            { key: 'vertex', label: 'Vértice' },
            { key: 'degree', label: 'd(v)' },
            { key: 'colorIndex', label: 'cor(v)' },
        ],
        rows: order.map((node) => ({
            key: node.id,
            emphasis: node.id === highlight ? 'active' : color.has(node.id) ? 'done' : undefined,
            cells: {
                vertex: node.label,
                degree: String(degree.get(node.id) ?? 0),
                colorIndex: color.has(node.id) ? String((color.get(node.id) as number) + 1) : '-',
            },
        })),
    };
}

export function undirectedDegrees(
    adjacency: Map<NodeId, { to: NodeId }[]>,
    nodes: GraphNode[]
): Map<NodeId, number> {
    const degree = new Map<NodeId, number>();
    nodes.forEach((node) => degree.set(node.id, (adjacency.get(node.id) ?? []).length));
    return degree;
}

export const greedyColoring: AlgorithmDefinition = {
    id: 'coloracao-gulosa',
    name: 'Método guloso',
    shortName: 'Coloração gulosa',
    category: 'Coloração',
    tagline:
        'Percorre os vértices em uma ordem qualquer e atribui a cada um a cor de menor índice não utilizada por nenhum de seus vizinhos.',
    complexity: 'O(n + m)',
    needsStart: false,
    needsEnd: false,
    constraints: [
        'Exige grafo não direcionado',
        'Coloração aproximada, não necessariamente mínima',
        'O resultado depende da ordem dos vértices',
    ],
    validate: (context) => {
        const errors = [...requireNodes(context)];
        if (hasDirectedEdges(context.graph)) {
            errors.push(
                'A coloração de vértices é definida para grafo não direcionado: converta todas as arestas para não direcionadas.'
            );
        }
        return errors;
    },
    run: ({ graph, order }) => {
        const builder = createTraceBuilder(graph);
        const adjacency = buildAdjacency(graph, order);
        const sequence = orderedNodes(graph, order);
        const degree = undirectedDegrees(adjacency, sequence);

        const color = new Map<NodeId, number>();
        let used = 0;

        const snapshot = (highlight?: NodeId) => ({
            tables: [colorTable('greedy-colors', sequence, color, degree, highlight)],
            metrics: [
                { label: 'Cores utilizadas', value: String(used) },
                {
                    label: 'Δ(G)',
                    value: String(Math.max(0, ...sequence.map((n) => degree.get(n.id) ?? 0))),
                },
            ],
        });

        builder.commit({
            title: 'Inicialização',
            description: `Nenhum vértice está colorido. Os vértices serão considerados na ordem ${sequence
                .map((node) => node.label)
                .join(', ')}. Qualquer ordem é válida, mas o resultado depende dela.`,
            ...snapshot(),
        });

        for (const node of sequence) {
            builder.setNode(node.id, 'active');
            const neighbours = adjacency.get(node.id) ?? [];
            const forbidden = new Set<number>();
            neighbours.forEach((entry) => {
                const neighbourColor = color.get(entry.to);
                if (neighbourColor !== undefined) forbidden.add(neighbourColor);
            });

            let chosen = 0;
            while (forbidden.has(chosen)) chosen += 1;

            color.set(node.id, chosen);
            used = Math.max(used, chosen + 1);
            builder.setNodeGroup(node.id, chosen);
            builder.setNodeBadge(node.id, `cor ${chosen + 1}`);
            builder.setNode(node.id, 'done');
            neighbours.forEach((entry) => {
                if (color.has(entry.to)) builder.setEdge(entry.edge.id, 'done');
            });

            const usedByNeighbours = [...forbidden].sort((a, b) => a - b).map((c) => c + 1);

            builder.commit({
                title: `${node.label} recebe a cor ${chosen + 1}`,
                description:
                    usedByNeighbours.length > 0
                        ? `Os vizinhos já coloridos de ${node.label} usam a(s) cor(es) ${usedByNeighbours.join(', ')}. A cor de menor índice ainda livre é a ${chosen + 1}.`
                        : `Nenhum vizinho de ${node.label} está colorido, então ele recebe a cor de menor índice: a ${chosen + 1}.`,
                ...snapshot(node.id),
            });
        }

        const maxDegree = Math.max(0, ...sequence.map((node) => degree.get(node.id) ?? 0));

        builder.commit({
            title: 'Coloração concluída',
            description: `Todos os vértices foram coloridos usando ${used} cor(es). Vértices adjacentes têm cores diferentes, portanto a coloração é válida.`,
            ...snapshot(),
        });

        return builder.build([
            `O método guloso produziu uma ${used}-coloração, logo χ(G) ≤ ${used}.`,
            `Δ(G) = ${maxDegree}, e vale sempre χ(G) ≤ Δ(G) + 1 = ${maxDegree + 1}.`,
            'O resultado do método guloso depende da ordem em que os vértices são considerados: outra ordem pode produzir menos cores.',
        ]);
    },
};
