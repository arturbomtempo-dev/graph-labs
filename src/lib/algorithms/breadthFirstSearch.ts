import { buildAdjacency, nodeLabelMap } from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId } from '../graph/types';
import { distanceTable, labelOf, requireNodes, requireStart } from './shared';

export const breadthFirstSearch: AlgorithmDefinition = {
    id: 'bfs',
    name: 'Busca em Largura',
    shortName: 'BFS',
    category: 'Percursos',
    tagline: 'Explora o grafo em camadas usando uma fila FIFO.',
    complexity: 'O(V + E)',
    needsStart: true,
    needsEnd: false,
    constraints: ['Aceita arestas direcionadas e não direcionadas', 'Ignora os pesos das arestas'],
    validate: (context) => [...requireNodes(context), ...requireStart(context)],
    run: ({ graph, startId }) => {
        const builder = createTraceBuilder(graph);
        const adjacency = buildAdjacency(graph);
        const labels = nodeLabelMap(graph);
        const source = startId as NodeId;

        const distance = new Map<NodeId, number>();
        const parent = new Map<NodeId, NodeId | null>();
        graph.nodes.forEach((node) => {
            distance.set(node.id, Number.POSITIVE_INFINITY);
            parent.set(node.id, null);
        });

        const queue: NodeId[] = [];
        const visitOrder: string[] = [];

        const snapshot = (highlight?: NodeId) =>
            distanceTable(graph, distance, parent, {
                id: 'bfs-table',
                title: 'Distância e predecessor',
                distanceLabel: 'd (arestas)',
                highlight: highlight ? new Set([highlight]) : undefined,
            });

        const queueList = () => ({
            id: 'queue',
            title: 'Fila (FIFO)',
            variant: 'queue' as const,
            items: queue.map((id) => labels.get(id) ?? ''),
        });

        builder.commit({
            title: 'Inicialização',
            description: `Todos os vértices começam com distância ∞ e sem predecessor. A origem ${labelOf(graph, source)} recebe distância 0.`,
            tables: [snapshot()],
            lists: [queueList()],
        });

        distance.set(source, 0);
        builder.setNode(source, 'frontier');
        builder.setNodeBadge(source, '0');
        queue.push(source);

        builder.commit({
            title: `Enfileira ${labelOf(graph, source)}`,
            description: `A origem é descoberta (cinza) e entra na fila com d = 0.`,
            tables: [snapshot(source)],
            lists: [queueList()],
        });

        while (queue.length > 0) {
            const current = queue.shift() as NodeId;
            builder.resetEdgesWithState('active', 'idle');
            builder.resetEdgesWithState('reject', 'idle');
            builder.setNode(current, 'active');
            visitOrder.push(labels.get(current) ?? '');

            builder.commit({
                title: `Desenfileira ${labelOf(graph, current)}`,
                description: `${labelOf(graph, current)} sai da fila e passa a ser o vértice em análise. Seus vizinhos serão examinados em ordem alfabética.`,
                tables: [snapshot(current)],
                lists: [queueList()],
                metrics: [{ label: 'Ordem de visita', value: visitOrder.join(' → ') }],
            });

            const neighbours = adjacency.get(current) ?? [];
            for (const entry of neighbours) {
                const isNew = !Number.isFinite(distance.get(entry.to) ?? Infinity);

                if (isNew) {
                    distance.set(entry.to, (distance.get(current) ?? 0) + 1);
                    parent.set(entry.to, current);
                    queue.push(entry.to);
                    builder.setNode(entry.to, 'frontier');
                    builder.setNodeBadge(entry.to, String(distance.get(entry.to)));
                    builder.setEdge(entry.edge.id, 'done');

                    builder.commit({
                        title: `Descobre ${labelOf(graph, entry.to)}`,
                        description: `${labelOf(graph, entry.to)} ainda não havia sido descoberto: d = ${distance.get(entry.to)}, predecessor = ${labelOf(graph, current)}. A aresta entra na árvore de busca e o vértice é enfileirado.`,
                        tables: [snapshot(entry.to)],
                        lists: [queueList()],
                    });
                } else {
                    if (builder.edgeState(entry.edge.id) === 'idle') {
                        builder.setEdge(entry.edge.id, 'reject');
                    }
                    builder.commit({
                        title: `Ignora ${labelOf(graph, entry.to)}`,
                        description: `${labelOf(graph, entry.to)} já foi descoberto (d = ${distance.get(entry.to)}), então a aresta não pertence à árvore de busca.`,
                        tables: [snapshot(entry.to)],
                        lists: [queueList()],
                    });
                }
            }

            builder.setNode(current, 'done');
            builder.commit({
                title: `Fecha ${labelOf(graph, current)}`,
                description: `Todos os vizinhos de ${labelOf(graph, current)} foram examinados. O vértice é finalizado (preto).`,
                tables: [snapshot()],
                lists: [queueList()],
            });
        }

        builder.resetEdgesWithState('active', 'idle');
        builder.resetEdgesWithState('reject', 'idle');
        const unreachable = graph.nodes.filter(
            (node) => !Number.isFinite(distance.get(node.id) ?? Infinity)
        );

        builder.commit({
            title: 'Busca concluída',
            description:
                unreachable.length > 0
                    ? `A fila está vazia. ${unreachable.length} vértice(s) não foram alcançados a partir da origem.`
                    : 'A fila está vazia e todos os vértices foram alcançados a partir da origem.',
            tables: [snapshot()],
            metrics: [{ label: 'Ordem de visita', value: visitOrder.join(' → ') }],
        });

        const conclusions = [
            `Ordem de visita: ${visitOrder.join(' → ')}.`,
            `A árvore de busca em largura fornece o caminho com menor número de arestas da origem até cada vértice alcançável.`,
        ];
        if (unreachable.length > 0) {
            conclusions.push(
                `Não alcançados: ${unreachable.map((node) => node.label).join(', ')}.`
            );
        }

        return builder.build(conclusions);
    },
};
