import { buildAdjacency, hasUndirectedEdges, nodeLabelMap, sortedNodes } from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId, TraceTable } from '../graph/types';
import { requireEdges, requireNodes } from './shared';

export const kahn: AlgorithmDefinition = {
    id: 'kahn',
    name: 'Método de Kahn',
    shortName: 'Kahn',
    category: 'Ordenação topológica',
    tagline:
        'Determina a cada instante um vértice com grau de entrada zero, insere-o no fim do resultado e reduz o grau de entrada de seus sucessores.',
    complexity: 'O(n + m)',
    needsStart: false,
    needsEnd: false,
    constraints: [
        'Exige grafo direcionado',
        'Só existe ordenação topológica em grafo acíclico',
        'Detecta a existência de ciclo',
    ],
    validate: (context) => {
        const errors = [...requireNodes(context), ...requireEdges(context)];
        if (hasUndirectedEdges(context.graph)) {
            errors.push(
                'Não é possível estabelecer uma ordenação topológica em grafo não direcionado: converta todas as arestas para direcionadas.'
            );
        }
        return errors;
    },
    run: ({ graph }) => {
        const builder = createTraceBuilder(graph);
        const adjacency = buildAdjacency(graph);
        const labels = nodeLabelMap(graph);
        const ordered = sortedNodes(graph);

        const inDegree = new Map<NodeId, number>();
        ordered.forEach((node) => inDegree.set(node.id, 0));
        graph.edges.forEach((edge) => {
            inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
        });

        const queue: NodeId[] = [];
        const result: NodeId[] = [];

        const degreeTable = (highlight?: NodeId): TraceTable => ({
            id: 'kahn-degrees',
            title: 'Mapa de graus de entrada M',
            columns: [
                { key: 'vertex', label: 'Vértice' },
                { key: 'degree', label: 'M[v]' },
                { key: 'status', label: 'Situação' },
            ],
            rows: ordered.map((node) => ({
                key: node.id,
                emphasis:
                    node.id === highlight
                        ? 'active'
                        : result.includes(node.id)
                          ? 'done'
                          : undefined,
                cells: {
                    vertex: node.label,
                    degree: String(inDegree.get(node.id) ?? 0),
                    status: result.includes(node.id)
                        ? `posição ${result.indexOf(node.id) + 1}`
                        : queue.includes(node.id)
                          ? 'na fila'
                          : 'aguardando',
                },
            })),
        });

        const queueList = () => ({
            id: 'kahn-queue',
            title: 'Fila',
            variant: 'queue' as const,
            items: queue.map((id) => labels.get(id) ?? ''),
        });

        const resultList = () => ({
            id: 'kahn-result',
            title: 'Ordena_Top',
            variant: 'set' as const,
            items: result.map((id) => labels.get(id) ?? ''),
        });

        const snapshot = (highlight?: NodeId) => ({
            tables: [degreeTable(highlight)],
            lists: [queueList(), resultList()],
        });

        builder.commit({
            title: 'Inicialização',
            description:
                'M[v] recebe o grau de entrada d⁻(v) de cada vértice. A fila e o resultado Ordena_Top começam vazios.',
            ...snapshot(),
        });

        ordered.forEach((node) => {
            if ((inDegree.get(node.id) ?? 0) === 0) {
                queue.push(node.id);
                builder.setNode(node.id, 'frontier');
            }
        });

        builder.commit({
            title: 'Vértices sem arestas de entrada',
            description:
                queue.length > 0
                    ? `Os vértices com d⁻(v) = 0 entram na fila: ${queue.map((id) => labels.get(id)).join(', ')}. Eles não dependem de nenhum outro.`
                    : 'Nenhum vértice tem d⁻(v) = 0. Como todo grafo acíclico direcionado possui pelo menos um vértice sem arestas de entrada, o grafo contém um ciclo.',
            ...snapshot(),
        });

        while (queue.length > 0) {
            const current = queue.shift() as NodeId;
            result.push(current);
            builder.resetEdgesWithState('active', 'idle');
            builder.setNode(current, 'done');
            builder.setNodeBadge(current, String(result.length));

            builder.commit({
                title: `${labels.get(current)} entra em Ordena_Top na posição ${result.length}`,
                description: `${labels.get(current)} sai da fila e é inserido no fim do resultado. Sua numeração topológica é ${result.length}, pois todos os vértices que o precedem já foram processados.`,
                ...snapshot(current),
            });

            for (const entry of adjacency.get(current) ?? []) {
                const before = inDegree.get(entry.to) ?? 0;
                inDegree.set(entry.to, before - 1);
                builder.setEdge(entry.edge.id, 'done');

                if (before - 1 === 0) {
                    queue.push(entry.to);
                    builder.setNode(entry.to, 'frontier');
                    builder.commit({
                        title: `M[${labels.get(entry.to)}] chega a 0, entra na fila`,
                        description: `Removida a aresta (${labels.get(current)}, ${labels.get(entry.to)}), o grau de entrada de ${labels.get(entry.to)} cai de ${before} para 0: todas as suas dependências já estão no resultado, então ele entra na fila.`,
                        ...snapshot(entry.to),
                    });
                } else {
                    builder.commit({
                        title: `M[${labels.get(entry.to)}] = ${before - 1}`,
                        description: `Removida a aresta (${labels.get(current)}, ${labels.get(entry.to)}), o grau de entrada de ${labels.get(entry.to)} cai de ${before} para ${before - 1}. Ele ainda depende de ${before - 1} vértice(s) e permanece fora da fila.`,
                        ...snapshot(entry.to),
                    });
                }
            }
        }

        builder.resetEdgesWithState('active', 'idle');

        const pending = ordered.filter((node) => !result.includes(node.id));

        if (pending.length > 0) {
            pending.forEach((node) => {
                builder.setNode(node.id, 'reject');
                builder.setNodeBadge(node.id, `M=${inDegree.get(node.id) ?? 0}`);
            });
            graph.edges.forEach((edge) => {
                const inCycle =
                    pending.some((node) => node.id === edge.source) &&
                    pending.some((node) => node.id === edge.target);
                if (inCycle) builder.setEdge(edge.id, 'reject');
            });

            builder.commit({
                title: 'Ciclo detectado',
                description: `A fila esvaziou com ${pending.length} vértice(s) ainda não processado(s): ${pending
                    .map((node) => node.label)
                    .join(
                        ', '
                    )}. Todos continuam com M[v] > 0, o que só é possível se houver um ciclo entre eles.`,
                ...snapshot(),
            });

            return builder.build([
                `Nem todos os vértices foram processados: o grafo possui um ciclo envolvendo ${pending
                    .map((node) => node.label)
                    .join(', ')}.`,
                'Um grafo com ciclo não admite ordenação topológica, pois não é possível estabelecer uma relação de precedência entre os vértices do ciclo.',
            ]);
        }

        builder.commit({
            title: 'Ordenação topológica concluída',
            description: `Todos os ${result.length} vértices foram processados: ${result
                .map((id) => labels.get(id))
                .join(' → ')}.`,
            ...snapshot(),
        });

        return builder.build([
            `Ordenação topológica: ${result.map((id) => labels.get(id)).join(' → ')}.`,
            'A numeração topológica ord(v) corresponde à ordem de inserção no resultado, e satisfaz ord(v) < ord(w) para toda aresta (v, w) ∈ E(G).',
            'Todos os vértices foram processados, portanto o grafo é acíclico. Note que a ordenação topológica pode não ser única.',
        ]);
    },
};
