import {
    buildAdjacency,
    buildReverseAdjacency,
    hasUndirectedEdges,
    nodeLabelMap,
    sortedNodes,
} from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId, TraceTable } from '../graph/types';
import { requireEdges, requireNodes } from './shared';

export const kosaraju: AlgorithmDefinition = {
    id: 'kosaraju',
    name: 'Kosaraju',
    shortName: 'Kosaraju',
    category: 'Conectividade',
    tagline: 'Encontra as componentes fortemente conexas com duas buscas em profundidade.',
    complexity: 'O(V + E)',
    needsStart: false,
    needsEnd: false,
    constraints: ['Exige grafo direcionado', 'Ignora os pesos das arestas'],
    validate: (context) => {
        const errors = [...requireNodes(context), ...requireEdges(context)];
        if (hasUndirectedEdges(context.graph)) {
            errors.push(
                'Kosaraju opera sobre grafos direcionados: converta todas as arestas para direcionadas.'
            );
        }
        return errors;
    },
    run: ({ graph }) => {
        const builder = createTraceBuilder(graph);
        const adjacency = buildAdjacency(graph);
        const reverse = buildReverseAdjacency(graph);
        const labels = nodeLabelMap(graph);

        const finishOrder: NodeId[] = [];
        const visitedFirst = new Set<NodeId>();
        const component = new Map<NodeId, number>();

        const orderList = () => ({
            id: 'finish-order',
            title: 'Pilha de finalização',
            variant: 'stack' as const,
            items: finishOrder.map((id) => labels.get(id) ?? ''),
        });

        const componentsTable = (): TraceTable => {
            const groups = new Map<number, string[]>();
            component.forEach((index, nodeId) => {
                const bucket = groups.get(index) ?? [];
                bucket.push(labels.get(nodeId) ?? '');
                groups.set(index, bucket);
            });
            return {
                id: 'scc-table',
                title: 'Componentes fortemente conexas',
                columns: [
                    { key: 'component', label: 'Componente' },
                    { key: 'members', label: 'Vértices' },
                ],
                rows: [...groups.entries()]
                    .sort((a, b) => a[0] - b[0])
                    .map(([index, members]) => ({
                        key: `scc-${index}`,
                        emphasis: 'done' as const,
                        cells: {
                            component: `C${index + 1}`,
                            members: members.sort().join(', '),
                        },
                    })),
            };
        };

        builder.commit({
            title: 'Fase 1 — busca em profundidade no grafo original',
            description:
                'A primeira DFS percorre o grafo original e empilha cada vértice no momento em que é finalizado.',
            lists: [orderList()],
        });

        const firstPass = (current: NodeId) => {
            visitedFirst.add(current);
            builder.setNode(current, 'active');
            builder.commit({
                title: `Visita ${labels.get(current)}`,
                description: `${labels.get(current)} é descoberto na primeira busca.`,
                lists: [orderList()],
            });

            (adjacency.get(current) ?? []).forEach((entry) => {
                if (!visitedFirst.has(entry.to)) {
                    builder.setEdge(entry.edge.id, 'done');
                    firstPass(entry.to);
                    builder.setNode(current, 'active');
                }
            });

            finishOrder.push(current);
            builder.setNode(current, 'done');
            builder.commit({
                title: `Finaliza ${labels.get(current)}`,
                description: `${labels.get(current)} não tem mais vizinhos inexplorados e é empilhado. A pilha guarda a ordem decrescente de término.`,
                lists: [orderList()],
            });
        };

        sortedNodes(graph).forEach((node) => {
            if (!visitedFirst.has(node.id)) firstPass(node.id);
        });

        graph.nodes.forEach((node) => builder.setNode(node.id, 'idle'));
        graph.edges.forEach((edge) => builder.setEdge(edge.id, 'idle'));

        builder.commit({
            title: 'Fase 2 — transposição do grafo',
            description: `Todas as arestas são invertidas. Os vértices serão reprocessados na ordem inversa de finalização: ${[
                ...finishOrder,
            ]
                .reverse()
                .map((id) => labels.get(id))
                .join(', ')}.`,
            lists: [orderList()],
        });

        const visitedSecond = new Set<NodeId>();
        let componentIndex = 0;

        const secondPass = (current: NodeId, index: number) => {
            visitedSecond.add(current);
            component.set(current, index);
            builder.setNode(current, 'done');
            builder.setNodeGroup(current, index);
            builder.setNodeBadge(current, `C${index + 1}`);

            builder.commit({
                title: `${labels.get(current)} entra em C${index + 1}`,
                description: `No grafo transposto, ${labels.get(current)} é alcançável a partir da raiz da componente, portanto pertence à mesma componente fortemente conexa.`,
                tables: [componentsTable()],
                lists: [orderList()],
            });

            (reverse.get(current) ?? []).forEach((entry) => {
                if (!visitedSecond.has(entry.to)) {
                    builder.setEdge(entry.edge.id, 'done');
                    secondPass(entry.to, index);
                }
            });
        };

        [...finishOrder].reverse().forEach((nodeId) => {
            if (visitedSecond.has(nodeId)) return;
            builder.commit({
                title: `Nova componente a partir de ${labels.get(nodeId)}`,
                description: `${labels.get(nodeId)} é o vértice não visitado com maior tempo de término, então ele inicia a componente C${componentIndex + 1}.`,
                tables: [componentsTable()],
                lists: [orderList()],
            });
            secondPass(nodeId, componentIndex);
            componentIndex += 1;
        });

        graph.edges.forEach((edge) => {
            const sameComponent = component.get(edge.source) === component.get(edge.target);
            builder.setEdge(edge.id, sameComponent ? 'done' : 'idle');
        });

        builder.commit({
            title: 'Componentes identificadas',
            description: `O grafo possui ${componentIndex} componente(s) fortemente conexa(s). Arestas destacadas ligam vértices da mesma componente.`,
            tables: [componentsTable()],
        });

        return builder.build([
            `Foram encontradas ${componentIndex} componente(s) fortemente conexa(s).`,
            componentIndex === 1
                ? 'O grafo inteiro é fortemente conexo: existe caminho direcionado entre qualquer par de vértices.'
                : 'O grafo de componentes (condensação) é um DAG.',
        ]);
    },
};
