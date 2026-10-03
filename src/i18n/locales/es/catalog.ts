import type { Dictionary } from '@/i18n/dictionaries';

export const categories: Dictionary['categories'] = {
    search: 'Búsqueda en grafos',
    connectivity: 'Conectividad',
    eulerian: 'Grafos eulerianos',
    'spanning-tree': 'Árbol de expansión mínima',
    'shortest-path': 'Caminos mínimos',
    'max-flow': 'Flujo máximo',
    'topological-sort': 'Ordenación topológica',
    matching: 'Emparejamiento',
    coloring: 'Coloración',
};

export const presets: Dictionary['presets'] = {
    'weighted-undirected': {
        name: 'Red ponderada',
        description:
            'Grafo no dirigido y ponderado, con peso w(e) > 0 en cada arista: la base para el AEM (Prim y Kruskal) y para Dijkstra.',
    },
    'strongly-connected': {
        name: 'Grafo dirigido con ciclos',
        description:
            'Grafo dirigido con tres componentes fuertemente conexas, para el algoritmo de Kosaraju.',
    },
    'flow-network': {
        name: 'Red de flujo',
        description:
            'Red de flujo: grafo dirigido con capacidad u(e) en cada arista, de la fuente s = S al sumidero t = T.',
    },
    'negative-weights': {
        name: 'Pesos negativos',
        description:
            'Grafo dirigido con aristas de peso negativo y sin ciclos de peso negativo, para Bellman-Ford y Floyd-Warshall.',
    },
    unweighted: {
        name: 'Grafo simple',
        description:
            'Grafo simple no dirigido, sin pesos relevantes: ideal para las búsquedas en anchura y en profundidad.',
    },
    eulerian: {
        name: 'Grafo euleriano',
        description:
            'Ejemplo 1 de las diapositivas de grafos eulerianos: todos los vértices tienen grado par, así que existe un circuito euleriano.',
    },
    'semi-eulerian': {
        name: 'Grafo semieuleriano',
        description:
            'Ejemplo 2 de las diapositivas: exactamente dos vértices de grado impar (5 y 6), así que existe un camino euleriano abierto.',
    },
    bottleneck: {
        name: 'Red con cuello de botella',
        description:
            'La red de las diapositivas de Edmonds-Karp: dos aristas de capacidad 100 unidas por una de capacidad 1, que expone la debilidad de elegir caminos arbitrariamente.',
    },
    'precedence-dag': {
        name: 'Precedencia de actividades',
        description:
            'Grafo acíclico de las diapositivas de ordenación topológica: la fabricación de una estantería, desde comprar las tablas hasta transportarla.',
    },
    'blossom-matching': {
        name: 'Emparejamiento con flores',
        description:
            'Grafo general con dos ciclos de longitud impar: exige la contracción de flores (blossoms) del algoritmo de Edmonds.',
    },
    'vertex-coloring': {
        name: 'Coloración de vértices',
        description:
            'Grafo con χ(G) = 3 en el que el orden alfabético hace que el método voraz use 4 colores, mientras que Welsh-Powell encuentra 3.',
    },
    'welsh-powell-counterexample': {
        name: 'Contraejemplo de Welsh-Powell',
        description:
            'Grafo bipartito, luego χ(G) = 2, en el que Welsh-Powell aun así usa 3 colores. Es el contraejemplo de las diapositivas de coloración.',
    },
};
