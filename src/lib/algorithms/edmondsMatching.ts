import { hasDirectedEdges, nodeLabelMap, orderedNodes } from '../graph/helpers';
import { createTraceBuilder } from '../graph/trace';
import type { AlgorithmDefinition, NodeId, TraceTable } from '../graph/types';
import { requireEdges, requireNodes } from './shared';

export const edmondsMatching: AlgorithmDefinition = {
    id: 'edmonds',
    name: 'Método de Edmonds',
    shortName: 'Edmonds',
    category: 'Emparelhamento',
    tagline:
        'Busca caminhos M-aumentantes entre vértices expostos, contraindo os botões (blossoms) que aparecem, até que não exista mais nenhum.',
    complexity: 'O(n² · m)',
    needsStart: false,
    needsEnd: false,
    constraints: [
        'Exige grafo não direcionado',
        'Ignora os pesos das arestas',
        'Trata grafo genérico, não apenas bipartido',
    ],
    validate: (context) => {
        const errors = [...requireNodes(context), ...requireEdges(context)];
        if (hasDirectedEdges(context.graph)) {
            errors.push(
                'Emparelhamento é definido para grafo não direcionado: converta todas as arestas para não direcionadas.'
            );
        }
        return errors;
    },
    run: ({ graph, order }) => {
        const builder = createTraceBuilder(graph);
        const labels = nodeLabelMap(graph);
        const nodes = orderedNodes(graph, order);
        const size = nodes.length;
        const indexOf = new Map<NodeId, number>(nodes.map((node, position) => [node.id, position]));
        const name = (i: number) => labels.get(nodes[i].id) ?? '';

        const adjacency: number[][] = nodes.map(() => []);
        graph.edges.forEach((edge) => {
            const a = indexOf.get(edge.source);
            const b = indexOf.get(edge.target);
            if (a === undefined || b === undefined || a === b) return;
            if (!adjacency[a].includes(b)) adjacency[a].push(b);
            if (!adjacency[b].includes(a)) adjacency[b].push(a);
        });
        adjacency.forEach((list) => list.sort((x, y) => x - y));

        const edgeBetween = (a: number, b: number) =>
            graph.edges.find(
                (edge) =>
                    (indexOf.get(edge.source) === a && indexOf.get(edge.target) === b) ||
                    (indexOf.get(edge.source) === b && indexOf.get(edge.target) === a)
            );

        const match = new Array<number>(size).fill(-1);

        const parent = new Array<number>(size).fill(-1);
        const base = new Array<number>(size).fill(0);

        const matchingTable = (): TraceTable => ({
            id: 'edmonds-matching',
            title: 'Emparelhamento M',
            columns: [
                { key: 'vertex', label: 'Vértice' },
                { key: 'partner', label: 'Parceiro em M' },
                { key: 'status', label: 'Situação' },
            ],
            rows: nodes.map((node, i) => ({
                key: node.id,
                emphasis: match[i] !== -1 ? 'done' : undefined,
                cells: {
                    vertex: node.label,
                    partner: match[i] === -1 ? '-' : name(match[i]),
                    status: match[i] === -1 ? 'exposto' : 'coberto',
                },
            })),
        });

        const paint = () => {
            let pair = 0;
            const seen = new Set<number>();
            builder.clearNodeGroups();
            graph.edges.forEach((edge) => builder.setEdge(edge.id, 'idle'));
            nodes.forEach((node, i) => {
                if (match[i] === -1) {
                    builder.setNode(node.id, 'idle');
                    builder.setNodeBadge(node.id, 'exposto');
                    return;
                }
                builder.setNode(node.id, 'done');
                builder.setNodeBadge(node.id, name(match[i]));
                if (seen.has(i)) return;
                seen.add(i);
                seen.add(match[i]);
                builder.setNodeGroup(node.id, pair);
                builder.setNodeGroup(nodes[match[i]].id, pair);
                const edge = edgeBetween(i, match[i]);
                if (edge) builder.setEdge(edge.id, 'done');
                pair += 1;
            });
        };

        const exposedCount = () => match.filter((value) => value === -1).length;

        const metrics = () => [
            { label: '|M|', value: String(match.filter((value) => value !== -1).length / 2) },
            { label: 'Vértices expostos', value: String(exposedCount()) },
        ];

        paint();
        builder.commit({
            title: 'Inicialização: M = ∅',
            description:
                'O emparelhamento começa vazio, portanto todos os vértices estão expostos (livres). Enquanto existir caminho M-aumentante, M pode crescer.',
            tables: [matchingTable()],
            metrics: metrics(),
        });

        const lowestCommonBase = (a: number, b: number): number => {
            const visited = new Array<boolean>(size).fill(false);
            let cursor = a;
            for (;;) {
                cursor = base[cursor];
                visited[cursor] = true;
                if (match[cursor] === -1) break;
                cursor = parent[match[cursor]];
            }
            cursor = b;
            for (;;) {
                cursor = base[cursor];
                if (visited[cursor]) return cursor;
                cursor = parent[match[cursor]];
            }
        };

        const markPath = (from: number, blossomBase: number, child: number, mark: boolean[]) => {
            let v = from;
            let next = child;
            while (base[v] !== blossomBase) {
                mark[base[v]] = true;
                mark[base[match[v]]] = true;
                parent[v] = next;
                next = match[v];
                v = parent[match[v]];
            }
        };

        const findAugmentingPath = (root: number): number => {
            const even = new Array<boolean>(size).fill(false);
            parent.fill(-1);
            for (let i = 0; i < size; i += 1) base[i] = i;

            even[root] = true;
            const queue: number[] = [root];
            let head = 0;

            while (head < queue.length) {
                const v = queue[head];
                head += 1;

                for (const to of adjacency[v]) {
                    if (base[v] === base[to] || match[v] === to) continue;

                    const closesBlossom =
                        to === root || (match[to] !== -1 && parent[match[to]] !== -1);

                    if (closesBlossom) {
                        const blossomBase = lowestCommonBase(v, to);
                        const mark = new Array<boolean>(size).fill(false);
                        markPath(v, blossomBase, to, mark);
                        markPath(to, blossomBase, v, mark);

                        const contracted: number[] = [];
                        for (let i = 0; i < size; i += 1) {
                            if (!mark[base[i]]) continue;
                            base[i] = blossomBase;
                            contracted.push(i);
                            if (!even[i]) {
                                even[i] = true;
                                queue.push(i);
                            }
                        }

                        if (contracted.length > 0) {
                            const edge = edgeBetween(v, to);
                            if (edge) builder.setEdge(edge.id, 'reject');
                            contracted.forEach((i) => {
                                builder.setNode(nodes[i].id, 'reject');
                                builder.setNodeBadge(nodes[i].id, `botão ${name(blossomBase)}`);
                            });

                            builder.commit({
                                title: `Botão detectado e contraído em ${name(blossomBase)}`,
                                description: `A aresta {${name(v)}, ${name(to)}} liga dois vértices a distância par da raiz da mesma árvore, formando um ciclo de tamanho ímpar. O botão { ${contracted
                                    .map((i) => name(i))
                                    .join(
                                        ', '
                                    )} } é contraído em um pseudovértice com base ${name(blossomBase)}; todos os seus vértices passam a contar como pares.`,
                                tables: [matchingTable()],
                                metrics: metrics(),
                            });
                        }
                        continue;
                    }

                    if (parent[to] !== -1) continue;

                    parent[to] = v;

                    if (match[to] === -1) {
                        const edge = edgeBetween(v, to);
                        if (edge) builder.setEdge(edge.id, 'active');
                        builder.setNode(nodes[to].id, 'path');
                        builder.commit({
                            title: `Caminho M-aumentante encontrado até ${name(to)}`,
                            description: `${name(to)} está exposto e foi alcançado por um caminho M-alternante que parte da raiz exposta ${name(root)}. Como o caminho começa e termina em vértices expostos, ele é M-aumentante, e todo caminho M-aumentante tem tamanho ímpar.`,
                            tables: [matchingTable()],
                            metrics: metrics(),
                        });
                        return to;
                    }

                    const partner = match[to];
                    even[partner] = true;
                    queue.push(partner);

                    const treeEdge = edgeBetween(v, to);
                    if (treeEdge) builder.setEdge(treeEdge.id, 'frontier');
                    builder.setNode(nodes[to].id, 'frontier');
                    builder.setNode(nodes[partner].id, 'active');

                    builder.commit({
                        title: `Floresta cresce por {${name(v)}, ${name(to)}} e {${name(to)}, ${name(partner)}} ∈ M`,
                        description: `${name(to)} ainda não estava na floresta. A aresta {${name(v)}, ${name(to)}} entra na árvore e, junto com ela, a aresta {${name(to)}, ${name(partner)}} de M. ${name(to)} fica a distância ímpar da raiz e ${name(partner)} a distância par, podendo continuar a busca.`,
                        tables: [matchingTable()],
                        metrics: metrics(),
                    });
                }
            }

            return -1;
        };

        const augment = (endpoint: number): string[] => {
            const changed: string[] = [];
            let v = endpoint;
            while (v !== -1) {
                const pv = parent[v];
                const ppv = match[pv];
                match[v] = pv;
                match[pv] = v;
                changed.push(`{${name(v)}, ${name(pv)}}`);
                v = ppv;
            }
            return changed.reverse();
        };

        let augmentations = 0;

        for (let root = 0; root < size; root += 1) {
            if (match[root] !== -1) continue;

            paint();
            builder.setNode(nodes[root].id, 'active');
            builder.setNodeBadge(nodes[root].id, 'raiz');
            builder.commit({
                title: `Árvore M-alternante com raiz em ${name(root)}`,
                description: `${name(root)} está exposto, então uma árvore M-alternante é iniciada nele. A busca procura um caminho M-alternante que termine em outro vértice exposto.`,
                tables: [matchingTable()],
                metrics: metrics(),
            });

            const endpoint = findAugmentingPath(root);

            if (endpoint === -1) {
                paint();
                builder.commit({
                    title: `Nenhum caminho M-aumentante a partir de ${name(root)}`,
                    description: `A árvore M-alternante com raiz em ${name(root)} foi totalmente explorada sem alcançar outro vértice exposto. ${name(root)} permanece exposto no emparelhamento final.`,
                    tables: [matchingTable()],
                    metrics: metrics(),
                });
                continue;
            }

            const changed = augment(endpoint);
            augmentations += 1;
            paint();

            builder.commit({
                title: `M ← M ⊕ EP, com |M| = ${match.filter((value) => value !== -1).length / 2}`,
                description: `A diferença simétrica retira de M as arestas do caminho que estavam em M e acrescenta as que não estavam. As arestas de M ao longo do caminho passam a ser ${changed.join(', ')}, e ${name(root)} e ${name(endpoint)} deixam de estar expostos. Pelo teorema de Berge, M cresceu em exatamente uma aresta.`,
                tables: [matchingTable()],
                metrics: metrics(),
            });
        }

        paint();
        const matchedPairs = match.filter((value) => value !== -1).length / 2;
        const exposed = nodes.filter((_, i) => match[i] === -1);

        builder.commit({
            title: 'Emparelhamento máximo obtido',
            description: `Não existe mais caminho M-aumentante em G, portanto, pelo teorema de Berge, M tem cardinalidade máxima: |M| = ${matchedPairs}.`,
            tables: [matchingTable()],
            metrics: metrics(),
        });

        const pairs: string[] = [];
        const seen = new Set<number>();
        nodes.forEach((_, i) => {
            if (match[i] === -1 || seen.has(i)) return;
            seen.add(i);
            seen.add(match[i]);
            pairs.push(`{${name(i)}, ${name(match[i])}}`);
        });

        return builder.build([
            `Emparelhamento máximo com |M| = ${matchedPairs}: ${pairs.join(', ') || '-'}.`,
            `Foram realizados ${augmentations} aumento(s) a partir de M = ∅. Cada caminho M-aumentante encontrado aumenta |M| em exatamente uma unidade.`,
            exposed.length === 0
                ? 'Todos os vértices estão cobertos, portanto M é um casamento perfeito (ou completo).'
                : `Restam ${exposed.length} vértice(s) exposto(s) (${exposed
                      .map((node) => node.label)
                      .join(
                          ', '
                      )}): emparelhamento máximo não implica em todos os vértices saturados.`,
        ]);
    },
};
