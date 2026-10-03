export const topologicalDfs = {
    name: 'Topological sort via depth-first search',
    shortName: 'Topological sort (DFS)',
    tagline:
        'Described by Tarjan in 1976: inserts each vertex at the front of the result only after visiting every vertex that depends on it.',
    complexity: 'O(n + m)',
    constraints: [
        'Requires a directed graph',
        'A topological order only exists in an acyclic graph',
        'Meeting a temporary mark again reveals a cycle',
    ],
    reference: {
        idea: 'An alternative based on depth-first search, described by Tarjan in 1976. Each vertex is inserted into the result only after every vertex that depends on it, and insertion happens at the front of the list, hence the reverse order.',
        pseudocode: [
            'Depth-first search method',
            '  1. for every vertex v do Mark[v] ← 0',
            '  2. Topo_Order ← ∅',
            '  3. while there is some vertex v such that Mark[v] = 0',
            '     do Visit(v)',
            '',
            'Visit(v)',
            '  1. if Mark[v] ≠ 2 then        // if v is not permanent',
            '     a. if Mark[v] = 1 then CYCLE     // temporary mark',
            '     b. Mark[v] ← 1                   // temporary mark',
            '     c. for every vertex w ∈ Γ⁺(v) do Visit(w)',
            '     d. Mark[v] ← 2                   // permanent mark',
            '     e. Topo_Order.InsertAtFront(v)',
        ],
        invariant:
            'When v receives its permanent mark, every vertex reachable from v is already in Topo_Order. Since v is inserted at the front, it precedes all of them in the order.',
        pitfalls: [
            'Inserting at the end instead of the front: the order comes out reversed. The correct order is the reverse of the insertion order, equivalent to decreasing order of finish time.',
            'Not distinguishing temporary from permanent marks: only meeting a temporary mark again reveals a cycle; a permanent mark indicates a vertex already resolved.',
            'Confusing it with the ordinary depth-first forest: what matters here is the finishing order, not the tree.',
        ],
    },
    trace: {
        marksTitle: 'Vertex marks',
        markColumn: 'Mark[v]',
        markLabels: ['0 (unmarked)', '1 (temporary)', '2 (permanent)'],
        callsTitle: 'Visit( ) calls',
        initDescription:
            'Every vertex starts unmarked, that is, Mark[v] = 0, and the result Topo_Order starts empty.',
        cycleTitle: (vertex: string) => `Cycle: ${vertex} already has a temporary mark`,
        cycleDescription: (vertex: string) =>
            `Visit(${vertex}) was called while Mark[${vertex}] = 1, that is, the vertex is still in the current call chain. This means there is a path from ${vertex} back to itself: the graph has a cycle and admits no topological order.`,
        temporaryBadge: 'temp',
        visitTitle: (vertex: string) => `Visit(${vertex})`,
        visitDescription: (vertex: string) =>
            `${vertex} receives a temporary mark (Mark = 1) and its neighborhood Γ⁺(${vertex}) starts being visited.`,
        prependTitle: (vertex: string) => `${vertex} enters the front of Topo_Order`,
        prependDescription: (vertex: string) =>
            `Every vertex that depends on ${vertex} has already been visited, so it receives a permanent mark (Mark = 2) and is inserted at the front of the result, hence the reverse insertion order.`,
        impossibleTitle: 'Topological sort impossible',
        impossibleDescription: (from: string, to: string) =>
            `Edge (${from}, ${to}) closes a cycle, because ${to} still had a temporary mark when it was reached again.`,
        cycleConclusion: (from: string, to: string) =>
            `The graph has a cycle: ${to} was reached again with a temporary mark, from ${from}.`,
        completeDescription: (order: string) =>
            `Every vertex received a permanent mark. Reading Topo_Order from front to back: ${order}.`,
        reverseConclusion:
            'Each vertex was inserted at the front of the result, so the order is the reverse of the insertion order, equivalent to decreasing order of depth-first finish time.',
        acyclicConclusion:
            'No temporary mark was met again, so the graph is acyclic. The topological order may not be unique.',
    },
};
