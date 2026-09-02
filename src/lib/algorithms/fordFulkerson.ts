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
    name: 'Método de Ford-Fulkerson',
    shortName: 'Ford-Fulkerson',
    category: 'Fluxo máximo',
    tagline:
        'Enquanto existir caminho aumentante na rede residual G′(f), envia por ele o gargalo δ e atualiza a rede residual.',
    complexity: 'O(m · f) com capacidades inteiras',
    needsStart: true,
    needsEnd: true,
    constraints: [
        'Exige rede de fluxo: grafo direcionado com capacidade u(e) > 0',
        'Requer uma fonte s e um sumidouro t',
        'Respeita as condições de capacidade e de conservação',
    ],
    validate: (context) => {
        const errors = [...requireNodes(context), ...requireEdges(context)];
        if (!context.startId) errors.push('Selecione o vértice fonte s.');
        if (!context.endId) errors.push('Selecione o vértice sumidouro t.');
        if (context.startId && context.startId === context.endId) {
            errors.push('A fonte s e o sumidouro t precisam ser vértices diferentes.');
        }
        if (hasUndirectedEdges(context.graph)) {
            errors.push(
                'Uma rede de fluxo é um grafo direcionado: converta todas as arestas para direcionadas.'
            );
        }
        if (context.graph.edges.some((edge) => edge.weight < 0)) {
            errors.push('Em uma rede de fluxo, toda aresta tem capacidade u(e) > 0.');
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
            title: 'Fluxo e capacidades residuais',
            columns: [
                { key: 'arc', label: 'Aresta e' },
                { key: 'flow', label: 'f(e)' },
                { key: 'capacityValue', label: 'u(e)' },
                { key: 'residualValue', label: 'u_r(e)' },
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
        builder.setNodeBadge(source, 's');
        builder.setNodeBadge(sink, 't');

        builder.commit({
            title: 'Rede residual inicial G′(f)',
            description: `f(e) = 0 para toda aresta, portanto a capacidade residual de cada aresta direta é u_r(e) = u(e) − f(e) = u(e). A fonte é s = ${labelOf(graph, source)}, o sumidouro é t = ${labelOf(graph, sink)} e os demais são nós internos.`,
            tables: [residualTable()],
            metrics: [{ label: 'Valor do fluxo', value: '0' }],
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
                    title: 'Não existe caminho aumentante em G′(f)',
                    description: `Em G′(f), a partir de s alcança-se apenas S = { ${[...visited].map((id) => labels.get(id)).join(', ')} }. Esse é o conjunto S do corte s-t mínimo, e as arestas de corte(S) — com uma extremidade em S e a outra fora — estão destacadas em vermelho.`,
                    tables: [residualTable()],
                    metrics: [
                        { label: 'Valor do fluxo', value: formatWeight(maxFlow) },
                        {
                            label: 'Capacidade do corte(S)',
                            value: formatWeight(
                                cutEdges.reduce((total, edge) => total + edge.weight, 0)
                            ),
                        },
                    ],
                });

                return builder.build([
                    `Fluxo máximo entre s = ${labelOf(graph, source)} e t = ${labelOf(graph, sink)}: ${formatWeight(maxFlow)}.`,
                    `Foram usados ${augmentingPaths.length} caminho(s) aumentante(s): ${augmentingPaths.join(' | ') || '—'}.`,
                    `Corte s-t mínimo: corte(S) = { ${cutEdges.map((edge) => `(${labels.get(edge.source)}, ${labels.get(edge.target)})`).join(', ') || '—'} }, de capacidade ${formatWeight(cutEdges.reduce((total, edge) => total + edge.weight, 0))} — igual ao valor do fluxo máximo, como afirma o teorema do fluxo máximo e corte mínimo.`,
                    'Na solução ótima, S é exatamente o conjunto dos vértices alcançáveis a partir da fonte s na rede residual final.',
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
                description: `Existe um caminho P de s a t em G′(f): ${pathLabel}. O gargalo é δ = min { u_r(e) | e ∈ P } = ${formatWeight(bottleneck)}. (Escolher sempre o caminho aumentante com menos arestas, como aqui, é o refinamento de Edmonds-Karp.)`,
                tables: [residualTable()],
                metrics: [
                    { label: 'Valor do fluxo', value: formatWeight(maxFlow) },
                    { label: 'Gargalo δ', value: formatWeight(bottleneck) },
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
                title: `Fluxo aumentado em δ = ${formatWeight(bottleneck)}`,
                description: `Nas arestas diretas de P faz-se f(v, w) ← f(v, w) + δ; nas reversas, f(w, v) ← f(w, v) − δ. A rede residual G′(f) é então atualizada: cada aresta direta perde ${formatWeight(bottleneck)} de capacidade residual e a reversa correspondente ganha a mesma quantia, o que permite desfazer o envio em iterações futuras. O valor do fluxo passa a ser ${formatWeight(maxFlow)}.`,
                tables: [residualTable()],
                metrics: [{ label: 'Valor do fluxo', value: formatWeight(maxFlow) }],
            });
        }

        return builder.build([
            `Valor do fluxo alcançado: ${formatWeight(maxFlow)} após ${iteration} iterações.`,
            'O limite de iterações foi atingido: revise as capacidades da rede.',
        ]);
    },
};
