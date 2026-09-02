import {
    buildAdjacency,
    formatDistance,
    formatWeight,
    hasDirectedEdges,
    nodeLabelMap,
    orderedNodes,
    sortedNodes,
    weightOf,
} from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId, TraceTable } from '../graph/types';
import { labelOf, requireEdges, requireNodes, requireStart } from './shared';

export const prim: AlgorithmDefinition = {
    id: 'prim',
    name: 'Método de Prim',
    shortName: 'Prim',
    category: 'Árvore geradora mínima',
    tagline:
        'Inclui vértices um a um: a cada passo acrescenta a aresta de menor peso entre V(T) e os vértices ainda não selecionados.',
    complexity: 'O(m log n)',
    needsStart: true,
    needsEnd: false,
    constraints: [
        'Exige grafo não direcionado',
        'Exige grafo ponderado com peso w(e) > 0',
        'Só existe árvore geradora se o grafo for conexo',
    ],
    validate: (context) => {
        const errors = [
            ...requireNodes(context),
            ...requireEdges(context),
            ...requireStart(context),
        ];
        if (hasDirectedEdges(context.graph)) {
            errors.push(
                'Prim opera sobre grafos não direcionados: converta todas as arestas para não direcionadas.'
            );
        }
        return errors;
    },
    run: ({ graph, startId, order }) => {
        const builder = createTraceBuilder(graph);
        const adjacency = buildAdjacency(graph, order);
        const labels = nodeLabelMap(graph);

        const key = new Map<NodeId, number>();
        const parent = new Map<NodeId, NodeId | null>();
        const parentEdge = new Map<NodeId, string | null>();
        const inTree = new Set<NodeId>();
        const treeEdges: string[] = [];
        let totalWeight = 0;

        graph.nodes.forEach((node) => {
            key.set(node.id, Number.POSITIVE_INFINITY);
            parent.set(node.id, null);
            parentEdge.set(node.id, null);
        });
        key.set(startId as NodeId, 0);
        builder.setNodeBadge(startId as NodeId, '0');

        const keyTable = (highlight?: NodeId): TraceTable => ({
            id: 'prim-keys',
            title: 'Menor peso até V(T)',
            columns: [
                { key: 'vertex', label: 'Vértice w' },
                { key: 'keyValue', label: 'menor peso' },
                { key: 'parent', label: 'v ∈ V(T)' },
                { key: 'status', label: 'Situação' },
            ],
            rows: sortedNodes(graph).map((node) => ({
                key: node.id,
                emphasis:
                    node.id === highlight ? 'active' : inTree.has(node.id) ? 'done' : undefined,
                cells: {
                    vertex: node.label,
                    keyValue: formatDistance(key.get(node.id) ?? Number.POSITIVE_INFINITY),
                    parent: labels.get(parent.get(node.id) ?? '') ?? '-',
                    status: inTree.has(node.id) ? 'em V(T)' : 'fora de V(T)',
                },
            })),
        });

        const metrics = () => [
            {
                label: 'Arestas em E(T)',
                value: `${treeEdges.length} / ${graph.nodes.length - 1}`,
            },
            { label: 'Peso total C(T)', value: formatWeight(totalWeight) },
        ];

        builder.commit({
            title: 'Inicialização',
            description: `Escolhida a raiz ${labelOf(graph, startId)}: V(T) = { ${labelOf(graph, startId)} } e E(T) = ∅. Nenhum outro vértice tem ainda uma aresta conhecida até V(T), por isso o menor peso é ∞.`,
            tables: [keyTable()],
            metrics: metrics(),
        });

        while (inTree.size < graph.nodes.length) {
            let candidate: NodeId | null = null;
            let bestKey = Number.POSITIVE_INFINITY;
            orderedNodes(graph, order).forEach((node) => {
                if (inTree.has(node.id)) return;
                const value = key.get(node.id) ?? Number.POSITIVE_INFINITY;
                if (value < bestKey) {
                    bestKey = value;
                    candidate = node.id;
                }
            });

            if (candidate === null) {
                builder.commit({
                    title: 'Grafo desconexo',
                    description:
                        'Não existe aresta entre V(T) e os vértices restantes: o grafo é desconexo. Como um grafo só possui árvore geradora se for conexo, o resultado cobre apenas o componente conexo da raiz.',
                    tables: [keyTable()],
                    metrics: metrics(),
                });
                break;
            }

            const current: NodeId = candidate;
            inTree.add(current);
            builder.resetEdgesWithState('active', 'idle');
            builder.setNode(current, 'done');

            const linkingEdge = parentEdge.get(current);
            if (linkingEdge) {
                treeEdges.push(linkingEdge);
                totalWeight += bestKey;
                builder.setEdge(linkingEdge, 'done');
            }

            builder.commit({
                title: `Acrescenta ${labels.get(current)} a V(T)`,
                description: linkingEdge
                    ? `A aresta de menor peso com uma extremidade em V(T) e a outra fora é {${labelOf(graph, parent.get(current))}, ${labels.get(current)}}, de peso ${formatWeight(bestKey)}. Ela é acrescentada a E(T) e ${labels.get(current)} passa a pertencer a V(T).`
                    : `${labels.get(current)} é a raiz r e inicia V(T), ainda sem nenhuma aresta em E(T).`,
                tables: [keyTable(current)],
                metrics: metrics(),
            });

            for (const entry of adjacency.get(current) ?? []) {
                if (inTree.has(entry.to)) continue;
                const weight = weightOf(entry.edge);
                const currentKey = key.get(entry.to) ?? Number.POSITIVE_INFINITY;

                if (weight < currentKey) {
                    key.set(entry.to, weight);
                    parent.set(entry.to, current);
                    parentEdge.set(entry.to, entry.edge.id);
                    builder.setNode(entry.to, 'frontier');
                    builder.setNodeBadge(entry.to, formatWeight(weight));
                    builder.setEdge(entry.edge.id, 'active');
                    builder.commit({
                        title: `Nova aresta candidata para ${labels.get(entry.to)}`,
                        description: `A aresta {${labels.get(current)}, ${labels.get(entry.to)}} tem peso ${formatWeight(weight)}, menor que o menor peso conhecido até aqui (${formatDistance(currentKey)}). Ela passa a ser a candidata a ligar ${labels.get(entry.to)} a V(T).`,
                        tables: [keyTable(entry.to)],
                        metrics: metrics(),
                    });
                } else {
                    builder.commit({
                        title: `Mantém a candidata de ${labels.get(entry.to)}`,
                        description: `A aresta {${labels.get(current)}, ${labels.get(entry.to)}} tem peso ${formatWeight(weight)}, que não é menor que o menor peso já conhecido (${formatDistance(currentKey)}).`,
                        tables: [keyTable(entry.to)],
                        metrics: metrics(),
                    });
                }
            }
        }

        builder.resetEdgesWithState('active', 'idle');
        builder.resetEdgesWithState('frontier', 'idle');
        graph.nodes.forEach((node) => {
            if (inTree.has(node.id)) builder.setNode(node.id, 'done');
        });

        builder.commit({
            title: 'AGM concluída',
            description: `V(T) = V(G) e a árvore possui ${treeEdges.length} aresta(s), com peso total C(T) = ${formatWeight(totalWeight)}.`,
            tables: [keyTable()],
            metrics: metrics(),
        });

        return builder.build([
            `Peso total da árvore geradora mínima: C(T) = ${formatWeight(totalWeight)}.`,
            `|E(T)| = ${treeEdges.length}. Uma árvore geradora de ${inTree.size} vértices tem exatamente |V| − 1 = ${Math.max(inTree.size - 1, 0)} aresta(s).`,
            inTree.size < graph.nodes.length
                ? 'O grafo é desconexo, portanto o resultado é a AGM apenas do componente conexo que contém a raiz.'
                : 'Todos os vértices foram selecionados: T é uma árvore geradora de G.',
        ]);
    },
};
