import {
    buildAdjacency,
    formatDistance,
    formatWeight,
    hasDirectedEdges,
    nodeLabelMap,
    sortedNodes,
} from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId, TraceTable } from '../graph/types';
import { labelOf, requireEdges, requireNodes, requireStart } from './shared';

export const prim: AlgorithmDefinition = {
    id: 'prim',
    name: 'Prim',
    shortName: 'Prim',
    category: 'Árvore geradora mínima',
    tagline: 'Cresce uma única árvore escolhendo sempre a aresta mais leve que sai dela.',
    complexity: 'O(E log V)',
    needsStart: true,
    needsEnd: false,
    constraints: ['Exige grafo não direcionado', 'Usa os pesos das arestas'],
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
    run: ({ graph, startId }) => {
        const builder = createTraceBuilder(graph);
        const adjacency = buildAdjacency(graph);
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
            title: 'Chaves e predecessores',
            columns: [
                { key: 'vertex', label: 'Vértice' },
                { key: 'keyValue', label: 'chave' },
                { key: 'parent', label: 'Predecessor' },
                { key: 'status', label: 'Situação' },
            ],
            rows: sortedNodes(graph).map((node) => ({
                key: node.id,
                emphasis:
                    node.id === highlight ? 'active' : inTree.has(node.id) ? 'done' : undefined,
                cells: {
                    vertex: node.label,
                    keyValue: formatDistance(key.get(node.id) ?? Number.POSITIVE_INFINITY),
                    parent: labels.get(parent.get(node.id) ?? '') ?? '—',
                    status: inTree.has(node.id) ? 'na árvore' : 'na fila',
                },
            })),
        });

        const metrics = () => [
            {
                label: 'Arestas na árvore',
                value: `${treeEdges.length} / ${graph.nodes.length - 1}`,
            },
            { label: 'Peso total', value: formatWeight(totalWeight) },
        ];

        builder.commit({
            title: 'Inicialização',
            description: `Todas as chaves começam em ∞, exceto a raiz ${labelOf(graph, startId)}, que recebe chave 0. Nenhum vértice está na árvore.`,
            tables: [keyTable()],
            metrics: metrics(),
        });

        while (inTree.size < graph.nodes.length) {
            let candidate: NodeId | null = null;
            let bestKey = Number.POSITIVE_INFINITY;
            sortedNodes(graph).forEach((node) => {
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
                        'Não há mais vértices alcançáveis com chave finita: o grafo é desconexo e a árvore geradora cobre apenas a componente da raiz.',
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
                title: `Extrai ${labels.get(current)} (chave ${formatWeight(bestKey)})`,
                description: linkingEdge
                    ? `${labels.get(current)} é o vértice fora da árvore com menor chave. A aresta ${labelOf(graph, parent.get(current))} — ${labels.get(current)} de peso ${formatWeight(bestKey)} entra na árvore geradora mínima.`
                    : `${labels.get(current)} é a raiz e entra na árvore sem aresta associada.`,
                tables: [keyTable(current)],
                metrics: metrics(),
            });

            for (const entry of adjacency.get(current) ?? []) {
                if (inTree.has(entry.to)) continue;
                const weight = entry.edge.weight;
                const currentKey = key.get(entry.to) ?? Number.POSITIVE_INFINITY;

                if (weight < currentKey) {
                    key.set(entry.to, weight);
                    parent.set(entry.to, current);
                    parentEdge.set(entry.to, entry.edge.id);
                    builder.setNode(entry.to, 'frontier');
                    builder.setNodeBadge(entry.to, formatWeight(weight));
                    builder.setEdge(entry.edge.id, 'active');
                    builder.commit({
                        title: `Atualiza chave de ${labels.get(entry.to)}`,
                        description: `A aresta ${labels.get(current)} — ${labels.get(entry.to)} tem peso ${formatWeight(weight)}, menor que a chave anterior (${formatDistance(currentKey)}). A chave e o predecessor são atualizados.`,
                        tables: [keyTable(entry.to)],
                        metrics: metrics(),
                    });
                } else {
                    builder.commit({
                        title: `Mantém chave de ${labels.get(entry.to)}`,
                        description: `A aresta ${labels.get(current)} — ${labels.get(entry.to)} tem peso ${formatWeight(weight)}, que não melhora a chave atual (${formatDistance(currentKey)}).`,
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
            title: 'Árvore geradora mínima concluída',
            description: `A árvore possui ${treeEdges.length} aresta(s) e peso total ${formatWeight(totalWeight)}.`,
            tables: [keyTable()],
            metrics: metrics(),
        });

        return builder.build([
            `Peso total da árvore geradora mínima: ${formatWeight(totalWeight)}.`,
            `Arestas selecionadas: ${treeEdges.length} (uma árvore geradora de ${inTree.size} vértices exige ${Math.max(inTree.size - 1, 0)}).`,
            inTree.size < graph.nodes.length
                ? 'O grafo é desconexo, portanto o resultado é uma árvore geradora da componente que contém a raiz.'
                : 'Todos os vértices foram conectados.',
        ]);
    },
};
