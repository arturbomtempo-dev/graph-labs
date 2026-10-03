export interface FloydUpdateValues {
    i: string;
    j: string;
    k: string;
    viaFirst: string;
    viaSecond: string;
    total: string;
    previous: string;
    predecessor: string;
}

export const floydWarshall = {
    name: 'Floyd-Warshall algorithm',
    shortName: 'Floyd-Warshall',
    tagline:
        'All-pairs shortest paths through dynamic programming: round k allows vertex k as an intermediate.',
    complexity: 'O(n³)',
    constraints: [
        'Allows negative-weight edges',
        'Does not allow negative-weight cycles',
        'Computes every pair of vertices at once',
    ],
    reference: {
        idea: 'Dynamic programming over the set of allowed intermediate vertices. With the vertices numbered from 1 to n, distᵏ[i, j] is the distance between i and j using only vertices of { 1, 2, . . ., k } as intermediates.',
        pseudocode: [
            'Path length relaxation',
            '  distᵏ[i, j] = min( distᵏ⁻¹[i, j],',
            '                     distᵏ⁻¹[i, k] + distᵏ⁻¹[k, j] )',
            '  with dist⁰[i, j] = d   if (i, j) ∈ E(G); ∞ otherwise;',
            '                      ij',
            '  and dist⁰[i, i] = 0',
            '',
            'Floyd-Warshall algorithm',
            '  1. for i = 1, . . ., n do',
            '       for j = 1, . . ., n | j ≠ i do',
            '         dist[i, j] ← ∞; pred[i, j] ← null',
            '       dist[i, i] ← 0;   pred[i, i] ← i',
            '  2. for every edge (i, j) ∈ E(G) do',
            '       dist[i, j] ← d  ;  pred[i, j] ← i',
            '                     ij',
            '  3. for k = 1, . . ., n do     // each possible intermediate',
            '       for i = 1, . . ., n do',
            '         for j = 1, . . ., n do',
            '           if dist[i, j] > dist[i, k] + dist[k, j] then',
            '             dist[i, j] ← dist[i, k] + dist[k, j]',
            '             pred[i, j] ← pred[k, j]',
        ],
        invariant:
            'At the end of round k, dist[i, j] is the weight of the shortest path from i to j that uses only { 1, . . ., k } as intermediate vertices; pred[i, j] stores the second-to-last vertex of that path.',
        pitfalls: [
            'Swapping the loop order: k must be the outermost loop.',
            'Updating the predecessor with pred[i, k] instead of pred[k, j]: pred[i, j] is the second-to-last vertex of the path from i to j.',
            'A negative entry on the diagonal, that is, dist[i, i] < 0, indicates a negative-weight cycle.',
        ],
    },
    trace: {
        distMatrixTitle: 'dist matrix',
        predMatrixTitle: 'pred matrix',
        initTitle: 'Initial matrices (k = 0)',
        initDescription:
            'dist⁰[i, i] = 0, dist⁰[i, j] = dij for every edge (i, j) ∈ E(G) and ∞ for pairs with no direct connection. In pred, each pair joined by an edge gets i itself, since i is the second-to-last vertex of the direct path from i to j.',
        pivotDescription: (allowed: string, pivot: string) =>
            `Now the vertices { ${allowed} } can be used as intermediates. For every pair (i, j), check whether dist[i, j] > dist[i, ${pivot}] + dist[${pivot}, j].`,
        pivotMetric: 'Intermediate k',
        updateDescription: (values: FloydUpdateValues) =>
            `dist[${values.i}, ${values.k}] + dist[${values.k}, ${values.j}] = ${values.viaFirst} + ${values.viaSecond} = ${values.total}, smaller than ${values.previous}. pred[${values.i}, ${values.j}] ← pred[${values.k}, ${values.j}] = ${values.predecessor} is updated as well.`,
        noImprovementTitle: (pivot: string) => `No improvement with k = ${pivot}`,
        noImprovementDescription: (pivot: string) =>
            `No pair (i, j) shortens its distance by going through ${pivot}.`,
        negativeCycleBadge: 'cycle −',
        negativeCycleConclusion: (vertices: string) =>
            `Negative-weight cycle detected: dist[i, i] < 0 for ${vertices}. In this case there is no well-defined shortest path between the affected pairs.`,
        noNegativeCycleConclusion:
            'No diagonal entry became negative, so the graph has no negative-weight cycle.',
        pathConclusion: (start: string, end: string, path: string, weight: string) =>
            `Shortest path from ${start} to ${end}, recovered backwards through the pred matrix: ${path} (weight ${weight}).`,
        finalTitle: 'Final matrices',
        finalDescription:
            'After allowing every vertex as an intermediate, dist[i, j] holds the shortest distance between each pair of vertices and pred[i, j] lets you recover the paths.',
    },
};
