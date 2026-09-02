import { formatWeight, nodeLabelMap } from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId, TraceTable } from '../graph/types';
import {
    applyPath,
    bottleneckOf,
    createResidualNetwork,
    flowNetworkErrors,
    reachableFromSource,
    residualTable,
    type ResidualNetwork,
} from './flowShared';
import { labelOf } from './shared';

function levels(network: ResidualNetwork, source: NodeId): Map<NodeId, number> {
    const dist = new Map<NodeId, number>([[source, 0]]);
    const queue: NodeId[] = [source];
    while (queue.length > 0) {
        const current = queue.shift() as NodeId;
        network.neighboursOf(current).forEach((neighbour) => {
            if (dist.has(neighbour)) return;
            dist.set(neighbour, (dist.get(current) as number) + 1);
            queue.push(neighbour);
        });
    }
    return dist;
}

export const dinic: AlgorithmDefinition = {
    id: 'dinic',
    name: 'Método de Dinic',
    shortName: 'Dinic',
    category: 'Fluxo máximo',
    tagline:
        'A cada iteração constrói a rede em níveis GL a partir de G′(f) e determina nela um fluxo de bloqueio.',
    complexity: 'O(n² · m)',
    needsStart: true,
    needsEnd: true,
    constraints: [
        'Exige rede de fluxo: grafo direcionado com capacidade u(e) > 0',
        'Requer uma fonte s e um sumidouro t',
        'No máximo n − 1 fluxos de bloqueio',
    ],
    validate: (context) => flowNetworkErrors(context, 'o método de Dinic'),
    run: ({ graph, startId, endId }) => {
        const builder = createTraceBuilder(graph);
        const labels = nodeLabelMap(graph);
        const network = createResidualNetwork(graph);
        const source = startId as NodeId;
        const sink = endId as NodeId;

        let maxFlow = 0;
        let phase = 0;
        const blockingFlows: string[] = [];

        const refreshBadges = () => {
            graph.edges.forEach((edge) => {
                builder.setEdgeBadge(
                    edge.id,
                    `${formatWeight(network.edgeFlow(edge.id))}/${formatWeight(edge.weight)}`
                );
            });
        };

        const levelTable = (dist: Map<NodeId, number>): TraceTable => ({
            id: 'dinic-levels',
            title: 'Rede em níveis GL',
            columns: [
                { key: 'vertex', label: 'Vértice' },
                { key: 'dist', label: 'dist(v)' },
            ],
            rows: network.order.map((id) => ({
                key: id,
                emphasis: id === sink ? 'active' : dist.has(id) ? 'done' : undefined,
                cells: {
                    vertex: labels.get(id) ?? '',
                    dist: dist.has(id) ? String(dist.get(id)) : '∞',
                },
            })),
        });

        refreshBadges();
        builder.setNodeBadge(source, 's');
        builder.setNodeBadge(sink, 't');

        builder.commit({
            title: 'Rede residual inicial G′(f)',
            description: `f(e) = 0 para toda aresta, portanto u_r(e) = u(e). A fonte é s = ${labelOf(graph, source)} e o sumidouro é t = ${labelOf(graph, sink)}.`,
            tables: [residualTable(graph, network)],
            metrics: [{ label: 'Valor do fluxo', value: '0' }],
        });

        const phaseLimit = graph.nodes.length + 2;

        while (phase < phaseLimit) {
            const dist = levels(network, source);

            const inLevelGraph = (from: NodeId, to: NodeId) =>
                network.residualOf(from, to) > 0 &&
                dist.has(from) &&
                dist.has(to) &&
                (dist.get(to) as number) === (dist.get(from) as number) + 1;

            graph.nodes.forEach((node) => {
                const level = dist.get(node.id);
                builder.setNode(node.id, level === undefined ? 'idle' : 'frontier');
                if (node.id !== source && node.id !== sink) {
                    builder.setNodeBadge(node.id, level === undefined ? 'dist ∞' : `dist ${level}`);
                }
                if (level !== undefined) builder.setNodeGroup(node.id, level);
            });
            builder.resetEdgesWithState('path', 'idle');
            builder.resetEdgesWithState('active', 'idle');
            graph.edges.forEach((edge) => {
                builder.setEdge(
                    edge.id,
                    inLevelGraph(edge.source, edge.target) ? 'frontier' : 'idle'
                );
            });

            if (!dist.has(sink)) {
                const inCut = reachableFromSource(network, source);
                const cutEdges = graph.edges.filter(
                    (edge) => inCut.has(edge.source) && !inCut.has(edge.target)
                );
                const cutCapacity = cutEdges.reduce((total, edge) => total + edge.weight, 0);

                graph.edges.forEach((edge) => builder.setEdge(edge.id, 'idle'));
                cutEdges.forEach((edge) => builder.setEdge(edge.id, 'reject'));
                graph.nodes.forEach((node) => {
                    builder.setNode(node.id, inCut.has(node.id) ? 'active' : 'done');
                    builder.setNodeGroup(node.id, inCut.has(node.id) ? 0 : 1);
                });

                builder.commit({
                    title: 'dist(t) = ∞, o laço termina',
                    description: `O sumidouro não é mais alcançável em G′(f), portanto não existe caminho aumentante nem fluxo de bloqueio. O conjunto S = { ${[
                        ...inCut,
                    ]
                        .map((id) => labels.get(id))
                        .join(', ')} } define o corte s-t mínimo.`,
                    tables: [residualTable(graph, network)],
                    metrics: [
                        { label: 'Valor do fluxo', value: formatWeight(maxFlow) },
                        { label: 'Capacidade do corte(S)', value: formatWeight(cutCapacity) },
                        { label: 'Fluxos de bloqueio', value: String(phase) },
                    ],
                });

                return builder.build([
                    `Fluxo máximo entre s = ${labelOf(graph, source)} e t = ${labelOf(graph, sink)}: ${formatWeight(maxFlow)}.`,
                    `Foram necessários ${phase} fluxo(s) de bloqueio: ${blockingFlows.join(' | ') || '-'}.`,
                    `Corte s-t mínimo: corte(S) = { ${
                        cutEdges
                            .map(
                                (edge) => `(${labels.get(edge.source)}, ${labels.get(edge.target)})`
                            )
                            .join(', ') || '-'
                    } }, de capacidade ${formatWeight(cutCapacity)}, igual ao valor do fluxo máximo.`,
                    'O número de níveis aumenta pelo menos uma unidade a cada fluxo de bloqueio, portanto existem no máximo n − 1 iterações.',
                ]);
            }

            phase += 1;

            builder.commit({
                title: `Rede em níveis ${phase}: dist(t) = ${dist.get(sink)}`,
                description: `Uma busca em largura em G′(f) define dist(v) para cada vértice. GL contém apenas as arestas (v, w) de G′(f) com dist(w) = dist(v) + 1, destacadas em laranja. Todo caminho de s a t em GL tem exatamente ${dist.get(sink)} aresta(s).`,
                tables: [levelTable(dist), residualTable(graph, network)],
                metrics: [
                    { label: 'Valor do fluxo', value: formatWeight(maxFlow) },
                    { label: 'dist(t)', value: String(dist.get(sink)) },
                ],
            });

            let blocking = 0;
            let pathsInPhase = 0;
            let guard = 0;
            const guardLimit = graph.edges.length * graph.nodes.length + 50;

            for (;;) {
                guard += 1;
                if (guard > guardLimit) break;

                const parent = new Map<NodeId, NodeId | null>([[source, null]]);
                const visited = new Set<NodeId>([source]);
                const stack: NodeId[] = [source];
                let found = false;

                while (stack.length > 0 && !found) {
                    const current = stack.pop() as NodeId;
                    if (current === sink) {
                        found = true;
                        break;
                    }
                    [...network.order]
                        .filter((candidate) => inLevelGraph(current, candidate))
                        .reverse()
                        .forEach((neighbour) => {
                            if (visited.has(neighbour)) return;
                            visited.add(neighbour);
                            parent.set(neighbour, current);
                            stack.push(neighbour);
                        });
                }

                if (!found && !visited.has(sink)) break;

                const path: NodeId[] = [];
                let cursor: NodeId | null = sink;
                while (cursor) {
                    path.unshift(cursor);
                    cursor = parent.get(cursor) ?? null;
                }
                if (path[0] !== source) break;

                const bottleneck = bottleneckOf(network, path);
                if (!Number.isFinite(bottleneck) || bottleneck <= 0) break;

                const pathLabel = path.map((id) => labels.get(id)).join(' → ');
                builder.resetEdgesWithState('path', 'idle');
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

                applyPath(network, path, bottleneck);
                blocking += bottleneck;
                maxFlow += bottleneck;
                pathsInPhase += 1;
                refreshBadges();

                builder.commit({
                    title: `Fluxo de bloqueio ${phase}, caminho ${pathsInPhase}: ${pathLabel}`,
                    description: `Em GL há o caminho ${pathLabel}, com gargalo δ = ${formatWeight(bottleneck)}. Após o envio, pelo menos uma de suas arestas satura e deixa de pertencer a GL, o que faz o fluxo de bloqueio avançar.`,
                    tables: [levelTable(dist), residualTable(graph, network)],
                    metrics: [
                        { label: 'Valor do fluxo', value: formatWeight(maxFlow) },
                        { label: 'Fluxo de bloqueio', value: formatWeight(blocking) },
                    ],
                });
            }

            blockingFlows.push(`fb${phase} = ${formatWeight(blocking)}`);

            builder.resetEdgesWithState('path', 'idle');
            builder.commit({
                title: `Fluxo de bloqueio ${phase} determinado: fb = ${formatWeight(blocking)}`,
                description: `Não há mais caminho de s a t em GL: o fluxo de bloqueio está completo, com ${pathsInPhase} caminho(s) e valor ${formatWeight(blocking)}. O fluxo f é atualizado, e uma nova rede residual e uma nova rede em níveis são construídas.`,
                tables: [residualTable(graph, network)],
                metrics: [{ label: 'Valor do fluxo', value: formatWeight(maxFlow) }],
            });
        }

        return builder.build([
            `Valor do fluxo alcançado: ${formatWeight(maxFlow)} após ${phase} fluxo(s) de bloqueio.`,
            'O limite de iterações foi atingido: revise as capacidades da rede.',
        ]);
    },
};
