import { buildAdjacency, nodeLabelMap, sortedNodes } from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId, TraceRow, TraceTable } from '../graph/types';
import { labelOf, requireNodes, requireStart } from './shared';

type Color = 'white' | 'gray' | 'black';
type EdgeKind = 'Árvore' | 'Retorno' | 'Avanço' | 'Cruzamento';

const pairOf = (directed: boolean, from: string, to: string) =>
    directed ? `(${from}, ${to})` : `{${from}, ${to}}`;

export const depthFirstSearch: AlgorithmDefinition = {
    id: 'dfs',
    name: 'Busca em Profundidade',
    shortName: 'DFS',
    category: 'Busca em grafos',
    tagline:
        'Escolhe sempre o vértice marcado mais recentemente alcançado, registrando tempo de descoberta TD e tempo de término TT.',
    complexity: 'O(n + m)',
    needsStart: true,
    needsEnd: false,
    constraints: [
        'Aceita arestas direcionadas e não direcionadas',
        'Em grafo não direcionado: arestas de árvore e de retorno',
        'Em grafo direcionado: árvore, retorno, avanço e cruzamento',
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
                    discovery: String(discovery.get(node.id) ?? 0),
                    finish: String(finish.get(node.id) ?? 0),
                    parent: labels.get(parent.get(node.id) ?? '') ?? '-',
                },
            }));
            return {
                id: 'dfs-times',
                title: 'Tempos de descoberta e de término',
                columns: [
                    { key: 'vertex', label: 'Vértice' },
                    { key: 'discovery', label: 'TD' },
                    { key: 'finish', label: 'TT' },
                    { key: 'parent', label: 'pai' },
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
                        edge: edge.directed
                            ? `(${labels.get(edge.source)}, ${labels.get(edge.target)})`
                            : `{${labels.get(edge.source)}, ${labels.get(edge.target)}}`,
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
            metrics: [{ label: 'Ordem de visita', value: visitOrder.join(' → ') || '-' }],
        });

        builder.commit({
            title: 'Inicialização',
            description:
                'Todos os vértices começam desmarcados (brancos): TD[v] = 0, TT[v] = 0 e pai[v] = nulo. O contador global t começa em 0.',
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
                description: `${labelOf(graph, current)} passa a marcado (cinza) com TD = ${time} e entra na pilha de recursão.`,
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
                        title: `Aresta de árvore ${pairOf(entry.edge.directed, labelOf(graph, current), labelOf(graph, entry.to))}`,
                        description: `TD[${labelOf(graph, entry.to)}] = 0, ou seja, ${labelOf(graph, entry.to)} é visitado pela 1ª vez: pai[${labelOf(graph, entry.to)}] = ${labelOf(graph, current)} e a busca aprofunda por essa aresta.`,
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
                    if (!entry.edge.directed && neighbourColor === 'black') continue;

                    const kind: EdgeKind = !entry.edge.directed
                        ? 'Retorno'
                        : neighbourColor === 'gray'
                          ? 'Retorno'
                          : (discovery.get(current) ?? 0) < (discovery.get(entry.to) ?? 0)
                            ? 'Avanço'
                            : 'Cruzamento';
                    classification.set(entry.edge.id, kind);
                    builder.setEdge(entry.edge.id, kind === 'Retorno' ? 'reject' : 'frontier');

                    const pair = pairOf(
                        entry.edge.directed,
                        labelOf(graph, current),
                        labelOf(graph, entry.to)
                    );
                    const reason = entry.edge.directed
                        ? kind === 'Retorno'
                            ? `TT[${labelOf(graph, entry.to)}] = 0, logo ${labelOf(graph, entry.to)} é ancestral de ${labelOf(graph, current)}`
                            : kind === 'Avanço'
                              ? `TD[${labelOf(graph, current)}] < TD[${labelOf(graph, entry.to)}], logo ${labelOf(graph, entry.to)} é descendente de ${labelOf(graph, current)} sem ser seu filho`
                              : `${labelOf(graph, entry.to)} não é descendente nem ancestral de ${labelOf(graph, current)}`
                        : `TT[${labelOf(graph, entry.to)}] = 0 e ${labelOf(graph, entry.to)} ≠ pai[${labelOf(graph, current)}], logo ${labelOf(graph, entry.to)} é ancestral de ${labelOf(graph, current)} sem ser seu pai`;

                    builder.commit({
                        title: `Aresta de ${kind.toLowerCase()}`,
                        description: `${reason}. Portanto ${pair} é classificada como aresta de ${kind.toLowerCase()}.`,
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
                title: `${labelOf(graph, current)} explorado`,
                description: `Toda a vizinhança de ${labelOf(graph, current)} foi examinada: o vértice passa a explorado (preto) com TT = ${time}. Seu intervalo de vida é I(${labelOf(graph, current)}) = [${discovery.get(current)}, ${time}].`,
                ...snapshot(),
            });
        };

        visit(startId as NodeId, null);

        const remaining = sortedNodes(graph).filter((node) => color.get(node.id) === 'white');
        remaining.forEach((node) => {
            builder.commit({
                title: `Nova raiz: ${node.label}`,
                description: `TD[${node.label}] = 0 após a busca anterior, então ${node.label} vira raiz de uma nova árvore de profundidade.`,
                ...snapshot(node.id),
            });
            visit(node.id, null);
        });

        const treeEdges = graph.edges.filter((edge) => classification.get(edge.id) === 'Árvore');
        const backEdges = graph.edges.filter((edge) => classification.get(edge.id) === 'Retorno');

        builder.commit({
            title: 'Busca concluída',
            description: `Todos os vértices estão explorados. As ${treeEdges.length} aresta(s) de árvore formam a floresta de profundidade.`,
            ...snapshot(),
        });

        return builder.build([
            `Ordem de visita: ${visitOrder.join(' → ')}.`,
            `Arestas de árvore: ${treeEdges.length}. Arestas de retorno: ${backEdges.length}.`,
            backEdges.length > 0
                ? 'As arestas de retorno sempre representam um ciclo no grafo original.'
                : 'Não há arestas de retorno, logo o grafo é acíclico.',
            'Os intervalos de vida I(v) = [TD[v], TT[v]] são encaixados: w é descendente de v se e somente se I(w) está contido em I(v).',
        ]);
    },
};
