import type { AlgorithmTexts } from '@/i18n/dictionaries';
import { plural } from '@/i18n/format';

const edgeKinds = {
    tree: 'Árvore (pai)',
    uncle: 'Tio',
    sibling: 'Irmão',
    cousin: 'Primo',
};

export const bfs: AlgorithmTexts['bfs'] = {
    name: 'Busca em Largura',
    shortName: 'BFS',
    tagline:
        'Escolhe sempre o vértice marcado menos recentemente alcançado, usando uma fila, e define o nível de cada vértice.',
    complexity: 'O(n + m)',
    constraints: [
        'Aceita arestas direcionadas e não direcionadas',
        'Ignora os pesos das arestas',
        'Classifica as arestas em pai, tio, irmão e primo',
    ],
    reference: {
        idea: 'Busca genérica em que, dentre todos os vértices marcados e incidentes a alguma aresta ainda não explorada, escolhe-se sempre o menos recentemente alcançado, critério implementado por uma fila. Cada vértice recebe um índice L[v] (ordem de descoberta) e um nível[v] (distância à raiz em número de arestas).',
        pseudocode: [
            'Inicialização / Chamada inicial',
            '  t ← 0; Fila ← ∅',
            '  para todo vértice v ∈ V(G) faça',
            '    L[v] ← 0; nível[v] ← 0; pai[v] ← nulo',
            '  enquanto existir algum vértice v tal que L[v] = 0 efetuar',
            '    t ← t + 1; L[v] ← t          // v é a raiz da busca',
            '    Fila.Insere(v)',
            '    Executar Busca_Largura()',
            '',
            'Busca_Largura()',
            '  enquanto not Fila.Vazia() efetuar',
            '    v ← Fila.Remove()',
            '    para todo vértice w ∈ Γ(v) faça',
            '      se L[w] = 0 então          // aresta de árvore (ou pai)',
            '        pai[w] ← v; nível[w] ← nível[v] + 1',
            '        t ← t + 1; L[w] ← t; Fila.Insere(w)',
            '      senão se nível[w] = nível[v] + 1 então',
            '        Visitar aresta de tio {v, w}',
            '      senão se nível[w] = nível[v] e pai[v] = pai[w] e L[w] > L[v] então',
            '        Visitar aresta de irmão {v, w}',
            '      senão se nível[w] = nível[v] e pai[v] ≠ pai[w] e L[w] > L[v] então',
            '        Visitar aresta de primo {v, w}',
        ],
        invariant:
            'nível[w] = nível[pai[w]] + 1 para todo w ≠ raiz. Assim, no momento em que w é marcado, nível[w] já é a distância (número de arestas) entre a raiz da busca e w.',
        pitfalls: [
            'Marcar o vértice (atribuir L[w]) apenas quando ele sai da fila, e não quando entra: o mesmo vértice acabaria enfileirado várias vezes.',
            'Esquecer a condição L[w] > L[v] ao classificar arestas de irmão e de primo: ela garante que cada aresta seja explorada uma única vez.',
            'Em grafo ponderado, a busca em largura só devolve caminho de peso mínimo se todos os pesos forem iguais; ela minimiza o número de arestas, não o peso.',
        ],
    },
    trace: {
        attributesTitle: 'Índice, nível e pai',
        levelColumn: 'nível',
        edgeKinds,
        levelBadge: (level) => `nível ${level}`,
        initDescription:
            'Todos os vértices começam não marcados: L[v] = 0, nível[v] = 0 e pai[v] = nulo. O contador global t começa em 0.',
        rootTitle: (vertex) => `Raiz da busca: ${vertex}`,
        newRootTitle: (vertex) => `Nova raiz: ${vertex}`,
        rootDescription: (vertex, index) =>
            `${vertex} é a raiz da busca: recebe L = ${index}, nível 0 e entra na fila.`,
        newRootDescription: (vertex) =>
            `${vertex} continua com L = 0 após a busca anterior, então inicia uma nova árvore de largura com nível 0.`,
        dequeueTitle: (vertex) => `Remove ${vertex} da fila`,
        dequeueDescription: (vertex, level) =>
            `${vertex} sai da fila (nível ${level}) e sua vizinhança Γ(${vertex}) passa a ser examinada em ordem alfabética.`,
        treeEdgeTitle: (from, to) => `Aresta de árvore (pai) {${from}, ${to}}`,
        treeEdgeDescription: (from, to, level, index) =>
            `${to} tinha L = 0, portanto é visitado pela 1ª vez: pai[${to}] = ${from}, nível = nível[${from}] + 1 = ${level} e L = ${index}. O vértice entra na fila.`,
        uncleReason: (from, to) => `nível[${to}] = nível[${from}] + 1, mas pai[${to}] ≠ ${from}`,
        sameLevelReason: (from, to, sameParent) =>
            `nível[${to}] = nível[${from}] e pai[${from}] ${sameParent ? '=' : '≠'} pai[${to}]`,
        classifiedTitle: (kind) => `Aresta de ${edgeKinds[kind].toLowerCase()}`,
        classifiedDescription: (from, to, reason, kind) =>
            `${to} já estava marcado, e ${reason}. Logo {${from}, ${to}} é aresta de ${edgeKinds[kind].toLowerCase()} e não pertence à árvore de largura.`,
        exploredTitle: (vertex) => `${vertex} explorado`,
        exploredDescription: (vertex) =>
            `Todas as arestas incidentes a ${vertex} foram exploradas, portanto o vértice está explorado.`,
        completeWithUnreachable: (count) =>
            `A fila está vazia. ${count} ${plural(count, 'vértice não foi alcançado', 'vértices não foram alcançados')} a partir da raiz, então a busca produziu mais de uma árvore de largura.`,
        completeAll: 'A fila está vazia e todos os vértices foram alcançados a partir da raiz.',
        visitOrderConclusion: (order) => `Ordem de visita: ${order}.`,
        treeConclusion: (count) =>
            `A árvore de largura é formada por todos os vértices e pelas arestas de árvore (ou pai), ${count} no total. nível[v] é a distância, em número de arestas, entre a raiz da busca e v.`,
        unreachableConclusion: (root, vertices) =>
            `Não alcançados a partir de ${root}: ${vertices}. Cada um deles iniciou uma nova árvore de largura.`,
        singleTreeConclusion:
            'Todos os vértices foram alcançados a partir da raiz: a busca produziu uma única árvore de largura.',
    },
};
