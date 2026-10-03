import type { RelaxationValues } from '../trace';

export const dijkstra = {
    name: "Dijkstra's algorithm",
    shortName: 'Dijkstra',
    tagline:
        '"Closes" one vertex per iteration, always the one with the smallest dist, and relaxes the tense edges leaving it.',
    complexity: 'O(n²)',
    constraints: [
        'Accepts directed and undirected edges',
        'Requires non-negative weights',
        'Based on the relaxation principle',
    ],
    reference: {
        idea: 'Solves the single-source shortest path problem from a root s. It relies on the relaxation principle and "closes" one vertex per iteration: it picks the not yet closed vertex with the smallest dist value and relaxes the tense edges leaving it.',
        pseudocode: [
            'Relaxation step',
            '  if dist[v] + d    < dist[w] then    // is edge (v, w) tense?',
            '                vw',
            '    dist[w] ← dist[v] + d',
            '                         vw',
            '    pred[w] ← v',
            '',
            "Dijkstra's algorithm",
            '  1. for every vertex v ∈ V(G) do',
            '       dist[v] ← ∞; pred[v] ← null',
            '  2. dist[s] ← 0        // s is the search root',
            '  3. S ← ∅              // set of closed vertices',
            '  4. while S ≠ V(G) do',
            '     a. Choose the vertex v ∉ S with the smallest dist[v]',
            '     b. S ← S ∪ { v }                  // "close" vertex v',
            '     c. for every vertex w ∈ Γ⁺(v) do',
            '          if dist[w] > dist[v] + d    then    // tense edge?',
            '                                  vw',
            '            dist[w] ← dist[v] + d',
            '                                 vw',
            '            pred[w] ← v',
        ],
        invariant:
            'For every v ∈ S, dist[v] is already the weight of the shortest path from the root to v. At the end, dist[ ] holds the weights of the shortest paths; the paths themselves are recovered through the predecessor list pred[ ].',
        pitfalls: [
            'Running the algorithm on a graph with a negative-weight edge: it fails. Reweighting by adding a constant to every edge can fail too.',
            'Reopening a vertex that already belongs to S: once closed, its dist never changes again.',
            'Assuming dist[ ] returns the paths: without pred[ ] you only get the weights.',
        ],
    },
    issues: {
        negativeWeights:
            "Dijkstra's algorithm fails with negative-weight edges: use Bellman-Ford instead. Reweighting by adding a constant to every edge can fail too.",
    },
    trace: {
        openSetTitle: 'Vertices not yet closed',
        initDescription: (root: string) =>
            `dist[${root}] = 0 at the root and dist[v] = ∞ for every other vertex, with pred[v] = null. No vertex has been closed yet, that is, S = ∅.`,
        unreachableTitle: 'Unreachable vertices',
        unreachableDescription:
            'Every vertex not yet closed has dist = ∞: they cannot be reached from the root and the algorithm stops.',
        closeTitle: (vertex: string, distance: string) => `Close ${vertex} with dist = ${distance}`,
        closeDescription: (vertex: string) =>
            `${vertex} is the not yet closed vertex with the smallest dist, so it joins S. Since there are no negative weights, dist[${vertex}] is already the final weight of the shortest path from the root.`,
        notTenseTitle: (from: string, to: string) => `Edge (${from}, ${to}) is not tense`,
        notTenseDescription: (values: RelaxationValues) =>
            `dist[${values.from}] + d = ${values.fromDistance} + ${values.weight} = ${values.candidate} is not smaller than dist[${values.to}] = ${values.current}, so nothing changes.`,
        pathHighlighted: (target: string) =>
            `The shortest path to ${target} is highlighted in purple.`,
        allClosedDescription: 'Every reachable vertex was closed with its final dist value.',
        predConclusion:
            'dist[ ] holds only the weights of the shortest paths; the paths themselves are recovered by following the predecessor list pred[ ].',
    },
};
