import {
    compareLabels,
    formatWeight,
    hasDirectedEdges,
    nodeLabelMap,
    sortedNodes,
} from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId, TraceTable } from '../graph/types';
import { requireEdges, requireNodes } from './shared';

export const kruskal: AlgorithmDefinition = {
    id: 'kruskal',
    name: 'Kruskal',
    shortName: 'Kruskal',
    category: 'Árvore geradora mínima',
    tagline: 'Ordena as arestas por peso e une florestas com conjuntos disjuntos.',
    complexity: 'O(E log E)',
    needsStart: false,
    needsEnd: false,
    constraints: ['Exige grafo não direcionado', 'Usa os pesos das arestas'],
    validate: (context) => {
        const errors = [...requireNodes(context), ...requireEdges(context)];
        if (hasDirectedEdges(context.graph)) {
            errors.push(
                'Kruskal opera sobre grafos não direcionados: converta todas as arestas para não direcionadas.'
            );
        }
        return errors;
    },
    run: ({ graph }) => {
        const builder = createTraceBuilder(graph);
        const labels = nodeLabelMap(graph);

        const parent = new Map<NodeId, NodeId>();
        const rank = new Map<NodeId, number>();
        graph.nodes.forEach((node) => {
            parent.set(node.id, node.id);
            rank.set(node.id, 0);
        });

        const find = (node: NodeId): NodeId => {
            let root = node;
            while (parent.get(root) !== root) root = parent.get(root) as NodeId;
            let current = node;
            while (parent.get(current) !== root) {
                const next = parent.get(current) as NodeId;
                parent.set(current, root);
                current = next;
            }
            return root;
        };

        const union = (a: NodeId, b: NodeId) => {
            const rootA = find(a);
            const rootB = find(b);
            if (rootA === rootB) return false;
            const rankA = rank.get(rootA) ?? 0;
            const rankB = rank.get(rootB) ?? 0;
            if (rankA < rankB) {
                parent.set(rootA, rootB);
            } else if (rankA > rankB) {
                parent.set(rootB, rootA);
            } else {
                parent.set(rootB, rootA);
                rank.set(rootA, rankA + 1);
            }
            return true;
        };

        const ordered = [...graph.edges].sort((a, b) => {
            if (a.weight !== b.weight) return a.weight - b.weight;
            return compareLabels(labels.get(a.source) ?? '', labels.get(b.source) ?? '');
        });

        const accepted: string[] = [];
        const rejected: string[] = [];
        let totalWeight = 0;
        let examinedIndex = -1;

        const applyGroups = () => {
            const roots = new Map<NodeId, number>();
            sortedNodes(graph).forEach((node) => {
                const root = find(node.id);
                if (!roots.has(root)) roots.set(root, roots.size);
                builder.setNodeGroup(node.id, roots.get(root) as number);
                builder.setNodeBadge(node.id, `S${(roots.get(root) as number) + 1}`);
            });
            return roots.size;
        };

        const edgeQueueTable = (): TraceTable => ({
            id: 'kruskal-edges',
            title: 'Arestas ordenadas por peso',
            columns: [
                { key: 'edge', label: 'Aresta' },
                { key: 'weight', label: 'Peso' },
                { key: 'decision', label: 'Decisão' },
            ],
            rows: ordered.map((edge, index) => ({
                key: edge.id,
                emphasis:
                    index === examinedIndex
                        ? 'active'
                        : accepted.includes(edge.id)
                          ? 'done'
                          : rejected.includes(edge.id)
                            ? 'reject'
                            : undefined,
                cells: {
                    edge: `${labels.get(edge.source)} — ${labels.get(edge.target)}`,
                    weight: formatWeight(edge.weight),
                    decision: accepted.includes(edge.id)
                        ? 'aceita'
                        : rejected.includes(edge.id)
                          ? 'rejeitada (ciclo)'
                          : index === examinedIndex
                            ? 'em análise'
                            : 'aguardando',
                },
            })),
        });

        const setsTable = (): TraceTable => {
            const groups = new Map<NodeId, string[]>();
            sortedNodes(graph).forEach((node) => {
                const root = find(node.id);
                const bucket = groups.get(root) ?? [];
                bucket.push(node.label);
                groups.set(root, bucket);
            });
            return {
                id: 'kruskal-sets',
                title: 'Conjuntos disjuntos',
                columns: [
                    { key: 'setName', label: 'Conjunto' },
                    { key: 'members', label: 'Vértices' },
                ],
                rows: [...groups.values()].map((members, index) => ({
                    key: `set-${index}`,
                    cells: { setName: `S${index + 1}`, members: members.join(', ') },
                })),
            };
        };

        const metrics = () => [
            {
                label: 'Arestas aceitas',
                value: `${accepted.length} / ${Math.max(graph.nodes.length - 1, 0)}`,
            },
            { label: 'Peso total', value: formatWeight(totalWeight) },
        ];

        applyGroups();
        builder.commit({
            title: 'Inicialização',
            description: `Cada vértice começa em seu próprio conjunto disjunto. As ${ordered.length} arestas foram ordenadas de forma crescente por peso.`,
            tables: [edgeQueueTable(), setsTable()],
            metrics: metrics(),
        });

        ordered.forEach((edge, index) => {
            examinedIndex = index;
            builder.resetEdgesWithState('active', 'idle');
            builder.setEdge(edge.id, 'active');
            builder.setNode(edge.source, 'frontier');
            builder.setNode(edge.target, 'frontier');

            const rootSource = find(edge.source);
            const rootTarget = find(edge.target);
            const createsCycle = rootSource === rootTarget;

            builder.commit({
                title: `Examina ${labels.get(edge.source)} — ${labels.get(edge.target)} (peso ${formatWeight(edge.weight)})`,
                description: createsCycle
                    ? `Os dois extremos já pertencem ao mesmo conjunto disjunto, portanto a aresta fecharia um ciclo.`
                    : `Os extremos estão em conjuntos diferentes, portanto a aresta pode ser aceita sem formar ciclo.`,
                tables: [edgeQueueTable(), setsTable()],
                metrics: metrics(),
            });

            if (createsCycle) {
                rejected.push(edge.id);
                builder.setEdge(edge.id, 'reject');
            } else {
                union(edge.source, edge.target);
                accepted.push(edge.id);
                totalWeight += edge.weight;
                builder.setEdge(edge.id, 'done');
                builder.setNode(edge.source, 'done');
                builder.setNode(edge.target, 'done');
                applyGroups();
            }

            builder.commit({
                title: createsCycle ? 'Aresta rejeitada' : 'Aresta aceita',
                description: createsCycle
                    ? `A aresta é descartada e os conjuntos permanecem inalterados.`
                    : `A aresta entra na floresta e os conjuntos de ${labels.get(edge.source)} e ${labels.get(edge.target)} são unidos.`,
                tables: [edgeQueueTable(), setsTable()],
                metrics: metrics(),
            });
        });

        examinedIndex = -1;
        builder.resetEdgesWithState('active', 'idle');
        builder.setNodes(
            graph.nodes.map((node) => node.id),
            'done'
        );
        const componentCount = applyGroups();

        builder.commit({
            title: 'Floresta geradora mínima concluída',
            description: `Foram aceitas ${accepted.length} aresta(s) com peso total ${formatWeight(totalWeight)}.`,
            tables: [edgeQueueTable(), setsTable()],
            metrics: metrics(),
        });

        return builder.build([
            `Peso total: ${formatWeight(totalWeight)} com ${accepted.length} aresta(s) aceita(s) e ${rejected.length} rejeitada(s).`,
            componentCount === 1
                ? 'O grafo é conexo, portanto o resultado é uma árvore geradora mínima.'
                : `O grafo possui ${componentCount} componentes, portanto o resultado é uma floresta geradora mínima.`,
        ]);
    },
};
