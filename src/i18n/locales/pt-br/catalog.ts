import type { Dictionary } from '@/i18n/dictionaries';

export const categories: Dictionary['categories'] = {
    search: 'Busca em grafos',
    connectivity: 'Conectividade',
    eulerian: 'Grafos eulerianos',
    'spanning-tree': 'Árvore geradora mínima',
    'shortest-path': 'Caminho mínimo',
    'max-flow': 'Fluxo máximo',
    'topological-sort': 'Ordenação topológica',
    matching: 'Emparelhamento',
    coloring: 'Coloração',
};

export const presets: Dictionary['presets'] = {
    'weighted-undirected': {
        name: 'Rede ponderada',
        description:
            'Grafo não direcionado e ponderado, com peso w(e) > 0 em cada aresta: base para AGM (Prim e Kruskal) e para Dijkstra.',
    },
    'strongly-connected': {
        name: 'Grafo direcionado com circuitos',
        description:
            'Grafo direcionado com três componentes fortemente conexos (f-conexos), para o método de Kosaraju.',
    },
    'flow-network': {
        name: 'Rede de fluxo',
        description:
            'Rede de fluxo: grafo direcionado com capacidade u(e) em cada aresta, da fonte s = S ao sumidouro t = T.',
    },
    'negative-weights': {
        name: 'Pesos negativos',
        description:
            'Grafo direcionado com arestas de peso negativo e sem ciclo de peso negativo, para Bellman-Ford e Floyd-Warshall.',
    },
    unweighted: {
        name: 'Grafo simples',
        description:
            'Grafo simples não direcionado, sem pesos relevantes: bom para as buscas em largura e em profundidade.',
    },
    eulerian: {
        name: 'Grafo euleriano',
        description:
            'Exemplo 1 do deck de grafos eulerianos: todos os vértices têm grau par, então existe ciclo euleriano.',
    },
    'semi-eulerian': {
        name: 'Grafo semi-euleriano',
        description:
            'Exemplo 2 do deck: exatamente dois vértices de grau ímpar (5 e 6), então existe trajeto euleriano aberto.',
    },
    bottleneck: {
        name: 'Rede com gargalo',
        description:
            'Rede do deck de Edmonds-Karp: duas arestas de capacidade 100 ligadas por uma de capacidade 1, que expõe a fragilidade da escolha arbitrária de caminho.',
    },
    'precedence-dag': {
        name: 'Precedência de atividades',
        description:
            'Grafo acíclico do deck de ordenação topológica: a fabricação de uma estante, de comprar as tábuas até transportá-la.',
    },
    'blossom-matching': {
        name: 'Emparelhamento com botões',
        description:
            'Grafo genérico com dois ciclos de tamanho ímpar: exige a contração de botões (blossoms) do método de Edmonds.',
    },
    'vertex-coloring': {
        name: 'Coloração de vértices',
        description:
            'Grafo com χ(G) = 3 em que a ordem alfabética faz o método guloso gastar 4 cores, enquanto Welsh-Powell encontra 3.',
    },
    'welsh-powell-counterexample': {
        name: 'Contraexemplo de Welsh-Powell',
        description:
            'Grafo bipartido, logo χ(G) = 2, em que Welsh-Powell mesmo assim usa 3 cores. É o contraexemplo do deck de coloração.',
    },
};
