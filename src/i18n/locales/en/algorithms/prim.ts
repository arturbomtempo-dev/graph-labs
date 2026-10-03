import { plural } from '@/i18n/format';

export const prim = {
    name: "Prim's algorithm",
    shortName: 'Prim',
    tagline:
        'Adds vertices one by one: at each step it takes the lightest edge between V(T) and the vertices not yet selected.',
    complexity: 'O(m log n)',
    constraints: [
        'Requires an undirected graph',
        'Requires a weighted graph with w(e) > 0',
        'A spanning tree only exists if the graph is connected',
    ],
    reference: {
        idea: 'Builds the MST greedily by adding vertices one at a time. Starting from a root r, at each step it adds the lightest edge with one endpoint in V(T) (already selected) and the other outside V(T).',
        pseudocode: [
            "Prim's algorithm",
            '  1. Choose any vertex r ∈ V(G)              // root',
            '  2. V(T) ← { r }        // set of selected vertices',
            '  3. E(T) ← ∅            // set of MST edges',
            '  4. while V(T) ≠ V(G) do',
            '     a. Find the lightest edge {v, w} such that',
            '        v ∈ V(T) and w ∉ V(T)',
            '     b. Add w to V(T)',
            '     c. Add {v, w} to E(T)',
            '',
            '  Total weight: C(T) = Σ  w  , for e ∈ E(T)',
            '                           e',
        ],
        invariant:
            'At every iteration, T = (V(T), E(T)) is a tree and is contained in some minimum spanning tree of G.',
        pitfalls: [
            "Comparing the edge weight with the accumulated distance from the root instead of the edge's own weight, which would turn Prim into Dijkstra.",
            'Applying Prim to a directed graph: the correct problem then becomes the minimum-weight arborescence.',
            'A disconnected graph has no spanning tree: a graph G has a spanning tree if and only if G is connected.',
        ],
    },
    trace: {
        keysTitle: 'Lightest edge to V(T)',
        vertexColumn: 'Vertex w',
        minWeightColumn: 'min weight',
        inTreeStatus: 'in V(T)',
        outsideTreeStatus: 'outside V(T)',
        initDescription: (root: string) =>
            `Root ${root} chosen: V(T) = { ${root} } and E(T) = ∅. No other vertex has a known edge to V(T) yet, so its min weight is ∞.`,
        disconnectedTitle: 'Disconnected graph',
        disconnectedDescription:
            'There is no edge between V(T) and the remaining vertices: the graph is disconnected. Since a graph only has a spanning tree if it is connected, the result covers only the connected component of the root.',
        addTitle: (vertex: string) => `Add ${vertex} to V(T)`,
        addDescription: (from: string, to: string, weight: string) =>
            `The lightest edge with one endpoint in V(T) and the other outside is {${from}, ${to}}, with weight ${weight}. It is added to E(T) and ${to} now belongs to V(T).`,
        rootDescription: (vertex: string) =>
            `${vertex} is the root r and starts V(T), with no edge in E(T) yet.`,
        candidateTitle: (vertex: string) => `New candidate edge for ${vertex}`,
        candidateDescription: (from: string, to: string, weight: string, previous: string) =>
            `Edge {${from}, ${to}} has weight ${weight}, lower than the lightest weight known so far (${previous}). It becomes the candidate to connect ${to} to V(T).`,
        keepTitle: (vertex: string) => `Keep the candidate for ${vertex}`,
        keepDescription: (from: string, to: string, weight: string, previous: string) =>
            `Edge {${from}, ${to}} has weight ${weight}, which is not lower than the lightest weight already known (${previous}).`,
        completeTitle: 'MST complete',
        completeDescription: (edges: number, total: string) =>
            `V(T) = V(G) and the tree has ${edges} ${plural(edges, 'edge', 'edges')}, with total weight C(T) = ${total}.`,
        totalConclusion: (total: string) =>
            `Total weight of the minimum spanning tree: C(T) = ${total}.`,
        edgesConclusion: (edges: number, vertices: number) =>
            `|E(T)| = ${edges}. A spanning tree on ${vertices} ${plural(vertices, 'vertex', 'vertices')} has exactly |V| − 1 = ${Math.max(vertices - 1, 0)} ${plural(Math.max(vertices - 1, 0), 'edge', 'edges')}.`,
        disconnectedConclusion:
            'The graph is disconnected, so the result is the MST of the connected component that contains the root only.',
        spanningConclusion: 'Every vertex was selected: T is a spanning tree of G.',
    },
};
