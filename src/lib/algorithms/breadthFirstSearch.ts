import { buildAdjacency, nodeLabelMap, orderedNodes, sortedNodes } from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId, TraceRow, TraceTable } from '../graph/types';
import { labelOf, requireNodes, requireStart } from './shared';

type EdgeKind = 'Árvore (pai)' | 'Tio' | 'Irmão' | 'Primo';

export const breadthFirstSearch: AlgorithmDefinition = {
    id: 'bfs',
    name: 'Busca em Largura',
    shortName: 'BFS',
    category: 'Busca em grafos',
    tagline:
        'Escolhe sempre o vértice marcado menos recentemente alcançado, usando uma fila, e define o nível de cada vértice.',
    complexity: 'O(n + m)',
    needsStart: true,
    needsEnd: false,
    constraints: [
        'Aceita arestas direcionadas e não direcionadas',
        'Ignora os pesos das arestas',
        'Classifica as arestas em pai, tio, irmão e primo',
    ],
    validate: (context) => [...requireNodes(context), ...requireStart(context)],
    run: ({ graph, startId, order }) => {
        const builder = createTraceBuilder(graph);
        const adjacency = buildAdjacency(graph, order);
        const labels = nodeLabelMap(graph);
        const root = startId as NodeId;

        const index = new Map<NodeId, number>();
        const level = new Map<NodeId, number>();
        const parent = new Map<NodeId, NodeId | null>();
        const classification = new Map<string, EdgeKind>();
        graph.nodes.forEach((node) => {
            index.set(node.id, 0);
            level.set(node.id, 0);
            parent.set(node.id, null);
        });

        const queue: NodeId[] = [];
        const visitOrder: string[] = [];
        let time = 0;

        const marked = (id: NodeId) => (index.get(id) ?? 0) > 0;

        const attributesTable = (highlight?: NodeId): TraceTable => {
            const rows: TraceRow[] = sortedNodes(graph).map((node) => ({
                key: node.id,
                emphasis:
                    node.id === highlight
                        ? 'active'
                        : builder.nodeState(node.id) === 'done'
                          ? 'done'
                          : undefined,
                cells: {
                    vertex: node.label,
                    index: marked(node.id) ? String(index.get(node.id)) : '0',
                    level: marked(node.id) ? String(level.get(node.id)) : '-',
                    parent: labels.get(parent.get(node.id) ?? '') ?? '-',
                },
            }));
            return {
                id: 'bfs-attributes',
                title: 'Índice, nível e pai',
                columns: [
                    { key: 'vertex', label: 'Vértice' },
                    { key: 'index', label: 'L' },
                    { key: 'level', label: 'nível' },
                    { key: 'parent', label: 'pai' },
                ],
                rows,
            };
        };

        const edgesTable = (): TraceTable => ({
            id: 'bfs-edges',
            title: 'Classificação das arestas',
            columns: [
                { key: 'edge', label: 'Aresta' },
                { key: 'kind', label: 'Tipo' },
            ],
            rows: graph.edges
                .filter((edge) => classification.has(edge.id))
                .map((edge) => ({
                    key: edge.id,
                    emphasis: classification.get(edge.id) === 'Árvore (pai)' ? 'done' : undefined,
                    cells: {
                        edge: edge.directed
                            ? `(${labels.get(edge.source)}, ${labels.get(edge.target)})`
                            : `{${labels.get(edge.source)}, ${labels.get(edge.target)}}`,
                        kind: classification.get(edge.id) ?? '',
                    },
                })),
        });

        const queueList = () => ({
            id: 'queue',
            title: 'Fila',
            variant: 'queue' as const,
            items: queue.map((id) => labels.get(id) ?? ''),
        });

        const snapshot = (highlight?: NodeId) => ({
            tables: [attributesTable(highlight), edgesTable()],
            lists: [queueList()],
        });

        builder.commit({
            title: 'Inicialização',
            description:
                'Todos os vértices começam não marcados: L[v] = 0, nível[v] = 0 e pai[v] = nulo. O contador global t começa em 0.',
            ...snapshot(),
        });

        const startSearch = (source: NodeId, isRoot: boolean) => {
            time += 1;
            index.set(source, time);
            level.set(source, 0);
            queue.push(source);
            builder.setNode(source, 'frontier');
            builder.setNodeBadge(source, 'nível 0');

            builder.commit({
                title: isRoot
                    ? `Raiz da busca: ${labelOf(graph, source)}`
                    : `Nova raiz: ${labelOf(graph, source)}`,
                description: isRoot
                    ? `${labelOf(graph, source)} é a raiz da busca: recebe L = ${time}, nível 0 e entra na fila.`
                    : `${labelOf(graph, source)} continua com L = 0 após a busca anterior, então inicia uma nova árvore de largura com nível 0.`,
                ...snapshot(source),
            });

            while (queue.length > 0) {
                const current = queue.shift() as NodeId;
                builder.resetEdgesWithState('active', 'idle');
                builder.setNode(current, 'active');
                visitOrder.push(labels.get(current) ?? '');

                builder.commit({
                    title: `Remove ${labelOf(graph, current)} da fila`,
                    description: `${labelOf(graph, current)} sai da fila (nível ${level.get(current)}) e sua vizinhança Γ(${labelOf(graph, current)}) passa a ser examinada em ordem alfabética.`,
                    ...snapshot(current),
                    metrics: [{ label: 'Ordem de visita', value: visitOrder.join(' → ') }],
                });

                for (const entry of adjacency.get(current) ?? []) {
                    const neighbour = entry.to;

                    if (!marked(neighbour)) {
                        parent.set(neighbour, current);
                        level.set(neighbour, (level.get(current) ?? 0) + 1);
                        time += 1;
                        index.set(neighbour, time);
                        queue.push(neighbour);
                        classification.set(entry.edge.id, 'Árvore (pai)');
                        builder.setNode(neighbour, 'frontier');
                        builder.setNodeBadge(neighbour, `nível ${level.get(neighbour)}`);
                        builder.setEdge(entry.edge.id, 'done');

                        builder.commit({
                            title: `Aresta de árvore (pai) {${labelOf(graph, current)}, ${labelOf(graph, neighbour)}}`,
                            description: `${labelOf(graph, neighbour)} tinha L = 0, portanto é visitado pela 1ª vez: pai[${labelOf(graph, neighbour)}] = ${labelOf(graph, current)}, nível = nível[${labelOf(graph, current)}] + 1 = ${level.get(neighbour)} e L = ${time}. O vértice entra na fila.`,
                            ...snapshot(neighbour),
                        });
                        continue;
                    }

                    if (classification.has(entry.edge.id)) continue;

                    const currentLevel = level.get(current) ?? 0;
                    const neighbourLevel = level.get(neighbour) ?? 0;
                    const sameParent = parent.get(current) === parent.get(neighbour);
                    const laterIndex = (index.get(neighbour) ?? 0) > (index.get(current) ?? 0);

                    let kind: EdgeKind | null = null;
                    if (neighbourLevel === currentLevel + 1) {
                        kind = 'Tio';
                    } else if (neighbourLevel === currentLevel && laterIndex) {
                        kind = sameParent ? 'Irmão' : 'Primo';
                    }

                    if (!kind) continue;

                    classification.set(entry.edge.id, kind);
                    builder.setEdge(entry.edge.id, kind === 'Tio' ? 'frontier' : 'reject');

                    const reason =
                        kind === 'Tio'
                            ? `nível[${labelOf(graph, neighbour)}] = nível[${labelOf(graph, current)}] + 1, mas pai[${labelOf(graph, neighbour)}] ≠ ${labelOf(graph, current)}`
                            : `nível[${labelOf(graph, neighbour)}] = nível[${labelOf(graph, current)}] e pai[${labelOf(graph, current)}] ${sameParent ? '=' : '≠'} pai[${labelOf(graph, neighbour)}]`;

                    builder.commit({
                        title: `Aresta de ${kind.toLowerCase()}`,
                        description: `${labelOf(graph, neighbour)} já estava marcado, e ${reason}. Logo {${labelOf(graph, current)}, ${labelOf(graph, neighbour)}} é aresta de ${kind.toLowerCase()} e não pertence à árvore de largura.`,
                        ...snapshot(neighbour),
                    });
                }

                builder.setNode(current, 'done');
                builder.commit({
                    title: `${labelOf(graph, current)} explorado`,
                    description: `Todas as arestas incidentes a ${labelOf(graph, current)} foram exploradas, portanto o vértice está explorado.`,
                    ...snapshot(),
                });
            }
        };

        startSearch(root, true);

        orderedNodes(graph, order)
            .filter((node) => !marked(node.id))
            .forEach((node) => startSearch(node.id, false));

        builder.resetEdgesWithState('active', 'idle');

        const treeEdges = graph.edges.filter(
            (edge) => classification.get(edge.id) === 'Árvore (pai)'
        );
        const reachable = graph.nodes.filter(
            (node) => node.id === root || parent.get(node.id) !== null
        );
        const unreachable = graph.nodes.filter(
            (node) => node.id !== root && parent.get(node.id) === null
        );

        builder.commit({
            title: 'Busca concluída',
            description:
                unreachable.length > 0
                    ? `A fila está vazia. ${unreachable.length} vértice(s) não foram alcançados a partir da raiz, então a busca produziu mais de uma árvore de largura.`
                    : 'A fila está vazia e todos os vértices foram alcançados a partir da raiz.',
            ...snapshot(),
            metrics: [{ label: 'Ordem de visita', value: visitOrder.join(' → ') }],
        });

        const conclusions = [
            `Ordem de visita: ${visitOrder.join(' → ')}.`,
            `A árvore de largura é formada por todos os vértices e pelas arestas de árvore (ou pai), ${treeEdges.length} no total. nível[v] é a distância, em número de arestas, entre a raiz da busca e v.`,
        ];
        if (unreachable.length > 0) {
            conclusions.push(
                `Não alcançados a partir de ${labelOf(graph, root)}: ${unreachable
                    .map((node) => node.label)
                    .join(', ')}. Cada um deles iniciou uma nova árvore de largura.`
            );
        } else if (reachable.length === graph.nodes.length) {
            conclusions.push(
                'Todos os vértices foram alcançados a partir da raiz: a busca produziu uma única árvore de largura.'
            );
        }

        return builder.build(conclusions);
    },
};
