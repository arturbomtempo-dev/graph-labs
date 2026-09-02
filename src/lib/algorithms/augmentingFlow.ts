import { formatWeight, nodeLabelMap, weightOf } from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmTrace, Graph, NodeId } from '../graph/types';
import {
    applyPath,
    bottleneckOf,
    createResidualNetwork,
    reachableFromSource,
    residualTable,
    type ResidualNetwork,
} from './flowShared';
import { labelOf } from './shared';

export interface AugmentingMethodOptions {
    findPath: (network: ResidualNetwork, source: NodeId, sink: NodeId) => NodeId[] | null;

    explainChoice: (pathLabel: string, edgeCount: number) => string;
    methodName: string;
}

export function runAugmentingMethod(
    graph: Graph,
    source: NodeId,
    sink: NodeId,
    options: AugmentingMethodOptions,
    order?: NodeId[]
): AlgorithmTrace {
    const builder = createTraceBuilder(graph);
    const labels = nodeLabelMap(graph);
    const network = createResidualNetwork(graph, order);

    let maxFlow = 0;
    let iteration = 0;
    const augmentingPaths: string[] = [];

    const refreshBadges = () => {
        graph.edges.forEach((edge) => {
            builder.setEdgeBadge(
                edge.id,
                `${formatWeight(network.edgeFlow(edge.id))}/${formatWeight(weightOf(edge))}`
            );
        });
    };

    refreshBadges();
    builder.setNode(source, 'active');
    builder.setNode(sink, 'path');
    builder.setNodeBadge(source, 's');
    builder.setNodeBadge(sink, 't');

    builder.commit({
        title: "Rede residual inicial G'(f)",
        description: `f(e) = 0 para toda aresta, portanto a capacidade residual de cada aresta direta é u_r(e) = u(e) − f(e) = u(e). A fonte é s = ${labelOf(graph, source)}, o sumidouro é t = ${labelOf(graph, sink)} e os demais são nós internos.`,
        tables: [residualTable(graph, network)],
        metrics: [{ label: 'Valor do fluxo', value: '0' }],
    });

    const totalCapacity = graph.edges.reduce(
        (total, edge) => total + Math.max(0, weightOf(edge)),
        0
    );
    const iterationLimit = Math.min(2000, Math.ceil(totalCapacity) + graph.edges.length + 50);

    while (iteration < iterationLimit) {
        const path = options.findPath(network, source, sink);

        if (!path) {
            builder.resetEdgesWithState('active', 'idle');
            builder.resetEdgesWithState('path', 'idle');

            const inCut = reachableFromSource(network, source);
            const cutEdges = graph.edges.filter(
                (edge) => inCut.has(edge.source) && !inCut.has(edge.target)
            );
            const cutCapacity = cutEdges.reduce((total, edge) => total + weightOf(edge), 0);

            cutEdges.forEach((edge) => builder.setEdge(edge.id, 'reject'));
            graph.nodes.forEach((node) => {
                builder.setNode(node.id, inCut.has(node.id) ? 'active' : 'done');
                builder.setNodeGroup(node.id, inCut.has(node.id) ? 0 : 1);
            });

            builder.commit({
                title: "Não existe caminho aumentante em G'(f)",
                description: `Em G'(f), a partir de s alcança-se apenas S = { ${[...inCut]
                    .map((id) => labels.get(id))
                    .join(
                        ', '
                    )} }. Esse é o conjunto S do corte s-t mínimo, e as arestas de corte(S), com uma extremidade em S e a outra fora, estão destacadas em vermelho.`,
                tables: [residualTable(graph, network)],
                metrics: [
                    { label: 'Valor do fluxo', value: formatWeight(maxFlow) },
                    { label: 'Capacidade do corte(S)', value: formatWeight(cutCapacity) },
                    { label: 'Caminhos aumentantes', value: String(augmentingPaths.length) },
                ],
            });

            return builder.build([
                `Fluxo máximo entre s = ${labelOf(graph, source)} e t = ${labelOf(graph, sink)}: ${formatWeight(maxFlow)}.`,
                `${options.methodName} usou ${augmentingPaths.length} caminho(s) aumentante(s): ${augmentingPaths.join(' | ') || '-'}.`,
                `Corte s-t mínimo: corte(S) = { ${
                    cutEdges
                        .map((edge) => `(${labels.get(edge.source)}, ${labels.get(edge.target)})`)
                        .join(', ') || '-'
                } }, de capacidade ${formatWeight(cutCapacity)}, igual ao valor do fluxo máximo, como afirma o teorema do fluxo máximo e corte mínimo.`,
            ]);
        }

        iteration += 1;
        const bottleneck = bottleneckOf(network, path);
        const pathLabel = path.map((id) => labels.get(id)).join(' → ');

        builder.resetEdgesWithState('path', 'idle');
        builder.resetEdgesWithState('active', 'idle');
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
            description: `${options.explainChoice(pathLabel, path.length - 1)} O gargalo é δ = min { u_r(e) | e ∈ P } = ${formatWeight(bottleneck)}.`,
            tables: [residualTable(graph, network)],
            metrics: [
                { label: 'Valor do fluxo', value: formatWeight(maxFlow) },
                { label: 'Gargalo δ', value: formatWeight(bottleneck) },
                { label: 'Arestas em P', value: String(path.length - 1) },
            ],
        });

        applyPath(network, path, bottleneck);
        maxFlow += bottleneck;
        augmentingPaths.push(`${pathLabel} (+${formatWeight(bottleneck)})`);
        refreshBadges();

        builder.commit({
            title: `Fluxo aumentado em δ = ${formatWeight(bottleneck)}`,
            description: `Nas arestas diretas de P faz-se f(v, w) ← f(v, w) + δ; nas reversas, f(w, v) ← f(w, v) − δ. Cada aresta direta perde ${formatWeight(bottleneck)} de capacidade residual e a reversa correspondente ganha a mesma quantia, o que permite desfazer o envio em iterações futuras. O valor do fluxo passa a ser ${formatWeight(maxFlow)}.`,
            tables: [residualTable(graph, network)],
            metrics: [{ label: 'Valor do fluxo', value: formatWeight(maxFlow) }],
        });
    }

    return builder.build([
        `Valor do fluxo alcançado: ${formatWeight(maxFlow)} após ${iteration} iterações.`,
        'O limite de iterações foi atingido: revise as capacidades da rede.',
    ]);
}
