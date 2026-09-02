import { compareLabels, hasDirectedEdges, nodeLabelMap, sortedNodes } from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, GraphEdge, NodeId, TraceTable } from '../graph/types';
import { requireEdges, requireNodes } from './shared';

function degreeOf(edges: GraphEdge[], node: NodeId): number {
    return edges.reduce((total, edge) => {
        if (edge.source === node && edge.target === node) return total + 2;
        if (edge.source === node || edge.target === node) return total + 1;
        return total;
    }, 0);
}

function otherEnd(edge: GraphEdge, node: NodeId): NodeId {
    return edge.source === node ? edge.target : edge.source;
}

function reachable(edges: GraphEdge[], from: NodeId): Set<NodeId> {
    const seen = new Set<NodeId>([from]);
    const stack = [from];
    while (stack.length > 0) {
        const current = stack.pop() as NodeId;
        edges.forEach((edge) => {
            if (edge.source !== current && edge.target !== current) return;
            const next = otherEnd(edge, current);
            if (seen.has(next)) return;
            seen.add(next);
            stack.push(next);
        });
    }
    return seen;
}

function isBridge(edges: GraphEdge[], edge: GraphEdge, from: NodeId): boolean {
    const remaining = edges.filter((candidate) => candidate.id !== edge.id);
    const target = otherEnd(edge, from);
    return !reachable(remaining, from).has(target);
}

