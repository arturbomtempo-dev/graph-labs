import { plural } from '@/i18n/format';

export const fordFulkerson = {
    name: 'Ford-Fulkerson method',
    shortName: 'Ford-Fulkerson',
    tagline:
        "While some augmenting path exists in G'(f), pushes the bottleneck δ along it and updates the residual network.",
    complexity: 'O(m · f) with integer capacities',
    constraints: [
        'Requires a flow network: a directed graph with capacity u(e) > 0',
        'Requires a source s and a sink t',
        'The augmenting path is chosen arbitrarily',
    ],
    reference: {
        idea: 'While there is an augmenting path from the source s to the sink t in the residual network G′(f), push as much as possible along it, the bottleneck δ, and update the residual network. Backward edges allow earlier pushes to be undone.',
        pseudocode: [
            'Residual network G′(f): V(G′) = V(G) and, for e = (v, w) ∈ E:',
            '  if f(e) < u(e): forward edge (v, w) with u (e) = u(e) − f(e)',
            '                                            r',
            '  if f(e) > 0:    backward edge (w, v) with capacity f(e)',
            '',
            'Ford-Fulkerson method',
            '  1. for every edge e ∈ E(G) do  f(e) ← 0',
            '  2. Build the residual network G′(f)',
            '  3. while there is an augmenting path P in G′(f) do',
            '     a. δ ← min { u (e) | e ∈ P }        // "bottleneck" of P',
            '                   r',
            '     b. for each edge (v, w) ∈ P do',
            '        i.  if (v, w) is a forward edge then',
            '              f(v, w) ← f(v, w) + δ      // increase flow',
            '        ii. else',
            '              f(w, v) ← f(w, v) − δ      // decrease flow',
            '     c. Update the residual network G′(f)',
        ],
        invariant:
            'The flow f always satisfies the capacity constraint, 0 ≤ f(e) ≤ u(e), and flow conservation at every internal node. By the max-flow min-cut theorem, at the end the flow value equals the capacity of the minimum s-t cut.',
        pitfalls: [
            'Forgetting to create the backward edge in the residual network, which prevents undoing pushes made in earlier iterations.',
            'Choosing arbitrary augmenting paths: with irrational capacities the method may never terminate. Always choosing the augmenting path with the fewest edges (breadth-first search) is the Edmonds-Karp algorithm.',
            'Assuming the minimum cut is any cut: in the optimal solution, S is the set of vertices reachable from the source s in the final residual network.',
        ],
    },
    trace: {
        methodName: 'The Ford-Fulkerson method',
        explainChoice: (path: string, edges: number) =>
            `The method imposes no selection rule: it only needs some augmenting path P in G'(f). A depth-first search found ${path}, with ${edges} ${plural(edges, 'edge', 'edges')}.`,
    },
};
