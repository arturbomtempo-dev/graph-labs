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
        description: 'Grafo não direcionado com pesos, ideal para Prim, Kruskal e Dijkstra.',
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
        name: 'Dígrafo com ciclos',
        description: 'Grafo direcionado com três componentes fortemente conexas para Kosaraju.',
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
        description: 'Rede direcionada com capacidades, da fonte S ao sumidouro T.',
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
        name: 'Pesos negativos',
        description:
            'Dígrafo com arestas de peso negativo, sem ciclos negativos, para Bellman-Ford.',
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
        description: 'Grafo não direcionado sem pesos relevantes, bom para BFS e DFS.',
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
];
