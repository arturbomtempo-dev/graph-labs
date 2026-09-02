import { buildAdjacency, hasDirectedEdges, orderComparator, orderedNodes } from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId } from '../graph/types';
import { colorTable, undirectedDegrees } from './greedyColoring';
import { requireNodes } from './shared';

export const welshPowell: AlgorithmDefinition = {
    id: 'welsh-powell',
    name: 'Método de Welsh-Powell',
    shortName: 'Welsh-Powell',
    category: 'Coloração',
    tagline:
        'Ordena os vértices em ordem não crescente de graus e colore, com uma mesma cor, todos os que não estiverem conectados a um vértice já colorido com ela.',
    complexity: 'O(n² )',
    needsStart: false,
    needsEnd: false,
    constraints: [
        'Exige grafo não direcionado',
        'Coloração aproximada, não necessariamente mínima',
        'Costuma usar menos cores que o método guloso',
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
        const alphabetical = orderedNodes(graph, order);
        const degree = undirectedDegrees(adjacency, alphabetical);

        const compare = orderComparator(graph, order);
        const sequence = [...alphabetical].sort((a, b) => {
            const byDegree = (degree.get(b.id) ?? 0) - (degree.get(a.id) ?? 0);
            return byDegree !== 0 ? byDegree : compare(a.id, b.id);
        });

        const color = new Map<NodeId, number>();
        const adjacentTo = (node: NodeId) =>
            new Set((adjacency.get(node) ?? []).map((entry) => entry.to));

        const snapshot = (highlight?: NodeId, usedColors = 0) => ({
            tables: [colorTable('wp-colors', sequence, color, degree, highlight)],
            metrics: [
                { label: 'Cores utilizadas', value: String(usedColors) },
                {
                    label: 'Δ(G)',
                    value: String(Math.max(0, ...sequence.map((n) => degree.get(n.id) ?? 0))),
                },
            ],
        });

        builder.commit({
            title: 'Passo 1: ordenação por grau',
            description: `Os vértices são ordenados em ordem não crescente de graus: ${sequence
                .map((node) => `${node.label} (d = ${degree.get(node.id)})`)
                .join(', ')}.`,
            ...snapshot(),
        });

        let current = 0;

        while (color.size < sequence.length) {
            const painted: string[] = [];
            const blocked = new Set<NodeId>();

            builder.commit({
                title: `Cor ${current + 1}: nova passagem pela lista`,
                description: `Percorre-se a lista ordenada colorindo com a cor ${current + 1} todo vértice ainda sem cor que não seja adjacente a nenhum vértice já colorido com ela.`,
                ...snapshot(undefined, current),
            });

            for (const node of sequence) {
                if (color.has(node.id)) continue;

                if (blocked.has(node.id)) {
                    builder.commit({
                        title: `${node.label} não pode receber a cor ${current + 1}`,
                        description: `${node.label} é adjacente a um vértice já colorido com a cor ${current + 1} nesta passagem, portanto fica para uma cor seguinte.`,
                        ...snapshot(node.id, current + 1),
                    });
                    continue;
                }

                color.set(node.id, current);
                painted.push(node.label);
                builder.setNodeGroup(node.id, current);
                builder.setNodeBadge(node.id, `cor ${current + 1}`);
                builder.setNode(node.id, 'done');
                adjacentTo(node.id).forEach((neighbour) => blocked.add(neighbour));
                (adjacency.get(node.id) ?? []).forEach((entry) => {
                    if (color.has(entry.to)) builder.setEdge(entry.edge.id, 'done');
                });

                builder.commit({
                    title: `${node.label} recebe a cor ${current + 1}`,
                    description: `${node.label} não é adjacente a nenhum vértice já colorido com a cor ${current + 1}. Seus vizinhos ficam bloqueados para esta cor nesta passagem.`,
                    ...snapshot(node.id, current + 1),
                });
            }

            builder.commit({
                title: `Cor ${current + 1} encerrada`,
                description: `A cor ${current + 1} foi atribuída a ${painted.length} vértice(s): ${painted.join(', ') || '-'}. ${
                    color.size < sequence.length
                        ? 'Ainda restam vértices sem cor, então uma nova cor é iniciada.'
                        : 'Todos os vértices estão coloridos.'
                }`,
                ...snapshot(undefined, current + 1),
            });

            current += 1;
        }

        const maxDegree = Math.max(0, ...sequence.map((node) => degree.get(node.id) ?? 0));

        builder.commit({
            title: 'Coloração concluída',
            description: `Todos os vértices foram coloridos com ${current} cor(es), sempre respeitando a ordem não crescente de graus.`,
            ...snapshot(undefined, current),
        });

        return builder.build([
            `Welsh-Powell produziu uma ${current}-coloração, logo χ(G) ≤ ${current}.`,
            `Δ(G) = ${maxDegree}, e vale sempre χ(G) ≤ Δ(G) + 1 = ${maxDegree + 1}.`,
            'Ordenar por grau costuma dar um resultado melhor que o do método guloso, mas não garante a coloração mínima. Existem contraexemplos, como grafos bipartidos em que o método usa 3 cores embora χ(G) = 2.',
        ]);
    },
};
