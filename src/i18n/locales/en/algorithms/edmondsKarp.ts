import { plural } from '@/i18n/format';

export const edmondsKarp = {
    name: 'Edmonds-Karp algorithm',
    shortName: 'Edmonds-Karp',
    tagline:
        'An efficient implementation of Ford-Fulkerson: each iteration picks the shortest augmenting path, found by breadth-first search.',
    complexity: 'O(n · m² )',
    constraints: [
        'Requires a flow network: a directed graph with capacity u(e) > 0',
        'Requires a source s and a sink t',
        'Always picks the augmenting path with the fewest edges',
    ],
    reference: {
        idea: 'An efficient implementation of the Ford-Fulkerson method: each iteration selects the shortest augmenting path in the residual network, that is, the one with the fewest edges. That path is found with a breadth-first search.',
        pseudocode: [
            'Edmonds-Karp algorithm',
            '  1. for every edge e ∈ E(G) do  f(e) ← 0',
            '  2. Build the residual network G′(f)',
            '  3. while there is some augmenting path P in G′(f) do',
            '     a. Let P be the augmenting path in G′(f) with the fewest',
            '        edges   // found by breadth-first search',
            '     b. δ ← min { u (e) | e ∈ P }',
            '                   r',
            '     c. for each edge (v, w) ∈ P do',
            '        i.  if (v, w) is a forward edge then',
            '              f(v, w) ← f(v, w) + δ',
            '        ii. else',
            '              f(w, v) ← f(w, v) − δ',
            '     d. Update the residual network G′(f)',
        ],
        invariant:
            'The length of the chosen augmenting path never decreases from one iteration to the next. There are at most O(n·m) augmenting paths and each is found in O(m), hence O(n·m²).',
        pitfalls: [
            'Using depth-first search: you are back to the generic Ford-Fulkerson method, which is only pseudo-polynomial, O(m·f), with f equal to the maximum flow value.',
            'In the network with two edges of capacity 100 joined by one of capacity 1, an arbitrary choice may require 200 iterations; choosing the shortest path requires 2.',
            'Forgetting that the algorithm was published independently by Dinitz (1970) and by Edmonds and Karp (1972).',
        ],
    },
    trace: {
        methodName: 'The Edmonds-Karp algorithm',
        explainChoice: (path: string, edges: number) =>
            `A breadth-first search in G'(f) returns the augmenting path with the fewest edges: ${path}, with ${edges} ${plural(edges, 'edge', 'edges')}. This choice is what makes the algorithm polynomial.`,
    },
};
