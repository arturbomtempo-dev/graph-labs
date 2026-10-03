export const categories = {
    search: 'Graph search',
    connectivity: 'Connectivity',
    eulerian: 'Eulerian graphs',
    'spanning-tree': 'Minimum spanning tree',
    'shortest-path': 'Shortest paths',
    'max-flow': 'Maximum flow',
    'topological-sort': 'Topological sorting',
    matching: 'Matching',
    coloring: 'Coloring',
};

export const presets = {
    'weighted-undirected': {
        name: 'Weighted network',
        description:
            'Undirected weighted graph, with weight w(e) > 0 on every edge: the base for MSTs (Prim and Kruskal) and for Dijkstra.',
    },
    'strongly-connected': {
        name: 'Directed graph with cycles',
        description:
            "Directed graph with three strongly connected components, for Kosaraju's algorithm.",
    },
    'flow-network': {
        name: 'Flow network',
        description:
            'Flow network: a directed graph with capacity u(e) on every edge, from the source s = S to the sink t = T.',
    },
    'negative-weights': {
        name: 'Negative weights',
        description:
            'Directed graph with negative-weight edges and no negative-weight cycle, for Bellman-Ford and Floyd-Warshall.',
    },
    unweighted: {
        name: 'Simple graph',
        description:
            'Simple undirected graph with no relevant weights: a good fit for breadth-first and depth-first search.',
    },
    eulerian: {
        name: 'Eulerian graph',
        description:
            'Example 1 from the Eulerian graphs lecture: every vertex has even degree, so an Eulerian circuit exists.',
    },
    'semi-eulerian': {
        name: 'Semi-Eulerian graph',
        description:
            'Example 2 from the lecture: exactly two vertices of odd degree (5 and 6), so an open Eulerian trail exists.',
    },
    bottleneck: {
        name: 'Network with a bottleneck',
        description:
            'The network from the Edmonds-Karp lecture: two edges of capacity 100 joined by one of capacity 1, which exposes the weakness of choosing paths arbitrarily.',
    },
    'precedence-dag': {
        name: 'Activity precedence',
        description:
            'Acyclic graph from the topological sorting lecture: building a bookshelf, from buying the boards to moving it.',
    },
    'blossom-matching': {
        name: 'Matching with blossoms',
        description:
            "General graph with two odd-length cycles: it requires the blossom contraction of Edmonds' algorithm.",
    },
    'vertex-coloring': {
        name: 'Vertex coloring',
        description:
            'Graph with χ(G) = 3 in which alphabetical order makes the greedy method use 4 colors, while Welsh-Powell finds 3.',
    },
    'welsh-powell-counterexample': {
        name: 'Welsh-Powell counterexample',
        description:
            'Bipartite graph, so χ(G) = 2, on which Welsh-Powell still uses 3 colors. It is the counterexample from the coloring lecture.',
    },
};
