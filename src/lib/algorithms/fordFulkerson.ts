import {
    compareLabels,
    formatWeight,
    hasUndirectedEdges,
    nodeLabelMap,
    sortedNodes,
} from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId, TraceTable } from '../graph/types';
import { labelOf, requireEdges, requireNodes } from './shared';

const arcKey = (from: NodeId, to: NodeId) => `${from}>${to}`;

export const fordFulkerson: AlgorithmDefinition = {
    id: 'ford-fulkerson',
    name: 'Ford-Fulkerson',
    shortName: 'Ford-Fulkerson',
    category: 'Fluxo máximo',
    tagline:
        'Aumenta o fluxo por caminhos na rede residual até não existir mais caminho aumentante.',
    complexity: 'O(V · E²) com busca em largura',
    needsStart: true,
    needsEnd: true,
    constraints: [
        'Exige grafo direcionado com capacidades não negativas',
        'Requer um vértice fonte e um vértice sumidouro',
    ],
    validate: (context) => {
        const errors = [...requireNodes(context), ...requireEdges(context)];
        if (!context.startId) errors.push('Selecione o vértice fonte.');
        if (!context.endId) errors.push('Selecione o vértice sumidouro.');
        if (context.startId && context.startId === context.endId) {
            errors.push('A fonte e o sumidouro precisam ser vértices diferentes.');
        }
        if (hasUndirectedEdges(context.graph)) {
            errors.push(
                'Ford-Fulkerson opera sobre redes direcionadas: converta todas as arestas para direcionadas.'
            );
        }
        if (context.graph.edges.some((edge) => edge.weight < 0)) {
            errors.push('As capacidades das arestas não podem ser negativas.');
        }
        return errors;
    },
    run: ({ graph, startId, endId }) => {
        const builder = createTraceBuilder(graph);
        const labels = nodeLabelMap(graph);
        const source = startId as NodeId;
        const sink = endId as NodeId;

        const capacity = new Map<string, number>();
        const residual = new Map<string, number>();

        graph.edges.forEach((edge) => {
            const forward = arcKey(edge.source, edge.target);
            const backward = arcKey(edge.target, edge.source);
            capacity.set(forward, (capacity.get(forward) ?? 0) + edge.weight);
            residual.set(forward, (residual.get(forward) ?? 0) + edge.weight);
            if (!residual.has(backward)) residual.set(backward, 0);
            if (!capacity.has(backward)) capacity.set(backward, 0);
        });

        const neighboursOf = (node: NodeId): NodeId[] =>
            sortedNodes(graph)
                .map((candidate) => candidate.id)
                .filter((candidate) => (residual.get(arcKey(node, candidate)) ?? 0) > 0);

        const edgeFlow = (edgeId: string): number => {
            const edge = graph.edges.find((candidate) => candidate.id === edgeId);
            if (!edge) return 0;
            const forward = arcKey(edge.source, edge.target);
            return Math.max(0, (capacity.get(forward) ?? 0) - (residual.get(forward) ?? 0));
        };

        const refreshBadges = () => {
            graph.edges.forEach((edge) => {
                builder.setEdgeBadge(
                    edge.id,
                    `${formatWeight(edgeFlow(edge.id))}/${formatWeight(edge.weight)}`
                );
            });
        };

        const residualTable = (): TraceTable => ({
            id: 'residual',
            title: 'Capacidades residuais',
            columns: [
                { key: 'arc', label: 'Arco' },
                { key: 'flow', label: 'Fluxo' },
                { key: 'capacityValue', label: 'Capacidade' },
                { key: 'residualValue', label: 'Residual' },
            ],
            rows: [...graph.edges]
                .sort((a, b) =>
                    compareLabels(labels.get(a.source) ?? '', labels.get(b.source) ?? '')
                )
                .map((edge) => {
                    const flow = edgeFlow(edge.id);
                    return {
                        key: edge.id,
                        emphasis: flow > 0 ? ('done' as const) : undefined,
                        cells: {
                            arc: `${labels.get(edge.source)} → ${labels.get(edge.target)}`,
                            flow: formatWeight(flow),
                            capacityValue: formatWeight(edge.weight),
                            residualValue: formatWeight(
                                residual.get(arcKey(edge.source, edge.target)) ?? 0
                            ),
                        },
                    };
                }),
        });

        let maxFlow = 0;
        let iteration = 0;
        const augmentingPaths: string[] = [];

        refreshBadges();
        builder.setNode(source, 'active');
        builder.setNode(sink, 'path');
        builder.setNodeBadge(source, 'fonte');
        builder.setNodeBadge(sink, 'sumidouro');

        builder.commit({
            title: 'Rede residual inicial',
            description: `Todo o fluxo começa em zero, portanto a capacidade residual de cada arco é igual à sua capacidade. A fonte é ${labelOf(graph, source)} e o sumidouro é ${labelOf(graph, sink)}.`,
            tables: [residualTable()],
            metrics: [{ label: 'Fluxo máximo', value: '0' }],
        });

        const iterationLimit = graph.nodes.length * graph.edges.length + 50;

        while (iteration < iterationLimit) {
            iteration += 1;
            const parent = new Map<NodeId, NodeId | null>();
            const visited = new Set<NodeId>([source]);
            const queue: NodeId[] = [source];
            parent.set(source, null);

            while (queue.length > 0) {
                const current = queue.shift() as NodeId;
                if (current === sink) break;
                neighboursOf(current).forEach((neighbour) => {
                    if (visited.has(neighbour)) return;
                    visited.add(neighbour);
                    parent.set(neighbour, current);
                    queue.push(neighbour);
                });
            }

            if (!visited.has(sink)) {
                builder.resetEdgesWithState('active', 'idle');
                builder.resetEdgesWithState('path', 'idle');

                const cutEdges = graph.edges.filter(
                    (edge) => visited.has(edge.source) && !visited.has(edge.target)
                );
                cutEdges.forEach((edge) => builder.setEdge(edge.id, 'reject'));
                sortedNodes(graph).forEach((node) => {
                    builder.setNode(node.id, visited.has(node.id) ? 'active' : 'done');
                    builder.setNodeGroup(node.id, visited.has(node.id) ? 0 : 1);
                });

                builder.commit({
                    title: 'Nenhum caminho aumentante restante',
                    description: `A busca a partir da fonte alcança apenas ${[...visited].map((id) => labels.get(id)).join(', ')}. Esse conjunto define o corte mínimo, cujas arestas estão destacadas em vermelho.`,
                    tables: [residualTable()],
                    metrics: [
                        { label: 'Fluxo máximo', value: formatWeight(maxFlow) },
                        {
                            label: 'Capacidade do corte',
                            value: formatWeight(
                                cutEdges.reduce((total, edge) => total + edge.weight, 0)
                            ),
                        },
                    ],
                });

                return builder.build([
                    `Fluxo máximo da rede: ${formatWeight(maxFlow)}.`,
                    `Foram usados ${augmentingPaths.length} caminho(s) aumentante(s): ${augmentingPaths.join(' | ') || '—'}.`,
                    `Corte mínimo: ${cutEdges.map((edge) => `${labels.get(edge.source)}→${labels.get(edge.target)}`).join(', ') || '—'}, com capacidade ${formatWeight(cutEdges.reduce((total, edge) => total + edge.weight, 0))}, confirmando o teorema fluxo máximo/corte mínimo.`,
                ]);
            }

            const path: NodeId[] = [];
            let cursor: NodeId | null = sink;
            while (cursor) {
                path.unshift(cursor);
                cursor = parent.get(cursor) ?? null;
            }

            let bottleneck = Number.POSITIVE_INFINITY;
            for (let position = 0; position < path.length - 1; position += 1) {
                bottleneck = Math.min(
                    bottleneck,
                    residual.get(arcKey(path[position], path[position + 1])) ?? 0
                );
            }

            builder.resetEdgesWithState('path', 'idle');
            builder.resetEdgesWithState('active', 'idle');
            const pathLabel = path.map((id) => labels.get(id)).join(' → ');

            for (let position = 0; position < path.length - 1; position += 1) {
                const from = path[position];
                const to = path[position + 1];
                const edge = graph.edges.find(
                    (candidate) =>
                        (candidate.source === from && candidate.target === to) ||
                        (candidate.source === to && candidate.target === from)
                );
                if (edge) builder.setEdge(edge.id, 'path');
            }
            path.forEach((nodeId) => builder.setNode(nodeId, 'path'));

            builder.commit({
                title: `Caminho aumentante ${iteration}: ${pathLabel}`,
                description: `A busca em largura na rede residual encontrou o caminho ${pathLabel}. O gargalo é a menor capacidade residual do caminho: ${formatWeight(bottleneck)}.`,
                tables: [residualTable()],
                metrics: [
                    { label: 'Fluxo máximo', value: formatWeight(maxFlow) },
                    { label: 'Gargalo', value: formatWeight(bottleneck) },
                ],
            });

            for (let position = 0; position < path.length - 1; position += 1) {
                const from = path[position];
                const to = path[position + 1];
                residual.set(arcKey(from, to), (residual.get(arcKey(from, to)) ?? 0) - bottleneck);
                residual.set(arcKey(to, from), (residual.get(arcKey(to, from)) ?? 0) + bottleneck);
            }

            maxFlow += bottleneck;
            augmentingPaths.push(`${pathLabel} (+${formatWeight(bottleneck)})`);
            refreshBadges();

            builder.commit({
                title: `Fluxo aumentado em ${formatWeight(bottleneck)}`,
                description: `Cada arco do caminho perde ${formatWeight(bottleneck)} de capacidade residual e o arco reverso ganha a mesma quantia, permitindo desfazer o envio em iterações futuras. O fluxo total passa a ser ${formatWeight(maxFlow)}.`,
                tables: [residualTable()],
                metrics: [{ label: 'Fluxo máximo', value: formatWeight(maxFlow) }],
            });
        }

        return builder.build([
            `Fluxo alcançado: ${formatWeight(maxFlow)} após ${iteration} iterações.`,
            'O limite de iterações foi atingido: revise as capacidades da rede.',
        ]);
    },
};
