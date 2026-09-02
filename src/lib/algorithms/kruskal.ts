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
    name: 'Método de Kruskal',
    shortName: 'Kruskal',
    category: 'Árvore geradora mínima',
    tagline:
        'Inclui arestas, e não vértices: ordena as arestas por custo não decrescente e aceita cada uma que não forme ciclo com as já inseridas em E(T).',
    complexity: 'O(m log m)',
    needsStart: false,
    needsEnd: false,
    constraints: [
        'Exige grafo não direcionado',
        'Exige grafo ponderado com custo c_e > 0',
        'Em grafo desconexo produz uma floresta geradora mínima',
    ],
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
                builder.setNodeBadge(node.id, `T${(roots.get(root) as number) + 1}`);
            });
            return roots.size;
        };

        const edgeQueueTable = (): TraceTable => ({
            id: 'kruskal-edges',
            title: 'Arestas em ordem não decrescente de custo',
            columns: [
                { key: 'edge', label: 'Aresta' },
                { key: 'weight', label: 'Custo' },
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
                    edge: `{${labels.get(edge.source)}, ${labels.get(edge.target)}}`,
                    weight: formatWeight(edge.weight),
                    decision: accepted.includes(edge.id)
                        ? 'entra em E(T)'
                        : rejected.includes(edge.id)
                          ? 'forma ciclo, ignorada'
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
                title: 'Componentes da floresta parcial T',
                columns: [
                    { key: 'setName', label: 'Componente' },
                    { key: 'members', label: 'Vértices' },
                ],
                rows: [...groups.values()].map((members, index) => ({
                    key: `set-${index}`,
                    cells: { setName: `T${index + 1}`, members: members.join(', ') },
                })),
            };
        };

        const metrics = () => [
            {
                label: 'Arestas em E(T)',
                value: `${accepted.length} / ${Math.max(graph.nodes.length - 1, 0)}`,
            },
            { label: 'Custo total C(T)', value: formatWeight(totalWeight) },
        ];

        applyGroups();
        builder.commit({
            title: 'Inicialização',
            description: `V(T) recebe todos os vértices de V(G) e E(T) começa vazio, portanto cada vértice é um componente isolado da floresta. As ${ordered.length} arestas foram ordenadas em ordem não decrescente de custo.`,
            tables: [edgeQueueTable(), setsTable()],
            metrics: metrics(),
        });

        const target = Math.max(graph.nodes.length - 1, 0);
        let iterationsUsed = 0;

        for (const [index, edge] of ordered.entries()) {
            if (accepted.length >= target) break;
            iterationsUsed = index + 1;
            examinedIndex = index;
            builder.resetEdgesWithState('active', 'idle');
            builder.setEdge(edge.id, 'active');
            builder.setNode(edge.source, 'frontier');
            builder.setNode(edge.target, 'frontier');

            const rootSource = find(edge.source);
            const rootTarget = find(edge.target);
            const createsCycle = rootSource === rootTarget;

            builder.commit({
                title: `Analisa {${labels.get(edge.source)}, ${labels.get(edge.target)}} de custo ${formatWeight(edge.weight)}`,
                description: createsCycle
                    ? `Os dois extremos já estão ligados por arestas de E(T), portanto essa aresta formaria um ciclo.`
                    : `Os extremos estão em componentes diferentes da floresta parcial, portanto a aresta não forma ciclo com as arestas de E(T).`,
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
                title: createsCycle
                    ? 'Aresta ignorada (forma ciclo)'
                    : 'Aresta acrescentada a E(T)',
                description: createsCycle
                    ? `A aresta é ignorada e a floresta parcial permanece inalterada. Por isso podem ser necessárias mais de n − 1 iterações.`
                    : `A aresta entra em E(T) e os componentes de ${labels.get(edge.source)} e ${labels.get(edge.target)} passam a ser um só.`,
                tables: [edgeQueueTable(), setsTable()],
                metrics: metrics(),
            });
        }

        examinedIndex = -1;
        builder.resetEdgesWithState('active', 'idle');
        builder.setNodes(
            graph.nodes.map((node) => node.id),
            'done'
        );
        const componentCount = applyGroups();

        builder.commit({
            title: 'Execução concluída',
            description:
                accepted.length >= target
                    ? `| E(T) | = | V(T) | − 1 = ${target}: o laço termina com custo total C(T) = ${formatWeight(totalWeight)}.`
                    : `Todas as arestas foram analisadas sem atingir | V(T) | − 1 = ${target} arestas, portanto o grafo é desconexo. Custo total C(T) = ${formatWeight(totalWeight)}.`,
            tables: [edgeQueueTable(), setsTable()],
            metrics: metrics(),
        });

        return builder.build([
            `Custo total: C(T) = ${formatWeight(totalWeight)}, com ${accepted.length} aresta(s) em E(T) e ${rejected.length} aresta(s) ignorada(s) por formarem ciclo.`,
            `Foram necessárias ${iterationsUsed} iteração(ões) para ${accepted.length} aresta(s) aceita(s): como as arestas que formam ciclo precisam ser ignoradas, n − 1 iterações podem não bastar.`,
            componentCount === 1
                ? 'O grafo é conexo, portanto o resultado é uma árvore geradora de custo mínimo (AGM).'
                : `O grafo possui ${componentCount} componentes conexos, portanto o resultado é uma floresta geradora mínima.`,
        ]);
    },
};
