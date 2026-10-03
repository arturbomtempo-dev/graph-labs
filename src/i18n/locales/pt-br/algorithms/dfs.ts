import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

const edgeKinds = {
    tree: 'Árvore',
    back: 'Retorno',
    forward: 'Avanço',
    cross: 'Cruzamento',
};

export const dfs: AlgorithmTexts['dfs'] = {
    name: 'Busca em Profundidade',
    shortName: 'DFS',
    tagline:
        'Escolhe sempre o vértice marcado mais recentemente alcançado, registrando tempo de descoberta TD e tempo de término TT.',
    complexity: 'O(n + m)',
    constraints: [
        'Aceita arestas direcionadas e não direcionadas',
        'Em grafo não direcionado: arestas de árvore e de retorno',
        'Em grafo direcionado: árvore, retorno, avanço e cruzamento',
    ],
    reference: {
        idea: 'Busca genérica em que, dentre todos os vértices marcados e incidentes a alguma aresta ainda não explorada, escolhe-se sempre o mais recentemente alcançado. Cada vértice recebe um tempo de descoberta TD[v] e um tempo de término TT[v], marcados por um contador global t.',
        pseudocode: [
            'Inicialização / Chamada inicial',
            '  t ← 0',
            '  para todo vértice v ∈ V(G) faça',
            '    TD[v] ← 0; TT[v] ← 0; pai[v] ← nulo',
            '  enquanto existir algum vértice v tal que TD[v] = 0 efetuar',
            '    Executar Busca_Profundidade(v)   // v é a raiz da busca',
            '',
            'Busca_Profundidade(v)                 // grafo não direcionado',
            '  t ← t + 1; TD[v] ← t',
            '  para todo vértice w ∈ Γ(v) faça',
            '    se TD[w] = 0 então              // aresta de árvore',
            '      pai[w] ← v; Executar Busca_Profundidade(w)',
            '    senão se TT[w] = 0 e w ≠ pai[v] então',
            '      Visitar aresta de retorno {v, w}',
            '  t ← t + 1; TT[v] ← t',
            '',
            'Busca_Profundidade(v)                 // grafo direcionado',
            '  para todo vértice w ∈ Γ⁺(v) faça',
            '    se TD[w] = 0 então  aresta de árvore (v, w); pai[w] ← v; ...',
            '    senão se TT[w] = 0 então          aresta de retorno (v, w)',
            '    senão se TD[v] < TD[w] então      aresta de avanço (v, w)',
            '    senão                             aresta de cruzamento (v, w)',
        ],
        invariant:
            'Os intervalos de vida I(v) = [TD[v], TT[v]] são encaixados ou disjuntos, nunca se cruzam parcialmente. O vértice w é descendente de v se e somente se I(w) está contido em I(v).',
        pitfalls: [
            'Em grafo não direcionado só existem arestas de árvore e de retorno; avanço e cruzamento só aparecem em grafo direcionado.',
            'Esquecer a condição w ≠ pai[v]: a aresta usada para chegar em v não é aresta de retorno.',
            'Toda aresta de retorno evidencia um ciclo no grafo original. Em grafo direcionado, ela é a única evidência necessária.',
        ],
    },
    trace: {
        timesTitle: 'Tempos de descoberta e de término',
        discoveryColumn: 'TD',
        finishColumn: 'TT',
        edgeKinds,
        stackTitle: 'Pilha de recursão',
        initDescription:
            'Todos os vértices começam desmarcados (brancos): TD[v] = 0, TT[v] = 0 e pai[v] = nulo. O contador global t começa em 0.',
        discoverTitle: (vertex) => `Descobre ${vertex}`,
        discoverDescription: (vertex, time) =>
            `${vertex} passa a marcado (cinza) com TD = ${time} e entra na pilha de recursão.`,
        treeEdgeTitle: (pair) => `Aresta de árvore ${pair}`,
        treeEdgeDescription: (from, to) =>
            `TD[${to}] = 0, ou seja, ${to} é visitado pela 1ª vez: pai[${to}] = ${from} e a busca aprofunda por essa aresta.`,
        returnTitle: (vertex) => `Retorna para ${vertex}`,
        returnDescription: (vertex) =>
            `A chamada recursiva terminou; a busca volta a examinar os vizinhos de ${vertex}.`,
        backReasonDirected: (from, to) => `TT[${to}] = 0, logo ${to} é ancestral de ${from}`,
        forwardReason: (from, to) =>
            `TD[${from}] < TD[${to}], logo ${to} é descendente de ${from} sem ser seu filho`,
        crossReason: (from, to) => `${to} não é descendente nem ancestral de ${from}`,
        backReasonUndirected: (from, to) =>
            `TT[${to}] = 0 e ${to} ≠ pai[${from}], logo ${to} é ancestral de ${from} sem ser seu pai`,
        classifiedTitle: (kind) => `Aresta de ${edgeKinds[kind].toLowerCase()}`,
        classifiedDescription: (reason, pair, kind) =>
            `${reason}. Portanto ${pair} é classificada como aresta de ${edgeKinds[kind].toLowerCase()}.`,
        exploredTitle: (vertex) => `${vertex} explorado`,
        exploredDescription: (vertex, discovery, finish) =>
            `Toda a vizinhança de ${vertex} foi examinada: o vértice passa a explorado (preto) com TT = ${finish}. Seu intervalo de vida é I(${vertex}) = [${discovery}, ${finish}].`,
        newRootTitle: (vertex) => `Nova raiz: ${vertex}`,
        newRootDescription: (vertex) =>
            `TD[${vertex}] = 0 após a busca anterior, então ${vertex} vira raiz de uma nova árvore de profundidade.`,
        completeDescription: (treeEdges) =>
            `Todos os vértices estão explorados. ${plural(treeEdges, `A ${treeEdges} aresta de árvore forma`, `As ${treeEdges} arestas de árvore formam`)} a floresta de profundidade.`,
        visitOrderConclusion: (order) => `Ordem de visita: ${order}.`,
        countsConclusion: (treeEdges, backEdges) =>
            `Arestas de árvore: ${treeEdges}. Arestas de retorno: ${backEdges}.`,
        cycleConclusion: 'As arestas de retorno sempre representam um ciclo no grafo original.',
        acyclicConclusion: 'Não há arestas de retorno, logo o grafo é acíclico.',
        intervalsConclusion:
            'Os intervalos de vida I(v) = [TD[v], TT[v]] são encaixados: w é descendente de v se e somente se I(w) está contido em I(v).',
    },
};