export const fleury: AlgorithmDefinition = {
    id: 'fleury',
    name: 'Método de Fleury',
    shortName: 'Fleury',
    category: 'Grafos eulerianos',
    tagline:
        'Constrói um trajeto euleriano caminhando pelo grafo e evitando atravessar uma ponte enquanto houver outra aresta disponível.',
    complexity: 'O(m² )',
    needsStart: false,
    needsEnd: false,
    constraints: [
        'Exige grafo não direcionado e conexo',
        'No máximo 2 vértices de grau ímpar',
        'Ignora os custos das arestas',
    ],
    validate: (context) => {
        const errors = [...requireNodes(context), ...requireEdges(context)];
        const { graph, startId } = context;

        if (hasDirectedEdges(graph)) {
            errors.push(
                'O método de Fleury é definido para grafo não direcionado: converta todas as arestas para não direcionadas.'
            );
            return errors;
        }

        const odd = graph.nodes.filter((node) => degreeOf(graph.edges, node.id) % 2 === 1);
        if (odd.length > 2) {
            errors.push(
                `O grafo possui ${odd.length} vértices de grau ímpar (${odd
                    .map((node) => node.label)
                    .join(
                        ', '
                    )}). Um grafo conexo é euleriano se todos os graus forem pares e semi-euleriano se houver exatamente dois vértices de grau ímpar.`
            );
        }

        const withEdges = graph.nodes.filter((node) => degreeOf(graph.edges, node.id) > 0);
        if (withEdges.length > 0) {
            const seen = reachable(graph.edges, withEdges[0].id);
            if (withEdges.some((node) => !seen.has(node.id))) {
                errors.push(
                    'O grafo não é conexo: o teorema de Euler exige um grafo conexo para que exista trajeto ou ciclo euleriano.'
                );
            }
        }

        if (startId && odd.length > 0 && !odd.some((node) => node.id === startId)) {
            errors.push(
                `Com vértices de grau ímpar, o trajeto euleriano precisa começar em um deles: ${odd
                    .map((node) => node.label)
                    .join(' ou ')}.`
            );
        }

        return errors;
    },
    run: ({ graph, startId }) => {
        const builder = createTraceBuilder(graph);
        const labels = nodeLabelMap(graph);
        const ordered = sortedNodes(graph);

        const odd = ordered.filter((node) => degreeOf(graph.edges, node.id) % 2 === 1);
        const withEdges = ordered.filter((node) => degreeOf(graph.edges, node.id) > 0);
        const isEulerian = odd.length === 0;

        const start =
            startId && withEdges.some((node) => node.id === startId)
                ? startId
                : (odd[0]?.id ?? withEdges[0]?.id ?? ordered[0].id);

        let available = [...graph.edges];
        const trail: NodeId[] = [start];
        const usedEdges: string[] = [];
        let current = start;

        const remainingTable = (highlight?: string): TraceTable => ({
            id: 'fleury-edges',
            title: "Arestas restantes em E'",
            columns: [
                { key: 'edge', label: 'Aresta' },
                { key: 'status', label: 'Situação' },
            ],
            rows: graph.edges.map((edge) => ({
                key: edge.id,
                emphasis:
                    edge.id === highlight
                        ? 'active'
                        : usedEdges.includes(edge.id)
                          ? 'done'
                          : undefined,
                cells: {
                    edge: `{${labels.get(edge.source)}, ${labels.get(edge.target)}}`,
                    status: usedEdges.includes(edge.id)
                        ? `percorrida (${usedEdges.indexOf(edge.id) + 1}ª)`
                        : "em E'",
                },
            })),
        });

        const degreeTable = (): TraceTable => ({
            id: 'fleury-degrees',
            title: "Graus em G'",
            columns: [
                { key: 'vertex', label: 'Vértice' },
                { key: 'degree', label: "d(v) em G'" },
                { key: 'original', label: 'd(v) em G' },
            ],
            rows: ordered.map((node) => ({
                key: node.id,
                emphasis: node.id === current ? 'active' : undefined,
                cells: {
                    vertex: node.label,
                    degree: String(degreeOf(available, node.id)),
                    original: String(degreeOf(graph.edges, node.id)),
                },
            })),
        });

        const trailMetric = () => ({
            label: 'Trajeto',
            value: trail.map((id) => labels.get(id)).join(' / '),
        });

        const snapshot = (highlight?: string) => ({
            tables: [remainingTable(highlight), degreeTable()],
            metrics: [
                trailMetric(),
                { label: "Arestas restantes em E'", value: String(available.length) },
            ],
        });

        builder.setNode(start, 'active');
        builder.setNodeBadge(start, 'início');

        builder.commit({
            title: `Inicialização: vértice inicial ${labels.get(start)}`,
            description: isEulerian
                ? `Todos os vértices têm grau par, portanto o grafo é euleriano e existe ciclo euleriano. G' começa igual a G e a caminhada parte de ${labels.get(start)}, escolhido livremente.`
                : `Há exatamente ${odd.length} vértices de grau ímpar (${odd
                      .map((node) => node.label)
                      .join(
                          ', '
                      )}), portanto o grafo é semi-euleriano. A caminhada precisa partir de um deles: ${labels.get(start)}.`,
            ...snapshot(),
        });

        while (available.length > 0) {
            const incident = available
                .filter((edge) => edge.source === current || edge.target === current)
                .sort((a, b) => {
                    const byLabel = compareLabels(
                        labels.get(otherEnd(a, current)) ?? '',
                        labels.get(otherEnd(b, current)) ?? ''
                    );
                    return byLabel !== 0 ? byLabel : a.weight - b.weight;
                });

            if (incident.length === 0) break;

            let chosen: GraphEdge;
            let reason: string;

            if (incident.length === 1) {
                chosen = incident[0];
                reason = `${labels.get(current)} tem apenas uma aresta disponível em G', então ela é percorrida mesmo sendo ponte.`;
            } else {
                const bridges = incident.filter((edge) => isBridge(available, edge, current));
                const safe = incident.find((edge) => !bridges.includes(edge));
                chosen = safe ?? incident[0];
                const bridgeLabels = bridges.map(
                    (edge) => `{${labels.get(current)}, ${labels.get(otherEnd(edge, current))}}`
                );
                reason = safe
                    ? bridges.length > 0
                        ? `Entre as ${incident.length} arestas disponíveis, ${bridgeLabels.join(', ')} ${bridges.length === 1 ? 'é ponte' : 'são pontes'} em G' e ${bridges.length === 1 ? 'é evitada' : 'são evitadas'}. Escolhe-se {${labels.get(current)}, ${labels.get(otherEnd(chosen, current))}}, que não é ponte.`
                        : `Nenhuma das ${incident.length} arestas disponíveis é ponte em G', então qualquer uma serve. Escolhe-se {${labels.get(current)}, ${labels.get(otherEnd(chosen, current))}}.`
                    : `Todas as arestas disponíveis são pontes em G', então uma delas precisa ser percorrida.`;
            }

            const next = otherEnd(chosen, current);
            builder.setEdge(chosen.id, 'active');
            builder.commit({
                title: `Analisa as arestas incidentes a ${labels.get(current)}`,
                description: reason,
                ...snapshot(chosen.id),
            });

            available = available.filter((edge) => edge.id !== chosen.id);
            usedEdges.push(chosen.id);
            trail.push(next);
            builder.setEdge(chosen.id, 'done');
            builder.setEdgeBadge(chosen.id, String(usedEdges.length));
            builder.setNode(current, 'done');
            builder.setNode(next, 'active');
            current = next;

            builder.commit({
                title: `Caminha para ${labels.get(next)}`,
                description: `A aresta é percorrida e removida de E': v ← ${labels.get(next)}. Restam ${available.length} aresta(s) em G'.`,
                ...snapshot(),
            });
        }

        builder.setNode(current, 'done');
        builder.setNodeBadge(current, 'fim');

        const closed = trail[0] === trail[trail.length - 1];
        const complete = usedEdges.length === graph.edges.length;
        const trailText = trail.map((id) => labels.get(id)).join(' / ');

        builder.commit({
            title: complete
                ? closed
                    ? 'Ciclo euleriano obtido'
                    : 'Trajeto euleriano obtido'
                : 'Caminhada interrompida',
            description: complete
                ? `E' ficou vazio: todas as ${graph.edges.length} arestas foram percorridas exatamente uma vez.`
                : `A caminhada terminou com ${available.length} aresta(s) ainda em E'.`,
            ...snapshot(),
        });

        const conclusions = [
            `${closed ? 'Ciclo' : 'Trajeto'} euleriano: ${trailText}.`,
            `Foram percorridas ${usedEdges.length} de ${graph.edges.length} aresta(s), cada uma exatamente uma vez.`,
        ];

        conclusions.push(
            isEulerian
                ? 'Todos os vértices têm grau par, portanto o grafo é euleriano: o trajeto é fechado e começa e termina no mesmo vértice.'
                : `O grafo tem exatamente dois vértices de grau ímpar (${odd
                      .map((node) => node.label)
                      .join(
                          ' e '
                      )}), portanto é semi-euleriano: o trajeto é aberto e começa e termina neles.`
        );

        return builder.build(conclusions);
    },
};
