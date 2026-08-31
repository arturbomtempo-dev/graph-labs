import {
    compareLabels,
    formatDistance,
    formatWeight,
    nodeLabelMap,
    sortedNodes,
} from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, GraphEdge, NodeId } from '../graph/types';
import {
    distanceTable,
    edgesAlongPath,
    labelOf,
    pathFromParents,
    requireEdges,
    requireNodes,
    requireStart,
} from './shared';

interface Arc {
    edge: GraphEdge;
    from: NodeId;
    to: NodeId;
}

export const bellmanFord: AlgorithmDefinition = {
    id: 'bellman-ford',
    name: 'Bellman-Ford',
    shortName: 'Bellman-Ford',
    category: 'Caminhos mínimos',
    tagline: 'Relaxa todas as arestas V−1 vezes e detecta ciclos de peso negativo.',
    complexity: 'O(V · E)',
    needsStart: true,
    needsEnd: false,
    constraints: [
        'Aceita pesos negativos',
        'Detecta ciclos negativos alcançáveis a partir da origem',
    ],
    validate: (context) => [
        ...requireNodes(context),
        ...requireEdges(context),
        ...requireStart(context),
    ],
    run: ({ graph, startId, endId }) => {
        const builder = createTraceBuilder(graph);
        const labels = nodeLabelMap(graph);
        const source = startId as NodeId;

        const arcs: Arc[] = [];
        graph.edges.forEach((edge) => {
            arcs.push({ edge, from: edge.source, to: edge.target });
            if (!edge.directed) arcs.push({ edge, from: edge.target, to: edge.source });
        });
        arcs.sort((a, b) => {
            const bySource = compareLabels(labels.get(a.from) ?? '', labels.get(b.from) ?? '');
            if (bySource !== 0) return bySource;
            return compareLabels(labels.get(a.to) ?? '', labels.get(b.to) ?? '');
        });

        const distance = new Map<NodeId, number>();
        const parent = new Map<NodeId, NodeId | null>();
        graph.nodes.forEach((node) => {
            distance.set(node.id, Number.POSITIVE_INFINITY);
            parent.set(node.id, null);
        });
        distance.set(source, 0);
        builder.setNode(source, 'active');
        builder.setNodeBadge(source, '0');

        const table = (highlight?: NodeId) =>
            distanceTable(graph, distance, parent, {
                id: 'bf-table',
                title: 'Distâncias e predecessores',
                distanceLabel: 'd',
                highlight: highlight ? new Set([highlight]) : undefined,
            });

        const arcList = () => ({
            id: 'arc-order',
            title: 'Ordem de relaxamento',
            variant: 'queue' as const,
            items: arcs.map(
                (arc) =>
                    `${labels.get(arc.from)}→${labels.get(arc.to)} (${formatWeight(arc.edge.weight)})`
            ),
        });

        builder.commit({
            title: 'Inicialização',
            description: `d(${labelOf(graph, source)}) = 0 e todas as demais distâncias começam em ∞. Cada aresta não direcionada é tratada como dois arcos opostos.`,
            tables: [table()],
            lists: [arcList()],
        });

        const rounds = Math.max(graph.nodes.length - 1, 0);
        let lastRoundWithChange = 0;

        for (let round = 1; round <= rounds; round += 1) {
            let changed = false;
            builder.commit({
                title: `Iteração ${round} de ${rounds}`,
                description: `Todas as ${arcs.length} arestas serão relaxadas nesta passagem, sempre na mesma ordem.`,
                tables: [table()],
                lists: [arcList()],
                metrics: [{ label: 'Iteração', value: `${round} / ${rounds}` }],
            });

            for (const arc of arcs) {
                const fromDistance = distance.get(arc.from) ?? Number.POSITIVE_INFINITY;
                if (!Number.isFinite(fromDistance)) continue;

                const candidate = fromDistance + arc.edge.weight;
                const currentDistance = distance.get(arc.to) ?? Number.POSITIVE_INFINITY;
                builder.resetEdgesWithState('active', 'idle');
                builder.setEdge(arc.edge.id, 'active');

                if (candidate < currentDistance) {
                    distance.set(arc.to, candidate);
                    parent.set(arc.to, arc.from);
                    changed = true;
                    lastRoundWithChange = round;
                    builder.setNode(arc.to, 'frontier');
                    builder.setNodeBadge(arc.to, formatWeight(candidate));
                    builder.commit({
                        title: `Relaxa ${labels.get(arc.from)} → ${labels.get(arc.to)}`,
                        description: `${formatWeight(fromDistance)} + ${formatWeight(arc.edge.weight)} = ${formatWeight(candidate)} melhora ${formatDistance(currentDistance)}. A distância de ${labels.get(arc.to)} é atualizada.`,
                        tables: [table(arc.to)],
                        lists: [arcList()],
                        metrics: [{ label: 'Iteração', value: `${round} / ${rounds}` }],
                    });
                }
            }

            builder.resetEdgesWithState('active', 'idle');
            if (!changed) {
                builder.commit({
                    title: `Iteração ${round} sem alterações`,
                    description:
                        'Nenhuma distância mudou nesta passagem, portanto as distâncias já convergiram e as iterações restantes seriam redundantes.',
                    tables: [table()],
                });
                break;
            }
        }

        graph.nodes.forEach((node) => {
            if (Number.isFinite(distance.get(node.id) ?? Infinity)) {
                builder.setNode(node.id, 'done');
            }
        });

        builder.commit({
            title: 'Verificação de ciclo negativo',
            description:
                'Uma passagem adicional é executada: se alguma aresta ainda puder ser relaxada, existe um ciclo de peso negativo alcançável a partir da origem.',
            tables: [table()],
        });

        const negativeArcs: Arc[] = [];
        for (const arc of arcs) {
            const fromDistance = distance.get(arc.from) ?? Number.POSITIVE_INFINITY;
            if (!Number.isFinite(fromDistance)) continue;
            const candidate = fromDistance + arc.edge.weight;
            if (candidate < (distance.get(arc.to) ?? Number.POSITIVE_INFINITY)) {
                negativeArcs.push(arc);
                builder.setEdge(arc.edge.id, 'reject');
                builder.setNode(arc.to, 'reject');
                builder.commit({
                    title: `Ciclo negativo detectado em ${labels.get(arc.from)} → ${labels.get(arc.to)}`,
                    description: `A aresta ainda admite relaxamento (${formatWeight(fromDistance)} + ${formatWeight(arc.edge.weight)} < ${formatDistance(distance.get(arc.to) ?? Infinity)}), o que só é possível se houver um ciclo de peso negativo alcançável.`,
                    tables: [table(arc.to)],
                });
            }
        }

        const conclusions: string[] = [];

        if (negativeArcs.length > 0) {
            conclusions.push(
                'Existe ciclo de peso negativo alcançável a partir da origem: não há caminho mínimo bem definido para os vértices afetados.'
            );
            builder.commit({
                title: 'Resultado inválido por ciclo negativo',
                description: `${negativeArcs.length} aresta(s) ainda admitem relaxamento após ${rounds} iterações.`,
                tables: [table()],
            });
        } else {
            conclusions.push(
                `Distâncias finais a partir de ${labelOf(graph, source)}: ${sortedNodes(graph)
                    .map(
                        (node) =>
                            `${node.label} = ${formatDistance(distance.get(node.id) ?? Number.POSITIVE_INFINITY)}`
                    )
                    .join(', ')}.`
            );
            conclusions.push(
                `As distâncias convergiram na iteração ${lastRoundWithChange || 1} de ${rounds}.`
            );

            if (endId && Number.isFinite(distance.get(endId) ?? Infinity)) {
                const path = pathFromParents(parent, endId);
                if (path) {
                    edgesAlongPath(graph, path).forEach((edgeId) =>
                        builder.setEdge(edgeId, 'path')
                    );
                    path.forEach((nodeId) => builder.setNode(nodeId, 'path'));
                    conclusions.push(
                        `Caminho mínimo até ${labelOf(graph, endId)}: ${path.map((id) => labels.get(id)).join(' → ')}.`
                    );
                }
            }

            builder.commit({
                title: 'Caminhos mínimos calculados',
                description:
                    'Nenhuma aresta admite relaxamento adicional, portanto as distâncias são ótimas.',
                tables: [table()],
            });
        }

        return builder.build(conclusions);
    },
};
