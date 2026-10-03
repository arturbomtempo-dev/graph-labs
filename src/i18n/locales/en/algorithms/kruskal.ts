import { plural } from '@/i18n/format';

export const kruskal = {
    name: "Kruskal's algorithm",
    shortName: 'Kruskal',
    tagline:
        'Adds edges, not vertices: sorts the edges by non-decreasing weight and accepts each one that does not form a cycle with those already in E(T).',
    complexity: 'O(m log m)',
    constraints: [
        'Requires an undirected graph',
        'Requires a weighted graph with w(e) > 0',
        'On a disconnected graph it produces a minimum spanning forest',
    ],
    reference: {
        idea: 'Builds the MST by adding edges, not vertices as in Prim. It sorts the edges in non-decreasing order of weight and, at each iteration, accepts the lightest edge that does not form a cycle with those already in E(T).',
        pseudocode: [
            "Kruskal's algorithm",
            '  1. Sort the edges in non-decreasing order of weight:',
            '     e₁, e₂, e₃, . . .',
            '  2. V(T) ← V(G)      // every vertex joins the MST',
            '  3. E(T) ← { e₁ }',
            '  4. j ← 2            // edge to be examined',
            '  5. while | E(T) | < | V(T) | − 1 do',
            '     a. if the edge e  does not form a cycle with the edges of E(T)',
            '                     j',
            '        then Add e  to E(T)',
            '                  j',
            '     b. j ← j + 1',
        ],
        invariant:
            'At every iteration, T = (V(T), E(T)) is a spanning forest contained in some minimum spanning tree of G.',
        pitfalls: [
            'Assuming that n − 1 iterations are enough: at least n − 1 are needed, but there may be more, since edges that form a cycle have to be skipped.',
            'Accepting an edge whose endpoints are already connected by edges of E(T): it would close a cycle.',
            'On a disconnected graph the result is a minimum spanning forest, not a spanning tree.',
        ],
    },
    trace: {
        edgesTitle: 'Edges in non-decreasing order of weight',
        decisions: {
            accepted: 'joins E(T)',
            rejected: 'forms a cycle, skipped',
            examining: 'being examined',
            waiting: 'waiting',
        },
        setsTitle: 'Components of the partial forest T',
        initDescription: (edges: number) =>
            `V(T) receives every vertex of V(G) and E(T) starts empty, so each vertex is an isolated component of the forest. The ${edges} ${plural(edges, 'edge was', 'edges were')} sorted in non-decreasing order of weight.`,
        examineTitle: (edge: string, weight: string) => `Examine ${edge} with weight ${weight}`,
        cycleDescription:
            'Both endpoints are already connected by edges of E(T), so this edge would form a cycle.',
        noCycleDescription:
            'The endpoints lie in different components of the partial forest, so the edge does not form a cycle with the edges of E(T).',
        rejectedTitle: 'Edge skipped (forms a cycle)',
        acceptedTitle: 'Edge added to E(T)',
        rejectedDescription:
            'The edge is skipped and the partial forest stays unchanged. That is why more than n − 1 iterations may be needed.',
        acceptedDescription: (from: string, to: string) =>
            `The edge joins E(T) and the components of ${from} and ${to} merge into one.`,
        completeTitle: 'Run complete',
        completeDescription: (target: number, total: string) =>
            `| E(T) | = | V(T) | − 1 = ${target}: the loop ends with total weight C(T) = ${total}.`,
        incompleteDescription: (target: number, total: string) =>
            `Every edge was examined without reaching | V(T) | − 1 = ${target} edges, so the graph is disconnected. Total weight C(T) = ${total}.`,
        weightConclusion: (total: string, accepted: number, rejected: number) =>
            `Total weight: C(T) = ${total}, with ${accepted} ${plural(accepted, 'edge', 'edges')} in E(T) and ${rejected} ${plural(rejected, 'edge', 'edges')} skipped for forming a cycle.`,
        iterationsConclusion: (iterations: number, accepted: number) =>
            `It took ${iterations} ${plural(iterations, 'iteration', 'iterations')} to accept ${accepted} ${plural(accepted, 'edge', 'edges')}: since edges that form a cycle must be skipped, n − 1 iterations may not be enough.`,
        treeConclusion: 'The graph is connected, so the result is a minimum spanning tree (MST).',
        forestConclusion: (components: number) =>
            `The graph has ${components} connected components, so the result is a minimum spanning forest.`,
    },
};
