import type { Graph } from './types';

export interface GraphPreset {
    id: string;
    name: string;
    description: string;
    suggestedAlgorithms: string[];
    build: () => Graph;
}

interface NodeSeed {
    label: string;
    x: number;
    y: number;
}

interface EdgeSeed {
    source: string;
    target: string;
    weight: number;
    directed: boolean;
}

function assemble(nodes: NodeSeed[], edges: EdgeSeed[]): Graph {
    return {
        nodes: nodes.map((node) => ({ id: node.label, label: node.label, x: node.x, y: node.y })),
        edges: edges.map((edge, index) => ({
            id: `preset_${index}_${edge.source}_${edge.target}`,
            source: edge.source,
            target: edge.target,
            weight: edge.weight,
            directed: edge.directed,
        })),
    };
}

export const presets: GraphPreset[] = [
    {
        id: 'weighted-undirected',
        name: 'Rede ponderada',
        description:
            'Grafo não direcionado e ponderado, com custo c_e > 0 em cada aresta: base para AGM (Prim e Kruskal) e para Dijkstra.',
        suggestedAlgorithms: ['prim', 'kruskal', 'dijkstra'],
        build: () =>
            assemble(
                [
                    { label: 'A', x: 120, y: 90 },
                    { label: 'B', x: 320, y: 60 },
                    { label: 'C', x: 220, y: 220 },
                    { label: 'D', x: 470, y: 170 },
                    { label: 'E', x: 350, y: 330 },
                    { label: 'F', x: 130, y: 340 },
                ],
                [
                    { source: 'A', target: 'B', weight: 7, directed: false },
                    { source: 'A', target: 'C', weight: 3, directed: false },
                    { source: 'B', target: 'C', weight: 4, directed: false },
                    { source: 'B', target: 'D', weight: 2, directed: false },
                    { source: 'C', target: 'D', weight: 6, directed: false },
                    { source: 'C', target: 'E', weight: 5, directed: false },
                    { source: 'C', target: 'F', weight: 8, directed: false },
                    { source: 'D', target: 'E', weight: 1, directed: false },
                    { source: 'E', target: 'F', weight: 9, directed: false },
                ]
            ),
    },
    {
        id: 'strongly-connected',
        name: 'Grafo direcionado com circuitos',
        description:
            'Grafo direcionado com três componentes fortemente conexos (f-conexos), para o método de Kosaraju.',
        suggestedAlgorithms: ['kosaraju', 'dfs'],
        build: () =>
            assemble(
                [
                    { label: 'A', x: 110, y: 90 },
                    { label: 'B', x: 290, y: 90 },
                    { label: 'C', x: 200, y: 220 },
                    { label: 'D', x: 450, y: 170 },
                    { label: 'E', x: 610, y: 90 },
                    { label: 'F', x: 610, y: 260 },
                    { label: 'G', x: 430, y: 350 },
                ],
                [
                    { source: 'A', target: 'B', weight: 1, directed: true },
                    { source: 'B', target: 'C', weight: 1, directed: true },
                    { source: 'C', target: 'A', weight: 1, directed: true },
                    { source: 'B', target: 'D', weight: 1, directed: true },
                    { source: 'D', target: 'E', weight: 1, directed: true },
                    { source: 'E', target: 'F', weight: 1, directed: true },
                    { source: 'F', target: 'D', weight: 1, directed: true },
                    { source: 'F', target: 'G', weight: 1, directed: true },
                    { source: 'G', target: 'G', weight: 1, directed: true },
                ].filter((edge) => edge.source !== edge.target)
            ),
    },
    {
        id: 'flow-network',
        name: 'Rede de fluxo',
        description:
            'Rede de fluxo: grafo direcionado com capacidade u(e) em cada aresta, da fonte s = S ao sumidouro t = T.',
        suggestedAlgorithms: ['ford-fulkerson'],
        build: () =>
            assemble(
                [
                    { label: 'S', x: 90, y: 210 },
                    { label: 'A', x: 270, y: 90 },
                    { label: 'B', x: 270, y: 330 },
                    { label: 'C', x: 470, y: 90 },
                    { label: 'D', x: 470, y: 330 },
                    { label: 'T', x: 650, y: 210 },
                ],
                [
                    { source: 'S', target: 'A', weight: 16, directed: true },
                    { source: 'S', target: 'B', weight: 13, directed: true },
                    { source: 'A', target: 'C', weight: 12, directed: true },
                    { source: 'B', target: 'A', weight: 4, directed: true },
                    { source: 'B', target: 'D', weight: 14, directed: true },
                    { source: 'C', target: 'D', weight: 9, directed: true },
                    { source: 'C', target: 'T', weight: 20, directed: true },
                    { source: 'D', target: 'T', weight: 4, directed: true },
                ]
            ),
    },
    {
        id: 'negative-weights',
        name: 'Custos negativos',
        description:
            'Grafo direcionado com arestas de custo negativo e sem ciclo de custo negativo, para Bellman-Ford e Floyd-Warshall.',
        suggestedAlgorithms: ['bellman-ford', 'floyd-warshall'],
        build: () =>
            assemble(
                [
                    { label: 'S', x: 110, y: 200 },
                    { label: 'A', x: 290, y: 90 },
                    { label: 'B', x: 290, y: 310 },
                    { label: 'C', x: 480, y: 200 },
                    { label: 'D', x: 650, y: 200 },
                ],
                [
                    { source: 'S', target: 'A', weight: 6, directed: true },
                    { source: 'S', target: 'B', weight: 7, directed: true },
                    { source: 'A', target: 'B', weight: 8, directed: true },
                    { source: 'A', target: 'C', weight: -4, directed: true },
                    { source: 'B', target: 'C', weight: 9, directed: true },
                    { source: 'B', target: 'D', weight: -3, directed: true },
                    { source: 'C', target: 'D', weight: 2, directed: true },
                ]
            ),
    },
    {
        id: 'unweighted',
        name: 'Grafo simples',
        description:
            'Grafo simples não direcionado, sem custos relevantes: bom para as buscas em largura e em profundidade.',
        suggestedAlgorithms: ['bfs', 'dfs'],
        build: () =>
            assemble(
                [
                    { label: 'A', x: 300, y: 70 },
                    { label: 'B', x: 150, y: 190 },
                    { label: 'C', x: 450, y: 190 },
                    { label: 'D', x: 80, y: 330 },
                    { label: 'E', x: 250, y: 330 },
                    { label: 'F', x: 430, y: 340 },
                    { label: 'G', x: 590, y: 330 },
                ],
                [
                    { source: 'A', target: 'B', weight: 1, directed: false },
                    { source: 'A', target: 'C', weight: 1, directed: false },
                    { source: 'B', target: 'D', weight: 1, directed: false },
                    { source: 'B', target: 'E', weight: 1, directed: false },
                    { source: 'C', target: 'F', weight: 1, directed: false },
                    { source: 'C', target: 'G', weight: 1, directed: false },
                    { source: 'E', target: 'F', weight: 1, directed: false },
                ]
            ),
    },
    {
        id: 'euleriano',
        name: 'Grafo euleriano',
        description:
            'Exemplo 1 do deck de grafos eulerianos: todos os vértices têm grau par, então existe ciclo euleriano.',
        suggestedAlgorithms: ['fleury'],
        build: () =>
            assemble(
                [
                    { label: '1', x: 110, y: 90 },
                    { label: '2', x: 300, y: 90 },
                    { label: '3', x: 110, y: 250 },
                    { label: '4', x: 300, y: 250 },
                    { label: '5', x: 490, y: 170 },
                    { label: '6', x: 300, y: 400 },
                    { label: '7', x: 500, y: 380 },
                ],
                [
                    { source: '1', target: '2', weight: 1, directed: false },
                    { source: '2', target: '3', weight: 1, directed: false },
                    { source: '3', target: '4', weight: 1, directed: false },
                    { source: '4', target: '2', weight: 1, directed: false },
                    { source: '2', target: '5', weight: 1, directed: false },
                    { source: '5', target: '6', weight: 1, directed: false },
                    { source: '6', target: '4', weight: 1, directed: false },
                    { source: '4', target: '5', weight: 1, directed: false },
                    { source: '5', target: '7', weight: 1, directed: false },
                    { source: '7', target: '6', weight: 1, directed: false },
                    { source: '6', target: '3', weight: 1, directed: false },
                    { source: '3', target: '1', weight: 1, directed: false },
                ]
            ),
    },
    {
        id: 'semi-euleriano',
        name: 'Grafo semi-euleriano',
        description:
            'Exemplo 2 do deck: exatamente dois vértices de grau ímpar (5 e 6), então existe trajeto euleriano aberto.',
        suggestedAlgorithms: ['fleury'],
        build: () =>
            assemble(
                [
                    { label: '1', x: 110, y: 120 },
                    { label: '2', x: 300, y: 120 },
                    { label: '3', x: 110, y: 300 },
                    { label: '4', x: 300, y: 300 },
                    { label: '5', x: 490, y: 200 },
                    { label: '6', x: 300, y: 450 },
                ],
                [
                    { source: '5', target: '6', weight: 1, directed: false },
                    { source: '6', target: '4', weight: 1, directed: false },
                    { source: '4', target: '2', weight: 1, directed: false },
                    { source: '2', target: '5', weight: 1, directed: false },
                    { source: '5', target: '4', weight: 1, directed: false },
                    { source: '4', target: '3', weight: 1, directed: false },
                    { source: '3', target: '2', weight: 1, directed: false },
                    { source: '2', target: '1', weight: 1, directed: false },
                    { source: '1', target: '3', weight: 1, directed: false },
                    { source: '3', target: '6', weight: 1, directed: false },
                ]
            ),
    },
    {
        id: 'gargalo',
        name: 'Rede com gargalo',
        description:
            'Rede do deck de Edmonds-Karp: duas arestas de capacidade 100 ligadas por uma de capacidade 1, que expõe a fragilidade da escolha arbitrária de caminho.',
        suggestedAlgorithms: ['ford-fulkerson', 'edmonds-karp', 'dinic'],
        build: () =>
            assemble(
                [
                    { label: 'S', x: 110, y: 220 },
                    { label: 'A', x: 330, y: 100 },
                    { label: 'B', x: 330, y: 340 },
                    { label: 'T', x: 550, y: 220 },
                ],
                [
                    { source: 'S', target: 'A', weight: 100, directed: true },
                    { source: 'S', target: 'B', weight: 100, directed: true },
                    { source: 'A', target: 'B', weight: 1, directed: true },
                    { source: 'A', target: 'T', weight: 100, directed: true },
                    { source: 'B', target: 'T', weight: 100, directed: true },
                ]
            ),
    },
    {
        id: 'dag-precedencia',
        name: 'Precedência de atividades',
        description:
            'Grafo acíclico do deck de ordenação topológica: a fabricação de uma estante, de comprar as tábuas até transportá-la.',
        suggestedAlgorithms: ['kahn', 'topologica-dfs'],
        build: () =>
            assemble(
                [
                    { label: 'A', x: 100, y: 110 },
                    { label: 'B', x: 100, y: 320 },
                    { label: 'C', x: 280, y: 110 },
                    { label: 'D', x: 450, y: 110 },
                    { label: 'E', x: 450, y: 320 },
                    { label: 'F', x: 630, y: 320 },
                ],
                [
                    { source: 'A', target: 'C', weight: 1, directed: true },
                    { source: 'C', target: 'D', weight: 1, directed: true },
                    { source: 'D', target: 'E', weight: 1, directed: true },
                    { source: 'B', target: 'E', weight: 1, directed: true },
                    { source: 'E', target: 'F', weight: 1, directed: true },
                ]
            ),
    },
    {
        id: 'emparelhamento',
        name: 'Emparelhamento com botões',
        description:
            'Grafo genérico com dois ciclos de tamanho ímpar: exige a contração de botões (blossoms) do método de Edmonds.',
        suggestedAlgorithms: ['edmonds'],
        build: () =>
            assemble(
                [
                    { label: 'A', x: 100, y: 130 },
                    { label: 'B', x: 100, y: 330 },
                    { label: 'C', x: 270, y: 230 },
                    { label: 'D', x: 440, y: 230 },
                    { label: 'E', x: 560, y: 100 },
                    { label: 'F', x: 560, y: 360 },
                    { label: 'G', x: 720, y: 360 },
                    { label: 'H', x: 860, y: 250 },
                ],
                [
                    { source: 'A', target: 'B', weight: 1, directed: false },
                    { source: 'B', target: 'C', weight: 1, directed: false },
                    { source: 'C', target: 'A', weight: 1, directed: false },
                    { source: 'C', target: 'D', weight: 1, directed: false },
                    { source: 'D', target: 'E', weight: 1, directed: false },
                    { source: 'E', target: 'F', weight: 1, directed: false },
                    { source: 'F', target: 'D', weight: 1, directed: false },
                    { source: 'F', target: 'G', weight: 1, directed: false },
                    { source: 'G', target: 'H', weight: 1, directed: false },
                ]
            ),
    },
    {
        id: 'coloracao',
        name: 'Coloração de vértices',
        description:
            'Grafo com χ(G) = 3 em que a ordem alfabética faz o método guloso gastar 4 cores, enquanto Welsh-Powell encontra 3.',
        suggestedAlgorithms: ['coloracao-gulosa', 'welsh-powell'],
        build: () =>
            assemble(
                [
                    { label: 'A', x: 110, y: 400 },
                    { label: 'B', x: 130, y: 130 },
                    { label: 'C', x: 330, y: 90 },
                    { label: 'D', x: 330, y: 400 },
                    { label: 'E', x: 520, y: 240 },
                ],
                [
                    { source: 'A', target: 'D', weight: 1, directed: false },
                    { source: 'B', target: 'C', weight: 1, directed: false },
                    { source: 'B', target: 'E', weight: 1, directed: false },
                    { source: 'C', target: 'D', weight: 1, directed: false },
                    { source: 'C', target: 'E', weight: 1, directed: false },
                    { source: 'D', target: 'E', weight: 1, directed: false },
                ]
            ),
    },
    {
        id: 'coloracao-contraexemplo',
        name: 'Contraexemplo de Welsh-Powell',
        description:
            'Grafo bipartido, logo χ(G) = 2, em que Welsh-Powell mesmo assim usa 3 cores. É o contraexemplo do deck de coloração.',
        suggestedAlgorithms: ['welsh-powell', 'coloracao-gulosa'],
        build: () =>
            assemble(
                [
                    { label: 'A', x: 110, y: 90 },
                    { label: 'B', x: 430, y: 90 },
                    { label: 'C', x: 110, y: 250 },
                    { label: 'D', x: 430, y: 250 },
                    { label: 'E', x: 110, y: 410 },
                    { label: 'F', x: 430, y: 410 },
                ],
                [
                    { source: 'A', target: 'D', weight: 1, directed: false },
                    { source: 'A', target: 'F', weight: 1, directed: false },
                    { source: 'C', target: 'B', weight: 1, directed: false },
                    { source: 'C', target: 'F', weight: 1, directed: false },
                    { source: 'E', target: 'B', weight: 1, directed: false },
                    { source: 'E', target: 'D', weight: 1, directed: false },
                ]
            ),
    },
];
