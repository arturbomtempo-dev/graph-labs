import { buildAdjacency, nodeLabelMap, sortedNodes } from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId, TraceRow, TraceTable } from '../graph/types';
import { labelOf, requireNodes, requireStart } from './shared';

type Color = 'white' | 'gray' | 'black';
type EdgeKind = 'Árvore' | 'Retorno' | 'Avanço' | 'Cruzamento';

export const depthFirstSearch: AlgorithmDefinition = {
    id: 'dfs',
    name: 'Busca em Profundidade',
    shortName: 'DFS',
    category: 'Percursos',
    tagline: 'Aprofunda ao máximo antes de retroceder, marcando tempos de descoberta e término.',
    complexity: 'O(V + E)',
    needsStart: true,
    needsEnd: false,
    constraints: [
        'Aceita arestas direcionadas e não direcionadas',
        'Classifica as arestas em árvore, retorno, avanço e cruzamento',
    ],
    validate: (context) => [...requireNodes(context), ...requireStart(context)],
    run: ({ graph, startId }) => {
        const builder = createTraceBuilder(graph);
        const adjacency = buildAdjacency(graph);
        const labels = nodeLabelMap(graph);

        const color = new Map<NodeId, Color>();
        const discovery = new Map<NodeId, number>();
        const finish = new Map<NodeId, number>();
        const parent = new Map<NodeId, NodeId | null>();
        const classification = new Map<string, EdgeKind>();
        const recursionStack: NodeId[] = [];
        const visitOrder: string[] = [];
        let time = 0;

        graph.nodes.forEach((node) => {
            color.set(node.id, 'white');
            parent.set(node.id, null);
        });

        const timesTable = (highlight?: NodeId): TraceTable => {
            const rows: TraceRow[] = sortedNodes(graph).map((node) => ({
                key: node.id,
                emphasis:
                    node.id === highlight
                        ? 'active'
                        : color.get(node.id) === 'black'
                          ? 'done'
                          : undefined,
                cells: {
                    vertex: node.label,
                    discovery: String(discovery.get(node.id) ?? '—'),
                    finish: String(finish.get(node.id) ?? '—'),
                    parent: labels.get(parent.get(node.id) ?? '') ?? '—',
                },
            }));
            return {
                id: 'dfs-times',
                title: 'Tempos de descoberta e término',
                columns: [
                    { key: 'vertex', label: 'Vértice' },
                    { key: 'discovery', label: 'd' },
                    { key: 'finish', label: 'f' },
                    { key: 'parent', label: 'Predecessor' },
                ],
                rows,
            };
        };

        const edgesTable = (): TraceTable => ({
            id: 'dfs-edges',
            title: 'Classificação das arestas',
            columns: [
                { key: 'edge', label: 'Aresta' },
                { key: 'kind', label: 'Tipo' },
            ],
            rows: graph.edges
                .filter((edge) => classification.has(edge.id))
                .map((edge) => ({
                    key: edge.id,
                    emphasis: classification.get(edge.id) === 'Árvore' ? 'done' : undefined,
                    cells: {
                        edge: `${labels.get(edge.source)} ${edge.directed ? '→' : '—'} ${labels.get(edge.target)}`,
                        kind: classification.get(edge.id) ?? '',
                    },
                })),
        });

        const stackList = () => ({
            id: 'stack',
            title: 'Pilha de recursão',
            variant: 'stack' as const,
            items: recursionStack.map((id) => labels.get(id) ?? ''),
        });

        const snapshot = (highlight?: NodeId) => ({
            tables: [timesTable(highlight), edgesTable()],
            lists: [stackList()],
            metrics: [{ label: 'Ordem de visita', value: visitOrder.join(' → ') || '—' }],
        });

        builder.commit({
            title: 'Inicialização',
            description:
                'Todos os vértices são brancos, sem predecessor e sem tempos definidos. O relógio começa em 0.',
            ...snapshot(),
        });

        const visit = (current: NodeId, arrivalEdgeId: string | null) => {
            time += 1;
            discovery.set(current, time);
            color.set(current, 'gray');
            recursionStack.push(current);
            visitOrder.push(labels.get(current) ?? '');
            builder.setNode(current, 'active');
            builder.setNodeBadge(current, `${time}/…`);

            builder.commit({
                title: `Descobre ${labelOf(graph, current)}`,
                description: `${labelOf(graph, current)} fica cinza com d = ${time} e entra na pilha de recursão.`,
                ...snapshot(current),
            });

            const neighbours = adjacency.get(current) ?? [];
            for (const entry of neighbours) {
                if (!entry.edge.directed && entry.edge.id === arrivalEdgeId) continue;

                const neighbourColor = color.get(entry.to) ?? 'white';

                if (neighbourColor === 'white') {
                    parent.set(entry.to, current);
                    classification.set(entry.edge.id, 'Árvore');
                    builder.setEdge(entry.edge.id, 'done');
                    builder.commit({
                        title: `Aresta de árvore ${labelOf(graph, current)} → ${labelOf(graph, entry.to)}`,
                        description: `${labelOf(graph, entry.to)} é branco, então a busca aprofunda por essa aresta.`,
                        ...snapshot(entry.to),
                    });
                    visit(entry.to, entry.edge.id);
                    builder.setNode(current, 'active');
                    builder.commit({
                        title: `Retorna para ${labelOf(graph, current)}`,
                        description: `A chamada recursiva terminou; a busca volta a examinar os vizinhos de ${labelOf(graph, current)}.`,
                        ...snapshot(current),
                    });
                    continue;
                }

                if (!classification.has(entry.edge.id)) {
                    const kind: EdgeKind =
                        neighbourColor === 'gray'
                            ? 'Retorno'
                            : (discovery.get(current) ?? 0) < (discovery.get(entry.to) ?? 0)
                              ? 'Avanço'
                              : 'Cruzamento';
                    classification.set(entry.edge.id, kind);
                    builder.setEdge(entry.edge.id, kind === 'Retorno' ? 'reject' : 'frontier');
                    builder.commit({
                        title: `Aresta de ${kind.toLowerCase()}`,
                        description: `${labelOf(graph, entry.to)} está ${neighbourColor === 'gray' ? 'cinza (ainda na pilha)' : 'preto (já finalizado)'}, portanto a aresta ${labelOf(graph, current)} → ${labelOf(graph, entry.to)} é classificada como aresta de ${kind.toLowerCase()}.`,
                        ...snapshot(entry.to),
                    });
                }
            }

            color.set(current, 'black');
            time += 1;
            finish.set(current, time);
            recursionStack.pop();
            builder.setNode(current, 'done');
            builder.setNodeBadge(current, `${discovery.get(current)}/${time}`);

            builder.commit({
                title: `Finaliza ${labelOf(graph, current)}`,
                description: `Todos os vizinhos foram examinados: ${labelOf(graph, current)} fica preto com f = ${time}.`,
                ...snapshot(),
            });
        };

        visit(startId as NodeId, null);

        const remaining = sortedNodes(graph).filter((node) => color.get(node.id) === 'white');
        remaining.forEach((node) => {
            builder.commit({
                title: `Nova raiz: ${node.label}`,
                description: `${node.label} continua branco após a busca anterior, então uma nova árvore da floresta de profundidade é iniciada nele.`,
                ...snapshot(node.id),
            });
            visit(node.id, null);
        });

        const treeEdges = graph.edges.filter((edge) => classification.get(edge.id) === 'Árvore');
        const backEdges = graph.edges.filter((edge) => classification.get(edge.id) === 'Retorno');

        builder.commit({
            title: 'Busca concluída',
            description: `A floresta de profundidade está completa com ${treeEdges.length} aresta(s) de árvore.`,
            ...snapshot(),
        });

        return builder.build([
            `Ordem de visita: ${visitOrder.join(' → ')}.`,
            `Arestas de árvore: ${treeEdges.length}. Arestas de retorno: ${backEdges.length}.`,
            backEdges.length > 0
                ? 'A presença de arestas de retorno indica que o grafo possui ciclo.'
                : 'Não há arestas de retorno, logo o grafo é acíclico.',
        ]);
    },
};
