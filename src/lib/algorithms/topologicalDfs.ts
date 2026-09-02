import { buildAdjacency, hasUndirectedEdges, nodeLabelMap, sortedNodes } from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId, TraceTable } from '../graph/types';
import { requireEdges, requireNodes } from './shared';

// Marca[v]: 0 = desmarcado, 1 = marca temporária, 2 = marca permanente.
type Mark = 0 | 1 | 2;

const markLabel: Record<Mark, string> = {
    0: '0 (desmarcado)',
    1: '1 (temporária)',
    2: '2 (permanente)',
};

export const topologicalDfs: AlgorithmDefinition = {
    id: 'topologica-dfs',
    name: 'Ordenação topológica por busca em profundidade',
    shortName: 'Ord. topológica (BP)',
    category: 'Ordenação topológica',
    tagline:
        'Descrito por Tarjan em 1976: insere cada vértice no início do resultado somente depois de visitar todos os que dependem dele.',
    complexity: 'O(n + m)',
    needsStart: false,
    needsEnd: false,
    constraints: [
        'Exige grafo direcionado',
        'Só existe ordenação topológica em grafo acíclico',
        'Marca temporária reencontrada evidencia ciclo',
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

        const mark = new Map<NodeId, Mark>();
        ordered.forEach((node) => mark.set(node.id, 0));

        const result: NodeId[] = [];
        const stack: NodeId[] = [];
        let cycleAt: { from: NodeId; to: NodeId } | null = null;

        const markTable = (highlight?: NodeId): TraceTable => ({
            id: 'topo-marks',
            title: 'Marcas dos vértices',
            columns: [
                { key: 'vertex', label: 'Vértice' },
                { key: 'mark', label: 'Marca[v]' },
                { key: 'position', label: 'Ordena_Top' },
            ],
            rows: ordered.map((node) => ({
                key: node.id,
                emphasis:
                    node.id === highlight ? 'active' : mark.get(node.id) === 2 ? 'done' : undefined,
                cells: {
                    vertex: node.label,
                    mark: markLabel[mark.get(node.id) ?? 0],
                    position: result.includes(node.id) ? String(result.indexOf(node.id) + 1) : '-',
                },
            })),
        });

        const stackList = () => ({
            id: 'topo-stack',
            title: 'Chamadas de Visita( )',
            variant: 'stack' as const,
            items: stack.map((id) => labels.get(id) ?? ''),
        });

        const resultList = () => ({
            id: 'topo-result',
            title: 'Ordena_Top',
            variant: 'set' as const,
            items: result.map((id) => labels.get(id) ?? ''),
        });

        const snapshot = (highlight?: NodeId) => ({
            tables: [markTable(highlight)],
            lists: [stackList(), resultList()],
        });

        builder.commit({
            title: 'Inicialização',
            description:
                'Todos os vértices começam desmarcados, isto é, Marca[v] = 0, e o resultado Ordena_Top começa vazio.',
            ...snapshot(),
        });

        const visit = (current: NodeId) => {
            if (mark.get(current) === 2) return;

            if (mark.get(current) === 1) {
                cycleAt = { from: stack[stack.length - 1], to: current };
                builder.setNode(current, 'reject');
                builder.commit({
                    title: `Ciclo: ${labels.get(current)} já tem marca temporária`,
                    description: `Visita(${labels.get(current)}) foi chamada enquanto Marca[${labels.get(current)}] = 1, ou seja, o vértice ainda está na cadeia de chamadas atual. Isso significa que existe um caminho de ${labels.get(current)} de volta a ele mesmo: o grafo possui ciclo e não admite ordenação topológica.`,
                    ...snapshot(current),
                });
                return;
            }

            mark.set(current, 1);
            stack.push(current);
            builder.setNode(current, 'active');
            builder.setNodeBadge(current, 'temp');

            builder.commit({
                title: `Visita(${labels.get(current)})`,
                description: `${labels.get(current)} recebe marca temporária (Marca = 1) e sua vizinhança Γ⁺(${labels.get(current)}) passa a ser visitada.`,
                ...snapshot(current),
            });

            for (const entry of adjacency.get(current) ?? []) {
                if (cycleAt) return;
                builder.setEdge(entry.edge.id, 'active');
                visit(entry.to);
                if (cycleAt) {
                    builder.setEdge(entry.edge.id, 'reject');
                    return;
                }
                builder.setEdge(entry.edge.id, 'done');
                builder.setNode(current, 'active');
            }

            mark.set(current, 2);
            stack.pop();
            result.unshift(current);
            builder.setNode(current, 'done');

            builder.commit({
                title: `${labels.get(current)} entra no início de Ordena_Top`,
                description: `Todos os vértices que dependem de ${labels.get(current)} já foram visitados, então ele recebe marca permanente (Marca = 2) e é inserido no início do resultado, daí a ordem reversa de inserção.`,
                ...snapshot(current),
            });

            // Renumera os selos: a posição de cada vértice muda a cada inserção no início.
            result.forEach((id, position) => builder.setNodeBadge(id, String(position + 1)));
        };

        for (const node of ordered) {
            if (cycleAt) break;
            if (mark.get(node.id) !== 0) continue;
            visit(node.id);
        }

        builder.resetEdgesWithState('active', 'idle');

        if (cycleAt) {
            const { from, to } = cycleAt;
            builder.commit({
                title: 'Ordenação topológica impossível',
                description: `A aresta (${labels.get(from)}, ${labels.get(to)}) fecha um ciclo, pois ${labels.get(to)} ainda tinha marca temporária quando foi alcançado novamente.`,
                ...snapshot(),
            });

            return builder.build([
                `O grafo possui ciclo: ${labels.get(to)} foi alcançado de novo com marca temporária, a partir de ${labels.get(from)}.`,
                'Um grafo com ciclo não admite ordenação topológica, pois não é possível estabelecer uma relação de precedência entre os vértices do ciclo.',
            ]);
        }

        builder.commit({
            title: 'Ordenação topológica concluída',
            description: `Todos os vértices receberam marca permanente. Lendo Ordena_Top do início ao fim: ${result
                .map((id) => labels.get(id))
                .join(' → ')}.`,
            ...snapshot(),
        });

        return builder.build([
            `Ordenação topológica: ${result.map((id) => labels.get(id)).join(' → ')}.`,
            'Cada vértice foi inserido no início do resultado, portanto a ordenação corresponde à ordem reversa de inserção, equivalente à ordem decrescente de tempo de término da busca em profundidade.',
            'Nenhuma marca temporária foi reencontrada, logo o grafo é acíclico. A ordenação topológica pode não ser única.',
        ]);
    },
};
