import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

export const prim: AlgorithmTexts['prim'] = {
    name: 'Método de Prim',
    shortName: 'Prim',
    tagline:
        'Inclui vértices um a um: a cada passo acrescenta a aresta de menor peso entre V(T) e os vértices ainda não selecionados.',
    complexity: 'O(m log n)',
    constraints: [
        'Exige grafo não direcionado',
        'Exige grafo ponderado com peso w(e) > 0',
        'Só existe árvore geradora se o grafo for conexo',
    ],
    reference: {
        idea: 'Constrói a AGM incluindo vértices, um a um, de forma gulosa. Partindo de uma raiz r, a cada passo acrescenta a aresta de menor peso com uma extremidade em V(T) (já selecionados) e a outra fora de V(T).',
        pseudocode: [
            'Método de Prim',
            '  1. Escolher um vértice qualquer r ∈ V(G)   // raiz',
            '  2. V(T) ← { r }        // conj. de vértices selecionados',
            '  3. E(T) ← ∅            // conj. de arestas da AGM',
            '  4. enquanto V(T) ≠ V(G) efetuar',
            '     a. Encontrar a aresta {v, w} de menor peso tal que',
            '        v ∈ V(T) e w ∉ V(T)',
            '     b. Acrescentar w a V(T)',
            '     c. Acrescentar {v, w} a E(T)',
            '',
            '  Peso total: C(T) = Σ  w  , para e ∈ E(T)',
            '                         e',
        ],
        invariant:
            'A cada iteração, T = (V(T), E(T)) é uma árvore e está contida em alguma árvore geradora mínima de G.',
        pitfalls: [
            'Comparar o peso da aresta com a distância acumulada desde a raiz em vez do peso da própria aresta, o que transformaria Prim em Dijkstra.',
            'Aplicar Prim em grafo direcionado: o problema correto passa a ser o de arborescência de peso mínimo.',
            'Em grafo desconexo não existe árvore geradora: um grafo G possui árvore geradora se e somente se G for conexo.',
        ],
    },
    trace: {
        keysTitle: 'Menor peso até V(T)',
        vertexColumn: 'Vértice w',
        minWeightColumn: 'menor peso',
        inTreeStatus: 'em V(T)',
        outsideTreeStatus: 'fora de V(T)',
        initDescription: (root) =>
            `Escolhida a raiz ${root}: V(T) = { ${root} } e E(T) = ∅. Nenhum outro vértice tem ainda uma aresta conhecida até V(T), por isso o menor peso é ∞.`,
        disconnectedTitle: 'Grafo desconexo',
        disconnectedDescription:
            'Não existe aresta entre V(T) e os vértices restantes: o grafo é desconexo. Como um grafo só possui árvore geradora se for conexo, o resultado cobre apenas o componente conexo da raiz.',
        addTitle: (vertex) => `Acrescenta ${vertex} a V(T)`,
        addDescription: (from, to, weight) =>
            `A aresta de menor peso com uma extremidade em V(T) e a outra fora é {${from}, ${to}}, de peso ${weight}. Ela é acrescentada a E(T) e ${to} passa a pertencer a V(T).`,
        rootDescription: (vertex) =>
            `${vertex} é a raiz r e inicia V(T), ainda sem nenhuma aresta em E(T).`,
        candidateTitle: (vertex) => `Nova aresta candidata para ${vertex}`,
        candidateDescription: (from, to, weight, previous) =>
            `A aresta {${from}, ${to}} tem peso ${weight}, menor que o menor peso conhecido até aqui (${previous}). Ela passa a ser a candidata a ligar ${to} a V(T).`,
        keepTitle: (vertex) => `Mantém a candidata de ${vertex}`,
        keepDescription: (from, to, weight, previous) =>
            `A aresta {${from}, ${to}} tem peso ${weight}, que não é menor que o menor peso já conhecido (${previous}).`,
        completeTitle: 'AGM concluída',
        completeDescription: (edges, total) =>
            `V(T) = V(G) e a árvore possui ${edges} ${plural(edges, 'aresta', 'arestas')}, com peso total C(T) = ${total}.`,
        totalConclusion: (total) => `Peso total da árvore geradora mínima: C(T) = ${total}.`,
        edgesConclusion: (edges, vertices) =>
            `|E(T)| = ${edges}. Uma árvore geradora de ${vertices} ${plural(vertices, 'vértice', 'vértices')} tem exatamente |V| − 1 = ${Math.max(vertices - 1, 0)} ${plural(Math.max(vertices - 1, 0), 'aresta', 'arestas')}.`,
        disconnectedConclusion:
            'O grafo é desconexo, portanto o resultado é a AGM apenas do componente conexo que contém a raiz.',
        spanningConclusion: 'Todos os vértices foram selecionados: T é uma árvore geradora de G.',
    },
};
