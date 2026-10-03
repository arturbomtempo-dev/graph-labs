import { plural } from '@/i18n/format';

export const kosaraju = {
    name: "Kosaraju's algorithm",
    shortName: 'Kosaraju',
    tagline:
        'Finds the strongly connected components with two depth-first searches: one on G and another on the reverse graph Gᴿ.',
    complexity: 'O(n + m)',
    constraints: ['Requires a directed graph', 'Ignores edge weights'],
    reference: {
        idea: 'A first depth-first search on G records the finish times f. The second search, run on the reverse graph Gᴿ and taking vertices in decreasing order of f, produces a forest in which each tree is exactly one strongly connected component.',
        pseudocode: [
            "Kosaraju's algorithm",
            '  1. Run a depth-first search on G',
            '       // store the finish time f of every vertex',
            '  2. Build the reverse (or transpose) graph Gᴿ',
            '       // if (v, w) ∈ E(G) then (w, v) ∈ E(Gᴿ)',
            '  3. Run a depth-first search on Gᴿ taking the vertices',
            '     in decreasing order of f',
            '',
            '  Each tree of the depth-first forest obtained in step 3',
            '  corresponds to a strongly connected component of G.',
        ],
        invariant:
            'The decreasing order of finish times guarantees that the search on Gᴿ started at a vertex never escapes the strongly connected component it belongs to.',
        pitfalls: [
            'Forgetting to build the reverse graph Gᴿ before the second search.',
            'Running the second search in increasing order of f instead of decreasing order.',
            'Mixing up the three levels of connectivity of a connected directed graph: weakly connected (the underlying graph is connected), unilaterally connected (for every pair, one reaches the other) and strongly connected (all mutually reachable).',
        ],
    },
    trace: {
        finishStackTitle: 'Finish stack',
        componentsTitle: 'Strongly connected components',
        step1Title: 'Step 1: depth-first search on G',
        step1Description:
            'The first depth-first search traverses G and pushes each vertex onto the stack the moment its finish time f is set.',
        visitTitle: (vertex: string) => `Visit ${vertex}`,
        visitDescription: (vertex: string) =>
            `${vertex} is marked in the first depth-first search.`,
        finishTitle: (vertex: string) => `Finish ${vertex}`,
        finishDescription: (vertex: string) =>
            `${vertex} has no more neighbors to explore: its f is set and it is pushed onto the stack. The top of the stack is the vertex with the largest f.`,
        step2Title: 'Step 2: build the reverse graph Gᴿ',
        step2Description: (order: string) =>
            `Every edge is reversed: if (v, w) ∈ E(G) then (w, v) ∈ E(Gᴿ). The second search will traverse Gᴿ in decreasing order of f: ${order}.`,
        joinTitle: (vertex: string, component: string) => `${vertex} joins ${component}`,
        joinDescription: (vertex: string) =>
            `In Gᴿ, ${vertex} is reachable from the root of this depth-first tree, so it belongs to the same strongly connected component.`,
        newComponentTitle: (vertex: string) => `New component from ${vertex}`,
        newComponentDescription: (vertex: string, component: string) =>
            `${vertex} is the unmarked vertex with the largest f, so it is the root of a new depth-first tree in Gᴿ, which corresponds to component ${component}.`,
        step3Title: 'Step 3: components identified',
        step3Description: (count: number) =>
            `Each tree of the depth-first forest obtained in Gᴿ is a strongly connected component: G has ${count} strongly connected ${plural(count, 'component', 'components')}. The highlighted edges join vertices of the same component.`,
        countConclusion: (count: number) =>
            `${count} strongly connected ${plural(count, 'component was', 'components were')} found.`,
        stronglyConnectedConclusion:
            'Every vertex is mutually reachable, so G is strongly connected.',
        notStronglyConnectedConclusion:
            'Since there is more than one strongly connected component, G is not strongly connected: some pair of vertices cannot reach each other.',
    },
};
