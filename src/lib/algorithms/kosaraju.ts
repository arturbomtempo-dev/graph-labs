import {
    buildAdjacency,
    buildReverseAdjacency,
    hasUndirectedEdges,
    nodeLabelMap,
    orderedNodes,
} from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId, TraceTable } from '../graph/types';
import { requireEdges, requireNodes } from './shared';

export const kosaraju: AlgorithmDefinition = {
    id: 'kosaraju',
    name: 'Método de Kosaraju',
    shortName: 'Kosaraju',
    category: 'Conectividade',
    tagline:
        'Encontra os componentes fortemente conexos (f-conexos) com duas buscas em profundidade: uma em G e outra no grafo reverso Gᴿ.',
    complexity: 'O(n + m)',
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
    run: ({ graph, order }) => {
        const builder = createTraceBuilder(graph);
        const adjacency = buildAdjacency(graph, order);
        const reverse = buildReverseAdjacency(graph, order);
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
                title: 'Componentes fortemente conexos',
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
            title: 'Passo 1: busca em profundidade em G',
            description:
                'A primeira busca em profundidade percorre G e empilha cada vértice no momento em que seu tempo de término TT é definido.',
            lists: [orderList()],
        });

        const firstPass = (current: NodeId) => {
            visitedFirst.add(current);
            builder.setNode(current, 'active');
            builder.commit({
                title: `Visita ${labels.get(current)}`,
                description: `${labels.get(current)} é marcado na primeira busca em profundidade.`,
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
                description: `${labels.get(current)} não tem mais vizinhos a explorar: seu TT é definido e ele é empilhado. O topo da pilha é o vértice de maior TT.`,
                lists: [orderList()],
            });
        };

        orderedNodes(graph, order).forEach((node) => {
            if (!visitedFirst.has(node.id)) firstPass(node.id);
        });

        graph.nodes.forEach((node) => builder.setNode(node.id, 'idle'));
        graph.edges.forEach((edge) => builder.setEdge(edge.id, 'idle'));

        builder.commit({
            title: 'Passo 2: construção do grafo reverso Gᴿ',
            description: `Todas as arestas são invertidas: se (v, w) ∈ E(G) então (w, v) ∈ E(Gᴿ). A segunda busca percorrerá Gᴿ em ordem decrescente de TT: ${[
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
                description: `Em Gᴿ, ${labels.get(current)} é alcançável a partir da raiz desta árvore de profundidade, portanto pertence ao mesmo componente fortemente conexo.`,
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
                description: `${labels.get(nodeId)} é o vértice ainda não marcado com maior TT, então ele é a raiz de uma nova árvore de profundidade em Gᴿ, que corresponde ao componente C${componentIndex + 1}.`,
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
            title: 'Passo 3: componentes identificados',
            description: `Cada árvore da floresta de profundidade obtida em Gᴿ é um componente fortemente conexo: G possui ${componentIndex} componente(s) f-conexo(s). As arestas destacadas ligam vértices de um mesmo componente.`,
            tables: [componentsTable()],
        });

        return builder.build([
            `Foram encontrados ${componentIndex} componente(s) fortemente conexo(s).`,
            componentIndex === 1
                ? 'Todos os vértices são mutuamente alcançáveis, portanto G é fortemente conexo (f-conexo).'
                : 'Como há mais de um componente f-conexo, G não é fortemente conexo: existe par de vértices que não se alcançam mutuamente.',
        ]);
    },
};
